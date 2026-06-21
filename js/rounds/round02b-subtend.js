/* Round 3 (id r2b) — Which chord subtends which angle?
   Pure identification: a chord "subtends" the inscribed angle whose two arms
   end at the chord's endpoints. Mix of tap-the-chord, tap-the-angle and MC.
   Q1–Q2 use a single triangle; the rest use figures with several triangles.
   No angle values — this is about spotting the relationship. */
const AC = "#4263eb";

// single inscribed triangle A-P-B
const TRI = { pts: { A: 155, B: 25, P: 240 }, chords: [["A", "B"], ["P", "A"], ["P", "B"]] };
// a fan of chords from P to A,B,C with the consecutive chords joined
const FAN = { pts: { P: 270, A: 165, B: 110, C: 50 }, chords: [["P", "A"], ["P", "B"], ["P", "C"], ["A", "B"], ["B", "C"]] };
// two inscribed angles at different vertices (C and D), on different chords
const TWO = { pts: { A: 150, B: 50, C: 300, D: 210 }, chords: [["C", "A"], ["C", "B"], ["D", "B"], ["D", "C"], ["A", "B"], ["B", "C"]] };

const subAns = (en, af) => ({ en, af });

export const round = {
  id: "r2b", n: 3, accent: AC,
  title: { en: "Which chord, which angle?", af: "Watter koord, watter hoek?" },
  blurb: { en: "Spot which chord subtends which angle.", af: "Herken watter koord watter hoek onderspan." },
  reasonCode: null,
  questionsPerPlay: 10,
  questions: [
    // --- single triangle ---
    { id: "r2bq1", type: "tap", accent: AC,
      prompt: { en: "The angle at P is marked. Tap the chord that subtends it.", af: "Die hoek by P is gemerk. Klik op die koord wat dit onderspan." },
      diagram: { ...TRI, angles: [{ at: "P", legs: ["A", "B"], t: "•", o: {} }] },
      tap: { targets: [ { id: "ab", kind: "chord", a: "A", b: "B" }, { id: "pa", kind: "chord", a: "P", b: "A" }, { id: "pb", kind: "chord", a: "P", b: "B" } ], correctId: "ab" },
      answer: subAns("Chord AB subtends ∠P — it joins the two arms of the angle.", "Koord AB onderspan ∠P — dit verbind die twee bene van die hoek.") },

    { id: "r2bq2", type: "mc", accent: AC,
      prompt: { en: "Which chord does ∠APB subtend?", af: "Watter koord onderspan ∠APB?" },
      diagram: { ...TRI, angles: [{ at: "P", legs: ["A", "B"], t: "•", o: {} }] },
      options: [ { text: "AB", correct: true }, { text: "AP" }, { text: "BP" } ],
      answer: subAns("AB — the chord opposite the angle, joining its arms.", "AB — die koord oorkant die hoek, wat sy bene verbind.") },

    // --- several triangles: a fan from P ---
    { id: "r2bq3", type: "tap", accent: AC,
      prompt: { en: "The marked angle is ∠APB. Tap the chord it subtends.", af: "Die gemerkte hoek is ∠APB. Klik op die koord wat dit onderspan." },
      diagram: { ...FAN, angles: [{ at: "P", legs: ["A", "B"], t: "•", o: {} }] },
      tap: { targets: [ { id: "ab", kind: "chord", a: "A", b: "B" }, { id: "bc", kind: "chord", a: "B", b: "C" }, { id: "pa", kind: "chord", a: "P", b: "A" } ], correctId: "ab" },
      answer: subAns("∠APB subtends chord AB (not the arm PA, and not chord BC).", "∠APB onderspan koord AB (nie die been PA nie, en nie koord BC nie).") },

    { id: "r2bq4", type: "mc", accent: AC,
      prompt: { en: "Which chord does ∠BPC subtend?", af: "Watter koord onderspan ∠BPC?" },
      diagram: { ...FAN, angles: [{ at: "P", legs: ["B", "C"], t: "•", o: {} }] },
      options: [ { text: "BC", correct: true }, { text: "AB" }, { text: "PC" } ],
      answer: subAns("BC — the chord joining B and C, the arms of ∠BPC.", "BC — die koord wat B en C verbind, die bene van ∠BPC.") },

    // --- several triangles: angles at different vertices ---
    { id: "r2bq5", type: "tap", accent: AC,
      prompt: { en: "Two angles are drawn. Tap the angle that is subtended by chord AB.", af: "Twee hoeke is geteken. Klik op die hoek wat deur koord AB onderspan word." },
      diagram: { ...TWO, angles: [ { at: "C", legs: ["A", "B"], t: "", o: {} }, { at: "D", legs: ["B", "C"], t: "", o: {} } ] },
      tap: { targets: [ { id: "c", kind: "angle", angleIndex: 0 }, { id: "d", kind: "angle", angleIndex: 1 } ], correctId: "c" },
      answer: subAns("∠ACB stands on chord AB. (∠BDC stands on chord BC.)", "∠ACB staan op koord AB. (∠BDC staan op koord BC.)") },

    { id: "r2bq6", type: "tap", accent: AC,
      prompt: { en: "Tap the angle that is subtended by chord BC.", af: "Klik op die hoek wat deur koord BC onderspan word." },
      diagram: { ...TWO, angles: [ { at: "C", legs: ["A", "B"], t: "", o: {} }, { at: "D", legs: ["B", "C"], t: "", o: {} } ] },
      tap: { targets: [ { id: "c", kind: "angle", angleIndex: 0 }, { id: "d", kind: "angle", angleIndex: 1 } ], correctId: "d" },
      answer: subAns("∠BDC stands on chord BC — its arms DB and DC end at B and C.", "∠BDC staan op koord BC — sy bene DB en DC eindig by B en C.") },

    { id: "r2bq7", type: "mc", accent: AC,
      prompt: { en: "Which angle at P does chord AC subtend?", af: "Watter hoek by P onderspan koord AC?" },
      diagram: { pts: { P: 270, A: 165, B: 110, C: 50 }, chords: [["P", "A"], ["P", "B"], ["P", "C"], ["A", "C"], ["A", "B"], ["B", "C"]] },
      options: [ { text: "∠APC", correct: true }, { text: "∠APB" }, { text: "∠BPC" } ],
      answer: subAns("∠APC — its arms PA and PC end at A and C.", "∠APC — sy bene PA en PC eindig by A en C.") },

    // --- cyclic quad with a diagonal ---
    { id: "r2bq8", type: "mc", accent: AC,
      prompt: { en: "Which chord does ∠ADB subtend?", af: "Watter koord onderspan ∠ADB?" },
      diagram: { pts: { A: 160, B: 80, C: 340, D: 250 }, chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["B", "D"]],
        angles: [{ at: "D", legs: ["A", "B"], t: "•", o: {} }] },
      options: [ { text: "AB", correct: true }, { text: "AD" }, { text: "BC" }, { text: "CD" } ],
      answer: subAns("AB — ∠ADB has arms DA and DB, ending at A and B.", "AB — ∠ADB het bene DA en DB, wat by A en B eindig.") },

    { id: "r2bq9", type: "tap", accent: AC,
      prompt: { en: "The marked angle is ∠ACB. Tap the chord it subtends.", af: "Die gemerkte hoek is ∠ACB. Klik op die koord wat dit onderspan." },
      diagram: { pts: { A: 160, B: 80, C: 340, D: 250 }, chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["A", "C"]],
        angles: [{ at: "C", legs: ["A", "B"], t: "•", o: {} }] },
      tap: { targets: [ { id: "ab", kind: "chord", a: "A", b: "B" }, { id: "bc", kind: "chord", a: "B", b: "C" }, { id: "ac", kind: "chord", a: "A", b: "C" } ], correctId: "ab" },
      answer: subAns("∠ACB subtends chord AB (AC is an arm, not the subtended chord).", "∠ACB onderspan koord AB (AC is 'n been, nie die onderspande koord nie).") },

    { id: "r2bq10", type: "mc", accent: AC,
      prompt: { en: "Which chord does ∠BAD subtend?", af: "Watter koord onderspan ∠BAD?" },
      diagram: { pts: { A: 160, B: 80, C: 340, D: 250 }, chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["B", "D"]],
        angles: [{ at: "A", legs: ["B", "D"], t: "•", o: {} }] },
      options: [ { text: "BD", correct: true }, { text: "AB" }, { text: "AD" }, { text: "CD" } ],
      answer: subAns("BD — the chord joining B and D, the arms of ∠BAD.", "BD — die koord wat B en D verbind, die bene van ∠BAD.") },
  ],
};
