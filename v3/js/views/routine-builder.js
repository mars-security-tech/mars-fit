/**
 * MARS FIT v3 — Vista Routine Builder
 *
 * Crear y editar rutinas personalizadas.
 * Drag & drop de ejercicios, configurar dias, series, reps.
 */

/**
 * @param {HTMLElement} container
 * @param {object} ctx - {navigate, back, params: {id?}, route}
 * @returns {function|undefined} cleanup
 */
export function render(container, ctx) {
  const routineId = ctx.params?.id;
  const isEditing = !!routineId;

  container.innerHTML = `
    <section class="view view--routine-builder" data-view="routine-builder">
      <h1 class="view__title">${isEditing ? 'Editar rutina' : 'Nueva rutina'}</h1>
      <p class="view__placeholder">Vista Routine Builder — pendiente de implementacion</p>
    </section>
  `;

  // TODO: implementar constructor de rutinas
  // - Nombre de la rutina, objetivo, rol
  // - Anadir dias (Lunes, Martes, etc. o Dia 1, Dia 2...)
  // - Dentro de cada dia: anadir ejercicios desde biblioteca
  // - Configurar series, reps, descanso por ejercicio
  // - Reordenar ejercicios (drag & drop o botones arriba/abajo)
  // - Guardar como rutina custom (saveCustomRoutine)
  // - Si editando: cargar datos existentes

  return () => {};
}
