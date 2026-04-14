// Workout · muestra rutina asignada y permite registrar series con visor 3D
import { getState, setState, today } from "../store.js";
import { ROUTINES } from "../../data/routines.js";
import { EXERCISES } from "../../data/exercises.js";
import { ExerciseAnim } from "../anim3d.js";
import { pushWorkout, postFeed, isOnline } from "../backend.js";
import { localTestNotification, pushSupported } from "../push.js";

export function renderWorkout(root, { navigate }) {
  const s = getState();
  const p = s.profile;
  const isOp = p.role === "operativo";

  const routineId = s.routineId || suggestRoutine(p);
  const routine = ROUTINES[routineId];

  const todayStr = today();
  let dayIdx = s.currentDay ?? 0;
  dayIdx = Math.min(dayIdx, routine.days.length - 1);
  const day = routine.days[dayIdx];

  const anims = [];

  // Count completed exercises from today's previous workouts
  const todayPrevious = s.workouts.filter(w => w.date === todayStr);
  const totalExercises = day.exercises.length;

  // Motivational coach message
  const coachMotiv = todayPrevious.length > 0
    ? "Ya has completado una sesion hoy. Si vas a por mas, adelante."
    : (totalExercises <= 4
        ? "Sesion corta pero intensa. Calidad sobre cantidad."
        : `${totalExercises} ejercicios te esperan. Enfocate en la tecnica.`);

  root.innerHTML = `
    <!-- Strength progress card -->
    <div class="metric-card strength animate-in" style="margin-bottom:14px">
      <div class="metric-card__header">
        <span class="metric-card__title">Sesion de hoy</span>
        <div class="metric-card__icon" style="background:rgba(218,7,4,0.15);color:var(--metric-strength);border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:16px">&#9954;</div>
      </div>
      <div class="stat-big">
        <span class="stat-big__number">0<span class="stat-big__unit">/ ${totalExercises}</span></span>
        <span class="stat-big__label">ejercicios completados</span>
      </div>
      <div style="margin-top:8px;height:4px;background:#222;border-radius:2px;overflow:hidden">
        <div id="workout-progress-bar" style="height:100%;width:0%;background:var(--mars-red);border-radius:2px;transition:width .3s ease"></div>
      </div>
    </div>

    <!-- Coach banner -->
    <div class="coach-banner" style="margin-bottom:14px">
      <div class="coach-banner__avatar">&#9733;</div>
      <div class="coach-banner__body">
        <div class="coach-banner__name">Coach MARS</div>
        <div class="coach-banner__message">${coachMotiv}</div>
      </div>
    </div>

    <div class="section-head"><h2>${isOp ? "Sesion operativa" : "Sesion"}</h2></div>

    <div class="card">
      <span class="tag-title">RUTINA</span>
      <div class="subtitle-under-tag">${routine.name}</div>
      <div class="chips mt" id="daysel">
        ${routine.days.map((d,i) => `<button class="chip ${i===dayIdx?'active':''}" data-i="${i}">${d.day}</button>`).join("")}
      </div>
    </div>

    <div id="exercises"></div>

    <button class="btn block angled mt" id="finish">◆ FINALIZAR SESIÓN</button>
  `;

  const host = document.getElementById("exercises");
  day.exercises.forEach((ex, i) => {
    const def = EXERCISES.find(e => e.id === ex.id);
    if (!def) return;
    const cardId = `ex-${i}`;
    const card = document.createElement("div");
    card.className = "card exercise-card";
    card.innerHTML = `
      <div class="row between">
        <div>
          <span class="tag-title">#${i+1}</span>
          <div class="subtitle-under-tag">${def.name}</div>
          <small>${def.muscle.toUpperCase()} · ${def.equipment.replace('_',' ').toUpperCase()}</small>
        </div>
        <span class="badge ghost">${ex.sets}×${ex.reps}</span>
      </div>

      <div class="canvas-wrap mt" id="${cardId}-canvas"></div>

      <div class="mt">
        <small>Puntos clave</small>
        <ul style="padding-left:18px;margin:6px 0;color:#c8c8c8;font-size:14px">
          ${def.cues.map(c => `<li>${c}</li>`).join("")}
        </ul>
      </div>

      <div class="sets-list">
        <div class="set-row" style="border-bottom:1px solid var(--border-strong);font-size:11px;color:var(--muted);font-family:var(--font-title);letter-spacing:.1em">
          <span class="set-num">#</span><span>KG</span><span>REPS</span><span>OK</span>
        </div>
        ${Array.from({length: ex.sets}).map((_,si) => `
          <div class="set-row" data-set="${si}">
            <span class="set-num">${si+1}</span>
            <input type="number" placeholder="kg" class="kg" />
            <input type="number" placeholder="${ex.reps}" class="reps" />
            <button class="done">✓</button>
          </div>
        `).join("")}
      </div>
    `;
    host.appendChild(card);

    // 3D anim
    const canvasHost = card.querySelector(`#${cardId}-canvas`);
    const anim = new ExerciseAnim(canvasHost, def.animate || "run");
    anims.push(anim);

    // Set done buttons
    card.querySelectorAll(".set-row[data-set] .done").forEach(btn => {
      btn.addEventListener("click", () => {
        btn.classList.toggle("completed");
        btn.closest(".set-row").classList.toggle("done-row", btn.classList.contains("completed"));
        updateWorkoutProgress();
      });
    });
  });

  // Day selector
  document.getElementById("daysel").addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    setState({ currentDay: +b.dataset.i, routineId });
    destroy();
    renderWorkout(root, { navigate });
  });

  // Finish
  document.getElementById("finish").onclick = async () => {
    const sets = [];
    document.querySelectorAll(".exercise-card").forEach((card, i) => {
      card.querySelectorAll(".set-row[data-set]").forEach(row => {
        const kg = +row.querySelector(".kg").value;
        const reps = +row.querySelector(".reps").value;
        const done = row.querySelector(".done").classList.contains("completed");
        sets.push({ exIdx: i, setIdx: +row.dataset.set, kg, reps, done });
      });
    });
    const workout = { date: todayStr, routineId, dayIdx, sets };
    const workouts = [...getState().workouts, workout];
    setState({ workouts });

    // Sync remoto (si Supabase está configurado)
    try {
      if (await isOnline()) {
        await pushWorkout(workout);
        const total = sets.filter(x => x.done).length;
        await postFeed({
          circleId: getState().circle.remoteId,
          kind: "workout",
          badge: "fire",
          text: `Sesión completada · ${routine.name} · ${total} series ✓`
        });
      }
    } catch(e) { console.warn(e); }

    // Notificación motivacional local
    if (pushSupported() && getState().notifEnabled) {
      localTestNotification().catch(()=>{});
    }

    alert("Sesión registrada. Tu escuadrón lo verá 🔥");
    navigate("home");
  };

  function updateWorkoutProgress() {
    const cards = document.querySelectorAll(".exercise-card");
    let completedExercises = 0;
    cards.forEach(card => {
      const allSets = card.querySelectorAll(".set-row[data-set] .done");
      const doneSets = card.querySelectorAll(".set-row[data-set] .done.completed");
      if (allSets.length > 0 && doneSets.length === allSets.length) completedExercises++;
    });
    const progressBar = document.getElementById("workout-progress-bar");
    const statNum = root.querySelector(".metric-card.strength .stat-big__number");
    if (progressBar) progressBar.style.width = `${Math.round(completedExercises / totalExercises * 100)}%`;
    if (statNum) statNum.innerHTML = `${completedExercises}<span class="stat-big__unit">/ ${totalExercises}</span>`;
  }

  function destroy() { anims.forEach(a => a.dispose()); }
  return destroy;
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
