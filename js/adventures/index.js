/* ============================================================
   ADVENTURES — Grand Master bonus challenges (extra XP)
   ------------------------------------------------------------
   Two game types, both "complete the table" over a diagram:
     type:"values"  — the reason is given; learner types each angle
     type:"reasons" — the statement is given; learner picks the reason
   Each adventure rides the normal XP pipeline via its own `id`
   (api.submitRound), so no backend change is needed. They only
   appear once every group badge is earned (Circle Grand Master).

   Every diagram angle carries o.v (its true value) so the engine's
   verifyDiagram() guarantees the picture is drawn to scale. Add more
   adventures by appending to ADVENTURES — it is pure data.

   Each row: { name, value, reason }
     name   : the angle label shown (e.g. "P̂")  — language-neutral
     value  : the numeric answer in degrees
     reason : a REASONS code (see i18n.js) — the CAPS reason
   ============================================================ */
import { ACCENTS } from "../config.js";

/* D1 — angle at the centre (= 2× at circumference) + angles in the same segment.
   Chord AB. Central ∠AOB = 100° (given). Inscribed ∠APB, ∠AQB on the major arc. */
const D1 = {
  O: true,
  pts: { A: 140, B: 40, P: 250, Q: 290 },
  chords: [["O", "A"], ["O", "B"], ["A", "B"], ["A", "P"], ["B", "P"], ["A", "Q"], ["B", "Q"]],
  angles: [
    { at: "O", legs: ["A", "B"], t: "100°", o: { v: 100 } },         // given
    { at: "P", legs: ["A", "B"], t: "", o: { v: 50, ar: 20 } },      // P̂
    { at: "Q", legs: ["A", "B"], t: "", o: { v: 50, ar: 20 } },      // Q̂
  ],
};

/* D2 — cyclic quad K-L-M-N with NL a diameter. ∠K, ∠M are angles in a
   semi-circle (90°); ∠L is opposite ∠N in the cyclic quad. ∠N = 105° given. */
const D2 = {
  O: true,
  pts: { N: 210, K: 150, L: 30, M: 300 },
  chords: [["N", "K"], ["K", "L"], ["L", "M"], ["M", "N"], ["N", "L"]],
  angles: [
    { at: "N", legs: ["K", "M"], t: "105°", o: { v: 105 } },        // given
    { at: "K", legs: ["N", "L"], t: "", o: { v: 90, mark: true } }, // semicircle
    { at: "M", legs: ["N", "L"], t: "", o: { v: 90, mark: true } }, // semicircle
    { at: "L", legs: ["K", "M"], t: "", o: { v: 75 } },             // opposite ∠N
  ],
};

/* D3 — tangent-chord triangle: tangent STU at T, chords TA and TB. The two
   tan-chord angles ∠UTA and ∠STB are given; the inscribed angles equal them
   (tan-chord) and ∠ATB closes the straight line. From the verified data set. */
const D3 = {
  pts: { T: 270, A: 8, B: 156 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: [["T", "A"], ["T", "B"], ["A", "B"]],
  angles: [
    { at: "T", legs: ["tg+", "A"], t: "49°", o: { v: 49 } },   // given
    { at: "T", legs: ["tg-", "B"], t: "57°", o: { v: 57 } },   // given
    { at: "B", legs: ["T", "A"], t: "", o: { v: 49 } },        // B̂
    { at: "A", legs: ["T", "B"], t: "", o: { v: 57 } },        // Â
    { at: "T", legs: ["A", "B"], t: "", o: { v: 74 } },        // ∠ATB
  ],
};

/* D4 — tangents PT and PS from external point P (isosceles △PTS), with Q on the
   circle. Base angles by ∠s opp equal sides, the apex by ∠ sum of △, and the
   inscribed ∠TQS by tan-chord. From the verified data set. */
const D4 = {
  h: 256, cx: 160, cy: 96, R: 58,
  pts: { T: 334, S: 206, Q: 90 },
  ext: [{ name: "P", t: ["T", "S"] }],
  chords: [["T", "S"], ["Q", "T"], ["Q", "S"]],
  angles: [
    { at: "T", legs: ["P", "S"], t: "64°", o: { v: 64 } },   // given ∠PTS
    { at: "S", legs: ["P", "T"], t: "", o: { v: 64 } },       // ∠PST
    { at: "P", legs: ["T", "S"], t: "", o: { v: 52 } },       // ∠TPS
    { at: "Q", legs: ["T", "S"], t: "", o: { v: 64 } },       // ∠TQS
  ],
};

/* D5 — line from the centre ⊥ chord. OM ⊥ AB at the midpoint M; radius OA drawn.
   A right-angled triangle OMA: radius (hyp), distance OM and half-chord AM (legs).
   Length adventure (Pythagoras), so the rows are lengths, not degrees. */
const D5 = {
  O: true,
  pts: { A: 205, B: 335 },
  mid: [{ name: "M", of: ["A", "B"] }],
  chords: [["A", "B"], ["O", "M"], ["O", "A"]],
  angles: [{ at: "M", legs: ["O", "A"], t: "", o: { v: 90, mark: true } }],
};

/* D6 — angle in a semicircle. Diameter AB, P on the circle. ∠APB = 90°,
   and ∠PAB = 35° (given) fixes ∠PBA = 55° by the angle sum of the triangle. */
const D6 = {
  O: true,
  pts: { A: 180, B: 0, P: 70 },
  chords: [["A", "B"], ["A", "P"], ["B", "P"]],
  angles: [
    { at: "P", legs: ["A", "B"], t: "", o: { v: 90, mark: true } },   // semicircle
    { at: "A", legs: ["P", "B"], t: "35°", o: { v: 35 } },            // given
    { at: "B", legs: ["P", "A"], t: "", o: { v: 55 } },               // ∠PBA
  ],
};

/* D7 — equal chords AB = CD subtend equal angles at the centre (∠AOB = ∠COD).
   △OCD is isosceles (OC = OD radii), so its base angles are 50°. */
const D7 = {
  O: true,
  pts: { A: 130, B: 50, C: 300, D: 220 },
  chords: [["O", "A"], ["O", "B"], ["O", "C"], ["O", "D"], ["A", "B"], ["C", "D"]],
  angles: [
    { at: "O", legs: ["A", "B"], t: "80°", o: { v: 80 } },   // given
    { at: "O", legs: ["C", "D"], t: "", o: { v: 80 } },      // equal chords
    { at: "C", legs: ["O", "D"], t: "", o: { v: 50 } },      // isosceles base ∠
  ],
};

/* D8 — exterior angle of a cyclic quad. ABCD cyclic, BC produced to E. The
   exterior ∠DCE equals the interior opposite ∠A (100°); ∠BCD = 80° (straight line). */
const D8 = {
  pts: { A: 140, B: 50, C: 315, D: 210 },
  chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"]],
  out: [{ name: "E", along: ["B", "C"], len: 30 }],
  angles: [
    { at: "A", legs: ["D", "B"], t: "100°", o: { v: 100 } },   // given
    { at: "C", legs: ["D", "E"], t: "", o: { v: 100 } },        // exterior = opp interior
    { at: "C", legs: ["B", "D"], t: "", o: { v: 80 } },         // interior ∠BCD
  ],
};

/* D9 — tangent ⊥ radius. Tangent STU at T, radius OT, chord TA. The tangent–chord
   angle is 35°, so ∠OTA = 55° (tan ⊥ radius). △OTA is isosceles (OT = OA),
   so ∠OAT = 55° and ∠TOA = 70°. */
const D9 = {
  O: true,
  pts: { T: 270, A: 340 },
  tang: [{ at: "T" }],
  chords: [["O", "T"], ["O", "A"], ["T", "A"]],
  angles: [
    { at: "T", legs: ["tg+", "A"], t: "35°", o: { v: 35 } },   // given tangent–chord angle
    { at: "T", legs: ["O", "A"], t: "", o: { v: 55 } },         // ∠OTA = 90 − 35
    { at: "A", legs: ["O", "T"], t: "", o: { v: 55 } },         // isosceles base ∠
    { at: "O", legs: ["T", "A"], t: "", o: { v: 70 } },         // apex
  ],
};

/* D10 — SOLVE FOR x (centre). ∠AOB = 3x at the centre, ∠APB = (x+20) at the
   circumference. Centre = 2 × circumference → 3x = 2(x+20) → x = 40. */
const D10 = {
  O: true,
  pts: { A: 150, B: 30, P: 250 },
  chords: [["O", "A"], ["O", "B"], ["A", "B"], ["A", "P"], ["B", "P"]],
  angles: [
    { at: "O", legs: ["A", "B"], t: "3x", o: { v: 120 } },
    { at: "P", legs: ["A", "B"], t: "x+20", o: { v: 60 } },
  ],
};

/* D11 — SOLVE FOR x (cyclic quad). ∠A = 2x, ∠C = 80° (opposite). Opposite ∠s of a
   cyclic quad add to 180° → 2x + 80 = 180 → x = 50, so ∠A = 100°. */
const D11 = {
  pts: { A: 140, B: 50, C: 315, D: 210 },
  chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"]],
  angles: [
    { at: "A", legs: ["D", "B"], t: "2x", o: { v: 100 } },
    { at: "C", legs: ["B", "D"], t: "80°", o: { v: 80 } },
  ],
};

/* ALG_SEMI — SOLVE FOR x (semicircle). ∠APB = 90°, ∠PAB = 2x, ∠PBA = x.
   2x + x + 90 = 180 → x = 30, so ∠PAB = 60°. */
const ALG_SEMI = {
  O: true,
  pts: { A: 180, B: 0, P: 120 },
  chords: [["A", "B"], ["A", "P"], ["B", "P"]],
  angles: [
    { at: "P", legs: ["A", "B"], t: "", o: { v: 90, mark: true } },
    { at: "A", legs: ["P", "B"], t: "2x", o: { v: 60 } },
    { at: "B", legs: ["P", "A"], t: "x", o: { v: 30 } },
  ],
};

/* ALG_TC — SOLVE FOR x (tangent–chord). The tangent–chord angle = 2x and the
   angle in the alternate segment = (x + 25). tan-chord makes them equal:
   2x = x + 25 → x = 25, so both angles = 50°. */
const ALG_TC = {
  O: true,
  pts: { T: 270, B: 10, P: 160 },
  tang: [{ at: "T" }],
  chords: [["T", "B"], ["P", "T"], ["P", "B"]],
  angles: [
    { at: "T", legs: ["tg+", "B"], t: "2x", o: { v: 50 } },
    { at: "P", legs: ["T", "B"], t: "x+25", o: { v: 50 } },
  ],
};

export const ADVENTURES = [
  {
    id: "adv-centre-values", type: "values", accent: ACCENTS[3],
    title: { en: "Centre & Segment Quest", af: "Middelpunt & Segment-soeke" },
    blurb: { en: "Type each angle. The reason for each is given.", af: "Tik elke hoek. Die rede vir elkeen is gegee." },
    given: { en: "Given: the centre angle Ô = 100°.", af: "Gegee: die middelpunthoek Ô = 100°." },
    diagram: D1,
    rows: [
      { name: "P̂", value: 50, reason: "centreDouble" },
      { name: "Q̂", value: 50, reason: "sameSeg" },
    ],
  },
  {
    id: "adv-cyclic-reasons", type: "reasons", accent: ACCENTS[4],
    title: { en: "Cyclic Quad Reasons", af: "Koordevierhoek-redes" },
    blurb: { en: "Each statement is given — choose the right reason.", af: "Elke stelling is gegee — kies die regte rede." },
    given: { en: "Given: N̂ = 105°, and NL is a diameter.", af: "Gegee: N̂ = 105°, en NL is 'n middellyn." },
    diagram: D2,
    bank: ["semiCircle", "cyclicOpp", "centreDouble", "sameSeg", "cyclicExt", "isosBase"],
    rows: [
      { name: "K̂", value: 90, reason: "semiCircle" },
      { name: "M̂", value: 90, reason: "semiCircle" },
      { name: "L̂", value: 75, reason: "cyclicOpp" },
    ],
  },
  {
    id: "adv-tanchord-values", type: "values", accent: ACCENTS[2],
    title: { en: "Tangent–Chord Quest", af: "Raaklyn–Koord-soeke" },
    blurb: { en: "Type each angle. The reason for each is given.", af: "Tik elke hoek. Die rede vir elkeen is gegee." },
    given: { en: "Given: STU is a tangent at T, with ∠UTA = 49° and ∠STB = 57°.", af: "Gegee: STU is 'n raaklyn by T, met ∠UTA = 49° en ∠STB = 57°." },
    diagram: D3,
    rows: [
      { name: "B̂", value: 49, reason: "tanChord" },
      { name: "Â", value: 57, reason: "tanChord" },
      { name: "∠ATB", value: 74, reason: "straightLine" },
    ],
  },
  {
    id: "adv-centre-reasons", type: "reasons", accent: ACCENTS[1],
    title: { en: "Centre & Segment Reasons", af: "Middelpunt & Segment-redes" },
    blurb: { en: "Each statement is given — choose the right reason.", af: "Elke stelling is gegee — kies die regte rede." },
    given: { en: "Given: the centre angle Ô = 100°.", af: "Gegee: die middelpunthoek Ô = 100°." },
    diagram: D1,
    bank: ["centreDouble", "sameSeg", "semiCircle", "cyclicOpp", "isosBase", "straightLine"],
    rows: [
      { name: "P̂", value: 50, reason: "centreDouble" },
      { name: "Q̂", value: 50, reason: ["sameSeg", "centreDouble"] },   // either reason is valid
    ],
  },
  {
    id: "adv-tangentpoint-reasons", type: "reasons", accent: ACCENTS[0],
    title: { en: "Tangents-from-a-Point Reasons", af: "Raaklyne-vanuit-'n-Punt-redes" },
    blurb: { en: "Each statement is given — choose the right reason.", af: "Elke stelling is gegee — kies die regte rede." },
    given: { en: "Given: PT and PS are tangents from P, and ∠PTS = 64°.", af: "Gegee: PT en PS is raaklyne vanaf P, en ∠PTS = 64°." },
    diagram: D4,
    bank: ["isosBase", "triSum", "tanChord", "tansCommonPt", "cyclicOpp", "sameSeg"],
    rows: [
      { name: "∠PST", value: 64, reason: "isosBase" },
      { name: "∠TPS", value: 52, reason: "triSum" },
      { name: "∠TQS", value: 64, reason: "tanChord" },
    ],
  },

  /* ===== NEW: more theorems with the existing two types ===== */
  {
    id: "adv-linecentre-values", type: "values", accent: ACCENTS[3], unit: "",
    title: { en: "Line from the Centre Quest", af: "Lyn vanaf die Middelpunt-soeke" },
    blurb: { en: "Type each length. The reason for each is given.", af: "Tik elke lengte. Die rede vir elkeen is gegee." },
    given: { en: "Given: O is the centre, OM ⊥ chord AB, radius OA = 10 and OM = 6.", af: "Gegee: O is die middelpunt, OM ⊥ koord AB, radius OA = 10 en OM = 6." },
    diagram: D5,
    rows: [
      { name: "AM", value: 8, reason: "pythagoras" },
      { name: "AB", value: 16, reason: "centrePerpChord" },
    ],
  },
  {
    id: "adv-equalchords-values", type: "values", accent: ACCENTS[2],
    title: { en: "Equal Chords Quest", af: "Gelyke Koorde-soeke" },
    blurb: { en: "Type each angle. The reason for each is given.", af: "Tik elke hoek. Die rede vir elkeen is gegee." },
    given: { en: "Given: chords AB = CD, and ∠AOB = 80°.", af: "Gegee: koorde AB = CD, en ∠AOB = 80°." },
    diagram: D7,
    rows: [
      { name: "∠COD", value: 80, reason: "equalChords" },
      { name: "∠OCD", value: 50, reason: "isosBase" },
    ],
  },
  {
    id: "adv-exterior-reasons", type: "reasons", accent: ACCENTS[4],
    title: { en: "Exterior Angle Reasons", af: "Buitehoek-redes" },
    blurb: { en: "Each statement is given — choose the right reason.", af: "Elke stelling is gegee — kies die regte rede." },
    given: { en: "Given: ABCD is a cyclic quad with BC produced to E, and ∠A = 100°.", af: "Gegee: ABCD is 'n koordevierhoek met BC verleng na E, en ∠A = 100°." },
    diagram: D8,
    bank: ["cyclicExt", "straightLine", "cyclicOpp", "sameSeg", "triSum", "semiCircle"],
    rows: [
      { name: "∠DCE", value: 100, reason: "cyclicExt" },
      { name: "∠BCD", value: 80, reason: "straightLine" },
    ],
  },
  {
    id: "adv-tanradius-values", type: "values", accent: ACCENTS[1],
    title: { en: "Tangent ⊥ Radius Quest", af: "Raaklyn ⊥ Radius-soeke" },
    blurb: { en: "Type each angle. The reason for each is given.", af: "Tik elke hoek. Die rede vir elkeen is gegee." },
    given: { en: "Given: STU is a tangent at T, O is the centre, and the tangent–chord angle (between the tangent and chord TA) is 35°.", af: "Gegee: STU is 'n raaklyn by T, O is die middelpunt, en die raaklyn–koord-hoek (tussen die raaklyn en koord TA) is 35°." },
    diagram: D9,
    rows: [
      { name: "∠OTA", value: 55, reason: "tanRadius" },
      { name: "∠OAT", value: 55, reason: "isosBase" },
      { name: "∠TOA", value: 70, reason: "triSum" },
    ],
  },

  /* ===== NEW TYPE: mixed (fill BOTH the value and the reason) ===== */
  {
    id: "adv-semicircle-mixed", type: "mixed", accent: ACCENTS[2],
    title: { en: "Semicircle Boss", af: "Halfsirkel-baas" },
    blurb: { en: "Fill in BOTH the angle and its reason.", af: "Vul BEIDE die hoek en sy rede in." },
    given: { en: "Given: AB is a diameter, and ∠PAB = 35°.", af: "Gegee: AB is 'n middellyn, en ∠PAB = 35°." },
    diagram: D6,
    bank: ["semiCircle", "triSum", "sameSeg", "isosBase", "cyclicOpp", "tanChord"],
    rows: [
      { name: "∠APB", value: 90, reason: "semiCircle" },
      { name: "∠PBA", value: 55, reason: "triSum" },
    ],
  },
  {
    id: "adv-centre-mixed", type: "mixed", accent: ACCENTS[3],
    title: { en: "Centre & Segment Boss", af: "Middelpunt & Segment-baas" },
    blurb: { en: "Fill in BOTH the angle and its reason.", af: "Vul BEIDE die hoek en sy rede in." },
    given: { en: "Given: the centre angle Ô = 100°.", af: "Gegee: die middelpunthoek Ô = 100°." },
    diagram: D1,
    bank: ["centreDouble", "sameSeg", "semiCircle", "cyclicOpp", "isosBase", "equalChords"],
    rows: [
      { name: "P̂", value: 50, reason: "centreDouble" },
      { name: "Q̂", value: 50, reason: ["sameSeg", "centreDouble"] },
    ],
  },
  {
    id: "adv-tanchord-mixed", type: "mixed", accent: ACCENTS[0],
    title: { en: "Tangent–Chord Boss", af: "Raaklyn–Koord-baas" },
    blurb: { en: "Fill in BOTH the angle and its reason.", af: "Vul BEIDE die hoek en sy rede in." },
    given: { en: "Given: STU is a tangent at T, with ∠UTA = 49° and ∠STB = 57°.", af: "Gegee: STU is 'n raaklyn by T, met ∠UTA = 49° en ∠STB = 57°." },
    diagram: D3,
    bank: ["tanChord", "straightLine", "triSum", "isosBase", "sameSeg", "cyclicOpp"],
    rows: [
      { name: "B̂", value: 49, reason: "tanChord" },
      { name: "Â", value: 57, reason: "tanChord" },
      { name: "∠ATB", value: 74, reason: "straightLine" },
    ],
  },
  {
    id: "adv-cyclic-mixed", type: "mixed", accent: ACCENTS[4],
    title: { en: "Cyclic Quad Boss", af: "Koordevierhoek-baas" },
    blurb: { en: "Fill in BOTH the angle and its reason.", af: "Vul BEIDE die hoek en sy rede in." },
    given: { en: "Given: N̂ = 105°, and NL is a diameter.", af: "Gegee: N̂ = 105°, en NL is 'n middellyn." },
    diagram: D2,
    bank: ["semiCircle", "cyclicOpp", "centreDouble", "sameSeg", "cyclicExt", "isosBase"],
    rows: [
      { name: "K̂", value: 90, reason: "semiCircle" },
      { name: "M̂", value: 90, reason: "semiCircle" },
      { name: "L̂", value: 75, reason: "cyclicOpp" },
    ],
  },

  /* ===== NEW TYPE: solve for x (algebra, via the values engine) ===== */
  {
    id: "adv-algebra-centre", type: "values", accent: ACCENTS[3], unit: "",
    title: { en: "Solve for x: Centre", af: "Los op vir x: Middelpunt" },
    blurb: { en: "Make an equation from the theorem, then solve.", af: "Maak 'n vergelyking uit die stelling, los dan op." },
    given: { en: "Given: ∠AOB = 3x at the centre and ∠APB = (x + 20) at the circumference. (Hint: ∠AOB = 2 × ∠APB.)", af: "Gegee: ∠AOB = 3x by die middelpunt en ∠APB = (x + 20) by die omtrek. (Wenk: ∠AOB = 2 × ∠APB.)" },
    diagram: D10,
    rows: [
      { name: "x", value: 40, reason: "centreDouble" },
      { name: "∠APB", value: 60, reason: "centreDouble" },
    ],
  },
  {
    id: "adv-algebra-cyclic", type: "values", accent: ACCENTS[4], unit: "",
    title: { en: "Solve for x: Cyclic Quad", af: "Los op vir x: Koordevierhoek" },
    blurb: { en: "Use the cyclic-quad rule to make an equation.", af: "Gebruik die koordevierhoek-reël om 'n vergelyking te maak." },
    given: { en: "Given: ABCD is a cyclic quad with ∠A = 2x and ∠C = 80°. (Hint: opposite angles add to 180°.)", af: "Gegee: ABCD is 'n koordevierhoek met ∠A = 2x en ∠C = 80°. (Wenk: teenoorstaande hoeke tel op tot 180°.)" },
    diagram: D11,
    rows: [
      { name: "x", value: 50, reason: "cyclicOpp" },
      { name: "∠A", value: 100, reason: "cyclicOpp" },
    ],
  },

  /* ===== NEW TYPE: spot the error (tap the wrong line) ===== */
  {
    id: "adv-cyclic-spot", type: "spoterror", accent: ACCENTS[4],
    title: { en: "Spot the Error: Cyclic Quad", af: "Vind die Fout: Koordevierhoek" },
    blurb: { en: "One line of the solution is wrong — find it.", af: "Een reël van die oplossing is verkeerd — vind dit." },
    given: { en: "NL is a diameter and N̂ = 105°. A learner wrote this solution — one line is wrong:", af: "NL is 'n middellyn en N̂ = 105°. 'n Leerder het hierdie oplossing geskryf — een reël is verkeerd:" },
    diagram: D2,
    lines: [
      { s: "K̂ = 90°", r: "semiCircle" },
      { s: "M̂ = 90°", r: "semiCircle" },
      { s: "L̂ = 75°", r: "cyclicExt" },
    ],
    badLine: 2,
    fix: { en: "The value 75° is right, but the reason is wrong. L̂ and N̂ are OPPOSITE angles of the cyclic quad (they add to 180°), so the reason is “opp ∠s of cyclic quad”, not “ext ∠ of cyclic quad”.", af: "Die waarde 75° is reg, maar die rede is verkeerd. L̂ en N̂ is TEENOORSTAANDE hoeke van die koordevierhoek (hulle tel op tot 180°), dus is die rede “teenoorst. ∠e van kvh”, nie “buite∠ van kvh” nie." },
  },
  {
    id: "adv-tangentpoint-spot", type: "spoterror", accent: ACCENTS[0],
    title: { en: "Spot the Error: Tangents", af: "Vind die Fout: Raaklyne" },
    blurb: { en: "One line of the solution is wrong — find it.", af: "Een reël van die oplossing is verkeerd — vind dit." },
    given: { en: "PT and PS are tangents from P, ∠PTS = 64°, and Q lies on the circle. A learner wrote — one line is wrong:", af: "PT en PS is raaklyne vanaf P, ∠PTS = 64°, en Q lê op die sirkel. 'n Leerder het geskryf — een reël is verkeerd:" },
    diagram: D4,
    lines: [
      { s: "∠PST = 64°", r: "isosBase" },
      { s: "∠TPS = 64°", r: "triSum" },
      { s: "∠TQS = 64°", r: "tanChord" },
    ],
    badLine: 1,
    fix: { en: "∠TPS is wrong. In △PTS the three angles add to 180°, so ∠TPS = 180° − 64° − 64° = 52°, not 64°.", af: "∠TPS is verkeerd. In △PTS tel die drie hoeke op tot 180°, dus ∠TPS = 180° − 64° − 64° = 52°, nie 64°." },
  },

  /* ===== MORE solve-for-x (algebra) ===== */
  {
    id: "adv-algebra-semicircle", type: "values", accent: ACCENTS[2], unit: "",
    title: { en: "Solve for x: Semicircle", af: "Los op vir x: Halfsirkel" },
    blurb: { en: "Use the semicircle angle to make an equation.", af: "Gebruik die halfsirkel-hoek om 'n vergelyking te maak." },
    given: { en: "AB is a diameter, ∠PAB = 2x and ∠PBA = x. (Hint: the angle in a semicircle is 90°, and the angles of a triangle add to 180°.)", af: "AB is 'n middellyn, ∠PAB = 2x en ∠PBA = x. (Wenk: die hoek in 'n halfsirkel is 90°, en die hoeke van 'n driehoek tel op tot 180°.)" },
    diagram: ALG_SEMI,
    rows: [
      { name: "x", value: 30, reason: "semiCircle" },
      { name: "∠PAB", value: 60, reason: "semiCircle" },
    ],
  },
  {
    id: "adv-algebra-tanchord", type: "values", accent: ACCENTS[0], unit: "",
    title: { en: "Solve for x: Tangent–Chord", af: "Los op vir x: Raaklyn–Koord" },
    blurb: { en: "The tan-chord theorem makes two angles equal.", af: "Die raaklyn–koord-stelling maak twee hoeke gelyk." },
    given: { en: "The tangent–chord angle is 2x and the angle in the alternate segment is (x + 25). (Hint: tan-chord makes them equal.)", af: "Die raaklyn–koord-hoek is 2x en die hoek in die oorstaande segment is (x + 25). (Wenk: raaklyn–koord maak hulle gelyk.)" },
    diagram: ALG_TC,
    rows: [
      { name: "x", value: 25, reason: "tanChord" },
      { name: "∠TPB", value: 50, reason: "tanChord" },
    ],
  },

  /* ===== MORE spot-the-error ===== */
  {
    id: "adv-spot-centre", type: "spoterror", accent: ACCENTS[3],
    title: { en: "Spot the Error: Centre & Segment", af: "Vind die Fout: Middelpunt & Segment" },
    blurb: { en: "One line of the solution is wrong — find it.", af: "Een reël van die oplossing is verkeerd — vind dit." },
    given: { en: "Ô = 100° at the centre. A learner wrote — one line is wrong:", af: "Ô = 100° by die middelpunt. 'n Leerder het geskryf — een reël is verkeerd:" },
    diagram: D1,
    lines: [
      { s: "∠AOB = 100°", r: "given" },
      { s: "P̂ = 50°", r: "centreDouble" },
      { s: "Q̂ = 100°", r: "sameSeg" },
    ],
    badLine: 2,
    fix: { en: "Q̂ is wrong. P̂ and Q̂ stand on the same chord AB in the same segment, so Q̂ = P̂ = 50°, not 100°.", af: "Q̂ is verkeerd. P̂ en Q̂ staan op dieselfde koord AB in dieselfde segment, dus Q̂ = P̂ = 50°, nie 100° nie." },
  },
  {
    id: "adv-spot-semicircle", type: "spoterror", accent: ACCENTS[2],
    title: { en: "Spot the Error: Semicircle", af: "Vind die Fout: Halfsirkel" },
    blurb: { en: "One line of the solution is wrong — find it.", af: "Een reël van die oplossing is verkeerd — vind dit." },
    given: { en: "AB is a diameter and ∠PAB = 35°. A learner wrote — one line is wrong:", af: "AB is 'n middellyn en ∠PAB = 35°. 'n Leerder het geskryf — een reël is verkeerd:" },
    diagram: D6,
    lines: [
      { s: "∠APB = 90°", r: "semiCircle" },
      { s: "∠PAB = 35°", r: "given" },
      { s: "∠PBA = 55°", r: "cyclicOpp" },
    ],
    badLine: 2,
    fix: { en: "The value 55° is correct, but the reason is wrong. ∠PBA = 180° − 90° − 35° comes from the angle sum of △APB, so the reason is “int ∠s of Δ”, not “opp ∠s of cyclic quad”.", af: "Die waarde 55° is reg, maar die rede is verkeerd. ∠PBA = 180° − 90° − 35° kom van die hoeksom van △APB, dus is die rede “binne-∠e van Δ”, nie “teenoorst. ∠e van kvh” nie." },
  },

  /* ===== NEW TYPE: say it like the examiner (build the reason from pieces) =====
     Trains PRODUCTION, not just recognition: the statement is given and the
     learner assembles the CAPS reason word-for-word from fragment chips.
     Decoys are the classic wrong fragments (converses, ÷2 instead of ×2,
     “of Δ” vs “of cyclic quad”). Each row: { s, parts, decoys } — parts in
     the exact answer order; the row's chip bank = shuffled(parts + decoys). */
  {
    id: "adv-say-chord", type: "sayit", accent: ACCENTS[1],
    title: { en: "Say It Like the Examiner: Chords", af: "Sê Dit Soos die Eksaminator: Koorde" },
    blurb: { en: "You can SEE it — now write it in exam words.", af: "Jy kan dit SIEN — skryf dit nou in eksamenwoorde." },
    given: { en: "Given: O is the centre, OM ⊥ chord AB, radius OA = 10 and OM = 6.", af: "Gegee: O is die middelpunt, OM ⊥ koord AB, radius OA = 10 en OM = 6." },
    diagram: D5,
    rows: [
      { s: "∠OMA = 90°",
        parts: [{ en: "given", af: "gegee" }],
        decoys: [{ en: "construction", af: "konstruksie" }, { en: "tan ⊥ radius", af: "raaklyn ⊥ radius" }] },
      { s: "AM = MB",
        parts: [{ en: "line from centre", af: "lyn vanuit mdpt" }, { en: "⊥", af: "⊥" }, { en: "to chord", af: "op koord" }],
        decoys: [{ en: "line from midpt", af: "lyn vanuit koord" }, { en: "∥", af: "∥" }] },
      { s: "OA² = OM² + AM²",
        parts: [{ en: "Pythagoras", af: "Pythagoras" }],
        decoys: [{ en: "line from centre ⊥ to chord", af: "lyn vanuit mdpt ⊥ op koord" }, { en: "radii", af: "radii" }] },
    ],
  },
  {
    id: "adv-say-centre", type: "sayit", accent: ACCENTS[3],
    title: { en: "Say It Like the Examiner: Centre & Segment", af: "Sê Dit Soos die Eksaminator: Middelpunt & Segment" },
    blurb: { en: "You can SEE it — now write it in exam words.", af: "Jy kan dit SIEN — skryf dit nou in eksamenwoorde." },
    given: { en: "Given: the centre angle Ô = 100°.", af: "Gegee: die middelpunthoek Ô = 100°." },
    diagram: D1,
    rows: [
      { s: "P̂ = 50°",
        parts: [{ en: "∠ at centre", af: "middelpuntshoek" }, { en: "= 2 ×", af: "= 2 ×" }, { en: "∠ at circumference", af: "omtrekshoek" }],
        decoys: [{ en: "= ½ ×", af: "= ½ ×" }, { en: "∠ at midpoint", af: "koordhoek" }] },
      { s: "Q̂ = P̂",
        parts: [{ en: "∠s", af: "∠e" }, { en: "in same seg", af: "in dieselfde segment" }],
        decoys: [{ en: "on same chord", af: "op dieselfde koord" }, { en: "in opp seg", af: "in die teenoorstaande segment" }] },
      { s: "∠OAB = ∠OBA",
        parts: [{ en: "∠s opp", af: "∠e teenoor" }, { en: "equal sides", af: "gelyke sye" }],
        decoys: [{ en: "sides opp", af: "sye teenoor" }, { en: "equal ∠s", af: "gelyke ∠e" }] },
    ],
  },
  {
    id: "adv-say-tangent", type: "sayit", accent: ACCENTS[0],
    title: { en: "Say It Like the Examiner: Tangents", af: "Sê Dit Soos die Eksaminator: Raaklyne" },
    blurb: { en: "You can SEE it — now write it in exam words.", af: "Jy kan dit SIEN — skryf dit nou in eksamenwoorde." },
    given: { en: "Given: STU is a tangent at T, O is the centre, and the tangent–chord angle (between the tangent and chord TA) is 35°.", af: "Gegee: STU is 'n raaklyn by T, O is die middelpunt, en die raaklyn–koord-hoek (tussen die raaklyn en koord TA) is 35°." },
    diagram: D9,
    rows: [
      { s: "∠OTU = 90°",
        parts: [{ en: "tan", af: "raaklyn" }, { en: "⊥", af: "⊥" }, { en: "radius", af: "radius" }],
        decoys: [{ en: "∥", af: "∥" }, { en: "chord", af: "koord" }] },
      { s: "∠OAT = ∠OTA",
        parts: [{ en: "∠s opp", af: "∠e teenoor" }, { en: "equal sides", af: "gelyke sye" }],
        decoys: [{ en: "sides opp", af: "sye teenoor" }, { en: "equal ∠s", af: "gelyke ∠e" }] },
      { s: "∠TOA = 70°",
        parts: [{ en: "int ∠s", af: "binne-∠e" }, { en: "of Δ", af: "van Δ" }],
        decoys: [{ en: "ext ∠", af: "buite∠" }, { en: "of cyclic quad", af: "van kvh" }] },
    ],
  },
  {
    id: "adv-say-cyclic", type: "sayit", accent: ACCENTS[4],
    title: { en: "Say It Like the Examiner: Cyclic Quads", af: "Sê Dit Soos die Eksaminator: Koordevierhoeke" },
    blurb: { en: "You can SEE it — now write it in exam words.", af: "Jy kan dit SIEN — skryf dit nou in eksamenwoorde." },
    given: { en: "Given: ABCD is a cyclic quad with BC produced to E, and Â = 100°.", af: "Gegee: ABCD is 'n koordevierhoek met BC verleng na E, en Â = 100°." },
    diagram: D8,
    rows: [
      { s: "∠DCE = 100°",
        parts: [{ en: "ext ∠", af: "buite∠" }, { en: "of cyclic quad", af: "van kvh" }],
        decoys: [{ en: "of Δ", af: "van Δ" }, { en: "opp ∠s", af: "teenoorst. ∠e" }] },
      { s: "∠BCD = 80°",
        parts: [{ en: "∠s on", af: "∠e op" }, { en: "a str line", af: "'n reguitlyn" }],
        decoys: [{ en: "a diameter", af: "'n middellyn" }, { en: "∠s in", af: "∠e in" }] },
      { s: "Â + ∠BCD = 180°",
        parts: [{ en: "opp ∠s", af: "teenoorst. ∠e" }, { en: "of cyclic quad", af: "van kvh" }],
        decoys: [{ en: "int ∠s", af: "binne-∠e" }, { en: "of Δ", af: "van Δ" }] },
    ],
  },
];

export const ADVENTURE_BY_ID = Object.fromEntries(ADVENTURES.map(a => [a.id, a]));
