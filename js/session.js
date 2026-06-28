/* ============================================================
   SESSION — holds the logged-in learner's credentials.
   The password is kept so every RPC call can be re-verified
   server-side (the real Supabase backend checks it every time;
   the local backend mirrors that). Threat model is a class game
   score on the learner's own device, so this tradeoff is fine.
   ============================================================ */
const KEY = "cgg.session";
let current = null;
try { current = JSON.parse(localStorage.getItem(KEY) || "null"); } catch { current = null; }

export function getSession() { return current; }
export function isLoggedIn() { return !!(current && current.name && current.password); }

export function setSession(name, password, persist = true) {
  current = { name, password };
  // Teacher preview uses persist=false: an in-memory session only, so opening
  // the preview never overwrites a real learner's stored login in this browser.
  if (persist) localStorage.setItem(KEY, JSON.stringify(current));
}
export function clearSession() {
  current = null;
  localStorage.removeItem(KEY);
}
