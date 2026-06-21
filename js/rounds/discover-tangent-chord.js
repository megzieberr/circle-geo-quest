/* DISCOVERY — Tangent-chord (angle in the alternate segment).
   Tangent at T, chord TB. The angle between the tangent and the chord equals
   the inscribed angle ∠TPB in the ALTERNATE segment (the other side of the
   chord). Drag B and P — the two angles stay equal. Honest geometry. Not graded. */
const AC = "#f76707";
const ORANGE = "#f76707", BLUE = "#4263eb", INK = "#252a4a";

const MODEL = () => ({
  w: 344, h: 300, cx: 172, cy: 140, R: 100,
  fixed: { O: true, pts: { T: 270 } },
  handles: [
    { id: "B", kind: "arc", min: 15, max: 85, init: 50 },
    { id: "P", kind: "arc", min: 110, max: 250, init: 175 },
  ],
  frame(pos, ctx, m) {
    const T = ctx.P("T"), B = pos.B, P = pos.P;
    const tanL = { x: T.x - 110, y: T.y }, tanR = { x: T.x + 110, y: T.y };  // horizontal tangent at T (270°)
    const Rdir = { x: T.x + 40, y: T.y };
    return {
      segments: [
        { x1: tanL.x, y1: tanL.y, x2: tanR.x, y2: tanR.y, cls: "thick" },     // tangent
        { x1: T.x, y1: T.y, x2: B.x, y2: B.y, cls: "accent" },                 // chord TB
        { x1: P.x, y1: P.y, x2: T.x, y2: T.y, cls: "thin", color: BLUE },
        { x1: P.x, y1: P.y, x2: B.x, y2: B.y, cls: "thin", color: BLUE },
      ],
      angles: [
        { vx: T.x, vy: T.y, ux: B.x, uy: B.y, wx: Rdir.x, wy: Rdir.y, color: ORANGE, label: Math.round(m.tc) + "°" },
        { vx: P.x, vy: P.y, ux: T.x, uy: T.y, wx: B.x, wy: B.y, color: BLUE, label: Math.round(m.insc) + "°" },
      ],
      dots: [
        { x: T.x, y: T.y, color: INK, label: "T", dx: -2, dy: 18 },
        { x: B.x, y: B.y, color: INK, label: "B", dx: 12, dy: 2 },
        { x: P.x, y: P.y, color: INK, label: "P", dx: -13, dy: 2 },
      ],
    };
  },
  measure(pos, ctx) {
    const T = ctx.P("T"), B = pos.B, P = pos.P;
    const Rdir = { x: T.x + 40, y: T.y };
    return { tc: ctx.angleAt(T, B, Rdir), insc: ctx.angleAt(P, T, B) };
  },
  readouts(m) {
    return [
      { label: { en: "Tangent–chord angle (at T)", af: "Raaklyn–koord-hoek (by T)" }, value: Math.round(m.tc) + "°", color: ORANGE },
      { label: { en: "Angle in alternate segment (∠TPB)", af: "Hoek in oorstaande segment (∠TPB)" }, value: Math.round(m.insc) + "°", color: BLUE },
    ];
  },
});

export const round = {
  id: "dtanchord", n: 1, accent: AC, kind: "discover", group: "g3",
  title: { en: "Discover: tangent–chord", af: "Ontdek: raaklyn–koord" },
  blurb: { en: "The tangent–chord angle hides in the alternate segment.", af: "Die raaklyn–koord-hoek skuil in die oorstaande segment." },
  panels: [
    { type: "explore",
      prompt: { en: "Move P (and B) — compare the two angles", af: "Skuif P (en B) — vergelyk die twee hoeke" },
      instruction: { en: "Orange is the angle between the tangent and chord TB. Blue is ∠TPB, the angle the chord subtends from P in the alternate segment. Drag B (change the chord) and P (move in the segment). How do the two angles compare?", af: "Oranje is die hoek tussen die raaklyn en koord TB. Blou is ∠TPB, die hoek wat die koord vanaf P in die oorstaande segment onderspan. Sleep B (verander die koord) en P (beweeg in die segment). Hoe vergelyk die twee hoeke?" },
      interactive: MODEL() },

    { type: "blank",
      prompt: { en: "Fill in the rule", af: "Vul die reël in" },
      interactive: MODEL(),
      sentence: [
        { en: "The angle between a tangent and a chord equals the angle subtended by the chord in the ", af: "Die hoek tussen 'n raaklyn en 'n koord is gelyk aan die hoek wat die koord onderspan in die " },
        { kind: "word", answer: "alternate", options: ["alternate", "same", "opposite", "minor", "major", "equal"] },
        { en: " segment.", af: " segment." },
      ],
      hints: [
        { en: "Drag P all over its segment, and drag B too. Compare the orange and blue angles each time.", af: "Sleep P oral in sy segment, en sleep B ook. Vergelyk die oranje en blou hoeke elke keer." },
        { en: "The tangent–chord angle always equals the angle in the segment on the OTHER side — the alternate segment.", af: "Die raaklyn–koord-hoek is altyd gelyk aan die hoek in die segment aan die ANDER kant — die oorstaande segment." },
      ],
      reason: "tanChord",
      note: { en: "The angle between a tangent and a chord equals the angle in the alternate segment. Reason: <i>tan-chord theorem</i>.", af: "Die hoek tussen 'n raaklyn en 'n koord is gelyk aan die hoek in die oorstaande segment. Rede: <i>raaklyn-koord-stelling</i>." } },
  ],
};
