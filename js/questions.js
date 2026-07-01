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
  // `misconception` (optional {en,af}) is a targeted nudge for ONE wrong answer:
  // when a learner picks that specific distractor, we lead the feedback with it,
  // so even learners who never tap a hint get the misconception addressed.
  function reveal(isCorrect, answerText, reasonText, chosen, misconception) {
    if (answered) return;
    answered = true;
    if (svgNode) svgNode.querySelectorAll(".q-hl").forEach(n => n.remove());   // clear the hint pulse
    if (hintWrap) hintWrap.hidden = true;
    feedback.hidden = false;
    feedback.classList.add(isCorrect ? "good" : "bad");
    const head = isCorrect ? t("correct") : t("notQuite");
    let html = `<div class="fb-head">${isCorrect ? "✓" : "✗"} ${head}</div>`;
    if (!isCorrect && misconception) html += `<div class="fb-nudge">💡 ${tx(misconception)}</div>`;
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
    onAnswered(isCorrect, isCorrect ? 1 : 0, chosen);
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
      ? q.options.map(o => ({ label: reason(o.code), correct: o.correct, misc: o.misconception }))
      : q.options.map(o => ({ label: tx(o.text), correct: o.correct, misc: o.misconception }));

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
        reveal(o.correct, answerText(), explainReason(), o.label, o.misc);
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
        reveal(isCorrect, answerText(), explainReason(), o.label);
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
        reveal(correct, answerText(), explainReason(), tg.id);
      };
      node.addEventListener("click", choose);
      node.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(); } });
      svgNode.appendChild(node);
    });
  }

  hintWrap = buildHintBar(buildHintSteps(), () => { if (geo && svgNode) highlightHintTargets(q, geo, svgNode, accent); });
  if (hintWrap) root.appendChild(hintWrap);
  root.appendChild(feedback);
  container.appendChild(root);
}

/* ------------------------------------------------------------
   The "Stuck? Get a hint" ladder. Reveals one step per tap so a
   learner who can't start still gets a foothold instead of quitting.
   ------------------------------------------------------------ */
function buildHintBar(steps, onFirstReveal) {
  if (!steps.length) return null;
  const wrap = el("div", "q-hints");
  const panel = el("div", "q-hint-panel");
  const btn = el("button", "btn ghost small hint-btn", "💡 " + t("needHint"));
  let shown = 0;
  btn.addEventListener("click", () => {
    if (shown >= steps.length) return;
    if (shown === 0 && typeof onFirstReveal === "function") onFirstReveal();   // pulse the angle on first hint
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
   When a hint opens, softly pulse the angle(s) the question is
   about, so the learner's eye lands on the right spot. Auto-derived:
   every deliberately MARKED angle (has a label, a custom colour, or a
   right-angle mark). For tap questions the tappable angles are excluded,
   so the answer is never given away. No diagram / no marked angle → nothing.
   ------------------------------------------------------------ */
function highlightHintTargets(q, geo, svgNode, accent) {
  if (svgNode.querySelector(".q-hl")) return;            // already drawn
  const spec = (q.diagram && q.diagram.angles) || [];
  const tapAngles = new Set();
  if (q.type === "tap" && q.tap) (q.tap.targets || []).forEach(tg => { if (tg.kind === "angle" && tg.angleIndex != null) tapAngles.add(tg.angleIndex); });
  const R = 30;
  geo.angles.forEach(ang => {
    const o = (spec[ang.index] && spec[ang.index].o) || {};
    const marked = (ang.t && ang.t.trim() !== "") || o.c || o.mark;
    if (!marked || tapAngles.has(ang.index)) return;
    const v = ang.vertex;
    const [x1, y1] = pol(v.x, v.y, R, ang.from);
    const [x2, y2] = pol(v.x, v.y, R, ang.from + ang.sweep);
    const large = ang.sweep > 180 ? 1 : 0;
    const d = `M ${Math.round(v.x)} ${Math.round(v.y)} L ${Math.round(x1)} ${Math.round(y1)} A ${R} ${R} 0 ${large} 0 ${Math.round(x2)} ${Math.round(y2)} Z`;
    svgNode.insertBefore(svg("path", { d, class: "q-hl", fill: accent }), svgNode.firstChild);   // behind the diagram
  });
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
