/**
 * MARS FIT v3 — Entry point
 *
 * Responsabilidades:
 * 1. Inicializar store (IndexedDB + localStorage)
 * 2. Inicializar router con guards
 * 3. Registrar service worker
 * 4. Theme manager (dark/light con persistencia)
 * 5. Topbar: logo, nombre, theme toggle, admin btn, logout btn, avatar
 * 6. Tabbar: 5 botones con iconos del sistema
 * 7. Global event handlers
 */

import {
  initStore,
  getConfig,
  setConfig,
  updateProfile,
  subscribe,
  resetAll,
  today,
  computeTDEE,
  computeMacros,
  getDashboardSummary,
} from './store-v3.js';

import {
  initRouter,
  navigate,
  back,
  setOnboarded,
  setLoggedIn,
  setIsAdmin,
  getActiveTab,
} from './router.js';

import {
  getSession,
  isLoggedIn as authIsLoggedIn,
  isAdmin as authIsAdmin,
  logout as authLogout,
} from './auth.js';

import { icon, marsLogo } from './icons.js';

// ============================================================
// REFERENCIAS DOM
// ============================================================

const app = document.getElementById('app');
const topbar = document.getElementById('topbar');
const tabbar = document.getElementById('tabbar');
const userAvatar = document.getElementById('user-avatar');
const themeToggle = document.getElementById('theme-toggle');
const adminBtn = document.getElementById('admin-btn');
const logoutBtn = document.getElementById('logout-btn');
const userName = document.getElementById('user-name');

// ============================================================
// THEME MANAGER
// ============================================================

const THEME_META = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

  if (THEME_META) {
    THEME_META.content = isDark ? '#0A0A0F' : '#F5F5F7';
  }

  // Actualizar icono del toggle
  if (themeToggle) {
    themeToggle.innerHTML = isDark ? icon('moon', 18) : icon('sun', 18);
  }

  // Logo SVG color adapts automatically via CSS (currentColor)
}

function toggleTheme() {
  const config = getConfig();
  const newTheme = config.theme === 'dark' ? 'light' : 'dark';
  setConfig({ theme: newTheme });
  applyTheme(newTheme);
}

// ============================================================
// TOPBAR SYNC
// ============================================================

function syncTopbar(config) {
  const session = getSession();

  if (!session || !config.onboarded) {
    topbar.classList.add('hidden');
    tabbar.classList.add('hidden');
    return;
  }

  topbar.classList.remove('hidden');
  tabbar.classList.remove('hidden');

  // User name display
  if (userName) {
    userName.textContent = session.name || config.profile.name || '';
  }

  // Admin button visibility
  if (adminBtn) {
    if (session.isAdmin) {
      adminBtn.classList.remove('hidden');
    } else {
      adminBtn.classList.add('hidden');
    }
  }

  // Logout button
  if (logoutBtn) {
    logoutBtn.classList.remove('hidden');
  }

  // Avatar con iniciales
  if (userAvatar) {
    const name = session.name || config.profile.name || 'U';
    const initials = name
      .split(' ')
      .map(w => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    userAvatar.textContent = initials;
  }
}

// ============================================================
// TABBAR RENDER + SYNC
// ============================================================

const TAB_ICONS = {
  '/home':      { iconName: 'home',     label: 'HOY' },
  '/workout':   { iconName: 'dumbbell', label: 'ENTRENO' },
  '/nutrition': { iconName: 'fork',     label: 'DIETA' },
  '/circle':    { iconName: 'users',    label: 'TEAM' },
  '/profile':   { iconName: 'settings', label: 'PERFIL' },
};

function renderTabbar() {
  const items = tabbar.querySelectorAll('.tabbar__item');
  items.forEach(btn => {
    const route = btn.dataset.route;
    const tabDef = TAB_ICONS[route];
    if (!tabDef) return;

    const iconSpan = btn.querySelector('.tabbar__icon');
    if (iconSpan) {
      iconSpan.innerHTML = icon(tabDef.iconName, 22);
    }
  });
}

function syncTabbar(routeInfo) {
  if (!routeInfo) return;
  const activeTab = routeInfo.config?.tab;

  tabbar.querySelectorAll('.tabbar__item').forEach(btn => {
    const route = '/' + btn.dataset.route.replace(/^\//, '');
    const isActive = route === activeTab;
    btn.classList.toggle('tabbar__item--active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
}

// ============================================================
// GLOBAL EVENT HANDLERS
// ============================================================

function setupGlobalEvents() {
  // Tabbar clicks
  tabbar.addEventListener('click', (e) => {
    const btn = e.target.closest('.tabbar__item');
    if (!btn) return;
    const route = btn.dataset.route;
    if (route) navigate(route);
  });

  // Avatar -> perfil
  if (userAvatar) {
    userAvatar.addEventListener('click', () => navigate('/profile'));
    userAvatar.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/profile'); }
    });
  }

  // Logo click → home
  const logoLink = document.getElementById('logo-home-link');
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      navigate('/home');
    });
  }

  // Theme toggle
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Admin button
  if (adminBtn) {
    adminBtn.addEventListener('click', () => navigate('/admin'));
  }

  // Logout button
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      authLogout();
      // Clear theme override so next user gets default
      try { localStorage.removeItem('marsfit.theme'); } catch { /* ignore */ }
      setLoggedIn(false);
      setIsAdmin(false);
      topbar.classList.add('hidden');
      tabbar.classList.add('hidden');
      navigate('/login', { replace: true });
    });
  }

  // Scroll topbar glass effect
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        topbar.classList.toggle('topbar--scrolled', window.scrollY > 8);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Online / offline
  window.addEventListener('online', () => {
    console.log('[App] Online');
    document.body.classList.remove('offline');
  });

  window.addEventListener('offline', () => {
    console.log('[App] Offline');
    document.body.classList.add('offline');
  });
}

// ============================================================
// SERVICE WORKER
// ============================================================

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  if (location.protocol === 'file:') return;

  try {
    const reg = await navigator.serviceWorker.register('./sw-v3.js', { scope: './' });
    console.log('[App] SW registrado:', reg.scope);

    navigator.serviceWorker.addEventListener('message', (e) => {
      if (e.data?.type === 'SYNC_COMPLETE') {
        console.log('[App] Sync completado desde SW.');
      }
    });
  } catch (e) {
    console.warn('[App] SW no registrado:', e.message);
  }
}

// ============================================================
// BOOT
// ============================================================

async function boot() {
  console.log('[MARS FIT v3] Iniciando...');

  // 1. Store
  const config = await initStore();

  // 2. Auth state
  const loggedIn = authIsLoggedIn();
  const isAdmin = authIsAdmin();

  // 3. Theme
  applyTheme(config.theme || 'dark');

  // 4. Render tabbar icons, topbar logo + action icons
  renderTabbar();

  // Render inline SVG logo in topbar
  const logoIcon = document.getElementById('topbar-logo-icon');
  if (logoIcon) logoIcon.innerHTML = marsLogo(28);

  // Admin + logout button icons
  if (adminBtn) adminBtn.innerHTML = icon('shield', 18);
  if (logoutBtn) logoutBtn.innerHTML = icon('log-out', 18);

  // 5. Sync topbar
  syncTopbar(config);

  // 6. Router
  const destroyRouter = initRouter(app, {
    isOnboarded: config.onboarded,
    isLoggedIn: loggedIn,
    isAdmin: isAdmin,
    onRouteChange: (routeInfo) => {
      syncTabbar(routeInfo);
      // Ocultar topbar/tabbar durante onboarding/login
      if (routeInfo.config.tab === null) {
        topbar.classList.add('hidden');
        tabbar.classList.add('hidden');
      } else {
        const c = getConfig();
        const session = getSession();
        if (c.onboarded && session) {
          topbar.classList.remove('hidden');
          tabbar.classList.remove('hidden');
        }
      }
    },
  });

  // 6. Subscribe a cambios de config
  subscribe((cfg) => syncTopbar(cfg));

  // 7. Event handlers
  setupGlobalEvents();

  // 8. Service worker
  registerServiceWorker();

  // 9. Offline check
  if (!navigator.onLine) {
    document.body.classList.add('offline');
  }

  // Debug helpers
  window.__marsfit = {
    getConfig,
    setConfig,
    updateProfile,
    resetAll,
    navigate,
    back,
    setOnboarded,
    computeTDEE,
    computeMacros,
    getDashboardSummary,
    today,
    version: '3.0.0',
  };

  console.log('[MARS FIT v3] Listo.');
}

boot().catch(e => {
  console.error('[MARS FIT v3] Error fatal:', e);
  if (app) {
    // Build error UI safely with DOM APIs to prevent XSS
    app.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'page-content flex flex-col items-center justify-center text-center p-8';
    wrapper.style.minHeight = '80vh';

    const heading = document.createElement('h2');
    heading.className = 'text-mars mb-4';
    heading.textContent = 'Error al iniciar MARS FIT';

    const msg = document.createElement('p');
    msg.className = 'text-secondary mb-6';
    msg.textContent = e.message;

    const btn = document.createElement('button');
    btn.className = 'btn btn--primary';
    btn.textContent = 'Reintentar';
    btn.addEventListener('click', () => location.reload());

    wrapper.appendChild(heading);
    wrapper.appendChild(msg);
    wrapper.appendChild(btn);
    app.appendChild(wrapper);
  }
});
