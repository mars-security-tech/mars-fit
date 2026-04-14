/**
 * MARS FIT v3 — Vista Profile
 *
 * Perfil del usuario, datos fisicos editables, toggle de tema,
 * integraciones (Claude, Apple Health, Supabase, Notificaciones),
 * historial de peso (line chart), zona peligrosa (reset).
 */

import { icon } from '../icons.js';
import { renderLineChart, animateCounter } from '../charts-v3.js';
import {
  getConfig,
  setConfig,
  updateProfile,
  subscribe,
  computeTDEE,
  getWeightHistory,
  resetAll,
} from '../store-v3.js';
import { getApiKey, setApiKey } from '../../../js/ai.js';
import { importHealthExport } from '../../../js/applehealth.js';
import { pushSupported, subscribe as pushSubscribe, unsubscribe as pushUnsubscribe } from '../../../js/push.js';
import { backendConfig, setBackendConfig } from '../../../js/backend.js';

// ============================================================
// HELPERS
// ============================================================

function profileInitials(name) {
  if (!name) return 'U';
  return name.split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

const ACTIVITY_OPTIONS = [
  { value: 1.2, label: 'Sedentario' },
  { value: 1.375, label: 'Ligero (1-3 dias)' },
  { value: 1.55, label: 'Moderado (3-5 dias)' },
  { value: 1.725, label: 'Activo (6-7 dias)' },
  { value: 1.9, label: 'Muy activo / fisico' },
];

const GOAL_OPTIONS = [
  { value: 'volumen', label: 'Volumen' },
  { value: 'definicion', label: 'Definicion' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'rendimiento', label: 'Rendimiento' },
  { value: 'turnos_largos', label: 'Turnos largos' },
  { value: 'estabilidad', label: 'Estabilidad' },
];

/** Integration accent colors */
const INTEGRATION_COLORS = {
  claude: '#B44AFF',
  health: '#FF2D6B',
  supabase: '#00E676',
  notif: '#FFD600',
};

// ============================================================
// RENDER
// ============================================================

/**
 * @param {HTMLElement} container
 * @param {object} ctx - {navigate, back, params, route}
 * @returns {function} cleanup
 */
export function render(container, ctx) {
  const config = getConfig();
  const profile = config.profile || {};
  const { bmr, tdee } = computeTDEE();
  const currentTheme = config.theme || 'dark';

  // Integration states
  const claudeKey = getApiKey() || '';
  const sbConfig = backendConfig();
  const sbConfigured = !!(sbConfig?.url && sbConfig?.anonKey);
  const notifEnabled = config.notifEnabled || false;
  const healthImported = !!(config.health && config.health !== null);

  // Sun icon inline SVG (not in icon set)
  const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

  container.innerHTML = `
    <section class="view view--profile" data-view="profile" style="padding-bottom:var(--space-24);">

      <!-- PROFILE HEADER -->
      <div class="card-glow animate-in" style="margin:var(--space-4);">
        <div class="flex items-center gap-4">
          <div class="avatar avatar--xl" style="width:80px;height:80px;font-size:var(--text-2xl);border:3px solid transparent;background:linear-gradient(var(--bg-surface),var(--bg-surface)) padding-box,linear-gradient(135deg,#FF6B2C,#DA0704,#FF2D6B,#DA0704) border-box;border-radius:var(--radius-full);animation:ringRotate 3s linear infinite;" aria-label="Avatar de perfil">
            ${profileInitials(profile.name)}
          </div>
          <div class="flex-1">
            <h3 class="font-display text-primary uppercase tracking" style="margin:0;font-size:var(--text-xl);">
              ${profile.name || 'Sin nombre'}
            </h3>
            <div class="flex items-center gap-2 mt-1">
              <span class="chip text-xs">${GOAL_OPTIONS.find(g => g.value === profile.goal)?.label || profile.goal || 'Sin meta'}</span>
            </div>
            <div class="grid grid-cols-2 gap-3 mt-4">
              <div style="padding:var(--space-2);border-radius:var(--radius-md);background:rgba(218,7,4,0.05);box-shadow:inset 0 0 12px rgba(218,7,4,0.04);">
                <span class="text-tertiary text-xs uppercase tracking">BMR</span>
                <div class="stat-number stat-number--sm" data-counter="${bmr}" style="font-size:var(--text-xl);">0</div>
              </div>
              <div style="padding:var(--space-2);border-radius:var(--radius-md);background:rgba(218,7,4,0.05);box-shadow:inset 0 0 12px rgba(218,7,4,0.04);">
                <span class="text-tertiary text-xs uppercase tracking">TDEE</span>
                <div class="stat-number stat-number--sm text-mars" data-counter="${tdee}" style="font-size:var(--text-xl);">0</div>
              </div>
              <div style="padding:var(--space-2);border-radius:var(--radius-md);background:rgba(218,7,4,0.05);box-shadow:inset 0 0 12px rgba(218,7,4,0.04);">
                <span class="text-tertiary text-xs uppercase tracking">Peso</span>
                <div class="stat-number stat-number--sm" data-counter="${profile.weightKg || 0}" style="font-size:var(--text-xl);">0</div>
              </div>
              <div style="padding:var(--space-2);border-radius:var(--radius-md);background:rgba(218,7,4,0.05);box-shadow:inset 0 0 12px rgba(218,7,4,0.04);">
                <span class="text-tertiary text-xs uppercase tracking">Meta</span>
                <div class="font-display text-primary uppercase" style="font-size:var(--text-base);">
                  ${GOAL_OPTIONS.find(g => g.value === profile.goal)?.label || profile.goal || '-'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- THEME TOGGLE -->
      <div class="card-glow animate-in animate-in--stagger-1" style="margin:var(--space-4);">
        <h4 class="font-display text-primary uppercase tracking mb-4" style="font-size:var(--text-lg);">
          ${icon('moon', 18)} Tema
        </h4>
        <label class="flex items-center justify-between" style="cursor:pointer;">
          <div class="flex items-center gap-3">
            <span class="text-secondary text-sm">${currentTheme === 'dark' ? 'Oscuro' : 'Claro'}</span>
          </div>
          <div class="theme-switch" role="switch" aria-checked="${currentTheme === 'light'}" tabindex="0" data-action="toggle-theme" aria-label="Cambiar tema">
            <div style="
              width:48px;height:26px;
              border-radius:13px;
              background:${currentTheme === 'light' ? 'var(--mars-red)' : 'var(--bg-surface-raised)'};
              border:1px solid ${currentTheme === 'light' ? 'var(--mars-red)' : 'var(--border-strong)'};
              position:relative;
              transition:background 0.4s cubic-bezier(0.34,1.56,0.64,1),border-color 0.3s ease;
              box-shadow:inset 0 1px 3px rgba(0,0,0,0.2);
            ">
              <div style="
                width:20px;height:20px;
                border-radius:var(--radius-full);
                background:#fff;
                position:absolute;
                top:2px;
                left:${currentTheme === 'light' ? '25px' : '2px'};
                transition:left 0.4s cubic-bezier(0.34,1.56,0.64,1);
                box-shadow:0 1px 4px rgba(0,0,0,0.25);
                display:flex;align-items:center;justify-content:center;
                color:${currentTheme === 'light' ? '#F59E0B' : '#6366F1'};
              ">
                ${currentTheme === 'light' ? sunIcon : `<span style="font-size:10px;line-height:1;">${icon('moon', 12)}</span>`}
              </div>
            </div>
          </div>
        </label>
      </div>

      <!-- DATOS FISICOS (FORM) -->
      <div class="card-glow animate-in animate-in--stagger-2" style="margin:var(--space-4);">
        <h4 class="font-display text-primary uppercase tracking mb-4" style="font-size:var(--text-lg);">
          ${icon('edit', 18)} Datos fisicos
        </h4>
        <form data-form="profile" autocomplete="off">
          <div class="flex-col gap-4" style="display:flex;">
            <!-- Name -->
            <div>
              <label class="input-label" for="pf-name" style="text-transform:uppercase;letter-spacing:0.06em;font-size:var(--text-xs);font-weight:var(--weight-semibold);">Nombre</label>
              <input class="input" id="pf-name" name="name" type="text" value="${profile.name || ''}" placeholder="Tu nombre" maxlength="60" style="transition:box-shadow 0.2s ease,border-color 0.2s ease;" onfocus="this.style.boxShadow='0 0 0 3px rgba(218,7,4,0.2),0 0 12px rgba(218,7,4,0.1)';this.style.borderColor='var(--mars-red)';" onblur="this.style.boxShadow='none';this.style.borderColor='';" />
            </div>
            <!-- Sex + Age row -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="input-label" for="pf-sex" style="text-transform:uppercase;letter-spacing:0.06em;font-size:var(--text-xs);font-weight:var(--weight-semibold);">Sexo</label>
                <select class="input" id="pf-sex" name="sex" style="transition:box-shadow 0.2s ease,border-color 0.2s ease;" onfocus="this.style.boxShadow='0 0 0 3px rgba(218,7,4,0.2),0 0 12px rgba(218,7,4,0.1)';this.style.borderColor='var(--mars-red)';" onblur="this.style.boxShadow='none';this.style.borderColor='';">
                  <option value="m" ${profile.sex === 'm' ? 'selected' : ''}>Masculino</option>
                  <option value="f" ${profile.sex === 'f' ? 'selected' : ''}>Femenino</option>
                </select>
              </div>
              <div>
                <label class="input-label" for="pf-age" style="text-transform:uppercase;letter-spacing:0.06em;font-size:var(--text-xs);font-weight:var(--weight-semibold);">Edad</label>
                <input class="input" id="pf-age" name="age" type="number" min="14" max="99" value="${profile.age || 30}" style="transition:box-shadow 0.2s ease,border-color 0.2s ease;" onfocus="this.style.boxShadow='0 0 0 3px rgba(218,7,4,0.2),0 0 12px rgba(218,7,4,0.1)';this.style.borderColor='var(--mars-red)';" onblur="this.style.boxShadow='none';this.style.borderColor='';" />
              </div>
            </div>
            <!-- Weight + Height -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="input-label" for="pf-weight" style="text-transform:uppercase;letter-spacing:0.06em;font-size:var(--text-xs);font-weight:var(--weight-semibold);">Peso (kg)</label>
                <input class="input" id="pf-weight" name="weightKg" type="number" min="30" max="250" step="0.1" value="${profile.weightKg || 80}" style="transition:box-shadow 0.2s ease,border-color 0.2s ease;" onfocus="this.style.boxShadow='0 0 0 3px rgba(218,7,4,0.2),0 0 12px rgba(218,7,4,0.1)';this.style.borderColor='var(--mars-red)';" onblur="this.style.boxShadow='none';this.style.borderColor='';" />
              </div>
              <div>
                <label class="input-label" for="pf-height" style="text-transform:uppercase;letter-spacing:0.06em;font-size:var(--text-xs);font-weight:var(--weight-semibold);">Altura (cm)</label>
                <input class="input" id="pf-height" name="heightCm" type="number" min="100" max="250" value="${profile.heightCm || 178}" style="transition:box-shadow 0.2s ease,border-color 0.2s ease;" onfocus="this.style.boxShadow='0 0 0 3px rgba(218,7,4,0.2),0 0 12px rgba(218,7,4,0.1)';this.style.borderColor='var(--mars-red)';" onblur="this.style.boxShadow='none';this.style.borderColor='';" />
              </div>
            </div>
            <!-- Activity -->
            <div>
              <label class="input-label" for="pf-activity" style="text-transform:uppercase;letter-spacing:0.06em;font-size:var(--text-xs);font-weight:var(--weight-semibold);">Nivel de actividad</label>
              <select class="input" id="pf-activity" name="activity" style="transition:box-shadow 0.2s ease,border-color 0.2s ease;" onfocus="this.style.boxShadow='0 0 0 3px rgba(218,7,4,0.2),0 0 12px rgba(218,7,4,0.1)';this.style.borderColor='var(--mars-red)';" onblur="this.style.boxShadow='none';this.style.borderColor='';">
                ${ACTIVITY_OPTIONS.map(o => `
                  <option value="${o.value}" ${parseFloat(profile.activity) === o.value ? 'selected' : ''}>${o.label}</option>
                `).join('')}
              </select>
            </div>
            <!-- Goal -->
            <div>
              <label class="input-label" for="pf-goal" style="text-transform:uppercase;letter-spacing:0.06em;font-size:var(--text-xs);font-weight:var(--weight-semibold);">Objetivo</label>
              <select class="input" id="pf-goal" name="goal" style="transition:box-shadow 0.2s ease,border-color 0.2s ease;" onfocus="this.style.boxShadow='0 0 0 3px rgba(218,7,4,0.2),0 0 12px rgba(218,7,4,0.1)';this.style.borderColor='var(--mars-red)';" onblur="this.style.boxShadow='none';this.style.borderColor='';">
                ${GOAL_OPTIONS.map(o => `
                  <option value="${o.value}" ${profile.goal === o.value ? 'selected' : ''}>${o.label}</option>
                `).join('')}
              </select>
            </div>
            <!-- Save button -->
            <button type="submit" class="btn btn--primary btn--lg w-full" data-action="save-profile">
              ${icon('check', 18)} GUARDAR
            </button>
          </div>
        </form>
      </div>

      <!-- INTEGRACIONES -->
      <div class="card-glow animate-in animate-in--stagger-3" style="margin:var(--space-4);">
        <h4 class="font-display text-primary uppercase tracking mb-4" style="font-size:var(--text-lg);">
          ${icon('settings', 18)} Integraciones
        </h4>
        <div class="flex-col gap-2" style="display:flex;">
          ${renderIntegrationRow('Claude Vision', 'eye', !!claudeKey, 'claude')}
          ${renderIntegrationRow('Apple Watch', 'heart-pulse', healthImported, 'health')}
          ${renderIntegrationRow('Oura Ring 4', 'target', !!localStorage.getItem('marsfit.oura.token'), 'oura')}
          ${renderIntegrationRow('RENPHO Scale', 'scale', !!localStorage.getItem('marsfit.renpho.credentials'), 'renpho')}
          ${renderIntegrationRow('Supabase', 'upload', sbConfigured, 'supabase')}
          ${renderIntegrationRow('Notificaciones', 'bell', notifEnabled, 'notif')}
        </div>

        <!-- Expandable integration panels -->
        <div data-panel="claude" class="mt-4" style="display:none;">
          <label class="input-label" for="int-claude-key" style="text-transform:uppercase;letter-spacing:0.06em;font-size:var(--text-xs);font-weight:var(--weight-semibold);">Claude API Key</label>
          <input class="input" id="int-claude-key" type="password" placeholder="sk-ant-..." value="${claudeKey ? '****' : ''}" data-real-value="${claudeKey}" style="transition:box-shadow 0.2s ease,border-color 0.2s ease;" onfocus="this.style.boxShadow='0 0 0 3px rgba(180,74,255,0.2),0 0 12px rgba(180,74,255,0.1)';this.style.borderColor='#B44AFF';" onblur="this.style.boxShadow='none';this.style.borderColor='';" />
          <p class="input-hint">Para reconocimiento de comidas por foto.</p>
          <button class="btn btn--secondary btn--sm mt-2" data-action="save-claude">
            ${icon('check', 14)} Guardar
          </button>
        </div>

        <div data-panel="health" class="mt-4" style="display:none;">
          <label class="input-label" for="int-health-file" style="text-transform:uppercase;letter-spacing:0.06em;font-size:var(--text-xs);font-weight:var(--weight-semibold);">Importar Apple Health (export.xml o .zip)</label>
          <input class="input" id="int-health-file" type="file" accept=".xml,.zip" data-action="health-file" style="padding:var(--space-2);"/>
          <p class="input-hint">Exporta desde Salud (iPhone) y sube el archivo aqui.</p>
          <div data-health-status class="mt-2"></div>
        </div>

        <div data-panel="oura" class="mt-4" style="display:none;">
          <label class="input-label" style="text-transform:uppercase;letter-spacing:0.06em;font-size:var(--text-xs);font-weight:var(--weight-semibold);">Oura Personal Access Token</label>
          <input class="input" id="int-oura-token" type="password" placeholder="OURA_TOKEN..." value="${localStorage.getItem('marsfit.oura.token') ? '****' : ''}" style="transition:box-shadow 0.2s ease,border-color 0.2s ease;" onfocus="this.style.boxShadow='0 0 0 3px rgba(180,74,255,0.2),0 0 12px rgba(180,74,255,0.1)';this.style.borderColor='#B44AFF';" onblur="this.style.boxShadow='none';this.style.borderColor='';" />
          <p class="input-hint">Obtenlo en <a href="https://cloud.ouraring.com/personal-access-tokens" target="_blank" style="color:var(--color-brand)">cloud.ouraring.com</a>. Trae sueno, actividad, recuperacion y pulso.</p>
          <div style="display:flex;gap:var(--space-2);margin-top:var(--space-2);">
            <button class="btn btn--secondary btn--sm" data-action="save-oura">${icon('check', 14)} Guardar</button>
            <button class="btn btn--ghost btn--sm" data-action="sync-oura">${icon('refresh', 14)} Sync 7 dias</button>
          </div>
          <div data-oura-status class="mt-2"></div>
        </div>

        <div data-panel="renpho" class="mt-4" style="display:none;">
          <div style="background:rgba(0,230,118,0.06);border:1px solid rgba(0,230,118,0.15);border-radius:12px;padding:12px;margin-bottom:12px;">
            <p style="color:var(--text-primary);font-weight:600;margin-bottom:4px;font-size:13px;">${icon('info',14)} Como conectar RENPHO Health:</p>
            <ol style="padding-left:20px;margin:0;color:var(--text-secondary);font-size:13px;line-height:1.7;">
              <li>Abre la app <b style="color:var(--text-primary)">RENPHO Health</b> en tu movil</li>
              <li>Ve a <b style="color:var(--text-primary)">Mi cuenta</b> (icono persona abajo derecha)</li>
              <li>Introduce aqui el <b style="color:var(--text-primary)">mismo email y password</b> de tu cuenta RENPHO</li>
              <li>Pulsa <b style="color:#00E676">Conectar</b> y luego <b style="color:#00E676">Sync datos</b></li>
            </ol>
          </div>
          <p class="text-secondary text-sm mb-3">Importa: peso, % grasa corporal, masa muscular, % agua, BMI, BMR, edad metabolica, grasa visceral y proteina.</p>
          <div class="flex-col gap-2" style="display:flex;">
            <div>
              <label class="input-label" style="text-transform:uppercase;letter-spacing:0.06em;font-size:var(--text-xs);font-weight:var(--weight-semibold);">Email RENPHO</label>
              <input class="input" id="int-renpho-email" type="email" placeholder="tu@email.com" style="transition:box-shadow 0.2s ease,border-color 0.2s ease;" onfocus="this.style.boxShadow='0 0 0 3px rgba(0,230,118,0.2),0 0 12px rgba(0,230,118,0.1)';this.style.borderColor='#00E676';" onblur="this.style.boxShadow='none';this.style.borderColor='';" />
            </div>
            <div>
              <label class="input-label" style="text-transform:uppercase;letter-spacing:0.06em;font-size:var(--text-xs);font-weight:var(--weight-semibold);">Password RENPHO</label>
              <input class="input" id="int-renpho-pass" type="password" placeholder="********" style="transition:box-shadow 0.2s ease,border-color 0.2s ease;" onfocus="this.style.boxShadow='0 0 0 3px rgba(0,230,118,0.2),0 0 12px rgba(0,230,118,0.1)';this.style.borderColor='#00E676';" onblur="this.style.boxShadow='none';this.style.borderColor='';" />
            </div>
          </div>
          <div style="display:flex;gap:var(--space-2);margin-top:var(--space-2);">
            <button class="btn btn--secondary btn--sm" data-action="login-renpho">${icon('check', 14)} Conectar</button>
            <button class="btn btn--ghost btn--sm" data-action="sync-renpho">${icon('refresh', 14)} Sync datos</button>
          </div>
          <p class="text-tertiary text-xs mt-2">O importa un CSV exportado de la app RENPHO:</p>
          <input class="input" id="int-renpho-csv" type="file" accept=".csv" style="padding:var(--space-2);margin-top:var(--space-1);" />
          <div data-renpho-status class="mt-2"></div>
        </div>

        <div data-panel="supabase" class="mt-4" style="display:none;">
          <div class="flex-col gap-3" style="display:flex;">
            <div>
              <label class="input-label" for="int-sb-url" style="text-transform:uppercase;letter-spacing:0.06em;font-size:var(--text-xs);font-weight:var(--weight-semibold);">Supabase URL</label>
              <input class="input" id="int-sb-url" type="url" placeholder="https://xxx.supabase.co" value="${sbConfig?.url || ''}" style="transition:box-shadow 0.2s ease,border-color 0.2s ease;" onfocus="this.style.boxShadow='0 0 0 3px rgba(0,230,118,0.2),0 0 12px rgba(0,230,118,0.1)';this.style.borderColor='#00E676';" onblur="this.style.boxShadow='none';this.style.borderColor='';" />
            </div>
            <div>
              <label class="input-label" for="int-sb-key" style="text-transform:uppercase;letter-spacing:0.06em;font-size:var(--text-xs);font-weight:var(--weight-semibold);">Anon Key</label>
              <input class="input" id="int-sb-key" type="password" placeholder="eyJ..." value="${sbConfig?.anonKey ? '****' : ''}" data-real-value="${sbConfig?.anonKey || ''}" style="transition:box-shadow 0.2s ease,border-color 0.2s ease;" onfocus="this.style.boxShadow='0 0 0 3px rgba(0,230,118,0.2),0 0 12px rgba(0,230,118,0.1)';this.style.borderColor='#00E676';" onblur="this.style.boxShadow='none';this.style.borderColor='';" />
            </div>
          </div>
          <button class="btn btn--secondary btn--sm mt-2" data-action="save-supabase">
            ${icon('check', 14)} Guardar
          </button>
        </div>

        <div data-panel="notif" class="mt-4" style="display:none;">
          <p class="text-secondary text-sm mb-2">Recibe picadas y actualizaciones de tu team.</p>
          <button class="btn btn--${notifEnabled ? 'danger' : 'primary'} btn--sm" data-action="toggle-notif">
            ${icon('bell', 14)} ${notifEnabled ? 'DESACTIVAR' : 'ACTIVAR'}
          </button>
        </div>
      </div>

      <!-- HISTORIAL DE PESO -->
      <div class="card-glow animate-in animate-in--stagger-4" style="margin:var(--space-4);">
        <h4 class="font-display text-primary uppercase tracking mb-4" style="font-size:var(--text-lg);">
          ${icon('chart', 18)} Historial de peso
        </h4>
        <div data-weight-chart style="min-height:180px;"></div>
        <p class="text-tertiary text-xs text-center mt-2" data-weight-empty style="display:none;">
          Sin datos de peso registrados.
        </p>
      </div>

      <!-- ZONA PELIGROSA -->
      <div class="card-glow animate-in animate-in--stagger-5" style="margin:var(--space-4);border-color:rgba(239,68,68,0.3);animation:dangerPulse 2s ease-in-out infinite;">
        <h4 class="font-display uppercase tracking mb-4" style="font-size:var(--text-lg);color:var(--color-error);">
          ${icon('alert', 18)} Zona peligrosa
        </h4>
        <p class="text-secondary text-sm mb-4">
          Esto borrara todos tus datos de entrenamientos, comidas, peso e integraciones. Esta accion no se puede deshacer.
        </p>
        <button class="btn btn--danger btn--sm" data-action="reset-app" style="transition:all 0.3s ease;box-shadow:0 0 0 0 rgba(239,68,68,0);" onmouseenter="this.style.boxShadow='0 0 20px rgba(239,68,68,0.4),0 0 6px rgba(239,68,68,0.2)';this.style.transform='scale(1.02)';" onmouseleave="this.style.boxShadow='0 0 0 0 rgba(239,68,68,0)';this.style.transform='scale(1)';">
          ${icon('trash', 14)} RESETEAR APP
        </button>
      </div>

    </section>
  `;

  // ============================================================
  // POST-RENDER: Inject styles, animate, bind events
  // ============================================================

  // Inject profile-specific animations if not present
  if (!document.getElementById('mars-profile-style')) {
    const style = document.createElement('style');
    style.id = 'mars-profile-style';
    style.textContent = `
      @keyframes ringRotate {
        0%   { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
      @keyframes dangerPulse {
        0%, 100% { border-color: rgba(239,68,68,0.2); }
        50%      { border-color: rgba(239,68,68,0.45); }
      }
    `;
    document.head.appendChild(style);
  }

  const section = container.querySelector('[data-view="profile"]');
  if (!section) return () => {};

  // -- Animate counters --
  requestAnimationFrame(() => {
    section.querySelectorAll('[data-counter]').forEach(el => {
      const target = parseInt(el.dataset.counter, 10);
      animateCounter(el, target, { duration: 900 });
    });
  });

  // -- Load weight chart --
  loadWeightChart(section);

  // -- Event delegation --
  function handleClick(e) {
    // Integration row expand
    const intRow = e.target.closest('[data-integration]');
    if (intRow) {
      e.preventDefault();
      const panelId = intRow.dataset.integration;
      const panel = section.querySelector(`[data-panel="${panelId}"]`);
      if (panel) {
        const isVisible = panel.style.display !== 'none';
        // Hide all panels
        section.querySelectorAll('[data-panel]').forEach(p => p.style.display = 'none');
        if (!isVisible) panel.style.display = 'block';
      }
      return;
    }

    // Toggle theme
    const themeToggle = e.target.closest('[data-action="toggle-theme"]');
    if (themeToggle) {
      e.preventDefault();
      const newTheme = getConfig().theme === 'dark' ? 'light' : 'dark';
      setConfig({ theme: newTheme });
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('marsfit.theme', newTheme);
      // Re-render for visual update
      render(container, ctx);
      return;
    }

    // Save Claude key
    if (e.target.closest('[data-action="save-claude"]')) {
      e.preventDefault();
      const input = section.querySelector('#int-claude-key');
      const val = input?.value?.trim();
      if (val && val !== '****') {
        setApiKey(val);
        render(container, ctx);
      }
      return;
    }

    // Save Supabase
    if (e.target.closest('[data-action="save-supabase"]')) {
      e.preventDefault();
      const urlEl = section.querySelector('#int-sb-url');
      const keyEl = section.querySelector('#int-sb-key');
      const url = urlEl?.value?.trim();
      const anonKey = keyEl?.value?.trim();
      if (url && anonKey && anonKey !== '****') {
        setBackendConfig({ url, anonKey });
        render(container, ctx);
      }
      return;
    }

    // Toggle notifications
    if (e.target.closest('[data-action="toggle-notif"]')) {
      e.preventDefault();
      toggleNotifications();
      return;
    }

    // Oura Ring
    if (e.target.closest('[data-action="save-oura"]')) {
      e.preventDefault();
      const tokenInput = section.querySelector('#int-oura-token');
      const val = tokenInput?.value?.trim();
      if (val && val !== '****') {
        localStorage.setItem('marsfit.oura.token', val);
        section.querySelector('[data-oura-status]').innerHTML =
          `<span class="badge badge--success">${icon('check',12)} Token guardado</span>`;
        setTimeout(() => render(container, ctx), 800);
      }
      return;
    }
    if (e.target.closest('[data-action="sync-oura"]')) {
      e.preventDefault();
      const statusEl = section.querySelector('[data-oura-status]');
      statusEl.innerHTML = `<span class="text-sm text-secondary">Sincronizando 7 dias...</span>`;
      import('../devices.js').then(async ({ OuraRing }) => {
        try {
          const data = await OuraRing.syncAll();
          const counts = [data.activity.length, data.sleep.length, data.readiness.length, data.heartRate.length];
          statusEl.innerHTML = `<span class="badge badge--success">${icon('check',12)} Sync OK: ${counts[0]} actividad, ${counts[1]} sueno, ${counts[2]} readiness, ${counts[3]} HR</span>`;
        } catch (err) {
          statusEl.innerHTML = `<span class="text-sm" style="color:var(--color-error)">${err.message}</span>`;
        }
      });
      return;
    }

    // RENPHO Scale
    if (e.target.closest('[data-action="login-renpho"]')) {
      e.preventDefault();
      const email = section.querySelector('#int-renpho-email')?.value?.trim();
      const pass = section.querySelector('#int-renpho-pass')?.value;
      const statusEl = section.querySelector('[data-renpho-status]');
      if (!email || !pass) { statusEl.innerHTML = '<span class="text-sm" style="color:var(--color-error)">Email y password requeridos</span>'; return; }
      statusEl.innerHTML = `<span class="text-sm text-secondary">Conectando...</span>`;
      import('../devices.js').then(async ({ RenphoScale }) => {
        try {
          await RenphoScale.login(email, pass);
          statusEl.innerHTML = `<span class="badge badge--success">${icon('check',12)} Conectado</span>`;
          setTimeout(() => render(container, ctx), 800);
        } catch (err) {
          statusEl.innerHTML = `<span class="text-sm" style="color:var(--color-error)">${err.message}</span>`;
        }
      });
      return;
    }
    if (e.target.closest('[data-action="sync-renpho"]')) {
      e.preventDefault();
      const statusEl = section.querySelector('[data-renpho-status]');
      statusEl.innerHTML = `<span class="text-sm text-secondary">Sincronizando...</span>`;
      import('../devices.js').then(async ({ RenphoScale }) => {
        try {
          const data = await RenphoScale.sync();
          statusEl.innerHTML = `<span class="badge badge--success">${icon('check',12)} ${data.length} mediciones importadas</span>`;
        } catch (err) {
          statusEl.innerHTML = `<span class="text-sm" style="color:var(--color-error)">${err.message}</span>`;
        }
      });
      return;
    }

    // Reset app
    if (e.target.closest('[data-action="reset-app"]')) {
      e.preventDefault();
      showResetConfirmation(section);
      return;
    }
  }

  // -- Form submit --
  function handleSubmit(e) {
    const form = e.target.closest('[data-form="profile"]');
    if (!form) return;
    e.preventDefault();

    const fd = new FormData(form);
    const patch = {
      name: fd.get('name')?.toString().trim() || '',
      sex: fd.get('sex') || 'm',
      age: parseInt(fd.get('age'), 10) || 30,
      weightKg: parseFloat(fd.get('weightKg')) || 80,
      heightCm: parseInt(fd.get('heightCm'), 10) || 178,
      activity: parseFloat(fd.get('activity')) || 1.55,
      goal: fd.get('goal') || 'volumen',
    };

    // Basic validation
    if (patch.age < 14 || patch.age > 99) return;
    if (patch.weightKg < 30 || patch.weightKg > 250) return;
    if (patch.heightCm < 100 || patch.heightCm > 250) return;

    updateProfile(patch);

    // Visual feedback
    const btn = form.querySelector('[data-action="save-profile"]');
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = `${icon('check', 18)} GUARDADO`;
      btn.classList.add('glow-pulse', 'glow-pulse--activity');
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.classList.remove('glow-pulse', 'glow-pulse--activity');
      }, 1200);
    }

    // Re-render to update computed values
    render(container, ctx);
  }

  // -- Health file import --
  function handleHealthFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const statusEl = section.querySelector('[data-health-status]');
    if (statusEl) {
      statusEl.innerHTML = `<div class="flex items-center gap-2"><div class="spinner"></div><span class="text-secondary text-sm">Importando...</span></div>`;
    }
    importHealthExport(file)
      .then(result => {
        if (statusEl) {
          statusEl.innerHTML = `
            <div class="chip chip--success">${icon('check', 14)} Importado</div>
            <p class="text-tertiary text-xs mt-1">${result.samples?.bodyweight || 0} medidas de peso, ${result.samples?.steps || 0} dias de pasos.</p>
          `;
        }
        // Reload weight chart
        loadWeightChart(section);
      })
      .catch(err => {
        if (statusEl) {
          statusEl.innerHTML = `<div class="chip chip--error">${icon('alert', 14)} ${err.message || 'Error de importacion'}</div>`;
        }
      });
  }

  // -- Notification toggle --
  async function toggleNotifications() {
    try {
      if (notifEnabled) {
        await pushUnsubscribe();
        setConfig({ notifEnabled: false });
      } else {
        await pushSubscribe();
        setConfig({ notifEnabled: true });
      }
      render(container, ctx);
    } catch (err) {
      console.warn('[MARSFIT] Push error:', err);
    }
  }

  // -- Reset confirmation --
  function showResetConfirmation(root) {
    // Create inline confirmation
    const dangerCard = root.querySelector('[data-action="reset-app"]')?.closest('.card-glow');
    if (!dangerCard) return;

    const existing = dangerCard.querySelector('[data-confirm-reset]');
    if (existing) { existing.remove(); return; }

    const confirm = document.createElement('div');
    confirm.setAttribute('data-confirm-reset', '');
    confirm.className = 'mt-4 p-4 rounded-lg';
    confirm.style.cssText = 'background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:var(--radius-md);';
    confirm.innerHTML = `
      <p class="text-sm mb-4" style="color:var(--color-error);">
        ${icon('alert', 16)} Confirma que deseas borrar TODOS los datos.
      </p>
      <div class="flex gap-3">
        <button class="btn btn--danger btn--sm" data-action="confirm-reset">
          ${icon('trash', 14)} SI, BORRAR TODO
        </button>
        <button class="btn btn--ghost btn--sm" data-action="cancel-reset">CANCELAR</button>
      </div>
    `;
    dangerCard.appendChild(confirm);

    confirm.querySelector('[data-action="confirm-reset"]')?.addEventListener('click', async () => {
      await resetAll();
      localStorage.removeItem('marsfit.theme');
      document.documentElement.removeAttribute('data-theme');
      window.location.reload();
    });

    confirm.querySelector('[data-action="cancel-reset"]')?.addEventListener('click', () => {
      confirm.remove();
    });
  }

  // -- Bind events --
  section.addEventListener('click', handleClick);
  section.addEventListener('submit', handleSubmit);

  const healthInput = section.querySelector('#int-health-file');
  if (healthInput) healthInput.addEventListener('change', handleHealthFile);

  // -- Store subscription --
  const unsub = subscribe(() => {}, 'profile');

  // ============================================================
  // CLEANUP
  // ============================================================

  return () => {
    section.removeEventListener('click', handleClick);
    section.removeEventListener('submit', handleSubmit);
    if (healthInput) healthInput.removeEventListener('change', handleHealthFile);
    unsub();
  };
}

// ============================================================
// HELPERS (private)
// ============================================================

function renderIntegrationRow(name, iconName, configured, panelId) {
  const accentColor = INTEGRATION_COLORS[panelId] || 'var(--text-secondary)';
  const stateLabel = configured ? 'ACTIVO' : 'Pendiente';

  const statusBadge = configured
    ? `<span style="display:inline-flex;align-items:center;gap:4px;padding:2px 10px;border-radius:var(--radius-pill);font-size:10px;font-weight:700;font-family:var(--font-display);letter-spacing:0.04em;background:rgba(0,230,118,0.12);color:var(--color-success);box-shadow:0 0 8px rgba(0,230,118,0.2);">${icon('check', 12)} ${stateLabel}</span>`
    : `<span style="display:inline-flex;align-items:center;gap:4px;padding:2px 10px;border-radius:var(--radius-pill);font-size:10px;font-weight:600;font-family:var(--font-display);color:var(--text-tertiary);">${icon('chevron-right', 14)} ${stateLabel}</span>`;

  return `
    <div class="flex items-center justify-between p-4 rounded-lg"
         style="background:var(--bg-surface-raised);cursor:pointer;border-left:3px solid ${accentColor};transition:all 0.2s ease;"
         data-integration="${panelId}"
         role="button"
         tabindex="0"
         aria-label="${name} - ${stateLabel}"
         onmouseenter="this.style.background='var(--bg-surface-overlay)';"
         onmouseleave="this.style.background='var(--bg-surface-raised)';">
      <div class="flex items-center gap-3">
        <span style="color:${accentColor};">${icon(iconName, 20)}</span>
        <span class="font-display text-sm uppercase text-primary">${name}</span>
      </div>
      ${statusBadge}
    </div>
  `;
}

async function loadWeightChart(section) {
  const chartEl = section.querySelector('[data-weight-chart]');
  const emptyEl = section.querySelector('[data-weight-empty]');
  if (!chartEl) return;

  try {
    const history = await getWeightHistory(30);
    if (!history || history.length < 2) {
      chartEl.style.display = 'none';
      if (emptyEl) emptyEl.style.display = 'block';
      return;
    }

    const sorted = [...history].sort((a, b) => a.date.localeCompare(b.date));
    const data = sorted.map(e => e.kg);
    const labels = sorted.map(e => {
      const d = new Date(e.date);
      return `${d.getDate()}/${d.getMonth() + 1}`;
    });

    renderLineChart(chartEl, data, '#DA0704', true, {
      height: 180,
      labels,
      showDots: true,
      animate: true,
      duration: 1000,
    });
  } catch (err) {
    console.warn('[MARSFIT] Weight chart error:', err);
    chartEl.style.display = 'none';
    if (emptyEl) emptyEl.style.display = 'block';
  }
}
