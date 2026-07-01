/* One-time "the game now has your back" popup — announces Boost mode so a
   learner who's been failing logs in to HOPE, not to the same wall. Shown once
   per learner on the home screen (localStorage flag), never stacked on the
   weekly/install popups; those show first, this one waits for the next login.
   Teachers can re-view it any time with ?news=1. */
import { t } from "./i18n.js";
import { el } from "./ui.js";

const keyFor = app => `cgg.boostnews.${(app && app.state && app.state.student && app.state.student.id) || "anon"}`;

export function maybeShowBoostAnnounce(app) {
  const force = (() => { try { return new URLSearchParams(location.search).get("news") === "1"; } catch { return false; } })();
  if (!force) {
    if (document.querySelector(".wk-overlay, .install-overlay")) return;   // another popup is up — wait for next login
    const day = new Date().getDay();
    if (day === 1 || day === 2) return;   // Mon/Tue: the crown popup loads async and could race us — wait
    try { if (localStorage.getItem(keyFor(app)) === "1") return; } catch { /* ignore */ }
  }
  try { localStorage.setItem(keyFor(app), "1"); } catch { /* ignore */ }

  const ov = el("div", "install-overlay news-overlay");
  const m = el("div", "install-modal news-modal");
  m.innerHTML = `
    <button class="wk-close" aria-label="Close">✕</button>
    <div class="install-modal-emoji">🛟</div>
    <span class="eyebrow">${t("newsEyebrow")}</span>
    <h1>${t("newsTitle")}</h1>
    <p class="muted small news-intro">${t("newsIntro")}</p>
    <div class="news-list">
      <div class="news-item"><span class="news-ico">💡</span><span>${t("news1")}</span></div>
      <div class="news-item"><span class="news-ico">🔁</span><span>${t("news2")}</span></div>
      <div class="news-item"><span class="news-ico">🧭</span><span>${t("news3")}</span></div>
      <div class="news-item"><span class="news-ico">🏅</span><span>${t("news4")}</span></div>
    </div>
    <p class="news-outro">${t("newsOutro")}</p>`;

  const actions = el("div", "wk-actions");
  const close = () => { ov.classList.remove("show"); document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); setTimeout(() => ov.remove(), 200); };
  const onKey = e => { if (e.key === "Escape") close(); };
  const go = el("button", "btn primary big", t("newsGo"));
  go.addEventListener("click", close);
  actions.appendChild(go);
  m.appendChild(actions);

  m.querySelector(".wk-close").addEventListener("click", close);
  ov.addEventListener("click", e => { if (e.target === ov) close(); });
  document.addEventListener("keydown", onKey);

  ov.appendChild(m);
  document.body.appendChild(ov);
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => ov.classList.add("show"));
}
