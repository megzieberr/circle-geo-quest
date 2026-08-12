/* Proof rounds P9 — "Mixed finale: pick your tool"
   (PROOF-ROUNDS-PLAN.md, session 6 — the finale, built after all four arcs.)
   ------------------------------------------------------------------------
   T1-T4 each got a discovery round (build the construction) and a transfer
   round (same construction, new picture, plus a trap). This round drills
   the thing all eight of those rounds were actually practising: given a
   BARE CLAIM, with no round telling you which theorem it belongs to, name
   the construction-and-engine pair that proves it. Claim → tool, no
   sequence, no wording — exactly the reflex Megan described.

   ELEVEN PANELS, all taps, rendered through the SAME renderInvestigate()
   as pr0-pr8 — `kind: "proof"` gets choice/note panels and per-panel XP
   for free, no new engine surface:
     1  · note   — welcome: the whole round is claim → tool, nothing new.
     2-7 · choice — six tool-match panels, ALL FOUR theorems covered at
         least once, T1 and T2 each getting a second, harder-worded claim
         (T1's cheat-note variant B direction; T2's reflex phrasing and its
         "same segment" disguise, per PROOF-ROUNDS-PLAN.md's own examples).
         Every one of these six panels offers the SAME four options — the
         four theorems' own recap sentences, expanded to name both the
         construction and the engine — so the "wrong" options are always a
         genuine tool from a genuine round, just the wrong one.
         These six were figure-free until 2026-08-12, on the argument that
         the claim is entirely in words so a picture would be decoration.
         Her playtest overturned it and she was right — see the STARTING
         DIAGRAMS block below. Each now carries a CLAIM-ONLY picture (never
         the construction). Panels 8-10 stay figure-free: they propose a
         move in the abstract, with no particular circle behind them.
     8-10 · choice — the legal/illegal lightning set. THREE fresh moves
         (not a clone of pr2/pr4/pr6/pr8's four-option "which is legal"
         panels): each panel proposes ONE move and asks Legal or Illegal,
         with the reasoning in the note. The classroom catchphrase appears
         ONCE in this round (panel 8's note), verbatim English in both
         language versions, per her explicit ruling.
     11 · note   — closing recap: all four tool sentences side by side,
         ending on the actual takeaway. Last panel of the round, and of
         the whole group.

   REASON CODES — one per panel, drawn from js/i18n.js REASONS, reusing
   the exact code each construction earned in its own arc: construction
   (T1 x2, and all three legal panels), sameSeg (T2's same-segment
   disguise — literally the REASONS code for that fact), centreDouble
   (T2's reflex claim), cyclicOpp (T3), tanChord (T4).

   THE FOUR TOOL OPTIONS never change wording panel to panel — that is
   the point of a speed-match round, and it keeps the length-tell check
   honest: across the six tool-match panels the "correct" slot rotates
   through the shortest, a mid-length, and the two longest of the four
   texts, so no single length ever predicts the right tap. */

const AC = "#9c36b5";

const TOOL_T1 = {
  /* "RHS of SSS" and not RHS alone: variant B (midpoint given, prove the
     right angle) genuinely runs on SSS — pr2's own recap sentence is
     "let RHS or SSS carry the rest", and panel 3 below IS that variant. */
  en: "Join the two radii to the chord's endpoints; prove the triangles congruent (RHS or SSS).",
  af: "Verbind die twee radiusse na die koord se eindpunte; bewys die driehoeke kongruent (RHS of SSS).",
};
const TOOL_T2 = {
  en: "Draw the diameter through the circumference point; two isosceles triangles, doubled by the exterior angle theorem.",
  af: "Trek die middellyn deur die omtrekpunt; twee gelykbenige driehoeke, verdubbel deur die buitehoekstelling.",
};
const TOOL_T3 = {
  en: "Join the radii to the two vertices NOT in the angle pair; run the angle-at-centre theorem twice and add.",
  af: "Verbind die radiusse na die twee hoekpunte wat NIE in die hoekpaar is nie; laat die hoek-by-middelpunt-stelling twee keer loop en optel.",
};
const TOOL_T4 = {
  en: "Draw the diameter from the point of tangency; chase two free right angles through a triangle.",
  af: "Trek die middellyn vanaf die raakpunt; jaag twee verniet-regte-hoeke deur 'n driehoek.",
};

function toolOptions(correctId) {
  return [
    { text: TOOL_T1, correct: correctId === "T1" },
    { text: TOOL_T2, correct: correctId === "T2" },
    { text: TOOL_T3, correct: correctId === "T3" },
    { text: TOOL_T4, correct: correctId === "T4" },
  ];
}

/* ============================================================
   STARTING DIAGRAMS for the six speed-match panels (added
   2026-08-12 on her ask: "for the mixed finale, please give them
   diagrams (without the constructions, just the starting diagrams)").

   This round was built figure-free on purpose — the claim is entirely in
   words, so a picture would have been decoration. Her playtest says
   otherwise, and she is right: reading "prove that a line from the centre,
   perpendicular to a chord, bisects the chord" cold is a paragraph of
   parsing before the actual question (which TOOL?) even starts. A picture
   of the claim removes that tax without answering anything.

   ⚠️ CLAIM ONLY, NEVER THE CONSTRUCTION. Each figure shows exactly what a
   question would give you and not one line more — no radii joined, no
   diameter drawn, no far-end joins. The whole point of the panel is to
   pick the construction, so drawing it would be handing over the answer,
   the same fault her playtest caught on pr7's and pr8's combine panels.
   Target angles are marked but never labelled with a value.

   COORDINATES ARE REUSED, NOT INVENTED — every one is lifted from a
   figure the checkers have already verified in the round that teaches
   that theorem, so these add no new geometry to trust:
     T1 pair  ← proof2-t1-transfer.js  (P:55, Q:195, N = midpoint)
     same-seg ← proof4-t2-transfer.js  (A:216, B:324, E:52, F:128)
     reflex   ← the one genuinely new picture (A:200, B:340, P:270): the
                reflex ∠AOB = 220° and ∠APB = 110° = half of it, P sitting
                on the arc the reflex angle looks across. Engine-verified
                like everything else.
     cyc quad ← proof5-t3-discovery.js (A:160, B:80, C:350, D:240)
     tan-chd  ← proof7-t4-discovery.js (T:270, A:38, P:150)
   ============================================================ */

/* p2 · T1 variant A — GIVEN: the line from the centre meets the chord at
   90°. Nothing joined to P or Q; that join IS the answer. */
const FIG_T1_PERP = {
  O: true,
  pts: { P: 55, Q: 195 },
  mid: [{ name: "N", of: ["P", "Q"] }],
  chords: [["P", "Q"], { a: "O", b: "N" }],
  angles: [{ at: "N", legs: ["O", "Q"], t: "", o: { v: 90, mark: 1 } }],
};

/* p3 · T1 variant B — GIVEN: N is the midpoint (ticked). No right-angle
   mark: that is the thing being proven. */
const FIG_T1_MID = {
  O: true,
  pts: { P: 55, Q: 195 },
  mid: [{ name: "N", of: ["P", "Q"] }],
  chords: [{ a: "P", b: "N", mk: "t1" }, { a: "N", b: "Q", mk: "t1" }, { a: "O", b: "N" }],
};

/* p4 · T2 in its "same segment" disguise — GIVEN: chord AB and two points
   E and F on the same arc, each joined to A and B. The radii OA/OB are
   the construction, so they are NOT drawn. */
const FIG_SAME_SEG = {
  O: true,
  pts: { A: 216, B: 324, E: 52, F: 128 },
  chords: [["A", "B"], ["E", "A"], ["E", "B"], ["F", "A"], ["F", "B"]],
  angles: [
    { at: "E", legs: ["A", "B"], t: "", o: { v: 54 } },
    { at: "F", legs: ["A", "B"], t: "", o: { v: 54 } },
  ],
};

/* p5 · T2 in its reflex phrasing — GIVEN: the reflex angle at the centre
   and the angle at P standing on the same arc. OA and OB are given here
   (the claim is ABOUT the angle at the centre, so it cannot be stated
   without them); the diameter through P is the construction and is not
   drawn. */
const FIG_REFLEX = {
  O: true,
  pts: { A: 200, B: 340, P: 270 },
  chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]],
  angles: [
    { at: "O", legs: ["B", "A"], t: "", o: { v: 220, reflex: 1 } },
    { at: "P", legs: ["A", "B"], t: "", o: { v: 110 } },
  ],
};

/* p6 · T3 — GIVEN: a bare cyclic quadrilateral, the opposite pair marked.
   No radii: joining them is the construction. */
const FIG_CYCLIC_QUAD = {
  O: true,
  pts: { A: 160, B: 80, C: 350, D: 240 },
  chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"]],
  angles: [
    { at: "A", legs: ["D", "B"], t: "", o: { v: 100 } },
    { at: "C", legs: ["B", "D"], t: "", o: { v: 80 } },
  ],
};

/* p7 · T4 — GIVEN: the tangent, the chord, and the point in the alternate
   segment, with both angles marked. The diameter from T is the
   construction and is not drawn. */
const FIG_TAN_CHORD = {
  O: true,
  pts: { T: 270, A: 38, P: 150 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: [["T", "A"], ["P", "T"], ["P", "A"]],
  angles: [
    { at: "T", legs: ["tg+", "A"], t: "", o: { v: 64 } },
    { at: "P", legs: ["T", "A"], t: "", o: { v: 64 } },
  ],
};

export const round = {
  id: "pr9", n: 0, accent: AC, kind: "proof", group: "g7",
  title: { en: "Mixed finale: pick your tool", af: "Gemengde eindronde: kies jou werktuig" },
  blurb: {
    en: "Claim, then tool — all four theorems shuffled, plus a lightning round on legal moves.",
    af: "Bewering, dan werktuig — al vier stellings deurmekaar, plus 'n weerligronde oor wettige skuiwe.",
  },
  panels: [

    /* ---------- 1 · welcome ---------- */
    {
      type: "note",
      prompt: { en: "The mixed finale", af: "Die gemengde eindronde" },
      note: {
        en: "Four theorems, four constructions — and now the real test: given a bare claim, with no round telling you which theorem it belongs to, can you tell which tool actually proves it? Read each claim, then tap the ONE construction-and-engine pair that does the job. The wrong options are always someone else's tool, borrowed and hoping you won't notice.<br><br>Then a short lightning round on what counts as a legal move. No new maths from here — just the reflex: claim, then tool.",
        af: "Vier stellings, vier konstruksies — en nou die regte toets: gegee 'n kaal bewering, met geen rondte wat vir jou sê aan watter stelling dit behoort nie, kan jy uitwerk watter werktuig dit werklik bewys? Lees elke bewering, tik dan die EEN konstruksie-en-werktuig-paar wat die werk doen. Die verkeerde opsies is altyd iemand anders se werktuig, geleen en hopend jy sal nie agterkom nie.<br><br>Daarna 'n kort weerligronde oor wat as 'n wettige skuif tel. Niks nuwe wiskunde van hier af nie — net die refleks: bewering, dan werktuig.",
      },
    },

    /* ---------- 2 · T1, plain claim ---------- */
    {
      type: "choice",
      prompt: {
        en: "Speed match: prove that a line from the centre, perpendicular to a chord, bisects the chord. Which construction and engine actually proves it?",
        af: "Spoed-passing: bewys dat 'n lyn vanaf die middelpunt, loodreg op 'n koord, die koord halveer. Watter konstruksie en werktuig bewys dit werklik?",
      },
      diagram: FIG_T1_PERP,
      options: toolOptions("T1"),
      hints: [
        { en: "This claim is about a line from the centre meeting a chord — no tangent, no cyclic quad, no second circumference point. Which tool builds two triangles straight from the two ends of the chord?",
          af: "Hierdie bewering gaan oor 'n lyn vanaf die middelpunt wat 'n koord ontmoet — geen raaklyn, geen koordevierhoek, geen tweede omtrekpunt nie. Watter werktuig bou twee driehoeke reguit uit die koord se twee eindpunte?" },
        { en: "Join the two radii to the chord's endpoints, then prove the triangles congruent — that's the one that never mentions a second circumference point, a cyclic quad, or a tangent.",
          af: "Verbind die twee radiusse na die koord se eindpunte, bewys dan die driehoeke kongruent — dit is die een wat nooit 'n tweede omtrekpunt, 'n koordevierhoek of 'n raaklyn noem nie." },
      ],
      reason: "construction",
      note: {
        en: "Join the two radii to the chord's endpoints, then prove the triangles congruent is the tell whenever the whole claim lives on ONE chord and the centre, with no other point on the circle involved at all.",
        af: "Verbind die twee radiusse na die koord se eindpunte, bewys dan die driehoeke kongruent is die teken wanneer die hele bewering net op EEN koord en die middelpunt leef, met geen ander punt op die sirkel betrokke nie.",
      },
    },

    /* ---------- 3 · T1, harder — variant B direction ---------- */
    {
      type: "choice",
      prompt: {
        en: "Speed match: prove that a line from the centre which bisects a chord meets that chord at 90°. Which construction and engine actually proves it?",
        af: "Spoed-passing: bewys dat 'n lyn vanaf die middelpunt wat 'n koord halveer, daardie koord teen 90° ontmoet. Watter konstruksie en werktuig bewys dit werklik?",
      },
      diagram: FIG_T1_MID,
      options: toolOptions("T1"),
      hints: [
        { en: "Same ingredients as the last claim — a line from the centre, one chord, nothing else — just said the other way round: this time the midpoint is the starting fact and the right angle is what's being chased.",
          af: "Dieselfde bestanddele as die vorige bewering — 'n lyn vanaf die middelpunt, een koord, niks anders nie — net andersom gesê: hierdie keer is die middelpunt die beginfeit en die regte hoek is wat gejaag word." },
        { en: "It doesn't matter which direction the claim runs — given the right angle, prove the bisecting, or given the bisecting, prove the right angle — the construction is identical: join the two radii to the chord's endpoints.",
          af: "Dit maak nie saak in watter rigting die bewering loop nie — gegee die regte hoek, bewys die halvering, of gegee die halvering, bewys die regte hoek — die konstruksie is identies: verbind die twee radiusse na die koord se eindpunte." },
      ],
      reason: "construction",
      note: {
        en: "Same tool as the last claim, said backwards — the construction never cared which fact was given and which was being proven. Join the two radii to the chord's endpoints, either way round.",
        af: "Dieselfde werktuig as die vorige bewering, net agterstevoor gesê — die konstruksie het nooit omgegee watter feit gegee was en watter bewys moes word nie. Verbind die twee radiusse na die koord se eindpunte, in albei rigtings.",
      },
    },

    /* ---------- 4 · T2, same-segment disguise ---------- */
    {
      type: "choice",
      prompt: {
        en: "Speed match: prove that two angles standing in the same segment, on the same chord, are equal. Which construction and engine actually proves it?",
        af: "Spoed-passing: bewys dat twee hoeke wat in dieselfde segment staan, op dieselfde koord, gelyk is. Watter konstruksie en werktuig bewys dit werklik?",
      },
      diagram: FIG_SAME_SEG,
      options: toolOptions("T2"),
      hints: [
        { en: "\"Same segment\" doesn't name a new tool — it's a claim about two circumference angles on one chord, and you already met the construction that PROVES that fact, not just states it.",
          af: "\"Dieselfde segment\" noem nie 'n nuwe werktuig nie — dit is 'n bewering oor twee omtrekhoeke op een koord, en jy het reeds die konstruksie ontmoet wat daardie feit BEWYS, nie net dit stel nie." },
        { en: "Draw the diameter through one of the circumference points, double its base angle with the exterior angle theorem — run the same argument again through the OTHER point, and both proofs land on half of the exact same central angle, which is why they're equal.",
          af: "Trek die middellyn deur een van die omtrekpunte, verdubbel sy basishoek met die buitehoekstelling — voer dieselfde argument weer uit deur die ANDER punt, en albei bewyse beland op die helfte van presies dieselfde middelpuntshoek, en dis hoekom hulle gelyk is." },
      ],
      reason: "sameSeg",
      note: {
        en: "\"Angles in the same segment are equal\" was never its own separate tool — it's the angle-at-centre construction, run once through each point, both landing on half of the same central angle. Draw the diameter through the circumference point is still the tell.",
        af: "\"Hoeke in dieselfde segment is gelyk\" was nooit sy eie aparte werktuig nie — dit is die hoek-by-middelpunt-konstruksie, een keer deur elke punt uitgevoer, en albei beland op die helfte van dieselfde middelpuntshoek. Trek die middellyn deur die omtrekpunt is steeds die teken.",
      },
    },

    /* ---------- 5 · T2, reflex phrasing ---------- */
    {
      type: "choice",
      prompt: {
        en: "Speed match: prove that the reflex angle at the centre is double the angle at the circumference standing on the same arc. Which construction and engine actually proves it?",
        af: "Spoed-passing: bewys dat die inspringende hoek by die middelpunt dubbel die hoek by die omtrek is wat op dieselfde boog staan. Watter konstruksie en werktuig bewys dit werklik?",
      },
      diagram: FIG_REFLEX,
      options: toolOptions("T2"),
      hints: [
        { en: "Reflex just means the angle going the long way round — the construction that produces it is still the one built from a diameter through the circumference point.",
          af: "Inspringend beteken net die hoek wat die lang pad om gaan — die konstruksie wat dit lewer, is steeds die een gebou uit 'n middellyn deur die omtrekpunt." },
        { en: "Draw the diameter through the circumference point, double each base angle with the exterior angle theorem, and add — exactly the same steps, just landing on the far angle at the centre instead of the near one.",
          af: "Trek die middellyn deur die omtrekpunt, verdubbel elke basishoek met die buitehoekstelling, en tel bymekaar — presies dieselfde stappe, net wat op die ver hoek by die middelpunt beland in plaas van die naby een." },
      ],
      reason: "centreDouble",
      note: {
        en: "Reflex or not, it's still the same construction — draw the diameter through the circumference point, double the base angles, add. Which angle at the centre the sum lands on depends on the picture, never on a different tool.",
        af: "Inspringend of nie, dit is steeds dieselfde konstruksie — trek die middellyn deur die omtrekpunt, verdubbel die basishoeke, tel bymekaar. Watter hoek by die middelpunt die som uitteken, hang van die prentjie af, nooit van 'n ander werktuig nie.",
      },
    },

    /* ---------- 6 · T3 ---------- */
    {
      type: "choice",
      prompt: {
        en: "Speed match: prove that the opposite angles of a cyclic quadrilateral are supplementary. Which construction and engine actually proves it?",
        af: "Spoed-passing: bewys dat die teenoorstaande hoeke van 'n koordevierhoek supplementêr is. Watter konstruksie en werktuig bewys dit werklik?",
      },
      diagram: FIG_CYCLIC_QUAD,
      options: toolOptions("T3"),
      hints: [
        { en: "This claim is about a cyclic quadrilateral's OPPOSITE angles — not a single angle at the centre versus one at the circumference. Which tool needed TWO applications of a theorem, on the SAME central angle, to reach two angles at once?",
          af: "Hierdie bewering gaan oor 'n koordevierhoek se TEENOORSTAANDE hoeke — nie net een hoek by die middelpunt teenoor een by die omtrek nie. Watter werktuig het TWEE toepassings van 'n stelling op DIESELFDE middelpuntshoek nodig gehad, om twee hoeke gelyktydig te bereik?" },
        { en: "Join the radii to the two vertices NOT in the angle pair, then run the angle-at-centre theorem twice on that one central angle and add — the cyclic-quad tool, not the plain angle-at-centre one.",
          af: "Verbind die radiusse na die twee hoekpunte wat NIE in die hoekpaar is nie, laat die hoek-by-middelpunt-stelling dan twee keer op daardie een middelpuntshoek loop en optel — die koordevierhoek-werktuig, nie die gewone hoek-by-middelpunt een nie." },
      ],
      reason: "cyclicOpp",
      note: {
        en: "Join the radii to the two vertices NOT in the angle pair — that's the tell. It builds ONE central angle that both opposite angles stand on from either side, and the angle-at-centre theorem, run twice on that one angle, hands you the 180°.",
        af: "Verbind die radiusse na die twee hoekpunte wat NIE in die hoekpaar is nie — dit is die teken. Dit bou EEN middelpuntshoek waarop beide teenoorstaande hoeke van weerskante af staan, en die hoek-by-middelpunt-stelling, twee keer op daardie een hoek uitgevoer, gee jou die 180°.",
      },
    },

    /* ---------- 7 · T4 ---------- */
    {
      type: "choice",
      prompt: {
        en: "Speed match: prove that the tangent-chord angle equals the angle in the alternate segment, on the far side of the chord. Which construction and engine actually proves it?",
        af: "Spoed-passing: bewys dat die raaklyn–koord-hoek gelyk is aan die hoek in die oorstaande segment, aan die verste kant van die koord. Watter konstruksie en werktuig bewys dit werklik?",
      },
      diagram: FIG_TAN_CHORD,
      options: toolOptions("T4"),
      hints: [
        { en: "This claim pairs a tangent with a chord, not a chord with the centre. Which tool starts by drawing a diameter from the point where the TANGENT touches?",
          af: "Hierdie bewering koppel 'n raaklyn aan 'n koord, nie 'n koord aan die middelpunt nie. Watter werktuig begin deur 'n middellyn te trek vanaf die punt waar die RAAKLYN raak?" },
        { en: "Draw the diameter from the point of tangency — it hands you two free right angles (tan ⊥ diameter, and the angle in a semicircle), and a triangle's angle sum does the rest.",
          af: "Trek die middellyn vanaf die raakpunt — dit gee jou twee verniet-regte-hoeke (raaklyn ⊥ middellyn, en die hoek in 'n halfsirkel), en 'n driehoek se hoeksom doen die res." },
      ],
      reason: "tanChord",
      note: {
        en: "Draw the diameter from the point of tangency is the tell whenever a tangent and a chord meet — it's the only tool of the four that ever mentions a tangent at all.",
        af: "Trek die middellyn vanaf die raakpunt is die teken wanneer 'n raaklyn en 'n koord ontmoet — dit is die enigste een van die vier werktuie wat ooit 'n raaklyn noem.",
      },
    },

    /* ---------- 8 · legal/illegal — the tangent smuggle ---------- */
    {
      type: "choice",
      prompt: {
        en: "Lightning round: a classmate, partway through a proof, says: \"I'm going to construct a tangent to the circle at point P.\" Legal move?",
        af: "Weerligronde: 'n klasmaat, halfpad deur 'n bewys, sê: \"Ek gaan 'n raaklyn aan die sirkel by punt P konstrueer.\" Wettige skuif?",
      },
      options: [
        { text: { en: "Legal", af: "Wettig" } },
        { text: { en: "Illegal", af: "Onwettig" }, correct: true },
      ],
      hints: [
        { en: "A legal move only ever uses points and lines that already exist for certain. Has anyone proven that this particular line touches the circle only once, before it even gets drawn?",
          af: "'n Wettige skuif gebruik net punte en lyne wat reeds vir seker bestaan. Het iemand bewys dat hierdie spesifieke lyn die sirkel net een keer raak, voordat dit selfs geteken word?" },
        { en: "Nobody has — being a tangent is a property you'd have to prove, not something you get to declare. Constructing \"a tangent\" smuggles that unproven claim straight into the proof.",
          af: "Niemand het nie — om 'n raaklyn te wees, is 'n eienskap wat jy eers moet bewys, nie iets wat jy net kan verklaar nie. Om 'n \"raaklyn\" te konstrueer, smokkel daardie onbewese bewering reguit in die bewys in." },
      ],
      reason: "construction",
      note: {
        en: "Illegal. A centre and a point on the circle always define a radius — but \"a tangent at P\" claims something nobody has proven: that this exact line touches the circle only once. If the proof leans on that unproven claim, everything after it is sand. The classroom rule says it best: \"When we assume, we make an ass out of u and me.\"",
        af: "Onwettig. 'n Middelpunt en 'n punt op die sirkel bepaal altyd 'n radius — maar \"'n raaklyn by P\" beweer iets wat niemand bewys het nie: dat hierdie presiese lyn die sirkel net een keer raak. As die bewys op daardie onbewese bewering steun, is alles daarna sand. Die klaskamerreël sê dit die beste: \"When we assume, we make an ass out of u and me.\"",
      },
    },

    /* ---------- 9 · legal/illegal — extending a radius through the centre ---------- */
    {
      type: "choice",
      prompt: {
        en: "Lightning round: a classmate, partway through a proof, says: \"I'm going to extend this radius straight through the centre, to where it meets the circle again on the far side.\" Legal move?",
        af: "Weerligronde: 'n klasmaat, halfpad deur 'n bewys, sê: \"Ek gaan hierdie radius reguit deur die middelpunt verleng, na waar dit weer die sirkel aan die verste kant ontmoet.\" Wettige skuif?",
      },
      options: [
        { text: { en: "Legal", af: "Wettig" }, correct: true },
        { text: { en: "Illegal", af: "Onwettig" } },
      ],
      hints: [
        { en: "The centre and the point the radius already touches on the circle both already exist. Does the line stop being certain just because it keeps going past the centre?",
          af: "Die middelpunt en die punt wat die radius reeds op die sirkel raak, bestaan albei reeds. Hou die lyn op om seker te wees net omdat dit verby die middelpunt aanhou?" },
        { en: "No — a straight line through two points you already have (the centre and the far meeting point on the circle) is still just a diameter, no different from an ordinary radius.",
          af: "Nee — 'n reguit lyn deur twee punte wat jy reeds het (die middelpunt en die verste ontmoetingspunt op die sirkel) is steeds net 'n middellyn, nie anders as 'n gewone radius nie." },
      ],
      reason: "construction",
      note: {
        en: "Legal. The centre and the circle itself already guarantee where a straight line through them meets the circle a second time — nothing new is being assumed, it's still just two points defining a line, the same guarantee an ordinary radius carries.",
        af: "Wettig. Die middelpunt en die sirkel self waarborg reeds waar 'n reguit lyn deur hulle die sirkel 'n tweede keer ontmoet — niks nuuts word aangeneem nie, dis steeds net twee punte wat 'n lyn bepaal, dieselfde waarborg wat 'n gewone radius dra.",
      },
    },

    /* ---------- 10 · legal/illegal — the parallel-line smuggle ---------- */
    {
      type: "choice",
      prompt: {
        en: "Lightning round: a classmate, partway through a proof, says: \"I'm going to draw a new line through the centre O, parallel to chord AB, so I can use alternate angles.\" Legal move?",
        af: "Weerligronde: 'n klasmaat, halfpad deur 'n bewys, sê: \"Ek gaan 'n nuwe lyn deur die middelpunt O teken, ewewydig aan koord AB, sodat ek verwisselende hoeke kan gebruik.\" Wettige skuif?",
      },
      options: [
        { text: { en: "Legal", af: "Wettig" } },
        { text: { en: "Illegal", af: "Onwettig" }, correct: true },
      ],
      hints: [
        { en: "A legal move joins points that already exist, or draws a radius/diameter. Does \"parallel to AB\" name two existing points, or does it hand the line a property nobody has proven yet?",
          af: "'n Wettige skuif verbind punte wat reeds bestaan, of teken 'n radius/middellyn. Noem \"ewewydig aan AB\" twee bestaande punte, of gee dit die lyn 'n eienskap wat niemand nog bewys het nie?" },
        { en: "It hands the line a property — staying parallel forever is exactly the kind of unproven claim a legal construction is never allowed to smuggle in.",
          af: "Dit gee die lyn 'n eienskap — om vir ewig ewewydig te bly, is presies die soort onbewese bewering wat 'n wettige konstruksie nooit mag insmokkel nie." },
      ],
      reason: "construction",
      note: {
        en: "Illegal. Two points define a line, and a centre with a point on the circle defines a radius — both guaranteed. \"Parallel to AB\" guarantees nothing yet; staying parallel is a property this line would still need to earn, not one it's allowed to start with.",
        af: "Onwettig. Twee punte bepaal 'n lyn, en 'n middelpunt met 'n punt op die sirkel bepaal 'n radius — altwee gewaarborg. \"Ewewydig aan AB\" waarborg nog niks nie; om ewewydig te bly, is 'n eienskap wat hierdie lyn nog moet verdien, nie een waarmee dit mag begin nie.",
      },
    },

    /* ---------- 11 · closing recap — the whole group's takeaway ---------- */
    {
      type: "note",
      prompt: { en: "Four theorems, four constructions, one reflex", af: "Vier stellings, vier konstruksies, een refleks" },
      note: {
        en: "Four claims, four tools, and the same reflex every time:<br><br><b>A line from the centre and a chord</b> — join the two radii to the chord's endpoints, then prove the triangles congruent.<br><b>An angle at the centre and one at the circumference</b> — draw the diameter through the circumference point, then let the exterior angles add up (the same move that proves two angles in the same segment are equal, run twice).<br><b>A cyclic quadrilateral's opposite angles</b> — join the radii to the two vertices NOT in the angle pair, then let the angle-at-centre theorem run twice and add.<br><b>A tangent and a chord</b> — draw the diameter from the point of tangency, then chase two free right angles through a triangle.<br><br>Every proof this chapter has built comes down to the same habit: read the claim, name the construction, reach for the engine that actually does the work. That's the whole reflex — claim, then tool.",
        af: "Vier bewerings, vier werktuie, en dieselfde refleks elke keer:<br><br><b>'n Lyn vanaf die middelpunt en 'n koord</b> — verbind die twee radiusse na die koord se eindpunte, bewys dan die driehoeke kongruent.<br><b>'n Hoek by die middelpunt en een by die omtrek</b> — trek die middellyn deur die omtrekpunt, laat die buitehoeke dan optel (dieselfde stap wat bewys twee hoeke in dieselfde segment gelyk is, twee keer uitgevoer).<br><b>'n Koordevierhoek se teenoorstaande hoeke</b> — verbind die radiusse na die twee hoekpunte wat NIE in die hoekpaar is nie, laat die hoek-by-middelpunt-stelling dan twee keer loop en optel.<br><b>'n Raaklyn en 'n koord</b> — trek die middellyn vanaf die raakpunt, jaag dan twee verniet-regte-hoeke deur 'n driehoek.<br><br>Elke bewys wat hierdie hoofstuk gebou het, kom neer op dieselfde gewoonte: lees die bewering, benoem die konstruksie, gryp na die werktuig wat werklik die werk doen. Dit is die hele refleks — bewering, dan werktuig.",
      },
    },

  ],
};
