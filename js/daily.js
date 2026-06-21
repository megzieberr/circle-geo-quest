/* ============================================================
   DAILY CHALLENGE  (spaced retrieval + a day-streak)
   ------------------------------------------------------------
   Five quick questions, interleaved from theorems the learner has
   ALREADY passed. The point is spaced, mixed retrieval — far better
   for remembering geometry in the exam than one big cram — plus a
   day-streak that gives them a reason to open the app every day of
   the holiday, which is the real battle with homework done alone.

   The set is fixed per local day (no re-rolling for an easier draw),
   and a wrong answer drops into the Fix-My-Mistakes pile so weak
   spots resurface. Reward here is the streak itself: no leaderboard
   XP in phase 1, so the server economy is untouched.
   ============================================================ */
import { ROUNDS, QUESTION_BANK, QUESTION_BY_ID } from "./rounds/index.js";
import { t, tx } from "./i18n.js";
import { el, clear, mount, shuffled, progressBar } from "./ui.js";
import { mountQuestion } from "./questions.js";
import { addMistake, clearMistake } from "./mistakes.js";

const SIZE = 5;
const keyFor = app => `cgg.daily.${(app && app.state && app.state.student && app.state.student.id) || "anon"}`;

/* local calendar day as YYYY-MM-DD (local time, not UTC) */
function localDay(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function dayBefore(dayStr) {
  const [y, m, d] = dayStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() - 1);
  return localDay(dt);
}

const DEFAULT = { streak: 0, best: 0, lastDay: null, setDay: null, set: [], doneDay: null };
function read(app) { try { return { ...DEFAULT, ...(JSON.parse(localStorage.getItem(keyFor(app))) || {}) }; } catch { return { ...DEFAULT }; } }
function write(app, st) { try { localStorage.setItem(keyFor(app), JSON.stringify(st)); } catch { /* ignore */ } }

/* rounds the learner has passed (these hold the "fresh" material) */
function passedQuestionPool(app) {
  const progress = (app.state && app.state.progress) || {};
  const passed = new Set(ROUNDS.filter(r => progress[r.id] && progress[r.id].passed).map(r => r.id));
  return QUESTION_BANK.filter(e => passed.has(e.roundId));
}

export function dailyUnlocked(app) { return passedQuestionPool(app).length > 0; }
export function getDaily(app) { return read(app); }
export function isDoneToday(app) { return read(app).doneDay === localDay(); }

/* Pick (and remember for the day) an interleaved set of question ids,
   spreading picks across as many different rounds as possible. */
function todaySet(app) {
  const st = read(app);
  const today = localDay();
  if (st.setDay === today && Array.isArray(st.set) && st.set.length && st.set.every(id => QUESTION_BY_ID[id])) {
    return st.set;
  }
  const pool = passedQuestionPool(app);
  // bucket by round, shuffle each, then round-robin so the 5 are spread out
  const byRound = {};
  shuffled(pool).forEach(e => { (byRound[e.roundId] || (byRound[e.roundId] = [])).push(e); });
  const buckets = shuffled(Object.values(byRound));
  const picks = [];
  let added = true;
  while (picks.length < SIZE && added) {
    added = false;
    for (const b of buckets) { if (b.length) { picks.push(b.shift()); added = true; if (picks.length >= SIZE) break; } }
  }
  const set = picks.map(e => e.q.id);
  write(app, { ...st, setDay: today, set });
  return set;
}

/* Mark today done and roll the streak forward. Returns the new streak state. */
function completeDaily(app) {
  const st = read(app);
  const today = localDay();
  if (st.doneDay === today) return { ...st, alreadyDone: true };
  const streak = st.lastDay === dayBefore(today) ? st.streak + 1 : 1;
  const next = { ...st, streak, best: Math.max(st.best || 0, streak), lastDay: today, doneDay: today };
  write(app, next);
  return { ...next, isNew: streak === 1 };
}

/* ---------------- DAILY SCREEN ---------------- */
export function renderDaily(app, host) {
  clear(host);

  if (!dailyUnlocked(app)) {
    const card = el("div", "card center");
    card.innerHTML = `<div class="result-emoji">🔒</div><h2>${t("dailyChallenge")}</h2><p class="muted">${t("dailyLocked")}</p>`;
    const back = el("button", "btn primary", "← " + t("backHome"));
    back.addEventListener("click", () => app.go("home"));
    card.appendChild(back);
    host.appendChild(card);
    return;
  }

  if (isDoneToday(app)) { renderDailyDone(app, host, read(app)); return; }

  const ids = todaySet(app);
  const items = ids.map(id => QUESTION_BY_ID[id]).filter(Boolean);
  const state = { i: 0, correct: 0, total: items.length };

  const screen = el("div", "play");
  const top = el("div", "play-top");
  top.innerHTML = `<button class="link-btn quit">✕</button>
    <div class="play-title">🔥 ${t("dailyChallenge")}</div>
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
    const entry = items[state.i];
    screen.style.setProperty("--accent", entry.accent || "#4263eb");
    top.querySelector(".play-count").textContent = `${state.i + 1} ${t("of")} ${state.total}`;
    bar.querySelector("i").style.width = Math.round((state.i / state.total) * 100) + "%";
    next.hidden = true; note.textContent = ""; note.className = "xp-pop";
    clear(qhost);
    const qbox = el("div");
    qhost.appendChild(qbox);
    mountQuestion(qbox, entry.q, (isCorrect) => {
      if (isCorrect) { state.correct++; clearMistake(app, entry.q.id); note.classList.add("good"); note.textContent = "✓ " + t("correct"); }
      else { addMistake(app, entry.q.id, entry.roundId); note.classList.add("bad"); note.textContent = t("notQuite"); }
      next.hidden = false;
      next.textContent = state.i + 1 < state.total ? t("next") : t("finish");
      next.focus();
    });
  }

  next.addEventListener("click", () => {
    state.i++;
    if (state.i < state.total) { window.scrollTo(0, 0); show(); }
    else { const res = completeDaily(app); renderDailyDone(app, host, res, state.correct, state.total); }
  });

  show();
}

/* The "done for today" celebration — also shown if they revisit later. */
function renderDailyDone(app, host, st, correct, total) {
  clear(host);
  const card = el("div", "card center daily-done");
  card.innerHTML = `
    <div class="result-emoji">🔥</div>
    <h1>${t("dailyComplete")}</h1>
    ${correct != null ? `<div class="big-score">${correct}/${total}</div>` : ""}
    <div class="streak-big"><span class="flame">🔥</span><b>${st.streak}</b> <span>${t("dayStreak")}</span></div>
    <div class="result-msg good">${st.isNew ? t("dailyStreakNew") : `${st.streak} ${t("dailyStreakUp")}`}</div>
    <p class="muted small">${t("dailyKeptFresh")}${st.best > 1 ? ` · ${t("streakBest")} ${st.best}` : ""}</p>`;
  const actions = el("div", "result-actions");
  const home = el("button", "btn primary", t("backHome"));
  home.addEventListener("click", () => app.go("home"));
  actions.appendChild(home);
  card.appendChild(actions);
  host.appendChild(card);
}
