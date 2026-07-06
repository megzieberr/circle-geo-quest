-- ============================================================
--  CIRCLE QUEST — PHASE 9 MIGRATION
--  Adds: (1) the PERFECT WEEK bonus — any learner who completes the
--            Daily Challenge on all 7 days of a Mon–Sun week gets a
--            one-off +50 XP the moment the 7th daily is finished, and
--            is celebrated by name in the Monday "crown" popup.
--            NOT a winner-take-all award: everyone who earns it, gets it.
--        (2) a fairer On-Fire tie-break — ties on daily count now go to
--            whoever FINISHED their set first, not to the earliest name
--            in the alphabet.
--        (3) daily counts are now counted as distinct South-African
--            calendar days (Africa/Johannesburg), so a late-night or
--            early-morning daily can't leak into the wrong week.
--
--  HOW TO RUN:
--    Supabase dashboard  ->  SQL Editor  ->  New query  ->
--    paste this WHOLE file  ->  Run.
--
--  SAFE to run on the live database, even while learners play:
--    • It only REPLACES three existing functions (cgg_submit_daily,
--      cgg_weekly_results, cgg_admin_weekly_results). No tables are
--      dropped or altered; no data is touched.
--    • Idempotent ("or replace"), so running it twice does no harm.
--    • The Perfect Week bonus is written as a normal xp_events row
--      (round_id = 'perfectweek'), so it flows into the leaderboards
--      automatically, and it is granted at most once per learner per
--      week no matter how often the RPC is called.
--    • Same security model as always: SECURITY DEFINER + server-side
--      password checks.
--
--  Rollback notes are at the bottom.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Daily submit — unchanged behaviour, PLUS: when this completion
--    makes it 7 distinct SA days within the Mon–Sun week of p_day,
--    grant the one-off Perfect Week bonus and tell the client so it
--    can celebrate on the spot.
-- ------------------------------------------------------------
create or replace function public.cgg_submit_daily(
  p_name text, p_password text, p_day date, p_correct int, p_total int)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  sid      uuid;
  last     date;
  award    int := 25;      -- fixed server-side so a tampered client can't inflate it
  bonus    int := 50;      -- Perfect Week: all 7 days of the Mon–Sun week
  sc       numeric;
  wk_start date := p_day - (extract(isodow from p_day)::int - 1);   -- Monday of p_day's week
  days_done  int;
  already_pw boolean;
  pw       boolean := false;
begin
  sid := public._cgg_auth(p_name, p_password);
  if sid is null then
    return jsonb_build_object('ok', false, 'error', 'auth');
  end if;

  select last_daily_day into last from public.students where id = sid;

  -- already claimed today (or for a day at/after the request) -> grant nothing
  if last is not null and p_day <= last then
    update public.students set last_active_at = now() where id = sid;
    return jsonb_build_object('ok', true, 'xpAwarded', 0, 'alreadyClaimed', true);
  end if;

  update public.students
     set last_daily_day = p_day, last_active_at = now()
   where id = sid;

  sc := case when coalesce(p_total, 0) > 0 then p_correct::numeric / p_total else null end;
  insert into public.xp_events (student_id, round_id, xp, score)
  values (sid, 'daily', award, sc);

  -- PERFECT WEEK: count distinct SA-time days with a daily in p_day's week
  -- (the row above has created_at = now(), so it is included).
  select count(distinct (e.created_at at time zone 'Africa/Johannesburg')::date)
    into days_done
  from public.xp_events e
  where e.student_id = sid and e.round_id = 'daily'
    and (e.created_at at time zone 'Africa/Johannesburg')::date between wk_start and wk_start + 6;

  if days_done >= 7 then
    select exists (
      select 1 from public.xp_events e
      where e.student_id = sid and e.round_id = 'perfectweek'
        and (e.created_at at time zone 'Africa/Johannesburg')::date between wk_start and wk_start + 6
    ) into already_pw;
    if not already_pw then
      insert into public.xp_events (student_id, round_id, xp, score)
      values (sid, 'perfectweek', bonus, null);
      pw := true;
    end if;
  end if;

  return jsonb_build_object(
    'ok', true, 'xpAwarded', award, 'alreadyClaimed', false,
    'perfectWeek', pw, 'bonusXp', case when pw then bonus else 0 end);
end; $$;

grant execute on function public.cgg_submit_daily(text, text, date, int, int) to anon, authenticated;

-- ------------------------------------------------------------
-- 2. Weekly results (learner crown) — same shape as before, PLUS:
--      • daily counts = distinct SA days of last week's Mon–Sun
--      • On-Fire tie-break: earliest finisher, then name
--      • 'perfectWeek': names of EVERYONE who hit 7/7 last week
-- ------------------------------------------------------------
create or replace function public.cgg_weekly_results(p_name text, p_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare
  sid      uuid;
  lw_start timestamptz := date_trunc('week', now()) - interval '7 days';   -- last week's Monday (UTC, XP sums)
  lw_end   timestamptz := date_trunc('week', now());                       -- this week's Monday (exclusive)
  pw_start timestamptz := date_trunc('week', now()) - interval '14 days';  -- week-before Monday
  lw_sa    date := (date_trunc('week', now() at time zone 'Africa/Johannesburg'))::date - 7;  -- last SA Monday (daily counts)
  result   jsonb;
begin
  sid := public._cgg_auth(p_name, p_password);
  if sid is null then return jsonb_build_object('ok', false, 'error', 'auth'); end if;

  with weekly as (
    select s.id, s.display_name as name,
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
    group by s.id, s.display_name
  ),
  ranked as (
    select *, rank() over (order by lw desc) as lr, rank() over (order by pw desc) as pr
    from weekly
  ),
  star as (
    select id, name, lw from ranked where lw > 0 order by lw desc, name limit 1
  ),
  imp as (
    select id, name, (lw - pw) as delta from ranked
    where (lw - pw) > 0 and id is distinct from (select id from star)
    order by (lw - pw) desc, name limit 1
  ),
  fire as (
    select id, name, daily_days as days from ranked
    where daily_days > 0
      and id is distinct from (select id from star)
      and id is distinct from (select id from imp)
    order by daily_days desc, last_daily asc, name limit 1
  ),
  perfect as (
    select jsonb_agg(name order by name) j from ranked where daily_days >= 7
  ),
  board as (
    select jsonb_agg(jsonb_build_object('name', name, 'xp', lw, 'rank', lr) order by lr) j
    from ranked where lw > 0
  )
  select jsonb_build_object(
    'ok', true,
    'weekStart', (extract(epoch from lw_start) * 1000)::bigint,
    'board', coalesce((select j from board), '[]'::jsonb),
    'star',  (select jsonb_build_object('name', name, 'xp', lw) from star),
    'mostImproved', (select jsonb_build_object('name', name, 'delta', delta) from imp),
    'onFire', (select jsonb_build_object('name', name, 'days', days) from fire),
    'perfectWeek', coalesce((select j from perfect), '[]'::jsonb),
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

grant execute on function public.cgg_weekly_results(text, text) to anon, authenticated;

-- ------------------------------------------------------------
-- 3. Admin view — same additions, admin-password auth, no "me" fields.
-- ------------------------------------------------------------
create or replace function public.cgg_admin_weekly_results(p_admin_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare
  lw_start timestamptz := date_trunc('week', now()) - interval '7 days';
  lw_end   timestamptz := date_trunc('week', now());
  pw_start timestamptz := date_trunc('week', now()) - interval '14 days';
  lw_sa    date := (date_trunc('week', now() at time zone 'Africa/Johannesburg'))::date - 7;
  result   jsonb;
begin
  if not public._cgg_admin_ok(p_admin_password) then
    return jsonb_build_object('ok', false, 'error', 'auth');
  end if;

  with weekly as (
    select s.id, s.display_name as name,
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
    group by s.id, s.display_name
  ),
  ranked as (
    select *, rank() over (order by lw desc) as lr
    from weekly
  ),
  star as (
    select id, name, lw from ranked where lw > 0 order by lw desc, name limit 1
  ),
  imp as (
    select id, name, (lw - pw) as delta from ranked
    where (lw - pw) > 0 and id is distinct from (select id from star)
    order by (lw - pw) desc, name limit 1
  ),
  fire as (
    select id, name, daily_days as days from ranked
    where daily_days > 0
      and id is distinct from (select id from star)
      and id is distinct from (select id from imp)
    order by daily_days desc, last_daily asc, name limit 1
  ),
  perfect as (
    select jsonb_agg(name order by name) j from ranked where daily_days >= 7
  ),
  board as (
    select jsonb_agg(jsonb_build_object('name', name, 'xp', lw, 'rank', lr) order by lr) j
    from ranked where lw > 0
  )
  select jsonb_build_object(
    'ok', true,
    'weekStart', (extract(epoch from lw_start) * 1000)::bigint,
    'board', coalesce((select j from board), '[]'::jsonb),
    'star',  (select jsonb_build_object('name', name, 'xp', lw) from star),
    'mostImproved', (select jsonb_build_object('name', name, 'delta', delta) from imp),
    'onFire', (select jsonb_build_object('name', name, 'days', days) from fire),
    'perfectWeek', coalesce((select j from perfect), '[]'::jsonb)
  ) into result;

  return result;
end; $$;

grant execute on function public.cgg_admin_weekly_results(text) to anon, authenticated;

-- ============================================================
--  ROLLBACK — to undo, re-run phase2.sql (restores cgg_submit_daily),
--  phase3.sql (restores cgg_weekly_results) and phase8.sql (restores
--  cgg_admin_weekly_results). Any already-granted 'perfectweek' XP rows
--  are ordinary xp_events; delete them only if you really want to:
--    -- delete from public.xp_events where round_id = 'perfectweek';
-- ============================================================
