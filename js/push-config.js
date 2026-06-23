/* ============================================================
   PUSH (notifications) — the PUBLIC VAPID key.

   This is the public half of your notification key pair. It is SAFE to
   commit and ship to the browser — it only lets the app subscribe to push;
   it can never send a notification. The PRIVATE key is the one that sends,
   and it lives ONLY in Supabase (never here, never in GitHub).

   >>> PASTE YOUR VAPID PUBLIC KEY BETWEEN THE QUOTES BELOW <<<
   Generate the pair with:  python tools/gen_vapid.py
   (It prints a PUBLIC key — paste it here — and a PRIVATE key — keep secret.)

   Leave it blank to keep notifications turned off everywhere.
   ============================================================ */
export const VAPID_PUBLIC_KEY = "BMYA8k1pGLQC3Clh6MI556O5ZmevWSPeBlpBqeN6_1eBKF49s3_v7YTFO4ioQH_Rn-VAVyQ_tjpNbRjnuFfIDww";
