/* ============================================================
   DAILY RIDERS — the harder, exam-style Daily Challenge bank.
   ------------------------------------------------------------
   Built from a Grade 11 Core Mathematics: Geometry worksheet
   (Megan's, Jul 2026) + a few worksheet-style items authored to
   round out every reason. Two question formats:

     type "num"         → TYPE THE ANGLE only (multi-step riders).
                          The full worked chain (statement + reason
                          for every line) is revealed after answering,
                          and the hint ladder walks it one step at a
                          time. Marked all-or-nothing on the number.

     type "num-reason"  → TYPE THE ANGLE **and** PICK THE REASON
                          (single-reason items). Marked SPLIT: ½ for
                          the angle, ½ for the reason.

   `value` is the number to type. Every diagram is verified to scale
   (verifyDiagram) — points live on the circle at given degrees, so
   central angles are exact and inscribed angles follow the geometry.
   Fully labelled (A, B, C, O, …) so each reason names a real angle.
   Bilingual EN / AF. NOT in the play order (no map card, no badge).

   Every angle carries an explicit label radius `o.r` (px from the
   vertex along the bisector). This is DELIBERATE, not decorative:
   without it the engine's labelR() fallback drifts the value 64–86 px
   toward the circle's middle and reads "too far from the angle"
   (Megan's verdict, 2026-07-23). Narrow wedges take a slightly larger
   r so the digits clear the two legs; wide wedges sit tighter. Keep
   any new angle in the 33–46 band — see the [[circle-quest-diagram-labels]]
   trap. verifyDiagram measures SWEEPS, not labels, so a green run is
   NOT proof the labels read right: eyeball on verify-daily.html.
   ============================================================ */
const BLU = "#4263eb", ORG = "#f76707", PNK = "#e64980", PUR = "#9c36b5", GRN = "#0ea271";

export const round = {
  id: "dailyr", accent: PUR,
  title: { en: "Daily rider", af: "Daaglikse vraagstuk" },
  questions: [

    /* ==================== SINGLE-STEP (num-reason) ==================== */

    // ---- ∠ at centre = 2 × ∠ at circumference ----
    { id: "dr_c1", type: "num-reason", accent: BLU, value: 40,
      prompt: { en: "O is the centre and ∠AOB = 80°. Find ∠APB.", af: "O is die middelpunt en ∠AOB = 80°. Bereken ∠APB." },
      diagram: { O: true, pts: { A: 160, B: 80, P: 300 }, chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]],
        angles: [ { at: "O", legs: ["A", "B"], t: "80°", o: { v: 80, r: 37 } }, { at: "P", legs: ["A", "B"], t: "?", o: { v: 40, r: 43 } } ] },
      answer: { en: "∠APB = 80° ÷ 2 = 40°.", af: "∠APB = 80° ÷ 2 = 40°." },
      explainReason: "centreDouble",
      reasonOptions: [ { code: "centreDouble", correct: true }, { code: "isosBase" }, { code: "sameSeg" }, { code: "cyclicOpp" } ] },

    { id: "dr_c2", type: "num-reason", accent: BLU, value: 68,
      prompt: { en: "∠APB = 34° at the circumference. Find ∠AOB at the centre O.", af: "∠APB = 34° by die omtrek. Bereken ∠AOB by die middelpunt O." },
      diagram: { O: true, pts: { A: 180, B: 112, P: 300 }, chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]],
        angles: [ { at: "P", legs: ["A", "B"], t: "34°", o: { v: 34, r: 43 } }, { at: "O", legs: ["A", "B"], t: "?", o: { v: 68, r: 37 } } ] },
      answer: { en: "∠AOB = 2 × 34° = 68°.", af: "∠AOB = 2 × 34° = 68°." },
      explainReason: "centreDouble",
      reasonOptions: [ { code: "centreDouble", correct: true }, { code: "isosBase" }, { code: "semiCircle" }, { code: "sameSeg" } ] },

    { id: "dr_c3", type: "num-reason", accent: BLU, value: 70,
      prompt: { en: "O is the centre and ∠AOB = 140°. Find ∠APB.", af: "O is die middelpunt en ∠AOB = 140°. Bereken ∠APB." },
      diagram: { O: true, pts: { A: 170, B: 30, P: 270 }, chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]],
        angles: [ { at: "O", legs: ["A", "B"], t: "140°", o: { v: 140, r: 33 } }, { at: "P", legs: ["A", "B"], t: "?", o: { v: 70, r: 37 } } ] },
      answer: { en: "∠APB = 140° ÷ 2 = 70°.", af: "∠APB = 140° ÷ 2 = 70°." },
      explainReason: "centreDouble",
      reasonOptions: [ { code: "centreDouble", correct: true }, { code: "cyclicOpp" }, { code: "isosBase" }, { code: "roundPt" } ] },

    { id: "dr_c4", type: "num-reason", accent: BLU, value: 44,
      prompt: { en: "LN is a diameter and ∠TLN = 22°. Find m = ∠TON.", af: "LN is 'n middellyn en ∠TLN = 22°. Bereken m = ∠TON." },
      diagram: { O: true, pts: { L: 180, N: 0, T: 44 }, chords: [["L", "N"], ["L", "T"], ["O", "T"], ["T", "N"]],
        angles: [ { at: "L", legs: ["T", "N"], t: "22°", o: { v: 22, r: 46 } }, { at: "O", legs: ["T", "N"], t: "m", o: { v: 44, r: 43 } } ] },
      answer: { en: "∠TON and ∠TLN stand on arc TN, so m = 2 × 22° = 44°.", af: "∠TON en ∠TLN staan op boog TN, dus m = 2 × 22° = 44°." },
      explainReason: "centreDouble",
      reasonOptions: [ { code: "centreDouble", correct: true }, { code: "semiCircle" }, { code: "isosBase" }, { code: "sameSeg" } ] },

    // ---- ∠s in the same segment ----
    { id: "dr_ss1", type: "num-reason", accent: PUR, value: 47,
      prompt: { en: "P and Q are on the same side of chord AB. ∠APB = 47°. Find ∠AQB.", af: "P en Q is aan dieselfde kant van koord AB. ∠APB = 47°. Bereken ∠AQB." },
      diagram: { pts: { A: 213, B: 307, P: 60, Q: 120 }, chords: [["A", "P"], ["B", "P"], ["A", "Q"], ["B", "Q"]],
        angles: [ { at: "P", legs: ["A", "B"], t: "47°", o: { v: 47, r: 40 } }, { at: "Q", legs: ["A", "B"], t: "?", o: { v: 47, r: 40 } } ] },
      answer: { en: "∠AQB = ∠APB = 47° (same segment).", af: "∠AQB = ∠APB = 47° (dieselfde segment)." },
      explainReason: "sameSeg",
      reasonOptions: [ { code: "sameSeg", correct: true }, { code: "centreDouble" }, { code: "cyclicOpp" }, { code: "isosBase" } ] },

    { id: "dr_ss2", type: "num-reason", accent: PUR, value: 63,
      prompt: { en: "P and Q stand on chord AB on the same side. ∠APB = 63°. Find ∠AQB.", af: "P en Q staan op koord AB aan dieselfde kant. ∠APB = 63°. Bereken ∠AQB." },
      diagram: { pts: { A: 210, B: 336, P: 70, Q: 130 }, chords: [["A", "P"], ["B", "P"], ["A", "Q"], ["B", "Q"]],
        angles: [ { at: "P", legs: ["A", "B"], t: "63°", o: { v: 63, r: 37 } }, { at: "Q", legs: ["A", "B"], t: "?", o: { v: 63, r: 37 } } ] },
      answer: { en: "∠AQB = ∠APB = 63° (same segment).", af: "∠AQB = ∠APB = 63° (dieselfde segment)." },
      explainReason: "sameSeg",
      reasonOptions: [ { code: "sameSeg", correct: true }, { code: "cyclicOpp" }, { code: "centreDouble" }, { code: "triSum" } ] },

    // ---- opposite ∠s of a cyclic quad ----
    { id: "dr_co1", type: "num-reason", accent: ORG, value: 68,
      prompt: { en: "ABCD is a cyclic quad with ∠C = 112°. Find ∠A.", af: "ABCD is 'n koordevierhoek met ∠C = 112°. Bereken ∠A." },
      diagram: { pts: { A: 90, B: 350, C: 282, D: 214 }, chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"]],
        angles: [ { at: "C", legs: ["B", "D"], t: "112°", o: { v: 112, r: 35 } }, { at: "A", legs: ["B", "D"], t: "?", o: { v: 68, r: 37 } } ] },
      answer: { en: "∠A = 180° − 112° = 68°.", af: "∠A = 180° − 112° = 68°." },
      explainReason: "cyclicOpp",
      reasonOptions: [ { code: "cyclicOpp", correct: true }, { code: "cyclicExt" }, { code: "sameSeg" }, { code: "centreDouble" } ] },

    { id: "dr_co2", type: "num-reason", accent: ORG, value: 87,
      prompt: { en: "ABCD is a cyclic quad with ∠C = 93°. Find ∠A.", af: "ABCD is 'n koordevierhoek met ∠C = 93°. Bereken ∠A." },
      diagram: { pts: { A: 90, B: 0, C: 273, D: 186 }, chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"]],
        angles: [ { at: "C", legs: ["B", "D"], t: "93°", o: { v: 93, r: 35 } }, { at: "A", legs: ["B", "D"], t: "?", o: { v: 87, r: 35 } } ] },
      answer: { en: "∠A = 180° − 93° = 87°.", af: "∠A = 180° − 93° = 87°." },
      explainReason: "cyclicOpp",
      reasonOptions: [ { code: "cyclicOpp", correct: true }, { code: "cyclicExt" }, { code: "isosBase" }, { code: "sameSeg" } ] },

    { id: "dr_co3", type: "num-reason", accent: ORG, value: 80,
      prompt: { en: "ABCD is a cyclic quad with ∠C = 100°. Find ∠A.", af: "ABCD is 'n koordevierhoek met ∠C = 100°. Bereken ∠A." },
      diagram: { pts: { A: 90, B: 350, C: 270, D: 190 }, chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"]],
        angles: [ { at: "C", legs: ["B", "D"], t: "100°", o: { v: 100, r: 35 } }, { at: "A", legs: ["B", "D"], t: "?", o: { v: 80, r: 37 } } ] },
      answer: { en: "∠A = 180° − 100° = 80°.", af: "∠A = 180° − 100° = 80°." },
      explainReason: "cyclicOpp",
      reasonOptions: [ { code: "cyclicOpp", correct: true }, { code: "cyclicExt" }, { code: "roundPt" }, { code: "centreDouble" } ] },

    // ---- exterior ∠ of a cyclic quad ----
    { id: "dr_ce1", type: "num-reason", accent: ORG, value: 95,
      prompt: { en: "BC is produced to E. The interior opposite angle ∠A = 95°. Find the exterior angle ∠DCE.", af: "BC word verleng na E. Die binne-teenoorstaande hoek ∠A = 95°. Bereken die buitehoek ∠DCE." },
      diagram: { pts: { A: 90, B: 5, C: 270, D: 175 }, out: [{ name: "E", along: ["B", "C"], len: 30 }],
        chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["C", "E"]],
        angles: [ { at: "A", legs: ["D", "B"], t: "95°", o: { v: 95, r: 35 } }, { at: "C", legs: ["D", "E"], t: "?", o: { v: 95, r: 35 } } ] },
      answer: { en: "∠DCE = ∠A = 95° (exterior ∠ of a cyclic quad).", af: "∠DCE = ∠A = 95° (buitehoek van 'n koordevierhoek)." },
      explainReason: "cyclicExt",
      reasonOptions: [ { code: "cyclicExt", correct: true }, { code: "cyclicOpp" }, { code: "straightLine" }, { code: "sameSeg" } ] },

    // ---- ∠ in a semicircle ----
    { id: "dr_semi1", type: "num-reason", accent: BLU, value: 90,
      prompt: { en: "AB is a diameter and C is on the circle. Find ∠ACB.", af: "AB is 'n middellyn en C is op die sirkel. Bereken ∠ACB." },
      diagram: { O: true, pts: { A: 180, B: 0, C: 110 }, chords: [["A", "B"], ["A", "C"], ["B", "C"]],
        angles: [ { at: "C", legs: ["A", "B"], t: "?", o: { v: 90, r: 35 } } ] },
      answer: { en: "∠ACB = 90° (∠ in a semicircle).", af: "∠ACB = 90° (∠ in 'n halfsirkel)." },
      explainReason: "semiCircle",
      reasonOptions: [ { code: "semiCircle", correct: true }, { code: "centreDouble" }, { code: "isosBase" }, { code: "tanRadius" } ] },

    // ---- tangent–chord ----
    { id: "dr_tc1", type: "num-reason", accent: PNK, value: 65,
      prompt: { en: "STU is a tangent at T. The tangent-chord angle ∠UTA = 65°. Find ∠ABT.", af: "STU is 'n raaklyn by T. Die raaklyn-koord-hoek ∠UTA = 65°. Bereken ∠ABT." },
      diagram: { pts: { T: 270, A: 40, B: 170 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["T", "A"], ["T", "B"], ["A", "B"]],
        angles: [ { at: "T", legs: ["tg+", "A"], t: "65°", o: { v: 65, r: 37 } }, { at: "B", legs: ["T", "A"], t: "?", o: { v: 65, r: 37 } } ] },
      answer: { en: "∠ABT = ∠UTA = 65° (tan-chord, alternate segment).", af: "∠ABT = ∠UTA = 65° (raaklyn-koord, oorstaande segment)." },
      explainReason: "tanChord",
      reasonOptions: [ { code: "tanChord", correct: true }, { code: "tanRadius" }, { code: "sameSeg" }, { code: "isosBase" } ] },

    { id: "dr_tc2", type: "num-reason", accent: PNK, value: 58,
      prompt: { en: "STU is a tangent at T and ∠UTA = 58°. Find ∠ABT.", af: "STU is 'n raaklyn by T en ∠UTA = 58°. Bereken ∠ABT." },
      diagram: { pts: { T: 270, A: 26, B: 165 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["T", "A"], ["T", "B"], ["A", "B"]],
        angles: [ { at: "T", legs: ["tg+", "A"], t: "58°", o: { v: 58, r: 40 } }, { at: "B", legs: ["T", "A"], t: "?", o: { v: 58, r: 40 } } ] },
      answer: { en: "∠ABT = ∠UTA = 58° (tan-chord, alternate segment).", af: "∠ABT = ∠UTA = 58° (raaklyn-koord, oorstaande segment)." },
      explainReason: "tanChord",
      reasonOptions: [ { code: "tanChord", correct: true }, { code: "tanRadius" }, { code: "cyclicExt" }, { code: "sameSeg" } ] },

    // ---- tangent ⊥ radius ----
    { id: "dr_tr1", type: "num-reason", accent: PNK, value: 90,
      prompt: { en: "STU is a tangent at T and OT is a radius. Find ∠OTU.", af: "STU is 'n raaklyn by T en OT is 'n radius. Bereken ∠OTU." },
      diagram: { O: true, pts: { T: 270 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["O", "T"]],
        angles: [ { at: "T", legs: ["O", "tg+"], t: "?", o: { v: 90, r: 35 } } ] },
      answer: { en: "∠OTU = 90° (tangent ⊥ radius).", af: "∠OTU = 90° (raaklyn ⊥ radius)." },
      explainReason: "tanRadius",
      reasonOptions: [ { code: "tanRadius", correct: true }, { code: "semiCircle" }, { code: "tanChord" }, { code: "isosBase" } ] },

    // ---- exterior ∠ of a triangle ----
    { id: "dr_ext1", type: "num-reason", accent: GRN, value: 70,
      prompt: { en: "In △ABC, BC is produced to D. ∠A = 40° and ∠B = 30°. Find the exterior angle ∠ACD.", af: "In △ABC word BC verleng na D. ∠A = 40° en ∠B = 30°. Bereken die buitehoek ∠ACD." },
      diagram: { pts: { A: 90, B: 310, C: 30 }, out: [{ name: "D", along: ["B", "C"], len: 32 }],
        chords: [["A", "B"], ["B", "C"], ["A", "C"], ["C", "D"]],
        angles: [ { at: "A", legs: ["B", "C"], t: "40°", o: { v: 40, r: 43 } }, { at: "B", legs: ["A", "C"], t: "30°", o: { v: 30, r: 46 } }, { at: "C", legs: ["A", "D"], t: "?", o: { v: 70, r: 37 } } ] },
      answer: { en: "∠ACD = 40° + 30° = 70° (exterior ∠ of △).", af: "∠ACD = 40° + 30° = 70° (buitehoek van △)." },
      explainReason: "triExt",
      reasonOptions: [ { code: "triExt", correct: true }, { code: "triSum" }, { code: "cyclicExt" }, { code: "straightLine" } ] },

    { id: "dr_ext2", type: "num-reason", accent: GRN, value: 103,
      prompt: { en: "In △ABC, BC is produced to D. ∠A = 55° and ∠B = 48°. Find the exterior angle ∠ACD.", af: "In △ABC word BC verleng na D. ∠A = 55° en ∠B = 48°. Bereken die buitehoek ∠ACD." },
      diagram: { pts: { A: 90, B: 244, C: 354 }, out: [{ name: "D", along: ["B", "C"], len: 32 }],
        chords: [["A", "B"], ["B", "C"], ["A", "C"], ["C", "D"]],
        angles: [ { at: "A", legs: ["B", "C"], t: "55°", o: { v: 55, r: 40 } }, { at: "B", legs: ["A", "C"], t: "48°", o: { v: 48, r: 40 } }, { at: "C", legs: ["A", "D"], t: "?", o: { v: 103, r: 35 } } ] },
      answer: { en: "∠ACD = 55° + 48° = 103° (exterior ∠ of △).", af: "∠ACD = 55° + 48° = 103° (buitehoek van △)." },
      explainReason: "triExt",
      reasonOptions: [ { code: "triExt", correct: true }, { code: "triSum" }, { code: "cyclicExt" }, { code: "roundPt" } ] },

    // ---- ∠ sum of a triangle ----
    { id: "dr_sum1", type: "num-reason", accent: GRN, value: 70,
      prompt: { en: "In △ABC, ∠A = 50° and ∠B = 60°. Find ∠C.", af: "In △ABC is ∠A = 50° en ∠B = 60°. Bereken ∠C." },
      diagram: { pts: { A: 90, B: 230, C: 330 }, chords: [["A", "B"], ["B", "C"], ["A", "C"]],
        angles: [ { at: "A", legs: ["B", "C"], t: "50°", o: { v: 50, r: 40 } }, { at: "B", legs: ["A", "C"], t: "60°", o: { v: 60, r: 40 } }, { at: "C", legs: ["A", "B"], t: "?", o: { v: 70, r: 37 } } ] },
      answer: { en: "∠C = 180° − 50° − 60° = 70° (∠ sum of △).", af: "∠C = 180° − 50° − 60° = 70° (∠ som van △)." },
      explainReason: "triSum",
      reasonOptions: [ { code: "triSum", correct: true }, { code: "triExt" }, { code: "isosBase" }, { code: "straightLine" } ] },

    // ---- ∠s opposite equal sides (radii) ----
    { id: "dr_iso1", type: "num-reason", accent: BLU, value: 35,
      prompt: { en: "O is the centre, so OA = OB. The base angle ∠OAB = 35°. Find ∠OBA.", af: "O is die middelpunt, dus OA = OB. Die basishoek ∠OAB = 35°. Bereken ∠OBA." },
      diagram: { O: true, pts: { A: 200, B: 310 }, chords: [{ a: "O", b: "A", mk: "t1" }, { a: "O", b: "B", mk: "t1" }, ["A", "B"]],
        angles: [ { at: "A", legs: ["O", "B"], t: "35°", o: { v: 35, r: 40 } }, { at: "B", legs: ["O", "A"], t: "?", o: { v: 35, r: 40 } } ] },
      answer: { en: "∠OBA = ∠OAB = 35° (∠s opposite equal sides).", af: "∠OBA = ∠OAB = 35° (∠e teenoor gelyke sye)." },
      explainReason: "isosBase",
      reasonOptions: [ { code: "isosBase", correct: true }, { code: "centreDouble" }, { code: "triSum" }, { code: "sameSeg" } ] },

    /* ==================== MULTI-STEP (num) ==================== */

    // ---- A1: the star — base angle → apex (isosceles → ∠sum → centre) ----
    { id: "dr_m_a1", type: "num", accent: BLU, value: 40,
      prompt: { en: "O is the centre with OL = OR. The base angle ∠OLR = 50°. Find a = ∠LTR.", af: "O is die middelpunt met OL = OR. Die basishoek ∠OLR = 50°. Bereken a = ∠LTR." },
      diagram: { O: true, pts: { L: 230, R: 310, T: 90 }, chords: [{ a: "O", b: "L", mk: "t1" }, { a: "O", b: "R", mk: "t1" }, ["L", "R"], ["T", "L"], ["T", "R"]],
        angles: [ { at: "L", legs: ["O", "R"], t: "50°", o: { v: 50, r: 40 } }, { at: "T", legs: ["L", "R"], t: "a", o: { v: 40, r: 43 } } ] },
      answer: { en: "a = 40°.", af: "a = 40°." },
      solution: [
        { s: { en: "OL = OR (radii), so ∠ORL = ∠OLR = 50°", af: "OL = OR (radiusse), dus ∠ORL = ∠OLR = 50°" }, r: "isosBase" },
        { s: { en: "∠LOR = 180° − 50° − 50° = 80°", af: "∠LOR = 180° − 50° − 50° = 80°" }, r: "triSum" },
        { s: { en: "a = ∠LTR = 80° ÷ 2 = 40°", af: "a = ∠LTR = 80° ÷ 2 = 40°" }, r: "centreDouble" },
      ] },

    // ---- isosceles radii: apex → base (2 steps) ----
    { id: "dr_m_is78", type: "num", accent: BLU, value: 51,
      prompt: { en: "O is the centre, so OA = OB. ∠AOB = 78°. Find x = ∠OAB.", af: "O is die middelpunt, dus OA = OB. ∠AOB = 78°. Bereken x = ∠OAB." },
      diagram: { O: true, pts: { A: 150, B: 72 }, chords: [{ a: "O", b: "A", mk: "t1" }, { a: "O", b: "B", mk: "t1" }, ["A", "B"]],
        angles: [ { at: "O", legs: ["A", "B"], t: "78°", o: { v: 78, r: 33 } }, { at: "A", legs: ["O", "B"], t: "x", o: { v: 51, r: 33 } } ] },
      answer: { en: "x = 51°.", af: "x = 51°." },
      solution: [
        { s: { en: "OA = OB (radii), so ∠OAB = ∠OBA", af: "OA = OB (radiusse), dus ∠OAB = ∠OBA" }, r: "isosBase" },
        { s: { en: "x = (180° − 78°) ÷ 2 = 51°", af: "x = (180° − 78°) ÷ 2 = 51°" }, r: "triSum" },
      ] },

    { id: "dr_m_is108", type: "num", accent: BLU, value: 36,
      prompt: { en: "O is the centre, so OA = OB. ∠AOB = 108°. Find x = ∠OAB.", af: "O is die middelpunt, dus OA = OB. ∠AOB = 108°. Bereken x = ∠OAB." },
      diagram: { O: true, pts: { A: 154, B: 46 }, chords: [{ a: "O", b: "A", mk: "t1" }, { a: "O", b: "B", mk: "t1" }, ["A", "B"]],
        angles: [ { at: "O", legs: ["A", "B"], t: "108°", o: { v: 108, r: 34 } }, { at: "A", legs: ["O", "B"], t: "x", o: { v: 36, r: 34 } } ] },
      answer: { en: "x = 36°.", af: "x = 36°." },
      solution: [
        { s: { en: "OA = OB (radii), so ∠OAB = ∠OBA", af: "OA = OB (radiusse), dus ∠OAB = ∠OBA" }, r: "isosBase" },
        { s: { en: "x = (180° − 108°) ÷ 2 = 36°", af: "x = (180° − 108°) ÷ 2 = 36°" }, r: "triSum" },
      ] },

    { id: "dr_m_is110", type: "num", accent: BLU, value: 35,
      prompt: { en: "O is the centre, so OA = OB. ∠AOB = 110°. Find w = ∠OBA.", af: "O is die middelpunt, dus OA = OB. ∠AOB = 110°. Bereken w = ∠OBA." },
      diagram: { O: true, pts: { A: 155, B: 45 }, chords: [{ a: "O", b: "A", mk: "t1" }, { a: "O", b: "B", mk: "t1" }, ["A", "B"]],
        angles: [ { at: "O", legs: ["A", "B"], t: "110°", o: { v: 110, r: 34 } }, { at: "B", legs: ["O", "A"], t: "w", o: { v: 35, r: 34 } } ] },
      answer: { en: "w = 35°.", af: "w = 35°." },
      solution: [
        { s: { en: "OA = OB (radii), so ∠OBA = ∠OAB", af: "OA = OB (radiusse), dus ∠OBA = ∠OAB" }, r: "isosBase" },
        { s: { en: "w = (180° − 110°) ÷ 2 = 35°", af: "w = (180° − 110°) ÷ 2 = 35°" }, r: "triSum" },
      ] },

    // ---- semicircle → ∠sum (42 → 48, two sketches) ----
    { id: "dr_m_semi_a", type: "num", accent: BLU, value: 48,
      prompt: { en: "AB is a diameter and ∠ABP = 42°. Find p = ∠BAP.", af: "AB is 'n middellyn en ∠ABP = 42°. Bereken p = ∠BAP." },
      diagram: { O: true, pts: { A: 180, B: 0, P: 96 }, chords: [["A", "B"], ["A", "P"], ["B", "P"]],
        angles: [ { at: "P", legs: ["A", "B"], t: "", o: { v: 90, mark: 1 } }, { at: "B", legs: ["A", "P"], t: "42°", o: { v: 42, r: 43 } }, { at: "A", legs: ["B", "P"], t: "p", o: { v: 48, r: 40 } } ] },
      answer: { en: "p = 48°.", af: "p = 48°." },
      solution: [
        { s: { en: "∠APB = 90° (∠ in a semicircle)", af: "∠APB = 90° (∠ in 'n halfsirkel)" }, r: "semiCircle" },
        { s: { en: "p = 180° − 90° − 42° = 48°", af: "p = 180° − 90° − 42° = 48°" }, r: "triSum" },
      ] },

    { id: "dr_m_semi_b", type: "num", accent: BLU, value: 48,
      prompt: { en: "AB is a diameter and ∠BAP = 42°. Find q = ∠ABP.", af: "AB is 'n middellyn en ∠BAP = 42°. Bereken q = ∠ABP." },
      diagram: { O: true, pts: { A: 180, B: 0, P: 84 }, chords: [["A", "B"], ["A", "P"], ["B", "P"]],
        angles: [ { at: "P", legs: ["A", "B"], t: "", o: { v: 90, mark: 1 } }, { at: "A", legs: ["B", "P"], t: "42°", o: { v: 42, r: 43 } }, { at: "B", legs: ["A", "P"], t: "q", o: { v: 48, r: 40 } } ] },
      answer: { en: "q = 48°.", af: "q = 48°." },
      solution: [
        { s: { en: "∠APB = 90° (∠ in a semicircle)", af: "∠APB = 90° (∠ in 'n halfsirkel)" }, r: "semiCircle" },
        { s: { en: "q = 180° − 90° − 42° = 48°", af: "q = 180° − 90° − 42° = 48°" }, r: "triSum" },
      ] },

    // ---- ∠s round a point → centre = 2 × circumference ----
    { id: "dr_m_round92", type: "num", accent: BLU, value: 134,
      prompt: { en: "O is the centre and ∠AOB = 92°. P is on the minor arc AB. Find x = ∠APB.", af: "O is die middelpunt en ∠AOB = 92°. P is op die kleiner boog AB. Bereken x = ∠APB." },
      diagram: { O: true, pts: { A: 250, B: 342, P: 324 }, chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]],
        angles: [ { at: "O", legs: ["A", "B"], t: "92°", o: { v: 92, r: 35 } }, { at: "P", legs: ["A", "B"], t: "x", o: { v: 134, r: 35 } } ] },
      answer: { en: "x = 134°.", af: "x = 134°." },
      solution: [
        { s: { en: "Reflex ∠AOB = 360° − 92° = 268°", af: "Inspringende ∠AOB = 360° − 92° = 268°" }, r: "roundPt" },
        { s: { en: "x = 268° ÷ 2 = 134°", af: "x = 268° ÷ 2 = 134°" }, r: "centreDouble" },
      ] },

    { id: "dr_m_round150", type: "num", accent: BLU, value: 105,
      prompt: { en: "O is the centre and ∠AOB = 150°. P is on the minor arc AB. Find x = ∠APB.", af: "O is die middelpunt en ∠AOB = 150°. P is op die kleiner boog AB. Bereken x = ∠APB." },
      diagram: { O: true, pts: { A: 255, B: 45, P: 15 }, chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]],
        angles: [ { at: "O", legs: ["A", "B"], t: "150°", o: { v: 150, r: 35 } }, { at: "P", legs: ["A", "B"], t: "x", o: { v: 105, r: 35 } } ] },
      answer: { en: "x = 105°.", af: "x = 105°." },
      solution: [
        { s: { en: "Reflex ∠AOB = 360° − 150° = 210°", af: "Inspringende ∠AOB = 360° − 150° = 210°" }, r: "roundPt" },
        { s: { en: "x = 210° ÷ 2 = 105°", af: "x = 210° ÷ 2 = 105°" }, r: "centreDouble" },
      ] },

    // ---- ∠sum → tan-chord ----
    { id: "dr_m_tcs", type: "num", accent: PNK, value: 49,
      prompt: { en: "STU is a tangent at T. In △TAB, ∠TAB = 57° and ∠ATB = 74°. Find x = ∠UTA.", af: "STU is 'n raaklyn by T. In △TAB is ∠TAB = 57° en ∠ATB = 74°. Bereken x = ∠UTA." },
      diagram: { pts: { T: 270, A: 8, B: 156 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["T", "A"], ["T", "B"], ["A", "B"]],
        angles: [ { at: "T", legs: ["tg+", "A"], t: "x", o: { v: 49, r: 40 } }, { at: "A", legs: ["T", "B"], t: "57°", o: { v: 57, r: 40 } }, { at: "T", legs: ["A", "B"], t: "74°", o: { v: 74, r: 37 } } ] },
      answer: { en: "x = 49°.", af: "x = 49°." },
      solution: [
        { s: { en: "∠ABT = 180° − 57° − 74° = 49°", af: "∠ABT = 180° − 57° − 74° = 49°" }, r: "triSum" },
        { s: { en: "x = ∠UTA = ∠ABT = 49°", af: "x = ∠UTA = ∠ABT = 49°" }, r: "tanChord" },
      ] },

    // ---- two tangents → isosceles → ∠sum ----
    { id: "dr_m_2tan56", type: "num", accent: PNK, value: 62,
      prompt: { en: "PT and PS are tangents from P and ∠TPS = 56°. Find x = ∠PTS.", af: "PT en PS is raaklyne vanaf P en ∠TPS = 56°. Bereken x = ∠PTS." },
      diagram: { h: 284, cx: 160, cy: 94, R: 58, pts: { T: 340, S: 216 }, ext: [{ name: "P", t: ["T", "S"] }], chords: [["T", "S"]],
        angles: [ { at: "P", legs: ["T", "S"], t: "56°", o: { v: 56, r: 40 } }, { at: "T", legs: ["P", "S"], t: "x", o: { v: 62, r: 37 } } ] },
      answer: { en: "x = 62°.", af: "x = 62°." },
      solution: [
        { s: { en: "PT = PS (tangents from a point), so △PTS is isosceles", af: "PT = PS (raaklyne vanaf 'n punt), dus △PTS is gelykbenig" }, r: "tansCommonPt" },
        { s: { en: "x = (180° − 56°) ÷ 2 = 62°", af: "x = (180° − 56°) ÷ 2 = 62°" }, r: "isosBase" },
      ] },

    // ---- centre = 2 × circumference → isosceles ----
    { id: "dr_m_centiso", type: "num", accent: BLU, value: 50,
      prompt: { en: "O is the centre and ∠APB = 40°. OA and OB are radii. Find x = ∠OAB.", af: "O is die middelpunt en ∠APB = 40°. OA en OB is radiusse. Bereken x = ∠OAB." },
      diagram: { O: true, pts: { A: 160, B: 80, P: 300 }, chords: [{ a: "O", b: "A", mk: "t1" }, { a: "O", b: "B", mk: "t1" }, ["P", "A"], ["P", "B"], ["A", "B"]],
        angles: [ { at: "P", legs: ["A", "B"], t: "40°", o: { v: 40, r: 43 } }, { at: "A", legs: ["O", "B"], t: "x", o: { v: 50, r: 42 } } ] },
      answer: { en: "x = 50°.", af: "x = 50°." },
      solution: [
        { s: { en: "∠AOB = 2 × 40° = 80°", af: "∠AOB = 2 × 40° = 80°" }, r: "centreDouble" },
        { s: { en: "OA = OB (radii), so x = (180° − 80°) ÷ 2 = 50°", af: "OA = OB (radiusse), dus x = (180° − 80°) ÷ 2 = 50°" }, r: "isosBase" },
      ] },

    // ---- C3: two tangents + two radii → the centre angle ----
    { id: "dr_m_c3", type: "num", accent: PNK, value: 130,
      prompt: { en: "AT and AS are tangents from A with ∠TAS = 50°. OT and OS are radii. Find f = ∠TOS.", af: "AT en AS is raaklyne vanaf A met ∠TAS = 50°. OT en OS is radiusse. Bereken f = ∠TOS." },
      diagram: { h: 300, cx: 160, cy: 108, R: 62, O: true, pts: { T: 340, S: 210 }, ext: [{ name: "A", t: ["T", "S"] }], chords: [["O", "T"], ["O", "S"]],
        angles: [ { at: "A", legs: ["T", "S"], t: "50°", o: { v: 50, r: 40 } }, { at: "O", legs: ["T", "S"], t: "f", o: { v: 130, r: 33 } } ] },
      answer: { en: "f = 130°.", af: "f = 130°." },
      solution: [
        { s: { en: "OT ⊥ AT and OS ⊥ AS", af: "OT ⊥ AT en OS ⊥ AS" }, r: "tanRadius" },
        { s: { en: "f = 360° − 90° − 90° − 50° = 130° (∠s of quad OTAS)", af: "f = 360° − 90° − 90° − 50° = 130° (∠e van vierhoek OTAS)" } },
      ] },

    // ---- C6: tangent ⊥ diameter, then split the right angle ----
    { id: "dr_m_c6", type: "num", accent: PNK, value: 52,
      prompt: { en: "STU is a tangent at T and TP is a diameter. The chord TC makes ∠UTC = 38°. Find m = ∠CTP.", af: "STU is 'n raaklyn by T en TP 'n middellyn. Die koord TC maak ∠UTC = 38°. Bereken m = ∠CTP." },
      diagram: { O: true, pts: { T: 270, P: 90, C: 346 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["T", "P"], ["T", "C"]],
        angles: [ { at: "T", legs: ["tg+", "C"], t: "38°", o: { v: 38, r: 40 } }, { at: "T", legs: ["C", "P"], t: "m", o: { v: 52, r: 40 } } ] },
      answer: { en: "m = 52°.", af: "m = 52°." },
      solution: [
        { s: { en: "∠UTP = 90° (tangent ⊥ diameter)", af: "∠UTP = 90° (raaklyn ⊥ middellyn)" }, r: "tanDiameter" },
        { s: { en: "m = 90° − 38° = 52°", af: "m = 90° − 38° = 52°" } },
      ] },

  ],
};
