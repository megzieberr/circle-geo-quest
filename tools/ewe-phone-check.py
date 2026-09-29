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
  * proves who can see the group (Gr12 + ?ewe=1 yes; Gr12 without it no;
    Gr11 with it no; teacher preview with it yes);
  * saves 375 px PNGs to tools/_out/ewe/ (git-ignored) for the foreman.
    This script never opens them.
  * ew2 ("Nou met die ∥ lyne"): after ew1 is passed, the end screen's way
    on must lead to ew2 and the map must unlock it (it is locked before).
    Then the same walk, every step of every ew2 question: the given chip in
    the first box (it stays, it cannot be deleted, the glow starts on the
    first EMPTY box), a bottom-piece answer with its hint, the right
    answer, the half-built question's stacked-fraction options, every
    two-line card, the end screen. Its PNGs start with "ew2-".

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
BASE = f"http://localhost:{PORT}/index.html"
server = subprocess.Popen([sys.executable, "serve.py", str(PORT)], cwd=ROOT,
                          stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

failures = []
blocked = []
console_errors = []
fraction_rows = []      # one row per measured screen state
label_rows = []

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
  const marks = [...svg.querySelectorAll('path.ewe-par')].map(R);
  const dots = [...svg.querySelectorAll('circle')].map(c => { const x = +c.getAttribute('cx'), y = +c.getAttribute('cy'), r = +c.getAttribute('r'); return { x0: x - r, y0: y - r, x1: x + r, y1: y + r }; });
  const vb = svg.viewBox.baseVal;
  const res = { labels: texts.length, lines: lines.length, arrows: marks.length, collisions: [] };
  texts.forEach((t, i) => {
    const r = R(t);
    lines.forEach(l => { if (segHitsRect(...l, r)) res.collisions.push(`${t.textContent} touches a line`); });
    marks.forEach(m => { if (hit(r, m)) res.collisions.push(`${t.textContent} touches a ∥ arrow`); });
    dots.forEach(d => { if (hit(r, d)) res.collisions.push(`${t.textContent} touches a dot`); });
    texts.forEach((u, j) => { if (j > i && hit(r, R(u))) res.collisions.push(`${t.textContent} touches ${u.textContent}`); });
    if (r.x0 < 0 || r.y0 < 0 || r.x1 > vb.width || r.y1 > vb.height) res.collisions.push(`${t.textContent} outside the sketch`);
  });
  return res;
}
"""

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

def new_page(browser):
    ctx = browser.new_context(viewport={"width": 375, "height": 812}, device_scale_factor=1)
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
    ok = page.evaluate("""([s, t]) => { const b = [...document.querySelectorAll(s)].find(x => (t == null || x.textContent.trim() === t || x.getAttribute('aria-label') === t) && !x.disabled && !x.hidden); if (!b) return false; b.click(); return true; }""", [selector, text])
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

        ctx, page = new_page(browser)
        login(page, "Demo Matric", "gr12")
        card = has(page, ".ewe-banner")
        page.evaluate("window.__APP__.go('ewe', { roundId: 'ew1' })")
        reached = has(page, ".ewe-play")
        bounced = has(page, ".home-head") and not reached
        page.evaluate("window.__APP__.go('ewes')")
        map_reached = has(page, "h1") and "Eweredigheid" in page.inner_text("h1")
        vis.append(("Gr12 learner, no flag (eweLive false)", card, reached or map_reached))
        if card or reached or map_reached or not bounced: fail("Gr12 without the flag must not see or reach it")
        ctx.close()

        for label, flags in [("Gr11 learner, ?ewe=1", {"ewe": "1"}),
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

        for label, flags, want in [("Teacher preview, ?ewe=1", {"preview": "1", "ewe": "1"}, True),
                                   ("Teacher preview, no flag", {"preview": "1"}, False)]:
            ctx, page = new_page(browser)
            page.goto(url(**flags)); page.wait_for_selector(".home-head"); page.wait_for_timeout(300)
            card = has(page, ".ewe-banner")
            vis.append((label, card, card))
            if card != want: fail(f"{label}: card shown={card}, wanted {want}")
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
        ctx.close()

        # ---------------- the other hint kinds, "show me", and the toggle ----------------
        extra = []
        ctx, page = new_page(browser)
        login(page, "Demo Matric", "gr12", ewe="1")
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
        measure(page, "ew2 Q1 after 'show me'")
        click_btn(page, ".ewe-step:last-child .ewe-opt", "lyn ∥ een sy v. Δ, JK ∥ GH")
        h = page.inner_text(".ewe-step:last-child .ewe-hint")
        extra.append(("ew2: last round's reason gets its own hint", "laas rondte" in h))
        if "laas rondte" not in h: fail(f"ew2: reason hint was {h!r}")
        click_btn(page, ".ewe-step:last-child .ewe-opt", "uit |||")
        click_btn(page, ".ewe-next"); page.wait_for_timeout(200)
        for c in ["RT", "UV", "RV"]: click_chip(page, c)
        click_btn(page, ".ewe-step:last-child .ewkey-sub")
        click_btn(page, ".ewe-step:last-child .ewe-opt", "uit |||")
        click_btn(page, ".ewe-next"); page.wait_for_timeout(200)
        try_fill2(["NP", "NL", "NQ", "NM"], "wil die ∥ lyne", "Q3 NP/NL = NQ/NM (true, no ∥ line) -> ∥-lines hint")
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
    if lab: print(f"  {qid}: {lab['labels']} labels, {lab['lines']} lines, {lab['arrows']} ∥ arrows, {len(lab['collisions'])} collisions")

print("\new2 CHECKS")
for name, ok in ew2_checks: print(f"  {'ok  ' if ok else 'FAIL'} {name}")
print(f"  {'ok  ' if ew2_locked_before else 'FAIL'} ew2 locked on the map before ew1 is passed")
print(f"  {'ok  ' if next_is_ew2 else 'FAIL'} ew1's end screen offers the next round")
print(f"  {'ok  ' if ew2_unlocked else 'FAIL'} ew2 unlocked once ew1 is passed")

print("\nOTHER BEHAVIOURS")
for name, ok in extra: print(f"  {'ok  ' if ok else 'FAIL'} {name}")

print(f"\nSAVING (local backend): ew1 progress {json.dumps(saved['progress'])}, XP events {saved['xpEvents']}, map shows ✓: {map_done}")
if not (saved["progress"] and saved["progress"].get("passed")): fail("ew1 not saved as passed")
print(f"SAVING (local backend): ew2 progress {json.dumps(saved2['progress'])}, XP events {saved2['xpEvents']}")
if not (saved2["progress"] and saved2["progress"].get("passed")): fail("ew2 not saved as passed")
print(f"\nNETWORK: {len(blocked)} request(s) to other hosts blocked" + (": " + ", ".join(sorted({urlparse(u).hostname for u in blocked})) if blocked else ""))
print(f"CONSOLE ERRORS: {len(console_errors)}")
for e in console_errors[:10]: print("  ", e[:200])
if console_errors: fail("console errors")
print(f"SCREENSHOTS: {', '.join(sorted(os.listdir(OUT)))}")
print("\n" + (f"✗ {len(failures)} failure(s)" if failures else "✓ all checks pass"))
sys.exit(1 if failures else 0)
