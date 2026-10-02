/* ============================================================
   ew4 · "Deel 'n hoek"   (Eweredigheid, group g9)
   ------------------------------------------------------------
   The fourth Gr12 Eweredigheid mini round (EWEREDIGHEID-PLAN.md,
   kept local). AFRIKAANS ONLY, exactly like ew1 to ew3: every
   learner-facing string is plain Afrikaans; `title` and `blurb` carry
   the same Afrikaans twice (see the note in ewe1-watter-sye.js).

   The area ratio from a shared ANGLE, her p.44 example and her habits
   15 and 16. Two triangles that share one angle: write the FULL
   ½ · a · b · sin for both, strike the ½ and the sine through, and what
   is left is the PRODUCT of the two sides that touch the shared angle,
   top over bottom. The reason is her one word for a shared angle,
   "gemeen", with the angle named: "Â gemeen".

   Each question is four steps and the card:
     1  pick   which angle do the two triangles share? Her star appears
               at that corner on the sketch once it is found
     2  build  Opp Δ ADE / Opp Δ ABC = ½ · ☐ · ☐ · sin Â / ½ · ☐ · ☐ · sin Â
     3  build  strike the ½ and the sin Â: ☐ · ☐ / ☐ · ☐ is what is left
     4  pick   the reason, "Â gemeen"
     card      the three-fraction chain, the ½ and sin Â struck through,
               the two products inside the last fraction
   Q5 is a single Ja / Nee: two triangles that share a HEIGHT, not an
   angle (the previous round's tool).

   The sketches are TO SCALE: sharedAngle() computes the cut points from
   t and t2, which always differ by at least 0.15, so the cut line is
   never ∥ (and no ∥ arrows are drawn, ever). tools/check-ewe-marker.mjs
   checks every sketch for accidental equal lengths and equal products,
   then proves the product marker against areas measured from these very
   coordinates.

   Content shape: the same as ew3 (read by js/ewe.js), plus the opt-in
   keys this round adds:
     pick   { …, sketchAfter }   the sketch to show once the step is
                                 answered right (her star)
     build  spec { mode: "sine", seg, tris, at }   js/ewe-core.js markSine
            hints { third, order, mixed, repeat, crossed, pattern }   one
                                 plain sentence per wrong reason; "{chip}"
                                 becomes the chip the marker named
     write  { sine: { tris, tints, top, bot, sin }, reason, tip }   the
                                 three-fraction card
   ============================================================ */
import { sharedAngle, sharedHeight, hat, SLOT, HALF } from "../ewe-core.js";

/* her one word for a shared angle (her reasons table: "gemeen"), with the
   angle named, as in her "Ĉ = Ĉ (gemeen)"; the card adds the brackets */
const reasonOf = S => `${hat(S.corner)} gemeen`;

const CLICK = "Klik op 'n stuk om dit in die blokkie te sit wat gloei.";

/* Strings the player shows WITHOUT its no-break glue (hints, okLines, the
   card's text and tip, the map card, the end screen): a product
   "½ · a · b" and a "sin Â" must not break over two lines, so they carry
   their own no-break spaces. */
const nb = s => s.replace(/ · /g, "\u00A0·\u00A0").replace(/\bsin /g, "sin\u00A0");

/* Step 1: which angle is shared? The right corner, the two other corners
   of the whole Δ and one cut point; each wrong one sits in ONE Δ only. */
function anglePick(S) {
  const V = S.corner;
  const small = S.tris[S.tints.indexOf(1)], whole = S.tris[S.tints.indexOf(2)];
  const only = (P, inT, notT) => ({ text: hat(P), hint: `${hat(P)} sit net in Δ ${inT}. Δ ${notT} het nie 'n hoek by ${P} nie.` });
  return {
    type: "pick",
    prompt: "Albei Δe het een hoek in gemeen. Watter hoek is dit?",
    options: [
      { text: hat(V), correct: true },
      only(S.ends[0], whole, small),
      only(S.ends[1], whole, small),
      only(S.cuts[0], small, whole),
    ],
    okLine: `Albei Δe se twee sye kom by ${V} bymekaar. ${hat(V)} is gemeen, dit is die hoek wat in die sin kom.`,
    sketchAfter: S.sketchStar,
  };
}

/* the sine in a frame: a text cell with an angle hat (the frame gives it a
   little room under a fraction bar, js/ewe-kit.js fxCell) */
const sinCell = S => ({ t: S.sin, hat: true });

/* the two named triangles, each word in its triangle's tint */
const named = S => ({ n: [{ t: `Opp Δ ${S.tris[0]}`, tint: S.tints[0] }], d: [{ t: `Opp Δ ${S.tris[1]}`, tint: S.tints[1] }] });

/* hints shared by the two build steps of one question */
function commonHints(S) {
  const V = S.corner, [t1, t2] = S.tris;
  return {
    third: `{chip} raak nie aan ${hat(V)} nie. Net die twee sye wat by ${V} bymekaarkom, kom in die formule.`,
    mixed: `Bo kom net Δ ${t1} se sye. Onder net Δ ${t2} s'n.`,
    repeat: `Jy het dieselfde stuk twee keer gebruik. Dan sê die breuk niks nie. Elke Δ het sy eie twee sye by ${V}.`,
    pattern: `Kies vir elke Δ die twee sye wat by ${V} bymekaarkom: Δ ${t1} s'n bo, Δ ${t2} s'n onder.`,
  };
}

/* Step 2: the FULL form, two boxes in each product. Six chips: the four
   sides at the shared angle and the two third sides (the decoys). */
function fullStep(S) {
  return {
    type: "build",
    prompt: `Skryf eers elke oppervlakte voluit as ½ · a · b · ${S.sin}. Watter twee sye kom bo, en watter twee onder? ${CLICK}`,
    frame: [
      named(S), "=",
      { n: [HALF, "·", SLOT, "·", SLOT, "·", sinCell(S)], d: [HALF, "·", SLOT, "·", SLOT, "·", sinCell(S)] },
    ],
    chips: [...S.top, ...S.bot, ...S.third],
    spec: { mode: "sine", seg: S.seg, tris: S.tris, at: S.corner },
    answer: [...S.top, ...S.bot],
    hints: {
      ...commonHints(S),
      order: "Kyk watter Δ staan bo. Daardie Δ se twee sye kom bo.",
    },
  };
}

/* Step 3: the cross-out. Six chips: the four sides at the angle, and the
   two struck factors ½ and the sine (ordinary chips to the pad). */
function crossStep(S) {
  return {
    type: "build",
    prompt: `Die ½ en die ${S.sin} staan bo en onder, dus trek jy hulle dood. Wat bly oor?`,
    frame: [{ n: [SLOT, "·", SLOT], d: [SLOT, "·", SLOT] }],
    chips: [...S.top, ...S.bot, HALF, S.sin],
    spec: { mode: "sine", seg: S.seg, tris: S.tris, at: S.corner },
    answer: [...S.top, ...S.bot],
    hints: {
      ...commonHints(S),
      crossed: nb(`Die ½ en die ${S.sin} is doodgetrek. Hulle bly nie oor nie.`),
      order: "Kyk watter Δ staan bo. Wat bo was, bly bo.",
    },
  };
}

/* Step 4: the reason. The right one is her word "gemeen"; the other three
   are real reasons that do not fit here, one idea per hint. */
function reasonStep(S) {
  const V = hat(S.corner);
  return {
    type: "pick",
    prompt: "Watter rede skryf jy langs hierdie lyn?",
    options: [
      { text: reasonOf(S), correct: true },
      { text: "gemeenskaplike hoogte ⊥ en lyn",
        hint: "Hierdie twee Δe deel nie 'n hoogte nie. Hulle deel 'n HOEK. Dit was die vorige rondte se gereedskap." },
      { text: "lyn ∥ een sy v. Δ",
        hint: `Daar is geen ∥ lyn in hierdie skets nie. ${S.names.DE} is nie ∥ ${S.names.BC} nie.` },
      { text: "uit |||",
        hint: "Niemand het bewys dat die Δe gelykvormig is nie. Hier deel hulle net 'n hoek." },
    ],
    okLine: nb(`Een hoek, ${V}, in albei Δe. Daarom trek jy sin ${V} dood.`),
  };
}

/* one full-chain question */
function chain(id, S, { intro, tip }) {
  return {
    id, intro, sketch: S.sketch,
    steps: [anglePick(S), fullStep(S), crossStep(S), reasonStep(S)],
    write: { sine: { tris: S.tris, tints: S.tints, top: S.top, bot: S.bot, sin: S.sin }, reason: reasonOf(S), tip: nb(tip) },
  };
}

/* ---------------- the sketches ----------------
   Coordinates are screen units (y down); js/ewe-kit.js fits them to the
   canvas. t is how far along the first side the first cut point sits,
   t2 the second, both from the shared corner. Fresh letters each. */
/* Q1: A on top, B bottom left, C bottom right; D on AB, E on AC */
const S1 = sharedAngle({ corner: "A", ends: ["B", "C"], cuts: ["D", "E"], t: 0.392, t2: 0.573, tris: ["ADE", "ABC"],
  xy: { A: { x: 144, y: 35 }, B: { x: 20, y: 200 }, C: { x: 318, y: 198 } } });
/* Q2: the shared corner K at the BOTTOM LEFT, L up to the right, M
   straight to the right; P on KL, Q on KM */
const S2 = sharedAngle({ corner: "K", ends: ["L", "M"], cuts: ["P", "Q"], t: 0.563, t2: 0.409, tris: ["KPQ", "KLM"],
  xy: { K: { x: 22, y: 204 }, L: { x: 219, y: 31 }, M: { x: 309, y: 212 } } });
/* Q3: her p.44 letters. Δ RSC with Ĉ at the bottom right, R top left, S
   above C; T on RC, P on SC. Named the OTHER way round (the whole Δ
   first), and spelt as in her check line: RC, SC, TC, PC, RS, TP */
const S3 = sharedAngle({ corner: "C", ends: ["R", "S"], cuts: ["T", "P"], t: 0.576, t2: 0.4, tris: ["RSC", "TPC"],
  spell: ["RC", "SC", "TC", "PC", "RS", "TP"],
  xy: { C: { x: 294, y: 195 }, R: { x: 22, y: 55 }, S: { x: 260, y: 37 } } });
/* Q4: the overlap. F on top; J on FG, K on FH EXTENDED past H (t2 about
   1.3, the ray from F drawn through to K). Neither Δ lies inside the
   other. Foreman flag: the one to cut back to a nested sketch if it is
   too hard for the class. */
const S4 = sharedAngle({ corner: "F", ends: ["G", "H"], cuts: ["J", "K"], t: 0.471, t2: 1.302, tris: ["FJK", "FGH"],
  xy: { F: { x: 115, y: 21 }, G: { x: 20, y: 181 }, H: { x: 222, y: 160 } } });
/* Q5: ew3's sketch kind. Apex A over the base line B, C, D: Δ ABC and
   Δ ACD share a HEIGHT, not an angle (BÂC and CÂD differ). Its labels
   keep their boxes clear of their dots (labBox), like the other four. */
const T5h = sharedHeight({ apex: "A", base: ["B", "C", "D"], s: 0.58, tris: ["ABC", "ACD"],
  xy: { A: { x: 110, y: 28 }, B: { x: 22, y: 200 }, D: { x: 298, y: 200 } } });
const T5 = { ...T5h, sketch: { ...T5h.sketch, labBox: true } };

export const round = {
  id: "ew4",
  kind: "ewe",
  accent: "#0c8599",
  title: { en: "Deel 'n hoek", af: "Deel 'n hoek" },
  blurb: { en: nb("Twee Δe met een gemeenskaplike hoek. Skryf ½ · a · b · sin(hoek) voluit, trek dood en kies die rede."),
           af: nb("Twee Δe met een gemeenskaplike hoek. Skryf ½ · a · b · sin(hoek) voluit, trek dood en kies die rede.") },
  takeaway: {
    text: nb("Twee Δe met een gemeenskaplike hoek: hul oppervlaktes staan in dieselfde verhouding as die produkte van die twee sye by daardie hoek. Skryf eers die volle ½ · a · b · sin(hoek), trek dan dood."),
    sine: { tris: S1.tris, tints: S1.tints, top: S1.top, bot: S1.bot, sin: S1.sin },
    reason: reasonOf(S1),
  },
  eweQuestions: [
    chain("ew4q1", S1, {
      intro: "In die vorige rondte het die Δe 'n HOOGTE gedeel. Nou deel hulle 'n HOEK. Dan gebruik jy ½ · a · b · sin(hoek). In Δ ABC lê D op AB en E op AC. Bepaal Opp Δ ADE oor Opp Δ ABC.",
      tip: "Skryf altyd eers die volle ½ · a · b · sin Â vir albei Δe. Trek dan dood.",
    }),
    chain("ew4q2", S2, {
      intro: "Hierdie keer is die hoek wat hulle deel nie bo nie. P lê op KL en Q op KM. Bepaal Opp Δ KPQ oor Opp Δ KLM.",
      tip: "Waar die hoek ook al staan: die twee sye wat by daardie hoek bymekaarkom, kom in die formule.",
    }),
    chain("ew4q3", S3, {
      intro: "Pasop met die volgorde: hierdie vraag noem die groot Δ RSC eerste. T lê op RC en P op SC. Bepaal Opp Δ RSC oor Opp Δ TPC.",
      tip: "Die name bepaal die volgorde: die eerste Δ se twee sye kom bo.",
    }),
    chain("ew4q4", S4, {
      intro: "Nou lê K op FH verleng, verby H, en J lê op FG. Geen Δ lê binne-in die ander nie. Bepaal Opp Δ FJK oor Opp Δ FGH.",
      tip: `Net die sye wat aan ${hat("F")} raak, tel, hoe die prentjie ook al lyk.`,
    }),
    {
      id: "ew4q5",
      intro: "Δ ABC en Δ ACD deel die sy AC, en hul basisse BC en CD lê op een lyn. Kyk na Opp Δ ABC en Opp Δ ACD.",
      sketch: T5.sketch,
      steps: [{
        type: "pick",
        layout: "yesno",
        prompt: "Mag jy hier ½ · a · b · sin(hoek) met dieselfde hoek gebruik?",
        options: [
          { text: "Ja", hint: `Kyk by A: B${hat("A")}C en C${hat("A")}D is twee verskillende hoeke. Hierdie Δe deel 'n HOOGTE, nie 'n hoek nie.` },
          { text: "Nee", correct: true },
        ],
        okLine: "Nee. Δ ABC en Δ ACD deel 'n HOOGTE, nie 'n hoek nie.",
      }],
      write: { text: nb("Twee Δe wat 'n HOOGTE deel, het nie een hoek in gemeen nie. Daarvoor gebruik jy die vorige rondte se gereedskap: ½ · basis · ⊥h."),
               tip: "Vra eers: deel die Δe 'n hoogte of 'n hoek? Dan weet jy watter formule." },
    },
  ],
};

/* for tools/check-ewe-marker.mjs: the sketch behind each question, so the
   oracle can measure real lengths and areas from the very coordinates
   drawn */
export const SKETCHES = { ew4q1: S1, ew4q2: S2, ew4q3: S3, ew4q4: S4, ew4q5: T5 };
