# Chunk D — more practice, on the theorems the line never touches

**Her brief, 2026-07-30 (verbatim):** *"I want a few more additional questions
(similar to the ones in the investigation station now, just for other theorems so
they get more practice)… maybe add 2 or 3 rounds per station"* — and, on scope:
*"More panels inside each station, but they earn XP for each panel, shame"*, and on
theorems: *"I kinda want all of them, but it does not have to happen in one
session."*

So Chunk D is **2-3 extra question panels inside each of the six existing
stations**, drilling the same six investigation skills on theorems the line has
never used. The train stays six stops. No new stations, no badge or ladder changes.
**It is explicitly a multi-session build** — do one theorem at a time.

---

## 0. The line is HIDDEN from learners until Chunk D is done

`CONFIG.stationsLive` in `js/config.js` is **false** (her call, 2026-07-30: *"can we
hide it from the learners for a little while more, until we added the other
panels?"*). While it is false there is no way in — no train strip on the home
screen, and the `stations` / `investigate` routes bounce back home, so a guessed or
shared URL cannot reach it either. **Use `?stations=1` to walk it while hidden.**

Two consequences:
  · **The rest of the app can be pushed whenever she wants.** Chunk C also improved
    two live discovery rounds and the shared engine; those fixes no longer have to
    wait for the station. `/ship` is safe with the flag off.
  · **Flipping the flag to true IS the release.** Do it in the same session as the
    last checklist tick below, not before — and remember §1: the XP change has to
    land before learners can bank any station XP.

## 1. THE XP CHANGE — do this FIRST, and do it BEFORE the push

Her call: a learner should earn XP **per panel**, not a flat 50 for the station.
The current design is deliberately flat (`CONFIG.investigationXp: 50`, awarded once
in `finish()`), and the header of `js/investigate.js` argues for it. Read that
argument before changing it, because **half of it still stands**: XP must never be
scaled by attempts or by correctness — a learner who fights through five attempts
has investigated MORE, not less. Per-PANEL is compatible with that. Per-ATTEMPT is
not. Do not drift into the second one.

**Why it has to happen before `/ship`:** checked on 2026-07-30 — `progress` has
**0 rows** for `inv%` and `xp_events` has **0**, because the line has never been
pushed. So nobody has banked station XP yet and there is no back-pay problem. But
a re-play pays 0 (`alreadyDone` in `finish()`), so the moment learners start
finishing stations, anyone who finished before the change is stuck on the old
amount. Land the XP change while that number is still zero.

**Recommended shape** (mine, her call to confirm):
  · **10 XP per panel, every panel type.** Simple to explain to a class — "ten a
    panel" — and impossible to get subtly wrong. Today's 34 panels → **340 XP**
    (against 300 now); after Chunk D's ~15 new panels → **~490**.
  · **Still banked ONCE, at the end of the station**, with the amount computed as
    `panels.length × perPanel`. That needs no partial-submission machinery and
    keeps a single reliable write.
  · **Show a "+10 XP" tick as each panel is completed** so it FEELS per-panel. The
    tick is display only; the bank still happens at the end.
  · The alternative — paying only for *answerable* panels (`blank` / `choice` /
    `written`, which is 26 of the 34) — was considered and rejected: Station 1's
    explore panel now makes the learner record three readings, which is real work,
    and a `note` panel they actually read is the teaching. Paying for all of them
    is both simpler and fairer.

**Open sub-decision for her:** is the on-screen tick enough, or does she want the
XP genuinely banked panel-by-panel so it survives quitting halfway? The second
needs partial submission (a `progress` write mid-station) and is a real piece of
work — ask before building it.

**What to touch:**
  · `js/config.js` — `investigationXp: 50` becomes a per-panel rate. Keep the old
    key name out of the way rather than silently changing its meaning.
  · `js/investigate.js` `finish()` — `xpGained` computed from `panels.length`.
  · Anywhere that PROMISES a number: grep for `50` near XP in `js/stations.js`,
    the results screen, and the station-map copy. A station that says "50 XP" and
    pays 70 is a bug learners will notice.
  · The `/ship` sequencing note below.

---

## 2. THE THEOREMS, and which skill each one actually suits

The line currently only ever uses **centre-double, same-segment, line-from-centre,
semi-circle, cyclic quad (opposite + exterior)**. She wants all four of these
added, over as many sessions as it takes:

| theorem | best stations for it | why that skill fits |
|---|---|---|
| **Tangent-radius** (tangent ⊥ radius at the point of contact) | 5 · Turn It Around, 4 · Prove It | It has a clean, TRUE, genuinely useful converse ("if the line is perpendicular to the radius at its end, it is a tangent") — Station 5's third category. And the classic error is using it where the line is not actually a tangent, which is Station 4's business. |
| **Tan-chord** (angle between tangent and chord = angle in the alternate segment) | 4 · Prove It, 6 · Explain It | The class's biggest mark-loser, and its error is subtle in the right way: the WRONG alternate segment. Explaining which segment is which to a friend (Station 6) is exactly the kind of writing that exposes whether they understand it. |
| **Two tangents from a point** (equal in length) | 1 · Measure & Notice, 2 · State the Conjecture | The easiest of the four to measure and notice, so it suits a drag-and-record panel and a state-it-precisely panel. Note the precision trap for Station 2: from the SAME external point. |
| **Equal chords** (equal chords subtend equal angles / are equidistant from the centre) | 3 · Break It, 1 · Measure & Notice | The counterexample writes itself: learners forget it needs the SAME circle (or circles of equal radius). Two different-sized circles with equal-length chords break it immediately — a real Station 3 hunt. |

**Suggested order — one theorem per session, not one station per session.** Each
theorem then lands as a coherent addition (2-3 panels across the stations where it
fits) instead of six half-finished stations. Recommended sequence, easiest first:

  1. **Two tangents from a point** — easiest to measure, easiest figures.
  2. **Equal chords** — the counterexample is clean and the figure is simple.
  3. **Tangent-radius** — introduces the converse work.
  4. **Tan-chord** — hardest, most valuable, do it once the pattern is grooved.

## 3. Typed vs tap — her ruling: **mostly taps, 1-2 typed in the whole of Chunk D**

Today proved taps can carry real teaching: the IF…THEN swap recognition and the
theorem-naming panel are both taps and both do genuine work. Every typed panel, by
contrast, costs a `panel_memos` row, a probe run, and a 12-second wait for the
learner. So default to `choice`, `blank`, `predict` and `explore`, and spend the
one or two typed panels where WRITING is the skill — tan-chord in Station 6 is the
obvious candidate.

**If you do add a typed panel, it is not done until:** it has a `needs` list and
`starters`, a `memoDisplay`, a row in `panel_memos` AND the same text in
`supabase/phase16.sql`, and `node tools/probe-checker.mjs <panelId>` passes with at
least one accept, one near-miss, and one wrong-theorem case. A memo is a prompt and
cannot be eyeball-checked — that is exactly how `s4p4` shipped unfair.

---

## 4. RULES THE NEW PANELS MUST FOLLOW

These are the ones that cost a session to learn. Breaking any of them reproduces a
defect Megan already found once.

**Writing the panel**
  · **Teach before you ask.** A learner who has read everything ABOVE the question
    must be able to answer it. This was the root cause of five of the 21 findings.
  · **Never assert a number the copy cannot know.** "Five measurements", "three came
    out double" — if the learner generated it, COMPUTE the sentence (see
    `tableSummary` in `invest01-measure.js`). This bit twice: N4 and `s3p4`.
  · **Define a big word at first use, in the PROMPT, before it is needed.** Not in
    the note afterwards. `conjecture` (inv1 p1), `counterexample` (inv3 p2) and
    `converse` (inv5 p1) are the models. Do not stack definitions on one slide.
  · **Hint rung 1 may ask a question; rung 2 must TELL.** A hint only ever appears
    when a learner is stuck, and a stuck learner handed another question is handed
    nothing.
  · Marks talk is welcome; **the exam board's name is not** (her ruling, N5).

**Options** — read `js/options-order.js` first, it is short
  · Options are shuffled, so **never describe one by its position** in a `note`,
    `hints` or `memoDisplay`. Three notes had to be rewritten for this.
  · **Level the lengths.** The correct option was the longest in 13 of 19 panels.
    If the right answer is legitimately the fullest, PAD THE DISTRACTORS — a wordy
    answer that still says nothing is the real trap in marking.
  · Mark a numbered sequence `keepOrder: true`; `pin: true` a trailing catch-all
    ("None of them", "Nothing is wrong").
  · Don't rely on the shuffle to hide a lazy option set. Write four real answers.

**Figures**
  · Every marked angle needs its true `o.v`, and the figure must be **to scale** —
    the engine measures the drawing and `verify-node.mjs` fails on a mismatch.
  · To mark an angle without labelling it, use `t: ""` and KEEP `o.v` (that is how
    `s6p4` shows Station 2's figure without handing over the conjecture).
  · `noCircle: true` and free `pts: { P: {x, y} }` exist now, for figures that are
    about points rather than about a circle.
  · A discovery figure shows raw measurements, **never the conclusion**.
  · A panel that refers back to another station must CARRY what it refers to — the
    stations get played days apart.

**Before calling it done — all four must be green**
```bash
node tools/verify-node.mjs          # every drawn angle matches its declared value
node tools/audit-options.mjs        # no positional tell, no unmarked sequence
node tools/check-bilingual.mjs      # every learner string has both languages
node tools/check-table-summary.mjs  # only if Station 1's generated copy changed
```
Then walk it in the browser in BOTH languages. ⚠️ The pane serves stale ES modules — and on
2026-07-30 the reason was finally found. **The project's own `.claude/launch.json`
is not the file the Preview MCP reads.** A session whose working directory is
`~/.claude` (which is how Circle Quest sessions start) makes it read
`C:\Users\megzi\.claude\.claude\launch.json`, and that file's `circle-quest` entry
was running `python -m http.server` — which honours `If-Modified-Since` and answers
**304**, so every edited module kept loading from the browser cache. The Chunk C fix
was correct and simply unreachable. It now runs `cmd /c cd /d <project> && python
serve.py 5180` (the shape the `nwu-hub` entry already used — `serve.py` serves its
own CWD and takes no `--directory`, so it must be launched from the project).
Verified: responses now carry `no-store` and a bare URL serves the edited file.

Diagnose a suspected stale module by fetching the bare URL against `?bust=random`
and comparing lengths — and note that `fetch()` itself can answer from the HTTP
cache, so use `fetch(url, {cache:'reload'})` when checking response HEADERS.
After editing a module the page has already loaded, still navigate with
`force: true`.

---

## 5. Where things are

| what | where |
|---|---|
| the six stations | `js/rounds/invest01-measure.js` … `invest06-explain-it.js` |
| panel types + the engine | `js/investigate.js` (header lists every panel shape) |
| option-order rules | `js/options-order.js` |
| draggable models | `js/interactive.js`; reuse a discovery `MODEL()` where one exists |
| still figures | `js/engine.js` (`renderDiagram`, and the spec is in its header) |
| mark schemes | `supabase/phase16.sql` + the live `panel_memos` table |
| XP + thresholds | `js/config.js` |
| the train + station map | `js/stations.js` |

**Panel shapes available:** `explore` (drag; `record` writes a readings table),
`blank` (word bank / number pad), `choice`, `predict` (a guess, never scored,
never reaches the stats), `note`, plus on any panel: `diagram`, `diagrams` (a row
of mini figures), `solution` (statement + reason lines with an optional gap),
`showRecord` (a table recorded earlier), and a `prompt` that may be a FUNCTION of
the run's `scratch`.

**Where the new panels go inside a station:** before the closing `note` panel, not
after it. Stations 1, 3 and 6 end on a "keep this in mind" slide that is meant to
be the last word.

---

## 6. Progress checklist — tick as sessions land

- [x] **XP per panel** — DONE 2026-07-30. `CONFIG.investigationXpPerPanel: 10`
      (the old `investigationXp` key is gone, not repurposed); `finish()` banks
      `panels.length × rate` once; a "+10 XP" tick in the station header flashes
      per panel and settles to a running total, and is hidden entirely on a replay
      because a replay pays 0. Her sub-decision, asked and answered: **the tick is
      enough** — genuinely banking mid-station would need a record of which panels
      already paid (there is no resume today, so a learner who quits restarts at
      panel 1 and would be paid twice), plus resume screens.
      Two things this turned up, both fixed:
        · the station map hard-coded nothing but promised one number for all six
          stops. It now states the RATE, and each stop card computes its own total
          from `panels.length` — so a station that gains a panel starts advertising
          the higher number by itself. Verified live: Stop 1 → 80 XP, Stop 2 → 70.
        · the results screen said NOTHING about station XP, and never had — the
          `params.discovery` branch of `game.js` is marked "no score, no XP", which
          is true of discovery rounds but not of a station reusing that branch. The
          pill is now gated on `params.xp > 0`, so whatever pays, shows. Verified in
          all three cases: station pays → pill; replay → no pill, existing "no XP
          this time" message; real discovery round → unchanged.
- [x] **Two tangents from a point** — DONE 2026-07-30, three panels, all taps, no
      new memo and no probe run. Station 1 gets a measure-and-notice panel over
      somebody else's readings (before the closing note, per §5); Station 2 gets
      the sentence-build and the four-learners judge, appended after panel 5
      because panels 1-5 are one continuous argument that cannot be interrupted —
      and panel 5's closing line ("the condition you kept putting in — SAME side —
      was never decoration") is the cleanest possible way in to a theorem whose
      dropped condition is the SAME external point.
      · **A still figure, not a new draggable.** `TAN_FIG` is exported from
        `invest01-measure.js` and imported by Station 2, so the two stations show
        the identical picture days apart. §2 suggested a drag-and-record panel;
        the N8 precedent (no new interactive without asking) and the pane's
        inability to test dragging both argue against it. **If she wants the drag,
        say so — it is a real build, not a tweak.**
      · The readings are computed, not invented: PT = PS = R·tan(θ/2), so at a 4 cm
        radius θ = 60/100/130° gives 23.1, 47.7 and 85.8 mm. Written as 23/23,
        48/47 and 86/86 — whole millimetres, so neither language needs a decimal
        separator, and the 48/47 row is a ruler reading that deliberately echoes
        the 97°/49° row this station already taught. The drawn figure IS the 47.7
        row (70 px = 4 cm, PT = 83.4 px).
      · New word chips: `ptDifferent`, `posOutside`, `posInside`, `posOn`;
        `sideSame` and `sideOpposite` reused rather than duplicated. Every
        distractor was checked for grammar in BOTH languages when substituted into
        the slot — an earlier "any / enige" option was dropped because "from any
        point outside a circle" is arguably TRUE, and an ambiguous distractor is
        the kind of unfairness this brief exists to prevent.
      · Still to come for this theorem if she wants it: nothing required. It is a
        complete addition as it stands.
- [x] **Equal chords** — DONE 2026-07-31, three panels (all taps, no new memo,
      no probe run), same budget as two-tangents. Station 1 gets a
      drag-and-record panel on `discover-equal-chords.js`'s own CENTRE model
      (exported as `MODEL`, same reuse trick as the other two theorems) plus a
      "what did your table say" choice panel; Station 3 gets the counterexample
      — two circles of different radius (4 cm / 7 cm), each carrying a chord of
      the same real length (6 cm, marked with tick marks), whose central
      angles come out at 97° and 51°. Both inserted before each station's
      closing note, per §5.
      · **Station 1 chosen over Station 2** (the brief left it open) — it pairs
        with the theorem table's own row ("3 · Break It, 1 · Measure & Notice")
        and keeps Station 1's shape consistent with its two-tangents addition:
        drag-and-record, then a choice panel reading the table back.
      · **No new interactive.** `discover-equal-chords.js`'s `CENTRE` factory
        was renamed to `MODEL` and exported — same convention as
        `discover-centre-circ.js` and `discover-tangents-point.js` — so Station
        1 drags the exact figure the class already met in the discovery round.
        Its own `measure()` already returned both chord lengths and both
        central angles, so no new figure code was needed.
      · **Station 3's two circles don't need pixel-identical chords.** The
        6 cm chord in each renders within half a pixel of the other (89.9px vs
        90.4px at 15 px/cm) — invisible, and the tick marks assert "equal"
        as the GIVEN rather than something to measure off the picture, the
        same convention `chordMark()` already documents itself as decorative.
      · Verified live (`?local=1`, dev-console pointer-drag simulation since
        the preview pane cannot drag by hand): 3 distinct rows record
        correctly with `unit:""` on both chord columns (no stray "°" on a
        length — the same trap two-tangents already found once), the choice
        panel's showRecord carries the table forward, both new panels walked
        correctly in English AND Afrikaans, and both `.mk` tick marks render
        on Station 3's diagrams. `verify-node` 419/764/0; `audit-options`
        clean (no positional tell, no unmarked sequence); `check-bilingual`
        clean; no console errors.
      · Still to come for this theorem if she wants it: nothing required.
- [x] **Tangent-radius** — DONE 2026-07-31, three panels (all taps, no new memo,
      no probe run), same budget as the previous two. Station 5 gets two panels
      inserted between the "true but useless" example (panel 3) and the start
      of the cyclic-quad deep-dive (panel 4) — a judge panel (this converse is
      the station's fourth example, and the promised true-AND-useful one) and
      an apply panel (given a right angle at a point on the circle, conclude
      the line is a tangent), the same judge-then-apply shape the station
      later uses for the cyclic-quad converse. Station 4 gets one panel,
      appended after the closing typed panel (s4p5) rather than inserted mid-
      station — panels 1-6 there are one continuous argument, same call as
      Station 2 in the two-tangents session.
      · **No new interactive, and no new to-scale figure from scratch.**
        Station 5's figure (`TANRAD_FIG`) is the same O–radius–tangent
        geometry already verified for round09 (`r9`) and the discovery round
        `dtanrad`. Station 4's figure (`TANRAD_ERR_FIG`) reuses the exact
        T/D/P points from `discover-tangent-radius.js`'s own derivation
        (∠TPD = 90° by the semicircle theorem) — the class already met this
        picture deriving tan ⊥ radius, so Station 4 asks them to catch the
        theorem being misapplied to it.
      · **Station 4's teaching point:** the classic error is not a wrong
        number — ∠TPD = 90° is genuinely correct — it is reaching for
        "tan ⊥ radius" when no tangent is drawn anywhere (TP and PD are
        chords). The sharp distractor swaps in "tan ⊥ diameter", which fixes
        the terminology and misses that there is still no tangent at all.
      · **A real bug caught by the browser walkthrough, not the checkers.**
        Station 4's first draft put a full English sentence ("TD is a
        diameter; P is a point on the circle.") into a `solution.lines[].st`
        field. That field is rendered verbatim, never translated — every
        existing use of it is symbol-only (`∠ABC = 50°`, `OA = OC`) by
        convention, so `check-bilingual.mjs` doesn't scan it and passed clean
        both times. It only showed up as untranslated English while walking
        the panel in Afrikaans. Fixed by moving the setup into the bilingual
        `prompt` and leaving the solution line as pure symbol (`∠TPD = 90°`).
        **Rule worth keeping: `solution.lines[].st` is symbol-only, never
        prose — put any sentence that needs translating in `prompt`, `rs`, or
        `note` instead, and always walk a `solution`-block panel in Afrikaans
        even after the checkers are green.**
      · Verified live (`?local=1`, console jump into `inv5` and `inv4`):
        all three panels answer correctly, show the right REASON pill
        (`converse tan ⊥ radius` / `∠s in semi-circle`), and render clean in
        both English and Afrikaans after the fix. `verify-node` 422/767/0;
        `audit-options` clean (no positional tell, no length tell — inv5 p4/p5
        both land at 25/25/25/25 across the sample); `check-bilingual` clean;
        no console errors.
      · Still to come for this theorem if she wants it: nothing required.
- [x] **Tan-chord** — DONE 2026-07-31, two panels: one tap (Station 4) and the
      ONE typed panel this whole brief budgeted for (Station 6, s6p5). `progress`
      was checked for `inv4`/`inv6` before starting — still empty for both, so
      no back-pay gap.
      · **Station 4 "Prove It"** gets one panel, appended after the tangent-
        radius addition (panels 1-6 are one continuous argument; new theorem
        additions keep appending at the end, same call as the last two
        sessions). New figure `TANCHORD_ERR_FIG`: T:270, A:38 are the exact
        points already verified in `data-tanchord.js`'s own "spot the theorem"
        mini-figure (tg+ leg gives a 64° tangent-chord angle at T), plus a new
        point Q at 350° on the NEAR arc — the same side the tangent ray points
        into. A "learner's solution" line claims `∠TQA = 64° (tan-chord
        theorem)`; the real fault is that Q is in the SAME segment as the
        tangent-chord angle, not the alternate one, so the theorem never
        applied to it at all — `∠TQA` actually works out to 116° (angles in
        the two segments of one chord are supplementary). This is the classic
        error the brief named: grabbing the nearest point on the circle
        instead of checking which SIDE of the chord it is on.
      · **Station 6 "Explain It"** gets `s6p5`, inserted before the closing
        note (panel 5 of 6 now) — the one typed panel Chunk D's whole brief
        budgeted for (§3: "mostly taps, 1-2 typed in the whole of Chunk D").
        New figure `TANCHORD_FIG` reuses the same T:270/A:38 points, this time
        showing BOTH candidates: P (150°, the true alternate segment) and Q
        (350°, the near-side trap) — neither labelled with its own angle value
        (`t: ""`, `o.v` kept, same convention as `FIG_BOWTIE`), so the figure
        does not hand over which one is right. The learner explains to a
        friend how to FIND the alternate segment and why the near point is a
        trap — writing, not tapping, which is exactly the skill Station 6
        exists to drill on this theorem (§2 of the brief).
      · **No new interactive, and both figures reuse already-verified points.**
        `TANCHORD_ERR_FIG` and `TANCHORD_FIG` both build on the exact T:270,
        A:38 coordinates already shipped and verified in `data-tanchord.js` —
        only the new points (Q, and P+Q together) needed fresh geometry, and
        both are plain inscribed-angle results (128°/232° arcs → 64°/116°),
        not hand-tuned.
      · **The `s6p5` memo, mirrored to `phase16.sql` and applied to live.**
        Two required ideas, neither needing the letters P/Q by name — a
        learner who explains it purely by side (near/far, same/opposite) has
        answered just as completely as one who names the points. Probed with
        `node tools/probe-checker.mjs s6p5` against a throwaway learner
        (created → probed → deleted, cascade clean): 4/4 passed — both
        `got_it` cases (EN full answer, AF informal) accepted; the near-miss
        (names the right point, never says why the other is wrong) came back
        `partly` with a nudge asking for the missing half; the wrong-theorem
        case (blames "OQ is not a radius" instead of which side of the chord)
        came back `not_yet` with a corrective nudge. Added to probe batch 3
        alongside `s6p3`/`s6p4`.
      · **No `solution.lines[].st` prose risk this time** — Station 4's new
        panel keeps its one solution line symbol-only (`∠TQA = 64°`), and
        Station 6's panel doesn't use a `solution` block at all, so the bug
        tangent-radius found (an English sentence smuggled into a field the
        engine never translates) had nowhere to recur. Walked anyway, in both
        languages, per the rule that check-bilingual cannot catch this class
        of defect.
      · Verified live (`?local=1` on the `circle-quest-b` port, since another
        session's dev server already held this folder's default port; console
        jump into `inv4` and `inv6`): both panels render correctly in English
        AND Afrikaans, the Station 4 tap shows the right REASON pill (`tan
        chord theorem` / `raaklyn koord stelling`) and note in both languages,
        and Station 6's hint ladder (rung 1 question, rung 2 tell) and
        `memoDisplay` reveal all render clean in both languages. No console
        errors. `verify-node` 424/772/0 (up from 422/767); `audit-options`
        clean (inv4 p8's correct option lands at 217 vs a 138-char runner-up —
        1.57×, under the 1.6× tell threshold, so no padding needed);
        `check-bilingual` clean; `check-table-summary` clean (no Station 1
        change this session).
      · **This is the last of the four Chunk D theorems — the whole brief is
        now built.** Nothing further is required by the original scope.
- [x] Re-run all four checkers + walk both languages — done 2026-07-30, and she
      play-tested the line herself end to end.
- [x] **`CONFIG.stationsLive` is TRUE — RELEASED 2026-07-30.** Her call after
      play-testing: *"make it visible for the learners"*. Note this is EARLIER than
      the original plan, which said to wait for all four theorems. That is fine and
      deliberate: the six stations were already complete before Chunk D began, and
      the remaining three theorems only ADD extra practice panels to finished
      stations — nothing a learner meets is half-built. Setting the flag back to
      false hides the whole line again, in one line.
- [x] `/ship` — done 2026-07-30.

**So the three remaining theorems are now additions to a LIVE line, not to a hidden
one.** Two things follow, and they are the only things that change:
  · A new panel raises that station's XP automatically (the total is
    `panels.length × rate`, never hard-coded) — but a learner who ALREADY finished
    that station is not paid the difference, because a replay pays 0. That is the
    same back-pay problem §1 was sequenced to avoid, and it is now live. Adding
    panels to a station the class has finished means those learners keep the old
    total. Worth deciding per theorem: add to stations they have not reached yet,
    or accept the gap.
  · Everything else is unchanged — no migration, no re-release, no badge or ladder
    changes. Build the theorem, run the four checkers, push.

---

## 7. Do NOT do these

  · **Do not loosen `s2p4`.** Settled 2026-07-30 by firing real answers at it: "at
    the circumference" alone is genuinely insufficient (on opposite sides of the
    chord the angles are supplementary, not equal). Only "in the same segment"
    satisfies it, which is what its hints now teach.
  · **Do not put a theorem-name requirement back into `s4p4`.** The panel asks what
    the shorter solution SPOTTED. A derivation is a stronger answer than a name.
  · **Do not build N8** (the rotating-line interactive for "Break It") without
    asking — she ruled Station 3 to static figures on 2026-07-30. The design is in
    `docs/investigation-station-playthrough-notes.md` if she changes her mind, and
    equal chords may scratch the same itch more cheaply.
  · **Do not scale XP by attempts or by correctness.** Struggle is the product.
  · **Do not push without her word.**
