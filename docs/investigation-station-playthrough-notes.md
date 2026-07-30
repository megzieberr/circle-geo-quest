# Investigation Station — Megan's playthrough notes (2026-07-30)

Her findings from playing all six stations, and the record of how each one was
fixed. **CHUNK C IS BUILT: every finding below is closed except N8, which she
ruled out of scope on the day.** The body of this file is the original
diagnosis — left as written, because the reasoning is why the fixes look the way
they do. Where the build departed from the plan, the index says so and
PROJECT-STATUS "Decisions" carries the full reason.

Status key: ✅ built · ⛔ deliberately not built

## Index (the body is ordered BY STATION, not by number)
| # | what | status |
|---|---|---|
| root | teaching filed after the answer, not before — five instances | ✅ all five |
| N1 | app records the learner's own readings (Station 1) | ✅ |
| N2 | protractor → the screen rounds to whole degrees; 96/49 → 97/49 | ✅ |
| N3 | `s1p4` needed the shape of the answer — she got stuck here | ✅ |
| N3b | starter chips below the fold | ✅ |
| N3c | `s1p4` rung 2 asked instead of telling | ✅ |
| N4 | the row count does not match the table | ✅ generated, cannot drift |
| N5 | exam-board attribution out, marks talk stays (absorbed N6) | ✅ |
| N7 | `predict` panel — a guess is not an answer | ✅ cheap version |
| N7b | three-points-vs-four panel is unreadable; needs a figure | ✅ two figures |
| N8 | "Break It" has nothing to break — rotating line from O | ⛔ her call: static figures only |
| N9 | typed panel taller than a screen (minor, mine) | ✅ |
| N10 | typed panels never model the answer they ask for | ✅ |
| N11 | `s2p4`'s hints taught the wording its scheme refuses | ✅ |
| N12 | the proof is not on the screen (`inv4` p1) | ✅ all 3 panels |
| N12b | `inv4` p1 never says the proof is finding x | ✅ "to find x" |
| N13 | "proof" ≠ a calculation (her classroom convention) | ✅ title kept, her call |
| N14 | `s4p4` demands a theorem name it never asked for | ✅ — NOT superseded, see below |
| N15 | split the two-part typed panels | ✅ both splits are TAPS |
| N16 | `s5p4` hides the IF…THEN frame | ✅ |
| N17 | rain / sprinkler example | ✅ |
| N18 | correct option is FIRST in 12/12 (+7/7 discovery) | ✅ 19/19, now shuffled |
| N19 | `inv6` p2 defines "observation" but not "conclusion" | ✅ |
| N20 | panels must carry the station they refer back to | ✅ both panels |
| N21 | define "conjecture" as a HUNCH, on its own slide | ✅ |

### Three corrections to this document, found while building
1. **N14 was NOT superseded by N15.** The table above used to say it was. Because
   `s4p4`'s second slide became a TAP (a typed one would have duplicated `s4p5`,
   which already asks for the reason in an accepted wording), the panel still asks
   only for a description — so the "names the semi-circle theorem" line had to come
   out of its mark scheme anyway. Both were needed. Her exact answer is now a probe
   and it passes.
2. **`s2p4` is not too strict, and the accept-list described here was too generous.**
   "At the circumference" alone is NOT a sufficient location condition — at the
   circumference but on the far side of the chord the angles are supplementary. Only
   "in the same segment" satisfies it, which is what the N11 fix already teaches.
   Probed live. Do not loosen it.
3. **A fourth panel had the N4 defect:** `s3p4` said "in Station 1, five measurements
   were not enough", hard-coding a count of a table the learner now fills in
   themselves. Reworded to need no count. The general rule that came out of it:
   **copy must not assert a number it cannot know.**

---

# ROOT CAUSE — read this before doing any of the individual fixes
**The panels were written as ASSESSMENT when the station is INSTRUCTION: the teaching is
filed AFTER the answer instead of before it.** Megan said some version of "this is vague"
five times while playing, on five different panels, and every one of them is this same
fault. In no case was the content missing — it was written, and written well, but placed
one step too late to be used:

| panel | the teaching that exists | where it was |
|---|---|---|
| `s1p4` (N3) | what the answer has to do | nowhere — ✅ now a `needs` list |
| `inv3` p3 (N7b) | why 3-vs-4 points matters, and a figure | absent |
| `inv4` p1 (N12) | the proof itself | absent |
| `s5p4` (N16) | the IF…THEN frame | panel 1, three panels back |
| `inv6` p2 (N19) | the definition of "conclusion", and the word-tells | the post-answer note, and hint rung 2 |

That is why she kept hitting it while knowing the mathematics cold: each panel asked her
to produce the thing it intended to explain to her afterwards. **Fix it as one editing
pass over the line — move each panel's teaching in front of its question — not as five
separate patches.** The rule for new panels: a learner who has read everything above the
question must be able to answer it.

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

### N21 · 🟡 DEFINE "conjecture" on its own slide, before anything is asked
**Her words, 2026-07-30:** "Maybe just have a slide actually explaining what a conjecture
is bc I know what it means, and some kids will assume what it means, but it's a big word
for a 17 year old to hear."

Worth knowing: **the two languages are not equally hard here.** Afrikaans uses *vermoede*
— everyday language, a hunch. English "conjecture" is the only one of the pair a Grade 11
has likely never met. So the English copy carries the whole burden.

The line DOES define it — in `inv1` panel 2's note, after the blank has been filled:
*"That is a conjecture: a claim about every position, not a report of the ones you happened
to try."* ROOT CAUSE again: written well, filed after the question that needed it.

**Her follow-up ruling: anchor it on the word HUNCH.** "explain conjecture as a hunch so
they can associate it with that." So the definition leads with the familiar word and lets
"conjecture" attach to it, rather than the other way round. (This also lines the two
languages up: *vermoede* IS a hunch, so both versions now teach the same association.)

Fix: a new `note` panel at the very start of `inv1`, before the explore. Draft:
> **Conjecture** — a fancy word for a **hunch**. Not a wild guess: a hunch you have good
> reasons for, that nobody has proved yet.
>
> You spot a pattern, you check it a few times, and then you write it down as a claim
> about EVERY case. That written-down claim is the conjecture. Check 4, 8, 12, 16 — all
> even — and you can write "every multiple of 4 is even". You believe it, you have
> reasons, and you have not proved it.
>
> A conjecture stays a conjecture until one of two things happens: somebody proves it, and
> it becomes a theorem — or somebody finds a single case where it fails, and it is dead.

(The last line sets up Stations 3 and 5 for free: it is the disprove-vs-prove asymmetry the
whole line is built on.)

**Do NOT put all the vocabulary on one slide** — three definitions at once is its own wall
of words. Define **counterexample** at first use in `inv3` and **converse** at first use in
`inv5`, each in the PROMPT before the question rather than in a note after it. `inv5` panel
1 already does this well for converses, which is the model to copy.

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

### N5 · ✅ LINE-WIDE (BUILT): the exam board comes out of learner copy — the MARKS TALK STAYS
_(N6, the "IEB task type N ·" blurb prefix, was folded into this entry — there is no
separate N6.)_
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

### N15 · 🟡 SPLIT the two-part typed panels — and it SUPERSEDES N14
**Her idea, 2026-07-30:** "Maybe it would be good to break questions like this up in 2
different slides?" Plus her cost ruling: "I loaded $10 onto the API, so the cost is not
an issue" — so the extra checker call per split panel is not a constraint. (Told her the
20-per-hour cap is a per-learner RATE limit in `checker_calls`, not a spend limit, so
the credit does not lift it; it can be raised for the throwaway account alone.)

**The interaction that matters: splitting `s4p4` FIXES N14 rather than needing it.**
N14 exists because the panel asks for a description and then marks down a learner for
omitting a theorem NAME it never requested. Split it, and slide B literally asks for the
name — so requiring the name becomes fair, and no loosening is needed. Do the split OR
the N14 loosening, not both.

Where to split, and where not:
  · **`s4p4` — SPLIT.** Two different kinds of thing: a description ("what did the
    shorter one spot?") then a name ("name the theorem that gives it in one step").
    Slide A's scheme drops the name requirement; slide B's requires it.
  · **`s1p4` — SPLIT, and make part 1 a TAP.** "Have you proved it? Yes / No" needs no
    language model at all: instant, free, no 12-second wait. The reason then gets its own
    slide. Cheaper and clearer than two typed slides.
  · **`s2p4` — DO NOT SPLIT.** Writing ONE precise sentence carrying all three conditions
    is the skill; splitting it into three hands over the structure being tested.
  · **`s6p4` — DO NOT SPLIT.** Same, more strongly: it is a closing PARAGRAPH, and
    assembling the three moves into one is the whole task.
  · **`s6p3`, `s2p5`, `s4p5`** — already single asks.
  · **`s5p4` — her call.** Two halves of one argument; my lean is to leave it whole.

Free improvement for the panels that are NOT split: the edge function already returns
`missing` — up to three short plain-language labels for what is absent (see the response
schema in `supabase/functions/check-answer/index.ts`) — and `js/investigate.js` throws
them away, using only `nudge`. Rendering them against the `needs` list would show a
learner WHICH of the two things is still outstanding, with no split and no extra call.
Render as textContent, never HTML — it is model output.

### N14 · 🔴 (SUPERSEDED BY N15 IF THE SPLIT HAPPENS) mark-scheme bug on `s4p4`
**Her words, 2026-07-30:** "..... why is this wrong". It was not wrong.

Her answer: *"The shorter proof noticed that AB is the diameter which makes C = 90
degrees. Then we use interior angles of a triangle. This happens because the angle at
the center (180 degrees) is double the angle at the circumference."* Live verdict:
`partly` — "can you name the theorem that explains why a diameter creates a right angle
at the circumference?"

`s4p4`'s `must_have` line 2 is *"names the semi-circle theorem as the shortcut … however
it is worded"*. She did not name it; she DERIVED it (180° at the centre, halved at the
circumference). So the checker behaved exactly as instructed — the instruction is wrong:
  · the panel asks *"What did the SHORTER proof spot that the longer one missed?"* and
    never asks the learner to name anything;
  · "AB is the diameter which makes C = 90 degrees" IS the theorem in her own words —
    "diameter subtends right angle" is one of its accepted forms;
  · this is precisely the failure the 2026-07-30 checker session already ruled on for
    `s6p3` ("never ask for a theorem name on top of a correct description") and the
    memo-vs-mark-scheme finding ("anything listed there that the panel did not actually
    ask for will mark real learners down"). The rule was simply never applied to `s4p4`.
  · a derivation is a STRONGER answer than a name: naming shows recognition, deriving
    shows understanding.

Proposed replacement for line 2:
> identifies the diameter → right-angle step as the shortcut. ACCEPT any wording that
> links the diameter to the 90°: a plain description ("AB is a diameter so C is 90"),
> the theorem's name in any accepted form, OR a derivation of it (180° at the centre,
> halved at the circumference; or the isosceles-radii route). Never require a formal
> theorem name on top of a correct description. Count as MISSING only when the 90° is
> credited to a different theorem, or the diameter is never linked to it.

Cost: one `UPDATE` on `panel_memos` + the same edit in `supabase/phase16.sql`, then
re-run the `s4p4` probes (and add one probe carrying her exact answer, plus one that
credits the 90° to the wrong theorem, to prove the loosening did not go too far).
Both Claude steps. **Asked her whether to fix now or at plan time; recommended now,
because this one fails learners who understand the maths better than the scheme does.**

### N12 · 🔴 THE PROOF IS NOT ON THE SCREEN (panel 1) — a missing element, not vagueness
**Her words, 2026-07-30:** "and which part is left out exactly? again, this is vague."

Panel 1 says *"A learner wrote this proof, but one line fell out. Which line is
missing?"* — and no proof is rendered. The panel carries `diagram: FIG_GIVEN`, a
prompt, four options and hints; there is no proof text anywhere in the panel. The only
route through is to reverse-engineer the proof out of the four options. Its own hint
proves the intent: *"Read the proof as a chain: 90° … then what? … then 40°"* — there
is no chain on screen to read.

Why panels 2 and 3 escape this: their four options ARE the proof's lines (one carries
the wrong reason / does no work), so the learner can see the whole argument while
choosing. Panel 1 is the only one whose options are CANDIDATES for a gap, so it is the
only one that cannot be answered from what is displayed.

Fix: a proof block a panel can render — statement + reason per line, with a visible
blank where the missing line goes:
```
∠ABC = 50°               (given)
∠ACB = 90°               (∠s in semi-circle)
_______________          ( ? )
∠BAC = 40°
```
Small new display feature in `js/investigate.js` (a `proof:` field, lines of
{statement, reason}), plus CSS. Once it exists, panels 2 and 3 should render their
proofs the same way rather than smuggling them into the options, so all three panels of
the station read alike.

### N13 · 🟡 DECIDED: "proof" comes out of Station 4's calculation panels
**Her ruling, 2026-07-30:** "I have been hammering in my kids' heads that proof =
converse... You prove something is a tangent, cyclic quad, diameter, parallel... I
think proof here is a bit confusing." Her classroom convention wins over general
mathematical licence — matching what the class has been drilled on is the point.

**The dividing line, and it already holds everywhere else:** a CLAIM gets proved, a
NUMBER gets calculated. Her four examples (tangent / cyclic quad / diameter / parallel)
are all claims. `inv1`, `inv3` and `inv5` only ever use "proof" for claims — "measuring
cannot prove the conjecture" — so they sit on her side of the line already. `inv4`'s
calculation panels are the ONLY place in the line that crosses it. This is one
station's copy, not a rethink of the line.

Worth carrying into the copy: what her four examples share is not strictly "converse"
(converses are the largest family of claims-to-prove, not the definition), and `inv1`
asks learners to prove a conjecture that is not a converse. So the rewritten copy should
lean on claim-vs-number rather than on the word converse, or the two stations will feel
like they mean different things by "prove".
**Her question, 2026-07-30:** "Why do we call it a proof if we are working something
out? Isn't this just a statement?" She is right, and the consequence is structural.

The exam distinction: *"Calculate x, giving reasons"* wants a chain of statements each
carrying a reason, landing on a NUMBER. *"Prove that ABCD is cyclic"* wants an argument
that a stated CLAIM holds, usually with no numbers, where the destination is announced
in advance. They are marked differently.

Panels 1-4 of `inv4` are the first kind: given 50° and a diameter, find x = 40°. Not
false to call that a proof — any justified chain proves its own conclusion — but wrong
for a Grade 11 in exam language, and wrong in the one place it costs something: **the
station teaching the difference between evidence and proof is using "proof" for
something that is not one.** That undercuts the argument the whole line is built on.

Where "proof" IS accurate and must stay: `inv6` panel 3 (explain why ∠ACB HAS to be
90°), and all the conjecture-proving talk in `inv1`, `inv3` and `inv5`.

Suggested (naming is hers): in `inv4`, call what panels 1-3 display a **solution**
(AF *oplossing*) and its lines **statements and reasons**. Note the app already uses
"rider" for this shape elsewhere (`round18-riders-*`, `daily-riders`), so "rider" is
the consistent alternative.

**Open decision for her — the station's TITLE.** `inv4` is called "Prove It" and its
content is error-spotting in reasoned solutions. Either rename it (e.g. "Check It")
and let `inv6` carry the proving, or fix only the body copy and see whether the title
still grates once "solution" is in there. My lean: body copy first.

### N12b · 🔴 Panel 1 never says what the proof is FOR
**Her ask, with a correction to the content.** She wrote: "maybe say that… A learner
wrote this proof to show that it is a diameter". Her instinct is right — the prompt
never states the proof's goal — but the goal is NOT the diameter: "AB is a diameter" is
the panel's GIVEN, used to justify ∠ACB = 90°. The proof works out **x = ∠BAC = 40°**,
which is what `FIG_GIVEN` marks at A.

So the wording should be "A learner wrote this proof **to find x**" — do not write "to
show that it is a diameter", which would be false. Flagged in chat and she has not
disputed it; worth confirming at plan time in case she wants different wording.

## Station 5 · Turn It Around (`inv5`)

### N16 · 🔴 `s5p4` hides the frame that makes it answerable
**Her words, 2026-07-30:** "I swear, I am not lazy, I just don't know what to answer
here." Third time the teacher who commissioned the content could not answer a panel
(see N3, N7b) — the same class of finding, and the most abstract panel on the line.

The panel asks "why does proving a theorem not prove its converse as well?" — a general
principle — while panels 1-3 gave three CONCRETE converses to judge and none of them is
on screen any more. The diagram (`FIG_OPP`) is a cyclic quad, which illustrates the
theorem but not the abstraction being asked about.

**The scaffolding exists, three panels earlier.** Panel 1 already carries the IF…THEN
frame in full, with the cyclic-quad pair worked through. By panel 4 it is off screen, and
hint rung 1 (*"Write the theorem out as IF … THEN …, then write the converse under it the
same way"*) only appears after three misses. So panel 4 needs to RESTATE the frame, not
invent it — put the pair on the panel:
```
Theorem:   IF the quadrilateral is cyclic   THEN opposite ∠s add to 180°
Converse:  IF opposite ∠s add to 180°       THEN the quadrilateral is cyclic
```

### N17 · 🟡 DECIDED: add the rain / sprinkler pair
**Her call, 2026-07-30:** "I think we should include this… that makes a lot of sense
here, it will help them understand."

WHERE: `inv5` panel 1, immediately after its existing sentence *"This one happens to be
true, which is lucky"* — the rain pair is precisely the unlucky case that sentence sets
up. Then a one-line callback in panel 4 next to the restated IF…THEN pair, so the learner
meets it again where the abstract question is asked.

Draft copy, ready to paste:
> EN: It does not always work out that way. "If it is raining, the ground is wet" is
> true. Turn it around — "if the ground is wet, it is raining" — and it is false:
> someone's sprinkler was on. Same shape, opposite verdicts. That is why a converse has
> to earn its own proof.
>
> AF: Dit werk nie altyd so uit nie. "As dit reën, is die grond nat" is waar. Draai dit
> om — "as die grond nat is, reën dit" — en dit is onwaar: iemand se sproeier was aan.
> Dieselfde vorm, teenoorgestelde uitkomste. Daarom moet 'n omgekeerde sy eie bewys
> verdien.

A non-circle example is on-topic here rather than a digression: Station 5 is about
converses in general, and the whole difficulty is that the asymmetry is a logical one,
not a geometric one.

The mathematical point the panel wants, for whoever writes the copy: the theorem's proof
STARTS FROM the given and uses it to reach the conclusion. The converse hands you the
conclusion and asks for the given, so none of the original proof's steps are available —
it is a different journey, not the same journey reversed. (This is also the honest reason
"you cannot just reverse the proof" rather than a rule to memorise.)

## Station 6 · Explain It (`inv6`)

### N20 · 🟡 Panels that refer back to another station must CARRY what they refer to
**Her words, 2026-07-30, on `s6p4`:** "I played station 2 like 30 min ago, I cannot
remember what it was about and neither will my kids... maybe just show that diagram again
here?" And the stations will often be played DAYS apart, not 30 minutes.

**This reverses a deliberate Chunk A decision, on purpose.** The 2026-07-30 decision in
PROJECT-STATUS reads: *"`s6p4` carries no diagram either — it asks for a write-up, not a
reading of a figure."* True but beside the point: the panel asks for a conclusion ABOUT a
specific investigation, so the figure is not decoration, it is the subject.

**Refinement — do not paste `BOWTIE` in as-is.** Station 2's figure labels both angles
`54°`, and "state the conjecture" is the FIRST thing this panel's mark scheme asks for, so
the labelled figure hands that over. Use a variant with the two angles MARKED BUT
UNLABELLED (`t: ""`, keeping `o.v` so `verify.html` still checks it) plus a one-line recap
above it: *"Back in Station 2 you dragged P and Q around chord AB."* The learner then sees
what was investigated and still has to say what stayed true.

This costs nothing the panel was testing: its `must_have` explicitly says *"Do NOT require
'at the circumference', 'in the same segment' or 'on the same side' here; this panel is
about the shape of the paragraph, not the precision of the conjecture."*

**Second panel with the same fault: `inv6` p1** — *"Four learners wrote up the Station 1
investigation"* — also carries no figure and also refers to a station played who knows
when. Its Chunk A reason was different (showing the semicircle figure there would
pre-empt `s6p3`), but the write-ups are about the CENTRE-DOUBLE investigation, so the
centre-double figure can be shown without pre-empting anything.

### N19 · 🔴 `inv6` p2 defines "observation" and not "conclusion"
**Her words, 2026-07-30:** "'Which one is the conclusion'... Why are these questions so
explicitly vague?" An instance of the ROOT CAUSE above, and the sharpest one because the
asymmetry is visible in a single sentence.

The prompt defines one of its two terms — *"three of these four sentences are OBSERVATIONS
— reports of what was seen or measured"* — and then uses CONCLUSION, the term the question
actually turns on, without defining it.

Both missing pieces exist elsewhere in the panel, after the point of use:
  · the definition is in the post-answer `note`: *"A conclusion is a claim: it says what
    must be true, gives the reason, and covers cases nobody measured."*
  · the word-level tell is in hint rung 2, three misses away: *"'I measured', 'looks like'
    and 'stayed the same' all describe. 'So', 'therefore' and 'must' all conclude."*

Fix: define CONCLUSION in the prompt alongside OBSERVATIONS, in the same breath and the
same style. The hint's word-tells could also move up — they are the actual method for the
task, not a rescue.

(For the record, the answer is option 1: "so… must… therefore… always" — it claims
something about every case, while the other three report single events.)

### N18 · 🔴 LINE-WIDE, MEASURED: the correct option is FIRST in 12 of 12 panels
**Her words, 2026-07-30, on `inv6` p1:** "just by judging the length of the answer, the
learners can guess which one is correct without even reading… I saw this in station 1
too… we can make this a bit more challenging."

Measured every option list on the line (script over `STATIONS`, comparing the correct
option's index and its length against the others):

| tell | result |
|---|---|
| correct option is FIRST | **12 / 12 panels** |
| correct option is LONGEST | 7 / 12 panels |

`js/investigate.js` renders `panel.options` in source order — it never shuffles — and
every panel was authored with the correct option written first. So "always tap the first
one" clears every choice panel in the line without reading. `js/game.js` DOES shuffle
(`shuffled(q.options)`, line ~388), which is why the 43 graded rounds never showed this.
**`js/discover.js` does not shuffle either: 7 of 7 choice panels across the discovery
rounds are also correct-first.** That is 19 panels in the app with a positional tell.

Worst length gaps (correct vs the rest, EN characters):
  · `inv6` p1 — 216 vs 64 / 18 / 98
  · `inv6` p2 — 108 vs 49 / 32 / 66
  · `inv2` p3 — 104 vs 54 / 82 / 14
  · `inv3` p3 — 86 vs 41 / 56 / 64

TWO SEPARATE FIXES, both needed:
  1. **Shuffle** in `investigate.js` and `discover.js`, reusing `shuffled` from `ui.js`
     exactly as `game.js` does. Needs one opt-out (`keepOrder: true`) for panels whose
     options are a SEQUENCE rather than a set — `inv4` p3 is "Step 1 / Step 2 / Step 3 /
     None of them", which reads as nonsense shuffled and whose "None of them" belongs
     last; `inv3` p3's lettered claims (A) / (B) / Both / Neither are the same shape.
     Check every panel for a trailing "none / both / neither" option before shuffling it.
  2. **Level the lengths** — a copy job, but NOT by shortening the right answer on
     `inv6` p1/p2: those panels ask which write-up a reader could FOLLOW, so the good one
     is legitimately the most complete. Pad the distractors instead — a wordy write-up
     that still says "looks like", or one that uses letters it never introduces. That is
     better teaching as well, since the real trap in marking is the long answer that says
     nothing.

---

## ⚠️ LIVE DATA TO CLEAN UP — STILL THERE as of the end of Chunk C
**Her call on 2026-07-30 was to keep it for the day so the marking probes could run.
They have (13/13 on the two changed schemes, plus the three `s2p4` rulings), so its
reason to exist has expired — it just needs the word.**

A throwaway learner exists in the LIVE database so Megan could test the typed panels
with real marking (teacher preview cannot: "Teacher Preview" is not a row in `students`,
so `_cgg_auth` 401s and every typed answer falls through to the hint ladder).

  · `students.display_name = 'ZZ Toets'`, password `toets1234`, id
    `98e6d6a4-8060-4382-b054-cafb42e68c5e`, created 2026-07-30.
  · It was given all 43 MAIN rounds as `passed` with `total_xp = 0`, so the train strip
    opens and every station is unlocked; the six stations were left unplayed.
  · While it exists it is VISIBLE TO THE CLASS on the login name list and the
    leaderboard (bottom, 0 XP until stations are played).

Delete it when the testing is done — the cascade takes its progress, xp_events, events
and `checker_calls` (which hold learner-authored answer text) with it:
```sql
delete from public.students where display_name = 'ZZ Toets';
```
If the 20-calls-per-hour cap bites mid-testing, clear only that learner's counter:
```sql
delete from public.checker_calls where student_id = '98e6d6a4-8060-4382-b054-cafb42e68c5e';
```

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
