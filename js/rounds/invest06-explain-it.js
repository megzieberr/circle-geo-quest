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

   Panel 1 carries no diagram on purpose: it is four pieces of PROSE about the
   centre-double theorem from Station 1, and a picture of it would let the
   learner judge the writing by the diagram instead of by the words. Panel 4
   carries none either — it asks for a write-up, not a reading of a figure.

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
        en: "Four learners wrote up the Station 1 investigation — the angle at the centre against the angle at the circumference. Which one could a reader who has never seen the task actually follow?",
        af: "Vier leerders het die Stasie 1-ondersoek opgeskryf — die hoek by die middelpunt teenoor die hoek by die omtrek. Watter een kan 'n leser wat die taak nog nooit gesien het nie, werklik volg?",
      },
      options: [
        { text: { en: "\"Chord AB makes an angle at the centre O and an angle at a point P on the circle. Both stand on AB. Dragging A, B and P shows the angle at O is twice the angle at P every time, so ∠AOB = 2 × ∠APB for every position.\"",
                  af: "\"Koord AB maak 'n hoek by die middelpunt O en 'n hoek by 'n punt P op die sirkel. Albei staan op AB. Deur A, B en P te sleep, wys dat die hoek by O elke keer twee keer die hoek by P is, dus ∠AOB = 2 × ∠APB vir elke posisie.\"" }, correct: true },
        { text: { en: "\"Chord AB makes two angles, so the one at the centre is double.\"",
                  af: "\"Koord AB maak twee hoeke, dus is die een by die middelpunt dubbel.\"" } },
        { text: { en: "\"∠AOB = 2 × ∠APB.\"",
                  af: "\"∠AOB = 2 × ∠APB.\"" } },
        { text: { en: "\"When I dragged P the angle at the centre looked about twice as big each time, so it probably is.\"",
                  af: "\"Toe ek P gesleep het, het die hoek by die middelpunt elke keer omtrent twee keer so groot gelyk, so dit is seker so.\"" } },
      ],
      hints: [
        { en: "Read each one as if you had walked in late and knew nothing. Which one tells you what the letters are, what was done, and what came out of it?",
          af: "Lees elkeen asof jy laat ingestap het en niks geweet het nie. Watter een sê vir jou wat die letters is, wat gedoen is, en wat daaruit gekom het?" },
        { en: "One is only an answer with no setup. One names the setup and then jumps straight to \"double\" without saying double of WHAT. One never commits — \"looked about\" and \"probably\" are not a finding.",
          af: "Een is net 'n antwoord sonder enige opstelling. Een noem die opstelling en spring dan reguit na \"dubbel\" sonder om te sê dubbel van WAT. Een verbind hom nooit nie — \"omtrent\" en \"seker\" is nie 'n bevinding nie." },
      ],
      note: {
        en: "The first one works because it does three separate jobs: it says what the letters mean, it says what was done, and it states the finding in a sentence that stands on its own. The second skips the step that says which angle is being doubled. The third is an answer with nothing around it — fine in a rider, useless in a write-up. The fourth hedges: \"looked about\" and \"probably\" tell a marker you did not trust your own work. Nothing in this panel is about mathematics. All four learners saw the same pattern.",
        af: "Die eerste een werk omdat dit drie afsonderlike take doen: dit sê wat die letters beteken, dit sê wat gedoen is, en dit stel die bevinding in 'n sin wat op sy eie staan. Die tweede slaan die stap oor wat sê wátter hoek verdubbel word. Die derde is 'n antwoord met niks daarom nie — goed in 'n vraagstuk, nutteloos in 'n verslag. Die vierde skram weg: \"omtrent\" en \"seker\" sê vir 'n nasiener jy het nie jou eie werk vertrou nie. Niks in hierdie paneel gaan oor wiskunde nie. Al vier leerders het dieselfde patroon gesien.",
      },
    },

    /* ---------- 2 · observation or conclusion ---------- */
    {
      type: "choice",
      prompt: {
        en: "AB is a diameter and C is on the circle. Three of these four sentences are OBSERVATIONS — reports of what was seen or measured. One is a CONCLUSION. Which one?",
        af: "AB is 'n middellyn en C lê op die sirkel. Drie van hierdie vier sinne is WAARNEMINGS — verslae van wat gesien of gemeet is. Een is 'n GEVOLGTREKKING. Watter een?",
      },
      diagram: FIG_SEMI,
      options: [
        { text: { en: "\"AB is a diameter, so ∠ACB must be 90° — therefore an angle standing on a diameter is always a right angle.\"",
                  af: "\"AB is 'n middellyn, dus moet ∠ACB 90° wees — daarom is 'n hoek wat op 'n middellyn staan altyd 'n regte hoek.\"" }, correct: true },
        { text: { en: "\"I measured ∠ACB with my protractor and got 90°.\"",
                  af: "\"Ek het ∠ACB met my gradeboog gemeet en 90° gekry.\"" } },
        { text: { en: "\"∠ACB looks like a right angle.\"",
                  af: "\"∠ACB lyk soos 'n regte hoek.\"" } },
        { text: { en: "\"When I moved C along the circle, the angle stayed the same size.\"",
                  af: "\"Toe ek C langs die sirkel geskuif het, het die hoek dieselfde grootte gebly.\"" } },
      ],
      hints: [
        { en: "Ask of each sentence: is it reporting something that happened, or is it claiming something that must be true?",
          af: "Vra van elke sin: rapporteer dit iets wat gebeur het, of beweer dit iets wat waar moet wees?" },
        { en: "Look for the words that do the work. \"I measured\", \"looks like\" and \"stayed the same\" all describe. \"So\" and \"therefore\" and \"must\" all conclude.",
          af: "Soek die woorde wat die werk doen. \"Ek het gemeet\", \"lyk soos\" en \"het dieselfde gebly\" beskryf alles. \"Dus\", \"daarom\" en \"moet\" trek alles 'n gevolgtrekking." },
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
        en: "Last one. Back in Station 2 you dragged P and Q around one chord and the two angles stayed equal in every position you tried. Write the CONCLUSION paragraph for that investigation — the few sentences that go at the very end of the write-up.",
        af: "Laaste een. Terug in Stasie 2 het jy P en Q om een koord gesleep en die twee hoeke het in elke posisie wat jy probeer het, gelyk gebly. Skryf die GEVOLGTREKKING-paragraaf vir daardie ondersoek — die paar sinne wat heel aan die einde van die verslag kom.",
      },
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
