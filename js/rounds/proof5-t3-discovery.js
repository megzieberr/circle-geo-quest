/* Proof rounds P5 — "T3 discovery: opposite angles of a cyclic quad"
   (PROOF-ROUNDS-PLAN.md, session 4 — the T3 arc.)
   ------------------------------------------------------------------------
   T3 is "opposite angles of a cyclic quadrilateral are supplementary"
   (∠A + ∠C = 180°). Her source notes' recipe: join the radii OB and OD —
   the two vertices NOT in the angle pair (A, C) — then run the angle-at-
   -the-centre theorem (T2, now PROVEN in pr3/pr4) TWICE on the SAME
   central angle ∠BOD: once for ∠A (via the reflex sweep), once for ∠C
   (via the non-reflex sweep). The two central angles complete a full turn
   around O, 360°, so 2∠A + 2∠C = 360° and ∠A + ∠C = 180°. This round
   teaches THAT construction. P6 (proof6-t3-transfer.js) carries it to a
   relabelled, rotated picture — and springs the classic wrong-radii trap
   (joining OA and OC instead, which reaches nothing).

   SIX PANELS, all taps, rendered through renderInvestigate() exactly like
   pr0-pr4 — `kind: "proof"` gets predict/choice/note panels and per-panel
   XP for free, no new engine surface:
     1 · predict — bare cyclic quad + the claim (∠A + ∠C = 180°, angles
         marked but UNLABELLED — general claim, nothing spoiled). "What do
         you THINK could prove this?"
     2 · choice  — the construction has appeared: OB, OD joined (radii,
         tick-marked). WHY these two, specifically — not OA and OC?
         (∠A's legs run to D and B; ∠C's legs run to B and D — BD is the
         chord both angles look at, so OB/OD build the central angle
         standing on that exact chord.)
     3 · choice  — ∠C is labelled c. The angle-at-centre theorem, applied
         to ∠C: what does it hand you for the (achievable, non-reflex)
         ∠BOD? (2c.)
     4 · choice  — ∠A is labelled a too. OB and OD split the whole turn
         around O into exactly two pieces — the non-reflex ∠BOD you just
         found, and the REST of the way around (reflex ∠BOD, standing on
         the same arc as ∠A, so = 2a by the same theorem). What do the two
         pieces add up to? (360° — a full turn around a point.)
     5 · choice  — combine: 2c + 2a = 360°, so a + c = 180°.
     6 · note    — the recap sentence: "join the two radii to the vertices
         NOT in the angle pair, then let the angle-at-centre theorem run
         twice and add." Genuinely the last panel of this round.

   Every diagram stays SYMBOLIC throughout (labels a, c, 2c — never a
   literal degree number), matching pr3's own no-spoilers convention for a
   discovery round; the actual numbers only ever live in `o.v` for the
   engine/checker, never in learner-facing text. P6 (transfer) is where
   the construction lands on a concrete number, same split of duties as
   pr3 (symbolic) vs pr4 (numeric).

   GEOMETRY — reused, not invented. Session brief: "search js/rounds/ for
   the cyclic-quad discovery/learning rounds ... import exact verified
   coordinates." A:160, B:80, C:350, D:240 are round07-cyclic-opposite.js's
   OWN exact degrees (its `quad(160, 80, 350, 240, …)` calls, q1/q2/q5-q10)
   — already checker-verified there as ∠A=100°, ∠C=80°, ∠B=95°, ∠D=85°,
   carried over verbatim rather than re-derived.

   Every angle mark below is an EXACT integer — either round07's own
   already-verified value, or the centre-vertex angle, which for THIS
   engine is always exact plain-degree subtraction (legDir() from O
   resolves to the point's own placement degree, same fact pr3/pr4's
   header comments lean on):
     ∠A (legs D,B) = 100°   ∠C (legs B,D) = 80°           [round07, reused]
     ∠B (legs A,C) =  95°   ∠D (legs C,A) = 85°           [round07, reused;
                                                             not used here]
     non-reflex ∠BOD = |80 − 240| → sweep(80→240) = 160°   (≤180, so this
       IS the non-reflex value directly — plain subtraction at O)
     reflex ∠BOD = 360 − 160 = 200°
     Check against T2: non-reflex ∠BOD (160°) = 2 × ∠C (80°) ✓
                        reflex ∠BOD (200°)     = 2 × ∠A (100°) ✓
     2∠C + 2∠A = 160° + 200° = 360°  ⇒  ∠C + ∠A = 180°   (matches round07's
       own 100° + 80° = 180°, now with the proof behind it)             */

const AC = "#9c36b5";

/* ---- panel 1: bare quad, before the construction ----
   Round07's exact quad, ∠A and ∠C marked but UNLABELLED (t: "") — the
   claim is general, nothing spoiled before the guess. */
const FIG_CLAIM = {
  O: true,
  pts: { A: 160, B: 80, C: 350, D: 240 },
  chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"]],
  angles: [
    { at: "A", legs: ["D", "B"], t: "", o: { v: 100 } },
    { at: "C", legs: ["B", "D"], t: "", o: { v: 80 } },
  ],
};

/* ---- panel 2: the construction has appeared — OB, OD joined, no angle
   marks yet (panel 2 is about WHY, before any angle gets a letter). ---- */
const FIG_CONSTRUCT_BARE = {
  O: true,
  pts: { A: 160, B: 80, C: 350, D: 240 },
  chords: [
    ["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"],
    { a: "O", b: "B", mk: "t1" },
    { a: "O", b: "D", mk: "t1" },
  ],
};

/* ---- panel 3: ∠C labelled c; the achievable (non-reflex) ∠BOD asked
   about, still unlabelled — that is what this panel is determining. ---- */
const FIG_CENTRAL_C = {
  O: true,
  pts: { A: 160, B: 80, C: 350, D: 240 },
  chords: [
    ["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"],
    { a: "O", b: "B", mk: "t1" },
    { a: "O", b: "D", mk: "t1" },
  ],
  angles: [
    { at: "C", legs: ["B", "D"], t: "c", o: { v: 80 } },
    { at: "O", legs: ["B", "D"], t: "", o: { v: 160 } },
  ],
};

/* ---- panel 4: ∠A labelled a too, non-reflex ∠BOD now labelled 2c ----
   (the reflex piece can never be drawn directly — the engine always draws
   the ≤180 sweep between two legs — so it stays a named idea, not an SVG
   arc, exactly like pr3/pr4's own reflex angles.) */
const FIG_CENTRAL_BOTH = {
  O: true,
  pts: { A: 160, B: 80, C: 350, D: 240 },
  chords: [
    ["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"],
    { a: "O", b: "B", mk: "t1" },
    { a: "O", b: "D", mk: "t1" },
  ],
  angles: [
    { at: "A", legs: ["D", "B"], t: "a", o: { v: 100 } },
    { at: "C", legs: ["B", "D"], t: "c", o: { v: 80 } },
    { at: "O", legs: ["B", "D"], t: "2c", o: { v: 160 } },
  ],
};

/* ---- panels 5-6: the recap figure — same marks, carried to the close ---- */
const FIG_FINAL = FIG_CENTRAL_BOTH;

export const round = {
  id: "pr5", n: 0, accent: AC, kind: "proof", group: "g7",
  title: { en: "T3 discovery: opposite angles of a cyclic quad", af: "T3-ontdekking: teenoorstaande hoeke van 'n koordevierhoek" },
  blurb: {
    en: "Prove opposite angles of a cyclic quad are supplementary — the angle-at-centre theorem, run twice.",
    af: "Bewys teenoorstaande hoeke van 'n koordevierhoek is supplementêr — die hoek-by-middelpunt-stelling, twee keer uitgevoer.",
  },
  panels: [

    /* ---------- 1 · the claim, and a guess ---------- */
    {
      type: "predict",
      prompt: {
        en: "Here is the picture: ABCD is a cyclic quadrilateral — all four vertices sit on the circle with centre O. ∠A and ∠C are OPPOSITE angles (marked, no numbers — this has to hold for every cyclic quad, not just one). The claim is that ∠A + ∠C always equals 180°. What do you THINK could prove that?",
        af: "Hier is die prentjie: ABCD is 'n koordevierhoek — al vier hoekpunte sit op die sirkel met middelpunt O. ∠A en ∠C is TEENOORSTAANDE hoeke (gemerk, geen getalle nie — dit moet vir elke koordevierhoek geld, nie net een nie). Die bewering is dat ∠A + ∠C altyd gelyk is aan 180°. Wat dink jy sou dit kon bewys?",
      },
      diagram: FIG_CLAIM,
      options: [
        { text: { en: "The angle-at-centre theorem", af: "Die hoek-by-middelpunt-stelling" }, correct: true },
        { text: { en: "Congruent triangles", af: "Kongruente driehoeke" } },
        { text: { en: "Isosceles triangles", af: "Gelykbenige driehoeke" } },
        { text: { en: "Pythagoras", af: "Pythagoras" } },
        { text: { en: "The tan-chord theorem", af: "Die raaklyn-koord-stelling" } },
      ],
      reactRight: {
        en: "Good instinct — the angle-at-centre theorem really is the key here, used TWICE. Let's build the construction and see exactly how.",
        af: "Goeie aanvoeling — die hoek-by-middelpunt-stelling is werklik die sleutel hier, twee keer gebruik. Kom ons bou die konstruksie en kyk presies hoe.",
      },
      reactWrong: {
        en: "Good guess — here's a hint: watch what happens the moment we join O to B and O to D.",
        af: "Goeie raaiskoot — hier's 'n wenk: kyk wat gebeur die oomblik wat ons O aan B en O aan D verbind.",
      },
      after: {
        en: "Two new radii are about to appear — from the centre to the two vertices NOT in the angle pair we care about. Nothing else changes yet.",
        af: "Twee nuwe radiusse gaan nou-nou verskyn — vanaf die middelpunt na die twee hoekpunte wat NIE in die hoekpaar is waaroor ons omgee nie. Niks anders verander nog nie.",
      },
    },

    /* ---------- 2 · the construction, and why B and D specifically ---------- */
    {
      type: "choice",
      prompt: {
        en: "The construction: OB and OD have been joined — two new radii, tick-marked equal to every radius of this circle. B and D are the two vertices NOT in the angle pair (A and C) whose sum we're chasing. Why is joining exactly these two the useful move — not OA and OC?",
        af: "Die konstruksie: OB en OD is verbind — twee nuwe radiusse, gemerk as gelyk aan elke radius van hierdie sirkel. B en D is die twee hoekpunte wat NIE in die hoekpaar (A en C) is waarvan ons die som soek nie. Hoekom is dit nuttig om presies hierdie twee te verbind — nie OA en OC nie?",
      },
      diagram: FIG_CONSTRUCT_BARE,
      options: [
        { text: { en: "BD is the chord both ∠A and ∠C look at — OB/OD build the central angle standing on it",
                  af: "BD is die koord waarna albei ∠A en ∠C kyk — OB/OD bou die middelpuntshoek wat daarop staan" }, correct: true },
        { text: { en: "It creates two isosceles triangles, OAB and OCD, from the two new radii",
                  af: "Dit skep twee gelykbenige driehoeke, OAB en OCD, uit die twee nuwe radiusse" } },
        { text: { en: "It makes AB parallel to CD, setting up alternate angles instead",
                  af: "Dit maak AB ewewydig aan CD, wat verwisselende hoeke opstel" } },
        { text: { en: "It automatically cuts ∠BOD exactly in half without any theorem",
                  af: "Dit sny ∠BOD outomaties presies in twee helftes, sonder enige stelling" } },
      ],
      hints: [
        { en: "Look at ∠A's legs (AD, AB) and ∠C's legs (CB, CD) — which two points do BOTH angles reach out to?",
          af: "Kyk na ∠A se bene (AD, AB) en ∠C se bene (CB, CD) — na watter twee punte reik BEIDE hoeke uit?" },
        { en: "Both ∠A and ∠C reach to B and to D — chord BD is the one thing they have in common. Joining OB and OD gives the centre a central angle standing on that exact chord.",
          af: "Beide ∠A en ∠C reik na B en na D — koord BD is die een ding wat hulle in gemeen het. Om OB en OD te verbind, gee die middelpunt 'n middelpuntshoek wat op daardie presiese koord staan." },
      ],
      reason: "construction",
      note: {
        en: "∠A's legs run to D and B; ∠C's legs run to B and D — the SAME two points, just reached from opposite corners of the quad. BD is the chord both angles are looking at. Joining OB and OD builds the central angle ∠BOD standing on that very chord — exactly what the angle-at-centre theorem needs, to link a central angle to both ∠A and ∠C.",
        af: "∠A se bene loop na D en B; ∠C se bene loop na B en D — dieselfde twee punte, net bereik vanaf teenoorstaande hoeke van die vierhoek. BD is die koord waarna albei hoeke kyk. Om OB en OD te verbind, bou die middelpuntshoek ∠BOD wat op daardie selfde koord staan — presies wat die hoek-by-middelpunt-stelling nodig het, om 'n middelpuntshoek aan albei ∠A en ∠C te koppel.",
      },
    },

    /* ---------- 3 · label c — what the theorem hands you for ∠C ---------- */
    {
      type: "choice",
      prompt: {
        en: "Label ∠C = c (marked). The angle-at-centre theorem says a central angle is double the circumference angle standing on the SAME arc. The non-reflex ∠BOD (marked, unlabelled) stands on the same arc as ∠C. What does the theorem give you for it?",
        af: "Merk ∠C = c (gemerk). Die hoek-by-middelpunt-stelling sê 'n middelpuntshoek is dubbel die omtrekhoek wat op DIESELFDE boog staan. Die nie-inspringende ∠BOD (gemerk, ongelabel) staan op dieselfde boog as ∠C. Wat gee die stelling jou daarvoor?",
      },
      diagram: FIG_CENTRAL_C,
      options: [
        { text: { en: "∠BOD (non-reflex) = 2c", af: "∠BOD (nie-inspringend) = 2c" }, correct: true },
        { text: { en: "∠BOD (non-reflex) = c", af: "∠BOD (nie-inspringend) = c" } },
        { text: { en: "∠BOD (non-reflex) = c + 90°", af: "∠BOD (nie-inspringend) = c + 90°" } },
        { text: { en: "∠BOD (non-reflex) = half of c", af: "∠BOD (nie-inspringend) = die helfte van c" } },
      ],
      hints: [
        { en: "This is the same theorem from the last two rounds — a central angle standing on the same arc as a circumference angle is not equal to it, and not a fraction of it.",
          af: "Dit is dieselfde stelling van die vorige twee rondtes — 'n middelpuntshoek wat op dieselfde boog as 'n omtrekhoek staan, is nie gelyk daaraan nie, en ook nie 'n breukdeel daarvan nie." },
        { en: "The angle at the centre is DOUBLE the angle at the circumference, on the same arc: ∠BOD (non-reflex) = 2 × c = 2c.",
          af: "Die hoek by die middelpunt is DUBBEL die hoek by die omtrek, op dieselfde boog: ∠BOD (nie-inspringend) = 2 × c = 2c." },
      ],
      reason: "centreDouble",
      note: {
        en: "Non-reflex ∠BOD stands on the same arc as ∠C, so the angle-at-centre theorem hands you ∠BOD (non-reflex) = 2c straight away — no new triangles needed, just the theorem you already proved, aimed at this picture.",
        af: "Nie-inspringende ∠BOD staan op dieselfde boog as ∠C, dus gee die hoek-by-middelpunt-stelling jou dadelik ∠BOD (nie-inspringend) = 2c — geen nuwe driehoeke nodig nie, net die stelling wat jy reeds bewys het, gerig op hierdie prentjie.",
      },
    },

    /* ---------- 4 · label a too — the full turn around O ---------- */
    {
      type: "choice",
      prompt: {
        en: "Label ∠A = a too. OB and OD are just two rays out of O — together they split the WHOLE turn around O into exactly two pieces: the non-reflex ∠BOD you just found (2c), and the rest of the way around — the reflex ∠BOD, which stands on the same arc as ∠A, so it equals 2a by that same theorem. What do the two pieces add up to, all the way around O?",
        af: "Merk ∠A = a ook. OB en OD is net twee strale uit O — saam verdeel hulle die HELE draai om O in presies twee stukke: die nie-inspringende ∠BOD wat jy pas gekry het (2c), en die res van die pad om — die inspringende ∠BOD, wat op dieselfde boog as ∠A staan, dus is dit 2a deur dieselfde stelling. Wat tel die twee stukke op tot, heeltemal om O?",
      },
      diagram: FIG_CENTRAL_BOTH,
      options: [
        { text: { en: "360° — the two pieces make a complete turn around O", af: "360° — die twee stukke maak 'n volledige draai om O" }, correct: true },
        { text: { en: "180° — the two pieces lie on a straight line", af: "180° — die twee stukke lê op 'n reguit lyn" } },
        { text: { en: "There's no way to tell without knowing a and c first", af: "Daar is geen manier om te weet sonder om eers a en c te ken nie" } },
        { text: { en: "0° — the two pieces cancel each other out", af: "0° — die twee stukke kanselleer mekaar uit" } },
      ],
      hints: [
        { en: "Two rays out of a single point always split the plane around that point into exactly two angles. If you swept all the way around, back to where you started, how far did you turn?",
          af: "Twee strale uit een enkele punt verdeel altyd die vlak om daardie punt in presies twee hoeke. As jy heeltemal om gaan, terug na waar jy begin het, hoe ver het jy gedraai?" },
        { en: "A full turn around any point is always 360°, no matter where the two rays point. Non-reflex ∠BOD + reflex ∠BOD = 360°, always — this doesn't even need a and c yet.",
          af: "'n Volledige draai om enige punt is altyd 360°, ongeag waarheen die twee strale wys. Nie-inspringende ∠BOD + inspringende ∠BOD = 360°, altyd — dit het nie eers a en c nog nodig nie." },
      ],
      reason: "roundPt",
      note: {
        en: "OB and OD are two rays out of O, and two rays always split the full turn around a point into exactly two angles that add to 360° — a fact that needs no measuring, no matter where B and D actually sit. Non-reflex ∠BOD + reflex ∠BOD = 360°, and by the SAME angle-at-centre theorem, reflex ∠BOD (standing on the same arc as ∠A) = 2a.",
        af: "OB en OD is twee strale uit O, en twee strale verdeel altyd die volledige draai om 'n punt in presies twee hoeke wat optel tot 360° — 'n feit wat geen meting benodig nie, ongeag waar B en D werklik sit. Nie-inspringende ∠BOD + inspringende ∠BOD = 360°, en deur DIESELFDE hoek-by-middelpunt-stelling, inspringende ∠BOD (wat op dieselfde boog as ∠A staan) = 2a.",
      },
    },

    /* ---------- 5 · combine ---------- */
    {
      type: "choice",
      prompt: {
        en: "So non-reflex ∠BOD + reflex ∠BOD = 360°, and you now know non-reflex ∠BOD = 2c and reflex ∠BOD = 2a. Substitute and simplify. What do you get?",
        af: "So nie-inspringende ∠BOD + inspringende ∠BOD = 360°, en jy weet nou nie-inspringende ∠BOD = 2c en inspringende ∠BOD = 2a. Vervang en vereenvoudig. Wat kry jy?",
      },
      diagram: FIG_FINAL,
      options: [
        { text: { en: "2c + 2a = 360°, so a + c = 180°", af: "2c + 2a = 360°, dus a + c = 180°" }, correct: true },
        { text: { en: "a + c = 360°, no dividing needed", af: "a + c = 360°, geen deling nodig nie" } },
        { text: { en: "a = c = 180°, both angles separately", af: "a = c = 180°, albei hoeke apart" } },
        { text: { en: "4ac = 360°, from multiplying instead of adding", af: "4ac = 360°, deur te vermenigvuldig in plaas van bymekaar te tel" } },
      ],
      hints: [
        { en: "You have both pieces marked, in terms of a and c. Substitute them into \"the two pieces add to 360°\" and see what falls out.",
          af: "Jy het albei stukke gemerk, in terme van a en c. Vervang hulle in \"die twee stukke tel op tot 360°\" en kyk wat uitval." },
        { en: "2c + 2a = 360°. Both sides share a common factor of 2 — divide both sides by 2, and you're left with a + c = 180°.",
          af: "2c + 2a = 360°. Albei kante deel 'n gemeenskaplike faktor van 2 — deel albei kante deur 2, en jy bly met a + c = 180°." },
      ],
      reason: "cyclicOpp",
      note: {
        en: "2c + 2a = 360° — divide both sides by 2, and a + c = 180°. That's the whole proof: join the radii to the two vertices NOT in the angle pair, run the angle-at-centre theorem twice on the SAME central angle, and add. Opposite angles of a cyclic quad are always supplementary.",
        af: "2c + 2a = 360° — deel albei kante deur 2, en a + c = 180°. Dit is die hele bewys: verbind die radiusse na die twee hoekpunte wat NIE in die hoekpaar is nie, laat die hoek-by-middelpunt-stelling twee keer op DIESELFDE middelpuntshoek loop, en tel bymekaar. Teenoorstaande hoeke van 'n koordevierhoek is altyd supplementêr.",
      },
    },

    /* ---------- 6 · the recap — the sentence to carry forward ---------- */
    {
      type: "note",
      prompt: { en: "The sentence to carry forward", af: "Die sin om saam te dra" },
      diagram: FIG_FINAL,
      note: {
        en: "<b>Join the two radii to the vertices NOT in the angle pair, then let the angle-at-centre theorem run twice and add.</b><br><br>OB and OD build ONE central angle that both ∠A and ∠C stand on from opposite sides — the non-reflex piece doubles ∠C, the reflex piece doubles ∠A, and the two pieces always complete a full turn, 360°. Halve it, and opposite angles of a cyclic quad are supplementary.<br><br>Next: the exact same move, a relabelled and rotated picture — and the classic trap of joining the WRONG two radii.",
        af: "<b>Verbind die twee radiusse na die hoekpunte wat NIE in die hoekpaar is nie, en laat die hoek-by-middelpunt-stelling dan twee keer loop en optel.</b><br><br>OB en OD bou EEN middelpuntshoek waarop beide ∠A en ∠C van teenoorstaande kante af staan — die nie-inspringende stuk verdubbel ∠C, die inspringende stuk verdubbel ∠A, en die twee stukke voltooi altyd 'n volledige draai, 360°. Halveer dit, en teenoorstaande hoeke van 'n koordevierhoek is supplementêr.<br><br>Volgende: presies dieselfde stap, 'n herlabelde en gedraaide prentjie — en die klassieke strik om die VERKEERDE twee radiusse te verbind.",
      },
    },

  ],
};
