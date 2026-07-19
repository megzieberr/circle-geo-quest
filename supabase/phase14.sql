-- ============================================================
--  CIRCLE QUEST — PHASE 14 MIGRATION
--  Expands the AVATAR allow-list from 20 ids to 53 — the "more
--  options, Kahoot-style" request (2026-07-19). No schema changes,
--  no new functions: this is cgg_set_profile re-created with the
--  bigger `allowed` array, everything else byte-identical to the
--  LIVE definition (fetched via pg_get_functiondef before writing
--  this file, per the phase12 lesson — never base a replacement on
--  schema.sql).
--
--  The id list mirrors CONFIG.AVATARS in js/config.js (which now
--  also carries display-only categories — the server never sees
--  those, it only validates ids). If you add an avatar in
--  js/config.js, add its id here too.
--
--  NOTE: this file is not run automatically — applied via the
--  Supabase MCP on 2026-07-19.
-- ============================================================

create or replace function public.cgg_set_profile(
  p_name text, p_password text, p_nickname text, p_avatar text)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  sid     uuid;
  nick    text;
  av      text;
  -- mirrors CONFIG.AVATARS in js/config.js — keep these two lists in sync.
  allowed text[] := array[
    'fox','owl','otter','panda','koala','cat','dog','lion','tiger','frog',
    'monkey','penguin','shark','dolphin','turtle','octopus','butterfly',
    'bee','parrot','hedgehog',
    'unicorn','dragon','trex','robot','alien','ghost',
    'comet','rocket','star','planet','moon','ufo','circle',
    'leaf','sprout','wave','rainbow','lightning','snowflake','cactus',
    'football','basketball','tennis','medal','target','dice','gamepad','skateboard',
    'guitar','drum','trumpet','pizza','donut','watermelon'
  ];
begin
  sid := public._cgg_auth(p_name, p_password);
  if sid is null then
    return jsonb_build_object('ok', false, 'error', 'auth');
  end if;

  -- trim + length-cap the nickname (~24 chars); empty string -> null.
  -- NO other validation — see phase12.sql header for why (moderation is a
  -- teacher action, cgg_admin_reset_nickname, not an algorithm here).
  nick := nullif(btrim(coalesce(p_nickname, '')), '');
  if nick is not null and length(nick) > 24 then
    nick := left(nick, 24);
  end if;

  -- unknown/tampered avatar id -> ignored (stored as null), not an error.
  av := nullif(btrim(coalesce(p_avatar, '')), '');
  if av is not null and not (av = any(allowed)) then
    av := null;
  end if;

  update public.students set nickname = nick, avatar_id = av where id = sid;

  return jsonb_build_object('ok', true, 'nickname', nick, 'avatarId', av);
end; $$;
