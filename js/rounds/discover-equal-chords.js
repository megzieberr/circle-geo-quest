/* DISCOVERY — Equal chords subtend equal angles (at the centre AND the circumference).
   Panel 1: chord AB fixed, resize CD to match → the two CENTRE angles become
   equal. Panel 2: two equal chords, drag P → the two CIRCUMFERENCE angles are
   equal too. Raw lengths/angles shown; no verdict. Not graded. */
const AC = "#0ea271";
const ORANGE = "#f76707", BLUE = "#4263eb", GREEN = "#0ea271", INK = "#252a4a";
const px = (a, b) => Math.round(Math.hypot(a.x - b.x, a.y - b.y));

// ---- Panel 1: centre angles, resize CD to match AB ----
const CENTRE = () => ({
  w: 340, h: 300, cx: 168, cy: 150, R: 100,
  fixed: { O: true, pts: { A: 130, B: 50 }, chords: [["A", "B"]] },
  handles: [{ id: "C", kind: "arc", min: 276, max: 338, init: 320 }],
  frame(pos, ctx, m) {
    const O = ctx.P("O"), A = ctx.P("A"), B = ctx.P("B"), C = pos.C, D = ctx.pol(180 - C.deg);
    return {
      segments: [
        { x1: O.x, y1: O.y, x2: A.x, y2: A.y, cls: "faint" },
        { x1: O.x, y1: O.y, x2: B.x, y2: B.y, cls: "faint" },
        { x1: O.x, y1: O.y, x2: C.x, y2: C.y, cls: "faint" },
        { x1: O.x, y1: O.y, x2: D.x, y2: D.y, cls: "faint" },
        { x1: A.x, y1: A.y, x2: B.x, y2: B.y, cls: "thick", color: ORANGE },
        { x1: C.x, y1: C.y, x2: D.x, y2: D.y, cls: "thick", color: BLUE },
      ],
      angles: [
        { vx: O.x, vy: O.y, ux: A.x, uy: A.y, wx: B.x, wy: B.y, color: ORANGE, label: Math.round(m.aob) + "°" },
        { vx: O.x, vy: O.y, ux: C.x, uy: C.y, wx: D.x, wy: D.y, color: BLUE, label: Math.round(m.cod) + "°" },
      ],
      dots: [{ x: C.x, y: C.y, color: INK, label: "C", dx: 12, dy: 6 }, { x: D.x, y: D.y, color: INK, label: "D", dx: -14, dy: 6 }],
    };
  },
  measure(pos, ctx) {
    const O = ctx.P("O"), A = ctx.P("A"), B = ctx.P("B"), C = pos.C, D = ctx.pol(180 - C.deg);
    return { aob: ctx.angleAt(O, A, B), cod: ctx.angleAt(O, C, D), ab: px(A, B), cd: px(C, D) };
  },
  readouts(m) {
    return [
      { label: { en: "Chord AB (orange)", af: "Koord AB (oranje)" }, value: m.ab, color: ORANGE },
      { label: { en: "Chord CD (blue)", af: "Koord CD (blou)" }, value: m.cd, color: BLUE },
      { label: { en: "∠AOB at centre", af: "∠AOB by middelpunt" }, value: Math.round(m.aob) + "°", color: ORANGE },
      { label: { en: "∠COD at centre", af: "∠COD by middelpunt" }, value: Math.round(m.cod) + "°", color: BLUE },
    ];
  },
});

// ---- Panel 2: two equal chords, circumference angles from a draggable P ----
const CIRC = () => ({
  w: 340, h: 300, cx: 168, cy: 150, R: 100,
  fixed: { pts: { A: 130, B: 50, C: 310, D: 230 }, chords: [["A", "B"], ["C", "D"]] },
  handles: [{ id: "P", kind: "arc", min: 142, max: 218, init: 180 }],
  frame(pos, ctx, m) {
    const A = ctx.P("A"), B = ctx.P("B"), C = ctx.P("C"), D = ctx.P("D"), P = pos.P;
    return {
      segments: [
        { x1: A.x, y1: A.y, x2: B.x, y2: B.y, cls: "thick", color: ORANGE },
        { x1: C.x, y1: C.y, x2: D.x, y2: D.y, cls: "thick", color: BLUE },
        { x1: P.x, y1: P.y, x2: A.x, y2: A.y, cls: "thin", color: ORANGE },
        { x1: P.x, y1: P.y, x2: B.x, y2: B.y, cls: "thin", color: ORANGE },
        { x1: P.x, y1: P.y, x2: C.x, y2: C.y, cls: "thin", color: BLUE },
        { x1: P.x, y1: P.y, x2: D.x, y2: D.y, cls: "thin", color: BLUE },
      ],
      angles: [
        { vx: P.x, vy: P.y, ux: A.x, uy: A.y, wx: B.x, wy: B.y, color: ORANGE, label: Math.round(m.apb) + "°" },
        { vx: P.x, vy: P.y, ux: C.x, uy: C.y, wx: D.x, wy: D.y, color: BLUE, label: Math.round(m.cpd) + "°" },
      ],
      dots: [{ x: P.x, y: P.y, color: INK, label: "P", dx: -14, dy: 0 }],
    };
  },
  measure(pos, ctx) {
    const A = ctx.P("A"), B = ctx.P("B"), C = ctx.P("C"), D = ctx.P("D"), P = pos.P;
    return { apb: ctx.angleAt(P, A, B), cpd: ctx.angleAt(P, C, D), ab: px(A, B), cd: px(C, D) };
  },
  readouts(m) {
    return [
      { label: { en: "Chord AB = Chord CD", af: "Koord AB = Koord CD" }, value: m.ab + " = " + m.cd },
      { label: { en: "∠APB on circle (orange)", af: "∠APB op sirkel (oranje)" }, value: Math.round(m.apb) + "°", color: ORANGE },
      { label: { en: "∠CPD on circle (blue)", af: "∠CPD op sirkel (blou)" }, value: Math.round(m.cpd) + "°", color: BLUE },
    ];
  },
});

export const round = {
  id: "deqchord", n: 1, accent: AC, kind: "discover", group: "g2",
  title: { en: "Discover: equal chords", af: "Ontdek: gelyke koorde" },
  blurb: { en: "Equal chords, equal angles — at the centre and the edge.", af: "Gelyke koorde, gelyke hoeke — by die middelpunt en die rand." },
  panels: [
    { type: "explore",
      prompt: { en: "Make chord CD equal to chord AB", af: "Maak koord CD gelyk aan koord AB" },
      instruction: { en: "Chord AB (orange) is fixed. Drag C to grow or shrink chord CD (blue). Use the panel to make CD the same length as AB — then look at the two angles at the centre.", af: "Koord AB (oranje) is vas. Sleep C om koord CD (blou) te vergroot of verklein. Gebruik die paneel om CD dieselfde lengte as AB te maak — kyk dan na die twee hoeke by die middelpunt." },
      interactive: CENTRE() },

    { type: "explore",
      prompt: { en: "Now look at the edge of the circle", af: "Kyk nou na die rand van die sirkel" },
      instruction: { en: "Here AB and CD are two EQUAL chords. Point P is on the circle, joined to both chords. Drag P around — compare ∠APB and ∠CPD, the angles the equal chords make on the circumference.", af: "Hier is AB en CD twee GELYKE koorde. Punt P is op die sirkel, aan albei koorde verbind. Sleep P rond — vergelyk ∠APB en ∠CPD, die hoeke wat die gelyke koorde op die omtrek maak." },
      interactive: CIRC() },

    { type: "blank",
      prompt: { en: "Fill in the rule", af: "Vul die reël in" },
      interactive: CIRC(),
      sentence: [
        { en: "Equal chords subtend ", af: "Gelyke koorde onderspan " },
        { kind: "word", answer: "equal", options: ["equal", "unequal", "double", "half", "supplementary", "opposite"] },
        { en: " angles — at the centre AND at the circumference.", af: " hoeke — by die middelpunt EN by die omtrek." },
      ],
      hints: [
        { en: "You saw it twice: equal chords at the centre, and equal chords at the circle (P). How do the angles compare?", af: "Jy het dit twee keer gesien: gelyke koorde by die middelpunt, en by die sirkel (P). Hoe vergelyk die hoeke?" },
        { en: "Equal-length chords always make equal angles — both at the centre and at the circumference.", af: "Gelyke koorde maak altyd gelyke hoeke — by die middelpunt en by die omtrek." },
      ],
      reason: "equalChords",
      note: { en: "Equal chords subtend equal angles at the centre, and equal angles at the circumference. Reason: <i>equal chords; equal ∠s</i>.", af: "Gelyke koorde onderspan gelyke hoeke by die middelpunt, en gelyke hoeke by die omtrek. Rede: <i>gelyke koorde; gelyke ∠e</i>." } },
  ],
};
