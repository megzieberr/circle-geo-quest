-- ============================================================
--  CIRCLE QUEST — PHASE 3 MIGRATION
--  Adds: the "Star of the Week" weekly results, computed
--        server-side and authoritatively for every learner.
--
--  HOW TO RUN:
--    Supabase dashboard  ->  SQL Editor  ->  New query  ->
--    paste this WHOLE file  ->  Run.
--
--  SAFE to run on the live database, even while learners play:
--    • ADDITIVE — it only CREATES one new function. It never drops
--      or rewrites any existing table or function.
--    • Idempotent ("or replace"), so running it twice does no harm.
--    • No new tables: it reads the existing xp_events table (which
--      already timestamps every XP award and tags Daily Challenges
--      with round_id = 'daily'). Nothing new is stored.
--    • Same security model: SECURITY DEFINER + server-side password
--      check; the anon key still cannot touch any table directly.
--
--  A rollback line is at the bottom (commented out).
-- ============================================================

-- Last week's settled results + the three weekly awards + the caller's
-- own finish. "Last week" is the previous Monday->Sunday calendar week
-- (date_trunc('week', now()) is Monday 00:00, matching the leaderboard).
--
--  • Star of the Week — highest weekly XP last week.
--  • Most Improved    — biggest jump vs the week before (EXCLUDES the
--                       Star, so a different learner is celebrated).
--  • On Fire          — most Daily Challenges completed last week
--                       (EXCLUDES the Star and Most Improved → a third
--                       learner). Daily completions are xp_events rows
--                       with round_id = 'daily', one per local day.
--
--  Returns names + XP only (never passwords), exactly like the
--  leaderboard. Awards go to distinct learners so the dopamine spreads.
create or replace function public.cgg_weekly_results(p_name text, p_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare
  sid      uuid;
  lw_start timestamptz := date_trunc('week', now()) - interval '7 days';   -- last week's Monday
  lw_end   timestamptz := date_trunc('week', now());                       -- this week's Monday (exclusive)
  pw_start timestamptz := date_trunc('week', now()) - interval '14 days';  -- week-before Monday
  result   jsonb;
begin
  sid := public._cgg_auth(p_name, p_password);
  if sid is null then return jsonb_build_object('ok', false, 'error', 'auth'); end if;

  with weekly as (
    select s.id, s.display_name as name,
      coalesce(sum(e.xp) filter (where e.created_at >= lw_start and e.created_at < lw_end), 0) as lw,
      coalesce(sum(e.xp) filter (where e.created_at >= pw_start and e.created_at < lw_start), 0) as pw,
      coalesce(count(*)  filter (where e.round_id = 'daily'
                                   and e.created_at >= lw_start and e.created_at < lw_end), 0) as daily_days
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
    order by daily_days desc, name limit 1
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

-- ============================================================
--  ROLLBACK — uncomment and run ONLY if you want to undo this.
-- ============================================================
-- drop function if exists public.cgg_weekly_results(text, text);
