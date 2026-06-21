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
  async listStudents() {
    const rows = await rpc("cgg_list_students", {});
    return rows.map(s => ({ id: s.id, display_name: s.display_name, has_password: s.has_password }));
  },
  login(name, password) { return rpc("cgg_login", { p_name: name, p_password: password }); },
  firstLogin(name, password) { return rpc("cgg_first_login", { p_name: name, p_password: password }); },
  getState(name, password) { return rpc("cgg_get_state", { p_name: name, p_password: password }); },
  submitRound(name, password, roundId, p) {
    return rpc("cgg_submit_round", { p_name: name, p_password: password, p_round: roundId, p_score: p.score, p_xp: p.xpGained, p_total: p.total, p_correct: p.correct });
  },
  leaderboard(name, password) { return rpc("cgg_leaderboard", { p_name: name, p_password: password }); },

  // admin
  adminLogin(pw) { return rpc("cgg_admin_login", { p_admin_password: pw }); },
  adminData(pw) { return rpc("cgg_admin_data", { p_admin_password: pw }); },
  adminResetWeekly(pw) { return rpc("cgg_admin_reset_weekly", { p_admin_password: pw }); },
  adminAddStudent(pw, name) { return rpc("cgg_admin_add_student", { p_admin_password: pw, p_name: name }); },
  adminRemoveStudent(pw, id) { return rpc("cgg_admin_remove_student", { p_admin_password: pw, p_id: id }); },
  adminResetPassword(pw, id) { return rpc("cgg_admin_reset_password", { p_admin_password: pw, p_id: id }); },
};
