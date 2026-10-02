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
     · sharedHeight() ew3: an apex over a base line with three points,
                      the foot of the ⊥h COMPUTED (see below).
     · markArea()     ew3: the two-box area marker (see below).
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
   markSimilar below. spec.mode "area" (ew3, opt-in) is a TWO-box fill and
   goes to markArea at the very top. Without a mode, nothing here changes. */
export function markRatio(fill, spec) {
  if (spec && spec.mode === "area") return markArea(fill, spec);
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

/* ======================= ew3: a shared height =======================
   Her p.42 ③ "Aangrensende driehoeke": a base line with three points on it
   and an apex off it. Every triangle with that apex and its base on that
   line has the SAME height ⊥h, so the ratio of two such areas is the ratio
   of their bases. */

/* the two factors she strikes through: chips, but not segments */
export const HALF = "½";
export const PERP_H = "⊥h";

/* ---------------- one shared-height sketch ----------------
   apex   the vertex off the base line ("A")
   base   the three base points in order along the line ["B", "C", "D"]
   xy     screen coordinates (y down) of the apex and the two END points
          of the base (B and D), any scale: the renderer fits them
   s      where the middle point sits, as a fraction of the way from B to D
   tris   the two named triangles, in the order the question names them
          (top first): e.g. ["ABC", "ACD"]. They are tinted in the sketch.

   The middle point C = B + s(D − B) and the FOOT of the height (the
   projection of the apex on BD) are COMPUTED, never placed by eye, so the
   dotted ⊥h really is perpendicular. It throws when the foot is not
   strictly inside BD, or sits on C or on the middle of BD (the sketch would
   then hide the very thing it must show).

   seg, for the area marker: every segment between two of the four points,
   and the two struck factors
     { from, to, base: true }    on the base line   (BC, CD, BD)
     { from, to, base: false }   from the apex      (AB, AC, AD)
     { struck: true }            ½ and ⊥h: factors, not segments
   names maps the generic roles to this sketch's letters (BC → "KL", …). */
export function sharedHeight({ apex, base, xy, s, tris }) {
  const A = apex, [B, C, D] = base;
  if (!(s > 0 && s < 1)) throw new Error("sharedHeight: the middle point must be strictly between the ends");
  const pts = { [A]: xy[A], [B]: xy[B], [C]: lerp(xy[B], xy[D], s), [D]: xy[D] };
  /* the foot: project the apex onto line BD */
  const bx = pts[D].x - pts[B].x, by = pts[D].y - pts[B].y, L2 = bx * bx + by * by;
  const u = ((pts[A].x - pts[B].x) * bx + (pts[A].y - pts[B].y) * by) / L2;
  const foot = lerp(pts[B], pts[D], u);
  if (!(u > 0.05 && u < 0.95)) throw new Error("sharedHeight: the foot of the height must be strictly inside the base");
  if (Math.abs(u - s) < 0.06) throw new Error("sharedHeight: the foot of the height sits (almost) on the middle point");
  if (Math.abs(u - 0.5) < 0.03) throw new Error("sharedHeight: the foot of the height sits on the middle of the base");
  const names = { BC: B + C, CD: C + D, BD: B + D, AB: A + B, AC: A + C, AD: A + D };
  const seg = {
    [names.BC]: { from: B, to: C, base: true },
    [names.CD]: { from: C, to: D, base: true },
    [names.BD]: { from: B, to: D, base: true },
    [names.AB]: { from: A, to: B, base: false },
    [names.AC]: { from: A, to: C, base: false },
    [names.AD]: { from: A, to: D, base: false },
    [HALF]: { struck: true },
    [PERP_H]: { struck: true },
  };
  /* the right-angle box goes on the side of the foot AWAY from the middle
     point, so it never touches the middle line from the apex */
  const away = u > s ? 1 : -1, bl = Math.sqrt(L2);
  return {
    apex: A, base, s, pts, foot, seg, names, tris,
    sketch: {
      pts,
      lines: [[B, D], [A, B], [A, C], [A, D]],
      par: [],
      tints: tris.map(t => [...t]),
      height: { from: A, foot, dir: { x: away * bx / bl, y: away * by / bl } },
    },
  };
}

/* ---------------- the area marker (ew3, spec.mode "area") ----------------
   fill  the two chip names in box order: [top, bottom]
   spec  { mode: "area", seg, tris: ["ABC", "ACD"] }   (seg from sharedHeight,
         tris = the named triangles, top first)

   RIGHT when the top chip is the BASE of the first named Δ and the bottom
   chip the base of the second: a segment on the base line whose two ends
   are both corners of that Δ. The order matters here: the triangles are
   named, so the bases follow the names.

   WRONG, with a reason the screen turns into a hint. The checks for one
   particular wrong chip come before "repeat", as in ew1 and ew2:
     "empty"    a box is still empty
     "unknown"  a chip that is not in this sketch (caller bug)
     "crossed"  ½ or ⊥h: struck through, they do not stay (the cross-out step)
     "shared"   the side the two named Δe SHARE: a side, not a base
     "repeat"   one chip in both boxes: the fraction says nothing
     "order"    the two right bases, swapped
     "pattern"  anything else
   Like markRatio, it reads only the SHAPE of the fill (which corners, which
   line), never a length. tools/check-ewe-marker.mjs proves it against
   areas measured from the coordinates. */
export function markArea(fill, spec) {
  if (!Array.isArray(fill) || fill.length !== 2 || fill.some(x => !x)) return { ok: false, why: "empty" };
  const s = fill.map(n => spec.seg[n]);
  if (s.some(x => !x)) return { ok: false, why: "unknown" };
  if (s.some(x => x.struck)) return { ok: false, why: "crossed" };
  const [T1, T2] = spec.tris.map(t => new Set(t));
  const inT = (x, T) => T.has(x.from) && T.has(x.to);
  if (s.some(x => inT(x, T1) && inT(x, T2))) return { ok: false, why: "shared" };
  if (fill[0] === fill[1]) return { ok: false, why: "repeat" };
  const baseOf = (x, T) => x.base && inT(x, T);
  if (baseOf(s[0], T1) && baseOf(s[1], T2)) return { ok: true, why: "ok" };
  if (baseOf(s[0], T2) && baseOf(s[1], T1)) return { ok: false, why: "order" };
  return { ok: false, why: "pattern" };
}
