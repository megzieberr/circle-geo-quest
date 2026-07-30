/* ============================================================
   THE CONTEXT CHECKER — client wrapper.

   Calls the check-answer edge function, which compares a typed
   answer to a server-side memo. The memo NEVER ships in js/ —
   that is the whole reason this is a network call and not a
   local string compare.

   This module NEVER THROWS. Every failure — offline, timeout,
   misconfigured URL, rate cap, a 500 — resolves to null, and
   callers treat null as "checker unavailable" and fall back to
   the panel's static hint ladder. A learner must never be able
   to get stuck behind a checker that is having a bad day.

   No retries: a second call doubles the cost for a learner who
   is already waiting, and the static hints are right there.
   ============================================================ */

import { SUPABASE } from "./supabase-config.js";
import { getSession } from "./session.js";

const TIMEOUT_MS = 8000;

function functionUrl(name) {
  if (!SUPABASE?.url) return null;
  return `${SUPABASE.url.replace(/\/+$/, "")}/functions/v1/${name}`;
}

/**
 * @param {{panelId: string, answer: string, lang: string, override?: boolean}} opts
 * @returns {Promise<{verdict: string, missing: string[], nudge: string, misconception: string} | null>}
 *   null means "checker unavailable" — use the static hints.
 */
export async function checkAnswer({ panelId, answer, lang, override = false }) {
  const url = functionUrl("check-answer");
  if (!url) return null;                       // playing locally, no backend

  const s = getSession();
  if (!s?.name || !s?.password) return null;   // not logged in (offline play)

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // the publishable key is what the functions gateway expects
        Authorization: `Bearer ${SUPABASE.anonKey}`,
        apikey: SUPABASE.anonKey,
      },
      body: JSON.stringify({
        name: s.name,
        password: s.password,
        panelId,
        answer: String(answer ?? "").slice(0, 600),
        lang: lang === "af" ? "af" : "en",
        override,
      }),
      signal: ctrl.signal,
    });

    if (!res.ok) return null;                  // 401 / 500 → static hints
    const data = await res.json();
    // { ok:false, error:"rate"|"api"|"nomemo"|"nokey" } is a normal, expected
    // response — it means "no verdict this time", not "something exploded".
    if (!data || data.ok !== true) return null;

    return {
      verdict: data.verdict,
      missing: Array.isArray(data.missing) ? data.missing : [],
      nudge: typeof data.nudge === "string" ? data.nudge : "",
      misconception: typeof data.misconception === "string" ? data.misconception : "",
    };
  } catch {
    return null;                               // abort, offline, bad JSON
  } finally {
    clearTimeout(timer);
  }
}

/** Learner tapped "I think my answer was right". Logs it for Megan to review
 *  and always advances, even if the network call fails. */
export async function acceptOverride({ panelId, answer, lang }) {
  await checkAnswer({ panelId, answer, lang, override: true });
}
