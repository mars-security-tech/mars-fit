/**
 * MARS FIT v3 — Vista Exercise Library (Repositorio de ejercicios)
 *
 * Busqueda y exploracion de 180+ ejercicios.
 * Filtrado por musculo, equipamiento, tags.
 */

import { icon } from '../icons.js';
import exercises, { MUSCLE_GROUPS } from '../../data/exercises-v3.js';
import { getCustomExercises } from '../store-v3.js';

/* ─── Helpers ──────────────────────────────────────────────── */

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

/** Map muscle ID to human-readable group label */
function muscleGroupLabel(exercise) {
  const primaryMuscles = exercise.muscles?.primary || [];
  for (const [groupId, group] of Object.entries(MUSCLE_GROUPS)) {
    if (group.muscles.some(m => primaryMuscles.includes(m))) {
      return group.label;
    }
  }
  return 'Otro';
}

function muscleGroupId(exercise) {
  const primaryMuscles = exercise.muscles?.primary || [];
  for (const groupId of Object.keys(MUSCLE_GROUPS)) {
    if (MUSCLE_GROUPS[groupId].muscles.some(m => primaryMuscles.includes(m))) {
      return groupId;
    }
  }
  return null;
}

function equipmentLabel(eq) {
  const labels = {
    barbell: 'Barra', dumbbell: 'Mancuerna', cable: 'Polea', machine: 'Maquina',
    smith: 'Smith', kettlebell: 'Kettlebell', bodyweight: 'Calistenia', band: 'Banda',
    trx: 'TRX', box: 'Cajon', sled: 'Trineo', barFija: 'Barra fija', bench: 'Banco', none: 'Ninguno',
  };
  return labels[eq] || eq || '';
}

const FILTER_CHIPS = [
  { id: 'all', label: 'Todos' },
  { id: 'pecho', label: 'Pecho' },
  { id: 'espalda', label: 'Espalda' },
  { id: 'piernas', label: 'Pierna' },
  { id: 'hombros', label: 'Hombro' },
  { id: 'core', label: 'Core' },
  { id: 'brazos', label: 'Brazo' },
];

/* ─── Render ──────────────────────────────────────────────── */

/**
 * @param {HTMLElement} container
 * @param {object} ctx - {navigate, back, params, route}
 * @returns {function} cleanup
 */
export function render(container, ctx) {
  let searchQuery = '';
  let activeFilter = 'all';
  let allExercises = [...exercises];

  // Load custom exercises async and merge
  getCustomExercises().then(custom => {
    if (custom && custom.length) {
      allExercises = [...exercises, ...custom];
      renderList();
    }
  }).catch(() => {});

  function filteredExercises() {
    let list = allExercises;

    // Filter by muscle group
    if (activeFilter !== 'all') {
      const groupMuscles = MUSCLE_GROUPS[activeFilter]?.muscles || [];
      list = list.filter(ex => {
        const primary = ex.muscles?.primary || [];
        return primary.some(m => groupMuscles.includes(m));
      });
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(ex => {
        const name = (ex.name || '').toLowerCase();
        const nameEn = (ex.nameEn || '').toLowerCase();
        const equip = (ex.equipment || '').toLowerCase();
        const tags = (ex.tags || []).join(' ').toLowerCase();
        const muscles = [...(ex.muscles?.primary || []), ...(ex.muscles?.secondary || [])].join(' ').toLowerCase();
        return name.includes(q) || nameEn.includes(q) || equip.includes(q) || tags.includes(q) || muscles.includes(q);
      });
    }

    return list;
  }

  function renderList() {
    const list = filteredExercises();
    const gridEl = container.querySelector('[data-exercise-grid]');
    const emptyEl = container.querySelector('[data-empty-state]');
    const countEl = container.querySelector('[data-count]');

    if (countEl) countEl.textContent = list.length + ' ejercicios';

    if (!gridEl) return;

    if (list.length === 0) {
      gridEl.innerHTML = '';
      if (emptyEl) emptyEl.style.display = 'flex';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';

    gridEl.innerHTML = list.map(ex => {
      const group = muscleGroupLabel(ex);
      const equip = equipmentLabel(ex.equipment);
      return `
        <button class="card-glow" data-exercise-id="${escapeHtml(ex.id)}"
                style="padding:var(--space-3);text-align:left;cursor:pointer;border:none;width:100%;display:block;">
          <div class="font-display text-sm text-primary uppercase tracking" style="margin-bottom:var(--space-1);">
            ${escapeHtml(ex.name)}
          </div>
          <div class="flex gap-1 flex-wrap">
            <span class="chip text-xs" style="font-size:10px;">${escapeHtml(group)}</span>
            ${equip ? `<span class="chip text-xs" style="font-size:10px;background:rgba(180,74,255,0.1);color:#B44AFF;">${escapeHtml(equip)}</span>` : ''}
            ${ex.level ? `<span class="chip text-xs" style="font-size:10px;">${escapeHtml(ex.level)}</span>` : ''}
          </div>
        </button>
      `;
    }).join('');
  }

  // Build main HTML
  container.innerHTML = `
    <section class="view view--exercise-library" data-view="exercise-library" style="padding-bottom:var(--space-24);">

      <!-- HEADER -->
      <div class="card-glow animate-in" style="margin:var(--space-4);">
        <div class="flex items-center gap-3 mb-3">
          <button class="btn btn--ghost btn--icon" data-action="go-back" aria-label="Volver">
            ${icon('chevron-left', 20)}
          </button>
          <div>
            <h3 class="font-display text-primary uppercase tracking" style="margin:0;font-size:var(--text-xl);">
              ${icon('dumbbell', 20)} Ejercicios
            </h3>
            <p class="text-tertiary text-xs mt-1" data-count>${allExercises.length} ejercicios</p>
          </div>
        </div>

        <!-- SEARCH -->
        <div style="position:relative;">
          <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-tertiary);pointer-events:none;">
            ${icon('search', 16)}
          </span>
          <input class="input" type="search" data-search placeholder="Buscar por nombre, musculo, equipo..."
                 style="padding-left:36px;" autocomplete="off" />
        </div>
      </div>

      <!-- FILTER CHIPS -->
      <div class="animate-in animate-in--stagger-1" style="margin:0 var(--space-4);overflow-x:auto;-webkit-overflow-scrolling:touch;">
        <div class="flex gap-2" style="padding:var(--space-2) 0;" data-filter-chips>
          ${FILTER_CHIPS.map(f => `
            <button class="chip${f.id === 'all' ? ' chip--active' : ''}" data-filter="${f.id}"
                    style="white-space:nowrap;cursor:pointer;border:none;">
              ${escapeHtml(f.label)}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- EXERCISE GRID -->
      <div class="flex-col gap-2 animate-in animate-in--stagger-2" style="display:flex;margin:var(--space-2) var(--space-4);" data-exercise-grid>
      </div>

      <!-- EMPTY STATE -->
      <div data-empty-state class="flex flex-col items-center justify-center" style="display:none;min-height:30vh;padding:var(--space-8);">
        <div style="color:var(--text-tertiary);margin-bottom:var(--space-4);">${icon('search', 48)}</div>
        <p class="text-secondary text-lg font-display uppercase">Sin resultados</p>
        <p class="text-tertiary text-sm mt-2">Intenta con otro termino o filtro.</p>
      </div>

    </section>
  `;

  // Initial render
  renderList();

  // ─── Events ─────────────────────────────────────────────
  const section = container.querySelector('[data-view="exercise-library"]');
  if (!section) return () => {};

  function handleInput(e) {
    if (e.target.matches('[data-search]')) {
      searchQuery = e.target.value;
      renderList();
    }
  }

  function handleClick(e) {
    // Back button
    if (e.target.closest('[data-action="go-back"]')) {
      e.preventDefault();
      history.back();
      return;
    }

    // Filter chip
    const chip = e.target.closest('[data-filter]');
    if (chip) {
      e.preventDefault();
      activeFilter = chip.dataset.filter;
      section.querySelectorAll('[data-filter]').forEach(c => c.classList.remove('chip--active'));
      chip.classList.add('chip--active');
      renderList();
      return;
    }

    // Exercise card
    const card = e.target.closest('[data-exercise-id]');
    if (card) {
      e.preventDefault();
      const id = card.dataset.exerciseId;
      if (ctx.navigate) {
        ctx.navigate('/exercise/' + id);
      } else {
        location.hash = '#/exercise/' + id;
      }
      return;
    }
  }

  section.addEventListener('input', handleInput);
  section.addEventListener('click', handleClick);

  return () => {
    section.removeEventListener('input', handleInput);
    section.removeEventListener('click', handleClick);
  };
}
