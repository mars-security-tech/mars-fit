/**
 * MARS FIT v3 — Estado central reactivo
 *
 * Arquitectura dual de persistencia:
 * - localStorage: config rapida (profile, theme, apiKeys) — acceso sincrono
 * - IndexedDB: datos grandes (workouts, meals, exercises custom) — async
 *
 * Patron pub/sub reactivo con soporte para:
 * - Subscripciones por clave (solo recibir cambios de 'profile', 'theme', etc.)
 * - Computed properties (TDEE, macros, wellness score)
 * - Migracion desde v1
 * - Sync queue para offline (se encola y se sube cuando hay red)
 */

// ============================================================
// CONSTANTES
// ============================================================

const LS_KEY = 'marsfit_v3_config';
const LS_KEY_V1 = 'marsfit_state_v1';
const IDB_NAME = 'marsfit_v3';
const IDB_VERSION = 1;

/** Stores en IndexedDB */
const IDB_STORES = {
  workouts: 'workouts',       // {id, date, routineId, dayIdx, sets[], duration, notes, synced}
  meals: 'meals',             // {id, date, mealName, items[], kcal, proteinG, carbsG, fatsG, photo, aiSource, synced}
  bodyweight: 'bodyweight',   // {id, date, kg, synced}
  exercises: 'exercises',     // {id, ...} ejercicios custom del usuario
  routines: 'routines',       // {id, ...} rutinas custom
  diets: 'diets',             // {id, ...} dietas custom
  health: 'health',           // {id, date, type, value, source}
  syncQueue: 'syncQueue',     // {id, table, action, payload, createdAt}
};

// ============================================================
// ESTADO POR DEFECTO (localStorage — config rapida)
// ============================================================

const defaultConfig = {
  onboarded: false,
  schemaVersion: 3,

  profile: {
    name: '',
    sex: 'm',
    age: 30,
    heightCm: 178,
    weightKg: 80,
    activity: 1.55,             // 1.2 / 1.375 / 1.55 / 1.725 / 1.9
    experience: 'intermedio',   // principiante | intermedio | avanzado
    equipment: 'gym',           // gym | casa | mixto
    goal: 'volumen',            // volumen | definicion | mantenimiento | rendimiento | turnos_largos | estabilidad
    injuries: [],
    avatar: null,               // URL o null (se usan iniciales)
  },

  routineId: null,
  dietId: null,

  theme: 'dark',                // 'dark' | 'light'

  apiKeys: {
    supabaseUrl: '',
    supabaseAnon: '',
    claudeApiKey: '',           // para reconocimiento de comidas
    videoApiKey: '',            // para generacion de videos IA
  },

  circle: {
    name: 'Mi team',
    code: 'MARS-7A9X',
    members: [
      { id: 'me', name: 'Tu', initials: 'YO' },
      { id: 'marcos', name: 'Marcos', initials: 'MR' },
      { id: 'laura', name: 'Laura', initials: 'LA' },
      { id: 'david', name: 'David', initials: 'DV' },
    ],
    feed: [
      { who: 'marcos', text: '+2.5 kg en press banca', kind: 'fire', time: 'hoy 10:12' },
      { who: 'laura', text: 'Dieta paleo - 100% adherencia semana', kind: 'ok', time: 'ayer 21:40' },
      { who: 'david', text: 'Sesion operativa completada - 52 min', kind: 'fire', time: 'ayer 07:30' },
    ],
  },

  notifEnabled: false,
  coachMessages: [],            // mensajes del coach IA
};

// ============================================================
// INDEXEDDB
// ============================================================

let _db = null;

/**
 * Abre (o crea) la base de datos IndexedDB.
 * @returns {Promise<IDBDatabase>}
 */
function openDB() {
  if (_db) return Promise.resolve(_db);

  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = e.target.result;

      // workouts: indexado por fecha
      if (!db.objectStoreNames.contains(IDB_STORES.workouts)) {
        const ws = db.createObjectStore(IDB_STORES.workouts, { keyPath: 'id' });
        ws.createIndex('by_date', 'date', { unique: false });
        ws.createIndex('by_synced', 'synced', { unique: false });
      }

      // meals: indexado por fecha
      if (!db.objectStoreNames.contains(IDB_STORES.meals)) {
        const ms = db.createObjectStore(IDB_STORES.meals, { keyPath: 'id' });
        ms.createIndex('by_date', 'date', { unique: false });
        ms.createIndex('by_synced', 'synced', { unique: false });
      }

      // bodyweight
      if (!db.objectStoreNames.contains(IDB_STORES.bodyweight)) {
        const bw = db.createObjectStore(IDB_STORES.bodyweight, { keyPath: 'id' });
        bw.createIndex('by_date', 'date', { unique: false });
      }

      // ejercicios custom del usuario
      if (!db.objectStoreNames.contains(IDB_STORES.exercises)) {
        db.createObjectStore(IDB_STORES.exercises, { keyPath: 'id' });
      }

      // rutinas custom
      if (!db.objectStoreNames.contains(IDB_STORES.routines)) {
        db.createObjectStore(IDB_STORES.routines, { keyPath: 'id' });
      }

      // dietas custom
      if (!db.objectStoreNames.contains(IDB_STORES.diets)) {
        db.createObjectStore(IDB_STORES.diets, { keyPath: 'id' });
      }

      // datos de salud (Apple Health import)
      if (!db.objectStoreNames.contains(IDB_STORES.health)) {
        const hs = db.createObjectStore(IDB_STORES.health, { keyPath: 'id' });
        hs.createIndex('by_date', 'date', { unique: false });
        hs.createIndex('by_type', 'type', { unique: false });
      }

      // cola de sincronizacion offline
      if (!db.objectStoreNames.contains(IDB_STORES.syncQueue)) {
        const sq = db.createObjectStore(IDB_STORES.syncQueue, { keyPath: 'id', autoIncrement: true });
        sq.createIndex('by_table', 'table', { unique: false });
      }
    };

    req.onsuccess = (e) => {
      _db = e.target.result;
      resolve(_db);
    };

    req.onerror = (e) => {
      console.error('[Store] Error abriendo IndexedDB:', e.target.error);
      reject(e.target.error);
    };
  });
}

// ---- Helpers genericos para IndexedDB ----

/**
 * Ejecuta una transaccion sobre un object store.
 * @param {string} storeName
 * @param {'readonly'|'readwrite'} mode
 * @param {function(IDBObjectStore): IDBRequest|void} callback
 * @returns {Promise<any>}
 */
async function idbTransaction(storeName, mode, callback) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);

    let result;
    try {
      result = callback(store);
    } catch (err) {
      reject(err);
      return;
    }

    if (result && typeof result.onsuccess !== 'undefined') {
      result.onsuccess = () => resolve(result.result);
      result.onerror = () => reject(result.error);
    } else {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    }
  });
}

/** Guardar un registro */
async function idbPut(storeName, record) {
  return idbTransaction(storeName, 'readwrite', (store) => store.put(record));
}

/** Obtener por clave primaria */
async function idbGet(storeName, key) {
  return idbTransaction(storeName, 'readonly', (store) => store.get(key));
}

/** Obtener todos los registros de un store */
async function idbGetAll(storeName) {
  return idbTransaction(storeName, 'readonly', (store) => store.getAll());
}

/** Eliminar un registro */
async function idbDelete(storeName, key) {
  return idbTransaction(storeName, 'readwrite', (store) => store.delete(key));
}

/** Obtener registros por indice dentro de un rango */
async function idbGetByIndex(storeName, indexName, query) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const index = store.index(indexName);
    const req = index.getAll(query);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// ============================================================
// LOCALSTORAGE — CONFIG RAPIDA
// ============================================================

function loadConfig() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return structuredClone(defaultConfig);
    const saved = JSON.parse(raw);
    // Deep merge para no perder keys nuevas
    return deepMerge(structuredClone(defaultConfig), saved);
  } catch {
    return structuredClone(defaultConfig);
  }
}

function saveConfig(config) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn('[Store] Error guardando config:', e);
  }
}

/** Deep merge: el segundo objeto sobrescribe valores del primero */
function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// ============================================================
// MIGRACION DESDE V1
// ============================================================

async function migrateFromV1() {
  const raw = localStorage.getItem(LS_KEY_V1);
  if (!raw) return false;

  try {
    const v1 = JSON.parse(raw);
    console.log('[Store] Migrando datos de v1...');

    // Migrar config/profile
    const config = structuredClone(defaultConfig);
    config.onboarded = v1.onboarded || false;
    config.schemaVersion = 3;

    if (v1.profile) {
      config.profile = { ...config.profile, ...v1.profile };
    }
    config.routineId = v1.routineId || null;
    config.dietId = v1.dietId || null;
    config.notifEnabled = v1.notifEnabled || false;

    if (v1.circle) {
      config.circle = { ...config.circle, ...v1.circle };
    }

    saveConfig(config);

    // Migrar workouts a IndexedDB
    if (Array.isArray(v1.workouts)) {
      for (const w of v1.workouts) {
        await idbPut(IDB_STORES.workouts, {
          id: w.id || crypto.randomUUID(),
          date: w.date,
          routineId: w.routineId || null,
          dayIdx: w.dayIdx ?? 0,
          sets: w.sets || [],
          duration: w.duration || null,
          notes: w.notes || '',
          synced: false,
        });
      }
    }

    // Migrar meals
    if (Array.isArray(v1.meals)) {
      for (const m of v1.meals) {
        await idbPut(IDB_STORES.meals, {
          id: m.id || crypto.randomUUID(),
          date: m.date,
          mealName: m.name || m.mealName || '',
          items: m.items || [],
          kcal: m.kcal || 0,
          proteinG: m.proteinG || 0,
          carbsG: m.carbsG || 0,
          fatsG: m.fatsG || 0,
          photo: m.photo || null,
          aiSource: m.aiSource || null,
          synced: false,
        });
      }
    }

    // Migrar bodyweight
    if (Array.isArray(v1.bodyweight)) {
      for (const b of v1.bodyweight) {
        await idbPut(IDB_STORES.bodyweight, {
          id: b.id || crypto.randomUUID(),
          date: b.date,
          kg: b.kg,
          synced: false,
        });
      }
    }

    console.log('[Store] Migracion v1 completada.');
    return true;
  } catch (e) {
    console.error('[Store] Error en migracion v1:', e);
    return false;
  }
}

// ============================================================
// STORE REACTIVO
// ============================================================

let _config = loadConfig();

/** Subscriptores: Map<string|'*', Set<Function>> */
const _subs = new Map();

/**
 * Subscribirse a cambios del store.
 * @param {function(object)} fn - Callback con el config completo
 * @param {string} [key='*'] - Clave especifica ('profile', 'theme', etc.) o '*' para todo
 * @returns {function} unsubscribe
 */
export function subscribe(fn, key = '*') {
  if (!_subs.has(key)) _subs.set(key, new Set());
  _subs.get(key).add(fn);
  return () => _subs.get(key)?.delete(fn);
}

/** Emitir cambio a todos los subscriptores relevantes */
function emit(changedKeys = []) {
  // Notificar wildcard
  const wildcardSubs = _subs.get('*');
  if (wildcardSubs) wildcardSubs.forEach(fn => { try { fn(_config); } catch (e) { console.error(e); } });

  // Notificar por clave
  for (const key of changedKeys) {
    const keySubs = _subs.get(key);
    if (keySubs) keySubs.forEach(fn => { try { fn(_config); } catch (e) { console.error(e); } });
  }
}

// ---- API publica de config ----

/** Obtener config completo (sincrono) */
export function getConfig() {
  return _config;
}

/** Actualizar config (deep merge parcial) */
export function setConfig(partial) {
  const changedKeys = Object.keys(partial);
  _config = deepMerge(structuredClone(_config), partial);
  saveConfig(_config);
  emit(changedKeys);
}

/** Actualizar profile (merge parcial) */
export function updateProfile(patch) {
  _config.profile = { ..._config.profile, ...patch };
  saveConfig(_config);
  emit(['profile']);
}

/** Resetear todo el store */
export async function resetAll() {
  localStorage.removeItem(LS_KEY);
  _config = structuredClone(defaultConfig);

  // Borrar IndexedDB — await each transaction completion
  const db = await openDB();
  const clearPromises = [];
  for (const storeName of Object.values(IDB_STORES)) {
    clearPromises.push(new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        tx.objectStore(storeName).clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      } catch (e) {
        // store may not exist
        resolve();
      }
    }));
  }
  await Promise.all(clearPromises);

  emit(['*']);
}

// ============================================================
// API DE DATOS (IndexedDB) — Workouts
// ============================================================

/** Generar ID unico */
function uid() {
  return crypto.randomUUID();
}

/** Fecha de hoy como string YYYY-MM-DD */
export function today() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Guardar un workout.
 * @param {object} workout - {date, routineId, dayIdx, sets, duration, notes}
 * @returns {Promise<object>} workout con id
 */
export async function saveWorkout(workout) {
  const record = {
    id: workout.id || uid(),
    date: workout.date || today(),
    routineId: workout.routineId || _config.routineId,
    dayIdx: workout.dayIdx ?? 0,
    sets: workout.sets || [],
    duration: workout.duration || null,
    notes: workout.notes || '',
    synced: false,
    createdAt: new Date().toISOString(),
  };
  await idbPut(IDB_STORES.workouts, record);
  await enqueueSyncAction('workouts', 'upsert', record);
  emit(['workouts']);
  return record;
}

/** Obtener workouts en un rango de fechas */
export async function getWorkoutsInRange(from, to) {
  const range = IDBKeyRange.bound(from, to);
  return idbGetByIndex(IDB_STORES.workouts, 'by_date', range);
}

/** Obtener workouts de hoy */
export async function getWorkoutsToday() {
  const d = today();
  return idbGetByIndex(IDB_STORES.workouts, 'by_date', IDBKeyRange.only(d));
}

/** Obtener todos los workouts */
export async function getAllWorkouts() {
  return idbGetAll(IDB_STORES.workouts);
}

/** Eliminar workout por id */
export async function deleteWorkout(id) {
  await idbDelete(IDB_STORES.workouts, id);
  await enqueueSyncAction('workouts', 'delete', { id });
  emit(['workouts']);
}

// ============================================================
// API DE DATOS — Meals (comidas)
// ============================================================

/**
 * Guardar una comida.
 * @param {object} meal - {date, mealName, items, kcal, proteinG, carbsG, fatsG, photo, aiSource}
 * @returns {Promise<object>}
 */
export async function saveMeal(meal) {
  const record = {
    id: meal.id || uid(),
    date: meal.date || today(),
    mealName: meal.mealName || '',
    items: meal.items || [],
    kcal: meal.kcal || 0,
    proteinG: meal.proteinG || 0,
    carbsG: meal.carbsG || 0,
    fatsG: meal.fatsG || 0,
    photo: meal.photo || null,
    aiSource: meal.aiSource || null,
    synced: false,
    createdAt: new Date().toISOString(),
  };
  await idbPut(IDB_STORES.meals, record);
  await enqueueSyncAction('meals', 'upsert', record);
  emit(['meals']);
  return record;
}

/** Obtener comidas de hoy */
export async function getMealsToday() {
  const d = today();
  return idbGetByIndex(IDB_STORES.meals, 'by_date', IDBKeyRange.only(d));
}

/** Obtener comidas en rango */
export async function getMealsInRange(from, to) {
  const range = IDBKeyRange.bound(from, to);
  return idbGetByIndex(IDB_STORES.meals, 'by_date', range);
}

/** Eliminar comida */
export async function deleteMeal(id) {
  await idbDelete(IDB_STORES.meals, id);
  await enqueueSyncAction('meals', 'delete', { id });
  emit(['meals']);
}

// ============================================================
// API DE DATOS — Bodyweight
// ============================================================

export async function saveWeight(date, kg) {
  const record = {
    id: uid(),
    date: date || today(),
    kg,
    synced: false,
  };
  await idbPut(IDB_STORES.bodyweight, record);
  await enqueueSyncAction('bodyweight', 'upsert', record);
  emit(['bodyweight']);
  return record;
}

export async function getWeightHistory(limit = 90) {
  const all = await idbGetAll(IDB_STORES.bodyweight);
  // Ordenar por fecha descendente y limitar
  return all
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

// ============================================================
// API DE DATOS — Health (Apple Health import)
// ============================================================

export async function saveHealthData(entries) {
  for (const entry of entries) {
    await idbPut(IDB_STORES.health, {
      id: entry.id || uid(),
      date: entry.date,
      type: entry.type,      // 'steps' | 'heartRate' | 'sleep' | 'activeEnergy' | 'restingHR'
      value: entry.value,
      unit: entry.unit || '',
      source: entry.source || 'apple_health',
    });
  }
  emit(['health']);
}

export async function getHealthByType(type, from, to) {
  const all = await idbGetByIndex(IDB_STORES.health, 'by_type', IDBKeyRange.only(type));
  if (!from && !to) return all;
  return all.filter(h => (!from || h.date >= from) && (!to || h.date <= to));
}

// ============================================================
// API DE DATOS — Ejercicios, rutinas y dietas custom
// ============================================================

export async function saveCustomExercise(exercise) {
  await idbPut(IDB_STORES.exercises, { ...exercise, id: exercise.id || uid() });
  emit(['exercises']);
}

export async function getCustomExercises() {
  return idbGetAll(IDB_STORES.exercises);
}

export async function deleteCustomExercise(id) {
  await idbDelete(IDB_STORES.exercises, id);
  emit(['exercises']);
}

export async function saveCustomRoutine(routine) {
  await idbPut(IDB_STORES.routines, { ...routine, id: routine.id || uid() });
  emit(['routines']);
}

export async function getCustomRoutines() {
  return idbGetAll(IDB_STORES.routines);
}

export async function deleteCustomRoutine(id) {
  await idbDelete(IDB_STORES.routines, id);
  emit(['routines']);
}

export async function saveCustomDiet(diet) {
  await idbPut(IDB_STORES.diets, { ...diet, id: diet.id || uid() });
  emit(['diets']);
}

export async function getCustomDiets() {
  return idbGetAll(IDB_STORES.diets);
}

export async function deleteCustomDiet(id) {
  await idbDelete(IDB_STORES.diets, id);
  emit(['diets']);
}

// ============================================================
// SYNC QUEUE — Cola de sincronizacion offline
// ============================================================

async function enqueueSyncAction(table, action, payload) {
  await idbPut(IDB_STORES.syncQueue, {
    id: uid(),
    table,
    action,
    payload,
    createdAt: new Date().toISOString(),
  });
}

/** Obtener acciones pendientes de sync */
export async function getSyncQueue() {
  return idbGetAll(IDB_STORES.syncQueue);
}

/** Marcar una accion como sincronizada (eliminar de la cola) */
export async function clearSyncItem(id) {
  await idbDelete(IDB_STORES.syncQueue, id);
}

/** Limpiar toda la cola de sync */
export async function clearSyncQueue() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORES.syncQueue, 'readwrite');
    tx.objectStore(IDB_STORES.syncQueue).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// ============================================================
// COMPUTED PROPERTIES — Metricas calculadas
// ============================================================

/**
 * Calcula BMR y TDEE usando Mifflin-St Jeor.
 * @param {object} [profile] - usa el profile del config si no se pasa
 * @returns {{bmr: number, tdee: number}}
 */
export function computeTDEE(profile) {
  const p = profile || _config.profile;
  const { sex, age, heightCm, weightKg, activity } = p;
  const bmr = sex === 'm'
    ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  const tdee = bmr * (activity || 1.55);
  return { bmr: Math.round(bmr), tdee: Math.round(tdee) };
}

/**
 * Calcula macros objetivo segun goal + plan de dieta.
 * @param {object} [dietMacros] - {p, c, f} proporciones (0-1)
 * @param {object} [profile]
 * @returns {{kcal: number, proteinG: number, carbsG: number, fatsG: number}}
 */
export function computeMacros(dietMacros, profile) {
  const p = profile || _config.profile;
  const { tdee } = computeTDEE(p);

  let kcal = tdee;
  switch (p.goal) {
    case 'volumen':       kcal = tdee + 300; break;
    case 'definicion':    kcal = tdee - 400; break;
    case 'rendimiento':   kcal = tdee + 100; break;
    case 'turnos_largos': kcal = tdee + 150; break;
    case 'estabilidad':   kcal = tdee;       break;
    default:              kcal = tdee;
  }

  const pRatio = dietMacros?.p ?? 0.30;
  const cRatio = dietMacros?.c ?? 0.40;
  const fRatio = dietMacros?.f ?? 0.30;

  return {
    kcal: Math.round(kcal),
    proteinG: Math.round((kcal * pRatio) / 4),
    carbsG: Math.round((kcal * cRatio) / 4),
    fatsG: Math.round((kcal * fRatio) / 9),
  };
}

/**
 * Calcula el Wellness Score (0-100) basado en multiples factores.
 * - Adherencia a entrenamiento (30%)
 * - Adherencia a nutricion (25%)
 * - Consistencia de peso (15%)
 * - Racha activa (20%)
 * - Datos de salud (10%)
 */
export async function computeWellnessScore() {
  const scores = { training: 0, nutrition: 0, weight: 0, streak: 0, health: 0 };

  // Ultimos 7 dias
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const from = weekAgo.toISOString().slice(0, 10);
  const to = today();

  // Training: dias entrenados / dias planeados
  const workouts = await getWorkoutsInRange(from, to);
  const uniqueDays = new Set(workouts.map(w => w.date));
  scores.training = Math.min(uniqueDays.size / 4, 1); // 4 dias / semana = 100%

  // Nutrition: dias con comidas registradas
  const meals = await getMealsInRange(from, to);
  const mealDays = new Set(meals.map(m => m.date));
  scores.nutrition = Math.min(mealDays.size / 7, 1);

  // Weight: consistencia (hay registro reciente?)
  const weights = await getWeightHistory(7);
  scores.weight = weights.length > 0 ? Math.min(weights.length / 3, 1) : 0;

  // Streak: dias consecutivos con actividad
  const streak = await computeStreak();
  scores.streak = Math.min(streak / 14, 1); // 14 dias = 100%

  // Health: tiene datos de Apple Health recientes?
  try {
    const steps = await getHealthByType('steps', from, to);
    scores.health = steps.length > 0 ? Math.min(steps.length / 7, 1) : 0.3; // base si no tiene
  } catch {
    scores.health = 0.3;
  }

  const total = Math.round(
    scores.training * 30 +
    scores.nutrition * 25 +
    scores.weight * 15 +
    scores.streak * 20 +
    scores.health * 10
  );

  return { total: Math.min(total, 100), breakdown: scores };
}

/**
 * Calcula la racha actual (dias consecutivos con workout o meal).
 * @returns {Promise<number>}
 */
export async function computeStreak() {
  const allWorkouts = await getAllWorkouts();
  const allMeals = await idbGetAll(IDB_STORES.meals);

  // Unir todos los dias con actividad
  const activeDays = new Set([
    ...allWorkouts.map(w => w.date),
    ...allMeals.map(m => m.date),
  ]);

  // Contar hacia atras desde hoy
  let streak = 0;
  const d = new Date();
  while (true) {
    const dateStr = d.toISOString().slice(0, 10);
    if (activeDays.has(dateStr)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

/**
 * Resumen rapido para el dashboard.
 * @returns {Promise<object>}
 */
export async function getDashboardSummary() {
  const d = today();
  const [workoutsToday, mealsToday, weightHist, streak] = await Promise.all([
    getWorkoutsToday(),
    getMealsToday(),
    getWeightHistory(30),
    computeStreak(),
  ]);

  // Macros consumidas hoy
  const consumed = mealsToday.reduce(
    (acc, m) => ({
      kcal: acc.kcal + (m.kcal || 0),
      proteinG: acc.proteinG + (m.proteinG || 0),
      carbsG: acc.carbsG + (m.carbsG || 0),
      fatsG: acc.fatsG + (m.fatsG || 0),
    }),
    { kcal: 0, proteinG: 0, carbsG: 0, fatsG: 0 }
  );

  return {
    workoutsToday,
    mealsToday,
    consumed,
    currentWeight: weightHist[0]?.kg ?? _config.profile.weightKg,
    weightTrend: weightHist.slice(0, 7),
    streak,
    date: d,
  };
}

// ============================================================
// INICIALIZACION
// ============================================================

/**
 * Inicializar el store: abrir IndexedDB, migrar si es necesario.
 * Llamar desde app-v3.js al arrancar.
 * @returns {Promise<object>} config actual
 */
export async function initStore() {
  await openDB();

  // Migrar desde v1 si existe y no se ha migrado
  if (!_config.onboarded || _config.schemaVersion !== 3) {
    const migrated = await migrateFromV1();
    if (migrated) {
      _config = loadConfig(); // Recargar tras migracion
    }
  }

  console.log('[Store] Inicializado. onboarded:', _config.onboarded);
  return _config;
}

// ============================================================
// ALIAS RETROCOMPATIBLES
// ============================================================

/** Alias para getConfig (compatibilidad con v1 que usaba getState) */
export const getState = getConfig;
/** Alias para setConfig */
export const setState = setConfig;
