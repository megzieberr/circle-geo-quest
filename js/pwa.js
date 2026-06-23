/* ============================================================
   PWA glue — registers the service worker so Circle Quest can be
   installed to a phone's home screen. (Daily-reminder push is added
   on top of this in a later step; the service worker already handles
   the push + notification-tap events.)
   ============================================================ */

// Resolve sw.js relative to the page, so it works both locally (served at /)
// and on GitHub Pages (served at /circle-geo-quest/).
export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return null;
  try {
    return await navigator.serviceWorker.register("./sw.js");
  } catch (e) {
    console.error("Service worker registration failed", e);
    return null;
  }
}
