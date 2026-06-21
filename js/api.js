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
      password: s.password,
      weeklyXp: weeklyMap[s.id] || 0,
      allTimeXp: allMap[s.id] || 0,
      rank: allRank[s.id],
      lastActive: s.last_active_at,
      rounds: progress[s.id] || {},
    })).sort((a, b) => b.allTimeXp - a.allTimeXp);
    return { ok: true, rows, inactiveDays: CONFIG.inactiveDays };
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
export const api = useLocal ? LocalBackend : SupabaseBackend;
export const BACKEND = useLocal ? "local" : "supabase";
