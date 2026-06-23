/* Login flow: pick your name, then set (first time) or enter your password.
   Password entry is the only text input in the app — never a maths answer. */
import { api } from "./api.js";
import { setSession } from "./session.js";
import { t, tx } from "./i18n.js";
import { el, clear, toast } from "./ui.js";
import { installEntryButton } from "./install.js";

export async function renderLogin(app, host) {
  clear(host);
  const wrap = el("div", "login");
  wrap.innerHTML = `
    <div class="login-hero">
      <div class="login-ring"></div>
      <span class="eyebrow">${tx({ en: "Grade 11 · Circle Geometry", af: "Graad 11 · Sirkelmeetkunde" })}</span>
      <h1>${t("appName")}</h1>
    </div>`;
  const card = el("div", "card login-card");
  wrap.appendChild(card);
  const ie = installEntryButton(app);
  if (ie) { const foot = el("div", "login-foot"); foot.appendChild(ie); wrap.appendChild(foot); }
  host.appendChild(wrap);

  let students = [];
  try { students = await api.listStudents(); }
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
        if (!r.ok) return showErr(t("wrongPassword"));
      }
      setSession(student.display_name, pw);
      await app.refreshState();
      toast(`${t("appName")} — ${student.display_name}`);
      app.go("home");
    }
    go.addEventListener("click", submit);
    [p1, p2].forEach(inp => inp && inp.addEventListener("keydown", e => { if (e.key === "Enter") submit(); }));
    setTimeout(() => p1.focus(), 50);
  }

  pickName();
}
