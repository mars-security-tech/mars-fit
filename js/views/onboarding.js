// Onboarding: captura perfil + rol (Civil / Operativo MARS)
import { getState, updateProfile, computeTDEE } from "../store.js";

export function renderOnboarding(root, onDone) {
  const state = getState();
  let step = 0;
  const totalSteps = 4;

  function render() {
    const p = getState().profile;
    const pct = Math.round(((step+1)/totalSteps) * 100);

    root.innerHTML = `
      <div class="hero">
        <small>MĀRS FIT · Onboarding</small>
        <h1>BIENVENIDO <span>OPERADOR</span></h1>
        <p>Configuremos tu perfil físico para asignar rutinas y nutrición precisas.</p>
        <div class="progress mt"><div style="width:${pct}%"></div></div>
      </div>

      <div id="step"></div>

      <div class="row between mt">
        <button id="prev" class="btn ghost small" ${step===0?"disabled style='opacity:.3'":""}>◀ ATRÁS</button>
        <button id="next" class="btn angled">${step === totalSteps-1 ? "ACCEDER ▶" : "CONTINUAR ▶"}</button>
      </div>
    `;

    renderStep();

    document.getElementById("prev").onclick = () => { if(step>0){step--; render();} };
    document.getElementById("next").onclick = () => {
      if (step < totalSteps - 1) { step++; render(); }
      else { onDone(); }
    };
  }

  function renderStep() {
    const host = document.getElementById("step");
    const p = getState().profile;
    if (step === 0) {
      host.innerHTML = `
        <div class="card">
          <span class="tag-title">PASO 1</span>
          <div class="subtitle-under-tag">Elige tu rol</div>
          <p>Esto adapta todo el entrenamiento y la nutrición.</p>
          <div class="grid-2 mt">
            <button class="role-card ${p.role==='civil'?'active':''}" data-role="civil">
              <h3>◉ CIVIL</h3>
              <p>Usuario estándar. Rutinas para hipertrofia, definición, mantenimiento o rendimiento general.</p>
            </button>
            <button class="role-card ${p.role==='operativo'?'active':''}" data-role="operativo">
              <h3>▲ OPERATIVO MĀRS</h3>
              <p>Personal de MĀRS Seguridad. Rutinas tácticas, turnos largos, eventos y preparación aérea.</p>
            </button>
          </div>
          <div id="unit-wrap" class="${p.role==='operativo'?'':'hidden'} mt">
            <label>Unidad MĀRS</label>
            <select id="marsUnit">
              <option value="Vivienda" ${p.marsUnit==='Vivienda'?'selected':''}>Vivienda / Residencial</option>
              <option value="Eventos"  ${p.marsUnit==='Eventos'?'selected':''}>Eventos de gran escala</option>
              <option value="Aérea"    ${p.marsUnit==='Aérea'?'selected':''}>Seguridad Aérea (drones)</option>
              <option value="Servicio" ${p.marsUnit==='Servicio'?'selected':''}>Servicio general</option>
            </select>
          </div>
        </div>
      `;
      host.querySelectorAll("[data-role]").forEach(el => {
        el.onclick = () => { updateProfile({ role: el.dataset.role }); render(); };
      });
      const sel = document.getElementById("marsUnit");
      if (sel) sel.onchange = () => updateProfile({ marsUnit: sel.value });
    }

    if (step === 1) {
      host.innerHTML = `
        <div class="card">
          <span class="tag-title">PASO 2</span>
          <div class="subtitle-under-tag">Datos físicos</div>
          <div class="grid-2 mt">
            <div><label>Nombre</label><input id="name" value="${p.name}"/></div>
            <div><label>Sexo</label>
              <select id="sex">
                <option value="m" ${p.sex==='m'?'selected':''}>Masculino</option>
                <option value="f" ${p.sex==='f'?'selected':''}>Femenino</option>
              </select>
            </div>
            <div><label>Edad</label><input id="age" type="number" value="${p.age}"/></div>
            <div><label>Altura (cm)</label><input id="heightCm" type="number" value="${p.heightCm}"/></div>
            <div><label>Peso (kg)</label><input id="weightKg" type="number" step="0.1" value="${p.weightKg}"/></div>
            <div><label>Actividad</label>
              <select id="activity">
                <option value="1.2"   ${p.activity==1.2?'selected':''}>Sedentario</option>
                <option value="1.375" ${p.activity==1.375?'selected':''}>Ligera</option>
                <option value="1.55"  ${p.activity==1.55?'selected':''}>Moderada</option>
                <option value="1.725" ${p.activity==1.725?'selected':''}>Intensa</option>
              </select>
            </div>
          </div>
        </div>
      `;
      const sync = () => {
        updateProfile({
          name: document.getElementById("name").value,
          sex: document.getElementById("sex").value,
          age: +document.getElementById("age").value,
          heightCm: +document.getElementById("heightCm").value,
          weightKg: +document.getElementById("weightKg").value,
          activity: +document.getElementById("activity").value,
        });
      };
      ["name","sex","age","heightCm","weightKg","activity"].forEach(id => {
        document.getElementById(id).addEventListener("change", sync);
        document.getElementById(id).addEventListener("input", sync);
      });
    }

    if (step === 2) {
      const isOp = p.role === "operativo";
      const goals = isOp
        ? [["rendimiento","Rendimiento táctico"], ["turnos_largos","Resistencia para turnos"], ["estabilidad","Estabilidad / postura"]]
        : [["volumen","Volumen / Hipertrofia"], ["definicion","Definición"], ["mantenimiento","Mantenimiento"], ["rendimiento","Rendimiento"]];
      host.innerHTML = `
        <div class="card">
          <span class="tag-title">PASO 3</span>
          <div class="subtitle-under-tag">Objetivo</div>
          <div class="chips mt" id="goals">
            ${goals.map(([v,l]) => `<button class="chip ${p.goal===v?'active':''}" data-v="${v}">${l}</button>`).join("")}
          </div>
          <h3 class="mt">Experiencia</h3>
          <div class="chips" id="exp">
            ${["principiante","intermedio","avanzado"].map(v => `<button class="chip ${p.experience===v?'active':''}" data-v="${v}">${v.toUpperCase()}</button>`).join("")}
          </div>
          <h3 class="mt">Equipamiento</h3>
          <div class="chips" id="eq">
            ${[["gym","GYM COMPLETO"],["casa","CASA + MANCUERNAS"],["peso_corporal","SOLO PESO CORPORAL"]].map(([v,l]) => `<button class="chip ${p.equipment===v?'active':''}" data-v="${v}">${l}</button>`).join("")}
          </div>
        </div>
      `;
      host.querySelectorAll("#goals .chip").forEach(c => c.onclick = () => { updateProfile({ goal: c.dataset.v }); renderStep(); });
      host.querySelectorAll("#exp .chip").forEach(c => c.onclick = () => { updateProfile({ experience: c.dataset.v }); renderStep(); });
      host.querySelectorAll("#eq .chip").forEach(c => c.onclick = () => { updateProfile({ equipment: c.dataset.v }); renderStep(); });
    }

    if (step === 3) {
      const { bmr, tdee } = computeTDEE(p);
      host.innerHTML = `
        <div class="card">
          <span class="tag-title">PASO 4</span>
          <div class="subtitle-under-tag">Tu ficha metabólica</div>
          <div class="grid-3 mt">
            <div class="stat"><b>${bmr}</b><span>BMR</span></div>
            <div class="stat"><b>${tdee}</b><span>TDEE kcal</span></div>
            <div class="stat"><b>${p.weightKg}</b><span>kg</span></div>
          </div>
          <p class="mt">Perfil <b style="color:#fff">${p.role === 'operativo' ? 'OPERATIVO · ' + (p.marsUnit||'MĀRS') : 'CIVIL'}</b> · objetivo <b style="color:#fff">${p.goal.replace('_',' ')}</b>.</p>
          <p><small>Al continuar, generaremos tu plan inicial de entreno + dieta.</small></p>
        </div>
      `;
    }
  }

  render();
  return () => {};
}
