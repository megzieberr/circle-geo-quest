/* Investigation Station 1 — "Measure & Notice"  (IEB SBA task type #16)
   ------------------------------------------------------------------------
   The first station, and the one that has to earn the learner's trust before
   it takes something away from them. Panels 1-3 do exactly what a discovery
   round does: drag, watch, write the pattern down, read a table of readings.
   Then panel 4 asks the question the whole Investigation Station exists for —
   you have measured it five times, so have you PROVED it? — and the answer is
   no, and that is not a trick.

   ONE FIGURE THROUGHOUT: the centre-double bowtie the class already met in
   `discover-centre-circ.js`, whose MODEL() is imported rather than rebuilt so
   the two rounds can never drift apart.

   To scale. Static figure: A at 214 deg, B at 326 deg, P at 90 deg.
     Chord AB cuts off an arc of 326 - 214 = 112 deg, so the angle at the
     centre is 112 deg and the angle at P on the major arc is 112 / 2 = 56.  ✓
   Both are marked and the engine is left to place the labels.

   The table in panel 3 is built so the rows teach two different things:
     140/70 and 118/59  — exactly double
     96/49              — 2 deg out, which is a protractor reading, not a
                          broken theorem (and it is what panel 4 leans on)
     84/63              — 42 deg out, which no reading error can explain
   The impossible row is the one whose ratio is nowhere near 2.

   The panelId MUST match panel_memos.panel_id in phase16.sql. The memo lives
   server-side — a learner with devtools must not be able to read the answer
   out of this file. `memoDisplay` is the teaching text shown only after five
   misses, which is a different thing and safe to ship. */

import { MODEL } from "./discover-centre-circ.js";

const AC = "#e64980";

/* the centre-double figure as a still picture, for the panels that ask
   learners to read numbers rather than drag anything */
const FIG = {
  O: true,
  pts: { A: 214, B: 326, P: 90 },
  chords: [["A", "B"], ["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]],
  angles: [
    { at: "O", legs: ["A", "B"], t: "112°", o: { v: 112, r: 40 } },
    { at: "P", legs: ["A", "B"], t: "56°", o: { v: 56, r: 40 } },
  ],
};

export const round = {
  id: "inv1", n: 0, accent: AC, kind: "investigate", group: "g6",
  title: { en: "Measure & Notice", af: "Meet & Merk Op" },
  blurb: {
    en: "IEB task type 16 · Investigation. Drag it, measure it, write the pattern down — then find out what measuring can never do.",
    af: "IEB taak tipe 16 · Ondersoek. Sleep dit, meet dit, skryf die patroon neer — en vind dan uit wat meting nooit kan doen nie.",
  },
  panels: [

    /* ---------- 1 · drag and watch, exactly like a discovery round ---------- */
    {
      type: "explore",
      prompt: { en: "Two angles on one chord", af: "Twee hoeke op een koord" },
      instruction: {
        en: "∠AOB (orange) sits at the centre; ∠APB (blue) sits on the circle. Both stand on chord AB. Drag A, B and P and watch the two numbers. Stop at four or five different positions and note what you see each time — you are collecting readings, the way an investigation actually starts.",
        af: "∠AOB (oranje) sit by die middelpunt; ∠APB (blou) sit op die sirkel. Albei staan op koord AB. Sleep A, B en P en let op die twee getalle. Stop by vier of vyf verskillende posisies en let elke keer op wat jy sien — jy versamel lesings, soos 'n ondersoek werklik begin.",
      },
      interactive: MODEL(),
    },

    /* ---------- 2 · write the pattern down ---------- */
    {
      type: "blank",
      prompt: {
        en: "Write down the pattern your readings show.",
        af: "Skryf die patroon neer wat jou lesings wys.",
      },
      interactive: MODEL(),
      sentence: [
        { en: "The angle at the centre is always ", af: "Die hoek by die middelpunt is altyd " },
        { kind: "word", answer: "double", options: ["double", "half", "equal", "bigger"] },
        { en: " the angle at the circumference.", af: " die hoek by die omtrek." },
      ],
      hints: [
        { en: "Take one position and divide the centre angle by the circumference angle. Do it for a second position too. What number do you keep getting?",
          af: "Vat een posisie en deel die middelpuntshoek deur die omtrekshoek. Doen dit vir 'n tweede posisie ook. Watter getal kry jy elke keer?" },
        { en: "Every position gives 2 — the centre angle is two times the other one. That word is 'double'.",
          af: "Elke posisie gee 2 — die middelpuntshoek is twee keer die ander een. Daardie woord is 'dubbel'." },
      ],
      reason: "centreDouble",
      note: {
        en: "That is a conjecture: a claim about every position, not a report of the ones you happened to try. Hold on to the word ALWAYS — the last two panels of this station are going to ask you what gives you the right to write it.",
        af: "Dit is 'n vermoede: 'n bewering oor elke posisie, nie 'n verslag oor dié wat jy toevallig probeer het nie. Hou vas aan die woord ALTYD — die laaste twee panele van hierdie stasie gaan jou vra wat jou die reg gee om dit te skryf.",
      },
    },

    /* ---------- 3 · a table of readings, one of which cannot be real ---------- */
    {
      type: "choice",
      prompt: {
        en: "You measured four more positions of this figure and wrote the pairs in a table. One row cannot be a real measurement of it. Which row?",
        af: "Jy het vier verdere posisies van hierdie figuur gemeet en die pare in 'n tabel geskryf. Een ry kan nie 'n werklike meting daarvan wees nie. Watter ry?",
      },
      diagram: FIG,
      options: [
        { text: { en: "∠AOB = 84°  ·  ∠APB = 63°", af: "∠AOB = 84°  ·  ∠APB = 63°" }, correct: true },
        { text: { en: "∠AOB = 140°  ·  ∠APB = 70°", af: "∠AOB = 140°  ·  ∠APB = 70°" } },
        { text: { en: "∠AOB = 96°  ·  ∠APB = 49°", af: "∠AOB = 96°  ·  ∠APB = 49°" } },
        { text: { en: "∠AOB = 118°  ·  ∠APB = 59°", af: "∠AOB = 118°  ·  ∠APB = 59°" } },
      ],
      hints: [
        { en: "Test every row against your own sentence: double the circumference angle and see whether you land on the centre angle.",
          af: "Toets elke ry teen jou eie sin: verdubbel die omtrekshoek en kyk of jy by die middelpuntshoek uitkom." },
        { en: "Two rows are exactly double. One is 2° out, which is what a protractor does. One is more than 40° out, which is not a reading — it is a different relationship.",
          af: "Twee rye is presies dubbel. Een is 2° uit, wat 'n gradeboog doen. Een is meer as 40° uit, wat nie 'n lesing is nie — dit is 'n ander verwantskap." },
      ],
      reason: "centreDouble",
      note: {
        en: "84° and 63° are 42° away from double — nothing about holding a protractor explains that, so the row is not a real reading of this figure. But look carefully at 96° and 49°: double 49 is 98, not 96. That row is 2° out and it IS believable, because reading a protractor to the nearest degree is the best anyone can do. Keep that row in mind for the next panel.",
        af: "84° en 63° is 42° van dubbel af — niks aan die hantering van 'n gradeboog verklaar dit nie, dus is die ry nie 'n werklike lesing van hierdie figuur nie. Maar kyk mooi na 96° en 49°: dubbel 49 is 98, nie 96 nie. Daardie ry is 2° uit en dit IS aanneemlik, want om 'n gradeboog tot die naaste graad te lees, is die beste wat enigiemand kan doen. Hou daardie ry in gedagte vir die volgende paneel.",
      },
    },

    /* ---------- 4 · typed: the question the whole station is for ---------- */
    {
      type: "written",
      panelId: "s1p4",
      prompt: {
        en: "So your table now holds five positions. Three came out at exactly double, one was 2° out and you put that down to the protractor. Have you PROVED that the angle at the centre is always double the angle at the circumference? Say yes or no, and say why.",
        af: "Jou tabel hou nou vyf posisies. Drie het presies dubbel uitgekom, een was 2° uit en jy het dit aan die gradeboog toegeskryf. Het jy BEWYS dat die hoek by die middelpunt altyd dubbel die hoek by die omtrek is? Sê ja of nee, en sê hoekom.",
      },
      diagram: FIG,
      minChars: 20,
      placeholder: {
        en: "Yes or no, and then why…",
        af: "Ja of nee, en dan hoekom…",
      },
      starters: [
        { en: "Measuring the angles only shows…", af: "Om die hoeke te meet wys net…" },
        { en: "To be sure about every position…", af: "Om seker te wees oor elke posisie…" },
      ],
      hints: [
        { en: "Count what you actually checked. Five positions. Now count how many positions A, B and P could be dragged to.",
          af: "Tel wat jy werklik nagegaan het. Vyf posisies. Tel nou hoeveel posisies A, B en P na gesleep kan word." },
        { en: "You cannot measure them all — there is no end to them. And the 2° row shows that even the ones you did measure were only read to the nearest degree. So what would it take to cover every position at once?",
          af: "Jy kan hulle nie almal meet nie — daar is geen einde aan hulle nie. En die 2°-ry wys dat selfs dié wat jy wel gemeet het, net tot die naaste graad gelees is. Wat sou dit dan verg om elke posisie in een slag te dek?" },
      ],
      memoDisplay: {
        en: "No. Measuring only ever checks the positions you actually measured, and A, B and P can be dragged to endlessly many others — so the table supports the conjecture without proving it. (The 2° row also shows a protractor reading is never exact.) Only a proof covers every position at once, and that is the next thing to go looking for.",
        af: "Nee. Meting gaan net ooit die posisies na wat jy werklik gemeet het, en A, B en P kan na oneindig baie ander gesleep word — dus ondersteun die tabel die vermoede sonder om dit te bewys. (Die 2°-ry wys ook dat 'n gradeboog-lesing nooit presies is nie.) Net 'n bewys dek elke posisie in een slag, en dit is die volgende ding om te gaan soek.",
      },
      reason: "centreDouble",
      note: {
        en: "This is not measuring being useless. Measuring is how you found the conjecture in the first place, and it is how you would spot a false one. It just cannot finish the job, because a claim about every position can never be checked one position at a time.",
        af: "Dit beteken nie meting is nutteloos nie. Meting is hoe jy die vermoede in die eerste plek gevind het, en dit is hoe jy 'n valse een sou raaksien. Dit kan net nie die werk klaarmaak nie, want 'n bewering oor elke posisie kan nooit een posisie op 'n slag nagegaan word nie.",
      },
    },

    /* ---------- 5 · the IEB's own words ---------- */
    {
      type: "note",
      prompt: { en: "The line the examiners wrote down", af: "Die reël wat die eksaminatore neergeskryf het" },
      diagram: FIG,
      note: {
        en: "The IEB says it in one sentence in the Subject Assessment Guidelines: <i>\"Numerous specific examples supporting a conjecture do not constitute a general proof.\"</i><br><br>That is worth reading twice, because it is the rule the marks follow. An investigation earns marks for measuring carefully AND for saying honestly what the measuring has not settled. A write-up that stops at \"it worked every time I tried it\" has left the last marks on the table.",
        af: "Die IEB stel dit in een sin in die Vakassesseringsriglyne: <i>\"Talle spesifieke voorbeelde wat 'n vermoede ondersteun, vorm nie 'n algemene bewys nie.\"</i> (Die IEB se Engelse woorde: <i>\"Numerous specific examples supporting a conjecture do not constitute a general proof.\"</i>)<br><br>Dit is die moeite werd om twee keer te lees, want dit is die reël wat die punte volg. 'n Ondersoek verdien punte vir versigtige meting EN vir 'n eerlike stelling van wat die meting nie uitgemaak het nie. 'n Verslag wat stop by \"dit het elke keer gewerk toe ek dit probeer het\" laat die laaste punte op die tafel.",
      },
    },

  ],
};
