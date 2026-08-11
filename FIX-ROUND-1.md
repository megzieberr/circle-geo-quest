# Proof rounds — fix round 1 (Megan's playtest, 2026-08-11 afternoon)

Fourteen adjustments from her first playtest of pr0–pr9, to be implemented in ONE
build session and foreman-reviewed after. This file is also the hand-off record:
if the session dies, everything needed to resume is here.

**Ground rules for this fix session (unchanged from the build run):** local
commits only — NO push, NO migrations, NO edge functions, NO `sw.js`. All four
checkers green before reporting (`tools/verify-node.mjs` 0 mismatches,
`audit-options`, `check-bilingual`, `check-table-summary`). Bilingual EN/AF
throughout; AF prose "radiusse" never "radii"; "regte hoek" never "reguit hoek";
neutral learner voice (no internal ids, no "her notes"). The foreman does the
browser walk afterwards — build session runs checkers only.

**Engine additions ARE authorized this round, narrowly:** (a) an optional colour
on an angle mark's label+arc, (b) an optional highlight style on chords and
angle wedges (translucent thick stroke UNDER the normal line, like a green
marker pen). Additive only — nothing about existing figures may render
differently unless a figure opts in.

## The adjustments

1. **Proof rounds become their own grouped entry, like the Grand Master Arena
   "Adventures" card — they come OFF the main quest map.**
   - Study how the Adventures arena card + screen and the (hidden) Investigation
     Station line are implemented (home cards in `js/game.js`, routes in
     `js/app.js`) and follow the same pattern.
   - Home screen gets a Proofs card, visible and openable by EVERYONE from the
     start (her explicit ruling — the class starts proofs in class tomorrow,
     independent of map progress). Working title "Proofs" / "Bewyse" with a
     one-line blurb about learning the constructions behind the theorems —
     flag the naming for her in the report.
   - Inside: the ten rounds listed in order, sequential unlock WITHIN the group
     (pr0 open first; passing a round unlocks the next). Progress persists via
     the normal submit path the rounds already use.
   - `MAIN_ROUNDS` returns to 43 (proof rounds leave the main ORDER); the home
     counter reads N/43 again. `FINAL_QUEST_ROUND_ID = "r21"` stays pinned
     regardless (belt and braces). Group `g7` stays OFF the badge ladder.
   - `?preview=1` (Teacher Preview) must see and open the card with everything
     unlocked, same as it does the rest of the app.

2. **All four discovery probes reworded** (pr1, pr3, pr5, pr7 panel 1): the
   question becomes exactly *"What other geometry theorem do you THINK can
   prove that this claim is ALWAYS true?"* / AF: *"Watter ander
   meetkundestelling dink jy kan bewys dat hierdie bewering ALTYD waar is?"*
   (Keep each round's picture-description sentences before it.)

3. **pr2 (T1 transfer), variants B/C figure (`FIG_PQ_MID`):** draw the segment
   O–N, plain — NO right-angle mark (the perpendicularity is what's being
   proven). The prompt talks about ON; it must be on the picture. Then sweep
   ALL ten rounds for the same disease: any line a prompt names that isn't
   drawn on that panel's figure — list what you find and fix the figures.

4. **pr3 (T2 discovery): x and y in two different colours** (label + arc), via
   the new engine colour option. Pick two colours readable on the cream
   background and distinct from the accent purple.

5. **pr3: move A and B higher on the circle so the base angles at P are bigger
   and readable.** Suggested exact geometry (verify against the engine's own
   legDir before adopting): A:190, B:340, P:90, Q:270 → apex ∠AOP = 100 so
   x = 40; apex ∠BOP = 110 so y = 35; O₁ = 80 = 2x, O₂ = 70 = 2y,
   ∠AOB = 150 = 2(x+y), ∠APB = 75. x ≠ y is DELIBERATE (two visibly different
   angles teach "x and y are separate things"). Every derived mark must be an
   exact integer; show the derivation in the header comment.

6. **pr3: NEW page inserted before the exterior-angle page** — the learner
   earns the isosceles step: "OP = OA (both radii). Which OTHER angle must
   also equal x?" (correct: ∠OAP — reason: ∠s opp equal sides / the existing
   REASONS code the app uses for that fact). The y twin (OP = OB ⇒ ∠OBP = y)
   goes in the same page's answer note ("the exact same reasoning at B gives
   y") unless a second mirrored page genuinely plays better — your call,
   state which you chose. Numbered naming per item 10 applies here too.

7. **pr3, the 2x/exterior-angle page: highlight triangle OPA + its exterior
   wedge in x's colour** — all three sides (PO, PA, OA) get the marker-pen
   highlight, plus the exterior-angle wedge at O (between OA and OQ). The
   point: "the triangle" and "its exterior angle" are literally the
   highlighted things, so 2x is seen, not parsed.

8. **pr3: the same highlight treatment for triangle OPB + its wedge** (in y's
   colour) wherever 2y is introduced — make the x page and y page read as a
   visual pair given how the pages land after item 6.

9. **pr3 combine page: the 2x label drifted off its arc at O** — pin it back
   (label-radius `r`, same cure as the earlier review fixes). Foreman will
   re-measure; set a reasoned value.

10. **pr3, T2-arc wording: numbered angle names.** The base angles at P are
    P₁ and P₂ (= x, = y); the two pieces at O are O₁ and O₂ (= 2x, = 2y).
    Rewrite pr3's prompts/hints/notes to use these instead of ∠AOQ / ∠OPA
    soup; figure labels agree with the text (Unicode subscripts ₁ ₂ render
    fine in SVG). ∠AOB / ∠APB may stay for the whole angles. Scope: the T2
    arc ONLY (pr3 + pr4) — do NOT rename the T3/T4 arcs this round; flag in
    the report that she may want the same convention there after playtesting.

11. **pr3: remove chord A–B from every T2 discovery figure** — the proof never
    uses it, and it fights the new highlights.

12. **pr3: remove the tick on OQ** — the proof leans on OP = OA and OP = OB
    only. OQ stays drawn (rest of the diameter), unticked.

13. **pr4 (T2 transfer), reflex construction figure: x and y labels at P
    drifted far from their arcs** — pin them (label `r`). ALSO: this drift
    class escaped the earlier overlap-only review, so the foreman will
    re-measure EVERY proof figure for label-to-vertex distance after your
    commit; set reasoned `r` values anywhere a label plainly sits far from
    its vertex rather than waiting to be caught.

14. **pr4 wording: numbered angle naming here too** (the combine prompt
    currently reads "∠AOQ = 2x = 110°, ∠BOQ = 2y = 110°" — becomes O₁/O₂
    form, matching item 10).

## Verify & commit

All four checkers green (verify-node baseline before this round: 476 diagrams /
867 angles / 0 mismatches — figure edits will legitimately CHANGE the counts;
what must hold is 0 mismatches). `node -e` check that MAIN_ROUNDS is 43 again
and the proofs group still lists ten rounds in order. One commit, `git commit
-F <tempfile>`, LOCAL ONLY.

Report back: what changed per item, the item-3 sweep findings, any judgment
calls (item 6 page shape, card naming, colours chosen), exact checker output,
commit hash.
