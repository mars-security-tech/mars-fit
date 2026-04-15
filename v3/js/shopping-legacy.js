// Generador de lista de la compra semanal a partir de la dieta activa.
// Agrupa ingredientes por categoría y estima cantidad por 7 días.

import { DIETS } from "../data/diets-v3.js";

const CATEGORIES = {
  proteinas: ["huevos","pollo","ternera","pavo","solomillo","salmón","atún","merluza","sardinas","caballa","yogur","lonchas","lomo"],
  vegetales: ["brócoli","ensalada","hoja verde","tomate","verdura","verduras","aguacate","limón","lechuga","espinaca"],
  carbohidratos: ["arroz","pasta","avena","patata","boniato","pan","tostada","plátano","fruta","fresas","frutos rojos"],
  grasas: ["aove","aceite","nueces","frutos secos","coco"],
  despensa: ["proteína en polvo","café"]
};

function classify(item) {
  const low = item.toLowerCase();
  for (const [cat, kws] of Object.entries(CATEGORIES)) {
    if (kws.some(k => low.includes(k))) return cat;
  }
  return "otros";
}

// Extrae ingredientes limpios (sin cantidades específicas por sencillez)
function extractIngredients(sample) {
  const bag = new Map();
  for (const meal of sample) {
    for (const dish of meal.items) {
      // separa por comas/y
      const parts = dish.split(/,| con | y |\+/).map(p => p.trim()).filter(Boolean);
      for (const part of parts) {
        const clean = part.replace(/\d+\s*(g|ml|kg|l)\s*/gi, "").replace(/^\d+\s*/, "").trim();
        if (!clean) continue;
        const lower = clean.toLowerCase();
        bag.set(lower, (bag.get(lower) || 0) + 1);
      }
    }
  }
  return bag;
}

export function buildShoppingList(dietId, days = 7) {
  const diet = DIETS[dietId];
  if (!diet) return {};

  // v3 diets have pre-built shoppingList arrays — use them directly
  if (Array.isArray(diet.shoppingList) && diet.shoppingList.length > 0) {
    const groups = {};
    for (const entry of diet.shoppingList) {
      const cat = classify(entry.item || '');
      (groups[cat] = groups[cat] || []).push({
        item: entry.item,
        portions: entry.qty || (entry.g ? Math.round(entry.g / 100) : 1),
        qty: entry.qty || '',
      });
    }
    for (const k of Object.keys(groups)) groups[k].sort((a,b) => b.portions - a.portions);
    return groups;
  }

  // Fallback: legacy v1 diets with sample[] arrays
  if (!diet.sample) return {};
  const counts = extractIngredients(diet.sample);
  const groups = {};
  for (const [item, freq] of counts) {
    const cat = classify(item);
    (groups[cat] = groups[cat] || []).push({
      item: item.charAt(0).toUpperCase() + item.slice(1),
      portions: Math.max(1, Math.round((freq * days) / diet.sample.length))
    });
  }
  // ordena cada grupo por frecuencia
  for (const k of Object.keys(groups)) groups[k].sort((a,b) => b.portions - a.portions);
  return groups;
}
