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
];
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
