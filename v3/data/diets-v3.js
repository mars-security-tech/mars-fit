/**
 * MARS FIT v3 — Planes de dieta ampliados
 *
 * Estructura mejorada con:
 * - Alimentos intercambiables por comida
 * - Lista de compra detallada con gramos
 * - Horarios sugeridos de comidas
 * - Objetivo de hidratacion
 * - Funcion buildCustomDiet() para dietas personalizadas
 *
 * Cada dieta tiene:
 * - id, name, desc, macros {p, c, f}, rules[]
 * - schedule: horario sugerido de comidas
 * - hydration: ml/dia objetivo
 * - meals[]: comidas del dia con items + alternativas
 * - shoppingList[]: lista de compra semanal con cantidades
 */

// ============================================================
// DIETAS PREDEFINIDAS
// ============================================================

export const DIETS = {

  // ---- 1. PALEO LLORENTE ----
  paleo_llorente: {
    id: 'paleo_llorente',
    name: 'Paleo - Marcos Llorente',
    desc: 'Carne, pescado, huevos, verduras, fruta, tuberculos, frutos secos y AOVE. Sin cereales, sin lacteos, sin legumbres, sin azucar, sin procesados.',
    macros: { p: 0.30, c: 0.35, f: 0.35 },
    rules: [
      'Prioriza carnes de pasto y pescado azul (sardina, caballa, salmon).',
      'Huevos diarios (3-5 al dia es normal en este enfoque).',
      'Carbohidratos de tuberculo (boniato, patata, yuca) y fruta.',
      'Grasa de AOVE, aguacate, coco, frutos secos.',
      'Sin cereales (incluye arroz y avena), sin leche, sin legumbres, sin azucares anadidos.',
    ],
    schedule: { desayuno: '08:00', comida: '13:30', merienda: '17:00', cena: '21:00' },
    hydration: 2800,
    meals: [
      {
        name: 'Desayuno',
        items: [
          { food: '3 huevos revueltos en AOVE', g: 180, kcal: 280, p: 20, c: 2, f: 22 },
          { food: 'Aguacate (medio)', g: 80, kcal: 130, p: 1.5, c: 7, f: 11 },
          { food: 'Fresas', g: 100, kcal: 32, p: 0.7, c: 8, f: 0.3 },
          { food: 'Punado de nueces', g: 30, kcal: 185, p: 4, c: 4, f: 18 },
        ],
        alternatives: [
          { food: 'Tortilla de 3 huevos con espinacas', g: 200, kcal: 260, p: 19, c: 3, f: 20 },
          { food: 'Platano + mantequilla de almendra', g: 140, kcal: 230, p: 5, c: 30, f: 12 },
        ],
      },
      {
        name: 'Comida',
        items: [
          { food: 'Solomillo de ternera a la plancha', g: 200, kcal: 310, p: 40, c: 0, f: 16 },
          { food: 'Boniato asado', g: 200, kcal: 180, p: 3, c: 42, f: 0.2 },
          { food: 'Ensalada de hoja verde con AOVE', g: 150, kcal: 90, p: 2, c: 5, f: 7 },
        ],
        alternatives: [
          { food: 'Pechuga de pollo', g: 200, kcal: 220, p: 42, c: 0, f: 5 },
          { food: 'Patata hervida', g: 200, kcal: 160, p: 4, c: 36, f: 0.2 },
        ],
      },
      {
        name: 'Merienda',
        items: [
          { food: 'Sardinas en lata con AOVE', g: 100, kcal: 210, p: 25, c: 0, f: 12 },
          { food: 'Platano', g: 120, kcal: 105, p: 1.3, c: 27, f: 0.4 },
        ],
        alternatives: [
          { food: 'Jamon serrano', g: 60, kcal: 150, p: 18, c: 0, f: 9 },
          { food: 'Manzana', g: 150, kcal: 78, p: 0.5, c: 21, f: 0.2 },
        ],
      },
      {
        name: 'Cena',
        items: [
          { food: 'Salmon al horno con limon', g: 200, kcal: 360, p: 40, c: 0, f: 22 },
          { food: 'Brocoli al vapor', g: 150, kcal: 50, p: 5, c: 7, f: 0.5 },
          { food: 'Patata hervida con AOVE', g: 150, kcal: 150, p: 3, c: 27, f: 5 },
        ],
        alternatives: [
          { food: 'Lubina al horno', g: 200, kcal: 200, p: 38, c: 0, f: 5 },
          { food: 'Calabacin a la plancha', g: 150, kcal: 25, p: 2, c: 4, f: 0.4 },
        ],
      },
    ],
    shoppingList: [
      { item: 'Huevos camperos', qty: '2 docenas', g: 1440 },
      { item: 'Solomillo de ternera', qty: '1 kg', g: 1000 },
      { item: 'Salmon fresco', qty: '800g', g: 800 },
      { item: 'Sardinas en lata', qty: '4 latas', g: 400 },
      { item: 'Boniato', qty: '1 kg', g: 1000 },
      { item: 'Patatas', qty: '1 kg', g: 1000 },
      { item: 'Brocoli', qty: '500g', g: 500 },
      { item: 'Aguacate', qty: '4 unidades', g: 640 },
      { item: 'Fresas', qty: '500g', g: 500 },
      { item: 'Platanos', qty: '6 unidades', g: 720 },
      { item: 'Nueces', qty: '200g', g: 200 },
      { item: 'AOVE', qty: '500ml', g: 460 },
      { item: 'Ensalada mezclum', qty: '2 bolsas', g: 300 },
    ],
  },

  // ---- 2. MEDITERRANEA ----
  mediterranea: {
    id: 'mediterranea',
    name: 'Mediterranea',
    desc: 'Dieta equilibrada basada en AOVE, pescado, legumbres, verdura, fruta y cereales integrales.',
    macros: { p: 0.25, c: 0.50, f: 0.25 },
    rules: [
      'Aceite de oliva virgen extra como grasa principal.',
      'Pescado 3-4 veces por semana.',
      'Legumbres 2-3 veces por semana.',
      'Verdura y fruta todos los dias.',
      'Cereal integral (avena, arroz integral, pan integral).',
    ],
    schedule: { desayuno: '08:00', comida: '14:00', merienda: '17:30', cena: '21:00' },
    hydration: 2500,
    meals: [
      {
        name: 'Desayuno',
        items: [
          { food: 'Tostada integral con tomate y AOVE', g: 80, kcal: 180, p: 5, c: 28, f: 6 },
          { food: 'Cafe con leche', g: 200, kcal: 80, p: 5, c: 8, f: 3 },
          { food: 'Fruta de temporada', g: 150, kcal: 60, p: 1, c: 15, f: 0.3 },
        ],
        alternatives: [
          { food: 'Avena con leche y canela', g: 250, kcal: 220, p: 8, c: 38, f: 5 },
          { food: 'Yogur natural con miel y nueces', g: 200, kcal: 190, p: 8, c: 20, f: 9 },
        ],
      },
      {
        name: 'Comida',
        items: [
          { food: 'Lentejas con verduras', g: 300, kcal: 330, p: 22, c: 45, f: 6 },
          { food: 'Ensalada mixta', g: 120, kcal: 40, p: 2, c: 6, f: 1 },
          { food: 'Yogur natural', g: 125, kcal: 65, p: 5, c: 5, f: 3 },
        ],
        alternatives: [
          { food: 'Garbanzos con espinacas', g: 300, kcal: 310, p: 18, c: 42, f: 7 },
          { food: 'Arroz integral con verduras', g: 300, kcal: 290, p: 8, c: 55, f: 4 },
        ],
      },
      {
        name: 'Merienda',
        items: [
          { food: 'Bocadillo de atun con tomate', g: 120, kcal: 250, p: 18, c: 28, f: 7 },
        ],
        alternatives: [
          { food: 'Fruta + punado de almendras', g: 180, kcal: 200, p: 5, c: 20, f: 12 },
        ],
      },
      {
        name: 'Cena',
        items: [
          { food: 'Merluza al horno', g: 200, kcal: 180, p: 34, c: 0, f: 4 },
          { food: 'Verdura asada (pimiento, calabacin)', g: 200, kcal: 60, p: 3, c: 10, f: 1 },
          { food: 'Fruta', g: 150, kcal: 60, p: 1, c: 15, f: 0.3 },
        ],
        alternatives: [
          { food: 'Dorada a la plancha', g: 200, kcal: 170, p: 36, c: 0, f: 3 },
          { food: 'Pisto manchego', g: 200, kcal: 90, p: 2, c: 12, f: 4 },
        ],
      },
    ],
    shoppingList: [
      { item: 'Pan integral', qty: '1 barra/dia', g: 500 },
      { item: 'Tomates', qty: '1 kg', g: 1000 },
      { item: 'Lentejas', qty: '500g', g: 500 },
      { item: 'Garbanzos', qty: '500g', g: 500 },
      { item: 'Merluza fresca', qty: '600g', g: 600 },
      { item: 'Atun en lata', qty: '3 latas', g: 240 },
      { item: 'Yogur natural', qty: '6 unidades', g: 750 },
      { item: 'Leche semidesnatada', qty: '1L', g: 1030 },
      { item: 'Verdura variada', qty: '2 kg', g: 2000 },
      { item: 'Fruta de temporada', qty: '2 kg', g: 2000 },
      { item: 'AOVE', qty: '500ml', g: 460 },
      { item: 'Arroz integral', qty: '500g', g: 500 },
    ],
  },

  // ---- 3. ALTA PROTEINA ----
  alta_proteina: {
    id: 'alta_proteina',
    name: 'Alta proteina - Volumen',
    desc: 'Dieta para ganancia muscular con superavit calorico y 2g de proteina por kg.',
    macros: { p: 0.30, c: 0.50, f: 0.20 },
    rules: [
      'Proteina en cada comida (~40g).',
      'Carbohidratos peri-entrenamiento.',
      '5-6 comidas si necesitas volumen alto.',
    ],
    schedule: { desayuno: '07:30', mediaMa: '10:30', comida: '13:30', postEntreno: '17:00', cena: '21:00' },
    hydration: 3000,
    meals: [
      {
        name: 'Desayuno',
        items: [
          { food: 'Avena 80g con platano y proteina en polvo', g: 300, kcal: 380, p: 30, c: 55, f: 6 },
          { food: 'Huevos revueltos (3)', g: 180, kcal: 210, p: 18, c: 2, f: 15 },
        ],
        alternatives: [
          { food: 'Tortitas de avena con proteina', g: 250, kcal: 350, p: 28, c: 45, f: 8 },
        ],
      },
      {
        name: 'Media manana',
        items: [
          { food: 'Pollo 150g con arroz 100g', g: 250, kcal: 350, p: 35, c: 40, f: 5 },
        ],
        alternatives: [
          { food: 'Atun con pasta integral', g: 250, kcal: 320, p: 30, c: 38, f: 5 },
        ],
      },
      {
        name: 'Comida',
        items: [
          { food: 'Ternera 200g', g: 200, kcal: 310, p: 40, c: 0, f: 16 },
          { food: 'Pasta 100g', g: 100, kcal: 350, p: 12, c: 70, f: 2 },
          { food: 'Ensalada con AOVE', g: 120, kcal: 80, p: 2, c: 5, f: 6 },
        ],
        alternatives: [
          { food: 'Pollo al horno', g: 200, kcal: 220, p: 42, c: 0, f: 5 },
          { food: 'Arroz blanco', g: 100, kcal: 350, p: 7, c: 78, f: 1 },
        ],
      },
      {
        name: 'Post-entreno',
        items: [
          { food: 'Batido de proteina + platano + avena', g: 400, kcal: 350, p: 35, c: 45, f: 5 },
        ],
        alternatives: [
          { food: 'Yogur griego con miel y granola', g: 300, kcal: 320, p: 20, c: 40, f: 10 },
        ],
      },
      {
        name: 'Cena',
        items: [
          { food: 'Salmon 200g', g: 200, kcal: 360, p: 40, c: 0, f: 22 },
          { food: 'Patata', g: 200, kcal: 160, p: 4, c: 36, f: 0.2 },
          { food: 'Verdura', g: 150, kcal: 40, p: 3, c: 6, f: 0.5 },
        ],
        alternatives: [
          { food: 'Pechuga de pavo', g: 200, kcal: 200, p: 40, c: 0, f: 4 },
          { food: 'Boniato', g: 200, kcal: 180, p: 3, c: 42, f: 0.2 },
        ],
      },
    ],
    shoppingList: [
      { item: 'Pechuga de pollo', qty: '1.5 kg', g: 1500 },
      { item: 'Ternera magra', qty: '1 kg', g: 1000 },
      { item: 'Salmon', qty: '800g', g: 800 },
      { item: 'Huevos', qty: '2 docenas', g: 1440 },
      { item: 'Avena', qty: '500g', g: 500 },
      { item: 'Proteina en polvo', qty: '1 bote', g: 900 },
      { item: 'Arroz blanco', qty: '1 kg', g: 1000 },
      { item: 'Pasta integral', qty: '500g', g: 500 },
      { item: 'Patatas', qty: '2 kg', g: 2000 },
      { item: 'Platanos', qty: '7 unidades', g: 840 },
      { item: 'Verdura variada', qty: '1.5 kg', g: 1500 },
      { item: 'AOVE', qty: '500ml', g: 460 },
    ],
  },

  // ---- 4. DEFICIT FLEXIBLE (IIFYM) ----
  deficit_flexible: {
    id: 'deficit_flexible',
    name: 'Definicion - IIFYM',
    desc: 'Flexible con macros objetivo. Cualquier alimento entra si cuadra el total.',
    macros: { p: 0.35, c: 0.40, f: 0.25 },
    rules: [
      'Prioriza proteina alta (2-2.2g/kg) en deficit.',
      'Fibra 25g+ al dia.',
      'Manten un poco de margen para alimentos placenteros.',
    ],
    schedule: { desayuno: '08:00', comida: '13:30', merienda: '17:00', cena: '20:30' },
    hydration: 2500,
    meals: [
      {
        name: 'Desayuno',
        items: [
          { food: 'Tortilla de 3 claras + 1 huevo', g: 180, kcal: 150, p: 18, c: 1, f: 8 },
          { food: 'Fruta', g: 150, kcal: 60, p: 1, c: 15, f: 0.3 },
          { food: 'Cafe solo', g: 200, kcal: 5, p: 0, c: 1, f: 0 },
        ],
        alternatives: [
          { food: 'Yogur griego 0% con frutos rojos', g: 200, kcal: 110, p: 15, c: 10, f: 1 },
        ],
      },
      {
        name: 'Comida',
        items: [
          { food: 'Pollo 180g', g: 180, kcal: 200, p: 38, c: 0, f: 4 },
          { food: 'Arroz 60g', g: 60, kcal: 210, p: 4, c: 47, f: 0.5 },
          { food: 'Verdura abundante', g: 200, kcal: 50, p: 3, c: 8, f: 0.5 },
        ],
        alternatives: [
          { food: 'Pavo a la plancha', g: 180, kcal: 180, p: 36, c: 0, f: 3 },
          { food: 'Quinoa', g: 60, kcal: 210, p: 8, c: 38, f: 3 },
        ],
      },
      {
        name: 'Merienda',
        items: [
          { food: 'Yogur griego 0%', g: 170, kcal: 90, p: 12, c: 7, f: 1 },
          { food: 'Frutos rojos', g: 100, kcal: 45, p: 1, c: 10, f: 0.3 },
        ],
        alternatives: [
          { food: 'Batido de proteina con agua', g: 300, kcal: 120, p: 25, c: 3, f: 1 },
        ],
      },
      {
        name: 'Cena',
        items: [
          { food: 'Atun a la plancha', g: 180, kcal: 200, p: 40, c: 0, f: 4 },
          { food: 'Ensalada grande', g: 200, kcal: 50, p: 3, c: 8, f: 1 },
          { food: 'Patata 150g', g: 150, kcal: 120, p: 3, c: 27, f: 0.2 },
        ],
        alternatives: [
          { food: 'Bacalao al horno', g: 200, kcal: 180, p: 36, c: 0, f: 3 },
          { food: 'Verdura al vapor', g: 200, kcal: 50, p: 3, c: 8, f: 0.5 },
        ],
      },
    ],
    shoppingList: [
      { item: 'Pechuga de pollo', qty: '1 kg', g: 1000 },
      { item: 'Atun fresco', qty: '600g', g: 600 },
      { item: 'Claras de huevo', qty: '1L', g: 1000 },
      { item: 'Huevos', qty: '6 unidades', g: 360 },
      { item: 'Yogur griego 0%', qty: '6 unidades', g: 1020 },
      { item: 'Arroz', qty: '500g', g: 500 },
      { item: 'Patatas', qty: '1 kg', g: 1000 },
      { item: 'Verdura variada', qty: '2 kg', g: 2000 },
      { item: 'Frutos rojos', qty: '500g', g: 500 },
      { item: 'Fruta de temporada', qty: '1 kg', g: 1000 },
    ],
  },

  // ---- 5. MARS OPERATIVO ----
  mars_operativo: {
    id: 'mars_operativo',
    name: 'MARS Operativo - Turnos',
    desc: 'Plan para personal de MARS con turnos largos y nocturnos. Energia sostenida, saciedad, evita somnolencia.',
    macros: { p: 0.30, c: 0.40, f: 0.30 },
    rules: [
      'Comida fuerte antes del turno con proteina + carbohidrato complejo.',
      'Snacks cada 3-4h: frutos secos, fruta, yogur, pavo.',
      'Cafeina controlada (no en las 5h previas al sueno).',
      'Hidratacion: 35ml por kg minimo.',
      'Evita ultra-procesados en servicio.',
    ],
    schedule: { preTurno: '14:00', mitadTurno: '20:00', postTurno: '02:00' },
    hydration: 3000,
    meals: [
      {
        name: 'Pre-turno',
        items: [
          { food: 'Arroz 80g con pollo 150g y verduras', g: 350, kcal: 420, p: 35, c: 50, f: 8 },
          { food: 'AOVE (cucharada)', g: 10, kcal: 90, p: 0, c: 0, f: 10 },
          { food: 'Fruta', g: 150, kcal: 60, p: 1, c: 15, f: 0.3 },
        ],
        alternatives: [
          { food: 'Pasta integral con ternera y tomate', g: 350, kcal: 430, p: 33, c: 52, f: 9 },
        ],
      },
      {
        name: 'Mitad de turno',
        items: [
          { food: 'Pavo lonchas + pan integral', g: 120, kcal: 200, p: 20, c: 22, f: 4 },
          { food: 'Nueces', g: 30, kcal: 185, p: 4, c: 4, f: 18 },
          { food: 'Fruta', g: 120, kcal: 50, p: 0.5, c: 12, f: 0.2 },
        ],
        alternatives: [
          { food: 'Bocadillo de atun', g: 150, kcal: 250, p: 20, c: 28, f: 7 },
          { food: 'Barrita de frutos secos', g: 40, kcal: 180, p: 5, c: 20, f: 10 },
        ],
      },
      {
        name: 'Post-turno',
        items: [
          { food: 'Tortilla francesa (3 huevos)', g: 180, kcal: 220, p: 18, c: 1, f: 16 },
          { food: 'Aguacate', g: 80, kcal: 130, p: 1.5, c: 7, f: 11 },
          { food: 'Yogur natural', g: 125, kcal: 65, p: 5, c: 5, f: 3 },
        ],
        alternatives: [
          { food: 'Revuelto de claras con jamon', g: 200, kcal: 180, p: 22, c: 2, f: 10 },
          { food: 'Platano', g: 120, kcal: 105, p: 1.3, c: 27, f: 0.4 },
        ],
      },
    ],
    shoppingList: [
      { item: 'Pechuga de pollo', qty: '1 kg', g: 1000 },
      { item: 'Pavo en lonchas', qty: '400g', g: 400 },
      { item: 'Huevos', qty: '1.5 docenas', g: 1080 },
      { item: 'Arroz', qty: '500g', g: 500 },
      { item: 'Pan integral', qty: '1 barra/dia', g: 500 },
      { item: 'Nueces/almendras', qty: '200g', g: 200 },
      { item: 'Aguacate', qty: '3 unidades', g: 480 },
      { item: 'Yogur natural', qty: '7 unidades', g: 875 },
      { item: 'Fruta variada', qty: '2 kg', g: 2000 },
      { item: 'Verdura', qty: '1 kg', g: 1000 },
      { item: 'AOVE', qty: '250ml', g: 230 },
    ],
  },

  // ---- 6. CETOGENICA ----
  cetogenica: {
    id: 'cetogenica',
    name: 'Cetogenica (Keto)',
    desc: 'Muy baja en carbohidratos (<50g/dia), alta en grasas. El cuerpo usa cetonas como combustible principal.',
    macros: { p: 0.25, c: 0.05, f: 0.70 },
    rules: [
      'Maximo 20-50g de carbohidratos netos al dia.',
      'Grasa como fuente principal de energia.',
      'Proteina moderada (no excesiva, puede salir de cetosis).',
      'Eliminar azucar, cereales, legumbres, fruta dulce.',
      'Priorizar: carnes, pescados, huevos, quesos curados, aguacate, frutos secos, AOVE, mantequilla.',
      'Suplementar electrolitos (sodio, potasio, magnesio).',
    ],
    schedule: { desayuno: '09:00', comida: '14:00', cena: '20:30' },
    hydration: 3000,
    meals: [
      {
        name: 'Desayuno',
        items: [
          { food: 'Huevos revueltos con bacon (3+3)', g: 200, kcal: 420, p: 25, c: 1, f: 35 },
          { food: 'Aguacate', g: 100, kcal: 160, p: 2, c: 9, f: 15 },
          { food: 'Cafe con aceite de coco', g: 250, kcal: 120, p: 0, c: 0, f: 14 },
        ],
        alternatives: [
          { food: 'Tortilla con queso y espinacas', g: 220, kcal: 380, p: 22, c: 3, f: 32 },
        ],
      },
      {
        name: 'Comida',
        items: [
          { food: 'Entrecot de ternera', g: 250, kcal: 500, p: 45, c: 0, f: 35 },
          { food: 'Ensalada con AOVE y queso', g: 200, kcal: 200, p: 8, c: 5, f: 17 },
        ],
        alternatives: [
          { food: 'Muslos de pollo con piel al horno', g: 250, kcal: 450, p: 40, c: 0, f: 30 },
          { food: 'Coliflor gratinada con queso', g: 200, kcal: 180, p: 10, c: 6, f: 14 },
        ],
      },
      {
        name: 'Cena',
        items: [
          { food: 'Salmon con mantequilla', g: 200, kcal: 400, p: 38, c: 0, f: 28 },
          { food: 'Esparragos salteados con ajo', g: 150, kcal: 60, p: 4, c: 5, f: 3 },
          { food: 'Punado de nueces de macadamia', g: 30, kcal: 215, p: 2, c: 4, f: 23 },
        ],
        alternatives: [
          { food: 'Caballa al horno', g: 200, kcal: 350, p: 35, c: 0, f: 24 },
        ],
      },
    ],
    shoppingList: [
      { item: 'Entrecot de ternera', qty: '1 kg', g: 1000 },
      { item: 'Salmon', qty: '800g', g: 800 },
      { item: 'Bacon', qty: '300g', g: 300 },
      { item: 'Huevos', qty: '2 docenas', g: 1440 },
      { item: 'Aguacate', qty: '5 unidades', g: 800 },
      { item: 'Queso curado', qty: '300g', g: 300 },
      { item: 'Mantequilla', qty: '250g', g: 250 },
      { item: 'Aceite de coco', qty: '200ml', g: 184 },
      { item: 'AOVE', qty: '500ml', g: 460 },
      { item: 'Nueces de macadamia', qty: '200g', g: 200 },
      { item: 'Verdura baja en carbs (espinacas, esparragos, brocoli)', qty: '1.5 kg', g: 1500 },
    ],
  },

  // ---- 7. VEGETARIANA ----
  vegetariana: {
    id: 'vegetariana',
    name: 'Vegetariana',
    desc: 'Sin carne ni pescado. Incluye huevos y lacteos. Rica en legumbres, cereales, verdura y fruta.',
    macros: { p: 0.22, c: 0.50, f: 0.28 },
    rules: [
      'Combinar legumbres + cereales para proteina completa.',
      'Huevos y lacteos como fuente de proteina animal.',
      'Suplementar vitamina B12.',
      'Hierro de legumbres + vitamina C para absorcion.',
      'Frutos secos y semillas a diario.',
    ],
    schedule: { desayuno: '08:00', comida: '14:00', merienda: '17:30', cena: '21:00' },
    hydration: 2500,
    meals: [
      {
        name: 'Desayuno',
        items: [
          { food: 'Tostadas integrales con aguacate y huevo pochado', g: 200, kcal: 300, p: 14, c: 28, f: 16 },
          { food: 'Zumo de naranja natural', g: 200, kcal: 80, p: 1.5, c: 18, f: 0.4 },
        ],
        alternatives: [
          { food: 'Bowl de yogur con granola y fruta', g: 300, kcal: 320, p: 12, c: 45, f: 12 },
        ],
      },
      {
        name: 'Comida',
        items: [
          { food: 'Garbanzos con espinacas y arroz', g: 350, kcal: 420, p: 20, c: 58, f: 12 },
          { food: 'Ensalada con semillas y AOVE', g: 150, kcal: 110, p: 4, c: 6, f: 8 },
        ],
        alternatives: [
          { food: 'Lentejas estofadas', g: 300, kcal: 330, p: 22, c: 45, f: 6 },
          { food: 'Pasta con verduras y queso', g: 300, kcal: 380, p: 16, c: 50, f: 14 },
        ],
      },
      {
        name: 'Merienda',
        items: [
          { food: 'Hummus con crudites', g: 200, kcal: 200, p: 8, c: 20, f: 10 },
        ],
        alternatives: [
          { food: 'Tortitas de arroz con crema de cacahuete', g: 60, kcal: 180, p: 6, c: 18, f: 10 },
        ],
      },
      {
        name: 'Cena',
        items: [
          { food: 'Tortilla de verduras (3 huevos)', g: 250, kcal: 280, p: 18, c: 8, f: 20 },
          { food: 'Pan integral con tomate', g: 60, kcal: 130, p: 4, c: 22, f: 2 },
          { food: 'Fruta', g: 150, kcal: 60, p: 1, c: 15, f: 0.3 },
        ],
        alternatives: [
          { food: 'Revuelto de tofu con verduras', g: 250, kcal: 220, p: 18, c: 10, f: 14 },
        ],
      },
    ],
    shoppingList: [
      { item: 'Garbanzos', qty: '500g', g: 500 },
      { item: 'Lentejas', qty: '500g', g: 500 },
      { item: 'Arroz integral', qty: '500g', g: 500 },
      { item: 'Huevos', qty: '2 docenas', g: 1440 },
      { item: 'Yogur natural', qty: '7 unidades', g: 875 },
      { item: 'Queso fresco', qty: '300g', g: 300 },
      { item: 'Aguacate', qty: '3 unidades', g: 480 },
      { item: 'Pan integral', qty: '1 barra/dia', g: 500 },
      { item: 'Hummus', qty: '300g', g: 300 },
      { item: 'Verdura variada', qty: '2.5 kg', g: 2500 },
      { item: 'Fruta', qty: '2 kg', g: 2000 },
      { item: 'Semillas (chia, lino, girasol)', qty: '200g', g: 200 },
      { item: 'AOVE', qty: '500ml', g: 460 },
    ],
  },

  // ---- 8. VEGANA ----
  vegana: {
    id: 'vegana',
    name: 'Vegana',
    desc: 'Sin productos animales. Basada en legumbres, cereales, frutos secos, semillas, tofu y verdura.',
    macros: { p: 0.20, c: 0.55, f: 0.25 },
    rules: [
      'Suplementar B12 obligatorio.',
      'Combinar legumbres + cereales para aminoacidos completos.',
      'Hierro de legumbres y verdura de hoja + vitamina C.',
      'Omega-3 de semillas de lino, chia o suplemento de algas.',
      'Calcio de brocoli, tofu, bebida vegetal fortificada.',
      'Proteina de soja, tofu, tempeh, setan, legumbres.',
    ],
    schedule: { desayuno: '08:00', comida: '14:00', merienda: '17:30', cena: '21:00' },
    hydration: 2500,
    meals: [
      {
        name: 'Desayuno',
        items: [
          { food: 'Avena con bebida de soja, platano y semillas de chia', g: 350, kcal: 350, p: 15, c: 55, f: 10 },
          { food: 'Tostada con crema de cacahuete', g: 60, kcal: 180, p: 6, c: 14, f: 12 },
        ],
        alternatives: [
          { food: 'Smoothie de espinacas, platano, proteina de guisante', g: 400, kcal: 300, p: 22, c: 40, f: 6 },
        ],
      },
      {
        name: 'Comida',
        items: [
          { food: 'Tofu salteado con verduras y arroz integral', g: 400, kcal: 450, p: 22, c: 55, f: 16 },
          { food: 'Ensalada de garbanzos', g: 150, kcal: 180, p: 10, c: 22, f: 6 },
        ],
        alternatives: [
          { food: 'Curry de lentejas rojas con arroz', g: 400, kcal: 420, p: 20, c: 58, f: 10 },
        ],
      },
      {
        name: 'Merienda',
        items: [
          { food: 'Punado de almendras + datiles', g: 60, kcal: 220, p: 5, c: 25, f: 12 },
          { food: 'Fruta', g: 150, kcal: 60, p: 1, c: 15, f: 0.3 },
        ],
        alternatives: [
          { food: 'Hummus con pan pita integral', g: 150, kcal: 250, p: 8, c: 30, f: 10 },
        ],
      },
      {
        name: 'Cena',
        items: [
          { food: 'Hamburguesa de legumbres casera', g: 150, kcal: 250, p: 14, c: 28, f: 10 },
          { food: 'Boniato asado', g: 200, kcal: 180, p: 3, c: 42, f: 0.2 },
          { food: 'Guacamole', g: 80, kcal: 120, p: 1.5, c: 6, f: 10 },
        ],
        alternatives: [
          { food: 'Tempeh a la plancha con quinoa', g: 250, kcal: 320, p: 22, c: 35, f: 12 },
        ],
      },
    ],
    shoppingList: [
      { item: 'Tofu firme', qty: '600g', g: 600 },
      { item: 'Tempeh', qty: '400g', g: 400 },
      { item: 'Garbanzos', qty: '500g', g: 500 },
      { item: 'Lentejas rojas', qty: '500g', g: 500 },
      { item: 'Arroz integral', qty: '1 kg', g: 1000 },
      { item: 'Avena', qty: '500g', g: 500 },
      { item: 'Bebida de soja', qty: '2L', g: 2060 },
      { item: 'Crema de cacahuete', qty: '300g', g: 300 },
      { item: 'Semillas de chia', qty: '200g', g: 200 },
      { item: 'Almendras', qty: '200g', g: 200 },
      { item: 'Datiles', qty: '200g', g: 200 },
      { item: 'Boniato', qty: '1 kg', g: 1000 },
      { item: 'Verdura variada', qty: '2.5 kg', g: 2500 },
      { item: 'Fruta', qty: '2 kg', g: 2000 },
      { item: 'AOVE', qty: '500ml', g: 460 },
      { item: 'Suplemento B12', qty: '1 bote', g: null },
    ],
  },

  // ---- 9. AYUNO INTERMITENTE 16:8 ----
  ayuno_intermitente: {
    id: 'ayuno_intermitente',
    name: 'Ayuno intermitente 16:8',
    desc: 'Ventana de alimentacion de 8 horas, ayuno de 16. Tipicamente de 12:00 a 20:00.',
    macros: { p: 0.30, c: 0.40, f: 0.30 },
    rules: [
      'Ventana de alimentacion: 8 horas (ej: 12:00-20:00).',
      'Ayuno: 16 horas (incluye sueno). Solo agua, cafe solo, te.',
      'Primera comida: proteina + grasa + carbohidrato complejo.',
      'Dos o tres comidas grandes en la ventana.',
      'No romper el ayuno antes de la hora establecida.',
      'Entreno preferiblemente antes de romper el ayuno o al inicio de la ventana.',
    ],
    schedule: { comida1: '12:00', comida2: '16:00', comida3: '19:30' },
    hydration: 2800,
    meals: [
      {
        name: 'Comida 1 (12:00 - Romper ayuno)',
        items: [
          { food: 'Tortilla de 3 huevos con verduras', g: 250, kcal: 300, p: 20, c: 8, f: 22 },
          { food: 'Arroz integral 80g', g: 80, kcal: 280, p: 6, c: 60, f: 2 },
          { food: 'Aguacate', g: 80, kcal: 130, p: 1.5, c: 7, f: 11 },
        ],
        alternatives: [
          { food: 'Bowl de pollo con arroz y verduras', g: 400, kcal: 450, p: 35, c: 50, f: 12 },
        ],
      },
      {
        name: 'Comida 2 (16:00)',
        items: [
          { food: 'Pollo 200g con patata 200g', g: 400, kcal: 380, p: 42, c: 36, f: 6 },
          { food: 'Ensalada con AOVE', g: 150, kcal: 90, p: 2, c: 5, f: 7 },
        ],
        alternatives: [
          { food: 'Salmon con boniato y verdura', g: 400, kcal: 450, p: 38, c: 40, f: 16 },
        ],
      },
      {
        name: 'Comida 3 (19:30 - Ultima)',
        items: [
          { food: 'Salmon 180g', g: 180, kcal: 320, p: 36, c: 0, f: 20 },
          { food: 'Verdura al vapor', g: 200, kcal: 50, p: 3, c: 8, f: 0.5 },
          { food: 'Yogur griego con frutos secos', g: 200, kcal: 200, p: 12, c: 15, f: 12 },
        ],
        alternatives: [
          { food: 'Pechuga de pavo con quinoa', g: 300, kcal: 340, p: 38, c: 30, f: 8 },
        ],
      },
    ],
    shoppingList: [
      { item: 'Pechuga de pollo', qty: '1 kg', g: 1000 },
      { item: 'Salmon', qty: '800g', g: 800 },
      { item: 'Huevos', qty: '2 docenas', g: 1440 },
      { item: 'Arroz integral', qty: '500g', g: 500 },
      { item: 'Patatas', qty: '1 kg', g: 1000 },
      { item: 'Aguacate', qty: '4 unidades', g: 640 },
      { item: 'Yogur griego', qty: '7 unidades', g: 1190 },
      { item: 'Frutos secos', qty: '200g', g: 200 },
      { item: 'Verdura variada', qty: '2 kg', g: 2000 },
      { item: 'AOVE', qty: '500ml', g: 460 },
    ],
  },
};

// ============================================================
// LISTA DE IDS PARA SELECTORES
// ============================================================

export const DIET_IDS = Object.keys(DIETS);

// ============================================================
// CONSTRUCTOR DE DIETA PERSONALIZADA
// ============================================================

/**
 * Crea una dieta personalizada a partir de un plan base (o desde cero).
 *
 * @param {object} options
 * @param {string} [options.baseDietId] - ID de dieta base para copiar (null = desde cero)
 * @param {string} options.name - Nombre de la dieta custom
 * @param {object} [options.macros] - {p, c, f} proporciones (0-1, deben sumar ~1)
 * @param {Array} [options.meals] - Array de comidas personalizadas
 * @param {Array} [options.rules] - Reglas personalizadas
 * @param {object} [options.schedule] - Horarios de comidas
 * @param {number} [options.hydration] - ml/dia objetivo
 * @returns {object} dieta personalizada lista para guardar
 */
export function buildCustomDiet(options = {}) {
  const base = options.baseDietId ? structuredClone(DIETS[options.baseDietId]) : null;

  const diet = {
    id: options.id || `custom_${Date.now()}`,
    name: options.name || (base ? `${base.name} (personalizada)` : 'Mi dieta'),
    desc: options.desc || base?.desc || 'Dieta personalizada',
    custom: true,
    baseDietId: options.baseDietId || null,
    macros: options.macros || base?.macros || { p: 0.30, c: 0.40, f: 0.30 },
    rules: options.rules || base?.rules || [],
    schedule: options.schedule || base?.schedule || { desayuno: '08:00', comida: '14:00', cena: '21:00' },
    hydration: options.hydration ?? base?.hydration ?? 2500,
    meals: options.meals || base?.meals || [],
    shoppingList: options.shoppingList || base?.shoppingList || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Regenerar lista de compra si se modificaron las comidas
  if (options.meals && !options.shoppingList) {
    diet.shoppingList = generateShoppingList(diet.meals);
  }

  return diet;
}

/**
 * Genera lista de compra semanal a partir de las comidas.
 * Agrupa alimentos similares y multiplica por 7 dias.
 *
 * @param {Array} meals
 * @returns {Array} shoppingList
 */
export function generateShoppingList(meals) {
  const map = new Map();

  for (const meal of meals) {
    for (const item of (meal.items || [])) {
      const key = item.food.toLowerCase().replace(/\s+/g, '_');
      if (map.has(key)) {
        map.get(key).g += (item.g || 0) * 7;
      } else {
        map.set(key, {
          item: item.food,
          qty: '',
          g: (item.g || 0) * 7,
        });
      }
    }
  }

  // Formatear cantidades
  return Array.from(map.values()).map(entry => {
    if (entry.g > 1000) {
      entry.qty = `${(entry.g / 1000).toFixed(1)} kg`;
    } else {
      entry.qty = `${Math.round(entry.g)}g`;
    }
    return entry;
  });
}
