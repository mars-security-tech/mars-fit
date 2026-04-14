// Rutinas predefinidas según objetivo y rol (civil / operativo MARS)

export const ROUTINES = {
  // ---- CIVIL ----
  civil_volume_ppl: {
    name: "Volumen · Push Pull Legs",
    role: "civil",
    goal: "volumen",
    days: [
      { day: "Lunes · PUSH", exercises: [
        { id: "bench_press", sets: 4, reps: "6-8" },
        { id: "ohp", sets: 3, reps: "8-10" },
        { id: "dumbbell_press", sets: 3, reps: "10-12" },
        { id: "lateral_raise", sets: 3, reps: "12-15" },
        { id: "triceps_dip", sets: 3, reps: "10-12" },
      ]},
      { day: "Miércoles · PULL", exercises: [
        { id: "pull_up", sets: 4, reps: "max" },
        { id: "bent_row", sets: 4, reps: "6-8" },
        { id: "lat_pulldown", sets: 3, reps: "10-12" },
        { id: "biceps_curl", sets: 3, reps: "10-12" },
      ]},
      { day: "Viernes · LEGS", exercises: [
        { id: "squat", sets: 4, reps: "6-8" },
        { id: "deadlift", sets: 3, reps: "5" },
        { id: "hip_thrust", sets: 3, reps: "8-10" },
        { id: "lunge", sets: 3, reps: "12 c/lado" },
        { id: "plank", sets: 3, reps: "45s" },
      ]},
    ],
  },
  civil_cut_full: {
    name: "Definición · Full-body 3d",
    role: "civil",
    goal: "definicion",
    days: [
      { day: "Día 1", exercises: [
        { id: "squat", sets: 3, reps: "10" },
        { id: "bench_press", sets: 3, reps: "10" },
        { id: "bent_row", sets: 3, reps: "10" },
        { id: "plank", sets: 3, reps: "40s" },
      ]},
      { day: "Día 2", exercises: [
        { id: "deadlift", sets: 3, reps: "6" },
        { id: "ohp", sets: 3, reps: "10" },
        { id: "pull_up", sets: 3, reps: "max" },
        { id: "crunch", sets: 3, reps: "15" },
      ]},
      { day: "Día 3 · Cardio", exercises: [
        { id: "burpee", sets: 5, reps: "10" },
        { id: "kb_swing", sets: 4, reps: "20" },
        { id: "run_interval", sets: 6, reps: "400m" },
      ]},
    ],
  },
  civil_home: {
    name: "En casa · Sin material",
    role: "civil",
    goal: "mantenimiento",
    days: [
      { day: "Circuito A", exercises: [
        { id: "push_up", sets: 4, reps: "12" },
        { id: "lunge", sets: 3, reps: "12 c/lado" },
        { id: "plank", sets: 3, reps: "45s" },
        { id: "crunch", sets: 3, reps: "20" },
      ]},
      { day: "Circuito B", exercises: [
        { id: "burpee", sets: 4, reps: "12" },
        { id: "push_up", sets: 3, reps: "max" },
        { id: "lunge", sets: 3, reps: "15 c/lado" },
      ]},
    ],
  },

  // ---- MODO OPERATIVO MARS ----
  op_tactical_base: {
    name: "MĀRS Operativo · Base táctica",
    role: "operativo",
    goal: "rendimiento",
    description: "Prepara fuerza, resistencia y potencia para turnos largos, intervención y control de eventos.",
    days: [
      { day: "Día 1 · Fuerza", exercises: [
        { id: "squat", sets: 5, reps: "5" },
        { id: "bench_press", sets: 5, reps: "5" },
        { id: "pull_up", sets: 4, reps: "max" },
        { id: "farmer_walk", sets: 3, reps: "40m" },
      ]},
      { day: "Día 2 · Potencia + Cardio", exercises: [
        { id: "kb_swing", sets: 5, reps: "20" },
        { id: "burpee", sets: 5, reps: "15" },
        { id: "sled_push", sets: 4, reps: "20m" },
        { id: "run_interval", sets: 6, reps: "400m" },
      ]},
      { day: "Día 3 · Resistencia operativa", exercises: [
        { id: "push_up", sets: 5, reps: "20" },
        { id: "lunge", sets: 4, reps: "20 c/lado" },
        { id: "plank", sets: 4, reps: "60s" },
        { id: "farmer_walk", sets: 4, reps: "60m" },
      ]},
    ],
  },
  op_event_ready: {
    name: "MĀRS Operativo · Event Ready",
    role: "operativo",
    goal: "turnos_largos",
    description: "Resistencia de pie durante eventos de gran escala (estilo Velada del Año). Foco en piernas, core y aguante.",
    days: [
      { day: "Día 1", exercises: [
        { id: "squat", sets: 4, reps: "10" },
        { id: "lunge", sets: 3, reps: "20 c/lado" },
        { id: "plank", sets: 4, reps: "60s" },
        { id: "run_interval", sets: 4, reps: "800m" },
      ]},
      { day: "Día 2", exercises: [
        { id: "deadlift", sets: 4, reps: "8" },
        { id: "hip_thrust", sets: 3, reps: "12" },
        { id: "farmer_walk", sets: 4, reps: "50m" },
        { id: "crunch", sets: 3, reps: "20" },
      ]},
    ],
  },
  op_drone_operator: {
    name: "MĀRS Operativo · Piloto de Dron",
    role: "operativo",
    goal: "estabilidad",
    description: "Foco en estabilidad escapular, core y resistencia postural para operadores aéreos.",
    days: [
      { day: "Día 1 · Postura & Core", exercises: [
        { id: "plank", sets: 4, reps: "60s" },
        { id: "bent_row", sets: 4, reps: "10" },
        { id: "lateral_raise", sets: 3, reps: "15" },
        { id: "crunch", sets: 3, reps: "20" },
      ]},
      { day: "Día 2 · Fuerza suave", exercises: [
        { id: "push_up", sets: 4, reps: "15" },
        { id: "pull_up", sets: 3, reps: "max" },
        { id: "squat", sets: 3, reps: "12" },
      ]},
    ],
  },
};
