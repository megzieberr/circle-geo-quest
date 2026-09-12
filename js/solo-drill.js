/* ============================================================
   SOLO DAILY DRILL  —  the offline twin of js/daily.js
   ------------------------------------------------------------
   Five exam-style circle-geometry riders a day, on one phone, with
   no account and no server. Same bank, same marking, same
   Fix-My-Mistakes pile as the big app; everything else is stripped.

   WHAT IS DIFFERENT FROM daily.js (on purpose):
     · No api.js / session.js / config.js / supabase / push /
       leaderboard imports — this file reaches the network NEVER.
       The whole module graph under drill.html is: this file →
       rounds/* (+ engine.js), i18n.js, ui.js (→ why.js, sound.js),
       questions.js, mistakes.js, sound.js, celebrate.js. None of
       those touch the network.
     · No XP anywhere — no display, no accounting, not even local.
       There is no economy to protect and no server to hold one.
     · The streak is computed LOCALLY, from the history object
       below. Known trade-off (named in SOLO-DRILL-PLAN.md): clearing
       browser data or moving to a new phone loses it. Accepted,
       because there is no account to hang it on.
     · The draw is a PURE FUNCTION OF THE LOCAL DATE (seeded PRNG),
       not a shuffle-once-and-remember. Reloading, clearing storage,
       or opening the page on a second browser all give the same five
       questions for that day, and no re-roll is possible mid-day.
     · No `served` rotation log. Repeats across days are a FEATURE
       here (spaced repetition), never a bug to fix.
     · Language pinned to EN (see pinEnglish below). The Afrikaans
       strings stay in the bank, the toggle is simply not shown.

   STORAGE (two keys, both local, both human-readable):
     cgg.solo.history  { "2026-09-12": { done: true, score: 4.5, total: 5 }, … }
     cgg.mistakes.anon  the existing Fix-My-Mistakes pile (mistakes.js
                        already falls back to "anon" with no login)
   ============================================================ */
import { QUESTION_BY_ID, DAILY_RIDERS_MULTI, DAILY_RIDERS_SINGLE } from "./rounds/index.js";
import { t, tx, setLang } from "./i18n.js";
import { el, clear, mount, progressBar } from "./ui.js";
import { mountQuestion } from "./questions.js";
import { addMistake, clearMistake, mistakeCount, renderFixMistakes } from "./mistakes.js";
import { sfx } from "./sound.js";
import { showCelebration } from "./celebrate.js";

export const SIZE = 5;       // five riders a day — a five-minute phone drill
export const MULTI_N = 2;    // …of which 2 are multi-step (type the angle)
export const SINGLE_N = 3;   // …and 3 are single-step (type the angle + pick the reason)

const HISTORY_KEY = "cgg.solo.history";
const LANG_KEY = "cgg.lang";

/* Streak milestones, values mirrored from the big app's config BUT WITH NO XP
   (config.js is deliberately not imported — it carries the live server
   settings). These only decide when the full-screen "big moment" fires. */
const MILESTONES = [
  { days: 3,  label: { en: "On a Roll",       af: "Op Dreef" } },
  { days: 7,  label: { en: "One Week Strong", af: "'n Week Sterk" } },
  { days: 14, label: { en: "Two Weeks!",      af: "Twee Weke!" } },
  { days: 30, label: { en: "Circle Legend",   af: "Sirkel Legende" } },
];

/* ---------------- days ---------------- */
/* local calendar day as YYYY-MM-DD (local time, not UTC) — same as daily.js */
export function localDay(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function dayBefore(dayStr) {
  const [y, m, d] = dayStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() - 1);
  return localDay(dt);
}

/* ---------------- language: EN, pinned ----------------
   i18n.js reads its language from localStorage ONCE at module load, so
   setLang("en") is enough to pin this page. It also persists the choice,
   which would quietly re-language the main app for anyone sharing the
   browser — so the previous stored preference is put straight back. The
   in-memory language stays English for the life of this page. */
export function pinEnglish() {
  let prev = null;
  try { prev = localStorage.getItem(LANG_KEY); } catch { /* ignore */ }
  setLang("en");
  try { if (prev !== null && prev !== "en") localStorage.setItem(LANG_KEY, prev); } catch { /* ignore */ }
}

/* ---------------- the draw (pure, seeded by the date) ---------------- */
/* FNV-1a over the day string → a 32-bit seed; mulberry32 for the stream.
   Both are deterministic, so drawFor("2026-09-12") is the same five ids on
   every reload, every browser, forever (until the bank itself changes). */
function hash32(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h >>> 0;
}
function rngFor(seedStr) {
  let a = hash32(seedStr);
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let x = Math.imul(a ^ (a >>> 15), 1 | a);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}
/* seeded Fisher–Yates, then take n (a copy — never mutates the bank) */
function pick(entries, n, rand) {
  const pool = entries.slice();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.max(0, Math.min(n, pool.length)));
}

/* The five question ids for a given local day: 2 multi-step + 3 single-step,
   drawn from the WHOLE riders bank (no progress gating), order shuffled from
   the same seed so the two formats interleave differently day to day. */
export function drawFor(day = localDay()) {
  const rand = rngFor(`cgg.solo|${day}`);
  const multi = pick(DAILY_RIDERS_MULTI, MULTI_N, rand);
  const single = pick(DAILY_RIDERS_SINGLE, SINGLE_N, rand);
  const both = [...multi, ...single];
  for (let i = both.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [both[i], both[j]] = [both[j], both[i]];
  }
  return both.map(e => e.q.id).filter(id => QUESTION_BY_ID[id]);
}

/* ---------------- history + streak ---------------- */
export function readHistory() {
  try {
    const raw = JSON.parse(localStorage.getItem(HISTORY_KEY));
    return (raw && typeof raw === "object" && !Array.isArray(raw)) ? raw : {};
  } catch { return {}; }
}
export function writeHistory(history) {
  /* indented on purpose: this object IS the record Megan can ask for a
     screenshot of, so it has to read well in a devtools/storage view. */
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history, null, 2)); } catch { /* quota — ignore */ }
}

/* pure: returns a NEW history with `day` marked done (first completion wins,
   so revisiting the same day can never overwrite the real score) */
export function applyCompletion(history, day, score, total) {
  if (history[day] && history[day].done) return { ...history };
  return { ...history, [day]: { done: true, score, total } };
}

/* Consecutive days up to today. If today isn't done yet the count runs to
   yesterday, so the flame is already showing when he opens the page. */
export function streakFrom(history, today = localDay()) {
  let day = (history[today] && history[today].done) ? today : dayBefore(today);
  let n = 0;
  while (history[day] && history[day].done) { n++; day = dayBefore(day); }
  return n;
}
/* longest run anywhere in the history (his personal best) */
export function bestStreakFrom(history) {
  const days = Object.keys(history).filter(d => history[d] && history[d].done).sort();
  let best = 0, run = 0, prev = null;
  days.forEach(d => {
    run = (prev && dayBefore(d) === prev) ? run + 1 : 1;
    prev = d;
    if (run > best) best = run;
  });
  return best;
}
export function isDoneToday(history = readHistory(), today = localDay()) {
  return !!(history[today] && history[today].done);
}

/* Mark today done and return what the result card needs. `milestone` is
   transient — it is never written to storage, so a later same-day revisit
   reads the plain history back and the celebration only ever fires once. */
function completeToday(score, total) {
  const today = localDay();
  const before = readHistory();
  if (isDoneToday(before, today)) {
    return { ...before[today], streak: streakFrom(before, today), best: bestStreakFrom(before), alreadyDone: true, milestone: null };
  }
  const after = applyCompletion(before, today, score, total);
  writeHistory(after);
  const streak = streakFrom(after, today);
  return {
    done: true, score, total,
    streak,
    best: bestStreakFrom(after),
    isNew: streak <= 1,
    milestone: MILESTONES.find(m => m.days === streak) || null,
  };
}

/* ---------------- screens ---------------- */
/* The core modules take an `app` object (for the storage key and for
   app.go). Solo has no login, so state.student stays undefined and
   mistakes.js falls back to its "anon" pile, exactly as intended. */
function makeApp(host) {
  const app = {
    state: {},
    go(route) {
      window.scrollTo(0, 0);
      if (route === "drill") { renderDrill(app, host); return; }
      if (route === "fix") { renderFixMistakes(app, host); return; }
      renderHome(app, host);
    },
  };
  return app;
}

/* last 7 days as dots — ✓ done, · missed, today outlined */
function weekStrip(history) {
  const wrap = el("div", "sd-week");
  const today = localDay();
  const days = [];
  let d = today;
  for (let i = 0; i < 7; i++) { days.unshift(d); d = dayBefore(d); }
  days.forEach(day => {
    const done = !!(history[day] && history[day].done);
    const dot = el("span", `sd-dot${done ? " done" : ""}${day === today ? " today" : ""}`, done ? "✓" : "·");
    dot.title = day;
    wrap.appendChild(dot);
  });
  return wrap;
}

function muteButton() {
  const label = () => (sfx.isMuted() ? "🔇" : "🔊");
  const btn = el("button", "btn ghost small sd-mute", label());
  btn.title = "Sound on / off";
  btn.setAttribute("aria-label", "Sound on or off");
  btn.addEventListener("click", () => {
    sfx.setMuted(!sfx.isMuted());
    btn.textContent = label();
    if (!sfx.isMuted()) sfx.tick();
  });
  return btn;
}

export function renderHome(app, host) {
  clear(host);
  const history = readHistory();
  const streak = streakFrom(history);
  const best = bestStreakFrom(history);
  const doneToday = isDoneToday(history);
  const nMistakes = mistakeCount(app);

  const card = el("div", "card center sd-home");
  card.innerHTML = `
    <p class="eyebrow">Daily drill</p>
    <h1 class="sd-title">Circle geometry</h1>
    <p class="muted small sd-lede">${SIZE} exam-style riders a day — the angle <b>and</b> the reason.</p>
    <div class="streak-big"><span class="flame">🔥</span><b>${streak}</b> <span>${t("dayStreak")}</span></div>
    <p class="muted small sd-best">${best > 1 ? `${t("streakBest")} ${best}` : "&nbsp;"}</p>`;
  card.appendChild(weekStrip(history));

  const actions = el("div", "result-actions");
  if (doneToday) {
    const rec = history[localDay()] || {};
    const dn = el("div", "result-msg good", `✓ Today's drill is done — ${fmtScore(rec.score)}/${rec.total || SIZE}. Come back tomorrow.`);
    card.appendChild(dn);
  } else {
    const start = el("button", "btn primary big", "Start today's drill");
    let spent = false;
    start.addEventListener("click", () => {
      if (spent) return;
      spent = true;                 // house rule: spent flag + disable BEFORE anything else
      start.disabled = true;
      sfx.tick();
      app.go("drill");
    });
    actions.appendChild(start);
  }

  const fix = el("button", "btn ghost", `🩹 Fix my mistakes (${nMistakes})`);
  fix.addEventListener("click", () => { sfx.tick(); app.go("fix"); });
  actions.appendChild(fix);
  card.appendChild(actions);

  const foot = el("div", "sd-foot");
  foot.appendChild(muteButton());
  card.appendChild(foot);

  host.appendChild(card);
}

function fmtScore(s) {
  if (s == null) return "0";
  return Number.isInteger(s) ? String(s) : s.toFixed(1);
}

export function renderDrill(app, host) {
  clear(host);
  const ids = drawFor();
  const items = ids.map(id => QUESTION_BY_ID[id]).filter(Boolean);
  if (!items.length) {                       // bank empty — can only happen if the riders file is gutted
    const card = el("div", "card center");
    card.innerHTML = `<div class="result-emoji">🤔</div><h2>Nothing to drill</h2><p class="muted">The question bank came back empty.</p>`;
    const back = el("button", "btn primary", "← Back");
    back.addEventListener("click", () => app.go("home"));
    card.appendChild(back);
    host.appendChild(card);
    return;
  }

  /* `score` is the fractional mark the learner sees — a split question
     (angle right, reason wrong) adds ½. `correct` counts fully-correct ones. */
  const run = { i: 0, correct: 0, score: 0, total: items.length };

  const screen = el("div", "play");
  const topRow = el("div", "play-top");         // NOT named `top` — window.top collision (house rule)
  topRow.innerHTML = `<button class="link-btn quit">✕</button>
    <div class="play-title">🔥 Daily drill</div>
    <div class="play-count"></div>`;
  topRow.querySelector(".quit").addEventListener("click", () => app.go("home"));
  const bar = progressBar(0);
  const qhost = el("div", "q-host");
  const footer = el("div", "play-foot");
  const note = el("div", "xp-pop");             // existing feedback-pill class; no XP is ever shown in it
  const next = el("button", "btn primary big next", t("next"));
  next.hidden = true;
  mount(footer, note, next);
  mount(screen, topRow, bar, qhost, footer);
  host.appendChild(screen);

  function show() {
    const entry = items[run.i];
    screen.style.setProperty("--accent", entry.accent || "#4263eb");
    topRow.querySelector(".play-count").textContent = `${run.i + 1} ${t("of")} ${run.total}`;
    bar.querySelector("i").style.width = Math.round((run.i / run.total) * 100) + "%";
    next.hidden = true; note.textContent = ""; note.className = "xp-pop";
    clear(qhost);
    const qbox = el("div");
    qhost.appendChild(qbox);
    /* mountQuestion does the marking: num-reason reports ½ for exactly one
       part right, and multi-step `num` riders reveal their full
       statement-and-reason chain in the feedback. Untouched, both formats. */
    mountQuestion(qbox, entry.q, (isCorrect, score) => {
      const s = (score == null) ? (isCorrect ? 1 : 0) : score;
      run.score += s;
      if (isCorrect) { sfx.correct(); run.correct++; clearMistake(app, entry.q.id); note.classList.add("good"); note.textContent = "✓ " + t("correct"); }
      else if (s > 0) { sfx.correct(); addMistake(app, entry.q.id, entry.roundId); note.classList.add("good"); note.textContent = "½ " + t("halfMark"); }
      else { sfx.wrong(); addMistake(app, entry.q.id, entry.roundId); note.classList.add("bad"); note.textContent = t("notQuite"); }
      next.hidden = false;
      next.textContent = run.i + 1 < run.total ? t("next") : t("finish");
      next.focus();
    });
  }

  let finishing = false;
  next.addEventListener("click", () => {
    if (finishing) return;
    run.i++;
    if (run.i < run.total) { sfx.tick(); window.scrollTo(0, 0); show(); }
    else {
      finishing = true;              // spent flag + disable before the write, house rule
      next.disabled = true;
      sfx.tick();
      const res = completeToday(run.score, run.total);
      window.scrollTo(0, 0);
      renderDone(app, host, res);
    }
  });

  show();
}

export function renderDone(app, host, res) {
  clear(host);
  const card = el("div", "card center daily-done");
  card.innerHTML = `
    <div class="result-emoji">🔥</div>
    <h1>Drill done for today</h1>
    <div class="big-score">${fmtScore(res.score)}/${res.total || SIZE}</div>
    <div class="streak-big"><span class="flame">🔥</span><b>${res.streak}</b> <span>${t("dayStreak")}</span></div>
    <div class="result-msg good">${res.isNew ? t("dailyStreakNew") : `${res.streak} ${t("dailyStreakUp")}`}</div>
    <p class="muted small">${t("dailyKeptFresh")}${res.best > 1 ? ` · ${t("streakBest")} ${res.best}` : ""}</p>`;

  const actions = el("div", "result-actions");
  const nMistakes = mistakeCount(app);
  if (nMistakes) {
    const fix = el("button", "btn primary", `🩹 Fix my mistakes (${nMistakes})`);
    fix.addEventListener("click", () => { sfx.tick(); app.go("fix"); });
    actions.appendChild(fix);
  }
  const home = el("button", "btn ghost", "← Back");
  home.addEventListener("click", () => app.go("home"));
  actions.appendChild(home);
  card.appendChild(actions);
  host.appendChild(card);

  /* the big moment, on top of the inline streak number. celebrate.js is
     pure client-side (its only import is sound.js) — no server path, so the
     call stays. No XP line: there is no XP on this page. */
  if (res.milestone) {
    showCelebration({
      emoji: "🔥",
      title: tx(res.milestone.label),
      body: `${res.streak} ${t("dayStreak")}`,
      cta: "Nice",
    });
  }
}

/* ---------------- entry point ---------------- */
export function mountSoloDrill(host) {
  pinEnglish();
  const app = makeApp(host);
  renderHome(app, host);
  return app;
}
