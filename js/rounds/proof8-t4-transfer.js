/* Proof rounds P8 — "T4 transfer: the wrong-join trap"
   (PROOF-ROUNDS-PLAN.md, session 5 — the T4 arc.)
   ------------------------------------------------------------------------
   REBUILT 2026-08-11/12 night (FIX-ROUND-2.md item 4 — overnight foreman
   build session C, same rebuild as proof7-t4-discovery.js): pr7 builds ONE
   construction — draw the diameter from the point of tangency T (call its
   far end D), then join D STRAIGHT TO P, the actual point in the alternate
   segment the claim is about — and chases two free right angles (tan ⊥
   diameter at T, angle in a semicircle at P itself) to a same-segment swap
   that lands both the tangent-chord angle and ∠TPA on 90° − x. This round
   carries THAT exact construction to the OTHER side of the chord — the
   tangent-chord angle measured with the OTHER tangent ray, landing on the
   OTHER arc — where the two 90°s combine differently: ADDING instead of
   splitting, so both targets land on 90° + x.

   REBUILT AGAIN 2026-08-12 (FIX-ROUND-3.md, Session F, items 10-12 — her
   morning playtest, pre-class fix window):
     · item 10 — PURE ALGEBRA. The correct-join chain used to GIVE T₁ as a
       concrete "120°" and derive T₂ = 120−90 = 30° by subtraction. That is
       backwards from how pr7 teaches the same construction (there, x is
       MARKED directly and T₁ is what gets solved for) and it put two bare
       numbers in the panel prose, which is exactly what her playtest
       flagged ("why are we working with numerical values?", the same
       objection FIX-ROUND-3 item 3 raised against pr4's bowtie). Flipped to
       match pr7's own direction: x = T₂ (the piece between the diameter and
       the chord) is MARKED on the figure from the start, the same as pr7's
       own x; T₁ is then DERIVED as 90° + x (adding, not subtracting, because
       the diameter sits between the tangent ray and the chord this time —
       see the geometry note below). No prompt, option, hint or note in the
       chain panels (construction → error-spot → legal → recap) carries a
       concrete degree value anywhere — only T₁, T₂/x, 90°, and 90°+x. The
       structural 90°s (tan ⊥ diameter, ∠ in semi ⊙) stay, per the brief's
       own carve-out — those are fixed facts of the theorems being used, not
       measured results.
     · item 11 — SPLIT THE CHAIN. The old "correct construction, compressed
       to one panel" jumped straight from "D joined to P" to the fully
       combined 90°+x=T₁ result in one slide. Rebuilt as SIX one-step-per-
       slide panels, pr4's own bowtie-build rhythm (commit be06e20): ① the
       construction (D joined to P, undoing the classmate's mistake) → ② the
       90° at T and where the diameter now sits (a genuine question this
       time — the arrangement is the MIRROR of pr7's own, and the round
       can't assume that transfers on its own) → ③ x marked and T₁ derived
       (90°+x) → ④ the free 90° at P (a NOTE, not a new question — pr7
       already taught the mechanism in full, so this panel restates it and
       explicitly ties it back to the trap panel's own rule) → ⑤ the same-
       segment carry to ∠DPB → ⑥ combine to ∠TPB = 90°+x = T₁. Four choice
       panels (②③⑤⑥, each with a real question) and two notes (①④, nothing
       new to ask — construction and restatement respectively), matching
       the brief's "choice where there's a real question, note where there
       isn't, never filler" instruction. XP is still panels.length × the
       station rate, so the round simply pays more now (six panels instead
       of one, all genuine content, none of it filler).
     · item 12 — THE TRAP REBUILT on her own misconception pages (canon:
       `C:\Users\megzi\Desktop\Tan-chord Proof Misconception.pdf`, her rule,
       verbatim, pink cloud: "You must join the point that you are trying
       to prove!"). The PREVIOUS trap invented a point Q and had a classmate
       join "B to Q" — a strawman with no real geometric content (BQ is
       just an arbitrary chord that touches nothing useful). That is not
       her trap. Her trap, translated into this round's own letters: the
       correct join is D → P (the point HOSTING the angle being proven,
       ∠TPB). The real classroom mistake is joining D → B instead — the
       chord's OTHER circumference point, a point that is already ON THE
       PICTURE (nothing invented) and produces a GENUINE right angle of its
       own (∠TBD = 90°, angle in a semicircle, since TD is still a diameter
       and B is still on the circle) — it is legal AND it looks like
       progress, which is exactly what makes it a real trap rather than a
       strawman. It just never reaches P, so it never reaches ∠TPB. Q is
       gone from the figure entirely; nothing this round needs it.
       The PAIRED-exercise shape her pages use (one figure, two targets,
       correct/mistake joins swapping between them) was considered for a
       closing panel here (item 12's "if it fits" clause) but SKIPPED — a
       genuine judgment call, not an oversight: the natural "other target"
       for this figure would be an angle hosted at B rather than P, and
       nailing which angle that legitimately is (with its own engine-
       verified algebra chain) is a second construction's worth of new
       content, not a single extra question. Given the chain already grew
       from six panels to eleven this session (item 11), adding a half-
       verified second theorem risked exactly the kind of rushed, unchecked
       content this codebase's house rules exist to prevent. The trap's own
       rule — stated where it's sprung (panel 2) and closed on her verbatim
       line (panel 11, the recap) — carries the lesson without it.

   ELEVEN PANELS (was six), same renderInvestigate() as pr0-pr7 — no new
   panel type, no typed answers:
     1  · choice — new picture, the tangent-chord angle measured on the
         OTHER side this time, P also marked (both unlabelled). "What's the
         first move — the one construction that survives every version of
         this proof?" (correct: draw the diameter from T; its note now
         forward-references the TRAP rather than promising the D–P join is
         "next panel's job" — the next panel is the classmate's mistake.)
     2  · choice — THE TRAP (item 12, rebuilt): the diameter is down
         (correct, 90° marked at T), but a classmate joined D to B — the
         chord's OTHER circumference point — instead of D straight to P.
         That join is legal AND genuinely produces ∠TBD = 90° (marked, angle
         in a semicircle) — but does it reach ∠TPB, the angle actually being
         proven? No — named, not just asserted, and her rule stated in the
         note: "You must join the point that you are trying to prove."
     3  · note   — step ①: the correct join, undoing the classmate's
         mistake — D joined STRAIGHT to P, closing triangle TDP.
     4  · choice — step ②: the 90° at T (tan ⊥ diameter, marked) and where
         the diameter now sits relative to the tangent and the chord — the
         mirror of pr7's own arrangement, a genuine question about reading
         the picture (correct: the diameter sits BETWEEN the tangent ray
         and the chord this time).
     5  · choice — step ③: x = T₂ (the piece between the diameter and the
         chord) marked; what does that hand you for T₁? (T₁ = 90° + x —
         adjacent pieces ADD, the mirror of pr7's subtraction.)
     6  · note   — step ④: the free 90° at P (angle in a semicircle, needs
         the D–P join) — restated, not re-derived (pr7 already earned the
         mechanism in full), and explicitly tied back to panel 2's trap:
         THIS is why the correct join mattered.
     7  · choice — step ⑤: "angles in the same segment" carries T₂ (= x)
         across to ∠DPB, the piece of the free 90° at P next to D.
     8  · choice — step ⑥: combine — ∠TPB = ∠TPD + ∠DPB = 90° + x, exactly
         T₁. QED, algebra only, on the actual P and B from panel 1.
     9  · choice — error-spotting (invest04-prove-it.js's DNA, pr2/pr4/pr6/
         pr8's-own-previous-panel-4 shape, unchanged): a learner's solution
         reaches the right conclusion with ONE line's reason mismatched —
         the semicircle 90° at P credited to "tan ⊥ diameter" instead of
         "∠s in semi-circle". Rewritten algebra-only (item 10): the old
         "T₂ = 120°−90°=30°" line is gone, replaced by the same MARK-x-
         DERIVE-T₁ order the chain above now uses. `solution.lines[].st` is
         symbol-only throughout, as before.
     10 · choice — the legal-constructions thread, continued from pr2/pr4/
         pr6 (unchanged by this rebuild — it never referenced Q or a
         concrete degree value in the first place). Carries the
         catchphrase, VERBATIM ENGLISH in both language versions, same
         single use as before (pr7 has no legal panel).
     11 · note   — recap: same construction, the other side of the chord,
         the trap named — this time landing on 90° + x instead of 90° − x,
         algebra only throughout. Closes on her verbatim rule ("you must
         join the point that you are trying to prove"), translated normally
         into Afrikaans (NOT the assume-pun catchphrase — that one belongs
         to panel 10 only). Last panel of the round.

   NUMBERED-ANGLE CONVENTION (unchanged from pr7's own rebuild): T₁ = the
   tangent-chord angle at T, T₂ = x, the piece between the diameter and the
   chord — both at the crowded vertex T. At P, ∠DPB (the transferred piece)
   and ∠TPB (the theorem's own target — the angle the whole construction is
   anchored to, not a stand-in reached through D) are both named in full
   wherever they appear, same judgment call as pr7's own header. ∠STD stays
   literal throughout — S is the ray name the "tan ⊥ diameter" reason
   genuinely needs, and the error-spot panel is the one panel where the
   whole point is telling the two 90°s apart by WHERE they sit, so
   collapsing either into a shared alias would erase the exact distinction
   being tested. ∠TBD (the trap's own real-but-useless right angle, panel 2
   only) is named in full too, and deliberately carries NO family colour —
   see below.

   DIFFERENT COLOUR PER ANGLE FAMILY throughout, SAME hexes as pr7's own
   rebuild (her explicit ask, session C — the two rounds must read as one
   continuous story):
     GREEN  #0ea271  — the x-family: T₂, and its transferred twin ∠DPB.
     PINK   #e64980  — the 90°-family: the free right angle at T (tan ⊥
                        diameter) AND the free right angle at P (angle in
                        a semicircle) — the two right angles that ARE part
                        of the real proof chain.
     PURPLE #9c36b5  — the target family: T₁ (the tangent-chord angle) and
                        ∠TPB (the angle in the alternate segment) — same
                        hex as this round's own accent (AC), no clash, per
                        pr7's own judgment call.
   ∠TBD (panel 2's trap angle) is deliberately left UNCOLOURED (plain ink):
   it is real, but it is not part of the proof chain those three families
   trace — giving it a family colour would visually claim it belongs to the
   chain it's supposed to be a trap AWAY from.
   Same family = same colour on label AND arc throughout. Every numbered
   angle is labelled on the diagram the moment its value is known.

   GEOMETRY — the OTHER side of the same tangent, with a genuine FOURTH
   point (P, the actual point in the alternate segment) matching pr7's
   construction letter-for-letter. T:270 and D:90 are UNCHANGED — T is
   always the point of tangency and D is always its antipode, the far end
   of whichever diameter is drawn from it. B:30 puts the chord's direction
   from T PAST the diameter's own direction — the diameter sits BETWEEN the
   tangent and the chord, so T₁ = 90° + T₂ directly, no subtraction —
   genuinely the other configuration from pr7's, verified node-side, not
   assumed. P:330 sits on the SAME side of chord TB as B (the short arc
   T→B that does NOT contain D), which is what makes ∠TPB come out EQUAL to
   T₁ (not its supplement); its own midpoint of that 120° arc, 60° clear of
   both T and B, engine-verified after an earlier draft (P:350) crowded the
   labels near B.
   Q is GONE (item 12) — the previous trap's invented decoy point served no
   purpose once the trap became D→B, a join between two points already on
   the figure.

   Every angle mark is an EXACT integer, engine-verified (node,
   verifyDiagram() against the SAME leg definitions written into the
   figures below — not hand-arithmetic alone):
     tg− direction at T = 270 − 90 = 180°
     ∠(tg−, D) = 90°     (tan ⊥ diameter, exact, always)
     T₂ = ∠DTB = (90 − 30) / 2 = 30°    (inscribed angle at T, standing on
       arc D→B not containing T — the classic half-arc identity, exact for
       any circle, the same fact pr7's own T₂ leans on) — this is the x
       marked directly on the figure, mirroring pr7's own order (mark x,
       then derive T₁), not the reverse.
     T₁ = ∠(tg−, B) = 90° + T₂ = 90° + 30° = 120°   (D sits BETWEEN the
       tangent ray and the chord this time, engine-verified: 120.0°, not a
       rounded estimate — this is the "two 90°s sit differently" case)
     ∠TPD = 90°   (angle in a semicircle, exact, always — TD is a diameter,
       P is on the circle — engine-verified: 90.0°)
     T and P both lie on the SAME arc relative to chord DB — engine-
       verified by direct construction: ∠DPB = 30° = T₂ exactly, for every
       P swept across the whole valid arc, not just the one chosen ("angles
       in the same segment")
     ∠TPB = ∠TPD + ∠DPB = 90° + 30° = 120°   (engine-verified: 120.0°) —
       EXACTLY T₁, this time by ADDING the transferred piece onto the free
       90° instead of subtracting it out of it, because D sits BETWEEN rays
       PT and PB at this P, not the chord between them.
     ∠TBD = 90°   (panel 2's trap angle — angle in a semicircle again, this
       time at B: TD is still a diameter, B is still on the circle, so this
       is just as real and just as automatic as ∠TPD above — engine-
       verified: 90.0°. It is real; it is simply anchored to the wrong
       point for THIS target, which is the whole teachable point of the
       trap.)                                                              */

const AC = "#9c36b5";
const GREEN = "#0ea271";    // T₂ / x, and its transferred twin ∠DPB — same value as pr7's own GREEN
const PINK = "#e64980";     // the two free right angles (T, then P) — same value as pr7's own PINK
const PURPLE = "#9c36b5";   // T₁ and ∠TPB — the two target angles (= AC), same value as pr7's own PURPLE

/* chords shared by every panel from the correct construction onward
   (panel 3 on): the original claim's T-B/P-T/P-B, plus the diameter TD
   (down since panel 1), plus D-P (the correct join, panel 3 on). */
const CHORDS_CORRECT = [["T", "B"], ["P", "T"], ["P", "B"], ["T", "D"], ["D", "P"]];

/* ---- panel 1: bare tan-chord figure, before any construction. The
   tangent-chord angle AND ∠TPB both marked but UNLABELLED — nothing
   spoiled, same shape as pr7's own panel 1. ---- */
const FIG_CLAIM = {
  O: true,
  pts: { T: 270, B: 30, P: 330 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: [["T", "B"], ["P", "T"], ["P", "B"]],
  angles: [
    { at: "T", legs: ["tg-", "B"], t: "", o: { v: 120 } },
    { at: "P", legs: ["T", "B"], t: "", o: { v: 120 } },
  ],
};

/* ---- panel 10: the legal-constructions panel — D is LABELLED (it
   exists, T's exact antipode, so the options can legally talk about it)
   but no line runs to it yet. Untouched by this rebuild — it never
   referenced Q or a concrete degree value. ---- */
const FIG_LEGAL = {
  O: true,
  pts: { T: 270, D: 90, B: 30 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: [["T", "B"]],
};

/* ---- panel 2: THE TRAP (item 12, rebuilt) — TD correctly down (90°
   marked), but D joined to B (the chord's OTHER circumference point)
   instead of D joined straight to P. That join genuinely produces
   ∠TBD = 90° (angle in a semicircle again — marked, deliberately
   UNCOLOURED, see the header) — real, legal, and still the wrong point.

   FIXED 2026-08-12 (her playtest, immediately): this figure used to drop
   chords PT and PB — it drew only TB, TD and DB, leaving P as a bare
   labelled dot with no lines attached. That was wrong twice over. It made
   the picture LOSE information going from panel 1 to panel 2, which reads
   as the app quietly rubbing out part of her question; and it undercut the
   panel's own point, because "does this join get any closer to ∠TPB?" only
   lands if ∠TPB is still visibly there to fail to be reached. PT and PB
   are part of the CLAIM, not part of anyone's construction — nothing a
   classmate does can remove them. They now stay, and ∠TPB stays marked
   (unlabelled, exactly as panel 1 has it) so the learner can see the
   target sitting untouched while the classmate's right angle lands
   somewhere else entirely. Q is gone (item 12). ---- */
const FIG_TRAP = {
  O: true,
  pts: { T: 270, D: 90, B: 30, P: 330 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: [["T", "B"], ["P", "T"], ["P", "B"], ["T", "D"], ["D", "B"]],
  angles: [
    { at: "T", legs: ["tg-", "D"], t: "", o: { v: 90, mark: 1, c: PINK } },
    { at: "B", legs: ["T", "D"], t: "", o: { v: 90, mark: 1 } },
    /* uncoloured, exactly as panel 1 draws it — this panel is still before
       any construction, so nothing here should look more "solved" than it
       did one panel ago. */
    { at: "P", legs: ["T", "B"], t: "", o: { v: 120 } },
  ],
};

/* ---- panel 3: step ① — the correct join, undoing the classmate's
   mistake. D joined STRAIGHT to P (highlighted PINK, the same colour its
   own free right angle will carry), closing triangle TDP. ---- */
const FIG_STEP_JOIN = {
  O: true,
  pts: { T: 270, D: 90, B: 30, P: 330 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: [["T", "B"], ["P", "T"], ["P", "B"], ["T", "D"], { a: "D", b: "P", hl: PINK }],
};

/* ---- panel 4: step ② — the 90° at T marked, and the FULL angle T₁
   (tangent ray to B) outlined unlabelled, so the picture itself shows
   whether D's ray sits inside it. ---- */
const FIG_STEP_T90 = {
  O: true,
  pts: { T: 270, D: 90, B: 30, P: 330 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: CHORDS_CORRECT,
  angles: [
    { at: "T", legs: ["tg-", "D"], t: "", o: { v: 90, mark: 1, c: PINK } },
    { at: "T", legs: ["tg-", "B"], t: "", o: { v: 120 } },
  ],
};

/* ---- panel 5: step ③ — x = T₂ marked (the piece between the diameter
   and the chord); T₁ stays UNLABELLED here — this panel is what resolves
   it, so the figure doesn't give the answer away before the question.
   r:20 (x) / r:46 (T₁, once resolved on panel 6 on) headless-probed and
   browser-pane-rendered: both labels sit clear of the tangent line, the
   90°-mark tick and each other (FIX-ROUND-3.md item 11's own aim, ~55
   units from vertex, no pairwise overlap). ---- */
const FIG_LABEL_X = {
  O: true,
  pts: { T: 270, D: 90, B: 30, P: 330 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: CHORDS_CORRECT,
  angles: [
    { at: "T", legs: ["tg-", "D"], t: "", o: { v: 90, mark: 1, c: PINK } },
    { at: "T", legs: ["D", "B"], t: "x", o: { v: 30, r: 32, c: GREEN } },
    { at: "T", legs: ["tg-", "B"], t: "", o: { v: 120 } },
  ],
};

/* ---- panel 6: step ④ — T₁ now resolved and labelled ("T₁ = 90+x"); the
   free 90° at P (angle in a semicircle) appears, marked but unlabelled —
   this panel only RESTATES why it's there (pr7 already earned the
   mechanism), so nothing here is being asked yet. ---- */
const FIG_SEMI = {
  O: true,
  pts: { T: 270, D: 90, B: 30, P: 330 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: CHORDS_CORRECT,
  angles: [
    { at: "T", legs: ["tg-", "D"], t: "", o: { v: 90, mark: 1, c: PINK } },
    { at: "T", legs: ["D", "B"], t: "x", o: { v: 30, r: 32, c: GREEN } },
    { at: "T", legs: ["tg-", "B"], t: "90+x", o: { v: 120, r: 42, c: PURPLE } },
    { at: "P", legs: ["T", "D"], t: "", o: { v: 90, mark: 1, c: PINK } },
  ],
};

/* ---- panel 7: step ⑤ — ∠DPB now marked too (unlabelled — this IS the
   panel asking for its value, same convention as pr7's own FIG_SEMI). ---- */
const FIG_SAME_SEG_ASK = {
  O: true,
  pts: { T: 270, D: 90, B: 30, P: 330 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: CHORDS_CORRECT,
  angles: [
    { at: "T", legs: ["tg-", "D"], t: "", o: { v: 90, mark: 1, c: PINK } },
    { at: "T", legs: ["D", "B"], t: "x", o: { v: 30, r: 32, c: GREEN } },
    { at: "T", legs: ["tg-", "B"], t: "90+x", o: { v: 120, r: 42, c: PURPLE } },
    { at: "P", legs: ["T", "D"], t: "", o: { v: 90, mark: 1, c: PINK } },
    { at: "P", legs: ["D", "B"], t: "", o: { v: 30 } },
  ],
};

/* ---- panel 8 (the combine QUESTION): identical to FIG_FINAL below except
   ∠TPB is marked but UNLABELLED. Her playtest, 2026-08-12: "the 90+x
   should not be visible on the sketch yet bc we are only asking now."
   Exactly the same fault pr7's own combine panel had — the asking panel
   had been handed the finished recap figure, so it printed its own answer
   ("∠TPB = 90° + x, exactly the same as T₁" is one of the four options).
   Every other asking panel in this round already leaves its target blank
   (panel 5 leaves T₁ blank, panel 7 leaves ∠DPB blank); this brings panel
   8 into line. FIG_FINAL now appears only on panels 9 and 11, both of
   which come AFTER the answer is known. ---- */
const FIG_COMBINE_ASK = {
  O: true,
  pts: { T: 270, D: 90, B: 30, P: 330 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: CHORDS_CORRECT,
  angles: [
    { at: "T", legs: ["tg-", "D"], t: "", o: { v: 90, mark: 1, c: PINK } },
    { at: "T", legs: ["D", "B"], t: "x", o: { v: 30, r: 32, c: GREEN } },
    { at: "T", legs: ["tg-", "B"], t: "90+x", o: { v: 120, r: 42, c: PURPLE } },
    { at: "P", legs: ["T", "D"], t: "", o: { v: 90, mark: 1, c: PINK } },
    { at: "P", legs: ["D", "B"], t: "x", o: { v: 30, r: 34, c: GREEN } },
    { at: "P", legs: ["T", "B"], t: "", o: { v: 120 } },
  ],
};

/* ---- panels 9 (error-spot) and 11 (recap): everything resolved — ∠DPB
   labelled x too (the same-segment transfer), ∠TPB labelled with the
   matching result. Panel 8 used to use this figure as well; it no longer
   does (see FIG_COMBINE_ASK above).
   LABEL RADII, her playtest 2026-08-12 ("the label x needs to shift a bit
   upwards" on the T side, "the other label x also needs to shift a bit up"
   at P): x at T 20 → 32, x at P 22 → 34. Moving them up ran them straight
   into the then-wide "T₁ = 90+x" label, so that moved too, 46 → 54 —
   measured in the browser across a grid of twelve combinations.
   Then her last item of the day removed the "T₁ = " prefix from the wedge
   (see pr7's own note — the diagram states values, the prose names
   angles), which shrank that label from nine characters to four and made
   the crowding vanish: re-measured, every radius from 34 to 54 clears, so
   it settles at 42, near its own arc. ---- */
const FIG_FINAL = {
  O: true,
  pts: { T: 270, D: 90, B: 30, P: 330 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: CHORDS_CORRECT,
  angles: [
    { at: "T", legs: ["tg-", "D"], t: "", o: { v: 90, mark: 1, c: PINK } },
    { at: "T", legs: ["D", "B"], t: "x", o: { v: 30, r: 32, c: GREEN } },
    { at: "T", legs: ["tg-", "B"], t: "90+x", o: { v: 120, r: 42, c: PURPLE } },
    { at: "P", legs: ["T", "D"], t: "", o: { v: 90, mark: 1, c: PINK } },
    { at: "P", legs: ["D", "B"], t: "x", o: { v: 30, r: 34, c: GREEN } },
    { at: "P", legs: ["T", "B"], t: "90+x", o: { v: 120, r: 48, c: PURPLE } },
  ],
};

const SOL_CAP = { en: "A learner's solution", af: "'n Leerder se oplossing" };

export const round = {
  id: "pr8", n: 0, accent: AC, kind: "proof", group: "g7",
  title: { en: "T4 transfer: the wrong-join trap", af: "T4-oordrag: die strik van die verkeerde verbinding" },
  blurb: {
    en: "Same construction, the other side of the chord — and the trap of joining the wrong point once the diameter is down.",
    af: "Dieselfde konstruksie, die ander kant van die koord — en die strik om die verkeerde punt te verbind sodra die middellyn af is.",
  },
  panels: [

    /* ---------- 1 · new picture, other side of the chord — the first move ---------- */
    {
      type: "choice",
      prompt: {
        en: "A new picture: STU is a tangent at T, and TB is a chord — but this time the tangent-chord angle is measured on the OTHER side of the chord (marked). P is a point in the alternate segment, and ∠TPB is marked too (also no number yet). What is the first move — the one construction that survives every version of this proof?",
        af: "'n Nuwe prentjie: STU is 'n raaklyn by T, en TB is 'n koord — maar hierdie keer word die raaklyn–koord-hoek aan die ANDER kant van die koord gemeet (gemerk). P is 'n punt in die oorstaande segment, en ∠TPB is ook gemerk (ook nog geen getal nie). Wat is die eerste stap — die een konstruksie wat elke weergawe van hierdie bewys oorleef?",
      },
      diagram: FIG_CLAIM,
      options: [
        { text: { en: "Draw the diameter from T, the point of tangency", af: "Trek die middellyn vanaf T, die raakpunt" }, correct: true },
        { text: { en: "Join OB instead, and work inside triangle OTB", af: "Verbind eerder OB, en werk binne driehoek OTB" } },
        { text: { en: "Draw a second tangent to the circle at B", af: "Trek 'n tweede raaklyn aan die sirkel by B" } },
        { text: { en: "Measure the tangent-chord angle with a protractor and stop there", af: "Meet die raaklyn–koord-hoek met 'n gradeboog en stop daar" } },
      ],
      hints: [
        { en: "Look back at the last round — which single line brought TWO free right angles into the picture at once, both anchored to points already on the picture?",
          af: "Kyk terug na die vorige rondte — watter enkele lyn het TWEE verniet-regte-hoeke gelyktydig in die prentjie gebring, altwee geanker aan punte reeds op die prentjie?" },
        { en: "The diameter from the point of tangency. Same tool, the other side of the chord: draw TD. Its far end still needs joining to the right point — but a classmate is about to get that part wrong, next panel.",
          af: "Die middellyn vanaf die raakpunt. Dieselfde hulpmiddel, die ander kant van die koord: trek TD. Die verste punt daarvan moet nog aan die regte punt verbind word — maar 'n klasmaat gaan dit, volgende paneel, verkeerd kry." },
      ],
      reason: "construction",
      note: {
        en: "Same tool as the last round, whichever side of the chord the angle sits on: draw the diameter from T. It still hands you a free right angle at T (tan ⊥ diameter). Its far end still needs joining to the right point — but first, here's a classmate's attempt that joins it to the WRONG one.",
        af: "Dieselfde hulpmiddel as die vorige rondte, ongeag aan watter kant van die koord die hoek sit: trek die middellyn vanaf T. Dit gee jou steeds 'n verniet regte hoek by T (raaklyn ⊥ middellyn). Die verste punt daarvan moet nog aan die regte punt verbind word — maar eers, hier's 'n klasmaat se poging wat dit aan die VERKEERDE een verbind.",
      },
    },

    /* ---------- 2 · THE TRAP — D joined to B instead of to P ---------- */
    {
      type: "choice",
      prompt: {
        en: "A classmate got the first step right: the diameter TD is down, and the 90° between the tangent and TD is marked. The correct next move is to join D STRAIGHT to P, the point in the alternate segment — but instead they joined D to B, the chord's OTHER circumference point (shown here — and yes, that really does give a genuine right angle too, ∠TBD, angle in a semicircle). Does that join get them any closer to ∠TPB, the angle they're actually trying to prove?",
        af: "'n Klasmaat het die eerste stap reg gekry: die middellyn TD is af, en die 90° tussen die raaklyn en TD is gemerk. Die regte volgende stap is om D REGUIT aan P te verbind, die punt in die oorstaande segment — maar in plaas daarvan het hulle D aan B verbind, die koord se ANDER omtrekpunt (hier gewys — en ja, dit gee wel werklik ook 'n eg regte hoek, ∠TBD, hoek in 'n halfsirkel). Bring daardie verbinding hulle enige nader aan ∠TPB, die hoek wat hulle eintlik probeer bewys?",
      },
      diagram: FIG_TRAP,
      options: [
        { text: { en: "No — ∠TBD = 90° is real, but it's the angle at B, not P; nothing links it to ∠TPB unless P itself gets joined to D", af: "Nee — ∠TBD = 90° is eg, maar dit is die hoek by B, nie by P nie; niks koppel dit aan ∠TPB tensy P self aan D verbind word nie" }, correct: true },
        { text: { en: "Yes — ∠TBD and ∠TPB are angles in the same segment, so they must be equal", af: "Ja — ∠TBD en ∠TPB is hoeke in dieselfde segment, dus moet hulle gelyk wees" } },
        { text: { en: "No — because ∠TBD isn't actually a genuine 90° in this picture", af: "Nee — omdat ∠TBD nie werklik 'n eg 90° in hierdie prentjie is nie" } },
        { text: { en: "Yes — B and P are both on the circle, so any angle found at one automatically transfers to the other", af: "Ja — B en P is albei op die sirkel, dus dra enige hoek by een outomaties oor na die ander" } },
      ],
      hints: [
        { en: "Angles in the same segment need to stand on the SAME chord. ∠TBD stands on chord TD; ∠TPB stands on chord TB — are those the same chord?",
          af: "Hoeke in dieselfde segment moet op DIESELFDE koord staan. ∠TBD staan op koord TD; ∠TPB staan op koord TB — is dit dieselfde koord?" },
        { en: "Different chords, so that theorem doesn't apply here. ∠TBD = 90° is a completely genuine fact — B is on the circle and TD is a diameter, so angle in a semicircle guarantees it — but it's anchored to B, not P. The proof needs an angle AT P, and the only way to get one is to join P itself to D.",
          af: "Verskillende koorde, dus geld daardie stelling nie hier nie. ∠TBD = 90° is 'n heeltemal eg feit — B is op die sirkel en TD is 'n middellyn, dus waarborg hoek-in-'n-halfsirkel dit — maar dit is geanker aan B, nie aan P nie. Die bewys benodig 'n hoek BY P, en die enigste manier om een te kry, is om P self aan D te verbind." },
      ],
      reason: "construction",
      note: {
        en: "Being legal and being USEFUL for THIS target are two different things. ∠TBD = 90° is completely genuine — but the angle we're trying to prove, ∠TPB, is hosted at P, not B, and nothing connects that right angle at B to P. The construction rule that saves you every time: \"You must join the point that you are trying to prove!\" The correct move is D joined straight to P.",
        af: "Om wettig te wees en om NUTTIG te wees vir HIERDIE teiken is twee verskillende dinge. ∠TBD = 90° is heeltemal eg — maar die hoek wat ons probeer bewys, ∠TPB, sit by P, nie by B nie, en niks koppel daardie regte hoek by B aan P nie. Die konstruksiereël wat jou elke keer red: \"Jy moet die punt verbind wat jy probeer bewys!\" Die regte skuif is om D reguit aan P te verbind.",
      },
    },

    /* ---------- 3 · step ① — the correct join ---------- */
    {
      type: "note",
      prompt: { en: "Back to the correct join", af: "Terug na die regte verbinding" },
      diagram: FIG_STEP_JOIN,
      note: {
        en: "The classmate's mistake, undone: D joined STRAIGHT to P this time, the actual point in the alternate segment the claim is about — exactly what \"join the point you're trying to prove\" means. Triangle TDP is now closed.",
        af: "Die klasmaat se fout, ongedaan gemaak: D word hierdie keer REGUIT aan P verbind, die werklike punt in die oorstaande segment waaroor die bewering gaan — presies wat \"verbind die punt wat jy probeer bewys\" beteken. Driehoek TDP is nou gesluit.",
      },
    },

    /* ---------- 4 · step ② — the 90° at T, and where the diameter sits ---------- */
    {
      type: "choice",
      prompt: {
        /* "(tg−)" used to sit in this sentence — her playtest, 2026-08-12:
           "what does that (-tg) in brackets mean?" It is the diagram
           engine's INTERNAL name for the tangent ray in the minus
           direction (see engine.js legDir: "tg-" = deg − 90) and it had no
           business in front of a learner. The ray already has a letter on
           the picture — S — so it is now named the way the figure names
           it. Swept the whole rounds folder: this was the only place a tg
           token had leaked out of a comment or a `legs:` array into
           learner-facing prose. */
        en: "Tan ⊥ diameter still gives 90° between the tangent ray TS and TD, marked. Trace the tangent ray round to B — the full angle is outlined too. This time, does the diameter sit BETWEEN the tangent ray and the chord, or does the chord sit between the tangent ray and the diameter?",
        af: "Raaklyn ⊥ middellyn gee steeds 90° tussen die raaklynstraal TS en TD, gemerk. Volg die raaklynstraal rondom na B — die volle hoek is ook uitgestip. Sit die middellyn hierdie keer TUSSEN die raaklynstraal en die koord, of sit die koord tussen die raaklynstraal en die middellyn?",
      },
      diagram: FIG_STEP_T90,
      options: [
        { text: { en: "The diameter sits BETWEEN the tangent ray and the chord", af: "Die middellyn sit TUSSEN die raaklynstraal en die koord" }, correct: true },
        { text: { en: "The chord sits between the tangent ray and the diameter, same as last round", af: "Die koord sit tussen die raaklynstraal en die middellyn, soos die vorige rondte" } },
        { text: { en: "D sits exactly on the tangent ray itself, not inside the angle at all", af: "D sit presies op die raaklynstraal self, glad nie binne die hoek nie" } },
        { text: { en: "It depends on where P is, not on B at all", af: "Dit hang af van waar P is, glad nie van B nie" } },
      ],
      hints: [
        { en: "Look at the order the three rays leave T, reading from the tangent round to B: tangent, then… which comes next, D or B?",
          af: "Kyk na die volgorde waarin die drie strale van T af vertrek, van die raaklyn af rondom na B: raaklyn, dan… wat kom volgende, D of B?" },
        { en: "D's ray sits INSIDE the angle from the tangent to B this time — the diameter is the one in the middle, unlike last round where the chord was in the middle.",
          af: "D se straal sit hierdie keer BINNE die hoek van die raaklyn na B — die middellyn is dié een in die middel, anders as die vorige rondte waar die koord in die middel was." },
      ],
      reason: "tanDiameter",
      note: {
        en: "This time the diameter sits between the tangent ray and the chord — the opposite arrangement to last round. That flips how the two pieces combine: instead of subtracting one from the other, they're about to ADD.",
        af: "Hierdie keer sit die middellyn tussen die raaklynstraal en die koord — die teenoorgestelde rangskikking as die vorige rondte. Dit draai om hoe die twee stukke saamkom: in plaas daarvan om een van die ander af te trek, gaan hulle nou-nou BYMEKAARGETEL word.",
      },
    },

    /* ---------- 5 · step ③ — mark x, derive T₁ ---------- */
    {
      type: "choice",
      prompt: {
        en: "Mark T₂ = x (marked) — the piece of angle T₁ between the diameter and the chord. The whole angle from the tangent ray to B is made of two ADJACENT pieces: the 90° (tangent to D) and x (D to B). What does that hand you for T₁?",
        af: "Merk T₂ = x (gemerk) — die stuk van hoek T₁ tussen die middellyn en die koord. Die volle hoek van die raaklynstraal na B bestaan uit twee AANGRENSENDE stukke: die 90° (raaklyn na D) en x (D na B). Wat gee dit jou vir T₁?",
      },
      diagram: FIG_LABEL_X,
      options: [
        { text: { en: "T₁ = 90° + x", af: "T₁ = 90° + x" }, correct: true },
        { text: { en: "T₁ = 90° − x", af: "T₁ = 90° − x" } },
        { text: { en: "T₁ = x", af: "T₁ = x" } },
        { text: { en: "T₁ = 2x", af: "T₁ = 2x" } },
      ],
      hints: [
        { en: "Adjacent pieces ADD to make the whole they sit inside. Which two pieces sit next to each other here, and what do they add up to?",
          af: "Aangrensende stukke TEL BYMEKAAR om die geheel te vorm waarbinne hulle sit. Watter twee stukke sit hier langs mekaar, en wat tel hulle op tot?" },
        { en: "T₁ = 90° + x. (Last round the chord sat inside the 90°, so it was subtraction; this time the diameter sits inside T₁, so it's addition.)",
          af: "T₁ = 90° + x. (Verlede rondte het die koord binne die 90° gesit, dus was dit aftrekking; hierdie keer sit die middellyn binne T₁, dus is dit optelling.)" },
      ],
      reason: "tanChord",
      note: {
        en: "The whole angle at T splits into two adjacent pieces: the 90° (tangent to D) and x (D to B, just marked). Adjacent pieces add up to the whole, so T₁ = 90° + x — no measuring, just arithmetic on an already-known right angle. Now watch the exact same split happen again, at P.",
        af: "Die volle hoek by T verdeel in twee aangrensende stukke: die 90° (raaklyn na D) en x (D na B, pas gemerk). Aangrensende stukke tel op tot die geheel, dus T₁ = 90° + x — geen meting nodig nie, net rekenwerk op 'n reeds-bekende regte hoek. Kyk nou hoe presies dieselfde verdeling weer gebeur, by P.",
      },
    },

    /* ---------- 6 · step ④ — the free 90° at P (restated, tied to the trap) ---------- */
    {
      type: "note",
      prompt: { en: "Why this join works", af: "Hoekom hierdie verbinding werk" },
      diagram: FIG_SEMI,
      note: {
        en: "P is already joined to T and B (from the claim), and now to D too — the join the classmate skipped. TD is a diameter and P is on the circle, so ∠TPD = 90° (angle in a semicircle), completely free. This is exactly why the join mattered: D joined to P puts the free right angle at the point we're actually trying to prove, not at B.",
        af: "P is reeds aan T en B verbind (van die bewering af), en nou ook aan D — die verbinding wat die klasmaat oorgeslaan het. TD is 'n middellyn en P is op die sirkel, dus ∠TPD = 90° (hoek in 'n halfsirkel), heeltemal verniet. Dis presies hoekom die verbinding saak gemaak het: D aan P verbind sit die verniet regte hoek by die punt waaroor ons eintlik probeer bewys, nie by B nie.",
      },
    },

    /* ---------- 7 · step ⑤ — the same-segment transfer ---------- */
    {
      type: "choice",
      prompt: {
        en: "T and P both look at chord DB from the SAME side. What does \"angles in the same segment\" hand you for ∠DPB, the piece of the free 90° at P next to D?",
        af: "T en P kyk albei na koord DB vanaf DIESELFDE kant. Wat gee \"hoeke in dieselfde segment\" jou vir ∠DPB, die stuk van die verniet 90° by P langs D?",
      },
      diagram: FIG_SAME_SEG_ASK,
      options: [
        { text: { en: "∠DPB = x — the same x as T₂, both standing on the same arc DB", af: "∠DPB = x — dieselfde x as T₂, albei staan op dieselfde boog DB" }, correct: true },
        { text: { en: "∠DPB = 90° + x, the same as T₁", af: "∠DPB = 90° + x, dieselfde as T₁" } },
        { text: { en: "∠DPB can't be pinned down without knowing exactly where P sits", af: "∠DPB kan nie vasgepen word sonder om presies te weet waar P sit nie" } },
        { text: { en: "∠DPB = 2x, double T₂", af: "∠DPB = 2x, dubbel T₂" } },
      ],
      hints: [
        { en: "T and P are two DIFFERENT points, but they're on the SAME side of chord DB. Is there a theorem about two circumference points on the same side of a chord?",
          af: "T en P is twee VERSKILLENDE punte, maar hulle is aan DIESELFDE kant van koord DB. Is daar 'n stelling oor twee omtrekpunte aan dieselfde kant van 'n koord?" },
        { en: "Angles in the same segment, standing on the same chord, are always equal — no matter which two points you pick. T₂ (= ∠DTB) and ∠DPB both stand on chord DB from the same side, so ∠DPB = T₂ = x.",
          af: "Hoeke in dieselfde segment, wat op dieselfde koord staan, is altyd gelyk — ongeag watter twee punte jy kies. T₂ (= ∠DTB) en ∠DPB staan albei op koord DB vanaf dieselfde kant, dus ∠DPB = T₂ = x." },
      ],
      reason: "sameSeg",
      note: {
        en: "T₂ = ∠DTB and ∠DPB both stand on chord DB, from the same side — so \"angles in the same segment\" hands you ∠DPB = T₂ = x directly, no measuring. The free 90° at P (∠TPD) has now split into two named pieces, exactly the same way the free 90° at T did.",
        af: "T₂ = ∠DTB en ∠DPB staan albei op koord DB, vanaf dieselfde kant — dus gee \"hoeke in dieselfde segment\" jou ∠DPB = T₂ = x direk, geen meting nodig nie. Die verniet 90° by P (∠TPD) het nou in twee benoemde stukke verdeel, presies soos die verniet 90° by T ook gedoen het.",
      },
    },

    /* ---------- 8 · step ⑥ — combine + conclude ---------- */
    {
      type: "choice",
      prompt: {
        en: "∠TPD (= 90°, the free right angle at P) and ∠DPB (= x, just transferred) sit NEXT to each other, both inside ∠TPB. What is ∠TPB, and how does it compare to T₁?",
        af: "∠TPD (= 90°, die verniet regte hoek by P) en ∠DPB (= x, pas oorgedra) sit langs mekaar, albei binne ∠TPB. Wat is ∠TPB, en hoe vergelyk dit met T₁?",
      },
      diagram: FIG_COMBINE_ASK,
      options: [
        { text: { en: "∠TPB = 90° + x, exactly the same as T₁", af: "∠TPB = 90° + x, presies dieselfde as T₁" }, correct: true },
        { text: { en: "∠TPB = x, the same as ∠DPB", af: "∠TPB = x, dieselfde as ∠DPB" } },
        { text: { en: "∠TPB = 90° − x, the same split as the last round", af: "∠TPB = 90° − x, dieselfde verdeling as die vorige rondte" } },
        { text: { en: "∠TPB can't be pinned down without an actual value for x", af: "∠TPB kan nie vasgepen word sonder 'n werklike waarde vir x nie" } },
      ],
      hints: [
        { en: "∠TPD and ∠DPB sit NEXT to each other, both inside ∠TPB — not one carved out of the other this time.",
          af: "∠TPD en ∠DPB sit langs mekaar, albei binne ∠TPB — nie een uit die ander uitgesny hierdie keer nie." },
        { en: "∠TPB = ∠TPD + ∠DPB = 90° + x. Same as the last round in spirit — the construction hands the tangent-chord angle straight back to itself, at the point in the alternate segment — but this time the two pieces ADD instead of one being subtracted from the other.",
          af: "∠TPB = ∠TPD + ∠DPB = 90° + x. Dieselfde as die vorige rondte in gees — die konstruksie gee die raaklyn–koord-hoek reguit terug aan homself, by die punt in die oorstaande segment — maar hierdie keer TEL die twee stukke BYMEKAAR in plaas daarvan dat een van die ander afgetrek word." },
      ],
      reason: "tanChord",
      note: {
        en: "∠TPB = ∠TPD + ∠DPB = 90° + x — exactly T₁, the tangent-chord angle this round started with. The picture flipped to the other side of the chord, and this time the two known pieces at P ADD instead of splitting a right angle, but the result is exactly what the last round proved: the tangent-chord angle always equals the angle in the alternate segment, whichever side you measure it from.",
        af: "∠TPB = ∠TPD + ∠DPB = 90° + x — presies T₁, die raaklyn–koord-hoek waarmee hierdie rondte begin het. Die prentjie het na die ander kant van die koord omgeswaai, en hierdie keer TEL die twee bekende stukke by P BYMEKAAR in plaas daarvan dat 'n regte hoek verdeel word, maar die resultaat is presies wat die vorige rondte bewys het: die raaklyn–koord-hoek is altyd gelyk aan die hoek in die oorstaande segment, ongeag van watter kant jy dit meet.",
      },
    },

    /* ---------- 9 · error-spotting: right conclusion, one wrong reason ---------- */
    {
      type: "choice",
      prompt: {
        en: "This solution reaches the right conclusion, ∠TPB = 90° + x, the same as T₁ — but one line has the WRONG reason written next to it. Which one?",
        af: "Hierdie oplossing kom by die regte gevolgtrekking uit, ∠TPB = 90° + x, dieselfde as T₁ — maar een reël het die VERKEERDE rede langsaan geskryf. Watter een?",
      },
      diagram: FIG_FINAL,
      solution: {
        caption: SOL_CAP,
        lines: [
          { st: "∠STD = 90°", rs: { en: "tan ⊥ diameter", af: "raaklyn ⊥ middellyn" } },
          { st: "T₂ = x" },
          { st: "T₁ = 90° + x" },
          { st: "∠TPD = 90°", rs: { en: "tan ⊥ diameter", af: "raaklyn ⊥ middellyn" } },
          { st: "∠DPB = x", rs: { en: "∠s in same segment", af: "∠e in dieselfde segment" } },
          { st: "∴ ∠TPB = 90° + x = T₁" },
        ],
      },
      options: [
        { text: { en: "∠TPD = 90°   (tan ⊥ diameter)", af: "∠TPD = 90°   (raaklyn ⊥ middellyn)" }, correct: true },
        { text: { en: "∠STD = 90°   (tan ⊥ diameter)", af: "∠STD = 90°   (raaklyn ⊥ middellyn)" } },
        { text: { en: "T₁ = 90° + x", af: "T₁ = 90° + x" } },
        { text: { en: "∠DPB = x   (∠s in same segment)", af: "∠DPB = x   (∠e in dieselfde segment)" } },
      ],
      hints: [
        { en: "This proof uses TWO different 90°s, from TWO different theorems. Check each one is credited to the theorem that actually produces it — one of them has borrowed the OTHER one's reason.",
          af: "Hierdie bewys gebruik TWEE verskillende 90°'e, van TWEE verskillende stellings. Kyk of elkeen aan die stelling gekrediteer word wat dit werklik lewer — een van hulle het die ANDER een se rede geleen." },
        { en: "∠STD = 90° really is \"tan ⊥ diameter\" (T is where the tangent touches). But ∠TPD = 90° is at P, nowhere near the tangent — that one is \"∠s in semi-circle\", not \"tan ⊥ diameter\".",
          af: "∠STD = 90° is werklik \"raaklyn ⊥ middellyn\" (T is waar die raaklyn raak). Maar ∠TPD = 90° is by P, nêrens naby die raaklyn nie — daardie een is \"∠ in halwe sirkel\", nie \"raaklyn ⊥ middellyn\" nie." },
      ],
      reason: "semiCircle",
      note: {
        en: "∠TPD = 90° is correct, but \"tan ⊥ diameter\" is the wrong reason for it — that theorem only ever produces a right angle AT the point of tangency, T. ∠TPD sits at P, a point on the circle seeing the diameter TD from the outside — that is \"∠s in semi-circle\", a different theorem that happens to also give 90° here.",
        af: "∠TPD = 90° is korrek, maar \"raaklyn ⊥ middellyn\" is die verkeerde rede daarvoor — daardie stelling lewer net ooit 'n regte hoek BY die raakpunt, T. ∠TPD sit by P, 'n punt op die sirkel wat die middellyn TD van buite af sien — dit is \"∠ in halwe sirkel\", 'n ander stelling wat toevallig ook hier 90° gee.",
      },
    },

    /* ---------- 10 · the legal-constructions thread, continued ---------- */
    {
      type: "choice",
      prompt: {
        en: "Partway through this proof, a learner wants to draw ONE new line to help. Only one of these four moves is actually allowed. Which construction is legal?",
        af: "Halfpad deur hierdie bewys wil 'n leerder EEN nuwe lyn teken om te help. Net een van hierdie vier skuiwe is werklik toegelaat. Watter konstruksie is wettig?",
      },
      diagram: FIG_LEGAL,
      options: [
        { text: { en: "Draw the diameter TD, from the point of tangency", af: "Trek die middellyn TD, vanaf die raakpunt" }, correct: true },
        { text: { en: "Draw a line through B parallel to the tangent", af: "Teken 'n lyn deur B ewewydig aan die raaklyn" } },
        { text: { en: "Construct a second tangent to the circle at B", af: "Konstrueer 'n tweede raaklyn aan die sirkel by B" } },
        { text: { en: "Assume ∠TPB = 90° + x first, then use that to finish the proof", af: "Neem eers aan ∠TPB = 90° + x, gebruik dit dan om die bewys klaar te maak" } },
      ],
      hints: [
        { en: "A legal move only ever uses points that ALREADY exist — join two of them, or draw a diameter through the centre and a point you already have. Which one of these four does only that?",
          af: "'n Wettige skuif gebruik net punte wat REEDS bestaan — verbind twee van hulle, of trek 'n middellyn deur die middelpunt en 'n punt wat jy reeds het. Watter een van hierdie vier doen net dit?" },
        { en: "T, O and the circle already exist — the diameter through T uses nothing new. The other three all hand you something nobody has proven yet: a line that never meets another (parallel), a line that touches the circle only once at a SECOND point (tangent at B), or — worst of all — the exact result the proof is trying to reach.",
          af: "T, O en die sirkel bestaan reeds — die middellyn deur T gebruik niks nuuts nie. Die ander drie gee jou almal iets wat niemand nog bewys het nie: 'n lyn wat nooit 'n ander ontmoet nie (parallel), 'n lyn wat die sirkel net een keer raak by 'n TWEEDE punt (raaklyn by B), of — die ergste van almal — die presiese resultaat wat die bewys probeer bereik." },
      ],
      reason: "construction",
      note: {
        en: "A diameter through a point you already have is always allowed — T, O and the circle give you TD for free, a guaranteed true line. The other three all smuggle in something extra: that two lines never meet (parallel), that a NEW line touches the circle only once (a second tangent, at B), or the exact result the proof is trying to reach, assumed up front. That last one is the sneakiest, because it FEELS like a shortcut. The classroom rule says it best: \"When we assume, we make an ass out of u and me.\"",
        af: "'n Middellyn deur 'n punt wat jy reeds het, is altyd toegelaat — T, O en die sirkel gee jou TD verniet, 'n gewaarborgde ware lyn. Die ander drie smokkel almal iets ekstra in: dat twee lyne nooit ontmoet nie (parallel), dat 'n NUWE lyn die sirkel net een keer raak ('n tweede raaklyn, by B), of die presiese resultaat wat die bewys probeer bereik, vooraf aangeneem. Daardie laaste een is die slinksste, want dit VOEL soos 'n kortpad. Die klaskamerreël sê dit die beste: \"When we assume, we make an ass out of u and me.\"",
      },
    },

    /* ---------- 11 · recap — the trap named, the rule that carries every case ---------- */
    {
      type: "note",
      prompt: { en: "What actually transferred", af: "Wat werklik oorgedra het" },
      diagram: FIG_FINAL,
      note: {
        en: "The chord flipped to the other side of the tangent, and the construction still did not care: draw the diameter from the point of tangency, join its far end STRAIGHT to the point you're trying to prove, and two free right angles chase the tangent-chord angle back to itself. This time they ADD instead of splitting, but the destination is identical — T₁ = 90° + x, and ∠TPB lands on exactly the same expression.<br><br>Joining D to B instead of D to P (an honest mistake, the real classroom habit) is perfectly legal, and it even hands you a genuine right angle — just at the wrong point. It never reaches P, so it never reaches the angle we were actually trying to prove.<br><br>The rule that carries every version of this proof: <b>you must join the point that you are trying to prove.</b>",
        af: "Die koord het na die ander kant van die raaklyn geswaai, en die konstruksie het steeds nie omgegee nie: trek die middellyn vanaf die raakpunt, verbind die verste punt daarvan REGUIT aan die punt wat jy probeer bewys, en twee verniet-regte-hoeke jaag die raaklyn–koord-hoek terug na homself. Hierdie keer TEL hulle BYMEKAAR in plaas daarvan om te verdeel, maar die bestemming is identies — T₁ = 90° + x, en ∠TPB land op presies dieselfde uitdrukking.<br><br>Om D aan B te verbind in plaas van D aan P ('n eerlike fout, die regte klaskamer-gewoonte) is heeltemal wettig, en gee jou selfs 'n eg regte hoek — net by die verkeerde punt. Dit bereik nooit P nie, dus bereik dit nooit die hoek wat ons eintlik probeer bewys het nie.<br><br>Die reël wat elke weergawe van hierdie bewys dra: <b>jy moet die punt verbind wat jy probeer bewys.</b>",
      },
    },

  ],
};
