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
   ============================================================ */
import { api } from "./api.js";

const QKEY = "cgg.pendingSubmits";
const MAX_QUEUE = 50;

function readQ() { try { return JSON.parse(localStorage.getItem(QKEY)) || []; } catch { return []; } }
function writeQ(q) { try { localStorage.setItem(QKEY, JSON.stringify(q.slice(-MAX_QUEUE))); } catch { /* storage unavailable */ } }

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* one pending entry per (name, round) — the latest result wins, so a
   replay can't pile up duplicate queued rows for the same round. */
function enqueue(name, password, roundId, payload) {
  const q = readQ().filter(e => !(e.name === name && e.roundId === roundId));
  q.push({ name, password, roundId, payload, at: Date.now() });
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
  enqueue(name, password, roundId, payload);
  return { ok: false, queued: true };
}

/* Replay every queued submit. Successes are removed; failures stay for the
   next attempt. Safe to call repeatedly (a no-op when the queue is empty). */
export async function flushPendingSubmits() {
  const q = readQ();
  if (!q.length) return false;
  const remaining = [];
  let synced = false;
  for (const e of q) {
    try {
      const res = await api.submitRound(e.name, e.password, e.roundId, e.payload);
      if (res && res.ok) synced = true; else remaining.push(e);
    } catch { remaining.push(e); }
  }
  writeQ(remaining);
  return synced;                 // true if at least one queued pass reached the server
}
