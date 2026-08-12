/* Proof rounds P6 — "T3 transfer: the wrong-radii trap"
   (PROOF-ROUNDS-PLAN.md, session 4 — the T3 arc.)
   ------------------------------------------------------------------------
   pr5 (proof5-t3-discovery.js) built ONE construction: join the radii to
   the two vertices NOT in the angle pair (there, OB and OD for the pair
   A, C), then run the angle-at-centre theorem twice on the same central
   angle and add. This round carries that construction to a relabelled,
   rotated picture — new letters P, Q, R, S, new angle pair (P, R) — and
   springs the CENTREPIECE trap her cheat notes warn about: "Join OP and
   OR" (the vertices IN the angle pair) sits right there as the tempting
   move. It is shown ALREADY DRAWN, as an experience, before the panel
   names why it dies: those radii end AT P and R, so the theorem has no
   central angle standing on the same arc as ∠P or ∠R to reach for.

   SIX PANELS, all taps, same renderInvestigate() as pr0-pr5 — no new
   panel type, no typed answers:
     1 · choice — new picture, new letters, restated. "What's the first
         move?" Warms up the transfer before the trap in panel 2 (correct:
         join OQ and OS — the vertices NOT in the pair).
     2 · choice — THE TRAP, sprung and already drawn: a classmate joined
         OP and OR instead (shown, tick-marked, with the central angle
         they make). Legal construction, wrong angle — does it actually
         help? (No — named, not just asserted.)
     3 · choice — the correct construction, compressed to one panel (no
         multi-stage build-up — pr5 already taught the mechanism in full):
         OQ, OS drawn, ∠P = 60° given, the SAME theorem lands on ∠R = 120°,
         so ∠P + ∠R = 180°.
     4 · choice — error-spotting (invest04-prove-it.js's DNA, pr2/pr4
         panel 4's shape): a learner's solution reaches the right
         conclusion with ONE line's reason mismatched (the "angles round a
         point = 360°" step credited to the doubling theorem instead).
         `solution.lines[].st` is symbol-only throughout.
     5 · choice — the legal-constructions thread, continued from pr2/pr4
         with DIFFERENT specific moves (not a clone). Carries the
         catchphrase, VERBATIM ENGLISH in both language versions — used
         ONCE in this build for the T3 arc (pr5 has no legal panel).
     6 · note   — recap: same construction, new letters, the trap named
         and the "always 180°" result. Last panel of the round.

   REVISED 2026-08-11 (Megan's numbering follow-up, same convention as
   pr5): O₁ = the non-reflex ∠QOS (= 2∠P), O₂ = the reflex ∠QOS (= 2∠R),
   introduced together in panel 3's prompt (both pieces appear on that
   panel's figure at once, unlike pr5's two-panel build-up) and carried
   into panel 4's error-spot solution — `st` stays symbol-only there
   ("O₁ = 2∠P"), and the options quoting those lines verbatim were renamed
   the same way. THE TRAP PANEL (panel 2, ∠POR) is UNTOUCHED on purpose:
   it's a different construction on its own figure with only one marked
   central angle, so O₃ there would be noise, not clarity.

   REVISED AGAIN 2026-08-11 night (FIX-ROUND-2.md item 3b + the item 3
   wording echo — overnight foreman rebuild, session B, landed alongside
   pr5's one-variable rebuild): her before-bed sweep found O₂ — the
   reflex 240° piece, the star of this round's own 60→120→240→120 chain —
   was never actually drawn or labelled on FIG_CORRECT (the engine
   couldn't draw a reflex arc until FIX-ROUND-2.md item 2 landed earlier
   the same night), and the round was monochrome throughout. Fixed:
     · FIG_CORRECT now draws O₂ = 240° with the new engine reflex mark
       (o.reflex, item 2), labelled "O₂", in ORANGE (#f76707) — the exact
       same hex pr5 uses for ITS O₂/∠A derived pair. O₁ (120°) and the
       ∠P = 60° mark are both GREEN (#0ea271, pr5's x/O₁ doubling-pair
       colour) — same family, same colour, across both rounds, per her
       rule. FIG_CORRECT is reused verbatim by panels 3, 4 (error-spot)
       and 6 (recap), so the fix reaches all three without touching them.
     · o.r: 70 on O₂'s reflex mark (headless-checked, renderDiagram into
       a fixed 340px container) — the default label radius landed O₂'s
       text on top of ∠P's own "60°" label (both sit close together near
       P/Q's side of the circle); 70 clears it with room. O₁ keeps the
       engine's own default radius (46) — untouched, no collision there.
     · FIG_TRAP and FIG_CLAIM are deliberately UNTOUCHED: their angle
       marks are either unlabelled (no-spoilers, FIG_TRAP's ∠POR) or
       absent (FIG_CLAIM has no O-vertex angle at all yet) — item 3b is
       about the TEACHING figures, not the bare ones, per the brief.
     · Panel 3's prompt/note were re-worded to echo pr5's own one-x-chain
       language ("theorem once… before any second letter… theorem
       again…") — its concrete numbers (60 → 120 → 240 → 120) already
       WERE that chain; only the telling changed, not the maths. See
       panel 3 below.

   REVISED AGAIN 2026-08-12 (FIX-ROUND-3.md item 7, her morning playtest —
   both "60°" and O₂ had drifted far from their arcs on FIG_CORRECT; item
   6's overnight two-colour ruling also applies here, pr6 mirroring pr5 by
   standing rule). Browser-rendered (real getBBox(), not the estimate
   below) to confirm no collisions:
     · o.r pulled in from the night-before's collision-avoidance values to
       the tight "on the arc" treatment pr5's own O₁ uses: "60°" 44→28,
       O₁ (still the engine default, 46) →30, O₂ 70→32. All three sit
       5-7 SVG units outside their own drawn arc radius (25), same
       clearance pr5's on-arc labels use.
     · O₁'s PINK → GREEN, per item 6/7's two-family ruling: 60°/O₁ share
       GREEN (the doubling pair), O₂ keeps ORANGE (the derived pair,
       alongside pr5's ∠A). ∠R never gets its own on-diagram mark in this
       round (panel 3's prompt states its value in prose only), so there
       is nothing to recolour there — the "∠R in copy" half of the
       standing rule has no runtime effect, just a naming consistency.
     · Re-checked at the tighter radii with real DOM getBBox() (not the
       length-estimate formula used elsewhere in this repo's headless
       checks): zero pairwise overlaps among "60°"/O₁/O₂/P/Q/R/S at these
       three values, together with FIG_CORRECT's other unrelated point
       labels.

   GEOMETRY — new orientation, new letters (P, Q, R, S instead of pr5's
   A, B, C, D), per the plan's "relabelled and rotated" instruction, so the
   letters keep meaning what they meant last time rather than colliding.
   P:40, Q:150, R:210, S:270 — a different rotation and a different arc
   spacing to pr5's 160/80/350/240 (Q→R→S span 120° here vs pr5's B→C→D
   span; the picture genuinely looks different, not just relabelled).

   Every angle mark is an EXACT integer, same reasoning as pr5's header
   (O-vertex angles are plain degree subtraction; the other-vertex angles
   verified against the engine's own legDir()-based computation, same
   method used to confirm pr5's reused round07 values):
     ∠P (legs S,Q) = 60°     ∠R (legs Q,S) = 120°     [correct pair, sum 180°]
     ∠Q (legs P,R) = 95°     ∠S (legs R,P) = 85°      [not used in the proof]
     non-reflex ∠QOS = sweep(150→270) = 120° = 2 × ∠P (60°) ✓
     reflex ∠QOS = 360 − 120 = 240° = 2 × ∠R (120°) ✓
     2∠P + 2∠R = 120° + 240° = 360°  ⇒  ∠P + ∠R = 180°
     THE TRAP — non-reflex ∠POR = sweep(40→210) → 360−170=190, so the
       ≤180 value is 170°; reflex ∠POR = 360 − 170 = 190°. Neither number
       is useless by accident: 170° = 2 × ∠S (85°) and 190° = 2 × ∠Q (95°)
       — ∠POR is a perfectly good central angle, just for the OTHER pair
       (∠Q, ∠S). It hands you nothing about ∠P or ∠R, because P and R are
       literally the two points those radii end at — a circumference angle
       can never be paired with a central angle that terminates at its own
       vertex. (This richer aside — "it's actually the right move for the
       OTHER pair" — is not spelled out to the learner in the panel copy;
       the panel keeps to the plan's own explanation, "connects to
       nothing, no arc-pair subtends it", which is true FOR ∠P and ∠R.) */

const AC = "#9c36b5";
const GREEN = "#0ea271";    // doubling pair: 60°/∠P and O₁ — same value as pr5's x/O₁ colour
const ORANGE = "#f76707";   // derived pair: O₂ (and ∠R in copy) — same value as pr5's O₂/∠A colour

/* ---- panel 1 (+ reused on panels 5-ish bare use): bare quad, before
   any construction. ∠P and ∠R marked but UNLABELLED — nothing spoiled. ---- */
const FIG_CLAIM = {
  O: true,
  pts: { P: 40, Q: 150, R: 210, S: 270 },
  chords: [["P", "Q"], ["Q", "R"], ["R", "S"], ["S", "P"]],
  angles: [
    { at: "P", legs: ["S", "Q"], t: "", o: { v: 60 } },
    { at: "R", legs: ["Q", "S"], t: "", o: { v: 120 } },
  ],
};

/* ---- panel 2: THE TRAP, already drawn — OP, OR joined (ticked), and the
   central angle they make, marked but unlabelled (the panel's job is to
   say why it's useless, not to name its value). ---- */
const FIG_TRAP = {
  O: true,
  pts: { P: 40, Q: 150, R: 210, S: 270 },
  chords: [
    ["P", "Q"], ["Q", "R"], ["R", "S"], ["S", "P"],
    { a: "O", b: "P", mk: "t1" },
    { a: "O", b: "R", mk: "t1" },
  ],
  angles: [{ at: "O", legs: ["P", "R"], t: "", o: { v: 170 } }],
};

/* ---- panels 3-4, 6: the correct construction — OQ, OS joined (ticked),
   ∠P given and marked (green), the non-reflex central angle O₁ (green,
   same doubling-pair family as ∠P — item 6/7's two-colour ruling), and
   the reflex central angle O₂ (orange, the derived pair), drawn with the
   engine's reflex mark and labelled, the star of this round's own
   60→120→240→120 chain. Reused for the error-spot panel (the figure that
   solution is working from) and the closing recap. o.r: 28/30/32 on
   "60°"/O₁/O₂ (FIX-ROUND-3.md item 7, 2026-08-12) pull all three tight
   against their own arcs — real getBBox()-checked, no overlaps. */
const FIG_CORRECT = {
  O: true,
  pts: { P: 40, Q: 150, R: 210, S: 270 },
  chords: [
    ["P", "Q"], ["Q", "R"], ["R", "S"], ["S", "P"],
    { a: "O", b: "Q", mk: "t1" },
    { a: "O", b: "S", mk: "t1" },
  ],
  /* VALUE KEY, 2026-08-12 (her explicit yes — the same treatment pr5 got,
     so the two cyclic-quad rounds finally match). The centre here was the
     tightest spot left in the whole proof group: O₁ and O₂ share vertex O
     with the centre's own "O" label, and O₂ was measuring 0.6px from it —
     touching, though not quite overlapping. It could not simply be nudged:
     outward it hit the "60°" label at P, inward it hit "O".
     Two changes free it. The given value moves off the wedge into the key
     ("∠P = 60°", the wedge keeps the short name ∠P), and O₂'s label slides
     25° along its own arc (the new o.rot) into the empty right-hand side of
     the circle, where nothing is drawn at all. Browser-measured across
     twelve combinations: this set opens the tightest gap on the figure from
     0.6px to 10.8px. */
  key: [{ t: "∠P = 60°", c: GREEN }],
  angles: [
    { at: "P", legs: ["S", "Q"], t: "∠P", o: { v: 60, r: 26, c: GREEN } },
    { at: "O", legs: ["Q", "S"], t: "O₁", o: { v: 120, r: 32, c: GREEN } },
    { at: "O", legs: ["Q", "S"], t: "O₂", o: { v: 240, reflex: 1, r: 38, rot: -25, c: ORANGE } },
  ],
};

const SOL_CAP = { en: "A learner's solution", af: "'n Leerder se oplossing" };

export const round = {
  id: "pr6", n: 0, accent: AC, kind: "proof", group: "g7",
  title: { en: "T3 transfer: the wrong-radii trap", af: "T3-oordrag: die strik van die verkeerde radiusse" },
  blurb: {
    en: "Same theorem, a relabelled picture — and the trap of joining the radii to the wrong two vertices.",
    af: "Dieselfde stelling, 'n herlabelde prentjie — en die strik om die radiusse aan die verkeerde twee hoekpunte te verbind.",
  },
  panels: [

    /* ---------- 1 · new picture, new letters — the first move ---------- */
    {
      type: "choice",
      prompt: {
        en: "A new picture: PQRS is a cyclic quadrilateral, rotated from the last one. ∠P and ∠R are the opposite pair this time (marked). What is the first move — the one construction that survives every version of this proof?",
        af: "'n Nuwe prentjie: PQRS is 'n koordevierhoek, gedraai vanaf die vorige een. ∠P en ∠R is die teenoorstaande paar hierdie keer (gemerk). Wat is die eerste stap — die een konstruksie wat elke weergawe van hierdie bewys oorleef?",
      },
      diagram: FIG_CLAIM,
      options: [
        { text: { en: "Join the radii OQ and OS — the vertices NOT in the pair", af: "Verbind die radiusse OQ en OS — die hoekpunte wat NIE in die paar is nie" }, correct: true },
        { text: { en: "Join the radii OP and OR — the two vertices already in the pair", af: "Verbind die radiusse OP en OR — die twee hoekpunte reeds in die paar" } },
        { text: { en: "Join PR directly and work inside triangle PQR instead", af: "Verbind PR direk en werk eerder binne driehoek PQR" } },
        { text: { en: "Measure ∠P and ∠R with a protractor and add them", af: "Meet ∠P en ∠R met 'n gradeboog en tel hulle bymekaar" } },
      ],
      hints: [
        { en: "Look back at the last round — did we join radii to the vertices IN the angle pair, or the ones NOT in it?",
          af: "Kyk terug na die vorige rondte — het ons radiusse verbind aan die hoekpunte IN die hoekpaar, of dié wat NIE daarin is nie?" },
        { en: "The ones NOT in it. Here that's Q and S. Same tool, new letters: join OQ and OS.",
          af: "Dié wat nie daarin is nie. Hier is dit Q en S. Dieselfde hulpmiddel, nuwe letters: verbind OQ en OS." },
      ],
      reason: "construction",
      note: {
        en: "Same tool as the last round, new letters: join the radii to the two vertices NOT in the angle pair — here that's Q and S, not P and R. The picture rotated; the construction did not.",
        af: "Dieselfde hulpmiddel as die vorige rondte, nuwe letters: verbind die radiusse na die twee hoekpunte wat NIE in die hoekpaar is nie — hier is dit Q en S, nie P en R nie. Die prentjie het gedraai; die konstruksie het nie.",
      },
    },

    /* ---------- 2 · THE TRAP — sprung, already drawn ---------- */
    {
      type: "choice",
      prompt: {
        en: "A classmate tried it differently: they joined OP and OR instead — shown here, tick-marked, with the central angle they make. It IS a legal construction (O and P always define a radius; so do O and R). Does it actually help prove ∠P + ∠R = 180° though?",
        af: "'n Klasmaat het dit anders probeer: hulle het eerder OP en OR verbind — hier gewys, gemerk, met die middelpuntshoek wat hulle maak. Dit IS 'n wettige konstruksie (O en P bepaal altyd 'n radius; so ook O en R). Help dit werklik om ∠P + ∠R = 180° te bewys?",
      },
      diagram: FIG_TRAP,
      options: [
        { text: { en: "No — those radii end AT P and R; the theorem needs a central angle on the SAME arc as ∠P or ∠R, and ∠POR isn't on either", af: "Nee — daardie radiusse eindig BY P en R; die stelling benodig 'n middelpuntshoek op DIESELFDE boog as ∠P of ∠R, en ∠POR is op nie een van die twee nie" }, correct: true },
        { text: { en: "Yes — non-reflex ∠POR = 2∠P, the same doubling rule as every other central angle", af: "Ja — nie-inspringende ∠POR = 2∠P, dieselfde verdubbelingsreël as elke ander middelpuntshoek" } },
        { text: { en: "Yes — OP = OR makes triangle POR isosceles, and isosceles triangles alone finish this proof", af: "Ja — OP = OR maak driehoek POR gelykbenig, en gelykbenige driehoeke alleen maak hierdie bewys klaar" } },
        { text: { en: "No — because OP and OR happen not to be equal in length on this circle", af: "Nee — omdat OP en OR toevallig nie gelyke lengtes op hierdie sirkel het nie" } },
      ],
      hints: [
        { en: "The angle-at-centre theorem always pairs a central angle with a circumference angle standing on the exact SAME arc. ∠POR's two rays go straight to P and to R — where do ∠P and ∠R themselves actually sit?",
          af: "Die hoek-by-middelpunt-stelling koppel altyd 'n middelpuntshoek aan 'n omtrekhoek wat op presies DIESELFDE boog staan. ∠POR se twee strale loop reguit na P en na R — waar sit ∠P en ∠R self werklik?" },
        { en: "∠P and ∠R sit exactly where those two radii end — a circumference angle can never be the \"same arc\" partner of a central angle that terminates at its own vertex. Legal move, wrong pair, dead end.",
          af: "∠P en ∠R sit presies waar daardie twee radiusse eindig — 'n omtrekhoek kan nooit die \"selfde boog\"-vennoot wees van 'n middelpuntshoek wat by sy eie hoekpunt eindig nie. Wettige skuif, verkeerde paar, dooie einde." },
      ],
      reason: "construction",
      note: {
        en: "Being legal and being USEFUL are two different things. OP and OR are honest radii — but they end at P and R themselves, so ∠POR can never stand on the same arc as ∠P or ∠R. The theorem needs the central angle built from the OTHER two vertices, the ones the angle pair is actually looking at. This is the classic trap of this proof: it feels like the obvious move, and it goes nowhere.",
        af: "Om wettig te wees en om NUTTIG te wees is twee verskillende dinge. OP en OR is eerlike radiusse — maar hulle eindig by P en R self, dus kan ∠POR nooit op dieselfde boog as ∠P of ∠R staan nie. Die stelling benodig die middelpuntshoek gebou uit die ANDER twee hoekpunte, dié waarna die hoekpaar werklik kyk. Dit is die klassieke strik van hierdie bewys: dit voel soos die voor-die-hand-liggende skuif, en dit kom nêrens uit nie.",
      },
    },

    /* ---------- 3 · the correct construction, compressed ---------- */
    {
      type: "choice",
      prompt: {
        en: "Back to the correct pair: OQ and OS are drawn, and ∠P = 60° is given (green, marked). Same chain as last round, one number instead of a letter: the theorem once on O₁ (same green) doubles ∠P to 120°. Before ∠R gets a value, O₂ (orange) — the rest of the turn around O, drawn the long way round — is 360° − 120° = 240°, for free. Run the theorem AGAIN, on O₂, to reach ∠R. What is ∠R, and what does that make ∠P + ∠R?",
        af: "Terug na die regte paar: OQ en OS is getrek, en ∠P = 60° is gegee (groen, gemerk). Dieselfde ketting as die vorige rondte, een getal in plaas van 'n letter: die stelling een keer op O₁ (dieselfde groen) verdubbel ∠P na 120°. Voordat ∠R 'n waarde kry, is O₂ (oranje) — die res van die draai om O, die lang pad om geteken — 360° − 120° = 240°, verniet. Laat die stelling weer loop, op O₂, om ∠R te kry. Wat is ∠R, en wat maak dit ∠P + ∠R?",
      },
      diagram: FIG_CORRECT,
      options: [
        { text: { en: "∠R = 120°, so ∠P + ∠R = 60° + 120° = 180°", af: "∠R = 120°, dus ∠P + ∠R = 60° + 120° = 180°" }, correct: true },
        { text: { en: "∠R = 60°, the same as ∠P, so ∠P + ∠R = 120°", af: "∠R = 60°, dieselfde as ∠P, dus ∠P + ∠R = 120°" } },
        { text: { en: "∠R = 240°, the whole reflex piece itself, so ∠P + ∠R = 300°", af: "∠R = 240°, die hele inspringende stuk self, dus ∠P + ∠R = 300°" } },
        { text: { en: "∠R can't be found at all without measuring it directly", af: "∠R kan glad nie gevind word sonder om dit direk te meet nie" } },
      ],
      hints: [
        { en: "O₁ = 2 × 60° = 120°. Two rays out of O split the whole turn into two pieces, no new letter needed: O₂ = 360° − 120° = 240° — the same move as last round, before ∠R has any value at all.",
          af: "O₁ = 2 × 60° = 120°. Twee strale uit O verdeel die hele draai in twee stukke, geen nuwe letter nodig nie: O₂ = 360° − 120° = 240° — dieselfde skuif as die vorige rondte, voordat ∠R enige waarde het." },
        { en: "Now run the theorem again, on O₂ this time: ∠R = O₂ ÷ 2 = 240° ÷ 2 = 120°. Then ∠P + ∠R = 60° + 120° = 180° — supplementary, exactly as the last round proved it always must be.",
          af: "Laat die stelling nou weer loop, hierdie keer op O₂: ∠R = O₂ ÷ 2 = 240° ÷ 2 = 120°. Dan ∠P + ∠R = 60° + 120° = 180° — supplementêr, presies soos die vorige rondte bewys het dit altyd moet wees." },
      ],
      reason: "cyclicOpp",
      note: {
        en: "The exact same chain as last round, numbers instead of a second letter: O₁ = 2 × 60° = 120° (theorem once). Before ∠R has a value, O₂ = 360° − 120° = 240° (∠s round a point — no new letter needed). Theorem again, on O₂: ∠R = 240° ÷ 2 = 120°. ∠P + ∠R = 60° + 120° = 180° — the picture rotated and the numbers are new, but the result is exactly what the last round proved: opposite angles of a cyclic quad are always supplementary.",
        af: "Presies dieselfde ketting as die vorige rondte, getalle in plaas van 'n tweede letter: O₁ = 2 × 60° = 120° (stelling een keer). Voordat ∠R 'n waarde het, is O₂ = 360° − 120° = 240° (∠e om 'n punt — geen nuwe letter nodig nie). Stelling weer, op O₂: ∠R = 240° ÷ 2 = 120°. ∠P + ∠R = 60° + 120° = 180° — die prentjie het gedraai en die getalle is nuut, maar die resultaat is presies wat die vorige rondte bewys het: teenoorstaande hoeke van 'n koordevierhoek is altyd supplementêr.",
      },
    },

    /* ---------- 4 · error-spotting: right conclusion, one wrong reason ---------- */
    {
      type: "choice",
      prompt: {
        en: "This solution reaches the right conclusion, ∠P + ∠R = 180° — but one line has the WRONG reason written next to it. Which one?",
        af: "Hierdie oplossing kom by die regte gevolgtrekking uit, ∠P + ∠R = 180° — maar een reël het die VERKEERDE rede langsaan geskryf. Watter een?",
      },
      diagram: FIG_CORRECT,
      solution: {
        caption: SOL_CAP,
        lines: [
          { st: "OQ = OS", rs: { en: "radii", af: "radii" } },
          { st: "O₁ = 2∠P", rs: { en: "∠ at centre = 2 × ∠ at circumference", af: "Midpt∠ = 2 × Omtreks∠" } },
          { st: "O₂ = 2∠R", rs: { en: "∠ at centre = 2 × ∠ at circumference", af: "Midpt∠ = 2 × Omtreks∠" } },
          { st: "O₁ + O₂ = 360°", rs: { en: "∠ at centre = 2 × ∠ at circumference", af: "Midpt∠ = 2 × Omtreks∠" } },
          { st: "∴ ∠P + ∠R = 180°" },
        ],
      },
      options: [
        { text: { en: "O₁ + O₂ = 360°   (∠ at centre = 2 × ∠ at circumference)", af: "O₁ + O₂ = 360°   (Midpt∠ = 2 × Omtreks∠)" }, correct: true },
        { text: { en: "OQ = OS   (radii)", af: "OQ = OS   (radii)" } },
        { text: { en: "O₁ = 2∠P   (∠ at centre = 2 × ∠ at circumference)", af: "O₁ = 2∠P   (Midpt∠ = 2 × Omtreks∠)" } },
        { text: { en: "O₂ = 2∠R   (∠ at centre = 2 × ∠ at circumference)", af: "O₂ = 2∠R   (Midpt∠ = 2 × Omtreks∠)" } },
      ],
      hints: [
        { en: "Check each reason against what it actually needs. \"∠ at centre = 2 × ∠ at circumference\" only ever compares ONE central angle to ONE circumference angle on the same arc. Which line isn't doing that at all?",
          af: "Toets elke rede teen wat dit werklik nodig het. \"Midpt∠ = 2 × Omtreks∠\" vergelyk net ooit EEN middelpuntshoek met EEN omtrekhoek op dieselfde boog. Watter reël doen dit glad nie?" },
        { en: "\"O₁ + O₂ = 360°\" never mentions a circumference angle at all — it's two rays out of O splitting a full turn in half. That reason is \"∠s round a pt\", not the doubling theorem.",
          af: "\"O₁ + O₂ = 360°\" noem glad nie 'n omtrekhoek nie — dit is twee strale uit O wat 'n volledige draai in twee verdeel. Daardie rede is \"∠e om 'n punt\", nie die verdubbelingstelling nie." },
      ],
      reason: "roundPt",
      note: {
        en: "O₁ + O₂ = 360° is correct maths, but \"∠ at centre = 2 × ∠ at circumference\" is the wrong reason for it — that reason needs a circumference angle in the sentence, and this line doesn't have one. Two rays out of a point completing a full turn is a separate, more basic fact: \"∠s round a pt\".",
        af: "O₁ + O₂ = 360° is korrekte wiskunde, maar \"Midpt∠ = 2 × Omtreks∠\" is die verkeerde rede daarvoor — daardie rede benodig 'n omtrekhoek in die sin, en hierdie reël het nie een nie. Twee strale uit 'n punt wat 'n volledige draai voltooi, is 'n aparte, meer basiese feit: \"∠e om 'n punt\".",
      },
    },

    /* ---------- 5 · the legal-constructions thread, continued ---------- */
    {
      type: "choice",
      prompt: {
        en: "Partway through this proof, a learner wants to draw ONE new line to help. Only one of these four moves is actually allowed. Which construction is legal?",
        af: "Halfpad deur hierdie bewys wil 'n leerder EEN nuwe lyn teken om te help. Net een van hierdie vier skuiwe is werklik toegelaat. Watter konstruksie is wettig?",
      },
      diagram: FIG_CLAIM,
      options: [
        { text: { en: "Join the radii OQ and OS", af: "Verbind die radiusse OQ en OS" }, correct: true },
        { text: { en: "Construct a tangent to the circle at R", af: "Konstrueer 'n raaklyn aan die sirkel by R" } },
        { text: { en: "Draw a line through O parallel to PQ", af: "Teken 'n lyn deur O ewewydig aan PQ" } },
        { text: { en: "Assume ∠QOS = 2∠P first, then use that to finish the proof", af: "Neem eers aan ∠QOS = 2∠P, gebruik dit dan om die bewys klaar te maak" } },
      ],
      hints: [
        { en: "A legal move only ever uses points that ALREADY exist — join two of them, or draw a radius from O to a point on the circle. Which one of these four does only that?",
          af: "'n Wettige skuif gebruik net punte wat REEDS bestaan — verbind twee van hulle, of teken 'n radius van O na 'n punt op die sirkel. Watter een van hierdie vier doen net dit?" },
        { en: "Joining OQ and OS uses two points you already have — the centre and two points on the circle. That's always allowed; it's just two radii. The other three all hand you something nobody has proven yet: touching the circle once, running parallel forever, or — worst of all — the exact result the proof is trying to reach.",
          af: "Om OQ en OS te verbind, gebruik twee punte wat jy reeds het — die middelpunt en twee punte op die sirkel. Dit is altyd toegelaat; dis net twee radiusse. Die ander drie gee jou almal iets wat niemand nog bewys het nie: raak die sirkel net een keer, loop vir ewig ewewydig, of — die ergste van almal — presies die resultaat wat die bewys probeer bereik." },
      ],
      reason: "construction",
      note: {
        en: "Two points that already exist can always be joined — O, Q and S give you nothing more exotic than two ordinary radii, guaranteed true lines. The other three all smuggle in something extra: that a line touches the circle only once (a tangent), that two lines never meet (parallel), or the exact result the proof is trying to reach, assumed up front. That last one is the sneakiest, because it FEELS like a shortcut. The classroom rule says it best: \"When we assume, we make an ass out of u and me.\"",
        af: "Twee punte wat reeds bestaan kan altyd verbind word — O, Q en S gee jou niks anders as twee gewone radiusse nie, gewaarborgde ware lyne. Die ander drie smokkel almal iets ekstra in: dat 'n lyn die sirkel net een keer raak (raaklyn), dat twee lyne nooit ontmoet nie (parallel), of die presiese resultaat wat die bewys probeer bereik, vooraf aangeneem. Daardie laaste een is die slinksste, want dit VOEL soos 'n kortpad. Die klaskamerreël sê dit die beste: \"When we assume, we make an ass out of u and me.\"",
      },
    },

    /* ---------- 6 · recap — the trap named, the result unchanged ---------- */
    {
      type: "note",
      prompt: { en: "What actually transferred", af: "Wat werklik oorgedra het" },
      diagram: FIG_CORRECT,
      note: {
        en: "The picture rotated, the letters changed from A, B, C, D to P, Q, R, S — and the construction still did not care: join the radii to the two vertices NOT in the angle pair, run the angle-at-centre theorem twice on that one central angle, and add. Joining the OTHER two radii instead (OP and OR — a classmate's honest mistake) is perfectly legal, and perfectly useless, because it never reaches a central angle on the same arc as ∠P or ∠R.<br><br>Opposite angles of a cyclic quad are always supplementary — 180°, every time, no matter which two vertices happen to be called the angle pair.",
        af: "Die prentjie het gedraai, die letters het verander van A, B, C, D na P, Q, R, S — en die konstruksie het steeds nie omgegee nie: verbind die radiusse na die twee hoekpunte wat NIE in die hoekpaar is nie, laat die hoek-by-middelpunt-stelling twee keer op daardie een middelpuntshoek loop, en tel bymekaar. Om eerder die ANDER twee radiusse te verbind (OP en OR — 'n klasmaat se eerlike fout) is heeltemal wettig, en heeltemal nutteloos, want dit bereik nooit 'n middelpuntshoek op dieselfde boog as ∠P of ∠R nie.<br><br>Teenoorstaande hoeke van 'n koordevierhoek is altyd supplementêr — 180°, elke keer, ongeag watter twee hoekpunte toevallig die hoekpaar genoem word.",
      },
    },

  ],
};
