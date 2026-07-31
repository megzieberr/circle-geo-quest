/* Investigation Station 4 — "Prove It"
   ------------------------------------------------------------------------
   The station Megan picked to build first, and the best test of whether typed
   answers work: three error-spotting choices, then the typed panels.

   ── REWRITTEN 2026-07-30 after she played it. Four findings:

   N12 · THE SOLUTION IS ON THE SCREEN NOW. Panel 1 asked "one line fell out —
   which line is missing?" and rendered no solution at all, so the only route
   through was to reverse-engineer it from the four options. Her words: "and
   which part is left out exactly? again, this is vague." All three of panels
   1-3 now render their working through `solution` (js/investigate.js), so the
   station reads alike throughout — panels 2 and 3 used to smuggle theirs into
   the option list, which is why only panel 1 was actually unanswerable.

   N12b · PANEL 1 SAYS WHAT THE WORKING IS FOR: "to find x". Her instinct was
   right that the goal was missing, but not that the goal was the diameter —
   "AB is a diameter" is the GIVEN, used to justify ∠ACB = 90°. The working
   finds x = ∠BAC = 40°, which is what FIG_GIVEN marks at A.

   N13 · A CLAIM GETS PROVED; A NUMBER GETS CALCULATED. Megan: "I have been
   hammering in my kids' heads that proof = converse… you prove something is a
   tangent, cyclic quad, diameter, parallel. I think proof here is a bit
   confusing." So panels 1-4 call what is on the screen a SOLUTION (AF
   *oplossing*) and its rows STATEMENTS AND REASONS. Her call on the station
   TITLE: "Prove It" stays for now — body copy first, and see whether it still
   grates. "Proof" is still the right word in inv1/inv3/inv5, which only ever
   use it for claims, and in inv6 panel 3.

   N15 · s4p4 IS SPLIT, and the split SETTLES N14 rather than needing it. N14
   was: the panel asked for a description and then marked her down for omitting
   a theorem NAME it never requested. Panel 4 now asks only what the shorter
   solution SPOTTED (its mark scheme drops the name line), and panel 5 asks
   which theorem did the work — as a TAP, deliberately not a second typed
   panel, because panel 6 (`s4p5`) already asks the learner to WRITE that
   reason in an accepted wording and two typed asks for the same words would be
   the same question twice. So the run is: notice it → identify it → write it
   the way a marker accepts it. Do NOT also loosen `s4p4` to accept a name; the
   panel no longer asks for one.

   ONE FIGURE THROUGHOUT, so the learner reads it once and then thinks about
   the reasoning rather than the picture:

     AB is a DIAMETER of the circle, centre O. C is on the circle.
     ∠ABC = 50°  →  ∠ACB = 90° (∠s in semi-circle)  →  ∠BAC = 40° (Int ∠s Δ)

   To scale: A at 180°, B at 0°, C at 80°.
     ∠ABC subtends arc AC (central 100°) → 50°   ✓
     ∠BAC subtends arc BC (central  80°) → 40°   ✓
     ∠ACB subtends arc AB (central 180°) → 90°   ✓
   Change a point and all three angles move together — do not hand-tune the
   labels, let the engine place them.

   The two `panelId`s below MUST match panel_memos.panel_id in phase16.sql.
   The memo lives server-side; a learner with devtools must not be able to
   read the answer out of this file. `memoDisplay` is the teaching text shown
   only after five misses, which is a different thing and safe to ship. */

const AC = "#0ea271";

/* ---- CHUNK D · tangent-radius — using it where there is no tangent at all ----
   Reuses the T/D/P geometry already verified for the discovery round
   `dtanrad` (TD a diameter, P on the circle, ∠TPD = 90° by the semicircle
   theorem) — no new interactive, and the angle is already known to scale.
   The point of the panel: TP and PD are chords, not a tangent, so "tan ⊥
   radius" cannot be the reason for this 90° no matter how tempting it
   looks. Appended after s4p5 rather than inserted earlier, matching the
   two-tangents session's call on Station 2: panels 1-6 here are one
   continuous argument (a solution to write, the way a marker accepts it)
   that should not be interrupted mid-flow. */
const TANRAD_ERR_FIG = {
  O: true,
  pts: { T: 270, D: 90, P: 175 },
  chords: [["T", "D"], ["P", "T"], ["P", "D"]],
  angles: [{ at: "P", legs: ["T", "D"], t: "", o: { v: 90, r: 34, mark: 1 } }],
};

/* ---- CHUNK D · tan-chord — the wrong alternate segment ----
   T:270, A:38 are the exact points already verified in data-tanchord.js
   (the "spot the theorem" mini-figure): tg+ leg gives a 64° tangent-chord
   angle at T, and any point on the far arc (e.g. P at 150) reads the same
   64° — that is the true alternate segment. Q at 350 sits on the NEAR arc
   instead, the same side the tangent ray (tg+) points into, so it is in
   the SAME segment as the tangent-chord angle, not the alternate one.
   Angles in the two segments of one chord are supplementary, so ∠TQA
   comes out at 116° — not 64° — which is exactly the number a learner who
   grabs the nearest point on the circle will get wrong. */
const TANCHORD_ERR_FIG = {
  pts: { T: 270, A: 38, Q: 350 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: [["T", "A"], ["T", "Q"], ["A", "Q"]],
  angles: [
    { at: "T", legs: ["tg+", "A"], t: "64°", o: { v: 64, r: 40 } },
    { at: "Q", legs: ["T", "A"], t: "", o: { v: 116, r: 34, mark: 1 } },
  ],
};

/* the shared figure, with whichever angles a given panel needs marked */
const FIG = (angles) => ({
  O: true,
  pts: { A: 180, B: 0, C: 80 },
  chords: [["A", "B"], ["A", "C"], ["B", "C"]],
  angles,
});

const FIG_GIVEN = FIG([
  { at: "B", legs: ["A", "C"], t: "50°", o: { v: 50, r: 40 } },
  { at: "A", legs: ["B", "C"], t: "x",   o: { v: 40, r: 40 } },
]);

const FIG_FULL = FIG([
  { at: "B", legs: ["A", "C"], t: "50°", o: { v: 50, r: 40 } },
  { at: "C", legs: ["A", "B"], t: "",    o: { v: 90, r: 34, mark: 1 } },
  { at: "A", legs: ["B", "C"], t: "40°", o: { v: 40, r: 40 } },
]);

/* the three statements the whole station works with, written once */
const L_GIVEN  = { st: "∠ABC = 50°",                   rs: { en: "given", af: "gegee" } };
const L_SEMI   = { st: "∠ACB = 90°",                   rs: { en: "∠s in semi-circle", af: "∠ in halwe sirkel" } };
const L_WORK   = { st: "∠BAC = 180° − 90° − 50°",      rs: { en: "Int ∠s Δ", af: "binne ∠e Δ" } };
const L_ANS    = { st: "∴ x = ∠BAC = 40°" };
const SOL_CAP  = { en: "A learner's solution", af: "'n Leerder se oplossing" };

export const round = {
  id: "inv4", n: 0, accent: AC, kind: "investigate", group: "g6",
  title: { en: "Prove It", af: "Bewys Dit" },
  blurb: {
    en: "Error Spotting. Three worked solutions — a missing line, a wrong reason, and a step that does nothing.",
    af: "Foutopsporing. Drie uitgewerkte oplossings — 'n ontbrekende reël, 'n verkeerde rede, en 'n stap wat niks doen nie.",
  },
  panels: [

    /* ---------- 1 · a line has been deleted ---------- */
    {
      type: "choice",
      prompt: {
        en: "AB is a diameter, and a learner wrote this solution to find x. One line fell out of it. Which line is missing?",
        af: "AB is 'n middellyn, en 'n leerder het hierdie oplossing geskryf om x te vind. Een reël het daaruit geval. Watter reël kort?",
      },
      diagram: FIG_GIVEN,
      solution: {
        caption: SOL_CAP,
        lines: [L_GIVEN, L_SEMI, { blank: 1 }, L_ANS],
      },
      note: {
        en: "The two given lines were there and the answer was there — the statement that does the arithmetic was missing. In the exam that is a lost mark even though the answer is right, because a marker follows the chain one statement at a time and cannot award a step that is not written down.",
        af: "Die twee gegewe reëls was daar en die antwoord was daar — die stelling wat die rekenwerk doen, het gekort. In die eksamen is dit 'n verlore punt al is die antwoord reg, want 'n nasiener volg die ketting een stelling op 'n slag en kan nie 'n stap toeken wat nie neergeskryf is nie.",
      },
      options: [
        { text: { en: "∠BAC = 180° − 90° − 50°   (Int ∠s Δ)", af: "∠BAC = 180° − 90° − 50°   (binne ∠e Δ)" }, correct: true },
        { text: { en: "∠ABC = 50°   (given)", af: "∠ABC = 50°   (gegee)" } },
        { text: { en: "OA = OC   (radii)", af: "OA = OC   (radii)" } },
        // 100° is TRUE for this figure (2 × ∠ABC, arc AC = 100°) — a true-but-
        // unused line, same status as OA = OC. It was 80° until 2026-07-31,
        // which is ∠BOC's value, so the distractor was false twice over.
        { text: { en: "∠AOC = 100°   (∠ at centre = 2 × ∠ at circumference)", af: "∠AOC = 100°   (Midpt∠ = 2 × Omtreks∠)" } },
      ],
      hints: [
        { en: "Read the solution as a chain: 50° and 90° are there, and 40° comes out at the end. What has to happen in between to get from those two numbers to 40°?",
          af: "Lees die oplossing as 'n ketting: 50° en 90° is daar, en 40° kom aan die einde uit. Wat moet tussenin gebeur om van daardie twee getalle by 40° te kom?" },
        { en: "One of the options is a line the solution already has, and two drag in the centre — radii and a centre angle the solution never uses. The missing one does the subtraction that turns 90° and 50° into 40°.",
          af: "Een van die opsies is 'n reël wat die oplossing reeds het, en twee sleep die middelpunt in — radii en 'n middelpuntshoek wat die oplossing nooit gebruik nie. Die ontbrekende een doen die aftrekking wat 90° en 50° in 40° verander." },
      ],
    },

    /* ---------- 2 · right answer, wrong reason ---------- */
    {
      type: "choice",
      prompt: {
        en: "This solution reaches 40°, which is correct. But one statement has the RIGHT value next to the WRONG reason. Which one?",
        af: "Hierdie oplossing kom by 40° uit, wat reg is. Maar een stelling het die REGTE waarde langs die VERKEERDE rede. Watter een?",
      },
      diagram: FIG_FULL,
      solution: {
        caption: SOL_CAP,
        lines: [
          L_GIVEN,
          // rendered as suspect-looking is NOT the point — the learner has to
          // find it. `bad` is not set: it would give the answer away.
          { st: "∠ACB = 90°", rs: { en: "∠s in the same seg", af: "∠e in dieselfde segment" } },
          { st: "∠BAC = 180° − 90° − 50° = 40°", rs: { en: "Int ∠s Δ", af: "binne ∠e Δ" } },
        ],
      },
      reason: "semiCircle",
      note: {
        en: "∠ACB is 90° because AB is a DIAMETER — that is the semi-circle theorem. \"∠s in the same seg\" is about two angles standing on the same chord from the same side, which is not what is happening here. This is the single biggest silent mark-loser in geometry papers: the number is right, so the line looks fine, and half the marks are gone.",
        af: "∠ACB is 90° omdat AB 'n MIDDELLYN is — dit is die halfsirkel-stelling. \"∠e in dieselfde segment\" gaan oor twee hoeke wat op dieselfde koord staan van dieselfde kant af, wat nie hier gebeur nie. Dit is die grootste stil puntverlies in meetkunde-vraestelle: die getal is reg, dus lyk die reël reg, en die helfte van die punte is weg.",
      },
      options: [
        { text: { en: "∠ACB = 90°   (∠s in the same seg)", af: "∠ACB = 90°   (∠e in dieselfde segment)" }, correct: true },
        { text: { en: "∠ABC = 50°   (given)", af: "∠ABC = 50°   (gegee)" } },
        { text: { en: "∠BAC = 180° − 90° − 50° = 40°   (Int ∠s Δ)", af: "∠BAC = 180° − 90° − 50° = 40°   (binne ∠e Δ)" } },
        // pinned last: a catch-all reads as nonsense in the middle of the list
        { text: { en: "Nothing is wrong — every reason fits.", af: "Niks is fout nie — elke rede pas." }, pin: true },
      ],
      hints: [
        { en: "Check each reason against what it actually needs. Which theorem needs a diameter, and which needs two angles on the same chord?",
          af: "Toets elke rede teen wat dit werklik nodig het. Watter stelling het 'n middellyn nodig, en watter een twee hoeke op dieselfde koord?" },
        { en: "Look at the 90° line. The value is right. Ask yourself WHY it is 90° — what is special about AB?",
          af: "Kyk na die 90°-reël. Die waarde is reg. Vra jouself HOEKOM dit 90° is — wat is spesiaal aan AB?" },
      ],
    },

    /* ---------- 3 · which steps are load-bearing ---------- */
    {
      type: "choice",
      prompt: {
        en: "This solution is correct, but one step is decorative — you could delete it and still reach 40°. Which step is doing no work?",
        af: "Hierdie oplossing is reg, maar een stap is versiering — jy kan dit uitvee en steeds by 40° uitkom. Watter stap doen geen werk nie?",
      },
      diagram: FIG_FULL,
      solution: {
        caption: SOL_CAP,
        lines: [
          { step: { en: "Step 1", af: "Stap 1" }, st: "OA = OC", rs: { en: "radii", af: "radii" } },
          { step: { en: "Step 2", af: "Stap 2" }, ...L_SEMI },
          { step: { en: "Step 3", af: "Stap 3" }, st: "∠BAC = 180° − 90° − 50° = 40°", rs: { en: "Int ∠s Δ", af: "binne ∠e Δ" } },
        ],
      },
      // The options are numbered STEPS of one chain plus a trailing catch-all,
      // so this is a sequence: shuffling it would put Step 3 above Step 1.
      keepOrder: true,
      note: {
        en: "OA = OC is true, but nothing later uses it. A step is load-bearing only if a later statement would break without it. Padding a solution with true-but-unused lines does not earn marks — and it makes the chain harder for a marker to follow.",
        af: "OA = OC is waar, maar niks later gebruik dit nie. 'n Stap dra net gewig as 'n latere stelling sonder dit sou breek. Om 'n oplossing met ware-maar-ongebruikte reëls op te stop verdien nie punte nie — en dit maak die ketting moeiliker vir 'n nasiener om te volg.",
      },
      options: [
        { text: { en: "Step 1:  OA = OC   (radii)", af: "Stap 1:  OA = OC   (radii)" }, correct: true },
        { text: { en: "Step 2:  ∠ACB = 90°   (∠s in semi-circle)", af: "Stap 2:  ∠ACB = 90°   (∠ in halwe sirkel)" } },
        { text: { en: "Step 3:  ∠BAC = 180° − 90° − 50° = 40°   (Int ∠s Δ)", af: "Stap 3:  ∠BAC = 180° − 90° − 50° = 40°   (binne ∠e Δ)" } },
        { text: { en: "None of them — all three are needed.", af: "Nie een nie — al drie word benodig." } },
      ],
      hints: [
        { en: "Cover one step with your finger. Can the lines below it still be written? If yes, that step was decoration.",
          af: "Bedek een stap met jou vinger. Kan die reëls daaronder steeds geskryf word? As ja, was daardie stap versiering." },
        { en: "Which step does step 3 actually reach back and use?",
          af: "Watter stap gebruik stap 3 werklik?" },
      ],
    },

    /* ---------- 4 · typed: what did the shorter solution spot? ----------
       N14/N15. This panel asked for a DESCRIPTION and its mark scheme then
       required a theorem NAME, so Megan's answer — which derived the 90° from
       the centre-double theorem instead of naming the semi-circle one — came
       back `partly`. Her reaction: "..... why is this wrong". It was not wrong;
       a derivation is a STRONGER answer than a name. The panel now asks for the
       description only, and panel 5 asks which theorem did the work. Its
       `must_have` drops the name line to match — read the note in phase16.sql
       before touching it back. */
    {
      type: "written",
      panelId: "s4p4",
      prompt: {
        en: "Two learners both got ∠BAC = 40°. One wrote three statements; the other wrote six, drawing in radius OC and working through two isosceles triangles. What did the SHORTER solution spot in the figure that the longer one missed?",
        af: "Twee leerders het altwee ∠BAC = 40° gekry. Een het drie stellings geskryf; die ander het ses geskryf deur radius OC in te teken en deur twee gelykbenige driehoeke te werk. Wat het die KORTER oplossing in die figuur raakgesien wat die langer een gemis het?",
      },
      diagram: FIG_GIVEN,
      minChars: 20,
      placeholder: {
        en: "The shorter one noticed that…",
        af: "Die korter een het raakgesien dat…",
      },
      needs: [
        { en: "say what the shorter solution noticed in the figure, and what it got from it",
          af: "sê wat die korter oplossing in die figuur raakgesien het, en wat dit daaruit gekry het" },
        { en: "no theorem name needed — describing it in your own words is enough",
          af: "geen stellingnaam nodig nie — om dit in jou eie woorde te beskryf is genoeg" },
      ],
      starters: [
        { en: "The shorter solution noticed that AB is…", af: "Die korter oplossing het raakgesien dat AB…" },
        { en: "Because AB is a diameter, the angle at C…", af: "Omdat AB 'n middellyn is, is die hoek by C…" },
      ],
      hints: [
        { en: "Look at AB. What kind of line is it, and what does that let you say about the angle at C straight away?",
          af: "Kyk na AB. Watter soort lyn is dit, en wat kan jy daarmee dadelik oor die hoek by C sê?" },
        { en: "AB goes right through the centre, so it is a diameter — and that makes the angle at C a right angle in a single step. The long solution ends up at the same 90°; it just spends five statements on radii and isosceles triangles getting there.",
          af: "AB gaan reg deur die middelpunt, dus is dit 'n middellyn — en dit maak die hoek by C 'n regte hoek in een enkele stap. Die lang oplossing kom by dieselfde 90° uit; dit spandeer net vyf stellings aan radii en gelykbenige driehoeke om daar te kom." },
      ],
      memoDisplay: {
        en: "The shorter solution spotted that AB is a diameter, so ∠ACB is 90° in ONE step. The longer one reached the same 90° the slow way — drawing radius OC, using OB = OC and OA = OC to make two isosceles triangles, and adding their base angles. Same answer, three extra statements, three extra places to lose a mark.",
        af: "Die korter oplossing het raakgesien dat AB 'n middellyn is, dus is ∠ACB 90° in EEN stap. Die langer een het by dieselfde 90° uitgekom op die stadige manier — deur radius OC te teken, OB = OC en OA = OC te gebruik om twee gelykbenige driehoeke te maak, en hulle basishoeke bymekaar te tel. Dieselfde antwoord, drie ekstra stellings, drie ekstra plekke om 'n punt te verloor.",
      },
      reason: "semiCircle",
      note: {
        en: "Describing it in your own words is a complete answer — you do not have to know what the theorem is called to see what it does. The next panel asks which theorem that was, and the one after asks you to write its reason the way a marker accepts it. Those are three different skills, and this was the first of them.",
        af: "Om dit in jou eie woorde te beskryf is 'n volledige antwoord — jy hoef nie te weet hoe die stelling genoem word om te sien wat dit doen nie. Die volgende paneel vra watter stelling dit was, en die een daarna vra jou om sy rede te skryf soos 'n nasiener dit aanvaar. Dit is drie verskillende vaardighede, en dit was die eerste een.",
      },
    },

    /* ---------- 5 · WHICH theorem was that? A tap, not a typed answer ----------
       The second half of the s4p4 split (N15). Deliberately a choice: panel 6
       already asks the learner to WRITE this reason in an accepted wording, and
       two typed panels for the same words would be the same question twice —
       plus a tap is instant and costs no checker call. */
    {
      type: "choice",
      prompt: {
        en: "You said what the shorter solution spotted. Which theorem is that, the one that turns \"AB is a diameter\" into \"∠ACB = 90°\" in a single step?",
        af: "Jy het gesê wat die korter oplossing raakgesien het. Watter stelling is dit, die een wat \"AB is 'n middellyn\" in een enkele stap in \"∠ACB = 90°\" verander?",
      },
      diagram: FIG_FULL,
      options: [
        { text: { en: "The angle in a semi-circle is a right angle.",
                  af: "Die hoek in 'n halwe sirkel is 'n regte hoek." }, correct: true },
        { text: { en: "The angle at the centre is double the angle at the circumference.",
                  af: "Die hoek by die middelpunt is dubbel die hoek by die omtrek." } },
        { text: { en: "Angles in the same segment of a circle are equal.",
                  af: "Hoeke in dieselfde segment van 'n sirkel is gelyk." } },
        { text: { en: "A line from the centre to the midpoint of a chord is perpendicular to it.",
                  af: "'n Lyn van die middelpunt na die middelpunt van 'n koord is loodreg daarop." } },
      ],
      hints: [
        { en: "AB passes through O, so it cuts the circle into two halves. C is sitting on one of those halves. Which theorem is about an angle standing in a half circle?",
          af: "AB gaan deur O, dus sny dit die sirkel in twee helftes. C sit op een van daardie helftes. Watter stelling gaan oor 'n hoek wat in 'n halwe sirkel staan?" },
        { en: "It is the semi-circle theorem. The centre-double one is how the LONG solution got there — true, and three statements slower. The other two need things this figure does not have.",
          af: "Dit is die halfsirkel-stelling. Die middelpunt-dubbel een is hoe die LANG oplossing daar gekom het — waar, en drie stellings stadiger. Die ander twee het dinge nodig wat hierdie figuur nie het nie." },
      ],
      reason: "semiCircle",
      note: {
        en: "Worth knowing that the centre-double option is not a wrong fact — it is exactly the route the longer solution took, since a diameter gives 180° at the centre and half of that is 90°. It is true and it is slower. The semi-circle theorem is that same result already packaged, which is why it earns the step in one line.",
        af: "Dit is die moeite werd om te weet dat die middelpunt-dubbel opsie nie 'n verkeerde feit is nie — dit is juis die roete wat die langer oplossing gevolg het, want 'n middellyn gee 180° by die middelpunt en die helfte daarvan is 90°. Dit is waar en dit is stadiger. Die halfsirkel-stelling is dieselfde resultaat wat reeds saamgevat is, en daarom verdien dit die stap in een reël.",
      },
    },

    /* ---------- 6 · typed: write the reason in an accepted wording ----------
       The blank used to be drawn with ASCII underscores inside the prompt
       string. It is the same statement-and-reason shape as the rest of the
       station, so it renders through `solution` like everything else. */
    {
      type: "written",
      panelId: "s4p5",
      prompt: {
        en: "Now finish the solution. This statement has no reason written next to it — write the reason the way a marker accepts it.",
        af: "Rond nou die oplossing af. Hierdie stelling het geen rede langsaan geskryf nie — skryf die rede soos 'n nasiener dit aanvaar.",
      },
      diagram: FIG_FULL,
      solution: {
        lines: [L_GIVEN, { st: "∠ACB = 90°", blankRs: 1 }, L_ANS],
      },
      minChars: 8,
      placeholder: {
        en: "The accepted short form…",
        af: "Die aanvaarde kort vorm…",
      },
      needs: [
        { en: "write the reason only — no working, no numbers",
          af: "skryf net die rede — geen bewerking, geen getalle nie" },
        { en: "use one of the accepted wordings for it",
          af: "gebruik een van die aanvaarde bewoordings daarvoor" },
      ],
      hints: [
        { en: "AB is a diameter, and C sits on the circle. Which theorem is that, in the short form the memo uses?",
          af: "AB is 'n middellyn, en C lê op die sirkel. Watter stelling is dit, in die kort vorm wat die memo gebruik?" },
        { en: "There is more than one accepted wording for this one — any of them earns the mark. You only need one.",
          af: "Daar is meer as een aanvaarde bewoording hiervoor — enige een verdien die punt. Jy het net een nodig." },
      ],
      memoDisplay: {
        en: "∠s in semi-circle. The accepted wordings also include “diameter subtends right angle” and “∠ in ½⊙”. In Afrikaans: “∠ in halwe sirkel” or “middellyn onderspan regte hoek”.",
        af: "∠ in halwe sirkel. Die aanvaarde bewoordings sluit ook in: “middellyn onderspan regte hoek”. In Engels: “∠s in semi-circle” of “diameter subtends right angle”.",
      },
      reason: "semiCircle",
      note: {
        en: "Learn one accepted wording per theorem and write that one every time. Markers work from a list of accepted wordings — a reason that means the right thing but is worded from scratch is where marks quietly go missing.",
        af: "Leer een aanvaarde bewoording per stelling en skryf elke keer daardie een. Nasieners werk vanaf 'n lys van aanvaarde bewoordings — 'n rede wat die regte ding beteken maar van nuuts af bewoord is, is waar punte stilweg verlore gaan.",
      },
    },

    /* ---------- CHUNK D · a different theorem, and no tangent anywhere ---------- */
    {
      type: "choice",
      prompt: {
        en: "One more, using a different theorem this time. TD is a diameter and P is a point on the circle — there is no tangent anywhere in this figure. A learner's solution writes the line below; the value is right, but the reason is wrong. What is actually wrong with it?",
        af: "Nog een, met 'n ander stelling hierdie keer. TD is 'n middellyn en P is 'n punt op die sirkel — daar is nêrens 'n raaklyn in hierdie figuur nie. 'n Leerder se oplossing skryf die reël hieronder; die waarde is reg, maar die rede is verkeerd. Wat is eintlik fout daarmee?",
      },
      diagram: TANRAD_ERR_FIG,
      solution: {
        caption: SOL_CAP,
        lines: [
          { st: "∠TPD = 90°", rs: { en: "tan ⊥ radius", af: "raaklyn ⊥ radius" } },
        ],
      },
      options: [
        { text: { en: "There is no tangent anywhere in this figure — TP and PD are chords, so tan ⊥ radius cannot apply here; the real reason is ∠s in semi-circle.",
                  af: "Daar is nêrens 'n raaklyn in hierdie figuur nie — TP en PD is koorde, dus kan raaklyn ⊥ radius hier nie geld nie; die werklike rede is ∠ in halwe sirkel." }, correct: true },
        { text: { en: "There is no problem with it — a radius is involved and the angle really is 90°, so tan ⊥ radius fits well enough.",
                  af: "Daar is geen probleem mee nie — 'n radius is betrokke en die hoek is werklik 90°, dus pas raaklyn ⊥ radius goed genoeg." } },
        { text: { en: "The value itself is wrong here — ∠TPD does not actually work out to 90° in this particular figure.",
                  af: "Die waarde self is verkeerd hier — ∠TPD kom nie werklik op 90° uit in hierdie spesifieke figuur nie." } },
        { text: { en: "The reason should say tan ⊥ diameter rather than tan ⊥ radius, since TD is a diameter and not just a plain radius.",
                  af: "Die rede moet raaklyn ⊥ middellyn sê in plaas van raaklyn ⊥ radius, aangesien TD 'n middellyn is en nie net 'n gewone radius nie." } },
      ],
      hints: [
        { en: "Look for a tangent line anywhere in this figure. Do you see one?",
          af: "Soek na 'n raaklyn iewers in hierdie figuur. Sien jy een?" },
        { en: "There isn't one — TP and PD are both chords, and TD is a diameter. tan ⊥ radius (and tan ⊥ diameter) only ever apply to the angle a TANGENT makes with a radius at its own point of contact; nothing here touches the circle from outside at all. ∠TPD = 90° is real, but it comes from a completely different theorem — the one about a diameter and a point on the circle.",
          af: "Daar is nie een nie — TP en PD is albei koorde, en TD is 'n middellyn. raaklyn ⊥ radius (en raaklyn ⊥ middellyn) geld net vir die hoek wat 'n RAAKLYN met 'n radius maak by sy eie raakpunt; niks hier raak die sirkel van buite af nie. ∠TPD = 90° is werklik, maar dit kom van 'n heeltemal ander stelling — dié oor 'n middellyn en 'n punt op die sirkel." },
      ],
      reason: "semiCircle",
      note: {
        en: "∠TPD = 90° is correct, and it comes from the semicircle theorem: TD is a diameter and P is on the circle. tan ⊥ radius needs an actual tangent touching the circle at the exact point the angle is measured — swapping in \"tan ⊥ diameter\" does not fix that, because the real fault is that there is still no tangent anywhere in the picture. Always check a tangent is actually THERE before reaching for this reason, however convenient the radius and the right angle look.",
        af: "∠TPD = 90° is korrek, en dit kom van die halfsirkel-stelling: TD is 'n middellyn en P is op die sirkel. raaklyn ⊥ radius het 'n werklike raaklyn nodig wat die sirkel raak by presies die punt waar die hoek gemeet word — om \"raaklyn ⊥ middellyn\" in te sit maak dit nie reg nie, want die werklike fout is dat daar steeds nêrens 'n raaklyn in die prentjie is nie. Kyk altyd of 'n raaklyn werklik DAAR is voordat jy hierdie rede gebruik, hoe gerieflik die radius en die regte hoek ook al lyk.",
      },
    },

    /* ---------- CHUNK D · tan-chord — the wrong alternate segment ---------- */
    {
      type: "choice",
      prompt: {
        en: "Last one, and a different theorem again. STU is a tangent at T, and TA is a chord from the point of contact. The tan-chord theorem says the angle between the tangent and the chord equals the angle in the ALTERNATE segment — the segment on the far side of the chord, not the near one. The tangent-chord angle at T is 64°. A learner's solution writes the line below for the angle at Q. What has actually gone wrong?",
        af: "Laaste een, en weer 'n ander stelling. STU is 'n raaklyn by T, en TA is 'n koord vanaf die raakpunt. Die raaklyn-koord-stelling sê die hoek tussen die raaklyn en die koord is gelyk aan die hoek in die OORSTAANDE segment — die segment aan die vêr kant van die koord, nie die naby kant nie. Die raaklyn-koord-hoek by T is 64°. 'n Leerder se oplossing skryf die reël hieronder vir die hoek by Q. Wat het eintlik verkeerd geloop?",
      },
      diagram: TANCHORD_ERR_FIG,
      solution: {
        caption: SOL_CAP,
        lines: [
          { st: "∠TQA = 64°", rs: { en: "tan-chord theorem", af: "raaklyn-koord-stelling" } },
        ],
      },
      options: [
        { text: { en: "Q is in the SAME segment as the tangent-chord angle, not the alternate one — the theorem does not apply to it at all. The angle that actually equals 64° is on the OTHER side of chord TA; ∠TQA itself works out to 116°.",
                  af: "Q is in dieselfde segment as die raaklyn-koord-hoek, nie die oorstaande een nie — die stelling geld glad nie daarvoor nie. Die hoek wat werklik gelyk is aan 64° is aan die ANDER kant van koord TA; ∠TQA self kom op 116° uit." }, correct: true },
        { text: { en: "There's nothing wrong with it — Q is on the circle and TA is a chord, so the tan-chord theorem applies here exactly as written.",
                  af: "Daar is niks fout mee nie — Q lê op die sirkel en TA is 'n koord, dus geld die raaklyn-koord-stelling hier presies soos geskryf." } },
        { text: { en: "The reason is right, but the value is wrong — the tangent-chord angle at T does not actually work out to 64° in this figure.",
                  af: "Die rede is reg, maar die waarde is verkeerd — die raaklyn-koord-hoek by T kom nie werklik op 64° uit in hierdie figuur nie." } },
        { text: { en: "The reason should say converse tan-chord theorem instead, since the angle is being read off backwards from Q rather than from the tangent.",
                  af: "Die rede moet eerder omgekeerde raaklyn-koord-stelling sê, aangesien die hoek agteruit vanaf Q afgelees word in plaas van vanaf die raaklyn." } },
      ],
      hints: [
        // "the tangent ray" was ambiguous — the tangent at T has TWO rays, one
        // on each side of chord TA, and only the one forming the marked 64°
        // angle makes the rule work. Anchor on the marked angle instead.
        { en: "The 64° angle at T sits on one side of chord TA. Is Q on that same side, or the opposite one?",
          af: "Die 64°-hoek by T sit aan een kant van koord TA. Is Q aan dieselfde kant, of die teenoorgestelde kant?" },
        { en: "Q is on the same side as the 64° angle, in the near segment — not the alternate one. Angles in the two segments of the same chord are supplementary, not equal, which is why ∠TQA is 116° here instead of 64°. Being ANYWHERE on the circle is not enough; the theorem only ever matches the tangent-chord angle to the segment on the far side.",
          af: "Q is aan dieselfde kant as die 64°-hoek, in die naby segment — nie die oorstaande een nie. Hoeke in die twee segmente van dieselfde koord is aanvullend, nie gelyk nie, en dis hoekom ∠TQA hier 116° is in plaas van 64°. Om net ORAL op die sirkel te wees, is nie genoeg nie; die stelling pas die raaklyn-koord-hoek net by die segment aan die vêr kant." },
      ],
      reason: "tanChord",
      note: {
        en: "\"Alternate\" means the OTHER side. The tan-chord theorem only ever matches the tangent-chord angle to the segment across the chord from it — never the one next to the tangent. Checking a point is on the circle is not enough; you have to check which side of the chord it is on before the theorem can apply. This is the single biggest trap in tan-chord questions, more than any wrong number.",
        af: "\"Oorstaande\" beteken die ANDER kant. Die raaklyn-koord-stelling pas die raaklyn-koord-hoek net by die segment oorkant die koord — nooit die een langs die raaklyn nie. Om te kyk of 'n punt op die sirkel lê, is nie genoeg nie; jy moet kyk aan watter kant van die koord dit is voordat die stelling kan geld. Dit is die grootste slaggat in raaklyn-koord-vrae, meer as enige verkeerde getal.",
      },
    },

  ],
};
