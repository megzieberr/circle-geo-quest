/* Animated intro — line from the centre to a chord (cutscene, before the discovery).
   Gentle lead-in so they aren't dropped straight into dragging: draw the circle +
   centre, then a chord, then a line from the centre to the chord — and show it
   meeting the chord at different angles. We do NOT reveal the special (90°) case;
   that's for them to discover by dragging next. */
import { pol, sweepOf } from "../engine.js";
const AC = "#f76707";

const cx = 180, cy = 148, R = 104;             // must match CS in cutscene.js
const P = (deg, r = R) => pol(cx, cy, r, deg);
const f = n => (Math.round(n * 10) / 10);
const ln = (a, b, cls) => `<line class="${cls}" pathLength="1" x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}"/>`;
const dot = (p, label, dx = 10, dy = -8) => `<circle class="cs-dot" cx="${f(p[0])}" cy="${f(p[1])}" r="3.4"/>` +
  (label ? `<text class="pl" x="${f(p[0] + dx)}" y="${f(p[1] + dy)}">${label}</text>` : "");
const legdeg = (V, Q) => Math.atan2(-(Q[1] - V[1]), Q[0] - V[0]) * 180 / Math.PI;
function angArc(V, U, W, cls, val, r = 22) {
  let d1 = legdeg(V, U), d2 = legdeg(V, W);
  let s = sweepOf(d1, d2); if (s > 180) { const t = d1; d1 = d2; d2 = t; s = sweepOf(d1, d2); }
  const p1 = pol(V[0], V[1], r, d1), p2 = pol(V[0], V[1], r, d1 + s);
  let out = `<path class="${cls}" pathLength="1" fill="none" d="M ${f(p1[0])} ${f(p1[1])} A ${r} ${r} 0 0 0 ${f(p2[0])} ${f(p2[1])}"/>`;
  if (val != null) { const lp = pol(V[0], V[1], r + 14, d1 + s / 2); out += `<text class="cs-anglab" x="${f(lp[0])}" y="${f(lp[1])}">${val}</text>`; }
  return out;
}

const circ = `<circle class="cs-circle cs-draw" cx="${cx}" cy="${cy}" r="${R}" pathLength="1"/>`;
const O = [cx, cy];
const A = P(205), B = P(335);                  // chord endpoints (low across the circle)
const M = mx => [mx, A[1]];                     // a foot on the chord
// a line from O through the foot M, out to the circle, plus the angle it makes with the chord
const line = (mx, val, faint = false) => {
  const m = M(mx), dx = m[0] - O[0], dy = m[1] - O[1], L = Math.hypot(dx, dy);
  const far = [O[0] + dx / L * R, O[1] + dy / L * R];
  return ln(O, far, faint ? "cs-arm-faint" : "cs-arm cs-draw") + (faint ? "" : dot(m, "M", -6, 17)) +
    angArc(m, O, B, faint ? "cs-ang-faint" : "cs-ang cs-draw", val);
};

export const round = {
  id: "linecentreintro", n: 1, accent: AC, kind: "cutscene", group: "g1",
  title: { en: "Line from the centre: a first look", af: "Lyn vanaf die middelpunt: 'n eerste kyk" },
  blurb: { en: "Watch the set-up before you explore it yourself.", af: "Kyk na die opstelling voor jy dit self verken." },
  scenes: [
    { caption: { en: "Start with a <b>circle</b> and mark its <b>centre</b>, O.", af: "Begin met 'n <b>sirkel</b> en merk sy <b>middelpunt</b>, O." },
      anim: "draw", frag: circ + dot(O, "O", 11, -6) },

    { caption: { en: "Add a <b>chord</b> — it joins two points, A and B, on the circle.", af: "Voeg 'n <b>koord</b> by — dit verbind twee punte, A en B, op die sirkel." },
      anim: "draw", frag: ln(A, B, "cs-part cs-draw") + dot(A, "A", -13, 6) + dot(B, "B", 9, 6) },

    { caption: { en: "Now draw a <b>line from the centre O</b> to the chord. Here it meets the chord at about <b>50°</b>.", af: "Trek nou 'n <b>lyn vanaf die middelpunt O</b> na die koord. Hier ontmoet dit die koord teen omtrent <b>50°</b>." },
      anim: "draw", persist: false, frag: line(143, "50°") },

    { caption: { en: "As the line moves, the <b>angle changes</b> — here it meets the chord at about <b>124°</b>.", af: "Soos die lyn beweeg, <b>verander die hoek</b> — hier ontmoet dit die koord teen omtrent <b>124°</b>." },
      anim: "draw", persist: false, frag: line(210, "124°") },

    { caption: { en: "The line from the centre can meet the chord at <b>all sorts of angles</b>. Next, <b>drag it yourself</b> and discover what's special about one of them!", af: "Die lyn vanaf die middelpunt kan die koord teen <b>allerlei hoeke</b> ontmoet. Volgende, <b>sleep dit self</b> en ontdek wat besonders is aan een van hulle!" },
      anim: "fade", persist: false, frag: line(143, "50°", true) + line(210, "124°", true) },
  ],
};
