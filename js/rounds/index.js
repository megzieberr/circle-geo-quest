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
import { round as pr0 } from "./proof0-why-proofs.js";           // g7 · Proof rounds (P0 built; P1-P9 arrive later)
import { round as pr1 } from "./proof1-t1-discovery.js";         // g7 · Proof rounds — T1 discovery (session 2)
import { round as pr2 } from "./proof2-t1-transfer.js";          // g7 · Proof rounds — T1 transfer (session 2)
import { round as pr3 } from "./proof3-t2-discovery.js";         // g7 · Proof rounds — T2 discovery (session 3)
import { round as pr4 } from "./proof4-t2-transfer.js";          // g7 · Proof rounds — T2 transfer (session 3)
import { round as inv1 } from "./invest01-measure.js";           // g6 · Investigation Station
import { round as inv2 } from "./invest02-conjecture.js";        // g6 · Investigation Station
import { round as inv3 } from "./invest03-break-it.js";          // g6 · Investigation Station
import { round as inv4 } from "./invest04-prove-it.js";          // g6 · Investigation Station
import { round as inv5 } from "./invest05-turn-around.js";       // g6 · Investigation Station
import { round as inv6 } from "./invest06-explain-it.js";        // g6 · Investigation Station
import { round as dailyExtra } from "./daily-extra.js";          // bonus daily bank (not in play order)
import { round as dailyRiders } from "./daily-riders.js";       // harder exam-style Daily bank (typed answers)

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
  r18, r19, r20, r21,                                    // g5 · Circle Grand Master · FINAL_QUEST_ROUND_ID = r21
  // g7 · Proof rounds (PROOF-ROUNDS-PLAN.md). P0 built this session; P1-P9
  // arrive in later sessions as a one-line addition to the import list above
  // and to this line (pr0, pr1, pr2, … pr9,) — nothing else in this file
  // needs to change for them. MUST stay AFTER r21 and BEFORE inv1: the
  // Investigation Station is hidden (stationsLive: false in config.js) and
  // its unlock chain is pinned to FINAL_QUEST_ROUND_ID (below), not to
  // whatever round happens to sit last in this array — see js/stations.js.
  pr0, pr1, pr2, pr3, pr4,
  inv1, inv2, inv3, inv4, inv5, inv6,                    // g6 · Investigation Station 🚂
];

/* The last round of the 43-round MAIN quest, pinned on purpose (Megan's
   ruling, PROOF-ROUNDS-PLAN.md build checklist item #1). Two things read
   this instead of "the last entry in MAIN_ROUNDS", because that entry moves
   every time a proof round is appended above:
     · js/game.js's end-of-quest survey trigger — the class already met the
       survey; it must fire once, on finishing the 43 rounds, and never
       again on a proof round.
     · js/stations.js's stop-1 gate — the Investigation Station's first stop
       has to keep opening on "the main quest is done", not silently start
       requiring every proof round to be passed first (which would make it
       unreachable until P9 exists, several sessions from now). */
export const FINAL_QUEST_ROUND_ID = "r21";

/* group membership (intro rounds carry no badge) */
const GROUP = {
  intro: "intro", r1: "intro",
  linecentreintro: "g1", dline: "g1", rline: "g1", dpyth: "g1", r2: "g1", dcentre: "g1", r2b: "g1", r3: "g1", dsemi: "g1", r4: "g1",
  subtend: "g2", dsameseg: "g2", bowtie: "g2", r5: "g2", deqchord: "g2", r6: "g2", qcyclic: "g2", dcycopp: "g2", r7: "g2", dcycext: "g2", r8: "g2", convintro: "g2", eprovecyc: "g2",
  tanintro: "g3", tanchordintro: "g3", dtanchord: "g3", r10: "g3", r10b: "g3", dtanrad: "g3", r9: "g3", dtanpoint: "g3", r11: "g3", eprovetan: "g3",
  r12: "g4", r14: "g4", r15: "g4", r16: "g4",
  r18: "g5", r19: "g5", r20: "g5", r21: "g5",
  pr0: "g7", pr1: "g7", pr2: "g7", pr3: "g7", pr4: "g7",   // P5-P9 join this line as they're built
  inv1: "g6", inv2: "g6", inv3: "g6", inv4: "g6", inv5: "g6", inv6: "g6",
};

export const ROUNDS = ORDER.map((r, i) => {
  r.n = i + 1;
  if (!r.group) r.group = GROUP[r.id] || "intro";
  return r;
});
export const ROUND_BY_ID = Object.fromEntries(ROUNDS.map(r => [r.id, r]));

/* ------------------------------------------------------------
   THE MAIN LINE vs THE BRANCH LINE (Megan's ruling, 2026-07-30).
   The Investigation Station is reached ONLY from the train strip on
   the home screen, so its six stations come OFF the main round map —
   no round appears in two places, and the main line goes back to being
   the 43 rounds. ROUNDS stays the full list, because the unlock chain,
   ROUND_BY_ID, verify.html and the admin dashboard all still want
   everything; these two views are what the learner-facing screens
   render. Membership is by `kind`, not by a hand-kept id list, so a
   seventh station would need no change here.
   ------------------------------------------------------------ */
export const STATIONS = ROUNDS.filter(r => r.kind === "investigate");
export const MAIN_ROUNDS = ROUNDS.filter(r => r.kind !== "investigate");

/* Which rounds are unlocked: the first always, every other once the
   round BEFORE it in the play order has been passed. It lives here
   because the chain is a property of the ORDER above, and both maps
   (game.js for the main line, stations.js for the branch) read it. */
export function unlockedIds(progress) {
  const set = new Set([ROUNDS[0].id]);
  for (let i = 1; i < ROUNDS.length; i++) {
    const prev = progress[ROUNDS[i - 1].id];
    if (prev && prev.passed) set.add(ROUNDS[i].id);
  }
  return set;
}

/* Guiding-hint fallback: a round may set `defaultHints` (a 2-rung ladder that
   names its theorem's angles and the move to make). Apply it to every graded
   question that doesn't carry its own `hints`, so a uniform round needs just
   one definition instead of repeating it per question. */
ROUNDS.forEach(r => {
  if (!Array.isArray(r.defaultHints) || !Array.isArray(r.questions)) return;
  r.questions.forEach(q => { if (!q.hints) q.hints = r.defaultHints; });
});

/* ------------------------------------------------------------
   Flat index of every GRADED question (only "play" rounds carry a
   `questions` array; cutscenes/discovery carry `panels` instead).
   Powers Fix-My-Mistakes and the Daily Challenge, which need to look
   a single question up by its id and know which round it came from. */
export const QUESTION_BANK = [];
export const QUESTION_BY_ID = {};
ROUNDS.forEach(r => {
  if (!Array.isArray(r.questions)) return;
  r.questions.forEach(q => {
    const entry = { q, roundId: r.id, roundN: r.n, title: r.title, accent: r.accent || q.accent, group: r.group };
    QUESTION_BANK.push(entry);
    QUESTION_BY_ID[q.id] = entry;
  });
});

/* Daily bonus bank — extra mixed riders for learners who've passed every round.
   NOT pushed to QUESTION_BANK (so it never leaks into a normal Daily pool) and
   NOT in ROUNDS (no map card / badge), but registered in QUESTION_BY_ID so the
   Daily and Fix-Mistakes can resolve its ids. daily.js adds it for finishers. */
export const DAILY_EXTRA = (dailyExtra.questions || []).map(q => {
  const entry = { q, roundId: dailyExtra.id, roundN: null, title: dailyExtra.title, accent: q.accent || dailyExtra.accent, group: "bonus" };
  QUESTION_BY_ID[q.id] = entry;
  return entry;
});

/* Daily riders — the harder exam-style Daily bank (typed-answer questions).
   Same registration pattern as DAILY_EXTRA: resolvable by id (for Fix-Mistakes
   and lookup) but never pushed into QUESTION_BANK or the play order. daily.js
   draws the 10-question Daily from here (5 multi-step + 5 single-step). */
export const DAILY_RIDERS = (dailyRiders.questions || []).map(q => {
  const entry = { q, roundId: dailyRiders.id, roundN: null, title: dailyRiders.title, accent: q.accent || dailyRiders.accent, group: "bonus" };
  QUESTION_BY_ID[q.id] = entry;
  return entry;
});
export const DAILY_RIDERS_MULTI = DAILY_RIDERS.filter(e => e.q.type === "num");
export const DAILY_RIDERS_SINGLE = DAILY_RIDERS.filter(e => e.q.type === "num-reason");
