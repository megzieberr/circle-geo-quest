/* ============================================================
   Supabase project credentials. These are the PUBLIC client
   credentials — safe to ship: every table is locked by row-level
   security, so this key can only call the verified RPC functions
   in supabase/schema.sql. It can never read or write a table
   directly, and can never see a password.

   Accepts either the new "publishable" key (sb_publishable_…) or
   a legacy anon key (eyJ…). Leave both blank to play locally.
   ============================================================ */
export const SUPABASE = {
  url: "https://vlelxvhlyydwxnhbijco.supabase.co",
  anonKey: "sb_publishable_mbi2dTkuEBTUXPfmMmYkyQ_aiS-YDgi",
};
