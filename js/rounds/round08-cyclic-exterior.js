/* Round 8 — Cyclic quad: the exterior angle equals the interior opposite angle.
   Tap which interior angle the marked exterior angle equals
   ("follow the path with your finger"). */
const AC = "#0ea271";

export const round = {
  id: "r8", n: 8, accent: AC,
  title: { en: "Cyclic quad — exterior angle", af: "Koordevierhoek — buitehoek" },
  blurb: { en: "Exterior angle = interior opposite angle.", af: "Buitehoek = teenoorstaande binnehoek." },
  reasonCode: "cyclicExt",
  questionsPerPlay: 10,
  questions: [
    // AB extended past B to E -> exterior ∠EBC equals interior opposite ∠D
    { id: "r8q1", type: "tap", accent: AC,
      prompt: { en: "AB is extended to E. The exterior angle ∠EBC is marked. Tap the interior angle it equals.", af: "AB is verleng tot by E. Die buitehoek ∠EBC is gemerk. Klik op die binnehoek waaraan dit gelyk is." },
      diagram: { pts: { A: 165, B: 95, C: 5, D: 250 }, out: [{ name: "E", along: ["A", "B"], len: 34 }],
        chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["B", "E"]],
        angles: [
          { at: "B", legs: ["E", "C"], t: "•", o: { v: 80 } },
          { at: "D", legs: ["A", "C"], t: "", o: { v: 80 } },
          { at: "A", legs: ["D", "B"], t: "", o: {} },
          { at: "C", legs: ["B", "D"], t: "", o: {} } ] },
      tap: { targets: [ { id: "d", kind: "angle", angleIndex: 1 }, { id: "a", kind: "angle", angleIndex: 2 }, { id: "c", kind: "angle", angleIndex: 3 } ], correctId: "d" },
      answer: { en: "The exterior angle at B equals the interior opposite angle ∠D.", af: "Die buitehoek by B is gelyk aan die teenoorstaande binnehoek ∠D." }, explainReason: "cyclicExt" },

    { id: "r8q2", type: "calc-mc", accent: AC,
      prompt: { en: "The exterior angle of a cyclic quad at B is ∠EBC = 85°. Find the interior opposite angle ∠D.", af: "Die buitehoek van 'n koordevierhoek by B is ∠EBC = 85°. Bereken die teenoorstaande binnehoek ∠D." },
      diagram: { pts: { A: 165, B: 95, C: 5, D: 250 }, out: [{ name: "E", along: ["A", "B"], len: 34 }],
        chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["B", "E"]],
        angles: [ { at: "B", legs: ["E", "C"], t: "85°", o: { v: 80 } }, { at: "D", legs: ["A", "C"], t: "x", o: { v: 80 } } ] },
      options: [ { text: "85°", correct: true }, { text: "95°" }, { text: "170°" }, { text: "42,5°" } ],
      answer: { en: "∠D = ∠EBC = 85° (exterior = interior opposite).", af: "∠D = ∠EBC = 85° (buitehoek = teenoorstaande binnehoek)." }, explainReason: "cyclicExt" },

    { id: "r8q3", type: "reason", accent: AC,
      prompt: { en: "Why does the exterior angle ∠EBC equal the interior angle ∠D?", af: "Hoekom is die buitehoek ∠EBC gelyk aan die binnehoek ∠D?" },
      diagram: { pts: { A: 165, B: 95, C: 5, D: 250 }, out: [{ name: "E", along: ["A", "B"], len: 34 }],
        chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["B", "E"]],
        angles: [ { at: "B", legs: ["E", "C"], t: "", o: { v: 80 } }, { at: "D", legs: ["A", "C"], t: "", o: { v: 80 } } ] },
      options: [ { code: "cyclicExt", correct: true }, { code: "cyclicOpp" }, { code: "straightLine" }, { code: "tanChord" } ],
      answer: { en: "Exterior angle of a cyclic quad = interior opposite angle.", af: "Buitehoek van 'n koordevierhoek = teenoorstaande binnehoek." }, explainReason: "cyclicExt" },

    // CD extended past D to F -> exterior ∠FDA equals interior opposite ∠B
    { id: "r8q4", type: "tap", accent: AC,
      prompt: { en: "CD is extended to F. Tap the interior angle equal to the exterior angle ∠FDA.", af: "CD is verleng tot by F. Klik op die binnehoek gelyk aan die buitehoek ∠FDA." },
      diagram: { pts: { A: 160, B: 70, C: 350, D: 250 }, out: [{ name: "F", along: ["C", "D"], len: 32 }],
        chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["D", "F"]],
        angles: [
          { at: "D", legs: ["F", "A"], t: "•", o: { v: 95 } },
          { at: "B", legs: ["A", "C"], t: "", o: { v: 95 } },
          { at: "A", legs: ["D", "B"], t: "", o: {} },
          { at: "C", legs: ["B", "D"], t: "", o: {} } ] },
      tap: { targets: [ { id: "b", kind: "angle", angleIndex: 1 }, { id: "a", kind: "angle", angleIndex: 2 }, { id: "c", kind: "angle", angleIndex: 3 } ], correctId: "b" },
      answer: { en: "The exterior angle at D equals the interior opposite angle ∠B.", af: "Die buitehoek by D is gelyk aan die teenoorstaande binnehoek ∠B." }, explainReason: "cyclicExt" },

    { id: "r8q5", type: "yesno", accent: AC,
      prompt: { en: "Is the exterior angle of a cyclic quad equal to the interior opposite angle?", af: "Is die buitehoek van 'n koordevierhoek gelyk aan die teenoorstaande binnehoek?" },
      diagram: { pts: { A: 165, B: 95, C: 5, D: 250 }, out: [{ name: "E", along: ["A", "B"], len: 34 }],
        chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["B", "E"]],
        angles: [ { at: "B", legs: ["E", "C"], t: "", o: { v: 80 } }, { at: "D", legs: ["A", "C"], t: "", o: { v: 80 } } ] },
      yes: true, answer: { en: "Yes — exterior = interior opposite.", af: "Ja — buitehoek = teenoorstaande binnehoek." }, explainReason: "cyclicExt" },

    { id: "r8q6", type: "yesno", accent: AC,
      prompt: { en: "Does the exterior angle at B equal the ADJACENT interior angle ∠C?", af: "Is die buitehoek by B gelyk aan die AANGRENSENDE binnehoek ∠C?" },
      diagram: { pts: { A: 165, B: 95, C: 5, D: 250 }, out: [{ name: "E", along: ["A", "B"], len: 34 }],
        chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["B", "E"]],
        angles: [ { at: "B", legs: ["E", "C"], t: "", o: { v: 80 } }, { at: "C", legs: ["B", "D"], t: "", o: {} } ] },
      yes: false, answer: { en: "No — it equals the OPPOSITE interior angle ∠D, not the adjacent one.", af: "Nee — dit is gelyk aan die TEENOORSTAANDE binnehoek ∠D, nie die aangrensende nie." }, explainReason: "cyclicExt" },

    { id: "r8q7", type: "calc-mc", accent: AC,
      prompt: { en: "The exterior angle at D is ∠FDA = 95°. Find the interior opposite angle ∠B.", af: "Die buitehoek by D is ∠FDA = 95°. Bereken die teenoorstaande binnehoek ∠B." },
      diagram: { pts: { A: 160, B: 70, C: 350, D: 250 }, out: [{ name: "F", along: ["C", "D"], len: 32 }],
        chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["D", "F"]],
        angles: [ { at: "D", legs: ["F", "A"], t: "95°", o: { v: 95 } }, { at: "B", legs: ["A", "C"], t: "x", o: { v: 95 } } ] },
      options: [ { text: "95°", correct: true }, { text: "85°" }, { text: "105°" }, { text: "75°" } ],
      answer: { en: "∠B = 95° (exterior = interior opposite).", af: "∠B = 95° (buitehoek = teenoorstaande binnehoek)." }, explainReason: "cyclicExt" },

    { id: "r8q8", type: "calc-mc", accent: AC,
      prompt: { en: "AB is extended to E. The exterior angle ∠EBC = 80°. Find the interior opposite angle ∠ADC.", af: "AB is verleng tot by E. Die buitehoek ∠EBC = 80°. Bereken die teenoorstaande binnehoek ∠ADC." },
      diagram: { pts: { A: 165, B: 95, C: 5, D: 250 }, out: [{ name: "E", along: ["A", "B"], len: 34 }],
        chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["B", "E"]],
        angles: [ { at: "B", legs: ["E", "C"], t: "80°", o: { v: 80 } }, { at: "D", legs: ["A", "C"], t: "x", o: { v: 80 } } ] },
      options: [ { text: "80°", correct: true }, { text: "100°" }, { text: "90°" }, { text: "160°" } ],
      answer: { en: "∠ADC = ∠EBC = 80° (exterior = interior opposite).", af: "∠ADC = ∠EBC = 80° (buitehoek = teenoorstaande binnehoek)." }, explainReason: "cyclicExt" },

    { id: "r8q9", type: "yesno", accent: AC,
      prompt: { en: "CD is extended to F. Is the exterior angle ∠FDA equal to the interior opposite angle ∠B?", af: "CD is verleng tot by F. Is die buitehoek ∠FDA gelyk aan die teenoorstaande binnehoek ∠B?" },
      diagram: { pts: { A: 160, B: 70, C: 350, D: 250 }, out: [{ name: "F", along: ["C", "D"], len: 32 }],
        chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["D", "F"]],
        angles: [ { at: "D", legs: ["F", "A"], t: "", o: { v: 95 } }, { at: "B", legs: ["A", "C"], t: "", o: { v: 95 } } ] },
      yes: true, answer: { en: "Yes — exterior = interior opposite angle.", af: "Ja — buitehoek = teenoorstaande binnehoek." }, explainReason: "cyclicExt" },

    { id: "r8q10", type: "reason", accent: AC,
      prompt: { en: "AB is extended to E. Why does ∠EBC = ∠ADC?", af: "AB is verleng tot by E. Hoekom is ∠EBC = ∠ADC?" },
      diagram: { pts: { A: 165, B: 95, C: 5, D: 250 }, out: [{ name: "E", along: ["A", "B"], len: 34 }],
        chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["B", "E"]],
        angles: [ { at: "B", legs: ["E", "C"], t: "", o: { v: 80 } }, { at: "D", legs: ["A", "C"], t: "", o: { v: 80 } } ] },
      options: [ { code: "cyclicExt", correct: true }, { code: "cyclicOpp" }, { code: "straightLine" }, { code: "sameSeg" } ],
      answer: { en: "Exterior angle of a cyclic quad = interior opposite angle.", af: "Buitehoek van 'n koordevierhoek = teenoorstaande binnehoek." }, explainReason: "cyclicExt" },
  ],
};
