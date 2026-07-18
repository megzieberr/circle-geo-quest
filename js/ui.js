/* Small DOM helpers + shared chrome (top bar). */
import { t, tx, getLang, setLang } from "./i18n.js";
import { showWhy } from "./why.js";
import { sfx } from "./sound.js";

export function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}
export function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }
export function mount(node, ...kids) { kids.forEach(k => k && node.appendChild(k)); return node; }

export function toast(msg) {
  let box = document.getElementById("toast");
  if (!box) { box = el("div"); box.id = "toast"; document.body.appendChild(box); }
  const t1 = el("div", "toast-item", msg);
  box.appendChild(t1);
  setTimeout(() => t1.classList.add("show"), 10);
  setTimeout(() => { t1.classList.remove("show"); setTimeout(() => t1.remove(), 300); }, 2200);
}

/* Top bar shown on every in-game screen. */
export function renderChrome(app) {
  const bar = el("header", "topbar");
  const left = el("div", "tb-left");
  const logo = el("button", "tb-logo", `<span class="tb-ring"></span> ${t("appName")}`);
  logo.addEventListener("click", () => app.go("home"));
  left.appendChild(logo);

  const right = el("div", "tb-right");
  if (app.state && app.state.student) {
    const xp = el("span", "pill xp", `★ ${app.state.totalXp} XP`);
    right.appendChild(xp);
    if (app.state.rank) right.appendChild(el("span", "pill rank", `#${app.state.rank}`));
  }
  // "why are we doing this?" explainer — the class rule is to always ask why
  const why = el("button", "pill why", `❓ ${t("whyBtn")}`);
  why.title = t("whyBtn");
  why.addEventListener("click", showWhy);
  right.appendChild(why);
  // language toggle
  const lang = el("button", "pill lang", getLang() === "en" ? "AF" : "EN");
  lang.title = t("language");
  lang.addEventListener("click", () => { setLang(getLang() === "en" ? "af" : "en"); });
  right.appendChild(lang);
  // sound mute toggle — per-device, persisted in sound.js (localStorage)
  const mute = el("button", "pill ghost mute", sfx.isMuted() ? "🔇" : "🔊");
  mute.title = tx({ en: sfx.isMuted() ? "Sound off — tap to turn on" : "Sound on — tap to mute",
                     af: sfx.isMuted() ? "Klank af — tik om aan te skakel" : "Klank aan — tik om te demp" });
  mute.addEventListener("click", () => {
    sfx.setMuted(!sfx.isMuted());
    mute.textContent = sfx.isMuted() ? "🔇" : "🔊";
    mute.title = tx({ en: sfx.isMuted() ? "Sound off — tap to turn on" : "Sound on — tap to mute",
                       af: sfx.isMuted() ? "Klank af — tik om aan te skakel" : "Klank aan — tik om te demp" });
  });
  right.appendChild(mute);

  if (app.state && app.state.student) {
    const who = el("span", "pill who", app.state.student.name);
    right.appendChild(who);
    const out = el("button", "pill ghost", "⏻");
    out.title = t("logOut");
    out.addEventListener("click", () => app.logout());
    right.appendChild(out);
  }

  bar.appendChild(left); bar.appendChild(right);
  return bar;
}

export function progressBar(frac) {
  const b = el("div", "pbar");
  const i = el("i");
  i.style.width = Math.round(frac * 100) + "%";
  b.appendChild(i);
  return b;
}

/* Fisher–Yates shuffle (returns a new array). */
export function shuffled(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
