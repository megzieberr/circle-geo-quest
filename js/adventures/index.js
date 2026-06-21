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
    id: "adv-cyclic-values", type: "values", accent: ACCENTS[2],
    title: { en: "Diameter & Quad Quest", af: "Middellyn & Vierhoek-soeke" },
    blurb: { en: "Type each angle. The reason for each is given.", af: "Tik elke hoek. Die rede vir elkeen is gegee." },
    given: { en: "Given: N̂ = 105°, and NL is a diameter.", af: "Gegee: N̂ = 105°, en NL is 'n middellyn." },
    diagram: D2,
    rows: [
      { name: "K̂", value: 90, reason: "semiCircle" },
      { name: "M̂", value: 90, reason: "semiCircle" },
      { name: "L̂", value: 75, reason: "cyclicOpp" },
    ],
  },
  {
    id: "adv-centre-reasons", type: "reasons", accent: ACCENTS[0],
    title: { en: "Centre & Segment Reasons", af: "Middelpunt & Segment-redes" },
    blurb: { en: "Each statement is given — choose the right reason.", af: "Elke stelling is gegee — kies die regte rede." },
    given: { en: "Given: the centre angle Ô = 100°.", af: "Gegee: die middelpunthoek Ô = 100°." },
    diagram: D1,
    bank: ["centreDouble", "sameSeg", "semiCircle", "cyclicOpp", "isosBase", "straightLine"],
    rows: [
      { name: "P̂", value: 50, reason: "centreDouble" },
      { name: "Q̂", value: 50, reason: "sameSeg" },
    ],
  },
];

export const ADVENTURE_BY_ID = Object.fromEntries(ADVENTURES.map(a => [a.id, a]));
