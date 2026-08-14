/* Dynamic Geometry dg0 — "Watch it move"  (DYNAMIC-GEO-PLAN.md §1)
   ------------------------------------------------------------------------
   Session 1's opening round: the app's whole job here is to SHOW the
   motion the booklet forces a learner to imagine. Fresh figure, fresh
   letters — chord AB fixed, C free to travel the whole circle.

   Renders through the SAME renderInvestigate() the proof rounds and the
   Investigation Station use (js/investigate.js) — round `kind: "dynamic"`
   gets explore/choice/note panels and per-panel XP for free.

   THE SANDBOX PANEL IS FIRST, before any question (her ruling, 2026-08-14
   — Station drag-and-notice DNA). It carries no `record`/`until`, so
   Continue is live immediately; the learner can free-play as long as they
   like before anything is asked.

   DISCOVERY RULE HELD: every panel shows the raw ∠ACB reading and nothing
   else — never "same segment" or "supplementary" until the closing note,
   and only once the learner has already answered what they noticed.

   THE MATHS, for the record (the live model computes this from real
   coordinates every frame — nothing here is a canned number):
     A fixed at 200°, B fixed at 340° (chord AB, minor arc 140°, major
     arc 220°). C free on the circle (`kind:"circle"`, no clamp).
       · C on the MAJOR arc → ∠ACB = half the MINOR arc = 70°, constant
         for every position of C on that arc (∠s in the same segment).
       · C on the MINOR arc → ∠ACB = half the MAJOR arc = 110°, constant
         on that side instead (opp ∠s of cyclic quad: 70 + 110 = 180).
     The engine's ctx.angleAt() returns the true interior angle at C from
     real coordinates, so this jump is not staged — it is the theorem,
     live. */

const AC = "#4263eb";
const SEG_MAJOR = "#9c36b5";   // purple — the arc C starts on
const SEG_MINOR = "#0ea271";   // green — the other arc, across the chord

/* A fresh closure per mount (matches the app's own MODEL()-factory
   convention, e.g. discover-cyclic-opposite.js) so `lastSide` never
   leaks between two panels or two plays of the same panel. */
function makeModel() {
  let lastSide = null;
  return {
    w: 344, h: 300, cx: 172, cy: 150, R: 104,
    fixed: { pts: { A: 200, B: 340 }, chords: [["A", "B"]] },
    handles: [{ id: "C", kind: "circle", init: 60 }],
    measure(pos, ctx) {
      const A = ctx.P("A"), B = ctx.P("B"), C = pos.C;
      const angle = ctx.angleAt(C, A, B);
      // which side of chord AB is C on — sign of the cross product decides,
      // consistently, whichever way the SVG y-axis happens to point.
      const cross = (B.x - A.x) * (C.y - A.y) - (B.y - A.y) * (C.x - A.x);
      return { angle, side: cross >= 0 ? 1 : -1 };
    },
    frame(pos, ctx, m) {
      const A = ctx.P("A"), B = ctx.P("B"), C = pos.C;
      const col = m.side === 1 ? SEG_MAJOR : SEG_MINOR;
      return {
        segments: [
          { x1: C.x, y1: C.y, x2: A.x, y2: A.y, cls: "thin" },
          { x1: C.x, y1: C.y, x2: B.x, y2: B.y, cls: "thin" },
        ],
        angles: [{ vx: C.x, vy: C.y, ux: A.x, uy: A.y, wx: B.x, wy: B.y, color: col, label: Math.round(m.angle) + "°" }],
        dots: [{ x: C.x, y: C.y, color: "#252a4a", label: "C", dx: 12, dy: -10 }],
      };
    },
    // The one live reading this round is about — `big` for hero type,
    // `pulse` fires for the single frame the side actually changes (the
    // colour swap on every other frame is the durable signal; pulse is
    // the extra nudge right at the crossing).
    readouts(m) {
      const jumped = lastSide !== null && lastSide !== m.side;
      lastSide = m.side;
      return [{
        label: { en: "∠ACB", af: "∠ACB" },
        value: Math.round(m.angle) + "°",
        color: m.side === 1 ? SEG_MAJOR : SEG_MINOR,
        big: true, pulse: jumped,
      }];
    },
    // The Play/glide button + slider — an alternative to dragging, and the
    // way a learner who never quite crosses the chord themselves still
    // gets to see the jump happen. Sweeps most of the circle, both arcs.
    glide: { handleId: "C", from: 45, to: 345, duration: 9000 },
  };
}

export const round = {
  id: "dg0", n: 0, accent: AC, kind: "dynamic", group: "g8",
  title: { en: "Watch it move", af: "Kyk hoe dit beweeg" },
  blurb: {
    en: "Drag C anywhere around the circle — or tap play — and watch what ∠ACB actually does.",
    af: "Drag C enige plek om die sirkel — of tik speel — en kyk wat ∠ACB werklik doen.",
  },
  panels: [

    /* ---------- 1 · the sandbox, free play before any question ---------- */
    {
      type: "explore",
      prompt: { en: "Chord AB is fixed. C is free.", af: "Koord AB is vas. C is vry." },
      instruction: {
        en: "Drag C anywhere around the circle — or tap ▶ below the readout to watch it glide on its own, and use the slider to step through slowly. Keep an eye on ∠ACB.",
        af: "Drag C enige plek om die sirkel — of tik ▶ onder die lesing om dit vanself te sien gly, en gebruik die skuifbalk om stadig deur te stap. Hou ∠ACB dop.",
      },
      interactive: makeModel(),
    },

    /* ---------- 2 · what stays the same, on one side ----------
       Raw measurement only — the word "same segment" is never used here,
       only after the learner has already picked what they noticed. */
    {
      type: "choice",
      prompt: {
        en: "Drag C to a few different spots — but keep it on the SAME side of chord AB every time. What does ∠ACB do?",
        af: "Drag C na 'n paar verskillende plekke — maar hou dit elke keer aan DIESELFDE kant van koord AB. Wat doen ∠ACB?",
      },
      interactive: makeModel(),
      options: [
        { text: { en: "It stays exactly the same, every single time.", af: "Dit bly presies dieselfde, elke enkele keer." }, correct: true },
        { text: { en: "It slowly grows the further C moves away from A.", af: "Dit word stadig groter hoe verder C van A af beweeg." } },
        { text: { en: "It slowly shrinks the further C moves away from A.", af: "Dit word stadig kleiner hoe verder C van A af beweeg." } },
        { text: { en: "It keeps changing, with no pattern to it at all.", af: "Dit bly aanhou verander, met geen patroon nie." } },
      ],
      hints: [
        { en: "Try three or four spots, all on the same side. Read the number off the diagram each time before you drag again.", af: "Probeer drie of vier plekke, almal aan dieselfde kant. Lees die getal elke keer van die diagram af voordat jy weer drag." },
        { en: "Wherever C sits on that one side, the same chord AB is always subtending the same angle at it.", af: "Waar C ook al aan daardie een kant sit, span dieselfde koord AB altyd dieselfde hoek daaraan op." },
      ],
      reason: "sameSeg",
      note: {
        en: "Exactly the same, every time C stays on that side — you can drag C anywhere along that whole arc and ∠ACB will not move. That is worth holding onto: an angle that never changes is exactly the kind of thing a proof can be built on.",
        af: "Presies dieselfde, elke keer as C aan daardie kant bly — jy kan C enige plek langs daardie hele boog drag en ∠ACB sal nie beweeg nie. Dit is die moeite werd om vas te hou: 'n hoek wat nooit verander nie, is presies die soort ding waarop 'n bewys gebou kan word.",
      },
    },

    /* ---------- 3 · the jump, when C crosses the chord ---------- */
    {
      type: "choice",
      prompt: {
        en: "Now drag C slowly across chord AB, onto the OTHER arc. Watch the readout, not the picture — what happens to ∠ACB the instant it crosses?",
        af: "Drag nou C stadig oor koord AB, na die ANDER boog. Kyk na die lesing, nie na die prentjie nie — wat gebeur met ∠ACB die oomblik dit oorkruis?",
      },
      interactive: makeModel(),
      options: [
        { text: { en: "It jumps straight to a different number — and that number holds steady too, on the new side.", af: "Dit spring reguit na 'n ander getal — en daardie getal bly ook stabiel, aan die nuwe kant." }, correct: true },
        { text: { en: "It passes smoothly through every value in between, with no jump at all.", af: "Dit gaan glad deur elke tussenin-waarde, sonder enige sprong." } },
        { text: { en: "It becomes exactly 90° the instant C crosses the chord.", af: "Dit word presies 90° die oomblik as C die koord oorkruis." } },
        { text: { en: "It resets to 0° and climbs back up again from the chord.", af: "Dit begin weer by 0° en klim van voor af op vanaf die koord." } },
      ],
      hints: [
        { en: "Cross the chord very slowly and read the number right at the moment C passes over it — does it visit anything in between the two values?", af: "Kruis die koord baie stadig en lees die getal presies wanneer C daaroor gaan — besoek dit enigiets tussenin die twee waardes?" },
        { en: "A point is always on ONE side of the chord or the other — never in between — so the angle only ever has two possible constants to be.", af: "'n Punt is altyd aan EEN kant van die koord of die ander — nooit tussenin nie — dus het die hoek net twee moontlike konstantes om te wees." },
      ],
      reason: "cyclicOpp",
      note: {
        en: "That jump is two theorems you already know, seen from two sides of the same chord. On one side, every point sees the SAME angle — ∠s in the same segment. The moment C crosses to the other arc, the new point and the old figure form a cyclic quadrilateral, so the two angles are OPPOSITE angles of that quadrilateral — and opposite angles of a cyclic quad add to 180°. Nothing in between is ever visited, because a point is always on one side or the other, never both.",
        af: "Daardie sprong is twee stellings wat jy reeds ken, gesien vanaf twee kante van dieselfde koord. Aan een kant sien elke punt DIESELFDE hoek — ∠e in dieselfde segment. Die oomblik as C na die ander boog oorkruis, vorm die nuwe punt en die ou figuur 'n koordevierhoek — dus is die twee hoeke TEENOORSTAANDE hoeke van daardie vierhoek — en teenoorstaande hoeke van 'n koordevierhoek tel op tot 180°. Niks tussenin word ooit besoek nie, want 'n punt is altyd aan een kant of die ander, nooit albei nie.",
      },
    },

    /* ---------- 4 · closing note, bridging to the next round ---------- */
    {
      type: "note",
      prompt: { en: "Movie, then snapshot", af: "Prent, dan foto" },
      note: {
        en: "You have now watched it happen — dragged it, glided it, seen the jump for yourself. The next round freezes C at one exact spot and asks the booklet-style questions you already know how to answer. Same theorems. Now on a figure you have actually seen move.",
        af: "Jy het dit nou sien gebeur — dit gedrag, dit sien gly, die sprong self gesien. Die volgende rondte vries C by een presiese plek en vra die handboek-styl vrae wat jy reeds weet hoe om te beantwoord. Dieselfde stellings. Nou op 'n figuur wat jy werklik sien beweeg het.",
      },
    },

  ],
};
