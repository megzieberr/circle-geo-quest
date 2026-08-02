-- ============================================================
--  PHASE 20 — the paid-replay cap must HOLD the row it counts
-- ------------------------------------------------------------
--  Symptom (live data, 2026-08-01): one learner's inv4 row read
--  8 attempts / 240 XP / paid_replays = 4, on a station she
--  completed cleanly the first time. The cap is 2.
--
--  Cause: phase18 read the counter, decided, then wrote —
--
--      select passed, paid_replays into was_passed, used     -- unlocked
--      ...
--      if used >= max_replays then award := 0;               -- decided here
--      ...
--      paid_replays = public.progress.paid_replays + bump    -- written here
--
--  Nothing holds the row between the read and the write. Eight
--  submits arriving together all read paid_replays before any of
--  them committed, so the first four each saw "under the cap"
--  and each paid a half-rate replay. The xp_events row for that
--  play reads 80, 40, 40, 40, 40, 0, 0, 0 — the cap engaging
--  four goes late. The ON CONFLICT UPDATE was never the problem:
--  it is atomic and accumulated `bump` correctly. `bump` had
--  already been decided from a stale read.
--
--  Fix: `for update`. The first caller in holds the progress row
--  until it commits; the rest queue and read a true count. One
--  word, and the cap means 2 again.
--
--  Why this went unnoticed since 2026-07-30: real replays are
--  MINUTES apart, so the window never opened. It took the client
--  bug fixed alongside this (investigate.js left Continue live
--  during the async submit, so extra taps each fired a whole
--  fresh submit) to deliver eight submits inside 938ms. Either
--  fault alone is near-harmless; they only bite together. The
--  client guard stops the bursts, this stops a burst being
--  profitable if one ever happens again.
--
--  No lock-order risk: every path through this function takes
--  progress -> xp_events -> students, in that order, so
--  concurrent callers queue rather than deadlock. On a FIRST
--  play no row exists yet, `for update` locks nothing, and the
--  INSERT ... ON CONFLICT stays atomic on its own — that case
--  never consumed a replay anyway (was_passed is false).
--
--  Body is otherwise byte-identical to the LIVE definition read
--  via pg_get_functiondef on 2026-08-02, not to schema.sql
--  (the phase12 lesson). Only the one `for update` is new.
-- ============================================================

create or replace function public.cgg_submit_round(
  p_name text, p_password text, p_round text,
  p_score numeric, p_xp integer, p_total integer, p_correct integer)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  sid          uuid;
  was_passed   boolean := false;
  now_passed   boolean;
  used         int := 0;      -- replays of this round already paid
  award        int;
  bump         int := 0;      -- 1 when this submit consumes a paid replay
  max_replays  constant int := 2;
begin
  sid := public._cgg_auth(p_name, p_password);
  if sid is null then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  now_passed := (p_score >= 0.8);

  -- `for update` is the whole fix: hold this row from the read that decides
  -- the award through to the write that records it, so two submits landing
  -- together cannot both spend the same remaining replay.
  select passed, paid_replays into was_passed, used
    from public.progress where student_id = sid and round_id = p_round
    for update;
  was_passed := coalesce(was_passed, false);
  used       := coalesce(used, 0);

  award := least(greatest(coalesce(p_xp, 0), 0), 500);   -- pre-existing clamp
  if was_passed then
    if used >= max_replays then
      award := 0;
    else
      award := award / 2;                                -- integer division, rounds down
      -- a replay that earns nothing (all wrong) must not burn one of the two goes
      if award > 0 then bump := 1; end if;
    end if;
  end if;

  insert into public.progress (student_id, round_id, best_score, attempts, total_xp, passed, last_played_at, paid_replays)
  values (sid, p_round, p_score, 1, award, now_passed, now(), bump)
  on conflict (student_id, round_id) do update set
    best_score   = greatest(public.progress.best_score, excluded.best_score),
    attempts     = public.progress.attempts + 1,
    total_xp     = public.progress.total_xp + excluded.total_xp,
    passed       = public.progress.passed or excluded.passed,
    paid_replays = public.progress.paid_replays + bump,
    last_played_at = now();

  insert into public.xp_events (student_id, round_id, xp, score) values (sid, p_round, award, p_score);
  update public.students set last_active_at = now() where id = sid;

  return jsonb_build_object(
    'ok', true,
    'passed', now_passed,
    'badgeEarned', (now_passed and not was_passed),
    'xpAwarded', award,
    'replaysLeft', greatest(max_replays - (used + bump), 0),
    'alreadyPassed', was_passed);
end; $$;
