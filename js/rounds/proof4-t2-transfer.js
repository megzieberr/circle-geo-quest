/* Proof rounds P4 — "T2 transfer: reflex and the bowtie"
   (PROOF-ROUNDS-PLAN.md, session 3 — the T2 arc.)
   ------------------------------------------------------------------------
   pr3 (proof3-t2-discovery.js) built ONE construction on the standard
   picture: draw the diameter through P, get two isosceles triangles,
   double each base angle with the exterior angle theorem, add. This round
   carries that construction across the theorem's two trickier pictures —
   P on the SHORT arc (the reflex case) and TWO circumference points
   sharing one arc (the bowtie) — so the punchline lands as an experience:
   the five steps never blink, only which angle at O the answer lands on.

   SIX PANELS, all taps, same renderInvestigate() as pr0-pr3 — no new
   panel type, no typed answers:
     1 · choice — reflex picture, restated with the SAME letters (A, B, P,
         O — round03-centre-circumference.js's own reflex figure, reused
         letter-for-letter). "What's the first move?" Warms up the
         transfer before the punchline in panel 2.
     2 · choice — reflex picture, the construction complete: x, y, 2x, 2y
         all marked exactly as pr3 taught. Same arithmetic, but WHICH
         angle at O does 2x + 2y actually trace out this time? The reflex
         one — because P sits on the short arc, so Q lands on the far side.
     3 · choice — the bowtie: the same chord AB, two circumference points
         C and D sharing the far arc, both proofs landing on the SAME
         central angle. If the five steps land on half of the same number
         twice, what must be true of ∠ACB and ∠ADB? (Equal — this is the
         deeper reason behind "angles in the same segment", met earlier
         in the quest on discover-same-segment.js's own picture.)
     4 · choice — error-spotting (invest04-prove-it.js's DNA, pr2 panel 4's
         shape): a learner's solution on the reflex picture reaches the
         right numbers with ONE line's reason mismatched (a doubled angle
         credited to "∠s opp equal sides" instead of "ext ∠ of Δ").
         `solution.lines[].st` is symbol-only throughout — every English
         word lives in `rs` (a short reason TAG) or in the panel's own
         bilingual `prompt`/`note`, never inside `st`.
     5 · choice — the legal-constructions thread, continued from pr2 with
         DIFFERENT specific moves (not a clone of pr2's four options): this
         time the trap is assuming the theorem's own conclusion partway
         through its own proof. Carries the catchphrase, VERBATIM ENGLISH
         in both language versions — used ONCE in this build (pr2 already
         used it once for T1; this is its one appearance for T2).
     6 · note   — recap: three pictures, one set of five steps. A small
         `diagrams` gallery (discover-line-centre.js's two-mini-figure
         convention) puts standard/reflex/bowtie side by side. Last panel.

   GEOMETRY — reused, not invented, and NEW orientations so the letters
   keep meaning what they meant last time they were used, rather than
   colliding with pr3's roles for them:
     · Reflex picture — A:160, B:20, P:90 are round03-centre-circumference.js's
       OWN exact reflex figure (its q5/q6 diagrams), reused letter-for-
       letter: the class already met ∠APB = 110° ⇒ reflex ∠AOB = 220° on
       the main quest map, and this round shows the proof behind that
       exact number rather than a new one. Q (this round's addition, same
       ROLE as pr3's Q) is P's antipode, 90 + 180 = 270.
     · Bowtie picture — A:216, B:324, C:52, D:128 are discover-same-
       segment.js's own exact handle values (its MODEL()'s `init` numbers
       for A, B, P, Q) — the identical picture the class dragged on the
       main quest and met again in Investigation Station 2. Relabelled P,Q
       → C,D here on purpose: this round's OWN "P, Q" already names the
       diameter pair in panels 1-2 and 4-5, and reusing them for a second,
       unrelated pair of points in panel 3 would collide mid-round. C, D
       are the names the class actually saw on screen for this picture:
       bowtie-intro.js's cutscene (⋈, chord AB, points C and D below it).

   Every angle mark is an exact integer, same reasoning as pr3's header
   (O-vertex angles are plain degree subtraction; base angles follow from
   the isosceles apex-angle formula; nothing here is a rounded estimate):
     Reflex — apex ∠AOP = |160−90| = 70°  →  x = (180−70)/2 = 55°
              apex ∠BOP = |90−20| = 70°   →  y = (180−70)/2 = 55°
              ∠AOQ = 180−70 = 110° = 2x     ∠BOQ = 180−70 = 110° = 2y
              reflex ∠AOB = 2x + 2y = 220° = 2 × ∠APB (110°)
     Bowtie — ∠AOB (central) = |324−216| = 108°
              C(52), D(128) both sit outside [216,324] ⇒ both on the arc
              NOT containing the minor arc ⇒ ∠ACB = ∠ADB = 108° ÷ 2 = 54° */

const AC = "#9c36b5";

/* ---- panels 1: the reflex claim, before the construction ----
   Identical shape/letters to round03-centre-circumference.js's own reflex
   diagram: O, A, B, P, with ∠APB = 110° given and marked. No angle at O
   yet — the engine always draws the SMALLER sweep between two legs, so a
   reflex angle can never be marked directly; that is exactly why this
   round has to build it via the diameter instead. */
const FIG_REFLEX_CLAIM = {
  O: true,
  pts: { A: 160, B: 20, P: 90 },
  chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]],
  angles: [{ at: "P", legs: ["A", "B"], t: "110°", o: { v: 110 } }],
};

/* ---- panel 2 (+ reused on panel 4): the reflex construction, complete ----
   Q added (P's antipode), radii ticked, x/y at P and 2x/2y at O all
   marked — the full picture the "combine" question and the error-spot
   panel both work from. */
const FIG_REFLEX_CONSTRUCT = {
  O: true,
  pts: { A: 160, B: 20, P: 90, Q: 270 },
  chords: [
    { a: "O", b: "P", mk: "t1" },
    { a: "O", b: "Q", mk: "t1" },
    { a: "O", b: "A", mk: "t1" },
    { a: "O", b: "B", mk: "t1" },
    ["P", "A"], ["P", "B"],
  ],
  angles: [
    { at: "P", legs: ["O", "A"], t: "x", o: { v: 55 } },
    { at: "P", legs: ["O", "B"], t: "y", o: { v: 55 } },
    { at: "O", legs: ["A", "Q"], t: "2x", o: { v: 110 } },
    { at: "O", legs: ["B", "Q"], t: "2y", o: { v: 110 } },
  ],
};

/* ---- panel 3: the bowtie — one chord, two circumference points ---- */
const FIG_BOWTIE = {
  O: true,
  pts: { A: 216, B: 324, C: 52, D: 128 },
  chords: [
    ["A", "B"], ["O", "A"], ["O", "B"],
    ["C", "A"], ["C", "B"], ["D", "A"], ["D", "B"],
  ],
  angles: [
    { at: "O", legs: ["A", "B"], t: "108°", o: { v: 108 } },
    { at: "C", legs: ["A", "B"], t: "", o: { v: 54 } },
    { at: "D", legs: ["A", "B"], t: "", o: { v: 54 } },
  ],
};

/* ---- panel 5: bare reflex figure — the legal-constructions panel.
   Nothing constructed yet: the question is which NEW line may be drawn. */
const FIG_REFLEX_BARE = {
  O: true,
  pts: { A: 160, B: 20, P: 90 },
  chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]],
};

/* ---- panel 6: the recap gallery — three pictures, side by side ---- */
const MINI_STANDARD = {
  O: true,
  pts: { A: 230, B: 310, P: 90 },
  chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]],
  angles: [
    { at: "O", legs: ["A", "B"], t: "2(x+y)", o: { v: 80 } },
    { at: "P", legs: ["A", "B"], t: "x+y", o: { v: 40 } },
  ],
};
const MINI_REFLEX = {
  O: true,
  pts: { A: 160, B: 20, P: 90 },
  chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]],
  angles: [{ at: "P", legs: ["A", "B"], t: "110°", o: { v: 110 } }],
};
const MINI_BOWTIE = {
  O: true,
  pts: { A: 216, B: 324, C: 52, D: 128 },
  chords: [["A", "B"], ["C", "A"], ["C", "B"], ["D", "A"], ["D", "B"]],
  angles: [
    { at: "C", legs: ["A", "B"], t: "", o: { v: 54 } },
    { at: "D", legs: ["A", "B"], t: "", o: { v: 54 } },
  ],
};

const SOL_CAP = { en: "A learner's solution", af: "'n Leerder se oplossing" };

export const round = {
  id: "pr4", n: 0, accent: AC, kind: "proof", group: "g7",
  title: { en: "T2 transfer: reflex and the bowtie", af: "T2-oordrag: inspringende hoek en die strikdas" },
  blurb: {
    en: "Same five steps, a reflex angle and two circumference points sharing an arc — plus the trap of assuming what you haven't proven.",
    af: "Dieselfde vyf stappe, 'n inspringende hoek en twee omtrekpunte wat een boog deel — en die strik om aan te neem wat jy nie bewys het nie.",
  },
  panels: [

    /* ---------- 1 · reflex, restated — the first move ---------- */
    {
      type: "choice",
      prompt: {
        en: "A new picture: P now sits on the SHORT arc between A and B, and ∠APB = 110° (given, marked). We want the REFLEX angle ∠AOB — the one that goes the long way round, not the small one. What is the first move — the one construction that survives every version of this proof?",
        af: "'n Nuwe prentjie: P sit nou op die KORT boog tussen A en B, en ∠APB = 110° (gegee, gemerk). Ons soek die INSPRINGENDE hoek ∠AOB — dié een wat die lang pad om gaan, nie die klein een nie. Wat is die eerste stap — die een konstruksie wat elke weergawe van hierdie bewys oorleef?",
      },
      diagram: FIG_REFLEX_CLAIM,
      options: [
        { text: { en: "Extend PO straight through O until it meets the circle again, at Q", af: "Verleng PO reguit deur O totdat dit weer die sirkel ontmoet, by Q" }, correct: true },
        { text: { en: "Join OA and OB, and stop there without extending anything further", af: "Verbind OA en OB, en stop daar sonder om iets verder te verleng" } },
        { text: { en: "Measure ∠AOB directly with a protractor and compare it to ∠APB", af: "Meet ∠AOB direk met 'n gradeboog en vergelyk dit met ∠APB" } },
        { text: { en: "Construct a tangent to the circle at P and work from that instead", af: "Konstrueer 'n raaklyn aan die sirkel by P en werk daarvandaan verder" } },
      ],
      hints: [
        { en: "Look back at the last round — what did we draw there to turn one circumference point into two isosceles triangles?",
          af: "Kyk terug na die vorige rondte — wat het ons daar geteken om een omtrekpunt in twee gelykbenige driehoeke te verander?" },
        { en: "The diameter through P. It doesn't matter that P is now on the short arc instead of the long one — same tool, same two isosceles triangles.",
          af: "Die middellyn deur P. Dit maak nie saak dat P nou op die kort boog is in plaas van die lang een nie — dieselfde hulpmiddel, dieselfde twee gelykbenige driehoeke." },
      ],
      reason: "construction",
      note: {
        en: "Same tool as every picture in this theorem: extend the radius OP straight through the centre to the far side of the circle, at Q. The picture looks trickier — P is tucked onto the short arc — but the construction doesn't care.",
        af: "Dieselfde hulpmiddel as elke prentjie in hierdie stelling: verleng die radius OP reguit deur die middelpunt na die verste kant van die sirkel, by Q. Die prentjie lyk moeiliker — P sit op die kort boog — maar die konstruksie gee nie om nie.",
      },
    },

    /* ---------- 2 · reflex, the punchline ---------- */
    {
      type: "choice",
      prompt: {
        en: "The diameter is drawn, the two isosceles triangles give x and y (marked), and the exterior angle theorem doubles each one at O — ∠AOQ = 2x = 110°, ∠BOQ = 2y = 110°, exactly as before. Add them together. What do you get, and which angle actually is it?",
        af: "Die middellyn is getrek, die twee gelykbenige driehoeke gee x en y (gemerk), en die buitehoekstelling verdubbel elkeen by O — ∠AOQ = 2x = 110°, ∠BOQ = 2y = 110°, presies soos voorheen. Tel hulle bymekaar. Wat kry jy, en watter hoek is dit eintlik?",
      },
      diagram: FIG_REFLEX_CONSTRUCT,
      options: [
        { text: { en: "2x + 2y = 220° — the REFLEX angle ∠AOB, because Q sits on the far side from P", af: "2x + 2y = 220° — die INSPRINGENDE hoek ∠AOB, want Q sit aan die verste kant van P af" }, correct: true },
        { text: { en: "2x + 2y = 220° — the small (non-reflex) angle ∠AOB, the one on the near side of the diameter", af: "2x + 2y = 220° — die klein (nie-inspringende) hoek ∠AOB, die een aan die naaste kant van die middellyn" } },
        { text: { en: "x + y = 110°, the same number as ∠APB, so no doubling is needed here", af: "x + y = 110°, dieselfde getal as ∠APB, dus is geen verdubbeling hier nodig nie" } },
        { text: { en: "2x − 2y = 0°, since x and y turned out equal this time", af: "2x − 2y = 0°, aangesien x en y hierdie keer gelyk uitgekom het" } },
      ],
      hints: [
        { en: "The arithmetic is identical to last round — add the two doubled pieces. The real question is which angle at O that sum actually traces out. Follow the arc from A, past Q, to B — is that the short way round, or the long way?",
          af: "Die rekenwerk is presies dieselfde as verlede rondte — tel die twee verdubbelde stukke bymekaar. Die regte vraag is watter hoek by O daardie som eintlik uitteken. Volg die boog van A, verby Q, na B — is dit die kort pad om, of die lang pad?" },
        { en: "Q sits on the far side of the circle from P — and P is the one tucked onto the short arc. So tracing A → Q → B goes the LONG way round: 220° is the reflex angle ∠AOB.",
          af: "Q sit aan die verste kant van die sirkel van P af — en P is die een op die kort boog. Dus volg A → Q → B die LANG pad om: 220° is die inspringende hoek ∠AOB." },
      ],
      reason: "centreDouble",
      note: {
        en: "The five steps never changed — diameter, isosceles triangles, exterior angle, add. What changed is which angle at O the answer lands on: with P on the short arc, Q lands on the far side, and 2x + 2y = 220° traces out the REFLEX ∠AOB, not the small one. Reflex ∠AOB = 2 × ∠APB = 2 × 110° = 220° — the exact rule from the main quest, now with the proof behind it.",
        af: "Die vyf stappe het nooit verander nie — middellyn, gelykbenige driehoeke, buitehoek, tel bymekaar. Wat verander het, is watter hoek by O die antwoord uitteken: met P op die kort boog, beland Q aan die verste kant, en 2x + 2y = 220° teken die INSPRINGENDE ∠AOB uit, nie die klein een nie. Inspringende ∠AOB = 2 × ∠APB = 2 × 110° = 220° — presies dieselfde reël uit die hoofsoektog, nou met die bewys daaragter.",
      },
    },

    /* ---------- 3 · the bowtie — the same five steps, twice ---------- */
    {
      type: "choice",
      prompt: {
        en: "A third picture: the same chord AB, but now TWO circumference points, C and D, on the same arc. ∠AOB at the centre is 108° — the same 108° either way you look at it, because it's the same chord, the same centre, the same angle. If you ran the exact same five steps once using C, and once using D, both landing on that SAME 108°, what must be true about ∠ACB and ∠ADB?",
        af: "'n Derde prentjie: dieselfde koord AB, maar nou TWEE omtrekpunte, C en D, op dieselfde boog. ∠AOB by die middelpunt is 108° — dieselfde 108° hoe jy dit ook al bekyk, want dis dieselfde koord, dieselfde middelpunt, dieselfde hoek. As jy presies dieselfde vyf stappe een keer met C, en een keer met D uitvoer, en albei op daardie SELFDE 108° beland — wat moet waar wees van ∠ACB en ∠ADB?",
      },
      diagram: FIG_BOWTIE,
      options: [
        { text: { en: "They're equal — each one is half of the same 108°, so both are 54°", af: "Hulle is gelyk — elkeen is die helfte van dieselfde 108°, dus is albei 54°" }, correct: true },
        { text: { en: "∠ACB is bigger, because C is farther from B", af: "∠ACB is groter, omdat C verder van B af is" } },
        { text: { en: "There's no way to tell without measuring", af: "Daar is geen manier om te weet sonder om te meet nie" } },
        { text: { en: "They add up to 108°", af: "Hulle tel op tot 108°" } },
      ],
      hints: [
        { en: "Both proofs end the same way: [angle at circumference] = half of [the same 108°]. If two things both equal half of the exact same number, how do they compare to each other?",
          af: "Albei bewyse eindig dieselfde manier: [hoek by omtrek] = die helfte van [dieselfde 108°]. As twee dinge albei gelyk is aan die helfte van presies dieselfde getal, hoe vergelyk hulle met mekaar?" },
        { en: "Half of 108° is 54°, twice over — once from C's proof, once from D's. ∠ACB = ∠ADB = 54°.",
          af: "Die helfte van 108° is 54°, twee keer — een keer uit C se bewys, een keer uit D s'n. ∠ACB = ∠ADB = 54°." },
      ],
      reason: "sameSeg",
      note: {
        en: "This is the deeper reason behind a rule from earlier in the quest: angles in the same segment are equal. It was never a separate trick — it's this same theorem, run twice on the same central angle. Whatever point you pick on that arc, the five steps always land on half of the same ∠AOB.",
        af: "Dit is die dieper rede agter 'n reël van vroeër in die soektog: hoeke in dieselfde segment is gelyk. Dit was nooit 'n aparte kunsie nie — dis hierdie selfde stelling, twee keer uitgevoer op dieselfde middelpuntshoek. Watter punt jy ook al op daardie boog kies, die vyf stappe beland altyd op die helfte van dieselfde ∠AOB.",
      },
    },

    /* ---------- 4 · error-spotting: right numbers, wrong reason on one line ---------- */
    {
      type: "choice",
      prompt: {
        en: "This learner's solution is checking the reflex picture. One line has the WRONG reason written next to it — the maths on that line is still correct, only the reason is mismatched. Which line?",
        af: "Hierdie leerder se oplossing gaan oor die inspringende prentjie. Een reël het die VERKEERDE rede langsaan geskryf — die wiskunde op daardie reël is nog korrek, net die rede pas nie. Watter reël?",
      },
      diagram: FIG_REFLEX_CONSTRUCT,
      solution: {
        caption: SOL_CAP,
        lines: [
          { st: "OP = OA = OB", rs: { en: "radii", af: "radii" } },
          { st: "∠OPA = ∠OAP = x", rs: { en: "∠s opp equal sides", af: "∠e teenoor gelyke sye" } },
          { st: "∠AOQ = 2x", rs: { en: "∠s opp equal sides", af: "∠e teenoor gelyke sye" } },
          { st: "∠BOQ = 2y", rs: { en: "ext ∠ of Δ", af: "buite ∠ van Δ" } },
          { st: "∴ reflex ∠AOB = 2x + 2y" },
        ],
      },
      options: [
        { text: { en: "∠AOQ = 2x   (∠s opp equal sides)", af: "∠AOQ = 2x   (∠e teenoor gelyke sye)" }, correct: true },
        { text: { en: "OP = OA = OB   (radii)", af: "OP = OA = OB   (radii)" } },
        { text: { en: "∠OPA = ∠OAP = x   (∠s opp equal sides)", af: "∠OPA = ∠OAP = x   (∠e teenoor gelyke sye)" } },
        { text: { en: "∠BOQ = 2y   (ext ∠ of Δ)", af: "∠BOQ = 2y   (buite ∠ van Δ)" } },
      ],
      hints: [
        { en: "Check each reason against what it actually needs. \"∠s opp equal sides\" only ever hands you two EQUAL angles inside one triangle — never a doubled one.",
          af: "Toets elke rede teen wat dit werklik nodig het. \"∠e teenoor gelyke sye\" gee jou net twee GELYKE hoeke binne een driehoek — nooit 'n verdubbelde een nie." },
        { en: "∠AOQ = 2x is a DOUBLED angle, produced by the exterior angle theorem — the reason should be \"ext ∠ of Δ\", not \"∠s opp equal sides\". That reason belongs on the line above it, where ∠OPA = ∠OAP really are two equal base angles.",
          af: "∠AOQ = 2x is 'n VERDUBBELDE hoek, deur die buitehoekstelling geproduseer — die rede moet \"buite ∠ van Δ\" wees, nie \"∠e teenoor gelyke sye\" nie. Daardie rede hoort op die reël bo dit, waar ∠OPA = ∠OAP werklik twee gelyke basishoeke is." },
      ],
      reason: "triExt",
      note: {
        en: "∠AOQ = 2x is correct maths, but \"∠s opp equal sides\" is the wrong reason for it — that reason only ever produces two EQUAL angles (like ∠OPA = ∠OAP on the line above), never a doubled one. A doubled angle at O, made from a straight line through P and O, is the exterior angle theorem: \"ext ∠ of Δ\".",
        af: "∠AOQ = 2x is korrekte wiskunde, maar \"∠e teenoor gelyke sye\" is die verkeerde rede daarvoor — daardie rede lewer net ooit twee GELYKE hoeke (soos ∠OPA = ∠OAP op die reël daarbo), nooit 'n verdubbelde een nie. 'n Verdubbelde hoek by O, gemaak uit 'n reguit lyn deur P en O, is die buitehoekstelling: \"buite ∠ van Δ\".",
      },
    },

    /* ---------- 5 · the legal-constructions thread, continued ---------- */
    {
      type: "choice",
      prompt: {
        en: "Partway through this proof, a learner wants to draw ONE new line to help. Only one of these four moves is actually allowed. Which construction is legal?",
        af: "Halfpad deur hierdie bewys wil 'n leerder EEN nuwe lyn teken om te help. Net een van hierdie vier skuiwe is werklik toegelaat. Watter konstruksie is wettig?",
      },
      diagram: FIG_REFLEX_BARE,
      options: [
        { text: { en: "Extend PO through O to meet the circle again at Q", af: "Verleng PO deur O totdat dit weer die sirkel ontmoet by Q" }, correct: true },
        { text: { en: "Construct a tangent to the circle at Q", af: "Konstrueer 'n raaklyn aan die sirkel by Q" } },
        { text: { en: "Draw a line through O parallel to PA", af: "Teken 'n lyn deur O ewewydig aan PA" } },
        { text: { en: "Assume ∠AOQ = 2 × ∠OPA first, then use that to finish the proof", af: "Neem eers aan ∠AOQ = 2 × ∠OPA, gebruik dit dan om die bewys klaar te maak" } },
      ],
      hints: [
        { en: "A legal move only ever uses points that ALREADY exist — join two of them, or extend a line through the centre to where it meets the circle again. Which one of these four does only that?",
          af: "'n Wettige skuif gebruik net punte wat REEDS bestaan — verbind twee van hulle, of verleng 'n lyn deur die middelpunt na waar dit weer die sirkel ontmoet. Watter een van hierdie vier doen net dit?" },
        { en: "Extending PO through O to where it meets the circle again uses only points you already have — P, O, and the circle itself. That's always allowed, it's just a diameter. The other three all hand you something nobody has proven yet: touching the circle once, running parallel, or — worst of all — the exact result the proof is trying to reach.",
          af: "Om PO deur O te verleng na waar dit weer die sirkel ontmoet, gebruik net punte wat jy reeds het — P, O, en die sirkel self. Dit is altyd toegelaat, dis net 'n middellyn. Die ander drie gee jou almal iets wat niemand nog bewys het nie: raak die sirkel net een keer, loop ewewydig, of — die ergste van almal — presies die resultaat wat die bewys probeer bereik." },
      ],
      reason: "construction",
      note: {
        en: "Extending a radius through the centre to its second meeting with the circle uses only points that already exist — that's always legal, it's just a diameter. The other three all smuggle something in: touching the circle exactly once (a tangent), running parallel forever, or assuming the very result you're trying to prove and working backwards from it. That last one is the sneakiest, because it FEELS like a shortcut. The classroom rule says it best: \"When we assume, we make an ass out of u and me.\"",
        af: "Om 'n radius deur die middelpunt te verleng na sy tweede ontmoeting met die sirkel, gebruik net punte wat reeds bestaan — dit is altyd wettig, dis net 'n middellyn. Die ander drie smokkel almal iets in: raak die sirkel presies een keer (raaklyn), loop vir ewig ewewydig, of neem die presiese resultaat aan wat jy probeer bewys en werk agteruit daarvandaan. Daardie laaste een is die stinksste, want dit VOEL soos 'n kortpad. Die klaskamerreël sê dit die beste: \"When we assume, we make an ass out of u and me.\"",
      },
    },

    /* ---------- 6 · recap — three pictures, one set of five steps ---------- */
    {
      type: "note",
      prompt: { en: "What actually transferred", af: "Wat werklik oorgedra het" },
      diagrams: [
        { diagram: MINI_STANDARD, caption: { en: "Standard — add", af: "Standaard — tel bymekaar" } },
        { diagram: MINI_REFLEX, caption: { en: "Reflex — same sum, far angle", af: "Inspringend — dieselfde som, ver hoek" } },
        { diagram: MINI_BOWTIE, caption: { en: "Bowtie — same steps, twice", af: "Strikdas — dieselfde stappe, twee keer" } },
      ],
      note: {
        en: "The picture changed three times — a clean split, a reflex angle, two points sharing an arc — and the five steps never blinked: draw the diameter through the circumference point, label the base angles, isosceles triangles from the radii, double each with the exterior angle theorem, add. That is the whole trick of a proof round: the tool travels. The picture never has to.",
        af: "Die prentjie het drie keer verander — 'n netjiese verdeling, 'n inspringende hoek, twee punte wat een boog deel — en die vyf stappe het nooit gehuiwer nie: trek die middellyn deur die omtrekpunt, merk die basishoeke, gelykbenige driehoeke uit die radiusse, verdubbel elkeen met die buitehoekstelling, tel bymekaar. Dit is die hele kuns van 'n bewysrondte: die hulpmiddel reis. Die prentjie hoef nooit nie.",
      },
    },

  ],
};
