/**
 * MARS FIT v3 — Sistema de Insignias + Nivel Recolector→Cazador
 *
 * 1. INSIGNIAS: emojis divertidos que puedes asignar a compañeros del team
 * 2. NIVEL: barra progresiva de Recolector (🧑‍🌾) a Cazador (🏹) basada en entrenos + nutrición
 */

// ============================================================
// INSIGNIAS DISPONIBLES (emojis WhatsApp-style)
// ============================================================

export const BADGES = [
  // Divertidas / animales
  { id: 'gorila',       emoji: '🦍', name: 'Lomo Plateado',    desc: 'Bestia absoluta en el gym' },
  { id: 'leon',         emoji: '🦁', name: 'Rey de la Selva',  desc: 'Lidera la manada' },
  { id: 'cerdo',        emoji: '🐷', name: 'Cerdito',          desc: 'Se ha saltado la dieta...' },
  { id: 'oveja',        emoji: '🐑', name: 'Ovejita',          desc: 'Sigue al rebaño sin pensar' },
  { id: 'tortuga',      emoji: '🐢', name: 'Bro Tortuga',      desc: 'Lento pero seguro' },
  { id: 'gallina',      emoji: '🐔', name: 'Gallina',          desc: 'Se rajo del entreno' },
  { id: 'toro',         emoji: '🐂', name: 'Toro Bravo',       desc: 'No para ni con lluvia' },
  { id: 'serpiente',    emoji: '🐍', name: 'Serpiente',         desc: 'Sigiloso, nadie lo ve venir' },
  { id: 'aguila',       emoji: '🦅', name: 'Aguila Real',      desc: 'Vista de halcon para los macros' },
  { id: 'tiburon',      emoji: '🦈', name: 'Tiburon',          desc: 'Depredador del hierro' },

  // Personas / roles
  { id: 'princesa',     emoji: '👸', name: 'Princesa',         desc: 'Demasiado fino para sudar' },
  { id: 'rey',          emoji: '🤴', name: 'Rey',              desc: 'Manda en el gym' },
  { id: 'payaso',       emoji: '🤡', name: 'Payaso',           desc: 'Dice que entrena pero...' },
  { id: 'fantasma',     emoji: '👻', name: 'Fantasma',         desc: 'Desaparecido del gym' },
  { id: 'zombie',       emoji: '🧟', name: 'Zombie',           desc: 'Entrena medio muerto' },
  { id: 'ninja',        emoji: '🥷', name: 'Ninja',            desc: 'Entra y sale sin que lo vean' },
  { id: 'superhero',    emoji: '🦸', name: 'Superheroe',       desc: 'Record personal roto' },
  { id: 'mago',         emoji: '🧙', name: 'Mago',             desc: 'Hace magia con los pesos' },
  { id: 'bebe',         emoji: '👶', name: 'Bebe Gym',         desc: 'Recien nacido en el hierro' },
  { id: 'anciano',      emoji: '🧓', name: 'Abuelo Gains',     desc: 'Veterano del hierro' },

  // Comida / estado
  { id: 'broccoli',     emoji: '🥦', name: 'Brocoli Man',      desc: 'Dieta perfecta, ni un fallo' },
  { id: 'pizza',        emoji: '🍕', name: 'Pizza Lover',      desc: 'La dieta puede esperar' },
  { id: 'fuego',        emoji: '🔥', name: 'En Llamas',        desc: 'Racha imparable' },
  { id: 'hielo',        emoji: '🥶', name: 'Congelado',        desc: 'Lleva dias sin aparecer' },
  { id: 'cohete',       emoji: '🚀', name: 'Cohete',           desc: 'Progreso a toda velocidad' },
  { id: 'medalla',      emoji: '🏅', name: 'Medalla de Oro',   desc: 'El mejor de la semana' },
  { id: 'craneo',       emoji: '💀', name: 'Muerto',           desc: 'Ese entreno lo destrozo' },
  { id: 'corona',       emoji: '👑', name: 'Corona',           desc: 'El rey indiscutible' },
  { id: 'cadena',       emoji: '⛓️', name: 'Encadenado',       desc: 'Adicto al gym' },
  { id: 'dormilon',     emoji: '😴', name: 'Dormilon',         desc: 'Prefiere la cama al gym' },
];

// ============================================================
// NIVEL: RECOLECTOR → CAZADOR
// ============================================================
// El nivel se calcula con XP basado en:
// - Cada workout completado: +50 XP
// - Cada dia con dieta cumplida (>80% kcal): +30 XP
// - Racha consecutiva de dias entrenando: +10 XP por dia de racha
// - Cada comida registrada: +5 XP
//
// Niveles (10 niveles de Recolector a Cazador):
// 0-99     XP → Recolector         🧑‍🌾
// 100-299  XP → Campesino           🌾
// 300-599  XP → Forrajeador         🍂
// 600-999  XP → Explorador          🧭
// 1000-1499XP → Rastreador          🐾
// 1500-2099XP → Arquero             🏹
// 2100-2799XP → Guerrero            ⚔️
// 3000-3999XP → Gladiador           🛡️
// 4000-5499XP → Espartano           ⚡
// 5500+    XP → Cazador             🎯
// ============================================================

export const LEVELS = [
  { minXP: 0,    name: 'Recolector',   emoji: '🧑‍🌾', color: '#8B7355' },
  { minXP: 100,  name: 'Campesino',    emoji: '🌾',   color: '#A0956B' },
  { minXP: 300,  name: 'Forrajeador',  emoji: '🍂',   color: '#B8860B' },
  { minXP: 600,  name: 'Explorador',   emoji: '🧭',   color: '#CD853F' },
  { minXP: 1000, name: 'Rastreador',   emoji: '🐾',   color: '#DAA520' },
  { minXP: 1500, name: 'Arquero',      emoji: '🏹',   color: '#FF8C00' },
  { minXP: 2100, name: 'Guerrero',     emoji: '⚔️',   color: '#FF4500' },
  { minXP: 3000, name: 'Cazador',      emoji: '🎯',   color: '#DAA520' },
  { minXP: 4000, name: 'Gladiador',    emoji: '🛡️',   color: '#DC143C' },
  { minXP: 5500, name: 'Espartano',    emoji: '⚡',    color: '#FFD700' },
];

/**
 * Calcula XP total del usuario a partir de su historial.
 * @param {Object} state - El estado de la app (workouts, meals, etc.)
 */
export function computeXP(state) {
  let xp = 0;

  // +50 por cada workout
  const workouts = state.workouts || [];
  xp += workouts.length * 50;

  // +5 por cada comida registrada
  const meals = state.meals || [];
  xp += meals.length * 5;

  // Racha de dias consecutivos entrenando
  const streak = computeStreak(workouts);
  xp += streak * 10;

  // +30 por cada dia con dieta cumplida (simplificado: dia con 3+ comidas)
  const mealDays = new Set(meals.map(m => m.date));
  const goodDietDays = [...mealDays].filter(date => {
    const dayMeals = meals.filter(m => m.date === date);
    return dayMeals.length >= 3;
  });
  xp += goodDietDays.length * 30;

  return xp;
}

function computeStreak(workouts) {
  if (!workouts.length) return 0;
  const dates = [...new Set(workouts.map(w => w.date))].sort().reverse();
  let streak = 0;
  const today = new Date().toISOString().slice(0, 10);
  let check = today;

  for (const date of dates) {
    if (date === check || date === prevDay(check)) {
      streak++;
      check = date;
    } else break;
  }
  return streak;
}

function prevDay(dateStr) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Retorna el nivel actual del usuario.
 */
export function getLevel(xp) {
  let level = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.minXP) level = l;
    else break;
  }
  return level;
}

/**
 * Retorna el siguiente nivel y el % de progreso hacia él.
 */
export function getLevelProgress(xp) {
  const current = getLevel(xp);
  const currentIdx = LEVELS.indexOf(current);
  const next = LEVELS[currentIdx + 1] || null;

  if (!next) {
    return { current, next: null, percent: 100, xpToNext: 0 };
  }

  const xpInLevel = xp - current.minXP;
  const xpForLevel = next.minXP - current.minXP;
  const percent = Math.min(100, Math.round((xpInLevel / xpForLevel) * 100));

  return {
    current,
    next,
    percent,
    xpToNext: next.minXP - xp
  };
}

/**
 * Renderiza la barra de nivel como HTML.
 */
export function renderLevelBar(xp) {
  const { current, next, percent, xpToNext } = getLevelProgress(xp);
  const maxLevel = !next;

  return `
    <div style="padding:16px 0;">
      <!-- Nivel actual -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:28px;">${current.emoji}</span>
          <div>
            <div style="font-family:var(--font-display,sans-serif);font-weight:700;font-size:16px;text-transform:uppercase;letter-spacing:0.06em;color:${current.color};">${current.name}</div>
            <div style="font-size:11px;color:#888;font-family:var(--font-display,sans-serif);letter-spacing:0.08em;">${xp} XP</div>
          </div>
        </div>
        ${next ? `
          <div style="display:flex;align-items:center;gap:8px;opacity:0.5;">
            <div style="text-align:right;">
              <div style="font-family:var(--font-display,sans-serif);font-size:12px;color:#666;text-transform:uppercase;letter-spacing:0.06em;">${next.name}</div>
              <div style="font-size:10px;color:#555;">Faltan ${xpToNext} XP</div>
            </div>
            <span style="font-size:22px;">${next.emoji}</span>
          </div>
        ` : `<span style="font-size:22px;">🏆</span>`}
      </div>

      <!-- Barra de progreso -->
      <div style="position:relative;height:12px;background:rgba(255,255,255,0.08);border-radius:999px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);">
        <div style="height:100%;width:${percent}%;background:linear-gradient(90deg, ${current.color}, ${next ? next.color : '#FFD700'});border-radius:999px;transition:width 0.8s cubic-bezier(0.34,1.56,0.64,1);position:relative;">
          <div style="position:absolute;top:0;right:0;bottom:0;width:30px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3));border-radius:999px;animation:shimmerSlide 1.5s ease-in-out infinite;"></div>
        </div>
      </div>

      <!-- Escalones -->
      <div style="display:flex;justify-content:space-between;margin-top:6px;padding:0 2px;">
        <span style="font-size:14px;" title="Recolector">🧑‍🌾</span>
        <span style="font-size:10px;color:#555;">·</span>
        <span style="font-size:14px;" title="Explorador">🧭</span>
        <span style="font-size:10px;color:#555;">·</span>
        <span style="font-size:14px;" title="Guerrero">⚔️</span>
        <span style="font-size:10px;color:#555;">·</span>
        <span style="font-size:14px;" title="Cazador">🎯</span>
        <span style="font-size:10px;color:#555;">·</span>
        <span style="font-size:14px;" title="Gladiador">🛡️</span>
        <span style="font-size:10px;color:#555;">·</span>
        <span style="font-size:14px;" title="Espartano">⚡</span>
      </div>

      ${maxLevel ? `<div style="text-align:center;margin-top:8px;font-size:13px;color:#FFD700;font-weight:700;font-family:var(--font-display,sans-serif);letter-spacing:0.1em;text-transform:uppercase;">⚡ NIVEL MAXIMO: ESPARTANO ⚡</div>` : ''}
    </div>
  `;
}

// ============================================================
// INSIGNIAS: Guardar/leer asignaciones
// ============================================================

const BADGE_STORE_KEY = 'marsfit_badges';

/**
 * Asignar una insignia a un compañero.
 * @param {string} fromEmail - quien la da
 * @param {string} toEmail - quien la recibe
 * @param {string} badgeId - id de la insignia
 */
export function giveBadge(fromEmail, toEmail, badgeId) {
  const all = getBadgeHistory();
  all.push({
    from: fromEmail,
    to: toEmail,
    badgeId,
    timestamp: Date.now()
  });
  localStorage.setItem(BADGE_STORE_KEY, JSON.stringify(all));
}

export function getBadgeHistory() {
  try { return JSON.parse(localStorage.getItem(BADGE_STORE_KEY) || '[]'); }
  catch { return []; }
}

/**
 * Obtener insignias recibidas por un usuario.
 */
export function getBadgesForUser(email) {
  return getBadgeHistory().filter(b => b.to === email);
}

/**
 * Obtener la insignia más reciente de un usuario (para mostrar junto a su nombre).
 */
export function getLatestBadge(email) {
  const badges = getBadgesForUser(email);
  if (!badges.length) return null;
  const latest = badges[badges.length - 1];
  return BADGES.find(b => b.id === latest.badgeId) || null;
}

/**
 * Renderiza el selector de insignias como HTML (grid de emojis clickeables).
 */
export function renderBadgePicker(targetEmail, onSelect) {
  const id = 'badge-picker-' + Date.now();
  return `
    <div id="${id}" style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px;padding:12px;">
      ${BADGES.map(b => `
        <button data-badge-id="${b.id}" data-target="${targetEmail}"
                title="${b.name}: ${b.desc}"
                style="font-size:28px;background:none;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:8px 4px;cursor:pointer;transition:all 0.15s ease;text-align:center;line-height:1;"
                onmouseover="this.style.borderColor='rgba(218,7,4,0.4)';this.style.transform='scale(1.15)';this.style.boxShadow='0 0 16px rgba(218,7,4,0.2)'"
                onmouseout="this.style.borderColor='rgba(255,255,255,0.08)';this.style.transform='';this.style.boxShadow=''"
        >${b.emoji}</button>
      `).join('')}
    </div>
    <div style="text-align:center;font-size:11px;color:#666;padding:4px 0;font-family:var(--font-display,sans-serif);letter-spacing:0.06em;text-transform:uppercase;">Toca para asignar insignia</div>
  `;
}
