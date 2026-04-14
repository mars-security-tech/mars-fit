/* ============================================================
   MARS FIT v3 — Premium Chart Components
   SVG-based, animated, responsive, gradient-rich
   ============================================================ */

/**
 * Easing: ease-out-expo for smooth deceleration
 */
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * Animate a value from 0 to 1 over `duration` ms, calling `onFrame(t)`.
 * Returns a cancel function.
 */
function animate(duration, onFrame, onDone) {
  const start = performance.now();
  let raf;
  function tick(now) {
    const elapsed = now - start;
    const raw = Math.min(elapsed / duration, 1);
    const t = easeOutExpo(raw);
    onFrame(t);
    if (raw < 1) {
      raf = requestAnimationFrame(tick);
    } else if (onDone) {
      onDone();
    }
  }
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

/**
 * Unique ID generator for SVG defs
 */
let _uid = 0;
function uid(prefix = 'mars') {
  return `${prefix}-${++_uid}-${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * Parse a hex color into r,g,b
 */
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}


/* ============================================================
   1. RING PROGRESS — Apple Watch Activity Ring Style
   ============================================================ */

/**
 * Render a circular progress ring (like Apple Watch activity rings).
 *
 * @param {HTMLElement} container - DOM element to render into
 * @param {number} percent - 0-100 (can exceed 100 for over-achievement)
 * @param {string} color - Hex color (e.g. "#DA0704")
 * @param {string} [label=""] - Center label text
 * @param {object} [opts] - { size, strokeWidth, animate, duration }
 */
export function renderRingProgress(container, percent, color, label = '', opts = {}) {
  const {
    size = 160,
    strokeWidth = 12,
    animate: shouldAnimate = true,
    duration = 1200,
  } = opts;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const gradId = uid('ring-grad');
  const cappedPercent = Math.min(percent, 200);
  const targetOffset = circumference - (circumference * cappedPercent) / 100;

  const rgb = hexToRgb(color);
  const lighterColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.style.transform = 'rotate(-90deg)';
  svg.style.display = 'block';

  svg.innerHTML = `
    <defs>
      <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color}"/>
        <stop offset="100%" stop-color="${lighterColor.replace('0.3', '1')}"/>
      </linearGradient>
    </defs>
    <!-- Background track -->
    <circle
      cx="${center}" cy="${center}" r="${radius}"
      fill="none"
      stroke="rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.10)"
      stroke-width="${strokeWidth}"
    />
    <!-- Progress arc -->
    <circle
      class="mars-ring-progress"
      cx="${center}" cy="${center}" r="${radius}"
      fill="none"
      stroke="url(#${gradId})"
      stroke-width="${strokeWidth}"
      stroke-linecap="round"
      stroke-dasharray="${circumference}"
      stroke-dashoffset="${shouldAnimate ? circumference : targetOffset}"
    />
    <!-- Glow overlay -->
    <circle
      cx="${center}" cy="${center}" r="${radius}"
      fill="none"
      stroke="${color}"
      stroke-width="${strokeWidth + 6}"
      stroke-linecap="round"
      stroke-dasharray="${circumference}"
      stroke-dashoffset="${shouldAnimate ? circumference : targetOffset}"
      opacity="0.12"
      class="mars-ring-glow"
    />
  `;

  // Build wrapper
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'position:relative;display:inline-flex;align-items:center;justify-content:center;';
  wrapper.appendChild(svg);

  // Center label
  if (label || percent !== undefined) {
    const labelEl = document.createElement('div');
    labelEl.style.cssText = `
      position:absolute;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      font-family:'Chakra Petch',system-ui,sans-serif;
      color:#fff;
      text-align:center;
      pointer-events:none;
    `;
    const valueEl = document.createElement('span');
    valueEl.style.cssText = `font-size:${size * 0.2}px;font-weight:700;line-height:1;letter-spacing:-0.02em;`;
    valueEl.textContent = shouldAnimate ? '0' : Math.round(percent);
    valueEl.className = 'mars-ring-value';

    labelEl.appendChild(valueEl);

    if (label) {
      const labelText = document.createElement('span');
      labelText.style.cssText = `font-size:${size * 0.08}px;font-weight:500;opacity:0.6;text-transform:uppercase;letter-spacing:0.06em;margin-top:2px;font-family:'Rajdhani',system-ui,sans-serif;`;
      labelText.textContent = label;
      labelEl.appendChild(labelText);
    }

    wrapper.appendChild(labelEl);
  }

  container.innerHTML = '';
  container.appendChild(wrapper);

  // Animate
  if (shouldAnimate) {
    const progressCircle = svg.querySelector('.mars-ring-progress');
    const glowCircle = svg.querySelector('.mars-ring-glow');
    const valueEl = wrapper.querySelector('.mars-ring-value');

    animate(duration, (t) => {
      const currentOffset = circumference - (circumference * cappedPercent * t) / 100;
      progressCircle.setAttribute('stroke-dashoffset', currentOffset);
      glowCircle.setAttribute('stroke-dashoffset', currentOffset);
      if (valueEl) {
        valueEl.textContent = Math.round(percent * t);
      }
    });
  }
}


/* ============================================================
   2. BAR CHART — Gradient Bars with Labels
   ============================================================ */

/**
 * Render a vertical bar chart with gradient fills.
 *
 * @param {HTMLElement} container
 * @param {number[]} data - Array of numeric values
 * @param {string} color - Hex color
 * @param {string[]} [labels=[]] - X-axis labels
 * @param {object} [opts] - { height, barRadius, animate, duration, showValues }
 */
export function renderBarChart(container, data, color, labels = [], opts = {}) {
  const {
    height = 200,
    barRadius = 6,
    animate: shouldAnimate = true,
    duration = 800,
    showValues = true,
  } = opts;

  const maxVal = Math.max(...data, 1);
  const count = data.length;
  const padding = { top: 24, bottom: 32, left: 8, right: 8 };
  const chartH = height - padding.top - padding.bottom;
  const barGap = 8;
  const barWidth = Math.min(40, (container.clientWidth || 320) / count - barGap);
  const totalWidth = count * (barWidth + barGap) - barGap + padding.left + padding.right;

  const gradId = uid('bar-grad');
  const rgb = hexToRgb(color);

  let barsHtml = '';
  data.forEach((val, i) => {
    const barH = (val / maxVal) * chartH;
    const x = padding.left + i * (barWidth + barGap);
    const y = padding.top + chartH - barH;

    barsHtml += `
      <rect
        class="mars-bar"
        x="${x}" y="${shouldAnimate ? padding.top + chartH : y}"
        width="${barWidth}"
        height="${shouldAnimate ? 0 : barH}"
        rx="${barRadius}" ry="${barRadius}"
        fill="url(#${gradId})"
        data-target-y="${y}"
        data-target-h="${barH}"
        data-index="${i}"
      />
    `;

    // Value label
    if (showValues) {
      barsHtml += `
        <text
          x="${x + barWidth / 2}" y="${y - 6}"
          text-anchor="middle"
          fill="rgba(255,255,255,0.7)"
          font-family="'Chakra Petch',system-ui,sans-serif"
          font-size="11"
          font-weight="600"
          class="mars-bar-val"
          opacity="${shouldAnimate ? 0 : 1}"
        >${val}</text>
      `;
    }

    // X-axis label
    if (labels[i]) {
      barsHtml += `
        <text
          x="${x + barWidth / 2}" y="${height - 6}"
          text-anchor="middle"
          fill="rgba(255,255,255,0.4)"
          font-family="'Rajdhani',system-ui,sans-serif"
          font-size="11"
          font-weight="500"
        >${labels[i]}</text>
      `;
    }
  });

  const svgHtml = `
    <svg width="100%" height="${height}" viewBox="0 0 ${totalWidth} ${height}" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${color}"/>
          <stop offset="100%" stop-color="rgba(${rgb.r},${rgb.g},${rgb.b},0.3)"/>
        </linearGradient>
      </defs>
      ${barsHtml}
    </svg>
  `;

  container.innerHTML = svgHtml;

  if (shouldAnimate) {
    const bars = container.querySelectorAll('.mars-bar');
    const vals = container.querySelectorAll('.mars-bar-val');
    const chartBottom = padding.top + chartH;

    animate(duration, (t) => {
      bars.forEach((bar, i) => {
        const delay = Math.min(i * 0.08, 0.4);
        const localT = Math.max(0, Math.min((t - delay) / (1 - delay), 1));
        const targetH = parseFloat(bar.dataset.targetH);
        const targetY = parseFloat(bar.dataset.targetY);
        const currentH = targetH * localT;
        bar.setAttribute('height', currentH);
        bar.setAttribute('y', chartBottom - currentH);
      });
      vals.forEach((v, i) => {
        const delay = Math.min(i * 0.08, 0.4);
        const localT = Math.max(0, (t - delay) / (1 - delay));
        v.setAttribute('opacity', Math.min(localT * 2, 1));
      });
    });
  }
}


/* ============================================================
   3. LINE CHART — Smooth Curve with Area Fill
   ============================================================ */

/**
 * Render a smooth line chart with gradient area fill.
 *
 * @param {HTMLElement} container
 * @param {number[]} data
 * @param {string} color - Hex color
 * @param {boolean} [fill=true] - Show gradient area fill
 * @param {object} [opts] - { height, animate, duration, labels, showDots }
 */
export function renderLineChart(container, data, color, fill = true, opts = {}) {
  const {
    height = 180,
    animate: shouldAnimate = true,
    duration = 1000,
    labels = [],
    showDots = true,
  } = opts;

  if (!data || data.length < 2) return;

  const padding = { top: 16, bottom: labels.length ? 28 : 12, left: 12, right: 12 };
  const w = container.clientWidth || 320;
  const chartW = w - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal || 1;

  const gradId = uid('line-grad');
  const areaGradId = uid('area-grad');
  const rgb = hexToRgb(color);

  // Compute points
  const points = data.map((val, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartW,
    y: padding.top + chartH - ((val - minVal) / range) * chartH,
  }));

  // Catmull-Rom to cubic bezier path
  function smoothPath(pts) {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return d;
  }

  const linePath = smoothPath(points);
  const areaPath = linePath +
    ` L ${points[points.length - 1].x},${padding.top + chartH}` +
    ` L ${points[0].x},${padding.top + chartH} Z`;

  // Dots
  let dotsHtml = '';
  if (showDots) {
    points.forEach((p, i) => {
      dotsHtml += `<circle cx="${p.x}" cy="${p.y}" r="3.5" fill="${color}" stroke="rgba(0,0,0,0.3)" stroke-width="1" class="mars-line-dot" opacity="${shouldAnimate ? 0 : 1}" data-index="${i}"/>`;
    });
  }

  // Labels
  let labelsHtml = '';
  if (labels.length) {
    points.forEach((p, i) => {
      if (labels[i]) {
        labelsHtml += `<text x="${p.x}" y="${height - 4}" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="'Rajdhani',system-ui,sans-serif" font-size="10" font-weight="500">${labels[i]}</text>`;
      }
    });
  }

  const pathLength = chartW * 2; // approximation

  const svgHtml = `
    <svg width="100%" height="${height}" viewBox="0 0 ${w} ${height}" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${color}"/>
          <stop offset="100%" stop-color="rgba(${rgb.r},${rgb.g},${rgb.b},0.6)"/>
        </linearGradient>
        <linearGradient id="${areaGradId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(${rgb.r},${rgb.g},${rgb.b},0.25)"/>
          <stop offset="100%" stop-color="rgba(${rgb.r},${rgb.g},${rgb.b},0)"/>
        </linearGradient>
      </defs>
      ${fill ? `<path d="${areaPath}" fill="url(#${areaGradId})" class="mars-line-area" opacity="${shouldAnimate ? 0 : 1}"/>` : ''}
      <path
        d="${linePath}"
        fill="none"
        stroke="url(#${gradId})"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="mars-line-path"
        ${shouldAnimate ? `stroke-dasharray="${pathLength}" stroke-dashoffset="${pathLength}"` : ''}
      />
      ${dotsHtml}
      ${labelsHtml}
    </svg>
  `;

  container.innerHTML = svgHtml;

  if (shouldAnimate) {
    const path = container.querySelector('.mars-line-path');
    const area = container.querySelector('.mars-line-area');
    const dots = container.querySelectorAll('.mars-line-dot');
    const actualLength = path.getTotalLength ? path.getTotalLength() : pathLength;
    path.setAttribute('stroke-dasharray', actualLength);
    path.setAttribute('stroke-dashoffset', actualLength);

    animate(duration, (t) => {
      path.setAttribute('stroke-dashoffset', actualLength * (1 - t));
      if (area) area.setAttribute('opacity', t * 1);
      dots.forEach((dot, i) => {
        const threshold = i / (dots.length - 1);
        dot.setAttribute('opacity', t >= threshold ? 1 : 0);
      });
    });
  }
}


/* ============================================================
   4. HEATMAP — GitHub-style Contribution Grid
   ============================================================ */

/**
 * Render a heatmap grid (like GitHub contributions).
 *
 * @param {HTMLElement} container
 * @param {number[]} data - Array of values (e.g., 365 days)
 * @param {object} [opts] - { cols, cellSize, gap, colors, animate }
 */
export function renderHeatmap(container, data, opts = {}) {
  const {
    cols = 52,
    cellSize = 12,
    gap = 3,
    colors = ['#161B22', '#0E4429', '#006D32', '#26A641', '#39D353'],
    animate: shouldAnimate = true,
    duration = 1200,
  } = opts;

  const maxVal = Math.max(...data, 1);
  const rows = Math.ceil(data.length / cols);
  const w = cols * (cellSize + gap) - gap;
  const h = rows * (cellSize + gap) - gap;

  let cells = '';
  data.forEach((val, i) => {
    const col = Math.floor(i / rows);
    const row = i % rows;
    const x = col * (cellSize + gap);
    const y = row * (cellSize + gap);
    const level = Math.min(Math.floor((val / maxVal) * (colors.length - 1) + 0.5), colors.length - 1);

    cells += `<rect
      x="${x}" y="${y}"
      width="${cellSize}" height="${cellSize}"
      rx="2" ry="2"
      fill="${colors[level]}"
      class="mars-heatmap-cell"
      opacity="${shouldAnimate ? 0 : 1}"
      data-value="${val}"
      data-index="${i}"
    />`;
  });

  container.innerHTML = `
    <svg width="100%" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" style="display:block;">
      ${cells}
    </svg>
  `;

  if (shouldAnimate) {
    const cellEls = container.querySelectorAll('.mars-heatmap-cell');
    const total = cellEls.length;

    animate(duration, (t) => {
      cellEls.forEach((cell, i) => {
        const threshold = (i / total) * 0.7;
        const localT = Math.max(0, (t - threshold) / 0.3);
        cell.setAttribute('opacity', Math.min(localT, 1));
      });
    });
  }
}


/* ============================================================
   5. RADAR CHART — Muscle Profile / Performance Spider
   ============================================================ */

/**
 * Render a radar/spider chart.
 *
 * @param {HTMLElement} container
 * @param {number[]} data - Values 0-100 for each axis
 * @param {string[]} labels - Label for each axis
 * @param {string} color - Hex color
 * @param {object} [opts] - { size, levels, animate, duration }
 */
export function renderRadar(container, data, labels, color, opts = {}) {
  const {
    size = 240,
    levels = 4,
    animate: shouldAnimate = true,
    duration = 1000,
  } = opts;

  const center = size / 2;
  const maxRadius = size / 2 - 32;
  const angleStep = (2 * Math.PI) / data.length;
  const rgb = hexToRgb(color);
  const gradId = uid('radar-grad');

  // Grid rings
  let gridHtml = '';
  for (let l = 1; l <= levels; l++) {
    const r = (l / levels) * maxRadius;
    const pts = data.map((_, i) => {
      const angle = i * angleStep - Math.PI / 2;
      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    }).join(' ');
    gridHtml += `<polygon points="${pts}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>`;
  }

  // Axis lines
  let axesHtml = '';
  data.forEach((_, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const x = center + maxRadius * Math.cos(angle);
    const y = center + maxRadius * Math.sin(angle);
    axesHtml += `<line x1="${center}" y1="${center}" x2="${x}" y2="${y}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>`;
  });

  // Data polygon
  const dataPoints = data.map((val, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (val / 100) * maxRadius;
    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
  }).join(' ');

  // Labels
  let labelsHtml = '';
  labels.forEach((lbl, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = maxRadius + 18;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    labelsHtml += `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" fill="rgba(255,255,255,0.5)" font-family="'Rajdhani',system-ui,sans-serif" font-size="11" font-weight="500">${lbl}</text>`;
  });

  // Data point dots
  let dotsHtml = '';
  data.forEach((val, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (val / 100) * maxRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    dotsHtml += `<circle cx="${x}" cy="${y}" r="3" fill="${color}" stroke="rgba(0,0,0,0.3)" stroke-width="1" class="mars-radar-dot"/>`;
  });

  container.innerHTML = `
    <svg width="100%" viewBox="0 0 ${size} ${size}" preserveAspectRatio="xMidYMid meet" style="display:block;">
      <defs>
        <radialGradient id="${gradId}">
          <stop offset="0%" stop-color="rgba(${rgb.r},${rgb.g},${rgb.b},0.30)"/>
          <stop offset="100%" stop-color="rgba(${rgb.r},${rgb.g},${rgb.b},0.05)"/>
        </radialGradient>
      </defs>
      ${gridHtml}
      ${axesHtml}
      <polygon
        points="${shouldAnimate ? data.map(() => `${center},${center}`).join(' ') : dataPoints}"
        fill="url(#${gradId})"
        stroke="${color}"
        stroke-width="2"
        stroke-linejoin="round"
        class="mars-radar-polygon"
        data-target="${dataPoints}"
      />
      ${dotsHtml}
      ${labelsHtml}
    </svg>
  `;

  if (shouldAnimate) {
    const polygon = container.querySelector('.mars-radar-polygon');
    const dots = container.querySelectorAll('.mars-radar-dot');

    animate(duration, (t) => {
      const animPoints = data.map((val, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const r = (val / 100) * maxRadius * t;
        return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
      }).join(' ');
      polygon.setAttribute('points', animPoints);

      dots.forEach((dot, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const r = (data[i] / 100) * maxRadius * t;
        dot.setAttribute('cx', center + r * Math.cos(angle));
        dot.setAttribute('cy', center + r * Math.sin(angle));
      });
    });
  }
}


/* ============================================================
   6. DONUT CHART — Macro Distribution (P/C/F)
   ============================================================ */

/**
 * Render a donut chart for segmented data.
 *
 * @param {HTMLElement} container
 * @param {Array<{value: number, color: string, label: string}>} segments
 * @param {object} [opts] - { size, strokeWidth, animate, duration, centerLabel }
 */
export function renderDonut(container, segments, opts = {}) {
  const {
    size = 180,
    strokeWidth = 24,
    animate: shouldAnimate = true,
    duration = 1000,
    centerLabel = '',
  } = opts;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  let arcsHtml = '';
  let cumulativePercent = 0;

  segments.forEach((seg, i) => {
    const percent = (seg.value / total) * 100;
    const dashLength = (circumference * percent) / 100;
    const dashGap = circumference - dashLength;
    const rotation = (cumulativePercent / 100) * 360;
    cumulativePercent += percent;

    arcsHtml += `
      <circle
        cx="${center}" cy="${center}" r="${radius}"
        fill="none"
        stroke="${seg.color}"
        stroke-width="${strokeWidth}"
        stroke-dasharray="${shouldAnimate ? '0 ' + circumference : dashLength + ' ' + dashGap}"
        stroke-dashoffset="0"
        stroke-linecap="round"
        transform="rotate(${rotation - 90} ${center} ${center})"
        class="mars-donut-arc"
        data-target-dash="${dashLength}"
        data-target-gap="${dashGap}"
        data-index="${i}"
        style="transition: stroke-dasharray ${duration}ms cubic-bezier(0.16,1,0.3,1);"
      />
    `;
  });

  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'position:relative;display:inline-flex;align-items:center;justify-content:center;';

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.style.display = 'block';
  svg.innerHTML = arcsHtml;
  wrapper.appendChild(svg);

  // Center label
  if (centerLabel) {
    const labelEl = document.createElement('div');
    labelEl.style.cssText = `
      position:absolute;
      display:flex;
      flex-direction:column;
      align-items:center;
      font-family:'Rajdhani',system-ui,sans-serif;
      color:rgba(255,255,255,0.6);
      font-size:${size * 0.08}px;
      font-weight:500;
      text-transform:uppercase;
      letter-spacing:0.04em;
    `;
    labelEl.textContent = centerLabel;
    wrapper.appendChild(labelEl);
  }

  // Legend
  const legend = document.createElement('div');
  legend.style.cssText = 'display:flex;flex-wrap:wrap;gap:12px;margin-top:12px;justify-content:center;';
  segments.forEach((seg) => {
    const item = document.createElement('div');
    item.style.cssText = 'display:flex;align-items:center;gap:6px;font-family:"Rajdhani",system-ui,sans-serif;font-size:13px;color:rgba(255,255,255,0.6);font-weight:500;';
    item.innerHTML = `<span style="width:8px;height:8px;border-radius:50%;background:${seg.color};flex-shrink:0;"></span>${seg.label} ${Math.round((seg.value / total) * 100)}%`;
    legend.appendChild(item);
  });

  container.innerHTML = '';
  container.appendChild(wrapper);
  container.appendChild(legend);

  if (shouldAnimate) {
    const arcs = svg.querySelectorAll('.mars-donut-arc');
    // Trigger CSS transition by setting target values
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        arcs.forEach((arc) => {
          const dash = arc.dataset.targetDash;
          const gap = arc.dataset.targetGap;
          arc.setAttribute('stroke-dasharray', `${dash} ${gap}`);
        });
      });
    });
  }
}


/* ============================================================
   UTILITY: Counter Animation (for stat numbers)
   ============================================================ */

/**
 * Animate a number counting up.
 *
 * @param {HTMLElement} el - Element whose textContent will be updated
 * @param {number} target - Target number
 * @param {object} [opts] - { duration, decimals, prefix, suffix }
 */
export function animateCounter(el, target, opts = {}) {
  const {
    duration = 1000,
    decimals = 0,
    prefix = '',
    suffix = '',
  } = opts;

  const start = parseFloat(el.textContent) || 0;
  const delta = target - start;

  el.setAttribute('data-counting', '');

  animate(duration, (t) => {
    const current = start + delta * t;
    el.textContent = prefix + current.toFixed(decimals) + suffix;
  }, () => {
    el.textContent = prefix + target.toFixed(decimals) + suffix;
    el.removeAttribute('data-counting');
  });
}
