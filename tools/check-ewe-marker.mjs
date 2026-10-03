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

   ew8 (the fractions are built: two triangles, or sides in ratio?) at the
   very end: no fills. From each figure's coordinates and drawn lines alone
   the oracle names every segment of the shown fractions (a ∥ line, a whole
   side, a piece at the corner or a bottom piece), decides the kind, proves
   every shown equality true and, for two triangles, that every top and its
   bottom are matching sides of the two Δs; then compares with the button
   the round marks right.

   ew9 (read the two triangles, or the reason, off the fractions) at the
   very end: from each figure's coordinates and drawn lines alone the
   oracle proves the given fractions (and, for her p.55 kind, the exam
   line) true, decides the form (each fraction one Δ, or the tops one Δ
   and the bottoms the other, or neither: sides in ratio), which Δ is named
   FIRST and the corner correspondence; proves the two written names
   similar IN THEIR ORDER (three side ratios equal); checks every lit pair
   is two sides of the Δ it is marked as; then tries every fill of every
   build (27 per name build, 216 per reason line) against it.

   Run: node tools/check-ewe-marker.mjs        (exit 1 on any disagreement) */
import { markRatio, segLength, dist } from "../js/ewe-core.js";
import { round, TRIANGLES } from "../js/rounds/ewe1-watter-sye.js";
import { round as round2, TRIANGLES as TRIANGLES2 } from "../js/rounds/ewe2-met-die-lyne.js";
import { round as round3, SKETCHES as SKETCHES3 } from "../js/rounds/ewe3-deel-n-sy.js";
import { round as round4, SKETCHES as SKETCHES4 } from "../js/rounds/ewe4-deel-n-hoek.js";
import { round as round5, SKETCHES as SKETCHES5 } from "../js/rounds/ewe5-watter-een.js";
import { round as round6, SKETCHES as SKETCHES6 } from "../js/rounds/ewe6-die-trapesium.js";
import { round as round7, SKETCHES as SKETCHES7 } from "../js/rounds/ewe7-vreemde-formaat.js";
import { round as round8, FIGS as FIGS8 } from "../js/rounds/ewe8-driehoeke-of-sye.js";
import { round as round9, FIGS as FIGS9 } from "../js/rounds/ewe9-lees-dit-af.js";
import { round as round10, FIGS as FIGS10 } from "../js/rounds/ewe10-die-bewys.js";

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

/* ---------------- ew8: "Driehoeke of sye?" ----------------
   No fills: one tap per question. The ew8 ORACLE, written from her rule
   and the figure, never from the round's answers. It reads only FIGS8 (the
   coordinates, the lines drawn and the fractions shown, by their letters):
     the figure  from the coordinates and the drawn lines alone: the two
                 drawn lines that carry a point strictly inside them are the
                 cut sides; their common end is the corner; the other two
                 drawn lines are the ∥ lines, measured parallel
     a segment   named in a fraction is a ∥ LINE (a drawn line with no point
                 inside it, parallel to another drawn line), a PIECE (part of
                 a cut side) at the corner or away from it (a BOTTOM piece),
                 or a WHOLE cut side
     the kind    a ∥ line and no bottom piece: "driehoeke"; a bottom piece
                 and no ∥ line: "sye"; BOTH or NEITHER: a BUILD ERROR
                 (neither is the both-ways form she ruled out)
     true        every shown equality from the coordinates (rel 1e-9)
     driehoeke   every top a side of one Δ, every bottom the MATCHING side
                 of the other (the homothety at the corner maps one onto the
                 other, measured), all tops from the same Δ
   Then, and only then, the oracle's kind is compared with the option the
   round marks right: 0 disagreements. */
const rows8 = [];
let D8 = 0;
for (const q of round8.eweQuestions) {
  const F = FIGS8[q.id], P = F.pts, names = Object.keys(P);
  const near = (X, Y) => dist(X, Y) < 1e-9;
  const between = (X, Y, Z) => lineDist(X, Y, Z) < 1e-9 && onSegment(X, Y, Z) && !near(Z, X) && !near(Z, Y);
  const drawn = F.lines.map(([a, b]) => ({ a, b, inner: names.filter(k => k !== a && k !== b && between(P[a], P[b], P[k])) }));
  const cutSides = drawn.filter(l => l.inner.length);
  const parLines = drawn.filter(l => !l.inner.length);
  const sinOf = (l, m) => { const u = vec(P[l.a], P[l.b]), v = vec(P[m.a], P[m.b]); return Math.abs(cross(u, v)) / (Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y)); };
  let err = [];
  if (cutSides.length !== 2 || parLines.length !== 2) err.push(`${cutSides.length} cut sides, ${parLines.length} other lines`);
  const corner = cutSides.length === 2 ? [cutSides[0].a, cutSides[0].b].find(k => k === cutSides[1].a || k === cutSides[1].b) : null;
  if (!corner) err.push("no corner");
  if (parLines.length === 2 && !(sinOf(parLines[0], parLines[1]) < 1e-9)) err.push("the two other lines are not ∥");
  /* what each named segment is */
  const sameSeg = (s, l) => (s[0] === l.a && s[1] === l.b) || (s[0] === l.b && s[1] === l.a);
  const what = s => {
    if (parLines.some(l => sameSeg(s, l))) return "par";
    const side = cutSides.find(l => [l.a, l.b, ...l.inner].includes(s[0]) && [l.a, l.b, ...l.inner].includes(s[1]));
    if (!side) return "unknown";
    if (sameSeg(s, side)) return "whole";
    return s.includes(corner) ? "corner-piece" : "bottom";
  };
  const segs = F.fracs.flat();
  const kinds = segs.map(s => what(s));
  const hasPar = kinds.includes("par"), hasBottom = kinds.includes("bottom");
  if (kinds.includes("unknown")) err.push(`a segment not in the figure (${segs.filter((s, i) => kinds[i] === "unknown")})`);
  const oracle = hasPar && !hasBottom ? "driehoeke" : hasBottom && !hasPar ? "sye" : "BUILD ERROR";
  if (oracle === "BUILD ERROR") err.push(hasPar ? "a ∥ line AND a bottom piece" : "neither a ∥ line nor a bottom piece (the both-ways form)");
  /* every shown equality true, from the coordinates */
  const len = s => dist(P[s[0]], P[s[1]]);
  const vals = F.fracs.map(([a, b]) => len(a) / len(b));
  const rel = Math.max(...vals.map(v => Math.abs(v - vals[0]) / vals[0]));
  if (!(rel < REL)) err.push(`the fractions are not equal (rel ${rel})`);
  /* driehoeke: tops from one Δ, bottoms the matching sides of the other */
  let match = "-";
  if (oracle === "driehoeke" && corner) {
    const cuts = cutSides.map(l => l.inner[0]), ends = cutSides.map(l => (l.a === corner ? l.b : l.a));
    const small = new Set([corner, ...cuts]), big = new Set([corner, ...ends]);
    const k = dist(P[corner], P[cuts[0]]) / dist(P[corner], P[ends[0]]);
    const k2 = dist(P[corner], P[cuts[1]]) / dist(P[corner], P[ends[1]]);
    if (!(Math.abs(k - k2) / k < REL)) err.push("the cut points are not at the same fraction of their sides");
    /* the homothety at the corner, ratio k: small point -> big point */
    const up = X => ({ x: P[corner].x + (P[X].x - P[corner].x) / k, y: P[corner].y + (P[X].y - P[corner].y) / k });
    const image = X => (X === corner ? P[corner] : up(X));
    const inTri = (s, set) => set.has(s[0]) && set.has(s[1]);
    const triOf = s => (inTri(s, small) ? "small" : inTri(s, big) ? "big" : "none");
    const tops = F.fracs.map(f => triOf(f[0])), bots = F.fracs.map(f => triOf(f[1]));
    const sameTop = new Set(tops).size === 1 && !tops.includes("none") && new Set(bots).size === 1 && tops[0] !== bots[0];
    const matching = F.fracs.every(([a, b]) => {
      const [s, g] = triOf(a) === "small" ? [a, b] : [b, a];
      const i0 = image(s[0]), i1 = image(s[1]);
      return (near(i0, P[g[0]]) && near(i1, P[g[1]])) || (near(i0, P[g[1]]) && near(i1, P[g[0]]));
    });
    match = sameTop && matching ? `tops ${tops[0]}, bottoms ${bots[0]}, matching` : "NOT matching";
    if (!(sameTop && matching)) err.push("a top is not a side of one Δ with the matching side of the other below it");
    /* Foreman review 2026-10-03: the card's similarity line names FIRST the
       Δ whose sides are the tops. Read "Δ XYZ ||| Δ UVW" off the card: X↔U,
       Y↔V, Z↔W must be the homothety's pairs (corners in matching order),
       every top a side of the first Δ and the bottom under it the side its
       corners map to in the second */
    const sim = String((q.write && q.write.sim) || "").replace(/ /g, " ").match(/^Δ (\S+) \|\|\| Δ (\S+)$/);
    let order = "NO CARD LINE";
    if (sim) {
      const [first, second] = [[...sim[1]], [...sim[2]]];
      const firstSet = first.every(k => small.has(k)) ? "small" : first.every(k => big.has(k)) ? "big" : "none";
      const secondOk = second.every(k => (firstSet === "small" ? big : small).has(k));
      /* the homothety pairs the corners: small X -> big U, place by place */
      const paired = first.length === 3 && second.length === 3 && first.every((k, i) => {
        const [s, g] = firstSet === "small" ? [k, second[i]] : [second[i], k];
        return near(image(s), P[g]);
      });
      const map = Object.fromEntries(first.map((k, i) => [k, second[i]]));
      const topsFirst = F.fracs.every(([a, b]) => first.includes(a[0]) && first.includes(a[1])
        && ((map[a[0]] === b[0] && map[a[1]] === b[1]) || (map[a[0]] === b[1] && map[a[1]] === b[0])));
      const ok = firstSet === tops[0] && secondOk && paired && topsFirst;
      order = `${ok ? "" : "NOT "}first Δ ${sim[1]} (${firstSet}) = the tops' Δ, corners paired`;
      if (!ok) err.push(`the card names Δ ${sim[1]} first, but the tops are sides of the ${tops[0]} Δ (or the corners do not pair up)`);
    } else err.push("a triangles question without its similarity line on the card");
    match += `; ${order}`;
  }
  /* only now: the round's own answer */
  const step = q.steps[0];
  const marked = step.options.filter(o => o.correct).map(o => o.text);
  const markedKind = marked.length === 1 ? (marked[0] === "gelykvormige driehoeke" ? "driehoeke" : marked[0] === "sye in verhouding" ? "sye" : "?") : "?";
  const disagree = markedKind !== oracle ? 1 : 0;
  if (disagree) err.push(`the round marks "${marked}", the figure says ${oracle}`);
  /* every wrong option carries a hint, and both buttons are her two words */
  if (step.options.map(o => o.text).join("|") !== "gelykvormige driehoeke|sye in verhouding") err.push("the buttons are not her two words in her order");
  if (step.options.some(o => !o.correct && !o.hint)) err.push("a wrong option without a hint");
  D8 += disagree;
  problems += err.length;
  err.forEach(e => console.error(`✗ ${q.id}: ${e}`));
  rows8.push({ q: q.id, fr: F.fracs.map(([a, b]) => `${a}/${b}`).join(" = "), kinds: segs.map((s, i) => `${s}:${kinds[i]}`).join(" "), oracle, marked: markedKind, rel, match, disagree });
}
console.log("\new8 (no fills: the kind of each fraction set decided from the figure alone, then compared with the marked button)");
console.log("question  fractions shown               oracle      marked      disagree  equal (rel)  triangles");
for (const r of rows8) {
  console.log(`${r.q.padEnd(9)} ${r.fr.padEnd(28)}  ${r.oracle.padEnd(10)}  ${r.marked.padEnd(10)}  ${String(r.disagree).padStart(8)}  ${r.rel.toExponential(1).padStart(11)}  ${r.match}`);
  console.log(`          segments: ${r.kinds}`);
}
console.log(`TOTAL     ${rows8.length} questions, ${D8} disagreements, ${rows8.filter(r => r.oracle === "BUILD ERROR").length} build errors`);

/* ---------------- ew9: "Lees dit af" ----------------
   The ew9 ORACLE, written from her rules and the figure, never from the
   round's answers. It reads FIGS9 (the coordinates, the drawn lines, the
   given fractions by their letters and, for her p.55 kind, the exam line):
     a triangle  three different points, not on one line, each of its three
                 sides lying on a drawn line
     true        every given equality from the coordinates (rel 1e-9); for
                 her p.55 kind also the exam line QR² = RS · RP
     the form    WITHIN when each fraction's two sides make a triangle (her
                 rule 24: QR/RS = RP/QR, JK/FK = GH/FH); else ACROSS when the
                 two tops make one and the two bottoms the other (AD/AB =
                 DE/BC); else NEITHER, sides in ratio (the round must then
                 ask for the reason line)
     first       within: the LEFT fraction's Δ; across: the TOPS' Δ (ew8's
                 foreman rule)
     the pairing within a/b = c/d pairs a with c and b with d; across, a with
                 b and c with d. The corner the two sides of one Δ share
                 goes to the corner the other two share; the other ends
                 follow; the third corner goes to the third
     similar     the two names AS WRITTEN (the given first name and the right
                 fill of the name build): the three side ratios equal (rel
                 1e-9), corner i with corner i
     lit pairs   the sides lit in colour 1 (arcs on the sketch and the
                 coloured cells of the given line) are exactly the first Δ's
                 two sides of the fractions, both of them sides of the Δ the
                 first pick marks right; colour 2 the same for the second
     every fill  of every name build (its 3 letters in 3 boxes, 27): right
                 when the written order is similar by the side ratios, a
                 repeated corner never; of every reason line (6 chips in 3
                 boxes, 216): right when box 1 is a triangle whose two sides
                 the ∥ line cuts strictly inside, and boxes 2 and 3 are that
                 line and the third side of that triangle, measured ∥, in
                 either order. Against markRatio (mode "name" → markName,
                 mode "exact" with `free` → markExact), 0 disagreements;
                 every reason the marker gives has its hint, every hint
                 fires, the shown answer is right. */
const rows9 = [];
let D9 = 0, MAXREL9 = 0;
const dist9 = (P, Q) => Math.hypot(P.x - Q.x, P.y - Q.y);
for (const q of round9.eweQuestions) {
  const F = FIGS9[q.id], P = F.pts;
  const err = [];
  const near = (X, Y) => dist9(X, Y) < 1e-9;
  const len = s => dist9(P[s[0]], P[s[1]]);
  const rel = (x, y) => Math.abs(x - y) / Math.max(Math.abs(x), Math.abs(y));
  const onDrawn = (X, Y) => F.lines.some(([a, b]) => [X, Y].every(k => lineDist(P[a], P[b], P[k]) < 1e-9 && onSegment(P[a], P[b], P[k])));
  const isTri = L => L.length === 3 && new Set(L).size === 3 && L.every(k => P[k])
    && Math.abs(cross(vec(P[L[0]], P[L[1]]), vec(P[L[0]], P[L[2]]))) > 1e-6
    && onDrawn(L[0], L[1]) && onDrawn(L[1], L[2]) && onDrawn(L[0], L[2]);
  const letters = (s, t) => [...new Set([...s, ...t])];
  const shared = (s, t) => [...s].find(c => t.includes(c));
  /* 1 · the given fractions, and the exam line, true */
  const [[a, b], [c, d]] = F.fracs;
  const fr = rel(len(a) / len(b), len(c) / len(d));
  let worst = fr;
  if (!(fr < REL)) err.push(`the given fractions are not equal (rel ${fr})`);
  let exam = "-";
  if (F.exam) {
    const [sq, p1, p2] = F.exam, er = rel(len(sq) ** 2, len(p1) * len(p2));
    worst = Math.max(worst, er);
    exam = `${sq}² = ${p1} · ${p2} (rel ${er.toExponential(1)})`;
    if (!(er < REL)) err.push(`the exam line ${sq}² = ${p1} · ${p2} is not true (rel ${er})`);
  }
  /* 2 · the form, from the figure */
  const within = isTri(letters(a, b)) && isTri(letters(c, d)) && letters(a, b).sort().join() !== letters(c, d).sort().join();
  const across = !within && isTri(letters(a, c)) && isTri(letters(b, d)) && letters(a, c).sort().join() !== letters(b, d).sort().join();
  const form = within ? "within" : across ? "across" : "sides";
  const want = form === "sides" ? "sye" : "driehoeke";
  if (q.kind !== want) err.push(`the figure says ${form}, the round has a "${q.kind}" question`);
  let tried = 0, accepted = 0, rejected = 0, disagree = 0, sim = "-", lit = "-", first = "-", order = "-";
  const why = {};
  const fills = (chips, k) => { let fs = [[]]; for (let i = 0; i < k; i++) fs = fs.flatMap(f => chips.map(x => [...f, x])); return fs; };
  const runFills = (step, oracle) => {
    for (const fill of fills(step.chips, step.answer.length)) {
      tried++;
      const o = oracle(fill), v = markRatio(fill, step.spec);
      why[v.why] = (why[v.why] || 0) + 1;
      if (v.ok) accepted++; else rejected++;
      if (v.ok !== o) { disagree++; if (disagree <= 5) err.push(`fill ${fill.join(" ")}: marker ${v.ok} (${v.why}), oracle ${o}`); }
      if (!v.ok && v.why !== "pattern" && !(step.hints && step.hints[v.why])) err.push(`the marker says "${v.why}" and the step has no hint for it`);
    }
    if (!markRatio(step.answer, step.spec).ok) err.push("its own shown answer is marked wrong");
    const extra = Object.keys(step.hints || {}).filter(k => k !== "pattern" && !why[k]);
    if (extra.length) err.push(`hints ${extra} never fire`);
    if (!(step.hints && step.hints.pattern) && why.pattern) err.push("no pattern hint");
  };
  if (form !== "sides") {
    /* 3 · which Δ first, and the pairing, from the fractions */
    const [s1, s2] = within ? [[a, b], [c, d]] : [[a, c], [b, d]];     // the first Δ's two sides, the second's
    const pairs = within ? [[a, c], [b, d]] : [[a, b], [c, d]];         // side of the first ↔ side of the second
    const T1 = letters(...s1), T2 = letters(...s2);
    const map = {};
    const v1 = shared(...s1), v2 = shared(...s2);
    map[v1] = v2;
    for (const [x, y] of pairs) { const xo = [...x].find(k => k !== v1), yo = [...y].find(k => k !== v2); if (xo && yo && !(xo in map)) map[xo] = yo; }
    const third1 = T1.find(k => !(k in map)), third2 = T2.find(k => !Object.values(map).includes(k));
    if (third1) map[third1] = third2;
    const written1 = q.tris.first, step3 = q.steps.find(st => st.type === "build");
    const written2 = step3 ? step3.answer.join("") : "";
    first = `${written1} (${form === "within" ? "the left fraction's Δ" : "the tops' Δ"} is ${T1.join("")})`;
    if ([...written1].sort().join() !== [...T1].sort().join()) err.push(`the first name ${written1} is not the ${form === "within" ? "left fraction's" : "tops'"} Δ ${T1.join("")}`);
    const paired = [...written1].every((k, i) => map[k] === written2[i]);
    order = `${written1} → ${written2}: ${paired ? "" : "NOT "}corner by corner as the fractions pair them`;
    if (!paired) err.push(`Δ ${written1} ||| Δ ${written2} does not pair the corners as the fractions do (${JSON.stringify(map)})`);
    /* 4 · similar in the WRITTEN order, from the coordinates */
    const simOf = (X, Y) => {
      if (new Set(Y).size < 3 || !isTri([...Y])) return null;
      const r = [[0, 1], [1, 2], [0, 2]].map(([i, j]) => len(X[i] + X[j]) / len(Y[i] + Y[j]));
      return Math.max(rel(r[0], r[1]), rel(r[1], r[2]), rel(r[0], r[2]));
    };
    const sr = simOf(written1, written2);
    worst = Math.max(worst, sr ?? 1);
    sim = `${sr != null ? sr.toExponential(1) : "not a Δ"}`;
    if (!(sr != null && sr < REL)) err.push(`Δ ${written1} and Δ ${written2} are not similar in the written order (rel ${sr})`);
    /* 5 · the lit pairs: arcs and coloured cells, against the Δ each pick marks right */
    const picks = q.steps.filter(st => st.type === "pick");
    const right = picks.map(st => { const r = st.options.filter(o => o.correct); return r.length === 1 ? r[0].text.replace(/^Δ\s/, "") : null; });
    const sideOf = (s, tri) => [...s].every(k => tri.includes(k));
    const key = s => [...s].sort().join("");
    const arcsLit = (sk, k) => (sk.sideArcs || []).filter(x => x.tone === k && !x.hidden).map(x => key(x.from + x.to)).sort();
    const cellsLit = (line, k) => line.fracs.flatMap(f => [[f.n, (f.tone || [])[0]], [f.d, (f.tone || [])[1]]]).filter(([, t]) => t === k).map(([s]) => key(s)).sort();
    const lit1 = { arcs: arcsLit(q.sketch, 1), cells: cellsLit(q.fracLine, 1) };
    const lit2 = { arcs: arcsLit(picks[0].sketchAfter, 2), cells: cellsLit(picks[0].fracLineAfter, 2) };
    const w1 = s1.map(key).sort(), w2 = s2.map(key).sort();
    const ok1 = lit1.arcs.join() === w1.join() && lit1.cells.join() === w1.join() && right[0] && s1.every(s => sideOf(s, right[0])) && key(right[0]) === key(T1.join(""));
    const ok2 = lit2.arcs.join() === w2.join() && lit2.cells.join() === w2.join() && right[1] && s2.every(s => sideOf(s, right[1])) && key(right[1]) === key(T2.join(""));
    lit = `colour 1 ${w1.join(", ")} → Δ ${right[0]} ${ok1 ? "ok" : "NOT"}; colour 2 ${w2.join(", ")} → Δ ${right[1]} ${ok2 ? "ok" : "NOT"}`;
    if (!ok1) err.push(`colour 1 lights ${JSON.stringify(lit1)}, want ${w1} (sides of Δ ${T1.join("")}), pick 1 marks ${right[0]}`);
    if (!ok2) err.push(`colour 2 lights ${JSON.stringify(lit2)}, want ${w2} (sides of Δ ${T2.join("")}), pick 2 marks ${right[1]}`);
    /* her ruling 3 Oct 15:58: until the name build the second Δ is SHOWN
       scrambled (pick 2's option, the name with the fractions), never in an
       order that would be right: the same letters, not similar as written */
    const shown = q.tris.shown || "", shownSim = simOf(written1, shown);
    if (key(shown) !== key(T2.join("")) || shown === written2 || right[1] !== shown || (shownSim != null && shownSim < REL))
      err.push(`the second Δ is shown as ${shown}: not a scrambled (wrong) order of Δ ${written2}, or pick 2 does not show it`);
    /* every wrong pick option carries a hint, and only one is right */
    picks.forEach((st, i) => { if (st.options.filter(o => o.correct).length !== 1 || st.options.some(o => !o.correct && !o.hint)) err.push(`pick ${i + 1}: not exactly one right option, or a wrong one without a hint`); });
    /* 6 · every fill of the name build */
    if (!step3 || step3.spec.mode !== "name") err.push("no name build");
    else {
      if ([...step3.chips].sort().join() !== [...T2].sort().join()) err.push(`the name build's chips ${step3.chips} are not the letters of Δ ${T2.join("")}`);
      runFills(step3, fill => { const r = simOf(written1, fill.join("")); return r != null && r < REL; });
    }
  } else {
    /* 6 · every fill of the reason line: lyn ∥ een sy v. Δ ☐, ☐ ∥ ☐ */
    const step = q.steps.find(st => st.type === "build");
    const strictlyIn = (X, Y, Z) => lineDist(P[X], P[Y], P[Z]) < 1e-9 && onSegment(P[X], P[Y], P[Z]) && !near(P[Z], P[X]) && !near(P[Z], P[Y]);
    const par = (s, t) => Math.abs(cross(vec(P[s[0]], P[s[1]]), vec(P[t[0]], P[t[1]]))) / (len(s) * len(t)) < 1e-9;
    const reasonOk = ([T, l1, l2]) => {
      if (T.length !== 3 || l1.length !== 2 || l2.length !== 2 || !isTri([...T]) || key2(l1) === key2(l2)) return false;
      if (!onDrawn(l1[0], l1[1]) || !onDrawn(l2[0], l2[1]) || !par(l1, l2)) return false;
      const sides = [[T[0], T[1]], [T[1], T[2]], [T[0], T[2]]];
      /* the cutting line: each end strictly inside a DIFFERENT side of the Δ */
      const cuts = l => { const hit = [...l].map(e => sides.findIndex(([x, y]) => strictlyIn(x, y, e))); return hit.every(h => h >= 0) && hit[0] !== hit[1] ? hit : null; };
      const third = (l, hit) => sides.some(([x, y], i) => !hit.includes(i) && key2(x + y) === key2(l));
      const h1 = cuts(l1), h2 = cuts(l2);
      return (!!h1 && third(l2, h1)) || (!!h2 && third(l1, h2));
    };
    function key2(s) { return [...s].sort().join(""); }
    if (!step || step.spec.mode !== "exact" || !step.spec.free) err.push("no reason-line build (exact, with an order-free pair)");
    else runFills(step, reasonOk);
    /* the given fractions: pieces on two lines (her ew8 rule): every segment lies on a drawn line */
    if (![a, b, c, d].every(s => onDrawn(s[0], s[1]))) err.push("a given segment is not drawn");
  }
  MAXREL9 = Math.max(MAXREL9, worst);
  D9 += disagree;
  problems += err.length;
  err.forEach(e => console.error(`✗ ${q.id}: ${e}`));
  rows9.push({ q: q.id, form, fr: `${a}/${b} = ${c}/${d}`, rel: fr, exam, first, order, sim, lit, tried, accepted, rejected, disagree, why });
}
console.log("\new9 (the triangles read off the fractions, or the reason line; from the coordinates; every fill of every build)");
console.log("question  form     given           equal (rel)  first named / pairing / similar in the written order (rel)");
for (const r of rows9) {
  console.log(`${r.q.padEnd(9)} ${r.form.padEnd(8)} ${r.fr.padEnd(15)} ${r.rel.toExponential(1).padStart(11)}  ${r.form === "sides" ? "sides in ratio: the reason line" : `${r.first}; ${r.order}; similar ${r.sim}`}`);
  if (r.exam !== "-") console.log(`          exam line ${r.exam}`);
  if (r.lit !== "-") console.log(`          lit ${r.lit}`);
  console.log(`          fills ${r.tried}, accepted ${r.accepted}, rejected ${r.rejected}, disagreements ${r.disagree}; rejected because: ${Object.entries(r.why).filter(([k]) => k !== "ok").map(([k, v]) => `${k} ${v}`).join(", ")}`);
}
console.log(`TOTAL     ${rows9.length} questions, ${rows9.reduce((s, r) => s + r.tried, 0)} fills, ${D9} disagreements, largest error in an equality that must hold ${MAXREL9.toExponential(1)}`);

/* ---------------- ew10: "Die bewys" ----------------
   The ew10 ORACLE, from the coordinates (FIGS10: the points, the heights
   with their feet and the line each stands on, the triangles by role, the
   drawn lines and the joins), never from the marker:
     the figure  ST ∥ QR; each height PERPENDICULAR to the side it stands on
                 (dot product, relative 1e-9) with its foot strictly inside
                 its piece of the small Δ (PS, PT); X on QT and on RS
     the areas   every area line true by shoelace: ½ · base · height = the
                 named Δ's area, both of them, so the ratio is the bases';
                 Δ QST = Δ STR; for proof 2 Δ PQT = Δ PSR; the statement
                 true by lengths
     the height  in each area step, the step's height (spec.H) is the one
                 perpendicular to the step's flat line, the other one not;
                 the turned sketch lays THAT line flat; its ✓ line, its
                 struck letter, its hint and the card use that letter (her
                 exam page names them the other way round in Q3)
     every fill  Verbind ☐ en ☐: right when both are NEW lines (not on a
                 drawn line) that cross inside the figure; ½ · ☐ · ☐ over
                 ½ · ☐ · ☐: right when ½ · top = the first Δ's area and
                 ½ · bottom = the second's; Opp Δ ☐ = Opp Δ ☐: right when the
                 two are different triangles of equal area; ∴ ☐/☐ = ☐/☐:
                 right when it states exactly the statement asked (either
                 fraction first), and a fill that is TRUE by lengths but not
                 the one asked must get "form". Against markRatio, 0
                 disagreements; every reason has its hint, every hint fires
     her ruling  3 Oct 15:58: no text shown before a build (intro, the
                 Bewys line, a shown line, a prompt, a ✓ line, an option)
                 carries that build's answer: not the joins before step 1
                 (Q3's exam konstruksie only up to the heights), not a
                 "basis · height" product before its area step, not the
                 equal-areas line before step 4. The statement itself is
                 exempt: the question must show what to prove. */
const rows10 = [];
let D10 = 0, MAXREL10 = 0;
const pl10 = s => String(s).replace(/ /g, " ");
for (const q of round10.eweQuestions) {
  const F = FIGS10[q.id], P = F.pts, R = q.roles, err = [];
  const L = (a, b) => dist(P[a], P[b]);
  const lenOf = c => (F.heights[c] ? dist(P[F.heights[c].from], F.heights[c].foot) : F.seg[c] ? L(F.seg[c].from, F.seg[c].to) : NaN);
  const rel = (x, y) => Math.abs(x - y) / Math.max(Math.abs(x), Math.abs(y), 1e-300);
  const area = t => shoelace([...t].map(k => P[k]));
  let worst = 0;
  const must = (ok, what, r) => { if (r != null) worst = Math.max(worst, r); if (!ok) err.push(what); };
  /* 1 · the figure */
  const par = Math.abs(cross(vec(P[R.S], P[R.T]), vec(P[R.Q], P[R.R]))) / (L(R.S, R.T) * L(R.Q, R.R));
  must(par < REL, `ST is not ∥ QR (${par})`, par);
  const hRows = [];
  for (const [k, h] of Object.entries(F.heights)) {
    const v = vec(P[h.from], h.foot), w = vec(P[h.onto[0]], P[h.onto[1]]);
    const dot = Math.abs(v.x * w.x + v.y * w.y) / (Math.hypot(v.x, v.y) * Math.hypot(w.x, w.y));
    const [a, b] = h.piece, ab = vec(P[a], P[b]), af = vec(P[a], h.foot);
    const u = (af.x * ab.x + af.y * ab.y) / (ab.x * ab.x + ab.y * ab.y), off = Math.abs(cross(ab, af)) / Math.hypot(ab.x, ab.y);
    must(dot < REL, `height ${k} is not perpendicular to ${h.onto.join("")} (cos ${dot})`, dot);
    must(u > 1e-6 && u < 1 - 1e-6 && off < 1e-9, `the foot of ${k} is not strictly inside ${a}${b} (u ${u})`);
    hRows.push(`${k} from ${h.from} ⊥ ${h.onto.join("")} (cos ${dot.toExponential(1)}), foot at ${u.toFixed(3)} of ${a}${b}`);
  }
  const onLine = (A, B, X) => lineDist(P[A], P[B], X) < 1e-9;
  must(onLine(F.joins[0][0], F.joins[0][1], F.X) && onLine(F.joins[1][0], F.joins[1][1], F.X), "X is not where the two joins meet");
  /* 2 · the areas */
  const tri = F.tri;
  const eqLR = rel(area(tri.left), area(tri.right));
  must(eqLR < REL, `Δ ${tri.left} and Δ ${tri.right} differ in area (${eqLR})`, eqLR);
  let eqW = null;
  if (q.proof === 2) { eqW = rel(area(tri.wholeL), area(tri.wholeR)); must(eqW < REL, `Δ ${tri.wholeL} and Δ ${tri.wholeR} differ in area (${eqW})`, eqW); }
  const [a0, b0, c0, d0] = R.bewys, st = rel(lenOf(a0) / lenOf(b0), lenOf(c0) / lenOf(d0));
  must(st < REL, `the statement ${a0}/${b0} = ${c0}/${d0} is not true (${st})`, st);
  /* 3 · every fill of every build, against the oracle */
  let tried = 0, accepted = 0, rejected = 0, disagree = 0, accidental = 0, mixedH = 0, coincide = 0;
  const why = {};
  const fills = (chips, k) => { let fs = [[]]; for (let i = 0; i < k; i++) fs = fs.flatMap(f => chips.map(x => [...f, x])); return fs; };
  const drawn = F.lines;
  const isNew = c => { const s = F.seg[c]; return !!s && !drawn.some(([a, b]) => onLine(a, b, P[s.from]) && onLine(a, b, P[s.to])); };
  const crossInside = (c1, c2) => { const s = F.seg[c1], t = F.seg[c2];
    const p = P[s.from], r = vec(P[s.from], P[s.to]), q0 = P[t.from], sv = vec(P[t.from], P[t.to]), den = cross(r, sv);
    if (Math.abs(den) < 1e-12) return false;
    const u = cross(vec(p, q0), sv) / den, v = cross(vec(p, q0), r) / den;
    return u > 1e-9 && u < 1 - 1e-9 && v > 1e-9 && v < 1 - 1e-9; };
  const heightSteps = [];
  const perpTo = (k, line) => { const h = F.heights[k], v = vec(P[h.from], h.foot), w = vec(P[line[0]], P[line[1]]);
    return Math.abs(v.x * w.x + v.y * w.y) / (Math.hypot(v.x, v.y) * Math.hypot(w.x, w.y)) < REL; };
  q.steps.forEach((s, si) => {
    if (s.type !== "build") return;
    const mode = s.spec.mode, sw = {};
    let oracle, form = null;
    if (s.role === "kon") oracle = f => f[0] !== f[1] && isNew(f[0]) && isNew(f[1]) && crossInside(f[0], f[1]);
    else if (mode === "height") {
      /* a product is THE AREA FORMULA of its named Δ when one chip is a side
         of that Δ (both ends corners of it) and the other a height drawn
         from the Δ's third corner, perpendicular to that side's line, and
         then ½ · side · height IS its shoelace area (measured, 1e-9). The
         step is right when both products are their Δ's formula with the
         SAME height (her method: one height for both, so it cancels). A
         product that only equals the area by a coincidence of the figure
         (½ · TR · k is Opp Δ STR, which equals Opp Δ QST) is no formula. */
      const [T1, T2] = s.spec.tris;
      const formula = (pr, T) => { const hc = pr.filter(c => F.heights[c]), sc = pr.filter(c => F.seg[c]);
        if (hc.length !== 1 || sc.length !== 1) return false;
        const h = F.heights[hc[0]], g = F.seg[sc[0]], cs = [...T];
        if (!(cs.includes(g.from) && cs.includes(g.to) && g.from !== g.to)) return false;
        if (h.from !== cs.find(c => c !== g.from && c !== g.to)) return false;
        if (!perpTo(hc[0], [g.from, g.to]) || !onLine(g.from, g.to, h.foot)) return false;
        const r = rel(lenOf(sc[0]) * lenOf(hc[0]) / 2, area(T));
        worst = Math.max(worst, r);
        if (!(r < REL)) err.push(`½ · ${sc[0]} · ${hc[0]} is built like Δ ${T}'s area formula but does not equal its area (rel ${r})`);
        return r < REL; };
      oracle = f => { const t = f.slice(0, 2), b = f.slice(2);
        const top = lenOf(f[0]) * lenOf(f[1]) / 2, bot = lenOf(f[2]) * lenOf(f[3]) / 2;
        const r1 = rel(top, area(T1)), r2 = rel(bot, area(T2));
        if ((r1 < 1e-3 && r1 >= REL) || (r2 < 1e-3 && r2 >= REL)) accidental++;
        const sameH = t.find(c => F.heights[c]) === b.find(c => F.heights[c]);
        const ok = formula(t, T1) && formula(b, T2);
        /* reported, not marked right: true lines this step does not ask for */
        if (ok && !sameH) mixedH++;
        else if (!ok && r1 < REL && r2 < REL) coincide++;
        return ok && sameH; };
      heightSteps.push({ si, s });
    } else if (s.role === "eq") oracle = f => f[0] !== f[1] && F.tri && Object.values(tri).includes(f[0]) && Object.values(tri).includes(f[1]) && rel(area(f[0]), area(f[1])) < REL;
    else if (mode === "state") {
      const [A, B, C, D] = s.spec.expect;
      oracle = f => (f[0] === A && f[1] === B && f[2] === C && f[3] === D) || (f[0] === C && f[1] === D && f[2] === A && f[3] === B);
      form = f => new Set(f).size === 4 && rel(lenOf(f[0]) / lenOf(f[1]), lenOf(f[2]) / lenOf(f[3])) < REL;
    } else { err.push(`step ${si + 1}: no oracle for this build`); return; }
    for (const fill of fills(s.chips, s.answer.length)) {
      tried++;
      const o = oracle(fill), v = markRatio(fill, s.spec);
      why[v.why] = (why[v.why] || 0) + 1; sw[v.why] = (sw[v.why] || 0) + 1;
      if (v.ok) accepted++; else rejected++;
      let bad = v.ok !== o;
      if (form && !o && form(fill) !== (v.why === "form")) bad = true;     // true but not asked ⟺ "form"
      if (bad) { disagree++; if (disagree <= 5) err.push(`step ${si + 1} fill ${fill.join(" ")}: marker ${v.ok} (${v.why}), oracle ${o}${form ? `, true by lengths ${form(fill)}` : ""}`); }
      if (!v.ok && v.why !== "pattern" && !(s.hints && s.hints[v.why])) err.push(`step ${si + 1}: the marker says "${v.why}" and the step has no hint for it`);
    }
    if (!markRatio(s.answer, s.spec).ok) err.push(`step ${si + 1}: its own shown answer is marked wrong`);
    const silent = Object.keys(s.hints || {}).filter(k => k !== "pattern" && !sw[k]);
    if (silent.length) err.push(`step ${si + 1}: hints ${silent} never fire`);
  });
  if (accidental) err.push(`${accidental} area fills come within 0.1% of a named Δ's area without being it (not generic)`);
  /* 4 · the right height per step (the Q3 pitfall) */
  const perp = (k, line) => { const h = F.heights[k], v = vec(P[h.from], h.foot), w = vec(P[line[0]], P[line[1]]);
    return Math.abs(v.x * w.x + v.y * w.y) / (Math.hypot(v.x, v.y) * Math.hypot(w.x, w.y)) < REL; };
  const hs = [];
  heightSteps.forEach(({ si, s }, i) => {
    const H = s.spec.H, other = Object.keys(F.heights).find(k => k !== H), fl = s.spec.flat, flN = fl.join("");
    const otherLine = F.heights[other].onto.join("");
    const tf = s.sketchOpen && s.sketchOpen.turn ? s.sketchOpen.turn.flat.join("") : "-";
    const card = q.write.proof.areas[i];
    const checks = {
      "H ⊥ the flat line": perp(H, fl), "the other height not ⊥ it": !perp(other, fl),
      "the sketch lays that line flat": tf === flN || tf === [...fl].reverse().join(""),
      "✓ line says hoogte H": pl10(s.okLine) === `Dieselfde hoogte ${H}, dus bly net die basisse oor.`,
      "the struck letter is H": s.done.strike.includes(H) && !s.done.strike.includes(other),
      "the height hint": pl10(s.hints.height) === `${other} staan loodreg op ${otherLine}. Hierdie twee Δe se basisse lê op ${flN}. Albei se hoogte is ${H}.`,
      "the shown answer uses H": s.answer[1] === H && s.answer[3] === H,
      "the card's line uses H": card && card.h === H,
    };
    Object.entries(checks).forEach(([k, ok]) => { if (!ok) err.push(`step ${si + 1} (${flN} flat): ${k} FAILS`); });
    hs.push(`step ${si + 1}: ${flN} flat → ${H} (${Object.values(checks).every(Boolean) ? "all 8 agree" : "NOT"})`);
  });
  /* 5 · the picks */
  const nameOf = (a, b) => Object.keys(F.seg).find(k => F.seg[k].from === a && F.seg[k].to === b);
  q.steps.filter(s => s.type === "pick").forEach(s => {
    const right = s.options.filter(o => o.correct);
    if (right.length !== 1 || s.options.some(o => !o.correct && !o.hint)) err.push(`pick "${pl10(s.prompt)}": not exactly one right option, or a wrong one without a hint`);
    if (s.role === "reason" && pl10(right[0].text) !== `dies. basis en dies. ⊥h, ${nameOf(R.S, R.T)} ∥ ${nameOf(R.Q, R.R)}`)
      err.push(`the reason is "${pl10(right[0].text)}", not the exam page's "dies. basis en dies. ⊥h, …"`);
    if (s.role === "sum") s.options.forEach(o => { const m = pl10(o.text).match(/^Opp Δ (\w+) = Opp Δ (\w+)$/); const eq = m && rel(area(m[1]), area(m[2])) < REL;
      if (!!o.correct !== !!eq) err.push(`sum pick "${pl10(o.text)}": marked ${!!o.correct}, equal areas ${!!eq}`); });
  });
  /* 6 · her ruling 3 Oct 15:58: no answer shown before its build */
  const textsOf = s => [s.prompt, s.okLine, s.given && s.given.text, ...(s.given && s.given.line ? s.given.line.flatMap(u => (u === "=" ? [] : [...(u.n || []), ...(u.d || [])]).map(c => (typeof c === "object" ? c.t : c))) : []),
    ...(s.options || []).map(o => o.text), ...(s.frame || []).flatMap(u => (u === "=" ? [] : Array.isArray(u) ? u : [...u.n, ...u.d])).filter(c => c !== "☐").map(c => (typeof c === "object" ? c.t : c))]
    .filter(Boolean).map(pl10);
  const tok = (t, w) => new RegExp(`(^|[^A-Za-z])(${w}|${[...w].reverse().join("")})([^A-Za-z]|$)`).test(t);
  const shownBefore = [pl10(q.intro), q.lead.given || "", q.lead.pre || ""];
  const leaks = [];
  q.steps.forEach((s, si) => {
    const before = [...shownBefore, ...q.steps.slice(0, si).flatMap(textsOf), ...[s.prompt, s.given && s.given.text].filter(Boolean).map(pl10)];
    if (s.role === "kon") s.answer.forEach(c => before.forEach(t => { if (tok(t, c)) leaks.push(`step ${si + 1}: the join ${c} shows before the build ("${t.slice(0, 60)}")`); }));
    if (s.spec && s.spec.mode === "height") { const H = s.spec.H; [s.answer[0], s.answer[2]].forEach(b => before.forEach(t => { if (t.includes(`${b} · ${H}`) || t.includes(`${H} · ${b}`)) leaks.push(`step ${si + 1}: "${b} · ${H}" shows before the build`); })); }
    if (s.role === "eq") { const [x, y] = s.answer; before.forEach(t => { if (t.includes(`Opp Δ ${x} = Opp Δ ${y}`) || t.includes(`Opp Δ ${y} = Opp Δ ${x}`)) leaks.push(`step ${si + 1}: the equal-areas line shows before the build`); }); }
  });
  leaks.forEach(l => err.push(l));
  MAXREL10 = Math.max(MAXREL10, worst);
  D10 += disagree;
  problems += err.length;
  err.forEach(e => console.error(`✗ ${q.id}: ${e}`));
  rows10.push({ q: q.id, proof: q.proof, st: `${a0}/${b0} = ${c0}/${d0}`, hRows, eqLR, eqW, hs, leaks: leaks.length, tried, accepted, rejected, disagree, why, mixedH, coincide, tl: tri.left, tr: tri.right });
}
console.log("\new10 (the proof: from the coordinates; the heights, the areas by shoelace, the right height per step, every fill of every build)");
for (const r of rows10) {
  console.log(`${r.q.padEnd(9)} proof ${r.proof}  ${r.st.padEnd(18)}  Δ left = Δ right (rel ${r.eqLR.toExponential(1)})${r.eqW != null ? `, Δ wholeL = Δ wholeR (rel ${r.eqW.toExponential(1)})` : ""}`);
  r.hRows.forEach(h => console.log(`          ${h}`));
  console.log(`          the height per step: ${r.hs.join("; ")}`);
  console.log(`          answers shown before their build: ${r.leaks} (the statement itself exempt)`);
  console.log(`          true area lines the steps do NOT ask for (rejected on purpose, reported): ${r.mixedH} with two different heights (each product a real area formula), ${r.coincide} true only because Δ ${r.tl} = Δ ${r.tr} in area`);
  console.log(`          fills ${r.tried}, accepted ${r.accepted}, rejected ${r.rejected}, disagreements ${r.disagree}; rejected because: ${Object.entries(r.why).filter(([k]) => k !== "ok").map(([k, v]) => `${k} ${v}`).join(", ")}`);
}
console.log(`TOTAL     ${rows10.length} questions, ${rows10.reduce((s, r) => s + r.tried, 0)} fills, ${D10} disagreements, largest error in an equality that must hold ${MAXREL10.toExponential(1)}`);

if (problems) { console.error(`\n✗ ${problems} problem(s).`); process.exit(1); }
console.log("\n✓ the marker agrees with the length oracle on every fill (ew1, ew2, ew3, ew4 and ew7), every ew5 question has exactly one true leftover, the marked one, every ew7 line is true in its own generic figure, every ew6 fill agrees with the shoelace areas, every ew8 question's marked button is the kind its figure gives, every shown equality true, every ew9 name and reason line agrees with the figure, and every ew10 fill agrees with the figure's areas and lengths, each area step with the height that stands on its flat line.");
