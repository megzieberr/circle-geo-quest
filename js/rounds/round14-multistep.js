/* PHASE 2 · Round 14 (id r14) — Multi-step calculations.
   Exam-style riders that combine two or three theorems. The learner picks
   the correct FINAL answer; the full statement→reason working is revealed
   afterwards. Distractors are common mid-calculation slips. Coordinates are
   reused from the verified Phase-1 / tan-chord exercise set.
   `phase: 2` ties this round to the Intermediate rank tier. */
const AC = "#4263eb";

export const round = {
  id: "r14", n: 14, phase: 2, accent: AC,
  title: { en: "Multi-step calculations", af: "Veelstap-berekeninge" },
  blurb: { en: "Combine two or three theorems — pick the final answer.", af: "Kombineer twee of drie stellings — kies die finale antwoord." },
  reasonCode: null,
  questionsPerPlay: 10,
  questions: [
    { id: "r14q1", type: "calc-mc", accent: AC,
      prompt: { en: "STU is a tangent at T and TD is a diameter. ∠UTA = 28°. Calculate ∠ATD.", af: "STU is 'n raaklyn by T en TD is 'n middellyn. ∠UTA = 28°. Bereken ∠ATD." },
      diagram: { O: true, pts: { T: 270, D: 90, A: 326 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["T", "D"], ["T", "A"], ["D", "A"]],
        angles: [ { at: "T", legs: ["tg+", "A"], t: "28°", o: { v: 28 } }, { at: "T", legs: ["A", "D"], t: "x", o: { v: 62 } } ] },
      options: [ { text: "62°", correct: true }, { text: "28°" }, { text: "90°" }, { text: "118°" } ],
      answer: { en: "∠ATD = 62°", af: "∠ATD = 62°" },
      solution: [ { s: "∠UTD = 90°", r: "tanDiameter" }, { s: "∠ATD = 90° − 28° = 62°" } ] },

    { id: "r14q2", type: "calc-mc", accent: AC,
      prompt: { en: "AB is a diameter and ∠PAB = 35°. Calculate ∠PBA.", af: "AB is 'n middellyn en ∠PAB = 35°. Bereken ∠PBA." },
      diagram: { O: true, pts: { A: 180, B: 0, P: 70 }, chords: [["A", "B"], ["A", "P"], ["B", "P"]],
        angles: [ { at: "A", legs: ["B", "P"], t: "35°", o: { v: 35 } }, { at: "P", legs: ["A", "B"], t: "", o: { v: 90, mark: 1 } }, { at: "B", legs: ["A", "P"], t: "x", o: { v: 55 } } ] },
      options: [ { text: "55°", correct: true }, { text: "35°" }, { text: "45°" }, { text: "90°" } ],
      answer: { en: "∠PBA = 55°", af: "∠PBA = 55°" },
      solution: [ { s: "∠APB = 90°", r: "semiCircle" }, { s: "∠PBA = 180° − 90° − 35° = 55°", r: "triSum" } ] },

    { id: "r14q3", type: "calc-mc", accent: AC,
      prompt: { en: "STU is a tangent at T. ∠UTA = 58° and ∠TAB = 47°. Calculate ∠ATB.", af: "STU is 'n raaklyn by T. ∠UTA = 58° en ∠TAB = 47°. Bereken ∠ATB." },
      diagram: { pts: { T: 270, A: 26, B: 176 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["T", "A"], ["T", "B"], ["A", "B"]],
        angles: [ { at: "T", legs: ["tg+", "A"], t: "58°", o: { v: 58 } }, { at: "A", legs: ["T", "B"], t: "47°", o: { v: 47 } }, { at: "T", legs: ["A", "B"], t: "x", o: { v: 75 } } ] },
      options: [ { text: "75°", correct: true }, { text: "58°" }, { text: "47°" }, { text: "105°" } ],
      answer: { en: "∠ATB = 75°", af: "∠ATB = 75°" },
      solution: [ { s: "∠ABT = ∠UTA = 58°", r: "tanChord" }, { s: "∠ATB = 180° − 58° − 47° = 75°", r: "triSum" } ] },

    { id: "r14q4", type: "calc-mc", accent: AC,
      prompt: { en: "O is the centre and ∠APB = 40°. Calculate ∠OAB.", af: "O is die middelpunt en ∠APB = 40°. Bereken ∠OAB." },
      diagram: { O: true, pts: { A: 130, B: 50, P: 270 }, chords: [["O", "A"], ["O", "B"], ["A", "B"], ["P", "A"], ["P", "B"]],
        angles: [ { at: "P", legs: ["A", "B"], t: "40°", o: { v: 40 } }, { at: "A", legs: ["O", "B"], t: "x", o: { v: 50 } } ] },
      options: [ { text: "50°", correct: true }, { text: "40°" }, { text: "80°" }, { text: "100°" } ],
      answer: { en: "∠OAB = 50°", af: "∠OAB = 50°" },
      solution: [ { s: "∠AOB = 2 × 40° = 80°", r: "centreDouble" }, { s: "OA = OB (radii); ∠OAB = (180° − 80°) ÷ 2 = 50°", r: "isosBase" } ] },

    { id: "r14q5", type: "calc-mc", accent: AC,
      prompt: { en: "PT and PS are tangents from P and ∠TPS = 40°. Q is on the circle. Calculate ∠TQS.", af: "PT en PS is raaklyne vanaf P en ∠TPS = 40°. Q is op die sirkel. Bereken ∠TQS." },
      diagram: { h: 294, cx: 160, cy: 96, R: 58, pts: { T: 340, S: 200, Q: 90 }, ext: [{ name: "P", t: ["T", "S"] }], chords: [["T", "S"], ["Q", "T"], ["Q", "S"]],
        angles: [ { at: "P", legs: ["T", "S"], t: "40°", o: { v: 40 } }, { at: "Q", legs: ["T", "S"], t: "x", o: { v: 70 } } ] },
      options: [ { text: "70°", correct: true }, { text: "40°" }, { text: "110°" }, { text: "140°" } ],
      answer: { en: "∠TQS = 70°", af: "∠TQS = 70°" },
      solution: [ { s: "PT = PS", r: "tansCommonPt" }, { s: "∠PTS = (180° − 40°) ÷ 2 = 70°", r: "isosBase" }, { s: "∠TQS = ∠PTS = 70°", r: "tanChord" } ] },

    { id: "r14q6", type: "calc-mc", accent: AC,
      prompt: { en: "O is the centre, OM ⊥ AB, OM = 3 and AB = 8. Calculate the radius OA.", af: "O is die middelpunt, OM ⊥ AB, OM = 3 en AB = 8. Bereken die radius OA." },
      diagram: { O: true, pts: { A: 200, B: 340 }, mid: [{ name: "M", of: ["A", "B"] }], chords: [["A", "B"], ["O", "M"], ["O", "A"]],
        angles: [ { at: "M", legs: ["O", "A"], t: "", o: { v: 90, mark: 1 } } ] },
      options: [ { text: "5", correct: true }, { text: "4" }, { text: "7" }, { text: "6" } ],
      answer: { en: "OA = 5", af: "OA = 5" },
      solution: [ { s: "AM = ½ × 8 = 4", r: "centrePerpChord" }, { s: "OA = √(3² + 4²) = 5", r: "pythagoras" } ] },

    { id: "r14q7", type: "calc-mc", accent: AC,
      prompt: { en: "STU is a tangent at T. ∠UTA = 66° and ∠STB = 44°. Calculate ∠AQB.", af: "STU is 'n raaklyn by T. ∠UTA = 66° en ∠STB = 44°. Bereken ∠AQB." },
      diagram: { pts: { T: 270, A: 42, B: 182, Q: 112 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["T", "A"], ["T", "B"], ["Q", "A"], ["Q", "B"], ["Q", "T"]],
        angles: [ { at: "T", legs: ["tg+", "A"], t: "66°", o: { v: 66 } }, { at: "T", legs: ["tg-", "B"], t: "44°", o: { v: 44 } }, { at: "Q", legs: ["A", "B"], t: "x", o: { v: 110 } } ] },
      options: [ { text: "110°", correct: true }, { text: "66°" }, { text: "44°" }, { text: "88°" } ],
      answer: { en: "∠AQB = 110°", af: "∠AQB = 110°" },
      solution: [ { s: "∠TQA = 66°", r: "tanChord" }, { s: "∠TQB = 44°", r: "tanChord" }, { s: "∠AQB = 66° + 44° = 110°" } ] },

    { id: "r14q8", type: "calc-mc", accent: AC,
      prompt: { en: "STU is a tangent at T and TD is a diameter. ∠ATD = 54°. Calculate ∠TDA.", af: "STU is 'n raaklyn by T en TD is 'n middellyn. ∠ATD = 54°. Bereken ∠TDA." },
      diagram: { O: true, pts: { T: 270, D: 90, A: 342 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["T", "D"], ["T", "A"], ["D", "A"]],
        angles: [ { at: "T", legs: ["A", "D"], t: "54°", o: { v: 54 } }, { at: "A", legs: ["D", "T"], t: "", o: { v: 90, mark: 1 } }, { at: "D", legs: ["T", "A"], t: "x", o: { v: 36 } } ] },
      options: [ { text: "36°", correct: true }, { text: "54°" }, { text: "90°" }, { text: "126°" } ],
      answer: { en: "∠TDA = 36°", af: "∠TDA = 36°" },
      solution: [ { s: "∠TAD = 90°", r: "semiCircle" }, { s: "∠TDA = 180° − 90° − 54° = 36°", r: "triSum" } ] },

    { id: "r14q9", type: "calc-mc", accent: AC,
      prompt: { en: "ABCD is a cyclic quad with AB extended to E. The exterior angle ∠EBC = 80°. Calculate ∠ABC.", af: "ABCD is 'n koordevierhoek met AB verleng tot E. Die buitehoek ∠EBC = 80°. Bereken ∠ABC." },
      diagram: { pts: { A: 165, B: 95, C: 5, D: 250 }, out: [{ name: "E", along: ["A", "B"], len: 34 }],
        chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["B", "E"]],
        angles: [ { at: "B", legs: ["E", "C"], t: "80°", o: { v: 80 } }, { at: "B", legs: ["A", "C"], t: "x", o: { v: 100 } } ] },
      options: [ { text: "100°", correct: true }, { text: "80°" }, { text: "90°" }, { text: "160°" } ],
      answer: { en: "∠ABC = 100°", af: "∠ABC = 100°" },
      solution: [ { s: "∠ABC + ∠EBC = 180°", r: "straightLine" }, { s: "∠ABC = 180° − 80° = 100°" } ] },

    { id: "r14q10", type: "calc-mc", accent: AC,
      prompt: { en: "STU is a tangent at T, with P and Q on the circle. ∠UTA = 52°. Calculate ∠TQA.", af: "STU is 'n raaklyn by T, met P en Q op die sirkel. ∠UTA = 52°. Bereken ∠TQA." },
      diagram: { pts: { T: 270, A: 14, P: 150, Q: 205 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["T", "A"], ["P", "T"], ["P", "A"], ["Q", "T"], ["Q", "A"]],
        angles: [ { at: "T", legs: ["tg+", "A"], t: "52°", o: { v: 52 } }, { at: "P", legs: ["T", "A"], t: "", o: { v: 52 } }, { at: "Q", legs: ["T", "A"], t: "x", o: { v: 52 } } ] },
      options: [ { text: "52°", correct: true }, { text: "104°" }, { text: "26°" }, { text: "128°" } ],
      answer: { en: "∠TQA = 52°", af: "∠TQA = 52°" },
      solution: [ { s: "∠TPA = ∠UTA = 52°", r: "tanChord" }, { s: "∠TQA = ∠TPA = 52°", r: "sameSeg" } ] },
  ],
};
