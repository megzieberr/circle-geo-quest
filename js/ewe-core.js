/* ============================================================
   EWEREDIGHEID CORE  (pure: no DOM, no imports)
   ------------------------------------------------------------
   The Gr12 "Eweredigheid" mini rounds (group g9, kind "ewe").
   This file holds the parts that must be testable from node with
   no browser at all:

     · cutTriangle()  builds one to-scale sketch: a triangle with a
                      line across two of its sides. The cut points are
                      COMPUTED (D = A + t(B - A), E = A + t(C - A)),
                      never placed by eye, so a "∥" line really is ∥.
     · markRatio()    the ratio marker. It decides "is this fill of
                      ☐/☐ = ☐/☐ right?" from the SHAPE of the fill
                      only: which cut side each chip lies on, and where
                      on that side it sits. It never looks at a length.
                      tools/check-ewe-marker.mjs proves it against an
                      oracle that looks ONLY at lengths, over every
                      possible fill, so the two can never quietly agree
                      on a mistake.

   The DOM half (the fraction drawer, the fill-the-boxes pad and the
   sketch renderer) lives in js/ewe-kit.js; the screens in js/ewe.js.
   ============================================================ */

/* the frame entry that means "a box to be filled" (same glyph Blipwork's
   tokenpad uses, so a frame reads the same in both apps) */
export const SLOT = "☐";

export const lerp = (P, Q, t) => ({ x: P.x + t * (Q.x - P.x), y: P.y + t * (Q.y - P.y) });
export const dist = (P, Q) => Math.hypot(P.x - Q.x, P.y - Q.y);

/* ---------------- one cut triangle ----------------
   corner  the vertex the cut line is nearest to ("A")
   ends    the other two vertices, in order ["B", "C"]
   cuts    the two cut points, in the same order ["D", "E"]: D on corner-B,
           E on corner-C
   xy      screen coordinates (y down) of the three vertices, any scale:
           the renderer fits them to the canvas
   t       how far along each side the cut sits, from the corner
   t2      optional: a DIFFERENT fraction for the second side. Only for a
           line that is NOT parallel (ew1 Q5). Leave it out for a ∥ line.

   Every segment on the two cut sides gets a LINE (1 = corner-B side,
   2 = corner-C side) and a POSITION:
     "a"  the piece at the corner      (AD, AE)
     "b"  the piece away from it       (DB, EC)
     "w"  the whole side               (AB, AC)
   The ∥ pair (DE, BC) gets `par: true` and no line. For ew2's similarity
   mode each ∥ line also says which triangle it closes: `parPos` "a" for DE
   (the small Δ at the corner), "w" for BC (the whole Δ). ew1 never reads
   `parPos`. */
export function cutTriangle({ corner, ends, cuts, xy, t, t2 }) {
  const [B, C] = ends, [D, E] = cuts, A = corner;
  const parallel = t2 == null || t2 === t;
  const pts = { [A]: xy[A], [B]: xy[B], [C]: xy[C] };
  pts[D] = lerp(xy[A], xy[B], t);
  pts[E] = lerp(xy[A], xy[C], parallel ? t : t2);
  const seg = {
    [A + D]: { line: 1, pos: "a", from: A, to: D },
    [D + B]: { line: 1, pos: "b", from: D, to: B },
    [A + B]: { line: 1, pos: "w", from: A, to: B },
    [A + E]: { line: 2, pos: "a", from: A, to: E },
    [E + C]: { line: 2, pos: "b", from: E, to: C },
    [A + C]: { line: 2, pos: "w", from: A, to: C },
    [D + E]: { par: true, parPos: "a", from: D, to: E },
    [B + C]: { par: true, parPos: "w", from: B, to: C },
  };
  return {
    corner: A, ends, cuts, t, parallel, pts, seg,
    names: { AD: A + D, DB: D + B, AB: A + B, AE: A + E, EC: E + C, AC: A + C, DE: D + E, BC: B + C },
    /* what the renderer draws: the three sides, the cut line, and the ∥
       arrows on BOTH ∥ lines (authored in the same direction, D→E and B→C,
       so the two chevrons point the same way, as on paper) */
    sketch: {
      pts,
      lines: [[A, B], [A, C], [B, C], [D, E]],
      par: parallel ? [[D, E], [B, C]] : [],
    },
  };
}

/* the length of a named segment, straight from the coordinates */
export function segLength(tri, name) {
  const s = tri.seg[name];
  return dist(tri.pts[s.from], tri.pts[s.to]);
}

/* ---------------- the ratio marker ----------------
   fill  the four chip names in box order: [top-left, bottom-left,
         top-right, bottom-right], i.e. fill[0]/fill[1] = fill[2]/fill[3]
   spec  { seg, needWhole }   (seg from cutTriangle)

   RIGHT when the four chips form a true 2 by 2 pattern:
     same-side   AD/DB = AE/EC   each fraction stays on ONE cut side,
                                 the two sides differ, and the positions
                                 match top with top, bottom with bottom
     across      AD/AE = DB/EC   each fraction takes the SAME position on
                                 both sides, and the two tops are on the
                                 same side
   Either order around the "=", flipped or not, all fall out of those two
   rules without being listed.

   WRONG, with a reason the screen turns into a hint:
     "empty"    a box is still empty
     "unknown"  a chip that is not a segment of this sketch (caller bug)
     "par"      a ∥ line was used. Foreman ruling (to confirm with her):
                in ew1 DE and BC are ALWAYS wrong, even in the true
                similarity form AD/AB = DE/BC, because that needs a
                different reason.
     "repeat"   a chip used twice. No right answer repeats a chip, and a
                fill like AD/AD = AE/AE says nothing at all.
     "whole"    a right pattern, but the step asked for the WHOLE sides
                and none is used (needWhole, ew1 Q4)
     "pattern"  anything else

   spec.mode "similar" (ew2, opt-in) takes a different path, see
   markSimilar below. Without it, nothing here changes. */
export function markRatio(fill, spec) {
  if (!Array.isArray(fill) || fill.length !== 4 || fill.some(x => !x)) return { ok: false, why: "empty" };
  const s = fill.map(n => spec.seg[n]);
  if (s.some(x => !x)) return { ok: false, why: "unknown" };
  if (spec.mode === "similar") return markSimilar(fill, s, spec);
  if (s.some(x => x.par)) return { ok: false, why: "par" };
  if (new Set(fill).size < 4) return { ok: false, why: "repeat" };
  const [a, b, c, d] = s;
  const sameSide = a.line === b.line && c.line === d.line && a.line !== c.line
                && a.pos === c.pos && b.pos === d.pos && a.pos !== b.pos;
  const across = a.line !== b.line && c.line !== d.line && a.line === c.line
              && a.pos === b.pos && c.pos === d.pos && a.pos !== c.pos;
  if (!sameSide && !across) return { ok: false, why: "pattern" };
  if (spec.needWhole && !s.some(x => x.pos === "w")) return { ok: false, why: "whole" };
  return { ok: true, why: "ok", form: sameSide ? "same" : "across" };
}

/* ---------------- the similarity marker (ew2, spec.mode "similar") ----------------
   When a ∥ line is IN the ratio, the ratio comes from the two similar
   triangles: the small Δ at the corner (AD, AE, DE) and the whole Δ
   (AB, AC, BC). Each chip becomes a TRIANGLE (T: "a" small, "w" whole) and
   a KIND of side (K: 1 the corner-B side, 2 the corner-C side, "p" the ∥
   line). The correspondence is AD ↔ AB, AE ↔ AC, DE ↔ BC: same K.

   RIGHT when the four chips form a true 2 by 2 pattern:
     same-triangle  DE/AE = BC/AC   each fraction stays in ONE triangle, the
                                    two triangles differ, and the kinds match
                                    top with top, bottom with bottom
     across         DE/BC = AE/AC   each fraction pairs the SAME kind of side
                                    from the two triangles, and the two tops
                                    are in the same triangle
   Either order around the "=", flipped or not, fall out of those two rules.

   WRONG, with a reason for the hint:
     "bottom"   a bottom piece (DB, EC) was used. With a ∥ line in the ratio
                you use the whole side, never the bottom piece.
     "repeat"   a chip used twice
     "pattern"  anything else
     "nopar"    a right pattern with no ∥ line (AD/AB = AE/AC), when the step
                asked for the ∥ lines (spec.needPar)
   Like markRatio, it reads only the SHAPE of the fill, never a length. */
function markSimilar(fill, s, spec) {
  if (s.some(x => x.pos === "b")) return { ok: false, why: "bottom" };
  if (new Set(fill).size < 4) return { ok: false, why: "repeat" };
  const [a, b, c, d] = s.map(x => (x.par ? { T: x.parPos, K: "p" } : { T: x.pos, K: x.line }));
  const sameTri = a.T === b.T && c.T === d.T && a.T !== c.T
               && a.K === c.K && b.K === d.K && a.K !== b.K;
  const across = a.K === b.K && c.K === d.K && a.K !== c.K
              && a.T === c.T && b.T === d.T && a.T !== b.T;
  if (!sameTri && !across) return { ok: false, why: "pattern" };
  if (spec.needPar && ![a, b, c, d].some(x => x.K === "p")) return { ok: false, why: "nopar" };
  return { ok: true, why: "ok", form: sameTri ? "same" : "across" };
}
