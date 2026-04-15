/**
 * MARS FIT v3 — Vista Workout Log (Historial de entrenos)
 *
 * Historial completo de sesiones de entrenamiento.
 * Agrupado por semana, resumen mensual, detalle expandible.
 */

import { icon } from '../icons.js';
import { getAllWorkouts, today } from '../store-v3.js';
import exercises from '../../data/exercises-v3.js';

/* ─── Helpers ──────────────────────────────────────────────── */

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function exerciseName(id) {
  const ex = exercises.find(e => e.id === id);
  return ex ? ex.name : id || 'Ejercicio';
}

function formatDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short' });
}

function formatDuration(minutes) {
  if (!minutes) return '-';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}min` : `${m} min`;
}

function getWeekLabel(dateStr) {
  const d = new Date(dateStr);
  const dayOfWeek = d.getDay() || 7;
  const monday = new Date(d);
  monday.setDate(d.getDate() - dayOfWeek + 1);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (dt) => dt.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  return fmt(monday) + ' - ' + fmt(sunday);
}

function getWeekKey(dateStr) {
  const d = new Date(dateStr);
  const dayOfWeek = d.getDay() || 7;
  const monday = new Date(d);
  monday.setDate(d.getDate() - dayOfWeek + 1);
  return monday.toISOString().slice(0, 10);
}

/* ─── Render ──────────────────────────────────────────────── */

/**
 * @param {HTMLElement} container
 * @param {object} ctx - {navigate, back, params, route}
 * @returns {function} cleanup
 */
export function render(container, ctx) {
  // Show loading initially
  container.innerHTML = `
    <section class="view view--workout-log" data-view="workout-log" style="padding-bottom:var(--space-24);">
      <div class="card-glow animate-in" style="margin:var(--space-4);">
        <div class="flex items-center gap-3">
          <button class="btn btn--ghost btn--icon" data-action="go-back" aria-label="Volver">
            ${icon('chevron-left', 20)}
          </button>
          <h3 class="font-display text-primary uppercase tracking" style="margin:0;font-size:var(--text-xl);">
            ${icon('chart', 20)} Historial
          </h3>
        </div>
      </div>
      <div class="flex items-center justify-center" style="min-height:40vh;">
        <p class="text-tertiary text-sm">Cargando historial...</p>
      </div>
    </section>
  `;

  let expandedSession = null;

  loadAndRender();

  async function loadAndRender() {
    try {
      const workouts = await getAllWorkouts();
      renderWorkouts(workouts || []);
    } catch (err) {
      renderWorkouts([]);
    }
  }

  function renderWorkouts(workouts) {
    // Sort newest first
    const sorted = [...workouts].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    // Monthly stats
    const now = new Date();
    const monthStr = now.toISOString().slice(0, 7);
    const monthWorkouts = sorted.filter(w => (w.date || '').startsWith(monthStr));
    const totalSets = monthWorkouts.reduce((s, w) => s + (w.sets || []).length, 0);
    const totalVolume = monthWorkouts.reduce((s, w) => {
      return s + (w.sets || []).reduce((vs, set) => vs + ((set.kg || 0) * (set.reps || 0)), 0);
    }, 0);

    // Group by week
    const weekMap = new Map();
    for (const w of sorted) {
      const key = getWeekKey(w.date || today());
      if (!weekMap.has(key)) weekMap.set(key, { label: getWeekLabel(w.date || today()), workouts: [] });
      weekMap.get(key).workouts.push(w);
    }

    container.innerHTML = `
      <section class="view view--workout-log" data-view="workout-log" style="padding-bottom:var(--space-24);">

        <!-- HEADER -->
        <div class="card-glow animate-in" style="margin:var(--space-4);">
          <div class="flex items-center gap-3">
            <button class="btn btn--ghost btn--icon" data-action="go-back" aria-label="Volver">
              ${icon('chevron-left', 20)}
            </button>
            <h3 class="font-display text-primary uppercase tracking" style="margin:0;font-size:var(--text-xl);">
              ${icon('chart', 20)} Historial
            </h3>
          </div>
        </div>

        <!-- MONTHLY SUMMARY -->
        <div class="grid grid-cols-3 gap-3 animate-in animate-in--stagger-1" style="margin:var(--space-4);">
          <div class="card-glow text-center" style="padding:var(--space-3);">
            <p class="font-display text-mars" style="font-size:var(--text-2xl);margin:0;">${monthWorkouts.length}</p>
            <p class="text-xs text-tertiary uppercase mt-1">Entrenos</p>
          </div>
          <div class="card-glow text-center" style="padding:var(--space-3);">
            <p class="font-display text-primary" style="font-size:var(--text-2xl);margin:0;">${totalSets}</p>
            <p class="text-xs text-tertiary uppercase mt-1">Sets</p>
          </div>
          <div class="card-glow text-center" style="padding:var(--space-3);">
            <p class="font-display text-primary" style="font-size:var(--text-2xl);margin:0;">${totalVolume > 1000 ? (totalVolume / 1000).toFixed(1) + 'k' : totalVolume}</p>
            <p class="text-xs text-tertiary uppercase mt-1">Vol (kg)</p>
          </div>
        </div>

        ${sorted.length === 0 ? `
          <!-- EMPTY STATE -->
          <div class="flex flex-col items-center justify-center animate-in animate-in--stagger-2" style="min-height:30vh;padding:var(--space-8);">
            <div style="color:var(--text-tertiary);margin-bottom:var(--space-4);">${icon('dumbbell', 48)}</div>
            <p class="font-display text-primary text-lg uppercase">Sin entrenos registrados</p>
            <p class="text-tertiary text-sm mt-2">Completa tu primer entrenamiento para verlo aqui.</p>
            <button class="btn btn--primary btn--sm mt-6" data-action="go-workout">
              ${icon('play', 14)} IR A ENTRENAR
            </button>
          </div>
        ` : `
          <!-- WEEKLY GROUPS -->
          <div class="flex-col gap-4 animate-in animate-in--stagger-2" style="display:flex;margin:var(--space-4);">
            ${[...weekMap.entries()].map(([weekKey, week]) => `
              <div>
                <h4 class="font-display text-xs text-tertiary uppercase tracking mb-2" style="padding-left:var(--space-2);">
                  ${icon('calendar', 14)} ${escapeHtml(week.label)}
                </h4>
                <div class="flex-col gap-2" style="display:flex;">
                  ${week.workouts.map(w => {
                    const setCount = (w.sets || []).length;
                    const vol = (w.sets || []).reduce((s, set) => s + ((set.kg || 0) * (set.reps || 0)), 0);
                    const isExpanded = expandedSession === w.id;
                    return `
                      <div class="card-glow" style="padding:0;margin:0;overflow:hidden;">
                        <button class="w-full" data-session-id="${escapeHtml(w.id)}" style="padding:var(--space-3);text-align:left;cursor:pointer;border:none;background:transparent;width:100%;display:block;">
                          <div class="flex items-center justify-between mb-1">
                            <span class="font-display text-sm text-primary uppercase">${escapeHtml(formatDate(w.date))}</span>
                            <span style="color:var(--text-tertiary);transition:transform 0.2s;${isExpanded ? 'transform:rotate(180deg);' : ''}">${icon('chevron-down', 16)}</span>
                          </div>
                          <div class="flex gap-3 text-xs text-secondary">
                            <span>${icon('clock', 12)} ${formatDuration(w.duration)}</span>
                            <span>${icon('dumbbell', 12)} ${setCount} sets</span>
                            ${vol > 0 ? `<span>${icon('zap', 12)} ${Math.round(vol)} kg</span>` : ''}
                          </div>
                        </button>
                        ${isExpanded ? renderSessionDetail(w) : ''}
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        `}

      </section>
    `;
  }

  function renderSessionDetail(w) {
    const sets = w.sets || [];
    if (sets.length === 0) {
      return `
        <div style="padding:0 var(--space-3) var(--space-3);border-top:1px solid var(--border-default);">
          <p class="text-tertiary text-xs mt-2">Sin sets registrados.</p>
        </div>
      `;
    }

    // Group sets by exercise
    const byExercise = new Map();
    for (const s of sets) {
      const key = s.exerciseId || 'unknown';
      if (!byExercise.has(key)) byExercise.set(key, []);
      byExercise.get(key).push(s);
    }

    return `
      <div style="padding:0 var(--space-3) var(--space-3);border-top:1px solid var(--border-default);">
        <div class="flex-col gap-3 mt-3" style="display:flex;">
          ${[...byExercise.entries()].map(([exId, exSets]) => `
            <div>
              <div class="font-display text-xs text-secondary uppercase tracking mb-1">${escapeHtml(exerciseName(exId))}</div>
              <div class="flex-col gap-1" style="display:flex;">
                ${exSets.map((s, i) => `
                  <div class="flex items-center justify-between text-xs" style="padding:var(--space-1) var(--space-2);border-radius:var(--radius-sm);background:var(--bg-surface-raised);">
                    <span class="text-tertiary">Set ${i + 1}</span>
                    <span class="text-secondary">${s.kg ? escapeHtml(String(s.kg)) + ' kg' : '-'} x ${s.reps ? escapeHtml(String(s.reps)) : '-'}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
          ${w.notes ? `<div class="text-xs text-tertiary" style="font-style:italic;">Notas: ${escapeHtml(w.notes)}</div>` : ''}
        </div>
      </div>
    `;
  }

  // Events
  function handleClick(e) {
    if (e.target.closest('[data-action="go-back"]')) {
      e.preventDefault();
      history.back();
      return;
    }

    if (e.target.closest('[data-action="go-workout"]')) {
      e.preventDefault();
      if (ctx.navigate) ctx.navigate('/workout');
      else location.hash = '#/workout';
      return;
    }

    const sessionBtn = e.target.closest('[data-session-id]');
    if (sessionBtn) {
      e.preventDefault();
      const id = sessionBtn.dataset.sessionId;
      expandedSession = expandedSession === id ? null : id;
      loadAndRender();
      return;
    }
  }

  container.addEventListener('click', handleClick);

  return () => {
    container.removeEventListener('click', handleClick);
  };
}
