/* ================================================
   MARS FIT v2 - Pure SVG Chart Renderers
   Zero dependencies. Each function creates an inline
   SVG inside the given container element.
   Uses native SVG animations with MARS cubic-bezier.
   ================================================ */

/**
 * Vertical bar chart (activity, steps, general metrics).
 * @param {HTMLElement} container
 * @param {number[]}    data   - values (auto-normalized)
 * @param {string}      color  - CSS color e.g. "#F97316"
 */
export function renderBarChart(container, data, color) {
  if (!data || !data.length) { container.innerHTML = ''; return; }
  const w = 300, h = 80, gap = 3;
  const max = Math.max(...data, 1);
  const barW = Math.max(((w - gap * (data.length - 1)) / data.length), 2);
  const rects = data.map((v, i) => {
    const bh = Math.max(2, (v / max) * h * 0.92);
    const x = i * (barW + gap);
    const y = h - bh;
    const op = (0.45 + (v / max) * 0.55).toFixed(2);
    return `<rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="2" fill="${color}" opacity="${op}">
      <animate attributeName="height" from="0" to="${bh}" dur="0.5s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1"/>
      <animate attributeName="y" from="${h}" to="${y}" dur="0.5s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1"/>
    </rect>`;
  }).join('');
  container.innerHTML = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" width="100%" height="100%">${rects}</svg>`;
}

/**
 * Sleep phases - 4 wide bars with gradient fills.
 * @param {HTMLElement} container
 * @param {{ deep:number, rem:number, light:number, awake:number }} phases - hours or minutes per phase
 */
export function renderSleepPhases(container, phases) {
  const w = 300, h = 80, barW = 56, gap = 20;
  const keys = ['deep', 'rem', 'light', 'awake'];
  const colors = {
    deep:  ['#4C1D95', '#7C3AED'],
    rem:   ['#7C3AED', '#A78BFA'],
    light: ['#A78BFA', '#C4B5FD'],
    awake: ['#F59E0B', '#FCD34D']
  };
  // Normalize: accept object or array of {phase, minutes}
  let vals;
  if (Array.isArray(phases)) {
    vals = {};
    phases.forEach(p => { vals[p.phase] = p.minutes || 0; });
  } else {
    vals = phases;
  }
  const max = Math.max(...keys.map(k => vals[k] || 0), 1);
  const defs = keys.map((k, i) =>
    `<linearGradient id="sp${i}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${colors[k][0]}"/>
      <stop offset="100%" stop-color="${colors[k][1]}"/>
    </linearGradient>`
  ).join('');
  const bars = keys.map((k, i) => {
    const v = vals[k] || 0;
    const bh = Math.max(4, (v / max) * h * 0.85);
    const x = i * (barW + gap) + 18;
    const y = h - bh;
    return `<rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="6" fill="url(#sp${i})">
      <animate attributeName="height" from="0" to="${bh}" dur="0.5s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1"/>
      <animate attributeName="y" from="${h}" to="${y}" dur="0.5s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1"/>
    </rect>
    <text x="${x + barW / 2}" y="${h + 14}" text-anchor="middle" fill="#8b8b8b" font-size="9" font-family="Chakra Petch,sans-serif" letter-spacing="0.5">${k.toUpperCase()}</text>`;
  }).join('');
  container.innerHTML = `<svg viewBox="0 0 ${w} ${h + 18}" preserveAspectRatio="xMidYEnd meet" width="100%" height="100%"><defs>${defs}</defs>${bars}</svg>`;
}

/**
 * BPM equalizer bars (heart rate card).
 * @param {HTMLElement} container
 * @param {number[]}    data   - BPM samples
 * @param {string}      color  - e.g. "#EF4466"
 */
export function renderBpmBars(container, data, color) {
  if (!data || !data.length) { container.innerHTML = ''; return; }
  const w = 300, h = 60, gap = 2;
  const barW = Math.max(((w - gap * (data.length - 1)) / data.length), 2);
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const rects = data.map((v, i) => {
    const normalized = (v - min) / range;
    const bh = Math.max(3, normalized * h * 0.88 + h * 0.08);
    const x = i * (barW + gap);
    const y = h - bh;
    const op = (0.35 + normalized * 0.65).toFixed(2);
    const delay = (i * 0.012).toFixed(3);
    return `<rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="1.5" fill="${color}" opacity="${op}">
      <animate attributeName="height" from="0" to="${bh}" begin="${delay}s" dur="0.35s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1"/>
      <animate attributeName="y" from="${h}" to="${y}" begin="${delay}s" dur="0.35s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1"/>
    </rect>`;
  }).join('');
  container.innerHTML = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" width="100%" height="100%">${rects}</svg>`;
}

/**
 * Smooth wave line with gradient fill (sleep trend, wellness score).
 * Uses Catmull-Rom to cubic bezier conversion for smooth curves.
 * @param {HTMLElement} container
 * @param {number[]}    data  - values
 * @param {string}      color - e.g. "#A855F7"
 */
export function renderWaveLine(container, data, color) {
  if (!data || data.length < 2) { container.innerHTML = ''; return; }
  const w = 300, h = 70, pad = 4;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const pts = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: h - pad - ((v - min) / range) * (h - pad * 2)
  }));
  // Catmull-Rom spline to smooth bezier path
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  const fillPath = d + ` L${pts[pts.length - 1].x.toFixed(1)},${h} L${pts[0].x.toFixed(1)},${h} Z`;
  const uid = 'wf' + Math.random().toString(36).slice(2, 7);
  const pathLen = 600;
  container.innerHTML = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" width="100%" height="100%">
    <defs>
      <linearGradient id="${uid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <path d="${fillPath}" fill="url(#${uid})"/>
    <path d="${d}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round"
      stroke-dasharray="${pathLen}" stroke-dashoffset="${pathLen}">
      <animate attributeName="stroke-dashoffset" from="${pathLen}" to="0" dur="0.9s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1"/>
    </path>
  </svg>`;
}

/**
 * Semicircular gauge (balance, overall score).
 * @param {HTMLElement} container - should have class "gauge-semi"
 * @param {number}      percent  - 0 to 100
 * @param {string}      label    - e.g. "Balance"
 */
export function renderGaugeSemi(container, percent, label) {
  const size = 160, stroke = 14;
  const r = (size - stroke) / 2;
  const circ = Math.PI * r; // half-circle arc length
  const offset = circ - (percent / 100) * circ;
  const uid = 'gg' + Math.random().toString(36).slice(2, 7);
  container.innerHTML = `<svg viewBox="0 0 ${size} ${size / 2 + 10}" width="100%" height="100%">
    <defs>
      <linearGradient id="${uid}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#06B6D4"/>
        <stop offset="50%" stop-color="#22C55E"/>
        <stop offset="100%" stop-color="#DA0704"/>
      </linearGradient>
    </defs>
    <path d="M${stroke / 2},${size / 2} A${r},${r} 0 0,1 ${size - stroke / 2},${size / 2}"
      fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="${stroke}" stroke-linecap="round"/>
    <path d="M${stroke / 2},${size / 2} A${r},${r} 0 0,1 ${size - stroke / 2},${size / 2}"
      fill="none" stroke="url(#${uid})" stroke-width="${stroke}" stroke-linecap="round"
      stroke-dasharray="${circ.toFixed(1)}" stroke-dashoffset="${offset.toFixed(1)}">
      <animate attributeName="stroke-dashoffset" from="${circ.toFixed(1)}" to="${offset.toFixed(1)}" dur="1s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1"/>
    </path>
  </svg>
  <span class="gauge-semi__value">${Math.round(percent)}%</span>
  <span class="gauge-semi__label">${label}</span>`;
}
