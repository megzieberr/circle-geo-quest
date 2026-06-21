/* DISCOVERY — Tangents from an external point.
   From a point A outside the circle, two tangents touch at F and C. Drag A
   anywhere outside: the two tangent lengths AF and AC change together but are
   always EQUAL. The radii to F and C meet the tangents at 90°. Honest geometry.
   Not graded. */
const AC = "#f76707";
const ORANGE = "#f76707", BLUE = "#4263eb", INK = "#252a4a";
const px = (a, b) => Math.round(Math.hypot(a.x - b.x, a.y - b.y));

// contact points of the two tangents from external point A
function contacts(A, ctx) {
  const dx = A.x - ctx.cx, dy = A.y - ctx.cy, dist = Math.hypot(dx, dy);
  const a = Math.acos(Math.min(1, ctx.R / dist)) * 180 / Math.PI;
  const th = Math.atan2(-dy, dx) * 180 / Math.PI;
  return { F: ctx.pol(th + a), C: ctx.pol(th - a), dist };
}

const MODEL = () => ({
  w: 344, h: 300, cx: 150, cy: 150, R: 92,
  fixed: { O: true },
  handles: [{ id: "A", kind: "free", init: { x: 264, y: 92 },
    clamp: (p, ctx) => { const dx = p.x - ctx.cx, dy = p.y - ctx.cy, d = Math.hypot(dx, dy) || 1, min = ctx.R + 24; return d < min ? { x: ctx.cx + dx / d * min, y: ctx.cy + dy / d * min } : p; } }],
  frame(pos, ctx) {
    const O = ctx.P("O"), A = pos.A, { F, C } = contacts(A, ctx);
    return {
      segments: [
        { x1: O.x, y1: O.y, x2: F.x, y2: F.y, cls: "faint" },   // radius OF
        { x1: O.x, y1: O.y, x2: C.x, y2: C.y, cls: "faint" },   // radius OC
        { x1: O.x, y1: O.y, x2: A.x, y2: A.y, cls: "faint" },   // OA
        { x1: A.x, y1: A.y, x2: F.x, y2: F.y, cls: "thick", color: ORANGE },  // tangent AF
        { x1: A.x, y1: A.y, x2: C.x, y2: C.y, cls: "thick", color: BLUE },    // tangent AC
      ],
      angles: [
        { vx: F.x, vy: F.y, ux: O.x, uy: O.y, wx: A.x, wy: A.y, mark: true, color: INK },
        { vx: C.x, vy: C.y, ux: O.x, uy: O.y, wx: A.x, wy: A.y, mark: true, color: INK },
      ],
      dots: [
        { x: A.x, y: A.y, color: INK, label: "A", dx: 12, dy: -4 },
        { x: F.x, y: F.y, color: ORANGE, label: "F", dx: 10, dy: -8 },
        { x: C.x, y: C.y, color: BLUE, label: "C", dx: 10, dy: 10 },
      ],
    };
  },
  measure(pos, ctx) {
    const A = pos.A, { F, C } = contacts(A, ctx);
    return { af: px(A, F), ac: px(A, C) };
  },
  readouts(m) {
    return [
      { label: { en: "Tangent AF (orange)", af: "Raaklyn AF (oranje)" }, value: m.af, color: ORANGE },
      { label: { en: "Tangent AC (blue)", af: "Raaklyn AC (blou)" }, value: m.ac, color: BLUE },
    ];
  },
});

export const round = {
  id: "dtanpoint", n: 1, accent: AC, kind: "discover", group: "g3",
  title: { en: "Discover: tangents from a point", af: "Ontdek: raaklyne vanuit 'n punt" },
  blurb: { en: "Two tangents from one point — drag and compare.", af: "Twee raaklyne vanuit een punt — sleep en vergelyk." },
  panels: [
    { type: "note",
      prompt: { en: "Two tangents from one point", af: "Twee raaklyne vanuit een punt" },
      diagram: { O: true, pts: { F: 42, C: 318 }, ext: [{ name: "A", t: ["F", "C"] }], chords: [["O", "F"], ["O", "C"]],
        angles: [ { at: "F", legs: ["O", "A"], t: "", o: { v: 90, mark: 1 } }, { at: "C", legs: ["O", "A"], t: "", o: { v: 90, mark: 1 } } ] },
      note: { en: "From a point <b>A outside</b> the circle you can draw exactly <b>two</b> tangents, touching the circle at F and C. (Each radius, OF and OC, meets its tangent at 90° — tan ⊥ radius.)", af: "Vanuit 'n punt <b>A buite</b> die sirkel kan jy presies <b>twee</b> raaklyne trek, wat die sirkel by F en C raak. (Elke radius, OF en OC, ontmoet sy raaklyn teen 90° — raaklyn ⊥ radius.)" } },

    { type: "explore",
      prompt: { en: "Drag A around — watch AF and AC", af: "Sleep A rond — let op AF en AC" },
      instruction: { en: "AF (orange) and AC (blue) are the two tangent lengths from A. Drag A anywhere outside the circle — near, far, all around. What do the two lengths always do?", af: "AF (oranje) en AC (blou) is die twee raaklyn-lengtes vanaf A. Sleep A enige plek buite die sirkel — naby, ver, oral rond. Wat doen die twee lengtes altyd?" },
      interactive: MODEL() },

    { type: "blank",
      prompt: { en: "Fill in what you found", af: "Vul in wat jy gevind het" },
      interactive: MODEL(),
      sentence: [
        { en: "Two tangents drawn to a circle from the same external point are ", af: "Twee raaklyne na 'n sirkel vanuit dieselfde buitepunt is " },
        { kind: "word", answer: "equal", options: ["equal", "unequal", "perpendicular", "parallel", "double", "half"] },
        { en: " in length.", af: " in lengte." },
      ],
      hints: [
        { en: "Move A near, far, and all around. Compare AF and AC in the panel each time.", af: "Beweeg A naby, ver en oral rond. Vergelyk AF en AC in die paneel elke keer." },
        { en: "However you move A, the two tangent lengths are always the same — equal.", af: "Hoe jy A ook al beweeg, die twee raaklyn-lengtes is altyd dieselfde — gelyk." },
      ],
      reason: "tansCommonPt",
      note: { en: "Two tangents from the same external point are equal in length (AF = AC). Reason: <i>tans from same pt</i>.", af: "Twee raaklyne vanuit dieselfde buitepunt is gelyk in lengte (AF = AC). Rede: <i>raaklyne vanuit dieselfde punt</i>." } },
  ],
};
