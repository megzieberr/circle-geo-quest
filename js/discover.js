/* ============================================================
   DISCOVERY SCREEN  (guided, not graded)
   ------------------------------------------------------------
   A discovery round is a sequence of `panels`. The learner drags
   the diagram to explore, then answers — and the game NEVER reveals
   the answer and moves on. Wrong twice → "not quite, try again";
   after the 3rd wrong it steps in with an escalating hint, and keeps
   scaffolding until the learner produces the answer themselves.

   No XP, unlimited retries. Finishing every panel marks the round
   complete (score = 1) which unlocks the next round and counts
   toward the group badge.

   Panel shapes:
     { type:"explore",  prompt, instruction, interactive }
     { type:"blank",    prompt, interactive?, sentence:[…], hints:[…], note?, reason? }
     { type:"choice",   prompt, interactive?, options:[{text,correct}], hints:[…], note?, reason? }
     { type:"note",     prompt, body, interactive?, reason? }

   A sentence is an array of strings and blank objects:
     "text"
     { kind:"word", answer:"right", options:[6+ words], accept?:[…] }
     { kind:"num",  answer:90, unit:"°" }
   ============================================================ */
import { ROUND_BY_ID } from "./rounds/index.js";
import { api } from "./api.js";
import { getSession } from "./session.js";
import { t, tx, reason as reasonText, REASONS, word as wordText } from "./i18n.js";
import { el, clear, mount } from "./ui.js";
import { mountInteractive } from "./interactive.js";
import { renderDiagram } from "./engine.js";

const HINT_AFTER = 3;   // wrong tries before the game steps in

export function renderDiscover(app, host, params) {
  const round = ROUND_BY_ID[params.roundId];
  if (!round) return app.go("home");
  const panels = round.panels || [];

  const prev = app.state?.progress?.[round.id];
  const alreadyDone = !!(prev && prev.passed);

  clear(host);
  const screen = el("div", "play discover");
  screen.style.setProperty("--accent", round.accent);
  const top = el("div", "play-top");
  top.innerHTML = `<button class="link-btn quit">✕</button>
    <div class="play-title">${tx(round.title)}</div>
    <div class="play-count"></div>`;
  top.querySelector(".quit").addEventListener("click", () => app.go("home"));
  const bar = el("div", "pbar"); bar.appendChild(el("i"));
  const stepHost = el("div", "discover-host");
  mount(screen, top, bar, stepHost);
  host.appendChild(screen);

  let i = 0;
  function show() {
    top.querySelector(".play-count").textContent = `${i + 1} / ${panels.length}`;
    bar.querySelector("i").style.width = Math.round((i / panels.length) * 100) + "%";
    clear(stepHost);
    mountPanel(stepHost, panels[i], round.accent, async () => {
      i++;
      if (i < panels.length) { window.scrollTo(0, 0); show(); }
      else await finish();
    });
  }

  async function finish() {
    bar.querySelector("i").style.width = "100%";
    let res = { ok: false };
    if (!alreadyDone) {
      try {
        const s = getSession();
        res = await api.submitRound(s.name, s.password, round.id, { score: 1, xpGained: 0, total: panels.length, correct: panels.length });
      } catch { /* offline — still let them through locally */ }
    }
    await app.refreshState();
    app.go("results", { roundId: round.id, discovery: true, correct: panels.length, total: panels.length, xp: 0, frac: 1, badgeEarned: !!(res && res.badgeEarned), alreadyPassed: alreadyDone });
  }

  show();
}

/* ---------------- one panel ---------------- */
function mountPanel(host, panel, accent, onDone) {
  const root = el("div", "dp");
  root.style.setProperty("--accent", accent);
  if (panel.prompt) root.appendChild(el("p", "q-prompt", tx(panel.prompt)));

  // diagram: live (draggable) or static
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

  // optional row of mini diagrams (e.g. two cases of a theorem, side by side)
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

  const advance = () => onDone();

  if (panel.type === "explore") {
    if (panel.instruction) body.appendChild(el("p", "dp-instruction", "👉 " + tx(panel.instruction)));
    cont.textContent = t("continue");
    // if the explore panel names a target, only unlock Continue once reached
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

  // ---- gated tasks: blank & choice ----
  cont.hidden = true;
  let wrong = 0;
  const hintBox = el("div", "dp-hint"); hintBox.hidden = true;
  const feedback = el("div", "dp-feedback"); feedback.hidden = true;

  function onWrong() {
    wrong++;
    feedback.hidden = false;
    feedback.className = "dp-feedback bad";
    feedback.textContent = wrong < HINT_AFTER ? t("notQuiteTry") : t("notQuiteThink");
    if (wrong >= HINT_AFTER) {
      const hints = panel.hints || [];
      const idx = Math.min(wrong - HINT_AFTER, hints.length - 1);
      if (hints.length) {
        hintBox.hidden = false;
        hintBox.innerHTML = `<span class="dp-hint-tag">💡 ${t("hint")}</span> ${tx(hints[idx])}`;
      }
    }
  }
  function onRight() {
    feedback.hidden = false;
    feedback.className = "dp-feedback good";
    feedback.textContent = "✓ " + t("youGotIt");
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
  }

  cont.addEventListener("click", advance);
}

function wrap(orig, extra) { return (m, p, c) => { if (orig) orig(m, p, c); extra(m, p, c); }; }

/* the formal teaching block shown after a correct discovery */
function noteBlock(panel) {
  const box = el("div", "dp-note");
  if (panel.reason) {
    const r = REASONS[panel.reason] ? reasonText(panel.reason) : panel.reason;
    box.appendChild(el("div", "dp-reason", `<span class="dp-reason-tag">${t("reasonLabel")}</span> <b>${r}</b>`));
  }
  if (panel.note) box.appendChild(el("div", "dp-note-body", tx(panel.note)));
  return box;
}

/* ---------------- blanks (word bank + number pad) ---------------- */
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
    if (!part.kind) { line.appendChild(document.createTextNode(tx(part))); return; }  // localized text
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
      // word bank — options are ids; we display the localized word (or reason
      // phrase) but match on the id, so it works in both languages and can't
      // be guessed by reading the answer off a chip.
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

  // setValue: for words, store the id but show the localized label
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
  };
}
