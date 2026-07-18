/* ============================================================
   PROFILE — nickname + avatar setup ("the Katse feature").
   ------------------------------------------------------------
   A persona a learner picks for the leaderboard and weekly reveals,
   fully decoupled from their real display_name (the login/admin
   identifier — never touched here, never shown to classmates in
   place of the nickname's absence... it's the FALLBACK, see
   displayName() below).

   Nickname is freeform, NO profanity filter — moderation is the
   teacher's job (admin "reset nickname" action in js/admin.js), not
   an algorithm. See docs/engagement-plan.md §3 for the ruling.

   Two entry points:
     • showProfileSetup(app, opts) — the overlay itself. Offered once
       automatically right after a first login where the server says
       profileSetupNeeded (see js/auth.js), and reachable any time
       after via the small "Customize" link (renderCustomizeLink).
     • renderCustomizeLink(app, host) — appends that small link under
       whatever `host` already contains (wired in from js/app.js,
       right after the home screen renders — see the note on that
       function below for why it lives there and not in game.js).

   Overlay follows the exact remove-before-reinsert / show-class
   pattern already used elsewhere in this codebase (.wk-overlay,
   .celebrate-overlay, .survey-overlay, .install-overlay in
   css/styles.css / js/weekly.js / js/celebrate.js / js/install.js).
   ============================================================ */
import { api } from "./api.js";
import { getSession } from "./session.js";
import { t, tx } from "./i18n.js";
import { el, toast } from "./ui.js";
import { AVATARS, DEFAULT_AVATAR } from "./config.js";

const NICK_MAX = 24;

/* Resolve an avatar id to its emoji, falling back to the neutral default
   for an unset/unrecognised id — a learner who skipped setup, or a student
   row from before this migration ran. Used everywhere a classmate's avatar
   is rendered (leaderboard, weekly popups, admin dashboard). */
export function avatarEmoji(avatarId) {
  const hit = AVATARS.find(a => a.id === avatarId);
  return hit ? hit.emoji : DEFAULT_AVATAR.emoji;
}

/* nickname ?? display_name — the one rule every classmate-facing surface
   follows (never used on the admin dashboard, which always shows the real
   name first). `entry` is any object with {name, nickname}. */
export function displayName(entry) {
  if (!entry) return "";
  const nick = entry.nickname && String(entry.nickname).trim();
  return nick || entry.name || "";
}

export function showProfileSetup(app, { skippable = true } = {}) {
  document.querySelectorAll(".profile-overlay").forEach(n => n.remove());   // never stack
  const s = getSession();
  if (!s) return;
  const student = (app.state && app.state.student) || {};

  const ov = el("div", "profile-overlay");
  const modal = el("div", "card profile-modal");
  modal.innerHTML = `
    <span class="eyebrow">${tx({ en: "Make it yours", af: "Maak dit joune" })}</span>
    <h1>${tx({ en: "Pick a nickname & avatar", af: "Kies 'n bynaam & avatar" })}</h1>
    <p class="muted small">${tx({
      en: "This is what classmates see on the leaderboard — not your real name.",
      af: "Dit is wat klasmaats op die telbord sien — nie jou regte naam nie.",
    })}</p>`;

  const nickWrap = el("div", "profile-field");
  nickWrap.appendChild(el("label", "profile-label", tx({ en: "Nickname", af: "Bynaam" })));
  const nick = el("input", "text-input");
  nick.type = "text";
  nick.maxLength = NICK_MAX;
  nick.value = student.nickname || "";
  nick.placeholder = tx({ en: "e.g. Nova the Tangent Tamer", af: "bv. Nova die Raaklyn-Temmer" });
  nick.autocomplete = "off";
  nickWrap.appendChild(nick);
  const nickCount = el("p", "profile-count muted small");
  nickWrap.appendChild(nickCount);
  const updateCount = () => { nickCount.textContent = `${nick.value.length}/${NICK_MAX}`; };
  nick.addEventListener("input", updateCount);
  updateCount();
  modal.appendChild(nickWrap);

  modal.appendChild(el("label", "profile-label", tx({ en: "Avatar", af: "Avatar" })));
  const grid = el("div", "avatar-grid");
  let picked = student.avatarId || DEFAULT_AVATAR.id;
  AVATARS.forEach(a => {
    const b = el("button", "avatar-btn" + (a.id === picked ? " sel" : ""), a.emoji);
    b.type = "button";
    b.title = tx(a.label);
    b.setAttribute("aria-label", tx(a.label));
    b.addEventListener("click", () => {
      picked = a.id;
      grid.querySelectorAll(".avatar-btn").forEach(x => x.classList.remove("sel"));
      b.classList.add("sel");
    });
    grid.appendChild(b);
  });
  modal.appendChild(grid);

  const errLine = el("p", "err"); errLine.hidden = true; modal.appendChild(errLine);

  const actions = el("div", "profile-actions");
  const save = el("button", "btn primary big", tx({ en: "Save", af: "Stoor" }));
  actions.appendChild(save);
  let skip = null;
  if (skippable) {
    skip = el("button", "link-btn profile-skip", tx({ en: "Maybe later", af: "Dalk later" }));
    actions.appendChild(skip);
  }
  modal.appendChild(actions);
  ov.appendChild(modal);
  document.body.appendChild(ov);
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => ov.classList.add("show"));

  const close = () => {
    ov.classList.remove("show");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKey);
    setTimeout(() => ov.remove(), 200);
  };
  const onKey = e => { if (e.key === "Escape" && skippable) close(); };
  document.addEventListener("keydown", onKey);
  if (skippable) ov.addEventListener("click", e => { if (e.target === ov) close(); });

  async function doSave(nickname, avatarId) {
    const r = await api.setProfile(s.name, s.password, nickname, avatarId).catch(() => ({ ok: false }));
    if (!r.ok) { errLine.textContent = t("offline"); errLine.hidden = false; return false; }
    if (app.state && app.state.student) {
      app.state.student.nickname = r.nickname != null ? r.nickname : (nickname || null);
      app.state.student.avatarId = r.avatarId || avatarId || null;
      app.state.student.profileSetupNeeded = false;
    }
    return true;
  }

  save.addEventListener("click", async () => {
    save.disabled = true;
    const ok = await doSave(nick.value.trim(), picked);
    save.disabled = false;
    if (!ok) return;
    toast(tx({ en: "Profile saved!", af: "Profiel gestoor!" }));
    close();
  });
  if (skip) {
    skip.addEventListener("click", async () => {
      // A skip still saves the neutral default avatar server-side (no
      // nickname), so the one-time prompt doesn't reappear on every login
      // (see profileSetupNeeded in phase12.sql's cgg_get_state) — the
      // learner just shows by their real display_name everywhere, exactly
      // as if they'd never touched this screen.
      await doSave("", DEFAULT_AVATAR.id);
      close();
    });
  }

  setTimeout(() => nick.focus(), 50);
}

/* Small "Customize" / "Pas aan" entry point so a learner can revisit their
   profile any time after the first-login prompt. Appended AFTER whatever
   is already in `host` — this workstream's file list doesn't include
   game.js (which owns renderHome's internal markup), so rather than reach
   into its structure this just adds a link under it; js/app.js wires the
   call in right after renderHome() runs. Shows the learner's own current
   avatar so the link doubles as a tiny reminder of what's set. */
export function renderCustomizeLink(app, host) {
  if (!app.state || !app.state.student) return;
  const wrap = el("div", "customize-row");
  const btn = el("button", "link-btn customize-link",
    `${avatarEmoji(app.state.student.avatarId)} ${tx({ en: "Customize", af: "Pas aan" })}`);
  btn.addEventListener("click", () => showProfileSetup(app, { skippable: true }));
  wrap.appendChild(btn);
  host.appendChild(wrap);
}
