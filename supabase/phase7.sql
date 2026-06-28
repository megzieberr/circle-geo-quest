-- ============================================================
--  CIRCLE QUEST — PHASE 7 MIGRATION
--  Adds a "Learners" count to the teacher "Hardest questions" report.
--
--  WHY:
--    The report's "Attempts" column counts every first-try answer
--    event. A question can show e.g. 15 attempts whether that is 15
--    different learners OR a handful retrying. This adds the number of
--    DISTINCT learners who tried each question, so you can tell those
--    apart at a glance ("12 learners · 15 attempts").
--
--  WHAT THIS DOES:
--    CREATE OR REPLACE on one function (cgg_admin_item_stats) to add a
--    'learners' field. No tables touched, no data changed.
--
--  HOW TO RUN:
--    Supabase dashboard -> SQL Editor -> New query -> paste this WHOLE
--    file -> Run. ("Success. No rows returned" is the correct result.)
--
--  SAFE on the live database: only replaces one function, idempotent,
--  and the dashboard works before AND after running it (it falls back
--  gracefully when 'learners' is absent).
-- ============================================================

create or replace function public.cgg_admin_item_stats(p_admin_password text)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare result jsonb;
begin
  if not public._cgg_admin_ok(p_admin_password) then
    return jsonb_build_object('ok', false, 'error', 'auth');
  end if;

  with first_only as (
    select * from public.question_events where first_try
  ),
  agg as (
    select question_id as qid,
           max(round_id) as round_id,
           count(*)                              as attempts,
           count(distinct student_id)            as learners,
           count(*) filter (where correct)       as correct,
           round(100.0 * count(*) filter (where correct) / nullif(count(*), 0)) as correct_pct
    from first_only
    group by question_id
  ),
  wrongs as (
    select question_id as qid, chosen, count(*) as c,
           row_number() over (partition by question_id order by count(*) desc) as rn
    from first_only
    where not correct and chosen is not null
    group by question_id, chosen
  )
  select coalesce(jsonb_agg(jsonb_build_object(
            'qid',           a.qid,
            'roundId',       a.round_id,
            'attempts',      a.attempts,
            'learners',      a.learners,
            'correct',       a.correct,
            'correctPct',    a.correct_pct,
            'topWrong',      w.chosen,
            'topWrongCount', coalesce(w.c, 0)
          ) order by a.correct_pct asc nulls last, a.attempts desc), '[]'::jsonb)
    into result
  from agg a
  left join wrongs w on w.qid = a.qid and w.rn = 1;

  return jsonb_build_object('ok', true, 'rows', result);
end; $$;

grant execute on function public.cgg_admin_item_stats(text) to anon, authenticated;
