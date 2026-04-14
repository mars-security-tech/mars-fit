// Home · Dashboard moderno con metric cards, coach, charts
import { getState, computeTDEE, computeMacros, today } from "../store.js";
import { ROUTINES } from "../../data/routines.js";
import { DIETS } from "../../data/diets.js";
import { renderBarChart, renderWaveLine, renderGaugeSemi, renderSleepPhases, renderBpmBars } from "../charts.js";

export function renderHome(root, { navigate }) {
  const s = getState();
  const p = s.profile;
  const isOp = p.role === "operativo";

  // Rutina y dieta
  const suggestedRoutineId = s.routineId || suggestRoutine(p);
  const routine = ROUTINES[suggestedRoutineId];
  const suggestedDietId = s.dietId || (isOp ? "mars_operativo" : (p.goal === "volumen" ? "alta_proteina" : p.goal === "definicion" ? "deficit_flexible" : "mediterranea"));
  const diet = DIETS[suggestedDietId];
  const macros = computeMacros(p, diet.macros);

  const todayStr = today();
  const todayWorkouts = s.workouts.filter(w => w.date === todayStr);
  const todayMeals = s.meals.filter(m => m.date === todayStr);
  const kcalEaten = todayMeals.reduce((a, m) => a + (m.kcal || 0), 0);
  const protEaten = todayMeals.reduce((a, m) => a + (m.proteinG || 0), 0);
  const carbsEaten = todayMeals.reduce((a, m) => a + (m.carbsG || 0), 0);
  const fatsEaten = todayMeals.reduce((a, m) => a + (m.fatsG || 0), 0);

  // Health data
  const stepsToday = s.health?.steps?.find(x => x.date === todayStr)?.count;
  const hasHealth = !!s.health;

  // Steps last 7 days
  const last7dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const stepsWeek = last7dates.map(d => s.health?.steps?.find(x => x.date === d)?.count || 0);
  const dayLabels = last7dates.map(d => { const dt = new Date(d); return ["D","L","M","X","J","V","S"][dt.getDay()]; });

  // Heart data
  const heartData = s.health?.heartRate || [];
  const lastBpms = heartData.slice(-12).map(h => h.bpm || h.value || 70);
  const avgBpm = lastBpms.length ? Math.round(lastBpms.reduce((a, b) => a + b, 0) / lastBpms.length) : null;

  // Coach banner contextual
  const coachMsg = buildCoachMessage(s, todayWorkouts, todayMeals, kcalEaten, macros.kcal);

  // Wellness score
  const workoutsThisWeek = s.workouts.filter(w => {
    const wDate = new Date(w.date);
    const now = new Date();
    const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
    return wDate >= weekAgo;
  }).length;
  const mealsLoggedToday = todayMeals.length;
  const stepsVal = stepsToday || 0;
  const wellnessScore = Math.min(100, workoutsThisWeek * 20 + mealsLoggedToday * 5 + Math.floor(stepsVal / 1000));

  // Wellness sparkline (fake trending based on score)
  const wellnessSparkline = Array.from({ length: 7 }, (_, i) => Math.max(10, wellnessScore - 30 + Math.round(Math.random() * 20) + i * 5));

  // Next routine day
  const currentDay = s.currentDay ?? 0;
  const nextDayIdx = Math.min(currentDay, (routine?.days?.length || 1) - 1);
  const nextDayName = routine?.days?.[nextDayIdx]?.day || "Dia 1";

  const userName = (p.name || "Espartano").split(" ")[0];

  root.innerHTML = `
    ${isOp ? `
      <div class="op-banner">
        <span class="tag-title">MARS OPERATIVO</span>
        <p>Unidad: <b style="color:#fff">${p.marsUnit || 'General'}</b></p>
      </div>
    ` : ""}

    <!-- Hero Coach -->
    <div class="hero-coach">
      <div class="hero-coach__greeting">MARS FIT COACH</div>
      <div class="hero-coach__headline">Hola <em>${userName}</em>, necesitas ayuda? Pregunta lo que sea</div>
      <div class="hero-coach__input">
        <span class="hero-coach__input-icon">&#9673;</span>
        <span class="hero-coach__input-text">Escribe tu pregunta...</span>
      </div>
    </div>

    <!-- Coach Banner -->
    <div class="coach-banner">
      <div class="coach-banner__avatar">&#9733;</div>
      <div class="coach-banner__body">
        <div class="coach-banner__name">Coach MARS</div>
        <div class="coach-banner__message">${coachMsg.text}</div>
        ${coachMsg.action ? `<button class="coach-banner__action" id="coach-action">${coachMsg.action}</button>` : ""}
      </div>
    </div>

    <!-- Pill Icon Row -->
    <div class="pill-icon-row" id="pill-shortcuts">
      <div class="pill-icon-row__item" data-go="workout">
        <span class="pill-icon-row__dot" style="background:var(--metric-strength)"></span>
        <span class="pill-icon-row__label">Entreno</span>
      </div>
      <div class="pill-icon-row__item" data-go="nutrition">
        <span class="pill-icon-row__dot" style="background:var(--metric-nutrition)"></span>
        <span class="pill-icon-row__label">Nutricion</span>
      </div>
      <div class="pill-icon-row__item" data-scroll="weight">
        <span class="pill-icon-row__dot" style="background:var(--metric-activity)"></span>
        <span class="pill-icon-row__label">Peso</span>
      </div>
      <div class="pill-icon-row__item" data-scroll="sleep">
        <span class="pill-icon-row__dot" style="background:var(--metric-sleep)"></span>
        <span class="pill-icon-row__label">Sueno</span>
      </div>
      <div class="pill-icon-row__item" data-scroll="steps">
        <span class="pill-icon-row__dot" style="background:var(--metric-steps, #22D3EE)"></span>
        <span class="pill-icon-row__label">Pasos</span>
      </div>
      <div class="pill-icon-row__item" data-go="circle">
        <span class="pill-icon-row__dot" style="background:var(--metric-balance)"></span>
        <span class="pill-icon-row__label">Escuadron</span>
      </div>
    </div>

    <!-- Range Selector -->
    <div class="pill-range" style="margin-bottom:16px">
      <span class="pill-range__icon">&#128197;</span>
      Ultima semana
      <span class="pill-range__chevron">&#9660;</span>
    </div>

    <!-- Metric Cards Grid -->
    <div class="v2-grid v2-grid--2">

      <!-- Activity / Steps -->
      <div class="metric-card activity animate-in" id="card-steps">
        <div class="metric-card__header">
          <span class="metric-card__title">Actividad</span>
          <div class="metric-card__icon">&#128694;</div>
        </div>
        ${stepsToday != null
          ? `<div class="stat-big">
              <span class="stat-big__number">${stepsToday.toLocaleString("es-ES")}</span>
              <span class="stat-big__label">pasos hoy</span>
            </div>
            <div class="metric-card__chart" id="chart-steps"></div>`
          : `<div style="color:#666;font-size:13px;padding:12px 0;text-align:center">
              Importa Apple Health en <button style="color:var(--mars-red);background:none;border:none;cursor:pointer;font-size:13px;text-decoration:underline" id="goto-profile-health">Perfil</button> para ver actividad.
            </div>`
        }
      </div>

      <!-- Sleep -->
      <div class="metric-card sleep animate-in" id="card-sleep">
        <div class="metric-card__header">
          <span class="metric-card__title">Sueno</span>
          <div class="metric-card__icon">&#127769;</div>
        </div>
        ${hasHealth && s.health.sleep
          ? `<div class="stat-big">
              <span class="stat-big__number">${s.health.sleep.hoursAvg || "7.2"}</span>
              <span class="stat-big__label">horas promedio</span>
            </div>
            <div class="metric-card__chart" id="chart-sleep"></div>`
          : `<div style="color:#666;font-size:13px;padding:12px 0;text-align:center">
              Conecta Apple Health en <button style="color:var(--metric-sleep);background:none;border:none;cursor:pointer;font-size:13px;text-decoration:underline" id="goto-profile-sleep">Perfil</button> para sueno.
            </div>`
        }
      </div>

      <!-- Heart -->
      <div class="metric-card heart animate-in" id="card-heart">
        <div class="metric-card__header">
          <span class="metric-card__title">Corazon</span>
          <div class="metric-card__icon">&#10084;</div>
        </div>
        ${avgBpm != null
          ? `<div class="stat-big">
              <span class="stat-big__number">${avgBpm}</span>
              <span class="stat-big__label">BPM promedio</span>
            </div>
            <div class="metric-card__chart" id="chart-bpm"></div>`
          : `<div style="color:#666;font-size:13px;padding:12px 0;text-align:center">
              Conecta Apple Health en <button style="color:var(--metric-heart);background:none;border:none;cursor:pointer;font-size:13px;text-decoration:underline" id="goto-profile-heart2">Perfil</button> para ritmo cardiaco.
            </div>`
        }
      </div>

      <!-- Nutrition -->
      <div class="metric-card nutrition animate-in" id="card-nutrition">
        <div class="metric-card__header">
          <span class="metric-card__title">Nutricion</span>
          <div class="metric-card__icon">&#127860;</div>
        </div>
        <div class="stat-big">
          <span class="stat-big__number">${kcalEaten}<span class="stat-big__unit">/ ${macros.kcal}</span></span>
          <span class="stat-big__label">kcal hoy</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;margin-top:12px">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:11px;color:#888;font-family:var(--font-title);width:36px;letter-spacing:.08em">PROT</span>
            <div style="flex:1;height:5px;background:#222;border-radius:3px;overflow:hidden">
              <div style="height:100%;width:${Math.min(100, Math.round(protEaten / macros.proteinG * 100))}%;background:var(--metric-nutrition);border-radius:3px"></div>
            </div>
            <span style="font-size:11px;color:#aaa;font-family:var(--font-title);width:50px;text-align:right">${protEaten}/${macros.proteinG}g</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:11px;color:#888;font-family:var(--font-title);width:36px;letter-spacing:.08em">CARB</span>
            <div style="flex:1;height:5px;background:#222;border-radius:3px;overflow:hidden">
              <div style="height:100%;width:${Math.min(100, Math.round(carbsEaten / macros.carbsG * 100))}%;background:#4ADE80;border-radius:3px"></div>
            </div>
            <span style="font-size:11px;color:#aaa;font-family:var(--font-title);width:50px;text-align:right">${carbsEaten}/${macros.carbsG}g</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:11px;color:#888;font-family:var(--font-title);width:36px;letter-spacing:.08em">FAT</span>
            <div style="flex:1;height:5px;background:#222;border-radius:3px;overflow:hidden">
              <div style="height:100%;width:${Math.min(100, Math.round(fatsEaten / macros.fatsG * 100))}%;background:#16A34A;border-radius:3px"></div>
            </div>
            <span style="font-size:11px;color:#aaa;font-family:var(--font-title);width:50px;text-align:right">${fatsEaten}/${macros.fatsG}g</span>
          </div>
        </div>
      </div>

      <!-- Strength -->
      <div class="metric-card strength animate-in" id="card-strength">
        <div class="metric-card__header">
          <span class="metric-card__title">Fuerza</span>
          <div class="metric-card__icon">&#9954;</div>
        </div>
        <div class="stat-big">
          <span class="stat-big__number">${s.workouts.length}</span>
          <span class="stat-big__label">sesiones totales</span>
        </div>
        <div style="margin-top:10px;font-size:13px;color:#aaa">
          Proximo: <strong style="color:#fff">${nextDayName}</strong> de ${routine?.name || "rutina"}
        </div>
        <button class="btn-v2 primary" style="margin-top:12px;width:100%" id="go-workout">IR AL ENTRENO</button>
      </div>

      <!-- Wellness Score -->
      <div class="metric-card wellness animate-in" id="card-wellness">
        <div class="metric-card__header">
          <span class="metric-card__title">Wellness</span>
          <div class="metric-card__icon">&#9878;</div>
        </div>
        <div class="stat-big">
          <span class="stat-big__number">${wellnessScore}</span>
          <span class="stat-big__label">score / 100</span>
        </div>
        <div class="metric-card__chart" id="chart-wellness"></div>
      </div>

      <!-- Balance Gauge (full width) -->
      <div class="metric-card balance full animate-in" id="card-balance">
        <div class="metric-card__header">
          <span class="metric-card__title">Balance</span>
          <div class="metric-card__icon">&#9878;</div>
        </div>
        <div class="metric-card__chart" id="chart-gauge"></div>
      </div>

    </div>

    <!-- Squad Compact -->
    <div style="margin-top:20px">
      <div style="font-family:var(--font-title);font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.12em;color:#888;margin-bottom:10px">Escuadron</div>
      <div style="background:var(--v2-surface-card,#141414);border:1px solid rgba(255,255,255,0.06);border-radius:var(--radius-card,24px);padding:14px">
        ${s.circle.feed.slice(0, 3).map(f => {
          const who = s.circle.members.find(m => m.id === f.who);
          return `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04)">
            <div style="width:32px;height:32px;border-radius:50%;background:var(--mars-red);color:#fff;display:flex;align-items:center;justify-content:center;font-family:var(--font-title);font-size:11px;font-weight:700;flex-shrink:0">${who?.initials || "?"}</div>
            <div style="flex:1;font-size:13px;color:#ccc;line-height:1.3"><b style="color:#fff">${who?.name || "?"}</b> ${f.text}</div>
            <span style="font-size:11px;color:#555">${f.time}</span>
          </div>`;
        }).join("")}
        <button class="btn-v2" style="width:100%;margin-top:10px" id="go-circle">VER ESCUADRON</button>
      </div>
    </div>
  `;

  // --- Mount charts ---
  if (stepsToday != null) {
    const chartEl = root.querySelector("#chart-steps");
    if (chartEl) renderBarChart(chartEl, stepsWeek, "#F97316");
  }

  // Sleep chart (mock if no real data)
  const sleepChart = root.querySelector("#chart-sleep");
  if (sleepChart) {
    const phases = s.health?.sleep?.phases || [
      { phase: "deep", minutes: 90 },
      { phase: "rem", minutes: 60 },
      { phase: "light", minutes: 180 },
      { phase: "awake", minutes: 15 }
    ];
    renderSleepPhases(sleepChart, phases);
  }

  // BPM chart
  const bpmChart = root.querySelector("#chart-bpm");
  if (bpmChart && lastBpms.length) {
    renderBpmBars(bpmChart, lastBpms);
  }

  // Wellness wave
  const wellChart = root.querySelector("#chart-wellness");
  if (wellChart) {
    renderWaveLine(wellChart, wellnessSparkline, "#8B5CF6");
  }

  // Balance gauge
  const gaugeChart = root.querySelector("#chart-gauge");
  if (gaugeChart) {
    renderGaugeSemi(gaugeChart, wellnessScore, "Balance");
  }

  // --- Event handlers ---
  root.querySelector("#go-workout")?.addEventListener("click", () => navigate("workout"));
  root.querySelector("#go-circle")?.addEventListener("click", () => navigate("circle"));
  root.querySelector("#card-nutrition")?.addEventListener("click", () => navigate("nutrition"));
  root.querySelector("#coach-action")?.addEventListener("click", () => {
    if (coachMsg.route) navigate(coachMsg.route);
  });

  // Profile links for empty states
  root.querySelector("#goto-profile-health")?.addEventListener("click", () => navigate("profile"));
  root.querySelector("#goto-profile-sleep")?.addEventListener("click", () => navigate("profile"));
  root.querySelector("#goto-profile-heart2")?.addEventListener("click", () => navigate("profile"));

  // Pill shortcuts
  root.querySelector("#pill-shortcuts")?.addEventListener("click", (e) => {
    const item = e.target.closest("[data-go]");
    if (item) navigate(item.dataset.go);
  });

  return () => {};
}

function buildCoachMessage(state, todayWorkouts, todayMeals, kcalEaten, kcalTarget) {
  const now = new Date();
  const hour = now.getHours();

  // Has trained today?
  if (todayWorkouts.length > 0) {
    return { text: "Buen trabajo, ya has entrenado hoy. Asegurate de comer bien para recuperar.", action: "VER NUTRICION", route: "nutrition" };
  }

  // Days since last workout
  const sortedWorkouts = [...state.workouts].sort((a, b) => b.date.localeCompare(a.date));
  if (sortedWorkouts.length > 0) {
    const lastDate = new Date(sortedWorkouts[0].date);
    const daysSince = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
    if (daysSince >= 2) {
      return { text: `Llevas <strong>${daysSince} dias</strong> sin entrenar. Toca sesion, tu cuerpo lo pide.`, action: "IR AL ENTRENO", route: "workout" };
    }
  }

  // Low calories after 18h
  if (hour >= 18 && kcalTarget > 0 && kcalEaten < kcalTarget * 0.5) {
    const remaining = kcalTarget - kcalEaten;
    return { text: `Vas bajo en calorias. Aun te quedan <strong>${remaining} kcal</strong> por cubrir hoy.`, action: "REGISTRAR COMIDA", route: "nutrition" };
  }

  // Default morning
  if (hour < 12) {
    return { text: "Buenos dias. Hoy es un buen dia para superar tus limites.", action: null, route: null };
  }

  return { text: "Sigue con el plan. La consistencia es lo que construye resultados.", action: null, route: null };
}

function suggestRoutine(p) {
  if (p.role === "operativo") {
    if (p.goal === "turnos_largos") return "op_event_ready";
    if (p.goal === "estabilidad") return "op_drone_operator";
    return "op_tactical_base";
  }
  if (p.equipment === "peso_corporal" || p.equipment === "casa") return "civil_home";
  if (p.goal === "definicion") return "civil_cut_full";
  return "civil_volume_ppl";
}
