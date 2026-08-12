# Proof rounds — FIX ROUND 3 (her morning playtest of the overnight batch, 2026-08-12)

Megan playtested the FIX-ROUND-2 rebuild on the morning of 2026-08-12 and gave
these twelve items one by one, then "/go" for the batch. She teaches proofs
TODAY — this is the pre-class fix window. Three build sessions (D: pr4,
E: pr5/pr6, F: pr7/pr8), foreman-reviewed between, local commits only.

## Process rules (unchanged from FIX-ROUND-2)

All four checkers green before reporting · headless renderDiagram
overlap/clipping sweep of every changed figure · foreman browser-walks both
languages at 375px before anything is called done · no push, no migrations,
no sw.js, no shared CSS · `git commit -F <tempfile>`.

## Session D — pr4 (items 1–4)

1. **Reflex construction figure: labels drifted.** The x/y base labels at P
   and the isosceles twins at A/B float mid-triangle instead of hugging
   their arcs (her screenshot). Pin them with explicit `r` values, measured.
2. **Bowtie panel → 6-step build**, pr3's earned-step rhythm: ① here is the
   construction → ② the equal radii → ③ in triangle one these two angles
   are both x → ④ here is its exterior angle (2x) → ⑤ in triangle two both
   angles are y → ⑥ its exterior angle (2y). THEN the subtract question
   lands. (The bowtie grows from one slide into a mini-arc.)
3. **Bowtie question goes algebraic.** Her words: "why are we working with
   numerical values?" The options currently read 140°/70°/210°. A proof
   works in variables: ∠AOB = BÔD − AÔD = 2y − 2x = 2(y − x). No concrete
   degree values anywhere in the proof chain — figure marks stay 2x/2y.
4. **Recap gallery's bowtie mini**: drop the coloured highlight clutter
   ("the hundred coloured lines"); plain figure, two algebraic labels like
   the standard mini — ∠ACB = y − x, ∠AOB = 2(y − x) (letter order as the
   main panel so the difference is positive).

## Session E — pr5 + pr6 (items 5–7)

5. **pr5, the O₂ question panel**: O₂'s label moves in against its arc (ON
   the arc like O₁'s is fine). And the panel AFTER the kids choose
   "O₁ = 2x" must show it: the diagram's O₁ label becomes "O₁ = 2x", not
   bare O₁.
6. **pr5, TWO colour families instead of four** (her ruling, replaces the
   sketch-derived 4-colour scheme): ∠C's x and O₁ (= 2x) share ONE colour
   — the doubling pair; O₂ (= 360° − 2x) and ∠A (= 180° − x) share the
   OTHER — the derived pair. Value labels ON the sketch as they are earned
   (O₁ = 2x, O₂ = 360° − 2x, ∠A = 180° − x). Remove the equal tick marks
   on the radii — not needed in this proof.
7. **pr6: labels drifted** — O₂ and the 60° both sit far from their arcs
   (r:70 overshot). Pull both in tight; on-arc is fine. Colours stay
   ("the colours make it readable") but re-pair to follow item 6: 60°/O₁
   one family, O₂/∠R the other — pr6 mirrors pr5 by standing rule.

## Session F — pr7 + pr8 (items 8–12)

8. **pr7: T₁ = 90−x label at T** moves a bit down, onto its own arc.
9. **pr7: the transferred x at P** (∠DPA mark) drifted up toward D — pin it
   at P beside its arc.
10. **pr8: pure algebra.** The correct-join panel currently reads
    T₁ = 120°, 30°, etc. Everything in variables: T₁, 90° at T, T₂ =
    T₁ − 90° → x-role, 90° at P, same-segment carry, targets as 90° + x.
    No numeric degree values in the chain.
11. **pr8: split the chain.** That panel jumps to the final step in one go;
    break it into one-step-per-slide (construction → first 90° → the piece
    between diameter and chord → second 90° → same-segment carry →
    combine), same treatment as the bowtie split.
12. **pr8: the trap rebuilt on her misconception pages** (canon:
    `C:\Users\megzi\Desktop\Tan-chord Proof Misconception.pdf`, 4 pages,
    transcribed below). Her rule, verbatim (pink cloud): **"You must join
    the point that you are trying to prove!"**
    - The correct join is diameter's far end → THE POINT HOSTING THE ANGLE
      BEING PROVEN (for pr8's claim: D → P).
    - The TRAP is joining the OTHER circumference point (D → B) — the real
      classroom habit-mistake. The invented point Q and the "joined B to Q"
      strawman GO AWAY entirely (drop Q from the figure).
    - Her pages teach it as a PAIRED exercise on ONE figure: two targets,
      and the correct/mistake joins SWAP. Page 1: prove tangent-chord
      angle = Ê → join E's line (mistake: join the other point D). Page 2,
      same figure: prove the other tangent-chord angle = D̂ → join PD
      (mistake: join EP). Pages 3–4 repeat the pair on a second figure
      (tangency S, diameter SPQ: prove R-Ŝ-U = V̂ → join QV, mistake QU;
      prove V-Ŝ-T = Û → join QU, mistake QV). If pr8's panel count
      allows, use this paired shape — target swaps, join swaps — and close
      on her takeaway line (translate it normally in AF; it is not the
      assume-pun catchphrase).

## Also open (unchanged)

Mini-diagram stacking CSS one-liner (her call) · "Proofs"/"Bewyse" card
name (hers) · ship = her explicit yes after this batch.
