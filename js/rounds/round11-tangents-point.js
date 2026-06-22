/* Round 11 — Two tangents from the same external point are equal
   (and they make an isosceles triangle with equal base angles).
   Tap the equal tangent, pick the reason. */
const AC = "#e64980";

const BASE = { h: 284, cx: 160, cy: 94, R: 58, pts: { T: 340, S: 200 }, ext: [{ name: "P", t: ["T", "S"] }], chords: [["T", "S"]] };

/* Angle questions use the isosceles triangle PT = PS makes; the rest use the
   equal-tangents fact itself (the default). */
const HINT_ISOS = [
  { en: "PT = PS (tangents from the same point), so triangle PTS is isosceles. The angles opposite the equal sides (∠PTS and ∠PST) are equal.",
    af: "PT = PS (raaklyne vanaf dieselfde punt), dus is driehoek PTS gelykbenig. Die hoeke teenoor die gelyke sye (∠PTS en ∠PST) is gelyk." },
  { en: "The three angles of △PTS add to 180°. Take the apex angle ∠TPS off 180° and halve what's left for each base angle.",
    af: "Die drie hoeke van △PTS is saam 180°. Trek die apekshoek ∠TPS van 180° af en halveer wat oorbly vir elke basishoek." },
];

export const round = {
  id: "r11", n: 12, accent: AC,
  title: { en: "Tangents from one point", af: "Raaklyne vanaf een punt" },
  blurb: { en: "Two tangents from the same point are equal.", af: "Twee raaklyne vanaf dieselfde punt is gelyk." },
  reasonCode: "tansCommonPt",
  questionsPerPlay: 10,
  defaultHints: [
    { en: "Two tangents drawn to a circle from the same outside point P are equal in length: PT = PS.",
      af: "Twee raaklyne wat vanaf dieselfde buitepunt P na 'n sirkel geteken word, is ewe lank: PT = PS." },
    { en: "So whatever one tangent measures, the other is the same — they're equal.",
      af: "Dus wat ook al die een raaklyn is, die ander is dieselfde — hulle is gelyk." },
  ],
  questions: [
    { id: "r11q1", type: "tap", accent: AC,
      prompt: { en: "PT and PS are tangents from P. Tap the segment equal in length to PT.", af: "PT en PS is raaklyne vanaf P. Klik op die segment ewe lank as PT." },
      diagram: BASE,
      tap: { targets: [ { id: "ps", kind: "tangentSeg", from: "P", to: "S" }, { id: "ts", kind: "chord", a: "T", b: "S" } ], correctId: "ps" },
      answer: { en: "PS = PT — two tangents from the same point are equal.", af: "PS = PT — twee raaklyne vanaf dieselfde punt is gelyk." }, explainReason: "tansCommonPt" },

    { id: "r11q2", type: "reason", accent: AC,
      prompt: { en: "PT and PS are tangents from P. Which reason gives PT = PS?", af: "PT en PS is raaklyne vanaf P. Watter rede gee PT = PS?" },
      diagram: BASE,
      options: [ { code: "tansCommonPt", correct: true }, { code: "tanRadius" }, { code: "isosBase" }, { code: "equalChords" } ],
      answer: { en: "Tangents from the same point are equal.", af: "Raaklyne vanaf dieselfde punt is gelyk." }, explainReason: "tansCommonPt" },

    { id: "r11q3", type: "yesno", accent: AC,
      prompt: { en: "Are two tangents drawn from the same external point always equal in length?", af: "Is twee raaklyne vanaf dieselfde buitepunt altyd ewe lank?" },
      diagram: BASE, yes: true,
      answer: { en: "Yes — tangents from the same point are equal.", af: "Ja — raaklyne vanaf dieselfde punt is gelyk." }, explainReason: "tansCommonPt" },

    { id: "r11q4", type: "calc-mc", accent: AC,
      prompt: { en: "PT and PS are tangents from P and PT = 7 cm. Find PS.", af: "PT en PS is raaklyne vanaf P en PT = 7 cm. Bereken PS." },
      diagram: BASE,
      options: [ { text: "7 cm", correct: true }, { text: "14 cm" }, { text: "3,5 cm" }, { text: { en: "Cannot tell", af: "Kan nie uitwerk nie" } } ],
      answer: { en: "PS = PT = 7 cm.", af: "PS = PT = 7 cm." }, explainReason: "tansCommonPt" },

    { id: "r11q5", type: "calc-mc", accent: AC, hints: HINT_ISOS,
      prompt: { en: "PT and PS are tangents and ∠TPS = 40°. Find ∠PTS (a base angle of isosceles △PTS).", af: "PT en PS is raaklyne en ∠TPS = 40°. Bereken ∠PTS (’n basishoek van gelykbenige △PTS)." },
      diagram: { ...BASE, angles: [ { at: "P", legs: ["T", "S"], t: "40°", o: { v: 40 } }, { at: "T", legs: ["P", "S"], t: "x", o: { v: 70 } } ] },
      options: [ { text: "70°", correct: true }, { text: "40°" }, { text: "110°" }, { text: "140°" } ],
      answer: { en: "PT = PS, so the angles opposite the equal sides are equal: x = (180° − 40°) ÷ 2 = 70°.", af: "PT = PS, dus die hoeke teenoor die gelyke sye is gelyk: x = (180° − 40°) ÷ 2 = 70°." }, explainReason: "isosBase" },

    { id: "r11q6", type: "tap", accent: AC, hints: HINT_ISOS,
      prompt: { en: "PT = PS, so △PTS is isosceles. Tap the angle equal to ∠PTS (marked).", af: "PT = PS, dus △PTS is gelykbenig. Klik op die hoek gelyk aan ∠PTS (gemerk)." },
      diagram: { ...BASE, angles: [ { at: "T", legs: ["P", "S"], t: "•", o: { v: 70 } }, { at: "S", legs: ["P", "T"], t: "", o: { v: 70 } }, { at: "P", legs: ["T", "S"], t: "", o: { v: 40 } } ] },
      tap: { targets: [ { id: "s", kind: "angle", angleIndex: 1 }, { id: "p", kind: "angle", angleIndex: 2 } ], correctId: "s" },
      answer: { en: "∠PST = ∠PTS — angles opposite the equal sides (PT = PS).", af: "∠PST = ∠PTS — hoeke teenoor die gelyke sye (PT = PS)." }, explainReason: "isosBase" },

    { id: "r11q7", type: "tap", accent: AC,
      prompt: { en: "Tap the tangent equal to PT.", af: "Klik op die raaklyn gelyk aan PT." },
      diagram: { h: 284, cx: 160, cy: 94, R: 58, pts: { T: 330, S: 210 }, ext: [{ name: "P", t: ["T", "S"] }], chords: [["T", "S"]] },
      tap: { targets: [ { id: "ps", kind: "tangentSeg", from: "P", to: "S" }, { id: "ts", kind: "chord", a: "T", b: "S" } ], correctId: "ps" },
      answer: { en: "PS = PT — tangents from the same point.", af: "PS = PT — raaklyne vanaf dieselfde punt." }, explainReason: "tansCommonPt" },

    { id: "r11q8", type: "calc-mc", accent: AC, hints: HINT_ISOS,
      prompt: { en: "PT and PS are tangents and ∠TPS = 50°. Find ∠PTS (a base angle of isosceles △PTS).", af: "PT en PS is raaklyne en ∠TPS = 50°. Bereken ∠PTS (’n basishoek van gelykbenige △PTS)." },
      diagram: { h: 284, cx: 160, cy: 94, R: 58, pts: { T: 335, S: 205 }, ext: [{ name: "P", t: ["T", "S"] }], chords: [["T", "S"]],
        angles: [ { at: "P", legs: ["T", "S"], t: "50°", o: { v: 50 } }, { at: "T", legs: ["P", "S"], t: "x", o: { v: 65 } } ] },
      options: [ { text: "65°", correct: true }, { text: "50°" }, { text: "115°" }, { text: "130°" } ],
      answer: { en: "PT = PS, so x = (180° − 50°) ÷ 2 = 65°.", af: "PT = PS, dus x = (180° − 50°) ÷ 2 = 65°." }, explainReason: "isosBase" },

    { id: "r11q9", type: "reason", accent: AC, hints: HINT_ISOS,
      prompt: { en: "PT = PS, so △PTS is isosceles. Which reason gives the equal base angles ∠PTS = ∠PST?", af: "PT = PS, dus △PTS is gelykbenig. Watter rede gee die gelyke basishoeke ∠PTS = ∠PST?" },
      diagram: BASE,
      options: [ { code: "isosBase", correct: true }, { code: "tansCommonPt" }, { code: "sameSeg" }, { code: "equalChords" } ],
      answer: { en: "Angles opposite equal sides are equal.", af: "Hoeke teenoor gelyke sye is gelyk." }, explainReason: "isosBase" },

    { id: "r11q10", type: "tap", accent: AC,
      prompt: { en: "PT and PS are tangents from P. Tap the segment equal in length to PS.", af: "PT en PS is raaklyne vanaf P. Klik op die segment ewe lank as PS." },
      diagram: { h: 284, cx: 160, cy: 94, R: 58, pts: { T: 325, S: 215 }, ext: [{ name: "P", t: ["T", "S"] }], chords: [["T", "S"]] },
      tap: { targets: [ { id: "pt", kind: "tangentSeg", from: "P", to: "T" }, { id: "ts", kind: "chord", a: "T", b: "S" } ], correctId: "pt" },
      answer: { en: "PT = PS — tangents from the same point are equal.", af: "PT = PS — raaklyne vanaf dieselfde punt is gelyk." }, explainReason: "tansCommonPt" },
  ],
};
