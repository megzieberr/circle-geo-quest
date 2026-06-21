/* PHASE 2 · Round (id r16) — Which theorem makes it true?
   A sketch shows a GIVEN relationship (two angles equal, a right angle,
   equal chords/tangents, supplementary angles …). The learner picks the
   theorem that justifies it. Reason-picker only — no working shown.
   `phase: 2` ties it to the Intermediate rank tier. */
const AC = "#e64980";

export const round = {
  id: "r16", n: 17, phase: 2, accent: AC,
  title: { en: "Which theorem makes it true?", af: "Watter stelling maak dit waar?" },
  blurb: { en: "Read the marked sketch, pick the theorem.", af: "Lees die gemerkte skets, kies die stelling." },
  reasonCode: null,
  questionsPerPlay: 10,
  questions: [
    { id: "r16q1", type: "reason", accent: AC,
      prompt: { en: "The two marked angles are equal. Which theorem makes them equal?", af: "Die twee gemerkte hoeke is gelyk. Watter stelling maak hulle gelyk?" },
      diagram: { pts: { T: 270, A: 40, P: 150 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["T", "A"], ["P", "T"], ["P", "A"]],
        angles: [ { at: "T", legs: ["tg+", "A"], t: "x", o: { v: 64 } }, { at: "P", legs: ["T", "A"], t: "x", o: { v: 64 } } ] },
      options: [ { code: "tanChord", correct: true }, { code: "sameSeg" }, { code: "centreDouble" }, { code: "cyclicExt" } ],
      explainReason: "tanChord" },

    { id: "r16q2", type: "reason", accent: AC,
      prompt: { en: "AB is a diameter. Which theorem gives the marked right angle at P?", af: "AB is 'n middellyn. Watter stelling gee die gemerkte regte hoek by P?" },
      diagram: { O: true, pts: { A: 180, B: 0, P: 110 }, chords: [["A", "B"], ["A", "P"], ["B", "P"]], angles: [{ at: "P", legs: ["A", "B"], t: "", o: { v: 90, mark: 1 } }] },
      options: [ { code: "semiCircle", correct: true }, { code: "tanRadius" }, { code: "centreDouble" }, { code: "cyclicOpp" } ],
      explainReason: "semiCircle" },

    { id: "r16q3", type: "reason", accent: AC,
      prompt: { en: "STU is a tangent and OT a radius. Which theorem gives the marked right angle?", af: "STU is 'n raaklyn en OT 'n radius. Watter stelling gee die gemerkte regte hoek?" },
      diagram: { O: true, pts: { T: 270 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["O", "T"]], angles: [{ at: "T", legs: ["tg+", "O"], t: "", o: { v: 90, mark: 1 } }] },
      options: [ { code: "tanRadius", correct: true }, { code: "semiCircle" }, { code: "tanChord" }, { code: "centrePerpChord" } ],
      explainReason: "tanRadius" },

    { id: "r16q4", type: "reason", accent: AC,
      prompt: { en: "The two marked angles are equal. Which theorem makes them equal?", af: "Die twee gemerkte hoeke is gelyk. Watter stelling maak hulle gelyk?" },
      diagram: { pts: { A: 200, B: 340, P: 60, Q: 120 }, chords: [["A", "B"], ["A", "P"], ["B", "P"], ["A", "Q"], ["B", "Q"]],
        angles: [ { at: "P", legs: ["A", "B"], t: "x", o: { v: 70 } }, { at: "Q", legs: ["A", "B"], t: "x", o: { v: 70 } } ] },
      options: [ { code: "sameSeg", correct: true }, { code: "tanChord" }, { code: "centreDouble" }, { code: "equalChords" } ],
      explainReason: "sameSeg" },

    { id: "r16q5", type: "reason", accent: AC,
      prompt: { en: "O is the centre. Which theorem links the centre angle (2x) and the angle at P (x)?", af: "O is die middelpunt. Watter stelling verbind die middelpunthoek (2x) en die hoek by P (x)?" },
      diagram: { O: true, pts: { A: 150, B: 30, P: 270 }, chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]],
        angles: [ { at: "O", legs: ["A", "B"], t: "2x", o: { v: 120 } }, { at: "P", legs: ["A", "B"], t: "x", o: { v: 60 } } ] },
      options: [ { code: "centreDouble", correct: true }, { code: "sameSeg" }, { code: "isosBase" }, { code: "cyclicOpp" } ],
      explainReason: "centreDouble" },

    { id: "r16q6", type: "reason", accent: AC,
      prompt: { en: "ABCD is a cyclic quad and the marked angles add to 180°. Which theorem?", af: "ABCD is 'n koordevierhoek en die gemerkte hoeke tel op tot 180°. Watter stelling?" },
      diagram: { pts: { A: 160, B: 80, C: 350, D: 240 }, chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"]],
        angles: [ { at: "B", legs: ["A", "C"], t: "x", o: { v: 95 } }, { at: "D", legs: ["C", "A"], t: "y", o: { v: 85 } } ] },
      options: [ { code: "cyclicOpp", correct: true }, { code: "cyclicExt" }, { code: "sameSeg" }, { code: "straightLine" } ],
      explainReason: "cyclicOpp" },

    { id: "r16q7", type: "reason", accent: AC,
      prompt: { en: "AB is extended to E. The exterior angle equals the marked interior angle. Which theorem?", af: "AB is verleng tot E. Die buitehoek is gelyk aan die gemerkte binnehoek. Watter stelling?" },
      diagram: { pts: { A: 165, B: 95, C: 5, D: 250 }, out: [{ name: "E", along: ["A", "B"], len: 34 }],
        chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["B", "E"]],
        angles: [ { at: "B", legs: ["E", "C"], t: "x", o: { v: 80 } }, { at: "D", legs: ["A", "C"], t: "x", o: { v: 80 } } ] },
      options: [ { code: "cyclicExt", correct: true }, { code: "cyclicOpp" }, { code: "tanChord" }, { code: "straightLine" } ],
      explainReason: "cyclicExt" },

    { id: "r16q8", type: "reason", accent: AC,
      prompt: { en: "PT and PS are tangents from P, so PT = PS. Which theorem?", af: "PT en PS is raaklyne vanaf P, dus PT = PS. Watter stelling?" },
      diagram: { h: 284, cx: 160, cy: 94, R: 58, pts: { T: 340, S: 200 }, ext: [{ name: "P", t: ["T", "S"] }], chords: [["T", "S"]] },
      options: [ { code: "tansCommonPt", correct: true }, { code: "isosBase" }, { code: "equalChords" }, { code: "tanRadius" } ],
      explainReason: "tansCommonPt" },

    { id: "r16q9", type: "reason", accent: AC,
      prompt: { en: "OM ⊥ AB (marked), so AM = MB. Which theorem makes the chord bisected?", af: "OM ⊥ AB (gemerk), dus AM = MB. Watter stelling halveer die koord?" },
      diagram: { O: true, pts: { A: 200, B: 340 }, mid: [{ name: "M", of: ["A", "B"] }], chords: [["A", "B"], ["O", "M"]],
        angles: [{ at: "M", legs: ["O", "A"], t: "", o: { v: 90, mark: 1 } }] },
      options: [ { code: "centrePerpChord", correct: true }, { code: "centreMidChord" }, { code: "tanRadius" }, { code: "pythagoras" } ],
      explainReason: "centrePerpChord" },

    { id: "r16q10", type: "reason", accent: AC,
      prompt: { en: "The two marked central angles are equal. Which theorem gives chord AB = chord CD?", af: "Die twee gemerkte middelpunthoeke is gelyk. Watter stelling gee koord AB = koord CD?" },
      diagram: { O: true, pts: { A: 165, B: 105, C: 50, D: 350 }, chords: [["A", "B"], ["C", "D"], ["O", "A"], ["O", "B"], ["O", "C"], ["O", "D"]],
        angles: [ { at: "O", legs: ["A", "B"], t: "x", o: { v: 60 } }, { at: "O", legs: ["C", "D"], t: "x", o: { v: 60 } } ] },
      options: [ { code: "equalChords", correct: true }, { code: "centreDouble" }, { code: "isosBase" }, { code: "sameSeg" } ],
      explainReason: "equalChords" },

    { id: "r16q11", type: "reason", accent: AC,
      prompt: { en: "OA and OB are radii, so the marked base angles are equal. Which theorem?", af: "OA en OB is radiusse, dus die gemerkte basishoeke is gelyk. Watter stelling?" },
      diagram: { O: true, pts: { A: 150, B: 30 }, chords: [["O", "A"], ["O", "B"], ["A", "B"]],
        angles: [ { at: "A", legs: ["O", "B"], t: "x", o: { v: 30, r: 40 } }, { at: "B", legs: ["O", "A"], t: "x", o: { v: 30, r: 40 } } ] },
      options: [ { code: "isosBase", correct: true }, { code: "equalChords" }, { code: "sameSeg" }, { code: "centreDouble" } ],
      explainReason: "isosBase" },
  ],
};
