/* Proof rounds P8 — "T4 transfer: the wrong-join trap"
   (PROOF-ROUNDS-PLAN.md, session 5 — the T4 arc.)
   ------------------------------------------------------------------------
   pr7 (proof7-t4-discovery.js) built ONE construction: draw the diameter
   from the point of tangency T (call its far end D), chase the two free
   right angles (tan ⊥ diameter at T, angle in a semicircle at the third
   point) through a triangle, and the tangent-chord angle lands back on
   itself. This round carries that construction to the OTHER side of the
   chord — the tangent-chord angle measured with the OTHER tangent ray,
   landing in the OTHER segment — and springs the CENTREPIECE trap her
   cheat notes warn about: after the diameter is correctly down, a
   classmate joins the WRONG two points for the semicircle step. It is
   shown ALREADY DRAWN, as an experience, before the panel names why it
   dies: the join never touches D, so the guaranteed semicircle 90° never
   appears anywhere useful.

   SIX PANELS, all taps, same renderInvestigate() as pr0-pr7 — no new
   panel type, no typed answers:
     1 · choice — new picture, the tangent-chord angle measured on the
         OTHER side this time (marked, unlabelled). "What's the first
         move — the one construction that survives every version of this
         proof?" (correct: draw the diameter from T.)
     2 · choice — THE TRAP, sprung and already drawn: the diameter is
         down (correct, 90° marked at T), but a classmate joined B to Q
         — some other point on the circle — instead of joining D to B.
         Legal construction (both points already exist), but does it
         reach the second 90° the proof needs? (No — named, not just
         asserted.)
     3 · choice — the correct construction, compressed to one panel (no
         multi-stage build-up — pr7 already taught the mechanism in
         full): D joined to B, the claim angle given as 35°, the free
         90°s marked, ∠DTB = 55° marked as their direct consequence.
         Triangle TDB's angle sum hands back ∠TDB = 35° — the same
         number the round started with.
     4 · choice — error-spotting (invest04-prove-it.js's DNA, pr2/pr4/pr6
         panel 4's shape): a learner's solution reaches the right
         conclusion with ONE line's reason mismatched — the semicircle
         90° at B credited to "tan ⊥ diameter" instead of "∠s in
         semi-circle", exactly the mix-up this proof invites (TWO
         different 90°s appear, from TWO different theorems).
         `solution.lines[].st` is symbol-only throughout.
     5 · choice — the legal-constructions thread, continued from
         pr2/pr4/pr6 with DIFFERENT specific moves (not a clone). Carries
         the catchphrase, VERBATIM ENGLISH in both language versions —
         used ONCE in this build for the T4 arc (pr7 has no legal panel).
     6 · note   — recap: same construction, the other side of the chord,
         the trap named, the "always equal" result. Last panel of the
         round.

   GEOMETRY — the OTHER side of the same tangent, new letters (B for the
   chord, Q for the trap's decoy point) so pr7's A and P keep meaning what
   they meant there. T:270 and D:90 are UNCHANGED from pr7 — T is always
   the point of tangency and D is always its antipode, the far end of
   whichever diameter is drawn from it; that is not a "relabelling", it is
   the construction's own fixed terminology (same convention
   discover-tangent-radius.js already uses). B:200 puts the chord's
   direction from T PAST the diameter's own direction (unlike pr7's A,
   which sat BEFORE it) — genuinely the other configuration, not just a
   mirrored number, which is what makes this "case B" rather than a copy
   of pr7 with new letters. Q:340 is a plain, otherwise-unused point on
   the circle, existing only to make the wrong join a real, legal-looking
   (but useless) move.

   Every angle mark is an EXACT integer, same reasoning as pr7's header
   (tangent-chord/inscribed angles are the exact half-arc identity; D is
   T's exact antipode, so tan ⊥ TD is an exact 90°, not a rounded one):
     direction T→B (from legDir(), matching the engine's own atan2 formula)
       = 145°   [equivalently: half the arc T→B the tg- way = 145,
                  arc = 290°... full check below]
     tg− direction at T = 270 − 90 = 180°
     tangent-chord ∠(tg−, B) = |180 − 145| = 35°           [the claim]
     ∠(tg−, D) = |180 − 90| = 90°     (tan ⊥ diameter, exact, always)
     ∠DTB = ∠(tg−,D) − ∠(tg−,B) = 90° − 35° = 55°   (B's direction, 145°,
       sits between D's 90° and tg−'s 180°, so D is the CLOSER ray to the
       tangent-chord angle this time — the opposite arrangement to pr7,
       where A sat between tg+ and D — this swap is exactly what makes it
       "the other case")
     ∠TBD = 90°   (angle in a semicircle, exact, always — TD is a diameter)
     ∠TDB = 180° − ∠DTB − ∠TBD = 180° − 55° − 90° = 35°   (△ TDB, angle
       sum) — EXACTLY the tangent-chord angle this round started with,
       35° = 35° ✓                                                        */

const AC = "#9c36b5";

/* ---- panel 1: bare tan-chord figure, before any construction. The
   tangent-chord angle marked but UNLABELLED — nothing spoiled. ---- */
const FIG_CLAIM = {
  O: true,
  pts: { T: 270, B: 200 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: [["T", "B"]],
  angles: [{ at: "T", legs: ["tg-", "B"], t: "", o: { v: 35 } }],
};

/* ---- panel 5: the legal-constructions panel — D is LABELLED (it exists,
   T's exact antipode, so the options can legally talk about it) but no
   line runs to it yet: the whole question is which new line may be
   drawn. Mirrors pr2-t1-transfer.js's own FIG_PQ_BARE convention. ---- */
const FIG_LEGAL = {
  O: true,
  pts: { T: 270, D: 90, B: 200 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: [["T", "B"]],
};

/* ---- panel 2: THE TRAP, already drawn — TD correctly down (90° marked),
   but B joined to Q (a plain point on the circle) instead of to D. ---- */
const FIG_TRAP = {
  O: true,
  pts: { T: 270, D: 90, B: 200, Q: 340 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: [["T", "B"], ["T", "D"], ["B", "Q"]],
  angles: [{ at: "T", legs: ["tg-", "D"], t: "", o: { v: 90, mark: 1 } }],
};

/* ---- panels 3-4, 6: the correct construction — D joined to B, the claim
   given and marked, ∠DTB marked as its direct consequence, both free
   90°s marked. Reused for the error-spot panel (the figure that solution
   is working from) and the closing recap. ---- */
const FIG_CORRECT = {
  O: true,
  pts: { T: 270, D: 90, B: 200 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: [["T", "B"], ["T", "D"], ["D", "B"]],
  angles: [
    { at: "T", legs: ["tg-", "B"], t: "35°", o: { v: 35 } },
    { at: "T", legs: ["tg-", "D"], t: "", o: { v: 90, mark: 1 } },
    { at: "T", legs: ["D", "B"], t: "55°", o: { v: 55 } },
    { at: "B", legs: ["T", "D"], t: "", o: { v: 90, mark: 1 } },
  ],
};

const SOL_CAP = { en: "A learner's solution", af: "'n Leerder se oplossing" };

export const round = {
  id: "pr8", n: 0, accent: AC, kind: "proof", group: "g7",
  title: { en: "T4 transfer: the wrong-join trap", af: "T4-oordrag: die strik van die verkeerde verbinding" },
  blurb: {
    en: "Same construction, the other side of the chord — and the trap of joining the wrong point once the diameter is down.",
    af: "Dieselfde konstruksie, die ander kant van die koord — en die strik om die verkeerde punt te verbind sodra die middellyn af is.",
  },
  panels: [

    /* ---------- 1 · new picture, other side of the chord — the first move ---------- */
    {
      type: "choice",
      prompt: {
        en: "A new picture: STU is a tangent at T, and TB is a chord — but this time the tangent-chord angle is measured on the OTHER side of the chord (marked). What is the first move — the one construction that survives every version of this proof?",
        af: "'n Nuwe prentjie: STU is 'n raaklyn by T, en TB is 'n koord — maar hierdie keer word die raaklyn–koord-hoek aan die ANDER kant van die koord gemeet (gemerk). Wat is die eerste stap — die een konstruksie wat elke weergawe van hierdie bewys oorleef?",
      },
      diagram: FIG_CLAIM,
      options: [
        { text: { en: "Draw the diameter from T, the point of tangency", af: "Trek die middellyn vanaf T, die raakpunt" }, correct: true },
        { text: { en: "Join OB instead, and work inside triangle OTB", af: "Verbind eerder OB, en werk binne driehoek OTB" } },
        { text: { en: "Draw a second tangent to the circle at B", af: "Trek 'n tweede raaklyn aan die sirkel by B" } },
        { text: { en: "Measure the tangent-chord angle with a protractor and stop there", af: "Meet die raaklyn–koord-hoek met 'n gradeboog en stop daar" } },
      ],
      hints: [
        { en: "Look back at the last round — which single line brought TWO free right angles into the picture at once?",
          af: "Kyk terug na die vorige rondte — watter enkele lyn het TWEE verniet-regte-hoeke gelyktydig in die prentjie gebring?" },
        { en: "The diameter from the point of tangency. Same tool, the other side of the chord: draw TD.",
          af: "Die middellyn vanaf die raakpunt. Dieselfde hulpmiddel, die ander kant van die koord: trek TD." },
      ],
      reason: "construction",
      note: {
        en: "Same tool as the last round, whichever side of the chord the angle sits on: draw the diameter from T. It still hands you two free right angles — tan ⊥ diameter at T, and the angle in a semicircle at the third point — no matter which tangent ray the angle is measured from.",
        af: "Dieselfde hulpmiddel as die vorige rondte, ongeag aan watter kant van die koord die hoek sit: trek die middellyn vanaf T. Dit gee jou steeds twee verniet-regte-hoeke — raaklyn ⊥ middellyn by T, en die hoek in 'n halfsirkel by die derde punt — ongeag van watter raaklynstraal die hoek gemeet word.",
      },
    },

    /* ---------- 2 · THE TRAP — sprung, already drawn ---------- */
    {
      type: "choice",
      prompt: {
        en: "A classmate got the first step right: the diameter TD is down, and 90° between the tangent and TD is marked. Then they joined B to Q — another point on the circle — shown here, instead of joining D to B. It IS a legal construction (B and Q both already exist). Does it actually reach the second 90° this proof needs though?",
        af: "'n Klasmaat het die eerste stap reg gekry: die middellyn TD is af, en 90° tussen die raaklyn en TD is gemerk. Toe het hulle B aan Q verbind — nog 'n punt op die sirkel — hier gewys, in plaas daarvan om D aan B te verbind. Dit IS 'n wettige konstruksie (B en Q bestaan albei reeds). Bereik dit egter werklik die tweede 90° wat hierdie bewys nodig het?",
      },
      diagram: FIG_TRAP,
      options: [
        { text: { en: "No — BQ never touches D, so the diameter's guaranteed semicircle angle never appears anywhere useful", af: "Nee — BQ raak nooit D nie, dus verskyn die middellyn se gewaarborgde halfsirkel-hoek nêrens nuttig nie" }, correct: true },
        { text: { en: "Yes — angle in a semicircle now applies to triangle TBQ instead", af: "Ja — hoek in 'n halfsirkel geld nou vir driehoek TBQ in plaas daarvan" } },
        { text: { en: "Yes — BQ is a radius, so it's automatically equal to OT", af: "Ja — BQ is 'n radius, dus outomaties gelyk aan OT" } },
        { text: { en: "No — because the diameter isn't actually perpendicular to the tangent in this picture", af: "Nee — omdat die middellyn nie werklik loodreg op die raaklyn in hierdie prentjie is nie" } },
      ],
      hints: [
        { en: "The angle-in-a-semicircle theorem needs a triangle with the DIAMETER'S two endpoints as two of its vertices. Does triangle TBQ have T and D as two of its corners?",
          af: "Die hoek-in-'n-halfsirkel-stelling het 'n driehoek nodig met die MIDDELLYN se twee eindpunte as twee van sy hoekpunte. Het driehoek TBQ T en D as twee van sy hoeke?" },
        { en: "No — triangle TBQ never uses D at all. The 90° at T is real (tan ⊥ diameter), but it's the WRONG 90° for finishing this proof; the semicircle's 90° only ever shows up at a point joined to BOTH ends of the diameter.",
          af: "Nee — driehoek TBQ gebruik nooit D nie. Die 90° by T is eg (raaklyn ⊥ middellyn), maar dit is die VERKEERDE 90° om hierdie bewys te voltooi; die halfsirkel se 90° verskyn net ooit by 'n punt wat aan ALBEI eindpunte van die middellyn verbind is." },
      ],
      reason: "construction",
      note: {
        en: "Being legal and being USEFUL are two different things. BQ is an honest chord — but it never touches D, so it can never trigger the angle-in-a-semicircle theorem, which needs a triangle built on BOTH ends of the diameter. The 90° already marked at T is real, but it's the wrong one to finish with: this proof needs a SECOND right angle, at the point joined to D. This is the classic trap of this construction: the diameter looks done, so it feels like any next line will do.",
        af: "Om wettig te wees en om NUTTIG te wees is twee verskillende dinge. BQ is 'n eerlike koord — maar dit raak nooit D nie, dus kan dit nooit die hoek-in-'n-halfsirkel-stelling ontketen nie, wat 'n driehoek benodig wat op ALBEI eindpunte van die middellyn gebou is. Die 90° wat reeds by T gemerk is, is eg, maar dis die verkeerde een om mee klaar te maak: hierdie bewys benodig 'n TWEEDE regte hoek, by die punt wat aan D verbind is. Dit is die klassieke strik van hierdie konstruksie: die middellyn lyk klaar, dus voel dit of enige volgende lyn sal werk.",
      },
    },

    /* ---------- 3 · the correct construction, compressed ---------- */
    {
      type: "choice",
      prompt: {
        en: "Back to the correct join: D has been joined to B, closing the triangle. The tangent-chord angle is 35° (given, marked), tan ⊥ diameter gives 90° at T (marked), so ∠DTB = 90° − 35° = 55° (marked) — and the angle in a semicircle gives a second 90°, at B (marked). Triangle TDB's angles sum to 180°. What is ∠TDB, and what does that tell you?",
        af: "Terug na die regte verbinding: D is aan B verbind, wat die driehoek sluit. Die raaklyn–koord-hoek is 35° (gegee, gemerk), raaklyn ⊥ middellyn gee 90° by T (gemerk), dus ∠DTB = 90° − 35° = 55° (gemerk) — en die hoek in 'n halfsirkel gee 'n tweede 90°, by B (gemerk). Driehoek TDB se hoeke tel op tot 180°. Wat is ∠TDB, en wat vertel dit jou?",
      },
      diagram: FIG_CORRECT,
      options: [
        { text: { en: "∠TDB = 180° − 55° − 90° = 35° — exactly the tangent-chord angle you started with", af: "∠TDB = 180° − 55° − 90° = 35° — presies die raaklyn–koord-hoek waarmee jy begin het" }, correct: true },
        { text: { en: "∠TDB = 55°, the same as ∠DTB", af: "∠TDB = 55°, dieselfde as ∠DTB" } },
        { text: { en: "∠TDB = 145°, the supplementary angle instead", af: "∠TDB = 145°, die supplementêre hoek in plaas daarvan" } },
        { text: { en: "∠TDB can't be pinned down without measuring it directly", af: "∠TDB kan nie vasgepen word sonder om dit direk te meet nie" } },
      ],
      hints: [
        { en: "You have two of the triangle's three angles marked: 55° and 90°. The third is whatever's left of 180°.",
          af: "Jy het twee van die driehoek se drie hoeke gemerk: 55° en 90°. Die derde is wat ook al van 180° oorbly." },
        { en: "180° − 55° − 90° = 35°. Same as the last round: the construction hands the tangent-chord angle straight back to itself, at a point in the alternate segment — this time on the other side.",
          af: "180° − 55° − 90° = 35°. Dieselfde as die vorige rondte: die konstruksie gee die raaklyn–koord-hoek reguit terug aan homself, by 'n punt in die oorstaande segment — hierdie keer aan die ander kant." },
      ],
      reason: "tanChord",
      note: {
        en: "∠TDB = 180° − 55° − 90° = 35° — exactly the tangent-chord angle this round started with. The picture flipped to the other side of the chord, the numbers are new, but the result is exactly what the last round proved: the tangent-chord angle always equals the angle in the alternate segment, whichever side you measure it from.",
        af: "∠TDB = 180° − 55° − 90° = 35° — presies die raaklyn–koord-hoek waarmee hierdie rondte begin het. Die prentjie het na die ander kant van die koord omgeswaai, die getalle is nuut, maar die resultaat is presies wat die vorige rondte bewys het: die raaklyn–koord-hoek is altyd gelyk aan die hoek in die oorstaande segment, ongeag van watter kant jy dit meet.",
      },
    },

    /* ---------- 4 · error-spotting: right conclusion, one wrong reason ---------- */
    {
      type: "choice",
      prompt: {
        en: "This solution reaches the right conclusion, ∠TDB = 35° — but one line has the WRONG reason written next to it. Which one?",
        af: "Hierdie oplossing kom by die regte gevolgtrekking uit, ∠TDB = 35° — maar een reël het die VERKEERDE rede langsaan geskryf. Watter een?",
      },
      diagram: FIG_CORRECT,
      solution: {
        caption: SOL_CAP,
        lines: [
          { st: "∠STD = 90°", rs: { en: "tan ⊥ diameter", af: "raaklyn ⊥ middellyn" } },
          { st: "∠DTB = 90° − 35° = 55°" },
          { st: "∠TBD = 90°", rs: { en: "tan ⊥ diameter", af: "raaklyn ⊥ middellyn" } },
          { st: "∠TDB = 180° − 90° − 55° = 35°", rs: { en: "Int ∠s Δ", af: "binne ∠e Δ" } },
          { st: "∴ ∠TDB = ∠STB (both 35°)" },
        ],
      },
      options: [
        { text: { en: "∠TBD = 90°   (tan ⊥ diameter)", af: "∠TBD = 90°   (raaklyn ⊥ middellyn)" }, correct: true },
        { text: { en: "∠STD = 90°   (tan ⊥ diameter)", af: "∠STD = 90°   (raaklyn ⊥ middellyn)" } },
        { text: { en: "∠DTB = 90° − 35° = 55°", af: "∠DTB = 90° − 35° = 55°" } },
        { text: { en: "∠TDB = 180° − 90° − 55° = 35°   (Int ∠s Δ)", af: "∠TDB = 180° − 90° − 55° = 35°   (binne ∠e Δ)" } },
      ],
      hints: [
        { en: "This proof uses TWO different 90°s, from TWO different theorems. Check each one is credited to the theorem that actually produces it — one of them has borrowed the OTHER one's reason.",
          af: "Hierdie bewys gebruik TWEE verskillende 90°'e, van TWEE verskillende stellings. Kyk of elkeen aan die stelling gekrediteer word wat dit werklik lewer — een van hulle het die ANDER een se rede geleen." },
        { en: "∠STD = 90° really is \"tan ⊥ diameter\" (T is where the tangent touches). But ∠TBD = 90° is at B, nowhere near the tangent — that one is \"∠s in semi-circle\", not \"tan ⊥ diameter\".",
          af: "∠STD = 90° is werklik \"raaklyn ⊥ middellyn\" (T is waar die raaklyn raak). Maar ∠TBD = 90° is by B, nêrens naby die raaklyn nie — daardie een is \"∠ in halwe sirkel\", nie \"raaklyn ⊥ middellyn\" nie." },
      ],
      reason: "semiCircle",
      note: {
        en: "∠TBD = 90° is correct, but \"tan ⊥ diameter\" is the wrong reason for it — that theorem only ever produces a right angle AT the point of tangency, T. ∠TBD sits at B, a point on the circle seeing the diameter TD from the outside — that is \"∠s in semi-circle\", a different theorem that happens to also give 90° here.",
        af: "∠TBD = 90° is korrek, maar \"raaklyn ⊥ middellyn\" is die verkeerde rede daarvoor — daardie stelling lewer net ooit 'n regte hoek BY die raakpunt, T. ∠TBD sit by B, 'n punt op die sirkel wat die middellyn TD van buite af sien — dit is \"∠ in halwe sirkel\", 'n ander stelling wat toevallig ook hier 90° gee.",
      },
    },

    /* ---------- 5 · the legal-constructions thread, continued ---------- */
    {
      type: "choice",
      prompt: {
        en: "Partway through this proof, a learner wants to draw ONE new line to help. Only one of these four moves is actually allowed. Which construction is legal?",
        af: "Halfpad deur hierdie bewys wil 'n leerder EEN nuwe lyn teken om te help. Net een van hierdie vier skuiwe is werklik toegelaat. Watter konstruksie is wettig?",
      },
      diagram: FIG_LEGAL,
      options: [
        { text: { en: "Draw the diameter TD, from the point of tangency", af: "Trek die middellyn TD, vanaf die raakpunt" }, correct: true },
        { text: { en: "Draw a line through B parallel to the tangent", af: "Teken 'n lyn deur B ewewydig aan die raaklyn" } },
        { text: { en: "Construct a second tangent to the circle at B", af: "Konstrueer 'n tweede raaklyn aan die sirkel by B" } },
        { text: { en: "Assume ∠TDB = 35° first, then use that to finish the proof", af: "Neem eers aan ∠TDB = 35°, gebruik dit dan om die bewys klaar te maak" } },
      ],
      hints: [
        { en: "A legal move only ever uses points that ALREADY exist — join two of them, or draw a diameter through the centre and a point you already have. Which one of these four does only that?",
          af: "'n Wettige skuif gebruik net punte wat REEDS bestaan — verbind twee van hulle, of trek 'n middellyn deur die middelpunt en 'n punt wat jy reeds het. Watter een van hierdie vier doen net dit?" },
        { en: "T, O and the circle already exist — the diameter through T uses nothing new. The other three all hand you something nobody has proven yet: a line that never meets another (parallel), a line that touches the circle only once at a SECOND point (tangent at B), or — worst of all — the exact result the proof is trying to reach.",
          af: "T, O en die sirkel bestaan reeds — die middellyn deur T gebruik niks nuuts nie. Die ander drie gee jou almal iets wat niemand nog bewys het nie: 'n lyn wat nooit 'n ander ontmoet nie (parallel), 'n lyn wat die sirkel net een keer raak by 'n TWEEDE punt (raaklyn by B), of — die ergste van almal — die presiese resultaat wat die bewys probeer bereik." },
      ],
      reason: "construction",
      note: {
        en: "A diameter through a point you already have is always allowed — T, O and the circle give you TD for free, a guaranteed true line. The other three all smuggle in something extra: that two lines never meet (parallel), that a NEW line touches the circle only once (a second tangent, at B), or the exact result the proof is trying to reach, assumed up front. That last one is the sneakiest, because it FEELS like a shortcut. The classroom rule says it best: \"When we assume, we make an ass out of u and me.\"",
        af: "'n Middellyn deur 'n punt wat jy reeds het, is altyd toegelaat — T, O en die sirkel gee jou TD verniet, 'n gewaarborgde ware lyn. Die ander drie smokkel almal iets ekstra in: dat twee lyne nooit ontmoet nie (parallel), dat 'n NUWE lyn die sirkel net een keer raak ('n tweede raaklyn, by B), of die presiese resultaat wat die bewys probeer bereik, vooraf aangeneem. Daardie laaste een is die slinksste, want dit VOEL soos 'n kortpad. Die klaskamerreël sê dit die beste: \"When we assume, we make an ass out of u and me.\"",
      },
    },

    /* ---------- 6 · recap — the trap named, the result unchanged ---------- */
    {
      type: "note",
      prompt: { en: "What actually transferred", af: "Wat werklik oorgedra het" },
      diagram: FIG_CORRECT,
      note: {
        en: "The chord flipped to the other side of the tangent, the numbers are new — and the construction still did not care: draw the diameter from the point of tangency, chase two free right angles through a triangle, and the tangent-chord angle lands back on itself. Joining B to some OTHER point on the circle instead of to D (an honest mistake) is perfectly legal, and perfectly useless, because it never touches the diameter's own far end — no triangle, no guaranteed second 90°, no proof.<br><br>The tangent-chord angle always equals the angle in the alternate segment — on either side of the chord, every time.",
        af: "Die koord het na die ander kant van die raaklyn geswaai, die getalle is nuut — en die konstruksie het steeds nie omgegee nie: trek die middellyn vanaf die raakpunt, jaag twee verniet-regte-hoeke deur 'n driehoek, en die raaklyn–koord-hoek land terug op homself. Om B aan 'n ANDER punt op die sirkel te verbind in plaas van aan D ('n eerlike fout) is heeltemal wettig, en heeltemal nutteloos, want dit raak nooit die middellyn se eie verste punt nie — geen driehoek, geen gewaarborgde tweede 90°, geen bewys.<br><br>Die raaklyn–koord-hoek is altyd gelyk aan die hoek in die oorstaande segment — aan enige kant van die koord, elke keer.",
      },
    },

  ],
};
