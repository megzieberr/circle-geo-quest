-- ============================================================
--  CIRCLE QUEST — PHASE 16 MIGRATION
--  Investigation Station: server-side memos + checker call log.
--
--  WHY (2026-07-30): Investigation Station adds typed answers, marked
--  by an edge function that calls the Claude API. Two things have to
--  live in the database rather than in js/:
--
--    1. THE MEMOS. Every other answer in this app is a tap, so the
--       answer key can safely ship in js/ — you cannot read a memo off
--       a multiple-choice option. A typed panel is different: if the
--       memo ships in js/, a learner with devtools reads the answer.
--       This is the single most important constraint in the feature.
--
--    2. A COST CAP. Panels retry without limit by design (the never-
--       stuck ladder). Unlimited retries x a paid API call is unbounded
--       spend, so the call has to be counted somewhere the client
--       cannot lie about.
--
--  Both tables are RLS-enabled with NO policy and revoked from anon /
--  authenticated, matching every other table in this schema: the app
--  reaches them only through SECURITY DEFINER functions and the edge
--  function's service-role client.
--
--  NOT YET APPLIED — see PROJECT-STATUS "Pending on Megan".
-- ============================================================


-- ------------------------------------------------------------
--  1. Memos for typed panels
-- ------------------------------------------------------------
--  panel_id is the join key to the `written` panel in js/rounds/,
--  of the form s<station><panel> — e.g. "s4p5" = station 4, panel 5.
--
--  ONE ROW PER PANEL, not one per language. The checker compares
--  mathematical CONTENT and is explicitly told to accept English,
--  Afrikaans or a mix, so a single memo serves both. Where the answer
--  is itself a language-specific string (a reason short form), the
--  memo lists the accepted forms in both languages — see s4p5.
create table if not exists public.panel_memos (
  panel_id   text primary key,
  memo       text not null,              -- the mathematical content that must be present
  must_have  text not null,              -- newline-separated; ALL required for "got_it"
  lang       text not null default 'en', -- language the memo is WRITTEN in (reference only)
  updated_at timestamptz not null default now()
);

alter table public.panel_memos enable row level security;
-- deliberately NO policy: anon / authenticated get nothing at all.
revoke all on public.panel_memos from anon, authenticated;


-- ------------------------------------------------------------
--  2. Checker call log — rate limiting + teacher review
-- ------------------------------------------------------------
--  verdict is whatever the model returned (got_it / partly / not_yet /
--  unclear), plus two the app writes itself:
--    'rate'     — cap hit, no API call was made, nothing was billed
--    'override' — learner tapped "I think my answer was right"
--  `answer` is learner-authored text. Purge at the end of term:
--    delete from public.checker_calls where created_at < '2026-12-01';
create table if not exists public.checker_calls (
  id          bigserial primary key,
  student_id  uuid not null references public.students(id) on delete cascade,
  panel_id    text not null,
  verdict     text,
  answer      text,
  created_at  timestamptz not null default now()
);

create index if not exists checker_calls_student_time
  on public.checker_calls (student_id, created_at desc);

alter table public.checker_calls enable row level security;
revoke all on public.checker_calls from anon, authenticated;


-- ------------------------------------------------------------
--  3. Claim a checker call (atomic cost cap)
-- ------------------------------------------------------------
--  The plan had the edge function COUNT rows and then decide. That
--  races: two taps landing together both read 19, both pass, both bill.
--  Putting the count and the insert in one statement does NOT fix that
--  on its own — under READ COMMITTED both transactions still read 19,
--  because a count takes no lock. So take a per-learner advisory lock
--  first: it serialises that learner's claims for the length of the
--  transaction and costs nothing, since claims for different learners
--  hash to different keys and never wait on each other.
--
--  Returns { allowed, used, cap, callId }. When allowed is false the
--  caller must NOT call the API; the app falls back to static hints and
--  the learner sees no error (js/investigate.js never dead-ends).
--
--  Callable only by the service role — the edge function. Not granted
--  to anon / authenticated, so a learner cannot burn their own quota.
create or replace function public.cgg_checker_claim(
  p_student_id uuid,
  p_panel_id   text,
  p_cap        int      default 20,
  p_window     interval default interval '1 hour')
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  cap     int;
  used    int;
  new_id  bigint;
begin
  if p_student_id is null or p_panel_id is null then
    return jsonb_build_object('allowed', false, 'error', 'args');
  end if;

  -- clamp so a bad caller can't raise its own ceiling
  cap := least(greatest(coalesce(p_cap, 20), 1), 100);

  -- serialise this learner's claims for the rest of the transaction;
  -- released automatically at commit/rollback, so no leak on an error
  perform pg_advisory_xact_lock(hashtext('cgg_checker:' || p_student_id::text));

  -- now the count is stable: only one claim for this learner can be
  -- between the count and the insert at a time
  with recent as (
    select count(*) as n
      from public.checker_calls
     where student_id = p_student_id
       and created_at > now() - p_window
  ), claimed as (
    insert into public.checker_calls (student_id, panel_id)
    select p_student_id, p_panel_id from recent where n < cap
    returning id
  )
  select (select n from recent), (select id from claimed)
    into used, new_id;

  return jsonb_build_object(
    'allowed', new_id is not null,
    'used',    used,
    'cap',     cap,
    'callId',  new_id);
end $$;

-- Record the outcome against the claimed row. Split from the claim so a
-- crash mid-API-call still leaves the call counted (fail closed on cost).
create or replace function public.cgg_checker_record(
  p_call_id bigint,
  p_verdict text,
  p_answer  text)
returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  update public.checker_calls
     set verdict = left(coalesce(p_verdict, ''), 32),
         answer  = left(coalesce(p_answer, ''), 600)
   where id = p_call_id;
end $$;

-- functions are executable by PUBLIC unless revoked, so `public` must be in
-- this list or the two above stay callable by anon (phase15 convention)
revoke all on function public.cgg_checker_claim(uuid, text, int, interval) from public, anon, authenticated;
revoke all on function public.cgg_checker_record(bigint, text, text)       from public, anon, authenticated;


-- ------------------------------------------------------------
--  4. Memo seeds — Station 4 "Prove It" (IEB SBA task type #9)
-- ------------------------------------------------------------
--  Shared figure for both typed panels:
--    AB is a DIAMETER of the circle with centre O. C is on the circle.
--    Angle ABC = 50 degrees. Both learners correctly find angle BAC = 40 degrees.

insert into public.panel_memos (panel_id, memo, must_have) values
(
  's4p4',
  'The shorter proof spotted that AB is a diameter, so angle ACB is an angle in a semi-circle and is 90 degrees in ONE step. From there only the angle sum of triangle ABC is needed: angle BAC = 180 - 90 - 50 = 40 degrees.' || chr(10) ||
  'The longer proof reached the same 90 degrees the slow way: it drew the radius OC, used OB = OC and OA = OC (radii) to make two isosceles triangles, found their base angles, and added them. Same answer, three extra steps, three extra places to lose a mark.',
  'says the shorter proof used the fact that AB is a diameter, OR that angle ACB = 90 degrees' || chr(10) ||
  'names the semi-circle theorem as the shortcut (angle in a semi-circle / diameter subtends a right angle), however it is worded'
),
(
  's4p5',
  'The missing reason for the step "angle ACB = 90 degrees" is the angle-in-a-semi-circle theorem.' || chr(10) ||
  'IEB Appendix G accepts ANY of these English forms:' || chr(10) ||
  '  angle s in semi-circle  /  diameter subtends right angle  /  angle in half circle (written with the half symbol)' || chr(10) ||
  'and ANY of these Afrikaans forms:' || chr(10) ||
  '  hoek in halwe sirkel  /  middellyn onderspan regte hoek' || chr(10) ||
  'Accept any of them, in either language, however misspelled. Do NOT accept a different theorem (angle at centre = 2 x angle at circumference, angles in the same segment, tan chord theorem) even though those are real theorems about this figure.',
  'names the semi-circle / diameter-subtends-90 reason in one of the accepted forms, in either language' || chr(10) ||
  'does NOT name a different theorem instead'
)
on conflict (panel_id) do update
  set memo       = excluded.memo,
      must_have  = excluded.must_have,
      updated_at = now();
