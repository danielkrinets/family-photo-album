// Vanilla-JS port of React Bits' GlassSurface. See glass-surface.css for styles.
function createGlassSurface(container, options = {}) {
  const {
    borderRadius = 24,
    borderWidth = 0.07,
    brightness = 50,
    opacity = 0.93,
    blur = 11,
    displace = 0,
    backgroundOpacity = 0.1,
    saturation = 1.5,
    distortionScale = -140,
    redOffset = -20,
    greenOffset = 0,
    blueOffset = 20,
    xChannel = 'R',
    yChannel = 'G',
    mixBlendMode = 'difference',
  } = options;

  const uid = Math.random().toString(36).slice(2);
  const filterId = `glass-filter-${uid}`;
  const redGradId = `red-grad-${uid}`;
  const blueGradId = `blue-grad-${uid}`;

  container.classList.add('glass-surface');
  container.style.borderRadius = `${borderRadius}px`;
  container.style.setProperty('--glass-frost', String(backgroundOpacity));
  container.style.setProperty('--glass-saturation', String(saturation));
  container.style.setProperty('--filter-id', `url(#${filterId})`);

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('class', 'glass-surface__filter');
  svg.innerHTML = `<defs>
    <filter id="${filterId}" color-interpolation-filters="sRGB" x="0%" y="0%" width="100%" height="100%">
      <feImage x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map"></feImage>
      <feDisplacementMap data-role="red" in="SourceGraphic" in2="map" result="dispRed"></feDisplacementMap>
      <feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red"></feColorMatrix>
      <feDisplacementMap data-role="green" in="SourceGraphic" in2="map" result="dispGreen"></feDisplacementMap>
      <feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green"></feColorMatrix>
      <feDisplacementMap data-role="blue" in="SourceGraphic" in2="map" result="dispBlue"></feDisplacementMap>
      <feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue"></feColorMatrix>
      <feBlend in="red" in2="green" mode="screen" result="rg"></feBlend>
      <feBlend in="rg" in2="blue" mode="screen" result="output"></feBlend>
      <feGaussianBlur data-role="blur" in="output" stdDeviation="0.7"></feGaussianBlur>
    </filter>
  </defs>`;
  container.appendChild(svg);

  const feImage = svg.querySelector('feImage');
  const redChannel = svg.querySelector('[data-role="red"]');
  const greenChannel = svg.querySelector('[data-role="green"]');
  const blueChannel = svg.querySelector('[data-role="blue"]');
  const gaussianBlur = svg.querySelector('[data-role="blur"]');

  function generateDisplacementMap() {
    const rect = container.getBoundingClientRect();
    const w = rect.width || 400;
    const h = rect.height || 200;
    const edge = Math.min(w, h) * (borderWidth * 0.5);
    const svgContent = `
      <svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${w}" height="${h}" fill="black"/>
        <rect x="0" y="0" width="${w}" height="${h}" rx="${borderRadius}" fill="url(#${redGradId})"/>
        <rect x="0" y="0" width="${w}" height="${h}" rx="${borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode:${mixBlendMode}"/>
        <rect x="${edge}" y="${edge}" width="${w - edge * 2}" height="${h - edge * 2}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)"/>
      </svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
  }

  function update() {
    feImage.setAttribute('href', generateDisplacementMap());
    [
      [redChannel, redOffset],
      [greenChannel, greenOffset],
      [blueChannel, blueOffset],
    ].forEach(([el, offset]) => {
      el.setAttribute('scale', String(distortionScale + offset));
      el.setAttribute('xChannelSelector', xChannel);
      el.setAttribute('yChannelSelector', yChannel);
    });
    gaussianBlur.setAttribute('stdDeviation', String(displace));
  }

  const supportsFilter = (() => {
    const ua = navigator.userAgent;
    const isWebkit = /Safari/.test(ua) && !/Chrome/.test(ua);
    const isFirefox = /Firefox/.test(ua);
    if (isWebkit || isFirefox) return false;
    const div = document.createElement('div');
    div.style.backdropFilter = `url(#${filterId})`;
    return div.style.backdropFilter !== '';
  })();
  container.classList.add(supportsFilter ? 'glass-surface--svg' : 'glass-surface--fallback');

  const ro = new ResizeObserver(() => setTimeout(update, 0));
  ro.observe(container);
  setTimeout(update, 0);

  return { update, destroy: () => ro.disconnect() };
}

window.createGlassSurface = createGlassSurface;
