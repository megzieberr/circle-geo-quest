/* ============================================================
   ew1 · "Watter sye hoort saam?"   (Eweredigheid, group g9)
   ------------------------------------------------------------
   The first Gr12 Eweredigheid mini round (EWEREDIGHEID-PLAN.md,
   kept local). AFRIKAANS ONLY, whatever the language toggle says:
   every learner-facing string in this file is plain Afrikaans, not
   an {en, af} pair (tools/check-bilingual.mjs exempts kind "ewe" and
   says why). The two exceptions are `title` and `blurb`, which other
   screens read as objects: see the note on them below.

   Six short questions. Each one is a chain of steps and ends on the
   "Só skryf jy dit" card: the exact line that goes on the exam page,
   stacked fractions and the reason next to it.

   The sketches are TO SCALE: cutTriangle() computes the cut points
   from t, so the ∥ line really is ∥ (and Q5's line really is not).
   Every t below was checked by tools/check-ewe-marker.mjs for
   accidental equal lengths, which would let a wrong fill be "true".

   Content shape (read by js/ewe.js, NOT by the graded-round engine:
   the key is `eweQuestions`, never `questions`, so none of this can
   leak into the Daily Challenge or Fix-My-Mistakes):
     { id, intro, sketch, tri?, steps:[…], write:{ fill?|text, reason?, tip } }
   step kinds:
     build  { prompt, chips, spec, answer, hints:{ par, repeat, whole, pattern } }
     pick   { prompt, layout?, options:[{ text, correct?, hint? }], okLine }
   ============================================================ */
import { cutTriangle } from "../ewe-core.js";

/* Her reason wording, letter for letter (her notes: "lyn ∥ een sy v. Δ"
   and it ALWAYS names the ∥ pair). */
const reasonOf = tri => `lyn ∥ een sy v. Δ, ${tri.names.DE} ∥ ${tri.names.BC}`;

/* The three real reasons that do NOT fit here. One idea per hint. */
function reasonStep(tri) {
  const [D, E] = tri.cuts;
  const par = `${tri.names.DE} ∥ ${tri.names.BC}`;
  return {
    type: "pick",
    prompt: "Watter rede skryf jy langs hierdie lyn?",
    options: [
      { text: reasonOf(tri), correct: true },
      { text: "lyn verdeel sye v. Δ in verh.",
        hint: `Dit is die omgekeerde stelling. Dit bewys dat 'n lyn ∥ is. Hier gee die vraag reeds ${par}.` },
      { text: "middelpuntstelling",
        hint: `Die middelpuntstelling werk net as ${D} en ${E} die middelpunte is. Hier weet ons dit nie.` },
      { text: "∠∠∠",
        hint: "∠∠∠ bewys dat twee Δe gelykvormig is. Hier gebruik ons die ∥ lyn." },
    ],
    okLine: `Die rede noem altyd die ∥ lyne: ${par}.`,
  };
}

/* The build step for one sketch. `needWhole` = the prompt asked for the
   whole sides (Q4), so only forms that use them are accepted. */
function buildStep(tri, prompt, needWhole = false) {
  const n = tri.names, A = tri.corner;
  const chips = needWhole
    ? [n.AD, n.DB, n.AE, n.EC, n.AB, n.AC, n.DE, n.BC]
    : [n.AD, n.DB, n.AE, n.EC, n.DE, n.BC];
  return {
    type: "build",
    prompt,
    chips,
    spec: { seg: tri.seg, needWhole },
    /* the answer the "show me" rung fills in: her first line, letter form */
    answer: needWhole ? [n.AD, n.AB, n.AE, n.AC] : [n.AD, n.DB, n.AE, n.EC],
    hints: {
      par: `${n.DE} en ${n.BC} is die ∥ lyne self. Hulle hoort by gelykvormige Δe, met 'n ander rede. Gebruik net die stukke van ${n.AB} en ${n.AC}.`,
      repeat: "Elke blokkie kry 'n ander stuk. Jy het een stuk meer as een keer gebruik.",
      whole: `Die vraag gee die hele sye. Gebruik ${n.AB} en ${n.AC} in jou verhouding.`,
      /* the pattern hint carries a stacked-fraction TEMPLATE, in words, so it
         shows the shape of a right answer without giving its letters */
      pattern: {
        text: "Lees albei kante van die = op dieselfde manier:",
        template: needWhole ? [`stuk by ${A}`, "hele sy"] : [`stuk by ${A}`, "ander stuk"],
      },
    },
  };
}

/* ---------------- the six sketches ----------------
   Coordinates are screen units (y down); js/ewe-kit.js fits them to the
   canvas. t is the cut's distance from the corner, as a fraction. */
const T1 = cutTriangle({ corner: "A", ends: ["B", "C"], cuts: ["D", "E"], t: 0.42,
  xy: { A: { x: 150, y: 20 }, B: { x: 40, y: 200 }, C: { x: 285, y: 190 } } });
/* on its side: the corner P points LEFT, QR stands upright on the right */
const T2 = cutTriangle({ corner: "P", ends: ["Q", "R"], cuts: ["S", "T"], t: 0.45,
  xy: { P: { x: 20, y: 120 }, Q: { x: 255, y: 20 }, R: { x: 285, y: 215 } } });
/* the ∥ line runs next to a DIFFERENT side: NP ∥ KM cuts off corner L,
   bottom left, not the top corner the learner has seen twice */
const T3 = cutTriangle({ corner: "L", ends: ["K", "M"], cuts: ["N", "P"], t: 0.4,
  xy: { K: { x: 125, y: 20 }, L: { x: 20, y: 200 }, M: { x: 290, y: 185 } } });
/* Q1's shape again, new letters: the whole sides are the point here */
const T4 = cutTriangle({ corner: "F", ends: ["G", "H"], cuts: ["J", "K"], t: 0.38,
  xy: { F: { x: 170, y: 15 }, G: { x: 25, y: 190 }, H: { x: 300, y: 205 } } });
/* a line across, NOT parallel (t2 differs) and so NO ∥ arrows */
const T5 = cutTriangle({ corner: "D", ends: ["E", "F"], cuts: ["G", "H"], t: 0.36, t2: 0.6,
  xy: { D: { x: 150, y: 20 }, E: { x: 30, y: 200 }, F: { x: 290, y: 195 } } });
/* upside down: the corner X at the BOTTOM */
const T6 = cutTriangle({ corner: "X", ends: ["Y", "Z"], cuts: ["W", "V"], t: 0.43,
  xy: { X: { x: 160, y: 215 }, Y: { x: 20, y: 30 }, Z: { x: 300, y: 45 } } });

const CLICK = "Klik op 'n stuk om dit in die blokkie te sit wat gloei.";

export const round = {
  id: "ew1",
  kind: "ewe",
  accent: "#0ea271",
  /* Afrikaans in BOTH slots, on purpose. Afrikaans is the only language of
     these rounds (her ruling), so tx() must never fall back to anything else,
     and the teacher dashboard reads `title.en` directly (js/admin.js) and
     would print "undefined" for a plain string. This is the same Afrikaans
     title twice, not an English twin. */
  title: { en: "Watter sye hoort saam?", af: "Watter sye hoort saam?" },
  blurb: { en: "'n Lyn ∥ aan een sy van 'n Δ. Bou die verhouding en kies die rede.",
           af: "'n Lyn ∥ aan een sy van 'n Δ. Bou die verhouding en kies die rede." },
  /* the round's one takeaway, for the end screen */
  takeaway: {
    text: "'n Lyn ∥ aan een sy van 'n Δ verdeel die ander twee sye in dieselfde verhouding.",
    fill: [T1.names.AD, T1.names.DB, T1.names.AE, T1.names.EC],
    reason: reasonOf(T1),
  },
  eweQuestions: [
    {
      id: "ew1q1",
      intro: "In Δ ABC is DE ∥ BC.",
      sketch: T1.sketch,
      steps: [buildStep(T1, `Bou die verhouding. ${CLICK}`), reasonStep(T1)],
      write: { reason: reasonOf(T1), tip: "Skryf eers die letters. Getalle kom later." },
    },
    {
      id: "ew1q2",
      intro: "Hierdie keer lê die Δ op sy sy. In Δ PQR is ST ∥ QR.",
      sketch: T2.sketch,
      steps: [buildStep(T2, `Bou die verhouding. ${CLICK}`), reasonStep(T2)],
      write: { reason: reasonOf(T2), tip: "Die Δ lê anders, maar jy skryf dieselfde soort lyn." },
    },
    {
      id: "ew1q3",
      intro: "In Δ KLM is NP ∥ KM. Pasop: die lyn is ∥ aan 'n ander sy.",
      sketch: T3.sketch,
      steps: [buildStep(T3, `Die ∥ lyn sny 'n klein Δ af. Begin by die hoekpunt van daardie klein Δ. ${CLICK}`), reasonStep(T3)],
      write: { reason: reasonOf(T3), tip: "Begin altyd by die hoekpunt van die klein Δ." },
    },
    {
      id: "ew1q4",
      intro: "In Δ FGH is JK ∥ GH. Die vraag gee die hele sye FG en FH.",
      sketch: T4.sketch,
      steps: [buildStep(T4, `Bou 'n verhouding wat die hele sye FG en FH gebruik. ${CLICK}`, true)],
      write: { reason: reasonOf(T4), tip: "Met die hele sye: stuk oor hele sy, aan albei kante." },
    },
    {
      id: "ew1q5",
      intro: "In Δ DEF sny die lyn GH twee sye.",
      sketch: T5.sketch,
      steps: [{
        type: "pick",
        layout: "yesno",
        prompt: "Mag jy die eweredigheidstelling hier gebruik?",
        options: [
          { text: "Ja", hint: "Kyk na die lyne. Daar is geen ∥ pyltjies nie, en die vraag sê nie GH ∥ EF nie." },
          { text: "Nee", correct: true },
        ],
        okLine: "Nee. Niks sê dat GH ∥ EF nie.",
      }],
      write: { text: "Hier skryf jy niks nie. Die stelling werk net as jy weet dat GH ∥ EF.",
               tip: "Eers ∥, dan eweredigheid." },
    },
    {
      id: "ew1q6",
      intro: "Die Δ staan onderstebo. In Δ XYZ is WV ∥ YZ.",
      sketch: T6.sketch,
      steps: [buildStep(T6, `Bou die verhouding. Begin by die hoekpunt van die klein Δ. ${CLICK}`), reasonStep(T6)],
      write: { reason: reasonOf(T6), tip: "Onderstebo maak nie saak nie: begin by die hoekpunt van die klein Δ." },
    },
  ],
};

/* for tools/check-ewe-marker.mjs: the triangle behind each build step, so
   the oracle can measure real lengths from the very coordinates drawn */
export const TRIANGLES = { ew1q1: T1, ew1q2: T2, ew1q3: T3, ew1q4: T4, ew1q5: T5, ew1q6: T6 };
