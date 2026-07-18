/* ============================================================
   WEEKLY HYPE — "Star of the Week" announcements
   ------------------------------------------------------------
   Two once-a-week dopamine moments, gated to one show per learner
   per week (localStorage flags) and to the right weekday:

     • Fri–Sun  RALLY  — "the board locks soon — here's where YOU
                         stand" + a weekend push. Reads the live
                         current-week board the app already loaded
                         (app.state.weekly), so it's instant.
     • Mon–Tue  CROWN  — last week's settled results, fetched from
                         the server (cgg_weekly_results): Star of the
                         Week + Most Improved + On Fire, plus how YOU
                         finished with movement vs the week before.

   The crown is server-authoritative (Phase B): the RPC computes last
   week's board from xp_events, so it's consistent across devices and
   no longer depends on a client snapshot. The three awards go to three
   DIFFERENT learners (Most Improved excludes the Star; On Fire excludes
   both) so the dopamine spreads instead of always landing on one kid.

   GO-LIVE: nothing shows before WEEKLY_START — the class gets the game
   the weekend of 27–28 Jun, and the first rally is held to Fri 3 Jul so
   it lands on a full week of play, not an empty board.
   ============================================================ */
import { t, getLang } from "./i18n.js";
import { el } from "./ui.js";
import { api } from "./api.js";
import { getSession } from "./session.js";
import { avatarEmoji, displayName } from "./profile.js";

const escapeHtml = s => String(s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

const RALLY_DAYS = new Set([5, 6, 0]);   // Fri, Sat, Sun  (Date.getDay)
const CROWN_DAYS = new Set([1, 2]);      // Mon, Tue  (grace day after results day)
const CHASE_XP   = 60;                    // show the "only N XP behind" chase only under this gap
// First weekly popup is held until this local date — see GO-LIVE note above.
// (Month is 0-indexed: 6 = July.) First rally: Fri 3 Jul; first crown: Mon 6 Jul.
const WEEKLY_START = new Date(2026, 6, 3);
// The very first rally (week of Fri 3 Jul) celebrates the whole game so far, so
// it shows ALL-TIME XP/standings instead of just this week's. Later rallies are
// weekly as normal. Anchor = Monday of the week containing WEEKLY_START.
// CIRCLE CHAMPION is a ONE-TIME reveal, held for the final week's crown only
// (Mon 20 Jul 2026, the last results day before school restarts on Tue 21 Jul).
// Even though the champion is set on the server, the learner crown hides it on
// every other week — so it never shows early and never lingers. (0-indexed month:
// 6 = July.) Teacher previews (?wk=crown and the admin dashboard) ignore this gate
// so the announcement can be checked/screenshotted ahead of the day.
const CHAMPION_REVEAL = new Date(2026, 6, 20);

/* Monday-00:00 anchor of the week containing `d` (mirrors api.js startOfWeek). */
function startOfWeekTs(d = new Date()) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;       // 0 = Monday
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - day);
  return x.getTime();
}

/* per-learner "seen this week" flags */
const keyFor = app => `cgg.weekly.${(app && app.state && app.state.student && app.state.student.id) || "anon"}`;
const DEFAULT = { rallyAnchor: 0, crownAnchor: 0 };
function read(app) { try { return { ...DEFAULT, ...(JSON.parse(localStorage.getItem(keyFor(app))) || {}) }; } catch { return { ...DEFAULT }; } }
function write(app, st) { try { localStorage.setItem(keyFor(app), JSON.stringify(st)); } catch { /* ignore */ } }

const spotsWord = n => getLang() === "af" ? (n === 1 ? "plek" : "plekke") : (n === 1 ? "spot" : "spots");
const daysWord  = n => getLang() === "af" ? (n === 1 ? "dag" : "dae") : (n === 1 ? "day" : "days");

let crownBusy = false;   // guards the async crown fetch against re-render double-fires

/* ============================================================
   ORCHESTRATOR — called at the end of renderHome. No-ops unless
   it's live, the right day, and this week's popup is unseen.
   ============================================================ */
export function maybeShowWeekly(app) {
  const st = read(app);
  const now = new Date();
  const force = (() => { try { return new URLSearchParams(location.search).get("wk"); } catch { return null; } })();
  const nowAnchor = startOfWeekTs();
  const lastWeekId = nowAnchor - 7 * 864e5;             // stable per-week id for the crown "seen" guard

  // First rally shows ALL-TIME standings; every later rally is weekly as usual.
  const firstRally = nowAnchor === startOfWeekTs(WEEKLY_START);
  const board = firstRally ? (app && app.state && app.state.allTime) : (app && app.state && app.state.weekly);
  const me = firstRally ? (app && app.state && app.state.myAllTime) : (app && app.state && app.state.myWeekly);

  // preview/teacher override (?wk=rally|crown): force exactly one popup, bypassing
  // the day, seen, and go-live gates so it can be checked any day.
  if (force === "crown") { fetchAndShowCrown(app, lastWeekId, true); return; }
  if (force === "rally") { showWeeklyModal(app, buildRally(board || [], me)); return; }

  // genuine path
  if (now < WEEKLY_START) return;                       // not live yet (first rally held to WEEKLY_START)
  const day = now.getDay();

  // CROWN (Mon/Tue) — authoritative server results. Rally days (Fri–Sun) are
  // disjoint, so the two never compete on a real calendar.
  if (CROWN_DAYS.has(day) && st.crownAnchor !== lastWeekId) {
    fetchAndShowCrown(app, lastWeekId, false);
    return;
  }
  // RALLY (Fri–Sun) — live standings + weekend push.
  if (RALLY_DAYS.has(day) && Array.isArray(board) && st.rallyAnchor !== nowAnchor) {
    showWeeklyModal(app, buildRally(board || [], me));
    st.rallyAnchor = nowAnchor; write(app, st);
  }
}

async function fetchAndShowCrown(app, lastWeekId, force) {
  if (crownBusy) return;
  crownBusy = true;
  try {
    const s = getSession();
    if (!s) return;
    const res = await api.weeklyResults(s.name, s.password);
    if (!res || !res.ok || !Array.isArray(res.board) || !res.board.length || !res.star) return;
    if (!force) { const st = read(app); st.crownAnchor = lastWeekId; write(app, st); }   // mark seen
    // ONE-TIME reveal: on the genuine learner path, only the final week's crown
    // carries the Circle Champion. Forced teacher previews keep it (see gate note).
    if (!force && startOfWeekTs() !== startOfWeekTs(CHAMPION_REVEAL)) res.champion = null;
    showWeeklyModal(app, buildCrown(res, app));
  } catch { /* offline — the crown just won't show */ }
  finally { crownBusy = false; }
}

/* ---------------- rally ---------------- */
function buildRally(board, me) {
  return {
    kind: "rally",
    emoji: "🔥",
    eyebrow: t("wkRallyEyebrow"),
    headline: t("wkRallyTitle"),
    personalHTML: rallyPersonal(board, me),
    subHTML: t("wkLockHook"),
    winners: null,
    primaryLabel: t("wkLetsGo"),
  };
}

function rallyPersonal(board, me) {
  if (!me || !me.xp) return t("wkNoScoreYet");
  if (me.rank === 1) return t("wkTopNow");
  const above = board.find(r => r.rank === me.rank - 1);
  const gap = above ? (above.xp - me.xp) : 0;
  if (above && gap > 0 && gap <= CHASE_XP)
    return `${t("wkYouAreNum")} #${me.rank} — ${t("wkOnly")} ${gap} XP ${t("wkBehind")} #${me.rank - 1}. ${t("wkClimbHook")}`;
  return `${t("wkYouAreNum")} #${me.rank} — ${t("wkRallyClimb")}`;
}

/* ---------------- crown ---------------- */
/* Every winner name shown here prefers the learner's NICKNAME over their
   real display_name (Phase 12 / Nicknames & Avatars) — see displayName() in
   js/profile.js. The "that's you!" highlight still compares REAL names
   (w.realName), because that's what app.state.student.name and the server's
   champion/star/etc `name` field always carry — nickname is display-only. */
function buildCrown(res, app) {
  const meName = (app && app.state && app.state.student) ? app.state.student.name : null;
  const winners = [];
  // CIRCLE CHAMPION — a teacher's-choice honour, not a weekly stat. It leads the
  // board (and takes the hero styling) because it celebrates the long game:
  // playing every day, steadily, all the way through — the way the game is meant
  // to be played, which the burst-friendly weekly awards can't capture. It's set
  // by the teacher (admin dashboard), independent of last week's XP, so a frantic
  // catch-up day can never take it. championNickname (Phase 12) is the champion's
  // OWN nickname if they've set one, looked up server-side — champion (real name)
  // is kept for the "that's you!" match and as the admin-preview fallback (the
  // admin RPC doesn't send championNickname on purpose — admin always sees the
  // real name).
  if (res.champion)
    winners.push({ icon: "🏆", label: t("wkAwardChampion"), name: res.championNickname || res.champion, realName: res.champion, avatar: null, value: "", cls: "wk-champion" });
  winners.push({ icon: "🌟", label: t("wkAwardStar"), name: displayName(res.star), realName: res.star.name, avatar: res.star.avatarId, value: `★ ${res.star.xp}`, cls: "wk-star" });
  if (res.mostImproved)
    winners.push({ icon: "📈", label: t("wkAwardImproved"), name: displayName(res.mostImproved), realName: res.mostImproved.name, avatar: res.mostImproved.avatarId, value: `+${res.mostImproved.delta} XP` });
  if (res.onFire)
    winners.push({ icon: "🔥", label: t("wkAwardStreak"), name: displayName(res.onFire), realName: res.onFire.name, avatar: res.onFire.avatarId, value: `${res.onFire.days} ${daysWord(res.onFire.days)}` });
  winners.forEach(w => { w.me = !!(meName && w.realName === meName); });   // highlight a chip the learner won
  // PERFECT WEEK is not winner-take-all: EVERYONE who did all 7 dailies is
  // named. perfectWeekRoster (Phase 12) carries nickname/avatar per learner;
  // fall back to the plain perfectWeek name array for any RPC that hasn't
  // picked up phase12.sql yet.
  if (Array.isArray(res.perfectWeekRoster) && res.perfectWeekRoster.length) {
    winners.push({
      icon: "🎯", label: t("wkAwardPerfect"),
      name: res.perfectWeekRoster.map(displayName).join(", "),
      realName: null,
      value: "7/7",
      me: !!(meName && res.perfectWeekRoster.some(p => p.name === meName)),
    });
  } else if (Array.isArray(res.perfectWeek) && res.perfectWeek.length) {
    winners.push({
      icon: "🎯", label: t("wkAwardPerfect"),
      name: res.perfectWeek.join(", "),
      realName: null,
      value: "7/7",
      me: !!(meName && res.perfectWeek.includes(meName)),
    });
  }
  const champDisplay = res.champion ? (res.championNickname || res.champion) : null;
  return {
    kind: "crown",
    emoji: "🌟",
    eyebrow: t("wkCrownEyebrow"),
    headline: t("wkCrownTitle"),
    winners,
    personalHTML: crownPersonal(res),
    subHTML: champDisplay ? `🏆 <b>${escapeHtml(champDisplay)}</b> — ${t("wkChampionSub")}` : null,
    primaryLabel: t("wkNice"),
  };
}

function crownPersonal(res) {
  const r = res.me ? res.me.rank : null;
  const xp = res.me ? res.me.xp : 0;
  if (r === 1) return t("wkYouAreStar");                 // they took the crown
  if (!xp) return t("wkSatOut");                         // didn't play last week
  let move;
  if (res.prevRank == null) move = t("wkFirstWeek");
  else if (r < res.prevRank) { const up = res.prevRank - r; move = `${t("wkUp")} ${up} ${spotsWord(up)} 🔼`; }
  else if (r > res.prevRank) move = t("wkBounceBack");
  else move = t("wkSteady");
  const best = (res.prevRank != null && xp > (res.bestPrevXp || 0)) ? ` · ${t("wkBestWeek")}` : "";
  return `${t("wkFinishedNum")} #${r} ${t("wkLastWeek")} — ${move}${best}`;
}

/* ============================================================
   TEACHER PREVIEWS — opened from the admin dashboard so the real
   announcements can be screenshotted for the class WhatsApp group.
   Exactly the learners' modal (same markup + CSS), with the
   learner-personal line swapped out: the crown shows just the three
   awards; the rally shows the top-3 podium instead of "you are #N".
   ============================================================ */
export function showCrownPreview(res) {
  const cfg = buildCrown(res, null);
  cfg.personalHTML = null;               // no learner to personalise for
  showWeeklyModal(null, cfg);
}
export function showRallyPreview(board) {
  const cfg = buildRally(board, null);
  cfg.personalHTML = podiumHTML(board);
  showWeeklyModal(null, cfg);
}
const MEDALS = ["🥇", "🥈", "🥉"];
const podiumHTML = board => board.slice(0, 3)
  .map((r, i) => `${MEDALS[i]} ${avatarEmoji(r.avatarId)} <b>${escapeHtml(displayName(r))}</b> — ${r.xp} XP`)
  .join("<br>");

/* ---------------- modal ---------------- */
function showWeeklyModal(app, cfg) {
  document.querySelectorAll(".wk-overlay").forEach(n => n.remove());   // never stack
  const ov = el("div", "wk-overlay");
  const m = el("div", "wk-modal card wk-" + cfg.kind);
  m.innerHTML = `
    <button class="wk-close" aria-label="Close">✕</button>
    <div class="wk-emoji">${cfg.emoji}</div>
    <span class="eyebrow">${cfg.eyebrow}</span>
    <h1>${cfg.headline}</h1>`;

  if (cfg.winners && cfg.winners.length) {
    const strip = el("div", "wk-winners");
    cfg.winners.forEach(w => strip.appendChild(el("div", "wk-award" + (w.cls ? " " + w.cls : "") + (w.me ? " you" : ""), `
      <span class="wk-aw-icon">${w.icon}</span>
      <span class="wk-aw-body"><span class="wk-aw-label">${w.label}</span><span class="wk-aw-name">${w.avatar ? avatarEmoji(w.avatar) + " " : ""}${escapeHtml(w.name)}${w.me ? ` <span class="tag-you">${t("you")}</span>` : ""}</span></span>
      ${w.value ? `<span class="wk-aw-xp">${w.value}</span>` : ""}`)));
    m.appendChild(strip);
  }
  if (cfg.personalHTML) m.appendChild(el("div", "wk-personal", cfg.personalHTML));
  if (cfg.subHTML) m.appendChild(el("div", "wk-sub muted small", cfg.subHTML));

  const actions = el("div", "wk-actions");
  const close = () => { ov.classList.remove("show"); document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); setTimeout(() => ov.remove(), 200); };
  const onKey = e => { if (e.key === "Escape") close(); };
  const primary = el("button", "btn primary big", cfg.primaryLabel);
  primary.addEventListener("click", close);
  actions.appendChild(primary);
  if (app) {   // no leaderboard to jump to in the admin preview
    const seeBoard = el("button", "link-btn wk-seeboard", t("wkSeeBoard"));
    seeBoard.addEventListener("click", () => { close(); app.go("leaderboard"); });
    actions.appendChild(seeBoard);
  }
  m.appendChild(actions);

  m.querySelector(".wk-close").addEventListener("click", close);
  ov.addEventListener("click", e => { if (e.target === ov) close(); });
  document.addEventListener("keydown", onKey);

  ov.appendChild(m);
  document.body.appendChild(ov);
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => ov.classList.add("show"));
}
