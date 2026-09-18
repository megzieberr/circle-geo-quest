/* ============================================================
   SUPABASE BACKEND
   Same method signatures as the LocalBackend in api.js, so the rest
   of the app never changes. Every call POSTs to a SECURITY DEFINER
   RPC function that verifies the password server-side; the anon key
   can do nothing else (tables are RLS-locked).
   ============================================================ */
import { SUPABASE } from "./supabase-config.js";

export const hasSupabase = !!(SUPABASE.url && SUPABASE.anonKey);

async function rpc(fn, args) {
  const res = await fetch(`${SUPABASE.url}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE.anonKey,
      Authorization: `Bearer ${SUPABASE.anonKey}`,
    },
    body: JSON.stringify(args || {}),
  });
  if (!res.ok) throw new Error(`rpc ${fn} failed: ${res.status}`);
  return res.json();
}

export const SupabaseBackend = {
  // The name picker, for ONE class (phase21). The ?class= link decides
  // which — see currentCohort() in js/auth.js. Every board after login is
  // filtered by the learner's own cohort on the server, not by this.
  async listStudents(cohort) {
    const rows = await rpc("cgg_list_students", { p_cohort: cohort || "gr11" });
    return rows.map(s => ({ id: s.id, display_name: s.display_name, has_password: s.has_password }));
  },
  login(name, password) { return rpc("cgg_login", { p_name: name, p_password: password }); },
  firstLogin(name, password) { return rpc("cgg_first_login", { p_name: name, p_password: password }); },
  getState(name, password) { return rpc("cgg_get_state", { p_name: name, p_password: password }); },
  submitRound(name, password, roundId, p) {
    return rpc("cgg_submit_round", { p_name: name, p_password: password, p_round: roundId, p_score: p.score, p_xp: p.xpGained, p_total: p.total, p_correct: p.correct });
  },
  submitDaily(name, password, p) {
    return rpc("cgg_submit_daily", { p_name: name, p_password: password, p_day: p.day, p_correct: p.correct, p_total: p.total });
  },
  // streak milestones (phase11.sql) — server validates p_days against the
  // fixed 3/7/14/30 list and grants its hardcoded XP at most once ever.
  awardStreakMilestone(name, password, days) {
    return rpc("cgg_award_streak_milestone", { p_name: name, p_password: password, p_days: days });
  },
  // day-streak, computed server-side from xp_events (phase19.sql) so the
  // same number shows on every device. Read-only on the server.
  getStreak(name, password) {
    return rpc("cgg_get_streak", { p_name: name, p_password: password });
  },
  logItems(name, password, roundId, items) {
    return rpc("cgg_log_items", { p_name: name, p_password: password, p_round: roundId, p_items: items });
  },
  leaderboard(name, password) { return rpc("cgg_leaderboard", { p_name: name, p_password: password }); },
  weeklyResults(name, password) { return rpc("cgg_weekly_results", { p_name: name, p_password: password }); },

  // nicknames + avatars (phase12.sql) — trims/caps/validates server-side;
  // see cgg_set_profile for the exact rules (freeform nickname, no filter).
  setProfile(name, password, nickname, avatarId) {
    return rpc("cgg_set_profile", { p_name: name, p_password: password, p_nickname: nickname, p_avatar: avatarId });
  },

  // anonymous end-of-game feedback survey
  submitFeedback(name, password, rating, comment) {
    return rpc("cgg_submit_feedback", { p_name: name, p_password: password, p_rating: rating, p_comment: comment });
  },
  getMyFeedback(name, password) { return rpc("cgg_get_feedback", { p_name: name, p_password: password }); },

  // push notifications (daily reminders)
  savePush(name, password, endpoint, subscription) {
    return rpc("cgg_save_push", { p_name: name, p_password: password, p_endpoint: endpoint, p_subscription: subscription });
  },
  removePush(name, password, endpoint) {
    return rpc("cgg_remove_push", { p_name: name, p_password: password, p_endpoint: endpoint });
  },

  // admin
  adminLogin(pw) { return rpc("cgg_admin_login", { p_admin_password: pw }); },
  adminData(pw) { return rpc("cgg_admin_data", { p_admin_password: pw }); },
  adminFeedback(pw) { return rpc("cgg_admin_feedback", { p_admin_password: pw }); },
  // cheat-detection readout (phase13.sql) — per learner, every passed round
  // with how many per-question events were logged (qcount) + when last played.
  adminIntegrity(pw) { return rpc("cgg_admin_integrity", { p_admin_password: pw }); },
  // per-ATTEMPT history (phase15.sql). Pass a student id for one learner's full
  // timeline, or null for the whole class's recent attempts. This is what makes
  // a climb (40→60→65→100) distinguishable from a plateau (65→65→65) — the
  // summary in cgg_admin_data keeps only the best score and loses the shape.
  adminTimeline(pw, id, limit) {
    return rpc("cgg_admin_timeline", { p_admin_password: pw, p_student_id: id || null, p_limit: limit || 400 });
  },
  // "I don't get it" taps (phase17.sql). Read-only over checker_calls: the
  // stuck rows rolled up per panel and per learner, with what each learner had
  // typed at the moment they tapped, plus the MARKING verdicts for the same
  // panels — which is what separates a hard question from a badly worded one.
  adminStuck(pw, days, limit) {
    return rpc("cgg_admin_stuck", { p_admin_password: pw, p_days: days || 30, p_limit: limit || 500 });
  },
  // phase21: the weekly reset, the champion and a new learner all act on ONE
  // class — the one toggled in the dashboard. Gr11 keeps the original
  // app_config keys, so an omitted cohort behaves exactly as it did before.
  adminResetWeekly(pw, cohort) { return rpc("cgg_admin_reset_weekly", { p_admin_password: pw, p_cohort: cohort || "gr11" }); },
  adminAddStudent(pw, name, cohort) { return rpc("cgg_admin_add_student", { p_admin_password: pw, p_name: name, p_cohort: cohort || "gr11" }); },
  adminRemoveStudent(pw, id) { return rpc("cgg_admin_remove_student", { p_admin_password: pw, p_id: id }); },
  adminResetPassword(pw, id) { return rpc("cgg_admin_reset_password", { p_admin_password: pw, p_id: id }); },
  adminWeeklyResults(pw, cohort) { return rpc("cgg_admin_weekly_results", { p_admin_password: pw, p_cohort: cohort || "gr11" }); },
  adminSetChampion(pw, name, cohort) { return rpc("cgg_admin_set_champion", { p_admin_password: pw, p_name: name, p_cohort: cohort || "gr11" }); },
  // move one learner between classes (the "→ Gr12" / "→ Gr11" row button).
  // Progress, XP and password stay with them; only their board changes.
  adminSetCohort(pw, id, cohort) { return rpc("cgg_admin_set_cohort", { p_admin_password: pw, p_student_id: id, p_cohort: cohort }); },
  // nickname moderation (phase12.sql) — nulls (never edits) a learner's
  // nickname; the server logs the old value to the events table first.
  adminResetNickname(pw, id) { return rpc("cgg_admin_reset_nickname", { p_admin_password: pw, p_student_id: id }); },
};
