/* ============================================================
   INTERACTIVE "DISCOVER IT YOURSELF" DIAGRAMS
   ------------------------------------------------------------
   A live, draggable cousin of engine.js. A discovery round hands
   over a `model` describing:
     • a static base (circle, fixed points, fixed chords)
     • one or more draggable handles, each with a constraint
     • frame(pos, ctx)   -> what to draw for the current handles
     • measure(pos, ctx) -> the numbers the question will test
     • readouts(measure) -> the live number panel rows

   The component owns pointer dragging (mouse + touch), redraws
   every frame, and reports measures back through model.onChange so
   a discovery question can light up when the learner reaches the
   target configuration (e.g. the line hits 90°). Every angle and
   length is computed from real coordinates — the picture can't lie.

   mountInteractive(host, model) -> { measures, pos, refresh, destroy }
   ============================================================ */
import { pol, sweepOf, INK } from "./engine.js";
import { tx } from "./i18n.js";

const SVGNS = "http://www.w3.org/2000/svg";
const N = v => Math.round(v * 100) / 100;
function svg(tag, attrs) {
  const e = document.createElementNS(SVGNS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}

/* ---------- geometry helpers (shared with round frame() fns) ---------- */
export const degOf = (cx, cy, x, y) => {
  let d = Math.atan2(-(y - cy), x - cx) * 180 / Math.PI;
  return (d + 360) % 360;
};
export const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
/* interior angle P1–V–P2 in degrees (0..180) */
export function angleAt(V, P1, P2) {
  const a1 = Math.atan2(P1.y - V.y, P1.x - V.x);
  const a2 = Math.atan2(P2.y - V.y, P2.x - V.x);
  let d = Math.abs(a1 - a2) * 180 / Math.PI;
  if (d > 180) d = 360 - d;
  return d;
}
/* project point P onto segment A–B, returning param t (0..1) + point */
export function projParam(P, A, B) {
  const dx = B.x - A.x, dy = B.y - A.y, L2 = dx * dx + dy * dy || 1;
  let t = ((P.x - A.x) * dx + (P.y - A.y) * dy) / L2;
  return t;
}
/* where line through O and M meets the circle, on the far side from O→M dir */
export function rayToCircle(cx, cy, R, fromX, fromY, throughX, throughY) {
  const dx = throughX - fromX, dy = throughY - fromY, L = Math.hypot(dx, dy) || 1;
  return { x: cx + dx / L * R, y: cy + dy / L * R };
}

/* ============================================================ */
export function mountInteractive(host, model) {
  const W = model.w || 340, H = model.h || 300;
  const cx = model.cx ?? 168, cy = model.cy ?? 138, R = model.R ?? 96;

  // ---- resolve the fixed base points once ----
  const fixed = model.fixed || {};
  const P = {};
  for (const k in (fixed.pts || {})) {
    const [x, y] = pol(cx, cy, R, fixed.pts[k]);
    P[k] = { x, y, deg: fixed.pts[k], name: k, circ: true };
  }
  P.O = { x: cx, y: cy, name: "O", centre: true };

  const ctx = {
    cx, cy, R,
    P: name => (name === "O" ? P.O : P[name]),
    pol: (deg, r = R) => { const [x, y] = pol(cx, cy, r, deg); return { x, y }; },
    angleAt, dist, degOf: (x, y) => degOf(cx, cy, x, y), rayToCircle,
    onCircle: deg => { const [x, y] = pol(cx, cy, R, deg); return { x, y, deg }; },
  };

  // ---- handle state (parametric) ----
  const handles = (model.handles || []).map(h => ({ ...h, val: h.init }));
  function handlePoint(h) {
    if (h.kind === "free") return { x: h.val.x, y: h.val.y };
    if (h.kind === "arc" || h.kind === "circle") {
      const [x, y] = pol(cx, cy, R, h.val);
      return { x, y, deg: h.val };
    }
    // segment between two named points
    const A = ctx.P(h.a), B = ctx.P(h.b);
    const t = h.val;
    return { x: A.x + (B.x - A.x) * t, y: A.y + (B.y - A.y) * t, t };
  }
  function pos() {
    const o = {};
    handles.forEach(h => { o[h.id] = handlePoint(h); });
    return o;
  }

  // ---- DOM scaffold ----
  const wrap = document.createElement("div");
  wrap.className = "iv-wrap";
  const stage = document.createElementNS(SVGNS, "svg");
  stage.setAttribute("class", "diag iv");
  stage.setAttribute("viewBox", `0 0 ${W} ${H}`);
  stage.setAttribute("role", "img");
  stage.setAttribute("preserveAspectRatio", "xMidYMid meet");
  wrap.appendChild(stage);
  const panel = document.createElement("div");
  panel.className = "iv-readout";
  wrap.appendChild(panel);
  host.appendChild(wrap);

  // static layer (drawn once) + dynamic layer + handles layer
  const staticG = svg("g", { class: "iv-static" });
  const dynG = svg("g", { class: "iv-dyn" });
  const handG = svg("g", { class: "iv-handles" });
  stage.appendChild(staticG); stage.appendChild(dynG); stage.appendChild(handG);

  // ---- draw the static base ----
  staticG.appendChild(svg("circle", { class: "sirkel", cx, cy, r: R }));
  (fixed.chords || []).forEach(c => {
    const a = ctx.P(c[0]), b = ctx.P(c[1]);
    staticG.appendChild(svg("line", { class: "ln", x1: N(a.x), y1: N(a.y), x2: N(b.x), y2: N(b.y) }));
  });
  if (fixed.O) {
    staticG.appendChild(svg("circle", { cx, cy, r: 2.6, fill: INK }));
  }
  // fixed point dots + labels
  for (const k in P) {
    const p = P[k];
    if (p.centre && !fixed.O) continue;
    staticG.appendChild(svg("circle", { cx: N(p.x), cy: N(p.y), r: 2.6, fill: INK }));
    let lx, ly;
    if (p.circ) { [lx, ly] = pol(cx, cy, R + 15, p.deg); }
    else { lx = p.x + 12; ly = p.y - 10; }
    const tnode = svg("text", { class: "pl", x: N(lx), y: N(ly) });
    tnode.textContent = k;
    staticG.appendChild(tnode);
  }

  // ---- angle drawing helper (vertex + two leg points) ----
  function drawAngle(a) {
    const V = { x: a.vx, y: a.vy };
    let from = Math.atan2(-(a.uy - V.y), a.ux - V.x) * 180 / Math.PI;
    let to = Math.atan2(-(a.wy - V.y), a.wx - V.x) * 180 / Math.PI;
    let s = sweepOf(from, to);
    if (s > 180) { const t = from; from = to; to = t; s = sweepOf(from, to); }
    const col = a.color || INK;
    const g = svg("g", {});
    if (a.mark && Math.abs(s - 90) < 1.2) {
      const m = 13;
      const p1 = pol(V.x, V.y, m, from), p2 = pol(V.x, V.y, m * Math.SQRT2, from + s / 2), p3 = pol(V.x, V.y, m, from + s);
      g.appendChild(svg("path", { d: `M ${N(p1[0])} ${N(p1[1])} L ${N(p2[0])} ${N(p2[1])} L ${N(p3[0])} ${N(p3[1])}`, fill: "none", stroke: col, "stroke-width": 2.2 }));
    } else {
      const r = s < 42 ? 24 : 20;
      const [x1, y1] = pol(V.x, V.y, r, from), [x2, y2] = pol(V.x, V.y, r, from + s);
      g.appendChild(svg("path", { d: `M ${N(x1)} ${N(y1)} A ${r} ${r} 0 ${s > 180 ? 1 : 0} 0 ${N(x2)} ${N(y2)}`, fill: "none", stroke: col, "stroke-width": 2.4 }));
    }
    if (a.label != null) {
      const lr = s < 36 ? 40 : 30;
      const [lx, ly] = pol(V.x, V.y, lr, from + s / 2);
      const tn = svg("text", { class: "al", x: N(Math.max(14, Math.min(W - 14, lx))), y: N(Math.max(12, Math.min(H - 8, ly))), fill: col });
      tn.textContent = a.label;
      g.appendChild(tn);
    }
    return g;
  }

  // ---- the render loop ----
  let measures = {};
  function frame() {
    const p = pos();
    measures = model.measure ? model.measure(p, ctx) : {};
    const f = model.frame ? model.frame(p, ctx, measures) : {};

    // dynamic primitives
    dynG.replaceChildren();
    (f.segments || []).forEach(sgmt => {
      dynG.appendChild(svg("line", {
        class: "iv-seg " + (sgmt.cls || ""),
        x1: N(sgmt.x1), y1: N(sgmt.y1), x2: N(sgmt.x2), y2: N(sgmt.y2),
        // inline style beats the .iv-seg stylesheet rule (presentation attrs don't)
        ...(sgmt.color ? { style: `stroke:${sgmt.color}` } : {}),
      }));
    });
    (f.angles || []).forEach(a => dynG.appendChild(drawAngle(a)));
    (f.dots || []).forEach(d => {
      dynG.appendChild(svg("circle", { cx: N(d.x), cy: N(d.y), r: d.r || 3, fill: d.color || INK }));
      if (d.label != null) {
        const tn = svg("text", { class: "pl", x: N(d.x + (d.dx ?? 12)), y: N(d.y + (d.dy ?? -10)) });
        tn.textContent = d.label; dynG.appendChild(tn);
      }
    });

    // handles on top
    handG.replaceChildren();
    handles.forEach(h => {
      const hp = handlePoint(h);
      handG.appendChild(svg("circle", { class: "iv-halo", cx: N(hp.x), cy: N(hp.y), r: 16 }));
      const grip = svg("circle", { class: "iv-grip", cx: N(hp.x), cy: N(hp.y), r: 8, "data-h": h.id });
      handG.appendChild(grip);
    });

    // readout panel
    if (model.readouts) {
      const rows = model.readouts(measures, p, ctx) || [];
      panel.replaceChildren();
      rows.forEach(r => {
        const row = document.createElement("div");
        row.className = "iv-row" + (r.hot ? " hot" : "");
        row.innerHTML = `<span class="iv-k">${tx(r.label)}</span><span class="iv-v" ${r.color ? `style="color:${r.color}"` : ""}>${typeof r.value === "object" ? tx(r.value) : r.value}</span>`;
        panel.appendChild(row);
      });
    }

    if (model.onChange) model.onChange(measures, p, ctx);
  }

  // ---- pointer dragging ----
  function clientToSvg(evt) {
    const ctm = stage.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const pt = stage.createSVGPoint();
    pt.x = evt.clientX; pt.y = evt.clientY;
    const r = pt.matrixTransform(ctm.inverse());
    return { x: r.x, y: r.y };
  }
  let dragging = null;
  function pickHandle(evt) {
    const t = evt.target;
    if (t && t.dataset && t.dataset.h) return handles.find(h => h.id === t.dataset.h);
    // fall back to nearest handle within grab radius
    const m = clientToSvg(evt);
    let best = null, bestD = 26;
    handles.forEach(h => { const hp = handlePoint(h); const d = Math.hypot(hp.x - m.x, hp.y - m.y); if (d < bestD) { bestD = d; best = h; } });
    return best;
  }
  function moveTo(h, m) {
    if (h.kind === "free") {
      let p = { x: Math.max(8, Math.min(W - 8, m.x)), y: Math.max(8, Math.min(H - 8, m.y)) };
      if (h.clamp) p = h.clamp(p, ctx);
      h.val = p;
      frame();
      return;
    }
    if (h.kind === "arc" || h.kind === "circle") {
      let d = degOf(cx, cy, m.x, m.y);
      if (h.kind === "arc") {
        // clamp into [min,max] taking wrap into account
        const lo = h.min, hi = h.max;
        const within = (lo <= hi) ? (d >= lo && d <= hi) : (d >= lo || d <= hi);
        if (!within) {
          // snap to nearer endpoint
          const da = Math.min(Math.abs(((d - lo + 540) % 360) - 180), 360);
          const db = Math.min(Math.abs(((d - hi + 540) % 360) - 180), 360);
          d = da < db ? lo : hi;
        }
      }
      h.val = d;
    } else {
      const A = ctx.P(h.a), B = ctx.P(h.b);
      let t = projParam(m, A, B);
      t = Math.max(h.min ?? 0, Math.min(h.max ?? 1, t));
      // optional magnet snap to key positions (e.g. the midpoint)
      if (h.snap) { const r = h.snapR ?? 0.04; for (const s of h.snap) if (Math.abs(t - s) < r) { t = s; break; } }
      h.val = t;
    }
    frame();
  }
  stage.addEventListener("pointerdown", e => {
    const h = pickHandle(e);
    if (!h) return;
    dragging = h;
    stage.setPointerCapture(e.pointerId);
    wrap.classList.add("grabbing");
    moveTo(h, clientToSvg(e));
    e.preventDefault();
  });
  stage.addEventListener("pointermove", e => { if (dragging) { moveTo(dragging, clientToSvg(e)); e.preventDefault(); } });
  const end = e => { if (dragging) { dragging = null; wrap.classList.remove("grabbing"); try { stage.releasePointerCapture(e.pointerId); } catch {} } };
  stage.addEventListener("pointerup", end);
  stage.addEventListener("pointercancel", end);

  frame();

  return {
    get measures() { return measures; },
    pos,
    refresh: frame,
    setHandle(id, val) { const h = handles.find(x => x.id === id); if (h) { h.val = val; frame(); } },
    destroy() { wrap.remove(); },
  };
}
