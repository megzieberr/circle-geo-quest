/* ============================================================
   WEEKLY HYPE — "Star of the Week" announcements   (Phase A: client-only)
   ------------------------------------------------------------
   Two once-a-week dopamine moments. Both read the weekly leaderboard
   the app already fetches (app.state.weekly / app.state.myWeekly), so
   there is NO backend change here:

     • Fri–Sun  RALLY  — "the board locks soon — here's where YOU
                         stand" + a nudge to push for the weekend.
                         Uses the live current-week board.
     • Mon–Tue  CROWN  — last week's settled results: who was Star of
                         the Week + how YOU finished, with movement vs
                         the week before.

   The weekly board resets every Monday (server-side), so to name last
   week's winner AFTER the reset we keep a rolling client snapshot of
   the board and promote it to "last week" when the week rolls over.
   That snapshot is per-device, so the crown is best-effort: a learner
   who didn't open the app late last week may see a slightly stale board.

   PHASE B (next Supabase pass) makes it authoritative via a server
   weekly snapshot, and adds the "Most Improved" and "On Fire (streak)"
   award chips. The winners strip below already renders an array of
   awards, so Phase B is a drop-in — it just passes more chips.
   ============================================================ */
import { t, getLang } from "./i18n.js";
import { el } from "./ui.js";

const RALLY_DAYS = new Set([5, 6, 0]);   // Fri, Sat, Sun  (Date.getDay)
const CROWN_DAYS = new Set([1, 2]);      // Mon, Tue  (grace day after results day)
const CHASE_XP   = 60;                    // show the "only N XP behind" chase only under this gap

/* Monday-00:00 anchor of the week containing `d` (mirrors api.js startOfWeek). */
function startOfWeekTs(d = new Date()) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;       // 0 = Monday
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - day);
  return x.getTime();
}

/* per-learner local state */
const keyFor = app => `cgg.weekly.${(app && app.state && app.state.student && app.state.student.id) || "anon"}`;
const DEFAULT = { rallyAnchor: 0, crownAnchor: 0, snap: null, lastSnap: null, prevFinishRank: null, bestXp: 0 };
function read(app) { try { return { ...DEFAULT, ...(JSON.parse(localStorage.getItem(keyFor(app))) || {}) }; } catch { return { ...DEFAULT }; } }
function write(app, st) { try { localStorage.setItem(keyFor(app), JSON.stringify(st)); } catch { /* ignore */ } }

const slim = board => (board || []).map(r => ({ name: r.name, xp: r.xp }));
const topXp = board => (board && board.length) ? Math.max(...board.map(r => r.xp || 0)) : 0;
const spotsWord = n => getLang() === "af" ? (n === 1 ? "plek" : "plekke") : (n === 1 ? "spot" : "spots");

/* ============================================================
   ORCHESTRATOR — called at the end of renderHome. No-ops unless
   it's the right day AND this week's popup hasn't been seen yet.
   ============================================================ */
export function maybeShowWeekly(app) {
  const st = read(app);
  const board = app && app.state && app.state.weekly;
  const me = app && app.state && app.state.myWeekly;
  const nowAnchor = startOfWeekTs();
  const force = (() => { try { return new URLSearchParams(location.search).get("wk"); } catch { return null; } })();

  // --- snapshot bookkeeping (every visit) ---
  // When a new week begins, the snapshot we kept of the old week becomes
  // "last week" — the board the crown announces after the server reset.
  if (st.snap && st.snap.anchor < nowAnchor) { st.lastSnap = st.snap; st.snap = null; }
  if (Array.isArray(board)) {
    st.snap = { anchor: nowAnchor, board: slim(board), myRank: (me && me.rank) || null, myXp: (me && me.xp) || 0 };
  }
  write(app, st);

  const day = new Date().getDay();

  // --- CROWN (Mon/Tue): last week's settled results ---
  const settled = st.lastSnap;
  const crownEligible = settled && topXp(settled.board) > 0 && st.crownAnchor !== settled.anchor;
  if (force === "crown" || (CROWN_DAYS.has(day) && crownEligible)) {
    // teacher preview (?wk=crown) with no real snapshot yet: stand in with the live board
    const snap = settled || (Array.isArray(board) ? { anchor: nowAnchor - 1, board: slim(board), myRank: (me && me.rank) || null, myXp: (me && me.xp) || 0 } : null);
    if (snap && topXp(snap.board) > 0) {
      const cfg = buildCrown(st, snap);          // reads OLD prevFinishRank/bestXp for movement
      if (!force) {                              // real show → mark seen + roll personal memory forward
        st.crownAnchor = snap.anchor;
        st.prevFinishRank = snap.myRank;
        st.bestXp = Math.max(st.bestXp || 0, snap.myXp || 0);
        write(app, st);
      }
      showWeeklyModal(app, cfg);
      return;
    }
  }

  // --- RALLY (Fri–Sun): live standings + weekend push ---
  if (force === "rally" || (RALLY_DAYS.has(day) && Array.isArray(board) && st.rallyAnchor !== nowAnchor)) {
    const cfg = buildRally(board || [], me);
    if (!force) { st.rallyAnchor = nowAnchor; write(app, st); }
    showWeeklyModal(app, cfg);
  }
}

/* ---------------- builders ---------------- */
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

function buildCrown(st, snap) {
  const ranked = [...snap.board].sort((a, b) => b.xp - a.xp);
  const winner = ranked[0];
  return {
    kind: "crown",
    emoji: "🌟",
    eyebrow: t("wkCrownEyebrow"),
    headline: t("wkCrownTitle"),
    // Phase B pushes Most Improved + On Fire chips onto this array.
    winners: [{ icon: "🌟", label: t("wkAwardStar"), name: winner.name, xp: winner.xp }],
    personalHTML: crownPersonal(st, snap),
    subHTML: null,
    primaryLabel: t("wkNice"),
  };
}

function crownPersonal(st, snap) {
  const r = snap.myRank, xp = snap.myXp || 0;
  if (r === 1) return t("wkYouAreStar");                 // they took the crown
  if (!xp) return t("wkSatOut");                         // didn't play last week
  let move;
  if (st.prevFinishRank == null) move = t("wkFirstWeek");
  else if (r < st.prevFinishRank) { const up = st.prevFinishRank - r; move = `${t("wkUp")} ${up} ${spotsWord(up)} 🔼`; }
  else if (r > st.prevFinishRank) move = t("wkBounceBack");
  else move = t("wkSteady");
  const best = (st.bestXp > 0 && xp > st.bestXp) ? ` · ${t("wkBestWeek")}` : "";
  return `${t("wkFinishedNum")} #${r} ${t("wkLastWeek")} — ${move}${best}`;
}

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
    cfg.winners.forEach(w => strip.appendChild(el("div", "wk-award", `
      <span class="wk-aw-icon">${w.icon}</span>
      <span class="wk-aw-body"><span class="wk-aw-label">${w.label}</span><span class="wk-aw-name">${w.name}</span></span>
      <span class="wk-aw-xp">★ ${w.xp}</span>`)));
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
  const seeBoard = el("button", "link-btn wk-seeboard", t("wkSeeBoard"));
  seeBoard.addEventListener("click", () => { close(); app.go("leaderboard"); });
  actions.appendChild(seeBoard);
  m.appendChild(actions);

  m.querySelector(".wk-close").addEventListener("click", close);
  ov.addEventListener("click", e => { if (e.target === ov) close(); });
  document.addEventListener("keydown", onKey);

  ov.appendChild(m);
  document.body.appendChild(ov);
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => ov.classList.add("show"));
}
