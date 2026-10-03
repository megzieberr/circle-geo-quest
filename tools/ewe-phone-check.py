"""Eweredigheid round ew1 at phone width: the fraction proof, the
overflow proof, the label-collision proof, the visibility proof, and the
screenshots for the foreman.

What it does (all against a LOCAL copy, never the live class):
  * serves this repo with its own serve.py on a free port;
  * EVERY page load carries ?local=1 (the offline demo backend), and as a
    second guard every request to any host other than this machine and
    Google Fonts is BLOCKED and counted. The live database is never called;
  * logs in the demo Gr12 / Gr11 learners of the local backend by writing
    a throwaway test password into the local store (no real account);
  * walks every step of every ew1 question at 375 px wide: boxes empty,
    boxes full, a wrong answer with its hint, the right answer, every
    "Só skryf jy dit" card and the end screen. At each state it waits for
    document.fonts.ready and then MEASURES every rendered fraction:
    numerator above the bar, denominator below, bar at least as wide as
    both, the whole fraction on screen; plus zero horizontal overflow and
    no slash fractions anywhere a learner can read;
  * measures every sketch: no label touching a line, a ∥ arrow, a dot or
    another label;
  * proves who can see the group (released 2026-10-03, eweLive true):
    Gr12 without ?ewe=1 sees the card and EXACTLY the five released rounds,
    no "Die trapesium" (ew6) and no "Vreemde formaat" (ew7), both held back
    by CONFIG.eweHeld, a guessed ew6 or ew7 link lands on the map, and ew5's
    end screen offers no next round; Gr12 with ?ewe=1 sees seven (ew6 sixth,
    ew7 seventh, both locked); Gr11 sees nothing, with or without ?ewe=1
    and with or without class=gr12 in the link; teacher preview sees the
    card, five rounds without the flag and seven with it;
  * saves 375 px PNGs to tools/_out/ewe/ (git-ignored) for the foreman.
    This script never opens them.
  * ew2 ("Nou met die ∥ lyne"): after ew1 is passed, the end screen's way
    on must lead to ew2 and the map must unlock it (it is locked before).
    Then the same walk, every step of every ew2 question: the given chip in
    the first box (it stays, it cannot be deleted, the glow starts on the
    first EMPTY box), a bottom-piece answer with its hint, the right
    answer, the half-built question's stacked-fraction options, every
    two-line card, the end screen. Its PNGs start with "ew2-".
  * ew3 ("Deel 'n sy"): it is locked on the map until ew2 is passed; then
    ew2's end screen leads on to it and the map unlocks it. The walk: every
    step of every ew3 question, boxes empty, the wrong fills with their
    hints (the swapped order, the shared side, a struck-through ½ or ⊥h),
    the right fill, every three-fraction card (no break inside a fraction,
    the chain breaking only before an "=", the reason moved down whole, the
    ½ and ⊥h struck INSIDE the one drawer), Q5's Nee, the end screen; the
    two tints and the dotted ⊥h with its right-angle box in every sketch.
    Its PNGs start with "ew3-".
  * ew4 ("Deel 'n hoek"): locked on the map until ew3 is passed; then
    ew3's end screen leads on to it and the map unlocks it. The walk: every
    step of every ew4 question. Step 1 (which angle is shared?) before and
    after the right pick: her star absent, then present, and no label moves
    when it appears. The build steps: boxes empty, the wrong fills with
    their hints (a third side, the swapped products, a mixed product, the
    same chip twice, a struck ½ or sine), the right fill. Every card (the
    chain measured: no break inside a fraction, the products INSIDE the
    numerator and the denominator, the ½ and the sine struck inside the one
    drawer, the reason moved down whole). Q5's Nee, the end screen. In
    every sketch the two tints (matched to the coloured "Opp Δ" words), the
    arc, and the labels clear of lines, dots, the arc, the star and each
    other. Every angle hat (Â, B̂ …) MEASURED: its ink top below the top
    edge of its chip, box or option, and below the bar of a fraction. Its
    PNGs start with "ew4-".
  * the phone folds (her ruling 2026-10-02), at 375 x 667, every question
    of ew1 to ew4: the intro is full before step 1, ONE line high with its
    chevron once step 1 is right, a tap (and Enter) opens it to its full
    height and folds it again; a one-step question never folds. A pick
    step shows every option before the right answer (a wrong tap stays
    red), and exactly one, the correct one, with its green line after it.
    Every BUILD step brought in by the auto-scroll: the sketch's bottom
    edge and every box of its frame inside the screen, below the top bar;
    per build step the distance from the sketch's bottom edge to the
    bottom of Kontroleer is REPORTED (a number, not a pass/fail). Plus one
    reduced-motion run: the scroll is a jump, not a glide. Viewport PNGs
    start with "fold-".
  * Fold 3 (foreman ruling 2026-10-02): after EVERY build step of ew1 to
    ew4 is answered right (and after each "show me"), its boxes and
    Kontroleer are hidden and its prompt and line are on screen. The fold
    walk and the reduced-motion run first close the pop-ups a fresh login
    opens on home (the install sheet, the Weekend Rally modal) with their
    own ✕, and every fold measurement checks that no pop-up is open, the
    page is not scroll-locked, and a finger on the sketch's bottom edge or
    on a box touches it, not a sheet. Viewport PNGs start with "fold3-".
  * ew5 ("Watter een is dit?"): locked on the map until ew4 is passed; then
    ew4's end screen leads on to it and the map unlocks it. No pad: two
    picks per question. No spoilers (foreman review 2026-10-02): before
    step 1 the sketch is BARE (no ⊥h, no box, no arc, no star), also after
    a wrong tool; after the right tool it has exactly its kind's mark (the
    dotted ⊥h with its box and label, or the arc with her star), to the end
    of the question; labels measured clear in both states. Step 1, the two
    tools side by side in their natural order, each name with its formula
    on a smaller line (one line, inside its button, not clipped), the wrong
    tool with its hint, the right one, its ✓ line on two lines, Fold 2.
    Step 2, the lead line (the tinted "Opp Δ" fraction, "=", one glowing
    box, at most 64 px high), the prompt "Wat bly oor nadat jy doodgetrek
    het?" and the four leftovers in a 2 x 2 grid (her ruling 2026-10-02:
    base over base or product over product, no ½, no ⊥h, no sin; options,
    hints and ✓ line checked against the ruling's wording built from the
    sketch's letters), each ONE stacked fraction inside its button's
    padding (measured like every fraction, no hats left), every wrong
    option with its hint, the right one filling the lead line. Every card (the ew3 or ew4 chain and
    its reason), the end screen. In the 375 x 667 fold walk: Q1's step 1
    options on screen before any scroll, and at step 2 at least 150 px of
    the sketch on screen with all four options, as the auto-scroll leaves
    it; it REPORTS the px per pick step. PNGs start "ew5-".
  * ew6 ("Die trapesium"): locked on the map until ew5 is passed; then
    ew5's end screen leads on to it and the map unlocks it, ew7 still
    locked. The walk: every step of every question. Every sketch state (the
    start, after step 1 when the whole-side arc appears, after step 3 when
    the tints appear): her side arcs and their labels (green pieces, the
    blue whole side, "k" for one part), every label clear of the arcs, the
    lines, the dots and each other, every label outside the whole Δ, no
    point label moving when the sketch changes; the tints after step 3 as
    the trapezium (four corners) and the small Δ. Every build step: the
    boxes, the chip bank, a wrong fill for EVERY reason the marker can give
    (found by asking the marker) with its own hint, the right fill, its ✓
    line and takeaway (step 1's with its stacked fractions), Fold 3. The
    given lines (above step 2's frame; above step 3 on Q3 and Q6) as
    stacked fractions. The pick step: four options, each wrong one with
    its hint, Fold 2. Every card (the 3/5 line and ew4's chain on a full
    question, part (c) with its three "=" under each other, the ∴ line,
    left-aligned, inside 375 px), the end screen, the saving. In the
    375 x 667 fold walk it REPORTS per build step the px of the sketch on
    screen as the auto-scroll leaves it. PNGs start "ew6-" and "fold-ew6-".
  * ew7 ("Vreemde formaat"): locked on the map until ew6 is passed; then
    ew6's end screen leads on to it and the map unlocks it (its blurb's
    AD² drawn with the raised 2). The walk: every question's bare exam
    figure (two right-angle boxes, square and at 90°, at the right angle
    and at the foot; every label outside the Δ and clear of lines, dots,
    boxes and each other); the intro's line with its raised 2; every build
    step (☐ · ☐ = ☐ · ☐ and ☐/☐ = ☐/☐): the bank (the line's letters and
    ONE decoy), boxes empty, every wrong reason with its own hint (the
    pattern hints with their templates in words), the right fill, its ✓
    line and takeaway, Fold 3; every card (two or three lines, left-aligned,
    the given line's 2 raised, the learner's own fractions, no reason, the
    tip); the end screen. Every raised 2 on screen MEASURED: above the
    middle of its letter, inside the screen, and no plain "²" left. In the
    375 x 667 fold walk it REPORTS, per build step, the px of the sketch on
    screen as the auto-scroll leaves it, and the most there can be with the
    frame AND the whole chip bank (Kontroleer too) on screen. PNGs start
    "ew7-".

Run:  python tools/ewe-phone-check.py        (exit 1 on any failure)
Needs Python Playwright with its own bundled Chromium; downloads nothing.
"""
import json, os, secrets, socket, subprocess, sys, time
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "tools", "_out", "ewe")
os.makedirs(OUT, exist_ok=True)
ALLOWED_HOSTS = {"localhost", "127.0.0.1", "fonts.googleapis.com", "fonts.gstatic.com"}

def free_port():
    s = socket.socket(); s.bind(("127.0.0.1", 0)); p = s.getsockname()[1]; s.close(); return p

PORT = free_port()
# 127.0.0.1, not "localhost": serve.py listens on IPv4 only, and on this machine
# every "localhost" connection first waits about a second on IPv6, which made
# each page load take ~7 s and some logins time out (2026-10-02). Same server,
# same checks.
BASE = f"http://127.0.0.1:{PORT}/index.html"
server = subprocess.Popen([sys.executable, "serve.py", str(PORT)], cwd=ROOT,
                          stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

failures = []
blocked = []
console_errors = []
fraction_rows = []      # one row per measured screen state
label_rows = []
ew7_angles = []     # ew7: the right angle at each sketch, measured on screen
ew7_tpls = []       # ew7: the cross steps' pattern templates, measured

def fail(msg):
    failures.append(msg); print("  FAIL", msg)

def url(**q):
    q = {"local": "1", **q}         # ?local=1 ALWAYS, and first
    assert q["local"] == "1"
    return BASE + "?" + "&".join(f"{k}={v}" for k, v in q.items())

MEASURE_JS = r"""
async (scopeSel) => {
  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 30));
  const vw = document.documentElement.clientWidth;
  const out = { vw, overflowX: Math.max(0, document.documentElement.scrollWidth - vw), fracs: 0, hidden: 0, bad: [], slash: [], offscreen: [] };
  for (const f of document.querySelectorAll('.ewf')) {
    const r = f.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) { out.hidden++; continue; }
    out.fracs++;
    const n = f.querySelector(':scope > .ewf-n').getBoundingClientRect();
    const b = f.querySelector(':scope > .ewf-bar').getBoundingClientRect();
    const d = f.querySelector(':scope > .ewf-d').getBoundingClientRect();
    const where = (f.closest('.ewpad-disp') ? 'box' : f.closest('.ewe-write') ? 'card' : f.closest('.dp-hint') ? 'hint' : f.closest('.dp-feedback') ? 'feedback' : 'other');
    const problems = [];
    if (!(n.bottom <= b.top + 0.5)) problems.push('numerator not above bar');
    if (!(d.top >= b.bottom - 0.5)) problems.push('denominator not below bar');
    if (!(b.width + 0.5 >= n.width)) problems.push(`bar ${b.width.toFixed(1)} < numerator ${n.width.toFixed(1)}`);
    if (!(b.width + 0.5 >= d.width)) problems.push(`bar ${b.width.toFixed(1)} < denominator ${d.width.toFixed(1)}`);
    if (!(b.height >= 1.5)) problems.push('bar invisible');
    if (!(r.left >= -0.5 && r.right <= vw + 0.5)) problems.push(`off screen ${r.left.toFixed(1)}..${r.right.toFixed(1)}`);
    if (n.height > 2.2 * parseFloat(getComputedStyle(f).fontSize)) problems.push('numerator wrapped');
    if (d.height > 2.2 * parseFloat(getComputedStyle(f).fontSize)) problems.push('denominator wrapped');
    if (f.querySelector('.ewf')) problems.push('fraction inside a fraction');
    if (problems.length) out.bad.push({ where, text: f.textContent, problems });
    out.kinds = out.kinds || {}; out.kinds[where] = (out.kinds[where] || 0) + 1;
  }
  /* the slash scan covers THIS feature's own screens only (the rest of the
     app has "0 / 43 rounds done" counters that are not fractions) */
  const scope = document.querySelector(scopeSel) || document.querySelector('.view');
  const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
  for (let t; (t = walker.nextNode());) {
    if (t.parentElement.closest('.play-count')) continue;         // "1 / 6" is a counter, not a fraction
    if (/[A-Za-z0-9☐]\s*\/\s*[A-Za-z0-9☐]/.test(t.textContent)) out.slash.push(t.textContent.trim().slice(0, 60));
  }
  for (const e of document.querySelector('.view').querySelectorAll('*')) {
    const r = e.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (e.closest('svg')) continue;
    if (r.right > vw + 0.5 || r.left < -0.5) out.offscreen.push(`${e.tagName.toLowerCase()}.${e.className} ${r.left.toFixed(0)}..${r.right.toFixed(0)}`);
  }
  out.offscreen = out.offscreen.slice(0, 5);
  return out;
}
"""

LABELS_JS = r"""
() => {
  const svg = document.querySelector('svg.ewe-sketch');
  if (!svg) return null;
  const R = el => { const b = el.getBBox(); return { x0: b.x, y0: b.y, x1: b.x + b.width, y1: b.y + b.height }; };
  const hit = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
  const segHitsRect = (x1, y1, x2, y2, r) => {
    for (let i = 0; i <= 200; i++) {
      const t = i / 200, x = x1 + t * (x2 - x1), y = y1 + t * (y2 - y1);
      if (x > r.x0 && x < r.x1 && y > r.y0 && y < r.y1) return true;
    }
    return false;
  };
  const texts = [...svg.querySelectorAll('text.pl')];
  const lines = [...svg.querySelectorAll('line.ln')].map(l => ['x1','y1','x2','y2'].map(k => +l.getAttribute(k)));
  const marks = [...svg.querySelectorAll('path.ewe-par, path.ewe-ra, path.ewe-rt')].map(R);
  const dots = [...svg.querySelectorAll('circle')].map(c => { const x = +c.getAttribute('cx'), y = +c.getAttribute('cy'), r = +c.getAttribute('r'); return { x0: x - r, y0: y - r, x1: x + r, y1: y + r }; });
  /* ew4: her star (a box) and the arc (sampled along its length: its box
     would be far bigger than the stroke) */
  const stars = [...svg.querySelectorAll('polygon.ewe-star')].map(R);
  const arcPts = [...svg.querySelectorAll('path.ewe-arc')].flatMap(p => { const L = p.getTotalLength(); return Array.from({ length: 61 }, (_, i) => p.getPointAtLength(L * i / 60)); });
  /* her ruling 2026-10-02: a point label never sits inside a tinted Δ */
  const tris = [...svg.querySelectorAll('polygon.ewe-tint')].map(p => p.getAttribute('points').split(' ').map(s => s.split(',').map(Number)));
  const inTri = (x, y, [a, b, c]) => {
    const s1 = (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]);
    const s2 = (c[0] - b[0]) * (y - b[1]) - (c[1] - b[1]) * (x - b[0]);
    const s3 = (a[0] - c[0]) * (y - c[1]) - (a[1] - c[1]) * (x - c[0]);
    return (s1 > 0 && s2 > 0 && s3 > 0) || (s1 < 0 && s2 < 0 && s3 < 0); };
  const vb = svg.viewBox.baseVal;
  const res = { labels: texts.length, lines: lines.length, arrows: svg.querySelectorAll('path.ewe-par').length, collisions: [],
                tints: svg.querySelectorAll('polygon.ewe-tint').length, heights: svg.querySelectorAll('line.ewe-h').length,
                dotted: [...svg.querySelectorAll('line.ewe-h')].every(l => getComputedStyle(l).strokeDasharray !== 'none'),
                boxes: svg.querySelectorAll('path.ewe-ra').length, hlabel: [...texts].filter(t => t.textContent === '⊥h').length,
                arcs: svg.querySelectorAll('path.ewe-arc').length, stars: stars.length, rboxes: svg.querySelectorAll('path.ewe-rt').length,
                at: texts.map(t => { const b = R(t); return [t.textContent, Math.round(b.x0 * 10) / 10, Math.round(b.y0 * 10) / 10]; }) };
  texts.forEach((t, i) => {
    const r = R(t);
    lines.forEach(l => { if (segHitsRect(...l, r)) res.collisions.push(`${t.textContent} touches a line`); });
    marks.forEach(m => { if (hit(r, m)) res.collisions.push(`${t.textContent} touches a ∥ arrow or the right-angle box`); });
    dots.forEach(d => { if (hit(r, d)) res.collisions.push(`${t.textContent} touches a dot`); });
    texts.forEach((u, j) => { if (j > i && hit(r, R(u))) res.collisions.push(`${t.textContent} touches ${u.textContent}`); });
    if (r.x0 < 0 || r.y0 < 0 || r.x1 > vb.width || r.y1 > vb.height) res.collisions.push(`${t.textContent} outside the sketch`);
    stars.forEach(m => { if (hit(r, m)) res.collisions.push(`${t.textContent} touches the star`); });
    if (arcPts.some(p => p.x > r.x0 && p.x < r.x1 && p.y > r.y0 && p.y < r.y1)) res.collisions.push(`${t.textContent} touches the arc`);
    if (t.textContent !== '⊥h' && tris.some(tr => inTri((r.x0 + r.x1) / 2, (r.y0 + r.y1) / 2, tr))) res.collisions.push(`${t.textContent} sits inside a tinted triangle`);
  });
  stars.forEach(s => {
    lines.forEach(l => { if (segHitsRect(...l, s)) res.collisions.push('the star touches a line'); });
    dots.forEach(d => { if (hit(s, d)) res.collisions.push('the star touches a dot'); });
    if (s.x0 < 0 || s.y0 < 0 || s.x1 > vb.width || s.y1 > vb.height) res.collisions.push('the star is outside the sketch');
  });
  return res;
}
"""

# ew4: every angle hat on screen (Â, Ĉ precomposed; B̂, K̂ with the combining
# hat U+0302), MEASURED. The ink top of the hatted letter comes from the
# canvas (same computed font, so the same fallback fonts as the page): the
# text's own box gives the baseline (box top + the font's ascent), minus
# the glyph's real ink ascent. It must sit below the inner top edge of its
# chip, box or option (inside the border), and below the bar when it is in
# a denominator. Code points, not escapes, so this file stays plain ASCII
# where it can.
HATS_JS = r"""
async () => {
  await document.fonts.ready;
  const PRE = new Set([0xC2, 0x108, 0xCA, 0x11C, 0x124, 0xCE, 0x134, 0xD4, 0x15C, 0xDB, 0x174, 0x176, 0x1E90].map(c => String.fromCharCode(c)));
  const COMB = String.fromCharCode(0x302);
  const cv = document.createElement('canvas').getContext('2d');
  const out = { hats: 0, clipped: [], minGap: null, where: {}, minBy: {} };
  const walker = document.createTreeWalker(document.querySelector('.view'), NodeFilter.SHOW_TEXT);
  for (let t; (t = walker.nextNode());) {
    const txt = t.textContent, el = t.parentElement;
    if (el.closest('svg')) continue;
    const spots = [];
    for (let i = 0; i < txt.length; i++) {
      if (PRE.has(txt[i])) spots.push([i, i + 1]);
      else if (txt[i + 1] === COMB) spots.push([i, i + 2]);
    }
    if (!spots.length) continue;
    const r0 = el.getBoundingClientRect();
    if (!r0.width && !r0.height) continue;                    // hidden
    const cs = getComputedStyle(el);
    cv.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const den = el.closest('.ewf-d');
    const box = el.closest('.ewchip, .ewslot, .ewe-opt, .opt, .ewpad-disp, .ewe-write, .dp-hint, .dp-feedback');
    let limit, kind;
    if (den) { limit = den.parentElement.querySelector(':scope > .ewf-bar').getBoundingClientRect().bottom; kind = 'under a fraction bar'; }
    else if (box) { const b = box.getBoundingClientRect(); limit = b.top + parseFloat(getComputedStyle(box).borderTopWidth);
      kind = box.matches('.ewchip') ? 'chip' : box.matches('.ewslot') ? 'box' : box.matches('.ewe-opt, .opt') ? 'option' : box.matches('.ewpad-disp') ? 'pad' : box.matches('.ewe-write') ? 'card' : 'hint/feedback'; }
    else { limit = el.getBoundingClientRect().top; kind = 'text'; }
    for (const [a, b] of spots) {
      const rg = document.createRange(); rg.setStart(t, a); rg.setEnd(t, b);
      const rr = rg.getBoundingClientRect();
      const m = cv.measureText(txt.slice(a, b));
      const inkTop = rr.top + m.fontBoundingBoxAscent - m.actualBoundingBoxAscent;
      const gap = inkTop - limit;
      out.hats++; out.where[kind] = (out.where[kind] || 0) + 1;
      out.minBy[kind] = Math.min(out.minBy[kind] ?? Infinity, Math.round(gap * 10) / 10);
      out.minGap = out.minGap == null ? gap : Math.min(out.minGap, gap);
      if (gap < 0) out.clipped.push(`${txt.slice(a, b)} in ${kind}: ink top ${inkTop.toFixed(1)}, edge ${limit.toFixed(1)}`);
    }
  }
  out.minGap = out.minGap == null ? null : Math.round(out.minGap * 10) / 10;
  return out;
}
"""

# ew4: the tints in the sketch, by the corners they cover, e.g. ["2:ABC", "1:ADE"].
# The i-th dot and the i-th point label belong to the same point (sketchSvg
# writes both in the same order), so a polygon's corners can be named.
TINTMAP_JS = r"""
() => {
  const svg = document.querySelector('svg.ewe-sketch');
  const dots = [...svg.querySelectorAll('circle')], labs = [...svg.querySelectorAll('text.pl')];
  const at = {}; dots.forEach((c, i) => { at[labs[i].textContent] = [+c.getAttribute('cx'), +c.getAttribute('cy')]; });
  return [...svg.querySelectorAll('polygon.ewe-tint')].map(p => {
    const k = p.getAttribute('class').match(/ewe-tint-(\d)/)[1];
    const pts = p.getAttribute('points').split(' ').map(s => s.split(',').map(Number));
    return k + ':' + pts.map(([x, y]) => Object.keys(at).find(n => Math.abs(at[n][0] - x) < 0.2 && Math.abs(at[n][1] - y) < 0.2) || '?').sort().join('');
  });
}
"""
hat_rows = []
hat_min = {}       # kind -> (smallest gap in px, the state it was seen in)

def hats(page, label):
    h = page.evaluate(HATS_JS)
    hat_rows.append((label, h["hats"], h["minGap"], h["where"]))
    for kind, g in h["minBy"].items():
        if kind not in hat_min or g < hat_min[kind][0]: hat_min[kind] = (g, label)
    for c in h["clipped"]: fail(f"{label}: hat clipped: {c}")
    return h

# ew7: every raised 2 (sup.ewf-sq, from sqHtml or sqText) MEASURED: its middle
# above the middle of the letter it squares, inside the screen; and no plain
# "²" or "^2" left in any text a learner can read.
SQ_JS = r"""
async () => {
  await document.fonts.ready;
  const vw = document.documentElement.clientWidth;
  const out = { sups: 0, plain: 0, caret: 0, bad: [], minLift: null };
  for (const s of document.querySelectorAll('.view sup.ewf-sq')) {
    const r = s.getBoundingClientRect();
    if (!r.width && !r.height) continue;
    out.sups++;
    let prev = s.previousSibling;
    while (prev && !prev.textContent) prev = prev.previousSibling;
    if (!prev) { out.bad.push('a 2 with no letter before it'); continue; }
    const rg = document.createRange();
    if (prev.nodeType === 3) { const t = prev.textContent; rg.setStart(prev, t.length - 1); rg.setEnd(prev, t.length); } else rg.selectNodeContents(prev);
    const b = rg.getBoundingClientRect();
    const lift = (b.top + b.bottom) / 2 - (r.top + r.bottom) / 2;
    out.minLift = out.minLift == null ? lift : Math.min(out.minLift, lift);
    if (!(lift >= 0.2 * b.height)) out.bad.push(`the 2 after "${prev.textContent.slice(-2)}" is not raised (lift ${lift.toFixed(1)}px)`);
    if (r.left < -0.5 || r.right > vw + 0.5) out.bad.push(`the 2 after "${prev.textContent.slice(-2)}" is off screen`);
  }
  const walker = document.createTreeWalker(document.querySelector('.view'), NodeFilter.SHOW_TEXT);
  for (let t; (t = walker.nextNode());) {
    const e = t.parentElement; if (e.closest('svg')) continue;
    const r = e.getBoundingClientRect(); if (!r.width && !r.height) continue;
    out.plain += (t.textContent.match(/²/g) || []).length;
    out.caret += (t.textContent.match(/\^2/g) || []).length;
  }
  out.minLift = out.minLift == null ? null : Math.round(out.minLift * 10) / 10;
  return out;
}
"""
sq_rows = []

def squares(page, label):
    q = page.evaluate(SQ_JS)
    sq_rows.append((label, q["sups"], q["minLift"]))
    for b in q["bad"]: fail(f"{label}: {b}")
    if q["plain"]: fail(f"{label}: {q['plain']} plain ² left in the text")
    if q["caret"]: fail(f"{label}: {q['caret']} ^2 in the text")
    return q

def measure(page, label, scope=".ewe-play, .ewe-end"):
    m = page.evaluate(MEASURE_JS, scope)
    row = {"state": label, "fractions": m["fracs"], "kinds": m.get("kinds", {}), "overflowX": m["overflowX"],
           "bad": len(m["bad"]), "slash": len(m["slash"]), "offscreen": len(m["offscreen"])}
    fraction_rows.append(row)
    for b in m["bad"]: fail(f"{label}: fraction '{b['text']}' ({b['where']}): {', '.join(b['problems'])}")
    if m["overflowX"] > 0: fail(f"{label}: horizontal overflow {m['overflowX']}px")
    for s in m["slash"]: fail(f"{label}: slash fraction in text: {s!r}")
    for o in m["offscreen"]: fail(f"{label}: element off screen: {o}")
    return m

def shot(page, name):
    page.evaluate("document.fonts.ready")
    page.screenshot(path=os.path.join(OUT, name), full_page=True)

def new_page(browser, height=812, reduced_motion="no-preference"):
    # the fold walk asks for 375 x 667 (the smallest phone in the class);
    # every other walk keeps its 375 x 812
    ctx = browser.new_context(viewport={"width": 375, "height": height}, device_scale_factor=1, reduced_motion=reduced_motion)
    def guard(route):
        host = urlparse(route.request.url).hostname or ""
        if host in ALLOWED_HOSTS: return route.continue_()
        blocked.append(route.request.url); return route.abort()
    ctx.route("**/*", guard)
    page = ctx.new_page()
    page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: console_errors.append(str(e)))
    return ctx, page

def login(page, name, cohort, **flags):
    """Local backend only: seed a throwaway test password onto a demo
    learner of the offline store, then open home with the given flags."""
    page.goto(url(**{"class": cohort}))
    page.wait_for_selector(".name-btn")
    pw = secrets.token_hex(8)
    page.evaluate("""([name, pw]) => {
        const s = JSON.parse(localStorage.getItem('cgg.students'));
        const st = Object.values(s).find(x => x.display_name === name);
        st.password = pw;
        localStorage.setItem('cgg.students', JSON.stringify(s));
        localStorage.setItem('cgg.session', JSON.stringify({ name, password: pw }));
    }""", [name, pw])
    page.goto(url(**flags))
    page.wait_for_selector(".home-head")
    page.wait_for_timeout(400)

def drop_popups(page):
    # one-time home popups (install tips, news, weekly) cover the screenshot;
    # they are not part of this feature, so they are removed for the picture
    page.evaluate("document.querySelectorAll('[class*=overlay]').forEach(e => e.remove())")

def click_chip(page, text):
    ok = page.evaluate("""(t) => { const b = [...document.querySelectorAll('.ewe-step:last-child .ewchip')].find(x => x.textContent === t && !x.disabled); if (!b) return false; b.click(); return true; }""", text)
    if not ok: fail(f"chip {text!r} not clickable")

def click_btn(page, selector, text=None):
    ok = page.evaluate("""([s, t]) => { const b = [...document.querySelectorAll(s)].find(x => (t == null || x.textContent.trim() === t || x.getAttribute('aria-label') === t || x.dataset.opt === t) && !x.disabled && !x.hidden); if (!b) return false; b.click(); return true; }""", [selector, text])
    if not ok: fail(f"button {selector} {text!r} not clickable")

def has(page, sel):
    return page.evaluate("(s) => !!document.querySelector(s)", sel)

# Foreman review 2026-09-29: `:not([hidden])` only reads the attribute. A CSS
# display rule beat it and the first build shipped a link that was always on
# screen while this test said it was hidden. seen() asks what a learner sees.
def seen(page, sel):
    return page.evaluate("""(s) => [...document.querySelectorAll(s)].some(e => {
        const c = getComputedStyle(e), r = e.getBoundingClientRect();
        return c.display !== 'none' && c.visibility !== 'hidden' && r.width > 0 && r.height > 0; })""", sel)

# Pop-ups (foreman, 2026-10-02): a fresh login lands on home, which opens the
# one-time install sheet and, Friday to Sunday, the Weekend Rally modal. They
# are fixed sheets over the WHOLE app (going to a round does not close them)
# and an open one locks the page's scroll (body overflow hidden). A walk that
# measures what a learner sees closes them first, the way a learner does: the
# ✕ of the top one, then the next. Every pop-up shell here is a *-overlay.
POPUPS_JS = r"""() => ({
  open: [...document.querySelectorAll('[class*=overlay]')].filter(e => { const c = getComputedStyle(e); return c.position === 'fixed' && c.display !== 'none' && c.visibility !== 'hidden'; })
        .map(e => e.className + (e.querySelector('h1') ? ' (' + e.querySelector('h1').textContent.trim() + ')' : '')),
  locked: document.body.style.overflow === 'hidden' })"""

def popups(page):
    return page.evaluate(POPUPS_JS)

def close_popups(page):
    """Close every open pop-up with its own ✕, top one first, as a learner
    would (a real click, so a sheet still covering the ✕ would stop it).
    Returns what was closed."""
    closed = []
    for _ in range(8):
        p = popups(page)
        if not p["open"]: break
        page.evaluate("""() => { const all = [...document.querySelectorAll('[class*=overlay]')].filter(e => getComputedStyle(e).position === 'fixed');
            all.forEach(e => e.removeAttribute('data-pw-top')); all[all.length - 1].setAttribute('data-pw-top', '1'); }""")
        closed.append(p["open"][-1])
        try:
            page.click("[data-pw-top] .wk-close", timeout=5000)
            page.wait_for_function("() => !document.querySelector('[data-pw-top]')", timeout=3000)
        except Exception as e:
            fail(f"pop-up {p['open'][-1]!r} would not close with its ✕: {e}")
            break
    page.wait_for_timeout(100)
    return closed

# Fold 3 (foreman ruling 2026-10-02): a finished BUILD step, what a learner
# sees of it. Its boxes and Kontroleer gone (display:none), its prompt and its
# line (✓, or 💡 after "show me") on screen.
FINISHED_JS = r"""(k) => {
  const st = document.querySelector(`.ewe-steps > .ewe-step:nth-child(${k})`);
  const seenEl = e => { if (!e) return false; const c = getComputedStyle(e), r = e.getBoundingClientRect(); return c.display !== 'none' && c.visibility !== 'hidden' && r.width > 0 && r.height > 0; };
  const slots = [...st.querySelectorAll('.ewpad-disp .ewslot')];
  const fb = st.querySelector('.ewe-fb');
  return { slots: slots.length, slotsSeen: slots.filter(seenEl).length, disp: seenEl(st.querySelector('.ewpad-disp')),
           sub: seenEl(st.querySelector('.ewkey-sub')), prompt: seenEl(st.querySelector('.ewe-prompt')),
           fb: seenEl(fb) ? fb.textContent.trim() : '', fbKind: fb ? fb.className : '', fbFracs: fb ? fb.querySelectorAll('.ewf').length : 0,
           h: Math.round(st.getBoundingClientRect().height) }; }"""

def finished(page, k):
    return page.evaluate(FINISHED_JS, k)

def frame_gone(fz, mark):
    # the boxes all hidden, Kontroleer hidden, the prompt and the line on screen
    return fz["slots"] > 0 and fz["slotsSeen"] == 0 and not fz["disp"] and not fz["sub"] and fz["prompt"] and fz["fb"].startswith(mark)

try:
    for _ in range(50):
        try: socket.create_connection(("127.0.0.1", PORT), timeout=0.2).close(); break
        except OSError: time.sleep(0.1)

    with sync_playwright() as pw:
        browser = pw.chromium.launch()

        # ---------------- visibility ----------------
        vis = []
        ctx, page = new_page(browser)
        login(page, "Demo Matric", "gr12", ewe="1")
        card = has(page, ".ewe-banner")
        home_cards = page.evaluate("document.querySelectorAll('.view > .round-grid .round-card, .round-grid .round-card').length")
        page.evaluate("window.__APP__.go('ewes')")
        map_ok = has(page, ".round-card") and "Eweredigheid" in page.inner_text("h1")
        vis.append(("Gr12 learner, ?ewe=1", card, map_ok))
        if not card or not map_ok: fail("Gr12 + ?ewe=1 should see the card and the map")
        ctx.close()

        # Released 2026-10-03 (eweLive true): a Gr12 learner with NO flag sees
        # the card and the five released rounds; ew7 "Vreemde formaat" is held
        # back (CONFIG.eweHeld) and must not show anywhere, nor be reachable,
        # and ew5's end screen must not offer a way on to it.
        live_checks = []
        def checkl(name, ok):
            live_checks.append((name, ok))
            if not ok: fail(name)
        LIVE_TITLES = ["Watter sye hoort saam?", "Nou met die ∥ lyne", "Deel 'n sy", "Deel 'n hoek", "Watter een is dit?"]
        MAP_JS = """() => [...document.querySelectorAll('.round-card')].map(c => ({ n: c.querySelector('.rc-num').textContent.trim(),
            title: c.querySelector('h3').textContent.trim(), done: c.classList.contains('done'), locked: c.classList.contains('locked') }))"""
        errs0 = len(console_errors)
        ctx, page = new_page(browser)
        login(page, "Demo Matric", "gr12")
        card = has(page, ".ewe-banner")
        card_txt = page.inner_text(".ewe-banner") if card else ""
        checkl(f"Gr12, no flag: the 📏 card is on home and reads '0 van 5 klaar' ({' / '.join(l for l in card_txt.splitlines() if 'klaar' in l) or 'no count'})",
               card and "0 van 5 klaar" in card_txt)
        page.evaluate("window.__APP__.go('ewes')")
        page.wait_for_selector(".round-card")
        m0 = page.evaluate(MAP_JS)
        checkl(f"Gr12, no flag: the map lists exactly five rounds, in order ({' | '.join(c['n'] + '. ' + c['title'] for c in m0)})",
               [c["title"] for c in m0] == LIVE_TITLES and [c["n"] for c in m0] == ["1", "2", "3", "4", "5"])
        checkl("Gr12, no flag: no 'Vreemde formaat' and no 'Die trapesium' anywhere on the map",
               "Vreemde formaat" not in page.inner_text(".view") and "Die trapesium" not in page.inner_text(".view"))
        shot(page, "live-map-five.png")
        mods = page.evaluate("""async () => { const m = await import('./js/rounds/index.js');
            return { ewe: m.EWE.map(r => r.id), byId: !!m.ROUND_BY_ID.ew7, byId6: !!m.ROUND_BY_ID.ew6, total: m.ROUNDS.length }; }""")
        checkl(f"Gr12, no flag: the page's round list holds ew1 to ew5 only ({', '.join(mods['ewe'])}; ROUND_BY_ID.ew6 {mods['byId6']}, ew7 {mods['byId']}; ROUNDS {mods['total']})",
               mods["ewe"] == ["ew1", "ew2", "ew3", "ew4", "ew5"] and not mods["byId"] and not mods["byId6"])
        for held in ("ew6", "ew7"):
            page.evaluate("(id) => window.__APP__.go('ewe', { roundId: id })", held)
            page.wait_for_timeout(200)
            guessed = has(page, ".ewe-play")
            on_map = has(page, ".round-card") and "Eweredigheid" in page.inner_text("h1")
            checkl(f"Gr12, no flag: a guessed {held} link does not open the round, it lands on the map", not guessed and on_map)
        page.evaluate("window.__APP__.go('ewe', { roundId: 'ew1' })")
        page.wait_for_timeout(200)
        checkl("Gr12, no flag: ew1 opens", has(page, ".ewe-play"))
        vis.append(("Gr12 learner, no flag (released, ew7 held)", card, has(page, ".ewe-play")))
        # ew1 to ew4 passed (seeded in the local store), then ew5 played to the end
        page.evaluate("""() => { const s = JSON.parse(localStorage.getItem('cgg.students')); const me = Object.values(s).find(x => x.display_name === 'Demo Matric');
            const all = JSON.parse(localStorage.getItem('cgg.progress')) || {}; const p = all[me.id] || {};
            for (const id of ['ew1', 'ew2', 'ew3', 'ew4']) p[id] = { best_score: 1, attempts: 1, total_xp: 0, passed: true, paid_replays: 0, last_played_at: Date.now(), last_correct: 1, last_total: 1 };
            all[me.id] = p; localStorage.setItem('cgg.progress', JSON.stringify(all)); }""")
        page.goto(url()); page.wait_for_selector(".home-head"); page.wait_for_timeout(300)
        close_popups(page)
        page.evaluate("window.__APP__.go('ewes')")
        page.wait_for_selector(".round-card")
        m1 = page.evaluate(MAP_JS)
        checkl(f"Gr12, no flag, ew1 to ew4 passed: ew5 is open, still five cards ({' '.join(c['n'] + ('✓' if c['done'] else '🔒' if c['locked'] else '▶') for c in m1)})",
               len(m1) == 5 and all(c["done"] for c in m1[:4]) and not m1[4]["locked"] and not m1[4]["done"])
        q5 = page.evaluate("""async () => { const m = await import('./js/rounds/index.js'); const r = m.EWE.find(x => x.id === 'ew5');
            return r.eweQuestions.map(q => q.steps.map(s => (s.options || []).find(o => o.correct).text)); }""")
        page.evaluate("window.__APP__.go('ewe', { roundId: 'ew5' })")
        page.wait_for_selector(".ewe-play")
        for qsteps in q5:
            for right in qsteps:
                click_btn(page, ".ewe-step:last-child .ewe-opt", right)
                page.wait_for_timeout(120)
            click_btn(page, ".ewe-next")
            page.wait_for_timeout(250)
        page.wait_for_selector(".ewe-end", timeout=8000)
        btns = page.evaluate("() => [...document.querySelectorAll('.ewe-end .btn')].map(b => b.textContent.trim())")
        checkl(f"Gr12, no flag: ew5's end screen offers NO next round ({' | '.join(btns)})",
               not any("Volgende rondte" in b for b in btns) and any("Eweredigheid-kaart" in b for b in btns))
        shot(page, "live-ew5-end.png")
        click_btn(page, ".ewe-end .btn", "📏 Eweredigheid-kaart")
        page.wait_for_selector(".round-card")
        m2 = page.evaluate(MAP_JS)
        checkl(f"Gr12, no flag: after ew5 the map shows five ✓ and no sixth card ({len(m2)} cards)", len(m2) == 5 and all(c["done"] for c in m2))
        page.evaluate("window.__APP__.go('home')")
        page.wait_for_selector(".ewe-banner")
        t2 = page.inner_text(".ewe-banner")
        checkl(f"Gr12, no flag: the home card now reads '5 van 5 klaar'", "5 van 5 klaar" in t2)
        ctx.close()
        live_errs = console_errors[errs0:]
        checkl(f"Gr12, no flag: {len(live_errs)} console errors in this walk", not live_errs)

        for label, flags in [("Gr11 learner, no flag", {}),
                             ("Gr11 learner, class=gr12 in the link", {"class": "gr12"}),
                             ("Gr11 learner, ?ewe=1", {"ewe": "1"}),
                             ("Gr11 learner, ?ewe=1&class=gr12 in the link", {"ewe": "1", "class": "gr12"})]:
            ctx, page = new_page(browser)
            login(page, "Demo Learner", "gr11", **flags)
            card = has(page, ".ewe-banner")
            page.evaluate("window.__APP__.go('ewe', { roundId: 'ew1' })")
            reached = has(page, ".ewe-play")
            page.evaluate("window.__APP__.go('ewes')")
            map_reached = "Eweredigheid" in page.inner_text("h1")
            vis.append((label, card, reached or map_reached))
            if card or reached or map_reached: fail(f"{label}: must not see or reach it")
            ctx.close()

        # the teacher sees the card either way since the release; ?ewe=1 adds
        # the two held rounds (seven cards), without it the map is the learners' five
        HELD_TITLES = ["Die trapesium", "Vreemde formaat"]
        for label, flags, want, nmap in [("Teacher preview, ?ewe=1", {"preview": "1", "ewe": "1"}, True, 7),
                                         ("Teacher preview, no flag", {"preview": "1"}, True, 5)]:
            ctx, page = new_page(browser)
            page.goto(url(**flags)); page.wait_for_selector(".home-head"); page.wait_for_timeout(300)
            card = has(page, ".ewe-banner")
            page.evaluate("window.__APP__.go('ewes')")
            page.wait_for_timeout(200)
            titles = [c["title"] for c in page.evaluate(MAP_JS)]
            want_titles = LIVE_TITLES + (HELD_TITLES if nmap == 7 else [])
            vis.append((label, card, titles == want_titles))
            checkl(f"{label}: card shown {card}, map {len(titles)} rounds ({' | '.join(titles)})", card == want and titles == want_titles)
            ctx.close()

        # Gr12 WITH ?ewe=1: the two held rounds are back, Die trapesium sixth
        # and Vreemde formaat seventh, both locked until the one before them
        # is passed (the full walk below then plays all seven)
        ctx, page = new_page(browser)
        login(page, "Demo Matric", "gr12", ewe="1")
        t0 = page.inner_text(".ewe-banner") if has(page, ".ewe-banner") else ""
        page.evaluate("window.__APP__.go('ewes')")
        page.wait_for_selector(".round-card")
        mf = page.evaluate(MAP_JS)
        checkl(f"Gr12, ?ewe=1: the card reads '0 van 7 klaar' and the map lists seven, Die trapesium sixth and Vreemde formaat seventh, both locked ({' | '.join(c['n'] + '. ' + c['title'] for c in mf)})",
               "0 van 7 klaar" in t0 and [c["title"] for c in mf] == LIVE_TITLES + HELD_TITLES and [c["n"] for c in mf] == [str(i) for i in range(1, 8)]
               and mf[5]["locked"] and mf[6]["locked"])
        ctx.close()

        # ---------------- the walk ----------------
        ctx, page = new_page(browser)
        login(page, "Demo Matric", "gr12", ewe="1")
        drop_popups(page)
        page.wait_for_timeout(200)
        shot(page, "a-home-card.png")
        measure(page, "home with card", ".ewe-banner")
        page.evaluate("window.__APP__.go('ewes')")
        measure(page, "Eweredigheid map", ".view")
        ew2_locked_before = page.evaluate("""() => { const c = [...document.querySelectorAll('.round-card')]; return c.length >= 2 && c[1].classList.contains('locked') && !c[1].querySelector('.btn'); }""")
        if not ew2_locked_before: fail("ew2 should be locked before ew1 is passed")
        click_btn(page, ".round-card .btn")
        page.wait_for_selector(".ewe-play")

        data = page.evaluate("""async () => { const m = await import('./js/rounds/index.js');
            return m.EWE[0].eweQuestions.map(q => ({ id: q.id, steps: q.steps.map(s => ({ type: s.type, chips: s.chips, answer: s.answer,
              options: s.options && s.options.map(o => ({ text: o.text, correct: !!o.correct })) })) })); }""")
        for qi, q in enumerate(data):
            n = qi + 1
            lab = page.evaluate(LABELS_JS)
            label_rows.append((q["id"], lab))
            if lab is None: fail(f"Q{n}: no sketch")
            else:
                for c in lab["collisions"]: fail(f"Q{n} sketch: {c}")
            for si, st in enumerate(q["steps"]):
                tag = f"Q{n} step {si + 1} ({st['type']})"
                if st["type"] == "build":
                    measure(page, f"{tag}: boxes empty")
                    if n == 1: shot(page, "b-q1-boxes-empty.png")
                    if n == 3: shot(page, "f-q3.png")
                    a = st["answer"]
                    wrong = [a[0], a[3], a[2], a[1]]           # a real pattern mistake, not a repeat
                    for c in wrong: click_chip(page, c)
                    measure(page, f"{tag}: boxes full (wrong)")
                    click_btn(page, ".ewe-step:last-child .ewkey-sub")
                    m = measure(page, f"{tag}: wrong answer + hint")
                    if not has(page, ".ewe-step:last-child .ewe-hint:not([hidden])"): fail(f"{tag}: no hint after a wrong answer")
                    if n == 1: shot(page, "d-q1-wrong-hint.png")
                    for _ in range(4): click_btn(page, ".ewe-step:last-child .ewkey-del")
                    measure(page, f"{tag}: boxes empty again")
                    for c in a: click_chip(page, c)
                    measure(page, f"{tag}: boxes full (right)")
                    if n == 1: shot(page, "c-q1-boxes-full.png")
                    if n == 4: shot(page, "g-q4-full.png")
                    if n == 6: shot(page, "i-q6-full.png")
                    click_btn(page, ".ewe-step:last-child .ewkey-sub")
                    measure(page, f"{tag}: marked right")
                    if not has(page, ".ewe-step .ewpad.is-locked"): fail(f"{tag}: right answer not accepted")
                else:
                    measure(page, f"{tag}: options")
                    if n == 5: shot(page, "h-q5.png")
                    wrong = next(o["text"] for o in st["options"] if not o["correct"])
                    right = next(o["text"] for o in st["options"] if o["correct"])
                    click_btn(page, ".ewe-step:last-child .ewe-opt", wrong)
                    measure(page, f"{tag}: wrong pick + hint")
                    click_btn(page, ".ewe-step:last-child .ewe-opt", right)
                    measure(page, f"{tag}: right pick")
            if not has(page, ".ewe-write"): fail(f"Q{n}: no 'Só skryf jy dit' card")
            measure(page, f"Q{n}: Só skryf jy dit card")
            if n == 1:
                page.evaluate("document.querySelector('.ewe-write').scrollIntoView()")
                shot(page, "e-q1-write-card.png")
            click_btn(page, ".ewe-next")
            page.wait_for_timeout(250)

        page.wait_for_selector(".ewe-end", timeout=8000)
        measure(page, "end of round")
        shot(page, "j-end-of-round.png")
        saved = page.evaluate("""() => { const s = JSON.parse(localStorage.getItem('cgg.students')); const me = Object.values(s).find(x => x.display_name === 'Demo Matric');
            const p = (JSON.parse(localStorage.getItem('cgg.progress')) || {})[me.id] || {}; const ev = (JSON.parse(localStorage.getItem('cgg.events')) || []).filter(e => e.studentId === me.id && e.roundId === 'ew1');
            return { progress: p.ew1 || null, xpEvents: ev.map(e => e.xp) }; }""")
        next_is_ew2 = page.evaluate("""() => [...document.querySelectorAll('.ewe-end .btn')].some(b => b.textContent.includes('Volgende rondte'))""")
        if not next_is_ew2: fail("ew1's end screen has no way on to the next round")
        page.evaluate("window.__APP__.go('ewes')")
        map_done = has(page, ".round-card.done")
        ew2_unlocked = page.evaluate("""() => { const c = [...document.querySelectorAll('.round-card')]; return c.length >= 2 && !c[1].classList.contains('locked') && !!c[1].querySelector('.btn'); }""")
        if not ew2_unlocked: fail("ew2 not unlocked after ew1 was passed")
        ew3_locked_before = page.evaluate("""() => { const c = [...document.querySelectorAll('.round-card')]; return c.length >= 3 && c[2].classList.contains('locked') && !c[2].querySelector('.btn'); }""")
        if not ew3_locked_before: fail("ew3 should be locked before ew2 is passed")

        # ---------------- the ew2 walk ----------------
        page.evaluate("() => { const c = [...document.querySelectorAll('.round-card')]; c[1].querySelector('.btn').click(); }")
        page.wait_for_selector(".ewe-play")
        ew2_title = page.inner_text(".play-title")
        if "Nou met die ∥ lyne" not in ew2_title: fail(f"the second card did not open ew2: {ew2_title!r}")
        data2 = page.evaluate("""async () => { const m = await import('./js/rounds/ewe2-met-die-lyne.js');
            return m.round.eweQuestions.map(q => ({ id: q.id, steps: q.steps.map(s => ({ type: s.type, chips: s.chips || [], answer: s.answer, fixed: s.fixed || [],
              bottoms: (s.chips || []).filter(c => m.TRIANGLES[q.id].seg[c].pos === 'b'),
              options: s.options && s.options.map(o => ({ text: o.text, correct: !!o.correct, bottom: !!(o.fill && m.TRIANGLES[q.id].seg[o.fill[3]].pos === 'b') })) })) })); }""")
        ew2_checks = []
        def check(name, ok):
            ew2_checks.append((name, ok))
            if not ok: fail(name)
        def pad_state():
            return page.evaluate("""() => { const s = [...document.querySelectorAll('.ewe-step:last-child .ewslot')];
                const nx = document.querySelector('.ewe-step:last-child .ewslot.is-next');
                const d = document.querySelector('.ewe-step:last-child .ewkey-del');
                return { texts: s.map(x => x.textContent), fixed: s.filter(x => x.classList.contains('is-fixed')).map(x => x.textContent),
                         next: nx ? +nx.dataset.slot : null, delDisabled: d ? d.disabled : null }; }""")
        def clear_pad():
            page.evaluate("() => { const d = document.querySelector('.ewe-step:last-child .ewkey-del'); while (!d.disabled) d.click(); }")
        for qi, q in enumerate(data2):
            n = qi + 1
            P = f"ew2 Q{n}"
            lab = page.evaluate(LABELS_JS)
            label_rows.append((q["id"], lab))
            if lab is None: fail(f"{P}: no sketch")
            else:
                for c in lab["collisions"]: fail(f"{P} sketch: {c}")
                if lab["arrows"] != 2: fail(f"{P} sketch: {lab['arrows']} ∥ arrows, want 2")
            for si, st in enumerate(q["steps"]):
                tag = f"{P} step {si + 1} ({st['type']})"
                if st["type"] == "build":
                    fx, a = st["fixed"], st["answer"]
                    rest = a[len(fx):]
                    ps = pad_state()
                    check(f"{tag}: glow on the first EMPTY box (box {len(fx) + 1})", ps["next"] == len(fx))
                    if fx:
                        check(f"{tag}: {fx[0]} sits in the first box, given", ps["fixed"] == fx and ps["texts"][0] == fx[0])
                        check(f"{tag}: ⌫ is off while only the given chip is there", ps["delDisabled"] is True)
                    measure(page, f"{tag}: boxes empty")
                    shot(page, f"ew2-q{n}-a-boxes-empty.png")
                    wrong = rest[:-1] + [st["bottoms"][0]]           # the round's trap: a bottom piece
                    for c in wrong: click_chip(page, c)
                    measure(page, f"{tag}: boxes full (wrong)")
                    click_btn(page, ".ewe-step:last-child .ewkey-sub")
                    measure(page, f"{tag}: wrong answer + hint")
                    hint = page.inner_text(".ewe-step:last-child .ewe-hint") if seen(page, ".ewe-step:last-child .ewe-hint") else ""
                    check(f"{tag}: a bottom piece gets the whole-side hint", "onderste stuk" in hint)
                    shot(page, f"ew2-q{n}-b-wrong-hint.png")
                    clear_pad()
                    ps = pad_state()
                    if fx: check(f"{tag}: ⌫ cannot remove the given {fx[0]}", ps["fixed"] == fx and ps["texts"][0] == fx[0] and ps["next"] == len(fx))
                    measure(page, f"{tag}: boxes empty again")
                    for c in rest: click_chip(page, c)
                    measure(page, f"{tag}: boxes full (right)")
                    shot(page, f"ew2-q{n}-c-boxes-full.png")
                    click_btn(page, ".ewe-step:last-child .ewkey-sub")
                    measure(page, f"{tag}: marked right")
                    check(f"{tag}: right answer accepted", has(page, f".ewe-steps > .ewe-step:nth-child({si + 1}) .ewpad.is-locked"))
                else:
                    measure(page, f"{tag}: options")
                    shot(page, f"ew2-q{n}-d-options.png")
                    wrong_o = next((o for o in st["options"] if o["bottom"]), None) or next(o for o in st["options"] if not o["correct"])
                    right = next(o["text"] for o in st["options"] if o["correct"])
                    click_btn(page, ".ewe-step:last-child .ewe-opt", wrong_o["text"])
                    measure(page, f"{tag}: wrong pick + hint")
                    check(f"{tag}: a wrong pick shows its hint", seen(page, ".ewe-step:last-child .ewe-hint"))
                    if wrong_o["bottom"]:
                        check(f"{tag}: the bottom piece gets the whole-side hint", "onderste stuk" in page.inner_text(".ewe-step:last-child .ewe-hint"))
                        shot(page, f"ew2-q{n}-e-wrong-pick.png")
                    click_btn(page, ".ewe-step:last-child .ewe-opt", right)
                    measure(page, f"{tag}: right pick")
                    if q["id"] == "ew2q4":
                        check(f"{tag}: the half-built ratio is finished after the right pick",
                              page.evaluate("(k) => { const s = document.querySelector(`.ewe-steps > .ewe-step:nth-child(${k}) .ewe-show`); return !!s && !s.querySelector('.ewslot') && s.querySelectorAll('.ewf').length === 2; }", si + 1))
            card = page.evaluate("""() => { const c = document.querySelector('.ewe-write'); if (!c) return null;
                const sim = c.querySelector('.ewl-sim'); return { sim: sim ? sim.textContent : '', all: c.textContent, lines: c.querySelectorAll('.ewl').length }; }""")
            check(f"{P}: 'Só skryf jy dit' card with TWO lines (Δ ||| Δ (∠∠∠), then the ratio (uit |||))",
                  bool(card) and card["lines"] == 2 and "|||" in card["sim"] and "(∠∠∠)" in card["sim"] and "(uit |||)" in card["all"])
            measure(page, f"{P}: Só skryf jy dit card")
            page.evaluate("document.querySelector('.ewe-write').scrollIntoView()")
            shot(page, f"ew2-q{n}-f-card.png")
            click_btn(page, ".ewe-next")
            page.wait_for_timeout(250)
        page.wait_for_selector(".ewe-end", timeout=8000)
        measure(page, "ew2 end of round")
        check("ew2 end screen: the takeaway carries both lines", page.evaluate("() => document.querySelectorAll('.ewe-end .ewe-takeaway .ewl').length === 2"))
        shot(page, "ew2-end-of-round.png")
        saved2 = page.evaluate("""() => { const s = JSON.parse(localStorage.getItem('cgg.students')); const me = Object.values(s).find(x => x.display_name === 'Demo Matric');
            const p = (JSON.parse(localStorage.getItem('cgg.progress')) || {})[me.id] || {}; const ev = (JSON.parse(localStorage.getItem('cgg.events')) || []).filter(e => e.studentId === me.id && e.roundId === 'ew2');
            return { progress: p.ew2 || null, xpEvents: ev.map(e => e.xp) }; }""")

        # ---------------- ew2 -> ew3: the way on, and the map ----------------
        ew3_checks = []
        def check3(name, ok):
            ew3_checks.append((name, ok))
            if not ok: fail(name)
        check3("ew2's end screen offers the next round", page.evaluate("""() => [...document.querySelectorAll('.ewe-end .btn')].some(b => b.textContent.includes('Volgende rondte'))"""))
        click_btn(page, ".ewe-end .btn", "▶ Volgende rondte")
        page.wait_for_selector(".ewe-play")
        check3("the way on from ew2 opens ew3", "Deel 'n sy" in page.inner_text(".play-title"))
        page.evaluate("window.__APP__.go('ewes')")
        page.wait_for_selector(".round-card")
        check3("the map unlocks ew3 once ew2 is passed (ew2 shows ✓)", page.evaluate("""() => { const c = [...document.querySelectorAll('.round-card')];
            return c.length >= 3 && c[1].classList.contains('done') && !c[2].classList.contains('locked') && !!c[2].querySelector('.btn'); }"""))
        ew4_locked_before = page.evaluate("""() => { const c = [...document.querySelectorAll('.round-card')]; return c.length >= 4 && c[3].classList.contains('locked') && !c[3].querySelector('.btn'); }""")
        if not ew4_locked_before: fail("ew4 should be locked before ew3 is passed")

        # ---------------- the ew3 walk ----------------
        page.evaluate("() => { const c = [...document.querySelectorAll('.round-card')]; c[2].querySelector('.btn').click(); }")
        page.wait_for_selector(".ewe-play")
        data3 = page.evaluate("""async () => { const m = await import('./js/rounds/ewe3-deel-n-sy.js');
            return m.round.eweQuestions.map(q => ({ id: q.id, area: !!(q.write && q.write.area), steps: q.steps.map(s => {
              const T = m.SKETCHES[q.id], tris = s.spec ? s.spec.tris : null;
              const inBoth = c => { const g = T.seg[c]; return !!g && !g.struck && tris.every(t => t.includes(g.from) && t.includes(g.to)); };
              const isBase = c => { const g = T.seg[c]; return !!g && !g.struck && g.base; };
              return { type: s.type, chips: s.chips || [], answer: s.answer || [], hints: s.hints || {},
                shared: (s.chips || []).filter(inBoth), struck: (s.chips || []).filter(c => T.seg[c] && T.seg[c].struck),
                other: (s.chips || []).filter(c => T.seg[c] && !T.seg[c].struck && !inBoth(c) && !(s.answer || []).includes(c) && !isBase(c)),
                options: s.options && s.options.map(o => ({ text: o.text, correct: !!o.correct, hint: o.hint || '' })), okLine: s.okLine || '' }; }) })); }""")
        CARD3_JS = r"""() => {
          const c = document.querySelector('.ewe-write'); if (!c) return null;
          const line = c.querySelector('.ewl-area');
          const res = { area: !!line, text: (c.querySelector('.ewe-write-text') || {}).textContent || '', fracs: c.querySelectorAll('.ewf').length };
          if (!line) return res;
          const fr = [...line.querySelectorAll('.ewf')];
          const strikes = [...line.querySelectorAll('.ewf-x')];
          res.strikes = strikes.length;
          res.strikesInsideMiddle = strikes.every(x => x.closest('.ewf') === fr[1] && !!x.closest('.ewf-n, .ewf-d'));
          res.struckText = strikes.map(x => x.textContent).join(' ');
          res.tints = [...fr[0].querySelectorAll('.ewtint')].map(x => x.className.match(/ewtint-\d/)[0] + ':' + x.textContent);
          /* each "=" unit is ONE line (nothing breaks inside it) */
          res.unitsWrapped = [...line.querySelectorAll('.ewq-u')].filter(u => {
            const r = u.getBoundingClientRect(), f = u.querySelector('.ewf').getBoundingClientRect();
            return r.height > f.height + 2; }).length;
          /* rows, by each unit's vertical CENTRE (units on one row are centred,
             and their heights differ, so their tops do not line up) */
          res.rows = new Set([...line.querySelectorAll('.ewq-u')].map(u => { const r = u.getBoundingClientRect(); return Math.round((r.top + r.bottom) / 8); })).size;
          const rs = line.querySelector('.ewl-rs');
          res.reason = rs ? rs.textContent : '';
          if (rs) { const rg = document.createRange(); rg.selectNodeContents(rs);
            res.reasonLines = new Set([...rg.getClientRects()].map(r => Math.round(r.top))).size;
            const q = line.querySelector('.ewq').getBoundingClientRect(), r = rs.getBoundingClientRect();
            res.reasonBelow = r.top >= q.bottom - 1; }
          return res; }"""
        for qi, q in enumerate(data3):
            n = qi + 1
            P = f"ew3 Q{n}"
            lab = page.evaluate(LABELS_JS)
            label_rows.append((q["id"], lab))
            if lab is None: fail(f"{P}: no sketch")
            else:
                for c in lab["collisions"]: fail(f"{P} sketch: {c}")
                check3(f"{P} sketch: two tinted triangles", lab["tints"] == 2)
                if q["area"]:
                    check3(f"{P} sketch: the dotted ⊥h, its right-angle box and its label", lab["heights"] == 1 and lab["dotted"] and lab["boxes"] == 1 and lab["hlabel"] == 1)
                else:
                    check3(f"{P} sketch: no ⊥h and no ∥ arrows (Q5)", lab["heights"] == 0 and lab["arrows"] == 0)
            for si, st in enumerate(q["steps"]):
                tag = f"{P} step {si + 1} ({st['type']})"
                k = si + 1
                if st["type"] == "build":
                    a = st["answer"]
                    ps = pad_state()
                    check3(f"{tag}: {len(a)} boxes, the glow on the first", len(ps["texts"]) == len(a) and ps["next"] == 0)
                    if si == 0:
                        tw = page.evaluate("() => [...document.querySelectorAll('.ewe-step:last-child .ewpad-disp .ewtint')].map(x => x.className.match(/ewtint-\\d/)[0] + ':' + x.textContent)")
                        check3(f"{tag}: the two 'Opp Δ' words carry the two tints {tw}", len(tw) == 2 and tw[0].startswith("ewtint-1:Opp Δ") and tw[1].startswith("ewtint-2:Opp Δ"))
                    measure(page, f"{tag}: boxes empty")
                    shot(page, f"ew3-q{n}-s{k}-a-boxes-empty.png")
                    wrongs = [([a[1], a[0]], "Kyk watter Δ staan bo", "swapped order")]
                    if st["shared"]: wrongs.append(([st["shared"][0], a[1]], "DEEL", f"the shared side {st['shared'][0]}"))
                    for c in st["struck"]: wrongs.append(([c, a[1]] if c == "½" else [a[0], c], "doodgetrek", f"struck-through {c}"))
                    if n == 1 and si == 0:
                        wrongs.append(([a[0], a[0]], "sê die breuk niks", "the same chip twice"))
                        if st["other"]: wrongs.append(([st["other"][0], a[1]], "Soek dié sy", f"not a base: {st['other'][0]}"))
                    for wi, (fill, want, name) in enumerate(wrongs):
                        clear_pad()
                        for c in fill: click_chip(page, c)
                        measure(page, f"{tag}: boxes full ({name})")
                        click_btn(page, ".ewe-step:last-child .ewkey-sub")
                        measure(page, f"{tag}: {name} + hint")
                        hint = page.inner_text(".ewe-step:last-child .ewe-hint") if seen(page, ".ewe-step:last-child .ewe-hint") else ""
                        check3(f"{tag}: {'/'.join(fill)} ({name}) gets its hint", want in hint)
                        shot(page, f"ew3-q{n}-s{k}-b{wi + 1}-wrong.png")
                    clear_pad()
                    for c in a: click_chip(page, c)
                    measure(page, f"{tag}: boxes full (right)")
                    shot(page, f"ew3-q{n}-s{k}-c-boxes-full.png")
                    click_btn(page, ".ewe-step:last-child .ewkey-sub")
                    measure(page, f"{tag}: marked right")
                    check3(f"{tag}: right answer {'/'.join(a)} accepted", has(page, f".ewe-steps > .ewe-step:nth-child({k}) .ewpad.is-locked"))
                    fbf = page.evaluate("(k) => document.querySelectorAll(`.ewe-steps > .ewe-step:nth-child(${k}) .ewe-fb.good .ewf`).length", k)
                    check3(f"{tag}: the ✓ line is the finished frame ({fbf} fractions)", fbf == (2 if si == 0 else 1))
                else:
                    measure(page, f"{tag}: options")
                    shot(page, f"ew3-q{n}-s{k}-d-options.png")
                    for o in [o for o in st["options"] if not o["correct"]]:
                        click_btn(page, ".ewe-step:last-child .ewe-opt", o["text"])
                        measure(page, f"{tag}: wrong pick {o['text'][:24]}")
                        hint = page.inner_text(".ewe-step:last-child .ewe-hint") if seen(page, ".ewe-step:last-child .ewe-hint") else ""
                        check3(f"{tag}: '{o['text']}' shows its own hint", o["hint"] and o["hint"] in hint)
                    shot(page, f"ew3-q{n}-s{k}-e-wrong-pick.png")
                    right = next(o["text"] for o in st["options"] if o["correct"])
                    click_btn(page, ".ewe-step:last-child .ewe-opt", right)
                    measure(page, f"{tag}: right pick")
                    # the card and the way on now follow this step, so it is no
                    # longer :last-child: address it by its place
                    fsel = f".ewe-steps > .ewe-step:nth-child({k}) .ewe-fb"
                    fb = page.inner_text(fsel) if seen(page, fsel) else ""
                    check3(f"{tag}: '{right}' is right and ends on its takeaway", st["okLine"] in fb)
            card = page.evaluate(CARD3_JS)
            if q["area"]:
                ok = (bool(card) and card["area"] and card["fracs"] == 3 and card["strikes"] == 4 and card["strikesInsideMiddle"]
                      and card["struckText"] == "½ ⊥h ½ ⊥h" and card["unitsWrapped"] == 0
                      and card["reason"] == "(gemeenskaplike hoogte ⊥ en lyn)" and card["reasonLines"] == 1
                      and len(card["tints"]) == 2)
                check3(f"{P}: card = three fractions, ½ and ⊥h struck inside the middle one, chain on {card and card.get('rows')} row(s), reason whole{' (moved down)' if card and card.get('reasonBelow') else ''}", ok)
                if not ok: print("   card:", card)
            else:
                check3(f"{P}: card = the Nee takeaway, no fraction", bool(card) and not card["area"] and card["fracs"] == 0 and "ander gereedskap" in card["text"])
            measure(page, f"{P}: Só skryf jy dit card")
            page.evaluate("document.querySelector('.ewe-write').scrollIntoView()")
            shot(page, f"ew3-q{n}-f-card.png")
            click_btn(page, ".ewe-next")
            page.wait_for_timeout(250)
        page.wait_for_selector(".ewe-end", timeout=8000)
        measure(page, "ew3 end of round")
        check3("ew3 end screen: the takeaway carries the three-fraction chain",
               page.evaluate("() => { const l = document.querySelector('.ewe-end .ewe-takeaway .ewl-area'); return !!l && l.querySelectorAll('.ewf').length === 3 && l.querySelectorAll('.ewf-x').length === 4; }"))
        shot(page, "ew3-end-of-round.png")
        saved3 = page.evaluate("""() => { const s = JSON.parse(localStorage.getItem('cgg.students')); const me = Object.values(s).find(x => x.display_name === 'Demo Matric');
            const p = (JSON.parse(localStorage.getItem('cgg.progress')) || {})[me.id] || {}; const ev = (JSON.parse(localStorage.getItem('cgg.events')) || []).filter(e => e.studentId === me.id && e.roundId === 'ew3');
            return { progress: p.ew3 || null, xpEvents: ev.map(e => e.xp) }; }""")

        # ---------------- ew3 -> ew4: the way on, and the map ----------------
        ew4_checks = []
        def check4(name, ok):
            ew4_checks.append((name, ok))
            if not ok: fail(name)
        check4("ew3's end screen offers the next round", page.evaluate("""() => [...document.querySelectorAll('.ewe-end .btn')].some(b => b.textContent.includes('Volgende rondte'))"""))
        click_btn(page, ".ewe-end .btn", "▶ Volgende rondte")
        page.wait_for_selector(".ewe-play")
        check4("the way on from ew3 opens ew4", "Deel 'n hoek" in page.inner_text(".play-title"))
        page.evaluate("window.__APP__.go('ewes')")
        page.wait_for_selector(".round-card")
        check4("the map unlocks ew4 once ew3 is passed (ew3 shows ✓)", page.evaluate("""() => { const c = [...document.querySelectorAll('.round-card')];
            return c.length >= 4 && c[2].classList.contains('done') && !c[3].classList.contains('locked') && !!c[3].querySelector('.btn'); }"""))
        ew5_locked_before = page.evaluate("""() => { const c = [...document.querySelectorAll('.round-card')]; return c.length >= 5 && c[4].classList.contains('locked') && !c[4].querySelector('.btn'); }""")
        if not ew5_locked_before: fail("ew5 should be locked before ew4 is passed")
        ew6_locked_before = page.evaluate("""() => { const c = [...document.querySelectorAll('.round-card')]; return c.length >= 6 && c[5].classList.contains('locked') && !c[5].querySelector('.btn'); }""")
        if not ew6_locked_before: fail("ew6 should be locked before ew5 is passed")
        ew7_locked_before = page.evaluate("""() => { const c = [...document.querySelectorAll('.round-card')]; return c.length >= 7 && c[6].classList.contains('locked') && !c[6].querySelector('.btn'); }""")
        if not ew7_locked_before: fail("ew7 should be locked before ew6 is passed")

        # ---------------- the ew4 walk ----------------
        page.evaluate("() => { const c = [...document.querySelectorAll('.round-card')]; c[3].querySelector('.btn').click(); }")
        page.wait_for_selector(".ewe-play")
        data4 = page.evaluate("""async () => { const m = await import('./js/rounds/ewe4-deel-n-hoek.js');
            return m.round.eweQuestions.map(q => { const S = m.SKETCHES[q.id];
              return { id: q.id, sine: !!(q.write && q.write.sine), third: S.third || [], sin: S.sin || '', reason: (q.write && q.write.reason) || '',
                steps: q.steps.map(s => ({ type: s.type, chips: s.chips || [], answer: s.answer || [], star: !!s.sketchAfter,
                  options: s.options && s.options.map(o => ({ text: o.text, correct: !!o.correct, hint: o.hint || '' })), okLine: s.okLine || '' })) }; }); }""")
        CARD4_JS = r"""() => {
          const c = document.querySelector('.ewe-write'); if (!c) return null;
          const line = c.querySelector('.ewl-sine');
          const res = { sine: !!line, text: (c.querySelector('.ewe-write-text') || {}).textContent || '', fracs: c.querySelectorAll('.ewf').length };
          if (!line) return res;
          const fr = [...line.querySelectorAll('.ewf')];
          const strikes = [...line.querySelectorAll('.ewf-x')];
          res.strikes = strikes.length;
          res.strikesInsideMiddle = strikes.every(x => x.closest('.ewf') === fr[1] && !!x.closest('.ewf-n, .ewf-d'));
          res.struckText = strikes.map(x => x.textContent).join(' ');
          /* fraction rule 7: each product sits INSIDE its numerator or
             denominator: both factors and the dot in the one box, above or
             below the one bar, and the bar as wide as both */
          const last = fr[2], ln = last.querySelector(':scope > .ewf-n'), ld = last.querySelector(':scope > .ewf-d');
          res.prodTop = ln.textContent; res.prodBot = ld.textContent;
          res.dotsInside = ln.querySelectorAll('.ewf-dot').length === 1 && ld.querySelectorAll('.ewf-dot').length === 1;
          const bar = last.querySelector(':scope > .ewf-bar').getBoundingClientRect(), nr = ln.getBoundingClientRect(), dr = ld.getBoundingClientRect();
          res.prodInside = nr.bottom <= bar.top + 0.5 && dr.top >= bar.bottom - 0.5 && bar.width + 0.5 >= nr.width && bar.width + 0.5 >= dr.width
                        && nr.height < 2.2 * parseFloat(getComputedStyle(last).fontSize) && dr.height < 2.2 * parseFloat(getComputedStyle(last).fontSize);
          res.tints = [...fr[0].querySelectorAll('.ewtint')].map(x => x.className.match(/ewtint-\d/)[0].slice(7) + ':' + x.textContent.replace(/^Opp\s*Δ\s*/, ''));
          /* each "=" unit is ONE line (nothing breaks inside it) */
          res.unitsWrapped = [...line.querySelectorAll('.ewq-u')].filter(u => {
            const r = u.getBoundingClientRect(), f = u.querySelector('.ewf').getBoundingClientRect();
            return r.height > f.height + 2; }).length;
          res.rows = new Set([...line.querySelectorAll('.ewq-u')].map(u => { const r = u.getBoundingClientRect(); return Math.round((r.top + r.bottom) / 8); })).size;
          const rs = line.querySelector('.ewl-rs');
          res.reason = rs ? rs.textContent : '';
          if (rs) { const rg = document.createRange(); rg.selectNodeContents(rs);
            res.reasonLines = new Set([...rg.getClientRects()].map(r => Math.round(r.top))).size;
            const q = line.querySelector('.ewq').getBoundingClientRect(), r = rs.getBoundingClientRect();
            res.reasonBelow = r.top >= q.bottom - 1; }
          return res; }"""
        def tints_match(tmap, words):
            # words like ["2:RSC", "1:TPC"] (tint : the named Δ); tmap like ["2:CRS", "1:CPT"] (tint : sorted corners)
            norm = lambda w: w.split(":")[0] + ":" + "".join(sorted(w.split(":")[1]))
            return len(words) == 2 and sorted(map(norm, words)) == sorted(tmap)
        for qi, q in enumerate(data4):
            n = qi + 1
            P = f"ew4 Q{n}"
            lab = page.evaluate(LABELS_JS)
            label_rows.append((q["id"], lab))
            if lab is None:
                fail(f"{P}: no sketch")
                continue
            tmap = page.evaluate(TINTMAP_JS)
            for c in lab["collisions"]: fail(f"{P} sketch: {c}")
            check4(f"{P} sketch: two tinted triangles {tmap}", lab["tints"] == 2 and "?" not in "".join(tmap))
            check4(f"{P} sketch: no ∥ arrows", lab["arrows"] == 0)
            if q["sine"]:
                check4(f"{P} sketch: the arc at the shared angle, no star yet", lab["arcs"] == 1 and lab["stars"] == 0)
            else:
                check4(f"{P} sketch: no arc and no star; the dotted ⊥h (Q5)", lab["arcs"] == 0 and lab["stars"] == 0 and lab["heights"] == 1)
            for si, st in enumerate(q["steps"]):
                tag = f"{P} step {si + 1} ({st['type']})"
                k = si + 1
                if st["type"] == "build":
                    a = st["answer"]
                    ps = pad_state()
                    check4(f"{tag}: {len(a)} boxes, the glow on the first", len(ps["texts"]) == len(a) and ps["next"] == 0)
                    if si == 1:
                        words = page.evaluate("() => [...document.querySelectorAll('.ewe-step:last-child .ewpad-disp .ewtint')].map(x => x.className.match(/ewtint-\\d/)[0].slice(7) + ':' + x.textContent.replace(/^Opp\\s*Δ\\s*/, ''))")
                        check4(f"{tag}: the 'Opp Δ' words {words} carry the sketch's tints {tmap}", tints_match(tmap, words))
                    measure(page, f"{tag}: boxes empty")
                    hats(page, f"{tag}: boxes empty")
                    shot(page, f"ew4-q{n}-s{k}-a-boxes-empty.png")
                    th = q["third"]
                    if si == 1:
                        wrongs = [([th[0], a[1], a[2], a[3]], f"{th[0]} raak nie aan", f"a third side {th[0]}"),
                                  ([a[2], a[3], a[0], a[1]], "Kyk watter Δ staan bo", "the products swapped"),
                                  ([a[0], a[2], a[1], a[3]], "Bo kom net", "a mixed product")]
                        if n == 1:
                            wrongs += [([a[0], a[1], a[2], th[1]], f"{th[1]} raak nie aan", f"the other third side {th[1]}"),
                                       ([a[0], a[0], a[2], a[3]], "dieselfde stuk twee keer", "one chip twice in a product"),
                                       ([a[0], a[1], a[1], a[0]], "dieselfde stuk twee keer", "the same pair top and bottom")]
                    else:
                        wrongs = [(["½", a[1], a[2], a[3]], "doodgetrek", "a struck ½"),
                                  ([a[0], a[1], a[2], q["sin"]], "doodgetrek", f"a struck {q['sin']}"),
                                  ([a[2], a[3], a[0], a[1]], "Kyk watter Δ staan bo", "the products swapped"),
                                  ([a[0], a[2], a[1], a[3]], "Bo kom net", "a mixed product")]
                    for wi, (fill, want, name) in enumerate(wrongs):
                        clear_pad()
                        for c in fill: click_chip(page, c)
                        measure(page, f"{tag}: boxes full ({name})")
                        hats(page, f"{tag}: boxes full ({name})")
                        click_btn(page, ".ewe-step:last-child .ewkey-sub")
                        measure(page, f"{tag}: {name} + hint")
                        hint = page.inner_text(".ewe-step:last-child .ewe-hint") if seen(page, ".ewe-step:last-child .ewe-hint") else ""
                        check4(f"{tag}: {'·'.join(fill[:2])} / {'·'.join(fill[2:])} ({name}) gets its hint", want in hint)
                        hats(page, f"{tag}: {name} + hint")
                        shot(page, f"ew4-q{n}-s{k}-b{wi + 1}-wrong.png")
                    clear_pad()
                    for c in a: click_chip(page, c)
                    measure(page, f"{tag}: boxes full (right)")
                    hats(page, f"{tag}: boxes full (right)")
                    shot(page, f"ew4-q{n}-s{k}-c-boxes-full.png")
                    click_btn(page, ".ewe-step:last-child .ewkey-sub")
                    measure(page, f"{tag}: marked right")
                    hats(page, f"{tag}: marked right")
                    check4(f"{tag}: right answer {'·'.join(a[:2])} / {'·'.join(a[2:])} accepted", has(page, f".ewe-steps > .ewe-step:nth-child({k}) .ewpad.is-locked"))
                    fbf = page.evaluate("(k) => document.querySelectorAll(`.ewe-steps > .ewe-step:nth-child(${k}) .ewe-fb.good .ewf`).length", k)
                    check4(f"{tag}: the ✓ line is the finished frame ({fbf} fractions)", fbf == (2 if si == 1 else 1))
                else:
                    measure(page, f"{tag}: options")
                    h = hats(page, f"{tag}: options")
                    if st["star"]:
                        check4(f"{tag}: the {len(st['options'])} hatted options measured ({h['where'].get('option', 0)} hats on options, smallest gap {h['minGap']}px)", h["where"].get("option", 0) >= len(st["options"]))
                    shot(page, f"ew4-q{n}-s{k}-d-options.png")
                    for o in [o for o in st["options"] if not o["correct"]]:
                        click_btn(page, ".ewe-step:last-child .ewe-opt", o["text"])
                        measure(page, f"{tag}: wrong pick {o['text'][:24]}")
                        hint = page.inner_text(".ewe-step:last-child .ewe-hint") if seen(page, ".ewe-step:last-child .ewe-hint") else ""
                        check4(f"{tag}: '{o['text']}' shows its own hint", bool(o["hint"]) and o["hint"] in hint)
                        hats(page, f"{tag}: wrong pick {o['text'][:24]} + hint")
                    shot(page, f"ew4-q{n}-s{k}-e-wrong-pick.png")
                    if st["star"]:
                        check4(f"{tag}: no star after the wrong picks", page.evaluate(LABELS_JS)["stars"] == 0)
                    right = next(o["text"] for o in st["options"] if o["correct"])
                    click_btn(page, ".ewe-step:last-child .ewe-opt", right)
                    measure(page, f"{tag}: right pick")
                    hats(page, f"{tag}: right pick")
                    fsel = f".ewe-steps > .ewe-step:nth-child({k}) .ewe-fb"
                    fb = page.inner_text(fsel) if seen(page, fsel) else ""
                    check4(f"{tag}: '{right}' is right and ends on its takeaway", st["okLine"] in fb)
                    if st["star"]:
                        lab1 = page.evaluate(LABELS_JS)
                        label_rows.append((q["id"] + " +star", lab1))
                        for c in lab1["collisions"]: fail(f"{P} sketch with the star: {c}")
                        check4(f"{tag}: her star appears at the shared angle, the arc stays", lab1["stars"] == 1 and lab1["arcs"] == 1)
                        check4(f"{tag}: no label moved when the star appeared", lab1["at"] == lab["at"])
                        shot(page, f"ew4-q{n}-s{k}-f-star.png")
            card = page.evaluate(CARD4_JS)
            if q["sine"]:
                check4(f"{P}: the star stays to the end of the question", page.evaluate(LABELS_JS)["stars"] == 1)
                ok = (bool(card) and card["sine"] and card["fracs"] == 3 and card["strikes"] == 4 and card["strikesInsideMiddle"]
                      and card["struckText"] == f"½ {q['sin']} ½ {q['sin']}" and card["dotsInside"] and card["prodInside"]
                      and card["unitsWrapped"] == 0 and card["reason"] == f"({q['reason']})" and card["reasonLines"] == 1
                      and tints_match(tmap, card["tints"]))
                check4(f"{P}: card = three fractions, ½ and {q['sin']} struck inside the middle one, {card and card.get('prodTop')} over {card and card.get('prodBot')} inside the last, chain on {card and card.get('rows')} row(s), reason whole{' (moved down)' if card and card.get('reasonBelow') else ''}", ok)
                if not ok: print("   card:", card)
            else:
                check4(f"{P}: card = the Nee takeaway, no fraction", bool(card) and not card["sine"] and card["fracs"] == 0 and "vorige rondte" in card["text"])
            measure(page, f"{P}: Só skryf jy dit card")
            hats(page, f"{P}: Só skryf jy dit card")
            page.evaluate("document.querySelector('.ewe-write').scrollIntoView()")
            shot(page, f"ew4-q{n}-g-card.png")
            click_btn(page, ".ewe-next")
            page.wait_for_timeout(250)
        page.wait_for_selector(".ewe-end", timeout=8000)
        measure(page, "ew4 end of round")
        hats(page, "ew4 end of round")
        check4("ew4 end screen: the takeaway carries the three-fraction sine chain",
               page.evaluate("() => { const l = document.querySelector('.ewe-end .ewe-takeaway .ewl-sine'); return !!l && l.querySelectorAll('.ewf').length === 3 && l.querySelectorAll('.ewf-x').length === 4; }"))
        shot(page, "ew4-end-of-round.png")
        saved4 = page.evaluate("""() => { const s = JSON.parse(localStorage.getItem('cgg.students')); const me = Object.values(s).find(x => x.display_name === 'Demo Matric');
            const p = (JSON.parse(localStorage.getItem('cgg.progress')) || {})[me.id] || {}; const ev = (JSON.parse(localStorage.getItem('cgg.events')) || []).filter(e => e.studentId === me.id && e.roundId === 'ew4');
            return { progress: p.ew4 || null, xpEvents: ev.map(e => e.xp) }; }""")
        # ---------------- ew4 -> ew5: the way on, and the map ----------------
        ew5_checks = []
        ew5_grid = []       # per step 2: kind, widest fraction, narrowest cell content, font
        ew5_moved = []      # per question: labels placed afresh when the mark appears
        def check5(name, ok):
            ew5_checks.append((name, ok))
            if not ok: fail(name)
        check5("ew4's end screen offers the next round", page.evaluate("""() => [...document.querySelectorAll('.ewe-end .btn')].some(b => b.textContent.includes('Volgende rondte'))"""))
        click_btn(page, ".ewe-end .btn", "▶ Volgende rondte")
        page.wait_for_selector(".ewe-play")
        check5("the way on from ew4 opens ew5", "Watter een is dit?" in page.inner_text(".play-title"))
        page.evaluate("window.__APP__.go('ewes')")
        page.wait_for_selector(".round-card")
        check5("the map unlocks ew5 once ew4 is passed (ew4 shows ✓)", page.evaluate("""() => { const c = [...document.querySelectorAll('.round-card')];
            return c.length >= 5 && c[3].classList.contains('done') && !c[4].classList.contains('locked') && !!c[4].querySelector('.btn'); }"""))

        # ---------------- the ew5 walk: two picks per question, no pad ----------------
        page.evaluate("() => { const c = [...document.querySelectorAll('.round-card')]; c[4].querySelector('.btn').click(); }")
        page.wait_for_selector(".ewe-play")
        data5 = page.evaluate("""async () => { const m = await import('./js/rounds/ewe5-watter-een.js'); const core = await import('./js/ewe-core.js');
            return m.round.eweQuestions.map(q => { const S = m.SKETCHES[q.id];
              return { id: q.id, kind: S.sketch.height ? 'HEIGHT' : 'ANGLE', sin: S.sin || '', reason: (q.write && q.write.reason) || '', tip: (q.write && q.write.tip) || '',
                tris: S.tris, apex: S.apex || '', names: S.names || {}, corner: S.corner || '', hatV: S.corner ? core.hat(S.corner) : '', top: S.top || [], bot: S.bot || [], third: S.third || [],
                steps: q.steps.map(s => ({ type: s.type, star: !!s.sketchAfter, lead: !!s.lead, prompt: s.prompt || '',
                  options: s.options.map(o => ({ text: o.text, sub: o.sub || '', frac: !!o.frac, correct: !!o.correct, hint: o.hint || '' })), okLine: s.okLine || '' })) }; }); }""")
        # step 1: the two tools side by side, each name and its formula line whole
        PAIR_JS = r"""() => {
          const st = document.querySelector('.ewe-step:last-child');
          const bs = [...st.querySelectorAll('.ewe-opt')];
          const vw = document.documentElement.clientWidth;
          const inner = b => { const r = b.getBoundingClientRect(), c = getComputedStyle(b);
            return { l: r.left + parseFloat(c.borderLeftWidth), r: r.right - parseFloat(c.borderRightWidth), t: r.top + parseFloat(c.borderTopWidth), b: r.bottom - parseFloat(c.borderBottomWidth) }; };
          return bs.map(b => { const i = inner(b), r = b.getBoundingClientRect();
            const parts = [...b.querySelectorAll('.ewe-opt-name, .ewe-opt-sub')].map(e => { const q = e.getBoundingClientRect(), cs = getComputedStyle(e);
              let lh = parseFloat(cs.lineHeight); if (!(lh > 0)) lh = 1.3 * parseFloat(cs.fontSize);
              const rg = document.createRange(); rg.selectNodeContents(e);
              return { cls: e.className, text: e.textContent, inside: q.left >= i.l - 0.5 && q.right <= i.r + 0.5 && q.top >= i.t - 0.5 && q.bottom <= i.b + 0.5,
                       clipped: e.scrollWidth > e.clientWidth + 1, lines: new Set([...rg.getClientRects()].map(x => Math.round(x.top))).size,
                       font: parseFloat(cs.fontSize) }; });
            return { text: b.dataset.opt || '', top: Math.round(r.top), left: r.left, right: r.right, onScreen: r.left >= -0.5 && r.right <= vw + 0.5, parts }; }); }"""
        # step 2: the lead line and the four first-line options
        LEAD_JS = r"""(k) => {
          const st = document.querySelector(`.ewe-steps > .ewe-step:nth-child(${k})`);
          const lead = st.querySelector('.ewe-lead');
          if (!lead) return null;
          const fr = [...lead.querySelectorAll('.ewf')];
          return { h: Math.round(lead.getBoundingClientRect().height * 10) / 10, fracs: fr.length, slots: lead.querySelectorAll('.ewslot').length, glow: lead.querySelectorAll('.ewslot.is-next').length,
                   words: [...lead.querySelectorAll('.ewtint')].map(x => x.className.match(/ewtint-\d/)[0].slice(7) + ':' + x.textContent.replace(/^Opp\s*Δ\s*/, '')),
                   second: fr[1] ? fr[1].textContent.replace(/\s+/g, '') : '' }; }"""
        FRACOPTS_JS = r"""(k) => {
          const st = document.querySelector(`.ewe-steps > .ewe-step:nth-child(${k})`);
          const vw = document.documentElement.clientWidth;
          return [...st.querySelectorAll('.ewe-opt')].map(b => { const r = b.getBoundingClientRect(), c = getComputedStyle(b);
            const i = { l: r.left + parseFloat(c.borderLeftWidth), r: r.right - parseFloat(c.borderRightWidth), t: r.top + parseFloat(c.borderTopWidth), b: r.bottom - parseFloat(c.borderBottomWidth) };
            const f = [...b.querySelectorAll('.ewf')];
            const q = f[0] ? f[0].getBoundingClientRect() : null;
            const cl = i.l + parseFloat(c.paddingLeft), cr = i.r - parseFloat(c.paddingRight);
            return { label: b.getAttribute('aria-label') || '', fracs: f.length, text: f[0] ? f[0].textContent.replace(/\s+/g, '') : '',
                     top: Math.round(r.top), left: Math.round(r.left), cw: Math.round(cr - cl), fitPad: !!q && q.left >= cl - 0.5 && q.right <= cr + 0.5,
                     font: f[0] ? parseFloat(getComputedStyle(f[0]).fontSize) : 0, grid: b.parentElement.classList.contains('ewe-grid'),
                     inside: !!q && q.left >= i.l - 0.5 && q.right <= i.r + 0.5 && q.top >= i.t - 0.5 && q.bottom <= i.b + 0.5,
                     onScreen: r.left >= -0.5 && r.right <= vw + 0.5, h: Math.round(r.height), w: Math.round(r.width), fw: q ? Math.round(q.width) : 0 }; }); }"""
        # step 2 (her ruling 2026-10-02): what is LEFT after the cross-out, no
        # ½, no ⊥h, no sin. The expected four options, their hints and the
        # ✓ line, built here from the sketch's own letters (the brief's
        # wording), not read back from the round file.
        PROMPT5 = "Wat bly oor nadat jy doodgetrek het?"
        NBDOT = " · "
        def expect5(q):
            tris = q["tris"]
            if q["kind"] == "HEIGHT":
                A, nm = q["apex"], q["names"]
                base = lambda t: next(b for b in (nm["BC"], nm["CD"]) if all(k in t for k in b))
                b1, b2 = base(tris[0]), base(tris[1])
                s1, s2 = (A + b1[0], A + b1[1]), (A + b2[0], A + b2[1])
                opts = {
                    f"{b1} oor {b2}": None,
                    f"{s1[0]} · {s1[1]} oor {s2[0]} · {s2[1]}": "Produkte is die HOEK-gereedskap se antwoord. Hierdie Δe deel 'n HOOGTE, dus bly net die basisse oor.",
                    f"{b2} oor {b1}": f"Kyk watter Δ staan bo. Δ {tris[0]} se basis {b1} kom bo.",
                    f"{nm['AC']} oor {b2}": f"{nm['AC']} is die sy wat hulle DEEL. Dit is nie 'n basis nie. Die basisse lê op die lyn {nm['BD']}.",
                }
                ok = f"Die basisse bly oor: {b1} oor {b2}."
            else:
                V, H, (t0, t1), (u0, u1) = q["corner"], q["hatV"], q["top"], q["bot"]
                third = lambda t: next(x for x in q["third"] if all(k in t for k in x))
                d1, d2 = third(tris[0]), third(tris[1])
                opts = {
                    f"{t0} · {t1} oor {u0} · {u1}": None,
                    f"{d1} oor {d2}": f"Een sy oor een sy is die HOOGTE-gereedskap se antwoord. Hierdie Δe deel 'n HOEK, dus bly die produkte van die twee sye by {H} oor.",
                    f"{u0} · {u1} oor {t0} · {t1}": "Kyk watter Δ staan bo. Daardie Δ se twee sye kom bo.",
                    f"{t0} · {d1} oor {u0} · {u1}": f"{d1} raak nie aan {H} nie. Net die twee sye wat by {V} bymekaarkom, bly oor.",
                }
                ok = f"Die produkte bly oor: {t0}{NBDOT}{t1} oor {u0}{NBDOT}{u1}."
            return opts, ok
        for qi, q in enumerate(data5):
            n = qi + 1
            P = f"ew5 Q{n}"
            angle = q["kind"] == "ANGLE"
            lab = page.evaluate(LABELS_JS)
            label_rows.append((q["id"] + " bare", lab))
            if lab is None:
                fail(f"{P}: no sketch")
                continue
            tmap = page.evaluate(TINTMAP_JS)
            for c in lab["collisions"]: fail(f"{P} sketch: {c}")
            check5(f"{P} sketch: two tinted triangles {tmap}, no ∥ arrows", lab["tints"] == 2 and "?" not in "".join(tmap) and lab["arrows"] == 0)
            BARE = lambda L: L["heights"] == 0 and L["boxes"] == 0 and L["hlabel"] == 0 and L["arcs"] == 0 and L["stars"] == 0
            if angle:
                AFTER = lambda L: L["arcs"] == 1 and L["stars"] == 1 and L["heights"] == 0 and L["boxes"] == 0 and L["hlabel"] == 0
            else:
                AFTER = lambda L: L["heights"] == 1 and L["dotted"] and L["boxes"] == 1 and L["hlabel"] == 1 and L["arcs"] == 0 and L["stars"] == 0
            check5(f"{P} sketch before step 1 ({q['kind']} kind) is BARE: points, lines, {lab['labels']} labels and the two tints only; no ⊥h, no right-angle box, no arc, no star; {len(lab['collisions'])} label collisions",
                   BARE(lab) and not lab["collisions"])
            for si, st in enumerate(q["steps"]):
                k = si + 1
                tag = f"{P} step {k}"
                right = next(o for o in st["options"] if o["correct"])
                wrongs = [o for o in st["options"] if not o["correct"]]
                if si == 0:
                    pr = page.evaluate(PAIR_JS)
                    check5(f"{tag}: two tools side by side in their natural order ({' | '.join(o['text'] for o in pr)})",
                           [o["text"] for o in pr] == ["Deel 'n sy", "Deel 'n hoek"] and pr[0]["top"] == pr[1]["top"] and pr[0]["right"] <= pr[1]["left"] and all(o["onScreen"] for o in pr))
                    parts_ok = all(len(o["parts"]) == 2 and all(p["inside"] and not p["clipped"] and p["lines"] == 1 for p in o["parts"]) and o["parts"][1]["font"] < o["parts"][0]["font"] for o in pr)
                    check5(f"{tag}: each tool shows its name and, smaller, its formula ({'; '.join(o['parts'][1]['text'] for o in pr if len(o['parts']) == 2)}), each on ONE line, inside its button, nothing clipped", parts_ok)
                    if not parts_ok: print("   tools:", pr)
                else:
                    ld = page.evaluate(LEAD_JS, k)
                    check5(f"{tag}: the lead line, one fraction 'Opp Δ' over 'Opp Δ', '=' and ONE glowing box, {ld and ld['h']}px high (at most 64)", bool(ld) and ld["fracs"] == 1 and ld["slots"] == 1 and ld["glow"] == 1 and ld["h"] <= 64)
                    check5(f"{tag}: the lead's 'Opp Δ' words {ld and ld['words']} carry the sketch's tints {tmap}", bool(ld) and tints_match(tmap, ld["words"]))
                    fo = page.evaluate(FRACOPTS_JS, k)
                    fo_ok = len(fo) == 4 and all(o["fracs"] == 1 and o["inside"] and o["onScreen"] and o["label"] for o in fo)
                    check5(f"{tag}: four options, each ONE stacked fraction inside its button with its words as aria-label (widths {', '.join(str(o['fw']) for o in fo)}px)", fo_ok)
                    if not fo_ok: print("   options:", fo)
                    tops, lefts = sorted({o["top"] for o in fo}), sorted({o["left"] for o in fo})
                    grid_ok = (len(fo) == 4 and all(o["grid"] for o in fo) and len(tops) == 2 and len(lefts) == 2
                               and all(sum(1 for o in fo if o["top"] == t) == 2 for t in tops) and all(o["fitPad"] for o in fo))
                    fonts = sorted({o["font"] for o in fo})
                    ew5_grid.append((tag, q["kind"], max(o["fw"] for o in fo), min(o["cw"] for o in fo), fonts))
                    check5(f"{tag}: a 2 x 2 grid, each fraction inside its button's padding (widest {max(o['fw'] for o in fo)}px in {min(o['cw'] for o in fo)}px, font {', '.join(str(x) for x in fonts)}px), no fraction broken",
                           grid_ok)
                    if not grid_ok: print("   grid:", fo)
                    check5(f"{tag}: the options are the data's four, in some order", sorted(o["label"] for o in fo) == sorted(o["text"] for o in st["options"]))
                    want_opts, want_ok = expect5(q)
                    got_opts = {o["text"]: (None if o["correct"] else o["hint"]) for o in st["options"]}
                    check5(f"{tag}: the four leftovers, their hints and the ✓ line are the ruling's ({' | '.join(want_opts)})", got_opts == want_opts and st["okLine"] == want_ok)
                    if got_opts != want_opts or st["okLine"] != want_ok: print("   want:", want_opts, repr(want_ok), "\n   got: ", got_opts, repr(st["okLine"]))
                    shown_prompt = page.inner_text(".ewe-step:last-child .ewe-prompt").replace(" ", " ").strip()
                    check5(f"{tag}: the prompt reads '{PROMPT5}'", st["prompt"] == PROMPT5 and shown_prompt == PROMPT5)
                    check5(f"{tag}: nothing struck is drawn on the options (no ½, no ⊥h, no sin): {', '.join(o['text'] for o in fo)}",
                           all(not any(x in o["text"] + o["label"] for x in ("½", "⊥", "sin")) for o in fo))
                measure(page, f"{tag}: options")
                h = hats(page, f"{tag}: options")
                if si == 1:
                    # a hat in a numerator counts as "option", one in a denominator as "under a fraction bar";
                    # the leftovers carry no sin, so no hat (her ruling 2026-10-02)
                    nh = h["where"].get("option", 0) + h["where"].get("under a fraction bar", 0)
                    check5(f"{tag}: no angle hat on the options, the sin is gone ({nh} found)", nh == 0)
                shot(page, f"ew5-q{n}-s{k}-a-options.png")
                for wi, o in enumerate(wrongs):
                    click_btn(page, ".ewe-step:last-child .ewe-opt", o["text"])
                    measure(page, f"{tag}: wrong pick {wi + 1}")
                    hats(page, f"{tag}: wrong pick {wi + 1} + hint")
                    hint = page.inner_text(".ewe-step:last-child .ewe-hint") if seen(page, ".ewe-step:last-child .ewe-hint") else ""
                    check5(f"{tag}: the wrong pick '{o['text']}' shows its own hint", bool(o["hint"]) and o["hint"] in hint)
                    shot(page, f"ew5-q{n}-s{k}-b{wi + 1}-wrong.png")
                if si == 0:
                    check5(f"{tag}: after the wrong tool the sketch is still bare", BARE(page.evaluate(LABELS_JS)))
                click_btn(page, ".ewe-step:last-child .ewe-opt", right["text"])
                measure(page, f"{tag}: right pick")
                hats(page, f"{tag}: right pick")
                fsel = f".ewe-steps > .ewe-step:nth-child({k}) .ewe-fb"
                fb = page.inner_text(fsel) if seen(page, fsel) else ""
                check5(f"{tag}: '{right['text'][:40]}' is right and ends on its takeaway", bool(st["okLine"]) and st["okLine"] in fb)
                kept = page.evaluate("""(k) => [...document.querySelectorAll(`.ewe-steps > .ewe-step:nth-child(${k}) .ewe-opt`)].filter(e => getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().height > 0)
                    .map(e => (e.dataset.opt || e.getAttribute('aria-label') || '') + (e.classList.contains('is-correct') ? '+' : ''))""", k)
                check5(f"{tag}: Fold 2, only the chosen option stays, green", kept == [right["text"] + "+"])
                if si == 0:
                    lab1 = page.evaluate(LABELS_JS)
                    label_rows.append((q["id"] + (" +arc+star" if angle else " +height"), lab1))
                    for c in lab1["collisions"]: fail(f"{P} sketch after the right tool: {c}")
                    moved = sum(1 for a, b in zip(lab["at"], lab1["at"]) if a != b)
                    ew5_moved.append((P, q["kind"], moved, len(lab["at"])))
                    check5(f"{tag}: after the right tool the sketch shows exactly its mark: " + ("the arc and her star at the shared angle, no ⊥h" if angle else "the dotted ⊥h, its right-angle box and its label, no arc, no star")
                           + f"; {len(lab1['collisions'])} label collisions", AFTER(lab1) and not lab1["collisions"])
                    fbl = page.evaluate("""(k) => { const f = document.querySelector(`.ewe-steps > .ewe-step:nth-child(${k}) .ewe-fb`); const rg = document.createRange(); rg.selectNodeContents(f); return new Set([...rg.getClientRects()].map(x => Math.round(x.top))).size; }""", k)
                    check5(f"{tag}: its ✓ line is on {fbl} lines at 375 px (at most 2)", fbl <= 2)
                    shot(page, f"ew5-q{n}-s{k}-c-mark.png")
                else:
                    ld = page.evaluate(LEAD_JS, k)
                    want = next((o["text"] for o in page.evaluate(FRACOPTS_JS, k) if o["label"] == right["text"]), None)
                    chosen = page.evaluate("""([k, t]) => { const b = [...document.querySelectorAll(`.ewe-steps > .ewe-step:nth-child(${k}) .ewe-opt`)].find(e => e.getAttribute('aria-label') === t); return b ? b.querySelector('.ewf').textContent.replace(/\\s+/g, '') : ''; }""", [k, right["text"]])
                    check5(f"{tag}: the lead line is filled: two fractions, no box, the second the chosen leftover", bool(ld) and ld["fracs"] == 2 and ld["slots"] == 0 and ld["second"] == chosen and bool(chosen))
                    shot(page, f"ew5-q{n}-s{k}-c-lead-filled.png")
            check5(f"{P}: the tool's mark stays to the end of the question (the card is up)", AFTER(page.evaluate(LABELS_JS)))
            if angle:
                card = page.evaluate(CARD4_JS)
                ok = (bool(card) and card["sine"] and card["fracs"] == 3 and card["strikes"] == 4 and card["strikesInsideMiddle"]
                      and card["struckText"] == f"½ {q['sin']} ½ {q['sin']}" and card["dotsInside"] and card["prodInside"]
                      and card["unitsWrapped"] == 0 and card["reason"] == f"({q['reason']})" and card["reasonLines"] == 1 and tints_match(tmap, card["tints"]))
                check5(f"{P}: card = the sine chain, ½ and {q['sin']} struck inside the middle one, {card and card.get('prodTop')} over {card and card.get('prodBot')} inside the last, chain on {card and card.get('rows')} row(s), reason '{q['reason']}' whole{' (moved down)' if card and card.get('reasonBelow') else ''}", ok)
            else:
                card = page.evaluate(CARD3_JS)
                ok = (bool(card) and card["area"] and card["fracs"] == 3 and card["strikes"] == 4 and card["strikesInsideMiddle"]
                      and card["struckText"] == "½ ⊥h ½ ⊥h" and card["unitsWrapped"] == 0
                      and card["reason"] == f"({q['reason']})" and card["reasonLines"] == 1 and len(card["tints"]) == 2)
                check5(f"{P}: card = the area chain, ½ and ⊥h struck inside the middle one, chain on {card and card.get('rows')} row(s), reason '{q['reason']}' whole{' (moved down)' if card and card.get('reasonBelow') else ''}", ok)
            if not ok: print("   card:", card)
            tip = page.inner_text(".ewe-write .ewe-write-tip") if seen(page, ".ewe-write .ewe-write-tip") else ""
            check5(f"{P}: the card's tip '{q['tip']}'", q["tip"] == tip.strip())
            measure(page, f"{P}: Só skryf jy dit card")
            hats(page, f"{P}: Só skryf jy dit card")
            page.evaluate("document.querySelector('.ewe-write').scrollIntoView()")
            shot(page, f"ew5-q{n}-d-card.png")
            click_btn(page, ".ewe-next")
            page.wait_for_timeout(250)
        page.wait_for_selector(".ewe-end", timeout=8000)
        measure(page, "ew5 end of round")
        hats(page, "ew5 end of round")
        check5("ew5 end screen: the takeaway names both tools and carries Q1's three-fraction area chain",
               page.evaluate("() => { const t = document.querySelector('.ewe-end .ewe-takeaway'); const l = t && t.querySelector('.ewl-area'); return !!l && l.querySelectorAll('.ewf').length === 3 && l.querySelectorAll('.ewf-x').length === 4 && /HOOGTE of 'n HOEK/.test(t.textContent) && /produkte bly oor/.test(t.textContent); }"))
        shot(page, "ew5-end-of-round.png")
        saved5 = page.evaluate("""() => { const s = JSON.parse(localStorage.getItem('cgg.students')); const me = Object.values(s).find(x => x.display_name === 'Demo Matric');
            const p = (JSON.parse(localStorage.getItem('cgg.progress')) || {})[me.id] || {}; const ev = (JSON.parse(localStorage.getItem('cgg.events')) || []).filter(e => e.studentId === me.id && e.roundId === 'ew5');
            return { progress: p.ew5 || null, xpEvents: ev.map(e => e.xp) }; }""")

        # ---------------- ew5 -> ew6: the way on, and the map ----------------
        ew6_checks = []
        ew6_cards = []
        ew6_still = []      # per sketch change: labels moved / labels total
        ew6_arcs = []       # per sketch state: the tightest arc-label clearance (screen px) and each arc's bow
        def check6(name, ok):
            ew6_checks.append((name, ok))
            if not ok: fail(name)
        check6("ew5's end screen offers the next round", page.evaluate("""() => [...document.querySelectorAll('.ewe-end .btn')].some(b => b.textContent.includes('Volgende rondte'))"""))
        click_btn(page, ".ewe-end .btn", "▶ Volgende rondte")
        page.wait_for_selector(".ewe-play")
        check6("the way on from ew5 opens ew6 'Die trapesium'", "Die trapesium" in page.inner_text(".play-title"))
        page.evaluate("window.__APP__.go('ewes')")
        page.wait_for_selector(".round-card")
        check6("the map unlocks ew6 once ew5 is passed (ew5 ✓), and ew7 is still locked", page.evaluate("""() => { const c = [...document.querySelectorAll('.round-card')];
            return c.length === 7 && c[4].classList.contains('done') && !c[5].classList.contains('locked') && !!c[5].querySelector('.btn')
                   && c[6].classList.contains('locked') && !c[6].querySelector('.btn'); }"""))
        measure(page, "ew6 on the map", ".view")

        # ---------------- the ew6 walk: the big Δ minus the small Δ ----------------
        page.evaluate("() => { const c = [...document.querySelectorAll('.round-card')]; c[5].querySelector('.btn').click(); }")
        page.wait_for_selector(".ewe-play")
        data6 = page.evaluate("""async () => { const m = await import('./js/rounds/ewe6-die-trapesium.js'); const core = await import('./js/ewe-core.js');
            const pl = s => String(s).replace(/\\u00A0/g, ' ');
            const word = c => (typeof c === 'object' ? c.n.join('') + c.d.join('') : c);
            return m.round.eweQuestions.map(q => { const F = q.fig;
              const arcsOf = sk => (sk.sideArcs || []).filter(a => !a.hidden).map(a => a.label).sort();
              return { id: q.id, kind: q.given.kind, big: [F.corner, ...F.ends], small: [F.corner, ...F.cuts], trap: [F.cuts[0], ...F.ends, F.cuts[1]],
                arcs0: arcsOf(q.sketch), arcs1: arcsOf(q.sketches.shown), tip: pl(q.write.tip), full: !!q.write.trap.side,
                steps: q.steps.map((s, si) => {
                  /* one fill per wrong reason the marker can give (found by asking the marker over every fill) */
                  const fills = {};
                  if (s.type === 'build') {
                    const n = s.answer.length; let all = [[]];
                    for (let k = 0; k < n; k++) all = all.flatMap(f => s.chips.map(c => [...f, c]));
                    for (const f of all) { const v = core.markRatio(f, s.spec); if (!v.ok && !fills[v.why]) fills[v.why] = f; }
                  }
                  return { type: s.type, role: s.role || '', chips: s.chips || [], answer: s.answer || [], prompt: pl(s.prompt), after: !!s.sketchAfter,
                    given: s.given ? { first: !!s.given.first, text: pl(s.given.text || ''), fracs: s.given.line.filter(u => typeof u === 'object' && !Array.isArray(u)).length } : null,
                    okLine: Array.isArray(s.okLine) ? s.okLine.map(p => pl(word(p))).join('') : pl(s.okLine || ''),
                    okFracs: Array.isArray(s.okLine) ? s.okLine.filter(p => typeof p === 'object').length : 0,
                    hints: Object.fromEntries(Object.entries(s.hints || {}).map(([k, v]) => [k, pl(v)])), fills,
                    options: (s.options || []).map(o => ({ text: o.text, correct: !!o.correct, hint: pl(o.hint || ''), is: o.is || '' })) }; }) }; }); }""")
        # Fix 5 (foreman review 2026-10-03): every sum or difference in an ew6
        # string ("3 + 2 = 5", "25k − 9k") is glued with no-break spaces, and
        # every tip, takeaway, blurb and string okLine ends on two glued words
        glue6 = page.evaluate(r"""async () => { const m = await import('./js/rounds/ewe6-die-trapesium.js'); const r = m.round;
            const all = [], tails = [];
            const add = (s, tail) => { if (typeof s !== 'string') return; all.push(s); if (tail) tails.push(s); };
            add(r.blurb.af, true); add(r.takeaway.text, true);
            r.eweQuestions.forEach(q => { add(q.intro); add(q.write.tip, true);
              q.steps.forEach(s => { add(s.prompt); Object.values(s.hints || {}).forEach(h => add(h));
                if (Array.isArray(s.okLine)) s.okLine.forEach(p => add(p)); else add(s.okLine, true);
                (s.options || []).forEach(o => { add(o.text); add(o.hint); }); }); });
            const loose = all.filter(s => /[\dk] [+−=] \d|[\dk] [+−=] |[\dk] [+−=] /.test(s));
            const orphan = tails.filter(s => !/ \S+$/.test(s));
            return { n: all.length, tails: tails.length, loose, orphan }; }""")
        check6(f"ew6 text: {glue6['n']} strings, no sum or difference with a breakable space ({len(glue6['loose'])} loose), the last two words of {glue6['tails']} tips/takeaways/okLines glued ({len(glue6['orphan'])} loose)",
               not glue6["loose"] and not glue6["orphan"])
        for s in glue6["loose"] + glue6["orphan"]: print("   loose:", s)
        # her side arcs and their labels, the tints as polygons (four corners
        # for the trapezium), every label outside the whole Δ
        ARCS6_JS = r"""(big) => {
          const svg = document.querySelector('svg.ewe-sketch');
          const vb = svg.viewBox.baseVal;
          const dots = [...svg.querySelectorAll('circle')];
          const texts = [...svg.querySelectorAll('text.pl')];
          const plabs = texts.filter(t => !t.classList.contains('ewe-al')), alabs = texts.filter(t => t.classList.contains('ewe-al'));
          const at = {}; dots.forEach((c, i) => { at[plabs[i].textContent] = { x: +c.getAttribute('cx'), y: +c.getAttribute('cy') }; });
          const box = t => { const b = t.getBBox(); return { x0: b.x, y0: b.y, x1: b.x + b.width, y1: b.y + b.height }; };
          const arcs = [...svg.querySelectorAll('path.ewe-sarc')].map(p => { const L = p.getTotalLength();
            return { lvl: p.classList.contains('ewe-sarc-2') ? 2 : 1, pts: Array.from({ length: 121 }, (_, i) => p.getPointAtLength(L * i / 120)) }; });
          const lines = [...svg.querySelectorAll('line.ln')].map(l => ['x1','y1','x2','y2'].map(k => +l.getAttribute(k)));
          const segD = (x, y, [x1, y1, x2, y2]) => { const dx = x2 - x1, dy = y2 - y1, L2 = dx * dx + dy * dy; let t = ((x - x1) * dx + (y - y1) * dy) / L2; t = Math.max(0, Math.min(1, t)); return Math.hypot(x - x1 - t * dx, y - y1 - t * dy); };
          const out = { arcs: arcs.length, lvl2: arcs.filter(a => a.lvl === 2).length, alabels: alabs.map(t => t.textContent).sort(), collisions: [],
                        tints: [...svg.querySelectorAll('polygon.ewe-tint')].map(p => { const k = p.getAttribute('class').match(/ewe-tint-(\d)/)[1];
                          const pts = p.getAttribute('points').split(' ').map(s => s.split(',').map(Number));
                          return k + ':' + pts.map(([x, y]) => Object.keys(at).find(n => Math.abs(at[n].x - x) < 0.2 && Math.abs(at[n].y - y) < 0.2) || '?').join(''); }),
                        at: plabs.map(t => { const b = box(t); return [t.textContent, Math.round(b.x0 * 10) / 10, Math.round(b.y0 * 10) / 10]; }), minGap: null };
          const near = (q, ends) => ends.some(e => Math.hypot(q.x - e.x, q.y - e.y) < 6);
          arcs.forEach((a, i) => {
            const ends = [a.pts[0], a.pts[a.pts.length - 1]];
            a.pts.forEach(q => { if (q.x < 0 || q.y < 0 || q.x > vb.width || q.y > vb.height) out.collisions.push('an arc leaves the sketch'); });
            /* an arc starts and ends ON its own side, so only the OTHER lines count */
            const others = lines.filter(l => !(segD(ends[0].x, ends[0].y, l) < 1 && segD(ends[1].x, ends[1].y, l) < 1));
            if (a.pts.some(q => !near(q, ends) && others.some(l => segD(q.x, q.y, l) < 1.5))) out.collisions.push(`arc ${i + 1} touches a line`);
            arcs.forEach((b, j) => { if (j <= i) return;
              const bends = [b.pts[0], b.pts[b.pts.length - 1]];
              if (a.pts.some(q => !near(q, ends.concat(bends)) && b.pts.some(r => Math.hypot(q.x - r.x, q.y - r.y) < 2))) out.collisions.push(`arcs ${i + 1} and ${j + 1} touch`); });
          });
          texts.forEach(t => { const r = box(t);
            arcs.forEach((a, i) => { if (a.pts.some(q => q.x > r.x0 - 0.5 && q.x < r.x1 + 0.5 && q.y > r.y0 - 0.5 && q.y < r.y1 + 0.5)) out.collisions.push(`${t.textContent} touches arc ${i + 1}`);
              const g = Math.min(...a.pts.map(q => Math.max(r.x0 - q.x, q.x - r.x1, r.y0 - q.y, q.y - r.y1)));
              out.minGap = out.minGap == null ? g : Math.min(out.minGap, g); }); });
          /* outside the whole Δ (and so outside every tint): every corner and the centre of every label box */
          const [A, B, C] = big.map(k => at[k]);
          const inside = (x, y) => { const s1 = (B.x - A.x) * (y - A.y) - (B.y - A.y) * (x - A.x), s2 = (C.x - B.x) * (y - B.y) - (C.y - B.y) * (x - B.x), s3 = (A.x - C.x) * (y - C.y) - (A.y - C.y) * (x - C.x);
            return (s1 > 0 && s2 > 0 && s3 > 0) || (s1 < 0 && s2 < 0 && s3 < 0); };
          texts.forEach(t => { const r = box(t); if ([[r.x0, r.y0], [r.x1, r.y0], [r.x0, r.y1], [r.x1, r.y1], [(r.x0 + r.x1) / 2, (r.y0 + r.y1) / 2]].some(([x, y]) => inside(x, y))) out.collisions.push(`${t.textContent} sits inside the Δ`); });
          out.minGap = out.minGap == null ? null : Math.round(out.minGap * 10) / 10;
          /* Foreman review 2026-10-03, Fix 1: every arc is a clean bow. Sampled
             along its own path (getPointAtLength): every sample's projection onto
             its side lies within [P, Q] (0.5 px), and every sample lies on the
             outward side of the side (away from the Δ's centre). */
          const sc = Math.min(svg.getBoundingClientRect().width / vb.width, svg.getBoundingClientRect().height / vb.height);
          const G0 = { x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3 };
          out.bow = [];
          [...svg.querySelectorAll('path.ewe-sarc')].forEach((p, i) => {
            const L = p.getTotalLength(), S = Array.from({ length: 201 }, (_, j) => p.getPointAtLength(L * j / 200));
            const P0 = S[0], Q0 = S[S.length - 1], len = Math.hypot(Q0.x - P0.x, Q0.y - P0.y), ux = (Q0.x - P0.x) / len, uy = (Q0.y - P0.y) / len;
            let nx = -uy, ny = ux; if ((G0.x - P0.x) * nx + (G0.y - P0.y) * ny > 0) { nx = -nx; ny = -ny; }
            let past = 0, inward = 0, sag = 0;
            S.forEach(q => { const a = (q.x - P0.x) * ux + (q.y - P0.y) * uy, n = (q.x - P0.x) * nx + (q.y - P0.y) * ny;
              past = Math.max(past, (-a) * sc, (a - len) * sc); inward = Math.max(inward, -n * sc); sag = Math.max(sag, n); });
            out.bow.push({ lvl: p.classList.contains('ewe-sarc-2') ? 2 : 1, past: Math.round(past * 100) / 100, inward: Math.round(inward * 100) / 100, ratio: Math.round(sag / len * 100) / 100 });
            if (past > 0.5) out.collisions.push(`arc ${i + 1} runs ${past.toFixed(2)}px past an end of its side`);
            if (inward > 0.5) out.collisions.push(`arc ${i + 1} dips ${inward.toFixed(2)}px inside its side`);
          });
          /* Fix 2: every arc label at least 4 px (screen) clear of every arc,
             every other label, every line, every dot and every ∥ arrow */
          const chev = [...svg.querySelectorAll('path.ewe-par')].flatMap(p => { const L = p.getTotalLength(); return Array.from({ length: 41 }, (_, j) => p.getPointAtLength(L * j / 40)); });
          const dotsC = dots.map(c => ({ x: +c.getAttribute('cx'), y: +c.getAttribute('cy'), r: +c.getAttribute('r') }));
          const pdist = (q, r) => Math.hypot(Math.max(0, r.x0 - q.x, q.x - r.x1), Math.max(0, r.y0 - q.y, q.y - r.y1));
          let tight = null;
          alabs.forEach(t => { const r = box(t);
            const take = (d, what) => { d *= sc; if (!tight || d < tight.d) tight = { d, what: `${t.textContent} to ${what}` }; };
            arcs.forEach((a, i) => take(Math.min(...a.pts.map(q => pdist(q, r))), `arc ${i + 1}`));
            texts.filter(o => o !== t).forEach(o => { const b = box(o); take(Math.hypot(Math.max(0, b.x0 - r.x1, r.x0 - b.x1), Math.max(0, b.y0 - r.y1, r.y0 - b.y1)), `label ${o.textContent}`); });
            lines.forEach(([x1, y1, x2, y2]) => { let m = Infinity; for (let j = 0; j <= 200; j++) m = Math.min(m, pdist({ x: x1 + (x2 - x1) * j / 200, y: y1 + (y2 - y1) * j / 200 }, r)); take(m, 'a line'); });
            dotsC.forEach(c => take(Math.max(0, pdist(c, r) - c.r), 'a dot'));
            if (chev.length) take(Math.min(...chev.map(q => pdist(q, r))), 'an ∥ arrow');
          });
          out.alTight = tight ? { d: Math.round(tight.d * 10) / 10, what: tight.what } : null;
          if (tight && tight.d < 4) out.collisions.push(`arc label clearance ${tight.d.toFixed(1)}px < 4 (${tight.what})`);
          return out; }"""
        GIVEN6_JS = r"""(k) => { const st = document.querySelector(`.ewe-steps > .ewe-step:nth-child(${k})`); const g = st.querySelector('.ewe-given'); if (!g) return null;
          const p = st.querySelector('.ewe-prompt'); const vw = document.documentElement.clientWidth, r = g.getBoundingClientRect();
          return { fracs: g.querySelectorAll('.ewf').length, text: (g.querySelector('.ewe-given-tx') || {}).textContent || '', before: !!(g.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_FOLLOWING),
                   inside: r.left >= -0.5 && r.right <= vw + 0.5, units: new Set([...g.querySelectorAll('.ewq-u')].map(u => Math.round(u.getBoundingClientRect().top))).size }; }"""
        CARD6_JS = r"""() => {
          const c = document.querySelector('.ewe-write'); if (!c) return null;
          const t = c.querySelector('.ewl-trap'); if (!t) return { trap: false };
          const vw = document.documentElement.clientWidth;
          const lns = [...t.querySelectorAll(':scope > .ewl-trap-ln')];
          const sub = t.querySelector(':scope > .ewl-trap-sub'), so = t.querySelector(':scope > .ewl-trap-so');
          const blocks = [...lns, sub, so].filter(Boolean);
          const eqs = [...sub.querySelectorAll('.ewl-ts-r > .ewl-ts-u:first-child > .ewq-eq')].map(e => Math.round(e.getBoundingClientRect().left * 10) / 10);
          const wrapped = [...t.querySelectorAll('.ewq-u, .ewl-ts-u')].filter(u => { const r = u.getBoundingClientRect(), f = u.querySelector('.ewf');
            return f ? r.height > f.getBoundingClientRect().height + 2 : r.height > 2.2 * parseFloat(getComputedStyle(u).fontSize); }).length;
          const rs = l => { const r = l.querySelector('.ewl-rs'); if (!r) return null; const g = document.createRange(); g.selectNodeContents(r); return { text: r.textContent, lines: new Set([...g.getClientRects()].map(x => Math.round(x.top))).size }; };
          const mid = lns[1] ? [...lns[1].querySelectorAll('.ewf')][1] : null;
          const strikes = lns[1] ? [...lns[1].querySelectorAll('.ewf-x')] : [];
          return { trap: true, lines: lns.length, fracs: lns.map(l => l.querySelectorAll('.ewf').length), reasons: lns.map(rs),
                   strikes: strikes.length, strikesInMid: strikes.every(x => x.closest('.ewf') === mid), struck: strikes.map(x => x.textContent).join(' '),
                   rows: [...sub.querySelectorAll('.ewl-ts-r')].map(r => r.textContent.replace(/\s+/g, '')), head: sub.querySelector('.ewl-ts-l').textContent.replace(/\s+/g, ''),
                   eqs, so: so.textContent.replace(/\s+/g, ''), soFracs: so.querySelectorAll('.ewf').length,
                   tints: [...t.querySelectorAll('.ewl-trap-sub .ewtint, .ewl-trap-so .ewtint')].map(x => x.className.match(/ewtint-\d/)[0].slice(7) + ':' + x.textContent.replace(/\s+/g, ' ')),
                   lefts: blocks.map(b => Math.round(b.getBoundingClientRect().left * 10) / 10), right: Math.max(...blocks.map(b => b.getBoundingClientRect().right)), vw, wrapped,
                   tip: (c.querySelector('.ewe-write-tip') || {}).textContent || '',
                   /* Fix 5b: the pink "Opp DBCE" stands on the baseline of its own "=" line: the
                      bottoms of the two glyph boxes (text ranges, same font) within 1 px */
                   headDy: (() => { const tb = n => { const g = document.createRange(); g.selectNodeContents(n); const r = [...g.getClientRects()]; return r.length ? r[0].bottom : NaN; };
                     const h = sub.querySelector('.ewl-ts-l .ewtint'), e = sub.querySelector('.ewl-ts-r .ewq-eq'); return h && e ? Math.round((tb(h) - tb(e)) * 10) / 10 : null; })() }; }"""
        def nbsp(s): return s.replace(" ", " ")
        BANK_ROW6 = lambda: page.evaluate("""() => [...document.querySelectorAll('.ewe-step:last-child .ewchip')].filter(b => !b.matches('.ewkey-del, .ewkey-sub')).map(b => b.textContent).sort()""")
        def hint_text():
            return nbsp(page.inner_text(".ewe-step:last-child .ewe-hint")) if seen(page, ".ewe-step:last-child .ewe-hint") else ""
        for qi, q in enumerate(data6):
            n = qi + 1
            P = f"ew6 Q{n}"
            BIG, SMALL, TRAP = "".join(q["big"]), "".join(q["small"]), "".join(q["trap"])
            lab = page.evaluate(LABELS_JS)
            label_rows.append((q["id"], lab))
            if lab is None:
                fail(f"{P}: no sketch")
                continue
            a0 = page.evaluate(ARCS6_JS, q["big"])
            for c in lab["collisions"] + a0["collisions"]: fail(f"{P} sketch: {c}")
            check6(f"{P} sketch at the start: {lab['lines']} lines, 2 ∥ arrows, no tints, arcs {a0['alabels'] or 'none'} (want {q['arcs0'] or 'none'}), every label outside Δ {BIG}, {len(lab['collisions']) + len(a0['collisions'])} collisions (closest label to an arc {a0['minGap']}px)",
                   lab["arrows"] == 2 and lab["tints"] == 0 and a0["alabels"] == q["arcs0"] and a0["arcs"] == len(q["arcs0"]) and not lab["collisions"] and not a0["collisions"])
            ew6_arcs.append((P, "start", a0["alTight"], a0["bow"]))
            shot(page, f"ew6-q{n}-a-sketch.png")
            prev = a0
            for si, st in enumerate(q["steps"]):
                k = si + 1
                tag = f"{P} step {k} ({st['type']}{' ' + st['role'] if st['role'] else ''})"
                if st["given"]:
                    g6 = page.evaluate(GIVEN6_JS, k)
                    check6(f"{tag}: the given line {'above the prompt' if st['given']['first'] else 'between the prompt and the frame'}, {g6 and g6['fracs']} stacked fractions on {g6 and g6['units']} row(s)" + (f", '{st['given']['text']}'" if st['given']['text'] else ""),
                           bool(g6) and g6["fracs"] == st["given"]["fracs"] and g6["before"] == st["given"]["first"] and g6["inside"]
                           and (nbsp(g6["text"]) == st["given"]["text"]))
                else:
                    check6(f"{tag}: no given line", page.evaluate(GIVEN6_JS, k) is None)
                if st["type"] == "build":
                    ps = pad_state()
                    check6(f"{tag}: {len(ps['texts'])} boxes, the glow on the first", len(ps["texts"]) == len(st["answer"]) and ps["next"] == 0)
                    bank = BANK_ROW6()
                    check6(f"{tag}: the chips {', '.join(bank)}", bank == sorted(st["chips"]))
                    measure(page, f"{tag}: boxes empty")
                    shot(page, f"ew6-q{n}-s{k}-a-empty.png")
                    reasons = [r for r in st["hints"] if r != "pattern"] + ["pattern"]
                    for wi, r in enumerate(reasons):
                        fill = st["fills"].get(r)
                        if fill is None:
                            check6(f"{tag}: a fill that gets the '{r}' hint exists", False)
                            continue
                        clear_pad()
                        for c in fill: click_chip(page, c)
                        measure(page, f"{tag}: boxes full ({r})")
                        click_btn(page, ".ewe-step:last-child .ewkey-sub")
                        measure(page, f"{tag}: {r} + hint")
                        got = hint_text()
                        check6(f"{tag}: {' '.join(fill)} gets the '{r}' hint ('{st['hints'][r][:60]}')", st["hints"][r] in got and has(page, ".ewe-step:last-child .ewe-fb.bad"))
                        shot(page, f"ew6-q{n}-s{k}-b{wi + 1}-{r}.png")
                    clear_pad()
                    for c in st["answer"]: click_chip(page, c)
                    measure(page, f"{tag}: boxes full (right)")
                    shot(page, f"ew6-q{n}-s{k}-c-full.png")
                    click_btn(page, ".ewe-step:last-child .ewkey-sub")
                    measure(page, f"{tag}: marked right")
                    check6(f"{tag}: right answer {' '.join(st['answer'])} accepted", has(page, f".ewe-steps > .ewe-step:nth-child({k}) .ewpad.is-locked"))
                    ok = page.evaluate("""(k) => { const f = document.querySelector(`.ewe-steps > .ewe-step:nth-child(${k}) .ewe-fb`); const o = f && f.querySelector('.ewe-okline');
                        return { text: f ? f.textContent.replace(/\\u00A0/g, ' ') : '', ok: o ? o.textContent.replace(/\\u00A0/g, ' ') : '', okFracs: o ? o.querySelectorAll('.ewf').length : -1 }; }""", k)
                    check6(f"{tag}: the ✓ line and its takeaway '{st['okLine'][:60]}' ({ok['okFracs']} stacked fractions in it)",
                           ok["text"].startswith("✓") and ok["ok"] == st["okLine"] and ok["okFracs"] == st["okFracs"])
                    fz = finished(page, k)
                    check6(f"{tag}: Fold 3, its {fz['slots']} boxes and Kontroleer hidden, the prompt and the ✓ line on screen", frame_gone(fz, "✓"))
                    shot(page, f"ew6-q{n}-s{k}-d-right.png")
                else:
                    opts = page.evaluate("(k) => [...document.querySelectorAll(`.ewe-steps > .ewe-step:nth-child(${k}) .ewe-opt`)].map(b => b.textContent)", k)
                    check6(f"{tag}: the prompt names the trapezium {TRAP}, four options ({' | '.join(nbsp(o) for o in opts)})",
                           TRAP in st["prompt"] and sorted(opts) == sorted(o["text"] for o in st["options"]))
                    right = next(o for o in st["options"] if o["correct"])
                    check6(f"{tag}: the right option is 'Opp Δ {BIG} − Opp Δ {SMALL}'", nbsp(right["text"]) == f"Opp Δ {BIG} − Opp Δ {SMALL}")
                    measure(page, f"{tag}: options")
                    hats(page, f"{tag}: options")
                    shot(page, f"ew6-q{n}-s{k}-a-options.png")
                    for wi, o in enumerate(x for x in st["options"] if not x["correct"]):
                        click_btn(page, ".ewe-step:last-child .ewe-opt", o["text"])
                        measure(page, f"{tag}: wrong pick {wi + 1}")
                        hats(page, f"{tag}: wrong pick {wi + 1}")
                        check6(f"{tag}: the wrong pick '{nbsp(o['text'])}' shows its own hint", bool(o["hint"]) and o["hint"] in hint_text())
                        shot(page, f"ew6-q{n}-s{k}-b{wi + 1}-wrong.png")
                    check6(f"{tag}: no tints before the right pick", page.evaluate(ARCS6_JS, q["big"])["tints"] == [])
                    click_btn(page, ".ewe-step:last-child .ewe-opt", right["text"])
                    measure(page, f"{tag}: right pick")
                    kept = page.evaluate("""(k) => [...document.querySelectorAll(`.ewe-steps > .ewe-step:nth-child(${k}) .ewe-opt`)].filter(e => getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().height > 0).map(e => e.textContent + (e.classList.contains('is-correct') ? '+' : ''))""", k)
                    fb = nbsp(page.inner_text(f".ewe-steps > .ewe-step:nth-child({k}) .ewe-fb"))
                    check6(f"{tag}: Fold 2, only the chosen option stays, green, with its ✓ line '{st['okLine']}'", kept == [right["text"] + "+"] and st["okLine"] in fb)
                if st["after"]:
                    a1 = page.evaluate(ARCS6_JS, q["big"])
                    l1 = page.evaluate(LABELS_JS)
                    label_rows.append((q["id"] + f" after step {k}", l1))
                    for c in l1["collisions"] + a1["collisions"]: fail(f"{P} sketch after step {k}: {c}")
                    moved = sum(1 for a, b in zip(prev["at"], a1["at"]) if a != b)
                    ew6_still.append((f"{P} after step {k}", moved, len(a1["at"])))
                    ew6_arcs.append((P, f"after step {k}", a1["alTight"], a1["bow"]))
                    if st["type"] == "build":
                        check6(f"{tag}: the whole-side arc appears ({a1['alabels']}, want {q['arcs1']}), no point label moves ({moved} of {len(a1['at'])} moved), {len(l1['collisions']) + len(a1['collisions'])} collisions",
                               a1["alabels"] == q["arcs1"] and a1["lvl2"] == 1 and moved == 0 and not l1["collisions"] and not a1["collisions"])
                        shot(page, f"ew6-q{n}-s{k}-e-whole-arc.png")
                    else:
                        want_t = sorted([f"2:{TRAP}", f"1:{SMALL}"])
                        check6(f"{tag}: the tints appear, the trapezium (four corners) and the small Δ ({a1['tints']}), the arcs stay ({a1['alabels'] or 'none'}), no point label moves ({moved} of {len(a1['at'])}), {len(l1['collisions']) + len(a1['collisions'])} collisions",
                               sorted(a1["tints"]) == want_t and a1["alabels"] == q["arcs1"] and moved == 0 and not l1["collisions"] and not a1["collisions"])
                        shot(page, f"ew6-q{n}-s{k}-e-tints.png")
                    prev = a1
            card = page.evaluate(CARD6_JS)
            ew6_cards.append((P, card))
            want_rows = [f"=OppΔ{BIG}−OppΔ{SMALL}", None, None]
            ok = bool(card) and card["trap"] and card["lines"] == (2 if q["full"] else 0) and card["soFracs"] == 2 and card["wrapped"] == 0 \
                 and len(card["eqs"]) == 3 and max(card["eqs"]) - min(card["eqs"]) <= 0.5 and max(card["lefts"]) - min(card["lefts"]) <= 0.5 and card["right"] <= card["vw"] + 0.5 \
                 and card["rows"][0] == want_rows[0] and card["head"] == f"Opp{TRAP}" and card["so"].startswith("∴") and nbsp(card["tip"]) == q["tip"] \
                 and set(card["tints"]) == {f"1:Opp Δ {SMALL}", f"2:Opp {TRAP}"} and card["headDy"] is not None and abs(card["headDy"]) <= 1
            if q["full"]:
                ok = ok and card["fracs"] == [3, 5] and card["strikes"] == 4 and card["strikesInMid"] and card["reasons"][1]["text"] == "(gemene hoekpunt)" \
                     and card["reasons"][0]["text"].startswith("(lyn ∥ een sy v. Δ,") and all(r["lines"] == 1 for r in card["reasons"])
            check6(f"{P}: card = " + ("the 3/5 line, ew4's chain to the numbers (½ and sin struck), " if q["full"] else "") + f"part (c) with its three '=' under each other ({card and card.get('eqs')}), 'Opp {TRAP}' on its '=' line (baseline off by {card and card.get('headDy')}px), the ∴ line; left-aligned, inside 375 px; tip", ok)
            if not ok: print("   card:", card)
            measure(page, f"{P}: Só skryf jy dit card")
            hats(page, f"{P}: Só skryf jy dit card")
            page.evaluate("document.querySelector('.ewe-write').scrollIntoView()")
            shot(page, f"ew6-q{n}-f-card.png")
            click_btn(page, ".ewe-next")
            page.wait_for_timeout(250)
        page.wait_for_selector(".ewe-end", timeout=8000)
        measure(page, "ew6 end of round")
        tk6 = page.evaluate("() => { const t = document.querySelector('.ewe-end .ewe-takeaway'); return t ? { text: t.textContent.replace(/\\u00A0/g, ' '), sub: !!t.querySelector('.ewl-trap-sub'), fr: t.querySelectorAll('.ewf').length } : null; }")
        check6("ew6 end screen: the takeaway 'Trapesium = groot Δ − klein Δ…' and Q1's part (c), no generic well-done line",
               bool(tk6) and "Trapesium = groot Δ − klein Δ. Skryf albei in k's, en trek af." in tk6["text"] and tk6["sub"] and tk6["fr"] == 2 and "Goed gedaan" not in tk6["text"])
        shot(page, "ew6-end-of-round.png")
        saved6 = page.evaluate("""() => { const s = JSON.parse(localStorage.getItem('cgg.students')); const me = Object.values(s).find(x => x.display_name === 'Demo Matric');
            const p = (JSON.parse(localStorage.getItem('cgg.progress')) || {})[me.id] || {}; const ev = (JSON.parse(localStorage.getItem('cgg.events')) || []).filter(e => e.studentId === me.id && e.roundId === 'ew6');
            return { progress: p.ew6 || null, xpEvents: ev.map(e => e.xp) }; }""")

        # ---------------- ew6 -> ew7: the way on, and the map ----------------
        ew7_checks = []
        def check7(name, ok):
            ew7_checks.append((name, ok))
            if not ok: fail(name)
        check7("ew6's end screen offers the next round", page.evaluate("""() => [...document.querySelectorAll('.ewe-end .btn')].some(b => b.textContent.includes('Volgende rondte'))"""))
        click_btn(page, ".ewe-end .btn", "▶ Volgende rondte")
        page.wait_for_selector(".ewe-play")
        check7("the way on from ew6 opens ew7", "Vreemde formaat" in page.inner_text(".play-title"))
        page.evaluate("window.__APP__.go('ewes')")
        page.wait_for_selector(".round-card")
        check7("the map unlocks ew7 once ew6 is passed (ew6 shows ✓)", page.evaluate("""() => { const c = [...document.querySelectorAll('.round-card')];
            return c.length >= 7 && c[5].classList.contains('done') && !c[6].classList.contains('locked') && !!c[6].querySelector('.btn'); }"""))
        sqm = squares(page, "ew7 on the map")
        check7(f"the map card's blurb draws AD² with the raised 2 ({sqm['sups']} raised 2s on the map, {sqm['plain']} plain ² left)", sqm["sups"] >= 1 and sqm["plain"] == 0)
        measure(page, "ew7 on the map", ".view")

        # ---------------- the ew7 walk: one or two builds per question ----------------
        page.evaluate("() => { const c = [...document.querySelectorAll('.round-card')]; c[6].querySelector('.btn').click(); }")
        page.wait_for_selector(".ewe-play")
        data7 = page.evaluate("""async () => { const m = await import('./js/rounds/ewe7-vreemde-formaat.js');
            return m.round.eweQuestions.map(q => { const S = m.SKETCHES[q.id]; const [[L1, L2], [R1, R2]] = q.given.pairs;
              return { id: q.id, sq: L1 === L2 ? L1 : null, L: [L1, L2], R: [R1, R2], decoy: q.given.decoy, given: q.given.text.replace(/\\u00A0/g, ' '),
                tri: [S.right, ...S.ends], tip: q.write.tip,
                steps: q.steps.map(s => ({ mode: s.spec.mode, chips: s.chips, answer: s.answer, prompt: s.prompt, okLine: s.okLine.replace(/\\u00A0/g, ' '),
                  hints: Object.fromEntries(Object.entries(s.hints).map(([k, v]) => [k, typeof v === 'string' ? v.replace(/\\u00A0/g, ' ') : v.text])) })) }; }); }""")
        CARD7_JS = r"""() => {
          const c = document.querySelector('.ewe-write'); if (!c) return null;
          const box = c.querySelector('.ewl-cross');
          if (!box) return { cross: false };
          const ln = [...box.querySelectorAll(':scope > .ewl-cross-ln')];
          const vw = document.documentElement.clientWidth;
          const rows = l => new Set([...l.querySelectorAll('.ewq-u')].map(u => { const r = u.getBoundingClientRect(); return Math.round((r.top + r.bottom) / 8); })).size;
          const unitWrapped = l => [...l.querySelectorAll('.ewq-u')].some(u => { const r = u.getBoundingClientRect(), f = u.querySelector('.ewf'); const fs = parseFloat(getComputedStyle(u).fontSize);
            return f ? r.height > f.getBoundingClientRect().height + 2 : r.height > 2.2 * fs; });
          return { cross: true, n: ln.length, texts: ln.map(l => l.textContent.replace(/\s+/g, '')),
                   lefts: ln.map(l => Math.round(l.getBoundingClientRect().left * 10) / 10),
                   rights: ln.map(l => Math.round(l.getBoundingClientRect().right)), vw,
                   sups: ln.map(l => l.querySelectorAll('sup.ewf-sq').length), fracs: ln.map(l => l.querySelectorAll('.ewf').length),
                   dots: ln.map(l => l.querySelectorAll('.ewf-dot').length), rows: ln.map(rows), wrapped: ln.filter(unitWrapped).length,
                   reason: !!c.querySelector('.ewl-rs'), tip: (c.querySelector('.ewe-write-tip') || {}).textContent || '' }; }"""
        OUTSIDE_JS = r"""(tri) => {
          const svg = document.querySelector('svg.ewe-sketch');
          const dots = [...svg.querySelectorAll('circle')], labs = [...svg.querySelectorAll('text.pl')];
          const at = {}; dots.forEach((c, i) => { at[labs[i].textContent] = [+c.getAttribute('cx'), +c.getAttribute('cy')]; });
          const [a, b, c] = tri.map(k => at[k]);
          const inside = (x, y) => { const s1 = (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]);
            const s2 = (c[0] - b[0]) * (y - b[1]) - (c[1] - b[1]) * (x - b[0]); const s3 = (a[0] - c[0]) * (y - c[1]) - (a[1] - c[1]) * (x - c[0]);
            return (s1 > 0 && s2 > 0 && s3 > 0) || (s1 < 0 && s2 < 0 && s3 < 0); };
          const bad = labs.filter(t => { const r = t.getBBox(); return [[r.x, r.y], [r.x + r.width, r.y], [r.x, r.y + r.height], [r.x + r.width, r.y + r.height], [r.x + r.width / 2, r.y + r.height / 2]].some(([x, y]) => inside(x, y)); }).map(t => t.textContent);
          /* each right-angle box: a square at a dot, its corner V = p1 + p3 - p2, its two sides equal and at 90° */
          const boxes = [...svg.querySelectorAll('path.ewe-rt')].map(p => {
            const n = p.getAttribute('d').match(/-?[\d.]+/g).map(Number);
            const [p1, p2, p3] = [[n[0], n[1]], [n[2], n[3]], [n[4], n[5]]];
            const V = [p1[0] + p3[0] - p2[0], p1[1] + p3[1] - p2[1]];
            const name = Object.keys(at).find(k => Math.hypot(at[k][0] - V[0], at[k][1] - V[1]) < 0.4) || '?';
            const u = [p1[0] - V[0], p1[1] - V[1]], w = [p3[0] - V[0], p3[1] - V[1]];
            const lu = Math.hypot(...u), lw = Math.hypot(...w);
            return { at: name, cos: Math.round(Math.abs(u[0] * w[0] + u[1] * w[1]) / (lu * lw) * 1000) / 1000, sides: [Math.round(lu * 10) / 10, Math.round(lw * 10) / 10] }; });
          return { inside: bad, boxes }; }"""
        BANK_ROW = lambda st: page.evaluate("""() => { const st = document.querySelector('.ewe-step:last-child'); return [...st.querySelectorAll('.ewchip')].filter(b => !b.matches('.ewkey-del, .ewkey-sub')).map(b => b.textContent).sort(); }""")
        def okshown(k, want):
            fsel = f".ewe-steps > .ewe-step:nth-child({k}) .ewe-fb"
            return page.evaluate("""(s) => { const f = document.querySelector(s); if (!f) return { text: '', fracs: 0, ok: '' };
                const o = f.querySelector('.ewe-okline'); return { text: f.textContent.replace(/\\u00A0/g, ' '), fracs: f.querySelectorAll('.ewf').length, ok: o ? o.textContent.replace(/\\u00A0/g, ' ') : '' }; }""", fsel)
        ANGLE_JS = r"""(tri) => {
          const svg = document.querySelector('svg.ewe-sketch');
          const dots = [...svg.querySelectorAll('circle')], labs = [...svg.querySelectorAll('text.pl')];
          const at = {}; dots.forEach((c, i) => { const r = c.getBoundingClientRect(); at[labs[i].textContent] = [(r.left + r.right) / 2, (r.top + r.bottom) / 2]; });
          const [v, b, c] = tri.map(k => at[k]);
          const u = [b[0] - v[0], b[1] - v[1]], w = [c[0] - v[0], c[1] - v[1]];
          const ang = Math.acos((u[0] * w[0] + u[1] * w[1]) / (Math.hypot(...u) * Math.hypot(...w))) * 180 / Math.PI;
          const sr = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
          return { ang: Math.round(ang * 100) / 100, sx: Math.round(sr.width / vb.width * 1000) / 1000, sy: Math.round(sr.height / vb.height * 1000) / 1000 }; }"""
        TPL7_JS = r"""() => { const t = document.querySelector('.ewe-step:last-child .ewe-hint .ewe-template'); if (!t) return null;
          const lines = e => { const r = document.createRange(); r.selectNodeContents(e); return new Set([...r.getClientRects()].filter(q => q.width > 0).map(q => Math.round(q.top))).size; };
          const parts = [...t.querySelectorAll('.ewf-n, .ewf-d')];
          const units = new Set([...t.querySelectorAll('.ewq-u')].map(u => Math.round(u.getBoundingClientRect().top))).size;
          return { units, wrapped: parts.filter(e => lines(e) > 1).map(e => e.textContent), right: Math.round(t.querySelector('.ewq').getBoundingClientRect().right), vw: document.documentElement.clientWidth }; }"""
        ew7_cards = []
        for qi, q in enumerate(data7):
            n = qi + 1
            P = f"ew7 Q{n}"
            lab = page.evaluate(LABELS_JS)
            label_rows.append((q["id"], lab))
            if lab is None:
                fail(f"{P}: no sketch")
                continue
            for c in lab["collisions"]: fail(f"{P} sketch: {c}")
            out7 = page.evaluate(OUTSIDE_JS, q["tri"])
            check7(f"{P} sketch: bare exam figure, {lab['lines']} lines, {lab['rboxes']} right-angle boxes, no tints, arcs, stars, ∥ arrows or ⊥h; {lab['labels']} labels, {len(lab['collisions'])} collisions",
                   lab["lines"] == 4 and lab["rboxes"] == 2 and lab["tints"] == 0 and lab["arcs"] == 0 and lab["stars"] == 0 and lab["arrows"] == 0 and lab["heights"] == 0 and lab["labels"] == 4 and not lab["collisions"])
            check7(f"{P} sketch: every label outside Δ {''.join(q['tri'])} (inside: {out7['inside'] or 'none'})", not out7["inside"])
            bx = out7["boxes"]
            check7(f"{P} sketch: the boxes sit at {q['tri'][0]} and at the foot, square and at 90° ({'; '.join(f'{b['at']} cos {b['cos']} sides {b['sides']}' for b in bx)})",
                   len(bx) == 2 and bx[0]["at"] == q["tri"][0] and bx[1]["at"] not in ("?",) + tuple(q["tri"]) and all(b["cos"] <= 0.02 and abs(b["sides"][0] - b["sides"][1]) <= 0.3 for b in bx))
            an = page.evaluate(ANGLE_JS, q["tri"])
            ew7_angles.append((P, q["tri"][0], an))
            check7(f"{P} sketch: the right angle at {q['tri'][0]} measured on screen {an['ang']}° (svg scale x {an['sx']}, y {an['sy']})", abs(an["ang"] - 90) <= 1 and abs(an["sx"] - an["sy"]) <= 0.002)
            sq0 = squares(page, f"{P}: the intro")
            check7(f"{P}: the intro carries the line {q['given']!r}" + (f", its ² drawn raised ({sq0['sups']} raised, {sq0['plain']} plain ²)" if q["sq"] else ""),
                   q["given"].replace("²", "2") in page.inner_text(".ewe-intro").replace(" ", " ").replace("²", "2") and sq0["plain"] == 0 and (sq0["sups"] >= 1 if q["sq"] else True))
            shot(page, f"ew7-q{n}-a-sketch.png")
            for si, st in enumerate(q["steps"]):
                k = si + 1
                tag = f"{P} step {k} ({st['mode']})"
                a, X, (L1, L2), (R1, R2), D = st["answer"], q["sq"], q["L"], q["R"], q["decoy"]
                ps = pad_state()
                check7(f"{tag}: 4 boxes, the glow on the first", len(ps["texts"]) == 4 and ps["next"] == 0)
                bank = BANK_ROW(st)
                check7(f"{tag}: the chips are the line's letters, one spelling each, and ONE decoy {D} ({', '.join(bank)})", bank == sorted(st["chips"]) and D in bank and len(set(bank)) == len(bank))
                fr = page.evaluate("() => document.querySelectorAll('.ewe-step:last-child .ewpad-disp .ewf').length")
                check7(f"{tag}: the frame is " + ("☐ · ☐ = ☐ · ☐, no fraction" if st["mode"] == "prod" else "☐/☐ = ☐/☐, two stacked fractions") + f" ({fr} fractions)", fr == (0 if st["mode"] == "prod" else 2))
                measure(page, f"{tag}: boxes empty")
                shot(page, f"ew7-q{n}-s{k}-a-boxes-empty.png")
                if st["mode"] == "prod":
                    wrongs = [([X, R1, R1, R2], st["hints"]["twice"], "the square used once"),
                              ([X, R1, X, R2], st["hints"]["mixed"], "the products mixed across the ="),
                              ([X, X, R1, D], st["hints"]["decoy"].replace("{chip}", D), f"the decoy {D}"),
                              ([X, X, R1, R1], st["hints"]["pattern"], "a wrong product (pattern)")]
                elif X:
                    wrongs = [([X, R1, R2, R1], st["hints"]["once"], "the square once"),
                              ([X, X, R1, R2], st["hints"]["same"], f"{X} over {X}"),
                              ([X, R1, D, X], st["hints"]["decoy"].replace("{chip}", D), f"the decoy {D}"),
                              ([X, R1, X, R2], st["hints"]["pattern"], "not kruismaal (pattern)")]
                else:
                    wrongs = [([L1, L1, R1, R2], st["hints"]["repeat"], "one chip twice"),
                              ([L1, R1, D, L2], st["hints"]["decoy"].replace("{chip}", D), f"the decoy {D}"),
                              ([L1, L2, R1, R2], st["hints"]["pattern"], "a product inside one fraction (pattern)")]
                for wi, (fill, want, name) in enumerate(wrongs):
                    clear_pad()
                    for c in fill: click_chip(page, c)
                    measure(page, f"{tag}: boxes full ({name})")
                    click_btn(page, ".ewe-step:last-child .ewkey-sub")
                    measure(page, f"{tag}: {name} + hint")
                    squares(page, f"{tag}: {name} + hint")
                    hint = page.inner_text(".ewe-step:last-child .ewe-hint").replace(" ", " ") if seen(page, ".ewe-step:last-child .ewe-hint") else ""
                    tpl = page.evaluate("() => { const t = document.querySelector('.ewe-step:last-child .ewe-hint .ewe-template'); return t ? { fracs: t.querySelectorAll('.ewf').length, dots: t.querySelectorAll('.ewf-dot').length, text: t.textContent.replace(/\\s+/g, ' ').trim() } : null; }")
                    is_pat = "pattern" in name
                    if is_pat and st["mode"] == "cross":
                        t7 = page.evaluate(TPL7_JS)
                        ew7_tpls.append((tag, t7))
                        check7(f"{tag}: the pattern template fits 375 px on one row, no cell wraps ({t7})", bool(t7) and t7["units"] == 1 and not t7["wrapped"] and t7["right"] <= t7["vw"])
                    tpl_ok = (tpl is None) if not is_pat else (bool(tpl) and (tpl["fracs"] == 0 and tpl["dots"] == 2 if st["mode"] == "prod" else tpl["fracs"] == 2))
                    check7(f"{tag}: {' · '.join(fill[:2]) + ' = ' + ' · '.join(fill[2:]) if st['mode'] == 'prod' else fill[0] + '/' + fill[1] + ' = ' + fill[2] + '/' + fill[3]} ({name}) gets its hint"
                           + (f" with its template in words ({tpl and tpl['text']})" if is_pat else ""), want.replace("²", "2") in hint.replace("²", "2") and tpl_ok)
                    shot(page, f"ew7-q{n}-s{k}-b{wi + 1}-wrong.png")
                clear_pad()
                for c in a: click_chip(page, c)
                measure(page, f"{tag}: boxes full (right)")
                shot(page, f"ew7-q{n}-s{k}-c-boxes-full.png")
                click_btn(page, ".ewe-step:last-child .ewkey-sub")
                measure(page, f"{tag}: marked right")
                squares(page, f"{tag}: marked right")
                check7(f"{tag}: right answer {a} accepted", has(page, f".ewe-steps > .ewe-step:nth-child({k}) .ewpad.is-locked"))
                o = okshown(k, st["okLine"])
                check7(f"{tag}: the ✓ line is the finished frame ({o['fracs']} fractions) and its takeaway '{st['okLine']}'",
                       o["text"].startswith("✓") and o["fracs"] == (0 if st["mode"] == "prod" else 2) and o["ok"] == st["okLine"])
                fz = finished(page, k)
                check7(f"{tag}: Fold 3, its {fz['slots']} boxes and Kontroleer hidden, the prompt and the ✓ line on screen", frame_gone(fz, "✓"))
                shot(page, f"ew7-q{n}-s{k}-d-right.png")
            card = page.evaluate(CARD7_JS)
            nl = 3 if q["sq"] else 2
            fill = q["steps"][-1]["answer"]
            want_last = f"{fill[0]}{fill[1]}={fill[2]}{fill[3]}"
            ok = (bool(card) and card["cross"] and card["n"] == nl and card["texts"][-1] == want_last
                  and card["fracs"][-1] == 2 and sum(card["fracs"][:-1]) == 0
                  and (card["sups"][0] == 1 and card["dots"][0] == 1 and card["dots"][1] == 2 if q["sq"] else card["sups"][0] == 0 and card["dots"][0] == 2)
                  and sum(card["sups"][1:]) == 0 and max(card["lefts"]) - min(card["lefts"]) <= 0.5 and card["wrapped"] == 0
                  and max(card["rights"]) <= card["vw"] and not card["reason"] and card["tip"] == q["tip"])
            check7(f"{P}: card = {nl} lines, left-aligned ({card and card.get('lefts')}), {' | '.join(card['texts']) if card and card.get('texts') else '?'}; "
                   + ("the given line's 2 raised, " if q["sq"] else "") + "the fractions the learner built, no reason, its tip", ok)
            if not ok: print("   card:", card)
            ew7_cards.append((P, card))
            squares(page, f"{P}: Só skryf jy dit card")
            measure(page, f"{P}: Só skryf jy dit card")
            page.evaluate("document.querySelector('.ewe-write').scrollIntoView()")
            shot(page, f"ew7-q{n}-e-card.png")
            click_btn(page, ".ewe-next")
            page.wait_for_timeout(250)
        page.wait_for_selector(".ewe-end", timeout=8000)
        measure(page, "ew7 end of round")
        sqe = squares(page, "ew7 end of round")
        check7(f"ew7 end screen: the takeaway and Q1's three-line card (AD² = BD · DC, AD · AD = BD · DC, AD/BD = DC/AD), its 2 raised ({sqe['sups']} raised, {sqe['plain']} plain ²)",
               page.evaluate("() => { const t = document.querySelector('.ewe-end .ewe-takeaway'); const l = t && t.querySelector('.ewl-cross'); return !!l && l.querySelectorAll('.ewl-cross-ln').length === 3 && l.querySelectorAll('.ewf').length === 2 && /kruismaal/.test(t.textContent) && !/Goed gedaan/.test(t.textContent); }")
               and sqe["plain"] == 0 and sqe["sups"] >= 1)
        shot(page, "ew7-end-of-round.png")
        saved7 = page.evaluate("""() => { const s = JSON.parse(localStorage.getItem('cgg.students')); const me = Object.values(s).find(x => x.display_name === 'Demo Matric');
            const p = (JSON.parse(localStorage.getItem('cgg.progress')) || {})[me.id] || {}; const ev = (JSON.parse(localStorage.getItem('cgg.events')) || []).filter(e => e.studentId === me.id && e.roundId === 'ew7');
            return { progress: p.ew7 || null, xpEvents: ev.map(e => e.xp) }; }""")
        ctx.close()

        # ---------------- the other hint kinds, "show me", and the toggle ----------------
        extra = []
        ctx, page = new_page(browser)
        login(page, "Demo Matric", "gr12", ewe="1")
        close_popups(page)       # the login pop-ups, closed with their ✕, as a learner would
        page.evaluate("window.__APP__.go('ewe', { roundId: 'ew1' })")
        page.wait_for_selector(".ewe-play")
        def try_fill(fill, want_text, name):
            page.evaluate("() => { const d = document.querySelector('.ewe-step:last-child .ewkey-del'); while (!d.disabled) d.click(); }")
            for c in fill: click_chip(page, c)
            click_btn(page, ".ewe-step:last-child .ewkey-sub")
            txt = page.inner_text(".ewe-step:last-child .ewe-hint")
            ok = want_text in txt
            extra.append((name, ok))
            if not ok: fail(f"{name}: hint was {txt!r}")
            measure(page, f"Q1 {name}")
        early = seen(page, ".ewe-step:last-child .ewe-showme")
        extra.append(("'show me' NOT on screen before any wrong try", not early))
        if early: fail("'show me' is on screen before any wrong try")
        try_fill(["AD", "DB", "DE", "BC"], "∥ lyne self", "∥-line fill -> ∥ hint")
        early = seen(page, ".ewe-step:last-child .ewe-showme")
        extra.append(("'show me' NOT on screen after 1 wrong try", not early))
        if early: fail("'show me' is on screen after only 1 wrong try")
        try_fill(["AD", "AD", "AE", "AE"], "Elke blokkie", "repeated chips -> repeat hint")
        try_fill(["AD", "EC", "AE", "DB"], "dieselfde manier", "mixed-up pattern -> pattern hint")
        shown = seen(page, ".ewe-step:last-child .ewe-showme")
        extra.append(("'show me' offered after 3 wrong tries", shown))
        if not shown: fail("'show me' not offered after 3 wrong tries")
        click_btn(page, ".ewe-step:last-child .ewe-showme")
        locked = has(page, ".ewpad.is-locked") and has(page, ".ewe-fb.revealed") and not seen(page, ".ewe-showme")
        extra.append(("'show me' fills the answer and moves on", locked))
        if not locked: fail("'show me' did not fill and lock")
        fz = finished(page, 1)
        fz_ok = frame_gone(fz, "💡") and "revealed" in fz["fbKind"]
        extra.append((f"Fold 3, after 'show me' its {fz['slots']} boxes and Kontroleer are hidden, the 💡 line ({fz['fbFracs']} fractions) is on screen", fz_ok))
        if not fz_ok: fail("after 'show me' the frame did not fold away (Fold 3)")
        measure(page, "Q1 after 'show me'")
        click_btn(page, ".ewe-step:last-child .ewe-opt", "∠∠∠")
        click_btn(page, ".ewe-step:last-child .ewe-opt", "lyn ∥ een sy v. Δ, DE ∥ BC")
        click_btn(page, ".ewe-next")
        page.wait_for_timeout(200)
        before = page.inner_text(".pc-n")
        click_btn(page, ".pill.lang")                 # the EN/AF toggle re-renders the screen
        page.wait_for_timeout(300)
        after = page.inner_text(".pc-n") if has(page, ".ewe-play .pc-n") else None
        intro = page.inner_text(".ewe-intro") if has(page, ".ewe-intro") else ""
        same = before == after == "2 / 6" and "Hierdie keer" in intro
        extra.append((f"language toggle mid-round: {before} -> {after}, still Afrikaans", same))
        if not same: fail(f"language toggle lost the place or the language: {before} -> {after}, {intro!r}")
        measure(page, "Q2 after the language toggle")
        ctx.close()

        # ---------------- ew2: the other hint kinds and "show me" ----------------
        ctx, page = new_page(browser)
        login(page, "Demo Matric", "gr12", ewe="1")
        close_popups(page)       # the login pop-ups, closed with their ✕, as a learner would
        page.evaluate("window.__APP__.go('ewe', { roundId: 'ew2' })")
        page.wait_for_selector(".ewe-play")
        def try_fill2(rest, want_text, name):
            page.evaluate("() => { const d = document.querySelector('.ewe-step:last-child .ewkey-del'); while (!d.disabled) d.click(); }")
            for c in rest: click_chip(page, c)
            click_btn(page, ".ewe-step:last-child .ewkey-sub")
            txt = page.inner_text(".ewe-step:last-child .ewe-hint")
            ok = want_text in txt
            extra.append((f"ew2 {name}", ok))
            if not ok: fail(f"ew2 {name}: hint was {txt!r}")
            measure(page, f"ew2 {name}")
        early = seen(page, ".ewe-step:last-child .ewe-showme")
        extra.append(("ew2: 'show me' NOT on screen before any wrong try", not early))
        if early: fail("ew2: 'show me' is on screen before any wrong try")
        try_fill2(["FK", "GH", "KH"], "onderste stuk", "Q1 JK/FK = GH/KH -> bottom-piece hint")
        try_fill2(["FJ", "FJ", "FG"], "Elke blokkie", "Q1 repeated chips -> repeat hint")
        try_fill2(["FK", "FH", "GH"], "dieselfde manier", "Q1 mixed-up pattern -> pattern hint")
        shown = seen(page, ".ewe-step:last-child .ewe-showme")
        extra.append(("ew2: 'show me' offered after 3 wrong tries", shown))
        if not shown: fail("ew2: 'show me' not offered after 3 wrong tries")
        click_btn(page, ".ewe-step:last-child .ewe-showme")
        filled = page.evaluate("() => [...document.querySelectorAll('.ewe-steps > .ewe-step:first-child .ewslot')].map(x => x.textContent)")
        locked = has(page, ".ewpad.is-locked") and has(page, ".ewe-fb.revealed") and not seen(page, ".ewe-showme") and filled[:1] == ["JK"]
        extra.append((f"ew2: 'show me' fills {filled} (JK kept first) and moves on", locked))
        if not locked: fail("ew2: 'show me' did not fill and lock")
        fz = finished(page, 1)
        fz_ok = frame_gone(fz, "💡") and "revealed" in fz["fbKind"]
        extra.append((f"ew2: Fold 3, after 'show me' its {fz['slots']} boxes and Kontroleer are hidden, the 💡 line ({fz['fbFracs']} fractions) is on screen", fz_ok))
        if not fz_ok: fail("ew2: after 'show me' the frame did not fold away (Fold 3)")
        measure(page, "ew2 Q1 after 'show me'")
        # her ruling 2026-10-02: the ∥ reason is RIGHT here too (two right options)
        click_btn(page, ".ewe-step:last-child .ewe-opt", "lyn ∥ een sy v. Δ, JK ∥ GH")
        # a right pick ends the step: the card and the way on are appended after it,
        # so the reason step is no longer :last-child. Read the whole question instead.
        par_ok = has(page, ".ewe-steps .ewe-opt.is-correct") and has(page, ".ewe-steps .ewe-write") and not seen(page, ".ewe-steps .ewe-hint")
        extra.append(("ew2: the ∥ reason 'lyn ∥ een sy v. Δ, JK ∥ GH' is accepted too (her ruling 2026-10-02)", par_ok))
        if not par_ok: fail("ew2: the ∥ reason was not accepted as right")
        click_btn(page, ".ewe-next"); page.wait_for_timeout(200)
        for c in ["RT", "UV", "RV"]: click_chip(page, c)
        click_btn(page, ".ewe-step:last-child .ewkey-sub")
        click_btn(page, ".ewe-step:last-child .ewe-opt", "uit |||")
        click_btn(page, ".ewe-next"); page.wait_for_timeout(200)
        try_fill2(["NP", "NL", "NQ", "NM"], "wil die ∥ lyne", "Q3 NP/NL = NQ/NM (true, no ∥ line) -> ∥-lines hint")
        ctx.close()

        # ---------------- ew3: "show me" on a step with its own frame ----------------
        ctx, page = new_page(browser)
        login(page, "Demo Matric", "gr12", ewe="1")
        close_popups(page)       # the login pop-ups, closed with their ✕, as a learner would
        page.evaluate("window.__APP__.go('ewe', { roundId: 'ew3' })")
        page.wait_for_selector(".ewe-play")
        early = seen(page, ".ewe-step:last-child .ewe-showme")
        extra.append(("ew3: 'show me' NOT on screen before any wrong try", not early))
        if early: fail("ew3: 'show me' is on screen before any wrong try")
        for fill in (["CD", "BC"], ["AC", "CD"], ["BC", "BC"]):
            page.evaluate("() => { const d = document.querySelector('.ewe-step:last-child .ewkey-del'); while (!d.disabled) d.click(); }")
            for c in fill: click_chip(page, c)
            click_btn(page, ".ewe-step:last-child .ewkey-sub")
        shown = seen(page, ".ewe-step:last-child .ewe-showme")
        extra.append(("ew3: 'show me' offered after 3 wrong tries", shown))
        if not shown: fail("ew3: 'show me' not offered after 3 wrong tries")
        click_btn(page, ".ewe-step:last-child .ewe-showme")
        filled = page.evaluate("() => [...document.querySelectorAll('.ewe-steps > .ewe-step:first-child .ewslot')].map(x => x.textContent)")
        fbf = page.evaluate("() => document.querySelectorAll('.ewe-steps > .ewe-step:first-child .ewe-fb.revealed .ewf').length")
        locked = has(page, ".ewpad.is-locked") and not seen(page, ".ewe-showme") and filled == ["BC", "CD"] and fbf == 2
        extra.append((f"ew3: 'show me' fills {filled}, shows the finished frame ({fbf} fractions) and moves on", locked))
        if not locked: fail("ew3: 'show me' did not fill and lock with the frame line")
        fz = finished(page, 1)
        fz_ok = frame_gone(fz, "💡") and "revealed" in fz["fbKind"]
        extra.append((f"ew3: Fold 3, after 'show me' its {fz['slots']} boxes and Kontroleer are hidden, the 💡 line ({fz['fbFracs']} fractions) is on screen", fz_ok))
        if not fz_ok: fail("ew3: after 'show me' the frame did not fold away (Fold 3)")
        measure(page, "ew3 Q1 after 'show me'")
        shot(page, "ew3-show-me.png")
        ctx.close()

        # ---------------- ew4: "show me" on a four-box product step ----------------
        ctx, page = new_page(browser)
        login(page, "Demo Matric", "gr12", ewe="1")
        close_popups(page)       # the login pop-ups, closed with their ✕, as a learner would
        page.evaluate("window.__APP__.go('ewe', { roundId: 'ew4' })")
        page.wait_for_selector(".ewe-play")
        click_btn(page, ".ewe-step:last-child .ewe-opt", "Â")
        page.wait_for_timeout(150)
        early = seen(page, ".ewe-step:last-child .ewe-showme")
        extra.append(("ew4: 'show me' NOT on screen before any wrong try", not early))
        if early: fail("ew4: 'show me' is on screen before any wrong try")
        for fill in (["AB", "AC", "AD", "AE"], ["AD", "AB", "AE", "AC"], ["DE", "AE", "AB", "AC"]):
            page.evaluate("() => { const d = document.querySelector('.ewe-step:last-child .ewkey-del'); while (!d.disabled) d.click(); }")
            for c in fill: click_chip(page, c)
            click_btn(page, ".ewe-step:last-child .ewkey-sub")
        shown = seen(page, ".ewe-step:last-child .ewe-showme")
        extra.append(("ew4: 'show me' offered after 3 wrong tries", shown))
        if not shown: fail("ew4: 'show me' not offered after 3 wrong tries")
        click_btn(page, ".ewe-step:last-child .ewe-showme")
        filled = page.evaluate("() => [...document.querySelectorAll('.ewe-steps > .ewe-step:nth-child(2) .ewslot')].map(x => x.textContent)")
        fbf = page.evaluate("() => document.querySelectorAll('.ewe-steps > .ewe-step:nth-child(2) .ewe-fb.revealed .ewf').length")
        locked = has(page, ".ewe-steps > .ewe-step:nth-child(2) .ewpad.is-locked") and not seen(page, ".ewe-showme") and filled == ["AD", "AE", "AB", "AC"] and fbf == 2
        extra.append((f"ew4: 'show me' fills {filled}, shows the finished frame ({fbf} fractions) and moves on", locked))
        if not locked: fail("ew4: 'show me' did not fill and lock with the frame line")
        fz = finished(page, 2)
        fz_ok = frame_gone(fz, "💡") and "revealed" in fz["fbKind"]
        extra.append((f"ew4: Fold 3, after 'show me' its {fz['slots']} boxes and Kontroleer are hidden, the 💡 line ({fz['fbFracs']} fractions) is on screen", fz_ok))
        if not fz_ok: fail("ew4: after 'show me' the frame did not fold away (Fold 3)")
        measure(page, "ew4 Q1 after 'show me'")
        hats(page, "ew4 Q1 after 'show me'")
        shot(page, "ew4-show-me.png")
        ctx.close()

        # ---------------- ew7: "show me" on a square step, its takeaway line too ----------------
        ctx, page = new_page(browser)
        login(page, "Demo Matric", "gr12", ewe="1")
        close_popups(page)
        page.evaluate("window.__APP__.go('ewe', { roundId: 'ew7' })")
        page.wait_for_selector(".ewe-play")
        early = seen(page, ".ewe-step:last-child .ewe-showme")
        extra.append(("ew7: 'show me' NOT on screen before any wrong try", not early))
        if early: fail("ew7: 'show me' is on screen before any wrong try")
        for fill in (["AD", "BD", "BD", "DC"], ["AD", "BD", "AD", "DC"], ["AD", "AD", "BD", "AC"]):
            page.evaluate("() => { const d = document.querySelector('.ewe-step:last-child .ewkey-del'); while (!d.disabled) d.click(); }")
            for c in fill: click_chip(page, c)
            click_btn(page, ".ewe-step:last-child .ewkey-sub")
        shown = seen(page, ".ewe-step:last-child .ewe-showme")
        extra.append(("ew7: 'show me' offered after 3 wrong tries", shown))
        if not shown: fail("ew7: 'show me' not offered after 3 wrong tries")
        click_btn(page, ".ewe-step:last-child .ewe-showme")
        filled = page.evaluate("() => [...document.querySelectorAll('.ewe-steps > .ewe-step:first-child .ewslot')].map(x => x.textContent)")
        okl = page.evaluate("() => { const o = document.querySelector('.ewe-steps > .ewe-step:first-child .ewe-fb.revealed .ewe-okline'); return o ? o.textContent.replace(/\\u00A0/g, ' ') : ''; }")
        locked = has(page, ".ewe-steps > .ewe-step:first-child .ewpad.is-locked") and not seen(page, ".ewe-steps > .ewe-step:first-child .ewe-showme") and filled == ["AD", "AD", "BD", "DC"] and okl == "Nou is dit 'n gewone produk links en regs."
        extra.append((f"ew7: 'show me' fills {filled}, says its takeaway ('{okl[:40]}…') and moves on to step 2", locked and has(page, ".ewe-steps > .ewe-step:nth-child(2) .ewpad")))
        if not locked: fail("ew7: 'show me' did not fill and lock with its takeaway")
        fz = finished(page, 1)
        fz_ok = frame_gone(fz, "💡") and "revealed" in fz["fbKind"]
        extra.append((f"ew7: Fold 3, after 'show me' its {fz['slots']} boxes and Kontroleer are hidden, the 💡 line is on screen", fz_ok))
        if not fz_ok: fail("ew7: after 'show me' the frame did not fold away (Fold 3)")
        measure(page, "ew7 Q1 after 'show me'")
        squares(page, "ew7 Q1 after 'show me'")
        shot(page, "ew7-show-me.png")
        ctx.close()

        # ---------------- the phone folds at 375 x 667 (her ruling 2026-10-02) ----------------
        def settle(page):
            # the player waits 80 ms before it scrolls; then the scroll is
            # done when scrollY stops changing
            page.wait_for_timeout(130)
            last, same = None, 0
            for _ in range(100):
                y = page.evaluate("window.scrollY")
                same = same + 1 if y == last else 0
                if same >= 4: break
                last = y
                page.wait_for_timeout(40)
            return last

        def vshot(page, name):
            # what the learner sees: the screen, not the whole page
            page.evaluate("document.fonts.ready")
            page.screenshot(path=os.path.join(OUT, name), full_page=False)

        ctx, page = new_page(browser, height=667)
        login(page, "Demo Matric", "gr12", ewe="1")
        fold_rounds = page.evaluate("""async () => { const m = await import('./js/rounds/index.js');
            return m.EWE.map(r => ({ id: r.id, qs: r.eweQuestions.map(q => ({ id: q.id, steps: q.steps.map(s => ({ type: s.type, role: s.role || '',
              answer: s.answer || [], fixed: s.fixed || [], okLine: s.okLine || '',
              options: (s.options || []).map(o => ({ text: o.text, correct: !!o.correct })) })) })) })); }""")
        fold_checks = []
        fold_rows = []      # one per build step: where, auto-scrolled?, the measures
        intro_rows = []     # one per question: full, folded, opened heights
        fold3_rows = []     # one per build step: where, the finished step's height
        fold3_pics = []     # the foreman's ew4 Q1 pictures: where the folded intro sits
        ew5_vis = []        # ew5, per pick step at 375 x 667: how much sketch shares the screen with the options
        bar_rows = []       # ew7, 375 x 667: the sticky top bar's top edge in the viewport
        ew7_vis = []        # ew7, per build step at 375 x 667: how much sketch shares the screen with the frame and the WHOLE chip bank
        ew6_vis = []        # ew6, the same per build step (step 4, the subtraction, is the number the foreman asked for)
        ew6_fallback = []   # ew6 build steps the player had to centre: where, sketch bottom px above the bar, sketch -> Kontroleer px
        BANKVIS_JS = r"""(k) => {
          const st = document.querySelector(`.ewe-steps > .ewe-step:nth-child(${k})`);
          const bar = document.querySelector('.topbar');
          const head = bar ? Math.max(0, bar.getBoundingClientRect().bottom) : 0;
          const vh = window.innerHeight, y = window.scrollY;
          const s = document.querySelector('.ewe-q .q-diagram svg').getBoundingClientRect();
          const disp = st.querySelector('.ewpad-disp').getBoundingClientRect();
          const grid = st.querySelector('.ewpad-grid').getBoundingClientRect();
          const seen = (top, bot, shift) => Math.max(0, Math.min(bot - shift, vh) - Math.max(top - shift, head));
          /* best: the scroll that shows the most sketch while the frame's top is
             under the bar and the bank's bottom (Kontroleer) is above the bottom edge */
          const shift = Math.max(-y, grid.bottom + 8 - vh);
          return { y: Math.round(y), head: Math.round(head), vh, sh: Math.round(s.height), now: Math.round(seen(s.top, s.bottom, 0)), barTop: bar ? Math.round(bar.getBoundingClientRect().top * 10) / 10 : null,
                   frameOn: disp.top >= head - 0.5 && disp.bottom <= vh + 0.5, bankOn: grid.top >= head - 0.5 && grid.bottom <= vh + 0.5,
                   bankBelow: Math.max(0, Math.round(grid.bottom - vh)), best: Math.round(seen(s.top, s.bottom, shift)),
                   bestFrameOn: disp.top - shift >= head - 0.5, need: Math.round(grid.bottom - disp.top) }; }"""
        SKVIS_JS = r"""(k) => {
          const st = document.querySelector(`.ewe-steps > .ewe-step:nth-child(${k})`);
          const bar = document.querySelector('.topbar');
          const head = bar ? Math.max(0, bar.getBoundingClientRect().bottom) : 0;
          const vh = window.innerHeight, y = window.scrollY;
          const s = document.querySelector('.ewe-q .q-diagram svg').getBoundingClientRect();
          const os = [...st.querySelectorAll('.ewe-opt')].map(e => e.getBoundingClientRect());
          const optTop = Math.min(...os.map(r => r.top)), optBot = Math.max(...os.map(r => r.bottom));
          const p = st.getBoundingClientRect();
          const seen = (top, bot, shift) => Math.max(0, Math.min(bot - shift, vh) - Math.max(top - shift, head));
          /* best: the smallest scroll that puts the last option at the bottom edge (or none needed) */
          const shift = Math.max(-y, optBot - vh);
          return { y: Math.round(y), head: Math.round(head), vh, sh: Math.round(s.height), now: Math.round(seen(s.top, s.bottom, 0)),
                   optsOn: optTop >= head - 0.5 && optBot <= vh + 0.5, stepTop: Math.round(p.top),
                   best: Math.round(seen(s.top, s.bottom, shift)), bestOptsOn: optTop - shift >= head - 0.5,
                   bestPromptOn: p.top - shift >= head - 0.5 }; }"""
        def checkf(name, ok):
            fold_checks.append((name, ok))
            if not ok: fail(name)
        # the pop-ups this fresh login opened on home: closed with their ✕
        # BEFORE any measurement (8144db8 measured through them)
        closed = close_popups(page)
        p0 = popups(page)
        checkf(f"fold walk: the pop-ups from login closed with their ✕ ({'; '.join(closed) or 'none opened'}), none open, the page not scroll-locked",
               not p0["open"] and not p0["locked"])
        pop_log = []        # per question: every measurement point's open pop-ups
        def no_popup(where):
            p = popups(page)
            pop_log.append((where, p))
            return not p["open"] and not p["locked"]
        INTRO_JS = r"""() => {
          const p = document.querySelector('.ewe-q .ewe-intro'), cs = getComputedStyle(p), r = p.getBoundingClientRect();
          const fs = parseFloat(cs.fontSize); let lh = parseFloat(cs.lineHeight); if (!(lh > 0)) lh = 1.2 * fs;
          const ch = p.querySelector('.ewe-chev');
          return { h: Math.round(r.height * 10) / 10, lh: Math.round(lh * 10) / 10, folded: p.classList.contains('is-folded'),
                   chev: ch ? ch.textContent : null, chevSeen: !!ch && ch.getBoundingClientRect().width > 0,
                   role: p.getAttribute('role'), expanded: p.getAttribute('aria-expanded'), tab: p.tabIndex,
                   clipped: p.scrollWidth > p.clientWidth + 1, ellipsis: cs.textOverflow, ws: cs.whiteSpace,
                   right: r.right, vw: document.documentElement.clientWidth }; }"""
        OPTS_JS = r"""(k) => {
          const st = document.querySelector(`.ewe-steps > .ewe-step:nth-child(${k})`);
          const all = [...st.querySelectorAll('.ewe-opt')];
          const seenEl = e => { const c = getComputedStyle(e), r = e.getBoundingClientRect(); return c.display !== 'none' && c.visibility !== 'hidden' && r.width > 0 && r.height > 0; };
          const vis = all.filter(seenEl);
          const fb = st.querySelector('.ewe-fb');
          return { all: all.length, vis: vis.length, text: vis.map(e => e.dataset.opt || e.getAttribute('aria-label') || e.textContent.trim()),
                   green: vis.filter(e => e.classList.contains('is-correct')).length, red: vis.filter(e => e.classList.contains('is-wrong')).length,
                   fb: fb && seenEl(fb) ? fb.textContent : '' }; }"""
        FRAME_JS = r"""(k) => {
          const st = document.querySelector(`.ewe-steps > .ewe-step:nth-child(${k})`);
          const bar = document.querySelector('.topbar');
          const head = bar ? bar.getBoundingClientRect().bottom : 0;
          const s = document.querySelector('.ewe-q .q-diagram').getBoundingClientRect();
          const slotEls = [...st.querySelectorAll('.ewpad-disp .ewslot')];
          const slots = slotEls.map(e => { const r = e.getBoundingClientRect(); return [r.top, r.bottom]; });
          const sub = st.querySelector('.ewkey-sub').getBoundingClientRect();
          // what a finger at that point would touch: inside the step (or the
          // sketch), not a sheet over it; null when the point is off screen
          const vw = document.documentElement.clientWidth, vh = window.innerHeight;
          const hit = (x, y, box) => { if (y < head || y > vh || x < 0 || x > vw) return null; const e = document.elementFromPoint(x, y); return !!e && box.contains(e); };
          const fig = document.querySelector('.ewe-q .q-diagram');
          const covered = slotEls.filter(e => { const r = e.getBoundingClientRect(); return hit((r.left + r.right) / 2, (r.top + r.bottom) / 2, st) === false; }).length;
          const sketchHit = hit((s.left + s.right) / 2, s.bottom - 3, fig);
          return { head, vh, y: window.scrollY, sTop: s.top, sBot: s.bottom, slots, subTop: sub.top, subBot: sub.bottom, covered, sketchHit }; }"""
        INTRO_AT_JS = r"""() => { const bar = document.querySelector('.topbar'); const head = bar ? bar.getBoundingClientRect().bottom : 0;
          const r = document.querySelector('.ewe-q .ewe-intro').getBoundingClientRect(); return { top: r.top, bottom: r.bottom, head, vh: window.innerHeight }; }"""
        for R in fold_rounds:
            page.evaluate("(id) => window.__APP__.go('ewe', { roundId: id })", R["id"])
            page.wait_for_selector(".ewe-play")
            page.wait_for_timeout(150)
            for qi, q in enumerate(R["qs"]):
                n = qi + 1
                P = f"{R['id']} Q{n}"
                multi = len(q["steps"]) > 1
                page.wait_for_selector(f".ewe-q[data-q='{q['id']}']")
                pop_from = len(pop_log)
                no_popup(f"fold {P}: the intro measured")
                i0 = page.evaluate(INTRO_JS)
                checkf(f"fold {P}: the intro is full before step 1 (no chevron, {i0['h']}px)", not i0["folded"] and i0["chev"] is None and not i0["clipped"] and i0["role"] is None)
                folded_h = None
                for si, st in enumerate(q["steps"]):
                    k = si + 1
                    tag = f"fold {P} step {k} ({st['type']})"
                    if st["type"] == "build":
                        auto = si > 0
                        settle(page)       # also the glide back to the top between questions
                        f = page.evaluate(FRAME_JS, k)
                        top_ok, bot_ok = f["head"] - 0.5, f["vh"] + 0.5
                        sketch_in = top_ok <= f["sBot"] <= bot_ok
                        frame_in = bool(f["slots"]) and all(t >= top_ok and b <= bot_ok for t, b in f["slots"])
                        over = max(0, round(max((b for t, b in f["slots"]), default=0) - f["vh"]))
                        fold_rows.append({"where": f"{R['id']} Q{n} s{k}", "auto": auto, "dist": round(f["subBot"] - f["sBot"]),
                                          "sketch_in": sketch_in, "frame_in": frame_in, "sub_in": f["subBot"] <= bot_ok,
                                          "cut": max(0, round(f["head"] - f["sTop"])), "y": round(f["y"]), "head": round(f["head"]),
                                          "room": round(f["vh"] - f["sBot"]), "over": over,
                                          "under": max(0, round(f["head"] - f["sBot"]))})
                        clear = no_popup(f"{tag}: frame measured")
                        # ew6 only: a step with more finished work above it than a 667 px
                        # screen holds (steps 4 and 5 of a full-chain question) is brought
                        # in CENTRED by the player's own fallback (js/ewe.js bringBuild).
                        # Words are not cut (the fold ruling), so this is REPORTED with its
                        # numbers, for the foreman, and its boxes must still be on screen.
                        centred6 = auto and R["id"] == "ew6" and not sketch_in and f["sBot"] < f["head"]
                        if centred6:
                            ew6_fallback.append((f"ew6 Q{n} s{k} ({st['role']})", round(f["head"] - f["sBot"]), round(f["subBot"] - f["sBot"])))
                            checkf(f"{tag}: ew6, too much finished work above it to share the screen with the sketch (its bottom edge {round(f['head'] - f['sBot'])}px above the bar), so the player centres it (its fallback, REPORTED); all {len(f['slots'])} boxes on screen", frame_in)
                        elif auto:
                            checkf(f"{tag}: after its auto-scroll the sketch's bottom edge is on screen ({f['sBot']:.0f}px, bar {f['head']:.0f}, screen {f['vh']})", sketch_in)
                            checkf(f"{tag}: after its auto-scroll all {len(f['slots'])} boxes of the frame are on screen" + (f" (the lowest box ends {over}px below the screen)" if over else ""), frame_in)
                        if auto:
                            checkf(f"{tag}: no pop-up open, and nothing covers the sketch's bottom edge or the {len(f['slots'])} boxes (a finger there touches them: {len(f['slots']) - f['covered']} of {len(f['slots'])})",
                                   clear and f["covered"] == 0 and f["sketchHit"] is not False)
                            measure(page, f"{tag}: after the auto-scroll")
                        vshot(page, f"fold-{R['id']}-q{n}-s{k}-build.png")
                        if R["id"] == "ew7":
                            v7 = page.evaluate(BANKVIS_JS, k)
                            ew7_vis.append({"where": f"ew7 Q{n} s{k}", "auto": auto, **v7})
                            if k == 2: bar_rows.append((f"ew7 Q{n} s2", {"y": v7["y"], "barTop": v7["barTop"]}))
                            vshot(page, f"fold-ew7-q{n}-s{k}-bank.png")
                            if v7["best"] != v7["now"]:
                                # the foreman's picture of the best spot: frame and whole bank on, most sketch
                                y_keep = page.evaluate("window.scrollY")
                                page.evaluate("(k) => { const st = document.querySelector(`.ewe-steps > .ewe-step:nth-child(${k})`); const g = st.querySelector('.ewpad-grid').getBoundingClientRect(); window.scrollTo({ top: Math.max(0, window.scrollY + g.bottom + 8 - window.innerHeight), behavior: 'instant' }); }", k)
                                vshot(page, f"fold-ew7-q{n}-s{k}-bank-best.png")
                                page.evaluate("(y) => window.scrollTo({ top: y, behavior: 'instant' })", y_keep)
                        if R["id"] == "ew6":
                            v6 = page.evaluate(BANKVIS_JS, k)
                            ew6_vis.append({"where": f"ew6 Q{n} s{k}", "role": st["role"], "auto": auto, **v6})
                            vshot(page, f"fold-ew6-q{n}-s{k}-bank.png")
                        if R["id"] == "ew4" and n == 1 and k in (2, 3):
                            # the foreman's pictures: ew4 Q1 as the learner sees it after
                            # the auto-scroll, then one swipe up to the folded intro line
                            ia = page.evaluate(INTRO_AT_JS)
                            fold3_pics.append({"where": f"ew4 Q1 s{k} brought in", "intro": "on screen" if ia["top"] >= ia["head"] - 0.5 and ia["bottom"] <= ia["vh"] + 0.5
                                               else f"{round(ia['head'] - ia['top'])}px above the bar's edge (under the bar or off the top)"})
                            vshot(page, f"fold3-ew4-q1-s{k}.png")
                            y_keep = page.evaluate("window.scrollY")
                            page.evaluate("() => { const bar = document.querySelector('.topbar'); const head = bar ? bar.getBoundingClientRect().bottom : 0; window.scrollTo({ top: window.scrollY + document.querySelector('.ewe-q .ewe-intro').getBoundingClientRect().top - head - 4, behavior: 'instant' }); }")
                            vshot(page, f"fold3-ew4-q1-s{k}-swipe-up.png")
                            page.evaluate("(y) => window.scrollTo({ top: y, behavior: 'instant' })", y_keep)
                        for c in st["answer"][len(st["fixed"]):]: click_chip(page, c)
                        click_btn(page, ".ewe-step:last-child .ewkey-sub")
                        checkf(f"{tag}: right answer accepted", has(page, f".ewe-steps > .ewe-step:nth-child({k}) .ewpad.is-locked"))
                        # Fold 3: the frame goes at once, the ✓ line stays
                        fz = finished(page, k)
                        checkf(f"{tag}: Fold 3, answered right: its {fz['slots']} boxes and Kontroleer are hidden, the prompt and the ✓ line ({fz['fbFracs']} fractions) are on screen ({fz['h']}px high now)",
                               frame_gone(fz, "✓") and "good" in fz["fbKind"])
                        fold3_rows.append({"where": f"{R['id']} Q{n} s{k}", "h": fz["h"]})
                        settle(page)
                        no_popup(f"{tag}: finished")
                        measure(page, f"{tag}: finished, the frame folded away")
                        vshot(page, f"fold3-{R['id']}-q{n}-s{k}-done.png")
                    else:
                        settle(page)
                        no_popup(f"{tag}: options measured")
                        o0 = page.evaluate(OPTS_JS, k)
                        if R["id"] == "ew5":
                            v = page.evaluate(SKVIS_JS, k)
                            ew5_vis.append({"where": f"ew5 Q{n} s{k}", "kind": "HEIGHT" if q["id"] in ("ew5q1", "ew5q3", "ew5q6") else "ANGLE", **v})
                            vshot(page, f"fold-ew5-q{n}-s{k}-options.png")
                            if k == 1 and n == 1:
                                checkf(f"{tag}: ew5 Q1, the two tools on screen before any scroll (scrollY {v['y']})", v["y"] == 0 and v["optsOn"])
                            if k == 2:
                                checkf(f"{tag}: ew5, {v['now']}px of the {v['sh']}px sketch on screen with all four options, as the auto-scroll leaves it (at least 150)", v["optsOn"] and v["now"] >= 150)
                        checkf(f"{tag}: all {o0['all']} options on screen before an answer", o0["all"] >= 2 and o0["vis"] == o0["all"])
                        wrong = next(o["text"] for o in st["options"] if not o["correct"])
                        right = next(o["text"] for o in st["options"] if o["correct"])
                        click_btn(page, ".ewe-step:last-child .ewe-opt", wrong)
                        o1 = page.evaluate(OPTS_JS, k)
                        checkf(f"{tag}: after a wrong tap all {o1['all']} options stay, the wrong one red", o1["vis"] == o1["all"] and o1["red"] == 1)
                        click_btn(page, ".ewe-step:last-child .ewe-opt", right)
                        o2 = page.evaluate(OPTS_JS, k)
                        checkf(f"{tag}: after the right tap only '{right}' stays, green, with its ✓ line",
                               o2["vis"] == 1 and o2["text"] == [right] and o2["green"] == 1 and o2["red"] == 0 and bool(st["okLine"]) and st["okLine"] in o2["fb"])
                        settle(page)
                        no_popup(f"{tag}: folded to the chosen option")
                        measure(page, f"{tag}: folded to the chosen option")
                        vshot(page, f"fold-{R['id']}-q{n}-s{k}-pick.png")
                    if si == 0:
                        i1 = page.evaluate(INTRO_JS)
                        if multi:
                            folded_h = i1["h"]
                            checkf(f"fold {P}: step 1 right, the intro is ONE line ({i1['h']}px, line {i1['lh']}px) with ▸, cut by an ellipsis",
                                   i1["folded"] and i1["h"] <= i1["lh"] + 0.5 and i1["chev"] == "▸" and i1["chevSeen"]
                                   and i1["ws"] == "nowrap" and i1["ellipsis"] == "ellipsis" and i1["right"] <= i1["vw"] + 0.5)
                            checkf(f"fold {P}: the folded line is keyboard-reachable (role=button, tabindex 0, aria-expanded false)",
                                   i1["role"] == "button" and i1["tab"] == 0 and i1["expanded"] == "false")
                        else:
                            checkf(f"fold {P}: one step only, the intro never folds ({i1['h']}px)", not i1["folded"] and i1["chev"] is None and i1["role"] is None and abs(i1["h"] - i0["h"]) < 0.6)
                # every step done: the toggle (at the end, so it never moves a measured scroll)
                if multi:
                    page.evaluate("document.querySelector('.ewe-q .ewe-intro').click()")
                    i2 = page.evaluate(INTRO_JS)
                    checkf(f"fold {P}: a tap opens the intro to its full height ({i2['h']}px, full was {i0['h']}px) with ▾",
                           not i2["folded"] and i2["h"] >= i0["h"] - 0.5 and not i2["clipped"] and i2["chev"] == "▾" and i2["expanded"] == "true")
                    measure(page, f"fold {P}: intro opened")
                    if n == 1:
                        page.evaluate("document.querySelector('.ewe-q .ewe-intro').scrollIntoView({ block: 'start', behavior: 'instant' }); window.scrollBy({ top: -90, behavior: 'instant' })")
                        vshot(page, f"fold-{R['id']}-q{n}-intro-open.png")
                    page.evaluate("document.querySelector('.ewe-q .ewe-intro').click()")
                    i3 = page.evaluate(INTRO_JS)
                    checkf(f"fold {P}: a second tap folds it again ({i3['h']}px)", i3["folded"] and i3["h"] <= i3["lh"] + 0.5 and i3["chev"] == "▸" and i3["expanded"] == "false")
                    if n == 1:
                        vshot(page, f"fold-{R['id']}-q{n}-intro-folded.png")
                    page.evaluate("document.querySelector('.ewe-q .ewe-intro').focus({ preventScroll: true })")
                    page.keyboard.press("Enter")
                    k1 = page.evaluate(INTRO_JS)
                    page.keyboard.press("Enter")
                    k2 = page.evaluate(INTRO_JS)
                    checkf(f"fold {P}: Enter opens and folds it too", not k1["folded"] and k1["expanded"] == "true" and k2["folded"] and k2["expanded"] == "false")
                    intro_rows.append((P, i0["h"], folded_h, i2["h"], i0["lh"]))
                else:
                    intro_rows.append((P, i0["h"], None, None, i0["lh"]))
                checkf(f"fold {P}: the 'Só skryf jy dit' card follows", has(page, ".ewe-write"))
                if R["id"] == "ew7" and n == 1:
                    y_keep = page.evaluate("window.scrollY")
                    page.evaluate("document.querySelector('.ewe-write').scrollIntoView({ block: 'center', behavior: 'instant' })")
                    bar_rows.append(("ew7 Q1 card", page.evaluate("() => ({ y: Math.round(window.scrollY), barTop: Math.round(document.querySelector('.topbar').getBoundingClientRect().top * 10) / 10 })")))
                    page.evaluate("(y) => window.scrollTo({ top: y, behavior: 'instant' })", y_keep)
                pq = pop_log[pop_from:]
                bad_pop = [f"{w}: {', '.join(p['open']) or 'page scroll-locked'}" for w, p in pq if p["open"] or p["locked"]]
                checkf(f"fold {P}: no pop-up or sheet open at any of its {len(pq)} measurements" + (f" ({'; '.join(bad_pop)})" if bad_pop else ""), not bad_pop)
                click_btn(page, ".ewe-next")
                page.wait_for_timeout(250)
            page.wait_for_selector(".ewe-end", timeout=8000)
        ctx.close()

        # reduced motion: the build step's scroll is a jump, not a glide
        ctx, page = new_page(browser, height=667, reduced_motion="reduce")
        login(page, "Demo Matric", "gr12", ewe="1")
        closed_rm = close_popups(page)       # as the fold walk: their ✕, before anything is measured
        page.evaluate("window.__APP__.go('ewe', { roundId: 'ew3' })")
        page.wait_for_selector(".ewe-play")
        page.wait_for_timeout(150)
        a3 = fold_rounds[2]["qs"][0]["steps"][0]["answer"]
        for c in a3: click_chip(page, c)
        click_btn(page, ".ewe-step:last-child .ewkey-sub")
        page.wait_for_timeout(110)          # the player's 80 ms, and no glide after it
        y_a = page.evaluate("window.scrollY")
        page.wait_for_timeout(700)
        y_b = page.evaluate("window.scrollY")
        f = page.evaluate(FRAME_JS, 2)
        p_rm = popups(page)
        rm_ok = (y_a > 0 and y_a == y_b and f["head"] - 0.5 <= f["sBot"] <= f["vh"] + 0.5 and all(t >= f["head"] - 0.5 and b <= f["vh"] + 0.5 for t, b in f["slots"])
                 and not p_rm["open"] and not p_rm["locked"] and f["covered"] == 0)
        checkf(f"reduced motion, ew3 Q1 step 2: the page jumps to its place at once ({y_a}px after 110 ms, {y_b}px later), sketch and frame on screen, no pop-up (closed with ✕: {'; '.join(closed_rm) or 'none opened'})", rm_ok)
        ctx.close()
        browser.close()
finally:
    server.terminate()
    try: server.wait(timeout=5)
    except Exception: server.kill()

# ---------------- report ----------------
print("\nVISIBILITY")
print(f"  {'who':46} card  reaches route/map")
for who, card, reach in vis: print(f"  {who:46} {'yes' if card else 'no ':4}  {'yes' if reach else 'no'}")
print(f"\nMAIN QUEST MAP on the Gr12 home screen: {home_cards} round cards")
print("\nRELEASE CHECKS (eweLive true, ew7 held back)")
for name, ok in live_checks: print(f"  {'ok  ' if ok else 'FAIL'} {name}")
print(f"  {sum(1 for _, ok in live_checks if ok)} of {len(live_checks)} release checks pass")

print("\nFRACTIONS + OVERFLOW at 375 px (every state measured after document.fonts.ready)")
print(f"  {'state':52} fracs  where                          bad  slash  overflowX  offscreen")
T = B = 0
for r in fraction_rows:
    T += r["fractions"]; B += r["bad"]
    kinds = ",".join(f"{k}:{v}" for k, v in sorted(r["kinds"].items())) or "-"
    print(f"  {r['state'][:52]:52} {r['fractions']:5}  {kinds:30} {r['bad']:3}  {r['slash']:5}  {r['overflowX']:9}  {r['offscreen']:9}")
print(f"  {len(fraction_rows)} states, {T} fraction renders measured, {B} bad")

print("\nSKETCH LABELS")
for qid, lab in label_rows:
    if lab: print(f"  {qid}: {lab['labels']} labels, {lab['lines']} lines, {lab['arrows']} ∥ arrows, {len(lab['collisions'])} collisions"
                  + (f", {lab['tints']} tints, {lab['heights']} dotted ⊥h, {lab['boxes']} right-angle box" if lab.get('tints') else "")
                  + (f", {lab['arcs']} arc, {lab['stars']} star" if lab.get('arcs') else ""))

print("\new2 CHECKS")
for name, ok in ew2_checks: print(f"  {'ok  ' if ok else 'FAIL'} {name}")
print(f"  {'ok  ' if ew2_locked_before else 'FAIL'} ew2 locked on the map before ew1 is passed")
print(f"  {'ok  ' if next_is_ew2 else 'FAIL'} ew1's end screen offers the next round")
print(f"  {'ok  ' if ew2_unlocked else 'FAIL'} ew2 unlocked once ew1 is passed")

print("\new3 CHECKS")
print(f"  {'ok  ' if ew3_locked_before else 'FAIL'} ew3 locked on the map before ew2 is passed")
for name, ok in ew3_checks: print(f"  {'ok  ' if ok else 'FAIL'} {name}")

print("\new4 CHECKS")
print(f"  {'ok  ' if ew4_locked_before else 'FAIL'} ew4 locked on the map before ew3 is passed")
for name, ok in ew4_checks: print(f"  {'ok  ' if ok else 'FAIL'} {name}")

print("\new5 CHECKS")
print(f"  {'ok  ' if ew5_locked_before else 'FAIL'} ew5 locked on the map before ew4 is passed")
for name, ok in ew5_checks: print(f"  {'ok  ' if ok else 'FAIL'} {name}")
print(f"  {sum(1 for _, ok in ew5_checks if ok) + (1 if ew5_locked_before else 0)} of {len(ew5_checks) + 1} ew5 checks pass")
print("  ew5 step 2 grid at 375 px: widest fraction / narrowest cell content, fraction font")
for tag, kind, fw, cw, fonts in ew5_grid: print(f"    {tag:22} {kind:6} {fw:4} / {cw} px   font {', '.join(str(x) for x in fonts)} px")
print("  ew5 labels placed afresh when the tool's mark appears: " + "; ".join(f"{p} {m}/{t}" for p, k, m, t in ew5_moved))

print("\new6 CHECKS")
print(f"  {'ok  ' if ew6_locked_before else 'FAIL'} ew6 locked on the map before ew5 is passed")
for name, ok in ew6_checks: print(f"  {'ok  ' if ok else 'FAIL'} {name}")
print(f"  {sum(1 for _, ok in ew6_checks if ok) + (1 if ew6_locked_before else 0)} of {len(ew6_checks) + 1} ew6 checks pass")
print("  ew6 labels moved when the sketch changes (the whole-side arc, the tints): " + "; ".join(f"{w} {m}/{t}" for w, m, t in ew6_still))
print("  ew6 arcs (Fix 1: px past an end / px inside the side, sag over chord) and the tightest arc-label clearance (Fix 2, screen px, at least 4)")
for P, stage, t, bow in ew6_arcs:
    print(f"    {P:7} {stage:13} " + ("; ".join(f"L{b['lvl']} past {b['past']} in {b['inward']} sag/chord {b['ratio']}" for b in bow) or "no arcs") + (f"   tightest {t['d']}px ({t['what']})" if t else ""))
print("  ew6 cards at 375 px (part (c) rows, the three '=' left edges, the widest right edge)")
for P, c in ew6_cards:
    if c and c.get("trap"): print(f"    {P:7} {c['head']} {' | '.join(c['rows'])}   = at {c['eqs']}   right {round(c['right'])}px of {c['vw']}   fractions {c['fracs']} + {c['soFracs']}")

print("\new7 CHECKS")
print(f"  {'ok  ' if ew7_locked_before else 'FAIL'} ew7 locked on the map before ew6 is passed")
for name, ok in ew7_checks: print(f"  {'ok  ' if ok else 'FAIL'} {name}")
print(f"  {sum(1 for _, ok in ew7_checks if ok) + (1 if ew7_locked_before else 0)} of {len(ew7_checks) + 1} ew7 checks pass")
print("  ew7 cards at 375 px (line texts, left edges, right edge of the widest line)")
for P, c in ew7_cards:
    if c and c.get("cross"): print(f"    {P:7} {' | '.join(c['texts']):40} lefts {c['lefts']}  widest right {max(c['rights'])}px of {c['vw']}")

print("\nRAISED 2s (sup.ewf-sq: lift = the middle of its letter minus the middle of the 2, px)")
with_sq = [r for r in sq_rows if r[1]]
print(f"  {len(sq_rows)} states checked, {sum(r[1] for r in sq_rows)} raised 2s measured, every one inside the screen and raised; no plain ² or ^2 in any text")
if with_sq:
    lo = min(with_sq, key=lambda r: r[2])
    print(f"  smallest lift {lo[2]} px ({lo[0][:70]})")

print("\nANGLE HATS (ink top measured against the inner top edge of its chip, box, option or card, or the bar above it)")
by_kind = {}
for label, nh, gap, where in hat_rows:
    for kind, cnt in where.items():
        by_kind[kind] = by_kind.get(kind, 0) + cnt
measured = [r for r in hat_rows if r[1]]
print(f"  {len(hat_rows)} states, {sum(r[1] for r in hat_rows)} hat renders measured: " + ", ".join(f"{k} {v}" for k, v in sorted(by_kind.items())))
for kind, (g, label) in sorted(hat_min.items()):
    print(f"  smallest gap, {kind:22} {g:5.1f} px  ({label[:60]})")
for label, nh, gap, where in sorted(measured, key=lambda r: r[2])[:4]:
    print(f"  tightest: {gap:5.1f} px  {label[:70]}  ({', '.join(f'{k} {v}' for k, v in sorted(where.items()))})")

print("\nOTHER BEHAVIOURS")
for name, ok in extra: print(f"  {'ok  ' if ok else 'FAIL'} {name}")

print("\nPHONE FOLDS at 375 x 667 (her ruling 2026-10-02)")
for name, ok in fold_checks: print(f"  {'ok  ' if ok else 'FAIL'} {name}")
print(f"  {sum(1 for _, ok in fold_checks if ok)} of {len(fold_checks)} fold checks pass")
print("\n  THE INTRO, px high: full at the start, folded after step 1, opened by a tap (line height)")
for P, h0, hf, ho, lh in intro_rows:
    print(f"  {P:9} full {h0:6.1f}   " + (f"folded {hf:5.1f}   opened {ho:6.1f}" if hf is not None else "one step: never folds      ") + f"   (line {lh})")
print("\n  BUILD STEPS: distance from the sketch's bottom edge to the bottom of Kontroleer (px; screen 667, top bar "
      + (f"{fold_rows[0]['head']}px)" if fold_rows else "?)"))
print(f"  {'step':12} {'scroll':22} {'sketch->Kontroleer':>18} {'below sketch':>12}  sketch bottom  frame             Kontroleer  sketch top cut")
for r in fold_rows:
    how = f"auto-scroll to {r['y']}" if r["auto"] else "question start (top)"
    frame = "on" if r["frame_in"] else f"OFF by {r['over']}px"
    sk = "on screen" if r["sketch_in"] else f"OFF by {r['under']}px"
    print(f"  {r['where']:12} {how:22} {r['dist']:18} {r['room']:12}  {sk:13}  {frame:16}  {'on' if r['sub_in'] else 'below':10}  {r['cut']}px")
print("\n  FOLD 3: a finished build step, its frame gone, the ✓ line left (px high, prompt + line)")
for i in range(0, len(fold3_rows), 4):
    print("  " + "   ".join(f"{r['where']:12} {r['h']:4}" for r in fold3_rows[i:i + 4]))
for r in fold3_pics:
    print(f"  {r['where']}: the folded intro line is {r['intro']} (fold3-ew4-q1-s*.png as the auto-scroll leaves it, *-swipe-up.png one swipe up)")

print("\n  ew5 PICK STEPS at 375 x 667: px of the sketch on screen with the step's options (sketch height, top bar, screen)")
print(f"  {'step':11} {'kind':6} {'sketch':>6}  {'as the auto-scroll leaves it':34}  best with every option on screen")
for r in ew5_vis:
    now = f"{r['now']:3} px" + (", all options on" if r["optsOn"] else ", options NOT all on")
    best = f"{r['best']:3} px" + ("" if r["bestOptsOn"] else " (the options alone overflow the screen)") + ("" if r["bestPromptOn"] else ", the prompt above the bar")
    print(f"  {r['where']:11} {r['kind']:6} {r['sh']:4} px  {now:34}  {best}")

print("\n  ew6 CENTRED FALLBACK at 375 x 667 (the sketch cannot share the screen; no words cut, flag for the foreman)")
for w, up, d in ew6_fallback: print(f"  {w:16} the sketch's bottom edge {up}px above the bar; sketch bottom to Kontroleer {d}px (the screen under the bar holds 572)")
if not ew6_fallback: print("  none")
print("\n  ew6 BUILD STEPS at 375 x 667: px of the sketch on screen with the frame and the WHOLE chip bank (Kontroleer too); the honest number")
print(f"  {'step':11} {'role':4} {'scroll':22} {'sketch':>6}  {'as the player leaves it':42}  most sketch with frame + bank on screen")
for r in ew6_vis:
    how = f"auto-scroll to {r['y']}" if r["auto"] else "question start (top)"
    now = f"{r['now']:3} px" + (", frame + bank on" if r["frameOn"] and r["bankOn"] else (", frame on, bank " + (f"{r['bankBelow']}px below" if r["bankBelow"] else "under the bar") if r["frameOn"] else ", frame NOT on"))
    best = f"{r['best']:3} px" + ("" if r["bestFrameOn"] else " (frame + bank alone overflow the screen)") + f"   (frame + bank {r['need']} px tall)"
    print(f"  {r['where']:11} {r['role']:4} {how:22} {r['sh']:4} px  {now:42}  {best}")

print("\n  ew7 sketches: the right angle measured on screen (dot centres, getBoundingClientRect)")
for P, v, an in ew7_angles: print(f"  {P}: angle at {v} = {an['ang']}°, svg scale x {an['sx']} y {an['sy']}")
print("  ew7 pattern templates (square-free and square cross steps)")
for tag, t7 in ew7_tpls: print(f"  {tag}: {t7}")
print("  ew7 sticky top bar at 375 x 667 (its top edge in the viewport; 0 = at the top)")
for w, b in bar_rows: print(f"  {w}: scrollY {b['y']}, bar top {b['barTop']}")
print("\n  ew7 BUILD STEPS at 375 x 667: px of the sketch on screen with the frame and the WHOLE chip bank (Kontroleer too)")
print(f"  {'step':11} {'scroll':22} {'sketch':>6}  {'as the player leaves it':42}  most sketch with frame + bank on screen")
for r in ew7_vis:
    how = f"auto-scroll to {r['y']}" if r["auto"] else "question start (top)"
    now = f"{r['now']:3} px" + (", frame + bank on" if r["frameOn"] and r["bankOn"] else (", frame on, bank " + (f"{r['bankBelow']}px below" if r["bankBelow"] else "under the bar") if r["frameOn"] else ", frame NOT on"))
    best = f"{r['best']:3} px" + ("" if r["bestFrameOn"] else " (frame + bank alone overflow the screen)") + f"   (frame + bank {r['need']} px tall)"
    print(f"  {r['where']:11} {how:22} {r['sh']:4} px  {now:42}  {best}")

print(f"\nSAVING (local backend): ew1 progress {json.dumps(saved['progress'])}, XP events {saved['xpEvents']}, map shows ✓: {map_done}")
if not (saved["progress"] and saved["progress"].get("passed")): fail("ew1 not saved as passed")
print(f"SAVING (local backend): ew2 progress {json.dumps(saved2['progress'])}, XP events {saved2['xpEvents']}")
if not (saved2["progress"] and saved2["progress"].get("passed")): fail("ew2 not saved as passed")
print(f"SAVING (local backend): ew3 progress {json.dumps(saved3['progress'])}, XP events {saved3['xpEvents']}")
if not (saved3["progress"] and saved3["progress"].get("passed")): fail("ew3 not saved as passed")
if saved3["xpEvents"] != [50]: fail(f"ew3 XP should be 5 questions x 10 = 50, got {saved3['xpEvents']}")
print(f"SAVING (local backend): ew4 progress {json.dumps(saved4['progress'])}, XP events {saved4['xpEvents']}")
if not (saved4["progress"] and saved4["progress"].get("passed")): fail("ew4 not saved as passed")
if saved4["xpEvents"] != [50]: fail(f"ew4 XP should be 5 questions x 10 = 50, got {saved4['xpEvents']}")
print(f"SAVING (local backend): ew5 progress {json.dumps(saved5['progress'])}, XP events {saved5['xpEvents']}")
if not (saved5["progress"] and saved5["progress"].get("passed")): fail("ew5 not saved as passed")
if saved5["xpEvents"] != [60]: fail(f"ew5 XP should be 6 questions x 10 = 60, got {saved5['xpEvents']}")
print(f"SAVING (local backend): ew6 progress {json.dumps(saved6['progress'])}, XP events {saved6['xpEvents']}")
if not (saved6["progress"] and saved6["progress"].get("passed")): fail("ew6 not saved as passed")
if saved6["xpEvents"] != [60]: fail(f"ew6 XP should be 6 questions x 10 = 60, got {saved6['xpEvents']}")
print(f"SAVING (local backend): ew7 progress {json.dumps(saved7['progress'])}, XP events {saved7['xpEvents']}")
if not (saved7["progress"] and saved7["progress"].get("passed")): fail("ew7 not saved as passed")
if saved7["xpEvents"] != [60]: fail(f"ew7 XP should be 6 questions x 10 = 60, got {saved7['xpEvents']}")
print(f"\nNETWORK: {len(blocked)} request(s) to other hosts blocked" + (": " + ", ".join(sorted({urlparse(u).hostname for u in blocked})) if blocked else ""))
print(f"CONSOLE ERRORS: {len(console_errors)}")
for e in console_errors[:10]: print("  ", e[:200])
if console_errors: fail("console errors")
print(f"SCREENSHOTS: {', '.join(sorted(os.listdir(OUT)))}")
print("\n" + (f"✗ {len(failures)} failure(s)" if failures else "✓ all checks pass"))
sys.exit(1 if failures else 0)
