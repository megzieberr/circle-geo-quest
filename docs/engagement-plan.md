# Engagement Plan: Streak Milestones, Badge Ceremony, Nicknames & Avatars

Context: most students are near the end of their rounds; daily quests + adventure
rounds become term homework next. Weekly "Star of the Week" data shows this game
is where kids who struggle in tests actually shine,
because there's no public failure. The goal of everything below is to add
dopamine *without* adding public risk — no new leaderboards that can be lost,
nothing that exposes a struggling kid to the class.

Status check from a codebase read (2026-07-18): XP economy, badges, day-streak,
weekly leaderboard, comeback bonus, and the anonymous feedback survey already
exist and are solid (`js/config.js`, `js/daily.js`, `js/game.js`,
`js/leaderboard.js`, `js/survey.js`). **The comeback bonus already has full UI**
(pill + message + emoji swap in `renderResults()`, `js/game.js` ~line 510) —
no work needed there, that budget is reallocated to the avatar system below.

Four workstreams. #1 is a small shared foundation; #2, #3, #4 can then run in
parallel as separate agents with minimal file overlap.

---

## 0. Foundation (build first, ~30 min, unblocks #2 and #3)

**What:** a single reusable full-screen celebration modal component, so badge
unlocks and streak milestones look consistent and nobody hand-rolls a second
overlay pattern.

**New file:** `js/celebrate.js`
```js
export function showCelebration({ emoji, title, body, cta = "Nice!" }) { ... }
```
Follows the existing overlay convention already used 4x in this codebase
(`.wk-overlay`, `.why-overlay`, `.install-overlay`, `.survey-overlay` in
`css/styles.css`) — add `.celebrate-overlay` / `.celebrate-modal` alongside
them, same remove-before-reinsert pattern, dismiss on backdrop click or CTA.

No confetti library exists in the repo (CSS-transition + emoji is the house
style) — keep it that way, don't pull in a dependency. A simple CSS keyframe
pop/scale-in on the modal + a couple of emoji particles via `::before`/`::after`
is enough.

**Acceptance:** `showCelebration()` callable from anywhere, matches existing
visual language, works with no server round-trip (pure client render).

---

## 1. Streak Milestones

**Rationale:** the streak counter today just increments — day 3 and day 30 feel
identical. Milestones give the loss-aversion mechanic (don't break the streak)
an actual reward spike instead of just a number going up.

**Client logic** — `js/daily.js`, inside `completeDaily()` (~line 108-116):
after computing the new `streak`, check it against a milestone list and return
a `milestone` flag alongside the existing `{alreadyDone, isNew}` result.

**Config addition** — `js/config.js`, new tunable next to the other XP fields:
```js
streakMilestones: [
  { days: 3,  xp: 15, label: "On a Roll" },
  { days: 7,  xp: 30, label: "One Week Strong" },
  { days: 14, xp: 50, label: "Two Weeks!" },
  { days: 30, xp: 100, label: "Circle Legend" },
],
```

**Server side — this is the part that needs care.** The streak counter is
currently 100% client-local (`localStorage`, no `streak` column anywhere in
`supabase/*.sql`). If milestone XP is granted client-side only, a student can
clear localStorage / reinstall and replay the same milestone for free XP —
the exact anti-farming hole the badge system already closed (badges use
`jsonb_agg(round_id)` server-side to block replay).

Mirror that pattern: new migration `supabase/phase11.sql`:
- `students.streak_milestones_awarded jsonb default '[]'` (array of day
  thresholds already paid out)
- new RPC `cgg_award_streak_milestone(student_id, days)`: idempotent check
  against that column, insert into `xp_events` if not already present,
  return new totals — same shape as the existing `cgg_submit_daily` RPC.
- Client calls this RPC right after `completeDaily()` returns a milestone hit;
  local `daily.js` state doesn't need the awarded-list, server is source of
  truth for the XP grant (client can stay optimistic for the *display*).

**UI:** `renderDailyDone()` (`js/daily.js` ~line 200-208) calls
`showCelebration()` from the foundation piece instead of (or in addition to)
today's inline `.streak-big` div when a milestone is hit. Keep the existing
inline streak number for the non-milestone days — only the milestone days get
the full-screen moment, otherwise it stops feeling special.

**Files touched:** `js/daily.js`, `js/config.js`, `js/api.js` (new RPC
wrapper), `js/supabase.js` (new RPC wrapper), `supabase/phase11.sql`.

**Acceptance:** hitting day 3/7/14/30 shows the celebration exactly once ever
per threshold, grants XP exactly once (verify by clearing localStorage and
redoing the daily — server should refuse the duplicate), non-milestone days
render exactly as before.

---

## 2. Badge Unlock Ceremony

**Rationale:** earning a badge today is a toast (`js/game.js` line 586) plus a
small inline card banner (`.rank-pop`, line 490-491) — easy to miss, no
weight. This is the single highest-perceived-value change for the lowest
effort, since all the earning logic already exists; it's purely presentational.

**Change:** in `renderResults()` (`js/game.js`), where `groupEarned` is
computed (~line 488-489), replace the `toast(...)` call at line 586 with
`showCelebration({...})` from the foundation piece — icon = the group's own
icon from `GROUPS` (`js/config.js:34-50`), title = group name, body = the
group's `blurb`. Keep the inline `.rank-pop` card as-is underneath (belt and
suspenders — the modal is the moment, the card is the permanent record on
that results screen).

**No schema/server changes needed** — `badgeEarned` already comes back from
`cgg_submit_round` and anti-farming already exists server-side.

**Files touched:** `js/game.js` only (plus the shared `js/celebrate.js` /
CSS from step 0).

**Acceptance:** finishing a round that earns a new badge shows the full-screen
celebration once; replaying an already-earned badge's round does not
re-trigger it (existing `groupEarned` logic already guarantees this — just
verify it isn't lost in the refactor).

---

## 3. Nicknames & Avatars

**Rationale:** this is the "Katse" feature — a persona a kid picks and wants
to come back and see, decoupled from the name that carries test-score baggage.
It also has a nice side effect: if the weekly leaderboard and Star-of-the-Week
reveal show the *nickname* instead of the real name, it further lowers the
social stakes of the leaderboard your notes already flagged as biased toward
confident kids — a shy kid can be visibly #1 as "Nova the Tangent Tamer"
without it being *legible as them* to classmates glancing at a screen.

**Data model — this is the biggest decision point in the whole plan, flag it
to whoever implements:**

Today `students.display_name` (`supabase/schema.sql:24-30`) is the *only*
name field, and it's overloaded three ways: login-picker label, leaderboard
name, admin dashboard name. That has to stay stable for login (kids pick their
real name off a short list to sign in — don't change that flow, it's simple
and works). So this needs **two new, additive columns**, not a rename:

```sql
alter table public.students
  add column nickname text,
  add column avatar_id text;
```
`supabase/phase11.sql` (or `phase12.sql` if this runs as a separate agent from
the streak migration — see Sequencing below, recommend separate files to
avoid two agents editing the same migration).

- Login list (`js/auth.js:43-47`) keeps matching on `display_name` — unchanged.
- Everywhere a name is *shown back to the student or classmates*
  (`js/leaderboard.js`, the weekly modal in `js/weekly.js:223`, the Circle
  Champion reveal from `phase10.sql`/admin.js:204) — show `nickname ?? display_name`
  and render `avatar_id` as the icon, falling back to a default avatar if unset.
- Admin dashboard (`js/admin.js` lines 131, 163, 349, 382) — **always shows
  `display_name` (real name)**, optionally with the nickname in parentheses
  for the teacher's own amusement/context, never the reverse. This is the
  one place that must never lose the real name.

**Avatar list:** keep it emoji-based, no image assets, consistent with the
rest of the app's visual language (🔥 streak, 🏅 comeback, badge icons already
emoji). Curated fixed list in `CONFIG`, e.g. 16-24 emoji, not freeform upload.

**Nickname input — DECIDED (Megan, 2026-07-18): freeform text, NO profanity
filter, teacher moderation instead.** An automated blocklist was rejected
because the class is bilingual and innocent Afrikaans words false-positive
against English blocklists (e.g. "vak" just means *subject*) — the classic
Scunthorpe problem. Moderation is the teacher's authority, not an algorithm:

  - Freeform nickname input in the profile-setup screen (reasonable length
    cap, trim whitespace; that's the only validation).
  - Admin dashboard shows each learner's nickname alongside the real name.
  - New admin action + RPC `cgg_admin_reset_nickname(p_admin_password,
    student_id)`: **deletes** (nulls) the nickname — never edits it — so the
    learner falls back to their real `display_name` everywhere until they
    pick a new one (profile-setup prompt reappears on next login).
  - Before resetting, log the old nickname to the `events` table
    (`action = 'nickname_reset'`) so there's a record after it's gone; the
    teacher screenshots the dashboard first if parents need to see it.

**New UI flow:** first login after this ships (or a "Customize" link from the
home screen) opens a small profile-setup screen — nickname input/generator +
avatar grid picker, `Save` calls a new RPC `cgg_set_profile(student_id,
nickname, avatar_id)`. Reuse the existing card/overlay visual style, no new
design system needed.

**Files touched:** `supabase/phase11.sql` or `phase12.sql` (new columns +
RPC), `js/api.js` + `js/supabase.js` (RPC wrapper + local fallback), `js/auth.js`
(post-login prompt if profile unset), new `js/profile.js` (setup screen),
`js/leaderboard.js`, `js/weekly.js`, `js/admin.js` (read nickname/avatar,
keep real name authoritative, add the reset-nickname action), `js/config.js`
(avatar list), `css/styles.css`.

**Acceptance:** a student can set a nickname+avatar once and see it reflected
on the leaderboard and weekly reveal; the teacher dashboard still shows real
names as the primary identifier at all times; login still works off real
names unchanged; a student who skips setup gets a sensible default
(e.g. `display_name` initials + a random default avatar) rather than a
broken UI.

---

## Sequencing for parallel agents

1. **Agent A** builds the foundation (`js/celebrate.js` + CSS) alone, fast,
   merges first — everything else depends on it existing.
2. Once merged, run **B, C, D in parallel**, each low-overlap:
   - **Agent B** — Badge Unlock Ceremony (`js/game.js` only).
   - **Agent C** — Streak Milestones (`js/daily.js`, `js/config.js`,
     `supabase/phase11.sql`, `js/api.js`/`js/supabase.js` RPC wrapper for
     `cgg_award_streak_milestone`).
   - **Agent D** — Nicknames & Avatars (everything in section 3; use
     `supabase/phase12.sql` instead of `phase11.sql` so it doesn't collide
     with Agent C's migration file).
3. The nickname-input question is **decided** (see section 3): freeform text,
   no filter, teacher reset authority via `cgg_admin_reset_nickname` — Agent D
   builds exactly that.

Nothing here touches the same file in two workstreams except `js/config.js`
(C and D both add tunables) and `js/api.js`/`js/supabase.js` (C and D both
add an RPC wrapper) — those are append-only edits in different sections, low
conflict risk, but worth a quick merge check.
