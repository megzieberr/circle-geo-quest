/* Parts of a Circle — animated intro (cutscene, before the parts quiz).
   A point appears, a radius swings out like a compass arm, the circle is
   drawn, then each part is revealed and named one tap at a time.
   Coordinates come from the engine's pol() so the picture is honest. */
import { pol } from "../engine.js";
const AC = "#e64980";

// must match CS in cutscene.js
const cx = 180, cy = 148, R = 104;
const P = (deg, r = R) => pol(cx, cy, r, deg);
const f = n => (Math.round(n * 10) / 10);

// a line; pathLength="1" lets the .cs-draw "draw-on" animation work uniformly
const ln = (a, b, cls = "cs-ln") => `<line class="${cls}" pathLength="1" x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}"/>`;
const dot = (p, label, dx = 10, dy = -10) => `<circle class="cs-dot" cx="${f(p[0])}" cy="${f(p[1])}" r="3.4"/>` +
  (label ? `<text class="pl" x="${f(p[0] + dx)}" y="${f(p[1] + dy)}">${label}</text>` : "");
const tag = (p, text) => `<text class="cs-tag" x="${f(p[0])}" y="${f(p[1])}">${text}</text>`;
const arcPath = (d1, d2, r = R) => {
  const a = P(d1, r), b = P(d2, r);
  let s = (d2 - d1) % 360; if (s <= 0) s += 360;
  return `M ${f(a[0])} ${f(a[1])} A ${r} ${r} 0 ${s > 180 ? 1 : 0} 0 ${f(b[0])} ${f(b[1])}`;
};

// reused points
const A = 200, B = 340;        // chord endpoints
const D1 = 205, D2 = 25;       // diameter through O
const Sx = 18, Sy = 142;       // arc / segment span
const RA = 58;                 // radius / sector arm
const Tc = P(90);              // tangent contact (top)
const Te1 = pol(Tc[0], Tc[1], 92, 0), Te2 = pol(Tc[0], Tc[1], 92, 180);

export const round = {
  id: "intro", n: 1, accent: AC, kind: "cutscene", group: "intro",
  title: { en: "Parts of a Circle", af: "Dele van 'n Sirkel" },
  blurb: { en: "Watch a circle being built — then name its parts.", af: "Kyk hoe 'n sirkel gebou word — benoem dan sy dele." },
  scenes: [
    { caption: { en: "Every circle begins with a single point — the <b>centre</b>. We call it <b>O</b>.", af: "Elke sirkel begin met een enkele punt — die <b>middelpunt</b>. Ons noem dit <b>O</b>." },
      anim: "pop", frag: dot([cx, cy], "O", 11, -9) },

    { caption: { en: "Open a compass <b>one radius</b> from the centre. That fixed distance is the <b>radius</b>.", af: "Open 'n passer <b>een radius</b> vanaf die middelpunt. Daardie vaste afstand is die <b>radius</b>." },
      anim: "draw", persist: false,
      frag: ln([cx, cy], P(RA), "cs-part cs-draw") + dot(P(RA), "") + tag(P(RA, R * 0.52), "radius") },

    { caption: { en: "Swing the compass all the way around. The curved edge it traces is the <b>circumference</b>.", af: "Swaai die passer heelpad rond. Die geboë rand wat dit trek, is die <b>omtrek</b>." },
      anim: "draw", frag: `<circle class="cs-circle cs-draw" cx="${cx}" cy="${cy}" r="${R}" pathLength="1"/>` },

    { caption: { en: "A <b>chord</b> joins any two points on the circle.", af: "'n <b>Koord</b> verbind enige twee punte op die sirkel." },
      anim: "draw", persist: false,
      frag: ln(P(A), P(B), "cs-part cs-draw") + dot(P(A), "A", -13, 5) + dot(P(B), "B", 9, 5) },

    { caption: { en: "A chord through the centre is the <b>diameter</b> — the longest chord of all.", af: "'n Koord deur die middelpunt is die <b>middellyn</b> — die langste koord van almal." },
      anim: "draw", persist: false,
      frag: ln(P(D1), P(D2), "cs-part cs-draw") + tag(P(D2, R + 22), "diameter") },

    { caption: { en: "Part of the circumference between two points is an <b>arc</b>.", af: "Deel van die omtrek tussen twee punte is 'n <b>boog</b>." },
      anim: "draw", persist: false,
      frag: `<path class="cs-hi cs-draw" pathLength="1" d="${arcPath(Sx, Sy)}"/>` + dot(P(Sx), "") + dot(P(Sy), "") },

    { caption: { en: "Two radii and the arc between them bound a <b>sector</b> — a pizza slice.", af: "Twee radiusse en die boog tussen hulle begrens 'n <b>sektor</b> — 'n pizzasny." },
      anim: "fade", persist: false,
      frag: `<path class="cs-fill" d="M ${cx} ${cy} L ${f(P(RA)[0])} ${f(P(RA)[1])} A ${R} ${R} 0 0 0 ${f(P(122)[0])} ${f(P(122)[1])} Z"/>` +
        ln([cx, cy], P(RA), "cs-part") + ln([cx, cy], P(122), "cs-part") + tag(P(90, 50), "sector") },

    { caption: { en: "A chord cuts off a <b>segment</b> — the region between the chord and the arc.", af: "'n Koord sny 'n <b>segment</b> af — die gebied tussen die koord en die boog." },
      anim: "fade", persist: false,
      frag: `<path class="cs-fill" d="M ${f(P(Sx)[0])} ${f(P(Sx)[1])} A ${R} ${R} 0 0 0 ${f(P(Sy)[0])} ${f(P(Sy)[1])} Z"/>` +
        ln(P(Sx), P(Sy), "cs-part") + tag(P((Sx + Sy) / 2, R - 30), "segment") },

    { caption: { en: "A line that touches the circle at exactly one point is a <b>tangent</b>.", af: "'n Lyn wat die sirkel by presies een punt raak, is 'n <b>raaklyn</b>." },
      anim: "draw", persist: false,
      frag: ln(Te1, Te2, "cs-part cs-draw") + dot(Tc, "") + tag([Tc[0] + 36, Tc[1] - 8], "tangent") },
  ],
};
