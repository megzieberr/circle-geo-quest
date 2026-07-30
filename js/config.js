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
  // ---- IS THE INVESTIGATION STATION RELEASED TO LEARNERS? ----
  // false = the line is completely invisible: no train strip on the home screen,
  // and the `stations` / `investigate` routes bounce back home, so a learner who
  // guesses a URL still cannot reach it.
  //
  // RELEASED 2026-07-30 — her call at the end of the Chunk D session, after she
  // play-tested the whole line herself: "make it visible for the learners".
  //
  // It went live with ONE of Chunk D's four theorems in (two tangents from a
  // point). Equal chords, tangent-radius and tan-chord are still to come and are
  // deliberately additive — they add extra practice panels to stations that are
  // already complete, so nothing a learner meets today is half-built. Adding
  // them later costs no migration and no re-release; each new panel simply
  // raises that station's XP, because the total is computed from panels.length.
  //
  // Set back to false to hide the line again — no train strip, and the
  // `stations` / `investigate` routes bounce home, so a guessed URL cannot reach
  // it. `?stations=1` overrides the flag either way, for previewing.
  stationsLive: true,
  // struggling-learner support ("Boost mode")
  rescueAfterFails: 2,     // after this many failed attempts, replays get open hints + second chances
  comebackBonus: 40,       // extra XP for finally passing a round on the 3rd+ attempt
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
