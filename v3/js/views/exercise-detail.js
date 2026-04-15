/**
 * MARS FIT v3 — Vista Exercise Detail
 *
 * Detalle de un ejercicio: tecnica, musculos, historial de sets.
 */

import { icon } from '../icons.js';
import exercises, { MUSCLE_GROUPS } from '../../data/exercises-v3.js';
import { getAllWorkouts } from '../store-v3.js';

/* ─── Helpers ──────────────────────────────────────────────── */

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function muscleName(muscleId) {
  const names = {
    pectoralMayor: 'Pectoral mayor', pectoralMenor: 'Pectoral menor',
    dorsalAncho: 'Dorsal ancho', trapecio: 'Trapecio', romboides: 'Romboides',
    erectoresEspinales: 'Erectores espinales', infraespinoso: 'Infraespinoso',
    deltoidesAnterior: 'Deltoides anterior', deltoidesLateral: 'Deltoides lateral',
    deltoidesPosterior: 'Deltoides posterior',
    biceps: 'Biceps', triceps: 'Triceps', braquial: 'Braquial', antebrazo: 'Antebrazo',
    rectoAbdominal: 'Recto abdominal', oblicuos: 'Oblicuos', transverso: 'Transverso',
    erectores: 'Erectores',
    cuadriceps: 'Cuadriceps', isquiotibiales: 'Isquiotibiales',
    gluteoMayor: 'Gluteo mayor', gluteoMedio: 'Gluteo medio',
    aductores: 'Aductores', abductores: 'Abductores',
    gemelos: 'Gemelos', soleo: 'Soleo', tibialAnterior: 'Tibial anterior',
  };
  return names[muscleId] || muscleId;
}

function muscleGroupLabel(muscleId) {
  for (const [, group] of Object.entries(MUSCLE_GROUPS)) {
    if (group.muscles.includes(muscleId)) return group.label;
  }
  return '';
}

function equipmentLabel(eq) {
  const labels = {
    barbell: 'Barra', dumbbell: 'Mancuerna', cable: 'Polea', machine: 'Maquina',
    smith: 'Smith', kettlebell: 'Kettlebell', bodyweight: 'Calistenia', band: 'Banda',
    trx: 'TRX', box: 'Cajon', sled: 'Trineo', barFija: 'Barra fija', bench: 'Banco', none: 'Ninguno',
  };
  return labels[eq] || eq || '';
}

/* ─── Render ──────────────────────────────────────────────── */

/**
 * @param {HTMLElement} container
 * @param {object} ctx - {navigate, back, params: {id}, route}
 * @returns {function} cleanup
 */
export function render(container, ctx) {
  const exerciseId = ctx.params?.id || '';
  const exercise = exercises.find(ex => ex.id === exerciseId);

  // Not found state
  if (!exercise) {
    container.innerHTML = `
      <section class="view view--exercise-detail" data-view="exercise-detail" style="padding-bottom:var(--space-24);">
        <div class="card-glow animate-in" style="margin:var(--space-4);">
          <div class="flex items-center gap-3 mb-4">
            <button class="btn btn--ghost btn--icon" data-action="go-back" aria-label="Volver">
              ${icon('chevron-left', 20)}
            </button>
            <h3 class="font-display text-primary uppercase tracking" style="margin:0;">Ejercicio</h3>
          </div>
        </div>
        <div class="flex flex-col items-center justify-center" style="min-height:40vh;">
          <div style="color:var(--text-tertiary);margin-bottom:var(--space-4);">${icon('alert', 48)}</div>
          <p class="font-display text-primary text-lg uppercase">Ejercicio no encontrado</p>
          <p class="text-tertiary text-sm mt-2">ID: ${escapeHtml(exerciseId)}</p>
          <button class="btn btn--primary btn--sm mt-6" data-action="go-back">Volver</button>
        </div>
      </section>
    `;
    const section = container.querySelector('[data-view="exercise-detail"]');
    function handleBack(e) {
      if (e.target.closest('[data-action="go-back"]')) { e.preventDefault(); history.back(); }
    }
    section?.addEventListener('click', handleBack);
    return () => { section?.removeEventListener('click', handleBack); };
  }

  let activeTab = 'tecnica';

  function renderTabs() {
    const tabContent = container.querySelector('[data-tab-content]');
    if (!tabContent) return;

    // Update tab buttons
    container.querySelectorAll('[data-tab]').forEach(t => {
      t.classList.toggle('chip--active', t.dataset.tab === activeTab);
    });

    if (activeTab === 'tecnica') {
      const instructions = exercise.instructions || [];
      const tips = exercise.tips || [];
      const mistakes = exercise.commonMistakes || [];
      const sets = exercise.sets || {};

      tabContent.innerHTML = `
        <div class="flex-col gap-4" style="display:flex;">
          ${instructions.length ? `
            <div>
              <h5 class="font-display text-sm text-primary uppercase tracking mb-2">Ejecucion</h5>
              <ol style="padding-left:var(--space-5);margin:0;color:var(--text-secondary);font-size:var(--text-sm);line-height:1.7;">
                ${instructions.map(i => `<li>${escapeHtml(i)}</li>`).join('')}
              </ol>
            </div>
          ` : ''}
          ${tips.length ? `
            <div>
              <h5 class="font-display text-sm text-primary uppercase tracking mb-2">${icon('check', 14)} Consejos</h5>
              <ul style="padding-left:var(--space-5);margin:0;color:var(--text-secondary);font-size:var(--text-sm);line-height:1.7;list-style:disc;">
                ${tips.map(t => `<li>${escapeHtml(t)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          ${mistakes.length ? `
            <div>
              <h5 class="font-display text-sm text-primary uppercase tracking mb-2" style="color:var(--color-error);">${icon('alert', 14)} Errores comunes</h5>
              <ul style="padding-left:var(--space-5);margin:0;color:var(--text-secondary);font-size:var(--text-sm);line-height:1.7;list-style:disc;">
                ${mistakes.map(m => `<li>${escapeHtml(m)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          ${Object.keys(sets).length ? `
            <div>
              <h5 class="font-display text-sm text-primary uppercase tracking mb-2">Series recomendadas</h5>
              <div class="grid grid-cols-3 gap-2">
                ${Object.entries(sets).map(([level, val]) => `
                  <div class="card-glow" style="padding:var(--space-2);margin:0;text-align:center;">
                    <span class="text-xs text-tertiary uppercase">${escapeHtml(level)}</span>
                    <div class="font-display text-primary text-sm">${escapeHtml(String(val))}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    } else if (activeTab === 'musculos') {
      const primary = exercise.muscles?.primary || [];
      const secondary = exercise.muscles?.secondary || [];

      tabContent.innerHTML = `
        <div class="flex-col gap-4" style="display:flex;">
          <div>
            <h5 class="font-display text-sm text-primary uppercase tracking mb-2" style="color:var(--mars-red);">Musculos principales</h5>
            <div class="flex-col gap-2" style="display:flex;">
              ${primary.length ? primary.map(m => `
                <div class="flex items-center gap-3" style="padding:var(--space-2) var(--space-3);border-radius:var(--radius-md);background:rgba(218,7,4,0.06);">
                  <div style="width:8px;height:8px;border-radius:50%;background:var(--mars-red);"></div>
                  <div>
                    <div class="font-display text-sm text-primary uppercase">${escapeHtml(muscleName(m))}</div>
                    <div class="text-xs text-tertiary">${escapeHtml(muscleGroupLabel(m))}</div>
                  </div>
                </div>
              `).join('') : '<p class="text-tertiary text-sm">No especificado.</p>'}
            </div>
          </div>
          <div>
            <h5 class="font-display text-sm text-primary uppercase tracking mb-2">Musculos secundarios</h5>
            <div class="flex-col gap-2" style="display:flex;">
              ${secondary.length ? secondary.map(m => `
                <div class="flex items-center gap-3" style="padding:var(--space-2) var(--space-3);border-radius:var(--radius-md);background:var(--bg-surface-raised);">
                  <div style="width:8px;height:8px;border-radius:50%;background:var(--text-tertiary);"></div>
                  <div>
                    <div class="font-display text-sm text-primary uppercase">${escapeHtml(muscleName(m))}</div>
                    <div class="text-xs text-tertiary">${escapeHtml(muscleGroupLabel(m))}</div>
                  </div>
                </div>
              `).join('') : '<p class="text-tertiary text-sm">Ninguno.</p>'}
            </div>
          </div>
        </div>
      `;
    } else if (activeTab === 'historial') {
      tabContent.innerHTML = `
        <div class="flex items-center justify-center" style="min-height:120px;">
          <div class="text-tertiary text-sm">Cargando historial...</div>
        </div>
      `;
      loadHistory(tabContent);
    }
  }

  async function loadHistory(tabContent) {
    try {
      const workouts = await getAllWorkouts();
      const relevant = [];

      for (const w of workouts) {
        const matchingSets = (w.sets || []).filter(s => s.exerciseId === exerciseId);
        if (matchingSets.length > 0) {
          relevant.push({ date: w.date, duration: w.duration, sets: matchingSets });
        }
      }

      relevant.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

      if (relevant.length === 0) {
        tabContent.innerHTML = `
          <div class="flex flex-col items-center justify-center" style="min-height:120px;">
            <div style="color:var(--text-tertiary);margin-bottom:var(--space-2);">${icon('chart', 32)}</div>
            <p class="text-tertiary text-sm">Sin historial para este ejercicio.</p>
            <p class="text-tertiary text-xs mt-1">Registra sets en tu entrenamiento para verlos aqui.</p>
          </div>
        `;
        return;
      }

      tabContent.innerHTML = `
        <div class="flex-col gap-3" style="display:flex;">
          ${relevant.slice(0, 20).map(w => {
            const dateLabel = w.date ? new Date(w.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
            const totalVol = w.sets.reduce((s, set) => s + ((set.kg || 0) * (set.reps || 0)), 0);
            return `
              <div class="card-glow" style="padding:var(--space-3);margin:0;">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-display text-sm text-primary uppercase">${escapeHtml(dateLabel)}</span>
                  <span class="chip text-xs" style="font-size:10px;">${w.sets.length} sets</span>
                </div>
                <div class="flex-col gap-1" style="display:flex;">
                  ${w.sets.map((s, i) => `
                    <div class="flex items-center justify-between text-sm text-secondary" style="padding:var(--space-1) 0;">
                      <span class="text-tertiary text-xs">Set ${i + 1}</span>
                      <span>${s.kg ? escapeHtml(String(s.kg)) + ' kg' : '-'} x ${s.reps ? escapeHtml(String(s.reps)) : '-'}</span>
                    </div>
                  `).join('')}
                </div>
                ${totalVol > 0 ? `<div class="text-xs text-tertiary mt-2">Volumen total: ${Math.round(totalVol)} kg</div>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      `;
    } catch (err) {
      tabContent.innerHTML = `<p class="text-tertiary text-sm">Error cargando historial.</p>`;
    }
  }

  // Main HTML
  const primaryGroup = (exercise.muscles?.primary || []).map(m => muscleGroupLabel(m)).filter(Boolean);
  const uniqueGroups = [...new Set(primaryGroup)];

  container.innerHTML = `
    <section class="view view--exercise-detail" data-view="exercise-detail" style="padding-bottom:var(--space-24);">

      <!-- HEADER -->
      <div class="card-glow animate-in" style="margin:var(--space-4);">
        <div class="flex items-center gap-3 mb-3">
          <button class="btn btn--ghost btn--icon" data-action="go-back" aria-label="Volver">
            ${icon('chevron-left', 20)}
          </button>
          <div class="flex-1" style="min-width:0;">
            <h3 class="font-display text-primary uppercase tracking" style="margin:0;font-size:var(--text-lg);">
              ${escapeHtml(exercise.name)}
            </h3>
            ${exercise.nameEn ? `<p class="text-tertiary text-xs mt-1">${escapeHtml(exercise.nameEn)}</p>` : ''}
          </div>
        </div>
        <div class="flex gap-1 flex-wrap">
          ${uniqueGroups.map(g => `<span class="chip chip--active text-xs" style="font-size:10px;">${escapeHtml(g)}</span>`).join('')}
          <span class="chip text-xs" style="font-size:10px;background:rgba(180,74,255,0.1);color:#B44AFF;">${escapeHtml(equipmentLabel(exercise.equipment))}</span>
          ${exercise.category ? `<span class="chip text-xs" style="font-size:10px;">${escapeHtml(exercise.category)}</span>` : ''}
          ${exercise.level ? `<span class="chip text-xs" style="font-size:10px;">${escapeHtml(exercise.level)}</span>` : ''}
        </div>
      </div>

      <!-- TABS -->
      <div class="animate-in animate-in--stagger-1" style="margin:0 var(--space-4);">
        <div class="flex gap-2" style="padding:var(--space-2) 0;">
          <button class="chip chip--active" data-tab="tecnica" style="cursor:pointer;border:none;">Tecnica</button>
          <button class="chip" data-tab="musculos" style="cursor:pointer;border:none;">Musculos</button>
          <button class="chip" data-tab="historial" style="cursor:pointer;border:none;">Historial</button>
        </div>
      </div>

      <!-- TAB CONTENT -->
      <div class="card-glow animate-in animate-in--stagger-2" style="margin:var(--space-4);" data-tab-content>
      </div>

    </section>
  `;

  // Initial tab render
  renderTabs();

  // Events
  const section = container.querySelector('[data-view="exercise-detail"]');
  if (!section) return () => {};

  function handleClick(e) {
    if (e.target.closest('[data-action="go-back"]')) {
      e.preventDefault();
      history.back();
      return;
    }

    const tab = e.target.closest('[data-tab]');
    if (tab) {
      e.preventDefault();
      activeTab = tab.dataset.tab;
      renderTabs();
      return;
    }
  }

  section.addEventListener('click', handleClick);

  return () => {
    section.removeEventListener('click', handleClick);
  };
}
