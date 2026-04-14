// Cliente Supabase con fallback a localStorage.
// Si no hay URL/anon key configurada, la app funciona 100% offline.
// Para activar: window.__MARSFIT_SUPABASE = { url: "...", anonKey: "..." }
// o definir en localStorage: marsfit.supabase.url / marsfit.supabase.anonKey

import { getState, setState, save } from "./store.js";

const CFG_KEY = "marsfit.backend.cfg";

export function backendConfig() {
  const ls = JSON.parse(localStorage.getItem(CFG_KEY) || "null");
  const gl = window.__MARSFIT_SUPABASE;
  return ls || gl || null;
}

export function setBackendConfig(cfg) {
  localStorage.setItem(CFG_KEY, JSON.stringify(cfg));
}

let _client = null;
export async function getClient() {
  if (_client) return _client;
  const cfg = backendConfig();
  if (!cfg?.url || !cfg?.anonKey) return null;
  try {
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    _client = createClient(cfg.url, cfg.anonKey);
    return _client;
  } catch (e) {
    console.warn("[MARSFIT] Supabase no disponible:", e);
    return null;
  }
}

export async function isOnline() {
  return !!(await getClient()) && navigator.onLine;
}

// ---------- Auth ----------
export async function signInMagic(email) {
  const c = await getClient();
  if (!c) throw new Error("Backend no configurado");
  return c.auth.signInWithOtp({ email, options: { emailRedirectTo: location.href } });
}
export async function signOut() {
  const c = await getClient();
  if (!c) return;
  await c.auth.signOut();
}
export async function getUser() {
  const c = await getClient();
  if (!c) return null;
  const { data } = await c.auth.getUser();
  return data?.user ?? null;
}

// ---------- Sync perfil ----------
export async function pushProfile() {
  const c = await getClient(); if (!c) return;
  const user = await getUser(); if (!user) return;
  const p = getState().profile;
  await c.from("profiles").upsert({
    id: user.id,
    name: p.name || user.email,
    role: p.role,
    mars_unit: p.marsUnit,
    sex: p.sex, age: p.age,
    height_cm: p.heightCm, weight_kg: p.weightKg,
    activity: p.activity, experience: p.experience,
    equipment: p.equipment, goal: p.goal,
    diet_id: getState().dietId,
    routine_id: getState().routineId
  });
}

// ---------- Sync entreno ----------
export async function pushWorkout(workout) {
  const c = await getClient(); if (!c) return;
  const user = await getUser(); if (!user) return;
  await c.from("workouts").insert({
    user_id: user.id,
    date: workout.date,
    routine_id: workout.routineId,
    day_idx: workout.dayIdx,
    sets: workout.sets
  });
}

// ---------- Feed del escuadrón ----------
export async function postFeed({ circleId, kind, badge, text, payload }) {
  const c = await getClient(); if (!c) return;
  const user = await getUser(); if (!user) return;
  await c.from("feed_items").insert({
    circle_id: circleId, user_id: user.id, kind, badge, text, payload
  });
}

export async function fetchFeed(circleId, limit = 30) {
  const c = await getClient(); if (!c) return [];
  const { data } = await c.from("feed_items").select("*, user:profiles(name)")
    .eq("circle_id", circleId).order("created_at", { ascending: false }).limit(limit);
  return data ?? [];
}

// ---------- Crear / unirse a círculo ----------
export async function createCircle({ name, kind = "civil", marsUnit }) {
  const c = await getClient(); if (!c) return null;
  const user = await getUser(); if (!user) return null;
  const code = "MARS-" + Math.random().toString(36).slice(2, 6).toUpperCase();
  const { data, error } = await c.from("circles").insert({
    name, code, kind, mars_unit: marsUnit, owner_id: user.id
  }).select().single();
  if (error) throw error;
  await c.from("circle_members").insert({ circle_id: data.id, user_id: user.id });
  return data;
}

export async function joinCircle(code) {
  const c = await getClient(); if (!c) return null;
  const user = await getUser(); if (!user) return null;
  const { data: circle } = await c.from("circles").select("*").eq("code", code).single();
  if (!circle) throw new Error("Código no encontrado");
  await c.from("circle_members").insert({ circle_id: circle.id, user_id: user.id });
  return circle;
}

// ---------- Reacciones ----------
export async function react(feedId, emoji = "🔥") {
  const c = await getClient(); if (!c) return;
  const user = await getUser(); if (!user) return;
  await c.from("reactions").upsert({ feed_id: feedId, user_id: user.id, emoji });
}
