/* ============================================================
   THE INVESTIGATION STATION LINE  🚂
   ------------------------------------------------------------
   Two pieces, both added by Megan's ruling of 2026-07-30:

     trainStrip(app)          the full-width tappable strip that sits
                              on the home screen directly above the
                              badge panel — the ONLY door into the
                              stations, which is why they no longer
                              appear on the main round map.
     renderStations(app,host) the six-stop line itself.

   THE ART IS HERS AND IS NEVER EDITED. assets/investigation-station-
   train.png is a 2000x2000 PNG whose drawing occupies y=277..1343 —
   i.e. 13.85% transparent padding on top and 32.85% on the bottom.
   Both are cropped in CSS (.train-art img, negative % margins on a
   clipping box: a percentage margin resolves against the WIDTH, and
   the image is exactly as wide as the box, so the two numbers above
   land the crop on the pixel). Never re-export the file to trim it.

   The strip and the map share that one crop, so tapping the strip
   lands on a screen showing the same locomotive at the same size —
   the painted track really does run on into the station map.
   ============================================================ */
import { STATIONS, unlockedIds, FINAL_QUEST_ROUND_ID } from "./rounds/index.js";
import { CONFIG, GROUPS } from "./config.js";
import { tx } from "./i18n.js";
import { el, clear } from "./ui.js";

const TRAIN_ART = "assets/investigation-station-train.png";
const STATION_GROUP = GROUPS.find(g => g.id === "g6");

/* Local copy: nothing outside this file looks these up. */
const UI = {
  title:     { en: "Investigation Station",  af: "Ondersoekstasie" },
  visited:   { en: "{n} of {total} stations visited", af: "{n} van {total} stasies besoek" },
  strapline: { en: "Think like a mathematician — six stops down the branch line.",
               af: "Dink soos 'n wiskundige — ses haltes met die taklyn af." },
  blurb:     { en: "Six stops that drill the investigation itself: notice a pattern, say it precisely, try to break it, prove it, turn it around, and explain it to someone else.",
               af: "Ses haltes wat die ondersoek self inoefen: merk 'n patroon op, stel dit presies, probeer dit breek, bewys dit, draai dit om, en verduidelik dit vir iemand anders." },
  // Says the RATE, never a station total — the totals differ per station and
  // change again every time Chunk D adds a panel. Each stop card carries its own
  // total, computed from its panels, so the two can never disagree.
  xpNote:    { en: "Every step you finish pays {xp} XP — however many tries it takes.",
               af: "Elke stap wat jy klaarmaak betaal {xp} XP — maak nie saak hoeveel probeerslae nie." },
  stopXp:    { en: "{xp} XP",                af: "{xp} XP" },
  stop:      { en: "Stop",                   af: "Halte" },
  visit:     { en: "Visit",                  af: "Besoek" },
  revisit:   { en: "Visit again",            af: "Besoek weer" },
  cleared:   { en: "Station cleared",        af: "Stasie voltooi" },
  lockedFirst: { en: "Finish the 43 rounds on the main line first.",
                 af: "Voltooi eers die 43 rondtes op die hooflyn." },
  lockedPrev:  { en: "Finish the stop before this one first.",
                 af: "Voltooi eers die halte voor hierdie een." },
  lockedStrip: { en: "Opens when the main line is done",
                 af: "Maak oop wanneer die hooflyn klaar is" },
  allDone:   { en: "The whole line is done.", af: "Die hele lyn is klaar." },
  branch:    { en: "The branch line",        af: "Die taklyn" },
  // NOT t("backHome") — that string is "Back to map", which on this screen would
  // read as the station map the learner is already looking at.
  home:      { en: "Home",                   af: "Tuis" },
};

/* The art, cropped. Shared by the strip and the map header. */
function trainArt() {
  const box = el("div", "train-art");
  const img = el("img");
  img.src = TRAIN_ART;
  img.alt = "";              // decorative: every word it could carry is beside it
  box.appendChild(img);
  return box;
}

/* ---------------- is the line released yet? ----------------
   The whole Investigation Station can be hidden from learners with one flag
   (CONFIG.stationsLive) — see the note beside it in js/config.js. When it is
   false there is NO way in: `trainStrip` returns null so the home screen has no
   entry, and app.js bounces the `stations` and `investigate` routes back home so
   a guessed URL cannot reach it either.

   `?stations=1` overrides the flag, so the line can still be walked and reviewed
   while the class cannot see it. Deliberately its own switch and not folded into
   `?preview=1`: teacher preview is for showing the app to somebody, and this is
   for working on an unreleased part of it. */
export function stationsVisible() {
  if (CONFIG.stationsLive) return true;
  try { return new URLSearchParams(location.search).get("stations") === "1"; }
  catch { return false; }
}

/* Per-stop state. `passed` comes from progress; unlocking follows the same
   play-order chain as the main map (rounds/index.js), so each stop from the
   second onward opens once the stop before it is passed.

   Stop 1 is the exception (added 2026-08-11 for the proof rounds,
   PROOF-ROUNDS-PLAN.md): `unlockedIds()` chains on ORDER position, and the
   proof rounds now sit between the main quest and inv1 in that order. Left
   alone, stop 1 would silently start requiring every proof round up to P9 to
   be passed before it opened — unreachable for however many sessions it
   takes to build them. It is pinned instead to FINAL_QUEST_ROUND_ID (the
   last round of the 43-round quest, currently r21), exactly like the survey
   trigger in js/game.js is. Stops 2-6 are untouched: they still chain off
   the STATION before them, which the proof rounds never sit between. */
export function stationStatus(app) {
  const progress = (app.state && app.state.progress) || {};
  const unlocked = unlockedIds(progress);
  return STATIONS.map((round, i) => ({
    round,
    stop: i + 1,
    passed: !!(progress[round.id] && progress[round.id].passed),
    unlocked: i === 0 ? !!(progress[FINAL_QUEST_ROUND_ID] && progress[FINAL_QUEST_ROUND_ID].passed) : unlocked.has(round.id),
  }));
}

/* ---------------- the home-screen strip ----------------
   Returns null while the line is hidden — the caller in js/game.js guards for
   it, because appendChild(null) throws. */
export function trainStrip(app) {
  if (!stationsVisible()) return null;
  const rows = stationStatus(app);
  const visited = rows.filter(r => r.passed).length;
  const open = rows.some(r => r.unlocked);

  const strip = el("button", "train-strip" + (open ? "" : " shut"));
  strip.type = "button";

  const head = el("div", "ts-head");
  head.innerHTML = `
    <span class="eyebrow">🚂 ${tx(UI.title)}</span>
    <span class="ts-line">${open ? tx(UI.strapline) : tx(UI.lockedStrip)}</span>`;

  const count = el("span", "ts-count",
    tx(UI.visited).replace("{n}", visited).replace("{total}", rows.length));
  head.appendChild(count);

  // six little lamps, one per stop — the same "how far along am I" read as the
  // counter, but seen at a glance.
  const lamps = el("span", "ts-lamps");
  rows.forEach(r => lamps.appendChild(el("i", "ts-lamp" + (r.passed ? " on" : (r.unlocked ? " open" : "")))));
  head.appendChild(lamps);

  strip.appendChild(head);
  strip.appendChild(trainArt());
  strip.addEventListener("click", () => app.go("stations"));
  return strip;
}

/* ---------------- the six-stop map ---------------- */
export function renderStations(app, host) {
  clear(host);
  const rows = stationStatus(app);
  const accent = STATIONS.length ? STATIONS[0].accent : null;

  const head = el("div", "home-head station-head");
  if (accent) head.style.setProperty("--accent", accent);
  head.innerHTML = `
    <span class="eyebrow">${tx(UI.branch)}</span>
    <h1>🚂 ${tx(UI.title)}</h1>`;
  host.appendChild(head);

  // the same crop as the strip, so the track carries straight on from the tap
  const art = trainArt();
  art.classList.add("station-art");
  host.appendChild(art);

  const intro = el("div", "card station-intro");
  intro.innerHTML = `
    <p>${tx(UI.blurb)}</p>
    <p class="muted small">★ ${tx(UI.xpNote).replace("{xp}", CONFIG.investigationXpPerPanel)}</p>`;
  host.appendChild(intro);

  const line = el("ol", "stopline");
  rows.forEach(r => {
    const item = el("li", "stop" + (r.passed ? " done" : "") + (r.unlocked ? "" : " locked"));
    item.style.setProperty("--accent", r.round.accent);
    item.appendChild(el("span", "stop-dot", r.passed ? "✓" : String(r.stop)));

    const card = el("div", "card stop-card");
    card.innerHTML = `
      <span class="stop-eyebrow">${tx(UI.stop)} ${r.stop} ${r.unlocked ? "" : "🔒"}</span>
      <h3>${tx(r.round.title)}</h3>
      <p>${tx(r.round.blurb)}</p>
      <div class="stop-foot"></div>`;
    const foot = card.querySelector(".stop-foot");
    // What THIS stop pays, computed from its own panels — a station that gains a
    // practice panel starts advertising the higher number by itself.
    const stopXp = (r.round.panels || []).length * CONFIG.investigationXpPerPanel;
    if (r.unlocked && stopXp) {
      foot.appendChild(el("span", "stop-xp", "★ " + tx(UI.stopXp).replace("{xp}", stopXp)));
    }
    if (r.unlocked) {
      if (r.passed) foot.appendChild(el("span", "stop-done", "✓ " + tx(UI.cleared)));
      const go = el("button", "btn primary small", (r.passed ? tx(UI.revisit) : "▶ " + tx(UI.visit)));
      go.addEventListener("click", () => app.go("investigate", { roundId: r.round.id }));
      foot.appendChild(go);
    } else {
      foot.appendChild(el("span", "muted small", r.stop === 1 ? tx(UI.lockedFirst) : tx(UI.lockedPrev)));
    }
    item.appendChild(card);
    line.appendChild(item);
  });
  host.appendChild(line);

  // The station badge lives HERE rather than on the home rank ladder — it is
  // still earned and still fires the unlock ceremony, it just doesn't stand
  // between a finisher and 🏆 Circle Grand Master.
  if (STATION_GROUP && rows.length && rows.every(r => r.passed)) {
    const badge = el("div", "card station-badge");
    badge.innerHTML = `
      <div class="sb-icon">${STATION_GROUP.icon}</div>
      <div class="sb-text">
        <span class="eyebrow">${tx(UI.allDone)}</span>
        <h3>${STATION_GROUP.name}</h3>
        <p class="muted small">${tx(STATION_GROUP.blurb)}</p>
      </div>`;
    host.appendChild(badge);
  }

  const back = el("button", "btn ghost station-back", "← " + tx(UI.home));
  back.addEventListener("click", () => app.go("home"));
  host.appendChild(back);
}
