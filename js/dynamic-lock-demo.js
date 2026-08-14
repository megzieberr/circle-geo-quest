/* CONDITION-LOCK DRAG — the mechanism, plus a demo. Not a round.
   ------------------------------------------------------------------------
   DYNAMIC-GEO-PLAN.md's capstone (Arc 1) needs a drag that SNAPS when a
   stated relation locks — "drag C until EF ∥ BD" — with parallel marks
   flashing the instant it does. This session builds the mechanism
   (handle.lock in js/interactive.js) and this demo of it working, but
   deliberately NOT the capstone round itself (fresh figure, fresh numbers,
   a later session — DYNAMIC-GEO-PLAN.md Arc 1).

   The demo: X is free to drag anywhere on the circle. Y is a fixed point.
   Chord PQ is fixed. The moment chord XY becomes (near enough) parallel to
   PQ, the drag SNAPS X to the exact locking degree and both chords flash
   parallel chevrons — the same visual a capstone round would use for
   "EF ∥ BD".

   Mounted headlessly in verify-dynamic.html for foreman review — no
   grading, no XP, nothing here is a "round" and nothing imports it from
   js/rounds/index.js. */

const LOCK_TOL = 2.5;   // degrees of direction difference counted as "close enough to lock"

/* signed direction difference between chord P->Q and chord X->Y, folded
   into (-90, 90], so 0 means the two lines are parallel (lines, not rays —
   direction and its 180°-opposite both count as parallel). */
function angleGap(P, Q, X, Y) {
  const dPQ = Math.atan2(Q.y - P.y, Q.x - P.x) * 180 / Math.PI;
  const dXY = Math.atan2(Y.y - X.y, Y.x - X.x) * 180 / Math.PI;
  let diff = ((dXY - dPQ) % 180 + 180) % 180;
  if (diff > 90) diff -= 180;
  return diff;
}

export function lockDemoModel() {
  return {
    w: 320, h: 280, cx: 160, cy: 130, R: 92,
    /* P=20°, Q=160° are symmetric about 90°, so chord PQ is exactly
       horizontal — the one solution for "XY horizontal too" (besides the
       degenerate X=Y itself) lands at X=100° (proof: Y.y = cy − R·sin(80°);
       X.y matches it at X=80° [=Y, degenerate] or X=180−80=100° [the real
       lock]). The glide sweeps 160°→95°, which crosses 100° but stays a
       clear 15° from Y=80°, so X never nears Y and the direction never
       goes near the zero-length singularity. */
    fixed: { pts: { P: 20, Q: 160, Y: 80 }, chords: [["P", "Q"]] },
    handles: [
      {
        id: "X", kind: "circle", init: 160,
        lock: {
          test: (m) => Math.abs(m.gap) < LOCK_TOL,
          /* No closed form is derived here on purpose — a local search over a
             small window around the value the drag already reached is enough
             to land on the exact parallel degree, and it keeps this file
             readable as "here is what a lock needs", not a geometry proof. A
             capstone round with its own fixed figure can solve this exactly
             instead, if it wants to. */
          solve: (pos, ctx, currentVal) => {
            const P = ctx.P("P"), Q = ctx.P("Q"), Y = ctx.P("Y");
            let best = currentVal, bestAbs = Infinity;
            for (let d = currentVal - 6; d <= currentVal + 6; d += 0.05) {
              const X = ctx.onCircle(d);
              const a = Math.abs(angleGap(P, Q, X, Y));
              if (a < bestAbs) { bestAbs = a; best = d; }
            }
            return best;
          },
        },
      },
    ],
    measure(pos, ctx) {
      const P = ctx.P("P"), Q = ctx.P("Q"), Y = ctx.P("Y"), X = pos.X;
      const gap = angleGap(P, Q, X, Y);
      return { gap, locked: Math.abs(gap) < LOCK_TOL };
    },
    frame(pos, ctx, m) {
      const P = ctx.P("P"), Q = ctx.P("Q"), Y = ctx.P("Y"), X = pos.X;
      const col = m.locked ? "#0ea271" : "#2b2f4a";
      return {
        segments: [{ x1: X.x, y1: X.y, x2: Y.x, y2: Y.y, cls: "thin", color: col }],
        dots: [
          { x: X.x, y: X.y, color: "#2b2f4a", label: "X", dx: 12, dy: -10 },
          { x: Y.x, y: Y.y, color: "#2b2f4a", label: "Y", dx: 12, dy: -10 },
        ],
        marks: m.locked ? [
          { x1: P.x, y1: P.y, x2: Q.x, y2: Q.y, kind: "parallel", n: 2, flash: true, color: "#0ea271" },
          { x1: X.x, y1: X.y, x2: Y.x, y2: Y.y, kind: "parallel", n: 2, flash: true, color: "#0ea271" },
        ] : [],
      };
    },
    readouts(m) {
      return [{
        label: { en: "XY vs PQ", af: "XY vs PQ" },
        value: m.locked ? "∥ locked!" : Math.round(m.gap) + "°",
        color: m.locked ? "#0ea271" : undefined,
        hot: m.locked,
        big: true,
      }];
    },
    glide: { handleId: "X", from: 160, to: 95, duration: 6000 },
  };
}
