/* Proof rounds P8b — "Which point do you join? (the paired exercise)"
   (MISCONCEPTION-PAIR-HANDOFF.md — the one FIX-ROUND-3 item that was left
   out, built 2026-08-12 in its own session on Megan's word.)
   ------------------------------------------------------------------------
   CANON: her Tan-chord Proof Misconception pages, 4 pages,
   `C:\Users\megzi\Desktop\Tan-chord Proof Misconception.pdf`, and her rule
   in the pink cloud, verbatim:

       "You must join the point that you are trying to prove!"
       (AF in the app: "jy moet die punt verbind wat jy probeer bewys")

   WHY THIS ROUND EXISTS, AND WHY IT ISN'T MORE pr8. pr7 and pr8 already
   teach the T4 construction and already spring the wrong-join trap once
   each — but both do it with ONE target per picture, so a learner can pass
   both while still believing the join is a memorised move ("after the
   diameter, join D to P"). Her pages are built the other way round: the
   SAME figure is asked TWICE, and the correct and wrong joins SWAP between
   the two questions. That swap is the whole lesson, and it cannot be
   taught with one target — you have to feel yesterday's wrong answer
   become today's right one. Hence a paired round.

   SHAPE — the handoff's option 2, chosen by Megan in session ("the kids
   need to choose which chord to join and identify whether another learner
   has drawn the construction correct or not"), plus the teaching slide she
   asked for ("add a slide explaining which two points we must always
   join"). This round therefore carries NO full algebra chain: pr7 (90°−x)
   and pr8 (90°+x) already own the chains, and repeating one here would
   bury the join question under arithmetic. What it does carry is the ONE
   step that makes the rule make sense — joining the diameter's far end to
   the target point drops a free 90° AT the target point (∠ in semi-circle),
   and joining it anywhere else drops an equally genuine 90° somewhere
   useless. That is exactly her "legal construction, right angle, wrong
   point" pedagogy, and it is one theorem deep, not a second chain.

   ELEVEN PANELS, same renderInvestigate() as pr0–pr9 — no new panel type,
   no typed answers, all taps:
     1  · note   — one picture, TWO questions. Both tangent-chord angles
         marked (x purple / y orange, one colour family per QUESTION); the
         two alternate-segment partners marked in the matching colour but
         unlabelled — those are what the questions ask for.
     2  · choice — Question 1 (prove ∠UTB = ∠TAB): diameter TD already
         down, 90° at T marked. Which ONE line now? (correct: D→A)
     3  · choice — JUDGE a classmate's construction for Question 1: they
         joined D→B, which is legal and does give a genuine ∠TBD = 90°
         (marked) — correct for THIS question or not? (correct: not — the
         right angle lands at B, and Question 1's angle lives at A)
     4  · note   — 🔑 HER SLIDE: which two points do we ALWAYS join. The
         far end of the diameter, and the point that HOSTS the angle you
         are proving. FIG shows the correct join with its 90° at A.
     5  · choice — Question 2, SAME picture (prove ∠STA = ∠TBA): which
         line now? (correct: D→B — the exact join that was the mistake
         three panels ago)
     6  · note   — the swap, named out loud: nothing about the picture
         changed, only the question did.
     7  · choice — NEW picture, new letters, her second figure (Q3: prove
         ∠RSU = ∠SVU) — which line? (correct: Q→V)
     8  · choice — JUDGE on the new picture: a classmate joined Q→U for
         Q3, giving a genuine ∠SUQ = 90° at U. Correct for Q3 or not?
     9  · choice — Question 4, SAME new picture (prove ∠VSW = ∠SUV):
         which line? (correct: Q→U — the swap again, on a picture whose
         letters share nothing with the first)
     10 · choice — REVERSE drill: the construction is already drawn (Q→V,
         90° at V). Which of the two questions is it set up to answer?
         Same rule, read backwards — the hardest of the four.
     11 · note   — recap: read the question FIRST, find the point that
         hosts the angle, join the diameter's far end to THAT point.
         Closes on her verbatim rule. Last panel of the round.

   NO CATCHPHRASE PANEL. Her assume-pun is used once per theorem arc and
   pr8 (panel 10) already spends the T4 arc's one use. A second use inside
   the same arc would break that ruling — this round closes on the JOIN
   rule instead, which is its own lesson anyway.

   COLOUR — one family per QUESTION, so the swap is visible and not just
   asserted. Hexes reused verbatim from pr5–pr8 so the whole proof group
   reads as one story (her explicit ask, overnight session C):
     PURPLE #9c36b5 — question 1's pair, and question 3's pair on the
                      second figure: the tangent-chord angle x and the
                      alternate-segment angle it must equal.
     ORANGE #f76707 — question 2's pair, and question 4's pair: the OTHER
                      tangent-chord angle y and its own partner.
     PINK   #e64980 — every structural 90°, whether it is the useful one
                      or the trap's: tan ⊥ diameter at the point of
                      tangency, and ∠ in semi-circle at whichever point
                      got joined. Deliberately the SAME pink for the trap's
                      90° as for the correct one — the trap's right angle
                      is every bit as real, and colouring it differently
                      would give the answer away before the question.
   Same family = same colour on label AND arc throughout.

   ALGEBRA ONLY (her FIX-ROUND-3 item 10 ruling, carried forward). No
   concrete degree value appears in any prompt, option, hint or note. The
   two tangent-chord angles are x and y; their partners are proved equal to
   x and y. The structural 90°s stay, per that ruling's own carve-out —
   they are fixed facts of the theorems being used, not measured results,
   and they are drawn as square marks rather than written numbers.

   ------------------------------------------------------------------------
   GEOMETRY — figure 1 (panels 1-6). Her page 1-2 figure, in the app's own
   letters: T is always the point of tangency and D is always its antipode
   (the far end of the diameter drawn from T), exactly as in pr7 and pr8,
   so the construction a learner just met transfers by name. Her E and D
   become A and B; her P (the diameter's far end) becomes D; her tangent
   A—B—C becomes the app's standard S—T—U.
     T:270 (tangency, tangent horizontal, S = tg−, U = tg+)
     D:90  (antipode of T — the diameter's far end)
     A:150 (upper left)   B:20 (right)
   Chords in the claim: TA, TB, AB (her sketch draws the third chord too).
   Every value below is an EXACT integer, engine-verified node-side with
   verifyDiagram() against these same leg definitions, not hand-arithmetic:
     ∠UTB = 55°  = x   — tangent-chord angle on the U side, standing on
                         chord TB; its alternate segment holds A
     ∠TAB = 55°  = x   — QUESTION 1's target (half arc TB = 110/2)
     ∠STA = 60°  = y   — tangent-chord angle on the S side, standing on
                         chord TA; its alternate segment holds B
     ∠TBA = 60°  = y   — QUESTION 2's target (half arc TA = 120/2)
     ∠STD = ∠UTD = 90° — tan ⊥ diameter, exact, always
     ∠TAD = 90°        — ∠ in semi-circle at A: the free right angle
                         QUESTION 1's correct join (D→A) buys
     ∠TBD = 90°        — ∠ in semi-circle at B: just as real, just as
                         automatic, and exactly what QUESTION 2's correct
                         join (D→B) buys — which is why it is the perfect
                         trap for Question 1 and the right answer for
                         Question 2. Same line, both times.
     ∠DTB = 35°, ∠DAB = 35°   (same segment on chord DB — not used in a
     ∠DTA = 30°, ∠DBA = 30°    chain here, listed because the figures mark
                               nothing else at those vertices and a future
                               session may want them)

   GEOMETRY — figure 2 (panels 7-10). Her page 3-4 figure, deliberately
   sharing NO letter with figure 1 (the transfer test is worthless if the
   learner can pattern-match on "join D to A"). Her own letters kept where
   they don't collide: S is the point of tangency, Q is the diameter's far
   end, U and V are the two circumference points. Her tangent R—S—T becomes
   R—S—W — W, not T, because T means "point of tangency" everywhere else in
   this app and reusing it as a tangent-ray label one panel after figure 1
   would be a genuine trip hazard.
     S:250 (tangency — tilted, so the picture cannot be recognised by its
            silhouette alone)   Q:70 (antipode of S)
     U:30   V:330
   Chords in the claim: SU, SV, UV (her sketch again draws the third).
   Note both circumference points sit on the SAME side this time — a
   nested arrangement, genuinely a different configuration from figure 1's
   straddle, not a rotation of it. Exact integers, engine-verified:
     ∠RSU = 110° = x   — tangent-chord angle on the R side (half arc SU
                         the long way = 220/2); alternate segment holds V
     ∠SVU = 110° = x   — QUESTION 3's target
     ∠VSW = 40°  = y   — tangent-chord angle on the W side (half arc SV =
                         80/2); alternate segment holds U
     ∠SUV = 40°  = y   — QUESTION 4's target
     ∠RSQ = ∠QSW = 90° — tan ⊥ diameter
     ∠SVQ = 90°        — ∠ in semi-circle at V: what QUESTION 3's correct
                         join (Q→V) buys
     ∠SUQ = 90°        — ∠ in semi-circle at U: what QUESTION 4's correct
                         join (Q→U) buys, and Question 3's trap
     ∠QSU = ∠QVU = 20° (same segment on chord QU)
     ∠QSV = 50°                                                          */

const AC = "#9c36b5";
const PURPLE = "#9c36b5";   // question 1 / question 3 pair — same value as pr7/pr8's target PURPLE
const ORANGE = "#f76707";   // question 2 / question 4 pair — same value as pr5/pr6's derived-pair ORANGE
const PINK = "#e64980";     // every structural 90° — same value as pr7/pr8's right-angle PINK

/* ================= FIGURE 1 — panels 1-6 ================= */

const F1_PTS = { T: 270, D: 90, A: 150, B: 20 };
const F1_TANG = [{ at: "T", lab: ["S", "U"] }];
const F1_CLAIM_CHORDS = [["T", "A"], ["T", "B"], ["A", "B"]];
/* claim chords + the diameter, shared by every panel from 2 on */
const F1_DIAM_CHORDS = [["T", "A"], ["T", "B"], ["A", "B"], ["T", "D"]];

/* the two tangent-chord angles, labelled — present on every figure-1 panel */
const F1_TANCHORD = [
  { at: "T", legs: ["tg+", "B"], t: "x", o: { v: 55, r: 52, c: PURPLE } },
  { at: "T", legs: ["A", "tg-"], t: "y", o: { v: 60, r: 52, c: ORANGE } },
];

/* ---- panel 1: the bare claim. Both tangent-chord angles labelled x and
   y; both alternate-segment partners marked in the matching colour but
   UNLABELLED — those are what the two questions ask for, so naming them
   here would hand over both answers.
   D is left OFF this figure entirely (its own pts, not the shared F1_PTS):
   her "Sketch given" pages show only the tangent, the chords and the
   angles — the diameter's far end appears for the first time on the
   "Correct construction" page. A labelled D sitting on the circle with no
   line attached would also pre-announce the first move on a panel whose
   only job is "here are the two questions". ---- */
const F1_CLAIM = {
  O: true, pts: { T: 270, A: 150, B: 20 }, tang: F1_TANG, chords: F1_CLAIM_CHORDS,
  angles: [
    ...F1_TANCHORD,
    { at: "A", legs: ["T", "B"], t: "", o: { v: 55, c: PURPLE } },
    { at: "B", legs: ["A", "T"], t: "", o: { v: 60, c: ORANGE } },
  ],
};

/* ---- panel 2: Question 1 asked. Diameter TD down, the 90° between the
   tangent and TD marked (pink square). Nothing joined yet — this panel IS
   the join question. ---- */
const F1_Q1_ASK = {
  O: true, pts: F1_PTS, tang: F1_TANG, chords: F1_DIAM_CHORDS,
  angles: [
    ...F1_TANCHORD,
    { at: "A", legs: ["T", "B"], t: "", o: { v: 55, c: PURPLE } },
    { at: "T", legs: ["tg+", "D"], t: "", o: { v: 90, mark: 1, c: PINK } },
  ],
};

/* ---- panel 3: the classmate's construction — D joined to B (highlighted),
   its genuine ∠TBD = 90° marked in the SAME pink the correct join's right
   angle will carry. Real, legal, and anchored to the wrong point for THIS
   question. ---- */
const F1_Q1_WRONG = {
  O: true, pts: F1_PTS, tang: F1_TANG,
  chords: [["T", "A"], ["T", "B"], ["A", "B"], ["T", "D"], { a: "D", b: "B", hl: PINK }],
  angles: [
    ...F1_TANCHORD,
    { at: "A", legs: ["T", "B"], t: "", o: { v: 55, c: PURPLE } },
    { at: "T", legs: ["tg+", "D"], t: "", o: { v: 90, mark: 1, c: PINK } },
    { at: "B", legs: ["T", "D"], t: "", o: { v: 90, mark: 1, c: PINK } },
  ],
};

/* ---- panel 4 (HER SLIDE): the correct join for Question 1 — D straight
   to A, the point that hosts the angle being proven — and the free 90° it
   drops right there. ---- */
const F1_Q1_RIGHT = {
  O: true, pts: F1_PTS, tang: F1_TANG,
  chords: [["T", "A"], ["T", "B"], ["A", "B"], ["T", "D"], { a: "D", b: "A", hl: PINK }],
  angles: [
    ...F1_TANCHORD,
    { at: "A", legs: ["T", "B"], t: "", o: { v: 55, c: PURPLE } },
    { at: "T", legs: ["tg+", "D"], t: "", o: { v: 90, mark: 1, c: PINK } },
    { at: "A", legs: ["T", "D"], t: "", o: { v: 90, mark: 1, c: PINK } },
  ],
};

/* ---- panel 5: Question 2 asked, same picture wiped back to the diameter
   only. The orange partner at B is marked (that's the new target); the
   purple one at A is gone — question 1 is over. ---- */
const F1_Q2_ASK = {
  O: true, pts: F1_PTS, tang: F1_TANG, chords: F1_DIAM_CHORDS,
  angles: [
    ...F1_TANCHORD,
    { at: "B", legs: ["A", "T"], t: "", o: { v: 60, c: ORANGE } },
    { at: "T", legs: ["D", "tg-"], t: "", o: { v: 90, mark: 1, c: PINK } },
  ],
};

/* ---- panel 6: Question 2's correct join — D to B. The SAME line panel 3
   called a mistake, highlighted the same way, with the same genuine 90°.
   That is the swap, drawn. ---- */
const F1_Q2_RIGHT = {
  O: true, pts: F1_PTS, tang: F1_TANG,
  chords: [["T", "A"], ["T", "B"], ["A", "B"], ["T", "D"], { a: "D", b: "B", hl: PINK }],
  angles: [
    ...F1_TANCHORD,
    { at: "B", legs: ["A", "T"], t: "", o: { v: 60, c: ORANGE } },
    { at: "T", legs: ["D", "tg-"], t: "", o: { v: 90, mark: 1, c: PINK } },
    { at: "B", legs: ["T", "D"], t: "", o: { v: 90, mark: 1, c: PINK } },
  ],
};

/* ================= FIGURE 2 — panels 7-10 ================= */

const F2_PTS = { S: 250, Q: 70, U: 30, V: 330 };
const F2_TANG = [{ at: "S", lab: ["R", "W"] }];
const F2_CLAIM_CHORDS = [["S", "U"], ["S", "V"], ["U", "V"]];
const F2_DIAM_CHORDS = [["S", "U"], ["S", "V"], ["U", "V"], ["S", "Q"]];

/* Both labels pinned explicitly rather than left to labelR(), which puts a
   40° wedge's label at 64 and a 110° one at 46 — the first drifts past the
   label-pinning standard (≤55 units from its vertex) and the second lands
   on the chord.
   x: r:42 with the arc widened to ar:32. At the default ar:25 the label
   sat 52 units out with its arc at 25, and rendering the sheet showed it
   reading as a letter floating loose in the middle of the circle rather
   than as the name of that wedge. Bisector runs up-left into open space,
   ~52 units clear of the centre dot.
   y: r:48 on the 40° wedge — its bisector points horizontally right from
   S, sitting mid-way between the tangent line below and chord SV above,
   ~16 units clear of each.
   Headless-probed at these values: no clipping, no pairwise overlap. */
const F2_TANCHORD = [
  { at: "S", legs: ["U", "tg-"], t: "x", o: { v: 110, r: 42, ar: 32, c: PURPLE } },
  { at: "S", legs: ["tg+", "V"], t: "y", o: { v: 40, r: 48, c: ORANGE } },
];

/* ---- panel 7: Question 3 asked. Diameter SQ down, tan ⊥ diameter marked
   on the R side (the side question 3's angle is measured from). ---- */
const F2_Q3_ASK = {
  O: true, pts: F2_PTS, tang: F2_TANG, chords: F2_DIAM_CHORDS,
  angles: [
    ...F2_TANCHORD,
    { at: "V", legs: ["U", "S"], t: "", o: { v: 110, c: PURPLE } },
    { at: "S", legs: ["Q", "tg-"], t: "", o: { v: 90, mark: 1, c: PINK } },
  ],
};

/* ---- panel 8: the classmate's construction on the new picture — Q joined
   to U (the short chord across the top, exactly her page-3 purple line),
   with its genuine ∠SUQ = 90°. ---- */
const F2_Q3_WRONG = {
  O: true, pts: F2_PTS, tang: F2_TANG,
  chords: [["S", "U"], ["S", "V"], ["U", "V"], ["S", "Q"], { a: "Q", b: "U", hl: PINK }],
  angles: [
    ...F2_TANCHORD,
    { at: "V", legs: ["U", "S"], t: "", o: { v: 110, c: PURPLE } },
    { at: "S", legs: ["Q", "tg-"], t: "", o: { v: 90, mark: 1, c: PINK } },
    { at: "U", legs: ["Q", "S"], t: "", o: { v: 90, mark: 1, c: PINK } },
  ],
};

/* ---- panel 9: Question 4 asked. Same picture, diameter only; the orange
   partner at U is the new target. ---- */
const F2_Q4_ASK = {
  O: true, pts: F2_PTS, tang: F2_TANG, chords: F2_DIAM_CHORDS,
  angles: [
    ...F2_TANCHORD,
    { at: "U", legs: ["V", "S"], t: "", o: { v: 40, c: ORANGE } },
    { at: "S", legs: ["tg+", "Q"], t: "", o: { v: 90, mark: 1, c: PINK } },
  ],
};

/* ---- panel 10 (reverse drill): the construction Q→V is already drawn,
   with its free 90° at V. NEITHER target angle is marked — the learner has
   to work out which question this construction was built for, which is the
   rule read backwards. ---- */
const F2_REVERSE = {
  O: true, pts: F2_PTS, tang: F2_TANG,
  chords: [["S", "U"], ["S", "V"], ["U", "V"], ["S", "Q"], { a: "Q", b: "V", hl: PINK }],
  angles: [
    ...F2_TANCHORD,
    { at: "V", legs: ["Q", "S"], t: "", o: { v: 90, mark: 1, c: PINK } },
  ],
};

export const round = {
  id: "pr8b", n: 0, accent: AC, kind: "proof", group: "g7",
  title: { en: "Which point do you join?", af: "Watter punt verbind jy?" },
  blurb: {
    en: "One picture, two questions — and the join that was wrong a moment ago is suddenly the right one.",
    af: "Een prentjie, twee vrae — en die verbinding wat pas verkeerd was, is skielik die regte een.",
  },
  panels: [

    /* ---------- 1 · one picture, two questions ---------- */
    {
      type: "note",
      prompt: { en: "One picture, two questions", af: "Een prentjie, twee vrae" },
      diagram: F1_CLAIM,
      note: {
        en: "STU is a tangent at T, and TWO chords leave T — one to A, one to B. So this picture has TWO tangent-chord angles, not one: <b style=\"color:#9c36b5\">x</b> on the U side (standing on chord TB) and <b style=\"color:#f76707\">y</b> on the S side (standing on chord TA).<br><br>Each one has its own alternate segment, so each one has its own question:<br>· <b style=\"color:#9c36b5\">Question 1 — prove ∠TAB = x</b> (the purple angle at A)<br>· <b style=\"color:#f76707\">Question 2 — prove ∠TBA = y</b> (the orange angle at B)<br><br>Same tangent. Same chords. Same diameter about to be drawn. Watch what happens to the construction when the question changes.",
        af: "STU is 'n raaklyn by T, en TWEE koorde vertrek vanaf T — een na A, een na B. Hierdie prentjie het dus TWEE raaklyn–koord-hoeke, nie een nie: <b style=\"color:#9c36b5\">x</b> aan die U-kant (staan op koord TB) en <b style=\"color:#f76707\">y</b> aan die S-kant (staan op koord TA).<br><br>Elkeen het sy eie oorstaande segment, dus het elkeen sy eie vraag:<br>· <b style=\"color:#9c36b5\">Vraag 1 — bewys ∠TAB = x</b> (die pers hoek by A)<br>· <b style=\"color:#f76707\">Vraag 2 — bewys ∠TBA = y</b> (die oranje hoek by B)<br><br>Dieselfde raaklyn. Dieselfde koorde. Dieselfde middellyn wat nou-nou getrek word. Kyk wat met die konstruksie gebeur wanneer die vraag verander.",
      },
    },

    /* ---------- 2 · Question 1 — which line? ---------- */
    {
      type: "choice",
      prompt: {
        en: "<b style=\"color:#9c36b5\">Question 1: prove ∠TAB = x.</b> The first move is already done — the diameter TD is drawn from the point of tangency, and tan ⊥ diameter has handed you a free 90° at T. Now you may join ONE more line. Which one?",
        af: "<b style=\"color:#9c36b5\">Vraag 1: bewys ∠TAB = x.</b> Die eerste stap is klaar — die middellyn TD is vanaf die raakpunt getrek, en raaklyn ⊥ middellyn het jou 'n verniet 90° by T gegee. Nou mag jy EEN lyn verbind. Watter een?",
      },
      diagram: F1_Q1_ASK,
      options: [
        { text: { en: "Join D to A", af: "Verbind D aan A" }, correct: true },
        { text: { en: "Join D to B", af: "Verbind D aan B" } },
        { text: { en: "Join O to A", af: "Verbind O aan A" } },
        { text: { en: "Draw a tangent to the circle at A", af: "Trek 'n raaklyn aan die sirkel by A" } },
      ],
      hints: [
        { en: "Read the question again before you look at the picture. Which POINT is the angle you have to prove sitting at?",
          af: "Lees die vraag weer voordat jy na die prentjie kyk. By watter PUNT sit die hoek wat jy moet bewys?" },
        { en: "∠TAB sits at A — so A is the point that needs help. Joining D to A closes triangle TDA and, because TD is a diameter and A is on the circle, drops a free right angle exactly where you need it.",
          af: "∠TAB sit by A — dus is A die punt wat hulp nodig het. Om D aan A te verbind sluit driehoek TDA en, omdat TD 'n middellyn is en A op die sirkel is, gee dit 'n verniet regte hoek presies waar jy dit nodig het." },
      ],
      reason: "construction",
      note: {
        en: "D joined to A. The angle you are proving, ∠TAB, lives at A — so A is the point that has to be connected to the construction. Join it to the far end of the diameter and the semicircle theorem hands you 90° at A for nothing.",
        af: "D aan A verbind. Die hoek wat jy bewys, ∠TAB, sit by A — dus is A die punt wat aan die konstruksie gekoppel moet word. Verbind dit aan die verste punt van die middellyn en die halfsirkelstelling gee jou 90° by A verniet.",
      },
    },

    /* ---------- 3 · JUDGE the classmate's construction ---------- */
    {
      type: "choice",
      prompt: {
        en: "A classmate answered <b style=\"color:#9c36b5\">Question 1</b> like this: diameter TD, then D joined to <b>B</b>. Their construction is perfectly legal, and it really does produce a right angle — ∠TBD = 90°, marked, because TD is a diameter and B is on the circle. Is it the right construction for THIS question?",
        af: "'n Klasmaat het <b style=\"color:#9c36b5\">Vraag 1</b> so beantwoord: middellyn TD, en dan D aan <b>B</b> verbind. Hulle konstruksie is heeltemal wettig, en dit lewer werklik 'n regte hoek — ∠TBD = 90°, gemerk, omdat TD 'n middellyn is en B op die sirkel is. Is dit die regte konstruksie vir HIERDIE vraag?",
      },
      diagram: F1_Q1_WRONG,
      options: [
        { text: { en: "No — the 90° lands at B, but Question 1's angle sits at A, and nothing joins B's right angle to A", af: "Nee — die 90° land by B, maar Vraag 1 se hoek sit by A, en niks koppel B se regte hoek aan A nie" }, correct: true },
        { text: { en: "Yes — it's legal and it gives a genuine 90°, so it must move the proof forward", af: "Ja — dit is wettig en dit gee 'n eg 90°, dus moet dit die bewys vorentoe neem" } },
        { text: { en: "No — ∠TBD isn't really 90° in this picture", af: "Nee — ∠TBD is nie werklik 90° in hierdie prentjie nie" } },
        { text: { en: "Yes — A and B are both on the circle, so a right angle at one counts at the other too", af: "Ja — A en B is albei op die sirkel, dus tel 'n regte hoek by een ook by die ander" } },
      ],
      hints: [
        { en: "Everything they wrote is TRUE. That isn't the test. The test is whether any of it touches the angle Question 1 actually asks about — and where does that angle sit?",
          af: "Alles wat hulle geskryf het, is WAAR. Dit is nie die toets nie. Die toets is of enigiets daarvan aan die hoek raak waaroor Vraag 1 werklik vra — en waar sit daardie hoek?" },
        { en: "Question 1 is about ∠TAB, at A. Their whole construction happens at B. A legal move that never reaches the point you're proving is a dead end, however true it is.",
          af: "Vraag 1 gaan oor ∠TAB, by A. Hulle hele konstruksie gebeur by B. 'n Wettige skuif wat nooit die punt bereik wat jy bewys nie, is 'n doodloopstraat, hoe waar dit ook al is." },
      ],
      reason: "semiCircle",
      note: {
        en: "This is the mistake that costs marks in a test, and it never looks like a mistake while you're making it: the construction is legal, the reason is right, the 90° is real. It just happens at B, and Question 1 is about A. Being TRUE and being USEFUL for this question are two different things.",
        af: "Dit is die fout wat punte in 'n toets kos, en dit lyk nooit soos 'n fout terwyl jy dit maak nie: die konstruksie is wettig, die rede is reg, die 90° is eg. Dit gebeur net by B, en Vraag 1 gaan oor A. Om WAAR te wees en om NUTTIG te wees vir hierdie vraag is twee verskillende dinge.",
      },
    },

    /* ---------- 4 · HER SLIDE — the two points we always join ---------- */
    {
      type: "note",
      prompt: { en: "🔑 Which two points do we always join?", af: "🔑 Watter twee punte verbind ons altyd?" },
      diagram: F1_Q1_RIGHT,
      note: {
        en: "Every tan-chord proof joins the SAME two points, every single time:<br><br><b>1. The far end of the diameter</b> — the point directly opposite the point of tangency. Here that's D, opposite T.<br><b>2. The point that hosts the angle you are trying to prove</b> — not the nearest point, not the other end of the chord. Here Question 1 asks about ∠TAB, and that angle sits at A. So: <b>join D to A.</b><br><br>Why those two? Because TD is a diameter, joining it to any point on the circle gives a free 90° there (∠ in semi-circle) — and you want that free right angle at the point you're proving, not somewhere else on the picture.<br><br>The rule, in her words: <b>you must join the point that you are trying to prove!</b>",
        af: "Elke raaklyn–koord-bewys verbind DIESELFDE twee punte, elke enkele keer:<br><br><b>1. Die verste punt van die middellyn</b> — die punt reg oorkant die raakpunt. Hier is dit D, oorkant T.<br><b>2. Die punt waar die hoek sit wat jy probeer bewys</b> — nie die naaste punt nie, nie die ander ent van die koord nie. Hier vra Vraag 1 oor ∠TAB, en daardie hoek sit by A. Dus: <b>verbind D aan A.</b><br><br>Hoekom daardie twee? Omdat TD 'n middellyn is, gee dit 'n verniet 90° by enige punt op die sirkel waaraan jy dit verbind (∠ in halwe sirkel) — en jy wil daardie verniet regte hoek hê by die punt wat jy bewys, nie êrens anders op die prentjie nie.<br><br>Die reël, in haar woorde: <b>jy moet die punt verbind wat jy probeer bewys!</b>",
      },
    },

    /* ---------- 5 · Question 2 — the swap ---------- */
    {
      type: "choice",
      prompt: {
        en: "<b style=\"color:#f76707\">Question 2, on exactly the same picture: prove ∠TBA = y</b> — the other tangent-chord angle, measured on the S side of the tangent. The diameter TD is down again and tan ⊥ diameter gives the 90° at T again. Which ONE line do you join now?",
        af: "<b style=\"color:#f76707\">Vraag 2, op presies dieselfde prentjie: bewys ∠TBA = y</b> — die ander raaklyn–koord-hoek, gemeet aan die S-kant van die raaklyn. Die middellyn TD is weer af en raaklyn ⊥ middellyn gee weer die 90° by T. Watter EEN lyn verbind jy nou?",
      },
      diagram: F1_Q2_ASK,
      options: [
        { text: { en: "Join D to B", af: "Verbind D aan B" }, correct: true },
        { text: { en: "Join D to A", af: "Verbind D aan A" } },
        { text: { en: "Join A to B — it's the only chord not yet used in a proof", af: "Verbind A aan B — dit is die enigste koord wat nog nie in 'n bewys gebruik is nie" } },
        { text: { en: "Join D to A again — the construction worked last time, so it works every time", af: "Verbind weer D aan A — die konstruksie het laas gewerk, dus werk dit elke keer" } },
      ],
      hints: [
        { en: "Don't reach for the line that worked a minute ago. Ask the same first question again: where does THIS question's angle sit?",
          af: "Moenie na die lyn gryp wat 'n minuut gelede gewerk het nie. Vra weer dieselfde eerste vraag: waar sit HIERDIE vraag se hoek?" },
        { en: "∠TBA sits at B this time. So B is the point that needs joining to D — the very line that was the mistake in Question 1.",
          af: "∠TBA sit hierdie keer by B. Dus is B die punt wat aan D verbind moet word — presies die lyn wat in Vraag 1 die fout was." },
      ],
      reason: "construction",
      note: {
        en: "D joined to B — the exact line a classmate got marked wrong for two panels ago. Nothing about the picture changed. The question changed, and the question is what decides the join.",
        af: "D aan B verbind — presies die lyn waarvoor 'n klasmaat twee panele gelede verkeerd gemerk is. Niks aan die prentjie het verander nie. Die vraag het verander, en die vraag is wat die verbinding bepaal.",
      },
    },

    /* ---------- 6 · the swap, named ---------- */
    {
      type: "note",
      prompt: { en: "Same picture. Opposite answer.", af: "Dieselfde prentjie. Teenoorgestelde antwoord." },
      diagram: F1_Q2_RIGHT,
      note: {
        en: "Look at what just happened.<br><br>· In <b style=\"color:#9c36b5\">Question 1</b>, joining D to B was the <b>mistake</b> and D to A was <b>correct</b>.<br>· In <b style=\"color:#f76707\">Question 2</b>, joining D to B is <b>correct</b> and D to A is the useless one.<br><br>Same circle, same tangent, same chords, same diameter. The only thing that moved was which angle you were asked to prove — and that flipped the answer completely.<br><br>So the join is <b>not a move you memorise</b>. It is a decision you make fresh every time, and you can only make it after you have read the question and found the point the angle sits at.",
        af: "Kyk wat het pas gebeur.<br><br>· In <b style=\"color:#9c36b5\">Vraag 1</b> was dit 'n <b>fout</b> om D aan B te verbind, en D aan A was <b>korrek</b>.<br>· In <b style=\"color:#f76707\">Vraag 2</b> is D aan B <b>korrek</b> en D aan A die nuttelose een.<br><br>Dieselfde sirkel, dieselfde raaklyn, dieselfde koorde, dieselfde middellyn. Al wat beweeg het, is watter hoek jy moes bewys — en dit het die antwoord heeltemal omgeswaai.<br><br>Die verbinding is dus <b>nie 'n skuif wat jy memoriseer nie</b>. Dit is 'n besluit wat jy elke keer opnuut neem, en jy kan dit eers neem nadat jy die vraag gelees en die punt gevind het waar die hoek sit.",
      },
    },

    /* ---------- 7 · new picture, Question 3 ---------- */
    {
      type: "choice",
      prompt: {
        en: "A completely new picture — new letters, nothing in common with the last one. RSW is a tangent at S, with chords SU and SV, and the diameter SQ is already drawn. <b style=\"color:#9c36b5\">Question 3: prove ∠SVU = x</b>, where x is the tangent-chord angle on the R side. Which ONE line do you join?",
        af: "'n Heeltemal nuwe prentjie — nuwe letters, niks in gemeen met die vorige een nie. RSW is 'n raaklyn by S, met koorde SU en SV, en die middellyn SQ is reeds getrek. <b style=\"color:#9c36b5\">Vraag 3: bewys ∠SVU = x</b>, waar x die raaklyn–koord-hoek aan die R-kant is. Watter EEN lyn verbind jy?",
      },
      diagram: F2_Q3_ASK,
      options: [
        { text: { en: "Join Q to V", af: "Verbind Q aan V" }, correct: true },
        { text: { en: "Join Q to U", af: "Verbind Q aan U" } },
        { text: { en: "Join O to U", af: "Verbind O aan U" } },
        { text: { en: "Draw a second tangent to the circle at V", af: "Trek 'n tweede raaklyn aan die sirkel by V" } },
      ],
      hints: [
        { en: "The letters are all different, but the question you ask yourself is identical. Which point does ∠SVU sit at?",
          af: "Die letters is almal anders, maar die vraag wat jy jouself vra, is identies. By watter punt sit ∠SVU?" },
        { en: "The middle letter of ∠SVU is V, so the angle sits at V. Join the diameter's far end, Q, to V.",
          af: "Die middelste letter van ∠SVU is V, dus sit die hoek by V. Verbind die middellyn se verste punt, Q, aan V." },
      ],
      reason: "construction",
      note: {
        en: "Q joined to V. The letters changed, the picture tilted, the two points ended up on the same side of the tangent instead of straddling it — and none of that mattered. ∠SVU sits at V, so V is the point that gets joined to the far end of the diameter.",
        af: "Q aan V verbind. Die letters het verander, die prentjie is skuins, en die twee punte het aan dieselfde kant van die raaklyn beland in plaas van weerskante — en niks daarvan het saak gemaak nie. ∠SVU sit by V, dus is V die punt wat aan die verste punt van die middellyn verbind word.",
      },
    },

    /* ---------- 8 · JUDGE on the new picture ---------- */
    {
      type: "choice",
      prompt: {
        en: "Another classmate's answer to <b style=\"color:#9c36b5\">Question 3</b>: diameter SQ, then Q joined to <b>U</b>. Again it's legal, and again it gives a real right angle — ∠SUQ = 90°, marked, angle in a semicircle. Is it the right construction for Question 3?",
        af: "Nog 'n klasmaat se antwoord op <b style=\"color:#9c36b5\">Vraag 3</b>: middellyn SQ, en dan Q aan <b>U</b> verbind. Weer is dit wettig, en weer gee dit 'n egte regte hoek — ∠SUQ = 90°, gemerk, hoek in 'n halfsirkel. Is dit die regte konstruksie vir Vraag 3?",
      },
      diagram: F2_Q3_WRONG,
      options: [
        { text: { en: "No — the right angle lands at U, but Question 3 asks about the angle at V", af: "Nee — die regte hoek land by U, maar Vraag 3 vra oor die hoek by V" }, correct: true },
        { text: { en: "Yes — U is closer to Q, so it's the natural point to join", af: "Ja — U is nader aan Q, dus is dit die natuurlike punt om te verbind" } },
        { text: { en: "Yes — any join from Q works, because Q is the end of a diameter", af: "Ja — enige verbinding vanaf Q werk, want Q is die ent van 'n middellyn" } },
        { text: { en: "No — QU is too short to be a legal construction line", af: "Nee — QU is te kort om 'n wettige konstruksielyn te wees" } },
      ],
      hints: [
        { en: "Same test as before: is the free 90° landing at the point the question is about, or at a different point that happens to be nearby?",
          af: "Dieselfde toets as voorheen: land die verniet 90° by die punt waaroor die vraag gaan, of by 'n ander punt wat toevallig naby is?" },
        { en: "Question 3 is about ∠SVU, at V. This construction's right angle is at U. Distance has nothing to do with it — U being the closest point to Q is exactly the habit that causes this mistake.",
          af: "Vraag 3 gaan oor ∠SVU, by V. Hierdie konstruksie se regte hoek is by U. Afstand het niks daarmee te doen nie — dat U die naaste punt aan Q is, is presies die gewoonte wat hierdie fout veroorsaak." },
      ],
      reason: "semiCircle",
      note: {
        en: "Wrong point again, and this time it's tempting for a different reason: QU is the short, obvious-looking line and QV is the long one across the circle. Neatness is not a proof. The angle being proven sits at V, so the join goes to V — however awkward the line looks.",
        af: "Weer die verkeerde punt, en hierdie keer is dit om 'n ander rede aanloklik: QU is die kort, ooglopende lyn en QV is die lang een oor die sirkel. Netheid is nie 'n bewys nie. Die hoek wat bewys word, sit by V, dus gaan die verbinding na V — hoe ongemaklik die lyn ook al lyk.",
      },
    },

    /* ---------- 9 · Question 4 — the swap, second figure ---------- */
    {
      type: "choice",
      prompt: {
        en: "<b style=\"color:#f76707\">Question 4, same new picture: prove ∠SUV = y</b> — the other tangent-chord angle, measured on the W side. Which ONE line do you join now?",
        af: "<b style=\"color:#f76707\">Vraag 4, dieselfde nuwe prentjie: bewys ∠SUV = y</b> — die ander raaklyn–koord-hoek, gemeet aan die W-kant. Watter EEN lyn verbind jy nou?",
      },
      diagram: F2_Q4_ASK,
      options: [
        { text: { en: "Join Q to U", af: "Verbind Q aan U" }, correct: true },
        { text: { en: "Join Q to V", af: "Verbind Q aan V" } },
        { text: { en: "Join U to V", af: "Verbind U aan V" } },
        { text: { en: "Join Q to V again — that was the correct join on this picture", af: "Verbind weer Q aan V — dit was die regte verbinding op hierdie prentjie" } },
      ],
      hints: [
        { en: "Middle letter. ∠SUV — which point is it sitting at?",
          af: "Middelste letter. ∠SUV — by watter punt sit dit?" },
        { en: "U. So join Q to U — the join that was the classmate's mistake one panel ago, exactly the same swap that happened on the first picture.",
          af: "U. Verbind dus Q aan U — die verbinding wat een paneel gelede die klasmaat se fout was, presies dieselfde omruil as op die eerste prentjie." },
      ],
      reason: "construction",
      note: {
        en: "Q to U. The swap happened again, on a picture that shares not one letter with the first — which is how you know it's the rule doing the work and not a memory of where the line went last time.",
        af: "Q aan U. Die omruil het weer gebeur, op 'n prentjie wat nie een letter met die eerste deel nie — en dis hoe jy weet dis die reël wat die werk doen en nie 'n herinnering aan waar die lyn laas gegaan het nie.",
      },
    },

    /* ---------- 10 · reverse drill: read the construction backwards ---------- */
    {
      type: "choice",
      prompt: {
        en: "Last one, and it runs the other way round. Here is a finished construction on the same picture: diameter SQ, and Q joined to V, giving 90° at V. Nobody has told you which question it belongs to. Which one was it built to answer?",
        af: "Laaste een, en dit werk andersom. Hier is 'n voltooide konstruksie op dieselfde prentjie: middellyn SQ, en Q aan V verbind, wat 90° by V gee. Niemand het jou gesê aan watter vraag dit behoort nie. Watter een is dit gebou om te beantwoord?",
      },
      diagram: F2_REVERSE,
      options: [
        { text: { en: "Prove ∠SVU = x — the tangent-chord angle on the R side", af: "Bewys ∠SVU = x — die raaklyn–koord-hoek aan die R-kant" }, correct: true },
        { text: { en: "Prove ∠SUV = y — the tangent-chord angle on the W side", af: "Bewys ∠SUV = y — die raaklyn–koord-hoek aan die W-kant" } },
        { text: { en: "Either one — the same construction serves both questions", af: "Enigeen — dieselfde konstruksie dien albei vrae" } },
        { text: { en: "Neither — a construction can't tell you anything about the question", af: "Nie een nie — 'n konstruksie kan jou niks oor die vraag vertel nie" } },
      ],
      hints: [
        { en: "The construction has put its free right angle at one particular point. Which point? And which of the two questions is about an angle sitting there?",
          af: "Die konstruksie het sy verniet regte hoek by een bepaalde punt gesit. Watter punt? En watter een van die twee vrae gaan oor 'n hoek wat daar sit?" },
        { en: "The 90° is at V. Only one of the two questions is about an angle at V, and that's ∠SVU. Read the join, and it tells you the target.",
          af: "Die 90° is by V. Net een van die twee vrae gaan oor 'n hoek by V, en dit is ∠SVU. Lees die verbinding, en dit vertel jou die teiken." },
      ],
      reason: "construction",
      note: {
        en: "The rule works in both directions. Given the question, you can find the join; given the join, you can name the question it answers. Both come from the same single fact — the free right angle lands at whichever point got joined, and that has to be the point hosting the angle you're proving.<br><br>Which also means: if you can't say which point your join is helping, your join isn't helping.",
        af: "Die reël werk in albei rigtings. Gegee die vraag, kan jy die verbinding kry; gegee die verbinding, kan jy die vraag noem wat dit beantwoord. Albei kom uit dieselfde enkele feit — die verniet regte hoek land by watter punt ook al verbind is, en dit moet die punt wees waar die hoek sit wat jy bewys.<br><br>Wat ook beteken: as jy nie kan sê watter punt jou verbinding help nie, help jou verbinding nie.",
      },
    },

    /* ---------- 11 · recap ---------- */
    {
      type: "note",
      prompt: { en: "Before you join anything", af: "Voordat jy iets verbind" },
      diagram: F1_Q1_RIGHT,
      note: {
        en: "Four questions, two pictures, and the construction was different every time even though two of them were on the identical figure. So there is nothing to memorise about where the line goes — there is only an order to work in:<br><br><b>1. Read the question and find the angle you must prove.</b><br><b>2. Find the POINT that angle sits at</b> — the middle letter of the three.<br><b>3. Draw the diameter from the point of tangency.</b><br><b>4. Join its far end to THAT point</b>, and the free 90° lands exactly where you need it.<br><br>A join to any other point on the circle is still legal, and still gives a genuine right angle. It just gives it somewhere you can't use — which is why this mistake survives all the way into the exam without ever feeling like a mistake.<br><br><b>You must join the point that you are trying to prove!</b>",
        af: "Vier vrae, twee prentjies, en die konstruksie was elke keer anders — al was twee van hulle op presies dieselfde figuur. Daar is dus niks te memoriseer oor waar die lyn gaan nie — daar is net 'n volgorde om in te werk:<br><br><b>1. Lees die vraag en kry die hoek wat jy moet bewys.</b><br><b>2. Kry die PUNT waar daardie hoek sit</b> — die middelste letter van die drie.<br><b>3. Trek die middellyn vanaf die raakpunt.</b><br><b>4. Verbind die verste punt daarvan aan DAARDIE punt</b>, en die verniet 90° land presies waar jy dit nodig het.<br><br>'n Verbinding na enige ander punt op die sirkel is steeds wettig, en gee steeds 'n egte regte hoek. Dit gee dit net êrens waar jy dit nie kan gebruik nie — en dis hoekom hierdie fout heeltemal tot in die eksamen oorleef sonder om ooit soos 'n fout te voel.<br><br><b>Jy moet die punt verbind wat jy probeer bewys!</b>",
      },
    },

  ],
};
