// Integración Apple Health (iOS).
// Estrategias disponibles desde una PWA:
// 1) Import: Apple Health puede exportar un .zip con export.xml. Lo parseamos y traemos datos históricos.
// 2) Siri Shortcut: generamos un link a un atajo que escribe/lee HealthKit (peso, calorías activas)
//    y empuja datos a MĀRS FIT mediante el Share Sheet o una URL.
// 3) Webhook manual: el atajo hace un POST al endpoint del escuadrón Supabase para sincronía continua.
//
// Este módulo implementa (1) completo y (2) como helper de configuración.

import { getState, setState } from "./store.js";

// ---------- (1) Import desde export.xml ----------
export async function importHealthExport(file) {
  if (!(file instanceof File)) throw new Error("Selecciona export.xml o export.zip");
  let xmlText = "";
  if (file.name.endsWith(".zip")) {
    // Descomprimir usando CompressionStream/JSZip bajo demanda
    const JSZip = (await import("https://esm.sh/jszip@3.10.1")).default;
    const zip = await JSZip.loadAsync(file);
    const entry = Object.keys(zip.files).find(n => n.endsWith("export.xml"));
    if (!entry) throw new Error("No encuentro export.xml en el .zip");
    xmlText = await zip.file(entry).async("string");
  } else {
    xmlText = await file.text();
  }

  // Parsear solo los Records relevantes
  const doc = new DOMParser().parseFromString(xmlText, "application/xml");
  const records = doc.querySelectorAll("Record");
  const out = {
    bodyweight: [],    // {date, kg}
    activeKcal: [],    // {date, kcal}
    steps: [],         // {date, count}
    heartRate: [],     // {date, bpm}
    vo2max: []         // {date, value}
  };

  records.forEach(r => {
    const type = r.getAttribute("type") || "";
    const startDate = (r.getAttribute("startDate") || "").slice(0, 10);
    const value = parseFloat(r.getAttribute("value") || "0");
    const unit = r.getAttribute("unit") || "";
    if (!startDate || Number.isNaN(value)) return;

    if (type.endsWith("HKQuantityTypeIdentifierBodyMass")) {
      const kg = unit === "lb" ? value * 0.4535924 : value;
      out.bodyweight.push({ date: startDate, kg: Math.round(kg * 10) / 10 });
    }
    if (type.endsWith("HKQuantityTypeIdentifierActiveEnergyBurned")) {
      out.activeKcal.push({ date: startDate, kcal: Math.round(value) });
    }
    if (type.endsWith("HKQuantityTypeIdentifierStepCount")) {
      out.steps.push({ date: startDate, count: Math.round(value) });
    }
    if (type.endsWith("HKQuantityTypeIdentifierHeartRate")) {
      out.heartRate.push({ date: startDate, bpm: Math.round(value) });
    }
    if (type.endsWith("HKQuantityTypeIdentifierVO2Max")) {
      out.vo2max.push({ date: startDate, value: Math.round(value * 10) / 10 });
    }
  });

  // Agregados diarios (suma pasos/kcal; último peso por día)
  const daySum = (arr, field) => {
    const map = new Map();
    for (const r of arr) map.set(r.date, (map.get(r.date) || 0) + r[field]);
    return [...map.entries()].map(([date, v]) => ({ date, [field]: v })).sort((a,b) => a.date.localeCompare(b.date));
  };
  const dayLast = (arr, field) => {
    const map = new Map();
    for (const r of arr) map.set(r.date, r[field]);
    return [...map.entries()].map(([date, v]) => ({ date, [field]: v })).sort((a,b) => a.date.localeCompare(b.date));
  };

  const bodyweight = dayLast(out.bodyweight, "kg").slice(-365);
  const activeKcal = daySum(out.activeKcal, "kcal").slice(-365);
  const steps = daySum(out.steps, "count").slice(-365);

  // Guardar en state
  const state = getState();
  setState({
    bodyweight,
    health: {
      lastImport: new Date().toISOString(),
      bodyweight,
      activeKcal,
      steps,
      recentBpm: out.heartRate.slice(-50),
      vo2max: out.vo2max.slice(-20)
    }
  });

  return {
    samples: {
      bodyweight: bodyweight.length,
      activeKcal: activeKcal.length,
      steps: steps.length,
      heartRate: out.heartRate.length,
      vo2max: out.vo2max.length
    }
  };
}

// ---------- (2) Siri Shortcut helper ----------
// URL del atajo MĀRS FIT que se puede instalar en iOS para capturar peso/pasos/kcal activas
// y enviarlo al webhook del usuario.
export function siriShortcutInstructions() {
  return {
    title: "Atajo MĀRS FIT Sync",
    steps: [
      "1. Abre la app Atajos en tu iPhone.",
      "2. Crea un atajo nuevo con las acciones 'Obtener muestras de salud' (Peso corporal, Pasos, Kcal activas) en rango: Hoy.",
      "3. Añade 'Obtener contenido de URL' con: método POST, JSON {'weight': Peso, 'steps': Pasos, 'active_kcal': Kcal}, URL de tu webhook MĀRS FIT.",
      "4. Automatización: Ejecutar al finalizar entreno (Apple Watch) o a las 23:00.",
      "5. Comparte el atajo con tu escuadrón para sincronización grupal."
    ]
  };
}
