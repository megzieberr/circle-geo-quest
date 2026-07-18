-- ============================================================
--  CIRCLE QUEST — PHASE 11 MIGRATION
--  Adds: STREAK MILESTONES — a reward SPIKE at day 3 / 7 / 14 / 30 of the
--        day-streak, so the streak counter stops feeling like a number that
--        just goes up and instead has a few real "moments" in it. Day counts
--        and XP amounts mirror CONFIG.streakMilestones in js/config.js.
--
--  WHY SERVER-SIDE: the streak itself is 100% client-local (localStorage),
--  same as it's always been — this migration does NOT add a `streak` column
--  or move that logic to the server. It only adds the anti-farming guard for
--  the XP: without this, a learner could clear localStorage / reinstall and
--  replay the same milestone for free XP over and over. This closes that
--  hole the same way cgg_submit_daily already closes it for the daily XP
--  (a claimed-once marker on the student row) and the way badges already
--  close it (jsonb_agg(round_id) of passed rounds).
--
--  HOW TO RUN:
--    Supabase dashboard  ->  SQL Editor  ->  New query  ->
--    paste this WHOLE file  ->  Run.
--
--  This is SAFE to run on the live database, even while learners are
--  playing:
--    • It is ADDITIVE — one new column, one new function. It never drops or
--      rewrites any existing table or function, so nothing that works today
--      can break.
--    • Every statement is idempotent ("if not exists" / "or replace"), so
--      running it twice does no harm.
--    • Same security model as every other file here: SECURITY DEFINER,
--      search_path pinned, password checked via the existing _cgg_auth()
--      helper before anything is read or written.
--
--  A rollback block is at the very bottom (commented out).
-- ============================================================


-- ============================================================
--  PART A — STORAGE
-- ============================================================

-- A1. One new column: the list of streak-milestone day-thresholds this
--     learner has already been paid XP for (e.g. [3, 7]). Checked by the
--     function below before granting anything — this is the guard that
--     makes a milestone payable at most once, ever, per learner.
alter table public.students
  add column if not exists streak_milestones_awarded jsonb not null default '[]';


-- ============================================================
--  PART B — FUNCTION (the app calls this; you don't)
-- ============================================================

-- B1. Claim a streak milestone's XP. p_days is the streak length the
--     learner just reached client-side (3, 7, 14 or 30 — anything else is
--     rejected). The XP amount is a fixed lookup here, NOT taken from the
--     client, so a tampered client can request a day count but can never
--     pick its own XP. Idempotent: a day count already present in
--     streak_milestones_awarded grants nothing and just reports that back.
create or replace function public.cgg_award_streak_milestone(
  p_name text, p_password text, p_days int)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  sid     uuid;
  awarded jsonb;
  xp_amt  int;
begin
  sid := public._cgg_auth(p_name, p_password);
  if sid is null then
    return jsonb_build_object('ok', false, 'error', 'auth');
  end if;

  -- fixed server-side XP table — mirrors CONFIG.streakMilestones in
  -- js/config.js. Any p_days not in this list is not a real milestone.
  xp_amt := case p_days
    when 3  then 15
    when 7  then 30
    when 14 then 50
    when 30 then 100
    else null
  end;
  if xp_amt is null then
    return jsonb_build_object('ok', true, 'xpAwarded', 0, 'alreadyAwarded', true);
  end if;

  select streak_milestones_awarded into awarded from public.students where id = sid;
  awarded := coalesce(awarded, '[]'::jsonb);

  -- already paid out for this threshold — grant nothing (jsonb array
  -- containment: true if the scalar p_days is already an element of awarded)
  if awarded @> to_jsonb(p_days) then
    update public.students set last_active_at = now() where id = sid;
    return jsonb_build_object('ok', true, 'xpAwarded', 0, 'alreadyAwarded', true);
  end if;

  update public.students
     set streak_milestones_awarded = awarded || to_jsonb(p_days),
         last_active_at = now()
   where id = sid;

  insert into public.xp_events (student_id, round_id, xp, score)
  values (sid, 'streak', xp_amt, null);

  return jsonb_build_object('ok', true, 'xpAwarded', xp_amt, 'alreadyAwarded', false);
end; $$;


-- ============================================================
--  PART C — GRANTS (let the public key EXECUTE the new function,
--  exactly like the existing API; it still cannot touch any table)
-- ============================================================
grant execute on function
  public.cgg_award_streak_milestone(text, text, int)
to anon, authenticated;


-- ============================================================
--  ROLLBACK — uncomment and run ONLY if you want to undo this.
-- ============================================================
-- drop function if exists public.cgg_award_streak_milestone(text, text, int);
-- alter table public.students drop column if exists streak_milestones_awarded;
