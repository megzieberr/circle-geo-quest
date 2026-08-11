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
  // ---- IS THE INVESTIGATION STATION RELEASED TO LEARNERS? ----
  // false = the line is completely invisible: no train strip on the home screen,
  // and the `stations` / `investigate` routes bounce back home, so a learner who
  // guesses a URL still cannot reach it.
  //
  // HIDDEN AGAIN 2026-08-06 — her call. This year's class has finished with the
  // line and the ANTHROPIC_API_KEY behind the typed-panel marker has expired, so
  // there is no reason to keep showing it. NOT retired and NOT deleted: the six
  // stations, every panel, the panel_memos rows in Supabase and the learners'
  // completed progress are all left exactly as they are. Next year's Grade 11s
  // get the line back by setting this to true again — and by putting a valid
  // ANTHROPIC_API_KEY back in the Supabase secrets, because the check-answer
  // edge function is what marks the nine typed panels. (Nothing else in the app
  // calls that function, so an expired key costs nothing while this is false.)
  //
  // It was RELEASED 2026-07-30 — her call at the end of the Chunk D session,
  // after she play-tested the whole line herself: "make it visible for the
  // learners" — and ran live for a week.
  //
  // `?stations=1` overrides the flag either way, for previewing.
  stationsLive: false,
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
