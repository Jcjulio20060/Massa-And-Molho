(function () {
  const INK = '#2B2119';
  const CHAR = '#5A3A22';
  const CRUST = '#E8B04B';
  const TOMATO = '#B93A2C';
  const CREAM = '#F6E9C9';

  const CV = 180;
  const RAD = Math.PI / 180;

  function point(angle, radius) {
    const a = angle * RAD;
    return [CV + Math.cos(a) * radius, CV + Math.sin(a) * radius];
  }

  const RING = Array.from({ length: 7 }, (_, i) => {
    const angle = i * 360 / 7;
    const radius = 58 + (i % 3) * 5;
    const [x, y] = point(angle, radius);
    return { angle, radius, x, y };
  });

  const flecks = Array.from({ length: 12 }, (_, i) => {
    const [x1, y1] = point(i * 30 + 7, 137);
    const [x2, y2] = point(i * 30 + 17, 146);
    return `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${CHAR}" stroke-width="2.6" stroke-linecap="round" fill="none" opacity="0.55"/>`;
  }).join('');

  function basilLeaf(x, y, angle, scale) {
    const s = scale || 1;
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle}) scale(${s})">
      <path d="M 0 -17 C 11 -7 11 7 0 17 C -11 7 -11 -7 0 -17 Z" fill="#2E6F40" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M 0 -14 L 0 14" stroke="#1E4C2C" stroke-width="1.6" stroke-linecap="round" fill="none"/>
    </g>`;
  }

  function dollop(x, y, size) {
    const r = size || 13;
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="#FFF9E9" stroke="${INK}" stroke-width="1.8"/>
      <path d="M ${(x - r * 0.4).toFixed(1)} ${(y - r * 0.4).toFixed(1)} q ${r * 0.7} ${r * 0.5} ${r * 0.6} ${r * 0.8}" stroke="${CHAR}" stroke-width="1.6" stroke-linecap="round" fill="none" opacity="0.5"/>`;
  }

  function pepperoniSlice(x, y, angle) {
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle})">
      <circle r="16" fill="#B23A1D" stroke="${INK}" stroke-width="2"/>
      <circle cx="-5" cy="-4" r="2.4" fill="#E58A62"/>
      <circle cx="5" cy="5" r="2" fill="#E58A62"/>
      <circle cx="1" cy="-7" r="1.6" fill="#E58A62"/>
    </g>`;
  }

  function calabresaSlice(x, y, angle) {
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle})">
      <circle r="15" fill="#C2412C" stroke="${INK}" stroke-width="2"/>
      <circle cx="-5" cy="4" r="2" fill="#F3CEA0"/>
      <circle cx="5" cy="-4" r="2" fill="#F3CEA0"/>
      <circle cx="0" cy="8" r="1.6" fill="#F3CEA0"/>
    </g>`;
  }

  function onionArc(x, y, angle) {
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle})">
      <path d="M -18 0 a 18 18 0 0 1 36 0" stroke="#E4D7C0" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M -18 0 a 18 18 0 0 1 36 0" stroke="${INK}" stroke-width="1.2" fill="none" opacity="0.5"/>
    </g>`;
  }

  function eggSlice(x, y, angle) {
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle})">
      <ellipse rx="12" ry="9" fill="#FFFDF2" stroke="${INK}" stroke-width="2"/>
      <circle cy="1" r="4.6" fill="#E8B04B" stroke="${INK}" stroke-width="1.2"/>
    </g>`;
  }

  function hamChunk(x, y, angle) {
    return `<rect x="${(x - 11).toFixed(1)}" y="${(y - 8).toFixed(1)}" width="22" height="16" rx="4" fill="#EDB3A2" stroke="${INK}" stroke-width="1.8" transform="rotate(${angle} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
  }

  function olive(x, y) {
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
      <circle r="7" fill="#3F6B3A" stroke="${INK}" stroke-width="1.8"/>
      <circle r="2.6" fill="#F6E9C9"/>
    </g>`;
  }

  function catupirySwirl(x, y, angle) {
    return `<path d="M ${(x - 14).toFixed(1)} ${y.toFixed(1)} c 8 -12 22 -12 28 0 c 6 10 -6 14 -14 12 c -8 -2 -12 -8 -8 -13 z" fill="#FDF3DF" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round" transform="rotate(${angle} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
  }

  function gorgonzola(x, y, size) {
    const r = size || 10;
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
      <circle r="${r}" fill="#EEE9E0" stroke="${INK}" stroke-width="1.6"/>
      <path d="M ${(-r * 0.7).toFixed(1)} ${(-r * 0.5).toFixed(1)} L ${(r * 0.7).toFixed(1)} ${(r * 0.5).toFixed(1)}" stroke="#9A93A6" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M ${(-r * 0.5).toFixed(1)} ${(r * 0.6).toFixed(1)} L ${(r * 0.6).toFixed(1)} ${(-r * 0.4).toFixed(1)}" stroke="#9A93A6" stroke-width="1.4" stroke-linecap="round"/>
    </g>`;
  }

  function parmesan(x, y, angle) {
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle})">
      <path d="M 0 -7 L 7 5 L -7 5 Z" fill="#EFD98A" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>
    </g>`;
  }

  function pepperStrip(x, y, angle, color) {
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle})">
      <rect x="-11" y="-5.5" width="22" height="11" rx="5.5" fill="${color}" stroke="${INK}" stroke-width="1.8"/>
      <circle cx="-3" cy="0" r="2" fill="#6B3A26" opacity="0.5"/>
    </g>`;
  }

  function mushroom(x, y, angle) {
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle})">
      <path d="M -12 6 L -12 -2 a 12 12 0 0 1 24 0 L 12 6 Z" fill="#B98A6B" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>
      <circle cx="-5" cy="-4" r="2" fill="#E7C9AC"/>
    </g>`;
  }

  function cherryTomato(x, y) {
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8" fill="#C93030" stroke="${INK}" stroke-width="1.8"/>
      <circle cx="${(x - 2).toFixed(1)}" cy="${(y - 2).toFixed(1)}" r="1.8" fill="#E58A62"/>`;
  }

  function chickenChunk(x, y, angle) {
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle})">
      <rect x="-11" y="-8" width="22" height="16" rx="4" fill="#F4E3C4" stroke="${INK}" stroke-width="1.8"/>
      <path d="M -4 -4 L 0 0 M 3 -5 L 8 1" stroke="#C9A35E" stroke-width="1.4" stroke-linecap="round"/>
    </g>`;
  }

  function brigadeiroBite(x, y, size) {
    const r = size || 13;
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
      <circle r="${r}" fill="#6B3A26" stroke="${INK}" stroke-width="2"/>
      <circle cx="-4" cy="-3" r="1.6" fill="#FFF9E9"/>
      <circle cx="5" cy="4" r="1.6" fill="#E8B04B"/>
      <circle cx="-1" cy="6" r="1.2" fill="#FFF9E9"/>
    </g>`;
  }

  function strawberry(x, y, angle) {
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle})">
      <path d="M 0 -9 C 9 -4 8 7 0 10 C -8 7 -9 -4 0 -9 Z" fill="#C93030" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M 0 -9 L 0 -13" stroke="#2E6F40" stroke-width="2" stroke-linecap="round"/>
    </g>`;
  }

  function sprinkle(x, y, angle, color) {
    return `<path d="M ${(x - 4).toFixed(1)} ${y.toFixed(1)} L ${(x + 4).toFixed(1)} ${y.toFixed(1)}" stroke="${color}" stroke-width="2.6" stroke-linecap="round" transform="rotate(${angle} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
  }

  function base(inner, sauce, dough) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 360" class="pizza-art" aria-hidden="true">
  <circle cx="180" cy="180" r="150" fill="${CRUST}" stroke="${INK}" stroke-width="3"/>
  <circle cx="180" cy="180" r="124" fill="${sauce || TOMATO}"/>
  <circle cx="180" cy="180" r="96" fill="${dough || CREAM}" stroke="${INK}" stroke-width="1.4"/>
  ${flecks}
  ${inner}
</svg>`;
  }

  function margherita() {
    const leaves = RING.map((p, i) => basilLeaf(p.x, p.y, p.angle + 90, i % 2 ? 1 : 0.85)).join('');
    const dollops = [0, 120, 240].map(a => {
      const [x, y] = point(a, 22);
      return dollop(x, y, 15);
    }).join('');
    return base(leaves + dollops + basilLeaf(180, 180, 0, 1.2));
  }

  function calabresa() {
    const slices = RING.map(p => calabresaSlice(p.x, p.y, p.angle + 90)).join('');
    const onions = [12, 108, 204, 300].map(a => {
      const [x, y] = point(a, 24);
      return onionArc(x, y, a + 40);
    }).join('');
    return base(slices + onions);
  }

  function portuguesa() {
    const r = RING.map((p, i) => {
      if (i % 3 === 0) return eggSlice(p.x, p.y, p.angle);
      if (i % 3 === 1) return hamChunk(p.x, p.y, p.angle);
      return olive(p.x, p.y);
    }).join('');
    const inner = [48, 168, 288].map(a => {
      const [x, y] = point(a, 30);
      return onionArc(x, y, a + 30);
    }).join('');
    return base(r + inner + olive(240, 205) + hamChunk(120, 160, 20));
  }

  function quatroqueijos() {
    const swirls = RING.filter((_, i) => i % 2 === 1).map(p => catupirySwirl(p.x, p.y, p.angle + 90)).join('');
    const gorg = RING.filter((_, i) => i % 2 === 0).slice(0, 3).map(p => gorgonzola(p.x, p.y, 11)).join('');
    const parm = [30, 150, 270].map(a => {
      const [x, y] = point(a, 40);
      return parmesan(x, y, a + 20);
    }).join('');
    const mush = [0, 120, 240].map(a => {
      const [x, y] = point(a, 20);
      return dollop(x, y, 14);
    }).join('');
    return base(swirls + gorg + parm + mush + catupirySwirl(180, 180, 0));
  }

  function pepperoni() {
    const outer = RING.map(p => pepperoniSlice(p.x, p.y, p.angle + 90)).join('');
    const inner = [20, 140, 260].map(a => {
      const [x, y] = point(a, 28);
      return pepperoniSlice(x, y, a + 40);
    }).join('');
    return base(outer + inner + pepperoniSlice(180, 180, 0));
  }

  function vegetariana() {
    const peppers = [
      [RING[0], '#3F7D3F'], [RING[2], '#C2452A'], [RING[4], '#E8B04B'],
      [RING[6], '#3F7D3F']
    ].map(([p, c]) => pepperStrip(p.x, p.y, p.angle + 90, c)).join('');
    const mush = [RING[1], RING[5]].map(p => mushroom(p.x, p.y, p.angle + 90)).join('');
    const inner = [40, 160, 280].map(a => {
      const [x, y] = point(a, 26);
      return cherryTomato(x, y);
    }).join('');
    return base(peppers + mush + inner + basilLeaf(CV, CV, 45, 1.1));
  }

  function frango() {
    const chicken = RING.filter((_, i) => i % 2 === 0).map(p => chickenChunk(p.x, p.y, p.angle + 40)).join('');
    const swirls = RING.filter((_, i) => i % 2 === 1).map(p => catupirySwirl(p.x, p.y, p.angle + 90)).join('');
    const corn = [30, 150, 270].map(a => {
      const [x, y] = point(a, 28);
      return sprinkle(x, y, a + 20, '#F6E9C9');
    }).join('');
    return base(chicken + swirls + corn + catupirySwirl(180, 180, 0));
  }

  function brigadeiro() {
    const chips = [0, 45, 90, 135, 180, 225, 270, 315].map(a => {
      const [x, y] = point(a, 40);
      return sprinkle(x, y, a + 40, '#FFF9E9');
    }).join('');
    const truffles = RING.map(p => brigadeiroBite(p.x, p.y, 14)).join('');
    const berries = [30, 150, 270].map(a => {
      const [x, y] = point(a, 26);
      return strawberry(x, y, a + 90);
    }).join('');
    return base(truffles + berries + chips + brigadeiroBite(180, 180, 17), '#4A2418', '#6B3A26');
  }

  window.ILLUSTRATIONS = {
    margherita,
    calabresa,
    portuguesa,
    quatroqueijos,
    pepperoni,
    vegetariana,
    frango,
    brigadeiro
  };
})();