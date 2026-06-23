/* ============================================================
   "How to install" — a learner-facing guide for adding Circle Quest
   to a phone's home screen (and switching on daily reminders).

   Three surfaces, all sharing the same steps:
     • renderInstall(app, host)      — a full page (reached from a button)
     • installEntryButton(app)       — that button (login + home)
     • maybeShowInstallPopup(app)    — a one-time popup on first login
   All three hide themselves once the app is already installed.
   ============================================================ */
import { t, tx } from "./i18n.js";
import { el, clear } from "./ui.js";
import { isStandalone } from "./push.js";

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); // iPadOS
}
function isAndroid() { return /android/i.test(navigator.userAgent); }

const IPHONE_STEPS = [
  { en: "If you opened this from <b>WhatsApp</b>, tap the <b>•••</b> (three dots, bottom right) and choose <b>“Open in Safari”</b> first. Already in Safari? Skip to step 2.", af: "As jy dit van <b>WhatsApp</b> af oopgemaak het, tik die <b>•••</b> (drie kolletjies, regs onder) en kies <b>“Open in Safari”</b> eerste. Reeds in Safari? Gaan na stap 2." },
  { en: "In <b>Safari</b>, tap the <b>Share</b> button at the bottom — the <b>square with an arrow ↑</b>.", af: "In <b>Safari</b>, tik die <b>Deel</b>-knoppie onderaan — die <b>blokkie met 'n pyl ↑</b>." },
  { en: "Scroll down and tap <b>“Add to Home Screen”</b>.", af: "Rol af en tik <b>“Voeg by Tuisskerm”</b>." },
  { en: "Tap <b>“Add”</b> (top right).", af: "Tik <b>“Voeg by”</b> (regs bo)." },
  { en: "Open <b>Circle Quest</b> from the new icon on your home screen.", af: "Maak <b>Circle Quest</b> oop vanaf die nuwe ikoon op jou tuisskerm." },
];

const ANDROID_STEPS = [
  { en: "Open this page in <b>Chrome</b>.", af: "Maak hierdie bladsy in <b>Chrome</b> oop." },
  { en: "Tap the <b>⋮</b> menu (top right).", af: "Tik die <b>⋮</b> kieslys (regs bo)." },
  { en: "Tap <b>“Install app”</b> or <b>“Add to Home screen”</b>.", af: "Tik <b>“Installeer app”</b> of <b>“Voeg by Tuisskerm”</b>." },
  { en: "Open <b>Circle Quest</b> from the new icon on your home screen.", af: "Maak <b>Circle Quest</b> oop vanaf die nuwe ikoon op jou tuisskerm." },
];

/* one platform section: a heading + numbered steps */
function platformCard(titleKey, icon, steps, cls = "card install-card") {
  const card = el("div", cls);
  card.innerHTML = `<h3 class="install-ph"><span class="install-ph-ic">${icon}</span> ${t(titleKey)}</h3>`;
  const ol = el("ol", "install-steps");
  steps.forEach(s => { const li = el("li"); li.innerHTML = tx(s); ol.appendChild(li); });
  card.appendChild(ol);
  return card;
}

/* the platform sections, the visitor's own phone first. When detectedOnly is
   true and we can tell the platform, return just that one (keeps the popup short). */
function platformSections(detectedOnly, cls) {
  const ios = isIOS();
  const android = isAndroid() && !ios;
  const iCard = () => platformCard("installIphone", "🍏", IPHONE_STEPS, cls);
  const aCard = () => platformCard("installAndroid", "🤖", ANDROID_STEPS, cls);
  if (detectedOnly) {
    if (ios) return [iCard()];
    if (android) return [aCard()];
  }
  return android ? [aCard(), iCard()] : [iCard(), aCard()];
}

export function renderInstall(app, host) {
  clear(host);
  const screen = el("div", "install-screen");

  const backTo = app.state ? "home" : "login";
  const back = el("button", "link-btn", "← " + t("back"));
  back.addEventListener("click", () => app.go(backTo));
  screen.appendChild(back);

  const head = el("div", "install-head");
  head.innerHTML = `
    <div class="install-icon">📱</div>
    <h1>${t("installTitle")}</h1>
    <p class="muted">${t("installWhy")}</p>`;
  screen.appendChild(head);

  if (isStandalone()) {
    screen.appendChild(el("div", "card install-done", `✅ ${t("installAlready")}`));
  } else {
    platformSections(false).forEach(c => screen.appendChild(c));
    screen.appendChild(el("div", "card install-note", `🔔 ${t("installNotifLine")}`));
  }

  host.appendChild(screen);
}

/* Entry button for the login / home screens. Returns null when the app is
   already installed, so callers can append it freely. */
export function installEntryButton(app) {
  if (isStandalone()) return null;
  const b = el("button", "btn ghost install-entry", t("installBtn"));
  b.addEventListener("click", () => app.go("install"));
  return b;
}

/* One-time popup, shown the first time a learner reaches the home screen on a
   device where the app isn't installed. Remembered per learner so it never nags. */
export function maybeShowInstallPopup(app) {
  if (isStandalone()) return;
  if (document.querySelector(".wk-overlay, .install-overlay")) return;   // don't stack on another popup
  const sid = (app.state && app.state.student && app.state.student.id) || "anon";
  const key = "cgg.installSeen." + sid;
  try { if (localStorage.getItem(key) === "1") return; } catch { /* ignore */ }
  try { localStorage.setItem(key, "1"); } catch { /* ignore */ }

  const ov = el("div", "install-overlay");
  const m = el("div", "install-modal");
  m.innerHTML = `
    <button class="wk-close" aria-label="Close">✕</button>
    <div class="install-modal-emoji">📱</div>
    <h1>${t("installTitle")}</h1>
    <p class="muted small">${t("installWhy")}</p>`;
  const body = el("div", "install-modal-body");
  platformSections(true, "install-sec").forEach(c => body.appendChild(c));
  m.appendChild(body);
  m.appendChild(el("div", "install-note", `🔔 ${t("installNotifLine")}`));

  const actions = el("div", "wk-actions");
  const close = () => { ov.classList.remove("show"); document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); setTimeout(() => ov.remove(), 200); };
  const onKey = e => { if (e.key === "Escape") close(); };
  const gotit = el("button", "btn primary big", t("installGotIt"));
  gotit.addEventListener("click", close);
  actions.appendChild(gotit);
  m.appendChild(actions);

  m.querySelector(".wk-close").addEventListener("click", close);
  ov.addEventListener("click", e => { if (e.target === ov) close(); });
  document.addEventListener("keydown", onKey);

  ov.appendChild(m);
  document.body.appendChild(ov);
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => ov.classList.add("show"));
}
