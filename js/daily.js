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
import { ROUNDS, QUESTION_BANK, QUESTION_BY_ID, DAILY_EXTRA } from "./rounds/index.js";
import { t, tx } from "./i18n.js";
import { el, clear, mount, shuffled, progressBar } from "./ui.js";
import { mountQuestion } from "./questions.js";
import { addMistake, clearMistake } from "./mistakes.js";
import { api } from "./api.js";
import { getSession } from "./session.js";
import { CONFIG } from "./config.js";
import { showCelebration } from "./celebrate.js";
import { sfx } from "./sound.js";

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

const DEFAULT = { streak: 0, best: 0, lastDay: null, setDay: null, set: [], doneDay: null, served: [] };
function read(app) { try { return { ...DEFAULT, ...(JSON.parse(localStorage.getItem(keyFor(app))) || {}) }; } catch { return { ...DEFAULT }; } }
function write(app, st) { try { localStorage.setItem(keyFor(app), JSON.stringify(st)); } catch { /* ignore */ } }

/* rounds the learner has passed (these hold the "fresh" material) */
function passedQuestionPool(app) {
  const progress = (app.state && app.state.progress) || {};
  const passed = new Set(ROUNDS.filter(r => progress[r.id] && progress[r.id].passed).map(r => r.id));
  return QUESTION_BANK.filter(e => passed.has(e.roundId));
}

/* has the learner passed EVERY graded round? (graded = rounds that contribute
   questions to the bank). Finishers get the bonus rider bank in their Daily. */
function allRoundsPassed(app) {
  const progress = (app.state && app.state.progress) || {};
  const graded = new Set(QUESTION_BANK.map(e => e.roundId));
  return graded.size > 0 && [...graded].every(rid => progress[rid] && progress[rid].passed);
}

export function dailyUnlocked(app) { return passedQuestionPool(app).length > 0; }
export function getDaily(app) { return read(app); }
export function isDoneToday(app) { return read(app).doneDay === localDay(); }

/* Pick (and remember for the day) an interleaved set of question ids.
   - Finishers (every round passed) get mostly FRESH bonus riders plus one
     review, so the Daily stops recycling the round questions.
   - Everyone else gets a spread across their passed rounds.
   In both cases we prefer questions not served recently (`served` log), and
   reset a pool's rotation once it's been exhausted. */
function todaySet(app) {
  const st = read(app);
  const today = localDay();
  if (st.setDay === today && Array.isArray(st.set) && st.set.length && st.set.every(id => QUESTION_BY_ID[id])) {
    return st.set;
  }
  const served = new Set(st.served || []);
  // take n entries, preferring those not served recently; if a pool is used up
  // (fewer fresh than needed) start a new rotation over the whole pool.
  const take = (entries, n) => {
    if (n <= 0 || !entries.length) return [];
    let fresh = entries.filter(e => !served.has(e.q.id));
    if (fresh.length < n) fresh = entries.slice();
    return shuffled(fresh).slice(0, n);
  };

  let picks;
  if (allRoundsPassed(app) && DAILY_EXTRA.length) {
    const bonus = take(DAILY_EXTRA, Math.min(SIZE - 1, DAILY_EXTRA.length));  // up to 4 fresh bonus riders
    const review = take(QUESTION_BANK, SIZE - bonus.length);                   // + a review for spaced retrieval
    picks = shuffled([...bonus, ...review]).slice(0, SIZE);
  } else {
    // bucket by round, unseen first within each, then round-robin so the 5 spread out
    const byRound = {};
    shuffled(passedQuestionPool(app)).forEach(e => { (byRound[e.roundId] || (byRound[e.roundId] = [])).push(e); });
    Object.values(byRound).forEach(b => b.sort((a, c) => (served.has(a.q.id) ? 1 : 0) - (served.has(c.q.id) ? 1 : 0)));
    const buckets = shuffled(Object.values(byRound));
    picks = [];
    let added = true;
    while (picks.length < SIZE && added) {
      added = false;
      for (const b of buckets) { if (b.length) { picks.push(b.shift()); added = true; if (picks.length >= SIZE) break; } }
    }
  }

  const set = picks.map(e => e.q.id);
  const served2 = [...(st.served || []), ...set].slice(-40);   // remember recent picks to avoid repeats
  write(app, { ...st, setDay: today, set, served: served2 });
  return set;
}

/* Mark today done and roll the streak forward. Returns the new streak state,
   plus a `milestone` entry (from CONFIG.streakMilestones) if this streak
   value is an exact milestone hit — undefined on every other day. The
   milestone flag is transient (not persisted to localStorage), so revisiting
   an already-done day never re-detects it — the celebration only fires once,
   right when the streak is first reached. */
function completeDaily(app) {
  const st = read(app);
  const today = localDay();
  if (st.doneDay === today) return { ...st, alreadyDone: true };
  const streak = st.lastDay === dayBefore(today) ? st.streak + 1 : 1;
  const next = { ...st, streak, best: Math.max(st.best || 0, streak), lastDay: today, doneDay: today };
  write(app, next);
  const milestone = CONFIG.streakMilestones.find(m => m.days === streak) || null;
  return { ...next, isNew: streak === 1, milestone };
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
      if (isCorrect) { sfx.correct(); state.correct++; clearMistake(app, entry.q.id); note.classList.add("good"); note.textContent = "✓ " + t("correct"); }
      else { sfx.wrong(); addMistake(app, entry.q.id, entry.roundId); note.classList.add("bad"); note.textContent = t("notQuite"); }
      next.hidden = false;
      next.textContent = state.i + 1 < state.total ? t("next") : t("finish");
      next.focus();
    });
  }

  next.addEventListener("click", async () => {
    sfx.tick();
    state.i++;
    if (state.i < state.total) { window.scrollTo(0, 0); show(); }
    else {
      next.disabled = true;
      const res = completeDaily(app);                    // local streak (+ milestone flag)
      // claim the daily XP on the server (granted at most once per local day)
      let award = { xpAwarded: 0, alreadyClaimed: true };
      let milestoneAward = null;
      try {
        const s = getSession();
        award = await api.submitDaily(s.name, s.password, { day: localDay(), correct: state.correct, total: state.total });
        // streak milestone hit — claim its XP too. Server is source of truth
        // (idempotent against streak_milestones_awarded), the local `res`
        // above is only used for the immediate optimistic display.
        if (res.milestone) {
          milestoneAward = await api.awardStreakMilestone(s.name, s.password, res.milestone.days);
        }
      } catch { /* offline — still show the streak result */ }
      await app.refreshState();
      renderDailyDone(app, host, res, state.correct, state.total, award, milestoneAward);
    }
  });

  show();
}

/* The "done for today" celebration — also shown if they revisit later.
   `milestoneAward` (the server's cgg_award_streak_milestone response) is only
   passed in right after a fresh completion; a later same-day revisit reads
   `st` back from localStorage, which never carries `.milestone`, so the
   full-screen celebration below only ever fires once, at the moment the
   milestone is actually reached. */
function renderDailyDone(app, host, st, correct, total, award, milestoneAward) {
  clear(host);
  const card = el("div", "card center daily-done");
  const xpPill = (award && award.xpAwarded > 0)
    ? `<div class="result-pills"><span class="pill xp">★ +${award.xpAwarded} ${t("xpEarned")}</span></div>` : "";
  const perfect = (award && award.perfectWeek)
    ? `<div class="pw-banner">🎯 <b>${t("dailyPerfectWeek")}</b><br>+${award.bonusXp} XP</div>` : "";
  card.innerHTML = `
    <div class="result-emoji">${award && award.perfectWeek ? "🎯" : "🔥"}</div>
    <h1>${t("dailyComplete")}</h1>
    ${correct != null ? `<div class="big-score">${correct}/${total}</div>` : ""}
    ${xpPill}
    ${perfect}
    <div class="streak-big"><span class="flame">🔥</span><b>${st.streak}</b> <span>${t("dayStreak")}</span></div>
    <div class="result-msg good">${st.isNew ? t("dailyStreakNew") : `${st.streak} ${t("dailyStreakUp")}`}</div>
    <p class="muted small">${t("dailyKeptFresh")}${st.best > 1 ? ` · ${t("streakBest")} ${st.best}` : ""}</p>`;
  const actions = el("div", "result-actions");
  const home = el("button", "btn primary", t("backHome"));
  home.addEventListener("click", () => app.go("home"));
  actions.appendChild(home);
  card.appendChild(actions);
  host.appendChild(card);

  // Streak milestone hit — the full-screen "big moment", ON TOP OF (not
  // instead of) the inline streak-big number above. Non-milestone days never
  // reach this branch, so they render exactly as before.
  if (st.milestone) {
    const xp = (milestoneAward && milestoneAward.xpAwarded > 0) ? milestoneAward.xpAwarded : st.milestone.xp;
    showCelebration({
      emoji: "🔥",
      title: tx(st.milestone.label),
      body: `+${xp} XP — ${st.streak} ${t("dayStreak")}`,
      cta: t("wkNice"),
    });
  }
}
