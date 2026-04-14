// Biblioteca base de ejercicios con animación 3D simple.
// `animate` indica el tipo de animación procedural usada en three.js (ver js/anim3d.js)

export const MUSCLES = {
  chest: "Pectoral", back: "Espalda", quads: "Cuádriceps", hamstrings: "Femoral",
  glutes: "Glúteos", shoulders: "Hombro", biceps: "Bíceps", triceps: "Tríceps",
  core: "Core", calves: "Gemelos", cardio: "Cardio", fullbody: "Full body"
};

export const EXERCISES = [
  // --- Pecho ---
  { id: "bench_press", name: "Press de banca", muscle: "chest", equipment: "barra",
    cues: ["Escápulas retraídas", "Pies firmes", "Barra al esternón"],
    animate: "push", tags: ["gym", "fuerza"] },
  { id: "push_up", name: "Flexiones", muscle: "chest", equipment: "peso_corporal",
    cues: ["Core contraído", "Codos a 45°", "Bajada controlada"],
    animate: "pushup", tags: ["casa", "operativo"] },
  { id: "dumbbell_press", name: "Press con mancuernas", muscle: "chest", equipment: "mancuernas",
    cues: ["Codos bajo muñecas", "No arquear lumbar"], animate: "push", tags: ["gym"] },

  // --- Espalda ---
  { id: "pull_up", name: "Dominadas", muscle: "back", equipment: "barra_fija",
    cues: ["Escápulas hacia abajo primero", "Pecho a la barra"],
    animate: "pull", tags: ["operativo", "gym"] },
  { id: "bent_row", name: "Remo con barra", muscle: "back", equipment: "barra",
    cues: ["Pecho fuera", "Codos pegados al cuerpo"], animate: "row", tags: ["gym"] },
  { id: "lat_pulldown", name: "Jalón al pecho", muscle: "back", equipment: "polea",
    cues: ["Pecho arriba", "Baja hasta clavícula"], animate: "pull", tags: ["gym"] },

  // --- Pierna ---
  { id: "squat", name: "Sentadilla", muscle: "quads", equipment: "barra",
    cues: ["Rodillas en línea con pies", "Cadera baja", "Pecho arriba"],
    animate: "squat", tags: ["gym", "operativo"] },
  { id: "lunge", name: "Zancadas", muscle: "quads", equipment: "peso_corporal",
    cues: ["Paso largo", "Rodilla no pasa el pie"], animate: "lunge", tags: ["casa", "operativo"] },
  { id: "deadlift", name: "Peso muerto", muscle: "hamstrings", equipment: "barra",
    cues: ["Espalda neutra", "Barra pegada al cuerpo", "Empuja el suelo"],
    animate: "hinge", tags: ["gym", "fuerza"] },
  { id: "hip_thrust", name: "Hip thrust", muscle: "glutes", equipment: "barra",
    cues: ["Barbilla al pecho", "Glúteo al final"], animate: "hinge", tags: ["gym"] },

  // --- Hombro ---
  { id: "ohp", name: "Press militar", muscle: "shoulders", equipment: "barra",
    cues: ["Glúteo apretado", "No arquear lumbar", "Cabeza adelante al terminar"],
    animate: "push_up_vert", tags: ["gym", "operativo"] },
  { id: "lateral_raise", name: "Elevaciones laterales", muscle: "shoulders", equipment: "mancuernas",
    cues: ["Codos ligeramente flexionados", "Subir hasta la horizontal"],
    animate: "lateral", tags: ["gym"] },

  // --- Brazo ---
  { id: "biceps_curl", name: "Curl de bíceps", muscle: "biceps", equipment: "mancuernas",
    cues: ["Codos fijos", "Contracción arriba"], animate: "curl", tags: ["gym"] },
  { id: "triceps_dip", name: "Fondos en banco", muscle: "triceps", equipment: "banco",
    cues: ["Codos atrás, no hacia afuera"], animate: "dip", tags: ["gym", "casa"] },

  // --- Core ---
  { id: "plank", name: "Plancha", muscle: "core", equipment: "peso_corporal",
    cues: ["Cadera neutra", "Glúteo y core activos"], animate: "plank", tags: ["casa", "operativo"] },
  { id: "crunch", name: "Crunch abdominal", muscle: "core", equipment: "peso_corporal",
    cues: ["Barbilla separada del pecho", "Exhala arriba"], animate: "crunch", tags: ["casa"] },

  // --- Cardio / Táctico ---
  { id: "burpee", name: "Burpees", muscle: "fullbody", equipment: "peso_corporal",
    cues: ["Ritmo constante", "Aterrizaje suave"], animate: "burpee", tags: ["operativo", "cardio"] },
  { id: "kb_swing", name: "Swing con kettlebell", muscle: "glutes", equipment: "kettlebell",
    cues: ["Cadera, no brazos", "Glúteo dispara"], animate: "swing", tags: ["operativo"] },
  { id: "farmer_walk", name: "Paseo del granjero", muscle: "fullbody", equipment: "mancuernas",
    cues: ["Pecho arriba", "Pasos cortos", "Agarre firme"],
    animate: "walk", tags: ["operativo", "tactical"] },
  { id: "sled_push", name: "Empuje de trineo", muscle: "fullbody", equipment: "trineo",
    cues: ["Inclinación 45°", "Pasos cortos y potentes"], animate: "push", tags: ["operativo"] },
  { id: "run_interval", name: "Intervalos 400m", muscle: "cardio", equipment: "pista",
    cues: ["Ritmo sostenible", "Respira por nariz cuando puedas"],
    animate: "run", tags: ["cardio", "operativo"] },
];
