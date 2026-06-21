/* Round 12 — Boss round: "name that theorem".
   A diagram shows a tell-tale mark; the learner picks the theorem that
   applies, or confirms (yes/no) whether a named theorem applies.
   Pulls a representative diagram for every theorem above. */
const AC = "#f76707";

export const round = {
  id: "r12", n: 13, accent: AC,
  title: { en: "Boss: name that theorem", af: "Baas: noem daardie stelling" },
  blurb: { en: "Spot the right theorem from the diagram.", af: "Herken die regte stelling uit die diagram." },
  reasonCode: null,
  questionsPerPlay: 10,
  questions: [
    { id: "r12q1", type: "reason", accent: AC,
      prompt: { en: "Which theorem do you use here?", af: "Watter stelling gebruik jy hier?" },
      diagram: { pts: { T: 270, A: 40, P: 150 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["T", "A"], ["P", "T"], ["P", "A"]],
        angles: [ { at: "T", legs: ["tg+", "A"], t: "", o: { v: 64 } }, { at: "P", legs: ["T", "A"], t: "", o: { v: 64 } } ] },
      options: [ { code: "tanChord", correct: true }, { code: "sameSeg" }, { code: "centreDouble" }, { code: "cyclicExt" } ],
      answer: { en: "Tangent + chord + alternate segment = tan-chord theorem.", af: "Raaklyn + koord + oorstaande segment = raaklyn-koord-stelling." }, explainReason: "tanChord" },

    { id: "r12q2", type: "reason", accent: AC,
      prompt: { en: "AB is a diameter. Which theorem gives ∠P = 90°?", af: "AB is 'n middellyn. Watter stelling gee ∠P = 90°?" },
      diagram: { O: true, pts: { A: 180, B: 0, P: 110 }, chords: [["A", "B"], ["A", "P"], ["B", "P"]], angles: [{ at: "P", legs: ["A", "B"], t: "", o: { v: 90, mark: 1 } }] },
      options: [ { code: "semiCircle", correct: true }, { code: "tanRadius" }, { code: "cyclicOpp" }, { code: "centreDouble" } ],
      answer: { en: "Angle in a semicircle = 90°.", af: "Hoek in 'n semi sirkel = 90°." }, explainReason: "semiCircle" },

    { id: "r12q3", type: "reason", accent: AC,
      prompt: { en: "Which theorem explains the right angle at T?", af: "Watter stelling verklaar die regte hoek by T?" },
      diagram: { O: true, pts: { T: 270 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["O", "T"]], angles: [{ at: "T", legs: ["tg+", "O"], t: "", o: { v: 90, mark: 1 } }] },
      options: [ { code: "tanRadius", correct: true }, { code: "tanChord" }, { code: "semiCircle" }, { code: "centrePerpChord" } ],
      answer: { en: "tan ⊥ radius at the point of contact.", af: "raaklyn ⊥ radius by die raakpunt." }, explainReason: "tanRadius" },

    { id: "r12q4", type: "reason", accent: AC,
      prompt: { en: "O is the centre. Which theorem links the two marked angles?", af: "O is die middelpunt. Watter stelling verbind die twee gemerkte hoeke?" },
      diagram: { O: true, pts: { A: 150, B: 30, P: 270 }, chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]],
        angles: [ { at: "O", legs: ["A", "B"], t: "", o: { v: 120 } }, { at: "P", legs: ["A", "B"], t: "", o: { v: 60 } } ] },
      options: [ { code: "centreDouble", correct: true }, { code: "sameSeg" }, { code: "cyclicOpp" }, { code: "tanChord" } ],
      answer: { en: "Angle at centre = 2 × angle at circumference.", af: "Middelpuntshoek = 2 × omtrekshoek." }, explainReason: "centreDouble" },

    { id: "r12q5", type: "reason", accent: AC,
      prompt: { en: "P and Q are on the same side of chord AB. Which theorem?", af: "P en Q is aan dieselfde kant van koord AB. Watter stelling?" },
      diagram: { pts: { A: 200, B: 340, P: 60, Q: 120 }, chords: [["A", "B"], ["A", "P"], ["B", "P"], ["A", "Q"], ["B", "Q"]],
        angles: [ { at: "P", legs: ["A", "B"], t: "", o: { v: 70 } }, { at: "Q", legs: ["A", "B"], t: "", o: { v: 70 } } ] },
      options: [ { code: "sameSeg", correct: true }, { code: "centreDouble" }, { code: "equalChords" }, { code: "cyclicExt" } ],
      answer: { en: "Angles in the same segment are equal.", af: "Hoeke in dieselfde segment is gelyk." }, explainReason: "sameSeg" },

    { id: "r12q6", type: "reason", accent: AC,
      prompt: { en: "ABCD is a cyclic quad. Which theorem makes ∠A + ∠C = 180°?", af: "ABCD is 'n koordevierhoek. Watter stelling maak ∠A + ∠C = 180°?" },
      diagram: { pts: { A: 160, B: 80, C: 350, D: 240 }, chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"]],
        angles: [ { at: "A", legs: ["D", "B"], t: "", o: { v: 100 } }, { at: "C", legs: ["B", "D"], t: "", o: { v: 80 } } ] },
      options: [ { code: "cyclicOpp", correct: true }, { code: "cyclicExt" }, { code: "sameSeg" }, { code: "isosBase" } ],
      answer: { en: "Opposite angles of a cyclic quad are supplementary.", af: "Teenoorstaande hoeke van 'n koordevierhoek is supplementêr." }, explainReason: "cyclicOpp" },

    { id: "r12q7", type: "reason", accent: AC,
      prompt: { en: "Side AB is extended to E. Which theorem applies to ∠EBC?", af: "Sy AB is verleng tot by E. Watter stelling geld vir ∠EBC?" },
      diagram: { pts: { A: 165, B: 95, C: 5, D: 250 }, out: [{ name: "E", along: ["A", "B"], len: 34 }],
        chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["B", "E"]],
        angles: [ { at: "B", legs: ["E", "C"], t: "", o: { v: 80 } } ] },
      options: [ { code: "cyclicExt", correct: true }, { code: "cyclicOpp" }, { code: "tanChord" }, { code: "straightLine" } ],
      answer: { en: "Exterior angle of a cyclic quad = interior opposite angle.", af: "Buitehoek van 'n koordevierhoek = teenoorstaande binnehoek." }, explainReason: "cyclicExt" },

    { id: "r12q8", type: "reason", accent: AC,
      prompt: { en: "PT and PS are tangents from P. Which theorem gives PT = PS?", af: "PT en PS is raaklyne vanaf P. Watter stelling gee PT = PS?" },
      diagram: { h: 280, cx: 160, cy: 92, R: 56, pts: { T: 338, S: 202 }, ext: [{ name: "P", t: ["T", "S"] }], chords: [["T", "S"]] },
      options: [ { code: "tansCommonPt", correct: true }, { code: "tanRadius" }, { code: "equalChords" }, { code: "isosBase" } ],
      answer: { en: "Tangents from the same point are equal.", af: "Raaklyne vanaf dieselfde punt is gelyk." }, explainReason: "tansCommonPt" },

    { id: "r12q9", type: "reason", accent: AC,
      prompt: { en: "OM meets chord AB at a right angle. Which theorem lets you say AM = MB?", af: "OM ontmoet koord AB teen 'n regte hoek. Watter stelling laat jou sê AM = MB?" },
      diagram: { O: true, pts: { A: 200, B: 340 }, mid: [{ name: "M", of: ["A", "B"] }], chords: [["A", "B"], ["O", "M"]],
        angles: [{ at: "M", legs: ["O", "A"], t: "", o: { v: 90, mark: 1 } }] },
      options: [ { code: "centrePerpChord", correct: true }, { code: "centreMidChord" }, { code: "tanRadius" }, { code: "semiCircle" } ],
      answer: { en: "The ⊥ from the centre bisects the chord.", af: "Die loodlyn vanaf die middelpunt halveer die koord." }, explainReason: "centrePerpChord" },

    { id: "r12q10", type: "yesno", accent: AC,
      prompt: { en: "Does the TAN-CHORD theorem apply to this diagram?", af: "Geld die RAAKLYN-KOORD stelling vir hierdie diagram?" },
      diagram: { O: true, pts: { A: 180, B: 0, P: 110 }, chords: [["A", "B"], ["A", "P"], ["B", "P"]], angles: [{ at: "P", legs: ["A", "B"], t: "", o: { v: 90, mark: 1 } }] },
      yes: false, answer: { en: "No — there is no tangent here. This is the angle in a semicircle.", af: "Nee — daar is geen raaklyn hier nie. Dit is die hoek in 'n semi sirkel." }, explainReason: "semiCircle" },

    { id: "r12q11", type: "yesno", accent: AC,
      prompt: { en: "Does the ANGLE-IN-SEMICIRCLE theorem apply here (AB through O)?", af: "Geld die HOEK-IN-SEMI-SIRKEL stelling hier (AB deur O)?" },
      diagram: { O: true, pts: { A: 180, B: 0, P: 60 }, chords: [["A", "B"], ["A", "P"], ["B", "P"]], angles: [{ at: "P", legs: ["A", "B"], t: "", o: { v: 90, mark: 1 } }] },
      yes: true, answer: { en: "Yes — AB is a diameter, so ∠P = 90°.", af: "Ja — AB is 'n middellyn, dus ∠P = 90°." }, explainReason: "semiCircle" },

    { id: "r12q12", type: "reason", accent: AC,
      prompt: { en: "AB = CD (equal chords). Which theorem gives equal angles at O?", af: "AB = CD (gelyke koorde). Watter stelling gee gelyke hoeke by O?" },
      diagram: { O: true, pts: { A: 165, B: 105, C: 50, D: 350 }, chords: [["A", "B"], ["C", "D"], ["O", "A"], ["O", "B"], ["O", "C"], ["O", "D"]],
        angles: [ { at: "O", legs: ["A", "B"], t: "", o: { v: 60 } }, { at: "O", legs: ["C", "D"], t: "", o: { v: 60 } } ] },
      options: [ { code: "equalChords", correct: true }, { code: "centreDouble" }, { code: "sameSeg" }, { code: "isosBase" } ],
      answer: { en: "Equal chords subtend equal angles.", af: "Gelyke koorde onderspan gelyke hoeke." }, explainReason: "equalChords" },
  ],
};
