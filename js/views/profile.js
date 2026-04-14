// Perfil · datos + integraciones (Claude, Apple Health, Supabase, Push)
import { getState, updateProfile, reset, computeTDEE, setState } from "../store.js";
import { getApiKey, setApiKey } from "../ai.js";
import { importHealthExport, siriShortcutInstructions } from "../applehealth.js";
import { backendConfig, setBackendConfig, getClient, signInMagic, getUser, pushProfile } from "../backend.js";
import { pushSupported, subscribe as pushSubscribe, unsubscribe as pushUnsubscribe, localTestNotification, getVapidKey, setVapidKey } from "../push.js";

export function renderProfile(root, { navigate }) {
  const s = getState();
  const p = s.profile;
  const { bmr, tdee } = computeTDEE(p);
  const cfg = backendConfig();
  const hasClaude = !!getApiKey();
  const health = s.health;

  root.innerHTML = `
    <div class="section-head"><h2>Perfil</h2></div>

    <div class="card">
      <span class="tag-title">${p.role === 'operativo' ? 'OPERATIVO MĀRS' : 'CIVIL'}</span>
      <div class="subtitle-under-tag">${p.name || "Sin nombre"}</div>
      ${p.role === 'operativo' ? `<small>Unidad: <b style="color:#fff">${p.marsUnit || 'General'}</b></small>` : ""}
      <div class="grid-3 mt">
        <div class="stat"><b>${bmr}</b><span>BMR</span></div>
        <div class="stat"><b>${tdee}</b><span>TDEE</span></div>
        <div class="stat"><b>${p.weightKg}</b><span>kg</span></div>
      </div>
    </div>

    <div class="card">
      <h3>Datos físicos</h3>
      <div class="grid-2">
        <div><label>Nombre</label><input id="name" value="${p.name || ''}"/></div>
        <div><label>Peso (kg)</label><input id="weightKg" type="number" step="0.1" value="${p.weightKg}"/></div>
        <div><label>Altura (cm)</label><input id="heightCm" type="number" value="${p.heightCm}"/></div>
        <div><label>Edad</label><input id="age" type="number" value="${p.age}"/></div>
        <div><label>Actividad</label>
          <select id="activity">
            <option value="1.2"   ${p.activity==1.2?'selected':''}>Sedentario</option>
            <option value="1.375" ${p.activity==1.375?'selected':''}>Ligera</option>
            <option value="1.55"  ${p.activity==1.55?'selected':''}>Moderada</option>
            <option value="1.725" ${p.activity==1.725?'selected':''}>Intensa</option>
          </select>
        </div>
      </div>
      <button class="btn block mt" id="save">GUARDAR ✓</button>
    </div>

    <div class="section-head"><h2>Integraciones</h2></div>

    <!-- Claude Vision -->
    <div class="card">
      <span class="tag-title">IA · CLAUDE</span>
      <div class="subtitle-under-tag">Reconocimiento de comida por foto</div>
      <p><small>${hasClaude ? "✓ API key configurada" : "Añade tu API key de Anthropic para activar la detección por foto."}</small></p>
      <div class="row gap-sm">
        <input id="claude-key" type="password" placeholder="sk-ant-..." style="flex:1"/>
        <button class="btn small" id="save-claude">GUARDAR</button>
      </div>
    </div>

    <!-- Apple Health -->
    <div class="card">
      <span class="tag-title">APPLE HEALTH</span>
      <div class="subtitle-under-tag">Importar datos de Salud (iOS)</div>
      <p>Exporta desde la app Salud (perfil → exportar todos los datos) y sube el .zip o export.xml.</p>
      ${health ? `
        <div class="grid-3">
          <div class="stat"><b>${health.bodyweight?.length || 0}</b><span>DÍAS PESO</span></div>
          <div class="stat"><b>${health.steps?.length || 0}</b><span>DÍAS PASOS</span></div>
          <div class="stat"><b>${health.activeKcal?.length || 0}</b><span>DÍAS KCAL</span></div>
        </div>
        <small>Último import: ${new Date(health.lastImport).toLocaleString('es-ES')}</small>
      `: ""}
      <div class="row mt gap-sm">
        <label class="btn ghost" style="cursor:pointer">
          📂 IMPORTAR export.xml/zip
          <input id="health-file" type="file" accept=".xml,.zip" style="display:none"/>
        </label>
        <button class="btn small dark" id="show-shortcut">ATAJO SIRI</button>
      </div>
      <div id="health-result"></div>
      <div id="shortcut-box" class="hidden mt"></div>
    </div>

    <!-- Supabase -->
    <div class="card">
      <span class="tag-title">SUPABASE · ESCUADRÓN</span>
      <div class="subtitle-under-tag">Sincronía multi-usuario</div>
      <p><small>Sin configurar = modo offline con datos locales. Configúralo para compartir escuadrón real.</small></p>
      <div class="grid-2">
        <div><label>URL</label><input id="sb-url" value="${cfg?.url||''}" placeholder="https://xxx.supabase.co"/></div>
        <div><label>Anon Key</label><input id="sb-key" type="password" value="${cfg?.anonKey||''}"/></div>
      </div>
      <div class="row mt gap-sm">
        <button class="btn small" id="save-sb">GUARDAR</button>
        <button class="btn small ghost" id="sb-login">LOGIN</button>
        <button class="btn small dark" id="sb-push">SYNC PERFIL</button>
      </div>
      <div id="sb-result" class="mt"></div>
    </div>

    <!-- Push -->
    <div class="card">
      <span class="tag-title">PUSH · PICADAS</span>
      <div class="subtitle-under-tag">Notificaciones del escuadrón</div>
      <p><small>${pushSupported() ? "✓ Compatible con este navegador" : "⚠ Navegador no compatible. En iOS: instala la app y habilita notificaciones."}</small></p>
      <div><label>VAPID public key</label><input id="vapid-key" value="${getVapidKey()}" placeholder="Bxxx..."/></div>
      <div class="row mt gap-sm">
        <button class="btn small" id="push-enable">ACTIVAR</button>
        <button class="btn small ghost" id="push-test">🔥 PROBAR</button>
        <button class="btn small dark" id="push-off">DESACTIVAR</button>
      </div>
    </div>

    <div class="card">
      <h3>Zona peligrosa</h3>
      <p>Borra todo tu progreso y vuelve al onboarding.</p>
      <button class="btn block" style="background:#3a0000" id="reset">RESETEAR APP</button>
    </div>

    <div class="center mt"><small>MĀRS FIT · v0.2 MVP · sincronía + IA + salud</small></div>
  `;

  // ---- Datos físicos ----
  document.getElementById("save").onclick = () => {
    updateProfile({
      name: document.getElementById("name").value,
      weightKg: +document.getElementById("weightKg").value,
      heightCm: +document.getElementById("heightCm").value,
      age: +document.getElementById("age").value,
      activity: +document.getElementById("activity").value,
    });
    alert("Perfil actualizado ✓");
    renderProfile(root, { navigate });
  };

  // ---- Claude ----
  document.getElementById("save-claude").onclick = () => {
    const k = document.getElementById("claude-key").value.trim();
    if (!k) return;
    setApiKey(k);
    alert("API key guardada ✓");
    renderProfile(root, { navigate });
  };

  // ---- Apple Health ----
  document.getElementById("health-file").addEventListener("change", async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const box = document.getElementById("health-result");
    box.innerHTML = `<div class="card"><p>⏳ Importando... puede tardar con archivos grandes.</p></div>`;
    try {
      const r = await importHealthExport(file);
      box.innerHTML = `<div class="card accent"><p>✓ Import OK</p>
        <small>Peso: ${r.samples.bodyweight} · Pasos: ${r.samples.steps} · Kcal: ${r.samples.activeKcal} · Pulso: ${r.samples.heartRate}</small>
      </div>`;
      setTimeout(() => renderProfile(root, { navigate }), 800);
    } catch (err) {
      box.innerHTML = `<div class="card"><p style="color:#ff4757">${err.message}</p></div>`;
    }
  });
  document.getElementById("show-shortcut").onclick = () => {
    const s = siriShortcutInstructions();
    const box = document.getElementById("shortcut-box");
    box.classList.remove("hidden");
    box.innerHTML = `<div class="card">
      <span class="tag-title">${s.title}</span>
      <ul style="padding-left:18px;color:#c8c8c8">
        ${s.steps.map(x => `<li>${x}</li>`).join("")}
      </ul>
    </div>`;
  };

  // ---- Supabase ----
  document.getElementById("save-sb").onclick = () => {
    setBackendConfig({
      url: document.getElementById("sb-url").value.trim(),
      anonKey: document.getElementById("sb-key").value.trim()
    });
    alert("Config Supabase guardada ✓ Recarga para activarla.");
  };
  document.getElementById("sb-login").onclick = async () => {
    const email = prompt("Tu email (te enviaremos un magic link):");
    if (!email) return;
    try {
      await signInMagic(email);
      alert("Revisa tu email ✉️");
    } catch (e) { alert(e.message); }
  };
  document.getElementById("sb-push").onclick = async () => {
    try {
      await pushProfile();
      const user = await getUser();
      document.getElementById("sb-result").innerHTML =
        `<div class="card"><p>${user ? `✓ Perfil sincronizado (${user.email})` : "⚠ No hay sesión"}</p></div>`;
    } catch(e){ alert(e.message); }
  };

  // ---- Push ----
  document.getElementById("push-enable").onclick = async () => {
    const v = document.getElementById("vapid-key").value.trim();
    if (v) setVapidKey(v);
    try {
      await pushSubscribe();
      setState({ notifEnabled: true });
      alert("✓ Notificaciones activadas");
    } catch (e) { alert(e.message); }
  };
  document.getElementById("push-test").onclick = async () => {
    try { await localTestNotification(); }
    catch (e) { alert(e.message); }
  };
  document.getElementById("push-off").onclick = async () => {
    await pushUnsubscribe();
    setState({ notifEnabled: false });
    alert("Desactivadas");
  };

  // ---- Reset ----
  document.getElementById("reset").onclick = () => {
    if (confirm("¿Seguro que quieres resetear?")) { reset(); location.reload(); }
  };

  return () => {};
}
