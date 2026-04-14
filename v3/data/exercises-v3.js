// ============================================================================
// MARS FIT v3 — Base de datos de ejercicios profesional
// Biblioteca exhaustiva: 180+ ejercicios para gimnasio moderno
// ============================================================================

// ---------------------------------------------------------------------------
// CONSTANTES
// ---------------------------------------------------------------------------

export const MUSCLE_GROUPS = {
  pecho: {
    label: "Pecho",
    muscles: ["pectoralMayor", "pectoralMenor"],
  },
  espalda: {
    label: "Espalda",
    muscles: [
      "dorsalAncho",
      "trapecio",
      "romboides",
      "erectoresEspinales",
      "infraespinoso",
    ],
  },
  hombros: {
    label: "Hombros",
    muscles: ["deltoidesAnterior", "deltoidesLateral", "deltoidesPosterior"],
  },
  brazos: {
    label: "Brazos",
    muscles: ["biceps", "triceps", "braquial", "antebrazo"],
  },
  core: {
    label: "Core",
    muscles: ["rectoAbdominal", "oblicuos", "transverso", "erectores"],
  },
  piernas: {
    label: "Piernas",
    muscles: [
      "cuadriceps",
      "isquiotibiales",
      "gluteoMayor",
      "gluteoMedio",
      "aductores",
      "abductores",
      "gemelos",
      "soleo",
      "tibialAnterior",
    ],
  },
};

export const EQUIPMENT_LIST = [
  "barbell",
  "dumbbell",
  "cable",
  "machine",
  "smith",
  "kettlebell",
  "bodyweight",
  "band",
  "trx",
  "box",
  "sled",
  "barFija",
  "bench",
  "none",
];

export const CATEGORIES = [
  "compound",
  "isolation",
  "cardio",
  "flexibility",
  "plyometric",
];

// ---------------------------------------------------------------------------
// EJERCICIOS
// ---------------------------------------------------------------------------

const exercises = [

  // ==========================================================================
  // PECHO (19 ejercicios)
  // ==========================================================================

  {
    id: "barbell_bench_press",
    name: "Press de banca con barra",
    nameEn: "Barbell Bench Press",
    category: "compound",
    muscles: {
      primary: ["pectoralMayor"],
      secondary: ["deltoidesAnterior", "triceps"],
    },
    equipment: "barbell",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "Acuéstate en el banco con los pies firmes en el suelo",
      "Agarra la barra con un agarre ligeramente más ancho que los hombros",
      "Baja la barra al pecho de forma controlada",
      "Empuja explosivamente hasta extender los brazos",
    ],
    tips: [
      "Mantén las escápulas retraídas y deprimidas",
      "Los codos a 45° del torso, no a 90°",
      "Pies firmemente plantados, glúteo en contacto con el banco",
    ],
    commonMistakes: [
      "Rebotar la barra en el pecho",
      "Levantar la cadera del banco",
      "Agarre demasiado ancho",
    ],
    videoPrompt:
      "Hombre musculoso realizando press de banca con barra olímpica en un gimnasio moderno bien iluminado, vista lateral 3/4, movimiento completo de bajada y subida, calidad cinematográfica",
    sets: { beginner: "3×10", intermediate: "4×8", advanced: "5×5" },
    restSeconds: { beginner: 90, intermediate: 120, advanced: 180 },
    tags: ["pecho", "fuerza", "compuesto", "barra"],
  },

  {
    id: "incline_barbell_bench_press",
    name: "Press de banca inclinado con barra",
    nameEn: "Incline Barbell Bench Press",
    category: "compound",
    muscles: {
      primary: ["pectoralMayor"],
      secondary: ["deltoidesAnterior", "triceps", "pectoralMenor"],
    },
    equipment: "barbell",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "Ajusta el banco a 30-45 grados de inclinación",
      "Agarra la barra con agarre medio-ancho",
      "Baja la barra hasta la parte superior del pecho",
      "Empuja hacia arriba hasta la extensión completa",
    ],
    tips: [
      "No inclines el banco más de 45° para no convertirlo en press de hombro",
      "Retrae las escápulas antes de comenzar",
      "Controla la fase excéntrica 2-3 segundos",
    ],
    commonMistakes: [
      "Ángulo de banco demasiado alto",
      "Dejar que los codos se abran a 90°",
      "Arco lumbar excesivo",
    ],
    videoPrompt:
      "Persona realizando press de banca inclinado con barra en banco a 30 grados, gimnasio profesional, vista lateral, movimiento fluido",
    sets: { beginner: "3×10", intermediate: "4×8", advanced: "5×6" },
    restSeconds: { beginner: 90, intermediate: 120, advanced: 150 },
    tags: ["pecho", "pecho superior", "fuerza", "barra"],
  },

  {
    id: "decline_barbell_bench_press",
    name: "Press de banca declinado con barra",
    nameEn: "Decline Barbell Bench Press",
    category: "compound",
    muscles: {
      primary: ["pectoralMayor"],
      secondary: ["triceps", "deltoidesAnterior"],
    },
    equipment: "barbell",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "Ajusta el banco en posición declinada (-15 a -30 grados)",
      "Asegura los pies en los soportes",
      "Baja la barra a la parte inferior del pecho",
      "Empuja de vuelta a la posición inicial",
    ],
    tips: [
      "Ideal para enfatizar la porción inferior del pectoral",
      "No uses un ángulo demasiado pronunciado",
      "Pide ayuda de un compañero para pasar y recibir la barra",
    ],
    commonMistakes: [
      "Ángulo excesivo de declinación",
      "Bajar la barra al cuello",
      "No asegurar bien los pies",
    ],
    videoPrompt:
      "Atleta realizando press declinado con barra en banco declinado, enfoque en pecho inferior, gimnasio moderno",
    sets: { beginner: "3×10", intermediate: "4×8", advanced: "4×6" },
    restSeconds: { beginner: 90, intermediate: 120, advanced: 150 },
    tags: ["pecho", "pecho inferior", "fuerza", "barra"],
  },

  {
    id: "dumbbell_bench_press",
    name: "Press de banca con mancuernas",
    nameEn: "Dumbbell Bench Press",
    category: "compound",
    muscles: {
      primary: ["pectoralMayor"],
      secondary: ["deltoidesAnterior", "triceps"],
    },
    equipment: "dumbbell",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Siéntate en el banco con una mancuerna en cada mano sobre los muslos",
      "Recuéstate llevando las mancuernas al pecho",
      "Empuja las mancuernas hacia arriba hasta casi tocar",
      "Baja controladamente hasta que los codos queden al nivel del banco",
    ],
    tips: [
      "Mayor rango de movimiento que con barra",
      "Gira ligeramente las mancuernas al subir para mayor contracción",
      "Mantén las muñecas neutras y firmes",
    ],
    commonMistakes: [
      "Mancuernas demasiado pesadas sin control",
      "Bajar demasiado rápido",
      "No estabilizar las escápulas",
    ],
    videoPrompt:
      "Persona realizando press de pecho con mancuernas en banco plano, gimnasio moderno, toma frontal y lateral",
    sets: { beginner: "3×12", intermediate: "4×10", advanced: "4×8" },
    restSeconds: { beginner: 60, intermediate: 90, advanced: 120 },
    tags: ["pecho", "fuerza", "mancuernas"],
  },

  {
    id: "incline_dumbbell_bench_press",
    name: "Press inclinado con mancuernas",
    nameEn: "Incline Dumbbell Bench Press",
    category: "compound",
    muscles: {
      primary: ["pectoralMayor", "pectoralMenor"],
      secondary: ["deltoidesAnterior", "triceps"],
    },
    equipment: "dumbbell",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Ajusta el banco a 30-45 grados",
      "Lleva las mancuernas al pecho desde los muslos",
      "Empuja hacia arriba juntando ligeramente las mancuernas",
      "Baja de forma controlada manteniendo tensión en el pecho",
    ],
    tips: [
      "Excelente para desarrollo del pecho superior",
      "Puedes usar agarre neutro para menos estrés en hombros",
      "Enfócate en la contracción del pecho en la parte alta",
    ],
    commonMistakes: [
      "Usar impulso con la espalda baja",
      "Banco demasiado inclinado",
      "Mancuernas chocando arriba sin control",
    ],
    videoPrompt:
      "Atleta haciendo press inclinado con mancuernas, banco a 30 grados, vista lateral, gimnasio profesional",
    sets: { beginner: "3×12", intermediate: "4×10", advanced: "4×8" },
    restSeconds: { beginner: 60, intermediate: 90, advanced: 120 },
    tags: ["pecho", "pecho superior", "mancuernas"],
  },

  {
    id: "dumbbell_fly",
    name: "Aperturas con mancuernas",
    nameEn: "Dumbbell Fly",
    category: "isolation",
    muscles: {
      primary: ["pectoralMayor"],
      secondary: ["deltoidesAnterior", "pectoralMenor"],
    },
    equipment: "dumbbell",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Acuéstate en el banco con mancuernas arriba, brazos casi extendidos",
      "Abre los brazos en arco hacia los lados con ligera flexión de codos",
      "Baja hasta sentir estiramiento en el pecho",
      "Junta las mancuernas arriba apretando el pecho",
    ],
    tips: [
      "Imagina abrazar un árbol grande",
      "Mantén ligera flexión en los codos todo el movimiento",
      "Usa un peso moderado, prioriza la conexión mente-músculo",
    ],
    commonMistakes: [
      "Extender completamente los codos (riesgo de lesión)",
      "Bajar demasiado profundo",
      "Peso excesivo convirtiendo el movimiento en press",
    ],
    videoPrompt:
      "Persona realizando aperturas con mancuernas en banco plano, enfoque en la apertura y cierre de brazos, vista cenital y lateral",
    sets: { beginner: "3×12", intermediate: "3×12", advanced: "4×10" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 90 },
    tags: ["pecho", "aislamiento", "mancuernas"],
  },

  {
    id: "incline_dumbbell_fly",
    name: "Aperturas inclinadas con mancuernas",
    nameEn: "Incline Dumbbell Fly",
    category: "isolation",
    muscles: {
      primary: ["pectoralMayor", "pectoralMenor"],
      secondary: ["deltoidesAnterior"],
    },
    equipment: "dumbbell",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Ajusta el banco a 30 grados de inclinación",
      "Sujeta las mancuernas arriba con brazos casi extendidos",
      "Abre los brazos en arco descendente controlado",
      "Regresa juntando las mancuernas con contracción del pecho superior",
    ],
    tips: [
      "Enfócate en estirar y contraer el pecho superior",
      "Muñecas firmes durante todo el recorrido",
      "Exhala al cerrar, inhala al abrir",
    ],
    commonMistakes: [
      "Convertir el movimiento en press",
      "Codos completamente bloqueados",
      "Falta de control en la fase excéntrica",
    ],
    videoPrompt:
      "Atleta realizando aperturas con mancuernas en banco inclinado, enfoque en fibras superiores del pecho",
    sets: { beginner: "3×12", intermediate: "3×12", advanced: "4×10" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 90 },
    tags: ["pecho", "pecho superior", "aislamiento", "mancuernas"],
  },

  {
    id: "cable_crossover_high",
    name: "Cruce de cable alto",
    nameEn: "High Cable Crossover",
    category: "isolation",
    muscles: {
      primary: ["pectoralMayor"],
      secondary: ["deltoidesAnterior", "pectoralMenor"],
    },
    equipment: "cable",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Coloca las poleas en la posición más alta",
      "Agarra los mangos y da un paso adelante",
      "Con los codos ligeramente flexionados, junta las manos frente al abdomen",
      "Regresa controladamente a la posición inicial",
    ],
    tips: [
      "Inclina ligeramente el torso hacia adelante",
      "Cruza ligeramente las manos al final para mayor contracción",
      "Mantén el core activado y estable",
    ],
    commonMistakes: [
      "Usar demasiado peso y perder la forma",
      "Mover el torso excesivamente",
      "No controlar la fase de retorno",
    ],
    videoPrompt:
      "Persona haciendo cruce de cables desde poleas altas, gimnasio con máquina de cables, vista frontal",
    sets: { beginner: "3×15", intermediate: "3×12", advanced: "4×12" },
    restSeconds: { beginner: 45, intermediate: 60, advanced: 60 },
    tags: ["pecho", "aislamiento", "cable"],
  },

  {
    id: "cable_crossover_mid",
    name: "Cruce de cable medio",
    nameEn: "Mid Cable Crossover",
    category: "isolation",
    muscles: {
      primary: ["pectoralMayor"],
      secondary: ["deltoidesAnterior"],
    },
    equipment: "cable",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Coloca las poleas a la altura de los hombros",
      "Agarra ambos mangos y da un paso al frente",
      "Junta las manos al frente con codos ligeramente flexionados",
      "Retorna de forma controlada sintiendo el estiramiento",
    ],
    tips: [
      "Posición de las poleas a la altura de los hombros",
      "Enfatiza la contracción en el centro del pecho",
      "Pie adelantado para mayor estabilidad",
    ],
    commonMistakes: [
      "Usar impulso del cuerpo",
      "Flexionar excesivamente los codos",
      "Poleas a altura incorrecta",
    ],
    videoPrompt:
      "Atleta realizando cruce de cables con poleas a media altura, contracción pectoral visible, gimnasio moderno",
    sets: { beginner: "3×15", intermediate: "3×12", advanced: "4×12" },
    restSeconds: { beginner: 45, intermediate: 60, advanced: 60 },
    tags: ["pecho", "aislamiento", "cable"],
  },

  {
    id: "cable_crossover_low",
    name: "Cruce de cable bajo",
    nameEn: "Low Cable Crossover",
    category: "isolation",
    muscles: {
      primary: ["pectoralMayor", "pectoralMenor"],
      secondary: ["deltoidesAnterior"],
    },
    equipment: "cable",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "Coloca las poleas en la posición más baja",
      "Agarra los mangos con palmas hacia arriba",
      "Eleva y junta las manos frente al pecho en arco ascendente",
      "Baja controladamente hasta la posición inicial",
    ],
    tips: [
      "Excelente para enfatizar el pecho superior",
      "Mantén una ligera inclinación hacia adelante",
      "Aprieta fuerte al juntar las manos arriba",
    ],
    commonMistakes: [
      "Usar los bíceps en lugar del pecho",
      "Movimiento demasiado rápido",
      "Perder la posición estable del torso",
    ],
    videoPrompt:
      "Persona realizando cruce de cables desde poleas bajas hacia arriba, enfoque en pecho superior, gimnasio",
    sets: { beginner: "3×15", intermediate: "3×12", advanced: "4×12" },
    restSeconds: { beginner: 45, intermediate: 60, advanced: 60 },
    tags: ["pecho", "pecho superior", "aislamiento", "cable"],
  },

  {
    id: "machine_chest_press",
    name: "Press de pecho en máquina",
    nameEn: "Machine Chest Press",
    category: "compound",
    muscles: {
      primary: ["pectoralMayor"],
      secondary: ["deltoidesAnterior", "triceps"],
    },
    equipment: "machine",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Ajusta el asiento para que los mangos queden a la altura del pecho",
      "Agarra los mangos con agarre completo",
      "Empuja hacia adelante hasta casi extender los brazos",
      "Retorna de forma controlada sin soltar el peso",
    ],
    tips: [
      "Ideal para principiantes o para final de sesión",
      "Ajusta el asiento correctamente para alinear los mangos con el pecho",
      "No bloquees los codos al final del empuje",
    ],
    commonMistakes: [
      "Asiento mal ajustado",
      "Bloquear codos completamente",
      "Soltar el peso de golpe en la vuelta",
    ],
    videoPrompt:
      "Persona usando máquina de press de pecho en gimnasio, posición correcta, movimiento completo",
    sets: { beginner: "3×12", intermediate: "3×10", advanced: "4×10" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 90 },
    tags: ["pecho", "máquina", "principiante"],
  },

  {
    id: "pec_deck",
    name: "Pec deck (máquina de aperturas)",
    nameEn: "Pec Deck Machine",
    category: "isolation",
    muscles: {
      primary: ["pectoralMayor"],
      secondary: ["deltoidesAnterior", "pectoralMenor"],
    },
    equipment: "machine",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Siéntate con la espalda pegada al respaldo",
      "Coloca los antebrazos en las almohadillas",
      "Junta los brazos frente al pecho contrayendo el pectoral",
      "Regresa lentamente hasta sentir estiramiento",
    ],
    tips: [
      "Mantén la espalda completamente apoyada",
      "Aprieta 1-2 segundos al juntar los brazos",
      "No dejes que el peso descanse entre repeticiones",
    ],
    commonMistakes: [
      "Inclinar el cuerpo hacia adelante",
      "Rango de movimiento demasiado corto",
      "Usar impulso en vez de control",
    ],
    videoPrompt:
      "Persona usando pec deck, contracción visible del pecho, máquina moderna en gimnasio profesional",
    sets: { beginner: "3×15", intermediate: "3×12", advanced: "4×12" },
    restSeconds: { beginner: 45, intermediate: 60, advanced: 60 },
    tags: ["pecho", "aislamiento", "máquina"],
  },

  {
    id: "close_grip_bench_press",
    name: "Press de banca agarre cerrado",
    nameEn: "Close-Grip Bench Press",
    category: "compound",
    muscles: {
      primary: ["pectoralMayor", "triceps"],
      secondary: ["deltoidesAnterior"],
    },
    equipment: "barbell",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "Acuéstate en el banco y agarra la barra con las manos al ancho de los hombros o ligeramente más cerrado",
      "Baja la barra al pecho medio-bajo con los codos pegados al cuerpo",
      "Empuja hacia arriba enfocando la fuerza en tríceps y pecho interno",
      "Extiende completamente los brazos arriba",
    ],
    tips: [
      "No juntes las manos demasiado (riesgo para muñecas)",
      "Codos pegados al torso en todo momento",
      "Combina trabajo de pecho interno y tríceps",
    ],
    commonMistakes: [
      "Agarre excesivamente cerrado",
      "Codos abiertos perdiendo el enfoque en tríceps",
      "Rebotar la barra en el pecho",
    ],
    videoPrompt:
      "Atleta haciendo press de banca con agarre cerrado, codos pegados al cuerpo, vista lateral en gimnasio",
    sets: { beginner: "3×10", intermediate: "4×8", advanced: "4×6" },
    restSeconds: { beginner: 90, intermediate: 90, advanced: 120 },
    tags: ["pecho", "tríceps", "fuerza", "barra"],
  },

  {
    id: "chest_dips",
    name: "Fondos de pecho en paralelas",
    nameEn: "Chest Dips",
    category: "compound",
    muscles: {
      primary: ["pectoralMayor"],
      secondary: ["triceps", "deltoidesAnterior"],
    },
    equipment: "bodyweight",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "Sujétate en las barras paralelas con los brazos extendidos",
      "Inclina el torso ligeramente hacia adelante",
      "Baja doblando los codos hasta que los hombros estén por debajo de los codos",
      "Empuja de vuelta arriba contrayendo el pecho",
    ],
    tips: [
      "Inclínate hacia adelante para mayor activación del pecho",
      "Cruza las piernas detrás para estabilidad",
      "Si eres avanzado, añade peso con cinturón de lastre",
    ],
    commonMistakes: [
      "Torso demasiado vertical (cambia enfoque a tríceps)",
      "Bajar demasiado profundo (estrés en hombros)",
      "Balancear el cuerpo",
    ],
    videoPrompt:
      "Persona haciendo fondos en barras paralelas inclinado hacia adelante, enfoque en pecho, gimnasio",
    sets: { beginner: "3×8", intermediate: "4×10", advanced: "4×12" },
    restSeconds: { beginner: 90, intermediate: 90, advanced: 60 },
    tags: ["pecho", "tríceps", "peso corporal", "compuesto"],
  },

  {
    id: "push_up",
    name: "Flexiones",
    nameEn: "Push-Up",
    category: "compound",
    muscles: {
      primary: ["pectoralMayor"],
      secondary: ["deltoidesAnterior", "triceps", "rectoAbdominal"],
    },
    equipment: "bodyweight",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Colócate boca abajo con las manos al ancho de los hombros",
      "Mantén el cuerpo recto como una tabla desde cabeza a tobillos",
      "Baja el pecho hasta casi tocar el suelo",
      "Empuja de vuelta hasta extender los brazos",
    ],
    tips: [
      "Core activado durante todo el movimiento",
      "Codos a 45° del cuerpo, no a 90°",
      "Mira ligeramente adelante, no directamente al suelo",
    ],
    commonMistakes: [
      "Cadera caída o en pico",
      "Rango de movimiento incompleto",
      "Codos demasiado abiertos",
    ],
    videoPrompt:
      "Persona haciendo flexiones con forma perfecta, cuerpo recto, en suelo de gimnasio, vista lateral",
    sets: { beginner: "3×10", intermediate: "3×20", advanced: "4×30" },
    restSeconds: { beginner: 60, intermediate: 45, advanced: 30 },
    tags: ["pecho", "peso corporal", "funcional"],
  },

  {
    id: "diamond_push_up",
    name: "Flexiones diamante",
    nameEn: "Diamond Push-Up",
    category: "compound",
    muscles: {
      primary: ["pectoralMayor", "triceps"],
      secondary: ["deltoidesAnterior"],
    },
    equipment: "bodyweight",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "Colócate en posición de flexión con las manos juntas formando un diamante",
      "Junta los pulgares e índices bajo el pecho",
      "Baja el pecho hasta tocar las manos",
      "Empuja hacia arriba enfocando la fuerza en tríceps",
    ],
    tips: [
      "Mantén los codos pegados al cuerpo",
      "Si es muy difícil, hazlo de rodillas primero",
      "Excelente finalizador para pecho y tríceps",
    ],
    commonMistakes: [
      "Codos demasiado abiertos",
      "Rango parcial de movimiento",
      "Cadera caída",
    ],
    videoPrompt:
      "Persona haciendo flexiones diamante, manos juntas bajo el pecho, forma estricta, gimnasio",
    sets: { beginner: "3×6", intermediate: "3×12", advanced: "4×15" },
    restSeconds: { beginner: 60, intermediate: 45, advanced: 30 },
    tags: ["pecho", "tríceps", "peso corporal"],
  },

  {
    id: "decline_push_up",
    name: "Flexiones declinadas",
    nameEn: "Decline Push-Up",
    category: "compound",
    muscles: {
      primary: ["pectoralMayor", "pectoralMenor"],
      secondary: ["deltoidesAnterior", "triceps"],
    },
    equipment: "bodyweight",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "Coloca los pies elevados en un banco o caja",
      "Manos en el suelo al ancho de los hombros",
      "Baja el pecho al suelo manteniendo el cuerpo recto",
      "Empuja de vuelta hasta la extensión completa",
    ],
    tips: [
      "Mayor altura de pies = mayor dificultad y enfoque en pecho superior",
      "Mantén el core activado para no arquear la espalda",
      "Trabaja el pecho superior y hombros de forma efectiva",
    ],
    commonMistakes: [
      "Cadera caída formando U",
      "Mirar hacia adelante forzando el cuello",
      "Pies resbalando de la superficie",
    ],
    videoPrompt:
      "Atleta haciendo flexiones con pies elevados en un banco, cuerpo recto, gimnasio bien iluminado",
    sets: { beginner: "3×8", intermediate: "3×15", advanced: "4×20" },
    restSeconds: { beginner: 60, intermediate: 45, advanced: 30 },
    tags: ["pecho", "pecho superior", "peso corporal"],
  },

  {
    id: "clap_push_up",
    name: "Flexiones con palmada",
    nameEn: "Clap Push-Up",
    category: "plyometric",
    muscles: {
      primary: ["pectoralMayor"],
      secondary: ["deltoidesAnterior", "triceps"],
    },
    equipment: "bodyweight",
    mechanic: "push",
    force: "push",
    level: "advanced",
    instructions: [
      "Adopta posición de flexión estándar",
      "Baja el pecho al suelo de forma controlada",
      "Empuja explosivamente para despegar las manos del suelo",
      "Da una palmada en el aire y aterriza con los codos ligeramente flexionados",
    ],
    tips: [
      "Domina las flexiones normales antes de intentar esta variante",
      "Aterriza con los brazos ligeramente flexionados para absorber el impacto",
      "Trabaja potencia y explosividad del tren superior",
    ],
    commonMistakes: [
      "Aterrizar con los brazos bloqueados",
      "No tener suficiente fuerza base",
      "Cadera descontrolada durante el salto",
    ],
    videoPrompt:
      "Atleta haciendo flexiones pliométricas con palmada, explosividad visible, cámara lenta, gimnasio",
    sets: { beginner: "3×3", intermediate: "3×6", advanced: "4×10" },
    restSeconds: { beginner: 90, intermediate: 60, advanced: 45 },
    tags: ["pecho", "pliométrico", "explosividad", "peso corporal"],
  },

  {
    id: "smith_bench_press",
    name: "Press de banca en máquina Smith",
    nameEn: "Smith Machine Bench Press",
    category: "compound",
    muscles: {
      primary: ["pectoralMayor"],
      secondary: ["deltoidesAnterior", "triceps"],
    },
    equipment: "smith",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Coloca el banco plano dentro de la máquina Smith",
      "Acuéstate y agarra la barra con agarre medio",
      "Gira la barra para desbloquearla",
      "Baja al pecho y empuja de vuelta, bloquea al terminar",
    ],
    tips: [
      "La guía fija de la Smith permite enfocarse en el empuje",
      "Buena opción para entrenar solo sin spotter",
      "Ajusta la posición del banco para que la barra baje al pecho medio",
    ],
    commonMistakes: [
      "No ajustar los topes de seguridad",
      "Posición del banco desalineada",
      "Confiarse y usar peso excesivo",
    ],
    videoPrompt:
      "Persona realizando press de banca en máquina Smith, forma correcta, gimnasio profesional",
    sets: { beginner: "3×12", intermediate: "4×10", advanced: "4×8" },
    restSeconds: { beginner: 60, intermediate: 90, advanced: 120 },
    tags: ["pecho", "smith", "máquina", "fuerza"],
  },

  // ==========================================================================
  // ESPALDA (18 ejercicios)
  // ==========================================================================

  {
    id: "pull_up",
    name: "Dominadas (agarre pronado)",
    nameEn: "Pull-Up",
    category: "compound",
    muscles: {
      primary: ["dorsalAncho"],
      secondary: ["biceps", "romboides", "trapecio", "braquial"],
    },
    equipment: "barFija",
    mechanic: "pull",
    force: "pull",
    level: "intermediate",
    instructions: [
      "Agarra la barra con las palmas mirando hacia afuera, más ancho que los hombros",
      "Cuélgate con los brazos completamente extendidos",
      "Tira de tu cuerpo hasta que la barbilla supere la barra",
      "Baja de forma controlada hasta la extensión completa",
    ],
    tips: [
      "Inicia el movimiento retrayendo las escápulas",
      "Imagina llevar los codos hacia las caderas",
      "Evita el kipping si el objetivo es fuerza",
    ],
    commonMistakes: [
      "Usar impulso o balanceo",
      "Rango de movimiento parcial",
      "No bajar completamente los brazos",
    ],
    videoPrompt:
      "Atleta musculoso haciendo dominadas con agarre pronado en barra, espalda ancha visible, gimnasio",
    sets: { beginner: "3×5", intermediate: "4×8", advanced: "5×12" },
    restSeconds: { beginner: 120, intermediate: 90, advanced: 60 },
    tags: ["espalda", "dorsales", "peso corporal", "compuesto"],
  },

  {
    id: "chin_up",
    name: "Dominadas supinas",
    nameEn: "Chin-Up",
    category: "compound",
    muscles: {
      primary: ["dorsalAncho", "biceps"],
      secondary: ["romboides", "trapecio", "braquial"],
    },
    equipment: "barFija",
    mechanic: "pull",
    force: "pull",
    level: "intermediate",
    instructions: [
      "Agarra la barra con las palmas mirando hacia ti, al ancho de los hombros",
      "Cuélgate con brazos extendidos",
      "Tira hasta que la barbilla supere la barra",
      "Baja de forma controlada",
    ],
    tips: [
      "Mayor activación de bíceps que las dominadas pronadas",
      "Mantén el core activado para evitar balanceo",
      "Aprieta las escápulas al subir",
    ],
    commonMistakes: [
      "Balancear el cuerpo",
      "No completar el rango de movimiento",
      "Depender solo de los bíceps sin activar la espalda",
    ],
    videoPrompt:
      "Persona haciendo dominadas con agarre supino, bíceps y espalda activados, gimnasio profesional",
    sets: { beginner: "3×5", intermediate: "4×8", advanced: "5×12" },
    restSeconds: { beginner: 120, intermediate: 90, advanced: 60 },
    tags: ["espalda", "bíceps", "peso corporal", "compuesto"],
  },

  {
    id: "neutral_grip_pull_up",
    name: "Dominadas agarre neutro",
    nameEn: "Neutral-Grip Pull-Up",
    category: "compound",
    muscles: {
      primary: ["dorsalAncho"],
      secondary: ["biceps", "braquial", "romboides"],
    },
    equipment: "barFija",
    mechanic: "pull",
    force: "pull",
    level: "intermediate",
    instructions: [
      "Usa las asas con agarre neutro (palmas enfrentadas)",
      "Cuélgate con brazos extendidos",
      "Tira del cuerpo hacia arriba llevando el pecho a la barra",
      "Baja de forma controlada",
    ],
    tips: [
      "Agarre más amigable para las muñecas y hombros",
      "Excelente activación del braquial",
      "Posición intermedia entre dominada y chin-up",
    ],
    commonMistakes: [
      "Impulso con las piernas",
      "No extender completamente abajo",
      "Tirar solo con los brazos",
    ],
    videoPrompt:
      "Atleta realizando dominadas con agarre neutro en barra multiagarre, forma estricta",
    sets: { beginner: "3×5", intermediate: "4×8", advanced: "5×10" },
    restSeconds: { beginner: 120, intermediate: 90, advanced: 60 },
    tags: ["espalda", "peso corporal", "compuesto"],
  },

  {
    id: "weighted_pull_up",
    name: "Dominadas lastradas",
    nameEn: "Weighted Pull-Up",
    category: "compound",
    muscles: {
      primary: ["dorsalAncho"],
      secondary: ["biceps", "trapecio", "romboides", "braquial"],
    },
    equipment: "barFija",
    mechanic: "pull",
    force: "pull",
    level: "advanced",
    instructions: [
      "Coloca un cinturón de lastre con el peso deseado",
      "Agarra la barra con el agarre preferido",
      "Realiza la dominada de forma estricta sin kipping",
      "Baja de forma controlada manteniendo la tensión",
    ],
    tips: [
      "Domina al menos 10 dominadas limpias antes de añadir peso",
      "Aumenta el peso gradualmente (2.5-5 kg a la vez)",
      "Excelente para progresar en fuerza de tirón",
    ],
    commonMistakes: [
      "Añadir peso antes de dominar el peso corporal",
      "Usar impulso para compensar el peso extra",
      "Progresiones demasiado agresivas",
    ],
    videoPrompt:
      "Atleta haciendo dominadas con cinturón de lastre, discos colgando, fuerza controlada, gimnasio",
    sets: { beginner: "3×5", intermediate: "4×6", advanced: "5×5" },
    restSeconds: { beginner: 150, intermediate: 120, advanced: 180 },
    tags: ["espalda", "fuerza", "avanzado", "compuesto"],
  },

  {
    id: "barbell_row",
    name: "Remo con barra",
    nameEn: "Barbell Bent-Over Row",
    category: "compound",
    muscles: {
      primary: ["dorsalAncho", "romboides"],
      secondary: ["trapecio", "biceps", "erectoresEspinales"],
    },
    equipment: "barbell",
    mechanic: "pull",
    force: "pull",
    level: "intermediate",
    instructions: [
      "De pie con pies al ancho de los hombros, agarra la barra con agarre pronado",
      "Inclina el torso a unos 45° con las rodillas ligeramente flexionadas",
      "Tira de la barra hacia el abdomen bajo",
      "Baja de forma controlada hasta extender los brazos",
    ],
    tips: [
      "Mantén la espalda recta y el core activado",
      "Aprieta las escápulas al traer la barra al cuerpo",
      "No uses impulso del torso para levantar la barra",
    ],
    commonMistakes: [
      "Espalda redondeada",
      "Usar impulso del torso",
      "Tirar la barra al pecho en lugar del abdomen",
    ],
    videoPrompt:
      "Persona haciendo remo con barra inclinado, espalda recta, tirón hacia el abdomen, vista lateral",
    sets: { beginner: "3×10", intermediate: "4×8", advanced: "5×6" },
    restSeconds: { beginner: 90, intermediate: 90, advanced: 120 },
    tags: ["espalda", "fuerza", "compuesto", "barra"],
  },

  {
    id: "pendlay_row",
    name: "Remo Pendlay",
    nameEn: "Pendlay Row",
    category: "compound",
    muscles: {
      primary: ["dorsalAncho", "romboides"],
      secondary: ["trapecio", "biceps", "erectoresEspinales"],
    },
    equipment: "barbell",
    mechanic: "pull",
    force: "pull",
    level: "advanced",
    instructions: [
      "Posiciónate como para peso muerto con torso paralelo al suelo",
      "La barra descansa en el suelo entre cada repetición",
      "Tira explosivamente hacia el abdomen bajo",
      "Baja la barra al suelo de forma controlada y repite desde cero",
    ],
    tips: [
      "Cada repetición comienza desde el suelo (dead stop)",
      "Excelente para fuerza explosiva de tirón",
      "Torso estrictamente paralelo al suelo",
    ],
    commonMistakes: [
      "Torso demasiado erguido",
      "No apoyar la barra en el suelo entre reps",
      "Usar impulso del cuerpo",
    ],
    videoPrompt:
      "Atleta haciendo remo Pendlay, barra desde el suelo, torso paralelo, tirón explosivo, gimnasio",
    sets: { beginner: "3×8", intermediate: "4×6", advanced: "5×5" },
    restSeconds: { beginner: 90, intermediate: 120, advanced: 150 },
    tags: ["espalda", "fuerza", "explosividad", "barra"],
  },

  {
    id: "dumbbell_row",
    name: "Remo con mancuerna a un brazo",
    nameEn: "Single-Arm Dumbbell Row",
    category: "compound",
    muscles: {
      primary: ["dorsalAncho"],
      secondary: ["romboides", "trapecio", "biceps"],
    },
    equipment: "dumbbell",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "Apoya una rodilla y mano en el banco, pie contrario en el suelo",
      "Agarra la mancuerna con la mano libre, brazo extendido",
      "Tira de la mancuerna hacia la cadera retrayendo el codo",
      "Baja de forma controlada y repite",
    ],
    tips: [
      "Mantén la espalda recta y paralela al suelo",
      "Lleva el codo más allá de la línea del torso",
      "No gires el torso para subir el peso",
    ],
    commonMistakes: [
      "Girar el torso para levantar más peso",
      "Tirar solo con el bíceps",
      "Espalda redondeada",
    ],
    videoPrompt:
      "Persona haciendo remo con mancuerna apoyado en banco, tirón unilateral, espalda recta, gimnasio",
    sets: { beginner: "3×12", intermediate: "4×10", advanced: "4×8" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 90 },
    tags: ["espalda", "unilateral", "mancuernas"],
  },

  {
    id: "seated_cable_row",
    name: "Remo sentado en cable",
    nameEn: "Seated Cable Row",
    category: "compound",
    muscles: {
      primary: ["dorsalAncho", "romboides"],
      secondary: ["trapecio", "biceps", "erectoresEspinales"],
    },
    equipment: "cable",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "Siéntate en la máquina con los pies en la plataforma y rodillas ligeramente flexionadas",
      "Agarra el mango en V con ambas manos",
      "Tira del cable hacia el abdomen retrayendo las escápulas",
      "Extiende los brazos de forma controlada manteniendo el torso erguido",
    ],
    tips: [
      "No inclines el torso hacia atrás para jalar más peso",
      "Aprieta las escápulas 1 segundo en la contracción",
      "Mantén el pecho alto y los hombros abajo",
    ],
    commonMistakes: [
      "Inclinarse excesivamente hacia atrás",
      "Tirar solo con los brazos",
      "Rango de movimiento parcial",
    ],
    videoPrompt:
      "Persona haciendo remo sentado en polea baja con agarre en V, espalda erguida, gimnasio moderno",
    sets: { beginner: "3×12", intermediate: "4×10", advanced: "4×8" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 90 },
    tags: ["espalda", "cable", "compuesto"],
  },

  {
    id: "t_bar_row",
    name: "Remo en T-bar",
    nameEn: "T-Bar Row",
    category: "compound",
    muscles: {
      primary: ["dorsalAncho", "romboides", "trapecio"],
      secondary: ["biceps", "erectoresEspinales"],
    },
    equipment: "barbell",
    mechanic: "pull",
    force: "pull",
    level: "intermediate",
    instructions: [
      "Coloca un extremo de la barra en la esquina o landmine",
      "Carga discos en el otro extremo",
      "Inclínate sobre la barra con agarre en V debajo",
      "Tira hacia el pecho manteniendo la espalda recta",
    ],
    tips: [
      "Excelente para grosor de espalda media",
      "Mantén las rodillas flexionadas y el core firme",
      "Aprieta las escápulas al máximo arriba",
    ],
    commonMistakes: [
      "Espalda redondeada",
      "Usar impulso excesivo",
      "No completar el rango de movimiento",
    ],
    videoPrompt:
      "Atleta haciendo remo T-bar con barra en landmine, espalda gruesa, gimnasio hardcore",
    sets: { beginner: "3×10", intermediate: "4×8", advanced: "4×6" },
    restSeconds: { beginner: 90, intermediate: 90, advanced: 120 },
    tags: ["espalda", "grosor", "compuesto", "barra"],
  },

  {
    id: "lat_pulldown_wide",
    name: "Jalón al pecho agarre ancho",
    nameEn: "Wide-Grip Lat Pulldown",
    category: "compound",
    muscles: {
      primary: ["dorsalAncho"],
      secondary: ["biceps", "romboides", "trapecio"],
    },
    equipment: "cable",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "Siéntate en la máquina con los muslos asegurados bajo las almohadillas",
      "Agarra la barra ancha con palmas hacia afuera",
      "Tira de la barra hacia el pecho superior retrayendo las escápulas",
      "Regresa la barra arriba de forma controlada sin soltar tensión",
    ],
    tips: [
      "No tires la barra detrás del cuello",
      "Inclina ligeramente el torso hacia atrás",
      "Piensa en llevar los codos hacia abajo y atrás",
    ],
    commonMistakes: [
      "Tirar detrás del cuello (lesión de hombro)",
      "Inclinarse demasiado hacia atrás",
      "Usar impulso del cuerpo",
    ],
    videoPrompt:
      "Persona haciendo jalón al pecho con barra ancha, dorsales activados, polea alta, gimnasio",
    sets: { beginner: "3×12", intermediate: "4×10", advanced: "4×8" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 90 },
    tags: ["espalda", "dorsales", "cable"],
  },

  {
    id: "lat_pulldown_close",
    name: "Jalón al pecho agarre cerrado",
    nameEn: "Close-Grip Lat Pulldown",
    category: "compound",
    muscles: {
      primary: ["dorsalAncho"],
      secondary: ["biceps", "braquial", "romboides"],
    },
    equipment: "cable",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "Usa el mango en V o barra corta cerrada",
      "Siéntate y asegura los muslos",
      "Tira del mango hacia el pecho medio",
      "Regresa de forma controlada",
    ],
    tips: [
      "Mayor rango de movimiento que el agarre ancho",
      "Buena activación de la parte baja del dorsal",
      "Mantén el pecho alto al tirar",
    ],
    commonMistakes: [
      "Usar el cuerpo para ayudar al tirón",
      "No completar el rango de movimiento",
      "Soltar la tensión arriba",
    ],
    videoPrompt:
      "Atleta haciendo jalón al pecho con agarre cerrado en V, contracción dorsal, gimnasio",
    sets: { beginner: "3×12", intermediate: "4×10", advanced: "4×8" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 90 },
    tags: ["espalda", "dorsales", "cable"],
  },

  {
    id: "lat_pulldown_reverse",
    name: "Jalón al pecho agarre inverso",
    nameEn: "Reverse-Grip Lat Pulldown",
    category: "compound",
    muscles: {
      primary: ["dorsalAncho"],
      secondary: ["biceps", "braquial", "romboides"],
    },
    equipment: "cable",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "Agarra la barra con palmas hacia ti (supinación) al ancho de los hombros",
      "Siéntate y asegura los muslos",
      "Tira la barra hacia el pecho bajo",
      "Extiende los brazos de vuelta controladamente",
    ],
    tips: [
      "Mayor activación de bíceps y dorsal inferior",
      "Mantén los codos apuntando hacia abajo",
      "No uses peso excesivo que sacrifique la forma",
    ],
    commonMistakes: [
      "Agarre demasiado ancho con supinación",
      "Inclinar excesivamente el torso",
      "Tirar con los bíceps en vez de la espalda",
    ],
    videoPrompt:
      "Persona haciendo jalón al pecho con agarre supino inverso, activación de dorsales y bíceps",
    sets: { beginner: "3×12", intermediate: "3×10", advanced: "4×10" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 90 },
    tags: ["espalda", "bíceps", "cable"],
  },

  {
    id: "cable_pullover",
    name: "Pull-over en cable",
    nameEn: "Cable Pullover",
    category: "isolation",
    muscles: {
      primary: ["dorsalAncho"],
      secondary: ["pectoralMayor", "triceps"],
    },
    equipment: "cable",
    mechanic: "pull",
    force: "pull",
    level: "intermediate",
    instructions: [
      "De pie frente a la polea alta con barra recta o cuerda",
      "Agarra con brazos casi extendidos sobre la cabeza",
      "Tira hacia abajo en arco hasta los muslos manteniendo brazos casi rectos",
      "Regresa de forma controlada hasta sentir el estiramiento en dorsales",
    ],
    tips: [
      "Aislamiento puro del dorsal ancho",
      "Mantén los codos ligeramente flexionados todo el tiempo",
      "Aprieta los dorsales al final del movimiento",
    ],
    commonMistakes: [
      "Flexionar excesivamente los codos (se vuelve extensión de tríceps)",
      "Usar impulso del torso",
      "Peso excesivo que sacrifica el rango",
    ],
    videoPrompt:
      "Atleta haciendo pullover en polea alta con cuerda, aislamiento dorsal, vista lateral, gimnasio",
    sets: { beginner: "3×15", intermediate: "3×12", advanced: "4×10" },
    restSeconds: { beginner: 45, intermediate: 60, advanced: 60 },
    tags: ["espalda", "dorsales", "aislamiento", "cable"],
  },

  {
    id: "face_pull",
    name: "Face pull",
    nameEn: "Face Pull",
    category: "isolation",
    muscles: {
      primary: ["deltoidesPosterior", "romboides"],
      secondary: ["trapecio", "infraespinoso"],
    },
    equipment: "cable",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "Coloca la polea a la altura de la cara",
      "Agarra la cuerda con las manos en pronación",
      "Tira hacia la cara separando las manos al final",
      "Aprieta las escápulas y los deltoides posteriores 1-2 segundos",
    ],
    tips: [
      "Esencial para salud de hombros y postura",
      "Usa peso ligero a moderado con muchas repeticiones",
      "Codos altos al tirar, a la altura de los hombros",
    ],
    commonMistakes: [
      "Usar peso excesivo",
      "No separar las manos al final",
      "Codos demasiado bajos",
    ],
    videoPrompt:
      "Persona haciendo face pulls con cuerda en polea, retracción escapular visible, gimnasio",
    sets: { beginner: "3×15", intermediate: "3×15", advanced: "4×15" },
    restSeconds: { beginner: 45, intermediate: 45, advanced: 45 },
    tags: ["espalda", "hombros", "salud articular", "cable"],
  },

  {
    id: "barbell_shrug",
    name: "Encogimientos de hombros con barra",
    nameEn: "Barbell Shrug",
    category: "isolation",
    muscles: {
      primary: ["trapecio"],
      secondary: ["romboides"],
    },
    equipment: "barbell",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "De pie sosteniendo la barra frente a los muslos con brazos extendidos",
      "Eleva los hombros lo más alto posible",
      "Mantén la contracción arriba 1-2 segundos",
      "Baja los hombros de forma controlada",
    ],
    tips: [
      "No gires los hombros (solo arriba y abajo)",
      "Usa straps si el agarre limita el peso",
      "Mantén los brazos rectos, no los dobles",
    ],
    commonMistakes: [
      "Rotar los hombros",
      "Flexionar los codos",
      "Rango de movimiento demasiado corto",
    ],
    videoPrompt:
      "Atleta haciendo encogimientos de hombros con barra pesada, trapecios contraídos, vista frontal",
    sets: { beginner: "3×15", intermediate: "4×12", advanced: "4×10" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 90 },
    tags: ["trapecios", "aislamiento", "barra"],
  },

  {
    id: "machine_row",
    name: "Remo en máquina",
    nameEn: "Machine Row",
    category: "compound",
    muscles: {
      primary: ["dorsalAncho", "romboides"],
      secondary: ["biceps", "trapecio"],
    },
    equipment: "machine",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "Ajusta el asiento y el soporte de pecho",
      "Agarra los mangos con ambas manos",
      "Tira hacia atrás retrayendo las escápulas",
      "Regresa de forma controlada sin soltar la tensión",
    ],
    tips: [
      "Ideal para principiantes o como ejercicio accesorio",
      "Pecho apoyado en la almohadilla para aislar la espalda",
      "Prueba diferentes agarres disponibles en la máquina",
    ],
    commonMistakes: [
      "No apoyar el pecho en la almohadilla",
      "Usar impulso del cuerpo",
      "Rango de movimiento incompleto",
    ],
    videoPrompt:
      "Persona usando máquina de remo sentado con soporte de pecho, forma correcta, gimnasio",
    sets: { beginner: "3×12", intermediate: "3×10", advanced: "4×10" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 90 },
    tags: ["espalda", "máquina", "principiante"],
  },

  {
    id: "straight_arm_pulldown",
    name: "Pulldown con brazos rectos",
    nameEn: "Straight-Arm Pulldown",
    category: "isolation",
    muscles: {
      primary: ["dorsalAncho"],
      secondary: ["triceps", "rectoAbdominal"],
    },
    equipment: "cable",
    mechanic: "pull",
    force: "pull",
    level: "intermediate",
    instructions: [
      "De pie frente a polea alta con barra o cuerda",
      "Brazos extendidos, ligera flexión de codos",
      "Tira la barra/cuerda hacia abajo en arco hasta los muslos",
      "Regresa controladamente hasta la altura de los hombros",
    ],
    tips: [
      "Mantén los brazos casi rectos todo el movimiento",
      "Inclina ligeramente el torso hacia adelante",
      "Contrae los dorsales al final del movimiento",
    ],
    commonMistakes: [
      "Doblar excesivamente los codos",
      "Usar el peso del cuerpo",
      "No sentir los dorsales trabajar",
    ],
    videoPrompt:
      "Atleta haciendo pulldown con brazos rectos en polea alta, aislamiento de dorsales, gimnasio",
    sets: { beginner: "3×15", intermediate: "3×12", advanced: "4×12" },
    restSeconds: { beginner: 45, intermediate: 60, advanced: 60 },
    tags: ["espalda", "dorsales", "aislamiento", "cable"],
  },

  {
    id: "dumbbell_pullover",
    name: "Pull-over con mancuerna",
    nameEn: "Dumbbell Pullover",
    category: "compound",
    muscles: {
      primary: ["dorsalAncho", "pectoralMayor"],
      secondary: ["triceps", "rectoAbdominal"],
    },
    equipment: "dumbbell",
    mechanic: "pull",
    force: "pull",
    level: "intermediate",
    instructions: [
      "Acuéstate transversal al banco apoyando solo la parte superior de la espalda",
      "Sujeta una mancuerna con ambas manos sobre el pecho, brazos casi extendidos",
      "Baja la mancuerna en arco detrás de la cabeza",
      "Regresa en arco al punto inicial contrayendo dorsales y pecho",
    ],
    tips: [
      "Trabaja tanto pecho como dorsal",
      "Mantén las caderas bajas para mayor estiramiento",
      "Respira profundo al bajar la mancuerna",
    ],
    commonMistakes: [
      "Flexionar excesivamente los codos",
      "Subir las caderas",
      "Peso excesivo que causa dolor de hombro",
    ],
    videoPrompt:
      "Persona haciendo pullover con mancuerna transversal al banco, arco completo, gimnasio bien iluminado",
    sets: { beginner: "3×12", intermediate: "3×10", advanced: "4×10" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 90 },
    tags: ["espalda", "pecho", "mancuernas"],
  },

  // ==========================================================================
  // HOMBROS (12 ejercicios)
  // ==========================================================================

  {
    id: "overhead_barbell_press",
    name: "Press militar con barra",
    nameEn: "Overhead Barbell Press",
    category: "compound",
    muscles: {
      primary: ["deltoidesAnterior", "deltoidesLateral"],
      secondary: ["triceps", "trapecio", "rectoAbdominal"],
    },
    equipment: "barbell",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "De pie, sujeta la barra a la altura de los hombros con agarre ligeramente más ancho",
      "Empuja la barra verticalmente sobre la cabeza",
      "Extiende los brazos completamente bloqueando arriba",
      "Baja de forma controlada a la posición inicial",
    ],
    tips: [
      "Aprieta glúteos y core para estabilizar",
      "No inclines el torso hacia atrás",
      "Respira antes de empujar, exhala arriba",
    ],
    commonMistakes: [
      "Excesiva inclinación del torso hacia atrás",
      "No bloquear completamente arriba",
      "Usar las piernas para impulsar",
    ],
    videoPrompt:
      "Atleta de pie realizando press militar con barra olímpica sobre la cabeza, gimnasio moderno, vista lateral 3/4, movimiento completo ascenso y descenso, iluminación cinematográfica",
    sets: { beginner: "3×10", intermediate: "4×8", advanced: "5×5" },
    restSeconds: { beginner: 90, intermediate: 120, advanced: 150 },
    tags: ["hombros", "fuerza", "compuesto", "barra"],
  },

  {
    id: "seated_dumbbell_press",
    name: "Press de hombro sentado con mancuernas",
    nameEn: "Seated Dumbbell Shoulder Press",
    category: "compound",
    muscles: {
      primary: ["deltoidesAnterior", "deltoidesLateral"],
      secondary: ["triceps", "trapecio"],
    },
    equipment: "dumbbell",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Siéntate en banco con respaldo a 90 grados con mancuernas a la altura de los hombros",
      "Empuja las mancuernas hacia arriba hasta casi tocar",
      "Baja controladamente hasta que los codos queden a 90 grados",
      "Mantén la espalda pegada al respaldo durante todo el movimiento",
    ],
    tips: [
      "No choques las mancuernas arriba, mantén ligera separación",
      "Codos ligeramente por delante del torso",
      "Exhala al empujar, inhala al bajar",
    ],
    commonMistakes: [
      "Arquear la espalda baja",
      "Bajar las mancuernas demasiado",
      "Usar impulso del cuerpo",
    ],
    videoPrompt:
      "Persona sentada en banco con respaldo realizando press de hombros con mancuernas, gimnasio profesional, vista frontal, movimiento fluido",
    sets: { beginner: "3×12", intermediate: "4×10", advanced: "4×8" },
    restSeconds: { beginner: 60, intermediate: 90, advanced: 120 },
    tags: ["hombros", "fuerza", "mancuernas"],
  },

  {
    id: "arnold_press",
    name: "Arnold press",
    nameEn: "Arnold Press",
    category: "compound",
    muscles: {
      primary: ["deltoidesAnterior", "deltoidesLateral"],
      secondary: ["triceps", "deltoidesPosterior"],
    },
    equipment: "dumbbell",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "Sentado, sujeta las mancuernas frente a ti con palmas mirando hacia ti",
      "Mientras empujas hacia arriba, rota las mancuernas para que las palmas miren al frente arriba",
      "Extiende completamente los brazos",
      "Desciende invirtiendo la rotación",
    ],
    tips: [
      "La rotación debe ser fluida y continua",
      "Trabaja las tres cabezas del deltoides",
      "Usa menos peso que en press convencional",
    ],
    commonMistakes: [
      "Rotación incompleta",
      "Movimiento demasiado rápido sin control",
      "Peso excesivo que impide la rotación correcta",
    ],
    videoPrompt:
      "Atleta sentado realizando Arnold press con mancuernas, mostrando la rotación completa de muñecas, vista frontal, gimnasio moderno con buena iluminación",
    sets: { beginner: "3×12", intermediate: "4×10", advanced: "4×8" },
    restSeconds: { beginner: 60, intermediate: 90, advanced: 120 },
    tags: ["hombros", "fuerza", "mancuernas"],
  },

  {
    id: "lateral_raise_dumbbell",
    name: "Elevación lateral con mancuernas",
    nameEn: "Dumbbell Lateral Raise",
    category: "isolation",
    muscles: {
      primary: ["deltoidesLateral"],
      secondary: ["deltoidesAnterior", "trapecio"],
    },
    equipment: "dumbbell",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "De pie con mancuernas a los lados, ligera flexión de codos",
      "Eleva los brazos lateralmente hasta la altura de los hombros",
      "Mantén los codos ligeramente flexionados durante todo el recorrido",
      "Baja de forma controlada",
    ],
    tips: [
      "Imagina verter agua de una jarra al subir",
      "No eleves por encima de los hombros",
      "Usa un peso moderado para mantener la técnica",
    ],
    commonMistakes: [
      "Usar impulso del cuerpo balanceando",
      "Elevar los hombros (encogerse)",
      "Peso excesivo que recluta trapecio",
    ],
    videoPrompt:
      "Persona de pie realizando elevaciones laterales con mancuernas, movimiento simétrico bilateral, vista frontal, gimnasio moderno, enfoque en deltoides lateral",
    sets: { beginner: "3×15", intermediate: "4×12", advanced: "4×15" },
    restSeconds: { beginner: 45, intermediate: 60, advanced: 60 },
    tags: ["hombros", "aislamiento", "mancuernas"],
  },

  {
    id: "lateral_raise_cable",
    name: "Elevación lateral con cable",
    nameEn: "Cable Lateral Raise",
    category: "isolation",
    muscles: {
      primary: ["deltoidesLateral"],
      secondary: ["deltoidesAnterior"],
    },
    equipment: "cable",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Coloca la polea en la posición más baja",
      "De pie de lado a la máquina, agarra el mango con la mano más lejana",
      "Eleva el brazo lateralmente hasta la altura del hombro",
      "Baja de forma controlada resistiendo la tensión del cable",
    ],
    tips: [
      "La tensión constante del cable es superior a las mancuernas",
      "Trabaja un lado a la vez para mayor concentración",
      "Mantén el torso firme sin balancear",
    ],
    commonMistakes: [
      "Inclinarse hacia el lado para compensar",
      "Elevar demasiado alto involucrando trapecio",
      "Movimiento demasiado rápido",
    ],
    videoPrompt:
      "Atleta de pie realizando elevación lateral con cable bajo, un brazo, vista frontal, máquina de poleas en gimnasio profesional",
    sets: { beginner: "3×15", intermediate: "3×12", advanced: "4×12" },
    restSeconds: { beginner: 45, intermediate: 60, advanced: 60 },
    tags: ["hombros", "aislamiento", "cable"],
  },

  {
    id: "front_raise_dumbbell",
    name: "Elevación frontal con mancuernas",
    nameEn: "Dumbbell Front Raise",
    category: "isolation",
    muscles: {
      primary: ["deltoidesAnterior"],
      secondary: ["deltoidesLateral", "pectoralMayor"],
    },
    equipment: "dumbbell",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "De pie con mancuernas frente a los muslos, palmas hacia el cuerpo",
      "Eleva un brazo o ambos al frente hasta la altura de los hombros",
      "Mantén los codos ligeramente flexionados",
      "Baja controladamente y repite",
    ],
    tips: [
      "Alterna brazos o hazlo bilateral",
      "No uses impulso del cuerpo",
      "Mantén las muñecas neutras",
    ],
    commonMistakes: [
      "Elevar por encima de los hombros innecesariamente",
      "Balancear el torso",
      "Peso excesivo",
    ],
    videoPrompt:
      "Persona realizando elevaciones frontales con mancuernas, alternando brazos, vista lateral, gimnasio moderno con buena iluminación",
    sets: { beginner: "3×12", intermediate: "3×12", advanced: "4×10" },
    restSeconds: { beginner: 45, intermediate: 60, advanced: 60 },
    tags: ["hombros", "aislamiento", "mancuernas"],
  },

  {
    id: "rear_delt_fly",
    name: "Elevación posterior con mancuernas",
    nameEn: "Rear Delt Fly",
    category: "isolation",
    muscles: {
      primary: ["deltoidesPosterior"],
      secondary: ["trapecio", "romboides", "infraespinoso"],
    },
    equipment: "dumbbell",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "Inclínate hacia adelante con el torso casi paralelo al suelo",
      "Sujeta las mancuernas debajo del pecho con palmas enfrentadas",
      "Eleva las mancuernas lateralmente apretando escápulas",
      "Baja de forma controlada",
    ],
    tips: [
      "Mantén la espalda recta y el core activado",
      "Piensa en mover los codos hacia atrás y arriba",
      "Usa peso ligero-moderado",
    ],
    commonMistakes: [
      "Redondear la espalda",
      "Usar impulso incorporándose",
      "No apretar las escápulas arriba",
    ],
    videoPrompt:
      "Atleta inclinado hacia adelante realizando elevaciones posteriores con mancuernas, enfoque en deltoides posterior, vista lateral, gimnasio profesional",
    sets: { beginner: "3×15", intermediate: "3×12", advanced: "4×12" },
    restSeconds: { beginner: 45, intermediate: 60, advanced: 60 },
    tags: ["hombros", "aislamiento", "mancuernas"],
  },

  {
    id: "reverse_pec_deck",
    name: "Pec deck inverso (deltoides posterior)",
    nameEn: "Reverse Pec Deck",
    category: "isolation",
    muscles: {
      primary: ["deltoidesPosterior"],
      secondary: ["trapecio", "romboides"],
    },
    equipment: "machine",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "Siéntate mirando hacia la máquina pec deck",
      "Agarra los mangos con las manos a la altura de los hombros",
      "Abre los brazos hacia atrás apretando las escápulas",
      "Regresa de forma controlada",
    ],
    tips: [
      "Ajusta el asiento para que los mangos estén a la altura de los hombros",
      "Mantén ligera flexión en los codos",
      "Enfócate en apretar la parte posterior del hombro",
    ],
    commonMistakes: [
      "Usar demasiado peso y reclutar espalda",
      "No ajustar el asiento correctamente",
      "Movimiento muy rápido sin control",
    ],
    videoPrompt:
      "Persona usando pec deck inverso para deltoides posterior, sentada mirando hacia la máquina, gimnasio moderno, vista lateral",
    sets: { beginner: "3×15", intermediate: "3×12", advanced: "4×12" },
    restSeconds: { beginner: 45, intermediate: 60, advanced: 60 },
    tags: ["hombros", "aislamiento", "máquina"],
  },

  {
    id: "upright_row",
    name: "Remo al mentón",
    nameEn: "Upright Row",
    category: "compound",
    muscles: {
      primary: ["deltoidesLateral", "trapecio"],
      secondary: ["deltoidesAnterior", "biceps"],
    },
    equipment: "barbell",
    mechanic: "pull",
    force: "pull",
    level: "intermediate",
    instructions: [
      "De pie con barra frente a ti, agarre estrecho o a la anchura de los hombros",
      "Eleva la barra deslizándola cerca del cuerpo hasta la altura del mentón",
      "Los codos deben subir por encima de las manos",
      "Baja controladamente",
    ],
    tips: [
      "Agarre más ancho reduce riesgo de impingement de hombro",
      "No eleves por encima de los hombros si tienes problemas articulares",
      "Puedes hacerlo con mancuernas o cable",
    ],
    commonMistakes: [
      "Agarre demasiado estrecho",
      "Elevar excesivamente causando impingement",
      "Usar impulso del cuerpo",
    ],
    videoPrompt:
      "Atleta de pie realizando remo al mentón con barra, codos elevados, vista frontal, gimnasio profesional con buena iluminación",
    sets: { beginner: "3×12", intermediate: "3×10", advanced: "4×10" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 90 },
    tags: ["hombros", "trapecio", "compuesto", "barra"],
  },

  {
    id: "machine_shoulder_press",
    name: "Press de hombros en máquina",
    nameEn: "Machine Shoulder Press",
    category: "compound",
    muscles: {
      primary: ["deltoidesAnterior", "deltoidesLateral"],
      secondary: ["triceps", "trapecio"],
    },
    equipment: "machine",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Siéntate y ajusta el asiento para que los mangos queden a la altura de los hombros",
      "Agarra los mangos y empuja hacia arriba",
      "Extiende los brazos sin bloquear completamente",
      "Baja controladamente hasta la posición inicial",
    ],
    tips: [
      "Ideal para principiantes por la trayectoria guiada",
      "Mantén la espalda pegada al respaldo",
      "No bloquees los codos completamente arriba",
    ],
    commonMistakes: [
      "Asiento mal ajustado",
      "Separar la espalda del respaldo",
      "Bloquear los codos agresivamente",
    ],
    videoPrompt:
      "Persona usando máquina de press de hombros, sentada con espalda apoyada, empujando mangos sobre la cabeza, gimnasio moderno",
    sets: { beginner: "3×12", intermediate: "3×10", advanced: "4×10" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 90 },
    tags: ["hombros", "máquina", "principiante"],
  },

  {
    id: "behind_neck_press",
    name: "Press tras nuca con barra",
    nameEn: "Behind the Neck Press",
    category: "compound",
    muscles: {
      primary: ["deltoidesLateral", "deltoidesAnterior"],
      secondary: ["triceps", "trapecio"],
    },
    equipment: "barbell",
    mechanic: "push",
    force: "push",
    level: "advanced",
    instructions: [
      "Sentado, sujeta la barra detrás de la cabeza a la altura de las orejas",
      "Empuja la barra verticalmente sobre la cabeza",
      "Extiende completamente los brazos",
      "Baja la barra detrás de la cabeza hasta las orejas",
    ],
    tips: [
      "Requiere buena movilidad de hombros",
      "Usa peso moderado y control total",
      "No bajes demasiado para proteger la articulación",
    ],
    commonMistakes: [
      "Bajar la barra demasiado detrás",
      "Falta de movilidad para realizarlo seguro",
      "Usar peso excesivo",
    ],
    videoPrompt:
      "Atleta sentado realizando press tras nuca con barra, mostrando rango de movimiento controlado, vista lateral, gimnasio profesional",
    sets: { beginner: "3×10", intermediate: "3×8", advanced: "4×8" },
    restSeconds: { beginner: 90, intermediate: 90, advanced: 120 },
    tags: ["hombros", "fuerza", "barra", "avanzado"],
  },

  {
    id: "dumbbell_shrug",
    name: "Encogimientos con mancuernas",
    nameEn: "Dumbbell Shrug",
    category: "isolation",
    muscles: {
      primary: ["trapecio"],
      secondary: ["deltoidesLateral", "romboides"],
    },
    equipment: "dumbbell",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "De pie con mancuernas a los lados, brazos extendidos",
      "Eleva los hombros hacia las orejas lo más alto posible",
      "Mantén la contracción arriba 1-2 segundos",
      "Baja controladamente",
    ],
    tips: [
      "No rotes los hombros, sube y baja recto",
      "Mantén los brazos rectos, no flexiones los codos",
      "Usa straps si el agarre limita el peso",
    ],
    commonMistakes: [
      "Rotar los hombros (innecesario y arriesgado)",
      "Rango de movimiento incompleto",
      "Flexionar los codos",
    ],
    videoPrompt:
      "Persona de pie realizando encogimientos de hombros con mancuernas pesadas, movimiento vertical puro, vista frontal, gimnasio moderno",
    sets: { beginner: "3×15", intermediate: "4×12", advanced: "4×15" },
    restSeconds: { beginner: 45, intermediate: 60, advanced: 60 },
    tags: ["hombros", "trapecio", "aislamiento", "mancuernas"],
  },

  // ==========================================================================
  // BÍCEPS (10 ejercicios)
  // ==========================================================================

  {
    id: "barbell_curl",
    name: "Curl con barra recta",
    nameEn: "Barbell Curl",
    category: "isolation",
    muscles: {
      primary: ["biceps"],
      secondary: ["braquial", "antebrazo"],
    },
    equipment: "barbell",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "De pie con barra a la anchura de los hombros, palmas al frente",
      "Flexiona los codos llevando la barra hacia los hombros",
      "Aprieta los bíceps en la contracción máxima",
      "Baja de forma controlada hasta extender los brazos",
    ],
    tips: [
      "Mantén los codos pegados al torso",
      "No balancees el cuerpo para impulsar",
      "Controla la fase negativa 2-3 segundos",
    ],
    commonMistakes: [
      "Balancear el torso para subir el peso",
      "Codos que se desplazan hacia adelante",
      "Extensión incompleta abajo",
    ],
    videoPrompt:
      "Atleta de pie realizando curl de bíceps con barra recta, codos fijos al torso, vista frontal, gimnasio moderno con buena iluminación",
    sets: { beginner: "3×12", intermediate: "4×10", advanced: "4×8" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 90 },
    tags: ["bíceps", "aislamiento", "barra"],
  },

  {
    id: "ez_bar_curl",
    name: "Curl con barra EZ",
    nameEn: "EZ Bar Curl",
    category: "isolation",
    muscles: {
      primary: ["biceps"],
      secondary: ["braquial", "antebrazo"],
    },
    equipment: "barbell",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "De pie, agarra la barra EZ por las curvas interiores",
      "Flexiona los codos llevando la barra hacia los hombros",
      "Aprieta los bíceps arriba",
      "Baja de forma controlada",
    ],
    tips: [
      "La barra EZ reduce estrés en las muñecas",
      "Mantén los codos fijos a los lados",
      "Puedes usar agarre ancho o estrecho según la curva",
    ],
    commonMistakes: [
      "Mover los codos hacia adelante",
      "Usar impulso del torso",
      "Agarre incorrecto en la barra EZ",
    ],
    videoPrompt:
      "Persona realizando curl de bíceps con barra EZ, mostrando agarre en las curvas, vista frontal, gimnasio profesional",
    sets: { beginner: "3×12", intermediate: "4×10", advanced: "4×8" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 90 },
    tags: ["bíceps", "aislamiento", "barra"],
  },

  {
    id: "dumbbell_curl",
    name: "Curl con mancuernas",
    nameEn: "Dumbbell Curl",
    category: "isolation",
    muscles: {
      primary: ["biceps"],
      secondary: ["braquial", "antebrazo"],
    },
    equipment: "dumbbell",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "De pie con mancuernas a los lados, palmas al frente",
      "Flexiona un brazo o ambos llevando mancuernas a los hombros",
      "Supina la muñeca durante la subida para mayor contracción",
      "Baja controladamente",
    ],
    tips: [
      "Alterna brazos o hazlo bilateral",
      "La supinación al subir activa más el bíceps",
      "No dejes que las mancuernas caigan en la bajada",
    ],
    commonMistakes: [
      "Balancear el cuerpo",
      "No completar el rango de movimiento",
      "Velocidad excesiva",
    ],
    videoPrompt:
      "Atleta realizando curl alterno con mancuernas, supinación visible, vista frontal, gimnasio moderno bien iluminado",
    sets: { beginner: "3×12", intermediate: "4×10", advanced: "4×8" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 90 },
    tags: ["bíceps", "aislamiento", "mancuernas"],
  },

  {
    id: "hammer_curl",
    name: "Curl martillo",
    nameEn: "Hammer Curl",
    category: "isolation",
    muscles: {
      primary: ["braquial", "biceps"],
      secondary: ["antebrazo"],
    },
    equipment: "dumbbell",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "De pie con mancuernas a los lados, palmas mirándose entre sí (agarre neutro)",
      "Flexiona los codos manteniendo las palmas enfrentadas todo el movimiento",
      "Sube hasta la contracción máxima",
      "Baja de forma controlada",
    ],
    tips: [
      "Trabaja braquial y braquiorradial además del bíceps",
      "Excelente para grosor del brazo",
      "Mantén los codos pegados al torso",
    ],
    commonMistakes: [
      "Rotar las muñecas durante el movimiento",
      "Balancear el cuerpo",
      "Codos que se desplazan",
    ],
    videoPrompt:
      "Persona de pie realizando curl martillo con mancuernas, agarre neutro, vista lateral, gimnasio profesional con buena iluminación",
    sets: { beginner: "3×12", intermediate: "4×10", advanced: "4×8" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 90 },
    tags: ["bíceps", "braquial", "aislamiento", "mancuernas"],
  },

  {
    id: "concentration_curl",
    name: "Curl concentrado",
    nameEn: "Concentration Curl",
    category: "isolation",
    muscles: {
      primary: ["biceps"],
      secondary: ["braquial"],
    },
    equipment: "dumbbell",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "Sentado, apoya el codo en la cara interna del muslo",
      "Con mancuerna en mano, brazo extendido abajo",
      "Flexiona el codo llevando la mancuerna al hombro",
      "Aprieta el bíceps arriba y baja controladamente",
    ],
    tips: [
      "La mejor activación del bíceps según estudios EMG",
      "Elimina completamente el impulso del cuerpo",
      "Enfócate en la conexión mente-músculo",
    ],
    commonMistakes: [
      "Usar el hombro para ayudar a subir",
      "No apoyar bien el codo en el muslo",
      "Rango de movimiento incompleto",
    ],
    videoPrompt:
      "Atleta sentado realizando curl concentrado con mancuerna, codo apoyado en muslo, enfoque en bíceps, vista frontal, gimnasio moderno",
    sets: { beginner: "3×12", intermediate: "3×10", advanced: "4×10" },
    restSeconds: { beginner: 45, intermediate: 60, advanced: 60 },
    tags: ["bíceps", "aislamiento", "mancuernas"],
  },

  {
    id: "preacher_curl",
    name: "Curl predicador",
    nameEn: "Preacher Curl",
    category: "isolation",
    muscles: {
      primary: ["biceps"],
      secondary: ["braquial"],
    },
    equipment: "barbell",
    mechanic: "pull",
    force: "pull",
    level: "intermediate",
    instructions: [
      "Siéntate en el banco predicador con los brazos apoyados en la almohadilla",
      "Sujeta la barra EZ o recta con agarre supino",
      "Flexiona los codos hasta la contracción máxima",
      "Baja lentamente hasta casi extender por completo",
    ],
    tips: [
      "Enfatiza la cabeza corta del bíceps",
      "No extiendas completamente para proteger los tendones",
      "Controla especialmente la fase excéntrica",
    ],
    commonMistakes: [
      "Extensión completa brusca (riesgo de lesión)",
      "Levantar los codos de la almohadilla",
      "Usar impulso del cuerpo",
    ],
    videoPrompt:
      "Persona en banco predicador realizando curl con barra EZ, brazos apoyados en almohadilla, vista lateral, gimnasio profesional",
    sets: { beginner: "3×12", intermediate: "3×10", advanced: "4×8" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 90 },
    tags: ["bíceps", "aislamiento", "barra"],
  },

  {
    id: "cable_curl",
    name: "Curl con cable",
    nameEn: "Cable Curl",
    category: "isolation",
    muscles: {
      primary: ["biceps"],
      secondary: ["braquial", "antebrazo"],
    },
    equipment: "cable",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "Coloca la polea en la posición más baja con barra recta o EZ",
      "De pie frente a la máquina, agarra la barra con palmas al frente",
      "Flexiona los codos llevando la barra a los hombros",
      "Baja controladamente manteniendo tensión constante",
    ],
    tips: [
      "Tensión constante durante todo el recorrido",
      "Puedes usar diferentes agarres y mangos",
      "Ideal para series de acabado con altas repeticiones",
    ],
    commonMistakes: [
      "Inclinarse hacia atrás",
      "Mover los codos adelante",
      "Soltar la tensión abajo",
    ],
    videoPrompt:
      "Atleta de pie realizando curl de bíceps con polea baja, barra recta, tensión constante visible en el cable, gimnasio moderno",
    sets: { beginner: "3×15", intermediate: "3×12", advanced: "4×12" },
    restSeconds: { beginner: 45, intermediate: 60, advanced: 60 },
    tags: ["bíceps", "aislamiento", "cable"],
  },

  {
    id: "spider_curl",
    name: "Spider curl",
    nameEn: "Spider Curl",
    category: "isolation",
    muscles: {
      primary: ["biceps"],
      secondary: ["braquial"],
    },
    equipment: "dumbbell",
    mechanic: "pull",
    force: "pull",
    level: "intermediate",
    instructions: [
      "Acuéstate boca abajo en un banco inclinado con los brazos colgando",
      "Sujeta mancuernas o barra EZ con brazos perpendiculares al suelo",
      "Flexiona los codos llevando el peso hacia los hombros",
      "Baja de forma controlada sin perder tensión",
    ],
    tips: [
      "Elimina todo impulso al estar apoyado en el banco",
      "Excelente para la cabeza corta del bíceps",
      "Usa peso moderado para máxima contracción",
    ],
    commonMistakes: [
      "Mover los hombros para ayudar",
      "Rango incompleto",
      "Peso excesivo que impide buena forma",
    ],
    videoPrompt:
      "Persona acostada boca abajo en banco inclinado realizando spider curl con mancuernas, brazos colgando, vista lateral, gimnasio profesional",
    sets: { beginner: "3×12", intermediate: "3×10", advanced: "4×10" },
    restSeconds: { beginner: 45, intermediate: 60, advanced: 60 },
    tags: ["bíceps", "aislamiento", "mancuernas"],
  },

  {
    id: "incline_dumbbell_curl",
    name: "Curl inclinado con mancuernas",
    nameEn: "Incline Dumbbell Curl",
    category: "isolation",
    muscles: {
      primary: ["biceps"],
      secondary: ["braquial"],
    },
    equipment: "dumbbell",
    mechanic: "pull",
    force: "pull",
    level: "intermediate",
    instructions: [
      "Siéntate en banco inclinado a 45 grados con mancuernas colgando",
      "Flexiona los codos llevando las mancuernas a los hombros",
      "Aprieta los bíceps en la parte alta",
      "Baja controladamente dejando los brazos extendidos",
    ],
    tips: [
      "Mayor estiramiento del bíceps que en curl de pie",
      "Trabaja la cabeza larga del bíceps",
      "No uses peso excesivo, prioriza el estiramiento",
    ],
    commonMistakes: [
      "Mover los codos hacia adelante",
      "Incorporarse del banco",
      "Rango incompleto de movimiento",
    ],
    videoPrompt:
      "Atleta en banco inclinado a 45 grados realizando curl con mancuernas, estiramiento visible del bíceps, vista lateral, gimnasio moderno",
    sets: { beginner: "3×12", intermediate: "3×10", advanced: "4×10" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 90 },
    tags: ["bíceps", "aislamiento", "mancuernas"],
  },

  {
    id: "reverse_barbell_curl",
    name: "Curl invertido con barra",
    nameEn: "Reverse Barbell Curl",
    category: "isolation",
    muscles: {
      primary: ["braquial", "antebrazo"],
      secondary: ["biceps"],
    },
    equipment: "barbell",
    mechanic: "pull",
    force: "pull",
    level: "intermediate",
    instructions: [
      "De pie con barra, agarre prono (palmas hacia abajo) a la anchura de los hombros",
      "Flexiona los codos llevando la barra hacia los hombros",
      "Mantén los codos pegados al torso",
      "Baja de forma controlada",
    ],
    tips: [
      "Excelente para desarrollo de antebrazos y braquial",
      "Usa menos peso que en curl supino",
      "Barra EZ es más cómoda para las muñecas",
    ],
    commonMistakes: [
      "Peso excesivo que rompe la forma",
      "Balancear el cuerpo",
      "Muñecas que se flexionan",
    ],
    videoPrompt:
      "Persona de pie realizando curl invertido con barra, agarre prono, enfoque en antebrazos, vista frontal, gimnasio moderno",
    sets: { beginner: "3×12", intermediate: "3×10", advanced: "4×10" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 60 },
    tags: ["bíceps", "antebrazo", "aislamiento", "barra"],
  },

  // ==========================================================================
  // TRÍCEPS (10 ejercicios)
  // ==========================================================================

  {
    id: "tricep_pushdown_rope",
    name: "Extensión de tríceps con cuerda en polea",
    nameEn: "Tricep Rope Pushdown",
    category: "isolation",
    muscles: {
      primary: ["triceps"],
      secondary: ["antebrazo"],
    },
    equipment: "cable",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Coloca la cuerda en la polea alta",
      "Agarra los extremos de la cuerda con agarre neutro",
      "Extiende los codos empujando hacia abajo",
      "Abre la cuerda al final del movimiento para mayor contracción",
    ],
    tips: [
      "Mantén los codos pegados al torso",
      "Separa los extremos de la cuerda abajo",
      "No inclines el torso excesivamente",
    ],
    commonMistakes: [
      "Codos que se desplazan hacia adelante",
      "Usar los hombros para empujar",
      "No abrir la cuerda al final",
    ],
    videoPrompt:
      "Persona de pie realizando extensión de tríceps con cuerda en polea alta, mostrando apertura de cuerda al final, vista lateral, gimnasio moderno",
    sets: { beginner: "3×15", intermediate: "3×12", advanced: "4×12" },
    restSeconds: { beginner: 45, intermediate: 60, advanced: 60 },
    tags: ["tríceps", "aislamiento", "cable"],
  },

  {
    id: "tricep_pushdown_bar",
    name: "Extensión de tríceps con barra en polea",
    nameEn: "Tricep Bar Pushdown",
    category: "isolation",
    muscles: {
      primary: ["triceps"],
      secondary: ["antebrazo"],
    },
    equipment: "cable",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Coloca la barra recta o V en la polea alta",
      "Agarra la barra con palmas hacia abajo",
      "Extiende los codos empujando la barra hacia abajo",
      "Regresa de forma controlada sin pasar los 90 grados de flexión",
    ],
    tips: [
      "Codos fijos al torso durante todo el movimiento",
      "Ligera inclinación del torso hacia adelante",
      "Aprieta los tríceps en la extensión completa",
    ],
    commonMistakes: [
      "Mover los codos",
      "Usar peso del cuerpo para empujar",
      "Rango de movimiento incompleto",
    ],
    videoPrompt:
      "Atleta realizando pushdown de tríceps con barra V en polea alta, codos fijos, vista lateral, gimnasio profesional",
    sets: { beginner: "3×15", intermediate: "3×12", advanced: "4×12" },
    restSeconds: { beginner: 45, intermediate: 60, advanced: 60 },
    tags: ["tríceps", "aislamiento", "cable"],
  },

  {
    id: "overhead_tricep_extension",
    name: "Extensión de tríceps sobre la cabeza con mancuerna",
    nameEn: "Overhead Dumbbell Tricep Extension",
    category: "isolation",
    muscles: {
      primary: ["triceps"],
      secondary: [],
    },
    equipment: "dumbbell",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Sentado o de pie, sujeta una mancuerna con ambas manos sobre la cabeza",
      "Baja la mancuerna detrás de la cabeza flexionando los codos",
      "Extiende los codos para volver a la posición inicial",
      "Mantén los codos apuntando al techo",
    ],
    tips: [
      "Trabaja la cabeza larga del tríceps",
      "Mantén los codos cerca de las orejas",
      "Usa un peso que permita control total",
    ],
    commonMistakes: [
      "Codos que se abren hacia los lados",
      "Arquear la espalda baja",
      "Bajar demasiado la mancuerna",
    ],
    videoPrompt:
      "Persona sentada realizando extensión de tríceps sobre la cabeza con mancuerna grande, codos apuntando arriba, vista lateral, gimnasio moderno",
    sets: { beginner: "3×12", intermediate: "3×10", advanced: "4×10" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 90 },
    tags: ["tríceps", "aislamiento", "mancuernas"],
  },

  {
    id: "skull_crushers",
    name: "Rompecráneos (skull crushers)",
    nameEn: "Skull Crushers",
    category: "isolation",
    muscles: {
      primary: ["triceps"],
      secondary: ["antebrazo"],
    },
    equipment: "barbell",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "Acuéstate en banco plano con barra EZ o recta, brazos extendidos sobre el pecho",
      "Flexiona los codos bajando la barra hacia la frente o ligeramente detrás",
      "Los codos apuntan al techo y no se mueven",
      "Extiende los codos para volver a la posición inicial",
    ],
    tips: [
      "Baja la barra ligeramente detrás de la cabeza para mayor estiramiento",
      "Mantén los codos fijos apuntando al techo",
      "Usa barra EZ para menos estrés en muñecas",
    ],
    commonMistakes: [
      "Mover los codos hacia los lados",
      "Bajar la barra directamente a la cara",
      "Usar los hombros para regresar la barra",
    ],
    videoPrompt:
      "Atleta acostado en banco plano realizando skull crushers con barra EZ, codos fijos, barra bajando hacia la frente, vista lateral, gimnasio profesional",
    sets: { beginner: "3×12", intermediate: "3×10", advanced: "4×8" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 90 },
    tags: ["tríceps", "aislamiento", "barra"],
  },

  {
    id: "french_press_cable",
    name: "Press francés con cable",
    nameEn: "Cable French Press",
    category: "isolation",
    muscles: {
      primary: ["triceps"],
      secondary: [],
    },
    equipment: "cable",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "Coloca la polea baja y agarra la barra o cuerda con ambas manos",
      "De espaldas a la máquina, lleva las manos sobre la cabeza",
      "Extiende los codos empujando la cuerda hacia adelante y arriba",
      "Flexiona los codos controladamente para regresar",
    ],
    tips: [
      "Tensión constante del cable durante todo el movimiento",
      "Mantén los codos apuntando al frente",
      "Pie adelantado para estabilidad",
    ],
    commonMistakes: [
      "Codos que se abren",
      "Usar los hombros",
      "Perder la postura estable",
    ],
    videoPrompt:
      "Persona de espaldas a la polea realizando press francés con cuerda sobre la cabeza, tensión constante, vista lateral, gimnasio moderno",
    sets: { beginner: "3×12", intermediate: "3×10", advanced: "4×10" },
    restSeconds: { beginner: 45, intermediate: 60, advanced: 60 },
    tags: ["tríceps", "aislamiento", "cable"],
  },

  {
    id: "tricep_dips",
    name: "Fondos en paralelas para tríceps",
    nameEn: "Tricep Dips",
    category: "compound",
    muscles: {
      primary: ["triceps"],
      secondary: ["pectoralMayor", "deltoidesAnterior"],
    },
    equipment: "bodyweight",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "Sujétate en las barras paralelas con los brazos extendidos",
      "Baja flexionando los codos, cuerpo vertical",
      "Desciende hasta que los codos estén a 90 grados",
      "Empuja hacia arriba hasta la extensión completa",
    ],
    tips: [
      "Mantén el torso vertical para enfatizar tríceps",
      "Inclinar hacia adelante traslada trabajo al pecho",
      "Añade lastre cuando el peso corporal sea fácil",
    ],
    commonMistakes: [
      "Bajar demasiado profundo causando dolor de hombro",
      "Inclinarse involuntariamente hacia adelante",
      "No completar la extensión arriba",
    ],
    videoPrompt:
      "Atleta realizando fondos en barras paralelas con torso vertical para enfatizar tríceps, vista lateral, gimnasio profesional con buena iluminación",
    sets: { beginner: "3×8", intermediate: "4×10", advanced: "4×12" },
    restSeconds: { beginner: 90, intermediate: 90, advanced: 60 },
    tags: ["tríceps", "compuesto", "peso corporal"],
  },

  {
    id: "bench_dips",
    name: "Fondos en banco",
    nameEn: "Bench Dips",
    category: "compound",
    muscles: {
      primary: ["triceps"],
      secondary: ["deltoidesAnterior", "pectoralMayor"],
    },
    equipment: "bench",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Siéntate en el borde del banco con las manos a los lados",
      "Desliza el cuerpo hacia adelante fuera del banco",
      "Baja flexionando los codos hasta 90 grados",
      "Empuja hacia arriba extendiendo los brazos",
    ],
    tips: [
      "Piernas extendidas para mayor dificultad",
      "Piernas flexionadas para facilitar",
      "Puedes colocar los pies en otro banco para más rango",
    ],
    commonMistakes: [
      "Codos que se abren hacia los lados",
      "Bajar demasiado causando estrés en hombros",
      "Usar las piernas para impulsar",
    ],
    videoPrompt:
      "Persona realizando fondos en banco con manos apoyadas, cuerpo descendiendo frente al banco, vista lateral, gimnasio moderno",
    sets: { beginner: "3×12", intermediate: "3×15", advanced: "4×15" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 45 },
    tags: ["tríceps", "compuesto", "peso corporal"],
  },

  {
    id: "tricep_kickback",
    name: "Kickback de tríceps",
    nameEn: "Tricep Kickback",
    category: "isolation",
    muscles: {
      primary: ["triceps"],
      secondary: [],
    },
    equipment: "dumbbell",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Inclina el torso hacia adelante apoyando una mano en el banco",
      "Lleva el codo hacia atrás alineado con el torso",
      "Extiende el codo empujando la mancuerna hacia atrás",
      "Regresa controladamente a 90 grados de flexión",
    ],
    tips: [
      "Mantén el brazo superior paralelo al suelo",
      "Aprieta el tríceps en la extensión completa",
      "Usa peso ligero-moderado para buena técnica",
    ],
    commonMistakes: [
      "El codo cae por debajo de la espalda",
      "Usar impulso para extender",
      "Rango de movimiento incompleto",
    ],
    videoPrompt:
      "Atleta inclinado realizando kickback de tríceps con mancuerna, brazo extendido hacia atrás, vista lateral, gimnasio profesional",
    sets: { beginner: "3×12", intermediate: "3×12", advanced: "4×10" },
    restSeconds: { beginner: 45, intermediate: 45, advanced: 60 },
    tags: ["tríceps", "aislamiento", "mancuernas"],
  },

  {
    id: "diamond_close_grip_push_up",
    name: "Flexiones diamante",
    nameEn: "Diamond Push-Up",
    category: "compound",
    muscles: {
      primary: ["triceps"],
      secondary: ["pectoralMayor", "deltoidesAnterior"],
    },
    equipment: "bodyweight",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "Posición de flexión con las manos juntas formando un diamante",
      "Los pulgares e índices se tocan debajo del pecho",
      "Baja el pecho hasta las manos manteniendo codos pegados",
      "Empuja hacia arriba hasta la extensión completa",
    ],
    tips: [
      "Mayor activación de tríceps que flexiones normales",
      "Mantén el core apretado y el cuerpo recto",
      "Si es muy difícil, hazlo desde las rodillas",
    ],
    commonMistakes: [
      "Codos que se abren a los lados",
      "Cadera que cae o se eleva",
      "Rango de movimiento incompleto",
    ],
    videoPrompt:
      "Persona realizando flexiones diamante con manos juntas formando triángulo, enfoque en tríceps, vista lateral, gimnasio moderno",
    sets: { beginner: "3×8", intermediate: "3×12", advanced: "4×15" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 45 },
    tags: ["tríceps", "compuesto", "peso corporal"],
  },

  {
    id: "overhead_cable_tricep_extension",
    name: "Extensión de tríceps con cable alto unilateral",
    nameEn: "Overhead Cable Tricep Extension",
    category: "isolation",
    muscles: {
      primary: ["triceps"],
      secondary: [],
    },
    equipment: "cable",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Coloca la polea alta y usa un mango individual",
      "De espaldas a la máquina, agarra el mango con una mano sobre la cabeza",
      "Extiende el codo empujando hacia adelante y arriba",
      "Flexiona el codo controladamente para regresar",
    ],
    tips: [
      "Trabaja cada brazo de forma independiente",
      "Excelente para corregir desequilibrios",
      "Mantén el codo apuntando al frente",
    ],
    commonMistakes: [
      "Mover todo el brazo en lugar de solo el antebrazo",
      "Inclinar el torso excesivamente",
      "Peso excesivo",
    ],
    videoPrompt:
      "Atleta de espaldas a la polea realizando extensión de tríceps unilateral sobre la cabeza, vista lateral, gimnasio moderno",
    sets: { beginner: "3×12", intermediate: "3×10", advanced: "4×10" },
    restSeconds: { beginner: 45, intermediate: 60, advanced: 60 },
    tags: ["tríceps", "aislamiento", "cable", "unilateral"],
  },

  // ==========================================================================
  // PIERNAS (20 ejercicios)
  // ==========================================================================

  {
    id: "barbell_back_squat",
    name: "Sentadilla trasera con barra",
    nameEn: "Barbell Back Squat",
    category: "compound",
    muscles: {
      primary: ["cuadriceps", "gluteoMayor"],
      secondary: ["isquiotibiales", "erectoresEspinales", "rectoAbdominal", "aductores"],
    },
    equipment: "barbell",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "Coloca la barra sobre los trapecios superiores (high bar) o deltoides posteriores (low bar)",
      "Desrackea y da un paso atrás, pies a la anchura de los hombros",
      "Desciende flexionando caderas y rodillas hasta que los muslos estén paralelos o más abajo",
      "Empuja a través de los talones para volver a la posición inicial",
    ],
    tips: [
      "Mantén el pecho alto y la mirada al frente",
      "Las rodillas siguen la dirección de los pies",
      "Respira profundo antes de bajar (maniobra de Valsalva)",
    ],
    commonMistakes: [
      "Rodillas que colapsan hacia adentro",
      "Redondear la espalda baja",
      "Elevar los talones del suelo",
    ],
    videoPrompt:
      "Atleta realizando sentadilla trasera con barra olímpica, posición high bar, descendiendo hasta paralelo, vista lateral 3/4, gimnasio de powerlifting, iluminación cinematográfica",
    sets: { beginner: "3×10", intermediate: "4×8", advanced: "5×5" },
    restSeconds: { beginner: 120, intermediate: 150, advanced: 180 },
    tags: ["piernas", "glúteos", "fuerza", "compuesto", "barra"],
  },

  {
    id: "front_squat",
    name: "Sentadilla frontal",
    nameEn: "Front Squat",
    category: "compound",
    muscles: {
      primary: ["cuadriceps"],
      secondary: ["gluteoMayor", "rectoAbdominal", "erectoresEspinales"],
    },
    equipment: "barbell",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "Coloca la barra en los deltoides frontales con agarre limpio o cruzado",
      "Codos altos apuntando al frente",
      "Desciende manteniendo el torso lo más vertical posible",
      "Empuja a través de los talones manteniendo los codos altos",
    ],
    tips: [
      "Mayor énfasis en cuádriceps que la sentadilla trasera",
      "Requiere buena movilidad de muñecas y tobillos",
      "Codos altos son clave para no perder la barra",
    ],
    commonMistakes: [
      "Codos que caen y la barra se desliza",
      "Redondear la espalda alta",
      "Falta de profundidad por movilidad limitada",
    ],
    videoPrompt:
      "Persona realizando sentadilla frontal con barra, codos altos, torso vertical, vista lateral, gimnasio de halterofilia",
    sets: { beginner: "3×8", intermediate: "4×6", advanced: "5×5" },
    restSeconds: { beginner: 120, intermediate: 150, advanced: 180 },
    tags: ["piernas", "cuádriceps", "fuerza", "compuesto", "barra"],
  },

  {
    id: "goblet_squat",
    name: "Sentadilla goblet",
    nameEn: "Goblet Squat",
    category: "compound",
    muscles: {
      primary: ["cuadriceps", "gluteoMayor"],
      secondary: ["rectoAbdominal", "aductores"],
    },
    equipment: "dumbbell",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Sujeta una mancuerna o kettlebell verticalmente contra el pecho",
      "Pies ligeramente más anchos que los hombros, puntas hacia afuera",
      "Desciende empujando las rodillas hacia afuera",
      "Sube empujando a través de los talones",
    ],
    tips: [
      "Ideal para aprender el patrón de sentadilla",
      "El peso frontal ayuda a mantener el torso vertical",
      "Permite mayor profundidad que otras sentadillas",
    ],
    commonMistakes: [
      "Rodillas que colapsan hacia adentro",
      "Inclinar el torso excesivamente",
      "No bajar suficiente",
    ],
    videoPrompt:
      "Persona realizando sentadilla goblet con kettlebell contra el pecho, profundidad completa, vista frontal, gimnasio moderno",
    sets: { beginner: "3×12", intermediate: "3×10", advanced: "4×10" },
    restSeconds: { beginner: 60, intermediate: 90, advanced: 90 },
    tags: ["piernas", "glúteos", "principiante", "mancuernas"],
  },

  {
    id: "bulgarian_split_squat",
    name: "Sentadilla búlgara",
    nameEn: "Bulgarian Split Squat",
    category: "compound",
    muscles: {
      primary: ["cuadriceps", "gluteoMayor"],
      secondary: ["isquiotibiales", "gluteoMedio", "aductores"],
    },
    equipment: "dumbbell",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "Coloca el empeine del pie trasero sobre un banco",
      "Con mancuernas a los lados, desciende con la pierna delantera",
      "La rodilla delantera no debe sobrepasar excesivamente la punta del pie",
      "Empuja con la pierna delantera para subir",
    ],
    tips: [
      "Excelente para corregir desequilibrios entre piernas",
      "Mantén el torso erguido",
      "Ajusta la distancia al banco según tu comodidad",
    ],
    commonMistakes: [
      "Pie delantero demasiado cerca del banco",
      "Rodilla delantera que colapsa hacia adentro",
      "Inclinación excesiva del torso",
    ],
    videoPrompt:
      "Atleta realizando sentadilla búlgara con pie trasero en banco, mancuernas a los lados, descenso profundo, vista lateral, gimnasio profesional",
    sets: { beginner: "3×10", intermediate: "3×10", advanced: "4×8" },
    restSeconds: { beginner: 60, intermediate: 90, advanced: 90 },
    tags: ["piernas", "glúteos", "unilateral", "mancuernas"],
  },

  {
    id: "hack_squat_machine",
    name: "Hack squat en máquina",
    nameEn: "Hack Squat Machine",
    category: "compound",
    muscles: {
      primary: ["cuadriceps"],
      secondary: ["gluteoMayor", "isquiotibiales"],
    },
    equipment: "machine",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Colócate en la máquina con la espalda contra el respaldo",
      "Pies a la anchura de los hombros en la plataforma",
      "Desbloquea los seguros y desciende flexionando las rodillas",
      "Empuja hasta casi extender las piernas",
    ],
    tips: [
      "Posición de pies más baja enfatiza cuádriceps",
      "Posición más alta enfatiza glúteos e isquiotibiales",
      "No bloquees completamente las rodillas arriba",
    ],
    commonMistakes: [
      "Bloquear las rodillas agresivamente",
      "Separar la espalda del respaldo",
      "Pies demasiado altos o bajos en la plataforma",
    ],
    videoPrompt:
      "Persona en máquina hack squat descendiendo con espalda apoyada, cuádriceps trabajando, vista lateral, gimnasio moderno",
    sets: { beginner: "3×12", intermediate: "4×10", advanced: "4×8" },
    restSeconds: { beginner: 90, intermediate: 90, advanced: 120 },
    tags: ["piernas", "cuádriceps", "máquina"],
  },

  {
    id: "leg_press",
    name: "Prensa de piernas",
    nameEn: "Leg Press",
    category: "compound",
    muscles: {
      primary: ["cuadriceps", "gluteoMayor"],
      secondary: ["isquiotibiales", "aductores"],
    },
    equipment: "machine",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Siéntate en la prensa con la espalda y cabeza apoyadas",
      "Coloca los pies a la anchura de los hombros en la plataforma",
      "Desbloquea los seguros y baja flexionando las rodillas",
      "Empuja la plataforma sin bloquear las rodillas arriba",
    ],
    tips: [
      "Pies altos = más glúteos e isquiotibiales",
      "Pies bajos = más cuádriceps",
      "No dejes que la cadera se despegue del asiento abajo",
    ],
    commonMistakes: [
      "Bloquear las rodillas completamente",
      "Cadera que se despega del asiento",
      "Rango de movimiento insuficiente",
    ],
    videoPrompt:
      "Atleta en máquina de prensa de piernas empujando la plataforma con piernas, espalda apoyada, vista lateral, gimnasio profesional",
    sets: { beginner: "3×12", intermediate: "4×10", advanced: "4×8" },
    restSeconds: { beginner: 90, intermediate: 120, advanced: 150 },
    tags: ["piernas", "glúteos", "máquina", "compuesto"],
  },

  {
    id: "leg_extension",
    name: "Extensión de cuádriceps en máquina",
    nameEn: "Leg Extension",
    category: "isolation",
    muscles: {
      primary: ["cuadriceps"],
      secondary: [],
    },
    equipment: "machine",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Siéntate en la máquina con la espalda apoyada",
      "Coloca los tobillos detrás del rodillo inferior",
      "Extiende las piernas hasta la horizontal",
      "Baja controladamente sin soltar el peso",
    ],
    tips: [
      "Aprieta los cuádriceps 1-2 segundos arriba",
      "Ajusta el respaldo para que las rodillas estén alineadas con el eje de la máquina",
      "Ideal para calentamiento o acabado de pierna",
    ],
    commonMistakes: [
      "Usar impulso para subir",
      "Rodillas mal alineadas con el eje",
      "Soltar el peso de golpe al bajar",
    ],
    videoPrompt:
      "Persona sentada en máquina de extensión de cuádriceps, piernas extendiéndose horizontalmente, vista lateral, gimnasio moderno",
    sets: { beginner: "3×15", intermediate: "3×12", advanced: "4×12" },
    restSeconds: { beginner: 45, intermediate: 60, advanced: 60 },
    tags: ["piernas", "cuádriceps", "aislamiento", "máquina"],
  },

  {
    id: "lying_leg_curl",
    name: "Curl femoral tumbado",
    nameEn: "Lying Leg Curl",
    category: "isolation",
    muscles: {
      primary: ["isquiotibiales"],
      secondary: ["gemelos"],
    },
    equipment: "machine",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "Acuéstate boca abajo en la máquina con los tobillos bajo el rodillo",
      "Flexiona las rodillas llevando los talones hacia los glúteos",
      "Aprieta los isquiotibiales arriba",
      "Baja controladamente",
    ],
    tips: [
      "No levantes la cadera de la almohadilla",
      "Apunta los pies hacia ti (dorsiflexión) para más activación",
      "Contrae 1-2 segundos arriba",
    ],
    commonMistakes: [
      "Levantar la cadera",
      "Rango de movimiento incompleto",
      "Usar impulso",
    ],
    videoPrompt:
      "Atleta acostado boca abajo en máquina de curl femoral, talones subiendo hacia glúteos, vista lateral, gimnasio profesional",
    sets: { beginner: "3×12", intermediate: "3×10", advanced: "4×10" },
    restSeconds: { beginner: 45, intermediate: 60, advanced: 60 },
    tags: ["piernas", "isquiotibiales", "aislamiento", "máquina"],
  },

  {
    id: "seated_leg_curl",
    name: "Curl femoral sentado",
    nameEn: "Seated Leg Curl",
    category: "isolation",
    muscles: {
      primary: ["isquiotibiales"],
      secondary: ["gemelos"],
    },
    equipment: "machine",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "Siéntate en la máquina con las piernas sobre el rodillo superior y detrás del inferior",
      "Ajusta la almohadilla del muslo para mantener las piernas fijas",
      "Flexiona las rodillas empujando el rodillo hacia abajo y atrás",
      "Regresa controladamente a la posición inicial",
    ],
    tips: [
      "Mantén la espalda apoyada en el respaldo",
      "No uses impulso del cuerpo",
      "Aprieta los isquiotibiales en la contracción máxima",
    ],
    commonMistakes: [
      "Rango de movimiento incompleto",
      "Soltar el peso de golpe",
      "Incorporarse del respaldo",
    ],
    videoPrompt:
      "Persona sentada en máquina de curl femoral, flexionando piernas hacia abajo, vista lateral, gimnasio moderno",
    sets: { beginner: "3×12", intermediate: "3×10", advanced: "4×10" },
    restSeconds: { beginner: 45, intermediate: 60, advanced: 60 },
    tags: ["piernas", "isquiotibiales", "aislamiento", "máquina"],
  },

  {
    id: "conventional_deadlift",
    name: "Peso muerto convencional",
    nameEn: "Conventional Deadlift",
    category: "compound",
    muscles: {
      primary: ["isquiotibiales", "gluteoMayor", "erectoresEspinales"],
      secondary: ["cuadriceps", "trapecio", "antebrazo", "dorsalAncho"],
    },
    equipment: "barbell",
    mechanic: "pull",
    force: "pull",
    level: "intermediate",
    instructions: [
      "Pies a la anchura de las caderas, barra sobre el medio del pie",
      "Agarra la barra justo fuera de las piernas",
      "Pecho alto, espalda neutra, tira de la barra pegada al cuerpo",
      "Extiende caderas y rodillas simultáneamente hasta posición erguida",
    ],
    tips: [
      "La barra debe viajar en línea recta vertical",
      "Aprieta los dorsales antes de tirar",
      "No hiperextiendas la espalda arriba",
    ],
    commonMistakes: [
      "Redondear la espalda",
      "Barra lejos del cuerpo",
      "Caderas que suben antes que los hombros",
    ],
    videoPrompt:
      "Atleta realizando peso muerto convencional con barra olímpica, espalda neutra, barra pegada al cuerpo, vista lateral, gimnasio de powerlifting, iluminación cinematográfica",
    sets: { beginner: "3×8", intermediate: "4×6", advanced: "5×5" },
    restSeconds: { beginner: 120, intermediate: 150, advanced: 180 },
    tags: ["piernas", "espalda", "glúteos", "fuerza", "compuesto", "barra"],
  },

  {
    id: "romanian_deadlift",
    name: "Peso muerto rumano",
    nameEn: "Romanian Deadlift",
    category: "compound",
    muscles: {
      primary: ["isquiotibiales", "gluteoMayor"],
      secondary: ["erectoresEspinales", "dorsalAncho"],
    },
    equipment: "barbell",
    mechanic: "pull",
    force: "pull",
    level: "intermediate",
    instructions: [
      "De pie con la barra en las manos, pies a la anchura de las caderas",
      "Con ligera flexión de rodillas, empuja las caderas hacia atrás",
      "Baja la barra por la parte frontal de las piernas",
      "Desciende hasta sentir estiramiento en isquiotibiales, luego regresa",
    ],
    tips: [
      "El movimiento es de bisagra de cadera, no de sentadilla",
      "La barra siempre pegada a las piernas",
      "Mantén la espalda neutra durante todo el movimiento",
    ],
    commonMistakes: [
      "Redondear la espalda baja",
      "Flexionar demasiado las rodillas",
      "Barra alejada del cuerpo",
    ],
    videoPrompt:
      "Persona realizando peso muerto rumano con barra, bisagra de cadera, barra deslizando por las piernas, vista lateral, gimnasio profesional",
    sets: { beginner: "3×10", intermediate: "4×8", advanced: "4×8" },
    restSeconds: { beginner: 90, intermediate: 90, advanced: 120 },
    tags: ["piernas", "isquiotibiales", "glúteos", "barra"],
  },

  {
    id: "sumo_deadlift",
    name: "Peso muerto sumo",
    nameEn: "Sumo Deadlift",
    category: "compound",
    muscles: {
      primary: ["cuadriceps", "gluteoMayor", "aductores"],
      secondary: ["isquiotibiales", "erectoresEspinales", "trapecio"],
    },
    equipment: "barbell",
    mechanic: "pull",
    force: "pull",
    level: "intermediate",
    instructions: [
      "Pies mucho más anchos que los hombros, puntas hacia afuera",
      "Agarra la barra con agarre estrecho entre las piernas",
      "Pecho alto, caderas bajas, empuja el suelo con los pies",
      "Extiende caderas y rodillas simultáneamente",
    ],
    tips: [
      "Empuja las rodillas hacia afuera sobre los pies",
      "Requiere buena movilidad de caderas",
      "Menos estrés en la espalda baja que convencional",
    ],
    commonMistakes: [
      "Rodillas que colapsan hacia adentro",
      "Caderas que suben primero",
      "No mantener el pecho alto",
    ],
    videoPrompt:
      "Atleta realizando peso muerto sumo con stance amplio, agarre estrecho, vista frontal, gimnasio de powerlifting, buena iluminación",
    sets: { beginner: "3×8", intermediate: "4×6", advanced: "5×5" },
    restSeconds: { beginner: 120, intermediate: 150, advanced: 180 },
    tags: ["piernas", "glúteos", "aductores", "fuerza", "compuesto", "barra"],
  },

  {
    id: "hip_thrust",
    name: "Hip thrust con barra",
    nameEn: "Barbell Hip Thrust",
    category: "compound",
    muscles: {
      primary: ["gluteoMayor"],
      secondary: ["isquiotibiales", "cuadriceps", "rectoAbdominal"],
    },
    equipment: "barbell",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "Apoya la parte superior de la espalda en un banco",
      "Coloca la barra sobre las caderas con un pad",
      "Pies a la anchura de los hombros, planos en el suelo",
      "Empuja las caderas hacia arriba hasta extensión completa y aprieta glúteos",
    ],
    tips: [
      "Mentón al pecho al subir para evitar hiperextensión lumbar",
      "Aprieta los glúteos 2 segundos arriba",
      "Las espinillas deben quedar verticales arriba",
    ],
    commonMistakes: [
      "Hiperextender la espalda baja",
      "Pies demasiado lejos o cerca del banco",
      "No alcanzar extensión completa de cadera",
    ],
    videoPrompt:
      "Atleta realizando hip thrust con barra y pad, espalda apoyada en banco, extensión completa de cadera, vista lateral, gimnasio moderno",
    sets: { beginner: "3×12", intermediate: "4×10", advanced: "4×8" },
    restSeconds: { beginner: 60, intermediate: 90, advanced: 120 },
    tags: ["piernas", "glúteos", "compuesto", "barra"],
  },

  {
    id: "walking_lunge",
    name: "Zancadas caminando",
    nameEn: "Walking Lunge",
    category: "compound",
    muscles: {
      primary: ["cuadriceps", "gluteoMayor"],
      secondary: ["isquiotibiales", "gluteoMedio", "rectoAbdominal"],
    },
    equipment: "dumbbell",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "De pie con mancuernas a los lados",
      "Da un paso largo al frente y desciende hasta que la rodilla trasera casi toque el suelo",
      "Empuja con la pierna delantera y avanza con el siguiente paso",
      "Alterna piernas de forma continua",
    ],
    tips: [
      "Mantén el torso erguido",
      "Paso largo para más glúteos, paso corto para más cuádriceps",
      "Rodilla delantera alineada con el pie",
    ],
    commonMistakes: [
      "Paso demasiado corto",
      "Rodilla delantera que sobrepasa el pie",
      "Inclinación excesiva del torso",
    ],
    videoPrompt:
      "Persona realizando zancadas caminando con mancuernas por un pasillo del gimnasio, pasos largos, vista lateral, gimnasio amplio",
    sets: { beginner: "3×10", intermediate: "3×12", advanced: "4×12" },
    restSeconds: { beginner: 60, intermediate: 90, advanced: 90 },
    tags: ["piernas", "glúteos", "compuesto", "mancuernas"],
  },

  {
    id: "reverse_lunge",
    name: "Zancada inversa",
    nameEn: "Reverse Lunge",
    category: "compound",
    muscles: {
      primary: ["cuadriceps", "gluteoMayor"],
      secondary: ["isquiotibiales", "gluteoMedio"],
    },
    equipment: "dumbbell",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "De pie con mancuernas a los lados",
      "Da un paso hacia atrás y desciende hasta que la rodilla trasera casi toque el suelo",
      "Empuja con la pierna delantera para regresar a la posición inicial",
      "Repite con la misma pierna o alterna",
    ],
    tips: [
      "Menos estrés en las rodillas que la zancada frontal",
      "Mantén el torso vertical",
      "Ideal para quienes tienen problemas de rodilla",
    ],
    commonMistakes: [
      "Inclinarse hacia adelante",
      "Paso demasiado corto hacia atrás",
      "Perder el equilibrio",
    ],
    videoPrompt:
      "Atleta realizando zancada inversa con mancuernas, paso hacia atrás controlado, vista lateral, gimnasio moderno",
    sets: { beginner: "3×10", intermediate: "3×12", advanced: "4×10" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 90 },
    tags: ["piernas", "glúteos", "compuesto", "mancuernas"],
  },

  {
    id: "standing_calf_raise",
    name: "Elevación de gemelos de pie",
    nameEn: "Standing Calf Raise",
    category: "isolation",
    muscles: {
      primary: ["gemelos"],
      secondary: ["soleo"],
    },
    equipment: "machine",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Colócate en la máquina de gemelos con los hombros bajo las almohadillas",
      "Punta de los pies en el borde de la plataforma, talones colgando",
      "Elévate sobre las puntas de los pies lo más alto posible",
      "Baja controladamente estirando los gemelos abajo",
    ],
    tips: [
      "Rango completo de movimiento: baja y sube al máximo",
      "Pausa 1-2 segundos arriba",
      "Piernas rectas para enfatizar gastrocnemio",
    ],
    commonMistakes: [
      "Rango de movimiento parcial",
      "Velocidad excesiva sin control",
      "Flexionar las rodillas",
    ],
    videoPrompt:
      "Persona en máquina de elevación de gemelos de pie, subiendo sobre las puntas de los pies, vista lateral, enfoque en pantorrillas, gimnasio moderno",
    sets: { beginner: "3×15", intermediate: "4×12", advanced: "5×15" },
    restSeconds: { beginner: 45, intermediate: 45, advanced: 60 },
    tags: ["piernas", "gemelos", "aislamiento", "máquina"],
  },

  {
    id: "seated_calf_raise",
    name: "Elevación de gemelos sentado",
    nameEn: "Seated Calf Raise",
    category: "isolation",
    muscles: {
      primary: ["soleo"],
      secondary: ["gemelos"],
    },
    equipment: "machine",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Siéntate en la máquina con las rodillas bajo la almohadilla",
      "Puntas de los pies en la plataforma, talones colgando",
      "Eleva los talones lo más alto posible",
      "Baja controladamente hasta sentir estiramiento",
    ],
    tips: [
      "Con rodillas flexionadas enfatiza el sóleo sobre el gastrocnemio",
      "Complementa el trabajo de gemelos de pie",
      "Rango completo arriba y abajo",
    ],
    commonMistakes: [
      "Movimiento parcial",
      "Rebotar abajo sin control",
      "Usar impulso",
    ],
    videoPrompt:
      "Atleta sentado en máquina de gemelos, elevando talones con rodillas flexionadas, vista lateral, gimnasio profesional",
    sets: { beginner: "3×15", intermediate: "4×12", advanced: "5×15" },
    restSeconds: { beginner: 45, intermediate: 45, advanced: 60 },
    tags: ["piernas", "sóleo", "gemelos", "aislamiento", "máquina"],
  },

  {
    id: "leg_press_calf_raise",
    name: "Gemelos en prensa",
    nameEn: "Leg Press Calf Raise",
    category: "isolation",
    muscles: {
      primary: ["gemelos", "soleo"],
      secondary: [],
    },
    equipment: "machine",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Colócate en la prensa con solo las puntas de los pies en el borde de la plataforma",
      "Piernas casi completamente extendidas",
      "Empuja la plataforma con las puntas de los pies",
      "Deja que los talones desciendan para estirar los gemelos",
    ],
    tips: [
      "No bloquees las rodillas",
      "Rango completo de movimiento",
      "Permite cargar mucho peso de forma segura",
    ],
    commonMistakes: [
      "Bloquear las rodillas",
      "Rango parcial",
      "Pies deslizándose de la plataforma",
    ],
    videoPrompt:
      "Persona en prensa de piernas haciendo elevación de gemelos con puntas de pies en el borde, vista lateral, gimnasio moderno",
    sets: { beginner: "3×15", intermediate: "4×12", advanced: "5×15" },
    restSeconds: { beginner: 45, intermediate: 45, advanced: 60 },
    tags: ["piernas", "gemelos", "aislamiento", "máquina"],
  },

  {
    id: "hip_abduction_machine",
    name: "Abducción de cadera en máquina",
    nameEn: "Hip Abduction Machine",
    category: "isolation",
    muscles: {
      primary: ["gluteoMedio", "abductores"],
      secondary: ["gluteoMayor"],
    },
    equipment: "machine",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Siéntate en la máquina con las piernas contra las almohadillas internas",
      "Abre las piernas empujando las almohadillas hacia afuera",
      "Mantén la contracción 1-2 segundos en la máxima apertura",
      "Regresa controladamente",
    ],
    tips: [
      "Mantén la espalda apoyada",
      "Contrae los glúteos al abrir",
      "Ideal para activación de glúteo medio",
    ],
    commonMistakes: [
      "Usar impulso",
      "Rango de movimiento parcial",
      "Inclinarse hacia los lados",
    ],
    videoPrompt:
      "Persona sentada en máquina de abducción de cadera, abriendo piernas contra resistencia, vista frontal, gimnasio moderno",
    sets: { beginner: "3×15", intermediate: "3×12", advanced: "4×12" },
    restSeconds: { beginner: 45, intermediate: 45, advanced: 60 },
    tags: ["piernas", "glúteos", "abductores", "aislamiento", "máquina"],
  },

  {
    id: "hip_adduction_machine",
    name: "Aducción de cadera en máquina",
    nameEn: "Hip Adduction Machine",
    category: "isolation",
    muscles: {
      primary: ["aductores"],
      secondary: ["gluteoMayor"],
    },
    equipment: "machine",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Siéntate en la máquina con las piernas abiertas contra las almohadillas externas",
      "Cierra las piernas juntándolas contra la resistencia",
      "Mantén la contracción 1-2 segundos con las piernas juntas",
      "Abre controladamente",
    ],
    tips: [
      "Complementa el trabajo de abducción",
      "Mantén la espalda apoyada",
      "Ideal para estabilidad de rodilla y cadera",
    ],
    commonMistakes: [
      "Usar impulso del cuerpo",
      "No completar el rango de movimiento",
      "Soltar el peso de golpe",
    ],
    videoPrompt:
      "Atleta sentada en máquina de aducción de cadera, cerrando piernas contra resistencia, vista frontal, gimnasio profesional",
    sets: { beginner: "3×15", intermediate: "3×12", advanced: "4×12" },
    restSeconds: { beginner: 45, intermediate: 45, advanced: 60 },
    tags: ["piernas", "aductores", "aislamiento", "máquina"],
  },

  // ==========================================================================
  // CORE (12 ejercicios)
  // ==========================================================================

  {
    id: "plank",
    name: "Plancha frontal",
    nameEn: "Plank",
    category: "isolation",
    muscles: {
      primary: ["rectoAbdominal", "transverso"],
      secondary: ["oblicuos", "erectores", "deltoidesAnterior"],
    },
    equipment: "bodyweight",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Apóyate en antebrazos y puntas de los pies",
      "Cuerpo en línea recta de cabeza a talones",
      "Aprieta abdomen, glúteos y cuádriceps",
      "Mantén la posición el tiempo indicado",
    ],
    tips: [
      "No dejes que la cadera caiga o se eleve",
      "Respira de forma constante, no contengas la respiración",
      "Mira al suelo para mantener el cuello neutro",
    ],
    commonMistakes: [
      "Cadera que cae hacia el suelo",
      "Cadera elevada en forma de tienda",
      "Contener la respiración",
    ],
    videoPrompt:
      "Persona en posición de plancha frontal sobre antebrazos, cuerpo en línea recta, vista lateral, gimnasio moderno con buena iluminación",
    sets: { beginner: "3×30s", intermediate: "3×45s", advanced: "3×60s" },
    restSeconds: { beginner: 45, intermediate: 60, advanced: 60 },
    tags: ["core", "abdominales", "isométrico", "peso corporal"],
  },

  {
    id: "side_plank",
    name: "Plancha lateral",
    nameEn: "Side Plank",
    category: "isolation",
    muscles: {
      primary: ["oblicuos"],
      secondary: ["rectoAbdominal", "transverso", "gluteoMedio"],
    },
    equipment: "bodyweight",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Acuéstate de lado apoyándote en el antebrazo y el pie inferior",
      "Eleva la cadera hasta que el cuerpo forme una línea recta",
      "Mantén la posición el tiempo indicado",
      "Repite del otro lado",
    ],
    tips: [
      "Codo directamente debajo del hombro",
      "Apila los pies o coloca el superior adelante para más estabilidad",
      "Activa el glúteo medio para estabilizar la cadera",
    ],
    commonMistakes: [
      "Cadera que cae",
      "Rotar el torso hacia adelante o atrás",
      "Hombro que colapsa",
    ],
    videoPrompt:
      "Atleta en posición de plancha lateral sobre antebrazo, cuerpo en línea recta, vista frontal, gimnasio profesional",
    sets: { beginner: "3×20s", intermediate: "3×30s", advanced: "3×45s" },
    restSeconds: { beginner: 45, intermediate: 45, advanced: 60 },
    tags: ["core", "oblicuos", "isométrico", "peso corporal"],
  },

  {
    id: "plank_shoulder_tap",
    name: "Plancha con toque de hombro",
    nameEn: "Plank Shoulder Tap",
    category: "compound",
    muscles: {
      primary: ["rectoAbdominal", "transverso", "oblicuos"],
      secondary: ["deltoidesAnterior"],
    },
    equipment: "bodyweight",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "Posición de plancha alta sobre las manos",
      "Levanta una mano y toca el hombro opuesto",
      "Regresa la mano al suelo y repite con la otra",
      "Minimiza la rotación de la cadera",
    ],
    tips: [
      "Separa los pies para mayor estabilidad",
      "El objetivo es no rotar las caderas",
      "Mantén el core tenso todo el tiempo",
    ],
    commonMistakes: [
      "Rotación excesiva de la cadera",
      "Velocidad excesiva sin control",
      "Pies demasiado juntos",
    ],
    videoPrompt:
      "Persona en plancha alta tocando hombros alternados con mínima rotación de cadera, vista frontal, gimnasio moderno",
    sets: { beginner: "3×10", intermediate: "3×16", advanced: "4×20" },
    restSeconds: { beginner: 45, intermediate: 60, advanced: 60 },
    tags: ["core", "abdominales", "anti-rotación", "peso corporal"],
  },

  {
    id: "crunch",
    name: "Crunch abdominal",
    nameEn: "Crunch",
    category: "isolation",
    muscles: {
      primary: ["rectoAbdominal"],
      secondary: ["oblicuos"],
    },
    equipment: "bodyweight",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "Acuéstate boca arriba con rodillas flexionadas, pies en el suelo",
      "Manos detrás de la cabeza sin jalar el cuello",
      "Eleva los hombros del suelo contrayendo el abdomen",
      "Baja controladamente sin apoyar completamente la espalda",
    ],
    tips: [
      "Piensa en acercar las costillas a la cadera",
      "No jales el cuello con las manos",
      "Exhala al subir, inhala al bajar",
    ],
    commonMistakes: [
      "Tirar del cuello con las manos",
      "Usar impulso en lugar de los abdominales",
      "Subir demasiado (no es un sit-up)",
    ],
    videoPrompt:
      "Persona acostada realizando crunch abdominal, elevando hombros del suelo, manos detrás de la cabeza, vista lateral, gimnasio moderno",
    sets: { beginner: "3×15", intermediate: "3×20", advanced: "4×25" },
    restSeconds: { beginner: 30, intermediate: 45, advanced: 45 },
    tags: ["core", "abdominales", "aislamiento", "peso corporal"],
  },

  {
    id: "bicycle_crunch",
    name: "Crunch bicicleta",
    nameEn: "Bicycle Crunch",
    category: "isolation",
    muscles: {
      primary: ["rectoAbdominal", "oblicuos"],
      secondary: ["transverso"],
    },
    equipment: "bodyweight",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "Acuéstate boca arriba con manos detrás de la cabeza",
      "Eleva los hombros y lleva un codo hacia la rodilla opuesta",
      "Extiende la pierna contraria mientras rotas el torso",
      "Alterna de forma continua como pedaleando",
    ],
    tips: [
      "Excelente activación de oblicuos",
      "Movimiento controlado, no rápido",
      "Mantén la espalda baja pegada al suelo",
    ],
    commonMistakes: [
      "Velocidad excesiva sin control",
      "Jalar el cuello",
      "Mover solo los codos sin rotar el torso",
    ],
    videoPrompt:
      "Atleta realizando crunch bicicleta, rotación de torso alternando codo a rodilla opuesta, vista cenital, gimnasio profesional",
    sets: { beginner: "3×12", intermediate: "3×20", advanced: "4×20" },
    restSeconds: { beginner: 30, intermediate: 45, advanced: 45 },
    tags: ["core", "oblicuos", "abdominales", "peso corporal"],
  },

  {
    id: "hanging_leg_raise",
    name: "Elevación de piernas colgado",
    nameEn: "Hanging Leg Raise",
    category: "isolation",
    muscles: {
      primary: ["rectoAbdominal"],
      secondary: ["oblicuos", "transverso", "antebrazo"],
    },
    equipment: "barFija",
    mechanic: "pull",
    force: "pull",
    level: "intermediate",
    instructions: [
      "Cuélgate de una barra con agarre prono, brazos extendidos",
      "Eleva las piernas rectas hasta la horizontal o más arriba",
      "Controla la bajada sin balanceo",
      "Evita impulso del cuerpo",
    ],
    tips: [
      "Si es muy difícil, flexiona las rodillas",
      "Inclina la pelvis al final del movimiento para mayor contracción",
      "Minimiza el balanceo del cuerpo",
    ],
    commonMistakes: [
      "Usar impulso y balanceo",
      "No elevar la pelvis al final",
      "Piernas demasiado flexionadas",
    ],
    videoPrompt:
      "Persona colgada de barra elevando piernas rectas hasta la horizontal, vista lateral, gimnasio con barra de dominadas",
    sets: { beginner: "3×8", intermediate: "3×12", advanced: "4×15" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 60 },
    tags: ["core", "abdominales", "aislamiento", "barra fija"],
  },

  {
    id: "lying_leg_raise",
    name: "Elevación de piernas acostado",
    nameEn: "Lying Leg Raise",
    category: "isolation",
    muscles: {
      primary: ["rectoAbdominal"],
      secondary: ["oblicuos", "transverso"],
    },
    equipment: "bodyweight",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "Acuéstate boca arriba con piernas extendidas y manos bajo los glúteos",
      "Eleva las piernas rectas hasta 90 grados",
      "Baja controladamente sin tocar el suelo",
      "Mantén la espalda baja pegada al suelo",
    ],
    tips: [
      "Si la espalda baja se despega, no bajes tanto las piernas",
      "Exhala al subir, inhala al bajar",
      "Progresa desde rodillas flexionadas a piernas rectas",
    ],
    commonMistakes: [
      "Espalda baja que se despega del suelo",
      "Usar impulso",
      "Dejar caer las piernas de golpe",
    ],
    videoPrompt:
      "Atleta acostado boca arriba elevando piernas rectas hasta 90 grados, manos bajo glúteos, vista lateral, gimnasio moderno",
    sets: { beginner: "3×10", intermediate: "3×15", advanced: "4×20" },
    restSeconds: { beginner: 30, intermediate: 45, advanced: 45 },
    tags: ["core", "abdominales", "aislamiento", "peso corporal"],
  },

  {
    id: "russian_twist",
    name: "Giro ruso (Russian twist)",
    nameEn: "Russian Twist",
    category: "isolation",
    muscles: {
      primary: ["oblicuos"],
      secondary: ["rectoAbdominal", "transverso"],
    },
    equipment: "bodyweight",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "Siéntate con rodillas flexionadas, pies ligeramente elevados del suelo",
      "Inclina el torso hacia atrás unos 45 grados",
      "Rota el torso llevando las manos (o peso) de un lado al otro",
      "Mantén el core activado y los pies elevados",
    ],
    tips: [
      "Añade peso (mancuerna, balón medicinal) para mayor dificultad",
      "La rotación viene del torso, no de los brazos",
      "Mantén los pies elevados para más activación del core",
    ],
    commonMistakes: [
      "Solo mover los brazos sin rotar el torso",
      "Redondear la espalda",
      "Velocidad excesiva",
    ],
    videoPrompt:
      "Persona sentada con torso inclinado realizando giros rusos con balón medicinal, pies elevados, vista frontal, gimnasio moderno",
    sets: { beginner: "3×20", intermediate: "3×30", advanced: "4×30" },
    restSeconds: { beginner: 30, intermediate: 45, advanced: 45 },
    tags: ["core", "oblicuos", "aislamiento", "peso corporal"],
  },

  {
    id: "ab_wheel_rollout",
    name: "Rueda abdominal (Ab wheel rollout)",
    nameEn: "Ab Wheel Rollout",
    category: "isolation",
    muscles: {
      primary: ["rectoAbdominal", "transverso"],
      secondary: ["oblicuos", "dorsalAncho", "erectores"],
    },
    equipment: "none",
    mechanic: "pull",
    force: "pull",
    level: "intermediate",
    instructions: [
      "Arrodíllate sosteniendo la rueda abdominal con ambas manos",
      "Rueda hacia adelante extendiendo el cuerpo lo más posible",
      "Mantén el core apretado y la espalda neutra",
      "Regresa a la posición inicial contrayendo el abdomen",
    ],
    tips: [
      "Empieza con rango corto y progresa",
      "No dejes que la cadera caiga",
      "Aprieta los glúteos para proteger la espalda",
    ],
    commonMistakes: [
      "Colapsar la cadera hacia el suelo",
      "No mantener la espalda neutra",
      "Rango excesivo antes de tener la fuerza necesaria",
    ],
    videoPrompt:
      "Atleta arrodillado usando rueda abdominal, extendiéndose hacia adelante con control, vista lateral, gimnasio profesional",
    sets: { beginner: "3×8", intermediate: "3×12", advanced: "4×15" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 60 },
    tags: ["core", "abdominales", "aislamiento"],
  },

  {
    id: "pallof_press",
    name: "Pallof press",
    nameEn: "Pallof Press",
    category: "isolation",
    muscles: {
      primary: ["oblicuos", "transverso"],
      secondary: ["rectoAbdominal"],
    },
    equipment: "cable",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "De pie de lado a la polea a la altura del pecho",
      "Agarra el mango con ambas manos contra el pecho",
      "Extiende los brazos al frente resistiendo la rotación",
      "Regresa las manos al pecho y repite",
    ],
    tips: [
      "Excelente ejercicio anti-rotación",
      "No permitas que el cable rote tu torso",
      "Mantén los pies a la anchura de los hombros",
    ],
    commonMistakes: [
      "Permitir la rotación del torso",
      "Inclinarse hacia la polea",
      "Brazos que no se extienden completamente",
    ],
    videoPrompt:
      "Persona de pie realizando Pallof press con cable, extendiendo brazos al frente resistiendo rotación, vista frontal, gimnasio moderno",
    sets: { beginner: "3×10", intermediate: "3×12", advanced: "4×12" },
    restSeconds: { beginner: 45, intermediate: 45, advanced: 60 },
    tags: ["core", "anti-rotación", "cable"],
  },

  {
    id: "dead_bug",
    name: "Dead bug",
    nameEn: "Dead Bug",
    category: "isolation",
    muscles: {
      primary: ["rectoAbdominal", "transverso"],
      secondary: ["oblicuos"],
    },
    equipment: "bodyweight",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Acuéstate boca arriba con brazos extendidos hacia el techo y rodillas a 90 grados",
      "Extiende un brazo detrás de la cabeza y la pierna opuesta al frente simultáneamente",
      "Mantén la espalda baja pegada al suelo",
      "Regresa a la posición inicial y alterna",
    ],
    tips: [
      "La espalda baja NUNCA debe despegarse del suelo",
      "Movimiento lento y controlado",
      "Excelente para activación de core profundo",
    ],
    commonMistakes: [
      "Espalda baja que se arquea",
      "Movimiento demasiado rápido",
      "No coordinar brazo y pierna opuestos",
    ],
    videoPrompt:
      "Atleta acostado boca arriba realizando dead bug, extendiendo brazo y pierna opuestos, vista lateral, gimnasio moderno",
    sets: { beginner: "3×10", intermediate: "3×16", advanced: "4×20" },
    restSeconds: { beginner: 30, intermediate: 45, advanced: 45 },
    tags: ["core", "abdominales", "estabilización", "peso corporal"],
  },

  {
    id: "cable_woodchop",
    name: "Leñador con cable (Woodchop)",
    nameEn: "Cable Woodchop",
    category: "compound",
    muscles: {
      primary: ["oblicuos"],
      secondary: ["rectoAbdominal", "transverso", "deltoidesAnterior"],
    },
    equipment: "cable",
    mechanic: "pull",
    force: "pull",
    level: "intermediate",
    instructions: [
      "Coloca la polea alta y agarra el mango con ambas manos",
      "De pie de lado a la máquina, brazos extendidos",
      "Rota el torso llevando las manos diagonalmente hacia abajo y al lado opuesto",
      "Regresa controladamente y repite",
    ],
    tips: [
      "La rotación viene de la cadera y el torso, no de los brazos",
      "Mantén los brazos extendidos como palanca",
      "También puede hacerse de bajo a alto",
    ],
    commonMistakes: [
      "Solo mover los brazos sin rotar el torso",
      "Flexionar los brazos",
      "Peso excesivo",
    ],
    videoPrompt:
      "Persona de pie realizando woodchop con cable desde polea alta, rotación diagonal del torso, vista frontal, gimnasio profesional",
    sets: { beginner: "3×12", intermediate: "3×12", advanced: "4×10" },
    restSeconds: { beginner: 45, intermediate: 60, advanced: 60 },
    tags: ["core", "oblicuos", "rotación", "cable"],
  },

  // ==========================================================================
  // CARDIO / FUNCIONAL (15 ejercicios)
  // ==========================================================================

  {
    id: "burpee",
    name: "Burpee",
    nameEn: "Burpee",
    category: "cardio",
    muscles: {
      primary: ["cuadriceps", "pectoralMayor", "deltoidesAnterior"],
      secondary: ["rectoAbdominal", "triceps", "gluteoMayor", "isquiotibiales"],
    },
    equipment: "bodyweight",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "De pie, baja a posición de sentadilla y coloca las manos en el suelo",
      "Lanza los pies hacia atrás quedando en posición de flexión",
      "Realiza una flexión completa",
      "Trae los pies de vuelta y salta explosivamente con brazos arriba",
    ],
    tips: [
      "Mantén el core activado durante todo el movimiento",
      "Aterriza suavemente del salto",
      "Modifica eliminando la flexión o el salto si es necesario",
    ],
    commonMistakes: [
      "Omitir la flexión completa",
      "Aterrizar con las rodillas bloqueadas",
      "No completar la extensión del salto",
    ],
    videoPrompt:
      "Atleta realizando burpee completo: sentadilla, flexión, salto explosivo, secuencia fluida, vista lateral, gimnasio funcional con buena iluminación",
    sets: { beginner: "3×8", intermediate: "4×12", advanced: "5×15" },
    restSeconds: { beginner: 60, intermediate: 45, advanced: 30 },
    tags: ["cardio", "funcional", "cuerpo completo", "peso corporal"],
  },

  {
    id: "mountain_climber",
    name: "Escaladores (Mountain climbers)",
    nameEn: "Mountain Climbers",
    category: "cardio",
    muscles: {
      primary: ["rectoAbdominal", "cuadriceps"],
      secondary: ["deltoidesAnterior", "gluteoMayor", "oblicuos"],
    },
    equipment: "bodyweight",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Posición de plancha alta con brazos extendidos",
      "Lleva una rodilla hacia el pecho de forma rápida",
      "Regresa la pierna y alterna con la otra",
      "Mantén un ritmo constante y caderas estables",
    ],
    tips: [
      "No eleves demasiado la cadera",
      "Mantén los hombros sobre las manos",
      "Aumenta la velocidad progresivamente",
    ],
    commonMistakes: [
      "Cadera que se eleva excesivamente",
      "Hombros que se desplazan hacia adelante",
      "No llevar la rodilla suficientemente al pecho",
    ],
    videoPrompt:
      "Persona en posición de plancha alta realizando mountain climbers rápidos, alternando rodillas al pecho, vista lateral, gimnasio funcional",
    sets: { beginner: "3×20s", intermediate: "4×30s", advanced: "4×45s" },
    restSeconds: { beginner: 45, intermediate: 30, advanced: 20 },
    tags: ["cardio", "core", "funcional", "peso corporal"],
  },

  {
    id: "box_jump",
    name: "Salto al cajón (Box jump)",
    nameEn: "Box Jump",
    category: "plyometric",
    muscles: {
      primary: ["cuadriceps", "gluteoMayor", "gemelos"],
      secondary: ["isquiotibiales", "rectoAbdominal"],
    },
    equipment: "box",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "De pie frente a un cajón pliométrico a distancia apropiada",
      "Flexiona caderas y rodillas en posición de cuarto de sentadilla",
      "Salta explosivamente aterrizando suavemente sobre el cajón",
      "Baja de forma controlada (no saltes hacia atrás) y repite",
    ],
    tips: [
      "Aterriza suavemente con rodillas flexionadas",
      "Usa los brazos para generar impulso",
      "Empieza con cajón bajo y progresa",
    ],
    commonMistakes: [
      "Aterrizar con rodillas rígidas",
      "Saltar del cajón hacia atrás (riesgo de Aquiles)",
      "Cajón demasiado alto para el nivel",
    ],
    videoPrompt:
      "Atleta realizando box jump sobre cajón pliométrico, despegue y aterrizaje suave, vista lateral, gimnasio funcional con buena iluminación",
    sets: { beginner: "3×5", intermediate: "4×8", advanced: "5×10" },
    restSeconds: { beginner: 90, intermediate: 60, advanced: 45 },
    tags: ["pliometría", "piernas", "explosividad", "funcional"],
  },

  {
    id: "battle_ropes",
    name: "Cuerdas de batalla (Battle ropes)",
    nameEn: "Battle Ropes",
    category: "cardio",
    muscles: {
      primary: ["deltoidesAnterior", "deltoidesLateral", "antebrazo"],
      secondary: ["rectoAbdominal", "biceps", "cuadriceps"],
    },
    equipment: "none",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "De pie con pies a la anchura de los hombros, rodillas ligeramente flexionadas",
      "Agarra un extremo de la cuerda con cada mano",
      "Crea ondas alternando brazos de forma rápida y explosiva",
      "Mantén el core activado y la posición estable",
    ],
    tips: [
      "Varía el patrón: alterno, simultáneo, lateral",
      "Mantén la posición baja con rodillas flexionadas",
      "Las ondas deben llegar hasta el punto de anclaje",
    ],
    commonMistakes: [
      "Ponerse de pie completamente",
      "Ondas que no llegan al punto de anclaje",
      "Usar solo los brazos sin involucrar el core",
    ],
    videoPrompt:
      "Persona de pie creando ondas con cuerdas de batalla, movimiento alterno de brazos, vista frontal, gimnasio funcional con buena iluminación",
    sets: { beginner: "3×20s", intermediate: "4×30s", advanced: "5×40s" },
    restSeconds: { beginner: 60, intermediate: 45, advanced: 30 },
    tags: ["cardio", "hombros", "funcional", "intervalos"],
  },

  {
    id: "sled_push",
    name: "Empuje de trineo (Sled push)",
    nameEn: "Sled Push",
    category: "cardio",
    muscles: {
      primary: ["cuadriceps", "gluteoMayor", "gemelos"],
      secondary: ["rectoAbdominal", "deltoidesAnterior", "isquiotibiales"],
    },
    equipment: "sled",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "Agarra las barras del trineo con brazos extendidos",
      "Inclina el torso hacia adelante a unos 45 grados",
      "Empuja con fuerza avanzando paso a paso",
      "Mantén una cadencia constante hasta la distancia marcada",
    ],
    tips: [
      "Empuja desde las piernas, no desde los brazos",
      "Pasos cortos y rápidos para velocidad, largos para fuerza",
      "Mantén el torso inclinado y el core activado",
    ],
    commonMistakes: [
      "Torso demasiado erguido",
      "Pasos demasiado largos perdiendo tracción",
      "Empujar solo con los brazos",
    ],
    videoPrompt:
      "Atleta empujando trineo cargado por el piso del gimnasio, torso inclinado, piernas empujando, vista lateral, gimnasio funcional",
    sets: { beginner: "3×20m", intermediate: "4×30m", advanced: "5×40m" },
    restSeconds: { beginner: 90, intermediate: 60, advanced: 45 },
    tags: ["cardio", "piernas", "funcional", "trineo"],
  },

  {
    id: "farmer_walk",
    name: "Caminata del granjero (Farmer walk)",
    nameEn: "Farmer Walk",
    category: "compound",
    muscles: {
      primary: ["antebrazo", "trapecio"],
      secondary: ["rectoAbdominal", "oblicuos", "cuadriceps", "gluteoMayor"],
    },
    equipment: "dumbbell",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "Levanta mancuernas o kettlebells pesados a los lados",
      "Mantén el torso erguido, hombros atrás y abajo",
      "Camina con pasos cortos y controlados",
      "Mantén la distancia o tiempo indicado",
    ],
    tips: [
      "Agarre fuerte, no uses straps para trabajar el agarre",
      "Pasos cortos y rápidos",
      "Mantén la mirada al frente y el core apretado",
    ],
    commonMistakes: [
      "Inclinarse hacia los lados",
      "Pasos demasiado largos",
      "Hombros que se encogen",
    ],
    videoPrompt:
      "Persona caminando con mancuernas pesadas a los lados del cuerpo, torso erguido, pasos controlados, vista frontal, gimnasio funcional amplio",
    sets: { beginner: "3×30m", intermediate: "4×40m", advanced: "4×50m" },
    restSeconds: { beginner: 90, intermediate: 60, advanced: 60 },
    tags: ["funcional", "agarre", "core", "mancuernas"],
  },

  {
    id: "rowing_machine",
    name: "Remo ergómetro",
    nameEn: "Rowing Machine",
    category: "cardio",
    muscles: {
      primary: ["dorsalAncho", "cuadriceps", "gluteoMayor"],
      secondary: ["biceps", "trapecio", "rectoAbdominal", "isquiotibiales"],
    },
    equipment: "machine",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "Siéntate con los pies sujetos en las plataformas",
      "Agarra el mango con agarre prono, brazos extendidos",
      "Empuja con las piernas primero, luego inclina el torso y finalmente tira con los brazos",
      "Regresa en orden inverso: brazos, torso, piernas",
    ],
    tips: [
      "Secuencia: piernas-torso-brazos al tirar, brazos-torso-piernas al regresar",
      "Mantén la espalda neutra durante todo el movimiento",
      "No jales solo con los brazos",
    ],
    commonMistakes: [
      "Tirar solo con los brazos",
      "No usar las piernas suficientemente",
      "Redondear la espalda",
    ],
    videoPrompt:
      "Atleta en remo ergómetro Concept2, secuencia completa de remada, vista lateral, gimnasio funcional con buena iluminación",
    sets: { beginner: "3×500m", intermediate: "4×500m", advanced: "5×500m" },
    restSeconds: { beginner: 120, intermediate: 90, advanced: 60 },
    tags: ["cardio", "cuerpo completo", "máquina", "funcional"],
  },

  {
    id: "assault_bike",
    name: "Bicicleta de asalto (Assault bike)",
    nameEn: "Assault Bike",
    category: "cardio",
    muscles: {
      primary: ["cuadriceps", "gluteoMayor"],
      secondary: ["isquiotibiales", "deltoidesAnterior", "biceps", "triceps", "rectoAbdominal"],
    },
    equipment: "machine",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Siéntate en la bicicleta de asalto y ajusta el asiento",
      "Agarra los mangos y empieza a pedalear",
      "Empuja y tira de los mangos coordinando con el pedaleo",
      "Mantén un ritmo constante o realiza intervalos",
    ],
    tips: [
      "Usa tanto piernas como brazos para mayor gasto calórico",
      "Ideal para intervalos de alta intensidad",
      "Ajusta la resistencia según el objetivo",
    ],
    commonMistakes: [
      "Solo usar las piernas ignorando los brazos",
      "Asiento mal ajustado",
      "Ritmo inconsistente",
    ],
    videoPrompt:
      "Persona pedaleando intensamente en assault bike, usando brazos y piernas, vista lateral, gimnasio funcional",
    sets: { beginner: "3×30s", intermediate: "5×30s", advanced: "8×30s" },
    restSeconds: { beginner: 90, intermediate: 60, advanced: 30 },
    tags: ["cardio", "intervalos", "cuerpo completo", "máquina"],
  },

  {
    id: "jump_rope",
    name: "Saltar la cuerda",
    nameEn: "Jump Rope",
    category: "cardio",
    muscles: {
      primary: ["gemelos", "soleo"],
      secondary: ["cuadriceps", "deltoidesAnterior", "antebrazo", "rectoAbdominal"],
    },
    equipment: "none",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Sujeta la cuerda con ambas manos, codos pegados al torso",
      "Salta sobre las puntas de los pies con saltos pequeños",
      "Gira la cuerda con las muñecas, no con los brazos",
      "Mantén un ritmo constante y controlado",
    ],
    tips: [
      "Saltos pequeños, solo lo suficiente para que pase la cuerda",
      "Muñecas activas, hombros relajados",
      "Progresa a dobles, cruces y otros trucos",
    ],
    commonMistakes: [
      "Saltos demasiado altos",
      "Girar la cuerda con los hombros",
      "Aterrizar con los talones",
    ],
    videoPrompt:
      "Atleta saltando la cuerda con ritmo constante, saltos pequeños, muñecas activas, vista frontal, gimnasio funcional",
    sets: { beginner: "3×1min", intermediate: "4×2min", advanced: "5×3min" },
    restSeconds: { beginner: 60, intermediate: 45, advanced: 30 },
    tags: ["cardio", "gemelos", "coordinación", "funcional"],
  },

  {
    id: "sprint_intervals",
    name: "Sprints por intervalos",
    nameEn: "Sprint Intervals",
    category: "cardio",
    muscles: {
      primary: ["cuadriceps", "gluteoMayor", "isquiotibiales", "gemelos"],
      secondary: ["rectoAbdominal", "oblicuos"],
    },
    equipment: "none",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "Calienta 5-10 minutos con trote suave",
      "Sprint al máximo esfuerzo durante el tiempo indicado",
      "Recuperación activa caminando o trotando",
      "Repite los intervalos según el plan",
    ],
    tips: [
      "Calentamiento completo antes de sprintar",
      "Máximo esfuerzo en cada sprint",
      "La recuperación debe ser activa, no parado",
    ],
    commonMistakes: [
      "No calentar adecuadamente",
      "Sprint de baja intensidad",
      "Recuperación insuficiente entre sprints",
    ],
    videoPrompt:
      "Atleta sprinting a máxima velocidad en pista o pasillo del gimnasio, forma de carrera explosiva, vista lateral, ambiente deportivo",
    sets: { beginner: "6×15s", intermediate: "8×20s", advanced: "10×30s" },
    restSeconds: { beginner: 90, intermediate: 60, advanced: 45 },
    tags: ["cardio", "intervalos", "piernas", "HIIT"],
  },

  {
    id: "sled_pull",
    name: "Tirón de trineo (Sled pull)",
    nameEn: "Sled Pull",
    category: "cardio",
    muscles: {
      primary: ["isquiotibiales", "gluteoMayor", "dorsalAncho"],
      secondary: ["biceps", "trapecio", "rectoAbdominal"],
    },
    equipment: "sled",
    mechanic: "pull",
    force: "pull",
    level: "intermediate",
    instructions: [
      "Sujeta la cuerda o correa del trineo mirando hacia él",
      "Camina hacia atrás tirando del trineo con cada paso",
      "Mantén los brazos extendidos y tira desde las piernas y caderas",
      "Mantén la postura erguida y el core activado",
    ],
    tips: [
      "Empuja con los talones al caminar hacia atrás",
      "Mantén las caderas bajas",
      "Alterna con empuje de trineo para trabajo completo",
    ],
    commonMistakes: [
      "Tirar solo con los brazos",
      "Torso demasiado erguido",
      "Pasos demasiado largos",
    ],
    videoPrompt:
      "Persona caminando hacia atrás tirando de un trineo con cuerda, postura baja, vista lateral, gimnasio funcional",
    sets: { beginner: "3×20m", intermediate: "4×30m", advanced: "5×40m" },
    restSeconds: { beginner: 90, intermediate: 60, advanced: 45 },
    tags: ["cardio", "funcional", "piernas", "trineo"],
  },

  {
    id: "step_up",
    name: "Step up (subida al cajón)",
    nameEn: "Step Up",
    category: "compound",
    muscles: {
      primary: ["cuadriceps", "gluteoMayor"],
      secondary: ["isquiotibiales", "gluteoMedio"],
    },
    equipment: "box",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "De pie frente a un cajón o banco a la altura de la rodilla",
      "Coloca un pie completo sobre el cajón",
      "Empuja con la pierna de arriba para subir",
      "Baja controladamente con la misma pierna o alterna",
    ],
    tips: [
      "Empuja con la pierna de arriba, no te impulses con la de abajo",
      "Mantén el torso erguido",
      "Añade mancuernas para mayor dificultad",
    ],
    commonMistakes: [
      "Impulsarse con la pierna de abajo",
      "Cajón demasiado alto",
      "Inclinarse excesivamente hacia adelante",
    ],
    videoPrompt:
      "Atleta subiendo a un cajón con mancuernas a los lados, una pierna a la vez, vista lateral, gimnasio funcional",
    sets: { beginner: "3×10", intermediate: "3×12", advanced: "4×12" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 60 },
    tags: ["piernas", "glúteos", "funcional", "unilateral"],
  },

  {
    id: "thruster",
    name: "Thruster con barra",
    nameEn: "Barbell Thruster",
    category: "compound",
    muscles: {
      primary: ["cuadriceps", "gluteoMayor", "deltoidesAnterior"],
      secondary: ["triceps", "rectoAbdominal", "isquiotibiales"],
    },
    equipment: "barbell",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "Barra en posición de front squat con codos altos",
      "Desciende en sentadilla frontal profunda",
      "Sube explosivamente y usa el impulso para empujar la barra sobre la cabeza",
      "Baja la barra a los hombros mientras desciendes en la siguiente repetición",
    ],
    tips: [
      "El movimiento es fluido, sin pausa entre sentadilla y press",
      "Usa el impulso de las piernas para el press",
      "Mantén el core activado durante todo el movimiento",
    ],
    commonMistakes: [
      "Hacer sentadilla y press por separado",
      "Codos que caen en el front squat",
      "No usar el impulso de las piernas",
    ],
    videoPrompt:
      "Persona realizando thruster con barra, combinación fluida de sentadilla frontal y press sobre cabeza, vista lateral, gimnasio funcional",
    sets: { beginner: "3×8", intermediate: "4×10", advanced: "5×12" },
    restSeconds: { beginner: 90, intermediate: 60, advanced: 45 },
    tags: ["funcional", "cuerpo completo", "compuesto", "barra"],
  },

  {
    id: "bear_crawl",
    name: "Bear crawl (gateo de oso)",
    nameEn: "Bear Crawl",
    category: "cardio",
    muscles: {
      primary: ["deltoidesAnterior", "cuadriceps", "rectoAbdominal"],
      secondary: ["triceps", "oblicuos", "gluteoMayor"],
    },
    equipment: "bodyweight",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Posición de cuadrupedia con rodillas elevadas del suelo unos centímetros",
      "Avanza moviendo mano derecha y pie izquierdo simultáneamente",
      "Luego mano izquierda y pie derecho",
      "Mantén la espalda plana y las caderas bajas",
    ],
    tips: [
      "Las rodillas deben flotar apenas sobre el suelo",
      "Movimiento contralateral: mano y pie opuestos",
      "Mantén la cadera baja y estable",
    ],
    commonMistakes: [
      "Cadera que se eleva demasiado",
      "Movimiento ipsilateral en lugar de contralateral",
      "Rodillas que tocan el suelo",
    ],
    videoPrompt:
      "Atleta realizando bear crawl avanzando en cuadrupedia con rodillas flotando, vista lateral, gimnasio funcional amplio",
    sets: { beginner: "3×10m", intermediate: "3×20m", advanced: "4×20m" },
    restSeconds: { beginner: 60, intermediate: 45, advanced: 30 },
    tags: ["cardio", "funcional", "core", "peso corporal"],
  },

  {
    id: "wall_ball",
    name: "Wall ball",
    nameEn: "Wall Ball",
    category: "compound",
    muscles: {
      primary: ["cuadriceps", "gluteoMayor", "deltoidesAnterior"],
      secondary: ["rectoAbdominal", "triceps", "isquiotibiales"],
    },
    equipment: "none",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "De pie frente a una pared con balón medicinal contra el pecho",
      "Realiza una sentadilla profunda sosteniendo el balón",
      "Al subir, lanza el balón hacia un punto alto en la pared",
      "Atrapa el balón y desciende directamente a la siguiente repetición",
    ],
    tips: [
      "El movimiento es fluido: sentadilla y lanzamiento son continuos",
      "Apunta a un punto fijo en la pared",
      "Usa el impulso de las piernas para el lanzamiento",
    ],
    commonMistakes: [
      "No bajar suficiente en la sentadilla",
      "Lanzar solo con los brazos",
      "Alejarse demasiado de la pared",
    ],
    videoPrompt:
      "Atleta realizando wall ball, sentadilla profunda seguida de lanzamiento de balón medicinal a la pared, vista lateral, gimnasio funcional",
    sets: { beginner: "3×10", intermediate: "4×15", advanced: "5×20" },
    restSeconds: { beginner: 60, intermediate: 45, advanced: 30 },
    tags: ["cardio", "funcional", "cuerpo completo", "intervalos"],
  },

  // ==========================================================================
  // KETTLEBELL (8 ejercicios)
  // ==========================================================================

  {
    id: "kettlebell_swing",
    name: "Swing con kettlebell",
    nameEn: "Kettlebell Swing",
    category: "compound",
    muscles: {
      primary: ["gluteoMayor", "isquiotibiales"],
      secondary: ["erectoresEspinales", "deltoidesAnterior", "rectoAbdominal", "antebrazo"],
    },
    equipment: "kettlebell",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "De pie con pies más anchos que los hombros, kettlebell frente a ti",
      "Bisagra de cadera para agarrar la kettlebell con ambas manos",
      "Balancea la kettlebell entre las piernas con cadera hacia atrás",
      "Extiende caderas explosivamente para llevar la kettlebell a la altura de los hombros",
    ],
    tips: [
      "Es una bisagra de cadera, no una sentadilla",
      "Los brazos son solo ganchos, la potencia viene de las caderas",
      "Aprieta los glúteos fuerte en cada extensión",
    ],
    commonMistakes: [
      "Convertirlo en sentadilla",
      "Tirar con los brazos en lugar de usar las caderas",
      "Redondear la espalda",
    ],
    videoPrompt:
      "Atleta realizando kettlebell swing ruso, bisagra de cadera explosiva, kettlebell a la altura de los hombros, vista lateral, gimnasio funcional",
    sets: { beginner: "3×12", intermediate: "4×15", advanced: "5×20" },
    restSeconds: { beginner: 60, intermediate: 45, advanced: 30 },
    tags: ["kettlebell", "glúteos", "funcional", "explosividad"],
  },

  {
    id: "kettlebell_clean",
    name: "Clean con kettlebell",
    nameEn: "Kettlebell Clean",
    category: "compound",
    muscles: {
      primary: ["gluteoMayor", "isquiotibiales", "deltoidesAnterior"],
      secondary: ["biceps", "antebrazo", "rectoAbdominal"],
    },
    equipment: "kettlebell",
    mechanic: "pull",
    force: "pull",
    level: "intermediate",
    instructions: [
      "De pie con kettlebell en una mano entre las piernas",
      "Balancea la kettlebell hacia atrás y extiende caderas explosivamente",
      "Guía la kettlebell hacia arriba pegada al cuerpo hasta la posición de rack (hombro)",
      "La kettlebell debe rodar suavemente alrededor de la muñeca",
    ],
    tips: [
      "No dejes que la kettlebell golpee la muñeca",
      "El movimiento es vertical, no de arco como el swing",
      "Codo pegado al torso en la posición de rack",
    ],
    commonMistakes: [
      "Kettlebell que golpea la muñeca con fuerza",
      "Tirar con el brazo en lugar de usar las caderas",
      "Trayectoria de arco excesivo",
    ],
    videoPrompt:
      "Persona realizando clean con kettlebell, movimiento fluido desde el suelo a posición de rack, vista lateral, gimnasio funcional",
    sets: { beginner: "3×8", intermediate: "4×10", advanced: "5×10" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 45 },
    tags: ["kettlebell", "funcional", "explosividad"],
  },

  {
    id: "kettlebell_snatch",
    name: "Snatch con kettlebell",
    nameEn: "Kettlebell Snatch",
    category: "compound",
    muscles: {
      primary: ["gluteoMayor", "isquiotibiales", "deltoidesAnterior", "deltoidesLateral"],
      secondary: ["triceps", "rectoAbdominal", "trapecio", "antebrazo"],
    },
    equipment: "kettlebell",
    mechanic: "pull",
    force: "pull",
    level: "advanced",
    instructions: [
      "Inicia como un swing con una mano",
      "En el punto más alto del swing, tira la kettlebell hacia arriba",
      "Guía la kettlebell sobre la cabeza hasta la extensión completa del brazo",
      "La kettlebell rota suavemente alrededor de la muñeca al llegar arriba",
    ],
    tips: [
      "Domina primero el swing y el clean",
      "La kettlebell no debe golpear la muñeca",
      "Es un movimiento continuo y fluido",
    ],
    commonMistakes: [
      "Kettlebell que golpea el antebrazo con fuerza",
      "Usar el brazo en lugar de las caderas",
      "No completar la extensión arriba",
    ],
    videoPrompt:
      "Atleta realizando snatch con kettlebell, movimiento explosivo de suelo a sobre la cabeza en un solo movimiento, vista lateral, gimnasio funcional",
    sets: { beginner: "3×5", intermediate: "4×8", advanced: "5×10" },
    restSeconds: { beginner: 90, intermediate: 60, advanced: 45 },
    tags: ["kettlebell", "funcional", "explosividad", "avanzado"],
  },

  {
    id: "turkish_get_up",
    name: "Turkish get-up",
    nameEn: "Turkish Get-Up",
    category: "compound",
    muscles: {
      primary: ["deltoidesAnterior", "rectoAbdominal", "gluteoMayor"],
      secondary: ["oblicuos", "cuadriceps", "trapecio", "transverso"],
    },
    equipment: "kettlebell",
    mechanic: "push",
    force: "push",
    level: "advanced",
    instructions: [
      "Acuéstate boca arriba con kettlebell en una mano, brazo extendido al techo",
      "Flexiona la rodilla del mismo lado y apoya el pie en el suelo",
      "Apóyate en el codo opuesto, luego en la mano, eleva la cadera",
      "Pasa la pierna por debajo hasta posición de zancada y levántate",
    ],
    tips: [
      "Practica sin peso primero para dominar la secuencia",
      "Mantén los ojos en la kettlebell durante todo el movimiento",
      "Cada fase debe ser controlada, no apresurada",
    ],
    commonMistakes: [
      "Apresurarse a través de las fases",
      "Perder de vista la kettlebell",
      "No mantener el brazo completamente extendido",
    ],
    videoPrompt:
      "Atleta realizando Turkish get-up completo con kettlebell, secuencia desde acostado hasta de pie, vista lateral, gimnasio profesional con buena iluminación",
    sets: { beginner: "3×3", intermediate: "3×5", advanced: "4×5" },
    restSeconds: { beginner: 90, intermediate: 90, advanced: 60 },
    tags: ["kettlebell", "funcional", "estabilidad", "cuerpo completo"],
  },

  {
    id: "kettlebell_goblet_squat",
    name: "Sentadilla goblet con kettlebell",
    nameEn: "Kettlebell Goblet Squat",
    category: "compound",
    muscles: {
      primary: ["cuadriceps", "gluteoMayor"],
      secondary: ["rectoAbdominal", "aductores", "biceps"],
    },
    equipment: "kettlebell",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Sujeta la kettlebell por los cuernos contra el pecho",
      "Pies ligeramente más anchos que los hombros, puntas hacia afuera",
      "Desciende en sentadilla profunda empujando rodillas hacia afuera",
      "Sube empujando a través de los talones",
    ],
    tips: [
      "La kettlebell contra el pecho actúa como contrapeso",
      "Ideal para practicar la sentadilla profunda",
      "Los codos pueden tocar las rodillas abajo como guía de profundidad",
    ],
    commonMistakes: [
      "Separar la kettlebell del pecho",
      "Rodillas que colapsan hacia adentro",
      "No bajar suficiente",
    ],
    videoPrompt:
      "Persona realizando sentadilla goblet profunda con kettlebell contra el pecho, vista frontal, gimnasio funcional",
    sets: { beginner: "3×12", intermediate: "4×10", advanced: "4×12" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 60 },
    tags: ["kettlebell", "piernas", "glúteos", "principiante"],
  },

  {
    id: "kettlebell_push_press",
    name: "Push press con kettlebell",
    nameEn: "Kettlebell Push Press",
    category: "compound",
    muscles: {
      primary: ["deltoidesAnterior", "deltoidesLateral", "cuadriceps"],
      secondary: ["triceps", "rectoAbdominal", "gluteoMayor"],
    },
    equipment: "kettlebell",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "Kettlebell en posición de rack a la altura del hombro",
      "Flexiona ligeramente las rodillas en un dip",
      "Extiende las piernas explosivamente y usa el impulso para empujar la kettlebell sobre la cabeza",
      "Baja la kettlebell controladamente a la posición de rack",
    ],
    tips: [
      "El dip de piernas genera el impulso principal",
      "El brazo solo guía y estabiliza",
      "Mantén el core apretado durante todo el movimiento",
    ],
    commonMistakes: [
      "Dip demasiado profundo",
      "No usar las piernas, convirtiendo en strict press",
      "Perder la posición de rack",
    ],
    videoPrompt:
      "Atleta realizando push press con kettlebell, dip de piernas seguido de empuje explosivo, vista lateral, gimnasio funcional",
    sets: { beginner: "3×8", intermediate: "4×8", advanced: "5×8" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 45 },
    tags: ["kettlebell", "hombros", "explosividad", "compuesto"],
  },

  {
    id: "kettlebell_windmill",
    name: "Windmill con kettlebell",
    nameEn: "Kettlebell Windmill",
    category: "compound",
    muscles: {
      primary: ["oblicuos", "deltoidesAnterior"],
      secondary: ["isquiotibiales", "gluteoMayor", "transverso"],
    },
    equipment: "kettlebell",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "De pie con kettlebell en una mano, brazo extendido sobre la cabeza",
      "Gira los pies a 45 grados del brazo cargado",
      "Empuja la cadera hacia el lado de la kettlebell",
      "Inclina el torso hacia abajo deslizando la mano libre por la pierna",
    ],
    tips: [
      "Mantén los ojos en la kettlebell todo el tiempo",
      "El brazo superior permanece perfectamente vertical",
      "El movimiento viene de la cadera, no de la columna",
    ],
    commonMistakes: [
      "Doblar la columna lateralmente",
      "Perder de vista la kettlebell",
      "Brazo que pierde la verticalidad",
    ],
    videoPrompt:
      "Persona realizando windmill con kettlebell, brazo extendido arriba, inclinación lateral controlada, vista frontal, gimnasio funcional",
    sets: { beginner: "3×5", intermediate: "3×8", advanced: "4×8" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 45 },
    tags: ["kettlebell", "core", "hombros", "movilidad"],
  },

  {
    id: "kettlebell_halo",
    name: "Halo con kettlebell",
    nameEn: "Kettlebell Halo",
    category: "isolation",
    muscles: {
      primary: ["deltoidesAnterior", "deltoidesLateral", "deltoidesPosterior"],
      secondary: ["trapecio", "rectoAbdominal"],
    },
    equipment: "kettlebell",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Sujeta la kettlebell invertida por los cuernos frente al pecho",
      "Rota la kettlebell alrededor de la cabeza en una dirección",
      "Mantén los codos cerca y la kettlebell cerca de la cabeza",
      "Alterna la dirección cada serie o cada repetición",
    ],
    tips: [
      "Excelente calentamiento para los hombros",
      "Mantén el core activado para no compensar con el torso",
      "Usa un peso ligero-moderado",
    ],
    commonMistakes: [
      "Kettlebell demasiado lejos de la cabeza",
      "Mover el torso en lugar de solo la kettlebell",
      "Peso excesivo",
    ],
    videoPrompt:
      "Atleta rotando kettlebell invertida alrededor de la cabeza en movimiento de halo, vista frontal, gimnasio funcional con buena iluminación",
    sets: { beginner: "3×8", intermediate: "3×10", advanced: "4×10" },
    restSeconds: { beginner: 30, intermediate: 30, advanced: 30 },
    tags: ["kettlebell", "hombros", "calentamiento", "movilidad"],
  },

  // ==========================================================================
  // MÁQUINAS (15 ejercicios)
  // ==========================================================================

  {
    id: "smith_machine_squat",
    name: "Sentadilla en Smith",
    nameEn: "Smith Machine Squat",
    category: "compound",
    muscles: {
      primary: ["cuadriceps", "gluteoMayor"],
      secondary: ["isquiotibiales", "rectoAbdominal"],
    },
    equipment: "smith",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Colócate bajo la barra de la Smith con pies ligeramente adelantados",
      "Desbloquea la barra girando los ganchos",
      "Desciende en sentadilla controlada",
      "Empuja hacia arriba hasta la posición inicial",
    ],
    tips: [
      "Pies ligeramente adelante de la barra permite mayor profundidad",
      "La trayectoria fija reduce la necesidad de estabilización",
      "Ideal para principiantes o trabajo de aislamiento",
    ],
    commonMistakes: [
      "Pies directamente debajo de la barra",
      "Bloquear las rodillas arriba",
      "No desbloquear los seguros correctamente",
    ],
    videoPrompt:
      "Persona realizando sentadilla en máquina Smith, pies ligeramente adelantados, descendiendo profundo, vista lateral, gimnasio moderno",
    sets: { beginner: "3×12", intermediate: "4×10", advanced: "4×8" },
    restSeconds: { beginner: 90, intermediate: 90, advanced: 120 },
    tags: ["piernas", "máquina", "Smith", "principiante"],
  },

  {
    id: "smith_machine_incline_press",
    name: "Press inclinado en Smith",
    nameEn: "Smith Machine Incline Press",
    category: "compound",
    muscles: {
      primary: ["pectoralMayor", "pectoralMenor"],
      secondary: ["deltoidesAnterior", "triceps"],
    },
    equipment: "smith",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Coloca un banco inclinado dentro de la máquina Smith",
      "Acuéstate y alinea la barra con la parte superior del pecho",
      "Desbloquea la barra y baja al pecho controladamente",
      "Empuja hasta casi bloquear los brazos",
    ],
    tips: [
      "La trayectoria fija permite enfocarse en la contracción",
      "Ideal para acabado o trabajo de volumen",
      "Ajusta bien la posición del banco antes de empezar",
    ],
    commonMistakes: [
      "Banco mal posicionado respecto a la barra",
      "No alinear la barra con el pecho",
      "Rebotar la barra en el pecho",
    ],
    videoPrompt:
      "Atleta en máquina Smith realizando press inclinado con banco, barra bajando al pecho superior, vista lateral, gimnasio moderno",
    sets: { beginner: "3×12", intermediate: "3×10", advanced: "4×10" },
    restSeconds: { beginner: 60, intermediate: 90, advanced: 90 },
    tags: ["pecho", "máquina", "Smith"],
  },

  {
    id: "cable_fly_flat",
    name: "Apertura de cable plano",
    nameEn: "Flat Cable Fly",
    category: "isolation",
    muscles: {
      primary: ["pectoralMayor"],
      secondary: ["deltoidesAnterior"],
    },
    equipment: "cable",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Coloca las poleas a la altura del pecho",
      "Acuéstate en un banco entre las dos poleas",
      "Agarra los mangos y junta las manos arriba con los brazos casi extendidos",
      "Abre los brazos en arco controlado y repite",
    ],
    tips: [
      "Tensión constante durante todo el movimiento",
      "Ideal para acabado de pecho",
      "Ligera flexión de codos durante todo el recorrido",
    ],
    commonMistakes: [
      "Convertir en press flexionando los codos excesivamente",
      "Perder la tensión del cable en algún punto",
      "Peso excesivo",
    ],
    videoPrompt:
      "Persona acostada en banco entre poleas realizando apertura de cable, tensión constante, vista cenital, gimnasio moderno",
    sets: { beginner: "3×15", intermediate: "3×12", advanced: "4×12" },
    restSeconds: { beginner: 45, intermediate: 60, advanced: 60 },
    tags: ["pecho", "aislamiento", "cable", "máquina"],
  },

  {
    id: "lat_pulldown_machine",
    name: "Jalón al pecho en máquina",
    nameEn: "Lat Pulldown Machine",
    category: "compound",
    muscles: {
      primary: ["dorsalAncho"],
      secondary: ["biceps", "romboides", "trapecio"],
    },
    equipment: "machine",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "Siéntate y ajusta la almohadilla sobre los muslos",
      "Agarra la barra con agarre ancho, palmas al frente",
      "Tira de la barra hacia la parte superior del pecho",
      "Regresa controladamente a la posición inicial",
    ],
    tips: [
      "Lleva la barra al pecho, no detrás del cuello",
      "Retrae las escápulas al tirar",
      "Inclina ligeramente el torso hacia atrás",
    ],
    commonMistakes: [
      "Tirar detrás del cuello",
      "Inclinarse excesivamente hacia atrás",
      "Usar impulso del cuerpo",
    ],
    videoPrompt:
      "Atleta sentado en máquina de jalón al pecho tirando barra ancha hacia el pecho, vista frontal, gimnasio moderno",
    sets: { beginner: "3×12", intermediate: "4×10", advanced: "4×8" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 90 },
    tags: ["espalda", "dorsal", "máquina"],
  },

  {
    id: "machine_leg_extension",
    name: "Extensión de cuádriceps en máquina (unilateral)",
    nameEn: "Machine Leg Extension (Single Leg)",
    category: "isolation",
    muscles: {
      primary: ["cuadriceps"],
      secondary: [],
    },
    equipment: "machine",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Siéntate en la máquina con solo un pie detrás del rodillo",
      "Extiende una pierna hasta la horizontal",
      "Aprieta el cuádriceps arriba 1-2 segundos",
      "Baja controladamente y completa las repeticiones antes de cambiar de pierna",
    ],
    tips: [
      "Ideal para corregir desequilibrios entre piernas",
      "Mantén la espalda apoyada",
      "Usa menos peso que en bilateral",
    ],
    commonMistakes: [
      "Compensar con la cadera",
      "Velocidad excesiva",
      "No completar la extensión",
    ],
    videoPrompt:
      "Persona sentada en máquina de extensión de piernas trabajando una pierna a la vez, vista lateral, gimnasio moderno",
    sets: { beginner: "3×12", intermediate: "3×10", advanced: "4×10" },
    restSeconds: { beginner: 45, intermediate: 60, advanced: 60 },
    tags: ["piernas", "cuádriceps", "aislamiento", "máquina", "unilateral"],
  },

  {
    id: "machine_calf_raise_standing",
    name: "Elevación de gemelos en máquina de pie",
    nameEn: "Standing Machine Calf Raise",
    category: "isolation",
    muscles: {
      primary: ["gemelos"],
      secondary: ["soleo"],
    },
    equipment: "machine",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Colócate en la máquina con hombros bajo las almohadillas",
      "Puntas de los pies en el borde, talones colgando",
      "Elévate lo más alto posible sobre las puntas",
      "Baja estirando completamente los gemelos",
    ],
    tips: [
      "Rango completo es clave: sube y baja al máximo",
      "Varía la posición de los pies (neutro, adentro, afuera)",
      "Pausa arriba 2 segundos",
    ],
    commonMistakes: [
      "Rango parcial",
      "Usar impulso rebotando",
      "Flexionar las rodillas",
    ],
    videoPrompt:
      "Atleta en máquina de gemelos de pie, elevándose sobre las puntas, rango completo de movimiento, vista lateral, gimnasio profesional",
    sets: { beginner: "3×15", intermediate: "4×12", advanced: "5×15" },
    restSeconds: { beginner: 45, intermediate: 45, advanced: 60 },
    tags: ["piernas", "gemelos", "máquina", "aislamiento"],
  },

  {
    id: "cable_lateral_pull",
    name: "Tracción lateral con cable",
    nameEn: "Cable Lateral Pull",
    category: "isolation",
    muscles: {
      primary: ["dorsalAncho"],
      secondary: ["biceps", "romboides"],
    },
    equipment: "cable",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "Coloca la polea alta y agarra con una mano",
      "De rodillas o de pie, tira el cable hacia abajo y al lado",
      "Contrae el dorsal al máximo en la parte baja",
      "Regresa controladamente",
    ],
    tips: [
      "Trabaja un lado a la vez para mayor conexión",
      "Ideal para activación y acabado",
      "Enfócate en apretar el dorsal",
    ],
    commonMistakes: [
      "Usar el bíceps en lugar del dorsal",
      "Movimiento demasiado rápido",
      "Rango incompleto",
    ],
    videoPrompt:
      "Persona de rodillas tirando cable hacia abajo con una mano, contracción del dorsal visible, vista lateral, gimnasio moderno",
    sets: { beginner: "3×12", intermediate: "3×12", advanced: "4×10" },
    restSeconds: { beginner: 45, intermediate: 45, advanced: 60 },
    tags: ["espalda", "dorsal", "aislamiento", "cable"],
  },

  {
    id: "chest_press_machine_incline",
    name: "Press de pecho inclinado en máquina",
    nameEn: "Incline Machine Chest Press",
    category: "compound",
    muscles: {
      primary: ["pectoralMayor", "pectoralMenor"],
      secondary: ["deltoidesAnterior", "triceps"],
    },
    equipment: "machine",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Siéntate en la máquina de press inclinado con espalda apoyada",
      "Ajusta el asiento para que los mangos queden a la altura del pecho superior",
      "Empuja los mangos hacia adelante hasta casi extender los brazos",
      "Regresa controladamente",
    ],
    tips: [
      "Enfoque en pecho superior",
      "Ideal para principiantes o acabado de sesión",
      "Trayectoria guiada reduce riesgo de lesión",
    ],
    commonMistakes: [
      "Asiento mal ajustado",
      "Bloquear los codos",
      "No controlar la fase negativa",
    ],
    videoPrompt:
      "Atleta sentado en máquina de press de pecho inclinado, empujando mangos hacia adelante, vista lateral, gimnasio moderno",
    sets: { beginner: "3×12", intermediate: "3×10", advanced: "4×10" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 90 },
    tags: ["pecho", "pecho superior", "máquina"],
  },

  {
    id: "rear_delt_machine",
    name: "Deltoides posterior en máquina",
    nameEn: "Rear Delt Machine",
    category: "isolation",
    muscles: {
      primary: ["deltoidesPosterior"],
      secondary: ["trapecio", "romboides"],
    },
    equipment: "machine",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "Siéntate mirando la máquina con pecho contra el respaldo",
      "Agarra los mangos a la altura de los hombros",
      "Abre los brazos hacia atrás apretando las escápulas",
      "Regresa controladamente",
    ],
    tips: [
      "Muy similar al reverse pec deck pero con diferentes mangos",
      "Mantén ligera flexión en los codos",
      "Enfócate en apretar la parte posterior del hombro",
    ],
    commonMistakes: [
      "Usar trapecio en lugar de deltoides posterior",
      "Asiento mal ajustado",
      "Peso excesivo",
    ],
    videoPrompt:
      "Persona en máquina de deltoides posterior, abriendo brazos hacia atrás, vista lateral, gimnasio profesional",
    sets: { beginner: "3×15", intermediate: "3×12", advanced: "4×12" },
    restSeconds: { beginner: 45, intermediate: 45, advanced: 60 },
    tags: ["hombros", "deltoides posterior", "máquina", "aislamiento"],
  },

  {
    id: "assisted_dip_machine",
    name: "Fondos asistidos en máquina",
    nameEn: "Assisted Dip Machine",
    category: "compound",
    muscles: {
      primary: ["triceps", "pectoralMayor"],
      secondary: ["deltoidesAnterior"],
    },
    equipment: "machine",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Arrodíllate en la plataforma de la máquina asistida",
      "Agarra las barras con los brazos extendidos",
      "Desciende flexionando los codos hasta 90 grados",
      "Empuja hacia arriba hasta la extensión completa",
    ],
    tips: [
      "Más peso en la máquina = menos resistencia (más ayuda)",
      "Ideal para progresar hacia fondos con peso corporal",
      "Inclina el torso para enfatizar pecho o mantenlo vertical para tríceps",
    ],
    commonMistakes: [
      "Demasiada asistencia sin progresar",
      "No completar el rango de movimiento",
      "Descender demasiado causando dolor de hombro",
    ],
    videoPrompt:
      "Atleta en máquina de fondos asistidos, arrodillado en plataforma, descendiendo y subiendo, vista lateral, gimnasio moderno",
    sets: { beginner: "3×10", intermediate: "3×12", advanced: "4×12" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 60 },
    tags: ["tríceps", "pecho", "máquina", "principiante"],
  },

  {
    id: "assisted_pull_up_machine",
    name: "Dominadas asistidas en máquina",
    nameEn: "Assisted Pull-Up Machine",
    category: "compound",
    muscles: {
      primary: ["dorsalAncho"],
      secondary: ["biceps", "romboides", "trapecio"],
    },
    equipment: "machine",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "Arrodíllate en la plataforma de la máquina asistida",
      "Agarra la barra con agarre prono más ancho que los hombros",
      "Tira de tu cuerpo hacia arriba hasta que la barbilla pase la barra",
      "Baja controladamente hasta la extensión completa",
    ],
    tips: [
      "Reduce gradualmente la asistencia para progresar",
      "Enfócate en tirar con los dorsales, no solo con los brazos",
      "Retrae las escápulas al inicio del movimiento",
    ],
    commonMistakes: [
      "Excesiva asistencia sin progresar",
      "No completar el rango de movimiento",
      "Tirar solo con los brazos",
    ],
    videoPrompt:
      "Persona en máquina de dominadas asistidas, tirando hacia arriba con agarre ancho, vista frontal, gimnasio moderno",
    sets: { beginner: "3×8", intermediate: "3×10", advanced: "4×10" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 60 },
    tags: ["espalda", "dorsal", "máquina", "principiante"],
  },

  {
    id: "cable_crunch",
    name: "Crunch con cable (abdominales en polea)",
    nameEn: "Cable Crunch",
    category: "isolation",
    muscles: {
      primary: ["rectoAbdominal"],
      secondary: ["oblicuos"],
    },
    equipment: "cable",
    mechanic: "pull",
    force: "pull",
    level: "intermediate",
    instructions: [
      "Arrodíllate frente a la polea alta con cuerda",
      "Sujeta la cuerda detrás de la cabeza o a los lados",
      "Flexiona el torso hacia abajo contrayendo los abdominales",
      "Regresa controladamente sin perder tensión",
    ],
    tips: [
      "El movimiento viene de la flexión de la columna, no de la cadera",
      "Mantén las caderas fijas",
      "Permite añadir carga progresiva a los abdominales",
    ],
    commonMistakes: [
      "Flexionar la cadera en lugar de la columna",
      "Tirar con los brazos",
      "No controlar la fase excéntrica",
    ],
    videoPrompt:
      "Atleta arrodillado frente a polea alta realizando crunch con cuerda, flexión de torso, vista lateral, gimnasio profesional",
    sets: { beginner: "3×15", intermediate: "3×12", advanced: "4×12" },
    restSeconds: { beginner: 45, intermediate: 45, advanced: 60 },
    tags: ["core", "abdominales", "cable", "máquina"],
  },

  {
    id: "machine_row_hammer",
    name: "Remo en máquina Hammer Strength",
    nameEn: "Hammer Strength Row",
    category: "compound",
    muscles: {
      primary: ["dorsalAncho", "romboides"],
      secondary: ["biceps", "trapecio", "erectoresEspinales"],
    },
    equipment: "machine",
    mechanic: "pull",
    force: "pull",
    level: "beginner",
    instructions: [
      "Siéntate con el pecho apoyado en la almohadilla",
      "Agarra los mangos con agarre neutro o prono",
      "Tira de los mangos hacia el torso contrayendo los dorsales",
      "Regresa controladamente",
    ],
    tips: [
      "Pecho firme contra la almohadilla durante todo el movimiento",
      "Permite trabajar un brazo a la vez para corregir desequilibrios",
      "Enfócate en apretar las escápulas atrás",
    ],
    commonMistakes: [
      "Separar el pecho de la almohadilla",
      "Usar impulso del cuerpo",
      "No apretar las escápulas",
    ],
    videoPrompt:
      "Persona sentada en máquina Hammer Strength de remo, pecho contra almohadilla, tirando mangos hacia el torso, vista lateral, gimnasio profesional",
    sets: { beginner: "3×12", intermediate: "4×10", advanced: "4×8" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 90 },
    tags: ["espalda", "dorsal", "máquina"],
  },

  {
    id: "machine_shoulder_lateral_raise",
    name: "Elevación lateral en máquina",
    nameEn: "Machine Lateral Raise",
    category: "isolation",
    muscles: {
      primary: ["deltoidesLateral"],
      secondary: ["deltoidesAnterior", "trapecio"],
    },
    equipment: "machine",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Siéntate en la máquina con los brazos a los lados contra las almohadillas",
      "Eleva los brazos lateralmente contra la resistencia",
      "Sube hasta la altura de los hombros",
      "Baja controladamente",
    ],
    tips: [
      "La trayectoria guiada aísla mejor el deltoides lateral",
      "No eleves los hombros (encogimientos involuntarios)",
      "Ideal para acabado o altas repeticiones",
    ],
    commonMistakes: [
      "Encoger los hombros al subir",
      "Rango de movimiento incompleto",
      "Usar impulso",
    ],
    videoPrompt:
      "Atleta sentado en máquina de elevación lateral, brazos elevándose a los lados hasta los hombros, vista frontal, gimnasio moderno",
    sets: { beginner: "3×15", intermediate: "3×12", advanced: "4×15" },
    restSeconds: { beginner: 45, intermediate: 45, advanced: 60 },
    tags: ["hombros", "deltoides lateral", "máquina", "aislamiento"],
  },

  {
    id: "smith_machine_shoulder_press",
    name: "Press de hombros en Smith",
    nameEn: "Smith Machine Shoulder Press",
    category: "compound",
    muscles: {
      primary: ["deltoidesAnterior", "deltoidesLateral"],
      secondary: ["triceps", "trapecio"],
    },
    equipment: "smith",
    mechanic: "push",
    force: "push",
    level: "beginner",
    instructions: [
      "Siéntate en un banco con respaldo dentro de la máquina Smith",
      "Desbloquea la barra a la altura de los hombros",
      "Empuja la barra verticalmente hasta la extensión",
      "Baja controladamente hasta la altura de las orejas",
    ],
    tips: [
      "La trayectoria fija permite enfocarse en el empuje",
      "Ideal para final de sesión de hombros",
      "No bajes la barra por debajo de las orejas",
    ],
    commonMistakes: [
      "Bajar demasiado la barra",
      "No alinear el banco correctamente con la barra",
      "Bloquear los codos agresivamente",
    ],
    videoPrompt:
      "Atleta sentado en máquina Smith realizando press de hombros, empujando barra sobre la cabeza, vista lateral, gimnasio moderno",
    sets: { beginner: "3×12", intermediate: "3×10", advanced: "4×10" },
    restSeconds: { beginner: 60, intermediate: 90, advanced: 90 },
    tags: ["hombros", "máquina", "Smith"],
  },

  // ==========================================================================
  // CALISTENIA (10 ejercicios)
  // ==========================================================================

  {
    id: "muscle_up",
    name: "Muscle-up en barra",
    nameEn: "Bar Muscle-Up",
    category: "compound",
    muscles: {
      primary: ["dorsalAncho", "pectoralMayor", "triceps"],
      secondary: ["biceps", "deltoidesAnterior", "rectoAbdominal"],
    },
    equipment: "barFija",
    mechanic: "pull",
    force: "pull",
    level: "advanced",
    instructions: [
      "Cuélgate de la barra con agarre falso (pulgares sobre la barra)",
      "Genera impulso con un kip o tira de forma estricta",
      "Cuando la barbilla pase la barra, transiciona empujando los hombros sobre ella",
      "Extiende los brazos en la parte superior como un fondo",
    ],
    tips: [
      "Domina primero 10+ dominadas y 10+ fondos limpios",
      "El agarre falso facilita la transición",
      "Practica con bandas elásticas para asistencia",
    ],
    commonMistakes: [
      "No tener suficiente fuerza de base",
      "Transición deficiente quedándose atascado en la barra",
      "Kipping excesivo sin control",
    ],
    videoPrompt:
      "Atleta de calistenia realizando muscle-up en barra alta, transición fluida de pull a push, vista lateral, parque de calistenia al aire libre",
    sets: { beginner: "3×1", intermediate: "3×3", advanced: "5×5" },
    restSeconds: { beginner: 180, intermediate: 120, advanced: 90 },
    tags: ["calistenia", "avanzado", "espalda", "pecho", "barra fija"],
  },

  {
    id: "handstand_push_up",
    name: "Flexión en parada de manos",
    nameEn: "Handstand Push-Up",
    category: "compound",
    muscles: {
      primary: ["deltoidesAnterior", "deltoidesLateral", "triceps"],
      secondary: ["trapecio", "rectoAbdominal", "pectoralMayor"],
    },
    equipment: "bodyweight",
    mechanic: "push",
    force: "push",
    level: "advanced",
    instructions: [
      "Realiza una parada de manos contra la pared con brazos extendidos",
      "Flexiona los codos bajando la cabeza hacia el suelo",
      "Toca ligeramente el suelo con la cabeza o un pad",
      "Empuja hacia arriba hasta la extensión completa",
    ],
    tips: [
      "Empieza con la pared para asistencia y estabilidad",
      "Core extremadamente activo para mantener la posición",
      "Progresa desde pike push-ups antes de intentar",
    ],
    commonMistakes: [
      "No tener suficiente fuerza de hombros",
      "Arco excesivo en la espalda",
      "Caer sin control",
    ],
    videoPrompt:
      "Atleta realizando flexión en parada de manos contra la pared, descenso y ascenso controlado, vista lateral, gimnasio de calistenia",
    sets: { beginner: "3×1", intermediate: "3×5", advanced: "5×8" },
    restSeconds: { beginner: 120, intermediate: 120, advanced: 90 },
    tags: ["calistenia", "hombros", "avanzado", "peso corporal"],
  },

  {
    id: "l_sit",
    name: "L-sit",
    nameEn: "L-Sit",
    category: "isolation",
    muscles: {
      primary: ["rectoAbdominal", "cuadriceps"],
      secondary: ["oblicuos", "triceps", "transverso"],
    },
    equipment: "bodyweight",
    mechanic: "push",
    force: "push",
    level: "intermediate",
    instructions: [
      "Siéntate en el suelo o sujétate en barras paralelas con brazos extendidos",
      "Eleva las piernas extendidas frente a ti hasta la horizontal",
      "Mantén la posición con los brazos bloqueados y las piernas paralelas al suelo",
      "Sostén el tiempo indicado",
    ],
    tips: [
      "Empieza con L-sit de rodillas flexionadas y progresa",
      "Deprime los hombros (no encogerse)",
      "Activa cuádriceps fuertemente para mantener las piernas rectas",
    ],
    commonMistakes: [
      "Piernas que caen por falta de fuerza",
      "Hombros que se encogen",
      "Espalda redondeada",
    ],
    videoPrompt:
      "Atleta sosteniendo L-sit en barras paralelas, piernas horizontales, brazos extendidos, vista lateral, parque de calistenia",
    sets: { beginner: "3×10s", intermediate: "3×20s", advanced: "4×30s" },
    restSeconds: { beginner: 60, intermediate: 60, advanced: 60 },
    tags: ["calistenia", "core", "isométrico", "peso corporal"],
  },

  {
    id: "pistol_squat",
    name: "Pistol squat (sentadilla a una pierna)",
    nameEn: "Pistol Squat",
    category: "compound",
    muscles: {
      primary: ["cuadriceps", "gluteoMayor"],
      secondary: ["isquiotibiales", "gluteoMedio", "rectoAbdominal"],
    },
    equipment: "bodyweight",
    mechanic: "push",
    force: "push",
    level: "advanced",
    instructions: [
      "De pie sobre una pierna, extiende la otra pierna al frente",
      "Desciende en sentadilla profunda sobre la pierna de apoyo",
      "Mantén la pierna extendida frente a ti sin tocar el suelo",
      "Empuja con la pierna de apoyo para volver a la posición de pie",
    ],
    tips: [
      "Requiere fuerza, equilibrio y movilidad",
      "Progresa con asistencia (TRX, poste) antes de ir libre",
      "Extiende los brazos al frente como contrapeso",
    ],
    commonMistakes: [
      "Rodilla que colapsa hacia adentro",
      "No tener suficiente movilidad de tobillo",
      "Pierna extendida que toca el suelo",
    ],
    videoPrompt:
      "Atleta realizando pistol squat sin asistencia, descenso profundo sobre una pierna, pierna libre extendida, vista lateral, gimnasio de calistenia",
    sets: { beginner: "3×3", intermediate: "3×5", advanced: "4×8" },
    restSeconds: { beginner: 90, intermediate: 90, advanced: 60 },
    tags: ["calistenia", "piernas", "avanzado", "unilateral", "peso corporal"],
  },

  {
    id: "nordic_curl",
    name: "Nordic curl (curl nórdico)",
    nameEn: "Nordic Curl",
    category: "isolation",
    muscles: {
      primary: ["isquiotibiales"],
      secondary: ["gemelos", "gluteoMayor"],
    },
    equipment: "bodyweight",
    mechanic: "pull",
    force: "pull",
    level: "advanced",
    instructions: [
      "Arrodíllate con los tobillos sujetos (por un compañero o máquina)",
      "Cuerpo erguido desde las rodillas hasta la cabeza",
      "Inclínate lentamente hacia adelante manteniendo el cuerpo recto",
      "Frena la caída con los isquiotibiales y empuja con las manos para volver",
    ],
    tips: [
      "Controla la excéntrica lo más lento posible",
      "Usa las manos para frenar al principio si es necesario",
      "Progresa gradualmente aumentando el rango excéntrico",
    ],
    commonMistakes: [
      "Flexionar las caderas en lugar de mantener el cuerpo recto",
      "Caer sin control",
      "No tener los tobillos bien sujetos",
    ],
    videoPrompt:
      "Atleta realizando nordic curl, descendiendo lentamente con cuerpo recto desde las rodillas, tobillos sujetos, vista lateral, gimnasio profesional",
    sets: { beginner: "3×3", intermediate: "3×5", advanced: "4×8" },
    restSeconds: { beginner: 120, intermediate: 90, advanced: 90 },
    tags: ["calistenia", "isquiotibiales", "avanzado", "peso corporal"],
  },

  {
    id: "dragon_flag",
    name: "Dragon flag",
    nameEn: "Dragon Flag",
    category: "isolation",
    muscles: {
      primary: ["rectoAbdominal", "transverso"],
      secondary: ["oblicuos", "erectores", "cuadriceps"],
    },
    equipment: "bench",
    mechanic: "pull",
    force: "pull",
    level: "advanced",
    instructions: [
      "Acuéstate en un banco y agarra el borde detrás de la cabeza",
      "Eleva todo el cuerpo hasta quedar casi vertical (solo hombros en el banco)",
      "Desciende el cuerpo recto como una tabla hacia el banco",
      "Frena antes de que la espalda baja toque el banco y vuelve a subir",
    ],
    tips: [
      "El cuerpo debe permanecer completamente recto como una bandera",
      "Empieza con la versión de rodillas flexionadas",
      "Controla especialmente la fase excéntrica",
    ],
    commonMistakes: [
      "Flexionar las caderas",
      "No tener suficiente fuerza de core",
      "Dejar caer el cuerpo sin control",
    ],
    videoPrompt:
      "Atleta realizando dragon flag en banco, cuerpo recto elevado y descendiendo como tabla, vista lateral, gimnasio de calistenia",
    sets: { beginner: "3×3", intermediate: "3×5", advanced: "4×8" },
    restSeconds: { beginner: 120, intermediate: 90, advanced: 90 },
    tags: ["calistenia", "core", "avanzado", "peso corporal"],
  },

  {
    id: "human_flag",
    name: "Bandera humana (Human flag)",
    nameEn: "Human Flag",
    category: "compound",
    muscles: {
      primary: ["dorsalAncho", "oblicuos", "deltoidesLateral"],
      secondary: ["rectoAbdominal", "triceps", "biceps", "transverso"],
    },
    equipment: "barFija",
    mechanic: "push",
    force: "push",
    level: "advanced",
    instructions: [
      "Agarra un poste vertical con ambas manos, una arriba y otra abajo",
      "La mano superior tira mientras la inferior empuja",
      "Eleva las piernas hasta quedar horizontal",
      "Mantén el cuerpo recto paralelo al suelo",
    ],
    tips: [
      "Uno de los movimientos más difíciles de calistenia",
      "Progresa con tucked flag (rodillas al pecho) primero",
      "Requiere fuerza extrema de core y hombros",
    ],
    commonMistakes: [
      "No tener suficiente fuerza de base",
      "Piernas que caen",
      "Torso que no se mantiene horizontal",
    ],
    videoPrompt:
      "Atleta sosteniendo human flag horizontal en poste vertical, cuerpo completamente recto paralelo al suelo, vista frontal, parque de calistenia al aire libre",
    sets: { beginner: "3×5s", intermediate: "3×10s", advanced: "4×15s" },
    restSeconds: { beginner: 180, intermediate: 120, advanced: 120 },
    tags: ["calistenia", "core", "avanzado", "isométrico"],
  },

  {
    id: "front_lever",
    name: "Front lever",
    nameEn: "Front Lever",
    category: "compound",
    muscles: {
      primary: ["dorsalAncho", "rectoAbdominal"],
      secondary: ["romboides", "biceps", "transverso", "oblicuos"],
    },
    equipment: "barFija",
    mechanic: "pull",
    force: "pull",
    level: "advanced",
    instructions: [
      "Cuélgate de la barra con agarre prono",
      "Retrae las escápulas y activa los dorsales",
      "Eleva el cuerpo hasta quedar horizontal boca arriba",
      "Mantén el cuerpo completamente recto paralelo al suelo",
    ],
    tips: [
      "Progresa: tuck, advanced tuck, one leg, straddle, full",
      "La depresión escapular es clave",
      "Requiere fuerza extrema de dorsales y core",
    ],
    commonMistakes: [
      "Caderas que caen",
      "Espalda que se arquea",
      "No deprimir las escápulas suficientemente",
    ],
    videoPrompt:
      "Atleta sosteniendo front lever completo en barra alta, cuerpo horizontal boca arriba, vista lateral, parque de calistenia",
    sets: { beginner: "3×5s", intermediate: "3×10s", advanced: "4×15s" },
    restSeconds: { beginner: 180, intermediate: 120, advanced: 120 },
    tags: ["calistenia", "espalda", "core", "avanzado", "isométrico"],
  },

  {
    id: "back_lever",
    name: "Back lever",
    nameEn: "Back Lever",
    category: "compound",
    muscles: {
      primary: ["dorsalAncho", "pectoralMayor", "deltoidesAnterior"],
      secondary: ["biceps", "rectoAbdominal", "transverso"],
    },
    equipment: "barFija",
    mechanic: "pull",
    force: "pull",
    level: "advanced",
    instructions: [
      "Cuélgate de la barra y pasa las piernas por encima (inversión)",
      "Desciende lentamente hasta quedar horizontal boca abajo",
      "Mantén los brazos rectos y el cuerpo en línea",
      "Sostén la posición el tiempo indicado",
    ],
    tips: [
      "Progresa desde skin the cat antes de intentar",
      "Tuck back lever es la primera progresión",
      "Protege los bíceps calentando bien los codos",
    ],
    commonMistakes: [
      "Caderas que caen por debajo de la línea horizontal",
      "Brazos que se flexionan",
      "No calentar adecuadamente los bíceps y codos",
    ],
    videoPrompt:
      "Atleta sosteniendo back lever en barra alta, cuerpo horizontal boca abajo, brazos rectos, vista lateral, parque de calistenia",
    sets: { beginner: "3×5s", intermediate: "3×10s", advanced: "4×15s" },
    restSeconds: { beginner: 180, intermediate: 120, advanced: 120 },
    tags: ["calistenia", "espalda", "pecho", "avanzado", "isométrico"],
  },

  {
    id: "planche_lean",
    name: "Planche lean (inclinación de plancha)",
    nameEn: "Planche Lean",
    category: "compound",
    muscles: {
      primary: ["deltoidesAnterior", "pectoralMayor", "rectoAbdominal"],
      secondary: ["triceps", "transverso", "biceps"],
    },
    equipment: "bodyweight",
    mechanic: "push",
    force: "push",
    level: "advanced",
    instructions: [
      "Posición de plancha alta con brazos extendidos",
      "Protracta las escápulas (empuja el suelo, redondea la espalda alta)",
      "Inclina el cuerpo hacia adelante desplazando los hombros por delante de las manos",
      "Mantén la posición con el core extremadamente tenso",
    ],
    tips: [
      "Primer paso para aprender la planche completa",
      "Los dedos deben apuntar hacia los lados o atrás para proteger las muñecas",
      "Progresa gradualmente la inclinación",
    ],
    commonMistakes: [
      "No protractar las escápulas",
      "Caderas que caen",
      "Muñecas en mala posición",
    ],
    videoPrompt:
      "Atleta en posición de planche lean con cuerpo inclinado hacia adelante, hombros por delante de las manos, vista lateral, gimnasio de calistenia",
    sets: { beginner: "3×10s", intermediate: "3×20s", advanced: "4×30s" },
    restSeconds: { beginner: 90, intermediate: 90, advanced: 60 },
    tags: ["calistenia", "hombros", "pecho", "avanzado", "isométrico"],
  },

];

export default exercises;
