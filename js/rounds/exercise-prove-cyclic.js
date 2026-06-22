/* EXERCISE — Proving a quadrilateral (or 4 points) is cyclic (graded, 80%).
   Covers all three converse tests: opposite ∠s supplementary, exterior ∠ =
   interior opposite, and two equal ∠s in the same segment. Angle values are
   stated in the prompt; diagrams use colour-coded arcs to show which angles.
   Every reason is a CONVERSE. */
const AC = "#9c36b5";
const PUR = "#9c36b5", GRN = "#0ea271";

// cyclic quad with ∠A (purple) & ∠C (green) marked
const QUAD_AC = { pts: { A: 135, B: 55, C: 315, D: 215 }, chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"]],
  angles: [{ at: "A", legs: ["D", "B"], t: "", o: { c: PUR } }, { at: "C", legs: ["B", "D"], t: "", o: { c: GRN } }] };
// ∠B (purple) & ∠D (green)
const QUAD_BD = { pts: { A: 135, B: 55, C: 315, D: 215 }, chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"]],
  angles: [{ at: "B", legs: ["A", "C"], t: "", o: { c: PUR } }, { at: "D", legs: ["C", "A"], t: "", o: { c: GRN } }] };
// exterior ∠DCE (purple) & interior ∠A (green)
const QUAD_EXT = { pts: { A: 135, B: 55, C: 315, D: 215 }, chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["C", "E"]],
  out: [{ name: "E", along: ["B", "C"], len: 30 }],
  angles: [{ at: "C", legs: ["D", "E"], t: "", o: { c: PUR } }, { at: "A", legs: ["D", "B"], t: "", o: { c: GRN } }] };
// segment AB subtended by ∠APB (purple) & ∠AQB (green) on the same side
const SEG = { pts: { A: 200, B: 340, P: 75, Q: 120 }, chords: [["A", "B"], ["A", "P"], ["B", "P"], ["A", "Q"], ["B", "Q"]],
  angles: [{ at: "P", legs: ["A", "B"], t: "", o: { c: PUR } }, { at: "Q", legs: ["A", "B"], t: "", o: { c: GRN } }] };

export const round = {
  id: "eprovecyc", n: 1, accent: AC, group: "g2",
  title: { en: "Prove a cyclic quad", af: "Bewys 'n koordevierhoek" },
  blurb: { en: "Three converse tests — decide if it's cyclic, and say why.", af: "Drie omgekeerde toetse — besluit of dit koordevierhoek is, en sê hoekom." },
  reasonCode: "cyclicOppConv",
  questionsPerPlay: 10,
  defaultHints: [
    { en: "To PROVE a quad is cyclic, test a CONVERSE: do the opposite angles add to 180°? OR does an exterior angle equal the interior opposite angle? OR do two angles on the same side of a chord match?",
      af: "Om te BEWYS 'n vierhoek is 'n koordevierhoek, toets 'n OMGEKEERDE: tel die teenoorstaande hoeke op tot 180°? OF is 'n buitehoek gelyk aan die binne-teenoorstaande hoek? OF stem twee hoeke aan dieselfde kant van 'n koord ooreen?",
    },
    { en: "If the condition holds, it IS cyclic — and the reason is the CONVERSE ('opp ∠s supplementary ⇒ cyclic'), not the forward theorem. If it fails (e.g. they add to 170°), it is NOT cyclic.",
      af: "As die voorwaarde geld, IS dit 'n koordevierhoek — en die rede is die OMGEKEERDE ('teenoorst. ∠e supplementêr ⇒ kvh'), nie die voorwaartse stelling nie. As dit faal (bv. hulle tel op tot 170°), is dit NIE 'n koordevierhoek nie.",
    },
  ],
  questions: [
    // --- way 1: opposite angles supplementary ---
    { id: "pc1", type: "yesno", accent: AC, diagram: QUAD_AC, yes: true,
      prompt: { en: "In quad ABCD, ∠A = 85° and ∠C = 95°. Is ABCD a cyclic quad?", af: "In vierhoek ABCD is ∠A = 85° en ∠C = 95°. Is ABCD 'n koordevierhoek?" },
      answer: { en: "Yes — opposite angles add to 85° + 95° = 180°, so ABCD is cyclic.", af: "Ja — teenoorstaande hoeke tel op tot 85° + 95° = 180°, dus is ABCD 'n koordevierhoek." },
      explainReason: "cyclicOppConv" },

    { id: "pc2", type: "yesno", accent: AC, diagram: QUAD_AC, yes: false,
      prompt: { en: "In quad ABCD, ∠A = 100° and ∠C = 70°. Is ABCD a cyclic quad?", af: "In vierhoek ABCD is ∠A = 100° en ∠C = 70°. Is ABCD 'n koordevierhoek?" },
      answer: { en: "No — 100° + 70° = 170°, not 180°, so the opposite angles are not supplementary.", af: "Nee — 100° + 70° = 170°, nie 180° nie, dus is die teenoorstaande hoeke nie supplementêr nie." },
      explainReason: "cyclicOppConv" },

    { id: "pc3", type: "yesno", accent: AC, diagram: QUAD_BD, yes: true,
      prompt: { en: "In quad ABCD, ∠B = 110° and ∠D = 70°. Is ABCD a cyclic quad?", af: "In vierhoek ABCD is ∠B = 110° en ∠D = 70°. Is ABCD 'n koordevierhoek?" },
      answer: { en: "Yes — ∠B + ∠D = 110° + 70° = 180°.", af: "Ja — ∠B + ∠D = 110° + 70° = 180°." },
      explainReason: "cyclicOppConv" },

    { id: "pc4", type: "reason", accent: AC, diagram: QUAD_AC,
      prompt: { en: "You showed ∠A + ∠C = 180°. Which reason proves ABCD is a cyclic quad? (Careful — pick the converse.)", af: "Jy het gewys ∠A + ∠C = 180°. Watter rede bewys dat ABCD 'n koordevierhoek is? (Pasop — kies die omgekeerde.)" },
      options: [{ code: "cyclicOppConv", correct: true }, { code: "cyclicOpp" }, { code: "cyclicExtConv" }, { code: "sameSegConv" }],
      answer: { en: "Opposite angles supplementary ⇒ cyclic quad — the CONVERSE reason.", af: "Teenoorstaande hoeke supplementêr ⇒ koordevierhoek — die OMGEKEERDE rede." },
      explainReason: "cyclicOppConv" },

    // --- way 2: exterior angle = interior opposite ---
    { id: "pc5", type: "yesno", accent: AC, diagram: QUAD_EXT, yes: true,
      prompt: { en: "BC is produced to E. The exterior angle ∠DCE = 80°, and the interior opposite angle ∠A = 80°. Is ABCD cyclic?", af: "BC word verleng na E. Die buitehoek ∠DCE = 80°, en die binne-teenoorstaande hoek ∠A = 80°. Is ABCD 'n koordevierhoek?" },
      answer: { en: "Yes — the exterior angle equals the interior opposite angle, so ABCD is cyclic.", af: "Ja — die buitehoek is gelyk aan die binne-teenoorstaande hoek, dus is ABCD 'n koordevierhoek." },
      explainReason: "cyclicExtConv" },

    { id: "pc6", type: "yesno", accent: AC, diagram: QUAD_EXT, yes: false,
      prompt: { en: "BC is produced to E. The exterior angle ∠DCE = 80°, but the interior opposite angle ∠A = 70°. Is ABCD cyclic?", af: "BC word verleng na E. Die buitehoek ∠DCE = 80°, maar die binne-teenoorstaande hoek ∠A = 70°. Is ABCD 'n koordevierhoek?" },
      answer: { en: "No — the exterior angle (80°) does not equal the interior opposite angle (70°).", af: "Nee — die buitehoek (80°) is nie gelyk aan die binne-teenoorstaande hoek (70°) nie." },
      explainReason: "cyclicExtConv" },

    { id: "pc7", type: "reason", accent: AC, diagram: QUAD_EXT,
      prompt: { en: "The exterior angle of ABCD equals its interior opposite angle. Which reason proves ABCD is cyclic? (Pick the converse.)", af: "Die buitehoek van ABCD is gelyk aan sy binne-teenoorstaande hoek. Watter rede bewys ABCD is 'n koordevierhoek? (Kies die omgekeerde.)" },
      options: [{ code: "cyclicExtConv", correct: true }, { code: "cyclicExt" }, { code: "cyclicOppConv" }, { code: "equalChords" }],
      answer: { en: "Exterior angle = interior opposite angle ⇒ cyclic quad — the CONVERSE reason.", af: "Buitehoek = binne-teenoorstaande hoek ⇒ koordevierhoek — die OMGEKEERDE rede." },
      explainReason: "cyclicExtConv" },

    // --- way 3: two equal angles in the same segment ---
    { id: "pc8", type: "yesno", accent: AC, diagram: SEG, yes: true,
      prompt: { en: "P and Q are on the same side of line AB, with ∠APB = ∠AQB = 40°. Do A, B, P and Q lie on one circle (concyclic)?", af: "P en Q is aan dieselfde kant van lyn AB, met ∠APB = ∠AQB = 40°. Lê A, B, P en Q op een sirkel (konsiklies)?" },
      answer: { en: "Yes — AB subtends equal angles at P and Q on the same side, so all four are concyclic.", af: "Ja — AB onderspan gelyke hoeke by P en Q aan dieselfde kant, dus is al vier konsiklies." },
      explainReason: "sameSegConv" },

    { id: "pc9", type: "reason", accent: AC, diagram: SEG,
      prompt: { en: "AB subtends equal angles at P and Q (same side). Which reason proves A, B, P, Q are concyclic? (Pick the converse.)", af: "AB onderspan gelyke hoeke by P en Q (selfde kant). Watter rede bewys A, B, P, Q is konsiklies? (Kies die omgekeerde.)" },
      options: [{ code: "sameSegConv", correct: true }, { code: "sameSeg" }, { code: "cyclicOppConv" }, { code: "cyclicExtConv" }],
      answer: { en: "Equal angles subtended on the same side ⇒ concyclic — the CONVERSE reason.", af: "Gelyke hoeke onderspan aan dieselfde kant ⇒ konsiklies — die OMGEKEERDE rede." },
      explainReason: "sameSegConv" },

    // --- mixed ---
    { id: "pc10", type: "mc", accent: AC,
      prompt: { en: "Which fact is enough to prove a quadrilateral is cyclic?", af: "Watter feit is genoeg om te bewys dat 'n vierhoek 'n koordevierhoek is?" },
      options: [
        { text: { en: "Its opposite angles add up to 180°", af: "Sy teenoorstaande hoeke tel op tot 180°" }, correct: true },
        { text: { en: "All four sides are equal", af: "Al vier sye is gelyk" } },
        { text: { en: "Its diagonals are equal", af: "Sy diagonale is gelyk" } },
        { text: { en: "It has one right angle", af: "Dit het een regte hoek" } },
      ],
      answer: { en: "Opposite angles supplementary (a converse) proves it is cyclic.", af: "Teenoorstaande hoeke supplementêr ('n omgekeerde) bewys dit is 'n koordevierhoek." },
      explainReason: "cyclicOppConv" },

    { id: "pc11", type: "yesno", accent: AC, diagram: QUAD_AC, yes: true,
      prompt: { en: "In quad ABCD, ∠A = 90° and ∠C = 90°. Is ABCD a cyclic quad?", af: "In vierhoek ABCD is ∠A = 90° en ∠C = 90°. Is ABCD 'n koordevierhoek?" },
      answer: { en: "Yes — 90° + 90° = 180°, opposite angles are supplementary.", af: "Ja — 90° + 90° = 180°, teenoorstaande hoeke is supplementêr." },
      explainReason: "cyclicOppConv" },

    { id: "pc12", type: "mc", accent: AC, diagram: QUAD_AC,
      prompt: { en: "In ABCD, ∠A = 120°. For ABCD to be cyclic, ∠C must be:", af: "In ABCD is ∠A = 120°. Vir ABCD om koordevierhoek te wees, moet ∠C wees:" },
      options: [{ text: "60°", correct: true }, { text: "120°" }, { text: "90°" }, { text: "180°" }],
      answer: { en: "∠C = 180° − 120° = 60° so that the opposite angles add to 180°.", af: "∠C = 180° − 120° = 60° sodat die teenoorstaande hoeke tot 180° optel." },
      explainReason: "cyclicOppConv" },
  ],
};
