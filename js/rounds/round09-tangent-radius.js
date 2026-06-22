/* Round 9 — A tangent is perpendicular to the radius at the point of contact.
   Confirm / tap the 90° angle, pick the "tan ⊥ radius" reason. */
const AC = "#4263eb";

const D_BASE = { O: true, pts: { T: 270 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["O", "T"]],
  angles: [{ at: "T", legs: ["tg+", "O"], t: "", o: { v: 90, mark: 1 } }] };

export const round = {
  id: "r9", n: 9, accent: AC,
  title: { en: "Tangent ⊥ radius", af: "Raaklyn ⊥ radius" },
  blurb: { en: "A tangent meets the radius at 90°.", af: "’n Raaklyn ontmoet die radius teen 90°." },
  reasonCode: "tanRadius",
  questionsPerPlay: 10,
  defaultHints: [
    { en: "A tangent meets the radius (or diameter) at the point of contact at exactly 90°.",
      af: "'n Raaklyn ontmoet die radius (of middellyn) by die raakpunt teen presies 90°." },
    { en: "So the radius/diameter and the tangent make a right angle there. Subtract the given part from 90° to find the rest.",
      af: "Dus maak die radius/middellyn en die raaklyn daar 'n regte hoek. Trek die gegewe deel van 90° af om die res te kry." },
  ],
  questions: [
    { id: "r9q1", type: "yesno", accent: AC,
      prompt: { en: "OT is a radius and STU is a tangent at T. Is ∠OTU = 90°?", af: "OT is 'n radius en STU is 'n raaklyn by T. Is ∠OTU = 90°?" },
      diagram: D_BASE, yes: true,
      answer: { en: "Yes — a tangent is perpendicular to the radius at the point of contact.", af: "Ja — 'n raaklyn is loodreg op die radius by die raakpunt." }, explainReason: "tanRadius" },

    { id: "r9q2", type: "tap", accent: AC,
      prompt: { en: "STU is a tangent at T. Tap the line that is perpendicular to the tangent.", af: "STU is 'n raaklyn by T. Klik op die lyn wat loodreg op die raaklyn is." },
      diagram: { O: true, pts: { T: 270, A: 35 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["O", "T"], ["T", "A"]] },
      tap: { targets: [ { id: "radius", kind: "radius", from: "O", to: "T" }, { id: "tan", kind: "tangentLine", at: "T" }, { id: "chord", kind: "chord", a: "T", b: "A" } ], correctId: "radius" },
      answer: { en: "The radius OT ⊥ the tangent at T.", af: "Die radius OT ⊥ die raaklyn by T." }, explainReason: "tanRadius" },

    { id: "r9q3", type: "reason", accent: AC,
      prompt: { en: "Which reason justifies ∠OTU = 90°?", af: "Watter rede regverdig ∠OTU = 90°?" },
      diagram: D_BASE,
      options: [ { code: "tanRadius", correct: true }, { code: "semiCircle" }, { code: "tanChord" }, { code: "centrePerpChord" } ],
      answer: { en: "tan ⊥ radius.", af: "raaklyn ⊥ radius." }, explainReason: "tanRadius" },

    { id: "r9q4", type: "calc-mc", accent: AC,
      prompt: { en: "STU is a tangent at T and OT a radius. If ∠OTA = 60°, find x = ∠ATU.", af: "STU is 'n raaklyn by T en OT 'n radius. As ∠OTA = 60°, bereken x = ∠ATU." },
      diagram: { O: true, pts: { T: 270, A: 330 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["O", "T"], ["T", "A"]],
        angles: [ { at: "T", legs: ["O", "A"], t: "60°", o: { v: 60 } }, { at: "T", legs: ["A", "tg+"], t: "x", o: { v: 30 } } ] },
      options: [ { text: "30°", correct: true }, { text: "60°" }, { text: "90°" }, { text: "120°" } ],
      answer: { en: "∠OTU = 90°, so x = 90° − 60° = 30°.", af: "∠OTU = 90°, dus x = 90° − 60° = 30°." }, explainReason: "tanRadius" },

    { id: "r9q5", type: "yesno", accent: AC,
      prompt: { en: "Does a tangent always make a 90° angle with the radius drawn to the point of contact?", af: "Maak 'n raaklyn altyd 'n 90°-hoek met die radius na die raakpunt?" },
      diagram: D_BASE, yes: true,
      answer: { en: "Yes — always 90° (tan ⊥ radius).", af: "Ja — altyd 90° (raaklyn ⊥ radius)." }, explainReason: "tanRadius" },

    { id: "r9q6", type: "tap", accent: AC,
      prompt: { en: "Tap the right angle between the tangent and the radius.", af: "Klik op die regte hoek tussen die raaklyn en die radius." },
      diagram: { O: true, pts: { T: 200 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["O", "T"]],
        angles: [ { at: "T", legs: ["tg+", "O"], t: "", o: { v: 90, mark: 1 } } ] },
      tap: { targets: [ { id: "ra", kind: "angle", angleIndex: 0 } ], correctId: "ra" },
      answer: { en: "90° — tan ⊥ radius at the point of contact.", af: "90° — raaklyn ⊥ radius by die raakpunt." }, explainReason: "tanRadius" },

    { id: "r9q7", type: "calc-mc", accent: AC,
      prompt: { en: "STU is a tangent at T and ∠ATU = 25°, with A on the circle. Find ∠OTA (O the centre).", af: "STU is 'n raaklyn by T en ∠ATU = 25°, met A op die sirkel. Bereken ∠OTA (O die middelpunt)." },
      diagram: { O: true, pts: { T: 270, A: 320 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["O", "T"], ["T", "A"]],
        angles: [ { at: "T", legs: ["A", "tg+"], t: "25°", o: { v: 25, r: 38 } }, { at: "T", legs: ["O", "A"], t: "x", o: { v: 65 } } ] },
      options: [ { text: "65°", correct: true }, { text: "25°" }, { text: "90°" }, { text: "115°" } ],
      answer: { en: "∠OTU = 90°, so ∠OTA = 90° − 25° = 65°.", af: "∠OTU = 90°, dus ∠OTA = 90° − 25° = 65°." }, explainReason: "tanRadius" },

    { id: "r9q8", type: "reason", accent: AC,
      prompt: { en: "OT is a radius and STU is a tangent at T. Which reason gives ∠OTS = 90°?", af: "OT is 'n radius en STU is 'n raaklyn by T. Watter rede gee ∠OTS = 90°?" },
      diagram: D_BASE,
      options: [ { code: "tanRadius", correct: true }, { code: "tanChord" }, { code: "semiCircle" }, { code: "centreMidChord" } ],
      answer: { en: "tan ⊥ radius.", af: "raaklyn ⊥ radius." }, explainReason: "tanRadius" },

    { id: "r9q9", type: "yesno", accent: AC,
      prompt: { en: "Is a tangent perpendicular to the radius drawn to the point of contact?", af: "Is 'n raaklyn loodreg op die radius na die raakpunt?" },
      diagram: D_BASE, yes: true,
      answer: { en: "Yes — tan ⊥ radius.", af: "Ja — raaklyn ⊥ radius." }, explainReason: "tanRadius" },

    { id: "r9q10", type: "calc-mc", accent: AC,
      prompt: { en: "STU is a tangent at T and OT a radius. If ∠OTA = 70°, find x = ∠ATU.", af: "STU is 'n raaklyn by T en OT 'n radius. As ∠OTA = 70°, bereken x = ∠ATU." },
      diagram: { O: true, pts: { T: 270, A: 310 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["O", "T"], ["T", "A"]],
        angles: [ { at: "T", legs: ["O", "A"], t: "70°", o: { v: 70 } }, { at: "T", legs: ["A", "tg+"], t: "x", o: { v: 20, r: 40 } } ] },
      options: [ { text: "20°", correct: true }, { text: "70°" }, { text: "90°" }, { text: "110°" } ],
      answer: { en: "∠OTU = 90°, so x = 90° − 70° = 20°.", af: "∠OTU = 90°, dus x = 90° − 70° = 20°." }, explainReason: "tanRadius" },

    // ---- relocated from Round 10 (tan-chord): a diameter is a radius, so these
    // use tan ⊥ diameter — the same theorem, met here for the first time. ----
    { id: "r9q11", type: "calc-mc", accent: AC,
      prompt: { en: "STU is a tangent at T and TD is a diameter. Calculate x, with reasons.", af: "STU is 'n raaklyn by T en TD is 'n middellyn. Bereken x, met redes." },
      diagram: { O: true, pts: { T: 270, D: 90, A: 140 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["T", "D"], ["T", "A"], ["D", "A"]],
        angles: [ { at: "T", legs: ["tg-", "A"], t: "65°", o: { v: 65 } }, { at: "T", legs: ["A", "D"], t: "x", o: { v: 25 } } ] },
      options: [ { text: "x = 25°", correct: true }, { text: "x = 65°" }, { text: "x = 155°" }, { text: "x = 35°" } ],
      answer: { en: "∠STD = 90° (tan ⊥ diameter), so x = 90° − 65° = 25°.", af: "∠STD = 90° (raaklyn ⊥ middellyn), dus x = 90° − 65° = 25°." }, explainReason: "tanDiameter" },

    { id: "r9q12", type: "calc-mc", accent: AC,
      prompt: { en: "STU is a tangent at T and TD is a diameter. Calculate x, with reasons.", af: "STU is 'n raaklyn by T en TD is 'n middellyn. Bereken x, met redes." },
      diagram: { O: true, pts: { T: 270, D: 90, A: 326 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["T", "D"], ["T", "A"], ["D", "A"]],
        angles: [ { at: "T", legs: ["tg+", "A"], t: "28°", o: { v: 28 } }, { at: "T", legs: ["A", "D"], t: "x", o: { v: 62 } } ] },
      options: [ { text: "x = 62°", correct: true }, { text: "x = 28°" }, { text: "x = 118°" }, { text: "x = 152°" } ],
      answer: { en: "∠UTD = 90° (tan ⊥ diameter), so x = 90° − 28° = 62°.", af: "∠UTD = 90° (raaklyn ⊥ middellyn), dus x = 90° − 28° = 62°." }, explainReason: "tanDiameter" },

    { id: "r9q13", type: "calc-mc", accent: AC,
      hints: [
        { en: "STU is a tangent and TA a diameter, so ∠UTA = 90° (tan ⊥ diameter).",
          af: "STU is 'n raaklyn en TA 'n middellyn, dus ∠UTA = 90° (raaklyn ⊥ middellyn)." },
        { en: "TA is a diameter, so the angle at P standing on it is 90° (angle in a semicircle). That angle is 3x, so 3x = 90°.",
          af: "TA is 'n middellyn, dus is die hoek by P wat daarop staan 90° (hoek in 'n semi sirkel). Daardie hoek is 3x, dus 3x = 90°." },
      ],
      prompt: { en: "STU is a tangent at T and TA is a diameter. Calculate the value of x.", af: "STU is 'n raaklyn by T en TA is 'n middellyn. Bereken die waarde van x." },
      diagram: { O: true, pts: { T: 270, A: 90, P: 170 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["T", "A"], ["P", "T"], ["P", "A"]],
        angles: [ { at: "T", legs: ["tg+", "A"], t: "", o: { v: 90, mark: 1 } }, { at: "P", legs: ["T", "A"], t: "3x", o: { v: 90 } } ] },
      options: [ { text: "x = 30°", correct: true }, { text: "x = 90°" }, { text: "x = 45°" }, { text: "x = 60°" } ],
      answer: { en: "∠UTA = 90° (tan ⊥ diameter); the angle in the alternate segment 3x = 90° (tan-chord), so x = 30°.", af: "∠UTA = 90° (raaklyn ⊥ middellyn); die hoek in die oorstaande segment 3x = 90° (raaklyn-koord), dus x = 30°." }, explainReason: "tanDiameter" },
  ],
};
