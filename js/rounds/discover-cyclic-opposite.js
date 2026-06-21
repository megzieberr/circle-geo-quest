/* DISCOVERY — Opposite angles of a cyclic quadrilateral.
   Drag the four vertices. ∠A and ∠C (opposite) are shown raw — they are
   usually NOT equal, but they always add to 180°. The learner has to spot
   that it's the SUM that's fixed. No sum shown. Not graded. */
const AC = "#9c36b5";
const PURPLE = "#9c36b5", GREEN = "#0ea271", INK = "#252a4a";

const MODEL = () => ({
  w: 344, h: 300, cx: 172, cy: 150, R: 104,
  fixed: {},
  handles: [
    { id: "A", kind: "arc", min: 110, max: 170, init: 142 },
    { id: "B", kind: "arc", min: 10, max: 70, init: 40 },
    { id: "C", kind: "arc", min: 290, max: 350, init: 320 },
    { id: "D", kind: "arc", min: 200, max: 260, init: 228 },
  ],
  frame(pos, ctx, m) {
    const A = pos.A, B = pos.B, C = pos.C, D = pos.D;
    return {
      segments: [
        { x1: A.x, y1: A.y, x2: B.x, y2: B.y, cls: "thin" },
        { x1: B.x, y1: B.y, x2: C.x, y2: C.y, cls: "thin" },
        { x1: C.x, y1: C.y, x2: D.x, y2: D.y, cls: "thin" },
        { x1: D.x, y1: D.y, x2: A.x, y2: A.y, cls: "thin" },
      ],
      angles: [
        { vx: A.x, vy: A.y, ux: D.x, uy: D.y, wx: B.x, wy: B.y, color: PURPLE, label: Math.round(m.a) + "°" },
        { vx: C.x, vy: C.y, ux: B.x, uy: B.y, wx: D.x, wy: D.y, color: GREEN, label: Math.round(m.c) + "°" },
      ],
      dots: [
        { x: A.x, y: A.y, color: INK, label: "A", dx: -14, dy: 0 },
        { x: B.x, y: B.y, color: INK, label: "B", dx: 13, dy: 0 },
        { x: C.x, y: C.y, color: INK, label: "C", dx: 13, dy: 8 },
        { x: D.x, y: D.y, color: INK, label: "D", dx: -14, dy: 8 },
      ],
    };
  },
  measure(pos, ctx) {
    return { a: ctx.angleAt(pos.A, pos.D, pos.B), c: ctx.angleAt(pos.C, pos.B, pos.D) };
  },
  readouts(m) {
    return [
      { label: { en: "∠A  (purple)", af: "∠A  (pers)" }, value: Math.round(m.a) + "°", color: PURPLE },
      { label: { en: "∠C  (green)", af: "∠C  (groen)" }, value: Math.round(m.c) + "°", color: GREEN },
    ];
  },
});

export const round = {
  id: "dcycopp", n: 1, accent: AC, kind: "discover", group: "g2",
  title: { en: "Discover: opposite angles", af: "Ontdek: teenoorstaande hoeke" },
  blurb: { en: "Drag the corners — find what ∠A and ∠C always do.", af: "Sleep die hoeke — vind wat ∠A en ∠C altyd doen." },
  panels: [
    { type: "explore",
      prompt: { en: "ABCD is a cyclic quadrilateral", af: "ABCD is 'n koordevierhoek" },
      instruction: { en: "∠A and ∠C are opposite corners. Drag any vertex and watch them. They are usually NOT equal — so what stays the same? (Try adding them.)", af: "∠A en ∠C is teenoorstaande hoeke. Sleep enige hoekpunt en kyk na hulle. Hulle is meestal NIE gelyk nie — so wat bly dieselfde? (Probeer hulle optel.)" },
      interactive: MODEL() },

    { type: "blank",
      prompt: { en: "Fill in the pattern", af: "Vul die patroon in" },
      interactive: MODEL(),
      sentence: [
        { en: "The opposite angles of a cyclic quadrilateral always add up to ", af: "Die teenoorstaande hoeke van 'n koordevierhoek tel altyd op tot " },
        { kind: "num", answer: 180, unit: "°" },
        { en: ".", af: "." },
      ],
      hints: [
        { en: "For several different shapes, add ∠A + ∠C. What total do you keep getting?", af: "Vir verskeie vorms, tel ∠A + ∠C op. Watter totaal kry jy elke keer?" },
        { en: "Opposite angles of a cyclic quad are supplementary — they add to 180°.", af: "Teenoorstaande hoeke van 'n koordevierhoek is supplementêr — hulle tel op tot 180°." },
      ],
      reason: "cyclicOpp",
      note: { en: "Opposite angles of a cyclic quad add to 180° (supplementary). The other pair, ∠B and ∠D, add to 180° too. Reason: <i>opp ∠s of cyclic quad</i>.", af: "Teenoorstaande hoeke van 'n koordevierhoek tel op tot 180° (supplementêr). Die ander paar, ∠B en ∠D, tel ook op tot 180°. Rede: <i>teenoorst. ∠e van kvh</i>." } },
  ],
};
