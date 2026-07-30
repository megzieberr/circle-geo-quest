/* ============================================================
   INVESTIGATION STATION  🚂  (guided, and it PAYS XP)
   ------------------------------------------------------------
   A sibling of js/discover.js, not a replacement. Two differences,
   and they are the whole reason this file exists:

     1. IT AWARDS XP. Discovery rounds award zero (see discover.js
        finish()), and the cohort asked for XP. Rather than mutate
        discovery semantics — which would retroactively pay XP for
        11 existing rounds — this is a separate `investigate` kind.

     2. IT ACCEPTS TYPED ANSWERS. Every graded question in this app
        is a tap by design (js/questions.js: "No free-text entry
        anywhere"). That rule still holds there. The `written` panel
        below is the single exception, and it lives only here.

   XP IS PER PANEL, AND NEVER SCALED BY ATTEMPTS OR BY CORRECTNESS.
   The point of an investigation is to think it through, not to
   already know the answer — a learner who fights through five
   attempts per panel has investigated MORE than one who breezes it,
   and should not be paid less for it. Struggle is the product here.
   That half of the original flat-XP argument is untouched and must
   stay: per-PANEL is compatible with it, per-ATTEMPT is not.

   What changed (her call, 2026-07-30): the rate is per panel rather
   than a flat 50 for the station, so a seven-panel station pays more
   than a five-panel one. It is still banked ONCE, in finish(), as
   panels.length × CONFIG.investigationXpPerPanel — one reliable write,
   no partial-submission machinery — while a "+10 XP" tick in the
   header counts up as each panel is cleared so it FEELS per-panel.
   The tick is DISPLAY ONLY. Nothing is owed until finish() runs.

   THE NEVER-STUCK LADDER IS LOAD-BEARING. 3 wrong → escalating
   static hint, 5 wrong → show the answer and move on. That ladder is
   what makes an occasionally-wrong text checker safe: the worst a
   misgrade can cost is one extra attempt. It can never block anyone.

   Panel shapes: everything discover.js supports —
     explore | blank | choice | note
   plus:
     { type:"written", panelId, prompt, placeholder, minChars,
       needs?, starters?, hints:[…], memoDisplay, note?, reason? }
     { type:"predict", prompt, options:[{text, correct?, reaction?}],
       reactRight?, reactWrong?, after? }

   `needs` IS THE SHAPE OF THE ANSWER, NEVER ITS CONTENT (added
   2026-07-30 after Megan walked the line and got stuck on panels
   whose mathematics she knew cold). A typed panel asks for a written
   argument; without being told what the answer has to DO, a learner
   who understands the maths still cannot tell what is wanted, and
   reaches for the wrong half. So every typed panel now lists its
   moves — "say yes or no", "give one reason" — taken from the panel's
   mark scheme with the answers stripped out. Telling a learner the
   shape is scaffolding; telling them the content would be doing it
   for them, and the list must never cross that line.

   `predict` IS A GUESS, AND A GUESS IS NOT AN ANSWER (Megan's design,
   2026-07-30). Where a panel asks the learner to commit to a
   conclusion they have no way to investigate yet, marking it right or
   wrong is punishing a coin flip: three unlucky taps trip the hint
   ladder as though they were failing, and the miss lands in the
   admin attempt-trajectory numbers. So a predict panel accepts every
   option, says something back, and lets the NEXT panel do the reveal.
   It is deliberately NOT gated — nothing it does reaches the stats.

   OPTIONS ARE SHUFFLED (added 2026-07-30 — the correct one had been
   written first in 19 of 19 panels, so tapping the top one cleared the
   line without reading). The rules, the two opt-outs (`keepOrder` on a
   panel, `pin` on an option) and the authoring warning all live in
   js/options-order.js — read that before adding a choice panel, and
   run `node tools/audit-options.mjs` after.
   ============================================================ */
import { ROUND_BY_ID } from "./rounds/index.js";
import { submitRoundReliable } from "./sync.js";
import { getSession } from "./session.js";
import { CONFIG } from "./config.js";
import { t, tx, getLang, reason as reasonText, REASONS, word as wordText } from "./i18n.js";
import { el, clear, mount } from "./ui.js";
import { orderedOptions } from "./options-order.js";
import { mountInteractive } from "./interactive.js";
import { renderDiagram } from "./engine.js";
import { checkAnswer, reportStuck } from "./checker.js";

const HINT_AFTER = 3;
const REVEAL_AFTER = 5;

/* Chrome strings for the typed panel. Kept local rather than added to
   i18n.js — they exist only in this file and nothing else looks them up. */
const UI = {
  checking:    { en: "Checking…",                     af: "Kontroleer…" },
  sayMore:     { en: "Try saying a bit more than that.", af: "Probeer 'n bietjie meer sê as dit." },
  /* The "I don't get it" ladder. It never says the learner was right — it is a
     request for help, not a mark. The label changes as the ladder is walked, so
     a learner can see there is more behind it and knows the last rung gives an
     answer rather than leaving them hanging. */
  dontGetIt:   { en: "I don't get it",                af: "Ek snap dit nie" },
  stillStuck:  { en: "I still don't get it",          af: "Ek snap dit steeds nie" },
  showAnswer:  { en: "Show me a good answer",         af: "Wys my 'n goeie antwoord" },
  starters:    { en: "Stuck? Tap one to start:",      af: "Vasgevang? Tik een om te begin:" },
  writeMore:   { en: "Write a little more first",     af: "Skryf eers 'n bietjie meer" },
  memoLabel:   { en: "One good answer",               af: "Een goeie antwoord" },
  needsLabel:  { en: "Your answer needs to:",         af: "Jou antwoord moet:" },
  recordMore:  { en: "{n} recorded — stop at {min} or more different positions.",
                 af: "{n} aangeteken — stop by {min} of meer verskillende posisies." },
  recordEnough:{ en: "{n} readings recorded. Drag to a few more if you like, then carry on.",
                 af: "{n} lesings aangeteken. Sleep na 'n paar meer as jy wil, en gaan dan voort." },
  recordEmpty: { en: "Nothing recorded yet — drag a point and let go.",
                 af: "Nog niks aangeteken nie — sleep 'n punt en laat los." },
};

export function renderInvestigate(app, host, params) {
  const round = ROUND_BY_ID[params.roundId];
  if (!round) return app.go("home");
  const panels = round.panels || [];

  const prev = app.state?.progress?.[round.id];
  const alreadyDone = !!(prev && prev.passed);

  clear(host);
  const screen = el("div", "play discover investigate");
  screen.style.setProperty("--accent", round.accent);
  const top = el("div", "play-top");
  top.innerHTML = `<button class="link-btn quit">✕</button>
    <div class="play-title">🚂 ${tx(round.title)}</div>
    <div class="play-count"><span class="pc-n"></span><span class="pc-xp"></span></div>`;
  // ✕ goes back to the station map, not home — the learner came in off the
  // train strip, so that is the screen behind them.
  top.querySelector(".quit").addEventListener("click", () => app.go("stations"));
  const bar = el("div", "pbar"); bar.appendChild(el("i"));
  const stepHost = el("div", "discover-host");
  mount(screen, top, bar, stepHost);
  host.appendChild(screen);

  // Real first-try numbers, for the admin attempt-trajectory panel only.
  // api.js stores these as last_correct / last_total without scoring them,
  // so Megan keeps her struggle-vs-stuck signal while the learner is not
  // punished for having found it hard.
  let gatedTotal = 0;
  let firstTryCorrect = 0;

  /* Per-run scratch, shared by every panel of this station and thrown away when
     the learner leaves. It exists so a panel can hand something to a LATER
     panel — currently the readings the learner records by dragging (`record` /
     `showRecord` below). Nothing here is persisted or submitted: it is not
     progress, it is what happened on this screen just now. */
  const scratch = {};

  /* ---- the per-panel XP tick: DISPLAY ONLY ----
     It lives in the header, which survives the panel being torn down, so the
     learner sees "+10 XP" flash and then a running total that follows them
     down the station. Nothing is banked until finish() runs.

     It is hidden entirely on a REPLAY, because a replay pays 0 (`alreadyDone`
     below, and the server agrees). A "+10 XP" that banks nothing is exactly
     the promise-a-number-you-cannot-keep bug the panel copy rules forbid.

     The settle is a setTimeout, not an animation-end event: the preview pane
     never fires rAF, and the total must appear even where nothing animates. */
  const RATE = CONFIG.investigationXpPerPanel;
  const countN = top.querySelector(".pc-n");
  const countXp = top.querySelector(".pc-xp");
  let earned = 0;
  let bumpT = null;
  if (!alreadyDone) countXp.textContent = `★ 0 XP`;
  function tickXp() {
    if (alreadyDone) return;
    earned += RATE;
    countXp.textContent = `+${RATE} XP`;
    countXp.classList.add("bump");
    clearTimeout(bumpT);
    bumpT = setTimeout(() => {
      countXp.classList.remove("bump");
      countXp.textContent = `★ ${earned} XP`;
    }, 1100);
  }

  let i = 0;
  function show() {
    countN.textContent = `${i + 1} / ${panels.length}`;
    bar.querySelector("i").style.width = Math.round((i / panels.length) * 100) + "%";
    clear(stepHost);
    mountPanel(stepHost, panels[i], round.accent, scratch, (stats) => {
      if (stats && stats.gated) {
        gatedTotal++;
        if (stats.firstTry) firstTryCorrect++;
      }
      tickXp();
      i++;
      if (i < panels.length) { window.scrollTo(0, 0); show(); }
      else finish();
    });
  }

  async function finish() {
    bar.querySelector("i").style.width = "100%";
    // The one bank, computed from the panels that actually exist — so a station
    // that gains a panel in Chunk D pays for it without anyone editing a number.
    const xpEarned = panels.length * CONFIG.investigationXpPerPanel;
    let res = { ok: false };
    if (!alreadyDone) {
      const s = getSession();
      res = await submitRoundReliable(s.name, s.password, round.id, {
        // COMPLETING IS PASSING. XP is paid for finishing, so gating the badge
        // on CONFIG.passThreshold would be a contradiction — full XP and no
        // badge. Matches discover.js exactly.
        score: 1,
        xpGained: xpEarned,
        total: gatedTotal || panels.length,
        correct: firstTryCorrect,
      });
    }
    await app.refreshState();
    app.go("results", {
      roundId: round.id,
      discovery: true,
      correct: firstTryCorrect,
      total: gatedTotal || panels.length,
      xp: alreadyDone ? 0 : xpEarned,
      frac: 1,
      badgeEarned: !!(res && res.badgeEarned),
      alreadyPassed: alreadyDone,
    });
  }

  show();
}

/* ---------------- one panel ---------------- */
function mountPanel(host, panel, accent, scratch, onDone) {
  const root = el("div", "dp");
  root.style.setProperty("--accent", accent);
  // A prompt may be a FUNCTION of the scratch, so a panel can describe what the
  // learner actually did rather than what the author guessed they would do.
  // s1p4 uses it to count the recorded rows: the old prompt narrated "five
  // positions, three exactly double, one 2° out" over a table that did not
  // exist, and the numbers did not match the four rows that did (N4). A
  // sentence generated from the rows cannot disagree with them.
  if (panel.prompt) {
    const p = typeof panel.prompt === "function" ? panel.prompt(scratch) : panel.prompt;
    if (p) root.appendChild(el("p", "q-prompt", tx(p)));
  }

  let iv = null;
  if (panel.interactive) {
    const box = el("div", "q-diagram iv-box");
    root.appendChild(box);
    iv = mountInteractive(box, panel.interactive);
  } else if (panel.diagram) {
    const box = el("div", "q-diagram");
    box.innerHTML = renderDiagram(panel.diagram, accent);
    root.appendChild(box);
  }

  if (panel.diagrams) {
    const row = el("div", "dp-diagrams");
    panel.diagrams.forEach(d => {
      const card = el("div", "dp-mini");
      card.innerHTML = renderDiagram(d.diagram, d.accent || accent) + (d.caption ? `<div class="dp-mini-cap">${tx(d.caption)}</div>` : "");
      row.appendChild(card);
    });
    root.appendChild(row);
  }

  // A read-only copy of readings recorded on an EARLIER panel, shown as part of
  // the given material. Every later mention of "your table" used to be fiction.
  if (panel.showRecord) {
    const t2 = readingsTable(panel.showRecord);
    t2.render(scratch[panel.showRecord.key] || []);
    root.appendChild(t2.node);
  }

  // The worked solution the panel is asking about, ON THE SCREEN.
  if (panel.solution) root.appendChild(solutionBlock(panel.solution));

  const body = el("div", "dp-body");
  root.appendChild(body);
  const foot = el("div", "play-foot");
  const cont = el("button", "btn primary big", t("next"));
  foot.appendChild(cont);
  root.appendChild(foot);
  host.appendChild(root);

  let stats = { gated: false, firstTry: false };
  const advance = () => onDone(stats);

  if (panel.type === "explore") {
    if (panel.instruction) body.appendChild(el("p", "dp-instruction", "👉 " + tx(panel.instruction)));
    cont.textContent = t("continue");

    /* THE APP RECORDS THE LEARNER'S OWN READINGS (Megan, 2026-07-30: "can we
       have the app record their own readings please"). One row per position the
       learner STOPS at — that is why interactive.js gained onRelease, which
       fires when a drag ends rather than on every frame. The rows go into the
       station's scratch, and later panels show them with `showRecord`. */
    if (panel.record && iv) {
      const spec = panel.record;
      const rows = scratch[spec.key] = scratch[spec.key] || [];
      const min = spec.min ?? 3, max = spec.max ?? 6;
      const tbl = readingsTable(spec);
      body.appendChild(tbl.node);

      const counter = el("p", "dp-record-count");
      body.appendChild(counter);
      const paint = () => {
        tbl.render(rows);
        const done = rows.length >= min;
        counter.className = "dp-record-count" + (done ? " done" : "");
        counter.textContent = tx(done ? UI.recordEnough : UI.recordMore)
          .replace("{n}", rows.length).replace("{min}", min);
        cont.disabled = !done;
        cont.classList.toggle("waiting", !done);
      };

      panel.interactive.onRelease = wrap(panel.interactive.onRelease, (m) => {
        if (rows.length >= max) return;
        const r = spec.cols.map(c => c.from(m));
        // A release with no real movement is not a new position. Compared
        // against EVERY row, not just the last, so dragging back to a position
        // already in the table does not add it twice.
        if (rows.some(x => x.every((v, k) => v === r[k]))) return;
        rows.push(r);
        paint();
      });
      paint();
      iv.refresh();
    }

    if (panel.until && iv) {
      cont.disabled = true;
      cont.classList.add("waiting");
      const tick = (m) => { if (panel.until(m)) { cont.disabled = false; cont.classList.remove("waiting"); } };
      panel.interactive.onChange = wrap(panel.interactive.onChange, tick);
      iv.refresh();
    }
    cont.addEventListener("click", advance);
    return;
  }

  if (panel.type === "note") {
    body.appendChild(noteBlock(panel));
    cont.textContent = t("continue");
    cont.addEventListener("click", advance);
    return;
  }

  // ---- a prediction: every option is accepted, the next panel reveals ----
  // Sits ABOVE the gated section on purpose: `stats.gated` stays false, so a
  // guess never counts as an attempt and never reaches the trajectory numbers.
  if (panel.type === "predict") {
    const opts = el("div", "q-options predict");
    const react = el("div", "dp-feedback predict"); react.hidden = true;
    let locked = false;
    orderedOptions(panel).forEach(o => {
      const b = el("button", "opt", tx(o.text));
      b.addEventListener("click", () => {
        if (locked) return;
        locked = true;
        [...opts.children].forEach(x => { x.disabled = true; });
        b.classList.add("is-picked");
        react.hidden = false;
        const msg = o.reaction || (o.correct ? panel.reactRight : panel.reactWrong);
        react.textContent = msg ? tx(msg) : "";
        // `after` is the bridge into the next panel — the "let's go and look"
        // line. Never the answer: a predict panel must not spoil its own reveal,
        // which is why panel.note is deliberately NOT rendered here.
        if (panel.after) body.appendChild(el("p", "dp-after", tx(panel.after)));
        cont.hidden = false;
        cont.textContent = t("continue");
        cont.focus();
      });
      opts.appendChild(b);
    });
    body.appendChild(opts);
    body.appendChild(react);
    cont.hidden = true;
    cont.addEventListener("click", advance);
    return;
  }

  // ---- gated tasks: blank, choice, written ----
  stats.gated = true;
  cont.hidden = true;
  let wrong = 0;
  let revealAnswer = null;
  const hintBox = el("div", "dp-hint"); hintBox.hidden = true;
  const feedback = el("div", "dp-feedback"); feedback.hidden = true;

  function onWrong(customMsg) {
    wrong++;
    feedback.hidden = false;
    feedback.className = "dp-feedback bad";
    // The checker's nudge replaces the generic message when we have one.
    // textContent, never innerHTML — model output must stay inert.
    feedback.textContent = customMsg || (wrong < HINT_AFTER ? t("notQuiteTry") : t("notQuiteThink"));
    if (wrong >= HINT_AFTER) {
      const hints = panel.hints || [];
      const idx = Math.min(wrong - HINT_AFTER, hints.length - 1);
      if (hints.length) {
        hintBox.hidden = false;
        hintBox.innerHTML = `<span class="dp-hint-tag">💡 ${t("hint")}</span> ${tx(hints[idx])}`;
      }
    }
    if (wrong >= REVEAL_AFTER && revealAnswer) revealAnswer();
  }
  /* onRight is now only ever reached by a genuinely correct answer. The old
     `overridden` branch is gone with the "I think my answer was right" link it
     served: that link printed a pass over an answer nobody had marked, AND set
     firstTry on it, quietly inflating the numbers the admin trajectory panel
     reads. Its replacement ("I don't get it") never calls this function. */
  function onRight() {
    stats.firstTry = (wrong === 0);
    feedback.hidden = false;
    feedback.className = "dp-feedback good";
    feedback.textContent = "✓ " + t("youGotIt");
    if (panel.note || panel.reason) body.appendChild(noteBlock(panel));
    cont.hidden = false;
    cont.textContent = t("continue");
    cont.focus();
  }
  function showRevealed() {
    feedback.hidden = false;
    feedback.className = "dp-feedback revealed";
    feedback.textContent = "💡 " + t("hereIsAnswer");
    if (panel.note || panel.reason) body.appendChild(noteBlock(panel));
    cont.hidden = false;
    cont.textContent = t("continue");
    cont.focus();
  }

  if (panel.type === "blank") {
    const fill = mountBlanks(body, panel.sentence, () => check.disabled = !allFilled());
    const allFilled = fill.allFilled;
    const check = el("button", "btn primary", t("check"));
    check.disabled = true;
    body.appendChild(hintBox);
    body.appendChild(check);
    body.appendChild(feedback);
    let locked = false;
    check.addEventListener("click", () => {
      if (locked || !allFilled()) return;
      if (fill.correct()) { locked = true; fill.lock(true); check.disabled = true; check.hidden = true; onRight(); }
      else { fill.flagWrong(); onWrong(); }
    });
    revealAnswer = () => {
      if (locked) return;
      locked = true;
      fill.revealCorrect();
      check.disabled = true; check.hidden = true;
      showRevealed();
    };
  }

  else if (panel.type === "choice") {
    const opts = el("div", "q-options");
    let locked = false;
    // the shuffled order, kept so the reveal below can find the right button
    const list = orderedOptions(panel);
    list.forEach(o => {
      const b = el("button", "opt", tx(o.text));
      b.addEventListener("click", () => {
        if (locked) return;
        if (o.correct) { locked = true; b.classList.add("is-correct"); opts.querySelectorAll(".opt").forEach(x => x.disabled = true); onRight(); }
        else { b.classList.add("is-wrong"); b.disabled = true; onWrong(); }
      });
      opts.appendChild(b);
    });
    body.appendChild(opts);
    body.appendChild(hintBox);
    body.appendChild(feedback);
    revealAnswer = () => {
      if (locked) return;
      locked = true;
      [...opts.children].forEach((b, i) => { b.disabled = true; if (list[i].correct) b.classList.add("is-correct"); });
      showRevealed();
    };
  }

  // ---- the typed panel ----
  else if (panel.type === "written") {
    const minChars = panel.minChars ?? 15;
    let locked = false;

    const ta = el("textarea", "dp-written");
    ta.setAttribute("maxlength", "600");
    ta.setAttribute("rows", "4");
    ta.placeholder = panel.placeholder ? tx(panel.placeholder) : "";

    // What the answer has to DO. Read the header note before editing one of
    // these lists: it is the shape of the answer, never the answer.
    if (panel.needs?.length) {
      const card = el("div", "dp-needs");
      card.appendChild(el("div", "dp-needs-tag", tx(UI.needsLabel)));
      const list = el("ul", "dp-needs-list");
      panel.needs.forEach(n => list.appendChild(el("li", null, tx(n))));
      card.appendChild(list);
      body.appendChild(card);
    }

    // tap-to-insert sentence openers — they cut the blank-page problem for
    // weaker learners and cost nothing. ABOVE the box, with `needs`: both used
    // to sit underneath it, where a learner mid-answer never saw them.
    if (panel.starters?.length) {
      body.appendChild(el("p", "dp-starter-label", tx(UI.starters)));
      const row = el("div", "dp-starters");
      panel.starters.forEach(s => {
        const chip = el("button", "dp-starter", tx(s));
        chip.addEventListener("click", () => {
          if (locked) return;
          const text = tx(s);
          const at = ta.selectionStart ?? ta.value.length;
          ta.value = ta.value.slice(0, at) + text + ta.value.slice(ta.selectionEnd ?? at);
          ta.focus();
          ta.selectionStart = ta.selectionEnd = at + text.length;
          sync();
        });
        row.appendChild(chip);
      });
      body.appendChild(row);
    }

    body.appendChild(ta);

    const check = el("button", "btn primary", t("check"));
    check.disabled = true;
    check.title = tx(UI.writeMore);
    body.appendChild(hintBox);
    body.appendChild(check);
    body.appendChild(feedback);

    /* "I DON'T GET IT" — her design, 2026-07-30, replacing the old "I think my
       answer was right" hatch. That link let a learner mark their own work; this
       one lets them ASK FOR HELP, which is the thing they actually needed.

       It is available IMMEDIATELY, before any attempt. A learner who does not
       understand the question cannot produce three meaningful wrong answers
       first, and making them fail three times to earn a hint is a punishment for
       being lost. Each tap walks the same ladder a wrong answer would:
         tap 1 -> hint rung 1
         tap 2 -> hint rung 2
         tap 3 -> a good answer, and Continue
       and every tap is logged, so she gets "who asked for help, and where"
       rather than "who disputed a mark". Nothing here claims the learner was
       right, and nothing here touches stats.firstTry — asking is not answering.

       It costs no marking call: `reportStuck` posts above the cost cap and the
       hint renders without waiting for it. */
    const stuckBtn = el("button", "link-btn dp-stuck", tx(UI.dontGetIt));
    body.appendChild(stuckBtn);

    const sync = () => { check.disabled = ta.value.trim().length < minChars; };
    ta.addEventListener("input", sync);

    let stuckTaps = 0;
    stuckBtn.addEventListener("click", () => {
      if (locked) return;
      stuckTaps++;
      const hints = panel.hints || [];
      reportStuck({ panelId: panel.panelId, answer: ta.value.trim(), lang: getLang(), step: stuckTaps });
      if (stuckTaps <= hints.length) {
        hintBox.hidden = false;
        hintBox.innerHTML = `<span class="dp-hint-tag">💡 ${t("hint")}</span> ${tx(hints[stuckTaps - 1])}`;
        stuckBtn.textContent = stuckTaps < hints.length ? tx(UI.stillStuck) : tx(UI.showAnswer);
      } else {
        revealAnswer();
      }
    });

    check.addEventListener("click", async () => {
      if (locked) return;
      const answer = ta.value.trim();
      if (answer.length < minChars) return;

      check.disabled = true;
      ta.disabled = true;
      feedback.hidden = false;
      feedback.className = "dp-feedback checking";
      feedback.textContent = tx(UI.checking);

      const res = await checkAnswer({ panelId: panel.panelId, answer, lang: getLang() });

      // null = checker unavailable (offline, timeout, cost cap, no key).
      // Fall straight through to the static hint chain. No error screen,
      // no dead end, and no mention of the checker to the learner.
      if (!res) {
        ta.disabled = false;
        check.disabled = false;
        onWrong();
        return;
      }

      if (res.verdict === "got_it") {
        locked = true;
        check.hidden = true;
        onRight();
        return;
      }

      ta.disabled = false;
      check.disabled = false;
      // "unclear" gets the generic say-more prompt; partly / not_yet get the
      // model's nudge, which points at the gap without giving the answer.
      onWrong(res.verdict === "unclear" ? tx(UI.sayMore) : (res.nudge || undefined));
      ta.focus();
    });

    revealAnswer = () => {
      if (locked) return;
      locked = true;
      ta.disabled = true;
      check.hidden = true;
      stuckBtn.hidden = true;
      if (panel.memoDisplay) {
        const memo = el("div", "dp-memo");
        memo.appendChild(el("div", "dp-memo-tag", tx(UI.memoLabel)));
        memo.appendChild(el("div", "dp-memo-body", tx(panel.memoDisplay)));
        body.appendChild(memo);
      }
      showRevealed();
    };
  }

  cont.addEventListener("click", advance);
}

function wrap(orig, extra) { return (m, p, c) => { if (orig) orig(m, p, c); extra(m, p, c); }; }

/* ---------------- a worked solution, statement by statement ----------------
   Added 2026-07-30 for N12. Megan on inv4 panel 1: "and which part is left out
   exactly? again, this is vague." The panel said "a learner wrote this proof,
   but one line fell out — which line is missing?" and NO PROOF WAS RENDERED.
   The only route through was to reverse-engineer it out of the four options,
   and its own hint gave the intent away: "read the proof as a chain: 90° …
   then what? … then 40°" — there was no chain on screen to read.

   `solution: { caption?, lines: [...] }` where a line is
     { st, rs? }         a statement and its reason ("∠ACB = 90°", "∠s in semi-circle")
     { st, rs, bad:1 }   drawn as suspect — for "this reason is wrong" panels
     { blank: 1 }        a whole MISSING STATEMENT, drawn ______ with ( ? )
     { st, blankRs: 1 }  a statement whose REASON is missing, drawn ( ______ )
     { st, step }        `step` prints a "Step 1" label in the margin

   Statements are plain text, NOT html: they are content, and the ∠ / ° / −
   characters are literal. Every panel in Station 4 renders its solution this
   way now, so all three read alike — panels 2 and 3 used to smuggle theirs
   into the option list, which is why only panel 1 was unanswerable. */
function solutionBlock(spec) {
  const box = el("div", "dp-solution");
  if (spec.caption) box.appendChild(el("div", "dp-solution-cap", tx(spec.caption)));
  const list = el("div", "dp-solution-lines");
  (spec.lines || []).forEach(ln => {
    const row = el("div", "dp-sol-line"
      + (ln.blank ? " blank" : "") + (ln.blankRs ? " blank-rs" : "") + (ln.bad ? " bad" : ""));
    if (ln.step) row.appendChild(el("span", "dp-sol-step", tx(ln.step)));
    const st = el("span", "dp-sol-st");
    st.textContent = ln.blank ? " " : (ln.st || "");
    row.appendChild(st);
    const rs = el("span", "dp-sol-rs");
    // A missing STATEMENT shows ( ? ) where its reason would be. A statement
    // whose REASON is missing shows an empty bracket to write into. A line with
    // neither (the final answer) shows nothing at all.
    if (ln.blank) rs.textContent = "( ? )";
    else if (ln.blankRs) rs.textContent = "(      )";
    else if (ln.rs) rs.textContent = "(" + tx(ln.rs) + ")";
    row.appendChild(rs);
    list.appendChild(row);
  });
  box.appendChild(list);
  if (spec.footnote) box.appendChild(el("div", "dp-solution-foot", tx(spec.footnote)));
  return box;
}

/* ---------------- the readings table ----------------
   Shared by `record` (a panel that fills it in as the learner drags) and
   `showRecord` (a later panel that shows what they collected). The spec:

     cols   [{ label, from(measures), unit? }]   the recorded columns. The SAME
            array must be handed to record and to showRecord, so define it once
            in the round file — two copies would drift and the second panel
            would silently mislabel the first panel's numbers.
     extra  [{ label, of(row), unit? }]          columns DERIVED from a row, for
            a later panel only (e.g. "2 × ∠APB" once "double" has been taught).
     flag   (row) => boolean                     row gets the `off` class.
     caption / footnote                          copy above / below the table.  */
function readingsTable(spec) {
  const node = el("div", "dp-readings");
  if (spec.caption) node.appendChild(el("div", "dp-readings-cap", tx(spec.caption)));
  const table = el("table", "dp-readings-t");
  node.appendChild(table);
  if (spec.footnote) node.appendChild(el("div", "dp-readings-foot", tx(spec.footnote)));

  const extra = spec.extra || [];
  const cell = (v, c) => String(v) + (c.unit ?? "°");

  function render(rows) {
    table.replaceChildren();
    const head = el("tr");
    head.appendChild(el("th", "idx", "#"));
    [...spec.cols, ...extra].forEach(c => head.appendChild(el("th", null, tx(c.label))));
    table.appendChild(head);

    if (!rows.length) {
      const tr = el("tr", "empty");
      const td = el("td", null, tx(UI.recordEmpty));
      td.setAttribute("colspan", String(1 + spec.cols.length + extra.length));
      tr.appendChild(td);
      table.appendChild(tr);
      return;
    }
    rows.forEach((r, i) => {
      const tr = el("tr", spec.flag && spec.flag(r) ? "off" : null);
      tr.appendChild(el("td", "idx", String(i + 1)));
      spec.cols.forEach((c, k) => tr.appendChild(el("td", null, cell(r[k], c))));
      extra.forEach(c => tr.appendChild(el("td", "derived", cell(c.of(r), c))));
      table.appendChild(tr);
    });
  }
  return { node, render };
}

function noteBlock(panel) {
  const box = el("div", "dp-note");
  if (panel.reason) {
    const r = REASONS[panel.reason] ? reasonText(panel.reason) : panel.reason;
    box.appendChild(el("div", "dp-reason", `<span class="dp-reason-tag">${t("reasonLabel")}</span> <b>${r}</b>`));
  }
  if (panel.note) box.appendChild(el("div", "dp-note-body", tx(panel.note)));
  return box;
}

/* ---------------- blanks (word bank + number pad) ----------------
   Identical to discover.js. Deliberately duplicated rather than
   exported from there: discover.js is the frozen, shipped discovery
   engine for 11 live rounds, and this file must be free to change
   without any chance of touching them. */
function mountBlanks(host, sentence, onFill) {
  const line = el("p", "dp-sentence");
  const slots = [];
  let active = null;

  function selectSlot(s) {
    active = s;
    slots.forEach(x => x.node.classList.toggle("active", x === s));
    renderInput();
  }

  sentence.forEach(part => {
    if (typeof part === "string") { line.appendChild(document.createTextNode(part)); return; }
    if (!part.kind) { line.appendChild(document.createTextNode(tx(part))); return; }
    const node = el("button", "dp-slot empty");
    node.textContent = "?";
    const slot = { def: part, node, value: null };
    node.addEventListener("click", () => { if (!locked) selectSlot(slot); });
    slots.push(slot);
    line.appendChild(node);
  });
  host.appendChild(line);

  const input = el("div", "dp-input");
  host.appendChild(input);
  let locked = false;

  function renderInput() {
    input.replaceChildren();
    if (!active) { input.appendChild(el("p", "dp-input-hint", t("tapBlank"))); return; }
    if (active.def.kind === "num") {
      const pad = el("div", "numpad");
      let buf = (active.value != null ? String(active.value) : "");
      const disp = el("div", "numpad-disp", buf || "0");
      const keys = ["1","2","3","4","5","6","7","8","9","⌫","0","✓"];
      const grid = el("div", "numpad-grid");
      keys.forEach(k => {
        const b = el("button", "numkey" + (k === "✓" ? " ok" : k === "⌫" ? " del" : ""), k);
        b.addEventListener("click", () => {
          if (k === "⌫") buf = buf.slice(0, -1);
          else if (k === "✓") { setValue(active, buf === "" ? null : Number(buf)); return; }
          else if (buf.length < 4) buf += k;
          disp.textContent = buf || "0";
          setValue(active, buf === "" ? null : Number(buf));
        });
        grid.appendChild(b);
      });
      pad.appendChild(disp); pad.appendChild(grid);
      input.appendChild(pad);
    } else {
      const lbl = id => active.def.kind === "reason" ? reasonText(id) : wordText(id);
      const bank = el("div", "wordbank" + (active.def.kind === "reason" ? " reasons" : ""));
      active.def.options.forEach(id => {
        const b = el("button", "wordchip" + (active.value === id ? " picked" : ""), lbl(id));
        b.addEventListener("click", () => { setValue(active, id, lbl(id)); bank.querySelectorAll(".wordchip").forEach(x => x.classList.remove("picked")); b.classList.add("picked"); });
        bank.appendChild(b);
      });
      input.appendChild(bank);
    }
  }

  function setValue(s, v, label) {
    s.value = v;
    s.node.textContent = v == null ? "?" : (s.def.kind === "num" ? (v + (s.def.unit || "")) : (label ?? wordText(v)));
    s.node.classList.toggle("empty", v == null);
    s.node.classList.remove("wrong");
    onFill();
  }

  renderInput();
  if (slots.length) selectSlot(slots[0]);

  const isRight = s => s.def.kind === "num"
    ? Number(s.value) === Number(s.def.answer)
    : [s.def.answer, ...(s.def.accept || [])].includes(s.value);
  return {
    allFilled: () => slots.every(s => s.value != null && s.value !== ""),
    correct: () => slots.every(isRight),
    flagWrong: () => slots.forEach(s => { if (!isRight(s)) s.node.classList.add("wrong"); }),
    lock: () => { locked = true; slots.forEach(s => s.node.classList.add("done")); active = null; input.replaceChildren(); },
    revealCorrect: () => {
      slots.forEach(s => {
        const ans = s.def.answer;
        const label = s.def.kind === "num" ? undefined : (s.def.kind === "reason" ? reasonText(ans) : wordText(ans));
        setValue(s, ans, label);
        s.node.classList.remove("wrong");
        s.node.classList.add("done", "revealed");
      });
      locked = true; active = null; input.replaceChildren();
    },
  };
}
