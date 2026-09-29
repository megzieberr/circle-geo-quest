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

   ew2 (the ∥ lines join the ratio) gets the same treatment against its own
   oracle, further down: every fill of every ew2 build step, every option of
   its half-built question.

   Run: node tools/check-ewe-marker.mjs        (exit 1 on any disagreement) */
import { markRatio, segLength } from "../js/ewe-core.js";
import { round, TRIANGLES } from "../js/rounds/ewe1-watter-sye.js";
import { round as round2, TRIANGLES as TRIANGLES2 } from "../js/rounds/ewe2-met-die-lyne.js";

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

/* ======================= ew2 =======================
   The ew2 ORACLE, written from the round's rule, not from the marker. It
   reads only the COORDINATES the sketch is drawn from:
     true maths     |x1·x4 − x2·x3| is tiny (cross-multiplied)
     says nothing   {x1, x4} and {x2, x3} are the same pair of chips
     ∥ line         a chip whose direction is parallel to another chip's,
                    while the two do NOT lie on one line (measured)
     bottom piece   a chip that lies on one line with another chip (so it is
                    on a cut side) and does not touch the corner
     right =  true maths AND not says-nothing AND no bottom piece AND at
              least one ∥ line (the prompt asks for the ∥ lines) */
const ends = (tri, c) => [tri.pts[tri.seg[c].from], tri.pts[tri.seg[c].to]];
const cross = (u, v) => u.x * v.y - u.y * v.x;
const vec = (P, Q) => ({ x: Q.x - P.x, y: Q.y - P.y });
function geometry(tri, chips) {
  const unit = c => { const [P, Q] = ends(tri, c); const v = vec(P, Q), L = Math.hypot(v.x, v.y); return { x: v.x / L, y: v.y / L }; };
  const sameLine = (c1, c2) => { const [P] = ends(tri, c1), [R, S] = ends(tri, c2), u = unit(c1);
    return Math.abs(cross(u, vec(P, R))) < 1e-6 && Math.abs(cross(u, vec(P, S))) < 1e-6; };
  const parallel = (c1, c2) => Math.abs(cross(unit(c1), unit(c2))) < 1e-9;
  const g = {};
  for (const c of chips) {
    const others = chips.filter(o => o !== c);
    const isPar = others.some(o => parallel(c, o) && !sameLine(c, o));
    const onCutSide = others.some(o => sameLine(c, o));
    const touchesCorner = tri.seg[c].from === tri.corner || tri.seg[c].to === tri.corner;
    g[c] = { par: isPar, bottom: onCutSide && !touchesCorner };
  }
  return g;
}
function oracle2(fill, L, g) {
  const [x1, x2, x3, x4] = fill;
  const lhs = L[x1] * L[x4], rhs = L[x2] * L[x3];
  const rel = Math.abs(lhs - rhs) / Math.max(lhs, rhs);
  const trueMaths = rel < REL;
  const saysNothing = [x1, x4].sort().join() === [x2, x3].sort().join();
  const bottom = fill.some(c => g[c].bottom);
  const par = fill.some(c => g[c].par);
  return { right: trueMaths && !saysNothing && !bottom && par, nearMiss: !trueMaths && rel < GAP };
}

const rows2 = [];
for (const q of round2.eweQuestions) {
  const tri = TRIANGLES2[q.id];
  q.steps.forEach((step, si) => {
    if (step.type === "pick" && step.half) {
      /* the half-built question: every option, finished, against the oracle */
      const all = Object.keys(tri.seg);
      const L = Object.fromEntries(all.map(c => [c, segLength(tri, c)]));
      const g = geometry(tri, all);
      step.options.forEach(o => {
        if (o.fill.slice(0, 3).join() !== step.half.join()) { problems++; console.error(`✗ ${q.id}: option ${o.text} does not finish the half-built ratio`); }
        const want = oracle2(o.fill, L, g).right;
        if (want !== !!o.correct) { problems++; console.error(`✗ ${q.id}: option ${o.text} marked ${!!o.correct}, oracle ${want}`); }
      });
      for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) {
        const a = L[all[i]], b = L[all[j]];
        if (Math.abs(a - b) / Math.max(a, b) < GAP) { problems++; console.error(`✗ ${q.id}: ${all[i]} and ${all[j]} are accidentally equal (${a.toFixed(3)})`); }
      }
      rows2.push({ q: q.id, step: si + 1, pick: step.options.map(o => `${o.fill[3]} ${o.correct ? "right" : "wrong"}`).join(", ") });
      return;
    }
    if (step.type !== "build") return;
    const chips = step.chips;
    const L = Object.fromEntries(chips.map(c => [c, segLength(tri, c)]));
    const g = geometry(tri, chips);
    /* the oracle must find exactly two ∥ lines and two bottom pieces */
    const nPar = chips.filter(c => g[c].par).length, nBot = chips.filter(c => g[c].bottom).length;
    if (nPar !== 2 || nBot !== 2) { problems++; console.error(`✗ ${q.id}: oracle found ${nPar} ∥ lines and ${nBot} bottom pieces`); }

    /* 1 · generic lengths */
    for (let i = 0; i < chips.length; i++) for (let j = i + 1; j < chips.length; j++) {
      const a = L[chips[i]], b = L[chips[j]];
      if (Math.abs(a - b) / Math.max(a, b) < GAP) { problems++; console.error(`✗ ${q.id}: ${chips[i]} and ${chips[j]} are accidentally equal (${a.toFixed(3)})`); }
    }
    /* 2 · every fill (all four boxes, even where the first box is given:
       the marker must be right on all of them) */
    const fixed = step.fixed || [];
    let tried = 0, accepted = 0, rejected = 0, disagree = 0, padFills = 0, padRight = 0;
    const why = {};
    for (const x1 of chips) for (const x2 of chips) for (const x3 of chips) for (const x4 of chips) {
      tried++;
      const fill = [x1, x2, x3, x4];
      const o = oracle2(fill, L, g);
      if (o.nearMiss) { problems++; console.error(`✗ ${q.id}: ${x1}/${x2} = ${x3}/${x4} is ACCIDENTALLY almost true, change t`); }
      const verdict = markRatio(fill, step.spec);
      why[verdict.why] = (why[verdict.why] || 0) + 1;
      if (verdict.ok) accepted++; else rejected++;
      if (fixed.every((c, k) => fill[k] === c)) { padFills++; if (verdict.ok) padRight++; }
      if (verdict.ok !== o.right) {
        disagree++;
        if (disagree <= 5) console.error(`✗ ${q.id}: ${x1}/${x2} = ${x3}/${x4}  marker ${verdict.ok} (${verdict.why}), oracle ${o.right}`);
      }
    }
    /* 3 · the shown answer: right, and it starts with the given chip */
    if (!markRatio(step.answer, step.spec).ok || !oracle2(step.answer, L, g).right) { problems++; console.error(`✗ ${q.id}: its own shown answer is not right`); }
    if (!fixed.every((c, k) => step.answer[k] === c)) { problems++; console.error(`✗ ${q.id}: the shown answer does not start with the given chip`); }
    problems += disagree;
    rows2.push({ q: q.id, step: si + 1, chips: chips.length, tried, accepted, rejected, disagree, fixed: fixed.join(""), padFills, padRight, why });
  });
}

console.log("\new2 (similarity mode)");
console.log("question  chips  fills tried  accepted  rejected  disagreements  given box  fills with that box (right)");
let T2 = 0, A2 = 0, R2 = 0, D2 = 0;
for (const r of rows2) {
  if (r.pick) { console.log(`${r.q.padEnd(9)} half-built pick: ${r.pick}`); continue; }
  T2 += r.tried; A2 += r.accepted; R2 += r.rejected; D2 += r.disagree;
  console.log(`${r.q.padEnd(9)} ${String(r.chips).padStart(5)}  ${String(r.tried).padStart(11)}  ${String(r.accepted).padStart(8)}  ${String(r.rejected).padStart(8)}  ${String(r.disagree).padStart(13)}  ${(r.fixed || "-").padStart(9)}  ${r.padFills} (${r.padRight})`);
  console.log(`          rejected because: ${Object.entries(r.why).filter(([k]) => k !== "ok").map(([k, v]) => `${k} ${v}`).join(", ")}`);
}
console.log(`TOTAL     ${"".padStart(5)}  ${String(T2).padStart(11)}  ${String(A2).padStart(8)}  ${String(R2).padStart(8)}  ${String(D2).padStart(13)}`);

if (problems) { console.error(`\n✗ ${problems} problem(s).`); process.exit(1); }
console.log("\n✓ the marker agrees with the length oracle on every fill (ew1 and ew2).");
