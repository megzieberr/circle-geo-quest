/* Investigation Station 6 — "Explain It"  (IEB SBA task type #7, A Lesson to a Friend)
   ------------------------------------------------------------------------
   The last station, and the one that rehearses the marking rubric from the
   MARKER's side. Panels 1 and 2 hand the learner four pieces of writing and
   ask them to judge; panels 3 and 4 then ask them to write, having just seen
   what the difference looks like from outside.

   ONE FIGURE: the semi-circle. AB is a diameter through O, C sits on the
   circle, and angle ACB is marked square.
     To scale: A at 180, B at 0 (so AB is a diameter), C at 115.
     Chord AB subtends a central angle of 180, so the angle at C on the
     circumference is 180 / 2 = 90 exactly.  ✓
   Radius OC is deliberately NOT drawn. Drawing it would hand over one of the
   two routes panel 3 asks the learner to find.

   ── N20, 2026-07-30: A PANEL THAT REFERS BACK TO ANOTHER STATION HAS TO
   CARRY WHAT IT REFERS TO. Megan on panel 4: "I played station 2 like 30 min
   ago, I cannot remember what it was about and neither will my kids… maybe just
   show that diagram again here?" And the stations will often be played DAYS
   apart, not thirty minutes.

   This deliberately REVERSES the Chunk A decision that these two panels needed
   no figure ("panel 4 asks for a write-up, not a reading of a figure"). That
   was true and beside the point: the panel asks for a conclusion ABOUT a
   specific investigation, so the figure is not decoration, it is the subject.

   The original reasons for leaving them out were real, though, so neither
   figure is pasted back in as-is:
     · panel 1 judges four write-ups of the CENTRE-DOUBLE investigation, so it
       gets the centre-double figure (FIG_CENTRE). Showing the semi-circle one
       here is what would have pre-empted panel 3 — a different figure entirely.
     · panel 4 asks for a conclusion about Station 2, whose figure labels BOTH
       angles 54°. Since "state the conjecture" is the first thing that panel's
       mark scheme looks for, a labelled figure would hand it over. So
       FIG_BOWTIE marks both angles and labels NEITHER (t: "", with o.v kept so
       verify.html still checks the picture is to scale), and a one-line recap
       above it says what was dragged. The learner gets the setup back and still
       has to say what stayed true.

   The two panelIds MUST match panel_memos.panel_id in phase16.sql. The memo
   lives server-side — a learner with devtools must not be able to read the
   answer out of this file. `memoDisplay` is the teaching text shown only after
   five misses, which is a different thing and safe to ship. */

const AC = "#f76707";

const FIG_SEMI = {
  O: true,
  pts: { A: 180, B: 0, C: 115 },
  chords: [["A", "B"], ["A", "C"], ["B", "C"]],
  angles: [
    { at: "C", legs: ["A", "B"], t: "", o: { v: 90, mark: 1 } },
  ],
};

/* Station 1's investigation, for panel 1 (N20). Same angles as invest01's FIG,
   so a learner who recognises it is recognising the right thing.
   To scale: A at 214, B at 326, P at 90. Arc AB = 112, so the centre angle is
   112 and the angle at P on the major arc is 56.  ✓ */
const FIG_CENTRE = {
  O: true,
  pts: { A: 214, B: 326, P: 90 },
  chords: [["A", "B"], ["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]],
  angles: [
    { at: "O", legs: ["A", "B"], t: "112°", o: { v: 112, r: 40 } },
    { at: "P", legs: ["A", "B"], t: "56°", o: { v: 56, r: 40 } },
  ],
};

/* Station 2's investigation, for panel 4 (N20) — the SAME points as invest02's
   BOWTIE, but both angles UNLABELLED. `t: ""` draws the arc with no number
   while `o.v` is kept, so verify.html still measures the picture against the
   truth. Labelling them 54° / 54° would state the conjecture that panel is
   asking the learner to state.
   To scale: A at 216, B at 324, P at 52, Q at 128. Chord AB cuts off an arc of
   108, so both inscribed angles are 108 / 2 = 54.  ✓ */
const FIG_BOWTIE = {
  pts: { A: 216, B: 324, P: 52, Q: 128 },
  chords: [["A", "B"], ["P", "A"], ["P", "B"], ["Q", "A"], ["Q", "B"]],
  angles: [
    { at: "P", legs: ["A", "B"], t: "", o: { v: 54, r: 40 } },
    { at: "Q", legs: ["A", "B"], t: "", o: { v: 54, r: 40 } },
  ],
};

export const round = {
  id: "inv6", n: 0, accent: AC, kind: "investigate", group: "g6",
  title: { en: "Explain It", af: "Verduidelik Dit" },
  blurb: {
    en: "A Lesson to a Friend. Mark four write-ups, then write two of your own. The marks live in the writing.",
    af: "'n Les vir 'n Vriend. Sien vier verslae na, skryf dan twee van jou eie. Die punte lê in die skryfwerk.",
  },
  panels: [

    /* ---------- 1 · four write-ups, one reader who was not there ---------- */
    {
      type: "choice",
      prompt: {
        en: "Back in Station 1 you dragged A, B and P and compared the angle at the centre with the angle at the circumference. Four learners wrote that investigation up. Which one could a reader who has never seen the task actually follow?",
        af: "Terug in Stasie 1 het jy A, B en P gesleep en die hoek by die middelpunt met die hoek by die omtrek vergelyk. Vier leerders het daardie ondersoek opgeskryf. Watter een kan 'n leser wat die taak nog nooit gesien het nie, werklik volg?",
      },
      diagram: FIG_CENTRE,
      /* THE DISTRACTORS WERE PADDED, NOT THE ANSWER SHORTENED (N18, 2026-07-30).
         The correct write-up was 216 characters against 64 / 18 / 98, so it
         could be picked by length without being read — but this panel asks
         which write-up a stranger could FOLLOW, so the good one is legitimately
         the most complete and shortening it would break the question. Megan's
         ruling: pad the others. Each padded one is now wordy and STILL fails,
         which is better teaching anyway — the real trap in marking is the long
         answer that says nothing. The terse "∠AOB = 2 × ∠APB." is left short on
         purpose: being an answer with nothing around it IS what is wrong with
         it, and padding it would remove the fault. */
      options: [
        { text: { en: "\"Chord AB makes an angle at the centre O and an angle at a point P on the circle. Both stand on AB. Dragging A, B and P shows the angle at O is twice the angle at P every time, so ∠AOB = 2 × ∠APB for every position.\"",
                  af: "\"Koord AB maak 'n hoek by die middelpunt O en 'n hoek by 'n punt P op die sirkel. Albei staan op AB. Deur A, B en P te sleep, wys dat die hoek by O elke keer twee keer die hoek by P is, dus ∠AOB = 2 × ∠APB vir elke posisie.\"" }, correct: true },
        { text: { en: "\"I set the whole thing up carefully and worked through it step by step, taking my time over every position. Chord AB makes two angles, and after checking it properly I can say that the one at the centre is double.\"",
                  af: "\"Ek het die hele ding versigtig opgestel en stap vir stap deurgewerk, en my tyd geneem met elke posisie. Koord AB maak twee hoeke, en nadat ek dit behoorlik nagegaan het, kan ek sê die een by die middelpunt is dubbel.\"" } },
        { text: { en: "\"∠AOB = 2 × ∠APB.\"",
                  af: "\"∠AOB = 2 × ∠APB.\"" } },
        { text: { en: "\"I dragged P to a lot of different places and watched the two numbers change together the whole way round the circle. The angle at the centre looked about twice as big as the one at P each time, so it probably is roughly double.\"",
                  af: "\"Ek het P na baie verskillende plekke gesleep en die twee getalle die hele pad om die sirkel saam sien verander. Die hoek by die middelpunt het elke keer omtrent twee keer so groot gelyk as dié by P, so dit is seker min of meer dubbel.\"" } },
      ],
      hints: [
        { en: "Read each one as if you had walked in late and knew nothing. Which one tells you what the letters are, what was done, and what came out of it? Length is not the test — a long answer can still leave all three out.",
          af: "Lees elkeen asof jy laat ingestap het en niks geweet het nie. Watter een sê vir jou wat die letters is, wat gedoen is, en wat daaruit gekom het? Lengte is nie die toets nie — 'n lang antwoord kan steeds al drie uitlaat." },
        { en: "One is only an answer with no setup. One talks at length about how carefully it was done and then jumps to \"double\" without ever saying double of WHAT. One never commits — \"looked about\" and \"probably\" are not a finding, however many words surround them.",
          af: "Een is net 'n antwoord sonder enige opstelling. Een praat lank oor hoe versigtig dit gedoen is en spring dan na \"dubbel\" sonder om ooit te sê dubbel van WAT. Een verbind hom nooit nie — \"omtrent\" en \"seker\" is nie 'n bevinding nie, hoeveel woorde ook al daarom staan." },
      ],
      // Every write-up is named by its WORDS, never by its position — the
      // options are shuffled now. See js/options-order.js.
      note: {
        en: "The one that works does three separate jobs: it says what the letters mean, it says what was done, and it states the finding in a sentence that stands on its own. The \"carefully, step by step\" one never says which angle is being doubled — all that care is spent on nothing. \"∠AOB = 2 × ∠APB\" is an answer with nothing around it: fine in a rider, useless in a write-up. The \"looked about… probably\" one hedges, and hedging tells a marker you did not trust your own work. Notice that two of the failures are LONGER than they need to be — length is not the same as completeness, and a marker is reading for the three jobs, not for word count. Nothing in this panel is about mathematics. All four learners saw the same pattern.",
        af: "Die een wat werk, doen drie afsonderlike take: dit sê wat die letters beteken, dit sê wat gedoen is, en dit stel die bevinding in 'n sin wat op sy eie staan. Die \"versigtig, stap vir stap\"-een sê nooit wátter hoek verdubbel word nie — al daardie sorg is aan niks bestee. \"∠AOB = 2 × ∠APB\" is 'n antwoord met niks daarom nie: goed in 'n vraagstuk, nutteloos in 'n verslag. Die \"omtrent… seker\"-een skram weg, en wegskram sê vir 'n nasiener jy het nie jou eie werk vertrou nie. Let op dat twee van die mislukkings LANGER is as wat hulle hoef te wees — lengte is nie dieselfde as volledigheid nie, en 'n nasiener lees vir die drie take, nie vir woordetal nie. Niks in hierdie paneel gaan oor wiskunde nie. Al vier leerders het dieselfde patroon gesien.",
      },
    },

    /* ---------- 2 · observation or conclusion ---------- */
    {
      type: "choice",
      /* N19 + N18, 2026-07-30. Megan: "'Which one is the conclusion'… Why are
         these questions so explicitly vague?" The prompt defined OBSERVATION
         and then used CONCLUSION — the term the question actually turns on —
         without defining it. Both missing pieces existed in the panel already,
         but after the point of use: the definition sat in the post-answer note,
         and the word-level tells sat in hint rung 2, three misses away. Both
         are now in the prompt, above the question. The tells are the METHOD for
         this task, not a rescue, so a learner who reads the prompt can do the
         work — which is the whole teach-before-you-ask rule.
         The distractors were also padded: at 49 / 32 / 66 characters against
         the correct one's 108 it could be spotted by length. Every padded one
         is still purely a report, and none of them borrows a concluding word. */
      prompt: {
        en: "AB is a diameter and C is on the circle.\n\nAn OBSERVATION reports what was seen or measured — it tells the reader what happened, and nothing more. A CONCLUSION is a claim: it says what MUST be true, and it covers cases nobody measured. The words usually give them away. \"I measured\", \"looks like\" and \"stayed the same\" all describe; \"so\", \"therefore\" and \"must\" all conclude.\n\nThree of these four sentences are observations. One is a conclusion. Which one?",
        af: "AB is 'n middellyn en C lê op die sirkel.\n\n'n WAARNEMING rapporteer wat gesien of gemeet is — dit sê vir die leser wat gebeur het, en niks meer nie. 'n GEVOLGTREKKING is 'n bewering: dit sê wat waar MOET wees, en dit dek gevalle wat niemand gemeet het nie. Die woorde verklap hulle gewoonlik. \"Ek het gemeet\", \"lyk soos\" en \"het dieselfde gebly\" beskryf; \"dus\", \"daarom\" en \"moet\" trek 'n gevolgtrekking.\n\nDrie van hierdie vier sinne is waarnemings. Een is 'n gevolgtrekking. Watter een?",
      },
      diagram: FIG_SEMI,
      options: [
        { text: { en: "\"AB is a diameter, so ∠ACB must be 90° — therefore an angle standing on a diameter is always a right angle.\"",
                  af: "\"AB is 'n middellyn, dus moet ∠ACB 90° wees — daarom is 'n hoek wat op 'n middellyn staan altyd 'n regte hoek.\"" }, correct: true },
        { text: { en: "\"I lined my protractor up on the diagram and measured ∠ACB as carefully as I could, and it came out at 90°.\"",
                  af: "\"Ek het my gradeboog op die diagram opgelyn en ∠ACB so versigtig as moontlik gemeet, en dit het op 90° uitgekom.\"" } },
        { text: { en: "\"Looking at the diagram, ∠ACB looks like a right angle to me — it has that square-corner shape you can see straight away.\"",
                  af: "\"As ek na die diagram kyk, lyk ∠ACB vir my soos 'n regte hoek — dit het daardie reghoekige vorm wat jy dadelik kan sien.\"" } },
        { text: { en: "\"I moved C along the circle to several different places, and every time I checked, the angle at C stayed the same size.\"",
                  af: "\"Ek het C langs die sirkel na verskeie verskillende plekke geskuif, en elke keer wat ek nagegaan het, het die hoek by C dieselfde grootte gebly.\"" } },
      ],
      hints: [
        { en: "Read each sentence and ask the one question that separates them: is it reporting something that happened, or claiming something that has to be true?",
          af: "Lees elke sin en vra die een vraag wat hulle skei: rapporteer dit iets wat gebeur het, of beweer dit iets wat waar moet wees?" },
        { en: "Three of them stop where the measuring stopped — one reading, one impression, one thing that held steady while C moved. Only one carries on past that and says what has to be true for positions nobody looked at. Find the sentence that ends up somewhere the measuring never went.",
          af: "Drie van hulle stop waar die meting gestop het — een lesing, een indruk, een ding wat stabiel gebly het terwyl C beweeg het. Net een gaan verder as dit en sê wat waar moet wees vir posisies waarna niemand gekyk het nie. Vind die sin wat eindig op 'n plek waar die meting nooit gekom het nie." },
      ],
      note: {
        en: "An observation is evidence: it tells the reader what you saw. A conclusion is a claim: it says what must be true, gives the reason, and covers cases nobody measured. An investigation needs both, in that order, and they must not be dressed up as each other. Writing an observation where a conclusion belongs is the most common way a good investigation loses its last marks — and \"looks like\" is the giveaway a marker reads for.",
        af: "'n Waarneming is bewys: dit sê vir die leser wat jy gesien het. 'n Gevolgtrekking is 'n bewering: dit sê wat waar moet wees, gee die rede, en dek gevalle wat niemand gemeet het nie. 'n Ondersoek het albei nodig, in daardie orde, en hulle mag nie as mekaar aangetrek word nie. Om 'n waarneming te skryf waar 'n gevolgtrekking hoort, is die algemeenste manier waarop 'n goeie ondersoek sy laaste punte verloor — en \"lyk soos\" is die verklikker waarna 'n nasiener lees.",
      },
    },

    /* ---------- 3 · typed: teach it to somebody who missed the lesson ---------- */
    {
      type: "written",
      panelId: "s6p3",
      prompt: {
        en: "Your friend missed the lesson. They can see that ∠ACB is 90° in the picture, but they want to know WHY it has to be. Explain it to them in two or three sentences — no theorem names needed, just the reasoning.",
        af: "Jou maat was afwesig by die les en kan sien dat ∠ACB 90° is op die prent, maar wil weet HOEKOM dit so moet wees. Verduidelik dit in twee of drie sinne — geen stellingname nodig nie, net die redenasie.",
      },
      diagram: FIG_SEMI,
      minChars: 40,
      placeholder: {
        en: "Because AB is a diameter, the angle at the centre…",
        af: "Omdat AB 'n middellyn is, is die hoek by die middelpunt…",
      },
      needs: [
        { en: "give the REASONING, not just the fact that it is 90°",
          af: "gee die REDENASIE, nie net die feit dat dit 90° is nie" },
        { en: "one complete route is enough — there is more than one way to show it, and you only need yours",
          af: "een volledige roete is genoeg — daar is meer as een manier om dit te wys, en jy het net joune nodig" },
      ],
      starters: [
        { en: "AB goes straight through O, so the angle at the centre is…", af: "AB gaan reguit deur O, dus is die hoek by die middelpunt…" },
        { en: "The angle at the circumference is always…", af: "Die hoek by die omtrek is altyd…" },
      ],
      hints: [
        { en: "Look at what A, O and B do. They lie in a straight line — so what size is the angle at the centre standing on AB?",
          af: "Kyk wat A, O en B doen. Hulle lê in 'n reguit lyn — watter grootte is die hoek by die middelpunt wat op AB staan dan?" },
        { en: "The angle at the centre is 180°, and you already know how an angle at the circumference compares with the angle at the centre on the same chord. Put those two facts next to each other.",
          af: "Die hoek by die middelpunt is 180°, en jy weet al hoe 'n hoek by die omtrek vergelyk met die hoek by die middelpunt op dieselfde koord. Sit daardie twee feite langs mekaar." },
      ],
      memoDisplay: {
        en: "AB is a diameter, so A, O and B lie in a straight line and the angle at the centre standing on AB is 180°. The angle at the circumference on the same chord is half the angle at the centre, so ∠ACB = 180° ÷ 2 = 90°, wherever C sits on the circle.<br><br>A second route is just as correct: draw radius OC. Then OA = OC and OB = OC (radii), so both small triangles are isosceles. Call their base angles x and y. The angles of ΔABC are x, y and (x + y), and they add to 180°, so 2x + 2y = 180° and x + y = 90° — and x + y is ∠ACB.",
        af: "AB is 'n middellyn, dus lê A, O en B in 'n reguit lyn en is die hoek by die middelpunt wat op AB staan 180°. Die hoek by die omtrek op dieselfde koord is die helfte van die hoek by die middelpunt, dus is ∠ACB = 180° ÷ 2 = 90°, waar C ook al op die sirkel sit.<br><br>'n Tweede roete is net so korrek: teken radius OC. Dan is OA = OC en OB = OC (radii), dus is albei klein driehoeke gelykbenig. Noem hulle basishoeke x en y. Die hoeke van ΔABC is x, y en (x + y), en hulle tel op tot 180°, dus 2x + 2y = 180° en x + y = 90° — en x + y is ∠ACB.",
      },
      reason: "semiCircle",
      note: {
        en: "Either route earns full marks, and there is no prize for the fancier one. What a friend needs — and what a marker needs — is the same thing: each sentence following from the one before it, with nothing left for the reader to guess.",
        af: "Enige van die twee roetes verdien volpunte, en daar is geen prys vir die ingewikkelder een nie. Wat 'n vriend nodig het — en wat 'n nasiener nodig het — is dieselfde ding: elke sin wat volg uit die een voor dit, met niks wat vir die leser oorbly om te raai nie.",
      },
    },

    /* ---------- 4 · typed: the paragraph that closes a write-up ---------- */
    {
      type: "written",
      panelId: "s6p4",
      prompt: {
        en: "Last one. This is the figure from Station 2: you dragged P and Q around chord AB, and the two marked angles stayed equal in every position you tried.\n\nWrite the CONCLUSION paragraph for that investigation — the few sentences that go at the very end of the write-up.",
        af: "Laaste een. Dit is die figuur uit Stasie 2: jy het P en Q om koord AB gesleep, en die twee gemerkte hoeke het in elke posisie wat jy probeer het, gelyk gebly.\n\nSkryf die GEVOLGTREKKING-paragraaf vir daardie ondersoek — die paar sinne wat heel aan die einde van die verslag kom.",
      },
      // both angles marked, NEITHER labelled — see the N20 note in the header
      diagram: FIG_BOWTIE,
      minChars: 60,
      placeholder: {
        en: "Three or four sentences to close the investigation…",
        af: "Drie of vier sinne om die ondersoek af te sluit…",
      },
      needs: [
        { en: "state the conjecture",
          af: "die vermoede stel" },
        { en: "say how it was tested",
          af: "sê hoe dit getoets is" },
        { en: "say what is still needed",
          af: "sê wat nog nodig is" },
      ],
      starters: [
        { en: "The investigation suggests that…", af: "Die ondersoek dui daarop dat…" },
        { en: "This was tested by…", af: "Dit is getoets deur…" },
        { en: "However, this does not yet…", af: "Dit is egter nog nie…" },
      ],
      hints: [
        { en: "A closing paragraph does three jobs. What did you find? How did you test it? And what has still not been settled?",
          af: "'n Slotparagraaf doen drie take. Wat het jy gevind? Hoe het jy dit getoets? En wat is nog nie uitgemaak nie?" },
        { en: "The third job is the one that gets forgotten. Dragging the points supports the conjecture — it does not prove it. Say so, out loud, in the paragraph.",
          af: "Die derde taak is die een wat vergeet word. Om die punte te sleep ondersteun die vermoede — dit bewys dit nie. Sê dit uitdruklik in die paragraaf." },
      ],
      memoDisplay: {
        en: "A conclusion paragraph does three things, and a marker looks for all three:<br>1 · STATES the conjecture — angles subtended by the same chord, at the circumference and in the same segment, are equal.<br>2 · SAYS HOW IT WAS TESTED — the points were dragged to many different positions and the two angles stayed equal every time.<br>3 · SAYS WHAT IS STILL MISSING — the testing supports the conjecture but does not prove it, because examples can never cover every position; a general proof is still needed.<br><br>Three or four sentences is plenty. The third one is the one that separates a full-mark write-up from a good one.",
        af: "'n Gevolgtrekking-paragraaf doen drie dinge, en 'n nasiener soek al drie:<br>1 · STEL die vermoede — hoeke onderspan deur dieselfde koord, by die omtrek en in dieselfde segment, is gelyk.<br>2 · SÊ HOE DIT GETOETS IS — die punte is na baie verskillende posisies gesleep en die twee hoeke het elke keer gelyk gebly.<br>3 · SÊ WAT NOG KORT — die toetsing ondersteun die vermoede maar bewys dit nie, want voorbeelde kan nooit elke posisie dek nie; 'n algemene bewys is steeds nodig.<br><br>Drie of vier sinne is genoeg. Die derde een is die een wat 'n volpunt-verslag van 'n goeie een skei.",
      },
      reason: "sameSeg",
    },

    /* ---------- 5 · what the marker is holding ---------- */
    {
      type: "note",
      prompt: { en: "What the person marking it is actually looking for", af: "Waarna die persoon wat dit nasien werklik soek" },
      note: {
        en: "A marker reads an investigation with four questions in hand, and they are the four this station drilled:<br><br>• Can I follow it without having been there?<br>• Is the conjecture written as a full sentence about every case, not as an answer about one picture?<br>• Are the observations kept separate from the conclusions?<br>• Does the write-up say honestly what it has NOT proved?<br><br>Not one of those is about being clever, and not one of them is about getting a bigger number of examples. They are all about writing down what you did and what it does and does not settle — which is the whole difference between noticing something and reporting it.",
        af: "'n Nasiener lees 'n ondersoek met vier vrae in die hand, en dit is die vier waarop hierdie stasie gedril het:<br><br>• Kan ek dit volg sonder dat ek daar was?<br>• Is die vermoede as 'n volledige sin oor elke geval geskryf, en nie as 'n antwoord oor een prent nie?<br>• Word die waarnemings apart van die gevolgtrekkings gehou?<br>• Sê die verslag eerlik wat dit NIE bewys het nie?<br><br>Nie een daarvan gaan oor slim wees nie, en nie een gaan oor 'n groter aantal voorbeelde nie. Hulle gaan alles oor die neerskryf van wat jy gedoen het en wat dit uitmaak en nie uitmaak nie — wat die hele verskil is tussen om iets op te merk en om dit te rapporteer.",
      },
    },

  ],
};
