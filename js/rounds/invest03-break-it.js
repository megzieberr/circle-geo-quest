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

   Panel 3 leaves the figure behind on purpose — the three-points-versus-four
   question is about points, not chords, and a picture of four concyclic points
   would answer it before the learner did.

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
    en: "IEB task type 12 · Counterexamples. One case is all it takes to bring a claim down. Go and find it.",
    af: "IEB taak tipe 12 · Teenvoorbeelde. Een geval is al wat nodig is om 'n bewering te laat val. Gaan soek dit.",
  },
  panels: [

    /* ---------- 1 · is it really always? ---------- */
    {
      type: "choice",
      prompt: {
        en: "You have used this all term: a line from the centre that bisects a chord is perpendicular to that chord. Is it true for every chord you could draw?",
        af: "Jy het dit die hele kwartaal gebruik: 'n lyn vanuit die middelpunt wat 'n koord halveer, is loodreg op daardie koord. Is dit waar vir elke koord wat jy kan teken?",
      },
      diagram: FIG_CHORD,
      options: [
        { text: { en: "No — there is exactly one chord it fails for.",
                  af: "Nee — daar is presies een koord waarvoor dit misluk." }, correct: true },
        { text: { en: "Yes — it is a theorem, so it holds for every chord.",
                  af: "Ja — dit is 'n stelling, dus geld dit vir elke koord." } },
        { text: { en: "No — it fails whenever the chord is very short.",
                  af: "Nee — dit misluk wanneer die koord baie kort is." } },
        { text: { en: "No — it only works when the chord passes through the centre.",
                  af: "Nee — dit werk net wanneer die koord deur die middelpunt gaan." } },
      ],
      hints: [
        { en: "Do not test small chords and long chords — that is not where the trouble is. Ask instead: is there a chord whose midpoint is somewhere unusual?",
          af: "Moenie klein koorde en lang koorde toets nie — dis nie waar die moeilikheid lê nie. Vra eerder: is daar 'n koord wie se middelpunt op 'n vreemde plek lê?" },
        { en: "Every chord has a midpoint somewhere inside the circle. For one special chord that midpoint lands on the centre itself — and then \"the line from the centre that bisects it\" stops meaning one particular line.",
          af: "Elke koord het 'n middelpunt ergens binne die sirkel. Vir een spesiale koord land daardie middelpunt op die middelpunt van die sirkel self — en dan beteken \"die lyn vanuit die middelpunt wat dit halveer\" nie meer een spesifieke lyn nie." },
      ],
      reason: "centreMidChord",
      note: {
        en: "It fails once, and only once. A chord that is very short or very long is no trouble at all — the theorem handles both. The exception is somewhere else entirely, and the next panel asks you to name it.",
        af: "Dit misluk een keer, en net een keer. 'n Koord wat baie kort of baie lank is, is geen moeilikheid nie — die stelling hanteer albei. Die uitsondering lê heeltemal elders, en die volgende paneel vra jou om dit te benoem.",
      },
    },

    /* ---------- 2 · name the counterexample ---------- */
    {
      type: "blank",
      prompt: {
        en: "Here is the chord that breaks it. AB now runs right through O, and OD is a line from the centre that bisects AB — yet ∠DOB is 80°, not 90°. Name the chord.",
        af: "Hier is die koord wat dit breek. AB loop nou reg deur O, en OD is 'n lyn vanuit die middelpunt wat AB halveer — tog is ∠DOB 80°, nie 90° nie. Benoem die koord.",
      },
      diagram: FIG_DIAM,
      sentence: [
        { en: "The theorem fails for exactly one chord: the ", af: "Die stelling misluk vir presies een koord: die " },
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

    /* ---------- 3 · three points are free, four are not ---------- */
    {
      type: "choice",
      prompt: {
        en: "One of these two claims is true and the other is false. (A) Any three points lie on a circle. (B) Any four points lie on a circle. Which one is true?",
        af: "Een van hierdie twee bewerings is waar en die ander is onwaar. (A) Enige drie punte lê op 'n sirkel. (B) Enige vier punte lê op 'n sirkel. Watter een is waar?",
      },
      options: [
        { text: { en: "(A) — three points always lie on a circle, as long as they are not in a straight line.",
                  af: "(A) — drie punte lê altyd op 'n sirkel, solank hulle nie in 'n reguit lyn is nie." }, correct: true },
        { text: { en: "(B) — four points always lie on a circle.",
                  af: "(B) — vier punte lê altyd op 'n sirkel." } },
        { text: { en: "Both are true — you can always draw a big enough circle.",
                  af: "Albei is waar — jy kan altyd 'n groot genoeg sirkel teken." } },
        { text: { en: "Neither is true — it depends on where the points are every time.",
                  af: "Nie een is waar nie — dit hang elke keer af waar die punte lê." } },
      ],
      hints: [
        { en: "Try it on paper. Mark three dots anywhere and draw a circle through all three. Now add a fourth dot wherever you like and try to draw one circle through all four.",
          af: "Probeer dit op papier. Merk drie kolletjies enige plek en teken 'n sirkel deur al drie. Voeg nou 'n vierde kolletjie by waar jy wil en probeer een sirkel deur al vier teken." },
        { en: "Three dots fix a circle completely — there is exactly one circle through them. The fourth dot then has to land on a circle that is already decided, and almost every position misses it.",
          af: "Drie kolletjies bepaal 'n sirkel volledig — daar is presies een sirkel deur hulle. Die vierde kolletjie moet dan op 'n sirkel land wat reeds vasgestel is, en byna elke posisie mis dit." },
      ],
      note: {
        en: "Three points that are not in a line always lie on exactly one circle, so \"these three points are concyclic\" is never worth saying. Four points are a real condition, and that is precisely why cyclic quadrilaterals are worth a theorem: a four-sided figure whose corners all reach one circle is special, and you have to PROVE a quadrilateral is cyclic before you may use the cyclic-quad theorems on it. Every counterexample to (B) is a quadrilateral you are not allowed to use them on.",
        af: "Drie punte wat nie in 'n lyn lê nie, lê altyd op presies een sirkel, dus is \"hierdie drie punte is konsiklies\" nooit die moeite werd om te sê nie. Vier punte is 'n werklike voorwaarde, en dit is juis hoekom koordevierhoeke 'n stelling werd is: 'n vierhoek wie se hoekpunte almal een sirkel bereik, is besonders, en jy moet BEWYS 'n vierhoek is koordies voordat jy die koordevierhoek-stellings daarop mag gebruik. Elke teenvoorbeeld vir (B) is 'n vierhoek waarop jy hulle nie mag gebruik nie.",
      },
    },

    /* ---------- 4 · typed: why the two directions are not equal work ---------- */
    {
      type: "written",
      panelId: "s3p4",
      prompt: {
        en: "One chord was enough to bring that theorem's wording down. But in Station 1, five measurements were not enough to prove a conjecture — and a thousand would not have been either. Why is one counterexample enough to destroy a claim when a thousand examples cannot prove one?",
        af: "Een koord was genoeg om daardie stelling se bewoording te laat val. Maar in Stasie 1 was vyf metings nie genoeg om 'n vermoede te bewys nie — en duisend sou ook nie gewees het nie. Hoekom is een teenvoorbeeld genoeg om 'n bewering te vernietig terwyl duisend voorbeelde nie een kan bewys nie?",
      },
      diagram: FIG_DIAM,
      minChars: 25,
      placeholder: {
        en: "Because a conjecture claims something about…",
        af: "Omdat 'n vermoede iets beweer oor…",
      },
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
