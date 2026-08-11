/* Proof rounds P5 — "T3 discovery: opposite angles of a cyclic quad"
   (PROOF-ROUNDS-PLAN.md, session 4 — the T3 arc.)
   ------------------------------------------------------------------------
   T3 is "opposite angles of a cyclic quadrilateral are supplementary"
   (∠A + ∠C = 180°). This round teaches it via her hand sketch's ONE-
   VARIABLE method (FIX-ROUND-2.md item 3, 2026-08-11 rebuild — replaces
   the earlier two-letter a/c version entirely): join the radii OB and OD
   — the two vertices NOT in the angle pair (A, C) — then run the angle-
   at-centre theorem TWICE on the SAME central angle ∠BOD, but only ever
   naming ONE letter, x, at ∠C. ∠A is never given its own letter; it falls
   straight out of the second theorem application as "180° − x".

   REVISED 2026-08-11 night (FIX-ROUND-2.md item 3 + 3-addendum — the
   overnight foreman rebuild, session B): full replacement of the old
   panels 3-5 (which marked BOTH ∠C = c and ∠A = a, then combined
   2c + 2a = 360°). Her cheat-note page 7 never introduces a second
   letter — the chain runs:
     1 · mark x at ∠C only (green).
     2 · theorem once: O₁ = 2x (pink), the non-reflex ∠BOD.
     3 · BEFORE any second letter exists — what is O₂, the REFLEX ∠BOD?
         → 360° − 2x, by ∠s round a point (orange), drawn with the new
         engine reflex mark (FIX-ROUND-2.md item 2), labelled on the
         diagram.
     4 · theorem AGAIN, this time on O₂: the opposite angle (∠A, still
         unnamed as its own letter) = O₂ ÷ 2 = (360° − 2x) ÷ 2 = 180° − x
         (purple).
     5 · combine: x + (180° − x) = 180° — the x's cancel, true for every
         x. Then her page 7's own closing line (3-addendum): the SECOND
         pair falls out just as fast — B̂ + D̂ = 180° too, because the
         four angles of any quadrilateral sum to 360° (int ∠s of quad),
         and Â + Ĉ already spent 180° of that total.
   Panel map: predict (1) and the why-OB/OD panel (2) STAY untouched, per
   the brief ("she scratched that note herself" — panel 2's contrast with
   the un-joined-BD question is the point). The old panels 3-5 collapse
   into THIS five-step chain, spread across three panels (3 = steps 1-2,
   4 = step 3, 5 = steps 4-5 + the addendum closer). Six panels total,
   same length as before.

   ONE COLOUR FAMILY PER ANGLE (her rule, item 3), reusing already-proven-
   readable app accents from config.js's ACCENTS array — the same array
   pr3's X_COLOR/Y_COLOR draw from — so nothing new needs contrast-
   checking against the parchment background:
     GREEN  #0ea271  — x, the one and only letter (∠C). Same value as
                        pr3/pr4's own X_COLOR, reused because it already
                        reads as "the first thing you mark" across the app.
     PINK   #e64980  — O₁ (= 2x), the non-reflex ∠BOD.
     ORANGE #f76707  — O₂ (= 360° − 2x), the reflex ∠BOD. Same value as
                        pr3/pr4's Y_COLOR (still "the second angle" role).
     PURPLE #9c36b5  — ∠A (= 180° − x), the opposite angle the whole
                        chain was aimed at. Same hex as this file's own
                        round accent (AC) — no clash, AC only ever paints
                        the round's map icon, never a diagram element.
   Same family = same colour on label AND arc throughout; pr6 (transfer)
   reuses these exact hexes for its own O₁/O₂/∠P marks (FIX-ROUND-2.md
   item 3b), so the two rounds read as one continuous story.

   GEOMETRY — reused, not invented. Round07-cyclic-opposite.js's OWN exact
   degrees: A:160, B:80, C:350, D:240 — already checker-verified there as
   ∠A=100°, ∠C=80°, ∠B=95°, ∠D=85°, carried over verbatim. Starting vertex
   for x is ∠C (per the brief's own instruction: "on the current
   A:160/B:80/C:350/D:240 quad that means starting at ∠C = x" — this is
   the vertex where the FIRST, non-reflex theorem application lands
   cleanly, without needing to pre-swap which sweep is "reflex"):
     x = ∠C (legs B, D) = 80°                              [round07, reused]
     non-reflex ∠BOD = sweep(B=80 → D=240) = 160°  (≤180°, so this is the
       DIRECT plain-degree-subtraction value at O — legDir() resolves an
       O-vertex angle to exactly this, the same fact every proof round's
       header leans on)
     O₁ = non-reflex ∠BOD = 160° = 2 × x (2 × 80°) ✓        — step 2
     O₂ = reflex ∠BOD = 360° − 160° = 200° = 360° − 2x       — step 3
        check: O₂ should also equal 2 × ∠A. ∠A (legs D, B) = 100°
        [round07, reused] → 2 × 100° = 200° ✓
     ∠A = O₂ ÷ 2 = 200° ÷ 2 = 100° = 180° − x = 180° − 80° = 100° ✓ — step 4
     x + ∠A = 80° + 100° = 180° ✓                            — step 5
   Every mark is this exact integer, matching round07's own already-
   verified values — nothing here is a rounded estimate, and nothing was
   re-derived from scratch; the SAME quad, the SAME four angles, just a
   different proof telling the same story with one letter instead of two.
   (∠B and ∠D are not used in this round — pr6 carries the construction to
   a second pair on a rotated picture, and pr8/pr9's own material covers
   the general "sum of a quad's four angles" fact this round's closing
   line leans on.)

   Every diagram stays SYMBOLIC throughout — labels x, O₁, O₂, and
   (recap only) "180−x", never a literal degree number for the thing
   being proven. No "°" symbol on the algebraic labels either (matching
   pr3's own "2(x+y)"/"x+y" recap glyphs, which are bare coefficients —
   "180" here is a structural constant, a half-turn, the same category as
   pr3's "2", not a spoiler of this instance's actual angle value); the
   one literal-degree label in the whole round is "180−x" — the constant
   is structural, the letter is still the only unknown.

   LABEL PLACEMENT — headless-checked (renderDiagram/computeGeometry into
   a fixed 340px container, per the brief), not eyeballed. Two genuine
   geometric coincidences repeat from the OLD two-letter version and had
   to be re-solved for the new (longer) label text:
     · O₁'s bisector (from O, toward B/D's shared arc) lands EXACTLY on
       A's own placement degree (both are 160°) — same collision the old
       file's own comment already flagged for the "a"/"O₁" pair. o.r: 26
       pulls O₁'s recap-panel label in far enough to clear "180−x" at A
       (panels 3-4, where ∠A isn't labelled yet, keep the old o.r: 34 —
       there's nothing at A to collide with there).
     · ∠A's own bisector, symmetrically, points almost exactly BACK along
       the same O–A line (bis ≈ −20°, i.e. 160° + 180°) — so its label and
       O₁'s are forced onto one collinear ray no matter what radius either
       one gets; o.r: 22 for ∠A (recap panel only) was chosen by sweeping
       both radii and keeping the pair that cleared the OLD shipped "a"/
       "O₁" collision distance (dx 18.8, dy 10.9 achieved here vs 18.8/6.8
       on the version Megan already approved — strictly no tighter on
       either axis).
     · O₂'s reflex bisector (≈30° swept the long way from B round to D)
       sits close to x's own label at C; o.r: 55 (panels 4-5) / a touch
       more headroom wasn't needed once O₁'s "= 2x" suffix was dropped
       from the on-diagram text (see below) — 55 clears it with room. */

const AC = "#9c36b5";
const GREEN = "#0ea271";    // x — same value as pr3/pr4's X_COLOR
const PINK = "#e64980";     // O₁ — new to this round, config.js ACCENTS[0]
const ORANGE = "#f76707";   // O₂ — same value as pr3/pr4's Y_COLOR
const PURPLE = "#9c36b5";   // ∠A — same value as this round's own accent

/* ---- shared construction chords: quad + radii OB/OD (ticked) + chord BD ---- */
const CHORDS = [
  ["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"],
  { a: "O", b: "B", mk: "t1" },
  { a: "O", b: "D", mk: "t1" },
];

/* ---- panel 1: bare quad, before the construction ----
   Round07's exact quad, ∠A and ∠C marked but UNLABELLED (t: "") — the
   claim is general, nothing spoiled before the guess. No family colours
   yet either — nothing has been named. */
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
   marks yet (panel 2 is about WHY, before any angle gets a letter).
   UNTOUCHED, per the brief: chord BD is drawn too (its own correct option
   and note both name "BD is the chord both angles look at"), plain, no
   tick or mark — explanatory, nothing proven about its length yet. ---- */
const FIG_CONSTRUCT_BARE = {
  O: true,
  pts: { A: 160, B: 80, C: 350, D: 240 },
  chords: [
    ["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"],
    { a: "O", b: "B", mk: "t1" },
    { a: "O", b: "D", mk: "t1" },
    { a: "B", b: "D" },
  ],
};

/* ---- panel 3: mark x at ∠C (green); theorem once gives O₁ (pink),
   the non-reflex ∠BOD — the ONLY letter this proof ever introduces. ---- */
const FIG_MARK_X = {
  O: true,
  pts: { A: 160, B: 80, C: 350, D: 240 },
  chords: CHORDS,
  angles: [
    { at: "C", legs: ["B", "D"], t: "x", o: { v: 80, c: GREEN } },
    { at: "O", legs: ["B", "D"], t: "O₁", o: { v: 160, r: 34, c: PINK } },
  ],
};

/* ---- panel 4: BEFORE any second letter — O₂, the reflex ∠BOD, drawn
   with the new engine reflex mark (FIX-ROUND-2.md item 2). x and O₁ carry
   forward from panel 3, still in terms of x alone. ---- */
const FIG_O2 = {
  O: true,
  pts: { A: 160, B: 80, C: 350, D: 240 },
  chords: CHORDS,
  angles: [
    { at: "C", legs: ["B", "D"], t: "x", o: { v: 80, c: GREEN } },
    { at: "O", legs: ["B", "D"], t: "O₁", o: { v: 160, r: 34, c: PINK } },
    { at: "O", legs: ["B", "D"], t: "O₂", o: { v: 200, reflex: 1, r: 55, c: ORANGE } },
  ],
};

/* ---- panel 5: theorem again on O₂ — ∠A is marked (unlabelled: this
   panel is what DETERMINES its value) but the reflex O₂ that feeds it is
   already established. ---- */
const FIG_COMBINE = {
  O: true,
  pts: { A: 160, B: 80, C: 350, D: 240 },
  chords: CHORDS,
  angles: [
    { at: "C", legs: ["B", "D"], t: "x", o: { v: 80, c: GREEN } },
    { at: "O", legs: ["B", "D"], t: "O₁", o: { v: 160, r: 34, c: PINK } },
    { at: "O", legs: ["B", "D"], t: "O₂", o: { v: 200, reflex: 1, r: 55, c: ORANGE } },
    { at: "A", legs: ["D", "B"], t: "", o: { v: 100, c: PURPLE } },
  ],
};

/* ---- panel 6: the recap figure — ∠A now labelled "180−x" (purple),
   the completed chain, all four marks visible at once. o.r overrides on
   O₁ (26) and ∠A (22) are the headless-checked pair that clears the
   O–A collinearity — see the header's LABEL PLACEMENT note. ---- */
const FIG_FINAL = {
  O: true,
  pts: { A: 160, B: 80, C: 350, D: 240 },
  chords: CHORDS,
  angles: [
    { at: "C", legs: ["B", "D"], t: "x", o: { v: 80, c: GREEN } },
    { at: "O", legs: ["B", "D"], t: "O₁", o: { v: 160, r: 26, c: PINK } },
    { at: "O", legs: ["B", "D"], t: "O₂", o: { v: 200, reflex: 1, r: 55, c: ORANGE } },
    { at: "A", legs: ["D", "B"], t: "180−x", o: { v: 100, r: 22, c: PURPLE } },
  ],
};

export const round = {
  id: "pr5", n: 0, accent: AC, kind: "proof", group: "g7",
  title: { en: "T3 discovery: opposite angles of a cyclic quad", af: "T3-ontdekking: teenoorstaande hoeke van 'n koordevierhoek" },
  blurb: {
    en: "Prove opposite angles of a cyclic quad are supplementary — one letter, the angle-at-centre theorem run twice.",
    af: "Bewys teenoorstaande hoeke van 'n koordevierhoek is supplementêr — een letter, die hoek-by-middelpunt-stelling twee keer uitgevoer.",
  },
  panels: [

    /* ---------- 1 · the claim, and a guess ---------- */
    {
      type: "predict",
      prompt: {
        en: "Here is the picture: ABCD is a cyclic quadrilateral — all four vertices sit on the circle with centre O. ∠A and ∠C are OPPOSITE angles (marked, no numbers — this has to hold for every cyclic quad, not just one). The claim is that ∠A + ∠C always equals 180°. What other geometry theorem do you THINK can prove that this claim is ALWAYS true?",
        af: "Hier is die prentjie: ABCD is 'n koordevierhoek — al vier hoekpunte sit op die sirkel met middelpunt O. ∠A en ∠C is TEENOORSTAANDE hoeke (gemerk, geen getalle nie — dit moet vir elke koordevierhoek geld, nie net een nie). Die bewering is dat ∠A + ∠C altyd gelyk is aan 180°. Watter ander meetkundestelling dink jy kan bewys dat hierdie bewering ALTYD waar is?",
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

    /* ---------- 3 · mark x, theorem once → O₁ = 2x ---------- */
    {
      type: "choice",
      prompt: {
        en: "Label ∠C = x (green, marked) — the only letter this proof will ever need. The angle-at-centre theorem says a central angle is double the circumference angle standing on the SAME arc. O₁ — the non-reflex ∠BOD (marked, pink) — stands on that same arc as x. What does the theorem give you for O₁?",
        af: "Merk ∠C = x (groen, gemerk) — die enigste letter wat hierdie bewys ooit gaan nodig hê. Die hoek-by-middelpunt-stelling sê 'n middelpuntshoek is dubbel die omtrekhoek wat op DIESELFDE boog staan. O₁ — die nie-inspringende ∠BOD (gemerk, pienk) — staan op dieselfde boog as x. Wat gee die stelling jou vir O₁?",
      },
      diagram: FIG_MARK_X,
      options: [
        { text: { en: "O₁ = 2x", af: "O₁ = 2x" }, correct: true },
        { text: { en: "O₁ = x", af: "O₁ = x" } },
        { text: { en: "O₁ = x + 90°", af: "O₁ = x + 90°" } },
        { text: { en: "O₁ = half of x", af: "O₁ = die helfte van x" } },
      ],
      hints: [
        { en: "This is the same theorem from the last two rounds — a central angle standing on the same arc as a circumference angle is not equal to it, and not a fraction of it.",
          af: "Dit is dieselfde stelling van die vorige twee rondtes — 'n middelpuntshoek wat op dieselfde boog as 'n omtrekhoek staan, is nie gelyk daaraan nie, en ook nie 'n breukdeel daarvan nie." },
        { en: "The angle at the centre is DOUBLE the angle at the circumference, on the same arc: O₁ = 2 × x = 2x.",
          af: "Die hoek by die middelpunt is DUBBEL die hoek by die omtrek, op dieselfde boog: O₁ = 2 × x = 2x." },
      ],
      reason: "centreDouble",
      note: {
        en: "O₁ stands on the same arc as x, so the angle-at-centre theorem hands you O₁ = 2x straight away — one letter, one theorem, nothing else needed yet.",
        af: "O₁ staan op dieselfde boog as x, dus gee die hoek-by-middelpunt-stelling jou dadelik O₁ = 2x — een letter, een stelling, niks anders nog nodig nie.",
      },
    },

    /* ---------- 4 · before any second letter — what is O₂? ---------- */
    {
      type: "choice",
      prompt: {
        en: "OB and OD are just two rays out of O — together they split the WHOLE turn around O into exactly two pieces: O₁ (pink, = 2x, just found), and the rest of the way around — O₂ (orange), the REFLEX ∠BOD, drawn the long way round. Before ∠A even gets a letter of its own, what is O₂ — purely in terms of x?",
        af: "OB en OD is net twee strale uit O — saam verdeel hulle die HELE draai om O in presies twee stukke: O₁ (pienk, = 2x, pas gekry), en die res van die pad om — O₂ (oranje), die inspringende ∠BOD, die lang pad om geteken. Voordat ∠A eers 'n eie letter kry, wat is O₂ — suiwer in terme van x?",
      },
      diagram: FIG_O2,
      options: [
        { text: { en: "O₂ = 360° − 2x", af: "O₂ = 360° − 2x" }, correct: true },
        { text: { en: "O₂ = 2x, the same as O₁", af: "O₂ = 2x, dieselfde as O₁" } },
        { text: { en: "O₂ = 180° − 2x", af: "O₂ = 180° − 2x" } },
        { text: { en: "There's no way to tell without giving ∠A its own letter first", af: "Daar is geen manier om te weet sonder om ∠A eers sy eie letter te gee nie" } },
      ],
      hints: [
        { en: "Two rays out of a single point always split the plane around that point into exactly two angles that add to 360° — a fact that needs no new letter, no matter what O₁ turned out to be.",
          af: "Twee strale uit een enkele punt verdeel altyd die vlak om daardie punt in presies twee hoeke wat optel tot 360° — 'n feit wat geen nuwe letter benodig nie, ongeag wat O₁ uitgekom het." },
        { en: "O₁ + O₂ = 360°, always. Rearrange for O₂: O₂ = 360° − O₁ = 360° − 2x.",
          af: "O₁ + O₂ = 360°, altyd. Herrangskik vir O₂: O₂ = 360° − O₁ = 360° − 2x." },
      ],
      reason: "roundPt",
      note: {
        en: "O₁ + O₂ = 360° — two rays out of O always split a full turn into exactly two pieces, no matter where B and D actually sit. Rearranged: O₂ = 360° − 2x. Still just one letter, x — ∠A hasn't been named yet, and it doesn't need to be.",
        af: "O₁ + O₂ = 360° — twee strale uit O verdeel altyd 'n volledige draai in presies twee stukke, ongeag waar B en D werklik sit. Herrangskik: O₂ = 360° − 2x. Steeds net een letter, x — ∠A het nog nie 'n naam gekry nie, en dit hoef ook nie.",
      },
    },

    /* ---------- 5 · theorem again on O₂, combine, and her closing line ---------- */
    {
      type: "choice",
      prompt: {
        en: "Run the SAME theorem again — but this time on O₂. O₂ (orange) stands on the same arc as ∠A, the angle we still haven't named. What does the theorem hand you for ∠A, and what do x and ∠A add up to?",
        af: "Laat dieselfde stelling weer loop — maar hierdie keer op O₂. O₂ (oranje) staan op dieselfde boog as ∠A, die hoek wat ons nog nie benoem het nie. Wat gee die stelling jou vir ∠A, en wat tel x en ∠A op tot?",
      },
      diagram: FIG_COMBINE,
      options: [
        { text: { en: "∠A = O₂ ÷ 2 = (360° − 2x) ÷ 2 = 180° − x, so x + ∠A = 180°",
                  af: "∠A = O₂ ÷ 2 = (360° − 2x) ÷ 2 = 180° − x, dus x + ∠A = 180°" }, correct: true },
        { text: { en: "∠A = O₂ = 360° − 2x, so x + ∠A = 360°",
                  af: "∠A = O₂ = 360° − 2x, dus x + ∠A = 360°" } },
        { text: { en: "∠A = 2 × O₂ = 720° − 4x",
                  af: "∠A = 2 × O₂ = 720° − 4x" } },
        { text: { en: "∠A can't be found without measuring it directly",
                  af: "∠A kan glad nie gevind word sonder om dit direk te meet nie" } },
      ],
      hints: [
        { en: "The angle-at-centre theorem works the same way every time: half the central angle gives you the circumference angle on the same arc. O₂ is the central angle here — halve it.",
          af: "Die hoek-by-middelpunt-stelling werk elke keer op dieselfde manier: die helfte van die middelpuntshoek gee jou die omtrekhoek op dieselfde boog. O₂ is hier die middelpuntshoek — halveer dit." },
        { en: "∠A = O₂ ÷ 2 = (360° − 2x) ÷ 2 = 180° − x. Add that to x: x + (180° − x) = 180°, for ANY x — the algebra cancels itself out.",
          af: "∠A = O₂ ÷ 2 = (360° − 2x) ÷ 2 = 180° − x. Tel dit by x: x + (180° − x) = 180°, vir ENIGE x — die algebra kanselleer homself uit." },
      ],
      reason: "cyclicOpp",
      note: {
        en: "The exact same theorem, run a second time — on O₂ instead of O₁ — hands you ∠A = (360° − 2x) ÷ 2 = 180° − x. Add it to x: x + (180° − x) = 180°, true for every x, because the x's cancel. That's the whole proof, one letter start to finish: mark x, double it once for O₁, get O₂ for free from a full turn, halve O₂ for ∠A, and watch it collapse to 180°. And the second pair falls out just as fast: B̂ + D̂ = 180° too — the four angles of any quadrilateral always add to 360° (int ∠s of quad), and Â + Ĉ already spent 180° of that total, so whatever's left for B̂ + D̂ is the other 180°.",
        af: "Presies dieselfde stelling, 'n tweede keer uitgevoer — op O₂ in plaas van O₁ — gee jou ∠A = (360° − 2x) ÷ 2 = 180° − x. Tel dit by x: x + (180° − x) = 180°, waar vir enige x, want die x's kanselleer. Dit is die hele bewys, een letter van begin tot einde: merk x, verdubbel dit een keer vir O₁, kry O₂ verniet uit 'n volledige draai, halveer O₂ vir ∠A, en kyk hoe dit ineenstort tot 180°. En die tweede paar val net so vinnig uit: B̂ + D̂ = 180° ook — die vier hoeke van enige vierhoek tel altyd op tot 360° (binnehoeke van 'n vierhoek), en Â + Ĉ het reeds 180° van daardie totaal spandeer, dus is wat oorbly vir B̂ + D̂ die ander 180°.",
      },
    },

    /* ---------- 6 · the recap — the sentence to carry forward ---------- */
    {
      type: "note",
      prompt: { en: "The sentence to carry forward", af: "Die sin om saam te dra" },
      diagram: FIG_FINAL,
      note: {
        en: "<b>Join the two radii to the vertices NOT in the angle pair, run the angle-at-centre theorem twice on the SAME central angle — and never name more than one letter.</b><br><br>x gives you O₁ = 2x for free. Two rays around a point give you O₂ = 360° − 2x for free, before ∠A ever needs its own name. The SAME theorem, run again on O₂, hands you ∠A = 180° − x directly — and x + ∠A = 180° falls out with no algebra left to do. The second pair, B̂ + D̂, spends the OTHER 180° of the quad's 360°, for free.<br><br>Next: the exact same move, a relabelled and rotated picture — and the classic trap of joining the WRONG two radii.",
        af: "<b>Verbind die twee radiusse na die hoekpunte wat NIE in die hoekpaar is nie, laat die hoek-by-middelpunt-stelling twee keer op DIESELFDE middelpuntshoek loop — en noem nooit meer as een letter nie.</b><br><br>x gee jou O₁ = 2x verniet. Twee strale om 'n punt gee jou O₂ = 360° − 2x verniet, nog voordat ∠A ooit sy eie naam nodig het. Dieselfde stelling, weer op O₂ uitgevoer, gee jou ∠A = 180° − x direk — en x + ∠A = 180° val uit sonder enige algebra oor. Die tweede paar, B̂ + D̂, spandeer die ANDER 180° van die vierhoek se 360°, verniet.<br><br>Volgende: presies dieselfde stap, 'n herlabelde en gedraaide prentjie — en die klassieke strik om die VERKEERDE twee radiusse te verbind.",
      },
    },

  ],
};
