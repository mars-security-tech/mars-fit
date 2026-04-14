/* ============================================================
   MARS FIT v3 — Icon System
   40+ inline SVG icons — 24x24 viewBox, stroke 1.5, round caps
   ============================================================ */

const ICONS = {
  // ─── Fitness ──────────────────────────────────────────────
  dumbbell: `<path d="M6.5 6.5h-2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1z"/><path d="M17.5 6.5h2a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z"/><path d="M7.5 12h9"/><path d="M2 9v6"/><path d="M22 9v6"/>`,

  barbell: `<path d="M2 12h4m12 0h4"/><rect x="6" y="7" width="3" height="10" rx="1"/><rect x="15" y="7" width="3" height="10" rx="1"/><path d="M9 12h6"/>`,

  flame: `<path d="M12 22c4-3 7-6.5 7-10.5 0-3-1.5-5.5-4-7.5-.5 2-1.5 3.5-3 4.5-1.5-2-2-4.5-1.5-6.5C6.5 4.5 5 8 5 11.5 5 15.5 8 19 12 22z"/>`,

  heart: `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>`,

  "heart-pulse": `<path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l.77.78L12 20.65l3.5-3.5"/><path d="M16 13l2 2 2-3 2 2 2-2"/>`,

  moon: `<path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>`,

  "sleep-moon": `<path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/><path d="M14 5l1 2h2l-1.5 1.5.5 2L14 9.5 12 10.5l.5-2L11 7h2l1-2"/>`,

  steps: `<path d="M4 16.5C4 14 6 12 8 12s3 1 3 3-1 4-3.5 5S4 19 4 16.5z"/><path d="M13 8.5C13 6 15 4 17 4s3 1 3 3-1 4-3.5 5S13 11 13 8.5z"/>`,

  run: `<circle cx="14" cy="4" r="2"/><path d="M5.8 16.2L8 14l2.5 2 3.5-4 2 1.5"/><path d="M18 21l-2-4-4 1-3-3-4 4"/>`,

  trophy: `<path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2"/><path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2"/><path d="M6 3h12v7a6 6 0 0 1-12 0V3z"/><path d="M9 21h6"/><path d="M12 16v5"/>`,

  target: `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>`,

  shield: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,

  zap: `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,

  // ─── Nutrition ────────────────────────────────────────────
  fork: `<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>`,

  apple: `<path d="M12 3c-1.5-1.5-4-2-5.5-.5S5 6.5 6 8c1 1.3 3.2 2 6 2s5-0.7 6-2c1-1.5.5-4-1-5.5S13.5 1.5 12 3z"/><path d="M12 3v2"/><path d="M6 8c-2 2.5-2 6 0 9 2.5 3.5 4 5 6 5s3.5-1.5 6-5c2-3 2-6.5 0-9"/>`,

  water: `<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>`,

  scale: `<path d="M12 3v17"/><path d="M5 8l7-5 7 5"/><path d="M3 17a2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1"/><path d="M17 17a2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1"/><path d="M5 8l-2 9h4L5 8z"/><path d="M19 8l-2 9h4l-2-9z"/>`,

  // ─── UI / Navigation ──────────────────────────────────────
  home: `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,

  search: `<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>`,

  bell: `<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>`,

  settings: `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>`,

  users: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,

  plus: `<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>`,

  check: `<polyline points="20 6 9 17 4 12"/>`,

  x: `<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`,

  "chevron-right": `<polyline points="9 18 15 12 9 6"/>`,

  "chevron-down": `<polyline points="6 9 12 15 18 9"/>`,

  "chevron-left": `<polyline points="15 18 9 12 15 6"/>`,

  "chevron-up": `<polyline points="18 15 12 9 6 15"/>`,

  camera: `<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>`,

  star: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,

  clock: `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,

  calendar: `<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,

  chart: `<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>`,

  play: `<polygon points="5 3 19 12 5 21 5 3"/>`,

  pause: `<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>`,

  refresh: `<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>`,

  upload: `<polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>`,

  download: `<polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/>`,

  share: `<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>`,

  edit: `<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>`,

  trash: `<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>`,

  info: `<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>`,

  alert: `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>`,

  // ─── Extra ────────────────────────────────────────────────
  menu: `<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>`,

  "more-horizontal": `<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>`,

  "more-vertical": `<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>`,

  filter: `<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>`,

  "log-in": `<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>`,

  "log-out": `<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>`,

  "user-plus": `<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>`,

  eye: `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`,

  "eye-off": `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`,

  lock: `<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`,

  image: `<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>`,

  copy: `<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>`,

  "arrow-left": `<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>`,

  "arrow-right": `<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>`,
};

/**
 * Render an SVG icon by name.
 * @param {string} name  - Icon name (e.g. "dumbbell", "heart")
 * @param {number} [size=20] - Width and height in pixels
 * @returns {string} Inline SVG markup or empty string if icon not found
 */
export function icon(name, size = 20) {
  const paths = ICONS[name];
  if (!paths) {
    console.warn(`[MARS Icons] Unknown icon: "${name}"`);
    return '';
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mars-icon mars-icon--${name}" aria-hidden="true">${paths}</svg>`;
}

/**
 * Get all available icon names.
 * @returns {string[]}
 */
export function iconNames() {
  return Object.keys(ICONS);
}

/**
 * Check if an icon exists.
 * @param {string} name
 * @returns {boolean}
 */
export function hasIcon(name) {
  return name in ICONS;
}

/**
 * Render icon into a DOM element (for imperative use).
 * @param {HTMLElement} el
 * @param {string} name
 * @param {number} [size=20]
 */
export function renderIcon(el, name, size = 20) {
  el.innerHTML = icon(name, size);
}

/**
 * MARS logo isotipo (A with macron).
 * Returns inline SVG markup with:
 *   - Red macron bar (#DA0704, always red)
 *   - A body using currentColor (adapts to theme via CSS `color`)
 *
 * @param {number} [height=28] - Height in pixels (width auto-scales from viewBox)
 * @param {string} [cssClass='mars-logo-svg'] - CSS class for theming
 * @returns {string} Inline SVG markup
 */
export function marsLogo(height = 28, cssClass = 'mars-logo-svg') {
  const w = Math.round(height * (100 / 130) * 10) / 10;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 130" fill="none" width="${w}" height="${height}" class="${cssClass}" aria-hidden="true"><rect x="15" y="0" width="70" height="12.5" fill="#DA0704"/><path fill-rule="evenodd" clip-rule="evenodd" fill="currentColor" d="M 40 20 L 59 20 L 100 130 L 0 130 Z M 35 38 L 44 63 L 26 110 L 73 110 L 47 38 Z M 20.5 115 L 30.5 115 L 33.5 130 L 18 130 Z"/></svg>`;
}
