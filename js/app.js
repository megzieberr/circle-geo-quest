/* App controller: shell, routing, session boot, language re-render. */
import { api } from "./api.js";
import { getSession, isLoggedIn, clearSession } from "./session.js";
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

const app = {
  root: null,
  state: null,
  screen: "login",
  params: {},

  async boot() {
    this.root = document.getElementById("app");
    setLang(getLang());                          // sync <html lang> + persisted choice
    onLangChange(() => this.render());           // re-render current screen on toggle
    if (isLoggedIn()) {
      const ok = await this.refreshState();
      if (!ok) clearSession();
    }
    this.go(isLoggedIn() ? "home" : "login");
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
        if (lb.ok) { this.state.rank = lb.myAllTime ? lb.myAllTime.rank : null; this.state.weeklyXp = lb.myWeekly ? lb.myWeekly.xp : 0; }
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
      case "leaderboard": renderLeaderboard(this, view); break;
      default: renderHome(this, view);
    }
  },
};

app.boot();
window.__APP__ = app;   // handy for debugging / headless checks
