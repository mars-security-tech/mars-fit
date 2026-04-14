/**
 * MARS FIT v3 — Vista Home (Dashboard)
 *
 * Premium dashboard inspirado en Whoop + Oura + Apple Fitness.
 * Metricas: actividad, nutricion, sueno, corazon, fuerza, balance,
 * wellness score, coach IA, radar muscular, feed team.
 */

import { icon } from '../icons.js';
import {
  renderRingProgress,
  renderBarChart,
  renderLineChart,
  renderHeatmap,
  renderDonut,
  renderRadar,
  animateCounter,
} from '../charts-v3.js';
import { getState, computeTDEE, computeMacros, today } from '../../../js/store.js';
import { DIETS } from '../../../data/diets.js';
import { ROUTINES } from '../../../data/routines.js';
import { computeXP, renderLevelBar, getLatestBadge } from '../badges.js';
import { getSession } from '../auth.js';

/* ─── Helpers ──────────────────────────────────────────────── */

/** Greeting based on hour of day */
function greeting() {
  const h = new Date().getHours();
  if (h < 6) return 'Buenas noches';
  if (h < 12) return 'Buenos dias';
  if (h < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

/** YYYY-MM-DD for N days ago */
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

/** Count workouts this week (Mon-Sun) */
function workoutsThisWeek(state) {
  const now = new Date();
  const dayOfWeek = now.getDay() || 7; // 1=Mon ... 7=Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek + 1);
  const monStr = monday.toISOString().slice(0, 10);
  return (state.workouts || []).filter(w => w.date >= monStr).length;
}

/** Count meals logged today */
function mealsToday(state) {
  const t = today();
  return (state.meals || []).filter(m => m.date === t).length;
}

/** Compute streak (consecutive days with a workout or meal) */
function computeStreak(state) {
  const dates = new Set();
  (state.workouts || []).forEach(w => dates.add(w.date));
  (state.meals || []).forEach(m => dates.add(m.date));
  let streak = 0;
  let d = new Date();
  // If today has no activity, start checking from yesterday
  if (!dates.has(d.toISOString().slice(0, 10))) {
    d.setDate(d.getDate() - 1);
  }
  while (dates.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

/** Wellness score: workouts x 15 + meals x 5 + streak x 10, cap 100 */
function computeWellness(state) {
  const w = workoutsThisWeek(state);
  const m = mealsToday(state);
  const s = computeStreak(state);
  return Math.min(100, w * 15 + m * 5 + s * 10);
}

/** Kcal consumed today */
function kcalToday(state) {
  const t = today();
  return (state.meals || [])
    .filter(m => m.date === t)
    .reduce((sum, m) => sum + (m.kcal || 0), 0);
}

/** Macros consumed today {p, c, f} in grams */
function macrosToday(state) {
  const t = today();
  const todayMeals = (state.meals || []).filter(m => m.date === t);
  return {
    p: todayMeals.reduce((s, m) => s + (m.proteinG || 0), 0),
    c: todayMeals.reduce((s, m) => s + (m.carbsG || 0), 0),
    f: todayMeals.reduce((s, m) => s + (m.fatsG || 0), 0),
  };
}

/** Has user trained today? */
function hasTrainedToday(state) {
  const t = today();
  return (state.workouts || []).some(w => w.date === t);
}

/** Steps data from health (last 7 days) */
function stepsLast7(state) {
  const result = [];
  const labels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  for (let i = 6; i >= 0; i--) {
    const date = daysAgo(i);
    const dayData = state.health?.steps?.find(s => s.date === date);
    result.push(dayData?.value || 0);
  }
  return { data: result, labels };
}

/** Heart rate data (last 20 entries) */
function heartData(state) {
  const hr = state.health?.heartRate || [];
  return hr.slice(-20).map(h => h.bpm || h.value || 0);
}

/** Average BPM from recent data */
function avgBPM(state) {
  const data = heartData(state);
  if (!data.length) return 0;
  return Math.round(data.reduce((a, b) => a + b, 0) / data.length);
}

/** Sleep hours from health */
function sleepHours(state) {
  const t = today();
  const sleep = state.health?.sleep?.find(s => s.date === t);
  return sleep?.hours || 0;
}

/** Workout heatmap: 84 days (12 weeks) of training intensity */
function workoutHeatmap(state) {
  const data = [];
  for (let i = 83; i >= 0; i--) {
    const date = daysAgo(i);
    const sessions = (state.workouts || []).filter(w => w.date === date);
    const totalSets = sessions.reduce(
      (sum, w) => sum + (w.sets || []).filter(s => s.done).length,
      0
    );
    data.push(totalSets);
  }
  return data;
}

/** Muscle profile for radar chart: count exercises per muscle group in last 28 days */
function muscleProfile(state) {
  const groups = {
    Pecho: ['bench_press', 'dumbbell_press', 'push_up'],
    Espalda: ['pull_up', 'bent_row', 'lat_pulldown'],
    Piernas: ['squat', 'deadlift', 'lunge', 'hip_thrust', 'kb_swing'],
    Hombros: ['ohp', 'lateral_raise'],
    Brazos: ['biceps_curl', 'triceps_dip'],
    Core: ['plank', 'crunch'],
  };
  const counts = { Pecho: 0, Espalda: 0, Piernas: 0, Hombros: 0, Brazos: 0, Core: 0 };
  const cutoff = daysAgo(28);
  const recent = (state.workouts || []).filter(w => w.date >= cutoff);

  recent.forEach(w => {
    (w.sets || []).forEach(s => {
      for (const [group, ids] of Object.entries(groups)) {
        if (ids.includes(s.exId)) counts[group]++;
      }
    });
  });

  // Normalize to 0-100 (max 30 sets in a group = 100)
  const labels = Object.keys(counts);
  const values = labels.map(g => Math.min(100, Math.round((counts[g] / 30) * 100)));
  const hasData = values.some(v => v > 0);
  return { labels, values, hasData };
}

/** Coach contextual message */
function coachMessage(state) {
  const hour = new Date().getHours();
  const streak = computeStreak(state);
  const trained = hasTrainedToday(state);
  const diet = state.dietId ? DIETS[state.dietId] : null;
  const macros = diet ? computeMacros(state.profile, diet.macros) : null;
  const consumed = kcalToday(state);

  if (!trained && hour >= 14) {
    return {
      text: 'Toca sesion de entrenamiento. No dejes pasar el dia sin mover el cuerpo.',
      action: 'IR AL ENTRENO',
      route: '/workout',
    };
  }
  if (macros && consumed > 0 && consumed < macros.kcal * 0.5) {
    return {
      text: `Vas bajo en calorias: ${consumed} de ${macros.kcal} kcal objetivo. Asegura tu siguiente comida.`,
      action: 'VER NUTRICION',
      route: '/nutrition',
    };
  }
  if (streak > 3) {
    return {
      text: `Racha de ${streak} dias consecutivos. No la rompas, sigue sumando.`,
      action: 'SEGUIR',
      route: '/workout',
    };
  }
  // Default motivational
  const msgs = [
    'La consistencia supera al talento. Cada dia cuenta.',
    'Tu mejor version esta en construccion. Un entreno mas cerca.',
    'Disciplina es hacer lo que toca cuando no apetece.',
    'El dolor de hoy es la fuerza de manana.',
  ];
  return {
    text: msgs[Math.floor(Math.random() * msgs.length)],
    action: 'EMPEZAR',
    route: '/workout',
  };
}

/* ─── Main Render ──────────────────────────────────────────── */

/**
 * @param {HTMLElement} container
 * @param {object} ctx - {navigate, back, params, route}
 * @returns {function} cleanup
 */
export function render(container, ctx) {
  const { navigate } = ctx;
  const state = getState();
  const profile = state.profile;
  const wellness = computeWellness(state);
  const coach = coachMessage(state);
  const streak = computeStreak(state);
  const diet = state.dietId ? DIETS[state.dietId] : null;
  const macroTarget = diet ? computeMacros(profile, diet.macros) : computeMacros(profile, { p: 0.3, c: 0.4, f: 0.3 });
  const consumed = kcalToday(state);
  const todayMacros = macrosToday(state);
  const stepsData = stepsLast7(state);
  const todaySteps = stepsData.data[6] || 0;
  const hrData = heartData(state);
  const bpm = avgBPM(state);
  const sleep = sleepHours(state);
  const heatmap = workoutHeatmap(state);
  const radar = muscleProfile(state);
  const totalSessions = (state.workouts || []).length;
  const feed = (state.circle?.feed || []).slice(0, 3);
  const members = state.circle?.members || [];

  // Disposables for cleanup
  const disposables = [];

  container.innerHTML = `
    <section class="view view--home" data-view="home">

      <!-- HERO GRADIENT -->
      <div class="hero-gradient">
        <div class="hero-gradient__content animate-in">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-sm text-secondary uppercase tracking" style="margin-bottom:var(--space-1);">${greeting()}</p>
              <h2 class="hero-gradient__title" style="font-size:var(--text-3xl);margin:0;">
                ${(getSession()?.name || profile.name || 'Espartano').toUpperCase()}
              </h2>
            </div>
            <div id="home-wellness-ring" style="flex-shrink:0;"></div>
          </div>
          <div class="flex items-center gap-3 mt-4">
            <div style="position:relative;flex:1;">
              <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-tertiary);pointer-events:none;">
                ${icon('search', 18)}
              </span>
              <input
                type="text"
                class="input"
                placeholder="Escribe tu pregunta..."
                style="padding-left:40px;background:var(--bg-surface-raised);border-color:var(--border-subtle);"
                id="home-search"
                readonly
              />
            </div>
          </div>
        </div>
      </div>

      <!-- BARRA DE NIVEL RECOLECTOR → CAZADOR -->
      <div class="card-glow animate-in animate-in--stagger-1" style="margin:var(--space-4) var(--space-4) 0;padding:var(--space-3) var(--space-4);">
        ${renderLevelBar(computeXP(state))}
      </div>

      <!-- COACH BANNER -->
      <div class="card-glow animate-in animate-in--stagger-2" id="home-coach" style="margin:var(--space-4) var(--space-4) 0;padding:var(--space-4) var(--space-5);cursor:pointer;">
        <div class="flex items-start gap-3">
          <div style="width:36px;height:36px;border-radius:var(--radius-sm);background:rgba(218,7,4,0.12);display:flex;align-items:center;justify-content:center;color:var(--mars-red);flex-shrink:0;">
            ${icon('star', 20)}
          </div>
          <div style="flex:1;min-width:0;">
            <p class="text-xs text-mars uppercase tracking" style="margin-bottom:var(--space-1);font-weight:600;font-family:var(--font-display);">Coach MARS</p>
            <p class="text-sm" style="color:var(--text-secondary);line-height:1.4;margin-bottom:var(--space-3);">${coach.text}</p>
            <button class="btn btn--primary btn--sm btn--pill" id="home-coach-btn">
              ${coach.action}
            </button>
          </div>
        </div>
      </div>

      <!-- SECTION: METRICAS DE HOY -->
      <div style="padding:var(--space-4) var(--space-4) 0;">
        <div class="section-title" style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-3);">
          <span class="section-title__accent" style="display:inline-block;width:3px;height:16px;background:var(--mars-red);border-radius:2px;"></span>
          <span style="font-family:var(--font-display);font-size:var(--text-xs);font-weight:var(--weight-bold);text-transform:uppercase;letter-spacing:0.1em;color:var(--text-secondary);">METRICAS DE HOY</span>
        </div>
      </div>

      <!-- METRIC CARDS GRID -->
      <div class="grid grid-cols-2 gap-3" style="padding:0 var(--space-4) var(--space-4);">

        <!-- ACTIVIDAD -->
        <div class="metric-card metric-card--activity animate-in animate-in--stagger-2" id="card-activity">
          <div class="metric-card__header">
            <div class="metric-card__icon-circle" style="--mc:var(--metric-activity, #DA0704);width:36px;height:36px;border-radius:50%;background:color-mix(in srgb, var(--metric-activity, #DA0704) 15%, transparent);display:flex;align-items:center;justify-content:center;color:var(--metric-activity, #DA0704);flex-shrink:0;">
              ${icon('steps', 20)}
            </div>
            <span class="metric-card__title" style="font-family:var(--font-display);font-size:var(--text-xs);font-weight:var(--weight-bold);text-transform:uppercase;letter-spacing:0.08em;color:var(--text-secondary);">ACTIVIDAD</span>
          </div>
          ${todaySteps > 0
            ? `<div class="metric-card__value" id="stat-steps">0</div>
               <span class="metric-card__unit">pasos hoy</span>`
            : `<div style="text-align:center;padding:var(--space-4) 0;">
                 <div style="opacity:0.15;margin-bottom:var(--space-2);">${icon('steps', 48)}</div>
                 <p class="text-sm" style="color:var(--text-tertiary);margin-bottom:var(--space-3);">Sin datos de pasos</p>
                 <button class="btn btn--ghost btn--sm btn--pill" id="btn-connect-activity">CONECTAR</button>
               </div>`
          }
          <div id="chart-steps" style="margin-top:var(--space-3);height:100px;"></div>
        </div>

        <!-- SUENO -->
        <div class="metric-card metric-card--sleep animate-in animate-in--stagger-3" id="card-sleep">
          <div class="metric-card__header">
            <div class="metric-card__icon-circle" style="--mc:var(--metric-sleep, #8B5CF6);width:36px;height:36px;border-radius:50%;background:color-mix(in srgb, var(--metric-sleep, #8B5CF6) 15%, transparent);display:flex;align-items:center;justify-content:center;color:var(--metric-sleep, #8B5CF6);flex-shrink:0;">
              ${icon('sleep-moon', 20)}
            </div>
            <span class="metric-card__title" style="font-family:var(--font-display);font-size:var(--text-xs);font-weight:var(--weight-bold);text-transform:uppercase;letter-spacing:0.08em;color:var(--text-secondary);">SUENO</span>
          </div>
          ${sleep > 0
            ? `<div class="metric-card__value" id="stat-sleep">0</div>
               <span class="metric-card__unit">horas</span>`
            : `<div style="text-align:center;padding:var(--space-4) 0;">
                 <div style="opacity:0.15;margin-bottom:var(--space-2);">${icon('sleep-moon', 48)}</div>
                 <p class="text-sm" style="color:var(--text-tertiary);margin-bottom:var(--space-3);">Sin datos de sueno</p>
                 <button class="btn btn--ghost btn--sm btn--pill" id="btn-connect-sleep">CONECTAR</button>
               </div>`
          }
          <div id="chart-sleep" style="margin-top:var(--space-3);">
            ${sleep > 0 ? '' : ''}
          </div>
        </div>

        <!-- CORAZON -->
        <div class="metric-card metric-card--heart animate-in animate-in--stagger-4" id="card-heart">
          <div class="metric-card__header">
            <div class="metric-card__icon-circle" style="--mc:var(--metric-heart, #EF4444);width:36px;height:36px;border-radius:50%;background:color-mix(in srgb, var(--metric-heart, #EF4444) 15%, transparent);display:flex;align-items:center;justify-content:center;color:var(--metric-heart, #EF4444);flex-shrink:0;">
              ${icon('heart-pulse', 20)}
            </div>
            <span class="metric-card__title" style="font-family:var(--font-display);font-size:var(--text-xs);font-weight:var(--weight-bold);text-transform:uppercase;letter-spacing:0.08em;color:var(--text-secondary);">CORAZON</span>
          </div>
          ${bpm > 0
            ? `<div class="metric-card__value" id="stat-bpm">0</div>
               <span class="metric-card__unit">BPM promedio</span>`
            : `<div style="text-align:center;padding:var(--space-4) 0;">
                 <div style="opacity:0.15;margin-bottom:var(--space-2);">${icon('heart-pulse', 48)}</div>
                 <p class="text-sm" style="color:var(--text-tertiary);margin-bottom:var(--space-3);">Sin datos de pulso</p>
                 <button class="btn btn--ghost btn--sm btn--pill" id="btn-connect-heart">CONECTAR</button>
               </div>`
          }
          <div id="chart-heart" style="margin-top:var(--space-3);height:80px;"></div>
        </div>

        <!-- NUTRICION -->
        <div class="metric-card metric-card--nutrition animate-in animate-in--stagger-5" id="card-nutrition" style="cursor:pointer;">
          <div class="metric-card__header">
            <div class="metric-card__icon-circle" style="--mc:var(--metric-nutrition, #10B981);width:36px;height:36px;border-radius:50%;background:color-mix(in srgb, var(--metric-nutrition, #10B981) 15%, transparent);display:flex;align-items:center;justify-content:center;color:var(--metric-nutrition, #10B981);flex-shrink:0;">
              ${icon('fork', 20)}
            </div>
            <span class="metric-card__title" style="font-family:var(--font-display);font-size:var(--text-xs);font-weight:var(--weight-bold);text-transform:uppercase;letter-spacing:0.08em;color:var(--text-secondary);">NUTRICION</span>
          </div>
          <div class="flex items-end gap-1">
            <span class="metric-card__value" id="stat-kcal">0</span>
            <span class="metric-card__unit" style="padding-bottom:4px;">/ ${macroTarget.kcal} kcal</span>
          </div>
          <div id="chart-macros" style="margin-top:var(--space-3);text-align:center;"></div>
        </div>

        <!-- FUERZA -->
        <div class="metric-card metric-card--strength animate-in animate-in--stagger-6" id="card-strength">
          <div class="metric-card__header">
            <div class="metric-card__icon-circle" style="--mc:var(--metric-strength, #F59E0B);width:36px;height:36px;border-radius:50%;background:color-mix(in srgb, var(--metric-strength, #F59E0B) 15%, transparent);display:flex;align-items:center;justify-content:center;color:var(--metric-strength, #F59E0B);flex-shrink:0;">
              ${icon('dumbbell', 20)}
            </div>
            <span class="metric-card__title" style="font-family:var(--font-display);font-size:var(--text-xs);font-weight:var(--weight-bold);text-transform:uppercase;letter-spacing:0.08em;color:var(--text-secondary);">FUERZA</span>
          </div>
          <div class="metric-card__value" id="stat-sessions">0</div>
          <span class="metric-card__unit">sesiones totales</span>
          <div id="chart-heatmap" style="margin-top:var(--space-3);"></div>
          <button class="btn btn--primary btn--sm w-full" id="btn-go-workout" style="margin-top:var(--space-3);">
            ${icon('dumbbell', 16)} IR AL ENTRENO
          </button>
        </div>

        <!-- BALANCE -->
        <div class="metric-card metric-card--balance animate-in animate-in--stagger-7" id="card-balance">
          <div class="metric-card__header">
            <div class="metric-card__icon-circle" style="--mc:var(--metric-balance, #EC4899);width:36px;height:36px;border-radius:50%;background:color-mix(in srgb, var(--metric-balance, #EC4899) 15%, transparent);display:flex;align-items:center;justify-content:center;color:var(--metric-balance, #EC4899);flex-shrink:0;">
              ${icon('scale', 20)}
            </div>
            <span class="metric-card__title" style="font-family:var(--font-display);font-size:var(--text-xs);font-weight:var(--weight-bold);text-transform:uppercase;letter-spacing:0.08em;color:var(--text-secondary);">BALANCE</span>
          </div>
          <div id="chart-balance" style="text-align:center;margin-top:var(--space-2);"></div>
          <p class="text-xs text-secondary text-center" style="margin-top:var(--space-2);">Balance general</p>
        </div>

      </div>

      <!-- SECTION: RENDIMIENTO -->
      <div style="padding:0 var(--space-4);">
        <div class="section-title" style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-3);">
          <span class="section-title__accent" style="display:inline-block;width:3px;height:16px;background:var(--mars-red);border-radius:2px;"></span>
          <span style="font-family:var(--font-display);font-size:var(--text-xs);font-weight:var(--weight-bold);text-transform:uppercase;letter-spacing:0.1em;color:var(--text-secondary);">RENDIMIENTO</span>
        </div>
      </div>

      <!-- RADAR: PERFIL MUSCULAR -->
      <div class="card-glow animate-in animate-in--stagger-8" style="margin:0 var(--space-4) var(--space-4);" id="card-radar">
        <div class="flex items-center gap-2 mb-4">
          <div style="width:36px;height:36px;border-radius:var(--radius-sm);background:rgba(218,7,4,0.12);display:flex;align-items:center;justify-content:center;color:var(--mars-red);">
            ${icon('target', 20)}
          </div>
          <div>
            <h4 style="margin:0;font-size:var(--text-lg);">Perfil Muscular</h4>
            <p class="text-xs text-tertiary">Ultimas 4 semanas</p>
          </div>
        </div>
        <div id="chart-radar" style="text-align:center;"></div>
        ${!radar.hasData
          ? `<p class="text-sm text-secondary text-center" style="margin-top:var(--space-3);">Completa 1 semana de entreno para ver tu perfil</p>`
          : ''
        }
      </div>

      <!-- SECTION: TEAM -->
      <div style="padding:0 var(--space-4);">
        <div class="section-title" style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-3);">
          <span class="section-title__accent" style="display:inline-block;width:3px;height:16px;background:var(--mars-red);border-radius:2px;"></span>
          <span style="font-family:var(--font-display);font-size:var(--text-xs);font-weight:var(--weight-bold);text-transform:uppercase;letter-spacing:0.1em;color:var(--text-secondary);">TEAM</span>
        </div>
      </div>

      <!-- TEAM COMPACT -->
      <div class="card-glow" style="margin:0 var(--space-4) var(--space-4);" id="card-squad">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div style="width:36px;height:36px;border-radius:var(--radius-sm);background:rgba(59,130,246,0.12);display:flex;align-items:center;justify-content:center;color:var(--color-steps);">
              ${icon('users', 20)}
            </div>
            <h4 style="margin:0;font-size:var(--text-lg);">Team</h4>
          </div>
          <span class="chip chip--active" style="font-size:10px;">${state.circle?.code || 'MARS'}</span>
        </div>
        <div class="flex flex-col gap-3" id="squad-feed">
          ${feed.length > 0
            ? feed.map(item => renderFeedItem(item, members)).join('')
            : `<p class="text-sm text-tertiary text-center" style="padding:var(--space-4) 0;">Sin actividad reciente en tu team</p>`
          }
        </div>
        <button class="btn btn--ghost w-full" id="btn-squad" style="margin-top:var(--space-3);">
          VER TEAM ${icon('chevron-right', 16)}
        </button>
      </div>

      <!-- Bottom spacing -->
      <div style="height:var(--space-4);"></div>

    </section>
  `;

  /* ─── Render Charts ────────────────────────────────────────── */

  // Wellness ring in hero (large, cyan)
  const wellnessRing = container.querySelector('#home-wellness-ring');
  if (wellnessRing) {
    renderRingProgress(wellnessRing, wellness, '#00E5FF', 'WELLNESS', {
      size: 140,
      strokeWidth: 12,
      duration: 1400,
    });
  }

  // Steps bar chart
  const stepsChart = container.querySelector('#chart-steps');
  if (stepsChart && stepsData.data.some(v => v > 0)) {
    renderBarChart(stepsChart, stepsData.data, '#DA0704', stepsData.labels, {
      height: 100,
      barRadius: 4,
      duration: 900,
      showValues: false,
    });
  }

  // Sleep phases mock (bar visualization)
  const sleepChart = container.querySelector('#chart-sleep');
  if (sleepChart && sleep > 0) {
    const phases = [
      Math.round(sleep * 0.15 * 10) / 10,
      Math.round(sleep * 0.50 * 10) / 10,
      Math.round(sleep * 0.20 * 10) / 10,
      Math.round(sleep * 0.15 * 10) / 10,
    ];
    renderBarChart(sleepChart, phases, '#8B5CF6', ['Profundo', 'Ligero', 'REM', 'Despierto'], {
      height: 100,
      barRadius: 4,
      duration: 900,
      showValues: true,
    });
  }

  // Heart rate line chart
  const heartChart = container.querySelector('#chart-heart');
  if (heartChart && hrData.length >= 2) {
    renderLineChart(heartChart, hrData, '#EF4444', true, {
      height: 80,
      duration: 1000,
      showDots: false,
    });
  }

  // Nutrition donut
  const macrosChart = container.querySelector('#chart-macros');
  if (macrosChart) {
    const p = todayMacros.p || 0;
    const c = todayMacros.c || 0;
    const f = todayMacros.f || 0;
    if (p + c + f > 0) {
      renderDonut(macrosChart, [
        { value: p, color: '#3B82F6', label: 'Proteina' },
        { value: c, color: '#F59E0B', label: 'Carbos' },
        { value: f, color: '#EF4444', label: 'Grasa' },
      ], {
        size: 100,
        strokeWidth: 16,
        duration: 1000,
        centerLabel: '',
      });
    } else {
      // Placeholder donut with empty state
      renderDonut(macrosChart, [
        { value: 1, color: 'var(--border-default)', label: 'Sin datos' },
      ], {
        size: 100,
        strokeWidth: 16,
        animate: false,
        centerLabel: '',
      });
    }
  }

  // Strength heatmap
  const heatmapChart = container.querySelector('#chart-heatmap');
  if (heatmapChart) {
    renderHeatmap(heatmapChart, heatmap, {
      cols: 12,
      cellSize: 10,
      gap: 2,
      colors: document.documentElement.getAttribute('data-theme') === 'light' ? ['#F3F4F6', '#FDE68A', '#FBBF24', '#D97706', '#B45309'] : ['#161B22', '#5C2D0E', '#8B4513', '#D97706', '#F59E0B'],
      duration: 1000,
    });
  }

  // Balance ring
  const balanceChart = container.querySelector('#chart-balance');
  if (balanceChart) {
    renderRingProgress(balanceChart, wellness, '#EC4899', `${wellness}`, {
      size: 90,
      strokeWidth: 8,
      duration: 1200,
    });
  }

  // Radar chart
  const radarChart = container.querySelector('#chart-radar');
  if (radarChart) {
    renderRadar(radarChart, radar.values, radar.labels, '#DA0704', {
      size: 240,
      levels: 4,
      duration: 1200,
    });
  }

  /* ─── Animate Counters ─────────────────────────────────────── */

  const statSteps = container.querySelector('#stat-steps');
  if (statSteps && todaySteps > 0) {
    animateCounter(statSteps, todaySteps, { duration: 1200 });
  }

  const statSleep = container.querySelector('#stat-sleep');
  if (statSleep && sleep > 0) {
    animateCounter(statSleep, sleep, { duration: 1000, decimals: 1 });
  }

  const statBpm = container.querySelector('#stat-bpm');
  if (statBpm && bpm > 0) {
    animateCounter(statBpm, bpm, { duration: 1000 });
  }

  const statKcal = container.querySelector('#stat-kcal');
  if (statKcal) {
    animateCounter(statKcal, consumed, { duration: 1000 });
  }

  const statSessions = container.querySelector('#stat-sessions');
  if (statSessions) {
    animateCounter(statSessions, totalSessions, { duration: 1000 });
  }

  /* ─── Event Listeners ──────────────────────────────────────── */

  const handlers = [];

  function addClick(id, fn) {
    const el = container.querySelector(id);
    if (el) {
      el.addEventListener('click', fn);
      handlers.push(() => el.removeEventListener('click', fn));
    }
  }

  // Coach banner action
  addClick('#home-coach-btn', () => navigate(coach.route));
  addClick('#home-coach', (e) => {
    if (!e.target.closest('button')) navigate(coach.route);
  });

  // Nutrition card -> nutricion
  addClick('#card-nutrition', () => navigate('/nutrition'));

  // Go to workout
  addClick('#btn-go-workout', (e) => {
    e.stopPropagation();
    navigate('/workout');
  });

  // Squad button
  addClick('#btn-squad', () => navigate('/circle'));

  // Empty state connect buttons -> navigate to profile
  addClick('#btn-connect-activity', () => navigate('/profile'));
  addClick('#btn-connect-sleep', () => navigate('/profile'));
  addClick('#btn-connect-heart', () => navigate('/profile'));

  // Search input focus -> could navigate to AI chat or just be decorative
  const searchInput = container.querySelector('#home-search');
  if (searchInput) {
    const searchHandler = () => {
      // Future: navigate to AI chat. For now, visual feedback only.
      searchInput.blur();
    };
    searchInput.addEventListener('focus', searchHandler);
    handlers.push(() => searchInput.removeEventListener('focus', searchHandler));
  }

  /* ─── Cleanup ──────────────────────────────────────────────── */

  return () => {
    handlers.forEach(h => h());
    disposables.forEach(d => {
      if (typeof d === 'function') d();
      else if (d && typeof d.dispose === 'function') d.dispose();
    });
  };
}

/* ─── Sub-components ─────────────────────────────────────────── */

/** Render a single feed item in the squad section */
function renderFeedItem(item, members) {
  const member = members.find(m => m.id === item.who);
  const initials = member?.initials || item.who?.slice(0, 2).toUpperCase() || '??';
  const name = member?.name || item.who || 'Desconocido';
  const kindBadge = item.kind === 'fire'
    ? `<span class="badge badge--warning" style="font-size:9px;padding:0 4px;height:16px;">PR</span>`
    : item.kind === 'ok'
      ? `<span class="badge badge--success" style="font-size:9px;padding:0 4px;height:16px;">${icon('check', 10)}</span>`
      : '';

  return `
    <div class="flex items-center gap-3">
      <div class="avatar avatar--sm avatar--ring">${initials}</div>
      <div style="flex:1;min-width:0;">
        <div class="flex items-center gap-2">
          <span class="text-sm" style="font-weight:600;color:var(--text-primary);">${name}</span>
          ${kindBadge}
        </div>
        <p class="text-xs text-secondary truncate">${item.text || ''}</p>
      </div>
      <span class="text-xs text-tertiary" style="flex-shrink:0;">${item.time || ''}</span>
    </div>
  `;
}

/** Sleep placeholder bars when no data */
function renderSleepPlaceholder() {
  return `
    <div class="flex items-end gap-2" style="height:60px;padding:var(--space-2) 0;">
      <div style="flex:1;height:40%;background:rgba(139,92,246,0.08);border-radius:4px;"></div>
      <div style="flex:1;height:70%;background:rgba(139,92,246,0.06);border-radius:4px;"></div>
      <div style="flex:1;height:50%;background:rgba(139,92,246,0.05);border-radius:4px;"></div>
      <div style="flex:1;height:30%;background:rgba(139,92,246,0.04);border-radius:4px;"></div>
    </div>
    <p class="text-xs text-tertiary" style="margin-top:var(--space-2);">Importa datos de Apple Health</p>
  `;
}
