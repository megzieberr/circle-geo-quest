/* Investigation Station 5 — "Turn It Around"  (converses)
   ------------------------------------------------------------------------
   `round15-converse.js` already asks "read the clue, name the figure", which
   is the USING of a converse. This station goes one layer down and asks about
   the converses themselves: swapping a theorem round makes a NEW claim, and
   that claim can come out true and useful, true and useless, or plain false.

   ONE FIGURE THROUGHOUT — cyclic quadrilateral ABCD, re-marked per panel:
     FIG_OPP  — the two opposite angles A and C marked.
     FIG_EXT  — AB extended to E, with the exterior angle EBC and the interior
                opposite angle D marked.

   To scale. A at 160, B at 80, C at 330, D at 250 (so A, B, C, D run clockwise
   round the circle). Arcs clockwise: A-B 80, B-C 110, C-D 80, D-A 90 (sum 360).
   An inscribed angle is half the arc that does NOT contain its vertex:
     angle A = (110 + 80) / 2 = 95      angle C = (90 + 80) / 2 = 85   ✓
     angle B = ( 80 +  90) / 2 = 85      angle D = (80 + 110) / 2 = 95   ✓
   So A + C = 180 and B + D = 180, as a cyclic quadrilateral must, and the
   exterior angle EBC = 180 - 85 = 95, which is angle D exactly.  ✓

   The panelId MUST match panel_memos.panel_id in phase16.sql. The memo lives
   server-side — a learner with devtools must not be able to read the answer
   out of this file. `memoDisplay` is the teaching text shown only after five
   misses, which is a different thing and safe to ship. */

const AC = "#9c36b5";

const QUAD = [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"]];

/* the two opposite angles: 95 and 85, adding to 180 */
const FIG_OPP = {
  pts: { A: 160, B: 80, C: 330, D: 250 },
  chords: QUAD,
  angles: [
    { at: "A", legs: ["D", "B"], t: "95°", o: { v: 95, r: 38 } },
    { at: "C", legs: ["B", "D"], t: "85°", o: { v: 85, r: 38 } },
  ],
};

/* AB extended to E: the exterior angle at B equals the interior opposite D */
const FIG_EXT = {
  pts: { A: 160, B: 80, C: 330, D: 250 },
  out: [{ name: "E", along: ["A", "B"], len: 34 }],
  chords: [...QUAD, ["B", "E"]],
  angles: [
    { at: "B", legs: ["E", "C"], t: "95°", o: { v: 95, r: 34 } },
    { at: "D", legs: ["A", "C"], t: "95°", o: { v: 95, r: 38 } },
  ],
};

/* ---- CHUNK D · tangent-radius — the converse that IS true and useful ----
   Panels 2 and 3 show a false converse and a true-but-useless one. This
   theorem is the station's own promised third case: clean, TRUE, and the
   one riders actually use to prove a line is a tangent. It sits between
   panel 3 and panel 4 on purpose — a fourth example, on a different
   theorem, before the station commits to one long argument about the
   cyclic-quad converse. Reuses the plain O–radius–tangent figure already
   verified for round09 (`r9`) and for the discovery round `dtanrad`; no
   new interactive, no new memo row. */
const TANRAD_FIG = {
  O: true,
  pts: { T: 270 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: [["O", "T"]],
  angles: [{ at: "T", legs: ["tg+", "O"], t: "", o: { v: 90, mark: 1 } }],
};

export const round = {
  id: "inv5", n: 0, accent: AC, kind: "investigate", group: "g6",
  title: { en: "Turn It Around", af: "Draai Dit Om" },
  blurb: {
    en: "Converses. Every theorem can be read backwards — and reading it backwards makes a brand-new claim that owes you its own proof.",
    af: "Omgekeerdes. Elke stelling kan agteruit gelees word — en agteruit gelees, maak dit 'n splinternuwe bewering wat jou sy eie bewys skuld.",
  },
  panels: [

    /* ---------- 1 · what a converse actually is ---------- */
    {
      type: "note",
      prompt: { en: "Swap the two halves and you have a different theorem", af: "Ruil die twee helftes om en jy het 'n ander stelling" },
      diagram: FIG_OPP,
      /* THE SPRINKLER (N17). Megan: "I think we should include this… that makes
         a lot of sense here, it will help them understand." It goes exactly
         here, straight after "which is lucky" — the rain pair IS the unlucky
         case that sentence sets up. A non-circle example is on topic rather
         than a digression: this station is about converses in general, and the
         whole difficulty is that the asymmetry is a LOGICAL one, not a
         geometric one. `s5p4` calls back to it. */
      note: {
        en: "Every theorem has the shape <b>IF this, THEN that</b>.<br><br>\"<b>If</b> ABCD is a cyclic quadrilateral, <b>then</b> ∠A + ∠C = 180°.\" You start from cyclic and you end at 180°.<br><br>Its <b>converse</b> swaps the halves: \"<b>If</b> ∠A + ∠C = 180°, <b>then</b> ABCD is a cyclic quadrilateral.\" Now you start from 180° and you end at cyclic.<br><br>That is not the same sentence rearranged — it is a different claim, going the other way, and it needs its own proof. This one happens to be true, which is lucky, because it is how every \"prove that ABCD is cyclic\" question in the paper gets done.<br><br>It does not always work out that way. \"If it is raining, the ground is wet\" is true. Turn it around — \"if the ground is wet, it is raining\" — and it is false: someone's sprinkler was on. Same shape, opposite verdicts. That is why a converse has to earn its own proof.<br><br>The next two panels show what else can happen.",
        af: "Elke stelling het die vorm <b>AS dit, DAN dat</b>.<br><br>\"<b>As</b> ABCD 'n koordevierhoek is, <b>dan</b> is ∠A + ∠C = 180°.\" Jy begin by koordies en eindig by 180°.<br><br>Sy <b>omgekeerde</b> ruil die helftes om: \"<b>As</b> ∠A + ∠C = 180°, <b>dan</b> is ABCD 'n koordevierhoek.\" Nou begin jy by 180° en eindig by koordies.<br><br>Dit is nie dieselfde sin herrangskik nie — dit is 'n ander bewering, in die ander rigting, en dit het sy eie bewys nodig. Hierdie een is gelukkig waar, want dit is hoe elke \"bewys dat ABCD koordies is\"-vraag in die vraestel gedoen word.<br><br>Dit werk nie altyd so uit nie. \"As dit reën, is die grond nat\" is waar. Draai dit om — \"as die grond nat is, reën dit\" — en dit is onwaar: iemand se sproeier was aan. Dieselfde vorm, teenoorgestelde uitkomste. Daarom moet 'n omgekeerde sy eie bewys verdien.<br><br>Die volgende twee panele wys wat nog kan gebeur.",
      },
    },

    /* ---------- 2 · a converse that is FALSE ---------- */
    {
      type: "choice",
      prompt: {
        en: "The theorem: the exterior angle of a cyclic quadrilateral equals the interior OPPOSITE angle. A learner turns it around and writes: \"If an exterior angle of a quadrilateral equals an interior angle, the quadrilateral is cyclic.\" Is that converse true?",
        af: "Die stelling: die buitehoek van 'n koordevierhoek is gelyk aan die teenoorstaande BINNEHOEK. 'n Leerder draai dit om en skryf: \"As 'n buitehoek van 'n vierhoek gelyk is aan 'n binnehoek, is die vierhoek koordies.\" Is daardie omgekeerde waar?",
      },
      diagram: FIG_EXT,
      options: [
        { text: { en: "False — it must equal the interior OPPOSITE angle, not just any interior angle.",
                  af: "Onwaar — dit moet gelyk wees aan die teenoorstaande BINNEHOEK, nie enige binnehoek nie." }, correct: true },
        { text: { en: "True — dropping the word \"opposite\" changes nothing.",
                  af: "Waar — om die woord \"teenoorstaande\" te laat val, verander niks." } },
        { text: { en: "True, but only when the quadrilateral has a pair of parallel sides.",
                  af: "Waar, maar net wanneer die vierhoek 'n paar ewewydige sye het." } },
        { text: { en: "False — this theorem has no true converse at all.",
                  af: "Onwaar — hierdie stelling het glad geen ware omgekeerde nie." } },
      ],
      hints: [
        { en: "The learner dropped one word. Ask what that word was doing there, and then look for a quadrilateral that satisfies the shortened version.",
          af: "Die leerder het een woord laat val. Vra wat daardie woord daar gedoen het, en soek dan 'n vierhoek wat die verkorte weergawe bevredig." },
        { en: "Think of a slanted parallelogram. Extend one side: the exterior angle there is equal to an interior angle of the parallelogram — but a slanted parallelogram has no circle through its four corners.",
          af: "Dink aan 'n skuins parallelogram. Verleng een sy: die buitehoek daar is gelyk aan 'n binnehoek van die parallelogram — maar 'n skuins parallelogram het geen sirkel deur sy vier hoekpunte nie." },
      ],
      reason: "cyclicExtConv",
      note: {
        en: "Here is the counterexample. Take a parallelogram that is not a rectangle. Its co-interior angles add to 180°, so the exterior angle at B equals the interior angle at A — an interior angle, sitting right next door instead of opposite. The shortened converse says that makes it cyclic. It does not: a slanted parallelogram has no circle through all four corners. The real converse, with \"opposite\" left in, is true and is on the reason list as <i>converse ext ∠ of cyclic quad</i>. One word was carrying the whole theorem.",
        af: "Hier is die teenvoorbeeld. Neem 'n parallelogram wat nie 'n reghoek is nie. Sy ko-binnehoeke tel op tot 180°, dus is die buitehoek by B gelyk aan die binnehoek by A — 'n binnehoek, wat reg langsaan sit in plaas van teenoor. Die verkorte omgekeerde sê dit maak dit koordies. Dit doen nie: 'n skuins parallelogram het geen sirkel deur al vier hoekpunte nie. Die werklike omgekeerde, met \"teenoorstaande\" nog in, is waar en staan op die redelys as <i>omgekeerde buite∠ van kvh</i>. Een woord het die hele stelling gedra.",
      },
    },

    /* ---------- 3 · a converse that is TRUE and still no use ---------- */
    {
      type: "choice",
      prompt: {
        en: "Another one. The theorem: the four vertices of a cyclic quadrilateral all lie on one circle. Turned around: \"If the four vertices of a quadrilateral all lie on one circle, the quadrilateral is cyclic.\" What do you make of that converse?",
        af: "Nog een. Die stelling: die vier hoekpunte van 'n koordevierhoek lê almal op een sirkel. Omgedraai: \"As die vier hoekpunte van 'n vierhoek almal op een sirkel lê, is die vierhoek koordies.\" Wat maak jy van daardie omgekeerde?",
      },
      diagram: FIG_OPP,
      options: [
        { text: { en: "True — but it is only the definition read backwards, so it is no use as a test.",
                  af: "Waar — maar dit is net die definisie agteruit gelees, dus is dit geen nut as toets nie." }, correct: true },
        { text: { en: "False — lying on one circle is not enough to make it cyclic.",
                  af: "Onwaar — om op een sirkel te lê is nie genoeg om dit koordies te maak nie." } },
        { text: { en: "True, and it is the quickest way to prove a quadrilateral is cyclic.",
                  af: "Waar, en dit is die vinnigste manier om te bewys 'n vierhoek is koordies." } },
        { text: { en: "It cannot be judged true or false without measuring a diagram.",
                  af: "Dit kan nie as waar of onwaar beoordeel word sonder om 'n diagram te meet nie." } },
      ],
      hints: [
        { en: "It is definitely true. The harder question is whether it could ever help you in a rider — so ask what a rider would have to GIVE you before you could use it.",
          af: "Dit is definitief waar. Die moeiliker vraag is of dit jou ooit in 'n vraagstuk kan help — vra dus wat 'n vraagstuk jou moes GEE voordat jy dit kon gebruik." },
        { en: "\"All four vertices lie on one circle\" is what the word cyclic MEANS. A rider never hands you that; if it did, there would be nothing left to prove.",
          af: "\"Al vier hoekpunte lê op een sirkel\" is wat die woord koordies BETEKEN. 'n Vraagstuk gee jou dit nooit; as dit sou, was daar niks oor om te bewys nie." },
      ],
      note: {
        en: "True, and completely useless — which is a third possibility worth knowing about. A converse earns its place in your toolkit only when it starts from something a question can actually GIVE you (two angles adding to 180°, a 90°, two equal angles on a chord, a length) and ends somewhere you could not otherwise go. This one starts from the conclusion itself, so it moves you nowhere. Compare it with the converse in panel 1: that one starts at \"∠A + ∠C = 180°\", which is exactly the kind of thing you can work out from a diagram — and that is why it is the one you actually use.",
        af: "Waar, en heeltemal nutteloos — wat 'n derde moontlikheid is wat die moeite werd is om te ken. 'n Omgekeerde verdien sy plek in jou gereedskapkis net wanneer dit begin by iets wat 'n vraag jou werklik kan GEE (twee hoeke wat tot 180° optel, 'n 90°, twee gelyke hoeke op 'n koord, 'n lengte) en eindig waar jy nie andersins kon kom nie. Hierdie een begin by die gevolgtrekking self, dus bring dit jou nêrens. Vergelyk dit met die omgekeerde in paneel 1: daardie een begin by \"∠A + ∠C = 180°\", wat presies die soort ding is wat jy uit 'n diagram kan uitwerk — en dit is hoekom dit die een is wat jy werklik gebruik.",
      },
    },

    /* ---------- 3b · judge it: a converse that is TRUE and USEFUL ---------- */
    {
      type: "choice",
      prompt: {
        en: "One more, a different theorem this time: a tangent is perpendicular to the radius at the point of contact. Turned around: \"If a line is perpendicular to a radius at the point where it meets the circle, then it is a tangent.\" What do you make of that converse?",
        af: "Nog een, 'n ander stelling hierdie keer: 'n raaklyn is loodreg op die radius by die raakpunt. Omgedraai: \"As 'n lyn loodreg is op 'n radius by die punt waar dit die sirkel ontmoet, dan is dit 'n raaklyn.\" Wat maak jy van daardie omgekeerde?",
      },
      diagram: TANRAD_FIG,
      options: [
        { text: { en: "True, and useful — a single right angle at the exact point of contact is the whole proof that the line is a tangent.",
                  af: "Waar, en nuttig — een enkele regte hoek by die presiese raakpunt is die hele bewys dat die lyn 'n raaklyn is." }, correct: true },
        { text: { en: "False — a right angle where a line meets a circle does not always mean that line is a tangent.",
                  af: "Onwaar — 'n regte hoek waar 'n lyn die sirkel ontmoet beteken nie altyd die lyn is 'n raaklyn nie." } },
        { text: { en: "True, but useless — it only restates the original theorem's definition read backwards, proving nothing new.",
                  af: "Waar, maar nutteloos — dit herhaal net die oorspronklike stelling se definisie agteruit, en bewys niks nuuts nie." } },
        { text: { en: "It cannot be judged true or false without first measuring the actual diagram for yourself.",
                  af: "Dit kan nie as waar of onwaar beoordeel word sonder om die werklike diagram self te meet nie." } },
      ],
      hints: [
        { en: "Try to picture a line that makes a right angle with a radius at the very point it meets the circle, but is NOT a tangent. Can you find one?",
          af: "Probeer 'n lyn voorstel wat 'n regte hoek met 'n radius maak by presies die punt waar dit die sirkel ontmoet, maar wat NIE 'n raaklyn is nie. Kan jy een kry?" },
        { en: "You can't — a line that meets a circle at exactly one point AND is perpendicular to the radius there cannot cross the circle again. That is exactly why riders use this converse to PROVE a line is a tangent, not just to describe one.",
          af: "Jy kan nie — 'n lyn wat die sirkel op presies een punt ontmoet EN loodreg op die radius daar is, kan nie weer deur die sirkel sny nie. Dit is presies hoekom vraagstukke hierdie omgekeerde gebruik om te BEWYS 'n lyn is 'n raaklyn, nie net om een te beskryf nie." },
      ],
      reason: "tanRadiusConv",
      note: {
        en: "True and useful — that makes three kinds of converse now met: false (drop one word and the exterior-angle converse breaks), true but useless (the four-vertices one, which is just the definition), and now true and useful. tan ⊥ radius joins converse opp ∠s of cyclic quad as one of the small set of converses a rider actually uses — and it needs only ONE right angle at the point of contact to work, nothing else.",
        af: "Waar en nuttig — dit maak nou drie soorte omgekeerdes wat jy teëgekom het: onwaar (laat een woord val en die buitehoek-omgekeerde breek), waar maar nutteloos (die vier-hoekpunte-een, wat net die definisie is), en nou waar en nuttig. raaklyn ⊥ radius sluit aan by omgekeerde teenoorst. ∠e van kvh as een van die klein groepie omgekeerdes wat 'n vraagstuk werklik gebruik — en dit het net EEN regte hoek by die raakpunt nodig om te werk, niks anders nie.",
      },
    },

    /* ---------- 3c · apply it ---------- */
    {
      type: "choice",
      prompt: {
        en: "You've shown ∠OTU = 90°, where O is the centre, T is a point on the circle, and SU is a straight line through T. What can you conclude, and why?",
        af: "Jy het getoon ∠OTU = 90°, waar O die middelpunt is, T 'n punt op die sirkel is, en SU 'n reguit lyn deur T is. Wat kan jy aflei, en hoekom?",
      },
      diagram: TANRAD_FIG,
      options: [
        { text: { en: "SU is a tangent to the circle at T — that is exactly what the converse tan ⊥ radius proves.",
                  af: "SU is 'n raaklyn aan die sirkel by T — dit is presies wat die omgekeerde raaklyn ⊥ radius bewys." }, correct: true },
        { text: { en: "OT bisects SU — that conclusion needs a line from the centre to a chord's midpoint, not this.",
                  af: "OT halveer SU — daardie gevolgtrekking het 'n lyn van die middelpunt na 'n koord se middelpunt nodig, nie hierdie een nie." } },
        { text: { en: "Only that T lies on the circle — a single right angle is not enough to say anything more than that.",
                  af: "Net dat T op die sirkel lê — een regte hoek alleen is nie genoeg om meer as dit te sê nie." } },
        { text: { en: "Nothing at all — one right angle can never be enough to prove that a line is a tangent.",
                  af: "Glad niks nie — een regte hoek kan nooit genoeg wees om te bewys 'n lyn is 'n raaklyn nie." } },
      ],
      hints: [
        { en: "You judged this exact converse two panels ago. Was it true and useful, or not?",
          af: "Jy het hierdie presiese omgekeerde twee panele terug beoordeel. Was dit waar en nuttig, of nie?" },
        { en: "It was true and useful: one right angle between a radius and a line, formed exactly at the point where the line meets the circle, is the whole proof that the line is a tangent — nothing else is needed.",
          af: "Dit was waar en nuttig: een regte hoek tussen 'n radius en 'n lyn, gevorm presies by die punt waar die lyn die sirkel ontmoet, is die hele bewys dat die lyn 'n raaklyn is — niks anders word benodig nie." },
      ],
      reason: "tanRadiusConv",
      note: {
        en: "SU is a tangent — converse tan ⊥ radius. This is one of the shortest converses in the whole toolkit: one right angle, at the exact point of contact, is the complete proof. Compare that with the cyclic-quad converse coming up next, which needs an entire pair of opposite angles adding to 180° before it can conclude anything at all.",
        af: "SU is 'n raaklyn — omgekeerde raaklyn ⊥ radius. Dit is een van die kortste omgekeerdes in die hele gereedskapkis: een regte hoek, by die presiese raakpunt, is die volledige bewys. Vergelyk dit met die koordevierhoek-omgekeerde wat volgende kom, wat 'n hele paar teenoorstaande hoeke wat tot 180° optel nodig het voordat dit enigiets kan aflei.",
      },
    },

    /* ---------- 4 · build the IF…THEN pair before reasoning about it ----------
       THE FIRST HALF OF THE s5p4 SPLIT (N15, her call: "Split it"). Made a TAP
       rather than a second typed panel on purpose: it needs no checker call, no
       12-second wait and NO NEW MEMO ROW, and recognising the swap is exactly
       the scaffolding N16 found missing. The inverse ("if NOT cyclic then NOT
       180°") is in there as a distractor because it is the mistake this shape
       actually invites, and it is worth a name. */
    {
      type: "choice",
      prompt: {
        en: "One step before the hard question. Here is the theorem in the IF…THEN shape:\n\nIF the quadrilateral is cyclic, THEN its opposite ∠s add up to 180°.\n\nWhich of these is its CONVERSE?",
        af: "Een stap voor die moeilike vraag. Hier is die stelling in die AS…DAN-vorm:\n\nAS die vierhoek koordies is, DAN tel sy teenoorstaande ∠e op tot 180°.\n\nWatter een hiervan is sy OMGEKEERDE?",
      },
      diagram: FIG_OPP,
      options: [
        { text: { en: "IF its opposite ∠s add up to 180°, THEN the quadrilateral is cyclic.",
                  af: "AS sy teenoorstaande ∠e tot 180° optel, DAN is die vierhoek koordies." }, correct: true },
        { text: { en: "IF the quadrilateral is not cyclic, THEN its opposite ∠s do not add up to 180°.",
                  af: "AS die vierhoek nie koordies is nie, DAN tel sy teenoorstaande ∠e nie tot 180° op nie." } },
        { text: { en: "IF the quadrilateral is cyclic, THEN its opposite ∠s are equal to each other.",
                  af: "AS die vierhoek koordies is, DAN is sy teenoorstaande ∠e gelyk aan mekaar." } },
        { text: { en: "IF its opposite ∠s add up to 180°, THEN its other two ∠s do as well.",
                  af: "AS sy teenoorstaande ∠e tot 180° optel, DAN doen sy ander twee ∠e dit ook." } },
      ],
      hints: [
        { en: "A converse swaps the two halves round and changes nothing else. Which sentence has the IF half and the THEN half in the other order, with the same words in them?",
          af: "'n Omgekeerde ruil die twee helftes om en verander niks anders nie. Watter sin het die AS-helfte en die DAN-helfte in die ander orde, met dieselfde woorde daarin?" },
        { en: "Take the words after IF and the words after THEN and trade their places — that is the converse. One option puts \"not\" into both halves instead, which is a different thing altogether; the other two quietly change what the THEN half says.",
          af: "Vat die woorde ná AS en die woorde ná DAN en ruil hul plekke om — dit is die omgekeerde. Een opsie sit eerder \"nie\" in albei helftes, wat 'n heeltemal ander ding is; die ander twee verander stilweg wat die DAN-helfte sê." },
      ],
      reason: "cyclicOppConv",
      note: {
        en: "That is the converse: the same two halves, traded round. The one that put \"not\" into both halves is a different sentence with its own name — the <b>inverse</b> — and it is not what a converse means, so watch for it. The other two changed the THEN half, which makes them new claims rather than a turn-around of this one.<br><br>You now have the pair. The next panel asks the question the whole station is built on, and you will need both sentences side by side to answer it.",
        af: "Dit is die omgekeerde: dieselfde twee helftes, omgeruil. Die een wat \"nie\" in albei helftes gesit het, is 'n ander sin met sy eie naam — die <b>inverse</b> — en dit is nie wat 'n omgekeerde beteken nie, dus hou dit dop. Die ander twee het die DAN-helfte verander, wat hulle nuwe bewerings maak eerder as 'n omdraai van hierdie een.<br><br>Jy het nou die paar. Die volgende paneel vra die vraag waarop die hele stasie gebou is, en jy sal albei sinne langs mekaar nodig hê om dit te antwoord.",
      },
    },

    /* ---------- 5 · typed: why one direction never carries the other ----------
       N16. Megan: "I swear, I am not lazy, I just don't know what to answer
       here." The panel asked a general question while panels 1-3 gave three
       CONCRETE converses and none of them was on screen any more, and the frame
       that makes it answerable sat in panel 1, three panels back, with hint
       rung 1 holding the rest — three misses away. The pair is now restated on
       the panel itself, with the sprinkler callback next to it. */
    {
      type: "written",
      panelId: "s5p4",
      prompt: {
        en: "Here is the pair again, side by side:\n\nTheorem:   IF ABCD is cyclic, THEN ∠A + ∠C = 180°.\nConverse:  IF ∠A + ∠C = 180°, THEN ABCD is cyclic.\n\nAnd remember the sprinkler: the rain sentence was true and its turn-around was false, with no change to the shape at all.\n\nYou have now seen a converse that is true, one that is false, and one that is true but no use. So here is the underlying question: why does proving a theorem not prove its converse as well?",
        af: "Hier is die paar weer, langs mekaar:\n\nStelling:    AS ABCD koordies is, DAN is ∠A + ∠C = 180°.\nOmgekeerde:  AS ∠A + ∠C = 180°, DAN is ABCD koordies.\n\nEn onthou die sproeier: die reënsin was waar en sy omdraai was onwaar, met glad geen verandering aan die vorm nie.\n\nJy het nou 'n omgekeerde gesien wat waar is, een wat onwaar is, en een wat waar maar nutteloos is. Hier is dus die onderliggende vraag: hoekom bewys die bewys van 'n stelling nie ook sy omgekeerde nie?",
      },
      diagram: FIG_OPP,
      minChars: 25,
      placeholder: {
        en: "Because the converse starts from…",
        af: "Omdat die omgekeerde begin by…",
      },
      needs: [
        { en: "say what a converse does to the theorem's given and its conclusion",
          af: "sê wat 'n omgekeerde aan die stelling se gegewe en sy gevolgtrekking doen" },
        { en: "say what that means for whether it is true, and what it needs",
          af: "sê wat dit beteken vir of dit waar is, en wat dit nodig het" },
        { en: "no example or theorem name needed",
          af: "geen voorbeeld of stellingnaam nodig nie" },
      ],
      starters: [
        { en: "The converse swaps…", af: "Die omgekeerde ruil…" },
        { en: "So it is a different claim, which means…", af: "Dus is dit 'n ander bewering, wat beteken…" },
      ],
      hints: [
        { en: "Look at the two sentences above and compare where each one STARTS and where each one FINISHES. What has moved?",
          af: "Kyk na die twee sinne hierbo en vergelyk waar elkeen BEGIN en waar elkeen EINDIG. Wat het geskuif?" },
        { en: "The given and the conclusion have changed places, so the second sentence is not the first one in different words — it is a new claim. A proof of the first one starts from \"cyclic\" and works towards 180°, so not one of its steps is available to somebody who has only been handed the 180°. And a new claim can turn out false, as the sprinkler and the parallelogram both showed.",
          af: "Die gegewe en die gevolgtrekking het plekke geruil, dus is die tweede sin nie die eerste een in ander woorde nie — dit is 'n nuwe bewering. 'n Bewys van die eerste een begin by \"koordies\" en werk na 180° toe, dus is nie een van sy stappe beskikbaar vir iemand wat net die 180° gekry het nie. En 'n nuwe bewering kan onwaar blyk te wees, soos die sproeier en die parallelogram albei gewys het." },
      ],
      memoDisplay: {
        en: "Because the converse swaps what is GIVEN with what is CONCLUDED, so it is a different claim and needs its own proof. \"If AB is a diameter, then ∠ACB = 90°\" starts at a diameter and ends at 90°; its converse starts at 90° and ends at a diameter.<br><br>And here is why you cannot just run the original proof backwards: that proof STARTS FROM the given and uses it at every step to reach the conclusion. The converse hands you the conclusion and asks for the given, so none of those steps is available to you — it is a different journey, not the same journey in reverse. Sometimes the other direction is simply false, as the sprinkler and the parallelogram both showed.",
        af: "Omdat die omgekeerde die GEGEWE met die GEVOLGTREKKING omruil, dus is dit 'n ander bewering en het dit sy eie bewys nodig. \"As AB 'n middellyn is, dan is ∠ACB = 90°\" begin by 'n middellyn en eindig by 90°; sy omgekeerde begin by 90° en eindig by 'n middellyn.<br><br>En hier is hoekom jy nie die oorspronklike bewys net agteruit kan laat loop nie: daardie bewys BEGIN BY die gegewe en gebruik dit by elke stap om die gevolgtrekking te bereik. Die omgekeerde gee jou die gevolgtrekking en vra vir die gegewe, dus is nie een van daardie stappe vir jou beskikbaar nie — dit is 'n ander reis, nie dieselfde reis agteruit nie. Soms is die ander rigting eenvoudig onwaar, soos die sproeier en die parallelogram albei gewys het.",
      },
      note: {
        en: "This is why every converse on the reason list carries the word <i>converse</i> in front of it, and why writing the plain theorem's name where a converse is needed loses the mark: the marker cannot tell whether you knew which direction you were travelling.",
        af: "Dit is hoekom elke omgekeerde op die redelys die woord <i>omgekeerde</i> voor dit dra, en hoekom dit die punt kos om die gewone stelling se naam te skryf waar 'n omgekeerde nodig is: die nasiener kan nie sien of jy geweet het in watter rigting jy gereis het nie.",
      },
    },

    /* ---------- 6 · pick the converse that fits what you were given ---------- */
    {
      type: "choice",
      prompt: {
        en: "In quadrilateral ABCD you have worked out that ∠A = 95° and ∠C = 85°. You must prove ABCD is a cyclic quadrilateral. Which reason do you write?",
        af: "In vierhoek ABCD het jy uitgewerk dat ∠A = 95° en ∠C = 85°. Jy moet bewys ABCD is 'n koordevierhoek. Watter rede skryf jy?",
      },
      diagram: FIG_OPP,
      options: [
        { text: { en: "converse opp ∠s of cyclic quad", af: "omgekeerde teenoorst. ∠e van kvh" }, correct: true },
        { text: { en: "converse ext ∠ of cyclic quad", af: "omgekeerde buite∠ van kvh" } },
        { text: { en: "converse ∠s in the same seg", af: "omgekeerde ∠e in dieselfde segment" } },
        { text: { en: "converse ∠s in semi-circle", af: "omgekeerde ∠ in halwe sirkel" } },
      ],
      hints: [
        { en: "Add the two angles you were given, and check where they sit in the quadrilateral. Then pick the converse whose IF half is exactly that.",
          af: "Tel die twee gegewe hoeke op, en kyk waar hulle in die vierhoek sit. Kies dan die omgekeerde wie se AS-helfte presies dit is." },
        { en: "95° + 85° = 180°, and A and C are opposite corners. Which converse begins with two opposite angles adding to 180°?",
          af: "95° + 85° = 180°, en A en C is teenoorstaande hoekpunte. Watter omgekeerde begin met twee teenoorstaande hoeke wat tot 180° optel?" },
      ],
      reason: "cyclicOppConv",
      note: {
        en: "∠A + ∠C = 180° and they are opposite angles, so the converse of the opposite-angles theorem is the one that fits. The other three are all real converses that all conclude something useful — they just start somewhere you have not been given. The exterior-angle converse needs a side extended; the same-segment converse needs two equal angles on one chord; the semi-circle converse needs a 90°. Choosing a converse is not about which theorem you like: it is about matching the IF half to what the question actually handed you.",
        af: "∠A + ∠C = 180° en hulle is teenoorstaande hoeke, dus is die omgekeerde van die teenoorstaande-hoeke-stelling die een wat pas. Die ander drie is almal werklike omgekeerdes wat almal iets nuttigs aflei — hulle begin net ergens waar jy nie gegee is nie. Die buitehoek-omgekeerde het 'n verlengde sy nodig; die selfde-segment-omgekeerde het twee gelyke hoeke op een koord nodig; die halfsirkel-omgekeerde het 'n 90° nodig. Om 'n omgekeerde te kies gaan nie oor watter stelling jy verkies nie: dit gaan oor die pas van die AS-helfte by wat die vraag jou werklik gegee het.",
      },
    },

  ],
};
