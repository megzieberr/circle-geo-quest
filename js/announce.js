/* One-time "the game now has your back" popup — announces Boost mode so a
   learner who's been failing logs in to HOPE, not to the same wall. Shown once
   per learner on the home screen (localStorage flag), never stacked on the
   weekly/install popups; those show first, this one waits for the next login.
   Teachers can re-view it any time with ?news=1. */
import { t } from "./i18n.js";
import { el } from "./ui.js";

const keyFor = (app, slug) => `cgg.${slug}.${(app && app.state && app.state.student && app.state.student.id) || "anon"}`;

/* Boost mode — the original announcement. */
export function maybeShowBoostAnnounce(app) {
  showNews(app, "boostnews", {
    emoji: "🛟",
    title: t("newsTitle"),
    intro: t("newsIntro"),
    items: [["💡", t("news1")], ["🔁", t("news2")], ["🧭", t("news3")], ["🏅", t("news4")]],
    outro: t("newsOutro"),
  });
}

/* One-off: "play the Investigation Station before tomorrow's class" — her
   ask, 2026-08-01, class is Sunday 2026-08-02. Hardcoded ids and
   English-only copy because this is a single dated reminder, not a
   recurring feature (all her learners are English this year — Afrikaans
   copy was her planning ahead for next year's class, not needed now).
   Three learners were asked to be excluded (two already told not to be
   nagged, one hasn't started playing at all yet), plus her own test
   account — no names here, this file ships to a public repo; the mapping
   from id to name lives only in her Supabase dashboard. Expires after
   Sunday so it never lingers into a normal week. */
const STATION_REMINDER_EXCLUDE = new Set([
  "14333eb7-dce7-4d4e-8bca-6a45c6009ff9",
  "dfb8f1fa-a70c-4b5c-bad4-7f1b149c2b04",
  "4543de75-c4ad-4186-a3a4-62276e775aa2",
  "66687063-a4ed-4da6-bdcf-47f0085bf9cb",
]);
const STATION_REMINDER_EXPIRES = Date.parse("2026-08-03T00:00:00+02:00");

export function maybeShowStationReminder(app) {
  const id = app && app.state && app.state.student && app.state.student.id;
  if (!id || STATION_REMINDER_EXCLUDE.has(id)) return;
  if (Date.now() >= STATION_REMINDER_EXPIRES) return;
  showNews(app, "stationreminder2026aug", {
    emoji: "🔬",
    title: "Investigation Station reminder",
    intro: "Quick heads-up before tomorrow's class:",
    items: [["🔬", "Play through the Investigation Station if you haven't yet"]],
    outro: "See you in class!",
  });
}

/* Replays pay again (2026-07-30). Its own storage key, so a learner who has
   already dismissed the Boost popup still sees this one — and vice versa. */
export function maybeShowReplayAnnounce(app) {
  showNews(app, "replaynews", {
    emoji: "🔁",
    title: t("replayNewsTitle"),
    intro: t("replayNewsIntro"),
    items: [["★", t("replayNews1")], ["🔢", t("replayNews2")], ["💪", t("replayNews3")]],
    outro: t("replayNewsOutro"),
  });
}

function showNews(app, slug, copy) {
  const force = (() => { try { return new URLSearchParams(location.search).get("news") === "1"; } catch { return false; } })();
  if (!force) {
    if (document.querySelector(".wk-overlay, .install-overlay")) return;   // another popup is up — wait for next login
    const day = new Date().getDay();
    if (day === 1 || day === 2) return;   // Mon/Tue: the crown popup loads async and could race us — wait
    try { if (localStorage.getItem(keyFor(app, slug)) === "1") return; } catch { /* ignore */ }
  }
  try { localStorage.setItem(keyFor(app, slug), "1"); } catch { /* ignore */ }

  const ov = el("div", "install-overlay news-overlay");
  const m = el("div", "install-modal news-modal");
  m.innerHTML = `
    <button class="wk-close" aria-label="Close">✕</button>
    <div class="install-modal-emoji">${copy.emoji}</div>
    <span class="eyebrow">${t("newsEyebrow")}</span>
    <h1>${copy.title}</h1>
    <p class="muted small news-intro">${copy.intro}</p>
    <div class="news-list">
      ${copy.items.map(([ico, text]) => `<div class="news-item"><span class="news-ico">${ico}</span><span>${text}</span></div>`).join("")}
    </div>
    <p class="news-outro">${copy.outro}</p>`;

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
