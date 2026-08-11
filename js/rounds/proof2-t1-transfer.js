/* Proof rounds P2 — "T1 transfer: same proof, different picture"
   (PROOF-ROUNDS-PLAN.md, session 2 — the TEMPLATE arc other sessions copy.)
   ------------------------------------------------------------------------
   pr1 (proof1-t1-discovery.js) built ONE construction on variant A of T1
   (⊥ given ⇒ bisects): join the two radii, prove the triangles congruent.
   This round carries that construction across the other two cheat-note
   variants — B (midpoint given ⇒ ⊥) and C (perpendicular bisector of a
   chord passes through the centre) — in a NEW orientation with NEW letters,
   so the punchline lands as an experience, not a claim: the picture
   rotates, the labels change, the construction never does.

   SIX PANELS, all taps, same renderInvestigate() as pr0/pr1 — no new panel
   type, no typed answers:
     1 · choice — variant A again, restated with new letters (P, Q, N
         instead of A, B, M). "What's the first move?" Warms up the
         transfer before the two real variants below.
     2 · choice — variant B: midpoint given, prove ⊥. Which construction?
     3 · choice — variant C: does the perpendicular bisector of the chord
         pass through the centre? Same figure as panel 2 on purpose — same
         everything, only the WORDING of the question changed, which is
         itself the point being taught.
     4 · choice — error-spotting (invest04-prove-it.js's DNA): a learner's
         solution reaches the right conclusion with the WRONG congruency
         test named (SSS where it should be RHS). `solution.lines[].st` is
         symbol-only throughout — every English word lives in `rs` (a short
         reason TAG, same shape as invest04's L_GIVEN etc.) or in the
         panel's own bilingual `prompt`/`note`, never inside `st`.
     5 · choice — the legal-constructions thread, introduced here for the
         first time in this build (PROOF-ROUNDS-PLAN.md "The legal-
         constructions thread"). Carries the catchphrase, VERBATIM ENGLISH
         in both language versions, per her explicit ruling 2026-08-10.
     6 · note   — recap: the picture changed, the letters changed, the
         construction did not. Last panel of the round.

   GEOMETRY — new orientation, new letters, as the plan requires ("do NOT
   reuse A/B/M — the point is that the letters do not matter"). O stays at
   the engine default (cx 160, cy 120, R 80); P:55, Q:195 is a different
   arc-span and a different rotation to pr1's A:205/B:335 (140° apart here
   vs. 130° there, and the chord sits in the UPPER half of the circle
   instead of the lower), so the picture genuinely looks different, not
   just relabelled. N is the coordinate MIDPOINT of P and Q (via `mid:`),
   which — same fact used in pr1's header comment — is always also the foot
   of the perpendicular from O, for ANY two points on this circle. Marking
   90° at N (panels 1 and 4) and drawing OP/OQ as plain radii (panels 1, 4,
   6) therefore needs no per-diagram arithmetic; it is true by construction,
   which is what makes it safe to reuse across three panels here. */

const AC = "#9c36b5";

/* ---- panel 1: variant A, restated — ON ⊥ PQ already drawn and marked ----
   Same SHAPE as pr1's FIG_CLAIM, new letters/orientation. */
const FIG_PQ_CLAIM = {
  O: true,
  pts: { P: 55, Q: 195 },
  mid: [{ name: "N", of: ["P", "Q"] }],
  chords: [["P", "Q"], { a: "O", b: "N" }],
  angles: [{ at: "N", legs: ["O", "Q"], t: "", o: { v: 90, mark: 1 } }],
};

/* ---- panels 2 & 3 (variant B, then C): the "before" picture ----
   N is given as the midpoint (PN = NQ, tick-marked) — no radii drawn yet,
   no angle marked, because that is exactly what these two panels are
   asking HOW to prove. Deliberately the SAME figure for both panels: the
   picture does not change between "prove ⊥" and "prove the perpendicular
   bisector passes through O" — only the question's wording does. */
const FIG_PQ_MID = {
  O: true,
  pts: { P: 55, Q: 195 },
  mid: [{ name: "N", of: ["P", "Q"] }],
  chords: [{ a: "P", b: "N", mk: "t1" }, { a: "N", b: "Q", mk: "t1" }],
};

/* ---- panels 4 & 6: the full construction — OP, OQ (ticked radii), ON,
   and the 90° mark at N. Reused for the error-spot panel (it is exactly
   the figure that solution is working from) and for the closing recap. */
const FIG_PQ_CONSTRUCT = {
  O: true,
  pts: { P: 55, Q: 195 },
  mid: [{ name: "N", of: ["P", "Q"] }],
  chords: [
    ["P", "Q"],
    { a: "O", b: "N" },
    { a: "O", b: "P", mk: "t1" },
    { a: "O", b: "Q", mk: "t1" },
  ],
  angles: [{ at: "N", legs: ["O", "Q"], t: "", o: { v: 90, mark: 1 } }],
};

/* ---- panel 5: the legal-constructions panel — nothing drawn yet but the
   chord and the centre, because the question is which NEW line is allowed.
   N stays LABELLED (it exists — the options talk about it) but carries no
   line and no marks: the whole question is which new line may be drawn. */
const FIG_PQ_BARE = {
  O: true,
  pts: { P: 55, Q: 195 },
  mid: [{ name: "N", of: ["P", "Q"] }],
  chords: [["P", "Q"]],
};

const SOL_CAP = { en: "A learner's solution", af: "'n Leerder se oplossing" };

export const round = {
  id: "pr2", n: 0, accent: AC, kind: "proof", group: "g7",
  title: { en: "T1 transfer: a new picture", af: "T1-oordrag: 'n nuwe prentjie" },
  blurb: {
    en: "Same construction, three variants, a new picture — and the trap of assuming what you haven't proven.",
    af: "Dieselfde konstruksie, drie variante, 'n nuwe prentjie — en die strik om aan te neem wat jy nie bewys het nie.",
  },
  panels: [

    /* ---------- 1 · variant A, new letters, new orientation ---------- */
    {
      type: "choice",
      prompt: {
        en: "Same claim, new picture: O is the centre, PQ is a chord, and ON ⊥ PQ at N (given, marked). You need PN = NQ. What is the first move — the one construction that survives every version of this proof?",
        af: "Dieselfde bewering, nuwe prentjie: O is die middelpunt, PQ is 'n koord, en ON ⊥ PQ by N (gegee, gemerk). Jy soek PN = NQ. Wat is die eerste stap — die een konstruksie wat elke weergawe van hierdie bewys oorleef?",
      },
      diagram: FIG_PQ_CLAIM,
      options: [
        { text: { en: "Join the radii OP and OQ", af: "Verbind die radiusse OP en OQ" }, correct: true },
        { text: { en: "Join P directly to Q", af: "Verbind P direk aan Q" } },
        { text: { en: "Construct a line through N perpendicular to OP", af: "Konstrueer 'n lyn deur N loodreg op OP" } },
        { text: { en: "Measure ON and PQ with a ruler and compare", af: "Meet ON en PQ met 'n liniaal en vergelyk" } },
      ],
      hints: [
        { en: "Look back at the last round — what did we construct there to make two triangles appear out of nothing?",
          af: "Kyk terug na die vorige rondte — wat het ons daar gekonstrueer om twee driehoeke uit die niet te laat verskyn?" },
        { en: "OP and OQ. It does not matter that the chord is now called PQ instead of AB — same tool, same two triangles, same RHS.",
          af: "OP en OQ. Dit maak nie saak dat die koord nou PQ genoem word in plaas van AB nie — dieselfde hulpmiddel, dieselfde twee driehoeke, dieselfde RHS." },
      ],
      note: {
        en: "Same tool, new letters: join the two radii, and the two right triangles are back — OPN and OQN this time. The picture rotated; the proof did not notice.",
        af: "Dieselfde hulpmiddel, nuwe letters: verbind die twee radiusse, en die twee reghoekige driehoeke is terug — OPN en OQN hierdie keer. Die prentjie het gedraai; die bewys het dit nie eers agtergekom nie.",
      },
    },

    /* ---------- 2 · variant B: midpoint given, prove ⊥ ---------- */
    {
      type: "choice",
      prompt: {
        en: "Variant B: this time you are GIVEN PN = NQ (N is the midpoint of PQ, ticked equal), and you must prove ON ⊥ PQ. Which construction do you make?",
        af: "Variant B: hierdie keer is PN = NQ GEGEE (N is die middelpunt van PQ, gemerk as gelyk), en jy moet bewys ON ⊥ PQ. Watter konstruksie maak jy?",
      },
      diagram: FIG_PQ_MID,
      options: [
        { text: { en: "Join the radii OP and OQ", af: "Verbind die radiusse OP en OQ" }, correct: true },
        { text: { en: "Assume ON ⊥ PQ, then work backwards to check it", af: "Neem aan ON ⊥ PQ, en werk dan agteruit om dit te toets" } },
        { text: { en: "Construct the tangent to the circle at N", af: "Konstrueer die raaklyn aan die sirkel by N" } },
        { text: { en: "Drop a perpendicular from O to PQ with a set square, and call it done", af: "Laat 'n loodlyn van O na PQ met 'n driehoeklat sak, en noem dit klaar" } },
      ],
      hints: [
        { en: "What are you GIVEN this time — the midpoint, or the right angle? Whichever it is, the tool that builds the two triangles never changes.",
          af: "Wat is hierdie keer GEGEE — die middelpunt, of die regte hoek? Watter een dit ook al is, die hulpmiddel wat die twee driehoeke bou, verander nooit." },
        { en: "You are given PN = NQ, not the right angle. Same move as always: join OP and OQ, the two radii, and let the triangles do the arguing.",
          af: "PN = NQ is gegee, nie die regte hoek nie. Dieselfde stap soos altyd: verbind OP en OQ, die twee radiusse, en laat die driehoeke die argument voer." },
      ],
      note: {
        en: "Given the midpoint this time, not the right angle — but the construction is unchanged: join OP and OQ. Last round the congruent triangles handed you the equal pieces; this time, with the pieces already equal, they hand you the right angle instead.",
        af: "Hierdie keer is die middelpunt gegee, nie die regte hoek nie — maar die konstruksie is onveranderd: verbind OP en OQ. Verlede rondte het die kongruente driehoeke jou die gelyke stukke gegee; hierdie keer, met die stukke reeds gelyk, gee hulle jou eerder die regte hoek.",
      },
    },

    /* ---------- 3 · variant C: perpendicular bisector through the centre ----------
       SAME diagram as panel 2 on purpose — same everything, only the wording
       of the claim changed, which is exactly what this panel is teaching. */
    {
      type: "choice",
      prompt: {
        en: "Variant C: the perpendicular bisector of chord PQ — does it pass through the centre O? Same picture again. Which construction actually proves it?",
        af: "Variant C: die middelloodlyn van koord PQ — gaan dit deur die middelpunt O? Weer dieselfde prentjie. Watter konstruksie bewys dit werklik?",
      },
      diagram: FIG_PQ_MID,
      options: [
        { text: { en: "Join the radii OP and OQ", af: "Verbind die radiusse OP en OQ" }, correct: true },
        { text: { en: "Draw the perpendicular bisector first, and see by eye whether it looks like it passes through O", af: "Teken eers die middelloodlyn, en kyk met die oog of dit lyk of dit deur O gaan" } },
        { text: { en: "Construct a new circle centred at N", af: "Konstrueer 'n nuwe sirkel met middelpunt by N" } },
        { text: { en: "Assume O lies on the perpendicular bisector, because it looks like it does", af: "Neem aan O lê op die middelloodlyn, omdat dit lyk of dit so is" } },
      ],
      hints: [
        { en: "It is the exact same picture as the last panel — has the construction that solves it changed?",
          af: "Dit is presies dieselfde prentjie as die vorige paneel — het die konstruksie wat dit oplos, verander?" },
        { en: "No — join OP and OQ, same as every version of this proof. Once you know ON ⊥ PQ (variant B's result), ON literally IS the perpendicular bisector of PQ, and it obviously passes through O, because that is where it starts.",
          af: "Nee — verbind OP en OQ, soos elke weergawe van hierdie bewys. Sodra jy weet ON ⊥ PQ (variant B se resultaat), IS ON letterlik die middelloodlyn van PQ, en dit gaan vanselfsprekend deur O, want dit begin daar." },
      ],
      note: {
        en: "Same construction again: join OP and OQ. Once that gives you ON ⊥ PQ at the midpoint N, ON already IS the perpendicular bisector of PQ — and it runs straight out of O, because that is where it started. Three different-sounding claims, A, B and C, and every one of them comes from the same two radii.",
        af: "Weer dieselfde konstruksie: verbind OP en OQ. Sodra dit vir jou ON ⊥ PQ by die middelpunt N gee, IS ON reeds die middelloodlyn van PQ — en dit loop reguit uit O uit, want dit het daar begin. Drie bewerings wat anders klink, A, B en C, en elkeen kom van dieselfde twee radiusse af.",
      },
    },

    /* ---------- 4 · error-spotting: right conclusion, wrong congruency test ---------- */
    {
      type: "choice",
      prompt: {
        en: "This solution reaches the right conclusion, PN = NQ — but one line has the WRONG reason written next to it. Which one?",
        af: "Hierdie oplossing kom by die regte gevolgtrekking uit, PN = NQ — maar een reël het die VERKEERDE rede langsaan geskryf. Watter een?",
      },
      diagram: FIG_PQ_CONSTRUCT,
      solution: {
        caption: SOL_CAP,
        lines: [
          { st: "OP = OQ", rs: { en: "radii", af: "radii" } },
          { st: "∠ONP = ∠ONQ = 90°", rs: { en: "given", af: "gegee" } },
          { st: "ON = ON", rs: { en: "common", af: "gemeen" } },
          { st: "△OPN ≡ △OQN", rs: { en: "SSS", af: "SSS" } },
          { st: "∴ PN = NQ" },
        ],
      },
      options: [
        { text: { en: "△OPN ≡ △OQN   (SSS)", af: "△OPN ≡ △OQN   (SSS)" }, correct: true },
        { text: { en: "OP = OQ   (radii)", af: "OP = OQ   (radii)" } },
        { text: { en: "∠ONP = ∠ONQ = 90°   (given)", af: "∠ONP = ∠ONQ = 90°   (gegee)" } },
        { text: { en: "ON = ON   (common)", af: "ON = ON   (gemeen)" } },
      ],
      hints: [
        { en: "Count what SSS actually needs: three pairs of equal SIDES. Look at the three lines above it — how many are about sides, and how many are about an angle?",
          af: "Tel wat SSS werklik nodig het: drie pare gelyke SYE. Kyk na die drie reëls daarbo — hoeveel gaan oor sye, en hoeveel oor 'n hoek?" },
        { en: "Two sides (OP = OQ, ON = ON) and one angle (the right angle) is RHS, not SSS. Naming SSS here would need PN = NQ to already be known — but that is exactly the thing this solution is trying to prove.",
          af: "Twee sye (OP = OQ, ON = ON) en een hoek (die regte hoek) is RHS, nie SSS nie. Om SSS hier te noem, sou PN = NQ reeds bekend moes wees — maar dit is presies die ding wat hierdie oplossing probeer bewys." },
      ],
      reason: "rhs",
      note: {
        en: "△OPN ≡ △OQN is the right claim, but SSS is the wrong reason for it — this solution has two equal sides and a right angle, not three equal sides. Naming SSS here would need PN = NQ to already be true, and that is exactly the fact the solution is trying to reach. The real reason is RHS.",
        af: "△OPN ≡ △OQN is die regte bewering, maar SSS is die verkeerde rede daarvoor — hierdie oplossing het twee gelyke sye en 'n regte hoek, nie drie gelyke sye nie. Om SSS hier te noem, sou PN = NQ reeds waar moes wees, en dit is presies die feit wat die oplossing probeer bereik. Die regte rede is RHS.",
      },
    },

    /* ---------- 5 · the legal-constructions thread ----------
       Introduced here for the first time in the build. The catchphrase is
       her explicit ruling: VERBATIM ENGLISH in both language versions. */
    {
      type: "choice",
      prompt: {
        en: "Partway through a proof on this picture, a learner wants to draw ONE new line to help. Only one of these four moves is actually allowed. Which construction is legal?",
        af: "Halfpad deur 'n bewys op hierdie prentjie wil 'n leerder EEN nuwe lyn teken om te help. Net een van hierdie vier skuiwe is werklik toegelaat. Watter konstruksie is wettig?",
      },
      diagram: FIG_PQ_BARE,
      options: [
        { text: { en: "Join O to P", af: "Verbind O aan P" }, correct: true },
        { text: { en: "Construct the tangent to the circle at P", af: "Konstrueer die raaklyn aan die sirkel by P" } },
        { text: { en: "Construct a line through N parallel to OQ", af: "Konstrueer 'n lyn deur N ewewydig aan OQ" } },
        { text: { en: "Construct a new point R so that OR ⊥ PQ, without checking where R actually is", af: "Konstrueer 'n nuwe punt R sodat OR ⊥ PQ, sonder om te toets waar R werklik is" } },
      ],
      hints: [
        { en: "A legal move only ever uses points that ALREADY exist — join two of them, or draw a radius from O to a point on the circle. Which one of these four does only that?",
          af: "'n Wettige skuif gebruik net punte wat REEDS bestaan — verbind twee van hulle, of teken 'n radius van O na 'n punt op die sirkel. Watter een van hierdie vier doen net dit?" },
        { en: "Join O to P uses two points you already have — the centre and a point on the circle. That is always allowed; it is just a radius. The other three all hand you a property nobody has proven yet: touching the circle once, running parallel, landing exactly perpendicular.",
          af: "Verbind O aan P gebruik twee punte wat jy reeds het — die middelpunt en 'n punt op die sirkel. Dit is altyd toegelaat; dis net 'n radius. Die ander drie gee jou almal 'n eienskap wat niemand nog bewys het nie: raak die sirkel net een keer, loop ewewydig, beland presies loodreg." },
      ],
      reason: "construction",
      note: {
        en: "Two points that already exist can always be joined — O and P give you nothing more exotic than an ordinary radius, a guaranteed true line. The other three all smuggle in something extra: that a line touches the circle only once (a tangent), that two lines never meet (parallel), that a perpendicular lands at some exact new point R — none of it proven. Lean a proof on one of those and the whole thing rests on a guess. The classroom rule says it best: \"When we assume, we make an ass out of u and me.\"",
        af: "Twee punte wat reeds bestaan kan altyd verbind word — O en P gee jou niks anders as 'n gewone radius nie, 'n gewaarborgde ware lyn. Die ander drie smokkel almal iets ekstra in: dat 'n lyn die sirkel net een keer raak (raaklyn), dat twee lyne nooit ontmoet nie (parallel), dat 'n loodlyn presies by 'n nuwe punt R beland — niks daarvan bewys nie. Steun 'n bewys op een van daardie, en die hele ding rus op 'n raaiskoot. Die klaskamerreël sê dit die beste: \"When we assume, we make an ass out of u and me.\"",
      },
    },

    /* ---------- 6 · recap — what actually transferred ----------
       Last panel of the round. */
    {
      type: "note",
      prompt: { en: "What actually transferred", af: "Wat werklik oorgedra het" },
      diagram: FIG_PQ_CONSTRUCT,
      note: {
        en: "The picture rotated. The letters changed from A, B, M to P, Q, N. The construction did not: join the two radii, then let RHS or SSS carry the rest — a right angle hands you equal pieces, equal pieces hand you a right angle, and either way the perpendicular bisector of the chord runs straight through the centre.<br><br>That is the whole trick of a proof round: the tool travels. The picture never has to.",
        af: "Die prentjie het gedraai. Die letters het verander van A, B, M na P, Q, N. Die konstruksie het nie verander nie: verbind die twee radiusse, laat RHS of SSS dan die res doen — 'n regte hoek gee jou gelyke stukke, gelyke stukke gee jou 'n regte hoek, en in albei gevalle loop die middelloodlyn van die koord reguit deur die middelpunt.<br><br>Dit is die hele kuns van 'n bewysrondte: die stelling reis. Die prentjie hoef nooit nie.",
      },
    },

  ],
};
