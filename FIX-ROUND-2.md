# Proof rounds — FIX ROUND 2 (hand-off for the next foreman session)

Written 2026-08-11 evening, end of the daytime resume session. Megan collected
these during her second playtest pass and ran out of session limit before the
batch could run. **The next foreman session picks this up FIRST.** She teaches
proofs from 2026-08-12 — the morning is the fix window.

## State of the repo when this was written

- 22 local commits ahead of `origin/main`, NOTHING pushed — live is untouched.
- All ten proof rounds (pr0–pr9) built, in their own always-visible "Proofs"
  home card (open to everyone, sequential unlock inside, `MAIN_ROUNDS` = 43).
- Fix round 1 (14 items, `FIX-ROUND-1.md`) + the numbered-angle-names
  follow-up (T2/T3/T4 arcs) + the diagram-label batch are all DONE and
  foreman-verified. All four checkers green at 477 diagrams / 871 angles / 0
  mismatches. Her playtest of pr0–pr4 is mostly happy; pr5 and pr7/pr8 are
  the redesigns below.

## How to run this (foreman pattern, unchanged)

Dispatch ONE Sonnet build session with this file as the brief (delegation
block on top — Megan approved this batch during playtest; quote this file).
Foreman reviews after: all four checkers fresh, browser walk BOTH languages
at 375px, and measure labels for overlap AND distance-to-vertex (the pane
dies on long JS scripts — use short per-panel calls; a headless
`renderDiagram` harness into a fixed 340px div also works and is faster,
see the label-batch commits). Local commits only. No push, no migrations,
no `sw.js`, no shared CSS.

## The items

### 1 · pr4 (T2 transfer, reflex+bowtie): bring its figures up to pr3's visual standard
"These kids are still babies" — the transfer round is where the picture gets
harder, so the training wheels belong THERE too.
- x and y marked at the isosceles twins ∠OAP and ∠OBP (both are exactly 55°
  on this figure — A:160, B:20, P:90; verify via legDir as usual).
- Whole x-family teal `#0ea271`, y-family orange `#f76707` (import the same
  constants pr3 uses — labels x, y, O₁ = 2x, O₂ = 2y, plus the new twins).
- Marker-pen highlights (`hl`) on the triangles like pr3's pages: OPA in
  x-colour, OPB in y-colour, on whichever panels teach each doubling — make
  the pair read like pr3's x-page/y-page pair.

### 2 · Engine: a reflex angle-mark option, then use it
- Additive option on an angle def (suggest `o.reflex: 1`): draw the arc the
  LONG way round between the two legs instead of the ≤180° sweep. Opt-in
  only; nothing existing changes. verify-node: check how it validates `v`
  for such a mark (the reflex value is 360 − short sweep — it must verify
  exactly, not be skipped).
- Use it: pr4 panel 1's claim figure gets a small reflex arc at O so "the
  REFLEX ∠AOB" is visibly THAT angle (her ask, screenshot in the session);
  and pr5's rebuild (item 3) needs O₂ drawn and labelled.

### 3 · pr5 (T3 discovery): rebuild the middle on her ONE-VARIABLE method
Her hand sketch is canon (transcribed): quad on the circle, radii joined to
the two vertices NOT in the angle pair, then:
  1. Mark the first circumference angle **x** (green in her sketch — one
     colour family per angle from here on).
  2. Theorem once: **O₁ = 2x**, labelled arc on the correct piece (pink).
  3. BEFORE any second letter exists, ask: what is **O₂**, the reflex piece?
     → **360° − 2x** (∠s round a point; orange; drawn with the item-2 reflex
     arc, labelled).
  4. Theorem again on O₂: the opposite angle = **(360° − 2x) ÷ 2 = 180° − x**
     (purple).
  5. Combine: x + (180° − x) = 180°. QED — no a-and-c juggling.
Panel order changes accordingly (the current panels 3-5 collapse into this
chain; the predict panel and the why-OB/OD panel stay). Pick the starting
vertex so O₁ = 2x is the NON-reflex piece on the app's quad (on the current
A:160/B:80/C:350/D:240 quad that means starting at ∠C = x; alternatively
re-rotate the quad so her start-at-A reading holds — builder's call, exact
integers, show the derivation). Keep the wrong-radii trap round (pr6) as is
but echo the one-x chain in pr6's wording where it narrates the doubling
(its concrete numbers 60→120→240→120 already ARE the one-x chain).
- Do NOT touch panel 2's un-joined-BD question — she scratched that note
  herself (panel 3's contrast is the point).

### 4 · pr7 + pr8 (T4, tan-chord): rebuild on HER construction — the app joined the wrong points
Her cheat-note pages are canon (also in `C:\Users\megzi\Desktop\Circle Geo
Proofs.pdf`). The app currently joins the diameter's far end to the CHORD's
other endpoint, proves the triangle there, then generalises to P via
same-segment at the end. Her proof:
  1. Construction: draw the diameter from the point of tangency, and join
     its far end to **P — the point in the alternate segment itself**.
  2. Number the pieces at the tangency point (her Â₁/Â₂ style — app letters
     will differ; keep the app's T as tangency): the x sits between diameter
     and chord.
  3. The two right angles: radius ⊥ tangent at the tangency point; angle in
     a semicircle at **P** (the newly joined triangle).
  4. "∠s in the same segment" swaps x across to P's pieces.
  5. Both target angles land as **90° − x** (case A). Case B (tangent's
     other side, pr8) is the same construction landing on **90° + x** —
     her page 3.
- Different colour per angle family throughout (her red/purple/orange pen).
- pr8's TRAP must be re-aligned so "the wrong join" is wrong RELATIVE TO HER
  RECIPE — what the app punishes and what she teaches in class must agree
  exactly. Rework pr8's panels/solution block to her flow with its concrete
  numbers; keep its error-spot + legal-panel shapes.
- The numbered-name conventions from the earlier follow-up (T₁/T₂ etc.)
  carry over, re-derived for the new construction.

## Also open (not this batch, standing items)

- Mini-diagram stacking CSS one-liner — still HER decision (see
  PROJECT-STATUS, fix round 1 section).
- "Proofs"/"Bewyse" card naming — working title, hers to rename.
- Ship = separate explicit step after her yes: plain push, no migration.

## House rules (violations get bounced — full history in PROJECT-STATUS)

All taps, no typed panels · wrong guesses honoured ("Good guess —") · no
spoilers before a discovery lands · bilingual, AF prose "radiusse"/"regte
hoek", no English inside AF strings · neutral learner voice (no "her
notes"/round-ids in copy) · every point an option names is labelled on that
figure · pad distractors, never shorten the correct answer · narrow angles
r:40; watch bisector-points-at-a-vertex collisions · figure labels are
glyphs shared by both languages · public repo — no learner names/marks ·
all four checkers green before reporting; foreman browser-walks both
languages before anything is called done.
