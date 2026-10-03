/* ============================================================
   ew10 · "Die bewys"   (Eweredigheid, group g9)
   ------------------------------------------------------------
   The LAST Gr12 Eweredigheid round (EWEREDIGHEID-PLAN.md, kept local):
   the proof of the theorem, her way. AFRIKAANS ONLY, exactly like ew1 to
   ew9: every learner-facing string is plain Afrikaans; `title` and
   `blurb` carry the same Afrikaans twice (see the note in
   ewe1-watter-sye.js).

   Her two sources (both pasted by her on 3 Oct):
     her boekie page "formele bewys" (Δ PQR, S on PQ, T on PR, ST ∥ QR)
       ① Konstruksie: Trek hoogtelyn k en h in Δ PST. Verbind RS en QT.
       ② Opp Δ PST / Opp Δ QST = ½ · PS · h / ½ · SQ · h = PS / SQ
       ③ Opp Δ PST / Opp Δ STR = ½ · PT · k / ½ · TR · k = PT / TR
       ④ Opp Δ QST = Opp Δ STR
       ⑤ Opp Δ PST / Opp Δ QST = Opp Δ PST / Opp Δ STR,  ∴ PS/SQ = PT/TR
     her exam page (DBE 9.1, Δ ABC, M on AB, N on AC, MN ∥ BC): "Trek h ⊥
       op AN en k ⊥ AM, en verbind BN en MC", and she TURNS THE PAGE for
       each step so the learner SEES the one height. The reason in ④ is
       the exam page's "dies. basis en dies. ⊥h, MN ∥ BC".
   Her ruling 3 Oct 08:32: two proofs in the round, piece over piece
   (PS/SQ = PT/TR) and piece over whole (PS/PQ = PT/PR, her idea with
   Δ PST as the connector, accepted 08:39).

   Her colours, FIXED through the whole proof, on the sketch and behind the
   names in the fractions, by ROLE: the top small Δ (PST, AMN) green, the Δ
   of the first area step pink, of the second yellow; a whole Δ of proof 2
   carries both of its colours (green + pink, green + yellow). The heights
   by LETTER: h orange, k blue. ⚠ Q3 names the heights as her exam page
   does, the OTHER way round from the boekie: k ⊥ AM (from N) is the height
   of the AB step, h ⊥ AN (from M) the height of the AC step.

   Each question (proof 1: six player steps; proof 2: seven), the sketch
   set when the step OPENS (`sketchOpen`):
     1 build  Konstruksie: the heights draw themselves (shown line "Trek
              hoogtelyn h en k in Δ PST."), then Verbind ☐ en ☐; the joins
              appear once it is right (`sketchAfter`)
     2 build  the sketch TURNED, PQ flat: Opp Δ PST / Opp Δ QST = ½ · ☐ · ☐
              over ½ · ☐ · ☐ (markHeight), the ½ and h struck, = PS/SQ
     3 build  turned the other way, PR flat: the same with k
     4 build  turned, ST and QR flat, P at the bottom: Opp Δ ☐ = Opp Δ ☐
       pick   its reason
       pick   (proof 2 only) Tel Δ PST by albei: Opp Δ PQT = Opp Δ PSR
     5 build  upright, every Δ lit: ∴ ☐/☐ = ☐/☐, exactly the statement
              asked (markState)
     card     her boekie page ① to ⑤, the upright sketch once above it
   HER RULING 3 Oct 15:58 (after ew9): no intro, prompt, shown line or ✓
   line shows a build's answer before that build (step 1's shown line names
   the heights, never the joins; Q3's exam konstruksie is shown only up to
   the heights). tools/check-ewe-marker.mjs proves it, apart from the one
   thing the question itself must show: the statement to prove.

   Content shape: the same as ew6 to ew9 (read by js/ewe.js), plus the
   opt-in keys this round adds:
     question  lead { given, bewys, pre }   the Gegee / Bewys line
               stick     the sketch stays under the top bar (sticky)
     step      sketchOpen   the sketch state set when the step opens
     build     spec { mode: "height", … }   markHeight
               spec { mode: "state", … }    markState
               done { strike, then }        the finished area line
               given { text } with no line  a shown sentence alone
     write     { proof, sketch, tip }   her boekie page, the sketch once
     takeaway  proof
   and, for the tools only: proof (1 or 2), fig (the figure: points,
   heights, triangles), roles, sketches (every state).
   ============================================================ */
import { proofFigure, SLOT, HALF } from "../ewe-core.js";

const NB = " ";
/* the strings the player shows WITHOUT its no-break glue carry their own:
   "ST ∥ QR", "Opp Δ PST", "Δ PST", "½ · basis", "'n WORD", an "=" and a
   "⊥" never split, and no line ends on one letter: a lone letter is glued
   to the word after it ("k ⊥", "Q met"), or, closing its clause, to the
   word before it ("met T,") */
const nb = s => s.replace(/(\S) ∥ (\S)/g, `$1${NB}∥${NB}$2`).replace(/Opp Δ (\S)/g, `Opp${NB}Δ${NB}$1`).replace(/Δ (\S)/g, `Δ${NB}$1`)
  .replace(/ · /g, `${NB}·${NB}`).replace(/ = /g, `${NB}=${NB}`).replace(/ ⊥ /g, `${NB}⊥${NB}`).replace(/'n (\S)/g, `'n${NB}$1`);
const letters = s => s.replace(/(^|[\s(])([A-Za-z]) (?=\S)/g, `$1$2${NB}`).replace(/ ([A-Za-z])(?=[.,:;)!?]|$)/g, `${NB}$1`);
/* as ew6 to ew9: the last two words of every text are glued, so no word
   sits alone on the last line */
const tail = s => s.replace(/ (\S+)$/, `${NB}$1`);
const tx = s => tail(letters(nb(s)));

const REASON_EQ = (st, qr) => `dies. basis en dies. ⊥h, ${st} ∥ ${qr}`;
const REASON_SUM = (small) => `albei is Δ ${small} plus een van die gelyke Δe`;
const CARD_TIP = "Die konstruksie kry ook punte: skryf dit altyd eerste.";

/* ---------------- one proof question ----------------
   F        a proofFigure
   proof    1 (piece over piece, PS/SQ = PT/TR) or 2 (piece over whole,
            PS/PQ = PT/PR)
   intro    the question's first sentence
   lead     the Gegee / Bewys line ({ given } or Q3's { pre })
   konShown step 1's shown line: the heights only, never the joins
   konCard  the card's konstruksie (everything, the joins too) */
function proofQ(id, { F, proof, intro, lead, konShown, konCard }) {
  const P = F.corner, [Q, R] = F.ends, [S, T] = F.cuts, n = F.names, tri = F.tri;
  const [H1, H2] = [F.hSpec[0].label, F.hSpec[1].label];   // the height of the PQ step, of the PR step
  const two = proof === 2;
  /* the statement, and the two triangles each area step compares */
  const bewys = two ? [n.AD, n.AB, n.AE, n.AC] : [n.AD, n.DB, n.AE, n.EC];
  const T2 = two ? tri.wholeL : tri.left, T3 = two ? tri.wholeR : tri.right;
  const tone = { [tri.small]: "g", [tri.left]: "p", [tri.right]: "y", [tri.wholeL]: "gp", [tri.wholeR]: "gy", [tri.big]: "" };
  const cellOf = t => ({ t: `Opp${NB}Δ${NB}${t}`, tint: tone[t] });

  /* ---- the sketch states ---- */
  const base = { ...F.sketch, labBox: true, boxClear: true, labGap: 2, edge: 10,
    fitAll: [null, F.turns.flatL, F.turns.flatR, F.turns.par] };
  const lines1 = [...F.sketch.lines, ...F.joins];
  const fill = (t, k, hole) => ({ pts: [...t], tint: k, ...(hole ? { hole } : {}) });
  const ol = (t, k) => ({ pts: [...t], tone: k });
  const X = [S, T, "_x"];                  // where Δ QST and Δ STR overlap
  const three = [fill(tri.small, "g"), fill(tri.left, "p", X), fill(tri.right, "y", X), { pts: X, stripe: ["p", "y"] }];
  const NEST = { end: 0.4, gap: 4.5, lab: 5, line: 4.5 };
  const start = base;
  const kon = { ...base, heights: F.hSpec.map(h => ({ ...h, fresh: true })) };
  const konDone = { ...base, lines: lines1, heights: F.hSpec };
  const built = { ...konDone };
  const flatL = { ...built, turn: F.turns.flatL, labOut: { [S]: 4 },
    tints: [fill(tri.small, "g"), fill(tri.left, "p")],
    outlines: [ol(tri.small, "g"), ol(two ? tri.wholeL : tri.left, "p")],
    sideArcs: two ? [{ from: P, to: S, tone: "g", level: 1 }, { from: P, to: Q, tone: "p", level: 2 }]
                  : [{ from: P, to: S, tone: "g", level: 1 }, { from: S, to: Q, tone: "p", level: 1 }],
    ...(two ? { arcNest: NEST } : {}) };
  const flatR = { ...built, turn: F.turns.flatR, labOut: { [T]: 4 },
    tints: [fill(tri.small, "g"), fill(tri.right, "y")],
    outlines: [ol(tri.small, "g"), ol(two ? tri.wholeR : tri.right, "y")],
    sideArcs: two ? [{ from: P, to: T, tone: "g", level: 1 }, { from: P, to: R, tone: "y", level: 2 }]
                  : [{ from: P, to: T, tone: "g", level: 1 }, { from: T, to: R, tone: "y", level: 1 }],
    ...(two ? { arcNest: NEST } : {}) };
  const par = { ...built, turn: F.turns.par,
    tints: [fill(tri.left, "p", X), fill(tri.right, "y", X), { pts: X, stripe: ["p", "y"] }],
    outlines: [ol(tri.left, "p"), ol(tri.right, "y")] };
  const sum = { ...built, tints: three, outlines: [ol(tri.wholeL, "p"), ol(tri.wholeR, "y")] };
  const fin = { ...built, tints: three,
    outlines: two ? [ol(tri.small, "g"), ol(tri.wholeL, "p"), ol(tri.wholeR, "y")] : [ol(tri.small, "g"), ol(tri.left, "p"), ol(tri.right, "y")] };

  /* ---- step 1: the konstruksie ---- */
  const joinChips = [n.QT, n.RS, n.BC, n.DE, n.AB];
  const cross = `Verbind die hoekpunte KRUIS: ${Q} met ${T}, en ${R} met ${S}.`;
  const s1 = {
    type: "build", role: "kon",
    given: { first: true, text: tx(konShown) },
    prompt: tx("Verbind nou nog twee hoekpunte, sodat jy drie driehoeke kry."),
    frame: [["Verbind", SLOT, "en", SLOT]],
    compact: true, mid: true,
    chips: joinChips,
    spec: { mode: "exact", expect: [n.QT, n.RS], free: [[0, 2]], chips: joinChips,
            why: [{ why: "drawn", has: [n.BC] }, { why: "drawn", has: [n.DE] }, { why: "side", has: [n.AB] },
                  { why: "repeat", is: [n.QT, n.QT] }, { why: "repeat", is: [n.RS, n.RS] }] },
    answer: [n.QT, n.RS],
    hints: {
      drawn: tx(`${n.BC} en ${n.DE} is klaar getrek. ${cross}`),
      side: tx(`${n.AB} is 'n sy van die Δ, klaar getrek. ${cross}`),
      repeat: tx("Dieselfde lyn twee keer is net een lyn. Jy het twee NUWE lyne nodig."),
      pattern: tx(cross),
    },
    okLine: tx(`Nou het jy drie driehoeke: Δ ${tri.small}, Δ ${tri.left} en Δ ${tri.right}.`),
    sketchOpen: kon, sketchAfter: konDone,
  };

  /* ---- steps 2 and 3: ½ · basis · hoogte, one height for both ---- */
  const areaStep = (k, { flat, line, tris, bases, H, Ho, oLine, sketch, prompt }) => {
    const [t1, t2] = tris, chips = k === 2 ? (two ? [n.AD, n.AB, n.DB, n.AE, H1, H2] : [n.AD, n.DB, n.AE, n.EC, H1, H2])
                                           : (two ? [n.AE, n.AC, n.EC, n.AD, H1, H2] : [n.AE, n.EC, n.AD, n.DB, H1, H2]);
    const fl = flat.join("");
    return {
      type: "build", role: `area${k - 1}`,
      prompt: tx(prompt),
      frame: [{ n: [cellOf(t1)], d: [cellOf(t2)] }, "=", { n: [HALF, "·", SLOT, "·", SLOT], d: [HALF, "·", SLOT, "·", SLOT] }],
      compact: true,
      chips,
      spec: { mode: "height", seg: F.seg, heights: F.heights, flat, line, tris, H },
      answer: [bases[0], H, bases[1], H],
      hints: {
        height: tx(`${Ho} staan loodreg op ${oLine}. Hierdie twee Δe se basisse lê op ${fl}. Hulle hoogte is ${H}.`),
        off: tx(two ? `{chip} lê nie op die plat lyn nie. Die basisse lê op ${fl}.` : `{chip} lê nie op die plat lyn nie. Die basisse is die twee stukke van ${fl}.`),
        order: tx(`Δ ${t1} staan bo, dus kom sy basis ${bases[0]} bo.`),
        repeat: tx(`Jy het dieselfde basis bo en onder gebruik. Elke Δ het sy eie basis op ${fl}.`),
        ...(two ? { wrongbase: tx(`{chip} lê op ${fl}, maar dit is nie die basis van Δ ${t1} of van Δ ${t2} nie. Δ ${t2} staan op die hele ${fl}.`) } : {}),
        pattern: tx(`Elke produk is een basis en die hoogte ${H}: ½ · basis · ${H}.`),
      },
      done: { strike: [HALF, H], then: [{ n: [bases[0]], d: [bases[1]] }] },
      okLine: tx(`Dieselfde hoogte ${H}, dus bly net die basisse oor.`),
      sketchOpen: sketch,
      /* step 2 waits a moment: the joins of step 1 are seen upright first */
      ...(k === 2 ? { openAfter: 1200 } : {}),
    };
  };
  const s2 = areaStep(2, { flat: [P, Q], line: [P, S, Q], tris: [tri.small, T2], bases: [n.AD, two ? n.AB : n.DB], H: H1, Ho: H2, oLine: n.AC, sketch: flatL,
    prompt: `Die skets is gedraai: ${n.AB} lê plat. Skryf albei oppervlaktes voluit as ½ · basis · hoogte.` });
  const s3 = areaStep(3, { flat: [P, R], line: [P, T, R], tris: [tri.small, T3], bases: [n.AE, two ? n.AC : n.EC], H: H2, Ho: H1, oLine: n.AB, sketch: flatR,
    prompt: `Nou is die skets anderkant toe gedraai: ${n.AC} lê plat. Skryf weer albei oppervlaktes voluit.` });

  /* ---- step 4: the equal areas, then the reason ---- */
  const eqChips = [tri.left, tri.right, tri.small, tri.big];
  const s4 = {
    type: "build", role: "eq",
    prompt: tx(`Die skets is weer gedraai: ${n.DE} en ${n.BC} lê plat, ${P} onder. Watter twee Δe het dieselfde oppervlakte?`),
    frame: [[`Opp${NB}Δ`, SLOT], "=", [`Opp${NB}Δ`, SLOT]],
    compact: true, mid: true,
    chips: eqChips,
    spec: { mode: "exact", expect: [tri.left, tri.right], free: [[0, 2]], chips: eqChips,
            why: [{ why: "top", has: [tri.small] }, { why: "whole", has: [tri.big] },
                  { why: "repeat", is: [tri.left, tri.left] }, { why: "repeat", is: [tri.right, tri.right] }] },
    answer: [tri.left, tri.right],
    hints: {
      top: tx(`Δ ${tri.small} is die een wat in ALBEI breuke bo staan. Watter twee staan ONDER?`),
      whole: tx(`Δ ${tri.big} is die hele Δ. Kyk na die twee Δe wat in die skets lig: albei staan op ${n.DE}.`),
      repeat: tx(`Twee keer dieselfde Δ sê niks nie. Watter twee Δe staan op ${n.DE}?`),
      pattern: tx(`Soek die twee Δe wat albei op ${n.DE} staan.`),
    },
    sketchOpen: par,
  };
  const reason = REASON_EQ(n.DE, n.BC);
  const s4r = {
    type: "pick", role: "reason", keepSketch: true,
    prompt: tx("Watter rede skryf jy langs hierdie lyn?"),
    options: [
      { text: nb(reason), correct: true },
      { text: nb(`lyn ∥ een sy v. Δ, ${n.DE} ∥ ${n.BC}`), hint: tx("Dit is die stelling wat jy BEWYS. Jy mag dit nie as rede gebruik nie.") },
      { text: "gemene hoekpunt", hint: tx(`Hierdie twee Δe deel 'n BASIS, ${n.DE}, nie 'n hoek nie.`) },
      { text: "uit |||", hint: tx("Niemand het bewys dat Δe gelykvormig is nie.") },
    ],
    okLine: tx(`Albei staan op ${n.DE}, en albei reik tot by ${n.BC}. ${n.DE} ∥ ${n.BC}, dus is die hoogte dieselfde.`),
  };
  /* proof 2: the extra line, its own lit-up picture */
  const s4s = two ? {
    type: "pick", role: "sum", keepSketch: true,
    prompt: tx(`Tel Δ ${tri.small} by albei. Wat is nou gelyk?`),
    options: [
      { text: nb(`Opp Δ ${tri.wholeL} = Opp Δ ${tri.wholeR}`), correct: true },
      { text: nb(`Opp Δ ${tri.wholeL} = Opp Δ ${tri.big}`), hint: tx(`Δ ${tri.big} is die hele Δ: dit is groter as Δ ${tri.wholeL}. Δ ${tri.small} plus Δ ${tri.right} gee Δ ${tri.wholeR}.`) },
      { text: nb(`Opp Δ ${tri.small} = Opp Δ ${tri.big}`), hint: tx(`Δ ${tri.small} is maar 'n stuk van Δ ${tri.big}. Tel Δ ${tri.small} by Δ ${tri.left}, en by Δ ${tri.right}.`) },
    ],
    okLine: tx(`Δ ${tri.small} plus Δ ${tri.left} is Δ ${tri.wholeL}, en Δ ${tri.small} plus Δ ${tri.right} is Δ ${tri.wholeR}. Gelyke stukke plus dieselfde Δ ${tri.small}.`),
    sketchOpen: sum,
  } : null;

  /* ---- step 5: the statement ---- */
  const finChips = [n.AD, n.DB, n.AE, n.EC, n.AB, n.AC];
  const finGiven = [{ n: [cellOf(tri.small)], d: [cellOf(T2)] }, "=", { n: [cellOf(tri.small)], d: [cellOf(T3)] }];
  const s5 = {
    type: "build", role: "fin",
    given: { first: true, line: finGiven },
    prompt: tx(`Die twee breuke is gelyk, want hulle onderste oppervlaktes is gelyk. Skryf nou wat jy moes bewys.`),
    frame: [["∴"], { n: [SLOT], d: [SLOT] }, "=", { n: [SLOT], d: [SLOT] }],
    compact: true,
    chips: finChips,
    spec: { mode: "state", expect: bewys, seg: F.ratioSeg, chips: finChips },
    answer: bewys,
    hints: {
      form: ["Dit is waar, maar die vraag vra ", { n: [bewys[0]], d: [bewys[1]] }, `${NB}=${NB}`, { n: [bewys[2]], d: [bewys[3]] }, `. Skryf presies wat jy moet${NB}bewys.`],
      repeat: tx("Elke stuk kom net een keer. Lees die twee breuke van die stappe hierbo af."),
      pattern: tx("Kyk wat in die twee oppervlaktelyne hierbo oorgebly het, en skryf dit gelyk aan mekaar."),
    },
    okLine: tx("Dit is presies wat jy moes bewys."),
    sketchOpen: fin,
  };

  const steps = [s1, s2, s3, s4, s4r, ...(s4s ? [s4s] : []), s5];
  const proofCard = {
    given: lead.given || `${n.DE} ∥ ${n.BC}`, bewys, kon: konCard,
    areas: [{ tris: [{ t: tri.small, tint: "g" }, { t: T2, tint: tone[T2] }], bases: s2.answer.filter(c => c !== H1), h: H1 },
            { tris: [{ t: tri.small, tint: "g" }, { t: T3, tint: tone[T3] }], bases: s3.answer.filter(c => c !== H2), h: H2 }],
    eq: { tris: [{ t: tri.left, tint: "p" }, { t: tri.right, tint: "y" }], reason },
    ...(two ? { sum: { tris: [{ t: tri.wholeL, tint: "gp" }, { t: tri.wholeR, tint: "gy" }], reason: REASON_SUM(tri.small) } } : {}),
    fin: { fr: [[{ t: tri.small, tint: "g" }, { t: T2, tint: tone[T2] }], [{ t: tri.small, tint: "g" }, { t: T3, tint: tone[T3] }]], so: bewys },
  };
  return {
    id, intro: tx(intro), lead, sketch: start,
    /* the sketch stays on screen under the top bar: every step is read off
       it, and five finished steps pile up under it */
    stick: true,
    steps,
    write: { proof: proofCard, sketch: fin, tip: tx(CARD_TIP) },
    /* for the tools */
    proof,
    roles: { P, Q, R, S, T, H1, H2, bewys, T2, T3 },
    sketches: { start, kon, konDone, flatL, flatR, par, ...(two ? { sum } : {}), fin },
    fig: { pts: F.pts, X: F.X, heights: F.heights, tri, seg: F.seg, lines: F.sketch.lines, joins: F.joins },
  };
}

/* ---------------- the four questions ----------------
   Coordinates are screen units (y down); proofFigure computes the cut
   points, the feet of the two heights and X, and throws unless both feet
   land well inside Δ PST. A repeated proof is a FEATURE (her standing
   ruling): Q3 repeats proof 1, Q4 proof 2. */

/* Q1 · her boekie figure: Δ PQR, P on top; proof 1, PS/SQ = PT/TR */
const F1 = proofFigure({ corner: "P", ends: ["Q", "R"], cuts: ["S", "T"], t: 0.55,
  xy: { P: { x: 150, y: 18 }, Q: { x: 28, y: 205 }, R: { x: 296, y: 205 } } });
const Q1 = proofQ("ew10q1", {
  F: F1, proof: 1,
  intro: "In Δ PQR lê S op PQ en T op PR, met ST ∥ QR. Bewys die stelling, stap vir stap.",
  lead: { given: "ST ∥ QR", bewys: ["PS", "SQ", "PT", "TR"] },
  konShown: "Konstruksie: Trek hoogtelyn h en k in Δ PST.",
  konCard: "Trek hoogtelyn h en k in Δ PST. Verbind RS en QT.",
});

/* Q2 · the same figure and letters: only the statement differs; proof 2 */
const Q2 = proofQ("ew10q2", {
  F: F1, proof: 2,
  intro: "Dieselfde skets, maar nou 'n stuk oor die HELE sy. Bewys dit, stap vir stap.",
  lead: { given: "ST ∥ QR", bewys: ["PS", "PQ", "PT", "PR"] },
  konShown: "Konstruksie: Trek hoogtelyn h en k in Δ PST.",
  konCard: "Trek hoogtelyn h en k in Δ PST. Verbind RS en QT.",
});

/* Q3 · her exam figure (DBE 9.1): Δ ABC, M on AB, N on AC, MN ∥ BC;
   proof 1 again. The heights named as on her exam page: k ⊥ AM (from N,
   the AB step), h ⊥ AN (from M, the AC step) */
const F3 = proofFigure({ corner: "A", ends: ["B", "C"], cuts: ["M", "N"], t: 0.58, hts: ["k", "h"],
  tris: { left: "BMN", right: "CMN", wholeL: "ABN", wholeR: "AMC" }, spell: ["MC"],
  xy: { A: { x: 110, y: 18 }, B: { x: 20, y: 205 }, C: { x: 300, y: 205 } } });
const Q3 = proofQ("ew10q3", {
  F: F3, proof: 1,
  intro: "Die eksamen, vraag 9.1: in Δ ABC lê M op AB en N op AC, met MN ∥ BC. Kyk mooi watter hoogte hier h is.",
  lead: { pre: "Bewys die stelling wat meld dat", bewys: ["AM", "MB", "AN", "NC"] },
  konShown: "Konstruksie: Trek h ⊥ op AN en k ⊥ AM.",
  konCard: "Trek h ⊥ op AN en k ⊥ AM, en verbind BN en MC.",
});

/* Q4 · a fresh figure and letters, on its side (D points left); proof 2
   again. No H or K as a point: those read like the heights h and k */
const F4 = proofFigure({ corner: "D", ends: ["E", "F"], cuts: ["G", "J"], t: 0.56,
  tris: { left: "EGJ", right: "GJF", wholeL: "DEJ", wholeR: "DGF" },
  xy: { D: { x: 20, y: 118 }, E: { x: 282, y: 12 }, F: { x: 298, y: 226 } } });
const Q4 = proofQ("ew10q4", {
  F: F4, proof: 2,
  intro: "'n Nuwe Δ, op sy sy: D wys na links. G lê op DE en J op DF, met GJ ∥ EF. Weer 'n stuk oor die hele sy.",
  lead: { given: "GJ ∥ EF", bewys: ["DG", "DE", "DJ", "DF"] },
  konShown: "Konstruksie: Trek hoogtelyn h en k in Δ DGJ.",
  konCard: "Trek hoogtelyn h en k in Δ DGJ. Verbind FG en EJ.",
});

const QS = [Q1, Q2, Q3, Q4];

export const round = {
  id: "ew10",
  kind: "ewe",
  accent: "#0b7285",
  title: { en: "Die bewys", af: "Die bewys" },
  blurb: { en: tx("Die stelling se bewys, stap vir stap. Draai die skets, en jy SIEN dieselfde hoogte."),
           af: tx("Die stelling se bewys, stap vir stap. Draai die skets, en jy SIEN dieselfde hoogte.") },
  /* the end screen: the rule, then Q1's page */
  takeaway: {
    text: tx("Konstruksie eerste. Dan twee keer ½ · basis · hoogte, elke keer met EEN hoogte vir albei Δe. Dan twee Δe op dieselfde basis tussen die ∥ lyne. Dan volg die stelling."),
    proof: Q1.write.proof,
  },
  eweQuestions: QS,
};

/* for tools/check-ewe-marker.mjs: the figure behind each question (its
   coordinates, its heights and feet, its triangles), never its answer */
export const FIGS = Object.fromEntries(QS.map(q => [q.id, q.fig]));
