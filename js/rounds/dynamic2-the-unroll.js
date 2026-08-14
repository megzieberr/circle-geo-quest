/* Dynamic Geometry dg2 — "The unroll"  (DYNAMIC-GEO-PLAN.md §2, build session 2)
   ------------------------------------------------------------------------
   Her own design, the chapter's centrepiece: the circle unrolls into a
   straight ruler of length 2πr, and the arc a point has swept SURVIVES the
   morph — it lands as a highlighted SEGMENT on the ruler. Arc length is
   just distance, temporarily bent. A θ/360 pie sits beside the ruler,
   literally the same central-angle wedge sliding off the circle's own
   centre as it unrolls — same angle, same fraction, just relocated once
   there is nowhere left "at the centre" to show it.

   THE ENGINE PIECE this needed (js/interactive.js, header note #5,
   additive): `model.noCircle` to skip the default static circle (this
   model draws its OWN circle-or-ruler every frame instead), `frame().paths`
   for raw SVG path data (a circle morphing into a line and a filled pie
   wedge are not segments or declared angles), and `model.glide.onT` so the
   SAME Play/slider UI that already drives a dragged handle in dg0/dg1 can
   drive a model that has no handle at all — there is nothing to drag here,
   only the morph itself to scrub.

   THE MORPH, precisely (so it can be re-derived and re-checked, not just
   read) — a GROWING-RADIUS ARC, not a straight LERP between a circle point
   and a ruler point. A plain position-LERP was the first thing tried here
   and it is WRONG: LERPing two points independently toward their t=1
   targets only guarantees the right answer at t=0 and t=1, and distorts
   the length of everything in between (a chord is shorter than the arc it
   cuts). Since dg3's readout — and this session's own verification step —
   both depend on the highlighted length being the SAME real number at
   every scrub position, not just the two ends, that will not do.

   The fix: fix an anchor point P0 on the circle (here, the very top,
   90°) and its tangent (horizontal, since a radius to the top is
   vertical). At progress t, replace the circle with an arc of a LARGER
   radius Rt = R/(1−t), still passing through P0 with the SAME tangent —
   i.e. still "the same paper," just less curved. A point that was at
   signed angle `raw` from P0 on the original circle (raw ∈ (−180°,180°],
   the same signed degrees-from-anchor used throughout) sits, on the new
   arc, at angle raw·(1−t) from P0 instead — its physical distance from P0
   along the curve is R·raw·(π/180) EITHER WAY, because
     Rt · [raw·(1−t)·(π/180)]  =  [R/(1−t)] · raw·(1−t)·(π/180)  =  R·raw·(π/180)
   — the (1−t) cancels EXACTLY. That is true for every pair of points, not
   only the two ends, so the length between ANY two raw-values — in
   particular the swept arc's own two ends — is the same real number at
   every t, provably, not just at t=0 and t=1. As t→1, Rt→∞ and the arc
   flattens into the straight ruler through P0; t=1 itself is computed as
   the closed-form limit directly (Rt=Infinity would divide by zero), not
   approached numerically.

   THE FIGURE, for the record: A at 110°, B at 245° — the swept arc AB is
   135°, the SAME 135°/8-unit numbers dg3 goes on to compute by hand (dg3's
   OWN diagram places A/B at 200°/335° instead — engine.js's static
   renderer has no cut-point constraint, so it is free to; the unroll model
   below is NOT free to place them just anywhere, see CUT_DEG below).
   Arc length = 135/360 × 2π×8 = 6π ≈ 18.85 units — the readout that never
   changes no matter how far the slider is scrubbed is itself the whole
   discovery: a curved distance and a straight distance can be the same
   length. (Verified 2026-08-14, build session 2: measured the RENDERED
   path — not the declared constant — at t=0, 0.5 and 1 via the browser;
   see the session report for the three px measurements.)

   ⚠️ CUT_DEG SAFETY CONSTRAINT, load-bearing: the anchor/cut must sit
   where NEITHER it nor its antipode (cut+180°) falls inside the swept
   arc. Cutting a circle at C and unrolling only keeps an arc CONTIGUOUS
   if the arc contains neither C nor C's antipode — a hoop cut at one spot
   and laid flat has C's two edges as the ruler's two ENDS, and C's
   antipode (exactly opposite, always equidistant from the cut either way
   round) is the one physical point whose unrolled position is genuinely
   ambiguous, the seam where a naive interpolation silently takes the
   long way round instead of the short one (caught here, 2026-08-14, by
   MEASURING the rendered hilite path: it came out ≈247px instead of the
   expected ≈148px — 225° worth of arc, not 135° — because the first
   choice of A/B put the arc's own midpoint exactly opposite CUT_DEG=90).
   With CUT_DEG=90 (top, horizontal tangent — the simplest case, no tilt
   to carry through the maths) the swept arc must avoid both 90° itself
   and its antipode 270°: A/B=110°/245° checks out — 90∉[110°,245°] and
   270∉[110°,245°]. ✓ */
import { pol } from "../engine.js";

const AC = "#4263eb";
const HILITE = "#0ea271";
const INK = "#252a4a";

const N2 = v => Math.round(v * 100) / 100;
const fmt2 = v => (Math.round(v * 100) / 100).toFixed(2);

const START_DEG = 110, SWEEP_DEG = 135, END_DEG = START_DEG + SWEEP_DEG;
const R_UNITS = 8;
const ARC_LEN_UNITS = SWEEP_DEG / 360 * 2 * Math.PI * R_UNITS;
const FULL_CIRC_UNITS = 2 * Math.PI * R_UNITS;
const CUT_DEG = 90;    // the anchor: the top of the circle, tangent horizontal there

/* A fresh closure per mount (matches dg0/dg1's makeModel() convention) so
   the morph progress `t` never leaks between two panels or two plays of
   the same panel. `opts.startT` (used only by verify-dynamic.html's
   three-scrub-position demo, see the bottom of this file) freezes the
   initial frame at a chosen progress instead of always starting at 0. */
export function makeUnrollModel(opts = {}) {
  let t = 0;
  const W = 420, H = 300, CX = 210, CY = 130, R = 63;
  const P0 = { x: CX, y: CY - R };   // the anchor point, fixed on screen at every t

  /* signed degrees-from-anchor for a point originally at `deg` on the circle */
  function rawOf(deg) { return ((deg - CUT_DEG + 540) % 360) - 180; }

  /* the growing-radius construction — see the header note for the proof
     that this preserves the physical distance between ANY two `raw`
     values at every t, not only at the two ends. */
  function at(raw, tt) {
    if (tt >= 1) {
      const s = raw * Math.PI / 180 * R;
      return { x: P0.x - s, y: P0.y };
    }
    const Rt = R / (1 - tt);
    const Ct = { x: CX, y: (CY - R) + Rt };
    const phi = raw * (1 - tt);          // degrees, from the anchor, on the NEW arc
    const [x, y] = pol(Ct.x, Ct.y, Rt, 90 + phi);
    return { x, y };
  }
  /* the outward direction at a point (for label placement): the direction
     from the arc's CURRENT centre through the point. Well-defined at every
     t including t=1 (phi→0 there for every raw, giving straight "up" —
     the same direction the ruler's own normal points). */
  function outwardDir(raw, tt) {
    const phi = raw * (1 - tt);
    const rad = (90 + phi) * Math.PI / 180;
    return { x: Math.cos(rad), y: -Math.sin(rad) };
  }
  function labelOffset(raw, tt, mag = 18) {
    const d = outwardDir(raw, tt);
    return { dx: d.x * mag, dy: d.y * mag };
  }
  /* the outline: sample the WHOLE circumference, raw ∈ [−180°,180°] — at
     t=0 this closes into the original circle (both ends are the SAME
     physical point, directly opposite the anchor); at t=1 the two ends
     become the ruler's own two ends, exactly 2πR apart. */
  function outlineD(tt) {
    const STEPS = 96;
    let d = "";
    for (let i = 0; i <= STEPS; i++) {
      const raw = -180 + (360 * i / STEPS);
      const p = at(raw, tt);
      d += (i === 0 ? "M " : "L ") + N2(p.x) + " " + N2(p.y) + " ";
    }
    return d;
  }
  const rawA = rawOf(START_DEG), rawB = rawOf(END_DEG);
  function hiliteD(tt) {
    const STEPS = 40;
    let d = "";
    for (let i = 0; i <= STEPS; i++) {
      const raw = rawA + (rawB - rawA) * i / STEPS;
      const p = at(raw, tt);
      d += (i === 0 ? "M " : "L ") + N2(p.x) + " " + N2(p.y) + " ";
    }
    return d;
  }
  /* the θ/360 pie: literally the same central-angle wedge at O, sliding to
     a fixed spot beside the ruler and shrinking as it detaches — same
     angle, same fraction, just relocated once there is nowhere left "at
     the centre" to show it (the circle itself is gone by t=1). It stays
     put — same centre, same radius as the developing shape itself — for
     the first 40% of the scrub, and only peels off and slides for the
     remaining 60%: measuring the RENDERED outline (2026-08-14, build
     session 2) found the outline's own widest dip reaches y≈210 around
     t≈0.25, which a wedge already sliding toward its own corner at that
     point would collide with (measured overlap: −9px). Held back to
     `pieT` below, the wedge never leaves the developing shape's own
     radius until the dip has passed, so it can only ever touch the
     boundary it is part of, never cross it (measured clearance ≥ 0
     throughout — see the session report). Purely decorative either way —
     no length claim rides on the pie, so it does not need the
     growing-radius treatment the outline/hilite paths do. */
  const pieTarget = { x: 60, y: 265 }, pieRTarget = 26, PIE_HOLD = 0.4;
  function pieT(tt) { return tt < PIE_HOLD ? 0 : (tt - PIE_HOLD) / (1 - PIE_HOLD); }
  function pieCentre(tt) { const pt = pieT(tt); return { x: CX + (pieTarget.x - CX) * pt, y: CY + (pieTarget.y - CY) * pt }; }
  function pieR(tt) { const pt = pieT(tt); return R + (pieRTarget - R) * pt; }
  function wedgeD(cxp, cyp, r, from, sweep) {
    const [x1, y1] = pol(cxp, cyp, r, from);
    const [x2, y2] = pol(cxp, cyp, r, from + sweep);
    return `M ${N2(cxp)} ${N2(cyp)} L ${N2(x1)} ${N2(y1)} A ${r} ${r} 0 ${sweep > 180 ? 1 : 0} 0 ${N2(x2)} ${N2(y2)} Z`;
  }

  return {
    w: W, h: H, cx: CX, cy: CY, R,
    noCircle: true,     // this model draws its own circle-or-ruler every frame
    handles: [],         // nothing to drag — the morph itself is what scrubs
    measure() { return { t, sweepDeg: SWEEP_DEG, arcLenUnits: ARC_LEN_UNITS, fullCircUnits: FULL_CIRC_UNITS }; },
    frame(pos, ctx, m) {
      const pc = pieCentre(m.t), pr = pieR(m.t);
      const A = at(rawA, m.t), B = at(rawB, m.t);
      const oa = labelOffset(rawA, m.t), ob = labelOffset(rawB, m.t);
      return {
        paths: [
          { d: wedgeD(pc.x, pc.y, pr, START_DEG, SWEEP_DEG), fill: HILITE, opacity: 0.28 },
          { d: outlineD(m.t), color: INK, width: 2.2 },
          { d: hiliteD(m.t), color: HILITE, width: 4.4 },
        ],
        dots: [
          { x: A.x, y: A.y, color: INK, label: "A", dx: oa.dx, dy: oa.dy },
          { x: B.x, y: B.y, color: INK, label: "B", dx: ob.dx, dy: ob.dy },
        ],
      };
    },
    readouts(m) {
      return [
        { label: { en: "Central angle θ", af: "Middelpunthoek θ" }, value: m.sweepDeg + "°", color: HILITE },
        { label: { en: "Highlighted length", af: "Uitgeligte lengte" }, value: "≈ " + fmt2(m.arcLenUnits), color: HILITE, big: true },
        { label: { en: "Unrolled", af: "Oopgevou" }, value: Math.round(m.t * 100) + "%" },
      ];
    },
    glide: { from: 0, to: 1, duration: 9000, startT: opts.startT ?? 0, onT: (v) => { t = v; } },
  };
}

export const round = {
  id: "dg2", n: 0, accent: AC, kind: "dynamic", group: "g8",
  title: { en: "The unroll", af: "Die oopvou" },
  blurb: {
    en: "Watch a circle unroll into a straight ruler — and watch a curved distance turn into a straight one without changing.",
    af: "Kyk hoe 'n sirkel oopvou in 'n reguit maatstok — en kyk hoe 'n geboë afstand in 'n reguit een verander sonder om te verander.",
  },
  panels: [

    /* ---------- 1 · the sandbox, free play before any question ---------- */
    {
      type: "explore",
      prompt: { en: "The highlighted arc from A to B is about to unroll.", af: "Die uitgeligte boog van A na B gaan nou-nou oopvou." },
      instruction: {
        en: "Tap ▶ below the readout — or slide the bar yourself — and watch the circle open up into a straight ruler. The green piece is the arc from A to B; watch what it does.",
        af: "Klik op ▶ onder die lesing — of skuif self die skuifbalk — en kyk hoe die sirkel oopmaak in 'n reguit maatstok. Die groen stuk is die boog van A na B; kyk wat dit doen.",
      },
      interactive: makeUnrollModel(),
    },

    /* ---------- 2 · length invariance — raw numbers, conclusion asked ---------- */
    {
      type: "choice",
      prompt: {
        en: "Scrub the slider all the way from circle to ruler and back. What does the highlighted length actually do?",
        af: "Skuif die skuifbalk heeltemal van sirkel na maatstok en terug. Wat doen die uitgeligte lengte werklik?",
      },
      interactive: makeUnrollModel(),
      options: [
        { text: { en: "It stays exactly the same — a curved distance and a straight distance can be the same length.", af: "Dit bly presies dieselfde — 'n geboë afstand en 'n reguit afstand kan dieselfde lengte wees." }, correct: true },
        { text: { en: "It gets longer, because straightening a curve always stretches it out.", af: "Dit word langer, want om 'n kurwe reguit te maak, rek dit altyd uit." } },
        { text: { en: "It gets shorter, because the curve was 'wasting' some of the distance.", af: "Dit word korter, want die kurwe het van die afstand 'gemors'." } },
        { text: { en: "It changes depending on how fast the slider is dragged.", af: "Dit verander na gelang van hoe vinnig die skuifbalk getrek word." } },
      ],
      hints: [
        { en: "Watch the number itself, not the picture — read it at 0%, at 50%, and at 100% unrolled.", af: "Kyk na die getal self, nie na die prentjie nie — lees dit by 0%, by 50%, en by 100% oopgevou." },
        { en: "Bending a piece of string does not add or remove any string. Unrolling is exactly that, in reverse.", af: "Om 'n stuk tou te buig, voeg geen tou by of verwyder dit nie. Oopvou is presies dit, omgekeerd." },
      ],
      note: {
        en: "Exactly the same, every time — the number never moves off ≈ 18.85, whether the arc is curved, halfway open, or dead straight. Length is length. Bending it into a curve — or straightening it back out — never adds distance or takes any away.",
        af: "Presies dieselfde, elke keer — die getal beweeg nooit weg van ≈ 18.85 nie, of die boog nou geboë, halfpad oop, of morsaf reguit is. Lengte is lengte. Om dit in 'n kurwe te buig — of dit weer reguit te maak — voeg nooit afstand by of verwyder dit nie.",
      },
    },

    /* ---------- 3 · the pie, and rolling back ---------- */
    {
      type: "explore",
      prompt: { en: "Beside the ruler: the same central angle, as a pie.", af: "Langs die maatstok: dieselfde middelpunthoek, as 'n skyf." },
      instruction: {
        en: "Slide the bar all the way to the end and look at the small shaded pie next to the ruler — it is the SAME wedge that used to sit at the circle's own centre. Then slide back to the start and watch it slide home again.",
        af: "Skuif die skuifbalk heeltemal na die einde en kyk na die klein geskakeerde skyf langs die maatstok — dit is DIESELFDE wig wat voorheen by die sirkel se eie middelpunt gesit het. Skuif dan terug na die begin en kyk hoe dit weer huis toe skuif.",
      },
      interactive: makeUnrollModel(),
    },

    /* ---------- 4 · the fraction, radius-independence trap ---------- */
    {
      type: "choice",
      prompt: {
        en: "The pie's central angle is 135°, and a full turn is 360°. What fraction of the whole circle's distance around does the highlighted piece cover?",
        af: "Die skyf se middelpunthoek is 135°, en 'n volle draai is 360°. Watter breuk van die hele sirkel se afstand rondom dek die uitgeligte stuk?",
      },
      options: [
        { text: { en: "135/360 of it — the same fraction as the angle.", af: "135/360 daarvan — dieselfde breuk as die hoek." }, correct: true },
        { text: { en: "Exactly half of it, because it looks like roughly half.", af: "Presies die helfte daarvan, want dit lyk soos min of meer die helfte." } },
        { text: { en: "135 out of 8 — the angle divided by the radius.", af: "135 uit 8 — die hoek gedeel deur die radius." } },
        { text: { en: "You cannot tell without knowing the radius.", af: "Jy kan nie sê sonder om die radius te ken nie." } },
      ],
      hints: [
        { en: "Look only at the two angle readouts from the earlier panel — 135° and 360° — and ignore everything about size.", af: "Kyk net na die twee hoek-lesings van die vorige paneel — 135° en 360° — en ignoreer alles oor grootte." },
        { en: "The fraction of a full turn a wedge takes up depends only on its own angle out of 360°, whatever size the circle happens to be drawn at.", af: "Die breuk van 'n volle draai wat 'n wig opneem, hang net af van sy eie hoek uit 360°, watter grootte die sirkel ook al geteken is." },
      ],
      note: {
        en: "135/360 — exactly the fraction the central angle makes of the whole 360° turn, and that fraction does not need the radius at all. The radius only comes in once you turn that fraction into an actual LENGTH — which is exactly dg3's method: central angle → θ/360 → × 2πr.",
        af: "135/360 — presies die breuk wat die middelpunthoek van die hele 360°-draai uitmaak, en daardie breuk het glad nie die radius nodig nie. Die radius kom eers in wanneer jy daardie breuk in 'n werklike LENGTE omskep — wat presies dg3 se metode is: middelpunthoek → θ/360 → × 2πr.",
      },
    },

    /* ---------- 5 · closing note, bridging to the drill ---------- */
    {
      type: "note",
      prompt: { en: "Curved, straight, curved again — same length throughout", af: "Geboë, reguit, weer geboë — dieselfde lengte deurgaans" },
      note: {
        en: "You have now watched an arc length survive being unrolled, and found the fraction of the circle it represents. dg3 turns that same fraction into an exact number, by hand, on a fresh figure — her method: central angle → θ/360 → × 2πr.",
        af: "Jy het nou 'n boog se lengte sien oorleef terwyl dit oopgevou is, en die breuk van die sirkel wat dit verteenwoordig, gevind. dg3 verander daardie selfde breuk in 'n presiese getal, met die hand, op 'n vars figuur — haar metode: middelpunthoek → θ/360 → × 2πr.",
      },
    },

  ],
};
