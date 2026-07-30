-- ============================================================
--  CIRCLE QUEST — PHASE 19 MIGRATION
--  Adds: CGG_GET_STREAK — the day-streak becomes SERVER-COMPUTED.
--
--  WHY: a learner reported it (2026-07-25, and they are right): the
--  streak lived only in one browser's localStorage, so doing Monday's
--  Daily on a phone and Tuesday's on a laptop showed streak = 1 on the
--  laptop. The server has always known the truth — every first daily
--  completion of a day writes an xp_events row with round_id = 'daily'
--  (cgg_submit_daily, phase2/phase9) — it just never added the days up.
--  This function adds them up. The client now treats this number as the
--  truth and keeps localStorage only as an offline fallback, so the
--  same streak shows on every device, and this learner's "broken"
--  streak comes back by itself, retroactively.
--
--  HOW TO RUN:
--    Supabase dashboard  ->  SQL Editor  ->  New query  ->
--    paste this WHOLE file  ->  Run.
--
--  SAFE to run on the live database, even while learners play:
--    • It only CREATES one new function. No tables are created,
--      dropped or altered; no data is touched.
--    • The function is READ-ONLY: no INSERT/UPDATE/DELETE anywhere,
--      it does not even touch last_active_at.
--    • Idempotent ("or replace"), so running it twice does no harm.
--    • Same security model as always: SECURITY DEFINER + the throttled
--      _cgg_auth password check (phase13).
--
--  SEMANTICS (mirrors what the client always meant by "streak"):
--    • A "day" is a distinct Africa/Johannesburg calendar day with a
--      round_id = 'daily' xp_events row — the same SA-day rule
--      phase9's Perfect Week already uses, so the two can never
--      disagree about what counts as a played day.
--    • streak    = length of the consecutive run ending today, or
--                  ending yesterday if today's daily isn't done yet
--                  (the streak is still "alive" until midnight).
--                  0 if the last daily was before yesterday.
--    • best      = the longest consecutive run ever.
--    • doneToday = whether today (SA time) is already claimed.
--    • lastDay   = the most recent claimed day, as YYYY-MM-DD.
--
--  KNOWN LIMIT, accepted: a daily finished OFFLINE never reached
--  cgg_submit_daily, so it earns no xp_events row and no streak credit
--  — exactly as it already earns no daily XP and no Perfect Week
--  credit. The server cannot count a day it was never told about.
--
--  Rollback note is at the bottom.
-- ============================================================

create or replace function public.cgg_get_streak(p_name text, p_password text)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  sid    uuid;
  today  date := (now() at time zone 'Africa/Johannesburg')::date;
  cur    int;
  top    int;
  done   boolean;
  last_d date;
begin
  sid := public._cgg_auth(p_name, p_password);
  if sid is null then
    return jsonb_build_object('ok', false, 'error', 'auth');
  end if;

  -- Gaps-and-islands: d minus its row number is constant within a run of
  -- consecutive dates, so grouping by that difference yields one row per
  -- unbroken run. At most ONE run can end at today or yesterday (if both
  -- dates were played they are in the same run), so the `cur` pick is
  -- unambiguous; `order by end_d desc limit 1` is belt-and-braces.
  with days as (
    select distinct (e.created_at at time zone 'Africa/Johannesburg')::date as d
    from public.xp_events e
    where e.student_id = sid and e.round_id = 'daily'
  ),
  runs as (
    select max(d) as end_d, count(*)::int as len
    from (select d, d - (row_number() over (order by d))::int as grp from days) g
    group by grp
  )
  select
    coalesce((select len from runs where end_d >= today - 1 order by end_d desc limit 1), 0),
    coalesce((select max(len) from runs), 0),
    exists (select 1 from days where d = today),
    (select max(d) from days)
  into cur, top, done, last_d;

  return jsonb_build_object(
    'ok', true, 'streak', cur, 'best', top, 'doneToday', done,
    'lastDay', case when last_d is null then null else to_char(last_d, 'YYYY-MM-DD') end);
end; $$;

grant execute on function public.cgg_get_streak(text, text) to anon, authenticated;

-- ============================================================
--  ROLLBACK — to undo phase19:
-- ============================================================
-- drop function if exists public.cgg_get_streak(text, text);
