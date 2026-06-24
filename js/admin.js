/* ============================================================
   ADMIN DASHBOARD (teacher view)
   Behind the admin-password check. Reads everything — including
   learner passwords — through the admin RPC, which verifies the
   admin password server-side. No service-role key in the client.
   ============================================================ */
import { api, BACKEND } from "./api.js";
import { ROUNDS, QUESTION_BY_ID } from "./rounds/index.js";

const root = document.getElementById("admin");
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
let adminPw = null;
let data = null;
let itemStats = null;

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
  [add, csv, resetWk, refresh, out].forEach(b => tools.appendChild(b));
  head.appendChild(tools);
  root.appendChild(head);

  // summary
  const sum = el("div", "admin-summary");
  sum.innerHTML = `
    <div class="asum"><b>${rows.length}</b><span>learners</span></div>
    <div class="asum"><b>${totalPlayed}</b><span>have played</span></div>
    <div class="asum ${inactive ? "warn" : ""}"><b>${inactive}</b><span>inactive ${inactiveDays}d+</span></div>`;
  root.appendChild(sum);

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

  renderItemReport();

  root.appendChild(el("p", "muted small center", "Passwords are hidden. If a learner forgets theirs, use “reset pw” to clear it so they pick a new one. Backend: " + BACKEND));
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

  section.appendChild(el("p", "muted small", "Ranked by lowest first-try success — these are the misconceptions to target first. Replays are excluded."));
  const wrap = el("div", "table-wrap");
  const table = el("table", "admin-table report-table");
  table.innerHTML = `<thead><tr><th>Rd</th><th>Question</th><th>First-try</th><th>Attempts</th><th>Most-picked wrong answer</th></tr></thead>`;
  const tbody = el("tbody");
  rows.forEach(r => {
    const entry = QUESTION_BY_ID[r.qid];
    const label = entry ? (entry.q.prompt ? truncate(entry.q.prompt.en, 70) : r.qid) : r.qid;
    const rd = entry ? entry.roundN : (r.roundId || "—");
    const pct = r.correctPct;
    const cls = pct == null ? "" : (pct < 50 ? "pct-bad" : pct < 75 ? "pct-warn" : "pct-ok");
    const wrong = r.topWrong ? `${escapeHtml(String(r.topWrong))} <span class="muted">×${r.topWrongCount}</span>` : "—";
    const tr = el("tr");
    tr.innerHTML = `<td>${rd}</td><td class="qlabel">${escapeHtml(label)}</td>
      <td class="num ${cls}">${pct == null ? "—" : pct + "%"}</td>
      <td class="num">${r.attempts}</td><td>${wrong}</td>`;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrap.appendChild(table);
  section.appendChild(wrap);
  root.appendChild(section);
}
const truncate = (s, n) => { s = String(s || ""); return s.length > n ? s.slice(0, n - 1) + "…" : s; };

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
