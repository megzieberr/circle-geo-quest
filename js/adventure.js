/* ============================================================
   ADVENTURE SCREENS  (Grand Master bonus challenges)
   ------------------------------------------------------------
   renderAdventures(app, host)        the Adventure tab landing
   renderAdventure(app, host, params) play one adventure

   Five game types:
     • values    — the reason is given; type each angle
     • reasons   — the statement is given; pick each reason
     • mixed     — fill BOTH the angle AND its reason per row
     • spoterror — one line of a worked solution is wrong; tap it
     • sayit     — build each reason word-for-word from fragments

   The first three share one field-based "complete the table" loop;
   spot-the-error and say-it have their own. XP mirrors the round
   economy and is submitted via api.submitRound under the adventure's
   id, so the server anti-farm gives it once.
   ============================================================ */
import { ADVENTURES, ADVENTURE_BY_ID } from "./adventures/index.js";
import { CONFIG } from "./config.js";
import { api } from "./api.js";
import { getSession } from "./session.js";
import { t, tx, reason } from "./i18n.js";
import { el, clear, mount, shuffled } from "./ui.js";
import { renderDiagram } from "./engine.js";

const nameOf = n => (typeof n === "string" ? n : tx(n));
const FIELDS = { values: ["value"], reasons: ["reason"], mixed: ["value", "reason"] };

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
    const tag = a.type === "reasons" ? `📝 ${t("fillReasons")}`
              : a.type === "values" ? `🔢 ${t("fillValues")}`
              : a.type === "mixed" ? `🎯 ${t("fillBoth")}`
              : a.type === "sayit" ? `🗣️ ${t("sayIt")}` : `🔍 ${t("spotError")}`;
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

  const prev = (app.state && app.state.progress) ? app.state.progress[adv.id] : null;
  const alreadyPassed = !!(prev && prev.passed);

  clear(host);
  const screen = el("div", "play adventure");
  screen.style.setProperty("--accent", adv.accent);

  const tag = adv.type === "reasons" ? "📝" : adv.type === "values" ? "🔢" : adv.type === "mixed" ? "🎯" : adv.type === "sayit" ? "🗣️" : "🔍";
  const top = el("div", "play-top");
  top.innerHTML = `<button class="link-btn quit">✕</button>
    <div class="play-title">${tx(adv.title)}</div>
    <div class="play-count">${tag}</div>`;
  top.querySelector(".quit").addEventListener("click", () => app.go("adventures"));
  screen.appendChild(top);

  const diag = el("div", "q-diagram");
  diag.innerHTML = renderDiagram(adv.diagram, adv.accent);
  screen.appendChild(diag);

  const hintText = adv.type === "reasons" ? t("advReasonsHint")
                 : adv.type === "values" ? t("advValuesHint")
                 : adv.type === "mixed" ? t("advMixedHint")
                 : adv.type === "sayit" ? t("advSayHint") : t("advSpotHint");
  screen.appendChild(el("p", "adv-instr", hintText));
  if (adv.given) screen.appendChild(el("div", "adv-given", "📌 " + tx(adv.given)));
  if (alreadyPassed) screen.appendChild(el("div", "replay-note", "🔁 " + t("replayNoXp")));

  const foot = el("div", "play-foot");
  host.appendChild(screen);

  if (adv.type === "spoterror") renderSpot(app, adv, screen, foot, alreadyPassed);
  else if (adv.type === "sayit") renderSayIt(app, adv, screen, foot, alreadyPassed);
  else renderTable(app, adv, screen, foot, alreadyPassed);
}

/* ---------- say it like the examiner: build each reason from fragments ----------
   The statement is given; the learner assembles the CAPS reason word-for-word
   by tapping fragment chips IN ORDER. Chips are the row's true parts plus
   decoy fragments (converses and classic wrong wordings), shuffled once.
   Tapping a placed fragment returns it to the bank. A row is correct only if
   the assembled sequence matches `parts` exactly. */
function renderSayIt(app, adv, screen, foot, alreadyPassed) {
  // chips carry their origin so grading is by identity: part j must sit in slot j
  const rows = adv.rows.map((def, i) => ({
    def, i,
    chips: shuffled([
      ...def.parts.map((p, j) => ({ frag: p, part: j })),
      ...(def.decoys || []).map(p => ({ frag: p, part: -1 })),
    ]),
    sel: [],                       // placed chips, in order
  }));
  let active = 0;
  let locked = false;

  const list = el("div", "adv-table say-list");
  const inputArea = el("div", "adv-input");
  const checkBtn = el("button", "btn primary big", t("check"));
  checkBtn.disabled = true;
  foot.appendChild(checkBtn);
  mount(screen, list, inputArea, foot);

  const rowFilled = r => r.sel.length === r.def.parts.length;
  const rowOK = r => rowFilled(r) && r.sel.every((c, j) => c.part === j);
  const allFilled = () => rows.every(rowFilled);
  const phrase = def => def.parts.map(tx).join(" ");

  function renderRows() {
    list.innerHTML = "";
    rows.forEach(r => {
      const isActive = !locked && r.i === active;
      const row = el("div", "adv-row say-row" + (isActive ? " active" : "") + (locked ? (rowOK(r) ? " row-ok" : " row-bad") : ""));
      row.appendChild(el("div", "adv-rowhead", `<span class="adv-stmt">${r.def.s}</span>`));
      const slots = el("div", "say-slots");
      r.def.parts.forEach((_, j) => {
        const c = r.sel[j];
        const slot = el("button", "say-slot" + (c ? " filled" : " empty"), c ? tx(c.frag) : "…");
        if (!locked) slot.addEventListener("click", () => {
          active = r.i;
          if (c) r.sel.splice(j, 1);       // take the fragment back
          sync();
        });
        slots.appendChild(slot);
      });
      row.appendChild(slots);
      if (locked && !rowOK(r)) row.appendChild(el("div", "adv-correct", "✓ " + phrase(r.def)));
      if (!locked) row.addEventListener("click", e => { if (e.target === row) { active = r.i; sync(); } });
      list.appendChild(row);
    });
  }

  function renderInput() {
    inputArea.innerHTML = "";
    if (locked) return;
    const r = rows[active];
    const wrap = el("div", "wordbank say-bank");
    r.chips.forEach(c => {
      const used = r.sel.includes(c);
      const chip = el("button", "wordchip" + (used ? " picked" : ""), tx(c.frag));
      chip.disabled = used;
      if (!used) chip.addEventListener("click", () => {
        if (rowFilled(r)) return;
        r.sel.push(c);
        if (rowFilled(r)) { const nx = rows.find(x => !rowFilled(x)); if (nx) active = nx.i; }
        sync();
      });
      wrap.appendChild(chip);
    });
    inputArea.appendChild(wrap);
  }

  function sync() { renderRows(); renderInput(); checkBtn.disabled = !allFilled(); }

  checkBtn.addEventListener("click", async () => {
    if (locked || !allFilled()) return;
    locked = true;
    const total = rows.length;
    const correct = rows.filter(rowOK).length;
    let xp = 0, streak = 0;
    rows.forEach(r => {
      if (rowOK(r)) { streak++; xp += CONFIG.xpPerCorrect + CONFIG.firstTryBonus + CONFIG.streakStep * Math.min(streak - 1, CONFIG.streakCap); }
      else streak = 0;
    });
    const gained = alreadyPassed ? 0 : xp;
    renderRows();
    inputArea.innerHTML = "";
    checkBtn.remove();
    const frac = total ? correct / total : 0;
    try { const s = getSession(); await api.submitRound(s.name, s.password, adv.id, { score: frac, xpGained: gained, total, correct }); } catch { /* offline */ }
    await app.refreshState();
    showResult(app, adv, screen, foot, { correct, total, gained, frac, alreadyPassed });
  });

  sync();
}

/* ---------- field-based table: values | reasons | mixed ---------- */
function renderTable(app, adv, screen, foot, alreadyPassed) {
  const fields = FIELDS[adv.type] || ["value"];
  const wantReason = fields.includes("reason");
  const wantValue = fields.includes("value");
  const accept = def => Array.isArray(def.reason) ? def.reason : [def.reason];

  const unit = adv.unit ?? "°";   // "" for lengths / solve-for-x adventures
  const rows = adv.rows.map((def, i) => ({ def, i, value: null, reasonVal: null }));
  const bank = wantReason ? shuffled(adv.bank || rows.flatMap(r => accept(r.def))) : null;

  const table = el("div", "adv-table");
  const inputArea = el("div", "adv-input");
  const checkBtn = el("button", "btn primary big", t("check"));
  checkBtn.disabled = true;
  foot.appendChild(checkBtn);
  mount(screen, table, inputArea, foot);

  let active = { row: 0, field: fields[0] };
  let locked = false;

  const valueOK = r => Number(r.value) === Number(r.def.value);
  const reasonOK = r => accept(r.def).includes(r.reasonVal);
  const rowOK = r => (!wantValue || valueOK(r)) && (!wantReason || reasonOK(r));
  const rowFilled = r => (!wantValue || (r.value != null && r.value !== "")) && (!wantReason || r.reasonVal != null);
  const allFilled = () => rows.every(rowFilled);

  function renderTableBody() {
    table.innerHTML = "";
    rows.forEach(r => {
      const isActive = !locked && r.i === active.row;
      const row = el("div", "adv-row" + (isActive ? " active" : "") + (locked ? (rowOK(r) ? " row-ok" : " row-bad") : ""));
      const head = el("div", "adv-rowhead");
      const stmt = adv.type === "reasons" ? `${nameOf(r.def.name)} = ${r.def.value}°` : `${nameOf(r.def.name)} = ?`;
      head.innerHTML = `<span class="adv-stmt">${stmt}</span>` +
        (adv.type === "values" ? `<span class="adv-reasongiven">${reason(accept(r.def)[0])}</span>` : "");
      row.appendChild(head);

      const slots = el("div", "adv-slots");
      if (wantValue) {
        const sel = isActive && active.field === "value";
        const vs = el("button", "adv-slot val" + (r.value == null ? " empty" : " filled") + (sel ? " sel" : ""));
        vs.innerHTML = r.value == null ? "?" : `${r.value}${unit}`;
        if (!locked) vs.addEventListener("click", () => { active = { row: r.i, field: "value" }; sync(); });
        slots.appendChild(vs);
      }
      if (wantReason) {
        const sel = isActive && active.field === "reason";
        const rs = el("button", "adv-slot reason-slot" + (r.reasonVal == null ? " empty" : " filled") + (sel ? " sel" : ""));
        rs.innerHTML = r.reasonVal == null ? t("advPickReason") : reason(r.reasonVal);
        if (!locked) rs.addEventListener("click", () => { active = { row: r.i, field: "reason" }; sync(); });
        slots.appendChild(rs);
      }
      row.appendChild(slots);

      if (locked && !rowOK(r)) {
        const corr = [];
        if (wantValue && !valueOK(r)) corr.push(`${r.def.value}${unit}`);
        if (wantReason && !reasonOK(r)) corr.push(accept(r.def).map(reason).join(" / "));
        row.appendChild(el("div", "adv-correct", "✓ " + corr.join(" · ")));
      }
      table.appendChild(row);
    });
  }

  function renderInput() {
    inputArea.innerHTML = "";
    if (locked) return;
    if (active.field === "reason") {
      const wrap = el("div", "wordbank reasons");
      bank.forEach(code => {
        const chip = el("button", "wordchip" + (rows[active.row].reasonVal === code ? " picked" : ""), reason(code));
        chip.addEventListener("click", () => { rows[active.row].reasonVal = code; advance(); });
        wrap.appendChild(chip);
      });
      inputArea.appendChild(wrap);
    } else {
      const pad = el("div", "numpad");
      let buf = rows[active.row].value != null ? String(rows[active.row].value) : "";
      const disp = el("div", "numpad-disp", buf || "0");
      const grid = el("div", "numpad-grid");
      ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "✓"].forEach(k => {
        const b = el("button", "numkey" + (k === "✓" ? " ok" : k === "⌫" ? " del" : ""), k);
        b.addEventListener("click", () => {
          if (k === "⌫") buf = buf.slice(0, -1);
          else if (k === "✓") { rows[active.row].value = buf === "" ? null : Number(buf); advance(); return; }
          else if (buf.length < 3) buf += k;
          disp.textContent = buf || "0";
          rows[active.row].value = buf === "" ? null : Number(buf);
          renderTableBody(); checkBtn.disabled = !allFilled();
        });
        grid.appendChild(b);
      });
      mount(pad, disp, grid);
      inputArea.appendChild(pad);
    }
  }

  function nextField() {
    const order = [];
    rows.forEach(r => fields.forEach(f => order.push({ row: r.i, field: f })));
    const cur = order.findIndex(o => o.row === active.row && o.field === active.field);
    for (let k = 1; k <= order.length; k++) {
      const o = order[(cur + k) % order.length];
      const filled = o.field === "value" ? (rows[o.row].value != null) : (rows[o.row].reasonVal != null);
      if (!filled) return o;
    }
    return active;
  }
  function advance() { active = nextField(); sync(); }
  function sync() { renderTableBody(); renderInput(); checkBtn.disabled = !allFilled(); }

  checkBtn.addEventListener("click", async () => {
    if (locked || !allFilled()) return;
    locked = true;
    const total = rows.length;
    const correct = rows.filter(rowOK).length;
    let xp = 0, streak = 0;
    rows.forEach(r => {
      if (rowOK(r)) { streak++; xp += CONFIG.xpPerCorrect + CONFIG.firstTryBonus + CONFIG.streakStep * Math.min(streak - 1, CONFIG.streakCap); }
      else streak = 0;
    });
    const gained = alreadyPassed ? 0 : xp;
    renderTableBody();
    inputArea.innerHTML = "";
    checkBtn.remove();
    const frac = total ? correct / total : 0;
    try { const s = getSession(); await api.submitRound(s.name, s.password, adv.id, { score: frac, xpGained: gained, total, correct }); } catch { /* offline */ }
    await app.refreshState();
    showResult(app, adv, screen, foot, { correct, total, gained, frac, alreadyPassed });
  });

  sync();
}

/* ---------- spot the error: tap the wrong line ---------- */
function renderSpot(app, adv, screen, foot, alreadyPassed) {
  const list = el("div", "spot-list");
  let locked = false;
  adv.lines.forEach((ln, i) => {
    const r = ln.r ? reason(ln.r) : "";
    const row = el("button", "spot-line");
    row.innerHTML = `<span class="spot-n">${i + 1}</span><span class="spot-s">${nameOf(ln.s)}</span>${r ? `<span class="spot-r">${r}</span>` : ""}`;
    row.addEventListener("click", async () => {
      if (locked) return;
      locked = true;
      const correct = i === adv.badLine;
      [...list.children].forEach((b, j) => { b.disabled = true; b.classList.add("locked"); if (j === adv.badLine) b.classList.add("spot-bad"); });
      if (!correct) row.classList.add("spot-pick-wrong");
      const gained = alreadyPassed ? 0 : (correct ? CONFIG.xpPerCorrect + CONFIG.firstTryBonus : 0);
      try { const s = getSession(); await api.submitRound(s.name, s.password, adv.id, { score: correct ? 1 : 0, xpGained: gained, total: 1, correct: correct ? 1 : 0 }); } catch { /* offline */ }
      await app.refreshState();
      screen.insertBefore(el("div", "card spot-fix", `<b>${correct ? "✓ " + t("advSpotCorrect") : t("advSpotWrong")}</b><br>${tx(adv.fix)}`), foot);
      showResult(app, adv, screen, foot, { correct: correct ? 1 : 0, total: 1, gained, frac: correct ? 1 : 0, alreadyPassed });
    });
    list.appendChild(row);
  });
  mount(screen, list, foot);
}

/* ---------- shared result card ---------- */
function showResult(app, adv, screen, foot, { correct, total, gained, frac, alreadyPassed }) {
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
