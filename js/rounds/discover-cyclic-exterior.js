/* DISCOVERY — Exterior angle of a cyclic quadrilateral.
   Side BC is extended past C to E, forming the exterior angle ∠DCE. Drag the
   vertices: the exterior angle always equals the interior OPPOSITE angle ∠A.
   The learner has to work out WHICH interior angle it matches. Not graded. */
const AC = "#9c36b5";
const ORANGE = "#f76707", PURPLE = "#9c36b5", INK = "#252a4a";

const extPoint = (B, C, len = 36) => {
  const dx = C.x - B.x, dy = C.y - B.y, L = Math.hypot(dx, dy) || 1;
  return { x: C.x + dx / L * len, y: C.y + dy / L * len };
};

const MODEL = () => ({
  w: 350, h: 300, cx: 162, cy: 150, R: 102,
  fixed: {},
  handles: [
    { id: "A", kind: "arc", min: 110, max: 170, init: 142 },
    { id: "B", kind: "arc", min: 18, max: 74, init: 44 },
    { id: "C", kind: "arc", min: 292, max: 348, init: 318 },
    { id: "D", kind: "arc", min: 200, max: 258, init: 226 },
  ],
  frame(pos, ctx, m) {
    const A = pos.A, B = pos.B, C = pos.C, D = pos.D, E = extPoint(B, C);
    return {
      segments: [
        { x1: A.x, y1: A.y, x2: B.x, y2: B.y, cls: "thin" },
        { x1: B.x, y1: B.y, x2: C.x, y2: C.y, cls: "thin" },
        { x1: C.x, y1: C.y, x2: D.x, y2: D.y, cls: "thin" },
        { x1: D.x, y1: D.y, x2: A.x, y2: A.y, cls: "thin" },
        { x1: C.x, y1: C.y, x2: E.x, y2: E.y, cls: "accent" },   // the extension CE
      ],
      angles: [
        { vx: A.x, vy: A.y, ux: D.x, uy: D.y, wx: B.x, wy: B.y, color: ORANGE, label: Math.round(m.intA) + "°" },
        { vx: C.x, vy: C.y, ux: D.x, uy: D.y, wx: E.x, wy: E.y, color: PURPLE, label: Math.round(m.ext) + "°" },
      ],
      dots: [
        { x: A.x, y: A.y, color: INK, label: "A", dx: -14, dy: 0 },
        { x: B.x, y: B.y, color: INK, label: "B", dx: 13, dy: 0 },
        { x: C.x, y: C.y, color: INK, label: "C", dx: 10, dy: 10 },
        { x: D.x, y: D.y, color: INK, label: "D", dx: -14, dy: 8 },
        { x: E.x, y: E.y, color: PURPLE, label: "E", dx: 8, dy: 12 },
      ],
    };
  },
  measure(pos, ctx) {
    const E = extPoint(pos.B, pos.C);
    return { ext: ctx.angleAt(pos.C, pos.D, E), intA: ctx.angleAt(pos.A, pos.D, pos.B) };
  },
  readouts(m) {
    return [
      { label: { en: "Exterior ∠DCE  (purple)", af: "Buitehoek ∠DCE  (pers)" }, value: Math.round(m.ext) + "°", color: PURPLE },
      { label: { en: "Interior ∠A  (orange)", af: "Binnehoek ∠A  (oranje)" }, value: Math.round(m.intA) + "°", color: ORANGE },
    ];
  },
});

export const round = {
  id: "dcycext", n: 1, accent: AC, kind: "discover", group: "g2",
  title: { en: "Discover: exterior angle", af: "Ontdek: buitehoek" },
  blurb: { en: "Extend a side — which inside angle does it copy?", af: "Verleng 'n sy — watter binnehoek kopieer dit?" },
  panels: [
    { type: "explore",
      prompt: { en: "Side BC is extended to E", af: "Sy BC is verleng na E" },
      instruction: { en: "This makes the EXTERIOR angle ∠DCE (purple). Drag the vertices. The exterior angle always equals ONE of the interior angles — which one? (Hint: look at the corner far away from C.)", af: "Dit maak die BUITEHOEK ∠DCE (pers). Sleep die hoekpunte. Die buitehoek is altyd gelyk aan EEN van die binnehoeke — watter een? (Wenk: kyk na die hoek ver van C af.)" },
      interactive: MODEL() },

    { type: "blank",
      prompt: { en: "Fill in what matches", af: "Vul in wat ooreenstem" },
      interactive: MODEL(),
      sentence: [
        { en: "The exterior angle of a cyclic quad equals the interior ", af: "Die buitehoek van 'n koordevierhoek is gelyk aan die binne-" },
        { kind: "word", answer: "opposite", options: ["opposite", "adjacent", "double", "half", "supplementary", "nearest"] },
        { en: " angle.", af: " hoek." },
      ],
      hints: [
        { en: "Compare the exterior angle at C with ∠A, then with the others. Which interior angle does it match?", af: "Vergelyk die buitehoek by C met ∠A, dan met die ander. Watter binnehoek stem ooreen?" },
        { en: "It equals the angle at the OPPOSITE vertex — ∠A, diagonally across from C.", af: "Dit is gelyk aan die hoek by die TEENOORSTAANDE hoekpunt — ∠A, dwarsoor van C." },
      ],
      reason: "cyclicExt",
      note: { en: "The exterior angle of a cyclic quad = the interior opposite angle. Why? ext = 180 − ∠C, and ∠A = 180 − ∠C as well (opposite angles), so ext = ∠A. Reason: <i>ext ∠ of cyclic quad</i>.", af: "Die buitehoek van 'n koordevierhoek = die binne-teenoorstaande hoek. Hoekom? buite = 180 − ∠C, en ∠A = 180 − ∠C ook (teenoorstaande hoeke), so buite = ∠A. Rede: <i>buite∠ van kvh</i>." } },
  ],
};
