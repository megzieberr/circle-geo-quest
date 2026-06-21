-- ============================================================
--  STEP 2 — set the admin password + seed the class list.
--  Run this AFTER schema.sql.
--  >>> Change PICK-YOUR-PASSWORD below to your real admin password. <<<
--  Re-running is safe (existing learners are skipped).
-- ============================================================

-- 1) ADMIN PASSWORD  (stored hashed with bcrypt; never readable)
--    crypt()/gen_salt() live in the "extensions" schema on Supabase.
set search_path = public, extensions;
insert into public.app_config (key, value)
values ('admin_password', crypt('PICK-YOUR-PASSWORD', gen_salt('bf')))
on conflict (key) do update set value = excluded.value;

-- 2) CLASS LIST — Grade 11 (display name = first name + surname initial)
--    >>> EXAMPLE NAMES ONLY. <<<
--    This repository is PUBLIC, so do NOT commit real learner names here.
--    Replace the examples below with your real class list when you run this
--    in the Supabase SQL editor — those names live only in your Supabase
--    project (already seeded), never in the repo.
insert into public.students (display_name) values
  ('Learner One'),
  ('Learner Two'),
  ('Learner Three'),
  ('Learner Four'),
  ('Learner Five')
on conflict (display_name) do nothing;

-- ------------------------------------------------------------
--  HANDY SNIPPETS (run any time in the SQL editor)
-- ------------------------------------------------------------
-- Add one learner later:
--   insert into public.students (display_name) values ('New Name') on conflict do nothing;
-- Remove a learner:
--   delete from public.students where display_name = 'Some Name';
-- Look up a forgotten password (or use the admin dashboard):
--   select display_name, password from public.students where display_name = 'Some Name';
-- Let a learner re-pick their password:
--   update public.students set password = null where display_name = 'Some Name';
-- Change the admin password later:
--   update public.app_config set value = crypt('new-password', gen_salt('bf')) where key = 'admin_password';
