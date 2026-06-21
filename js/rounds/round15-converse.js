/* PHASE 2 · Round (id r15) — Converse theorems.
   "If <condition> then the figure is …" — the learner reads the sketch and
   picks the conclusion (tangent, cyclic quad, diameter, perpendicular, …).
   `phase: 2` ties it to the Intermediate rank tier. */
const AC = "#9c36b5";

// reusable option objects
const O = {
  tangent: { en: "A tangent", af: "’n Raaklyn" },
  chord: { en: "A chord", af: "’n Koord" },
  diameter: { en: "A diameter", af: "’n Middellyn" },
  radius: { en: "A radius", af: "’n Radius" },
  secant: { en: "A secant", af: "’n Sekant" },
  cyclic: { en: "A cyclic quadrilateral", af: "’n Koordevierhoek" },
  parallelogram: { en: "A parallelogram", af: "’n Parallelogram" },
  kite: { en: "A kite", af: "’n Vlieër" },
  trapezium: { en: "A trapezium", af: "’n Trapesium" },
  perp: { en: "Perpendicular to AB", af: "Loodreg op AB" },
  parallel: { en: "Parallel to AB", af: "Ewewydig aan AB" },
  concyclic: { en: "They lie on one circle", af: "Hulle lê op een sirkel" },
  collinear: { en: "They are collinear", af: "Hulle is kollineêr" },
  centre: { en: "The centre", af: "Die middelpunt" },
  equalLen: { en: "Equal in length", af: "Ewe lank" },
};

export const round = {
  id: "r15", n: 16, phase: 2, accent: AC,
  title: { en: "Converse theorems", af: "Omgekeerde stellings" },
  blurb: { en: "Read the clue, name the figure.", af: "Lees die leidraad, benoem die figuur." },
  reasonCode: null,
  questionsPerPlay: 11,
  questions: [
    { id: "r15q1", type: "mc", accent: AC,
      prompt: { en: "OB is a radius and line CD is drawn perpendicular to OB at B (on the circle). What is CD?", af: "OB is 'n radius en lyn CD is loodreg op OB by B (op die sirkel) geteken. Wat is CD?" },
      diagram: { O: true, pts: { B: 270 }, chords: [["O", "B"]], tang: [{ at: "B", lab: ["C", "D"] }], angles: [{ at: "B", legs: ["tg+", "O"], t: "", o: { v: 90, mark: 1 } }] },
      options: [ { text: O.tangent, correct: true }, { text: O.chord }, { text: O.diameter }, { text: O.secant } ],
      answer: { en: "CD is a tangent — a line ⊥ to the radius at the point of contact is a tangent.", af: "CD is 'n raaklyn — 'n lyn ⊥ op die radius by die raakpunt is 'n raaklyn." } },

    { id: "r15q2", type: "mc", accent: AC,
      prompt: { en: "In quadrilateral ABCD, ∠A + ∠C = 180°. What is ABCD?", af: "In vierhoek ABCD is ∠A + ∠C = 180°. Wat is ABCD?" },
      diagram: { pts: { A: 160, B: 80, C: 340, D: 250 }, chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"]],
        angles: [ { at: "A", legs: ["D", "B"], t: "", o: {} }, { at: "C", legs: ["B", "D"], t: "", o: {} } ] },
      options: [ { text: O.cyclic, correct: true }, { text: O.parallelogram }, { text: O.kite }, { text: O.trapezium } ],
      answer: { en: "A cyclic quadrilateral — opposite angles supplementary means the vertices lie on a circle.", af: "’n Koordevierhoek — supplementêre teenoorstaande hoeke beteken die hoekpunte lê op 'n sirkel." } },

    { id: "r15q3", type: "mc", accent: AC,
      prompt: { en: "OM is drawn from centre O to chord AB, and AM = MB (M is the midpoint). What is OM to AB?", af: "OM is van middelpunt O na koord AB geteken, en AM = MB (M is die middelpunt). Wat is OM teenoor AB?" },
      diagram: { O: true, pts: { A: 200, B: 340 }, mid: [{ name: "M", of: ["A", "B"] }], chords: [["A", "B"], ["O", "M"]] },
      options: [ { text: O.perp, correct: true }, { text: O.parallel }, { text: O.tangent }, { text: O.equalLen } ],
      answer: { en: "Perpendicular — the line from the centre to the midpoint of a chord is ⊥ to the chord.", af: "Loodreg — die lyn van die middelpunt na die middelpunt van 'n koord is ⊥ op die koord." } },

    { id: "r15q4", type: "mc", accent: AC,
      prompt: { en: "Chord AB subtends a right angle (90°) at point P on the circle. What is AB?", af: "Koord AB onderspan 'n regte hoek (90°) by punt P op die sirkel. Wat is AB?" },
      diagram: { O: true, pts: { A: 180, B: 0, P: 70 }, chords: [["A", "B"], ["A", "P"], ["B", "P"]], angles: [{ at: "P", legs: ["A", "B"], t: "", o: { v: 90, mark: 1 } }] },
      options: [ { text: O.diameter, correct: true }, { text: O.tangent }, { text: O.radius }, { text: O.chord } ],
      answer: { en: "A diameter — a chord subtending 90° at the circumference is a diameter.", af: "’n Middellyn — 'n koord wat 90° by die omtrek onderspan, is 'n middellyn." } },

    { id: "r15q5", type: "mc", accent: AC,
      prompt: { en: "∠APB = ∠AQB, with P and Q on the same side of AB. What is true of A, P, Q, B?", af: "∠APB = ∠AQB, met P en Q aan dieselfde kant van AB. Wat geld vir A, P, Q, B?" },
      diagram: { pts: { A: 200, B: 340, P: 60, Q: 120 }, chords: [["A", "B"], ["A", "P"], ["B", "P"], ["A", "Q"], ["B", "Q"]],
        angles: [ { at: "P", legs: ["A", "B"], t: "", o: {} }, { at: "Q", legs: ["A", "B"], t: "", o: {} } ] },
      options: [ { text: O.concyclic, correct: true }, { text: O.collinear }, { text: { en: "APQB is a parallelogram", af: "APQB is 'n parallelogram" } }, { text: { en: "PQ is a diameter", af: "PQ is 'n middellyn" } } ],
      answer: { en: "They are concyclic — equal angles on the same side of AB means the four points lie on one circle.", af: "Hulle is konsiklies — gelyke hoeke aan dieselfde kant van AB beteken die vier punte lê op een sirkel." } },

    { id: "r15q6", type: "mc", accent: AC,
      prompt: { en: "AB is extended to E. The exterior angle ∠EBC equals the interior opposite angle ∠D. What is ABCD?", af: "AB is verleng tot E. Die buitehoek ∠EBC is gelyk aan die teenoorstaande binnehoek ∠D. Wat is ABCD?" },
      diagram: { pts: { A: 165, B: 95, C: 5, D: 250 }, out: [{ name: "E", along: ["A", "B"], len: 34 }],
        chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["B", "E"]],
        angles: [ { at: "B", legs: ["E", "C"], t: "", o: {} }, { at: "D", legs: ["A", "C"], t: "", o: {} } ] },
      options: [ { text: O.cyclic, correct: true }, { text: O.parallelogram }, { text: O.kite }, { text: O.trapezium } ],
      answer: { en: "A cyclic quadrilateral — exterior angle = interior opposite angle is the converse test.", af: "’n Koordevierhoek — buitehoek = teenoorstaande binnehoek is die omgekeerde toets." } },

    { id: "r15q7", type: "mc", accent: AC,
      prompt: { en: "Line STU through T makes an angle with chord TA equal to ∠TPA (the angle in the alternate segment). What is STU?", af: "Lyn STU deur T maak 'n hoek met koord TA gelyk aan ∠TPA (die hoek in die oorstaande segment). Wat is STU?" },
      diagram: { pts: { T: 270, A: 40, P: 150 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["T", "A"], ["P", "T"], ["P", "A"]],
        angles: [ { at: "T", legs: ["tg+", "A"], t: "", o: {} }, { at: "P", legs: ["T", "A"], t: "", o: {} } ] },
      options: [ { text: O.tangent, correct: true }, { text: O.chord }, { text: O.secant }, { text: O.diameter } ],
      answer: { en: "A tangent — the converse of the tan-chord theorem.", af: "’n Raaklyn — die omgekeerde van die raaklyn-koord stelling." } },

    { id: "r15q8", type: "mc", accent: AC,
      prompt: { en: "OA = OB = OC = OD for points A, B, C, D on the circle. What is O?", af: "OA = OB = OC = OD vir punte A, B, C, D op die sirkel. Wat is O?" },
      diagram: { O: true, pts: { A: 60, B: 150, C: 230, D: 320 }, chords: [["O", "A"], ["O", "B"], ["O", "C"], ["O", "D"]] },
      options: [ { text: O.centre, correct: true }, { text: { en: "The midpoint of AB", af: "Die middelpunt van AB" } }, { text: { en: "A point on the circle", af: "’n Punt op die sirkel" } }, { text: O.tangent } ],
      answer: { en: "The centre — all radii of a circle are equal, so O is equidistant from every point.", af: "Die middelpunt — alle radiusse van 'n sirkel is gelyk, dus is O ewe ver van elke punt." } },

    { id: "r15q9", type: "mc", accent: AC,
      prompt: { en: "Chords AB and CD subtend equal angles at the centre O. What is true of AB and CD?", af: "Koorde AB en CD onderspan gelyke hoeke by die middelpunt O. Wat geld vir AB en CD?" },
      diagram: { O: true, pts: { A: 165, B: 105, C: 50, D: 350 }, chords: [["A", "B"], ["C", "D"], ["O", "A"], ["O", "B"], ["O", "C"], ["O", "D"]],
        angles: [ { at: "O", legs: ["A", "B"], t: "", o: {} }, { at: "O", legs: ["C", "D"], t: "", o: {} } ] },
      options: [ { text: O.equalLen, correct: true }, { text: O.parallel }, { text: O.perp }, { text: { en: "Both diameters", af: "Albei middellyne" } } ],
      answer: { en: "Equal in length — equal angles at the centre are subtended by equal chords.", af: "Ewe lank — gelyke hoeke by die middelpunt word deur gelyke koorde onderspan." } },

    { id: "r15q10", type: "mc", accent: AC,
      prompt: { en: "The perpendicular bisector of chord AB is drawn (OM ⊥ AB at the midpoint M). Through which point must it pass?", af: "Die middelloodlyn van koord AB is geteken (OM ⊥ AB by die middelpunt M). Deur watter punt moet dit gaan?" },
      diagram: { O: true, pts: { A: 200, B: 340 }, mid: [{ name: "M", of: ["A", "B"] }], chords: [["A", "B"], ["O", "M"]], angles: [{ at: "M", legs: ["O", "A"], t: "", o: { v: 90, mark: 1 } }] },
      options: [ { text: O.centre, correct: true }, { text: { en: "A point on AB", af: "’n Punt op AB" } }, { text: { en: "The midpoint of OA", af: "Die middelpunt van OA" } }, { text: O.tangent } ],
      answer: { en: "The centre — the perpendicular bisector of a chord passes through the centre of the circle.", af: "Die middelpunt — die middelloodlyn van 'n koord gaan deur die middelpunt van die sirkel." } },

    { id: "r15q11", type: "mc", accent: AC,
      prompt: { en: "Two tangents from external point A touch the circle at F and C. The radii OF and OC are drawn, each ⊥ its tangent. What type of quadrilateral is OFAC?", af: "Twee raaklyne vanuit buitepunt A raak die sirkel by F en C. Die radiusse OF en OC is geteken, elk ⊥ sy raaklyn. Watter soort vierhoek is OFAC?" },
      diagram: { O: true, pts: { F: 42, C: 318 }, ext: [{ name: "A", t: ["F", "C"] }], chords: [["O", "F"], ["O", "C"]],
        angles: [ { at: "F", legs: ["O", "A"], t: "", o: { v: 90, mark: 1 } }, { at: "C", legs: ["O", "A"], t: "", o: { v: 90, mark: 1 } } ] },
      options: [ { text: O.kite, correct: true }, { text: { en: "A rhombus", af: "’n Ruit" } }, { text: O.parallelogram }, { text: O.trapezium } ],
      answer: { en: "A kite — OF = OC (radii) and AF = AC (tangents from a common point), so OFAC has two pairs of adjacent sides equal.", af: "’n Vlieër — OF = OC (radiusse) en AF = AC (raaklyne vanuit 'n gemeenskaplike punt), dus het OFAC twee pare aangrensende gelyke sye." } },
  ],
};
