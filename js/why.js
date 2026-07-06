/* ============================================================
   "WHY ARE WE DOING THIS?" — tap-through explainer
   ------------------------------------------------------------
   Opened from the ❓ button in the top bar. Speaks directly to the
   class culture of always asking "but why": the game is teaching a
   NEW LANGUAGE (the language of circles) in three steps — SEE the
   pattern, NAME it in exam words, USE it — and class will finish
   the job on paper. Pure UI: nothing is saved, no XP involved.
   (Own tiny DOM helper so this module doesn't import ui.js — ui.js
   imports us for the top-bar button.)
   ============================================================ */
import { t, tx } from "./i18n.js";

const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

const CARDS = [
  {
    emoji: "🧭",
    title: { en: "Why are we doing this?", af: "Hoekom doen ons dit?" },
    body: {
      en: "Great question — the best mathematicians never stop asking it. This game is teaching you a <b>new language</b>: the language of circles. It has its own words (chord, tangent, cyclic quad…) and its own grammar (the theorems). Every round you play builds that language into your eyes and your brain.",
      af: "Goeie vraag — die beste wiskundiges hou nooit op om dit te vra nie. Hierdie speletjie leer jou 'n <b>nuwe taal</b>: die taal van sirkels. Dit het sy eie woorde (koord, raaklyn, koordevierhoek…) en sy eie grammatika (die stellings). Elke ronde wat jy speel, bou daardie taal in jou oë en jou brein in.",
    },
  },
  {
    emoji: "👀",
    title: { en: "Step 1 — SEE the pattern", af: "Stap 1 — SIEN die patroon" },
    body: {
      en: "When you spot a diameter and instantly think “90°!”, or see a cyclic quad and think “180°!” — that's not luck, and it's not cheating. That “my eyes just know” feeling is <b>exactly</b> how mathematicians read a diagram. The rounds train this on purpose, and if you have it already: it's working.",
      af: "Wanneer jy 'n middellyn sien en dadelik “90°!” dink, of 'n koordevierhoek sien en “180°!” dink — dis nie geluk nie, en dis nie kul nie. Daardie “my oë weet sommer” gevoel is <b>presies</b> hoe wiskundiges 'n diagram lees. Die rondes oefen dit doelbewus, en as jy dit al het: dit werk.",
    },
  },
  {
    emoji: "🗣️",
    title: { en: "Step 2 — NAME the pattern", af: "Stap 2 — BENOEM die patroon" },
    body: {
      en: "Every pattern has an official name — the <b>reason</b> the exam wants word for word, like <i>“line from centre ⊥ to chord”</i>. Seeing the pattern earns half the marks; naming it earns the other half. If you can see answers but the words don't come yet, you're at step 2 of 3 — that's completely normal. Train it in the <b>Say it like the examiner</b> Adventures! 🗺️",
      af: "Elke patroon het 'n amptelike naam — die <b>rede</b> wat die eksamen woord vir woord wil hê, soos <i>“lyn vanuit mdpt ⊥ op koord”</i>. Om die patroon te sien verdien die helfte van die punte; om dit te benoem verdien die ander helfte. As jy antwoorde kan sien maar die woorde kom nog nie, is jy by stap 2 van 3 — dis heeltemal normaal. Oefen dit in die <b>Sê dit soos die eksaminator</b>-Avonture! 🗺️",
    },
  },
  {
    emoji: "🧮",
    title: { en: "Step 3 — USE the pattern", af: "Stap 3 — GEBRUIK die patroon" },
    body: {
      en: "Spot it → name it → use it to hunt down unknown angles, step by step, like a detective. That chain is all of circle geometry — every exam rider is just the same three steps, repeated. The mixed rounds and Adventures make you run the whole chain.",
      af: "Sien dit → benoem dit → gebruik dit om onbekende hoeke stap vir stap op te spoor, soos 'n speurder. Daardie ketting is die hele sirkelmeetkunde — elke eksamenvraag is net dieselfde drie stappe, herhaal. Die gemengde rondes en Avonture laat jou die hele ketting hardloop.",
    },
  },
  {
    emoji: "✍️",
    title: { en: "And in class?", af: "En in die klas?" },
    body: {
      en: "In class we take your trained eyes and practise the <b>writing</b> — full statement-and-reason solutions on paper, exactly like the exam. If you can already SEE it, the writing comes quickly; that's the easy part to fix together. Keep asking “but why?” — it's the most mathematical question there is. 💙",
      af: "In die klas vat ons jou geoefende oë en oefen ons die <b>skryfwerk</b> — volledige bewering-en-rede-oplossings op papier, presies soos die eksamen. As jy dit reeds kan SIEN, kom die skryfwerk vinnig; dis die maklike deel om saam reg te maak. Hou aan vra “maar hoekom?” — dis die mees wiskundige vraag wat daar is. 💙",
    },
  },
];

export function showWhy() {
  document.querySelectorAll(".why-overlay").forEach(n => n.remove());   // never stack
  let idx = 0;

  const ov = el("div", "why-overlay");
  const m = el("div", "why-modal card");
  ov.appendChild(m);

  const close = () => { ov.classList.remove("show"); document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); setTimeout(() => ov.remove(), 200); };
  const onKey = e => { if (e.key === "Escape") close(); };

  function render() {
    const c = CARDS[idx];
    const last = idx === CARDS.length - 1;
    m.innerHTML = `
      <button class="wk-close" aria-label="Close">✕</button>
      <div class="why-emoji">${c.emoji}</div>
      <h1>${tx(c.title)}</h1>
      <p class="why-body">${tx(c.body)}</p>
      <div class="why-dots">${CARDS.map((_, i) => `<i class="${i === idx ? "on" : ""}"></i>`).join("")}</div>
      <div class="why-actions">
        ${idx > 0 ? `<button class="btn ghost why-prev">←</button>` : ""}
        <button class="btn primary big why-next">${last ? "💪 " + (tx({ en: "Got it!", af: "Het dit!" })) : tx({ en: "Next", af: "Volgende" }) + " →"}</button>
      </div>`;
    m.querySelector(".wk-close").addEventListener("click", close);
    const prev = m.querySelector(".why-prev");
    if (prev) prev.addEventListener("click", () => { idx--; render(); });
    m.querySelector(".why-next").addEventListener("click", () => { if (last) close(); else { idx++; render(); } });
  }

  ov.addEventListener("click", e => { if (e.target === ov) close(); });
  document.addEventListener("keydown", onKey);
  render();
  document.body.appendChild(ov);
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => ov.classList.add("show"));
}
