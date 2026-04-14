/**
 * MARS FIT v3 — Vista Exercise Detail
 *
 * Detalle de un ejercicio: animacion 3D, cues, historial,
 * video IA placeholder con prompt visible.
 */

/**
 * @param {HTMLElement} container
 * @param {object} ctx - {navigate, back, params: {id}, route}
 * @returns {function|undefined} cleanup
 */
export function render(container, ctx) {
  const exerciseId = ctx.params?.id || 'unknown';

  container.innerHTML = `
    <section class="view view--exercise-detail" data-view="exercise-detail">
      <h1 class="view__title">Ejercicio: ${exerciseId}</h1>
      <p class="view__placeholder">Vista Exercise Detail — pendiente de implementacion</p>
    </section>
  `;

  // TODO: implementar detalle del ejercicio
  // - Nombre, musculo, equipamiento, tags
  // - Animacion 3D (Three.js) del movimiento
  // - Cues de forma (tips tecnicos)
  // - Historial de este ejercicio (grafica de progresion)
  // - Video IA: prompt visible + boton "Generar" con API key del usuario
  // - Boton "Anadir a rutina"

  return () => {
    // Cleanup: dispose Three.js scene si aplica
  };
}
