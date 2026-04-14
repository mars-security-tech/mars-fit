/**
 * MARS FIT v3 — Vista Nutrition (completa)
 *
 * 4 tabs: RESUMEN | REGISTRO | PLAN | COMPRA
 * Inspirada en MacroFactor + MyFitnessPal + Cronometer
 *
 * - Donut de macros P/C/F
 * - Ring de kcal objetivo
 * - Registro: foto IA, buscar, entrada rapida, favoritos, barcode
 * - Plan de dieta con selector de chips
 * - Lista de compra con checkboxes
 */

import { icon } from '../icons.js';
import { renderDonut, renderBarChart, renderRingProgress, animateCounter } from '../charts-v3.js';
import { getState, setState, subscribe, computeMacros, today } from '../../../js/store.js';
import { DIETS } from '../../../data/diets.js';
import { analyzeMealPhoto } from '../../../js/ai.js';
import { buildShoppingList } from '../../../js/shopping.js';

/* ── Helpers ──────────────────────────────────────────────── */

const MEAL_SLOTS = [
  { key: 'desayuno',  label: 'Desayuno',  icon: 'flame',      time: '07:00', color: '#F59E0B' },
  { key: 'almuerzo',  label: 'Almuerzo',  icon: 'fork',       time: '13:00', color: '#00E676' },
  { key: 'merienda',  label: 'Merienda',  icon: 'apple',      time: '17:00', color: '#3B82F6' },
  { key: 'cena',      label: 'Cena',      icon: 'sleep-moon', time: '21:00', color: '#8B5CF6' },
];

const MACRO_COLORS = {
  protein: '#00E676',
  carbs:   '#3B82F6',
  fats:    '#FFD600',
};

const CATEGORY_LABELS = {
  proteinas:      'Proteinas',
  vegetales:      'Vegetales',
  carbohidratos:  'Carbohidratos',
  grasas:         'Grasas saludables',
  despensa:       'Despensa',
  otros:          'Otros',
};

function fmtDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const days = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

function todayMeals() {
  const st = getState();
  return (st.meals || []).filter(m => m.date === today());
}

function todayTotals() {
  const meals = todayMeals();
  return meals.reduce((acc, m) => ({
    kcal:     acc.kcal + (m.kcal || 0),
    proteinG: acc.proteinG + (m.proteinG || 0),
    carbsG:   acc.carbsG + (m.carbsG || 0),
    fatsG:    acc.fatsG + (m.fatsG || 0),
  }), { kcal: 0, proteinG: 0, carbsG: 0, fatsG: 0 });
}

function getTargetMacros() {
  const st = getState();
  const diet = DIETS[st.dietId] || Object.values(DIETS)[0];
  return computeMacros(st.profile, diet?.macros);
}

function last7DaysKcal() {
  const st = getState();
  const meals = st.meals || [];
  const days = [];
  const labels = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const dayLabel = ['Dom','Lun','Mar','Mie','Jue','Vie','Sab'][d.getDay()];
    labels.push(dayLabel);
    const total = meals.filter(m => m.date === key).reduce((s, m) => s + (m.kcal || 0), 0);
    days.push(total);
  }
  return { data: days, labels };
}

function getFavMeals() {
  const st = getState();
  return st.favMeals || [];
}

function saveFavMeal(meal) {
  const st = getState();
  const favs = st.favMeals || [];
  const exists = favs.find(f => f.name === meal.name);
  if (!exists) {
    setState({ favMeals: [...favs, { name: meal.name, items: meal.items, kcal: meal.kcal, proteinG: meal.proteinG, carbsG: meal.carbsG, fatsG: meal.fatsG }] });
  }
}

function removeFavMeal(name) {
  const st = getState();
  setState({ favMeals: (st.favMeals || []).filter(f => f.name !== name) });
}

function addMeal(meal) {
  const st = getState();
  const meals = [...(st.meals || []), { ...meal, date: today(), timestamp: Date.now() }];
  setState({ meals });
}

/* ── Main Render ─────────────────────────────────────────── */

/**
 * @param {HTMLElement} root
 * @param {object} ctx - { navigate }
 * @returns {function} cleanup
 */
export function render(root, ctx) {
  const { navigate } = ctx || {};
  let activeTab = 'resumen';
  let unsub = null;
  const cleanups = [];

  function renderView() {
    root.innerHTML = `
      <section class="view view--nutrition" data-view="nutrition" style="padding-bottom:var(--space-24);">

        <!-- Tab chips -->
        <nav class="nut-tabs" style="display:flex;gap:var(--space-2);padding:var(--space-4) var(--space-4) 0;overflow-x:auto;" role="tablist" aria-label="Secciones de nutricion">
          ${['resumen','registro','plan','compra'].map(t => `
            <button class="chip chip--clickable ${activeTab === t ? 'chip--active' : ''}"
                    role="tab" aria-selected="${activeTab === t}" data-tab="${t}">
              ${t === 'resumen' ? icon('chart', 14) : ''}
              ${t === 'registro' ? icon('plus', 14) : ''}
              ${t === 'plan' ? icon('fork', 14) : ''}
              ${t === 'compra' ? icon('check', 14) : ''}
              ${t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          `).join('')}
        </nav>

        <!-- Tab content -->
        <div class="nut-content" style="padding:var(--space-4);">
          ${activeTab === 'resumen'  ? renderResumen()  : ''}
          ${activeTab === 'registro' ? renderRegistro() : ''}
          ${activeTab === 'plan'     ? renderPlan()     : ''}
          ${activeTab === 'compra'   ? renderCompra()   : ''}
        </div>
      </section>
    `;

    bindTabClicks();

    if (activeTab === 'resumen')  bindResumen();
    if (activeTab === 'registro') bindRegistro();
    if (activeTab === 'plan')     bindPlan();
    if (activeTab === 'compra')   bindCompra();
  }

  /* ── TAB: RESUMEN ───────────────────────────────────────── */

  function renderResumen() {
    const target = getTargetMacros();
    const eaten = todayTotals();
    const remaining = Math.max(0, target.kcal - eaten.kcal);
    const pctKcal = target.kcal > 0 ? Math.round((eaten.kcal / target.kcal) * 100) : 0;
    const meals = todayMeals();

    return `
      <!-- Date header -->
      <div style="margin-bottom:var(--space-4);">
        <h3 style="font-size:var(--text-lg);text-transform:uppercase;letter-spacing:0.06em;color:var(--text-secondary);">
          ${icon('calendar', 16)} HOY · ${fmtDate(today())}
        </h3>
      </div>

      <!-- Kcal ring + macro donut -->
      <div class="card-glow" style="margin-bottom:var(--space-4);">
        <div style="display:flex;align-items:center;gap:var(--space-6);flex-wrap:wrap;">
          <!-- Ring progress kcal -->
          <div id="nut-ring" style="flex-shrink:0;"></div>

          <!-- Numeric summary -->
          <div style="flex:1;min-width:140px;">
            <div style="margin-bottom:var(--space-3);">
              <span class="input-label">Objetivo</span>
              <span class="stat-number stat-number--sm" id="nut-target-kcal">0</span>
              <span class="metric-card__unit">kcal</span>
            </div>
            <div style="margin-bottom:var(--space-3);">
              <span class="input-label">Consumido</span>
              <span class="stat-number stat-number--sm stat-number--color" id="nut-eaten-kcal">0</span>
              <span class="metric-card__unit">kcal</span>
            </div>
            <div>
              <span class="input-label">Restante</span>
              <span class="stat-number stat-number--sm" id="nut-remain-kcal" style="color:var(--color-nutrition);">0</span>
              <span class="metric-card__unit">kcal</span>
            </div>
          </div>
        </div>

        <!-- Overall kcal progress bar -->
        <div style="margin-top:var(--space-4);">
          <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-1);">
            <span style="font-size:var(--text-xs);color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.04em;">Progreso calorico</span>
            <span style="font-size:var(--text-xs);color:var(--text-secondary);font-weight:var(--weight-semibold);">${pctKcal}%</span>
          </div>
          <div class="progress-bar progress-bar--nutrition">
            <div class="progress-bar__fill" style="width:${Math.min(pctKcal, 100)}%;"></div>
          </div>
        </div>

        <!-- Macro donut -->
        <div id="nut-donut" style="display:flex;flex-direction:column;align-items:center;margin-top:var(--space-6);padding:var(--space-4);border-radius:var(--radius-lg);background:radial-gradient(circle at center, var(--bg-surface-raised) 0%, transparent 70%);"></div>

        <!-- Macro bars -->
        <div style="display:flex;flex-direction:column;gap:var(--space-3);margin-top:var(--space-4);">
          ${renderMacroBar('Proteina', eaten.proteinG, target.proteinG, MACRO_COLORS.protein)}
          ${renderMacroBar('Carbohidratos', eaten.carbsG, target.carbsG, MACRO_COLORS.carbs)}
          ${renderMacroBar('Grasas', eaten.fatsG, target.fatsG, MACRO_COLORS.fats)}
        </div>
      </div>

      <!-- Meals today -->
      <div class="card-glow" style="margin-bottom:var(--space-4);">
        <div class="metric-card__header">
          <span class="metric-card__label">${icon('fork', 16)} Comidas de hoy</span>
          <span class="chip chip--success" style="font-size:11px;">${meals.length} registradas</span>
        </div>

        <div style="display:flex;flex-direction:column;gap:var(--space-2);">
          ${meals.length === 0 ? `
            <div style="text-align:center;padding:var(--space-6);color:var(--text-tertiary);">
              ${icon('fork', 32)}
              <p style="margin-top:var(--space-2);font-size:var(--text-sm);">Sin comidas registradas hoy</p>
            </div>
          ` : meals.map((m, i) => renderMealCard(m, i)).join('')}

          <button class="btn btn--secondary" style="width:100%;margin-top:var(--space-2);" data-action="go-registro">
            ${icon('plus', 16)} Registrar comida
          </button>
        </div>
      </div>

      <!-- Weekly trend -->
      <div class="card-glow">
        <div class="metric-card__header">
          <span class="metric-card__label">${icon('chart', 16)} Tendencia semanal</span>
        </div>
        <div id="nut-weekly-chart" style="min-height:200px;"></div>
      </div>
    `;
  }

  function renderMacroBar(label, current, target, color) {
    const pct = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0;
    return `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;">
          <span style="font-size:var(--text-sm);font-weight:var(--weight-semibold);color:${color};">${label}</span>
          <span style="font-size:var(--text-xs);color:var(--text-tertiary);">${current}/${target}g · ${pct}%</span>
        </div>
        <div class="progress-bar" style="background:var(--bg-surface-raised);height:8px;border-radius:4px;overflow:hidden;">
          <div class="progress-bar__fill" style="width:${pct}%;background:${color};height:100%;border-radius:4px;transition:width 0.6s cubic-bezier(0.16,1,0.3,1);"></div>
        </div>
      </div>
    `;
  }

  function renderMealCard(meal, idx) {
    const slot = MEAL_SLOTS.find(s => (meal.name || '').toLowerCase().includes(s.key)) || MEAL_SLOTS[0];
    const isFav = getFavMeals().some(f => f.name === meal.name);
    const slotColor = slot.color || '#10B981';

    return `
      <div class="card-glow" style="padding:var(--space-3) var(--space-4);cursor:default;" data-meal-idx="${idx}">
        <div style="display:flex;align-items:center;gap:var(--space-3);">
          <div style="width:36px;height:36px;border-radius:50%;background:color-mix(in srgb, ${slotColor} 15%, transparent);display:flex;align-items:center;justify-content:center;color:${slotColor};flex-shrink:0;">
            ${icon(slot.icon, 18)}
          </div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-family:var(--font-display);font-weight:var(--weight-semibold);font-size:var(--text-sm);text-transform:uppercase;">${meal.name || slot.label}</span>
              <span style="font-family:var(--font-display);font-weight:var(--weight-bold);font-size:var(--text-sm);color:var(--color-nutrition);">${meal.kcal || 0} kcal</span>
            </div>
            <div style="font-size:var(--text-xs);color:var(--text-tertiary);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              ${(meal.items || []).join(', ') || 'Sin detalle'}
            </div>
            <div style="display:flex;gap:var(--space-3);margin-top:4px;font-size:11px;color:var(--text-tertiary);">
              <span style="color:${MACRO_COLORS.protein};">P ${meal.proteinG || 0}g</span>
              <span style="color:${MACRO_COLORS.carbs};">C ${meal.carbsG || 0}g</span>
              <span style="color:${MACRO_COLORS.fats};">F ${meal.fatsG || 0}g</span>
            </div>
          </div>
          <button class="btn btn--ghost btn--icon btn--sm" data-action="fav-meal" data-meal-idx="${idx}" title="${isFav ? 'Ya es favorita' : 'Guardar como favorita'}" style="color:${isFav ? 'var(--color-warning)' : 'var(--text-tertiary)'};">
            ${icon('star', 16)}
          </button>
        </div>
      </div>
    `;
  }

  function bindResumen() {
    const target = getTargetMacros();
    const eaten = todayTotals();
    const pctKcal = target.kcal > 0 ? Math.round((eaten.kcal / target.kcal) * 100) : 0;

    // Ring progress
    const ringEl = root.querySelector('#nut-ring');
    if (ringEl) {
      renderRingProgress(ringEl, pctKcal, '#10B981', 'kcal', { size: 130, strokeWidth: 10 });
    }

    // Donut
    const donutEl = root.querySelector('#nut-donut');
    if (donutEl) {
      renderDonut(donutEl, [
        { value: eaten.proteinG || 1, color: MACRO_COLORS.protein, label: 'Proteina' },
        { value: eaten.carbsG || 1,   color: MACRO_COLORS.carbs,   label: 'Carbohidratos' },
        { value: eaten.fatsG || 1,    color: MACRO_COLORS.fats,    label: 'Grasas' },
      ], { size: 140, strokeWidth: 20, centerLabel: 'MACROS' });
    }

    // Animated counters
    const targetEl = root.querySelector('#nut-target-kcal');
    const eatenEl = root.querySelector('#nut-eaten-kcal');
    const remainEl = root.querySelector('#nut-remain-kcal');
    if (targetEl) animateCounter(targetEl, target.kcal);
    if (eatenEl)  animateCounter(eatenEl, eaten.kcal);
    if (remainEl) animateCounter(remainEl, Math.max(0, target.kcal - eaten.kcal));

    // Weekly chart
    const chartEl = root.querySelector('#nut-weekly-chart');
    if (chartEl) {
      const week = last7DaysKcal();
      renderBarChart(chartEl, week.data, '#10B981', week.labels, { height: 180 });
    }

    // Go to registro tab
    root.querySelectorAll('[data-action="go-registro"]').forEach(btn => {
      btn.addEventListener('click', () => { activeTab = 'registro'; renderView(); });
    });

    // Fav meal
    root.querySelectorAll('[data-action="fav-meal"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.mealIdx);
        const meals = todayMeals();
        if (meals[idx]) {
          saveFavMeal(meals[idx]);
          renderView();
        }
      });
    });
  }

  /* ── TAB: REGISTRO ──────────────────────────────────────── */

  function renderRegistro() {
    return `
      <h3 style="font-size:var(--text-lg);text-transform:uppercase;letter-spacing:0.06em;color:var(--text-secondary);margin-bottom:var(--space-4);">
        ${icon('plus', 16)} Registrar comida
      </h3>

      <!-- 5 methods grid (2 columns) -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);margin-bottom:var(--space-6);">
        <button class="card-glow card-glow--hover" style="padding:var(--space-4);text-align:center;cursor:pointer;border:none;transition:transform 0.2s ease,box-shadow 0.2s ease;" data-method="foto">
          <div style="width:48px;height:48px;border-radius:50%;background:color-mix(in srgb, #00E676 15%, transparent);display:flex;align-items:center;justify-content:center;color:#00E676;margin:0 auto var(--space-2);">
            ${icon('camera', 24)}
          </div>
          <span style="font-family:var(--font-display);font-weight:var(--weight-bold);font-size:var(--text-sm);text-transform:uppercase;color:var(--text-primary);display:block;">Foto IA</span>
          <p style="font-size:var(--text-xs);color:var(--text-tertiary);margin-top:4px;line-height:1.3;">Analiza tu plato con Claude Vision</p>
        </button>

        <button class="card-glow card-glow--hover" style="padding:var(--space-4);text-align:center;cursor:pointer;border:none;transition:transform 0.2s ease,box-shadow 0.2s ease;" data-method="buscar">
          <div style="width:48px;height:48px;border-radius:50%;background:color-mix(in srgb, #3B82F6 15%, transparent);display:flex;align-items:center;justify-content:center;color:#3B82F6;margin:0 auto var(--space-2);">
            ${icon('search', 24)}
          </div>
          <span style="font-family:var(--font-display);font-weight:var(--weight-bold);font-size:var(--text-sm);text-transform:uppercase;color:var(--text-primary);display:block;">Buscar</span>
          <p style="font-size:var(--text-xs);color:var(--text-tertiary);margin-top:4px;line-height:1.3;">Encuentra en la base de datos</p>
        </button>

        <button class="card-glow card-glow--hover" style="padding:var(--space-4);text-align:center;cursor:pointer;border:none;transition:transform 0.2s ease,box-shadow 0.2s ease;" data-method="rapida">
          <div style="width:48px;height:48px;border-radius:50%;background:color-mix(in srgb, #FFD600 15%, transparent);display:flex;align-items:center;justify-content:center;color:#FFD600;margin:0 auto var(--space-2);">
            ${icon('edit', 24)}
          </div>
          <span style="font-family:var(--font-display);font-weight:var(--weight-bold);font-size:var(--text-sm);text-transform:uppercase;color:var(--text-primary);display:block;">Rapida</span>
          <p style="font-size:var(--text-xs);color:var(--text-tertiary);margin-top:4px;line-height:1.3;">Ingresa kcal y macros manual</p>
        </button>

        <button class="card-glow card-glow--hover" style="padding:var(--space-4);text-align:center;cursor:pointer;border:none;transition:transform 0.2s ease,box-shadow 0.2s ease;" data-method="favoritos">
          <div style="width:48px;height:48px;border-radius:50%;background:color-mix(in srgb, #EC4899 15%, transparent);display:flex;align-items:center;justify-content:center;color:#EC4899;margin:0 auto var(--space-2);">
            ${icon('star', 24)}
          </div>
          <span style="font-family:var(--font-display);font-weight:var(--weight-bold);font-size:var(--text-sm);text-transform:uppercase;color:var(--text-primary);display:block;">Favoritas</span>
          <p style="font-size:var(--text-xs);color:var(--text-tertiary);margin-top:4px;line-height:1.3;">${getFavMeals().length} comidas guardadas</p>
        </button>
      </div>

      <!-- Barcode placeholder (full width, 5th card) -->
      <button class="card-glow" style="padding:var(--space-3) var(--space-4);text-align:center;cursor:pointer;border:none;width:100%;display:flex;align-items:center;justify-content:center;gap:var(--space-3);margin-bottom:var(--space-6);opacity:0.4;" disabled>
        <div style="width:36px;height:36px;border-radius:50%;background:var(--bg-surface-raised);display:flex;align-items:center;justify-content:center;color:var(--text-tertiary);">
          ${icon('eye', 18)}
        </div>
        <div style="text-align:left;">
          <span style="font-family:var(--font-display);font-weight:var(--weight-semibold);font-size:var(--text-sm);text-transform:uppercase;color:var(--text-tertiary);display:block;">Codigo de barras</span>
          <span style="font-size:var(--text-xs);color:var(--text-disabled);">Proximamente</span>
        </div>
      </button>

      <!-- Dynamic method content -->
      <div id="nut-method-content"></div>
    `;
  }

  function bindRegistro() {
    // Method buttons
    root.querySelectorAll('[data-method]').forEach(btn => {
      if (btn.disabled) return;
      btn.addEventListener('click', () => {
        const method = btn.dataset.method;
        const container = root.querySelector('#nut-method-content');
        if (!container) return;

        if (method === 'foto')      renderFotoMethod(container);
        if (method === 'buscar')    renderBuscarMethod(container);
        if (method === 'rapida')    renderRapidaMethod(container);
        if (method === 'favoritos') renderFavoritosMethod(container);
      });
    });
  }

  /* ── METODO: FOTO IA ────────────────────────────────────── */

  function renderFotoMethod(container) {
    container.innerHTML = `
      <div class="card-glow" style="text-align:center;">
        <div class="metric-card__header">
          <span class="metric-card__label">${icon('camera', 16)} Foto con IA</span>
        </div>

        <div id="nut-foto-preview" style="width:100%;min-height:160px;border-radius:var(--radius-md);background:var(--bg-surface-raised);display:flex;align-items:center;justify-content:center;margin-bottom:var(--space-4);overflow:hidden;position:relative;">
          <div style="color:var(--text-tertiary);">
            ${icon('camera', 40)}
            <p style="font-size:var(--text-sm);margin-top:var(--space-2);">Toca para seleccionar foto</p>
          </div>
        </div>

        <input type="file" id="nut-foto-input" accept="image/*" capture="environment" style="display:none;">

        <div style="display:flex;gap:var(--space-2);">
          <button class="btn btn--primary" style="flex:1;" id="nut-foto-select">
            ${icon('camera', 16)} Seleccionar foto
          </button>
          <button class="btn btn--secondary" style="flex:1;" id="nut-foto-analyze" disabled>
            ${icon('zap', 16)} Analizar
          </button>
        </div>

        <div id="nut-foto-result" style="margin-top:var(--space-4);display:none;"></div>
        <div id="nut-foto-loading" style="display:none;padding:var(--space-6);color:var(--text-tertiary);">
          ${icon('refresh', 20)} <span style="margin-left:var(--space-2);">Analizando con Claude Vision...</span>
        </div>
      </div>
    `;

    const fileInput = container.querySelector('#nut-foto-input');
    const selectBtn = container.querySelector('#nut-foto-select');
    const analyzeBtn = container.querySelector('#nut-foto-analyze');
    const preview = container.querySelector('#nut-foto-preview');
    const resultDiv = container.querySelector('#nut-foto-result');
    const loadingDiv = container.querySelector('#nut-foto-loading');
    let selectedFile = null;

    selectBtn.addEventListener('click', () => fileInput.click());
    preview.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;
      selectedFile = file;
      analyzeBtn.disabled = false;

      const reader = new FileReader();
      reader.onload = (e) => {
        preview.innerHTML = `<img src="${e.target.result}" style="width:100%;height:auto;max-height:300px;object-fit:cover;border-radius:var(--radius-md);" alt="Foto de comida">`;
      };
      reader.readAsDataURL(file);
    });

    analyzeBtn.addEventListener('click', async () => {
      if (!selectedFile) return;
      analyzeBtn.disabled = true;
      loadingDiv.style.display = 'flex';
      resultDiv.style.display = 'none';

      try {
        const result = await analyzeMealPhoto(selectedFile);
        loadingDiv.style.display = 'none';
        resultDiv.style.display = 'block';

        resultDiv.innerHTML = `
          <div style="text-align:left;">
            <h4 style="font-size:var(--text-base);margin-bottom:var(--space-2);">${result.meal_name || 'Comida detectada'}</h4>
            <div style="display:flex;gap:var(--space-3);flex-wrap:wrap;margin-bottom:var(--space-3);">
              <span class="chip chip--success">${result.kcal || 0} kcal</span>
              <span class="chip" style="border-color:${MACRO_COLORS.protein};color:${MACRO_COLORS.protein};">P ${result.protein_g || 0}g</span>
              <span class="chip" style="border-color:${MACRO_COLORS.carbs};color:${MACRO_COLORS.carbs};">C ${result.carbs_g || 0}g</span>
              <span class="chip" style="border-color:${MACRO_COLORS.fats};color:${MACRO_COLORS.fats};">F ${result.fats_g || 0}g</span>
            </div>
            ${result.items ? `<p style="font-size:var(--text-xs);color:var(--text-tertiary);margin-bottom:var(--space-3);">${result.items.join(', ')}</p>` : ''}
            ${result.confidence !== undefined ? `<p style="font-size:var(--text-xs);color:var(--text-tertiary);">Confianza: ${Math.round(result.confidence * 100)}%</p>` : ''}
            ${result.notes ? `<p style="font-size:var(--text-xs);color:var(--text-tertiary);margin-top:var(--space-1);">${result.notes}</p>` : ''}

            <!-- Meal slot selector -->
            <label class="input-label" style="margin-top:var(--space-3);">Momento del dia</label>
            <select class="input" id="nut-foto-slot" style="margin-bottom:var(--space-3);">
              ${MEAL_SLOTS.map(s => `<option value="${s.key}">${s.label}</option>`).join('')}
            </select>

            <button class="btn btn--primary" style="width:100%;" id="nut-foto-save">
              ${icon('check', 16)} Registrar comida
            </button>
          </div>
        `;

        resultDiv.querySelector('#nut-foto-save').addEventListener('click', () => {
          const slot = resultDiv.querySelector('#nut-foto-slot').value;
          const slotInfo = MEAL_SLOTS.find(s => s.key === slot) || MEAL_SLOTS[0];
          addMeal({
            name: slotInfo.label + ' - ' + (result.meal_name || 'Comida'),
            items: result.items || [],
            kcal: result.kcal || 0,
            proteinG: result.protein_g || 0,
            carbsG: result.carbs_g || 0,
            fatsG: result.fats_g || 0,
            aiSource: true,
          });
          activeTab = 'resumen';
          renderView();
        });
      } catch (err) {
        loadingDiv.style.display = 'none';
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
          <div class="chip chip--error" style="padding:var(--space-3);font-size:var(--text-sm);">
            ${icon('alert', 16)} ${err.message}
          </div>
        `;
        analyzeBtn.disabled = false;
      }
    });
  }

  /* ── METODO: BUSCAR ─────────────────────────────────────── */

  function renderBuscarMethod(container) {
    // Simple text search against diet sample foods
    const allFoods = [];
    for (const diet of Object.values(DIETS)) {
      for (const meal of diet.sample) {
        for (const item of meal.items) {
          if (!allFoods.find(f => f.name === item)) {
            allFoods.push({ name: item, dietName: diet.name });
          }
        }
      }
    }

    container.innerHTML = `
      <div class="card-glow">
        <div class="metric-card__header">
          <span class="metric-card__label">${icon('search', 16)} Buscar alimento</span>
        </div>
        <div style="position:relative;margin-bottom:var(--space-4);">
          <input type="text" class="input" id="nut-search-input" placeholder="Buscar alimento..." autocomplete="off">
        </div>
        <div id="nut-search-results" style="display:flex;flex-direction:column;gap:var(--space-2);max-height:320px;overflow-y:auto;"></div>
      </div>
    `;

    const input = container.querySelector('#nut-search-input');
    const results = container.querySelector('#nut-search-results');

    function showResults(query) {
      const q = query.toLowerCase().trim();
      if (!q) {
        results.innerHTML = allFoods.slice(0, 10).map(f => foodItem(f)).join('');
      } else {
        const filtered = allFoods.filter(f => f.name.toLowerCase().includes(q));
        results.innerHTML = filtered.length
          ? filtered.map(f => foodItem(f)).join('')
          : `<p style="text-align:center;color:var(--text-tertiary);padding:var(--space-4);font-size:var(--text-sm);">Sin resultados para "${query}"</p>`;
      }

      results.querySelectorAll('[data-food]').forEach(btn => {
        btn.addEventListener('click', () => {
          const foodName = btn.dataset.food;
          showQuickAddForFood(container, foodName);
        });
      });
    }

    function foodItem(f) {
      return `
        <button class="card-glow" style="padding:var(--space-2) var(--space-3);cursor:pointer;border:none;text-align:left;display:flex;align-items:center;gap:var(--space-3);" data-food="${f.name}">
          <div style="width:28px;height:28px;border-radius:var(--radius-sm);background:rgba(59,130,246,0.12);display:flex;align-items:center;justify-content:center;color:var(--color-steps);flex-shrink:0;">
            ${icon('apple', 14)}
          </div>
          <div style="flex:1;min-width:0;">
            <span style="font-size:var(--text-sm);font-weight:var(--weight-semibold);color:var(--text-primary);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${f.name}</span>
            <span style="font-size:11px;color:var(--text-tertiary);">${f.dietName}</span>
          </div>
          <span style="color:var(--text-tertiary);">${icon('chevron-right', 14)}</span>
        </button>
      `;
    }

    input.addEventListener('input', () => showResults(input.value));
    showResults('');
  }

  function showQuickAddForFood(container, foodName) {
    const methodContent = container.querySelector ? container : root.querySelector('#nut-method-content');
    if (!methodContent) return;

    methodContent.innerHTML = `
      <div class="card-glow">
        <div class="metric-card__header">
          <span class="metric-card__label">${icon('edit', 16)} ${foodName}</span>
          <button class="btn btn--ghost btn--icon btn--sm" id="nut-food-back">${icon('x', 16)}</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);margin-bottom:var(--space-4);">
          <div>
            <label class="input-label">kcal</label>
            <input type="number" class="input" id="nut-food-kcal" value="300" min="0" step="10">
          </div>
          <div>
            <label class="input-label">Proteina (g)</label>
            <input type="number" class="input" id="nut-food-prot" value="25" min="0" step="1">
          </div>
          <div>
            <label class="input-label">Carbs (g)</label>
            <input type="number" class="input" id="nut-food-carbs" value="30" min="0" step="1">
          </div>
          <div>
            <label class="input-label">Grasas (g)</label>
            <input type="number" class="input" id="nut-food-fats" value="12" min="0" step="1">
          </div>
        </div>
        <label class="input-label">Momento del dia</label>
        <select class="input" id="nut-food-slot" style="margin-bottom:var(--space-4);">
          ${MEAL_SLOTS.map(s => `<option value="${s.key}">${s.label}</option>`).join('')}
        </select>
        <button class="btn btn--primary" style="width:100%;" id="nut-food-save">
          ${icon('check', 16)} Registrar
        </button>
      </div>
    `;

    methodContent.querySelector('#nut-food-back').addEventListener('click', () => {
      renderBuscarMethod(root.querySelector('#nut-method-content'));
    });

    methodContent.querySelector('#nut-food-save').addEventListener('click', () => {
      const slot = methodContent.querySelector('#nut-food-slot').value;
      const slotInfo = MEAL_SLOTS.find(s => s.key === slot) || MEAL_SLOTS[0];
      addMeal({
        name: slotInfo.label + ' - ' + foodName,
        items: [foodName],
        kcal: parseInt(methodContent.querySelector('#nut-food-kcal').value) || 0,
        proteinG: parseInt(methodContent.querySelector('#nut-food-prot').value) || 0,
        carbsG: parseInt(methodContent.querySelector('#nut-food-carbs').value) || 0,
        fatsG: parseInt(methodContent.querySelector('#nut-food-fats').value) || 0,
      });
      activeTab = 'resumen';
      renderView();
    });
  }

  /* ── METODO: ENTRADA RAPIDA ─────────────────────────────── */

  function renderRapidaMethod(container) {
    container.innerHTML = `
      <div class="card-glow">
        <div class="metric-card__header">
          <span class="metric-card__label">${icon('edit', 16)} Entrada rapida</span>
        </div>

        <div style="margin-bottom:var(--space-3);">
          <label class="input-label">Nombre de la comida</label>
          <input type="text" class="input" id="nut-quick-name" placeholder="Ej: Pollo con arroz">
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);margin-bottom:var(--space-3);">
          <div>
            <label class="input-label">kcal</label>
            <input type="number" class="input" id="nut-quick-kcal" placeholder="0" min="0" step="10">
          </div>
          <div>
            <label class="input-label">Proteina (g)</label>
            <input type="number" class="input" id="nut-quick-prot" placeholder="0" min="0" step="1">
          </div>
          <div>
            <label class="input-label">Carbs (g)</label>
            <input type="number" class="input" id="nut-quick-carbs" placeholder="0" min="0" step="1">
          </div>
          <div>
            <label class="input-label">Grasas (g)</label>
            <input type="number" class="input" id="nut-quick-fats" placeholder="0" min="0" step="1">
          </div>
        </div>

        <label class="input-label">Momento del dia</label>
        <select class="input" id="nut-quick-slot" style="margin-bottom:var(--space-4);">
          ${MEAL_SLOTS.map(s => `<option value="${s.key}">${s.label}</option>`).join('')}
        </select>

        <button class="btn btn--primary" style="width:100%;" id="nut-quick-save">
          ${icon('check', 16)} Registrar comida
        </button>
      </div>
    `;

    container.querySelector('#nut-quick-save').addEventListener('click', () => {
      const name = container.querySelector('#nut-quick-name').value.trim();
      const slot = container.querySelector('#nut-quick-slot').value;
      const slotInfo = MEAL_SLOTS.find(s => s.key === slot) || MEAL_SLOTS[0];

      addMeal({
        name: name ? slotInfo.label + ' - ' + name : slotInfo.label,
        items: name ? [name] : [],
        kcal: parseInt(container.querySelector('#nut-quick-kcal').value) || 0,
        proteinG: parseInt(container.querySelector('#nut-quick-prot').value) || 0,
        carbsG: parseInt(container.querySelector('#nut-quick-carbs').value) || 0,
        fatsG: parseInt(container.querySelector('#nut-quick-fats').value) || 0,
      });
      activeTab = 'resumen';
      renderView();
    });
  }

  /* ── METODO: FAVORITOS ──────────────────────────────────── */

  function renderFavoritosMethod(container) {
    const favs = getFavMeals();

    container.innerHTML = `
      <div class="card-glow">
        <div class="metric-card__header">
          <span class="metric-card__label">${icon('star', 16)} Mis comidas favoritas</span>
          <span class="chip">${favs.length}</span>
        </div>

        ${favs.length === 0 ? `
          <div style="text-align:center;padding:var(--space-8);color:var(--text-tertiary);">
            ${icon('star', 32)}
            <p style="margin-top:var(--space-2);font-size:var(--text-sm);">Sin favoritas guardadas</p>
            <p style="font-size:var(--text-xs);margin-top:var(--space-1);">Registra comidas y marcalas como favoritas</p>
          </div>
        ` : `
          <div style="display:flex;flex-direction:column;gap:var(--space-2);">
            ${favs.map((f, i) => `
              <div class="card-glow" style="padding:var(--space-3) var(--space-4);">
                <div style="display:flex;align-items:center;gap:var(--space-3);">
                  <div style="width:32px;height:32px;border-radius:var(--radius-sm);background:rgba(236,72,153,0.12);display:flex;align-items:center;justify-content:center;color:var(--color-balance);flex-shrink:0;">
                    ${icon('star', 16)}
                  </div>
                  <div style="flex:1;min-width:0;">
                    <span style="font-weight:var(--weight-semibold);font-size:var(--text-sm);">${f.name}</span>
                    <div style="display:flex;gap:var(--space-2);font-size:11px;color:var(--text-tertiary);margin-top:2px;">
                      <span>${f.kcal} kcal</span>
                      <span style="color:${MACRO_COLORS.protein};">P ${f.proteinG}g</span>
                      <span style="color:${MACRO_COLORS.carbs};">C ${f.carbsG}g</span>
                      <span style="color:${MACRO_COLORS.fats};">F ${f.fatsG}g</span>
                    </div>
                  </div>
                  <div style="display:flex;gap:var(--space-1);">
                    <button class="btn btn--ghost btn--icon btn--sm" data-action="use-fav" data-fav-idx="${i}" title="Registrar">
                      ${icon('plus', 16)}
                    </button>
                    <button class="btn btn--ghost btn--icon btn--sm" data-action="del-fav" data-fav-idx="${i}" title="Eliminar" style="color:var(--color-error);">
                      ${icon('trash', 16)}
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;

    // Use fav
    container.querySelectorAll('[data-action="use-fav"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.favIdx);
        const fav = favs[idx];
        if (fav) {
          addMeal({
            name: fav.name,
            items: fav.items || [],
            kcal: fav.kcal || 0,
            proteinG: fav.proteinG || 0,
            carbsG: fav.carbsG || 0,
            fatsG: fav.fatsG || 0,
          });
          activeTab = 'resumen';
          renderView();
        }
      });
    });

    // Delete fav
    container.querySelectorAll('[data-action="del-fav"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.favIdx);
        const fav = favs[idx];
        if (fav) {
          removeFavMeal(fav.name);
          renderFavoritosMethod(container);
        }
      });
    });
  }

  /* ── TAB: PLAN ──────────────────────────────────────────── */

  function renderPlan() {
    const st = getState();
    const currentDietId = st.dietId || Object.keys(DIETS)[0];
    const diet = DIETS[currentDietId];

    return `
      <h3 style="font-size:var(--text-lg);text-transform:uppercase;letter-spacing:0.06em;color:var(--text-secondary);margin-bottom:var(--space-4);">
        ${icon('fork', 16)} Plan nutricional
      </h3>

      <!-- Diet selector chips -->
      <div style="display:flex;flex-wrap:wrap;gap:var(--space-2);margin-bottom:var(--space-6);">
        ${Object.values(DIETS).map(d => `
          <button class="chip chip--clickable ${d.id === currentDietId ? 'chip--active' : ''}" data-diet="${d.id}">
            ${d.id === currentDietId ? icon('check', 12) : ''} ${d.name}
          </button>
        `).join('')}
      </div>

      ${diet ? `
        <!-- Selected diet detail -->
        <div class="card-glow" style="margin-bottom:var(--space-4);">
          <h4 style="font-size:var(--text-base);margin-bottom:var(--space-2);">${diet.name}</h4>
          <p style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-4);line-height:var(--leading-relaxed);">${diet.desc}</p>

          <!-- Macros split -->
          <div style="display:flex;gap:var(--space-4);margin-bottom:var(--space-4);flex-wrap:wrap;">
            <div style="text-align:center;">
              <span style="font-family:var(--font-display);font-weight:var(--weight-bold);font-size:var(--text-2xl);color:${MACRO_COLORS.protein};">${Math.round(diet.macros.p * 100)}%</span>
              <span style="display:block;font-size:var(--text-xs);color:var(--text-tertiary);text-transform:uppercase;">Proteina</span>
            </div>
            <div style="text-align:center;">
              <span style="font-family:var(--font-display);font-weight:var(--weight-bold);font-size:var(--text-2xl);color:${MACRO_COLORS.carbs};">${Math.round(diet.macros.c * 100)}%</span>
              <span style="display:block;font-size:var(--text-xs);color:var(--text-tertiary);text-transform:uppercase;">Carbs</span>
            </div>
            <div style="text-align:center;">
              <span style="font-family:var(--font-display);font-weight:var(--weight-bold);font-size:var(--text-2xl);color:${MACRO_COLORS.fats};">${Math.round(diet.macros.f * 100)}%</span>
              <span style="display:block;font-size:var(--text-xs);color:var(--text-tertiary);text-transform:uppercase;">Grasa</span>
            </div>
          </div>

          <!-- Computed macro grams -->
          <div style="padding:var(--space-3);background:var(--bg-surface-raised);border-radius:var(--radius-sm);margin-bottom:var(--space-4);">
            ${(() => {
              const macros = computeMacros(st.profile, diet.macros);
              return `
                <div style="font-size:var(--text-sm);color:var(--text-secondary);display:flex;flex-wrap:wrap;gap:var(--space-4);">
                  <span>${icon('flame', 14)} <strong>${macros.kcal}</strong> kcal/dia</span>
                  <span style="color:${MACRO_COLORS.protein};">P <strong>${macros.proteinG}g</strong></span>
                  <span style="color:${MACRO_COLORS.carbs};">C <strong>${macros.carbsG}g</strong></span>
                  <span style="color:${MACRO_COLORS.fats};">F <strong>${macros.fatsG}g</strong></span>
                </div>
              `;
            })()}
          </div>

          <!-- Rules -->
          <div style="margin-bottom:var(--space-4);">
            <span class="input-label" style="margin-bottom:var(--space-2);display:block;">Reglas</span>
            <ul style="list-style:none;display:flex;flex-direction:column;gap:var(--space-2);">
              ${diet.rules.map(r => `
                <li style="display:flex;align-items:flex-start;gap:var(--space-2);font-size:var(--text-sm);color:var(--text-secondary);">
                  <span style="color:var(--color-nutrition);flex-shrink:0;margin-top:2px;">${icon('check', 14)}</span>
                  ${r}
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Sample menu -->
          <div>
            <span class="input-label" style="margin-bottom:var(--space-2);display:block;">Menu ejemplo</span>
            <div style="display:flex;flex-direction:column;gap:var(--space-2);">
              ${diet.sample.map(s => `
                <div style="padding:var(--space-2) var(--space-3);background:var(--bg-surface-raised);border-radius:var(--radius-sm);">
                  <span style="font-weight:var(--weight-semibold);font-size:var(--text-sm);text-transform:uppercase;color:var(--color-nutrition);">${s.meal}</span>
                  <p style="font-size:var(--text-xs);color:var(--text-tertiary);margin-top:2px;">${s.items.join(' + ')}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Customize button -->
        <button class="btn btn--secondary" style="width:100%;" data-action="customize-diet">
          ${icon('settings', 16)} Personalizar
        </button>
      ` : `
        <div style="text-align:center;padding:var(--space-8);color:var(--text-tertiary);">
          ${icon('fork', 32)}
          <p style="margin-top:var(--space-2);">Selecciona un plan de dieta</p>
        </div>
      `}
    `;
  }

  function bindPlan() {
    // Diet selector
    root.querySelectorAll('[data-diet]').forEach(chip => {
      chip.addEventListener('click', () => {
        setState({ dietId: chip.dataset.diet });
        renderView();
      });
    });

    // Customize
    const custBtn = root.querySelector('[data-action="customize-diet"]');
    if (custBtn && navigate) {
      custBtn.addEventListener('click', () => navigate('diet-builder'));
    }
  }

  /* ── TAB: COMPRA ────────────────────────────────────────── */

  function renderCompra() {
    const st = getState();
    const dietId = st.dietId || Object.keys(DIETS)[0];
    const diet = DIETS[dietId];
    const list = buildShoppingList(dietId);
    const categories = Object.keys(list);

    // Local checked state
    if (!root._shopChecked) root._shopChecked = {};

    return `
      <h3 style="font-size:var(--text-lg);text-transform:uppercase;letter-spacing:0.06em;color:var(--text-secondary);margin-bottom:var(--space-2);">
        ${icon('check', 16)} Lista de compra
      </h3>
      <p style="font-size:var(--text-sm);color:var(--text-tertiary);margin-bottom:var(--space-4);">
        Basada en <strong style="color:var(--text-secondary);">${diet ? diet.name : 'tu dieta'}</strong> x 7 dias
      </p>

      ${categories.length === 0 ? `
        <div style="text-align:center;padding:var(--space-8);color:var(--text-tertiary);">
          ${icon('check', 32)}
          <p style="margin-top:var(--space-2);font-size:var(--text-sm);">Selecciona una dieta para generar la lista</p>
        </div>
      ` : `
        <div style="display:flex;flex-direction:column;gap:var(--space-4);">
          ${categories.map(cat => `
            <div class="card-glow" style="padding:var(--space-4);">
              <div class="metric-card__header" style="margin-bottom:var(--space-3);">
                <span class="metric-card__label">${CATEGORY_LABELS[cat] || cat}</span>
                <span class="chip" style="font-size:11px;">${list[cat].length}</span>
              </div>
              <div style="display:flex;flex-direction:column;gap:var(--space-2);">
                ${list[cat].map(item => {
                  const itemKey = cat + ':' + item.item;
                  const checked = !!root._shopChecked[itemKey];
                  return `
                    <label style="display:flex;align-items:center;gap:var(--space-3);cursor:pointer;padding:var(--space-1) 0;${checked ? 'opacity:0.4;' : ''}" data-shop-item="${itemKey}">
                      <span style="width:22px;height:22px;border-radius:var(--radius-sm);border:2px solid ${checked ? 'var(--color-success)' : 'var(--border-strong)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;background:${checked ? 'rgba(16,185,129,0.12)' : 'transparent'};transition:var(--transition-fast);color:var(--color-success);">
                        ${checked ? icon('check', 14) : ''}
                      </span>
                      <span style="flex:1;font-size:var(--text-sm);${checked ? 'text-decoration:line-through;' : ''}">${item.item}</span>
                      <span style="font-size:var(--text-xs);color:var(--text-tertiary);">x${item.portions}</span>
                    </label>
                  `;
                }).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Copy / Share -->
        <div style="display:flex;gap:var(--space-3);margin-top:var(--space-4);">
          <button class="btn btn--secondary" style="flex:1;" id="nut-shop-copy">
            ${icon('copy', 16)} Copiar lista
          </button>
          <button class="btn btn--secondary" style="flex:1;" id="nut-shop-share">
            ${icon('share', 16)} Compartir
          </button>
        </div>
      `}
    `;
  }

  function bindCompra() {
    if (!root._shopChecked) root._shopChecked = {};

    // Checkboxes
    root.querySelectorAll('[data-shop-item]').forEach(label => {
      label.addEventListener('click', (e) => {
        e.preventDefault();
        const key = label.dataset.shopItem;
        root._shopChecked[key] = !root._shopChecked[key];
        renderView();
      });
    });

    // Copy
    const copyBtn = root.querySelector('#nut-shop-copy');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const st = getState();
        const dietId = st.dietId || Object.keys(DIETS)[0];
        const list = buildShoppingList(dietId);
        let text = 'Lista de compra - MARS FIT\n\n';
        for (const [cat, items] of Object.entries(list)) {
          text += `${(CATEGORY_LABELS[cat] || cat).toUpperCase()}\n`;
          for (const item of items) {
            const key = cat + ':' + item.item;
            const mark = root._shopChecked[key] ? '[x]' : '[ ]';
            text += `  ${mark} ${item.item} x${item.portions}\n`;
          }
          text += '\n';
        }

        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => {
            copyBtn.innerHTML = `${icon('check', 16)} Copiada`;
            setTimeout(() => { copyBtn.innerHTML = `${icon('copy', 16)} Copiar lista`; }, 2000);
          });
        }
      });
    }

    // Share (Web Share API)
    const shareBtn = root.querySelector('#nut-shop-share');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        const st = getState();
        const dietId = st.dietId || Object.keys(DIETS)[0];
        const list = buildShoppingList(dietId);
        let text = 'Lista de compra - MARS FIT\n\n';
        for (const [cat, items] of Object.entries(list)) {
          text += `${(CATEGORY_LABELS[cat] || cat).toUpperCase()}\n`;
          for (const item of items) {
            text += `  - ${item.item} x${item.portions}\n`;
          }
          text += '\n';
        }

        if (navigator.share) {
          navigator.share({ title: 'Lista de compra MARS FIT', text });
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(text);
          shareBtn.innerHTML = `${icon('check', 16)} Copiada`;
          setTimeout(() => { shareBtn.innerHTML = `${icon('share', 16)} Compartir`; }, 2000);
        }
      });
    }
  }

  /* ── Tab Navigation ─────────────────────────────────────── */

  function bindTabClicks() {
    root.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        renderView();
      });
    });
  }

  /* ── Init ───────────────────────────────────────────────── */

  renderView();

  // Subscribe to state changes (e.g. meals added from another view)
  unsub = subscribe(() => {
    renderView();
  });

  // Cleanup
  return () => {
    if (unsub) unsub();
    cleanups.forEach(fn => fn());
  };
}

// Alias export for compatibility with existing router patterns
export { render as renderNutrition };
