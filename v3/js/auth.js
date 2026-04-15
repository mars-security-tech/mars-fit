/**
 * MARS FIT v3 — Auth local (MVP)
 *
 * Usuarios en localStorage 'marsfit_users'
 * Sesion activa en 'marsfit_session'
 * Preparado para migracion a Supabase.
 */

const USERS_KEY = 'marsfit_users';
const SESSION_KEY = 'marsfit_session';

/** Session lifetime: 90 days in milliseconds */
const SESSION_TTL_MS = 90 * 24 * 60 * 60 * 1000;

/**
 * Admin identity — password is NOT stored here.
 * The hash is computed at seed time from the module-private constant below.
 */
const ADMIN = {
  email: 'v.guillen@mars-seguridad.com',
  name: 'Vin',
  isAdmin: true,
};

/** Module-private: used only in ensureAdmin to seed the password hash */
const _ADMIN_PW = 'Bellona1313!MF';

// ============================================================
// HASH SIMPLE (MVP — no bcrypt)
// ============================================================

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + ch;
    hash |= 0; // 32-bit int
  }
  // Second pass for more entropy
  let hash2 = 5381;
  for (let i = 0; i < str.length; i++) {
    hash2 = ((hash2 << 5) + hash2) + str.charCodeAt(i);
    hash2 |= 0;
  }
  return 'h_' + Math.abs(hash).toString(36) + '_' + Math.abs(hash2).toString(36);
}

// ============================================================
// INIT — Pre-cargar admin si no existe
// ============================================================

function ensureAdmin() {
  const users = getUsers();
  const exists = users.find(u => u.email === ADMIN.email);
  if (!exists) {
    users.push({
      email: ADMIN.email,
      name: ADMIN.name,
      passwordHash: simpleHash(_ADMIN_PW),
      isAdmin: true,
      approved: true,
      createdAt: new Date().toISOString(),
    });
    _saveUsers(users);
  }
}

// Auto-init
ensureAdmin();

// ============================================================
// STORAGE HELPERS
// ============================================================

function _saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn('[Auth] Error guardando usuarios:', e);
  }
}

function _saveSession(session) {
  try {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch (e) {
    console.warn('[Auth] Error guardando sesion:', e);
  }
}

// ============================================================
// API PUBLICA
// ============================================================

/** Obtener todos los usuarios registrados */
export function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/** Obtener sesion activa (returns null if expired) */
export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);

    // Check expiry
    if (session.expiresAt && Date.now() > session.expiresAt) {
      // Session expired — clear it
      _saveSession(null);
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/** Login: valida credenciales y crea sesion */
export function login(email, password) {
  const users = getUsers();
  const normalEmail = email.trim().toLowerCase();
  const user = users.find(u => u.email.toLowerCase() === normalEmail);

  if (!user) {
    return { ok: false, error: 'Usuario no encontrado' };
  }

  if (user.passwordHash !== simpleHash(password)) {
    return { ok: false, error: 'Password incorrecto' };
  }

  if (!user.approved) {
    return { ok: false, error: 'Tu cuenta esta pendiente de aprobacion por el administrador.' };
  }

  const now = Date.now();
  const session = {
    email: user.email,
    name: user.name,
    isAdmin: !!user.isAdmin,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
  };
  _saveSession(session);
  return { ok: true, user: session };
}

/** Logout: borra sesion and theme override */
export function logout() {
  _saveSession(null);
  // Clear theme override so next user gets default
  try { localStorage.removeItem('marsfit.theme'); } catch { /* ignore */ }
}

/** Registro: crea usuario con approved=false */
export function register(email, password, name) {
  const users = getUsers();
  const normalEmail = email.trim().toLowerCase();

  if (users.find(u => u.email.toLowerCase() === normalEmail)) {
    return { ok: false, error: 'Ya existe una cuenta con este email' };
  }

  if (!email || !password || !name) {
    return { ok: false, error: 'Todos los campos son obligatorios' };
  }

  if (password.length < 6) {
    return { ok: false, error: 'El password debe tener al menos 6 caracteres' };
  }

  const newUser = {
    email: normalEmail,
    name: name.trim(),
    passwordHash: simpleHash(password),
    isAdmin: false,
    approved: false,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  _saveUsers(users);
  return { ok: true, user: newUser };
}

/**
 * Es admin el usuario logueado?
 * Cross-references session against users array for integrity.
 */
export function isAdmin() {
  const session = getSession();
  if (!session || !session.isAdmin) return false;

  // Integrity check: verify against users store
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === session.email.toLowerCase());
  return !!(user && user.isAdmin);
}

/** Hay sesion activa? */
export function isLoggedIn() {
  return !!getSession();
}

/** Admin aprueba un usuario */
export function approveUser(email) {
  if (!isAdmin()) return { ok: false, error: 'No autorizado' };
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return { ok: false, error: 'Usuario no encontrado' };
  user.approved = true;
  _saveUsers(users);
  return { ok: true };
}

/** Admin rechaza un usuario */
export function rejectUser(email) {
  if (!isAdmin()) return { ok: false, error: 'No autorizado' };
  const users = getUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) return { ok: false, error: 'Usuario no encontrado' };
  users.splice(idx, 1);
  _saveUsers(users);
  return { ok: true };
}

/** Obtener usuarios pendientes de aprobacion */
export function getPendingUsers() {
  return getUsers().filter(u => !u.approved);
}

/** Obtener todos los usuarios (solo admin) */
export function getAllUsers() {
  if (!isAdmin()) return [];
  return getUsers();
}

/** Admin elimina un usuario */
export function deleteUser(email) {
  if (!isAdmin()) return { ok: false, error: 'No autorizado' };
  const session = getSession();
  if (session && session.email.toLowerCase() === email.toLowerCase()) {
    return { ok: false, error: 'No puedes eliminar tu propia cuenta' };
  }
  const users = getUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) return { ok: false, error: 'Usuario no encontrado' };
  users.splice(idx, 1);
  _saveUsers(users);
  return { ok: true };
}
