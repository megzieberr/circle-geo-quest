# Prompt for the next Circle Quest session (Chunk D — tan-chord, the last one)

Paste everything between the lines into a fresh session.

*(Written 2026-07-31, end of the tangent-radius session. The previous prompt in
this file — tangent-radius — is done: committed locally, not yet pushed.)*

---

Circle Quest. Continue Chunk D — the Investigation Station's extra practice
panels. Three of the four theorems are in (two tangents from a point, equal
chords, tangent-radius); today is **tan-chord**, the last one.

Read `PROJECT-STATUS.md` first — "Where we are" at the top, and its two most
recent Decisions entries, for the shape this work has taken so far. Then read
`docs/chunk-d-practice-panels.md` in full — §4's rules and the progress
checklist especially — before writing anything.

## The theorem, and where it goes

**Tan-chord**: the angle between a tangent and a chord drawn from the point of
contact equals the angle in the alternate segment. Per the brief's table:

- **Station 4 "Prove It"** — the class's biggest mark-loser, and the classic
  error is picking the WRONG alternate segment (the one on the same side as
  the tangent-chord angle, instead of the opposite one).
- **Station 6 "Explain It"** — explaining which segment is "alternate" to a
  friend is exactly the kind of writing that exposes whether a learner
  actually understands it, not just pattern-matches it. Per §3 of the brief,
  this is the obvious candidate for Chunk D's one (at most) typed panel — if
  writing is genuinely the skill being tested here.

Both stations already exist and have panels for other theorems — read
`js/rounds/invest04-prove-it.js` (now including the tangent-radius panel
appended this session) and `js/rounds/invest06-explain-it.js` before designing
anything, the same way each prior session read its target stations first.
New panels go **before each station's closing note**, per §5 — though check
the station's actual structure first: Station 4 has no closing `note`-type
panel (it ends on a typed panel, s4p5), so the tangent-radius session appended
after it instead. Read Station 6's ending before assuming either way.

## What "done" looked like the last three times — match this shape

- **Mostly taps** — two tangents, equal chords and tangent-radius were all
  taps. Tan-chord is explicitly flagged as the theorem most likely to need
  ONE typed panel (§3 of the brief: "mostly taps, 1-2 typed in the whole of
  Chunk D" — the budget so far is zero typed panels used). If Station 6 gets
  a typed panel, it costs a `panel_memos` row, a `phase16.sql` mirror, and a
  `tools/probe-checker.mjs` run with at least one accept, one near-miss, and
  one wrong-theorem case — budget the session for that.
- **No new interactive without asking (N8).** Check whether an existing
  discovery round already has the picture you need —
  `discover-tangent-chord.js` almost certainly does — before building
  anything. Tangent-radius reused `discover-tangent-radius.js`'s own T/D/P
  points rather than drawing a fresh to-scale figure; look for the same
  opportunity here.
- **Level the option lengths, shuffle-safe wording, teach-before-you-ask** —
  all of §4 in the brief. `node tools/audit-options.mjs` catches the length
  and sequence problems.
- ⚠️ **A bug class the checkers cannot catch, found this session:**
  `solution.lines[].st` (Station 4's worked-solution block) is rendered
  verbatim and NEVER translated — every existing use of it is symbol-only
  (`∠ABC = 50°`, `OA = OC`), which is why `check-bilingual.mjs` doesn't scan
  it. A full English sentence written into that field passed every checker
  clean and only showed up as untranslated English when the panel was walked
  in Afrikaans in the browser. If Station 4 gets a `solution` block again
  this session, keep every `st` symbol-only and put any sentence that needs
  translating into `prompt`, `rs`, or `note` instead — and walk it in
  Afrikaans even after the checkers are green, because this is exactly the
  kind of defect they will not find.

## Sequencing — read this before deciding which stations get the new panels

The line is **live**. Check `progress` for `inv4` / `inv6` rows before you
start this one — if any learner has since finished Station 4 or Station 6, a
panel added to that station raises its total XP, but a REPLAY pays 0, so an
early finisher is stuck on the old total with no way to top up. If that has
happened, say so and ask before adding panels to the affected station; if
`progress` is still empty for those two, proceed as normal. (It was empty for
`inv4`/`inv5` as of 2026-07-31 — check `inv6` too, since this is the first
session to touch it.)

## Before you call it done

```bash
node tools/verify-node.mjs
node tools/audit-options.mjs
node tools/check-bilingual.mjs
node tools/check-table-summary.mjs
```

Then walk the new panels in the browser, **in both languages** — Afrikaans is
not optional this time, per the bug above. The fastest way to see just the
new content without replaying the whole station — confirmed working across
the last two sessions — is a console snippet against the running dev server:

```js
(async () => {
  const mod = await import('/js/rounds/index.js');
  const round = mod.ROUND_BY_ID['inv4'];   // or 'inv6'
  round.panels = round.panels.slice(N);    // N = index of the first new panel
  window.__APP__.go("investigate", { roundId: "inv4" });
})();
```
Reload the page (a fresh navigate, not just a re-run of the snippet) before
jumping into a second round in the same session — the `round.panels` slice
mutates the shared module state, so re-slicing an already-sliced array in the
same page load cuts too much.

If another session's dev server is already running on this folder's default
port, use the `circle-quest-b` preview entry (port 5181) — it exists in the
global `launch.json` for exactly this collision.

Update `docs/chunk-d-practice-panels.md`'s checklist and `PROJECT-STATUS.md`
the same way the last three sessions did. **Commit locally. Do not push
without her word.**

---

## Also open, but not part of this job

- **Once tan-chord lands, Chunk D is done** — all four theorems will be in,
  every station will have its extra practice panels, and nothing further is
  required by the original brief.
- **The marking cap** — each learner gets 20 marked answers/hour via
  `cgg_checker_claim`. Not urgent while the typed-panel count in Chunk D
  stays at 0-2 total, but worth checking if Station 6's panel needs one.
- **`CONFIG.stationsLive` is already true**, and has been since 2026-07-30 —
  no flag flip needed when tan-chord ships, just the usual `/ship`.
