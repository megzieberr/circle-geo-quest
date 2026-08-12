/* ============================================================
   CIRCLE DIAGRAM ENGINE  (shared rendering core)
   ------------------------------------------------------------
   Ported verbatim from Gr11_Tan_Chord_Theorem.html and wrapped
   as an ES module. Points live on the circle at given angles;
   tangents are computed perpendicular to the radius; every
   marked angle is measured from real coordinates, so the
   picture cannot lie.

   Three public entry points:
     renderDiagram(d, accent, opts)  -> SVG string (static, identical to original)
     computeGeometry(d)              -> resolved coordinates for interactive overlays
     verifyDiagram(d)                -> measures each drawn angle vs its true value v

   The diagram spec `d`:
     w,h            canvas size           (default 320 x 254)
     cx,cy,R        circle centre+radius  (default 160,120,80)
     pts            { label: degreeOnCircle }  or  { label: {x,y} } for a
                    free point that is NOT on the circle (added 2026-07-30)
     noCircle       true => do not draw the circle at all (added 2026-07-30)
     O              true => draw the centre dot + "O"
     ext            [{name, t:[contactA, contactB]}]  external point = tangent intersection
     tang           [{at, len, lab:[start,end]}]      full tangent line at a contact point
     chords         [[a,b], ...]
     angles         [{at, legs:[legA,legB], t:labelText, o:{v,r,ar,rot,mark,c,hl,reflex}}]
                    o.rot slides the label along its arc by N degrees
                    instead of parking it on the bisector (see angleSVG).
                    a leg is a point name, or "tg+" (deg+90) / "tg-" (deg-90)
                    o.reflex:1 (FIX-ROUND-2.md item 2, additive/opt-in) draws
                    the arc the LONG way round between the legs instead of
                    the default <=180° sweep — for marking a reflex angle.
                    v must then be the reflex value (360 − the short sweep);
                    verifyDiagram checks it exactly, not the short angle.
   ============================================================ */

export const INK = "#2b2f4a";

export function pol(cx, cy, r, deg) {
  const a = deg * Math.PI / 180;
  return [cx + r * Math.cos(a), cy - r * Math.sin(a)];
}
const N = v => Math.round(v * 10) / 10;

export function sweepOf(from, to) {
  let s = (to - from) % 360;
  if (s <= 0) s += 360;
  return s;
}

function arcPath(cx, cy, r, from, sweep) {
  const [x1, y1] = pol(cx, cy, r, from);
  const [x2, y2] = pol(cx, cy, r, from + sweep);
  return `M ${N(x1)} ${N(y1)} A ${r} ${r} 0 ${sweep > 180 ? 1 : 0} 0 ${N(x2)} ${N(y2)}`;
}

function labelR(s, text) {
  let r;
  if (s < 26) r = 86;
  else if (s < 40) r = 64;
  else if (s < 60) r = 50;
  else if (s < 100) r = 44;
  else r = 46;
  const len = (text || "").length;
  if (len >= 5) r += (len - 4) * 2.1;
  return r;
}

function colorFor(text, accent) {
  return /[a-z]/.test(text || "") ? accent : INK;
}

function angleSVG(cx, cy, from, to, text, o, accent, W, H) {
  o = o || {};
  const s = sweepOf(from, to);
  const col = o.c || colorFor(text, accent);
  let out = "";
  /* Marker-pen wedge highlight (FIX-ROUND-1.md, additive, opt-in via o.hl):
     a translucent filled pie-slice from the vertex out to a fixed radius,
     drawn BEFORE the arc/mark/text below it — so it reads as a highlighter
     stroke sitting under the normal drawing, never replacing it. Nothing
     without o.hl set is affected. */
  if (o.hl) {
    const wr = o.hlR || 34;
    const [wx1, wy1] = pol(cx, cy, wr, from);
    const [wx2, wy2] = pol(cx, cy, wr, from + s);
    out += `<path d="M ${N(cx)} ${N(cy)} L ${N(wx1)} ${N(wy1)} A ${wr} ${wr} 0 ${s > 180 ? 1 : 0} 0 ${N(wx2)} ${N(wy2)} Z" fill="${o.hl}" fill-opacity="0.32" stroke="none"/>`;
  }
  if (o.mark) {
    const m = 12;
    const p1 = pol(cx, cy, m, from), p2 = pol(cx, cy, m * Math.SQRT2, from + s / 2), p3 = pol(cx, cy, m, from + s);
    out += `<path d="M ${N(p1[0])} ${N(p1[1])} L ${N(p2[0])} ${N(p2[1])} L ${N(p3[0])} ${N(p3[1])}" fill="none" stroke="${col}" stroke-width="2"/>`;
  } else {
    const r = o.ar || (s < 40 ? 22 : 25);
    out += `<path d="${arcPath(cx, cy, r, from, s)}" fill="none" stroke="${col}" stroke-width="2.2"/>`;
  }
  if (text) {
    const lr = o.r || labelR(s, text);
    /* o.rot (additive, opt-in, 2026-08-12): slide the label ALONG its own
       arc by N degrees instead of leaving it on the bisector. Needed where
       the bisector happens to lie along a drawn line — pr4's ∠BOD is
       bisected by the radius OA, so "2y" sat exactly on top of OA and read
       as though it labelled ∠BOA (her playtest: "it kinda looks like you
       are saying BOA is 2y"). Only `r` existed before, and every radius on
       that bisector has the same problem. Nothing without o.rot moves. */
    const bis = from + s / 2 + (o.rot || 0);
    let [tx, ty] = pol(cx, cy, lr, bis);
    const hw = 6 + (text.length * 3.6);
    tx = Math.max(hw, Math.min(W - hw, tx));
    ty = Math.max(13, Math.min(H - 9, ty));
    out += `<text x="${N(tx)}" y="${N(ty)}" class="al" fill="${col}">${text}</text>`;
  }
  return out;
}

function lineEl(x1, y1, x2, y2) {
  return `<line class="ln" x1="${N(x1)}" y1="${N(y1)}" x2="${N(x2)}" y2="${N(y2)}"/>`;
}
/* Equal-length ticks ("tN") or parallel chevrons ("pN") stamped on a chord's
   midpoint. Purely decorative — never used to measure an angle — so verified
   diagrams are unaffected. Chevrons point from a→b, so author parallel chords
   in the same direction and their arrows line up. */
function chordMark(c) {
  if (!c.mk) return "";
  const kind = c.mk[0], n = parseInt(c.mk.slice(1), 10) || 1;
  const mx = (c.p1.x + c.p2.x) / 2, my = (c.p1.y + c.p2.y) / 2;
  const dx = c.p2.x - c.p1.x, dy = c.p2.y - c.p1.y, L = Math.hypot(dx, dy) || 1;
  const ux = dx / L, uy = dy / L, nx = -uy, ny = ux;   // along-chord and perpendicular units
  const gap = kind === "p" ? 4.5 : 4.5, start = -(n - 1) / 2 * gap;
  let out = "";
  for (let i = 0; i < n; i++) {
    const o = start + i * gap, bx = mx + ux * o, by = my + uy * o;
    if (kind === "t") {                 // equal-length tick — short perpendicular stroke
      const h = 5.5;
      out += `<line class="mk" x1="${N(bx - nx * h)}" y1="${N(by - ny * h)}" x2="${N(bx + nx * h)}" y2="${N(by + ny * h)}"/>`;
    } else {                            // parallel arrow — a chevron pointing a→b
      const w = 4.5, h = 4.5;
      out += `<path class="mk" fill="none" d="M ${N(bx + nx * h)} ${N(by + ny * h)} L ${N(bx + ux * w)} ${N(by + uy * w)} L ${N(bx - nx * h)} ${N(by - ny * h)}"/>`;
    }
  }
  return out;
}
/* Marker-pen highlight for a chord (FIX-ROUND-1.md, additive, opt-in via
   c.hl): a translucent thick stroke along the same segment, drawn BEFORE
   the normal thin line so it sits UNDER it, like a highlighter pass.
   Nothing without hl set is affected. */
function chordHighlight(c) {
  if (!c.hl) return "";
  return `<line x1="${N(c.p1.x)}" y1="${N(c.p1.y)}" x2="${N(c.p2.x)}" y2="${N(c.p2.y)}" stroke="${c.hl}" stroke-width="7" stroke-opacity="0.32" stroke-linecap="round"/>`;
}
function dot(x, y, col) {
  return `<circle cx="${N(x)}" cy="${N(y)}" r="2.6" fill="${col || INK}"/>`;
}
function svgWrap(W, H, inner, extraClass) {
  return `<svg class="diag${extraClass ? " " + extraClass : ""}" viewBox="0 0 ${W} ${H}" role="img" preserveAspectRatio="xMidYMid meet">${inner}</svg>`;
}

/* distance from point (px,py) to segment (ax,ay)-(bx,by) */
function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy;
  let t = L2 ? ((px - ax) * dx + (py - ay) * dy) / L2 : 0;
  t = Math.max(0, Math.min(1, t));
  const qx = ax + t * dx, qy = ay + t * dy;
  return Math.hypot(px - qx, py - qy);
}

/* Place the centre "O" label in the most open direction around the centre —
   farthest from every drawn line AND every other label — so it never sits on
   a radius, a diameter through O, or another label. */
function placeCentreLabel(g) {
  const { cx, cy, R } = g;
  const segs = [];
  g.chordSegs.forEach(c => segs.push([c.p1.x, c.p1.y, c.p2.x, c.p2.y]));
  g.tangentLines.forEach(t => segs.push([t.e1.x, t.e1.y, t.e2.x, t.e2.y]));
  g.extTangents.forEach(s => segs.push([s.p1.x, s.p1.y, s.p2.x, s.p2.y]));
  const pts = [];
  for (const k in g.pts) {
    const p = g.pts[k];
    if (p.centre) continue;
    if (p.circ) { const q = pol(cx, cy, R + 14, p.deg); pts.push([q[0], q[1]]); }
    else { const dir = Math.atan2(-(p.y - cy), p.x - cx) * 180 / Math.PI; const q = pol(p.x, p.y, 14, dir); pts.push([q[0], q[1]]); }
  }
  g.angles.forEach(a => { if (a.t) pts.push([a.label.x, a.label.y]); });

  let best = pol(cx, cy, 14, 35), bestScore = -1;
  for (let deg = 0; deg < 360; deg += 8) {
    const [x, y] = pol(cx, cy, 14, deg);
    let score = 1e9;
    segs.forEach(s => { score = Math.min(score, segDist(x, y, s[0], s[1], s[2], s[3])); });
    pts.forEach(p => { score = Math.min(score, Math.hypot(x - p[0], y - p[1])); });
    if (score > bestScore) { bestScore = score; best = [x, y]; }
  }
  return `<text class="pl" x="${N(best[0])}" y="${N(best[1])}">O</text>`;
}

/* --------------------------------------------------------------
   Resolve a spec into concrete coordinates. Used by both the
   renderer and the interactive overlay layer so geometry is
   computed exactly once, the same way, everywhere.
   -------------------------------------------------------------- */
export function computeGeometry(d) {
  const W = d.w || 320, H = d.h || 254;
  const cx = d.cx || 160, cy = d.cy || 120, R = d.R || 80;

  const pts = {};
  for (const k in (d.pts || {})) {
    const v = d.pts[k];
    // A free point, given as {x,y} instead of a degree. Added 2026-07-30 for
    // the "four dots and no circle that fits them" figure in Station 3, which
    // is about points rather than about a circle. `circ: false` keeps it out
    // of every code path that assumes a point has a `deg` (label placement,
    // tangent direction, ext intersections), so nothing existing is affected.
    if (v && typeof v === "object") {
      pts[k] = { x: v.x, y: v.y, free: true, label: k };
      continue;
    }
    const [x, y] = pol(cx, cy, R, v);
    pts[k] = { x, y, deg: v, circ: true, label: k };
  }

  /* the centre is always addressable as "O" (for radii and centre-to-chord
     lines) but is never auto-drawn as a labelled point — d.O controls that. */
  pts.O = { x: cx, y: cy, centre: true, label: "O" };

  /* external points = intersection of the two tangent lines at the contact points */
  (d.ext || []).forEach(e => {
    const a = pts[e.t[0]], b = pts[e.t[1]];
    const da = (a.deg + 90) * Math.PI / 180, db = (b.deg + 90) * Math.PI / 180;
    const ax = Math.cos(da), ay = -Math.sin(da), bx = Math.cos(db), by = -Math.sin(db);
    const det = ax * (-by) + bx * ay;
    const s = ((b.x - a.x) * (-by) + bx * (b.y - a.y)) / det;
    pts[e.name] = { x: a.x + s * ax, y: a.y + s * ay, ext: true, touches: e.t, label: e.name };
  });

  /* interior points: midpoint of two named points (e.g. foot of the
     perpendicular from the centre, which lands on the chord midpoint). */
  (d.mid || []).forEach(mp => {
    const a = pts[mp.of[0]], b = pts[mp.of[1]];
    pts[mp.name] = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, inner: true, label: mp.name };
  });

  /* points placed by extending a ray a->b past b (for exterior-angle setups). */
  (d.out || []).forEach(op => {
    const a = pts[op.along[0]], b = pts[op.along[1]];
    const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1;
    pts[op.name] = { x: b.x + dx / L * (op.len || 30), y: b.y + dy / L * (op.len || 30), outer: true, label: op.name };
  });

  const legDir = (V, leg) => {
    if (leg === "tg+") return V.deg + 90;
    if (leg === "tg-") return V.deg - 90;
    const P = pts[leg];
    return Math.atan2(-(P.y - V.y), P.x - V.x) * 180 / Math.PI;
  };

  /* full tangent lines */
  const tangentLines = (d.tang || []).map(t => {
    const p = pts[t.at], len = t.len || 112;
    const e1 = pol(p.x, p.y, len, p.deg - 90);
    const e2 = pol(p.x, p.y, len, p.deg + 90);
    return { at: t.at, contact: { x: p.x, y: p.y }, e1: { x: e1[0], y: e1[1] }, e2: { x: e2[0], y: e2[1] }, lab: t.lab, len };
  });

  /* tangent segments from external points (extended a little past the contact point) */
  const extTangents = [];
  (d.ext || []).forEach(e => {
    const P = pts[e.name];
    e.t.forEach(tn => {
      const T = pts[tn];
      const dx = T.x - P.x, dy = T.y - P.y, L = Math.hypot(dx, dy);
      extTangents.push({ from: e.name, to: tn, p1: { x: P.x, y: P.y }, p2: { x: T.x + dx / L * 16, y: T.y + dy / L * 16 } });
    });
  });

  const chordSegs = (d.chords || []).map(c => {
    const a = Array.isArray(c) ? c[0] : c.a;
    const b = Array.isArray(c) ? c[1] : c.b;
    const mk = Array.isArray(c) ? null : (c.mk || null);   // "p1"/"p2" parallel arrows · "t1"/"t2"/"t3" equal ticks
    const hl = Array.isArray(c) ? null : (c.hl || null);   // marker-pen highlight colour (FIX-ROUND-1.md, additive)
    return { a, b, mk, hl, p1: { x: pts[a].x, y: pts[a].y }, p2: { x: pts[b].x, y: pts[b].y } };
  });

  /* resolve every angle to a vertex, sweep and a clamped label position */
  const angles = (d.angles || []).map((a, i) => {
    const V = pts[a.at];
    let d1 = legDir(V, a.legs[0]), d2 = legDir(V, a.legs[1]);
    if (sweepOf(d1, d2) > 180) { const t = d1; d1 = d2; d2 = t; }
    const o = a.o || {};
    /* Reflex angle mark (FIX-ROUND-2.md item 2, additive, opt-in via
       o.reflex): the two lines above always resolve d1/d2 to the SHORT
       (<=180°) sweep between the legs — every existing diagram still gets
       exactly that, untouched. When o.reflex is set, swap d1/d2 BACK so
       the arc goes the long way round instead: sweepOf(d1,d2) becomes
       360 − (the short sweep), which is what "the reflex angle" means.
       arcPath's own large-arc-flag (sweep > 180 ? 1 : 0) already draws
       whichever sweep it's handed correctly, so nothing else needs to
       change to render it — only the swap decides which way is drawn. */
    if (o.reflex) { const t = d1; d1 = d2; d2 = t; }
    const s = sweepOf(d1, d2);
    const bis = d1 + s / 2;
    const lr = o.r || labelR(s, a.t);
    let [lx, ly] = pol(V.x, V.y, lr, bis);
    const hw = 6 + ((a.t || "").length * 3.6);
    lx = Math.max(hw, Math.min(W - hw, lx));
    ly = Math.max(13, Math.min(H - 9, ly));
    /* a stable hit point for tapping: out along the bisector, near the arc */
    const hitR = Math.min(lr, 30) + 6;
    const [hx, hy] = pol(V.x, V.y, hitR, bis);
    return {
      index: i, at: a.at, legs: a.legs, t: a.t, v: o.v, mark: !!o.mark,
      reflex: !!o.reflex,
      sweep: s, from: d1, to: d2, bis,
      vertex: { x: V.x, y: V.y }, label: { x: lx, y: ly }, hit: { x: hx, y: hy }
    };
  });

  return { W, H, cx, cy, R, O: !!d.O, pts, angles, tangentLines, extTangents, chordSegs };
}

/* --------------------------------------------------------------
   Render to an SVG string. Pixel-identical to the original
   buildCirc, so every existing tan-chord diagram looks the same.
   opts.extraClass adds a class to the <svg> (e.g. "mini").
   -------------------------------------------------------------- */
export function renderDiagram(d, accent, opts = {}) {
  const g = computeGeometry(d);
  const { W, H, cx, cy, R } = g;

  let out = d.noCircle ? "" : `<circle class="sirkel" cx="${cx}" cy="${cy}" r="${R}"/>`;
  if (g.O) {
    out += dot(cx, cy);
    out += placeCentreLabel(g);
  }

  /* full tangent lines + their S/U end labels */
  g.tangentLines.forEach(t => {
    out += lineEl(t.e1.x, t.e1.y, t.e2.x, t.e2.y);
    if (t.lab) {
      const p = g.pts[t.at];
      const l1 = pol(p.x, p.y, t.len + 4, p.deg - 90);
      const l2 = pol(p.x, p.y, t.len + 4, p.deg + 90);
      const off = pol(0, 0, 12, p.deg);
      out += `<text class="pl" x="${N(l1[0] + off[0])}" y="${N(l1[1] + off[1])}">${t.lab[0]}</text>`;
      out += `<text class="pl" x="${N(l2[0] + off[0])}" y="${N(l2[1] + off[1])}">${t.lab[1]}</text>`;
    }
  });

  /* tangent segments from external points */
  g.extTangents.forEach(s => out += lineEl(s.p1.x, s.p1.y, s.p2.x, s.p2.y));

  /* chords (+ optional marker-pen highlight UNDER the line, then the line
     itself, then optional equal-tick / parallel-arrow marks) */
  g.chordSegs.forEach(c => { out += chordHighlight(c); out += lineEl(c.p1.x, c.p1.y, c.p2.x, c.p2.y); out += chordMark(c); });

  /* angles */
  g.angles.forEach(a => {
    out += angleSVG(a.vertex.x, a.vertex.y, a.from, a.to, a.t, (d.angles[a.index].o || {}), accent, W, H);
  });

  /* point dots + labels */
  for (const k in g.pts) {
    const p = g.pts[k];
    if (p.centre) continue;            // the centre is drawn (or not) by the d.O block above
    out += dot(p.x, p.y);
    let lx, ly;
    if (p.circ) {
      [lx, ly] = pol(cx, cy, R + 14, p.deg);
    } else {
      const dir = Math.atan2(-(p.y - cy), p.x - cx) * 180 / Math.PI;
      [lx, ly] = pol(p.x, p.y, 14, dir);
    }
    out += `<text class="pl" x="${N(lx)}" y="${N(ly)}">${k}</text>`;
  }

  out += keySVG(d.key, W, H);

  return svgWrap(W, H, out, opts.extraClass);
}

/* --------------------------------------------------------------
   VALUE KEY (additive, opt-in via d.key — added 2026-08-12 on
   Megan's ask, with her own Canva mock-up as the reference).

   The problem it solves: a wedge whose value is long ("O₂ = 360−2x")
   cannot be written ON the wedge without colliding with its neighbour —
   at the centre of a cyclic quad, O₁ and O₂ share a vertex, so their
   labels sit on the same small patch of canvas and overlap however
   they're pinned. Her fix, and it's the right one: keep the SHORT NAME
   on the wedge (O₁ / O₂ / ∠A, where the learner needs it to read the
   picture) and move the VALUE to a colour-matched key beside the circle,
   the way a textbook does it.

   d.key = [{ t, c }, ...]            — defaults to the top-right corner
   d.key = { at: "tr"|"tl"|"br"|"bl", lines: [{ t, c }, ...] }

   Lines are always LEFT-ALIGNED with each other (her ask, 2026-08-12:
   "can we align them to the left instead of to the right") — the block
   shares one left edge and the right edge goes ragged, which reads as a
   list rather than as text pushed into a corner. For a right-hand corner
   that means the block's left edge has to be worked out from the widest
   line, and the engine has no text metrics — so CHW below is a measured
   per-character estimate. It is deliberately a slight OVER-estimate:
   too wide only slides the block a few px further from the edge, while
   too narrow would push the longest line off the canvas.
   spec.x overrides the computed left edge if a figure ever needs it.

   ⚠️ SYMBOL-ONLY, never prose. This text is rendered verbatim and is
   NOT translated — same rule as `solution.lines[].st`. "O₁ = 2x" is
   language-neutral; a sentence here would silently ship English into the
   Afrikaans version, which no checker would catch (check-bilingual
   doesn't scan symbol fields, by design).
   -------------------------------------------------------------- */
function keySVG(key, W, H) {
  if (!key) return "";
  const spec = Array.isArray(key) ? { lines: key } : key;
  const lines = spec.lines || [];
  if (!lines.length) return "";
  const at = spec.at || "tr";
  const right = at === "tr" || at === "br";
  const top = at === "tr" || at === "tl";
  /* LH 20 and y0 16, both set from real getBBox() measurements in the
     browser, not estimated: at 12.5px bold the glyph box is ~19px tall,
     so LH 16 made consecutive lines overlap by ~3px and y0 13 pushed the
     first line's box 2px off the top of the canvas. */
  /* CHW: real measured advance at 12.5px bold ranges 5.8–6.6 px/char
     across these strings (subscripts narrow, digits wide), so 7.0 keeps
     a small safety margin without leaving an obvious gap at the edge. */
  const LH = 20, PAD = 6, CHW = 7.0;
  const widest = Math.max(...lines.map(l => (l.t || "").length));
  const x = spec.x != null ? spec.x
    : right ? Math.max(PAD, W - PAD - widest * CHW)
    : PAD;
  const y0 = top ? 16 : H - PAD - (lines.length - 1) * LH - 4;
  return lines.map((l, i) =>
    `<text x="${N(x)}" y="${N(y0 + i * LH)}" class="ky" fill="${l.c || INK}" text-anchor="start">${l.t}</text>`
  ).join("");
}

/* --------------------------------------------------------------
   VERIFICATION  — the "diagrams cannot lie" guarantee.
   Measures every angle's drawn sweep from real coordinates and
   compares it to the declared true value v. Returns a list of
   results; callers can assert that every one is `ok`.
   -------------------------------------------------------------- */
export function verifyDiagram(d, tol = 1.5) {
  const g = computeGeometry(d);
  const results = [];
  g.angles.forEach(a => {
    if (a.v == null) return;            // unmarked angle: nothing to check
    /* drawn sweep, mapped to the angle the engine actually draws.
       Non-reflex marks are already clamped to <=180 by computeGeometry, so
       the ">180" branch below was previously dead code for them (kept as a
       defensive fallback). A reflex mark (o.reflex, FIX-ROUND-2.md item 2)
       is the opposite case: a.sweep IS the intended >180 value already —
       collapsing it to 360-a.sweep here would silently re-check it against
       the SHORT angle instead of the reflex one, which is exactly the
       "must verify exactly, not be skipped" failure mode the brief warned
       about. So a reflex mark's drawn value is a.sweep, untouched. */
    const drawn = a.reflex ? a.sweep : (a.sweep > 180 ? 360 - a.sweep : a.sweep);
    const diff = Math.abs(drawn - a.v);
    results.push({ at: a.at, t: a.t, drawn: Math.round(drawn * 10) / 10, v: a.v, diff: Math.round(diff * 10) / 10, ok: diff <= tol });
  });
  return results;
}
