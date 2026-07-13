-- ============================================================
--  CIRCLE QUEST — PHASE 10 MIGRATION
--  Adds: the CIRCLE CHAMPION — a hand-picked, teacher's-choice honour
--        for the learner who plays the game the way it's meant to be
--        played: every day, steady, all the way through. Unlike the four
--        weekly awards (Star / Most Improved / On Fire / Perfect Week),
--        it is NOT a stat computed from last week's XP — so a frantic
--        catch-up day can never take it. The teacher sets it from the
--        admin dashboard; it stays until changed, and leads the Monday
--        "Results Day" popup as the hero award.
--
--  HOW IT WORKS:
--    • The pick is stored as a single row in the existing app_config
--      key/value table:  key = 'champion_name', value = the learner's
--      display_name.  Clearing it deletes the row.
--    • cgg_weekly_results / cgg_admin_weekly_results now also return
--      'champion' (the stored name, or null), so the client can show it.
--    • cgg_admin_set_champion(admin_pw, name) sets or clears the pick.
--
--  HOW TO RUN:
--    Supabase dashboard  ->  SQL Editor  ->  New query  ->
--    paste this WHOLE file  ->  Run.
--
--  SAFE to run on the live database, even while learners play:
--    • It REPLACES the two results functions (adding one field) and
--      CREATES one small setter. No tables are dropped or altered.
--    • Idempotent ("or replace"), so running it twice does no harm.
--    • The seed at the bottom uses "on conflict do nothing", so it only
--      sets the FIRST champion if none is set — it will never clobber a
--      pick the teacher later makes from the dashboard.
--    • Same security model: SECURITY DEFINER + server-side password checks.
--
--  Rollback notes are at the bottom.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Setter — award or clear the Circle Champion (admin only).
--    Pass a learner's display name to award it; pass null/'' to clear.
-- ------------------------------------------------------------
create or replace function public.cgg_admin_set_champion(p_admin_password text, p_name text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare v text := nullif(btrim(coalesce(p_name, '')), '');
begin
  if not public._cgg_admin_ok(p_admin_password) then
    return jsonb_build_object('ok', false, 'error', 'auth');
  end if;
  if v is null then
    delete from public.app_config where key = 'champion_name';
  else
    insert into public.app_config (key, value) values ('champion_name', v)
      on conflict (key) do update set value = excluded.value;
  end if;
  return jsonb_build_object('ok', true, 'champion', v);
end; $$;

grant execute on function public.cgg_admin_set_champion(text, text) to anon, authenticated;

-- ------------------------------------------------------------
-- 2. Weekly results (learner crown) — identical to phase9, PLUS a
--    'champion' field carrying the current teacher's-choice pick.
-- ------------------------------------------------------------
create or replace function public.cgg_weekly_results(p_name text, p_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare
  sid      uuid;
  lw_start timestamptz := date_trunc('week', now()) - interval '7 days';   -- last week's Monday (UTC, XP sums)
  lw_end   timestamptz := date_trunc('week', now());                       -- this week's Monday (exclusive)
  pw_start timestamptz := date_trunc('week', now()) - interval '14 days';  -- week-before Monday
  lw_sa    date := (date_trunc('week', now() at time zone 'Africa/Johannesburg'))::date - 7;  -- last SA Monday (daily counts)
  champ    text := nullif(btrim((select value from public.app_config where key = 'champion_name')), '');
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
    'champion', champ,
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
-- 3. Admin view — identical to phase9, PLUS the same 'champion' field.
-- ------------------------------------------------------------
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
    'perfectWeek', coalesce((select j from perfect), '[]'::jsonb),
    'champion', champ
  ) into result;

  return result;
end; $$;

grant execute on function public.cgg_admin_weekly_results(text) to anon, authenticated;

-- ------------------------------------------------------------
-- 4. Seed this term's first Circle Champion.
--    "on conflict do nothing" => this ONLY sets the pick if none exists,
--    so it will never overwrite a champion the teacher later chooses from
--    the dashboard. To change the champion, use the admin dashboard (or
--    update this row directly).
--    NOTE: the value must EXACTLY match the learner's display_name. If it
--    doesn't line up, just re-pick from the admin dashboard's roster list.
-- ------------------------------------------------------------
insert into public.app_config (key, value) values ('champion_name', 'a learner')
  on conflict (key) do nothing;

-- ============================================================
--  ROLLBACK — to undo, re-run phase9.sql (restores cgg_weekly_results and
--  cgg_admin_weekly_results without the 'champion' field), then:
--    drop function if exists public.cgg_admin_set_champion(text, text);
--    delete from public.app_config where key = 'champion_name';
-- ============================================================
