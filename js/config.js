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
   stays school-appropriate and gender-neutral (animals / space /
   nature / sport / music — no flags, no skin-toned faces). The ids
   here are mirrored server-side in supabase/phase12.sql
   (cgg_set_profile validates p_avatar against the same list) — if
   you add an avatar here, add its id to that allow-list too.
   "circle" doubles as the neutral DEFAULT_AVATAR: what a learner
   who skips profile setup gets, and the fallback for any student
   row with no avatar_id yet (pre-migration or never set).
   ============================================================ */
export const AVATARS = [
  { id: "fox",        emoji: "🦊", label: { en: "Fox",        af: "Jakkals" } },
  { id: "owl",         emoji: "🦉", label: { en: "Owl",        af: "Uil" } },
  { id: "otter",       emoji: "🦦", label: { en: "Otter",      af: "Otter" } },
  { id: "panda",       emoji: "🐼", label: { en: "Panda",      af: "Panda" } },
  { id: "koala",       emoji: "🐨", label: { en: "Koala",      af: "Koala" } },
  { id: "comet",       emoji: "☄️", label: { en: "Comet",      af: "Komeet" } },
  { id: "rocket",      emoji: "🚀", label: { en: "Rocket",     af: "Vuurpyl" } },
  { id: "star",        emoji: "⭐", label: { en: "Star",       af: "Ster" } },
  { id: "planet",      emoji: "🪐", label: { en: "Planet",     af: "Planeet" } },
  { id: "leaf",        emoji: "🍃", label: { en: "Leaf",       af: "Blaar" } },
  { id: "sprout",      emoji: "🌱", label: { en: "Sprout",     af: "Saailing" } },
  { id: "wave",        emoji: "🌊", label: { en: "Wave",       af: "Golf" } },
  { id: "football",    emoji: "⚽", label: { en: "Football",   af: "Sokker" } },
  { id: "basketball",  emoji: "🏀", label: { en: "Basketball", af: "Basketbal" } },
  { id: "tennis",      emoji: "🎾", label: { en: "Tennis",     af: "Tennis" } },
  { id: "medal",       emoji: "🏅", label: { en: "Medal",      af: "Medalje" } },
  { id: "guitar",      emoji: "🎸", label: { en: "Guitar",     af: "Kitaar" } },
  { id: "drum",        emoji: "🥁", label: { en: "Drum",       af: "Trom" } },
  { id: "trumpet",     emoji: "🎺", label: { en: "Trumpet",    af: "Trompet" } },
  { id: "circle",      emoji: "🔵", label: { en: "Circle",     af: "Sirkel" } },
];
export const DEFAULT_AVATAR = AVATARS.find(a => a.id === "circle");
