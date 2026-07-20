/* ============================================================
   ADMIN DASHBOARD (teacher view)
   Behind the admin-password check. Reads everything — including
   learner passwords — through the admin RPC, which verifies the
   admin password server-side. No service-role key in the client.
   ============================================================ */
import { api, BACKEND } from "./api.js";
import { ROUNDS, ROUND_BY_ID, QUESTION_BY_ID } from "./rounds/index.js";
import { showCrownPreview, showRallyPreview } from "./weekly.js";
import { avatarEmoji } from "./profile.js";

const root = document.getElementById("admin");
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
let adminPw = null;
let data = null;
let itemStats = null;
let feedback = null;
let integrity = null;     // cheat-detection readout (phase13.sql cgg_admin_integrity)
let championNow = null;   // current teacher's-choice Circle Champion (display name, or null)

/* Per-ATTEMPT history (phase15.sql cgg_admin_timeline). `timelineAll` is the
   whole class's recent attempts, loaded once per dashboard load to draw the
   trajectory arrows in "Needs a hand". `timelineOne` is the currently-open
   learner panel, which refreshes itself on a timer while it's open. */
let timelineAll = null;
let timelineOne = null;      // { id, name, rows, at }  — the open panel
let timelineTimer = null;    // live-refresh interval handle
let timelineBusy = false;    // guards against overlapping refreshes

const INACTIVE_DAYS = 7;
const LIVE_MS = 15000;       // how often the open learner panel re-fetches

/* GRADED rounds = the multiple-choice "play" rounds that log a per-question
   event for each answer (js/game.js calls api.logItems for these). They are
   exactly the rounds carrying a non-empty `questions` array; cutscene/discover
   rounds carry `panels` instead, never call logItems, and so legitimately have
   qcount 0 — which is why FLAG A only looks at this set. Same predicate the app
   uses to build QUESTION_BANK (rounds/index.js), so it can't drift out of sync. */
const GRADED_ROUND_IDS = new Set(
  ROUNDS.filter(r => Array.isArray(r.questions) && r.questions.length > 0).map(r => r.id)
);
/* FLAG B tuning — a burst of many graded rounds cleared seconds apart is the
   signature of an automated "pass everything" script (a human can't answer and
   pass a whole round every few seconds). */
const BURST_MIN_ROUNDS = 5;      // at least this many graded passes in the run
const BURST_MAX_GAP_MS = 20000;  // each ≤ ~20s after the previous one
const fmtDate = ts => ts ? new Date(ts).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—";
const daysSince = ts => ts ? Math.floor((Date.now() - new Date(ts).getTime()) / 86400000) : Infinity;
// Whether a learner has set a password — WITHOUT ever revealing it. Works with
// the new backend (hasPassword) and, as a fallback, the old one (password).
const hasPw = r => (r.hasPassword !== undefined ? !!r.hasPassword : r.password != null);

/* ---------- login ---------- */
function renderLogin(msg) {
  root.innerHTML = "";
  const card = el("div", "card admin-login");
  card.innerHTML = `<h1>🔐 Admin</h1><p class="muted">Circle Quest — teacher dashboard <span class="badge-backend">${BACKEND}</span></p>`;
  const pw = el("input", "text-input"); pw.type = "password"; pw.placeholder = "Admin password";
  const err = el("p", "err"); err.hidden = !msg; err.textContent = msg || "";
  const go = el("button", "btn primary big", "Log in");
  const submit = async () => {
    const r = await api.adminLogin(pw.value).catch(() => ({ ok: false }));
    if (!r.ok) return renderLogin("Wrong admin password.");
    adminPw = pw.value;
    await load();
  };
  go.addEventListener("click", submit);
  pw.addEventListener("keydown", e => { if (e.key === "Enter") submit(); });
  card.appendChild(pw); card.appendChild(err); card.appendChild(go);
  root.appendChild(card);
  setTimeout(() => pw.focus(), 50);
}

async function load() {
  root.innerHTML = `<p class="muted center" style="padding:40px">Loading…</p>`;
  const r = await api.adminData(adminPw).catch(() => ({ ok: false }));
  if (!r.ok) return renderLogin("Session expired — log in again.");
  data = r;
  // item-level "hardest questions" report (best-effort; needs the Phase-2 RPC)
  itemStats = api.adminItemStats ? await api.adminItemStats(adminPw).catch(() => ({ ok: false, rows: [] })) : { ok: false, rows: [] };
  // anonymous end-of-game feedback (best-effort; needs the Phase-6 RPC)
  feedback = api.adminFeedback ? await api.adminFeedback(adminPw).catch(() => ({ ok: false })) : { ok: false };
  // current Circle Champion (best-effort; needs the Phase-10 RPC)
  const wk = api.adminWeeklyResults ? await api.adminWeeklyResults(adminPw).catch(() => ({ ok: false })) : { ok: false };
  championNow = wk && wk.ok ? (wk.champion || null) : null;
  // cheat-detection readout (best-effort; needs the Phase-13 RPC)
  integrity = api.adminIntegrity ? await api.adminIntegrity(adminPw).catch(() => ({ ok: false })) : { ok: false };
  // class-wide attempt history for the trajectory arrows (best-effort; Phase-15 RPC)
  timelineAll = api.adminTimeline ? await api.adminTimeline(adminPw, null, 400).catch(() => ({ ok: false, rows: [] })) : { ok: false, rows: [] };
  renderDashboard();
}

/* ---------- dashboard ---------- */
function renderDashboard() {
  root.innerHTML = "";
  const rows = data.rows;
  const inactiveDays = data.inactiveDays || INACTIVE_DAYS;
  const totalPlayed = rows.filter(r => r.allTimeXp > 0).length;
  const inactive = rows.filter(r => daysSince(r.lastActive) >= inactiveDays).length;

  // header + controls
  const head = el("div", "admin-head");
  head.innerHTML = `<div><span class="eyebrow">Teacher dashboard</span><h1>Circle Quest — Admin</h1></div>`;
  const tools = el("div", "admin-tools");
  const preview = el("button", "btn primary small", "👁️ Preview learner view");
  preview.title = "Open the game as a learner with every round unlocked — nothing is saved";
  preview.addEventListener("click", () => window.open("index.html?preview=1", "_blank", "noopener"));
  const previewBoost = el("button", "btn ghost small", "🛟 Preview Boost mode");
  previewBoost.title = "Learner preview with Boost mode forced on: open hints + second chances, as a stuck learner sees it";
  previewBoost.addEventListener("click", () => window.open("index.html?preview=1&boost=1", "_blank", "noopener"));
  const winners = el("button", "btn ghost small", "🌟 Weekly winners");
  winners.title = "Last week's Star of the Week announcement with the REAL winners, exactly as learners see it — screenshot it for the class group";
  winners.addEventListener("click", showWeeklyWinners);
  const rally = el("button", "btn ghost small", "🔥 Rally board");
  rally.title = "This week's live standings as a rally popup (top-3 podium) — screenshot it to hype the weekend push";
  rally.addEventListener("click", showRallyBoard);
  const add = el("button", "btn ghost small", "＋ Add learner");
  add.addEventListener("click", addLearner);
  const csv = el("button", "btn ghost small", "⬇ Export CSV");
  csv.addEventListener("click", exportCSV);
  const resetWk = el("button", "btn ghost small", "↺ Reset weekly board");
  resetWk.addEventListener("click", resetWeekly);
  const refresh = el("button", "btn ghost small", "⟳ Refresh");
  refresh.addEventListener("click", load);
  const out = el("button", "btn ghost small", "Log out");
  out.addEventListener("click", () => { stopLive(); timelineOne = null; adminPw = null; renderLogin(); });
  [preview, previewBoost, winners, rally, add, csv, resetWk, refresh, out].forEach(b => tools.appendChild(b));
  head.appendChild(tools);
  root.appendChild(head);

  // "Needs a hand": learners whose CURRENT round has 2+ failed attempts. The
  // frontier is the first unpassed round (everything before it is passed), so
  // repeated attempts there = genuinely stuck, not just taking a break.
  const stuck = rows.map(r => {
    const rd = ROUNDS.find(x => !(r.rounds && r.rounds[x.id] && r.rounds[x.id].passed));
    const p = rd && r.rounds ? r.rounds[rd.id] : null;
    return (rd && p && (p.attempts || 0) >= 2) ? { r, rd, p } : null;
  }).filter(Boolean).sort((a, b) => (b.p.attempts || 0) - (a.p.attempts || 0));

  // summary
  const sum = el("div", "admin-summary");
  sum.innerHTML = `
    <div class="asum"><b>${rows.length}</b><span>learners</span></div>
    <div class="asum"><b>${totalPlayed}</b><span>have played</span></div>
    <div class="asum ${inactive ? "warn" : ""}"><b>${inactive}</b><span>inactive ${inactiveDays}d+</span></div>
    <div class="asum ${stuck.length ? "warn" : ""}"><b>${stuck.length}</b><span>stuck (2+ tries)</span></div>`;
  root.appendChild(sum);

  // the live learner-timeline panel renders into here (kept as its own node so
  // the refresh timer can repaint it without rebuilding the whole dashboard)
  root.appendChild(el("div", "", '<div id="timeline-host"></div>'));

  renderChampionCard();

  if (stuck.length) {
    const sec = el("div", "card stuck-card");
    sec.innerHTML = `<h2>🛟 Needs a hand</h2>
      <p class="muted small">Stuck on their current round after 2+ tries. From the 3rd try the game switches them
      to <b>Boost mode</b> automatically (hints open by themselves + a second chance per question, half credit).</p>
      <p class="muted small">Read the <b>arrow</b> before stepping in: <span class="ttrend climbing">↗ climbing</span> means they're
      getting there on their own and an interruption would take the win off them; <span class="ttrend plateau">→ flat</span> or
      <span class="ttrend sliding">↘ sliding</span> means the tries have stopped teaching them anything and they're
      practising the same wrong idea. Click any name for the full attempt history.</p>`;
    const tbl = el("table", "admin-table stuck-table");
    tbl.innerHTML = `<thead><tr><th>Name</th><th>Stuck on</th><th>Tries</th><th>Every try</th><th>Best</th><th>Last active</th></tr></thead>`;
    const tb = el("tbody");
    stuck.forEach(({ r, rd, p }) => {
      const seq = attemptChain(timelineAll && timelineAll.rows, r.id, rd.id);
      const t = trajectory(seq);
      const tr = el("tr");
      tr.innerHTML = `
        <td class="name"><button class="linkish" type="button">${escapeHtml(r.name)}</button></td>
        <td>${rd.n}. ${rd.title.en}</td>
        <td class="num">${p.attempts}</td>
        <td class="tcell">${seq.length
          ? `<span class="tchain">${chainHtml(seq)}</span> <span class="ttrend ${t.key}">${t.arrow}</span>`
          : '<span class="muted small">—</span>'}</td>
        <td class="num">${Math.round((p.best_score || 0) * 100)}%</td>
        <td>${fmtDate(r.lastActive)}</td>`;
      tr.querySelector(".linkish").addEventListener("click", () => openTimeline(r));
      tb.appendChild(tr);
    });
    tbl.appendChild(tb);
    sec.appendChild(tbl);
    if (timelineAll && !timelineAll.ok) {
      sec.appendChild(el("p", "muted small", "The per-try history needs the Phase-15 database update (run supabase/phase15.sql) — the rest of this panel works without it."));
    }
    root.appendChild(sec);
  }

  // table
  const wrap = el("div", "table-wrap");
  const table = el("table", "admin-table");
  table.innerHTML = `<thead><tr>
      <th>#</th><th>Name</th><th>Password</th><th>Weekly</th><th>All-time</th>
      <th>Last active</th><th>Rounds (best %)</th><th></th>
    </tr></thead>`;
  // NB: the Password column shows only whether one is SET — never the value.
  const tbody = el("tbody");
  rows.forEach(r => {
    const stale = daysSince(r.lastActive) >= inactiveDays;
    const tr = el("tr", stale ? "stale" : "");
    const chips = ROUNDS.map(rd => {
      const p = r.rounds && r.rounds[rd.id];
      const best = p ? Math.round((p.best_score || 0) * 100) : 0;
      const cls = p && p.passed ? "ok" : (p && p.attempts ? "try" : "none");
      return `<span class="rchip ${cls}" title="${rd.n}. ${rd.title.en} — ${p ? best + "%" : "not started"}">${rd.n}</span>`;
    }).join("");
    // Real display_name is ALWAYS the primary identifier here (hard requirement) —
    // the nickname, when a learner has set one, only ever rides along in
    // parentheses next to it, with the avatar emoji in front. Nickname is
    // freeform (no profanity filter — see docs/engagement-plan.md §3), so it
    // MUST be escaped; the real name is admin-entered but escaped too for safety.
    const nickPart = r.nickname ? ` <span class="muted">(${escapeHtml(r.nickname)})</span>` : "";
    tr.innerHTML = `
      <td>${r.rank}</td>
      <td class="name">${avatarEmoji(r.avatarId)} <button class="linkish" type="button" title="Show every attempt, live">${escapeHtml(r.name)}</button>${nickPart}</td>
      <td class="pw">${hasPw(r) ? '<span class="pw-set">✓ set</span>' : '<span class="muted">— not set</span>'}</td>
      <td class="num">${r.weeklyXp}</td>
      <td class="num">${r.allTimeXp}</td>
      <td class="${stale ? "flag" : ""}">${fmtDate(r.lastActive)}${stale && r.lastActive ? ' <span class="dot"></span>' : (r.lastActive ? "" : ' <span class="dot"></span>')}</td>
      <td class="chips"><div class="rgrid">${chips}</div></td>
      <td class="rowacts"></td>`;
    tr.querySelector(".name .linkish").addEventListener("click", () => openTimeline(r));
    const acts = tr.querySelector(".rowacts");
    const rp = el("button", "mini-btn", "reset pw"); rp.title = "Clear password so they can re-pick it";
    rp.addEventListener("click", () => resetPassword(r));
    acts.appendChild(rp);
    if (r.nickname) {
      const rn = el("button", "mini-btn", "reset nickname");
      rn.title = "Clear this learner's nickname (moderation) — they fall back to their real name until they pick a new one";
      rn.addEventListener("click", () => resetNickname(r));
      acts.appendChild(rn);
    }
    const rm = el("button", "mini-btn danger", "✕"); rm.title = "Remove learner";
    rm.addEventListener("click", () => removeLearner(r));
    acts.appendChild(rm);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrap.appendChild(table);
  root.appendChild(wrap);

  renderFeedbackReport();
  renderItemReport();
  renderIntegrityReport();

  root.appendChild(el("p", "muted small center", "Passwords are hidden. If a learner forgets theirs, use “reset pw” to clear it so they pick a new one. Backend: " + BACKEND));
}

/* ============================================================
   ATTEMPT TRAJECTORY  (phase15)
   ------------------------------------------------------------
   The dashboard summary (best %, N attempts) cannot tell these apart:

     40 → 60 → 65 → 100   a learner climbing out of it themselves
     65 → 65 → 65 → 65    a learner re-running the same wrong idea

   Both read as "65%+, 4 tries". They call for opposite responses:
   the first wants to be LEFT ALONE (interrupting steals the win), the
   second wants a teacher. So we show the shape, not the maximum.

   The arrow reports the LAST STEP only — it's a hint. The full chain
   is always printed next to it, because the chain is the real answer
   and a single arrow can't carry a plateau-after-a-climb.
   ============================================================ */
const pctOf = score => (score == null ? null : Math.round(Number(score) * 100));

/* Every attempt a learner made at one round, oldest first, as percentages. */
function attemptChain(rows, studentId, roundId) {
  return (rows || [])
    .filter(e => e.studentId === studentId && e.roundId === roundId)
    .map(e => pctOf(e.score))
    .filter(v => v != null);
}
function trajectory(seq) {
  if (!seq || seq.length < 2) return { key: "single", arrow: "", label: "first try" };
  const last = seq[seq.length - 1], prev = seq[seq.length - 2];
  const gain = last - seq[0];
  if (last > prev)  return { key: "climbing", arrow: "↗", label: `climbing (+${last - prev} last try, +${gain} overall)` };
  if (last < prev)  return { key: "sliding",  arrow: "↘", label: `sliding (${last - prev} last try)` };
  return { key: "plateau", arrow: "→", label: gain > 0 ? `plateau after +${gain}` : "flat — same score again" };
}
/* Separator is a light chevron, NOT an arrow: the trend arrows (↗ → ↘) sit
   right after the chain, and a plateau's "→" next to a chain of "→"s reads as
   a missing value ("65% → 65% →"). */
const chainHtml = seq => seq.map((v, i) =>
  `<span class="tstep${i === seq.length - 1 ? " last" : ""}">${v}%</span>`).join('<span class="tarrow">›</span>');

/* ---------- learner timeline panel (live) ---------- */
function stopLive() {
  if (timelineTimer) { clearInterval(timelineTimer); timelineTimer = null; }
}
function closeTimeline() {
  stopLive();
  timelineOne = null;
  paintTimeline();
}
async function openTimeline(row) {
  timelineOne = { id: row.id, name: row.name, rows: null, at: null };
  paintTimeline();
  await refreshTimeline();
  stopLive();
  timelineTimer = setInterval(refreshTimeline, LIVE_MS);
  paintTimeline();          // repaint so the "live" dot appears (the timer only exists now)
}
async function refreshTimeline() {
  if (!timelineOne || !api.adminTimeline || timelineBusy) return;
  timelineBusy = true;
  const id = timelineOne.id;
  const r = await api.adminTimeline(adminPw, id, 400).catch(() => ({ ok: false }));
  timelineBusy = false;
  if (!timelineOne || timelineOne.id !== id) return;   // panel changed while in flight
  if (r && r.ok) { timelineOne.rows = r.rows || []; timelineOne.at = Date.now(); }
  else if (timelineOne.rows == null) timelineOne.rows = [];
  paintTimeline();
}

/* Collapse the raw event stream into readable runs.

   GRADED rounds merge across the WHOLE timeline, not just consecutive events
   — a learner who fails a round, wanders off to do the Daily Challenge, then
   comes back and retries must still show as ONE chain. Grouping only
   consecutive events split exactly that case into two fragments and destroyed
   the climb the panel exists to show. Each merged entry is placed at its LAST
   attempt, so the newest activity stays at the bottom.

   Cutscene/discovery rounds and dailies stay chronological, grouped only when
   consecutive: they legitimately log several zero-XP events as the learner
   clicks through the panels, so they collapse to one "explored" line instead
   of a wall of 100%s — but two dailies on different days stay two lines. */
function timelineRuns(rows) {
  const runs = [];
  const gradedRun = {};                       // roundId -> its single merged entry
  (rows || []).forEach(e => {
    if (GRADED_ROUND_IDS.has(e.roundId)) {
      const hit = gradedRun[e.roundId];
      if (hit) { hit.events.push(e); hit.end = e.at; return; }
      const run = { roundId: e.roundId, events: [e], start: e.at, end: e.at };
      gradedRun[e.roundId] = run;
      runs.push(run);
      return;
    }
    const prev = runs[runs.length - 1];
    if (prev && prev.roundId === e.roundId) { prev.events.push(e); prev.end = e.at; return; }
    runs.push({ roundId: e.roundId, events: [e], start: e.at, end: e.at });
  });
  return runs.sort((a, b) => String(a.end).localeCompare(String(b.end)));
}
function paintTimeline() {
  const host = document.getElementById("timeline-host");
  if (!host) return;
  host.innerHTML = "";
  if (!timelineOne) return;

  const sec = el("div", "card timeline-card");
  const head = el("div", "timeline-head");
  const live = timelineTimer ? `<span class="live-dot" title="Refreshing every ${LIVE_MS / 1000}s"></span><span class="muted small">live</span>` : "";
  head.innerHTML = `<h2>📈 ${escapeHtml(timelineOne.name)} — every attempt</h2>
    <div class="timeline-meta">${live}${timelineOne.at ? `<span class="muted small">updated ${new Date(timelineOne.at).toLocaleTimeString()}</span>` : ""}</div>`;
  const close = el("button", "btn ghost small", "✕ Close");
  close.addEventListener("click", closeTimeline);
  head.appendChild(close);
  sec.appendChild(head);

  if (timelineOne.rows == null) {
    sec.appendChild(el("p", "muted small", "Loading…"));
    host.appendChild(sec);
    return;
  }
  if (!api.adminTimeline) {
    sec.appendChild(el("p", "muted small", "The attempt timeline needs the Phase-15 database update (run supabase/phase15.sql)."));
    host.appendChild(sec);
    return;
  }
  if (!timelineOne.rows.length) {
    sec.appendChild(el("p", "muted small", "No attempts recorded yet."));
    host.appendChild(sec);
    return;
  }

  sec.appendChild(el("p", "muted small",
    "Newest at the bottom. Every attempt is shown — including the failed ones — because the shape of the climb is the thing the best score hides."));

  const list = el("div", "timeline-list");
  timelineRuns(timelineOne.rows).forEach(run => {
    const rd = ROUND_BY_ID[run.roundId];
    const graded = GRADED_ROUND_IDS.has(run.roundId);
    const item = el("div", "trun");

    if (run.roundId === "daily") {
      const pcts = run.events.map(e => pctOf(e.score)).filter(v => v != null);
      item.className = "trun minor";
      item.innerHTML = `<span class="tlabel">🔥 Daily challenge</span>
        <span class="tchain">${pcts.length ? chainHtml(pcts) : ""}</span>
        <span class="ttime muted small">${fmtDateTime(run.end)}</span>`;
    } else if (run.roundId === "streak" || run.roundId === "perfectweek") {
      item.className = "trun minor";
      item.innerHTML = `<span class="tlabel">🎁 ${run.roundId === "streak" ? "Streak milestone" : "Perfect week"}</span>
        <span class="tchain muted small">+${run.events.reduce((a, e) => a + (e.xp || 0), 0)} XP</span>
        <span class="ttime muted small">${fmtDateTime(run.end)}</span>`;
    } else if (!graded) {
      item.className = "trun minor";
      item.innerHTML = `<span class="tlabel">👁️ ${escapeHtml(roundLabel(run.roundId))}</span>
        <span class="tchain muted small">explored</span>
        <span class="ttime muted small">${fmtDateTime(run.end)}</span>`;
    } else {
      const pcts = run.events.map(e => pctOf(e.score)).filter(v => v != null);
      const t = trajectory(pcts);
      const best = Math.max(...pcts);
      const cleared = best >= 80;
      item.className = `trun ${cleared ? "cleared" : "open"}`;
      item.innerHTML = `
        <span class="tlabel">${cleared ? "✅" : "🛟"} ${escapeHtml(roundLabel(run.roundId))}</span>
        <span class="tchain">${chainHtml(pcts)}</span>
        <span class="ttrend ${t.key}">${t.arrow} <span class="muted small">${escapeHtml(t.label)}</span></span>
        <span class="ttime muted small">${fmtDateTime(run.end)}</span>`;
    }
    list.appendChild(item);
  });
  sec.appendChild(list);
  host.appendChild(sec);
  sec.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* ---------- Circle Champion (teacher's-choice honour) ---------- */
/* A hand-picked award for the learner who plays the game the way it's meant to
   be played — every day, steady, all the way through — which the burst-friendly
   weekly awards can't capture. Independent of last week's XP, so a frantic
   catch-up day can never take it. Shown as the hero chip in the Monday popup. */
function renderChampionCard() {
  const sec = el("div", "card champion-card");
  sec.innerHTML = `<h2>🏆 Circle Champion</h2>
    <p class="muted small">A hand-picked honour for the learner playing the way the game is meant to be played —
    every day, steady, all the way through. It leads Monday's Results Day popup and isn't tied to weekly XP,
    so nobody can cram their way past it. Set it here; it stays until you change it.</p>`;
  const row = el("div", "champion-row");
  const current = el("p", "champion-current",
    championNow ? `Current champion: <b>${escapeHtml(championNow)}</b>` : `<span class="muted">No champion set yet.</span>`);
  const select = el("select", "champion-select");
  select.innerHTML = `<option value="">— choose a learner —</option>` +
    data.rows.map(r => `<option value="${escapeHtml(r.name)}"${r.name === championNow ? " selected" : ""}>${escapeHtml(r.name)}</option>`).join("");
  const save = el("button", "btn primary small", "Award champion");
  save.addEventListener("click", () => setChampion(select.value));
  const clear = el("button", "btn ghost small", "Clear");
  clear.addEventListener("click", () => setChampion(""));
  row.appendChild(select); row.appendChild(save); row.appendChild(clear);
  sec.appendChild(current);
  sec.appendChild(row);
  root.appendChild(sec);
}
async function setChampion(name) {
  if (!api.adminSetChampion)
    return alert("Circle Champion needs the Phase-10 database update — run supabase/phase10.sql in the Supabase SQL editor.");
  const clean = (name || "").trim();
  if (clean && !confirm(`Award Circle Champion to ${clean}?`)) return;
  if (!clean && championNow && !confirm(`Clear the Circle Champion (${championNow})?`)) return;
  const r = await api.adminSetChampion(adminPw, clean || null).catch(() => ({ ok: false }));
  if (!r.ok) return alert("Could not set the champion. If this is the live class, make sure supabase/phase10.sql has been run.");
  championNow = r.champion || (clean || null);
  renderDashboard();
}

/* ---------- anonymous feedback report ---------- */
const FB_FACES = [
  { v: 1, emoji: "😭", label: "Hated it" },
  { v: 2, emoji: "🙁", label: "Didn't like it" },
  { v: 3, emoji: "😐", label: "It was OK" },
  { v: 4, emoji: "🙂", label: "Liked it" },
  { v: 5, emoji: "😍", label: "Loved it" },
];
function renderFeedbackReport() {
  const section = el("div", "admin-report admin-feedback");
  section.appendChild(el("h2", "report-title", "💬 How learners feel about the game (anonymous)"));

  if (!feedback || !feedback.ok) {
    section.appendChild(el("p", "muted small", "Anonymous feedback isn't available yet — this needs the Phase-6 database update (run supabase/phase6.sql)."));
    root.appendChild(section);
    return;
  }
  const total = feedback.total || 0;
  if (!total) {
    section.appendChild(el("p", "muted small", "No feedback yet. Once learners tap the faces, the spread and their comments show up here — with no names attached."));
    root.appendChild(section);
    return;
  }

  const counts = feedback.counts || {};
  const learners = feedback.totalLearners || 0;
  const avg = feedback.average != null ? Math.round(feedback.average * 10) / 10 : null;
  const avgFace = avg ? FB_FACES[Math.min(4, Math.max(0, Math.round(avg) - 1))].emoji : "—";
  section.appendChild(el("p", "muted small",
    `${total} of ${learners} learner${learners === 1 ? "" : "s"} answered · average ${avg != null ? avg + " " + avgFace : "—"}. Honest and anonymous — you can't see who said what.`));

  // face spread (a bar per face, width = share of responses)
  const max = Math.max(1, ...FB_FACES.map(f => counts[f.v] || counts[String(f.v)] || 0));
  const spread = el("div", "fb-spread");
  FB_FACES.forEach(f => {
    const c = counts[f.v] || counts[String(f.v)] || 0;
    const pct = total ? Math.round((c / total) * 100) : 0;
    const row = el("div", "fb-srow");
    row.innerHTML = `
      <span class="fb-face" title="${f.label}">${f.emoji}</span>
      <span class="fb-bar"><i style="width:${Math.round((c / max) * 100)}%"></i></span>
      <span class="fb-num">${c}<span class="muted"> · ${pct}%</span></span>`;
    spread.appendChild(row);
  });
  section.appendChild(spread);

  // written comments
  const comments = feedback.comments || [];
  if (comments.length) {
    section.appendChild(el("h3", "fb-comments-title", `Written comments (${comments.length})`));
    const list = el("div", "fb-comments");
    comments.forEach(c => {
      const face = FB_FACES.find(f => f.v === c.rating);
      const item = el("div", "fb-comment");
      item.innerHTML = `
        <span class="fb-cface" title="${face ? face.label : ""}">${face ? face.emoji : "💬"}</span>
        <div class="fb-cbody"><p>${escapeHtml(c.comment)}</p><span class="fb-cdate muted small">${fmtDate(c.at)}</span></div>`;
      list.appendChild(item);
    });
    section.appendChild(list);
  } else {
    section.appendChild(el("p", "muted small", "No written comments yet — only face ratings so far."));
  }

  root.appendChild(section);
}

/* ---------- "hardest questions" report ---------- */
function renderItemReport() {
  const section = el("div", "admin-report");
  section.appendChild(el("h2", "report-title", "🔍 Hardest questions"));
  const rows = (itemStats && itemStats.rows) || [];

  if (!itemStats || !itemStats.ok) {
    section.appendChild(el("p", "muted small", "Question-level stats aren't available yet — this needs the Phase-2 database update (cgg_admin_item_stats)."));
    root.appendChild(section);
    return;
  }
  if (!rows.length) {
    section.appendChild(el("p", "muted small", "No question attempts logged yet. Once learners play, the questions they trip on most show up here."));
    root.appendChild(section);
    return;
  }

  section.appendChild(el("p", "muted small", "Ranked by lowest first-try success — these are the misconceptions to target first. Replays are excluded. “Learners” = how many different learners tried it; “Attempts” counts retries too, so Attempts > Learners means some are retrying."));
  const wrap = el("div", "table-wrap");
  const table = el("table", "admin-table report-table");
  table.innerHTML = `<thead><tr><th>Rd</th><th>Question</th><th>First-try</th><th>Learners</th><th>Attempts</th><th>Most-picked wrong answer</th></tr></thead>`;
  const tbody = el("tbody");
  rows.forEach(r => {
    const entry = QUESTION_BY_ID[r.qid];
    const label = entry ? (entry.q.prompt ? truncate(entry.q.prompt.en, 70) : r.qid) : r.qid;
    const rd = entry ? entry.roundN : (r.roundId || "—");
    const pct = r.correctPct;
    const cls = pct == null ? "" : (pct < 50 ? "pct-bad" : pct < 75 ? "pct-warn" : "pct-ok");
    const wrong = r.topWrong ? `${escapeHtml(String(r.topWrong))} <span class="muted">×${r.topWrongCount}</span>` : "—";
    const tr = el("tr");
    const learners = (r.learners != null) ? r.learners : "—";
    tr.innerHTML = `<td>${rd}</td><td class="qlabel">${escapeHtml(label)}</td>
      <td class="num ${cls}">${pct == null ? "—" : pct + "%"}</td>
      <td class="num">${learners}</td>
      <td class="num">${r.attempts}</td><td>${wrong}</td>`;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrap.appendChild(table);
  section.appendChild(wrap);
  root.appendChild(section);
}
const truncate = (s, n) => { s = String(s || ""); return s.length > n ? s.slice(0, n - 1) + "…" : s; };

/* ---------- "Worth a look" — light-touch cheat-detection ----------
   Because every question + answer lives in the client (needed for offline
   play), the server can't PREVENT a fake "pass" submitted straight to
   cgg_submit_round — the defence is DETECTION. cgg_admin_integrity (phase13)
   hands us, per learner, every PASSED round with how many per-question events
   were logged (qcount) and when it was last played (at). We flag only two
   patterns; a clean class shows a single reassuring line, not a wall of noise.
   This is a heads-up to eyeball, explicitly NOT an accusation. */
const roundLabel = rid => {
  const rd = ROUND_BY_ID[rid];
  return rd ? `${rd.n}. ${rd.title && rd.title.en ? rd.title.en : rid}` : rid;
};
const fmtDateTime = ts => {
  const t2 = typeof ts === "number" ? ts : Date.parse(ts);
  return Number.isFinite(t2) ? new Date(t2).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
};
const fmtSpan = ms => {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${s % 60}s`;
};
function renderIntegrityReport() {
  const section = el("div", "admin-report admin-integrity");
  section.appendChild(el("h2", "report-title", "⚠️ Worth a look"));

  if (!integrity || !integrity.ok) {
    section.appendChild(el("p", "muted small", "This heads-up needs the Phase-13 database update (run supabase/phase13.sql). It's optional — nothing else on the dashboard depends on it."));
    root.appendChild(section);
    return;
  }

  section.appendChild(el("p", "muted small",
    "A calm heads-up, not an accusation. These are just patterns worth eyeballing — a learner might have a totally innocent reason. The game keeps its questions on the phone (so it works offline), so this is how we spot a round that was “passed” without actually being played."));

  const students = integrity.students || [];

  // FLAG A — a GRADED multiple-choice round marked passed, but with zero
  // logged questions. A real graded pass logs one event per question; zero
  // means the pass was submitted without playing. Non-graded intro/watch/
  // discover rounds legitimately log nothing, so they're skipped entirely.
  const flagA = [];
  students.forEach(s => {
    const bad = (s.rounds || []).filter(r => GRADED_ROUND_IDS.has(r.round) && (r.qcount || 0) === 0);
    if (bad.length) flagA.push({ name: s.name, rounds: bad.map(r => r.round) });
  });

  // FLAG B — many graded rounds cleared within seconds of each other. Sort a
  // learner's graded passes by time and find the longest run where each pass
  // is ≤ BURST_MAX_GAP_MS after the previous; flag runs of BURST_MIN_ROUNDS+.
  // Taxonomy-light: needs only the timestamps, so it fires even if FLAG A's
  // round set were ever wrong. This is the signal that catches a bulk script.
  const flagB = [];
  students.forEach(s => {
    const times = (s.rounds || [])
      .filter(r => GRADED_ROUND_IDS.has(r.round) && r.at)
      .map(r => Date.parse(r.at))
      .filter(Number.isFinite)
      .sort((a, b) => a - b);
    if (times.length < BURST_MIN_ROUNDS) return;
    let runStart = 0;
    let best = null;
    for (let i = 1; i <= times.length; i++) {
      if (i < times.length && times[i] - times[i - 1] <= BURST_MAX_GAP_MS) continue;
      const len = i - runStart;
      if (len >= BURST_MIN_ROUNDS && (!best || len > best.count)) {
        best = { count: len, start: times[runStart], end: times[i - 1] };
      }
      runStart = i;
    }
    if (best) flagB.push({ name: s.name, ...best });
  });

  // Currently locked-out learners (FYI: the throttle fired) — never in local
  // mode (lockedUntil is always null there), only on the live server.
  const lockedNow = students
    .filter(s => s.lockedUntil && Date.parse(s.lockedUntil) > Date.now())
    .map(s => ({ name: s.name, until: s.lockedUntil }));

  if (!flagA.length && !flagB.length) {
    section.appendChild(el("p", "muted small ok-line", "Nothing unusual — every passed round has the play history you'd expect. 👍"));
  }

  if (flagA.length) {
    const box = el("div", "integrity-flag");
    box.appendChild(el("h3", "flag-title", "Cleared a graded round with no work logged"));
    box.appendChild(el("p", "muted small", "These graded rounds show as passed but logged zero answered questions — as if the pass arrived without the round being played."));
    const list = el("ul", "flag-list");
    flagA.forEach(f => {
      const li = el("li");
      li.innerHTML = `<b>${escapeHtml(f.name)}</b> — ${f.rounds.map(r => escapeHtml(roundLabel(r))).join(", ")}`;
      list.appendChild(li);
    });
    box.appendChild(list);
    section.appendChild(box);
  }

  if (flagB.length) {
    const box = el("div", "integrity-flag");
    box.appendChild(el("h3", "flag-title", "Cleared many rounds in seconds"));
    box.appendChild(el("p", "muted small", `Several graded rounds passed in one very short burst (${BURST_MIN_ROUNDS}+ rounds, each within ${Math.round(BURST_MAX_GAP_MS / 1000)}s of the last) — faster than the rounds can really be played.`));
    const list = el("ul", "flag-list");
    flagB.forEach(f => {
      const li = el("li");
      li.innerHTML = `<b>${escapeHtml(f.name)}</b> — ${f.count} rounds in ${escapeHtml(fmtSpan(f.end - f.start))} <span class="muted">(around ${escapeHtml(fmtDateTime(f.start))})</span>`;
      list.appendChild(li);
    });
    box.appendChild(list);
    section.appendChild(box);
  }

  if (lockedNow.length) {
    const box = el("div", "integrity-fyi");
    box.appendChild(el("p", "muted small",
      `FYI — the login throttle is currently active for: ${lockedNow.map(l => `${escapeHtml(l.name)} (until ${escapeHtml(fmtDateTime(l.until))})`).join(", ")}. It clears itself; if it's the real learner, they can just wait or you can reset nothing — it lifts on its own.`));
    section.appendChild(box);
  }

  root.appendChild(section);
}

/* ---------- weekly announcement previews (screenshot for the class group) ---------- */
async function showWeeklyWinners() {
  const r = api.adminWeeklyResults
    ? await api.adminWeeklyResults(adminPw).catch(() => ({ ok: false }))
    : { ok: false };
  if (!r.ok) return alert("Weekly winners need the Phase-8 database update — run supabase/phase8.sql in the Supabase SQL editor.");
  if (!r.star) return alert("No XP was earned last week, so there are no winners to announce yet.");
  showCrownPreview(r);
}
function showRallyBoard() {
  const board = data.rows.filter(r => r.weeklyXp > 0)
    .sort((a, b) => b.weeklyXp - a.weeklyXp)
    .map((r, i) => ({ name: r.name, nickname: r.nickname, avatarId: r.avatarId, xp: r.weeklyXp, rank: i + 1 }));
  if (!board.length) return alert("Nobody has earned XP yet this week — the rally board is still empty.");
  showRallyPreview(board);
}

/* ---------- actions ---------- */
async function addLearner() {
  const name = prompt("New learner's display name (first name, or first name + surname initial):");
  if (!name || !name.trim()) return;
  const r = await api.adminAddStudent(adminPw, name.trim()).catch(() => ({ ok: false }));
  if (!r.ok) alert("Could not add learner."); else load();
}
async function removeLearner(row) {
  if (!confirm(`Remove ${row.name}? This deletes their scores too.`)) return;
  const r = await api.adminRemoveStudent(adminPw, row.id).catch(() => ({ ok: false }));
  if (!r.ok) alert("Could not remove."); else load();
}
async function resetPassword(row) {
  if (!confirm(`Clear ${row.name}'s password so they re-pick it on next login?`)) return;
  const r = await api.adminResetPassword(adminPw, row.id).catch(() => ({ ok: false }));
  if (!r.ok) alert("Could not reset."); else load();
}
/* Nickname moderation: DELETE (null) a learner's nickname, never edit it —
   they fall back to their real display_name everywhere until they pick a
   new one. The server logs the old value to the events table first (Phase
   12 / cgg_admin_reset_nickname) so a record survives the deletion. */
async function resetNickname(row) {
  if (!api.adminResetNickname)
    return alert("Nickname reset needs the Phase-12 database update — run supabase/phase12.sql in the Supabase SQL editor.");
  if (!confirm(`Clear ${row.name}'s nickname ("${row.nickname}")? They'll show by their real name until they pick a new one.`)) return;
  const r = await api.adminResetNickname(adminPw, row.id).catch(() => ({ ok: false }));
  if (!r.ok) alert("Could not reset nickname."); else load();
}
async function resetWeekly() {
  if (!confirm("Reset the weekly leaderboard to zero for everyone?")) return;
  const r = await api.adminResetWeekly(adminPw).catch(() => ({ ok: false }));
  if (!r.ok) alert("Could not reset weekly board."); else load();
}
function exportCSV() {
  const header = ["Rank", "Name", "PasswordSet", "WeeklyXP", "AllTimeXP", "LastActive", "RoundsPassed", "BestPerRound"];
  const lines = [header.join(",")];
  data.rows.forEach(r => {
    const passed = ROUNDS.filter(rd => r.rounds && r.rounds[rd.id] && r.rounds[rd.id].passed).length;
    const best = ROUNDS.map(rd => { const p = r.rounds && r.rounds[rd.id]; return `${rd.n}:${p ? Math.round((p.best_score || 0) * 100) : 0}`; }).join(" ");
    const cells = [r.rank, r.name, hasPw(r) ? "yes" : "no", r.weeklyXp, r.allTimeXp, fmtDate(r.lastActive), `${passed}/${ROUNDS.length}`, best];
    lines.push(cells.map(csvCell).join(","));
  });
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `circle-quest-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}
const csvCell = v => { const s = String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
const escapeHtml = s => String(s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

renderLogin();
