/* Login flow: pick your name, then set (first time) or enter your password.
   Password entry is the only text input in the app — never a maths answer. */
import { api } from "./api.js";
import { setSession } from "./session.js";
import { t, tx } from "./i18n.js";
import { el, clear, toast } from "./ui.js";
import { installEntryButton } from "./install.js";
import { showProfileSetup } from "./profile.js";

/* ============================================================
   WHICH CLASS IS THIS? (phase21 — the Gr11/Gr12 roster split)
   ------------------------------------------------------------
   Gr11 keeps the plain link. The matrics get
   …/circle-geo-quest/?class=gr12, and that choice is REMEMBERED in
   localStorage — same trick as api.js's cgg.forceLocal — because the
   installed PWA opens the plain start URL, so without remembering it a
   matric who installs the app would land on the Gr11 picker.

   This decides ONE thing only: which names the picker offers. Once a
   learner is logged in, every board is filtered by their own cohort on
   the server (cgg_leaderboard / cgg_weekly_results read it off their
   row), so a wrong or missing ?class= can never show them another
   class's leaderboard, Monday popup or champion.

   Anything unrecognised means gr11 — the class that was here first, and
   the one a broken link should fall back to.
   ============================================================ */
const COHORT_KEY = "cgg.cohort";

export function cohortFromSearch(search) {
  try {
    const raw = new URLSearchParams(search || "").get("class");
    const v = String(raw || "").trim().toLowerCase();
    return v === "gr12" ? "gr12" : (v === "gr11" ? "gr11" : null);
  } catch { return null; }
}

/* The link wins and is remembered; otherwise the remembered one; else gr11. */
export function currentCohort() {
  const fromLink = cohortFromSearch(typeof location === "undefined" ? "" : location.search);
  if (fromLink) {
    try { localStorage.setItem(COHORT_KEY, fromLink); } catch { /* private mode */ }
    return fromLink;
  }
  try {
    const saved = localStorage.getItem(COHORT_KEY);
    if (saved === "gr12" || saved === "gr11") return saved;
  } catch { /* private mode */ }
  return "gr11";
}

/* The line above the title on the login card. */
export function cohortEyebrow(cohort) {
  return cohort === "gr12"
    ? { en: "Grade 12 · Circle Geometry", af: "Graad 12 · Sirkelmeetkunde" }
    : { en: "Grade 11 · Circle Geometry", af: "Graad 11 · Sirkelmeetkunde" };
}

/* The way out of the wrong list (2026-09-18). An iPhone home-screen app gets
   its own empty storage and opens the plain start URL, so a matric who installs
   the app lands on the Gr11 picker with no address bar to fix it. The small
   line under the name list swaps the class: it rewrites ?class= in the address
   (so currentCohort() reads AND remembers it, in this app's own storage) and
   keeps the install file in step. It still decides the picker only; boards
   stay locked to the learner's own class on the server. */
export function switchCohort(to) {
  const want = to === "gr12" ? "gr12" : "gr11";
  try { localStorage.setItem(COHORT_KEY, want); } catch { /* private mode */ }
  try {
    const u = new URL(location.href);
    u.searchParams.set("class", want);
    history.replaceState(null, "", u);
  } catch { /* the remembered value above still carries it */ }
  try {
    const m = document.getElementById("cq-manifest");
    if (m) m.setAttribute("href", want === "gr12" ? "manifest-gr12.json" : "manifest.json");
  } catch { /* the install file is a nicety */ }
  return want;
}

/* The words on that line: they name the OTHER class. Kept here as an inline
   {en, af} pair (like cohortEyebrow) rather than in i18n.js, so a phone that
   still holds an older cached i18n.js can never show a raw key on it. */
export function cohortSwitchLabel(other) {
  return other === "gr12"
    ? { en: "Grade 12 learner? Tap here", af: "Graad 12-leerder? Klik hier" }
    : { en: "Grade 11 learner? Tap here", af: "Graad 11-leerder? Klik hier" };
}

/* Whole minutes remaining until an ISO lockout expiry, floored at 1 so the
   message never reads "wait 0 min". Falls back to a sensible default if the
   timestamp is missing or unparseable (matches the server's 15-min window). */
function minutesUntil(iso) {
  const until = iso ? Date.parse(iso) : NaN;
  if (!Number.isFinite(until)) return 15;
  return Math.max(1, Math.ceil((until - Date.now()) / 60000));
}

export async function renderLogin(app, host) {
  clear(host);
  const cohort = currentCohort();
  const wrap = el("div", "login");
  wrap.innerHTML = `
    <div class="login-hero">
      <div class="login-ring"></div>
      <span class="eyebrow">${tx(cohortEyebrow(cohort))}</span>
      <h1>${t("appName")}</h1>
    </div>`;
  const card = el("div", "card login-card");
  wrap.appendChild(card);
  const ie = installEntryButton(app);
  if (ie) { const foot = el("div", "login-foot"); foot.appendChild(ie); wrap.appendChild(foot); }
  host.appendChild(wrap);

  let students = [];
  // the picker shows THIS class's names only (phase21 cgg_list_students)
  try { students = await api.listStudents(cohort); }
  catch { card.innerHTML = `<p class="err">${t("offline")}</p>`; return; }

  function pickName() {
    clear(card);
    card.appendChild(el("h2", "card-title", t("chooseName")));
    card.appendChild(el("p", "muted", t("chooseNameSub")));
    const search = el("input", "text-input");
    search.type = "text";
    search.placeholder = t("searchName");
    search.autocomplete = "off";
    card.appendChild(search);
    const list = el("div", "name-list");
    card.appendChild(list);

    // wrong list? one tap swaps the class (see switchCohort above)
    const other = cohort === "gr12" ? "gr11" : "gr12";
    const swap = el("button", "link-btn cohort-switch", tx(cohortSwitchLabel(other)));
    swap.type = "button";
    swap.addEventListener("click", () => { switchCohort(other); renderLogin(app, host); });
    card.appendChild(swap);

    function draw(filter) {
      clear(list);
      students
        .filter(s => s.display_name.toLowerCase().includes((filter || "").toLowerCase()))
        .forEach(s => {
          const b = el("button", "name-btn", `${s.display_name}${s.has_password ? "" : ' <span class="tag-new">new</span>'}`);
          b.addEventListener("click", () => askPassword(s));
          list.appendChild(b);
        });
      if (!list.children.length) list.appendChild(el("p", "muted", "—"));
    }
    search.addEventListener("input", () => draw(search.value));
    draw("");
    setTimeout(() => search.focus(), 50);
  }

  function askPassword(student) {
    clear(card);
    const isFirst = !student.has_password;
    const back = el("button", "link-btn", "← " + t("back"));
    back.addEventListener("click", pickName);
    card.appendChild(back);
    card.appendChild(el("h2", "card-title", student.display_name));
    card.appendChild(el("p", "muted", isFirst ? t("setPasswordSub") : t("enterPassword")));

    const p1 = el("input", "text-input"); p1.type = "password"; p1.placeholder = t("password");
    card.appendChild(p1);
    let p2 = null;
    if (isFirst) { p2 = el("input", "text-input"); p2.type = "password"; p2.placeholder = t("confirmPassword"); card.appendChild(p2); }

    const errLine = el("p", "err"); errLine.hidden = true; card.appendChild(errLine);
    const go = el("button", "btn primary big", isFirst ? t("start") : t("login"));
    card.appendChild(go);

    function showErr(m) { errLine.textContent = m; errLine.hidden = false; }

    async function submit() {
      const pw = p1.value.trim();
      if (isFirst) {
        if (pw.length < 4) return showErr(t("passwordTooShort"));
        if (pw !== p2.value.trim()) return showErr(t("passwordsDiffer"));
        const r = await api.firstLogin(student.display_name, pw);
        if (!r.ok) return showErr(t("offline"));
      } else {
        if (!pw) return showErr(t("wrongPassword"));
        const r = await api.login(student.display_name, pw);
        if (!r.ok) {
          // Brute-force throttle tripped (phase13): show a friendly "wait a
          // few minutes" without ever revealing whether the account exists —
          // the server locks on the name-key before checking existence, so
          // "locked" leaks nothing that "wrong password" wouldn't.
          if (r.error === "locked") return showErr(t("loginLocked").replace("{n}", minutesUntil(r.lockedUntil)));
          return showErr(t("wrongPassword"));
        }
      }
      setSession(student.display_name, pw);
      await app.refreshState();
      toast(`${t("appName")} — ${student.display_name}`);
      app.go("home");
      // First-ever login (or any login before a profile was ever set) —
      // offer the nickname/avatar screen. Non-blocking, skippable: the
      // home screen is already showing underneath, this is just an overlay
      // on top of it (see js/profile.js).
      if (app.state && app.state.student && app.state.student.profileSetupNeeded) {
        try { showProfileSetup(app, { skippable: true }); } catch { /* non-critical */ }
      }
    }
    go.addEventListener("click", submit);
    [p1, p2].forEach(inp => inp && inp.addEventListener("keydown", e => { if (e.key === "Enter") submit(); }));
    setTimeout(() => p1.focus(), 50);
  }

  pickName();
}
