/**
 * MARS FIT v3 — Vista Diet Builder
 *
 * Crear y editar dietas personalizadas.
 * Elegir plan base y personalizarlo.
 */

/**
 * @param {HTMLElement} container
 * @param {object} ctx - {navigate, back, params: {id?}, route}
 * @returns {function|undefined} cleanup
 */
export function render(container, ctx) {
  const dietId = ctx.params?.id;
  const isEditing = !!dietId;

  container.innerHTML = `
    <section class="view view--diet-builder" data-view="diet-builder">
      <h1 class="view__title">${isEditing ? 'Editar dieta' : 'Nueva dieta'}</h1>
      <p class="view__placeholder">Vista Diet Builder — pendiente de implementacion</p>
    </section>
  `;

  // TODO: implementar constructor de dietas
  // - Elegir plan base (paleo, mediterranea, etc.) o empezar en blanco
  // - Ajustar macros (sliders P/C/F)
  // - Configurar comidas del dia (desayuno, comida, cena, snacks)
  // - Anadir/quitar alimentos de cada comida
  // - Alimentos intercambiables (opciones equivalentes)
  // - Lista de compra generada automaticamente
  // - Horarios de comidas
  // - Hidratacion diaria objetivo
  // - buildCustomDiet() para guardar

  return () => {};
}
