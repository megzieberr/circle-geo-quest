/* ============================================================
   THE PROOFS GROUP  🔗
   ------------------------------------------------------------
   Added 2026-08-11 (FIX-ROUND-1.md item 1, Megan's first-playtest fix
   round). The ten proof rounds (pr0-pr9, group g7) came OFF the main
   quest map — same move the Investigation Station made on 2026-07-30 —
   and now live behind their own grouped entry, styled after the Grand
   Master Arena "Adventures" card/screen pattern (js/adventure.js).

   TWO DIFFERENCES FROM THE STATION LINE (js/stations.js), both her
   explicit ruling for this round specifically:
     · proofsCard(app) is ALWAYS shown, never gated behind a "live" flag
       or a badge count — "the class starts proofs in class tomorrow,
       independent of map progress." There is no `proofsLive` switch to
       flip and no ?proofs=1 override, because there is nothing to hide.
     · pr0 is unlocked for EVERYONE from the start. Every other proof
       round unlocks once the one before it (in this group, not the main
       ORDER) is passed — a sequential chain scoped to PROOFS alone, not
       reusing rounds/index.js's unlockedIds() (that chain still walks
       ORDER position, so pr0's predecessor there is r21 — exactly the
       gate item 1 says must NOT apply here).

   trainStrip/renderStations kept their train-themed chrome because the
   art is Megan's own asset; the proofs group has no equivalent asset, so
   its card and map reuse the plain "round-grid"/"round-card" classes the
   main quest map already ships (renderHome in js/game.js), rather than
   inventing new CSS this fix round has no way to browser-verify. */
import { PROOFS } from "./rounds/index.js";
import { tx } from "./i18n.js";
import { el, clear } from "./ui.js";

/* Local copy: nothing outside this file looks these up (same convention
   as stations.js's own UI object). Naming flagged for Megan in the
   report — "Proofs" / "Bewyse" is a working title. */
const UI = {
  cardTitle: { en: "Proofs", af: "Bewyse" },
  cardBlurb: { en: "Learn the constructions behind the theorems — ten rounds, open from day one.",
               af: "Leer die konstruksies agter die stellings — tien rondtes, oop vanaf dag een." },
  mapEyebrow: { en: "Behind the theorems", af: "Agter die stellings" },
  mapTitle:   { en: "Proofs", af: "Bewyse" },
  mapBlurb:   { en: "Why proofs matter, then the construction behind each theorem — discovery, transfer, discovery, transfer, and a mixed finale.",
                af: "Hoekom bewyse saak maak, en dan die konstruksie agter elke stelling — ontdekking, oordrag, ontdekking, oordrag, en 'n gemengde eindronde." },
  play:       { en: "Play", af: "Speel" },
  replay:     { en: "Replay", af: "Speel weer" },
  lockedPrev: { en: "Finish the round before this one first.",
                af: "Voltooi eers die rondte voor hierdie een." },
  done:       { en: "{n} of {total} proofs done", af: "{n} van {total} bewyse klaar" },
  home:       { en: "Home", af: "Tuis" },
};

/* Per-round state. pr0 (i === 0) is ALWAYS unlocked — her explicit ruling,
   independent of everything else in progress. Every round after it
   chains on the PROOF before it, not on the main quest's ORDER position
   (unlockedIds() in rounds/index.js would gate pr0 on r21 instead, which
   is exactly the behaviour item 1 overrides). Teacher Preview marks every
   round passed (api.js's PreviewBackend), so this naturally opens
   everything there too, same as the main map and the station line. */
export function proofStatus(app) {
  const progress = (app.state && app.state.progress) || {};
  return PROOFS.map((round, i) => ({
    round,
    stop: i + 1,
    passed: !!(progress[round.id] && progress[round.id].passed),
    unlocked: i === 0 ? true : !!(progress[PROOFS[i - 1].id] && progress[PROOFS[i - 1].id].passed),
  }));
}

/* the next unvisited, unlocked proof round — mirrors nextStationToPlay in
   js/game.js, used by the results screen's "next" action. */
export function nextProofToPlay(progress) {
  const rows = proofStatus({ state: { progress } });
  const row = rows.find(r => r.unlocked && !r.passed);
  return row ? row.round : null;
}

/* ---------------- the home-screen card ----------------
   ALWAYS rendered — no gate, no flag, no ?preview check needed (Teacher
   Preview already sees it like any learner). Styled after the Adventures
   banner (js/game.js's advBanner), which is the closest existing pattern
   to "a standing invitation into a grouped side-quest", except this one
   is never conditional. */
export function proofsCard(app) {
  const rows = proofStatus(app);
  const done = rows.filter(r => r.passed).length;
  const card = el("div", "card adventure-banner proofs-banner");
  card.innerHTML = `
    <div class="adv-bn-icon">🔗</div>
    <div class="adv-bn-text">
      <span class="eyebrow">${tx(UI.cardTitle)}</span>
      <h3>${tx(UI.cardTitle)}</h3>
      <p class="muted small">${tx(UI.cardBlurb)}</p>
      <p class="muted small">${tx(UI.done).replace("{n}", done).replace("{total}", rows.length)}</p>
    </div>
    <div class="adv-bn-foot"></div>`;
  const go = el("button", "btn primary", "▶ " + tx(UI.play));
  go.addEventListener("click", () => app.go("proofs"));
  card.querySelector(".adv-bn-foot").appendChild(go);
  return card;
}

/* ---------------- the ten-round map ---------------- */
export function renderProofs(app, host) {
  clear(host);
  const rows = proofStatus(app);
  const accent = PROOFS.length ? PROOFS[0].accent : null;

  const head = el("div", "home-head");
  if (accent) head.style.setProperty("--accent", accent);
  head.innerHTML = `
    <span class="eyebrow">${tx(UI.mapEyebrow)}</span>
    <h1>🔗 ${tx(UI.mapTitle)}</h1>
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
      <span class="rc-kind">🔗 ${tx({ en: "Proof", af: "Bewys" })}</span>
      <h3>${tx(r.round.title)}</h3>
      <p>${tx(r.round.blurb)}</p>
      <div class="rc-foot"></div>`;
    const foot = card.querySelector(".rc-foot");
    if (r.unlocked) {
      const btn = el("button", "btn primary small", r.passed ? tx(UI.replay) : "▶ " + tx(UI.play));
      btn.addEventListener("click", () => app.go("proof", { roundId: r.round.id }));
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
