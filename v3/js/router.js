/**
 * MARS FIT v3 — Router hash-based con lifecycle de vistas
 *
 * Funcionalidades:
 * - Hash-based routing (#/home, #/workout, etc.)
 * - Transiciones CSS entre vistas (page-exit / page-enter)
 * - Lifecycle: mount / unmount / cleanup por vista
 * - Lazy loading de vistas con dynamic import()
 * - Navigation guards (redirect a onboarding si no configurado)
 * - Parametros en ruta (#/exercise/bench_press)
 * - Historial de navegacion para back()
 */

// ============================================================
// CONFIGURACION DE RUTAS
// ============================================================

const ROUTE_MAP = {
  '/home':             { module: './views/home.js',             fn: 'render', tab: '/home',      guard: 'auth' },
  '/workout':          { module: './views/workout.js',          fn: 'render', tab: '/workout',   guard: 'auth' },
  '/workout-log':      { module: './views/workout-log.js',      fn: 'render', tab: '/workout',   guard: 'auth' },
  '/exercise-library': { module: './views/exercise-library.js', fn: 'render', tab: '/workout',   guard: 'auth' },
  '/exercise/:id':     { module: './views/exercise-detail.js',  fn: 'render', tab: '/workout',   guard: 'auth' },
  '/routine-builder':  { module: './views/routine-builder.js',  fn: 'render', tab: '/workout',   guard: 'auth' },
  '/routine-builder/:id': { module: './views/routine-builder.js', fn: 'render', tab: '/workout', guard: 'auth' },
  '/nutrition':        { module: './views/nutrition.js',        fn: 'render', tab: '/nutrition',  guard: 'auth' },
  '/diet-builder':     { module: './views/diet-builder.js',     fn: 'render', tab: '/nutrition',  guard: 'auth' },
  '/diet-builder/:id': { module: './views/diet-builder.js',     fn: 'render', tab: '/nutrition',  guard: 'auth' },
  '/circle':           { module: './views/circle.js',           fn: 'render', tab: '/circle',     guard: 'auth' },
  '/profile':          { module: './views/profile.js',          fn: 'render', tab: '/profile',    guard: 'auth' },
  '/onboarding':       { module: './views/onboarding.js',       fn: 'render', tab: null,          guard: 'session' },
  '/login':            { module: './views/login.js',            fn: 'render', tab: null,          guard: null },
  '/register':         { module: './views/login.js',            fn: 'render', tab: null,          guard: null },
  '/admin':            { module: './views/admin.js',            fn: 'render', tab: null,          guard: 'admin' },
};

const DEFAULT_ROUTE = '/home';
const ONBOARDING_ROUTE = '/onboarding';
const LOGIN_ROUTE = '/login';

// ============================================================
// ESTADO DEL ROUTER
// ============================================================

let _container = null;
let _currentRoute = null;
let _currentParams = {};
let _cleanupFn = null;
let _isOnboarded = false;
let _isLoggedIn = false;
let _isAdminUser = false;
let _moduleCache = new Map();
let _navHistory = [];
let _callbacks = [];
let _transitioning = false;
let _pendingRoute = null;

// ============================================================
// MATCHING DE RUTAS
// ============================================================

/**
 * Parsea el hash actual y lo compara contra el mapa de rutas.
 * Soporta parametros dinamicos (:id).
 */
function matchRoute(hash) {
  let path = hash.replace(/^#/, '') || DEFAULT_ROUTE;
  if (!path.startsWith('/')) path = '/' + path;

  // Match exacto
  if (ROUTE_MAP[path]) {
    return { route: path, config: ROUTE_MAP[path], params: {} };
  }

  // Match con parametros dinamicos
  const pathParts = path.split('/').filter(Boolean);

  for (const [pattern, config] of Object.entries(ROUTE_MAP)) {
    const patternParts = pattern.split('/').filter(Boolean);
    if (patternParts.length !== pathParts.length) continue;

    const params = {};
    let match = true;

    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
      } else if (patternParts[i] !== pathParts[i]) {
        match = false;
        break;
      }
    }

    if (match) {
      return { route: pattern, config, params };
    }
  }

  return null;
}

// ============================================================
// NAVEGACION
// ============================================================

/**
 * Navegar a una ruta.
 * @param {string} route - Ej: '/workout' o '/exercise/bench_press'
 * @param {object} [options] - {replace, skipTransition}
 */
export function navigate(route, options = {}) {
  if (!route.startsWith('/')) route = '/' + route;

  if (options.replace) {
    history.replaceState(null, '', '#' + route);
  } else {
    history.pushState(null, '', '#' + route);
  }

  handleRouteChange(options.skipTransition);
}

/** Volver atras */
export function back() {
  if (_navHistory.length > 1) {
    history.back();
  } else {
    navigate(DEFAULT_ROUTE);
  }
}

/** Obtener ruta actual */
export function currentRoute() {
  return _currentRoute;
}

/** Obtener parametros de ruta actual */
export function getRouteParams() {
  return { ..._currentParams };
}

/**
 * Suscribirse a cambios de ruta.
 * @param {function} callback - Recibe {route, config, params}
 * @returns {function} unsubscribe
 */
export function onRouteChange(callback) {
  _callbacks.push(callback);
  return () => {
    _callbacks = _callbacks.filter(fn => fn !== callback);
  };
}

// ============================================================
// LIFECYCLE DE VISTAS
// ============================================================

async function handleRouteChange(skipTransition = false) {
  // If already transitioning, queue this navigation and return
  if (_transitioning) {
    _pendingRoute = { skipTransition };
    return;
  }
  _transitioning = true;

  try {
    const hash = location.hash || '#' + DEFAULT_ROUTE;
    const matched = matchRoute(hash);

    if (!matched) {
      console.warn('[Router] Ruta no encontrada:', hash);
      navigate(DEFAULT_ROUTE, { replace: true });
      return;
    }

    const { route, config, params } = matched;

    // Guard: requiere sesion activa
    if ((config.guard === 'auth' || config.guard === 'session' || config.guard === 'admin') && !_isLoggedIn) {
      navigate(LOGIN_ROUTE, { replace: true, skipTransition: true });
      return;
    }

    // Guard: requiere onboarding completado
    if (config.guard === 'auth' && !_isOnboarded) {
      navigate(ONBOARDING_ROUTE, { replace: true, skipTransition: true });
      return;
    }

    // Guard: requiere admin
    if (config.guard === 'admin' && !_isAdminUser) {
      navigate(DEFAULT_ROUTE, { replace: true, skipTransition: true });
      return;
    }

    // Misma ruta, mismos params => no recargar
    if (route === _currentRoute && JSON.stringify(params) === JSON.stringify(_currentParams)) {
      return;
    }

    // --- UNMOUNT vista actual ---
    if (_cleanupFn) {
      try { _cleanupFn(); } catch (e) { console.error('[Router] Error en cleanup:', e); }
      _cleanupFn = null;
    }

    // Transicion de salida
    if (!skipTransition && _container && _container.children.length > 0) {
      _container.classList.add('page-exit');
      await new Promise(r => setTimeout(r, 150));
      _container.classList.remove('page-exit');
    }

    // Limpiar contenedor
    if (_container) _container.innerHTML = '';

    // Actualizar estado
    _currentRoute = route;
    _currentParams = params;
    _navHistory.push(route);
    if (_navHistory.length > 50) _navHistory.shift();

    // --- IMPORT lazy ---
    let mod;
    if (_moduleCache.has(config.module)) {
      mod = _moduleCache.get(config.module);
    } else {
      try {
        mod = await import(config.module);
        _moduleCache.set(config.module, mod);
      } catch (e) {
        console.error('[Router] Error importando modulo:', config.module, e);
        if (_container) {
          _container.innerHTML = `
            <div class="page-content flex flex-col items-center justify-center" style="min-height:60vh">
              <p class="text-secondary text-lg">Error cargando vista</p>
              <p class="text-tertiary text-xs mt-2">${config.module}</p>
            </div>`;
        }
        return;
      }
    }

    // --- MOUNT nueva vista ---
    const renderFn = mod[config.fn];
    if (typeof renderFn !== 'function') {
      console.error('[Router] Funcion render no encontrada en:', config.module);
      return;
    }

    const context = { navigate, back, params, route };
    _cleanupFn = renderFn(_container, context);

    // Transicion de entrada
    if (!skipTransition && _container) {
      _container.classList.add('page-enter');
      // Quitar clase tras animacion (400ms segun design-system)
      const onEnd = () => {
        _container.classList.remove('page-enter');
        _container.removeEventListener('animationend', onEnd);
      };
      _container.addEventListener('animationend', onEnd);
    }

    // Notificar callbacks
    const info = { route, config, params };
    _callbacks.forEach(fn => {
      try { fn(info); } catch (e) { console.error('[Router] Error en callback:', e); }
    });

  } finally {
    _transitioning = false;

    // Process any queued navigation
    if (_pendingRoute) {
      const pending = _pendingRoute;
      _pendingRoute = null;
      handleRouteChange(pending.skipTransition);
    }
  }
}

// ============================================================
// INICIALIZACION
// ============================================================

/**
 * Inicializar el router.
 * @param {HTMLElement} container - #app
 * @param {object} options
 * @param {boolean} options.isOnboarded
 * @param {function} [options.onRouteChange] - Callback para cambio de ruta
 * @returns {function} destroy
 */
export function initRouter(container, { isOnboarded = false, isLoggedIn = false, isAdmin = false, onRouteChange: routeCallback = null } = {}) {
  _container = container;
  _isOnboarded = isOnboarded;
  _isLoggedIn = isLoggedIn;
  _isAdminUser = isAdmin;

  if (routeCallback) {
    _callbacks.push(routeCallback);
  }

  const onHashChange = () => handleRouteChange();
  window.addEventListener('hashchange', onHashChange);

  // Initial navigation: use replaceState to avoid firing a spurious hashchange
  if (!location.hash) {
    if (!isLoggedIn) {
      history.replaceState(null, '', '#' + LOGIN_ROUTE);
    } else if (!isOnboarded) {
      history.replaceState(null, '', '#' + ONBOARDING_ROUTE);
    } else {
      history.replaceState(null, '', '#' + DEFAULT_ROUTE);
    }
  }
  handleRouteChange(true);

  return () => {
    window.removeEventListener('hashchange', onHashChange);
    if (_cleanupFn) { try { _cleanupFn(); } catch(e) {} }
  };
}

/**
 * Actualizar estado de onboarding.
 */
export function setOnboarded(onboarded) {
  _isOnboarded = onboarded;
  if (onboarded && _currentRoute === ONBOARDING_ROUTE) {
    navigate(DEFAULT_ROUTE, { replace: true });
  }
}

/**
 * Actualizar estado de sesion.
 */
export function setLoggedIn(loggedIn) {
  _isLoggedIn = loggedIn;
}

/**
 * Actualizar estado de admin.
 */
export function setIsAdmin(isAdminUser) {
  _isAdminUser = isAdminUser;
}

/**
 * Obtener tab activo para la ruta actual.
 */
export function getActiveTab() {
  if (!_currentRoute) return null;
  const matched = matchRoute('#' + _currentRoute);
  return matched?.config?.tab ?? null;
}
