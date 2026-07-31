/* Investigation Station 1 — "Measure & Notice"
   ------------------------------------------------------------------------
   The first station, and the one that has to earn the learner's trust before
   it takes something away from them. They drag, the app writes their readings
   down, they state the pattern, they judge a row that cannot be real — and
   then the station asks the question the whole Investigation Station exists
   for: you have measured it several times, so have you PROVED it? The answer
   is no, and that is not a trick.

   ONE FIGURE THROUGHOUT: the centre-double bowtie the class already met in
   `discover-centre-circ.js`, whose MODEL() is imported rather than rebuilt so
   the two rounds can never drift apart.

   To scale. Static figure: A at 214 deg, B at 326 deg, P at 90 deg.
     Chord AB cuts off an arc of 326 - 214 = 112 deg, so the angle at the
     centre is 112 deg and the angle at P on the major arc is 112 / 2 = 56.  ✓
   Both are marked and the engine is left to place the labels.

   ── REBUILT 2026-07-30, after Megan played it. Four findings, and the first
   one drags the rest along:

   N1 · THE APP RECORDS HER OWN READINGS. Panel 2 used to say "stop at four or
   five positions and note what you see each time" and record nothing, so every
   later mention of "your table" was fiction. The table is real now: one row per
   position the learner stops at, via `record` in js/investigate.js.

   N2 · NO PROTRACTOR. Panels 4-6 used to explain an off-by-a-bit row as "what
   a protractor does" — but nobody in the game holds a protractor, the app
   measures for them, and Megan found that confusing on its own terms. The
   honest reason is that both readouts are rounded to whole degrees. Note the
   ARITHMETIC: rounding two whole-degree readings can only ever land 1 degree
   from exact double, never 2, because |2*round(x) - round(2x)| <= 1. So the
   old 96/49 row (2 out) became 97/49 (1 out) and every "2 degrees" in the copy
   became one. Any row the learner records themselves is subject to the same
   bound, which is why the derived "2 x angle APB" column can shade a row and
   promise the pattern did not fail.

   N4 · THE ROW COUNT MATCHES THE TABLE, structurally. The old prompt narrated
   "five positions, three exactly double, one 2 degrees out" over four rows,
   only two of which were exactly double. Panels 5 and 6 now GENERATE that
   sentence by counting the rows that are actually there, so it cannot drift
   again — see `tableSummary` below.

   N15 · THE YES/NO IS A TAP. "Have you proved it? Yes / No" needed no language
   model: panel 5 is a two-option choice, instant and free, and panel 6 asks
   only for the reason. `s1p4`'s mark scheme drops its yes/no line to match —
   requiring a "no" from a learner who already tapped one would mark down an
   answer that did exactly what was asked.

   N21 · "CONJECTURE" IS DEFINED FIRST, on its own slide, anchored on HUNCH
   ("it's a big word for a 17 year old to hear"). The two languages are not
   equally hard here: Afrikaans *vermoede* already IS a hunch, so the English
   copy carries the whole burden.

   The panelId MUST match panel_memos.panel_id in phase16.sql. The memo lives
   server-side — a learner with devtools must not be able to read the answer
   out of this file. `memoDisplay` is the teaching text shown only after five
   misses, which is a different thing and safe to ship. */

import { MODEL } from "./discover-centre-circ.js";
import { MODEL as TANGENT_MODEL } from "./discover-tangents-point.js";
import { MODEL as EQCHORD_MODEL } from "./discover-equal-chords.js";

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

/* ---- CHUNK D · two tangents from a point ---------------------------------
   The station's second theorem, and a still figure rather than a drag: N8's
   ruling (no new interactive without asking) applies here too, and Station 1
   already teaches drag-and-record on the centre-double figure. What this panel
   adds is the OTHER half of measuring — reading somebody else's table, which
   panel 4 already established as an honest move ("somebody else measured…").

   TO SCALE, and the readings are computed rather than invented. PT and PS are
   the tangent lengths from an external point P, and the engine places P at the
   intersection of the two tangents, so PT = PS = R·tan(θ/2) exactly, where θ is
   ∠TOS. Drawn: T at 50°, S at 310°, so θ = 100° and PT = PS = 70·tan50° = 83.4px.
   The table below reads the SAME circle at 4 cm radius (17.5 px/cm), so:
        θ = 60°  → 4·tan30° = 2.31 cm
        θ = 100° → 4·tan50° = 4.77 cm   ← the position drawn here
        θ = 130° → 4·tan65° = 8.58 cm
   Row 2 is entered as 4.8 / 4.7 on purpose. A millimetre apart is what a ruler
   costs you, and this station has already taught that a reading that is a whisker
   out is a reading, while a reading that is wildly out is a different claim.
   Megan's call, 2026-07-30, after play-testing: this panel DRAGS. It was a
   still figure over somebody else's readings; it is now the same drag-and-record
   shape the station opens with, on `dtanpoint`'s model — the identical figure
   the class already met in the discovery round, imported rather than rebuilt.
   The still figure moved to Station 2, which states the conjecture rather than
   measuring it, and still wants a picture to point at. */

/* ---- the tangent readings ------------------------------------------------
   Its own column pair, because this table measures LENGTHS and the centre-double
   one measures angles. The numbers are the model's own raw measures — the same
   bare numbers `dtanpoint` puts on screen, so a learner who met them there sees
   the same scale here. Both tangents are computed from one length, so a row can
   never disagree with itself: there is no rounding wobble to teach on this
   figure, and none is invented.

   ⚠️ `unit: ""` is REQUIRED here. The readings table defaults a column's unit to
   "°" (it was built for the angle table), so without this the lengths render as
   "149°" — a degree sign on a length, which is exactly the kind of thing a maths
   class notices before anything else. */
const TAN_READ_COLS = [
  { label: { en: "AF (orange)", af: "AF (oranje)" }, from: m => m.af, unit: "" },
  { label: { en: "AC (blue)", af: "AC (blou)" },     from: m => m.ac, unit: "" },
];
const TAN_SHOW = {
  key: "tangentReadings",
  cols: TAN_READ_COLS,
  caption: { en: "Your tangent readings", af: "Jou raaklyn-lesings" },
};

/* ---- CHUNK D · equal chords -----------------------------------------------
   The station's third theorem, on `discover-equal-chords.js`'s own MODEL —
   AB is fixed, the learner drags C to grow or shrink chord CD, and the model's
   own measure() already returns both chord lengths and both central angles, so
   no new figure was needed. Same trick as the tangent panel above: the class
   met this exact drag in the discovery round, so this is a second look at a
   familiar picture, not a new one to decode.

   Two columns are lengths, not angles, so — same trap as TAN_READ_COLS —
   `unit: ""` is REQUIRED, or the table's default "°" turns a chord length
   into "126°". */
const EQ_READ_COLS = [
  { label: { en: "Chord AB", af: "Koord AB" }, from: m => m.ab, unit: "" },
  { label: { en: "Chord CD", af: "Koord CD" }, from: m => m.cd, unit: "" },
  { label: { en: "∠AOB", af: "∠AOB" }, from: m => Math.round(m.aob) },
  { label: { en: "∠COD", af: "∠COD" }, from: m => Math.round(m.cod) },
];
const EQ_SHOW = {
  key: "eqchordReadings",
  cols: EQ_READ_COLS,
  caption: { en: "Your readings", af: "Jou lesings" },
};

/* ---- the recorded readings ----------------------------------------------
   ONE definition of the columns, handed to both `record` (panel 2, which
   fills it in) and `showRecord` (panels 4-6, which display it). Two copies
   would drift and the later panels would mislabel the earlier panel's
   numbers. `from` reads the interactive's live measures. */
const READ_COLS = [
  { label: { en: "∠AOB (centre)", af: "∠AOB (middelpt)" }, from: m => Math.round(m.centre) },
  { label: { en: "∠APB (circle)", af: "∠APB (sirkel)" },   from: m => Math.round(m.circ) },
];

/* The same table on a later panel, with the doubled column added. That column
   may only appear from panel 4 onwards — panel 3 is where the learner works
   out "double" for themselves, and a column headed "2 × ∠APB" before that
   would hand it over. */
const SHOW_READINGS = {
  key: "readings",
  cols: READ_COLS,
  extra: [{ label: { en: "2 × ∠APB", af: "2 × ∠APB" }, of: r => 2 * r[1] }],
  flag: r => r[0] !== 2 * r[1],
  caption: { en: "Your readings", af: "Jou lesings" },
  footnote: {
    en: "Both angles on screen are rounded to whole degrees, so doubling one can land 1° away from the other. Any shaded row is 1° out for that reason — not because the pattern failed.",
    af: "Albei hoeke op die skerm word tot heelgetal-grade afgerond, dus kan die verdubbeling van een 1° van die ander af land. Enige geskakeerde ry is om daardie rede 1° uit — nie omdat die patroon misluk het nie.",
  },
};

/* What the learner's own table actually holds. COUNTED, never narrated — this
   is the permanent fix for N4, where the old prompt asserted "five positions,
   three exactly double, one 2° out" above a table of four rows, two of which
   were double. A sentence built from the rows cannot disagree with them.

   Numbers are spelled out because the table is capped at six, and "5 came out
   at exactly double, and one was a degree out" reads like a machine wrote it. */
const WORDS = {
  en: ["no", "one", "two", "three", "four", "five", "six"],
  af: ["geen", "een", "twee", "drie", "vier", "vyf", "ses"],
};
const w = (lang, k) => WORDS[lang][k] ?? String(k);

/* exported for tools/check-table-summary.mjs — every branch of this reads fine
   and could still be ungrammatical, so all of them are asserted */
export function tableSummary(scratch) {
  const rows = scratch.readings || [];
  const exact = rows.filter(r => r[0] === 2 * r[1]).length;
  const off = rows.length - exact;
  const n = rows.length;

  if (!n) {
    return {
      en: "Your table is empty, but the question does not change.",
      af: "Jou tabel is leeg, maar die vraag verander nie.",
    };
  }
  const head = {
    en: `There ${n === 1 ? "is one position" : `are ${w("en", n)} positions`} in your table`,
    af: `Daar is ${w("af", n)} posisie${n === 1 ? "" : "s"} in jou tabel`,
  };
  const rounding = {
    en: "which is what rounding to whole degrees does",
    af: "wat afronding tot heelgetal-grade doen",
  };

  // One row is below the `min` the explore panel waits for, so this is only
  // reachable if that gate ever changes — but "every one of them came out"
  // about a single reading is the sort of sentence that ships and embarrasses.
  if (n === 1) {
    return off
      ? { en: `${head.en}, and it is a degree off exactly double — ${rounding.en}.`,
          af: `${head.af}, en dit is 'n graad van presies dubbel af — ${rounding.af}.` }
      : { en: `${head.en}, and it came out at exactly double.`,
          af: `${head.af}, en dit het presies dubbel uitgekom.` };
  }
  if (!off) {
    return {
      en: `${head.en}, and every one of them came out at exactly double.`,
      af: `${head.af}, en elkeen van hulle het presies dubbel uitgekom.`,
    };
  }
  if (!exact) {
    return {
      en: `${head.en}, and all of them are a degree off exactly double — ${rounding.en}.`,
      af: `${head.af}, en hulle is almal 'n graad van presies dubbel af — ${rounding.af}.`,
    };
  }
  const cap = (s) => s.replace(/^./, c => c.toUpperCase());
  return {
    en: `${head.en}. ${cap(w("en", exact))} of them came out at exactly double, and ${off === 1 ? "one was" : `${w("en", off)} were`} a degree out — ${rounding.en}.`,
    af: `${head.af}. ${cap(w("af", exact))} daarvan het presies dubbel uitgekom, en ${off === 1 ? "een was" : `${w("af", off)} was`} 'n graad uit — ${rounding.af}.`,
  };
}

export const round = {
  id: "inv1", n: 0, accent: AC, kind: "investigate", group: "g6",
  title: { en: "Measure & Notice", af: "Meet & Merk Op" },
  blurb: {
    en: "Investigation. Drag it, measure it, write the pattern down — then find out what measuring can never do.",
    af: "Ondersoek. Sleep dit, meet dit, skryf die patroon neer — en vind dan uit wat meting nooit kan doen nie.",
  },
  panels: [

    /* ---------- 1 · what a conjecture IS, before anything is asked ----------
       N21. The line already defined the word — in panel 3's note, AFTER the
       blank that needed it. Megan's ruling was to lead with HUNCH and let
       "conjecture" attach to that, rather than the other way round. The last
       paragraph sets up Stations 3 and 5 for free: it is the disprove-vs-prove
       asymmetry the whole line is built on. Deliberately the ONLY vocabulary on
       this slide — `counterexample` is defined at first use in inv3 and
       `converse` at first use in inv5, because three definitions at once is its
       own wall of words. */
    {
      type: "note",
      prompt: { en: "First, one word", af: "Eers een woord" },
      note: {
        en: "<b>Conjecture</b> — a fancy word for a <b>hunch</b>. Not a wild guess: a hunch you have good reasons for, that nobody has proved yet.<br><br>You spot a pattern, you check it a few times, and then you write it down as a claim about EVERY case. That written-down claim is the conjecture. Check 4, 8, 12, 16 — all even — and you can write \"every multiple of 4 is even\". You believe it, you have reasons, and you have not proved it.<br><br>A conjecture stays a conjecture until one of two things happens: somebody proves it, and it becomes a <b>theorem</b> — or somebody finds a single case where it fails, and it is dead.",
        af: "<b>Vermoede</b> — dit is net 'n aanvoeling. Nie 'n wilde raaiskoot nie: 'n aanvoeling waarvoor jy goeie redes het, wat nog nie bewys is nie.<br><br>Jy sien 'n patroon, jy gaan dit 'n paar keer na, en dan skryf jy dit neer as 'n bewering oor ELKE geval. Daardie neergeskrewe bewering is die vermoede. Gaan 4, 8, 12, 16 na — alles ewe getalle — en jy kan skryf \"elke veelvoud van 4 is 'n ewe getal\". Jy glo dit, jy het redes, en jy het dit nie bewys nie.<br><br>'n Vermoede bly 'n vermoede totdat een van twee dinge gebeur: iemand bewys dit, en dit word 'n <b>stelling</b> — of iemand vind een enkele geval waar dit misluk, en dit is dood.",
      },
    },

    /* ---------- 2 · drag, and the app writes the readings down ---------- */
    {
      type: "explore",
      prompt: { en: "Two angles on one chord", af: "Twee hoeke op een koord" },
      instruction: {
        en: "∠AOB (orange) sits at the centre; ∠APB (blue) sits on the circle. Both stand on chord AB. Drag A, B and P — every time you let go, that position goes into your table. Collect at least three different positions, which is how an investigation actually starts.",
        af: "∠AOB (oranje) sit by die middelpunt; ∠APB (blou) sit op die sirkel. Albei staan op koord AB. Sleep A, B en P — elke keer as jy los, gaan daardie posisie in jou tabel in. Versamel ten minste drie verskillende posisies, want so begin 'n ondersoek werklik.",
      },
      interactive: MODEL(),
      // NO derived column here: "2 × ∠APB" would hand over the next panel.
      record: { key: "readings", cols: READ_COLS, min: 3, max: 6,
                caption: { en: "Your readings", af: "Jou lesings" } },
    },

    /* ---------- 3 · write the pattern down ---------- */
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
        { en: "Take one row of your table and divide the centre angle by the circumference angle. Do it for a second row too. What number do you keep getting?",
          af: "Vat een ry van jou tabel en deel die middelpuntshoek deur die omtrekshoek. Doen dit vir 'n tweede ry ook. Watter getal kry jy elke keer?" },
        { en: "Every position gives 2 — the centre angle is two times the other one. That word is 'double'.",
          af: "Elke posisie gee 2 — die middelpuntshoek is twee keer die ander een. Daardie woord is 'dubbel'." },
      ],
      reason: "centreDouble",
      note: {
        en: "That is your conjecture: a claim about every position, not a report of the ones you happened to try. Hold on to the word ALWAYS — the last panels of this station are going to ask you what gives you the right to write it.",
        af: "Dit is jou vermoede: 'n bewering oor elke posisie, nie 'n verslag oor dié wat jy toevallig probeer het nie. Hou vas aan die woord ALTYD — die laaste panele van hierdie stasie gaan jou vra wat jou die reg gee om dit te skryf.",
      },
    },

    /* ---------- 4 · a row that cannot be real ----------
       The learner's own table rides along as the reference standard, with the
       doubled column now visible: they can see what a real row looks like
       before judging somebody else's four. The 97/49 row is 1° out (double 49
       is 98) — believable, because that is exactly what rounding does. The
       84/63 row is 42° out, which no rounding can explain. */
    {
      type: "choice",
      prompt: {
        en: "Somebody else measured four more positions of this same figure. One of their rows cannot be a real measurement of it. Which row?",
        af: "Iemand anders het vier verdere posisies van hierdie selfde figuur gemeet. Een van hul rye kan nie 'n werklike meting daarvan wees nie. Watter ry?",
      },
      diagram: FIG,
      showRecord: SHOW_READINGS,
      options: [
        { text: { en: "∠AOB = 84°  ·  ∠APB = 63°", af: "∠AOB = 84°  ·  ∠APB = 63°" }, correct: true },
        { text: { en: "∠AOB = 140°  ·  ∠APB = 70°", af: "∠AOB = 140°  ·  ∠APB = 70°" } },
        { text: { en: "∠AOB = 97°  ·  ∠APB = 49°", af: "∠AOB = 97°  ·  ∠APB = 49°" } },
        { text: { en: "∠AOB = 118°  ·  ∠APB = 59°", af: "∠AOB = 118°  ·  ∠APB = 59°" } },
      ],
      hints: [
        { en: "Test every row the way your own table is tested: double the circumference angle and see how close you land to the centre angle.",
          af: "Toets elke ry soos jou eie tabel getoets word: verdubbel die omtrekshoek en kyk hoe naby jy aan die middelpuntshoek land." },
        { en: "Two of their rows are exactly double. One is 1° out, which is all that rounding to whole degrees can ever cost you. One is more than 40° out, and no reading error explains that — it is a different relationship.",
          af: "Twee van hul rye is presies dubbel. Een is 1° uit, wat al is wat afronding tot heelgetal-grade jou ooit kan kos. Een is meer as 40° uit, en geen leesfout verklaar dit nie — dit is 'n ander verwantskap." },
      ],
      reason: "centreDouble",
      note: {
        en: "84° and 63° are 42° away from double, and nothing about reading a number off a screen explains that — so the row is not a real measurement of this figure. Now look at 97° and 49°: double 49 is 98, not 97. That row is 1° out and it IS believable, because both numbers were rounded to whole degrees before you saw them. 1° is in fact the most that rounding can ever cost — it can never make a row 2° out. So a row that is a degree off is a rounded reading; a row that is 42° off is a different claim.",
        af: "84° en 63° is 42° van dubbel af, en niks aan die lees van 'n getal op 'n skerm verklaar dit nie — dus is die ry nie 'n werklike meting van hierdie figuur nie. Kyk nou na 97° en 49°: dubbel 49 is 98, nie 97 nie. Daardie ry is 1° uit en dit IS aanneemlik, want albei getalle is tot heelgetal-grade afgerond voordat jy hulle gesien het. 1° is trouens die meeste wat afronding jou ooit kan kos — dit kan nooit 'n ry 2° uit maak nie. 'n Ry wat 'n graad af is, is dus 'n afgeronde lesing; 'n ry wat 42° af is, is 'n ander bewering.",
      },
    },

    /* ---------- 5 · the yes/no, as a TAP (N15) ----------
       Two options, no checker call, no 12-second wait. The reason gets panel 6
       to itself. The prompt is generated from the table so it can never claim
       a row count the table does not have. */
    {
      type: "choice",
      prompt: (s) => ({
        en: `${tableSummary(s).en} Have you PROVED that the angle at the centre is always double the angle at the circumference?`,
        af: `${tableSummary(s).af} Het jy BEWYS dat die hoek by die middelpunt altyd dubbel die hoek by die omtrek is?`,
      }),
      diagram: FIG,
      showRecord: SHOW_READINGS,
      options: [
        { text: { en: "No — not yet.", af: "Nee — nog nie." }, correct: true },
        { text: { en: "Yes — the readings show it.", af: "Ja — die lesings wys dit." } },
      ],
      hints: [
        { en: "Count the positions in your table. Now count how many positions A, B and P could be dragged to altogether.",
          af: "Tel die posisies in jou tabel. Tel nou hoeveel posisies A, B en P altesaam na gesleep kan word." },
        { en: "There is no end to them, so you can never measure them all — and the sentence you wrote says ALWAYS, which is a claim about every single one of them. The answer is no.",
          af: "Daar is geen einde aan hulle nie, so jy kan hulle nooit almal meet nie — en die sin wat jy geskryf het, sê ALTYD, wat 'n bewering oor elke enkele een van hulle is. Die antwoord is nee." },
      ],
      /* The middle paragraph is scaffolding for the typed panel that follows
         (her call, 2026-07-30: "add one more paragraph about how this is a
         conjecture… just to scaffold the next slide"). It deliberately names the
         STATUS of what they have and stops there. It does NOT say why the table
         falls short — that is precisely what panel 6 asks them to write, and a
         note that answers the next question has not scaffolded it, it has done
         it. It also re-uses `conjecture` as a CALLBACK to panel 1 rather than
         defining it again; the rule is one definition, at first use. */
      note: {
        en: "No — and that is not a trick question, and it is not a criticism of your measuring. Everything in your table is true. It just does not reach far enough.<br><br>So what you have now is a <b>conjecture</b> — that word from the very first slide. A hunch you have good reasons for, that nobody has proved yet. Your table is exactly what good reasons look like: you spotted a pattern, you tested it yourself, and it held every time. That is how every theorem in your textbook started out. It stays a conjecture until somebody proves it — and the moment somebody does, it becomes a theorem.<br><br>The next panel asks you to say WHY in your own words, which is the part a marker actually reads.",
        af: "Nee — en dit is nie 'n strikvraag nie, en dit is nie kritiek op jou meting nie. Alles in jou tabel is waar. Dit reik net nie ver genoeg nie.<br><br>Wat jy nou het, is dus 'n <b>vermoede</b> — daardie woord van die heel eerste skyfie af. 'n Aanvoeling waarvoor jy goeie redes het, wat nog niemand bewys het nie. Jou tabel is presies hoe goeie redes lyk: jy het 'n patroon raakgesien, jy het dit self getoets, en dit het elke keer gehou. So het elke stelling in jou handboek begin. Dit bly 'n vermoede totdat iemand dit bewys — en die oomblik as iemand dit doen, word dit 'n stelling.<br><br>Die volgende paneel vra jou om in jou eie woorde te sê HOEKOM, en dit is die deel wat 'n nasiener werklik lees.",
      },
    },

    /* ---------- 6 · typed: now say why ---------- */
    {
      type: "written",
      panelId: "s1p4",
      prompt: (s) => ({
        en: `You said it is not proved. Now say WHY — in your own words. ${tableSummary(s).en}`,
        af: `Jy het gesê dit is nie bewys nie. Sê nou HOEKOM — in jou eie woorde. ${tableSummary(s).af}`,
      }),
      diagram: FIG,
      showRecord: SHOW_READINGS,
      minChars: 20,
      placeholder: {
        en: "Measuring is not a proof because…",
        af: "Meting is nie 'n bewys nie, want…",
      },
      /* Third line added 2026-07-30 on her call while play-testing with the kind
         of sentence her class writes. It is SHAPE, not content (N10): it tells a
         learner that the panel is not hunting for one magic wording, which is the
         thing that makes them freeze and guess. The mark scheme really does take
         any ONE of three separate reasons, so saying "there is more than one good
         answer" is describing the marking honestly, not leaking it. It must stay
         a count, never a list — naming the three would write the answer. */
      needs: [
        { en: "give ONE reason why measuring has not proved it — one good reason is enough",
          af: "EEN rede gee waarom meting dit nie bewys het nie — een goeie rede is genoeg" },
        { en: "there is more than one good reason here, so pick the one you believe and say it properly — you are not hunting for one magic sentence",
          af: "daar is meer as een goeie rede hier, so kies die een wat jy glo en sê dit behoorlik — jy soek nie na een towersin nie" },
        { en: "say what your measuring could NOT reach, not just what it showed",
          af: "sê wat jou meting NIE kon bereik nie, nie net wat dit gewys het nie" },
        { en: "you have already answered yes or no, so you do not have to repeat it",
          af: "jy het al ja of nee geantwoord, dus hoef jy dit nie te herhaal nie" },
      ],
      /* Both original starters open the SAME route ("you only checked a few"),
         which quietly told a learner that was the only way in. The third opens
         the accuracy route instead — the scheme takes it on its own — so the
         chips now match the marking. Left vague on purpose: it says which door,
         not what is behind it. */
      starters: [
        { en: "Measuring the angles only shows…", af: "Om die hoeke te meet wys net…" },
        { en: "To be sure about every position…", af: "Om seker te wees oor elke posisie…" },
        { en: "Even the positions I did measure…", af: "Selfs die posisies wat ek wel gemeet het…" },
      ],
      // Rung 1 may ask a question; rung 2 must TELL. A hint only ever appears
      // once a learner is stuck, and a stuck learner handed another question is
      // handed nothing. (Megan, 2026-07-30: "those hints were a bit vague".)
      hints: [
        { en: "Look at your table and ask what it does NOT tell you. What about the positions that are not in it?",
          af: "Kyk na jou tabel en vra wat dit NIE vir jou sê nie. Wat van die posisies wat nie daarin is nie?" },
        { en: "You checked a handful, and A, B and P can sit in endlessly many positions, so every other position is still unknown. The positions you tried cannot settle the ones you did not try. Only a proof covers all of them at once. (Another sound reason on its own: the readings were rounded to whole degrees, so even the rows you have are only double as far as the screen could show.)",
          af: "Jy het 'n handvol nagegaan, en A, B en P kan in oneindig baie posisies sit, dus is elke ander posisie steeds onbekend. Die posisies wat jy probeer het, kan nie dié wat jy nie probeer het nie uitmaak nie. Net 'n bewys dek hulle almal in een slag. (Nog 'n gegronde rede op sy eie: die lesings is tot heelgetal-grade afgerond, dus is selfs die rye wat jy het net dubbel sover die skerm kon wys.)" },
      ],
      memoDisplay: {
        en: "Because measuring only ever checks the positions you actually measured, and A, B and P can be dragged to endlessly many others — so the table supports the conjecture without proving it. (A second reason on its own is also enough: the readings are rounded to whole degrees, so even the measured rows are only double as far as the screen could show.) Only a proof covers every position at once, and that is the next thing to go looking for.",
        af: "Omdat meting net ooit die posisies nagaan wat jy werklik gemeet het, en A, B en P na oneindig baie ander gesleep kan word — dus ondersteun die tabel die vermoede sonder om dit te bewys. ('n Tweede rede op sy eie is ook genoeg: die lesings word tot heelgetal-grade afgerond, dus is selfs die gemete rye net dubbel sover die skerm kon wys.) Net 'n bewys dek elke posisie in een slag, en dit is die volgende ding om te gaan soek.",
      },
      reason: "centreDouble",
      note: {
        en: "This is not measuring being useless. Measuring is how you found the conjecture in the first place, and it is how you would spot a false one. It just cannot finish the job, because a claim about every position can never be checked one position at a time.",
        af: "Dit beteken nie meting is nutteloos nie. Meting is hoe jy die vermoede in die eerste plek gevind het, en dit is hoe jy 'n valse een sou raaksien. Dit kan net nie die werk klaarmaak nie, want 'n bewering oor elke posisie kan nooit een posisie op 'n slag nagegaan word nie.",
      },
    },

    /* ---------- 7 · CHUNK D · a second theorem, measured the same way ----------
       Her call, 2026-07-30: this DRAGS. It first shipped as a still figure over
       somebody else's readings; she wanted the learner's own hand on it, which
       is also the more honest version of a station called "Measure & Notice".
       Sits BEFORE the closing note, which stays the last word.

       The model is `dtanpoint`'s, imported — the identical figure the class met
       in the discovery round, so this is a second look at something familiar
       rather than a new picture to decode. Note it draws the radii and their
       right angles: that is raw geometry the learner has already seen there, not
       a conclusion about the two lengths, which is what this panel asks for. */
    {
      type: "explore",
      prompt: { en: "A different theorem, measured the same way", af: "'n Ander stelling, op dieselfde manier gemeet" },
      instruction: {
        en: "From the point A outside the circle, two tangents touch it at F and C. Drag A — pull it in close to the circle, push it far away, swing it round the other side. Every time you let go, that position goes into your table. Collect at least three different positions.",
        af: "Vanaf die punt A buite die sirkel raak twee raaklyne dit by F en C. Sleep A — trek dit naby aan die sirkel, stoot dit ver weg, swaai dit om na die ander kant. Elke keer as jy los, gaan daardie posisie in jou tabel in. Versamel ten minste drie verskillende posisies.",
      },
      interactive: TANGENT_MODEL(),
      record: { ...TAN_SHOW, min: 3, max: 6 },
    },

    /* ---------- 8 · what did YOUR tangent table say? ----------
       The options describe the table in words only. They must never quote a
       number, because the learner generated the rows and the copy cannot know
       them — the rule that bit twice already (N4, s3p4). The distractor about
       staying the same length is the real one: both tangents DO grow together as
       A moves out, so "equal" and "constant" are easy to blur. */
    {
      type: "choice",
      showRecord: TAN_SHOW,
      prompt: {
        en: "Look down your tangent table. What do your own readings actually say?",
        af: "Kyk af met jou raaklyn-tabel. Wat sê jou eie lesings eintlik?",
      },
      options: [
        { text: { en: "AF and AC are equal to each other, at every position of A I tried.",
                  af: "AF en AC is gelyk aan mekaar, by elke posisie van A wat ek probeer het." }, correct: true },
        { text: { en: "AF and AC are equal to each other, and they stay the same length wherever A goes.",
                  af: "AF en AC is gelyk aan mekaar, en hulle bly dieselfde lengte waar A ook al gaan." } },
        { text: { en: "AF and AC get shorter as A is pushed further away from the circle.",
                  af: "AF en AC word korter soos A verder van die sirkel af weggestoot word." } },
        { text: { en: "AF and AC only become equal once A is far enough away from the circle.",
                  af: "AF en AC word eers gelyk sodra A ver genoeg van die sirkel af is." } },
      ],
      hints: [
        { en: "Read each row across before you read the table down. What are you comparing inside a single row, and what are you comparing between one row and the next?",
          af: "Lees elke ry oor voordat jy die tabel af lees. Wat vergelyk jy binne 'n enkele ry, en wat vergelyk jy tussen een ry en die volgende?" },
        { en: "Across a row, your two numbers match. Down the table they do not — the pair gets bigger as you drag A further out, and smaller as you pull it in. So the two tangents match EACH OTHER at any one position; they are not stuck at one fixed size. The answer you pick has to say the first thing without claiming the second.",
          af: "Oor 'n ry pas jou twee getalle. Af met die tabel pas hulle nie — die paar word groter soos jy A verder uitsleep, en kleiner soos jy dit intrek. Die twee raaklyne pas dus BY MEKAAR by enige een posisie; hulle sit nie op een vaste grootte vas nie. Die antwoord wat jy kies moet die eerste ding sê sonder om die tweede te beweer." },
      ],
      reason: "tansCommonPt",
      note: {
        en: "Equal to each other is not the same as staying the same size, and that is the confusion this table exists to clear up. Both numbers grew when you dragged A away and shrank when you pulled it in — they simply did it together, keeping pace with each other the whole way.<br><br>And notice what has NOT happened here. You measured a handful of positions and the pattern held at every one — which is precisely as far as measuring ever gets you. A is free to sit anywhere outside that circle, and there is no end to the places it could go.",
        af: "Gelyk aan mekaar is nie dieselfde as om dieselfde grootte te bly nie, en dit is die verwarring wat hierdie tabel bestaan om op te klaar. Albei getalle het gegroei toe jy A weggesleep het en gekrimp toe jy dit ingetrek het — hulle het dit net saam gedoen, en die hele pad by mekaar gehou.<br><br>En let op wat NIE hier gebeur het nie. Jy het 'n handvol posisies gemeet en die patroon het by elkeen gehou — wat presies is so ver as wat meting jou ooit bring. A kan enige plek buite daardie sirkel sit, en daar is geen einde aan die plekke waarheen dit kan gaan nie.",
      },
    },

    /* ---------- 9 · CHUNK D · a third theorem, measured the same way ----------
       AB is fixed; dragging C changes chord CD and, with it, the two central
       angles. Recording several positions gives the learner their own table
       of the same rule they met in the discovery round (`deqchord`) — that
       chords of DIFFERENT lengths give DIFFERENT central angles, and only line
       up when the chords themselves do. Station 3 later asks what condition
       this rule needs that the copy here never has to name. */
    {
      type: "explore",
      prompt: { en: "A third theorem, measured the same way", af: "'n Derde stelling, op dieselfde manier gemeet" },
      instruction: {
        en: "Chord AB (orange) is fixed. Drag C to grow or shrink chord CD (blue) — and watch the two angles at the centre. Every time you let go, that position goes into your table. Collect at least three different positions.",
        af: "Koord AB (oranje) is vas. Sleep C om koord CD (blou) te vergroot of verklein — en let op die twee hoeke by die middelpunt. Elke keer as jy los, gaan daardie posisie in jou tabel in. Versamel ten minste drie verskillende posisies.",
      },
      interactive: EQCHORD_MODEL(),
      record: { ...EQ_SHOW, min: 3, max: 6 },
    },

    /* ---------- 10 · what did YOUR chord table say? ----------
       No count or number is asserted about the learner's own rows (N4 / s3p4's
       lesson) — the options describe the RELATIONSHIP only. */
    {
      type: "choice",
      showRecord: EQ_SHOW,
      prompt: {
        en: "Look down your table. When are the two central angles equal?",
        af: "Kyk af met jou tabel. Wanneer is die twee middelpuntshoeke gelyk?",
      },
      options: [
        { text: { en: "Only when chord CD is the same length as chord AB.",
                  af: "Net wanneer koord CD dieselfde lengte as koord AB is." }, correct: true },
        { text: { en: "Whenever CD is close to the same size as the circle.",
                  af: "Wanneer CD naastenby dieselfde grootte as die sirkel is." } },
        { text: { en: "Only when C sits exactly opposite A.",
                  af: "Net wanneer C presies teenoor A sit." } },
        { text: { en: "They are equal for every position of C, not just one.",
                  af: "Hulle is gelyk vir elke posisie van C, nie net een nie." } },
      ],
      hints: [
        { en: "Find the row where CD is closest in length to AB. What do ∠AOB and ∠COD do in that row?",
          af: "Vind die ry waar CD die naaste in lengte aan AB is. Wat doen ∠AOB en ∠COD in daardie ry?" },
        // No claim that a chords-match row EXISTS in the learner's table — they
        // may never have stopped at CD = AB. Same rule as N4/s3p4: copy must not
        // assert anything about rows it cannot know.
        { en: "Wherever CD is a different length from AB, the two angles sit apart — and the closer the chords get, the closer the angles get. They only ever match when the chords do.",
          af: "Waar CD 'n ander lengte as AB het, sit die twee hoeke uitmekaar — en hoe nader die koorde aan mekaar kom, hoe nader kom die hoeke. Hulle stem net ooreen wanneer die koorde ooreenstem." },
      ],
      reason: "equalChords",
      note: {
        en: "You already met this rule in the discovery round: equal chords subtend equal angles at the centre. Your table just proved it again from a fixed AB — as CD grows away from AB's length, ∠COD pulls away from ∠AOB, and only closes back up when the chords match.",
        af: "Jy het hierdie reël reeds in die ontdekkingsronde teëgekom: gelyke koorde onderspan gelyke hoeke by die middelpunt. Jou tabel het dit nou net weer bewys vanaf 'n vaste AB — soos CD van AB se lengte af wegbeweeg, trek ∠COD weg van ∠AOB, en sluit eers weer toe wanneer die koorde ooreenstem.",
      },
    },

    /* ---------- 11 · the one line to hold on to ---------- */
    {
      type: "note",
      prompt: { en: "Keep this in mind", af: "Hou dit in gedagte" },
      diagram: FIG,
      note: {
        en: "One line carries the whole idea: <i>no number of specific examples that support a conjecture adds up to a general proof.</i><br><br>That is worth reading twice, because it is also how the marks work. An investigation earns marks for measuring carefully AND for saying honestly what the measuring has not settled. A write-up that stops at \"it worked every time I tried it\" has left the last marks on the table.",
        af: "Een reël dra die hele idee: <i>geen aantal spesifieke voorbeelde wat 'n vermoede ondersteun, tel op tot 'n algemene bewys nie.</i><br><br>Dit is die moeite werd om twee keer te lees, want dit is ook hoe die punte werk. 'n Ondersoek verdien punte vir versigtige meting EN vir 'n eerlike stelling van wat die meting nie uitgemaak het nie. 'n Verslag wat stop by \"dit het elke keer gewerk toe ek dit probeer het\" laat die laaste punte op die tafel.",
      },
    },

  ],
};
