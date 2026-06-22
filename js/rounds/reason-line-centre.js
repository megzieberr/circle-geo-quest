/* Which reason? — Line from the centre to a chord.
   Pure reason-picking: is the 90° GIVEN (→ conclude bisects), or is the
   midpoint GIVEN (→ conclude perpendicular)? 10 questions. Normal graded
   exercise round (80% to pass). */
const AC = "#f76707";

/* Guiding hints — the two directions are converses, so each gets its own pair. */
const HINT_PERP = [   // the 90° is GIVEN → conclude it bisects
  { en: "The right angle at M is given — the line from O meets chord AB at 90°.",
    af: "Die regte hoek by M is gegee — die lyn vanuit O ontmoet koord AB by 90°." },
  { en: "A line from the centre perpendicular to a chord bisects it, so AM = MB.",
    af: "'n Lyn vanuit die middelpunt loodreg op 'n koord halveer dit, dus AM = MB." },
];
const HINT_MID = [    // the midpoint is GIVEN → conclude it is perpendicular
  { en: "You're told M is the midpoint of AB — so AM = MB is the given.",
    af: "Daar word gesê M is die middelpunt van AB — dus is AM = MB die gegewe." },
  { en: "A line from the centre to the midpoint of a chord is perpendicular to it, so OM ⊥ AB.",
    af: "'n Lyn vanuit die middelpunt na die middelpunt van 'n koord is loodreg daarop, dus OM ⊥ AB." },
];

const D_PERP = { O: true, pts: { A: 205, B: 335 }, mid: [{ name: "M", of: ["A", "B"] }],
  chords: [["A", "B"], ["O", "M"]], angles: [{ at: "M", legs: ["O", "B"], t: "", o: { v: 90, mark: 1 } }] };
const D_MID = { O: true, pts: { A: 205, B: 335 }, mid: [{ name: "M", of: ["A", "B"] }],
  chords: [["A", "B"], ["O", "M"]] };
// a second orientation so the picture isn't always identical
const D_PERP2 = { O: true, pts: { A: 120, B: 250 }, mid: [{ name: "M", of: ["A", "B"] }],
  chords: [["A", "B"], ["O", "M"]], angles: [{ at: "M", legs: ["O", "B"], t: "", o: { v: 90, mark: 1 } }] };
const D_MID2 = { O: true, pts: { A: 120, B: 250 }, mid: [{ name: "M", of: ["A", "B"] }],
  chords: [["A", "B"], ["O", "M"]] };

const perpQ = (id, d) => ({
  id, type: "reason", accent: AC, diagram: d, hints: HINT_PERP,
  prompt: { en: "OM is drawn from O to chord AB and OM ⊥ AB (the 90° is given). Which reason lets you conclude AM = MB?", af: "OM is van O na koord AB geteken en OM ⊥ AB (die 90° is gegee). Watter rede laat jou aflei dat AM = MB?" },
  options: [{ code: "centrePerpChord", correct: true }, { code: "centreMidChord" }, { code: "tanRadius" }, { code: "sameSeg" }],
  answer: { en: "The 90° is given, so use: line from centre ⊥ to chord ⇒ it bisects the chord.", af: "Die 90° is gegee, gebruik dus: lyn vanuit mdpt ⊥ op koord ⇒ dit halveer die koord." },
  explainReason: "centrePerpChord",
});
const midQ = (id, d) => ({
  id, type: "reason", accent: AC, diagram: d, hints: HINT_MID,
  prompt: { en: "M is the midpoint of chord AB (AM = MB is given) and OM is drawn. Which reason lets you conclude OM ⊥ AB?", af: "M is die middelpunt van koord AB (AM = MB is gegee) en OM is geteken. Watter rede laat jou aflei dat OM ⊥ AB?" },
  options: [{ code: "centreMidChord", correct: true }, { code: "centrePerpChord" }, { code: "equalChords" }, { code: "semiCircle" }],
  answer: { en: "The midpoint is given, so use: line from centre to midpt of chord ⇒ it is perpendicular.", af: "Die middelpunt is gegee, gebruik dus: lyn vanuit mdpt na mdpt van koord ⇒ dit is loodreg." },
  explainReason: "centreMidChord",
});

export const round = {
  id: "rline", n: 1, accent: AC, group: "g1",
  title: { en: "Which reason? Line from the centre", af: "Watter rede? Lyn vanaf die middelpunt" },
  blurb: { en: "Spot whether the 90° or the midpoint is given, then pick the reason.", af: "Herken of die 90° of die middelpunt gegee is, kies dan die rede." },
  reasonCode: "centrePerpChord",
  questionsPerPlay: 10,
  questions: [
    perpQ("rl1", D_PERP), midQ("rl2", D_MID), perpQ("rl3", D_PERP2), midQ("rl4", D_MID2),
    perpQ("rl5", D_PERP), midQ("rl6", D_MID), perpQ("rl7", D_PERP2), midQ("rl8", D_MID2),
    perpQ("rl9", D_PERP), midQ("rl10", D_MID2),
  ],
};
