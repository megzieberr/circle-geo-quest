/* Round 4 — Angle in a semicircle (= 90°, only when the chord is a diameter).
   yes/no "is this 90°?" (learner must spot a true diameter through O) and
   tap which angle the diameter subtends as a right angle. */
const AC = "#4263eb";

export const round = {
  id: "r4", n: 4, accent: AC,
  title: { en: "Angle in a semicircle", af: "Hoek in 'n semi sirkel" },
  blurb: { en: "A diameter subtends 90° at the circumference.", af: "’n Middellyn onderspan 90° by die omtrek." },
  reasonCode: "semiCircle",
  questionsPerPlay: 10,
  questions: [
    { id: "r4q1", type: "yesno", accent: AC,
      prompt: { en: "AB passes through the centre O. Is ∠APB = 90°?", af: "AB gaan deur die middelpunt O. Is ∠APB = 90°?" },
      diagram: { O: true, pts: { A: 180, B: 0, P: 65 }, chords: [["A", "B"], ["A", "P"], ["B", "P"]], angles: [{ at: "P", legs: ["A", "B"], t: "?", o: { v: 90 } }] },
      yes: true, answer: { en: "Yes — AB is a diameter, so ∠P = 90°.", af: "Ja — AB is 'n middellyn, dus ∠P = 90°." }, explainReason: "semiCircle" },

    { id: "r4q2", type: "yesno", accent: AC,
      prompt: { en: "Here AB does NOT pass through O. Is ∠APB = 90°?", af: "Hier gaan AB NIE deur O nie. Is ∠APB = 90°?" },
      diagram: { O: true, pts: { A: 150, B: 60, P: 270 }, chords: [["A", "B"], ["A", "P"], ["B", "P"]], angles: [{ at: "P", legs: ["A", "B"], t: "?", o: { v: 45 } }] },
      yes: false, answer: { en: "No — AB is just a chord, not a diameter, so ∠P ≠ 90°.", af: "Nee — AB is net 'n koord, nie 'n middellyn nie, dus ∠P ≠ 90°." }, explainReason: "semiCircle" },

    { id: "r4q3", type: "yesno", accent: AC,
      prompt: { en: "AB is a diameter (through O). Is ∠APB = 90°?", af: "AB is 'n middellyn (deur O). Is ∠APB = 90°?" },
      diagram: { O: true, pts: { A: 180, B: 0, P: 118 }, chords: [["A", "B"], ["A", "P"], ["B", "P"]], angles: [{ at: "P", legs: ["A", "B"], t: "?", o: { v: 90 } }] },
      yes: true, answer: { en: "Yes — the angle in a semicircle is 90°.", af: "Ja — die hoek in 'n semi sirkel is 90°." }, explainReason: "semiCircle" },

    { id: "r4q4", type: "yesno", accent: AC,
      prompt: { en: "AB does not go through O. Is ∠APB = 90°?", af: "AB gaan nie deur O nie. Is ∠APB = 90°?" },
      diagram: { O: true, pts: { A: 140, B: 40, P: 270 }, chords: [["A", "B"], ["A", "P"], ["B", "P"]], angles: [{ at: "P", legs: ["A", "B"], t: "?", o: { v: 50 } }] },
      yes: false, answer: { en: "No — not a diameter, so the angle is not 90°.", af: "Nee — nie 'n middellyn nie, dus is die hoek nie 90° nie." }, explainReason: "semiCircle" },

    { id: "r4q5", type: "tap", accent: AC,
      prompt: { en: "AB is a diameter. Tap the angle that equals 90°.", af: "AB is 'n middellyn. Klik op die hoek wat 90° is." },
      diagram: { O: true, pts: { A: 180, B: 0, P: 70 }, chords: [["A", "B"], ["A", "P"], ["B", "P"]],
        angles: [ { at: "P", legs: ["A", "B"], t: "", o: { v: 90 } }, { at: "A", legs: ["B", "P"], t: "", o: {} }, { at: "B", legs: ["A", "P"], t: "", o: {} } ] },
      tap: { targets: [ { id: "p", kind: "angle", angleIndex: 0 }, { id: "a", kind: "angle", angleIndex: 1 }, { id: "b", kind: "angle", angleIndex: 2 } ], correctId: "p" },
      answer: { en: "∠P = 90° — the diameter subtends a right angle at P.", af: "∠P = 90° — die middellyn onderspan 'n regte hoek by P." }, explainReason: "semiCircle" },

    { id: "r4q6", type: "tap", accent: AC,
      prompt: { en: "AB is a diameter. Tap the right angle.", af: "AB is 'n middellyn. Klik op die regte hoek." },
      diagram: { O: true, pts: { A: 180, B: 0, P: 250 }, chords: [["A", "B"], ["A", "P"], ["B", "P"]],
        angles: [ { at: "P", legs: ["A", "B"], t: "", o: { v: 90 } }, { at: "A", legs: ["B", "P"], t: "", o: {} }, { at: "B", legs: ["A", "P"], t: "", o: {} } ] },
      tap: { targets: [ { id: "p", kind: "angle", angleIndex: 0 }, { id: "a", kind: "angle", angleIndex: 1 }, { id: "b", kind: "angle", angleIndex: 2 } ], correctId: "p" },
      answer: { en: "The right angle sits at P, opposite the diameter.", af: "Die regte hoek sit by P, oorkant die middellyn." }, explainReason: "semiCircle" },

    { id: "r4q7", type: "calc-mc", accent: AC,
      prompt: { en: "AB is a diameter. What is ∠APB?", af: "AB is 'n middellyn. Wat is ∠APB?" },
      diagram: { O: true, pts: { A: 180, B: 0, P: 95 }, chords: [["A", "B"], ["A", "P"], ["B", "P"]], angles: [{ at: "P", legs: ["A", "B"], t: "?", o: { v: 90 } }] },
      options: [ { text: "90°", correct: true }, { text: "180°" }, { text: "45°" }, { text: "60°" } ],
      answer: { en: "90° — the angle in a semicircle.", af: "90° — die hoek in 'n semi sirkel." }, explainReason: "semiCircle" },

    { id: "r4q8", type: "calc-mc", accent: AC,
      prompt: { en: "AB is a diameter and ∠PAB = 35°. Find x = ∠PBA.", af: "AB is 'n middellyn en ∠PAB = 35°. Bereken x = ∠PBA." },
      diagram: { O: true, pts: { A: 180, B: 0, P: 70 }, chords: [["A", "B"], ["A", "P"], ["B", "P"]],
        angles: [ { at: "A", legs: ["B", "P"], t: "35°", o: { v: 35 } }, { at: "B", legs: ["A", "P"], t: "x", o: { v: 55 } }, { at: "P", legs: ["A", "B"], t: "", o: { v: 90, mark: 1 } } ] },
      options: [ { text: "55°", correct: true }, { text: "45°" }, { text: "35°" }, { text: "65°" } ],
      answer: { en: "∠P = 90°, so x = 180° − 90° − 35° = 55°.", af: "∠P = 90°, dus x = 180° − 90° − 35° = 55°." }, explainReason: "semiCircle" },

    { id: "r4q9", type: "yesno", accent: AC,
      prompt: { en: "AB is a diameter (through O). Is ∠APB = 90°?", af: "AB is 'n middellyn (deur O). Is ∠APB = 90°?" },
      diagram: { O: true, pts: { A: 180, B: 0, P: 50 }, chords: [["A", "B"], ["A", "P"], ["B", "P"]], angles: [{ at: "P", legs: ["A", "B"], t: "?", o: { v: 90 } }] },
      yes: true, answer: { en: "Yes — the angle in a semicircle is 90°.", af: "Ja — die hoek in 'n semi sirkel is 90°." }, explainReason: "semiCircle" },

    { id: "r4q10", type: "calc-mc", accent: AC,
      prompt: { en: "AB is a diameter and ∠PAB = 40°. Find x = ∠PBA.", af: "AB is 'n middellyn en ∠PAB = 40°. Bereken x = ∠PBA." },
      diagram: { O: true, pts: { A: 180, B: 0, P: 80 }, chords: [["A", "B"], ["A", "P"], ["B", "P"]],
        angles: [ { at: "A", legs: ["B", "P"], t: "40°", o: { v: 40 } }, { at: "B", legs: ["A", "P"], t: "x", o: { v: 50 } }, { at: "P", legs: ["A", "B"], t: "", o: { v: 90, mark: 1 } } ] },
      options: [ { text: "50°", correct: true }, { text: "40°" }, { text: "90°" }, { text: "60°" } ],
      answer: { en: "∠P = 90°, so x = 180° − 90° − 40° = 50°.", af: "∠P = 90°, dus x = 180° − 90° − 40° = 50°." }, explainReason: "semiCircle" },
  ],
};
