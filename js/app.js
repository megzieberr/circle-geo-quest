/* App controller: shell, routing, session boot, language re-render. */
import { api, PREVIEW } from "./api.js";
import { getSession, isLoggedIn, clearSession, setSession } from "./session.js";
import { onLangChange, setLang, getLang } from "./i18n.js";
import { el, clear, renderChrome } from "./ui.js";
import { renderLogin } from "./auth.js";
import { renderHome, renderPlay, renderResults } from "./game.js";
import { renderDiscover } from "./discover.js";
import { renderCutscene } from "./cutscene.js";
import { renderLeaderboard } from "./leaderboard.js";
import { renderAdventures, renderAdventure } from "./adventure.js";
import { renderFixMistakes } from "./mistakes.js";
import { renderDaily } from "./daily.js";
import { registerServiceWorker } from "./pwa.js";
import { renderInstall } from "./install.js";
import { renderSurvey } from "./survey.js";
import { flushPendingSubmits } from "./sync.js";

const app = {
  root: null,
  state: null,
  screen: "login",
  params: {},

  async boot() {
    this.root = document.getElementById("app");
    registerServiceWorker();                     // make the app installable (fire-and-forget)
    setLang(getLang());                          // sync <html lang> + persisted choice
    onLangChange(() => this.render());           // re-render current screen on toggle

    // Teacher "view as learner" preview (opened from the admin dashboard):
    // an in-memory session only (persist=false, never clobbers a real login),
    // every round unlocked, nothing saved. See PreviewBackend in api.js.
    if (PREVIEW) {
      setSession("Teacher Preview", "preview", false);
      this.previewBanner();
      await this.refreshState();
      this.go("home");
      return;
    }

    if (isLoggedIn()) {
      // Push any round passes that were queued offline last session BEFORE we
      // pull state, so the home map reflects them and no pass is left stranded.
      try { await flushPendingSubmits(); } catch { /* will retry next boot */ }
      const ok = await this.refreshState();
      if (!ok) clearSession();
    }
    this.go(isLoggedIn() ? "home" : "login");

    // When the device regains connectivity, flush queued passes and refresh.
    window.addEventListener("online", async () => {
      if (PREVIEW || !isLoggedIn()) return;
      try {
        const synced = await flushPendingSubmits();
        if (synced) { await this.refreshState(); this.render(); }
      } catch { /* stays queued for next time */ }
    });
  },

  async refreshState() {
    const s = getSession();
    if (!s) return false;
    try {
      const r = await api.getState(s.name, s.password);
      if (!r.ok) return false;
      this.state = r;
      // enrich with rank + weekly XP for the chrome / home
      try {
        const lb = await api.leaderboard(s.name, s.password);
        if (lb.ok) {
          this.state.rank = lb.myAllTime ? lb.myAllTime.rank : null;
          this.state.weeklyXp = lb.myWeekly ? lb.myWeekly.xp : 0;
          this.state.weekly = lb.weekly || [];      // full board → Star-of-the-Week popups (weekly.js)
          this.state.myWeekly = lb.myWeekly || null;
          this.state.allTime = lb.allTime || [];    // all-time board → first rally shows all-time XP (weekly.js)
          this.state.myAllTime = lb.myAllTime || null;
        }
      } catch { /* ignore */ }
      return true;
    } catch { return false; }
  },

  go(screen, params) {
    this.screen = screen;
    this.params = params || {};
    window.scrollTo(0, 0);
    this.render();
  },

  logout() { clearSession(); this.state = null; this.go("login"); },

  // A persistent strip making it unmistakable this is the teacher preview and
  // that nothing here is saved. "Close" simply closes the preview tab.
  previewBanner() {
    if (document.getElementById("preview-banner")) return;
    const bar = el("div", "preview-banner");
    bar.id = "preview-banner";
    bar.innerHTML = `<span>👁️ Teacher preview — all rounds unlocked, nothing is saved</span>`;
    const close = el("button", "pv-close", "✕ Close");
    close.addEventListener("click", () => window.close());
    bar.appendChild(close);
    document.body.appendChild(bar);
    document.body.classList.add("has-preview-banner");
  },

  render() {
    clear(this.root);
    if (this.screen !== "login" && this.state) this.root.appendChild(renderChrome(this));
    const view = el("main", "view");
    this.root.appendChild(view);
    switch (this.screen) {
      case "login": renderLogin(this, view); break;
      case "home": renderHome(this, view); break;
      case "play": renderPlay(this, view, this.params); break;
      case "discover": renderDiscover(this, view, this.params); break;
      case "cutscene": renderCutscene(this, view, this.params); break;
      case "results": renderResults(this, view, this.params); break;
      case "adventures": renderAdventures(this, view); break;
      case "adventure": renderAdventure(this, view, this.params); break;
      case "fix": renderFixMistakes(this, view); break;
      case "daily": renderDaily(this, view); break;
      case "install": renderInstall(this, view); break;
      case "survey": renderSurvey(this, view); break;
      case "leaderboard": renderLeaderboard(this, view); break;
      default: renderHome(this, view);
    }
  },
};

app.boot();
window.__APP__ = app;   // handy for debugging / headless checks
