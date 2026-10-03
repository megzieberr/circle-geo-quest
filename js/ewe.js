/* ============================================================
   THE EWEREDIGHEID GROUP  📏   (Gr12 only, kind "ewe", group g9)
   ------------------------------------------------------------
   Added 2026-09-29 (EWEREDIGHEID-PLAN.md, kept local). Short mini
   rounds on proportionality for the Gr12 class: build the ratio line
   you would write in the exam, out of chips, and pick its reason.

   Mirrors js/dynamic.js: its own home-screen card, its own grouped
   map, off the main quest map, and the first round always unlocked;
   every later round unlocks once the one before it IN THIS GROUP is
   passed.

   WHO SEES IT. BOTH must hold:
     · the logged-in learner's OWN class is gr12. That is read off the
       server's answer (cgg_leaderboard returns the caller's cohort from
       their own row; js/app.js keeps it as state.cohort), never off the
       ?class= link, which only chooses the login picker's names. A Gr11
       learner never sees the card or reaches the routes, flag or no flag.
     · CONFIG.eweLive is true, OR the address carries ?ewe=1 (her preview,
       the same way ?dynamic=1 works).
   The teacher preview (?preview=1) belongs to no class; it sees the group
   with ?ewe=1 (or once the flag is on) so she can walk it.

   WHY ITS OWN PLAYER, not a panel type inside js/investigate.js: that
   engine's chrome is bilingual (t("next"), "✓ You've got it!", "Not
   quite, try again"), and these rounds are Afrikaans only and end a step
   on its takeaway, never on a generic well-done line. Making it serve
   both would mean new branches inside a file that four live groups run
   through. A separate file changes nothing for anything that does not
   use it.

   SAVING: finish() sends ONE submitRoundReliable() call, exactly like
   the dynamic rounds (score 1: completing is passing; XP per question;
   the server halves replays). No server change: round_id is free text.
   ============================================================ */
import { CONFIG } from "./config.js";
import { EWE } from "./rounds/index.js";
import { PREVIEW } from "./api.js";
import { getSession } from "./session.js";
import { submitRoundReliable } from "./sync.js";
import { el, clear, mount } from "./ui.js";
import { markRatio, SLOT } from "./ewe-core.js";
import { esc, fracHtml, eqHtml, prodHtml, ratioHtml, writtenLineHtml, simLineHtml, areaLineHtml, sineLineHtml, crossLineHtml, trapLineHtml, richHtml, givenHtml, sqText, frameHtml, cellFracHtml, mountFillPad, sketchSvg, shuffle } from "./ewe-kit.js";

/* foreman review 2026-09-29: a statement like "MN ∥ DH" or a name like
   "Δ DHT" never breaks over two lines (no-break spaces, intro and prompts).
   ew3 adds "Opp Δ ABC" and a product "½ · basis · ⊥h": each stays one
   unit too (neither appears in ew1 or ew2). ew4 adds "sin Â": the sine
   and its angle stay together (no prompt or intro of ew1 to ew3 has one).
   ew7 adds "AD²": the "²" becomes the drawer's raised 2 (sqText), the same
   one the card draws (no intro or prompt of ew1 to ew5 has a "²"). */
const glue = t => sqText(esc(t).replace(/(\S) ∥ (\S)/g, "$1\u00A0∥\u00A0$2").replace(/Δ (\S)/g, "Δ\u00A0$1")
  .replace(/Opp Δ/g, "Opp\u00A0Δ").replace(/ · /g, "\u00A0·\u00A0").replace(/\bsin /g, "sin\u00A0"));

/* Afrikaans only, whatever the toggle says (her ruling). Plain strings,
   no tx(): there is no other language to fall back to. */
const UI = {
  eyebrow:   "Graad 12 · Meetkunde",
  cardTitle: "Eweredigheid",
  cardBlurb: "Kort rondtes: watter sye hoort saam, en hoe skryf jy dit neer.",
  done:      "{n} van {total} klaar",
  mapBlurb:  "Elke rondte is kort. Jy bou die lyn wat jy in die eksamen skryf, stuk vir stuk.",
  kind:      "Mini-rondte",
  play:      "Speel",
  replay:    "Speel weer",
  lockedPrev:"Voltooi eers die rondte voor hierdie een.",
  home:      "Tuis",
  map:       "Eweredigheid-kaart",
  nextQ:     "Volgende vraag →",
  last:      "Klaar: stoor my rondte",
  saving:    "Stoor…",
  notYet:    "Nog nie. Lees die wenk en probeer weer.",
  hintTag:   "Wenk",
  showMe:    "Wys my een regte antwoord",
  shown:     "Hier is een regte manier:",
  writeTag:  "Só skryf jy dit",
  roundDone: "Rondte klaar",
  remember:  "Onthou",
  replayHalf:"Herhaling: jy kry die helfte van die XP.",
  replayNone:"Herhaling: hierdie rondte gee nie meer XP nie.",
  queued:    "📶 Ons kon nie die bediener bereik nie. Jou rondte word op hierdie foon bewaar en stuur self sodra jy weer internet het.",
  nextRound: "Volgende rondte",
};
const SHOW_ME_AFTER = 3;   // wrong tries on one step before "show me" appears

/* ---------------- who sees it ---------------- */
function urlFlag() {
  try { return new URLSearchParams(location.search).get("ewe") === "1"; }
  catch { return false; }
}
export function eweVisible(app) {
  if (!(CONFIG.eweLive || urlFlag())) return false;
  if (PREVIEW) return true;                       // the teacher, not a learner
  return !!(app && app.state && app.state.cohort === "gr12");
}

/* ---------------- per-round state (same shape as dynamicStatus) ---------------- */
export function eweStatus(app) {
  const progress = (app.state && app.state.progress) || {};
  return EWE.map((round, i) => ({
    round,
    stop: i + 1,
    passed: !!(progress[round.id] && progress[round.id].passed),
    unlocked: i === 0 ? true : !!(progress[EWE[i - 1].id] && progress[EWE[i - 1].id].passed),
  }));
}
export function nextEweToPlay(progress) {
  const row = eweStatus({ state: { progress } }).find(r => r.unlocked && !r.passed);
  return row ? row.round : null;
}

/* ---------------- the home-screen card ---------------- */
export function eweCard(app) {
  const rows = eweStatus(app);
  const done = rows.filter(r => r.passed).length;
  const card = el("div", "card adventure-banner ewe-banner");
  card.innerHTML = `
    <div class="adv-bn-icon">📏</div>
    <div class="adv-bn-text">
      <span class="eyebrow">${UI.eyebrow}</span>
      <h3>${UI.cardTitle}</h3>
      <p class="muted small">${UI.cardBlurb}</p>
      <p class="muted small">${UI.done.replace("{n}", done).replace("{total}", rows.length)}</p>
    </div>
    <div class="adv-bn-foot"></div>`;
  const go = el("button", "btn primary", "▶ " + UI.play);
  go.addEventListener("click", () => app.go("ewes"));
  card.querySelector(".adv-bn-foot").appendChild(go);
  return card;
}

/* ---------------- the round map ---------------- */
export function renderEweMap(app, host) {
  clear(host);
  const rows = eweStatus(app);
  const head = el("div", "home-head");
  if (EWE.length) head.style.setProperty("--accent", EWE[0].accent);
  head.innerHTML = `
    <span class="eyebrow">${UI.eyebrow}</span>
    <h1>📏 ${UI.cardTitle}</h1>
    <p class="muted">${UI.mapBlurb}</p>`;
  host.appendChild(head);

  const grid = el("div", "round-grid");
  rows.forEach(r => {
    const card = el("article", "round-card" + (r.unlocked ? "" : " locked") + (r.passed ? " done" : ""));
    card.style.setProperty("--accent", r.round.accent);
    card.innerHTML = `
      <div class="rc-top">
        <span class="rc-num">${r.stop}</span>
        ${r.passed ? '<span class="rc-badge" title="Klaar">✓</span>' : (r.unlocked ? "" : '<span class="rc-lock">🔒</span>')}
      </div>
      <span class="rc-kind">📏 ${UI.kind}</span>
      <h3>${esc(r.round.title.af)}</h3>
      <p>${sqText(esc(r.round.blurb.af))}</p>
      <div class="rc-foot"></div>`;
    const foot = card.querySelector(".rc-foot");
    if (r.unlocked) {
      const btn = el("button", "btn primary small", r.passed ? UI.replay : "▶ " + UI.play);
      btn.addEventListener("click", () => app.go("ewe", { roundId: r.round.id }));
      foot.appendChild(btn);
    } else {
      foot.appendChild(el("span", "muted small", UI.lockedPrev));
    }
    grid.appendChild(card);
  });
  host.appendChild(grid);

  const back = el("button", "btn ghost", "← " + UI.home);
  back.style.marginTop = "18px";
  back.addEventListener("click", () => app.go("home"));
  host.appendChild(back);
}

/* ---------------- one round ----------------
   The run's state lives ON the params object. app.go() makes a fresh one,
   so a round opened from the map starts clean; a plain re-render (the
   language toggle calls app.render()) passes the SAME object back, so the
   learner resumes at the question they were on instead of losing it. */
export function renderEweRound(app, host, params) {
  const round = EWE.find(r => r.id === params.roundId);
  if (!round) return app.go("ewes");
  const qs = round.eweQuestions || [];
  const prev = app.state?.progress?.[round.id];
  const alreadyDone = !!(prev && prev.passed);
  const run = params.__eweRun || (params.__eweRun = { qi: 0, gated: 0, firstTry: 0, earned: 0, finished: false, end: null, qStart: null });
  if (run.end) return renderEnd(app, host, round, run.end);
  if (run.finished) { clear(host); host.appendChild(el("p", "muted center", UI.saving)); return; }
  /* a re-render mid-question restarts THAT question, so its steps must not
     count twice */
  if (run.qStart) { run.gated = run.qStart.gated; run.firstTry = run.qStart.firstTry; }

  clear(host);
  const screen = el("div", "play ewe-play");
  screen.style.setProperty("--accent", round.accent);
  const top = el("div", "play-top");
  top.innerHTML = `<button class="link-btn quit" aria-label="Terug na die kaart">✕</button>
    <div class="play-title">📏 ${esc(round.title.af)}</div>
    <div class="play-count"><span class="pc-n"></span> <span class="pc-xp"></span></div>`;
  top.querySelector(".quit").addEventListener("click", () => app.go("ewes"));
  const bar = el("div", "pbar"); bar.appendChild(el("i"));
  const qHost = el("div", "ewe-host");
  mount(screen, top, bar, qHost);
  host.appendChild(screen);

  /* XP: per QUESTION, banked once in finish(). The header tick is display
     only, and shows the halved rate on a replay (the server does the real
     halving, and the end screen shows the server's number). */
  const RATE = CONFIG.eweXpPerQuestion;
  const SHOWN = alreadyDone ? Math.round(RATE * CONFIG.replayXpFactor) : RATE;
  const countN = top.querySelector(".pc-n"), countXp = top.querySelector(".pc-xp");
  countXp.textContent = `★ ${run.earned} XP`;

  function showQuestion() {
    const q = qs[run.qi];
    run.qStart = { gated: run.gated, firstTry: run.firstTry };
    countN.textContent = `${run.qi + 1} / ${qs.length}`;
    bar.querySelector("i").style.width = Math.round((run.qi / qs.length) * 100) + "%";
    clear(qHost);
    const box = el("div", "ewe-q");
    box.dataset.q = q.id;
    const intro = el("p", "q-prompt ewe-intro", glue(q.intro));
    box.appendChild(intro);
    const fig = el("div", "q-diagram");
    fig.innerHTML = sketchSvg(q.sketch);
    box.appendChild(fig);
    const steps = el("div", "ewe-steps");
    box.appendChild(steps);
    qHost.appendChild(box);

    let si = 0, lastFill = null;
    const nextStep = () => {
      if (si < q.steps.length) {
        const step = q.steps[si++];
        const first = si === 1;
        const stepBox = el("div", "ewe-step");
        steps.appendChild(stepBox);
        /* phone folds (her ruling 2026-10-02): a build step is filled while
           looking at the sketch, so it keeps the sketch on screen; a pick
           step is still centred as before. ew5, opt-in (foreman review
           2026-10-02): a pick step with `keepSketch` is read off the sketch
           too, so it is brought in like a build step, its options in the
           place of the frame. */
        if (!first) { if (step.type === "build" || step.keepSketch) bringBuild(stepBox, fig); else bringIn(stepBox); }
        const done = (res) => {
          run.gated++;
          if (res.firstTry) run.firstTry++;
          if (res.fill) lastFill = res.fill;
          /* phone folds: a finished step is history now; its spacing
             tightens (CSS .ewe-step.is-done), no words change */
          stepBox.classList.add("is-done");
          /* ew4, opt-in: a step that brings `sketchAfter` redraws the
             question's sketch once it is answered right (her star at the
             shared angle), and it stays for the rest of the question.
             Without the key the sketch is never touched. */
          if (step.sketchAfter) fig.innerHTML = sketchSvg(step.sketchAfter);
          /* phone folds: step 1 is right, so the intro folds to one line,
             BEFORE the next step is brought in (its scroll is measured on
             the folded page). A one-step question never folds: nothing
             follows it. */
          if (first && q.steps.length > 1) foldIntro(intro);
          nextStep();
        };
        if (step.type === "build") mountBuild(stepBox, step, done);
        else mountPick(stepBox, step, done);
        return;
      }
      /* every step done: the card, then the way on */
      const card = writeCard(q, lastFill);
      steps.appendChild(card);
      bringIn(card);
      const foot = el("div", "play-foot");
      const isLast = run.qi === qs.length - 1;
      const go = el("button", "btn primary big ewe-next", isLast ? UI.last : UI.nextQ);
      foot.appendChild(go);
      steps.appendChild(foot);
      let spent = false;
      go.addEventListener("click", () => {
        if (spent) return;
        spent = true;
        go.disabled = true;
        run.earned += SHOWN;
        countXp.textContent = `+${SHOWN} XP`;
        setTimeout(() => { countXp.textContent = `★ ${run.earned} XP`; }, 900);
        if (isLast) { go.textContent = UI.saving; finish(); }
        else { run.qi++; window.scrollTo(0, 0); showQuestion(); }
      });
    };
    nextStep();
  }

  /* ONE submit. The button that got us here is already disabled and spent
     (above) BEFORE this await, so a double click cannot bank twice. */
  async function finish() {
    if (run.finished) return;
    run.finished = true;
    bar.querySelector("i").style.width = "100%";
    const xpEarned = qs.length * RATE;
    const s = getSession();
    const res = await submitRoundReliable(s.name, s.password, round.id, {
      score: 1,                             // completing is passing, as in the dynamic rounds
      xpGained: xpEarned,
      total: run.gated || qs.length,
      correct: run.firstTry,
    });
    await app.refreshState();
    const awarded = (res && res.ok && typeof res.xpAwarded === "number")
      ? res.xpAwarded
      : (alreadyDone ? Math.round(xpEarned * CONFIG.replayXpFactor) : xpEarned);
    run.end = { xp: awarded, saved: !!(res && res.ok), alreadyDone };
    /* a full re-render, not a local one: the top bar's XP total must show
       the freshly refreshed number, and render() lands on run.end above.
       Skipped if the learner has already gone elsewhere. */
    if (app.params === params) { window.scrollTo(0, 0); app.render(); }
  }

  showQuestion();
}

/* Foreman review 2026-09-29: a new step, and the card, used to appear BELOW
   the phone screen with nothing to say so. Each one is now brought onto the
   screen. A timeout, not requestAnimationFrame: the block must be laid out
   first, and rAF does not run in every test browser. */
function bringIn(node) {
  setTimeout(() => centre(node), 80);
}
function centre(node) {
  try { node.scrollIntoView({ behavior: calm() ? "instant" : "smooth", block: "center" }); }
  catch { node.scrollIntoView(); }
}

/* a learner who asked their phone for less motion gets a jump, not a glide
   (the page's own scroll-behavior is smooth, so "instant" must be said) */
function calm() {
  try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
  catch { return false; }
}

/* ---------------- the phone folds (her ruling 2026-10-02) ----------------
   Her words after playing ew4 on the phone: the top must fold away, "like
   we established in blipwork", or the Gr12 class scrolls up and down all
   the time. Blipwork's precedent: an answered input disappears with
   display:none and no height animation, so the scroll to the next step is
   measured on the final layout. Three folds here, all in this shared player,
   so every round gets them:
     1. the intro, once step 1 of a question is right (foldIntro below);
     2. a finished pick step keeps only its chosen option (mountPick);
     3. a finished build step drops its locked frame, and its ✓ line (the
        full written line) is the answer display (mountBuild; foreman
        ruling 2026-10-02, after the fold walk measured ew4's step 3).
   No new words: a chevron is the only new thing on the screen. */

/* Fold 1: the intro becomes ONE line, a chevron and the text cut with an
   ellipsis (CSS, .ewe-intro.is-folded). A tap, or Enter or Space, opens it
   to its full text and closes it again. Instant. */
function foldIntro(intro) {
  const chev = el("span", "ewe-chev", "▸");
  chev.setAttribute("aria-hidden", "true");
  intro.prepend(chev);
  intro.classList.add("is-folded");
  intro.setAttribute("role", "button");
  intro.setAttribute("aria-expanded", "false");
  intro.tabIndex = 0;
  const flip = () => {
    const folded = intro.classList.toggle("is-folded");
    chev.textContent = folded ? "▸" : "▾";
    intro.setAttribute("aria-expanded", String(!folded));
  };
  intro.addEventListener("click", flip);
  intro.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
  });
}

/* A new BUILD step: the sketch stays on screen with the step under it. The
   sketch's top goes just under the sticky top bar, instead of the step
   being centred with the sketch pushed off the top. Only when the step's
   frame (the boxes) would then sit below the screen does the page go
   further down, by just enough, as long as the sketch's bottom edge stays
   below the bar. If even that cannot show the frame (too much finished
   work sits between the sketch and the new step on a small phone), the
   step is brought in as before, centred, so its boxes and chips are on the
   screen. Measured once from the laid-out page (the folds above are
   already done and instant), never from a smooth scroll in flight; same
   timeout as bringIn, same fallback when smooth is refused. */
const EDGE = 8;   // px of air above the sketch and below the frame
function bringBuild(node, fig) {
  setTimeout(() => {
    const bar = document.querySelector(".topbar");
    const head = bar ? Math.max(0, bar.getBoundingClientRect().bottom) : 0;
    const y0 = window.scrollY, vh = window.innerHeight;
    const s = fig.getBoundingClientRect();
    /* a pick step (ew5 keepSketch): its options are what must be on screen */
    const f = (node.querySelector(".ewe-opts") || node.querySelector(".ewpad-disp") || node).getBoundingClientRect();
    let y = y0 + s.top - head - EDGE;                  // the sketch just under the bar
    const need = y0 + f.bottom + EDGE - vh;            // the frame just above the bottom edge
    if (need > y) {
      if (need > y0 + s.bottom - head - EDGE) return centre(node);   // both cannot fit
      y = need;
    }
    y = Math.max(0, Math.round(y));
    try { window.scrollTo({ top: y, behavior: calm() ? "instant" : "smooth" }); }
    catch { window.scrollTo(0, y); }
  }, 80);
}

/* ew6, opt-in: a GIVEN line that belongs to a step, drawn like a frame with
   no boxes (ew4's result above step 2, the area ratio a question gives
   above step 3), with an optional plain sentence under it. `first` puts it
   above the step's prompt, else it sits between the prompt and the frame or
   the options. It is part of the step, not of the pad, so it stays when
   the step is finished. Without step.given nothing is added. */
function mountGiven(host, step, where) {
  const g = step.given;
  if (!g || !!g.first !== (where === "first")) return;
  const box = el("div", "ewe-given", givenHtml(g.line));
  if (g.text) box.appendChild(el("p", "ewe-given-tx", glue(g.text)));
  host.appendChild(box);
}

/* ---------------- a build step (the pad) ---------------- */
function mountBuild(host, step, onDone) {
  mountGiven(host, step, "first");
  host.appendChild(el("p", "q-prompt ewe-prompt", glue(step.prompt)));
  mountGiven(host, step, "after");
  const padHost = el("div", "ewe-padhost");
  host.appendChild(padHost);
  const hint = el("div", "dp-hint ewe-hint"); hint.hidden = true;
  const fb = el("div", "dp-feedback ewe-fb"); fb.hidden = true;
  const showMe = el("button", "link-btn ewe-showme", UI.showMe); showMe.hidden = true;
  host.appendChild(fb); host.appendChild(hint); host.appendChild(showMe);

  let wrong = 0, over = false;
  /* Fold 3 (foreman ruling 2026-10-02): once the step is finished, right or
     shown, the locked frame (the boxes with their chips) and the line under
     it say the same thing twice, and on a small phone the frame is what
     pushes the sketch off the top for the next step. So the frame goes,
     instantly ([hidden] is display:none in .ewe-q, no height animation),
     BEFORE onDone brings the next step in, so that scroll is measured on
     the folded page. The prompt and the full written line stay, as
     Blipwork keeps the entered value and drops the pad. */
  const fold = () => { padHost.hidden = true; };
  /* ew3, opt-in: a step may bring its own frame (the pad's frame contract,
     text cells allowed in a fraction); the fill is then as long as ITS
     boxes, and the finished line is drawn from that frame. Without
     step.frame: the four boxes and ratioHtml, exactly as before. */
  const frame = step.frame || [{ n: [SLOT], d: [SLOT] }, "=", { n: [SLOT], d: [SLOT] }];
  const lineOf = f => (step.frame ? frameHtml(step.frame, f) : ratioHtml(f));
  /* ew7, opt-in: a build step with an okLine says its takeaway under the
     finished line (a "²" in it drawn by sqText). Without the key the ✓ line
     is the finished line alone, as before. */
  /* ew6, opt-in: an okLine that is an ARRAY carries stacked fractions in
     its sentence (richHtml, the one drawer); a string is drawn as before */
  const okHtml = step.okLine ? `<div class="ewe-okline">${Array.isArray(step.okLine) ? richHtml(step.okLine) : sqText(esc(step.okLine))}</div>` : "";
  const pad = mountFillPad(padHost, {
    frame, chips: step.chips,
    fixed: step.fixed,          // ew2: a chip already in the first box (opt-in)
    /* foreman review 2026-09-29: "Nog nie" is about the fill that was
       checked. Once they change a box it no longer describes what is on
       the screen, so it goes. The hint stays: it is still the help. */
    onEdit() { if (!over) fb.hidden = true; },
    onSubmit(fill) {
      if (over) return;
      const r = markRatio(fill, step.spec);
      if (r.ok) {
        over = true;
        pad.lock();
        hint.hidden = true; showMe.hidden = true;
        fb.hidden = false;
        fb.className = "dp-feedback good ewe-fb";
        fb.innerHTML = `<span class="ewe-tick">✓</span> ${lineOf(fill)}${okHtml}`;
        fold();
        onDone({ firstTry: wrong === 0, fill });
        return;
      }
      wrong++;
      fb.hidden = false;
      fb.className = "dp-feedback bad ewe-fb";
      fb.textContent = UI.notYet;
      hint.hidden = false;
      hint.innerHTML = `<span class="dp-hint-tag">💡 ${UI.hintTag}</span> ${hintHtml(step, r.why, r)}`;
      if (wrong >= SHOW_ME_AFTER) showMe.hidden = false;
    },
  });
  showMe.addEventListener("click", () => {
    if (over) return;
    over = true;
    pad.setFill(step.answer);
    pad.lock();
    hint.hidden = true; showMe.hidden = true;
    fb.hidden = false;
    fb.className = "dp-feedback revealed ewe-fb";
    fb.innerHTML = `💡 ${UI.shown} ${lineOf(step.answer)}${okHtml}`;
    fold();
    onDone({ firstTry: false, fill: step.answer });
  });
}

function hintHtml(step, why, r) {
  const h = step.hints;
  /* ew6 (the exact marker): one plain sentence per wrong reason, the
     reasons named by the question data */
  if (step.spec && step.spec.mode === "exact") return esc(h[why] || h.pattern);
  /* ew3 (the area marker): one plain sentence per wrong reason (crossed,
     shared, repeat, order, pattern), keyed by the reason itself */
  if (step.spec && step.spec.mode === "area") return esc(h[why] || h.pattern);
  /* ew4 (the product marker): the same, and "{chip}" in a hint becomes the
     very chip the marker named (the third side they used: DE or BC) */
  if (step.spec && step.spec.mode === "sine") return esc((h[why] || h.pattern).replace("{chip}", (r && r.chip) || ""));
  /* ew7 (the product and cross markers): one plain sentence per wrong
     reason, "{chip}" filled with the decoy the marker named, a "²" drawn
     by sqText. The pattern hint carries a TEMPLATE in words: a product
     line (kind "prod") or two stacked fractions (kind "frac"). */
  if (step.spec && (step.spec.mode === "prod" || step.spec.mode === "cross")) {
    const x = h[why] || h.pattern;
    if (typeof x === "string") return sqText(esc(x.replace("{chip}", (r && r.chip) || "")));
    const [l1, l2] = x.template.left.map(esc), [r1, r2] = x.template.right.map(esc);
    const tpl = x.template.kind === "prod" ? eqHtml(prodHtml([l1, l2]), prodHtml([r1, r2])) : eqHtml(fracHtml(l1, l2), fracHtml(r1, r2));
    return `${sqText(esc(x.text))}<div class="ewe-template">${tpl}</div>`;
  }
  if (why === "par") return esc(h.par);
  if (why === "repeat") return esc(h.repeat);
  if (why === "whole") return esc(h.whole);
  /* ew2 (the similarity marker): a bottom piece, or a right pattern
     without the ∥ lines the step asked for */
  if (why === "bottom") return esc(h.bottom);
  if (why === "nopar") return esc(h.nopar);
  /* the pattern hint: a sentence and a stacked-fraction template in words */
  const [top, bot] = h.pattern.template.map(esc);
  return `${esc(h.pattern.text)}<div class="ewe-template">${eqHtml(fracHtml(top, bot), fracHtml(top, bot))}</div>`;
}

/* ---------------- a pick step (reason, or yes / no) ---------------- */
function mountPick(host, step, onDone) {
  mountGiven(host, step, "first");
  host.appendChild(el("p", "q-prompt ewe-prompt", glue(step.prompt)));
  mountGiven(host, step, "after");
  /* ew2 Q4, opt-in: a half-built ratio a/b = c/☐ above the options, the
     empty box glowing; it becomes the finished ratio once it is right */
  const half = step.half ? step.half.map(esc) : null;
  /* ew5, opt-in: a lead line, the fixed tinted fraction "Opp Δ … over
     Opp Δ …", then "=" and ONE glowing empty box; the box becomes the
     chosen option's fraction once it is right (the mirror of `half`) */
  const lead = !half && step.lead ? step.lead : null;
  const show = half ? el("div", "ewpad-disp ewe-show",
    eqHtml(fracHtml(half[0], half[1]), fracHtml(half[2], '<span class="ewslot is-next"></span>')))
    : lead ? el("div", "ewpad-disp ewe-show ewe-lead", eqHtml(cellFracHtml(lead), '<span class="ewslot is-next"></span>')) : null;
  if (show) host.appendChild(show);
  const yesno = step.layout === "yesno";
  /* ew5, opt-in: `grid: 2` sets the options in a 2 x 2 grid (one stacked
     fraction per cell), so the sketch keeps its room on a small phone.
     Without the key the options stack as before. */
  const grid = !yesno && step.grid === 2;
  const opts = el("div", "q-options ewe-opts" + (yesno ? " yesno" : "") + (grid ? " grid2 ewe-grid" : ""));
  const hint = el("div", "dp-hint ewe-hint"); hint.hidden = true;
  const fb = el("div", "dp-feedback ewe-fb"); fb.hidden = true;
  /* Ja / Nee keep their natural order; the reasons are shuffled so the
     right one is never "the top one" */
  const list = yesno ? step.options.slice() : shuffle(step.options);
  let wrong = 0, over = false;
  list.forEach(o => {
    /* an option with a `fill` is drawn as the stacked fraction it makes
       (fill[2] over fill[3]); its plain words stay on as the button's label
       for a screen reader */
    /* ew5, opt-in: an option with a `frac` is ONE stacked fraction drawn
       from frame cells (cellFracHtml: hats and the ½ get their room), its
       plain words the aria-label like a `fill` option; an option with a
       `sub` shows its name, and under it a smaller second line (the
       formula). Both carry data-opt = their text, for the phone check. */
    const html = o.fill ? fracHtml(esc(o.fill[2]), esc(o.fill[3]))
      : o.frac ? cellFracHtml(o.frac)
      : o.sub ? `<span class="ewe-opt-name">${esc(o.text)}</span><span class="ewe-opt-sub">${esc(o.sub)}</span>`
      : esc(o.text);
    const b = el("button", "opt ewe-opt" + (o.frac ? " has-frac" : o.sub ? " has-sub" : ""), html);
    if (o.fill || o.frac) b.setAttribute("aria-label", o.text);
    if (o.frac || o.sub) b.dataset.opt = o.text;
    b.type = "button";
    b.addEventListener("click", () => {
      if (over) return;
      if (o.correct) {
        over = true;
        b.classList.add("is-correct");
        /* Fold 2 (her ruling 2026-10-02): the chosen option IS the answer
           now (with the sketch), so every other option goes, instantly
           ([hidden] is display:none in .ewe-q). The chosen one keeps its
           green and the ✓ line stays under it. Ja / Nee too. Nothing is
           hidden before the right answer: a wrong tap stays red as before. */
        opts.querySelectorAll("button").forEach(x => { x.disabled = true; if (x !== b) x.hidden = true; });
        if (show && o.fill) show.innerHTML = ratioHtml(o.fill);
        if (show && lead && o.frac) show.innerHTML = eqHtml(cellFracHtml(lead), cellFracHtml(o.frac));
        hint.hidden = true;
        fb.hidden = false;
        fb.className = "dp-feedback good ewe-fb";
        fb.textContent = "✓ " + step.okLine;
        onDone({ firstTry: wrong === 0 });
        return;
      }
      wrong++;
      b.classList.add("is-wrong");
      b.disabled = true;
      fb.hidden = false;
      fb.className = "dp-feedback bad ewe-fb";
      fb.textContent = UI.notYet;
      hint.hidden = false;
      hint.innerHTML = `<span class="dp-hint-tag">💡 ${UI.hintTag}</span> ${esc(o.hint || "")}`;
    });
    opts.appendChild(b);
  });
  host.appendChild(opts);
  host.appendChild(fb);
  host.appendChild(hint);
}

/* ---------------- the "Só skryf jy dit" card ---------------- */
function writeCard(q, fill) {
  const card = el("div", "ewe-write");
  card.appendChild(el("div", "ewe-write-tag", "✍️ " + UI.writeTag));
  const body = el("div", "ewe-write-body");
  if (q.write.text) body.appendChild(el("p", "ewe-write-text", esc(q.write.text)));
  /* ew3, opt-in: her three-fraction area chain, the ½ and ⊥h struck through */
  else if (q.write.area) body.innerHTML = areaLineHtml(q.write.area, q.write.reason);
  /* ew4, opt-in: the same chain for a shared angle, the ½ and sin struck
     through, the products inside the last fraction */
  else if (q.write.sine) body.innerHTML = sineLineHtml(q.write.sine, q.write.reason);
  /* ew7, opt-in: the product line rewritten, the last line the fractions
     the learner built (their fill) */
  else if (q.write.cross) body.innerHTML = crossLineHtml({ ...q.write.cross, fill: fill || q.write.cross.fill });
  /* ew6, opt-in: her trapezium page, part (c) and, after a full chain, the
     two lines above it */
  else if (q.write.trap) body.innerHTML = trapLineHtml(q.write.trap);
  /* ew2, opt-in: TWO lines as on the exam page, the similar triangles
     first, then the ratio. A step with no build (ew2 Q4) brings its own
     fill. ew1 has neither, so its card is unchanged. */
  else body.innerHTML = (q.write.sim ? simLineHtml(q.write.sim, q.write.simReason) : "")
                      + writtenLineHtml(fill || q.write.fill, q.write.reason);
  card.appendChild(body);
  if (q.write.tip) card.appendChild(el("p", "ewe-write-tip", sqText(esc(q.write.tip))));
  return card;
}

/* ---------------- the end of a round ----------------
   Ends on the round's takeaway, never on a generic well-done line. */
function renderEnd(app, host, round, r) {
  clear(host);
  const screen = el("div", "results ewe-end");
  screen.style.setProperty("--accent", round.accent);
  const tk = round.takeaway;
  const note = r.alreadyDone ? `<div class="result-msg note">🔁 ${r.xp > 0 ? UI.replayHalf : UI.replayNone}</div>` : "";
  const warn = r.saved ? "" : `<div class="result-msg warn">${UI.queued}</div>`;
  screen.innerHTML = `
    <div class="result-card card">
      <div class="result-emoji">📏</div>
      <h1>${esc(round.title.af)}</h1>
      <p class="muted">${UI.roundDone}</p>
      ${r.xp > 0 ? `<div class="result-pills"><span class="pill xp">★ +${r.xp} XP</span></div>` : ""}
      ${note}${warn}
      <div class="ewe-write ewe-takeaway">
        <div class="ewe-write-tag">${UI.remember}</div>
        <p class="ewe-write-text">${sqText(esc(tk.text))}</p>
        <div class="ewe-write-body">${tk.trap ? trapLineHtml(tk.trap) : tk.cross ? crossLineHtml(tk.cross) : tk.sine ? sineLineHtml(tk.sine, tk.reason) : tk.area ? areaLineHtml(tk.area, tk.reason)
          : (tk.sim ? simLineHtml(tk.sim, tk.simReason) : "") + writtenLineHtml(tk.fill, tk.reason)}</div>
      </div>
      <div class="result-actions"></div>
    </div>`;
  const actions = screen.querySelector(".result-actions");
  const mk = (label, primary, fn) => { const b = el("button", "btn " + (primary ? "primary" : "ghost"), label); b.addEventListener("click", fn); actions.appendChild(b); };
  const next = r.saved ? nextEweToPlay(app.state?.progress || {}) : null;
  if (next && next.id !== round.id) {
    mk("▶ " + UI.nextRound, true, () => app.go("ewe", { roundId: next.id }));
    mk("📏 " + UI.map, false, () => app.go("ewes"));
  } else {
    mk("📏 " + UI.map, true, () => app.go("ewes"));
  }
  mk("🏠 " + UI.home, false, () => app.go("home"));
  host.appendChild(screen);
}
