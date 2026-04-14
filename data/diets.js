// Planes de dieta. Cada tipo tiene un split de macros y un menú de ejemplo (7 días simplificado a 3 para MVP).

export const DIETS = {
  paleo_llorente: {
    id: "paleo_llorente",
    name: "Paleo · Marcos Llorente",
    desc: "Carne, pescado, huevos, verduras, fruta, tubérculos, frutos secos y aceite de oliva virgen extra. Sin cereales, sin lácteos, sin legumbres, sin azúcar, sin procesados.",
    macros: { p: 0.30, c: 0.35, f: 0.35 },
    rules: [
      "Prioriza carnes de pasto y pescado azul (sardina, caballa, salmón).",
      "Huevos diarios (3-5 al día es normal en este enfoque).",
      "Carbohidratos de tubérculo (boniato, patata, yuca) y fruta.",
      "Grasa de AOVE, aguacate, coco, frutos secos.",
      "Sin cereales (incluye arroz y avena), sin leche, sin legumbres, sin azúcares añadidos."
    ],
    sample: [
      { meal: "Desayuno", items: ["3 huevos revueltos en AOVE", "Aguacate", "Fresas", "Puñado de nueces"] },
      { meal: "Comida",  items: ["Solomillo de ternera a la plancha", "Boniato asado", "Ensalada de hoja verde con AOVE"] },
      { meal: "Merienda", items: ["Sardinas en lata con aceite de oliva", "Plátano"] },
      { meal: "Cena", items: ["Salmón al horno con limón", "Brócoli al vapor", "Patata hervida con AOVE"] }
    ]
  },

  mediterranea: {
    id: "mediterranea",
    name: "Mediterránea",
    desc: "Dieta equilibrada basada en AOVE, pescado, legumbres, verdura, fruta y cereales integrales.",
    macros: { p: 0.25, c: 0.50, f: 0.25 },
    rules: [
      "Aceite de oliva virgen extra como grasa principal.",
      "Pescado 3-4 veces por semana.",
      "Legumbres 2-3 veces por semana.",
      "Verdura y fruta todos los días.",
      "Cereal integral (avena, arroz integral, pan integral)."
    ],
    sample: [
      { meal: "Desayuno", items: ["Tostada integral con tomate y AOVE", "Café con leche", "Fruta"] },
      { meal: "Comida",  items: ["Lentejas con verduras", "Ensalada", "Yogur natural"] },
      { meal: "Merienda", items: ["Bocadillo de atún con tomate"] },
      { meal: "Cena", items: ["Merluza al horno", "Verdura asada", "Fruta"] }
    ]
  },

  alta_proteina: {
    id: "alta_proteina",
    name: "Alta proteína · Volumen",
    desc: "Dieta para ganancia muscular con superávit calórico y 2g de proteína por kg.",
    macros: { p: 0.30, c: 0.50, f: 0.20 },
    rules: [
      "Proteína en cada comida (~40g).",
      "Carbohidratos peri-entrenamiento.",
      "5-6 comidas si necesitas volumen alto."
    ],
    sample: [
      { meal: "Desayuno", items: ["Avena 80g con plátano y proteína en polvo", "Huevos revueltos"] },
      { meal: "Media mañana", items: ["Pollo 150g con arroz 100g"] },
      { meal: "Comida", items: ["Ternera 200g", "Pasta 100g", "Ensalada con AOVE"] },
      { meal: "Post-entreno", items: ["Batido de proteína + plátano + avena"] },
      { meal: "Cena", items: ["Salmón 200g", "Patata", "Verdura"] }
    ]
  },

  deficit_flexible: {
    id: "deficit_flexible",
    name: "Definición · IIFYM",
    desc: "Flexible con macros objetivo. Cualquier alimento entra si cuadra el total.",
    macros: { p: 0.35, c: 0.40, f: 0.25 },
    rules: [
      "Prioriza proteína alta (2-2.2g/kg) en déficit.",
      "Fibra 25g+ al día.",
      "Mantén un poco de margen para alimentos placenteros."
    ],
    sample: [
      { meal: "Desayuno", items: ["Tortilla de 3 claras + 1 huevo", "Fruta", "Café"] },
      { meal: "Comida", items: ["Pollo 180g", "Arroz 60g", "Verdura abundante"] },
      { meal: "Merienda", items: ["Yogur griego 0%", "Frutos rojos"] },
      { meal: "Cena", items: ["Atún a la plancha", "Ensalada", "Patata 150g"] }
    ]
  },

  mars_operativo: {
    id: "mars_operativo",
    name: "MĀRS Operativo · Turnos",
    desc: "Plan para personal de MARS con turnos largos y nocturnos. Energía sostenida, saciedad, evita somnolencia.",
    macros: { p: 0.30, c: 0.40, f: 0.30 },
    rules: [
      "Comida fuerte antes del turno con proteína + carbohidrato complejo.",
      "Snacks cada 3-4h: frutos secos, fruta, yogur, pavo.",
      "Cafeína controlada (no en las 5h previas al sueño).",
      "Hidratación: 35ml por kg mínimo.",
      "Evita ultra-procesados en servicio."
    ],
    sample: [
      { meal: "Pre-turno", items: ["Arroz 80g con pollo 150g y verduras", "AOVE", "Fruta"] },
      { meal: "Mitad de turno", items: ["Pavo lonchas + pan integral", "Nueces", "Fruta"] },
      { meal: "Post-turno", items: ["Tortilla francesa", "Aguacate", "Yogur natural"] }
    ]
  }
};
