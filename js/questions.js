/* ============================================================
   QUESTION COMPONENTS  (the reusable answer toolkit)
   ------------------------------------------------------------
   mountQuestion(container, q, onAnswered)
     renders one question, handles interaction, locks after the
     first commit, reveals the correct answer + reason inline,
     and calls onAnswered(isCorrect) exactly once.

   Supported q.type:
     "mc"      multiple choice (four options, one correct)
     "calc-mc" calculate-as-multiple-choice (numeric options)
     "reason"  reason-picker (options are CAPS reason codes)
     "yesno"   yes / no
     "tap"     tap-on-diagram (verify against engine geometry)

   No free-text entry anywhere — by design.
   ============================================================ */
import { renderDiagram, computeGeometry, pol, sweepOf, INK } from "./engine.js";
import { tx, t, reason, reasonAuto, getLang, REASONS } from "./i18n.js";

const SVGNS = "http://www.w3.org/2000/svg";
function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}
function svg(tag, attrs) {
  const e = document.createElementNS(SVGNS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}

export function mountQuestion(container, q, onAnswered) {
  container.innerHTML = "";
  const root = el("div", "q");
  const accent = q.accent || "#4263eb";
  root.style.setProperty("--accent", accent);

  // prompt
  if (q.prompt) root.appendChild(el("p", "q-prompt", tx(q.prompt)));

  // diagram (shared by tap questions and many MC questions)
  let geo = null, svgNode = null;
  if (q.diagram) {
    const wrap = el("div", "q-diagram");
    wrap.innerHTML = renderDiagram(q.diagram, accent);
    svgNode = wrap.querySelector("svg");
    geo = computeGeometry(q.diagram);
    root.appendChild(wrap);
  }

  // feedback panel (revealed after answering)
  const feedback = el("div", "q-feedback");
  feedback.hidden = true;

  let answered = false;
  let hintWrap = null;                  // the "Stuck? hint" control, hidden once answered
  function reveal(isCorrect, answerText, reasonText) {
    if (answered) return;
    answered = true;
    if (hintWrap) hintWrap.hidden = true;
    feedback.hidden = false;
    feedback.classList.add(isCorrect ? "good" : "bad");
    const head = isCorrect ? t("correct") : t("notQuite");
    let html = `<div class="fb-head">${isCorrect ? "✓" : "✗"} ${head}</div>`;
    if (answerText) html += `<div class="fb-ans"><b>${t("theAnswer")}:</b> ${answerText}</div>`;
    if (q.solution && q.solution.length) {
      // multi-step working: each line is statement + (reason)
      html += `<div class="fb-steps">` + q.solution.map(st => {
        const r = st.r ? (REASONS[st.r] ? reason(st.r) : reasonAuto(st.r)) : "";
        return `<div class="fb-step"><span class="fb-s">${tx(st.s)}</span>${r ? `<span class="fb-sr">${r}</span>` : ""}</div>`;
      }).join("") + `</div>`;
    } else if (reasonText) {
      html += `<div class="fb-reason"><b>${t("reasonLabel")}:</b> <i>${reasonText}</i></div>`;
    }
    feedback.innerHTML = html;
    onAnswered(isCorrect, isCorrect ? 1 : 0);
  }

  // resolve a reason that may be a code (from REASONS) or an English phrase
  const resolveR = (r) => (r ? (REASONS[r] ? reason(r) : reasonAuto(r)) : "");

  // resolve the reason text shown in feedback (code, {en,af}, or legacy string)
  function explainReason() {
    if (!q.explainReason) return "";
    if (typeof q.explainReason === "string") return reason(q.explainReason); // code
    return tx(q.explainReason);
  }
  function answerText() {
    return q.answer ? tx(q.answer) : "";
  }

  // Build a progressive hint ladder for this question. The first hint NAMES
  // the theorem to use; later hints reveal the working lines — but never the
  // final answer line. Sources, in order: an explicit q.hints array, the
  // q.solution working steps, or the single explainReason nudge.
  function buildHintSteps() {
    if (Array.isArray(q.hints) && q.hints.length) return q.hints.map(h => tx(h));
    const sol = Array.isArray(q.solution) ? q.solution.filter(s => s && (s.s || s.r)) : [];
    if (sol.length) {
      const steps = [];
      const firstR = sol.find(s => s.r);
      if (firstR) steps.push(`<b>${t("hintThink")}:</b> <i>${resolveR(firstR.r)}</i>`);
      // reveal every working line except the last (which states the answer)
      const reveal = sol.length > 1 ? sol.slice(0, sol.length - 1) : [];
      reveal.forEach(st => {
        const r = st.r ? resolveR(st.r) : "";
        steps.push(`${tx(st.s)}${r ? ` <span class="qh-r">(${r})</span>` : ""}`);
      });
      return steps;
    }
    const er = explainReason();
    return er ? [`<b>${t("hintThink")}:</b> <i>${er}</i>`] : [];
  }

  // ---- per-type rendering ----
  if (q.type === "mc" || q.type === "calc-mc" || q.type === "reason") {
    const opts = el("div", "q-options" + (q.type === "calc-mc" ? " grid2" : ""));
    const list = q.type === "reason"
      ? q.options.map(o => ({ label: reason(o.code), correct: o.correct }))
      : q.options.map(o => ({ label: tx(o.text), correct: o.correct }));

    list.forEach(o => {
      const b = el("button", "opt", o.label);
      b.addEventListener("click", () => {
        if (answered) return;
        opts.querySelectorAll(".opt").forEach(x => {
          x.disabled = true;
          const isC = list[[...opts.children].indexOf(x)].correct;
          if (isC) x.classList.add("is-correct");
        });
        b.classList.add(o.correct ? "is-correct" : "is-wrong");
        reveal(o.correct, answerText(), explainReason());
      });
      opts.appendChild(b);
    });
    root.appendChild(opts);
  }

  else if (q.type === "yesno") {
    const opts = el("div", "q-options yesno");
    [{ label: t("yes"), val: true }, { label: t("no"), val: false }].forEach(o => {
      const b = el("button", "opt big", o.label);
      b.addEventListener("click", () => {
        if (answered) return;
        const isCorrect = (o.val === !!q.yes);
        opts.querySelectorAll(".opt").forEach(x => x.disabled = true);
        b.classList.add(isCorrect ? "is-correct" : "is-wrong");
        reveal(isCorrect, answerText(), explainReason());
      });
      opts.appendChild(b);
    });
    root.appendChild(opts);
  }

  else if (q.type === "tap") {
    const hintEl = el("p", "q-hint", q.tap.hint ? tx(q.tap.hint) : t("tapToAnswer"));
    const diag = root.querySelector(".q-diagram");
    if (diag) root.insertBefore(hintEl, diag); else root.appendChild(hintEl);
    const targets = q.tap.targets || [];
    targets.forEach(tg => {
      const node = buildHit(tg, geo);
      if (!node) return;
      node.dataset.id = tg.id;
      node.classList.add("hit");
      node.setAttribute("tabindex", "0");
      const choose = () => {
        if (answered) return;
        const correct = tg.id === q.tap.correctId;
        // reveal the correct target as well
        targets.forEach(o => {
          const n = svgNode.querySelector(`.hit[data-id="${CSS.escape(o.id)}"]`);
          if (!n) return;
          n.classList.add("locked");
          if (o.id === q.tap.correctId) n.classList.add("show-correct");
        });
        node.classList.add(correct ? "show-correct" : "show-wrong");
        reveal(correct, answerText(), explainReason());
      };
      node.addEventListener("click", choose);
      node.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(); } });
      svgNode.appendChild(node);
    });
  }

  else if (q.type === "proof") {
    const steps = q.steps;                 // correct order
    const N = steps.length;
    root.appendChild(el("p", "q-hint", t("buildProof")));

    // shuffle the original indices for the bank
    const order = steps.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    let bank = order.slice();              // remaining indices, shuffled
    let slots = [];                        // placed indices, in placement order
    let locked = false;

    const slotsEl = el("div", "proof-slots");
    const bankEl = el("div", "proof-bank");
    const foot = el("div", "proof-foot");
    const resetBtn = el("button", "btn ghost small", t("resetProof"));
    const checkBtn = el("button", "btn primary small", t("checkProof"));
    foot.appendChild(resetBtn); foot.appendChild(checkBtn);
    root.appendChild(slotsEl);
    root.appendChild(el("div", "proof-seclabel", t("cardsLeft")));
    root.appendChild(bankEl);
    root.appendChild(foot);

    const cardHTML = i => { const st = steps[i], r = resolveR(st.r); return `<span class="pc-s">${tx(st.s)}</span>${r ? `<span class="pc-r">${r}</span>` : ""}`; };

    function render() {
      slotsEl.innerHTML = "";
      for (let p = 0; p < N; p++) {
        const slot = el("div", "proof-slot");
        slot.appendChild(el("span", "ps-num", String(p + 1)));
        const body = el("div", "ps-body");
        if (p < slots.length) {
          body.classList.add("filled");
          body.innerHTML = cardHTML(slots[p]);
          if (!locked) body.addEventListener("click", () => { const i = slots.splice(p, 1)[0]; bank.push(i); render(); });
        } else {
          body.classList.add("empty");
          body.textContent = p === slots.length ? t("tapToPlace") : "…";
        }
        slot.appendChild(body);
        slotsEl.appendChild(slot);
      }
      bankEl.innerHTML = "";
      bank.forEach(i => {
        const c = el("div", "proof-card");
        c.innerHTML = cardHTML(i);
        c.addEventListener("click", () => { if (locked || slots.length >= N) return; slots.push(i); bank = bank.filter(x => x !== i); render(); });
        bankEl.appendChild(c);
      });
      checkBtn.disabled = slots.length !== N;
    }
    resetBtn.addEventListener("click", () => { if (locked) return; bank = order.slice(); slots = []; render(); });
    checkBtn.addEventListener("click", () => {
      if (locked || slots.length !== N) return;
      locked = true;
      let matches = 0;
      [...slotsEl.querySelectorAll(".proof-slot")].forEach((slot, p) => {
        const ok = slots[p] === p;
        if (ok) matches++;
        slot.querySelector(".ps-body").classList.add(ok ? "ps-ok" : "ps-bad");
      });
      const frac = matches / N, full = matches === N;
      feedback.hidden = false;
      feedback.classList.add(full ? "good" : "bad");
      let html = `<div class="fb-head">${full ? "✓ " + t("proofCorrect") : `✗ ${matches}/${N} ${t("proofPartial")}`}</div>`;
      if (!full) {
        html += `<div class="fb-reason"><b>${t("correctOrder")}</b></div><div class="fb-steps">` +
          steps.map((st, i) => { const r = resolveR(st.r); return `<div class="fb-step"><span class="fb-s">${i + 1}. ${tx(st.s)}</span>${r ? `<span class="fb-sr">${r}</span>` : ""}</div>`; }).join("") + `</div>`;
      }
      feedback.innerHTML = html;
      bankEl.style.opacity = ".45";
      onAnswered(full, frac);
    });
    render();
  }

  hintWrap = buildHintBar(buildHintSteps());
  if (hintWrap) root.appendChild(hintWrap);
  root.appendChild(feedback);
  container.appendChild(root);
}

/* ------------------------------------------------------------
   The "Stuck? Get a hint" ladder. Reveals one step per tap so a
   learner who can't start still gets a foothold instead of quitting.
   ------------------------------------------------------------ */
function buildHintBar(steps) {
  if (!steps.length) return null;
  const wrap = el("div", "q-hints");
  const panel = el("div", "q-hint-panel");
  const btn = el("button", "btn ghost small hint-btn", "💡 " + t("needHint"));
  let shown = 0;
  btn.addEventListener("click", () => {
    if (shown >= steps.length) return;
    const step = el("div", "q-hint-step");
    step.innerHTML = `<span class="qh-n">${shown + 1}</span><span class="qh-body">${steps[shown]}</span>`;
    panel.appendChild(step);
    shown++;
    if (shown >= steps.length) { btn.textContent = "✓ " + t("hintNoMore"); btn.disabled = true; }
    else btn.textContent = "💡 " + t("anotherHint");
  });
  wrap.appendChild(panel);
  wrap.appendChild(btn);
  return wrap;
}

/* ------------------------------------------------------------
   Build a transparent, tappable SVG overlay for one target,
   positioned from the engine's resolved geometry.
   ------------------------------------------------------------ */
function buildHit(tg, geo) {
  const centre = { x: geo.cx, y: geo.cy };
  const P = name => (name === "O" ? centre : geo.pts[name]);

  switch (tg.kind) {
    case "chord":
    case "diameter":
    case "radius":
    case "line": {
      const a = P(tg.a || tg.from), b = P(tg.b || tg.to);
      if (!a || !b) return null;
      return svg("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, "stroke-width": 22, fill: "none", "data-shape": "stroke" });
    }
    case "tangentLine": {
      const tl = geo.tangentLines.find(t => t.at === tg.at);
      if (!tl) return null;
      return svg("line", { x1: tl.e1.x, y1: tl.e1.y, x2: tl.e2.x, y2: tl.e2.y, "stroke-width": 22, fill: "none", "data-shape": "stroke" });
    }
    case "tangentSeg": {
      const ts = geo.extTangents.find(s => s.from === tg.from && s.to === tg.to);
      if (!ts) return null;
      return svg("line", { x1: ts.p1.x, y1: ts.p1.y, x2: ts.p2.x, y2: ts.p2.y, "stroke-width": 22, fill: "none", "data-shape": "stroke" });
    }
    case "point":
    case "centre": {
      const p = tg.kind === "centre" ? centre : P(tg.p);
      if (!p) return null;
      return svg("circle", { cx: p.x, cy: p.y, r: 16, "data-shape": "fill" });
    }
    case "angle": {
      const a = geo.angles[tg.angleIndex];
      if (!a) return null;
      return svg("circle", { cx: a.hit.x, cy: a.hit.y, r: 18, "data-shape": "fill" });
    }
    case "circumference": {
      return svg("circle", { cx: geo.cx, cy: geo.cy, r: geo.R, "stroke-width": 16, fill: "none", "data-shape": "stroke" });
    }
    case "arc": {
      const d = arcPathStr(geo.cx, geo.cy, geo.R, tg.from, tg.to);
      return svg("path", { d, "stroke-width": 16, fill: "none", "data-shape": "stroke" });
    }
    case "sector": {
      const [x1, y1] = pol(geo.cx, geo.cy, geo.R, tg.from);
      const sweep = sweepOf(tg.from, tg.to);
      const [x2, y2] = pol(geo.cx, geo.cy, geo.R, tg.to);
      const d = `M ${geo.cx} ${geo.cy} L ${x1} ${y1} A ${geo.R} ${geo.R} 0 ${sweep > 180 ? 1 : 0} 0 ${x2} ${y2} Z`;
      return svg("path", { d, "data-shape": "fill" });
    }
    case "segment": {
      // region between chord (from->to) and its minor arc
      const [x1, y1] = pol(geo.cx, geo.cy, geo.R, tg.from);
      const [x2, y2] = pol(geo.cx, geo.cy, geo.R, tg.to);
      const sweep = sweepOf(tg.from, tg.to);
      const d = `M ${x1} ${y1} A ${geo.R} ${geo.R} 0 ${sweep > 180 ? 1 : 0} 0 ${x2} ${y2} Z`;
      return svg("path", { d, "data-shape": "fill" });
    }
    default:
      return null;
  }
}

function arcPathStr(cx, cy, r, from, to) {
  const sweep = sweepOf(from, to);
  const [x1, y1] = pol(cx, cy, r, from);
  const [x2, y2] = pol(cx, cy, r, to);
  return `M ${x1} ${y1} A ${r} ${r} 0 ${sweep > 180 ? 1 : 0} 0 ${x2} ${y2}`;
}
