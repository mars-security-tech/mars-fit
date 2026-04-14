// Escuadrón · feed social + ranking
import { getState, setState } from "../store.js";

export function renderCircle(root) {
  const s = getState();
  const c = s.circle;
  const isOp = s.profile.role === "operativo";

  // Ranking ficticio: mezcla progreso ponderado
  const ranking = c.members.map((m, i) => ({
    ...m,
    score: m.id === 'me' ? (s.workouts.length * 10 + 20) : (100 - i * 18)
  })).sort((a,b) => b.score - a.score);

  root.innerHTML = `
    <div class="section-head"><h2>${isOp ? "Escuadrón MĀRS" : "Mi escuadrón"}</h2></div>

    <div class="card">
      <div class="row between">
        <div>
          <span class="tag-title">${isOp ? "UNIDAD" : "CÍRCULO"}</span>
          <div class="subtitle-under-tag">${c.name}</div>
          <small>CÓDIGO: <b style="color:#fff">${c.code}</b> · compártelo con tu gente</small>
        </div>
        <button class="btn small ghost" id="invite">INVITAR +</button>
      </div>
    </div>

    <h3>Ranking semanal</h3>
    <div class="card flat">
      ${ranking.map((m, i) => `
        <div class="feed-item" style="padding:10px 0;border:none">
          <div class="avatar ${i>0?'dark':''}">${i+1}</div>
          <div style="flex:1">
            <b>${m.name}</b>
            <div class="progress mt"><div style="width:${Math.min(100, m.score)}%"></div></div>
          </div>
          <div style="font-family:var(--font-title);color:var(--mars-red);font-weight:700">${Math.min(100,m.score)}</div>
        </div>
      `).join("")}
    </div>

    <h3>Actividad reciente</h3>
    <div class="card flat" style="padding:0">
      ${c.feed.map(f => {
        const who = c.members.find(m => m.id === f.who);
        return `<div class="feed-item">
          <div class="avatar ${f.kind==='ok'?'dark':''}">${who?.initials || "?"}</div>
          <div>
            <div><b>${who?.name}</b> <span class="badge ${f.kind}">${f.kind.toUpperCase()}</span></div>
            <small>${f.time}</small>
            <div style="margin-top:6px">${f.text}</div>
            <div class="row gap-sm mt">
              <button class="btn small ghost">🔥 PICAR</button>
              <button class="btn small dark">💬 COMENTAR</button>
            </div>
          </div>
        </div>`;
      }).join("")}
    </div>

    <div class="section-head"><h2>Retos activos</h2></div>
    <div class="card">
      <span class="tag-title">RETO</span>
      <div class="subtitle-under-tag">${isOp ? "30 días Event Ready" : "Octubre Paleo"}</div>
      <p>${isOp ? "Resistencia operativa sin fallar sesión." : "30 días de dieta paleo estricta tipo Marcos Llorente."}</p>
      <div class="progress"><div style="width:38%"></div></div>
      <small>DÍA 11 DE 30</small>
    </div>
  `;

  document.getElementById("invite").onclick = () => {
    navigator.clipboard?.writeText(c.code);
    alert(`Código ${c.code} copiado. Envíalo a tu gente.`);
  };

  return () => {};
}
