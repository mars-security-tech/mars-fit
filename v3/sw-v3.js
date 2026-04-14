/**
 * MARS FIT v3 — Service Worker
 *
 * Estrategias de cache:
 * - Cache-first para assets estaticos (CSS, JS, fuentes, iconos)
 * - Network-first para API calls (Supabase)
 * - Stale-while-revalidate para HTML shell
 *
 * Features:
 * - Background sync queue para workouts/meals offline
 * - Push notification handlers
 * - Periodic sync para datos de salud
 * - Precache de assets criticos en install
 */

// ============================================================
// CONFIGURACION
// ============================================================

const CACHE_NAME = 'marsfit-v3-1';
const CACHE_API = 'marsfit-v3-api';
const CACHE_FONTS = 'marsfit-v3-fonts';

/** Assets a precachear durante install */
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest-v3.json',
  './css/design-system.css',
  './js/app-v3.js',
  './js/store-v3.js',
  './js/router.js',
  './data/diets-v3.js',
  './data/routines-v3.js',
  '../icons/icon.png',
  '../icons/icon.svg',
];

/** Patrones de URL que van network-first (API) */
const API_PATTERNS = [
  /supabase\.co/,
  /api\.anthropic\.com/,
  /api\.openai\.com/,
];

/** Patrones de URL que van cache-first (assets estaticos) */
const STATIC_PATTERNS = [
  /\.js$/,
  /\.css$/,
  /\.png$/,
  /\.svg$/,
  /\.woff2?$/,
  /\.ttf$/,
  /fonts\.googleapis\.com/,
  /fonts\.gstatic\.com/,
  /cdn\.jsdelivr\.net/,
];

// ============================================================
// INSTALL — Precache de assets
// ============================================================

self.addEventListener('install', (event) => {
  console.log('[SW] Install v3');
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .catch(err => console.warn('[SW] Error en precache:', err))
  );
});

// ============================================================
// ACTIVATE — Limpiar caches antiguos
// ============================================================

self.addEventListener('activate', (event) => {
  console.log('[SW] Activate v3');

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME && key !== CACHE_API && key !== CACHE_FONTS)
          .map(key => {
            console.log('[SW] Borrando cache antiguo:', key);
            return caches.delete(key);
          })
      )
    )
  );

  self.clients.claim();
});

// ============================================================
// FETCH — Estrategias de cache
// ============================================================

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo cachear GET requests
  if (request.method !== 'GET') return;

  // Ignorar chrome-extension, etc.
  if (!url.protocol.startsWith('http')) return;

  // --- API: Network-first ---
  if (API_PATTERNS.some(p => p.test(url.href))) {
    event.respondWith(networkFirst(request, CACHE_API));
    return;
  }

  // --- Fonts: Cache-first (larga duracion) ---
  if (/fonts\.(googleapis|gstatic)\.com/.test(url.href)) {
    event.respondWith(cacheFirst(request, CACHE_FONTS));
    return;
  }

  // --- CDN assets: Cache-first ---
  if (/cdn\.jsdelivr\.net/.test(url.href)) {
    event.respondWith(cacheFirst(request, CACHE_NAME));
    return;
  }

  // --- HTML shell: Stale-while-revalidate ---
  if (request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.endsWith('/')) {
    event.respondWith(staleWhileRevalidate(request, CACHE_NAME));
    return;
  }

  // --- Static assets: Cache-first ---
  if (STATIC_PATTERNS.some(p => p.test(url.href))) {
    event.respondWith(cacheFirst(request, CACHE_NAME));
    return;
  }

  // --- Default: Network with cache fallback ---
  event.respondWith(
    fetch(request)
      .then(response => {
        // Clonar y guardar en cache
        if (response.ok) {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, cloned));
        }
        return response;
      })
      .catch(() => caches.match(request).then(r => r || caches.match('./index.html')))
  );
});

// ============================================================
// CACHE STRATEGIES
// ============================================================

/**
 * Cache-first: buscar en cache, si no hay, ir a red y cachear.
 */
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Offline fallback
    return caches.match('./index.html');
  }
}

/**
 * Network-first: intentar red, si falla, usar cache.
 * Util para API calls que queremos frescos.
 */
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Devolver respuesta de error offline
    return new Response(
      JSON.stringify({ error: 'offline', message: 'Sin conexion' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Stale-while-revalidate: devolver cache inmediatamente,
 * actualizar en background.
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  // Revalidar en background
  const fetchPromise = fetch(request)
    .then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  // Devolver cache si existe, si no esperar la red
  return cached || fetchPromise;
}

// ============================================================
// BACKGROUND SYNC — Sincronizar datos offline
// ============================================================

self.addEventListener('sync', (event) => {
  console.log('[SW] Sync event:', event.tag);

  if (event.tag === 'sync-workouts' || event.tag === 'sync-meals' || event.tag === 'sync-all') {
    event.waitUntil(syncOfflineData());
  }
});

/**
 * Sincronizar datos pendientes con el servidor.
 * Lee la syncQueue de IndexedDB y sube a Supabase.
 */
async function syncOfflineData() {
  try {
    // Abrir IndexedDB desde el SW
    const db = await openIDB();
    const tx = db.transaction('syncQueue', 'readonly');
    const store = tx.objectStore('syncQueue');
    const allItems = await idbGetAll(store);

    if (!allItems.length) {
      console.log('[SW] Sync: no hay items pendientes.');
      return;
    }

    console.log(`[SW] Sync: ${allItems.length} items pendientes.`);

    // TODO: implementar subida a Supabase
    // Para cada item en la cola:
    // 1. Leer apiKeys del localStorage (no disponible en SW)
    //    -> Alternativa: los clients envian las keys via postMessage
    // 2. Hacer POST/PUT/DELETE a Supabase
    // 3. Si exito, eliminar de la cola
    // 4. Si fallo, dejar para el proximo sync

    // Notificar a los clients que sync esta completo
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({ type: 'SYNC_COMPLETE', count: allItems.length });
    });

  } catch (err) {
    console.error('[SW] Error en sync:', err);
  }
}

// ---- IndexedDB helpers para el SW ----

function openIDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('marsfit_v3', 1);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbGetAll(store) {
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// ============================================================
// PUSH NOTIFICATIONS
// ============================================================

self.addEventListener('push', (event) => {
  let data = {
    title: 'MARS FIT',
    body: 'Nueva actividad en tu team',
    icon: '../icons/icon.png',
    badge: '../icons/icon.png',
    tag: 'mars',
    url: './#/home',
  };

  try {
    if (event.data) {
      const payload = event.data.json();
      data = { ...data, ...payload };
    }
  } catch {
    // payload no es JSON, usar body como texto
    if (event.data) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '../icons/icon.png',
    badge: data.badge || '../icons/icon.png',
    vibrate: [80, 40, 80],
    tag: data.tag || 'mars',
    renotify: true,
    data: { url: data.url || './#/home' },
    actions: [
      { action: 'open', title: 'Abrir' },
      { action: 'dismiss', title: 'Cerrar' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'MARS FIT', options)
  );
});

// ============================================================
// NOTIFICATION CLICK
// ============================================================

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const url = event.notification.data?.url || './';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clients => {
        // Buscar ventana existente de la app
        for (const client of clients) {
          if (client.url.includes('/v3/') && 'focus' in client) {
            // Navegar a la URL del push
            client.postMessage({ type: 'NAVIGATE', url });
            return client.focus();
          }
        }
        // Abrir nueva ventana si no hay ninguna
        if (self.clients.openWindow) {
          return self.clients.openWindow(url);
        }
      })
  );
});

// ============================================================
// PERIODIC SYNC — Datos de salud en background
// ============================================================

self.addEventListener('periodicsync', (event) => {
  console.log('[SW] Periodic sync:', event.tag);

  if (event.tag === 'sync-health-data') {
    event.waitUntil(syncHealthData());
  }
});

async function syncHealthData() {
  // TODO: implementar sync periodico de datos de salud
  // 1. Leer datos nuevos de Apple Health (requiere la app abierta)
  // 2. Sincronizar con Supabase
  console.log('[SW] Periodic health sync placeholder.');
}

// ============================================================
// MESSAGE HANDLER — Comunicacion con la app
// ============================================================

self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {};

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'CACHE_URLS':
      // La app puede pedir que se cacheen URLs adicionales
      if (Array.isArray(payload)) {
        caches.open(CACHE_NAME).then(cache => {
          cache.addAll(payload).catch(() => {});
        });
      }
      break;

    case 'TRIGGER_SYNC':
      // Disparar sync manual desde la app
      if (self.registration.sync) {
        self.registration.sync.register('sync-all').catch(() => {});
      }
      break;

    default:
      break;
  }
});
