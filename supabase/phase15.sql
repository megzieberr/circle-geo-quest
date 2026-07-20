-- ============================================================
--  CIRCLE QUEST — PHASE 15 MIGRATION
--  Adds cgg_admin_timeline: the per-ATTEMPT history the dashboard
--  has never had.
--
--  WHY (2026-07-20): cgg_admin_data returns only a SUMMARY per round
--  (best_score / attempts / passed / last_played_at). That summary
--  throws away the one thing that tells a teacher what to DO: the
--  shape of the attempts. A learner who went 40% → 60% → 65% → 100%
--  and a learner sitting flat on 65% for four tries both render as
--  "65%+, 4 attempts" — identical on screen, opposite advice. The
--  first is productive struggle (leave them alone, they're learning);
--  the second is a learner rehearsing the same error (step in).
--
--  Every submit already writes an xp_events row — including failed
--  attempts (they still earn XP) and zero-XP cutscene/discovery
--  rounds — so the full climb is sitting in the table already. This
--  function just hands it to the dashboard.
--
--  READ-ONLY and additive: no schema change, no existing function
--  touched, nothing else on the dashboard depends on it.
--
--  p_student_id null  -> recent events for the WHOLE class (powers the
--                        trajectory arrows in "Needs a hand")
--  p_student_id set   -> that learner's full timeline (the panel)
--
--  Learner passwords are never selected here (phase12 lesson).
--
--  NOTE: applied via the Supabase MCP on 2026-07-20.
-- ============================================================

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
