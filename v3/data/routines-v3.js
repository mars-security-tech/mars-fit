/**
 * MARS FIT v3 — Rutinas de entrenamiento ampliadas
 *
 * Incluye:
 * - 3 rutinas civiles originales
 * - 3 rutinas operativas MARS originales
 * - 10 rutinas nuevas: PPL 6d, Upper/Lower 4d, Full-body 3d,
 *   5/3/1 Wendler, nSuns, PHUL, PHAT, Starting Strength,
 *   Stronglifts 5x5, German Volume Training
 *
 * Cada ejercicio referencia IDs del exercises-v3.js
 * Cada rutina tiene: id, name, role, goal, description,
 * frequency (dias/semana), level, days[]
 *
 * Funcion buildCustomRoutine() para rutinas personalizadas.
 */

// ============================================================
// RUTINAS PREDEFINIDAS
// ============================================================

export const ROUTINES = {

  // ================================================================
  // CIVILES ORIGINALES
  // ================================================================

  civil_volume_ppl: {
    id: 'civil_volume_ppl',
    name: 'Volumen - Push Pull Legs',
    role: 'civil',
    goal: 'volumen',
    description: 'Clasico PPL de 3 dias para hipertrofia. Ideal para intermedios.',
    frequency: 3,
    level: 'intermedio',
    days: [
      { day: 'Lunes - PUSH', exercises: [
        { id: 'bench_press', sets: 4, reps: '6-8', rest: 180 },
        { id: 'ohp', sets: 3, reps: '8-10', rest: 120 },
        { id: 'dumbbell_press', sets: 3, reps: '10-12', rest: 90 },
        { id: 'lateral_raise', sets: 3, reps: '12-15', rest: 60 },
        { id: 'triceps_dip', sets: 3, reps: '10-12', rest: 90 },
      ]},
      { day: 'Miercoles - PULL', exercises: [
        { id: 'pull_up', sets: 4, reps: 'max', rest: 180 },
        { id: 'bent_row', sets: 4, reps: '6-8', rest: 150 },
        { id: 'lat_pulldown', sets: 3, reps: '10-12', rest: 90 },
        { id: 'biceps_curl', sets: 3, reps: '10-12', rest: 60 },
      ]},
      { day: 'Viernes - LEGS', exercises: [
        { id: 'squat', sets: 4, reps: '6-8', rest: 180 },
        { id: 'deadlift', sets: 3, reps: '5', rest: 180 },
        { id: 'hip_thrust', sets: 3, reps: '8-10', rest: 120 },
        { id: 'lunge', sets: 3, reps: '12 c/lado', rest: 90 },
        { id: 'plank', sets: 3, reps: '45s', rest: 60 },
      ]},
    ],
  },

  civil_cut_full: {
    id: 'civil_cut_full',
    name: 'Definicion - Full-body 3d',
    role: 'civil',
    goal: 'definicion',
    description: 'Full-body de alta frecuencia para definicion con cardio integrado.',
    frequency: 3,
    level: 'principiante',
    days: [
      { day: 'Dia 1', exercises: [
        { id: 'squat', sets: 3, reps: '10', rest: 120 },
        { id: 'bench_press', sets: 3, reps: '10', rest: 120 },
        { id: 'bent_row', sets: 3, reps: '10', rest: 120 },
        { id: 'plank', sets: 3, reps: '40s', rest: 60 },
      ]},
      { day: 'Dia 2', exercises: [
        { id: 'deadlift', sets: 3, reps: '6', rest: 150 },
        { id: 'ohp', sets: 3, reps: '10', rest: 120 },
        { id: 'pull_up', sets: 3, reps: 'max', rest: 120 },
        { id: 'crunch', sets: 3, reps: '15', rest: 60 },
      ]},
      { day: 'Dia 3 - Cardio', exercises: [
        { id: 'burpee', sets: 5, reps: '10', rest: 60 },
        { id: 'kb_swing', sets: 4, reps: '20', rest: 60 },
        { id: 'run_interval', sets: 6, reps: '400m', rest: 90 },
      ]},
    ],
  },

  civil_home: {
    id: 'civil_home',
    name: 'En casa - Sin material',
    role: 'civil',
    goal: 'mantenimiento',
    description: 'Circuitos en casa sin equipamiento. Ideal para mantenimiento.',
    frequency: 2,
    level: 'principiante',
    days: [
      { day: 'Circuito A', exercises: [
        { id: 'push_up', sets: 4, reps: '12', rest: 60 },
        { id: 'lunge', sets: 3, reps: '12 c/lado', rest: 60 },
        { id: 'plank', sets: 3, reps: '45s', rest: 45 },
        { id: 'crunch', sets: 3, reps: '20', rest: 45 },
      ]},
      { day: 'Circuito B', exercises: [
        { id: 'burpee', sets: 4, reps: '12', rest: 60 },
        { id: 'push_up', sets: 3, reps: 'max', rest: 60 },
        { id: 'lunge', sets: 3, reps: '15 c/lado', rest: 60 },
      ]},
    ],
  },

  // ================================================================
  // OPERATIVAS MARS ORIGINALES
  // ================================================================

  op_tactical_base: {
    id: 'op_tactical_base',
    name: 'MARS Operativo - Base tactica',
    role: 'operativo',
    goal: 'rendimiento',
    description: 'Prepara fuerza, resistencia y potencia para turnos largos, intervencion y control de eventos.',
    frequency: 3,
    level: 'intermedio',
    days: [
      { day: 'Dia 1 - Fuerza', exercises: [
        { id: 'squat', sets: 5, reps: '5', rest: 180 },
        { id: 'bench_press', sets: 5, reps: '5', rest: 180 },
        { id: 'pull_up', sets: 4, reps: 'max', rest: 120 },
        { id: 'farmer_walk', sets: 3, reps: '40m', rest: 120 },
      ]},
      { day: 'Dia 2 - Potencia + Cardio', exercises: [
        { id: 'kb_swing', sets: 5, reps: '20', rest: 60 },
        { id: 'burpee', sets: 5, reps: '15', rest: 60 },
        { id: 'sled_push', sets: 4, reps: '20m', rest: 90 },
        { id: 'run_interval', sets: 6, reps: '400m', rest: 90 },
      ]},
      { day: 'Dia 3 - Resistencia operativa', exercises: [
        { id: 'push_up', sets: 5, reps: '20', rest: 60 },
        { id: 'lunge', sets: 4, reps: '20 c/lado', rest: 60 },
        { id: 'plank', sets: 4, reps: '60s', rest: 45 },
        { id: 'farmer_walk', sets: 4, reps: '60m', rest: 90 },
      ]},
    ],
  },

  op_event_ready: {
    id: 'op_event_ready',
    name: 'MARS Operativo - Event Ready',
    role: 'operativo',
    goal: 'turnos_largos',
    description: 'Resistencia de pie durante eventos de gran escala. Foco en piernas, core y aguante.',
    frequency: 2,
    level: 'intermedio',
    days: [
      { day: 'Dia 1', exercises: [
        { id: 'squat', sets: 4, reps: '10', rest: 120 },
        { id: 'lunge', sets: 3, reps: '20 c/lado', rest: 90 },
        { id: 'plank', sets: 4, reps: '60s', rest: 45 },
        { id: 'run_interval', sets: 4, reps: '800m', rest: 120 },
      ]},
      { day: 'Dia 2', exercises: [
        { id: 'deadlift', sets: 4, reps: '8', rest: 150 },
        { id: 'hip_thrust', sets: 3, reps: '12', rest: 90 },
        { id: 'farmer_walk', sets: 4, reps: '50m', rest: 90 },
        { id: 'crunch', sets: 3, reps: '20', rest: 45 },
      ]},
    ],
  },

  op_drone_operator: {
    id: 'op_drone_operator',
    name: 'MARS Operativo - Piloto de Dron',
    role: 'operativo',
    goal: 'estabilidad',
    description: 'Foco en estabilidad escapular, core y resistencia postural para operadores aereos.',
    frequency: 2,
    level: 'principiante',
    days: [
      { day: 'Dia 1 - Postura & Core', exercises: [
        { id: 'plank', sets: 4, reps: '60s', rest: 45 },
        { id: 'bent_row', sets: 4, reps: '10', rest: 90 },
        { id: 'lateral_raise', sets: 3, reps: '15', rest: 60 },
        { id: 'crunch', sets: 3, reps: '20', rest: 45 },
      ]},
      { day: 'Dia 2 - Fuerza suave', exercises: [
        { id: 'push_up', sets: 4, reps: '15', rest: 60 },
        { id: 'pull_up', sets: 3, reps: 'max', rest: 120 },
        { id: 'squat', sets: 3, reps: '12', rest: 120 },
      ]},
    ],
  },

  // ================================================================
  // NUEVAS RUTINAS
  // ================================================================

  // ---- PPL 6 DIAS ----
  ppl_6d: {
    id: 'ppl_6d',
    name: 'Push Pull Legs - 6 dias',
    role: 'civil',
    goal: 'volumen',
    description: 'PPL clasico repetido 2 veces por semana. Alta frecuencia para volumen avanzado.',
    frequency: 6,
    level: 'avanzado',
    days: [
      { day: 'Lunes - Push A', exercises: [
        { id: 'bench_press', sets: 4, reps: '5-6', rest: 180 },
        { id: 'ohp', sets: 3, reps: '8-10', rest: 120 },
        { id: 'dumbbell_press', sets: 3, reps: '10-12', rest: 90 },
        { id: 'lateral_raise', sets: 4, reps: '12-15', rest: 60 },
        { id: 'triceps_dip', sets: 3, reps: '10-12', rest: 90 },
      ]},
      { day: 'Martes - Pull A', exercises: [
        { id: 'deadlift', sets: 3, reps: '5', rest: 180 },
        { id: 'pull_up', sets: 4, reps: 'max', rest: 120 },
        { id: 'bent_row', sets: 3, reps: '8-10', rest: 120 },
        { id: 'lat_pulldown', sets: 3, reps: '10-12', rest: 90 },
        { id: 'biceps_curl', sets: 3, reps: '10-12', rest: 60 },
      ]},
      { day: 'Miercoles - Legs A', exercises: [
        { id: 'squat', sets: 4, reps: '5-6', rest: 180 },
        { id: 'hip_thrust', sets: 3, reps: '8-10', rest: 120 },
        { id: 'lunge', sets: 3, reps: '10 c/lado', rest: 90 },
        { id: 'plank', sets: 3, reps: '60s', rest: 60 },
      ]},
      { day: 'Jueves - Push B', exercises: [
        { id: 'ohp', sets: 4, reps: '5-6', rest: 180 },
        { id: 'dumbbell_press', sets: 4, reps: '8-10', rest: 90 },
        { id: 'bench_press', sets: 3, reps: '10-12', rest: 120 },
        { id: 'lateral_raise', sets: 4, reps: '15-20', rest: 60 },
        { id: 'triceps_dip', sets: 3, reps: 'max', rest: 90 },
      ]},
      { day: 'Viernes - Pull B', exercises: [
        { id: 'bent_row', sets: 4, reps: '5-6', rest: 150 },
        { id: 'lat_pulldown', sets: 3, reps: '8-10', rest: 90 },
        { id: 'pull_up', sets: 3, reps: 'max', rest: 120 },
        { id: 'biceps_curl', sets: 4, reps: '8-10', rest: 60 },
      ]},
      { day: 'Sabado - Legs B', exercises: [
        { id: 'deadlift', sets: 3, reps: '5', rest: 180 },
        { id: 'squat', sets: 3, reps: '10-12', rest: 150 },
        { id: 'hip_thrust', sets: 3, reps: '12-15', rest: 90 },
        { id: 'lunge', sets: 3, reps: '12 c/lado', rest: 90 },
        { id: 'crunch', sets: 3, reps: '20', rest: 45 },
      ]},
    ],
  },

  // ---- UPPER / LOWER 4 DIAS ----
  upper_lower_4d: {
    id: 'upper_lower_4d',
    name: 'Upper / Lower - 4 dias',
    role: 'civil',
    goal: 'volumen',
    description: 'Split torso/pierna con frecuencia 2. Buen equilibrio entre volumen y recuperacion.',
    frequency: 4,
    level: 'intermedio',
    days: [
      { day: 'Lunes - Upper A (Fuerza)', exercises: [
        { id: 'bench_press', sets: 4, reps: '5', rest: 180 },
        { id: 'bent_row', sets: 4, reps: '5', rest: 180 },
        { id: 'ohp', sets: 3, reps: '8', rest: 120 },
        { id: 'pull_up', sets: 3, reps: 'max', rest: 120 },
        { id: 'biceps_curl', sets: 2, reps: '12', rest: 60 },
        { id: 'triceps_dip', sets: 2, reps: '12', rest: 60 },
      ]},
      { day: 'Martes - Lower A (Fuerza)', exercises: [
        { id: 'squat', sets: 4, reps: '5', rest: 180 },
        { id: 'deadlift', sets: 3, reps: '5', rest: 180 },
        { id: 'hip_thrust', sets: 3, reps: '8', rest: 120 },
        { id: 'lunge', sets: 3, reps: '10 c/lado', rest: 90 },
        { id: 'plank', sets: 3, reps: '60s', rest: 60 },
      ]},
      { day: 'Jueves - Upper B (Volumen)', exercises: [
        { id: 'dumbbell_press', sets: 4, reps: '10-12', rest: 90 },
        { id: 'lat_pulldown', sets: 4, reps: '10-12', rest: 90 },
        { id: 'lateral_raise', sets: 4, reps: '12-15', rest: 60 },
        { id: 'bent_row', sets: 3, reps: '10-12', rest: 90 },
        { id: 'biceps_curl', sets: 3, reps: '10-12', rest: 60 },
        { id: 'triceps_dip', sets: 3, reps: '10-12', rest: 60 },
      ]},
      { day: 'Viernes - Lower B (Volumen)', exercises: [
        { id: 'squat', sets: 3, reps: '10-12', rest: 120 },
        { id: 'hip_thrust', sets: 4, reps: '10-12', rest: 90 },
        { id: 'lunge', sets: 3, reps: '12 c/lado', rest: 90 },
        { id: 'crunch', sets: 3, reps: '20', rest: 45 },
        { id: 'plank', sets: 3, reps: '45s', rest: 45 },
      ]},
    ],
  },

  // ---- FULL-BODY 3 DIAS ----
  fullbody_3d: {
    id: 'fullbody_3d',
    name: 'Full-body - 3 dias',
    role: 'civil',
    goal: 'volumen',
    description: 'Full-body 3 veces por semana. Ideal para principiantes o quienes buscan alta frecuencia con poco tiempo.',
    frequency: 3,
    level: 'principiante',
    days: [
      { day: 'Dia A', exercises: [
        { id: 'squat', sets: 3, reps: '5', rest: 180 },
        { id: 'bench_press', sets: 3, reps: '5', rest: 180 },
        { id: 'bent_row', sets: 3, reps: '5', rest: 150 },
        { id: 'ohp', sets: 2, reps: '8', rest: 120 },
        { id: 'plank', sets: 2, reps: '45s', rest: 60 },
      ]},
      { day: 'Dia B', exercises: [
        { id: 'deadlift', sets: 3, reps: '5', rest: 180 },
        { id: 'ohp', sets: 3, reps: '5', rest: 150 },
        { id: 'pull_up', sets: 3, reps: 'max', rest: 120 },
        { id: 'dumbbell_press', sets: 2, reps: '10', rest: 90 },
        { id: 'crunch', sets: 2, reps: '15', rest: 45 },
      ]},
      { day: 'Dia C', exercises: [
        { id: 'squat', sets: 3, reps: '8', rest: 150 },
        { id: 'bench_press', sets: 3, reps: '8', rest: 150 },
        { id: 'lat_pulldown', sets: 3, reps: '10', rest: 90 },
        { id: 'hip_thrust', sets: 3, reps: '10', rest: 90 },
        { id: 'biceps_curl', sets: 2, reps: '12', rest: 60 },
      ]},
    ],
  },

  // ---- 5/3/1 WENDLER ----
  wendler_531: {
    id: 'wendler_531',
    name: '5/3/1 Wendler',
    role: 'civil',
    goal: 'fuerza',
    description: 'Programa de fuerza progresiva de Jim Wendler. 4 dias, cada dia un compuesto principal con progresion mensual.',
    frequency: 4,
    level: 'intermedio',
    days: [
      { day: 'Dia 1 - Press militar', exercises: [
        { id: 'ohp', sets: 3, reps: '5/3/1+', rest: 180 },
        { id: 'ohp', sets: 5, reps: '10 (BBB)', rest: 90 },
        { id: 'pull_up', sets: 3, reps: 'max', rest: 90 },
        { id: 'lateral_raise', sets: 3, reps: '12', rest: 60 },
      ]},
      { day: 'Dia 2 - Peso muerto', exercises: [
        { id: 'deadlift', sets: 3, reps: '5/3/1+', rest: 240 },
        { id: 'deadlift', sets: 5, reps: '10 (BBB)', rest: 120 },
        { id: 'lunge', sets: 3, reps: '10 c/lado', rest: 90 },
        { id: 'plank', sets: 3, reps: '60s', rest: 45 },
      ]},
      { day: 'Dia 3 - Press de banca', exercises: [
        { id: 'bench_press', sets: 3, reps: '5/3/1+', rest: 180 },
        { id: 'bench_press', sets: 5, reps: '10 (BBB)', rest: 90 },
        { id: 'bent_row', sets: 3, reps: '10', rest: 90 },
        { id: 'triceps_dip', sets: 3, reps: '12', rest: 60 },
      ]},
      { day: 'Dia 4 - Sentadilla', exercises: [
        { id: 'squat', sets: 3, reps: '5/3/1+', rest: 240 },
        { id: 'squat', sets: 5, reps: '10 (BBB)', rest: 120 },
        { id: 'hip_thrust', sets: 3, reps: '10', rest: 90 },
        { id: 'crunch', sets: 3, reps: '20', rest: 45 },
      ]},
    ],
  },

  // ---- nSuns ----
  nsuns: {
    id: 'nsuns',
    name: 'nSuns 5/3/1 LP',
    role: 'civil',
    goal: 'fuerza',
    description: 'Variante de 5/3/1 con progresion lineal. Alto volumen en compuestos. 4 dias.',
    frequency: 4,
    level: 'avanzado',
    days: [
      { day: 'Dia 1 - Bench / OHP', exercises: [
        { id: 'bench_press', sets: 9, reps: 'T1 piramide', rest: 120 },
        { id: 'ohp', sets: 8, reps: 'T2 piramide', rest: 90 },
        { id: 'lat_pulldown', sets: 3, reps: '10-12', rest: 60 },
        { id: 'biceps_curl', sets: 3, reps: '12', rest: 60 },
      ]},
      { day: 'Dia 2 - Squat / Sumo DL', exercises: [
        { id: 'squat', sets: 9, reps: 'T1 piramide', rest: 150 },
        { id: 'deadlift', sets: 8, reps: 'T2 sumo', rest: 120 },
        { id: 'lunge', sets: 3, reps: '10 c/lado', rest: 90 },
        { id: 'plank', sets: 3, reps: '60s', rest: 45 },
      ]},
      { day: 'Dia 3 - OHP / Bench', exercises: [
        { id: 'ohp', sets: 9, reps: 'T1 piramide', rest: 120 },
        { id: 'bench_press', sets: 8, reps: 'T2 CG', rest: 90 },
        { id: 'pull_up', sets: 3, reps: 'max', rest: 90 },
        { id: 'lateral_raise', sets: 3, reps: '15', rest: 60 },
      ]},
      { day: 'Dia 4 - Deadlift / Squat', exercises: [
        { id: 'deadlift', sets: 9, reps: 'T1 piramide', rest: 180 },
        { id: 'squat', sets: 8, reps: 'T2 front', rest: 120 },
        { id: 'hip_thrust', sets: 3, reps: '10', rest: 90 },
        { id: 'crunch', sets: 3, reps: '20', rest: 45 },
      ]},
    ],
  },

  // ---- PHUL ----
  phul: {
    id: 'phul',
    name: 'PHUL - Power Hypertrophy',
    role: 'civil',
    goal: 'volumen',
    description: 'Power Hypertrophy Upper Lower: 2 dias fuerza + 2 dias hipertrofia. Equilibrio optimo.',
    frequency: 4,
    level: 'intermedio',
    days: [
      { day: 'Lunes - Upper Power', exercises: [
        { id: 'bench_press', sets: 4, reps: '3-5', rest: 180 },
        { id: 'bent_row', sets: 4, reps: '3-5', rest: 180 },
        { id: 'ohp', sets: 3, reps: '5-8', rest: 120 },
        { id: 'lat_pulldown', sets: 3, reps: '6-10', rest: 90 },
        { id: 'biceps_curl', sets: 2, reps: '6-10', rest: 60 },
        { id: 'triceps_dip', sets: 2, reps: '6-10', rest: 60 },
      ]},
      { day: 'Martes - Lower Power', exercises: [
        { id: 'squat', sets: 4, reps: '3-5', rest: 180 },
        { id: 'deadlift', sets: 3, reps: '3-5', rest: 180 },
        { id: 'hip_thrust', sets: 3, reps: '5-8', rest: 120 },
        { id: 'lunge', sets: 3, reps: '5-8', rest: 90 },
        { id: 'plank', sets: 3, reps: '60s', rest: 60 },
      ]},
      { day: 'Jueves - Upper Hypertrophy', exercises: [
        { id: 'dumbbell_press', sets: 4, reps: '8-12', rest: 90 },
        { id: 'lat_pulldown', sets: 4, reps: '8-12', rest: 90 },
        { id: 'lateral_raise', sets: 4, reps: '12-15', rest: 60 },
        { id: 'bent_row', sets: 3, reps: '8-12', rest: 90 },
        { id: 'biceps_curl', sets: 3, reps: '8-12', rest: 60 },
        { id: 'triceps_dip', sets: 3, reps: '8-12', rest: 60 },
      ]},
      { day: 'Viernes - Lower Hypertrophy', exercises: [
        { id: 'squat', sets: 4, reps: '8-12', rest: 120 },
        { id: 'hip_thrust', sets: 4, reps: '8-12', rest: 90 },
        { id: 'lunge', sets: 3, reps: '10-15', rest: 90 },
        { id: 'crunch', sets: 3, reps: '15-20', rest: 45 },
      ]},
    ],
  },

  // ---- PHAT ----
  phat: {
    id: 'phat',
    name: 'PHAT - Layne Norton',
    role: 'civil',
    goal: 'volumen',
    description: 'Power Hypertrophy Adaptive Training: 2 dias potencia + 3 dias hipertrofia. Alto volumen para avanzados.',
    frequency: 5,
    level: 'avanzado',
    days: [
      { day: 'Lunes - Upper Power', exercises: [
        { id: 'bent_row', sets: 3, reps: '3-5', rest: 180 },
        { id: 'pull_up', sets: 2, reps: '6-10', rest: 120 },
        { id: 'bench_press', sets: 3, reps: '3-5', rest: 180 },
        { id: 'dumbbell_press', sets: 2, reps: '6-10', rest: 90 },
        { id: 'ohp', sets: 3, reps: '5-8', rest: 120 },
        { id: 'biceps_curl', sets: 2, reps: '6-10', rest: 60 },
        { id: 'triceps_dip', sets: 2, reps: '6-10', rest: 60 },
      ]},
      { day: 'Martes - Lower Power', exercises: [
        { id: 'squat', sets: 3, reps: '3-5', rest: 180 },
        { id: 'deadlift', sets: 2, reps: '3-5', rest: 180 },
        { id: 'hip_thrust', sets: 2, reps: '6-10', rest: 120 },
        { id: 'lunge', sets: 2, reps: '6-10', rest: 90 },
        { id: 'plank', sets: 3, reps: '60s', rest: 45 },
      ]},
      { day: 'Jueves - Back & Shoulders Hyper', exercises: [
        { id: 'bent_row', sets: 3, reps: '8-12', rest: 90 },
        { id: 'lat_pulldown', sets: 3, reps: '8-12', rest: 90 },
        { id: 'pull_up', sets: 2, reps: '12-15', rest: 90 },
        { id: 'ohp', sets: 3, reps: '8-12', rest: 90 },
        { id: 'lateral_raise', sets: 3, reps: '12-20', rest: 60 },
      ]},
      { day: 'Viernes - Lower Hyper', exercises: [
        { id: 'squat', sets: 3, reps: '8-12', rest: 120 },
        { id: 'hip_thrust', sets: 3, reps: '8-12', rest: 90 },
        { id: 'deadlift', sets: 2, reps: '8-12', rest: 120 },
        { id: 'lunge', sets: 3, reps: '10-15', rest: 90 },
        { id: 'crunch', sets: 3, reps: '15-20', rest: 45 },
      ]},
      { day: 'Sabado - Chest & Arms Hyper', exercises: [
        { id: 'dumbbell_press', sets: 3, reps: '8-12', rest: 90 },
        { id: 'bench_press', sets: 3, reps: '8-12', rest: 90 },
        { id: 'biceps_curl', sets: 3, reps: '8-12', rest: 60 },
        { id: 'triceps_dip', sets: 3, reps: '8-12', rest: 60 },
        { id: 'lateral_raise', sets: 2, reps: '12-15', rest: 60 },
      ]},
    ],
  },

  // ---- STARTING STRENGTH ----
  starting_strength: {
    id: 'starting_strength',
    name: 'Starting Strength',
    role: 'civil',
    goal: 'fuerza',
    description: 'Programa clasico de Mark Rippetoe para principiantes. Progresion lineal con 3 compuestos por sesion.',
    frequency: 3,
    level: 'principiante',
    days: [
      { day: 'Dia A', exercises: [
        { id: 'squat', sets: 3, reps: '5', rest: 180 },
        { id: 'bench_press', sets: 3, reps: '5', rest: 180 },
        { id: 'deadlift', sets: 1, reps: '5', rest: 240 },
      ]},
      { day: 'Dia B', exercises: [
        { id: 'squat', sets: 3, reps: '5', rest: 180 },
        { id: 'ohp', sets: 3, reps: '5', rest: 180 },
        { id: 'deadlift', sets: 1, reps: '5', rest: 240 },
      ]},
    ],
  },

  // ---- STRONGLIFTS 5x5 ----
  stronglifts_5x5: {
    id: 'stronglifts_5x5',
    name: 'StrongLifts 5x5',
    role: 'civil',
    goal: 'fuerza',
    description: 'Programa simple de fuerza: 5 series de 5 reps en compuestos. Alternando A/B, 3 dias por semana.',
    frequency: 3,
    level: 'principiante',
    days: [
      { day: 'Dia A', exercises: [
        { id: 'squat', sets: 5, reps: '5', rest: 180 },
        { id: 'bench_press', sets: 5, reps: '5', rest: 180 },
        { id: 'bent_row', sets: 5, reps: '5', rest: 150 },
      ]},
      { day: 'Dia B', exercises: [
        { id: 'squat', sets: 5, reps: '5', rest: 180 },
        { id: 'ohp', sets: 5, reps: '5', rest: 180 },
        { id: 'deadlift', sets: 1, reps: '5', rest: 240 },
      ]},
    ],
  },

  // ---- GERMAN VOLUME TRAINING ----
  gvt: {
    id: 'gvt',
    name: 'German Volume Training (10x10)',
    role: 'civil',
    goal: 'volumen',
    description: '10 series de 10 repeticiones en compuestos principales. Volumen extremo para hipertrofia avanzada.',
    frequency: 4,
    level: 'avanzado',
    days: [
      { day: 'Dia 1 - Pecho & Espalda', exercises: [
        { id: 'dumbbell_press', sets: 10, reps: '10', rest: 90 },
        { id: 'bent_row', sets: 10, reps: '10', rest: 90 },
        { id: 'lateral_raise', sets: 3, reps: '12', rest: 60 },
      ]},
      { day: 'Dia 2 - Pierna & Core', exercises: [
        { id: 'squat', sets: 10, reps: '10', rest: 90 },
        { id: 'hip_thrust', sets: 3, reps: '12', rest: 90 },
        { id: 'plank', sets: 3, reps: '60s', rest: 45 },
        { id: 'crunch', sets: 3, reps: '15', rest: 45 },
      ]},
      { day: 'Dia 3 - Hombro & Brazo', exercises: [
        { id: 'ohp', sets: 10, reps: '10', rest: 90 },
        { id: 'pull_up', sets: 10, reps: '10', rest: 90 },
        { id: 'biceps_curl', sets: 3, reps: '12', rest: 60 },
        { id: 'triceps_dip', sets: 3, reps: '12', rest: 60 },
      ]},
      { day: 'Dia 4 - Posterior & Funcional', exercises: [
        { id: 'deadlift', sets: 10, reps: '10', rest: 90 },
        { id: 'lunge', sets: 3, reps: '10 c/lado', rest: 90 },
        { id: 'farmer_walk', sets: 3, reps: '40m', rest: 90 },
      ]},
    ],
  },
};

// ============================================================
// LISTA DE IDS PARA SELECTORES
// ============================================================

export const ROUTINE_IDS = Object.keys(ROUTINES);

// ============================================================
// HELPERS
// ============================================================

/**
 * Obtener rutinas filtradas por criterio.
 * @param {object} filters - {role?, goal?, level?, frequency?}
 * @returns {object[]}
 */
export function filterRoutines(filters = {}) {
  return Object.values(ROUTINES).filter(r => {
    if (filters.role && r.role !== filters.role) return false;
    if (filters.goal && r.goal !== filters.goal) return false;
    if (filters.level && r.level !== filters.level) return false;
    if (filters.frequency && r.frequency !== filters.frequency) return false;
    return true;
  });
}

// ============================================================
// CONSTRUCTOR DE RUTINA PERSONALIZADA
// ============================================================

/**
 * Crea una rutina personalizada.
 *
 * @param {object} options
 * @param {string} [options.baseRoutineId] - ID de rutina base para copiar (null = desde cero)
 * @param {string} options.name - Nombre de la rutina
 * @param {string} [options.role] - 'civil' | 'operativo'
 * @param {string} [options.goal] - objetivo
 * @param {string} [options.description] - descripcion
 * @param {number} [options.frequency] - dias/semana
 * @param {string} [options.level] - principiante | intermedio | avanzado
 * @param {Array} [options.days] - Array de dias con ejercicios
 * @returns {object} rutina personalizada lista para guardar
 */
export function buildCustomRoutine(options = {}) {
  const base = options.baseRoutineId ? structuredClone(ROUTINES[options.baseRoutineId]) : null;

  return {
    id: options.id || `custom_${Date.now()}`,
    name: options.name || (base ? `${base.name} (personalizada)` : 'Mi rutina'),
    role: options.role || base?.role || 'civil',
    goal: options.goal || base?.goal || 'volumen',
    description: options.description || base?.description || 'Rutina personalizada',
    frequency: options.frequency ?? base?.frequency ?? 3,
    level: options.level || base?.level || 'intermedio',
    custom: true,
    baseRoutineId: options.baseRoutineId || null,
    days: options.days || base?.days || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
