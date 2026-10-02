/* ============================================================
   EWEREDIGHEID KIT  (the shared DOM pieces for rounds ew1 to ew6)
   ------------------------------------------------------------
   Three things, each ONE copy for the whole feature:

   1 · THE FRACTION DRAWER   fracHtml() + the .ewf classes
       Her warning (2026-09-29): "Pay extra attention to fractions,
       we've had some ups and downs with the fractions in Blipwork."
       Every rule below is a Blipwork failure that must not come back:
         1  every fraction is a REAL stacked fraction: numerator, a bar,
            denominator. Never "AD/DB" with a slash, anywhere.
         2  ONE drawer. The boxes, the hints, the options and the
            "Só skryf jy dit" card all call fracHtml(); there is no
            second spelling of a fraction in this feature.
         3  never a line break inside a fraction: .ewf is nowrap, and an
            equation only breaks BEFORE its "=" (eqHtml's two units).
         4  the bar spans the wider of numerator and denominator: the
            bar is its own grid row, stretched across the column, while
            the numerator and denominator sit centred in it.
         5  never a fraction inside a fraction: fracHtml refuses one
            (the half in the area rule is the single character ½).
         6  a square is a real superscript: sqHtml("AD") draws AD².
         7  a product next to a fraction goes INSIDE the numerator:
            pass the factors as an array, prodHtml() joins them with ·.
         8  nothing sticks out past a phone screen: measured, not hoped,
            by tools/ewe-phone-check.py at 375px.
         9  that same script measures every rendered fraction: numerator
            above the bar, denominator below, bar at least as wide as
            both, all of it on screen.

   2 · THE FILL-THE-BOXES PAD   mountFillPad()
       Blipwork's tokenpad FRAME MODE, rebuilt on the drawer above:
       the equation skeleton with empty boxes, the NEXT box glows, a chip
       click drops into it, chips are never used up, chip order is
       shuffled, ⌫ removes the last chip, Kontroleer marks.

   3 · THE SKETCH   sketchSvg()
       A to-scale triangle sketch with ∥ arrows (ew3, opt-in: tinted
       triangles and a dotted ⊥h with its right-angle box), drawn with the same
       svg.diag classes as the circle engine (js/engine.js) so it looks
       like the rest of the app. Labels are PLACED, not typed: each one
       goes where it is farthest from every line, arrow and other label.

   All learner-facing text in here is Afrikaans only (her ruling).
   ============================================================ */
import { SLOT } from "./ewe-core.js";
import { el } from "./ui.js";

export function esc(t) {
  return String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

/* ---------------- 1 · the fraction drawer ---------------- */

/* A side of a fraction: an HTML string, or an ARRAY of factors (rule 7:
   a product goes inside the numerator, joined by a centred dot). */
function part(x) {
  const html = Array.isArray(x) ? prodHtml(x) : String(x);
  if (html.includes('class="ewf"')) throw new Error("fracHtml: a fraction inside a fraction (rule 5)");
  return html;
}
export function prodHtml(factors) {
  return factors.map(String).join('<span class="ewf-dot">·</span>');
}
/* rule 6: AD² with a real raised 2 */
export function sqHtml(x) { return `${x}<sup class="ewf-sq">2</sup>`; }

/* THE one fraction. num/den are trusted HTML (already escaped by the
   caller, or built by this file). */
export function fracHtml(num, den) {
  return `<span class="ewf"><span class="ewf-n">${part(num)}</span>`
       + `<span class="ewf-bar" aria-hidden="true"></span>`
       + `<span class="ewf-d">${part(den)}</span></span>`;
}

/* An equation: two units, and the "=" travels WITH the right-hand side,
   so a line too wide for the phone breaks before the "=" and never inside
   either side (rule 3). */
export function eqHtml(leftHtml, rightHtml) {
  return `<span class="ewq"><span class="ewq-u">${leftHtml}</span>`
       + `<span class="ewq-u"><span class="ewq-eq">=</span>${rightHtml}</span></span>`;
}

/* a ratio fill [a, b, c, d] as a/b = c/d, letters escaped */
export function ratioHtml(fill) {
  const [a, b, c, d] = fill.map(esc);
  return eqHtml(fracHtml(a, b), fracHtml(c, d));
}

/* The written line, as it goes on the exam page: the equation, and the
   reason next to it in brackets. The reason is a separate unit: when the
   phone is too narrow it moves down whole. */
export function writtenLineHtml(fill, reason) {
  return `<div class="ewl">${ratioHtml(fill)}`
       + (reason ? `<span class="ewl-rs">(${esc(reason)})</span>` : "") + `</div>`;
}

/* ew2: the line ABOVE the ratio on the exam page, the two similar
   triangles with their reason: "Δ FJK ||| Δ FGH  (∠∠∠)". Plain text, no
   fraction; the names are one unit and never break. */
export function simLineHtml(text, reason) {
  return `<div class="ewl ewl-sim"><span class="ewl-tx">${esc(text)}</span>`
       + (reason ? `<span class="ewl-rs">(${esc(reason)})</span>` : "") + `</div>`;
}

/* ew3: her area chain, as on her p.43, with the reason next to it:
     Opp Δ ABC     ½ · BC · ⊥h     BC
     --------- = ------------- = --     (gemeenskaplike hoogte ⊥ en lyn)
     Opp Δ ACD     ½ · CD · ⊥h     CD
   The ½ and the ⊥h in the middle fraction are STRUCK THROUGH (her purple
   strokes) by a span INSIDE the one fraction drawer, never a second drawer.
   Three whole fractions: the chain breaks only before an "=", and the
   reason moves down whole. The two "Opp Δ" names carry the triangles'
   tints, the same two as in the sketch.
   area = { tris: ["ABC", "ACD"], bases: ["BC", "CD"] } */
export function areaLineHtml(area, reason) {
  const [t1, t2] = area.tris.map(esc), [b1, b2] = area.bases.map(esc);
  const x = v => `<span class="ewf-x">${v}</span>`;
  const chain = chainHtml([
    fracHtml(tintHtml(`Opp Δ ${t1}`, 1), tintHtml(`Opp Δ ${t2}`, 2)), "=",
    fracHtml([x("½"), b1, x("⊥h")], [x("½"), b2, x("⊥h")]), "=",
    fracHtml(b1, b2),
  ]);
  return `<div class="ewl ewl-area">${chain}`
       + (reason ? `<span class="ewl-rs">(${esc(reason)})</span>` : "") + `</div>`;
}
/* a word in one of the two triangle tints (trusted HTML in, already escaped) */
function tintHtml(html, k) { return `<span class="ewtint ewtint-${k}">${html}</span>`; }

/* units (fraction HTML strings and "=" markers) as one equation: each side
   is one unit and the "=" rides with what follows it, so a line too wide
   for the phone breaks only BEFORE an "=" (the eqHtml rule, for any number
   of sides) */
function chainHtml(units) {
  let html = "", open = false;
  units.forEach((u, k) => {
    if (u === "=") { if (open) html += "</span>"; html += `<span class="ewq-u"><span class="ewq-eq">=</span>`; open = true; return; }
    if (!open) { html += `<span class="ewq-u">`; open = true; }
    html += u;
    const next = units[k + 1];
    if (next === "=" || next == null) { html += "</span>"; open = false; }
  });
  return `<span class="ewq">${html}</span>`;
}

/* a frame's text cell: plain text, or (ew3, opt-in) { t, tint } for a word
   in a triangle's tint, e.g. { t: "Opp Δ ABC", tint: 1 } */
function fxCell(c) {
  if (c && typeof c === "object") return `<span class="ewpad-fx ewtint ewtint-${c.tint}">${esc(c.t)}</span>`;
  return `<span class="ewpad-fx">${esc(c)}</span>`;
}
function frameUnits(frame, cell) {
  return frame.map(u => (u === "=" ? "=" : Array.isArray(u) ? `<span class="ewpad-run">${u.map(cell).join("")}</span>`
                                                            : fracHtml(u.n.map(cell).join(""), u.d.map(cell).join(""))));
}

/* ew3, opt-in: a frame with its boxes filled in, as a finished line (no
   boxes): the ✓ feedback and "Wys my" of a step that brings its own frame */
export function frameHtml(frame, fill) {
  let i = 0;
  return chainHtml(frameUnits(frame, c => (c === SLOT ? `<span class="ewpad-in">${esc(fill[i++] ?? "")}</span>` : fxCell(c))));
}

/* ---------------- 2 · the fill-the-boxes pad ----------------
   frame   the skeleton, left to right. An entry is:
             "="                         the equals sign (a break point)
             { n:[cells], d:[cells] }    a stacked fraction
             [cells]                     an inline run
           and a cell is SLOT (a box) or plain text (ew3, opt-in: or
           { t, tint } for a word in a triangle's tint).
   chips   the chip texts. Shuffled here, once per mount. Two chips may
           never read the same (it throws: that is an authoring bug).
   onSubmit(fill)   fill = the chips in box order
   fixed   OPT-IN (ew2): chips already sitting in the first boxes, e.g.
           ["JK"]. They cannot be deleted, the glow starts on the first
           EMPTY box, and they are part of the fill handed to onSubmit.
           Left out, the pad behaves exactly as before.

   returns { fill, clear, setFill, lock } */
export function mountFillPad(host, { frame, chips, onSubmit, onEdit, fixed }) {
  if (new Set(chips).size !== chips.length) throw new Error("mountFillPad: two chips read the same");
  const nSlots = frame.reduce((k, u) => k + cellsOf(u).filter(c => c === SLOT).length, 0);
  const given = Array.isArray(fixed) ? fixed.slice() : [];
  if (given.length >= nSlots || given.some(g => !chips.includes(g))) throw new Error("mountFillPad: a fixed chip must be a chip, with at least one box left empty");
  let toks = given.slice();
  let locked = false;

  const wrap = el("div", "ewpad");
  const disp = el("div", "ewpad-disp");
  wrap.appendChild(disp);

  function paint() {
    let i = 0;
    const cell = c => {
      if (c !== SLOT) return fxCell(c);
      const k = i++;
      const filled = k < toks.length;
      const cls = "ewslot" + (filled ? " is-filled" + (k < given.length ? " is-fixed" : "") : (k === toks.length && !locked ? " is-next" : ""));
      return `<span class="${cls}" data-slot="${k}">${filled ? esc(toks[k]) : ""}</span>`;
    };
    /* same break rule as eqHtml: the "=" rides with what follows it */
    disp.innerHTML = chainHtml(frameUnits(frame, cell));
    sub.disabled = locked || toks.length < nSlots;
    del.disabled = locked || toks.length <= given.length;
  }

  const grid = el("div", "ewpad-grid");
  const shuffled = shuffle(chips);
  shuffled.forEach(c => {
    const b = el("button", "ewchip", esc(c));
    b.type = "button";
    b.addEventListener("click", () => { if (locked || toks.length >= nSlots) return; toks.push(c); paint(); onEdit && onEdit(); });
    grid.appendChild(b);
  });
  /* the ⌫ / Kontroleer row always starts a fresh row, so a thumb reaching
     for the last chip never lands on Kontroleer (Blipwork's same rule) */
  const gap = shuffled.length % 3;
  if (gap) { const f = el("span", "ewpad-gap"); f.style.gridColumn = `span ${3 - gap}`; grid.appendChild(f); }
  const del = el("button", "ewchip ewkey-del", "⌫");
  del.type = "button";
  del.setAttribute("aria-label", "Vee die laaste stuk uit");
  del.addEventListener("click", () => { if (locked || toks.length <= given.length) return; toks.pop(); paint(); onEdit && onEdit(); });
  grid.appendChild(del);
  const sub = el("button", "ewchip ewkey-sub", "Kontroleer ✓");
  sub.type = "button";
  sub.style.gridColumn = "span 2";
  sub.addEventListener("click", () => { if (locked || toks.length < nSlots) return; onSubmit && onSubmit(toks.slice()); });
  grid.appendChild(sub);
  wrap.appendChild(grid);
  host.appendChild(wrap);
  paint();

  return {
    get fill() { return toks.slice(); },
    clear() { toks = given.slice(); paint(); },
    setFill(f) { toks = f.slice(0, nSlots); paint(); },
    lock() { locked = true; grid.querySelectorAll("button").forEach(b => { b.disabled = true; }); wrap.classList.add("is-locked"); paint(); },
    node: wrap,
  };
}
function cellsOf(u) { return u === "=" ? [] : Array.isArray(u) ? u : [...u.n, ...u.d]; }

/* Fisher–Yates. Chip order is shuffled per question so the answer is never
   "click them left to right". */
export function shuffle(xs) {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------------- 3 · the sketch ----------------
   spec: { pts:{name:{x,y}}, lines:[[a,b],…], par:[[a,b],…] }
   Fits the points into a W×H canvas, draws the lines, a ∥ chevron at the
   middle of every `par` line (pointing a→b, so author both ∥ lines in the
   same direction), a dot and a placed label at every point.
   ew3, OPT-IN (left out, nothing changes):
     tints   [["A","B","C"], ["A","C","D"]]   each triangle a light tint of
             its own (her colour habit), drawn first so every line is on top
     height  { from: "A", foot:{x,y}, dir:{x,y} }   the dotted ⊥h from the
             apex to its foot, the right-angle box at the foot (on the side
             `dir` along the base) and the label "⊥h" beside it, placed like
             the point labels */
const W = 320, H = 232, MARGIN = 24, LAB_R = 14;
const N = v => Math.round(v * 10) / 10;

function segDist(px, py, a, b) {
  const dx = b.x - a.x, dy = b.y - a.y, L2 = dx * dx + dy * dy;
  let t = L2 ? ((px - a.x) * dx + (py - a.y) * dy) / L2 : 0;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (a.x + t * dx), py - (a.y + t * dy));
}

export function sketchSvg(spec) {
  const names = Object.keys(spec.pts);
  const xs = names.map(k => spec.pts[k].x), ys = names.map(k => spec.pts[k].y);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const s = Math.min((W - 2 * MARGIN) / (x1 - x0 || 1), (H - 2 * MARGIN) / (y1 - y0 || 1));
  const ox = (W - s * (x1 - x0)) / 2, oy = (H - s * (y1 - y0)) / 2;
  const P = {};
  names.forEach(k => { P[k] = { x: ox + (spec.pts[k].x - x0) * s, y: oy + (spec.pts[k].y - y0) * s }; });

  let out = "";
  (spec.tints || []).forEach((t, i) => {
    out += `<polygon class="ewe-tint ewe-tint-${i + 1}" points="${t.map(k => `${N(P[k].x)},${N(P[k].y)}`).join(" ")}"/>`;
  });
  const segs = spec.lines.map(([a, b]) => [P[a], P[b]]);
  segs.forEach(([a, b]) => { out += `<line class="ln" x1="${N(a.x)}" y1="${N(a.y)}" x2="${N(b.x)}" y2="${N(b.y)}"/>`; });

  /* ∥ chevrons, one per ∥ line, same look as engine.js's "p1" mark */
  const marks = [];
  (spec.par || []).forEach(([a, b]) => {
    const A = P[a], B = P[b];
    const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
    const L = Math.hypot(B.x - A.x, B.y - A.y) || 1;
    const ux = (B.x - A.x) / L, uy = (B.y - A.y) / L, nx = -uy, ny = ux, w = 5, h = 5;
    out += `<path class="mk ewe-par" fill="none" d="M ${N(mx - ux * w + nx * h)} ${N(my - uy * w + ny * h)} L ${N(mx + ux * w * 0.4)} ${N(my + uy * w * 0.4)} L ${N(mx - ux * w - nx * h)} ${N(my - uy * w - ny * h)}"/>`;
    marks.push({ x: mx, y: my });
  });

  /* ew3: the dotted ⊥h and its right-angle box. Both join the obstacles the
     labels keep away from. */
  let hSeg = null;
  if (spec.height) {
    const A = P[spec.height.from];
    const F = { x: ox + (spec.height.foot.x - x0) * s, y: oy + (spec.height.foot.y - y0) * s };
    const L = Math.hypot(A.x - F.x, A.y - F.y) || 1;
    const ux = (A.x - F.x) / L, uy = (A.y - F.y) / L, vx = spec.height.dir.x, vy = spec.height.dir.y, b = 8;
    out += `<line class="ln ewe-h" x1="${N(A.x)}" y1="${N(A.y)}" x2="${N(F.x)}" y2="${N(F.y)}"/>`;
    out += `<path class="mk ewe-ra" d="M ${N(F.x + vx * b)} ${N(F.y + vy * b)} L ${N(F.x + vx * b + ux * b)} ${N(F.y + vy * b + uy * b)} L ${N(F.x + ux * b)} ${N(F.y + uy * b)}"/>`;
    hSeg = [A, F];
    marks.push({ x: F.x + (vx + ux) * b / 2, y: F.y + (vy + uy) * b / 2 });
  }
  const obst = hSeg ? segs.concat([hSeg]) : segs;

  /* labels: for each point try 36 directions and keep the one whose label
     centre is farthest from every line, chevron, placed label and edge */
  const cx = xs.length ? names.reduce((a, k) => a + P[k].x, 0) / names.length : W / 2;
  const cy = names.reduce((a, k) => a + P[k].y, 0) / names.length;
  const placed = [];
  const labels = [];
  names.forEach(k => {
    const p = P[k];
    let best = null, bestScore = -Infinity;
    const out0 = Math.atan2(p.y - cy, p.x - cx);
    for (let i = 0; i < 36; i++) {
      const ang = i * Math.PI / 18;
      const lx = p.x + LAB_R * Math.cos(ang), ly = p.y + LAB_R * Math.sin(ang);
      let score = Infinity;
      obst.forEach(([a, b]) => { score = Math.min(score, segDist(lx, ly, a, b)); });
      marks.forEach(m => { score = Math.min(score, Math.hypot(lx - m.x, ly - m.y) - 4); });
      placed.forEach(q => { score = Math.min(score, Math.hypot(lx - q.x, ly - q.y) - 8); });
      score = Math.min(score, lx - 7, W - 7 - lx, ly - 8, H - 8 - ly);
      /* a small pull towards "outside the figure", only to break ties */
      score += 0.6 * Math.cos(ang - out0);
      if (score > bestScore) { bestScore = score; best = { x: lx, y: ly }; }
    }
    placed.push(best);
    labels.push({ k, ...best });
  });

  /* ew3: the "⊥h" label beside the dotted height. It is two glyphs wide, so
     its score is taken at its centre AND at both ends; it tries both sides
     of the height at a few heights and keeps the clearest spot. */
  if (hSeg) {
    const [A, F] = hSeg;
    const L = Math.hypot(A.x - F.x, A.y - F.y) || 1, nx = -(A.y - F.y) / L, ny = (A.x - F.x) / L;
    let best = null, bestScore = -Infinity;
    for (const t of [0.35, 0.42, 0.5, 0.58, 0.65]) for (const side of [1, -1]) for (const off of [15, 18, 21]) {
      const lx = F.x + t * (A.x - F.x) + side * off * nx, ly = F.y + t * (A.y - F.y) + side * off * ny;
      let score = Infinity;
      for (const dx of [-8, 0, 8]) {
        const px = lx + dx;
        obst.forEach(([a, b]) => { score = Math.min(score, segDist(px, ly, a, b)); });
        marks.forEach(m => { score = Math.min(score, Math.hypot(px - m.x, ly - m.y) - 4); });
        placed.forEach(q => { score = Math.min(score, Math.hypot(px - q.x, ly - q.y) - 8); });
        score = Math.min(score, px - 7, W - 7 - px, ly - 8, H - 8 - ly);
      }
      score -= 0.02 * off;                       // close to its line, all else equal
      if (score > bestScore) { bestScore = score; best = { x: lx, y: ly }; }
    }
    labels.push({ k: "⊥h", ...best, cls: "pl ewe-hl" });
  }

  names.forEach(k => { out += `<circle cx="${N(P[k].x)}" cy="${N(P[k].y)}" r="2.6" fill="#2b2f4a"/>`; });
  labels.forEach(l => { out += `<text class="${l.cls || "pl"}" x="${N(l.x)}" y="${N(l.y)}">${esc(l.k)}</text>`; });
  return `<svg class="diag ewe-sketch" viewBox="0 0 ${W} ${H}" role="img" preserveAspectRatio="xMidYMid meet">${out}</svg>`;
}
