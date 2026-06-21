/* ============================================================
   FIX-MY-MISTAKES
   ------------------------------------------------------------
   Every graded question a learner gets wrong is remembered in a
   small per-learner localStorage pile. They can re-attempt just
   those questions; getting one right removes it from the pile.

   Error-focused retrieval is one of the highest-yield study moves,
   and it turns a 60% round from a dead end into a path to mastery.
   No XP and no server calls — this is private practice that can't
   touch the leaderboard economy.
   ============================================================ */
import { QUESTION_BY_ID } from "./rounds/index.js";
import { t, tx } from "./i18n.js";
import { el, clear, mount, shuffled, progressBar } from "./ui.js";
import { mountQuestion } from "./questions.js";

const CAP = 150;                                   // keep the pile bounded
const keyFor = app => `cgg.mistakes.${(app && app.state && app.state.student && app.state.student.id) || "anon"}`;

function read(app) { try { return JSON.parse(localStorage.getItem(keyFor(app))) || []; } catch { return []; } }
function write(app, list) { try { localStorage.setItem(keyFor(app), JSON.stringify(list.slice(-CAP))); } catch { /* quota — ignore */ } }

/* current pile, dropping any ids that no longer exist in the bank */
export function getMistakes(app) { return read(app).filter(m => m && QUESTION_BY_ID[m.qid]); }
export function mistakeCount(app) { return getMistakes(app).length; }

export function addMistake(app, qid, roundId) {
  if (!QUESTION_BY_ID[qid]) return;
  const list = read(app).filter(m => m.qid !== qid);   // move-to-end, no dupes
  list.push({ qid, roundId, ts: Date.now() });
  write(app, list);
}
export function clearMistake(app, qid) { write(app, read(app).filter(m => m.qid !== qid)); }

/* ---------------- FIX SCREEN ---------------- */
export function renderFixMistakes(app, host) {
  const items = shuffled(getMistakes(app));
  clear(host);

  if (!items.length) {
    const card = el("div", "card center fix-empty");
    card.innerHTML = `<div class="result-emoji">🎉</div><h2>${t("fixNone")}</h2><p class="muted">${t("fixEmptyHint")}</p>`;
    const back = el("button", "btn primary", "← " + t("backHome"));
    back.addEventListener("click", () => app.go("home"));
    card.appendChild(back);
    host.appendChild(card);
    return;
  }

  const state = { i: 0, cleared: 0, total: items.length };
  const screen = el("div", "play");
  const top = el("div", "play-top");
  top.innerHTML = `<button class="link-btn quit">✕</button>
    <div class="play-title">🩹 ${t("fixMistakes")}</div>
    <div class="play-count"></div>`;
  top.querySelector(".quit").addEventListener("click", () => app.go("home"));
  const bar = progressBar(0);
  const qhost = el("div", "q-host");
  const footer = el("div", "play-foot");
  const note = el("div", "xp-pop");
  const next = el("button", "btn primary big next", t("next"));
  next.hidden = true;
  mount(footer, note, next);
  mount(screen, top, bar, qhost, footer);
  host.appendChild(screen);

  function show() {
    const entry = QUESTION_BY_ID[items[state.i].qid];
    screen.style.setProperty("--accent", entry.accent || "#4263eb");
    top.querySelector(".play-count").textContent = `${state.i + 1} ${t("of")} ${state.total}`;
    bar.querySelector("i").style.width = Math.round((state.i / state.total) * 100) + "%";
    next.hidden = true; note.textContent = ""; note.className = "xp-pop";
    clear(qhost);
    qhost.appendChild(el("p", "fix-from", `${t("fixFromRound")} ${entry.roundN} · ${tx(entry.title)}`));
    const qbox = el("div");
    qhost.appendChild(qbox);
    mountQuestion(qbox, entry.q, (isCorrect) => {
      if (isCorrect) { clearMistake(app, items[state.i].qid); state.cleared++; note.classList.add("good"); note.textContent = "✓ " + t("fixCleared"); }
      else { note.classList.add("bad"); note.textContent = t("notQuite"); }
      next.hidden = false;
      next.textContent = state.i + 1 < state.total ? t("next") : t("finish");
      next.focus();
    });
  }

  next.addEventListener("click", () => {
    state.i++;
    if (state.i < state.total) { window.scrollTo(0, 0); show(); }
    else finish();
  });

  function finish() {
    clear(host);
    const remaining = mistakeCount(app);
    const allClear = remaining === 0;
    const card = el("div", "card center");
    card.innerHTML = `
      <div class="result-emoji">${allClear ? "🌟" : "💪"}</div>
      <h1>${t("fixComplete")}</h1>
      <div class="result-pills"><span class="pill xp">✓ ${state.cleared} ${t("fixCleared")}</span>${remaining ? `<span class="pill">${remaining} ${t("fixStillToGo")}</span>` : ""}</div>
      <div class="result-msg good">${allClear ? t("fixAllClear") : t("fixCardBlurb")}</div>`;
    const actions = el("div", "result-actions");
    const home = el("button", "btn primary", t("backHome"));
    home.addEventListener("click", () => app.go("home"));
    actions.appendChild(home);
    if (remaining) { const again = el("button", "btn ghost", t("fixStart")); again.addEventListener("click", () => app.go("fix")); actions.appendChild(again); }
    card.appendChild(actions);
    host.appendChild(card);
  }

  show();
}
