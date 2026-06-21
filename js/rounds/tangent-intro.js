/* Animated intro — what is a tangent? (cutscene, first round of Group 3)
   Contrast a secant (cuts at 2 points) with a tangent (touches at 1), show the
   contact point, then draw the radius to it — teasing the angle to come. */
import { pol } from "../engine.js";
const AC = "#f76707";

const cx = 180, cy = 148, R = 104;             // must match CS in cutscene.js
const P = (deg, r = R) => pol(cx, cy, r, deg);
const f = n => (Math.round(n * 10) / 10);
const ln = (a, b, cls) => `<line class="${cls}" pathLength="1" x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}"/>`;
const dot = (p, label, dx = 10, dy = -8, cls = "cs-dot") => `<circle class="${cls}" cx="${f(p[0])}" cy="${f(p[1])}" r="3.6"/>` +
  (label ? `<text class="pl" x="${f(p[0] + dx)}" y="${f(p[1] + dy)}">${label}</text>` : "");

const circ = `<circle class="cs-circle cs-draw" cx="${cx}" cy="${cy}" r="${R}" pathLength="1"/>`;
const T = P(270), O = [cx, cy];                // contact point + centre
const tanL = [T[0] - 110, T[1]], tanR = [T[0] + 110, T[1]];   // tangent at T (horizontal)
// a secant cutting the circle at two points
const S1 = P(205), S2 = P(335);
const dirx = S2[0] - S1[0], diry = S2[1] - S1[1], dl = Math.hypot(dirx, diry);
const secA = [S1[0] - dirx / dl * 26, S1[1] - diry / dl * 26], secB = [S2[0] + dirx / dl * 26, S2[1] + diry / dl * 26];

export const round = {
  id: "tanintro", n: 1, accent: AC, kind: "cutscene", group: "g3",
  title: { en: "What is a tangent?", af: "Wat is 'n raaklyn?" },
  blurb: { en: "Meet the tangent before you unlock its secrets.", af: "Leer die raaklyn ken voor jy sy geheime oopsluit." },
  scenes: [
    { caption: { en: "Here is a circle.", af: "Hier is 'n sirkel." },
      anim: "draw", frag: circ },

    { caption: { en: "A straight line can <b>cut</b> a circle at <b>two</b> points — that line is a <b>secant</b>.", af: "'n Reguitlyn kan 'n sirkel by <b>twee</b> punte <b>sny</b> — daardie lyn is 'n <b>sekanslyn</b>." },
      anim: "draw", persist: false, frag: ln(secA, secB, "cs-part cs-draw") + dot(S1, "") + dot(S2, "") },

    { caption: { en: "A <b>tangent</b> is different — it just <b>touches</b> the circle at <b>one</b> point: the <b>contact point</b> T.", af: "'n <b>Raaklyn</b> is anders — dit <b>raak</b> die sirkel by <b>een</b> punt: die <b>raakpunt</b> T." },
      anim: "draw", frag: ln(tanL, tanR, "cs-part cs-draw") + dot(T, "T", 0, 18) },

    { caption: { en: "Now join the centre <b>O</b> to the contact point T — that's the <b>radius</b> OT. Soon you'll discover the special angle it makes with the tangent.", af: "Verbind nou die middelpunt <b>O</b> met die raakpunt T — dis die <b>radius</b> OT. Binnekort ontdek jy die spesiale hoek wat dit met die raaklyn maak." },
      anim: "draw", frag: ln(O, T, "cs-arm cs-draw") + dot(O, "O", 11, -4) },
  ],
};
