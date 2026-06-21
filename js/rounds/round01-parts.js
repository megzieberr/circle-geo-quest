/* Round 1 — Parts of a circle (warm-up, no reasons).
   Tap-on-diagram + "what is this part?" vocabulary MC. */
const AC = "#e64980";

// One circle carrying a chord, a radius, a diameter and a tangent —
// reused so each "tap the …" question has real decoys to choose from.
const LINES = {
  O: true,
  pts: { C1: 140, C2: 65, R1: 235, D1: 0, D2: 180, T1: 305 },
  tang: [{ at: "T1", len: 64 }],
  chords: [["C1", "C2"], ["O", "R1"], ["D1", "D2"]],
};
const LINE_TARGETS = [
  { id: "chord", kind: "chord", a: "C1", b: "C2" },
  { id: "radius", kind: "radius", from: "O", to: "R1" },
  { id: "diameter", kind: "diameter", a: "D1", b: "D2" },
  { id: "tangent", kind: "tangentLine", at: "T1" },
];

export const round = {
  id: "r1", n: 1, accent: AC,
  title: { en: "Parts of a circle", af: "Dele van 'n sirkel" },
  blurb: { en: "Warm-up: name every part of the circle.", af: "Opwarming: benoem elke deel van die sirkel." },
  reasonCode: null,
  questionsPerPlay: 10,
  questions: [
    { id: "r1q1", type: "tap", accent: AC, prompt: { en: "Tap the chord.", af: "Klik op die koord." },
      diagram: LINES, tap: { targets: LINE_TARGETS, correctId: "chord" },
      answer: { en: "A chord joins two points on the circle.", af: "’n Koord is 'n lyn wat twee punte op die omtrek verbind sonder om deur die middel te gaan." } },

    { id: "r1q2", type: "tap", accent: AC, prompt: { en: "Tap a radius.", af: "Klik op 'n radius." },
      diagram: LINES, tap: { targets: LINE_TARGETS, correctId: "radius" },
      answer: { en: "A radius runs from the centre O to the circle.", af: "’n Radius is die lyn vanaf die middelpunt na die omtrek." } },

    { id: "r1q3", type: "tap", accent: AC, prompt: { en: "Tap the diameter.", af: "Klik op die middellyn." },
      diagram: LINES, tap: { targets: LINE_TARGETS, correctId: "diameter" },
      answer: { en: "A diameter is a chord through the centre.", af: "’n Middellyn is die afstand oor die sirkel deur die middelpunt." } },

    { id: "r1q4", type: "tap", accent: AC, prompt: { en: "Tap the tangent.", af: "Klik op die raaklyn." },
      diagram: LINES, tap: { targets: LINE_TARGETS, correctId: "tangent" },
      answer: { en: "A tangent touches the circle at exactly one point.", af: "’n Raaklyn raak die sirkel by presies een punt." } },

    { id: "r1q5", type: "tap", accent: AC, prompt: { en: "Tap the centre.", af: "Klik op die middelpunt." },
      diagram: { O: true, pts: { A: 60, B: 175, C: 300 } },
      tap: { targets: [ { id: "centre", kind: "centre" }, { id: "a", kind: "point", p: "A" }, { id: "b", kind: "point", p: "B" }, { id: "c", kind: "point", p: "C" } ], correctId: "centre" },
      answer: { en: "O is the centre — every radius starts here.", af: "O is die middelpunt — die punt in die middel van die sirkel." } },

    { id: "r1q6", type: "tap", accent: AC, prompt: { en: "Tap the circumference (the edge).", af: "Klik op die omtrek (die rand)." },
      diagram: { O: true, pts: { A: 150, B: 30 }, chords: [["A", "B"]] },
      tap: { targets: [ { id: "circ", kind: "circumference" }, { id: "centre", kind: "centre" }, { id: "chord", kind: "chord", a: "A", b: "B" } ], correctId: "circ" },
      answer: { en: "The circumference is the curved edge — the distance once around.", af: "Die omtrek is die buiterand van die sirkel." } },

    { id: "r1q7", type: "tap", accent: AC, prompt: { en: "Tap the arc between A and B (the top edge).", af: "Klik op die boog tussen A en B (die boonste rand)." },
      diagram: { O: true, pts: { A: 150, B: 30 }, chords: [["A", "B"]] },
      tap: { targets: [ { id: "arc", kind: "arc", from: 30, to: 150 }, { id: "chord", kind: "chord", a: "A", b: "B" }, { id: "centre", kind: "centre" } ], correctId: "arc" },
      answer: { en: "An arc is part of the circumference between two points.", af: "’n Boog is 'n deel van die omtrek." } },

    { id: "r1q8", type: "tap", accent: AC, prompt: { en: "Tap the sector (the pie slice between the two radii).", af: "Klik op die sektor (die koekstuk tussen die twee radiusse)." },
      diagram: { O: true, pts: { A: 58, B: 140 }, chords: [["O", "A"], ["O", "B"]] },
      tap: { targets: [ { id: "sector", kind: "sector", from: 58, to: 140 }, { id: "arc", kind: "arc", from: 58, to: 140 }, { id: "centre", kind: "centre" } ], correctId: "sector" },
      answer: { en: "A sector is bounded by two radii and an arc.", af: "’n Sektor is 'n gedeelte van 'n sirkel tussen twee radiusse." } },

    { id: "r1q9", type: "tap", accent: AC, prompt: { en: "Tap the segment (the region between the chord and the arc).", af: "Klik op die segment (die gebied tussen die koord en die boog)." },
      diagram: { O: true, pts: { A: 158, B: 22 }, chords: [["A", "B"]] },
      tap: { targets: [ { id: "seg", kind: "segment", from: 22, to: 158 }, { id: "centre", kind: "centre" }, { id: "pa", kind: "point", p: "A" } ], correctId: "seg" },
      answer: { en: "A segment is cut off by a chord — between the chord and the arc.", af: "’n Segment is die gedeelte tussen 'n koord en die omtrek van die sirkel." } },

    // vocabulary MC
    { id: "r1q10", type: "mc", accent: AC, prompt: { en: "Line AB joins two points on the circle but does not pass through O. What is AB?", af: "Lyn AB verbind twee punte op die sirkel maar gaan nie deur O nie. Wat is AB?" },
      diagram: { O: true, pts: { A: 156, B: 33 }, chords: [["A", "B"]] },
      options: [ { text: { en: "Chord", af: "Koord" }, correct: true }, { text: { en: "Diameter", af: "Middellyn" } }, { text: { en: "Radius", af: "Radius" } }, { text: { en: "Tangent", af: "Raaklyn" } } ],
      answer: { en: "Chord.", af: "Koord." } },

    { id: "r1q11", type: "mc", accent: AC, prompt: { en: "AB passes straight through the centre O. What is the best name for AB?", af: "AB gaan reguit deur die middelpunt O. Wat is die beste naam vir AB?" },
      diagram: { O: true, pts: { A: 200, B: 20 }, chords: [["A", "B"]] },
      options: [ { text: { en: "Diameter", af: "Middellyn" }, correct: true }, { text: { en: "Chord", af: "Koord" } }, { text: { en: "Radius", af: "Radius" } }, { text: { en: "Arc", af: "Boog" } } ],
      answer: { en: "Diameter — a chord through the centre.", af: "Middellyn — dit gaan deur die middelpunt." } },

    { id: "r1q12", type: "mc", accent: AC, prompt: { en: "What do we call the curved part of the circle between two points?", af: "Wat noem ons die geboë deel van die sirkel tussen twee punte?" },
      options: [ { text: { en: "Arc", af: "Boog" }, correct: true }, { text: { en: "Chord", af: "Koord" } }, { text: { en: "Segment", af: "Segment" } }, { text: { en: "Sector", af: "Sektor" } } ],
      answer: { en: "Arc.", af: "Boog." } },

    { id: "r1q13", type: "mc", accent: AC, prompt: { en: "A straight line touches the circle at exactly one point. What is it?", af: "’n Reguitlyn raak die sirkel by presies een punt. Wat is dit?" },
      diagram: { O: true, pts: { T: 270 }, tang: [{ at: "T", len: 84 }] },
      options: [ { text: { en: "Tangent", af: "Raaklyn" }, correct: true }, { text: { en: "Chord", af: "Koord" } }, { text: { en: "Diameter", af: "Middellyn" } }, { text: { en: "Radius", af: "Radius" } } ],
      answer: { en: "Tangent.", af: "Raaklyn." } },
  ],
};
