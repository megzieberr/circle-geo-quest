/* ============================================================
   ew2 · "Nou met die ∥ lyne"   (Eweredigheid, group g9)
   ------------------------------------------------------------
   The second Gr12 Eweredigheid mini round (EWEREDIGHEID-PLAN.md,
   kept local). AFRIKAANS ONLY, exactly like ew1: every learner-facing
   string is plain Afrikaans; `title` and `blurb` carry the same
   Afrikaans twice (see the note in ewe1-watter-sye.js).

   The mirror of ew1. There the ∥ lines were the wrong chips. Here a ∥
   line is IN the ratio, so the ratio comes from the two similar
   triangles: the small Δ at the corner and the whole Δ. Every length is
   a side of one of those two triangles, and the bottom pieces of the
   cut sides are the wrong chips (the trap this round is about).

   The marker is markRatio's opt-in "similar" mode (js/ewe-core.js),
   proved against a lengths-only oracle over every fill by
   tools/check-ewe-marker.mjs. Every t below was checked there for
   accidental equal lengths.

   Her wording, from her own notes (the digest, p.49 and the reasons
   table): the similarity line is written first, "Δ PRQ ||| Δ PST (LLL)",
   where her (LLL) is (∠∠∠), corners in MATCHING order; the ratio line
   then carries "(uit |||)".

   Content shape: the same as ew1 (read by js/ewe.js), plus opt-in keys:
     build  { …, fixed?:[chip] }          a chip already in the first box
     pick   { …, half?:[a, b, c], options:[{ text, fill? }] }
            half = a ratio a/b = c/☐ shown above the options; an option
            with a `fill` is drawn as the finished fraction c over its
            4th chip. js/ewe.js draws both with the one fraction drawer,
            so this file stays plain data (node imports it).
     write  { sim, simReason, fill?, reason, tip }   the two-line card
   ============================================================ */
import { cutTriangle } from "../ewe-core.js";

const SIM_REASON = "∠∠∠";          // her (LLL)
const RATIO_REASON = "uit |||";

/* the two triangles in MATCHING corner order: corner, first cut / first
   end, second cut / second end (her letter-order rule) */
const simName = tri => {
  const A = tri.corner, [B, C] = tri.ends, [D, E] = tri.cuts;
  return `Δ ${A}${D}${E} ||| Δ ${A}${B}${C}`;
};

const CLICK = "Klik op 'n stuk om dit in die blokkie te sit wat gloei.";

/* The reason step. The right one is her "uit |||"; the other three are
   real reasons that do not fit here, one idea per hint. */
function reasonStep(tri) {
  const n = tri.names, [D, E] = tri.cuts;
  const par = `${n.DE} ∥ ${n.BC}`;
  return {
    type: "pick",
    prompt: "Watter rede skryf jy langs hierdie lyn?",
    options: [
      { text: RATIO_REASON, correct: true },
      { text: `lyn ∥ een sy v. Δ, ${par}`,
        hint: "Daardie rede is vir die stukke van die twee sye, soos laas rondte. Hier is die ∥ lyne self in die verhouding." },
      { text: "lyn verdeel sye v. Δ in verh.",
        hint: `Dit is die omgekeerde stelling. Dit bewys dat 'n lyn ∥ is. Hier gee die vraag reeds ${par}.` },
      { text: "middelpuntstelling",
        hint: `Die middelpuntstelling werk net as ${D} en ${E} die middelpunte is. Hier weet ons dit nie.` },
    ],
    okLine: `Die verhouding kom uit die gelykvormige Δe: ${simName(tri)}.`,
  };
}

/* The build step. Eight chips: the three sides of the small Δ, the three
   sides of the whole Δ, and the two bottom pieces (the trap).
   fixed     a chip already in the first box (Q1, Q2), or null
   answer    the one right fill "Wys my" shows; it starts with `fixed`
   template  the pattern hint's two words, top and bottom */
function buildStep(tri, prompt, { fixed = null, answer, template }) {
  const n = tri.names;
  return {
    type: "build",
    prompt,
    chips: [n.AD, n.AE, n.DE, n.AB, n.AC, n.BC, n.DB, n.EC],
    ...(fixed ? { fixed: [fixed] } : {}),
    spec: { seg: tri.seg, mode: "similar", needPar: true },
    answer,
    hints: {
      bottom: `${n.DB} en ${n.EC} is die onderste stukke. Met 'n ∥ lyn in die verhouding gebruik jy die hele sy, nooit die onderste stuk nie.`,
      nopar: `Dit is waar, maar hierdie rondte wil die ∥ lyne ${n.DE} en ${n.BC} in die verhouding hê.`,
      repeat: "Elke blokkie kry 'n ander stuk. Jy het een stuk meer as een keer gebruik.",
      pattern: {
        text: "Lees albei kante van die = op dieselfde manier. Bo en onder staan twee sye wat by mekaar pas:",
        template,
      },
    },
  };
}

/* the small Δ and the whole Δ, as words for the pattern hint */
const small = tri => `sy van Δ ${tri.corner}${tri.cuts.join("")}`;
const whole = tri => `sy van Δ ${tri.corner}${tri.ends.join("")}`;

/* ---------------- the six sketches ----------------
   Coordinates are screen units (y down); js/ewe-kit.js fits them to the
   canvas. t is the cut's distance from the corner, as a fraction. Fresh
   letter sets: none is one of ew1's. */
/* Q1: her own sketch. Δ FGH, F on top, J on FG, K on FH, JK ∥ GH */
const T1 = cutTriangle({ corner: "F", ends: ["G", "H"], cuts: ["J", "K"], t: 0.42,
  xy: { F: { x: 150, y: 18 }, G: { x: 30, y: 200 }, H: { x: 290, y: 192 } } });
/* Q2: on its side, the corner R points RIGHT (ew1's pointed left) */
const T2 = cutTriangle({ corner: "R", ends: ["S", "T"], cuts: ["U", "V"], t: 0.4,
  xy: { R: { x: 300, y: 112 }, S: { x: 35, y: 22 }, T: { x: 55, y: 215 } } });
/* Q3: the ∥ line runs next to a DIFFERENT side: PQ ∥ LM cuts off the
   corner N, bottom right */
const T3 = cutTriangle({ corner: "N", ends: ["L", "M"], cuts: ["P", "Q"], t: 0.42,
  xy: { L: { x: 135, y: 20 }, M: { x: 22, y: 205 }, N: { x: 295, y: 188 } } });
/* Q4: no build. Δ BCD, C on top, EG ∥ BD */
const T4 = cutTriangle({ corner: "C", ends: ["B", "D"], cuts: ["E", "G"], t: 0.44,
  xy: { C: { x: 165, y: 18 }, B: { x: 32, y: 198 }, D: { x: 292, y: 186 } } });
/* Q5: upside down, the corner T at the BOTTOM */
const T5 = cutTriangle({ corner: "T", ends: ["D", "H"], cuts: ["M", "N"], t: 0.46,
  xy: { T: { x: 150, y: 215 }, D: { x: 25, y: 32 }, H: { x: 295, y: 42 } } });
/* Q6: another turn: the corner A bottom left, the triangle leaning over */
const T6 = cutTriangle({ corner: "A", ends: ["X", "Y"], cuts: ["W", "Z"], t: 0.41,
  xy: { A: { x: 28, y: 208 }, X: { x: 175, y: 20 }, Y: { x: 300, y: 158 } } });

const nm = tri => tri.names;

/* Q4's half-built ratio: small ∥ line over big ∥ line = corner piece over ☐ */
const q4 = (() => {
  const n = nm(T4);
  const opt = (den, extra) => ({ text: `${n.AD} oor ${den}`, fill: [n.DE, n.BC, n.AD, den], ...extra });
  return {
    type: "pick",
    prompt: "Wat kom in die leë blokkie?",
    half: [n.DE, n.BC, n.AD],
    options: [
      opt(n.AB, { correct: true }),
      opt(n.DB, { hint: `${n.DB} is net die onderste stuk. Met 'n ∥ lyn in die verhouding gebruik jy die hele sy.` }),
      opt(n.AC, { hint: `${n.AD} lê op die sy ${n.AB}. Bly op dieselfde sy.` }),
    ],
    okLine: `Die hele sy ${n.AB}: klein Δ oor groot Δ, aan albei kante.`,
  };
})();

export const round = {
  id: "ew2",
  kind: "ewe",
  accent: "#1f7ae0",
  title: { en: "Nou met die ∥ lyne", af: "Nou met die ∥ lyne" },
  blurb: { en: "Laas rondte was die ∥ lyne uit. Hierdie rondte is hulle in die verhouding.",
           af: "Laas rondte was die ∥ lyne uit. Hierdie rondte is hulle in die verhouding." },
  takeaway: {
    text: "Is 'n ∥ lyn in die verhouding, dan kom elke sy uit die klein Δ of die groot Δ. Gebruik die hele sy, nooit die onderste stuk nie.",
    sim: simName(T1), simReason: SIM_REASON,
    fill: [nm(T1).DE, nm(T1).AE, nm(T1).BC, nm(T1).AC],
    reason: RATIO_REASON,
  },
  eweQuestions: [
    {
      id: "ew2q1",
      intro: "Laas rondte was die ∥ lyne uit. Hierdie rondte is hulle in die verhouding. In Δ FGH is JK ∥ GH.",
      sketch: T1.sketch,
      steps: [
        buildStep(T1, `JK staan klaar in die eerste blokkie. Vul die ander drie in met sye van die klein Δ FJK en die groot Δ FGH. ${CLICK}`,
          { fixed: nm(T1).DE, answer: [nm(T1).DE, nm(T1).AE, nm(T1).BC, nm(T1).AC], template: [small(T1), whole(T1)] }),
        reasonStep(T1),
      ],
      write: { sim: simName(T1), simReason: SIM_REASON, reason: RATIO_REASON,
               tip: "Skryf eers die gelykvormige Δe, dan die verhouding." },
    },
    {
      id: "ew2q2",
      intro: "Hierdie keer lê die Δ op sy sy. In Δ RST is UV ∥ ST.",
      sketch: T2.sketch,
      steps: [
        buildStep(T2, `Die groot ∥ lyn ST staan klaar in die eerste blokkie. Vul die ander drie in. ${CLICK}`,
          { fixed: nm(T2).BC, answer: [nm(T2).BC, nm(T2).AC, nm(T2).DE, nm(T2).AE], template: [whole(T2), small(T2)] }),
        reasonStep(T2),
      ],
      write: { sim: simName(T2), simReason: SIM_REASON, reason: RATIO_REASON,
               tip: "Die Δ lê anders, maar elke sy is steeds 'n sy van die klein Δ of die groot Δ." },
    },
    {
      id: "ew2q3",
      intro: "In Δ LMN is PQ ∥ LM. Pasop: die lyn is ∥ aan 'n ander sy.",
      sketch: T3.sketch,
      steps: [
        buildStep(T3, `Die ∥ lyn sny 'n klein Δ af by N. Bou 'n verhouding met die ∥ lyne PQ en LM. ${CLICK}`,
          { answer: [nm(T3).DE, nm(T3).BC, nm(T3).AD, nm(T3).AB], template: [small(T3), whole(T3)] }),
        reasonStep(T3),
      ],
      write: { sim: simName(T3), simReason: SIM_REASON, reason: RATIO_REASON,
               tip: "Die klein Δ sit by die hoekpunt wat die ∥ lyn afsny." },
    },
    {
      id: "ew2q4",
      intro: "In Δ BCD is EG ∥ BD. Die verhouding is half klaar.",
      sketch: T4.sketch,
      steps: [q4],
      write: { sim: simName(T4), simReason: SIM_REASON, reason: RATIO_REASON,
               fill: [nm(T4).DE, nm(T4).BC, nm(T4).AD, nm(T4).AB],
               tip: "Met 'n ∥ lyn in die verhouding: die hele sy, nooit die onderste stuk nie." },
    },
    {
      id: "ew2q5",
      intro: "Die Δ staan onderstebo. In Δ DHT is MN ∥ DH.",
      sketch: T5.sketch,
      steps: [
        buildStep(T5, `Bou 'n verhouding met die ∥ lyne MN en DH. ${CLICK}`,
          { answer: [nm(T5).DE, nm(T5).BC, nm(T5).AD, nm(T5).AB], template: [small(T5), whole(T5)] }),
        reasonStep(T5),
      ],
      write: { sim: simName(T5), simReason: SIM_REASON, reason: RATIO_REASON,
               tip: "Onderstebo maak nie saak nie: die sye kom uit die klein Δ en die groot Δ." },
    },
    {
      id: "ew2q6",
      intro: "Die Δ leun oor. In Δ AXY is WZ ∥ XY.",
      sketch: T6.sketch,
      steps: [
        buildStep(T6, `Bou 'n verhouding met die ∥ lyne. ${CLICK}`,
          { answer: [nm(T6).DE, nm(T6).BC, nm(T6).AD, nm(T6).AB], template: [small(T6), whole(T6)] }),
        reasonStep(T6),
      ],
      write: { sim: simName(T6), simReason: SIM_REASON, reason: RATIO_REASON,
               tip: "Die onderste stukke bly uit. Gebruik die hele sye." },
    },
  ],
};

/* for tools/check-ewe-marker.mjs: the triangle behind each question, so
   the oracle can measure real lengths from the very coordinates drawn */
export const TRIANGLES = { ew2q1: T1, ew2q2: T2, ew2q3: T3, ew2q4: T4, ew2q5: T5, ew2q6: T6 };
