/* ============================================================
   ew3 · "Deel 'n sy"   (Eweredigheid, group g9)
   ------------------------------------------------------------
   The third Gr12 Eweredigheid mini round (EWEREDIGHEID-PLAN.md,
   kept local). AFRIKAANS ONLY, exactly like ew1 and ew2: every
   learner-facing string is plain Afrikaans; `title` and `blurb` carry
   the same Afrikaans twice (see the note in ewe1-watter-sye.js).

   The area ratio from a shared height, her p.42 ③ "Aangrensende
   driehoeke" and her p.43 example. Two triangles with one apex and their
   bases on one line have the SAME height ⊥h, so the ratio of their areas
   is the ratio of their bases. Her method, never shortened (her habit
   15): the FULL ½ · basis · ⊥h for both triangles first, then the ½ and
   the ⊥h struck through, then the base ratio, then the reason.

   Each question is three steps and the card:
     1  build  Opp Δ ABC / Opp Δ ACD = ½ · ☐ · ⊥h / ½ · ☐ · ⊥h
     2  build  strike the ½ and the ⊥h: ☐ / ☐ is what is left
     3  pick   the reason, her p.43 line VERBATIM
     card      the three-fraction chain, the ½ and ⊥h struck through
   Q5 is a single Ja / Nee: two triangles that share an ANGLE, not a
   height (the next round's tool).

   The sketches are TO SCALE: sharedHeight() computes the middle base
   point and the foot of the height from the coordinates, so the dotted ⊥h
   really is perpendicular. tools/check-ewe-marker.mjs checks every sketch
   for accidental equal lengths and equal products, then proves the area
   marker against areas measured from these very coordinates.

   Content shape: the same as ew1 and ew2 (read by js/ewe.js), plus the
   opt-in keys this round adds:
     build  { …, frame }        the step's own frame (the pad's contract);
                                the fill is as long as its boxes
            spec { mode: "area", seg, tris }   js/ewe-core.js markArea
            hints { order, shared, repeat, crossed, pattern }   one plain
                                sentence per wrong reason
     write  { area: { tris, bases }, reason, tip }   the three-fraction card
   ============================================================ */
import { sharedHeight, cutTriangle, SLOT, HALF, PERP_H } from "../ewe-core.js";

/* her p.43 line, letter for letter; the card adds the brackets */
const REASON = "gemeenskaplike hoogte ⊥ en lyn";

const CLICK = "Klik op 'n stuk om dit in die blokkie te sit wat gloei.";

/* hints shared by the two build steps of one question */
function commonHints(T, shared) {
  return {
    shared: `${shared} is die sy wat hulle DEEL. Dit is nie 'n basis nie.`,
    repeat: "Jy het dieselfde stuk bo en onder gebruik. Dan sê die breuk niks nie. Elke Δ het 'n ander basis.",
    pattern: `Die basis is die sy van 'n Δ wat op die lyn ${T.names.BD} lê, die lyn waarop die ⊥h val. Soek dié sy vir elke Δ.`,
  };
}

/* Step 1: the FULL form. Six chips: the three base-line pieces and the
   three sides from the apex (the shared side among them, the decoy). */
function fullStep(T, bases, shared) {
  const n = T.names, [t1, t2] = T.tris;
  return {
    type: "build",
    prompt: `Skryf eers elke oppervlakte voluit as ½ · basis · ⊥h. Watter basis kom in elke blokkie? ${CLICK}`,
    frame: [
      { n: [{ t: `Opp Δ ${t1}`, tint: 1 }], d: [{ t: `Opp Δ ${t2}`, tint: 2 }] }, "=",
      { n: [HALF, "·", SLOT, "·", PERP_H], d: [HALF, "·", SLOT, "·", PERP_H] },
    ],
    chips: [n.BC, n.CD, n.AC, n.AB, n.AD, n.BD],
    spec: { mode: "area", seg: T.seg, tris: T.tris },
    answer: bases,
    hints: {
      ...commonHints(T, shared),
      order: "Kyk watter Δ staan bo. Die basis van daardie Δ kom bo.",
    },
  };
}

/* Step 2: the cross-out. Five chips: the two bases, the shared side, and
   the two struck factors ½ and ⊥h (ordinary chips to the pad). */
function crossStep(T, bases, shared) {
  return {
    type: "build",
    prompt: "Die ½ en die ⊥h staan bo en onder, dus trek jy hulle dood. Wat bly oor?",
    frame: [{ n: [SLOT], d: [SLOT] }],
    chips: [bases[0], bases[1], shared, HALF, PERP_H],
    spec: { mode: "area", seg: T.seg, tris: T.tris },
    answer: bases,
    hints: {
      ...commonHints(T, shared),
      crossed: "Die ½ en die ⊥h is doodgetrek. Hulle bly nie oor nie.",
      order: "Kyk watter Δ staan bo. Wat bo was, bly bo.",
    },
  };
}

/* Step 3: the reason. The right one is her p.43 line; the other three are
   real reasons that do not fit here, one idea per hint. */
function reasonStep(T) {
  return {
    type: "pick",
    prompt: "Watter rede skryf jy langs hierdie lyn?",
    options: [
      { text: REASON, correct: true },
      { text: "lyn ∥ een sy v. Δ",
        hint: "Daar is geen ∥ lyn in hierdie skets nie." },
      { text: "uit |||",
        hint: "Niemand het gelykvormige Δe genoem nie. Hier deel die Δe 'n hoogte." },
      { text: "gemeenskaplike hoek, ½ab·sin C",
        hint: "Daardie gereedskap is vir twee Δe wat 'n HOEK deel. Hier deel hulle 'n HOOGTE. Dit kom in die volgende rondte." },
    ],
    okLine: `Albei Δe het die hoekpunt ${T.apex}, en albei basisse lê op die lyn ${T.names.BD}. Een ⊥h werk vir albei.`,
  };
}

/* one full-chain question */
function chain(id, T, { bases, shared, intro, tip }) {
  return {
    id, intro, sketch: T.sketch,
    steps: [fullStep(T, bases, shared), crossStep(T, bases, shared), reasonStep(T)],
    write: { area: { tris: T.tris, bases }, reason: REASON, tip },
  };
}

/* ---------------- the sketches ----------------
   Coordinates are screen units (y down); js/ewe-kit.js fits them to the
   canvas. s is where the middle base point sits, from the first end.
   Fresh letters each. */
/* Q1: her p.42 ③ sketch. A on top, base B, C, D */
const T1 = sharedHeight({ apex: "A", base: ["B", "C", "D"], s: 0.375, tris: ["ABC", "ACD"],
  xy: { A: { x: 190, y: 30 }, B: { x: 20, y: 200 }, D: { x: 300, y: 200 } } });
/* Q2: the apex P BELOW the base line K, L, M */
const T2 = sharedHeight({ apex: "P", base: ["K", "L", "M"], s: 0.5636, tris: ["PKL", "PLM"],
  xy: { P: { x: 110, y: 215 }, K: { x: 25, y: 40 }, M: { x: 300, y: 40 } } });
/* Q3: named the OTHER way round: Opp Δ QST over Opp Δ QRS */
const T3 = sharedHeight({ apex: "Q", base: ["R", "S", "T"], s: 0.645, tris: ["QST", "QRS"],
  xy: { Q: { x: 88, y: 22 }, R: { x: 22, y: 195 }, T: { x: 298, y: 195 } } });
/* Q4: the small Δ over the WHOLE: Opp Δ HEF over Opp Δ HEG */
const T4 = sharedHeight({ apex: "H", base: ["E", "F", "G"], s: 0.426, tris: ["HEF", "HEG"],
  xy: { H: { x: 225, y: 28 }, E: { x: 25, y: 200 }, G: { x: 295, y: 200 } } });
/* Q5: ew1 Q5's sketch kind: Δ ADE inside Δ ABC, D on AB, E on AC, the
   line DE NOT parallel (t2 differs), so no ∥ arrows. The two triangles it
   asks about are tinted. */
const T5base = cutTriangle({ corner: "A", ends: ["B", "C"], cuts: ["D", "E"], t: 0.42, t2: 0.6,
  xy: { A: { x: 135, y: 20 }, B: { x: 25, y: 205 }, C: { x: 295, y: 190 } } });
const T5 = { ...T5base, sketch: { ...T5base.sketch, tints: [["A", "D", "E"], ["A", "B", "C"]] } };

export const round = {
  id: "ew3",
  kind: "ewe",
  accent: "#7048e8",
  title: { en: "Deel 'n sy", af: "Deel 'n sy" },
  blurb: { en: "Twee Δe met dieselfde ⊥h. Skryf ½ · basis · ⊥h voluit, trek dood en kies die rede.",
           af: "Twee Δe met dieselfde ⊥h. Skryf ½ · basis · ⊥h voluit, trek dood en kies die rede." },
  takeaway: {
    text: "Twee Δe met dieselfde ⊥h: hul oppervlaktes staan in dieselfde verhouding as hul basisse. Skryf eers die volle ½ · basis · ⊥h, trek dan dood.",
    area: { tris: T1.tris, bases: [T1.names.BC, T1.names.CD] },
    reason: REASON,
  },
  eweQuestions: [
    chain("ew3q1", T1, {
      bases: [T1.names.BC, T1.names.CD], shared: T1.names.AC,
      intro: "Δ ABC en Δ ACD deel die sy AC. Die stippellyn van A af is die ⊥h van albei. Bepaal Opp Δ ABC oor Opp Δ ACD.",
      tip: "Skryf altyd eers die volle ½ · basis · ⊥h vir albei Δe. Trek dan dood.",
    }),
    chain("ew3q2", T2, {
      bases: [T2.names.BC, T2.names.CD], shared: T2.names.AC,
      intro: "Hierdie keer is die hoekpunt P onder die lyn. Die ⊥h loop steeds van P af tot by die lyn KM. Bepaal Opp Δ PKL oor Opp Δ PLM.",
      tip: "Bo of onder die lyn: die ⊥h loop van die hoekpunt af tot by die basislyn.",
    }),
    chain("ew3q3", T3, {
      bases: [T3.names.CD, T3.names.BC], shared: T3.names.AC,
      intro: "Pasop met die volgorde: hierdie vraag noem Δ QST eerste. Bepaal Opp Δ QST oor Opp Δ QRS.",
      tip: "Die name bepaal die volgorde: die eerste Δ se basis kom bo.",
    }),
    chain("ew3q4", T4, {
      bases: [T4.names.BC, T4.names.BD], shared: T4.names.AB,
      intro: "Nou lê Δ HEF binne-in Δ HEG. Hulle deel die sy HE. Bepaal Opp Δ HEF oor Opp Δ HEG.",
      tip: "Die hele basis EG is hier reg, want dit is die basis van Δ HEG.",
    }),
    {
      id: "ew3q5",
      intro: "In Δ ABC lê D op AB en E op AC. Daar is geen ∥ pyltjies nie. Kyk na Opp Δ ADE en Opp Δ ABC.",
      sketch: T5.sketch,
      steps: [{
        type: "pick",
        layout: "yesno",
        prompt: "Mag jy hier ½ · basis · ⊥h met dieselfde ⊥h gebruik?",
        options: [
          { text: "Ja", hint: "Kyk na die basisse DE en BC. Hulle lê nie op een lyn nie, dus is die ⊥h van A af nie dieselfde nie." },
          { text: "Nee", correct: true },
        ],
        okLine: "Nee. Δ ADE en Δ ABC deel die HOEK by A, nie 'n hoogte nie.",
      }],
      write: { text: "Twee Δe wat net 'n HOEK deel, het nie dieselfde ⊥h nie. Daarvoor is daar 'n ander gereedskap: dit kom in die volgende rondte.",
               tip: "Eers een ⊥h vir albei, dan ½ · basis · ⊥h." },
    },
  ],
};

/* for tools/check-ewe-marker.mjs: the sketch behind each question, so the
   oracle can measure real lengths and areas from the very coordinates
   drawn */
export const SKETCHES = { ew3q1: T1, ew3q2: T2, ew3q3: T3, ew3q4: T4, ew3q5: T5 };
