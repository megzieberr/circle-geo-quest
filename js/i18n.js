/* ============================================================
   BILINGUAL LAYER (English / Afrikaans)
   ------------------------------------------------------------
   Every learner-facing string lives here as { en, af }.
   - tx(obj)        : resolve an inline {en, af} object
   - t(key)         : resolve a UI string by key
   - reason(code)   : resolve a CAPS reason by code
   - getLang/setLang/onLangChange : the toggle

   Afrikaans is filled for the whole UI and every reason. Where a
   round imports legacy English-only data (Round 10), reasonAuto()
   maps the known reason phrases to Afrikaans and falls back to the
   English string for anything not yet translated.
   ============================================================ */

const KEY = "cgg.lang";
let lang = localStorage.getItem(KEY) || "en";
const listeners = new Set();

export function getLang() { return lang; }
export function setLang(l) {
  lang = (l === "af") ? "af" : "en";
  localStorage.setItem(KEY, lang);
  document.documentElement.lang = lang;
  listeners.forEach(fn => fn(lang));
}
export function onLangChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

/** Resolve an inline {en, af} string object (falls back to en). */
export function tx(obj) {
  if (obj == null) return "";
  if (typeof obj === "string") return obj;
  return obj[lang] ?? obj.en ?? "";
}

/* ---------- UI strings ---------- */
const UI = {
  appName:        { en: "Circle Quest", af: "Circle Quest" },
  tagline:        { en: "Grade 11 Circle Geometry", af: "Graad 11 Sirkelmeetkunde" },

  // login
  chooseName:     { en: "Who are you?", af: "Wie is jy?" },
  chooseNameSub:  { en: "Tap your name to begin.", af: "Klik op jou naam om te begin." },
  searchName:     { en: "Search your name…", af: "Soek jou naam…" },
  setPassword:    { en: "Create your password", af: "Skep jou wagwoord" },
  setPasswordSub: { en: "First time here. Pick a password you'll remember — you'll use it every time you log in.", af: "Eerste keer hier. Kies 'n wagwoord wat jy sal onthou — jy gebruik dit elke keer wat jy inteken." },
  enterPassword:  { en: "Enter your password", af: "Tik jou wagwoord in" },
  password:       { en: "Password", af: "Wagwoord" },
  confirmPassword:{ en: "Confirm password", af: "Bevestig wagwoord" },
  login:          { en: "Log in", af: "Teken in" },
  start:          { en: "Start", af: "Begin" },
  back:           { en: "Back", af: "Terug" },
  logOut:         { en: "Log out", af: "Teken uit" },
  wrongPassword:  { en: "That password isn't right. Try again, or ask your teacher.", af: "Daardie wagwoord is verkeerd. Probeer weer, of vra jou onderwyser." },
  passwordsDiffer:{ en: "The two passwords don't match.", af: "Die twee wagwoorde stem nie ooreen nie." },
  passwordTooShort:{ en: "Use at least 4 characters.", af: "Gebruik ten minste 4 karakters." },
  offline:        { en: "Can't reach the server. Check your connection.", af: "Kan nie die bediener bereik nie. Kontroleer jou verbinding." },

  // home / map
  home:           { en: "Home", af: "Tuis" },
  yourQuest:      { en: "Your quest", af: "Jou soektog" },
  totalXp:        { en: "Total XP", af: "Totale XP" },
  badges:         { en: "Badges", af: "Badges" },
  rank:           { en: "Rank", af: "Rang" },
  locked:         { en: "Locked", af: "Gesluit" },
  passPrev:       { en: "Pass the round before to unlock.", af: "Slaag die vorige rondte om oop te sluit." },
  play:           { en: "Play", af: "Speel" },
  replay:         { en: "Replay", af: "Speel weer" },
  watch:          { en: "Watch", af: "Kyk" },
  discover:       { en: "Discover", af: "Ontdek" },
  explore:        { en: "Explore", af: "Verken" },
  passed:         { en: "Passed", af: "Geslaag" },
  bestScore:      { en: "Best", af: "Beste" },
  leaderboard:    { en: "Leaderboard", af: "Leaderboard" },

  // round / play
  question:       { en: "Question", af: "Vraag" },
  of:             { en: "of", af: "van" },
  check:          { en: "Check", af: "Kontroleer" },
  next:           { en: "Next", af: "Volgende" },
  finish:         { en: "Finish", af: "Voltooi" },
  correct:        { en: "Correct!", af: "Korrek!" },
  notQuite:       { en: "Not quite.", af: "Nie heeltemal nie." },
  theAnswer:      { en: "Answer", af: "Antwoord" },
  reasonLabel:    { en: "Reason", af: "Rede" },
  tapToAnswer:    { en: "Tap the diagram to answer.", af: "Klik op die diagram om te antwoord." },
  yes:            { en: "Yes", af: "Ja" },
  no:             { en: "No", af: "Nee" },
  firstTry:       { en: "First try!", af: "Eerste poging!" },
  streak:         { en: "Streak", af: "Streak" },
  replayNoXp:     { en: "Replay — Badge already earned, so no XP this time.", af: "Herhaling — Badge reeds verdien, dus geen XP hierdie keer nie." },

  // results
  roundComplete:  { en: "Round complete", af: "Rondte voltooi" },
  youScored:      { en: "You scored", af: "Jy het behaal" },
  xpEarned:       { en: "XP earned", af: "XP verdien" },
  badgeEarned:    { en: "Badge earned!", af: "Badge verdien!" },
  roundPassed:    { en: "Round passed — next round unlocked!", af: "Rondte geslaag — volgende rondte oopgesluit!" },
  notPassedYet:   { en: "So close! Reach 80% to pass and unlock the next round.", af: "So naby! Behaal 80% om te slaag en die volgende rondte oop te sluit." },
  replayNoXpMsg:  { en: "You've already mastered this round, so no XP this time — but great practice! 💪", af: "Jy het hierdie rondte reeds bemeester, dus geen XP hierdie keer nie — maar goeie oefening! 💪" },
  backHome:       { en: "Back to map", af: "Terug na kaart" },
  tryAgain:       { en: "Try again", af: "Probeer weer" },
  nextRound:      { en: "Go to next round →", af: "Gaan na volgende rondte →" },

  // leaderboard
  weekly:         { en: "This week", af: "Hierdie week" },
  allTime:        { en: "All time", af: "Algeheel" },
  you:            { en: "You", af: "Jy" },
  yourRank:       { en: "Your rank", af: "Jou rang" },
  noScores:       { en: "No scores yet — be the first!", af: "Nog geen tellings nie — wees eerste!" },

  // proof builder
  buildProof:     { en: "Build the proof — tap the cards in order", af: "Bou die bewys — klik die kaarte in volgorde" },
  cardsLeft:      { en: "Cards left", af: "Kaarte oor" },
  checkProof:     { en: "Check proof", af: "Kontroleer bewys" },
  resetProof:     { en: "Reset", af: "Herstel" },
  proofCorrect:   { en: "Correct proof! 🎓", af: "Korrekte bewys! 🎓" },
  proofPartial:   { en: "in the right place", af: "op die regte plek" },
  correctOrder:   { en: "The correct order:", af: "Die korrekte volgorde:" },
  tapToPlace:     { en: "tap a card to place it here…", af: "klik 'n kaart om dit hier te plaas…" },

  // rank tiers
  rankLabel:      { en: "Your rank", af: "Jou rang" },
  rankEarned:     { en: "Earned", af: "Verdien" },
  rankProgress:   { en: "rounds", af: "rondtes" },
  newRank:        { en: "New rank unlocked!", af: "Nuwe rang oopgesluit!" },

  // discovery rounds
  continue:       { en: "Continue", af: "Gaan voort" },
  notQuiteTry:    { en: "Not quite — try again.", af: "Nie heeltemal nie — probeer weer." },
  notQuiteThink:  { en: "Not quite. Use the diagram and the hint below.", af: "Nie heeltemal nie. Gebruik die diagram en die wenk hieronder." },
  hereIsAnswer:   { en: "Here's the answer — read it through so it makes sense, then carry on. You'll get the next one!", af: "Hier is die antwoord — lees dit deur sodat dit sin maak, en gaan dan voort. Jy kry die volgende een reg!" },
  hint:           { en: "Hint", af: "Wenk" },
  youGotIt:       { en: "You've got it!", af: "Jy het dit!" },
  tapBlank:       { en: "Tap a blank above, then choose your answer.", af: "Klik op 'n oop spasie hierbo, kies dan jou antwoord." },
  discoverComplete:{ en: "Theorem discovered!", af: "Stelling ontdek!" },
  introDone:      { en: "You've met every part!", af: "Jy ken nou elke deel!" },
  discoverUnlocked:{ en: "Nice exploring — the next round is unlocked.", af: "Goed verken — die volgende rondte is oopgesluit." },
  dragHint:       { en: "Drag the dot to explore.", af: "Sleep die kol om te verken." },

  // adventures (Grand Master bonus)
  adventures:      { en: "Adventures", af: "Avonture" },
  grandMasterArena:{ en: "Grand Master Arena", af: "Grootmeester-arena" },
  adventuresBlurb: { en: "Bonus challenges for Grand Masters — earn extra XP!", af: "Bonus-uitdagings vir Grootmeesters — verdien ekstra XP!" },
  adventureLocked: { en: "Earn all 5 badges to unlock the Adventures.", af: "Verdien al 5 badges om die Avonture oop te sluit." },
  fillReasons:     { en: "Fill the reasons", af: "Vul die redes in" },
  fillValues:      { en: "Fill the values", af: "Vul die waardes in" },
  fillBoth:        { en: "Value + reason", af: "Waarde + rede" },
  spotError:       { en: "Spot the error", af: "Vind die fout" },
  completeProof:   { en: "Complete the proof", af: "Voltooi die bewys" },
  advProofHint:    { en: "Each line of the proof is given. Tap a blank and choose the missing reason.", af: "Elke reël van die bewys is gegee. Klik 'n oop spasie en kies die ontbrekende rede." },
  advReasonsHint:  { en: "Each statement is given. Tap a row, then choose its reason.", af: "Elke stelling is gegee. Klik 'n ry, kies dan sy rede." },
  advValuesHint:   { en: "Each reason is given. Tap a row, then type the angle.", af: "Elke rede is gegee. Klik 'n ry, tik dan die hoek." },
  advMixedHint:    { en: "Fill in BOTH the angle and its reason for every row.", af: "Vul BEIDE die hoek en sy rede vir elke ry in." },
  advSpotHint:     { en: "One line of the solution is wrong. Tap the line you think is the mistake.", af: "Een reël van die oplossing is verkeerd. Klik die reël wat jy dink die fout is." },
  advSpotCorrect:  { en: "Spotted it — that line is the mistake.", af: "Reg gesien — daardie reël is die fout." },
  advSpotWrong:    { en: "Not that one — the real mistake is highlighted.", af: "Nie daardie een nie — die werklike fout is uitgelig." },
  advPickReason:   { en: "tap to choose a reason…", af: "klik om 'n rede te kies…" },
  correctRows:     { en: "correct", af: "korrek" },
  advCleared:      { en: "Adventure cleared! 🏆", af: "Avontuur voltooi! 🏆" },
  advTryAgainMsg:  { en: "Give it another go to clear it (80%).", af: "Probeer weer om dit te voltooi (80%)." },

  // hints (graded rounds)
  needHint:       { en: "Stuck? Get a hint", af: "Vasgeval? Kry 'n wenk" },
  anotherHint:    { en: "Another hint", af: "Nog 'n wenk" },
  hintThink:      { en: "Think about", af: "Dink aan" },
  hintNoMore:     { en: "That's every hint — give it your best shot!", af: "Dis al die wenke — gee dit jou beste poging!" },
  hintUsedNote:   { en: "Hints are free here — use them to learn, not to lose marks.", af: "Wenke is gratis hier — gebruik dit om te leer." },

  // fix-my-mistakes
  fixMistakes:    { en: "Fix your mistakes", af: "Maak jou foute reg" },
  fixCardBlurb:   { en: "Re-try the questions you missed. Get one right and it leaves the pile.", af: "Probeer weer die vrae wat jy gemis het. Kry een reg en dit verlaat die stapel." },
  fixToFix:       { en: "to fix", af: "om reg te maak" },
  fixStart:       { en: "Fix them", af: "Maak reg" },
  fixNone:        { en: "Nothing to fix — you're all caught up! 🎉", af: "Niks om reg te maak nie — jy is op datum! 🎉" },
  fixEmptyHint:   { en: "Miss a question in a round and it lands here so you can master it.", af: "Mis 'n vraag in 'n rondte en dit beland hier sodat jy dit kan bemeester." },
  fixComplete:    { en: "Mistakes session done", af: "Foute-sessie klaar" },
  fixCleared:     { en: "cleared", af: "reggemaak" },
  fixStillToGo:   { en: "still to fix", af: "nog reg te maak" },
  fixFromRound:   { en: "From round", af: "Uit rondte" },
  fixAllClear:    { en: "Every mistake cleared — brilliant! 🌟", af: "Elke fout reggemaak — briljant! 🌟" },

  // daily challenge
  dailyChallenge: { en: "Daily Challenge", af: "Daaglikse Uitdaging" },
  dailyBlurb:     { en: "5 quick questions to keep every theorem fresh.", af: "5 vinnige vrae om elke stelling vars te hou." },
  dailyStart:     { en: "Start today's 5", af: "Begin vandag se 5" },
  dailyDoneToday: { en: "Done for today 🎉 Come back tomorrow!", af: "Klaar vir vandag 🎉 Kom môre terug!" },
  dailyReplay:    { en: "Practise again", af: "Oefen weer" },
  dayStreak:      { en: "day streak", af: "dag-streak" },
  streakBest:     { en: "best", af: "beste" },
  dailyLocked:    { en: "Pass your first round to unlock the Daily Challenge.", af: "Slaag jou eerste rondte om die Daaglikse Uitdaging oop te sluit." },
  dailyComplete:  { en: "Daily Challenge complete!", af: "Daaglikse Uitdaging voltooi!" },
  dailyStreakUp:  { en: "day streak — keep it alive tomorrow!", af: "dag-streak — hou dit môre lewendig!" },
  dailyStreakNew: { en: "Streak started! Come back tomorrow to build it.", af: "Streak begin! Kom môre terug om dit te bou." },
  dailyKeptFresh: { en: "Great retrieval practice — this is how it sticks. 🧠", af: "Goeie oefening — só bly dit vassteek. 🧠" },

  // misc
  language:       { en: "Afrikaans", af: "English" }, // label shows the OTHER language to switch to
  loading:        { en: "Loading…", af: "Laai…" },
  comingSoon:     { en: "Coming soon", af: "Binnekort beskikbaar" },
};

export function t(key) {
  const o = UI[key];
  if (!o) return key;
  return o[lang] ?? o.en;
}

/* ---------- Parts of a circle (Round 1 vocabulary) ---------- */
export const PARTS = {
  centre:        { en: "centre",        af: "middelpunt" },
  radius:        { en: "radius",        af: "radius" },
  diameter:      { en: "diameter",      af: "middellyn" },
  chord:         { en: "chord",         af: "koord" },
  arc:           { en: "arc",           af: "boog" },
  sector:        { en: "sector",        af: "sektor" },
  segment:       { en: "segment",       af: "segment" },
  tangent:       { en: "tangent",       af: "raaklyn" },
  circumference: { en: "circumference", af: "omtrek" },
};

/* ---------- CAPS reason bank ----------
   Afrikaans wording follows the official DBE "Aanvaarbare Redes
   (Euclidean Geometry)" list so it matches exactly what learners
   must write in the exam. */
export const REASONS = {
  tanChord:      { en: "tan-chord theorem",        af: "raaklyn-koord-stelling" },
  straightLine:  { en: "∠s on a str line",         af: "∠e op 'n reguitlyn" },
  triSum:        { en: "int angles of triangle",   af: "binnehoeke van Δ" },
  tanRadius:     { en: "tan ⊥ radius",             af: "raaklyn ⊥ radius" },
  tanDiameter:   { en: "tan ⊥ diameter",           af: "raaklyn ⊥ middellyn" },
  // converses — used to PROVE a line is a tangent
  tanRadiusConv: { en: "converse tan ⊥ radius",    af: "omgekeerde raaklyn ⊥ radius" },
  tanChordConv:  { en: "converse tan-chord",       af: "omgekeerde raaklyn-koord" },
  semiCircle:    { en: "∠ in semi-circle",         af: "∠ in semi sirkel" },
  tansCommonPt:  { en: "tans from same pt",        af: "raaklyne vanuit dieselfde punt" },
  sameSeg:       { en: "∠s in same seg",           af: "∠e in dieselfde segment" },
  isosBase:      { en: "∠s opp equal sides",       af: "∠e teenoor gelyke sye" },
  sidesOppAngles:{ en: "sides opp equal ∠s",       af: "sye teenoor gelyke ∠e" },
  centreDouble:  { en: "∠ at centre = 2 × ∠ at circumference", af: "middelpuntshoek = 2 × omtrekshoek" },
  centrePerpChord:{ en: "line from centre ⊥ to chord", af: "lyn vanuit mdpt ⊥ op koord" },
  centreMidChord:{ en: "line from centre to midpt of chord", af: "lyn vanuit mdpt na mdpt van koord" },
  cyclicOpp:     { en: "opp ∠s of cyclic quad",    af: "teenoorst. ∠e van kvh" },
  cyclicExt:     { en: "ext ∠ of cyclic quad",     af: "buite∠ van kvh" },
  // converses — used to PROVE a quadrilateral is cyclic ("converse" is essential)
  cyclicOppConv: { en: "converse opp ∠s of cyclic quad", af: "omgekeerde teenoorst. ∠e van kvh" },
  cyclicExtConv: { en: "converse ext ∠ of cyclic quad",  af: "omgekeerde buite∠ van kvh" },
  sameSegConv:   { en: "converse ∠s in same seg",        af: "omgekeerde ∠e in selfde segm." },
  equalChords:   { en: "equal chords subtend equal ∠s", af: "gelyke koorde; gelyke ∠e" },
  pythagoras:    { en: "Pythagoras",               af: "Pythagoras" },
  radiiEqual:    { en: "radii equal",              af: "radii" },
  altAngles:     { en: "alt ∠s ; lines ∥",         af: "verw. ∠e ; lyne ∥" },
  diamMidChord:  { en: "line from centre to midpt of chord ⊥ chord", af: "lyn vanuit mdpt ⊥ op koord" },
  // proof-building reasons
  construction:  { en: "construction",        af: "konstruksie" },
  given:         { en: "given",               af: "gegee" },
  radii:         { en: "radii",               af: "radii" },
  commonSide:    { en: "common",              af: "gemeen" },
  rhs:           { en: "RHS",                 af: "RHS" },
  congTri:       { en: "≡ Δs",                af: "≡ Δe" },
  triExt:        { en: "ext ∠ of Δ",          af: "buite∠ van Δ" },
  roundPt:       { en: "∠s around a point",   af: "∠e rondom 'n punt" },
};

export function reason(code) {
  const o = REASONS[code];
  if (!o) return code;
  return o[lang] ?? o.en;
}

/* ---------- Word bank for fill-in-the-blank discovery ----------
   Blanks store a stable id; we display the localized word, so a
   learner can't read the answer off the chip and it works in both
   languages. Any id not listed here is shown as-is. */
export const WORDS = {
  right:          { en: "right",          af: "regte" },
  acute:          { en: "acute",          af: "skerp" },
  obtuse:         { en: "obtuse",         af: "stomp" },
  straight:       { en: "straight",       af: "gestrekte" },
  reflex:         { en: "reflex",         af: "inspringende" },
  equal:          { en: "equal",          af: "gelyke" },
  unequal:        { en: "unequal",        af: "ongelyke" },
  curved:         { en: "curved",         af: "geboë" },
  smaller:        { en: "smaller",        af: "kleiner" },
  larger:         { en: "larger",         af: "groter" },
  perpendicular:  { en: "perpendicular",  af: "loodreg" },
  parallel:       { en: "parallel",       af: "ewewydig" },
  tangent:        { en: "a tangent",      af: "'n raaklyn" },
  opposite:       { en: "opposite",       af: "teenoorgestelde" },
  adjacent:       { en: "adjacent",       af: "aangrensende" },
  alternate:      { en: "alternate",      af: "oorstaande" },
  bisects:        { en: "bisects",        af: "halveer" },
  halves:         { en: "halves",         af: "halveer" },
  double:         { en: "double",         af: "dubbel" },
  twice:          { en: "twice",          af: "twee keer" },
  half:           { en: "half",           af: "die helfte van" },
  triple:         { en: "triple",         af: "driedubbel" },
  same:           { en: "the same as",    af: "dieselfde as" },
  bigger:         { en: "bigger than",    af: "groter as" },
  supplementary:  { en: "supplementary",  af: "supplementêr" },
  complementary:  { en: "complementary",  af: "komplementêr" },
  midpoint:       { en: "midpoint",       af: "middelpunt" },
  centre:         { en: "centre",         af: "middelpunt" },
  constant:       { en: "constant",       af: "konstant" },
  changes:        { en: "changes",        af: "verander" },
};
export function word(id) {
  const o = WORDS[id];
  if (!o) return id;
  return o[lang] ?? o.en;
}

/* Map a legacy English reason phrase (from imported tan-chord data)
   to the current language. Falls back to the original phrase. */
const LEGACY = {};
for (const k in REASONS) LEGACY[REASONS[k].en] = REASONS[k];
// a few compound / variant phrases used in the imported data:
LEGACY["∠ sum of △"] = REASONS.triSum;
LEGACY["∠s on a str line"] = REASONS.straightLine;
// imported (data-tanchord) phrases must still resolve after the reasons above were renamed:
LEGACY["base ∠s of isos Δ"] = REASONS.isosBase;          // → "∠s opp equal sides"
LEGACY["tans from common pt"] = REASONS.tansCommonPt;     // → "tans from same pt"
LEGACY["tans from common pt; base ∠s of isos △"] = {
  en: "tans from same pt; ∠s opp equal sides",
  af: "raaklyne vanuit dieselfde punt; ∠e teenoor gelyke sye",
};
LEGACY["base ∠s of isos △ (TA = TB)"] = {
  en: "∠s opp equal sides (TA = TB)",
  af: "∠e teenoor gelyke sye (TA = TB)",
};
LEGACY["tan-chord theorem (chord TS at T)"] = {
  en: "tan-chord theorem (chord TS at T)",
  af: "raaklyn-koord-stelling (koord TS by T)",
};
LEGACY["alt ∠s, AB ∥ SU"] = { en: "alt ∠s, AB ∥ SU", af: "verw. ∠e, AB ∥ SU" };

export function reasonAuto(phrase) {
  if (!phrase) return "";
  const norm = phrase.replace(/△/g, "Δ");
  const hit = LEGACY[phrase] || LEGACY[norm];
  if (hit) return hit[lang] ?? hit.en;
  return phrase; // not yet translated — show as-is (English)
}
