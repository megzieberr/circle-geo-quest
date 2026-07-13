/* ============================================================
   ADMIN DASHBOARD (teacher view)
   Behind the admin-password check. Reads everything — including
   learner passwords — through the admin RPC, which verifies the
   admin password server-side. No service-role key in the client.
   ============================================================ */
import { api, BACKEND } from "./api.js";
import { ROUNDS, QUESTION_BY_ID } from "./rounds/index.js";
import { showCrownPreview, showRallyPreview } from "./weekly.js";

const root = document.getElementById("admin");
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
let adminPw = null;
let data = null;
let itemStats = null;
let feedback = null;
let championNow = null;   // current teacher's-choice Circle Champion (display name, or null)

const INACTIVE_DAYS = 7;
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
  out.addEventListener("click", () => { adminPw = null; renderLogin(); });
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

  renderChampionCard();

  if (stuck.length) {
    const sec = el("div", "card stuck-card");
    sec.innerHTML = `<h2>🛟 Needs a hand</h2>
      <p class="muted small">Stuck on their current round after 2+ tries. From the 3rd try the game switches them
      to <b>Boost mode</b> automatically (hints open by themselves + a second chance per question, half credit).</p>`;
    const tbl = el("table", "admin-table stuck-table");
    tbl.innerHTML = `<thead><tr><th>Name</th><th>Stuck on</th><th>Tries</th><th>Best</th><th>Last active</th></tr></thead>`;
    const tb = el("tbody");
    stuck.forEach(({ r, rd, p }) => {
      const tr = el("tr");
      tr.innerHTML = `
        <td class="name">${r.name}</td>
        <td>${rd.n}. ${rd.title.en}</td>
        <td class="num">${p.attempts}</td>
        <td class="num">${Math.round((p.best_score || 0) * 100)}%</td>
        <td>${fmtDate(r.lastActive)}</td>`;
      tb.appendChild(tr);
    });
    tbl.appendChild(tb);
    sec.appendChild(tbl);
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
    tr.innerHTML = `
      <td>${r.rank}</td>
      <td class="name">${r.name}</td>
      <td class="pw">${hasPw(r) ? '<span class="pw-set">✓ set</span>' : '<span class="muted">— not set</span>'}</td>
      <td class="num">${r.weeklyXp}</td>
      <td class="num">${r.allTimeXp}</td>
      <td class="${stale ? "flag" : ""}">${fmtDate(r.lastActive)}${stale && r.lastActive ? ' <span class="dot"></span>' : (r.lastActive ? "" : ' <span class="dot"></span>')}</td>
      <td class="chips"><div class="rgrid">${chips}</div></td>
      <td class="rowacts"></td>`;
    const acts = tr.querySelector(".rowacts");
    const rp = el("button", "mini-btn", "reset pw"); rp.title = "Clear password so they can re-pick it";
    rp.addEventListener("click", () => resetPassword(r));
    const rm = el("button", "mini-btn danger", "✕"); rm.title = "Remove learner";
    rm.addEventListener("click", () => removeLearner(r));
    acts.appendChild(rp); acts.appendChild(rm);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrap.appendChild(table);
  root.appendChild(wrap);

  renderFeedbackReport();
  renderItemReport();

  root.appendChild(el("p", "muted small center", "Passwords are hidden. If a learner forgets theirs, use “reset pw” to clear it so they pick a new one. Backend: " + BACKEND));
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
    .map((r, i) => ({ name: r.name, xp: r.weeklyXp, rank: i + 1 }));
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
