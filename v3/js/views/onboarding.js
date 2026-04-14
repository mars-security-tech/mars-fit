/**
 * MARS FIT v3 — Onboarding Premium (4 pasos)
 *
 * Paso 1: Bienvenida (hero gradient + logo)
 * Paso 2: Datos fisicos (nombre, sexo, edad, altura, peso, actividad)
 * Paso 3: Objetivo + experiencia + equipamiento
 * Paso 4: Resumen (BMR, TDEE, macros, ring progress)
 *
 * Premium aesthetic: animated transitions, glow cards, counter animations.
 */

import { setConfig, updateProfile, getConfig, computeTDEE, computeMacros } from '../store-v3.js';
import { setOnboarded, navigate } from '../router.js';
import { icon, marsLogo } from '../icons.js';

// ============================================================
// CONSTANTES
// ============================================================

const TOTAL_STEPS = 4;

const ACTIVITY_LEVELS = [
  { value: 1.2,   label: 'Sedentario',       desc: 'Oficina, poco movimiento',  icon: 'moon' },
  { value: 1.375, label: 'Ligera',            desc: '1-3 dias/semana',           icon: 'steps' },
  { value: 1.55,  label: 'Moderada',          desc: '3-5 dias/semana',           icon: 'run' },
  { value: 1.725, label: 'Intensa',           desc: '6-7 dias/semana',           icon: 'flame' },
  { value: 1.9,   label: 'Muy intensa',       desc: 'Atleta / doble sesion',     icon: 'zap' },
];

const GOALS = [
  { value: 'volumen',        label: 'Volumen',        icon: 'dumbbell' },
  { value: 'definicion',     label: 'Definicion',     icon: 'flame' },
  { value: 'mantenimiento',  label: 'Mantenimiento',  icon: 'shield' },
  { value: 'rendimiento',    label: 'Rendimiento',    icon: 'zap' },
  { value: 'turnos_largos',  label: 'Turnos largos',  icon: 'clock' },
  { value: 'estabilidad',    label: 'Estabilidad',    icon: 'heart' },
];

const EXPERIENCE = [
  { value: 'principiante', label: 'Principiante', icon: 'star' },
  { value: 'intermedio',   label: 'Intermedio',   icon: 'target' },
  { value: 'avanzado',     label: 'Avanzado',     icon: 'trophy' },
];

const EQUIPMENT = [
  { value: 'gym',   label: 'Gimnasio completo', icon: 'dumbbell' },
  { value: 'casa',  label: 'Casa / minimal',    icon: 'home' },
  { value: 'mixto', label: 'Mixto',             icon: 'refresh' },
];


// ============================================================
// HELPERS
// ============================================================

// Logo uses inline SVG via marsLogo() — adapts to theme automatically

/** Animate a number counting up in a target element */
function animateCounter(el, target, duration = 800) {
  const start = 0;
  const startTime = performance.now();
  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out-expo
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = Math.round(start + (target - start) * eased);
    el.textContent = current;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ============================================================
// RENDER PRINCIPAL
// ============================================================

/**
 * @param {HTMLElement} container
 * @param {object} ctx
 * @returns {function} cleanup
 */
export function render(container, ctx) {
  let step = 1;
  let data = {
    name: '',
    sex: 'm',
    age: 30,
    heightCm: 178,
    weightKg: 80,
    activity: 1.55,
    goal: 'volumen',
    experience: 'intermedio',
    equipment: 'gym',
  };

  // Contenedor principal
  container.innerHTML = `
    <div class="onboarding">
      <div class="onboarding__progress"></div>
      <div class="onboarding__body"></div>
    </div>
  `;

  const progressEl = container.querySelector('.onboarding__progress');
  const bodyEl = container.querySelector('.onboarding__body');

  function renderProgress() {
    // Hide progress on welcome step
    if (step === 1) {
      progressEl.innerHTML = '';
      progressEl.style.display = 'none';
      return;
    }
    progressEl.style.display = '';

    const pct = ((step - 1) / (TOTAL_STEPS - 1)) * 100;
    progressEl.innerHTML = `
      <div class="progress-bar progress-bar--thin" style="margin:0 var(--space-6);">
        <div class="progress-bar__fill" style="width:${pct}%"></div>
      </div>
      <div class="onboarding__dots">
        ${Array.from({ length: TOTAL_STEPS }, (_, i) => `
          <span class="onboarding__dot ${i < step ? 'onboarding__dot--filled' : ''} ${i === step - 1 ? 'onboarding__dot--current' : ''}"></span>
        `).join('')}
      </div>
    `;
  }

  function goTo(nextStep) {
    if (nextStep < 1 || nextStep > TOTAL_STEPS) return;

    const direction = nextStep > step ? 1 : -1;

    // Slide-out
    bodyEl.style.opacity = '0';
    bodyEl.style.transform = `translateX(${-24 * direction}px)`;

    setTimeout(() => {
      step = nextStep;
      renderProgress();
      renderStep();

      // Prepare slide-in position
      bodyEl.style.transform = `translateX(${24 * direction}px)`;
      bodyEl.style.transition = 'none';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bodyEl.style.transition = '';
          bodyEl.style.opacity = '1';
          bodyEl.style.transform = 'translateX(0)';
        });
      });
    }, 180);
  }

  function goNext() { goTo(step + 1); }
  function goBack() { goTo(step - 1); }

  // ============================================================
  // STEP RENDERERS
  // ============================================================

  function renderStep() {
    switch (step) {
      case 1: renderStep1(); break;
      case 2: renderStep2(); break;
      case 3: renderStep3(); break;
      case 4: renderStep4(); break;
    }
  }

  // --- PASO 1: BIENVENIDA ---
  function renderStep1() {
    bodyEl.innerHTML = `
      <div class="onboarding__hero hero-gradient" style="min-height:100dvh;justify-content:center;align-items:center;text-align:center">
        <div class="hero-gradient__content flex flex-col items-center gap-6">
          <div class="onboarding__logo animate-in">
            ${marsLogo(100, 'mars-logo-svg onboarding-logo-svg')}
          </div>
          <div class="animate-in animate-in--stagger-1">
            <h1 class="onboarding__welcome-title">
              M<span class="text-mars">A</span>RS FIT
            </h1>
            <p class="text-secondary text-lg animate-in animate-in--stagger-2" style="max-width:300px;margin:var(--space-2) auto 0;">
              Configura tu perfil para personalizar entrenamientos, nutricion y objetivos.
            </p>
          </div>
          <button class="btn btn--primary btn--lg btn--pill animate-in animate-in--stagger-3" data-action="next" style="min-width:200px;">
            EMPEZAR ${icon('chevron-right', 18)}
          </button>
        </div>
      </div>
    `;
    bindAction(bodyEl);
  }

  // --- PASO 2: DATOS FISICOS ---
  function renderStep2() {
    bodyEl.innerHTML = `
      <div class="onboarding__step page-content">
        <div class="container">
          <div class="animate-in">
            <span class="chip chip--active mb-4">${icon('target', 12)} Paso 2 de ${TOTAL_STEPS}</span>
            <h2 class="mb-2">Datos Fisicos</h2>
            <p class="text-secondary mb-6">Para calcular tus necesidades nutricionales</p>
          </div>

          <div class="flex flex-col gap-4">
            <!-- Nombre -->
            <div class="animate-in animate-in--stagger-1">
              <label class="input-label" for="ob-name">${icon('user-plus', 14)} Nombre</label>
              <input id="ob-name" type="text" class="input" placeholder="Tu nombre" value="${data.name}" autocomplete="given-name">
            </div>

            <!-- Sexo -->
            <div class="animate-in animate-in--stagger-2">
              <label class="input-label">Sexo</label>
              <div class="grid grid-cols-2 gap-3">
                <button class="btn ${data.sex === 'm' ? 'btn--primary' : 'btn--secondary'} w-full" data-sex="m">
                  Masculino
                </button>
                <button class="btn ${data.sex === 'f' ? 'btn--primary' : 'btn--secondary'} w-full" data-sex="f">
                  Femenino
                </button>
              </div>
            </div>

            <!-- Edad, Altura, Peso in a 3-col grid -->
            <div class="grid grid-cols-3 gap-3 animate-in animate-in--stagger-3">
              <div>
                <label class="input-label" for="ob-age">Edad</label>
                <input id="ob-age" type="number" class="input text-center" min="14" max="80" value="${data.age}">
              </div>
              <div>
                <label class="input-label" for="ob-height">Altura (cm)</label>
                <input id="ob-height" type="number" class="input text-center" min="140" max="220" value="${data.heightCm}">
              </div>
              <div>
                <label class="input-label" for="ob-weight">Peso (kg)</label>
                <input id="ob-weight" type="number" class="input text-center" min="40" max="200" step="0.1" value="${data.weightKg}">
              </div>
            </div>

            <!-- Nivel de Actividad -->
            <div class="animate-in animate-in--stagger-4">
              <label class="input-label mb-3">${icon('flame', 14)} Nivel de Actividad</label>
              <div class="flex flex-col gap-2">
                ${ACTIVITY_LEVELS.map(a => `
                  <label class="onboarding__radio-card ${data.activity === a.value ? 'onboarding__radio-card--selected' : ''}" data-activity="${a.value}">
                    <span class="onboarding__radio-icon">${icon(a.icon, 16)}</span>
                    <div class="flex-1">
                      <span class="text-sm" style="font-weight:var(--weight-semibold)">${a.label}</span>
                      <span class="text-xs text-tertiary" style="margin-left:var(--space-2)">${a.desc}</span>
                    </div>
                    <span class="onboarding__radio-dot"></span>
                  </label>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Error -->
          <div id="step-error" class="onboarding__error hidden" role="alert">
            <span class="onboarding__error-icon">${icon('alert', 16)}</span>
            <span id="step-error-text"></span>
          </div>
        </div>

        <!-- Sticky footer -->
        <div class="onboarding__footer">
          <button class="btn btn--ghost btn--lg" data-action="back">
            ${icon('chevron-left', 18)} Atras
          </button>
          <button class="btn btn--primary btn--lg btn--pill flex-1" data-action="next">
            Continuar ${icon('chevron-right', 18)}
          </button>
        </div>
      </div>
    `;

    // Input bindings
    const nameInput = bodyEl.querySelector('#ob-name');
    const ageInput = bodyEl.querySelector('#ob-age');
    const heightInput = bodyEl.querySelector('#ob-height');
    const weightInput = bodyEl.querySelector('#ob-weight');

    nameInput.addEventListener('input', (e) => { data.name = e.target.value.trim(); });
    ageInput.addEventListener('input', (e) => { data.age = parseInt(e.target.value) || 30; });
    heightInput.addEventListener('input', (e) => { data.heightCm = parseInt(e.target.value) || 178; });
    weightInput.addEventListener('input', (e) => { data.weightKg = parseFloat(e.target.value) || 80; });

    // Sex buttons
    bodyEl.querySelectorAll('[data-sex]').forEach(btn => {
      btn.addEventListener('click', () => {
        data.sex = btn.dataset.sex;
        bodyEl.querySelectorAll('[data-sex]').forEach(b => {
          b.className = `btn ${b.dataset.sex === data.sex ? 'btn--primary' : 'btn--secondary'} w-full`;
        });
      });
    });

    // Activity radio cards
    bodyEl.querySelectorAll('[data-activity]').forEach(card => {
      card.addEventListener('click', () => {
        data.activity = parseFloat(card.dataset.activity);
        bodyEl.querySelectorAll('[data-activity]').forEach(c => {
          c.classList.toggle('onboarding__radio-card--selected', parseFloat(c.dataset.activity) === data.activity);
        });
      });
    });

    // Override next to validate
    const nextBtn = bodyEl.querySelector('[data-action="next"]');
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const errorEl = bodyEl.querySelector('#step-error');
      const errorText = bodyEl.querySelector('#step-error-text');

      if (!data.name) {
        errorText.textContent = 'Ingresa tu nombre';
        errorEl.classList.remove('hidden');
        nameInput.classList.add('input--error');
        nameInput.focus();
        return;
      }
      if (data.age < 14 || data.age > 80) {
        errorText.textContent = 'Edad debe ser entre 14 y 80';
        errorEl.classList.remove('hidden');
        return;
      }

      errorEl.classList.add('hidden');
      nameInput.classList.remove('input--error');
      goNext();
    });

    // Back button
    const backBtn = bodyEl.querySelector('[data-action="back"]');
    if (backBtn) backBtn.addEventListener('click', goBack);
  }

  // --- PASO 3: OBJETIVO + EXPERIENCIA + EQUIPAMIENTO ---
  function renderStep3() {
    bodyEl.innerHTML = `
      <div class="onboarding__step page-content">
        <div class="container">
          <div class="animate-in">
            <span class="chip chip--active mb-4">${icon('target', 12)} Paso 3 de ${TOTAL_STEPS}</span>
            <h2 class="mb-2">Tu Objetivo</h2>
            <p class="text-secondary mb-6">Personalizamos todo en base a esto</p>
          </div>

          <!-- Objetivo Principal -->
          <div class="mb-6 animate-in animate-in--stagger-1">
            <label class="input-label mb-3">${icon('target', 14)} Objetivo Principal</label>
            <div class="grid grid-cols-2 gap-3">
              ${GOALS.map(g => `
                <button class="onboarding__goal-chip ${data.goal === g.value ? 'onboarding__goal-chip--active' : ''}" data-goal="${g.value}">
                  <span class="onboarding__goal-icon">${icon(g.icon, 20)}</span>
                  <span class="onboarding__goal-label">${g.label}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Experiencia -->
          <div class="mb-6 animate-in animate-in--stagger-2">
            <label class="input-label mb-3">${icon('chart', 14)} Experiencia</label>
            <div class="grid grid-cols-3 gap-2">
              ${EXPERIENCE.map(e => `
                <button class="chip chip--clickable ${data.experience === e.value ? 'chip--active' : ''}" data-exp="${e.value}" style="justify-content:center;padding:var(--space-2) var(--space-3);">
                  ${icon(e.icon, 14)} ${e.label}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Equipamiento -->
          <div class="mb-6 animate-in animate-in--stagger-3">
            <label class="input-label mb-3">${icon('dumbbell', 14)} Equipamiento</label>
            <div class="flex flex-col gap-2">
              ${EQUIPMENT.map(e => `
                <button class="onboarding__radio-card ${data.equipment === e.value ? 'onboarding__radio-card--selected' : ''}" data-equip="${e.value}">
                  <span class="onboarding__radio-icon">${icon(e.icon, 16)}</span>
                  <span class="flex-1 text-sm" style="font-weight:var(--weight-semibold)">${e.label}</span>
                  <span class="onboarding__radio-dot"></span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Sticky footer -->
        <div class="onboarding__footer">
          <button class="btn btn--ghost btn--lg" data-action="back">
            ${icon('chevron-left', 18)} Atras
          </button>
          <button class="btn btn--primary btn--lg btn--pill flex-1" data-action="next">
            Ver Resumen ${icon('chevron-right', 18)}
          </button>
        </div>
      </div>
    `;

    // Goal chips
    bodyEl.querySelectorAll('[data-goal]').forEach(chip => {
      chip.addEventListener('click', () => {
        data.goal = chip.dataset.goal;
        bodyEl.querySelectorAll('[data-goal]').forEach(c => {
          c.classList.toggle('onboarding__goal-chip--active', c.dataset.goal === data.goal);
        });
      });
    });

    // Experience chips
    bodyEl.querySelectorAll('[data-exp]').forEach(chip => {
      chip.addEventListener('click', () => {
        data.experience = chip.dataset.exp;
        bodyEl.querySelectorAll('[data-exp]').forEach(c => {
          c.classList.toggle('chip--active', c.dataset.exp === data.experience);
        });
      });
    });

    // Equipment chips
    bodyEl.querySelectorAll('[data-equip]').forEach(chip => {
      chip.addEventListener('click', () => {
        data.equipment = chip.dataset.equip;
        bodyEl.querySelectorAll('[data-equip]').forEach(c => {
          c.classList.toggle('onboarding__radio-card--selected', c.dataset.equip === data.equipment);
        });
      });
    });

    bindAction(bodyEl);
  }

  // --- PASO 4: RESUMEN ---
  function renderStep4() {
    const profile = {
      sex: data.sex,
      age: data.age,
      heightCm: data.heightCm,
      weightKg: data.weightKg,
      activity: data.activity,
      goal: data.goal,
    };

    const { bmr, tdee } = computeTDEE(profile);
    const macros = computeMacros(profile);

    // Ring progress: TDEE as percentage of 4000 (arbitrary max for visual)
    const ringMax = 4000;
    const ringPct = Math.min((macros.kcal / ringMax) * 100, 100);
    const circumference = 2 * Math.PI * 70; // radius 70
    const dashOffset = circumference - (circumference * ringPct / 100);

    const goalMeta = GOALS.find(g => g.value === data.goal);
    const totalMacroG = macros.proteinG + macros.carbsG + macros.fatsG;

    bodyEl.innerHTML = `
      <div class="onboarding__step page-content">
        <div class="container">
          <div class="animate-in">
            <span class="chip chip--active mb-4">${icon('check', 12)} Resumen</span>
            <h2 class="mb-2">Tu Perfil</h2>
            <p class="text-secondary mb-6">Todo listo, ${data.name} ${icon('zap', 14)}</p>
          </div>

          <!-- Ring Progress -->
          <div class="flex justify-center mb-6 animate-in animate-in--stagger-1">
            <div class="onboarding__ring" style="position:relative;width:200px;height:200px">
              <svg viewBox="0 0 160 160" width="200" height="200" style="transform:rotate(-90deg)">
                <circle cx="80" cy="80" r="70" fill="none" stroke="var(--border-default)" stroke-width="7"/>
                <circle cx="80" cy="80" r="70" fill="none" stroke="url(#marsGrad)" stroke-width="7"
                  stroke-linecap="round"
                  stroke-dasharray="${circumference}"
                  stroke-dashoffset="${circumference}"
                  class="onboarding__ring-fill"
                  style="--ring-circumference:${circumference};--ring-target:${dashOffset};animation:ringGrow 1.4s var(--ease-out-expo) 0.5s forwards"/>
                <defs>
                  <linearGradient id="marsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="var(--mars-red-light)"/>
                    <stop offset="100%" stop-color="var(--mars-red-dark)"/>
                  </linearGradient>
                </defs>
              </svg>
              <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
                <span class="stat-number stat-number--color" data-counter="${macros.kcal}">0</span>
                <span class="text-xs text-tertiary uppercase tracking" style="margin-top:var(--space-1)">kcal/dia</span>
              </div>
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-3 gap-3 mb-6 animate-in animate-in--stagger-2">
            <div class="card-glow text-center" style="padding:var(--space-4);">
              <p class="stat-number stat-number--sm text-mars" data-counter="${bmr}">0</p>
              <p class="text-xs text-tertiary uppercase mt-2">BMR</p>
            </div>
            <div class="card-glow text-center" style="padding:var(--space-4);">
              <p class="stat-number stat-number--sm" style="color:var(--color-nutrition)" data-counter="${macros.proteinG}">0</p>
              <p class="text-xs text-tertiary uppercase mt-2">${icon('fork', 10)} Proteina</p>
            </div>
            <div class="card-glow text-center" style="padding:var(--space-4);">
              <p class="stat-number stat-number--sm" style="color:var(--color-info)" data-counter="${tdee}">0</p>
              <p class="text-xs text-tertiary uppercase mt-2">TDEE</p>
            </div>
          </div>

          <!-- Macro Bars -->
          <div class="card-glow mb-6 animate-in animate-in--stagger-3" style="padding:var(--space-6);">
            <h5 class="mb-4">${icon('scale', 16)} Macros Diarios</h5>
            <div class="flex flex-col gap-4">
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm text-secondary">Proteina</span>
                  <span class="text-sm" style="font-weight:var(--weight-bold);color:var(--color-nutrition)">${macros.proteinG}g</span>
                </div>
                <div class="progress-bar progress-bar--nutrition">
                  <div class="progress-bar__fill" style="width:${(macros.proteinG / totalMacroG) * 100}%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm text-secondary">Carbohidratos</span>
                  <span class="text-sm" style="font-weight:var(--weight-bold);color:var(--color-strength)">${macros.carbsG}g</span>
                </div>
                <div class="progress-bar progress-bar--strength">
                  <div class="progress-bar__fill" style="width:${(macros.carbsG / totalMacroG) * 100}%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm text-secondary">Grasas</span>
                  <span class="text-sm" style="font-weight:var(--weight-bold);color:var(--color-balance)">${macros.fatsG}g</span>
                </div>
                <div class="progress-bar progress-bar--balance">
                  <div class="progress-bar__fill" style="width:${(macros.fatsG / totalMacroG) * 100}%"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Summary Chips -->
          <div class="flex flex-wrap gap-2 mb-6 animate-in animate-in--stagger-4">
            <span class="chip chip--active">${icon(goalMeta?.icon || 'target', 12)} ${data.goal}</span>
            <span class="chip">${icon('chart', 12)} ${data.experience}</span>
            <span class="chip">${icon('dumbbell', 12)} ${data.equipment}</span>
            <span class="chip">${icon('scale', 12)} ${data.weightKg}kg</span>
          </div>
        </div>

        <!-- Sticky footer -->
        <div class="onboarding__footer">
          <button class="btn btn--ghost btn--lg" data-action="back">
            ${icon('chevron-left', 18)} Atras
          </button>
          <button class="btn btn--primary btn--lg btn--pill flex-1 animate-in animate-in--stagger-5" id="finish-onboarding">
            ${icon('check', 18)} ACCEDER
          </button>
        </div>
      </div>
    `;

    // Animate counters after a short delay
    setTimeout(() => {
      bodyEl.querySelectorAll('[data-counter]').forEach(el => {
        const target = parseInt(el.dataset.counter);
        animateCounter(el, target, 1000);
      });
    }, 400);

    // Finish
    bodyEl.querySelector('#finish-onboarding').addEventListener('click', finishOnboarding);

    // Back
    const backBtn = bodyEl.querySelector('[data-action="back"]');
    if (backBtn) backBtn.addEventListener('click', goBack);
  }

  // ============================================================
  // HELPERS
  // ============================================================

  function bindAction(el) {
    el.querySelectorAll('[data-action="next"]').forEach(btn => {
      btn.addEventListener('click', goNext);
    });
    el.querySelectorAll('[data-action="back"]').forEach(btn => {
      btn.addEventListener('click', goBack);
    });
  }

  function finishOnboarding() {
    // Guardar perfil
    updateProfile({
      name: data.name,
      sex: data.sex,
      age: data.age,
      heightCm: data.heightCm,
      weightKg: data.weightKg,
      activity: data.activity,
      goal: data.goal,
      experience: data.experience,
      equipment: data.equipment,
    });

    // Marcar onboarded
    setConfig({ onboarded: true });
    setOnboarded(true);
  }

  // ============================================================
  // STYLES (scoped via <style> in container)
  // ============================================================

  const styleEl = document.createElement('style');
  styleEl.textContent = `
    /* --- Hidden utility --- */
    .hidden { display: none !important; }

    /* --- Layout --- */
    .onboarding {
      min-height: 100vh;
      min-height: 100dvh;
      background: var(--bg-base);
      position: relative;
    }

    /* --- Progress bar --- */
    .onboarding__progress {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: var(--z-sticky);
      padding-top: max(env(safe-area-inset-top, 0px), var(--space-3));
      background: var(--glass-bg);
      backdrop-filter: blur(16px) saturate(1.6);
      -webkit-backdrop-filter: blur(16px) saturate(1.6);
      border-bottom: 1px solid var(--border-subtle);
    }

    .onboarding__dots {
      display: flex;
      justify-content: center;
      gap: var(--space-2);
      padding: var(--space-2) 0 var(--space-3);
    }

    .onboarding__dot {
      width: 8px;
      height: 8px;
      border-radius: var(--radius-full);
      background: var(--border-default);
      transition: all 300ms var(--ease-out-expo);
    }

    .onboarding__dot--filled {
      background: var(--mars-red);
    }

    .onboarding__dot--current {
      width: 28px;
      border-radius: var(--radius-pill);
      background: var(--gradient-mars);
      box-shadow: 0 0 12px var(--mars-red-glow);
    }

    /* --- Body transitions --- */
    .onboarding__body {
      transition: opacity 180ms ease, transform 180ms var(--ease-out-expo);
    }

    /* --- Welcome logo --- */
    .onboarding__logo {
      border-radius: var(--radius-xl);
      box-shadow:
        0 0 40px var(--mars-red-glow),
        0 0 80px rgba(218, 7, 4, 0.20),
        var(--shadow-lg);
      animation: fadeSlideIn 600ms var(--ease-out-expo) both,
                 logoFloat 4s ease-in-out 1s infinite alternate;
    }

    @keyframes logoFloat {
      0%   { transform: translateY(0); }
      100% { transform: translateY(-6px); }
    }

    .onboarding__welcome-title {
      font-size: var(--text-5xl);
      letter-spacing: 0.14em;
      margin-bottom: var(--space-2);
      text-shadow: 0 0 40px rgba(218, 7, 4, 0.15);
    }

    /* --- Step content --- */
    .onboarding__step {
      padding-top: 72px;
      padding-bottom: 120px; /* footer space */
    }

    /* --- Sticky footer --- */
    .onboarding__footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-4) var(--space-6);
      padding-bottom: max(env(safe-area-inset-bottom, 0px), var(--space-4));
      background: var(--glass-bg);
      backdrop-filter: blur(16px) saturate(1.6);
      -webkit-backdrop-filter: blur(16px) saturate(1.6);
      border-top: 1px solid var(--border-subtle);
      z-index: var(--z-sticky);
    }

    /* --- Radio cards for activity / equipment --- */
    .onboarding__radio-card {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-default);
      background: var(--bg-surface);
      cursor: pointer;
      transition: all 0.2s var(--ease-out-expo);
      user-select: none;
    }

    .onboarding__radio-card:hover {
      border-color: var(--border-strong);
      background: var(--bg-surface-raised);
      transform: translateY(-1px);
    }

    .onboarding__radio-card--selected {
      border-color: var(--mars-red);
      background: rgba(218, 7, 4, 0.06);
      box-shadow: 0 0 16px rgba(218, 7, 4, 0.10);
    }

    .onboarding__radio-card--selected:hover {
      border-color: var(--mars-red-light);
    }

    .onboarding__radio-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: var(--radius-sm);
      background: var(--bg-surface-raised);
      color: var(--text-tertiary);
      flex-shrink: 0;
      transition: all 0.2s var(--ease-out-expo);
    }

    .onboarding__radio-card--selected .onboarding__radio-icon {
      background: rgba(218, 7, 4, 0.15);
      color: var(--mars-red);
    }

    .onboarding__radio-dot {
      width: 18px;
      height: 18px;
      border-radius: var(--radius-full);
      border: 2px solid var(--border-strong);
      flex-shrink: 0;
      transition: all 0.2s var(--ease-out-expo);
    }

    .onboarding__radio-card--selected .onboarding__radio-dot {
      border-color: var(--mars-red);
      background: var(--mars-red);
      box-shadow: inset 0 0 0 3px var(--bg-surface), 0 0 8px rgba(218, 7, 4, 0.30);
    }

    /* --- Goal chips (larger, 2-col grid) --- */
    .onboarding__goal-chip {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      padding: var(--space-4) var(--space-3);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-default);
      background: var(--bg-surface);
      cursor: pointer;
      transition: all 0.2s var(--ease-out-back);
      user-select: none;
      text-align: center;
    }

    .onboarding__goal-chip:hover {
      border-color: var(--border-strong);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .onboarding__goal-chip:active {
      transform: scale(0.96);
    }

    .onboarding__goal-chip--active {
      border-color: var(--mars-red);
      background: linear-gradient(135deg, rgba(218, 7, 4, 0.12), rgba(255, 23, 68, 0.08));
      box-shadow: 0 0 20px rgba(218, 7, 4, 0.15), 0 0 40px rgba(218, 7, 4, 0.05);
    }

    .onboarding__goal-chip--active:hover {
      border-color: var(--mars-red-light);
      box-shadow: 0 0 24px rgba(218, 7, 4, 0.25), 0 0 60px rgba(218, 7, 4, 0.08);
    }

    .onboarding__goal-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-sm);
      background: var(--bg-surface-raised);
      color: var(--text-tertiary);
      transition: all 0.2s var(--ease-out-expo);
    }

    .onboarding__goal-chip--active .onboarding__goal-icon {
      background: rgba(218, 7, 4, 0.18);
      color: var(--mars-red-light);
      box-shadow: 0 0 12px rgba(218, 7, 4, 0.20);
    }

    .onboarding__goal-label {
      font-family: var(--font-display);
      font-size: var(--text-xs);
      font-weight: var(--weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-secondary);
      transition: color 0.2s ease;
    }

    .onboarding__goal-chip--active .onboarding__goal-label {
      color: var(--text-primary);
    }

    /* --- Error box --- */
    .onboarding__error {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-top: var(--space-4);
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md);
      background: rgba(218, 7, 4, 0.10);
      border: 1px solid rgba(218, 7, 4, 0.20);
      color: var(--mars-red-light);
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
      animation: fadeSlideIn 300ms var(--ease-out-expo) both;
    }

    .onboarding__error.hidden {
      display: none !important;
    }

    .onboarding__error-icon {
      flex-shrink: 0;
      display: flex;
      color: var(--mars-red);
    }

    /* --- Ring animation --- */
    .onboarding__ring-fill {
      transition: stroke-dashoffset 1.4s var(--ease-out-expo);
    }

    /* --- Flex helpers --- */
    .flex.flex-col { display: flex; flex-direction: column; }
  `;
  document.head.appendChild(styleEl);

  // ============================================================
  // INIT
  // ============================================================

  renderProgress();
  renderStep();

  // Cleanup
  return () => {
    if (styleEl.parentNode) {
      styleEl.parentNode.removeChild(styleEl);
    }
  };
}
