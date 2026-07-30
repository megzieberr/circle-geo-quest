/* Investigation Station 4 — "Prove It"  (IEB SBA task type #9, Error Spotting)
   ------------------------------------------------------------------------
   The station Megan picked to build first, and the best test of whether typed
   answers work: three error-spotting choices, then two typed panels.

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

export const round = {
  id: "inv4", n: 0, accent: AC, kind: "investigate", group: "g6",
  title: { en: "Prove It", af: "Bewys Dit" },
  blurb: {
    en: "Error Spotting. Four proofs, and something wrong with three of them.",
    af: "Foutopsporing. Vier bewyse, en iets fout met drie daarvan.",
  },
  panels: [

    /* ---------- 1 · a line has been deleted ---------- */
    {
      type: "choice",
      prompt: {
        en: "AB is a diameter. A learner wrote this proof, but one line fell out. Which line is missing?",
        af: "AB is 'n middellyn. 'n Leerder het hierdie bewys geskryf, maar een reël het uitgeval. Watter reël kort?",
      },
      diagram: FIG_GIVEN,
      note: {
        en: "The two working lines were there — the one that did the arithmetic was missing. In the exam that is a lost mark even though the answer is right, because a marker follows the chain line by line.",
        af: "Die twee werkreëls was daar — die een wat die rekenwerk doen, het gekort. In die eksamen is dit 'n verlore punt al is die antwoord reg, want 'n nasiener volg die ketting reël vir reël.",
      },
      options: [
        { text: { en: "∠BAC = 180° − 90° − 50°   (Int ∠s Δ)", af: "∠BAC = 180° − 90° − 50°   (binne ∠e Δ)" }, correct: true },
        { text: { en: "∠ABC = 50°   (given)", af: "∠ABC = 50°   (gegee)" } },
        { text: { en: "OA = OC   (radii)", af: "OA = OC   (radii)" } },
        { text: { en: "∠AOC = 80°   (∠ at centre = 2 × ∠ at circumference)", af: "∠AOC = 80°   (Midpt∠ = 2 × Omtreks∠)" } },
      ],
      hints: [
        { en: "Read the proof as a chain: 90° … then what? … then 40°. Which arrow has nothing written on it?",
          af: "Lees die bewys as 'n ketting: 90° … dan wat? … dan 40°. Watter pyl het niks op geskryf nie?" },
        { en: "Two of these lines are things the proof already has. One of them does the subtraction that turns 90° into 40°.",
          af: "Twee van hierdie reëls is dinge wat die bewys reeds het. Een van hulle doen die aftrekking wat 90° in 40° verander." },
      ],
    },

    /* ---------- 2 · right answer, wrong reason ---------- */
    {
      type: "choice",
      prompt: {
        en: "This proof reaches 40°, which is correct. But one line has the RIGHT value with the WRONG reason. Which one?",
        af: "Hierdie bewys kom by 40° uit, wat reg is. Maar een reël het die REGTE waarde met die VERKEERDE rede. Watter een?",
      },
      diagram: FIG_FULL,
      reason: "semiCircle",
      note: {
        en: "∠ACB is 90° because AB is a DIAMETER — that is the semi-circle theorem. \"∠s in the same seg\" is about two angles standing on the same chord from the same side, which is not what is happening here. This is the single biggest silent mark-loser in geometry papers: the number is right, so it looks fine, and half the marks are gone.",
        af: "∠ACB is 90° omdat AB 'n MIDDELLYN is — dit is die halfsirkel-stelling. \"∠e in dieselfde segment\" gaan oor twee hoeke wat op dieselfde koord staan van dieselfde kant af, wat nie hier gebeur nie. Dit is die grootste stil puntverlies in meetkunde-vraestelle: die getal is reg, dus lyk dit reg, en die helfte van die punte is weg.",
      },
      options: [
        { text: { en: "∠ACB = 90°   (∠s in the same seg)", af: "∠ACB = 90°   (∠e in dieselfde segment)" }, correct: true },
        { text: { en: "∠ABC = 50°   (given)", af: "∠ABC = 50°   (gegee)" } },
        { text: { en: "∠BAC = 180° − 90° − 50° = 40°   (Int ∠s Δ)", af: "∠BAC = 180° − 90° − 50° = 40°   (binne ∠e Δ)" } },
        { text: { en: "Nothing is wrong — every reason fits.", af: "Niks is fout nie — elke rede pas." } },
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
        en: "This proof is correct, but one step is decorative — you could delete it and still reach 40°. Which step is doing no work?",
        af: "Hierdie bewys is reg, maar een stap is versiering — jy kan dit uitvee en steeds by 40° uitkom. Watter stap doen geen werk nie?",
      },
      diagram: FIG_FULL,
      note: {
        en: "OA = OC is true, but nothing later uses it. A step is load-bearing only if a later line would break without it. Padding a proof with true-but-unused lines does not earn marks — and it makes the chain harder for a marker to follow.",
        af: "OA = OC is waar, maar niks later gebruik dit nie. 'n Stap dra net gewig as 'n latere reël sonder dit sou breek. Om 'n bewys met ware-maar-ongebruikte reëls op te stop verdien nie punte nie — en dit maak die ketting moeiliker vir 'n nasiener om te volg.",
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

    /* ---------- 4 · typed: what did the shorter proof spot? ---------- */
    {
      type: "written",
      panelId: "s4p4",
      prompt: {
        en: "Two learners both got ∠BAC = 40°. One wrote three lines; the other wrote six, drawing in radius OC and working through two isosceles triangles. What did the SHORTER proof spot that the longer one missed?",
        af: "Twee leerders het altwee ∠BAC = 40° gekry. Een het drie reëls geskryf; die ander het ses geskryf deur radius OC in te teken en deur twee gelykbenige driehoeke te werk. Wat het die KORTER bewys raakgesien wat die langer een gemis het?",
      },
      diagram: FIG_GIVEN,
      minChars: 20,
      placeholder: {
        en: "Write one or two sentences…",
        af: "Skryf een of twee sinne…",
      },
      needs: [
        { en: "say what the shorter proof noticed in the figure",
          af: "sê wat die korter bewys in die figuur raakgesien het" },
        { en: "name the theorem that let it skip the long way round",
          af: "noem die stelling wat dit toegelaat het om die lang pad oor te slaan" },
      ],
      starters: [
        { en: "The shorter proof noticed that AB is…", af: "Die korter bewys het raakgesien dat AB…" },
        { en: "Because AB is a diameter, the angle at C…", af: "Omdat AB 'n middellyn is, is die hoek by C…" },
      ],
      hints: [
        { en: "Look at AB. What kind of line is it, and what does that let you say about the angle at C straight away?",
          af: "Kyk na AB. Watter soort lyn is dit, en wat kan jy daarmee dadelik oor die hoek by C sê?" },
        { en: "The long proof also ends up with 90° at C — it just takes five lines of radii and isosceles triangles to get there. Name the theorem that gives it in one.",
          af: "Die lang bewys kom ook by 90° by C uit — dit vat net vyf reëls van radii en gelykbenige driehoeke om daar te kom. Noem die stelling wat dit in een gee." },
      ],
      memoDisplay: {
        en: "The shorter proof spotted that AB is a diameter, so ∠ACB is an angle in a semi-circle and is 90° in ONE step. The longer proof reached the same 90° the slow way — drawing radius OC, using OB = OC and OA = OC to make two isosceles triangles, and adding their base angles. Same answer, three extra lines, three extra places to lose a mark.",
        af: "Die korter bewys het raakgesien dat AB 'n middellyn is, dus is ∠ACB 'n hoek in 'n halfsirkel en is dit 90° in EEN stap. Die langer bewys het by dieselfde 90° uitgekom op die stadige manier — deur radius OC te teken, OB = OC en OA = OC te gebruik om twee gelykbenige driehoeke te maak, en hulle basishoeke bymekaar te tel. Dieselfde antwoord, drie ekstra reëls, drie ekstra plekke om 'n punt te verloor.",
      },
      reason: "semiCircle",
    },

    /* ---------- 5 · typed: write the reason in an accepted wording ---------- */
    {
      type: "written",
      panelId: "s4p5",
      prompt: {
        en: "This step has no reason next to it:\n\n    ∠ACB = 90°   ( ______________ )\n\nWrite the reason the way a marker accepts it.",
        af: "Hierdie stap het geen rede langsaan nie:\n\n    ∠ACB = 90°   ( ______________ )\n\nSkryf die rede soos 'n nasiener dit aanvaar.",
      },
      diagram: FIG_FULL,
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

  ],
};
