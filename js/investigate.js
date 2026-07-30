/* ============================================================
   INVESTIGATION STATION  🚂  (guided, and it PAYS XP)
   ------------------------------------------------------------
   A sibling of js/discover.js, not a replacement. Two differences,
   and they are the whole reason this file exists:

     1. IT AWARDS XP. Discovery rounds award zero (see discover.js
        finish()), and the cohort asked for XP. Rather than mutate
        discovery semantics — which would retroactively pay XP for
        11 existing rounds — this is a separate `investigate` kind.

     2. IT ACCEPTS TYPED ANSWERS. Every graded question in this app
        is a tap by design (js/questions.js: "No free-text entry
        anywhere"). That rule still holds there. The `written` panel
        below is the single exception, and it lives only here.

   XP IS FLAT PER STATION, not per panel and not scaled by attempts.
   The point of an investigation is to think it through, not to
   already know the answer — a learner who fights through five
   attempts per panel has investigated MORE than one who breezes it,
   and should not be paid less for it. Struggle is the product here.

   THE NEVER-STUCK LADDER IS LOAD-BEARING. 3 wrong → escalating
   static hint, 5 wrong → show the answer and move on. That ladder is
   what makes an occasionally-wrong text checker safe: the worst a
   misgrade can cost is one extra attempt. It can never block anyone.

   Panel shapes: everything discover.js supports —
     explore | blank | choice | note
   plus:
     { type:"written", panelId, prompt, placeholder, minChars,
       starters?, hints:[…], memoDisplay, note?, reason? }
   ============================================================ */
import { ROUND_BY_ID } from "./rounds/index.js";
import { submitRoundReliable } from "./sync.js";
import { getSession } from "./session.js";
import { CONFIG } from "./config.js";
import { t, tx, getLang, reason as reasonText, REASONS, word as wordText } from "./i18n.js";
import { el, clear, mount } from "./ui.js";
import { mountInteractive } from "./interactive.js";
import { renderDiagram } from "./engine.js";
import { checkAnswer, acceptOverride } from "./checker.js";

const HINT_AFTER = 3;
const REVEAL_AFTER = 5;

/* Chrome strings for the typed panel. Kept local rather than added to
   i18n.js — they exist only in this file and nothing else looks them up. */
const UI = {
  checking:    { en: "Checking…",                     af: "Kontroleer…" },
  sayMore:     { en: "Try saying a bit more than that.", af: "Probeer 'n bietjie meer sê as dit." },
  iThinkRight: { en: "I think my answer was right",   af: "Ek dink my antwoord was reg" },
  starters:    { en: "Stuck? Tap one to start:",      af: "Vasgevang? Tik een om te begin:" },
  writeMore:   { en: "Write a little more first",     af: "Skryf eers 'n bietjie meer" },
  memoLabel:   { en: "One good answer",               af: "Een goeie antwoord" },
};

export function renderInvestigate(app, host, params) {
  const round = ROUND_BY_ID[params.roundId];
  if (!round) return app.go("home");
  const panels = round.panels || [];

  const prev = app.state?.progress?.[round.id];
  const alreadyDone = !!(prev && prev.passed);

  clear(host);
  const screen = el("div", "play discover investigate");
  screen.style.setProperty("--accent", round.accent);
  const top = el("div", "play-top");
  top.innerHTML = `<button class="link-btn quit">✕</button>
    <div class="play-title">🚂 ${tx(round.title)}</div>
    <div class="play-count"></div>`;
  // ✕ goes back to the station map, not home — the learner came in off the
  // train strip, so that is the screen behind them.
  top.querySelector(".quit").addEventListener("click", () => app.go("stations"));
  const bar = el("div", "pbar"); bar.appendChild(el("i"));
  const stepHost = el("div", "discover-host");
  mount(screen, top, bar, stepHost);
  host.appendChild(screen);

  // Real first-try numbers, for the admin attempt-trajectory panel only.
  // api.js stores these as last_correct / last_total without scoring them,
  // so Megan keeps her struggle-vs-stuck signal while the learner is not
  // punished for having found it hard.
  let gatedTotal = 0;
  let firstTryCorrect = 0;

  let i = 0;
  function show() {
    top.querySelector(".play-count").textContent = `${i + 1} / ${panels.length}`;
    bar.querySelector("i").style.width = Math.round((i / panels.length) * 100) + "%";
    clear(stepHost);
    mountPanel(stepHost, panels[i], round.accent, (stats) => {
      if (stats && stats.gated) {
        gatedTotal++;
        if (stats.firstTry) firstTryCorrect++;
      }
      i++;
      if (i < panels.length) { window.scrollTo(0, 0); show(); }
      else finish();
    });
  }

  async function finish() {
    bar.querySelector("i").style.width = "100%";
    let res = { ok: false };
    if (!alreadyDone) {
      const s = getSession();
      res = await submitRoundReliable(s.name, s.password, round.id, {
        // COMPLETING IS PASSING. If XP is flat for finishing, gating the badge
        // on CONFIG.passThreshold would be a contradiction — full XP and no
        // badge. Matches discover.js exactly.
        score: 1,
        xpGained: CONFIG.investigationXp,
        total: gatedTotal || panels.length,
        correct: firstTryCorrect,
      });
    }
    await app.refreshState();
    app.go("results", {
      roundId: round.id,
      discovery: true,
      correct: firstTryCorrect,
      total: gatedTotal || panels.length,
      xp: alreadyDone ? 0 : CONFIG.investigationXp,
      frac: 1,
      badgeEarned: !!(res && res.badgeEarned),
      alreadyPassed: alreadyDone,
    });
  }

  show();
}

/* ---------------- one panel ---------------- */
function mountPanel(host, panel, accent, onDone) {
  const root = el("div", "dp");
  root.style.setProperty("--accent", accent);
  if (panel.prompt) root.appendChild(el("p", "q-prompt", tx(panel.prompt)));

  let iv = null;
  if (panel.interactive) {
    const box = el("div", "q-diagram iv-box");
    root.appendChild(box);
    iv = mountInteractive(box, panel.interactive);
  } else if (panel.diagram) {
    const box = el("div", "q-diagram");
    box.innerHTML = renderDiagram(panel.diagram, accent);
    root.appendChild(box);
  }

  if (panel.diagrams) {
    const row = el("div", "dp-diagrams");
    panel.diagrams.forEach(d => {
      const card = el("div", "dp-mini");
      card.innerHTML = renderDiagram(d.diagram, d.accent || accent) + (d.caption ? `<div class="dp-mini-cap">${tx(d.caption)}</div>` : "");
      row.appendChild(card);
    });
    root.appendChild(row);
  }

  const body = el("div", "dp-body");
  root.appendChild(body);
  const foot = el("div", "play-foot");
  const cont = el("button", "btn primary big", t("next"));
  foot.appendChild(cont);
  root.appendChild(foot);
  host.appendChild(root);

  let stats = { gated: false, firstTry: false };
  const advance = () => onDone(stats);

  if (panel.type === "explore") {
    if (panel.instruction) body.appendChild(el("p", "dp-instruction", "👉 " + tx(panel.instruction)));
    cont.textContent = t("continue");
    if (panel.until && iv) {
      cont.disabled = true;
      cont.classList.add("waiting");
      const tick = (m) => { if (panel.until(m)) { cont.disabled = false; cont.classList.remove("waiting"); } };
      panel.interactive.onChange = wrap(panel.interactive.onChange, tick);
      iv.refresh();
    }
    cont.addEventListener("click", advance);
    return;
  }

  if (panel.type === "note") {
    body.appendChild(noteBlock(panel));
    cont.textContent = t("continue");
    cont.addEventListener("click", advance);
    return;
  }

  // ---- gated tasks: blank, choice, written ----
  stats.gated = true;
  cont.hidden = true;
  let wrong = 0;
  let revealAnswer = null;
  const hintBox = el("div", "dp-hint"); hintBox.hidden = true;
  const feedback = el("div", "dp-feedback"); feedback.hidden = true;

  function onWrong(customMsg) {
    wrong++;
    feedback.hidden = false;
    feedback.className = "dp-feedback bad";
    // The checker's nudge replaces the generic message when we have one.
    // textContent, never innerHTML — model output must stay inert.
    feedback.textContent = customMsg || (wrong < HINT_AFTER ? t("notQuiteTry") : t("notQuiteThink"));
    if (wrong >= HINT_AFTER) {
      const hints = panel.hints || [];
      const idx = Math.min(wrong - HINT_AFTER, hints.length - 1);
      if (hints.length) {
        hintBox.hidden = false;
        hintBox.innerHTML = `<span class="dp-hint-tag">💡 ${t("hint")}</span> ${tx(hints[idx])}`;
      }
    }
    if (wrong >= REVEAL_AFTER && revealAnswer) revealAnswer();
  }
  function onRight() {
    stats.firstTry = (wrong === 0);
    feedback.hidden = false;
    feedback.className = "dp-feedback good";
    feedback.textContent = "✓ " + t("youGotIt");
    if (panel.note || panel.reason) body.appendChild(noteBlock(panel));
    cont.hidden = false;
    cont.textContent = t("continue");
    cont.focus();
  }
  function showRevealed() {
    feedback.hidden = false;
    feedback.className = "dp-feedback revealed";
    feedback.textContent = "💡 " + t("hereIsAnswer");
    if (panel.note || panel.reason) body.appendChild(noteBlock(panel));
    cont.hidden = false;
    cont.textContent = t("continue");
    cont.focus();
  }

  if (panel.type === "blank") {
    const fill = mountBlanks(body, panel.sentence, () => check.disabled = !allFilled());
    const allFilled = fill.allFilled;
    const check = el("button", "btn primary", t("check"));
    check.disabled = true;
    body.appendChild(hintBox);
    body.appendChild(check);
    body.appendChild(feedback);
    let locked = false;
    check.addEventListener("click", () => {
      if (locked || !allFilled()) return;
      if (fill.correct()) { locked = true; fill.lock(true); check.disabled = true; check.hidden = true; onRight(); }
      else { fill.flagWrong(); onWrong(); }
    });
    revealAnswer = () => {
      if (locked) return;
      locked = true;
      fill.revealCorrect();
      check.disabled = true; check.hidden = true;
      showRevealed();
    };
  }

  else if (panel.type === "choice") {
    const opts = el("div", "q-options");
    let locked = false;
    panel.options.forEach(o => {
      const b = el("button", "opt", tx(o.text));
      b.addEventListener("click", () => {
        if (locked) return;
        if (o.correct) { locked = true; b.classList.add("is-correct"); opts.querySelectorAll(".opt").forEach(x => x.disabled = true); onRight(); }
        else { b.classList.add("is-wrong"); b.disabled = true; onWrong(); }
      });
      opts.appendChild(b);
    });
    body.appendChild(opts);
    body.appendChild(hintBox);
    body.appendChild(feedback);
    revealAnswer = () => {
      if (locked) return;
      locked = true;
      [...opts.children].forEach((b, i) => { b.disabled = true; if (panel.options[i].correct) b.classList.add("is-correct"); });
      showRevealed();
    };
  }

  // ---- the typed panel ----
  else if (panel.type === "written") {
    const minChars = panel.minChars ?? 15;
    let locked = false;

    const ta = el("textarea", "dp-written");
    ta.setAttribute("maxlength", "600");
    ta.setAttribute("rows", "4");
    ta.placeholder = panel.placeholder ? tx(panel.placeholder) : "";
    body.appendChild(ta);

    // tap-to-insert sentence openers — they cut the blank-page problem for
    // weaker learners and cost nothing
    if (panel.starters?.length) {
      body.appendChild(el("p", "dp-starter-label", tx(UI.starters)));
      const row = el("div", "dp-starters");
      panel.starters.forEach(s => {
        const chip = el("button", "dp-starter", tx(s));
        chip.addEventListener("click", () => {
          if (locked) return;
          const text = tx(s);
          const at = ta.selectionStart ?? ta.value.length;
          ta.value = ta.value.slice(0, at) + text + ta.value.slice(ta.selectionEnd ?? at);
          ta.focus();
          ta.selectionStart = ta.selectionEnd = at + text.length;
          sync();
        });
        row.appendChild(chip);
      });
      body.appendChild(row);
    }

    const check = el("button", "btn primary", t("check"));
    check.disabled = true;
    check.title = tx(UI.writeMore);
    body.appendChild(hintBox);
    body.appendChild(check);
    body.appendChild(feedback);

    // the escape hatch: one tap accepts the answer, advances, and logs the
    // event for Megan to review. It removes the last way the checker can be
    // unfair, and learners use it honestly far more often than not.
    const escape = el("button", "link-btn dp-override", tx(UI.iThinkRight));
    escape.hidden = true;
    body.appendChild(escape);

    const sync = () => { check.disabled = ta.value.trim().length < minChars; };
    ta.addEventListener("input", sync);

    escape.addEventListener("click", async () => {
      if (locked) return;
      locked = true;
      escape.hidden = true;
      ta.disabled = true;
      check.hidden = true;
      acceptOverride({ panelId: panel.panelId, answer: ta.value.trim(), lang: getLang() });
      onRight();
    });

    check.addEventListener("click", async () => {
      if (locked) return;
      const answer = ta.value.trim();
      if (answer.length < minChars) return;

      check.disabled = true;
      ta.disabled = true;
      feedback.hidden = false;
      feedback.className = "dp-feedback checking";
      feedback.textContent = tx(UI.checking);

      const res = await checkAnswer({ panelId: panel.panelId, answer, lang: getLang() });

      // null = checker unavailable (offline, timeout, cost cap, no key).
      // Fall straight through to the static hint chain. No error screen,
      // no dead end, and no mention of the checker to the learner.
      if (!res) {
        ta.disabled = false;
        check.disabled = false;
        onWrong();
        escape.hidden = false;
        return;
      }

      if (res.verdict === "got_it") {
        locked = true;
        check.hidden = true;
        escape.hidden = true;
        onRight();
        return;
      }

      ta.disabled = false;
      check.disabled = false;
      // "unclear" gets the generic say-more prompt; partly / not_yet get the
      // model's nudge, which points at the gap without giving the answer.
      onWrong(res.verdict === "unclear" ? tx(UI.sayMore) : (res.nudge || undefined));
      escape.hidden = false;
      ta.focus();
    });

    revealAnswer = () => {
      if (locked) return;
      locked = true;
      ta.disabled = true;
      check.hidden = true;
      escape.hidden = true;
      if (panel.memoDisplay) {
        const memo = el("div", "dp-memo");
        memo.appendChild(el("div", "dp-memo-tag", tx(UI.memoLabel)));
        memo.appendChild(el("div", "dp-memo-body", tx(panel.memoDisplay)));
        body.appendChild(memo);
      }
      showRevealed();
    };
  }

  cont.addEventListener("click", advance);
}

function wrap(orig, extra) { return (m, p, c) => { if (orig) orig(m, p, c); extra(m, p, c); }; }

function noteBlock(panel) {
  const box = el("div", "dp-note");
  if (panel.reason) {
    const r = REASONS[panel.reason] ? reasonText(panel.reason) : panel.reason;
    box.appendChild(el("div", "dp-reason", `<span class="dp-reason-tag">${t("reasonLabel")}</span> <b>${r}</b>`));
  }
  if (panel.note) box.appendChild(el("div", "dp-note-body", tx(panel.note)));
  return box;
}

/* ---------------- blanks (word bank + number pad) ----------------
   Identical to discover.js. Deliberately duplicated rather than
   exported from there: discover.js is the frozen, shipped discovery
   engine for 11 live rounds, and this file must be free to change
   without any chance of touching them. */
function mountBlanks(host, sentence, onFill) {
  const line = el("p", "dp-sentence");
  const slots = [];
  let active = null;

  function selectSlot(s) {
    active = s;
    slots.forEach(x => x.node.classList.toggle("active", x === s));
    renderInput();
  }

  sentence.forEach(part => {
    if (typeof part === "string") { line.appendChild(document.createTextNode(part)); return; }
    if (!part.kind) { line.appendChild(document.createTextNode(tx(part))); return; }
    const node = el("button", "dp-slot empty");
    node.textContent = "?";
    const slot = { def: part, node, value: null };
    node.addEventListener("click", () => { if (!locked) selectSlot(slot); });
    slots.push(slot);
    line.appendChild(node);
  });
  host.appendChild(line);

  const input = el("div", "dp-input");
  host.appendChild(input);
  let locked = false;

  function renderInput() {
    input.replaceChildren();
    if (!active) { input.appendChild(el("p", "dp-input-hint", t("tapBlank"))); return; }
    if (active.def.kind === "num") {
      const pad = el("div", "numpad");
      let buf = (active.value != null ? String(active.value) : "");
      const disp = el("div", "numpad-disp", buf || "0");
      const keys = ["1","2","3","4","5","6","7","8","9","⌫","0","✓"];
      const grid = el("div", "numpad-grid");
      keys.forEach(k => {
        const b = el("button", "numkey" + (k === "✓" ? " ok" : k === "⌫" ? " del" : ""), k);
        b.addEventListener("click", () => {
          if (k === "⌫") buf = buf.slice(0, -1);
          else if (k === "✓") { setValue(active, buf === "" ? null : Number(buf)); return; }
          else if (buf.length < 4) buf += k;
          disp.textContent = buf || "0";
          setValue(active, buf === "" ? null : Number(buf));
        });
        grid.appendChild(b);
      });
      pad.appendChild(disp); pad.appendChild(grid);
      input.appendChild(pad);
    } else {
      const lbl = id => active.def.kind === "reason" ? reasonText(id) : wordText(id);
      const bank = el("div", "wordbank" + (active.def.kind === "reason" ? " reasons" : ""));
      active.def.options.forEach(id => {
        const b = el("button", "wordchip" + (active.value === id ? " picked" : ""), lbl(id));
        b.addEventListener("click", () => { setValue(active, id, lbl(id)); bank.querySelectorAll(".wordchip").forEach(x => x.classList.remove("picked")); b.classList.add("picked"); });
        bank.appendChild(b);
      });
      input.appendChild(bank);
    }
  }

  function setValue(s, v, label) {
    s.value = v;
    s.node.textContent = v == null ? "?" : (s.def.kind === "num" ? (v + (s.def.unit || "")) : (label ?? wordText(v)));
    s.node.classList.toggle("empty", v == null);
    s.node.classList.remove("wrong");
    onFill();
  }

  renderInput();
  if (slots.length) selectSlot(slots[0]);

  const isRight = s => s.def.kind === "num"
    ? Number(s.value) === Number(s.def.answer)
    : [s.def.answer, ...(s.def.accept || [])].includes(s.value);
  return {
    allFilled: () => slots.every(s => s.value != null && s.value !== ""),
    correct: () => slots.every(isRight),
    flagWrong: () => slots.forEach(s => { if (!isRight(s)) s.node.classList.add("wrong"); }),
    lock: () => { locked = true; slots.forEach(s => s.node.classList.add("done")); active = null; input.replaceChildren(); },
    revealCorrect: () => {
      slots.forEach(s => {
        const ans = s.def.answer;
        const label = s.def.kind === "num" ? undefined : (s.def.kind === "reason" ? reasonText(ans) : wordText(ans));
        setValue(s, ans, label);
        s.node.classList.remove("wrong");
        s.node.classList.add("done", "revealed");
      });
      locked = true; active = null; input.replaceChildren();
    },
  };
}
