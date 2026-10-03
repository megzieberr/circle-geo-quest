/* ============================================================
   ew9 · "Lees dit af"   (Eweredigheid, group g9)
   ------------------------------------------------------------
   The Gr12 Eweredigheid round after "Driehoeke of sye?" (EWEREDIGHEID-
   PLAN.md, kept local). AFRIKAANS ONLY, exactly like ew1 to ew8: every
   learner-facing string is plain Afrikaans; `title` and `blurb` carry
   the same Afrikaans twice (see the note in ewe1-watter-sye.js).

   ew8 was one tap: two triangles, or sides in ratio. Now the learner
   WRITES what goes on the exam page: the two triangle names in matching
   order, or the reason line.

   Her method (the digest, rule 24 and the Metode-notas of p.49 and p.55):
   she reads the two triangles OUT OF THE FRACTIONS. The two sides that
   share a letter are sides of one Δ; she highlights each Δ in its own
   colour and writes its name under its fraction ("Δ QRS links, Δ PRQ
   regs"), then the two names "in ooreenstemmende volgorde". Her letter
   rule (29 Sep): the corner order of a triangle's name matters, the two
   letters of a side never do.

   Two sketch kinds:
     A  the ∥-line triangle (cutTriangle, DE ∥ BC, as ew8)
     B  her p.55 figure (sharedAngleSide): Δ PQR, S on PR, QS joined, so
        Δ QRS ||| Δ PRQ (they share R̂ AND the side QR). To scale: RS =
        QR² / RP, so RQ̂S = P̂ exactly; those two get the same arc mark,
        R̂ her star. No right angle anywhere (her 3 Oct ruling).

   A TRIANGLES question (Q1, Q3, Q4, Q5): three steps, then the card.
     the fractions  GIVEN under the sketch (a kind B question first shows
            the exam line, QR² = RS · RP, the way ew7 ended)
     1 pick   the first two sides light up in colour 1 (blue), in the
              fractions and as arcs on the sketch: "Hierdie twee sye, AD en
              DE, deel die letter D. Van watter Δ is hulle sye?" Right: that
              Δ tints blue and its name appears with its fraction(s); the
              other two sides light up in colour 2 (orange)
     2 pick   the same for the other two sides
     3 build  Δ ADE ||| Δ ☐☐☐, chips the three letters of the second Δ;
              the ONE order that matches the first name (markName)
     card     the fractions with both names, then Δ ADE ||| Δ ABC, and the
              line that says where the proof comes
   Which Δ comes FIRST (ew8 foreman rule): in the ACROSS form (AD/AB =
   DE/BC) the two TOPS are one Δ and the two BOTTOMS the other, and the
   tops' Δ is named first; in the WITHIN form (JK/FK = GH/FH, QR/RS =
   RP/QR) each FRACTION is one Δ, and the left fraction's Δ is named
   first. tools/check-ewe-marker.mjs proves the rule for every question.
   Where the names stand: WITHIN, under each fraction (her rule 24);
   ACROSS, no single fraction belongs to a Δ, so the two names stand beside
   the last fraction, "bo:" level with the tops and "onder:" level with the
   bottoms (her p.53: read the tops together, the bottoms together).

   A SIDES question (Q2, Q6): one build, then ew1's card.
     build  lyn ∥ een sy v. Δ ☐, ☐ ∥ ☐, chips the two triangle names and
            four lines; the Δ first, then the two ∥ lines in either order
            (markExact with an order-free pair)

   Content shape: the same as ew6 and ew8 (read by js/ewe.js), plus the
   opt-in keys this round adds:
     question  fracLine   the given fractions under the sketch, lit and
                          named (js/ewe-kit.js namesLineHtml)
     step      fracLineAfter   the line redrawn once the step is right
     build     spec { mode: "name", first, map, chips }   markName
               spec { mode: "exact", expect, free, chips, why }   markExact
               frame cells { t, tone }   a name in its colour; BRK a break
               point without a sign; { t: ",", tight: true } a comma right
               after the filled box (fix round)
               mid       the frame on one middle line (fix round)
               doneNames { first, k2 }   the finished name build drawn like
                         the card, "Δ ADE ||| Δ ABC" (fix round)
     pick      layout "row" (the three names in one row, shuffled),
               keepSketch (as ew5)
     write     { names: { line, sim }, tip }   the triangles card
     takeaway  cards [{ names }, { fracs, reason }]
   and, for the tools only: kind, form, fig (the coordinates, the drawn
   lines, the given fractions by their letters), tris (the triangles named
   and the lit pairs), and sketches (every sketch state).
   ============================================================ */
import { cutTriangle, sharedAngleSide, hat, SLOT, BRK } from "../ewe-core.js";

const NB = "\u00A0";
/* Strings the player shows WITHOUT its no-break glue (hints, okLines, the
   card's tip, the end screen) carry their own: "DE ∥ BC", "Δ ADE",
   "Δ ADE ||| Δ ABC", a product "RS · RP", "'n SY" and a letter match
   "A pas by A" / "D by B" never break (so no line ends on one letter). */
const nb = s => s.replace(/(\S) ∥ (\S)/g, `$1${NB}∥${NB}$2`).replace(/Δ (\S)/g, `Δ${NB}$1`).replace(/ \|\|\| /g, `${NB}|||${NB}`)
  .replace(/ · /g, `${NB}·${NB}`).replace(/'n (\S)/g, `'n${NB}$1`)
  .replace(/\b([A-Z]) (pas )?by ([A-Z])\b/g, (m, x, p, y) => [x, ...(p ? ["pas"] : []), "by", y].join(NB));
/* as ew6 and ew8: the last two words of every hint, ✓ line, intro, tip and
   the takeaway are glued, so no word sits alone on the last line */
const tail = s => s.replace(/ (\S+)$/, `${NB}$1`);
/* fix round: in an intro a point letter never ends a line, it is glued to
   the word after it ("S lê", "J op"), and an equation in the sentence never
   breaks ("QR² = RS · RP": the "=" glued both sides, the "·" by nb) */
const glueIntro = s => nb(s).replace(/(^|[ (])([A-Z]) (?=\S)/g, `$1$2${NB}`).replace(/ = /g, `${NB}=${NB}`);

/* her arcs, as in ew8 (foreman review 2026-10-03, hand-drawn bows):
   PAR_SAG  an arc over a ∥ line bows well clear of its ∥ arrow
   NEST     a whole side's arc over its piece's arc (and, in kind B, the
            second arc over QR over the first): the corner zone `end` of the
            inner chord, `gap` clear outside it, the cut point's label `lab`
            clear of the outer bow; keepHidden: a colour 2 bow, hidden until
            step 1 is right, already stands where it will be drawn, so no
            label moves when it appears; same (fix round): the two bows over
            ONE side (QR, TU) keep 7.5 apart in the middle, so they read as
            two bows */
const PAR_SAG = 12, NEST = { end: 0.4, gap: 4.5, lab: 4.5, keepHidden: true, same: 7.5 };

const PAR_REASON = (big, de, bc) => `lyn ∥ een sy v. Δ ${big}, ${de} ∥ ${bc}`;
const CARD_TIP = "Jy het nou die twee Δe. In die eksamen bewys jy eers dat hulle gelykvormig is (∠∠∠), dan skryf jy die breuke (uit |||).";

/* the letter two sides share, and a Δ's three letters as words */
const shareOf = (a, b) => [...a].find(c => b.includes(c));
/* fix round: the three letters never break apart, so no letter is left
   alone at the end of a line ("letters: A, D" / "en E.") */
const three = ([x, y, z]) => `${x},${NB}${y}${NB}en${NB}${z}`;

/* ---------------- a TRIANGLES question ----------------
   fig      a cutTriangle (kind A) or a sharedAngleSide (kind B)
   fracs    the given fractions by their letters, [[a, b], [c, d]] = a/b = c/d
   form     "across" (the tops are one Δ) | "within" (each fraction is one Δ)
   tri1     the first Δ's name as written (the tops' Δ, or the left
            fraction's Δ), tri2 the second's, in MATCHING order
   decoy    the third shape in the figure (the trapezium, or Δ PQS)
   arcs     her arcs: [{ side: "AD", from, to, k, level, away?, sag? }, …]
   order    the hint for a wrong order, read off the fractions
   pairsOk  the ✓ line of the name build
   exam     kind B: the exam line QR² = RS · RP. The intro says it first
            (her words: "bewys dat QR² = RS · RP", the 2 raised); the card
            writes it above the fractions. The line under the sketch holds
            only the fractions, so the sketch, the fractions and the step
            share a small phone screen
   labOut   as ew8: one point's label a little further out, if needed */
function triQ(id, { kind, fig, fracs, form, tri1, tri2, decoy, arcs, order, pairsOk, intro, exam, labOut }) {
  const [[a, b], [c, d]] = fracs;
  /* the lit pairs: colour 1 the first Δ's two sides, colour 2 the second's */
  const pair1 = form === "across" ? [a, c] : [a, b];
  const pair2 = form === "across" ? [b, d] : [c, d];
  const s1 = shareOf(...pair1), s2 = shareOf(...pair2);
  const map = Object.fromEntries([...tri1].map((k, i) => [k, tri2[i]]));

  /* the sketch states. Every arc is there from the start (colour 2 hidden,
     so no label moves when it appears); the tints come after each pick. The
     bigger Δ is tinted first, the smaller on top; fix round: the smaller Δ
     is cut out of the bigger one's tint (`hole`), so it keeps ITS OWN
     colour (two see-through tints, blue over orange, mixed to grey). */
  const outside = kind === "A" ? [fig.corner, ...fig.ends] : [fig.far, fig.apex, fig.shared];
  const area = t => { const [p, q, r] = [...t].map(k => fig.pts[k]); return Math.abs((q.x - p.x) * (r.y - p.y) - (r.x - p.x) * (q.y - p.y)) / 2; };
  const bigFirst = area(tri1) > area(tri2);
  const side = (lit2) => arcs.map(x => ({ from: x.from, to: x.to, tone: x.k, level: x.level || 1,
    ...(x.away ? { away: x.away, sag: x.sag || PAR_SAG } : {}), ...(x.k === 2 && !lit2 ? { hidden: true } : {}) }));
  const base = { ...fig.sketch, outside, labBox: true, boxClear: true, arcNest: NEST, edge: 8, labGap: 3, ...(labOut ? { labOut } : {}) };
  const start = { ...base, sideArcs: side(false) };
  const t1 = { pts: [...tri1], tint: "k1" }, t2 = { pts: [...tri2], tint: "k2" };
  const after1 = { ...base, sideArcs: side(true), tints: [t1] };
  const after2 = { ...base, sideArcs: side(true), tints: bigFirst ? [{ ...t1, hole: [...tri2] }, t2] : [{ ...t2, hole: [...tri1] }, t1] };

  /* the given fractions: lit, then named (pre: the exam line, card only) */
  const N1 = { t: tri1, k: 1 }, N2 = { t: tri2, k: 2 };
  const line = (lit1, lit2, nm1, nm2, pre) => {
    if (form === "across") return {
      ...(pre && exam ? { pre: exam } : {}),
      fracs: [{ n: a, d: b, tone: [lit1 ? 1 : 0, lit2 ? 2 : 0] }, { n: c, d: d, tone: [lit1 ? 1 : 0, lit2 ? 2 : 0] }],
      side: { top: { ...N1, show: nm1 }, bot: { ...N2, show: nm2 } },
    };
    return {
      ...(pre && exam ? { pre: exam } : {}), under: true,
      fracs: [{ n: a, d: b, tone: lit1 ? [1, 1] : [0, 0], ...(nm1 ? { name: N1 } : {}) },
              { n: c, d: d, tone: lit2 ? [2, 2] : [0, 0], ...(nm2 ? { name: N2 } : {}) }],
    };
  };

  const shapes = [`Δ ${tri1}`, `Δ ${tri2}`, decoy];
  /* the three names in ONE row (layout "row", shuffled); step 2 is read
     off the sketch, so it is brought in like a build step (keepSketch) */
  const pick = (k, prompt, tri, okLine, after, lineAfter) => ({
    type: "pick", layout: "row", keepSketch: k > 1,
    prompt,
    options: shapes.map(t => (t === `Δ ${tri}` ? { text: t, correct: true }
                                              : { text: t, hint: tail(nb(`Soek die Δ met AL DRIE letters: ${three([...tri])}.`)) })),
    okLine: tail(nb(okLine)),
    sketchAfter: after,
    fracLineAfter: lineAfter,
  });
  const chips = [...tri2].slice().sort();
  const steps = [
    pick(1, `Hierdie twee sye, ${pair1[0]} en ${pair1[1]}, deel die letter ${s1}. Van watter Δ is hulle sye?`,
      tri1, `${pair1[0]} en ${pair1[1]} is sye van Δ ${tri1}.`, after1, line(true, true, true, false)),
    pick(2, `Nou ${pair2[0]} en ${pair2[1]}: hulle deel die letter ${s2}. Van watter Δ?`,
      tri2, `${pair2[0]} en ${pair2[1]} is sye van Δ ${tri2}.`, after2, line(true, true, true, true)),
    {
      type: "build", role: "name",
      prompt: "Skryf die tweede naam in dieselfde volgorde.",
      frame: [[{ t: `Δ${NB}${tri1}`, tone: 1 }, "|||"], BRK, [{ t: "Δ", tone: 2 }, SLOT, SLOT, SLOT]],
      compact: true,
      mid: true,
      doneNames: { first: N1, k2: 2 },
      chips,
      spec: { mode: "name", first: tri1, map, chips },
      answer: [...tri1].map(k => map[k]),
      hints: {
        order: tail(nb(order)),
        repeat: tail("Elke hoekpunt kom een keer in die naam."),
        pattern: tail(nb(order)),
      },
      okLine: tail(nb(pairsOk)),
    },
  ];
  const fin = line(true, true, true, true, true);
  return {
    id, intro: tail(glueIntro(intro)), sketch: start,
    fracLine: line(true, false, false, false),
    steps,
    write: { names: { line: fin, sim: [N1, N2] }, tip: tail(nb(CARD_TIP)) },
    /* for the tools */
    kind: "driehoeke", sketchKind: kind, form,
    tris: { first: tri1, second: tri2, map, pair1, pair2, decoy, shapes },
    sketches: { start, after1, after2 },
    fig: { pts: fig.pts, lines: fig.sketch.lines, fracs, ...(exam ? { exam: [exam.sq, ...exam.prod] } : {}) },
  };
}

/* ---------------- a SIDES question ----------------
   T      a cutTriangle (DE ∥ BC); fracs by their letters */
function sidesQ(id, { T, fracs, intro, prompt }) {
  const n = T.names, A = T.corner, [B, C] = T.ends, [D, E] = T.cuts;
  const BIG = A + B + C, SMALL = A + D + E;
  const chips = [BIG, SMALL, n.DE, n.BC, n.AB, n.AC];
  const sketch = { ...T.sketch, outside: [A, B, C], labBox: true, boxClear: true, labGap: 2 };
  return {
    id, intro: tail(glueIntro(intro)), sketch,
    fracLine: { fracs: fracs.map(([p, q]) => ({ n: p, d: q })) },
    steps: [{
      type: "build", role: "reason",
      prompt,
      frame: [["lyn ∥ een sy v. Δ", SLOT, { t: ",", tight: true }], BRK, [SLOT, "∥", SLOT]],
      mid: true,
      chips,
      spec: { mode: "exact", expect: [BIG, n.DE, n.BC], free: [[1, 3]], chips,
              why: [{ why: "small", from: 0, to: 1, is: [SMALL] },
                    { why: "cut", from: 1, to: 3, has: [n.AB] }, { why: "cut", from: 1, to: 3, has: [n.AC] }] },
      answer: [BIG, n.DE, n.BC],
      hints: {
        small: tail(nb(`${n.DE} is 'n SY van Δ ${SMALL}. Die lyn moet twee sye van die Δ SNY: dit doen ${n.DE} in Δ ${BIG}.`)),
        cut: tail(nb(`${n.AB} en ${n.AC} is die sye wat gesny word. Watter twee lyne het die pyltjies?`)),
        pattern: tail(nb("Eers die Δ waarvan die lyn twee sye sny: drie letters. Dan die twee lyne met die pyltjies.")),
      },
      okLine: tail(nb(`${n.DE} sny ${n.AB} en ${n.AC}, en ${n.DE} ∥ ${n.BC}.`)),
    }],
    write: { fracs, reason: PAR_REASON(BIG, n.DE, n.BC), tip: tail(nb("Sye in verhouding? Dan noem die rede die Δ en die twee ∥ lyne.")) },
    /* for the tools */
    kind: "sye",
    tri: { big: BIG, small: SMALL, par: [n.DE, n.BC], cutSides: [n.AB, n.AC] },
    sketches: { start: sketch },
    fig: { pts: T.pts, lines: T.sketch.lines, fracs },
  };
}

/* ---------------- the six questions ----------------
   Coordinates are screen units (y down); the builders compute the cut
   points (cutTriangle from t, sharedAngleSide from RS = QR² / RP), and
   js/ewe-kit.js fits them to the canvas. Fresh letters each. */

/* Q1 · kind A, her figure, A on top; ACROSS: AD/AB = DE/BC */
const T1 = cutTriangle({ corner: "A", ends: ["B", "C"], cuts: ["D", "E"], t: 0.45,
  xy: { A: { x: 150, y: 20 }, B: { x: 35, y: 205 }, C: { x: 292, y: 198 } } });
const Q1 = triQ("ew9q1", {
  kind: "A", fig: T1, form: "across",
  fracs: [["AD", "AB"], ["DE", "BC"]], tri1: "ADE", tri2: "ABC", decoy: "trapesium DBCE",
  arcs: [{ from: "A", to: "D", k: 1 }, { from: "D", to: "E", k: 1, away: ["B", "C"] },
         { from: "A", to: "B", k: 2, level: 2 }, { from: "B", to: "C", k: 2, away: ["D", "E"] }],
  order: "AD staan saam met AB: A pas by A, en D pas by B. Skryf die letters in daardie volgorde.",
  pairsOk: "A pas by A, D by B en E by C.",
  intro: "In Δ ABC lê D op AB en E op AC, met DE ∥ BC. Lees die twee Δe uit die breuke af.",
});

/* Q2 · kind A, K on top leaning; SIDES: KN/NL = KT/TM */
const T2 = cutTriangle({ corner: "K", ends: ["L", "M"], cuts: ["N", "T"], t: 0.45,
  xy: { K: { x: 225, y: 20 }, L: { x: 25, y: 195 }, M: { x: 298, y: 208 } } });
const Q2 = sidesQ("ew9q2", {
  T: T2, fracs: [["KN", "NL"], ["KT", "TM"]],
  intro: "In Δ KLM lê N op KL en T op KM, met NT ∥ LM.",
  prompt: "KN en NL is stukke van een sy: sye in verhouding. Bou die rede wat jy langs die breuke skryf.",
});

/* Q3 · kind B, her p.55 figure: Δ PQR, S on PR, QS joined; QR² = RS · RP */
const B3 = sharedAngleSide({ shared: "R", far: "P", apex: "Q", cut: "S",
  xy: { P: { x: 20, y: 200 }, R: { x: 300, y: 200 }, Q: { x: 210, y: 40 } } });
const Q3 = triQ("ew9q3", {
  kind: "B", fig: B3, form: "within", exam: B3.exam,
  fracs: [["QR", "RS"], ["RP", "QR"]], tri1: "QRS", tri2: "PRQ", decoy: "Δ PQS",
  arcs: [{ from: "Q", to: "R", k: 1 }, { from: "R", to: "S", k: 1 },
         { from: "R", to: "P", k: 2, level: 2 }, { from: "Q", to: "R", k: 2, level: 2 }],
  order: `QR staan saam met RP, en RS saam met QR. ${hat("R")} is in albei Δe, dus staan R op dieselfde plek in albei name.`,
  pairsOk: "Q pas by P, R by R en S by Q.",
  intro: "Die eksamen sê: bewys dat QR² = RS · RP. S lê op PR, en QS is getrek.",
});

/* Q4 · kind A turned, F points right; WITHIN (her ew2 example): JK/FK = GH/FH */
const T4 = cutTriangle({ corner: "F", ends: ["G", "H"], cuts: ["J", "K"], t: 0.42,
  xy: { F: { x: 305, y: 118 }, G: { x: 35, y: 25 }, H: { x: 60, y: 212 } } });
const Q4 = triQ("ew9q4", {
  kind: "A", fig: T4, form: "within",
  fracs: [["JK", "FK"], ["GH", "FH"]], tri1: "FJK", tri2: "FGH", decoy: "trapesium JGHK",
  arcs: [{ from: "J", to: "K", k: 1, away: ["G", "H"] }, { from: "F", to: "K", k: 1 },
         { from: "G", to: "H", k: 2, away: ["J", "K"] }, { from: "F", to: "H", k: 2, level: 2 }],
  order: "FK staan saam met FH: F pas by F, en K pas by H. Skryf die letters in daardie volgorde.",
  pairsOk: "F pas by F, J by G en K by H.",
  intro: "Die Δ is gedraai: F wys na regs. In Δ FGH lê J op FG en K op FH, met JK ∥ GH.",
});

/* Q5 · kind B turned, fresh letters: Δ TUW, V on UW, TV joined; TU² = UV · UW */
const B5 = sharedAngleSide({ shared: "U", far: "W", apex: "T", cut: "V",
  xy: { T: { x: 90, y: 30 }, U: { x: 290, y: 30 }, W: { x: 40, y: 210 } } });
const Q5 = triQ("ew9q5", {
  kind: "B", fig: B5, form: "within", exam: B5.exam,
  fracs: [["TU", "UV"], ["UW", "TU"]], tri1: "TUV", tri2: "WUT", decoy: "Δ WTV",
  arcs: [{ from: "T", to: "U", k: 1 }, { from: "U", to: "V", k: 1 },
         { from: "U", to: "W", k: 2, level: 2 }, { from: "T", to: "U", k: 2, level: 2 }],
  order: `TU staan saam met UW, en UV saam met TU. ${hat("U")} is in albei Δe, dus staan U op dieselfde plek in albei name.`,
  pairsOk: "T pas by W, U by U en V by T.",
  intro: "Weer die eksamen: bewys dat TU² = UV · UW. V lê op UW, en TV is getrek.",
});

/* Q6 · kind A on its side, D points left; SIDES, whole over piece: DE/GE = DF/HF */
const T6 = cutTriangle({ corner: "D", ends: ["E", "F"], cuts: ["G", "H"], t: 0.55,
  xy: { D: { x: 20, y: 112 }, E: { x: 288, y: 20 }, F: { x: 300, y: 212 } } });
const Q6 = sidesQ("ew9q6", {
  T: T6, fracs: [["DE", "GE"], ["DF", "HF"]],
  intro: "Die Δ lê op sy sy: D wys na links. G lê op DE en H op DF, met GH ∥ EF.",
  prompt: "DE is 'n hele sy en GE 'n stuk daarvan: sye in verhouding. Bou die rede.",
});

const QS = [Q1, Q2, Q3, Q4, Q5, Q6];

export const round = {
  id: "ew9",
  kind: "ewe",
  accent: "#364fc7",
  title: { en: "Lees dit af", af: "Lees dit af" },
  blurb: { en: tail(nb("Lees die twee Δe uit die breuke af en skryf hulle name in dieselfde volgorde. Is dit sye in verhouding, dan bou jy die rede.")),
           af: tail(nb("Lees die twee Δe uit die breuke af en skryf hulle name in dieselfde volgorde. Is dit sye in verhouding, dan bou jy die rede.")) },
  /* the end screen: the rule, then Q1's card and Q2's */
  takeaway: {
    text: tail(nb("Lees die twee Δe uit die breuke af: elke breuk is een Δ, of die twee bo is een Δ en die twee onder die ander. Skryf die name in dieselfde volgorde. Sye in verhouding? Dan noem die rede die Δ en die twee ∥ lyne.")),
    cards: [Q1.write, Q2.write],
  },
  eweQuestions: QS,
};

/* for tools/check-ewe-marker.mjs: the figure behind each question (its
   coordinates, its drawn lines, the given fractions and, for kind B, the
   exam line), never its answer */
export const FIGS = Object.fromEntries(QS.map(q => [q.id, q.fig]));
