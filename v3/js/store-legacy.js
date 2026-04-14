// Store persistente con localStorage. Estado central de la app.

const KEY = "marsfit_state_v1";

const defaultState = {
  onboarded: false,
  profile: {
    name: "",
    role: "civil",            // "civil" | "operativo"
    marsUnit: "",             // si role=operativo, ej: "Vivienda" | "Eventos" | "Aérea"
    sex: "m",
    age: 30,
    heightCm: 178,
    weightKg: 80,
    activity: 1.55,           // 1.2 / 1.375 / 1.55 / 1.725
    experience: "intermedio",
    equipment: "gym",
    goal: "volumen",          // volumen|definicion|mantenimiento|rendimiento|turnos_largos|estabilidad
    injuries: []
  },
  routineId: null,
  dietId: null,
  workouts: [],   // {date, routineId, dayIdx, sets: [{exId, setIdx, weight, reps, done}]}
  meals: [],      // {date, name, items, kcal, proteinG, carbsG, fatsG, photo, aiSource}
  bodyweight: [], // {date, kg}
  health: null,   // import Apple Health
  notifEnabled: false,
  circle: {
    name: "Mi escuadrón",
    code: "MARS-7A9X",
    members: [
      { id: "me", name: "Tú", initials: "YO" },
      { id: "marcos", name: "Marcos", initials: "MR" },
      { id: "laura", name: "Laura", initials: "LA" },
      { id: "david", name: "David", initials: "DV" }
    ],
    feed: [
      { who: "marcos", text: "+2.5 kg en press banca 🔥", kind: "fire", time: "hoy 10:12" },
      { who: "laura", text: "Dieta paleo · 100% adherencia semana", kind: "ok", time: "ayer 21:40" },
      { who: "david", text: "Sesión operativa completada · 52 min", kind: "fire", time: "ayer 07:30" }
    ]
  }
};

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(defaultState);
    return { ...structuredClone(defaultState), ...JSON.parse(raw) };
  } catch { return structuredClone(defaultState); }
}

export function getState() { return state; }
export function setState(partial) {
  state = { ...state, ...partial };
  save();
  emit();
}
export function updateProfile(patch) {
  state.profile = { ...state.profile, ...patch };
  save(); emit();
}
export function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
}
export function reset() {
  localStorage.removeItem(KEY);
  state = structuredClone(defaultState);
  emit();
}

// Minimal pub/sub
const subs = new Set();
export function subscribe(fn) { subs.add(fn); return () => subs.delete(fn); }
function emit() { subs.forEach(fn => fn(state)); }

// ---------- Métricas calculadas ----------
export function computeTDEE(profile) {
  const { sex, age, heightCm, weightKg, activity } = profile;
  // Mifflin-St Jeor
  const bmr = sex === "m"
    ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  const tdee = bmr * activity;
  return { bmr: Math.round(bmr), tdee: Math.round(tdee) };
}

export function computeMacros(profile, dietMacros) {
  const { tdee } = computeTDEE(profile);
  let kcal = tdee;
  switch (profile.goal) {
    case "volumen": kcal = tdee + 300; break;
    case "definicion": kcal = tdee - 400; break;
    case "rendimiento": kcal = tdee + 100; break;
    case "turnos_largos": kcal = tdee + 150; break;
    default: kcal = tdee;
  }
  const p = dietMacros?.p ?? 0.30;
  const c = dietMacros?.c ?? 0.40;
  const f = dietMacros?.f ?? 0.30;
  return {
    kcal: Math.round(kcal),
    proteinG: Math.round(kcal * p / 4),
    carbsG: Math.round(kcal * c / 4),
    fatsG: Math.round(kcal * f / 9)
  };
}

// Helpers de fecha
export function today() { return new Date().toISOString().slice(0,10); }
