/* ============================================================
   RELIABLE ROUND SUBMIT  (retry + offline queue)
   ------------------------------------------------------------
   The graded-round flow used to fire api.submitRound ONCE and
   swallow any failure (an offline blip on a phone / installed
   PWA). When that single call dropped, the server never recorded
   the pass — yet the learner was still shown "passed" and offered
   a straight "next round" button, so the unsaved round got
   skipped. In the admin grid that shows up as a green–grey–green
   gap (a passed round sitting between two passed rounds with no
   row of its own).

   This wrapper:
     • retries the submit a few times before giving up, and
     • if it still fails, stores the submit in localStorage so
       flushPendingSubmits() can replay it on the next load, the
       next state refresh, or when the device comes back online.

   A submit is only ever reported `ok` when the SERVER confirms it,
   so the caller can refuse to advance past an unsaved round.

   A queued entry deliberately stores NO password. The credentials come
   from the live session at flush time, and an entry is only ever replayed
   under the name that queued it. That way a queue left behind on a shared
   computer holds nothing worth reading, and one learner's queue can never
   flush under another learner's login.
   ============================================================ */
import { api } from "./api.js";
import { getSession } from "./session.js";

const QKEY = "cgg.pendingSubmits";
const MAX_QUEUE = 50;

function readQ() { try { return JSON.parse(localStorage.getItem(QKEY)) || []; } catch { return []; } }
function writeQ(q) { try { localStorage.setItem(QKEY, JSON.stringify(q.slice(-MAX_QUEUE))); } catch { /* storage unavailable */ } }

/* Queues written before 2026-08-07 stored a password with each entry. Strip it
   the first time this module loads so an old device cleans itself the next time
   the app opens, rather than waiting for the queue to drain. */
(function dropLegacyPasswords() {
  const q = readQ();
  if (q.some(e => "password" in e)) {
    writeQ(q.map(({ password, ...rest }) => rest));   // eslint-disable-line no-unused-vars
  }
})();

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* one pending entry per (name, round) — the latest result wins, so a
   replay can't pile up duplicate queued rows for the same round. */
function enqueue(name, roundId, payload) {
  const q = readQ().filter(e => !(e.name === name && e.roundId === roundId));
  q.push({ name, roundId, payload, at: Date.now() });
  writeQ(q);
}

export function hasPendingSubmits() { return readQ().length > 0; }

/* Submit a round, retrying on failure; queue it if the server can't be
   reached. Returns the server result on success, or {ok:false, queued:true}
   when it had to be stored for later. */
export async function submitRoundReliable(name, password, roundId, payload, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await api.submitRound(name, password, roundId, payload);
      if (res && res.ok) return res;
    } catch { /* network blip — fall through to retry */ }
    if (i < attempts - 1) await sleep(400 * (i + 1));
  }
  enqueue(name, roundId, payload);
  return { ok: false, queued: true };
}

/* Replay the queued submits belonging to the signed-in learner. Successes are
   removed; failures stay for the next attempt, as do entries queued under a
   different name (only that learner's own login can replay them). Safe to call
   repeatedly (a no-op when the queue is empty or nobody is signed in).

   `cred` lets logout pass the departing learner's credentials in, since the
   session has already been cleared by then. */
export async function flushPendingSubmits(cred) {
  const who = cred || getSession();
  if (!who || !who.name || !who.password) return false;
  const q = readQ();
  if (!q.length) return false;
  const remaining = [];
  let synced = false;
  for (const e of q) {
    if (e.name !== who.name) { remaining.push(e); continue; }
    try {
      const res = await api.submitRound(who.name, who.password, e.roundId, e.payload);
      if (res && res.ok) synced = true; else remaining.push(e);
    } catch { remaining.push(e); }
  }
  writeQ(remaining);
  return synced;                 // true if at least one queued pass reached the server
}
