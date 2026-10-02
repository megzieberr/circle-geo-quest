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

   ew3 (the area ratio from a shared height) too, at the bottom: every fill
   of every two-box build step against an oracle that measures AREAS
   (shoelace) and lengths from the coordinates.

   Run: node tools/check-ewe-marker.mjs        (exit 1 on any disagreement) */
import { markRatio, segLength, dist } from "../js/ewe-core.js";
import { round, TRIANGLES } from "../js/rounds/ewe1-watter-sye.js";
import { round as round2, TRIANGLES as TRIANGLES2 } from "../js/rounds/ewe2-met-die-lyne.js";
import { round as round3, SKETCHES as SKETCHES3 } from "../js/rounds/ewe3-deel-n-sy.js";

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

/* ======================= ew3 =======================
   The ew3 ORACLE, written without looking at the marker. It reads only the
   COORDINATES the sketch is drawn from, and the two triangle names the
   learner SEES in the first frame ("Opp Δ ABC" over "Opp Δ ACD"):
     segment    a chip that is two point names of the sketch; anything else
                (½, ⊥h) is a factor, not a length, and is never right
     area       shoelace, from the three corners' coordinates
     right =  both chips are segments
              AND the two chips differ (a repeat says nothing)
              AND length(top) / length(bottom) = area(first Δ) / area(second Δ)
   Before that, the sketch must be GENERIC: no two of its six segments share
   a length and no two pairs of them (squares too) share a product, so one
   length ratio can only equal another by being the very same pair. It also
   checks the DRAWN ⊥h: perpendicular to the base line, its foot on that
   line, strictly inside the base, clear of the middle point.
   And one more oracle, for Q5's Ja / Nee: two named triangles share a
   height when a side of one and a side of the other lie on one line and the
   corners opposite them are equally far from it. */
const shoelace = ([P, Q, R]) => Math.abs((Q.x - P.x) * (R.y - P.y) - (R.x - P.x) * (Q.y - P.y)) / 2;
const word = c => (typeof c === "object" ? c.t : c);
function namedOnScreen(q) {
  const st = q.steps.find(x => x.type === "build" && x.frame);
  const f = st.frame[0];
  return [f.n, f.d].map(cells => word(cells[0]).replace(/^Opp Δ /, ""));
}
function lineDist(P, Q, X) {               // distance from X to the LINE PQ
  return Math.abs((Q.x - P.x) * (X.y - P.y) - (X.x - P.x) * (Q.y - P.y)) / dist(P, Q);
}
function shareHeight(pts, n1, n2) {
  const sides = n => [[n[0], n[1], n[2]], [n[1], n[2], n[0]], [n[2], n[0], n[1]]];   // two ends, opposite corner
  for (const [a, b, o1] of sides(n1)) for (const [c, d, o2] of sides(n2)) {
    const P = pts[a], Q = pts[b];
    const oneLine = lineDist(P, Q, pts[c]) < 1e-6 && lineDist(P, Q, pts[d]) < 1e-6;
    if (oneLine && Math.abs(lineDist(P, Q, pts[o1]) - lineDist(P, Q, pts[o2])) < 1e-6) return true;
  }
  return false;
}

const rows3 = [];
for (const q of round3.eweQuestions) {
  const T = SKETCHES3[q.id];
  const P = T.pts;
  if (!q.steps.some(x => x.type === "build")) {
    /* Q5: Ja / Nee. "Nee" must be right exactly when the oracle finds NO
       shared height between the two triangles the sketch tints */
    const [n1, n2] = T.sketch.tints.map(t => t.join(""));
    const shares = shareHeight(P, n1, n2);
    const st = q.steps[0];
    const right = st.options.find(o => o.correct).text;
    if (right !== (shares ? "Ja" : "Nee")) { problems++; console.error(`✗ ${q.id}: marked "${right}", but the oracle says shared height = ${shares}`); }
    if ((T.sketch.par || []).length) { problems++; console.error(`✗ ${q.id}: ∥ arrows in a sketch whose line is not ∥`); }
    rows3.push({ q: q.id, yesno: `Δ ${n1} and Δ ${n2}: shared height ${shares ? "yes" : "no"}, right answer "${right}"` });
    continue;
  }
  const named = namedOnScreen(q);
  const area = named.map(n => shoelace([...n].map(k => P[k])));
  const isSeg = c => [...c].length === 2 && [...c].every(k => P[k]);
  const len = c => dist(P[[...c][0]], P[[...c][1]]);

  /* 0 · the named pair really shares a height, measured */
  if (!shareHeight(P, named[0], named[1])) { problems++; console.error(`✗ ${q.id}: Δ ${named[0]} and Δ ${named[1]} do NOT share a height`); }

  /* 1 · generic: six segments, distinct lengths, distinct products */
  const names = Object.keys(P);
  const segs = [];
  for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) segs.push(names[i] + names[j]);
  const L = Object.fromEntries(segs.map(c => [c, len(c)]));
  for (let i = 0; i < segs.length; i++) for (let j = i + 1; j < segs.length; j++) {
    const a = L[segs[i]], b = L[segs[j]];
    if (Math.abs(a - b) / Math.max(a, b) < GAP) { problems++; console.error(`✗ ${q.id}: ${segs[i]} and ${segs[j]} are accidentally equal (${a.toFixed(3)})`); }
  }
  const prods = [];
  for (let i = 0; i < segs.length; i++) for (let j = i; j < segs.length; j++) prods.push([`${segs[i]}·${segs[j]}`, L[segs[i]] * L[segs[j]]]);
  let minProdGap = Infinity;
  for (let i = 0; i < prods.length; i++) for (let j = i + 1; j < prods.length; j++) {
    const gap = Math.abs(prods[i][1] - prods[j][1]) / Math.max(prods[i][1], prods[j][1]);
    minProdGap = Math.min(minProdGap, gap);
    if (gap < GAP) { problems++; console.error(`✗ ${q.id}: ${prods[i][0]} and ${prods[j][0]} are accidentally equal`); }
  }

  /* 2 · the drawn ⊥h: from the apex, perpendicular to the base line, its
     foot strictly inside the base and clear of the middle point */
  const [b0, b1, b2] = T.base, h = T.sketch.height, A = P[h.from], F = h.foot;
  const bx = P[b2].x - P[b0].x, by = P[b2].y - P[b0].y, bl = Math.hypot(bx, by);
  const perp = Math.abs((A.x - F.x) * bx + (A.y - F.y) * by) / (dist(A, F) * bl);
  const onLine = lineDist(P[b0], P[b2], F);
  const u = ((F.x - P[b0].x) * bx + (F.y - P[b0].y) * by) / (bl * bl);
  const uMid = ((P[b1].x - P[b0].x) * bx + (P[b1].y - P[b0].y) * by) / (bl * bl);
  if (h.from !== T.apex || perp > 1e-9 || onLine > 1e-9 || !(u > 0 && u < 1) || Math.abs(u - uMid) < 0.05 || Math.abs(u - 0.5) < 0.02) {
    problems++; console.error(`✗ ${q.id}: the drawn ⊥h is wrong (cos ${perp}, off the line ${onLine}, foot at ${u.toFixed(3)}, middle point at ${uMid.toFixed(3)})`);
  }

  /* 3 · the card names the same two triangles as the frame */
  if (q.write.area.tris.join() !== named.join()) { problems++; console.error(`✗ ${q.id}: the card names ${q.write.area.tris}, the frame ${named}`); }

  /* 4 · every fill of every build step */
  q.steps.forEach((step, si) => {
    if (step.type !== "build") return;
    if (step.spec.mode !== "area") { problems++; console.error(`✗ ${q.id} step ${si + 1}: not in area mode`); return; }
    let tried = 0, accepted = 0, rejected = 0, disagree = 0;
    const why = {};
    for (const x1 of step.chips) for (const x2 of step.chips) {
      tried++;
      let right = false;
      if (isSeg(x1) && isSeg(x2) && x1 !== x2) {
        const rel = Math.abs((len(x1) / len(x2)) / (area[0] / area[1]) - 1);
        right = rel < REL;
        if (!right && rel < GAP) { problems++; console.error(`✗ ${q.id}: ${x1}/${x2} is ACCIDENTALLY almost the area ratio, move a point`); }
      }
      const verdict = markRatio([x1, x2], step.spec);
      why[verdict.why] = (why[verdict.why] || 0) + 1;
      if (verdict.ok) accepted++; else rejected++;
      if (verdict.ok !== right) {
        disagree++;
        if (disagree <= 5) console.error(`✗ ${q.id} step ${si + 1}: ${x1}/${x2}  marker ${verdict.ok} (${verdict.why}), oracle ${right}`);
      }
    }
    /* the shown answer is right, and it is the card's base ratio */
    if (!markRatio(step.answer, step.spec).ok) { problems++; console.error(`✗ ${q.id} step ${si + 1}: its own shown answer is marked wrong`); }
    if (step.answer.join() !== q.write.area.bases.join()) { problems++; console.error(`✗ ${q.id} step ${si + 1}: the shown answer is not the card's base ratio`); }
    problems += disagree;
    rows3.push({ q: q.id, step: si + 1, chips: step.chips.length, tried, accepted, rejected, disagree, minProdGap, why });
  });
}

console.log("\new3 (area mode, two boxes)");
console.log("question  step  chips  fills tried  accepted  rejected  disagreements  smallest product gap");
let T3 = 0, A3 = 0, R3 = 0, D3 = 0;
for (const r of rows3) {
  if (r.yesno) { console.log(`${r.q.padEnd(9)} Ja / Nee: ${r.yesno}`); continue; }
  T3 += r.tried; A3 += r.accepted; R3 += r.rejected; D3 += r.disagree;
  console.log(`${r.q.padEnd(9)} ${String(r.step).padStart(4)}  ${String(r.chips).padStart(5)}  ${String(r.tried).padStart(11)}  ${String(r.accepted).padStart(8)}  ${String(r.rejected).padStart(8)}  ${String(r.disagree).padStart(13)}  ${(100 * r.minProdGap).toFixed(2)}%`);
  console.log(`          rejected because: ${Object.entries(r.why).filter(([k]) => k !== "ok").map(([k, v]) => `${k} ${v}`).join(", ")}`);
}
console.log(`TOTAL           ${"".padStart(5)}  ${String(T3).padStart(11)}  ${String(A3).padStart(8)}  ${String(R3).padStart(8)}  ${String(D3).padStart(13)}`);

if (problems) { console.error(`\n✗ ${problems} problem(s).`); process.exit(1); }
console.log("\n✓ the marker agrees with the length oracle on every fill (ew1, ew2 and ew3).");
