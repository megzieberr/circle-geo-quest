/* Game screens: the progress map (home), the play loop, and results. */
import { ROUNDS, ROUND_BY_ID } from "./rounds/index.js";
import { CONFIG, GROUPS } from "./config.js";
import { api } from "./api.js";
import { getSession } from "./session.js";
import { t, tx, reason } from "./i18n.js";
import { el, clear, mount, progressBar, shuffled, toast } from "./ui.js";
import { mountQuestion } from "./questions.js";
import { addMistake, clearMistake, mistakeCount } from "./mistakes.js";
import { getDaily, dailyUnlocked, isDoneToday } from "./daily.js";
import { maybeShowWeekly } from "./weekly.js";
import { pushState, enablePush, disablePush } from "./push.js";
import { installEntryButton, maybeShowInstallPopup } from "./install.js";

/* which screen a round plays on */
function screenFor(round) {
  if (round.kind === "cutscene") return "cutscene";
  if (round.kind === "discover") return "discover";
  return "play";
}
const isLearningRound = r => r.kind === "cutscene" || r.kind === "discover";

/* which rounds are unlocked: round 1 always, others when the previous passed */
function unlockedSet(progress) {
  const set = new Set([ROUNDS[0].id]);
  for (let i = 1; i < ROUNDS.length; i++) {
    if (progress[ROUNDS[i - 1].id] && progress[ROUNDS[i - 1].id].passed) set.add(ROUNDS[i].id);
  }
  return set;
}

/* the next round to play: the first unlocked round not yet passed (i.e. where
   the learner should continue). Null only when every unlocked round is done. */
function nextRoundToPlay(progress) {
  const unlocked = unlockedSet(progress);
  for (const r of ROUNDS) {
    if (unlocked.has(r.id) && !(progress[r.id] && progress[r.id].passed)) return r;
  }
  return null;
}

/* badge groups: each group's rounds, how many passed, and whether earned */
function groupStatus(progress) {
  return GROUPS.map(group => {
    const rounds = ROUNDS.filter(r => r.group === group.id);
    const passed = rounds.filter(r => progress[r.id] && progress[r.id].passed).length;
    const total = rounds.length;
    return { ...group, passed, total, available: total > 0, earned: total > 0 && passed === total };
  });
}

/* ---------------- HOME / PROGRESS MAP ---------------- */
export function renderHome(app, host) {
  clear(host);
  const st = app.state;
  const progress = st.progress || {};
  const unlocked = unlockedSet(progress);
  const groups = groupStatus(progress);
  const badgesEarned = groups.filter(g => g.earned).length;

  const head = el("div", "home-head");
  head.innerHTML = `
    <span class="eyebrow">${t("yourQuest")}</span>
    <h1>${tx({ en: "Hi", af: "Hallo" })}, ${st.student.name.split(" ")[0]} 👋</h1>`;
  const stats = el("div", "home-stats");
  stats.appendChild(el("div", "hstat", `<b>${st.totalXp}</b><span>${t("totalXp")}</span>`));
  stats.appendChild(el("div", "hstat", `<b>${badgesEarned}/${GROUPS.length}</b><span>${t("badges")}</span>`));
  if (st.rank) stats.appendChild(el("div", "hstat", `<b>#${st.rank}</b><span>${t("rank")}</span>`));
  const lb = el("button", "btn ghost", "🏆 " + t("leaderboard"));
  lb.addEventListener("click", () => app.go("leaderboard"));
  stats.appendChild(lb);
  head.appendChild(stats);
  host.appendChild(head);

  // "Continue your quest" — a one-tap jump to the current round, right at the
  // top, so a learner never has to scroll the map to find where they're up to.
  const nextR = nextRoundToPlay(progress);
  if (nextR) {
    const anyDone = ROUNDS.some(r => progress[r.id] && progress[r.id].passed);
    const cont = el("div", "card continue-card");
    cont.style.setProperty("--accent", nextR.accent);
    cont.innerHTML = `
      <div class="cont-body">
        <span class="eyebrow">${anyDone ? t("continueQuest") : t("startHere")}</span>
        <h3>${nextR.n}. ${tx(nextR.title)}</h3>
      </div>
      <div class="cont-foot"></div>`;
    const go = el("button", "btn primary", "▶ " + (anyDone ? t("resume") : t("start")));
    go.addEventListener("click", () => app.go(screenFor(nextR), { roundId: nextR.id }));
    cont.querySelector(".cont-foot").appendChild(go);
    host.appendChild(cont);
  }

  const ladder = renderRankLadder(progress);
  if (ladder) host.appendChild(ladder);            // hidden until the first badge is earned

  // Daily Challenge + Fix-My-Mistakes — the two "come back and practise" hooks
  host.appendChild(renderPracticeStrip(app));

  // "Turn on daily reminders" — only appears once notifications are usable
  // (configured + a supported browser; hidden in a plain iPhone Safari tab).
  host.appendChild(remindersCard(app));

  // "How to install" entry — hidden once the app is already installed
  const installBtn = installEntryButton(app);
  if (installBtn) { const row = el("div", "install-entry-row"); row.appendChild(installBtn); host.appendChild(row); }

  // Adventure (Grand Master bonus) — only shown once every badge is earned, so
  // the locked teaser never pushes the rounds down for a beginner.
  const isGM = GROUPS.length > 0 && badgesEarned === GROUPS.length;
  if (isGM) {
    const advBanner = el("div", "card adventure-banner");
    advBanner.innerHTML = `
      <div class="adv-bn-icon">🗺️</div>
      <div class="adv-bn-text">
        <span class="eyebrow">${t("grandMasterArena")}</span>
        <h3>${t("adventures")}</h3>
        <p class="muted small">${t("adventuresBlurb")}</p>
      </div>
      <div class="adv-bn-foot"></div>`;
    const go = el("button", "btn primary", "▶ " + t("play"));
    go.addEventListener("click", () => app.go("adventures"));
    advBanner.querySelector(".adv-bn-foot").appendChild(go);
    host.appendChild(advBanner);
  }

  const grid = el("div", "round-grid");
  // Only unlocked rounds appear — locked ones stay hidden so the map is short
  // and the learner's current spot is easy to find (the Continue card jumps here).
  ROUNDS.filter(r => unlocked.has(r.id)).forEach(r => {
    const p = progress[r.id];
    const isUnlocked = true;
    const passed = !!(p && p.passed);
    const learn = isLearningRound(r);
    const isCurrent = !!(nextR && r.id === nextR.id);
    const card = el("article", "round-card" + (passed ? " done" : "") + (learn ? " learn" : "") + (isCurrent ? " current" : ""));
    card.style.setProperty("--accent", r.accent);
    const best = p ? Math.round(p.best_score * 100) : 0;
    const kindTag = r.kind === "cutscene" ? `<span class="rc-kind">▶ ${t("watch")}</span>`
                  : r.kind === "discover" ? `<span class="rc-kind">🔭 ${t("discover")}</span>` : "";
    card.innerHTML = `
      <div class="rc-top">
        <span class="rc-num">${r.n}</span>
        ${passed ? '<span class="rc-badge" title="Done">✓</span>' : (isUnlocked ? "" : '<span class="rc-lock">🔒</span>')}
      </div>
      ${kindTag}
      <h3>${tx(r.title)}</h3>
      <p>${tx(r.blurb)}</p>
      <div class="rc-foot"></div>`;
    if (isCurrent) card.querySelector(".rc-top").appendChild(el("span", "rc-next-tag", t("upNext")));
    const foot = card.querySelector(".rc-foot");
    if (isUnlocked) {
      if (!learn && p && p.attempts) foot.appendChild(el("span", "rc-best", `${t("bestScore")} ${best}%`));
      const label = learn
        ? (passed ? t("replay") : (r.kind === "cutscene" ? t("watch") : t("explore")))
        : (p && p.attempts ? t("replay") : t("play"));
      const play = el("button", "btn primary small", label);
      play.addEventListener("click", () => app.go(screenFor(r), { roundId: r.id }));
      foot.appendChild(play);
    } else {
      foot.appendChild(el("span", "muted small", t("passPrev")));
    }
    grid.appendChild(card);
  });
  host.appendChild(grid);

  // gentle reassurance that the journey continues (without a wall of locked cards)
  if (ROUNDS.some(r => !unlocked.has(r.id))) host.appendChild(el("p", "more-rounds muted small center", t("moreToCome")));

  // First-login nudge to install the app (one-time, hidden if already installed).
  try { maybeShowInstallPopup(app); } catch { /* non-critical */ }

  // Star-of-the-Week: Fri–Sun rally / Mon–Tue crown. No-ops off-day or if already seen.
  // Never let a popup glitch blank the home screen.
  try { maybeShowWeekly(app); } catch { /* non-critical */ }
}

/* the badge ladder: only the badges the learner has actually EARNED — locked
   ones stay hidden so a beginner isn't faced with a wall of them and can find
   where to start. Returns null until the first badge is unlocked. */
function renderRankLadder(progress) {
  const earned = groupStatus(progress).filter(g => g.earned);
  if (!earned.length) return null;
  const rank = earned[earned.length - 1];
  const card = el("div", "card rank-card");
  card.innerHTML = `<div class="rank-head"><span class="eyebrow">${t("rankLabel")}</span><h3>${rank.icon} ${rank.name}</h3></div>`;
  const row = el("div", "rank-row");
  earned.forEach(g => {
    const item = el("div", "rank-tier earned");
    item.innerHTML = `<div class="rank-icon">${g.icon}</div><div class="rank-name">${g.name}</div><div class="rank-foot"><span class="rank-done">✓ ${t("rankEarned")}</span></div>`;
    item.title = tx(g.blurb);
    row.appendChild(item);
  });
  card.appendChild(row);
  return card;
}

/* the two daily-habit hooks: the Daily Challenge streak + the Fix pile */
function renderPracticeStrip(app) {
  const strip = el("div", "practice-strip");
  strip.appendChild(dailyCard(app));
  strip.appendChild(fixCard(app));
  return strip;
}

function dailyCard(app) {
  const unlocked = dailyUnlocked(app);
  const done = unlocked && isDoneToday(app);
  const streak = (getDaily(app).streak) || 0;
  const card = el("div", "card practice-card daily-pc" + (done ? " done" : "") + (unlocked ? "" : " locked"));
  const icon = streak > 0 ? `🔥<span class="pc-streak">${streak}</span>` : "📅";
  card.innerHTML = `
    <div class="pc-icon">${icon}</div>
    <div class="pc-body">
      <span class="eyebrow">${t("dailyChallenge")}</span>
      <p class="muted small">${!unlocked ? t("dailyLocked") : (done ? t("dailyDoneToday") : t("dailyBlurb"))}</p>
    </div>
    <div class="pc-foot"></div>`;
  const foot = card.querySelector(".pc-foot");
  if (unlocked && !done) {
    const b = el("button", "btn primary small", "▶ " + t("dailyStart"));
    b.addEventListener("click", () => app.go("daily"));
    foot.appendChild(b);
  } else if (done) {
    foot.appendChild(el("span", "pc-streaknote", `🔥 ${streak} ${t("dayStreak")}`));
  } else {
    foot.appendChild(el("span", "rc-lock", "🔒"));
  }
  return card;
}

function fixCard(app) {
  const n = mistakeCount(app);
  const card = el("div", "card practice-card fix-pc" + (n ? "" : " calm"));
  card.innerHTML = `
    <div class="pc-icon">🩹${n ? `<span class="pc-streak warn">${n}</span>` : ""}</div>
    <div class="pc-body">
      <span class="eyebrow">${t("fixMistakes")}</span>
      <p class="muted small">${n ? t("fixCardBlurb") : t("fixNone")}</p>
    </div>
    <div class="pc-foot"></div>`;
  const foot = card.querySelector(".pc-foot");
  if (n) {
    const b = el("button", "btn primary small", `${t("fixStart")} (${n})`);
    b.addEventListener("click", () => app.go("fix"));
    foot.appendChild(b);
  } else {
    foot.appendChild(el("span", "pc-streaknote", "✓"));
  }
  return card;
}

/* The opt-in daily-reminder card. Self-hides unless push is usable on this
   device (configured VAPID key + a supporting browser; in an iPhone Safari
   tab PushManager is absent, so it stays hidden until the app is installed). */
function remindersCard(app) {
  const card = el("div", "card reminders-card");
  card.hidden = true;                       // revealed by paint() only when usable
  card.innerHTML = `
    <div class="pc-icon">🔔</div>
    <div class="rc2-body">
      <span class="eyebrow">${t("remindTitle")}</span>
      <p class="muted small rc2-status">${t("remindBlurb")}</p>
    </div>
    <div class="rc2-foot"></div>`;
  const statusEl = card.querySelector(".rc2-status");
  const foot = card.querySelector(".rc2-foot");

  async function paint() {
    const st = await pushState();
    if (st === "unsupported" || st === "unconfigured") { card.hidden = true; return; }
    card.hidden = false;
    foot.innerHTML = "";
    card.classList.toggle("on", st === "on");
    if (st === "on") {
      statusEl.textContent = "🔔 " + t("remindOn");
      const off = el("button", "btn ghost small", t("remindTurnOff"));
      off.addEventListener("click", async () => {
        const s = getSession();
        off.disabled = true;
        await disablePush(s.name, s.password);
        paint();
      });
      foot.appendChild(off);
    } else if (st === "blocked") {
      statusEl.textContent = t("remindBlocked");
    } else {                                 // "off" — can ask
      statusEl.textContent = t("remindBlurb");
      const on = el("button", "btn primary small", t("remindEnable"));
      on.addEventListener("click", async () => {
        const s = getSession();
        on.disabled = true; on.textContent = t("remindAsking");
        const r = await enablePush(s.name, s.password);
        if (!r.ok && r.reason !== "denied" && r.reason !== "default") {
          statusEl.textContent = t("remindFail");
        }
        paint();                             // reflect the real resulting state
      });
      foot.appendChild(on);
    }
  }
  paint();
  return card;
}

/* ---------------- PLAY LOOP (graded exercise rounds) ---------------- */
export function renderPlay(app, host, params) {
  const round = ROUND_BY_ID[params.roundId];
  if (!round) return app.go("home");

  // anti-farming: once a round is passed, replays award no XP (badge already won).
  const prev = (app.state && app.state.progress) ? app.state.progress[round.id] : null;
  const alreadyPassed = !!(prev && prev.passed);

  const n = round.questionsPerPlay || round.questions.length;
  const set = shuffled(round.questions).slice(0, n).map(q => {
    const copy = { ...q };
    if (q.options) copy.options = shuffled(q.options);
    if (q.tap) copy.tap = { ...q.tap, targets: shuffled(q.tap.targets) };
    return copy;
  });

  const state = { i: 0, correct: 0, score: 0, xp: 0, streak: 0, total: set.length };
  const items = [];   // per-question results for the teacher's item-analytics report

  clear(host);
  const screen = el("div", "play");
  screen.style.setProperty("--accent", round.accent);
  const top = el("div", "play-top");
  top.innerHTML = `<button class="link-btn quit">✕</button>
    <div class="play-title">${round.n}. ${tx(round.title)}</div>
    <div class="play-count"></div>`;
  top.querySelector(".quit").addEventListener("click", () => app.go("home"));
  const bar = progressBar(0);
  const qhost = el("div", "q-host");
  const footer = el("div", "play-foot");
  const xpline = el("div", "xp-pop");
  const next = el("button", "btn primary big next", t("next"));
  next.hidden = true;
  footer.appendChild(xpline); footer.appendChild(next);
  mount(screen, top, bar, qhost, footer);
  if (alreadyPassed) screen.insertBefore(el("div", "card replay-note", "🔁 " + t("replayNoXp")), qhost);
  host.appendChild(screen);

  function showQuestion() {
    const q = set[state.i];
    top.querySelector(".play-count").textContent = `${t("question")} ${state.i + 1} ${t("of")} ${state.total}`;
    bar.querySelector("i").style.width = Math.round((state.i / state.total) * 100) + "%";
    next.hidden = true;
    xpline.textContent = "";
    xpline.className = "xp-pop";

    mountQuestion(qhost, q, (isCorrect, qScore, chosen) => {
      const score = (qScore != null) ? qScore : (isCorrect ? 1 : 0);
      state.score += score;
      // remember misses for the Fix-My-Mistakes pile; a clean correct clears it
      if (isCorrect) clearMistake(app, q.id);
      else if (score === 0) addMistake(app, q.id, round.id);
      // record this question's result for the teacher item-analytics report
      // (firstTry = a genuine first-pass attempt, not a replay of a passed round)
      items.push({ qid: q.id, correct: isCorrect, firstTry: !alreadyPassed, chosen: isCorrect ? null : (chosen || null) });
      let gained = 0;
      const lines = [];
      if (isCorrect) {
        state.correct++;
        state.streak++;
        if (!alreadyPassed) {
          gained += CONFIG.xpPerCorrect; lines.push(`+${CONFIG.xpPerCorrect} ${t("correct").replace("!", "")}`);
          gained += CONFIG.firstTryBonus; lines.push(`+${CONFIG.firstTryBonus} ${t("firstTry")}`);
          const sb = CONFIG.streakStep * Math.min(state.streak - 1, CONFIG.streakCap);
          if (sb > 0) { gained += sb; lines.push(`+${sb} ${t("streak")} ×${state.streak}`); }
        } else {
          lines.push("✓ " + t("correct"));
        }
        xpline.classList.add("good");
      } else if (score > 0) {
        state.streak = 0;
        if (!alreadyPassed) {
          gained += Math.round(CONFIG.xpPerCorrect * score);
          lines.push(`+${gained} · ${Math.round(score * 100)}%`);
        } else {
          lines.push(`${Math.round(score * 100)}%`);
        }
        xpline.classList.add("good");
      } else {
        state.streak = 0;
        xpline.classList.add("bad");
        lines.push(t("notQuite"));
      }
      state.xp += gained;
      xpline.textContent = lines.join("   ");
      next.hidden = false;
      next.textContent = state.i + 1 < state.total ? t("next") : t("finish");
      next.focus();
    });
  }

  next.addEventListener("click", async () => {
    state.i++;
    if (state.i < state.total) showQuestion();
    else {
      next.disabled = true;
      const frac = state.total ? state.score / state.total : 0;
      const sess = getSession();
      let res = { ok: false };
      try {
        res = await api.submitRound(sess.name, sess.password, round.id, {
          score: frac, xpGained: state.xp, total: state.total, correct: state.correct,
        });
      } catch { /* offline — still show local results */ }
      try { await api.logItems(sess.name, sess.password, round.id, items); } catch { /* analytics is best-effort */ }
      await app.refreshState();
      app.go("results", { roundId: round.id, correct: state.correct, total: state.total, xp: state.xp, frac, badgeEarned: !!(res && res.badgeEarned), alreadyPassed });
    }
  });

  showQuestion();
}

/* ---------------- RESULTS ---------------- */
export function renderResults(app, host, params) {
  const round = ROUND_BY_ID[params.roundId];
  if (!round) return app.go("home");
  clear(host);
  const screen = el("div", "results");
  screen.style.setProperty("--accent", round.accent);

  // did this completion finish a whole group (earn a badge)?
  const group = groupStatus(app.state.progress || {}).find(g => g.id === round.group);
  const groupEarned = params.badgeEarned && group && group.earned;
  const groupPop = groupEarned
    ? `<div class="rank-pop">${group.icon} ${t("badgeEarned")}<br><b>${group.name}</b></div>` : "";

  if (params.discovery) {
    // learning round (cutscene / discovery): no score, no XP
    const isCut = round.kind === "cutscene";
    screen.innerHTML = `
      <div class="result-card card">
        <div class="result-emoji">${isCut ? "🎬" : "🔭"}</div>
        <h1>${isCut ? t("introDone") : t("discoverComplete")}</h1>
        <p class="muted">${tx(round.title)}</p>
        <div class="result-msg good">${params.alreadyPassed ? t("replayNoXpMsg") : t("discoverUnlocked")}</div>
        ${groupPop}
        <div class="result-actions"></div>
      </div>`;
  } else {
    const frac = (params.frac != null) ? params.frac : (params.total ? params.correct / params.total : 0);
    const passed = frac >= CONFIG.passThreshold;
    const pct = Math.round(frac * 100);
    screen.innerHTML = `
      <div class="result-card card">
        <div class="result-emoji">${passed ? "🎉" : "💪"}</div>
        <h1>${t("roundComplete")}</h1>
        <div class="big-score">${pct}%</div>
        <p class="muted">${t("youScored")} ${params.correct}/${params.total}</p>
        <div class="result-pills"><span class="pill xp">★ +${params.xp} ${t("xpEarned")}</span></div>
        <div class="result-msg ${passed ? "good" : "warn"}">${passed ? t("roundPassed") : t("notPassedYet")}</div>
        ${params.alreadyPassed ? `<div class="result-msg note">🔁 ${t("replayNoXpMsg")}</div>` : ""}
        ${groupPop}
        <div class="result-actions"></div>
      </div>`;
  }

  // was this round passed (so the next round is unlocked)? if so, offer a
  // straight "Go to next round" so they don't have to hunt for it on the map.
  const frac = (params.frac != null) ? params.frac : (params.total ? params.correct / params.total : 0);
  const passed = params.discovery || params.alreadyPassed || frac >= CONFIG.passThreshold;
  const ridx = ROUNDS.findIndex(x => x.id === round.id);
  const nextRound = (ridx >= 0 && ridx + 1 < ROUNDS.length) ? ROUNDS[ridx + 1] : null;
  const showNext = passed && !!nextRound;

  const actions = screen.querySelector(".result-actions");
  const mkBtn = (label, primary, fn) => { const b = el("button", "btn " + (primary ? "primary" : "ghost"), label); b.addEventListener("click", fn); actions.appendChild(b); };
  const goNext = () => app.go(screenFor(nextRound), { roundId: nextRound.id });
  const goHome = () => app.go("home");
  const goRetry = () => app.go(screenFor(round), { roundId: round.id });
  if (showNext) {
    mkBtn(t("nextRound"), true, goNext);
    mkBtn(t("backHome"), false, goHome);
    if (!params.discovery) mkBtn(t("tryAgain"), false, goRetry);
  } else if (!params.discovery && !passed) {
    mkBtn(t("tryAgain"), true, goRetry);          // failed exercise — retry is the main action
    mkBtn(t("backHome"), false, goHome);
  } else {
    mkBtn(t("backHome"), true, goHome);            // last round, nothing after
    if (!params.discovery) mkBtn(t("tryAgain"), false, goRetry);
  }
  host.appendChild(screen);

  if (groupEarned) toast(`${group.icon} ${t("badgeEarned")} ${group.name}`);
}
