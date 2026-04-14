/**
 * MARS FIT v3 — Vista Exercise Library (Repositorio de ejercicios)
 *
 * Busqueda y exploracion de 150+ ejercicios.
 * Filtrado por musculo, equipamiento, tags.
 */

/**
 * @param {HTMLElement} container
 * @param {object} ctx - {navigate, back, params, route}
 * @returns {function|undefined} cleanup
 */
export function render(container, ctx) {
  container.innerHTML = `
    <section class="view view--exercise-library" data-view="exercise-library">
      <h1 class="view__title">Biblioteca de ejercicios</h1>
      <p class="view__placeholder">Vista Exercise Library — pendiente de implementacion</p>
    </section>
  `;

  // TODO: implementar biblioteca
  // - Barra de busqueda con filtro en tiempo real
  // - Grid/lista de ejercicios con icono de musculo
  // - Filtros por: musculo, equipamiento, tags (gym/casa/operativo)
  // - Tap para ir a detalle del ejercicio
  // - Boton para crear ejercicio custom
  // - Ejercicios del sistema + ejercicios custom del usuario

  return () => {};
}
