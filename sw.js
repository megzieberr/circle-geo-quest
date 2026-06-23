/* global self, clients */
/* Circle Quest service worker.
   A tiny background script the browser keeps available even when the app is
   closed. Its jobs: (1) make the app installable, (2) show a notification when
   a daily-reminder push arrives, and (3) open the app when it's tapped.

   It deliberately does NOT cache the app's code. Circle Quest updates often
   (every git push redeploys), and caching here would risk serving a stale
   version. The network always serves the freshest files. */

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// A no-op fetch handler so the browser counts this as an installable app.
self.addEventListener('fetch', () => {});

// A push arrived from our server (the daily reminder). Show it.
self.addEventListener('push', (event) => {
  let data = {};
  try {
    if (event.data) data = event.data.json();
  } catch (e) {
    data = {};
  }

  const title = data.title || 'Circle Quest';
  const options = {
    body: data.body || 'Your daily quest is waiting!',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: data.tag || 'circle-quest-daily',
    renotify: true,
    data: { url: data.url || './' },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Tapping the notification focuses the open app, or opens it fresh.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || './';

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if ('focus' in client) return client.focus();
        }
        if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
      }),
  );
});
