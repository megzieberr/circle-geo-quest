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
Then walk it in the browser in BOTH languages. ⚠️ The pane serves stale ES modules:
`.claude/launch.json` must point at `serve.py` (not `python -m http.server`), and
after editing a module the page has already loaded, **navigate with `force: true`**
— a plain reload and even a new tab will show you the old file and waste your time.

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

- [ ] **XP per panel** (do first, before any push) — config + `finish()` + every
      place that promises a number, then confirm the results screen and the station
      map agree with what is actually banked.
- [ ] **Two tangents from a point** → Station 1 (measure & record), Station 2
      (state it precisely: from the SAME external point).
- [ ] **Equal chords** → Station 3 (counterexample: two circles of different size),
      Station 1 or 2.
- [ ] **Tangent-radius** → Station 5 (its true, useful converse), Station 4 (used
      where the line is not a tangent).
- [ ] **Tan-chord** → Station 4 (the wrong alternate segment), Station 6 (explain
      which segment is which — the one typed panel, if any).
- [ ] Re-run all four checkers + walk both languages.
- [ ] **Flip `CONFIG.stationsLive` to true** — that is the release. Confirm the
      train strip is back for a normal learner (no `?stations=1`).
- [ ] `/ship`.

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
