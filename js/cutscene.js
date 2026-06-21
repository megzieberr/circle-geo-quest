/* ============================================================
   CUTSCENE PLAYER  (animated, click-to-advance explainer)
   ------------------------------------------------------------
   A cutscene round builds a picture up one beat at a time, with a
   caption per beat. The learner taps to advance. Used for the
   "Parts of a circle" intro: a point appears, a radius swings out
   like a compass arm, the circumference is drawn, then each part
   is revealed and named.

   round = { kind:"cutscene", scenes:[ { caption, frag, anim } ] }
     frag : an SVG markup string added to the canvas for this beat
     anim : "draw" (stroke draws on) | "pop" | "fade"  (default "fade")
            "persist:false" frags are cleared on the next beat
   The cutscene is a learning round: finishing it marks the round
   complete (no XP) and unlocks the next round.
   ============================================================ */
import { ROUND_BY_ID } from "./rounds/index.js";
import { api } from "./api.js";
import { getSession } from "./session.js";
import { t, tx } from "./i18n.js";
import { el, clear } from "./ui.js";

export const CS = { W: 360, H: 300, cx: 180, cy: 148, R: 104 };

export function renderCutscene(app, host, params) {
  const round = ROUND_BY_ID[params.roundId];
  if (!round) return app.go("home");
  const scenes = round.scenes || [];
  const prev = app.state?.progress?.[round.id];
  const alreadyDone = !!(prev && prev.passed);

  clear(host);
  const screen = el("div", "play cutscene");
  screen.style.setProperty("--accent", round.accent);
  const top = el("div", "play-top");
  top.innerHTML = `<button class="link-btn quit">✕</button>
    <div class="play-title">${tx(round.title)}</div>
    <div class="play-count"></div>`;
  top.querySelector(".quit").addEventListener("click", () => app.go("home"));

  const stageWrap = el("div", "cs-stage");
  stageWrap.innerHTML = `<svg class="diag cs-svg" viewBox="0 0 ${CS.W} ${CS.H}" role="img" preserveAspectRatio="xMidYMid meet">
    <g class="cs-base"></g><g class="cs-layer"></g></svg>`;
  const layer = stageWrap.querySelector(".cs-layer");
  const persistLayer = stageWrap.querySelector(".cs-base");

  const cap = el("div", "cs-caption");
  const foot = el("div", "play-foot");
  const next = el("button", "btn primary big", t("continue"));
  foot.appendChild(next);

  screen.appendChild(top);
  screen.appendChild(stageWrap);
  screen.appendChild(cap);
  screen.appendChild(foot);
  host.appendChild(screen);

  let i = -1;
  function play(idx) {
    const sc = scenes[idx];
    top.querySelector(".play-count").textContent = `${idx + 1} / ${scenes.length}`;
    // non-persistent frags from the previous beat are cleared
    layer.replaceChildren();
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "cs-frag anim-" + (sc.anim || "fade"));
    g.innerHTML = sc.frag || "";
    (sc.persist === false ? layer : persistLayer).appendChild(g);
    // force reflow so the animation class takes effect
    void g.getBoundingClientRect();
    g.classList.add("go");
    cap.innerHTML = tx(sc.caption);
    next.textContent = idx + 1 < scenes.length ? t("continue") : t("finish");
  }

  async function finish() {
    if (!alreadyDone) {
      try {
        const s = getSession();
        await api.submitRound(s.name, s.password, round.id, { score: 1, xpGained: 0, total: scenes.length, correct: scenes.length });
      } catch { /* offline */ }
    }
    await app.refreshState();
    app.go("results", { roundId: round.id, discovery: true, correct: scenes.length, total: scenes.length, xp: 0, frac: 1, badgeEarned: false, alreadyPassed: alreadyDone });
  }

  next.addEventListener("click", () => {
    i++;
    if (i < scenes.length) play(i);
    if (i >= scenes.length - 1) next.textContent = t("finish");
    if (i >= scenes.length) finish();
  });
  // advance also by tapping the stage
  stageWrap.addEventListener("click", () => { if (i < scenes.length - 1) next.click(); });

  // kick off
  next.click();
}
