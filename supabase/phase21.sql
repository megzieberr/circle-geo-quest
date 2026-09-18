-- ============================================================
--  CIRCLE QUEST — PHASE 21 MIGRATION
--  THE ROSTER SPLIT: Grade 11 and Grade 12 on separate boards.
--  Plan of record: ROSTER-SPLIT-PLAN.md (Megan's rulings, 2026-09-10).
-- ------------------------------------------------------------
--  WHAT THIS DOES
--    • students gets a `cohort` column: 'gr11' (default, everyone
--      already on the roster) or 'gr12'. Nothing else about a learner
--      changes — progress, XP, badges, passwords all travel with them.
--    • The ISOLATION IS SERVER-SIDE. cgg_leaderboard and
--      cgg_weekly_results read the CALLER'S OWN cohort out of the
--      students table and filter to it. A matric who opens the plain
--      Gr11 link still only ever sees Gr12 on every board, because the
--      link never decides what a logged-in learner sees — their row
--      does. Only the name picker (cgg_list_students) is filtered by
--      the link, and that is the known, accepted soft spot in the plan.
--    • Champion and the weekly reset become per class, stored as
--      separate app_config keys:
--          gr11 : 'champion_name'       'weekly_anchor'        (unchanged)
--          gr12 : 'champion_name:gr12'  'weekly_anchor:gr12'   (new)
--      The gr11 keys keep their exact old names, so the existing
--      champion pick and weekly anchor survive this migration untouched.
--    • Admin RPCs return `cohort` per row and admin.js does the class
--      filtering in the browser (plan step 5) — except the weekly
--      winners board, which is a per-class SCREENSHOT and so is
--      filtered server-side by cgg_admin_weekly_results(pw, cohort).
--    • Two new admin RPCs: cgg_admin_set_cohort (the "→ Gr12" button)
--      and a cohort-aware cgg_admin_add_student.
--
--  HOW TO RUN
--    Supabase dashboard -> SQL Editor -> New query -> paste this WHOLE
--    file -> Run. Then run the two statements under "AFTER THE
--    MIGRATION" at the bottom (the learner move) by hand.
--
--  SAFE to run on the live database while learners play:
--    • The new column has a NOT NULL DEFAULT 'gr11', so every existing
--      learner lands in Gr11 exactly where they already are, and every
--      board keeps showing exactly what it showed a minute ago.
--    • No table is dropped, no data is deleted, no XP is touched.
--    • Idempotent: "add column if not exists" + "create or replace"
--      everywhere, so running it twice does no harm.
--
--  ⚠ SIGNATURES THAT CHANGE (old shape dropped, new shape created in
--    the same run — the two are seconds apart and this app caches
--    nothing, sw.js included, so no stale client can be left calling
--    the old shape):
--        cgg_list_students()            -> (p_cohort text default 'gr11')
--        cgg_admin_weekly_results(text) -> (text, text)
--        cgg_admin_set_champion(text,text)  -> (text, text, text)
--        cgg_admin_reset_weekly(text)       -> (text, text)
--        cgg_admin_add_student(text,text)   -> (text, text, text)
--    They are DROPPED first on purpose. Postgres cannot tell
--    f(text) from f(text, text default …) when you call it with one
--    argument — it raises "function is not unique" — and PostgREST
--    calls everything by named argument, which hits exactly that.
--    Leaving the old one in place would break the live dashboard.
--
--  NOT touched: the push cron, the daily challenge, the checker, the
--  Investigation Station, cgg_submit_round and every other per-learner
--  RPC. A learner's own play never needs to know about cohorts.
--
--  Grants are re-declared after EVERY create-or-replace (house style).
--  The students table itself stays fully revoked from anon/authenticated
--  (schema.sql), so the new column needs no column-level grant — the
--  anon key can still only EXECUTE these functions, never read a table.
--
--  Rollback notes are at the bottom.
-- ============================================================


-- ============================================================
--  PART A — the column
-- ============================================================
alter table public.students
  add column if not exists cohort text not null default 'gr11';

-- The check lives in its own guarded block so re-running the file does
-- not error on an already-present constraint.
do $$
begin
  if not exists (
    select 1 from pg_constraint
     where conrelid = 'public.students'::regclass
       and conname  = 'students_cohort_check'
  ) then
    alter table public.students
      add constraint students_cohort_check check (cohort in ('gr11','gr12'));
  end if;
end $$;

-- 22 rows today, but every board query now filters on it.
create index if not exists students_cohort_idx on public.students (cohort);


-- ============================================================
--  PART B — helpers
-- ============================================================

-- Normalise anything the client sends into a cohort we recognise.
-- Unknown / null / '' all fall back to 'gr11', which is the class that
-- was here first: a broken or truncated link can only ever land a
-- learner on the board they were already on, never on the other class's.
create or replace function public._cgg_cohort(p_cohort text)
returns text language sql immutable set search_path = public, extensions as $$
  select case when lower(btrim(coalesce(p_cohort, ''))) = 'gr12' then 'gr12' else 'gr11' end;
$$;

-- app_config key for a cohort: gr11 keeps the ORIGINAL key name (so the
-- champion pick and weekly anchor already stored keep working), gr12
-- gets the same key with ':gr12' appended.
create or replace function public._cgg_cfg_key(p_base text, p_cohort text)
returns text language sql immutable set search_path = public, extensions as $$
  select case when public._cgg_cohort(p_cohort) = 'gr11' then p_base
              else p_base || ':' || public._cgg_cohort(p_cohort) end;
$$;

-- Monday 00:00, or the class's own weekly anchor if the teacher reset
-- that class's board later than that. One anchor per cohort, so
-- resetting Gr12's week leaves Gr11's board alone.
create or replace function public._cgg_week_start(p_cohort text)
returns timestamptz language sql stable set search_path = public, extensions as $$
  select greatest(
    date_trunc('week', now()),
    coalesce((select value::timestamptz from public.app_config
               where key = public._cgg_cfg_key('weekly_anchor', p_cohort)), 'epoch')
  );
$$;

-- The original no-argument helper stays, and now simply means "gr11",
-- so anything not touched by this migration keeps its old behaviour
-- and there is still only one definition of what a week is.
-- (It is deliberately NOT given a defaulted argument — see the
--  "function is not unique" note in the header.)
create or replace function public._cgg_week_start()
returns timestamptz language sql stable set search_path = public, extensions as $$
  select public._cgg_week_start('gr11');
$$;


-- ============================================================
--  PART C — LEARNER RPCs (this is where the isolation lives)
-- ============================================================

-- C1. The name picker. The ONLY place the ?class= link decides
--     anything: nobody is logged in yet, so there is no cohort to read
--     off a row. Accepted soft spot (ROSTER-SPLIT-PLAN.md): a matric on
--     the plain link sees Gr11 names here — and on no board anywhere.
drop function if exists public.cgg_list_students();
create or replace function public.cgg_list_students(p_cohort text default 'gr11')
returns table (id uuid, display_name text, has_password boolean)
language sql stable security definer set search_path = public, extensions as $$
  select s.id, s.display_name, (s.password is not null)
    from public.students s
   where s.cohort = public._cgg_cohort(p_cohort)
   order by s.display_name;
$$;
revoke all on function public.cgg_list_students(text) from public, anon, authenticated;
grant execute on function public.cgg_list_students(text) to anon, authenticated;

-- C2. Leaderboard — phase12's body (nickname/avatarId preserved), PLUS:
--     the caller's own cohort is read from their row and every other
--     class is filtered out before ranking, so ranks read 1, 2, 3
--     inside the class. The link is irrelevant here by design.
create or replace function public.cgg_leaderboard(p_name text, p_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare sid uuid; coh text; ws timestamptz; weekly jsonb; alltime jsonb; my_w jsonb; my_a jsonb;
begin
  sid := public._cgg_auth(p_name, p_password);
  if sid is null then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  select cohort into coh from public.students where id = sid;
  coh := public._cgg_cohort(coh);
  ws := public._cgg_week_start(coh);

  with totals as (
    select s.id, s.display_name as name, s.nickname, s.avatar_id,
           coalesce(sum(e.xp) filter (where e.created_at >= ws), 0) as wk,
           coalesce(sum(e.xp), 0) as al
    from public.students s left join public.xp_events e on e.student_id = s.id
    where s.cohort = coh
    group by s.id, s.display_name, s.nickname, s.avatar_id
  ),
  wrank as (select *, rank() over (order by wk desc) r from totals),
  arank as (select *, rank() over (order by al desc) r from totals)
  select
    (select jsonb_agg(jsonb_build_object('name', name, 'xp', wk, 'rank', r, 'me', id = sid,
              'nickname', nickname, 'avatarId', avatar_id) order by r) from wrank),
    (select jsonb_agg(jsonb_build_object('name', name, 'xp', al, 'rank', r, 'me', id = sid,
              'nickname', nickname, 'avatarId', avatar_id) order by r) from arank),
    (select jsonb_build_object('name', name, 'xp', wk, 'rank', r, 'me', true,
              'nickname', nickname, 'avatarId', avatar_id) from wrank where id = sid),
    (select jsonb_build_object('name', name, 'xp', al, 'rank', r, 'me', true,
              'nickname', nickname, 'avatarId', avatar_id) from arank where id = sid)
  into weekly, alltime, my_w, my_a;

  return jsonb_build_object('ok', true,
    'weekly', coalesce(weekly,'[]'::jsonb), 'allTime', coalesce(alltime,'[]'::jsonb),
    'myWeekly', my_w, 'myAllTime', my_a, 'cohort', coh);
end; $$;
revoke all on function public.cgg_leaderboard(text, text) from public, anon, authenticated;
grant execute on function public.cgg_leaderboard(text, text) to anon, authenticated;

-- C3. Monday results popup — phase12's body, PLUS the same
--     caller's-cohort filter on the `weekly` CTE (which feeds the
--     board, the star, most improved, on fire and perfect week), and
--     the champion read from THIS class's app_config key. A Gr12
--     learner can no longer see a Gr11 name in any of the five awards.
create or replace function public.cgg_weekly_results(p_name text, p_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare
  sid      uuid;
  coh      text;
  lw_start timestamptz := date_trunc('week', now()) - interval '7 days';   -- last week's Monday (UTC, XP sums)
  lw_end   timestamptz := date_trunc('week', now());                       -- this week's Monday (exclusive)
  pw_start timestamptz := date_trunc('week', now()) - interval '14 days';  -- week-before Monday
  lw_sa    date := (date_trunc('week', now() at time zone 'Africa/Johannesburg'))::date - 7;  -- last SA Monday (daily counts)
  champ      text;
  champ_nick text;
  result   jsonb;
begin
  sid := public._cgg_auth(p_name, p_password);
  if sid is null then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  select cohort into coh from public.students where id = sid;
  coh := public._cgg_cohort(coh);

  champ := nullif(btrim((select value from public.app_config
                          where key = public._cgg_cfg_key('champion_name', coh))), '');
  -- the champion is stored as a REAL display_name; look their nickname up
  -- INSIDE this class, so a same-named learner in the other class can
  -- never lend their nickname to this one's reveal.
  champ_nick := case when champ is null then null
    else coalesce((select nullif(btrim(s2.nickname), '') from public.students s2
                    where s2.display_name = champ and s2.cohort = coh), champ)
  end;

  with weekly as (
    select s.id, s.display_name as name, s.nickname, s.avatar_id,
      coalesce(sum(e.xp) filter (where e.created_at >= lw_start and e.created_at < lw_end), 0) as lw,
      coalesce(sum(e.xp) filter (where e.created_at >= pw_start and e.created_at < lw_start), 0) as pw,
      coalesce(count(distinct (e.created_at at time zone 'Africa/Johannesburg')::date)
               filter (where e.round_id = 'daily'
                         and (e.created_at at time zone 'Africa/Johannesburg')::date
                             between lw_sa and lw_sa + 6), 0) as daily_days,
      max(e.created_at) filter (where e.round_id = 'daily'
                         and (e.created_at at time zone 'Africa/Johannesburg')::date
                             between lw_sa and lw_sa + 6) as last_daily
    from public.students s
    left join public.xp_events e on e.student_id = s.id
    where s.cohort = coh
    group by s.id, s.display_name, s.nickname, s.avatar_id
  ),
  ranked as (
    select *, rank() over (order by lw desc) as lr, rank() over (order by pw desc) as pr
    from weekly
  ),
  star as (
    select id, name, lw, nickname, avatar_id from ranked where lw > 0 order by lw desc, name limit 1
  ),
  imp as (
    select id, name, (lw - pw) as delta, nickname, avatar_id from ranked
    where (lw - pw) > 0 and id is distinct from (select id from star)
    order by (lw - pw) desc, name limit 1
  ),
  fire as (
    select id, name, daily_days as days, nickname, avatar_id from ranked
    where daily_days > 0
      and id is distinct from (select id from star)
      and id is distinct from (select id from imp)
    order by daily_days desc, last_daily asc, name limit 1
  ),
  perfect as (
    select jsonb_agg(name order by name) j,
           jsonb_agg(jsonb_build_object('name', name, 'nickname', nickname, 'avatarId', avatar_id) order by name) roster
    from ranked where daily_days >= 7
  ),
  board as (
    select jsonb_agg(jsonb_build_object('name', name, 'xp', lw, 'rank', lr,
              'nickname', nickname, 'avatarId', avatar_id) order by lr) j
    from ranked where lw > 0
  )
  select jsonb_build_object(
    'ok', true,
    'weekStart', (extract(epoch from lw_start) * 1000)::bigint,
    'board', coalesce((select j from board), '[]'::jsonb),
    'star',  (select jsonb_build_object('name', name, 'xp', lw, 'nickname', nickname, 'avatarId', avatar_id) from star),
    'mostImproved', (select jsonb_build_object('name', name, 'delta', delta, 'nickname', nickname, 'avatarId', avatar_id) from imp),
    'onFire', (select jsonb_build_object('name', name, 'days', days, 'nickname', nickname, 'avatarId', avatar_id) from fire),
    'perfectWeek', coalesce((select j from perfect), '[]'::jsonb),
    'perfectWeekRoster', coalesce((select roster from perfect), '[]'::jsonb),
    'champion', champ,
    'championNickname', champ_nick,
    'cohort', coh,
    'me', (select jsonb_build_object('xp', lw, 'rank', lr) from ranked where id = sid),
    'prevRank', (select case when pw > 0 then pr else null end from ranked where id = sid),
    'bestPrevXp', coalesce((
        select max(wk_sum) from (
          select sum(xp) as wk_sum
          from public.xp_events
          where student_id = sid and created_at < lw_start
          group by date_trunc('week', created_at)
        ) t), 0)
  ) into result;

  return result;
end; $$;
revoke all on function public.cgg_weekly_results(text, text) from public, anon, authenticated;
grant execute on function public.cgg_weekly_results(text, text) to anon, authenticated;


-- ============================================================
--  PART D — ADMIN RPCs
--  The teacher sees BOTH classes in one fetch and the dashboard's
--  Gr11/Gr12 toggle filters in the browser (plan step 5). Only the
--  weekly-winners screenshot is filtered server-side, because that
--  popup IS the per-class artefact she posts to the class group.
-- ============================================================

-- D1. cgg_admin_data — phase12's body PLUS 'cohort' per row.
--     Two changes worth reading twice:
--       • weeklyXp uses THAT LEARNER'S class anchor, so resetting one
--         class's weekly board does not zero the other class's column;
--       • rank is now per class (partition by cohort), so the filtered
--         table reads 1, 2, 3 instead of skipping the other class's
--         numbers. Nothing else about the row shape changes.
create or replace function public.cgg_admin_data(p_admin_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare rows jsonb;
begin
  if not public._cgg_admin_ok(p_admin_password) then return jsonb_build_object('ok', false, 'error', 'auth'); end if;

  with anchors as (
    select c as cohort, public._cgg_week_start(c) as ws
      from (values ('gr11'), ('gr12')) v(c)
  ),
  totals as (
    select s.id, s.display_name as name, (s.password is not null) as has_password, s.last_active_at,
           s.nickname, s.avatar_id, s.cohort,
           coalesce(sum(e.xp) filter (where e.created_at >= a.ws), 0) as wk,
           coalesce(sum(e.xp), 0) as al
    from public.students s
    join anchors a on a.cohort = s.cohort
    left join public.xp_events e on e.student_id = s.id
    group by s.id, s.display_name, (s.password is not null), s.last_active_at,
             s.nickname, s.avatar_id, s.cohort
  ),
  ranked as (select *, rank() over (partition by cohort order by al desc) r from totals)
  select coalesce(jsonb_agg(jsonb_build_object(
      'id', id, 'name', name, 'hasPassword', has_password,
      'nickname', nickname, 'avatarId', avatar_id, 'cohort', cohort,
      'weeklyXp', wk, 'allTimeXp', al, 'rank', r, 'lastActive', last_active_at,
      'rounds', coalesce((select jsonb_object_agg(round_id, jsonb_build_object(
                    'best_score', best_score, 'attempts', attempts, 'passed', passed,
                    'last_played_at', last_played_at)) from public.progress p where p.student_id = ranked.id), '{}'::jsonb)
    ) order by al desc), '[]'::jsonb)
  into rows from ranked;

  return jsonb_build_object('ok', true, 'rows', rows, 'inactiveDays', 7);
end; $$;
revoke all on function public.cgg_admin_data(text) from public, anon, authenticated;
grant execute on function public.cgg_admin_data(text) to anon, authenticated;

-- D2. cgg_admin_weekly_results — phase12's body, now PER CLASS.
--     This is the "exactly as learners see it" preview she screenshots
--     for a class group, so it has to be one class's board or it is the
--     wrong screenshot. 'champion' stays the REAL name (no nickname
--     lookup) — the admin dashboard always shows real names.
drop function if exists public.cgg_admin_weekly_results(text);
create or replace function public.cgg_admin_weekly_results(p_admin_password text, p_cohort text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare
  coh      text := public._cgg_cohort(p_cohort);
  lw_start timestamptz := date_trunc('week', now()) - interval '7 days';
  lw_end   timestamptz := date_trunc('week', now());
  pw_start timestamptz := date_trunc('week', now()) - interval '14 days';
  lw_sa    date := (date_trunc('week', now() at time zone 'Africa/Johannesburg'))::date - 7;
  champ    text;
  result   jsonb;
begin
  if not public._cgg_admin_ok(p_admin_password) then
    return jsonb_build_object('ok', false, 'error', 'auth');
  end if;
  champ := nullif(btrim((select value from public.app_config
                          where key = public._cgg_cfg_key('champion_name', coh))), '');

  with weekly as (
    select s.id, s.display_name as name, s.nickname, s.avatar_id,
      coalesce(sum(e.xp) filter (where e.created_at >= lw_start and e.created_at < lw_end), 0) as lw,
      coalesce(sum(e.xp) filter (where e.created_at >= pw_start and e.created_at < lw_start), 0) as pw,
      coalesce(count(distinct (e.created_at at time zone 'Africa/Johannesburg')::date)
               filter (where e.round_id = 'daily'
                         and (e.created_at at time zone 'Africa/Johannesburg')::date
                             between lw_sa and lw_sa + 6), 0) as daily_days,
      max(e.created_at) filter (where e.round_id = 'daily'
                         and (e.created_at at time zone 'Africa/Johannesburg')::date
                             between lw_sa and lw_sa + 6) as last_daily
    from public.students s
    left join public.xp_events e on e.student_id = s.id
    where s.cohort = coh
    group by s.id, s.display_name, s.nickname, s.avatar_id
  ),
  ranked as (
    select *, rank() over (order by lw desc) as lr
    from weekly
  ),
  star as (
    select id, name, lw, nickname, avatar_id from ranked where lw > 0 order by lw desc, name limit 1
  ),
  imp as (
    select id, name, (lw - pw) as delta, nickname, avatar_id from ranked
    where (lw - pw) > 0 and id is distinct from (select id from star)
    order by (lw - pw) desc, name limit 1
  ),
  fire as (
    select id, name, daily_days as days, nickname, avatar_id from ranked
    where daily_days > 0
      and id is distinct from (select id from star)
      and id is distinct from (select id from imp)
    order by daily_days desc, last_daily asc, name limit 1
  ),
  perfect as (
    select jsonb_agg(name order by name) j,
           jsonb_agg(jsonb_build_object('name', name, 'nickname', nickname, 'avatarId', avatar_id) order by name) roster
    from ranked where daily_days >= 7
  ),
  board as (
    select jsonb_agg(jsonb_build_object('name', name, 'xp', lw, 'rank', lr,
              'nickname', nickname, 'avatarId', avatar_id) order by lr) j
    from ranked where lw > 0
  )
  select jsonb_build_object(
    'ok', true,
    'weekStart', (extract(epoch from lw_start) * 1000)::bigint,
    'cohort', coh,
    'board', coalesce((select j from board), '[]'::jsonb),
    'star',  (select jsonb_build_object('name', name, 'xp', lw, 'nickname', nickname, 'avatarId', avatar_id) from star),
    'mostImproved', (select jsonb_build_object('name', name, 'delta', delta, 'nickname', nickname, 'avatarId', avatar_id) from imp),
    'onFire', (select jsonb_build_object('name', name, 'days', days, 'nickname', nickname, 'avatarId', avatar_id) from fire),
    'perfectWeek', coalesce((select j from perfect), '[]'::jsonb),
    'perfectWeekRoster', coalesce((select roster from perfect), '[]'::jsonb),
    'champion', champ
  ) into result;

  return result;
end; $$;
revoke all on function public.cgg_admin_weekly_results(text, text) from public, anon, authenticated;
grant execute on function public.cgg_admin_weekly_results(text, text) to anon, authenticated;

-- D3. cgg_admin_timeline — phase15's body PLUS 'cohort' per row, so the
--     dashboard can keep one class's attempts out of the other class's
--     trajectory arrows. Signature and clamp unchanged. Learner
--     passwords are never selected here (phase12 lesson).
create or replace function public.cgg_admin_timeline(
  p_admin_password text,
  p_student_id uuid default null,
  p_limit int default 400)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  lim  int;
  rows jsonb;
begin
  if not public._cgg_admin_ok(p_admin_password) then
    return jsonb_build_object('ok', false, 'error', 'auth');
  end if;

  -- clamp so a tampered client can't ask for the whole table
  lim := least(greatest(coalesce(p_limit, 400), 1), 2000);

  select coalesce(jsonb_agg(x order by x_at), '[]'::jsonb)
  into rows
  from (
    select jsonb_build_object(
             'studentId', e.student_id,
             'name',      s.display_name,
             'cohort',    s.cohort,
             'roundId',   e.round_id,
             'score',     e.score,
             'xp',        e.xp,
             'at',        e.created_at
           ) as x,
           e.created_at as x_at
    from public.xp_events e
    join public.students s on s.id = e.student_id
    where p_student_id is null or e.student_id = p_student_id
    order by e.created_at desc
    limit lim
  ) t;

  return jsonb_build_object('ok', true, 'rows', rows, 'serverNow', now());
end; $$;
revoke all on function public.cgg_admin_timeline(text, uuid, int) from public, anon, authenticated;
grant execute on function public.cgg_admin_timeline(text, uuid, int) to anon, authenticated;

-- D4. cgg_admin_stuck — phase17's body PLUS 'cohort' on each detail row
--     (the by-learner "who to sit next to" list), so the dashboard can
--     show one class's taps. The PER-PANEL rollup above it stays
--     class-wide on purpose: it is a question-quality signal, not a
--     learner one, and splitting it would halve counts that are already
--     small. Still contains no INSERT/UPDATE/DELETE — keep it that way
--     (cgg_checker_claim's hourly cap counts rows in this table).
create or replace function public.cgg_admin_stuck(
  p_admin_password text,
  p_days  int default 30,
  p_limit int default 500)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  since  timestamptz;
  lim    int;
  panels jsonb;
  marks  jsonb;
  detail jsonb;
  total  int;
begin
  if not public._cgg_admin_ok(p_admin_password) then
    return jsonb_build_object('ok', false, 'error', 'auth');
  end if;

  -- clamp both so a tampered client can't ask for the whole table
  since := now() - make_interval(days => least(greatest(coalesce(p_days, 30), 1), 400));
  lim   := least(greatest(coalesce(p_limit, 500), 1), 2000);

  with s as (
    select c.student_id,
           c.panel_id,
           nullif(substring(c.answer from '^\[stuck:([0-9]+)\]'), '')::int as rung,
           btrim(regexp_replace(coalesce(c.answer, ''), '^\[stuck:[0-9]+\]', '')) as typed,
           c.created_at
      from public.checker_calls c
     where c.verdict = 'stuck'
       and c.created_at > since
  ),
  pnl as (
    select panel_id,
           count(distinct student_id) as learners,
           count(*) as taps,
           count(*) filter (where rung = 3) as rung3,
           count(*) filter (where typed = '') as blank,
           count(distinct student_id) filter (where typed = '') as blank_learners,
           max(created_at) as last_at
      from s
     group by panel_id
  ),
  mk as (
    select panel_id, verdict, count(*) as n, count(distinct student_id) as learners
      from public.checker_calls
     where created_at > since
       and verdict is not null
       and verdict <> 'stuck'
     group by panel_id, verdict
  ),
  det as (
    select s.student_id, st.display_name as name, st.cohort, s.panel_id, s.rung, s.typed, s.created_at
      from s
      join public.students st on st.id = s.student_id
     order by s.created_at desc
     limit lim
  )
  select
    (select count(*) from s),
    (select coalesce(jsonb_agg(jsonb_build_object(
              'panelId',       panel_id,
              'learners',      learners,
              'taps',          taps,
              'rung3',         rung3,
              'blank',         blank,
              'blankLearners', blank_learners,
              'lastAt',        last_at)
            order by learners desc, taps desc), '[]'::jsonb) from pnl),
    (select coalesce(jsonb_agg(jsonb_build_object(
              'panelId',  panel_id,
              'verdict',  verdict,
              'n',        n,
              'learners', learners)), '[]'::jsonb) from mk),
    (select coalesce(jsonb_agg(jsonb_build_object(
              'studentId', student_id,
              'name',      name,
              'cohort',    cohort,
              'panelId',   panel_id,
              'rung',      rung,
              'text',      typed,
              'at',        created_at)
            order by created_at desc), '[]'::jsonb) from det)
  into total, panels, marks, detail;

  return jsonb_build_object(
    'ok', true,
    'days', least(greatest(coalesce(p_days, 30), 1), 400),
    'total', total,          -- stuck taps in the window; `rows` may be capped at `lim`
    'panels', panels,
    'marks', marks,
    'rows', detail,
    'serverNow', now());
end; $$;
revoke all on function public.cgg_admin_stuck(text, int, int) from public, anon, authenticated;
grant execute on function public.cgg_admin_stuck(text, int, int) to anon, authenticated;

-- D5. cgg_admin_integrity — phase13's body PLUS 'cohort' per learner,
--     so "Worth a look" can be read one class at a time. Same flags,
--     same raw counts, same reasoning left to the client.
create or replace function public.cgg_admin_integrity(p_admin_password text)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare res jsonb;
begin
  if not public._cgg_admin_ok(p_admin_password) then
    return jsonb_build_object('ok', false, 'error', 'auth');
  end if;

  with passed as (
    select p.student_id, p.round_id, p.last_played_at,
           (select count(*) from public.question_events q
             where q.student_id = p.student_id and q.round_id = p.round_id) as qcount
    from public.progress p
    where p.passed
  ),
  agg as (
    select s.id, s.display_name as name, s.cohort,
           public._cgg_locked('learner:' || lower(s.display_name)) as locked_until,
           coalesce(jsonb_agg(jsonb_build_object(
             'round', pa.round_id, 'qcount', pa.qcount, 'at', pa.last_played_at
           ) order by pa.last_played_at) filter (where pa.round_id is not null), '[]'::jsonb) as rounds
    from public.students s
    left join passed pa on pa.student_id = s.id
    group by s.id, s.display_name, s.cohort
  )
  select coalesce(jsonb_agg(jsonb_build_object(
           'name', name, 'cohort', cohort, 'lockedUntil', locked_until, 'rounds', rounds
         ) order by name), '[]'::jsonb)
    into res
  from agg;

  return jsonb_build_object('ok', true, 'students', res);
end; $$;
revoke all on function public.cgg_admin_integrity(text) from public, anon, authenticated;
grant execute on function public.cgg_admin_integrity(text) to anon, authenticated;

-- D6. Champion, per class. phase10's setter with a cohort on the end.
--     The pick must be a learner IN that class: the dashboard only
--     offers names from the toggled class, and this is the server-side
--     half of that promise, so a Gr11 name can never end up crowned on
--     the Gr12 popup.
drop function if exists public.cgg_admin_set_champion(text, text);
create or replace function public.cgg_admin_set_champion(p_admin_password text, p_name text, p_cohort text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare
  v   text := nullif(btrim(coalesce(p_name, '')), '');
  coh text := public._cgg_cohort(p_cohort);
  k   text := public._cgg_cfg_key('champion_name', coh);
begin
  if not public._cgg_admin_ok(p_admin_password) then
    return jsonb_build_object('ok', false, 'error', 'auth');
  end if;
  if v is null then
    delete from public.app_config where key = k;
  else
    if not exists (select 1 from public.students s where s.display_name = v and s.cohort = coh) then
      return jsonb_build_object('ok', false, 'error', 'wrong_cohort', 'cohort', coh);
    end if;
    insert into public.app_config (key, value) values (k, v)
      on conflict (key) do update set value = excluded.value;
  end if;
  return jsonb_build_object('ok', true, 'champion', v, 'cohort', coh);
end; $$;
revoke all on function public.cgg_admin_set_champion(text, text, text) from public, anon, authenticated;
grant execute on function public.cgg_admin_set_champion(text, text, text) to anon, authenticated;

-- D7. Weekly reset, per class. Writes that class's anchor only, so
--     zeroing the matrics' week leaves the Gr11 board exactly as it was.
drop function if exists public.cgg_admin_reset_weekly(text);
create or replace function public.cgg_admin_reset_weekly(p_admin_password text, p_cohort text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare coh text := public._cgg_cohort(p_cohort);
begin
  if not public._cgg_admin_ok(p_admin_password) then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  insert into public.app_config(key, value)
    values (public._cgg_cfg_key('weekly_anchor', coh), now()::text)
    on conflict (key) do update set value = excluded.value;
  return jsonb_build_object('ok', true, 'cohort', coh);
end; $$;
revoke all on function public.cgg_admin_reset_weekly(text, text) from public, anon, authenticated;
grant execute on function public.cgg_admin_reset_weekly(text, text) to anon, authenticated;

-- D8. Add a learner straight into a class (schema.sql's body + cohort).
--     display_name is still unique across BOTH classes: two learners
--     with the identical display name would collide on login, cohort or
--     not, so "on conflict do nothing" stays exactly as it was.
drop function if exists public.cgg_admin_add_student(text, text);
create or replace function public.cgg_admin_add_student(p_admin_password text, p_name text, p_cohort text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare coh text := public._cgg_cohort(p_cohort);
begin
  if not public._cgg_admin_ok(p_admin_password) then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  insert into public.students (display_name, cohort) values (p_name, coh)
    on conflict (display_name) do nothing;
  return jsonb_build_object('ok', true, 'cohort', coh);
end; $$;
revoke all on function public.cgg_admin_add_student(text, text, text) from public, anon, authenticated;
grant execute on function public.cgg_admin_add_student(text, text, text) to anon, authenticated;

-- D9. NEW — move one learner between classes (the "→ Gr12" row button).
--     Progress, XP, badges, password and nickname all stay exactly
--     where they are; only which board they appear on changes.
--
--     `for update` on the students row is the standing ruling after
--     phase20: this reads the row, decides from what it read, and then
--     writes — two taps of the button arriving together must queue, not
--     both act on the same stale read.
--
--     If the learner being moved is the champion of the class they are
--     LEAVING, that pick is cleared: a champion who is no longer in the
--     class cannot keep leading its Monday popup. The teacher picks a
--     new one (or re-awards it in the new class) from the dashboard.
create or replace function public.cgg_admin_set_cohort(p_admin_password text, p_student_id uuid, p_cohort text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare
  coh  text := public._cgg_cohort(p_cohort);
  s    public.students;
begin
  if not public._cgg_admin_ok(p_admin_password) then
    return jsonb_build_object('ok', false, 'error', 'auth');
  end if;

  select * into s from public.students where id = p_student_id for update;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'no_such_student');
  end if;
  if s.cohort = coh then
    return jsonb_build_object('ok', true, 'moved', false, 'cohort', coh);
  end if;

  delete from public.app_config
   where key = public._cgg_cfg_key('champion_name', s.cohort)
     and btrim(coalesce(value, '')) = s.display_name;

  update public.students set cohort = coh where id = p_student_id;

  return jsonb_build_object('ok', true, 'moved', true, 'from', s.cohort, 'cohort', coh);
end; $$;
revoke all on function public.cgg_admin_set_cohort(text, uuid, text) from public, anon, authenticated;
grant execute on function public.cgg_admin_set_cohort(text, uuid, text) to anon, authenticated;


-- ============================================================
--  PART E — GRANTS, all together (house style: re-declared after
--  every create-or-replace. They are also declared next to each
--  function above; this block is the one place to read the whole
--  surface at a glance, and re-granting is harmless.)
-- ============================================================
grant execute on function
  public.cgg_list_students(text),
  public.cgg_leaderboard(text, text),
  public.cgg_weekly_results(text, text),
  public.cgg_admin_data(text),
  public.cgg_admin_weekly_results(text, text),
  public.cgg_admin_timeline(text, uuid, int),
  public.cgg_admin_stuck(text, int, int),
  public.cgg_admin_integrity(text),
  public.cgg_admin_set_champion(text, text, text),
  public.cgg_admin_reset_weekly(text, text),
  public.cgg_admin_add_student(text, text, text),
  public.cgg_admin_set_cohort(text, uuid, text)
to anon, authenticated;

-- The helpers stay callable only from inside the SECURITY DEFINER
-- functions above — no client ever calls them directly.
revoke all on function public._cgg_cohort(text)            from public, anon, authenticated;
revoke all on function public._cgg_cfg_key(text, text)     from public, anon, authenticated;
revoke all on function public._cgg_week_start(text)        from public, anon, authenticated;
revoke all on function public._cgg_week_start()            from public, anon, authenticated;


-- ============================================================
--  AFTER THE MIGRATION — run these TWO statements by hand
-- ------------------------------------------------------------
--  ⚠ This is a PUBLIC repo, so the learner's name is not written
--  here. She is named in the private PROJECT-HISTORY.md (the one
--  existing learner who moves to Gr12). Run in the SQL editor:
--
--    -- 1. move her (progress and XP travel with her):
--    -- update public.students set cohort = 'gr12'
--    --  where display_name = '<name from PROJECT-HISTORY.md>';
--
--    -- 2. prove it landed — expect 21 gr11, 1 gr12 (adjust as the
--    --    roster grows), and no NULLs:
--    -- select cohort, count(*) from public.students group by cohort;
--
--  Then, still in the SQL editor, the /migration-check evidence:
--    select column_name, is_nullable, column_default
--      from information_schema.columns
--     where table_schema = 'public' and table_name = 'students'
--       and column_name = 'cohort';
--
--    select p.proname, pg_get_function_identity_arguments(p.oid) as args,
--           p.prosecdef, p.proconfig
--      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
--     where n.nspname = 'public' and p.proname like 'cgg\_%'
--     order by 1, 2;
--    -- every row must show prosecdef = true and a search_path in proconfig
--
--    select key from public.app_config order by key;
--    -- 'champion_name' / 'weekly_anchor' are Gr11's and keep their names;
--    -- ':gr12' twins appear only once the teacher sets or resets Gr12.
-- ============================================================


-- ============================================================
--  ROLLBACK — uncomment and run ONLY to undo phase 21. Re-running
--  schema.sql + phase10.sql + phase12.sql + phase13.sql + phase15.sql
--  + phase17.sql restores every replaced function to its pre-phase21
--  shape (they are listed in that order on purpose — later files win).
--  Then:
-- ============================================================
-- drop function if exists public.cgg_admin_set_cohort(text, uuid, text);
-- drop function if exists public.cgg_list_students(text);
-- drop function if exists public.cgg_admin_weekly_results(text, text);
-- drop function if exists public.cgg_admin_set_champion(text, text, text);
-- drop function if exists public.cgg_admin_reset_weekly(text, text);
-- drop function if exists public.cgg_admin_add_student(text, text, text);
-- drop function if exists public._cgg_week_start(text);
-- drop function if exists public._cgg_cfg_key(text, text);
-- drop function if exists public._cgg_cohort(text);
-- delete from public.app_config where key like '%:gr12';
-- alter table public.students drop constraint if exists students_cohort_check;
-- drop index if exists public.students_cohort_idx;
-- alter table public.students drop column if exists cohort;
