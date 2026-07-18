/* ============================================================
   CELEBRATE — shared full-screen celebration modal.
   ------------------------------------------------------------
   One reusable "big moment" overlay so badge unlocks, streak
   milestones, etc. all share the same visual language instead of
   each feature hand-rolling its own overlay. Follows the same
   remove-before-reinsert / show-class pattern already used 4x in
   this codebase (.wk-overlay, .why-overlay, .install-overlay,
   .survey-overlay — see css/styles.css and js/weekly.js /
   js/install.js for the house pattern this mirrors).

   Pure client-side: no server round-trip, no imports of other app
   modules. All learner-visible text comes from the CALLER — this
   file hardcodes nothing except a language-neutral CTA fallback,
   so it works the same in the English and Afrikaans surfaces.
   ============================================================ */

/* emoji/title/body/cta are all caller-supplied. Dismiss on backdrop
   click, CTA click, or Escape. */
export function showCelebration({ emoji = "", title = "", body = "", cta = "OK" } = {}) {
  document.querySelectorAll(".celebrate-overlay").forEach(n => n.remove());   // never stack

  const ov = document.createElement("div");
  ov.className = "celebrate-overlay";

  const modal = document.createElement("div");
  modal.className = "celebrate-modal";
  modal.innerHTML = `
    <div class="celebrate-emoji">${emoji}</div>
    ${title ? `<h1>${title}</h1>` : ""}
    ${body ? `<p class="celebrate-body">${body}</p>` : ""}`;

  const btn = document.createElement("button");
  btn.className = "btn primary big celebrate-cta";
  btn.textContent = cta;
  modal.appendChild(btn);

  const close = () => {
    ov.classList.remove("show");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKey);
    setTimeout(() => ov.remove(), 200);
  };
  const onKey = e => { if (e.key === "Escape") close(); };

  btn.addEventListener("click", close);
  ov.addEventListener("click", e => { if (e.target === ov) close(); });
  document.addEventListener("keydown", onKey);

  ov.appendChild(modal);
  document.body.appendChild(ov);
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => ov.classList.add("show"));
}
