/**
 * MARS FIT v3 — Vista Admin Panel
 *
 * Solo accesible si isAdmin().
 * Gestion de usuarios, aprobaciones, teams.
 */

import { icon } from '../icons.js';
import {
  isAdmin,
  getAllUsers,
  getPendingUsers,
  approveUser,
  rejectUser,
  deleteUser,
  getSession,
} from '../auth.js';
import { createTeam, getAllTeams, inviteToTeam, deleteTeam } from '../teams.js';

// ============================================================
// HELPERS
// ============================================================

function adminInitials(name) {
  if (!name) return '?';
  return name.split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ============================================================
// RENDER
// ============================================================

export function render(container, ctx) {
  if (!isAdmin()) {
    container.innerHTML = `
      <div class="page-content flex flex-col items-center justify-center" style="min-height:60vh;">
        <p class="text-secondary text-lg">Acceso denegado</p>
        <button class="btn btn--primary btn--sm mt-4" data-action="go-home">Volver</button>
      </div>
    `;
    container.querySelector('[data-action="go-home"]')?.addEventListener('click', () => ctx.navigate('/home'));
    return () => {};
  }

  function renderPanel() {
    const allUsers = getAllUsers();
    const pending = getPendingUsers();
    const approved = allUsers.filter(u => u.approved);
    const teams = getAllTeams();
    const session = getSession();

    container.innerHTML = `
      <section class="view view--admin" data-view="admin" style="padding-bottom:var(--space-24);">

        <!-- HEADER -->
        <div class="card-glow animate-in" style="margin:var(--space-4);">
          <div class="flex items-center gap-3">
            <div style="color:var(--mars-red);">${icon('shield', 24)}</div>
            <div>
              <h3 class="font-display text-primary uppercase tracking" style="margin:0;font-size:var(--text-xl);">
                PANEL ADMIN
              </h3>
              <p class="text-secondary text-sm" style="margin:0;">${session?.name || 'Admin'}</p>
            </div>
          </div>
        </div>

        <!-- STATS -->
        <div class="grid grid-cols-3 gap-3 animate-in animate-in--stagger-1" style="margin:var(--space-4);">
          <div class="card-glow text-center" style="padding:var(--space-4);">
            <p class="stat-number stat-number--sm text-mars" style="font-size:var(--text-2xl);">${allUsers.length}</p>
            <p class="text-xs text-tertiary uppercase mt-1">Total</p>
          </div>
          <div class="card-glow text-center" style="padding:var(--space-4);">
            <p class="stat-number stat-number--sm" style="font-size:var(--text-2xl);color:#00E676;">${approved.length}</p>
            <p class="text-xs text-tertiary uppercase mt-1">Activos</p>
          </div>
          <div class="card-glow text-center" style="padding:var(--space-4);">
            <p class="stat-number stat-number--sm" style="font-size:var(--text-2xl);color:#FFD600;">${pending.length}</p>
            <p class="text-xs text-tertiary uppercase mt-1">Pendientes</p>
          </div>
        </div>

        <!-- PENDIENTES -->
        ${pending.length > 0 ? `
        <div class="card-glow animate-in animate-in--stagger-2" style="margin:var(--space-4);">
          <h4 class="font-display text-primary uppercase tracking mb-4" style="font-size:var(--text-lg);">
            ${icon('clock', 18)} Pendientes de aprobacion
          </h4>
          <div class="flex-col gap-3" style="display:flex;">
            ${pending.map(u => `
              <div class="flex items-center gap-3" style="padding:var(--space-3);border-radius:var(--radius-md);background:var(--bg-surface-raised);">
                <div class="avatar avatar--sm" style="background:rgba(255,214,0,0.15);color:#FFD600;">${adminInitials(u.name)}</div>
                <div class="flex-1" style="min-width:0;">
                  <div class="font-display text-sm text-primary uppercase">${u.name}</div>
                  <div class="text-xs text-tertiary" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${u.email}</div>
                  <div class="text-xs text-tertiary">${formatDate(u.createdAt)}</div>
                </div>
                <div class="flex gap-2">
                  <button class="btn btn--sm btn--pill" data-action="approve" data-email="${u.email}" style="background:#00E676;color:#000;font-weight:700;font-size:11px;">
                    ${icon('check', 14)} APROBAR
                  </button>
                  <button class="btn btn--ghost btn--sm btn--pill" data-action="reject" data-email="${u.email}" style="color:var(--color-destructive);font-size:11px;">
                    ${icon('x', 14)} RECHAZAR
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- TODOS LOS USUARIOS -->
        <div class="card-glow animate-in animate-in--stagger-3" style="margin:var(--space-4);">
          <h4 class="font-display text-primary uppercase tracking mb-4" style="font-size:var(--text-lg);">
            ${icon('users', 18)} Usuarios (${allUsers.length})
          </h4>
          <div class="flex-col gap-2" style="display:flex;">
            ${allUsers.map(u => {
              const isSelf = session && session.email.toLowerCase() === u.email.toLowerCase();
              return `
                <div class="flex items-center gap-3" style="padding:var(--space-2) var(--space-3);border-radius:var(--radius-md);background:var(--bg-surface-raised);">
                  <div class="avatar avatar--sm${u.isAdmin ? '' : ''}" style="${u.isAdmin ? 'background:rgba(218,7,4,0.15);color:var(--mars-red);' : ''}">${adminInitials(u.name)}</div>
                  <div class="flex-1" style="min-width:0;">
                    <div class="flex items-center gap-2">
                      <span class="font-display text-sm text-primary uppercase">${u.name}</span>
                      ${u.isAdmin ? `<span class="chip chip--active text-xs" style="font-size:10px;">ADMIN</span>` : ''}
                      <span class="chip text-xs" style="font-size:10px;${u.approved ? 'background:rgba(0,230,118,0.1);color:#00E676;' : 'background:rgba(255,214,0,0.1);color:#FFD600;'}">${u.approved ? 'ACTIVO' : 'PENDIENTE'}</span>
                    </div>
                    <div class="text-xs text-tertiary" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${u.email}</div>
                  </div>
                  ${!isSelf && !u.isAdmin ? `
                    <button class="btn btn--ghost btn--sm btn--pill" data-action="delete-user" data-email="${u.email}" style="color:var(--color-destructive);font-size:11px;" title="Eliminar usuario">
                      ${icon('trash', 14)}
                    </button>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- TEAMS -->
        <div class="card-glow animate-in animate-in--stagger-4" style="margin:var(--space-4);">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-display text-primary uppercase tracking" style="font-size:var(--text-lg);margin:0;">
              ${icon('users', 18)} Teams (${teams.length})
            </h4>
            <button class="btn btn--sm btn--pill" data-action="create-team" style="background:transparent;border:1.5px solid var(--mars-red);color:var(--mars-red);font-weight:700;">
              ${icon('plus', 14)} CREAR
            </button>
          </div>

          ${teams.length === 0 ? `
            <p class="text-tertiary text-sm text-center p-4">No hay teams creados.</p>
          ` : `
            <div class="flex-col gap-3" style="display:flex;">
              ${teams.map(t => `
                <div class="card-glow" style="padding:var(--space-3);margin:0;">
                  <div class="flex items-center justify-between mb-2">
                    <div>
                      <span class="font-display text-sm text-primary uppercase">${t.name}</span>
                      <span class="chip chip--active text-xs" style="margin-left:var(--space-2);font-size:10px;">${t.code}</span>
                    </div>
                    <button class="btn btn--ghost btn--sm btn--pill" data-action="delete-team" data-code="${t.code}" style="color:var(--color-destructive);font-size:11px;">
                      ${icon('trash', 14)}
                    </button>
                  </div>
                  <div class="text-xs text-tertiary mb-2">${t.members.length} miembro${t.members.length !== 1 ? 's' : ''}</div>
                  <div class="flex gap-1 flex-wrap mb-2">
                    ${t.members.map(m => `
                      <span class="chip text-xs" style="font-size:10px;">${m.name || m.email}</span>
                    `).join('')}
                  </div>
                  <div class="flex gap-2">
                    <input class="input" data-invite-input="${t.code}" type="email" placeholder="Email para invitar..." style="flex:1;font-size:var(--text-xs);padding:var(--space-2);">
                    <button class="btn btn--sm btn--pill" data-action="invite" data-code="${t.code}" style="background:var(--mars-red);color:#fff;font-weight:700;font-size:11px;">
                      ${icon('plus', 12)} INVITAR
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- BACK -->
        <div style="margin:var(--space-4);text-align:center;">
          <button class="btn btn--ghost btn--sm" data-action="go-home">
            ${icon('chevron-left', 14)} Volver al dashboard
          </button>
        </div>

      </section>
    `;

    bindEvents();
  }

  function bindEvents() {
    const section = container.querySelector('[data-view="admin"]');
    if (!section) return;

    section.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      const email = btn.dataset.email;
      const code = btn.dataset.code;

      if (action === 'approve' && email) {
        approveUser(email);
        renderPanel();
      }

      if (action === 'reject' && email) {
        rejectUser(email);
        renderPanel();
      }

      if (action === 'delete-user' && email) {
        if (confirm('Eliminar usuario ' + email + '?')) {
          deleteUser(email);
          renderPanel();
        }
      }

      if (action === 'go-home') {
        ctx.navigate('/home');
      }

      if (action === 'create-team') {
        const name = prompt('Nombre del team:');
        if (name) {
          createTeam(name);
          renderPanel();
        }
      }

      if (action === 'delete-team' && code) {
        if (confirm('Eliminar team ' + code + '?')) {
          deleteTeam(code);
          renderPanel();
        }
      }

      if (action === 'invite' && code) {
        const input = section.querySelector(`[data-invite-input="${code}"]`);
        if (input && input.value) {
          const result = inviteToTeam(code, input.value);
          if (result.ok) {
            renderPanel();
          } else {
            alert(result.error);
          }
        }
      }
    });
  }

  // INIT
  renderPanel();

  return () => {};
}
