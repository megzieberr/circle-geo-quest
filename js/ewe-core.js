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
     · sharedAngle()  ew4: two triangles that share ONE ANGLE, a cut
                      line that is never ∥ (see below).
     · markSine()     ew4: the four-box product marker (see below).
     · rightAltitude() ew7: a right-angled Δ with the height from the
                      right angle onto the hypotenuse, the right angle
                      COMPUTED (see below).
     · markProd()     ew7: ☐ · ☐ = ☐ · ☐, a square written out (see below).
     · markCross()    ew7: the product line as two fractions (see below).
     · markExact()    ew6: a fill of numbers with ONE right order, the
                      wrong reasons named by the question data (see below).
                      ew9, opt-in: `free` ranges whose order does not
                      matter (the reason line's two ∥ lines).
     · sharedAngleSide() ew9: her p.55 figure, two similar triangles that
                      share an angle AND a side, built to scale (see below).
     · markName()     ew9: Δ ADE ||| Δ ☐☐☐, the corners in matching order.
     · proofFigure()  ew10: the proof of the theorem, her figure: the cut
                      triangle, the two heights inside the small Δ, the two
                      joins (see below).
     · markHeight()   ew10: ½ · ☐ · ☐ over ½ · ☐ · ☐, a base and THE height
                      in each product (see below).
     · markState()    ew10: ∴ ☐/☐ = ☐/☐, exactly the statement asked.
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
/* ew9, opt-in: a frame entry that is a break point WITHOUT a sign, for a
   frame with no "=" that is too wide for one phone line (the reason line
   `lyn ∥ een sy v. Δ ☐, ☐ ∥ ☐`): the frame may wrap there, never inside
   a unit. No frame of ew1 to ew8 has one. */
export const BRK = "⏎brk";
/* ew10 fix round, opt-in: a sketch state that carries this key (a SYMBOL,
   so no walk over the round data, no Object.keys and no JSON ever sees it)
   holds the list of every view of its question; the kit then places the
   letters h and k by ONE plan for all those views (ewe-kit
   planHeightLetters), computed once, in the browser. */
export const HK_GROUP = Symbol("ew10 height letters: the question's views");

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
   goes to markArea at the very top; spec.mode "sine" (ew4, opt-in) is a
   four-box PRODUCT fill and goes to markSine; spec.mode "prod" and "cross"
   (ew7, opt-in) are the rewrite of a product line and go to markProd and
   markCross; spec.mode "exact" (ew6, opt-in) is a fill of NUMBERS with one
   right order and goes to markExact; spec.mode "name" (ew9, opt-in) is a
   triangle's three corners and goes to markName; spec.mode "height" and
   "state" (ew10, opt-in) are the proof's area build and its last line and
   go to markHeight and markState. Without a mode, nothing here changes. */
export function markRatio(fill, spec) {
  if (spec && spec.mode === "height") return markHeight(fill, spec);
  if (spec && spec.mode === "state") return markState(fill, spec);
  if (spec && spec.mode === "name") return markName(fill, spec);
  if (spec && spec.mode === "exact") return markExact(fill, spec);
  if (spec && spec.mode === "area") return markArea(fill, spec);
  if (spec && spec.mode === "sine") return markSine(fill, spec);
  if (spec && spec.mode === "prod") return markProd(fill, spec);
  if (spec && spec.mode === "cross") return markCross(fill, spec);
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

/* ======================= ew4: a shared angle =======================
   Her p.44 and her habit 15/16: two triangles that do NOT share a height
   but DO share an angle. Write ½ · a · b · sin for both, strike the ½ and
   the sine through, and what is left is the PRODUCT of the two sides that
   touch the shared angle, top over bottom. */

/* the angle at a point, as in her notes: a hat on the letter. Precomposed
   where Unicode has the glyph (Â Ĉ Ê Ĝ Ĥ Ŝ …), the letter plus the
   combining hat U+0302 otherwise (B̂ D̂ F̂ K̂ …). NFC makes that choice. */
export const hat = L => (L + "̂").normalize("NFC");
/* the sine factor she strikes through, e.g. "sin Â": a chip, not a segment */
export const sinOf = V => `sin ${hat(V)}`;

/* ---------------- one shared-angle sketch ----------------
   corner  the vertex of the shared angle ("A")
   ends    the other two vertices of the WHOLE triangle ["B", "C"]
   cuts    the cut points ["D", "E"]: D = A + t(B − A), E = A + t2(C − A).
           t2 may be MORE than 1 (ew4 Q4): E then lies on AC EXTENDED, past
           C, and the ray from A is drawn through to E.
   xy      screen coordinates (y down) of A, B and C, any scale
   tris    the two triangles in the order the question NAMES them (top
           first), spelt as the question spells them: ["ADE", "ABC"], or
           the other way round (ew4 Q3: ["RSC", "TPC"])
   spell   optional: the side spellings of her notes, e.g. ["RC", "TC"],
           where the default (corner first) would say "CR", "CT"

   It throws when t and t2 differ by less than 0.15: this line must NEVER
   look ∥ (the sketch carries no ∥ arrows, ever).

   seg, for the product marker: the six sides of the two triangles, and
   the two struck factors
     { from, to }       a side, by its two corner letters
     { struck: true }   ½ and sin Â: factors, not segments
   top / bot   the two sides of the first / second named Δ that touch the
               shared angle (the right fill, in a natural order)
   tints       the tint of the first / second named Δ: the whole Δ is
               tint 2 and drawn first, the cut-off Δ tint 1 on top, so a
               triangle keeps its colour whichever way round it is named
   sketch / sketchStar   the sketch before and after the shared angle is
               found: the same, except that her star is drawn */
export function sharedAngle({ corner, ends, cuts, xy, t, t2, tris, spell = [] }) {
  const A = corner, [B, C] = ends, [D, E] = cuts;
  if (!(t > 0 && t2 > 0 && t !== 1 && t2 !== 1)) throw new Error("sharedAngle: a cut point must be on a ray from the corner, and not on an end");
  if (Math.abs(t - t2) < 0.15) throw new Error("sharedAngle: t and t2 must differ by at least 0.15, so DE never looks ∥ BC");
  const pts = { [A]: xy[A], [B]: xy[B], [C]: xy[C] };
  pts[D] = lerp(xy[A], xy[B], t);
  pts[E] = lerp(xy[A], xy[C], t2);
  const nm = (P, Q) => (spell.includes(Q + P) ? Q + P : P + Q);
  const names = { AD: nm(A, D), AE: nm(A, E), AB: nm(A, B), AC: nm(A, C), DE: nm(D, E), BC: nm(B, C) };
  const key = s => [...s].sort().join("");
  const small = A + D + E, whole = A + B + C;
  const role = tris.map(n => (key(n) === key(small) ? "small" : key(n) === key(whole) ? "whole" : null));
  if (role.includes(null) || role[0] === role[1]) throw new Error("sharedAngle: tris must name the cut-off Δ and the whole Δ");
  const SIN = sinOf(A);
  const seg = {
    [names.AD]: { from: A, to: D },
    [names.AE]: { from: A, to: E },
    [names.AB]: { from: A, to: B },
    [names.AC]: { from: A, to: C },
    [names.DE]: { from: D, to: E },
    [names.BC]: { from: B, to: C },
    [HALF]: { struck: true },
    [SIN]: { struck: true },
  };
  const sidesAt = r => (r === "small" ? [names.AD, names.AE] : [names.AB, names.AC]);
  const angle = { at: A, rays: [B, C], star: false };
  const sketch = {
    pts,
    /* each ray from the corner is drawn to the farther of its two points */
    lines: [[A, t > 1 ? D : B], [A, t2 > 1 ? E : C], [B, C], [D, E]],
    par: [],
    tints: [{ pts: [...whole], tint: 2 }, { pts: [...small], tint: 1 }],
    angle,
    labBox: true,
  };
  return {
    corner: A, ends, cuts, t, t2, pts, seg, names, tris, sin: SIN,
    tints: role.map(r => (r === "small" ? 1 : 2)),
    top: sidesAt(role[0]), bot: sidesAt(role[1]), third: [names.DE, names.BC],
    sketch,
    sketchStar: { ...sketch, angle: { ...angle, star: true } },
  };
}

/* ---------------- the product marker (ew4, spec.mode "sine") ----------------
   fill  the four chip names in box order: [top1, top2, bot1, bot2], read as
         top1 · top2 over bot1 · bot2
   spec  { mode: "sine", seg, tris: ["ADE", "ABC"], at: "A" }   (seg from
         sharedAngle, tris = the named triangles, top first, at = the corner
         of the shared angle)

   RIGHT when the top pair is the two sides of the FIRST named Δ that touch
   the shared angle (either order) and the bottom pair the second Δ's two
   (either order). The order of the two products matters: the triangles
   are named, so the products follow the names.

   WRONG, with a reason the screen turns into a hint. The checks for one
   particular wrong chip come first, as in ew1 to ew3; `chip` names it so
   the hint can say which one:
     "empty"    a box is still empty
     "unknown"  a chip that is not in this sketch (caller bug)
     "crossed"  ½ or the sine: struck through, they do not stay (cross-out)
     "third"    a side that does not touch the shared angle (DE, BC)
     "repeat"   a chip twice in one product, or the same pair top and
                bottom: the fraction says nothing
     "mixed"    a product with one side from each Δ
     "order"    the two right products, swapped
     "pattern"  anything else
   Like markRatio, it reads only the SHAPE of the fill (which corners),
   never a length. tools/check-ewe-marker.mjs proves it against areas
   measured from the coordinates. */
export function markSine(fill, spec) {
  if (!Array.isArray(fill) || fill.length !== 4 || fill.some(x => !x)) return { ok: false, why: "empty" };
  const s = fill.map(n => spec.seg[n]);
  if (s.some(x => !x)) return { ok: false, why: "unknown" };
  const struck = s.findIndex(x => x.struck);
  if (struck >= 0) return { ok: false, why: "crossed", chip: fill[struck] };
  const V = spec.at, [T1, T2] = spec.tris.map(t => new Set(t));
  const inT = (x, T) => T.has(x.from) && T.has(x.to);
  const atV = x => x.from === V || x.to === V;
  const third = s.findIndex(x => !atV(x) && (inT(x, T1) || inT(x, T2)));
  if (third >= 0) return { ok: false, why: "third", chip: fill[third] };
  const [a, b, c, d] = fill;
  if (a === b || c === d || [a, b].sort().join() === [c, d].sort().join()) return { ok: false, why: "repeat" };
  const who = x => (!atV(x) ? 0 : inT(x, T1) ? 1 : inT(x, T2) ? 2 : 0);
  const w = s.map(who);
  if (w.includes(0)) return { ok: false, why: "pattern" };
  if (w[0] !== w[1] || w[2] !== w[3]) return { ok: false, why: "mixed" };
  if (w[0] === 1 && w[2] === 2) return { ok: true, why: "ok" };
  if (w[0] === 2 && w[2] === 1) return { ok: false, why: "order" };
  return { ok: false, why: "pattern" };
}

/* ======================= ew7: a strange format =======================
   The exam says "Bewys dat AD² = BD · DC". That line is a ratio that was
   cross-multiplied. Her habit (Metode-nota): write the square as a side
   times itself, AD · AD = BD · DC, then as two fractions AD/BD = DC/AD,
   and only then read the triangles off the fractions (that is ew7's job).
   The second form has no square: KL · KM = KN · LM becomes KL/KN = LM/KM. */

/* ---------------- one right-angled Δ with its height ----------------
   right   the vertex of the right angle ("A")
   ends    the two ends of the hypotenuse, in order ["B", "C"]
   foot    the foot of the height on the hypotenuse ("D")
   xy      screen coordinates (y down) of the two ENDS only, any scale
   t       where the foot sits: D = B + t(C − B). Never (near) 0.5, so the
           two pieces of the hypotenuse always differ
   side    +1 or −1: which side of BC the right angle goes. The normal of
           B → C is (−uy, ux); in screen coordinates (y down) and BC running
           left to right, −1 puts A ABOVE the hypotenuse, +1 below
   spell   optional: side spellings, e.g. ["UV"], where the default would
           say otherwise. Default: the right-angle vertex first for the
           three sides from it (AB, AC, AD), the hypotenuse pieces in the
           order of `ends` (BD, DC) and BC itself

   A = D + side · h · n with h = sqrt(BD · DC): exactly the height that
   makes the angle at A a right angle (the height on the hypotenuse is the
   mean proportional of its two pieces), so the right angle is COMPUTED,
   never placed by eye. tools/check-ewe-marker.mjs measures it anyway.

   seg     the six sides by their spelling: { from, to, role }
   names   the generic roles → this figure's spelling (AD → "FH", …)
   sketch  the three sides and the height, a right-angle box at A and one
           at D (`right`, computed from the two arms in js/ewe-kit.js), no
           tints, no arcs, no stars; `outside` keeps every label outside
           the Δ; labBox as in ew4 */
export function rightAltitude({ right, ends, foot, xy, t, side, spell = [] }) {
  const A = right, [B, C] = ends, D = foot;
  if (!(t > 0.08 && t < 0.92)) throw new Error("rightAltitude: the foot must be well inside the hypotenuse");
  if (Math.abs(t - 0.5) < 0.05) throw new Error("rightAltitude: t must not be (near) 0.5, the two pieces must differ");
  if (side !== 1 && side !== -1) throw new Error("rightAltitude: side is +1 or -1");
  const pB = xy[B], pC = xy[C];
  const pD = lerp(pB, pC, t);
  const L = dist(pB, pC), ux = (pC.x - pB.x) / L, uy = (pC.y - pB.y) / L;
  const h = Math.sqrt(dist(pB, pD) * dist(pD, pC));
  const pA = { x: pD.x + side * h * -uy, y: pD.y + side * h * ux };
  const pts = { [A]: pA, [B]: pB, [C]: pC, [D]: pD };
  const nm = (P, Q) => (spell.includes(Q + P) ? Q + P : P + Q);
  const names = { AB: nm(A, B), AC: nm(A, C), AD: nm(A, D), BD: nm(B, D), DC: nm(D, C), BC: nm(B, C) };
  const ends2 = { AB: [A, B], AC: [A, C], AD: [A, D], BD: [B, D], DC: [D, C], BC: [B, C] };
  const seg = {};
  for (const [role, [p, q]] of Object.entries(ends2)) seg[names[role]] = { from: p, to: q, role };
  /* the box at D goes on the side of the LONGER piece (more room) */
  const longer = t > 0.5 ? B : C;
  return {
    right: A, ends, foot: D, t, side, pts, seg, names, h,
    sketch: {
      pts,
      lines: [[A, B], [A, C], [B, C], [A, D]],
      par: [],
      right: [{ at: A, arms: [B, C] }, { at: D, arms: [A, longer] }],
      outside: [A, B, C],
      labBox: true,
    },
  };
}

/* the two products of a line, as given: pairs = [[L1, L2], [R1, R2]]. A
   square is the pair [AD, AD]. */
const pairKey = p => p.slice().sort().join("·");
const sqOf = pairs => { const s = pairs.find(p => p[0] === p[1]); return s ? s[0] : null; };

/* ---------------- the product marker (ew7, spec.mode "prod") ----------------
   fill  the four chip names in box order: [x1, x2, y1, y2], read as
         x1 · x2 = y1 · y2
   spec  { mode: "prod", pairs: [[L1, L2], [R1, R2]], chips }   (pairs = the
         two products of the given line; the square AD² is the pair
         [AD, AD]; chips = the chip bank, the line's letters plus a decoy)

   RIGHT when the two boxes on one side of the "=" hold one product of the
   line and the two on the other side the other product: either side
   first, either order inside a product. AD · AD = BD · DC,
   DC · BD = AD · AD, … all fall out of that without being listed.

   WRONG, with a reason the screen turns into a hint; `chip` names the
   decoy so the hint can say which one:
     "empty"    a box is still empty
     "unknown"  a chip that is not in the bank (caller bug)
     "decoy"    a chip that is not in the given line
     "twice"    a square question, and the squared side is used fewer than
                two times
     "mixed"    exactly the line's four letters, but the two products are
                mixed across the "="
     "repeat"   no square in the line, and one chip used twice
     "pattern"  anything else
   It reads only which letters stand where, never a length.
   tools/check-ewe-marker.mjs proves it against lengths measured from the
   figure. */
export function markProd(fill, spec) {
  if (!Array.isArray(fill) || fill.length !== 4 || fill.some(x => !x)) return { ok: false, why: "empty" };
  if (fill.some(x => !spec.chips.includes(x))) return { ok: false, why: "unknown" };
  const line = spec.pairs.flat();
  const decoy = fill.find(x => !line.includes(x));
  if (decoy) return { ok: false, why: "decoy", chip: decoy };
  const L = pairKey(fill.slice(0, 2)), R = pairKey(fill.slice(2));
  const [P1, P2] = spec.pairs.map(pairKey);
  if ((L === P1 && R === P2) || (L === P2 && R === P1)) return { ok: true, why: "ok" };
  const sq = sqOf(spec.pairs);
  if (sq && fill.filter(x => x === sq).length < 2) return { ok: false, why: "twice" };
  if (fill.slice().sort().join() === line.slice().sort().join()) return { ok: false, why: "mixed" };
  if (!sq && new Set(fill).size < 4) return { ok: false, why: "repeat" };
  return { ok: false, why: "pattern" };
}

/* ---------------- the cross marker (ew7, spec.mode "cross") ----------------
   fill  the four chip names in box order: [a, b, c, d], read as a/b = c/d
   spec  { mode: "cross", pairs, chips }   (as markProd)

   RIGHT when a and d are one product of the line and b and c the other:
   cross-multiplied, a/b = c/d says a · d = b · c, which is the line. The
   squared side therefore stands kruis-kruis (top left and bottom right).
   AD/BD = DC/AD, AD/DC = BD/AD, BD/AD = AD/DC, DC/AD = AD/BD, all right;
   the shape only, never a length.

   WRONG, with a reason for the hint:
     "empty" / "unknown" / "decoy"   as markProd
     "once"     a square question, and the squared side is used fewer than
                two times
     "same"     a square question, and both copies of the squared side sit
                in ONE fraction (AD/AD = BD/DC): that fraction says nothing
     "repeat"   no square in the line, and one chip used twice
     "pattern"  anything else */
export function markCross(fill, spec) {
  if (!Array.isArray(fill) || fill.length !== 4 || fill.some(x => !x)) return { ok: false, why: "empty" };
  if (fill.some(x => !spec.chips.includes(x))) return { ok: false, why: "unknown" };
  const line = spec.pairs.flat();
  const decoy = fill.find(x => !line.includes(x));
  if (decoy) return { ok: false, why: "decoy", chip: decoy };
  const [a, b, c, d] = fill;
  const AD = pairKey([a, d]), BC = pairKey([b, c]);
  const [P1, P2] = spec.pairs.map(pairKey);
  if ((AD === P1 && BC === P2) || (AD === P2 && BC === P1)) return { ok: true, why: "ok" };
  const sq = sqOf(spec.pairs);
  if (sq) {
    if (fill.filter(x => x === sq).length < 2) return { ok: false, why: "once" };
    if ((a === sq && b === sq) || (c === sq && d === sq)) return { ok: false, why: "same" };
  } else if (new Set(fill).size < 4) return { ok: false, why: "repeat" };
  return { ok: false, why: "pattern" };
}

/* ======================= ew6: the trapezium =======================
   "Die trapesium": the big Δ minus the small Δ, in k's. Every build step
   is a fill of NUMBERS (the parts of a side, the k's of an area), and each
   has exactly one right fill in one right order: 3 over 5, 3 · 3 over
   5 · 5, 25k − 9k = 16k, 9 over 16.

   ---------------- the exact marker (ew6, spec.mode "exact") ----------------
   fill  the chips in box order
   spec  { mode: "exact", expect: ["3", "5"], chips: [...], why: [rules] }

   RIGHT when the fill is exactly `expect`.

   WRONG, with a reason the screen turns into a hint. The reasons come from
   the QUESTION DATA, not from this function: `why` is an ordered list of
   rules, the first one that matches names the reason ("piece", "flipped",
   "mixed", "sum", "order", "again", ...), and a fill no rule matches is
   "pattern". A rule looks at the whole fill, or at fill.slice(from, to):
     { why, has: ["2"] }            every listed chip is in it
     { why, is: ["5", "3"] }        it is exactly this, in this order
   plus, before any rule:
     "empty"    a box is still empty
     "unknown"  a chip that is not in the bank (caller bug)
   Pure, no lengths: tools/check-ewe-marker.mjs proves every fill of every
   ew6 step against areas measured (shoelace) from the coordinates.

   ew9, OPT-IN: `free: [[1, 3]]` lists box ranges [from, to) whose ORDER
   does not matter: the reason line `lyn ∥ een sy v. Δ ☐, ☐ ∥ ☐` has one
   fixed chip (the Δ), then an order-free pair (DE ∥ BC = BC ∥ DE). A fill
   is then also right when every range holds the same chips as `expect`
   in any order and every box outside the ranges matches. Without `free`,
   nothing changes. */
export function markExact(fill, spec) {
  const want = spec.expect;
  if (!Array.isArray(fill) || fill.length !== want.length || fill.some(x => !x)) return { ok: false, why: "empty" };
  if (spec.chips && fill.some(x => !spec.chips.includes(x))) return { ok: false, why: "unknown" };
  if (fill.every((x, i) => x === want[i])) return { ok: true, why: "ok" };
  if (spec.free) {
    const norm = f => { const g = f.slice(); for (const [a, b] of spec.free) g.splice(a, b - a, ...g.slice(a, b).sort()); return g; };
    const f = norm(fill), w = norm(want);
    if (f.every((x, i) => x === w[i])) return { ok: true, why: "ok" };
  }
  for (const r of spec.why || []) {
    const part = fill.slice(r.from ?? 0, r.to ?? fill.length);
    if (r.has && r.has.every(c => part.includes(c))) return { ok: false, why: r.why };
    if (r.is && r.is.length === part.length && r.is.every((c, i) => part[i] === c)) return { ok: false, why: r.why };
  }
  return { ok: false, why: "pattern" };
}

/* ======================= ew9: read it off =======================
   "Lees dit af": the fractions are given, the learner reads the two
   triangles off them (her rule 24: the two sides that share a letter are
   sides of one Δ, its name under its fraction, a colour per Δ) and writes
   the two names in matching order. Her p.55 kind is a figure of its own. */

/* ---------------- her p.55 figure (kind B) ----------------
   Δ PQR, S on PR, QS joined, so that Δ QRS ||| Δ PRQ: the two triangles
   share the angle R̂ AND the side QR.
     shared  the corner of the shared angle ("R")
     far     the far end of the side S lies on ("P")
     apex    the third corner ("Q"); QS is joined
     cut     the point on the side shared–far ("S")
     xy      screen coordinates (y down) of shared, far and apex, any scale
     spell   optional side spellings, e.g. ["RQ"], where the default would
             say otherwise. Default: apex–shared (QR), shared–cut (RS),
             shared–far (RP), far–apex (PQ), apex–cut (QS), cut–far (SP)

   TO SCALE: S is placed at RS = QR² / RP from R (so RS / RP = QR² / RP²),
   which makes RQ̂S = P̂ EXACTLY (Δ QRS and Δ PRQ share R̂, and
   QR / RS = RP / QR). It throws unless QR < RP, and unless S sits well
   inside PR (never on an end, never on its middle). Those two equal angles
   get the same small arc mark (`eqAngles`), R̂ her star (ew4's, no arc of
   its own, so the arc marks only ever mean "equal"). NO right angle and no
   height (her 3 Oct ruling, kept: DBE does not work with it).

   names   the generic roles → this figure's spelling (QR → "QR", …)
   small   the Δ apex–shared–cut, spelt in that order ("QRS")
   big     the Δ far–shared–apex, spelt in that order ("PRQ")
   other   the third Δ in the figure, far–apex–cut ("PQS"), a decoy
   map     the correspondence small → big, corner by corner:
           apex → far, shared → shared, cut → apex ({ Q: "P", R: "R", S: "Q" })
   exam    the exam line QR² = RS · RP: { sq: "QR", prod: ["RS", "RP"] } */
export function sharedAngleSide({ shared, far, apex, cut, xy, spell = [] }) {
  const R = shared, P = far, Q = apex, S = cut;
  const pR = xy[R], pP = xy[P], pQ = xy[Q];
  const qr = dist(pQ, pR), rp = dist(pR, pP);
  if (!(qr < rp)) throw new Error("sharedAngleSide: QR must be shorter than RP");
  const s = (qr / rp) ** 2;                         // RS / RP
  if (!(s > 0.15 && s < 0.85) || Math.abs(s - 0.5) < 0.05) throw new Error("sharedAngleSide: S must sit well inside PR, never on its middle");
  const pS = lerp(pR, pP, s);
  const pts = { [P]: pP, [Q]: pQ, [R]: pR, [S]: pS };
  const nm = (X, Y) => (spell.includes(Y + X) ? Y + X : X + Y);
  const names = { QR: nm(Q, R), RS: nm(R, S), RP: nm(R, P), PQ: nm(P, Q), QS: nm(Q, S), SP: nm(S, P) };
  return {
    shared: R, far: P, apex: Q, cut: S, pts, names,
    small: Q + R + S, big: P + R + Q, other: P + Q + S,
    map: { [Q]: P, [R]: R, [S]: Q },
    exam: { sq: names.QR, prod: [names.RS, names.RP] },
    sketch: {
      pts,
      lines: [[P, Q], [Q, R], [R, P], [Q, S]],
      par: [],
      eqAngles: [{ at: Q, rays: [R, S] }, { at: P, rays: [R, Q] }],
      angle: { at: R, rays: [Q, P], star: true, arc: false },
      outside: [P, Q, R],
      labBox: true,
    },
  };
}

/* ---------------- the name marker (ew9, spec.mode "name") ----------------
   fill  the three corner letters in box order: Δ ADE ||| Δ ☐☐☐
   spec  { mode: "name", first: "ADE", map: { A: "A", D: "B", E: "C" }, chips }
         first = the name already written, map = the correspondence, corner
         by corner (from the fractions: AD pairs with AB, so A → A, D → B)

   RIGHT when box i holds the corner that matches the i-th corner of
   `first`: the ONE order that turns the second name the same way as the
   first (her ruling 29 Sep: corner order matters in a triangle's name).

   WRONG, with a reason for the hint:
     "empty"    a box is still empty
     "unknown"  a chip that is not in the bank (caller bug)
     "repeat"   a corner used twice ("Elke hoekpunt kom een keer")
     "order"    the three corners, in the wrong order
   It reads only letters, never a length: tools/check-ewe-marker.mjs proves
   all 27 fills of every name build against side ratios measured from the
   coordinates. */
export function markName(fill, spec) {
  const first = [...spec.first];
  if (!Array.isArray(fill) || fill.length !== first.length || fill.some(x => !x)) return { ok: false, why: "empty" };
  if (spec.chips && fill.some(x => !spec.chips.includes(x))) return { ok: false, why: "unknown" };
  if (new Set(fill).size < fill.length) return { ok: false, why: "repeat" };
  if (first.every((k, i) => spec.map[k] === fill[i])) return { ok: true, why: "ok" };
  return { ok: false, why: "order" };
}

/* ======================= ew10: the proof =======================
   "Die bewys": the proof of the theorem, her way (her boekie page "formele
   bewys" and her exam page). Δ PQR, S on PQ, T on PR, ST ∥ QR. Konstruksie:
   the height from T onto PQ and the height from S onto PR, both INSIDE
   Δ PST; then QT and RS joined. Then
     Opp Δ PST / Opp Δ QST = ½ · PS · h / ½ · SQ · h = PS / SQ
     Opp Δ PST / Opp Δ STR = ½ · PT · k / ½ · TR · k = PT / TR
     Opp Δ QST = Opp Δ STR           (dies. basis en dies. ⊥h, ST ∥ QR)
   so PS / SQ = PT / TR. Her page turns for each step so the learner SEES
   the one height: the sketch is drawn turned (js/ewe-kit.js `turn`). */

/* ---------------- her figure ----------------
   corner  P, the corner the cut line is nearest to
   ends    [Q, R]
   cuts    [S, T]: S on PQ, T on PR, ST ∥ QR (cutTriangle, the same t)
   xy      screen coordinates (y down) of P, Q and R, any scale
   t       PS / PQ = PT / PR; never (near) one half, so PS and SQ differ
   hts     the LETTERS of the two heights: [the one from T onto PQ, the one
           from S onto PR]. Her boekie: ["h", "k"]. Her exam page names them
           the other way round ("Trek h ⊥ op AN en k ⊥ AM"): ["k", "h"]
   tris    optional triangle spellings by role, as her page writes them:
             small PST, left QST, right STR, wholeL PQT, wholeR PSR, big PQR
   spell   optional side spellings (e.g. ["MC"]) where the default would say
           otherwise. Default: corner first (PS, PT, PQ, PR), the pieces in
           order (SQ, TR), ST, QR, and the joins QT, RS

   COMPUTED, never placed by eye: the cut points (cutTriangle), the FEET of
   the two heights (the projections of T on PQ and of S on PR), and X, where
   QT meets RS (the corner of the small Δ that Δ QST and Δ STR share, for
   the overlap of their tints). It throws unless each foot lies well INSIDE
   its piece of Δ PST ("hoogtelyn in Δ PST": strictly between P and S, and
   between P and T, never at an end), so Δ PST must be acute.

   seg      every side and join by its spelling: { from, to } (the height
            marker and the oracle read them)
   ratioSeg cutTriangle's seg (lines and positions), for markState's "true
            but not what was asked" test (markRatio)
   heights  by letter: { from, onto: [the side's ends], on: [the three points
            on that line], foot, piece: [the ends of the piece it lands in] }
   tri      the triangle names by role; corners[name] its three letters
   turns    the three turned views of her page: flatL (PQ flat, T above),
            flatR (PR flat, S above), par (ST and QR flat, P at the bottom)
   sketch   the bare figure (the Δ, ST, the ∥ arrows), every label outside
            Δ PQR, X as the ghost point "_x" (never drawn, never labelled;
            the underscore keeps it apart from any point's letter)
   hSpec    the two heights as js/ewe-kit.js draws them: { from, foot,
            along (the piece end on the side with more room, for the
            right-angle box), label, tone }
   joins    [[Q, T], [R, S]] */
export function proofFigure({ corner, ends, cuts, xy, t, hts = ["h", "k"], tris = {}, spell = [] }) {
  if (!(t > 0.2 && t < 0.8) || Math.abs(t - 0.5) < 0.04) throw new Error("proofFigure: t must be well inside (0, 1) and not one half");
  const base = cutTriangle({ corner, ends, cuts, xy, t });
  const P = corner, [Q, R] = ends, [S, T] = cuts, pts = base.pts;
  const proj = (X, A, B) => { const bx = pts[B].x - pts[A].x, by = pts[B].y - pts[A].y;
    const u = ((pts[X].x - pts[A].x) * bx + (pts[X].y - pts[A].y) * by) / (bx * bx + by * by);
    return { u, foot: lerp(pts[A], pts[B], u) }; };
  /* the foot of T on PQ, measured along PS (0 at P, 1 at S); of S on PR along PT */
  const f1 = proj(T, P, S), f2 = proj(S, P, T);
  for (const [f, w] of [[f1, `T on P${S}`], [f2, `S on P${T}`]])
    if (!(f.u > 0.12 && f.u < 0.88)) throw new Error(`proofFigure: the foot of the height from ${w} must lie well inside it (u = ${f.u.toFixed(3)})`);
  /* X: QT meets RS */
  const q = pts[Q], tt = pts[T], r = pts[R], s = pts[S];
  const d1 = { x: tt.x - q.x, y: tt.y - q.y }, d2 = { x: s.x - r.x, y: s.y - r.y };
  const den = d1.x * d2.y - d1.y * d2.x;
  const lam = ((r.x - q.x) * d2.y - (r.y - q.y) * d2.x) / den;
  const X = { x: q.x + lam * d1.x, y: q.y + lam * d1.y };
  const nm = (A, B) => (spell.includes(B + A) ? B + A : A + B);
  const names = { ...base.names, QT: nm(Q, T), RS: nm(R, S) };
  const seg = {};
  for (const [role, [a, b]] of Object.entries({ AD: [P, S], DB: [S, Q], AB: [P, Q], AE: [P, T], EC: [T, R], AC: [P, R], DE: [S, T], BC: [Q, R], QT: [Q, T], RS: [R, S] }))
    seg[names[role]] = { from: a, to: b };
  const [hT, hS] = hts;
  const heights = {
    [hT]: { from: T, onto: [P, Q], on: [P, S, Q], foot: f1.foot, piece: [P, S] },
    [hS]: { from: S, onto: [P, R], on: [P, T, R], foot: f2.foot, piece: [P, T] },
  };
  const tri = { small: P + S + T, left: Q + S + T, right: S + T + R, wholeL: P + Q + T, wholeR: P + S + R, big: P + Q + R, ...tris };
  const corners = Object.fromEntries(Object.values(tri).map(n => [n, [...n]]));
  /* the right-angle box goes towards the piece end with more room */
  const along = (f, A, B) => (dist(f, pts[A]) > dist(f, pts[B]) ? A : B);
  const hSpec = [
    { from: T, foot: f1.foot, along: along(f1.foot, P, S), label: hT, tone: hT },
    { from: S, foot: f2.foot, along: along(f2.foot, P, T), label: hS, tone: hS },
  ];
  return {
    corner: P, ends, cuts, t, pts, seg, ratioSeg: base.seg, names, heights, tri, corners, X,
    turns: { flatL: { flat: [P, Q], up: T }, flatR: { flat: [P, R], up: S }, par: { flat: [S, T], up: Q } },
    hSpec,
    joins: [[Q, T], [R, S]],
    sketch: { ...base.sketch, outside: [P, Q, R], ghost: { _x: X } },
  };
}

/* ---------------- the height marker (ew10, spec.mode "height") ----------------
   fill  the four chips in box order: [top1, top2, bot1, bot2], read as
         ½ · top1 · top2 over ½ · bot1 · bot2
   spec  { mode: "height", seg, heights, flat: ["P", "Q"], line: ["P", "S", "Q"],
           tris: ["PST", "QST"], H: "h" }
         seg and heights from proofFigure; flat = the line that lies flat in
         this step's turned sketch, line = the points on it; tris = the two
         named Δe, top first; H = THE height of this step (the one that
         stands on the flat line; her exam figure names it k)

   RIGHT when each product is one BASE and the height H, either order inside
   the product, the top product with the base of the first named Δ and the
   bottom product with the second's. A base is a segment on the flat line
   whose two ends are both corners of that Δ.

   WRONG, with a reason the screen turns into a hint; `chip` names the chip
   for the hints that say which one:
     "empty" / "unknown"   as always
     "height"   the OTHER height (k when the bases lie on PQ)
     "off"      a segment that is not on the flat line (PT or TR)
     "pattern"  a product that is not one base and H (two bases, H twice)
     "repeat"   the same base on top and below
     "order"    the two right products, swapped
     "wrongbase" a segment on the flat line that is not the base of its Δ
                (SQ for Δ PQT: Δ PQT stands on the whole PQ)
   Shape only, never a length: tools/check-ewe-marker.mjs proves every fill
   against areas measured (shoelace) from the coordinates. */
export function markHeight(fill, spec) {
  if (!Array.isArray(fill) || fill.length !== 4 || fill.some(x => !x)) return { ok: false, why: "empty" };
  const isH = x => !!spec.heights[x], isS = x => !!spec.seg[x];
  if (fill.some(x => !isH(x) && !isS(x))) return { ok: false, why: "unknown" };
  const wrongH = fill.find(x => isH(x) && x !== spec.H);
  if (wrongH) return { ok: false, why: "height", chip: wrongH };
  const onFlat = x => isS(x) && spec.line.includes(spec.seg[x].from) && spec.line.includes(spec.seg[x].to);
  const off = fill.find(x => isS(x) && !onFlat(x));
  if (off) return { ok: false, why: "off", chip: off };
  const baseIn = pr => (pr.filter(x => x === spec.H).length === 1 && pr.filter(onFlat).length === 1 ? pr.find(onFlat) : null);
  const bt = baseIn(fill.slice(0, 2)), bb = baseIn(fill.slice(2));
  if (!bt || !bb) return { ok: false, why: "pattern" };
  if (bt === bb) return { ok: false, why: "repeat", chip: bt };
  const baseOf = (b, T) => [spec.seg[b].from, spec.seg[b].to].every(c => T.includes(c));
  const [T1, T2] = spec.tris;
  if (baseOf(bt, T1) && baseOf(bb, T2)) return { ok: true, why: "ok" };
  if (baseOf(bt, T2) && baseOf(bb, T1)) return { ok: false, why: "order" };
  /* every other case holds a segment on the flat line that is the base of
     NEITHER named Δ (one base each, and a base twice is "repeat"): name it */
  return { ok: false, why: "wrongbase", chip: [bt, bb].find(b => !baseOf(b, T1) && !baseOf(b, T2)) };
}

/* ---------------- the statement marker (ew10, spec.mode "state") ----------------
   fill  the four chips in box order: ∴ fill[0]/fill[1] = fill[2]/fill[3]
   spec  { mode: "state", expect: ["PS", "SQ", "PT", "TR"], seg, chips }
         expect = the statement the question asks to prove; seg =
         proofFigure's ratioSeg (lines and positions, for markRatio)

   RIGHT when the fill is EXACTLY the statement asked: the two fractions as
   written, in either order around the "=" (PT/TR = PS/SQ says the same).
   WRONG, with a reason for the hint:
     "empty" / "unknown"   as always
     "repeat"   a chip used twice
     "form"     a TRUE ratio of the figure (markRatio: flipped, with the
                wholes, across), but not the one asked: "Skryf presies wat
                jy moet bewys" (her exam asks for one statement)
     "pattern"  anything else
   Shape only: tools/check-ewe-marker.mjs proves "form" against lengths. */
export function markState(fill, spec) {
  const w = spec.expect;
  if (!Array.isArray(fill) || fill.length !== 4 || fill.some(x => !x)) return { ok: false, why: "empty" };
  if (spec.chips && fill.some(x => !spec.chips.includes(x))) return { ok: false, why: "unknown" };
  const [a, b, c, d] = fill;
  if ((a === w[0] && b === w[1] && c === w[2] && d === w[3]) || (a === w[2] && b === w[3] && c === w[0] && d === w[1])) return { ok: true, why: "ok" };
  if (new Set(fill).size < 4) return { ok: false, why: "repeat" };
  if (markRatio(fill, { seg: spec.seg }).ok) return { ok: false, why: "form" };
  return { ok: false, why: "pattern" };
}
