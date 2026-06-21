/* DISCOVERY — Angle in a semicircle.
   Built on the previous theorem: AB is a diameter, so the angle at the centre
   is a straight line (180°). By "angle at centre = 2 × angle at circumference",
   the angle at the circumference must be 180 ÷ 2 = 90°. Then drag P to confirm
   it really is 90° everywhere. Guided, not graded. */
const AC = "#f76707";
const GREEN = "#0ea271", INK = "#252a4a";

// diameter AB; drag P around the arc
const MODEL = () => ({
  w: 340, h: 286, cx: 168, cy: 138, R: 100,
  fixed: { O: true, pts: { A: 180, B: 0 }, chords: [["A", "B"]] },
  handles: [{ id: "P", kind: "arc", min: 18, max: 162, init: 70 }],
  frame(pos, ctx, m) {
    const A = ctx.P("A"), B = ctx.P("B"), P = pos.P;
    const sq = Math.abs(m.apb - 90) < 1.2;
    return {
      segments: [
        { x1: P.x, y1: P.y, x2: A.x, y2: A.y, cls: "thick", color: sq ? GREEN : INK },
        { x1: P.x, y1: P.y, x2: B.x, y2: B.y, cls: "thick", color: sq ? GREEN : INK },
      ],
      angles: [{ vx: P.x, vy: P.y, ux: A.x, uy: A.y, wx: B.x, wy: B.y, mark: true, color: GREEN, label: Math.round(m.apb) + "°" }],
      dots: [{ x: P.x, y: P.y, color: INK, label: "P", dx: 0, dy: -14 }],
    };
  },
  measure(pos, ctx) {
    const A = ctx.P("A"), B = ctx.P("B"), P = pos.P;
    return { apb: ctx.angleAt(P, A, B) };
  },
  readouts(m) {
    return [{ label: { en: "∠APB  (P on the circle)", af: "∠APB  (P op die sirkel)" }, value: Math.round(m.apb) + "°", hot: Math.abs(m.apb - 90) < 2 }];
  },
});

// the diameter as a straight angle at O
const DIAM = { O: true, pts: { A: 180, B: 0 }, chords: [["A", "B"]] };
// P added; inscribed angle left unmarked so the learner works it out
const DIAM_P = { O: true, pts: { A: 180, B: 0, P: 62 }, chords: [["A", "B"], ["A", "P"], ["B", "P"]],
  angles: [{ at: "P", legs: ["A", "B"], t: "?", o: { v: 90 } }] };

export const round = {
  id: "dsemi", n: 1, accent: AC, kind: "discover", group: "g1",
  title: { en: "Discover: angle in a semicircle", af: "Ontdek: hoek in 'n halfsirkel" },
  blurb: { en: "Build the right angle from the theorem you just learnt.", af: "Bou die regte hoek uit die stelling wat jy pas geleer het." },
  panels: [
    { type: "blank",
      prompt: { en: "Start at the centre", af: "Begin by die middelpunt" },
      diagram: DIAM,
      sentence: [
        { en: "AB is a diameter, so A, O and B lie on a straight line. The angle at the centre ∠AOB = ", af: "AB is 'n middellyn, dus lê A, O en B op 'n reguitlyn. Die hoek by die middelpunt ∠AOB = " },
        { kind: "num", answer: 180, unit: "°" },
        { en: ".", af: "." },
      ],
      hints: [
        { en: "A, O and B lie in one straight line. Picture standing at O and turning from facing A all the way round to facing B — that's a half-turn.", af: "A, O en B lê in een reguitlyn. Stel jou voor jy staan by O en draai van A af heelpad om na B toe — dis 'n halwe draai." },
        { en: "A full turn all the way around is 360°. A straight line is exactly half of a full turn.", af: "'n Volle draai heelpad rondom is 360°. 'n Reguitlyn is presies die helfte van 'n volle draai." },
      ],
      note: { en: "A straight line is 180°, so ∠AOB = 180°.", af: "'n Reguitlyn is 180°, dus ∠AOB = 180°." } },

    { type: "blank",
      prompt: { en: "Now use the previous theorem", af: "Gebruik nou die vorige stelling" },
      diagram: DIAM_P,
      sentence: [
        { en: "Angle at the centre = 2 × angle at the circumference. So ∠APB = 180 ÷ 2 = ", af: "Hoek by die middelpunt = 2 × hoek by die omtrek. So ∠APB = 180 ÷ 2 = " },
        { kind: "num", answer: 90, unit: "°" },
        { en: ".", af: "." },
      ],
      hints: [
        { en: "The circumference angle is half the centre angle. Half of 180 is…?", af: "Die omtrekshoek is die helfte van die middelpuntshoek. Die helfte van 180 is…?" },
      ],
      reason: "semiCircle",
      note: { en: "∠APB = 90°. The angle in a semicircle (subtended by a diameter) is a right angle. Reason: <i>∠ in semi-circle</i>.", af: "∠APB = 90°. Die hoek in 'n halfsirkel (onderspan deur 'n middellyn) is 'n regte hoek. Rede: <i>∠ in semi sirkel</i>." } },

    { type: "explore",
      prompt: { en: "Confirm it by dragging", af: "Bevestig dit deur te sleep" },
      instruction: { en: "Drag P all the way around the arc. ∠APB never leaves 90° — exactly what the theorem predicted.", af: "Sleep P heelpad om die boog. ∠APB verlaat nooit 90° nie — presies wat die stelling voorspel het." },
      interactive: MODEL() },

    { type: "choice",
      prompt: { en: "Spot it the other way", af: "Herken dit andersom" },
      diagram: { O: true, pts: { A: 180, B: 0, P: 65 }, chords: [["A", "B"], ["A", "P"], ["B", "P"]],
        angles: [{ at: "P", legs: ["A", "B"], t: "", o: { v: 90, mark: 1 } }] },
      options: [
        { text: { en: "AB must be a diameter (it passes through the centre)", af: "AB moet 'n middellyn wees (dit gaan deur die middelpunt)" }, correct: true },
        { text: { en: "AB is just an ordinary chord", af: "AB is net 'n gewone koord" } },
        { text: { en: "P must be the centre", af: "P moet die middelpunt wees" } },
      ],
      hints: [
        { en: "Work backwards: a 90° at the circumference comes from a 180° at the centre — a straight line through O.", af: "Werk terug: 'n 90° by die omtrek kom van 'n 180° by die middelpunt — 'n reguitlyn deur O." },
      ],
      reason: "semiCircle",
      note: { en: "If the angle at the circumference is 90°, the chord it stands on (AB) must be a diameter. This converse is just as useful.", af: "As die hoek by die omtrek 90° is, moet die koord waarop dit staan (AB) 'n middellyn wees. Hierdie omgekeerde is net so nuttig." } },
  ],
};
