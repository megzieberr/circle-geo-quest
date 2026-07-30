-- ============================================================
--  CIRCLE QUEST — PHASE 17 MIGRATION
--  Adds cgg_admin_stuck: the "I don't get it" readout the dashboard
--  has never had.
--
--  WHY (2026-07-30): every tap of "I don't get it" already writes a
--  checker_calls row with verdict 'stuck' (phase16 + check-answer v4),
--  and there has never been a screen that reads them. The only way to
--  see them has been to ask for a hand-written query, which is no use
--  on a Sunday morning before class.
--
--  The signal this exists to surface: `answer` on a stuck row is
--  prefixed '[stuck:1]' / '[stuck:2]' / '[stuck:3]' for the rung the
--  learner reached, and what follows is whatever they had typed at the
--  time. An EMPTY answer after that prefix means they could not even
--  start — a panel that collects a lot of those is not asking clearly
--  enough, which is exactly what s3p4 was doing before it was reworded.
--
--  The marking verdicts for the same panel come back alongside, because
--  a panel with lots of stuck taps AND lots of got_it is a hard
--  question, while lots of stuck taps and nothing typed is a badly
--  worded one. They are different problems with different fixes.
--
--  ⚠️ READ-ONLY BY DESIGN. checker_calls is both the log AND the meter —
--  cgg_checker_claim counts rows in it to enforce the 20-marked-answers
--  -per-hour cap (and, since 2026-07-30, skips verdict 'stuck' so that
--  asking for help does not spend the marking budget). This function
--  contains no INSERT/UPDATE/DELETE of any kind, so the cap query is
--  untouched. Keep it that way: anything that WRITES to checker_calls
--  has to be checked against cgg_checker_claim first.
--
--  Learner passwords are never selected here (phase12 lesson).
--
--  NOTE: applied via the Supabase MCP on 2026-07-30.
-- ============================================================

create or replace function public.cgg_admin_stuck(
  p_admin_password text,
  p_days  int default 30,
  p_limit int default 500)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  since  timestamptz;
  lim    int;
  panels jsonb;
  marks  jsonb;
  detail jsonb;
  total  int;
begin
  if not public._cgg_admin_ok(p_admin_password) then
    return jsonb_build_object('ok', false, 'error', 'auth');
  end if;

  -- clamp both so a tampered client can't ask for the whole table
  since := now() - make_interval(days => least(greatest(coalesce(p_days, 30), 1), 400));
  lim   := least(greatest(coalesce(p_limit, 500), 1), 2000);

  with s as (
    select c.student_id,
           c.panel_id,
           -- '[stuck:2] ...' -> 2. NULL when the prefix is absent (shouldn't
           -- happen, but a missing rung must not silently count as rung 1).
           nullif(substring(c.answer from '^\[stuck:([0-9]+)\]'), '')::int as rung,
           -- what they had typed. regexp_replace leaves the string alone when
           -- the prefix is missing, so an unprefixed row keeps its full text.
           btrim(regexp_replace(coalesce(c.answer, ''), '^\[stuck:[0-9]+\]', '')) as typed,
           c.created_at
      from public.checker_calls c
     where c.verdict = 'stuck'
       and c.created_at > since
  ),
  -- per panel: who, how many taps, how many rode it to rung 3, and how many
  -- taps arrived with nothing typed at all (the loudest signal in the table)
  pnl as (
    select panel_id,
           count(distinct student_id) as learners,
           count(*) as taps,
           count(*) filter (where rung = 3) as rung3,
           count(*) filter (where typed = '') as blank,
           count(distinct student_id) filter (where typed = '') as blank_learners,
           max(created_at) as last_at
      from s
     group by panel_id
  ),
  -- the MARKING verdicts for the same window, so a hard question can be told
  -- apart from a badly worded one. 'stuck' is excluded (it is not a mark); a
  -- NULL verdict is a claim that never got its outcome recorded.
  mk as (
    select panel_id, verdict, count(*) as n, count(distinct student_id) as learners
      from public.checker_calls
     where created_at > since
       and verdict is not null
       and verdict <> 'stuck'
     group by panel_id, verdict
  ),
  -- the taps themselves, newest first, with the learner's name and their text
  det as (
    select s.student_id, st.display_name as name, s.panel_id, s.rung, s.typed, s.created_at
      from s
      join public.students st on st.id = s.student_id
     order by s.created_at desc
     limit lim
  )
  select
    (select count(*) from s),
    (select coalesce(jsonb_agg(jsonb_build_object(
              'panelId',       panel_id,
              'learners',      learners,
              'taps',          taps,
              'rung3',         rung3,
              'blank',         blank,
              'blankLearners', blank_learners,
              'lastAt',        last_at)
            order by learners desc, taps desc), '[]'::jsonb) from pnl),
    (select coalesce(jsonb_agg(jsonb_build_object(
              'panelId',  panel_id,
              'verdict',  verdict,
              'n',        n,
              'learners', learners)), '[]'::jsonb) from mk),
    (select coalesce(jsonb_agg(jsonb_build_object(
              'studentId', student_id,
              'name',      name,
              'panelId',   panel_id,
              'rung',      rung,
              'text',      typed,
              'at',        created_at)
            order by created_at desc), '[]'::jsonb) from det)
  into total, panels, marks, detail;

  return jsonb_build_object(
    'ok', true,
    'days', least(greatest(coalesce(p_days, 30), 1), 400),
    'total', total,          -- stuck taps in the window; `rows` may be capped at `lim`
    'panels', panels,
    'marks', marks,
    'rows', detail,
    'serverNow', now());
end; $$;

-- functions are executable by PUBLIC unless revoked, so `public` must be in
-- this list or the function stays callable by anon (phase15 convention)
revoke all on function public.cgg_admin_stuck(text, int, int) from public, anon, authenticated;
grant execute on function public.cgg_admin_stuck(text, int, int) to anon, authenticated;
