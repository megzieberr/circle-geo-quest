/* Round 6 — Equal chords subtend equal angles (and the converse).
   A short reason-picker round, with a tap and a couple of MC. */
const AC = "#e64980";

// two equal chords AB, CD (equal central angles), radii drawn.
const D_EQ = { O: true, pts: { A: 165, B: 105, C: 50, D: 350 },
  chords: [["A", "B"], ["C", "D"], ["O", "A"], ["O", "B"], ["O", "C"], ["O", "D"]],
  angles: [ { at: "O", legs: ["A", "B"], t: "", o: { v: 60 } }, { at: "O", legs: ["C", "D"], t: "", o: { v: 60 } } ] };

export const round = {
  id: "r6", n: 6, accent: AC,
  title: { en: "Equal chords, equal angles", af: "Gelyke koorde, gelyke hoeke" },
  blurb: { en: "Equal chords subtend equal angles.", af: "Gelyke koorde onderspan gelyke hoeke." },
  reasonCode: "equalChords",
  questionsPerPlay: 10,
  questions: [
    { id: "r6q1", type: "reason", accent: AC,
      prompt: { en: "AB = CD (equal chords). Which reason lets you write ∠AOB = ∠COD?", af: "AB = CD (gelyke koorde). Watter rede laat jou ∠AOB = ∠COD skryf?" },
      diagram: D_EQ,
      options: [ { code: "equalChords", correct: true }, { code: "centreDouble" }, { code: "isosBase" }, { code: "sameSeg" } ],
      answer: { en: "Equal chords subtend equal angles (at the centre).", af: "Gelyke koorde onderspan gelyke hoeke (by die middelpunt)." }, explainReason: "equalChords" },

    { id: "r6q2", type: "yesno", accent: AC,
      prompt: { en: "Two chords of a circle are equal. Are the angles they subtend at the centre equal?", af: "Twee koorde van 'n sirkel is gelyk. Is die hoeke wat hulle by die middelpunt onderspan gelyk?" },
      diagram: D_EQ, yes: true,
      answer: { en: "Yes — equal chords subtend equal angles.", af: "Ja — gelyke koorde onderspan gelyke hoeke." }, explainReason: "equalChords" },

    { id: "r6q3", type: "reason", accent: AC,
      prompt: { en: "You are given ∠AOB = ∠COD. Which reason lets you conclude AB = CD?", af: "Dit is gegee dat ∠AOB = ∠COD. Watter rede laat jou aflei dat AB = CD?" },
      diagram: D_EQ,
      options: [ { code: "equalChords", correct: true }, { code: "centrePerpChord" }, { code: "cyclicOpp" }, { code: "tanRadius" } ],
      answer: { en: "Equal angles ⇒ equal chords (the converse).", af: "Gelyke hoeke ⇒ gelyke koorde (die omgekeerde)." }, explainReason: "equalChords" },

    { id: "r6q4", type: "calc-mc", accent: AC,
      prompt: { en: "AB = CD and ∠AOB = 70°. Find ∠COD.", af: "AB = CD en ∠AOB = 70°. Bereken ∠COD." },
      diagram: { O: true, pts: { A: 160, B: 90, C: 40, D: 330 }, chords: [["A", "B"], ["C", "D"], ["O", "A"], ["O", "B"], ["O", "C"], ["O", "D"]],
        angles: [ { at: "O", legs: ["A", "B"], t: "70°", o: { v: 70 } }, { at: "O", legs: ["C", "D"], t: "x", o: { v: 70 } } ] },
      options: [ { text: "70°", correct: true }, { text: "35°" }, { text: "110°" }, { text: "140°" } ],
      answer: { en: "∠COD = 70° — equal chords, equal angles.", af: "∠COD = 70° — gelyke koorde, gelyke hoeke." }, explainReason: "equalChords" },

    { id: "r6q5", type: "tap", accent: AC,
      prompt: { en: "AB has an equal-length partner chord. Tap the chord equal to AB.", af: "AB het 'n ewe lang maatkoord. Klik op die koord gelyk aan AB." },
      diagram: { O: true, pts: { A: 165, B: 105, C: 50, D: 350, E: 305, F: 265 },
        chords: [["A", "B"], ["C", "D"], ["E", "F"], ["O", "A"], ["O", "B"], ["O", "C"], ["O", "D"]],
        angles: [ { at: "O", legs: ["A", "B"], t: "", o: { v: 60 } }, { at: "O", legs: ["C", "D"], t: "", o: { v: 60 } } ] },
      tap: { targets: [ { id: "cd", kind: "chord", a: "C", b: "D" }, { id: "ef", kind: "chord", a: "E", b: "F" } ], correctId: "cd" },
      answer: { en: "CD equals AB — they subtend equal angles at O.", af: "CD is gelyk aan AB — hulle onderspan gelyke hoeke by O." }, explainReason: "equalChords" },

    { id: "r6q6", type: "reason", accent: AC,
      prompt: { en: "Equal chords also subtend equal angles where on the circle?", af: "Gelyke koorde onderspan ook gelyke hoeke waar op die sirkel?" },
      diagram: D_EQ,
      options: [ { code: "equalChords", correct: true }, { code: "semiCircle" }, { code: "tanChord" }, { code: "straightLine" } ],
      answer: { en: "At the circumference too — equal chords, equal angles.", af: "Ook by die omtrek — gelyke koorde, gelyke hoeke." }, explainReason: "equalChords" },

    { id: "r6q7", type: "yesno", accent: AC,
      prompt: { en: "∠AOB = ∠COD = 60°. Does it follow that chord AB = chord CD?", af: "∠AOB = ∠COD = 60°. Volg dit dat koord AB = koord CD?" },
      diagram: { O: true, pts: { A: 165, B: 105, C: 50, D: 350 },
        chords: [["A", "B"], ["C", "D"], ["O", "A"], ["O", "B"], ["O", "C"], ["O", "D"]],
        angles: [ { at: "O", legs: ["A", "B"], t: "60°", o: { v: 60 } }, { at: "O", legs: ["C", "D"], t: "60°", o: { v: 60 } } ] },
      yes: true, answer: { en: "Yes — equal angles ⇒ equal chords.", af: "Ja — gelyke hoeke ⇒ gelyke koorde." }, explainReason: "equalChords" },

    { id: "r6q8", type: "calc-mc", accent: AC,
      prompt: { en: "AB = CD and ∠AOB = 50°. Find ∠COD.", af: "AB = CD en ∠AOB = 50°. Bereken ∠COD." },
      diagram: { O: true, pts: { A: 160, B: 110, C: 40, D: 350 }, chords: [["A", "B"], ["C", "D"], ["O", "A"], ["O", "B"], ["O", "C"], ["O", "D"]],
        angles: [ { at: "O", legs: ["A", "B"], t: "50°", o: { v: 50 } }, { at: "O", legs: ["C", "D"], t: "x", o: { v: 50 } } ] },
      options: [ { text: "50°", correct: true }, { text: "25°" }, { text: "100°" }, { text: "130°" } ],
      answer: { en: "∠COD = 50° — equal chords subtend equal angles.", af: "∠COD = 50° — gelyke koorde onderspan gelyke hoeke." }, explainReason: "equalChords" },

    { id: "r6q9", type: "reason", accent: AC,
      prompt: { en: "AB = CD. Which reason justifies that AB and CD subtend equal angles?", af: "AB = CD. Watter rede regverdig dat AB en CD gelyke hoeke onderspan?" },
      diagram: D_EQ,
      options: [ { code: "equalChords", correct: true }, { code: "isosBase" }, { code: "sameSeg" }, { code: "centreDouble" } ],
      answer: { en: "Equal chords subtend equal angles.", af: "Gelyke koorde onderspan gelyke hoeke." }, explainReason: "equalChords" },

    { id: "r6q10", type: "yesno", accent: AC,
      prompt: { en: "Two equal chords are drawn in a circle. Do they subtend equal angles at the circumference?", af: "Twee gelyke koorde word in 'n sirkel geteken. Onderspan hulle gelyke hoeke by die omtrek?" },
      diagram: D_EQ, yes: true,
      answer: { en: "Yes — equal chords subtend equal angles, at the centre and the circumference.", af: "Ja — gelyke koorde onderspan gelyke hoeke, by die middelpunt en die omtrek." }, explainReason: "equalChords" },
  ],
};
