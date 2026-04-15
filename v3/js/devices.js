/**
 * MARS FIT v3 — Integracion con dispositivos fitness
 *
 * ⚠️ AVISO RENPHO: La API de RENPHO es no oficial (reverse-engineered).
 * Las credenciales (email + session token) se almacenan en localStorage
 * en texto plano. No usar en entornos compartidos.
 *
 * Apple Watch / HealthKit  → via Apple Health export XML o Web Bluetooth (HR)
 * Oura Ring 4              → via Oura Cloud API v2 (OAuth2 + REST)
 * RENPHO Smart Scale       → via RENPHO API (no oficial) o import CSV
 *
 * Cada integracion expone: connect(), sync(), getLatestData(), disconnect()
 */

// ============================================================
// CONFIG KEYS (localStorage)
// ============================================================
const KEYS = {
  oura: 'marsfit.oura.token',
  renpho: 'marsfit.renpho.credentials',
  applehealth: 'marsfit.applehealth.lastImport',
};

// ============================================================
// 1. APPLE WATCH / HEALTHKIT
// ============================================================
// Apple Watch sincroniza datos al iPhone via HealthKit.
// Desde la PWA accedemos de 3 formas:
//   A) Import del export.xml/zip (ya implementado en applehealth.js)
//   B) Web Bluetooth para leer HR en tiempo real (Apple Watch + Chrome)
//   C) Siri Shortcut que pushea datos via webhook
// ============================================================

export const AppleWatch = {
  name: 'Apple Watch',
  icon: 'heart-pulse',
  color: '#FF2D6B',

  isConfigured() {
    return !!localStorage.getItem(KEYS.applehealth);
  },

  // Import via export.xml (delegamos al modulo existente)
  async importHealthExport(file) {
    const { importHealthExport } = await import('../../js/applehealth.js');
    const result = await importHealthExport(file);
    localStorage.setItem(KEYS.applehealth, new Date().toISOString());
    return result;
  },

  // Web Bluetooth: leer HR en tiempo real del Apple Watch / cualquier HR monitor BLE
  async connectBluetooth() {
    // Safari / iOS do not support Web Bluetooth
    const ua = navigator.userAgent || '';
    const isSafariOnly = /Safari/.test(ua) && !/Chrome/.test(ua);
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    if (isIOS || isSafariOnly) {
      throw new Error('Web Bluetooth no esta soportado en Safari/iOS. Usa el metodo de exportacion XML desde Salud.');
    }
    if (!navigator.bluetooth) throw new Error('Web Bluetooth no disponible en este navegador');

    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: ['heart_rate'] }],
      optionalServices: ['heart_rate']
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService('heart_rate');
    const char = await service.getCharacteristic('heart_rate_measurement');

    // Retorna un objeto con subscribe/unsubscribe
    return {
      deviceName: device.name || 'HR Monitor',
      subscribe(callback) {
        char.addEventListener('characteristicvaluechanged', (event) => {
          const value = event.target.value;
          const flags = value.getUint8(0);
          const is16bit = flags & 0x01;
          const bpm = is16bit ? value.getUint16(1, true) : value.getUint8(1);
          callback({ bpm, timestamp: Date.now() });
        });
        char.startNotifications();
      },
      async disconnect() {
        await char.stopNotifications();
        device.gatt.disconnect();
      }
    };
  },

  getLastImport() {
    const d = localStorage.getItem(KEYS.applehealth);
    return d ? new Date(d).toLocaleString('es-ES') : null;
  }
};


// ============================================================
// 2. OURA RING 4 — Oura Cloud API v2
// ============================================================
// Documentacion: https://cloud.ouraring.com/v2/docs
// Auth: OAuth2 Personal Access Token (o OAuth2 flow completo)
// Endpoints: daily_activity, daily_sleep, daily_readiness, heartrate
// ============================================================

const OURA_BASE = 'https://api.ouraring.com/v2/usercollection';

export const OuraRing = {
  name: 'Oura Ring 4',
  icon: 'target',
  color: '#B44AFF',

  isConfigured() {
    return !!localStorage.getItem(KEYS.oura);
  },

  setToken(token) {
    localStorage.setItem(KEYS.oura, token);
  },

  getToken() {
    return localStorage.getItem(KEYS.oura);
  },

  removeToken() {
    localStorage.removeItem(KEYS.oura);
  },

  async _fetch(endpoint, params = {}) {
    const token = this.getToken();
    if (!token) throw new Error('Token de Oura no configurado. Ve a Perfil → Integraciones.');

    const url = new URL(`${OURA_BASE}/${endpoint}`);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

    const res = await fetch(url.toString(), {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.status === 401) {
      this.removeToken();
      throw new Error('Token de Oura expirado. Reconfigura en Perfil.');
    }
    if (!res.ok) throw new Error(`Oura API error: ${res.status}`);
    return res.json();
  },

  // Actividad diaria (pasos, calorias activas, distancia)
  async getDailyActivity(startDate, endDate) {
    const data = await this._fetch('daily_activity', {
      start_date: startDate,
      end_date: endDate || startDate
    });
    return (data.data || []).map(d => ({
      date: d.day,
      steps: d.steps,
      activeKcal: d.active_calories,
      totalKcal: d.total_calories,
      distance: d.equivalent_walking_distance,
      score: d.score
    }));
  },

  // Sueno diario
  async getDailySleep(startDate, endDate) {
    const data = await this._fetch('daily_sleep', {
      start_date: startDate,
      end_date: endDate || startDate
    });
    return (data.data || []).map(d => ({
      date: d.day,
      score: d.score,
      totalSleep: d.contributors?.total_sleep,
      efficiency: d.contributors?.efficiency,
      restfulness: d.contributors?.restfulness,
      remSleep: d.contributors?.rem_sleep,
      deepSleep: d.contributors?.deep_sleep,
      latency: d.contributors?.latency
    }));
  },

  // Readiness diario (recuperacion)
  async getDailyReadiness(startDate, endDate) {
    const data = await this._fetch('daily_readiness', {
      start_date: startDate,
      end_date: endDate || startDate
    });
    return (data.data || []).map(d => ({
      date: d.day,
      score: d.score,
      hrv: d.contributors?.hrv_balance,
      bodyTemp: d.contributors?.body_temperature,
      restingHR: d.contributors?.resting_heart_rate,
      recovery: d.contributors?.recovery_index
    }));
  },

  // Heart rate (intervalos de 5min)
  async getHeartRate(startDate, endDate) {
    const data = await this._fetch('heartrate', {
      start_datetime: `${startDate}T00:00:00+00:00`,
      end_datetime: `${endDate || startDate}T23:59:59+00:00`
    });
    return (data.data || []).map(d => ({
      timestamp: d.timestamp,
      bpm: d.bpm,
      source: d.source // 'awake' | 'rest' | 'sleep' | 'workout'
    }));
  },

  // Sync completo: trae ultimos 7 dias de todo
  async syncAll() {
    const end = new Date().toISOString().slice(0, 10);
    const start = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);

    const [activity, sleep, readiness, hr] = await Promise.allSettled([
      this.getDailyActivity(start, end),
      this.getDailySleep(start, end),
      this.getDailyReadiness(start, end),
      this.getHeartRate(start, end)
    ]);

    return {
      activity: activity.status === 'fulfilled' ? activity.value : [],
      sleep: sleep.status === 'fulfilled' ? sleep.value : [],
      readiness: readiness.status === 'fulfilled' ? readiness.value : [],
      heartRate: hr.status === 'fulfilled' ? hr.value : [],
      syncedAt: new Date().toISOString()
    };
  }
};


// ============================================================
// 3. RENPHO SMART SCALE
// ============================================================
// RENPHO no tiene API publica oficial. Dos estrategias:
//   A) Import CSV: la app RENPHO permite exportar datos como CSV
//   B) API no oficial: reverse-engineered de la app RENPHO
//      Base URL: https://renpho.qnclouds.com/api/
//      Auth: email + password → session token
// ============================================================

const RENPHO_BASE = 'https://renpho.qnclouds.com/api';

export const RenphoScale = {
  name: 'RENPHO Smart Scale',
  icon: 'scale',
  color: '#00E676',

  isConfigured() {
    const creds = localStorage.getItem(KEYS.renpho);
    return !!creds;
  },

  setCredentials(email, sessionToken) {
    localStorage.setItem(KEYS.renpho, JSON.stringify({ email, token: sessionToken }));
  },

  getCredentials() {
    try { return JSON.parse(localStorage.getItem(KEYS.renpho)); }
    catch { return null; }
  },

  removeCredentials() {
    localStorage.removeItem(KEYS.renpho);
  },

  // Login con email + password de la app RENPHO
  async login(email, password) {
    const res = await fetch(`${RENPHO_BASE}/v3/users/sign_in.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secure_flag: 1,
        email,
        password,
        terminal_type: 2 // 2 = Android
      })
    });

    if (!res.ok) throw new Error('Login RENPHO fallido. Verifica email y password.');
    const data = await res.json();
    if (data.status_code !== '20000') throw new Error(data.status_message || 'Error RENPHO');

    const token = data.terminal_user_session_key;
    this.setCredentials(email, token);
    return { email, token };
  },

  // Obtener ultimas mediciones
  async getLatestMeasurements(limit = 30) {
    const creds = this.getCredentials();
    if (!creds?.token) throw new Error('No hay sesion RENPHO. Inicia sesion en Perfil.');

    const res = await fetch(`${RENPHO_BASE}/v2/measurements/list.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        terminal_user_session_key: creds.token,
        page_num: 1,
        page_size: limit,
        locale: 'es'
      })
    });

    if (!res.ok) throw new Error('Error obteniendo datos RENPHO');
    const data = await res.json();
    if (data.status_code !== '20000') {
      this.removeCredentials();
      throw new Error('Sesion RENPHO expirada. Vuelve a iniciar sesion.');
    }

    return (data.last_ary || []).map(m => ({
      date: new Date(m.time_stamp * 1000).toISOString().slice(0, 10),
      timestamp: m.time_stamp * 1000,
      weight: m.weight,                 // kg
      bmi: m.bmi,
      bodyFat: m.bodyfat,              // %
      muscleMass: m.muscle,            // kg
      boneMass: m.bone,                // kg
      waterPercentage: m.water,        // %
      visceralFat: m.vfal,
      bmr: m.bmr,                      // kcal
      metabolicAge: m.bodyage,
      protein: m.protein,              // %
      subcutaneousFat: m.subfat        // %
    }));
  },

  // Import CSV de la app RENPHO (exportado manualmente)
  async importCSV(file) {
    const text = await file.text();
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length < 2) throw new Error('CSV vacio o sin datos');

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const weightIdx = headers.findIndex(h => h.includes('weight') || h.includes('peso'));
    const dateIdx = headers.findIndex(h => h.includes('date') || h.includes('fecha') || h.includes('time'));
    const fatIdx = headers.findIndex(h => h.includes('body fat') || h.includes('grasa'));
    const muscleIdx = headers.findIndex(h => h.includes('muscle') || h.includes('musculo'));
    const bmiIdx = headers.findIndex(h => h.includes('bmi') || h.includes('imc'));

    const records = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim());
      if (!cols[weightIdx]) continue;

      records.push({
        date: cols[dateIdx] ? new Date(cols[dateIdx]).toISOString().slice(0, 10) : null,
        weight: parseFloat(cols[weightIdx]) || null,
        bodyFat: fatIdx >= 0 ? parseFloat(cols[fatIdx]) || null : null,
        muscleMass: muscleIdx >= 0 ? parseFloat(cols[muscleIdx]) || null : null,
        bmi: bmiIdx >= 0 ? parseFloat(cols[bmiIdx]) || null : null,
      });
    }

    return { records: records.filter(r => r.weight && r.date), total: records.length };
  },

  // Sync: trae las ultimas 30 mediciones
  async sync() {
    return this.getLatestMeasurements(30);
  }
};


// ============================================================
// HELPER: Lista de todos los dispositivos
// ============================================================

export const DEVICES = [
  { key: 'applewatch', ...AppleWatch },
  { key: 'oura', ...OuraRing },
  { key: 'renpho', ...RenphoScale }
];

export function getConfiguredDevices() {
  return DEVICES.filter(d => d.isConfigured());
}

export function getDeviceByKey(key) {
  return DEVICES.find(d => d.key === key);
}
