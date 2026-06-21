/* Animated intro — tangent–chord setup (cutscene, before the tan-chord discovery).
   Draw the tangent + contact point, draw a chord from the contact point, mark the
   tangent–chord angle, then grow the chord's arms up to a point P on the circle
   (it subtends ∠TPB there). Sets up the comparison; the equality is discovered
   in the next round when they move P. */
import { pol, sweepOf } from "../engine.js";
const AC = "#f76707";

const cx = 180, cy = 148, R = 104;             // must match CS in cutscene.js
const P = (deg, r = R) => pol(cx, cy, r, deg);
const f = n => (Math.round(n * 10) / 10);
const ln = (a, b, cls) => `<line class="${cls}" pathLength="1" x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}"/>`;
const dot = (p, label, dx = 10, dy = -8) => `<circle class="cs-dot" cx="${f(p[0])}" cy="${f(p[1])}" r="3.6"/>` +
  (label ? `<text class="pl" x="${f(p[0] + dx)}" y="${f(p[1] + dy)}">${label}</text>` : "");
const legdeg = (V, Q) => Math.atan2(-(Q[1] - V[1]), Q[0] - V[0]) * 180 / Math.PI;
function angArc(V, U, W, cls, r = 24) {
  let d1 = legdeg(V, U), d2 = legdeg(V, W);
  let s = sweepOf(d1, d2); if (s > 180) { const t = d1; d1 = d2; d2 = t; s = sweepOf(d1, d2); }
  const p1 = pol(V[0], V[1], r, d1), p2 = pol(V[0], V[1], r, d1 + s);
  return `<path class="${cls}" pathLength="1" fill="none" d="M ${f(p1[0])} ${f(p1[1])} A ${r} ${r} 0 0 0 ${f(p2[0])} ${f(p2[1])}"/>`;
}

const circ = `<circle class="cs-circle cs-draw" cx="${cx}" cy="${cy}" r="${R}" pathLength="1"/>`;
const T = P(270), B = P(48), Pt = P(160);
const tanL = [T[0] - 110, T[1]], tanR = [T[0] + 110, T[1]], Rdir = [T[0] + 46, T[1]];

export const round = {
  id: "tanchordintro", n: 1, accent: AC, kind: "cutscene", group: "g3",
  title: { en: "Tangent–chord: the set-up", af: "Raaklyn–koord: die opstelling" },
  blurb: { en: "See the two angles before you compare them.", af: "Sien die twee hoeke voor jy hulle vergelyk." },
  scenes: [
    { caption: { en: "A tangent touches the circle at the contact point <b>T</b>.", af: "'n Raaklyn raak die sirkel by die raakpunt <b>T</b>." },
      anim: "draw", frag: circ + ln(tanL, tanR, "cs-part cs-draw") + dot(T, "T", 0, 18) },

    { caption: { en: "From T, draw a <b>chord</b> to a point <b>B</b> on the circle.", af: "Vanaf T, trek 'n <b>koord</b> na 'n punt <b>B</b> op die sirkel." },
      anim: "draw", frag: ln(T, B, "cs-arm cs-draw") + dot(B, "B", 11, -2) },

    { caption: { en: "This is the <b>angle between the tangent and the chord</b> (orange).", af: "Dit is die <b>hoek tussen die raaklyn en die koord</b> (oranje)." },
      anim: "draw", frag: angArc(T, Rdir, B, "cs-ang cs-draw") },

    { caption: { en: "Now grow arms from T and B up to a point <b>P</b> on the circle — the chord TB <b>subtends ∠TPB</b> at P (blue).", af: "Laat nou arms vanaf T en B opgroei na 'n punt <b>P</b> op die sirkel — die koord TB <b>onderspan ∠TPB</b> by P (blou)." },
      anim: "draw", frag: ln(T, Pt, "cs-armb cs-draw") + ln(B, Pt, "cs-armb cs-draw") + dot(Pt, "P", -13, 2) + angArc(Pt, T, B, "cs-angb cs-draw") },

    { caption: { en: "P sits in the <b>alternate segment</b> — the other side of the chord. Next, <b>move P</b> and compare the orange and blue angles!", af: "P sit in die <b>oorstaande segment</b> — die ander kant van die koord. Volgende, <b>skuif P</b> en vergelyk die oranje en blou hoeke!" },
      anim: "fade", persist: false, frag: angArc(T, Rdir, B, "cs-ang") + angArc(Pt, T, B, "cs-angb") },
  ],
};
