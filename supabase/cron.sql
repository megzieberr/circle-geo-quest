-- ============================================================
--  CIRCLE QUEST — the daily reminder schedule
--
--  A "schedule" = a job the database runs by itself at a set time. This one
--  calls the send-push Edge Function once a day, which sends the reminder to
--  every learner who hasn't done that day's Daily Challenge yet.
--
--  RUN THIS ONLY AFTER you have:
--    1. run phase4.sql,
--    2. deployed the send-push Edge Function, and
--    3. set its secrets (including CRON_SECRET).
--
--  BEFORE running, replace the two placeholders below:
--    <PROJECT_REF>  -> your project ref (Project Settings -> General -> Reference ID)
--    <CRON_SECRET>  -> the EXACT same value you set as the CRON_SECRET secret
--
--  PICK THE TIME: pg_cron runs on UTC. South Africa is UTC+2 (no daylight
--  saving), so subtract 2 hours from the SA time you want:
--    15:00 SA (after school) = 13:00 UTC  ->  '0 13 * * *'
--    18:00 SA (after supper) = 16:00 UTC  ->  '0 16 * * *'   <-- default below
--    19:30 SA                = 17:30 UTC  ->  '30 17 * * *'
--  Cron format is:  minute hour day-of-month month day-of-week
-- ============================================================

-- Make sure the scheduling tools exist (also doable on the Extensions page).
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Remove an old copy first so this file is safe to re-run.
do $$ begin perform cron.unschedule('circle-quest-daily-reminder'); exception when others then null; end $$;

-- Daily "do your quest" reminder. Default 18:00 SA (16:00 UTC).
select cron.schedule(
  'circle-quest-daily-reminder',
  '0 16 * * *',
  $job$
  select net.http_post(
    url     := 'https://<PROJECT_REF>.supabase.co/functions/v1/send-push',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-cron-secret', '<CRON_SECRET>'),
    body    := jsonb_build_object('type', 'daily')
  );
  $job$
);

-- To check the job was created, run:   select jobname, schedule from cron.job;
-- To change the time later, just edit the time above and run this file again.
