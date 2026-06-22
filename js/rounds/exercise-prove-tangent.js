/* EXERCISE — Proving a line is a tangent (graded, 80%).
   Two converse tests: a line ⊥ to a radius at a point on the circle is a
   tangent (converse tan ⊥ radius); and a line making an angle with a chord
   equal to the angle in the alternate segment is a tangent (converse tan-chord).
   Reasons are CONVERSES, with the forward reason as a trap distractor. */
const AC = "#f76707";

const TAN_PERP = { O: true, pts: { T: 270 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["O", "T"]],
  angles: [{ at: "T", legs: ["tg+", "O"], t: "", o: { v: 90, mark: 1 } }] };
const NOT_PERP = { O: true, pts: { T: 270 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["O", "T"]],
  angles: [{ at: "T", legs: ["tg+", "O"], t: "", o: { v: 90 } }] };
const TAN_CHORD = { O: true, pts: { T: 270, B: 40, P: 165 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["T", "B"], ["P", "T"], ["P", "B"]],
  angles: [{ at: "T", legs: ["tg+", "B"], t: "", o: { c: "#f76707" } }, { at: "P", legs: ["T", "B"], t: "", o: { c: "#4263eb" } }] };

export const round = {
  id: "eprovetan", n: 1, accent: AC, group: "g3",
  title: { en: "Prove a tangent", af: "Bewys 'n raaklyn" },
  blurb: { en: "Decide if a line is a tangent, and say why.", af: "Besluit of 'n lyn 'n raaklyn is, en sê hoekom." },
  reasonCode: "tanRadiusConv",
  questionsPerPlay: 10,
  defaultHints: [
    { en: "To PROVE a line is a tangent, test a CONVERSE: is it ⊥ to the radius at a point on the circle? OR does it make an angle with a chord equal to the angle in the alternate segment?",
      af: "Om te BEWYS 'n lyn is 'n raaklyn, toets 'n OMGEKEERDE: is dit ⊥ op die radius by 'n punt op die sirkel? OF maak dit 'n hoek met 'n koord gelyk aan die hoek in die oorstaande segment?",
    },
    { en: "If yes, it IS a tangent — and the reason is the CONVERSE ('line ⊥ radius ⇒ tangent'), not the forward 'tan ⊥ radius'. If the angle isn't 90° (or the alternate-segment angles differ), it is NOT a tangent.",
      af: "Indien wel, IS dit 'n raaklyn — en die rede is die OMGEKEERDE ('lyn ⊥ radius ⇒ raaklyn'), nie die voorwaartse 'raaklyn ⊥ radius' nie. As die hoek nie 90° is nie (of die oorstaande-segment-hoeke verskil), is dit NIE 'n raaklyn nie.",
    },
  ],
  questions: [
    { id: "pt1", type: "yesno", accent: AC, diagram: TAN_PERP, yes: true,
      prompt: { en: "Line SU passes through T on the circle, and the radius OT ⊥ SU. Is SU a tangent?", af: "Lyn SU gaan deur T op die sirkel, en die radius OT ⊥ SU. Is SU 'n raaklyn?" },
      answer: { en: "Yes — a line ⊥ to the radius at a point on the circle is a tangent.", af: "Ja — 'n lyn ⊥ op die radius by 'n punt op die sirkel is 'n raaklyn." },
      explainReason: "tanRadiusConv" },

    { id: "pt2", type: "yesno", accent: AC, diagram: NOT_PERP, yes: false,
      prompt: { en: "Line SU passes through T on the circle, but the angle between OT and SU is 80°. Is SU a tangent?", af: "Lyn SU gaan deur T op die sirkel, maar die hoek tussen OT en SU is 80°. Is SU 'n raaklyn?" },
      answer: { en: "No — it must be 90° (⊥ to the radius) to be a tangent.", af: "Nee — dit moet 90° wees (⊥ op die radius) om 'n raaklyn te wees." },
      explainReason: "tanRadiusConv" },

    { id: "pt3", type: "reason", accent: AC, diagram: TAN_PERP,
      prompt: { en: "SU ⊥ radius OT at T (on the circle). Which reason proves SU is a tangent? (Pick the converse.)", af: "SU ⊥ radius OT by T (op die sirkel). Watter rede bewys SU is 'n raaklyn? (Kies die omgekeerde.)" },
      options: [{ code: "tanRadiusConv", correct: true }, { code: "tanRadius" }, { code: "tanChordConv" }, { code: "tansCommonPt" }],
      answer: { en: "Line ⊥ radius at a point on the circle ⇒ tangent — the CONVERSE reason.", af: "Lyn ⊥ radius by 'n punt op die sirkel ⇒ raaklyn — die OMGEKEERDE rede." },
      explainReason: "tanRadiusConv" },

    { id: "pt4", type: "yesno", accent: AC, diagram: TAN_CHORD, yes: true,
      prompt: { en: "At T, the angle between line SU and chord TB equals ∠TPB (the angle in the alternate segment). Is SU a tangent at T?", af: "By T is die hoek tussen lyn SU en koord TB gelyk aan ∠TPB (die hoek in die oorstaande segment). Is SU 'n raaklyn by T?" },
      answer: { en: "Yes — equal to the angle in the alternate segment ⇒ SU is a tangent.", af: "Ja — gelyk aan die hoek in die oorstaande segment ⇒ SU is 'n raaklyn." },
      explainReason: "tanChordConv" },

    { id: "pt5", type: "reason", accent: AC, diagram: TAN_CHORD,
      prompt: { en: "The angle between SU and chord TB equals the angle in the alternate segment. Which reason proves SU is a tangent? (Pick the converse.)", af: "Die hoek tussen SU en koord TB is gelyk aan die hoek in die oorstaande segment. Watter rede bewys SU is 'n raaklyn? (Kies die omgekeerde.)" },
      options: [{ code: "tanChordConv", correct: true }, { code: "tanChord" }, { code: "tanRadiusConv" }, { code: "sameSeg" }],
      answer: { en: "Angle = angle in alternate segment ⇒ tangent — the CONVERSE reason.", af: "Hoek = hoek in oorstaande segment ⇒ raaklyn — die OMGEKEERDE rede." },
      explainReason: "tanChordConv" },

    { id: "pt6", type: "mc", accent: AC,
      prompt: { en: "Which fact proves a line is a tangent to a circle?", af: "Watter feit bewys 'n lyn is 'n raaklyn aan 'n sirkel?" },
      options: [
        { text: { en: "It is ⊥ to the radius at a point on the circle", af: "Dit is ⊥ op die radius by 'n punt op die sirkel" }, correct: true },
        { text: { en: "It passes through the centre", af: "Dit gaan deur die middelpunt" } },
        { text: { en: "It cuts the circle at two points", af: "Dit sny die sirkel by twee punte" } },
        { text: { en: "It is the longest chord", af: "Dit is die langste koord" } },
      ],
      answer: { en: "Perpendicular to the radius at a point on the circle ⇒ tangent.", af: "Loodreg op die radius by 'n punt op die sirkel ⇒ raaklyn." },
      explainReason: "tanRadiusConv" },

    { id: "pt7", type: "yesno", accent: AC, diagram: TAN_PERP, yes: true,
      prompt: { en: "OT is a radius and SU ⊥ OT exactly at T, where T is on the circle. Is SU a tangent?", af: "OT is 'n radius en SU ⊥ OT presies by T, waar T op die sirkel is. Is SU 'n raaklyn?" },
      answer: { en: "Yes — 90° to the radius at the point of contact ⇒ tangent.", af: "Ja — 90° op die radius by die raakpunt ⇒ raaklyn." },
      explainReason: "tanRadiusConv" },

    { id: "pt8", type: "reason", accent: AC, diagram: TAN_PERP,
      prompt: { en: "To PROVE SU is a tangent (you showed SU ⊥ OT at T), which reason is correct — the converse or the forward one?", af: "Om te BEWYS SU is 'n raaklyn (jy het gewys SU ⊥ OT by T), watter rede is reg — die omgekeerde of die vorentoe een?" },
      options: [{ code: "tanRadiusConv", correct: true }, { code: "tanRadius" }, { code: "tanDiameter" }, { code: "semiCircle" }],
      answer: { en: "Use the converse: line ⊥ radius ⇒ tangent.", af: "Gebruik die omgekeerde: lyn ⊥ radius ⇒ raaklyn." },
      explainReason: "tanRadiusConv" },

    { id: "pt9", type: "yesno", accent: AC, diagram: TAN_CHORD, yes: false,
      prompt: { en: "At T, the angle between line SU and chord TB is 50°, but the angle in the alternate segment ∠TPB is 60°. Is SU a tangent?", af: "By T is die hoek tussen lyn SU en koord TB 50°, maar die hoek in die oorstaande segment ∠TPB is 60°. Is SU 'n raaklyn?" },
      answer: { en: "No — the two angles are not equal, so SU is not a tangent.", af: "Nee — die twee hoeke is nie gelyk nie, dus is SU nie 'n raaklyn nie." },
      explainReason: "tanChordConv" },

    { id: "pt10", type: "mc", accent: AC, diagram: TAN_PERP,
      prompt: { en: "SU touches the circle at T. What must the angle between SU and radius OT be?", af: "SU raak die sirkel by T. Wat moet die hoek tussen SU en radius OT wees?" },
      options: [{ text: "90°", correct: true }, { text: "45°" }, { text: "180°" }, { text: "60°" }],
      answer: { en: "90° — a tangent is perpendicular to the radius at the point of contact.", af: "90° — 'n raaklyn is loodreg op die radius by die raakpunt." },
      explainReason: "tanRadiusConv" },
  ],
};
