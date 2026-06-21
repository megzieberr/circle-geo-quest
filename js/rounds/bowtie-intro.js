/* Animated "bowtie" (cutscene, after the same-segment discovery).
   Chord AB is subtended at two points C and D below it. The arms CA and DB
   cross to make the classic bowtie ⋈, and the two angles at C and D (same
   segment) are equal — highlighted with a pulsing animation. */
import { pol, sweepOf } from "../engine.js";
const AC = "#4263eb";

const cx = 180, cy = 148, R = 104;             // must match CS in cutscene.js
const P = (deg, r = R) => pol(cx, cy, r, deg);
const f = n => (Math.round(n * 10) / 10);

const ln = (a, b, cls) => `<line class="${cls}" pathLength="1" x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}"/>`;
const dot = (p, label, dx = 10, dy = -8) => `<circle class="cs-dot" cx="${f(p[0])}" cy="${f(p[1])}" r="3.4"/>` +
  (label ? `<text class="pl" x="${f(p[0] + dx)}" y="${f(p[1] + dy)}">${label}</text>` : "");
const legdeg = (V, Q) => Math.atan2(-(Q[1] - V[1]), Q[0] - V[0]) * 180 / Math.PI;
function angArc(V, U, W, cls, val, r = 26) {
  let d1 = legdeg(V, U), d2 = legdeg(V, W);
  let s = sweepOf(d1, d2); if (s > 180) { const t = d1; d1 = d2; d2 = t; s = sweepOf(d1, d2); }
  const p1 = pol(V[0], V[1], r, d1), p2 = pol(V[0], V[1], r, d1 + s);
  let out = `<path class="${cls}" pathLength="1" fill="none" d="M ${f(p1[0])} ${f(p1[1])} A ${r} ${r} 0 0 0 ${f(p2[0])} ${f(p2[1])}"/>`;
  if (val != null) { const lp = pol(V[0], V[1], r + 14, d1 + s / 2); out += `<text class="cs-eqlab" x="${f(lp[0])}" y="${f(lp[1])}">${val}</text>`; }
  return out;
}

const A = P(145), B = P(35);          // chord AB (top)
const C = P(325), D = P(215);         // two points below — both subtend AB

export const round = {
  id: "bowtie", n: 1, accent: AC, kind: "cutscene", group: "g2",
  title: { en: "The bowtie", af: "Die strikdas" },
  blurb: { en: "Spot the bowtie and its two equal angles.", af: "Herken die strikdas en sy twee gelyke hoeke." },
  scenes: [
    { caption: { en: "Here is chord <b>AB</b>, with two points <b>C</b> and <b>D</b> on the arc below it.", af: "Hier is koord <b>AB</b>, met twee punte <b>C</b> en <b>D</b> op die boog daaronder." },
      anim: "draw", frag: ln(A, B, "cs-part cs-draw") + dot(A, "A", -14, 3) + dot(B, "B", 9, 3) + dot(C, "C", 10, 8) + dot(D, "D", -14, 8) },

    { caption: { en: "Chord AB subtends an angle at <b>C</b> — join C to both ends, A and B.", af: "Koord AB onderspan 'n hoek by <b>C</b> — verbind C aan albei punte, A en B." },
      anim: "draw", frag: ln(C, A, "cs-arm cs-draw") + ln(C, B, "cs-arm cs-draw") + angArc(C, A, B, "cs-ang") },

    { caption: { en: "And it subtends an angle at <b>D</b> too. Now the arms CA and DB <b>cross</b> — there's your bowtie ⋈.", af: "En dit onderspan ook 'n hoek by <b>D</b>. Nou <b>kruis</b> die arms CA en DB — daar is jou strikdas ⋈." },
      anim: "draw", frag: ln(D, A, "cs-arm cs-draw") + ln(D, B, "cs-arm cs-draw") + angArc(D, A, B, "cs-ang") },

    { caption: { en: "Both angles stand on the <b>same chord AB</b>, in the <b>same segment</b> — so the two ends of the bowtie are <b>EQUAL</b>: ∠C = ∠D.", af: "Albei hoeke staan op <b>dieselfde koord AB</b>, in <b>dieselfde segment</b> — so die twee punte van die strikdas is <b>GELYK</b>: ∠C = ∠D." },
      anim: "fade", persist: false,
      frag: ln(C, A, "cs-bow") + ln(D, B, "cs-bow") + ln(C, B, "cs-bow") + ln(D, A, "cs-bow") +
        angArc(C, A, B, "cs-eq", "55°") + angArc(D, A, B, "cs-eq", "55°") },
  ],
};
