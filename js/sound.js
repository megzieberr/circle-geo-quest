/* ============================================================
   SOUND — tiny self-contained Web Audio sound engine.
   ------------------------------------------------------------
   Duolingo-style feedback pings, but never Duolingo's actual
   sounds — everything here is synthesized live with OscillatorNode
   + GainNode envelopes. No audio files, no base64 blobs, so the
   PWA stays fully offline and self-contained (same spirit as
   celebrate.js: no server round-trip, no other app imports).

   Mute is a per-device localStorage setting (MUTE_KEY below).
   Default is ON, except a device with prefers-reduced-motion set
   defaults to OFF — that's this person's own signal they want a
   calmer, quieter UI, so we respect it up front instead of
   surprising them with sound.

   Browsers block audio before a user gesture, so the AudioContext
   is created lazily on first play() (which only ever happens from
   inside a click-driven callback) and this file never throws even
   if Web Audio isn't available at all.
   ============================================================ */

const MUTE_KEY = "cgg.muted";

function osReducedMotion() {
  try { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
  catch { return false; }
}

function readMuted() {
  const stored = localStorage.getItem(MUTE_KEY);
  if (stored === "1") return true;
  if (stored === "0") return false;
  return osReducedMotion();   // never set yet — fall back to the OS hint
}

let muted = readMuted();
let ctx = null;

/* Lazily create (or resume) the shared AudioContext. Guarded so a
   browser without Web Audio, or one that refuses to create one
   before a user gesture, never throws up the call chain. */
function getCtx() {
  if (ctx) {
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    return ctx;
  }
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    return ctx;
  } catch { return null; }
}

/* One oscillator + a short attack/decay gain envelope, scheduled
   `at` seconds from now so a run of notes (celebrate's arpeggio)
   can be laid out in one call without setTimeout drift. */
function note(c, { freq, dur = 0.14, type = "sine", peak = 0.18, at = 0 }) {
  const t0 = c.currentTime + at;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(peak, t0 + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function play(build) {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  try { build(c); } catch { /* a sound glitch should never crash the app */ }
}

export const sfx = {
  /* "Coin sparkle" — two quick quiet square-wave notes a fourth
     apart, video-game-coin style. Megan's pick from the sound lab
     (option D, 2026-07-19), replacing the original two-note
     triangle ping she found unsatisfying. */
  correct() {
    play(c => {
      note(c, { freq: 987.77,  dur: 0.07, type: "square", peak: 0.06 });                   // B5
      note(c, { freq: 1318.50, dur: 0.18, type: "square", peak: 0.07, at: 0.06 });         // E6
    });
  },

  /* Two soft steps down (E4→C4) — deliberately gentle, not a buzzer.
     Kids who already struggle in tests use this app; a harsh "wrong"
     sound would punish exactly the learners it should encourage.
     Megan's pick from the sound lab (option B, 2026-07-19). */
  wrong() {
    play(c => {
      note(c, { freq: 329.63, dur: 0.10, type: "sine", peak: 0.10 });                      // E4
      note(c, { freq: 261.63, dur: 0.14, type: "sine", peak: 0.09, at: 0.09 });            // C4
    });
  },

  /* Short cheerful sparkle arpeggio for the badge / streak-milestone
     "big moment" modal (celebrate.js showCelebration). */
  celebrate() {
    play(c => {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C6 E6 G6 C7
      notes.forEach((freq, i) => note(c, { freq, dur: 0.18, type: "triangle", peak: 0.15, at: i * 0.07 }));
    });
  },

  /* Very subtle click for "Next" / page advance — quiet on purpose
     so it never becomes background noise. */
  tick() {
    play(c => {
      note(c, { freq: 1200, dur: 0.035, type: "square", peak: 0.03 });
    });
  },

  setMuted(v) {
    muted = !!v;
    localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
  },
  isMuted() { return muted; },
};
