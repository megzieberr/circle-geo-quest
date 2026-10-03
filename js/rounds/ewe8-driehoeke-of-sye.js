/* ============================================================
   ew8 · "Driehoeke of sye?"   (Eweredigheid, group g9)
   ------------------------------------------------------------
   The Gr12 Eweredigheid round after "Vreemde formaat" (EWEREDIGHEID-
   PLAN.md, kept local). AFRIKAANS ONLY, exactly like ew1 to ew7: every
   learner-facing string is plain Afrikaans; `title` and `blurb` carry
   the same Afrikaans twice (see the note in ewe1-watter-sye.js).

   Vreemde formaat ended on two fractions. Before the learner NAMES the
   two triangles (the next round), they must SEE what kind of statement
   the fractions are. The fractions are already built; one tap per
   question: "gelykvormige driehoeke" or "sye in verhouding".

   Her rule, from her notes page with the four coloured sketches:
     a ∥ line in the fractions (DE or BC)      two similar triangles
     a PIECE of a side in them (DB or EC)      sides in ratio
   The form that is true BOTH ways (AD/AB = AE/AC alone) is never a
   question (her ruling 1), and there is no right-angle figure in this
   round (her ruling 2).

   The rule is said on the cards and the end screen, never before the
   first tap of Q1 and Q2 (her no-spoilers habit: they look first). From
   Q3 on, a wrong tap shows the matching half of the rule after its hint.

   One question, one step and the card:
     pick   the fractions as a GIVEN line above the prompt (coloured as
            in her notes: every top in colour 1, every bottom in colour 2),
            "Wat sê hierdie breuke?", two wide buttons side by side
            (layout "pair": her order, never shuffled). The sketch LIGHTS
            UP from the start: an arc over every side named in the
            fractions, in the colour of its place. After the right tap
            (sketchAfter, as in ew5) TRIANGLES: the big Δ tinted, the small
            Δ tinted on top; SIDES: the two cut sides drawn thick. The
            arcs stay.
     card   TRIANGLES: ew2's card, Δ ADE ||| Δ ABC (∠∠∠), then the
            fractions with (uit |||). SIDES: ew1's card, the fractions with
            (lyn ∥ een sy v. Δ, DE ∥ BC). Then the half of the rule that
            applies (the tip). Each with the question's own letters.

   The sketch is cutTriangle with DE ∥ BC, ∥ arrows, to scale. Her arcs
   (js/ewe-kit.js sideArcs, opt-in keys this round adds): `tone` 1 or 2
   (top or bottom colour, no label), a whole side at level 2 nested
   OUTSIDE the piece arc it shares a point with (spec.arcNest), and an arc
   over a ∥ line bulging AWAY from the other ∥ line (`away`). Every point
   label is kept outside the whole Δ (`outside`), so never inside a tint,
   with a little extra room at the canvas edge (`edge`) and from the lines
   and arcs (`labGap`). After "sye in verhouding" the cut sides are drawn
   thick (`thick`).

   tools/check-ewe-marker.mjs reads FIGS (the coordinates, the drawn lines
   and the shown fractions), decides the kind of every question from the
   figure alone, and proves every shown equality true in its figure.

   Content shape: the same as ew5 (read by js/ewe.js), plus the opt-in
   keys this round adds:
     pick   { …, layout: "pair" }    two wide buttons side by side, in
                                     their own order (never shuffled)
            given.line fractions { n, d, tone: [1, 2] }   coloured top and
                                     bottom (the one drawer's colour key)
     write  { sim?, simReason?, fracs: [[top, bottom], …], reason, tip }
                                     the card with any number of fractions
     takeaway { text, cards: [ write-like, … ] }   the end screen's lines
   ============================================================ */
import { cutTriangle } from "../ewe-core.js";

const NB = " ";
/* Strings the player shows WITHOUT its no-break glue (hints, okLines, the
   card's tip, the end screen) carry their own: "DE ∥ BC", "Δ ADE" and
   "Δ ADE ||| Δ ABC" never break over two lines. */
const nb = s => s.replace(/(\S) ∥ (\S)/g, `$1${NB}∥${NB}$2`).replace(/Δ (\S)/g, `Δ${NB}$1`).replace(/ \|\|\| /g, `${NB}|||${NB}`);
/* Foreman review 2026-10-03, as in ew6 (commit 3bb1065): the last two words
   of every hint, ✓ line, intro, tip and the takeaway are glued, so
   "verhouding." or "driehoeke." never sits alone on the last line */
const tail = s => s.replace(/ (\S+)$/, `${NB}$1`);

/* her two button words, exactly, in her order */
const TRI = "gelykvormige driehoeke", SIDES = "sye in verhouding";

/* the two halves of her rule, with a question's own letters */
const ruleTri = n => `Staan daar 'n ∥ lyn in die breuke (soos ${n.DE} of ${n.BC})? Dan is dit twee gelykvormige driehoeke.`;
const ruleSides = n => `Staan daar 'n STUK van 'n sy (soos ${n.DB} of ${n.EC})? Dan is dit sye in verhouding.`;

const RATIO_REASON = "uit |||";
/* Foreman review 2026-10-03, her arcs as a teacher's hand-drawn bows:
   PAR_SAG  the sag (sketch units) of an arc over a ∥ line, a clear bow well
            outside the line's ∥ arrow (the arrow reaches 5 from the line)
   NEST     a whole side's arc over its piece's arc: the corner zone around
            the shared point grows to `end` of the piece's chord, and outside
            it the two arcs keep `gap` apart; the whole side then gets the
            smallest bow that does that (js/ewe-kit.js nestH) */
const PAR_SAG = 12, NEST = { end: 0.4, gap: 4.5, lab: 4.5 };
/* after "sye in verhouding" the cut sides are drawn thick (5 wide), so in
   those questions the cut point's label also keeps LINE_CLEAR from its side */
const LINE_CLEAR = 4.5;
const SIM_REASON = "∠∠∠";
/* ew1's reason, letter for letter */
const parReason = n => `lyn ∥ een sy v. Δ, ${n.DE} ∥ ${n.BC}`;
/* ew2's similarity line, corners in matching order. Foreman review
   2026-10-03: the first-named Δ is the one whose sides are the TOPS of the
   fractions (small over big: the small Δ first; big over small, Q5: the
   big Δ first) */
const simName = (T, bigTop) => {
  const small = `Δ ${T.corner}${T.cuts.join("")}`, big = `Δ ${T.corner}${T.ends.join("")}`;
  return bigTop ? `${big} ||| ${small}` : `${small} ||| ${big}`;
};

/* one question.
   fracs   the shown fractions in cutTriangle's position names, top first:
           [["AD", "DB"], ["AE", "EC"]] reads AD/DB = AE/EC
   kind    the answer the author means: "driehoeke" | "sye" (the checker
           decides it again from the figure alone and compares) */
function q8(id, { corner, ends, cuts, xy, t, fracs, kind, intro, rule, labOut }) {
  const T = cutTriangle({ corner, ends, cuts, xy, t });
  const n = T.names;
  const A = corner, [B, C] = ends, [D, E] = cuts;
  const pairs = fracs.map(([a, b]) => [n[a], n[b]]);

  /* her arcs: one over every side named, in the colour of its place. A
     whole side is level 2 (nested outside its piece); a ∥ line bulges away
     from the other ∥ line. No labels. */
  const away = { DE: [B, C], BC: [D, E] };
  const ends2 = { AD: [A, D], DB: [D, B], AB: [A, B], AE: [A, E], EC: [E, C], AC: [A, C], DE: [D, E], BC: [B, C] };
  const arcs = [];
  fracs.forEach(([a, b]) => [[a, 1], [b, 2]].forEach(([p, tone]) => {
    const [from, to] = ends2[p];
    arcs.push({ from, to, tone, level: p === "AB" || p === "AC" ? 2 : 1, ...(away[p] ? { away: away[p], sag: PAR_SAG } : {}) });
  }));
  /* edge and labGap: a little more room at the canvas edge and between a
     point label and the lines and arcs, so a corner crowded by her arcs
     (L in Q7) still has its label outside the Δ, clear of a side drawn
     thick after the tap. labOut (foreman review 2026-10-03): one point's
     label a little further out, for a label in the notch where two arcs
     meet (Q in Q6) */
  const sketch = { ...T.sketch, outside: [A, B, C], labBox: true, sideArcs: arcs, arcNest: kind === "driehoeke" ? NEST : { ...NEST, line: LINE_CLEAR }, edge: 8, labGap: 3, ...(labOut ? { labOut } : {}) };
  const tri = kind === "driehoeke";
  const after = tri
    ? { ...sketch, tints: [{ pts: [A, B, C], tint: 2 }, { pts: [A, D, E], tint: 1 }] }
    : { ...sketch, thick: [[A, B], [A, C]] };

  /* the wrong-tap hints, in her words with this question's letters; from
     Q3 on (rule: true) the matching half of the rule follows and carries
     the conclusion, so the hint's own last sentence goes (foreman review
     2026-10-03: it said the answer twice) */
  const hintSides = tail(nb(`${n.DB} en ${n.EC} is STUKKE van die sye. Hulle is nie sye van 'n Δ nie, en daar is geen ∥ lyn in die breuke nie.`
    /* foreman 2026-10-03: "'n STUK" glued, so "'n" never ends a line (Q3, Q6, Q8) */
    + (rule ? " " + ruleSides(n).replace("'n STUK", `'n${NB}STUK`) : " Dit is sye in verhouding.")));
  const hintTri = tail(nb(`${n.DE} en ${n.BC} is die ∥ lyne. Hulle lê nie op een sy nie: ${n.DE} is 'n sy van die klein Δ, ${n.BC} van die groot Δ.`
    + (rule ? " " + ruleTri(n) : " Dit is twee gelykvormige driehoeke.")));
  /* the tops of the fractions are sides of the big Δ (Q5) or the small one */
  const bigTop = /[BC]/.test(fracs[0][0]);

  return {
    id, intro: tail(nb(intro)), sketch,
    steps: [{
      type: "pick",
      layout: "pair",
      prompt: "Wat sê hierdie breuke?",
      given: { first: true, line: pairs.flatMap(([a, b], i) => [...(i ? ["="] : []), { n: [a], d: [b], tone: [1, 2] }]) },
      options: [
        { text: TRI, ...(tri ? { correct: true } : { hint: hintSides }) },
        { text: SIDES, ...(tri ? { hint: hintTri } : { correct: true }) },
      ],
      okLine: tail(nb(tri ? `Die ∥ lyne ${n.DE} en ${n.BC} staan in die breuke: twee gelykvormige driehoeke.`
                          : `${n.DB} en ${n.EC} is stukke van die sye: sye in verhouding.`)),
      sketchAfter: after,
    }],
    write: tri
      ? { sim: simName(T, bigTop), simReason: SIM_REASON, fracs: pairs, reason: RATIO_REASON, tip: tail(nb(ruleTri(n))) }
      : { fracs: pairs, reason: parReason(n), tip: tail(nb(ruleSides(n))) },
    /* for the tools: the answer the author means, the figure by its
       corners, the ∥ lines and the bottom pieces by name, and the sketch
       after the right tap */
    kind,
    tri: { big: [A, B, C], small: [A, D, E], par: [n.DE, n.BC], bottom: [n.DB, n.EC], cutSides: [n.AB, n.AC], rule: !!rule },
    sketches: { after },
    /* for the checker: the figure (coordinates, drawn lines) and the shown
       fractions by their letters, nothing else */
    fig: { pts: T.pts, lines: T.sketch.lines, fracs: pairs },
  };
}

/* ---------------- the eight questions ----------------
   Coordinates are screen units (y down) of the three corners; cutTriangle
   computes the cut points from t; js/ewe-kit.js fits them to the canvas.
   The order is fixed and is not a pattern: S, T, S, T, T, S, T, S. */
/* Q1: her figure, A on top */
const FIG1 = { corner: "A", ends: ["B", "C"], cuts: ["D", "E"], t: 0.45,
  xy: { A: { x: 150, y: 20 }, B: { x: 35, y: 205 }, C: { x: 292, y: 198 } } };
const Q1 = q8("ew8q1", { ...FIG1, fracs: [["AD", "DB"], ["AE", "EC"]], kind: "sye",
  intro: "Die breuke is klaar gebou. In Δ ABC lê D op AB en E op AC, met DE ∥ BC." });
/* Q2: the same figure, so only the fractions differ from Q1 */
const Q2 = q8("ew8q2", { ...FIG1, fracs: [["AD", "AB"], ["AE", "AC"], ["DE", "BC"]], kind: "driehoeke",
  intro: "Dieselfde Δ ABC, met DE ∥ BC. Net die breuke is anders." });
/* Q3: on its side, the corner P points left; whole over piece */
const Q3 = q8("ew8q3", { corner: "P", ends: ["Q", "R"], cuts: ["S", "T"], t: 0.52,
  xy: { P: { x: 20, y: 110 }, Q: { x: 285, y: 18 }, R: { x: 300, y: 212 } },
  fracs: [["AB", "DB"], ["AC", "EC"]], kind: "sye", rule: true,
  intro: "Die Δ lê op sy sy. In Δ PQR lê S op PQ en T op PR, met ST ∥ QR." });
/* Q4: Δ FGH, F on top (her ew2 example's kind) */
const Q4 = q8("ew8q4", { corner: "F", ends: ["G", "H"], cuts: ["J", "K"], t: 0.4,
  xy: { F: { x: 165, y: 18 }, G: { x: 28, y: 200 }, H: { x: 295, y: 190 } },
  fracs: [["DE", "BC"], ["AD", "AB"]], kind: "driehoeke", rule: true,
  intro: "In Δ FGH lê J op FG en K op FH, met JK ∥ GH." });
/* Q5: upside down, the corner T at the bottom; big over small */
const Q5 = q8("ew8q5", { corner: "T", ends: ["U", "V"], cuts: ["W", "X"], t: 0.47,
  xy: { T: { x: 155, y: 215 }, U: { x: 22, y: 35 }, V: { x: 298, y: 28 } },
  fracs: [["BC", "DE"], ["AC", "AE"]], kind: "driehoeke", rule: true,
  intro: "Die Δ staan onderstebo. In Δ TUV lê W op TU en X op TV, met WX ∥ UV." });
/* Q6: the corner K bottom left; piece over piece, the bottom piece on top.
   Q's label sits in the notch where the KQ and QM arcs meet: 3 further out */
const Q6 = q8("ew8q6", { corner: "K", ends: ["L", "M"], cuts: ["N", "Q"], t: 0.43,
  xy: { K: { x: 22, y: 210 }, L: { x: 160, y: 18 }, M: { x: 300, y: 165 } },
  fracs: [["DB", "AD"], ["EC", "AE"]], kind: "sye", rule: true, labOut: { Q: 3 },
  intro: "Nou staan K links onder. In Δ KLM lê N op KL en Q op KM, met NQ ∥ LM." });
/* Q7: ew1 Q3's figure, the ∥ line next to a DIFFERENT side */
const Q7 = q8("ew8q7", { corner: "L", ends: ["K", "M"], cuts: ["N", "P"], t: 0.4,
  xy: { K: { x: 125, y: 20 }, L: { x: 20, y: 200 }, M: { x: 290, y: 185 } },
  fracs: [["DE", "BC"], ["AD", "AB"]], kind: "driehoeke", rule: true,
  intro: "In Δ KLM lê N op LK en P op LM, met NP ∥ KM. Pasop: die lyn is ∥ aan 'n ander sy." });
/* Q8: turned, the corner E points right; piece over whole */
const Q8 = q8("ew8q8", { corner: "E", ends: ["F", "G"], cuts: ["H", "J"], t: 0.45,
  xy: { E: { x: 302, y: 125 }, F: { x: 28, y: 22 }, G: { x: 55, y: 215 } },
  fracs: [["DB", "AB"], ["EC", "AC"]], kind: "sye", rule: true,
  intro: "Die Δ is gedraai: E wys na regs. In Δ EFG lê H op EF en J op EG, met HJ ∥ FG." });

const QS = [Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8];

export const round = {
  id: "ew8",
  kind: "ewe",
  accent: "#5c940d",
  title: { en: "Driehoeke of sye?", af: "Driehoeke of sye?" },
  blurb: { en: "Die breuke is klaar gebou. Kyk waar die sye in die skets lê: is dit twee driehoeke, of sye in verhouding?",
           af: "Die breuke is klaar gebou. Kyk waar die sye in die skets lê: is dit twee driehoeke, of sye in verhouding?" },
  /* the whole rule, as in her notes (Q1's letters), with Q2's and Q1's cards */
  takeaway: {
    text: tail(nb("Staan daar 'n ∥ lyn in die breuke (soos DE of BC)? Dan is dit twee gelykvormige driehoeke. Staan daar 'n STUK van 'n sy (soos DB of EC)? Dan is dit sye in verhouding.")),
    cards: [Q2.write, Q1.write],
  },
  eweQuestions: QS,
};

/* for tools/check-ewe-marker.mjs: the figure behind each question (its
   coordinates, its drawn lines and the fractions it shows), never its answer */
export const FIGS = Object.fromEntries(QS.map(q => [q.id, q.fig]));
