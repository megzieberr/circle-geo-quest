/* ============================================================
   "How to install" guide — a learner-facing page that explains
   adding Circle Quest to a phone's home screen (and switching on
   daily reminders). Reached from a button on the login and home
   screens; those buttons hide once the app is already installed.
   ============================================================ */
import { t, tx } from "./i18n.js";
import { el, clear } from "./ui.js";
import { isStandalone } from "./push.js";

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); // iPadOS
}
function isAndroid() { return /android/i.test(navigator.userAgent); }

/* one "platform card" with a numbered step list */
function platformCard(titleKey, icon, steps) {
  const card = el("div", "card install-card");
  card.innerHTML = `<h3 class="install-ph"><span class="install-ph-ic">${icon}</span> ${t(titleKey)}</h3>`;
  const ol = el("ol", "install-steps");
  steps.forEach(s => { const li = el("li"); li.innerHTML = tx(s); ol.appendChild(li); });
  card.appendChild(ol);
  return card;
}

const IPHONE_STEPS = [
  { en: "Open this page in <b>Safari</b> (the blue compass).", af: "Maak hierdie bladsy in <b>Safari</b> oop (die blou kompas)." },
  { en: "Tap the <b>Share</b> button — the square with an arrow ↑ (bottom of the screen).", af: "Tik die <b>Deel</b>-knoppie — die blokkie met 'n pyl ↑ (onderaan die skerm)." },
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
    // already running as an installed app — no steps needed
    screen.appendChild(el("div", "card install-done", `✅ ${t("installAlready")}`));
  } else {
    const iphone = platformCard("installIphone", "🍏", IPHONE_STEPS);
    const android = platformCard("installAndroid", "🤖", ANDROID_STEPS);
    // show the visitor's own platform first
    if (isAndroid() && !isIOS()) { screen.appendChild(android); screen.appendChild(iphone); }
    else { screen.appendChild(iphone); screen.appendChild(android); }
    screen.appendChild(el("div", "card install-note", `🔔 ${t("installNotifLine")}`));
  }

  host.appendChild(screen);
}

/* A reusable entry button for the login / home screens. Returns null when the
   app is already installed (nothing to explain), so callers can append freely. */
export function installEntryButton(app) {
  if (isStandalone()) return null;
  const b = el("button", "btn ghost install-entry", t("installBtn"));
  b.addEventListener("click", () => app.go("install"));
  return b;
}
