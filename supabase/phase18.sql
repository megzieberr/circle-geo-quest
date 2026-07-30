-- ============================================================
--  CIRCLE QUEST — PHASE 18 MIGRATION
--  Replays pay XP again — two paid replays per round, at half rate.
--
--  WHY (2026-07-30, Megan's call): a passed round paid 0 forever, so there
--  was no reason to ever go back to one. She wants the class revisiting
--  rounds while the next batch is built, so a second look should be worth
--  something — just never worth MORE than pushing into a new round, or the
--  weekly board stops measuring progress and starts measuring grinding.
--  Hence HALF, and hence a ceiling.
--
--  ⚠️ WHY THE COUNTER IS A COLUMN AND NOT A COUNT OF xp_events.
--  The obvious implementation — "count paid xp_events for this round, pay
--  half for the 2nd and 3rd" — is WRONG on this data, and the live table
--  proves it. Under the old rules a FAILED attempt on a not-yet-passed
--  round still earned XP (js/game.js gated on `alreadyPassed`, not on
--  passing), so a learner who failed a round twice before passing already
--  has three paid events on it. Measured on 2026-07-30 before this shipped:
--  60 learner-round pairs across 18 of the 21 learners were already at 3+.
--  Those are precisely the rounds each learner found HARDEST — so that
--  version would have paid nothing for revisiting the rounds most worth
--  revisiting, and full value for the ones they aced. Exactly backwards.
--
--  So the allowance counts REPLAYS, not plays: a paid play on a round that
--  was ALREADY passed. The column starts at 0 for everyone, which is
--  historically accurate (replays have paid nothing until today), so all 21
--  learners begin tomorrow with a clean two goes per round whatever their
--  history. Attempts before the pass are untouched and still pay in full —
--  struggling toward a first pass was never the thing being limited.
--
--  ⚠️ WHERE THE RULE LIVES, AND WHY IT MOVED. Until today "a replay pays
--  nothing" was enforced in the CLIENT (js/game.js), and the server added
--  p_xp whatever it was told — noted in the 2026-07-30 status entry as
--  "the protection is real but lives one layer up". Opening replays up
--  means the client can no longer hold the ceiling, so the count moves
--  here, where a learner with devtools cannot reach it. Consistent with the
--  2026-07-18 ruling that anti-cheat here is detection, not prevention:
--  this does not make faking XP harder, it stops an HONEST learner from
--  farming one easy round all evening.
--
--  NOTE ON THE NEW COLUMN: `progress` has NO table or column grants for
--  anon/authenticated (verified) — it is reached only through SECURITY
--  DEFINER functions — so unlike a granted table this column needs no grant
--  of its own. Check that again before adding a column to a granted table.
--
--  Based on the LIVE definition via pg_get_functiondef, not on schema.sql
--  (the phase12 lesson).
--
--  NOTE: applied via the Supabase MCP on 2026-07-30.
-- ============================================================

alter table public.progress
  add column if not exists paid_replays int not null default 0;

comment on column public.progress.paid_replays is
  'How many REPLAYS of this round have been paid XP (max 2, half rate each). A replay is a paid play on a round that was already passed; attempts before the first pass are not counted here and always pay in full.';

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

  select passed, paid_replays into was_passed, used
    from public.progress where student_id = sid and round_id = p_round;
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

revoke all on function public.cgg_submit_round(text, text, text, numeric, integer, integer, integer) from public, anon, authenticated;
grant execute on function public.cgg_submit_round(text, text, text, numeric, integer, integer, integer) to anon, authenticated;
