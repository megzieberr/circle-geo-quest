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

   ew4 (the area ratio from a shared angle) last: every fill of every
   four-box product step (6⁴ each) against the same kind of oracle, areas
   and lengths from the coordinates, plus the sketch facts the round leans
   on (which angle is shared, measured; the cut line not ∥; every chip
   drawn).

   ew5 (which tool, then what is left after the cross-out) has no fills:
   every step is a pick. Its oracle, at the very end, decides the KIND of
   each sketch from the coordinates (a shared height or a shared angle,
   exactly one), and evaluates EVERY step-2 option (a length over a length,
   or a product over a product) as a number against the shoelace area
   ratio: exactly one may be true, and it must be the marked one.

   ew7 (the product line becomes two fractions) at the very end: every
   given line proved TRUE in its own figure first, every figure generic
   (only the six identities of a right Δ with its height), then every fill
   of every build step (☐ · ☐ = ☐ · ☐ and ☐/☐ = ☐/☐) through the product
   and cross markers against products of lengths measured from the
   coordinates.

   ew6 (the trapezium: the big Δ minus the small Δ) last of all: its own
   oracle measures the small Δ, the big Δ and the trapezium with the
   shoelace formula from the coordinates, proves the small over the big is
   the question's fraction and the trapezium is big minus small, then
   tries EVERY fill of every build step against "the numbers are the
   lowest-terms parts, in the asked order".

   Run: node tools/check-ewe-marker.mjs        (exit 1 on any disagreement) */
import { markRatio, segLength, dist } from "../js/ewe-core.js";
import { round, TRIANGLES } from "../js/rounds/ewe1-watter-sye.js";
import { round as round2, TRIANGLES as TRIANGLES2 } from "../js/rounds/ewe2-met-die-lyne.js";
import { round as round3, SKETCHES as SKETCHES3 } from "../js/rounds/ewe3-deel-n-sy.js";
import { round as round4, SKETCHES as SKETCHES4 } from "../js/rounds/ewe4-deel-n-hoek.js";
import { round as round5, SKETCHES as SKETCHES5 } from "../js/rounds/ewe5-watter-een.js";
import { round as round6, SKETCHES as SKETCHES6 } from "../js/rounds/ewe6-die-trapesium.js";
import { round as round7, SKETCHES as SKETCHES7 } from "../js/rounds/ewe7-vreemde-formaat.js";

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

/* ======================= ew4 =======================
   The ew4 ORACLE, written from the round's rule, not from the marker. It
   reads only the COORDINATES the sketch is drawn from, and the two triangle
   names the learner SEES in the frame ("Opp Δ ADE" over "Opp Δ ABC"):
     segment       a chip that is two point names of the sketch; anything
                   else (½, sin Â) is a factor, not a length, and never right
     area          shoelace, from the three corners' coordinates
     says nothing  a chip twice in one product, or the same pair of chips
                   top and bottom
     right =  all four chips are segments
              AND the fill does not say nothing
              AND len(top1)·len(top2) / (len(bot1)·len(bot2))
                  = area(first Δ) / area(second Δ)     (relative 1e-9)
   Before that, per sketch: GENERIC (no two of the six sides share a length,
   no two pairwise products of them, squares too, are equal); the shared
   angle MEASURED (the corner of both triangles where their sides run along
   the same two rays) and the arc drawn there; the cut line not ∥ (no ∥
   arrows, the two third sides at a clear angle); every chip lies on a drawn
   line (so Q4's ray really runs through to K).
   Q5 (Ja / Nee): "Nee" must be right exactly when the two tinted triangles
   share NO angle (measured) and they do share a height. */
const HATS = /^(?:[A-Z]\u0302|[\u00C2\u0108\u00CA\u011C\u0124\u00CE\u0134\u00D4\u015C\u00DB\u0174\u0176\u1E90])$/u;
const unitV = (P, Q) => { const L = dist(P, Q); return { x: (Q.x - P.x) / L, y: (Q.y - P.y) / L }; };
const sameDir = (u, v) => Math.abs(u.x - v.x) < 1e-9 && Math.abs(u.y - v.y) < 1e-9;
/* the corner where two named triangles share ONE ANGLE: a common corner
   where the two other corners of each lie on the same two rays from it */
function sharedAngleAt(pts, n1, n2) {
  for (const V of [...n1].filter(k => n2.includes(k))) {
    const rays = n => [...n].filter(k => k !== V).map(k => unitV(pts[V], pts[k]));
    const [r1, r2] = [rays(n1), rays(n2)];
    if (r1.every(u => r2.some(v => sameDir(u, v))) && r2.every(u => r1.some(v => sameDir(u, v)))) return V;
  }
  return null;
}
function onSegment(P, Q, X) {
  const L = dist(P, Q), cr = Math.abs((Q.x - P.x) * (X.y - P.y) - (X.x - P.x) * (Q.y - P.y)) / L;
  const along = ((X.x - P.x) * (Q.x - P.x) + (X.y - P.y) * (Q.y - P.y)) / (L * L);
  return cr < 1e-6 && along > -1e-9 && along < 1 + 1e-9;
}

const rows4 = [];
for (const q of round4.eweQuestions) {
  const S = SKETCHES4[q.id];
  const P = S.pts;
  if (!q.steps.some(x => x.type === "build")) {
    const [n1, n2] = S.sketch.tints.map(t => (Array.isArray(t) ? t : t.pts).join(""));
    const angle = sharedAngleAt(P, n1, n2), height = shareHeight(P, n1, n2);
    const st = q.steps[0];
    const right = st.options.find(o => o.correct).text;
    if (right !== (angle ? "Ja" : "Nee")) { problems++; console.error(`✗ ${q.id}: marked "${right}", but the oracle says shared angle = ${angle}`); }
    if (!height) { problems++; console.error(`✗ ${q.id}: Δ ${n1} and Δ ${n2} should share a height`); }
    if (S.sketch.angle || (S.sketch.par || []).length) { problems++; console.error(`✗ ${q.id}: an angle arc or ∥ arrows in a sketch with no shared angle`); }
    rows4.push({ q: q.id, yesno: `Δ ${n1} and Δ ${n2}: shared angle ${angle || "none"}, shared height ${height ? "yes" : "no"}, right answer "${right}"` });
    continue;
  }
  const named = namedOnScreen(q);
  const area = named.map(n => shoelace([...n].map(k => P[k])));
  const isSeg = c => [...c].length === 2 && [...c].every(k => P[k]);
  const len = c => dist(P[[...c][0]], P[[...c][1]]);
  const full = q.steps.find(x => x.type === "build");
  const sides = full.chips.filter(isSeg);

  /* 0 · the shared angle, measured, and the arc drawn at it */
  const V = sharedAngleAt(P, named[0], named[1]);
  if (!V) { problems++; console.error(`✗ ${q.id}: Δ ${named[0]} and Δ ${named[1]} share no angle`); continue; }
  const ang = S.sketch.angle;
  if (!ang || ang.at !== V || ang.star) { problems++; console.error(`✗ ${q.id}: the arc is not at the shared angle ${V} (or the star shows from the start)`); }
  else {
    const arcRays = ang.rays.map(k => unitV(P[V], P[k]));
    const triRays = [...named[1]].filter(k => k !== V).map(k => unitV(P[V], P[k]));
    if (!arcRays.every(u => triRays.some(v => sameDir(u, v)))) { problems++; console.error(`✗ ${q.id}: the arc does not run between the two sides of the angle`); }
  }
  /* the star version differs ONLY by the star */
  const after = q.steps[0].sketchAfter;
  if (!after || !after.angle || !after.angle.star || JSON.stringify({ ...after, angle: { ...after.angle, star: false } }) !== JSON.stringify(S.sketch)) {
    problems++; console.error(`✗ ${q.id}: step 1's sketchAfter is not the same sketch with the star on`);
  }

  /* 1 · generic: the six sides, distinct lengths, distinct products */
  const L = Object.fromEntries(sides.map(c => [c, len(c)]));
  if (sides.length !== 6) { problems++; console.error(`✗ ${q.id}: ${sides.length} side chips, want 6`); }
  for (let i = 0; i < sides.length; i++) for (let j = i + 1; j < sides.length; j++) {
    const a = L[sides[i]], b = L[sides[j]];
    if (Math.abs(a - b) / Math.max(a, b) < GAP) { problems++; console.error(`✗ ${q.id}: ${sides[i]} and ${sides[j]} are accidentally equal (${a.toFixed(3)})`); }
  }
  const prods = [];
  for (let i = 0; i < sides.length; i++) for (let j = i; j < sides.length; j++) prods.push([`${sides[i]}·${sides[j]}`, L[sides[i]] * L[sides[j]]]);
  let minProdGap = Infinity;
  for (let i = 0; i < prods.length; i++) for (let j = i + 1; j < prods.length; j++) {
    const gap = Math.abs(prods[i][1] - prods[j][1]) / Math.max(prods[i][1], prods[j][1]);
    minProdGap = Math.min(minProdGap, gap);
    if (gap < GAP) { problems++; console.error(`✗ ${q.id}: ${prods[i][0]} and ${prods[j][0]} are accidentally equal`); }
  }

  /* 2 · not ∥: no arrows, and the two sides that do not touch the angle
     meet at a clear angle; every side chip lies along a drawn line */
  const thirds = sides.filter(c => ![...c].includes(V));
  const [u, w] = thirds.map(c => unitV(P[[...c][0]], P[[...c][1]]));
  const parAngle = Math.asin(Math.min(1, Math.abs(u.x * w.y - u.y * w.x))) * 180 / Math.PI;
  if ((S.sketch.par || []).length || thirds.length !== 2 || parAngle < 8) { problems++; console.error(`✗ ${q.id}: the cut line is (nearly) ∥ or carries ∥ arrows (${parAngle.toFixed(1)}°)`); }
  for (const c of sides) {
    const [a, b] = [...c].map(k => P[k]);
    if (!S.sketch.lines.some(([p, r]) => onSegment(P[p], P[r], a) && onSegment(P[p], P[r], b))) { problems++; console.error(`✗ ${q.id}: ${c} is not along any drawn line`); }
  }

  /* 3 · step 1: the right corner is the measured one; every wrong corner
     belongs to ONE of the two triangles only; each option one hatted letter */
  const pick = q.steps[0];
  for (const o of pick.options) {
    if (!HATS.test(o.text) || o.text.normalize("NFC") !== o.text) { problems++; console.error(`✗ ${q.id}: option ${JSON.stringify(o.text)} is not one hatted letter (NFC)`); }
    const letter = o.text.normalize("NFD")[0];
    if (!!o.correct !== (letter === V)) { problems++; console.error(`✗ ${q.id}: option ${o.text} marked ${!!o.correct}, the shared angle is at ${V}`); }
    if (!o.correct && named[0].includes(letter) === named[1].includes(letter)) { problems++; console.error(`✗ ${q.id}: wrong option ${o.text} is not in exactly one Δ`); }
  }
  const pickLine = `${pick.options.map(o => `${o.text}${o.correct ? " right" : ""}`).join(", ")}`;

  /* 4 · step 4 and the card: the reason names the measured angle; the card
     names the frame's triangles and writes the shown answer; tints match */
  const reason = q.steps[3].options.find(o => o.correct).text;
  const hatV = (V + "\u0302").normalize("NFC");
  if (reason !== "gemene hoekpunt" || q.write.reason !== reason) { problems++; console.error(`✗ ${q.id}: reason ${reason} / card ${q.write.reason}, want "gemene hoekpunt"`); }
  if (q.write.sine.tris.join() !== named.join()) { problems++; console.error(`✗ ${q.id}: the card names ${q.write.sine.tris}, the frame ${named}`); }
  const tintOf = n => { const t = S.sketch.tints.find(x => [...(Array.isArray(x) ? x : x.pts)].sort().join() === [...n].sort().join()); return t && (Array.isArray(t) ? 0 : t.tint); };
  const frameTints = [full.frame[0].n[0].tint, full.frame[0].d[0].tint];
  if (frameTints.join() !== named.map(tintOf).join() || q.write.sine.tints.join() !== frameTints.join()) { problems++; console.error(`✗ ${q.id}: the "Opp Δ" tints ${frameTints} do not match the sketch ${named.map(tintOf)}`); }

  /* 5 · every fill of every build step */
  q.steps.forEach((step, si) => {
    if (step.type !== "build") return;
    if (step.spec.mode !== "sine") { problems++; console.error(`✗ ${q.id} step ${si + 1}: not in sine mode`); return; }
    let tried = 0, accepted = 0, rejected = 0, disagree = 0;
    const why = {};
    const want = area[0] / area[1];
    const c = step.chips;
    for (const x1 of c) for (const x2 of c) for (const x3 of c) for (const x4 of c) {
      tried++;
      const fill = [x1, x2, x3, x4];
      const saysNothing = x1 === x2 || x3 === x4 || [x1, x2].sort().join() === [x3, x4].sort().join();
      let right = false;
      if (fill.every(isSeg) && !saysNothing) {
        const rel = Math.abs((len(x1) * len(x2)) / (len(x3) * len(x4)) / want - 1);
        right = rel < REL;
        if (!right && rel < GAP) { problems++; console.error(`✗ ${q.id}: ${x1}·${x2} / ${x3}·${x4} is ACCIDENTALLY almost the area ratio, move a point`); }
      }
      const verdict = markRatio(fill, step.spec);
      why[verdict.why] = (why[verdict.why] || 0) + 1;
      if (verdict.ok) accepted++; else rejected++;
      if (verdict.ok !== right) {
        disagree++;
        if (disagree <= 5) console.error(`✗ ${q.id} step ${si + 1}: ${x1}·${x2} / ${x3}·${x4}  marker ${verdict.ok} (${verdict.why}), oracle ${right}`);
      }
    }
    /* the shown answer is right, and it is the card's two products */
    if (!markRatio(step.answer, step.spec).ok) { problems++; console.error(`✗ ${q.id} step ${si + 1}: its own shown answer is marked wrong`); }
    if (step.answer.join() !== [...q.write.sine.top, ...q.write.sine.bot].join()) { problems++; console.error(`✗ ${q.id} step ${si + 1}: the shown answer is not the card's products`); }
    problems += disagree;
    rows4.push({ q: q.id, step: si + 1, chips: c.length, tried, accepted, rejected, disagree, minProdGap, parAngle, V, pickLine, why });
  });
}

console.log("\new4 (sine mode, four boxes, two products)");
console.log("question  step  chips  fills tried  accepted  rejected  disagreements  smallest product gap  shared angle  cut line vs third side");
let T4 = 0, A4 = 0, R4 = 0, D4 = 0;
let lastQ = null;
for (const r of rows4) {
  if (r.yesno) { console.log(`${r.q.padEnd(9)} Ja / Nee: ${r.yesno}`); continue; }
  if (r.q !== lastQ) { console.log(`${r.q.padEnd(9)} step 1 pick: ${r.pickLine}`); lastQ = r.q; }
  T4 += r.tried; A4 += r.accepted; R4 += r.rejected; D4 += r.disagree;
  console.log(`${r.q.padEnd(9)} ${String(r.step).padStart(4)}  ${String(r.chips).padStart(5)}  ${String(r.tried).padStart(11)}  ${String(r.accepted).padStart(8)}  ${String(r.rejected).padStart(8)}  ${String(r.disagree).padStart(13)}  ${(100 * r.minProdGap).toFixed(2).padStart(19)}%  ${r.V.padStart(12)}  ${r.parAngle.toFixed(1).padStart(21)}°`);
  console.log(`          rejected because: ${Object.entries(r.why).filter(([k]) => k !== "ok").map(([k, v]) => `${k} ${v}`).join(", ")}`);
}
console.log(`TOTAL           ${"".padStart(5)}  ${String(T4).padStart(11)}  ${String(A4).padStart(8)}  ${String(R4).padStart(8)}  ${String(D4).padStart(13)}`);

/* ======================= ew5 =======================
   The ew5 ORACLE, written from the round's rule, not from the data file's
   `correct` flags. It reads only the COORDINATES the sketch is drawn from,
   the two triangle names the learner SEES in step 2's lead line ("Opp Δ
   MNP" over "Opp Δ MPQ") and the cells each option DRAWS:
     kind      HEIGHT when the two named triangles share a height (a side of
               each on one line, the opposite corners equally far from it,
               shareHeight above), ANGLE when they share one angle
               (sharedAngleAt above). Exactly one of the two, or the sketch
               is ambiguous and fails (the whole-over-part case shares both).
     generic   no two of the sketch's segments (every pair of its named
               points) share a length, no two pairwise products of them
               (squares too) are equal; HEIGHT: the two apex angles have
               different sines (else the angle leftover, the product of
               the apex sides, would be true as well); ANGLE: the two
               "wrong" ⊥ heights (from the corner to each third side's
               line) differ (else the height leftover, third side over
               third side, would be true).
     an option a stacked fraction of cells: what is LEFT after the
               cross-out (her ruling 2026-10-02), so only segments joined
               by "·", nothing struck (a ½, ⊥h or sine cell fails). It is
               read as lengths, one over one or product over product, the
               same count top and bottom. Its value is compared with
               area(first named Δ) / area(second named Δ)   (relative 1e-9).
     right =  EXACTLY ONE option matches, and it is the one marked correct.
   Step 1: the option marked correct is "Deel 'n sy" for the HEIGHT kind,
   "Deel 'n hoek" for the ANGLE kind, and nothing else is marked. The
   builder's sketch carries the ⊥h for the HEIGHT kind and the arc (no star
   yet) for the ANGLE kind. No spoilers (foreman review 2026-10-02): the
   question SHOWS that sketch bare (no ⊥h, no box, no arc, no star: the
   builder's sketch minus its height or angle key, nothing else changed),
   and step 1's sketchAfter brings the builder's full sketch (HEIGHT) or
   its star sketch (ANGLE). The card names the lead line's triangles and
   writes the true ratio. */
const bareOf = (sk, key) => { const { [key]: _drop, ...rest } = sk; return rest; };
/* the apex two named triangles share a height from: a side of each on one
   line, and the SAME corner opposite both */
function heightApex(pts, n1, n2) {
  const sides = n => [[n[0], n[1], n[2]], [n[1], n[2], n[0]], [n[2], n[0], n[1]]];
  for (const [a, b, o1] of sides(n1)) for (const [c, d, o2] of sides(n2)) {
    const P = pts[a], Q = pts[b];
    if (o1 === o2 && lineDist(P, Q, pts[c]) < 1e-6 && lineDist(P, Q, pts[d]) < 1e-6 && lineDist(P, Q, pts[o1]) > 1e-6) return o1;
  }
  return null;
}
const rows5 = [];
for (const q of round5.eweQuestions) {
  const S = SKETCHES5[q.id];
  const P = S.pts;
  const [s1, s2] = q.steps;
  const named = s2 && s2.lead ? [s2.lead.n, s2.lead.d].map(c => word(c[0]).replace(/^Opp Δ /, "")) : null;
  if (!named || q.steps.length !== 2 || s1.type !== "pick" || s2.type !== "pick") { problems++; console.error(`✗ ${q.id}: not two picks with a lead line`); continue; }
  const area = named.map(n => shoelace([...n].map(k => P[k])));
  const isSeg = c => typeof c === "string" && [...c].length === 2 && [...c].every(k => P[k]);
  const len = c => dist(P[[...c][0]], P[[...c][1]]);

  /* 0 · the kind, measured */
  const angleAt = sharedAngleAt(P, named[0], named[1]);
  const height = shareHeight(P, named[0], named[1]);
  const kind = angleAt && !height ? "ANGLE" : height && !angleAt ? "HEIGHT" : null;
  if (!kind) { problems++; console.error(`✗ ${q.id}: Δ ${named[0]} and Δ ${named[1]}: shared height ${height}, shared angle ${angleAt}, want exactly one`); continue; }

  /* 1 · generic: every segment between two named points */
  const names = Object.keys(P);
  const segs = [];
  for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) segs.push(names[i] + names[j]);
  const L = Object.fromEntries(segs.map(c => [c, len(c)]));
  let minLenGap = Infinity, minProdGap = Infinity;
  for (let i = 0; i < segs.length; i++) for (let j = i + 1; j < segs.length; j++) {
    const a = L[segs[i]], b = L[segs[j]], gap = Math.abs(a - b) / Math.max(a, b);
    minLenGap = Math.min(minLenGap, gap);
    if (gap < GAP) { problems++; console.error(`✗ ${q.id}: ${segs[i]} and ${segs[j]} are accidentally equal (${a.toFixed(3)})`); }
  }
  const prods = [];
  for (let i = 0; i < segs.length; i++) for (let j = i; j < segs.length; j++) prods.push([`${segs[i]}·${segs[j]}`, L[segs[i]] * L[segs[j]]]);
  for (let i = 0; i < prods.length; i++) for (let j = i + 1; j < prods.length; j++) {
    const gap = Math.abs(prods[i][1] - prods[j][1]) / Math.max(prods[i][1], prods[j][1]);
    minProdGap = Math.min(minProdGap, gap);
    if (gap < GAP) { problems++; console.error(`✗ ${q.id}: ${prods[i][0]} and ${prods[j][0]} are accidentally equal`); }
  }
  let kindGap = NaN;
  if (kind === "HEIGHT") {
    const A = heightApex(P, named[0], named[1]);
    if (!A) { problems++; console.error(`✗ ${q.id}: no common apex for the shared height`); continue; }
    const sinAt = n => { const [u, v] = [...n].filter(k => k !== A).map(k => vec(P[A], P[k])); return Math.abs(cross(u, v)) / (Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y)); };
    const [x1, x2] = named.map(sinAt);
    kindGap = Math.abs(x1 - x2) / Math.max(x1, x2);
    if (kindGap < GAP) { problems++; console.error(`✗ ${q.id}: the apex angles have (almost) the same sine (${x1}, ${x2}), so the product leftover would be true too`); }
    const h = S.sketch.height;
    if (!h || h.from !== A || S.sketch.angle || (S.sketch.par || []).length) { problems++; console.error(`✗ ${q.id}: a HEIGHT sketch must carry the ⊥h from ${A}, no arc, no ∥ arrows`); }
    if (JSON.stringify(q.sketch) !== JSON.stringify(bareOf(S.sketch, "height")) || q.sketch.height || q.sketch.angle) { problems++; console.error(`✗ ${q.id}: the question's sketch is not the bare HEIGHT sketch (no ⊥h before step 1)`); }
    if (JSON.stringify(s1.sketchAfter) !== JSON.stringify(S.sketch)) { problems++; console.error(`✗ ${q.id}: step 1's sketchAfter is not the full HEIGHT sketch (the ⊥h and its box)`); }
  } else {
    const V = angleAt;
    const thirdOf = n => [...n].filter(k => k !== V);
    const [h1, h2] = named.map(n => { const [a, b] = thirdOf(n); return lineDist(P[a], P[b], P[V]); });
    kindGap = Math.abs(h1 - h2) / Math.max(h1, h2);
    if (kindGap < GAP) { problems++; console.error(`✗ ${q.id}: the ⊥ heights from ${V} to the two third sides are (almost) equal, so the third side over third side would be true too`); }
    const ang = S.sketch.angle;
    if (!ang || ang.at !== V || ang.star || (S.sketch.par || []).length || S.sketch.height) { problems++; console.error(`✗ ${q.id}: an ANGLE sketch must carry the arc at ${V} (no star yet), no ⊥h, no ∥ arrows`); }
    const after = s1.sketchAfter;
    if (!after || !after.angle || !after.angle.star || JSON.stringify({ ...after, angle: { ...after.angle, star: false } }) !== JSON.stringify(S.sketch)) {
      problems++; console.error(`✗ ${q.id}: step 1's sketchAfter is not the same sketch with the star on`);
    }
    if (JSON.stringify(q.sketch) !== JSON.stringify(bareOf(S.sketch, "angle")) || q.sketch.height || q.sketch.angle) { problems++; console.error(`✗ ${q.id}: the question's sketch is not the bare ANGLE sketch (no arc, no star before step 1)`); }
    /* the cut line not ∥ the third side of the whole Δ */
    const [u, w] = named.map(n => { const [a, b] = thirdOf(n); return unitV(P[a], P[b]); });
    const parAngle = Math.asin(Math.min(1, Math.abs(cross(u, w)))) * 180 / Math.PI;
    if (parAngle < 8) { problems++; console.error(`✗ ${q.id}: the two third sides are (nearly) ∥ (${parAngle.toFixed(1)}°)`); }
  }

  /* 2 · step 1: the marked tool is the measured kind */
  const want1 = kind === "HEIGHT" ? "Deel 'n sy" : "Deel 'n hoek";
  const marked1 = s1.options.filter(o => o.correct).map(o => o.text);
  if (marked1.length !== 1 || marked1[0] !== want1 || s1.layout !== "yesno" || s1.options.length !== 2) { problems++; console.error(`✗ ${q.id}: step 1 marks ${marked1}, the sketch is the ${kind} kind (want "${want1}", two options, natural order)`); }

  /* 3 · step 2: evaluate every option from its cells */
  const want = area[0] / area[1];
  /* only segments and "·" may be drawn: nothing struck is left on screen */
  const onlySegs = cells => cells.every((c, i) => (i % 2 === 0 ? isSeg(c) : word(c) === "·")) && cells.length % 2 === 1;
  const evals = s2.options.map(o => {
    const f = o.frac;
    if (!f) return { text: o.text, ok: false, ratio: NaN, correct: !!o.correct };
    const same = onlySegs(f.n) && onlySegs(f.d);
    if (!same) { problems++; console.error(`✗ ${q.id}: option "${o.text}" draws something other than sides joined by "·" (a struck factor left in?)`); }
    const pr = cells => cells.filter(isSeg).reduce((m, c) => m * len(c), 1);
    const nSeg = f.n.filter(isSeg).length, dSeg = f.d.filter(isSeg).length;
    const ratio = (pr(f.n) / pr(f.d)) / want;
    const rel = Math.abs(ratio - 1);
    if (rel >= REL && rel < GAP) { problems++; console.error(`✗ ${q.id}: option "${o.text}" is ACCIDENTALLY almost the area ratio, move a point`); }
    return { text: o.text, ok: same && nSeg > 0 && nSeg === dSeg && rel < REL, ratio, correct: !!o.correct };
  });
  const matches = evals.filter(e => e.ok);
  const marked2 = evals.filter(e => e.correct);
  const oneRight = matches.length === 1 && marked2.length === 1 && matches[0] === marked2[0];
  if (!oneRight) { problems++; console.error(`✗ ${q.id}: ${matches.length} option(s) match the area ratio (${matches.map(e => e.text).join("; ")}), marked: ${marked2.map(e => e.text).join("; ")}`); }
  if (s2.options.length !== 4) { problems++; console.error(`✗ ${q.id}: step 2 has ${s2.options.length} options, want 4`); }

  /* 4 · the card: the lead line's triangles, and its last fraction is the true ratio */
  const w = q.write;
  const cardTris = (w.area || w.sine || {}).tris;
  const cardKind = w.area ? "HEIGHT" : w.sine ? "ANGLE" : null;
  const cardVal = w.area ? len(w.area.bases[0]) / len(w.area.bases[1]) : w.sine ? (len(w.sine.top[0]) * len(w.sine.top[1])) / (len(w.sine.bot[0]) * len(w.sine.bot[1])) : NaN;
  const wantReason = kind === "HEIGHT" ? "gemeenskaplike hoogte ⊥ en lyn" : "gemene hoekpunt";
  if (cardKind !== kind || !cardTris || cardTris.join() !== named.join() || !(Math.abs(cardVal / want - 1) < REL) || w.reason !== wantReason) {
    problems++; console.error(`✗ ${q.id}: the card (${cardKind}, ${cardTris}, ${w.reason}) does not write the true ${kind} line for ${named}`);
  }
  rows5.push({ q: q.id, kind, named, minLenGap, minProdGap, kindGap, step1: marked1.join(), evals, oneRight });
}

console.log("\new5 (no fills: the tool, then what is left, against the shoelace area ratio)");
console.log("question  kind    named            step 1 marked  smallest length gap  smallest product gap  kind gap  options true  exactly one, the marked one");
for (const r of rows5) {
  console.log(`${r.q.padEnd(9)} ${r.kind.padEnd(7)} ${r.named.join(" / ").padEnd(16)} ${r.step1.padEnd(14)} ${(100 * r.minLenGap).toFixed(2).padStart(18)}% ${(100 * r.minProdGap).toFixed(2).padStart(19)}% ${(100 * r.kindGap).toFixed(1).padStart(7)}%  ${String(r.evals.filter(e => e.ok).length).padStart(12)}  ${r.oneRight ? "yes" : "NO"}`);
  for (const e of r.evals) console.log(`          ${e.correct ? "marked" : "      "} ${e.ok ? "TRUE " : "false"}  option / area ratio = ${e.ratio.toFixed(6)}   ${e.text}`);
}


/* ======================= ew7 =======================
   The ew7 ORACLE, written from the round's rule, not from the markers. It
   reads only the COORDINATES the figure is drawn from and the given line
   the learner READS (q.given, the line in the intro):
     the figure  the angle at the right-angle vertex is 90° and the height
                 is ⊥ the hypotenuse, both MEASURED (relative 1e-9); the
                 foot lies strictly inside the hypotenuse
     the line    TRUE in its own figure: the product of its left pair equals
                 the product of its right pair (relative 1e-9), measured,
                 before anything else
     generic     no two of the six named lengths (AB, AC, AD, BD, DC, BC)
                 equal; no two of their 21 pairwise products (squares too)
                 equal, EXCEPT the six identities a right Δ with its height
                 on the hypotenuse always has (AD² = BD·DC, AB² = BD·BC,
                 AC² = DC·BC, AB·AC = AD·BC, AB·AD = BD·AC, AC·AD = DC·AB)
     the chips   the line's letters, one spelling each, plus ONE decoy: a
                 side of the figure that is not in the line
     every fill  of every build step (4 boxes, 4 or 5 chips: 256 or 625):
                 right = no decoy chip
                       AND the two sides of the line are not the same pair
                           (x · y = y · x, or a/b = b/a: says nothing)
                       AND step 1 ("prod", x1 · x2 = y1 · y2): the measured
                           products are equal
                           step 2 ("cross", a/b = c/d): a · d = b · c,
                           measured
                 against the marker (markRatio routes "prod" / "cross" to
                 markProd / markCross, which never read a length), 0
                 disagreements. Every reason the marker gives has its own
                 hint (or is "pattern"). The shown answer is right, and the
                 card's pairs are the line. */
const IDENT7 = [[["AD", "AD"], ["BD", "DC"]], [["AB", "AB"], ["BD", "BC"]], [["AC", "AC"], ["DC", "BC"]],
                [["AB", "AC"], ["AD", "BC"]], [["AB", "AD"], ["BD", "AC"]], [["AC", "AD"], ["DC", "AB"]]];
const pk = p => p.slice().sort().join("·");
const identKey = (p, q) => [pk(p), pk(q)].sort().join("=");
const IDENT7_KEYS = new Set(IDENT7.map(([p, q]) => identKey(p, q)));
const ROLES7 = ["AB", "AC", "AD", "BD", "DC", "BC"];
const HINTS7 = { prod: ["twice", "mixed", "decoy"], cross: ["once", "same", "repeat", "decoy"] };
const rows7 = [];
const fig7 = [];
for (const q of round7.eweQuestions) {
  const S = SKETCHES7[q.id];
  const P = S.pts;
  const len = c => { const g = S.seg[c]; return g ? dist(P[g.from], P[g.to]) : NaN; };
  const roleLen = Object.fromEntries(ROLES7.map(r => [r, len(S.names[r])]));

  /* 0 · the figure: the right angle and the height, measured */
  const A = S.right, [B, C] = S.ends, D = S.foot;
  const u = vec(P[A], P[B]), w = vec(P[A], P[C]);
  const cosA = (u.x * w.x + u.y * w.y) / (Math.hypot(u.x, u.y) * Math.hypot(w.x, w.y));
  const h = vec(P[A], P[D]), bc = vec(P[B], P[C]);
  const cosH = (h.x * bc.x + h.y * bc.y) / (Math.hypot(h.x, h.y) * Math.hypot(bc.x, bc.y));
  const onBC = lineDist(P[B], P[C], P[D]) < 1e-9 && onSegment(P[B], P[C], P[D]) && S.t > 0 && S.t < 1;
  if (!(Math.abs(cosA) < 1e-9) || !(Math.abs(cosH) < 1e-9) || !onBC) { problems++; console.error(`✗ ${q.id}: the angle at ${A} is not 90° (cos ${cosA}) or ${A}${D} is not ⊥ ${B}${C} (cos ${cosH}) or ${D} is not on ${B}${C}`); }
  const sk = q.sketch;
  const boxes = (sk.right || []).map(r => `${r.at}:${r.arms.join("")}`);
  const boxOk = (sk.right || []).length === 2 && sk.right.some(r => r.at === A && r.arms.includes(B) && r.arms.includes(C))
             && sk.right.some(r => r.at === D && r.arms.includes(A) && (r.arms.includes(B) || r.arms.includes(C)));
  if (!boxOk || sk.tints || sk.angle || sk.height || (sk.par || []).length || !sk.outside) { problems++; console.error(`✗ ${q.id}: the sketch must be bare: two right-angle boxes (at ${A} and ${D}), no tints, arcs, ⊥h or ∥ arrows, labels kept outside (got boxes ${boxes})`); }

  /* 1 · the given line, TRUE in its own figure */
  const pairs = q.given.pairs;
  const prod = p => p.reduce((m, c) => m * len(c), 1);
  const lhs = prod(pairs[0]), rhs = prod(pairs[1]);
  const lineRel = Math.abs(lhs - rhs) / Math.max(lhs, rhs);
  const lineTrue = lineRel < REL;
  if (!lineTrue) { problems++; console.error(`✗ ${q.id}: the given line ${q.given.text} is NOT true in its figure (${lhs.toFixed(4)} vs ${rhs.toFixed(4)})`); }
  const sq = pairs[0][0] === pairs[0][1] ? pairs[0][0] : null;
  const shown = (sq ? `${sq}² = ${pairs[1][0]} · ${pairs[1][1]}` : `${pairs[0].join(" · ")} = ${pairs[1].join(" · ")}`);
  const plainText = s => s.replace(/ /g, " ");
  if (plainText(q.given.text) !== shown || !plainText(q.intro).includes(shown)) { problems++; console.error(`✗ ${q.id}: the line "${shown}" is not the given text "${plainText(q.given.text)}" or not in the intro`); }

  /* 2 · generic */
  let minLenGap = Infinity, minProdGap = Infinity, idents = 0;
  for (let i = 0; i < ROLES7.length; i++) for (let j = i + 1; j < ROLES7.length; j++) {
    const a = roleLen[ROLES7[i]], b = roleLen[ROLES7[j]], gap = Math.abs(a - b) / Math.max(a, b);
    minLenGap = Math.min(minLenGap, gap);
    if (gap < GAP) { problems++; console.error(`✗ ${q.id}: ${S.names[ROLES7[i]]} and ${S.names[ROLES7[j]]} are (almost) equal`); }
  }
  const prods7 = [];
  for (let i = 0; i < ROLES7.length; i++) for (let j = i; j < ROLES7.length; j++) prods7.push([[ROLES7[i], ROLES7[j]], roleLen[ROLES7[i]] * roleLen[ROLES7[j]]]);
  for (let i = 0; i < prods7.length; i++) for (let j = i + 1; j < prods7.length; j++) {
    const gap = Math.abs(prods7[i][1] - prods7[j][1]) / Math.max(prods7[i][1], prods7[j][1]);
    const ident = IDENT7_KEYS.has(identKey(prods7[i][0], prods7[j][0]));
    if (ident) { if (gap < REL) idents++; else { problems++; console.error(`✗ ${q.id}: the identity ${prods7[i][0].join("·")} = ${prods7[j][0].join("·")} does not hold (${gap})`); } continue; }
    minProdGap = Math.min(minProdGap, gap);
    if (gap < GAP) { problems++; console.error(`✗ ${q.id}: ${prods7[i][0].join("·")} and ${prods7[j][0].join("·")} are accidentally (almost) equal, move the foot`); }
  }

  /* 3 · the chips: the line's letters, one spelling each, plus ONE decoy */
  const lineLetters = [...new Set(pairs.flat())];
  const want = [...lineLetters, q.given.decoy];
  const steps = q.steps;
  const modes = steps.map(s => s.spec && s.spec.mode).join(",");
  if (modes !== (sq ? "prod,cross" : "cross")) { problems++; console.error(`✗ ${q.id}: steps ${modes}, want ${sq ? "prod,cross" : "cross"}`); }
  for (const st of steps) {
    const c = st.chips;
    if (c.join() !== want.join() || new Set(c).size !== c.length || c.some(x => !S.seg[x]) || lineLetters.includes(q.given.decoy)
        || JSON.stringify(st.spec.pairs) !== JSON.stringify(pairs) || JSON.stringify(st.spec.chips) !== JSON.stringify(c)) {
      problems++; console.error(`✗ ${q.id}: chips ${c} / spec pairs ${JSON.stringify(st.spec.pairs)}: want the line's letters ${lineLetters} + one decoy side, each a side of the figure`);
    }
  }
  if (JSON.stringify(q.write.cross.pairs) !== JSON.stringify(pairs) || q.write.cross.fill.join() !== steps[steps.length - 1].answer.join()) { problems++; console.error(`✗ ${q.id}: the card is not the line, or its fill is not the last step's answer`); }
  fig7.push({ q: q.id, line: shown, lineRel, lineTrue, cosA, cosH, t: S.t, minLenGap, minProdGap, idents, decoy: q.given.decoy, boxes });

  /* 4 · every fill of every build step */
  steps.forEach((step, si) => {
    const c = step.chips, mode = step.spec.mode;
    let tried = 0, accepted = 0, rejected = 0, disagree = 0;
    const why = {};
    for (const x1 of c) for (const x2 of c) for (const x3 of c) for (const x4 of c) {
      tried++;
      const fill = [x1, x2, x3, x4];
      const [p, r] = mode === "prod" ? [[x1, x2], [x3, x4]] : [[x1, x4], [x2, x3]];
      const noDecoy = fill.every(x => lineLetters.includes(x));
      const saysNothing = pk(p) === pk(r);
      let right = false;
      if (noDecoy && !saysNothing) {
        const a = prod(p), b = prod(r), rel = Math.abs(a - b) / Math.max(a, b);
        right = rel < REL;
        if (!right && rel < GAP) { problems++; console.error(`✗ ${q.id}: ${fill} is ACCIDENTALLY almost true, move the foot`); }
      }
      const verdict = markRatio(fill, step.spec);
      why[verdict.why] = (why[verdict.why] || 0) + 1;
      if (verdict.ok) accepted++; else rejected++;
      if (verdict.ok !== right) {
        disagree++;
        if (disagree <= 5) console.error(`✗ ${q.id} step ${si + 1} (${mode}): ${fill}  marker ${verdict.ok} (${verdict.why}), oracle ${right}`);
      }
      if (!verdict.ok && verdict.why !== "pattern" && !(step.hints && step.hints[verdict.why])) { problems++; console.error(`✗ ${q.id} step ${si + 1}: the marker says "${verdict.why}" and the step has no hint for it`); }
      if (verdict.why === "decoy" && verdict.chip !== q.given.decoy) { problems++; console.error(`✗ ${q.id} step ${si + 1}: the decoy named is ${verdict.chip}, want ${q.given.decoy}`); }
    }
    if (!markRatio(step.answer, step.spec).ok) { problems++; console.error(`✗ ${q.id} step ${si + 1}: its own shown answer is marked wrong`); }
    const extra = Object.keys(step.hints || {}).filter(k => k !== "pattern" && !why[k]);
    if (extra.length) { problems++; console.error(`✗ ${q.id} step ${si + 1}: hints ${extra} never fire`); }
    problems += disagree;
    rows7.push({ q: q.id, step: si + 1, mode, chips: c.length, tried, accepted, rejected, disagree, why });
  });
}

console.log("\new7 (the product line: prod mode ☐ · ☐ = ☐ · ☐, cross mode ☐/☐ = ☐/☐; lengths from the coordinates)");
console.log("question  given line          true (rel)   right angle cos   ⊥ cos      t      smallest length gap  smallest non-identity product gap  identities  decoy");
for (const f of fig7) {
  console.log(`${f.q.padEnd(9)} ${f.line.padEnd(19)} ${(f.lineTrue ? "yes" : "NO").padEnd(4)} ${f.lineRel.toExponential(1).padStart(7)}  ${f.cosA.toExponential(1).padStart(15)}  ${f.cosH.toExponential(1).padStart(8)}  ${f.t.toFixed(2)}  ${(100 * f.minLenGap).toFixed(2).padStart(18)}%  ${(100 * f.minProdGap).toFixed(2).padStart(31)}%  ${String(f.idents).padStart(10)}  ${f.decoy}`);
}
console.log("question  step  mode   chips  fills tried  accepted  rejected  disagreements");
let T7 = 0, A7 = 0, R7 = 0, D7 = 0;
for (const r of rows7) {
  T7 += r.tried; A7 += r.accepted; R7 += r.rejected; D7 += r.disagree;
  console.log(`${r.q.padEnd(9)} ${String(r.step).padStart(4)}  ${r.mode.padEnd(5)}  ${String(r.chips).padStart(5)}  ${String(r.tried).padStart(11)}  ${String(r.accepted).padStart(8)}  ${String(r.rejected).padStart(8)}  ${String(r.disagree).padStart(13)}`);
  console.log(`          rejected because: ${Object.entries(r.why).filter(([k]) => k !== "ok").map(([k, v]) => `${k} ${v}`).join(", ")}`);
}
console.log(`TOTAL                   ${String(T7).padStart(11)}  ${String(A7).padStart(8)}  ${String(R7).padStart(8)}  ${String(D7).padStart(13)}`);

/* ======================= ew6 =======================
   The ew6 ORACLE, written from the round's rule, not from the marker. It
   reads only the COORDINATES (SKETCHES6: the corner, the two ends, the two
   cut points and their positions), the question's statement (q.given: the
   ratio the learner is told; q.ask: which two parts the question asks, top
   first) and the chips:
     the figure  D on AB and E on AC (strictly between), DE ∥ BC, measured
     the areas   shoelace: small Δ = ADE, big Δ = ABC, trapezium = DBCE
                 (a four-corner polygon, its own shoelace, not big − small)
                 small / big = the question's fraction (rel 1e-9): from a
                 side ratio a : b it is (a/(a+b))², from AD : AB = a : b it
                 is (a/b)², a given area ratio is itself
                 trapezium = big − small (rel 1e-9)
     the parts   lowest terms, by search: AD / AB = p / q from the measured
                 lengths (AE / AC must be the same), small / big = s / g
                 from the measured areas, the trapezium g − s; never a 1 as
                 a k-number; every arc label on the sketch is its piece's
                 parts and "k" ("k" alone for one part, never "1k")
     every fill  of every build step, chips^boxes:
                   "side" step  AD/AB = ☐/☐        right = [p, q]
                   "prod" step  = ☐ · ☐ / ☐ · ☐    right = [p, p, q, q]
                   "sub"  step  ☐k − ☐k = ☐k       right = [g, s, g − s]
                   "ask"  step  the asked ratio     right = the asked parts
                 against markRatio (mode "exact" → markExact, which never
                 reads a length), 0 disagreements; every reason the marker
                 gives has its own hint, every hint fires, the shown answer
                 is right. The pick step's right option is "big − small",
                 named from the figure's own corners. */
const polyArea = pts => Math.abs(pts.reduce((a, p, i) => { const q = pts[(i + 1) % pts.length]; return a + p.x * q.y - q.x * p.y; }, 0)) / 2;
const lowest = r => { for (let q = 1; q <= 60; q++) { const p = Math.round(r * q); if (p > 0 && Math.abs(p / q - r) <= 1e-9 * Math.max(1, r)) return [p, q]; } return null; };
const plain6 = s => String(s).replace(/ /g, " ");
const rows6 = [], fig6 = [];
for (const q of round6.eweQuestions) {
  const F = SKETCHES6[q.id], P = F.pts;
  const A = F.corner, [B, C] = F.ends, [D, E] = F.cuts;
  /* 0 · the figure */
  const onAB = lineDist(P[A], P[B], P[D]) < 1e-9 && onSegment(P[A], P[B], P[D]);
  const onAC = lineDist(P[A], P[C], P[E]) < 1e-9 && onSegment(P[A], P[C], P[E]);
  const de = vec(P[D], P[E]), bc = vec(P[B], P[C]);
  const parSin = Math.abs(de.x * bc.y - de.y * bc.x) / (Math.hypot(de.x, de.y) * Math.hypot(bc.x, bc.y));
  if (!onAB || !onAC || parSin > 1e-9) { problems++; console.error(`✗ ${q.id}: ${D} not on ${A}${B}, ${E} not on ${A}${C}, or ${D}${E} not ∥ ${B}${C} (sin ${parSin})`); }
  /* 1 · the areas, shoelace */
  const small = polyArea([P[A], P[D], P[E]]), big = polyArea([P[A], P[B], P[C]]), trap = polyArea([P[D], P[B], P[C], P[E]]);
  const g = q.given;
  const want = g.kind === "side" ? (g.a / (g.a + g.b)) ** 2 : g.kind === "whole" ? (g.a / g.b) ** 2 : g.small / g.big;
  const ratioRel = Math.abs(small / big - want) / want, trapRel = Math.abs(trap - (big - small)) / trap;
  if (!(ratioRel < REL)) { problems++; console.error(`✗ ${q.id}: small/big ${small / big} is not the question's ${want}`); }
  if (!(trapRel < REL)) { problems++; console.error(`✗ ${q.id}: the trapezium ${trap} is not big − small ${big - small}`); }
  /* 2 · the parts, lowest terms */
  const len = (X, Y) => dist(P[X], P[Y]);
  const [p, qq] = lowest(len(A, D) / len(A, B)) || [NaN, NaN];
  const sideAC = lowest(len(A, E) / len(A, C));
  if (!sideAC || sideAC[0] !== p || sideAC[1] !== qq) { problems++; console.error(`✗ ${q.id}: ${A}${E}/${A}${C} is not ${A}${D}/${A}${B}`); }
  const [s, gg] = lowest(small / big) || [NaN, NaN];
  const t = gg - s;
  const part = { small: s, big: gg, trap: t };
  if (s === 1 || t === 1 || gg === 1) { problems++; console.error(`✗ ${q.id}: a 1 as a k-number (${s}, ${gg}, ${t})`); }
  if (Math.abs(trap / big - t / gg) > 1e-9) { problems++; console.error(`✗ ${q.id}: the trapezium is not ${t} parts of ${gg}`); }
  const kl = n => (n === 1 ? "k" : `${n}k`);
  const arcs = (F.sketch.sideArcs || []).map(a => `${a.from}${a.to}:${a.label}`);
  const wantArcs = g.kind === "side" ? [`${A}${D}:${kl(p)}`, `${D}${B}:${kl(qq - p)}`, `${A}${B}:${kl(qq)}`]
                 : g.kind === "whole" ? [`${A}${D}:${kl(p)}`, `${A}${B}:${kl(qq)}`] : [];
  if (arcs.join() !== wantArcs.join() || arcs.some(a => /:1k$/.test(a))) { problems++; console.error(`✗ ${q.id}: arcs ${arcs}, want ${wantArcs}`); }
  /* the pick step: "big − small", named from the figure */
  const pick = q.steps.find(st => st.type === "pick");
  const right = pick && pick.options.find(o => o.correct);
  const pickOk = !!right && right.is === "big-small" && plain6(right.text) === `Opp Δ ${A}${B}${C} − Opp Δ ${A}${D}${E}`
              && plain6(pick.prompt).includes(`${D}${B}${C}${E}`) && pick.options.filter(o => o.correct).length === 1;
  if (!pickOk) { problems++; console.error(`✗ ${q.id}: the pick step's right option is not Opp Δ ${A}${B}${C} − Opp Δ ${A}${D}${E}`); }
  fig6.push({ q: q.id, given: g.kind === "area" ? `area ${g.small} : ${g.big}` : `${g.kind} ${g.a} : ${g.b}`, ratioRel, trapRel, side: `${p}/${qq}`, parts: `${s}, ${gg}, ${t}`,
              ask: q.ask.join("/"), arcs: arcs.map(a => a.split(":")[1]).join(" ") || "none" });
  /* 3 · every fill of every build step */
  q.steps.forEach((step, si) => {
    if (step.type !== "build") return;
    const c = step.chips;
    const right6 = { side: [p, qq], prod: [p, p, qq, qq], sub: [gg, s, t], ask: q.ask.map(k => part[k]) }[step.role];
    if (!right6) { problems++; console.error(`✗ ${q.id} step ${si + 1}: unknown role ${step.role}`); return; }
    const want6 = right6.map(String);
    const slots = step.frame.flatMap(u => (u === "=" ? [] : Array.isArray(u) ? u : [...u.n, ...u.d])).filter(x => x === "☐").length;
    if (slots !== want6.length || new Set(c).size !== c.length || want6.some(x => !c.includes(x))) { problems++; console.error(`✗ ${q.id} step ${si + 1}: ${slots} boxes / chips ${c} cannot hold ${want6}`); }
    let tried = 0, accepted = 0, rejected = 0, disagree = 0;
    const why = {};
    const fills = [[]];
    for (let k = 0; k < slots; k++) { const next = []; for (const f of fills) for (const x of c) next.push([...f, x]); fills.splice(0, fills.length, ...next); }
    for (const fill of fills) {
      tried++;
      const oracle = fill.every((x, i) => x === want6[i]);
      const verdict = markRatio(fill, step.spec);
      why[verdict.why] = (why[verdict.why] || 0) + 1;
      if (verdict.ok) accepted++; else rejected++;
      if (verdict.ok !== oracle) { disagree++; if (disagree <= 5) console.error(`✗ ${q.id} step ${si + 1} (${step.role}): ${fill}  marker ${verdict.ok} (${verdict.why}), oracle ${oracle}`); }
      if (!verdict.ok && verdict.why !== "pattern" && !(step.hints && step.hints[verdict.why])) { problems++; console.error(`✗ ${q.id} step ${si + 1}: the marker says "${verdict.why}" and the step has no hint for it`); }
    }
    if (!markRatio(step.answer, step.spec).ok) { problems++; console.error(`✗ ${q.id} step ${si + 1}: its own shown answer is marked wrong`); }
    const extra = Object.keys(step.hints || {}).filter(k => k !== "pattern" && !why[k]);
    if (extra.length) { problems++; console.error(`✗ ${q.id} step ${si + 1}: hints ${extra} never fire`); }
    if (!(step.hints && step.hints.pattern) && why.pattern) { problems++; console.error(`✗ ${q.id} step ${si + 1}: no pattern hint`); }
    problems += disagree;
    rows6.push({ q: q.id, step: si + 1, role: step.role, chips: c.length, tried, accepted, rejected, disagree, why });
  });
}
console.log("\new6 (the trapezium: areas by shoelace from the coordinates; every fill of every build step)");
console.log("question  given         small/big rel  trap rel   AD/AB  parts (small, big, trap)  asked       arcs");
for (const f of fig6) {
  console.log(`${f.q.padEnd(9)} ${f.given.padEnd(13)} ${f.ratioRel.toExponential(1).padStart(13)}  ${f.trapRel.toExponential(1).padStart(8)}  ${f.side.padStart(5)}  ${f.parts.padEnd(24)}  ${f.ask.padEnd(10)}  ${f.arcs}`);
}
console.log("question  step  role  chips  fills tried  accepted  rejected  disagreements");
let T6 = 0, A6 = 0, R6 = 0, D6 = 0;
for (const r of rows6) {
  T6 += r.tried; A6 += r.accepted; R6 += r.rejected; D6 += r.disagree;
  console.log(`${r.q.padEnd(9)} ${String(r.step).padStart(4)}  ${r.role.padEnd(4)}  ${String(r.chips).padStart(5)}  ${String(r.tried).padStart(11)}  ${String(r.accepted).padStart(8)}  ${String(r.rejected).padStart(8)}  ${String(r.disagree).padStart(13)}`);
  console.log(`          rejected because: ${Object.entries(r.why).filter(([k]) => k !== "ok").map(([k, v]) => `${k} ${v}`).join(", ")}`);
}
console.log(`TOTAL                   ${String(T6).padStart(11)}  ${String(A6).padStart(8)}  ${String(R6).padStart(8)}  ${String(D6).padStart(13)}`);

if (problems) { console.error(`\n✗ ${problems} problem(s).`); process.exit(1); }
console.log("\n✓ the marker agrees with the length oracle on every fill (ew1, ew2, ew3, ew4 and ew7), every ew5 question has exactly one true leftover, the marked one, every ew7 line is true in its own generic figure, and every ew6 fill agrees with the shoelace areas.");
