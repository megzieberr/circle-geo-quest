/* Proof rounds P4 — "T2 transfer: reflex and the bowtie"
   (PROOF-ROUNDS-PLAN.md, session 3 — the T2 arc.)
   ------------------------------------------------------------------------
   pr3 (proof3-t2-discovery.js) built ONE construction on the standard
   picture: draw the diameter through P, get two isosceles triangles,
   double each base angle with the exterior angle theorem, add. This round
   carries that construction across the theorem's two trickier pictures —
   P on the SHORT arc (the reflex case) and a genuine BOWTIE where the two
   doubled pieces overlap instead of adding — so the punchline lands as an
   experience: the five steps never blink, only whether the last step is
   an add or a subtract.

   REVISED 2026-08-11 night (FIX-ROUND-2.md, items 1, 2, 6 — the foreman's
   dig through Megan's cheat-note PDF; items 3, 4, 5 in that file belong to
   OTHER rounds/sessions and are untouched here):
     · item 1 — this round now matches pr3's visual standard: X_COLOR /
       Y_COLOR (same hex values pr3 defines — pr3 keeps them as its own
       local consts, not exported, so they are re-declared here rather
       than imported; the VALUES are what item 1 asked to reuse) mark the
       x-family and y-family throughout — labels, wedges, AND the
       isosceles twin angles ∠OAP / ∠OBP that pr3's playtest added to its
       own figures. Marker-pen `hl` highlights pick out triangle OPA
       (X_COLOR) and OPB (Y_COLOR) on the reflex construction panel, the
       same visual grammar as pr3's x-page/y-page pair — collapsed into
       ONE panel here (not two) because this is the six-panel transfer
       round, not the seven-panel discovery round; both triangles pop at
       once instead of across two pages. The shared spine OP/OQ (both
       triangles' common side) is left uncoloured on purpose — a single
       chord segment can only carry one highlight colour, and OA+PA /
       OB+PB already carry each triangle's own outline.
     · item 2 — used the engine's new `o.reflex` option (engine.js,
       additive) on panel 1's claim figure: a small unlabelled reflex arc
       at O so "the REFLEX ∠AOB" the prompt asks about is visibly THAT
       angle, not a guess from the words alone.
     · item 6 — panel 3 is REBUILT. It used to show two circumference
       points sharing an arc and prove "angles in the same segment" by
       running the standard (ADDING) construction twice — mathematically
       fine, but that is NOT what Megan's own cheat-note page 6 calls the
       bowtie. Her bowtie is the THIRD case of T2's proof: one
       circumference point C, diameter CD, with A and B on the SAME side
       of line CD so the two doubled wedges at O OVERLAP and the chain is
       a SUBTRACTION, not an addition. That picture is now panel 3. The
       same-segment insight the old panel 3 taught is genuinely useful and
       pr9 leans on it ("established in P4") — so it survives as the NEW
       panel 4, immediately after the true bowtie, with its two
       circumference points renamed E, F (C, D are now spoken for by the
       bowtie's own point-and-diameter pair, and reusing them for an
       unrelated second picture two panels later would collide). The round
       grows from six panels to seven; panels 5-6 (error-spot,
       legal-constructions) are the old panels 4-5, untouched in content;
       panel 7 (recap) keeps its gallery of three, with the third mini
       swapped for the subtraction picture and re-captioned.

   SEVEN PANELS (was six), same renderInvestigate() as pr0-pr3 — no new
   panel type, no typed answers:
     1 · choice — reflex picture, restated with the SAME letters (A, B, P,
         O — round03-centre-circumference.js's own reflex figure, reused
         letter-for-letter). "What's the first move?" Warms up the
         transfer before the punchline in panel 2. A small reflex arc at O
         (item 2) shows which angle "the reflex ∠AOB" means.
     2 · choice — reflex picture, the construction complete: x, y, 2x, 2y
         all marked exactly as pr3 taught, PLUS the isosceles twins ∠OAP
         (=x) and ∠OBP (=y), x-family/y-family coloured throughout, with
         OPA/OPB marker-pen highlighted (item 1). Same arithmetic, but
         WHICH angle at O does 2x + 2y actually trace out this time? The
         reflex one — because P sits on the short arc, so Q lands on the
         far side.
     3 · choice — NEW (item 6): the true bowtie. One circumference point
         C, diameter CD, and A/B both on the SAME side of CD so the two
         doubled wedges AÔD (=2x) and BÔD (=2y) overlap. The chain
         subtracts: ∠AOB = BÔD − AÔD = 2y − 2x, so ∠ACB = y − x. Distinct
         x/y-family colours on the two overlapping wedges make the overlap
         readable.
     4 · choice — the same-segment insight, carried over from the old
         panel 3 and renamed to E, F (item 6): two circumference points on
         ONE arc, both proofs landing on the same central angle, so their
         circumference angles must be equal. Explicitly flagged as a
         DIFFERENT picture from the bowtie just shown — this one still
         adds, it doesn't subtract.
     5 · choice — error-spotting (invest04-prove-it.js's DNA, pr2 panel 4's
         shape): a learner's solution on the reflex picture reaches the
         right numbers with ONE line's reason mismatched (a doubled angle
         credited to "∠s opp equal sides" instead of "ext ∠ of Δ").
         `solution.lines[].st` is symbol-only throughout — every English
         word lives in `rs` (a short reason TAG) or in the panel's own
         bilingual `prompt`/`note`, never inside `st`.
     6 · choice — the legal-constructions thread, continued from pr2 with
         DIFFERENT specific moves (not a clone of pr2's four options): this
         time the trap is assuming the theorem's own conclusion partway
         through its own proof. Carries the catchphrase, VERBATIM ENGLISH
         in both language versions — used ONCE in this build (pr2 already
         used it once for T1; this is its one appearance for T2).
     7 · note   — recap: three pictures, one set of five steps. A small
         `diagrams` gallery (discover-line-centre.js's two-mini-figure
         convention) puts standard/reflex/bowtie side by side — the
         bowtie mini now shows the subtraction picture (item 6). Last
         panel.

   GEOMETRY — reused, not invented, and NEW orientations so the letters
   keep meaning what they meant last time they were used, rather than
   colliding with pr3's roles for them:
     · Reflex picture — A:160, B:20, P:90 are round03-centre-circumference.js's
       OWN exact reflex figure (its q5/q6 diagrams), reused letter-for-
       letter: the class already met ∠APB = 110° ⇒ reflex ∠AOB = 220° on
       the main quest map, and this round shows the proof behind that
       exact number rather than a new one. Q (this round's addition, same
       ROLE as pr3's Q) is P's antipode, 90 + 180 = 270.
     · Bowtie picture (item 6, her page 6) — C:90 (circumference point),
       D:270 (its antipode via the diameter, same ROLE as P/Q above), A:200
       and B:130 both chosen strictly between C and D going through 180°
       (i.e. both on the LEFT semicircle that line CD cuts the circle
       into) — that is what "A and B both on the same side of CD" means as
       coordinates, and it's what makes the two wedges below nest instead
       of sitting side by side. (An earlier draft tried A:10/B:60, tucked
       close under C — mathematically fine, but its four labels crowded
       into the same corner of the picture; A:200/B:130 keeps the same
       relationship with room to read it, headless-checked for overlaps.)
     · Same-segment picture (old panel 3, item 6 rename only) — E:216,
       F:324 keep discover-same-segment.js's own exact handle values for
       what used to be this panel's C, D (its MODEL()'s `init` numbers for
       A, B, P, Q) — the identical picture the class dragged on the main
       quest and met again in Investigation Station 2. Relabelled to E, F
       here (not C, D) because this round's OWN C, D now name the bowtie's
       diameter pair (item 6), and reusing them for a second, unrelated
       pair of points four panels later would collide.

   Every angle mark is an exact integer, same reasoning as pr3's header
   (O-vertex angles are plain degree subtraction; base angles follow from
   the isosceles apex-angle formula; nothing here is a rounded estimate —
   every value below was spot-checked node-side against this engine's own
   verifyDiagram() before being written into the figures):
     Reflex — apex ∠AOP = |160−90| = 70°  →  x = (180−70)/2 = 55°
              apex ∠BOP = |90−20| = 70°   →  y = (180−70)/2 = 55°
              ∠AOQ = 180−70 = 110° = 2x     ∠BOQ = 180−70 = 110° = 2y
              reflex ∠AOB = 2x + 2y = 220° = 2 × ∠APB (110°)
              isosceles twins (item 1): ∠OAP = x = 55° (OPA's OTHER base
              angle — OP = OA are both radii, so its two base angles ∠OPA
              and ∠OAP are equal by construction); ∠OBP = y = 55°, same
              reasoning on OPB.
     Bowtie (item 6) — apex ∠COA = |90−200| = 110° → x = (180−110)/2 = 35°
                        apex ∠COB = |90−130| = 40°  → y = (180−40)/2 = 70°
              (base angles: ∠OCA = ∠OAC = x = 35°; ∠OCB = ∠OBC = y = 70° —
              same isosceles reasoning as the reflex picture above; the
              figure marks x and y at C only — the twin marks at A and B
              are left off THIS figure on purpose, see the note below)
              AÔD = 180−110 = 70° = 2x    (ext ∠ of ΔOCA, straight line C-O-D)
              BÔD = 180−40 = 140° = 2y   (ext ∠ of ΔOCB, same straight line)
              A and B both sit strictly between C(90°) and D(270°) going
              through 180°, with A(200°) closer to C and B(130°) closer to
              C too but by less — so wedge AÔD (70°, from D round to A)
              sits INSIDE wedge BÔD (140°, from D round to B) — the
              overlap the bowtie is about.
              ∠AOB = BÔD − AÔD = 140 − 70 = 70° = 2y − 2x = 2(70−35)
              ∠ACB = ∠OCB − ∠OCA = y − x = 70 − 35 = 35° = half of 70° ✓
              (Every value above re-checked against verifyDiagram(), not
              hand-arithmetic alone — see the commit that added this file.
              Judgment call, item 1 vs item 6: the reflex figure marks the
              isosceles TWINS ∠OAP/∠OBP because item 1 explicitly asked for
              them there; item 6 doesn't ask for the bowtie's own twins
              ∠OAC/∠OBC, and adding them crowded the picture — C, A and B
              all sit within 110° of each other, so a twin mark's label
              lands right on top of C's own x/y labels at every A/B
              placement tried. Left off rather than fought with `r`
              overrides that would just relocate the collision.)
     Same-segment (E, F) — the central angle is ∠AOB (chord A–B, geometry
              unchanged from the old panel): ∠AOB = |324−216| = 108°.
              E(52), F(128) both sit outside [216,324] ⇒ both on the arc
              NOT containing the minor arc ⇒ ∠AEB = ∠AFB = 108° ÷ 2 = 54°. */

const AC = "#9c36b5";
const X_COLOR = "#0ea271";   // teal-green — same value as pr3's own X_COLOR
const Y_COLOR = "#f76707";   // orange — same value as pr3's own Y_COLOR

/* ---- panel 1: the reflex claim, before the construction ----
   Identical shape/letters to round03-centre-circumference.js's own reflex
   diagram: O, A, B, P, with ∠APB = 110° given and marked. No angle at O
   is CONSTRUCTED yet — the engine always draws the SMALLER sweep between
   two legs unless o.reflex is set (item 2) — but a small, unlabelled
   reflex arc now marks which angle at O "the reflex ∠AOB" in the prompt
   actually means, so the question isn't just words. */
const FIG_REFLEX_CLAIM = {
  O: true,
  pts: { A: 160, B: 20, P: 90 },
  chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]],
  angles: [
    { at: "P", legs: ["A", "B"], t: "110°", o: { v: 110 } },
    { at: "O", legs: ["A", "B"], t: "", o: { v: 220, reflex: 1, ar: 16 } },
  ],
};

/* ---- panel 2 (+ reused on panel 5's error-spot): the reflex construction,
   complete. Q added (P's antipode), radii ticked, x/y at P and 2x/2y at O
   all marked (as before) PLUS the isosceles twins ∠OAP=x and ∠OBP=y (item
   1's ask — the exact same twins pr3's playtest added to ITS figures).
   Triangle OPA (OA, PA, the x/twin labels, O₁'s wedge) is X_COLOR;
   triangle OPB (OB, PB, the y/twin labels, O₂'s wedge) is Y_COLOR — pr3's
   x-page/y-page pair, both halves visible at once since this round only
   has room for one combined panel here. OP/OQ (the shared spine of both
   triangles) is left uncoloured — a single segment can't carry two
   highlight colours, and OA+PA / OB+PB already carry each triangle's own
   shape. Reused verbatim on panel 5 (the error-spot panel is ABOUT these
   same lines, so the extra visual grounding only helps, never spoils). */
const FIG_REFLEX_CONSTRUCT = {
  O: true,
  pts: { A: 160, B: 20, P: 90, Q: 270 },
  chords: [
    { a: "O", b: "P", mk: "t1" },
    { a: "O", b: "Q", mk: "t1" },
    { a: "O", b: "A", mk: "t1", hl: X_COLOR },
    { a: "O", b: "B", mk: "t1", hl: Y_COLOR },
    { a: "P", b: "A", hl: X_COLOR }, { a: "P", b: "B", hl: Y_COLOR },
  ],
  angles: [
    /* r pins the x/y labels to their arcs (FIX-ROUND-1.md item 13 — they
       drifted far from their vertex on Megan's playtest; the engine's
       default radius for a 55° sweep, 50, was still too generous here). */
    { at: "P", legs: ["O", "A"], t: "x", o: { v: 55, r: 36, c: X_COLOR } },
    { at: "P", legs: ["O", "B"], t: "y", o: { v: 55, r: 36, c: Y_COLOR } },
    /* isosceles twins (item 1) — OP = OA makes ∠OAP the triangle's OTHER
       base angle, so it's the same x; same reasoning at B gives y. */
    { at: "A", legs: ["O", "P"], t: "x", o: { v: 55, c: X_COLOR } },
    { at: "B", legs: ["O", "P"], t: "y", o: { v: 55, c: Y_COLOR } },
    { at: "O", legs: ["A", "Q"], t: "O₁ = 2x", o: { v: 110, c: X_COLOR, hl: X_COLOR } },
    { at: "O", legs: ["B", "Q"], t: "O₂ = 2y", o: { v: 110, c: Y_COLOR, hl: Y_COLOR } },
  ],
};

/* ---- panel 3 (NEW, item 6): the true bowtie — one circumference point,
   its diameter, and A/B on the SAME side of it, so the two doubled wedges
   at O overlap instead of adding. x-family (C→A side) is X_COLOR,
   y-family (C→B side) is Y_COLOR throughout: the base angles at C and the
   two overlapping wedges at O (isosceles twins at A/B deliberately left
   off — see the header's judgment-call note, item 1 vs item 6). OC/OA/OB
   are ticked equal (all radii) same as every other picture in this
   theorem. See the header derivation for the exact integers; every label
   position here is headless-checked for overlap/clipping. */
const FIG_BOWTIE = {
  O: true,
  pts: { A: 200, B: 130, C: 90, D: 270 },
  chords: [
    { a: "O", b: "C", mk: "t1" },
    { a: "O", b: "D" },
    { a: "O", b: "A", mk: "t1", hl: X_COLOR },
    { a: "O", b: "B", mk: "t1", hl: Y_COLOR },
    { a: "C", b: "A", hl: X_COLOR }, { a: "C", b: "B", hl: Y_COLOR },
  ],
  angles: [
    { at: "C", legs: ["O", "A"], t: "x", o: { v: 35, c: X_COLOR } },
    { at: "C", legs: ["O", "B"], t: "y", o: { v: 70, c: Y_COLOR } },
    { at: "O", legs: ["B", "D"], t: "2y", o: { v: 140, c: Y_COLOR, hl: Y_COLOR } },
    { at: "O", legs: ["A", "D"], t: "2x", o: { v: 70, c: X_COLOR, hl: X_COLOR } },
  ],
};

/* ---- panel 3, bare version reused nowhere else: the FULL bowtie above
   already carries every mark panel 3 needs, so there is no separate
   "before" figure this time — unlike the reflex picture's two-panel
   warm-up (1 then 2), the bowtie's own construction is the whole
   question (its five steps were already taught twice by this point in
   the round). ---- */

/* ---- panel 4 (was panel 3, item 6 rename only): the same-segment
   insight — two circumference points, E and F, sharing one arc. Renamed
   from the old C/D since this round's C/D now belong to the bowtie
   (panel 3). Geometry unchanged from before the rename. ---- */
const FIG_SAME_SEG = {
  O: true,
  pts: { A: 216, B: 324, E: 52, F: 128 },
  chords: [
    ["A", "B"], ["O", "A"], ["O", "B"],
    ["E", "A"], ["E", "B"], ["F", "A"], ["F", "B"],
  ],
  angles: [
    { at: "O", legs: ["A", "B"], t: "108°", o: { v: 108 } },
    { at: "E", legs: ["A", "B"], t: "", o: { v: 54 } },
    { at: "F", legs: ["A", "B"], t: "", o: { v: 54 } },
  ],
};

/* ---- panel 6: bare reflex figure — the legal-constructions panel.
   Nothing constructed yet: the question is which NEW line may be drawn. */
const FIG_REFLEX_BARE = {
  O: true,
  pts: { A: 160, B: 20, P: 90 },
  chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]],
};

/* ---- panel 7: the recap gallery — three pictures, side by side.
   Third mini rebuilt on the true (subtracting) bowtie, item 6. ---- */
const MINI_STANDARD = {
  O: true,
  pts: { A: 230, B: 310, P: 90 },
  chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]],
  angles: [
    { at: "O", legs: ["A", "B"], t: "2(x+y)", o: { v: 80 } },
    { at: "P", legs: ["A", "B"], t: "x+y", o: { v: 40 } },
  ],
};
const MINI_REFLEX = {
  O: true,
  pts: { A: 160, B: 20, P: 90 },
  chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]],
  angles: [{ at: "P", legs: ["A", "B"], t: "110°", o: { v: 110 } }],
};
const MINI_BOWTIE = {
  O: true,
  pts: { A: 200, B: 130, C: 90, D: 270 },
  chords: [
    { a: "O", b: "D" },
    { a: "O", b: "A", hl: X_COLOR }, { a: "O", b: "B", hl: Y_COLOR },
    { a: "C", b: "A", hl: X_COLOR }, { a: "C", b: "B", hl: Y_COLOR },
  ],
  angles: [
    { at: "O", legs: ["B", "D"], t: "", o: { v: 140, c: Y_COLOR, hl: Y_COLOR } },
    { at: "O", legs: ["A", "D"], t: "", o: { v: 70, c: X_COLOR, hl: X_COLOR } },
  ],
};

const SOL_CAP = { en: "A learner's solution", af: "'n Leerder se oplossing" };

export const round = {
  id: "pr4", n: 0, accent: AC, kind: "proof", group: "g7",
  title: { en: "T2 transfer: reflex and the bowtie", af: "T2-oordrag: inspringende hoek en die strikdas" },
  blurb: {
    en: "Same five steps across a reflex angle and a bowtie where the pieces subtract — plus the trap of assuming what you haven't proven.",
    af: "Dieselfde vyf stappe oor 'n inspringende hoek en 'n strikdas waar die stukke aftrek — en die strik om aan te neem wat jy nie bewys het nie.",
  },
  panels: [

    /* ---------- 1 · reflex, restated — the first move ---------- */
    {
      type: "choice",
      prompt: {
        en: "A new picture: P now sits on the SHORT arc between A and B, and ∠APB = 110° (given, marked). We want the REFLEX angle ∠AOB — the small arc at O marks which one that is, the long way round, not the small one. What is the first move — the one construction that survives every version of this proof?",
        af: "'n Nuwe prentjie: P sit nou op die KORT boog tussen A en B, en ∠APB = 110° (gegee, gemerk). Ons soek die INSPRINGENDE hoek ∠AOB — die klein boogie by O wys watter een dit is, die lang pad om, nie die klein een nie. Wat is die eerste stap — die een konstruksie wat elke weergawe van hierdie bewys oorleef?",
      },
      diagram: FIG_REFLEX_CLAIM,
      options: [
        { text: { en: "Extend PO straight through O until it meets the circle again, at Q", af: "Verleng PO reguit deur O totdat dit weer die sirkel ontmoet, by Q" }, correct: true },
        { text: { en: "Join A directly to B and work inside triangle APB instead", af: "Verbind A direk aan B en werk eerder binne driehoek APB" } },
        { text: { en: "Measure ∠AOB directly with a protractor and compare it to ∠APB", af: "Meet ∠AOB direk met 'n gradeboog en vergelyk dit met ∠APB" } },
        { text: { en: "Construct a tangent to the circle at P and work from that instead", af: "Konstrueer 'n raaklyn aan die sirkel by P en werk daarvandaan verder" } },
      ],
      hints: [
        { en: "Look back at the last round — what did we draw there to turn one circumference point into two isosceles triangles?",
          af: "Kyk terug na die vorige rondte — wat het ons daar geteken om een omtrekpunt in twee gelykbenige driehoeke te verander?" },
        { en: "The diameter through P. It doesn't matter that P is now on the short arc instead of the long one — same tool, same two isosceles triangles.",
          af: "Die middellyn deur P. Dit maak nie saak dat P nou op die kort boog is in plaas van die lang een nie — dieselfde hulpmiddel, dieselfde twee gelykbenige driehoeke." },
      ],
      reason: "construction",
      note: {
        en: "Same tool as every picture in this theorem: extend the radius OP straight through the centre to the far side of the circle, at Q. The picture looks trickier — P is tucked onto the short arc — but the construction doesn't care.",
        af: "Dieselfde hulpmiddel as elke prentjie in hierdie stelling: verleng die radius OP reguit deur die middelpunt na die verste kant van die sirkel, by Q. Die prentjie lyk moeiliker — P sit op die kort boog — maar die konstruksie gee nie om nie.",
      },
    },

    /* ---------- 2 · reflex, the punchline ---------- */
    {
      type: "choice",
      prompt: {
        en: "The diameter is drawn, the two isosceles triangles OPA and OPB (highlighted) give x and y — and their isosceles twins, ∠OAP = x and ∠OBP = y, are marked too. The exterior angle theorem doubles each one at O — O₁ = 2x = 110°, O₂ = 2y = 110°, exactly as before. Add them together. What do you get, and which angle actually is it?",
        af: "Die middellyn is getrek, die twee gelykbenige driehoeke OPA en OPB (uitgelig) gee x en y — en hulle gelykbenige tweelinge, ∠OAP = x en ∠OBP = y, is ook gemerk. Die buitehoekstelling verdubbel elkeen by O — O₁ = 2x = 110°, O₂ = 2y = 110°, presies soos voorheen. Tel hulle bymekaar. Wat kry jy, en watter hoek is dit eintlik?",
      },
      diagram: FIG_REFLEX_CONSTRUCT,
      options: [
        { text: { en: "2x + 2y = 220° — the REFLEX angle ∠AOB, because Q sits on the far side from P", af: "2x + 2y = 220° — die INSPRINGENDE hoek ∠AOB, want Q sit aan die verste kant van P af" }, correct: true },
        { text: { en: "2x + 2y = 220° — the small (non-reflex) angle ∠AOB, the one on the near side of the diameter", af: "2x + 2y = 220° — die klein (nie-inspringende) hoek ∠AOB, die een aan die naaste kant van die middellyn" } },
        { text: { en: "x + y = 110°, the same number as ∠APB, so no doubling is needed here", af: "x + y = 110°, dieselfde getal as ∠APB, dus is geen verdubbeling hier nodig nie" } },
        { text: { en: "2x − 2y = 0°, since x and y turned out equal this time", af: "2x − 2y = 0°, aangesien x en y hierdie keer gelyk uitgekom het" } },
      ],
      hints: [
        { en: "The arithmetic is identical to last round — add the two doubled pieces. The real question is which angle at O that sum actually traces out. Follow the arc from A, past Q, to B — is that the short way round, or the long way?",
          af: "Die rekenwerk is presies dieselfde as verlede rondte — tel die twee verdubbelde stukke bymekaar. Die regte vraag is watter hoek by O daardie som eintlik uitteken. Volg die boog van A, verby Q, na B — is dit die kort pad om, of die lang pad?" },
        { en: "Q sits on the far side of the circle from P — and P is the one tucked onto the short arc. So tracing A → Q → B goes the LONG way round: 220° is the reflex angle ∠AOB.",
          af: "Q sit aan die verste kant van die sirkel van P af — en P is die een op die kort boog. Dus volg A → Q → B die LANG pad om: 220° is die inspringende hoek ∠AOB." },
      ],
      reason: "centreDouble",
      note: {
        en: "The five steps never changed — diameter, isosceles triangles, exterior angle, add. What changed is which angle at O the answer lands on: with P on the short arc, Q lands on the far side, and 2x + 2y = 220° traces out the REFLEX ∠AOB, not the small one. Reflex ∠AOB = 2 × ∠APB = 2 × 110° = 220° — the exact rule from the main quest, now with the proof behind it.",
        af: "Die vyf stappe het nooit verander nie — middellyn, gelykbenige driehoeke, buitehoek, tel bymekaar. Wat verander het, is watter hoek by O die antwoord uitteken: met P op die kort boog, beland Q aan die verste kant, en 2x + 2y = 220° teken die INSPRINGENDE ∠AOB uit, nie die klein een nie. Inspringende ∠AOB = 2 × ∠APB = 2 × 110° = 220° — presies dieselfde reël uit die hoofsoektog, nou met die bewys daaragter.",
      },
    },

    /* ---------- 3 · the true bowtie — the same five steps, but subtract ---------- */
    {
      type: "choice",
      prompt: {
        en: "A third picture — the real bowtie: ONE circumference point, C, with its diameter CD drawn (same construction as always). This time A and B sit on the SAME side of line CD, so the two isosceles triangles' doubled wedges at O overlap: AÔD = 2x = 70° and BÔD = 2y = 140°, both marked. Since AÔD sits INSIDE BÔD, how do you get ∠AOB from them this time?",
        af: "'n Derde prentjie — die regte strikdas: EEN omtrekpunt, C, met sy middellyn CD getrek (dieselfde konstruksie soos altyd). Hierdie keer sit A en B aan DIESELFDE kant van lyn CD, sodat die twee gelykbenige driehoeke se verdubbelde stukke by O oorvleuel: AÔD = 2x = 70° en BÔD = 2y = 140°, albei gemerk. Aangesien AÔD BINNE BÔD sit, hoe kry jy ∠AOB hierdie keer uit hulle?",
      },
      diagram: FIG_BOWTIE,
      options: [
        { text: { en: "Subtract: ∠AOB = BÔD − AÔD = 140° − 70° = 70°", af: "Trek af: ∠AOB = BÔD − AÔD = 140° − 70° = 70°" }, correct: true },
        { text: { en: "Add: ∠AOB = BÔD + AÔD = 140° + 70° = 210°", af: "Tel bymekaar: ∠AOB = BÔD + AÔD = 140° + 70° = 210°" } },
        { text: { en: "They must be equal, so ∠AOB = 0°", af: "Hulle moet gelyk wees, dus ∠AOB = 0°" } },
        { text: { en: "Average them: ∠AOB = (140° + 70°) ÷ 2 = 105°", af: "Vind die gemiddeld: ∠AOB = (140° + 70°) ÷ 2 = 105°" } },
      ],
      hints: [
        { en: "Picture two wedges sharing the same starting edge (OD), one tucked entirely inside the other. What's left over once you take the small one away from the big one?",
          af: "Verbeel jou twee stukke wat dieselfde beginrand (OD) deel, een heeltemal binne die ander. Wat bly oor sodra jy die klein een van die groot een af wegneem?" },
        { en: "∠AOB is exactly the LEFTOVER sliver between the two overlapping wedges — the big one (BÔD) minus the small one (AÔD) it contains: 140° − 70° = 70°.",
          af: "∠AOB is presies die OORBLYWENDE stukkie tussen die twee oorvleuelende stukke — die groot een (BÔD) minus die klein een (AÔD) wat dit bevat: 140° − 70° = 70°." },
      ],
      reason: "triExt",
      note: {
        en: "Same construction as every other picture — diameter through the circumference point, two isosceles triangles, exterior angle theorem doubles each base angle. What's different is the LAST step: because A and B sit on the same side of CD, the wedge AÔD (70°) is nested INSIDE the wedge BÔD (140°) instead of sitting beside it, so ∠AOB is the difference, not the sum: ∠AOB = BÔD − AÔD = 2y − 2x = 70°. Halve that and you get ∠ACB = y − x = 35° — the same theorem, run the same five steps, just subtracted instead of added at the very end.",
        af: "Dieselfde konstruksie as elke ander prentjie — middellyn deur die omtrekpunt, twee gelykbenige driehoeke, die buitehoekstelling verdubbel elke basishoek. Wat verskil, is die LAASTE stap: omdat A en B aan dieselfde kant van CD sit, lê die stuk AÔD (70°) BINNE die stuk BÔD (140°) in plaas van daarnaas, dus is ∠AOB die verskil, nie die som nie: ∠AOB = BÔD − AÔD = 2y − 2x = 70°. Halveer dit en jy kry ∠ACB = y − x = 35° — dieselfde stelling, dieselfde vyf stappe, net afgetrek in plaas van bygetel aan die einde.",
      },
    },

    /* ---------- 4 · the same-segment insight (was panel 3, renamed E/F) ---------- */
    {
      type: "choice",
      prompt: {
        en: "A different picture, not the bowtie: the same chord AB, but now TWO circumference points, E and F, on the SAME arc as each other (E and F don't sit on opposite sides of any diameter here — this picture still ADDS, same as panel 2). ∠AOB at the centre is 108° — the same 108° either way you look at it, because it's the same chord, the same centre, the same angle. If you ran the exact same five steps once using E, and once using F, both landing on that SAME 108°, what must be true about ∠AEB and ∠AFB?",
        af: "'n Ander prentjie, nie die strikdas nie: dieselfde koord AB, maar nou TWEE omtrekpunte, E en F, op DIESELFDE boog as mekaar (E en F sit nie hier aan weerskante van enige middellyn nie — hierdie prentjie tel steeds BYMEKAAR, soos in paneel 2). ∠AOB by die middelpunt is 108° — dieselfde 108° hoe jy dit ook al bekyk, want dis dieselfde koord, dieselfde middelpunt, dieselfde hoek. As jy presies dieselfde vyf stappe een keer met E, en een keer met F uitvoer, en albei op daardie SELFDE 108° beland — wat moet waar wees van ∠AEB en ∠AFB?",
      },
      diagram: FIG_SAME_SEG,
      options: [
        { text: { en: "They're equal — each one is half of the same 108°, so both are 54°", af: "Hulle is gelyk — elkeen is die helfte van dieselfde 108°, dus is albei 54°" }, correct: true },
        { text: { en: "∠AEB is bigger, because E is farther from B", af: "∠AEB is groter, omdat E verder van B af is" } },
        { text: { en: "There's no way to tell without measuring", af: "Daar is geen manier om te weet sonder om te meet nie" } },
        { text: { en: "They add up to 108°", af: "Hulle tel op tot 108°" } },
      ],
      hints: [
        { en: "Both proofs end the same way: [angle at circumference] = half of [the same 108°]. If two things both equal half of the exact same number, how do they compare to each other?",
          af: "Albei bewyse eindig dieselfde manier: [hoek by omtrek] = die helfte van [dieselfde 108°]. As twee dinge albei gelyk is aan die helfte van presies dieselfde getal, hoe vergelyk hulle met mekaar?" },
        { en: "Half of 108° is 54°, twice over — once from E's proof, once from F's. ∠AEB = ∠AFB = 54°.",
          af: "Die helfte van 108° is 54°, twee keer — een keer uit E se bewys, een keer uit F s'n. ∠AEB = ∠AFB = 54°." },
      ],
      reason: "sameSeg",
      note: {
        en: "This is the deeper reason behind a rule from earlier in the quest: angles in the same segment are equal. It was never a separate trick — it's this same theorem, run twice on the same central angle, both times adding (not the bowtie's subtracting case from last panel). Whatever point you pick on that arc, the five steps always land on half of the same ∠AOB.",
        af: "Dit is die dieper rede agter 'n reël van vroeër in die soektog: hoeke in dieselfde segment is gelyk. Dit was nooit 'n aparte kunsie nie — dis hierdie selfde stelling, twee keer uitgevoer op dieselfde middelpuntshoek, altyd bymekaar getel (nie die strikdas se aftrekgeval van die vorige paneel nie). Watter punt jy ook al op daardie boog kies, die vyf stappe beland altyd op die helfte van dieselfde ∠AOB.",
      },
    },

    /* ---------- 5 · error-spotting: right numbers, wrong reason on one line ---------- */
    {
      type: "choice",
      prompt: {
        en: "This learner's solution is checking the reflex picture. One line has the WRONG reason written next to it — the maths on that line is still correct, only the reason is mismatched. Which line?",
        af: "Hierdie leerder se oplossing gaan oor die inspringende prentjie. Een reël het die VERKEERDE rede langsaan geskryf — die wiskunde op daardie reël is nog korrek, net die rede pas nie. Watter reël?",
      },
      diagram: FIG_REFLEX_CONSTRUCT,
      solution: {
        caption: SOL_CAP,
        lines: [
          { st: "OP = OA = OB", rs: { en: "radii", af: "radii" } },
          { st: "∠OPA = ∠OAP = x", rs: { en: "∠s opp equal sides", af: "∠e teenoor gelyke sye" } },
          { st: "∠AOQ = 2x", rs: { en: "∠s opp equal sides", af: "∠e teenoor gelyke sye" } },
          { st: "∠BOQ = 2y", rs: { en: "ext ∠ of Δ", af: "buite ∠ van Δ" } },
          { st: "∴ reflex ∠AOB = 2x + 2y" },
        ],
      },
      options: [
        { text: { en: "∠AOQ = 2x   (∠s opp equal sides)", af: "∠AOQ = 2x   (∠e teenoor gelyke sye)" }, correct: true },
        { text: { en: "OP = OA = OB   (radii)", af: "OP = OA = OB   (radii)" } },
        { text: { en: "∠OPA = ∠OAP = x   (∠s opp equal sides)", af: "∠OPA = ∠OAP = x   (∠e teenoor gelyke sye)" } },
        { text: { en: "∠BOQ = 2y   (ext ∠ of Δ)", af: "∠BOQ = 2y   (buite ∠ van Δ)" } },
      ],
      hints: [
        { en: "Check each reason against what it actually needs. \"∠s opp equal sides\" only ever hands you two EQUAL angles inside one triangle — never a doubled one.",
          af: "Toets elke rede teen wat dit werklik nodig het. \"∠e teenoor gelyke sye\" gee jou net twee GELYKE hoeke binne een driehoek — nooit 'n verdubbelde een nie." },
        { en: "∠AOQ = 2x is a DOUBLED angle, produced by the exterior angle theorem — the reason should be \"ext ∠ of Δ\", not \"∠s opp equal sides\". That reason belongs on the line above it, where ∠OPA = ∠OAP really are two equal base angles.",
          af: "∠AOQ = 2x is 'n VERDUBBELDE hoek, deur die buitehoekstelling geproduseer — die rede moet \"buite ∠ van Δ\" wees, nie \"∠e teenoor gelyke sye\" nie. Daardie rede hoort op die reël bo dit, waar ∠OPA = ∠OAP werklik twee gelyke basishoeke is." },
      ],
      reason: "triExt",
      note: {
        en: "∠AOQ = 2x is correct maths, but \"∠s opp equal sides\" is the wrong reason for it — that reason only ever produces two EQUAL angles (like ∠OPA = ∠OAP on the line above), never a doubled one. A doubled angle at O, made from a straight line through P and O, is the exterior angle theorem: \"ext ∠ of Δ\".",
        af: "∠AOQ = 2x is korrekte wiskunde, maar \"∠e teenoor gelyke sye\" is die verkeerde rede daarvoor — daardie rede lewer net ooit twee GELYKE hoeke (soos ∠OPA = ∠OAP op die reël daarbo), nooit 'n verdubbelde een nie. 'n Verdubbelde hoek by O, gemaak uit 'n reguit lyn deur P en O, is die buitehoekstelling: \"buite ∠ van Δ\".",
      },
    },

    /* ---------- 6 · the legal-constructions thread, continued ---------- */
    {
      type: "choice",
      prompt: {
        en: "Partway through this proof, a learner wants to draw ONE new line to help. Only one of these four moves is actually allowed. Which construction is legal?",
        af: "Halfpad deur hierdie bewys wil 'n leerder EEN nuwe lyn teken om te help. Net een van hierdie vier skuiwe is werklik toegelaat. Watter konstruksie is wettig?",
      },
      diagram: FIG_REFLEX_BARE,
      options: [
        { text: { en: "Extend PO through O to meet the circle again at Q", af: "Verleng PO deur O totdat dit weer die sirkel ontmoet by Q" }, correct: true },
        { text: { en: "Construct a tangent to the circle at Q", af: "Konstrueer 'n raaklyn aan die sirkel by Q" } },
        { text: { en: "Draw a line through O parallel to PA", af: "Teken 'n lyn deur O ewewydig aan PA" } },
        { text: { en: "Assume ∠AOQ = 2 × ∠OPA first, then use that to finish the proof", af: "Neem eers aan ∠AOQ = 2 × ∠OPA, gebruik dit dan om die bewys klaar te maak" } },
      ],
      hints: [
        { en: "A legal move only ever uses points that ALREADY exist — join two of them, or extend a line through the centre to where it meets the circle again. Which one of these four does only that?",
          af: "'n Wettige skuif gebruik net punte wat REEDS bestaan — verbind twee van hulle, of verleng 'n lyn deur die middelpunt na waar dit weer die sirkel ontmoet. Watter een van hierdie vier doen net dit?" },
        { en: "Extending PO through O to where it meets the circle again uses only points you already have — P, O, and the circle itself. That's always allowed, it's just a diameter. The other three all hand you something nobody has proven yet: touching the circle once, running parallel, or — worst of all — the exact result the proof is trying to reach.",
          af: "Om PO deur O te verleng na waar dit weer die sirkel ontmoet, gebruik net punte wat jy reeds het — P, O, en die sirkel self. Dit is altyd toegelaat, dis net 'n middellyn. Die ander drie gee jou almal iets wat niemand nog bewys het nie: raak die sirkel net een keer, loop ewewydig, of — die ergste van almal — presies die resultaat wat die bewys probeer bereik." },
      ],
      reason: "construction",
      note: {
        en: "Extending a radius through the centre to its second meeting with the circle uses only points that already exist — that's always legal, it's just a diameter. The other three all smuggle something in: touching the circle exactly once (a tangent), running parallel forever, or assuming the very result you're trying to prove and working backwards from it. That last one is the sneakiest, because it FEELS like a shortcut. The classroom rule says it best: \"When we assume, we make an ass out of u and me.\"",
        af: "Om 'n radius deur die middelpunt te verleng na sy tweede ontmoeting met die sirkel, gebruik net punte wat reeds bestaan — dit is altyd wettig, dis net 'n middellyn. Die ander drie smokkel almal iets in: raak die sirkel presies een keer (raaklyn), loop vir ewig ewewydig, of neem die presiese resultaat aan wat jy probeer bewys en werk agteruit daarvandaan. Daardie laaste een is die slinksste, want dit VOEL soos 'n kortpad. Die klaskamerreël sê dit die beste: \"When we assume, we make an ass out of u and me.\"",
      },
    },

    /* ---------- 7 · recap — three pictures, one set of five steps ---------- */
    {
      type: "note",
      prompt: { en: "What actually transferred", af: "Wat werklik oorgedra het" },
      diagrams: [
        { diagram: MINI_STANDARD, caption: { en: "Standard — add", af: "Standaard — tel bymekaar" } },
        { diagram: MINI_REFLEX, caption: { en: "Reflex — same sum, far angle", af: "Inspringend — dieselfde som, ver hoek" } },
        { diagram: MINI_BOWTIE, caption: { en: "Bowtie — same steps, subtract", af: "Strikdas — dieselfde stappe, trek af" } },
      ],
      note: {
        en: "The picture changed three times — a clean split, a reflex angle, two overlapping wedges — and the five steps never blinked: draw the diameter through the circumference point, label the base angles, isosceles triangles from the radii, double each with the exterior angle theorem, then add OR subtract depending on which side of the diameter everything landed. That is the whole trick of a proof round: the tool travels. The picture never has to.",
        af: "Die prentjie het drie keer verander — 'n netjiese verdeling, 'n inspringende hoek, twee oorvleuelende stukke — en die vyf stappe het nooit gehuiwer nie: trek die middellyn deur die omtrekpunt, merk die basishoeke, gelykbenige driehoeke uit die radiusse, verdubbel elkeen met die buitehoekstelling, tel dan BY of trek AF, afhangend van watter kant van die middellyn alles beland het. Dit is die hele kuns van 'n bewysrondte: die hulpmiddel reis. Die prentjie hoef nooit nie.",
      },
    },

  ],
};
