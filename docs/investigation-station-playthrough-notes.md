# Investigation Station — Megan's playthrough notes (2026-07-30)

Running list of what she finds while playing all six stations. **Nothing here is
built yet** — her instruction: play through everything first, keep notes, then
agree one final game plan. Chunk B (the train) is committed at `27e71bf`; the
branch is 5 commits ahead of origin and still unpushed.

Status key: 🔴 to decide · 🟡 agreed in principle · ✅ built

## BUILT 2026-07-30 (her call: "fix these things now… i feel like the next rounds
## are going to reveal the same problems", scope = LINE-WIDE only)
Only the findings that change the stations she has NOT yet tested were built. The
Station 1 and Station 3 rebuilds stay open on purpose, so her remaining feedback can
still shape them.
  · ✅ **N10 + N3** — every one of the nine typed panels now carries a `needs` list,
    rendered as "Your answer needs to:" ABOVE the answer box. New optional field on a
    `written` panel; the header of `js/investigate.js` states the rule that governs
    it: the SHAPE of the answer, never its content. Each list was written from that
    panel's live `must_have` with the answers stripped out.
  · ✅ **N3c** — the hint audit found only ONE rung 2 that ended in a question
    (`s1p4`); the other eight already told the learner something. That rung now tells,
    and both `s1p4` rungs lost their references to the table that is not on screen yet
    (N1/N2 are still open, so the hints must not lean on them).
  · ✅ **N7 (cheap version)** — new `predict` panel type in `js/investigate.js`, and
    `inv3` panel 1 converted to it. Every option is accepted, a reaction comes back,
    `after` bridges into the reveal, and `panel.note` is deliberately not rendered so
    a prediction can never spoil its own answer. Verified live: a WRONG tap advances,
    shows "Fair guess…", raises no hint, and the round submitted `last_total: 3`
    instead of 4 — the guess is out of the trajectory stats, as designed.
  · ✅ **N5 + N6** — the exam board is out of every learner-facing string, and every
    marks sentence is untouched. Six blurbs lost the "IEB task type N ·" prefix and
    kept their plain labels; `inv1` panel 5 is now "Keep this in mind" with the
    principle in our own words; `inv4` says "a marker" and "the accepted wordings"
    instead of naming Appendix G. File header comments keep their IEB references —
    those are notes to us. Grep confirms: no IEB mention remains outside comments.
  · ✅ **N9** — starter chips moved above the answer box, next to the `needs` card.
  · ✅ **N11** (new, found while auditing — see below).

Checks after the build: `verify.html` still green at 406 diagrams / 749 angles / 0
mismatches; no console errors; the typed-panel body order is needs → chips → box →
hint → Check; walked in both languages. No `must_have` was touched, so the marking
probes did not need re-running.

---

## Station 1 · Measure & Notice (`inv1`)

### N1 · 🟡 The app must record the learner's own readings
**Her call, 2026-07-30:** "Can we have the app record their own readings please."
Panel 1 currently says *"stop at four or five different positions and note what
you see each time"* — nothing is recorded, so every later mention of "your table"
is fiction. She chose live recording over a given table.

Shape (not built): as the learner drags in panel 1, capture the pair
(∠AOB, ∠APB) on each pointer release and show the rows building underneath the
figure; carry that table into panels 3 and 4. Needs a capture hook in
`js/interactive.js` (pointer release) plus a `table` display on the panel in
`js/investigate.js`, and a decision about what to do if a learner drags fewer
than the four or five positions the panel asks for.

### N2 · 🔴 The protractor does not belong in a phone game
Panels 3 and 4 explain the 96°/49° row as *"what a protractor does"*. Nobody in
the game holds a protractor — the app measures for them — and she found that
confusing on its own terms.

Suggested replacement (mine, awaiting her): the readouts are `Math.round`ed to
whole degrees, so a learner's own pair genuinely can look slightly off double.
**Arithmetic constraint:** rounding two whole-degree readings can only ever land
1° away from exact double, never 2° (|2·round(x) − round(2x)| ≤ 1). So the row
would have to become **97 / 49** (double 49 = 98, screen shows 97) and every
"2°" in the copy becomes "1°".

Ripple if we do this: the `s1p4` mark scheme on the server offers "the protractor
has error" and "the 2 degrees out" as accepted reason (b) — one UPDATE to
`panel_memos` plus the same edit in `supabase/phase16.sql`, then re-run the s1p4
probes in `tools/probe-checker.mjs` (which also leans on "a protractor is never
exact"). Both are Claude steps; nothing for Megan to run.

### N3 · 🔴 Panel 4 (`s1p4`) needs more explanation, not less strictness
**UPGRADED 2026-07-30, and this is the strongest signal in the whole playthrough:
MEGAN HERSELF GOT STUCK ON THIS PANEL.** "idk what to do at this question, i am
honestly stuck." A maths teacher who wrote the station's content could not tell
what the question wanted. Whatever else changes on this line, this panel changes.

Her attempt: *"No, sometimes the reading is a bit off but it comes out to be very
close to double the angle at the circumference."* Note what that shows — she found
the "no" easily, and reached for reason (b) (readings are not exact), but never
reached the counting reason (a) (only the tested positions were tested), which is
the one the whole station is built to teach. The panel asks for a "why" without
ever saying what kind of why, so a strong answerer defaults to the wrong half.

### N3b · 🔴 The starter chips sit below the fold on this panel
Her screenshot shows the prompt + the diagram + the textarea filling the viewport,
with the "Stuck? Tap one to start" chips pushed off the bottom — so the panel's own
scaffolding was invisible at the exact moment she was stuck. Two openers were
sitting there unseen ("Measuring the angles only shows…", "To be sure about every
position…"). Worse on a phone. Candidates: put the chips ABOVE the textarea, or
move the diagram below the answer box on typed panels, or both.

**Her words:** "even here, I am a bit confused… I am not saying make it less
strict, I am just asking for a bit more of an explanation or like a table to look
at." So this is a SCAFFOLDING problem, not a mark-scheme problem — do not loosen
`must_have`.

What is wrong with the panel as it stands: the prompt is one long block of
narration ("your table now holds five positions, three came out at exactly
double, one was 2° out and you put that down to the protractor") about a table
that is not on screen, and it asks two things at once (yes-or-no, and why).

Candidates to discuss at plan time:
  · the recorded table on screen, which is N1 — probably most of the fix on its own
  · split the ask into two visible steps: the yes/no first, then "now say why"
  · a shorter prompt, with the "three exact, one 1° out" reading left to the table
    rather than narrated in prose

### N3c · 🔴 The `s1p4` hints ask more questions instead of teaching
**Her words:** "those hints were a bit vague as well." Both rungs end in a
question — *"now count how many positions A, B and P could be dragged to"*, *"so
what would it take to cover every position at once?"* — which is Socratic when the
learner is thinking and useless when the learner is stuck, which is the only time
a hint is shown. Rung 1 also leans on "five positions" (the invisible table, N1).
Compare the tone that DID land for her in chat: "you checked five, and A, B and P
can sit in endlessly many positions, so every other position is still unknown."
Candidate rule for the whole line: **rung 1 may ask, rung 2 must tell.**

### N4 · 🔴 The row count does not add up
Panel 4 says "five positions… three came out at exactly double, one was 2° out".
The rows available are 140/70, 118/59, 96/49 and the discarded 84/63, plus the
figure's own 112/56 — that is four, not five, and only two are exactly double
before the figure is counted. A visible table forces this to be exact: whatever
the table holds, the sentence has to match it row for row.

---

### N5 · 🟡 LINE-WIDE: the exam board comes out of learner copy — the MARKS TALK STAYS
**Her ruling, 2026-07-30, in two steps. Read the second one; the first is not what
she meant.** She first said: "this investigation station is not only to help them
prepare and do well in their investigation, the goal is to get them to actually
understand and I don't want to get accused of rote learning the kids to the point
of braindeadness… take out the part of 'IEB says'… make a general statement
important to keep in mind for investigations." Read as "stop motivating the maths
with marks", which she then corrected: **"comments about where they get their
marks, that's fine, because it teaches them in general how to approach an
investigation, which is good, some kids really like those solid points to look
for, but let's just take out the 'IEB says' stuff."**

So the rule is narrow and precise: **strip the exam-board ATTRIBUTION from
learner-facing copy; keep every sentence about where the marks are.** Concrete
"here is what to look for" guidance is a feature for some learners, not rote
learning. File header comments keep their IEB references — those are notes to us,
not to the class.

Learner-facing places to change (nothing else):
  · `inv1` panel 5 note — "The IEB says it in one sentence in the Subject
    Assessment Guidelines: <quote>" → state the principle in our own words. The
    rest of that note (the marks sentence, "left the last marks on the table")
    STAYS as it is. Also drops the AF version's duplicate English quote.
  · `inv1` panel 5 prompt — "The line the examiners wrote down" → e.g. "Keep this
    in mind" / "Hou dit in gedagte".
  · every station blurb — "IEB task type 16 · Investigation." → keep the plain
    label ("Investigation.", "Counterexamples.", "Error Spotting.", "A Lesson to a
    Friend.") and drop the "IEB task type N ·" prefix. The label is useful
    signposting; the task number is a note to us.
  · `inv4` panel 5 prompt — "the way an IEB marker accepts it" → "the way a marker
    accepts it". Generic marker is marks talk, which is fine.
  · `inv4` note — "IEB Appendix G also accepts…" and "Markers work from the
    Appendix G list" → "the accepted wordings also include…", "markers work from a
    list of accepted wordings". Keep every wording itself: the 2026-07-30 Appendix
    G audit exists because a reason is a shared vocabulary.
  · `inv2` note — "IEB accepts the short reason as '∠s in the same seg'" → "the
    accepted short reason is…".

**Draft for the one sentence that carries `inv1` panel 5** (our words, same idea,
and it settles the separate question of quoting an exam board's document in a
public repo):
> EN: No number of specific examples that support a conjecture adds up to a general
> proof.
> AF: Geen aantal spesifieke voorbeelde wat 'n vermoede ondersteun, tel op tot 'n
> algemene bewys nie.

---

## Station 2 · State the Conjecture (`inv2`)

### N11 · ✅ FIXED — the `s2p4` hints were teaching the one phrase the checker refuses
Found while auditing the hint rungs, not by playing. **This is very likely the answer
to her open "is `s2p4` too strict?" question.**

`s2p4`'s mark scheme accepts several wordings for WHERE the angles are ("at the
circumference", "on the circle", "in the same segment", "on the same arc") and counts
the answer as MISSING that line only when its sole location wording is "on the same
side of the chord" — because the angle at the CENTRE is on that side too, and it is
double, which is exactly the error panels 2-3 of that station teach.

But the hint ladder was pointing straight at the refused phrase: rung 1 asked "does it
say… which side of it they are?", rung 2 said "they are on the SAME side of it", and
`memoDisplay` listed the three ideas as "equal angles · same chord or arc · same side
of it". A learner following the scaffolding was being walked into a `partly`. Both
rungs and the memo now say "at the circumference — in the same segment" instead, in
both languages, with a comment in the file recording why.

So before loosening anything on `s2p4`: the strictness may well have been fine and the
COACHING wrong. Worth re-testing with a real answer once she is back on the throwaway
login. (Nothing about `must_have` was changed, so the marking is exactly as probed.)

## Station 3 · Break It (`inv3`)

### N7 · 🟡 A new `predict` panel: "what do you think?" then a reveal (her design)
**Her words, 2026-07-30, on panel 1:** "there is nothing to drag here for the kids
to investigate if it fails for one or none.. maybe make this a 'what do you think?'
and then the next slide shows 'wow you were right' or 'ah, let's see where it could
fail'."

Panel 1 is a `choice` with four options — three of them "no" with different reasons
— and no way to find out which is right. So it is a guess scored as an answer.

Two side effects of it being a `choice`, which support her read:
  · a wrong guess is a miss, so three coin-flips in a row trip the hint ladder as
    though the learner were failing the station;
  · `mountPanel` sets `stats.gated = true` for choice panels, so a guess lands in
    `firstTryCorrect` and pollutes the admin attempt-trajectory signal — the one
    Megan reads to tell productive struggle from stuck.

Shape (not built). `type: "predict"`, a sibling of `choice` in
`js/investigate.js`, where every option advances: no right/wrong, no hint ladder,
no reveal, and `gated: false` so it never touches the stats.
  · CHEAP VERSION: on tap it locks and shows a reaction for that option ("Good
    instinct — hold on to that" for the true one, "Fair guess. Let's go and look."
    otherwise), then Continue; panel 2 reveals exactly as it does today.
  · FULLER VERSION (her "wow you were right"): the panel records which option was
    tapped in per-round scratch state, and a later panel can carry two variants of
    its opening line. More engine, cross-panel state, more to get wrong.
Recommend the cheap version first; the fuller one is an easy follow-on.
Don't lose panel 1's two hints in the move — "is there a chord whose midpoint is
somewhere unusual?" is good writing and would work as the reaction text or as
panel 2's approach.

### N7b · 🔴 Panel 3 (three points vs four) is unreadable as written
**Her words, 2026-07-30:** "am i stupid? i don't understand exactly what this
question is asking of me." Second time on this line that the teacher who
commissioned the content could not parse a panel (see N3) — treat that as the
strongest class of finding in this document.

Three faults stacked, any one of which loses a reader:
  1. **"Any" is ambiguous.** "Any three points lie on a circle" is meant as *given
     any three points, a circle through them exists*; it reads just as naturally as
     *three points are, in general, on a circle*, which sounds like a description of
     a figure the learner cannot see.
  2. **No figure.** It is the only panel in the station with nothing on screen, and
     it is the one making a claim about pictures.
  3. **The correct option repairs the claim.** Claim (A) says nothing about
     collinearity; option (A) adds "as long as they are not in a straight line". So
     the right answer carries information the question withheld, which reads as a
     trick even to someone who knows the maths.

Also missing: WHY the panel exists. Three points on a circle is free, four is
special — and that is exactly why a cyclic quadrilateral needs proving rather than
eyeballing. The panel never says so, and it arrives with no bridge from panels 1-2
(which were about the chord/diameter counterexample).

**HER EXPLICIT ASK on this panel, 2026-07-30: "let's add a diagram here."** So the
figure is decided, not a suggestion — the only open question is which figure.

Fix candidates, cheapest first: state the purpose in the prompt; add the two
figures (three dots with the unique circle through them, four dots with no circle);
rewrite the claims in plain words ("Take any three dots that are not in a line — can
you always draw a circle through all three? What about four?"). Best version, and it
composes with N7 and N8: make it draggable — three fixed dots with their circle
drawn, and the learner drags a FOURTH dot and watches it refuse to sit on the
circle, landing on it only when placed there deliberately.

### N9 · 🟠 MY observation, low priority: the typed panel is taller than a screen
**Correction: this started as a misreading.** When she said "let's add a diagram
here" she meant the three-points/four-points panel (N7b), not `s3p4` — she had seen
`s3p4`'s figure. So the strong version of this finding is withdrawn, and what is
left is a mild ergonomic point, mine not hers:

`mountPanel` (`js/investigate.js`) lays a typed panel out as prompt → figure →
textarea → starter chips → Check → feedback, which is taller than a phone viewport.
So the figure sits above the answer box and the chips sit below it, and a learner
mid-answer has to scroll one way for the picture and the other way for the help. Her
first `s1p4` screenshot had the chips off-screen; her second (after scrolling) had
them. Nobody was blocked by it.

Only worth doing if the plan is already opening `investigate.js` for N7 or N1:
move the starter chips ABOVE the textarea, or shrink the figure on typed panels.

Separate optional idea for `s3p4`, unrelated to layout: a schematic for the IDEA —
a row of ticks with one cross, showing that one ✗ ends it while a wall of ✓ never
finishes. Not requested.

### N10 · 🟡 LINE-WIDE: the typed panels never MODEL the answer they ask for
**Her words, 2026-07-30:** "Joh friend, I am struggling... I get it is to get the
kids to think, but it feels like there isn't enough info given."

Third panel in a row (s1p4, s3p4, and see N3) where she knew the mathematics
perfectly and could not tell what SHAPE of answer was wanted. Her `s3p4` attempt
had both halves and omitted only the join: *"A conjecture claims something about
every case while a counter example explicitly proves that this one instance does not
work"* — true, and it never says therefore "always" is false, which is the mark
scheme's second line. The live checker came back `partly` with a well-aimed nudge
("…but why does finding just one counterexample mean the conjecture is false?").

Diagnosis: these panels ask a learner to write an ARGUMENT without ever showing one.
Per her earlier ruling this is a scaffolding problem — do NOT loosen `must_have`.
Standard fix for a writing task: model the move first on a DIFFERENT figure or
theorem, then ask them to do this one. The material already exists in the line —
`inv6` is four write-ups being judged — but it sits at the very end, after every
panel that needed it. Worth deciding at plan time whether a worked example belongs
in front of each typed panel, or whether some of `inv6` moves earlier.

### N8 · 🟡 "Break It" gives the learner nothing to break
Panel-type audit of the whole line (mine, prompted by N7):

| station | opens with | anything draggable? |
|---|---|---|
| `inv1` Measure & Notice   | explore | yes |
| `inv2` State the Conjecture | explore | yes |
| `inv3` Break It           | choice  | **no** |
| `inv4` Prove It           | choice  | no |
| `inv5` Turn It Around     | note    | no |
| `inv6` Explain It         | choice  | no |

`inv4` and `inv6` are legitimately reading-and-judging stations (error spotting in
written proofs; marking four write-ups) — no figure to drag by nature. `inv3` is the
odd one out: it is ABOUT finding a counterexample and it hands the counterexample
over as an option to tick.

Suggested interactive for it: put the DIAMETER up as the figure and let the learner
**rotate the line from O**. Every position still bisects AB, because the chord's
midpoint IS O and every line through O passes through it — and only one position is
perpendicular. The learner watches the theorem fail with their own hand on it. Two
notes on cost: `discover-line-centre.js`'s MODEL cannot be reused (its chord is
fixed off-centre and the handle slides M along it, so it can never reach the
diameter case), so this is a NEW model; but rotating a line through O is a simpler
model than the ones already shipped, and draggable panels are exempt from
`verify.html` by design (they compute angles from live coordinates, so there is no
declared value to disagree with the picture).

## Station 4 · Prove It (`inv4`)
_(nothing yet)_

## Station 5 · Turn It Around (`inv5`)
_(nothing yet)_

## Station 6 · Explain It (`inv6`)
_(nothing yet)_

---

## Carried over from before this playthrough
- `s2p4` strictness is still an open question of hers (the location condition).
  `node tools/probe-checker.mjs 3` prints the three verdicts to read. If the
  playthrough shows the same "explain it to me better" pattern as N3, the answer
  may be scaffolding rather than a looser mark scheme.
- Teacher preview cannot exercise the typed marking at all (`?preview=1` logs in
  as "Teacher Preview", which is not a row in `students`, so the checker 401s and
  every typed panel falls through to the static hint ladder). So anything she
  reports about *marking* during this playthrough is about the hint ladder, not
  the checker.
