/* Round 7 — Cyclic quadrilateral: opposite angles are supplementary.
   Find 180 − x (MC) and yes/no on supplementary (opposite vs adjacent). */
const AC = "#f76707";

// convex cyclic quad ABCD (points given in clockwise order on the circle).
function quad(A, B, C, D, angs) {
  return { pts: { A, B, C, D }, chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"]], angles: angs };
}

export const round = {
  id: "r7", n: 7, accent: AC,
  title: { en: "Cyclic quad — opposite angles", af: "Koordevierhoek — teenoorstaande hoeke" },
  blurb: { en: "Opposite angles of a cyclic quad add to 180°.", af: "Teenoorstaande hoeke van 'n koordevierhoek is supplementêr." },
  reasonCode: "cyclicOpp",
  questionsPerPlay: 10,
  defaultHints: [
    { en: "ABCD is a cyclic quad. Its OPPOSITE angles (∠A & ∠C, ∠B & ∠D) add up to 180°. Angles next to each other do not.",
      af: "ABCD is 'n koordevierhoek. Sy TEENOORSTAANDE hoeke (∠A & ∠C, ∠B & ∠D) tel op tot 180°. Hoeke langs mekaar nie." },
    { en: "So ∠A + ∠C = 180°. Take the angle you're given away from 180° to find the opposite one.",
      af: "Dus ∠A + ∠C = 180°. Trek die gegewe hoek van 180° af om die teenoorstaande een te kry." },
  ],
  questions: [
    { id: "r7q1", type: "calc-mc", accent: AC,
      prompt: { en: "ABCD is a cyclic quad and ∠A = 100°. Find x = ∠C.", af: "ABCD is 'n koordevierhoek en ∠A = 100°. Bereken x = ∠C." },
      diagram: quad(160, 80, 350, 240, [ { at: "A", legs: ["D", "B"], t: "100°", o: { v: 100 } }, { at: "C", legs: ["B", "D"], t: "x", o: { v: 80 } } ]),
      options: [ { text: "80°", correct: true }, { text: "100°" }, { text: "260°" }, { text: "90°" } ],
      answer: { en: "x = 180° − 100° = 80°.", af: "x = 180° − 100° = 80°." }, explainReason: "cyclicOpp" },

    { id: "r7q2", type: "calc-mc", accent: AC,
      prompt: { en: "ABCD is a cyclic quad and ∠B = 95°. Find x = ∠D.", af: "ABCD is 'n koordevierhoek en ∠B = 95°. Bereken x = ∠D." },
      diagram: quad(160, 80, 350, 240, [ { at: "B", legs: ["A", "C"], t: "95°", o: { v: 95 } }, { at: "D", legs: ["C", "A"], t: "x", o: { v: 85 } } ]),
      options: [ { text: "85°", correct: true }, { text: "95°" }, { text: "180°" }, { text: "105°" } ],
      answer: { en: "x = 180° − 95° = 85°.", af: "x = 180° − 95° = 85°." }, explainReason: "cyclicOpp" },

    { id: "r7q3", type: "yesno", accent: AC,
      prompt: { en: "In cyclic quad ABCD, are ∠A and ∠C (opposite angles) supplementary?", af: "In koordevierhoek ABCD, is ∠A en ∠C (teenoorstaande hoeke) supplementêr?" },
      diagram: quad(160, 80, 350, 240, [ { at: "A", legs: ["D", "B"], t: "", o: { v: 100 } }, { at: "C", legs: ["B", "D"], t: "", o: { v: 80 } } ]),
      yes: true, answer: { en: "Yes — opposite angles of a cyclic quad add to 180°.", af: "Ja — die som van die teenoorstaande hoeke is 180° (hulle is supplementêr)." }, explainReason: "cyclicOpp" },

    { id: "r7q4", type: "yesno", accent: AC,
      prompt: { en: "In cyclic quad ABCD, are ∠A and ∠B (next to each other) always supplementary?", af: "In koordevierhoek ABCD, is ∠A en ∠B (langs mekaar) altyd supplementêr?" },
      diagram: quad(160, 80, 350, 240, [ { at: "A", legs: ["D", "B"], t: "", o: { v: 100 } }, { at: "B", legs: ["A", "C"], t: "", o: { v: 95 } } ]),
      yes: false, answer: { en: "No — only OPPOSITE angles are supplementary, not adjacent ones.", af: "Nee — net TEENOORSTAANDE hoeke is supplementêr, nie aangrensende nie." }, explainReason: "cyclicOpp" },

    { id: "r7q5", type: "calc-mc", accent: AC,
      prompt: { en: "ABCD is a cyclic quad with ∠A = x and ∠C = x + 40°. Find x.", af: "ABCD is 'n koordevierhoek met ∠A = x en ∠C = x + 40°. Bereken x." },
      diagram: quad(170, 60, 350, 280, [ { at: "A", legs: ["D", "B"], t: "x", o: { v: 70 } }, { at: "C", legs: ["B", "D"], t: "x + 40°", o: { v: 110 } } ]),
      options: [ { text: "70°", correct: true }, { text: "110°" }, { text: "20°" }, { text: "90°" } ],
      answer: { en: "x + (x + 40°) = 180°, so 2x = 140° and x = 70°.", af: "x + (x + 40°) = 180°, dus 2x = 140° en x = 70°." }, explainReason: "cyclicOpp" },

    { id: "r7q6", type: "reason", accent: AC,
      prompt: { en: "Why does ∠A + ∠C = 180° in a cyclic quad?", af: "Hoekom is ∠A + ∠C = 180° in 'n koordevierhoek?" },
      diagram: quad(160, 80, 350, 240, [ { at: "A", legs: ["D", "B"], t: "", o: { v: 100 } }, { at: "C", legs: ["B", "D"], t: "", o: { v: 80 } } ]),
      options: [ { code: "cyclicOpp", correct: true }, { code: "cyclicExt" }, { code: "sameSeg" }, { code: "straightLine" } ],
      answer: { en: "Opposite angles of a cyclic quad are supplementary.", af: "Teenoorstaande hoeke van 'n koordevierhoek is supplementêr." }, explainReason: "cyclicOpp" },

    { id: "r7q7", type: "tap", accent: AC,
      prompt: { en: "Tap the angle that is supplementary to ∠A (marked).", af: "Klik op die hoek wat supplementêr tot ∠A (gemerk) is." },
      diagram: quad(160, 80, 350, 240, [
        { at: "A", legs: ["D", "B"], t: "A", o: { v: 100 } },
        { at: "C", legs: ["B", "D"], t: "", o: { v: 80 } },
        { at: "B", legs: ["A", "C"], t: "", o: { v: 95 } },
        { at: "D", legs: ["C", "A"], t: "", o: { v: 85 } } ]),
      tap: { targets: [ { id: "c", kind: "angle", angleIndex: 1 }, { id: "b", kind: "angle", angleIndex: 2 }, { id: "d", kind: "angle", angleIndex: 3 } ], correctId: "c" },
      answer: { en: "∠C is opposite ∠A, so ∠A + ∠C = 180°.", af: "∠C is oorkant ∠A, dus ∠A + ∠C = 180°." }, explainReason: "cyclicOpp" },

    { id: "r7q8", type: "calc-mc", accent: AC,
      prompt: { en: "ABCD is a cyclic quad and ∠C = 110°. Find ∠A.", af: "ABCD is 'n koordevierhoek en ∠C = 110°. Bereken ∠A." },
      diagram: quad(170, 60, 350, 280, [ { at: "C", legs: ["B", "D"], t: "110°", o: { v: 110 } }, { at: "A", legs: ["D", "B"], t: "x", o: { v: 70 } } ]),
      options: [ { text: "70°", correct: true }, { text: "110°" }, { text: "90°" }, { text: "250°" } ],
      answer: { en: "∠A = 180° − 110° = 70°.", af: "∠A = 180° − 110° = 70°." }, explainReason: "cyclicOpp" },

    { id: "r7q9", type: "calc-mc", accent: AC,
      prompt: { en: "ABCD is a cyclic quad and ∠D = 85°. Find ∠B.", af: "ABCD is 'n koordevierhoek en ∠D = 85°. Bereken ∠B." },
      diagram: quad(160, 80, 350, 240, [ { at: "D", legs: ["C", "A"], t: "85°", o: { v: 85 } }, { at: "B", legs: ["A", "C"], t: "x", o: { v: 95 } } ]),
      options: [ { text: "95°", correct: true }, { text: "85°" }, { text: "90°" }, { text: "105°" } ],
      answer: { en: "∠B = 180° − 85° = 95°.", af: "∠B = 180° − 85° = 95°." }, explainReason: "cyclicOpp" },

    { id: "r7q10", type: "yesno", accent: AC,
      prompt: { en: "In cyclic quad ABCD, are ∠B and ∠D (opposite angles) supplementary?", af: "In koordevierhoek ABCD, is ∠B en ∠D (teenoorstaande hoeke) supplementêr?" },
      diagram: quad(160, 80, 350, 240, [ { at: "B", legs: ["A", "C"], t: "", o: { v: 95 } }, { at: "D", legs: ["C", "A"], t: "", o: { v: 85 } } ]),
      yes: true, answer: { en: "Yes — opposite angles of a cyclic quad are supplementary.", af: "Ja — teenoorstaande hoeke van 'n koordevierhoek is supplementêr." }, explainReason: "cyclicOpp" },
  ],
};
