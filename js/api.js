/* ============================================================
   API LAYER
   ------------------------------------------------------------
   One async interface, two interchangeable backends:

     • LocalBackend     — localStorage. Used for offline play and
                          local development. Fully functional.
     • SupabaseBackend  — added at step 4; calls SECURITY DEFINER
                          RPC functions that verify the password
                          server-side. Same method signatures, so
                          the rest of the app never changes.

   Every learner method takes (name, password) and the backend
   verifies the password before doing anything — mirroring the
   real RPC security model exactly.
   ============================================================ */
import { CONFIG } from "./config.js";
import { SupabaseBackend, hasSupabase } from "./supabase.js";

/* ---------- time helpers ---------- */
function startOfWeek(ts = Date.now()) {
  const d = new Date(ts);
  const day = (d.getDay() + 6) % 7;          // 0 = Monday
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d.getTime();
}
/* assign SQL rank() semantics (ties share a rank, the next rank skips) over
   rows already sorted by `key` descending; writes id -> rank into `out`. */
function rankBy(sortedRows, key, out) {
  let rank = 0, prev = null, seen = 0;
  sortedRows.forEach(r => { seen++; if (prev === null || r[key] !== prev) { rank = seen; prev = r[key]; } out[r.id] = rank; });
}
/* Local calendar day of a timestamp (device timezone), as YYYY-MM-DD. */
const localDate = ts => {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
/* Shared Star-of-the-Week computation (last Mon→Sun week): the settled board
   plus the three distinct award winners AND the Perfect Week list (everyone
   with a daily on all 7 days). Used by BOTH the learner crown popup and the
   admin "weekly winners" preview, so the two always agree. Daily counts are
   DISTINCT local days; On-Fire ties go to the earliest finisher, not the
   alphabet (mirrors phase9.sql). */
function computeWeeklyAwards(students, events) {
  const thisWeek = startOfWeek();
  const lwStart = thisWeek - 7 * 864e5, lwEnd = thisWeek, pwStart = thisWeek - 14 * 864e5;

  const agg = {};
  Object.values(students).forEach(st => { agg[st.id] = { id: st.id, name: st.display_name, lw: 0, pw: 0, daySet: new Set(), lastDaily: 0 }; });
  events.forEach(e => {
    const a = agg[e.studentId]; if (!a) return;
    if (e.ts >= lwStart && e.ts < lwEnd) {
      a.lw += e.xp;
      if (e.roundId === "daily") { a.daySet.add(localDate(e.ts)); a.lastDaily = Math.max(a.lastDaily, e.ts); }
    }
    else if (e.ts >= pwStart && e.ts < lwStart) { a.pw += e.xp; }
  });
  const rows = Object.values(agg);
  rows.forEach(r => { r.days = r.daySet.size; });
  const lwRank = {}, pwRank = {};
  rankBy([...rows].sort((a, b) => b.lw - a.lw || a.name.localeCompare(b.name)), "lw", lwRank);
  rankBy([...rows].sort((a, b) => b.pw - a.pw || a.name.localeCompare(b.name)), "pw", pwRank);

  const tie = (a, b) => a.name.localeCompare(b.name);
  const star = [...rows].filter(r => r.lw > 0).sort((a, b) => b.lw - a.lw || tie(a, b))[0] || null;
  const imp = [...rows].filter(r => (r.lw - r.pw) > 0 && (!star || r.id !== star.id))
    .sort((a, b) => (b.lw - b.pw) - (a.lw - a.pw) || tie(a, b))[0] || null;
  const fire = [...rows].filter(r => r.days > 0 && (!star || r.id !== star.id) && (!imp || r.id !== imp.id))
    .sort((a, b) => b.days - a.days || a.lastDaily - b.lastDaily || tie(a, b))[0] || null;

  const board = [...rows].filter(r => r.lw > 0)
    .sort((a, b) => lwRank[a.id] - lwRank[b.id]).map(r => ({ name: r.name, xp: r.lw, rank: lwRank[r.id] }));

  return {
    lwStart, agg, lwRank, pwRank, board,
    star: star ? { name: star.name, xp: star.lw } : null,
    mostImproved: imp ? { name: imp.name, delta: imp.lw - imp.pw } : null,
    onFire: fire ? { name: fire.name, days: fire.days } : null,
    perfectWeek: rows.filter(r => r.days >= 7).map(r => r.name).sort(),
  };
}

/* A small demo roster so the game is playable before the real
   class list is seeded into Supabase. Replaced at deploy time. */
const DEMO_ROSTER = [
  "Demo Learner", "Aanton M", "Bongani K", "Chloé V", "Dineo P",
  "Ethan R", "Fatima S", "Gugu N", "Hannah B", "Imran A",
];

/* ============================================================
   LOCAL BACKEND
   ============================================================ */
const LS = {
  students: "cgg.students",
  progress: "cgg.progress",
  events:   "cgg.events",
  meta:     "cgg.meta",
  items:    "cgg.itemevents",   // per-question results (teacher analytics)
  feedback: "cgg.feedback",     // anonymous end-of-game survey responses
};
function read(k, fallback) { try { return JSON.parse(localStorage.getItem(k)) ?? fallback; } catch { return fallback; } }
function write(k, v) { localStorage.setItem(k, JSON.stringify(v)); }

const LocalBackend = {
  _seed() {
    let students = read(LS.students, null);
    if (!students) {
      students = {};
      DEMO_ROSTER.forEach((name, i) => {
        const id = "s" + (i + 1);
        students[id] = { id, display_name: name, password: null, created_at: Date.now(), last_active_at: null };
      });
      write(LS.students, students);
    }
    if (!read(LS.meta, null)) write(LS.meta, { adminPassword: "admin", weeklyAnchor: 0 });
    if (!read(LS.progress, null)) write(LS.progress, {});
    if (!read(LS.events, null)) write(LS.events, []);
    if (!read(LS.items, null)) write(LS.items, []);
    if (!read(LS.feedback, null)) write(LS.feedback, []);
  },
  _find(name) {
    const students = read(LS.students, {});
    return Object.values(students).find(s => s.display_name === name) || null;
  },
  _verify(name, password) {
    const s = this._find(name);
    if (!s) return null;
    if (s.password == null) return null;          // never set
    if (s.password !== password) return null;
    return s;
  },
  _touch(id) {
    const students = read(LS.students, {});
    if (students[id]) { students[id].last_active_at = Date.now(); write(LS.students, students); }
  },

  async listStudents() {
    this._seed();
    const students = read(LS.students, {});
    return Object.values(students)
      .map(s => ({ id: s.id, display_name: s.display_name, has_password: s.password != null }))
      .sort((a, b) => a.display_name.localeCompare(b.display_name));
  },

  async login(name, password) {
    this._seed();
    const s = this._find(name);
    if (!s) return { ok: false, error: "no_such_user" };
    if (s.password == null) return { ok: false, firstLogin: true };
    if (s.password !== password) return { ok: false, error: "wrong_password" };
    this._touch(s.id);
    return { ok: true };
  },

  async firstLogin(name, password) {
    this._seed();
    const students = read(LS.students, {});
    const s = Object.values(students).find(x => x.display_name === name);
    if (!s) return { ok: false, error: "no_such_user" };
    if (s.password != null) return { ok: false, error: "already_set" };
    s.password = password;
    s.last_active_at = Date.now();
    write(LS.students, students);
    return { ok: true };
  },

  async getState(name, password) {
    const s = this._verify(name, password);
    if (!s) return { ok: false, error: "auth" };
    const progress = read(LS.progress, {})[s.id] || {};
    const events = read(LS.events, []).filter(e => e.studentId === s.id);
    const totalXp = events.reduce((a, e) => a + e.xp, 0);
    const badges = Object.entries(progress).filter(([, p]) => p.passed).map(([rid]) => rid);
    return {
      ok: true,
      student: { id: s.id, name: s.display_name },
      progress, totalXp, badges,
    };
  },

  async submitRound(name, password, roundId, payload) {
    const s = this._verify(name, password);
    if (!s) return { ok: false, error: "auth" };
    const { score, xpGained, total, correct } = payload; // score is 0..1 (first-try fraction)
    const allProgress = read(LS.progress, {});
    const p = allProgress[s.id] || {};
    const prev = p[roundId] || { best_score: 0, attempts: 0, total_xp: 0, passed: false };
    const wasPassed = prev.passed;
    const passed = score >= CONFIG.passThreshold;
    // anti-farming: a round already passed earns no more XP; clamp otherwise.
    const xpAward = wasPassed ? 0 : Math.max(0, Math.min(Math.round(xpGained) || 0, 500));
    p[roundId] = {
      best_score: Math.max(prev.best_score, score),
      attempts: prev.attempts + 1,
      total_xp: prev.total_xp + xpAward,
      passed: prev.passed || passed,
      last_played_at: Date.now(),
      last_correct: correct,
      last_total: total,
    };
    allProgress[s.id] = p;
    write(LS.progress, allProgress);

    if (xpAward > 0) {
      const events = read(LS.events, []);
      events.push({ studentId: s.id, roundId, xp: xpAward, score, ts: Date.now() });
      write(LS.events, events);
    }
    this._touch(s.id);

    return { ok: true, progress: p[roundId], passed, badgeEarned: passed && !wasPassed, xpAwarded: xpAward, alreadyPassed: wasPassed };
  },

  /* Daily Challenge XP — server grants a flat CONFIG.dailyXp, but only ONCE per
     local day (the client passes its own YYYY-MM-DD). The guard lives on the
     student record so wiping localStorage can't re-claim it. Mirrors the
     cgg_submit_daily RPC. */
  async submitDaily(name, password, payload) {
    const s = this._verify(name, password);
    if (!s) return { ok: false, error: "auth" };
    const day = String(payload && payload.day || "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return { ok: false, error: "bad_day" };
    const students = read(LS.students, {});
    const stu = students[s.id];
    const last = stu.last_daily_day || "";
    if (day <= last) {                                   // already claimed today (string compare is safe for ISO dates)
      this._touch(s.id);
      return { ok: true, xpAwarded: 0, alreadyClaimed: true, day };
    }
    const xpAward = Math.max(0, Math.round(CONFIG.dailyXp) || 0);
    stu.last_daily_day = day;
    stu.last_active_at = Date.now();
    write(LS.students, students);
    const events = read(LS.events, []);
    events.push({ studentId: s.id, roundId: "daily", xp: xpAward, score: payload && payload.total ? (payload.correct || 0) / payload.total : null, ts: Date.now() });

    // PERFECT WEEK — all 7 days of `day`'s Mon–Sun week done → one-off bonus.
    // Mirrors phase9.sql: distinct local days, granted at most once per week.
    let perfectWeek = false, bonusXp = 0;
    const d = new Date(day + "T12:00:00");                       // noon dodges DST edges
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));             // Monday of that week
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const x = new Date(d); x.setDate(x.getDate() + i); return localDate(x.getTime());
    });
    const inWeek = e => e.studentId === s.id && weekDays.includes(localDate(e.ts));
    const daysDone = new Set(events.filter(e => e.roundId === "daily" && inWeek(e)).map(e => localDate(e.ts))).size;
    if (daysDone >= 7 && !events.some(e => e.roundId === "perfectweek" && inWeek(e))) {
      bonusXp = Math.max(0, Math.round(CONFIG.perfectWeekXp) || 0);
      events.push({ studentId: s.id, roundId: "perfectweek", xp: bonusXp, score: null, ts: Date.now() });
      perfectWeek = true;
    }
    write(LS.events, events);
    return { ok: true, xpAwarded: xpAward, alreadyClaimed: false, day, perfectWeek, bonusXp };
  },

  /* Per-question results for the teacher's "hardest questions" report.
     Mirrors the cgg_log_items RPC. */
  async logItems(name, password, roundId, items) {
    const s = this._verify(name, password);
    if (!s) return { ok: false, error: "auth" };
    if (!Array.isArray(items) || !items.length) return { ok: true, logged: 0 };
    const store = read(LS.items, []);
    items.forEach(it => {
      if (!it || !it.qid) return;
      store.push({ studentId: s.id, roundId, qid: it.qid, correct: !!it.correct, firstTry: !!it.firstTry, chosen: it.chosen || null, ts: Date.now() });
    });
    write(LS.items, store);
    return { ok: true, logged: items.length };
  },

  /* Anonymous end-of-game feedback. The learner authenticates only so that
     (a) random visitors can't spam it and (b) they can edit their OWN answer
     later — the link from learner to row lives on the student record as
     lastFeedbackId and is NEVER returned to the admin. The feedback row itself
     stores no identity. Mirrors cgg_submit_feedback. */
  async submitFeedback(name, password, rating, comment) {
    const s = this._verify(name, password);
    if (!s) return { ok: false, error: "auth" };
    const r = Math.max(1, Math.min(5, Math.round(Number(rating) || 0)));
    if (r < 1) return { ok: false, error: "bad_rating" };
    const text = String(comment || "").slice(0, 1000).trim();
    const students = read(LS.students, {});
    const stu = students[s.id];
    const rows = read(LS.feedback, []);
    const existingId = stu.lastFeedbackId || null;
    const existing = existingId ? rows.find(x => x.id === existingId) : null;
    if (existing) {                                  // edit their own answer in place
      existing.rating = r; existing.comment = text; existing.updated_at = Date.now();
    } else {
      const id = "f" + (Math.max(0, ...rows.map(x => +String(x.id).slice(1) || 0)) + 1);
      rows.push({ id, rating: r, comment: text, created_at: Date.now(), updated_at: Date.now() });
      stu.lastFeedbackId = id;
      write(LS.students, students);
    }
    write(LS.feedback, rows);
    this._touch(s.id);
    return { ok: true };
  },

  /* A learner reading back their OWN answer (to pre-fill the edit form). */
  async getMyFeedback(name, password) {
    const s = this._verify(name, password);
    if (!s) return { ok: false, error: "auth" };
    const students = read(LS.students, {});
    const id = students[s.id] && students[s.id].lastFeedbackId;
    const row = id ? read(LS.feedback, []).find(x => x.id === id) : null;
    return row ? { ok: true, rating: row.rating, comment: row.comment } : { ok: true, rating: null, comment: "" };
  },

  /* The teacher's anonymous feedback report: the spread of faces + every
     written comment, with NO names attached. Mirrors cgg_admin_feedback. */
  async adminFeedback(adminPassword) {
    const meta = read(LS.meta, {});
    if (meta.adminPassword !== adminPassword) return { ok: false, error: "auth" };
    const rows = read(LS.feedback, []);
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    rows.forEach(r => { const v = Math.max(1, Math.min(5, r.rating || 0)); counts[v]++; sum += v; });
    const total = rows.length;
    const comments = rows.filter(r => r.comment && r.comment.trim())
      .map(r => ({ rating: r.rating, comment: r.comment, at: r.updated_at || r.created_at }))
      .sort((a, b) => b.at - a.at);
    const totalLearners = Object.keys(read(LS.students, {})).length;
    return { ok: true, counts, total, average: total ? sum / total : null, comments, totalLearners };
  },

  /* Push notifications: there is no notification server in local/offline mode,
     so these just acknowledge. The subscribe flow still works for UI testing. */
  async savePush(name, password, _endpoint, _subscription) {
    const s = this._verify(name, password);
    return s ? { ok: true } : { ok: false, error: "auth" };
  },
  async removePush(name, password, _endpoint) {
    const s = this._verify(name, password);
    return s ? { ok: true } : { ok: false, error: "auth" };
  },

  async adminItemStats(adminPassword) {
    const meta = read(LS.meta, {});
    if (meta.adminPassword !== adminPassword) return { ok: false, error: "auth" };
    const store = read(LS.items, []);
    const byQ = {};
    store.forEach(r => {
      if (!r.firstTry) return;                           // genuine first-pass attempts only (exclude replays)
      const k = r.qid;
      const g = byQ[k] || (byQ[k] = { roundId: r.roundId, qid: k, attempts: 0, correct: 0, wrong: {}, learners: new Set() });
      g.attempts++;
      if (r.studentId) g.learners.add(r.studentId);     // distinct learners who tried it
      if (r.correct) g.correct++;
      else if (r.chosen) g.wrong[r.chosen] = (g.wrong[r.chosen] || 0) + 1;
    });
    const rows = Object.values(byQ).map(g => {
      const top = Object.entries(g.wrong).sort((a, b) => b[1] - a[1])[0];
      return { roundId: g.roundId, qid: g.qid, attempts: g.attempts, learners: g.learners.size, correct: g.correct,
        correctPct: g.attempts ? Math.round((g.correct / g.attempts) * 100) : null,
        topWrong: top ? top[0] : null, topWrongCount: top ? top[1] : 0 };
    }).sort((a, b) => (a.correctPct ?? 101) - (b.correctPct ?? 101));
    return { ok: true, rows };
  },

  async leaderboard(name, password) {
    const s = this._verify(name, password);
    if (!s) return { ok: false, error: "auth" };
    const students = read(LS.students, {});
    const events = read(LS.events, []);
    const meta = read(LS.meta, { weeklyAnchor: 0 });
    const weekStart = Math.max(startOfWeek(), meta.weeklyAnchor || 0);

    const weeklyMap = {}, allMap = {};
    events.forEach(e => {
      allMap[e.studentId] = (allMap[e.studentId] || 0) + e.xp;
      if (e.ts >= weekStart) weeklyMap[e.studentId] = (weeklyMap[e.studentId] || 0) + e.xp;
    });
    const build = (map) => Object.values(students)
      .map(st => ({ id: st.id, name: st.display_name, xp: map[st.id] || 0 }))
      .sort((a, b) => b.xp - a.xp)
      .map((row, i) => ({ ...row, rank: i + 1, me: row.id === s.id }));

    const weekly = build(weeklyMap), allTime = build(allMap);
    return {
      ok: true,
      weekly, allTime,
      myWeekly: weekly.find(r => r.me),
      myAllTime: allTime.find(r => r.me),
    };
  },

  /* Star-of-the-Week results for the weekly crown popup. Mirrors the
     cgg_weekly_results RPC: last week's settled board + three distinct
     award winners (Star / Most Improved / On Fire) + the caller's finish,
     movement and best-prior-week. "Last week" = the previous Mon→Sun week. */
  async weeklyResults(name, password) {
    const s = this._verify(name, password);
    if (!s) return { ok: false, error: "auth" };
    const events = read(LS.events, []);
    const w = computeWeeklyAwards(read(LS.students, {}), events);

    const meAgg = w.agg[s.id];
    const weekSums = {};
    events.filter(e => e.studentId === s.id && e.ts < w.lwStart)
      .forEach(e => { const wk = startOfWeek(e.ts); weekSums[wk] = (weekSums[wk] || 0) + e.xp; });
    const bestPrevXp = Object.values(weekSums).reduce((m, v) => Math.max(m, v), 0);

    return {
      ok: true,
      weekStart: w.lwStart,
      board: w.board,
      star: w.star,
      mostImproved: w.mostImproved,
      onFire: w.onFire,
      perfectWeek: w.perfectWeek,
      me: { xp: meAgg.lw, rank: w.lwRank[s.id] },
      prevRank: meAgg.pw > 0 ? w.pwRank[s.id] : null,
      bestPrevXp,
    };
  },

  /* ---------- admin ---------- */
  async adminLogin(adminPassword) {
    this._seed();
    const meta = read(LS.meta, {});
    return { ok: meta.adminPassword === adminPassword };
  },
  async adminData(adminPassword) {
    const meta = read(LS.meta, {});
    if (meta.adminPassword !== adminPassword) return { ok: false, error: "auth" };
    const students = read(LS.students, {});
    const progress = read(LS.progress, {});
    const events = read(LS.events, []);
    const weekStart = Math.max(startOfWeek(), meta.weeklyAnchor || 0);
    const weeklyMap = {}, allMap = {};
    events.forEach(e => {
      allMap[e.studentId] = (allMap[e.studentId] || 0) + e.xp;
      if (e.ts >= weekStart) weeklyMap[e.studentId] = (weeklyMap[e.studentId] || 0) + e.xp;
    });
    const allRank = Object.values(students).map(s => ({ id: s.id, xp: allMap[s.id] || 0 }))
      .sort((a, b) => b.xp - a.xp).reduce((m, r, i) => (m[r.id] = i + 1, m), {});
    const rows = Object.values(students).map(s => ({
      id: s.id,
      name: s.display_name,
      hasPassword: s.password != null,        // privacy: never expose the actual password
      weeklyXp: weeklyMap[s.id] || 0,
      allTimeXp: allMap[s.id] || 0,
      rank: allRank[s.id],
      lastActive: s.last_active_at,
      rounds: progress[s.id] || {},
    })).sort((a, b) => b.allTimeXp - a.allTimeXp);
    return { ok: true, rows, inactiveDays: CONFIG.inactiveDays };
  },
  /* Admin view of the Star-of-the-Week results — the same numbers the
     learners' crown popup shows, minus the learner-personal fields.
     Mirrors the cgg_admin_weekly_results RPC (phase8.sql). */
  async adminWeeklyResults(adminPassword) {
    const meta = read(LS.meta, {});
    if (meta.adminPassword !== adminPassword) return { ok: false, error: "auth" };
    const w = computeWeeklyAwards(read(LS.students, {}), read(LS.events, []));
    return { ok: true, weekStart: w.lwStart, board: w.board, star: w.star, mostImproved: w.mostImproved, onFire: w.onFire, perfectWeek: w.perfectWeek };
  },
  async adminResetWeekly(adminPassword) {
    const meta = read(LS.meta, {});
    if (meta.adminPassword !== adminPassword) return { ok: false, error: "auth" };
    meta.weeklyAnchor = Date.now();
    write(LS.meta, meta);
    return { ok: true };
  },
  async adminAddStudent(adminPassword, name) {
    const meta = read(LS.meta, {});
    if (meta.adminPassword !== adminPassword) return { ok: false, error: "auth" };
    const students = read(LS.students, {});
    const id = "s" + (Math.max(0, ...Object.keys(students).map(k => +k.slice(1))) + 1);
    students[id] = { id, display_name: name, password: null, created_at: Date.now(), last_active_at: null };
    write(LS.students, students);
    return { ok: true };
  },
  async adminRemoveStudent(adminPassword, id) {
    const meta = read(LS.meta, {});
    if (meta.adminPassword !== adminPassword) return { ok: false, error: "auth" };
    const students = read(LS.students, {});
    delete students[id];
    write(LS.students, students);
    return { ok: true };
  },
  async adminResetPassword(adminPassword, id) {
    const meta = read(LS.meta, {});
    if (meta.adminPassword !== adminPassword) return { ok: false, error: "auth" };
    const students = read(LS.students, {});
    if (students[id]) { students[id].password = null; write(LS.students, students); }
    return { ok: true };
  },
};

/* ============================================================
   PREVIEW BACKEND  (teacher "view as learner" sandbox)
   ------------------------------------------------------------
   Opened from the admin dashboard via ?preview=1. Every round is
   unlocked so the teacher can inspect any round or new content, but
   NOTHING is persisted and NOTHING touches the real backend: writes
   are no-ops, the leaderboard is empty, and there is no XP — so the
   teacher never appears on the live board (the ghost-account problem).
   ============================================================ */
function isPreview() {
  try { return new URLSearchParams(location.search).has("preview"); } catch { return false; }
}
const PREVIEW_STUDENT = { id: "preview", name: "Teacher Preview" };
const PreviewBackend = {
  async listStudents() { return [{ id: "preview", display_name: PREVIEW_STUDENT.name, has_password: true }]; },
  async login() { return { ok: true }; },
  async firstLogin() { return { ok: true }; },
  async getState() {
    // mark every round passed → unlockedSet() opens them all on the home map
    const { ROUNDS } = await import("./rounds/index.js");
    const progress = {};
    ROUNDS.forEach(r => {
      progress[r.id] = { best_score: 1, attempts: 1, total_xp: 0, passed: true, last_played_at: null, last_correct: null, last_total: null };
    });
    return { ok: true, student: { ...PREVIEW_STUDENT }, progress, totalXp: 0, badges: ROUNDS.map(r => r.id) };
  },
  // every write is a no-op that reports success, so the game plays normally
  async submitRound() { return { ok: true, passed: true, badgeEarned: false, xpAwarded: 0, alreadyPassed: true }; },
  async submitDaily() { return { ok: true, xpAwarded: 0, alreadyClaimed: true }; },
  async logItems() { return { ok: true, logged: 0 }; },
  async submitFeedback() { return { ok: true }; },
  async getMyFeedback() { return { ok: true, rating: null, comment: "" }; },
  async savePush() { return { ok: true }; },
  async removePush() { return { ok: true }; },
  // read views: empty / benign so nothing from the real class shows or is altered
  async leaderboard() { return { ok: true, weekly: [], allTime: [], myWeekly: null, myAllTime: null }; },
  async weeklyResults() { return { ok: true, board: [], star: null, mostImproved: null, onFire: null, me: { xp: 0, rank: null }, prevRank: null, bestPrevXp: 0 }; },
};

/* ============================================================
   BACKEND SELECTION
   If js/supabase-config.js has a url + anon key, use the shared
   Supabase backend; otherwise fall back to local play. Either way
   the rest of the app calls the exact same methods.

   Append ?local=1 to the URL (or set localStorage cgg.forceLocal=1)
   to force the offline demo backend — handy for offline play and for
   testing changes without touching the live class data.
   ============================================================ */
function forceLocal() {
  try {
    if (new URLSearchParams(location.search).has("local")) { localStorage.setItem("cgg.forceLocal", "1"); return true; }
    return localStorage.getItem("cgg.forceLocal") === "1";
  } catch { return false; }
}
const useLocal = !hasSupabase || forceLocal();
export const PREVIEW = isPreview();
export const api = PREVIEW ? PreviewBackend : (useLocal ? LocalBackend : SupabaseBackend);
export const BACKEND = PREVIEW ? "preview" : (useLocal ? "local" : "supabase");
