-- ============================================================
--  CIRCLE QUEST — PHASE 12 MIGRATION
--  Adds: NICKNAMES & AVATARS — a persona a learner picks for the
--        leaderboard and weekly reveals, decoupled from their real
--        display_name (which stays the login/admin identifier,
--        completely unchanged). See docs/engagement-plan.md §3 for
--        the full design + the moderation ruling: freeform nickname,
--        NO profanity filter (an automated blocklist was rejected —
--        the class is bilingual and English blocklists false-positive
--        on innocent Afrikaans words, e.g. "vak" = subject). The
--        teacher moderates instead, via cgg_admin_reset_nickname.
--
--  HOW TO RUN:
--    Supabase dashboard  ->  SQL Editor  ->  New query  ->
--    paste this WHOLE file  ->  Run.
--
--  This is SAFE to run on the live database, even while learners are
--  playing:
--    • It is ADDITIVE — two new columns, two new functions, and five
--      existing functions REPLACED to add fields (never removed or
--      renamed) to their return shape. No table is dropped, no
--      existing field is removed or renamed, so nothing that works
--      today can break.
--    • Every statement is idempotent ("if not exists" / "or replace"),
--      so running it twice does no harm.
--    • Same security model as every other file here: SECURITY
--      DEFINER, search_path pinned to (public, extensions), password
--      checked via the existing _cgg_auth() / _cgg_admin_ok() helpers
--      before anything is read or written.
--    • This file runs INDEPENDENTLY of supabase/phase11.sql (Streak
--      Milestones, added alongside this by a different agent) — they
--      touch different columns/functions and can be applied in either
--      order.
--
--  NOTE: this file is not run automatically — the orchestrator applies
--  migrations. Do not execute this yourself.
--
--  DESIGN CHOICE — avatar validation: the brief offered two options
--  (validate against a fixed emoji list duplicated server-side, OR
--  just accept any short text ≤8 chars). This file takes the fixed-list
--  route: p_avatar is an ID (e.g. "fox"), not a raw emoji character —
--  the client renders the actual emoji via CONFIG.AVATARS (js/config.js)
--  by looking up the id. That keeps the stored value a short ASCII slug
--  (never arbitrary Unicode from a tampered client) and the two lists
--  (client CONFIG.AVATARS / the `allowed` array inside cgg_set_profile()
--  below) must be kept in sync by hand — if you add an avatar in
--  js/config.js, add its id to that array too. An unknown/tampered
--  id is silently ignored (stored as null) rather than erroring the
--  whole call, so a stale client build never hard-fails a save.
--
--  A rollback block is at the very bottom (commented out).
-- ============================================================


-- ============================================================
--  PART A — STORAGE
-- ============================================================

-- A1. Two new columns, both nullable — "unset" is a valid, common state
--     (a learner who hasn't set up a profile yet, or explicitly skipped).
--     nickname: freeform text, no filter (see header). avatar_id: a short
--     id from the fixed picker list (js/config.js AVATARS), NOT an emoji.
alter table public.students
  add column if not exists nickname  text,
  add column if not exists avatar_id text;


-- ============================================================
--  PART B — NEW FUNCTIONS
-- ============================================================

-- B1. Set (or clear) the caller's own nickname + avatar. Called from the
--     profile-setup overlay (js/profile.js), both on explicit Save and on
--     "skip" (which still saves the neutral default avatar so the one-time
--     setup prompt doesn't reappear every login — see profileSetupNeeded
--     in cgg_get_state below).
create or replace function public.cgg_set_profile(
  p_name text, p_password text, p_nickname text, p_avatar text)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  sid     uuid;
  nick    text;
  av      text;
  -- mirrors CONFIG.AVATARS in js/config.js — keep these two lists in sync.
  allowed text[] := array[
    'fox','owl','otter','panda','koala',
    'comet','rocket','star','planet',
    'leaf','sprout','wave',
    'football','basketball','tennis','medal',
    'guitar','drum','trumpet',
    'circle'
  ];
begin
  sid := public._cgg_auth(p_name, p_password);
  if sid is null then
    return jsonb_build_object('ok', false, 'error', 'auth');
  end if;

  -- trim + length-cap the nickname (~24 chars); empty string -> null.
  -- NO other validation — see header for why (moderation is a teacher
  -- action, cgg_admin_reset_nickname below, not an algorithm here).
  nick := nullif(btrim(coalesce(p_nickname, '')), '');
  if nick is not null and length(nick) > 24 then
    nick := left(nick, 24);
  end if;

  -- unknown/tampered avatar id -> ignored (stored as null), not an error.
  av := nullif(btrim(coalesce(p_avatar, '')), '');
  if av is not null and not (av = any(allowed)) then
    av := null;
  end if;

  update public.students set nickname = nick, avatar_id = av where id = sid;

  return jsonb_build_object('ok', true, 'nickname', nick, 'avatarId', av);
end; $$;

-- B2. Admin-only: DELETE (null) a learner's nickname — never edit it — so
--     they fall back to their real display_name everywhere until they pick
--     a new one (the profile-setup prompt reappears next login, because
--     nickname AND avatar_id both look unset again... actually only the
--     nickname is nulled here per the brief, so profileSetupNeeded stays
--     false if an avatar is still set; the learner just shows by their
--     real name until they revisit "Customize" and pick a new nickname).
--     Before nulling, the OLD nickname is logged to public.events so a
--     record survives the deletion — the teacher's moderation trail (they
--     screenshot the dashboard first if parents need to see it — this repo
--     is PUBLIC, so no learner names/nicknames are ever seeded or committed
--     here; the log only ever exists live, in the database).
create or replace function public.cgg_admin_reset_nickname(p_admin_password text, p_student_id uuid)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare old_nick text;
begin
  if not public._cgg_admin_ok(p_admin_password) then
    return jsonb_build_object('ok', false, 'error', 'auth');
  end if;

  select nickname into old_nick from public.students where id = p_student_id;
  if old_nick is null then
    return jsonb_build_object('ok', true, 'reset', false);   -- nothing to reset
  end if;

  insert into public.events (student_id, action) values (p_student_id, 'nickname_reset:' || old_nick);

  update public.students set nickname = null where id = p_student_id;

  return jsonb_build_object('ok', true, 'reset', true);
end; $$;


-- ============================================================
--  PART C — EXISTING FUNCTIONS, REPLACED (fields ADDED only —
--  every field that existed before is still there, unchanged)
-- ============================================================

-- C1. cgg_get_state (schema.sql) — the logged-in learner's OWN nickname,
--     avatar, and whether the profile-setup prompt should show. "Needed"
--     is true only when BOTH are unset — the very first login, or a
--     learner who has genuinely never touched profile setup. Skipping the
--     setup screen still saves the neutral default avatar (js/profile.js),
--     which flips this false so the prompt doesn't nag every login.
create or replace function public.cgg_get_state(p_name text, p_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare sid uuid; prog jsonb; total int; badges jsonb; nick text; av text;
begin
  sid := public._cgg_auth(p_name, p_password);
  if sid is null then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  update public.students set last_active_at = now() where id = sid;

  select nickname, avatar_id into nick, av from public.students where id = sid;

  select coalesce(jsonb_object_agg(round_id, jsonb_build_object(
            'best_score', best_score, 'attempts', attempts, 'total_xp', total_xp,
            'passed', passed, 'last_played_at', last_played_at)), '{}'::jsonb)
    into prog from public.progress where student_id = sid;

  select coalesce(sum(xp), 0) into total from public.xp_events where student_id = sid;

  select coalesce(jsonb_agg(round_id), '[]'::jsonb) into badges
    from public.progress where student_id = sid and passed;

  return jsonb_build_object('ok', true,
    'student', jsonb_build_object('id', sid, 'name', p_name,
                 'nickname', nick, 'avatarId', av,
                 'profileSetupNeeded', (nick is null and av is null)),
    'progress', prog, 'totalXp', total, 'badges', badges);
end; $$;

-- C2. cgg_leaderboard (schema.sql) — 'name' stays the real display_name
--     (unchanged, still authoritative); 'nickname'/'avatarId' are ADDED so
--     the client can show nickname ?? name with the avatar next to it.
create or replace function public.cgg_leaderboard(p_name text, p_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare sid uuid; ws timestamptz; weekly jsonb; alltime jsonb; my_w jsonb; my_a jsonb;
begin
  sid := public._cgg_auth(p_name, p_password);
  if sid is null then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  ws := public._cgg_week_start();

  with totals as (
    select s.id, s.display_name as name, s.nickname, s.avatar_id,
           coalesce(sum(e.xp) filter (where e.created_at >= ws), 0) as wk,
           coalesce(sum(e.xp), 0) as al
    from public.students s left join public.xp_events e on e.student_id = s.id
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
    'myWeekly', my_w, 'myAllTime', my_a);
end; $$;

-- C3. cgg_weekly_results (learner crown — latest body is phase10.sql's,
--     which already carries 'champion'; anti-farming N/A here, this RPC
--     is read-only). ADDS: nickname/avatarId nested in board/star/
--     mostImproved/onFire; 'perfectWeekRoster' alongside the unchanged
--     'perfectWeek' name array; 'championNickname' alongside the
--     unchanged 'champion' (real name) — champion_name in app_config
--     always stores the REAL display_name (the teacher picks a real
--     learner from the admin dropdown), so this looks that student up by
--     display_name and returns their nickname if they have one, else
--     falls back to the same real name. js/weekly.js shows
--     championNickname ?? champion to learners, and keeps comparing
--     against 'champion' (real name) for the "that's you!" highlight.
create or replace function public.cgg_weekly_results(p_name text, p_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare
  sid      uuid;
  lw_start timestamptz := date_trunc('week', now()) - interval '7 days';   -- last week's Monday (UTC, XP sums)
  lw_end   timestamptz := date_trunc('week', now());                       -- this week's Monday (exclusive)
  pw_start timestamptz := date_trunc('week', now()) - interval '14 days';  -- week-before Monday
  lw_sa    date := (date_trunc('week', now() at time zone 'Africa/Johannesburg'))::date - 7;  -- last SA Monday (daily counts)
  champ      text := nullif(btrim((select value from public.app_config where key = 'champion_name')), '');
  champ_nick text := case when champ is null then null
    else coalesce((select nullif(btrim(s2.nickname), '') from public.students s2 where s2.display_name = champ), champ)
  end;
  result   jsonb;
begin
  sid := public._cgg_auth(p_name, p_password);
  if sid is null then return jsonb_build_object('ok', false, 'error', 'auth'); end if;

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

-- C4. cgg_admin_weekly_results (phase10.sql's body) — same nickname/
--     avatarId additions on board/star/mostImproved/onFire/perfectWeekRoster
--     so the teacher's preview matches "exactly as learners see it" (the
--     existing doc comment on this RPC). 'champion' is left EXACTLY as-is
--     (the real display_name, no nickname lookup) — this is the one place
--     the brief calls out explicitly: admin keeps the real name.
create or replace function public.cgg_admin_weekly_results(p_admin_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare
  lw_start timestamptz := date_trunc('week', now()) - interval '7 days';
  lw_end   timestamptz := date_trunc('week', now());
  pw_start timestamptz := date_trunc('week', now()) - interval '14 days';
  lw_sa    date := (date_trunc('week', now() at time zone 'Africa/Johannesburg'))::date - 7;
  champ    text := nullif(btrim((select value from public.app_config where key = 'champion_name')), '');
  result   jsonb;
begin
  if not public._cgg_admin_ok(p_admin_password) then
    return jsonb_build_object('ok', false, 'error', 'auth');
  end if;

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

-- C5. cgg_admin_data (base = phase5.sql's body, NOT schema.sql's — phase5
--     deliberately replaced the raw 'password' field with a 'hasPassword'
--     boolean so learner passwords never reach the browser; that privacy
--     fix is preserved here) — 'nickname'/'avatarId' ADDED per row so the
--     dashboard can show them next to the (unchanged, still primary) real
--     'name'. Nothing else about the row shape changes.
create or replace function public.cgg_admin_data(p_admin_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare ws timestamptz; rows jsonb;
begin
  if not public._cgg_admin_ok(p_admin_password) then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  ws := public._cgg_week_start();

  with totals as (
    select s.id, s.display_name as name, (s.password is not null) as has_password, s.last_active_at, s.nickname, s.avatar_id,
           coalesce(sum(e.xp) filter (where e.created_at >= ws), 0) as wk,
           coalesce(sum(e.xp), 0) as al
    from public.students s left join public.xp_events e on e.student_id = s.id
    group by s.id, s.display_name, (s.password is not null), s.last_active_at, s.nickname, s.avatar_id
  ),
  ranked as (select *, rank() over (order by al desc) r from totals)
  select coalesce(jsonb_agg(jsonb_build_object(
      'id', id, 'name', name, 'hasPassword', has_password,
      'nickname', nickname, 'avatarId', avatar_id,
      'weeklyXp', wk, 'allTimeXp', al, 'rank', r, 'lastActive', last_active_at,
      'rounds', coalesce((select jsonb_object_agg(round_id, jsonb_build_object(
                    'best_score', best_score, 'attempts', attempts, 'passed', passed,
                    'last_played_at', last_played_at)) from public.progress p where p.student_id = ranked.id), '{}'::jsonb)
    ) order by al desc), '[]'::jsonb)
  into rows from ranked;

  return jsonb_build_object('ok', true, 'rows', rows, 'inactiveDays', 7);
end; $$;


-- ============================================================
--  PART D — GRANTS (matches the house style: re-declared after every
--  create-or-replace, plus the two new functions; anon still cannot
--  touch any table directly)
-- ============================================================
grant execute on function
  public.cgg_set_profile(text, text, text, text),
  public.cgg_admin_reset_nickname(text, uuid)
to anon, authenticated;

grant execute on function public.cgg_get_state(text, text) to anon, authenticated;
grant execute on function public.cgg_leaderboard(text, text) to anon, authenticated;
grant execute on function public.cgg_weekly_results(text, text) to anon, authenticated;
grant execute on function public.cgg_admin_weekly_results(text) to anon, authenticated;
grant execute on function public.cgg_admin_data(text) to anon, authenticated;


-- ============================================================
--  ROLLBACK — uncomment and run ONLY if you want to undo this.
--  Re-running schema.sql + phase8.sql + phase10.sql restores
--  cgg_get_state / cgg_leaderboard / cgg_admin_data / cgg_weekly_results /
--  cgg_admin_weekly_results to their pre-phase12 shape, then:
-- ============================================================
-- drop function if exists public.cgg_set_profile(text, text, text, text);
-- drop function if exists public.cgg_admin_reset_nickname(text, uuid);
-- alter table public.students drop column if exists nickname;
-- alter table public.students drop column if exists avatar_id;
