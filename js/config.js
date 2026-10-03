/* ============================================================
   GAME CONFIG — tunable rules in one place.
   ============================================================ */
export const CONFIG = {
  // XP economy
  xpPerCorrect: 10,
  firstTryBonus: 5,        // extra XP when correct on the first attempt of a question
  streakStep: 2,           // streak bonus = streakStep * (current streak, capped)
  streakCap: 5,            // streak bonus stops growing after this many in a row
  // daily challenge
  dailyXp: 25,             // flat XP for completing the Daily Challenge (server grants this, once per local day)
  perfectWeekXp: 50,       // one-off bonus for completing the daily on ALL 7 days of a Mon–Sun week (everyone who earns it gets it)
  // streak milestones — a reward SPIKE on top of the daily streak, so day 3
  // and day 30 feel different instead of the counter just ticking up. XP is
  // granted server-side (cgg_award_streak_milestone, phase11.sql) — this
  // list is mirrored there so a tampered client can't invent its own number.
  streakMilestones: [
    { days: 3,  xp: 15,  label: { en: "On a Roll",         af: "Op Dreef" } },
    { days: 7,  xp: 30,  label: { en: "One Week Strong",   af: "'n Week Sterk" } },
    { days: 14, xp: 50,  label: { en: "Two Weeks!",        af: "Twee Weke!" } },
    { days: 30, xp: 100, label: { en: "Circle Legend",     af: "Sirkel Legende" } },
  ],
  // round pass rule
  passThreshold: 0.8,      // 80% correct (first-try) to pass a round and earn its badge
  // Investigation Station: XP IS PER PANEL — every panel of a station pays this,
  // whatever the panel type, and NEVER scaled by attempts or by correctness. A
  // learner who fights through five attempts has investigated MORE, not less;
  // struggle is the product here. (Her call, 2026-07-30: "they earn XP for each
  // panel, shame." That reverses the old flat-50-per-station rule and only that
  // half of it — see js/investigate.js's header for the half that still stands.)
  //
  // It is still BANKED ONCE, at the end of the station, as panels.length × this
  // rate; each panel shows a "+10 XP" tick on the way so it FEELS per-panel.
  // Her call, asked and answered 2026-07-30: the tick is enough. Genuinely
  // banking mid-station would need a record of which panels already paid (a
  // learner who quits always restarts at panel 1 today, so replaying panels 1-5
  // would pay for them twice), plus resume screens — a build of its own.
  //
  // ⚠️ THE STATIONS NOW PAY DIFFERENT AMOUNTS, on purpose: 7/5/5/6/6/5 panels =
  // 70/50/50/60/60/50 XP, 340 for the line (300 under the old flat rule). Never
  // hard-code any of those numbers in copy — compute them from panels.length, so
  // a station that gains a panel in Chunk D cannot start promising the old total.
  investigationXpPerPanel: 10,
  // Proof rounds (group g7, PROOF-ROUNDS-PLAN.md) pay the same way and, for now,
  // the same rate — one sibling key rather than reusing investigationXpPerPanel,
  // because the two lines are allowed to diverge later without a rename. Same
  // rules apply: per PANEL, never per attempt, computed from panels.length in
  // js/investigate.js's finish(), never hard-coded as a round total.
  proofXpPerPanel: 10,
  // Dynamic Geometry rounds (group g8, DYNAMIC-GEO-PLAN.md) pay the same way,
  // its own sibling key for the same reason proofXpPerPanel is its own key
  // rather than reusing investigationXpPerPanel: allowed to diverge later
  // without a rename. Per PANEL, never per attempt, computed from
  // panels.length in js/investigate.js's finish() — never hard-coded.
  dynamicXpPerPanel: 10,
  // Eweredigheid mini rounds (group g9, Gr12 only, EWEREDIGHEID-PLAN.md) pay
  // per QUESTION, banked once at the end of the round (js/ewe.js finish()),
  // computed from the round's question count, never hard-coded as a total.
  // Same rate as the other lines for now; her open ruling is whether a mini
  // round should pay less. Its own key so it can change without a rename.
  eweXpPerQuestion: 10,
  // ---- ARE THE EWEREDIGHEID ROUNDS RELEASED? ----
  // Same one-flag hiding as dynamicLive: false = no 📏 card on the home
  // screen, and the `ewes` / `ewe` routes bounce back home.
  //
  // Added 2026-09-29, shipped FALSE: round 1 is built, not yet played
  // through by her.
  // RELEASED 2026-10-03: ew1 to ew5 (her ship ruling, 3 Oct 08:39). Rounds
  // still waiting stay out through eweHeld below, not through this flag.
  //
  // ⚠️ This flag is only HALF the gate. The card and routes also need the
  // logged-in learner's OWN class to be gr12 (read off the server, see
  // js/ewe.js eweVisible) — a Gr11 learner never sees it, true or false.
  //
  // `?ewe=1` overrides the flag (never the class check), for previewing.
  eweLive: true,
  // ---- EWEREDIGHEID ROUNDS HELD BACK ----
  // Rounds listed here are built and approved but not yet released. A live
  // learner never sees them (not on the map, not in the "{n} van {total}
  // klaar" count, not as the next round, not by a guessed link) and the
  // admin dashboard leaves them out too. `?ewe=1` (her preview and the
  // tools) still shows them. Empty the list to release them.
  // Read once, in js/rounds/index.js (the filter on ROUNDS).
  // RELEASED 2026-10-03: ew6 "Die trapesium" and ew7 "Vreemde formaat" (her
  // ship-yes, 3 Oct 09:56). The next round built (ew8) goes in here first.
  // RELEASED 2026-10-03: ew8 "Driehoeke of sye?" (her ship-yes, 3 Oct 12:40).
  // The next round built (ew9) goes in here first.
  // RELEASED 2026-10-03: ew9 "Lees dit af" (her ship-yes, 3 Oct 16:07).
  // RELEASED 2026-10-03: ew10 "Die bewys", the last round (her ship-yes,
  // 3 Oct 19:39). All ten Eweredigheid rounds are out; a new round built
  // later goes in here first.
  eweHeld: [],
  // ---- IS DYNAMIC GEOMETRY RELEASED TO LEARNERS? ----
  // Same one-flag hiding as stationsLive below: false = no 🧲 card on the home
  // screen, and the `dynamics` / `dynamic` routes bounce back home, so a
  // guessed or shared URL cannot reach it either.
  //
  // Added 2026-09-04 — her call: the dg rounds are built but not yet reviewed,
  // so they ship dark ("safe to push but not make visible to the kids yet").
  // Flip to true once she has played through them and says release.
  //
  // `?dynamic=1` overrides the flag either way, for previewing.
  dynamicLive: false,
  // ---- IS THE INVESTIGATION STATION RELEASED TO LEARNERS? ----
  // false = the line is completely invisible: no train strip on the home screen,
  // and the `stations` / `investigate` routes bounce back home, so a learner who
  // guesses a URL still cannot reach it.
  // true  = the line is visible to the classes listed in `stationsFor` below,
  // and to nobody else.
  //
  // REOPENED 2026-10-02 for the Gr12 group only — her call. The unlock is
  // unchanged: stop 1 still opens only once a learner has passed round 21 (the
  // end of the 43-round main line, FINAL_QUEST_ROUND_ID in js/rounds/index.js),
  // so until then a Gr12 learner sees the strip greyed out ("opens when the
  // main line is done"). Next year's Grade 11s get the line by adding "gr11"
  // to `stationsFor`, nothing else. The check-answer edge function still needs
  // a valid ANTHROPIC_API_KEY in the Supabase secrets: it is what marks the
  // nine typed panels, and without one those panels give hints only.
  //
  // HIDDEN 2026-08-06 — her call. That year's class had finished with the
  // line and the ANTHROPIC_API_KEY behind the typed-panel marker had expired,
  // so there was no reason to keep showing it. NOT retired and NOT deleted:
  // the six stations, every panel, the panel_memos rows in Supabase and the
  // learners' completed progress were all left exactly as they were.
  //
  // It was RELEASED 2026-07-30 — her call at the end of the Chunk D session,
  // after she play-tested the whole line herself: "make it visible for the
  // learners" — and ran live for a week.
  //
  // ⚠️ This flag is only HALF the gate, like eweLive. The strip and routes
  // also need the logged-in learner's OWN class to be in `stationsFor` (read
  // off the server, see js/stations.js stationsVisible) — a class that is not
  // listed never sees it, true or false.
  //
  // `?stations=1` overrides the flag (never the class check), for previewing.
  stationsLive: true,
  // The classes that see the Investigation Station while stationsLive is true.
  stationsFor: ["gr12"],
  // struggling-learner support ("Boost mode")
  rescueAfterFails: 2,     // after this many failed attempts, replays get open hints + second chances
  comebackBonus: 40,       // extra XP for finally passing a round on the 3rd+ attempt
  /* Replays pay again (2026-07-30, her call) — a passed round used to pay 0
     forever, so there was no reason to go back to one. Plays 2 and 3 pay HALF;
     the 4th onwards pays nothing. Half, not full, so revisiting an easy round
     can never out-earn pushing into a new one on the weekly board.
     ⚠️ These two numbers are for DISPLAY. The real rule lives server-side in
     cgg_submit_round (phase18.sql), because the client is editable and this is
     the number an honest learner would otherwise be able to farm. The results
     screen shows the server's `xpAwarded`, never this estimate. */
  replayXpFactor: 0.5,
  replayMaxPaid: 2,        // paid REPLAYS per round (so 3 paying plays in all)
  // admin / participation
  inactiveDays: 7,         // learners not active in this many days get flagged in admin
  // weekly leaderboard resets every Monday 00:00 (handled server-side)
};

// The five brand accents from the tan-chord page, reused across rounds.
export const ACCENTS = ["#e64980", "#f76707", "#0ea271", "#4263eb", "#9c36b5"];
export const INK = "#252a4a";

/* ============================================================
   BADGE GROUPS — earned by completing every round of a group.
   The nine theorems are split into three groups; the mixed rounds
   form two more. A round belongs to a group via its `group` field
   (set in rounds/index.js). Earn a group's badge by passing all of
   its rounds. Intro rounds (group "intro") carry no badge.
   ============================================================ */
export const GROUPS = [
  { id: "g1", icon: "🎯", name: "Centre Seeker",
    blurb: { en: "Midpoints of a Circle — line from the centre, angle at the centre, semicircle.",
             af: "Middelpunte van 'n Sirkel — lyn vanaf die middelpunt, hoek by die middelpunt, halfsirkel." } },
  { id: "g2", icon: "🎓", name: "Cyclic Scholar",
    blurb: { en: "Circumference of a Circle — same segment, equal chords, cyclic quads.",
             af: "Omtrek van 'n Sirkel — selfde segment, gelyke koorde, koordevierhoeke." } },
  { id: "g3", icon: "📐", name: "Tangent Tamer",
    blurb: { en: "Tangents — tangent ⊥ radius, tangent–chord, tangents from a point.",
             af: "Raaklyne — raaklyn ⊥ radius, raaklyn–koord, raaklyne vanuit 'n punt." } },
  { id: "g4", icon: "🔍", name: "Circle Detective",
    blurb: { en: "Spot the theorem and solve multi-step riders.",
             af: "Herken die stelling en los veelstap-vraagstukke op." } },
  { id: "g5", icon: "🏆", name: "Circle Grand Master",
    blurb: { en: "Tough mixed exam-style riders.",
             af: "Moeilike gemengde eksamen-styl vraagstukke." } },
  // `hidden` = earned and celebrated exactly like the others, but kept OFF the
  // rank ladder and the badge counter (Megan's ruling, 2026-07-30). The ladder
  // reads the learner's rank as the LAST earned badge, so letting g6 join it
  // quietly demoted a finisher from 🏆 Circle Grand Master to 🚂 Line Inspector
  // and turned the counter into 5/6. Finishing the 43 rounds must still end on
  // Grand Master, so the station badge lives on the station map instead, and the
  // train strip shows "N of 6 stations visited".
  { id: "g6", icon: "🚂", name: "Line Inspector", hidden: true,
    blurb: { en: "Investigation Station — conjecture, counterexample, proof and explanation.",
             af: "Ondersoekstasie — vermoede, teenvoorbeeld, bewys en verduideliking." } },
  // g7 = the proof rounds (PROOF-ROUNDS-PLAN.md), built incrementally starting
  // with P0. `hidden` for the same reason as g6 above: LADDER_GROUPS filters it
  // out of the ladder and the "x/5 badges" stat, so a learner who has finished
  // the 43 main rounds keeps reading 5/5 badges and rank 🏆 Circle Grand Master —
  // not a demotion to 5/6 the moment this group exists at all, and not a
  // demotion again on every session that adds another proof round to it before
  // the group is complete. The badge is still earned and still celebrates once
  // every round CURRENTLY in the group is passed (js/game.js's groupEarned
  // check doesn't look at `hidden`) — it just never sits on the rank ladder.
  { id: "g7", icon: "🔗", name: "Proof Pioneer", hidden: true,
    blurb: { en: "Proof rounds — why proofs matter, then construct, prove and spot the trap for each theorem.",
             af: "Bewysrondtes — hoekom bewyse saak maak, en dan konstrueer, bewys en vang die strik vir elke stelling." } },
  // g8 = the Dynamic Geometry rounds (DYNAMIC-GEO-PLAN.md), built incrementally
  // starting with dg0 + dg1 (build session 1). `hidden` for the same reason as
  // g6/g7 above: LADDER_GROUPS filters it out of the ladder and the "x/5
  // badges" stat, so a learner who has finished the 43 main rounds keeps
  // reading 5/5 and rank 🏆 Circle Grand Master, not a demotion every time this
  // session's group grows another round. Still earned and still celebrates
  // once every round CURRENTLY in the group is passed.
  { id: "g8", icon: "🧲", name: "Dynamic Geometry", hidden: true,
    blurb: { en: "Dynamic Geometry rounds — drag it, glide it, freeze it, and answer with theorems you already know.",
             af: "Dinamiese Meetkunde-rondtes — trek dit, laat dit gly, vries dit, en beantwoord met stellings wat jy reeds ken." } },
  // g9 = the Eweredigheid mini rounds (Gr12 only, EWEREDIGHEID-PLAN.md).
  // `hidden` for the same reason as g6/g7/g8: off the rank ladder and the
  // "x/5 badges" stat. Afrikaans only (her ruling), so the blurb is one plain
  // Afrikaans string, not an {en, af} pair.
  { id: "g9", icon: "📏", name: "Eweredigheid", hidden: true,
    blurb: "Eweredigheid: watter sye hoort saam, en hoe skryf jy dit neer." },
];
/* The badges that count towards the rank ladder and the "x/5 badges" stat. */
export const LADDER_GROUPS = GROUPS.filter(g => !g.hidden);
export const BASE_RANK = "Newcomer";

/* ============================================================
   AVATARS — the curated emoji picker for the nickname/avatar
   profile (js/profile.js). Fixed list, no freeform upload, so it
   stays school-appropriate and gender-neutral (animals / creatures /
   space / nature / sport / music — no flags, no skin-toned faces).
   The ids here are mirrored server-side in supabase/phase14.sql
   (cgg_set_profile validates p_avatar against the same list) — if
   you add an avatar here, add its id to that allow-list too.
   "circle" doubles as the neutral DEFAULT_AVATAR: what a learner
   who skips profile setup gets, and the fallback for any student
   row with no avatar_id yet (pre-migration or never set).
   Each avatar carries a `cat` id; AVATAR_CATS below drives the
   grouped headings in the picker (js/profile.js) — display only,
   the server never sees categories.
   ============================================================ */
export const AVATAR_CATS = [
  { id: "animals",   label: { en: "Animals",           af: "Diere" } },
  { id: "creatures", label: { en: "Creatures & robots", af: "Wesens & robotte" } },
  { id: "space",     label: { en: "Space",             af: "Ruimte" } },
  { id: "nature",    label: { en: "Nature",            af: "Natuur" } },
  { id: "sport",     label: { en: "Sport & games",     af: "Sport & speletjies" } },
  { id: "fun",       label: { en: "Music & food",      af: "Musiek & kos" } },
];
export const AVATARS = [
  { id: "fox",        emoji: "🦊", cat: "animals", label: { en: "Fox",        af: "Jakkals" } },
  { id: "owl",         emoji: "🦉", cat: "animals", label: { en: "Owl",        af: "Uil" } },
  { id: "otter",       emoji: "🦦", cat: "animals", label: { en: "Otter",      af: "Otter" } },
  { id: "panda",       emoji: "🐼", cat: "animals", label: { en: "Panda",      af: "Panda" } },
  { id: "koala",       emoji: "🐨", cat: "animals", label: { en: "Koala",      af: "Koala" } },
  { id: "cat",         emoji: "🐱", cat: "animals", label: { en: "Cat",        af: "Kat" } },
  { id: "dog",         emoji: "🐶", cat: "animals", label: { en: "Dog",        af: "Hond" } },
  { id: "lion",        emoji: "🦁", cat: "animals", label: { en: "Lion",       af: "Leeu" } },
  { id: "tiger",       emoji: "🐯", cat: "animals", label: { en: "Tiger",      af: "Tier" } },
  { id: "frog",        emoji: "🐸", cat: "animals", label: { en: "Frog",       af: "Padda" } },
  { id: "monkey",      emoji: "🐵", cat: "animals", label: { en: "Monkey",     af: "Aap" } },
  { id: "penguin",     emoji: "🐧", cat: "animals", label: { en: "Penguin",    af: "Pikkewyn" } },
  { id: "shark",       emoji: "🦈", cat: "animals", label: { en: "Shark",      af: "Haai" } },
  { id: "dolphin",     emoji: "🐬", cat: "animals", label: { en: "Dolphin",    af: "Dolfyn" } },
  { id: "turtle",      emoji: "🐢", cat: "animals", label: { en: "Turtle",     af: "Skilpad" } },
  { id: "octopus",     emoji: "🐙", cat: "animals", label: { en: "Octopus",    af: "Seekat" } },
  { id: "butterfly",   emoji: "🦋", cat: "animals", label: { en: "Butterfly",  af: "Skoenlapper" } },
  { id: "bee",         emoji: "🐝", cat: "animals", label: { en: "Bee",        af: "By" } },
  { id: "parrot",      emoji: "🦜", cat: "animals", label: { en: "Parrot",     af: "Papegaai" } },
  { id: "hedgehog",    emoji: "🦔", cat: "animals", label: { en: "Hedgehog",   af: "Krimpvarkie" } },
  { id: "unicorn",     emoji: "🦄", cat: "creatures", label: { en: "Unicorn",  af: "Eenhoring" } },
  { id: "dragon",      emoji: "🐉", cat: "creatures", label: { en: "Dragon",   af: "Draak" } },
  { id: "trex",        emoji: "🦖", cat: "creatures", label: { en: "T-rex",    af: "T-rex" } },
  { id: "robot",       emoji: "🤖", cat: "creatures", label: { en: "Robot",    af: "Robot" } },
  { id: "alien",       emoji: "👾", cat: "creatures", label: { en: "Alien",    af: "Ruimtewese" } },
  { id: "ghost",       emoji: "👻", cat: "creatures", label: { en: "Ghost",    af: "Spook" } },
  { id: "comet",       emoji: "☄️", cat: "space", label: { en: "Comet",      af: "Komeet" } },
  { id: "rocket",      emoji: "🚀", cat: "space", label: { en: "Rocket",     af: "Vuurpyl" } },
  { id: "star",        emoji: "⭐", cat: "space", label: { en: "Star",       af: "Ster" } },
  { id: "planet",      emoji: "🪐", cat: "space", label: { en: "Planet",     af: "Planeet" } },
  { id: "moon",        emoji: "🌙", cat: "space", label: { en: "Moon",       af: "Maan" } },
  { id: "ufo",         emoji: "🛸", cat: "space", label: { en: "UFO",        af: "Ruimteskip" } },
  { id: "circle",      emoji: "🔵", cat: "space", label: { en: "Circle",     af: "Sirkel" } },
  { id: "leaf",        emoji: "🍃", cat: "nature", label: { en: "Leaf",       af: "Blaar" } },
  { id: "sprout",      emoji: "🌱", cat: "nature", label: { en: "Sprout",     af: "Saailing" } },
  { id: "wave",        emoji: "🌊", cat: "nature", label: { en: "Wave",       af: "Golf" } },
  { id: "rainbow",     emoji: "🌈", cat: "nature", label: { en: "Rainbow",    af: "Reënboog" } },
  { id: "lightning",   emoji: "⚡", cat: "nature", label: { en: "Lightning",  af: "Weerlig" } },
  { id: "snowflake",   emoji: "❄️", cat: "nature", label: { en: "Snowflake",  af: "Sneeuvlokkie" } },
  { id: "cactus",      emoji: "🌵", cat: "nature", label: { en: "Cactus",     af: "Kaktus" } },
  { id: "football",    emoji: "⚽", cat: "sport", label: { en: "Football",   af: "Sokker" } },
  { id: "basketball",  emoji: "🏀", cat: "sport", label: { en: "Basketball", af: "Basketbal" } },
  { id: "tennis",      emoji: "🎾", cat: "sport", label: { en: "Tennis",     af: "Tennis" } },
  { id: "medal",       emoji: "🏅", cat: "sport", label: { en: "Medal",      af: "Medalje" } },
  { id: "target",      emoji: "🎯", cat: "sport", label: { en: "Target",     af: "Teiken" } },
  { id: "dice",        emoji: "🎲", cat: "sport", label: { en: "Dice",       af: "Dobbelsteen" } },
  { id: "gamepad",     emoji: "🎮", cat: "sport", label: { en: "Gamepad",    af: "Speletjie" } },
  { id: "skateboard",  emoji: "🛹", cat: "sport", label: { en: "Skateboard", af: "Skaatsplank" } },
  { id: "guitar",      emoji: "🎸", cat: "fun", label: { en: "Guitar",     af: "Kitaar" } },
  { id: "drum",        emoji: "🥁", cat: "fun", label: { en: "Drum",       af: "Trom" } },
  { id: "trumpet",     emoji: "🎺", cat: "fun", label: { en: "Trumpet",    af: "Trompet" } },
  { id: "pizza",       emoji: "🍕", cat: "fun", label: { en: "Pizza",      af: "Pizza" } },
  { id: "donut",       emoji: "🍩", cat: "fun", label: { en: "Donut",      af: "Donut" } },
  { id: "watermelon",  emoji: "🍉", cat: "fun", label: { en: "Watermelon", af: "Waatlemoen" } },
];
export const DEFAULT_AVATAR = AVATARS.find(a => a.id === "circle");
