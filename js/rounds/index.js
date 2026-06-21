/* Round registry — order, groups, and the displayed round number.
   The displayed number (n) is derived from array position, so rounds can
   be inserted anywhere and everything renumbers automatically. Each round
   also belongs to a `group`; finishing every round in a group earns its
   badge (see config.js GROUPS). */
import { round as rPartsIntro } from "./round-parts-intro.js";   // cutscene
import { round as r1 } from "./round01-parts.js";
import { round as lineCentreCut } from "./line-centre-intro.js";  // cutscene
import { round as dLine } from "./discover-line-centre.js";      // discovery
import { round as rLine } from "./reason-line-centre.js";
import { round as dPyth } from "./discover-pythagoras.js";       // discovery
import { round as r2 } from "./round02-centre-chord.js";
import { round as dCentre } from "./discover-centre-circ.js";    // discovery
import { round as r2b } from "./round02b-subtend.js";
import { round as r3 } from "./round03-centre-circumference.js";
import { round as dSemi } from "./discover-semicircle.js";       // discovery
import { round as r4 } from "./round04-semicircle.js";
import { round as subtendCut } from "./subtend-intro.js";         // cutscene
import { round as dSameSeg } from "./discover-same-segment.js";   // discovery
import { round as bowtieCut } from "./bowtie-intro.js";           // cutscene
import { round as r5 } from "./round05-same-segment.js";
import { round as dEqChord } from "./discover-equal-chords.js";   // discovery
import { round as r6 } from "./round06-equal-chords.js";
import { round as qCyclic } from "./cyclic-quad-intro.js";        // teach
import { round as dCycOpp } from "./discover-cyclic-opposite.js"; // discovery
import { round as r7 } from "./round07-cyclic-opposite.js";
import { round as dCycExt } from "./discover-cyclic-exterior.js"; // discovery
import { round as r8 } from "./round08-cyclic-exterior.js";
import { round as convIntro } from "./converse-intro.js";        // teach
import { round as eProveCyc } from "./exercise-prove-cyclic.js";
import { round as tanIntroCut } from "./tangent-intro.js";        // cutscene
import { round as tanChordCut } from "./tanchord-intro.js";       // cutscene
import { round as dTanChord } from "./discover-tangent-chord.js"; // discovery
import { round as r10 } from "./round10-tanchord.js";
import { round as dTanRad } from "./discover-tangent-radius.js";  // discovery (derived from tan-chord)
import { round as r9 } from "./round09-tangent-radius.js";
import { round as r10b } from "./round10b-tanchord-identify.js";
import { round as dTanPoint } from "./discover-tangents-point.js"; // discovery
import { round as r11 } from "./round11-tangents-point.js";
import { round as eProveTan } from "./exercise-prove-tangent.js";
import { round as r12 } from "./round12-boss.js";
import { round as r14 } from "./round14-multistep.js";
import { round as r15 } from "./round15-converse.js";
import { round as r16 } from "./round16-pick-theorem.js";
import { round as r18 } from "./round18-riders-twochord.js";
import { round as r19 } from "./round19-riders-diameter.js";
import { round as r20 } from "./round20-riders-mixed1.js";
import { round as r21 } from "./round21-riders-mixed2.js";

/* ordered play sequence (Group 1 discoveries for centre=2× and semicircle
   are added in the next build step) */
const ORDER = [
  rPartsIntro, r1,                                       // intro
  lineCentreCut, dLine, rLine, dPyth, r2,                // g1 · line from the centre (intro + discovery)
  dCentre, subtendCut, r2b, r3,                          // subtend intro (g2) now precedes r2b; then angle at the centre = 2×
  dSemi, r4,                                             // g1 · angle in a semicircle
  dSameSeg, bowtieCut, r5,                               // g2 · same segment + bowtie
  dEqChord, r6,                                          // g2 · equal chords
  qCyclic, dCycOpp, r7,                                  // g2 · cyclic quad: intro + opposite angles
  dCycExt, r8,                                           // g2 · cyclic quad: exterior angle
  convIntro, eProveCyc,                                  // g2 · converse intro + prove a cyclic quad
  tanIntroCut, tanChordCut, dTanChord, r10b, r10,        // g3 · tangent intro + tan-chord intro + identify + theorem
  dTanRad, r9,                                           // g3 · tangent ⊥ radius (derived from tan-chord)
  dTanPoint, r11,                                        // g3 · tangents from a point
  eProveTan,                                             // g3 · prove a tangent
  r12, r14, r15, r16,                                    // g4 · Circle Detective
  r18, r19, r20, r21,                                    // g5 · Circle Grand Master
];

/* group membership (intro rounds carry no badge) */
const GROUP = {
  intro: "intro", r1: "intro",
  linecentreintro: "g1", dline: "g1", rline: "g1", dpyth: "g1", r2: "g1", dcentre: "g1", r2b: "g1", r3: "g1", dsemi: "g1", r4: "g1",
  subtend: "g2", dsameseg: "g2", bowtie: "g2", r5: "g2", deqchord: "g2", r6: "g2", qcyclic: "g2", dcycopp: "g2", r7: "g2", dcycext: "g2", r8: "g2", convintro: "g2", eprovecyc: "g2",
  tanintro: "g3", tanchordintro: "g3", dtanchord: "g3", r10: "g3", r10b: "g3", dtanrad: "g3", r9: "g3", dtanpoint: "g3", r11: "g3", eprovetan: "g3",
  r12: "g4", r14: "g4", r15: "g4", r16: "g4",
  r18: "g5", r19: "g5", r20: "g5", r21: "g5",
};

export const ROUNDS = ORDER.map((r, i) => {
  r.n = i + 1;
  if (!r.group) r.group = GROUP[r.id] || "intro";
  return r;
});
export const ROUND_BY_ID = Object.fromEntries(ROUNDS.map(r => [r.id, r]));
