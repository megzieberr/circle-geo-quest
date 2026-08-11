/* Proof rounds P8 — "T4 transfer: the wrong-join trap"
   (PROOF-ROUNDS-PLAN.md, session 5 — the T4 arc.)
   ------------------------------------------------------------------------
   REBUILT 2026-08-11/12 night (FIX-ROUND-2.md item 4 — overnight foreman
   build session C, same rebuild as proof7-t4-discovery.js): pr7 now builds
   ONE construction — draw the diameter from the point of tangency T (call
   its far end D), then join D STRAIGHT TO P, the actual point in the
   alternate segment the claim is about — and chases two free right angles
   (tan ⊥ diameter at T, angle in a semicircle at P itself) to a same-
   segment swap that lands both the tangent-chord angle and ∠TPA on
   90° − x. This round carries THAT exact construction to the OTHER side
   of the chord — the tangent-chord angle measured with the OTHER tangent
   ray, landing on the OTHER arc — where the two 90°s combine differently:
   ADDING instead of splitting, so both targets land on 90° + x. It then
   springs the CENTREPIECE trap her cheat notes warn about: after the
   diameter is correctly down, a classmate joins the WRONG two points —
   shown ALREADY DRAWN, as an experience, before the panel names why it
   dies: the join never touches D, so the guaranteed semicircle 90° never
   appears anywhere useful. THE TRAP is now stated relative to her OWN
   recipe (join D straight to the point you're asked about) — the earlier
   version of this file used a DIFFERENT correct construction (D joined to
   the chord's own endpoint, B) and is exactly the disconnect FIX-ROUND-2.md
   flagged; that construction is retired here, in both rounds at once.

   SIX PANELS, same renderInvestigate() as pr0-pr7 — no new panel type,
   no typed answers:
     1 · choice — new picture, the tangent-chord angle measured on the
         OTHER side this time, P also marked (both unlabelled). "What's
         the first move — the one construction that survives every
         version of this proof?" (correct: draw the diameter from T; the
         join to P is introduced compressed, in panel 3 — this round
         doesn't re-teach the mechanism pr7 already built in full.)
     2 · choice — THE TRAP, sprung and already drawn: the diameter is
         down (correct, 90° marked at T), but a classmate joined B to Q
         — some other point on the circle — instead of joining D straight
         to P, her own move. Legal construction (both points already
         exist), but does it reach the second 90° the proof needs? (No —
         named, not just asserted.)
     3 · choice — the correct construction, compressed to one panel (no
         multi-stage build-up — pr7 already taught the mechanism in
         full): D joined straight to P (not to B), the claim angle T₁
         given as 120°, the free 90°s marked at T and at P, T₂ (= x, the
         piece between diameter and chord) derived, ∠DPB (= x, the same-
         segment transfer) marked. Combine: ∠TPB = 90° + x = 120° —
         exactly T₁, the same number the round started with, this time
         by ADDING instead of splitting.
     4 · choice — error-spotting (invest04-prove-it.js's DNA, pr2/pr4/pr6
         panel 4's shape): a learner's solution reaches the right
         conclusion with ONE line's reason mismatched — the semicircle
         90° at P credited to "tan ⊥ diameter" instead of "∠s in
         semi-circle", exactly the mix-up this proof invites (TWO
         different 90°s appear, from TWO different theorems).
         `solution.lines[].st` is symbol-only throughout.
     5 · choice — the legal-constructions thread, continued from
         pr2/pr4/pr6 with DIFFERENT specific moves (not a clone). Carries
         the catchphrase, VERBATIM ENGLISH in both language versions —
         used ONCE in this build for the T4 arc (pr7 has no legal panel).
     6 · note   — recap: same construction, the other side of the chord,
         the trap named, the "always equal" result — this time landing on
         90° + x instead of 90° − x. Last panel of the round.

   NUMBERED-ANGLE CONVENTION (unchanged from pr7's own rebuild): T₁ = the
   35°→120° tangent-chord angle, T₂ = x, the piece between the diameter
   and the chord — both at the crowded vertex T. At P, ∠DPB (the
   transferred piece) and ∠TPB (the theorem's own target — the angle the
   whole construction is anchored to, not a stand-in reached through D)
   are both named in full wherever they appear, same judgment call as
   pr7's own header. ∠STD stays literal throughout — S is the ray name
   the "tan ⊥ diameter" reason genuinely needs, and panel 4 is the one
   panel where the whole point is telling the two 90°s apart by WHERE
   they sit, so collapsing either into a shared alias would erase the
   exact distinction being tested. THE TRAP PANEL (panel 2) is untouched
   in shape — it has no T₁/T₂ marked yet at the point it's sprung.

   DIFFERENT COLOUR PER ANGLE FAMILY throughout, SAME hexes as pr7's own
   rebuild (her explicit ask, session C — the two rounds must read as one
   continuous story):
     GREEN  #0ea271  — the x-family: T₂, and its transferred twin ∠DPB.
     PINK   #e64980  — the 90°-family: the free right angle at T (tan ⊥
                        diameter) AND the free right angle at P (angle in
                        a semicircle).
     PURPLE #9c36b5  — the target family: T₁ (the tangent-chord angle)
                        and ∠TPB (the angle in the alternate segment) —
                        same hex as this round's own accent (AC), no
                        clash, per pr7's own judgment call.
   Same family = same colour on label AND arc throughout. Every numbered
   angle is labelled on the diagram the moment its value is known.

   GEOMETRY — the OTHER side of the same tangent, with a genuine FOURTH
   point (P, the actual point in the alternate segment) added so this
   round's construction matches pr7's letter-for-letter, not just in
   spirit. New letters: B for the chord (unchanged role from before), Q
   for the trap's decoy point (moved from 340° to 300°, since P now
   occupies a nearby degree and the two must not collide), P for the
   alternate-segment point (NEW — this round never had one before the
   rebuild). T:270 and D:90 are UNCHANGED — T is always the point of
   tangency and D is always its antipode, the far end of whichever
   diameter is drawn from it.
     B:30 (CHANGED from 200° — the old value put the chord's own far end
     INSIDE the 90° angle between the tangent and the diameter, the exact
     same split as pr7's case, which lands on 90° − x, not the "90° + x,
     the two 90°s sit differently" case FIX-ROUND-2.md's own transcription
     of her page 3 asks for. B:30 puts the chord's direction from T PAST
     the diameter's own direction instead — the diameter sits BETWEEN the
     tangent and the chord, so T₁ = 90° + T₂ directly, no subtraction —
     genuinely the other configuration, verified node-side, not assumed.)
     P:330 sits on the SAME side of chord TB as this new B (the short arc
     T→B that does NOT contain D), which is what makes ∠TPB come out
     EQUAL to T₁ (not its supplement) — engine-verified by sweeping every
     integer-friendly P in that arc and checking ∠TPB stays constant at
     120° throughout, exactly T₁. That arc runs T(270)→B(390) — a 120°
     span — so 330 is its own MIDPOINT, 60° clear of T and 60° clear of
     B either way: an early draft (P:350, only 40° from B) crowded the
     ∠DPB / ∠TPB labels and the semicircle right-angle mark into one
     corner on the browser-pane render check, so 330 replaced it —
     re-verified node-side after the move, not eyeballed in isolation.
     Q:300 (CHANGED from 340°, to clear P:330) is a plain, otherwise-
     unused point on the circle, existing only to make the wrong join a
     real, legal-looking (but useless) move — same ROLE as before, new
     degree only to avoid crowding the new point.

   Every angle mark is an EXACT integer, engine-verified (node,
   verifyDiagram() against the SAME leg definitions written into the
   figures below — not hand-arithmetic alone):
     direction T→B (from legDir(), matching the engine's own atan2
       formula) puts B strictly between D's own direction from T and the
       diameter having already been passed:
     tg− direction at T = 270 − 90 = 180°
     ∠(tg−, D) = 90°     (tan ⊥ diameter, exact, always)
     T₂ = ∠DTB = (90 − 30) / 2 = 30°    (inscribed angle at T, standing on
       arc D→B not containing T — the classic half-arc identity, exact
       for any circle, the same fact pr7's own T₂ leans on)
     T₁ = ∠(tg−, B) = 90° + T₂ = 90° + 30° = 120°   (D sits BETWEEN the
       tangent ray and the chord this time, engine-verified: 120.0°, not
       a rounded estimate — this is the "two 90°s sit differently" case)
     ∠TPD = 90°   (angle in a semicircle, exact, always — TD is a
       diameter, P is on the circle — engine-verified: 90.0°)
     T and P both lie on the SAME arc relative to chord DB — engine-
       verified by direct construction: ∠DPB = 30° = T₂ exactly, for
       every P swept across the whole valid arc, not just the one chosen
       ("angles in the same segment")
     ∠TPB = ∠TPD + ∠DPB = 90° + 30° = 120°   (engine-verified: 120.0°) —
       EXACTLY T₁, this time by ADDING the transferred piece onto the
       free 90° instead of subtracting it out of it, because D sits
       BETWEEN rays PT and PB at this P, not the chord between them.    */

const AC = "#9c36b5";
const GREEN = "#0ea271";    // T₂ / x, and its transferred twin ∠DPB — same value as pr7's own GREEN
const PINK = "#e64980";     // the two free right angles (T, then P) — same value as pr7's own PINK
const PURPLE = "#9c36b5";   // T₁ and ∠TPB — the two target angles (= AC), same value as pr7's own PURPLE

/* ---- panel 1: bare tan-chord figure, before any construction. The
   tangent-chord angle AND ∠TPB both marked but UNLABELLED — nothing
   spoiled, same shape as pr7's own panel 1. ---- */
const FIG_CLAIM = {
  O: true,
  pts: { T: 270, B: 30, P: 330 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: [["T", "B"], ["P", "T"], ["P", "B"]],
  angles: [
    { at: "T", legs: ["tg-", "B"], t: "", o: { v: 120 } },
    { at: "P", legs: ["T", "B"], t: "", o: { v: 120 } },
  ],
};

/* ---- panel 5: the legal-constructions panel — D is LABELLED (it exists,
   T's exact antipode, so the options can legally talk about it) but no
   line runs to it yet: the whole question is which new line may be
   drawn. Mirrors pr2-t1-transfer.js's own FIG_PQ_BARE convention; P is
   left off this figure entirely — the question here is about the FIRST
   legal line (the diameter), same as before the rebuild, so P has
   nothing to do yet. ---- */
const FIG_LEGAL = {
  O: true,
  pts: { T: 270, D: 90, B: 30 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: [["T", "B"]],
};

/* ---- panel 2: THE TRAP, already drawn — TD correctly down (90° marked),
   but B joined to Q (a plain point on the circle) instead of D joined
   straight to P. P is labelled (the prompt names it as the correct
   target) but carries no line of its own — the trap is exactly that B–Q
   was drawn INSTEAD of D–P, not near it. ---- */
const FIG_TRAP = {
  O: true,
  pts: { T: 270, D: 90, B: 30, Q: 300, P: 330 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: [["T", "B"], ["T", "D"], ["B", "Q"]],
  angles: [{ at: "T", legs: ["tg-", "D"], t: "", o: { v: 90, mark: 1, c: PINK } }],
};

/* ---- panels 3-4, 6: the correct construction — D joined STRAIGHT TO P
   (not to B), the claim given and marked, the free 90°s marked at T and
   at P, T₂ and its same-segment twin ∠DPB both marked. Reused for the
   error-spot panel (the figure that solution is working from) and the
   closing recap. ---- */
const FIG_CORRECT = {
  O: true,
  pts: { T: 270, D: 90, B: 30, P: 330 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: [["T", "B"], ["P", "T"], ["P", "B"], ["T", "D"], ["D", "P"]],
  angles: [
    { at: "T", legs: ["tg-", "B"], t: "T₁ = 120°", o: { v: 120, c: PURPLE } },
    { at: "T", legs: ["tg-", "D"], t: "", o: { v: 90, mark: 1, c: PINK } },
    { at: "T", legs: ["D", "B"], t: "x", o: { v: 30, r: 40, c: GREEN } },
    { at: "P", legs: ["T", "D"], t: "", o: { v: 90, mark: 1, c: PINK } },
    { at: "P", legs: ["D", "B"], t: "x", o: { v: 30, r: 34, c: GREEN } },
    { at: "P", legs: ["T", "B"], t: "90+x", o: { v: 120, r: 62, c: PURPLE } },
  ],
};

const SOL_CAP = { en: "A learner's solution", af: "'n Leerder se oplossing" };

export const round = {
  id: "pr8", n: 0, accent: AC, kind: "proof", group: "g7",
  title: { en: "T4 transfer: the wrong-join trap", af: "T4-oordrag: die strik van die verkeerde verbinding" },
  blurb: {
    en: "Same construction, the other side of the chord — and the trap of joining the wrong point once the diameter is down.",
    af: "Dieselfde konstruksie, die ander kant van die koord — en die strik om die verkeerde punt te verbind sodra die middellyn af is.",
  },
  panels: [

    /* ---------- 1 · new picture, other side of the chord — the first move ---------- */
    {
      type: "choice",
      prompt: {
        en: "A new picture: STU is a tangent at T, and TB is a chord — but this time the tangent-chord angle is measured on the OTHER side of the chord (marked). P is a point in the alternate segment, and ∠TPB is marked too (also no number yet). What is the first move — the one construction that survives every version of this proof?",
        af: "'n Nuwe prentjie: STU is 'n raaklyn by T, en TB is 'n koord — maar hierdie keer word die raaklyn–koord-hoek aan die ANDER kant van die koord gemeet (gemerk). P is 'n punt in die oorstaande segment, en ∠TPB is ook gemerk (ook nog geen getal nie). Wat is die eerste stap — die een konstruksie wat elke weergawe van hierdie bewys oorleef?",
      },
      diagram: FIG_CLAIM,
      options: [
        { text: { en: "Draw the diameter from T, the point of tangency", af: "Trek die middellyn vanaf T, die raakpunt" }, correct: true },
        { text: { en: "Join OB instead, and work inside triangle OTB", af: "Verbind eerder OB, en werk binne driehoek OTB" } },
        { text: { en: "Draw a second tangent to the circle at B", af: "Trek 'n tweede raaklyn aan die sirkel by B" } },
        { text: { en: "Measure the tangent-chord angle with a protractor and stop there", af: "Meet die raaklyn–koord-hoek met 'n gradeboog en stop daar" } },
      ],
      hints: [
        { en: "Look back at the last round — which single line brought TWO free right angles into the picture at once, both anchored to points already on the picture?",
          af: "Kyk terug na die vorige rondte — watter enkele lyn het TWEE verniet-regte-hoeke gelyktydig in die prentjie gebring, altwee geanker aan punte reeds op die prentjie?" },
        { en: "The diameter from the point of tangency. Same tool, the other side of the chord: draw TD. Its far end still needs joining straight to P — that's the next panel's job.",
          af: "Die middellyn vanaf die raakpunt. Dieselfde hulpmiddel, die ander kant van die koord: trek TD. Die verste punt daarvan moet nog reguit aan P verbind word — dis die volgende paneel se werk." },
      ],
      reason: "construction",
      note: {
        en: "Same tool as the last round, whichever side of the chord the angle sits on: draw the diameter from T. It still hands you a free right angle at T (tan ⊥ diameter) — and once its far end is joined straight to P, a second free right angle there too, no matter which tangent ray the angle is measured from.",
        af: "Dieselfde hulpmiddel as die vorige rondte, ongeag aan watter kant van die koord die hoek sit: trek die middellyn vanaf T. Dit gee jou steeds 'n verniet regte hoek by T (raaklyn ⊥ middellyn) — en sodra die verste punt daarvan reguit aan P verbind is, ook 'n tweede verniet regte hoek daar, ongeag van watter raaklynstraal die hoek gemeet word.",
      },
    },

    /* ---------- 2 · THE TRAP — sprung, already drawn ---------- */
    {
      type: "choice",
      prompt: {
        en: "A classmate got the first step right: the diameter TD is down, and 90° between the tangent and TD is marked. The correct next move is to join D STRAIGHT to P, the point in the alternate segment — but instead they joined B to Q, another point on the circle, shown here. It IS a legal construction (B and Q both already exist). Does it actually reach the second 90° this proof needs though?",
        af: "'n Klasmaat het die eerste stap reg gekry: die middellyn TD is af, en 90° tussen die raaklyn en TD is gemerk. Die regte volgende stap is om D REGUIT aan P te verbind, die punt in die oorstaande segment — maar in plaas daarvan het hulle B aan Q verbind, nog 'n punt op die sirkel, hier gewys. Dit IS 'n wettige konstruksie (B en Q bestaan albei reeds). Bereik dit egter werklik die tweede 90° wat hierdie bewys nodig het?",
      },
      diagram: FIG_TRAP,
      options: [
        { text: { en: "No — BQ never touches D, so the diameter's guaranteed semicircle angle never appears anywhere useful", af: "Nee — BQ raak nooit D nie, dus verskyn die middellyn se gewaarborgde halfsirkel-hoek nêrens nuttig nie" }, correct: true },
        { text: { en: "Yes — angle in a semicircle now applies to triangle TBQ instead", af: "Ja — hoek in 'n halfsirkel geld nou vir driehoek TBQ in plaas daarvan" } },
        { text: { en: "Yes — BQ is a radius, so it's automatically equal to OT", af: "Ja — BQ is 'n radius, dus outomaties gelyk aan OT" } },
        { text: { en: "No — because the diameter isn't actually perpendicular to the tangent in this picture", af: "Nee — omdat die middellyn nie werklik loodreg op die raaklyn in hierdie prentjie is nie" } },
      ],
      hints: [
        { en: "The angle-in-a-semicircle theorem needs a triangle with the DIAMETER'S two endpoints as two of its vertices. Does triangle TBQ have T and D as two of its corners?",
          af: "Die hoek-in-'n-halfsirkel-stelling het 'n driehoek nodig met die MIDDELLYN se twee eindpunte as twee van sy hoekpunte. Het driehoek TBQ T en D as twee van sy hoeke?" },
        { en: "No — triangle TBQ never uses D at all. The 90° at T is real (tan ⊥ diameter), but it's the WRONG 90° for finishing this proof; the semicircle's 90° only ever shows up at a point joined to BOTH ends of the diameter — which is exactly what joining D straight to P would have done.",
          af: "Nee — driehoek TBQ gebruik nooit D nie. Die 90° by T is eg (raaklyn ⊥ middellyn), maar dit is die VERKEERDE 90° om hierdie bewys te voltooi; die halfsirkel se 90° verskyn net ooit by 'n punt wat aan ALBEI eindpunte van die middellyn verbind is — presies wat om D reguit aan P te verbind sou gedoen het." },
      ],
      reason: "construction",
      note: {
        en: "Being legal and being USEFUL are two different things. BQ is an honest chord — but it never touches D, so it can never trigger the angle-in-a-semicircle theorem, which needs a triangle built on BOTH ends of the diameter. The 90° already marked at T is real, but it's the wrong one to finish with: this proof needs a SECOND right angle, at the point joined to D — which is P, the actual point the claim is about, not a point picked at random.",
        af: "Om wettig te wees en om NUTTIG te wees is twee verskillende dinge. BQ is 'n eerlike koord — maar dit raak nooit D nie, dus kan dit nooit die hoek-in-'n-halfsirkel-stelling ontketen nie, wat 'n driehoek benodig wat op ALBEI eindpunte van die middellyn gebou is. Die 90° wat reeds by T gemerk is, is eg, maar dis die verkeerde een om mee klaar te maak: hierdie bewys benodig 'n TWEEDE regte hoek, by die punt wat aan D verbind is — dis P, die werklike punt waaroor die bewering gaan, nie 'n punt wat lukraak gekies is nie.",
      },
    },

    /* ---------- 3 · the correct construction, compressed ---------- */
    {
      type: "choice",
      prompt: {
        en: "Back to the correct join: D has been joined STRAIGHT to P this time, closing triangle TDP. The tangent-chord angle is T₁ = 120° (given, marked), tan ⊥ diameter gives 90° at T (marked) — since T₁ is BIGGER than 90° this time, the diameter sits BETWEEN the tangent and the chord, so T₂ (between the diameter and the chord) = T₁ − 90° = 30° (marked). P also gets a free 90° (angle in a semicircle, marked), and \"angles in the same segment\" carries T₂ straight across to ∠DPB = 30° (marked). What is ∠TPB, and how does it compare to T₁?",
        af: "Terug na die regte verbinding: D is hierdie keer REGUIT aan P verbind, wat driehoek TDP sluit. Die raaklyn–koord-hoek is T₁ = 120° (gegee, gemerk), raaklyn ⊥ middellyn gee 90° by T (gemerk) — aangesien T₁ hierdie keer GROTER as 90° is, sit die middellyn TUSSEN die raaklyn en die koord, dus T₂ (tussen die middellyn en die koord) = T₁ − 90° = 30° (gemerk). P kry ook 'n verniet 90° (hoek in 'n halfsirkel, gemerk), en \"hoeke in dieselfde segment\" dra T₂ reguit oor na ∠DPB = 30° (gemerk). Wat is ∠TPB, en hoe vergelyk dit met T₁?",
      },
      diagram: FIG_CORRECT,
      options: [
        { text: { en: "∠TPB = 90° + 30° = 120° — exactly T₁, the tangent-chord angle you started with", af: "∠TPB = 90° + 30° = 120° — presies T₁, die raaklyn–koord-hoek waarmee jy begin het" }, correct: true },
        { text: { en: "∠TPB = 30°, the same as T₂", af: "∠TPB = 30°, dieselfde as T₂" } },
        { text: { en: "∠TPB = 90° − 30° = 60°, the same split as the last round", af: "∠TPB = 90° − 30° = 60°, dieselfde verdeling as die vorige rondte" } },
        { text: { en: "∠TPB can't be pinned down without measuring it directly", af: "∠TPB kan nie vasgepen word sonder om dit direk te meet nie" } },
      ],
      hints: [
        { en: "∠TPD (= 90°, the free right angle at P) and ∠DPB (= 30°, just transferred) sit NEXT to each other, both inside ∠TPB — not one carved out of the other this time.",
          af: "∠TPD (= 90°, die verniet regte hoek by P) en ∠DPB (= 30°, pas oorgedra) sit langs mekaar, albei binne ∠TPB — nie een uit die ander uitgesny hierdie keer nie." },
        { en: "∠TPB = ∠TPD + ∠DPB = 90° + 30° = 120°. Same as the last round in spirit — the construction hands the tangent-chord angle straight back to itself, at the point in the alternate segment — but this time the two pieces ADD instead of one being subtracted from the other.",
          af: "∠TPB = ∠TPD + ∠DPB = 90° + 30° = 120°. Dieselfde as die vorige rondte in gees — die konstruksie gee die raaklyn–koord-hoek reguit terug aan homself, by die punt in die oorstaande segment — maar hierdie keer TEL die twee stukke BYMEKAAR in plaas daarvan dat een van die ander afgetrek word." },
      ],
      reason: "tanChord",
      note: {
        en: "∠TPB = ∠TPD + ∠DPB = 90° + 30° = 120° — exactly T₁, the tangent-chord angle this round started with. The picture flipped to the other side of the chord, and this time the two known pieces at P ADD instead of splitting a right angle, but the result is exactly what the last round proved: the tangent-chord angle always equals the angle in the alternate segment, whichever side you measure it from.",
        af: "∠TPB = ∠TPD + ∠DPB = 90° + 30° = 120° — presies T₁, die raaklyn–koord-hoek waarmee hierdie rondte begin het. Die prentjie het na die ander kant van die koord omgeswaai, en hierdie keer TEL die twee bekende stukke by P BYMEKAAR in plaas daarvan dat 'n regte hoek verdeel word, maar die resultaat is presies wat die vorige rondte bewys het: die raaklyn–koord-hoek is altyd gelyk aan die hoek in die oorstaande segment, ongeag van watter kant jy dit meet.",
      },
    },

    /* ---------- 4 · error-spotting: right conclusion, one wrong reason ---------- */
    {
      type: "choice",
      prompt: {
        en: "This solution reaches the right conclusion, ∠TPB = 120° — but one line has the WRONG reason written next to it. Which one?",
        af: "Hierdie oplossing kom by die regte gevolgtrekking uit, ∠TPB = 120° — maar een reël het die VERKEERDE rede langsaan geskryf. Watter een?",
      },
      diagram: FIG_CORRECT,
      solution: {
        caption: SOL_CAP,
        lines: [
          { st: "∠STD = 90°", rs: { en: "tan ⊥ diameter", af: "raaklyn ⊥ middellyn" } },
          { st: "T₂ = 120° − 90° = 30°" },
          { st: "∠TPD = 90°", rs: { en: "tan ⊥ diameter", af: "raaklyn ⊥ middellyn" } },
          { st: "∠DPB = 30°", rs: { en: "∠s in same segment", af: "∠e in dieselfde segment" } },
          { st: "∴ ∠TPB = 90° + 30° = 120° = T₁" },
        ],
      },
      options: [
        { text: { en: "∠TPD = 90°   (tan ⊥ diameter)", af: "∠TPD = 90°   (raaklyn ⊥ middellyn)" }, correct: true },
        { text: { en: "∠STD = 90°   (tan ⊥ diameter)", af: "∠STD = 90°   (raaklyn ⊥ middellyn)" } },
        { text: { en: "T₂ = 120° − 90° = 30°", af: "T₂ = 120° − 90° = 30°" } },
        { text: { en: "∠DPB = 30°   (∠s in same segment)", af: "∠DPB = 30°   (∠e in dieselfde segment)" } },
      ],
      hints: [
        { en: "This proof uses TWO different 90°s, from TWO different theorems. Check each one is credited to the theorem that actually produces it — one of them has borrowed the OTHER one's reason.",
          af: "Hierdie bewys gebruik TWEE verskillende 90°'e, van TWEE verskillende stellings. Kyk of elkeen aan die stelling gekrediteer word wat dit werklik lewer — een van hulle het die ANDER een se rede geleen." },
        { en: "∠STD = 90° really is \"tan ⊥ diameter\" (T is where the tangent touches). But ∠TPD = 90° is at P, nowhere near the tangent — that one is \"∠s in semi-circle\", not \"tan ⊥ diameter\".",
          af: "∠STD = 90° is werklik \"raaklyn ⊥ middellyn\" (T is waar die raaklyn raak). Maar ∠TPD = 90° is by P, nêrens naby die raaklyn nie — daardie een is \"∠ in halwe sirkel\", nie \"raaklyn ⊥ middellyn\" nie." },
      ],
      reason: "semiCircle",
      note: {
        en: "∠TPD = 90° is correct, but \"tan ⊥ diameter\" is the wrong reason for it — that theorem only ever produces a right angle AT the point of tangency, T. ∠TPD sits at P, a point on the circle seeing the diameter TD from the outside — that is \"∠s in semi-circle\", a different theorem that happens to also give 90° here.",
        af: "∠TPD = 90° is korrek, maar \"raaklyn ⊥ middellyn\" is die verkeerde rede daarvoor — daardie stelling lewer net ooit 'n regte hoek BY die raakpunt, T. ∠TPD sit by P, 'n punt op die sirkel wat die middellyn TD van buite af sien — dit is \"∠ in halwe sirkel\", 'n ander stelling wat toevallig ook hier 90° gee.",
      },
    },

    /* ---------- 5 · the legal-constructions thread, continued ---------- */
    {
      type: "choice",
      prompt: {
        en: "Partway through this proof, a learner wants to draw ONE new line to help. Only one of these four moves is actually allowed. Which construction is legal?",
        af: "Halfpad deur hierdie bewys wil 'n leerder EEN nuwe lyn teken om te help. Net een van hierdie vier skuiwe is werklik toegelaat. Watter konstruksie is wettig?",
      },
      diagram: FIG_LEGAL,
      options: [
        { text: { en: "Draw the diameter TD, from the point of tangency", af: "Trek die middellyn TD, vanaf die raakpunt" }, correct: true },
        { text: { en: "Draw a line through B parallel to the tangent", af: "Teken 'n lyn deur B ewewydig aan die raaklyn" } },
        { text: { en: "Construct a second tangent to the circle at B", af: "Konstrueer 'n tweede raaklyn aan die sirkel by B" } },
        { text: { en: "Assume ∠TPB = 120° first, then use that to finish the proof", af: "Neem eers aan ∠TPB = 120°, gebruik dit dan om die bewys klaar te maak" } },
      ],
      hints: [
        { en: "A legal move only ever uses points that ALREADY exist — join two of them, or draw a diameter through the centre and a point you already have. Which one of these four does only that?",
          af: "'n Wettige skuif gebruik net punte wat REEDS bestaan — verbind twee van hulle, of trek 'n middellyn deur die middelpunt en 'n punt wat jy reeds het. Watter een van hierdie vier doen net dit?" },
        { en: "T, O and the circle already exist — the diameter through T uses nothing new. The other three all hand you something nobody has proven yet: a line that never meets another (parallel), a line that touches the circle only once at a SECOND point (tangent at B), or — worst of all — the exact result the proof is trying to reach.",
          af: "T, O en die sirkel bestaan reeds — die middellyn deur T gebruik niks nuuts nie. Die ander drie gee jou almal iets wat niemand nog bewys het nie: 'n lyn wat nooit 'n ander ontmoet nie (parallel), 'n lyn wat die sirkel net een keer raak by 'n TWEEDE punt (raaklyn by B), of — die ergste van almal — die presiese resultaat wat die bewys probeer bereik." },
      ],
      reason: "construction",
      note: {
        en: "A diameter through a point you already have is always allowed — T, O and the circle give you TD for free, a guaranteed true line. The other three all smuggle in something extra: that two lines never meet (parallel), that a NEW line touches the circle only once (a second tangent, at B), or the exact result the proof is trying to reach, assumed up front. That last one is the sneakiest, because it FEELS like a shortcut. The classroom rule says it best: \"When we assume, we make an ass out of u and me.\"",
        af: "'n Middellyn deur 'n punt wat jy reeds het, is altyd toegelaat — T, O en die sirkel gee jou TD verniet, 'n gewaarborgde ware lyn. Die ander drie smokkel almal iets ekstra in: dat twee lyne nooit ontmoet nie (parallel), dat 'n NUWE lyn die sirkel net een keer raak ('n tweede raaklyn, by B), of die presiese resultaat wat die bewys probeer bereik, vooraf aangeneem. Daardie laaste een is die slinksste, want dit VOEL soos 'n kortpad. Die klaskamerreël sê dit die beste: \"When we assume, we make an ass out of u and me.\"",
      },
    },

    /* ---------- 6 · recap — the trap named, the result unchanged ---------- */
    {
      type: "note",
      prompt: { en: "What actually transferred", af: "Wat werklik oorgedra het" },
      diagram: FIG_CORRECT,
      note: {
        en: "The chord flipped to the other side of the tangent, the numbers are new — and the construction still did not care: draw the diameter from the point of tangency, join its far end STRAIGHT to the point you're asked about, and two free right angles chase the tangent-chord angle back to itself. This time they ADD instead of splitting, but the destination is identical. Joining B to some OTHER point on the circle instead of D to P (an honest mistake) is perfectly legal, and perfectly useless, because it never touches the diameter's own far end — no triangle, no guaranteed second 90°, no proof.<br><br>The tangent-chord angle always equals the angle in the alternate segment — on either side of the chord, every time.",
        af: "Die koord het na die ander kant van die raaklyn geswaai, die getalle is nuut — en die konstruksie het steeds nie omgegee nie: trek die middellyn vanaf die raakpunt, verbind die verste punt daarvan REGUIT aan die punt waaroor jy gevra is, en twee verniet-regte-hoeke jaag die raaklyn–koord-hoek terug na homself. Hierdie keer TEL hulle BYMEKAAR in plaas daarvan om te verdeel, maar die bestemming is identies. Om B aan 'n ANDER punt op die sirkel te verbind in plaas van D aan P ('n eerlike fout) is heeltemal wettig, en heeltemal nutteloos, want dit raak nooit die middellyn se eie verste punt nie — geen driehoek, geen gewaarborgde tweede 90°, geen bewys.<br><br>Die raaklyn–koord-hoek is altyd gelyk aan die hoek in die oorstaande segment — aan enige kant van die koord, elke keer.",
      },
    },

  ],
};
