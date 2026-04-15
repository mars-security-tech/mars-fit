// Web Push para "picadas" del escuadrón.
// Requiere VAPID public key (se guarda en config local o window.__MARSFIT_VAPID).
// Registro vía service worker -> subscription -> envío a Supabase.

import { getClient, getUser } from "./backend-legacy.js";

const VAPID_KEY_LS = "marsfit.vapid.public";

function urlB64ToUint8Array(b64) {
  const padding = "=".repeat((4 - b64.length % 4) % 4);
  const s = (b64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(s);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export function getVapidKey() {
  return localStorage.getItem(VAPID_KEY_LS) || window.__MARSFIT_VAPID || "";
}
export function setVapidKey(k) { localStorage.setItem(VAPID_KEY_LS, k); }

export function pushSupported() {
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

export async function requestPushPermission() {
  if (!pushSupported()) throw new Error("Push no soportado en este navegador.");
  const perm = await Notification.requestPermission();
  if (perm !== "granted") throw new Error("Permiso denegado.");
  return true;
}

export async function subscribe() {
  await requestPushPermission();
  const vapid = getVapidKey();
  if (!vapid) throw new Error("Falta VAPID public key (ajustes).");

  const reg = await navigator.serviceWorker.ready;
  const existing = await reg.pushManager.getSubscription();
  if (existing) return existing;

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlB64ToUint8Array(vapid)
  });

  // Guardar en Supabase si está configurado
  const client = await getClient();
  const user = await getUser();
  if (client && user) {
    const raw = sub.toJSON();
    await client.from("push_subscriptions").upsert({
      user_id: user.id,
      endpoint: raw.endpoint,
      p256dh: raw.keys?.p256dh,
      auth: raw.keys?.auth
    }, { onConflict: "endpoint" });
  }
  return sub;
}

export async function unsubscribe() {
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  if (sub) {
    await sub.unsubscribe();
    const client = await getClient();
    if (client) await client.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
  }
}

// Notificación local para demo/testing
export async function localTestNotification() {
  if (!pushSupported()) return;
  await requestPushPermission();
  const reg = await navigator.serviceWorker.ready;
  reg.showNotification("🔥 Te han picado en el escuadrón", {
    body: "Marcos ha subido 2.5 kg en press banca. ¿Vas a dejar que te gane?",
    icon: "icons/icon.svg",
    badge: "icons/icon.svg",
    vibrate: [80, 40, 80],
    tag: "mars-picada",
    data: { url: "./#circle" }
  });
}
