/* Proof rounds P3 — "T2 discovery: angle at the centre"
   (PROOF-ROUNDS-PLAN.md, session 3 — the T2 arc.)
   ------------------------------------------------------------------------
   T2 is "the angle at the centre is double the angle at the circumference,
   subtended by the same arc" (∠AOB = 2 × ∠APB). Her cheat notes' five-step
   recipe: draw the diameter through the circumference point → label the
   base angles x and y → the two triangles are isosceles (radii!) → the
   exterior angle theorem doubles each base angle → add. This round teaches
   THAT construction on the plain/standard picture. P4 (proof4-t2-transfer.js)
   carries the exact same five steps across a reflex angle and a bowtie.

   SIX PANELS (one more than pr1's five — the maths genuinely has one more
   stage than T1: T1 combines a single congruency test, T2 stacks isosceles
   base angles UNDER an exterior-angle doubling UNDER an addition), all
   taps, rendered through renderInvestigate() exactly like pr0/pr1/pr2 —
   `kind: "proof"` gets predict/choice/note panels and per-panel XP for
   free, no new engine surface:
     1 · predict — bare figure + the claim (∠AOB = 2×∠APB, unlabelled arcs
         so nothing is spoiled). "What do you THINK could prove this?"
         Every option accepted; the construction is drawn on the NEXT
         panel regardless of the guess (guided-discovery rule).
     2 · choice  — the construction has appeared: P extended straight
         through O to a new point Q, OP/OQ/OA/OB tick-marked equal. Why is
         that the useful first move? (It creates two isosceles triangles.)
     3 · choice  — same figure. What SPECIFICALLY makes OPA and OPB
         isosceles? (They're all radii — the reason, not the picture.)
     4 · choice  — base angles x, y now labelled at P. O, P, Q collinear,
         so the angle at O between OA and OQ is triangle OPA's exterior
         angle. What does the exterior angle theorem hand you? (2x.)
     5 · choice  — ∠AOQ = 2x and ∠BOQ = 2y, both marked. O sits between
         them on line PQ, so they add up to the whole ∠AOB. Combine.
     6 · note    — the recap / takeaway sentence, meant to survive into
         every other T2 picture: "draw the diameter through the
         circumference point, then let the exterior angles add up."
         Genuinely the last panel of this round.

   GEOMETRY — reused, not invented (PROOF-ROUNDS-PLAN.md build brief,
   session 3 instructions point at discover-centre-circ.js, "the main-map
   round" for this theorem). A:230, B:310, P:90 are the EXACT degrees that
   file's own closing static panel already uses (its "Try it with a number"
   diagram, line ~89 of that file) — ∠AOB = 80°, ∠APB = 40°, verified
   there already, carried over verbatim rather than re-derived. Q, this
   round's own addition, is P's exact antipode (P + 180 = 270) — the far
   end of the diameter drawn through P.

   Every angle mark below is an EXACT integer, not a rounded estimate,
   because both triangles this construction builds are isosceles by a
   clean rule (two radii), which pins their base angles by a clean rule
   (apex angle from O is a plain degree difference, since legDir() from
   the centre resolves to the point's own placement degree — see
   engine.js's pol()/legDir — so O-vertex angles here are exact subtraction,
   not trig estimates):
     apex ∠AOP = |230 − 90| = 140°   →   x = (180 − 140) / 2 = 20°
     apex ∠BOP = |90 − 310| → 360−220 = 140°   →   y = (180 − 140) / 2 = 20°
     ∠AOQ = 180 − ∠AOP = 40° = 2x        (P, O, Q collinear ⇒ supplementary)
     ∠BOQ = 180 − ∠BOP = 40° = 2y
     ∠AOB = ∠AOQ + ∠BOQ = 80° = 2(x + y) = 2 × ∠APB (40°)                    */

const AC = "#9c36b5";

/* ---- panel 1: bare figure, before the construction ----
   O, A, B, P on the circle; chord AB and both angle-arms drawn; both
   angles marked but UNLABELLED (t: "") — the claim is general, not a
   specific number, so nothing is spoiled before the guess. */
const FIG_CLAIM = {
  O: true,
  pts: { A: 230, B: 310, P: 90 },
  chords: [["A", "B"], ["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]],
  angles: [
    { at: "O", legs: ["A", "B"], t: "", o: { v: 80 } },
    { at: "P", legs: ["A", "B"], t: "", o: { v: 40 } },
  ],
};

/* ---- panels 2-3: the construction has appeared ----
   P extended straight through O to Q (P's antipode); OP, OQ, OA, OB all
   tick-marked equal — every radius, no measuring needed. No angle marks
   yet: panels 2-3 are about WHY the construction works, before any angle
   gets a name. */
const FIG_CONSTRUCT_BARE = {
  O: true,
  pts: { A: 230, B: 310, P: 90, Q: 270 },
  chords: [
    ["A", "B"],
    { a: "O", b: "P", mk: "t1" },
    { a: "O", b: "Q", mk: "t1" },
    { a: "O", b: "A", mk: "t1" },
    { a: "O", b: "B", mk: "t1" },
    ["P", "A"], ["P", "B"],
  ],
};

/* ---- panel 4: base angles x, y labelled at P; the mystery angle at O ----
   Same construction, plus the two isosceles base angles (x at OPA, y at
   OPB) and ONE unlabelled arc at O (∠AOQ) — the exterior angle the panel
   is asking about. ∠BOQ isn't drawn yet; it arrives, mirrored, in panel 5. */
const FIG_XY = {
  O: true,
  pts: { A: 230, B: 310, P: 90, Q: 270 },
  chords: [
    ["A", "B"],
    { a: "O", b: "P", mk: "t1" },
    { a: "O", b: "Q", mk: "t1" },
    { a: "O", b: "A", mk: "t1" },
    { a: "O", b: "B", mk: "t1" },
    ["P", "A"], ["P", "B"],
  ],
  angles: [
    { at: "P", legs: ["O", "A"], t: "x", o: { v: 20 } },
    { at: "P", legs: ["O", "B"], t: "y", o: { v: 20 } },
    { at: "O", legs: ["A", "Q"], t: "", o: { v: 40 } },
  ],
};

/* ---- panel 5: both doubled angles at O now labelled — combine ---- */
const FIG_COMBINE = {
  O: true,
  pts: { A: 230, B: 310, P: 90, Q: 270 },
  chords: [
    ["A", "B"],
    { a: "O", b: "P", mk: "t1" },
    { a: "O", b: "Q", mk: "t1" },
    { a: "O", b: "A", mk: "t1" },
    { a: "O", b: "B", mk: "t1" },
    ["P", "A"], ["P", "B"],
  ],
  angles: [
    { at: "P", legs: ["O", "A"], t: "x", o: { v: 20 } },
    { at: "P", legs: ["O", "B"], t: "y", o: { v: 20 } },
    { at: "O", legs: ["A", "Q"], t: "2x", o: { v: 40 } },
    { at: "O", legs: ["B", "Q"], t: "2y", o: { v: 40 } },
  ],
};

/* ---- panel 6: recap — the clean result, sub-angles collapsed away ---- */
const FIG_FINAL = {
  O: true,
  pts: { A: 230, B: 310, P: 90, Q: 270 },
  chords: [
    ["A", "B"],
    { a: "O", b: "P", mk: "t1" },
    { a: "O", b: "Q", mk: "t1" },
    { a: "O", b: "A", mk: "t1" },
    { a: "O", b: "B", mk: "t1" },
    ["P", "A"], ["P", "B"],
  ],
  angles: [
    { at: "O", legs: ["A", "B"], t: "2(x+y)", o: { v: 80 } },
    { at: "P", legs: ["A", "B"], t: "x+y", o: { v: 40 } },
  ],
};

export const round = {
  id: "pr3", n: 0, accent: AC, kind: "proof", group: "g7",
  title: { en: "T2 discovery: angle at the centre", af: "T2-ontdekking: hoek by die middelpunt" },
  blurb: {
    en: "Prove the angle at the centre is double the angle at the circumference — two isosceles triangles and an exterior angle.",
    af: "Bewys die hoek by die middelpunt is dubbel die hoek by die omtrek — twee gelykbenige driehoeke en 'n buitehoek.",
  },
  panels: [

    /* ---------- 1 · the claim, and a guess ---------- */
    {
      type: "predict",
      prompt: {
        en: "Here is the picture: O is the centre, A and B are on the circle, and P is another point on the circle. Chord AB makes ∠AOB at the centre and ∠APB at the circumference — both stand on the same arc AB. The claim is that ∠AOB is always DOUBLE ∠APB. What do you THINK could prove that?",
        af: "Hier is die prentjie: O is die middelpunt, A en B is op die sirkel, en P is nog 'n punt op die sirkel. Koord AB maak ∠AOB by die middelpunt en ∠APB by die omtrek — albei staan op dieselfde boog AB. Die bewering is dat ∠AOB altyd DUBBEL ∠APB is. Wat dink jy sou dit kon bewys?",
      },
      diagram: FIG_CLAIM,
      options: [
        { text: { en: "Isosceles triangles", af: "Gelykbenige driehoeke" }, correct: true },
        { text: { en: "Congruent triangles", af: "Kongruente driehoeke" } },
        { text: { en: "Pythagoras", af: "Pythagoras" } },
        { text: { en: "The tan-chord theorem", af: "Die raaklyn-koord-stelling" } },
        { text: { en: "Equal chords, equal angles", af: "Gelyke koorde, gelyke hoeke" } },
      ],
      reactRight: {
        en: "Good instinct — isosceles triangles really are the key. Let's build them and see exactly how the \"double\" appears.",
        af: "Goeie aanvoeling — gelykbenige driehoeke is werklik die sleutel. Kom ons bou hulle en kyk presies hoe die \"dubbel\" verskyn.",
      },
      reactWrong: {
        en: "Good guess — here's a hint: watch what happens the moment we draw the diameter straight through P.",
        af: "Goeie raaiskoot — hier's 'n wenk: kyk wat gebeur die oomblik wat ons die middellyn reguit deur P trek.",
      },
      after: {
        en: "A new point is about to appear on the far side of the circle from P. Nothing else changes yet.",
        af: "'n Nuwe punt gaan nou-nou aan die verste kant van die sirkel van P af verskyn. Niks anders verander nog nie.",
      },
    },

    /* ---------- 2 · the construction, and why it's useful ---------- */
    {
      type: "choice",
      prompt: {
        en: "The construction: P has been extended straight through the centre O to a new point, Q, on the far side of the circle — OP, OQ, OA and OB are all radii, tick-marked equal. Why is drawing this diameter through P the useful first move?",
        af: "Die konstruksie: P is reguit deur die middelpunt O verleng na 'n nuwe punt, Q, aan die verste kant van die sirkel — OP, OQ, OA en OB is almal radiusse, gemerk as gelyk. Hoekom is dit om hierdie middellyn deur P te trek die nuttige eerste stap?",
      },
      diagram: FIG_CONSTRUCT_BARE,
      options: [
        { text: { en: "It creates two isosceles triangles, OPA and OPB", af: "Dit skep twee gelykbenige driehoeke, OPA en OPB" }, correct: true },
        { text: { en: "It creates two congruent triangles, OPA and OPB", af: "Dit skep twee kongruente driehoeke, OPA en OPB" } },
        { text: { en: "It makes PA parallel to OB", af: "Dit maak PA ewewydig aan OB" } },
        { text: { en: "It automatically cuts ∠APB exactly in half", af: "Dit sny ∠APB outomaties presies in twee helftes" } },
      ],
      hints: [
        { en: "Look at what's tick-marked equal on the diagram: OP, OQ, OA, OB — every one of them is a radius. What kind of triangle has two equal sides?",
          af: "Kyk na wat op die diagram as gelyk gemerk is: OP, OQ, OA, OB — elkeen daarvan is 'n radius. Watter soort driehoek het twee gelyke sye?" },
        { en: "OP = OA (both radii) makes triangle OPA isosceles; OP = OB makes OPB isosceles too. Two isosceles triangles, for free, just from drawing a diameter.",
          af: "OP = OA (albei radiusse) maak driehoek OPA gelykbenig; OP = OB maak OPB ook gelykbenig. Twee gelykbenige driehoeke, verniet, net deur 'n middellyn te trek." },
      ],
      reason: "construction",
      note: {
        en: "OP, OQ, OA and OB are all radii of the same circle, so they're automatically equal — no measuring needed. That single fact makes triangle OPA isosceles (OP = OA) and triangle OPB isosceles (OP = OB). Two isosceles triangles, built for free.",
        af: "OP, OQ, OA en OB is almal radiusse van dieselfde sirkel, dus is hulle outomaties gelyk — geen meting nodig nie. Daardie een feit maak driehoek OPA gelykbenig (OP = OA) en driehoek OPB ook gelykbenig (OP = OB). Twee gelykbenige driehoeke, verniet gebou.",
      },
    },

    /* ---------- 3 · the reason, not the picture ---------- */
    {
      type: "choice",
      prompt: {
        en: "So specifically — what makes OP = OA (and OP = OB), forcing both triangles to be isosceles?",
        af: "Spesifiek dan — wat maak OP = OA (en OP = OB), wat albei driehoeke gelykbenig maak?",
      },
      diagram: FIG_CONSTRUCT_BARE,
      options: [
        { text: { en: "OP, OA and OB are all radii of the same circle", af: "OP, OA en OB is almal radiusse van dieselfde sirkel" }, correct: true },
        { text: { en: "PA = PB because they look about the same length", af: "PA = PB omdat hulle omtrent dieselfde lengte lyk" } },
        { text: { en: "∠OPA = ∠OAP because vertically opposite angles are equal", af: "∠OPA = ∠OAP omdat regoorstaande hoeke gelyk is" } },
        { text: { en: "OQ is a diameter, so OP must equal PQ", af: "OQ is 'n middellyn, dus moet OP gelyk wees aan PQ" } },
      ],
      hints: [
        { en: "Ignore how anything LOOKS on screen — a proof needs a reason that is true everywhere, not just in this one drawing. What do you know for certain about O, P, A and B, no matter where they sit on the circle?",
          af: "Ignoreer hoe enigiets op die skerm LYK — 'n bewys benodig 'n rede wat orals waar is, nie net in hierdie een tekening nie. Wat weet jy vir seker van O, P, A en B, ongeag waar hulle op die sirkel sit?" },
        { en: "O is the centre, and P, A, B are all on the circle — so OP, OA and OB are all radii, and every radius of a circle is the same length. That is the reason, not the picture.",
          af: "O is die middelpunt, en P, A, B is almal op die sirkel — dus is OP, OA en OB almal radiusse, en elke radius van 'n sirkel is dieselfde lengte. Dit is die rede, nie die prentjie nie." },
      ],
      reason: "radii",
      note: {
        en: "OP, OA and OB are radii of the same circle — always equal, by definition, no measuring required. That is what makes triangle OPA isosceles (OP = OA, so the angles opposite them are equal) and triangle OPB isosceles the same way.",
        af: "OP, OA en OB is radiusse van dieselfde sirkel — altyd gelyk, per definisie, geen meting nodig nie. Dit is wat driehoek OPA gelykbenig maak (OP = OA, dus is die hoeke daarteenoor gelyk) en driehoek OPB net so.",
      },
    },

    /* ---------- 4 · label x, y — what the exterior angle hands you ---------- */
    {
      type: "choice",
      prompt: {
        en: "Label the two base angles: ∠OPA = ∠OAP = x (triangle OPA is isosceles), and ∠OPB = ∠OBP = y (triangle OPB is isosceles too, off-screen for now) — x is marked on the figure. O, P and Q lie on a straight line, so the angle at O between OA and OQ is the EXTERIOR angle of triangle OPA. What does the exterior angle theorem say it equals?",
        af: "Merk die twee basishoeke: ∠OPA = ∠OAP = x (driehoek OPA is gelykbenig), en ∠OPB = ∠OBP = y (driehoek OPB is ook gelykbenig, nog nie op die prentjie nie) — x is op die figuur gemerk. O, P en Q lê op 'n reguit lyn, dus is die hoek by O tussen OA en OQ die BUITEHOEK van driehoek OPA. Wat sê die buitehoekstelling van 'n driehoek dit gelyk is aan?",
      },
      diagram: FIG_XY,
      options: [
        { text: { en: "x + x = 2x", af: "x + x = 2x" }, correct: true },
        { text: { en: "x", af: "x" } },
        { text: { en: "180° − x", af: "180° − x" } },
        { text: { en: "90° − x", af: "90° − x" } },
      ],
      hints: [
        { en: "The exterior angle of a triangle equals the SUM of the two interior angles that are not next to it — not just one of them. In triangle OPA, which two angles are 'not next to' the exterior angle at O?",
          af: "Die buitehoek van 'n driehoek is gelyk aan die SOM van die twee binnehoeke wat nie daarnaas lê nie — nie net een van hulle nie. In driehoek OPA, watter twee hoeke lê 'nie langs' die buitehoek by O nie?" },
        { en: "The two remote angles are ∠OPA and ∠OAP — and both equal x, because the triangle is isosceles. So the exterior angle = x + x = 2x.",
          af: "Die twee ver hoeke is ∠OPA en ∠OAP — en albei is gelyk aan x, omdat die driehoek gelykbenig is. Dus is die buitehoek = x + x = 2x." },
      ],
      reason: "triExt",
      note: {
        en: "The exterior angle of a triangle equals the sum of the two interior angles that aren't next to it. For triangle OPA those are ∠OPA and ∠OAP — both x, because the triangle is isosceles — so the exterior angle at O is x + x = 2x. The exact same reasoning on triangle OPB gives an exterior angle of 2y there.",
        af: "Die buitehoek van 'n driehoek is gelyk aan die som van die twee binnehoeke wat nie daarnaas lê nie. Vir driehoek OPA is dit ∠OPA en ∠OAP — albei x, omdat die driehoek gelykbenig is — dus is die buitehoek by O gelyk aan x + x = 2x. Presies dieselfde redenasie op driehoek OPB gee 'n buitehoek van 2y daar.",
      },
    },

    /* ---------- 5 · combine ---------- */
    {
      type: "choice",
      prompt: {
        en: "So ∠AOQ = 2x and ∠BOQ = 2y (same reasoning on the other triangle) — both marked now. O sits on segment PQ, between the two, so ∠AOQ and ∠BOQ together make up the whole angle ∠AOB. What is ∠AOB?",
        af: "So ∠AOQ = 2x en ∠BOQ = 2y (dieselfde redenasie op die ander driehoek) — albei nou gemerk. O sit op lyn PQ, tussen die twee, dus maak ∠AOQ en ∠BOQ saam die hele hoek ∠AOB. Wat is ∠AOB?",
      },
      diagram: FIG_COMBINE,
      options: [
        { text: { en: "∠AOB = 2x + 2y = 2(x + y)", af: "∠AOB = 2x + 2y = 2(x + y)" }, correct: true },
        { text: { en: "∠AOB = 2x − 2y = 2(x − y)", af: "∠AOB = 2x − 2y = 2(x − y)" } },
        { text: { en: "∠AOB = x + y, the same as ∠APB", af: "∠AOB = x + y, dieselfde as ∠APB" } },
        { text: { en: "∠AOB = 4xy, from multiplying instead of adding", af: "∠AOB = 4xy, deur te vermenigvuldig in plaas van bymekaar te tel" } },
      ],
      hints: [
        { en: "You already have both pieces marked on the figure. What does \"together they make up the whole angle\" mean you should do with them?",
          af: "Jy het reeds albei stukke op die figuur gemerk. Wat beteken \"saam maak hulle die hele hoek\" jy met hulle moet doen?" },
        { en: "Add them: ∠AOB = ∠AOQ + ∠BOQ = 2x + 2y.",
          af: "Tel hulle bymekaar: ∠AOB = ∠AOQ + ∠BOQ = 2x + 2y." },
      ],
      reason: "centreDouble",
      note: {
        en: "∠AOB = ∠AOQ + ∠BOQ = 2x + 2y = 2(x + y). And ∠APB = ∠OPA + ∠OPB = x + y — the SAME bracket. So ∠AOB = 2 × ∠APB. That is the whole proof: draw the diameter, get two isosceles triangles, double each with the exterior angle theorem, and add.",
        af: "∠AOB = ∠AOQ + ∠BOQ = 2x + 2y = 2(x + y). En ∠APB = ∠OPA + ∠OPB = x + y — dieselfde hakie. Dus ∠AOB = 2 × ∠APB. Dit is die hele bewys: trek die middellyn, kry twee gelykbenige driehoeke, verdubbel elkeen met die buitehoekstelling, en tel bymekaar.",
      },
    },

    /* ---------- 6 · the recap — the sentence to carry forward ---------- */
    {
      type: "note",
      prompt: { en: "The sentence to carry forward", af: "Die sin om saam te dra" },
      diagram: FIG_FINAL,
      note: {
        en: "<b>Draw the diameter through the circumference point, then let the exterior angles add up.</b><br><br>Every time you see an angle at the centre and an angle at the circumference on the same arc, this is the move: extend the radius to the circumference point straight through the centre, mark the two isosceles triangles it makes, double each base angle with the exterior angle theorem, and add. Next: the exact same five steps, on two trickier pictures — a reflex angle, and two circumference points sharing one arc.",
        af: "<b>Trek die middellyn deur die omtrekpunt, en laat die buitehoeke dan optel.</b><br><br>Elke keer wanneer jy 'n hoek by die middelpunt en 'n hoek by die omtrek op dieselfde boog sien, is dit die stap: verleng die radius na die omtrekpunt reguit deur die middelpunt, merk die twee gelykbenige driehoeke wat dit maak, verdubbel elke basishoek met die buitehoekstelling, en tel bymekaar. Volgende: presies dieselfde vyf stappe, op twee moeiliker prentjies — 'n inspringende hoek, en twee omtrekpunte wat een boog deel.",
      },
    },

  ],
};
