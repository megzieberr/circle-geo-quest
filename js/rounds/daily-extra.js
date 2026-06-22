/* ============================================================
   DAILY BONUS BANK — extra mixed riders for the Daily Challenge,
   unlocked only once a learner has PASSED EVERY ROUND. They combine
   theorems (centre + isosceles, semicircle + triangle, two tangents,
   tan-chord + triangle …) so a "graduate" gets fresh material in the
   Daily instead of recycling the round questions.

   NOT in the play order (no map card, no badge). Registered into
   QUESTION_BY_ID in rounds/index.js so the Daily and Fix-Mistakes can
   look them up; surfaced to the Daily pool by daily.js for finishers.

   Every diagram is verified to scale (verifyDiagram); every answer is a
   tap (no typing); reasons are CAPS; hints guide without giving the
   answer. Bilingual EN/AF.
   ============================================================ */
const G1 = "#4263eb", G2 = "#f76707", G3 = "#e64980", PUR = "#9c36b5";

export const round = {
  id: "dailyx", accent: PUR,
  title: { en: "Bonus rider", af: "Bonus-vraagstuk" },
  questions: [
    // 1 — isosceles radii: given the centre angle, find a base angle
    { id: "dx1", type: "calc-mc", accent: G1, reasonCode: "isosBase",
      prompt: { en: "O is the centre, so OA = OB (radii). If ∠AOB = 80°, find x = ∠OBA.", af: "O is die middelpunt, dus OA = OB (radiusse). As ∠AOB = 80°, bereken x = ∠OBA." },
      diagram: { O: true, pts: { A: 150, B: 70 }, chords: [["O", "A"], ["O", "B"], ["A", "B"]],
        angles: [ { at: "O", legs: ["A", "B"], t: "80°", o: { v: 80 } }, { at: "B", legs: ["O", "A"], t: "x", o: { v: 50, r: 40 } } ] },
      options: [ { text: "50°", correct: true }, { text: "40°" }, { text: "80°" }, { text: "100°" } ],
      answer: { en: "OA = OB (radii), so △OAB is isosceles: x = (180° − 80°) ÷ 2 = 50°.", af: "OA = OB (radiusse), dus △OAB is gelykbenig: x = (180° − 80°) ÷ 2 = 50°." },
      explainReason: "isosBase",
      hints: [
        { en: "OA and OB are both radii, so △OAB is isosceles — the two base angles (∠OAB and ∠OBA) are equal.",
          af: "OA en OB is albei radiusse, dus △OAB is gelykbenig — die twee basishoeke (∠OAB en ∠OBA) is gelyk." },
        { en: "The three angles add to 180°. Take ∠AOB off 180° and halve what's left.",
          af: "Die drie hoeke is saam 180°. Trek ∠AOB van 180° af en halveer wat oorbly." },
      ] },

    // 2 — centre = 2 × circumference, THEN isosceles radii
    { id: "dx2", type: "calc-mc", accent: G1, reasonCode: "centreDouble",
      prompt: { en: "O is the centre and ∠APB = 40° at the circumference. OA and OB are radii. Find x = ∠OAB.", af: "O is die middelpunt en ∠APB = 40° by die omtrek. OA en OB is radiusse. Bereken x = ∠OAB." },
      diagram: { O: true, pts: { A: 160, B: 80, P: 300 }, chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"], ["A", "B"]],
        angles: [ { at: "P", legs: ["A", "B"], t: "40°", o: { v: 40 } }, { at: "A", legs: ["O", "B"], t: "x", o: { v: 50, r: 40 } } ] },
      options: [ { text: "50°", correct: true }, { text: "40°" }, { text: "80°" }, { text: "100°" } ],
      answer: { en: "∠AOB = 2 × 40° = 80° (centre = 2 × circumference); then OA = OB gives x = (180° − 80°) ÷ 2 = 50°.", af: "∠AOB = 2 × 40° = 80° (middelpunt = 2 × omtrek); dan gee OA = OB: x = (180° − 80°) ÷ 2 = 50°." },
      explainReason: "centreDouble",
      hints: [
        { en: "First find the centre angle: ∠AOB = 2 × ∠APB (angle at centre = 2 × angle at circumference).",
          af: "Vind eers die middelpuntshoek: ∠AOB = 2 × ∠APB (middelpuntshoek = 2 × omtrekshoek)." },
        { en: "Now OA = OB (radii), so △OAB is isosceles: x = (180° − ∠AOB) ÷ 2.",
          af: "Nou is OA = OB (radiusse), dus △OAB is gelykbenig: x = (180° − ∠AOB) ÷ 2." },
      ] },

    // 3 — angle in a semicircle (90°) THEN angle sum of triangle
    { id: "dx3", type: "calc-mc", accent: G1, reasonCode: "semiCircle",
      prompt: { en: "AB is a diameter and ∠ABP = 35°. Find x = ∠BAP.", af: "AB is 'n middellyn en ∠ABP = 35°. Bereken x = ∠BAP." },
      diagram: { O: true, pts: { A: 180, B: 0, P: 110 }, chords: [["A", "B"], ["A", "P"], ["B", "P"]],
        angles: [ { at: "P", legs: ["A", "B"], t: "", o: { v: 90, mark: 1 } }, { at: "B", legs: ["A", "P"], t: "35°", o: { v: 35 } }, { at: "A", legs: ["B", "P"], t: "x", o: { v: 55 } } ] },
      options: [ { text: "55°", correct: true }, { text: "45°" }, { text: "35°" }, { text: "65°" } ],
      answer: { en: "∠APB = 90° (angle in a semicircle), so x = 180° − 90° − 35° = 55°.", af: "∠APB = 90° (hoek in 'n semi sirkel), dus x = 180° − 90° − 35° = 55°." },
      explainReason: "semiCircle",
      hints: [
        { en: "AB is a diameter, so ∠APB = 90° (angle in a semicircle).",
          af: "AB is 'n middellyn, dus ∠APB = 90° (hoek in 'n semi sirkel)." },
        { en: "The angles of △ABP add to 180°. Take away 90° and the 35° you're given.",
          af: "Die hoeke van △ABP is saam 180°. Trek 90° en die gegewe 35° af." },
      ] },

    // 4 — cyclic quad: opposite angles supplementary (algebra)
    { id: "dx4", type: "calc-mc", accent: G2, reasonCode: "cyclicOpp",
      prompt: { en: "ABCD is a cyclic quad with ∠A = x and ∠C = x + 40°. Find x.", af: "ABCD is 'n koordevierhoek met ∠A = x en ∠C = x + 40°. Bereken x." },
      diagram: { pts: { A: 150, B: 70, C: 350, D: 290 }, chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"]],
        angles: [ { at: "A", legs: ["D", "B"], t: "x", o: { v: 70 } }, { at: "C", legs: ["B", "D"], t: "x + 40°", o: { v: 110 } } ] },
      options: [ { text: "70°", correct: true }, { text: "110°" }, { text: "20°" }, { text: "90°" } ],
      answer: { en: "Opposite angles add to 180°: x + (x + 40°) = 180°, so 2x = 140° and x = 70°.", af: "Teenoorstaande hoeke tel op tot 180°: x + (x + 40°) = 180°, dus 2x = 140° en x = 70°." },
      explainReason: "cyclicOpp",
      hints: [
        { en: "∠A and ∠C are OPPOSITE angles of the cyclic quad, so they add up to 180°.",
          af: "∠A en ∠C is TEENOORSTAANDE hoeke van die koordevierhoek, dus tel hulle op tot 180°." },
        { en: "Write x + (x + 40°) = 180° and solve for x.",
          af: "Skryf x + (x + 40°) = 180° en los vir x op." },
      ] },

    // 5 — cyclic quad: exterior angle = interior opposite (algebra)
    { id: "dx5", type: "calc-mc", accent: G2, reasonCode: "cyclicExt",
      prompt: { en: "BC is produced to E. The exterior angle ∠DCE = 2x and the interior opposite angle ∠A = 100°. Find x.", af: "BC word verleng na E. Die buitehoek ∠DCE = 2x en die binne-teenoorstaande hoek ∠A = 100°. Bereken x." },
      diagram: { pts: { A: 135, B: 55, C: 315, D: 215 }, out: [{ name: "E", along: ["B", "C"], len: 30 }],
        chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["C", "E"]],
        angles: [ { at: "C", legs: ["D", "E"], t: "2x", o: { v: 100 } }, { at: "A", legs: ["D", "B"], t: "100°", o: { v: 100 } } ] },
      options: [ { text: "50°", correct: true }, { text: "100°" }, { text: "25°" }, { text: "80°" } ],
      answer: { en: "Exterior = interior opposite, so 2x = 100° and x = 50°.", af: "Buitehoek = teenoorstaande binnehoek, dus 2x = 100° en x = 50°." },
      explainReason: "cyclicExt",
      hints: [
        { en: "The exterior angle of a cyclic quad equals the interior angle at the OPPOSITE corner (∠A here).",
          af: "Die buitehoek van 'n koordevierhoek is gelyk aan die binnehoek by die TEENOORSTAANDE hoekpunt (∠A hier)." },
        { en: "So 2x = 100°. Halve it.",
          af: "Dus 2x = 100°. Halveer dit." },
      ] },

    // 6 — angles in the same segment (algebra)
    { id: "dx6", type: "calc-mc", accent: G2, reasonCode: "sameSeg",
      prompt: { en: "P and Q are on the same side of chord AB. ∠APB = 2x and ∠AQB = 64°. Find x.", af: "P en Q is aan dieselfde kant van koord AB. ∠APB = 2x en ∠AQB = 64°. Bereken x." },
      diagram: { pts: { A: 206, B: 334, P: 60, Q: 120 }, chords: [["A", "B"], ["A", "P"], ["B", "P"], ["A", "Q"], ["B", "Q"]],
        angles: [ { at: "P", legs: ["A", "B"], t: "2x", o: { v: 64 } }, { at: "Q", legs: ["A", "B"], t: "64°", o: { v: 64 } } ] },
      options: [ { text: "32°", correct: true }, { text: "64°" }, { text: "128°" }, { text: "40°" } ],
      answer: { en: "Same segment ⇒ ∠APB = ∠AQB, so 2x = 64°, giving x = 32°.", af: "Dieselfde segment ⇒ ∠APB = ∠AQB, dus 2x = 64°, wat x = 32° gee." },
      explainReason: "sameSeg",
      hints: [
        { en: "P and Q stand on the same chord AB on the same side, so ∠APB = ∠AQB (same segment).",
          af: "P en Q staan op dieselfde koord AB aan dieselfde kant, dus ∠APB = ∠AQB (dieselfde segment)." },
        { en: "Set 2x = 64° and solve for x.",
          af: "Stel 2x = 64° en los vir x op." },
      ] },

    // 7 — tan-chord, then angle sum of triangle to reach the tan-chord angle
    { id: "dx7", type: "calc-mc", accent: G3, reasonCode: "tanChord",
      prompt: { en: "STU is a tangent at T. In △TAB, ∠TAB = 57° and ∠ATB = 74°. Find x = ∠UTA (the tangent-chord angle on chord TA).", af: "STU is 'n raaklyn by T. In △TAB is ∠TAB = 57° en ∠ATB = 74°. Bereken x = ∠UTA (die raaklyn-koord-hoek op koord TA)." },
      diagram: { pts: { T: 270, A: 8, B: 156 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["T", "A"], ["T", "B"], ["A", "B"]],
        angles: [ { at: "T", legs: ["tg+", "A"], t: "x", o: { v: 49 } }, { at: "A", legs: ["T", "B"], t: "57°", o: { v: 57 } }, { at: "T", legs: ["A", "B"], t: "74°", o: { v: 74 } } ] },
      options: [ { text: "49°", correct: true }, { text: "57°" }, { text: "74°" }, { text: "62°" } ],
      answer: { en: "∠ABT = 180° − 57° − 74° = 49°; x = ∠ABT = 49° (tan-chord: ∠UTA = ∠ABT in the alternate segment).", af: "∠ABT = 180° − 57° − 74° = 49°; x = ∠ABT = 49° (raaklyn-koord: ∠UTA = ∠ABT in die oorstaande segment)." },
      explainReason: "tanChord",
      hints: [
        { en: "First find ∠ABT using the angle sum of △TAB (the three angles add to 180°).",
          af: "Vind eers ∠ABT met die hoeksom van △TAB (die drie hoeke is saam 180°)." },
        { en: "The tangent-chord angle ∠UTA equals ∠ABT, the angle in the alternate segment of chord TA.",
          af: "Die raaklyn-koord-hoek ∠UTA is gelyk aan ∠ABT, die hoek in die oorstaande segment van koord TA." },
      ] },

    // 8 — tangent ⊥ radius, then split the right angle
    { id: "dx8", type: "calc-mc", accent: G3, reasonCode: "tanRadius",
      prompt: { en: "STU is a tangent at T and OT is a radius, with A on the circle. If ∠ATU = 28°, find x = ∠OTA.", af: "STU is 'n raaklyn by T en OT 'n radius, met A op die sirkel. As ∠ATU = 28°, bereken x = ∠OTA." },
      diagram: { O: true, pts: { T: 270, A: 326 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["O", "T"], ["T", "A"]],
        angles: [ { at: "T", legs: ["A", "tg+"], t: "28°", o: { v: 28, r: 40 } }, { at: "T", legs: ["O", "A"], t: "x", o: { v: 62 } } ] },
      options: [ { text: "62°", correct: true }, { text: "28°" }, { text: "90°" }, { text: "118°" } ],
      answer: { en: "∠OTU = 90° (tan ⊥ radius), so x = 90° − 28° = 62°.", af: "∠OTU = 90° (raaklyn ⊥ radius), dus x = 90° − 28° = 62°." },
      explainReason: "tanRadius",
      hints: [
        { en: "The radius OT meets the tangent at 90° (tan ⊥ radius), so ∠OTU = 90°.",
          af: "Die radius OT ontmoet die raaklyn teen 90° (raaklyn ⊥ radius), dus ∠OTU = 90°." },
        { en: "∠OTA and ∠ATU together make that 90°, so x = 90° − 28°.",
          af: "∠OTA en ∠ATU maak saam daardie 90°, dus x = 90° − 28°." },
      ] },

    // 9 — two tangents (isosceles): given the apex, find a base angle
    { id: "dx9", type: "calc-mc", accent: G3, reasonCode: "isosBase",
      prompt: { en: "PT and PS are tangents from P and ∠TPS = 56°. Find x = ∠PTS.", af: "PT en PS is raaklyne vanaf P en ∠TPS = 56°. Bereken x = ∠PTS." },
      diagram: { h: 284, cx: 160, cy: 94, R: 58, pts: { T: 340, S: 216 }, ext: [{ name: "P", t: ["T", "S"] }], chords: [["T", "S"]],
        angles: [ { at: "P", legs: ["T", "S"], t: "56°", o: { v: 56 } }, { at: "T", legs: ["P", "S"], t: "x", o: { v: 62 } } ] },
      options: [ { text: "62°", correct: true }, { text: "56°" }, { text: "124°" }, { text: "68°" } ],
      answer: { en: "PT = PS (tangents from one point), so △PTS is isosceles: x = (180° − 56°) ÷ 2 = 62°.", af: "PT = PS (raaklyne vanaf een punt), dus △PTS is gelykbenig: x = (180° − 56°) ÷ 2 = 62°." },
      explainReason: "isosBase",
      hints: [
        { en: "Two tangents from the same point are equal: PT = PS, so △PTS is isosceles.",
          af: "Twee raaklyne vanaf dieselfde punt is gelyk: PT = PS, dus △PTS is gelykbenig." },
        { en: "The two base angles are equal and the three add to 180°: x = (180° − 56°) ÷ 2.",
          af: "Die twee basishoeke is gelyk en die drie tel op tot 180°: x = (180° − 56°) ÷ 2." },
      ] },

    // 10 — isosceles radii, the OTHER way: given a base angle, find the centre angle
    { id: "dx10", type: "calc-mc", accent: G1, reasonCode: "isosBase",
      prompt: { en: "O is the centre, so OA = OB. If the base angle ∠OAB = 35°, find x = ∠AOB.", af: "O is die middelpunt, dus OA = OB. As die basishoek ∠OAB = 35°, bereken x = ∠AOB." },
      diagram: { O: true, pts: { A: 160, B: 50 }, chords: [["O", "A"], ["O", "B"], ["A", "B"]],
        angles: [ { at: "A", legs: ["O", "B"], t: "35°", o: { v: 35, r: 40 } }, { at: "O", legs: ["A", "B"], t: "x", o: { v: 110 } } ] },
      options: [ { text: "110°", correct: true }, { text: "35°" }, { text: "70°" }, { text: "145°" } ],
      answer: { en: "OA = OB, so ∠OBA = ∠OAB = 35°; x = 180° − 35° − 35° = 110°.", af: "OA = OB, dus ∠OBA = ∠OAB = 35°; x = 180° − 35° − 35° = 110°." },
      explainReason: "isosBase",
      hints: [
        { en: "OA = OB (radii), so the two base angles are equal: ∠OBA = ∠OAB = 35°.",
          af: "OA = OB (radiusse), dus die twee basishoeke is gelyk: ∠OBA = ∠OAB = 35°." },
        { en: "The three angles of △OAB add to 180°: x = 180° − 35° − 35°.",
          af: "Die drie hoeke van △OAB is saam 180°: x = 180° − 35° − 35°." },
      ] },

    // 11 — two tangents, the OTHER way: given a base angle, find the apex
    { id: "dx11", type: "calc-mc", accent: G3, reasonCode: "isosBase",
      prompt: { en: "PT and PS are tangents from P and the base angle ∠PTS = 64°. Find x = ∠TPS.", af: "PT en PS is raaklyne vanaf P en die basishoek ∠PTS = 64°. Bereken x = ∠TPS." },
      diagram: { h: 284, cx: 160, cy: 94, R: 58, pts: { T: 340, S: 212 }, ext: [{ name: "P", t: ["T", "S"] }], chords: [["T", "S"]],
        angles: [ { at: "T", legs: ["P", "S"], t: "64°", o: { v: 64 } }, { at: "P", legs: ["T", "S"], t: "x", o: { v: 52 } } ] },
      options: [ { text: "52°", correct: true }, { text: "64°" }, { text: "128°" }, { text: "116°" } ],
      answer: { en: "PT = PS, so ∠PST = ∠PTS = 64°; x = 180° − 64° − 64° = 52°.", af: "PT = PS, dus ∠PST = ∠PTS = 64°; x = 180° − 64° − 64° = 52°." },
      explainReason: "isosBase",
      hints: [
        { en: "PT = PS (tangents from one point), so the base angles are equal: ∠PST = ∠PTS = 64°.",
          af: "PT = PS (raaklyne vanaf een punt), dus die basishoeke is gelyk: ∠PST = ∠PTS = 64°." },
        { en: "The three angles of △PTS add to 180°: x = 180° − 64° − 64°.",
          af: "Die drie hoeke van △PTS is saam 180°: x = 180° − 64° − 64°." },
      ] },

    // 12 — centre = 2 × circumference, THEN same segment for a second point
    { id: "dx12", type: "calc-mc", accent: G2, reasonCode: "centreDouble",
      prompt: { en: "O is the centre and ∠AOB = 120°. P and Q are on the major arc. Find x = ∠AQB.", af: "O is die middelpunt en ∠AOB = 120°. P en Q is op die groot boog. Bereken x = ∠AQB." },
      diagram: { O: true, pts: { A: 150, B: 30, P: 250, Q: 290 }, chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"], ["Q", "A"], ["Q", "B"]],
        angles: [ { at: "O", legs: ["A", "B"], t: "120°", o: { v: 120 } }, { at: "Q", legs: ["A", "B"], t: "x", o: { v: 60 } } ] },
      options: [ { text: "60°", correct: true }, { text: "120°" }, { text: "240°" }, { text: "30°" } ],
      answer: { en: "∠APB = 120° ÷ 2 = 60° (centre = 2 × circumference); ∠AQB = ∠APB = 60° (same segment).", af: "∠APB = 120° ÷ 2 = 60° (middelpunt = 2 × omtrek); ∠AQB = ∠APB = 60° (dieselfde segment)." },
      explainReason: "centreDouble",
      hints: [
        { en: "The angle at the circumference is half the centre angle: ∠APB = 120° ÷ 2.",
          af: "Die omtrekshoek is die helfte van die middelpuntshoek: ∠APB = 120° ÷ 2." },
        { en: "Q is on the same arc as P, so ∠AQB = ∠APB (angles in the same segment).",
          af: "Q is op dieselfde boog as P, dus ∠AQB = ∠APB (hoeke in dieselfde segment)." },
      ] },
  ],
};
