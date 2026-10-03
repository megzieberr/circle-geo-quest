/* ============================================================
   EWEREDIGHEID KIT  (the shared DOM pieces for rounds ew1 to ew5 and ew7)
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
       triangles and a dotted ⊥h with its right-angle box; ew4, opt-in: the
       arc of a shared angle and her star beside it; ew7, opt-in: right-angle
       boxes at named corners, labels kept outside a named Δ), drawn with the same
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
/* the letter and its 2 travel in ONE span: inside a flex row (an equation's
   unit is inline-flex) a bare <sup> would become its own flex item and be
   centred on the line, not raised (measured by tools/ewe-phone-check.py) */
export function sqHtml(x) { return `<span class="ewf-sqw">${x}<sup class="ewf-sq">2</sup></span>`; }
/* ew7, opt-in by content: a "²" in a plain sentence (an intro, a hint, a
   tip) becomes the SAME raised 2 as sqHtml draws, so a square reads one way
   on the whole screen. Escaped HTML in, HTML out. Text without a "²" (every
   string of ew1 to ew5) comes back unchanged. */
export function sqText(html) { return String(html).replace(/²/g, '<sup class="ewf-sq">2</sup>'); }

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
/* ew4: her area chain for a SHARED ANGLE, as on her p.44 (rule 15), with
   the reason next to it:
     Opp Δ ADE     ½ · AD · AE · sin Â     AD · AE
     --------- = ------------------- = -------     (gemene hoekpunt)
     Opp Δ ABC     ½ · AB · AC · sin Â     AB · AC
   The sibling of areaLineHtml, built from the SAME pieces: fracHtml (the one
   drawer), prodHtml (rule 7: each product sits INSIDE its numerator or
   denominator), the ½ and the sine struck through by a span inside the
   drawer, chainHtml (breaks only before an "="), the reason moving down
   whole. Each "Opp Δ" carries its triangle's own tint, as in the sketch.
   sine = { tris: ["ADE", "ABC"], tints: [1, 2], top: ["AD", "AE"],
            bot: ["AB", "AC"], sin: "sin Â" } */
export function sineLineHtml(sine, reason) {
  const [t1, t2] = sine.tris.map(esc), [k1, k2] = sine.tints || [1, 2];
  const top = sine.top.map(esc), bot = sine.bot.map(esc), sn = esc(sine.sin);
  const x = v => `<span class="ewf-x">${v}</span>`;
  /* the sine carries a hat (sin Â): .ewf-hat gives a denominator that holds
     one a little room under the bar, so the hat never touches it */
  const xs = `<span class="ewf-x ewf-hat">${sn}</span>`;
  const chain = chainHtml([
    fracHtml(tintHtml(`Opp Δ ${t1}`, k1), tintHtml(`Opp Δ ${t2}`, k2)), "=",
    fracHtml([x("½"), ...top, xs], [x("½"), ...bot, xs]), "=",
    fracHtml(top, bot),
  ]);
  return `<div class="ewl ewl-sine">${chain}`
       + (reason ? `<span class="ewl-rs">(${esc(reason)})</span>` : "") + `</div>`;
}
/* ew7: the rewrite of a product line, as she writes it under the exam's
   "Bewys dat …", three lines under each other, left-aligned:
     AD² = BD · DC
     AD · AD = BD · DC
     AD     DC
     --  =  --
     BD     AD
   The given line with sqHtml (rule 6, a real raised 2) and prodHtml, the
   square written out, then the two stacked fractions through fracHtml and
   eqHtml: the fill the learner built, not a fixed one. A line with no
   square has two lines (the given product line, the fractions). No reason:
   a rewrite has none. Each line is one eqHtml, so a line too wide for the
   phone breaks only before its "=".
   cross = { pairs: [["AD", "AD"], ["BD", "DC"]], fill: ["AD", "BD", "DC", "AD"] } */
export function crossLineHtml(cross) {
  const [[l1, l2], [r1, r2]] = cross.pairs.map(p => p.map(esc));
  const sq = l1 === l2;
  const given = eqHtml(sq ? sqHtml(l1) : prodHtml([l1, l2]), prodHtml([r1, r2]));
  const lines = [given];
  if (sq) lines.push(eqHtml(prodHtml([l1, l2]), prodHtml([r1, r2])));
  lines.push(ratioHtml(cross.fill));
  return `<div class="ewl ewl-cross">${lines.map(l => `<div class="ewl-cross-ln">${l}</div>`).join("")}</div>`;
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
   in a triangle's tint, e.g. { t: "Opp Δ ABC", tint: 1 }, or (ew4, opt-in)
   { t: "sin Â", hat: true } for a word with an angle hat (room under the
   bar, see .ewf-hat) */
function fxCell(c) {
  if (c && typeof c === "object" && c.hat) return `<span class="ewpad-fx ewf-hat">${esc(c.t)}</span>`;
  if (c && typeof c === "object") return `<span class="ewpad-fx ewtint ewtint-${c.tint}">${esc(c.t)}</span>`;
  return `<span class="ewpad-fx">${esc(c)}</span>`;
}
function frameUnits(frame, cell) {
  return frame.map(u => (u === "=" ? "=" : Array.isArray(u) ? `<span class="ewpad-run">${u.map(cell).join("")}</span>`
                                                            : fracHtml(u.n.map(cell).join(""), u.d.map(cell).join(""))));
}

/* ew5, opt-in: ONE stacked fraction drawn from frame cells (text, ½, a
   hatted { t, hat } or a tinted { t, tint }), no boxes: a pick option that
   IS a first line, and the lead line above the options. The same cell
   renderer and the same drawer as every frame, so a hat and the ½ get the
   same room as in the pad. */
export function cellFracHtml(f) {
  return fracHtml(f.n.map(fxCell).join(""), f.d.map(fxCell).join(""));
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
             the point labels
   ew4, OPT-IN (left out, nothing changes):
     tints   an entry may also be { pts: ["A","B","C"], tint: 2 }: the tint
             is then named, not taken from the entry's place, so the whole
             Δ can be drawn first in tint 2 and the cut-off Δ on top in tint 1
     angle   { at: "A", rays: ["B","C"], star: false }   a small arc inside
             the shared angle at `at`, between the rays to rays[0] and
             rays[1]; with star: true, her coloured star just OUTSIDE the
             corner (her sterretjie for "gemeen"). The star's spot is kept
             clear of every label even while the star is hidden, so nothing
             moves when it appears.
     labBox  true: each point label keeps its BOX clear of its own dot on
             every slant (boxRadius below), not just its centre 14 away
   ew7, OPT-IN (left out, nothing changes):
     right   [{ at: "A", arms: ["B", "C"] }, …]   a right-angle box at `at`,
             a small square inside the angle, its two sides laid along the
             two arms (computed from the arms, never drawn by eye). Its
             corners join the obstacles the labels keep away from
     outside ["A", "B", "C"]   no point label may sit inside this Δ (the
             tint rule of ew3, for a figure without tints) */
const W = 320, H = 232, MARGIN = 24, LAB_R = 14;
const ARC_R = 17, STAR_D = 15, STAR_R = 5.5, RA_B = 9;
const N = v => Math.round(v * 10) / 10;

/* ew4, opt-in (spec.labBox): how far a label sits from its own point,
   following the label's BOX instead of a circle. A letter is taller than
   it is wide, so on a slant a 14-unit circle let the corner of the label's
   box reach its own dot. Here the box (half-width, room above and below its
   centre) plus the dot plus a small gap must clear the point along the
   chosen direction; never closer than the old 14. */
const BOX_HW = 5.5 + 2.6 + 2, BOX_UP = 10 + 2.6 + 2, BOX_DN = 8 + 2.6 + 2;
function boxRadius(c, s) {
  let t = Infinity;
  if (Math.abs(c) > 1e-6) t = Math.min(t, BOX_HW / Math.abs(c));
  if (s > 1e-6) t = Math.min(t, BOX_UP / s);        // label below the point (y down): its top clears the dot
  if (s < -1e-6) t = Math.min(t, BOX_DN / -s);      // label above the point: its bottom clears the dot
  return Math.max(LAB_R, t);
}

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
  /* a tint entry: ["A","B","C"] takes its tint from its place (ew3), or
     (ew4, opt-in) { pts, tint } names it */
  const tintPts = t => (Array.isArray(t) ? t : t.pts);
  (spec.tints || []).forEach((t, i) => {
    const k = Array.isArray(t) ? i + 1 : t.tint;
    out += `<polygon class="ewe-tint ewe-tint-${k}" points="${tintPts(t).map(k => `${N(P[k].x)},${N(P[k].y)}`).join(" ")}"/>`;
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

  /* ew4: the shared angle. The arc runs inside the angle (the smaller turn
     from one ray to the other); the star sits on the line that halves the
     angle, on the far side of the corner, so it is clear of both rays. Both
     join the obstacles the labels keep away from, as round discs: the arc
     as a string of points along it, the star as one disc, ALWAYS (drawn or
     not), so the labels do not jump when the star appears. */
  const discs = [];
  if (spec.angle) {
    const V = P[spec.angle.at];
    const unit = k => { const dx = P[k].x - V.x, dy = P[k].y - V.y, L = Math.hypot(dx, dy) || 1; return { x: dx / L, y: dy / L }; };
    const u1 = unit(spec.angle.rays[0]), u2 = unit(spec.angle.rays[1]);
    const a1 = Math.atan2(u1.y, u1.x);
    let da = Math.atan2(u2.y, u2.x) - a1;
    while (da > Math.PI) da -= 2 * Math.PI;
    while (da < -Math.PI) da += 2 * Math.PI;
    out += `<path class="mk ewe-arc" d="M ${N(V.x + ARC_R * u1.x)} ${N(V.y + ARC_R * u1.y)} A ${ARC_R} ${ARC_R} 0 0 ${da > 0 ? 1 : 0} ${N(V.x + ARC_R * u2.x)} ${N(V.y + ARC_R * u2.y)}"/>`;
    for (let i = 0; i <= 10; i++) { const a = a1 + da * i / 10; discs.push({ x: V.x + ARC_R * Math.cos(a), y: V.y + ARC_R * Math.sin(a), r: 1.5 }); }
    let bx = -(u1.x + u2.x), by = -(u1.y + u2.y);
    const bl = Math.hypot(bx, by) || 1;
    bx /= bl; by /= bl;
    const sx = V.x + STAR_D * bx, sy = V.y + STAR_D * by;
    discs.push({ x: sx, y: sy, r: STAR_R + 1 });
    if (spec.angle.star) {
      const pts = [];
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? STAR_R * 0.45 : STAR_R;
        pts.push(`${N(sx + rr * Math.cos(a))},${N(sy + rr * Math.sin(a))}`);
      }
      out += `<polygon class="ewe-star" points="${pts.join(" ")}"/>`;
    }
  }

  /* ew7: a right-angle box at each named corner, inside the angle, its two
     sides along the two arms. Its corners, the middles of its sides and its
     centre join the discs the labels keep away from. */
  (spec.right || []).forEach(({ at, arms }) => {
    const V = P[at];
    const unit = k => { const dx = P[k].x - V.x, dy = P[k].y - V.y, L = Math.hypot(dx, dy) || 1; return { x: dx / L, y: dy / L }; };
    const u = unit(arms[0]), w = unit(arms[1]), b = RA_B;
    const p1 = { x: V.x + u.x * b, y: V.y + u.y * b }, p3 = { x: V.x + w.x * b, y: V.y + w.y * b };
    const p2 = { x: p1.x + w.x * b, y: p1.y + w.y * b };
    out += `<path class="mk ewe-rt" d="M ${N(p1.x)} ${N(p1.y)} L ${N(p2.x)} ${N(p2.y)} L ${N(p3.x)} ${N(p3.y)}"/>`;
    [p1, p2, p3, { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }, { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 }]
      .forEach(q => discs.push({ x: q.x, y: q.y, r: 1.5 }));
    discs.push({ x: (V.x + p2.x) / 2, y: (V.y + p2.y) / 2, r: b / 2 });
  });

  /* labels: for each point try 36 directions and keep the one whose label
     centre is farthest from every line, chevron, placed label and edge */
  const cx = xs.length ? names.reduce((a, k) => a + P[k].x, 0) / names.length : W / 2;
  const cy = names.reduce((a, k) => a + P[k].y, 0) / names.length;
  /* ew3, HER RULING 2026-10-02 (Q3: S and T had drifted above the base line,
     into the yellow Δ): a point label never sits INSIDE a tinted triangle.
     Only sketches with tints carry the rule, so ew1 and ew2 keep the layouts
     she approved. */
  const tintPolys = (spec.tints || []).map(t => tintPts(t).map(k => P[k]));
  /* ew7, opt-in: the same rule for a Δ without a tint (spec.outside) */
  if (spec.outside) tintPolys.push(spec.outside.map(k => P[k]));
  const inTri = (x, y, [a, b, c]) => {
    const s1 = (b.x - a.x) * (y - a.y) - (b.y - a.y) * (x - a.x);
    const s2 = (c.x - b.x) * (y - b.y) - (c.y - b.y) * (x - b.x);
    const s3 = (a.x - c.x) * (y - c.y) - (a.y - c.y) * (x - c.x);
    return (s1 >= 0 && s2 >= 0 && s3 >= 0) || (s1 <= 0 && s2 <= 0 && s3 <= 0);
  };
  const placed = [];
  const labels = [];
  names.forEach(k => {
    const p = P[k];
    let best = null, bestScore = -Infinity;
    const out0 = Math.atan2(p.y - cy, p.x - cx);
    for (let i = 0; i < 36; i++) {
      const ang = i * Math.PI / 18;
      const r = spec.labBox ? boxRadius(Math.cos(ang), Math.sin(ang)) : LAB_R;
      const lx = p.x + r * Math.cos(ang), ly = p.y + r * Math.sin(ang);
      let score = Infinity;
      obst.forEach(([a, b]) => { score = Math.min(score, segDist(lx, ly, a, b)); });
      marks.forEach(m => { score = Math.min(score, Math.hypot(lx - m.x, ly - m.y) - 4); });
      discs.forEach(m => { score = Math.min(score, Math.hypot(lx - m.x, ly - m.y) - m.r); });
      placed.forEach(q => { score = Math.min(score, Math.hypot(lx - q.x, ly - q.y) - 8); });
      score = Math.min(score, lx - 7, W - 7 - lx, ly - 8, H - 8 - ly);
      /* inside a tinted Δ is never allowed (see tintPolys above) */
      if (tintPolys.some(t => inTri(lx, ly, t))) score -= 1000;
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
