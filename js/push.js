/* ============================================================
   PUSH NOTIFICATIONS (client side)
   ------------------------------------------------------------
   Asks the learner for permission, subscribes this device to push,
   and stores the subscription via the password-checked RPC. The
   service worker (sw.js) shows the notification when it arrives.

   iPhone note: PushManager only exists once the app has been ADDED
   TO THE HOME SCREEN and opened from there — so pushSupported() is
   naturally false in a plain Safari tab, and the UI hides itself.
   ============================================================ */
import { VAPID_PUBLIC_KEY } from "./push-config.js";
import { api } from "./api.js";

export function pushSupported() {
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function pushConfigured() {
  return !!VAPID_PUBLIC_KEY;
}

/* Is the app running as an installed PWA (vs a browser tab)? */
export function isStandalone() {
  return (
    window.matchMedia && window.matchMedia("(display-mode: standalone)").matches
  ) || window.navigator.standalone === true;   // iOS Safari flag
}

/* VAPID public keys are base64url text; the browser needs raw bytes. */
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

/* Current state: 'unsupported' | 'unconfigured' | 'blocked' | 'on' | 'off' */
export async function pushState() {
  if (!pushSupported()) return "unsupported";
  if (!pushConfigured()) return "unconfigured";
  if (Notification.permission === "denied") return "blocked";
  if (Notification.permission !== "granted") return "off";
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    return sub ? "on" : "off";
  } catch {
    return "off";
  }
}

/* Ask permission, subscribe this device, and save it against the learner.
   Returns { ok: true } or { ok: false, reason }. */
export async function enablePush(name, password) {
  if (!pushSupported()) return { ok: false, reason: "unsupported" };
  if (!pushConfigured()) return { ok: false, reason: "unconfigured" };

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return { ok: false, reason: permission }; // 'denied' | 'default'

  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }

  const json = sub.toJSON();
  try {
    const r = await api.savePush(name, password, sub.endpoint, json);
    if (!r || !r.ok) return { ok: false, reason: (r && r.error) || "save-failed" };
  } catch (e) {
    return { ok: false, reason: "offline" };
  }
  return { ok: true };
}

/* Turn reminders off for this device (unsubscribe + forget on the server). */
export async function disablePush(name, password) {
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      const endpoint = sub.endpoint;
      await sub.unsubscribe();
      try { await api.removePush(name, password, endpoint); } catch { /* best-effort */ }
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: "error" };
  }
}
