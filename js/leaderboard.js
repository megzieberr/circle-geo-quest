/* Leaderboard: weekly (resets) and all-time. Top ten, mobile-game style,
   and the learner always sees their own rank even outside the top ten. */
import { api } from "./api.js";
import { getSession } from "./session.js";
import { t } from "./i18n.js";
import { el, clear } from "./ui.js";

export async function renderLeaderboard(app, host) {
  clear(host);
  const screen = el("div", "leaderboard");
  screen.innerHTML = `
    <div class="lb-head">
      <button class="link-btn back">← ${t("backHome")}</button>
      <h1>🏆 ${t("leaderboard")}</h1>
    </div>
    <div class="lb-tabs">
      <button class="tab active" data-scope="weekly">${t("weekly")}</button>
      <button class="tab" data-scope="allTime">${t("allTime")}</button>
    </div>
    <div class="lb-list">${t("loading")}</div>`;
  screen.querySelector(".back").addEventListener("click", () => app.go("home"));
  host.appendChild(screen);

  let data = null;
  const sess = getSession();
  try { data = await api.leaderboard(sess.name, sess.password); }
  catch { screen.querySelector(".lb-list").textContent = t("offline"); return; }
  if (!data.ok) { screen.querySelector(".lb-list").textContent = t("offline"); return; }

  const list = screen.querySelector(".lb-list");
  function draw(scope) {
    const rows = data[scope] || [];
    const me = scope === "weekly" ? data.myWeekly : data.myAllTime;
    clear(list);
    if (!rows.length || rows.every(r => r.xp === 0)) {
      list.appendChild(el("p", "muted center", t("noScores")));
      return;
    }
    const top = rows.slice(0, 10);
    top.forEach(r => list.appendChild(row(r)));
    if (me && me.rank > 10) {
      list.appendChild(el("div", "lb-sep", "···"));
      list.appendChild(row(me));
    }
  }
  function row(r) {
    const medal = r.rank === 1 ? "🥇" : r.rank === 2 ? "🥈" : r.rank === 3 ? "🥉" : `${r.rank}`;
    const d = el("div", "lb-row" + (r.me ? " me" : ""));
    d.innerHTML = `
      <span class="lb-rank">${medal}</span>
      <span class="lb-name">${r.name}${r.me ? ` <span class="tag-you">${t("you")}</span>` : ""}</span>
      <span class="lb-xp">★ ${r.xp}</span>`;
    return d;
  }

  screen.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      screen.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
      tab.classList.add("active");
      draw(tab.dataset.scope);
    });
  });
  draw("weekly");
}
