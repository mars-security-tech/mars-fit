// Nutricion · selector de dieta + macros + menu + registro de comidas (foto IA) + lista de compra
import { getState, setState, computeMacros, today } from "../store.js";
import { DIETS } from "../../data/diets.js";
import { buildShoppingList } from "../shopping.js";
import { analyzeMealPhoto, getApiKey } from "../ai.js";
import { renderBarChart } from "../charts.js";

export function renderNutrition(root, { navigate }) {
  const s = getState();
  const p = s.profile;
  const isOp = p.role === "operativo";

  let tab = "plan"; // plan | registro | compra

  const selectedId = s.dietId || (isOp ? "mars_operativo" : "paleo_llorente");
  const dietList = Object.values(DIETS);

  function draw() {
    const state = getState();
    const curId = state.dietId || selectedId;
    const diet = DIETS[curId];
    const macros = computeMacros(state.profile, diet.macros);

    const todayMeals = state.meals.filter(m => m.date === today());
    const todayTotals = todayMeals.reduce((a, m) => ({
      kcal: a.kcal + (m.kcal||0),
      p: a.p + (m.proteinG||0),
      c: a.c + (m.carbsG||0),
      f: a.f + (m.fatsG||0)
    }), { kcal:0, p:0, c:0, f:0 });

    root.innerHTML = `
      <div class="section-head"><h2>Nutrición</h2></div>

      <div class="chips">
        <button class="chip ${tab==='plan'?'active':''}" data-tab="plan">PLAN</button>
        <button class="chip ${tab==='registro'?'active':''}" data-tab="registro">REGISTRO HOY</button>
        <button class="chip ${tab==='compra'?'active':''}" data-tab="compra">LISTA DE COMPRA</button>
      </div>

      <div id="tab-body" class="mt"></div>
    `;

    root.querySelectorAll("[data-tab]").forEach(el => {
      el.onclick = () => { tab = el.dataset.tab; draw(); };
    });

    const body = root.querySelector("#tab-body");

    if (tab === "plan") {
      body.innerHTML = `
        <div class="chips" id="diet-chips">
          ${dietList.map(d => `<button class="chip ${d.id===curId?'active':''}" data-id="${d.id}">${d.name}</button>`).join("")}
        </div>

        <div class="card mt">
          <span class="tag-title">${curId === 'paleo_llorente' ? 'PALEO · LLORENTE' : 'DIETA'}</span>
          <div class="subtitle-under-tag">${diet.name}</div>
          <p>${diet.desc}</p>

          <div class="grid-3 mt">
            <div class="stat"><b>${macros.kcal}</b><span>KCAL</span></div>
            <div class="stat"><b>${macros.proteinG}g</b><span>PROTEÍNA</span></div>
            <div class="stat"><b>${macros.carbsG}g</b><span>CARBS</span></div>
          </div>
          <div class="grid-3 mt">
            <div class="stat"><b>${macros.fatsG}g</b><span>GRASAS</span></div>
            <div class="stat"><b>${Math.round(macros.proteinG/state.profile.weightKg*10)/10}</b><span>g/kg PROT</span></div>
            <div class="stat"><b>${Math.round(macros.kcal/state.profile.weightKg)}</b><span>KCAL/kg</span></div>
          </div>

          <h3 class="mt">Reglas</h3>
          <ul style="padding-left:18px;color:#c8c8c8;font-size:14px">
            ${diet.rules.map(r => `<li>${r}</li>`).join("")}
          </ul>
        </div>

        <div class="section-head"><h2>Menú de ejemplo</h2></div>
        ${diet.sample.map(m => `
          <div class="card">
            <span class="tag-title">${m.meal.toUpperCase()}</span>
            <ul style="padding-left:18px;margin:10px 0 0;color:#fff;font-size:15px">
              ${m.items.map(i => `<li>${i}</li>`).join("")}
            </ul>
          </div>
        `).join("")}

        <button class="btn angled block mt" id="use-diet">ASIGNAR ESTA DIETA ▶</button>
      `;

      body.querySelector("#diet-chips").addEventListener("click", (e) => {
        const b = e.target.closest(".chip"); if (!b) return;
        setState({ dietId: b.dataset.id });
        draw();
      });
      body.querySelector("#use-diet").onclick = () => {
        setState({ dietId: curId });
        alert(`Dieta ${diet.name} asignada ✓`);
      };
    }

    if (tab === "registro") {
      const hasKey = !!getApiKey();
      // Per-meal kcal breakdown for bar chart
      const mealNames = todayMeals.map(m => (m.name || "Comida").slice(0, 6));
      const mealKcals = todayMeals.map(m => m.kcal || 0);
      const kcalPct = macros.kcal > 0 ? Math.min(100, Math.round(todayTotals.kcal / macros.kcal * 100)) : 0;

      body.innerHTML = `
        <div class="metric-card nutrition animate-in">
          <div class="metric-card__header">
            <span class="metric-card__title">Registro hoy</span>
            <div class="metric-card__icon" style="background:rgba(34,197,94,0.15);color:var(--metric-nutrition);border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:16px">&#127860;</div>
          </div>
          <div class="stat-big">
            <span class="stat-big__number">${todayTotals.kcal}<span class="stat-big__unit">/ ${macros.kcal} kcal</span></span>
            <span class="stat-big__label">${kcalPct}% del objetivo</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;margin-top:14px">
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:11px;color:#888;font-family:var(--font-title);width:36px;letter-spacing:.08em">PROT</span>
              <div style="flex:1;height:5px;background:#222;border-radius:3px;overflow:hidden">
                <div style="height:100%;width:${macros.proteinG > 0 ? Math.min(100, Math.round(todayTotals.p / macros.proteinG * 100)) : 0}%;background:var(--metric-nutrition);border-radius:3px"></div>
              </div>
              <span style="font-size:11px;color:#aaa;font-family:var(--font-title);width:54px;text-align:right">${todayTotals.p}/${macros.proteinG}g</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:11px;color:#888;font-family:var(--font-title);width:36px;letter-spacing:.08em">CARB</span>
              <div style="flex:1;height:5px;background:#222;border-radius:3px;overflow:hidden">
                <div style="height:100%;width:${macros.carbsG > 0 ? Math.min(100, Math.round(todayTotals.c / macros.carbsG * 100)) : 0}%;background:#4ADE80;border-radius:3px"></div>
              </div>
              <span style="font-size:11px;color:#aaa;font-family:var(--font-title);width:54px;text-align:right">${todayTotals.c}/${macros.carbsG}g</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:11px;color:#888;font-family:var(--font-title);width:36px;letter-spacing:.08em">FAT</span>
              <div style="flex:1;height:5px;background:#222;border-radius:3px;overflow:hidden">
                <div style="height:100%;width:${macros.fatsG > 0 ? Math.min(100, Math.round(todayTotals.f / macros.fatsG * 100)) : 0}%;background:#16A34A;border-radius:3px"></div>
              </div>
              <span style="font-size:11px;color:#aaa;font-family:var(--font-title);width:54px;text-align:right">${todayTotals.f}/${macros.fatsG}g</span>
            </div>
          </div>
          ${todayMeals.length > 0 ? `
            <div style="margin-top:16px">
              <div style="font-size:11px;color:#888;font-family:var(--font-title);text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px">Kcal por comida</div>
              <div id="nutrition-meal-chart" style="height:70px"></div>
            </div>
          ` : ""}
        </div>

        <div class="card">
          <span class="tag-title">REGISTRAR COMIDA</span>
          <div class="subtitle-under-tag">Foto · IA reconoce el plato</div>
          ${!hasKey ? `<p style="color:#ffb020"><small>⚠ Configura tu API key de Claude en Perfil → Integraciones.</small></p>` : ""}
          <div class="row mt gap-sm">
            <label class="btn ghost" style="cursor:pointer">
              📷 SUBIR FOTO
              <input id="meal-photo" type="file" accept="image/*" capture="environment" style="display:none"/>
            </label>
            <button class="btn dark" id="manual-meal">✏️ MANUAL</button>
          </div>
          <div id="meal-result" class="mt"></div>
        </div>

        ${todayMeals.length ? `<h3>Comidas de hoy</h3>` : ""}
        ${todayMeals.map((m,i) => `
          <div class="card">
            <div class="row between">
              <div>
                <b>${m.name || "Comida"}</b>
                <div><small>${m.kcal} kcal · P${m.proteinG} C${m.carbsG} F${m.fatsG}</small></div>
                <small style="color:#888">${(m.items||[]).join(", ")}</small>
              </div>
              <button class="btn small dark" data-del="${i}">🗑</button>
            </div>
          </div>
        `).join("")}
      `;

      // Render meal kcal bar chart
      const mealChartEl = body.querySelector("#nutrition-meal-chart");
      if (mealChartEl && mealKcals.length > 0) {
        renderBarChart(mealChartEl, mealKcals, "#22C55E");
      }

      const input = body.querySelector("#meal-photo");
      const resultBox = body.querySelector("#meal-result");
      input.addEventListener("change", async (e) => {
        const file = e.target.files?.[0]; if (!file) return;
        resultBox.innerHTML = `<div class="card"><p>🔍 Analizando con IA...</p></div>`;
        try {
          const r = await analyzeMealPhoto(file);
          resultBox.innerHTML = `
            <div class="card accent">
              <span class="tag-title">DETECTADO</span>
              <div class="subtitle-under-tag">${r.meal_name || "Plato"}</div>
              <p>${(r.items||[]).join(" · ")}</p>
              <div class="grid-3">
                <div class="stat"><b>${r.kcal}</b><span>KCAL</span></div>
                <div class="stat"><b>${r.protein_g}g</b><span>PROT</span></div>
                <div class="stat"><b>${r.carbs_g}g</b><span>CARB</span></div>
              </div>
              <small>Confianza: ${Math.round((r.confidence||0.7)*100)}% · ${r.notes||""}</small>
              <button class="btn block mt" id="save-meal">REGISTRAR ✓</button>
            </div>
          `;
          body.querySelector("#save-meal").onclick = () => {
            const meals = [...getState().meals, {
              date: today(),
              name: r.meal_name,
              items: r.items,
              kcal: r.kcal, proteinG: r.protein_g, carbsG: r.carbs_g, fatsG: r.fats_g,
              aiSource: "claude"
            }];
            setState({ meals });
            draw();
          };
        } catch (err) {
          resultBox.innerHTML = `<div class="card"><p style="color:#ff4757">${err.message}</p></div>`;
        }
      });

      body.querySelector("#manual-meal").onclick = () => {
        const name = prompt("Nombre de la comida") || "Comida";
        const kcal = +(prompt("Kcal totales") || 0);
        const proteinG = +(prompt("Proteína (g)") || 0);
        const carbsG = +(prompt("Carbs (g)") || 0);
        const fatsG = +(prompt("Grasas (g)") || 0);
        const meals = [...getState().meals, { date: today(), name, kcal, proteinG, carbsG, fatsG, items: [] }];
        setState({ meals });
        draw();
      };

      body.querySelectorAll("[data-del]").forEach(b => b.onclick = () => {
        const i = +b.dataset.del;
        const meals = getState().meals.filter((_, idx) => idx !== i);
        setState({ meals });
        draw();
      });
    }

    if (tab === "compra") {
      const list = buildShoppingList(curId, 7);
      body.innerHTML = `
        <div class="card">
          <span class="tag-title">LISTA · 7 DÍAS</span>
          <div class="subtitle-under-tag">${diet.name}</div>
          <p>Generada a partir de tu dieta activa. Porciones aproximadas.</p>
          <button class="btn block mt" id="export-list">📋 COPIAR TEXTO</button>
        </div>
        ${Object.entries(list).map(([cat, items]) => `
          <div class="card">
            <span class="tag-title">${cat.toUpperCase()}</span>
            <ul style="padding-left:18px;margin:12px 0 0;color:#fff;font-size:15px">
              ${items.map(it => `<li>${it.item} <small style="color:#888">× ${it.portions}</small></li>`).join("")}
            </ul>
          </div>
        `).join("")}
      `;
      body.querySelector("#export-list").onclick = () => {
        const text = Object.entries(list).map(([cat, items]) =>
          `— ${cat.toUpperCase()} —\n${items.map(it => `• ${it.item} × ${it.portions}`).join("\n")}`
        ).join("\n\n");
        navigator.clipboard?.writeText(`LISTA DE COMPRA · MĀRS FIT\n${diet.name}\n\n${text}`);
        alert("Lista copiada al portapapeles ✓");
      };
    }
  }

  draw();
  return () => {};
}
