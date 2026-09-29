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
import { esc, fracHtml, eqHtml, ratioHtml, writtenLineHtml, mountFillPad, sketchSvg, shuffle } from "./ewe-kit.js";

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
      <p>${esc(r.round.blurb.af)}</p>
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
    box.appendChild(el("p", "q-prompt ewe-intro", esc(q.intro)));
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
        const stepBox = el("div", "ewe-step");
        steps.appendChild(stepBox);
        const done = (res) => {
          run.gated++;
          if (res.firstTry) run.firstTry++;
          if (res.fill) lastFill = res.fill;
          nextStep();
        };
        if (step.type === "build") mountBuild(stepBox, step, done);
        else mountPick(stepBox, step, done);
        return;
      }
      /* every step done: the card, then the way on */
      steps.appendChild(writeCard(q, lastFill));
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

/* ---------------- a build step (the pad) ---------------- */
function mountBuild(host, step, onDone) {
  host.appendChild(el("p", "q-prompt ewe-prompt", esc(step.prompt)));
  const padHost = el("div", "ewe-padhost");
  host.appendChild(padHost);
  const hint = el("div", "dp-hint ewe-hint"); hint.hidden = true;
  const fb = el("div", "dp-feedback ewe-fb"); fb.hidden = true;
  const showMe = el("button", "link-btn ewe-showme", UI.showMe); showMe.hidden = true;
  host.appendChild(fb); host.appendChild(hint); host.appendChild(showMe);

  let wrong = 0, over = false;
  const frame = [{ n: [SLOT], d: [SLOT] }, "=", { n: [SLOT], d: [SLOT] }];
  const pad = mountFillPad(padHost, {
    frame, chips: step.chips,
    onSubmit(fill) {
      if (over) return;
      const r = markRatio(fill, step.spec);
      if (r.ok) {
        over = true;
        pad.lock();
        hint.hidden = true; showMe.hidden = true;
        fb.hidden = false;
        fb.className = "dp-feedback good ewe-fb";
        fb.innerHTML = `<span class="ewe-tick">✓</span> ${ratioHtml(fill)}`;
        onDone({ firstTry: wrong === 0, fill });
        return;
      }
      wrong++;
      fb.hidden = false;
      fb.className = "dp-feedback bad ewe-fb";
      fb.textContent = UI.notYet;
      hint.hidden = false;
      hint.innerHTML = `<span class="dp-hint-tag">💡 ${UI.hintTag}</span> ${hintHtml(step, r.why)}`;
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
    fb.innerHTML = `💡 ${UI.shown} ${ratioHtml(step.answer)}`;
    onDone({ firstTry: false, fill: step.answer });
  });
}

function hintHtml(step, why) {
  const h = step.hints;
  if (why === "par") return esc(h.par);
  if (why === "repeat") return esc(h.repeat);
  if (why === "whole") return esc(h.whole);
  /* the pattern hint: a sentence and a stacked-fraction template in words */
  const [top, bot] = h.pattern.template.map(esc);
  return `${esc(h.pattern.text)}<div class="ewe-template">${eqHtml(fracHtml(top, bot), fracHtml(top, bot))}</div>`;
}

/* ---------------- a pick step (reason, or yes / no) ---------------- */
function mountPick(host, step, onDone) {
  host.appendChild(el("p", "q-prompt ewe-prompt", esc(step.prompt)));
  const yesno = step.layout === "yesno";
  const opts = el("div", "q-options ewe-opts" + (yesno ? " yesno" : ""));
  const hint = el("div", "dp-hint ewe-hint"); hint.hidden = true;
  const fb = el("div", "dp-feedback ewe-fb"); fb.hidden = true;
  /* Ja / Nee keep their natural order; the reasons are shuffled so the
     right one is never "the top one" */
  const list = yesno ? step.options.slice() : shuffle(step.options);
  let wrong = 0, over = false;
  list.forEach(o => {
    const b = el("button", "opt ewe-opt", esc(o.text));
    b.type = "button";
    b.addEventListener("click", () => {
      if (over) return;
      if (o.correct) {
        over = true;
        b.classList.add("is-correct");
        opts.querySelectorAll("button").forEach(x => { x.disabled = true; });
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
  else body.innerHTML = writtenLineHtml(fill, q.write.reason);
  card.appendChild(body);
  if (q.write.tip) card.appendChild(el("p", "ewe-write-tip", esc(q.write.tip)));
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
        <p class="ewe-write-text">${esc(tk.text)}</p>
        <div class="ewe-write-body">${writtenLineHtml(tk.fill, tk.reason)}</div>
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
