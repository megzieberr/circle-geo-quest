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
     • onChange(m,pos,ctx)  -> every frame, while dragging
     • onRelease(m,pos,ctx) -> once, when a drag ends

   The component owns pointer dragging (mouse + touch), redraws
   every frame, and reports measures back through model.onChange so
   a discovery question can light up when the learner reaches the
   target configuration (e.g. the line hits 90°). Every angle and
   length is computed from real coordinates — the picture can't lie.

   mountInteractive(host, model) -> { measures, pos, refresh, destroy }

   ------------------------------------------------------------------
   THREE ADDITIVE ENGINE CAPABILITIES (added 2026-08-14, Dynamic Geometry
   build session 1, DYNAMIC-GEO-PLAN.md). All three are opt-in — a model
   that doesn't set them renders exactly as before.

   1 · CONDITION-LOCK DRAG. A handle may carry:
         lock: { test(measures,pos,ctx) -> bool, solve(pos,ctx,currentVal) -> newVal }
       Every move, once the handle's tentative position is set, test() is
       asked whether the relation the round cares about (e.g. "AB ∥ CD")
       has come close enough to true. If so, solve() gets one chance to
       correct the tentative value to the EXACT locking value (however it
       wants — closed form or a local numeric search), and the handle
       snaps there instead. The round's own frame()/readouts() decide
       what "locked" looks like (colour, a flashing mark, a hot readout)
       by reading the same measures — the engine only does the snap.

   2 · MARKS. frame() may now return `marks: [{x1,y1,x2,y2,kind,n,flash,color}]`,
       drawn on the dynamic layer the same way engine.js draws chord ticks
       and parallel chevrons on a static diagram — "tick" for an equal-
       length mark, "parallel" (default) for a chevron. `flash:true` adds
       a pulsing CSS class, for the moment a condition-lock actually locks.

   3 · GLIDE. `model.glide = { handleId, from, to, duration }` renders a
       Play/Pause button + a scrubbable range slider under the readout
       panel, driving the named handle's value from `from` to `to` over
       `duration` ms. Built on setInterval, NOT requestAnimationFrame —
       the preview pane this app is built and reviewed in never fires
       rAF, and a slow, scrubbable glide is the actual teaching feature
       ("watch it move" beats an instant jump). The slider always works
       even where the timer wouldn't (e.g. a screenshot tool stepping
       through frames by hand).

   4 · READOUT ROW EXTRAS. A row from model.readouts() may now also carry
       `pulse:true` (one-shot highlight — a round sets this true for the
       single frame something notable just happened, e.g. the reading
       crossed to a new constant) and `big:true` (larger hero-reading
       type, for the ONE number a round wants a learner's eyes on). Both
       are additive: a row with neither renders exactly as before.
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

  /* CONDITION-LOCK DRAG (additive, opt-in via handle.lock — see the header
     note). Called after a handle's tentative value is already set, so
     test()/solve() see the position the drag actually reached. Silently a
     no-op for a model with no measure() — a lock has nothing to test. */
  function applyLock(h) {
    if (!h.lock || !model.measure) return;
    const p = pos();
    const m = model.measure(p, ctx);
    if (h.lock.test(m, p, ctx)) h.val = h.lock.solve(p, ctx, h.val);
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

  /* GLIDE (additive, opt-in via model.glide — see the header note): a
     Play/Pause button + a scrubbable slider, both driving the SAME handle
     value the pointer drag would. Built here, in the DOM scaffold, so the
     control bar sits under the readout panel for every model that sets it. */
  let glideBtn = null, glideSlider = null, glideTimer = null, glideT = 0;
  if (model.glide) {
    const g = model.glide;
    const gWrap = document.createElement("div");
    gWrap.className = "iv-glide";
    glideBtn = document.createElement("button");
    glideBtn.type = "button";
    glideBtn.className = "iv-glide-btn";
    glideBtn.setAttribute("aria-label", "play");
    glideBtn.textContent = "▶";
    glideSlider = document.createElement("input");
    glideSlider.type = "range";
    glideSlider.min = "0"; glideSlider.max = "1000"; glideSlider.step = "1"; glideSlider.value = "0";
    glideSlider.className = "iv-glide-slider";
    gWrap.appendChild(glideBtn);
    gWrap.appendChild(glideSlider);
    wrap.appendChild(gWrap);
  }
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

  /* MARKS (additive — see the header note): a chevron ("parallel", default)
     or a short perpendicular tick ("tick"), stamped on the midpoint of a
     dynamic segment. Mirrors engine.js's chordMark() for static diagrams,
     but works on live {x1,y1,x2,y2} coordinates instead of a declared
     chord. `flash:true` adds the pulsing CSS class (styles.css) — the
     round decides WHEN to flash by reading its own measures, this only
     draws it. */
  function drawMark(mk) {
    const x1 = mk.x1, y1 = mk.y1, x2 = mk.x2, y2 = mk.y2;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
    const ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    const n = mk.n || 2, gap = 4.5, start = -(n - 1) / 2 * gap;
    const col = mk.color || INK;
    const g = svg("g", { class: "iv-mark" + (mk.flash ? " flash" : "") });
    for (let i = 0; i < n; i++) {
      const o = start + i * gap, bx = mx + ux * o, by = my + uy * o;
      if (mk.kind === "tick") {
        const h = 5.5;
        g.appendChild(svg("line", { x1: N(bx - nx * h), y1: N(by - ny * h), x2: N(bx + nx * h), y2: N(by + ny * h), stroke: col, "stroke-width": 2 }));
      } else {
        const w = 4.5, h = 4.5;
        g.appendChild(svg("path", { fill: "none", stroke: col, "stroke-width": 2, d: `M ${N(bx + nx * h)} ${N(by + ny * h)} L ${N(bx + ux * w)} ${N(by + uy * w)} L ${N(bx - nx * h)} ${N(by - ny * h)}` }));
      }
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
    (f.marks || []).forEach(mk => dynG.appendChild(drawMark(mk)));
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
        row.className = "iv-row" + (r.hot ? " hot" : "") + (r.pulse ? " pulse" : "") + (r.big ? " big" : "");
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
      if (h.lock) applyLock(h);
    } else {
      const A = ctx.P(h.a), B = ctx.P(h.b);
      let t = projParam(m, A, B);
      t = Math.max(h.min ?? 0, Math.min(h.max ?? 1, t));
      // optional magnet snap to key positions (e.g. the midpoint)
      if (h.snap) { const r = h.snapR ?? 0.04; for (const s of h.snap) if (Math.abs(t - s) < r) { t = s; break; } }
      h.val = t;
      if (h.lock) applyLock(h);
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
  /* onRelease fires once when a drag ENDS, not on every frame like onChange.
     That is what makes "the app records the learner's own readings" possible
     (Megan, 2026-07-30): one reading per position the learner actually stopped
     at, instead of hundreds per drag. See `record` in js/investigate.js. */
  const end = e => {
    if (!dragging) return;
    dragging = null;
    wrap.classList.remove("grabbing");
    try { stage.releasePointerCapture(e.pointerId); } catch {}
    if (model.onRelease) model.onRelease(measures, pos(), ctx);
  };
  stage.addEventListener("pointerup", end);
  stage.addEventListener("pointercancel", end);

  /* GLIDE wiring — setInterval, not requestAnimationFrame (see header note).
     The slider and the Play button drive the exact same setT(), so scrubbing
     by hand and watching it glide are the same mechanism, just two speeds. */
  if (model.glide) {
    const g = model.glide;
    const setT = (t) => {
      glideT = Math.max(0, Math.min(1, t));
      glideSlider.value = String(Math.round(glideT * 1000));
      const h = handles.find(x => x.id === g.handleId);
      if (h) {
        h.val = g.from + (g.to - g.from) * glideT;
        if (h.lock) applyLock(h);
      }
      frame();
    };
    const stopGlide = () => {
      if (!glideTimer) return;
      clearInterval(glideTimer); glideTimer = null;
      glideBtn.textContent = "▶";
      glideBtn.classList.remove("playing");
      glideBtn.setAttribute("aria-label", "play");
    };
    const startGlide = () => {
      if (glideTimer) return;
      if (glideT >= 1) glideT = 0;
      glideBtn.textContent = "⏸";
      glideBtn.classList.add("playing");
      glideBtn.setAttribute("aria-label", "pause");
      const dur = g.duration || 5000, stepMs = 60;
      glideTimer = setInterval(() => {
        setT(glideT + stepMs / dur);
        if (glideT >= 1) stopGlide();
      }, stepMs);
    };
    glideBtn.addEventListener("click", () => { glideTimer ? stopGlide() : startGlide(); });
    glideSlider.addEventListener("input", () => { stopGlide(); setT(Number(glideSlider.value) / 1000); });
    setT(g.startT ?? 0);
  }

  frame();

  return {
    get measures() { return measures; },
    pos,
    refresh: frame,
    setHandle(id, val) { const h = handles.find(x => x.id === id); if (h) { h.val = val; frame(); } },
    destroy() { if (glideTimer) clearInterval(glideTimer); wrap.remove(); },
  };
}
