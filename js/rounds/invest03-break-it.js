/* Investigation Station 3 — "Break It"  (IEB SBA task type #12)
   ------------------------------------------------------------------------
   Station 1 ended on "measuring cannot prove a conjecture". This station is
   the other half of that asymmetry: measuring CAN destroy one, and it only
   takes a single case. So the learner spends the whole station hunting for
   the one chord that breaks a theorem they have used all term.

   ONE FIGURE THROUGHOUT, re-marked per panel:
     FIG_CHORD  — chord AB, M its midpoint, OM drawn and square to AB. The
                  theorem doing what it always does.
     FIG_DIAM   — the same circle with A and B moved to opposite ends, so AB
                  is a DIAMETER, plus a second line OD from the centre. OD
                  bisects AB (it passes through the midpoint, which is O
                  itself) and is nowhere near perpendicular: 80 degrees.

   To scale:
     FIG_CHORD  A at 200, B at 340. M is the midpoint of chord AB, so OM is
                perpendicular to AB by the theorem itself — exactly 90.  ✓
     FIG_DIAM   A at 200, B at 20 (180 apart, so AB is a diameter), D at 300.
                Angle DOB is measured between the radius to D and the radius
                to B: 300 - 20 = 280, so the angle drawn is 360 - 280 = 80.  ✓

   Panel 3 gets TWO figures, and they are the only ones on the line that are
   not about this circle (Megan, 2026-07-30: "let's add a diagram here" — she
   could not parse the panel without one). It used to carry no figure at all,
   on the reasoning that a picture of four concyclic points would answer the
   question early. True, so neither figure shows one:
     FIG_THREE — three dots with the one circle through them drawn. One
                 instance of the three-dot case working; the claim is about
                 EVERY case, which the learner still has to judge.
     FIG_FOUR  — the SAME three dots plus a fourth, and NO circle drawn. The
                 dots are deliberately not concyclic (D sits 22px inside the
                 circle through A, B and C, and every other choice of three
                 misses the fourth by 27-69px) but nothing on screen says so.
   Both use the engine's `noCircle` / free-{x,y}-point support, added the same
   day for exactly this figure. Neither carries an angle, so verify.html counts
   them as diagrams with nothing to check.

   The panelId MUST match panel_memos.panel_id in phase16.sql. The memo lives
   server-side — a learner with devtools must not be able to read the answer
   out of this file. `memoDisplay` is the teaching text shown only after five
   misses, which is a different thing and safe to ship. */

const AC = "#4263eb";

/* the theorem behaving itself: OM to the midpoint of chord AB, square to it */
const FIG_CHORD = {
  O: true,
  pts: { A: 200, B: 340 },
  mid: [{ name: "M", of: ["A", "B"] }],
  chords: [["A", "B"], ["O", "M"]],
  angles: [
    { at: "M", legs: ["O", "B"], t: "", o: { v: 90, mark: 1 } },
  ],
};

/* panel 3's pair. A, B and C sit at the same three angles in both, so the
   second figure reads as "those three dots, plus one more". */
const DOTS3 = { A: 200, B: 340, C: 60 };

const FIG_THREE = {
  pts: DOTS3,
  chords: [["A", "B"], ["B", "C"], ["C", "A"]],
  angles: [],
};

const FIG_FOUR = {
  noCircle: true,
  pts: { ...DOTS3, D: { x: 112, y: 88 } },
  chords: [["A", "D"], ["D", "C"], ["C", "B"], ["B", "A"]],
  angles: [],
};

/* ---- the WHY slide's pair (added 2026-07-30, her call: "I am actually
   bamboozled… add an extra slide just to show them") -------------------------

   FIG_WHY3 shows the construction rather than asserting the result. A, B and C
   sit at the same three angles as everywhere else on this panel, and because
   they lie on the engine's circle its centre IS their circumcentre — so the
   perpendicular bisectors really do pass through O, and `mid` computes the two
   midpoints rather than anyone typing a coordinate. The two right angles are
   marked and verify-node.mjs measures them, which is what stops this figure from
   quietly lying about the very fact it teaches.

   ⚠️ EACH BISECTOR IS DRAWN AS O→MIDPOINT, NOT AS A FULL LINE ACROSS THE CIRCLE.
   The first version extended each one through O and out the far side, to make the
   crossing obvious, which needed two invented endpoint names — and the engine
   labels every named point, with no opt-out. The endpoint of BC's bisector landed
   ON A: A is at 200 deg, which is exactly the far arc-midpoint of BC (B 340, C 60
   -> midpoints 20 and 200), so that bisector passes precisely through A and the
   two labels rendered as "FA". Megan spotted it immediately.
   Half-lines meeting at O are better anyway: no invented points, nothing to
   collide, and "the line from the centre to the midpoint of a chord" is the
   theorem in the exact words her class already writes as a reason.

   FIG_FOUR_SHOWN is FIG_FOUR with the circle put back. D is 22px inside a
   radius of 80 — invisible while the dots are bare, obvious the moment the
   circle is there, which is exactly the point the panel before it makes. */
const FIG_WHY3 = {
  O: true,
  pts: DOTS3,
  mid: [{ name: "M", of: ["A", "B"] }, { name: "N", of: ["B", "C"] }],
  chords: [["A", "B"], ["B", "C"], ["C", "A"], ["O", "M"], ["O", "N"]],
  angles: [
    { at: "M", legs: ["O", "B"], t: "", o: { v: 90, mark: 1 } },
    { at: "N", legs: ["O", "C"], t: "", o: { v: 90, mark: 1 } },
  ],
};

const FIG_FOUR_SHOWN = {
  pts: { ...DOTS3, D: { x: 112, y: 88 } },
  chords: [["A", "D"], ["D", "C"], ["C", "B"], ["B", "A"]],
  angles: [],
};

/* ---- CHUNK D · equal chords — the counterexample two circles make ---------
   "Equal chords subtend equal angles at the centre" (met in the discovery
   round `deqchord`, and again in Station 1's own Chunk D panel) quietly
   assumes ONE circle. Two circles of different radius, each carrying a chord
   of the SAME real length, break it at once — the smaller circle's chord has
   to reach further round its own edge, so it cuts off a bigger angle.

   TO SCALE, at 15 px/cm: a 6 cm chord in a 4 cm-radius circle subtends 97°
   (2*4*sin(48.5°) = 5.99 cm); the same 6 cm chord in a 7 cm-radius circle
   subtends 51° (2*7*sin(25.5°) = 6.03 cm) — both within a millimetre of 6 cm,
   which is exactly the kind of whole-degree rounding this line already
   teaches is not a defect. Chord ticks (`mk:"t1"`) mark them equal on
   purpose: the GIVEN is that they are, not something to measure off the
   picture. Point positions are placed independently in each figure — nothing
   here needs to match Station 1's or the discovery round's angles. */
const EQ_SMALL = {
  w: 300, h: 260, cx: 150, cy: 130, R: 60,
  O: true,
  pts: { A: 135, B: 38 },
  chords: [{ a: "A", b: "B", mk: "t1" }, ["O", "A"], ["O", "B"]],
  angles: [{ at: "O", legs: ["A", "B"], t: "97°", o: { v: 97, r: 40 } }],
};
const EQ_BIG = {
  w: 300, h: 260, cx: 150, cy: 130, R: 105,
  O: true,
  pts: { C: 115, D: 64 },
  chords: [{ a: "C", b: "D", mk: "t1" }, ["O", "C"], ["O", "D"]],
  angles: [{ at: "O", legs: ["C", "D"], t: "51°", o: { v: 51, r: 40 } }],
};

/* the one case that breaks it: AB is a diameter, so its midpoint IS O, and
   the line OD bisects AB without being perpendicular to it */
const FIG_DIAM = {
  O: true,
  pts: { A: 200, B: 20, D: 300 },
  chords: [["A", "B"], ["O", "D"]],
  angles: [
    { at: "O", legs: ["D", "B"], t: "80°", o: { v: 80, r: 36 } },
  ],
};

export const round = {
  id: "inv3", n: 0, accent: AC, kind: "investigate", group: "g6",
  title: { en: "Break It", af: "Breek Dit" },
  blurb: {
    en: "Counterexamples. One case is all it takes to bring a claim down. Go and find it.",
    af: "Teenvoorbeelde. Een geval is al wat nodig is om 'n bewering te laat val. Gaan soek dit.",
  },
  panels: [

    /* ---------- 1 · is it really always? A PREDICTION, not a question ----------
       Megan's call, 2026-07-30: there is nothing to drag here, so committing to
       one of four conclusions is a guess — and a guess scored as an answer trips
       the hint ladder and lands in the trajectory stats. Every option is now
       accepted, and panel 2 does the reveal. The two hints that used to live here
       became the bridge lines below: `after` points at where to look without
       saying what is there. */
    {
      type: "predict",
      prompt: {
        en: "You have used this all term: a line from the centre that bisects a chord is perpendicular to that chord. Is it true for every chord you could draw?",
        af: "Jy het dit die hele kwartaal gebruik: 'n lyn vanuit die middelpunt wat 'n koord halveer, is loodreg op daardie koord. Is dit waar vir elke koord wat jy kan teken?",
      },
      diagram: FIG_CHORD,
      options: [
        { text: { en: "No — there is exactly one kind of chord it fails for.",
                  af: "Nee — daar is presies een soort koord waarvoor dit misluk." }, correct: true },
        { text: { en: "Yes — it is a theorem, so it holds for every chord.",
                  af: "Ja — dit is 'n stelling, dus geld dit vir elke koord." } },
        { text: { en: "No — it fails whenever the chord is very short.",
                  af: "Nee — dit misluk wanneer die koord baie kort is." } },
        { text: { en: "No — it only works when the chord passes through the centre.",
                  af: "Nee — dit werk net wanneer die koord deur die middelpunt gaan." } },
      ],
      reactRight: {
        en: "Good instinct. Hold on to that — let's go and look.",
        af: "Goeie aanvoeling. Hou daaraan vas — kom ons gaan kyk.",
      },
      reactWrong: {
        en: "Fair guess. Nobody can tell from here — let's go and look.",
        af: "Billike raaiskoot. Niemand kan van hier sien nie — kom ons gaan kyk.",
      },
      after: {
        en: "One thing worth knowing before you look: short chords and long chords are no trouble at all, so that is not where to hunt. Every chord has a midpoint somewhere inside the circle — ask yourself whether a midpoint could ever land somewhere unusual.",
        af: "Een ding is die moeite werd om te weet voordat jy kyk: kort koorde en lang koorde is geen moeilikheid nie, dus is dit nie waar om te soek nie. Elke koord het 'n middelpunt ergens binne die sirkel — vra jouself of 'n middelpunt ooit op 'n vreemde plek kan land.",
      },
    },

    /* ---------- 2 · name the counterexample ---------- */
    {
      type: "blank",
      // "counterexample" is defined HERE, at first use, with the thing itself
      // on the screen — not in a note after the answer. (N21's ruling: define
      // the big words in the prompt before they are needed. `conjecture` gets
      // the same treatment on inv1 panel 1, `converse` on inv5 panel 1.)
      prompt: {
        en: "Here is the chord that breaks it. AB now runs right through O, and OD is a line from the centre that bisects AB — yet ∠DOB is 80°, not 90°. One case like this, that makes an \"always\" claim false, is called a COUNTEREXAMPLE. Name the chord.",
        af: "Hier is die koord wat dit breek. AB loop nou reg deur O, en OD is 'n lyn vanuit die middelpunt wat AB halveer — tog is ∠DOB 80°, nie 90° nie. Een geval soos hierdie, wat 'n \"altyd\"-bewering onwaar maak, word 'n TEENVOORBEELD genoem. Benoem die koord.",
      },
      diagram: FIG_DIAM,
      sentence: [
        { en: "The theorem fails for exactly one kind of chord: the ", af: "Die stelling misluk vir presies een soort koord: die " },
        { kind: "word", answer: "wDiameter", options: ["wDiameter", "wRadius", "wTangent", "wArc"] },
        { en: ".", af: "." },
      ],
      hints: [
        { en: "Look at where A and B are sitting. The chord goes through the centre — what is a chord through the centre called?",
          af: "Kyk waar A en B sit. Die koord gaan deur die middelpunt — wat word 'n koord deur die middelpunt genoem?" },
        { en: "Two of the four options are not chords at all. The chord that passes through the centre is the longest one in the circle: the diameter.",
          af: "Twee van die vier opsies is glad nie koorde nie. Die koord wat deur die middelpunt gaan, is die langste een in die sirkel: die middellyn." },
      ],
      reason: "centreMidChord",
      note: {
        en: "The midpoint of a diameter IS the centre. So EVERY line drawn from the centre passes through that midpoint and bisects the chord — and only one of them happens to be perpendicular. The theorem was never wrong; it was quietly assuming the chord's midpoint was somewhere other than the centre, and nobody wrote that down. That is what a boundary case does: it shows you a condition you did not know you were relying on.",
        af: "Die middelpunt van 'n middellyn IS die middelpunt van die sirkel. Dus gaan ELKE lyn vanuit die middelpunt deur daardie middelpunt en halveer die koord — en net een van hulle is toevallig loodreg. Die stelling was nooit verkeerd nie; dit het stilweg aangeneem die koord se middelpunt lê ergens anders as die middelpunt van die sirkel, en niemand het dit neergeskryf nie. Dit is wat 'n grensgeval doen: dit wys jou 'n voorwaarde waarop jy geleun het sonder om te weet.",
      },
    },

    /* ---------- 3 · three points are free, four are not ----------
       REWRITTEN 2026-07-30. Megan on the old version: "am i stupid? i don't
       understand exactly what this question is asking of me." Three faults were
       stacked, and all three are fixed here:
         1 · "ANY three points lie on a circle" was ambiguous — meant as "given
              any three, a circle through them exists", it reads just as easily
              as "three points are generally on a circle", which sounds like a
              description of a figure that was not on the screen. Gone: the
              claim is now a thing you DO, on paper, with dots.
         2 · no figure, on a panel making a claim about pictures. Now two.
         3 · the correct option REPAIRED the claim — claim (A) said nothing
              about collinearity and option (A) added "as long as they are not
              in a straight line", so the right answer carried information the
              question withheld. That condition is now in the prompt, where it
              belongs, and no option adds anything to its claim.
       The lettered (A)/(B) options are gone too, which is what had made this
       panel a `keepOrder` case: the four options are now four independent
       verdicts and shuffle safely. */
    {
      type: "choice",
      prompt: {
        en: "That diameter was a counterexample: one case, and the claim was finished. Here is a claim whose counterexamples are almost everywhere — and it is the whole reason cyclic quadrilaterals are worth a theorem.\n\nMark some dots on a page, no three of them in a straight line, and try to draw ONE circle that passes through all of them. Which can you ALWAYS do?",
        af: "Daardie middellyn was 'n teenvoorbeeld: een geval, en die bewering was klaar. Hier is 'n bewering waarvan die teenvoorbeelde amper oral is — en dit is die hele rede waarom koordevierhoeke 'n stelling werd is.\n\nMerk 'n paar kolletjies op 'n bladsy, geen drie van hulle in 'n reguit lyn nie, en probeer EEN sirkel teken wat deur al van hulle gaan. Wat kan jy ALTYD doen?",
      },
      diagrams: [
        { diagram: FIG_THREE, caption: { en: "Three dots, with a circle drawn through all three.", af: "Drie kolletjies, met 'n sirkel deur al drie geteken." } },
        { diagram: FIG_FOUR,  caption: { en: "Four dots. Can one circle pass through all four?", af: "Vier kolletjies. Kan een sirkel deur al vier gaan?" } },
      ],
      options: [
        { text: { en: "Always with three dots; with four, only sometimes.",
                  af: "Altyd met drie kolletjies; met vier, net soms." }, correct: true },
        { text: { en: "Always with four dots; with three, only sometimes.",
                  af: "Altyd met vier kolletjies; met drie, net soms." } },
        { text: { en: "Always with three dots, and always with four as well.",
                  af: "Altyd met drie kolletjies, en altyd met vier ook." } },
        { text: { en: "Neither is guaranteed — it depends where the dots land.",
                  af: "Nie een is gewaarborg nie — dit hang af waar die kolletjies val." } },
      ],
      hints: [
        { en: "Try it on paper. Mark three dots anywhere and draw a circle through all three. Now add a fourth dot wherever you like and try to draw one circle through all four.",
          af: "Probeer dit op papier. Merk drie kolletjies enige plek en teken 'n sirkel deur al drie. Voeg nou 'n vierde kolletjie by waar jy wil en probeer een sirkel deur al vier teken." },
        { en: "Three dots fix a circle completely — there is exactly one circle through them. The fourth dot then has to land on a circle that is already decided, and almost every position misses it.",
          af: "Drie kolletjies bepaal 'n sirkel volledig — daar is presies een sirkel deur hulle. Die vierde kolletjie moet dan op 'n sirkel land wat reeds vasgestel is, en byna elke posisie mis dit." },
      ],
      note: {
        en: "Three dots that are not in a line always lie on exactly one circle, so \"these three points are concyclic\" is never worth saying — it is free. Four is a real condition, and that is exactly why cyclic quadrilaterals get a theorem of their own: a four-cornered figure whose corners all reach one circle is special. In the second picture above, D sits just inside the circle through A, B and C — close enough that no eye could call it, which is the point. The next slide draws that circle in, and shows you why three dots settle the matter on their own. <b>So you have to PROVE a quadrilateral is cyclic before you may use the cyclic-quad theorems on it.</b> Every four dots that miss are a quadrilateral you are not allowed to use them on.",
        af: "Drie kolletjies wat nie in 'n lyn lê nie, lê altyd op presies een sirkel, dus is \"hierdie drie punte is konsiklies\" nooit die moeite werd om te sê nie — dit is verniet. Vier is 'n werklike voorwaarde, en dit is juis hoekom koordevierhoeke hul eie stelling kry: 'n vierhoekige figuur wie se hoekpunte almal een sirkel bereik, is besonders. In die tweede prent hierbo lê D net binne die sirkel deur A, B en C — naby genoeg dat geen oog dit kan uitmaak nie, en dit is die punt. Die volgende skyfie teken daardie sirkel in, en wys jou hoekom drie kolletjies die saak op hul eie afhandel. <b>Jy moet dus BEWYS 'n vierhoek is koordies voordat jy die koordevierhoek-stellings daarop mag gebruik.</b> Elke vier kolletjies wat mis, is 'n vierhoek waarop jy hulle nie mag gebruik nie.",
      },
    },

    /* ---------- 4 · WHY three dots settle it — the construction, not the claim ----
       Added 2026-07-30, her call after play-testing: "That's crazy… I have been
       teaching it but I haven't ever thought about it in that way." The panel
       before it ASSERTS that three dots fix a circle; a claim that surprises a
       maths teacher will surprise a class, and an assertion they cannot check is
       exactly what this station is teaching them to distrust.

       It leans on the theorem they already own (line from centre to the midpoint
       of a chord is perpendicular to it), read BACKWARDS: the centre lies on every
       chord's perpendicular bisector, so two chords pin it down. That also answers
       her second question — the circle IS drawn through the four dots here, one
       slide later than she suggested. On the question panel it would have shown
       the answer: with the circle in, D's miss is obvious, and "no eye could call
       it" is the whole reason that panel works. */
    {
      type: "note",
      prompt: { en: "Why three dots settle it", af: "Hoekom drie kolletjies dit afhandel" },
      diagrams: [
        { diagram: FIG_WHY3, caption: {
            en: "O sits square above the midpoint of AB, and of BC — and only one point can do both.",
            af: "O lê loodreg bo die middelpunt van AB, én van BC — en net een punt kan albei doen." } },
        { diagram: FIG_FOUR_SHOWN, caption: {
            en: "The same four dots, with the circle through A, B and C drawn in.",
            af: "Dieselfde vier kolletjies, met die sirkel deur A, B en C ingeteken." } },
      ],
      note: {
        en: "The centre of a circle through A and B must be the same distance from both — so it has to sit somewhere on the <b>perpendicular bisector of AB</b>. For the same reason it has to sit on the perpendicular bisector of BC. Those two lines are not parallel, because A, B and C are not in a straight line, so they meet at <b>exactly one point</b>. That meeting point is the centre, and its distance to A is the radius.<br><br>So the circle was decided the moment the third dot went down. Nobody chose it — the dots did.<br><br>You already know the first half of this from the other direction: <i>the line from the centre to the midpoint of a chord is perpendicular to the chord</i>. Read backwards, that says the centre lies on every chord's perpendicular bisector. Two chords are enough to pin it in place, and a third dot gives you a second chord — which is the whole trick.<br><br>And that is why the fourth dot gets no say. By the time D is placed, the circle already exists. D is either on it or it is not, and almost every position is not. The second picture puts the circle in, and there it is: D was sitting inside it all along. Not by much — but a miss is a miss, and no eye could have called it from the bare dots.",
        af: "Die middelpunt van 'n sirkel deur A en B moet ewe ver van albei af wees — dit moet dus êrens op die <b>middelloodlyn van AB</b> lê. Om dieselfde rede moet dit op die middelloodlyn van BC lê. Daardie twee lyne is nie ewewydig nie, want A, B en C lê nie in 'n reguit lyn nie, en hulle ontmoet dus by <b>presies een punt</b>. Daardie ontmoetingspunt is die middelpunt, en sy afstand na A is die radius.<br><br>Die sirkel is dus beslis op die oomblik toe die derde kolletjie neergesit is. Niemand het dit gekies nie — die kolletjies het.<br><br>Jy ken die eerste helfte hiervan reeds uit die ander rigting: <i>die lyn vanuit die middelpunt na die middelpunt van 'n koord is loodreg op die koord</i>. Andersom gelees sê dit die middelpunt lê op elke koord se middelloodlyn. Twee koorde is genoeg om dit vas te pen, en 'n derde kolletjie gee jou 'n tweede koord — en dit is die hele kunsie.<br><br>En daarom het die vierde kolletjie geen sê nie. Teen die tyd dat D geplaas word, bestaan die sirkel reeds. D is óf daarop óf nie, en byna elke posisie is nie. Die tweede prent sit die sirkel in, en daar is dit: D was al die tyd binne-in. Nie met veel nie — maar 'n mis is 'n mis, en geen oog kon dit uit die kaal kolletjies uitgemaak het nie.",
      },
    },

    /* ---------- 5 · typed: why the two directions are not equal work ---------- */
    {
      type: "written",
      panelId: "s3p4",
      // "five measurements" was a hard-coded count of a table the learner now
      // fills in themselves (N1 — it holds three to six rows, whatever they
      // dragged). Same defect as N4, one station over: copy must not assert a
      // number it cannot know. Reworded to need no count at all.
      prompt: {
        en: "One chord was enough to bring that theorem's wording down. But back in Station 1, a whole table of your own readings was not enough to prove a conjecture — and a thousand rows would not have been either. A conjecture always carries the word ALWAYS — it is a claim about every case, including the ones nobody has looked at. So: why is one counterexample enough to destroy a claim like that, when a thousand examples cannot prove one?",
        af: "Een koord was genoeg om daardie stelling se bewoording te laat val. Maar terug in Stasie 1 was 'n hele tabel van jou eie lesings nie genoeg om 'n vermoede te bewys nie — en duisend rye sou ook nie gewees het nie. 'n Vermoede dra altyd die woord ALTYD — dit is 'n bewering oor elke geval, ook dié waarna niemand gekyk het nie. Dus: hoekom is een teenvoorbeeld genoeg om so 'n bewering te vernietig, terwyl duisend voorbeelde nie een kan bewys nie?",
      },
      diagram: FIG_DIAM,
      minChars: 25,
      placeholder: {
        en: "Because a conjecture claims something about…",
        af: "Omdat 'n vermoede iets beweer oor…",
      },
      /* The pivot word is ALWAYS, and until 2026-07-30 nothing above the question
         pointed at it — it only appeared in hint rung 1, which a learner has to
         fail three times to earn. That breaks teach-before-you-ask on the panel
         that carries the whole line's idea. Megan proved it by answering
         "claims something about every TESTED value": she reached for the right
         word and attached it to the wrong set, because the panel never showed
         her which set it meant. Naming the word is shape, not content — it says
         where to look, and the argument is still entirely theirs to make. */
      needs: [
        { en: "say what the word ALWAYS in a conjecture is claiming — and about which cases",
          af: "sê wat die woord ALTYD in 'n vermoede beweer — en oor watter gevalle" },
        { en: "say what ONE failing case does to a claim like that",
          af: "sê wat EEN geval wat misluk aan so 'n bewering doen" },
        // NO third line about "why a thousand agreeing cases still fail". The
        // question raises it, but s3p4's mark scheme deliberately does NOT
        // require it (see the 2026-07-30 memo decisions), and a `needs` list
        // that asks for more than the scheme marks is the exact unfairness the
        // s1p4 fix removed this same day. The list mirrors the scheme, always.
      ],
      starters: [
        { en: "A conjecture claims something about every…", af: "'n Vermoede beweer iets oor elke…" },
        { en: "So one case that fails means…", af: "Dus beteken een geval wat misluk…" },
      ],
      hints: [
        { en: "Write out the conjecture with the word ALWAYS in it, and then ask what has to happen for that word to be a lie.",
          af: "Skryf die vermoede uit met die woord ALTYD daarin, en vra dan wat moet gebeur vir daardie woord om 'n leuen te wees." },
        { en: "\"Always\" is a claim about every single case, including the ones nobody has looked at. One case that fails is enough to break it. A thousand cases that agree still leave the untested ones open.",
          af: "\"Altyd\" is 'n bewering oor elke enkele geval, ook dié waarna niemand gekyk het nie. Een geval wat misluk, is genoeg om dit te breek. Duisend gevalle wat saamstem, laat die ongetoetste gevalle steeds oop." },
      ],
      memoDisplay: {
        en: "A conjecture claims something about EVERY case. One case where it fails makes \"always\" false, and nothing can put it back — so a single counterexample settles the matter for good. A thousand agreeing cases only tell you about those thousand; the untested cases are still untested, and that is where the exception could be hiding. Disproving needs one example. Proving needs an argument that covers every case at once.",
        af: "'n Vermoede beweer iets oor ELKE geval. Een geval waar dit misluk, maak \"altyd\" onwaar, en niks kan dit terugsit nie — dus maak 'n enkele teenvoorbeeld die saak vir goed af. Duisend gevalle wat saamstem, sê net vir jou van daardie duisend; die ongetoetste gevalle is steeds ongetoets, en daar kan die uitsondering wegkruip. Om te weerlê verg een voorbeeld. Om te bewys verg 'n argument wat elke geval in een slag dek.",
      },
    },

    /* ---------- CHUNK D · a second counterexample, a different kind ----------
       The diameter panel broke a theorem by picking the one bad CASE inside a
       single figure. This one breaks a theorem by picking the wrong CIRCLE —
       every chord drawn is perfectly ordinary, so there is nothing to spot
       inside either picture on its own; the two have to be compared. */
    {
      type: "choice",
      diagrams: [
        { diagram: EQ_SMALL, caption: { en: "Circle 1 — radius 4 cm", af: "Sirkel 1 — radius 4 cm" } },
        { diagram: EQ_BIG, caption: { en: "Circle 2 — radius 7 cm", af: "Sirkel 2 — radius 7 cm" } },
      ],
      prompt: {
        en: "Both chords below are the same length — 6 cm, marked with tick marks. \"Equal chords subtend equal angles at the centre\" is a rule you have used since the discovery round. Does it hold here too?",
        af: "Albei koorde hieronder is dieselfde lengte — 6 cm, gemerk met kepies. \"Gelyke koorde onderspan gelyke hoeke by die middelpunt\" is 'n reël wat jy sedert die ontdekkingsronde gebruik. Geld dit ook hier?",
      },
      options: [
        { text: { en: "No — the rule only holds inside the SAME circle (or circles of equal radius).",
                  af: "Nee — die reël geld net binne DIESELFDE sirkel (of sirkels met gelyke radius)." }, correct: true },
        { text: { en: "Yes — equal chords always give equal central angles, whatever the circle.",
                  af: "Ja — gelyke koorde gee altyd gelyke middelpuntshoeke, watter sirkel ook al." } },
        { text: { en: "No — the rule never holds for chords, in any circle.",
                  af: "Nee — die reël geld nooit vir koorde, in enige sirkel nie." } },
        { text: { en: "Yes, but only because both circles share the same centre.",
                  af: "Ja, maar net omdat albei sirkels dieselfde middelpunt deel." } },
      ],
      hints: [
        { en: "Read the two marked angles off the diagrams. Are they the same number?",
          af: "Lees die twee gemerkte hoeke van die diagramme af. Is dit dieselfde getal?" },
        { en: "97° and 51° are not equal, and both chords really are 6 cm. The chords are equal — the circles are not.",
          af: "97° en 51° is nie gelyk nie, en albei koorde is regtig 6 cm. Die koorde is gelyk — die sirkels nie." },
      ],
      reason: "equalChords",
      note: {
        en: "Equal chords subtend equal angles — but only inside the same circle, or circles of the same radius. Shrink the circle and the same 6 cm chord has to reach further round the edge, so it cuts off a bigger angle at the centre: 97° in the small circle, only 51° in the big one. \"Equal chords, equal angles\" was always quietly assuming ONE circle — exactly the kind of dropped condition a counterexample exists to expose.",
        af: "Gelyke koorde onderspan gelyke hoeke — maar net binne dieselfde sirkel, of sirkels met dieselfde radius. Verklein die sirkel en dieselfde 6 cm-koord moet verder om die rand strek, dus sny dit 'n groter hoek by die middelpunt af: 97° in die klein sirkel, net 51° in die groot een. \"Gelyke koorde, gelyke hoeke\" het altyd stilweg EEN sirkel aangeneem — presies die soort voorwaarde wat 'n teenvoorbeeld bestaan om bloot te lê.",
      },
    },

    /* ---------- 5 · the shape of the asymmetry ---------- */
    {
      type: "note",
      prompt: { en: "Two jobs, two completely different amounts of work", af: "Twee take, twee heeltemal verskillende hoeveelhede werk" },
      note: {
        en: "<b>To disprove:</b> find one case. Draw it, measure it, show it. You are done, and no amount of arguing can bring the claim back.<br><br><b>To prove:</b> build an argument that holds for every case at the same time — usually by naming what all the cases have in common instead of visiting them one by one.<br><br>In the exam this is worth knowing in both directions. \"Is this always true?\" is answered by hunting for one exception, and if you find it you write it down and you are finished. \"Prove that…\" cannot be answered that way at all, no matter how many examples you check.",
        af: "<b>Om te weerlê:</b> vind een geval. Teken dit, meet dit, wys dit. Jy is klaar, en geen hoeveelheid argument kan die bewering terugbring nie.<br><br><b>Om te bewys:</b> bou 'n argument wat vir elke geval op dieselfde tyd geld — gewoonlik deur te benoem wat al die gevalle in gemeen het, in plaas van om hulle een vir een te besoek.<br><br>In die eksamen is dit die moeite werd om albei rigtings te ken. \"Is dit altyd waar?\" word geantwoord deur na een uitsondering te jag, en as jy dit vind, skryf jy dit neer en jy is klaar. \"Bewys dat…\" kan glad nie so geantwoord word nie, hoeveel voorbeelde jy ook al nagaan.",
      },
    },

  ],
};
