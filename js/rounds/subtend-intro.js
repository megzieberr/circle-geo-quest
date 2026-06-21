/* Animated intro — what does "subtend" mean? (cutscene, before same segment)
   Draw a chord, then grow an arm from each end up to a point P where they MEET,
   making an angle. Highlight the angle + chord. Repeat at three different points
   so the idea is unmistakable. "Subtends" is notoriously slippery for Gr 11s. */
import { pol, sweepOf } from "../engine.js";
const AC = "#4263eb";

// must match CS in cutscene.js
const cx = 180, cy = 148, R = 104;
const P = (deg, r = R) => pol(cx, cy, r, deg);
const f = n => (Math.round(n * 10) / 10);

const ln = (a, b, cls) => `<line class="${cls}" pathLength="1" x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}"/>`;
const dot = (p, label, dx = 10, dy = -8, cls = "cs-dot") => `<circle class="${cls}" cx="${f(p[0])}" cy="${f(p[1])}" r="3.4"/>` +
  (label ? `<text class="pl" x="${f(p[0] + dx)}" y="${f(p[1] + dy)}">${label}</text>` : "");
const legdeg = (V, Q) => Math.atan2(-(Q[1] - V[1]), Q[0] - V[0]) * 180 / Math.PI;
const angArc = (V, U, W, cls, r = 24) => {
  let d1 = legdeg(V, U), d2 = legdeg(V, W);
  let s = sweepOf(d1, d2); if (s > 180) { const t = d1; d1 = d2; d2 = t; s = sweepOf(d1, d2); }
  const p1 = pol(V[0], V[1], r, d1), p2 = pol(V[0], V[1], r, d1 + s);
  return `<path class="${cls}" pathLength="1" fill="none" d="M ${f(p1[0])} ${f(p1[1])} A ${r} ${r} 0 0 0 ${f(p2[0])} ${f(p2[1])}"/>`;
};

const A = P(200), B = P(340);                 // the chord
const O = [cx, cy];                           // the centre
const P1 = P(90), P2 = P(48), P3 = P(133);    // three points on the same arc
const circ = `<circle class="cs-circle cs-draw" cx="${cx}" cy="${cy}" r="${R}" pathLength="1"/>`;

// one "reach up and meet at Pn" beat: arms grow from A and B to Pn, angle + chord glow
const subtendAt = (Pn, lab) =>
  ln(A, B, "cs-hl") +                          // chord glows (fades in)
  ln(A, Pn, "cs-arm cs-draw") + ln(B, Pn, "cs-arm cs-draw") +
  angArc(Pn, A, B, "cs-ang cs-draw") +
  dot(Pn, lab, 0, -12);

export const round = {
  id: "subtend", n: 1, accent: AC, kind: "cutscene", group: "g2",
  title: { en: "What does \"subtend\" mean?", af: "Wat beteken \"onderspan\"?" },
  blurb: { en: "Watch a chord reach up and make an angle.", af: "Kyk hoe 'n koord opreik en 'n hoek maak." },
  scenes: [
    { caption: { en: "Here is a <b>circle</b> with a <b>chord</b> — the chord just joins two points, A and B, on the circle.", af: "Hier is 'n <b>sirkel</b> met 'n <b>koord</b> — die koord verbind net twee punte, A en B, op die sirkel." },
      anim: "draw", frag: circ + ln(A, B, "cs-part cs-draw") + dot(A, "A", -14, 5) + dot(B, "B", 9, 5) },

    { caption: { en: "Now grow an arm from <b>each end</b> up to a point P. The two arms meet at P and make an angle. Chord AB <b>subtends ∠APB</b> at P.", af: "Laat nou 'n arm vanaf <b>elke punt</b> opgroei na 'n punt P. Die twee arms ontmoet by P en maak 'n hoek. Koord AB <b>onderspan ∠APB</b> by P." },
      anim: "draw", persist: false, frag: subtendAt(P1, "P") },

    { caption: { en: "The arms always reach back to <b>A and B</b> — the ends of the chord. The chord sits <b>opposite</b> the angle.", af: "Die arms reik altyd terug na <b>A en B</b> — die punte van die koord. Die koord lê <b>oorkant</b> die hoek." },
      anim: "draw", persist: false, frag: subtendAt(P1, "P") },

    { caption: { en: "Move to a <b>different point</b> P. The same chord AB subtends an angle here too.", af: "Skuif na 'n <b>ander punt</b> P. Dieselfde koord AB onderspan ook hier 'n hoek." },
      anim: "draw", persist: false, frag: subtendAt(P2, "P") },

    { caption: { en: "And at a <b>third point</b> — chord AB subtends an angle wherever you join its two ends to the circle.", af: "En by 'n <b>derde punt</b> — koord AB onderspan 'n hoek waar jy ook al sy twee punte aan die sirkel verbind." },
      anim: "draw", persist: false, frag: subtendAt(P3, "P") },

    { caption: { en: "Three points, three angles — but always the <b>same chord AB</b>, with arms ending at A and B. <b>That</b> is what \"subtends\" means.", af: "Drie punte, drie hoeke — maar altyd <b>dieselfde koord AB</b>, met arms wat by A en B eindig. <b>Dít</b> is wat \"onderspan\" beteken." },
      anim: "fade", persist: false,
      frag: ln(A, B, "cs-hl") +
        ln(A, P1, "cs-arm-faint") + ln(B, P1, "cs-arm-faint") + angArc(P1, A, B, "cs-ang-faint") +
        ln(A, P2, "cs-arm-faint") + ln(B, P2, "cs-arm-faint") + angArc(P2, A, B, "cs-ang-faint") +
        ln(A, P3, "cs-arm-faint") + ln(B, P3, "cs-arm-faint") + angArc(P3, A, B, "cs-ang-faint") +
        dot(P1, "") + dot(P2, "") + dot(P3, "") },

    { caption: { en: "The chord can also reach the <b>centre O</b>. Here chord AB subtends <b>∠AOB</b> at the centre — the same chord, now making an angle at the middle of the circle.", af: "Die koord kan ook die <b>middelpunt O</b> bereik. Hier onderspan koord AB <b>∠AOB</b> by die middelpunt — dieselfde koord, maar nou maak dit 'n hoek by die middel van die sirkel." },
      anim: "draw", persist: false,
      frag: ln(A, B, "cs-hl") +
        ln(O, A, "cs-arm cs-draw") + ln(O, B, "cs-arm cs-draw") +
        angArc(O, A, B, "cs-ang cs-draw", 26) +
        dot(O, "O", 8, -10) + dot(A, "A", -14, 5) + dot(B, "B", 9, 5) },
  ],
};
