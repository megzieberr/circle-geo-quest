# PUSH-SETUP.md — turning on daily reminders for Circle Quest

This adds a **daily push notification** that reminds learners to do their Daily
Challenge. It only pings learners who **haven't done that day's quest yet**, so
nobody who already played gets nagged.

Your Supabase project, GitHub repo, and live site already exist, so this guide
is only the notification parts. It reuses the same recipe as your Shower
Schedule app, so it should feel familiar. Allow about **20–30 minutes**.

> **Your project ref is `vlelxvhlyydwxnhbijco`** (the bit in your Supabase URL
> `https://vlelxvhlyydwxnhbijco.supabase.co`). You'll need it in Part 7.

> **A word you'll see a lot:** a **secret** is a password-like value we store in
> a safe, hidden place — never in the website code or in GitHub.

---

## Part 1 — Make the notification keys (VAPID)

**VAPID keys** prove the notifications really come from your app. There are two:
a **public** key (safe, goes in the website) and a **private** key (stays secret
in Supabase).

1. Open **PowerShell** (Windows key → type *PowerShell* → Enter).
2. Run these two lines (one at a time):
   ```powershell
   cd "$HOME\Desktop\circle-geometry-game"
   python tools\gen_vapid.py
   ```
   - **You should see:** a **PUBLIC** key and a **PRIVATE** key, each a long
     string of letters/numbers.
3. Copy the **PUBLIC** key into a notes app, labelled `VAPID_PUBLIC_KEY`.
4. Copy the **PRIVATE** key into your notes app, labelled `VAPID_PRIVATE_KEY`.
   Treat this one like a password — it never goes on the website or in GitHub.

---

## Part 2 — Put the public key in the app and deploy

1. Open the file **`js/push-config.js`** in a text editor.
2. Paste your **PUBLIC** key between the quotes, so the line reads (your key
   will be different):
   ```js
   export const VAPID_PUBLIC_KEY = "BPxabc...the public key...xyz";
   ```
3. Save the file.
4. In PowerShell, deploy it (this one push also ships all the new reminder
   files I added — they're harmless and stay dormant until everything below is
   done):
   ```powershell
   git add -A
   git commit -m 'Turn on daily reminders (PWA push notifications)'
   git push
   ```
   - **You should see:** `git push` finish. Wait ~1 minute for GitHub Pages.
   - Once live, a **🔔 Daily reminder** card appears on the home screen inside
     the installed app. (It stays hidden until this key is set — that's normal.)

---

## Part 3 — Add the notifications table to the database

1. In **Supabase**, left sidebar → **SQL Editor** → **New query**.
2. Open **`supabase/phase4.sql`** on your computer, select all (Ctrl+A), copy.
3. Paste into the SQL editor and click **Run**.
   - **You should see:** green **Success**. (Safe to run more than once.)
   - To check: **Table Editor** should now list a **push_subscriptions** table.

---

## Part 4 — Turn on the scheduler, and make a CRON secret

### 4a. Switch on two extensions
1. Left sidebar → **Database** → **Extensions**.
2. Search **pg_cron** → turn its toggle **on** (green). (Runs jobs on a timer.)
3. Search **pg_net** → turn its toggle **on** (green). (Lets the database call
   our notification function.)

### 4b. Make a CRON secret
4. In PowerShell, run:
   ```powershell
   python -c "import secrets; print(secrets.token_hex(24))"
   ```
   - **You should see:** a long random string.
5. Copy it into your notes app, labelled `CRON_SECRET`. You'll use the **exact
   same value** twice (Part 5 and Part 7).

---

## Part 5 — Store the secrets in Supabase

1. Left sidebar → **Edge Functions** → **Secrets** (or **Manage secrets**).
2. Click **Add new secret** and add these **four**, one at a time (Name exactly
   as shown, paste the Value, Save):

   | Name | Value to paste |
   | --- | --- |
   | `VAPID_PRIVATE_KEY` | your **VAPID_PRIVATE_KEY** from Part 1 |
   | `VAPID_PUBLIC_KEY` | your **VAPID_PUBLIC_KEY** from Part 1 |
   | `VAPID_SUBJECT` | `mailto:` + your email, e.g. `mailto:megzieberr@gmail.com` |
   | `CRON_SECRET` | your **CRON_SECRET** from Part 4b (must match exactly) |

   - **You should see:** all four names listed (values stay hidden).
   - You do **not** add the service-role key — Supabase provides that to the
     function automatically.

---

## Part 6 — Deploy the notification function

1. Left sidebar → **Edge Functions** → **Create a function** (or **Via editor**).
2. In the **name** box, type exactly: `send-push` (the schedule looks for this).
3. Open **`supabase/functions/send-push/index.ts`** on your computer, select all
   (Ctrl+A), copy.
4. In the browser editor, select the sample code (Ctrl+A) and paste yours over it.
5. Turn the **Verify JWT** option **OFF** for this function (so our scheduler can
   call it with the CRON_SECRET instead of a login token).
6. Click **Deploy**.
   - **You should see:** `send-push` listed as **Deployed**.

---

## Part 7 — Schedule the daily reminder

1. Open **`supabase/cron.sql`** on your computer in a text editor.
2. Replace `<PROJECT_REF>` with **`vlelxvhlyydwxnhbijco`**.
3. Replace `<CRON_SECRET>` with your CRON_SECRET from Part 4b.
4. **Pick the time** (optional): the default is **18:00 SA**. The file shows how
   to change it (it's in UTC, which is SA time minus 2 hours). Save the file.
5. In Supabase: **SQL Editor** → **New query** → paste the whole file → **Run**.
   - **You should see:** green success. To check, run a new query:
     `select jobname, schedule from cron.job;` — you should see
     `circle-quest-daily-reminder`.

---

## Part 8 — Test it now (don't wait for the evening)

1. On your phone, open the installed **Circle Quest** app → tap **🔔 Turn on**
   on the Daily reminder card → tap **Allow**.
2. In Supabase: **Edge Functions** → **send-push** → **Invoke** (or **Test**).
   - In the request **body**, paste:  `{ "test": true }`
   - Add a **header** named `x-cron-secret` with your CRON_SECRET value.
   - Click **Send/Invoke**.
   - ✅ Within a few seconds you should get a **Circle Quest** notification.

(`{ "test": true }` pings every subscribed device. The real daily job skips
anyone who already did that day's quest.)

### If a notification doesn't arrive
- Make sure you tapped **Allow** (not Block).
- **iPhone only:** the app **must** be added to the home screen and opened from
  that icon — notifications never work in a Safari tab.
- Check the phone isn't on Do-Not-Disturb / Focus.
- In Supabase → **Edge Functions → send-push → Logs**, look for errors. A `401`
  means the `x-cron-secret` didn't match — re-check it's identical in your
  secrets (Part 5) and in `cron.sql` (Part 7).
- Re-open the app once after installing — that's when the device registers.

---

## For the learners (what the kids do)

Send them this once:

> **Circle Quest — get your daily reminder**
> 1. Open **https://megzieberr.github.io/circle-geo-quest/**
>    - **iPhone:** in **Safari**, tap **Share** (□↑) → **Add to Home Screen** → **Add**. Then open it from the new icon.
>    - **Android:** in **Chrome**, tap **⋮** → **Install app** / **Add to Home screen**.
> 2. Log in as usual.
> 3. On the home screen, tap **🔔 Turn on** and then **Allow**.
> That's it — you'll get a friendly reminder each day to do your quest. 🔵

---

## You're done 🎉
Each day at your chosen time, every learner who still has reminders on **and
hasn't done that day's Daily Challenge** gets one gentle nudge. To change the
time, edit `supabase/cron.sql` and run it again.
