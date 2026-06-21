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
     pts            { label: degreeOnCircle }
     O              true => draw the centre dot + "O"
     ext            [{name, t:[contactA, contactB]}]  external point = tangent intersection
     tang           [{at, len, lab:[start,end]}]      full tangent line at a contact point
     chords         [[a,b], ...]
     angles         [{at, legs:[legA,legB], t:labelText, o:{v,r,ar,mark,c}}]
                    a leg is a point name, or "tg+" (deg+90) / "tg-" (deg-90)
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
    const bis = from + s / 2;
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
    const [x, y] = pol(cx, cy, R, d.pts[k]);
    pts[k] = { x, y, deg: d.pts[k], circ: true, label: k };
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

  const chordSegs = (d.chords || []).map(c => ({ a: c[0], b: c[1], p1: { x: pts[c[0]].x, y: pts[c[0]].y }, p2: { x: pts[c[1]].x, y: pts[c[1]].y } }));

  /* resolve every angle to a vertex, sweep and a clamped label position */
  const angles = (d.angles || []).map((a, i) => {
    const V = pts[a.at];
    let d1 = legDir(V, a.legs[0]), d2 = legDir(V, a.legs[1]);
    if (sweepOf(d1, d2) > 180) { const t = d1; d1 = d2; d2 = t; }
    const s = sweepOf(d1, d2);
    const o = a.o || {};
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

  let out = `<circle class="sirkel" cx="${cx}" cy="${cy}" r="${R}"/>`;
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

  /* chords */
  g.chordSegs.forEach(c => out += lineEl(c.p1.x, c.p1.y, c.p2.x, c.p2.y));

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

  return svgWrap(W, H, out, opts.extraClass);
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
    /* drawn sweep, mapped to the <=180 interior angle the engine actually draws */
    const drawn = a.sweep > 180 ? 360 - a.sweep : a.sweep;
    const diff = Math.abs(drawn - a.v);
    results.push({ at: a.at, t: a.t, drawn: Math.round(drawn * 10) / 10, v: a.v, diff: Math.round(diff * 10) / 10, ok: diff <= tol });
  });
  return results;
}
