/* Round 2 — Line from centre to a chord.
   Drills the difference between what is GIVEN and what is CONCLUDED:
     • given ⊥  -> conclude bisects   (line from centre ⊥ to chord)
     • given midpoint -> conclude ⊥   (line from centre to midpt of chord)
   Plus Pythagoras length questions as multiple choice. */
const AC = "#f76707";

// chord AB low across the circle, M its midpoint, OM drawn from the centre.
const D_PERP = { O: true, pts: { A: 200, B: 340 }, mid: [{ name: "M", of: ["A", "B"] }],
  chords: [["A", "B"], ["O", "M"]], angles: [{ at: "M", legs: ["O", "A"], t: "", o: { v: 90, mark: 1 } }] };
const D_MID = { O: true, pts: { A: 200, B: 340 }, mid: [{ name: "M", of: ["A", "B"] }],
  chords: [["A", "B"], ["O", "M"]] };

export const round = {
  id: "r2", n: 2, accent: AC,
  title: { en: "Line from the centre to a chord", af: "Lyn van die middelpunt na 'n koord" },
  blurb: { en: "Perpendicular ↔ midpoint, and Pythagoras on the half-chord.", af: "Loodreg ↔ middelpunt, en Pythagoras op die halfkoord." },
  reasonCode: "centrePerpChord",
  questionsPerPlay: 10,
  questions: [
    { id: "r2q1", type: "reason", accent: AC,
      prompt: { en: "OM is drawn from centre O to chord AB, and OM ⊥ AB (given). Which reason lets you conclude AM = MB?", af: "OM is van middelpunt O na koord AB geteken, en OM ⊥ AB (gegee). Watter rede laat jou aflei dat AM = MB?" },
      diagram: D_PERP,
      options: [ { code: "centrePerpChord", correct: true }, { code: "centreMidChord" }, { code: "tanRadius" }, { code: "sameSeg" } ],
      answer: { en: "The ⊥ from the centre bisects the chord, so AM = MB.", af: "Die loodlyn vanaf die middelpunt halveer die koord, dus AM = MB." },
      explainReason: "centrePerpChord" },

    { id: "r2q2", type: "reason", accent: AC,
      prompt: { en: "M is the midpoint of chord AB (AM = MB, given) and OM is drawn. Which reason lets you conclude OM ⊥ AB?", af: "M is die middelpunt van koord AB (AM = MB, gegee) en OM is geteken. Watter rede laat jou aflei dat OM ⊥ AB?" },
      diagram: D_MID,
      options: [ { code: "centreMidChord", correct: true }, { code: "centrePerpChord" }, { code: "tanRadius" }, { code: "isosBase" } ],
      answer: { en: "The line from the centre to the midpoint of a chord is ⊥ to it.", af: "Die lyn van die middelpunt na die middelpunt van 'n koord is ⊥ daarop." },
      explainReason: "centreMidChord" },

    { id: "r2q3", type: "yesno", accent: AC,
      prompt: { en: "OM ⊥ AB and O is the centre. Does it follow that AM = MB?", af: "OM ⊥ AB en O is die middelpunt. Volg dit dat AM = MB?" },
      diagram: D_PERP, yes: true,
      answer: { en: "Yes — the perpendicular from the centre bisects the chord.", af: "Ja — die loodlyn vanaf die middelpunt halveer die koord." },
      explainReason: "centrePerpChord" },

    { id: "r2q4", type: "calc-mc", accent: AC,
      prompt: { en: "O is the centre and OM ⊥ AB. If OA = 5 and OM = 3, find the length of AB.", af: "O is die middelpunt en OM ⊥ AB. As OA = 5 en OM = 3, bereken die lengte van AB." },
      diagram: D_PERP,
      options: [ { text: "8", correct: true }, { text: "4" }, { text: "6" }, { text: "10" } ],
      answer: { en: "AM = √(5² − 3²) = 4, so AB = 2 × 4 = 8.", af: "AM = √(5² − 3²) = 4, dus AB = 2 × 4 = 8." },
      explainReason: "pythagoras" },

    { id: "r2q5", type: "calc-mc", accent: AC,
      prompt: { en: "OM ⊥ AB. If the radius OA = 13 and OM = 5, find AB.", af: "OM ⊥ AB. As die radius OA = 13 en OM = 5, bereken AB." },
      diagram: D_PERP,
      options: [ { text: "24", correct: true }, { text: "12" }, { text: "26" }, { text: "18" } ],
      answer: { en: "AM = √(13² − 5²) = 12, so AB = 24.", af: "AM = √(13² − 5²) = 12, dus AB = 24." },
      explainReason: "pythagoras" },

    { id: "r2q6", type: "calc-mc", accent: AC,
      prompt: { en: "OM ⊥ AB, radius OA = 10 and OM = 8. Find AB.", af: "OM ⊥ AB, radius OA = 10 en OM = 8. Bereken AB." },
      diagram: D_PERP,
      options: [ { text: "12", correct: true }, { text: "6" }, { text: "16" }, { text: "9" } ],
      answer: { en: "AM = √(10² − 8²) = 6, so AB = 12.", af: "AM = √(10² − 8²) = 6, dus AB = 12." },
      explainReason: "pythagoras" },

    { id: "r2q7", type: "calc-mc", accent: AC,
      prompt: { en: "OM ⊥ AB. The radius is 5 and the chord AB = 8. How far is the chord from the centre (OM)?", af: "OM ⊥ AB. Die radius is 5 en die koord AB = 8. Hoe ver is die koord van die middelpunt (OM)?" },
      diagram: D_PERP,
      options: [ { text: "3", correct: true }, { text: "4" }, { text: "6" }, { text: "5" } ],
      answer: { en: "Half-chord = 4, so OM = √(5² − 4²) = 3.", af: "Halfkoord = 4, dus OM = √(5² − 4²) = 3." },
      explainReason: "pythagoras" },

    { id: "r2q8", type: "calc-mc", accent: AC,
      prompt: { en: "OM ⊥ AB, radius OA = 17 and OM = 15. Find AB.", af: "OM ⊥ AB, radius OA = 17 en OM = 15. Bereken AB." },
      diagram: D_PERP,
      options: [ { text: "16", correct: true }, { text: "8" }, { text: "30" }, { text: "15" } ],
      answer: { en: "AM = √(17² − 15²) = 8, so AB = 16.", af: "AM = √(17² − 15²) = 8, dus AB = 16." },
      explainReason: "pythagoras" },

    { id: "r2q9", type: "reason", accent: AC,
      prompt: { en: "Which statement is the CONCLUSION when you are GIVEN that OM passes through the midpoint of chord AB?", af: "Watter stelling is die GEVOLGTREKKING wanneer dit GEGEE is dat OM deur die middelpunt van koord AB gaan?" },
      diagram: D_MID,
      options: [ { code: "centreMidChord", correct: true }, { code: "centrePerpChord" }, { code: "equalChords" }, { code: "semiCircle" } ],
      answer: { en: "Given the midpoint, you conclude OM ⊥ AB.", af: "Gegee die middelpunt, lei jy af dat OM ⊥ AB." },
      explainReason: "centreMidChord" },

    { id: "r2q10", type: "calc-mc", accent: AC,
      prompt: { en: "OM ⊥ AB, radius OA = 25 and OM = 7. Find AB.", af: "OM ⊥ AB, radius OA = 25 en OM = 7. Bereken AB." },
      diagram: D_PERP,
      options: [ { text: "48", correct: true }, { text: "24" }, { text: "50" }, { text: "32" } ],
      answer: { en: "AM = √(25² − 7²) = 24, so AB = 48.", af: "AM = √(25² − 7²) = 24, dus AB = 48." },
      explainReason: "pythagoras" },

    { id: "r2q11", type: "calc-mc", accent: AC,
      prompt: { en: "OM ⊥ AB, radius OA = 10 and the chord AB = 16. Find OM.", af: "OM ⊥ AB, radius OA = 10 en die koord AB = 16. Bereken OM." },
      diagram: D_PERP,
      options: [ { text: "6", correct: true }, { text: "8" }, { text: "12" }, { text: "4" } ],
      answer: { en: "Half-chord = 8, so OM = √(10² − 8²) = 6.", af: "Halfkoord = 8, dus OM = √(10² − 8²) = 6." },
      explainReason: "pythagoras" },
  ],
};
