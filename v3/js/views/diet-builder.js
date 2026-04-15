/**
 * MARS FIT v3 — Vista Diet Builder
 *
 * Crear y editar dietas personalizadas.
 * Nombre, kcal target, macro ratios, 4 slots de comida, alimentos por slot.
 */

import { icon } from '../icons.js';
import { saveCustomDiet, getCustomDiets, getConfig, computeTDEE } from '../store-v3.js';

/* ─── Helpers ──────────────────────────────────────────────── */

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

const MEAL_SLOTS = ['Desayuno', 'Comida', 'Merienda', 'Cena'];

/* ─── Render ──────────────────────────────────────────────── */

/**
 * @param {HTMLElement} container
 * @param {object} ctx - {navigate, back, params: {id?}, route}
 * @returns {function} cleanup
 */
export function render(container, ctx) {
  const dietId = ctx.params?.id;
  const isEditing = !!dietId;

  // Compute TDEE for default kcal target
  const { tdee } = computeTDEE();

  // State
  let diet = {
    id: dietId || null,
    name: '',
    kcalTarget: tdee || 2200,
    macros: { p: 30, c: 40, f: 30 },
    meals: MEAL_SLOTS.map(name => ({ name, items: [] })),
  };
  let saving = false;

  // Load existing diet if editing
  if (isEditing) {
    getCustomDiets().then(diets => {
      const found = (diets || []).find(d => d.id === dietId);
      if (found) {
        diet = { ...found };
        // Ensure meals structure
        if (!diet.meals || diet.meals.length < 4) {
          diet.meals = MEAL_SLOTS.map((name, i) => diet.meals?.[i] || { name, items: [] });
        }
        renderView();
      }
    }).catch(() => {});
  }

  function computeTotals() {
    let kcal = 0, p = 0, c = 0, f = 0;
    for (const meal of diet.meals) {
      for (const item of (meal.items || [])) {
        kcal += item.kcal || 0;
        p += item.p || 0;
        c += item.c || 0;
        f += item.f || 0;
      }
    }
    return { kcal: Math.round(kcal), p: Math.round(p), c: Math.round(c), f: Math.round(f) };
  }

  function renderView() {
    const totals = computeTotals();
    const kcalPct = diet.kcalTarget > 0 ? Math.round((totals.kcal / diet.kcalTarget) * 100) : 0;

    container.innerHTML = `
      <section class="view view--diet-builder" data-view="diet-builder" style="padding-bottom:var(--space-24);">

        <!-- HEADER -->
        <div class="card-glow animate-in" style="margin:var(--space-4);">
          <div class="flex items-center gap-3 mb-3">
            <button class="btn btn--ghost btn--icon" data-action="go-back" aria-label="Volver">
              ${icon('chevron-left', 20)}
            </button>
            <h3 class="font-display text-primary uppercase tracking" style="margin:0;font-size:var(--text-xl);">
              ${icon('apple', 20)} ${isEditing ? 'Editar dieta' : 'Nueva dieta'}
            </h3>
          </div>

          <!-- DIET NAME -->
          <div class="mb-3">
            <label class="input-label" style="text-transform:uppercase;letter-spacing:0.06em;font-size:var(--text-xs);font-weight:600;">Nombre</label>
            <input class="input" type="text" data-field="diet-name" value="${escapeHtml(diet.name)}" placeholder="Ej: Mi dieta de volumen" maxlength="80" />
          </div>

          <!-- KCAL TARGET -->
          <div class="mb-3">
            <label class="input-label" style="text-transform:uppercase;letter-spacing:0.06em;font-size:var(--text-xs);font-weight:600;">Kcal objetivo / dia</label>
            <input class="input" type="number" data-field="kcal-target" min="800" max="8000" step="50" value="${diet.kcalTarget}" />
          </div>

          <!-- MACRO RATIOS -->
          <div>
            <label class="input-label" style="text-transform:uppercase;letter-spacing:0.06em;font-size:var(--text-xs);font-weight:600;">Macros (% del total)</label>
            <div class="grid grid-cols-3 gap-2 mt-1">
              <div>
                <label class="text-xs text-tertiary" for="macro-p">Proteina</label>
                <input class="input" type="number" id="macro-p" data-field="macro-p" min="5" max="60" value="${diet.macros.p}" style="text-align:center;" />
              </div>
              <div>
                <label class="text-xs text-tertiary" for="macro-c">Carbos</label>
                <input class="input" type="number" id="macro-c" data-field="macro-c" min="5" max="70" value="${diet.macros.c}" style="text-align:center;" />
              </div>
              <div>
                <label class="text-xs text-tertiary" for="macro-f">Grasas</label>
                <input class="input" type="number" id="macro-f" data-field="macro-f" min="5" max="60" value="${diet.macros.f}" style="text-align:center;" />
              </div>
            </div>
            ${(diet.macros.p + diet.macros.c + diet.macros.f) !== 100 ? `
              <p class="text-xs mt-1" style="color:var(--color-error);">La suma debe ser 100% (actual: ${diet.macros.p + diet.macros.c + diet.macros.f}%)</p>
            ` : ''}
          </div>
        </div>

        <!-- MEAL SLOTS -->
        <div class="flex-col gap-3 animate-in animate-in--stagger-1" style="display:flex;margin:var(--space-4);">
          ${diet.meals.map((meal, mealIdx) => renderMealSlot(meal, mealIdx)).join('')}
        </div>

        <!-- TOTALS SUMMARY -->
        <div class="card-glow animate-in animate-in--stagger-2" style="margin:var(--space-4);">
          <h4 class="font-display text-sm text-primary uppercase tracking mb-3">Resumen del dia</h4>
          <div class="grid grid-cols-2 gap-3">
            <div style="padding:var(--space-2);border-radius:var(--radius-md);background:rgba(218,7,4,0.06);">
              <span class="text-xs text-tertiary uppercase">Kcal</span>
              <div class="font-display text-mars" style="font-size:var(--text-xl);">${totals.kcal} <span class="text-xs text-tertiary">/ ${diet.kcalTarget}</span></div>
              <div class="progress-bar progress-bar--thin mt-1" style="overflow:hidden;border-radius:4px;">
                <div style="width:${Math.min(kcalPct, 100)}%;height:100%;background:var(--mars-red);border-radius:4px;transition:width 0.3s;"></div>
              </div>
            </div>
            <div class="flex-col gap-1" style="display:flex;">
              <div class="flex items-center justify-between text-xs">
                <span class="text-tertiary">Proteina</span>
                <span class="text-primary font-display">${totals.p}g</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-tertiary">Carbos</span>
                <span class="text-primary font-display">${totals.c}g</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-tertiary">Grasas</span>
                <span class="text-primary font-display">${totals.f}g</span>
              </div>
            </div>
          </div>
        </div>

        <!-- SAVE -->
        <div style="margin:var(--space-4);">
          <button class="btn btn--primary btn--lg w-full" data-action="save-diet" ${saving ? 'disabled' : ''}>
            ${icon('check', 18)} ${saving ? 'GUARDANDO...' : 'GUARDAR DIETA'}
          </button>
        </div>

      </section>
    `;

    bindEvents();
  }

  function renderMealSlot(meal, mealIdx) {
    const mealKcal = (meal.items || []).reduce((s, i) => s + (i.kcal || 0), 0);

    return `
      <div class="card-glow" style="padding:var(--space-3);margin:0;">
        <div class="flex items-center justify-between mb-2">
          <span class="font-display text-sm text-primary uppercase">${escapeHtml(meal.name)}</span>
          <span class="chip text-xs" style="font-size:10px;">${Math.round(mealKcal)} kcal</span>
        </div>

        <div class="flex-col gap-2" style="display:flex;">
          ${(meal.items || []).length === 0 ? `
            <p class="text-tertiary text-xs text-center" style="padding:var(--space-2);">Sin alimentos.</p>
          ` : (meal.items || []).map((item, itemIdx) => `
            <div class="flex items-center gap-2" style="padding:var(--space-2);border-radius:var(--radius-sm);background:var(--bg-surface-raised);">
              <div class="flex-1" style="min-width:0;">
                <div class="text-xs text-primary" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(item.food || '')}</div>
                <div class="text-xs text-tertiary">${item.g || 0}g | ${item.kcal || 0} kcal | P:${item.p || 0} C:${item.c || 0} G:${item.f || 0}</div>
              </div>
              <button class="btn btn--ghost btn--icon" data-action="remove-food" data-meal-idx="${mealIdx}" data-item-idx="${itemIdx}" style="color:var(--color-destructive);" title="Eliminar">
                ${icon('x', 14)}
              </button>
            </div>
          `).join('')}
        </div>

        <!-- ADD FOOD FORM -->
        <div class="mt-2" style="padding-top:var(--space-2);border-top:1px solid var(--border-default);">
          <div class="flex-col gap-1" style="display:flex;">
            <input class="input" type="text" data-food-name="${mealIdx}" placeholder="Alimento" maxlength="80" style="font-size:var(--text-xs);padding:var(--space-1) var(--space-2);" />
            <div class="grid grid-cols-4 gap-1">
              <input class="input" type="number" data-food-g="${mealIdx}" placeholder="g" min="0" step="1" style="font-size:var(--text-xs);padding:var(--space-1);text-align:center;" />
              <input class="input" type="number" data-food-kcal="${mealIdx}" placeholder="kcal" min="0" step="1" style="font-size:var(--text-xs);padding:var(--space-1);text-align:center;" />
              <input class="input" type="number" data-food-p="${mealIdx}" placeholder="P(g)" min="0" step="0.1" style="font-size:var(--text-xs);padding:var(--space-1);text-align:center;" />
              <input class="input" type="number" data-food-c="${mealIdx}" placeholder="C(g)" min="0" step="0.1" style="font-size:var(--text-xs);padding:var(--space-1);text-align:center;" />
            </div>
            <div class="grid grid-cols-4 gap-1">
              <input class="input" type="number" data-food-f="${mealIdx}" placeholder="G(g)" min="0" step="0.1" style="font-size:var(--text-xs);padding:var(--space-1);text-align:center;" />
              <div style="grid-column:span 3;">
                <button class="btn btn--ghost btn--sm w-full" data-action="add-food" data-meal-idx="${mealIdx}" style="font-size:11px;">
                  ${icon('plus', 12)} Anadir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function syncInputs() {
    const nameInput = container.querySelector('[data-field="diet-name"]');
    if (nameInput) diet.name = nameInput.value;

    const kcalInput = container.querySelector('[data-field="kcal-target"]');
    if (kcalInput) diet.kcalTarget = parseInt(kcalInput.value, 10) || 2200;

    const pInput = container.querySelector('[data-field="macro-p"]');
    const cInput = container.querySelector('[data-field="macro-c"]');
    const fInput = container.querySelector('[data-field="macro-f"]');
    if (pInput) diet.macros.p = parseInt(pInput.value, 10) || 30;
    if (cInput) diet.macros.c = parseInt(cInput.value, 10) || 40;
    if (fInput) diet.macros.f = parseInt(fInput.value, 10) || 30;
  }

  function bindEvents() {
    const section = container.querySelector('[data-view="diet-builder"]');
    if (!section) return;
    section.addEventListener('click', handleClick);
  }

  function handleClick(e) {
    if (e.target.closest('[data-action="go-back"]')) {
      e.preventDefault();
      history.back();
      return;
    }

    // Add food
    const addFoodBtn = e.target.closest('[data-action="add-food"]');
    if (addFoodBtn) {
      e.preventDefault();
      syncInputs();
      const mealIdx = parseInt(addFoodBtn.dataset.mealIdx, 10);
      const section = container.querySelector('[data-view="diet-builder"]');
      const food = section.querySelector(`[data-food-name="${mealIdx}"]`)?.value?.trim();
      const g = parseFloat(section.querySelector(`[data-food-g="${mealIdx}"]`)?.value) || 0;
      const kcal = parseFloat(section.querySelector(`[data-food-kcal="${mealIdx}"]`)?.value) || 0;
      const p = parseFloat(section.querySelector(`[data-food-p="${mealIdx}"]`)?.value) || 0;
      const c = parseFloat(section.querySelector(`[data-food-c="${mealIdx}"]`)?.value) || 0;
      const f = parseFloat(section.querySelector(`[data-food-f="${mealIdx}"]`)?.value) || 0;

      if (!food) return;

      if (!diet.meals[mealIdx]) return;
      if (!diet.meals[mealIdx].items) diet.meals[mealIdx].items = [];
      diet.meals[mealIdx].items.push({ food, g, kcal, p, c, f });
      renderView();
      return;
    }

    // Remove food
    const removeFoodBtn = e.target.closest('[data-action="remove-food"]');
    if (removeFoodBtn) {
      e.preventDefault();
      syncInputs();
      const mealIdx = parseInt(removeFoodBtn.dataset.mealIdx, 10);
      const itemIdx = parseInt(removeFoodBtn.dataset.itemIdx, 10);
      diet.meals[mealIdx]?.items?.splice(itemIdx, 1);
      renderView();
      return;
    }

    // Save
    if (e.target.closest('[data-action="save-diet"]')) {
      e.preventDefault();
      syncInputs();
      if (!diet.name.trim()) diet.name = 'Mi dieta';
      saving = true;
      renderView();
      saveCustomDiet(diet).then(() => {
        saving = false;
        const btn = container.querySelector('[data-action="save-diet"]');
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

  // Initial render
  renderView();

  return () => {
    container.removeEventListener('click', handleClick);
  };
}
