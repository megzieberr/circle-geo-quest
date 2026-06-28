# Circle Quest — Grade 11 Circle Geometry game

**Live:** <https://megzieberr.github.io/circle-geo-quest/> · **Admin:** <https://megzieberr.github.io/circle-geo-quest/admin.html>

An online circle-geometry game for Grade 11 learners. Each learner logs in to their
own account, plays themed rounds (one per theorem), earns XP and badges, and sees a
live leaderboard. The teacher logs in as admin to see every learner's progress, scores,
and last-active date. Learner passwords are never shown; a forgotten one is cleared with
a "reset pw" button so the learner picks a new one.

**No learner ever types a maths answer** — every answer is a multiple-choice tap, a
yes/no tap, or a tap directly on the diagram.

It reuses the verified SVG circle-diagram engine from `Gr11_Tan_Chord_Theorem.html` as
the rendering core for every diagram. Every diagram is drawn to scale and self-checked
(see *Diagram verification* below).

---

## What's where

```
index.html              the learner game
admin.html              the teacher dashboard
verify.html             dev tool: checks every diagram is to scale
manifest.json           PWA manifest (install to home screen)
sw.js                   service worker (installable + shows push notifications)
icon-*.png              app icons (regenerate with tools/make_icons.py)
css/                    styles (shared family of the tan-chord page)
js/
  engine.js             the diagram engine (extracted + extended)
  questions.js          the 5 reusable question types
  rounds/               the 12 rounds (round10 imports the tan-chord exercises)
  game.js, app.js, …    game shell, routing, leaderboard, login
  pwa.js                registers the service worker
  push.js               turn-on / subscribe flow for daily reminders
  push-config.js        >>> paste your VAPID public key here <<<
  api.js                backend switch (local ⇄ Supabase)
  supabase.js           Supabase RPC client
  supabase-config.js    >>> paste your URL + anon key here <<<
supabase/
  schema.sql            tables, RLS lockdown, RPC functions  (run first)
  admin-and-seed.sql    set admin password + seed class list (run second)
  phase2.sql … phase6.sql  later additive migrations (daily XP, weekly, push,
                           password privacy, anonymous feedback survey)
  functions/send-push/  Edge Function: the daily-reminder sender
  cron.sql              schedules the daily reminder
tools/
  gen_vapid.py          generate the VAPID notification keys
  make_icons.py         (re)generate the app icons
netlify.toml            static-site deploy config
```

## Install as an app + daily reminders

Circle Quest is a **PWA**: on a phone, "Add to Home Screen" (iPhone/Safari) or
"Install app" (Android/Chrome) installs it like a native app. It can also send a
**daily push reminder** to do the Daily Challenge — only to learners who haven't
done that day's quest. To switch reminders on, follow **`PUSH-SETUP.md`**
(generate VAPID keys → run `phase4.sql` → deploy the `send-push` Edge Function →
schedule it with `cron.sql`). Until the VAPID key is set, the reminder UI stays
hidden and nothing changes.

---

## Run it locally (no backend needed)

The app is a static site of ES modules, so it needs a tiny web server (opening the file
directly won't load modules).

```powershell
cd circle-geometry-game
python -m http.server 5180
```

Then open <http://localhost:5180/>. With no Supabase keys set, it runs fully against
`localStorage` with a demo class list. The local admin password is **`admin`**
(`admin.html`). To start fresh, clear the site's storage in the browser.

### Diagram verification
Open <http://localhost:5180/verify.html>. It measures every marked angle against its
declared value and reports any that aren't to scale. It should say **ALL TO SCALE**.

---

## Connect Supabase (the real backend)

1. Create a Supabase project (free tier is fine).
2. In the project's **SQL editor**, run `supabase/schema.sql` (tables + security + the
   RPC API).
3. Open `supabase/admin-and-seed.sql`, change the admin password and the class list,
   then run it.
4. In **Project Settings → API**, copy the **Project URL** and the **anon public** key
   into `js/supabase-config.js`:

   ```js
   export const SUPABASE = {
     url: "https://YOURPROJECT.supabase.co",
     anonKey: "eyJ…the anon public key…",
   };
   ```

That's it — the app now uses Supabase automatically.

### Why this is safe
- Every table has **row-level security ON with no policies**, so the public anon key can
  never read or write a table directly.
- All reads/writes go through **`SECURITY DEFINER` RPC functions** that verify the
  supplied password **server-side** before doing anything. A learner can only write their
  own row, and only with their correct password.
- The leaderboard returns **names and XP only** — never passwords.
- Learner passwords are **never returned to the browser** — not even to the admin dashboard
  (since `supabase/phase5.sql`). The dashboard shows only *whether* a password is set, and if
  a learner forgets theirs the teacher uses **"reset pw"** to clear it so they pick a new one.
- The admin password is stored **hashed** (bcrypt). **The service-role key is never used
  in the app.**

---

## Admin dashboard (`/admin`)

Log in with your admin password to see, for every learner: weekly XP, all-time XP, rank,
last-active date (with an inactivity flag at 7+ days), which rounds are passed and the
best score per round, and whether a password is set (never the password itself). You can
**export CSV**, **reset the weekly board**, **add/remove a learner**, and **clear a
learner's password** ("reset pw") so they re-pick it.

**👁️ Preview learner view** opens the game exactly as a learner sees it, with
**every round unlocked**, so you can inspect any round or new content without
making a real account. It is fully sandboxed: it opens at `index.html?preview=1`,
writes nothing, earns no XP, and never appears on any leaderboard — so it can't
repeat the "teacher stuck at #1 all-time" problem. A bottom banner makes it clear
nothing is being saved; close the tab to leave.

### Add or remove a learner later
Use the dashboard buttons, or run in the Supabase SQL editor:
```sql
insert into public.students (display_name) values ('New Name') on conflict do nothing;
delete from public.students where display_name = 'Some Name';
```

---

## Deploy (GitHub Pages)

The site is hosted on **GitHub Pages**, served straight from the `main` branch — no
build step. Every `git push` to `main` redeploys automatically in ~1 minute.

**Live:** <https://megzieberr.github.io/circle-geo-quest/> ·
**Admin:** <https://megzieberr.github.io/circle-geo-quest/admin.html>

Setup (already done for this repo):
1. Repo **Settings → Pages**.
2. **Source:** *Deploy from a branch* → **`main`** / **`/ (root)`** → **Save**.
3. Wait ~1 minute, then open the URL above.

Notes:
- `.nojekyll` tells Pages to serve every file as-is (no Jekyll processing).
- The repo is **public** (free GitHub Pages requires a public repo), so it must contain
  **no real learner names**. The class list in `supabase/admin-and-seed.sql` is example
  data only — seed your real names directly in the Supabase SQL editor, where they stay
  private.
- Make sure `js/supabase-config.js` has your real Supabase URL + publishable key (the
  public client key — safe to commit) so every learner shares one backend.

---

## Rounds (chapter order)

1. Parts of a circle · 2. Line from the centre to a chord · 3. Angle at the centre =
2 × circumference · 4. Angle in a semicircle · 5. Angles in the same segment ·
6. Equal chords, equal angles · 7. Cyclic quad — opposite angles · 8. Cyclic quad —
exterior angle · 9. Tangent ⊥ radius · 10. Tan-chord theorem (your existing exercises) ·
11. Tangents from one point · 12. Boss: name that theorem.

Each round unlocks when the previous is passed (80%). Reasons are phrased as they appear
in CAPS exams, in English and Afrikaans (toggle in the top bar).

**Phase 2 (not built yet):** a proof-building round where learners drag
statement-and-reason pairs into order — the round structure leaves room for it.

---

## Anonymous feedback survey

At the end of the quest, learners tell you how it felt. One question — pick a
face (😭 🙁 😐 🙂 😍) — plus an optional written note prompted with "Was it fun or
boring? Too easy or too hard? Did you get stuck? Should we keep doing this?".

- It appears two ways: a **permanent "Tell your teacher how it's going" card** on
  the home screen, and a **one-time popup** the first time a learner finishes the
  final round. They can change their answer any time from the home card.
- It is **anonymous** — the card and popup both say so. The backend authenticates
  the learner only to gate spam and to let them edit their own answer; the
  feedback row itself stores **no learner id**, and the admin dashboard never
  receives a name. (The only link, `students.last_feedback_id`, is used purely
  server-side for the edit and is never exposed.)
- Results live in the **admin dashboard** under *"How learners feel about the
  game"*: the spread of faces, the average, and every written comment — no names.
- To switch it on against the real backend, run **`supabase/phase6.sql`** once in
  the Supabase SQL editor (additive and idempotent, like the other phases). It
  works locally with no setup. To make it fully anonymous even at the database
  level (drop the hidden edit link), just ask — it's a one-line change.
