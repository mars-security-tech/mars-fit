/**
 * MARS FIT v3 — Vista Routine Builder
 *
 * Crear y editar rutinas personalizadas.
 * Seleccion de ejercicios, series, reps, dias de la semana.
 */

import { icon } from '../icons.js';
import exercises from '../../data/exercises-v3.js';
import { MUSCLE_GROUPS } from '../../data/exercises-v3.js';
import { saveCustomRoutine, getCustomRoutines } from '../store-v3.js';

/* ─── Helpers ──────────────────────────────────────────────── */

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function muscleGroupLabel(exercise) {
  const primaryMuscles = exercise.muscles?.primary || [];
  for (const [, group] of Object.entries(MUSCLE_GROUPS)) {
    if (group.muscles.some(m => primaryMuscles.includes(m))) return group.label;
  }
  return 'Otro';
}

/* ─── Render ──────────────────────────────────────────────── */

/**
 * @param {HTMLElement} container
 * @param {object} ctx - {navigate, back, params: {id?}, route}
 * @returns {function} cleanup
 */
export function render(container, ctx) {
  const routineId = ctx.params?.id;
  const isEditing = !!routineId;

  // State
  let routine = {
    id: routineId || null,
    name: '',
    days: [{ name: 'Dia 1', exercises: [] }],
  };
  let showPicker = false;
  let pickerDayIdx = 0;
  let pickerSearch = '';
  let saving = false;

  // Load existing routine if editing
  if (isEditing) {
    getCustomRoutines().then(routines => {
      const found = (routines || []).find(r => r.id === routineId);
      if (found) {
        routine = { ...found };
        renderView();
      }
    }).catch(() => {});
  }

  function renderView() {
    container.innerHTML = `
      <section class="view view--routine-builder" data-view="routine-builder" style="padding-bottom:var(--space-24);">

        <!-- HEADER -->
        <div class="card-glow animate-in" style="margin:var(--space-4);">
          <div class="flex items-center gap-3 mb-3">
            <button class="btn btn--ghost btn--icon" data-action="go-back" aria-label="Volver">
              ${icon('chevron-left', 20)}
            </button>
            <h3 class="font-display text-primary uppercase tracking" style="margin:0;font-size:var(--text-xl);">
              ${icon('dumbbell', 20)} ${isEditing ? 'Editar rutina' : 'Nueva rutina'}
            </h3>
          </div>
          <div>
            <label class="input-label" style="text-transform:uppercase;letter-spacing:0.06em;font-size:var(--text-xs);font-weight:600;">Nombre de la rutina</label>
            <input class="input" type="text" data-field="routine-name" value="${escapeHtml(routine.name)}" placeholder="Ej: Mi PPL personalizado" maxlength="80" />
          </div>
        </div>

        <!-- DAYS -->
        <div class="flex-col gap-3 animate-in animate-in--stagger-1" style="display:flex;margin:var(--space-4);" data-days-container>
          ${routine.days.map((day, dayIdx) => renderDay(day, dayIdx)).join('')}
        </div>

        <!-- ADD DAY -->
        ${routine.days.length < 7 ? `
          <div style="margin:var(--space-2) var(--space-4);">
            <button class="btn btn--ghost w-full" data-action="add-day" style="border:1px dashed var(--border-strong);border-radius:var(--radius-md);">
              ${icon('plus', 16)} Anadir dia (${routine.days.length}/7)
            </button>
          </div>
        ` : ''}

        <!-- SAVE -->
        <div style="margin:var(--space-4);">
          <button class="btn btn--primary btn--lg w-full" data-action="save-routine" ${saving ? 'disabled' : ''}>
            ${icon('check', 18)} ${saving ? 'GUARDANDO...' : 'GUARDAR RUTINA'}
          </button>
        </div>

        <!-- EXERCISE PICKER MODAL -->
        ${showPicker ? renderPicker() : ''}

      </section>
    `;

    bindEvents();
  }

  function renderDay(day, dayIdx) {
    return `
      <div class="card-glow" style="padding:var(--space-3);margin:0;">
        <div class="flex items-center justify-between mb-3">
          <input class="input" type="text" data-day-name="${dayIdx}" value="${escapeHtml(day.name)}"
                 placeholder="Nombre del dia" maxlength="40"
                 style="font-family:var(--font-display);text-transform:uppercase;letter-spacing:0.04em;font-size:var(--text-sm);max-width:60%;" />
          ${routine.days.length > 1 ? `
            <button class="btn btn--ghost btn--sm btn--pill" data-action="remove-day" data-day-idx="${dayIdx}" style="color:var(--color-destructive);">
              ${icon('trash', 14)} Eliminar
            </button>
          ` : ''}
        </div>

        <!-- EXERCISES LIST -->
        <div class="flex-col gap-2" style="display:flex;">
          ${day.exercises.length === 0 ? `
            <p class="text-tertiary text-xs text-center" style="padding:var(--space-3);">Sin ejercicios. Pulsa el boton para anadir.</p>
          ` : day.exercises.map((ex, exIdx) => {
            const exData = exercises.find(e => e.id === ex.id);
            const name = exData ? exData.name : ex.id;
            return `
              <div class="flex items-center gap-2" style="padding:var(--space-2);border-radius:var(--radius-md);background:var(--bg-surface-raised);">
                <div class="flex-1" style="min-width:0;">
                  <div class="font-display text-xs text-primary uppercase" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                    ${escapeHtml(name)}
                  </div>
                  <div class="flex gap-2 mt-1">
                    <div class="flex items-center gap-1">
                      <label class="text-xs text-tertiary" for="sets-${dayIdx}-${exIdx}">Sets</label>
                      <input class="input" type="number" id="sets-${dayIdx}-${exIdx}" data-ex-sets="${dayIdx}-${exIdx}"
                             min="1" max="20" value="${ex.sets || 3}" style="width:48px;padding:2px 4px;font-size:var(--text-xs);text-align:center;" />
                    </div>
                    <div class="flex items-center gap-1">
                      <label class="text-xs text-tertiary" for="reps-${dayIdx}-${exIdx}">Reps</label>
                      <input class="input" type="text" id="reps-${dayIdx}-${exIdx}" data-ex-reps="${dayIdx}-${exIdx}"
                             value="${escapeHtml(String(ex.reps || '10'))}" maxlength="10" style="width:52px;padding:2px 4px;font-size:var(--text-xs);text-align:center;" />
                    </div>
                  </div>
                </div>
                <button class="btn btn--ghost btn--icon" data-action="remove-exercise" data-day-idx="${dayIdx}" data-ex-idx="${exIdx}" style="color:var(--color-destructive);" title="Eliminar ejercicio">
                  ${icon('x', 14)}
                </button>
              </div>
            `;
          }).join('')}
        </div>

        <button class="btn btn--ghost btn--sm w-full mt-3" data-action="add-exercise" data-day-idx="${dayIdx}" style="border:1px dashed var(--border-default);border-radius:var(--radius-md);">
          ${icon('plus', 14)} Anadir ejercicio
        </button>
      </div>
    `;
  }

  function renderPicker() {
    const q = pickerSearch.toLowerCase().trim();
    let filtered = exercises;
    if (q) {
      filtered = exercises.filter(ex => {
        return (ex.name || '').toLowerCase().includes(q)
          || (ex.nameEn || '').toLowerCase().includes(q)
          || (ex.tags || []).join(' ').toLowerCase().includes(q);
      });
    }
    // Limit to 40 results
    filtered = filtered.slice(0, 40);

    return `
      <div data-picker-overlay style="position:fixed;inset:0;z-index:9998;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,0.6);backdrop-filter:blur(8px);">
        <div style="width:100%;max-width:560px;background:var(--bg-surface-card, var(--bg-surface));border-radius:20px 20px 0 0;padding:var(--space-4);max-height:70vh;overflow-y:auto;">
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-display text-primary uppercase tracking" style="font-size:var(--text-base);margin:0;">Seleccionar ejercicio</h4>
            <button data-action="close-picker" style="background:none;border:none;color:var(--text-tertiary);font-size:24px;cursor:pointer;padding:4px;">
              ${icon('x', 20)}
            </button>
          </div>
          <input class="input mb-3" type="search" data-picker-search placeholder="Buscar ejercicio..." value="${escapeHtml(pickerSearch)}" autocomplete="off" />
          <div class="flex-col gap-1" style="display:flex;">
            ${filtered.length === 0 ? `<p class="text-tertiary text-sm text-center p-4">Sin resultados.</p>` :
              filtered.map(ex => `
                <button class="w-full" data-pick-exercise="${escapeHtml(ex.id)}" style="text-align:left;padding:var(--space-2) var(--space-3);border-radius:var(--radius-md);cursor:pointer;border:none;background:var(--bg-surface-raised);display:block;width:100%;">
                  <div class="font-display text-xs text-primary uppercase">${escapeHtml(ex.name)}</div>
                  <div class="text-xs text-tertiary">${escapeHtml(muscleGroupLabel(ex))} / ${escapeHtml(ex.equipment || '')}</div>
                </button>
              `).join('')
            }
          </div>
        </div>
      </div>
    `;
  }

  function syncInputs() {
    // Sync routine name
    const nameInput = container.querySelector('[data-field="routine-name"]');
    if (nameInput) routine.name = nameInput.value;

    // Sync day names and exercise sets/reps
    routine.days.forEach((day, dayIdx) => {
      const dayNameInput = container.querySelector(`[data-day-name="${dayIdx}"]`);
      if (dayNameInput) day.name = dayNameInput.value;

      day.exercises.forEach((ex, exIdx) => {
        const setsInput = container.querySelector(`[data-ex-sets="${dayIdx}-${exIdx}"]`);
        const repsInput = container.querySelector(`[data-ex-reps="${dayIdx}-${exIdx}"]`);
        if (setsInput) ex.sets = parseInt(setsInput.value, 10) || 3;
        if (repsInput) ex.reps = repsInput.value || '10';
      });
    });
  }

  function bindEvents() {
    const section = container.querySelector('[data-view="routine-builder"]');
    if (!section) return;

    section.addEventListener('click', handleClick);
    section.addEventListener('input', handleInput);
  }

  function handleClick(e) {
    if (e.target.closest('[data-action="go-back"]')) {
      e.preventDefault();
      history.back();
      return;
    }

    if (e.target.closest('[data-action="add-day"]')) {
      e.preventDefault();
      syncInputs();
      if (routine.days.length < 7) {
        routine.days.push({ name: 'Dia ' + (routine.days.length + 1), exercises: [] });
        renderView();
      }
      return;
    }

    const removeDayBtn = e.target.closest('[data-action="remove-day"]');
    if (removeDayBtn) {
      e.preventDefault();
      syncInputs();
      const idx = parseInt(removeDayBtn.dataset.dayIdx, 10);
      if (routine.days.length > 1) {
        routine.days.splice(idx, 1);
        renderView();
      }
      return;
    }

    const addExBtn = e.target.closest('[data-action="add-exercise"]');
    if (addExBtn) {
      e.preventDefault();
      syncInputs();
      pickerDayIdx = parseInt(addExBtn.dataset.dayIdx, 10);
      pickerSearch = '';
      showPicker = true;
      renderView();
      // Focus search
      requestAnimationFrame(() => {
        container.querySelector('[data-picker-search]')?.focus();
      });
      return;
    }

    const removeExBtn = e.target.closest('[data-action="remove-exercise"]');
    if (removeExBtn) {
      e.preventDefault();
      syncInputs();
      const dayIdx = parseInt(removeExBtn.dataset.dayIdx, 10);
      const exIdx = parseInt(removeExBtn.dataset.exIdx, 10);
      routine.days[dayIdx]?.exercises.splice(exIdx, 1);
      renderView();
      return;
    }

    // Picker: close
    if (e.target.closest('[data-action="close-picker"]') || e.target.matches('[data-picker-overlay]')) {
      e.preventDefault();
      showPicker = false;
      renderView();
      return;
    }

    // Picker: select exercise
    const pickBtn = e.target.closest('[data-pick-exercise]');
    if (pickBtn) {
      e.preventDefault();
      const exId = pickBtn.dataset.pickExercise;
      if (routine.days[pickerDayIdx]) {
        routine.days[pickerDayIdx].exercises.push({ id: exId, sets: 3, reps: '10', rest: 90 });
      }
      showPicker = false;
      renderView();
      return;
    }

    // Save
    if (e.target.closest('[data-action="save-routine"]')) {
      e.preventDefault();
      syncInputs();
      if (!routine.name.trim()) {
        routine.name = 'Mi rutina';
      }
      saving = true;
      renderView();
      saveCustomRoutine(routine).then(() => {
        saving = false;
        // Show feedback then go back
        const btn = container.querySelector('[data-action="save-routine"]');
        if (btn) {
          btn.innerHTML = `${icon('check', 18)} GUARDADA`;
          btn.classList.add('glow-pulse');
        }
        setTimeout(() => history.back(), 800);
      }).catch(() => {
        saving = false;
        renderView();
      });
      return;
    }
  }

  function handleInput(e) {
    if (e.target.matches('[data-picker-search]')) {
      pickerSearch = e.target.value;
      // Re-render just picker content
      const overlay = container.querySelector('[data-picker-overlay]');
      if (overlay) {
        const temp = document.createElement('div');
        temp.innerHTML = renderPicker();
        overlay.replaceWith(temp.firstElementChild);
        // Re-focus search and set cursor position
        const newSearch = container.querySelector('[data-picker-search]');
        if (newSearch) {
          newSearch.focus();
          newSearch.selectionStart = newSearch.selectionEnd = newSearch.value.length;
        }
      }
    }
  }

  // Initial render
  renderView();

  return () => {
    container.removeEventListener('click', handleClick);
    container.removeEventListener('input', handleInput);
  };
}
