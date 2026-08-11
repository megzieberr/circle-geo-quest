/* Proof rounds P0 — "Why proofs?"  (PROOF-ROUNDS-PLAN.md)
   ------------------------------------------------------------------------
   The bridge round: the class just finished 43 rounds of dragging, measuring
   and noticing patterns (plus, for whoever played it, the Investigation
   Station). None of that proved anything, and this round says so plainly,
   then hands them the reason proofs exist at all.

   Renders through the SAME renderInvestigate() the Investigation Station
   uses (js/investigate.js) — round `kind: "proof"` gets `predict`, `choice`,
   `note` panels and per-panel XP for free. No new panel type, no `written`
   panel (typed answers are banned by the plan; the marking key is expired
   anyway), no new engine surface.

   FIVE PANELS, all taps:
     1 · note    — define conjecture vs theorem, landing whether or not the
                   learner ever played the Station.
     2 · choice  — why measuring, however much of it, can never be enough.
     3 · choice  — what actually turns a conjecture into a theorem.
     4 · predict — the wonder moment's guess: three bare dots, how many
                   circles pass through all three? Every option accepted.
     5 · note    — the reveal (exactly one, always — and why) plus the
                   takeaway. Genuinely the last panel of this round, so it is
                   the one place allowed to read like a closing line.

   THE WONDER-MOMENT DIAGRAM PAIR (panels 4 and 5) reuses ONE set of
   coordinates so the two pictures are honestly the same triangle, not two
   different ones that happen to look similar:
     · panel 4 draws A, B, C as FREE {x,y} points (`noCircle: true`) — no
       circle, because the whole point is that none has been decided yet.
     · panel 5 draws the SAME points as degrees on the engine's default
       circle (cx 160, cy 120, R 80) — A:200 B:340 C:60. pol(cx,cy,R,deg)
       for those three degrees resolves to the exact {x,y} used in panel 4
       (worked out by hand below), so nothing here is reusing a spec object
       across two shapes — it is the same triangle, redrawn with its circle
       filled in.
     A:200° -> (84.8, 147.4)   B:340° -> (235.2, 147.4)   C:60° -> (200, 50.7)
   These are the SAME three degrees Investigation Station 3 uses for its own
   "three dots always fit a circle, four might not" figure (DOTS3 in
   invest03-break-it.js) — not a coincidence, the wonder moment IS that
   figure's flip side, named as such in panel 5's note.

   Panel 5's second diagram (the perpendicular-bisector construction) is
   built exactly like invest03's FIG_WHY3 — same three degrees, same `mid`
   points, same two 90° marks — because that construction was already
   verified correct there; reusing the numbers rather than inventing new
   ones costs nothing and carries the proof over rather than re-deriving it. */

const AC = "#9c36b5";

/* ---- the wonder-moment pair (panels 4 and 5) ---- */

// panel 4 — three free dots, no circle. Coordinates are pol(160,120,80,deg)
// for deg 200/340/60, worked out by hand in the header above.
const FIG_THREE_FREE = {
  noCircle: true,
  pts: { A: { x: 84.8, y: 147.4 }, B: { x: 235.2, y: 147.4 }, C: { x: 200, y: 50.7 } },
  chords: [["A", "B"], ["B", "C"], ["C", "A"]],
};

// panel 5, picture 1 — the same three points, now on the one circle through them.
const FIG_ON_CIRCLE = {
  O: true,
  pts: { A: 200, B: 340, C: 60 },
  chords: [["A", "B"], ["B", "C"], ["C", "A"]],
};

// panel 5, picture 2 — why: O sits on the perpendicular bisector of AB (via M)
// and of BC (via N), so it is the one point both bisectors share. Same degrees,
// same construction as invest03-break-it.js's FIG_WHY3.
const FIG_WHY = {
  O: true,
  pts: { A: 200, B: 340, C: 60 },
  mid: [{ name: "M", of: ["A", "B"] }, { name: "N", of: ["B", "C"] }],
  chords: [["A", "B"], ["B", "C"], ["C", "A"], ["O", "M"], ["O", "N"]],
  angles: [
    { at: "M", legs: ["O", "B"], t: "", o: { v: 90, mark: 1 } },
    { at: "N", legs: ["O", "C"], t: "", o: { v: 90, mark: 1 } },
  ],
};

export const round = {
  id: "pr0", n: 0, accent: AC, kind: "proof", group: "g7",
  title: { en: "Why proofs?", af: "Hoekom bewyse?" },
  blurb: {
    en: "The bridge from measuring to proving — and a wonder moment about triangles and circles.",
    af: "Die brug van meet na bewys — en 'n verwonderingsoomblik oor driehoeke en sirkels.",
  },
  panels: [

    /* ---------- 1 · define the two words, before either is needed ---------- */
    {
      type: "note",
      prompt: { en: "Before the first proof", af: "Voor die eerste bewys" },
      note: {
        en: "Whether or not you played the Investigation Station, you have spent this whole chapter doing the same three things: drag a point, measure an angle, notice a pattern. That is genuinely useful work — it is how every one of these theorems was FOUND in the first place. But none of it PROVED anything.<br><br>A <b>conjecture</b> is a claim that looks true everywhere you happened to check it. A <b>theorem</b> is a claim that MUST be true — because there is a chain of reasons, starting from things you already know, that forces it to be true every single time.<br><br>The rest of this chapter builds that chain, one theorem at a time.",
        af: "Of jy die Ondersoekstasie gespeel het of nie, jy het hierdie hele hoofstuk dieselfde drie dinge gedoen: sleep 'n punt, meet 'n hoek, merk 'n patroon op. Dit is werklik nuttige werk — dis hoe elkeen van hierdie stellings in die eerste plek GEVIND is. Maar niks daarvan het iets BEWYS nie.<br><br>'n <b>vermoede</b> is 'n bewering wat waar lyk oral waar jy dit toevallig nagegaan het. 'n <b>stelling</b> is 'n bewering wat WAAR MOET wees — omdat daar 'n ketting van redes is, wat begin by dinge wat jy reeds weet, wat dit dwing om elke enkele keer waar te wees.<br><br>Die res van hierdie hoofstuk bou daardie ketting, een stelling op 'n slag.",
      },
    },

    /* ---------- 2 · why measuring, however much of it, is never enough ---------- */
    {
      type: "choice",
      prompt: {
        en: "You measured a hundred circles, and the angle at the centre was always exactly double the angle at the circumference. Why does that still not count as a proof?",
        af: "Jy het honderd sirkels gemeet, en die hoek by die middelpunt was elke keer presies dubbel die hoek by die omtrek. Hoekom tel dit steeds nie as 'n bewys nie?",
      },
      options: [
        { text: {
            en: "Because there are infinitely many circles, and a hundred checked cases still leave every other one completely untested.",
            af: "Omdat daar oneindig baie sirkels is, en honderd nagegane gevalle steeds elke ander een heeltemal ongetoets laat." }, correct: true },
        { text: {
            en: "Because your protractor readings might be a degree or two off, so none of the hundred numbers can really be trusted.",
            af: "Omdat jou gradeboog-lesings dalk 'n graad of twee verkeerd kan wees, so nie een van die honderd syfers kan eintlik vertrou word nie." } },
        { text: {
            en: "Because a hundred circles is not actually a large sample — a thousand circles would have settled the matter for good.",
            af: "Omdat honderd sirkels nie eintlik 'n groot steekproef is nie — duisend sirkels sou die saak vir goed afgehandel het." } },
        { text: {
            en: "Because the centre and the circumference are two different places, so the two angles were never truly comparable at all.",
            af: "Omdat die middelpunt en die omtrek twee verskillende plekke is, so die twee hoeke was nooit werklik vergelykbaar nie." } },
      ],
      hints: [
        { en: "A protractor being slightly off is a real problem, but it is not the deepest one — imagine a perfectly accurate protractor and ask the question again.",
          af: "'n Gradeboog wat effens verkeerd is, is 'n regte probleem, maar dit is nie die diepste een nie — verbeel jou 'n perfek akkurate gradeboog en vra die vraag weer." },
        { en: "No number of circles you actually draw — a hundred, a thousand, a million — is every circle that exists. There is always one more you have not tried.",
          af: "Geen aantal sirkels wat jy werklik teken nie — honderd, duisend, 'n miljoen — is elke sirkel wat bestaan. Daar is altyd nog een wat jy nie probeer het nie." },
      ],
      note: {
        en: "A protractor being slightly off is real, but it is not the deep reason — even a perfect protractor could only ever check the circles you actually drew. The gap is between \"every case I tried\" and \"every case that exists\", and no amount of trying closes it.",
        af: "'n Gradeboog wat effens verkeerd is, is werklik so, maar dit is nie die diep rede nie — selfs 'n perfekte gradeboog kon net ooit die sirkels wat jy werklik geteken het, nagaan. Die gaping is tussen \"elke geval wat ek probeer het\" en \"elke geval wat bestaan\", en geen hoeveelheid probeer maak dit toe nie.",
      },
    },

    /* ---------- 3 · what actually turns a conjecture into a theorem ---------- */
    {
      type: "choice",
      prompt: {
        en: "Ten circles, ten times the same pattern: the angle at the centre always came out double. That is a solid conjecture. What is actually missing before you are allowed to call it a theorem?",
        af: "Tien sirkels, tien keer dieselfde patroon: die hoek by die middelpunt kom elke keer dubbel uit. Dit is 'n goeie vermoede. Wat ontbreek eintlik voordat jy dit 'n stelling mag noem?",
      },
      options: [
        { text: {
            en: "A logical argument that holds for every possible circle and angle at once, not just the ten you happened to draw.",
            af: "'n Logiese argument wat vir elke moontlike sirkel en hoek gelyktydig geld, nie net vir die tien wat jy toevallig geteken het nie." }, correct: true },
        { text: {
            en: "Twenty more circles, drawn and measured just as carefully as the first ten already were.",
            af: "Twintig meer sirkels, geteken en gemeet net so noukeurig soos die eerste tien alreeds was." } },
        { text: {
            en: "A teacher or a textbook confirming out loud that the pattern you found is correct.",
            af: "'n Onderwyser of 'n handboek wat hardop bevestig dat die patroon wat jy gevind het, korrek is." } },
        { text: {
            en: "Redrawing the same ten circles again, this time with a sharper pencil and a steadier hand.",
            af: "Om dieselfde tien sirkels weer te teken, hierdie keer met 'n skerper potlood en 'n stywer hand." } },
      ],
      hints: [
        { en: "Ask what a hundred more measurements would actually add. Would they cover the circles nobody has drawn yet?",
          af: "Vra wat honderd meer metings eintlik sou bysit. Sou dit die sirkels dek wat niemand nog geteken het nie?" },
        { en: "No amount of measuring reaches every case — only an argument built from reasons that apply to every circle at once can do that.",
          af: "Geen hoeveelheid meting bereik elke geval nie — net 'n argument wat uit redes gebou is wat vir elke sirkel gelyktydig geld, kan dit doen." },
      ],
      note: {
        en: "That is the whole difference. Measuring can only ever visit cases one at a time. A proof names what every case has in common and reasons from there — which is why, from here on, every theorem gets an argument instead of a table of readings.",
        af: "Dit is die hele verskil. Meting kan net ooit een geval op 'n slag besoek. 'n Bewys benoem wat elke geval in gemeen het en redeneer daarvandaan — en dit is hoekom, van hier af, elke stelling 'n argument kry in plaas van 'n tabel lesings.",
      },
    },

    /* ---------- 4 · the wonder moment — a guess, not a question ----------
       A `predict` panel: every option is accepted, nothing here is gated or
       reaches the trajectory stats, and the reveal is deliberately left to
       panel 5 (js/investigate.js's rule for this panel type — see its header
       comment). `after` bridges toward the reason without naming the answer. */
    {
      type: "predict",
      prompt: {
        en: "Here are three dots, marked so that none of them sit in a straight line. Nothing else is drawn — no circle, nothing. If you tried to draw ONE circle that passes through all three, how many different circles could you actually find?",
        af: "Hier is drie kolletjies, gemerk sodat geeneen van hulle in 'n reguit lyn lê nie. Niks anders is geteken nie — geen sirkel, niks. As jy EEN sirkel sou probeer teken wat deur al drie gaan, hoeveel verskillende sirkels sou jy werklik kon vind?",
      },
      diagram: FIG_THREE_FREE,
      options: [
        { text: { en: "None — three separate dots can never all sit on one circle.",
                  af: "Geen een nie — drie los kolletjies kan nooit almal op een sirkel lê nie." } },
        { text: { en: "Exactly one — and it turns out you cannot avoid it.",
                  af: "Presies een — en dit blyk jy kan dit nie vermy nie." }, correct: true },
        { text: { en: "Lots of them — you could fit endlessly many circles through the same three dots.",
                  af: "Baie van hulle — jy sou oneindig baie sirkels deur dieselfde drie kolletjies kon pas." } },
      ],
      reactRight: {
        en: "Good instinct — hold onto it. Let's go and see why.",
        af: "Goeie aanvoeling — hou daaraan vas. Kom ons gaan kyk hoekom.",
      },
      reactWrong: {
        en: "Fair guess — there is genuinely no way to tell just from three bare dots. Let's go and look.",
        af: "Billike raaiskoot — daar is regtig geen manier om dit van drie kaal kolletjies af te sien nie. Kom ons gaan kyk.",
      },
      after: {
        en: "One thing worth knowing before you look: every point that is the same distance from two of your dots lies on one particular line. Hold onto that idea.",
        af: "Een ding is die moeite werd om te weet voordat jy kyk: elke punt wat ewe ver van twee van jou kolletjies af is, lê op een bepaalde lyn. Hou daardie idee vas.",
      },
    },

    /* ---------- 5 · the reveal, and the takeaway ----------
       Genuinely the last panel of this round (later sessions append P1-P9
       AFTER pr0 in the play order, never into it), so this is the one panel
       here allowed to read like a closing line. */
    {
      type: "note",
      prompt: { en: "Exactly one circle — always", af: "Presies een sirkel — altyd" },
      diagrams: [
        { diagram: FIG_ON_CIRCLE, caption: {
            en: "The same three dots — and there they are, all three on one circle.",
            af: "Dieselfde drie kolletjies — en daar is hulle, al drie op een sirkel." } },
        { diagram: FIG_WHY, caption: {
            en: "O sits square above the midpoint of AB, and of BC — and only one point can do both.",
            af: "O lê loodreg bo die middelpunt van AB, én van BC — en net een punt kan albei doen." } },
      ],
      note: {
        en: "Exactly one, every time — and you cannot avoid it. Take any two of your dots, say A and B: every point the same distance from both of them lies on ONE line, the perpendicular bisector of AB. The centre of any circle through A and B has to sit somewhere on that line. The same is true for B and C — their perpendicular bisector is a second line the centre has to sit on. Two lines that are not parallel meet at exactly one point, and that point is forced to be the centre.<br><br>Nobody chose that circle. The moment you put down three dots that are not in a straight line, the circle was already decided.<br><br>(That is the flip side of Investigation Station 3, if you played it: four dots can easily FAIL to land on one circle. Three dots never can.)<br><br>This is why proofs matter. Dragging and measuring can only ever make you FEEL that something is true. A chain of reasons like the one above makes it MUST be true — for every triangle anyone will ever draw, not just the ones you happened to check. That gap is this whole chapter. Every rule you have used all term earned its place the same way, and now you get to see the machinery behind it.",
        af: "Presies een, elke keer — en jy kan dit nie vermy nie. Vat enige twee van jou kolletjies, sê A en B: elke punt wat ewe ver van albei af is, lê op EEN lyn, die middelloodlyn van AB. Die middelpunt van enige sirkel deur A en B moet iewers op daardie lyn sit. Dieselfde geld vir B en C — hulle middelloodlyn is 'n tweede lyn waarop die middelpunt moet sit. Twee lyne wat nie ewewydig is nie, ontmoet by presies een punt, en daardie punt word gedwing om die middelpunt te wees.<br><br>Niemand het daardie sirkel gekies nie. Die oomblik toe jy drie kolletjies neersit wat nie in 'n reguit lyn lê nie, was die sirkel reeds beslis.<br><br>(Dit is die keersy van Ondersoekstasie 3, as jy dit gespeel het: vier kolletjies kan maklik FAAL om op een sirkel te land. Drie kolletjies kan nooit nie.)<br><br>Dit is hoekom bewyse saak maak. Om te sleep en te meet kan jou net ooit laat VOEL iets is waar. 'n Ketting van redes soos hierbo maak dit WAAR MOET wees — vir elke driehoek wat enigiemand ooit sal teken, nie net dié wat jy toevallig nagegaan het nie. Daardie gaping is hierdie hele hoofstuk. Elke reël wat jy die hele kwartaal gebruik het, het sy plek op dieselfde manier verdien, en nou kry jy die kans om die masjinerie daaragter te sien.",
      },
    },

  ],
};
