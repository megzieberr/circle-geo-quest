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
      note: {
        en: "Every theorem has the shape <b>IF this, THEN that</b>.<br><br>\"<b>If</b> ABCD is a cyclic quadrilateral, <b>then</b> ∠A + ∠C = 180°.\" You start from cyclic and you end at 180°.<br><br>Its <b>converse</b> swaps the halves: \"<b>If</b> ∠A + ∠C = 180°, <b>then</b> ABCD is a cyclic quadrilateral.\" Now you start from 180° and you end at cyclic.<br><br>That is not the same sentence rearranged — it is a different claim, going the other way, and it needs its own proof. This one happens to be true, which is lucky, because it is how every \"prove that ABCD is cyclic\" question in the paper gets done. The next two panels show what else can happen.",
        af: "Elke stelling het die vorm <b>AS dit, DAN dat</b>.<br><br>\"<b>As</b> ABCD 'n koordevierhoek is, <b>dan</b> is ∠A + ∠C = 180°.\" Jy begin by koordies en eindig by 180°.<br><br>Sy <b>omgekeerde</b> ruil die helftes om: \"<b>As</b> ∠A + ∠C = 180°, <b>dan</b> is ABCD 'n koordevierhoek.\" Nou begin jy by 180° en eindig by koordies.<br><br>Dit is nie dieselfde sin herrangskik nie — dit is 'n ander bewering, in die ander rigting, en dit het sy eie bewys nodig. Hierdie een is gelukkig waar, want dit is hoe elke \"bewys dat ABCD koordies is\"-vraag in die vraestel gedoen word. Die volgende twee panele wys wat nog kan gebeur.",
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

    /* ---------- 4 · typed: why one direction never carries the other ---------- */
    {
      type: "written",
      panelId: "s5p4",
      prompt: {
        en: "You have now seen a converse that is true, one that is false, and one that is true but no use. So here is the underlying question: why does proving a theorem not prove its converse as well?",
        af: "Jy het nou 'n omgekeerde gesien wat waar is, een wat onwaar is, en een wat waar maar nutteloos is. Hier is dus die onderliggende vraag: hoekom bewys die bewys van 'n stelling nie ook sy omgekeerde nie?",
      },
      diagram: FIG_OPP,
      minChars: 25,
      placeholder: {
        en: "Because the converse starts from…",
        af: "Omdat die omgekeerde begin by…",
      },
      starters: [
        { en: "The converse swaps…", af: "Die omgekeerde ruil…" },
        { en: "So it is a different claim, which means…", af: "Dus is dit 'n ander bewering, wat beteken…" },
      ],
      hints: [
        { en: "Write the theorem out as IF … THEN …, then write the converse under it the same way. Compare where each one starts and where each one finishes.",
          af: "Skryf die stelling uit as AS … DAN …, en skryf die omgekeerde daaronder op dieselfde manier. Vergelyk waar elkeen begin en waar elkeen eindig." },
        { en: "The given and the conclusion have changed places, so the second sentence is not the first one in different words — it is a new claim, and panel 2 showed that a new claim can turn out false.",
          af: "Die gegewe en die gevolgtrekking het plekke geruil, dus is die tweede sin nie die eerste een in ander woorde nie — dit is 'n nuwe bewering, en paneel 2 het gewys 'n nuwe bewering kan onwaar blyk te wees." },
      ],
      memoDisplay: {
        en: "Because the converse swaps what is GIVEN with what is CONCLUDED, so it is a different claim and needs its own proof. \"If AB is a diameter, then ∠ACB = 90°\" starts at a diameter and ends at 90°; its converse starts at 90° and ends at a diameter. Proving one direction says nothing at all about the other — and sometimes the other direction is simply false, as the parallelogram counterexample showed.",
        af: "Omdat die omgekeerde die GEGEWE met die GEVOLGTREKKING omruil, dus is dit 'n ander bewering en het dit sy eie bewys nodig. \"As AB 'n middellyn is, dan is ∠ACB = 90°\" begin by 'n middellyn en eindig by 90°; sy omgekeerde begin by 90° en eindig by 'n middellyn. Om die een rigting te bewys sê glad niks oor die ander nie — en soms is die ander rigting eenvoudig onwaar, soos die parallelogram-teenvoorbeeld gewys het.",
      },
      note: {
        en: "This is why every converse on the reason list carries the word <i>converse</i> in front of it, and why writing the plain theorem's name where a converse is needed loses the mark: the marker cannot tell whether you knew which direction you were travelling.",
        af: "Dit is hoekom elke omgekeerde op die redelys die woord <i>omgekeerde</i> voor dit dra, en hoekom dit die punt kos om die gewone stelling se naam te skryf waar 'n omgekeerde nodig is: die nasiener kan nie sien of jy geweet het in watter rigting jy gereis het nie.",
      },
    },

    /* ---------- 5 · pick the converse that fits what you were given ---------- */
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
