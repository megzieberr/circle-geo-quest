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
--  APPLIED to live 2026-07-30 (sections 1-5) and verified. Sections 6-9 are
--  the memo rows for Stations 1, 3, 5 and 6, added when those stations were
--  built. The whole file is idempotent — `create table if not exists`,
--  `create or replace function`, and `on conflict (panel_id) do update` — so
--  re-running it is safe and is how a memo edit gets to live.
--
--  NOTE ON QUOTING: sections 4 and 5 use ordinary '...' literals with
--  chr(10) for newlines. Sections 6-9 use dollar-quoted $m$...$m$ strings
--  with real newlines instead, because their accept-lists carry a lot of
--  Afrikaans and every 'n would otherwise have to be hand-doubled — one
--  missed pair silently changes a memo's meaning.
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


-- ------------------------------------------------------------
--  5. Memo seeds — Station 2 "State the Conjecture" (IEB SBA task type #15)
-- ------------------------------------------------------------
--  Shared figure: chord AB in a circle. P and Q both on the arc ABOVE AB, so
--  angle APB = angle AQB. The last panel drags Q onto the arc BELOW AB, where
--  the two angles become supplementary instead.
--
--  NOTE ON MUST_HAVE WORDING (learned the hard way, 2026-07-30): the checker
--  marks against must_have and reads memo only as background. So must_have has
--  to be a MARK SCHEME — the smallest set of ideas that earns the tick — not a
--  summary of the memo. Anything listed here that the panel did not actually
--  ask for will get real learners marked down.

insert into public.panel_memos (panel_id, memo, must_have) values
(
  's2p4',
  'Angles subtended by the same chord (or the same arc), at the circumference of the circle and in the same segment, are equal.' || chr(10) ||
  'The three conditions all earn their place. "At the circumference" keeps out the angle at the centre, which is double rather than equal. "In the same segment" (equivalently: on the same side of the chord) is essential, because an angle on the far arc is supplementary to these, not equal. And the claim is about EVERY position, not the positions that happened to be measured.' || chr(10) ||
  'The IEB Appendix G short reason is "angle s in the same seg" (Afrikaans: "hoeke in dieselfde segment").',
  'says the angles are EQUAL' || chr(10) ||
  'says they stand on / are subtended by the SAME chord or the same arc' || chr(10) ||
  'says WHERE the angles are. ACCEPT any one of these, and treat them as fully equivalent: "at the circumference" / "on the circle" / "on the circumference" / "in the same segment" / "on the same arc" / "by die omtrek" / "op die sirkel" / "in dieselfde segment" / "op dieselfde boog". Any one of them alone satisfies this line — do not ask for a second one. Count it as MISSING only when the answer''s sole location wording is "on the same side of the chord" (or "aan dieselfde kant"), because the angle at the centre is on that side too and is double.' || chr(10) ||
  'IGNORE how general the sentence sounds and ignore whether it uses letters; if the three ideas above are present in any wording, in either language, it is got_it'
),
(
  's2p5',
  'Once Q is dragged onto the other arc, the two angles are SUPPLEMENTARY: angle APB + angle AQB = 180 degrees, no matter where A, B, P and Q are dragged.' || chr(10) ||
  'The reason is that A, P, B, Q now lie on the circle in that order, so APBQ is a cyclic quadrilateral and angle P and angle Q are its opposite angles. Opposite angles of a cyclic quadrilateral are supplementary.' || chr(10) ||
  'The teaching point of the panel is that this is the SAME theorem as angles in the same segment, seen from the other side of the chord — not a separate fact.',
  'says the two angles ADD UP TO 180 degrees, or says they are supplementary (either wording alone is enough)' || chr(10) ||
  'the learner does NOT have to mention cyclic quadrilaterals, opposite angles, or any theorem name — noticing the sum is the whole ask'
)
on conflict (panel_id) do update
  set memo       = excluded.memo,
      must_have  = excluded.must_have,
      updated_at = now();


-- ------------------------------------------------------------
--  6. Memo seed — Station 1 "Measure & Notice" (IEB SBA task type #16)
-- ------------------------------------------------------------
--  Figure: chord AB in a circle, centre O, with P on the major arc, so the
--  angle AOB at the centre is double the angle APB at the circumference. The
--  learner has dragged it, written the conjecture down, and read a table of
--  five measured pairs — three exactly double, one 2 degrees out (a protractor
--  reading), one impossible.
--
--  MARK SCHEME, NOT A SUMMARY. The panel asks two things only: yes-or-no, and
--  one reason. It does NOT ask for a proof, for a theorem name, or for the
--  "infinitely many cases" argument specifically — so any one sound reason
--  takes the tick. Listing more here would mark down learners who answered
--  exactly what was asked.

insert into public.panel_memos (panel_id, memo, must_have) values
(
  's1p4',
  $m$No. Measuring can only ever check the positions that were actually measured. A, B and P can be dragged to endlessly many other positions, so a table of five rows - or five hundred - leaves out all the rest, and the conjecture is a claim about every one of them.
On top of that, every protractor reading carries error. The row reading 96 degrees and 49 degrees is 2 degrees away from exactly double, which is what reading to the nearest degree does. So even the measured cases were only "double as far as I could read it".
Only a proof covers every position at once. The IEB Subject Assessment Guidelines put it in one line: numerous specific examples supporting a conjecture do not constitute a general proof.$m$,
  $m$says NO - the measurements have not proved it. ACCEPT any wording that answers no: "no", "not proved", "not yet proved", "you have only tested it", "nee", "dit is nie bewys nie", "nog nie bewys nie", "jy het dit net getoets".
gives ONE reason why measuring is not a proof. ACCEPT ANY ONE of the following, and treat them as fully equivalent: (a) only the measured cases or positions have been checked, or there are infinitely many other positions, or you cannot measure them all - "net die gevalle wat gemeet is", "daar is oneindig baie posisies", "jy kan nie almal meet nie"; (b) measurement is not exact, the protractor has error, or the 2 degrees out shows the reading was approximate - "meting is nie presies nie", "die gradeboog is nie akkuraat nie"; (c) a proof is needed to cover every case - "n bewys is nodig", "n bewys wat vir elke geval geld". Any ONE of (a), (b) or (c) alone satisfies this line - do not ask for a second one.
IGNORE whether the learner names a theorem, writes any proof, or mentions the IEB. Two short sentences carrying a no and one reason are got_it.$m$
)
on conflict (panel_id) do update
  set memo       = excluded.memo,
      must_have  = excluded.must_have,
      updated_at = now();


-- ------------------------------------------------------------
--  7. Memo seed — Station 3 "Break It" (IEB SBA task type #12)
-- ------------------------------------------------------------
--  The learner has just found the counterexample: for a DIAMETER the chord's
--  midpoint is the centre itself, so every line from the centre bisects it and
--  almost none of them are perpendicular. The panel then asks about the
--  asymmetry between disproof and proof.
--
--  MARK SCHEME: the question has two halves, but a learner who explains the
--  "every case" logic has answered it. The second half (why a thousand
--  examples still fail) is explicitly NOT required — line 3 says so, because
--  demanding something the panel did not ask for is exactly what marked
--  correct learners down on the first deployed prompt.

insert into public.panel_memos (panel_id, memo, must_have) values
(
  's3p4',
  $m$A conjecture claims something about EVERY case - that is what the word "always" does. One case where it fails makes "always" false, and nothing can repair it, so a single counterexample settles the matter for good.
A thousand agreeing cases only tell you about those thousand. The untested cases are still untested, and that is exactly where an exception could be hiding, so agreement in many cases is not the same as agreement in all cases.
That is why the two jobs cost such different amounts of work: to disprove, find one case; to prove, build an argument that holds for every case at the same time. The diameter is that one case for "a line from the centre that bisects a chord is perpendicular to it".$m$,
  $m$says a conjecture is a claim about EVERY case, or uses "always" / "all cases" / "every position". ACCEPT: "it has to be true for every case", "it says always", "elke geval", "altyd", "alle gevalle", "vir enige posisie".
says ONE failing case is enough to make it false or to break it. ACCEPT: "one exception makes it wrong", "if it fails once it is not always true", "een uitsondering breek dit", "as dit een keer misluk is dit nie altyd waar nie".
Do NOT require the second half of the question. An answer that never explains why a thousand examples are not enough is still got_it when the two lines above are present, and an answer that covers both halves is also got_it.
IGNORE whether the diameter counterexample is mentioned, and ignore theorem names entirely.$m$
)
on conflict (panel_id) do update
  set memo       = excluded.memo,
      must_have  = excluded.must_have,
      updated_at = now();


-- ------------------------------------------------------------
--  8. Memo seed — Station 5 "Turn It Around" (converses)
-- ------------------------------------------------------------
--  The learner has seen three converses: one true and useful (opposite angles
--  of a cyclic quadrilateral), one false (the exterior-angle converse with the
--  word "opposite" dropped — a slanted parallelogram is the counterexample),
--  and one true but useless (the definition read backwards).
--
--  MARK SCHEME: two ideas, and an example is NOT required.

insert into public.panel_memos (panel_id, memo, must_have) values
(
  's5p4',
  $m$Because a converse swaps what is GIVEN with what is CONCLUDED. "If AB is a diameter, then angle ACB = 90 degrees" starts at a diameter and ends at 90 degrees. Its converse starts at 90 degrees and ends at a diameter. Those are two different claims travelling in opposite directions, so a proof of one says nothing at all about the other, and the converse needs a proof of its own.
Sometimes the converse turns out false, which is the proof that the two directions really are independent. "A tangent is perpendicular to the radius at the point of contact" is true, but "a line perpendicular to a radius is a tangent" is false - the perpendicular has to be at the end of the radius, on the circle. Dropping one condition breaks it.
This is also why every converse on the IEB reason list carries the word "converse" in front of it: the direction of travel is part of the reason.$m$,
  $m$says the converse SWAPS the given and the conclusion, or turns the statement around, or reverses it, or starts where the theorem finished. ACCEPT: "the given and the answer change places", "you start from the conclusion", "it works the other way round", "dit ruil die gegewe en die gevolgtrekking om", "dit werk in die ander rigting", "jy begin by die antwoord", "dit is omgedraai".
says that makes it a DIFFERENT claim, so it needs its own proof or may not be true. ACCEPT: "it is a new statement", "it must be proved separately", "it is not automatically true", "dit is n ander bewering", "dit moet apart bewys word", "dit is nie noodwendig waar nie".
Do NOT require an example, a counterexample, or any theorem name. Two sentences carrying the two ideas above are got_it.$m$
)
on conflict (panel_id) do update
  set memo       = excluded.memo,
      must_have  = excluded.must_have,
      updated_at = now();


-- ------------------------------------------------------------
--  9. Memo seeds — Station 6 "Explain It" (IEB SBA task type #7)
-- ------------------------------------------------------------
--  s6p3: explain to a friend WHY the angle in a semi-circle is 90 degrees.
--  Figure: AB is a diameter through centre O, C on the circle, angle ACB
--  marked square. Radius OC is deliberately not drawn.
--
--  TWO CORRECT ROUTES, and the mark scheme has to accept EITHER. Requiring the
--  centre-double route would mark down a learner who gives the isosceles-
--  triangle proof, which is just as correct — and marking a correct learner
--  down for taking the other road is the exact failure the 2026-07-30 checker
--  decisions exist to prevent.
--
--  s6p4: write the conclusion paragraph for the Station 2 investigation
--  (angles in the same segment). Three moves are required. The precision
--  conditions drilled in Station 2 are deliberately NOT required here: this
--  panel asks for the SHAPE of a closing paragraph, not for a re-audit of the
--  conjecture's wording. (s2p4 is where that gets marked.)

insert into public.panel_memos (panel_id, memo, must_have) values
(
  's6p3',
  $m$Route 1 (the short one). AB is a diameter, so A, O and B lie in a straight line and the angle at the centre standing on AB is 180 degrees. The angle at the circumference on the same chord is half the angle at the centre, so angle ACB = 180 / 2 = 90 degrees, wherever C sits on the circle.
Route 2 (equally correct). Draw radius OC. Then OA = OC and OB = OC (radii), so triangle AOC and triangle BOC are both isosceles. Call their base angles x and y. The three angles of triangle ABC are x, y and (x + y), and they add to 180 degrees, so 2x + 2y = 180 and x + y = 90 - and x + y is angle ACB.
The panel asks for the reasoning, not for theorem names. Everyday wording is exactly what a friend who missed the lesson needs.$m$,
  $m$gives a REASON, not only the fact that the angle is 90 degrees. ACCEPT EITHER of the two routes below as a complete answer, and treat them as equally correct.
ROUTE 1 needs both of these: (a) the diameter makes a straight line, a straight angle, or 180 degrees at the centre - "AB gaan deur die middelpunt, dus is die hoek by die middelpunt 180 grade", "dit is n reguit lyn, dus 180"; AND (b) the angle at the circumference is half the angle at the centre, or the centre angle is double the circumference angle - "die hoek by die omtrek is die helfte", "die middelpuntshoek is dubbel".
ROUTE 2 needs both of these: (a) the radii make isosceles triangles - "OA = OC en OB = OC, dus is die driehoeke gelykbenig"; AND (b) an angle-sum step that lands on 90 - "die hoeke van die driehoek tel op tot 180, dus is die twee basishoeke saam 90".
A learner who gives ONE complete route is got_it. NEVER ask for the other route as well, and never ask for a theorem name on top of a correct description.
Use partly or not_yet only when the answer restates that the angle is 90 degrees with no reason at all, or stops at "because AB is a diameter" with no link to 180 degrees, to half or double, or to the isosceles triangles.$m$
),
(
  's6p4',
  $m$A conclusion paragraph for an investigation does three things, and a marker looks for all three.
1. It STATES the conjecture: angles subtended by the same chord (or the same arc), at the circumference and in the same segment, are equal.
2. It SAYS HOW IT WAS TESTED: the points were dragged to many different positions and the two angles stayed equal every time.
3. It SAYS WHAT IS STILL MISSING: the testing supports the conjecture but does not prove it, because examples can never cover every position, so a general proof is still needed.
Three or four sentences is plenty. The third move is what separates a full-mark write-up from a merely good one, and it is the one learners leave out.$m$,
  $m$STATES the conjecture: the two angles standing on the same chord, or the same arc, are EQUAL. ACCEPT any wording carrying "equal angles on the same chord or arc", in either language - "die hoeke op dieselfde koord is gelyk". Do NOT require "at the circumference", "in the same segment" or "on the same side" here; this panel is about the shape of the paragraph, not the precision of the conjecture.
SAYS IT WAS TESTED: mentions dragging, measuring, or trying many different positions, and that the equality held. ACCEPT: "I tested many positions and they stayed equal", "ek het die punte gesleep en dit het altyd gelyk gebly", "ek het dit baie keer gemeet".
SAYS A PROOF IS STILL NEEDED, or that the testing does not prove it. ACCEPT: "it still has to be proven", "this is not a proof", "examples are not a proof", "dit is nog nie bewys nie", "n bewys is nog nodig", "voorbeelde is nie n bewys nie".
All three lines above are required, in any order and any wording, in either language. Nothing else is required: do NOT ask for a proof itself, for theorem names, for point letters like A, B, P or Q, or for a formal register.$m$
)
on conflict (panel_id) do update
  set memo       = excluded.memo,
      must_have  = excluded.must_have,
      updated_at = now();
