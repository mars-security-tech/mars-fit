// Service worker: cache offline + push notifications
const CACHE = "marsfit-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/app.js",
  "./icons/icon.svg",
  "./manifest.json"
];
self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(()=>{}));
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match("./index.html")))
  );
});

// Push
self.addEventListener("push", e => {
  let data = { title: "MĀRS FIT", body: "Nueva actividad en tu escuadrón" };
  try { if (e.data) data = e.data.json(); } catch {}
  e.waitUntil(self.registration.showNotification(data.title || "MĀRS FIT", {
    body: data.body,
    icon: "icons/icon.svg",
    badge: "icons/icon.svg",
    vibrate: [80, 40, 80],
    tag: data.tag || "mars",
    data: { url: data.url || "./#circle" }
  }));
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = e.notification.data?.url || "./";
  e.waitUntil(self.clients.matchAll({ type: "window" }).then(list => {
    for (const c of list) {
      if (c.url.includes(url) && "focus" in c) return c.focus();
    }
    if (self.clients.openWindow) return self.clients.openWindow(url);
  }));
});
