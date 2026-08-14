# Dynamic Geometry build day — session prompts (foreman: Fable, 2026-08-14)

> **STATE at end of day 1:** Prompts 1+2 DISPATCHED, BUILT, FOREMAN-REVIEWED
> (dg0–dg3 committed local). **Prompt 3 below is DRAFTED, NOT DISPATCHED — the
> gate is Megan's own playthrough of dg0–dg3 first (her word, 2026-08-14
> evening).** Next session: she reviews, then the foreman pastes Prompt 3 into
> chat for her to dispatch (or runs it on her word, as sessions 1+2 ran).

Backup copy of the numbered prompts pasted in chat. Chat is the delivery; this file
is the record. Her rulings today: arcs 1+2 first · group gets its OWN home card
(Proofs pattern) · she produces the Tripo fold WebP today (arc 5, later session) ·
sandbox free-play panels YES before questions.

---

## Prompt 1 — Session 1: scaffolding + Arc 1 (moving points)

You are build session 1 of the Dynamic Geometry chapter for Circle Quest, dispatched
by Megan on a foreman build day — building within this brief is approved. A foreman
session reviews your work after you report; end your report by listing every file you
changed and the fresh checker output. Commit LOCAL only.

Repo: `C:\Users\megzi\Desktop\Claude Code Projects\circle-geometry-game`
Read FIRST: `DYNAMIC-GEO-PLAN.md` (repo root) — this session builds its §1 (moving
points), minus the capstone. Source booklet if needed:
`C:\Users\megzi\Desktop\Wiskunde Boekies\2026\Grade 11\Term 3\3. Dynamic Geometry.pdf`.

### Build

1. **Group scaffolding — mirror the Proofs pattern exactly.**
   - New `js/dynamic.js` modelled closely on `js/proofs.js`: its own home-screen card
     (working title EN "Dynamic Geometry" / AF "Dinamiese Meetkunde" — hers to rename;
     no round-count number in the blurb, it goes stale), first round ALWAYS unlocked,
     sequential unlock inside the group, next-to-play button.
   - New round kind `"dynamic"`, group `"g8"`, hidden from the badge ladder the same
     way g7 is. Route the kind wherever `kind === "proof"` is routed (see js/game.js)
     so it renders through `renderInvestigate()`.
   - `js/rounds/index.js`: imports, ORDER — dg rounds go right AFTER pr9 and BEFORE
     inv1 (that position is load-bearing; read the comment there), GROUP_OF entries,
     and the MAIN_ROUNDS filter must ALSO exclude `kind === "dynamic"` so the main
     map stays exactly 43. `FINAL_QUEST_ROUND_ID` stays `"r21"` — do not touch.
   - `js/config.js`: add `dynamicXpPerPanel: 10` (mirror `proofXpPerPanel`; XP is
     always computed from `panels.length`, never hard-coded).

2. **Engine — additive, opt-in only** (the standard the recent `d.key` / `o.rot` /
   `panel.scaffold` additions set: nothing that doesn't use the new option changes).
   - **Condition-lock drag**: a drag panel option where the drag visibly SNAPS when a
     stated relation locks (parallel marks flash). Needed later for the EF ∥ BD
     capstone — this session builds the mechanism + demo, NOT the capstone round.
   - **Live derived readout**: extend the existing readings display so a panel can
     show a computed value updating live during a drag (this session: the inscribed
     angle; later: area).
   - **Play/glide button**: tap-and-watch the point move as an alternative to
     dragging. Must also work as a scrubbable slider — browser-pane verification on
     this machine cannot rely on requestAnimationFrame, and slow replay is the
     learning feature anyway.

3. **Rounds dg0 + dg1** (fresh questions, to-scale, booklet STYLE never copied):
   - **dg0 "watch it move"** — sandbox panel FIRST (her ruling: free play before any
     question, Station drag-and-notice DNA). Drag C along the arc with the live
     inscribed-angle readout: constant across the whole segment, JUMPS to the
     supplement when C crosses the chord. Discovery rule: raw measurements on screen,
     NEVER the conclusion — the learner is asked what they noticed afterwards.
   - **dg1 "freeze it"** — movie first, snapshot second: the app freezes C at a new
     position and asks booklet-style questions on the still, now-familiar figure.

4. **Demo/verify surface**: extend the repo's verify-page pattern (verify.html /
   verify-daily.html) or add one so the new engine pieces and every new figure can be
   mounted headlessly for foreman review.

### House rules that bite here
- Bilingual EN/AF throughout; AF wording: "Drag" stays "Drag" (never "Sleep"),
  reasons written out in words, never the word "frase".
- Tap/drag only — no typing anywhere.
- Public repo: no learner names, no real test/exam content.
- Labels: ≤55 units from vertex; measure with real `getBBox()` only AFTER
  `await document.fonts.ready`; probes can't see text-on-arc or text-on-point
  collisions — RENDER every figure and LOOK.
- No classroom catchphrase this session (one per arc, and none is assigned here).

### Do NOT touch
No push. No migrations, nothing under `supabase/`. No `sw.js` change unless a new
file genuinely needs precaching (the proof rounds shipped without touching it —
check, don't assume). No admin files. Shared CSS: additive new rules only. Don't
reorder existing ORDER entries.

### Verify before reporting (all fresh, no reuse of old output)
- `node tools/verify-node.mjs` · `node tools/audit-options.mjs` ·
  `node tools/check-bilingual.mjs` · `node tools/check-table-summary.mjs` — all green.
- Browser-walk dg0 and dg1 end to end at 375px in BOTH languages: every panel
  advances, drags work, 0 console errors, 0 horizontal overflow.
- Confirm: main map still 43 rounds, badge counter still /5, new card renders with
  dg0 unlocked and dg1 locked, Teacher Preview sees both unlocked.

---

## Prompt 2 — Session 2: Arc 2, THE UNROLL

*(Dispatch only after the foreman has reviewed session 1 — this session builds on
its scaffolding. Adjust dg-numbering to whatever session 1 actually landed.)*

You are build session 2 of the Dynamic Geometry chapter for Circle Quest, dispatched
by Megan on a foreman build day — building within this brief is approved. A foreman
session reviews your work after you report; end your report by listing every file you
changed and the fresh checker output. Commit LOCAL only.

Repo: `C:\Users\megzi\Desktop\Claude Code Projects\circle-geometry-game`
Read FIRST: `DYNAMIC-GEO-PLAN.md` §2 — the unroll is HER design and the chapter's
centrepiece; build it as written. Session 1 has already landed the `"dynamic"` kind,
group g8, home card, `dynamicXpPerPanel`, and the play/glide + readout engine pieces —
reuse them, don't rebuild them.

### Build

1. **Engine — the unroll morph** (additive, opt-in):
   - Circle ⇄ straight ruler of length 2πr; the highlighted swept arc SURVIVES the
     morph and lands as a highlighted segment on the ruler; θ/360 pie sits beside the
     ruler; roll back up to the same highlighted arc.
   - Driven by the play/glide + slider mechanism from session 1 — must be fully
     scrubbable (rAF-free verification; replay-at-their-own-pace is the point).
   - Replayable on demand from any panel that opts in.

2. **Rounds** (two, numbered after session 1's):
   - **"The unroll"** — sandbox first: play with the unroll freely. Then the teach
     sequence: point moves → arc highlights → unroll → the segment on the ruler →
     the pie shows the fraction → roll back. Raw lengths/angles shown, conclusion
     asked, never stated (discovery rule).
   - **"Her method drill"** — workbook p.100 method exactly: central angle of the
     swept arc → θ/360 → × 2πr. Panels: read the swept angle off the figure (the
     theorems find it), pick the fraction, compute — tap-only choices. Every number
     derived from the actual figure's radius and angle so verify-node can check it;
     distractors are the classic slips (circumference fraction vs whole, θ vs
     360−θ, diameter vs radius).

### House rules / Do NOT touch / Verify
Identical to Prompt 1's three blocks, plus: walk BOTH new rounds at 375px in both
languages, and scrub the unroll from 0 → 2πr → back at three slider positions,
confirming the highlighted segment length matches θ/360 × 2πr at each.

---

## Prompt 3 — Session 3: Arcs 3+4, diagrams-from-words + adding lines
### ⛔ DRAFTED 2026-08-14, DO NOT DISPATCH until Megan has played dg0–dg3

You are build session 3 of the Dynamic Geometry chapter for Circle Quest, dispatched
on a foreman build day. A foreman session reviews your work after you report. Commit
LOCAL only — never push. End your report by listing every file you changed and the
fresh checker output.

Repo: `C:\Users\megzi\Desktop\Claude Code Projects\circle-geometry-game`
Read FIRST: `DYNAMIC-GEO-PLAN.md` §3 and §4. Then read
`js/rounds/dynamic1-freeze-it.js` and `js/rounds/dynamic3-her-method-drill.js` as
style references — sessions 1+2 landed the kind/"dynamic" scaffolding, group g8,
home card, XP config, and engine extras; REUSE, don't rebuild. NO new engine work
is expected this session — every figure is static and declared (verify-node
checkable), every panel uses the existing choice/blank/note machinery.

### Build — three rounds, dg4 + dg5 + dg6
**Bail-out rule: if the session is running long, land dg4 + dg5 fully verified and
report — dg6 becomes its own prompt. Never rush three half-checked rounds.**

1. **dg4 "Pick the diagram"** (plan §3a). Each panel: a booklet-style sentence
   ("PQ is a diameter; R lies on the major arc; T is the point of tangency…") and
   FOUR candidate mini-diagrams as tap options — one correct, three traps built
   from REAL misreadings, each trap a genuine parse of the sentence read wrongly,
   never a random wrong picture. The plan names the trap families: the new point
   on the wrong side / wrong arc, the given angle in the wrong segment, tangent
   vs chord confusion. Fresh sentences, fresh letters — workbook scenarios
   (a)–(e) are the INSPIRATION for shapes, never copied. Mini-diagrams in an
   options row must be visually comparable (same circle size, same viewBox) so
   the ONLY difference between candidates is the geometry being tested.
2. **dg5 "Build it with me"** (plan §3b). The read-the-sentence-draw-the-piece
   habit, staged: each panel adds ONE given fact from the sentence and the figure
   grows by exactly that piece (the existing staged per-panel figure pattern —
   pr8's claim-lines convention applies: a piece once drawn is NEVER lost from a
   later panel). Between stages, the learner taps WHICH piece the next clause
   adds — reading is the skill being drilled, not the theorem.
3. **dg6 "Which line unlocks it?"** (plan §4). The proof rounds' construction
   DNA, as options, not point-taps: a stuck figure, four candidate lines to add
   (join two points / draw a radius / join to the far end of a diameter / drop
   the perpendicular from the centre), one of which unlocks a theorem. Include
   at least one two-circle tangent (raaklyn) figure per plan §4. The
   legal-constructions rule carries over verbatim: join points and draw radii,
   never "construct" a property you haven't proven. The classroom catchphrase
   may appear ONCE in this round only (once per arc, verbatim English in both
   languages — copy how pr2/pr6/pr8 use it), and nowhere in dg4/dg5.

### Conventions from sessions 1+2 reviews (follow them)
- Afrikaans: "Trek" for drag, "Skuif" for slide-along-path, "Klik op" for taps —
  never "Drag"/"Sleep"/bare "tik"/"frase". Reasons written out in words.
- Draggable-point letters radial-outward (unlikely to matter here — static
  figures — but if any panel goes live, the dg0 dots comment is the pattern).
- No round-count numbers in card/blurb text (they go stale).
- Distractor VALUES and trap DIAGRAMS must be genuinely derivable mistakes —
  verify each trap diagram is a consistent figure (to scale, just wrong), the
  same standard pr8b set ("the trap point also gives a genuine 90°").

### House rules that bite
Bilingual EN/AF · tap-only, no typing · public repo: no learner names, no real
test content · labels ≤55 units, getBBox after `await document.fonts.ready`,
RENDER every figure and LOOK (probes miss text-on-arc/point collisions) · mini
diagram rows: check phone width (375px) legibility — if a 4-candidate row is
unreadable, stack 2×2 rather than shrinking.

### Do NOT touch
No push. No migrations / supabase/. No sw.js unless genuinely needed (check).
No admin files. Shared CSS additive only. Don't reorder ORDER; dg4–dg6 slot
after dg3, before inv1. Don't modify dg0–dg3.

### Verify before reporting (all fresh)
The four checkers (tools/verify-node.mjs, audit-options.mjs, check-bilingual.mjs,
check-table-summary.mjs) all green · browser-walk every new round end to end at
375px in BOTH languages, 0 console errors, 0 overflow · verify-dynamic.html
extended to mount the new figures · main map still 43, badges untouched.
