/**
 * MARS FIT v3 — Vista Login / Register
 *
 * Formulario premium con hero gradient, card-glow, focus glow rojo.
 * Aesthetic: $9.99/mo fitness app — Whoop / Oura level polish.
 */

import { login, register, isLoggedIn, getSession, isAdmin } from '../auth.js';
import { getConfig } from '../store-v3.js';
import { setLoggedIn, setIsAdmin } from '../router.js';
import { icon, marsLogo } from '../icons.js';

// ============================================================
// HELPERS
// ============================================================

// Logo uses inline SVG via marsLogo() — adapts to theme automatically

// ============================================================
// RENDER
// ============================================================

export function render(container, ctx) {
  let mode = 'login'; // 'login' | 'register'

  function renderView() {
    container.innerHTML = `
      <div class="login-view">
        <!-- Hero Gradient Mesh -->
        <div class="login-view__hero hero-gradient">
          <div class="hero-gradient__content flex flex-col items-center gap-4" style="padding-top:max(env(safe-area-inset-top,0px),var(--space-10));">
            <div class="animate-in" style="width:120px;height:120px;border-radius:28px;background:rgba(0,0,0,0.4);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);display:flex;align-items:center;justify-content:center;box-shadow:0 0 40px rgba(218,7,4,0.3),0 8px 32px rgba(0,0,0,0.4);border:1px solid rgba(218,7,4,0.15);">
              <div class="login-view__logo" style="filter:drop-shadow(0 0 12px rgba(218,7,4,0.4));">
                ${marsLogo(80, 'mars-logo-svg login-logo-svg')}
              </div>
            </div>
            <div class="animate-in animate-in--stagger-1">
              <h1 class="login-view__title">
                M<span class="text-mars">A</span>RS FIT
              </h1>
              <p class="text-secondary text-sm" style="text-align:center;margin-top:var(--space-1);letter-spacing:0.12em;text-transform:uppercase;">
                Tu entrenamiento. Tu nutricion. Tu team.
              </p>
            </div>
          </div>
        </div>

        <!-- Form Card -->
        <div class="login-view__form-wrap animate-in animate-in--stagger-2">
          <div class="card-glow login-view__card">
            ${mode === 'login' ? renderLoginForm() : renderRegisterForm()}
          </div>
        </div>

        <!-- Footer branding -->
        <p class="login-view__footer animate-in animate-in--stagger-4">
          ${icon('shield', 14)} Datos seguros y encriptados
        </p>
      </div>
    `;

    bindEvents();
  }

  // ----------------------------------------------------------
  // LOGIN FORM
  // ----------------------------------------------------------
  function renderLoginForm() {
    return `
      <h3 class="login-view__form-title">
        ${icon('log-in', 18)} Iniciar Sesion
      </h3>

      <form data-form="login" autocomplete="off">
        <div class="flex flex-col gap-4">
          <div>
            <label class="input-label" for="login-email">Email</label>
            <input
              class="input"
              id="login-email"
              type="email"
              placeholder="tu@email.com"
              autocomplete="email"
              required
            >
          </div>

          <div>
            <label class="input-label" for="login-pass">Password</label>
            <input
              class="input"
              id="login-pass"
              type="password"
              placeholder="********"
              autocomplete="current-password"
              required
            >
          </div>

          <!-- Error message -->
          <div data-error class="login-view__error hidden" role="alert">
            <span class="login-view__error-icon">${icon('alert', 16)}</span>
            <span data-error-text></span>
          </div>

          <button type="submit" class="btn btn--primary btn--lg w-full btn--pill">
            ${icon('log-in', 18)} INICIAR SESION
          </button>
        </div>
      </form>

      <div class="login-view__switch">
        <span class="text-tertiary text-sm">No tienes cuenta?</span>
        <button class="login-view__switch-btn" data-action="switch-register">
          Registrate
        </button>
      </div>
    `;
  }

  // ----------------------------------------------------------
  // REGISTER FORM
  // ----------------------------------------------------------
  function renderRegisterForm() {
    return `
      <h3 class="login-view__form-title">
        ${icon('user-plus', 18)} Crear Cuenta
      </h3>

      <form data-form="register" autocomplete="off">
        <div class="flex flex-col gap-4">
          <div>
            <label class="input-label" for="reg-name">Nombre</label>
            <input
              class="input"
              id="reg-name"
              type="text"
              placeholder="Tu nombre"
              autocomplete="given-name"
              required
            >
          </div>

          <div>
            <label class="input-label" for="reg-email">Email</label>
            <input
              class="input"
              id="reg-email"
              type="email"
              placeholder="tu@email.com"
              autocomplete="email"
              required
            >
          </div>

          <div>
            <label class="input-label" for="reg-pass">Password</label>
            <input
              class="input"
              id="reg-pass"
              type="password"
              placeholder="Min. 6 caracteres"
              autocomplete="new-password"
              required
              minlength="6"
            >
          </div>

          <!-- Error message -->
          <div data-error class="login-view__error hidden" role="alert">
            <span class="login-view__error-icon">${icon('alert', 16)}</span>
            <span data-error-text></span>
          </div>

          <!-- Pending approval state -->
          <div data-success class="login-view__pending hidden" role="status">
            <div class="login-view__pending-icon">${icon('clock', 32)}</div>
            <p class="login-view__pending-title">Cuenta Creada</p>
            <p class="login-view__pending-text">
              Tu cuenta esta pendiente de aprobacion por el administrador. Te notificaremos cuando sea activada.
            </p>
          </div>

          <button type="submit" class="btn btn--primary btn--lg w-full btn--pill" data-submit-btn>
            ${icon('user-plus', 18)} REGISTRAR
          </button>
        </div>
      </form>

      <div class="login-view__switch">
        <span class="text-tertiary text-sm">Ya tienes cuenta?</span>
        <button class="login-view__switch-btn" data-action="switch-login">
          Inicia sesion
        </button>
      </div>
    `;
  }

  // ----------------------------------------------------------
  // ERROR HANDLING
  // ----------------------------------------------------------
  function showError(msg) {
    const el = container.querySelector('[data-error]');
    const textEl = container.querySelector('[data-error-text]');
    if (el && textEl) {
      textEl.textContent = msg;
      el.classList.remove('hidden');
    }
  }

  function hideError() {
    const el = container.querySelector('[data-error]');
    if (el) el.classList.add('hidden');
  }

  // ----------------------------------------------------------
  // EVENT BINDINGS
  // ----------------------------------------------------------
  function bindEvents() {
    // Switch mode
    const switchReg = container.querySelector('[data-action="switch-register"]');
    if (switchReg) {
      switchReg.addEventListener('click', () => { mode = 'register'; renderView(); });
    }
    const switchLogin = container.querySelector('[data-action="switch-login"]');
    if (switchLogin) {
      switchLogin.addEventListener('click', () => { mode = 'login'; renderView(); });
    }

    // Login form
    const loginForm = container.querySelector('[data-form="login"]');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        hideError();
        const email = container.querySelector('#login-email').value;
        const pass = container.querySelector('#login-pass').value;
        const result = login(email, pass);
        if (result.ok) {
          setLoggedIn(true);
          setIsAdmin(result.user.isAdmin);
          const config = getConfig();
          if (config.onboarded) {
            ctx.navigate('/home');
          } else {
            ctx.navigate('/onboarding');
          }
        } else {
          showError(result.error);
        }
      });
    }

    // Register form
    const regForm = container.querySelector('[data-form="register"]');
    if (regForm) {
      regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        hideError();
        const name = container.querySelector('#reg-name').value;
        const email = container.querySelector('#reg-email').value;
        const pass = container.querySelector('#reg-pass').value;
        const result = register(email, pass, name);
        if (result.ok) {
          const successEl = container.querySelector('[data-success]');
          if (successEl) successEl.classList.remove('hidden');
          const submitBtn = container.querySelector('[data-submit-btn]');
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `${icon('clock', 18)} PENDIENTE DE APROBACION`;
          }
        } else {
          showError(result.error);
        }
      });
    }
  }

  // ============================================================
  // SCOPED STYLES
  // ============================================================

  const styleEl = document.createElement('style');
  styleEl.textContent = `
    /* --- Hidden utility (scoped) --- */
    .login-view .hidden { display: none !important; }

    /* --- Layout --- */
    .login-view {
      min-height: 100vh;
      min-height: 100dvh;
      background: var(--bg-base);
      display: flex;
      flex-direction: column;
    }

    .login-view__hero {
      padding: var(--space-8) var(--space-4) var(--space-16);
      text-align: center;
      min-height: 320px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Logo with premium glow */
    .login-view__logo {
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

    /* Title */
    .login-view__title {
      font-size: var(--text-4xl);
      letter-spacing: 0.14em;
      margin: 0;
      text-align: center;
      text-shadow: 0 0 40px rgba(218, 7, 4, 0.15);
    }

    /* Form card wrapper */
    .login-view__form-wrap {
      margin: calc(-1 * var(--space-10)) var(--space-4) var(--space-4);
      position: relative;
      z-index: 2;
      max-width: 420px;
      align-self: center;
      width: calc(100% - var(--space-8));
    }

    .login-view__card {
      padding: var(--space-8);
    }

    /* Form title */
    .login-view__form-title {
      font-family: var(--font-display);
      font-size: var(--text-lg);
      font-weight: var(--weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-primary);
      text-align: center;
      margin: 0 0 var(--space-6);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
    }

    /* Error box */
    .login-view__error {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md);
      background: rgba(218, 7, 4, 0.10);
      border: 1px solid rgba(218, 7, 4, 0.20);
      color: var(--mars-red-light);
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
      animation: fadeSlideIn 300ms var(--ease-out-expo) both;
    }

    .login-view .login-view__error.hidden {
      display: none !important;
    }

    .login-view__error-icon {
      flex-shrink: 0;
      display: flex;
      color: var(--mars-red);
    }

    /* Pending approval card */
    .login-view__pending {
      text-align: center;
      padding: var(--space-6);
      border-radius: var(--radius-md);
      background: rgba(255, 171, 0, 0.08);
      border: 1px solid rgba(255, 171, 0, 0.20);
      animation: fadeSlideIn 400ms var(--ease-out-expo) both;
    }

    .login-view .login-view__pending.hidden {
      display: none !important;
    }

    .login-view__pending-icon {
      color: var(--color-warning);
      margin-bottom: var(--space-3);
      filter: drop-shadow(0 0 12px rgba(255, 171, 0, 0.30));
    }

    .login-view__pending-title {
      font-family: var(--font-display);
      font-size: var(--text-lg);
      font-weight: var(--weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--color-warning);
      margin-bottom: var(--space-2);
    }

    .login-view__pending-text {
      font-size: var(--text-sm);
      color: var(--text-secondary);
      line-height: var(--leading-relaxed);
    }

    /* Switch mode link */
    .login-view__switch {
      text-align: center;
      margin-top: var(--space-6);
      padding-top: var(--space-4);
      border-top: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
    }

    .login-view__switch-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-family: var(--font-display);
      font-size: var(--text-sm);
      font-weight: var(--weight-bold);
      color: var(--mars-red);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-sm);
      transition: all 0.2s var(--ease-out-expo);
    }

    .login-view__switch-btn:hover {
      color: var(--mars-red-light);
      background: rgba(218, 7, 4, 0.10);
    }

    .login-view__switch-btn:active {
      transform: scale(0.96);
    }

    /* Footer */
    .login-view__footer {
      text-align: center;
      color: var(--text-tertiary);
      font-size: var(--text-xs);
      padding: var(--space-6) var(--space-4) var(--space-8);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin-top: auto;
    }

    /* Flex utilities for form (in case design system doesn't have flex-col gap) */
    .login-view .flex.flex-col { display: flex; flex-direction: column; }
  `;
  document.head.appendChild(styleEl);

  // ============================================================
  // INIT
  // ============================================================

  renderView();

  return () => {
    if (styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
  };
}
