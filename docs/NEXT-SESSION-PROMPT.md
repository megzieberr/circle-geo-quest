# Prompt for the next Circle Quest session (Chunk D — tangent-radius)

Paste everything between the lines into a fresh session.

*(Written 2026-07-31, end of the equal-chords session. The previous prompt in
this file — the "I don't get it" dashboard panel — is done and shipped
(commit `0d395a9`); this replaces it.)*

---

Circle Quest. Continue Chunk D — the Investigation Station's extra practice
panels. Two of the four theorems are in (two tangents from a point, equal
chords); today is **tangent-radius**.

Read `PROJECT-STATUS.md` first — "Where we are" at the top, and its two most
recent Decisions entries (equal chords, then two tangents), for the shape this
work has taken so far. Then read `docs/chunk-d-practice-panels.md` in full —
§4's rules and the progress checklist especially — before writing anything.

## The theorem, and where it goes

**Tangent-radius**: a tangent meets the radius at the point of contact at 90°.
Per the brief's table:

- **Station 5 "Turn It Around"** — this theorem has a clean, TRUE, genuinely
  useful converse ("if a line is perpendicular to a radius at its outer end,
  it is a tangent"), which is exactly Station 5's job: judging converses.
- **Station 4 "Prove It"** — the classic error is using the theorem on a line
  that is not actually a tangent, which is Station 4's business (spotting
  misuse, not just applying it).

Both stations already exist and have panels for other theorems — read
`js/rounds/invest05-turn-around.js` and `js/rounds/invest04-prove-it.js` before
designing anything, the same way the equal-chords session read Station 1 and
Station 3 first. New panels go **before each station's closing note**, per §5.

## What "done" looked like the last two times — match this shape

- **Mostly taps.** Two tangents was all taps; equal chords was all taps. Only
  reach for a typed panel if writing is genuinely the skill being tested —
  and if you do, it costs a `panel_memos` row, a `phase16.sql` mirror, and a
  `tools/probe-checker.mjs` run (§3 of the brief).
- **No new interactive without asking (N8).** Check whether an existing
  discovery round or another station's figure already has the picture you
  need — `discover-tangent-radius.js` if it exists — before building
  anything, the same way Station 1 reused `discover-equal-chords.js`'s model
  this session rather than drawing a new one.
- **Level the option lengths, shuffle-safe wording, teach-before-you-ask** —
  all of §4 in the brief. `node tools/audit-options.mjs` catches the length
  and sequence problems; it will not catch a panel that assumes something the
  learner has not been told yet, so read your own panel back before moving on.

## Sequencing — read this before deciding which stations get the new panels

The line is **live** and nobody had started it as of 2026-07-31, so there was
no back-pay gap to worry about this session or the one before it. Check
`progress` for `inv%` rows before you start this one — if any learner has
since finished Station 4 or Station 5, a panel added to that station raises
its total XP, but a REPLAY pays 0, so an early finisher is stuck on the old
total with no way to top up. If that has happened, say so and ask before
adding panels to the affected station; if `progress` is still empty for those
two stations, proceed as normal.

## Before you call it done

```bash
node tools/verify-node.mjs
node tools/audit-options.mjs
node tools/check-bilingual.mjs
node tools/check-table-summary.mjs
```

Then walk the new panels in the browser, both languages. The fastest way to
see just the new content without replaying the whole station — confirmed
working 2026-07-31 — is a console snippet against the running dev server:

```js
(async () => {
  const mod = await import('/js/rounds/index.js');
  const round = mod.ROUND_BY_ID['inv5'];   // or 'inv4'
  round.panels = round.panels.slice(N);    // N = index of the first new panel
  window.__APP__.go("investigate", { roundId: "inv5" });
})();
```

Update `docs/chunk-d-practice-panels.md`'s checklist and `PROJECT-STATUS.md`
the same way the last two sessions did. **Commit locally. Do not push without
her word.**

---

## Also open, but not part of this job

- **Tan-chord is last.** Once tangent-radius is in, that is the only theorem
  left, and Chunk D is done.
- **The marking cap** — each learner gets 20 marked answers/hour via
  `cgg_checker_claim`. Not urgent while the typed-panel count in Chunk D stays
  at 1-2 total, but worth remembering if tan-chord ends up needing one.
