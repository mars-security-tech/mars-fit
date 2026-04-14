/**
 * MARS FIT v3 — Teams (grupos)
 *
 * Equipos se guardan en localStorage 'marsfit_teams'
 * Cada team tiene: code, name, createdBy, members[]
 */

import { getSession } from './auth.js';

const TEAMS_KEY = 'marsfit_teams';

// ============================================================
// STORAGE
// ============================================================

function _loadTeams() {
  try {
    const raw = localStorage.getItem(TEAMS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function _saveTeams(teams) {
  try {
    localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
  } catch (e) {
    console.warn('[Teams] Error guardando:', e);
  }
}

// ============================================================
// HELPERS
// ============================================================

/** Genera codigo aleatorio de 6 chars */
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'MARS-';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// ============================================================
// API PUBLICA
// ============================================================

/** Crear un team. El creador es admin del team. */
export function createTeam(name) {
  const session = getSession();
  if (!session) return { ok: false, error: 'No autenticado' };

  const teams = _loadTeams();
  const code = generateCode();

  const team = {
    code,
    name: name || 'Nuevo team',
    createdBy: session.email,
    createdAt: new Date().toISOString(),
    members: [
      { email: session.email, name: session.name, role: 'admin', joinedAt: new Date().toISOString() },
    ],
  };

  teams.push(team);
  _saveTeams(teams);
  return { ok: true, team };
}

/** Invitar a un usuario por email a un team */
export function inviteToTeam(teamCode, email) {
  const session = getSession();
  if (!session) return { ok: false, error: 'No autenticado' };

  const teams = _loadTeams();
  const team = teams.find(t => t.code === teamCode);
  if (!team) return { ok: false, error: 'Team no encontrado' };

  // Check if already member
  if (team.members.find(m => m.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: 'Ya es miembro del team' };
  }

  team.members.push({
    email: email.toLowerCase(),
    name: email.split('@')[0],
    role: 'member',
    joinedAt: new Date().toISOString(),
  });

  _saveTeams(teams);
  return { ok: true };
}

/** Obtener teams del usuario actual */
export function getMyTeams() {
  const session = getSession();
  if (!session) return [];

  const teams = _loadTeams();
  return teams.filter(t =>
    t.members.some(m => m.email.toLowerCase() === session.email.toLowerCase())
  );
}

/** Obtener miembros de un team */
export function getTeamMembers(teamCode) {
  const teams = _loadTeams();
  const team = teams.find(t => t.code === teamCode);
  return team ? team.members : [];
}

/** Obtener todos los teams (para admin) */
export function getAllTeams() {
  return _loadTeams();
}

/** Eliminar un team */
export function deleteTeam(teamCode) {
  const teams = _loadTeams();
  const idx = teams.findIndex(t => t.code === teamCode);
  if (idx === -1) return { ok: false, error: 'Team no encontrado' };
  teams.splice(idx, 1);
  _saveTeams(teams);
  return { ok: true };
}
