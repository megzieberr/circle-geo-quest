/* Investigation Station 2 — "State the Conjecture"  (IEB SBA task type #15)
   ------------------------------------------------------------------------
   The station about the sentence itself. Learners nearly always SEE the
   pattern; the marks go missing in how they write it down. So this station
   spends all five panels on one conjecture — angles in the same segment —
   and drills the three conditions that get dropped:

     · at the CIRCUMFERENCE   (drop it and the centre angle sneaks in, and
                               that one is double, not equal)
     · on the SAME SIDE       (drop it and the claim is simply false)
     · ALWAYS                 (drop it and you have reported a measurement,
                               not made a conjecture)

   ONE FIGURE THROUGHOUT, the same bowtie the class already met in
   `discover-same-segment.js` — whose MODEL() is imported rather than rebuilt,
   so the two rounds can never drift apart.

   To scale. Static figure: A at 216 deg, B at 324 deg, P at 52, Q at 128.
     Chord AB cuts off an arc of 324 - 216 = 108 deg.
     P and Q both sit on the OTHER arc, so each subtends 108 / 2 = 54 deg.  ✓
   Both angles are marked 54 deg and the engine is left to place the labels.

   The last panel is the point of the whole station. CROSS_MODEL drops Q onto
   the far arc, where the equality breaks and 54 + 126 = 180 appears instead.
   Same chord, same circle, one point moved — and same-segment turns into
   opposite angles of a cyclic quadrilateral. Two hats, one theorem. The sum
   is not hand-typed anywhere: `measure()` computes both angles from real
   coordinates and adds them, so the readout cannot lie about it.

   The two panelIds MUST match panel_memos.panel_id in phase16.sql. The memo
   lives server-side — a learner with devtools must not be able to read the
   answer out of this file. `memoDisplay` is the teaching text shown only
   after five misses, which is a different thing and safe to ship. */

import { MODEL } from "./discover-same-segment.js";

const AC = "#f76707";
const GREEN = "#0ea271", PURPLE = "#9c36b5", INK = "#252a4a";

/* the bowtie as a still picture, for the panels that ask learners to read a
   sentence rather than drag anything */
const BOWTIE = {
  pts: { A: 216, B: 324, P: 52, Q: 128 },
  chords: [["A", "B"], ["P", "A"], ["P", "B"], ["Q", "A"], ["Q", "B"]],
  angles: [
    { at: "P", legs: ["A", "B"], t: "54°", o: { v: 54, r: 40 } },
    { at: "Q", legs: ["A", "B"], t: "54°", o: { v: 54, r: 40 } },
  ],
};

/* Q moved to the OTHER arc. Handle ranges are kept apart on purpose —
   A stops at 238 deg, Q runs 250-290, B starts at 302 — so no amount of
   dragging can shuffle the points out of the order A, Q, B along the
   bottom arc and leave the figure describing something else. */
const CROSS_MODEL = () => ({
  w: 344, h: 296, cx: 172, cy: 150, R: 104,
  fixed: {},
  handles: [
    { id: "A", kind: "arc", min: 196, max: 238, init: 216 },
    { id: "B", kind: "arc", min: 302, max: 344, init: 324 },
    { id: "P", kind: "arc", min: 12,  max: 168, init: 60  },
    { id: "Q", kind: "arc", min: 250, max: 290, init: 270 },
  ],
  frame(pos, ctx, m) {
    const A = pos.A, B = pos.B, P = pos.P, Q = pos.Q;
    return {
      segments: [
        { x1: A.x, y1: A.y, x2: B.x, y2: B.y, cls: "thick" },          // chord AB
        { x1: P.x, y1: P.y, x2: A.x, y2: A.y, cls: "thin", color: GREEN },
        { x1: P.x, y1: P.y, x2: B.x, y2: B.y, cls: "thin", color: GREEN },
        { x1: Q.x, y1: Q.y, x2: A.x, y2: A.y, cls: "thin", color: PURPLE },
        { x1: Q.x, y1: Q.y, x2: B.x, y2: B.y, cls: "thin", color: PURPLE },
      ],
      angles: [
        { vx: P.x, vy: P.y, ux: A.x, uy: A.y, wx: B.x, wy: B.y, color: GREEN,  label: Math.round(m.p) + "°" },
        { vx: Q.x, vy: Q.y, ux: A.x, uy: A.y, wx: B.x, wy: B.y, color: PURPLE, label: Math.round(m.q) + "°" },
      ],
      dots: [
        { x: A.x, y: A.y, color: INK, label: "A", dx: -14, dy: 4 },
        { x: B.x, y: B.y, color: INK, label: "B", dx: 13, dy: 4 },
        { x: P.x, y: P.y, color: INK, label: "P", dx: 6, dy: -13 },
        { x: Q.x, y: Q.y, color: INK, label: "Q", dx: 0, dy: 17 },
      ],
    };
  },
  measure(pos, ctx) {
    const p = ctx.angleAt(pos.P, pos.A, pos.B);
    const q = ctx.angleAt(pos.Q, pos.A, pos.B);
    return { p, q, sum: p + q };
  },
  readouts(m) {
    return [
      { label: { en: "∠APB  (green)", af: "∠APB  (groen)" }, value: Math.round(m.p) + "°", color: GREEN },
      { label: { en: "∠AQB  (purple)", af: "∠AQB  (pers)" }, value: Math.round(m.q) + "°", color: PURPLE },
      { label: { en: "the two added together", af: "die twee bymekaar getel" }, value: Math.round(m.sum) + "°", color: INK },
    ];
  },
});

export const round = {
  id: "inv2", n: 0, accent: AC, kind: "investigate", group: "g6",
  title: { en: "State the Conjecture", af: "Stel die Vermoede" },
  blurb: {
    en: "IEB task type 15 · Investigation. Seeing the pattern is the easy half. Saying it precisely is where the marks are.",
    af: "IEB taak tipe 15 · Ondersoek. Om die patroon te sien is die maklike helfte. Om dit presies te stel, is waar die punte lê.",
  },
  panels: [

    /* ---------- 1 · look again, and look for the exception ---------- */
    {
      type: "explore",
      prompt: { en: "Look again — and try to break it", af: "Kyk weer — en probeer dit breek" },
      instruction: {
        en: "Chord AB subtends ∠APB at P and ∠AQB at Q, both on the same arc. Drag every point, including A and B. You are not looking for the pattern this time — you already know it. You are hunting for one position where the two angles are NOT equal.",
        af: "Koord AB onderspan ∠APB by P en ∠AQB by Q, albei op dieselfde boog. Sleep elke punt, ook A en B. Jy soek nie hierdie keer die patroon nie — jy ken dit al. Jy jag na een posisie waar die twee hoeke NIE gelyk is nie.",
      },
      interactive: MODEL(),
    },

    /* ---------- 2 · build the sentence, condition by condition ---------- */
    {
      type: "blank",
      prompt: {
        en: "You could not break it. Now write it down properly — every blank is a condition that costs a mark if it goes missing.",
        af: "Jy kon dit nie breek nie. Skryf dit nou behoorlik neer — elke oop plek is 'n voorwaarde wat 'n punt kos as dit wegraak.",
      },
      interactive: MODEL(),
      sentence: [
        { en: "Angles subtended by the same chord, at ", af: "Hoeke onderspan deur dieselfde koord, by " },
        { kind: "word", answer: "atCircumference", options: ["atCircumference", "atCentre", "atArc"] },
        { en: ", on ", af: ", aan " },
        { kind: "word", answer: "sideSame", options: ["sideSame", "sideOpposite", "sideAlternate"] },
        { en: " side of the chord, are always ", af: " kant van die koord, is altyd " },
        { kind: "word", answer: "equalPred", options: ["equalPred", "unequalPred", "supplementary", "double"] },
        { en: ".", af: "." },
      ],
      hints: [
        { en: "Take the blanks one at a time. Where are P and Q sitting — on the edge of the circle, or at the middle of it? That is the first blank.",
          af: "Vat die oop plekke een vir een. Waar sit P en Q — op die rand van die sirkel, of by die middel daarvan? Dit is die eerste oop plek." },
        { en: "The second blank matters more than it looks. Both P and Q are ABOVE chord AB. If one of them dropped below the chord, would the two angles still match?",
          af: "Die tweede oop plek is belangriker as wat dit lyk. Beide P en Q is BO koord AB. As een van hulle onder die koord val, sou die twee hoeke nog steeds pas?" },
      ],
      reason: "sameSeg",
      note: {
        en: "That sentence is the conjecture, and all three blanks earn their place. Put P at the centre instead of on the circumference and the angle doubles. Move Q to the far side of the chord and the angles stop being equal altogether — which is exactly what the last panel of this station will do to you.",
        af: "Daardie sin is die vermoede, en al drie oop plekke verdien hul plek. Sit P by die middelpunt in plaas van op die omtrek en die hoek verdubbel. Skuif Q na die ander kant van die koord en die hoeke is glad nie meer gelyk nie — wat presies is wat die laaste paneel van hierdie stasie aan jou gaan doen.",
      },
    },

    /* ---------- 3 · four learners, one precise sentence ---------- */
    {
      type: "choice",
      prompt: {
        en: "Four learners all noticed the same thing. Only one of them wrote a proper conjecture. Which one?",
        af: "Vier leerders het almal dieselfde ding opgemerk. Net een van hulle het 'n behoorlike vermoede geskryf. Watter een?",
      },
      diagram: BOWTIE,
      options: [
        { text: { en: "\"Angles subtended by the same chord, at the circumference and on the same side of it, are always equal.\"",
                  af: "\"Hoeke onderspan deur dieselfde koord, by die omtrek en aan dieselfde kant daarvan, is altyd gelyk.\"" }, correct: true },
        { text: { en: "\"Any two angles standing on the same chord are equal.\"",
                  af: "\"Enige twee hoeke wat op dieselfde koord staan, is gelyk.\"" } },
        { text: { en: "\"When I dragged P and Q around the top of the circle, ∠APB and ∠AQB stayed equal.\"",
                  af: "\"Toe ek P en Q om die bokant van die sirkel gesleep het, het ∠APB en ∠AQB gelyk gebly.\"" } },
        { text: { en: "\"∠APB = ∠AQB.\"", af: "\"∠APB = ∠AQB.\"" } },
      ],
      hints: [
        { en: "Three of these are true sentences. Ask a harder question: which one would still make sense to somebody who has never seen this diagram?",
          af: "Drie hiervan is ware sinne. Vra 'n moeiliker vraag: watter een sou steeds sin maak vir iemand wat hierdie diagram nog nooit gesien het nie?" },
        { en: "One reports what happened while dragging (that is an observation, not a conjecture). One is only about the letters in THIS picture. One forgot that an angle at the centre also stands on chord AB — and it is double, not equal.",
          af: "Een rapporteer wat tydens die sleep gebeur het (dis 'n waarneming, nie 'n vermoede nie). Een gaan net oor die letters in HIERDIE prent. Een het vergeet dat 'n hoek by die middelpunt ook op koord AB staan — en dit is dubbel, nie gelyk nie." },
      ],
      note: {
        en: "A conjecture is a claim about EVERY case, written so a stranger can test it. \"∠APB = ∠AQB\" is an answer about one picture. \"When I dragged…\" is an observation — true, but it claims nothing beyond what was measured. \"Any two angles…\" quietly includes the angle at the centre, which is double. Only the first one survives a reader who wants to prove you wrong.",
        af: "'n Vermoede is 'n bewering oor ELKE geval, so geskryf dat 'n vreemdeling dit kan toets. \"∠APB = ∠AQB\" is 'n antwoord oor een prent. \"Toe ek gesleep het…\" is 'n waarneming — waar, maar dit beweer niks buite wat gemeet is nie. \"Enige twee hoeke…\" sluit stilweg die hoek by die middelpunt in, wat dubbel is. Net die eerste een oorleef 'n leser wat jou verkeerd wil bewys.",
      },
    },

    /* ---------- 4 · typed: say it yourself ---------- */
    {
      type: "written",
      panelId: "s2p4",
      prompt: {
        en: "Now write the conjecture in your own words, in one sentence. Write it for somebody who has never seen this circle — so no P, no Q, no A, no B.",
        af: "Skryf nou die vermoede in jou eie woorde, in een sin. Skryf dit vir iemand wat hierdie sirkel nog nooit gesien het nie — dus geen P, geen Q, geen A, geen B nie.",
      },
      diagram: BOWTIE,
      minChars: 25,
      placeholder: {
        en: "One sentence, true for every circle…",
        af: "Een sin, waar vir elke sirkel…",
      },
      starters: [
        { en: "Angles subtended by the same chord…", af: "Hoeke onderspan deur dieselfde koord…" },
        { en: "If two angles at the circumference stand on…", af: "As twee hoeke by die omtrek staan op…" },
      ],
      hints: [
        { en: "Check your sentence against the one you built two panels ago. Does it say where the angles are, which chord they stand on, and which side of it they are?",
          af: "Toets jou sin teen dié wat jy twee panele gelede gebou het. Sê dit waar die hoeke is, op watter koord hulle staan, en aan watter kant daarvan hulle is?" },
        { en: "Three things have to be in there: the angles are EQUAL, they stand on the SAME chord (or arc), and they are on the SAME side of it — in the same segment.",
          af: "Drie dinge moet daarin wees: die hoeke is GELYK, hulle staan op DIESELFDE koord (of boog), en hulle is aan DIESELFDE kant daarvan — in dieselfde segment." },
      ],
      memoDisplay: {
        en: "Angles subtended by the same chord (or the same arc), at the circumference and in the same segment, are equal. Any wording carrying those three ideas is right: equal angles · same chord or arc · same side of it. IEB accepts the short reason as “∠s in the same seg”.",
        af: "Hoeke onderspan deur dieselfde koord (of dieselfde boog), by die omtrek en in dieselfde segment, is gelyk. Enige bewoording wat daardie drie idees dra, is reg: gelyke hoeke · dieselfde koord of boog · dieselfde kant daarvan. IEB aanvaar die kort rede as “∠e in dieselfde segment”.",
      },
      reason: "sameSeg",
    },

    /* ---------- 5 · typed: move Q, and meet the same theorem in a second hat ---------- */
    {
      type: "written",
      panelId: "s2p5",
      prompt: {
        en: "Drag Q DOWN onto the other arc, below chord AB. The equality breaks — but something else takes its place. Watch the third readout while you drag, then say what is true about the two angles now.",
        af: "Sleep Q AF na die ander boog, onder koord AB. Die gelykheid breek — maar iets anders neem sy plek in. Hou die derde aflesing dop terwyl jy sleep, en sê dan wat nou waar is van die twee hoeke.",
      },
      interactive: CROSS_MODEL(),
      minChars: 15,
      placeholder: {
        en: "The two angles now…",
        af: "Die twee hoeke is nou…",
      },
      starters: [
        { en: "The two angles always add up to…", af: "Die twee hoeke tel altyd op tot…" },
      ],
      hints: [
        { en: "Stop reading the two angles separately and read the bottom number instead. Drag A, B and Q all over the place. What does that third readout refuse to do?",
          af: "Hou op om die twee hoeke apart te lees en lees eerder die onderste getal. Sleep A, B en Q oral rond. Wat weier daardie derde aflesing om te doen?" },
        { en: "It never moves off 180°. Two angles that add to 180° have a name — and joining A, P, B, Q in order gives you a four-sided shape with all four corners on the circle.",
          af: "Dit beweeg nooit van 180° af nie. Twee hoeke wat tot 180° optel het 'n naam — en as jy A, P, B, Q in volgorde verbind, kry jy 'n vierhoek met al vier hoekpunte op die sirkel." },
      ],
      memoDisplay: {
        en: "They are supplementary — the two angles always add up to 180°, however you drag the points. Once Q is on the far arc, APBQ is a cyclic quadrilateral and ∠P and ∠Q are its opposite angles.",
        af: "Hulle is supplementêr — die twee hoeke tel altyd op tot 180°, hoe jy die punte ook al sleep. Sodra Q op die ander boog is, is APBQ 'n koordevierhoek en is ∠P en ∠Q sy teenoorstaande hoeke.",
      },
      reason: "cyclicOpp",
      note: {
        en: "Nothing was added to the picture. The same chord, the same circle, one point moved across the chord — and \"angles in the same segment\" became \"opposite angles of a cyclic quadrilateral\". They are not two facts to memorise separately; they are the same fact seen from either side of AB. That is also why the condition you kept putting in your conjecture — SAME side — was never decoration.",
        af: "Niks is by die prent gevoeg nie. Dieselfde koord, dieselfde sirkel, een punt oor die koord geskuif — en \"hoeke in dieselfde segment\" het \"teenoorstaande hoeke van 'n koordevierhoek\" geword. Dit is nie twee feite om apart te memoriseer nie; dit is dieselfde feit van weerskante van AB af gesien. Dit is ook hoekom die voorwaarde wat jy elke keer in jou vermoede gesit het — DIESELFDE kant — nooit versiering was nie.",
      },
    },

  ],
};
