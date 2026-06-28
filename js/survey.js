/* ============================================================
   ANONYMOUS END-OF-GAME FEEDBACK SURVEY
   ------------------------------------------------------------
   One question — pick a face (crying → heart-eyes) — plus an
   optional written note. Answers are ANONYMOUS: the backend
   authenticates the learner only to gate access and to let them
   edit their own answer, but the teacher dashboard never sees who
   said what (see supabase/phase6.sql).

   Three surfaces, all sharing one form:
     • renderSurvey(app, host)     — a full page (the home card opens this)
     • maybeShowSurveyPopup(app)   — a one-time popup after the final round
     • feedbackCard(app)           — the permanent home-screen card
   ============================================================ */
import { t, tx } from "./i18n.js";
import { el, clear, toast } from "./ui.js";
import { api } from "./api.js";
import { getSession } from "./session.js";

/* crying · sad · neutral · smiling · excited (heart-eyes) */
export const FACES = [
  { v: 1, emoji: "😭", key: "face1" },
  { v: 2, emoji: "🙁", key: "face2" },
  { v: 3, emoji: "😐", key: "face3" },
  { v: 4, emoji: "🙂", key: "face4" },
  { v: 5, emoji: "😍", key: "face5" },
];

/* Per-learner "already gave feedback" flag — drives the card state and stops
   the post-final popup from ever nagging twice. Stored locally; the real
   dedupe lives server-side (a learner editing just overwrites their own row). */
const sid = app => (app.state && app.state.student && app.state.student.id) || "anon";
export function hasGivenFeedback(app) {
  try { return localStorage.getItem("cgg.surveyDone." + sid(app)) === "1"; } catch { return false; }
}
function markGiven(app) { try { localStorage.setItem("cgg.surveyDone." + sid(app), "1"); } catch { /* ignore */ } }

/* ------------------------------------------------------------
   The shared form: face picker + optional note + submit. Calls
   onDone() after a successful send. `prefill` pre-selects the
   learner's previous answer when they come back to change it. */
function buildSurveyForm(app, { onDone, prefill }) {
  const wrap = el("div", "survey-form");
  let chosen = prefill && prefill.rating ? prefill.rating : null;

  wrap.appendChild(el("p", "survey-anon", "🔒 " + t("surveyAnon")));
  wrap.appendChild(el("p", "survey-pick muted small", t("surveyPickFace")));

  const faces = el("div", "face-row");
  const buttons = [];
  FACES.forEach(f => {
    const b = el("button", "face-btn" + (chosen === f.v ? " on" : ""), `<span class="face-emoji">${f.emoji}</span><span class="face-label">${t(f.key)}</span>`);
    b.type = "button";
    b.setAttribute("aria-label", t(f.key));
    b.addEventListener("click", () => {
      chosen = f.v;
      buttons.forEach(x => x.classList.toggle("on", x === b));
      err.hidden = true;
    });
    buttons.push(b);
    faces.appendChild(b);
  });
  wrap.appendChild(faces);

  const lab = el("label", "survey-write");
  lab.innerHTML = `<span class="survey-write-label">${t("surveyWriteLabel")}</span>`;
  const ta = el("textarea", "survey-text");
  ta.rows = 4;
  ta.maxLength = 1000;
  ta.placeholder = t("surveyPlaceholder");
  if (prefill && prefill.comment) ta.value = prefill.comment;
  lab.appendChild(ta);
  wrap.appendChild(lab);

  const err = el("p", "err"); err.hidden = true;
  wrap.appendChild(err);

  const submit = el("button", "btn primary big", t("surveySubmit"));
  submit.addEventListener("click", async () => {
    if (!chosen) { err.textContent = t("surveyPickFirst"); err.hidden = false; return; }
    submit.disabled = true; submit.textContent = t("surveySending");
    const s = getSession();
    let ok = false;
    try {
      const r = await api.submitFeedback(s.name, s.password, chosen, ta.value.trim());
      ok = !!(r && r.ok);
    } catch { ok = false; }
    if (!ok) {
      err.textContent = t("surveyFail"); err.hidden = false;
      submit.disabled = false; submit.textContent = t("surveySubmit");
      return;
    }
    markGiven(app);
    onDone();
  });
  wrap.appendChild(submit);
  return wrap;
}

/* fetch the learner's own previous answer (so "change my answer" pre-fills);
   best-effort — a failure just means a blank form. */
async function loadMine() {
  try {
    const s = getSession();
    const r = await api.getMyFeedback(s.name, s.password);
    return (r && r.ok && r.rating) ? { rating: r.rating, comment: r.comment || "" } : null;
  } catch { return null; }
}

/* ---------------- FULL PAGE ---------------- */
export async function renderSurvey(app, host) {
  clear(host);
  const screen = el("div", "survey-screen");
  const back = el("button", "link-btn", "← " + t("back"));
  back.addEventListener("click", () => app.go("home"));
  screen.appendChild(back);

  const head = el("div", "survey-head");
  head.innerHTML = `<div class="survey-icon">💬</div><h1>${t("surveyTitle")}</h1>`;
  screen.appendChild(head);

  const card = el("div", "card survey-card");
  card.appendChild(el("p", "muted center", t("loading")));
  screen.appendChild(card);
  host.appendChild(screen);

  const prefill = await loadMine();
  clear(card);
  const showThanks = () => {
    clear(card);
    card.appendChild(el("div", "survey-thanks", `<div class="survey-icon">💛</div><h2>${t("surveyDone")}</h2><p class="muted">${t("surveyDoneMsg")}</p>`));
    const home = el("button", "btn primary big", t("backHome"));
    home.addEventListener("click", () => app.go("home"));
    card.appendChild(home);
  };
  card.appendChild(buildSurveyForm(app, { onDone: showThanks, prefill }));
}

/* ---------------- HOME CARD (permanent) ---------------- */
export function feedbackCard(app) {
  const given = hasGivenFeedback(app);
  const card = el("div", "card feedback-card" + (given ? " given" : ""));
  card.innerHTML = `
    <div class="pc-icon">${given ? "💛" : "💬"}</div>
    <div class="fb-body">
      <span class="eyebrow">${t("surveyEyebrow")}</span>
      <p class="fb-title">${given ? t("surveyThanks") : t("surveyCardTitle")}</p>
      <p class="muted small">${t("surveyCardBlurb")}</p>
    </div>
    <div class="fb-foot"></div>`;
  const b = el("button", "btn " + (given ? "ghost" : "primary") + " small", given ? t("surveyChange") : t("surveyGive"));
  b.addEventListener("click", () => app.go("survey"));
  card.querySelector(".fb-foot").appendChild(b);
  return card;
}

/* ---------------- ONE-TIME POPUP (after the final round) ---------------- */
export function maybeShowSurveyPopup(app) {
  if (hasGivenFeedback(app)) return;
  if (document.querySelector(".wk-overlay, .install-overlay, .survey-overlay")) return;  // don't stack
  const key = "cgg.surveyPrompted." + sid(app);
  try { if (localStorage.getItem(key) === "1") return; } catch { /* ignore */ }
  try { localStorage.setItem(key, "1"); } catch { /* ignore */ }

  const ov = el("div", "survey-overlay");
  const m = el("div", "survey-modal");
  m.innerHTML = `
    <button class="wk-close" aria-label="Close">✕</button>
    <div class="survey-modal-emoji">🎉</div>
    <h1>${t("surveyPopupTitle")}</h1>
    <p class="muted small">${t("surveyPopupBlurb")}</p>`;

  const close = () => { ov.classList.remove("show"); document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); setTimeout(() => ov.remove(), 200); };
  const onKey = e => { if (e.key === "Escape") close(); };

  const showThanks = () => {
    m.querySelector(".survey-form").remove();
    const ty = el("div", "survey-thanks");
    ty.innerHTML = `<div class="survey-modal-emoji">💛</div><h1>${t("surveyDone")}</h1><p class="muted small">${t("surveyDoneMsg")}</p>`;
    m.appendChild(ty);
    toast("💛 " + t("surveyThanks"));
    setTimeout(close, 1600);
  };
  m.appendChild(buildSurveyForm(app, { onDone: showThanks, prefill: null }));

  const later = el("button", "link-btn survey-later", t("surveyLater"));
  later.addEventListener("click", close);
  m.appendChild(later);

  m.querySelector(".wk-close").addEventListener("click", close);
  ov.addEventListener("click", e => { if (e.target === ov) close(); });
  document.addEventListener("keydown", onKey);

  ov.appendChild(m);
  document.body.appendChild(ov);
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => ov.classList.add("show"));
}
