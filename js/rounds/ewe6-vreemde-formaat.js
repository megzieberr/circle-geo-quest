/* ============================================================
   ew6 · "Vreemde formaat"   (Eweredigheid, group g9)
   ------------------------------------------------------------
   The sixth Gr12 Eweredigheid mini round (EWEREDIGHEID-PLAN.md,
   kept local). AFRIKAANS ONLY, exactly like ew1 to ew5: every
   learner-facing string is plain Afrikaans; `title` and `blurb` carry
   the same Afrikaans twice (see the note in ewe1-watter-sye.js).

   The exam says "Bewys dat AD² = BD · DC", and that line does not look
   like a ratio. Her habit (her Metode-nota): write the square as a side
   times itself, AD · AD = BD · DC, then as two fractions AD/BD = DC/AD.
   Reading the triangles off the fractions is the NEXT round's job; this
   one drills the rewrite only, letters in, letters out. The second form
   has no square: KL · KM = KN · LM becomes KL/KN = LM/KM.

   A SQUARE question is two builds and the card:
     1  build  ☐ · ☐ = ☐ · ☐   the square written out (spec.mode "prod")
     2  build  ☐/☐ = ☐/☐       the two fractions (spec.mode "cross")
     card      the given line, the square written out, the fractions
   A NO-SQUARE question (Q3, Q5) is step 2 and the card only.

   The chips are the letters of the given line, one spelling per side (her
   ruling 2, 29 Sep), and ONE decoy side from the figure that is not in the
   line, so the learner reads the line. A square question has the squared
   side once in the bank and must tap it twice: that IS the lesson.

   The sketch is the exam's figure, bare: a right-angled Δ with the height
   from the right angle onto the hypotenuse, a right-angle box at the right
   angle and one at the foot (rightAltitude in js/ewe-core.js, the right
   angle COMPUTED from h = sqrt(BD · DC)). Nothing in the steps needs it.
   tools/check-ewe-marker.mjs proves every given line true in its own
   figure, every figure generic, and both markers against lengths measured
   from these very coordinates, over every fill.

   Content shape: the same as ew4 (read by js/ewe.js), plus the opt-in
   keys this round adds:
     build  spec { mode: "prod" | "cross", pairs, chips }   js/ewe-core.js
                                 markProd / markCross; pairs are the two
                                 products of the line, the square [AD, AD]
            hints { twice, mixed, once, same, repeat, decoy, pattern }   one
                                 plain sentence per wrong reason; "{chip}"
                                 becomes the decoy the marker named; the
                                 pattern hint is { text, template: { kind:
                                 "prod" | "frac", left, right } }, in words
            okLine               the build step's takeaway, under its ✓ line
     write  { cross: { pairs, fill }, tip }   the two- or three-line card;
                                 the player puts the learner's own fill in
   ============================================================ */
import { rightAltitude, SLOT } from "../ewe-core.js";

/* Strings the player shows (hints, okLines, the card's tip, the end
   screen, the map card) carry their own no-break glue: a product "BD · DC"
   and a short line "AD² = BD · DC" must not break over two lines (the ew4
   rule, and its "=" too). */
const nb = s => s.replace(/ · /g, " · ").replace(/ = /g, " = ");

/* the step-1 frame: plain cells and "=", like ew4's frames */
const PROD_FRAME = [[SLOT, "·", SLOT], "=", [SLOT, "·", SLOT]];

/* the pattern hints' templates, in words (the plan's wording) */
const TPL_PROD = { kind: "prod", left: ["kwadraat-sy", "kwadraat-sy"], right: ["die een produk-sy", "die ander produk-sy"] };
const TPL_SQ = { kind: "frac", left: ["kwadraat-sy", "produk-sy"], right: ["ander produk-sy", "kwadraat-sy"] };
const TPL_NOSQ = { kind: "frac", left: ["produk 1", "produk 2"], right: ["produk 2", "produk 1"] };
const NOSQ_TEXT = "Die twee sye van EEN produk staan kruismaal: een bo links, een onder regs. Die ander produk se sye vul die ander twee blokkies.";
const CROSS_TEXT = "Kruismaal jou breuke: bo links keer onder regs moet een produk van die lyn gee, en onder links keer bo regs die ander een.";

/* one question. `line` names the two products by their ROLES in the figure
   (AD the height, BD and DC the pieces of the hypotenuse, AB and AC the
   other two sides, BC the hypotenuse); `decoy` is one more role. */
function question(id, S, { line, decoy, intro }) {
  const pairs = line.map(p => p.map(r => S.names[r]));
  const [[L1, L2], [R1, R2]] = pairs;
  const sq = L1 === L2 ? L1 : null;
  const D = S.names[decoy];
  const given = sq ? `${sq}² = ${R1} · ${R2}` : `${L1} · ${L2} = ${R1} · ${R2}`;
  const chips = [...new Set([L1, L2, R1, R2]), D];
  const decoyHint = nb(`{chip} staan nie in die lyn nie. Gebruik net die letters van ${given}.`);
  const crossStep = {
    type: "build",
    prompt: nb(sq ? "Nou skryf jy dit as twee breuke: een links van die =, een regs."
                  : "Hier is geen kwadraat nie, dus skryf jy dit dadelik as twee breuke: een links van die =, een regs."),
    chips,
    spec: { mode: "cross", pairs, chips },
    answer: [L1, R1, R2, L2],
    hints: sq ? {
      once: nb(`${sq} staan twee keer in die lyn. Dit staan twee keer in jou breuke ook: een keer bo, een keer onder.`),
      same: nb(`${sq} oor ${sq} sê niks nie. Die twee ${sq}'s staan kruismaal: een bo links, een onder regs.`),
      decoy: decoyHint,
      pattern: { text: CROSS_TEXT, template: TPL_SQ },
    } : {
      repeat: "Elke blokkie kry 'n ander sy. Jy het een sy meer as een keer gebruik.",
      decoy: decoyHint,
      pattern: { text: NOSQ_TEXT, template: TPL_NOSQ },
    },
    okLine: nb(`Kruismaal om seker te maak: ${L1} · ${L2} = ${R1} · ${R2}. Dit is die lyn.`),
  };
  const steps = [crossStep];
  if (sq) steps.unshift({
    type: "build",
    prompt: "Skryf die kwadraat as dieselfde sy twee keer:",
    frame: PROD_FRAME,
    chips,
    spec: { mode: "prod", pairs, chips },
    answer: [sq, sq, R1, R2],
    hints: {
      twice: nb(`'n Kwadraat is dieselfde sy twee keer: ${sq}² is ${sq} · ${sq}.`),
      mixed: "Links staan die kwadraat, regs die produk. Hou die twee kante apart.",
      decoy: decoyHint,
      pattern: { text: "Skryf die lyn net oor, met die kwadraat uitgeskryf:", template: TPL_PROD },
    },
    okLine: "Nou is dit 'n gewone produk links en regs.",
  });
  return {
    id, intro: nb(intro), sketch: S.sketch,
    /* for the checker and the phone check: the given line and the decoy */
    given: { pairs, decoy: D, text: nb(given) },
    steps,
    write: {
      cross: { pairs, fill: crossStep.answer },
      tip: sq ? "Die kwadraat se letters staan kruismaal: een bo links, een onder regs. Lees later die twee Δe uit die breuke af."
              : "Die twee sye van een produk staan kruismaal: een bo links, een onder regs. Lees later die twee Δe uit die breuke af.",
    },
  };
}

/* ---------------- the sketches ----------------
   Coordinates are screen units (y down) of the two ENDS of the hypotenuse;
   rightAltitude computes the foot (t along it) and the right angle (at
   height sqrt(BD · DC) from the foot, on side ±1); js/ewe-kit.js fits them
   to the canvas. Fresh letters each; t is never 0.5. */
/* Q1: right angle A on top, hypotenuse BC flat, foot D nearer B */
const S1 = rightAltitude({ right: "A", ends: ["B", "C"], foot: "D", t: 0.36, side: -1,
  xy: { B: { x: 20, y: 200 }, C: { x: 320, y: 200 } } });
/* Q2: right angle P on top, foot S nearer R */
const S2 = rightAltitude({ right: "P", ends: ["Q", "R"], foot: "S", t: 0.63, side: -1,
  xy: { Q: { x: 20, y: 200 }, R: { x: 320, y: 200 } } });
/* Q3: right angle K on top, foot N (the area form, no square) */
const S3 = rightAltitude({ right: "K", ends: ["L", "M"], foot: "N", t: 0.42, side: -1,
  xy: { L: { x: 20, y: 200 }, M: { x: 320, y: 200 } } });
/* Q4: the figure turned: hypotenuse EG upright on the left, the right
   angle F pointing right, foot H */
const S4 = rightAltitude({ right: "F", ends: ["E", "G"], foot: "H", t: 0.39, side: -1,
  xy: { E: { x: 100, y: 20 }, G: { x: 100, y: 300 } } });
/* Q5: upside down, the right angle W at the BOTTOM, hypotenuse XY on top,
   foot Z (no square) */
const S5 = rightAltitude({ right: "W", ends: ["X", "Y"], foot: "Z", t: 0.6, side: 1,
  xy: { X: { x: 20, y: 40 }, Y: { x: 320, y: 40 } } });
/* Q6: the right angle T at the bottom, left of the middle; the hypotenuse
   SU rising to the right, foot V. The ends are named U first, so the
   pieces read UV and US as in the line */
const S6 = rightAltitude({ right: "T", ends: ["U", "S"], foot: "V", t: 0.72, side: -1,
  xy: { U: { x: 320, y: 60 }, S: { x: 20, y: 150 } } });

export const round = {
  id: "ew6",
  kind: "ewe",
  accent: "#c2255c",
  title: { en: "Vreemde formaat", af: "Vreemde formaat" },
  blurb: { en: nb("AD² = BD · DC lyk vreemd. Skryf dit as twee breuke, en dit is 'n gewone verhouding."),
           af: nb("AD² = BD · DC lyk vreemd. Skryf dit as twee breuke, en dit is 'n gewone verhouding.") },
  takeaway: {
    text: "'n Kwadraat is dieselfde sy twee keer. Skryf die produk as twee breuke: die twee sye van EEN produk staan kruismaal, een bo links en een onder regs.",
    /* Q1's card: AD² = BD · DC, AD · AD = BD · DC, AD/BD = DC/AD */
    get cross() { return round.eweQuestions[0].write.cross; },
  },
  eweQuestions: [
    question("ew6q1", S1, { line: [["AD", "AD"], ["BD", "DC"]], decoy: "AC",
      intro: "Bewys dat AD² = BD · DC. So staan dit in die eksamen. Dit lyk vreemd, maar dit is net 'n verhouding wat gekruismaal is. Skryf dit terug as twee breuke, dan sien jy watter sye jy nodig het. 'n Kwadraat is dieselfde sy twee keer." }),
    question("ew6q2", S2, { line: [["AB", "AB"], ["BD", "BC"]], decoy: "AD",
      intro: "Bewys dat PQ² = QS · QR. Hierdie keer is die kwadraat nie die hoogte nie, maar die sy PQ." }),
    question("ew6q3", S3, { line: [["AB", "AC"], ["AD", "BC"]], decoy: "BD",
      intro: "Bewys dat KL · KM = KN · LM. Hier is daar geen kwadraat nie, net twee produkte." }),
    question("ew6q4", S4, { line: [["AD", "AD"], ["BD", "DC"]], decoy: "AC",
      intro: "Bewys dat FH² = EH · HG. Die skets is gedraai, maar die reël bly dieselfde." }),
    question("ew6q5", S5, { line: [["AB", "AC"], ["AD", "BC"]], decoy: "DC",
      intro: "Bewys dat WX · WY = WZ · XY. Die Δ staan onderstebo, en weer is daar geen kwadraat nie." }),
    question("ew6q6", S6, { line: [["AB", "AB"], ["BD", "BC"]], decoy: "AD",
      intro: "Bewys dat TU² = UV · US. Lees die lyn mooi: die kwadraat is die sy TU." }),
  ],
};

/* for tools/check-ewe-marker.mjs: the figure behind each question, so the
   oracle can measure real lengths from the very coordinates drawn */
export const SKETCHES = { ew6q1: S1, ew6q2: S2, ew6q3: S3, ew6q4: S4, ew6q5: S5, ew6q6: S6 };
