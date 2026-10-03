/* ============================================================
   ew6 · "Die trapesium"   (Eweredigheid, group g9)
   ------------------------------------------------------------
   The Gr12 Eweredigheid round after "Watter een is dit?" (EWEREDIGHEID-
   PLAN.md, kept local). AFRIKAANS ONLY, exactly like ew1 to ew5: every
   learner-facing string is plain Afrikaans; `title` and `blurb` carry
   the same Afrikaans twice (see the note in ewe1-watter-sye.js).

   Her worked page (Michaela's W1S4 Vraag 3): D on AB, E on AC, DE ∥ BC,
   AD : DB = 3 : 2. Then AD/AB = 3/5, the area ratio with ½ · a · b · sin
   and the shared angle (ew4's line) with the numbers in, 9/25, and the
   one new step: the trapezium DBCE is the big Δ minus the small Δ, in k's,
   25k − 9k = 16k. She never uses a (scale)² shortcut, and neither does
   this round: she "trek af".

   A full question (Q1, Q2, Q4, Q5) is five steps and the card:
     1  build  AD/AB = ☐/☐                 the whole side from its pieces
     2  build  = ☐ · ☐ / ☐ · ☐             under ew4's line, the numbers in
     3  pick   how do you get the trapezium? (the tints appear)
     4  build  Opp DBCE = ☐k − ☐k = ☐k     the subtraction, the main act
     5  build  the ratio the question asks = ☐/☐
     card      her page: the 3/5 line, ew4's chain to 9/25, her part (c)
   A question with the area ratio GIVEN (Q3, Q6) starts at step 3, the
   given line above it, and its card is part (c) only.

   Every build step is a fill of numbers with ONE right order (js/ewe-core.js
   markExact, spec.mode "exact"); the wrong reasons are named here, per
   step, by rules (`why`) and each has its own hint.

   The sketch is cutTriangle with t = t2 (DE ∥ BC, the ∥ arrows on both), t
   the exact fraction of the question (3/5 for Q1), to scale from the
   coordinates. Her arcs along ONE side (js/ewe-kit.js sideArcs), outside
   the Δ: the pieces from the start (3k, 2k), the whole side (5k) once step
   1 is right (sketchAfter; it keeps its place while hidden, so no label
   moves). A piece of ONE part is labelled "k", never "1k". After step 3
   the trapezium gets tint 2 and the small Δ tint 1. Every label is kept
   outside the whole Δ (`outside`), so it is never inside a tint.
   tools/check-ewe-marker.mjs measures the areas (shoelace) from these very
   coordinates and proves every fill of every build step.

   Content shape: the same as ew4 (read by js/ewe.js), plus the opt-in
   keys this round adds:
     build  spec { mode: "exact", expect, chips, why }   markExact
            hints { piece, flipped, mixed, sum, order, again, pattern }
            okLine  a string, or (step 1) an ARRAY with stacked fractions
                    { n:[cells], d:[cells] } in the sentence
            role    "side" | "prod" | "sub" | "ask", for the tools only
     build / pick  given { line, text, first }   a given line drawn above
                    the frame or the options (first: above the prompt)
     pick   options [{ …, is }]   what the option says, for the tools only
     write  { trap, tip }   her page (js/ewe-kit.js trapLineHtml)
     question  given, ask    the question's statement, for the tools
   ============================================================ */
import { cutTriangle, hat, SLOT } from "../ewe-core.js";

const NB = " ";
/* Strings the player shows WITHOUT its no-break glue (hints, okLines,
   options, the card's tip, the end screen) carry their own: "Opp Δ ABC",
   "Opp DBCE", a product "AD · AE", "sin Â", a ratio "3 : 2", "25k − 9k",
   a sum "3 + 2 = 5", "DE ∥ BC" and a short "= 5" never break over two
   lines. */
const nb = s => s.replace(/Opp Δ /g, `Opp${NB}Δ${NB}`).replace(/Opp /g, `Opp${NB}`).replace(/Δ /g, `Δ${NB}`)
  .replace(/ · /g, `${NB}·${NB}`).replace(/\bsin /g, `sin${NB}`).replace(/ : /g, `${NB}:${NB}`)
  .replace(/ − /g, `${NB}−${NB}`).replace(/ \+ /g, `${NB}+${NB}`).replace(/ = /g, `${NB}=${NB}`).replace(/(\S) ∥ (\S)/g, `$1${NB}∥${NB}$2`);
/* foreman review 2026-10-03: a takeaway or tip line never ends on one short
   word alone ("k's." on a line of its own): its last two words are glued */
const tail = s => s.replace(/ (\S+)$/, `${NB}$1`);

/* a piece of n parts on the sketch: "3k", and "k" for one part (never "1k") */
const kLabel = n => (n === 1 ? "k" : `${n}k`);
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const S = String;

const NAME = { small: "klein Δ", big: "groot Δ", trap: "trapesium" };
const cap = w => w[0].toUpperCase() + w.slice(1);
const TINT = { small: 1, trap: 2, big: 0 };

/* one question.
   given  { kind: "side", a, b }    AD : DB = a : b
          { kind: "whole", a, b }   AD : AB = a : b   (the whole side given)
          { kind: "area", small, big }   Opp small Δ over Opp big Δ given
   ask    the two parts the question asks, top first: "small" | "trap" | "big" */
function trapQ(id, { corner, ends, cuts, xy, given, ask, intro, askPrompt, tip }) {
  let top, whole;
  if (given.kind === "area") {
    top = Math.round(Math.sqrt(given.small)); whole = Math.round(Math.sqrt(given.big));
    if (top * top !== given.small || whole * whole !== given.big) throw new Error(`${id}: the given areas must be squares`);
  } else {
    top = given.a; whole = given.kind === "side" ? given.a + given.b : given.b;
  }
  const piece = whole - top, small = top * top, big = whole * whole, trap = big - small;
  if (small === 1 || trap === 1 || piece < 1) throw new Error(`${id}: never 1k as an area, and a real piece`);
  const T = cutTriangle({ corner, ends, cuts, xy, t: top / whole });
  const n = T.names;
  const A = corner, [B, C] = ends, [D, E] = cuts;
  const SMALL = A + D + E, BIG = A + B + C, TRAP = D + B + C + E;
  const W = { small: `Opp Δ ${SMALL}`, big: `Opp Δ ${BIG}`, trap: `Opp ${TRAP}` };
  const V = { small, big, trap };
  const full = given.kind !== "area";
  if (gcd(V[ask[0]], V[ask[1]]) !== 1) throw new Error(`${id}: the asked fraction must be in lowest terms`);

  /* the sketches: before step 1, after it (the whole-side arc), after step 3 (the tints) */
  const arcs = !full ? null : given.kind === "side"
    ? [{ from: A, to: D, label: kLabel(top), level: 1 }, { from: D, to: B, label: kLabel(piece), level: 1 },
       { from: A, to: B, label: kLabel(whole), level: 2, hidden: true }]
    : [{ from: A, to: D, label: kLabel(top), level: 1 }, { from: A, to: B, label: kLabel(whole), level: 2 }];
  const base = { ...T.sketch, outside: [A, B, C], labBox: true, ...(arcs ? { sideArcs: arcs } : {}) };
  const shown = arcs ? { ...base, sideArcs: arcs.map(a => ({ ...a, hidden: false })) } : base;
  const tinted = { ...shown, tints: [{ pts: [D, B, C, E], tint: 2 }, { pts: [A, D, E], tint: 1 }] };

  const steps = [];
  if (full) {
    /* 1 · the whole side from its pieces */
    const side = given.kind === "side";
    steps.push({
      type: "build", role: "side",
      prompt: nb(side ? `${n.AD} : ${n.DB} = ${top} : ${piece}. Skryf ${n.AD} oor die HELE sy ${n.AB}.`
                      : `${n.AD} : ${n.AB} = ${top} : ${whole}. Skryf ${n.AD} oor die HELE sy ${n.AB}.`),
      frame: [{ n: [n.AD], d: [n.AB] }, "=", { n: [SLOT], d: [SLOT] }],
      chips: side ? [S(top), S(piece), S(whole)] : [S(top), S(whole), S(top + whole)],
      spec: { mode: "exact", expect: [S(top), S(whole)], chips: side ? [S(top), S(piece), S(whole)] : [S(top), S(whole), S(top + whole)],
              why: side ? [{ why: "piece", has: [S(piece)] }, { why: "flipped", is: [S(whole), S(top)] }]
                        : [{ why: "sum", has: [S(top + whole)] }, { why: "flipped", is: [S(whole), S(top)] }] },
      answer: [S(top), S(whole)],
      hints: side ? {
        piece: nb(`${piece} is ${n.DB}, die onderste stuk. ${n.AB} is die hele sy: ${top} + ${piece} = ${whole}.`),
        flipped: `${n.AD} staan bo, dus kom ${n.AD} se getal bo.`,
        pattern: nb(`${n.AD} is ${top} dele, en die hele sy ${n.AB} is ${top} + ${piece} = ${whole} dele.`),
      } : {
        sum: `${n.AB} is klaar die hele sy. Jy hoef nie by te tel nie.`,
        flipped: `${n.AD} staan bo, dus kom ${n.AD} se getal bo.`,
        pattern: nb(`${n.AD} is ${top} dele, en die hele sy ${n.AB} is ${whole} dele.`),
      },
      okLine: [nb(side ? `${n.AB} is ${top} + ${piece} = ${whole} dele. En omdat ${n.DE} ∥ ${n.BC}, is `
                       : `${n.AB} is klaar ${whole} dele. En omdat ${n.DE} ∥ ${n.BC}, is `),
               { n: [n.AE], d: [n.AC] }, " ook ", { n: [S(top)], d: [S(whole)] }, "."],
      ...(side ? { sketchAfter: shown } : {}),
    });
    /* 2 · ew4's line, the numbers in */
    const pieceHint = side ? `${piece} is ${n.DB}, die onderste stuk. ${n.AB} is die hele sy: ${top} + ${piece} = ${whole}.`
                           : `${piece} is ${n.DB}, die onderste stuk. ${n.AB} is die hele sy: ${whole}.`;
    const c2 = [S(top), S(piece), S(whole)];
    steps.push({
      type: "build", role: "prod",
      prompt: "Die lyn bo ken jy uit Deel 'n hoek. Sit nou elke sy se getal in.",
      given: { line: [{ n: [W.small], d: [W.big] }, "=", { n: [n.AD, "·", n.AE], d: [n.AB, "·", n.AC] }] },
      frame: ["=", { n: [SLOT, "·", SLOT], d: [SLOT, "·", SLOT] }],
      chips: c2,
      spec: { mode: "exact", expect: [S(top), S(top), S(whole), S(whole)], chips: c2,
              why: [{ why: "piece", has: [S(piece)] }, { why: "flipped", is: [S(whole), S(whole), S(top), S(top)] },
                    { why: "mixed", from: 0, to: 2, has: [S(top), S(whole)] }, { why: "mixed", from: 2, to: 4, has: [S(top), S(whole)] }] },
      answer: [S(top), S(top), S(whole), S(whole)],
      hints: {
        piece: nb(pieceHint),
        mixed: nb(`Bo staan ${n.AD} en ${n.AE}: albei is ${top} dele. Onder staan ${n.AB} en ${n.AC}: albei ${whole}.`),
        flipped: nb(`Δ ${SMALL} staan bo, dus kom sy sye bo.`),
        pattern: nb(`Bo kom ${n.AD} · ${n.AE}, onder ${n.AB} · ${n.AC}. Elke sy kry sy eie getal.`),
      },
      okLine: tail(nb(`${top} · ${top} = ${small} en ${whole} · ${whole} = ${big}. Die klein Δ is ${small} dele, die groot Δ is ${big} dele: ${small}k en ${big}k.`)),
    });
  }
  /* 3 · how do you get the trapezium? */
  steps.push({
    type: "pick",
    prompt: `Hoe kry jy die trapesium ${TRAP}?`,
    ...(full ? {} : { given: { first: true, line: [{ n: [W.small], d: [W.big] }, "=", { n: [S(small)], d: [S(big)] }],
                                text: `Dus: Δ ${SMALL} = ${small}k en Δ ${BIG} = ${big}k.` } }),
    options: [
      { text: nb(`${W.big} − ${W.small}`), correct: true, is: "big-small" },
      { text: nb(`${W.small} − ${W.big}`), is: "small-big",
        hint: nb("Die groot Δ kom eerste. Jy kan nie 'n groot stuk van 'n klein stuk aftrek nie.") },
      { text: nb(`${W.big} + ${W.small}`), is: "sum",
        hint: nb("Die klein Δ is DEEL van die groot Δ. Jy sny dit af, jy tel dit nie by nie.") },
      { text: nb(`½ · ${n.DB} · ${n.EC} · sin ${hat(A)}`), is: "formula",
        hint: nb(`${n.DB} en ${n.EC} kom nie by 'n hoek bymekaar nie. 'n Trapesium het nie een formule soos 'n Δ nie: trek af.`) },
    ],
    okLine: tail(nb("Groot Δ minus klein Δ. Wat oorbly, is die trapesium.")),
    sketchAfter: tinted,
  });
  /* 4 · the subtraction */
  const c4 = [S(big), S(small), S(trap), S(big + small)];
  steps.push({
    type: "build", role: "sub",
    prompt: "Skryf nou die trapesium in k's: groot Δ minus klein Δ.",
    frame: [[W.trap], "=", [SLOT, "k", "−", SLOT, "k"], "=", [SLOT, "k"]],
    chips: c4,
    spec: { mode: "exact", expect: [S(big), S(small), S(trap)], chips: c4,
            why: [{ why: "order", from: 0, to: 2, is: [S(small), S(big)] }, { why: "sum", from: 2, to: 3, is: [S(big + small)] }] },
    answer: [S(big), S(small), S(trap)],
    hints: {
      order: nb(`Die groot Δ kom eerste: ${big}k − ${small}k.`),
      sum: nb(`Jy trek af, jy tel nie bymekaar nie: ${big} − ${small}.`),
      pattern: nb(`Groot Δ is ${big}k, klein Δ is ${small}k. ${big}k − ${small}k = ?`),
    },
    okLine: tail(nb(`${big}k − ${small}k = ${trap}k. Die trapesium is ${trap} dele.`)),
  });
  /* 5 · the ratio the question asks */
  const [a0, a1] = ask;
  const c5 = [S(small), S(trap), S(big)];
  const again = a0 === "small" ? "klein Δ oor GROOT Δ" : a1 === "big" ? "KLEIN Δ oor groot Δ" : "klein Δ oor groot Δ";
  steps.push({
    type: "build", role: "ask",
    prompt: nb(askPrompt || `Die vraag vra ${W[a0]} oor ${W[a1]}.`),
    frame: [{ n: [W[a0]], d: [W[a1]] }, "=", { n: [SLOT], d: [SLOT] }],
    chips: c5,
    spec: { mode: "exact", expect: [S(V[a0]), S(V[a1])], chips: c5,
            why: [{ why: "again", is: [S(small), S(big)] }, { why: "flipped", is: [S(V[a1]), S(V[a0])] }] },
    answer: [S(V[a0]), S(V[a1])],
    hints: {
      again: nb(`Dit is ${again}. Die vraag vra die trapesium: ${trap}k.`),
      flipped: "Kyk wat bo staan in die vraag. Daardie een se getal kom bo.",
      pattern: nb(`Klein Δ is ${small}k, groot Δ is ${big}k en die trapesium ${trap}k. Kies die twee wat die vraag noem.`),
    },
    okLine: tail(nb(`${cap(NAME[a0])} ${V[a0]} dele, ${NAME[a1]} ${V[a1]} dele.`)),
  });

  const trapCard = {
    ...(full ? {
      side: { pairs: [[n.AE, n.AC], [n.AD, n.AB]], val: [S(top), S(whole)], reason: `lyn ∥ een sy v. Δ, ${n.DE} ∥ ${n.BC}` },
      sine: { small: SMALL, big: BIG, top: [n.AD, n.AE], bot: [n.AB, n.AC], sin: `sin ${hat(A)}`,
              nums: [[S(top), S(top)], [S(whole), S(whole)]], val: [S(small), S(big)], reason: "gemene hoekpunt" },
    } : {}),
    sub: { trap: TRAP, big: BIG, small: SMALL, k: [S(big), S(small), S(trap)] },
    ask: { n: { t: W[a0], tint: TINT[a0] }, d: { t: W[a1], tint: TINT[a1] }, val: [S(V[a0]), S(V[a1])] },
  };
  return {
    id, intro: nb(intro), sketch: base,
    /* the question's statement, for the tools (the oracle reads this and the
       coordinates, never the answers above) */
    given, ask,
    steps,
    write: { trap: trapCard, tip: tail(nb(tip)) },
    /* for the phone check: the sketch after step 1 and after step 3 */
    sketches: { shown, tinted },
    /* for the checker: the figure by its corners, and its coordinates */
    fig: { corner: A, ends: [B, C], cuts: [D, E], pts: T.pts, sketch: base },
  };
}

/* ---------------- the six questions ----------------
   Coordinates are screen units (y down) of the three corners; cutTriangle
   computes the cut points from t (the exact fraction); js/ewe-kit.js fits
   them to the canvas. Fresh letters each. */
const Q1 = trapQ("ew6q1", {
  /* her figure: A on top, BC flat */
  corner: "A", ends: ["B", "C"], cuts: ["D", "E"],
  xy: { A: { x: 150, y: 30 }, B: { x: 30, y: 200 }, C: { x: 305, y: 200 } },
  given: { kind: "side", a: 3, b: 2 }, ask: ["small", "trap"],
  intro: "DE ∥ BC sny 'n klein Δ bo af. Wat onder oorbly, is 'n trapesium. Die trapesium is die groot Δ minus die klein Δ. In Δ ABC lê D op AB en E op AC, met AD : DB = 3 : 2. Bepaal Opp Δ ADE oor Opp DBCE.",
  tip: "Trapesium = groot Δ − klein Δ. Skryf albei eers in k's.",
});
const Q2 = trapQ("ew6q2", {
  /* the corner P bottom left, Q up to the right, R bottom right */
  corner: "P", ends: ["Q", "R"], cuts: ["S", "T"],
  xy: { P: { x: 20, y: 200 }, Q: { x: 205, y: 25 }, R: { x: 305, y: 200 } },
  given: { kind: "side", a: 2, b: 1 }, ask: ["trap", "big"],
  intro: "Hierdie keer staan P links onder. S lê op PQ en T op PR, met ST ∥ QR en PS : SQ = 2 : 1. Bepaal Opp SQRT oor Opp Δ PQR.",
  tip: "Die trapesium kan bo of onder staan: lees wat die vraag vra.",
});
const Q3 = trapQ("ew6q3", {
  /* the Δ on its side: the corner U on the left */
  corner: "U", ends: ["V", "W"], cuts: ["X", "Y"],
  xy: { U: { x: 20, y: 125 }, V: { x: 300, y: 25 }, W: { x: 280, y: 220 } },
  given: { kind: "area", small: 9, big: 16 }, ask: ["trap", "small"],
  intro: "Die Δ lê op sy sy. X lê op UV en Y op UW, met XY ∥ VW. Hierdie keer is die verhouding van die twee Δe se oppervlaktes klaar gegee. Bepaal Opp XVWY oor Opp Δ UXY.",
  tip: "Is die oppervlaktes klaar gegee? Dan begin jy dadelik by die aftrekking.",
});
const Q4 = trapQ("ew6q4", {
  /* F on top; the WHOLE side FG is given */
  corner: "F", ends: ["G", "H"], cuts: ["J", "K"],
  xy: { F: { x: 175, y: 25 }, G: { x: 25, y: 200 }, H: { x: 305, y: 185 } },
  given: { kind: "whole", a: 2, b: 5 }, ask: ["trap", "big"],
  intro: "Hierdie keer kry jy die HELE sy. J lê op FG en K op FH, met JK ∥ GH en FJ : FG = 2 : 5. Bepaal Opp JGHK oor Opp Δ FGH.",
  tip: "Kry jy die hele sy, dan tel jy niks by nie.",
});
const Q5 = trapQ("ew6q5", {
  /* upside down: the corner K at the bottom */
  corner: "K", ends: ["L", "M"], cuts: ["N", "P"],
  xy: { K: { x: 160, y: 215 }, L: { x: 25, y: 30 }, M: { x: 300, y: 45 } },
  given: { kind: "side", a: 4, b: 1 }, ask: ["trap", "small"],
  intro: "Die Δ staan onderstebo: K is onder. N lê op KL en P op KM, met NP ∥ LM en KN : NL = 4 : 1. Bepaal Opp NLMP oor Opp Δ KNP.",
  tip: "Lees die lyn: hier is die trapesium die 9 en die klein Δ die 16.",
});
const Q6 = trapQ("ew6q6", {
  /* turned: the corner D points to the right */
  corner: "D", ends: ["E", "F"], cuts: ["G", "H"],
  xy: { D: { x: 305, y: 120 }, E: { x: 30, y: 25 }, F: { x: 60, y: 215 } },
  given: { kind: "area", small: 4, big: 9 }, ask: ["trap", "big"],
  askPrompt: "Watter breuk van die groot Δ is die trapesium?",
  intro: "Die Δ is gedraai: D wys na regs. G lê op DE en H op DF, met GH ∥ EF. Die verhouding van die twee Δe se oppervlaktes is klaar gegee. Watter breuk van die groot Δ is die trapesium GEFH?",
  tip: "'n Breuk van die groot Δ: die groot Δ kom onder.",
});

export const round = {
  id: "ew6",
  kind: "ewe",
  accent: "#862e9c",
  title: { en: "Die trapesium", af: "Die trapesium" },
  blurb: { en: tail(nb("Die trapesium is die groot Δ minus die klein Δ. Skryf albei in k's en trek af.")),
           af: tail(nb("Die trapesium is die groot Δ minus die klein Δ. Skryf albei in k's en trek af.")) },
  takeaway: {
    text: tail(nb("Trapesium = groot Δ − klein Δ. Skryf albei in k's, en trek af.")),
    /* Q1's part (c) */
    trap: { sub: Q1.write.trap.sub, ask: Q1.write.trap.ask },
  },
  eweQuestions: [Q1, Q2, Q3, Q4, Q5, Q6],
};

/* for tools/check-ewe-marker.mjs: the figure behind each question, so the
   oracle can measure real areas from the very coordinates drawn */
export const SKETCHES = Object.fromEntries(round.eweQuestions.map(q => [q.id, q.fig]));
