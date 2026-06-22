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

    // ===== BATCH 2 — tangent-heavy + reflex (filling the gaps) =====

    // 13 — reflex case: P on the minor arc, centre angle is the reflex
    { id: "dx13", type: "calc-mc", accent: G1, reasonCode: "centreDouble",
      prompt: { en: "P is on the minor arc and ∠APB = 115°. Find the REFLEX angle ∠AOB at the centre.", af: "P is op die kleiner boog en ∠APB = 115°. Bereken die INSPRINGENDE hoek ∠AOB by die middelpunt." },
      diagram: { O: true, pts: { A: 160, B: 30, P: 95 }, chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]],
        angles: [ { at: "P", legs: ["A", "B"], t: "115°", o: { v: 115 } } ] },
      options: [ { text: "230°", correct: true }, { text: "115°" }, { text: "130°" }, { text: "260°" } ],
      answer: { en: "Reflex ∠AOB = 2 × ∠APB = 2 × 115° = 230°.", af: "Inspringende ∠AOB = 2 × ∠APB = 2 × 115° = 230°." },
      explainReason: "centreDouble",
      hints: [
        { en: "P is on the minor arc, so the matching centre angle is the REFLEX ∠AOB (the big one round the back).", af: "P is op die kleiner boog, dus is die ooreenstemmende middelpuntshoek die INSPRINGENDE ∠AOB (die grote om die agterkant)." },
        { en: "Reflex ∠AOB = 2 × ∠APB. Double the angle at P.", af: "Inspringende ∠AOB = 2 × ∠APB. Verdubbel die hoek by P." },
      ] },

    // 14 — tan-chord, then triangle, to reach the APEX angle
    { id: "dx14", type: "calc-mc", accent: G3, reasonCode: "tanChord",
      prompt: { en: "STU is a tangent at T. The tangent-chord angle ∠UTA = 49° and ∠TAB = 57°. Find x = ∠ATB.", af: "STU is 'n raaklyn by T. Die raaklyn-koord-hoek ∠UTA = 49° en ∠TAB = 57°. Bereken x = ∠ATB." },
      diagram: { pts: { T: 270, A: 8, B: 156 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["T", "A"], ["T", "B"], ["A", "B"]],
        angles: [ { at: "T", legs: ["tg+", "A"], t: "49°", o: { v: 49 } }, { at: "A", legs: ["T", "B"], t: "57°", o: { v: 57 } }, { at: "T", legs: ["A", "B"], t: "x", o: { v: 74 } } ] },
      options: [ { text: "74°", correct: true }, { text: "49°" }, { text: "57°" }, { text: "82°" } ],
      answer: { en: "∠ABT = ∠UTA = 49° (tan-chord, alternate segment); x = 180° − 49° − 57° = 74°.", af: "∠ABT = ∠UTA = 49° (raaklyn-koord, oorstaande segment); x = 180° − 49° − 57° = 74°." },
      explainReason: "tanChord",
      hints: [
        { en: "The tangent-chord angle equals the angle in the alternate segment: ∠ABT = ∠UTA = 49°.", af: "Die raaklyn-koord-hoek is gelyk aan die hoek in die oorstaande segment: ∠ABT = ∠UTA = 49°." },
        { en: "Now use the angle sum of △ATB: x = 180° − 49° − 57°.", af: "Gebruik nou die hoeksom van △ATB: x = 180° − 49° − 57°." },
      ] },

    // 15 — tan-chord gives one inscribed angle; the opposite side is its supplement
    { id: "dx15", type: "calc-mc", accent: G3, reasonCode: "tanChord",
      prompt: { en: "STU is a tangent at T and ∠UTA = 64°. P and Q are on opposite sides of chord TA. Find x = ∠TQA.", af: "STU is 'n raaklyn by T en ∠UTA = 64°. P en Q is aan teenoorgestelde kante van koord TA. Bereken x = ∠TQA." },
      diagram: { pts: { T: 270, A: 38, P: 150, Q: 330 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["T", "A"], ["P", "T"], ["P", "A"], ["Q", "T"], ["Q", "A"]],
        angles: [ { at: "T", legs: ["tg+", "A"], t: "64°", o: { v: 64 } }, { at: "Q", legs: ["T", "A"], t: "x", o: { v: 116 } } ] },
      options: [ { text: "116°", correct: true }, { text: "64°" }, { text: "124°" }, { text: "52°" } ],
      answer: { en: "∠TPA = ∠UTA = 64° (tan-chord); ∠TQA is on the opposite side of TA, so x = 180° − 64° = 116°.", af: "∠TPA = ∠UTA = 64° (raaklyn-koord); ∠TQA is aan die ander kant van TA, dus x = 180° − 64° = 116°." },
      explainReason: "tanChord",
      hints: [
        { en: "The tangent-chord angle equals ∠TPA in the alternate segment: ∠TPA = 64°.", af: "Die raaklyn-koord-hoek is gelyk aan ∠TPA in die oorstaande segment: ∠TPA = 64°." },
        { en: "Q is on the OTHER side of chord TA, so ∠TQA is the supplement: x = 180° − 64°.", af: "Q is aan die ANDER kant van koord TA, dus ∠TQA is die supplement: x = 180° − 64°." },
      ] },

    // 16 — tangent ⊥ radius: split the right angle (given the radius part)
    { id: "dx16", type: "calc-mc", accent: G3, reasonCode: "tanRadius",
      prompt: { en: "STU is a tangent at T and OT is a radius, with C on the circle. If ∠OTC = 62°, find x = ∠CTU.", af: "STU is 'n raaklyn by T en OT 'n radius, met C op die sirkel. As ∠OTC = 62°, bereken x = ∠CTU." },
      diagram: { O: true, pts: { T: 270, C: 326 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["O", "T"], ["T", "C"]],
        angles: [ { at: "T", legs: ["O", "C"], t: "62°", o: { v: 62 } }, { at: "T", legs: ["C", "tg+"], t: "x", o: { v: 28, r: 40 } } ] },
      options: [ { text: "28°", correct: true }, { text: "62°" }, { text: "90°" }, { text: "118°" } ],
      answer: { en: "∠OTU = 90° (tan ⊥ radius), so x = 90° − 62° = 28°.", af: "∠OTU = 90° (raaklyn ⊥ radius), dus x = 90° − 62° = 28°." },
      explainReason: "tanRadius",
      hints: [
        { en: "The radius and the tangent meet at 90° (tan ⊥ radius), so ∠OTU = 90°.", af: "Die radius en die raaklyn ontmoet teen 90° (raaklyn ⊥ radius), dus ∠OTU = 90°." },
        { en: "∠OTC and ∠CTU split that 90°, so x = 90° − 62°.", af: "∠OTC en ∠CTU verdeel daardie 90°, dus x = 90° − 62°." },
      ] },

    // 17 — two tangents + two radii: the centre angle (∠O + ∠P = 180°)
    { id: "dx17", type: "calc-mc", accent: G3, reasonCode: "tanRadius",
      prompt: { en: "PT and PS are tangents from P, and OT, OS are radii. If ∠TPS = 50°, find x = ∠TOS.", af: "PT en PS is raaklyne vanaf P, en OT, OS is radiusse. As ∠TPS = 50°, bereken x = ∠TOS." },
      diagram: { O: true, h: 284, cx: 160, cy: 150, R: 70, pts: { T: 320, S: 190 }, ext: [{ name: "P", t: ["T", "S"] }], chords: [["O", "T"], ["O", "S"]],
        angles: [ { at: "P", legs: ["T", "S"], t: "50°", o: { v: 50 } }, { at: "O", legs: ["T", "S"], t: "x", o: { v: 130 } } ] },
      options: [ { text: "130°", correct: true }, { text: "50°" }, { text: "100°" }, { text: "65°" } ],
      answer: { en: "OT ⊥ PT and OS ⊥ PS, so in quad OTPS: ∠TOS = 360° − 90° − 90° − 50° = 130°.", af: "OT ⊥ PT en OS ⊥ PS, dus in vierhoek OTPS: ∠TOS = 360° − 90° − 90° − 50° = 130°." },
      explainReason: "tanRadius",
      hints: [
        { en: "Each tangent meets its radius at 90° (tan ⊥ radius): ∠OTP = ∠OSP = 90°.", af: "Elke raaklyn ontmoet sy radius teen 90° (raaklyn ⊥ radius): ∠OTP = ∠OSP = 90°." },
        { en: "The four angles of quad OTPS add to 360°, so x = 360° − 90° − 90° − 50°.", af: "Die vier hoeke van vierhoek OTPS is saam 360°, dus x = 360° − 90° − 90° − 50°." },
      ] },

    // 18 — tangent ⊥ diameter: split the right angle
    { id: "dx18", type: "calc-mc", accent: G3, reasonCode: "tanDiameter",
      prompt: { en: "STU is a tangent at T and TD is a diameter, with C on the circle. If ∠DTC = 65°, find x = ∠CTU.", af: "STU is 'n raaklyn by T en TD 'n middellyn, met C op die sirkel. As ∠DTC = 65°, bereken x = ∠CTU." },
      diagram: { O: true, pts: { T: 270, D: 90, C: 320 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["T", "D"], ["T", "C"]],
        angles: [ { at: "T", legs: ["D", "C"], t: "65°", o: { v: 65 } }, { at: "T", legs: ["C", "tg+"], t: "x", o: { v: 25 } } ] },
      options: [ { text: "25°", correct: true }, { text: "65°" }, { text: "90°" }, { text: "155°" } ],
      answer: { en: "∠DTU = 90° (tan ⊥ diameter), so x = 90° − 65° = 25°.", af: "∠DTU = 90° (raaklyn ⊥ middellyn), dus x = 90° − 65° = 25°." },
      explainReason: "tanDiameter",
      hints: [
        { en: "TD is a diameter (a radius), so the tangent meets it at 90°: ∠DTU = 90°.", af: "TD is 'n middellyn ('n radius), dus die raaklyn ontmoet dit teen 90°: ∠DTU = 90°." },
        { en: "∠DTC and ∠CTU split that 90°, so x = 90° − 65°.", af: "∠DTC en ∠CTU verdeel daardie 90°, dus x = 90° − 65°." },
      ] },

    // 19 — tan-chord, then triangle, to the apex (a different figure)
    { id: "dx19", type: "calc-mc", accent: G3, reasonCode: "tanChord",
      prompt: { en: "STU is a tangent at T. The tangent-chord angle ∠STB = 49° and ∠ABT = 63°. Find x = ∠ATB.", af: "STU is 'n raaklyn by T. Die raaklyn-koord-hoek ∠STB = 49° en ∠ABT = 63°. Bereken x = ∠ATB." },
      diagram: { pts: { T: 270, A: 36, B: 172 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["T", "A"], ["T", "B"], ["A", "B"]],
        angles: [ { at: "T", legs: ["tg-", "B"], t: "49°", o: { v: 49 } }, { at: "B", legs: ["T", "A"], t: "63°", o: { v: 63 } }, { at: "T", legs: ["A", "B"], t: "x", o: { v: 68 } } ] },
      options: [ { text: "68°", correct: true }, { text: "49°" }, { text: "63°" }, { text: "75°" } ],
      answer: { en: "∠TAB = ∠STB = 49° (tan-chord, alternate segment); x = 180° − 49° − 63° = 68°.", af: "∠TAB = ∠STB = 49° (raaklyn-koord, oorstaande segment); x = 180° − 49° − 63° = 68°." },
      explainReason: "tanChord",
      hints: [
        { en: "The tangent-chord angle equals the angle in the alternate segment: ∠TAB = ∠STB = 49°.", af: "Die raaklyn-koord-hoek is gelyk aan die hoek in die oorstaande segment: ∠TAB = ∠STB = 49°." },
        { en: "Now use the angle sum of △ATB: x = 180° − 49° − 63°.", af: "Gebruik nou die hoeksom van △ATB: x = 180° − 49° − 63°." },
      ] },

    // 20 — reflex centre given, find the angle at the circumference
    { id: "dx20", type: "calc-mc", accent: G1, reasonCode: "centreDouble",
      prompt: { en: "The reflex angle ∠AOB = 240° at the centre, with P on the minor arc. Find x = ∠APB.", af: "Die inspringende hoek ∠AOB = 240° by die middelpunt, met P op die kleiner boog. Bereken x = ∠APB." },
      diagram: { O: true, pts: { A: 170, B: 50, P: 110 }, chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]],
        angles: [ { at: "P", legs: ["A", "B"], t: "x", o: { v: 120 } } ] },
      options: [ { text: "120°", correct: true }, { text: "240°" }, { text: "60°" }, { text: "130°" } ],
      answer: { en: "∠APB = reflex ∠AOB ÷ 2 = 240° ÷ 2 = 120°.", af: "∠APB = inspringende ∠AOB ÷ 2 = 240° ÷ 2 = 120°." },
      explainReason: "centreDouble",
      hints: [
        { en: "P is on the minor arc, so it pairs with the REFLEX centre angle: reflex ∠AOB = 2 × ∠APB.", af: "P is op die kleiner boog, dus pas dit by die INSPRINGENDE middelpuntshoek: inspringende ∠AOB = 2 × ∠APB." },
        { en: "So ∠APB is half of the reflex angle: x = 240° ÷ 2.", af: "Dus is ∠APB die helfte van die inspringende hoek: x = 240° ÷ 2." },
      ] },

    // 21 — diameter + centre = 2 × circumference
    { id: "dx21", type: "calc-mc", accent: G1, reasonCode: "centreDouble",
      prompt: { en: "O is the centre, AB is a diameter and C is on the circle. If ∠BOC = 70°, find x = ∠BAC.", af: "O is die middelpunt, AB is 'n middellyn en C is op die sirkel. As ∠BOC = 70°, bereken x = ∠BAC." },
      diagram: { O: true, pts: { A: 180, B: 0, C: 70 }, chords: [["A", "B"], ["O", "C"], ["A", "C"], ["B", "C"]],
        angles: [ { at: "O", legs: ["B", "C"], t: "70°", o: { v: 70 } }, { at: "A", legs: ["B", "C"], t: "x", o: { v: 35, r: 46 } } ] },
      options: [ { text: "35°", correct: true }, { text: "70°" }, { text: "140°" }, { text: "55°" } ],
      answer: { en: "∠BAC and ∠BOC stand on the same arc BC, so ∠BAC = ∠BOC ÷ 2 = 70° ÷ 2 = 35°.", af: "∠BAC en ∠BOC staan op dieselfde boog BC, dus ∠BAC = ∠BOC ÷ 2 = 70° ÷ 2 = 35°." },
      explainReason: "centreDouble",
      hints: [
        { en: "∠BOC is at the centre and ∠BAC is at the circumference, both on arc BC.", af: "∠BOC is by die middelpunt en ∠BAC by die omtrek, albei op boog BC." },
        { en: "The circumference angle is half the centre angle: x = 70° ÷ 2.", af: "Die omtrekshoek is die helfte van die middelpuntshoek: x = 70° ÷ 2." },
      ] },

    // 22 — tan-chord, then triangle, for a base angle of the triangle
    { id: "dx22", type: "calc-mc", accent: G3, reasonCode: "tanChord",
      prompt: { en: "STU is a tangent at T. The tangent-chord angle ∠UTA = 49° and the apex ∠ATB = 74°. Find x = ∠TAB.", af: "STU is 'n raaklyn by T. Die raaklyn-koord-hoek ∠UTA = 49° en die apeks ∠ATB = 74°. Bereken x = ∠TAB." },
      diagram: { pts: { T: 270, A: 8, B: 156 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["T", "A"], ["T", "B"], ["A", "B"]],
        angles: [ { at: "T", legs: ["tg+", "A"], t: "49°", o: { v: 49 } }, { at: "T", legs: ["A", "B"], t: "74°", o: { v: 74 } }, { at: "A", legs: ["T", "B"], t: "x", o: { v: 57 } } ] },
      options: [ { text: "57°", correct: true }, { text: "49°" }, { text: "74°" }, { text: "64°" } ],
      answer: { en: "∠ABT = ∠UTA = 49° (tan-chord); x = 180° − 74° − 49° = 57°.", af: "∠ABT = ∠UTA = 49° (raaklyn-koord); x = 180° − 74° − 49° = 57°." },
      explainReason: "tanChord",
      hints: [
        { en: "The tangent-chord angle equals ∠ABT in the alternate segment: ∠ABT = 49°.", af: "Die raaklyn-koord-hoek is gelyk aan ∠ABT in die oorstaande segment: ∠ABT = 49°." },
        { en: "Use the angle sum of △ATB: x = 180° − 74° − 49°.", af: "Gebruik die hoeksom van △ATB: x = 180° − 74° − 49°." },
      ] },

    // 23 — isosceles radii (fresh numbers)
    { id: "dx23", type: "calc-mc", accent: G1, reasonCode: "isosBase",
      prompt: { en: "O is the centre, so OA = OB. If ∠AOB = 100°, find x = ∠OAB.", af: "O is die middelpunt, dus OA = OB. As ∠AOB = 100°, bereken x = ∠OAB." },
      diagram: { O: true, pts: { A: 160, B: 60 }, chords: [["O", "A"], ["O", "B"], ["A", "B"]],
        angles: [ { at: "O", legs: ["A", "B"], t: "100°", o: { v: 100 } }, { at: "A", legs: ["O", "B"], t: "x", o: { v: 40, r: 40 } } ] },
      options: [ { text: "40°", correct: true }, { text: "50°" }, { text: "80°" }, { text: "100°" } ],
      answer: { en: "OA = OB (radii), so x = (180° − 100°) ÷ 2 = 40°.", af: "OA = OB (radiusse), dus x = (180° − 100°) ÷ 2 = 40°." },
      explainReason: "isosBase",
      hints: [
        { en: "OA = OB are radii, so △OAB is isosceles — the two base angles are equal.", af: "OA = OB is radiusse, dus △OAB is gelykbenig — die twee basishoeke is gelyk." },
        { en: "The three angles add to 180°: x = (180° − 100°) ÷ 2.", af: "Die drie hoeke is saam 180°: x = (180° − 100°) ÷ 2." },
      ] },

    // 24 — two tangents (isosceles): given a base angle, find the apex (fresh numbers)
    { id: "dx24", type: "calc-mc", accent: G3, reasonCode: "isosBase",
      prompt: { en: "PT and PS are tangents from P and the base angle ∠PTS = 70°. Find x = ∠TPS.", af: "PT en PS is raaklyne vanaf P en die basishoek ∠PTS = 70°. Bereken x = ∠TPS." },
      diagram: { h: 284, cx: 160, cy: 94, R: 58, pts: { T: 340, S: 200 }, ext: [{ name: "P", t: ["T", "S"] }], chords: [["T", "S"]],
        angles: [ { at: "T", legs: ["P", "S"], t: "70°", o: { v: 70 } }, { at: "P", legs: ["T", "S"], t: "x", o: { v: 40 } } ] },
      options: [ { text: "40°", correct: true }, { text: "70°" }, { text: "140°" }, { text: "20°" } ],
      answer: { en: "PT = PS, so ∠PST = ∠PTS = 70°; x = 180° − 70° − 70° = 40°.", af: "PT = PS, dus ∠PST = ∠PTS = 70°; x = 180° − 70° − 70° = 40°." },
      explainReason: "isosBase",
      hints: [
        { en: "PT = PS (tangents from one point), so the base angles are equal: ∠PST = ∠PTS = 70°.", af: "PT = PS (raaklyne vanaf een punt), dus die basishoeke is gelyk: ∠PST = ∠PTS = 70°." },
        { en: "The three angles of △PTS add to 180°: x = 180° − 70° − 70°.", af: "Die drie hoeke van △PTS is saam 180°: x = 180° − 70° − 70°." },
      ] },
  ],
};
