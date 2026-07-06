// Circle Quest — the daily-reminder sender.
//
// One Edge Function (a small program Supabase runs on demand). The pg_cron
// schedule in cron.sql calls it once a day. By default it reminds only the
// learners who have NOT done today's Daily Challenge yet — so nobody who
// already played gets nagged. Send { "test": true } to ping every subscribed
// device regardless (handy for a quick test).
//
// It also supports a TARGETED encouragement: send
//   { "student_id": "<uuid>", "title": "...", "body": "...", "url": "./" }
// to ping just one learner's device(s) with a custom message. Used by the
// teacher to send a personal note (e.g. 'well done, try again this week').
//
// It runs on Deno, so libraries are imported with npm: specifiers.

import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

// --- Configuration from environment ---------------------------------------
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided automatically by
// Supabase. The VAPID keys and CRON_SECRET you set yourself (see PUSH-SETUP.md).
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VAPID_PUBLIC = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE = Deno.env.get("VAPID_PRIVATE_KEY")!;
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") ?? "mailto:teacher@example.com";
const CRON_SECRET = Deno.env.get("CRON_SECRET")!;

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);

const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

// Today's date in South African time (YYYY-MM-DD), matching how the app stores
// students.last_daily_day (the learner's local "today").
function saToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Johannesburg",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

// Send one payload to every subscription in `subs`. Drops any the push service
// reports as gone (404 / 410), e.g. the learner uninstalled the app.
async function sendTo(
  subs: Array<{ id: string; subscription: unknown }>,
  payload: Record<string, unknown>,
) {
  let sent = 0;
  let removed = 0;
  for (const row of subs) {
    try {
      await webpush.sendNotification(row.subscription as never, JSON.stringify(payload));
      sent++;
    } catch (err) {
      const code = (err as { statusCode?: number }).statusCode;
      if (code === 404 || code === 410) {
        await admin.from("push_subscriptions").delete().eq("id", row.id);
        removed++;
      }
    }
  }
  return { sent, removed };
}

Deno.serve(async (req) => {
  // Only our own cron job (which knows the shared secret) may trigger this.
  if (req.headers.get("x-cron-secret") !== CRON_SECRET) {
    return new Response("forbidden", { status: 401 });
  }

  let body: { test?: boolean; student_id?: string; title?: string; body?: string; url?: string } = {};
  try {
    body = await req.json();
  } catch (_) {
    body = {};
  }

  // --- Targeted mode: one learner, custom message -------------------------
  // When a student_id is supplied we ping only that learner's device(s) with
  // the given title/body. Nobody else is touched, and the daily-skip logic is
  // irrelevant here (this is a deliberate personal note, not the reminder).
  if (body.student_id) {
    const { data: subs } = await admin
      .from("push_subscriptions")
      .select("id, student_id, subscription")
      .eq("student_id", body.student_id);

    const res = await sendTo(subs ?? [], {
      title: body.title ?? "Circle Quest",
      body: body.body ?? "A message from your teacher 🌟",
      url: body.url ?? "./",
      tag: "circle-quest-personal",
    });

    return Response.json({ ok: true, mode: "targeted", student_id: body.student_id, found: (subs ?? []).length, ...res });
  }

  const date = saToday();

  // Which learners already did today's Daily Challenge? (Skip them — unless
  // this is a test run, which pings everyone.)
  const done = new Set<string>();
  if (body.test !== true) {
    const { data: doneRows } = await admin
      .from("students")
      .select("id")
      .eq("last_daily_day", date);
    for (const r of doneRows ?? []) done.add(r.id as string);
  }

  const { data: subs } = await admin
    .from("push_subscriptions")
    .select("id, student_id, subscription");

  const targets = (subs ?? []).filter((s) => !done.has(s.student_id as string));

  const res = await sendTo(targets, {
    title: "Circle Quest",
    body: "Keep your streak alive — your daily quest is waiting! 🔵",
    url: "./",
    tag: "circle-quest-daily",
  });

  return Response.json({ ok: true, date, test: body.test === true, targets: targets.length, ...res });
});
