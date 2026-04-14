/**
 * MARS FIT v3 — Vista Circle (Team social)
 *
 * Strava clubs + Whoop teams inspired.
 * Leaderboard semanal, retos activos, feed de actividad, "picadas".
 */

import { icon } from '../icons.js';
import { animateCounter } from '../charts-v3.js';
import { BADGES, giveBadge, getLatestBadge, renderBadgePicker, computeXP, getLevel, renderLevelBar } from '../badges.js';
import {
  getConfig,
  subscribe,
  getAllWorkouts,
  getMealsInRange,
  computeStreak,
  today,
} from '../store-v3.js';

// ============================================================
// HELPERS
// ============================================================

/** Build initials from a name string */
function initials(name) {
  return name.split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

/** Format relative time label */
function relativeTime(timeStr) {
  if (!timeStr) return '';
  return timeStr;
}

/** Generate a deterministic score for demo members */
function demoScore(memberId) {
  const scores = { marcos: 92, laura: 78, david: 64, me: 45 };
  return scores[memberId] ?? Math.floor(Math.random() * 60 + 20);
}

/** Medal icon by rank (1-indexed) */
function rankIcon(rank) {
  if (rank === 1) return icon('trophy', 18);
  if (rank === 2) return icon('star', 18);
  if (rank === 3) return icon('shield', 18);
  return `<span class="text-tertiary text-sm font-display" style="min-width:18px;text-align:center;">${rank}</span>`;
}

/** Rank-specific colors */
function rankGlow(rank) {
  if (rank === 1) return 'box-shadow:0 0 20px rgba(255,215,0,0.4);';
  if (rank === 2) return 'box-shadow:0 0 16px rgba(192,192,192,0.3);';
  if (rank === 3) return 'box-shadow:0 0 16px rgba(205,127,50,0.3);';
  return '';
}

function rankBarColor(rank) {
  if (rank === 1) return 'background:linear-gradient(90deg,#FFD700,#FFA500);';
  if (rank === 2) return 'background:linear-gradient(90deg,#C0C0C0,#A0A0A0);';
  if (rank === 3) return 'background:linear-gradient(90deg,#CD7F32,#B8860B);';
  return '';
}

function rankAvatarBorder(rank) {
  if (rank === 1) return 'border:2px solid #FFD700;';
  if (rank === 2) return 'border:2px solid #C0C0C0;';
  if (rank === 3) return 'border:2px solid #CD7F32;';
  return '';
}

/** Challenge progress bar colors */
const CHALLENGE_COLORS = ['#FF6B2C', '#00E676', '#FFD600', '#FF2D6B', '#B44AFF'];

// ============================================================
// DEMO CHALLENGES
// ============================================================

const CHALLENGES = [
  {
    id: 'streak30',
    icon: 'flame',
    color: 'var(--color-activity)',
    title: '30 dias sin faltar',
    current: 11,
    target: 30,
  },
  {
    id: 'bench100',
    icon: 'dumbbell',
    color: 'var(--color-strength)',
    title: 'Reto fuerza: 100 kg bench press',
    current: 80,
    target: 100,
    unit: 'kg',
  },
];

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
  const circle = config.circle || {};
  const members = circle.members || [];
  const feed = circle.feed || [];

  // --- Compute leaderboard with scores ---
  const leaderboard = members
    .map(m => ({ ...m, pts: demoScore(m.id) }))
    .sort((a, b) => b.pts - a.pts);

  const maxPts = leaderboard[0]?.pts || 1;

  // --- Build HTML ---
  container.innerHTML = `
    <section class="view view--circle" data-view="circle" style="padding-bottom:var(--space-24);">

      <!-- HEADER -->
      <div class="card-glow animate-in" style="margin:var(--space-4);">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="font-display text-primary uppercase tracking" style="margin:0;">
              ${icon('users', 20)} ${circle.name || 'Mi team'}
            </h3>
            <div class="flex items-center gap-2 mt-2">
              <span class="chip chip--active" data-copy-code role="button" tabindex="0" aria-label="Copiar codigo de team">
                ${icon('copy', 14)} ${circle.code || 'MARS-XXXX'}
              </span>
              <span class="text-tertiary text-sm">${members.length} miembros</span>
            </div>
          </div>
          <button class="btn btn--sm btn--pill" data-action="invite" aria-label="Invitar al team"
                  style="background:transparent;border:1.5px solid var(--mars-red);color:var(--mars-red);font-weight:700;text-transform:uppercase;letter-spacing:0.04em;transition:all 0.3s ease;box-shadow:none;"
                  onmouseenter="this.style.boxShadow='0 0 16px rgba(218,7,4,0.4),0 0 4px rgba(218,7,4,0.2)';this.style.background='rgba(218,7,4,0.08)';"
                  onmouseleave="this.style.boxShadow='none';this.style.background='transparent';">
            ${icon('plus', 16)} INVITAR
          </button>
        </div>
        <!-- Member avatars row -->
        <div class="flex gap-2" style="margin-top:var(--space-2);">
          ${members.map(m => `
            <div class="avatar avatar--sm avatar--ring" title="${m.name}" aria-label="${m.name}">
              ${m.initials || initials(m.name)}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- LEADERBOARD -->
      <div class="card-glow animate-in animate-in--stagger-1" style="margin:var(--space-4);">
        <h4 class="font-display text-primary uppercase tracking mb-4" style="font-size:var(--text-lg);">
          ${icon('trophy', 18)} Leaderboard semanal
        </h4>
        <div class="flex-col gap-3" style="display:flex;">
          ${leaderboard.map((m, i) => {
            const rank = i + 1;
            const pct = Math.round((m.pts / maxPts) * 100);
            const isMe = m.id === 'me';
            return `
              <div class="flex items-center gap-3${isMe ? ' p-2 rounded-lg' : ''}" style="${isMe ? 'background:var(--bg-surface-raised);' : ''}">
                <div style="min-width:24px;display:flex;justify-content:center;${rank <= 3 ? 'color:' + (rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32') + ';' : ''}">
                  ${rankIcon(rank)}
                </div>
                <div class="avatar avatar--sm${rank <= 3 ? ' avatar--ring' : ''}" aria-hidden="true" style="${rankGlow(rank)}${rankAvatarBorder(rank)}">
                  ${m.initials || initials(m.name)}
                </div>
                <div class="flex-1" style="min-width:0;">
                  <div class="flex items-center justify-between mb-1">
                    <span class="font-display text-sm uppercase${isMe ? ' text-mars' : ' text-primary'}">${m.name}</span>
                    ${(() => { const b = getLatestBadge(m.id); return b ? `<span title="${b.name}: ${b.desc}" style="font-size:16px;cursor:help;">${b.emoji}</span>` : ''; })()}
                    ${!isMe ? `<button data-action="give-badge" data-member-id="${m.id}" data-member-name="${m.name}" class="btn btn--ghost btn--icon" style="width:24px;height:24px;padding:0;font-size:14px;border-radius:8px;" title="Dar insignia">🏷️</button>` : ''}
                    <span class="stat-number stat-number--sm font-display" data-counter="${m.pts}" style="font-size:var(--text-base);">0</span>
                    <span class="text-tertiary text-xs" style="margin-left:2px;">pts</span>
                  </div>
                  <div class="progress-bar progress-bar--thin" style="overflow:hidden;border-radius:4px;">
                    <div class="progress-bar__fill" style="width:0%;${rankBarColor(rank)}transition:width 0.8s cubic-bezier(0.16,1,0.3,1);" data-target-width="${pct}%"></div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- RETOS ACTIVOS -->
      <div class="card-glow animate-in animate-in--stagger-2" style="margin:var(--space-4);">
        <h4 class="font-display text-primary uppercase tracking mb-4" style="font-size:var(--text-lg);">
          ${icon('target', 18)} Retos activos
        </h4>
        <div class="flex-col gap-3" style="display:flex;">
          ${CHALLENGES.map((ch, chIdx) => {
            const pct = Math.round((ch.current / ch.target) * 100);
            const barColor = CHALLENGE_COLORS[chIdx % CHALLENGE_COLORS.length];
            return `
              <div class="card-glow" style="padding:var(--space-4);margin:0;">
                <div class="flex items-center gap-3 mb-2">
                  <div style="color:${ch.color};">${icon(ch.icon, 20)}</div>
                  <span class="font-display text-sm uppercase text-primary">${ch.title}</span>
                </div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-secondary text-sm">
                    ${ch.unit ? ch.current + '/' + ch.target + ' ' + ch.unit : 'Dia ' + ch.current + '/' + ch.target}
                  </span>
                  <span style="display:inline-flex;align-items:center;padding:2px 10px;border-radius:var(--radius-pill);font-size:11px;font-weight:700;font-family:var(--font-display);color:#fff;background:${barColor};box-shadow:0 0 8px ${barColor}44;">${pct}%</span>
                </div>
                <div class="progress-bar progress-bar--thick" style="overflow:hidden;border-radius:6px;background:var(--bg-surface-raised);">
                  <div class="progress-bar__fill" style="width:0%;background:linear-gradient(90deg,${barColor},${barColor}cc);box-shadow:0 0 8px ${barColor}66;transition:width 0.8s cubic-bezier(0.16,1,0.3,1);" data-target-width="${pct}%"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- FEED DE ACTIVIDAD -->
      <div class="card-glow animate-in animate-in--stagger-3" style="margin:var(--space-4);">
        <h4 class="font-display text-primary uppercase tracking mb-4" style="font-size:var(--text-lg);">
          ${icon('zap', 18)} Feed de actividad
        </h4>
        <div class="flex-col gap-3" style="display:flex;" data-feed-list>
          ${feed.length === 0
            ? `<p class="text-tertiary text-sm text-center p-4">Sin actividad reciente en tu team.</p>`
            : feed.map((item, idx) => {
                const member = members.find(m => m.id === item.who) || { name: item.who, initials: initials(item.who) };
                const isFire = item.kind === 'fire';
                const badgeStyle = isFire
                  ? 'background:rgba(218,7,4,0.15);color:var(--color-activity);box-shadow:0 0 8px rgba(218,7,4,0.25);'
                  : 'background:rgba(0,230,118,0.12);color:var(--color-success);box-shadow:0 0 8px rgba(0,230,118,0.2);';
                const badgeLabel = isFire ? 'FIRE' : 'OK';
                const badgeIcon = isFire ? icon('flame', 12) : icon('check', 12);
                return `
                  <div class="flex gap-3 animate-in animate-in--stagger-${Math.min(idx + 4, 8)}" style="padding:var(--space-3);border-radius:var(--radius-md);background:var(--bg-surface-raised);">
                    <div class="avatar avatar--sm avatar--ring" aria-hidden="true">${member.initials}</div>
                    <div class="flex-1" style="min-width:0;">
                      <div class="flex items-center gap-2 mb-1">
                        <span class="font-display text-sm uppercase text-primary">${member.name}</span>
                        <span style="display:inline-flex;align-items:center;gap:2px;padding:2px 8px;border-radius:var(--radius-pill);font-size:10px;font-weight:700;font-family:var(--font-display);letter-spacing:0.04em;${badgeStyle}">${badgeIcon} ${badgeLabel}</span>
                        <span class="text-tertiary text-xs" style="margin-left:auto;">${relativeTime(item.time)}</span>
                      </div>
                      <p class="text-secondary text-sm" style="margin:0;">${item.text}</p>
                      <div class="flex gap-2 mt-2">
                        <button class="btn btn--ghost btn--sm btn--pill" data-action="poke" data-feed-idx="${idx}" aria-label="Picar" style="position:relative;overflow:visible;">
                          ${icon('flame', 14)} <span>PICAR</span> <span class="poke-count text-xs text-mars" data-poke-count="${idx}">0</span>
                        </button>
                        <button class="btn btn--ghost btn--sm btn--pill" data-action="comment" data-feed-idx="${idx}" aria-label="Comentar">
                          ${icon('edit', 14)} COMENTAR
                        </button>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')
          }
        </div>
      </div>

    </section>
  `;

  // ============================================================
  // POST-RENDER: Animate counters, progress bars, interactions
  // ============================================================

  const section = container.querySelector('[data-view="circle"]');
  if (!section) return () => {};

  // -- Animate counters --
  requestAnimationFrame(() => {
    section.querySelectorAll('[data-counter]').forEach(el => {
      const target = parseInt(el.dataset.counter, 10);
      animateCounter(el, target, { duration: 900, suffix: '' });
    });

    // -- Animate progress bars --
    section.querySelectorAll('[data-target-width]').forEach(bar => {
      requestAnimationFrame(() => {
        bar.style.width = bar.dataset.targetWidth;
      });
    });
  });

  // -- Poke counters (local state) --
  const pokeCounts = {};

  function handlePoke(idx) {
    pokeCounts[idx] = (pokeCounts[idx] || 0) + 1;
    const countEl = section.querySelector(`[data-poke-count="${idx}"]`);
    if (countEl) {
      animateCounter(countEl, pokeCounts[idx], { duration: 300 });
    }

    // Fire float effect with emoji
    const btn = section.querySelector(`[data-action="poke"][data-feed-idx="${idx}"]`);
    if (btn) {
      const particle = document.createElement('span');
      particle.textContent = '\uD83D\uDD25';
      particle.style.cssText = `
        position:absolute;
        pointer-events:none;
        font-size:20px;
        left:50%;
        top:0;
        transform:translateX(-50%);
        animation:fireFloat 800ms ease-out forwards;
        z-index:10;
      `;
      btn.style.position = 'relative';
      btn.appendChild(particle);
      setTimeout(() => particle.remove(), 850);
    }
  }

  // -- Copy code to clipboard --
  function handleCopyCode() {
    const code = circle.code || '';
    if (navigator.clipboard && code) {
      navigator.clipboard.writeText(code).then(() => {
        const chip = section.querySelector('[data-copy-code]');
        if (chip) {
          const orig = chip.innerHTML;
          chip.innerHTML = `${icon('check', 14)} Copiado`;
          chip.classList.add('chip--success');
          chip.classList.remove('chip--active');
          setTimeout(() => {
            chip.innerHTML = orig;
            chip.classList.remove('chip--success');
            chip.classList.add('chip--active');
          }, 1500);
        }
      });
    }
  }

  // -- Event delegation --
  function handleClick(e) {
    const pokeBtn = e.target.closest('[data-action="poke"]');
    if (pokeBtn) {
      e.preventDefault();
      handlePoke(pokeBtn.dataset.feedIdx);
      return;
    }

    const commentBtn = e.target.closest('[data-action="comment"]');
    if (commentBtn) {
      e.preventDefault();
      // Placeholder: could open a bottom sheet
      return;
    }

    const copyBtn = e.target.closest('[data-copy-code]');
    if (copyBtn) {
      e.preventDefault();
      handleCopyCode();
      return;
    }

    const inviteBtn = e.target.closest('[data-action="invite"]');
    if (inviteBtn) {
      e.preventDefault();
      handleCopyCode();
      return;
    }

    // Give badge
    const badgeBtn = e.target.closest('[data-action="give-badge"]');
    if (badgeBtn) {
      e.preventDefault();
      const memberId = badgeBtn.dataset.memberId;
      const memberName = badgeBtn.dataset.memberName;
      showBadgePicker(memberId, memberName);
      return;
    }

    // Badge picker selection
    const badgeSelect = e.target.closest('[data-badge-id]');
    if (badgeSelect) {
      e.preventDefault();
      const badgeId = badgeSelect.dataset.badgeId;
      const target = badgeSelect.dataset.target;
      const config = getConfig();
      giveBadge(config.profile?.email || 'me', target, badgeId);
      const badge = BADGES.find(b => b.id === badgeId);
      // Close picker and show confirmation
      const picker = section.querySelector('#badge-picker-modal');
      if (picker) picker.remove();
      // Show floating emoji
      const toast = document.createElement('div');
      toast.textContent = `${badge?.emoji} → ${target}`;
      toast.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:rgba(218,7,4,0.9);color:#fff;padding:10px 20px;border-radius:12px;font-size:16px;z-index:9999;animation:fadeSlideIn 0.3s ease;';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
      return;
    }
  }

  function showBadgePicker(memberId, memberName) {
    // Remove existing picker
    const existing = section.querySelector('#badge-picker-modal');
    if (existing) { existing.remove(); return; }

    const modal = document.createElement('div');
    modal.id = 'badge-picker-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:9998;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,0.6);backdrop-filter:blur(8px);';
    modal.innerHTML = `
      <div style="width:100%;max-width:560px;background:var(--bg-surface-card, var(--bg-surface));border-radius:20px 20px 0 0;padding:16px;max-height:60vh;overflow-y:auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <h4 style="font-family:var(--font-display,sans-serif);font-size:16px;text-transform:uppercase;letter-spacing:0.06em;">Insignia para ${memberName}</h4>
          <button onclick="this.closest('#badge-picker-modal').remove()" style="background:none;border:none;color:var(--text-tertiary);font-size:24px;cursor:pointer;">✕</button>
        </div>
        ${renderBadgePicker(memberId)}
      </div>
    `;
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    section.appendChild(modal);
  }

  // -- Keyboard support --
  function handleKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      const copyBtn = e.target.closest('[data-copy-code]');
      if (copyBtn) {
        e.preventDefault();
        handleCopyCode();
      }
    }
  }

  section.addEventListener('click', handleClick);
  section.addEventListener('keydown', handleKeydown);

  // -- Inject fire float animation if not present --
  if (!document.getElementById('mars-circle-style')) {
    const style = document.createElement('style');
    style.id = 'mars-circle-style';
    style.textContent = `
      @keyframes fireFloat {
        0%   { opacity:1; transform:translateX(-50%) translateY(0) scale(1); }
        60%  { opacity:0.8; transform:translateX(-50%) translateY(-28px) scale(1.3); }
        100% { opacity:0; transform:translateX(-50%) translateY(-48px) scale(1.5); }
      }
      @keyframes pokeFloat {
        0%   { opacity:1; transform:translateY(0) scale(1); }
        100% { opacity:0; transform:translateY(-32px) scale(1.4); }
      }
    `;
    document.head.appendChild(style);
  }

  // -- Store subscription (re-render if circle data changes) --
  const unsub = subscribe((cfg) => {
    // Could do a granular diff here; for now, full re-render on circle changes
  }, 'circle');

  // ============================================================
  // CLEANUP
  // ============================================================

  return () => {
    section.removeEventListener('click', handleClick);
    section.removeEventListener('keydown', handleKeydown);
    unsub();
  };
}
