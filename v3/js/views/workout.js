/**
 * MARS FIT v3 — Vista Workout (Sesion activa)
 *
 * Patron "3-tap set logging" (Hevy/Strong):
 *   1. Tap para precargar peso/reps del set anterior
 *   2. Ajustar si quieres
 *   3. Tap check para marcar completado
 *
 * Features:
 *   - Session timer (MM:SS)
 *   - Ring progress (ejercicios completados / total)
 *   - Coach tip contextual segun tipo de dia
 *   - Exercise cards collapsibles con 3D canvas
 *   - Set tracker table con inputs numericos
 *   - Rest timer countdown tras completar serie
 *   - Boton finalizar con guardado en state
 */

import { icon } from '../icons.js';
import { renderRingProgress } from '../charts-v3.js';
import { ExerciseAnim } from '../anim3d.js';
import { getState, setState, today } from '../store-legacy.js';
import { EXERCISES, MUSCLES } from '../../data-legacy/exercises.js';
import { ROUTINES } from '../../data-legacy/routines.js';

// ============================================================
// HELPERS
// ============================================================

/** Format seconds as MM:SS */
function fmtTime(totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Look up exercise definition by id */
function findExercise(id) {
  return EXERCISES.find(e => e.id === id) || null;
}

/** Get last weight used for an exercise from workout history */
function getLastWeight(exId) {
  const state = getState();
  const workouts = state.workouts || [];
  for (let i = workouts.length - 1; i >= 0; i--) {
    const sets = workouts[i].sets || [];
    for (let j = sets.length - 1; j >= 0; j--) {
      if (sets[j].exId === exId && sets[j].weight > 0) {
        return sets[j].weight;
      }
    }
  }
  return 0;
}

/** Detect day type from day name for coach tips */
function detectDayType(dayName) {
  const lower = (dayName || '').toLowerCase();
  if (lower.includes('fuerza') || lower.includes('push') || lower.includes('pull') || lower.includes('legs')) return 'fuerza';
  if (lower.includes('hipertrofia') || lower.includes('volumen')) return 'hipertrofia';
  if (lower.includes('cardio') || lower.includes('potencia') || lower.includes('intervalos')) return 'cardio';
  if (lower.includes('resistencia') || lower.includes('circuito')) return 'resistencia';
  return 'fuerza';
}

/** Coach tip text by day type */
function getCoachTip(dayType) {
  const tips = {
    fuerza: 'Prioriza tecnica sobre peso. Descansos largos (2-3 min). Controla cada repeticion.',
    hipertrofia: 'Controla el tempo, siente la contraccion. Descansos moderados (60-90s).',
    cardio: 'Manten ritmo constante. Hidratacion cada 10 minutos. Escucha tu cuerpo.',
    resistencia: 'Ritmo sostenido, transiciones rapidas. Mantente hidratado entre estaciones.',
  };
  return tips[dayType] || tips.fuerza;
}

/** Rest time in seconds by day type */
function getRestTime(dayType) {
  const rest = { fuerza: 180, hipertrofia: 90, cardio: 60, resistencia: 60 };
  return rest[dayType] || 120;
}

/** Determine which routine day to show */
function resolveRoutineDay() {
  const state = getState();
  const routineId = state.routineId;
  if (!routineId || !ROUTINES[routineId]) return null;

  const routine = ROUTINES[routineId];
  const totalDays = routine.days.length;
  const workouts = (state.workouts || []).filter(w => w.routineId === routineId);

  // Next day index = (number of completed sessions) mod total days
  const dayIdx = workouts.length % totalDays;
  return { routine, dayIdx, day: routine.days[dayIdx] };
}

// ============================================================
// MAIN RENDER
// ============================================================

/**
 * @param {HTMLElement} container
 * @param {object} ctx - {navigate, back, params, route}
 * @returns {function} cleanup
 */
export function render(container, ctx) {
  const resolved = resolveRoutineDay();

  if (!resolved) {
    container.innerHTML = `
      <section class="view view--workout" data-view="workout" style="padding:var(--space-6);display:flex;flex-direction:column;align-items:center;gap:var(--space-6);padding-top:var(--space-16);">
        <div style="color:var(--text-tertiary);margin-bottom:var(--space-4);">${icon('dumbbell', 48)}</div>
        <h3 style="text-align:center;color:var(--text-primary);">Sin rutina asignada</h3>
        <p style="color:var(--text-secondary);text-align:center;max-width:280px;">
          Configura tu perfil y selecciona una rutina para comenzar a entrenar.
        </p>
        <button class="btn btn--primary btn--lg" id="mars-goto-profile">
          ${icon('settings')} Configurar perfil
        </button>
      </section>
    `;
    container.querySelector('#mars-goto-profile')?.addEventListener('click', () => ctx.navigate('/profile'));
    return () => {};
  }

  const { routine, dayIdx, day } = resolved;
  const dayType = detectDayType(day.day);
  const exercises = day.exercises.map(re => {
    const def = findExercise(re.id);
    return { ...re, def };
  }).filter(e => e.def);

  const totalExercises = exercises.length;

  // --- State tracking ---
  // setsState[exerciseIndex] = [{weight, reps, done}, ...]
  const setsState = exercises.map(ex => {
    const lastWeight = getLastWeight(ex.id);
    const numSets = ex.sets || 3;
    const rows = [];
    for (let i = 0; i < numSets; i++) {
      rows.push({
        weight: lastWeight,
        reps: parseRepsDefault(ex.reps),
        done: false,
      });
    }
    return rows;
  });

  // Track which exercise card is expanded (index); -1 = none
  let expandedIdx = 0;
  // Cleanup references
  const intervals = [];
  const animInstances = [];
  let sessionSeconds = 0;
  let sessionTimerInterval = null;
  let restTimerInterval = null;
  let restTimerEl = null;

  // ── Build HTML ──
  container.innerHTML = buildHTML(routine, day, dayType, exercises, totalExercises, setsState);

  // ── Session timer ──
  const timerDisplay = container.querySelector('[data-session-timer]');
  sessionTimerInterval = setInterval(() => {
    sessionSeconds++;
    if (timerDisplay) timerDisplay.textContent = fmtTime(sessionSeconds);
  }, 1000);
  intervals.push(sessionTimerInterval);

  // ── Ring progress ──
  const ringContainer = container.querySelector('[data-ring-progress]');
  updateRingProgress(ringContainer, 0, totalExercises);

  // ── Init 3D anims for expanded exercise ──
  initAnimForExercise(0);

  // ── Event delegation ──
  container.addEventListener('click', handleClick);
  container.addEventListener('input', handleInput);

  // ────────────────────────────────────────────
  // EVENT HANDLERS
  // ────────────────────────────────────────────

  function handleClick(e) {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;

    // Toggle exercise card collapse
    if (action === 'toggle-exercise') {
      const idx = parseInt(target.dataset.exIdx, 10);
      toggleExercise(idx);
      return;
    }

    // Mark set as done
    if (action === 'mark-set') {
      const exIdx = parseInt(target.dataset.exIdx, 10);
      const setIdx = parseInt(target.dataset.setIdx, 10);
      markSet(exIdx, setIdx);
      return;
    }

    // Add extra set
    if (action === 'add-set') {
      const exIdx = parseInt(target.dataset.exIdx, 10);
      addSet(exIdx);
      return;
    }

    // Skip rest timer
    if (action === 'skip-rest') {
      clearRestTimer();
      return;
    }

    // Finish session
    if (action === 'finish-session') {
      finishSession();
      return;
    }

    // Navigate back
    if (action === 'go-back') {
      ctx.navigate('/home');
      return;
    }
  }

  function handleInput(e) {
    const input = e.target;
    if (!input.dataset.exIdx) return;
    const exIdx = parseInt(input.dataset.exIdx, 10);
    const setIdx = parseInt(input.dataset.setIdx, 10);
    const field = input.dataset.field;
    if (field === 'weight') {
      setsState[exIdx][setIdx].weight = parseFloat(input.value) || 0;
    } else if (field === 'reps') {
      setsState[exIdx][setIdx].reps = parseInt(input.value, 10) || 0;
    }
  }

  // ────────────────────────────────────────────
  // ACTIONS
  // ────────────────────────────────────────────

  function toggleExercise(idx) {
    // Dispose previous anim
    disposeAllAnims();

    if (expandedIdx === idx) {
      // Collapse
      expandedIdx = -1;
      const body = container.querySelector(`[data-ex-body="${idx}"]`);
      const chevron = container.querySelector(`[data-ex-chevron="${idx}"]`);
      if (body) body.style.display = 'none';
      if (chevron) chevron.style.transform = 'rotate(0deg)';
    } else {
      // Collapse previous
      if (expandedIdx >= 0) {
        const prevBody = container.querySelector(`[data-ex-body="${expandedIdx}"]`);
        const prevChevron = container.querySelector(`[data-ex-chevron="${expandedIdx}"]`);
        if (prevBody) prevBody.style.display = 'none';
        if (prevChevron) prevChevron.style.transform = 'rotate(0deg)';
      }
      // Expand new
      expandedIdx = idx;
      const body = container.querySelector(`[data-ex-body="${idx}"]`);
      const chevron = container.querySelector(`[data-ex-chevron="${idx}"]`);
      if (body) body.style.display = 'block';
      if (chevron) chevron.style.transform = 'rotate(180deg)';

      initAnimForExercise(idx);

      // Scroll into view
      const card = container.querySelector(`[data-ex-card="${idx}"]`);
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function markSet(exIdx, setIdx) {
    const set = setsState[exIdx][setIdx];
    if (set.done) return; // Already done

    // Read current input values
    const weightInput = container.querySelector(`input[data-ex-idx="${exIdx}"][data-set-idx="${setIdx}"][data-field="weight"]`);
    const repsInput = container.querySelector(`input[data-ex-idx="${exIdx}"][data-set-idx="${setIdx}"][data-field="reps"]`);
    if (weightInput) set.weight = parseFloat(weightInput.value) || 0;
    if (repsInput) set.reps = parseInt(repsInput.value, 10) || 0;

    set.done = true;

    // Update row UI
    const row = container.querySelector(`[data-set-row="${exIdx}-${setIdx}"]`);
    if (row) {
      row.style.opacity = '0.5';
      row.style.transition = 'opacity 300ms var(--ease-out-expo)';
    }

    // Update check button — green neon glow
    const btn = container.querySelector(`[data-action="mark-set"][data-ex-idx="${exIdx}"][data-set-idx="${setIdx}"]`);
    if (btn) {
      btn.innerHTML = icon('check', 16);
      btn.style.color = '#fff';
      btn.style.background = '#00E676';
      btn.style.borderColor = '#00E676';
      btn.style.boxShadow = '0 0 12px rgba(0,230,118,0.5), 0 0 4px rgba(0,230,118,0.3)';
      btn.disabled = true;
    }

    // Disable inputs
    if (weightInput) weightInput.disabled = true;
    if (repsInput) repsInput.disabled = true;

    // Update progress
    updateProgress();

    // Start rest timer (unless all sets of this exercise are done)
    const allDone = setsState[exIdx].every(s => s.done);
    if (!allDone) {
      startRestTimer();
    } else {
      // Auto-advance to next uncompleted exercise
      clearRestTimer();
      const nextIdx = setsState.findIndex((sets, i) => i > exIdx && sets.some(s => !s.done));
      if (nextIdx >= 0) {
        startRestTimer(() => {
          toggleExercise(nextIdx);
        });
      }
    }
  }

  function addSet(exIdx) {
    const lastWeight = setsState[exIdx].length > 0
      ? setsState[exIdx][setsState[exIdx].length - 1].weight
      : 0;
    const lastReps = setsState[exIdx].length > 0
      ? setsState[exIdx][setsState[exIdx].length - 1].reps
      : 0;

    setsState[exIdx].push({ weight: lastWeight, reps: lastReps, done: false });
    const newSetIdx = setsState[exIdx].length - 1;

    // Insert row into table
    const tbody = container.querySelector(`[data-ex-tbody="${exIdx}"]`);
    if (tbody) {
      const addBtn = tbody.parentElement.querySelector(`[data-action="add-set"][data-ex-idx="${exIdx}"]`);
      const tr = document.createElement('tr');
      tr.setAttribute('data-set-row', `${exIdx}-${newSetIdx}`);
      tr.innerHTML = buildSetRow(exIdx, newSetIdx, lastWeight, lastReps, false);
      tbody.appendChild(tr);
    }
  }

  function startRestTimer(onComplete) {
    clearRestTimer();

    const restSeconds = getRestTime(dayType);
    let remaining = restSeconds;

    // Show rest timer overlay
    restTimerEl = container.querySelector('[data-rest-timer]');
    if (restTimerEl) {
      restTimerEl.style.display = 'flex';
      restTimerEl.querySelector('[data-rest-countdown]').textContent = fmtTime(remaining);
    }

    restTimerInterval = setInterval(() => {
      remaining--;
      if (restTimerEl) {
        const countdownEl = restTimerEl.querySelector('[data-rest-countdown]');
        if (countdownEl) countdownEl.textContent = fmtTime(remaining);
      }
      if (remaining <= 0) {
        clearRestTimer();
        if (onComplete) onComplete();
      }
    }, 1000);
    intervals.push(restTimerInterval);
  }

  function clearRestTimer() {
    if (restTimerInterval) {
      clearInterval(restTimerInterval);
      restTimerInterval = null;
    }
    if (restTimerEl) {
      restTimerEl.style.display = 'none';
    }
  }

  function updateProgress() {
    const completedExercises = setsState.filter(sets => sets.every(s => s.done)).length;
    const ringContainer = container.querySelector('[data-ring-progress]');
    updateRingProgress(ringContainer, completedExercises, totalExercises);

    // Update header count
    const countEl = container.querySelector('[data-completed-count]');
    if (countEl) countEl.textContent = completedExercises;

    // Check if session complete
    if (completedExercises === totalExercises) {
      const statusEl = container.querySelector('[data-session-status]');
      if (statusEl) {
        statusEl.textContent = 'Sesion completada';
        statusEl.style.color = 'var(--color-success)';
      }
    }
  }

  function finishSession() {
    const state = getState();

    // Gather all completed sets
    const allSets = [];
    exercises.forEach((ex, exIdx) => {
      setsState[exIdx].forEach((set, setIdx) => {
        if (set.done) {
          allSets.push({
            exId: ex.id,
            setIdx,
            weight: set.weight,
            reps: set.reps,
            done: true,
          });
        }
      });
    });

    const workout = {
      date: today(),
      routineId: state.routineId,
      dayIdx,
      duration: sessionSeconds,
      sets: allSets,
    };

    const workouts = [...(state.workouts || []), workout];
    setState({ workouts });

    ctx.navigate('/home');
  }

  // ────────────────────────────────────────────
  // 3D ANIMATION MANAGEMENT
  // ────────────────────────────────────────────

  function initAnimForExercise(idx) {
    const canvasContainer = container.querySelector(`[data-anim-container="${idx}"]`);
    if (!canvasContainer) return;
    const ex = exercises[idx];
    if (!ex || !ex.def) return;

    try {
      const anim = new ExerciseAnim(canvasContainer, ex.def.animate);
      animInstances.push(anim);
    } catch (err) {
      // Three.js might not be available; fail silently
      console.warn('[MARS Workout] 3D anim failed:', err.message);
    }
  }

  function disposeAllAnims() {
    animInstances.forEach(a => {
      try { a.dispose(); } catch (_) { /* noop */ }
    });
    animInstances.length = 0;
  }

  // ────────────────────────────────────────────
  // CLEANUP
  // ────────────────────────────────────────────

  function cleanup() {
    container.removeEventListener('click', handleClick);
    container.removeEventListener('input', handleInput);
    intervals.forEach(id => clearInterval(id));
    if (sessionTimerInterval) clearInterval(sessionTimerInterval);
    if (restTimerInterval) clearInterval(restTimerInterval);
    disposeAllAnims();
  }

  return cleanup;
}

// ============================================================
// HTML BUILDERS
// ============================================================

function buildHTML(routine, day, dayType, exercises, totalExercises, setsState) {
  return `
    <section class="view view--workout" data-view="workout" style="padding:var(--space-4);padding-bottom:var(--space-20);">

      ${buildSessionHeader(routine, day, totalExercises)}

      ${buildCoachTip(dayType)}

      ${exercises.map((ex, idx) => buildExerciseCard(ex, idx, setsState[idx], idx === 0)).join('')}

      ${buildRestTimerOverlay()}

      ${buildFinishButton()}

    </section>
  `;
}

function buildSessionHeader(routine, day, totalExercises) {
  return `
    <div class="card-glow metric-card metric-card--strength" style="margin-bottom:var(--space-4);">
      <div style="display:flex;align-items:center;gap:var(--space-4);">

        <div data-ring-progress style="flex-shrink:0;width:60px;height:60px;filter:drop-shadow(0 0 10px rgba(218,7,4,0.35));"></div>

        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-1);">
            <button data-action="go-back" class="btn btn--ghost btn--icon btn--sm" style="flex-shrink:0;" aria-label="Volver">
              ${icon('arrow-left', 18)}
            </button>
            <h4 style="margin:0;font-size:var(--text-lg);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              ${escapeHtml(day.day)}
            </h4>
          </div>
          <div style="display:flex;align-items:center;gap:var(--space-3);color:var(--text-secondary);font-size:var(--text-sm);">
            <span style="display:inline-flex;align-items:center;gap:var(--space-1);">
              ${icon('clock', 14)}
              <span data-session-timer style="font-variant-numeric:tabular-nums;font-feature-settings:'tnum';letter-spacing:0.02em;">00:00</span>
            </span>
            <span class="chip chip--active" style="font-size:11px;">
              <span data-completed-count>0</span>/${totalExercises} ejs
            </span>
          </div>
          <div data-session-status style="font-size:var(--text-xs);color:var(--text-tertiary);margin-top:var(--space-1);font-weight:var(--weight-semibold);text-transform:uppercase;letter-spacing:0.04em;"></div>
        </div>

      </div>
    </div>
  `;
}

function buildCoachTip(dayType) {
  const tip = getCoachTip(dayType);
  return `
    <div class="card-glow" style="margin-bottom:var(--space-4);padding:var(--space-4);display:flex;align-items:flex-start;gap:var(--space-3);border-color:rgba(245,158,11,0.2);">
      <div style="width:36px;height:36px;border-radius:var(--radius-full);background:rgba(245,158,11,0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#F59E0B;box-shadow:0 0 12px rgba(245,158,11,0.2);">
        ${icon('zap', 18)}
      </div>
      <div>
        <div style="font-family:var(--font-display);font-size:var(--text-xs);font-weight:var(--weight-semibold);color:var(--color-warning);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:var(--space-1);">Coach Tip</div>
        <div style="font-size:var(--text-sm);color:var(--text-secondary);line-height:var(--leading-relaxed);">${escapeHtml(tip)}</div>
      </div>
    </div>
  `;
}

function buildExerciseCard(ex, idx, sets, expanded) {
  const def = ex.def;
  const muscleName = MUSCLES[def.muscle] || def.muscle;
  const equipmentName = def.equipment || '';

  return `
    <div class="card-glow" data-ex-card="${idx}" style="margin-bottom:var(--space-4);padding:0;border-color:rgba(218,7,4,0.15);">

      <!-- Header (clickable toggle) -->
      <div data-action="toggle-exercise" data-ex-idx="${idx}"
           style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-4);cursor:pointer;user-select:none;"
           role="button" tabindex="0" aria-expanded="${expanded}" aria-label="Toggle ${escapeHtml(def.name)}">
        <div style="width:32px;height:32px;border-radius:var(--radius-full);background:linear-gradient(135deg, #DA0704 0%, #FF6B2C 100%);display:flex;align-items:center;justify-content:center;color:#fff;font-family:var(--font-display);font-size:var(--text-xs);font-weight:var(--weight-bold);flex-shrink:0;box-shadow:0 2px 8px rgba(218,7,4,0.35);">
          ${idx + 1}
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font-family:var(--font-display);font-size:var(--text-base);font-weight:var(--weight-bold);text-transform:uppercase;letter-spacing:0.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            ${escapeHtml(def.name)}
          </div>
          <div style="display:flex;align-items:center;gap:var(--space-2);margin-top:2px;">
            <span style="font-size:var(--text-xs);color:var(--text-tertiary);">${escapeHtml(muscleName)}</span>
            <span style="font-size:var(--text-xs);color:var(--text-disabled);">&#183;</span>
            <span style="font-size:var(--text-xs);color:var(--text-tertiary);">${escapeHtml(equipmentName)}</span>
          </div>
        </div>
        <span class="chip" style="font-size:11px;flex-shrink:0;font-weight:700;border:1.5px solid rgba(218,7,4,0.3);color:var(--text-primary);">${ex.sets}&times;${ex.reps}</span>
        <div data-ex-chevron="${idx}" style="color:var(--text-tertiary);transition:transform 300ms var(--ease-out-expo);${expanded ? 'transform:rotate(180deg);' : ''}">
          ${icon('chevron-down', 18)}
        </div>
      </div>

      <!-- Body (collapsible) -->
      <div data-ex-body="${idx}" style="display:${expanded ? 'block' : 'none'};border-top:1px solid var(--border-subtle);">

        <!-- 3D Canvas -->
        <div data-anim-container="${idx}" style="width:100%;aspect-ratio:16/10;background:var(--bg-surface);border-radius:16px;overflow:hidden;border:1px solid var(--border-subtle);"></div>

        <!-- Cues -->
        <div style="padding:var(--space-4);padding-top:var(--space-3);padding-bottom:var(--space-2);">
          <div style="font-family:var(--font-display);font-size:var(--text-xs);font-weight:var(--weight-semibold);color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:var(--space-2);">
            Puntos clave
          </div>
          <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:var(--space-1);">
            ${(def.cues || []).map(cue => `
              <li style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--text-sm);color:var(--text-secondary);">
                <span style="width:4px;height:4px;border-radius:var(--radius-full);background:var(--mars-red);flex-shrink:0;"></span>
                ${escapeHtml(cue)}
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Set tracker table -->
        <div style="padding:0 var(--space-4) var(--space-4);">
          <table style="width:100%;border-collapse:collapse;font-family:var(--font-body);">
            <thead>
              <tr style="border-bottom:1px solid var(--border-default);">
                <th style="text-align:center;padding:var(--space-2);font-size:var(--text-xs);color:var(--text-tertiary);font-weight:var(--weight-semibold);text-transform:uppercase;letter-spacing:0.04em;width:32px;">#</th>
                <th style="text-align:center;padding:var(--space-2);font-size:var(--text-xs);color:var(--text-tertiary);font-weight:var(--weight-semibold);text-transform:uppercase;letter-spacing:0.04em;">KG</th>
                <th style="text-align:center;padding:var(--space-2);font-size:var(--text-xs);color:var(--text-tertiary);font-weight:var(--weight-semibold);text-transform:uppercase;letter-spacing:0.04em;">REPS</th>
                <th style="text-align:center;padding:var(--space-2);font-size:var(--text-xs);color:var(--text-tertiary);font-weight:var(--weight-semibold);text-transform:uppercase;letter-spacing:0.04em;width:44px;"></th>
              </tr>
            </thead>
            <tbody data-ex-tbody="${idx}">
              ${sets.map((set, setIdx) => `
                <tr data-set-row="${idx}-${setIdx}" style="border-bottom:1px solid var(--border-subtle);">
                  ${buildSetRow(idx, setIdx, set.weight, set.reps, set.done)}
                </tr>
              `).join('')}
            </tbody>
          </table>

          <!-- Add set button -->
          <button data-action="add-set" data-ex-idx="${idx}"
                  class="btn btn--ghost btn--sm" style="width:100%;margin-top:var(--space-2);color:var(--text-tertiary);">
            ${icon('plus', 16)} Anadir serie
          </button>
        </div>

        <!-- Rest timer label -->
        <div style="padding:0 var(--space-4) var(--space-3);display:flex;align-items:center;gap:var(--space-2);color:var(--text-tertiary);font-size:var(--text-xs);">
          ${icon('clock', 14)}
          <span>Descanso: ${fmtTime(getRestTime(detectDayType('')))}</span>
        </div>

      </div>
    </div>
  `;
}

function buildSetRow(exIdx, setIdx, weight, reps, done) {
  return `
    <td style="text-align:center;padding:var(--space-2);font-family:var(--font-display);font-size:var(--text-sm);font-weight:var(--weight-bold);color:var(--text-tertiary);">
      ${setIdx + 1}
    </td>
    <td style="text-align:center;padding:var(--space-2);">
      <input type="number"
             class="input"
             data-ex-idx="${exIdx}" data-set-idx="${setIdx}" data-field="weight"
             value="${weight}"
             step="0.5"
             min="0"
             inputmode="decimal"
             ${done ? 'disabled' : ''}
             style="width:72px;text-align:center;padding:var(--space-2);font-size:var(--text-sm);font-family:var(--font-display);font-weight:var(--weight-bold);font-variant-numeric:tabular-nums;font-feature-settings:'tnum';margin:0 auto;display:block;"
             aria-label="Peso set ${setIdx + 1}">
    </td>
    <td style="text-align:center;padding:var(--space-2);">
      <input type="number"
             class="input"
             data-ex-idx="${exIdx}" data-set-idx="${setIdx}" data-field="reps"
             value="${reps}"
             step="1"
             min="0"
             inputmode="numeric"
             ${done ? 'disabled' : ''}
             style="width:60px;text-align:center;padding:var(--space-2);font-size:var(--text-sm);font-family:var(--font-display);font-weight:var(--weight-bold);font-variant-numeric:tabular-nums;font-feature-settings:'tnum';margin:0 auto;display:block;"
             aria-label="Reps set ${setIdx + 1}">
    </td>
    <td style="text-align:center;padding:var(--space-2);">
      <button data-action="mark-set" data-ex-idx="${exIdx}" data-set-idx="${setIdx}"
              class="btn btn--icon btn--sm"
              ${done ? 'disabled' : ''}
              style="border-radius:var(--radius-full);border:2px solid ${done ? '#00E676' : 'var(--border-strong)'};background:${done ? '#00E676' : 'transparent'};color:${done ? '#fff' : 'var(--text-tertiary)'};width:32px;height:32px;${done ? 'box-shadow:0 0 12px rgba(0,230,118,0.5),0 0 4px rgba(0,230,118,0.3);' : ''}"
              aria-label="Completar set ${setIdx + 1}">
        ${done ? icon('check', 16) : ''}
      </button>
    </td>
  `;
}

function buildRestTimerOverlay() {
  return `
    <div data-rest-timer style="display:none;position:fixed;bottom:80px;left:var(--space-4);right:var(--space-4);z-index:var(--z-toast);background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--radius-xl);padding:var(--space-5) var(--space-6);align-items:center;justify-content:space-between;gap:var(--space-4);box-shadow:var(--shadow-lg);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);">
      <div style="display:flex;align-items:center;gap:var(--space-3);">
        <div style="width:40px;height:40px;border-radius:var(--radius-full);background:rgba(245,158,11,0.15);display:flex;align-items:center;justify-content:center;color:#F59E0B;">${icon('clock', 22)}</div>
        <div>
          <div style="font-family:var(--font-display);font-size:var(--text-xs);font-weight:var(--weight-semibold);color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;">Descanso</div>
          <div data-rest-countdown style="font-family:var(--font-display);font-size:var(--text-3xl);font-weight:var(--weight-bold);color:var(--text-primary);line-height:1;font-variant-numeric:tabular-nums;font-feature-settings:'tnum';letter-spacing:-0.02em;">00:00</div>
        </div>
      </div>
      <button data-action="skip-rest" class="btn btn--secondary btn--sm" style="font-weight:var(--weight-bold);text-transform:uppercase;letter-spacing:0.06em;">
        SALTAR
      </button>
    </div>
  `;
}

function buildFinishButton() {
  return `
    <div style="padding:var(--space-4) 0;margin-top:var(--space-4);">
      <button data-action="finish-session" class="btn btn--primary btn--lg" style="width:100%;font-size:var(--text-base);">
        ${icon('check', 20)} Finalizar sesion
      </button>
    </div>
  `;
}

// ============================================================
// UTILITIES
// ============================================================

function updateRingProgress(container, completed, total) {
  if (!container) return;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const color = completed >= total && total > 0 ? '#10B981' : '#DA0704';
  renderRingProgress(container, pct, color, `${completed}/${total}`, {
    size: 60,
    strokeWidth: 6,
    animate: false,
    duration: 600,
  });
}

/** Parse reps string to a default numeric value */
function parseRepsDefault(reps) {
  if (typeof reps === 'number') return reps;
  const str = String(reps);
  // Handle "6-8" -> take first number
  const match = str.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/** Basic HTML escape */
function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}
