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

   REVISED 2026-08-11 (FIX-ROUND-1.md, Megan's first-playtest fix round,
   items 4-12 — ALL scoped to this round unless noted):
     · item 4 — x and y now render in two different colours (label + arc),
       via the engine's existing per-angle `o.c` option (already there,
       no engine change needed for colour). X_COLOR is teal-green, Y_COLOR
       is orange — both already-proven-readable app accents (config.js
       ACCENTS), neither is the round's own purple.
     · item 5 — the picture moved: A:190, B:340, P:90 (Q stays P's exact
       antipode, 270), so the base angles at P are bigger and easier to
       read, and x ≠ y on purpose. Full derivation in the geometry note
       below — every mark re-verified against this file's own numbers.
     · item 6 — a NEW panel (now panel 4) earns the isosceles step before
       the exterior-angle jump: "OP = OA. Which OTHER angle must also
       equal x?" (∠OAP, reason "∠s opp equal sides" — REASONS.isosBase).
       JUDGMENT CALL: one page, not two mirrored pages — the y-twin fact
       goes in this page's own note ("the exact same reasoning at B gives
       y") rather than a second page, so the round grows by exactly one
       panel (six → seven) instead of two, matching the plan's original
       "T2 has one more stage than T1" sizing rather than ballooning it.
     · items 7-8 — the exterior-angle page (now panel 5) highlights
       triangle OPA + its exterior wedge (O₁) in X_COLOR; the combine page
       (now panel 6) highlights triangle OPB + its wedge (O₂) in Y_COLOR —
       each page pops in the colour of the NEW thing it introduces, so the
       two pages read as a visual pair the way the brief asked for.
     · item 9 — the 2x/2y labels on the combine page are pinned (r: 36)
       instead of drifting on the engine's default radius.
     · item 10 — NUMBERED ANGLE NAMES for the T2 arc (pr3 + pr4 only, per
       the brief's explicit scope — T3/T4 untouched this round). JUDGMENT
       CALL: the figure's own SVG labels stay "x"/"y"/"2x"/"2y" — items
       4-9 above name that text verbatim as required panel content (e.g.
       item 6's exact question ends "...must also equal x?"), so swapping
       the glyphs to P₁/P₂/O₁/O₂ would contradict them. P₁/P₂ (the base
       angles AT P: ∠OPA, ∠OPB) and O₁/O₂ (the two pieces AT O: ∠AOQ,
       ∠BOQ) are used instead as PROSE shorthand for those specific
       angles wherever the old text spelled out the three-letter name —
       every first use ties back to the figure ("O₁ — the angle between
       OA and OQ"), so the prose and the picture can never disagree even
       though the on-screen glyph is still x/y/2x/2y. ∠AOB and ∠APB (the
       WHOLE angles) are untouched, per the brief. Flagged for Megan: say
       the word if she pictured the SVG glyphs themselves renamed instead.
     · item 11 — chord A–B removed from every figure in this file (it was
       never used by the proof, and it visually fought the new highlights
       — PA, PB, OA, OB already carry the triangle shapes it was drawing).
     · item 12 — the tick on OQ is gone from every figure; OQ stays drawn
       (it is still half the diameter) but unticked, since the proof only
       ever needs OP = OA and OP = OB.

   SEVEN PANELS (was six), all taps, rendered through renderInvestigate()
   exactly like pr0-pr2 — `kind: "proof"` gets predict/choice/note panels
   and per-panel XP for free:
     1 · predict — bare figure + the claim (∠AOB = 2×∠APB, unlabelled arcs
         so nothing is spoiled). "What other geometry theorem do you THINK
         can prove that this claim is ALWAYS true?" Every option accepted;
         the construction is drawn on the NEXT panel regardless of guess.
     2 · choice  — the construction has appeared: P extended straight
         through O to a new point Q, OP/OQ/OA/OB tick-marked equal (OQ's
         own tick removed, item 12). Why is that the useful first move?
     3 · choice  — same figure. What SPECIFICALLY makes OPA and OPB
         isosceles? (They're all radii — the reason, not the picture.)
     4 · choice  — NEW (item 6). OP = OA is already on the figure; x is
         now labelled at P. Which OTHER angle must also equal x? (∠OAP,
         isosceles base angles.) Note carries the y-twin fact for B.
     5 · choice  — base angles x, y both marked at P; O, P, Q collinear,
         so O₁ (the angle between OA and OQ) is triangle OPA's exterior
         angle. What does the exterior angle theorem hand you? (2x.)
         Triangle OPA + O₁'s wedge highlighted in X_COLOR (items 7).
     6 · choice  — O₁ = 2x and O₂ = 2y, both marked. O sits between them
         on line PQ, so they add up to the whole ∠AOB. Combine. Triangle
         OPB + O₂'s wedge highlighted in Y_COLOR (item 8).
     7 · note    — the recap / takeaway sentence, meant to survive into
         every other T2 picture: "draw the diameter through the
         circumference point, then let the exterior angles add up."
         Genuinely the last panel of this round.

   GEOMETRY — re-derived for item 5's new picture (verified against this
   engine's own legDir(), which for an O-vertex angle resolves to plain
   degree subtraction between the two points' own placement degrees —
   the same fact every other proof round's header leans on):
     apex ∠AOP = sweep(90→190) = 100°        →  x = (180 − 100) / 2 = 40°
     apex ∠BOP = sweep(90→340, short way) = 360 − 250 = 110°
                                              →  y = (180 − 110) / 2 = 35°
     Sanity check (three arcs of the circle, P→A→(via Q)→B→P, sum to
     360°): apex∠AOP (100) + ∠AOB (150, below) + apex∠BOP (110) = 360° ✓
     ∠AOB = sweep(190→340) = 150°  (direct, ≤180 — no reflex needed here,
       unlike pr4's reflex picture)                    = 2(x + y) = 2×75 ✓
     ∠APB = x + y = 75°   (P sits on the major arc across from the minor
       150° arc AB, so the inscribed-angle relationship this round is
       PROVING gives the true value directly: half of 150° = 75°)
     O₁ = ∠AOQ = sweep(190→270) = 80° = 2x               ✓
     O₂ = ∠BOQ = sweep(340→270, short way) = 70° = 2y     ✓
   Every mark below is this exact integer, not a rounded estimate. */

const AC = "#9c36b5";
const X_COLOR = "#0ea271";   // teal-green — P₁ / x, and everything x-flavoured
const Y_COLOR = "#f76707";   // orange — P₂ / y, and everything y-flavoured

/* ---- panel 1: bare figure, before the construction ----
   O, A, B, P on the circle; the two angle-arms drawn (OA/OB/PA/PB), both
   angles marked but UNLABELLED (t: "") — the claim is general, not a
   specific number, so nothing is spoiled before the guess. No chord AB
   (item 11): OA, OB, PA, PB already carry the picture's shape. */
const FIG_CLAIM = {
  O: true,
  pts: { A: 190, B: 340, P: 90 },
  chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]],
  angles: [
    { at: "O", legs: ["A", "B"], t: "", o: { v: 150 } },
    { at: "P", legs: ["A", "B"], t: "", o: { v: 75 } },
  ],
};

/* ---- panels 2-3: the construction has appeared ----
   P extended straight through O to Q (P's antipode); OP, OA, OB
   tick-marked equal (every radius, no measuring needed) — OQ is drawn but
   UNTICKED (item 12: the proof only ever leans on OP = OA and OP = OB).
   No angle marks yet: panels 2-3 are about WHY the construction works,
   before any angle gets a name. No chord AB (item 11). */
const FIG_CONSTRUCT_BARE = {
  O: true,
  pts: { A: 190, B: 340, P: 90, Q: 270 },
  chords: [
    { a: "O", b: "P", mk: "t1" },
    { a: "O", b: "Q" },
    { a: "O", b: "A", mk: "t1" },
    { a: "O", b: "B", mk: "t1" },
    ["P", "A"], ["P", "B"],
  ],
};

/* ---- panel 4 (NEW, item 6): the isosceles step, earned before the jump
   to the exterior angle. Only x is labelled — the isosceles fact at B is
   the twin this page's own NOTE states, not a second marked angle here,
   per the one-page judgment call in the header. ---- */
const FIG_ISOSCELES = {
  O: true,
  pts: { A: 190, B: 340, P: 90, Q: 270 },
  chords: [
    { a: "O", b: "P", mk: "t1" },
    { a: "O", b: "Q" },
    { a: "O", b: "A", mk: "t1" },
    { a: "O", b: "B", mk: "t1" },
    ["P", "A"], ["P", "B"],
  ],
  angles: [
    { at: "P", legs: ["O", "A"], t: "x", o: { v: 40, r: 40, c: X_COLOR } },
  ],
};

/* ---- panel 5: base angles x, y labelled at P; the mystery angle at O ----
   Same construction, plus the two isosceles base angles (x, y — now both
   PROVEN facts from panel 4, not fresh claims) and ONE unlabelled arc at O
   (O₁ = ∠AOQ) — the exterior angle this panel determines. Triangle OPA's
   three sides (PO, PA, OA) and O₁'s wedge are highlighted in X_COLOR
   (items 7): this is "the x page" of the pair items 7-8 asked for. */
const FIG_XY = {
  O: true,
  pts: { A: 190, B: 340, P: 90, Q: 270 },
  chords: [
    { a: "O", b: "P", mk: "t1", hl: X_COLOR },
    { a: "O", b: "Q" },
    { a: "O", b: "A", mk: "t1", hl: X_COLOR },
    { a: "O", b: "B", mk: "t1" },
    { a: "P", b: "A", hl: X_COLOR }, { a: "P", b: "B" },
  ],
  angles: [
    { at: "P", legs: ["O", "A"], t: "x", o: { v: 40, r: 40, c: X_COLOR } },
    { at: "P", legs: ["O", "B"], t: "y", o: { v: 35, r: 40, c: Y_COLOR } },
    /* her ask mid-playtest: the isosceles twin ∠OAP = x is VISIBLE, so the
       exterior wedge visibly collects x + x. Exact by isosceles (v 40). */
    { at: "A", legs: ["O", "P"], t: "x", o: { v: 40, c: X_COLOR } },
    { at: "O", legs: ["A", "Q"], t: "O₁", o: { v: 80, r: 36, c: X_COLOR, hl: X_COLOR } },
  ],
};

/* ---- panel 6: both doubled angles at O now labelled — combine. Triangle
   OPB's three sides (PO, PB, OB) and O₂'s wedge are highlighted in
   Y_COLOR (item 8): "the y page" of the pair — O₂ is the new thing this
   page introduces, the same way O₁ was new on the last one. The 2x/2y
   labels are pinned (r: 36, item 9) instead of drifting. ---- */
const FIG_COMBINE = {
  O: true,
  pts: { A: 190, B: 340, P: 90, Q: 270 },
  chords: [
    { a: "O", b: "P", mk: "t1", hl: Y_COLOR },
    { a: "O", b: "Q" },
    { a: "O", b: "A", mk: "t1" },
    { a: "O", b: "B", mk: "t1", hl: Y_COLOR },
    { a: "P", b: "A" }, { a: "P", b: "B", hl: Y_COLOR },
  ],
  angles: [
    { at: "P", legs: ["O", "A"], t: "x", o: { v: 40, r: 40, c: X_COLOR } },
    { at: "P", legs: ["O", "B"], t: "y", o: { v: 35, r: 40, c: Y_COLOR } },
    /* both isosceles twins visible (her ask): x at A feeds O₁, y at B
       feeds O₂ — the picture shows where each doubled piece comes from. */
    { at: "A", legs: ["O", "P"], t: "x", o: { v: 40, c: X_COLOR } },
    { at: "B", legs: ["O", "P"], t: "y", o: { v: 35, c: Y_COLOR } },
    { at: "O", legs: ["A", "Q"], t: "O₁ = 2x", o: { v: 80, r: 36, c: X_COLOR } },
    { at: "O", legs: ["B", "Q"], t: "O₂ = 2y", o: { v: 70, r: 36, c: Y_COLOR, hl: Y_COLOR } },
  ],
};

/* ---- panel 7: recap — the clean result, sub-angles collapsed away ---- */
const FIG_FINAL = {
  O: true,
  pts: { A: 190, B: 340, P: 90, Q: 270 },
  chords: [
    { a: "O", b: "P", mk: "t1" },
    { a: "O", b: "Q" },
    { a: "O", b: "A", mk: "t1" },
    { a: "O", b: "B", mk: "t1" },
    ["P", "A"], ["P", "B"],
  ],
  angles: [
    { at: "O", legs: ["A", "B"], t: "2(x+y)", o: { v: 150 } },
    { at: "P", legs: ["A", "B"], t: "x+y", o: { v: 75 } },
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
        en: "Here is the picture: O is the centre, A and B are on the circle, and P is another point on the circle. Chord AB makes ∠AOB at the centre and ∠APB at the circumference — both stand on the same arc AB. The claim is that ∠AOB is always DOUBLE ∠APB. What other geometry theorem do you THINK can prove that this claim is ALWAYS true?",
        af: "Hier is die prentjie: O is die middelpunt, A en B is op die sirkel, en P is nog 'n punt op die sirkel. Koord AB maak ∠AOB by die middelpunt en ∠APB by die omtrek — albei staan op dieselfde boog AB. Die bewering is dat ∠AOB altyd DUBBEL ∠APB is. Watter ander meetkundestelling dink jy kan bewys dat hierdie bewering ALTYD waar is?",
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
        en: "The construction: P has been extended straight through the centre O to a new point, Q, on the far side of the circle — OP, OA and OB are all radii, tick-marked equal (OQ is drawn too, the rest of that same diameter). Why is drawing this diameter through P the useful first move?",
        af: "Die konstruksie: P is reguit deur die middelpunt O verleng na 'n nuwe punt, Q, aan die verste kant van die sirkel — OP, OA en OB is almal radiusse, gemerk as gelyk (OQ is ook geteken, die res van dieselfde middellyn). Hoekom is dit die nuttige eerste stap om hierdie middellyn deur P te trek?",
      },
      diagram: FIG_CONSTRUCT_BARE,
      options: [
        { text: { en: "It creates two isosceles triangles, OPA and OPB", af: "Dit skep twee gelykbenige driehoeke, OPA en OPB" }, correct: true },
        { text: { en: "It creates two congruent triangles, OPA and OPB", af: "Dit skep twee kongruente driehoeke, OPA en OPB" } },
        { text: { en: "It makes PA parallel to OB", af: "Dit maak PA ewewydig aan OB" } },
        { text: { en: "It automatically cuts ∠APB exactly in half", af: "Dit sny ∠APB outomaties presies in twee helftes" } },
      ],
      hints: [
        { en: "Look at what's tick-marked equal on the diagram: OP, OA, OB — every one of them is a radius. What kind of triangle has two equal sides?",
          af: "Kyk na wat op die diagram as gelyk gemerk is: OP, OA, OB — elkeen daarvan is 'n radius. Watter soort driehoek het twee gelyke sye?" },
        { en: "OP = OA (both radii) makes triangle OPA isosceles; OP = OB makes OPB isosceles too. Two isosceles triangles, for free, just from drawing a diameter.",
          af: "OP = OA (albei radiusse) maak driehoek OPA gelykbenig; OP = OB maak OPB ook gelykbenig. Twee gelykbenige driehoeke, verniet, net deur 'n middellyn te trek." },
      ],
      reason: "construction",
      note: {
        en: "OP, OA and OB are all radii of the same circle, so they're automatically equal — no measuring needed. That single fact makes triangle OPA isosceles (OP = OA) and triangle OPB isosceles (OP = OB). Two isosceles triangles, built for free.",
        af: "OP, OA en OB is almal radiusse van dieselfde sirkel, dus is hulle outomaties gelyk — geen meting nodig nie. Daardie een feit maak driehoek OPA gelykbenig (OP = OA) en driehoek OPB ook gelykbenig (OP = OB). Twee gelykbenige driehoeke, verniet gebou.",
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

    /* ---------- 4 · NEW (item 6): the isosceles step, earned ---------- */
    {
      type: "choice",
      prompt: {
        en: "OP = OA (both radii) — so triangle OPA is isosceles, and its base angle at P is marked x. Which OTHER angle in that triangle must also equal x?",
        af: "OP = OA (albei radiusse) — dus is driehoek OPA gelykbenig, en sy basishoek by P is gemerk x. Watter ANDER hoek in daardie driehoek moet ook gelyk wees aan x?",
      },
      diagram: FIG_ISOSCELES,
      options: [
        { text: { en: "∠OAP", af: "∠OAP" }, correct: true },
        { text: { en: "∠AOP", af: "∠AOP" } },
        { text: { en: "∠OPB", af: "∠OPB" } },
        { text: { en: "∠OBP", af: "∠OBP" } },
      ],
      hints: [
        { en: "An isosceles triangle's two BASE angles — the ones opposite its two equal sides — are always equal. OP and OA are the equal sides here; which two angles sit opposite them?",
          af: "'n Gelykbenige driehoek se twee BASISHOEKE — dié teenoor sy twee gelyke sye — is altyd gelyk. OP en OA is hier die gelyke sye; watter twee hoeke sit teenoor hulle?" },
        { en: "OA sits opposite ∠OPA (= x, marked); OP sits opposite ∠OAP. So ∠OAP = x too.",
          af: "OA sit teenoor ∠OPA (= x, gemerk); OP sit teenoor ∠OAP. Dus is ∠OAP ook = x." },
      ],
      reason: "isosBase",
      note: {
        en: "OP = OA makes triangle OPA isosceles, so its base angles are equal: ∠OPA = ∠OAP = x. (The exact same reasoning at B gives the twin fact: OP = OB makes triangle OPB isosceles too, so ∠OPB = ∠OBP = y.) Both are now proven facts, not just labels — the next panel puts them to work.",
        af: "OP = OA maak driehoek OPA gelykbenig, dus is sy basishoeke gelyk: ∠OPA = ∠OAP = x. (Presies dieselfde redenasie by B gee die tweelingfeit: OP = OB maak driehoek OPB ook gelykbenig, dus ∠OPB = ∠OBP = y.) Albei is nou bewese feite, nie net etikette nie — die volgende paneel gebruik hulle.",
      },
    },

    /* ---------- 5 · label x, y — what the exterior angle hands you ---------- */
    {
      type: "choice",
      prompt: {
        en: "Both base angles are marked at P now: ∠OPA = x and ∠OPB = y (the twin fact from last panel). O, P and Q lie on a straight line, so O₁ — the angle between OA and OQ, highlighted — is the EXTERIOR angle of triangle OPA (also highlighted). What does the exterior angle theorem say O₁ equals?",
        af: "Albei basishoeke is nou by P gemerk: ∠OPA = x en ∠OPB = y (die tweelingfeit van die vorige paneel). O, P en Q lê op 'n reguit lyn, dus is O₁ — die hoek tussen OA en OQ, uitgelig — die BUITEHOEK van driehoek OPA (ook uitgelig). Wat sê die buitehoekstelling is O₁ gelyk aan?",
      },
      diagram: FIG_XY,
      options: [
        { text: { en: "O₁ = x + x = 2x", af: "O₁ = x + x = 2x" }, correct: true },
        { text: { en: "O₁ = x", af: "O₁ = x" } },
        { text: { en: "O₁ = 180° − x", af: "O₁ = 180° − x" } },
        { text: { en: "O₁ = 90° − x", af: "O₁ = 90° − x" } },
      ],
      hints: [
        { en: "The exterior angle of a triangle equals the SUM of its two remote interior angles — the two NOT next to it. In triangle OPA, ∠OPA (= x, at P) is one of them. What's the other?",
          af: "Die buitehoek van 'n driehoek is gelyk aan die SOM van sy twee ver binnehoeke — dié twee wat nie daarnaas lê nie. In driehoek OPA is ∠OPA (= x, by P) een daarvan. Wat is die ander?" },
        { en: "The other remote angle is ∠OAP, which you proved equals x too on the last panel. So O₁ = x + x = 2x.",
          af: "Die ander ver hoek is ∠OAP, wat jy op die vorige paneel ook al bewys het gelyk is aan x. Dus O₁ = x + x = 2x." },
      ],
      reason: "triExt",
      note: {
        en: "The exterior angle of a triangle equals the sum of its two remote interior angles. For triangle OPA those are ∠OPA and ∠OAP — both x, proven on the last panel — so O₁ = x + x = 2x. The exact same reasoning on triangle OPB gives O₂ = 2y.",
        af: "Die buitehoek van 'n driehoek is gelyk aan die som van sy twee ver binnehoeke. Vir driehoek OPA is dit ∠OPA en ∠OAP — albei x, bewys op die vorige paneel — dus O₁ = x + x = 2x. Presies dieselfde redenasie op driehoek OPB gee O₂ = 2y.",
      },
    },

    /* ---------- 6 · combine ---------- */
    {
      type: "choice",
      prompt: {
        en: "So O₁ = 2x and O₂ = 2y (same reasoning on triangle OPB, highlighted now) — both marked. O sits on segment PQ, between the two, so O₁ and O₂ together make up the whole angle ∠AOB. What is ∠AOB?",
        af: "So O₁ = 2x en O₂ = 2y (dieselfde redenasie op driehoek OPB, nou uitgelig) — albei gemerk. O sit op lyn PQ, tussen die twee, dus maak O₁ en O₂ saam die hele hoek ∠AOB. Wat is ∠AOB?",
      },
      diagram: FIG_COMBINE,
      options: [
        { text: { en: "∠AOB = O₁ + O₂ = 2x + 2y = 2(x + y)", af: "∠AOB = O₁ + O₂ = 2x + 2y = 2(x + y)" }, correct: true },
        { text: { en: "∠AOB = O₁ − O₂ = 2x − 2y = 2(x − y)", af: "∠AOB = O₁ − O₂ = 2x − 2y = 2(x − y)" } },
        { text: { en: "∠AOB = x + y, the same as ∠APB", af: "∠AOB = x + y, dieselfde as ∠APB" } },
        { text: { en: "∠AOB = 4xy, from multiplying instead of adding", af: "∠AOB = 4xy, deur te vermenigvuldig in plaas van bymekaar te tel" } },
      ],
      hints: [
        { en: "You already have O₁ and O₂ marked on the figure. What does \"together they make up the whole angle\" mean you should do with them?",
          af: "Jy het reeds O₁ en O₂ op die figuur gemerk. Wat beteken \"saam maak hulle die hele hoek\" jy met hulle moet doen?" },
        { en: "Add them: ∠AOB = O₁ + O₂ = 2x + 2y.",
          af: "Tel hulle bymekaar: ∠AOB = O₁ + O₂ = 2x + 2y." },
      ],
      reason: "centreDouble",
      note: {
        en: "∠AOB = O₁ + O₂ = 2x + 2y = 2(x + y). And ∠APB = ∠OPA + ∠OPB = x + y — the SAME bracket. So ∠AOB = 2 × ∠APB. That is the whole proof: draw the diameter, get two isosceles triangles, double each with the exterior angle theorem, and add.",
        af: "∠AOB = O₁ + O₂ = 2x + 2y = 2(x + y). En ∠APB = ∠OPA + ∠OPB = x + y — dieselfde hakie. Dus ∠AOB = 2 × ∠APB. Dit is die hele bewys: trek die middellyn, kry twee gelykbenige driehoeke, verdubbel elkeen met die buitehoekstelling, en tel bymekaar.",
      },
    },

    /* ---------- 7 · the recap — the sentence to carry forward ---------- */
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
