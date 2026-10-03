/* ============================================================
   EWEREDIGHEID KIT  (the shared DOM pieces for rounds ew1 to ew9)
   ------------------------------------------------------------
   Three things, each ONE copy for the whole feature:

   1 · THE FRACTION DRAWER   fracHtml() + the .ewf classes
       Her warning (2026-09-29): "Pay extra attention to fractions,
       we've had some ups and downs with the fractions in Blipwork."
       Every rule below is a Blipwork failure that must not come back:
         1  every fraction is a REAL stacked fraction: numerator, a bar,
            denominator. Never "AD/DB" with a slash, anywhere.
         2  ONE drawer. The boxes, the hints, the options and the
            "Só skryf jy dit" card all call fracHtml(); there is no
            second spelling of a fraction in this feature.
         3  never a line break inside a fraction: .ewf is nowrap, and an
            equation only breaks BEFORE its "=" (eqHtml's two units).
         4  the bar spans the wider of numerator and denominator: the
            bar is its own grid row, stretched across the column, while
            the numerator and denominator sit centred in it.
         5  never a fraction inside a fraction: fracHtml refuses one
            (the half in the area rule is the single character ½).
         6  a square is a real superscript: sqHtml("AD") draws AD².
         7  a product next to a fraction goes INSIDE the numerator:
            pass the factors as an array, prodHtml() joins them with ·.
         8  nothing sticks out past a phone screen: measured, not hoped,
            by tools/ewe-phone-check.py at 375px.
         9  that same script measures every rendered fraction: numerator
            above the bar, denominator below, bar at least as wide as
            both, all of it on screen.

   2 · THE FILL-THE-BOXES PAD   mountFillPad()
       Blipwork's tokenpad FRAME MODE, rebuilt on the drawer above:
       the equation skeleton with empty boxes, the NEXT box glows, a chip
       click drops into it, chips are never used up, chip order is
       shuffled, ⌫ removes the last chip, Kontroleer marks.

   3 · THE SKETCH   sketchSvg()
       A to-scale triangle sketch with ∥ arrows (ew3, opt-in: tinted
       triangles and a dotted ⊥h with its right-angle box; ew4, opt-in: the
       arc of a shared angle and her star beside it; ew7, opt-in: right-angle
       boxes at named corners, labels kept outside a named Δ), drawn with the same
       svg.diag classes as the circle engine (js/engine.js) so it looks
       like the rest of the app. Labels are PLACED, not typed: each one
       goes where it is farthest from every line, arrow and other label.

   All learner-facing text in here is Afrikaans only (her ruling).
   ============================================================ */
import { SLOT, BRK } from "./ewe-core.js";
import { el } from "./ui.js";

export function esc(t) {
  return String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

/* ---------------- 1 · the fraction drawer ---------------- */

/* A side of a fraction: an HTML string, or an ARRAY of factors (rule 7:
   a product goes inside the numerator, joined by a centred dot). */
function part(x) {
  const html = Array.isArray(x) ? prodHtml(x) : String(x);
  if (html.includes('class="ewf"')) throw new Error("fracHtml: a fraction inside a fraction (rule 5)");
  return html;
}
export function prodHtml(factors) {
  return factors.map(String).join('<span class="ewf-dot">·</span>');
}
/* rule 6: AD² with a real raised 2 */
/* the letter and its 2 travel in ONE span: inside a flex row (an equation's
   unit is inline-flex) a bare <sup> would become its own flex item and be
   centred on the line, not raised (measured by tools/ewe-phone-check.py) */
export function sqHtml(x) { return `<span class="ewf-sqw">${x}<sup class="ewf-sq">2</sup></span>`; }
/* ew7, opt-in by content: a "²" in a plain sentence (an intro, a hint, a
   tip) becomes the SAME raised 2 as sqHtml draws, so a square reads one way
   on the whole screen. Escaped HTML in, HTML out. Text without a "²" (every
   string of ew1 to ew5) comes back unchanged. */
export function sqText(html) { return String(html).replace(/²/g, '<sup class="ewf-sq">2</sup>'); }

/* THE one fraction. num/den are trusted HTML (already escaped by the
   caller, or built by this file).
   ew8, OPT-IN: tone = [k, j] colours the numerator in colour k and the
   denominator in colour j (her notes: every top in one colour, every
   bottom in another; .ewf-k1, .ewf-k2). The bar stays ink. Left out, the
   fraction is exactly as before, letter for letter.
   ew9, OPT-IN: a 0 (or null) in `tone` leaves that half in ink (only the
   lit sides are coloured); `under` (trusted HTML) is a triangle's name
   UNDER the fraction (her rule 24: "onder elke breuk skryf sy die
   driehoek waaruit dit kom"). The name hangs below the fraction without
   taking part in its height, so the "=" beside it still meets the bar.
   Left out, nothing changes. */
export function fracHtml(num, den, tone, under) {
  const [kn, kd] = Array.isArray(tone) ? tone.map(k => (k ? ` ewf-k${k}` : "")) : ["", ""];
  const f = `<span class="ewf"><span class="ewf-n${kn}">${part(num)}</span>`
          + `<span class="ewf-bar" aria-hidden="true"></span>`
          + `<span class="ewf-d${kd}">${part(den)}</span></span>`;
  return under == null ? f : `<span class="ewf-nm">${f}<span class="ewf-under">${under}</span></span>`;
}

/* An equation: two units, and the "=" travels WITH the right-hand side,
   so a line too wide for the phone breaks before the "=" and never inside
   either side (rule 3). */
export function eqHtml(leftHtml, rightHtml) {
  return `<span class="ewq"><span class="ewq-u">${leftHtml}</span>`
       + `<span class="ewq-u"><span class="ewq-eq">=</span>${rightHtml}</span></span>`;
}

/* a ratio fill [a, b, c, d] as a/b = c/d, letters escaped */
export function ratioHtml(fill) {
  const [a, b, c, d] = fill.map(esc);
  return eqHtml(fracHtml(a, b), fracHtml(c, d));
}

/* The written line, as it goes on the exam page: the equation, and the
   reason next to it in brackets. The reason is a separate unit: when the
   phone is too narrow it moves down whole. */
export function writtenLineHtml(fill, reason) {
  return `<div class="ewl">${ratioHtml(fill)}`
       + (reason ? `<span class="ewl-rs">(${esc(reason)})</span>` : "") + `</div>`;
}

/* ew2: the line ABOVE the ratio on the exam page, the two similar
   triangles with their reason: "Δ FJK ||| Δ FGH  (∠∠∠)". Plain text, no
   fraction; the names are one unit and never break. */
export function simLineHtml(text, reason) {
  return `<div class="ewl ewl-sim"><span class="ewl-tx">${esc(text)}</span>`
       + (reason ? `<span class="ewl-rs">(${esc(reason)})</span>` : "") + `</div>`;
}

/* ew3: her area chain, as on her p.43, with the reason next to it:
     Opp Δ ABC     ½ · BC · ⊥h     BC
     --------- = ------------- = --     (gemeenskaplike hoogte ⊥ en lyn)
     Opp Δ ACD     ½ · CD · ⊥h     CD
   The ½ and the ⊥h in the middle fraction are STRUCK THROUGH (her purple
   strokes) by a span INSIDE the one fraction drawer, never a second drawer.
   Three whole fractions: the chain breaks only before an "=", and the
   reason moves down whole. The two "Opp Δ" names carry the triangles'
   tints, the same two as in the sketch.
   area = { tris: ["ABC", "ACD"], bases: ["BC", "CD"] } */
export function areaLineHtml(area, reason) {
  const [t1, t2] = area.tris.map(esc), [b1, b2] = area.bases.map(esc);
  const x = v => `<span class="ewf-x">${v}</span>`;
  const chain = chainHtml([
    fracHtml(tintHtml(`Opp Δ ${t1}`, 1), tintHtml(`Opp Δ ${t2}`, 2)), "=",
    fracHtml([x("½"), b1, x("⊥h")], [x("½"), b2, x("⊥h")]), "=",
    fracHtml(b1, b2),
  ]);
  return `<div class="ewl ewl-area">${chain}`
       + (reason ? `<span class="ewl-rs">(${esc(reason)})</span>` : "") + `</div>`;
}
/* ew4: her area chain for a SHARED ANGLE, as on her p.44 (rule 15), with
   the reason next to it:
     Opp Δ ADE     ½ · AD · AE · sin Â     AD · AE
     --------- = ------------------- = -------     (gemene hoekpunt)
     Opp Δ ABC     ½ · AB · AC · sin Â     AB · AC
   The sibling of areaLineHtml, built from the SAME pieces: fracHtml (the one
   drawer), prodHtml (rule 7: each product sits INSIDE its numerator or
   denominator), the ½ and the sine struck through by a span inside the
   drawer, chainHtml (breaks only before an "="), the reason moving down
   whole. Each "Opp Δ" carries its triangle's own tint, as in the sketch.
   sine = { tris: ["ADE", "ABC"], tints: [1, 2], top: ["AD", "AE"],
            bot: ["AB", "AC"], sin: "sin Â" } */
export function sineLineHtml(sine, reason) {
  const [t1, t2] = sine.tris.map(esc), [k1, k2] = sine.tints || [1, 2];
  const top = sine.top.map(esc), bot = sine.bot.map(esc), sn = esc(sine.sin);
  const x = v => `<span class="ewf-x">${v}</span>`;
  /* the sine carries a hat (sin Â): .ewf-hat gives a denominator that holds
     one a little room under the bar, so the hat never touches it */
  const xs = `<span class="ewf-x ewf-hat">${sn}</span>`;
  const chain = chainHtml([
    fracHtml(tintHtml(`Opp Δ ${t1}`, k1), tintHtml(`Opp Δ ${t2}`, k2)), "=",
    fracHtml([x("½"), ...top, xs], [x("½"), ...bot, xs]), "=",
    fracHtml(top, bot),
  ]);
  return `<div class="ewl ewl-sine">${chain}`
       + (reason ? `<span class="ewl-rs">(${esc(reason)})</span>` : "") + `</div>`;
}
/* ew7: the rewrite of a product line, as she writes it under the exam's
   "Bewys dat …", three lines under each other, left-aligned:
     AD² = BD · DC
     AD · AD = BD · DC
     AD     DC
     --  =  --
     BD     AD
   The given line with sqHtml (rule 6, a real raised 2) and prodHtml, the
   square written out, then the two stacked fractions through fracHtml and
   eqHtml: the fill the learner built, not a fixed one. A line with no
   square has two lines (the given product line, the fractions). No reason:
   a rewrite has none. Each line is one eqHtml, so a line too wide for the
   phone breaks only before its "=".
   cross = { pairs: [["AD", "AD"], ["BD", "DC"]], fill: ["AD", "BD", "DC", "AD"] } */
export function crossLineHtml(cross) {
  const [[l1, l2], [r1, r2]] = cross.pairs.map(p => p.map(esc));
  const sq = l1 === l2;
  const given = eqHtml(sq ? sqHtml(l1) : prodHtml([l1, l2]), prodHtml([r1, r2]));
  const lines = [given];
  if (sq) lines.push(eqHtml(prodHtml([l1, l2]), prodHtml([r1, r2])));
  lines.push(ratioHtml(cross.fill));
  return `<div class="ewl ewl-cross">${lines.map(l => `<div class="ewl-cross-ln">${l}</div>`).join("")}</div>`;
}
/* ew6: her worked page for the trapezium, as she writes it, left-aligned:
     AE   AD   3
     -- = -- = -          (lyn ∥ een sy v. Δ, DE ∥ BC)
     AC   AB   5
     Opp Δ ADE   ½ · AD · AE · sin Â   AD · AE   3 · 3   9
     --------- = ------------------- = ------- = ----- = --   (gemene hoekpunt)
     Opp Δ ABC   ½ · AB · AC · sin Â   AB · AC   5 · 5   25
     Opp DBCE = Opp Δ ABC − Opp Δ ADE
              = 25k − 9k
              = 16k
     ∴ Opp Δ ADE / Opp DBCE = 9/16          (stacked)
   The first two lines only for a question that ran the whole chain (`side`,
   `sine`); her part (c) always. The same pieces as every card: fracHtml
   (the one drawer), prodHtml inside a numerator or denominator (rule 7),
   the ½ and the sine struck inside the drawer (ew4's card), chainHtml (a
   chain breaks only before an "="), the reason moving down whole. Part (c)
   is a small grid so its three "=" stand under each other; a term moves
   down whole if the phone is too narrow. Tints as in the sketch: the small
   Δ tint 1, the trapezium tint 2, the big Δ (both of them) none.
   trap = { side: { pairs: [["AE","AC"],["AD","AB"]], val: ["3","5"], reason },
            sine: { small, big, top, bot, sin, nums: [["3","3"],["5","5"]], val: ["9","25"], reason },
            sub:  { trap: "DBCE", big: "ABC", small: "ADE", k: ["25","9","16"] },
            ask:  { n: { t, tint }, d: { t, tint }, val: ["9","16"] } } */
export function trapLineHtml(t) {
  const x = v => `<span class="ewf-x">${v}</span>`;
  const word = c => (c.tint ? tintHtml(esc(c.t), c.tint) : esc(c.t));
  const rs = r => (r ? `<span class="ewl-rs">(${esc(r)})</span>` : "");
  const out = [];
  if (t.side) {
    const [[a, b], [c, d]] = t.side.pairs.map(p => p.map(esc)), [p, q] = t.side.val.map(esc);
    out.push(`<div class="ewl ewl-trap-ln">${chainHtml([fracHtml(a, b), "=", fracHtml(c, d), "=", fracHtml(p, q)])}${rs(t.side.reason)}</div>`);
  }
  if (t.sine) {
    const S = t.sine, top = S.top.map(esc), bot = S.bot.map(esc);
    const sn = `<span class="ewf-x ewf-hat">${esc(S.sin)}</span>`;
    const [nt, nb] = S.nums.map(p => p.map(esc));
    out.push(`<div class="ewl ewl-trap-ln">${chainHtml([
      fracHtml(tintHtml(`Opp Δ ${esc(S.small)}`, 1), `Opp Δ ${esc(S.big)}`), "=",
      fracHtml([x("½"), ...top, sn], [x("½"), ...bot, sn]), "=",
      fracHtml(top, bot), "=", fracHtml(nt, nb), "=", fracHtml(esc(S.val[0]), esc(S.val[1])),
    ])}${rs(S.reason)}</div>`);
  }
  const s = t.sub, [kb, ks, kt] = s.k.map(esc);
  const eq = `<span class="ewq-eq">=</span>`, minus = `<span class="ewl-ts-op">−</span>`;
  out.push(`<div class="ewl-trap-sub">`
    + `<span class="ewl-ts-l">${tintHtml(`Opp ${esc(s.trap)}`, 2)}</span>`
    + `<span class="ewl-ts-r"><span class="ewl-ts-u">${eq}Opp Δ ${esc(s.big)}</span><span class="ewl-ts-u">${minus}${tintHtml(`Opp Δ ${esc(s.small)}`, 1)}</span></span>`
    + `<span class="ewl-ts-l"></span><span class="ewl-ts-r"><span class="ewl-ts-u">${eq}${kb}k${minus}${ks}k</span></span>`
    + `<span class="ewl-ts-l"></span><span class="ewl-ts-r"><span class="ewl-ts-u">${eq}${kt}k</span></span></div>`);
  out.push(`<div class="ewl-trap-so"><span class="ewl-ts-so">∴</span>${eqHtml(fracHtml(word(t.ask.n), word(t.ask.d)), fracHtml(esc(t.ask.val[0]), esc(t.ask.val[1])))}</div>`);
  return `<div class="ewl-trap">${out.join("")}</div>`;
}

/* ew6, opt-in: a sentence with stacked fractions in it (a build step's
   okLine): strings, and { n:[cells], d:[cells] } drawn by cellFracHtml, the
   one drawer. A plain string okLine never comes here. */
export function richHtml(parts) {
  return parts.map(p => (typeof p === "string" ? sqText(esc(p)) : cellFracHtml(p))).join("");
}

/* ew6, opt-in: a GIVEN line above a step (ew4's result, or the area ratio
   the question gives): frame entries with no boxes, drawn like a frame */
export function givenHtml(line) {
  return chainHtml(frameUnits(line, fxCell));
}

/* a word in one of the two triangle tints (trusted HTML in, already escaped) */
function tintHtml(html, k) { return `<span class="ewtint ewtint-${k}">${html}</span>`; }

/* units (fraction HTML strings and "=" markers) as one equation: each side
   is one unit and the "=" rides with what follows it, so a line too wide
   for the phone breaks only BEFORE an "=" (the eqHtml rule, for any number
   of sides) */
function chainHtml(units) {
  let html = "", open = false;
  units.forEach((u, k) => {
    /* ew9, opt-in: BRK closes the unit, so the line may wrap there */
    if (u === BRK) { if (open) html += "</span>"; open = false; return; }
    if (u === "=") { if (open) html += "</span>"; html += `<span class="ewq-u"><span class="ewq-eq">=</span>`; open = true; return; }
    if (!open) { html += `<span class="ewq-u">`; open = true; }
    html += u;
    const next = units[k + 1];
    if (next === "=" || next == null) { html += "</span>"; open = false; }
  });
  return `<span class="ewq">${html}</span>`;
}

/* a frame's text cell: plain text, or (ew3, opt-in) { t, tint } for a word
   in a triangle's tint, e.g. { t: "Opp Δ ABC", tint: 1 }, or (ew4, opt-in)
   { t: "sin Â", hat: true } for a word with an angle hat (room under the
   bar, see .ewf-hat), or (ew9, opt-in) { t, tone: 1 } for a triangle's
   name in its colour (the given name in Δ ADE ||| Δ ☐☐☐) */
function fxCell(c) {
  if (c && typeof c === "object" && c.tone) return `<span class="ewpad-fx ewf-k${c.tone}">${esc(c.t)}</span>`;
  if (c && typeof c === "object" && c.hat) return `<span class="ewpad-fx ewf-hat">${esc(c.t)}</span>`;
  if (c && typeof c === "object") return `<span class="ewpad-fx ewtint ewtint-${c.tint}">${esc(c.t)}</span>`;
  return `<span class="ewpad-fx">${esc(c)}</span>`;
}
/* ew8, opt-in: a fraction unit with `tone` ([1, 2]) is drawn coloured, top
   and bottom (fracHtml's tone); without the key, as before */
function frameUnits(frame, cell) {
  return frame.map(u => (u === "=" || u === BRK ? u : Array.isArray(u) ? `<span class="ewpad-run">${u.map(cell).join("")}</span>`
                                                            : fracHtml(u.n.map(cell).join(""), u.d.map(cell).join(""), u.tone)));
}

/* ew8, opt-in: the written line with ANY number of fractions (her sketch 3
   has three: AD/AB = AE/AC = DE/BC), each a plain stacked fraction, the
   chain breaking only before an "=", the reason in brackets moving down
   whole. With two fractions it is writtenLineHtml's line, letter for
   letter. pairs = [["AD", "AB"], ["AE", "AC"], …] */
export function fracsLineHtml(pairs, reason) {
  const units = pairs.flatMap(([a, b], i) => [...(i ? ["="] : []), fracHtml(esc(a), esc(b))]);
  return `<div class="ewl">${chainHtml(units)}`
       + (reason ? `<span class="ewl-rs">(${esc(reason)})</span>` : "") + `</div>`;
}

/* ew9, opt-in: the GIVEN fractions of "Lees dit af", lit and named as on
   her pages (rule 24 and the Metode-nota of p.49 and p.55: the two
   triangles in two colours, each name with its own sides).
   line = {
     pre:   { sq: "QR", prod: ["RS", "RP"] }   the exam line above (her p.55
            kind: QR² = RS · RP, the 2 a real superscript, the product
            joined by the drawer's dot), optional
     fracs: [{ n, d, tone: [kn, kd], name: { t, k } }, …]   each fraction,
            its lit halves in colour kn / kd (0 = ink), and (WITHIN form,
            QR/RS = RP/QR: each fraction is one Δ) the name UNDER it, in
            its colour, once that Δ is found
     under: true    the room under the fractions for those names, kept from
            the start, so nothing below moves when a name appears
     side:  { top: { t, k, show }, bot: { t, k, show } }   (ACROSS form,
            AD/AB = DE/BC: the tops are one Δ, the bottoms the other, so no
            single fraction belongs to a Δ) the two names BESIDE the last
            fraction, "bo:" level with the tops and "onder:" level with the
            bottoms (her p.53: read the tops together, the bottoms
            together). A name not found yet keeps its room, unseen.
   }
   The fractions are the one drawer; the chain breaks only before an "=".
   Every name is "Δ" + its letters with a no-break space. */
export function namesLineHtml(line) {
  const nm = x => `<span class="ewf-k${x.k}">Δ ${esc(x.t)}</span>`;
  const units = line.fracs.flatMap((f, i) => [...(i ? ["="] : []),
    fracHtml(esc(f.n), esc(f.d), f.tone || null, f.name ? nm(f.name) : null)]);
  if (line.side) {
    const row = (cls, w, x) => `<span class="${cls}${x.show ? "" : " is-off"}"><span class="ewn-sd-w">${w}</span> ${nm(x)}</span>`;
    units[units.length - 1] += `<span class="ewn-sd">${row("ewn-sd-t", "bo:", line.side.top)}<span class="ewn-sd-gap" aria-hidden="true"></span>${row("ewn-sd-b", "onder:", line.side.bot)}</span>`;
  }
  const pre = line.pre ? `<div class="ewn-pre">${eqHtml(sqHtml(esc(line.pre.sq)), prodHtml(line.pre.prod.map(esc)))}</div>` : "";
  return `<div class="ewn${line.under ? " ewn-under" : ""}">${pre}<div class="ewn-ln">${chainHtml(units)}</div></div>`;
}
/* ew9, opt-in: the two similar triangles, each name in its colour:
   "Δ ADE ||| Δ ABC". One unit, never broken. names = [{ t, k }, { t, k }] */
export function simNamesHtml(names) {
  const [a, b] = names.map(x => `<span class="ewf-k${x.k}">Δ ${esc(x.t)}</span>`);
  return `<div class="ewl ewl-sim ewn-sim"><span class="ewl-tx">${a} ||| ${b}</span></div>`;
}
/* ew9, opt-in: the card of a triangles question: the fractions with both
   names (namesLineHtml), then the two names in matching order */
export function namesCardHtml(w) {
  return `<div class="ewn-card">${namesLineHtml(w.line)}${simNamesHtml(w.sim)}</div>`;
}

/* ew5, opt-in: ONE stacked fraction drawn from frame cells (text, ½, a
   hatted { t, hat } or a tinted { t, tint }), no boxes: a pick option that
   IS a first line, and the lead line above the options. The same cell
   renderer and the same drawer as every frame, so a hat and the ½ get the
   same room as in the pad. */
export function cellFracHtml(f) {
  return fracHtml(f.n.map(fxCell).join(""), f.d.map(fxCell).join(""));
}

/* ew3, opt-in: a frame with its boxes filled in, as a finished line (no
   boxes): the ✓ feedback and "Wys my" of a step that brings its own frame */
export function frameHtml(frame, fill) {
  let i = 0;
  return chainHtml(frameUnits(frame, c => (c === SLOT ? `<span class="ewpad-in">${esc(fill[i++] ?? "")}</span>` : fxCell(c))));
}

/* ---------------- 2 · the fill-the-boxes pad ----------------
   frame   the skeleton, left to right. An entry is:
             "="                         the equals sign (a break point)
             { n:[cells], d:[cells] }    a stacked fraction
             [cells]                     an inline run
           and a cell is SLOT (a box) or plain text (ew3, opt-in: or
           { t, tint } for a word in a triangle's tint).
   chips   the chip texts. Shuffled here, once per mount. Two chips may
           never read the same (it throws: that is an authoring bug).
   onSubmit(fill)   fill = the chips in box order
   fixed   OPT-IN (ew2): chips already sitting in the first boxes, e.g.
           ["JK"]. They cannot be deleted, the glow starts on the first
           EMPTY box, and they are part of the fill handed to onSubmit.
           Left out, the pad behaves exactly as before.
   compact OPT-IN (ew9): a one-row frame (Δ ADE ||| Δ ☐☐☐) keeps less
           height (.ewpad-disp.is-compact), so the given fractions under
           the sketch and the frame share a small phone screen.

   returns { fill, clear, setFill, lock } */
export function mountFillPad(host, { frame, chips, onSubmit, onEdit, fixed, compact }) {
  if (new Set(chips).size !== chips.length) throw new Error("mountFillPad: two chips read the same");
  const nSlots = frame.reduce((k, u) => k + cellsOf(u).filter(c => c === SLOT).length, 0);
  const given = Array.isArray(fixed) ? fixed.slice() : [];
  if (given.length >= nSlots || given.some(g => !chips.includes(g))) throw new Error("mountFillPad: a fixed chip must be a chip, with at least one box left empty");
  let toks = given.slice();
  let locked = false;

  const wrap = el("div", "ewpad");
  const disp = el("div", "ewpad-disp" + (compact ? " is-compact" : ""));
  wrap.appendChild(disp);

  function paint() {
    let i = 0;
    const cell = c => {
      if (c !== SLOT) return fxCell(c);
      const k = i++;
      const filled = k < toks.length;
      const cls = "ewslot" + (filled ? " is-filled" + (k < given.length ? " is-fixed" : "") : (k === toks.length && !locked ? " is-next" : ""));
      return `<span class="${cls}" data-slot="${k}">${filled ? esc(toks[k]) : ""}</span>`;
    };
    /* same break rule as eqHtml: the "=" rides with what follows it */
    disp.innerHTML = chainHtml(frameUnits(frame, cell));
    sub.disabled = locked || toks.length < nSlots;
    del.disabled = locked || toks.length <= given.length;
  }

  const grid = el("div", "ewpad-grid");
  const shuffled = shuffle(chips);
  shuffled.forEach(c => {
    const b = el("button", "ewchip", esc(c));
    b.type = "button";
    b.addEventListener("click", () => { if (locked || toks.length >= nSlots) return; toks.push(c); paint(); onEdit && onEdit(); });
    grid.appendChild(b);
  });
  /* the ⌫ / Kontroleer row always starts a fresh row, so a thumb reaching
     for the last chip never lands on Kontroleer (Blipwork's same rule) */
  const gap = shuffled.length % 3;
  if (gap) { const f = el("span", "ewpad-gap"); f.style.gridColumn = `span ${3 - gap}`; grid.appendChild(f); }
  const del = el("button", "ewchip ewkey-del", "⌫");
  del.type = "button";
  del.setAttribute("aria-label", "Vee die laaste stuk uit");
  del.addEventListener("click", () => { if (locked || toks.length <= given.length) return; toks.pop(); paint(); onEdit && onEdit(); });
  grid.appendChild(del);
  const sub = el("button", "ewchip ewkey-sub", "Kontroleer ✓");
  sub.type = "button";
  sub.style.gridColumn = "span 2";
  sub.addEventListener("click", () => { if (locked || toks.length < nSlots) return; onSubmit && onSubmit(toks.slice()); });
  grid.appendChild(sub);
  wrap.appendChild(grid);
  host.appendChild(wrap);
  paint();

  return {
    get fill() { return toks.slice(); },
    clear() { toks = given.slice(); paint(); },
    setFill(f) { toks = f.slice(0, nSlots); paint(); },
    lock() { locked = true; grid.querySelectorAll("button").forEach(b => { b.disabled = true; }); wrap.classList.add("is-locked"); paint(); },
    node: wrap,
  };
}
function cellsOf(u) { return u === "=" || u === BRK ? [] : Array.isArray(u) ? u : [...u.n, ...u.d]; }

/* Fisher–Yates. Chip order is shuffled per question so the answer is never
   "click them left to right". */
export function shuffle(xs) {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------------- 3 · the sketch ----------------
   spec: { pts:{name:{x,y}}, lines:[[a,b],…], par:[[a,b],…] }
   Fits the points into a W×H canvas, draws the lines, a ∥ chevron at the
   middle of every `par` line (pointing a→b, so author both ∥ lines in the
   same direction), a dot and a placed label at every point.
   ew3, OPT-IN (left out, nothing changes):
     tints   [["A","B","C"], ["A","C","D"]]   each triangle a light tint of
             its own (her colour habit), drawn first so every line is on top
     height  { from: "A", foot:{x,y}, dir:{x,y} }   the dotted ⊥h from the
             apex to its foot, the right-angle box at the foot (on the side
             `dir` along the base) and the label "⊥h" beside it, placed like
             the point labels
   ew4, OPT-IN (left out, nothing changes):
     tints   an entry may also be { pts: ["A","B","C"], tint: 2 }: the tint
             is then named, not taken from the entry's place, so the whole
             Δ can be drawn first in tint 2 and the cut-off Δ on top in tint 1
     angle   { at: "A", rays: ["B","C"], star: false }   a small arc inside
             the shared angle at `at`, between the rays to rays[0] and
             rays[1]; with star: true, her coloured star just OUTSIDE the
             corner (her sterretjie for "gemeen"). The star's spot is kept
             clear of every label even while the star is hidden, so nothing
             moves when it appears.
     labBox  true: each point label keeps its BOX clear of its own dot on
             every slant (boxRadius below), not just its centre 14 away
   ew7, OPT-IN (left out, nothing changes):
     right   [{ at: "A", arms: ["B", "C"] }, …]   a right-angle box at `at`,
             a small square inside the angle, its two sides laid along the
             two arms (computed from the arms, never drawn by eye). Its
             corners join the obstacles the labels keep away from
     outside ["A", "B", "C"]   no point label may sit inside this Δ (the
             tint rule of ew3, for a figure without tints)
   ew6, OPT-IN (left out, nothing changes):
     sideArcs [{ from: "A", to: "D", label: "3k", level: 1, hidden }, …]
             her coloured arcs along a side, OUTSIDE the Δ (see arcGeo
             above): level 1 over a piece, level 2 over the whole side,
             above the level-1 labels. `hidden` keeps its place (the fit and
             the label obstacles) without drawing it, so it can appear
             later without moving anything
     tints   an entry may have FOUR corners (the trapezium); the label rule
             tests it as a polygon
   ew8, OPT-IN (left out, nothing changes):
     sideArcs entries may carry `tone` (1 or 2: the arc in the colour of
             its place in the fractions, top or bottom) and `away` (["B",
             "C"]: bulge away from those points, for an arc over a ∥ line)
     arcNest true: a whole side's arc is nested outside the piece arc it
             shares a point with (nestH above). As an object { end, gap,
             lab } (foreman review 2026-10-03): the smallest such bow, with
             the corner zone `end` of the piece's chord, then raised only as
             far as the cut point's label under it needs (`lab` clear)
     sideArcs entries may also carry `sag` (a level-1 arc's own sag)
     labOut  { Q: 3 }   that point's label set a little further out
     thick   [["A","B"], …]   those sides drawn thick
     edge    extra margin (sketch units) on every side of the fit with arcs
     labGap  extra room (sketch units) every point label keeps from the
             lines, the ∥ arrows and the arcs
   ew9, OPT-IN (left out, nothing changes):
     eqAngles [{ at: "Q", rays: ["R", "S"] }, …]   two (or more) angles
             marked EQUAL: the same small arc inside each (EQ_R), the
             class .ewe-eqa. Each joins the discs the labels keep away from
     angle   `arc: false`: her star without the arc at that corner, so in a
             sketch with eqAngles an arc only ever means "equal"
     tints   an entry's `tint` may be "k1" / "k2": the tint in the colour of
             the lit sides (her p.49 and p.55: a colour per Δ)
     arcNest `keepHidden: true` (with `lab`): a hidden whole-side bow is
             raised for the label under it as if it were drawn, so the
             sketch before and after it appears is the same, label for label
     boxClear true: a point label keeps its BOX (not just its centre) clear
             of the lines, the ∥ arrows, the marks, the arcs and the other
             labels, and no corner of it may sit inside the `outside` Δ or a
             tint (her rule: labels OUTSIDE the triangle) */
const W = 320, H = 232, MARGIN = 24, LAB_R = 14;
const ARC_R = 17, STAR_D = 15, STAR_R = 5.5, RA_B = 9, EQ_R = 15;
const N = v => Math.round(v * 10) / 10;

/* ew4, opt-in (spec.labBox): how far a label sits from its own point,
   following the label's BOX instead of a circle. A letter is taller than
   it is wide, so on a slant a 14-unit circle let the corner of the label's
   box reach its own dot. Here the box (half-width, room above and below its
   centre) plus the dot plus a small gap must clear the point along the
   chosen direction; never closer than the old 14. */
const BOX_HW = 5.5 + 2.6 + 2, BOX_UP = 10 + 2.6 + 2, BOX_DN = 8 + 2.6 + 2;
/* ew8: a point label's own box around its centre (half-width, up, down),
   and the most steps (sketch units) a whole side's bow is raised for it */
const LAB_HW = 5.5, LAB_UP = 10, LAB_DN = 8, LIFT_MAX = 30;
function boxRadius(c, s) {
  let t = Infinity;
  if (Math.abs(c) > 1e-6) t = Math.min(t, BOX_HW / Math.abs(c));
  if (s > 1e-6) t = Math.min(t, BOX_UP / s);        // label below the point (y down): its top clears the dot
  if (s < -1e-6) t = Math.min(t, BOX_DN / -s);      // label above the point: its bottom clears the dot
  return Math.max(LAB_R, t);
}

function segDist(px, py, a, b) {
  const dx = b.x - a.x, dy = b.y - a.y, L2 = dx * dx + dy * dy;
  let t = L2 ? ((px - a.x) * dx + (py - a.y) * dy) / L2 : 0;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (a.x + t * dx), py - (a.y + t * dy));
}

/* ew9, opt-in (spec.boxClear): a point label's box around its centre, its
   half-width by the letter (W and M are wide), and the distances from it.
   Only sketches that ask for it use these; nothing else changes. */
const labBoxAt = (k, x, y) => { const hw = /[WM]/.test(k) ? 7.2 : 5.7; return { x0: x - hw, x1: x + hw, y0: y - LAB_UP, y1: y + LAB_DN }; };
const ptBoxDist = (q, r) => Math.hypot(Math.max(0, r.x0 - q.x, q.x - r.x1), Math.max(0, r.y0 - q.y, q.y - r.y1));
const boxPts = r => [{ x: r.x0, y: r.y0 }, { x: r.x1, y: r.y0 }, { x: r.x0, y: r.y1 }, { x: r.x1, y: r.y1 }, { x: (r.x0 + r.x1) / 2, y: (r.y0 + r.y1) / 2 }];
const boxGap = (a, b) => Math.hypot(Math.max(0, a.x0 - b.x1, b.x0 - a.x1), Math.max(0, a.y0 - b.y1, b.y0 - a.y1));
function segBoxDist(a, b, r) {
  /* 0 when the segment crosses the box (Liang–Barsky), else the nearest of
     its ends to the box and of the box's corners to it */
  const dx = b.x - a.x, dy = b.y - a.y;
  let t0 = 0, t1 = 1, hit = true;
  for (const [p, q] of [[-dx, a.x - r.x0], [dx, r.x1 - a.x], [-dy, a.y - r.y0], [dy, r.y1 - a.y]]) {
    if (p === 0) { if (q < 0) { hit = false; break; } continue; }
    const t = q / p;
    if (p < 0) { if (t > t1) { hit = false; break; } if (t > t0) t0 = t; }
    else { if (t < t0) { hit = false; break; } if (t < t1) t1 = t; }
  }
  if (hit && t0 <= t1) return 0;
  return Math.min(ptBoxDist(a, r), ptBoxDist(b, r), ...boxPts(r).slice(0, 4).map(c => segDist(c.x, c.y, a, b)));
}

/* ---------------- ew6, opt-in: the side arcs (spec.sideArcs) ----------------
   Her arcs over the pieces of a side: 3k over AD, 2k over DB, and 5k over
   the whole AB, OUTSIDE the Δ. Sizes are in sketch units (the label font is
   fixed), so the arcs are laid out AFTER the points are fitted:
     level 1  a shallow circular arc (sag SARC_H1) over a piece, its label
              just outside its top
     level 2  the arc over the WHOLE side, a bow of the same kind, bowed
              just far enough out that every level-1 label box under it is
              SARC_GAP clear of it, measured from the very boxes; its label
              outside it
   Foreman review 2026-10-03: every arc is a plain circular bow between its
   two points (never more than a half circle, so it never runs past either
   end along the side), sag at most SARC_MAX of its chord. The old whole-side
   arc was a flattened superellipse that left each end straight out from the
   side, which read as a teardrop at an apex.
   "Outside" is away from the centre of spec.outside (or of all points).
   A piece's label sits on its arc's middle normal, AL_PAD beyond the arc,
   the reach of its box along that normal taken from the box itself. The
   whole side's label sits outside its own arc the same way, at its middle,
   or slid along its own arc when it would stand level with a piece label
   right beside it (her Q5, upside down: 5k and 4k side by side). */
const SARC_H1 = 7, SARC_GAP = 6, SARC_MAX = 0.42, AL_HH = 8, AL_CW = 7.6, AL_PAD = 5, ARC_EDGE = 4;
const AL_SLIDE = [0.5, 0.55, 0.45, 0.6, 0.4, 0.65, 0.35, 0.7, 0.3];
function arcGeo(spec, P) {
  const ref = (spec.outside || Object.keys(P)).map(k => P[k]);
  const cx = ref.reduce((a, p) => a + p.x, 0) / ref.length, cy = ref.reduce((a, p) => a + p.y, 0) / ref.length;
  const G = spec.sideArcs.map(a => {
    const F = P[a.from], T = P[a.to], L = Math.hypot(T.x - F.x, T.y - F.y) || 1;
    const ux = (T.x - F.x) / L, uy = (T.y - F.y) / L;
    let nx = -uy, ny = ux;
    /* ew8, opt-in: `away: ["B", "C"]` bulges the arc away from the middle of
       those points (an arc over the ∥ line DE bulges away from BC, as on her
       page); without it, away from the centre as before */
    const [rx, ry] = a.away ? [a.away.reduce((s, k) => s + P[k].x, 0) / a.away.length, a.away.reduce((s, k) => s + P[k].y, 0) / a.away.length] : [cx, cy];
    if (((F.x + T.x) / 2 - rx) * nx + ((F.y + T.y) / 2 - ry) * ny < 0) { nx = -nx; ny = -ny; }
    const w = AL_CW * String(a.label || "").length;
    /* ew8, opt-in: `sag` sets a level-1 arc's own sag (sketch units), so an
       arc over a ∥ line bows well clear of its ∥ arrow; without it SARC_H1 */
    const level = a.level === 2 ? 2 : 1;
    return { a, F, L, ux, uy, nx, ny, w, ext: Math.abs(nx) * w / 2 + Math.abs(ny) * AL_HH, level, h: level === 1 && a.sag ? a.sag : SARC_H1 };
  });
  const at = (g, u, n) => ({ x: g.F.x + u * g.L * g.ux + n * g.nx, y: g.F.y + u * g.L * g.uy + n * g.ny });
  /* the bow's circle, in the side's own frame: along (0 at F, L at T), out */
  const circ = (g, h) => { const R = (g.L * g.L / 4 + h * h) / (2 * h); return { R, ca: g.L / 2, cn: h - R }; };
  const local = (g, p) => { const rx = p.x - g.F.x, ry = p.y - g.F.y; return { a: rx * g.ux + ry * g.uy, n: rx * g.nx + ry * g.ny }; };
  const corners = (lab, w) => [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([dx, dy]) => ({ x: lab.x + dx * w / 2, y: lab.y + dy * AL_HH }));
  G.filter(g => g.level === 1).forEach(g => { g.lab = at(g, 0.5, g.h + g.ext + AL_PAD); });
  G.filter(g => g.level === 2).forEach(g => {
    /* every corner of a piece label that stands over this side, in its frame */
    const under = [];
    G.filter(i => i.level === 1 && i.a.label).forEach(i => corners(i.lab, i.w).forEach(q => {
      const c = local(g, q);
      if (c.n > 0 && c.a > 0 && c.a < g.L) under.push(c);
    }));
    const clear = h => { const C = circ(g, h); return Math.min(Infinity, ...under.map(c => C.R - Math.hypot(c.a - C.ca, c.n - C.cn))); };
    /* ew8, opt-in (spec.arcNest as an object): no floor of its own, the
       nesting below finds the smallest bow that clears its piece arc */
    let lo = typeof spec.arcNest === "object" ? SARC_H1 : 2 * SARC_H1 + 8, hi = SARC_MAX * g.L;
    if (hi < lo) hi = lo;
    if (clear(lo) >= SARC_GAP) hi = lo;
    else if (clear(hi) < SARC_GAP) lo = hi;
    for (let it = 0; it < 40 && hi - lo > 0.05; it++) { const m = (lo + hi) / 2; if (clear(m) >= SARC_GAP) hi = m; else lo = m; }
    g.h = hi;
    if (spec.arcNest) g.h = nestH(g, G, g.h, spec.arcNest);
    /* its label, outside the bow on the bow's own radius at `u` */
    const C = circ(g, g.h);
    const labAt = u => {
      const a = u * g.L, d = a - C.ca, on = Math.sqrt(Math.max(0, C.R * C.R - d * d)) + C.cn;
      const ra = d / C.R, rn = (on - C.cn) / C.R;                       // the outward radius, side frame
      const dx = ra * g.ux + rn * g.nx, dy = ra * g.uy + rn * g.ny;     // the same, screen
      const r = Math.abs(dx) * g.w / 2 + Math.abs(dy) * AL_HH + AL_PAD;
      const p = at(g, u, on);
      return { x: p.x + dx * r, y: p.y + dy * r };
    };
    const pieces = G.filter(i => i.level === 1 && i.a.label).map(i => ({ x0: i.lab.x - i.w / 2, x1: i.lab.x + i.w / 2, y0: i.lab.y - AL_HH, y1: i.lab.y + AL_HH }));
    const score = lab => {
      const b = { x0: lab.x - g.w / 2, x1: lab.x + g.w / 2, y0: lab.y - AL_HH, y1: lab.y + AL_HH };
      let gap = Infinity, level = false;
      pieces.forEach(q => {
        const gx = Math.max(0, q.x0 - b.x1, b.x0 - q.x1), gy = Math.max(0, q.y0 - b.y1, b.y0 - q.y1);
        gap = Math.min(gap, Math.hypot(gx, gy));
        if (gy < 2 && gx < 40) level = true;                           // side by side at one height
      });
      return { gap, level };
    };
    let best = null;
    for (const u of AL_SLIDE) {
      const lab = labAt(u), s = score(lab);
      if (!s.level) { best = lab; break; }
      if (!best || s.gap > best.gap) best = { ...lab, gap: s.gap };
    }
    g.lab = { x: best.x, y: best.y };
  });
  /* ew8, opt-in (spec._lift, set only by sketchSvg's label pass below): a
     whole side's bow raised by that much, so the label of the cut point
     under it fits */
  if (spec._lift) G.forEach((g, i) => { if (g.level === 2 && spec._lift[i]) g.h = Math.min(g.h + spec._lift[i], Math.max(g.h, SARC_MAX * g.L)); });
  G.forEach(g => { g.pts = bowPts(g, g.h); });
  return G;
}
/* a circular bow of chord L and sag h (h never more than L/2), as points */
function bowPts(g, h) {
  const pts = [];
  const R = (g.L * g.L / 4 + h * h) / (2 * h), k = g.level === 2 ? 48 : 30;
  for (let i = 0; i <= k; i++) {
    const u = i / k, d = g.L * (u - 0.5), n = Math.sqrt(Math.max(0, R * R - d * d)) - (R - h);
    pts.push({ x: g.F.x + u * g.L * g.ux + n * g.nx, y: g.F.y + u * g.L * g.uy + n * g.ny });
  }
  return pts;
}
/* ew8, opt-in (spec.arcNest): her nested arcs. A whole side's arc (level 2)
   that shares a point with a piece's arc on the same side and the same
   side of it (AB over AD, both from A) bows out until the two arcs are
   NEST_GAP apart everywhere outside the corner zone (NEST_END around the
   shared point, where two arcs from one point must meet). Two arcs from
   the same point so get different heights, the smaller inside. The search
   only ever raises h (a higher bow on the same chord lies above the lower
   one everywhere), never past SARC_MAX of the chord.
   Foreman review 2026-10-03, opt-in (arcNest as an object { end, gap }):
   the corner zone grows with the piece, `end` of the piece's chord (never
   under NEST_END), and the bow need only be `gap` clear of the piece arc
   outside it. The search then starts at the piece's own sag plus `gap`, so
   the whole side gets the SMALLEST bow that clears its piece along the
   middle stretch, instead of a big one forced by the meeting point. */
const NEST_END = 15, NEST_GAP = 5;
function nestH(g, G, h0, opt) {
  const o = typeof opt === "object" ? opt : null;
  const GAP = o ? o.gap : NEST_GAP;
  const T = { x: g.F.x + g.L * g.ux, y: g.F.y + g.L * g.uy };
  const same = (p, q) => Math.hypot(p.x - q.x, p.y - q.y) < 1e-6;
  const onSide = p => { const a = (p.x - g.F.x) * g.ux + (p.y - g.F.y) * g.uy, n = (p.x - g.F.x) * g.nx + (p.y - g.F.y) * g.ny; return Math.abs(n) < 1e-6 && a > -1e-6 && a < g.L + 1e-6; };
  const inner = G.filter(i => i !== g && i.level === 1 && i.nx * g.nx + i.ny * g.ny > 0.999
    && onSide(i.F) && onSide({ x: i.F.x + i.L * i.ux, y: i.F.y + i.L * i.uy }));
  if (!inner.length) return h0;
  /* distances to the other arc as a polyline (point to segment), not point
     to point: two sampled bows close together would otherwise read wider
     than they are */
  const toPoly = (q, pts) => { let m = Infinity; for (let k = 1; k < pts.length; k++) m = Math.min(m, segDist(q.x, q.y, pts[k - 1], pts[k])); return m; };
  const parts = inner.map(i => {
    const iT = { x: i.F.x + i.L * i.ux, y: i.F.y + i.L * i.uy };
    const shared = [g.F, T].filter(p => same(p, i.F) || same(p, iT));
    const end = o ? Math.max(NEST_END, o.end * i.L) : NEST_END;
    const far = q => shared.every(s => Math.hypot(q.x - s.x, q.y - s.y) >= end);
    const all = bowPts(i, i.h);
    return { all, pts: all.filter(far), far };
  });
  const gap = h => {
    const mine = bowPts(g, h);
    let m = Infinity;
    parts.forEach(({ all, pts, far }) => {
      mine.filter(far).forEach(q => { m = Math.min(m, toPoly(q, all)); });
      pts.forEach(q => { m = Math.min(m, toPoly(q, mine)); });
    });
    return m;
  };
  if (o) h0 = Math.max(h0, ...inner.map(i => i.h + GAP));
  let lo = h0, hi = Math.max(h0, SARC_MAX * g.L);
  if (gap(lo) >= GAP) return lo;
  if (gap(hi) < GAP) return hi;
  for (let it = 0; it < 40 && hi - lo > 0.05; it++) { const m = (lo + hi) / 2; if (gap(m) >= GAP) hi = m; else lo = m; }
  return hi;
}
/* the fit with room for the arcs: start from the usual margins and widen
   the side an arc or its label pokes out of, until everything is inside */
function fitArcs(spec, names, x0, x1, y0, y1) {
  /* ew8, opt-in: `edge` adds that much to every margin, so a point label
     at a corner near the canvas edge still has room outside the Δ */
  const e = spec.edge || 0;
  const m = { l: MARGIN + e, r: MARGIN + e, t: MARGIN + e, b: MARGIN + e };
  let res = null;
  for (let it = 0; it < 16; it++) {
    const s = Math.min((W - m.l - m.r) / (x1 - x0 || 1), (H - m.t - m.b) / (y1 - y0 || 1));
    const ox = m.l + (W - m.l - m.r - s * (x1 - x0)) / 2, oy = m.t + (H - m.t - m.b - s * (y1 - y0)) / 2;
    const P = {};
    names.forEach(k => { P[k] = { x: ox + (spec.pts[k].x - x0) * s, y: oy + (spec.pts[k].y - y0) * s }; });
    const G = arcGeo(spec, P);
    res = { s, ox, oy, P, G };
    let lx = Infinity, ly = Infinity, hx = -Infinity, hy = -Infinity;
    const take = (x, y) => { lx = Math.min(lx, x); ly = Math.min(ly, y); hx = Math.max(hx, x); hy = Math.max(hy, y); };
    G.forEach(g => {
      g.pts.forEach(q => take(q.x, q.y));
      if (g.a.label) { take(g.lab.x - g.w / 2, g.lab.y - AL_HH); take(g.lab.x + g.w / 2, g.lab.y + AL_HH); }
    });
    const over = { l: ARC_EDGE - lx, r: hx - (W - ARC_EDGE), t: ARC_EDGE - ly, b: hy - (H - ARC_EDGE) };
    let moved = false;
    for (const k of ["l", "r", "t", "b"]) if (over[k] > 0.25) { m[k] += over[k] + 0.5; moved = true; }
    if (!moved) break;
  }
  return res;
}

export function sketchSvg(spec) {
  const names = Object.keys(spec.pts);
  const xs = names.map(k => spec.pts[k].x), ys = names.map(k => spec.pts[k].y);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  let s, ox, oy, P, arcs = null;
  /* ew6, opt-in: side arcs need room outside the Δ, so the fit makes room
     for them (fitArcs below). Without spec.sideArcs: the fit as always. */
  if (spec.sideArcs) ({ s, ox, oy, P, G: arcs } = fitArcs(spec, names, x0, x1, y0, y1));
  else {
    s = Math.min((W - 2 * MARGIN) / (x1 - x0 || 1), (H - 2 * MARGIN) / (y1 - y0 || 1));
    ox = (W - s * (x1 - x0)) / 2; oy = (H - s * (y1 - y0)) / 2;
    P = {};
    names.forEach(k => { P[k] = { x: ox + (spec.pts[k].x - x0) * s, y: oy + (spec.pts[k].y - y0) * s }; });
  }

  let out = "";
  /* a tint entry: ["A","B","C"] takes its tint from its place (ew3), or
     (ew4, opt-in) { pts, tint } names it */
  const tintPts = t => (Array.isArray(t) ? t : t.pts);
  (spec.tints || []).forEach((t, i) => {
    const k = Array.isArray(t) ? i + 1 : t.tint;
    out += `<polygon class="ewe-tint ewe-tint-${k}" points="${tintPts(t).map(k => `${N(P[k].x)},${N(P[k].y)}`).join(" ")}"/>`;
  });
  const segs = spec.lines.map(([a, b]) => [P[a], P[b]]);
  segs.forEach(([a, b]) => { out += `<line class="ln" x1="${N(a.x)}" y1="${N(a.y)}" x2="${N(b.x)}" y2="${N(b.y)}"/>`; });
  /* ew8, opt-in: `thick: [["A","B"], ["A","C"]]` draws those sides thick
     over their own line (the two cut sides, so the eye sees the pieces lie
     on two lines). The same segments as drawn lines, so no label moves. */
  (spec.thick || []).forEach(([a, b]) => { out += `<line class="ewe-thick" x1="${N(P[a].x)}" y1="${N(P[a].y)}" x2="${N(P[b].x)}" y2="${N(P[b].y)}"/>`; });

  /* ∥ chevrons, one per ∥ line, same look as engine.js's "p1" mark */
  const marks = [];
  (spec.par || []).forEach(([a, b]) => {
    const A = P[a], B = P[b];
    const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
    const L = Math.hypot(B.x - A.x, B.y - A.y) || 1;
    const ux = (B.x - A.x) / L, uy = (B.y - A.y) / L, nx = -uy, ny = ux, w = 5, h = 5;
    out += `<path class="mk ewe-par" fill="none" d="M ${N(mx - ux * w + nx * h)} ${N(my - uy * w + ny * h)} L ${N(mx + ux * w * 0.4)} ${N(my + uy * w * 0.4)} L ${N(mx - ux * w - nx * h)} ${N(my - uy * w - ny * h)}"/>`;
    marks.push({ x: mx, y: my });
  });

  /* ew3: the dotted ⊥h and its right-angle box. Both join the obstacles the
     labels keep away from. */
  let hSeg = null;
  if (spec.height) {
    const A = P[spec.height.from];
    const F = { x: ox + (spec.height.foot.x - x0) * s, y: oy + (spec.height.foot.y - y0) * s };
    const L = Math.hypot(A.x - F.x, A.y - F.y) || 1;
    const ux = (A.x - F.x) / L, uy = (A.y - F.y) / L, vx = spec.height.dir.x, vy = spec.height.dir.y, b = 8;
    out += `<line class="ln ewe-h" x1="${N(A.x)}" y1="${N(A.y)}" x2="${N(F.x)}" y2="${N(F.y)}"/>`;
    out += `<path class="mk ewe-ra" d="M ${N(F.x + vx * b)} ${N(F.y + vy * b)} L ${N(F.x + vx * b + ux * b)} ${N(F.y + vy * b + uy * b)} L ${N(F.x + ux * b)} ${N(F.y + uy * b)}"/>`;
    hSeg = [A, F];
    marks.push({ x: F.x + (vx + ux) * b / 2, y: F.y + (vy + uy) * b / 2 });
  }
  const obst = hSeg ? segs.concat([hSeg]) : segs;

  /* ew4: the shared angle. The arc runs inside the angle (the smaller turn
     from one ray to the other); the star sits on the line that halves the
     angle, on the far side of the corner, so it is clear of both rays. Both
     join the obstacles the labels keep away from, as round discs: the arc
     as a string of points along it, the star as one disc, ALWAYS (drawn or
     not), so the labels do not jump when the star appears. */
  const discs = [];
  if (spec.angle) {
    const V = P[spec.angle.at];
    const unit = k => { const dx = P[k].x - V.x, dy = P[k].y - V.y, L = Math.hypot(dx, dy) || 1; return { x: dx / L, y: dy / L }; };
    const u1 = unit(spec.angle.rays[0]), u2 = unit(spec.angle.rays[1]);
    const a1 = Math.atan2(u1.y, u1.x);
    let da = Math.atan2(u2.y, u2.x) - a1;
    while (da > Math.PI) da -= 2 * Math.PI;
    while (da < -Math.PI) da += 2 * Math.PI;
    /* ew9, opt-in: `arc: false` draws the star alone */
    if (spec.angle.arc !== false) {
      out += `<path class="mk ewe-arc" d="M ${N(V.x + ARC_R * u1.x)} ${N(V.y + ARC_R * u1.y)} A ${ARC_R} ${ARC_R} 0 0 ${da > 0 ? 1 : 0} ${N(V.x + ARC_R * u2.x)} ${N(V.y + ARC_R * u2.y)}"/>`;
      for (let i = 0; i <= 10; i++) { const a = a1 + da * i / 10; discs.push({ x: V.x + ARC_R * Math.cos(a), y: V.y + ARC_R * Math.sin(a), r: 1.5 }); }
    }
    let bx = -(u1.x + u2.x), by = -(u1.y + u2.y);
    const bl = Math.hypot(bx, by) || 1;
    bx /= bl; by /= bl;
    const sx = V.x + STAR_D * bx, sy = V.y + STAR_D * by;
    discs.push({ x: sx, y: sy, r: STAR_R + 1 });
    if (spec.angle.star) {
      const pts = [];
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? STAR_R * 0.45 : STAR_R;
        pts.push(`${N(sx + rr * Math.cos(a))},${N(sy + rr * Math.sin(a))}`);
      }
      out += `<polygon class="ewe-star" points="${pts.join(" ")}"/>`;
    }
  }

  /* ew9: the equal-angle marks. The same small arc, radius EQ_R, inside
     each named angle (the smaller turn from one ray to the other), so the
     eye pairs RQ̂S with P̂. Each arc joins the discs the labels keep away
     from, as a string of points along it. */
  (spec.eqAngles || []).forEach(({ at, rays }) => {
    const V = P[at];
    const unit = k => { const dx = P[k].x - V.x, dy = P[k].y - V.y, L = Math.hypot(dx, dy) || 1; return { x: dx / L, y: dy / L }; };
    const u1 = unit(rays[0]), u2 = unit(rays[1]);
    const a1 = Math.atan2(u1.y, u1.x);
    let da = Math.atan2(u2.y, u2.x) - a1;
    while (da > Math.PI) da -= 2 * Math.PI;
    while (da < -Math.PI) da += 2 * Math.PI;
    out += `<path class="mk ewe-eqa" d="M ${N(V.x + EQ_R * u1.x)} ${N(V.y + EQ_R * u1.y)} A ${EQ_R} ${EQ_R} 0 0 ${da > 0 ? 1 : 0} ${N(V.x + EQ_R * u2.x)} ${N(V.y + EQ_R * u2.y)}"/>`;
    for (let i = 0; i <= 10; i++) { const a = a1 + da * i / 10; discs.push({ x: V.x + EQ_R * Math.cos(a), y: V.y + EQ_R * Math.sin(a), r: 1.5 }); }
  });

  /* ew7: a right-angle box at each named corner, inside the angle, its two
     sides along the two arms. Its corners, the middles of its sides and its
     centre join the discs the labels keep away from. */
  (spec.right || []).forEach(({ at, arms }) => {
    const V = P[at];
    const unit = k => { const dx = P[k].x - V.x, dy = P[k].y - V.y, L = Math.hypot(dx, dy) || 1; return { x: dx / L, y: dy / L }; };
    const u = unit(arms[0]), w = unit(arms[1]), b = RA_B;
    const p1 = { x: V.x + u.x * b, y: V.y + u.y * b }, p3 = { x: V.x + w.x * b, y: V.y + w.y * b };
    const p2 = { x: p1.x + w.x * b, y: p1.y + w.y * b };
    out += `<path class="mk ewe-rt" d="M ${N(p1.x)} ${N(p1.y)} L ${N(p2.x)} ${N(p2.y)} L ${N(p3.x)} ${N(p3.y)}"/>`;
    [p1, p2, p3, { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }, { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 }]
      .forEach(q => discs.push({ x: q.x, y: q.y, r: 1.5 }));
    discs.push({ x: (V.x + p2.x) / 2, y: (V.y + p2.y) / 2, r: b / 2 });
  });

  /* ew6: the side arcs and their labels. Every arc, drawn or `hidden`,
     joins the discs the point labels keep away from (a string of points
     along it, and its label's box as one disc), so no label moves when a
     hidden arc appears (the 5k arc after step 1). Only the drawn ones are
     drawn. */
  (arcs || []).forEach(g => {
    g.pts.forEach(q => discs.push({ x: q.x, y: q.y, r: 1.5 }));
    if (g.a.label) discs.push({ x: g.lab.x, y: g.lab.y, r: Math.hypot(g.w / 2, AL_HH) + 1 });
    /* ew8, opt-in: `tone` 1 or 2 colours the arc by its place in the
       fractions (top or bottom), .ewe-sarc-k1 / -k2 */
    if (!g.a.hidden) out += `<path class="mk ewe-sarc ewe-sarc-${g.level}${g.a.tone ? ` ewe-sarc-k${g.a.tone}` : ""}" d="${g.pts.map((q, i) => `${i ? "L" : "M"} ${N(q.x)} ${N(q.y)}`).join(" ")}"/>`;
  });

  /* labels: for each point try 36 directions and keep the one whose label
     centre is farthest from every line, chevron, placed label and edge */
  const cx = xs.length ? names.reduce((a, k) => a + P[k].x, 0) / names.length : W / 2;
  const cy = names.reduce((a, k) => a + P[k].y, 0) / names.length;
  /* ew3, HER RULING 2026-10-02 (Q3: S and T had drifted above the base line,
     into the yellow Δ): a point label never sits INSIDE a tinted triangle.
     Only sketches with tints carry the rule, so ew1 and ew2 keep the layouts
     she approved. */
  const tintPolys = (spec.tints || []).map(t => tintPts(t).map(k => P[k]));
  /* ew7, opt-in: the same rule for a Δ without a tint (spec.outside) */
  if (spec.outside) tintPolys.push(spec.outside.map(k => P[k]));
  const inTri = (x, y, [a, b, c]) => {
    const s1 = (b.x - a.x) * (y - a.y) - (b.y - a.y) * (x - a.x);
    const s2 = (c.x - b.x) * (y - b.y) - (c.y - b.y) * (x - b.x);
    const s3 = (a.x - c.x) * (y - c.y) - (a.y - c.y) * (x - c.x);
    return (s1 >= 0 && s2 >= 0 && s3 >= 0) || (s1 <= 0 && s2 <= 0 && s3 <= 0);
  };
  /* ew6, opt-in by content: a tint with FOUR corners (the trapezium) is
     tested as a polygon; a triangle keeps the test above, unchanged */
  const inPoly = (x, y, poly) => {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i], b = poly[j];
      if ((a.y > y) !== (b.y > y) && x < (b.x - a.x) * (y - a.y) / (b.y - a.y) + a.x) inside = !inside;
    }
    return inside;
  };
  const placed = [];
  const labels = [];
  /* ew8, opt-in: `labGap` keeps every point label that much further from
     the lines, the ∥ arrows and the arcs (a cut side may be drawn thick
     later, and her arcs crowd the corners); 0 = as before */
  const lg = spec.labGap || 0;
  names.forEach(k => {
    const p = P[k];
    let best = null, bestScore = -Infinity;
    const out0 = Math.atan2(p.y - cy, p.x - cx);
    for (let i = 0; i < 36; i++) {
      const ang = i * Math.PI / 18;
      /* ew8, opt-in: `labOut: { Q: 3 }` sets that point's label a little further
         out (sketch units), for a label in the notch where two arcs meet */
      const r = (spec.labBox ? boxRadius(Math.cos(ang), Math.sin(ang)) : LAB_R) + ((spec.labOut && spec.labOut[k]) || 0);
      const lx = p.x + r * Math.cos(ang), ly = p.y + r * Math.sin(ang);
      let score = Infinity;
      if (spec.boxClear) {
        /* ew9, opt-in: every distance is taken from the label's BOX, not its
           centre (a letter is taller than it is wide: measured from the
           centre, a label under a side could still reach over the side's
           line, and so into the Δ) */
        const bx = labBoxAt(k, lx, ly);
        obst.forEach(([a, b]) => { score = Math.min(score, segBoxDist(a, b, bx) - lg); });
        marks.forEach(m => { score = Math.min(score, ptBoxDist(m, bx) - 4 - lg); });
        discs.forEach(m => { score = Math.min(score, ptBoxDist(m, bx) - m.r - lg); });
        placed.forEach(q => { score = Math.min(score, boxGap(q.box, bx) - 2); });
      } else {
        obst.forEach(([a, b]) => { score = Math.min(score, segDist(lx, ly, a, b) - lg); });
        marks.forEach(m => { score = Math.min(score, Math.hypot(lx - m.x, ly - m.y) - 4 - lg); });
        discs.forEach(m => { score = Math.min(score, Math.hypot(lx - m.x, ly - m.y) - m.r - lg); });
        placed.forEach(q => { score = Math.min(score, Math.hypot(lx - q.x, ly - q.y) - 8); });
      }
      score = Math.min(score, lx - 7, W - 7 - lx, ly - 8, H - 8 - ly);
      /* inside a tinted Δ is never allowed (see tintPolys above); ew9,
         opt-in (boxClear): not even a corner of the label's box */
      const probe = spec.boxClear ? boxPts(labBoxAt(k, lx, ly)) : [{ x: lx, y: ly }];
      if (tintPolys.some(t => probe.some(q => (t.length === 3 ? inTri(q.x, q.y, t) : inPoly(q.x, q.y, t))))) score -= 1000;
      /* a small pull towards "outside the figure", only to break ties */
      score += 0.6 * Math.cos(ang - out0);
      if (score > bestScore) { bestScore = score; best = { x: lx, y: ly }; }
    }
    placed.push(spec.boxClear ? { ...best, box: labBoxAt(k, best.x, best.y) } : best);
    labels.push({ k, ...best });
  });
  /* ew8, opt-in (spec.arcNest as an object with `lab`): the whole side's bow
     is the smallest that clears its piece arc, which can leave too little
     room for the label of the cut point under it. Then that bow alone is
     raised a step and the sketch laid out again, until every point label's
     box is `lab` clear of every whole-side bow. Pure: the same spec always
     gives the same lifts, so the sketch after the tap matches. */
  if (arcs && spec.arcNest && typeof spec.arcNest === "object" && spec.arcNest.lab) {
    const need = spec.arcNest.lab, lift = { ...(spec._lift || {}) };
    let more = false;
    arcs.forEach((g, i) => {
      /* ew9, opt-in (arcNest.keepHidden): a HIDDEN bow is raised too, so it
         already stands where it will be drawn and no label moves when it
         appears (her colour 2 arcs, shown after step 1) */
      if (g.level !== 2 || (g.a.hidden && !spec.arcNest.keepHidden)) return;
      /* only the labels of the points strictly inside this side (its cut point) */
      const inside = l => { const p = P[l.k], a = (p.x - g.F.x) * g.ux + (p.y - g.F.y) * g.uy, n = (p.x - g.F.x) * g.nx + (p.y - g.F.y) * g.ny;
        return Math.abs(n) < 1e-6 && a > 1 && a < g.L - 1; };
      let d = Infinity;
      labels.filter(inside).forEach(l => {
        const b = { x0: l.x - LAB_HW, x1: l.x + LAB_HW, y0: l.y - LAB_UP, y1: l.y + LAB_DN };
        const box = q => Math.hypot(Math.max(0, b.x0 - q.x, q.x - b.x1), Math.max(0, b.y0 - q.y, q.y - b.y1));
        g.pts.forEach(q => { d = Math.min(d, box(q)); });
        /* `line`: as clear of the side itself (less its own `line` short),
           when that side is drawn thick after the tap ("sye in verhouding");
           a higher bow lets the label sit higher */
        if (spec.arcNest.line) for (let k = 0; k <= 80; k++) d = Math.min(d, box({ x: g.F.x + g.L * g.ux * k / 80, y: g.F.y + g.L * g.uy * k / 80 }) + need - spec.arcNest.line);
      });
      /* a step of the shortfall (at least half a unit), so it settles in a few passes */
      if (d < need && (lift[i] || 0) < LIFT_MAX) { lift[i] = (lift[i] || 0) + Math.max(0.5, Math.ceil((need - d) * 2) / 2); more = true; }
    });
    if (more) return sketchSvg({ ...spec, _lift: lift });
  }

  /* ew3: the "⊥h" label beside the dotted height. It is two glyphs wide, so
     its score is taken at its centre AND at both ends; it tries both sides
     of the height at a few heights and keeps the clearest spot. */
  if (hSeg) {
    const [A, F] = hSeg;
    const L = Math.hypot(A.x - F.x, A.y - F.y) || 1, nx = -(A.y - F.y) / L, ny = (A.x - F.x) / L;
    let best = null, bestScore = -Infinity;
    for (const t of [0.35, 0.42, 0.5, 0.58, 0.65]) for (const side of [1, -1]) for (const off of [15, 18, 21]) {
      const lx = F.x + t * (A.x - F.x) + side * off * nx, ly = F.y + t * (A.y - F.y) + side * off * ny;
      let score = Infinity;
      for (const dx of [-8, 0, 8]) {
        const px = lx + dx;
        obst.forEach(([a, b]) => { score = Math.min(score, segDist(px, ly, a, b)); });
        marks.forEach(m => { score = Math.min(score, Math.hypot(px - m.x, ly - m.y) - 4); });
        placed.forEach(q => { score = Math.min(score, Math.hypot(px - q.x, ly - q.y) - 8); });
        score = Math.min(score, px - 7, W - 7 - px, ly - 8, H - 8 - ly);
      }
      score -= 0.02 * off;                       // close to its line, all else equal
      if (score > bestScore) { bestScore = score; best = { x: lx, y: ly }; }
    }
    labels.push({ k: "⊥h", ...best, cls: "pl ewe-hl" });
  }

  names.forEach(k => { out += `<circle cx="${N(P[k].x)}" cy="${N(P[k].y)}" r="2.6" fill="#2b2f4a"/>`; });
  labels.forEach(l => { out += `<text class="${l.cls || "pl"}" x="${N(l.x)}" y="${N(l.y)}">${esc(l.k)}</text>`; });
  /* ew6: the arc labels come AFTER the point labels, so the i-th point
     label still belongs to the i-th dot (the phone check reads them so) */
  (arcs || []).forEach(g => {
    if (g.a.label && !g.a.hidden) out += `<text class="pl ewe-al ewe-al-${g.level}" x="${N(g.lab.x)}" y="${N(g.lab.y)}">${esc(g.a.label)}</text>`;
  });
  return `<svg class="diag ewe-sketch" viewBox="0 0 ${W} ${H}" role="img" preserveAspectRatio="xMidYMid meet">${out}</svg>`;
}
