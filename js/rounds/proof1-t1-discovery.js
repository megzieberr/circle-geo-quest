/* Proof rounds P1 — "T1 discovery: line from the centre & a chord"
   (PROOF-ROUNDS-PLAN.md, session 2 — the TEMPLATE arc other sessions copy.)
   ------------------------------------------------------------------------
   T1's three cheat-note variants (A: ⊥ ⇒ bisects · B: midpoint ⇒ ⊥ · C: the
   perpendicular bisector of a chord passes through the centre) all fall out
   of ONE construction: join the two radii to the chord's endpoints, then
   prove the two triangles it makes are congruent. This round teaches THAT
   construction, on variant A. P2 (proof2-t1-transfer.js) carries it across
   variants B and C in a new picture with new letters.

   FIVE PANELS, all taps, renders through js/investigate.js's renderInvestigate()
   exactly like pr0 — `kind: "proof"` gets predict/choice/note panels and
   per-panel XP for free, no new engine surface:
     1 · predict — bare figure + the claim (AM = MB). "What do you THINK
         could prove this?" Every option accepted; the construction is drawn
         on the NEXT panel regardless of the guess (plan's guided-discovery
         rule — a wrong guess never reads as "wrong").
     2 · choice  — the construction has appeared (OA, OB joined, tick-marked
         equal as radii). Which congruency test applies? RHS.
     3 · choice  — which side do the two triangles share? OM — small, and
         the step learners skip (per the plan).
     4 · choice  — what does the congruency actually hand you? AM = MB, with
         three TRUE-but-input distractors (OA = OB, OM = OM, the right
         angle) — things that were already true before the triangles were
         built, not new facts the congruency produced. Same move as
         invest04-prove-it.js's "true but unused" distractor.
     5 · note    — the recap / takeaway sentence, the one line meant to
         survive into every other picture: "construct two radii, then prove
         the triangles congruent." Genuinely the last panel of this round.

   GEOMETRY — reused, not invented (PROOF-ROUNDS-PLAN.md build brief, session
   2 instructions: "the T1 geometry already exists in this repo — reuse it").
   O at the engine default (cx 160, cy 120, R 80). A:205, B:335 are the EXACT
   degrees discover-line-centre.js's CASE_PERP/MODEL and reason-line-centre.js's
   D_PERP/D_MID already use for "line from the centre to a chord" — carried
   over verbatim rather than re-derived. M is the coordinate MIDPOINT of AB
   (via `mid:`), which is also, as a plain fact of geometry, the foot of the
   perpendicular from O — so marking the angle O-M-B as exactly 90° is true
   for ANY two points on this circle, not a number that happens to work for
   205/335. That is also why FIG_CONSTRUCT below is safe to build on: OA and
   OB are ordinary radii (equal by definition, no coordinate luck needed),
   and the 90° mark at M is the same honest fact carried over from FIG_CLAIM. */

const AC = "#9c36b5";

/* ---- panel 1: bare figure, before the construction ----
   O, chord AB, and the line OM already drawn ⊥ to it at M (that right angle
   IS the given — variant A of the cheat notes). Identical coordinates and
   shape to discover-line-centre.js's CASE_PERP / reason-line-centre.js's
   D_PERP: O:true, A:205, B:335, mid M, chord AB + OM, 90° marked at M. */
const FIG_CLAIM = {
  O: true,
  pts: { A: 205, B: 335 },
  mid: [{ name: "M", of: ["A", "B"] }],
  chords: [["A", "B"], { a: "O", b: "M" }],
  angles: [{ at: "M", legs: ["O", "B"], t: "", o: { v: 90, mark: 1 } }],
};

/* ---- panels 2-4: the construction has appeared ----
   Same figure, plus the two radii OA and OB, tick-marked equal (they are
   radii — always equal, needs no measuring). This is the ONE new figure the
   whole panel run reuses, so the learner reads the picture once. */
const FIG_CONSTRUCT = {
  O: true,
  pts: { A: 205, B: 335 },
  mid: [{ name: "M", of: ["A", "B"] }],
  chords: [
    ["A", "B"],
    { a: "O", b: "M" },
    { a: "O", b: "A", mk: "t1" },
    { a: "O", b: "B", mk: "t1" },
  ],
  angles: [{ at: "M", legs: ["O", "B"], t: "", o: { v: 90, mark: 1 } }],
};

export const round = {
  id: "pr1", n: 0, accent: AC, kind: "proof", group: "g7",
  title: { en: "T1 discovery: line from the centre", af: "T1-ontdekking: lyn vanaf die middelpunt" },
  blurb: {
    en: "Prove a line from the centre bisects a chord — by building two congruent triangles.",
    af: "Bewys 'n lyn vanaf die middelpunt halveer 'n koord — deur twee kongruente driehoeke te bou.",
  },
  panels: [

    /* ---------- 1 · the claim, and a guess ---------- */
    {
      type: "predict",
      prompt: {
        en: "Here is the picture: O is the centre, AB is a chord, and OM ⊥ AB at M — that right angle is given. The claim is that this forces AM = MB, the line cuts the chord into two equal pieces. What do you THINK could prove that?",
        af: "Hier is die prentjie: O is die middelpunt, AB is 'n koord, en OM ⊥ AB by M — daardie regte hoek is gegee. Die bewering is dat dit AM = MB dwing, die lyn sny die koord in twee gelyke stukke. Wat dink jy sou dit kon bewys?",
      },
      diagram: FIG_CLAIM,
      options: [
        { text: { en: "Congruent triangles", af: "Kongruente driehoeke" }, correct: true },
        { text: { en: "The angle at the centre is double the angle at the circumference",
                  af: "Die hoek by die middelpunt is dubbel die hoek by die omtrek" } },
        { text: { en: "Isosceles triangles", af: "Gelykbenige driehoeke" } },
        { text: { en: "Pythagoras", af: "Pythagoras" } },
        { text: { en: "The tan-chord theorem", af: "Die raaklyn-koord-stelling" } },
      ],
      reactRight: {
        en: "Good instinct — congruent triangles really is the tool here. Let's build them and see exactly how.",
        af: "Goeie aanvoeling — kongruente driehoeke is werklik die hulpmiddel hier. Kom ons bou hulle en kyk presies hoe.",
      },
      reactWrong: {
        en: "Good guess — here's a hint: watch what happens the moment we join O to A and O to B.",
        af: "Goeie raaiskoot — hier's 'n wenk: kyk wat gebeur die oomblik wat ons O aan A en O aan B verbind.",
      },
      after: {
        en: "Two more lines are about to appear on this exact picture. Nothing else changes.",
        af: "Twee meer lyne gaan nou-nou op hierdie presiese prentjie verskyn. Niks anders verander nie.",
      },
    },

    /* ---------- 2 · the construction, and RHS ---------- */
    {
      type: "choice",
      prompt: {
        en: "The construction: two radii have appeared, OA and OB, tick-marked equal — every radius is the same length, no measuring needed. Look at the right angle already marked at M. Which test proves triangles OMA and OMB congruent?",
        af: "Die konstruksie: twee radiusse het verskyn, OA en OB, gemerk as gelyk — elke radius is dieselfde lengte, geen meting nodig nie. Kyk na die regte hoek wat reeds by M gemerk is. Watter toets bewys driehoeke OMA en OMB kongruent?",
      },
      diagram: FIG_CONSTRUCT,
      options: [
        { text: { en: "RHS (right angle, hypotenuse, side)", af: "RHS (regte hoek, skuinssy, sy)" }, correct: true },
        { text: { en: "SAS (side, angle, side)", af: "SHS (sy, hoek, sy)" } },
        { text: { en: "SSS (side, side, side)", af: "SSS (sy, sy, sy)" } },
        { text: { en: "AAS (angle, angle, side)", af: "HHS (hoek, hoek, sy)" } },
      ],
      hints: [
        { en: "Count what is actually marked on the diagram: one right angle in each triangle, and one pair of sides you know are equal because they're both radii.",
          af: "Tel wat werklik op die diagram gemerk is: een regte hoek in elke driehoek, en een paar sye wat jy weet gelyk is omdat hulle albei radiusse is." },
        { en: "OA and OB sit opposite the right angles — they are the hypotenuses, and they're marked equal. Right angle, Hypotenuse, Side: RHS.",
          af: "OA en OB sit teenoor die regte hoeke — hulle is die skuinssye, en hulle is gemerk as gelyk. Regte hoek, Skuinssy, Sy: RHS." },
      ],
      reason: "rhs",
      note: {
        en: "The right angle at M is marked in both triangles, and OA = OB because both are radii — that is the hypotenuse, matched. Two pieces of RHS down, with one more still to spot.",
        af: "Die regte hoek by M is in albei driehoeke gemerk, en OA = OB omdat albei radiusse is — dit is die skuinssy, opgestel. Twee stukke van RHS klaar, met nog een om raak te sien.",
      },
    },

    /* ---------- 3 · the shared side — small, and easy to skip ---------- */
    {
      type: "choice",
      prompt: {
        en: "Which side do the two triangles actually share?",
        af: "Watter sy deel die twee driehoeke werklik?",
      },
      diagram: FIG_CONSTRUCT,
      options: [
        { text: { en: "OM", af: "OM" }, correct: true },
        { text: { en: "AB", af: "AB" } },
        { text: { en: "OA", af: "OA" } },
        { text: { en: "MB", af: "MB" } },
      ],
      hints: [
        { en: "A shared side belongs to BOTH triangles at once. Trace triangle OMA with your finger, then trace OMB. Which segment did you draw twice?",
          af: "'n Gedeelde sy behoort aan BEIDE driehoeke gelyktydig. Trek driehoek OMA met jou vinger, trek dan OMB. Watter segment het jy twee keer getrek?" },
        { en: "OM — the line from the centre itself. Triangle OMA uses it, and so does triangle OMB.",
          af: "OM — die lyn vanaf die middelpunt self. Driehoek OMA gebruik dit, en so ook driehoek OMB." },
      ],
      reason: "commonSide",
      note: {
        en: "OM belongs to both triangles — the same segment, walked twice, once from each side. Right angle, hypotenuse, and now a shared side: RHS is complete.",
        af: "OM behoort aan albei driehoeke — dieselfde segment, twee keer geloop, een keer van elke kant af. Regte hoek, skuinssy, en nou 'n gedeelde sy: RHS is volledig.",
      },
    },

    /* ---------- 4 · what the congruency actually hands you ---------- */
    {
      type: "choice",
      prompt: {
        en: "So what does the congruency actually hand you — the one genuinely NEW fact you did not already have?",
        af: "Wat gee die kongruensie jou dan werklik — die een egte NUWE feit wat jy nie reeds gehad het nie?",
      },
      diagram: FIG_CONSTRUCT,
      options: [
        { text: { en: "AM = MB", af: "AM = MB" }, correct: true },
        { text: { en: "OA = OB", af: "OA = OB" } },
        { text: { en: "OM = OM", af: "OM = OM" } },
        { text: { en: "∠OMA = ∠OMB = 90°", af: "∠OMA = ∠OMB = 90°" } },
      ],
      hints: [
        { en: "Congruent triangles hand you EVERY matching pair, sides and angles. Which one of these four did you NOT already know before you built a single triangle?",
          af: "Kongruente driehoeke gee jou ELKE ooreenstemmende paar, sye en hoeke. Watter een van hierdie vier het jy NIE reeds geweet voordat jy 'n enkele driehoek gebou het nie?" },
        { en: "AM and MB are corresponding sides of the two triangles — the congruency finally tells you they're equal. Everything else in the list was already true before you drew a single radius.",
          af: "AM en MB is ooreenstemmende sye van die twee driehoeke — die kongruensie sê jou eindelik hulle is gelyk. Alles anders in die lys was reeds waar voordat jy 'n enkele radius geteken het." },
      ],
      reason: "congTri",
      note: {
        en: "AM = MB is the one genuinely new fact — the payoff. OA = OB was true the moment you drew a radius, OM = OM the moment you shared a side, and the right angle was given from the start. The congruent triangles are what turn all of that into AM = MB.",
        af: "AM = MB is die een werklik nuwe feit — die opbrengs. OA = OB was waar die oomblik toe jy 'n radius geteken het, OM = OM die oomblik toe jy 'n sy gedeel het, en die regte hoek was van die begin af gegee. Die kongruente driehoeke is wat dit alles in AM = MB omskep.",
      },
    },

    /* ---------- 5 · the recap — the sentence to carry forward ----------
       Genuinely the last panel of this round (P2 appends AFTER pr1 in the
       play order, never into it), so this is the one panel here allowed to
       read like a closing line — matching pr0's panel 5. */
    {
      type: "note",
      prompt: { en: "The sentence to carry forward", af: "Die sin om saam te dra" },
      diagram: FIG_CONSTRUCT,
      note: {
        en: "<b>Construct two radii, then prove the triangles congruent.</b><br><br>That one sentence is what you carry into the next picture — not the write-up, not the letters, just the move. Every time you see a line from a circle's centre meeting a chord, this is the first thing to reach for: join the centre to both ends of the chord, and let RHS do the rest.<br><br>Next: the exact same move, a rotated picture, and new letters — because the construction never cared what the points were called.",
        af: "<b>Konstrueer twee radiusse, bewys dan die driehoeke kongruent.</b><br><br>Daardie een sin is wat jy na die volgende prentjie toe saamdra — nie die uitskryfwerk nie, nie die letters nie, net die stap. Elke keer wanneer jy 'n lyn van 'n sirkel se middelpunt sien wat 'n koord ontmoet, is dit die eerste ding om na te gryp: verbind die middelpunt aan albei ente van die koord, en laat RHS die res doen.<br><br>Volgende: presies dieselfde stap, 'n gedraaide prentjie, en nuwe letters — want die konstruksie het nooit omgegee wat die punte genoem word nie.",
      },
    },

  ],
};
