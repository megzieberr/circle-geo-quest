-- ============================================================
--  CIRCLE QUEST — PHASE 8 MIGRATION
--  Adds: an ADMIN view of the "Star of the Week" results, so the
--        teacher dashboard can show last week's real winners (the
--        same crown announcement the learners get on Mon/Tue) —
--        screenshot-ready for the class WhatsApp group.
--
--  HOW TO RUN:
--    Supabase dashboard  ->  SQL Editor  ->  New query  ->
--    paste this WHOLE file  ->  Run.
--
--  SAFE to run on the live database, even while learners play:
--    • ADDITIVE — it only CREATES one new function. It never drops
--      or rewrites any existing table or function.
--    • Idempotent ("or replace"), so running it twice does no harm.
--    • No new tables: it reads the existing xp_events table, exactly
--      like cgg_weekly_results (phase 3). Nothing new is stored.
--    • Same security model: SECURITY DEFINER + the server-side admin
--      password check every other admin RPC uses (_cgg_admin_ok).
--
--  A rollback line is at the bottom (commented out).
-- ============================================================

-- Same computation as cgg_weekly_results (phase3.sql), but authenticated
-- with the ADMIN password instead of a learner login, and without any
-- learner-personal fields (me / prevRank / bestPrevXp — there is no "me").
--
--  • Star of the Week — highest weekly XP last week.
--  • Most Improved    — biggest jump vs the week before (EXCLUDES the
--                       Star, so a different learner is celebrated).
--  • On Fire          — most Daily Challenges completed last week
--                       (EXCLUDES the Star and Most Improved → a third
--                       learner).
--
--  Returns names + XP only (never passwords), exactly like the learner RPC.
create or replace function public.cgg_admin_weekly_results(p_admin_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare
  lw_start timestamptz := date_trunc('week', now()) - interval '7 days';   -- last week's Monday
  lw_end   timestamptz := date_trunc('week', now());                       -- this week's Monday (exclusive)
  pw_start timestamptz := date_trunc('week', now()) - interval '14 days';  -- week-before Monday
  result   jsonb;
begin
  if not public._cgg_admin_ok(p_admin_password) then
    return jsonb_build_object('ok', false, 'error', 'auth');
  end if;

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
    'onFire', (select jsonb_build_object('name', name, 'days', days) from fire)
  ) into result;

  return result;
end; $$;

grant execute on function public.cgg_admin_weekly_results(text) to anon, authenticated;

-- ============================================================
--  ROLLBACK — uncomment and run ONLY if you want to undo this.
-- ============================================================
-- drop function if exists public.cgg_admin_weekly_results(text);
