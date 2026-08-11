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

## Items added 2026-08-11 night — foreman dig through her cheat-note PDF

Megan attached her original hand-written proofs ("Geometry proofs — cheat
notes", 9 pages, `C:\Users\megzi\Documents\iLovePDF_Output\3. Circle
Geometry-64-72.pdf`) and asked for the deployed proof rounds to be compared
against it line by line. The T2-standard (pr3) and T4 items above came out
CONFIRMED-correct against her pages. Three new disconnects surfaced; she
ruled on all three the same night (item 5 dropped, 6 and 3-addendum in):

### 5 · DROPPED — her ruling, 2026-08-11 night
The dig found pr2/pr9 teach SSS for T1 variant B where her cheat notes use
SAS ("∠s opp = sides"). Asked; her answer: "The SSS is fine, that's not set
in stone, you can leave that." pr2 and pr9 stay exactly as built — no
session runs this item. (Kept here so the discrepancy isn't re-flagged by a
future audit: it is a KNOWN, ACCEPTED difference between app and notes.)

### 6 · pr4 panel 3 + recap: her BOWTIE is the subtraction case — it's missing
Her page 6 ("© Bowtie") is the third case of T2's proof: circumference
point C placed so the diameter CD falls OUTSIDE ∠ACB. Same five steps, but
the two doubled pieces now OVERLAP instead of adding: AÔD = 2x, BÔD = 2y,
and the target is the DIFFERENCE — ∠AOB = 2y − 2x = 2(y − x), with
∠ACB = y − x. The app's pr4 panel 3 has no subtraction anywhere: it shows
two circumference points sharing an arc and derives "angles in the same
segment" by running the standard proof twice. Nice insight, wrong theorem
case — and the class's word "bowtie" (from her notes) will point at a
picture the app never shows.
- Rebuild panel 3 on HER subtraction case: one circumference point C, its
  diameter CD drawn (item-2 construction), A and B BOTH on the same side of
  line CD so the wedges overlap. Exact-integer figure, derivation shown in
  the header comment; distinct colours for the 2x and 2y wedges so the
  overlap is visible (the x-family/y-family constants from pr3).
- The chain in the panel: AÔD = 2x and BÔD = 2y (ext ∠ of Δ, twice) →
  ∠AOB = BÔD − AÔD = 2y − 2x = 2(y − x) → ∠ACB = y − x → done. Subtract,
  not add — that IS the punchline of this picture.
- KEEP the same-segment insight (pr9 panel copy leans on "established in
  P4"): fold it into a following panel or the recap — "run the five steps
  from any point on that arc and you always land on half the same central
  angle" — AFTER the true bowtie panel. pr4 may grow by one panel.
- Recap gallery's third mini becomes the subtraction picture; caption
  "Bowtie — same steps, subtract" / AF equivalent.
- Item 1's twin-marks work (x/y at ∠OAP/∠OBP on the reflex figure) is
  unaffected and still wanted.

### 3b · pr6: label O₂ and colour the families (her before-bed ask, 2026-08-11)
Her ask: don't trust "done" — check every round for unlabelled O₁/O₂ and for
different angle families sharing a colour. The foreman sweep found pr6 is
exactly that: `FIG_CORRECT` labels O₁ (120°) but O₂ — the reflex 240° piece,
the star of the trap round's own 60→120→240→120 chain — is never drawn or
labelled (the engine couldn't draw reflex arcs until item 2 landed), and the
whole round is monochrome. In the pr5/pr6 session:
- `FIG_CORRECT` (or a purpose-made variant for the chain panels): draw the
  reflex O₂ with the new item-2 mark, labelled, in its own family colour.
- Colour pr6's marked angles to MATCH pr5's rebuilt scheme (same family =
  same colour across the two rounds; different family ≠ same colour).
- Claim/trap figures stay unlabelled where that's deliberate no-spoilers
  design — this item is about the teaching figures, not the bare ones.

### 3-addendum · pr5: her closing line
Her page 7 ends the cyclic-quad proof with the second pair in one line:
B̂ + D̂ = 180° ("int. ∠s of quad" — the four angles sum to 360°, and
Â + Ĉ already spent 180° of it). The rebuilt pr5 chain should end on that
same one-liner after step 5, not leave the second pair unmentioned.

### Transcription warning for builders
Her pages 4-5 contain a pen slip: the second exterior-angle line reads
"BÔD = 2x" where the chain and the final sum make it unambiguously 2y. Do
not copy the slip. (Her page 6 writes the same line correctly as 2y.)

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
