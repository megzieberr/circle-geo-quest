/* DISCOVERY — Angles in the same segment (+ what "subtends" means + the bowtie).
   First teaches/checks what it means for a chord to SUBTEND an angle at the
   circumference, then lets the learner drag ALL FOUR points (A, B, P, Q). P and
   Q sit on the same arc, so the figure is a "bowtie" and the two angles are
   always equal. Raw angles on the diagram, no verdict. Not graded. */
const AC = "#4263eb";
const GREEN = "#0ea271", PURPLE = "#9c36b5", INK = "#252a4a";

// static diagrams for the "subtends" exercises (angle arc only, no value)
const SUB1 = { pts: { A: 200, B: 340, P: 80 }, chords: [["A", "B"], ["A", "P"], ["B", "P"]],
  angles: [{ at: "P", legs: ["A", "B"], t: "•", o: {} }] };
const SUB2 = { pts: { A: 205, B: 335, D: 120 }, chords: [["A", "B"], ["A", "D"], ["B", "D"]],
  angles: [{ at: "D", legs: ["A", "B"], t: "•", o: {} }] };

const MODEL = () => ({
  w: 344, h: 296, cx: 172, cy: 150, R: 104,
  fixed: {},
  handles: [
    { id: "A", kind: "arc", min: 196, max: 256, init: 216 },
    { id: "B", kind: "arc", min: 284, max: 344, init: 324 },
    { id: "P", kind: "arc", min: 12, max: 168, init: 52 },
    { id: "Q", kind: "arc", min: 12, max: 168, init: 128 },
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
        { vx: P.x, vy: P.y, ux: A.x, uy: A.y, wx: B.x, wy: B.y, color: GREEN, label: Math.round(m.p) + "°" },
        { vx: Q.x, vy: Q.y, ux: A.x, uy: A.y, wx: B.x, wy: B.y, color: PURPLE, label: Math.round(m.q) + "°" },
      ],
      dots: [
        { x: A.x, y: A.y, color: INK, label: "A", dx: -14, dy: 4 },
        { x: B.x, y: B.y, color: INK, label: "B", dx: 13, dy: 4 },
        { x: P.x, y: P.y, color: INK, label: "P", dx: 6, dy: -13 },
        { x: Q.x, y: Q.y, color: INK, label: "Q", dx: -8, dy: -13 },
      ],
    };
  },
  measure(pos, ctx) {
    const A = pos.A, B = pos.B;
    return { p: ctx.angleAt(pos.P, A, B), q: ctx.angleAt(pos.Q, A, B) };
  },
  readouts(m) {
    return [
      { label: { en: "∠APB  (green)", af: "∠APB  (groen)" }, value: Math.round(m.p) + "°", color: GREEN },
      { label: { en: "∠AQB  (purple)", af: "∠AQB  (pers)" }, value: Math.round(m.q) + "°", color: PURPLE },
    ];
  },
});

export const round = {
  id: "dsameseg", n: 1, accent: AC, kind: "discover", group: "g2",
  title: { en: "Discover: angles in the same segment", af: "Ontdek: hoeke in dieselfde segment" },
  blurb: { en: "What 'subtends' means, the bowtie, and a hidden rule.", af: "Wat 'onderspan' beteken, die strikdas, en 'n verborge reël." },
  panels: [
    { type: "choice",
      prompt: { en: "You just saw it — which chord subtends the marked angle ∠APB?", af: "Jy het dit pas gesien — watter koord onderspan die gemerkte hoek ∠APB?" },
      diagram: SUB1,
      options: [
        { text: { en: "AB — it joins the two arms of the angle", af: "AB — dit verbind die twee bene van die hoek" }, correct: true },
        { text: { en: "AP", af: "AP" } },
        { text: { en: "BP", af: "BP" } },
      ],
      hints: [{ en: "The subtended chord is the one OPPOSITE the vertex — it joins the ends of the two arms.", af: "Die onderspande koord is dié OORKANT die hoekpunt — dit verbind die punte van die twee bene." }],
      note: { en: "AB is the chord that subtends ∠APB. The arms PA and PB end at A and B.", af: "AB is die koord wat ∠APB onderspan. Die bene PA en PB eindig by A en B." } },

    { type: "choice",
      prompt: { en: "∠ADB is marked here. Which chord subtends it?", af: "∠ADB is hier gemerk. Watter koord onderspan dit?" },
      diagram: SUB2,
      options: [
        { text: { en: "AB", af: "AB" }, correct: true },
        { text: { en: "AD", af: "AD" } },
        { text: { en: "BD", af: "BD" } },
      ],
      hints: [{ en: "Look at where the two arms DA and DB end. The chord joining those ends is the one subtended.", af: "Kyk waar die twee bene DA en DB eindig. Die koord wat daardie punte verbind, is die onderspande een." }],
      note: { en: "Again it's AB — the same chord can subtend an angle at many different points on the circle.", af: "Weer is dit AB — dieselfde koord kan 'n hoek by baie verskillende punte op die sirkel onderspan." } },

    { type: "explore",
      prompt: { en: "Drag A, B, P and Q", af: "Sleep A, B, P en Q" },
      instruction: { en: "Chord AB subtends ∠APB (green) at P and ∠AQB (purple) at Q — both on the same arc. Move every point around. Do the two angles ever differ?", af: "Koord AB onderspan ∠APB (groen) by P en ∠AQB (pers) by Q — albei op dieselfde boog. Skuif elke punt rond. Verskil die twee hoeke ooit?" },
      interactive: MODEL() },

    { type: "blank",
      prompt: { en: "Fill in what you found", af: "Vul in wat jy gevind het" },
      interactive: MODEL(),
      sentence: [
        { en: "Angles subtended by the same chord, in the same segment, are always ", af: "Hoeke onderspan deur dieselfde koord, in dieselfde segment, is altyd " },
        { kind: "word", answer: "equal", options: ["equal", "unequal", "double", "half", "supplementary", "opposite"] },
        { en: ".", af: "." },
      ],
      hints: [
        { en: "Move P and Q to lots of spots on that arc. Compare ∠APB and ∠AQB each time.", af: "Skuif P en Q na baie plekke op daardie boog. Vergelyk ∠APB en ∠AQB elke keer." },
        { en: "Wherever they sit on the same arc, the two angles stay the same size — equal.", af: "Waar hulle ook al op dieselfde boog sit, bly die twee hoeke dieselfde grootte — gelyk." },
      ],
      reason: "sameSeg",
      note: { en: "Angles in the same segment are equal. (Each equals half the angle chord AB makes at the centre — that's the deeper reason.)", af: "Hoeke in dieselfde segment is gelyk. (Elkeen is gelyk aan die helfte van die hoek wat koord AB by die middelpunt maak — dít is die dieper rede.)" } },
  ],
};
