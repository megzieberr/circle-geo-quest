/* Round 3 — Angle at the centre = 2 × angle at the circumference
   (subtended by the same arc). Includes the reflex case and a
   tap-the-centre-angle variant. */
const AC = "#0ea271";

/* Label radius in px from the angle's vertex. The engine's default pushes a
   value well out along the bisector so it clears a narrow wedge — but here
   BOTH angles (at O and at P) open along the same O–P line, so a roomy radius
   drifts the number toward the middle: "100°" floats up by the chord, "x"
   hovers next to O. These tuned radii sit each label just outside its own
   little arc, near its true vertex, widening only for the narrowest wedges so
   the digits still clear the two legs. */
function lr(v) {
  if (v <= 34) return 44;   // narrow wedge — needs room to clear the legs
  if (v <= 50) return 38;
  if (v <= 80) return 34;
  return 32;                 // wide centre angle — snug just above the arc
}

// helper: O, two points A,B on the circle, P on the far arc; radii + chords.
function D(a, b, p, oAngle, pAngle) {
  const angles = [];
  if (pAngle) angles.push({ at: "P", legs: ["A", "B"], t: pAngle.t, o: { v: pAngle.v, r: pAngle.r ?? lr(pAngle.v) } });
  if (oAngle) angles.push({ at: "O", legs: ["A", "B"], t: oAngle.t, o: { v: oAngle.v, r: oAngle.r ?? lr(oAngle.v) } });
  return { O: true, pts: { A: a, B: b, P: p }, chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]], angles };
}

/* Guiding hints — name the actual angles and the move to make, never the answer.
   A 2-rung "stuck" ladder: rung 1 states the relationship, rung 2 the operation.
   Questions in this round share the labels A, B, P, O, so a few sets cover them. */
const H = {
  // given the centre angle ∠AOB, find ∠APB at the circumference
  findCirc: [
    { en: "∠AOB at the centre is double ∠APB at the circumference — both stand on the same arc AB.",
      af: "∠AOB by die middelpunt is dubbel ∠APB by die omtrek — albei staan op dieselfde boog AB." },
    { en: "So ∠APB is half of ∠AOB. Halve the centre angle.",
      af: "Dus is ∠APB die helfte van ∠AOB. Halveer die middelpuntshoek." },
  ],
  // given ∠APB at the circumference, find the centre angle ∠AOB
  findCentre: [
    { en: "∠AOB at the centre is double ∠APB at the circumference — both stand on the same arc AB.",
      af: "∠AOB by die middelpunt is dubbel ∠APB by die omtrek — albei staan op dieselfde boog AB." },
    { en: "So ∠AOB = 2 × ∠APB. Double the circumference angle.",
      af: "Dus ∠AOB = 2 × ∠APB. Verdubbel die omtrekshoek." },
  ],
  // P on the minor arc → the matching centre angle is the REFLEX ∠AOB
  reflexFind: [
    { en: "P is on the minor arc, so the matching centre angle is the REFLEX ∠AOB — the big one round the back.",
      af: "P is op die kleiner boog, dus is die ooreenstemmende middelpuntshoek die INSPRINGENDE ∠AOB — die grote om die agterkant." },
    { en: "Reflex ∠AOB = 2 × ∠APB. Double the angle at P.",
      af: "Inspringende ∠AOB = 2 × ∠APB. Verdubbel die hoek by P." },
  ],
  // given the reflex centre angle, find ∠APB
  reflexCirc: [
    { en: "The reflex ∠AOB at the centre is still double ∠APB at the circumference.",
      af: "Die inspringende ∠AOB by die middelpunt is steeds dubbel ∠APB by die omtrek." },
    { en: "So ∠APB is half of the reflex angle. Halve it.",
      af: "Dus is ∠APB die helfte van die inspringende hoek. Halveer dit." },
  ],
  // tap the centre angle
  tapCentre: [
    { en: "The angle at the centre has its vertex at O, between the two radii OA and OB.",
      af: "Die middelpuntshoek het sy hoekpunt by O, tussen die twee radii OA en OB." },
    { en: "It stands on the same arc AB as ∠APB. Tap the angle at O.",
      af: "Dit staan op dieselfde boog AB as ∠APB. Klik op die hoek by O." },
  ],
  // yes/no: is the centre angle double the circumference angle?
  check: [
    { en: "The angle at the centre should be exactly double the angle at the circumference.",
      af: "Die middelpuntshoek moet presies dubbel die omtrekshoek wees." },
    { en: "Check: is 120° = 2 × 60°?",
      af: "Kontroleer: is 120° = 2 × 60°?" },
  ],
};

export const round = {
  id: "r3", n: 3, accent: AC,
  title: { en: "Angle at the centre", af: "Middelpuntshoek" },
  blurb: { en: "The centre angle is double the angle at the circumference.", af: "Die middelpuntshoek is dubbel die omtrekshoek." },
  reasonCode: "centreDouble",
  questionsPerPlay: 10,
  questions: [
    { id: "r3q1", type: "calc-mc", accent: AC, hints: H.findCirc,
      prompt: { en: "O is the centre. The angle at the centre ∠AOB = 100°. Find the angle at the circumference, x = ∠APB.", af: "O is die middelpunt. Die middelpuntshoek ∠AOB = 100°. Bereken die omtrekshoek, x = ∠APB." },
      diagram: D(140, 40, 270, { t: "100°", v: 100 }, { t: "x", v: 50 }),
      options: [ { text: "50°", correct: true }, { text: "200°" }, { text: "100°" }, { text: "40°" } ],
      answer: { en: "x = 100° ÷ 2 = 50°.", af: "x = 100° ÷ 2 = 50°." }, explainReason: "centreDouble" },

    { id: "r3q2", type: "calc-mc", accent: AC, hints: H.findCentre,
      prompt: { en: "O is the centre and ∠APB = 35° at the circumference. Find the angle at the centre, x = ∠AOB.", af: "O is die middelpunt en die omtrekshoek ∠APB = 35°. Bereken die middelpuntshoek, x = ∠AOB." },
      diagram: D(125, 55, 270, { t: "x", v: 70 }, { t: "35°", v: 35 }),
      options: [ { text: "70°", correct: true }, { text: "17,5°" }, { text: "35°" }, { text: "140°" } ],
      answer: { en: "x = 2 × 35° = 70°.", af: "x = 2 × 35° = 70°." }, explainReason: "centreDouble" },

    { id: "r3q3", type: "calc-mc", accent: AC, hints: H.findCirc,
      prompt: { en: "∠AOB = 88° at the centre. Find x = ∠APB.", af: "Die middelpuntshoek ∠AOB = 88°. Bereken x = ∠APB." },
      diagram: D(134, 46, 270, { t: "88°", v: 88 }, { t: "x", v: 44 }),
      options: [ { text: "44°", correct: true }, { text: "176°" }, { text: "88°" }, { text: "46°" } ],
      answer: { en: "x = 88° ÷ 2 = 44°.", af: "x = 88° ÷ 2 = 44°." }, explainReason: "centreDouble" },

    { id: "r3q4", type: "calc-mc", accent: AC, hints: H.findCentre,
      prompt: { en: "∠APB = 28° at the circumference. Find x = ∠AOB at the centre.", af: "Die omtrekshoek ∠APB = 28°. Bereken die middelpuntshoek x = ∠AOB." },
      diagram: D(148, 92, 270, { t: "x", v: 56 }, { t: "28°", v: 28 }),
      options: [ { text: "56°", correct: true }, { text: "14°" }, { text: "28°" }, { text: "62°" } ],
      answer: { en: "x = 2 × 28° = 56°.", af: "x = 2 × 28° = 56°." }, explainReason: "centreDouble" },

    // reflex case (centre angle not drawn — it would be > 180°)
    { id: "r3q5", type: "calc-mc", accent: AC, hints: H.reflexFind,
      prompt: { en: "P is on the minor arc, so ∠APB = 110° looks at the major arc. Find the REFLEX angle ∠AOB at the centre.", af: "P is op die kleiner boog, dus ∠APB = 110° kyk na die groter boog. Bereken die INSPRINGENDE middelpuntshoek ∠AOB." },
      diagram: { O: true, pts: { A: 160, B: 20, P: 90 }, chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]], angles: [{ at: "P", legs: ["A", "B"], t: "110°", o: { v: 110, r: lr(110) } }] },
      options: [ { text: "220°", correct: true }, { text: "110°" }, { text: "140°" }, { text: "55°" } ],
      answer: { en: "Reflex ∠AOB = 2 × 110° = 220°.", af: "Inspringende ∠AOB = 2 × 110° = 220°." }, explainReason: "centreDouble" },

    { id: "r3q6", type: "calc-mc", accent: AC, hints: H.reflexCirc,
      prompt: { en: "The reflex angle at the centre is 240°. Find x = ∠APB at the circumference.", af: "Die inspringende middelpuntshoek is 240°. Bereken die omtrekshoek x = ∠APB." },
      diagram: { O: true, pts: { A: 150, B: 30, P: 90 }, chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]], angles: [{ at: "P", legs: ["A", "B"], t: "x", o: { v: 120, r: lr(120) } }] },
      options: [ { text: "120°", correct: true }, { text: "480°" }, { text: "60°" }, { text: "240°" } ],
      answer: { en: "x = 240° ÷ 2 = 120°.", af: "x = 240° ÷ 2 = 120°." }, explainReason: "centreDouble" },

    // tap the centre angle
    { id: "r3q7", type: "tap", accent: AC, hints: H.tapCentre,
      prompt: { en: "∠APB (marked y) sits at the circumference. Tap the angle at the CENTRE subtended by the same arc AB.", af: "∠APB (gemerk y) is die omtrekshoek. Klik op die MIDDELPUNTSHOEK wat deur dieselfde boog AB onderspan word." },
      diagram: { O: true, pts: { A: 150, B: 30, P: 270 }, chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]],
        angles: [ { at: "P", legs: ["A", "B"], t: "y", o: { v: 60, r: lr(60) } }, { at: "O", legs: ["A", "B"], t: "", o: { v: 120 } }, { at: "A", legs: ["O", "P"], t: "", o: {} } ] },
      tap: { targets: [ { id: "centre", kind: "angle", angleIndex: 1 }, { id: "atA", kind: "angle", angleIndex: 2 } ], correctId: "centre" },
      answer: { en: "∠AOB at the centre = 2 × y.", af: "Die middelpuntshoek ∠AOB = 2 × y." }, explainReason: "centreDouble" },

    { id: "r3q8", type: "yesno", accent: AC, hints: H.check,
      prompt: { en: "∠AOB = 120° at the centre and ∠APB = 60° at the circumference, on the same arc. Is ∠AOB = 2 × ∠APB?", af: "Die middelpuntshoek ∠AOB = 120° en die omtrekshoek ∠APB = 60°, op dieselfde boog. Is ∠AOB = 2 × ∠APB?" },
      diagram: D(150, 30, 270, { t: "120°", v: 120 }, { t: "60°", v: 60 }), yes: true,
      answer: { en: "Yes — 120° = 2 × 60°.", af: "Ja — 120° = 2 × 60°." }, explainReason: "centreDouble" },

    { id: "r3q9", type: "calc-mc", accent: AC, hints: H.findCirc,
      prompt: { en: "The centre angle ∠AOB = 64°. Find x = ∠APB at the circumference.", af: "Die middelpuntshoek ∠AOB = 64°. Bereken x = ∠APB by die omtrek." },
      diagram: D(142, 78, 270, { t: "64°", v: 64 }, { t: "x", v: 32 }),
      options: [ { text: "32°", correct: true }, { text: "128°" }, { text: "64°" }, { text: "26°" } ],
      answer: { en: "x = 64° ÷ 2 = 32°.", af: "x = 64° ÷ 2 = 32°." }, explainReason: "centreDouble" },

    { id: "r3q10", type: "calc-mc", accent: AC, hints: H.findCentre,
      prompt: { en: "∠APB = 42° at the circumference. Find x = ∠AOB at the centre.", af: "Die omtrekshoek ∠APB = 42°. Bereken x = ∠AOB by die middelpunt." },
      diagram: D(152, 68, 270, { t: "x", v: 84 }, { t: "42°", v: 42 }),
      options: [ { text: "84°", correct: true }, { text: "21°" }, { text: "42°" }, { text: "168°" } ],
      answer: { en: "x = 2 × 42° = 84°.", af: "x = 2 × 42° = 84°." }, explainReason: "centreDouble" },
  ],
};
