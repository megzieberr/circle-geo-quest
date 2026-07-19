/* ============================================================
   PI — the Circle Quest mascot. Pure amusement, zero gameplay.
   ------------------------------------------------------------
   Megan's own sprite sheets (pi-mascot/*.png, sliced by
   pi-mascot/slice_pi.py into assets/pi/*.png strips + meta.json).
   Classic frame-swap animation, Clawd-style: a strip per
   animation, background-position stepped at 8-10 fps.

   Two mounts:
     • initPiMascot(host) — the home-screen resident. Idles in the
       open corner of .home-head (host), does a random trick every
       ~18-40s, does one on tap. The hanging trick happens in place —
       the sprite brings its own pull-up bar, which IS the joke.
     • piCameo(host)      — results-screen cameo: one thumbs-up
       loop when a round is passed, then holds idle.

   Deliberate choices:
     - setInterval, NOT requestAnimationFrame: rAF never fires in
       the in-app preview pane (see browser-pane memory), and at
       ~9 fps a timer is indistinguishable anyway.
     - prefers-reduced-motion hides the mascot entirely (CSS) and
       this module also refuses to animate — same signal sound.js
       respects.
     - meta.json is fetched (not hardcoded) so re-running the
       slicer never desyncs frame sizes; strips are pre-warmed into
       the image cache on first init.
   ============================================================ */
import { el } from "./ui.js";

const BASE = "assets/pi/";
// fps tuned DOWN from the sheet-suggested 8-12 on Megan's review
// (2026-07-19): "over before I can even see what happened".
const ANIMS = {
  wave:   { fps: 6, loops: 1 },
  thumbs: { fps: 6, loops: 1 },
  hang:   { fps: 6, loops: 2 },    // two full pendulum swings
  bounce: { fps: 7, loops: 1 },
};
const IDLE_ANIM = "wave";          // frame 0 of wave = arms down, standing
const TRICKS = ["wave", "bounce", "hang", "thumbs"];
const HOME_H = 72;                 // on-screen height, px (home) — kept smol
const CAMEO_H = 56;                //  … results cameo             (Clawd rule)
const TRICK_MIN = 18000, TRICK_MAX = 40000;

let meta = null, metaPromise = null;
function loadMeta() {
  if (!metaPromise) {
    metaPromise = fetch(BASE + "meta.json")
      .then(r => (r.ok ? r.json() : null))
      .then(m => {
        meta = m;
        if (m) Object.keys(m).forEach(n => { const i = new Image(); i.src = `${BASE}${n}.png`; });
        return m;
      })
      .catch(() => null);          // no mascot is never an error
  }
  return metaPromise;
}

function reducedMotion() {
  try { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
  catch { return false; }
}

/* One mounted Pi. Owns its element + a single interval at a time. */
function makePi(heightPx) {
  const root = el("button", "pi-mascot");
  root.type = "button";
  root.setAttribute("aria-label", "Pi");   // decorative, but it IS a button
  let timer = null;

  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  function setFrame(name, idx) {
    const m = meta[name];
    const s = heightPx / m.h;
    const w = Math.round(m.w * s);
    root.style.width = w + "px";
    root.style.height = heightPx + "px";
    root.style.backgroundImage = `url(${BASE}${name}.png)`;
    root.style.backgroundSize = `${Math.round(m.w * m.frames * s)}px ${heightPx}px`;
    root.style.backgroundPosition = `-${idx * w}px 0`;
  }

  function idle() { stop(); setFrame(IDLE_ANIM, 0); }

  function play(name, onDone) {
    if (!meta || !meta[name]) return;
    if (reducedMotion()) { idle(); if (onDone) onDone(); return; }
    stop();
    const a = ANIMS[name], n = meta[name].frames;
    let i = 0, loop = 0;
    setFrame(name, 0);
    timer = setInterval(() => {
      if (!root.isConnected) { stop(); return; }
      i++;
      if (i >= n) {
        i = 0; loop++;
        if (loop >= a.loops) { idle(); if (onDone) onDone(); return; }
      }
      setFrame(name, i);
    }, 1000 / a.fps);
  }

  return { root, idle, play, stop };
}

/* Home-screen resident: idle + random tricks + tap-to-trick. */
export function initPiMascot(host) {
  if (reducedMotion()) return;                 // their signal — no mascot motion
  loadMeta().then(m => {
    if (!m || !host.isConnected) return;
    host.querySelectorAll(".pi-mascot").forEach(n => n.remove());   // never stack
    const pi = makePi(HOME_H);
    pi.root.classList.add("pi-home");
    host.appendChild(pi.root);
    pi.idle();

    let busy = false;
    const trick = (name) => {
      if (busy || !pi.root.isConnected) return;
      busy = true;
      pi.play(name || TRICKS[Math.floor(Math.random() * TRICKS.length)],
              () => { busy = false; });
    };
    pi.root.addEventListener("click", () => trick());

    (function schedule() {
      const wait = TRICK_MIN + Math.random() * (TRICK_MAX - TRICK_MIN);
      setTimeout(() => {
        if (!pi.root.isConnected) return;      // navigated away — let the chain die
        trick();
        schedule();
      }, wait);
    })();
  });
}

/* Results cameo: one thumbs-up on a passed round, then holds idle. */
export function piCameo(host) {
  if (reducedMotion()) return;
  loadMeta().then(m => {
    if (!m || !host.isConnected) return;
    const pi = makePi(CAMEO_H);
    pi.root.classList.add("pi-cameo");
    pi.root.tabIndex = -1;
    host.appendChild(pi.root);
    pi.play("thumbs");
    pi.root.addEventListener("click", () => pi.play("thumbs"));
  });
}
