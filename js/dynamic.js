/* ============================================================
   THE DYNAMIC GEOMETRY GROUP  🧲
   ------------------------------------------------------------
   Added 2026-08-14 (Dynamic Geometry build session 1, DYNAMIC-GEO-PLAN.md
   §1 "Moving points", minus its capstone). Mirrors js/proofs.js's pattern
   EXACTLY, group "g8", off the main quest map the same way the proof
   rounds (g7) are — its own home-screen card, its own grouped map, kind
   "dynamic" routed through renderInvestigate() (js/investigate.js) the
   same way "proof" is.

   SAME TWO RULES AS THE PROOFS LINE, her precedent carried over rather
   than re-litigated:
     · dynamicCard(app) is ALWAYS shown, no live flag, no gate — same
       reasoning as proofsCard: nothing here needs hiding from a learner.
     · dg0 is unlocked for EVERYONE from the start. Every later round
       unlocks once the one before it IN THIS GROUP is passed — a chain
       scoped to DYNAMIC alone, not rounds/index.js's unlockedIds() (which
       still walks the full ORDER position and would gate dg0 on pr9). */
import { DYNAMIC } from "./rounds/index.js";
import { tx } from "./i18n.js";
import { el, clear } from "./ui.js";

/* Local copy — nothing outside this file looks these up. "Dynamic
   Geometry" / "Dinamiese Meetkunde" is a working title (per the build
   brief) — Megan's to rename later. */
const UI = {
  cardTitle: { en: "Dynamic Geometry", af: "Dinamiese Meetkunde" },
  // No round count in this line, same reasoning as proofsCard's own note:
  // it would go stale the moment the next arc's rounds land. The card
  // already renders the live "N of N done" counter right underneath.
  cardBlurb: { en: "Drag it, watch it glide, then freeze the figure and answer what you already know.",
               af: "Drag dit, kyk dit gly, en vries dan die figuur en beantwoord wat jy reeds weet." },
  mapEyebrow: { en: "See it move", af: "Sien dit beweeg" },
  mapTitle:   { en: "Dynamic Geometry", af: "Dinamiese Meetkunde" },
  mapBlurb:   { en: "Moving points, live readouts, and a frozen snapshot for the booklet-style questions.",
                af: "Bewegende punte, lewendige lesings, en 'n bevrore foto vir die handboek-styl vrae." },
  play:       { en: "Play", af: "Speel" },
  replay:     { en: "Replay", af: "Speel weer" },
  lockedPrev: { en: "Finish the round before this one first.",
                af: "Voltooi eers die rondte voor hierdie een." },
  done:       { en: "{n} of {total} done", af: "{n} van {total} klaar" },
  home:       { en: "Home", af: "Tuis" },
};

/* Per-round state — identical shape and reasoning to proofStatus() in
   js/proofs.js. dg0 (i === 0) is ALWAYS unlocked; every round after it
   chains on the DYNAMIC round before it, never on the main quest's ORDER
   position. Teacher Preview (api.js's PreviewBackend) marks every round
   passed, so this naturally opens everything there too. */
export function dynamicStatus(app) {
  const progress = (app.state && app.state.progress) || {};
  return DYNAMIC.map((round, i) => ({
    round,
    stop: i + 1,
    passed: !!(progress[round.id] && progress[round.id].passed),
    unlocked: i === 0 ? true : !!(progress[DYNAMIC[i - 1].id] && progress[DYNAMIC[i - 1].id].passed),
  }));
}

/* the next unvisited, unlocked dynamic round — mirrors nextProofToPlay. */
export function nextDynamicToPlay(progress) {
  const rows = dynamicStatus({ state: { progress } });
  const row = rows.find(r => r.unlocked && !r.passed);
  return row ? row.round : null;
}

/* ---------------- the home-screen card ----------------
   ALWAYS rendered, same as proofsCard — there is nothing to gate. */
export function dynamicCard(app) {
  const rows = dynamicStatus(app);
  const done = rows.filter(r => r.passed).length;
  const card = el("div", "card adventure-banner dynamic-banner");
  card.innerHTML = `
    <div class="adv-bn-icon">🧲</div>
    <div class="adv-bn-text">
      <span class="eyebrow">${tx(UI.mapEyebrow)}</span>
      <h3>${tx(UI.cardTitle)}</h3>
      <p class="muted small">${tx(UI.cardBlurb)}</p>
      <p class="muted small">${tx(UI.done).replace("{n}", done).replace("{total}", rows.length)}</p>
    </div>
    <div class="adv-bn-foot"></div>`;
  const go = el("button", "btn primary", "▶ " + tx(UI.play));
  go.addEventListener("click", () => app.go("dynamics"));
  card.querySelector(".adv-bn-foot").appendChild(go);
  return card;
}

/* ---------------- the round map ---------------- */
export function renderDynamic(app, host) {
  clear(host);
  const rows = dynamicStatus(app);
  const accent = DYNAMIC.length ? DYNAMIC[0].accent : null;

  const head = el("div", "home-head");
  if (accent) head.style.setProperty("--accent", accent);
  head.innerHTML = `
    <span class="eyebrow">${tx(UI.mapEyebrow)}</span>
    <h1>🧲 ${tx(UI.mapTitle)}</h1>
    <p class="muted">${tx(UI.mapBlurb)}</p>`;
  host.appendChild(head);

  const grid = el("div", "round-grid");
  rows.forEach(r => {
    const card = el("article", "round-card" + (r.unlocked ? "" : " locked") + (r.passed ? " done" : ""));
    card.style.setProperty("--accent", r.round.accent);
    card.innerHTML = `
      <div class="rc-top">
        <span class="rc-num">${r.stop}</span>
        ${r.passed ? '<span class="rc-badge" title="Done">✓</span>' : (r.unlocked ? "" : '<span class="rc-lock">🔒</span>')}
      </div>
      <span class="rc-kind">🧲 ${tx({ en: "Dynamic", af: "Dinamies" })}</span>
      <h3>${tx(r.round.title)}</h3>
      <p>${tx(r.round.blurb)}</p>
      <div class="rc-foot"></div>`;
    const foot = card.querySelector(".rc-foot");
    if (r.unlocked) {
      const btn = el("button", "btn primary small", r.passed ? tx(UI.replay) : "▶ " + tx(UI.play));
      btn.addEventListener("click", () => app.go("dynamic", { roundId: r.round.id }));
      foot.appendChild(btn);
    } else {
      foot.appendChild(el("span", "muted small", tx(UI.lockedPrev)));
    }
    grid.appendChild(card);
  });
  host.appendChild(grid);

  const back = el("button", "btn ghost", "← " + tx(UI.home));
  back.style.marginTop = "18px";
  back.addEventListener("click", () => app.go("home"));
  host.appendChild(back);
}
