/* ============================================================
   ew5 · "Watter een is dit?"   (Eweredigheid, group g9)
   ------------------------------------------------------------
   The fifth Gr12 Eweredigheid mini round (EWEREDIGHEID-PLAN.md,
   kept local). AFRIKAANS ONLY, exactly like ew1 to ew4: every
   learner-facing string is plain Afrikaans; `title` and `blurb` carry
   the same Afrikaans twice (see the note in ewe1-watter-sye.js).

   ew3 taught the shared-HEIGHT tool and ew4 the shared-ANGLE tool. Here
   the learner gets only the sketch and the two names, the two kinds
   mixed, and picks (1) the tool and (2) the FIRST LINE, the full form for
   both triangles (her rule 15: ½ · basis · ⊥h, or ½ · a · b · sin(hoek),
   never shortened). No boxes, no chips, no pad: every step is a pick.

   Each question is two steps and the card:
     1  pick   "Deel 'n sy" (a shared height) or "Deel 'n hoek" (a shared
               angle), each with its formula on a small second line. The
               sketch is bare until this is right; then (sketchAfter) the
               height kind shows the dotted ⊥h with its box, the angle kind
               the arc and her star
     2  pick   the first line: four stacked fractions in a 2 x 2 grid
               (grid: 2); the lead line Opp Δ … over Opp Δ … = ☐ above
               them fills with the right one
     card      the three-fraction chain of ew3 (area) or ew4 (sine), with
               the reason in brackets

   The sketches are the ew3 and ew4 builders, as they are (the question
   shows them bare first, see `bare` below): sharedHeight()
   (ONLY the adjacent case: the whole-over-part case shares the height AND
   the angle, so both tools would be right) and sharedAngle() (the cut
   line never ∥). To scale from coordinates. tools/check-ewe-marker.mjs
   checks every sketch for accidental equal lengths and products, decides
   the kind from the coordinates, and evaluates EVERY step-2 option against
   the shoelace area ratio: exactly one may be true, the marked one.

   Content shape: the same as ew1 to ew4 (read by js/ewe.js), plus the
   opt-in keys this round adds:
     pick   { …, grid: 2 }      the options in a 2 x 2 grid
            { …, keepSketch: true }   brought in like a build step: the
                                 sketch stays at the top, the options on
                                 screen under it (not centred)
            { …, lead: { n:[cells], d:[cells] } }   the fixed fraction, "="
                                 and one glowing box above the options; the
                                 box becomes the chosen option's fraction
            options [{ text, sub }]    a second, smaller line (the formula)
            options [{ text, frac: { n:[cells], d:[cells] } }]   the option
                                 drawn as ONE stacked fraction through the
                                 frame cell renderer; text = its aria-label
   ============================================================ */
import { sharedAngle, sharedHeight, hat, sinOf, HALF, PERP_H } from "../ewe-core.js";

const REASON_H = "gemeenskaplike hoogte ⊥ en lyn";
const REASON_A = "gemene hoekpunt";

/* Strings the player shows WITHOUT its no-break glue (hints, okLines, the
   option sub-lines, the card's tip, the end screen): a product "½ · a · b"
   and a "sin Â" must not break over two lines (the ew4 rule). */
const nb = s => s.replace(/ · /g, " · ").replace(/\bsin /g, "sin ");

/* the two tools, natural order, never shuffled (layout "yesno") */
const TOOL_H = "Deel 'n sy", TOOL_A = "Deel 'n hoek";
const SUB_H = nb("½ · basis · ⊥h"), SUB_A = nb("½ · a · b · sin(hoek)");

/* a fraction option's plain words (its aria-label): "½ · BC · ⊥h oor ½ · CD · ⊥h" */
const word = c => (typeof c === "object" ? c.t : c);
const plain = f => `${f.n.map(word).join(" ")} oor ${f.d.map(word).join(" ")}`;
const fracOpt = (f, extra) => ({ text: plain(f), frac: f, ...extra });
const swap = f => ({ n: f.d, d: f.n });

/* the lead line: the two named triangles, each word in its tint */
const lead = (tris, tints) => ({ n: [{ t: `Opp Δ ${tris[0]}`, tint: tints[0] }], d: [{ t: `Opp Δ ${tris[1]}`, tint: tints[1] }] });

/* Foreman review 2026-10-02, her standing rule: the picture must not give
   the answer away. Before step 1 is answered the sketch is BARE: points,
   lines, labels and the two tints only. The builder's sketch without its
   `height` (no dotted ⊥h, no right-angle box) or its `angle` (no arc, no
   star). The right tool brings the tool's mark through step 1's
   sketchAfter: the ⊥h with its box (ew3's drawing) or the arc with her
   star (ew4's). sharedHeight and sharedAngle themselves are untouched. */
const bare = (sk, key) => { const { [key]: _drop, ...rest } = sk; return rest; };

const PROMPT_1 = "Deel hierdie twee Δe 'n HOOGTE of 'n HOEK?";
const PROMPT_2 = "Watter eerste lyn skryf jy?";

/* ---------------- the HEIGHT kind (ew3's sketch) ---------------- */
function heightQ(id, T, intro) {
  const A = T.apex, n = T.names, tris = T.tris;
  /* each named Δ's base: the base-line piece whose two ends are its corners */
  const baseOf = t => [n.BC, n.CD].find(b => [...b].every(k => t.includes(k)));
  const [b1, b2] = tris.map(baseOf);
  /* the angle at the apex inside each named Δ, e.g. N M̂ P */
  const angOf = b => `${b[0]}${hat(A)}${b[1]}`;
  const [g1, g2] = [b1, b2].map(angOf);
  const sidesAt = b => [A + b[0], A + b[1]];
  const SIN = { t: sinOf(A), hat: true };
  const right = { n: [HALF, "·", b1, "·", PERP_H], d: [HALF, "·", b2, "·", PERP_H] };
  const [s1, s2] = [sidesAt(b1), sidesAt(b2)];
  const tool = { n: [HALF, "·", s1[0], "·", s1[1], "·", SIN], d: [HALF, "·", s2[0], "·", s2[1], "·", SIN] };
  const shared = { n: [HALF, "·", n.AC, "·", PERP_H], d: [HALF, "·", b2, "·", PERP_H] };
  return {
    id, intro, sketch: bare(T.sketch, "height"),
    steps: [
      {
        type: "pick",
        layout: "yesno",
        prompt: PROMPT_1,
        options: [
          { text: TOOL_H, sub: SUB_H, correct: true },
          { text: TOOL_A, sub: SUB_A,
            hint: `Kyk by ${A}: ${g1} en ${g2} is twee verskillende hoeke. Maar die basisse ${b1} en ${b2} lê op EEN lyn, en die hoogte van ${A} af is dieselfde vir albei. Dit is 'n HOOGTE wat hulle deel.` },
        ],
        okLine: nb(`Ja: die basisse ${b1} en ${b2} lê op een lyn, en die hoogte van ${A} af is dieselfde. Deel 'n sy.`),
        sketchAfter: T.sketch,
      },
      {
        type: "pick",
        prompt: PROMPT_2,
        grid: 2,
        keepSketch: true,
        lead: lead(tris, [1, 2]),
        options: [
          fracOpt(right, { correct: true }),
          fracOpt(tool, { hint: nb(`Dit is die sin-vorm, maar ${g1} en ${g2} is nie dieselfde hoek nie. Jy het pas gesê hulle deel 'n HOOGTE: skryf ½ · basis · ⊥h.`) }),
          fracOpt(swap(right), { hint: `Kyk watter Δ staan bo. Δ ${tris[0]} se basis ${b1} kom bo.` }),
          fracOpt(shared, { hint: `${n.AC} is die sy wat hulle DEEL. Dit is nie 'n basis nie. Die basisse lê op die lyn ${n.BD}.` }),
        ],
        okLine: nb("Volle vorm eers: ½ · basis · ⊥h vir albei. Trek dan die ½ en die ⊥h dood, die basisse bly oor."),
      },
    ],
    write: { area: { tris, bases: [b1, b2] }, reason: REASON_H, tip: "Hoogte gedeel: die basisse bly oor." },
  };
}

/* ---------------- the ANGLE kind (ew4's sketch) ---------------- */
function angleQ(id, S, intro) {
  const V = S.corner, H = hat(V), tris = S.tris;
  /* each named Δ's third side: the one that does not touch the corner */
  const thirdOf = t => S.third.find(x => [...x].every(k => t.includes(k)));
  const [d1, d2] = tris.map(thirdOf);
  const SIN = { t: S.sin, hat: true };
  const right = { n: [HALF, "·", S.top[0], "·", S.top[1], "·", SIN], d: [HALF, "·", S.bot[0], "·", S.bot[1], "·", SIN] };
  const tool = { n: [HALF, "·", d1, "·", PERP_H], d: [HALF, "·", d2, "·", PERP_H] };
  const third = { n: [HALF, "·", S.top[0], "·", d1, "·", SIN], d: right.d };
  return {
    id, intro, sketch: bare(S.sketch, "angle"),
    steps: [
      {
        type: "pick",
        layout: "yesno",
        prompt: PROMPT_1,
        options: [
          { text: TOOL_H, sub: SUB_H,
            hint: `${d1} lê nie op dieselfde lyn as ${d2} nie, dus is daar nie een hoogte vir albei Δe nie. Maar albei Δe het ${H}. Dit is 'n HOEK wat hulle deel.` },
          { text: TOOL_A, sub: SUB_A, correct: true },
        ],
        okLine: nb(`Ja: albei Δe het ${H}, en ${d1} lê nie op ${d2} se lyn nie. Deel 'n hoek.`),
        sketchAfter: S.sketchStar,
      },
      {
        type: "pick",
        prompt: PROMPT_2,
        grid: 2,
        keepSketch: true,
        lead: lead(tris, S.tints),
        options: [
          fracOpt(right, { correct: true }),
          fracOpt(tool, { hint: nb(`Dit is die hoogte-vorm, maar ${d1} en ${d2} lê nie op een lyn nie, dus is daar nie een ⊥h vir albei nie. Jy het pas gesê hulle deel 'n HOEK: skryf ½ · a · b · sin ${H}.`) }),
          fracOpt(swap(right), { hint: "Kyk watter Δ staan bo. Daardie Δ se twee sye kom bo." }),
          fracOpt(third, { hint: `${d1} raak nie aan ${H} nie. Net die twee sye wat by ${V} bymekaarkom, kom in die formule.` }),
        ],
        okLine: nb(`Volle vorm eers: ½ · a · b · sin ${H} vir albei. Trek dan die ½ en die sin ${H} dood, die produkte bly oor.`),
      },
    ],
    write: { sine: { tris, tints: S.tints, top: S.top, bot: S.bot, sin: S.sin }, reason: REASON_A, tip: "Hoek gedeel: die produkte bly oor." },
  };
}

/* ---------------- the sketches ----------------
   Coordinates are screen units (y down); js/ewe-kit.js fits them to the
   canvas. Fresh letters each. A height sketch keeps its label BOXES clear
   of their dots (labBox), like every ew4 sketch. */
const boxed = T => ({ ...T, sketch: { ...T.sketch, labBox: true } });
/* Q1 HEIGHT: apex M on top, base N, P, Q */
const T1 = boxed(sharedHeight({ apex: "M", base: ["N", "P", "Q"], s: 0.6, tris: ["MNP", "MPQ"],
  xy: { M: { x: 120, y: 30 }, N: { x: 20, y: 200 }, Q: { x: 300, y: 200 } } }));
/* Q2 ANGLE: corner G on top, H bottom left, J bottom right; K on GH, L on GJ */
const S2 = sharedAngle({ corner: "G", ends: ["H", "J"], cuts: ["K", "L"], t: 0.476, t2: 0.632, tris: ["GKL", "GHJ"],
  xy: { G: { x: 150, y: 30 }, H: { x: 22, y: 200 }, J: { x: 310, y: 196 } } });
/* Q3 HEIGHT: apex W BELOW the base line R, S, T (ew3 Q2's kind) */
const T3 = boxed(sharedHeight({ apex: "W", base: ["R", "S", "T"], s: 0.42, tris: ["WRS", "WST"],
  xy: { W: { x: 200, y: 215 }, R: { x: 25, y: 40 }, T: { x: 300, y: 40 } } }));
/* Q4 ANGLE: the shared corner B at the BOTTOM LEFT, C up to the right, D
   straight right; E on BC, F on BD (ew4 Q2's kind) */
const S4 = sharedAngle({ corner: "B", ends: ["C", "D"], cuts: ["E", "F"], t: 0.57, t2: 0.376, tris: ["BEF", "BCD"],
  xy: { B: { x: 22, y: 206 }, C: { x: 225, y: 35 }, D: { x: 312, y: 210 } } });
/* Q5 ANGLE: the overlap (ew4 Q4's kind). P on top; S on PQ, T on PR
   EXTENDED past R, the ray from P drawn through to T */
const S5 = sharedAngle({ corner: "P", ends: ["Q", "R"], cuts: ["S", "T"], t: 0.46, t2: 1.292, tris: ["PST", "PQR"],
  xy: { P: { x: 118, y: 22 }, Q: { x: 22, y: 178 }, R: { x: 222, y: 165 } } });
/* Q6 HEIGHT: apex V on top, base X, Y, Z; named the OTHER way round, the
   right Δ first */
const T6 = boxed(sharedHeight({ apex: "V", base: ["X", "Y", "Z"], s: 0.45, tris: ["VYZ", "VXY"],
  xy: { V: { x: 205, y: 28 }, X: { x: 22, y: 198 }, Z: { x: 298, y: 198 } } }));

export const round = {
  id: "ew5",
  kind: "ewe",
  accent: "#d9480f",
  title: { en: "Watter een is dit?", af: "Watter een is dit?" },
  blurb: { en: "Net die skets. Deel die Δe 'n hoogte of 'n hoek? Kies die gereedskap en die eerste lyn.",
           af: "Net die skets. Deel die Δe 'n hoogte of 'n hoek? Kies die gereedskap en die eerste lyn." },
  takeaway: {
    text: nb("Vra eers: deel die Δe 'n HOOGTE of 'n HOEK? Hoogte: ½ · basis · ⊥h, die basisse bly oor. Hoek: ½ · a · b · sin(hoek), die produkte bly oor."),
    area: { tris: T1.tris, bases: [T1.names.BC, T1.names.CD] },
    reason: REASON_H,
  },
  eweQuestions: [
    heightQ("ew5q1", T1,
      "Deel 'n sy: die Δe deel 'n HOOGTE, hul basisse lê op een lyn. Deel 'n hoek: die Δe deel 'n HOEK. Nou kry jy net die skets. Kyk eers: hoogte of hoek?"),
    angleQ("ew5q2", S2,
      "K lê op GH en L lê op GJ. Kyk na Opp Δ GKL en Opp Δ GHJ."),
    heightQ("ew5q3", T3,
      "Hierdie keer lê W onder die punte R, S en T. Kyk na Opp Δ WRS en Opp Δ WST."),
    angleQ("ew5q4", S4,
      "Nou staan B links onder. E lê op BC en F lê op BD. Kyk na Opp Δ BEF en Opp Δ BCD."),
    angleQ("ew5q5", S5,
      "S lê op PQ, en T lê op PR verleng, verby R. Kyk na Opp Δ PST en Opp Δ PQR."),
    heightQ("ew5q6", T6,
      "Pasop met die volgorde: hierdie vraag noem Δ VYZ eerste. Kyk na Opp Δ VYZ en Opp Δ VXY."),
  ],
};

/* for tools/check-ewe-marker.mjs: the sketch behind each question, so the
   oracle can measure real lengths and areas from the very coordinates
   drawn */
export const SKETCHES = { ew5q1: T1, ew5q2: S2, ew5q3: T3, ew5q4: S4, ew5q5: S5, ew5q6: T6 };
