// A prototype of Serigraph Display, drawn as SVG: wide, round, flat capitals with a paper fill, a fine ink outline and
// one thin inline inside the left side of each stem. Each glyph is a centre-line skeleton (cap height 100) swept by a
// square pen S units wide. Drawing every skeleton twice, first in ink at S + 2 lines and then in paper at S, outlines
// the union of the strokes, counters included. Phase 1 builds the real font the same way (tools/fonts).
;(function () {
  const SG = window.SG
  const S = 21 // stem width at cap height 100
  const h = S / 2
  const GAP = 10 // space between the outer edges of neighbouring letters
  const IN = 4 // the inline sits this far from the skeleton, toward the outer edge
  const t = h
  const b = 100 - h
  const n = SG.n
  const cw = (k) => `A ${k} ${k} 0 0 1` // clockwise arc
  const ccw = (k) => `A ${k} ${k} 0 0 0` // counter-clockwise arc
  /** An inline beside a vertical stem at x, from y1 to y2. */
  const v = (x, y1, y2) => [x - IN, y1, x - IN, y2]
  /** An inline beside a diagonal, over the part between fractions f0 and f1, offset to its outer (left) side. */
  const diag = (x1, y1, x2, y2, f0, f1) => {
    const dx = x2 - x1
    const dy = y2 - y1
    const len = Math.hypot(dx, dy)
    const ox = (-dy / len) * IN
    const oy = (dx / len) * IN
    return [x1 + dx * f0 + ox, y1 + dy * f0 + oy, x1 + dx * f1 + ox, y1 + dy * f1 + oy]
  }
  /** A closed rounded rectangle skeleton. */
  const rr = (x0, y0, x1, y1, k) =>
    `M ${x0 + k} ${y0} H ${x1 - k} ${cw(k)} ${x1} ${y0 + k} V ${y1 - k} ${cw(k)} ${x1 - k} ${y1} ` +
    `H ${x0 + k} ${cw(k)} ${x0} ${y1 - k} V ${y0 + k} ${cw(k)} ${x0 + k} ${y0} Z`

  // [width, (l, r, W) => { d, inl, clip }]: l and r are the left and right skeleton lines; clip marks glyphs whose
  // diagonals run past the box and are cut flat by it.
  const G = {
    A: [84, (l, r) => {
      const k = (r - l) / 2
      return { d: `M ${l} ${b} V ${t + k} ${cw(k)} ${l + k} ${t} ${cw(k)} ${r} ${t + k} V ${b} M ${l} 63 H ${r}`, inl: [v(l, t + k, 92)] }
    }],
    B: [78, (l, r) => {
      const m = 46, k1 = 16, k2 = 19, r1 = r - 5
      return {
        d: `M ${l} ${m} H ${r - k2} ${cw(k2)} ${r} ${m + k2} V ${b - k2} ${cw(k2)} ${r - k2} ${b} H ${l} V ${t} ` +
          `H ${r1 - k1} ${cw(k1)} ${r1} ${t + k1} V ${m - k1} ${cw(k1)} ${r1 - k1} ${m} H ${l}`,
        inl: [v(l, 8, 92)],
      }
    }],
    C: [78, (l, r) => {
      const k = 26
      return { d: `M ${r} ${t} H ${l + k} ${ccw(k)} ${l} ${t + k} V ${b - k} ${ccw(k)} ${l + k} ${b} H ${r}`, inl: [v(l, t + k, b - k)] }
    }],
    D: [80, (l, r) => {
      const k = 26
      return { d: `M ${l} ${t} H ${r - k} ${cw(k)} ${r} ${t + k} V ${b - k} ${cw(k)} ${r - k} ${b} H ${l} Z`, inl: [v(l, 8, 92)] }
    }],
    E: [68, (l, r) => ({ d: `M ${r} ${t} H ${l} V ${b} H ${r} M ${l} 50 H ${r - 6}`, inl: [v(l, 8, 92)] })],
    F: [66, (l, r) => ({ d: `M ${r} ${t} H ${l} V ${b} M ${l} 52 H ${r - 8}`, inl: [v(l, 8, 92)] })],
    G: [80, (l, r) => {
      const k = 26
      return {
        d: `M ${r} ${t} H ${l + k} ${ccw(k)} ${l} ${t + k} V ${b - k} ${ccw(k)} ${l + k} ${b} H ${r} V 56 H ${r - 22}`,
        inl: [v(l, t + k, b - k)],
      }
    }],
    H: [80, (l, r) => ({ d: `M ${l} ${t} V ${b} M ${r} ${t} V ${b} M ${l} 52 H ${r}`, inl: [v(l, 8, 92)] })],
    I: [21, (l) => ({ d: `M ${l} ${t} V ${b}`, inl: [v(l, 8, 92)] })],
    J: [66, (l, r) => {
      const k = 24
      return { d: `M ${r} ${t} V ${b - k} ${cw(k)} ${r - k} ${b} H ${l}`, inl: [] }
    }],
    K: [80, (l, r, W) => ({
      d: `M ${l} ${t} V ${b} M ${W + 8} -10 L ${l + 4} 60 M ${l + 22} 46 L ${W + 8} 112`,
      inl: [v(l, 8, 92)],
      clip: true,
    })],
    L: [64, (l, r) => ({ d: `M ${l} ${t} V ${b} H ${r}`, inl: [v(l, 8, 92)] })],
    M: [94, (l, r, W) => ({
      d: `M ${l} ${t} V ${b} M ${r} ${t} V ${b} M ${l - 6} -12 L ${W / 2} 62 L ${r + 6} -12`,
      inl: [v(l, 8, 92)],
      clip: true,
    })],
    N: [80, (l, r) => ({ d: `M ${l} ${t} V ${b} M ${r} ${t} V ${b} M ${l - 2} -14 L ${r + 2} 114`, inl: [v(l, 8, 92)], clip: true })],
    O: [84, (l, r) => ({ d: rr(l, t, r, b, 28), inl: [v(l, t + 28, b - 28)] })],
    P: [76, (l, r) => {
      const m = 54, k = 20
      return { d: `M ${l} ${b} V ${t} H ${r - k} ${cw(k)} ${r} ${t + k} V ${m - k} ${cw(k)} ${r - k} ${m} H ${l}`, inl: [v(l, 8, 92)] }
    }],
    Q: [84, (l, r, W) => ({ d: `${rr(l, t, r, b, 28)} M ${W / 2 + 4} 66 L ${W + 10} 116`, inl: [v(l, t + 28, b - 28)], clip: true })],
    R: [78, (l, r, W) => {
      const m = 52, k = 20
      return {
        d: `M ${l} ${b} V ${t} H ${r - k} ${cw(k)} ${r} ${t + k} V ${m - k} ${cw(k)} ${r - k} ${m} H ${l} M ${r - 18} ${m} L ${W + 10} 116`,
        inl: [v(l, 8, 92)],
        clip: true,
      }
    }],
    S: [76, (l, r) => {
      const m = 48, k1 = (m - t) / 2, k2 = (b - m) / 2
      return {
        d: `M ${r} ${t} H ${l + k1} ${ccw(k1)} ${l} ${t + k1} ${ccw(k1)} ${l + k1} ${m} H ${r - k2} ${cw(k2)} ${r} ${m + k2} ${cw(k2)} ${r - k2} ${b} H ${l}`,
        inl: [],
      }
    }],
    T: [74, (l, r, W) => ({ d: `M ${l} ${t} H ${r} M ${W / 2} ${t} V ${b}`, inl: [v(W / 2, 24, 92)] })],
    U: [80, (l, r) => {
      const k = 26
      return { d: `M ${l} ${t} V ${b - k} ${ccw(k)} ${l + k} ${b} H ${r - k} ${ccw(k)} ${r} ${b - k} V ${t}`, inl: [v(l, 8, b - k)] }
    }],
    V: [84, (l, r, W) => ({
      d: `M ${l - 8} -14 L ${W / 2 - 9} ${b} H ${W / 2 + 9} L ${r + 8} -14`,
      inl: [diag(l - 8, -14, W / 2 - 9, b, 0.2, 0.86)],
      clip: true,
    })],
    W: [98, (l, r, W) => {
      const k = 24
      return {
        d: `M ${l} ${t} V ${b - k} ${ccw(k)} ${l + k} ${b} H ${r - k} ${ccw(k)} ${r} ${b - k} V ${t} M ${W / 2} 30 V ${b}`,
        inl: [v(l, 8, b - k)],
      }
    }],
    X: [82, (l, r, W) => ({ d: `M -8 -14 L ${W + 8} 114 M ${W + 8} -14 L -8 114`, inl: [], clip: true })],
    Y: [80, (l, r, W) => {
      const k = 20, m = 56
      return {
        d: `M ${l} ${t} V ${m - k} ${ccw(k)} ${l + k} ${m} H ${r - k} ${ccw(k)} ${r} ${m - k} V ${t} M ${W / 2} ${m} V ${b}`,
        inl: [v(l, 8, m - k)],
      }
    }],
    Z: [74, (l, r) => ({ d: `M ${l} ${t} H ${r} L ${l} ${b} H ${r}`, inl: [] })],
    0: [72, (l, r) => ({ d: rr(l, t, r, b, 26), inl: [v(l, t + 26, b - 26)] })],
    1: [50, (l, r) => ({ d: `M ${l} 26 L ${r} ${t} V ${b}`, inl: [] })],
    2: [70, (l, r) => {
      const m = 50, k = 19
      return {
        d: `M ${l} ${t} H ${r - k} ${cw(k)} ${r} ${t + k} V ${m - k} ${cw(k)} ${r - k} ${m} H ${l + k} ${ccw(k)} ${l} ${m + k} V ${b} H ${r}`,
        inl: [],
      }
    }],
    3: [70, (l, r) => {
      const k = 22
      return { d: `M ${l} ${t} H ${r - k} ${cw(k)} ${r} ${t + k} V ${b - k} ${cw(k)} ${r - k} ${b} H ${l} M ${l + 16} 50 H ${r}`, inl: [] }
    }],
    4: [74, (l, r) => ({ d: `M ${r - 12} ${b} V ${t} L ${l} 64 H ${r}`, inl: [] })],
    5: [70, (l, r) => {
      const m = 46, k = 21
      return { d: `M ${r} ${t} H ${l} V ${m} H ${r - k} ${cw(k)} ${r} ${m + k} V ${b - k} ${cw(k)} ${r - k} ${b} H ${l}`, inl: [v(l, 8, m)] }
    }],
    6: [72, (l, r) => {
      const m = 48, k = 20
      return {
        d: `M ${r} ${t} H ${l + k} ${ccw(k)} ${l} ${t + k} V ${b - k} ${ccw(k)} ${l + k} ${b} H ${r - k} ${ccw(k)} ${r} ${b - k} V ${m + k} ${ccw(k)} ${r - k} ${m} H ${l}`,
        inl: [v(l, t + k, b - k)],
      }
    }],
    7: [68, (l, r) => ({ d: `M ${l} ${t} H ${r} L ${l + 12} 116`, inl: [], clip: true })],
    8: [74, (l, r) => ({ d: `${rr(l + 4, t, r - 4, 47, 17)} ${rr(l, 47, r, b, 20)}`, inl: [] })],
    9: [72, (l, r) => {
      const m = 52, k = 20
      return {
        d: `M ${l} ${b} H ${r - k} ${ccw(k)} ${r} ${b - k} V ${t + k} ${ccw(k)} ${r - k} ${t} H ${l + k} ${ccw(k)} ${l} ${t + k} V ${m - k} ${ccw(k)} ${l + k} ${m} H ${r}`,
        inl: [v(l, t + k, m - k)],
      }
    }],
    ' ': [30, () => ({ d: '', inl: [] })],
    '.': [21, (l) => ({ d: `M ${l} ${b - 0.01} V ${b}`, inl: [] })],
    ':': [21, (l) => ({ d: `M ${l} 44 V 44.01 M ${l} ${b - 0.01} V ${b}`, inl: [] })],
    '-': [44, (l, r) => ({ d: `M ${l} 54 H ${r}`, inl: [] })],
    "'": [21, (l) => ({ d: `M ${l} ${t} V 30`, inl: [] })],
    '/': [52, (l, r, W) => ({ d: `M ${W + 4} -16 L -4 116`, inl: [], clip: true })],
    '%': [92, (l, r, W) => {
      // Two round dots (a tight ring swept by the stem reads as a disc) either side of a slash.
      const dot = (x, y) => `M ${x - 4} ${y} A 4 4 0 1 1 ${x + 4} ${y} A 4 4 0 1 1 ${x - 4} ${y} Z`
      return { d: `M ${W + 2} -16 L -2 116 ${dot(15, 20)} ${dot(W - 15, 80)}`, inl: [], clip: true }
    }],
  }
  G['’'] = G["'"]

  function layout(text) {
    let x = 0
    const items = []
    for (const ch of String(text).toUpperCase()) {
      const [W, fn] = G[ch] || G[' ']
      items.push({ x, W, ...fn(h, W - h, W) })
      x += W + GAP
    }
    return { items, width: Math.max(0, x - GAP) }
  }

  /** The word as an SVG string, its outline and inline Lu units wide. */
  function svg(text, Lu) {
    const { items, width } = layout(text)
    const pad = Lu + 1
    const id = SG.uid('lt')
    const rect = (x, y, w, hh) => SG.el('rect', { x, y, width: w, height: hh }, null)
    // Glyphs whose diagonals run past their box are cut by it: the paper at the box, the ink a line outside it.
    // Each glyph has its own clip, in its own coordinates, so a neighbour's diagonal never shows through.
    const clips = items
      .map((i, k) =>
        i.clip
          ? SG.el('clipPath', { id: `${id}-b${k}` }, rect(0, 0, i.W, 100)) +
            SG.el('clipPath', { id: `${id}-i${k}` }, rect(-Lu, -Lu, i.W + 2 * Lu, 100 + 2 * Lu))
          : '',
      )
      .join('')
    const layer = (cls, w, kind) =>
      SG.el(
        'g',
        { class: cls, 'stroke-width': w },
        items
          .map((i, k) =>
            i.d ? SG.el('path', { transform: `translate(${i.x} 0)`, d: i.d, 'clip-path': i.clip ? `url(#${id}-${kind}${k})` : null }, null) : '',
          )
          .join(''),
      )
    const inline = items
      .flatMap((i) => i.inl.map(([x1, y1, x2, y2]) => `M ${n(i.x + x1)} ${n(y1)} L ${n(i.x + x2)} ${n(y2)}`))
      .join(' ')
    const vb = [-pad, -pad, width + 2 * pad, 100 + 2 * pad]
    const inner =
      SG.el('defs', {}, clips) +
      layer('lt-ink', S + 2 * Lu, 'i') +
      layer('lt-body', S, 'b') +
      (inline ? SG.el('path', { class: 'lt-inline', d: inline, 'stroke-width': Lu }, null) : '')
    return { markup: SG.el('svg', { class: 'lettering', viewBox: vb.map(n).join(' '), 'aria-hidden': 'true', focusable: 'false' }, inner), vb }
  }

  /**
   * Draw the word in el.dataset.lettering into el, as wide as el allows, its cap height at most data-cap pixels.
   * The outline is the specimen's line, thickened a little for big letters (cap height / 80, at most 2.5 px).
   */
  function mount(el) {
    const text = el.dataset.lettering
    const avail = el.clientWidth
    if (!avail) return
    const { width } = layout(text)
    const fit = (avail / (width + 4)) * 100
    const cap = el.dataset.cap ? Math.min(Number(el.dataset.cap), fit) : fit
    const scale = cap / 100
    const linePx = Math.min(2.5, Math.max(SG.linePx(el), cap / 80))
    const { markup, vb } = svg(text, linePx / scale)
    el.innerHTML = markup
    const s = el.firstElementChild
    s.style.width = `${n(vb[2] * scale)}px`
    s.style.height = `${n(vb[3] * scale)}px`
  }

  const watched = new WeakMap()
  const observer = new ResizeObserver((entries) => {
    for (const e of entries) {
      const w = Math.round(e.contentRect.width)
      if (watched.get(e.target) !== w) {
        watched.set(e.target, w)
        mount(e.target)
      }
    }
  })

  SG.lettering = {
    layout,
    svg,
    mount,
    /** Draw and keep redrawing every [data-lettering] inside root as its width changes. */
    mountAll(root = document) {
      root.querySelectorAll('[data-lettering]').forEach((el) => {
        mount(el)
        observer.observe(el)
      })
    },
  }
})()
