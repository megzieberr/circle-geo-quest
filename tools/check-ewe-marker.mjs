/* Does the Eweredigheid ratio marker mark right maths right, and only that?
   ------------------------------------------------------------------------
   Marking right maths wrong is the worst thing these rounds can do, and a
   ratio can be written many correct ways. So this tries EVERY possible fill
   of every ew1 build step (every chip in every one of the four boxes) and
   compares the marker (js/ewe-core.js markRatio, which only reads the SHAPE
   of a fill: which side, which piece) with an ORACLE that only reads
   LENGTHS, measured from the very coordinates the sketch is drawn from.

   The oracle, written without looking at the marker:
     true maths  |x1·x4 − x2·x3| is tiny     (x1/x2 = x3/x4, cross-multiplied)
     says nothing  {x1, x4} and {x2, x3} are the same pair of chips, so the
                   equation holds for ANY lengths (AD/AD = AE/AE)
     right =  true maths
              AND it does not say nothing
              AND no ∥ line is used           (foreman ruling for ew1)
              AND, when the step asks for the whole sides, a whole side is used

   Before any of that it checks the sketch is GENERIC: no two different
   segments share a length and no two different chip pairs share a product,
   except where the ∥ line forces it. An accidental equality would make a
   wrong fill "true" and the test meaningless, so it fails loudly instead.

   Run: node tools/check-ewe-marker.mjs        (exit 1 on any disagreement) */
import { markRatio, segLength } from "../js/ewe-core.js";
import { round, TRIANGLES } from "../js/rounds/ewe1-watter-sye.js";

const REL = 1e-9;             // "equal" for lengths that are equal by construction
const GAP = 1e-3;             // anything closer than this that is NOT forced is an accident

let problems = 0;
const rows = [];

for (const q of round.eweQuestions) {
  const tri = TRIANGLES[q.id];
  q.steps.forEach((step, si) => {
    if (step.type !== "build") return;
    const chips = step.chips;
    const L = Object.fromEntries(chips.map(c => [c, segLength(tri, c)]));

    /* 1 · generic lengths: every chip a different length */
    for (let i = 0; i < chips.length; i++) for (let j = i + 1; j < chips.length; j++) {
      const a = L[chips[i]], b = L[chips[j]];
      if (Math.abs(a - b) / Math.max(a, b) < GAP) { problems++; console.error(`✗ ${q.id}: ${chips[i]} and ${chips[j]} are accidentally equal (${a.toFixed(3)})`); }
    }

    /* 2 · every fill */
    let tried = 0, accepted = 0, rejected = 0, disagree = 0;
    const why = {};
    for (const x1 of chips) for (const x2 of chips) for (const x3 of chips) for (const x4 of chips) {
      tried++;
      const lhs = L[x1] * L[x4], rhs = L[x2] * L[x3];
      const trueMaths = Math.abs(lhs - rhs) / Math.max(lhs, rhs) < REL;
      const nearMiss = !trueMaths && Math.abs(lhs - rhs) / Math.max(lhs, rhs) < GAP;
      if (nearMiss) { problems++; console.error(`✗ ${q.id}: ${x1}/${x2} = ${x3}/${x4} is ACCIDENTALLY almost true — change t`); }
      const saysNothing = [x1, x4].sort().join() === [x2, x3].sort().join();
      const usesPar = [x1, x2, x3, x4].some(c => tri.seg[c].par);
      const usesWhole = [x1, x2, x3, x4].some(c => tri.seg[c].pos === "w");
      const oracle = trueMaths && !saysNothing && !usesPar && (!step.spec.needWhole || usesWhole);

      const verdict = markRatio([x1, x2, x3, x4], step.spec);
      why[verdict.why] = (why[verdict.why] || 0) + 1;
      if (verdict.ok) accepted++; else rejected++;
      if (verdict.ok !== oracle) {
        disagree++;
        if (disagree <= 5) console.error(`✗ ${q.id}: ${x1}/${x2} = ${x3}/${x4}  marker ${verdict.ok} (${verdict.why}), oracle ${oracle}`);
      }
    }
    /* 3 · the answer the "show me" rung fills in must itself be marked right */
    if (!markRatio(step.answer, step.spec).ok) { problems++; console.error(`✗ ${q.id}: its own shown answer is marked wrong`); }
    problems += disagree;
    rows.push({ q: q.id, step: si + 1, chips: chips.length, tried, accepted, rejected, disagree,
                needWhole: !!step.spec.needWhole, why });
  });
}

console.log("question  chips  fills tried  accepted  rejected  disagreements  wholes only");
let T = 0, A = 0, R = 0, D = 0;
for (const r of rows) {
  T += r.tried; A += r.accepted; R += r.rejected; D += r.disagree;
  console.log(`${r.q.padEnd(9)} ${String(r.chips).padStart(5)}  ${String(r.tried).padStart(11)}  ${String(r.accepted).padStart(8)}  ${String(r.rejected).padStart(8)}  ${String(r.disagree).padStart(13)}  ${r.needWhole ? "yes" : "no"}`);
  console.log(`          rejected because: ${Object.entries(r.why).filter(([k]) => k !== "ok").map(([k, v]) => `${k} ${v}`).join(", ")}`);
}
console.log(`TOTAL     ${"".padStart(5)}  ${String(T).padStart(11)}  ${String(A).padStart(8)}  ${String(R).padStart(8)}  ${String(D).padStart(13)}`);

if (problems) { console.error(`\n✗ ${problems} problem(s).`); process.exit(1); }
console.log("\n✓ the marker agrees with the length oracle on every fill.");
