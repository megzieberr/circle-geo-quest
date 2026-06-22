/* Tan-chord: FIND THE EQUAL ANGLE — the skill Gr 11s struggle with most.
   Given the tangent-chord angle (marked x), tap the angle INSIDE the circle that
   equals it — the angle in the alternate segment. 20 questions with VERY different
   diagrams: five verified base figures, each ROTATED to several orientations
   (tangent at top, bottom, left, diagonal…). Rotation preserves every angle, so
   all 20 are geometrically honest. Decoys are the usual traps: the other base
   angle, the same-side angle (supplement), the apex, and angles on other chords. */
const AC = "#0ea271";

// rotate a whole figure by k degrees — preserves all angles, just re-orients it
function rot(d, k) {
  const pts = {};
  for (const n in d.pts) pts[n] = (((d.pts[n] + k) % 360) + 360) % 360;
  return { ...d, pts };
}

const PROMPT = { en: "STU is a tangent at T and the tangent-chord angle x is marked. Tap the angle inside the circle that equals x (the angle in the alternate segment).",
  af: "STU is 'n raaklyn by T en die raaklyn-koord-hoek x is gemerk. Klik op die binnehoek wat gelyk is aan x (die hoek in die oorstaande segment)." };

// ---- five verified base figures (x is always angle index 0) ----
const BASES = [
  { // A: single triangle, x on tg+ side of chord TA → equals ∠B (∠ABT)
    diagram: { pts: { T: 270, A: 8, B: 156 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["T", "A"], ["T", "B"], ["A", "B"]],
      angles: [{ at: "T", legs: ["tg+", "A"], t: "x", o: { v: 49 } }, { at: "B", legs: ["T", "A"], t: "", o: { v: 49 } }, { at: "A", legs: ["T", "B"], t: "", o: { v: 57 } }, { at: "T", legs: ["A", "B"], t: "", o: { v: 74 } }] },
    targets: [{ id: "b", kind: "angle", angleIndex: 1 }, { id: "a", kind: "angle", angleIndex: 2 }, { id: "apex", kind: "angle", angleIndex: 3 }], correctId: "b",
    answer: { en: "x = ∠ABT — the angle in the alternate segment of chord TA (not the base angle at A, not the apex at T).", af: "x = ∠ABT — die hoek in die oorstaande segment van koord TA (nie die basishoek by A of die apeks by T nie)." } },

  { // B: single triangle, x on tg- side of chord TB → equals ∠A (∠TAB)
    diagram: { pts: { T: 270, A: 8, B: 156 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["T", "A"], ["T", "B"], ["A", "B"]],
      angles: [{ at: "T", legs: ["tg-", "B"], t: "x", o: { v: 57 } }, { at: "A", legs: ["T", "B"], t: "", o: { v: 57 } }, { at: "B", legs: ["T", "A"], t: "", o: { v: 49 } }, { at: "T", legs: ["A", "B"], t: "", o: { v: 74 } }] },
    targets: [{ id: "a", kind: "angle", angleIndex: 1 }, { id: "b", kind: "angle", angleIndex: 2 }, { id: "apex", kind: "angle", angleIndex: 3 }], correctId: "a",
    answer: { en: "x = ∠TAB — alternate segment of chord TB. Watch which chord the angle sits on!", af: "x = ∠TAB — oorstaande segment van koord TB. Let op op watter koord die hoek sit!" } },

  { // C: two inscribed points — P alternate (equal), Q same side (supplement, the trap)
    diagram: { pts: { T: 270, A: 38, P: 150, Q: 330 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["T", "A"], ["P", "T"], ["P", "A"], ["Q", "T"], ["Q", "A"]],
      angles: [{ at: "T", legs: ["tg+", "A"], t: "x", o: { v: 64 } }, { at: "P", legs: ["T", "A"], t: "", o: { v: 64 } }, { at: "Q", legs: ["T", "A"], t: "", o: { v: 116 } }] },
    targets: [{ id: "p", kind: "angle", angleIndex: 1 }, { id: "q", kind: "angle", angleIndex: 2 }], correctId: "p",
    answer: { en: "x = ∠TPA. P is in the alternate segment; Q is on the same side, so ∠TQA is the supplement — not equal.", af: "x = ∠TPA. P is in die oorstaande segment; Q is aan dieselfde kant, dus is ∠TQA die supplement — nie gelyk nie." } },

  { // D: two triangles meeting at Q, two chords TA and TB
    diagram: { pts: { T: 270, A: 42, B: 182, Q: 112 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["T", "A"], ["T", "B"], ["Q", "A"], ["Q", "B"], ["Q", "T"]],
      angles: [{ at: "T", legs: ["tg+", "A"], t: "x", o: { v: 66 } }, { at: "Q", legs: ["T", "A"], t: "", o: { v: 66 } }, { at: "Q", legs: ["T", "B"], t: "", o: { v: 44 } }] },
    targets: [{ id: "qa", kind: "angle", angleIndex: 1 }, { id: "qb", kind: "angle", angleIndex: 2 }], correctId: "qa",
    answer: { en: "x = ∠TQA — chord TA subtends it in the alternate segment. ∠TQB belongs to the other chord, TB.", af: "x = ∠TQA — koord TA onderspan dit in die oorstaande segment. ∠TQB hoort by die ander koord, TB." } },

  { // E: single triangle, x on tg- side of chord TB → equals ∠TAB (different shape)
    diagram: { pts: { T: 270, A: 36, B: 172 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["T", "A"], ["T", "B"], ["A", "B"]],
      angles: [{ at: "T", legs: ["tg-", "B"], t: "x", o: { v: 49 } }, { at: "A", legs: ["T", "B"], t: "", o: { v: 49 } }, { at: "B", legs: ["T", "A"], t: "", o: { v: 63 } }, { at: "T", legs: ["A", "B"], t: "", o: { v: 68 } }] },
    targets: [{ id: "a", kind: "angle", angleIndex: 1 }, { id: "b", kind: "angle", angleIndex: 2 }, { id: "apex", kind: "angle", angleIndex: 3 }], correctId: "a",
    answer: { en: "x = ∠TAB — alternate segment of chord TB (not ∠ABT, which matches the other side of the tangent).", af: "x = ∠TAB — oorstaande segment van koord TB (nie ∠ABT nie, wat by die ander kant van die raaklyn pas)." } },
];

// spin each base to 4 orientations so the tangent lands all around the circle
const SPINS = [[0, 100, 200, 300], [50, 150, 250, 350], [30, 130, 230, 330], [70, 160, 250, 340], [20, 110, 200, 290]];

const questions = [];
BASES.forEach((base, bi) => SPINS[bi].forEach((k, si) => questions.push({
  id: `r10bq${bi * 4 + si + 1}`, type: "tap", accent: AC, prompt: PROMPT,
  diagram: rot(base.diagram, k),
  tap: { targets: base.targets, correctId: base.correctId },
  answer: base.answer, explainReason: "tanChord",
})));

export const round = {
  id: "r10b", n: 11, accent: AC,
  title: { en: "Tan-chord: find the equal angle", af: "Raaklyn-koord: kry die gelyke hoek" },
  blurb: { en: "Which inside angle equals the tangent-chord angle? 20 diagrams.", af: "Watter binnehoek is gelyk aan die raaklyn-koord-hoek? 20 diagramme." },
  reasonCode: "tanChord",
  questionsPerPlay: 12,
  defaultHints: [
    { en: "The tangent-chord angle x equals the inscribed angle in the ALTERNATE segment — the one on the far side of the chord that x sits against.",
      af: "Die raaklyn-koord-hoek x is gelyk aan die omtrekshoek in die OORSTAANDE segment — die een aan die ander kant van die koord waarteen x sit." },
    { en: "First spot WHICH chord x is against (the chord from T). The equal angle is subtended by that same chord, on the other side of it — not the same-side angle (that's the supplement) or an angle on a different chord.",
      af: "Sien eers WATTER koord x teen sit (die koord vanaf T). Die gelyke hoek word deur daardie selfde koord onderspan, aan die ander kant daarvan — nie die selfde-kant-hoek nie (dis die supplement) of 'n hoek op 'n ander koord nie." },
  ],
  questions,
};
