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
];

export const ADVENTURE_BY_ID = Object.fromEntries(ADVENTURES.map(a => [a.id, a]));
