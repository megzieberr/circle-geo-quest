/* ============================================================
   ADVENTURE SCREENS  (Grand Master bonus challenges)
   ------------------------------------------------------------
   renderAdventures(app, host)        the Adventure tab landing
   renderAdventure(app, host, params) play one adventure

   Both game types share one "complete the table" loop:
     • tap a row to make it active
     • fill it from the input area (reason bank, or number pad)
     • Check → grade every row, award XP, show the result inline

   XP mirrors the round economy: 10 per correct row + first-try and
   streak bonuses (CONFIG). XP is submitted via api.submitRound under
   the adventure's id, so the server's anti-farm gives it once.
   ============================================================ */
import { ADVENTURES, ADVENTURE_BY_ID } from "./adventures/index.js";
import { CONFIG } from "./config.js";
import { api } from "./api.js";
import { getSession } from "./session.js";
import { t, tx, reason } from "./i18n.js";
import { el, clear, mount, shuffled } from "./ui.js";
import { renderDiagram } from "./engine.js";

const nameOf = n => (typeof n === "string" ? n : tx(n));

/* ---------------- ADVENTURE LIST ---------------- */
export function renderAdventures(app, host) {
  clear(host);
  const progress = (app.state && app.state.progress) || {};

  const head = el("div", "home-head");
  head.innerHTML = `
    <span class="eyebrow">${t("grandMasterArena")}</span>
    <h1>🗺️ ${t("adventures")}</h1>
    <p class="muted">${t("adventuresBlurb")}</p>`;
  host.appendChild(head);

  const grid = el("div", "round-grid");
  ADVENTURES.forEach(a => {
    const p = progress[a.id];
    const done = !!(p && p.passed);
    const card = el("article", "round-card adv-card" + (done ? " done" : ""));
    card.style.setProperty("--accent", a.accent);
    const tag = a.type === "reasons" ? `📝 ${t("fillReasons")}` : `🔢 ${t("fillValues")}`;
    card.innerHTML = `
      <div class="rc-top"><span class="rc-kind">${tag}</span>${done ? '<span class="rc-badge" title="Done">✓</span>' : ""}</div>
      <h3>${tx(a.title)}</h3>
      <p>${tx(a.blurb)}</p>
      <div class="rc-foot"></div>`;
    const foot = card.querySelector(".rc-foot");
    const btn = el("button", "btn primary small", done ? t("replay") : t("play"));
    btn.addEventListener("click", () => app.go("adventure", { advId: a.id }));
    foot.appendChild(btn);
    grid.appendChild(card);
  });
  host.appendChild(grid);

  const back = el("button", "btn ghost", "← " + t("backHome"));
  back.style.marginTop = "18px";
  back.addEventListener("click", () => app.go("home"));
  host.appendChild(back);
}

/* ---------------- PLAY ONE ADVENTURE ---------------- */
export function renderAdventure(app, host, params) {
  const adv = ADVENTURE_BY_ID[params.advId];
  if (!adv) return app.go("adventures");
  const isReasons = adv.type === "reasons";

  const prev = (app.state && app.state.progress) ? app.state.progress[adv.id] : null;
  const alreadyPassed = !!(prev && prev.passed);

  clear(host);
  const screen = el("div", "play adventure");
  screen.style.setProperty("--accent", adv.accent);

  const top = el("div", "play-top");
  top.innerHTML = `<button class="link-btn quit">✕</button>
    <div class="play-title">${tx(adv.title)}</div>
    <div class="play-count">${isReasons ? "📝" : "🔢"}</div>`;
  top.querySelector(".quit").addEventListener("click", () => app.go("adventures"));
  screen.appendChild(top);

  const diag = el("div", "q-diagram");
  diag.innerHTML = renderDiagram(adv.diagram, adv.accent);
  screen.appendChild(diag);

  screen.appendChild(el("p", "adv-instr", isReasons ? t("advReasonsHint") : t("advValuesHint")));
  if (adv.given) screen.appendChild(el("div", "adv-given", "📌 " + tx(adv.given)));
  if (alreadyPassed) screen.appendChild(el("div", "replay-note", "🔁 " + t("replayNoXp")));

  const table = el("div", "adv-table");
  const inputArea = el("div", "adv-input");
  const foot = el("div", "play-foot");
  const checkBtn = el("button", "btn primary big", t("check"));
  checkBtn.disabled = true;
  foot.appendChild(checkBtn);
  mount(screen, table, inputArea, foot);
  host.appendChild(screen);

  // row working state: value holds a reason code (reasons) or a number (values)
  const rows = adv.rows.map((def, i) => ({ def, i, value: null }));
  const accept = def => Array.isArray(def.reason) ? def.reason : [def.reason];   // a row may accept more than one valid reason
  const bank = isReasons ? shuffled(adv.bank || rows.flatMap(r => accept(r.def))) : null;
  let active = 0;
  let locked = false;

  const isCorrect = r => isReasons ? accept(r.def).includes(r.value) : Number(r.value) === Number(r.def.value);
  const allFilled = () => rows.every(r => r.value != null && r.value !== "");

  function renderTable() {
    table.innerHTML = "";
    rows.forEach(r => {
      const row = el("div", "adv-row" + (r.i === active && !locked ? " active" : "") +
        (locked ? (isCorrect(r) ? " row-ok" : " row-bad") : ""));
      const head = el("div", "adv-rowhead");
      const stmt = isReasons ? `${nameOf(r.def.name)} = ${r.def.value}°` : `${nameOf(r.def.name)} = ?`;
      head.innerHTML = `<span class="adv-stmt">${stmt}</span>` +
        (!isReasons ? `<span class="adv-reasongiven">${reason(accept(r.def)[0])}</span>` : "");
      row.appendChild(head);

      const slot = el("button", "adv-slot" + (r.value == null ? " empty" : " filled"));
      slot.innerHTML = r.value == null
        ? (isReasons ? t("advPickReason") : "?")
        : (isReasons ? reason(r.value) : `${r.value}°`);
      if (!locked) slot.addEventListener("click", () => { active = r.i; sync(); });
      row.appendChild(slot);

      if (locked && !isCorrect(r)) {
        row.appendChild(el("div", "adv-correct",
          `✓ ${isReasons ? accept(r.def).map(reason).join(" / ") : r.def.value + "°"}`));
      }
      table.appendChild(row);
    });
  }

  function renderInput() {
    inputArea.innerHTML = "";
    if (locked) return;
    if (isReasons) {
      const wrap = el("div", "wordbank reasons");
      bank.forEach(code => {
        const chip = el("button", "wordchip" + (rows[active].value === code ? " picked" : ""), reason(code));
        chip.addEventListener("click", () => { rows[active].value = code; advance(); });
        wrap.appendChild(chip);
      });
      inputArea.appendChild(wrap);
    } else {
      const pad = el("div", "numpad");
      let buf = rows[active].value != null ? String(rows[active].value) : "";
      const disp = el("div", "numpad-disp", buf || "0");
      const grid = el("div", "numpad-grid");
      ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "✓"].forEach(k => {
        const b = el("button", "numkey" + (k === "✓" ? " ok" : k === "⌫" ? " del" : ""), k);
        b.addEventListener("click", () => {
          if (k === "⌫") buf = buf.slice(0, -1);
          else if (k === "✓") { rows[active].value = buf === "" ? null : Number(buf); advance(); return; }
          else if (buf.length < 3) buf += k;
          disp.textContent = buf || "0";
          rows[active].value = buf === "" ? null : Number(buf);
          renderTable(); checkBtn.disabled = !allFilled();
        });
        grid.appendChild(b);
      });
      mount(pad, disp, grid);
      inputArea.appendChild(pad);
    }
  }

  function advance() {
    const after = rows.findIndex((r, idx) => idx > active && r.value == null);
    const anyEmpty = rows.findIndex(r => r.value == null);
    active = after >= 0 ? after : (anyEmpty >= 0 ? anyEmpty : active);
    sync();
  }
  function sync() { renderTable(); renderInput(); checkBtn.disabled = !allFilled(); }

  checkBtn.addEventListener("click", async () => {
    if (locked || !allFilled()) return;
    locked = true;
    const total = rows.length;
    const correct = rows.filter(isCorrect).length;

    // XP: per correct row, mirroring the round economy (correct + first-try + streak)
    let xp = 0, streak = 0;
    rows.forEach(r => {
      if (isCorrect(r)) {
        streak++;
        xp += CONFIG.xpPerCorrect + CONFIG.firstTryBonus;
        xp += CONFIG.streakStep * Math.min(streak - 1, CONFIG.streakCap);
      } else streak = 0;
    });
    const gained = alreadyPassed ? 0 : xp;

    renderTable();
    inputArea.innerHTML = "";
    checkBtn.remove();

    const frac = total ? correct / total : 0;
    try {
      const s = getSession();
      await api.submitRound(s.name, s.password, adv.id, { score: frac, xpGained: gained, total, correct });
    } catch { /* offline — still show the local result */ }
    await app.refreshState();
    showResult({ correct, total, gained, frac });
  });

  function showResult({ correct, total, gained, frac }) {
    const passed = frac >= CONFIG.passThreshold;
    const card = el("div", "card adv-result");
    card.innerHTML = `
      <div class="result-emoji">${passed ? "🎉" : "💪"}</div>
      <h2>${correct} / ${total} ${t("correctRows")}</h2>
      <div class="result-pills"><span class="pill xp">★ +${gained} ${t("xpEarned")}</span></div>
      <div class="result-msg ${passed ? "good" : "warn"}">${passed ? t("advCleared") : t("advTryAgainMsg")}</div>
      ${alreadyPassed ? `<div class="result-msg note">🔁 ${t("replayNoXpMsg")}</div>` : ""}`;
    foot.innerHTML = "";
    const more = el("button", "btn primary big", "🗺️ " + t("adventures"));
    more.addEventListener("click", () => app.go("adventures"));
    const retry = el("button", "btn ghost", t("tryAgain"));
    retry.addEventListener("click", () => app.go("adventure", { advId: adv.id }));
    mount(foot, more, retry);
    screen.insertBefore(card, foot);
    card.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  sync();
}
