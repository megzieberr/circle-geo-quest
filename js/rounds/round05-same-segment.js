/* Round 5 — Angles in the same segment (the bowtie).
   Angles subtended by the same chord, on the same side, are equal.
   The decoy is an angle on the OPPOSITE side (supplementary), so the
   learner must read "same side", not just "another angle on AB". */
const AC = "#9c36b5";

// chord AB; P,Q same side (equal), R opposite side (supplement).
function bow(A, B, P, Q, R, vSame, vOpp, marks) {
  const chords = [["A", "B"], ["A", "P"], ["B", "P"], ["A", "Q"], ["B", "Q"]];
  if (R != null) { chords.push(["A", "R"], ["B", "R"]); }
  const angles = [
    { at: "P", legs: ["A", "B"], t: marks.p ?? "x", o: { v: vSame } },
    { at: "Q", legs: ["A", "B"], t: marks.q ?? "", o: { v: vSame } },
  ];
  if (R != null) angles.push({ at: "R", legs: ["A", "B"], t: marks.r ?? "", o: { v: vOpp } });
  return { pts: R != null ? { A, B, P, Q, R } : { A, B, P, Q }, chords, angles };
}

export const round = {
  id: "r5", n: 5, accent: AC,
  title: { en: "Angles in the same segment", af: "Hoeke in dieselfde segment" },
  blurb: { en: "Same chord, same side ⇒ equal angles.", af: "Selfde koord, selfde kant ⇒ gelyke hoeke." },
  reasonCode: "sameSeg",
  questionsPerPlay: 10,
  defaultHints: [
    { en: "Angles standing on the same chord AB, on the SAME side, are equal. Find the other angle on the same side as the marked one.",
      af: "Hoeke wat op dieselfde koord AB, aan DIESELFDE kant staan, is gelyk. Vind die ander hoek aan dieselfde kant as die gemerkte een." },
    { en: "So ∠APB = ∠AQB (same segment). An angle on the OTHER side of AB is the supplement — it adds to 180°, not equal.",
      af: "Dus ∠APB = ∠AQB (dieselfde segment). 'n Hoek aan die ANDER kant van AB is die supplement — dit tel op tot 180°, nie gelyk nie." },
  ],
  questions: [
    { id: "r5q1", type: "tap", accent: AC,
      prompt: { en: "∠APB (marked x) and another angle stand on chord AB. Tap the angle EQUAL to x — same chord, same side.", af: "∠APB (gemerk x) en 'n ander hoek staan op koord AB. Klik op die hoek GELYK aan x — selfde koord, selfde kant." },
      diagram: bow(200, 340, 60, 120, 270, 70, 110, { p: "x" }),
      tap: { targets: [ { id: "q", kind: "angle", angleIndex: 1 }, { id: "r", kind: "angle", angleIndex: 2 } ], correctId: "q" },
      answer: { en: "∠AQB = x (same segment). The angle at R is on the other side — it is the supplement.", af: "∠AQB = x (dieselfde segment). Die hoek by R is aan die ander kant — dit is die supplement." }, explainReason: "sameSeg" },

    { id: "r5q2", type: "tap", accent: AC,
      prompt: { en: "Tap the angle equal to the marked angle x (subtended by AB on the same side).", af: "Klik op die hoek gelyk aan die gemerkte hoek x (deur AB op dieselfde kant onderspan)." },
      diagram: bow(160, 20, 250, 300, 90, 70, 110, { p: "x" }),
      tap: { targets: [ { id: "q", kind: "angle", angleIndex: 1 }, { id: "r", kind: "angle", angleIndex: 2 } ], correctId: "q" },
      answer: { en: "The equal angle is on the same side of AB.", af: "Die gelyke hoek is aan dieselfde kant van AB." }, explainReason: "sameSeg" },

    { id: "r5q3", type: "calc-mc", accent: AC,
      prompt: { en: "P and Q are on the same side of chord AB and ∠APB = 64°. Find x = ∠AQB.", af: "P en Q is aan dieselfde kant van koord AB en ∠APB = 64°. Bereken x = ∠AQB." },
      diagram: bow(206, 334, 60, 120, null, 64, null, { p: "64°", q: "x" }),
      options: [ { text: "64°", correct: true }, { text: "116°" }, { text: "32°" }, { text: "128°" } ],
      answer: { en: "x = 64° — angles in the same segment are equal.", af: "x = 64° — hoeke in dieselfde segment is gelyk." }, explainReason: "sameSeg" },

    { id: "r5q4", type: "calc-mc", accent: AC,
      prompt: { en: "∠APB = 2x and ∠AQB = 50°, in the same segment. Find x.", af: "∠APB = 2x en ∠AQB = 50°, in dieselfde segment. Bereken x." },
      diagram: bow(220, 320, 60, 120, null, 50, null, { p: "2x", q: "50°" }),
      options: [ { text: "25°", correct: true }, { text: "50°" }, { text: "100°" }, { text: "65°" } ],
      answer: { en: "2x = 50°, so x = 25°.", af: "2x = 50°, dus x = 25°." }, explainReason: "sameSeg" },

    { id: "r5q5", type: "yesno", accent: AC,
      prompt: { en: "P and Q are on the SAME side of chord AB. Is ∠APB = ∠AQB?", af: "P en Q is aan DIESELFDE kant van koord AB. Is ∠APB = ∠AQB?" },
      diagram: bow(200, 340, 60, 120, null, 70, null, { p: "", q: "" }), yes: true,
      answer: { en: "Yes — same segment, equal angles.", af: "Ja — dieselfde segment, gelyke hoeke." }, explainReason: "sameSeg" },

    { id: "r5q6", type: "yesno", accent: AC,
      prompt: { en: "P and R are on OPPOSITE sides of chord AB. Is ∠APB = ∠ARB?", af: "P en R is aan TEENOORGESTELDE kante van koord AB. Is ∠APB = ∠ARB?" },
      diagram: { pts: { A: 200, B: 340, P: 90, R: 270 }, chords: [["A", "B"], ["A", "P"], ["B", "P"], ["A", "R"], ["B", "R"]],
        angles: [ { at: "P", legs: ["A", "B"], t: "", o: { v: 70 } }, { at: "R", legs: ["A", "B"], t: "", o: { v: 110 } } ] },
      yes: false,
      answer: { en: "No — opposite sides give supplementary angles (they add to 180°).", af: "Nee — teenoorgestelde kante gee supplementêre hoeke (die som is 180°)." }, explainReason: "cyclicOpp" },

    { id: "r5q7", type: "reason", accent: AC,
      prompt: { en: "∠APB = ∠AQB because P and Q both stand on chord AB on the same side. Which reason?", af: "∠APB = ∠AQB omdat P en Q albei op koord AB aan dieselfde kant staan. Watter rede?" },
      diagram: bow(200, 340, 60, 120, null, 70, null, { p: "", q: "" }),
      options: [ { code: "sameSeg", correct: true }, { code: "centreDouble" }, { code: "cyclicOpp" }, { code: "equalChords" } ],
      answer: { en: "Angles in the same segment are equal.", af: "Hoeke in dieselfde segment is gelyk." }, explainReason: "sameSeg" },

    { id: "r5q8", type: "tap", accent: AC,
      prompt: { en: "Tap the angle equal to the marked angle x.", af: "Klik op die hoek gelyk aan die gemerkte hoek x." },
      diagram: bow(210, 330, 90, 40, 270, 60, 120, { p: "x" }),
      tap: { targets: [ { id: "q", kind: "angle", angleIndex: 1 }, { id: "r", kind: "angle", angleIndex: 2 } ], correctId: "q" },
      answer: { en: "∠AQB = x — same chord AB, same side.", af: "∠AQB = x — selfde koord AB, selfde kant." }, explainReason: "sameSeg" },

    { id: "r5q9", type: "tap", accent: AC,
      prompt: { en: "Tap the angle equal to the marked angle x (same chord, same side).", af: "Klik op die hoek gelyk aan die gemerkte hoek x (selfde koord, selfde kant)." },
      diagram: bow(216, 324, 60, 120, 270, 54, 126, { p: "x" }),
      tap: { targets: [ { id: "q", kind: "angle", angleIndex: 1 }, { id: "r", kind: "angle", angleIndex: 2 } ], correctId: "q" },
      answer: { en: "∠AQB = x. The angle at R is on the other side — the supplement.", af: "∠AQB = x. Die hoek by R is aan die ander kant — die supplement." }, explainReason: "sameSeg" },

    { id: "r5q10", type: "calc-mc", accent: AC,
      prompt: { en: "P and Q are on the same side of chord AB and ∠APB = 72°. Find x = ∠AQB.", af: "P en Q is aan dieselfde kant van koord AB en ∠APB = 72°. Bereken x = ∠AQB." },
      diagram: bow(198, 342, 60, 120, null, 72, null, { p: "72°", q: "x" }),
      options: [ { text: "72°", correct: true }, { text: "108°" }, { text: "36°" }, { text: "144°" } ],
      answer: { en: "x = 72° — angles in the same segment are equal.", af: "x = 72° — hoeke in dieselfde segment is gelyk." }, explainReason: "sameSeg" },
  ],
};
