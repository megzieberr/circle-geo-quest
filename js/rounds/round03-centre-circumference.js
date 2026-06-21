/* Round 3 — Angle at the centre = 2 × angle at the circumference
   (subtended by the same arc). Includes the reflex case and a
   tap-the-centre-angle variant. */
const AC = "#0ea271";

// helper: O, two points A,B on the circle, P on the far arc; radii + chords.
function D(a, b, p, oAngle, pAngle) {
  const angles = [];
  if (pAngle) angles.push({ at: "P", legs: ["A", "B"], t: pAngle.t, o: { v: pAngle.v, r: pAngle.r } });
  if (oAngle) angles.push({ at: "O", legs: ["A", "B"], t: oAngle.t, o: { v: oAngle.v, r: oAngle.r } });
  return { O: true, pts: { A: a, B: b, P: p }, chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]], angles };
}

export const round = {
  id: "r3", n: 3, accent: AC,
  title: { en: "Angle at the centre", af: "Middelpuntshoek" },
  blurb: { en: "The centre angle is double the angle at the circumference.", af: "Die middelpuntshoek is dubbel die omtrekshoek." },
  reasonCode: "centreDouble",
  questionsPerPlay: 10,
  questions: [
    { id: "r3q1", type: "calc-mc", accent: AC,
      prompt: { en: "O is the centre. The angle at the centre ∠AOB = 100°. Find the angle at the circumference, x = ∠APB.", af: "O is die middelpunt. Die middelpuntshoek ∠AOB = 100°. Bereken die omtrekshoek, x = ∠APB." },
      diagram: D(140, 40, 270, { t: "100°", v: 100 }, { t: "x", v: 50 }),
      options: [ { text: "50°", correct: true }, { text: "200°" }, { text: "100°" }, { text: "40°" } ],
      answer: { en: "x = 100° ÷ 2 = 50°.", af: "x = 100° ÷ 2 = 50°." }, explainReason: "centreDouble" },

    { id: "r3q2", type: "calc-mc", accent: AC,
      prompt: { en: "O is the centre and ∠APB = 35° at the circumference. Find the angle at the centre, x = ∠AOB.", af: "O is die middelpunt en die omtrekshoek ∠APB = 35°. Bereken die middelpuntshoek, x = ∠AOB." },
      diagram: D(125, 55, 270, { t: "x", v: 70 }, { t: "35°", v: 35, r: 42 }),
      options: [ { text: "70°", correct: true }, { text: "17,5°" }, { text: "35°" }, { text: "140°" } ],
      answer: { en: "x = 2 × 35° = 70°.", af: "x = 2 × 35° = 70°." }, explainReason: "centreDouble" },

    { id: "r3q3", type: "calc-mc", accent: AC,
      prompt: { en: "∠AOB = 88° at the centre. Find x = ∠APB.", af: "Die middelpuntshoek ∠AOB = 88°. Bereken x = ∠APB." },
      diagram: D(134, 46, 270, { t: "88°", v: 88 }, { t: "x", v: 44 }),
      options: [ { text: "44°", correct: true }, { text: "176°" }, { text: "88°" }, { text: "46°" } ],
      answer: { en: "x = 88° ÷ 2 = 44°.", af: "x = 88° ÷ 2 = 44°." }, explainReason: "centreDouble" },

    { id: "r3q4", type: "calc-mc", accent: AC,
      prompt: { en: "∠APB = 28° at the circumference. Find x = ∠AOB at the centre.", af: "Die omtrekshoek ∠APB = 28°. Bereken die middelpuntshoek x = ∠AOB." },
      diagram: D(148, 92, 270, { t: "x", v: 56 }, { t: "28°", v: 28 }),
      options: [ { text: "56°", correct: true }, { text: "14°" }, { text: "28°" }, { text: "62°" } ],
      answer: { en: "x = 2 × 28° = 56°.", af: "x = 2 × 28° = 56°." }, explainReason: "centreDouble" },

    // reflex case (centre angle not drawn — it would be > 180°)
    { id: "r3q5", type: "calc-mc", accent: AC,
      prompt: { en: "P is on the minor arc, so ∠APB = 110° looks at the major arc. Find the REFLEX angle ∠AOB at the centre.", af: "P is op die kleiner boog, dus ∠APB = 110° kyk na die groter boog. Bereken die INSPRINGENDE middelpuntshoek ∠AOB." },
      diagram: { O: true, pts: { A: 160, B: 20, P: 90 }, chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]], angles: [{ at: "P", legs: ["A", "B"], t: "110°", o: { v: 110 } }] },
      options: [ { text: "220°", correct: true }, { text: "110°" }, { text: "140°" }, { text: "55°" } ],
      answer: { en: "Reflex ∠AOB = 2 × 110° = 220°.", af: "Inspringende ∠AOB = 2 × 110° = 220°." }, explainReason: "centreDouble" },

    { id: "r3q6", type: "calc-mc", accent: AC,
      prompt: { en: "The reflex angle at the centre is 240°. Find x = ∠APB at the circumference.", af: "Die inspringende middelpuntshoek is 240°. Bereken die omtrekshoek x = ∠APB." },
      diagram: { O: true, pts: { A: 150, B: 30, P: 90 }, chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]], angles: [{ at: "P", legs: ["A", "B"], t: "x", o: { v: 120 } }] },
      options: [ { text: "120°", correct: true }, { text: "480°" }, { text: "60°" }, { text: "240°" } ],
      answer: { en: "x = 240° ÷ 2 = 120°.", af: "x = 240° ÷ 2 = 120°." }, explainReason: "centreDouble" },

    // tap the centre angle
    { id: "r3q7", type: "tap", accent: AC,
      prompt: { en: "∠APB (marked y) sits at the circumference. Tap the angle at the CENTRE subtended by the same arc AB.", af: "∠APB (gemerk y) is die omtrekshoek. Klik op die MIDDELPUNTSHOEK wat deur dieselfde boog AB onderspan word." },
      diagram: { O: true, pts: { A: 150, B: 30, P: 270 }, chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]],
        angles: [ { at: "P", legs: ["A", "B"], t: "y", o: { v: 60 } }, { at: "O", legs: ["A", "B"], t: "", o: { v: 120 } }, { at: "A", legs: ["O", "P"], t: "", o: {} } ] },
      tap: { targets: [ { id: "centre", kind: "angle", angleIndex: 1 }, { id: "atA", kind: "angle", angleIndex: 2 } ], correctId: "centre" },
      answer: { en: "∠AOB at the centre = 2 × y.", af: "Die middelpuntshoek ∠AOB = 2 × y." }, explainReason: "centreDouble" },

    { id: "r3q8", type: "yesno", accent: AC,
      prompt: { en: "∠AOB = 120° at the centre and ∠APB = 60° at the circumference, on the same arc. Is ∠AOB = 2 × ∠APB?", af: "Die middelpuntshoek ∠AOB = 120° en die omtrekshoek ∠APB = 60°, op dieselfde boog. Is ∠AOB = 2 × ∠APB?" },
      diagram: D(150, 30, 270, { t: "120°", v: 120 }, { t: "60°", v: 60 }), yes: true,
      answer: { en: "Yes — 120° = 2 × 60°.", af: "Ja — 120° = 2 × 60°." }, explainReason: "centreDouble" },

    { id: "r3q9", type: "calc-mc", accent: AC,
      prompt: { en: "The centre angle ∠AOB = 64°. Find x = ∠APB at the circumference.", af: "Die middelpuntshoek ∠AOB = 64°. Bereken x = ∠APB by die omtrek." },
      diagram: D(142, 78, 270, { t: "64°", v: 64 }, { t: "x", v: 32, r: 42 }),
      options: [ { text: "32°", correct: true }, { text: "128°" }, { text: "64°" }, { text: "26°" } ],
      answer: { en: "x = 64° ÷ 2 = 32°.", af: "x = 64° ÷ 2 = 32°." }, explainReason: "centreDouble" },

    { id: "r3q10", type: "calc-mc", accent: AC,
      prompt: { en: "∠APB = 42° at the circumference. Find x = ∠AOB at the centre.", af: "Die omtrekshoek ∠APB = 42°. Bereken x = ∠AOB by die middelpunt." },
      diagram: D(152, 68, 270, { t: "x", v: 84 }, { t: "42°", v: 42 }),
      options: [ { text: "84°", correct: true }, { text: "21°" }, { text: "42°" }, { text: "168°" } ],
      answer: { en: "x = 2 × 42° = 84°.", af: "x = 2 × 42° = 84°." }, explainReason: "centreDouble" },
  ],
};
