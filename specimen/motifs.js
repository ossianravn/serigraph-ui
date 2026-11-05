// The style's motifs as SVG fragments: inked shapes, stipple, louvers, pinwheels, sparkles, cloud banks and the arcade
// band. Lines use non-scaling strokes, so a motif drawn at any size keeps the specimen's one line weight.
;(function () {
  const SG = window.SG
  const n = SG.n
  const TAU = Math.PI * 2
  const fillOf = (f) => (f === 'none' ? 'none' : `var(--${f})`)

  /** A filled shape outlined in ink. fill is a token name ('coral', 'cloud', 'paper') or a url(#…) / 'none'. */
  const shape = (d, fill, L, more = {}) =>
    SG.el('path', {
      d,
      style: `fill:${fill.startsWith('url') ? fill : fillOf(fill)};stroke:var(--ink)`,
      'stroke-width': L,
      'stroke-linejoin': 'round',
      'vector-effect': 'non-scaling-stroke',
      ...more,
    }, null)

  /** An open ink line. */
  const line = (d, L, more = {}) =>
    SG.el('path', { d, style: 'fill:none;stroke:var(--ink)', 'stroke-width': L, 'stroke-linecap': 'round', 'vector-effect': 'non-scaling-stroke', ...more }, null)

  /** A filled shape with no outline (stipple and louver overlays). */
  const tint = (d, fill, more = {}) => SG.el('path', { d, style: `fill:${fill}`, ...more }, null)

  const circle = (cx, cy, r) =>
    `M ${n(cx - r)} ${n(cy)} A ${n(r)} ${n(r)} 0 1 1 ${n(cx + r)} ${n(cy)} A ${n(r)} ${n(r)} 0 1 1 ${n(cx - r)} ${n(cy)} Z`
  const ellipse = (cx, cy, rx, ry) =>
    `M ${n(cx - rx)} ${n(cy)} A ${n(rx)} ${n(ry)} 0 1 1 ${n(cx + rx)} ${n(cy)} A ${n(rx)} ${n(ry)} 0 1 1 ${n(cx - rx)} ${n(cy)} Z`

  /** Pattern defs: a staggered stipple `pitch` units apart and horizontal louvers `period` units tall. */
  function defs(id, { pitch = 3, dot = 0.55, period = 10, louverColour = 'stair' } = {}) {
    const p = pitch
    const stipple = SG.el(
      'pattern',
      { id: `${id}-stipple`, width: p, height: p, patternUnits: 'userSpaceOnUse' },
      SG.el('circle', { cx: p / 4, cy: p / 4, r: dot * p / 3, style: 'fill:var(--ink)' }, null) +
        SG.el('circle', { cx: (3 * p) / 4, cy: (3 * p) / 4, r: dot * p / 3, style: 'fill:var(--ink)' }, null),
    )
    const louvers = SG.el(
      'pattern',
      { id: `${id}-louvers`, width: 8, height: period, patternUnits: 'userSpaceOnUse' },
      SG.el('rect', { width: 8, height: period, style: `fill:var(--${louverColour})` }, null) +
        SG.el('rect', { y: period * 0.32, width: 8, height: period * 0.68, style: 'fill:var(--ink)' }, null),
    )
    return SG.el('defs', {}, stipple + louvers)
  }

  /** The part of circle (cx, cy, r) left uncovered by the same circle moved by (ox, oy): the shadow side. */
  function crescent(cx, cy, r, ox, oy) {
    const d = Math.hypot(ox, oy)
    const hh = Math.sqrt(r * r - (d * d) / 4)
    const mx = cx + ox / 2
    const my = cy + oy / 2
    const ux = -oy / d
    const uy = ox / d
    const p1 = [mx + ux * hh, my + uy * hh]
    const p2 = [mx - ux * hh, my - uy * hh]
    return `M ${n(p1[0])} ${n(p1[1])} A ${n(r)} ${n(r)} 0 1 1 ${n(p2[0])} ${n(p2[1])} A ${n(r)} ${n(r)} 0 0 0 ${n(p1[0])} ${n(p1[1])} Z`
  }

  /** A round form in fill, stippled on its lower right. */
  const ball = (cx, cy, r, fill, L, id) =>
    shape(circle(cx, cy, r), fill, 0) +
    tint(crescent(cx, cy, r, -r * 0.42, -r * 0.34), `url(#${id}-stipple)`) +
    shape(circle(cx, cy, r), 'none', L)

  /** A pinwheel: twelve curved wedges, paper and `colour`, in an ink ring. */
  function pinwheel(cx, cy, r, colour, L, { count = 12, twist = 0.6, turn = 0 } = {}) {
    let wedges = ''
    for (let i = 0; i < count; i++) {
      const a0 = turn + (i * TAU) / count
      const a1 = a0 + TAU / count
      const pt = (a, rr) => `${n(cx + Math.cos(a) * rr)} ${n(cy + Math.sin(a) * rr)}`
      const d = `M ${n(cx)} ${n(cy)} Q ${pt(a0 - twist, r * 0.55)} ${pt(a0, r)} A ${n(r)} ${n(r)} 0 0 1 ${pt(a1, r)} Q ${pt(a1 - twist, r * 0.55)} ${n(cx)} ${n(cy)} Z`
      wedges += tint(d, i % 2 ? 'var(--paper)' : `var(--${colour})`)
    }
    return SG.el('g', { class: 'pinwheel' }, wedges + shape(circle(cx, cy, r), 'none', L))
  }

  /** A four-point concave sparkle, paper inside a fine ink line. */
  function sparkle(x, y, s, L) {
    const k = s * 0.13
    const d =
      `M ${n(x)} ${n(y - s)} Q ${n(x + k)} ${n(y - k)} ${n(x + s)} ${n(y)} Q ${n(x + k)} ${n(y + k)} ${n(x)} ${n(y + s)} ` +
      `Q ${n(x - k)} ${n(y + k)} ${n(x - s)} ${n(y)} Q ${n(x - k)} ${n(y - k)} ${n(x)} ${n(y - s)} Z`
    return shape(d, 'paper', L)
  }

  /** Pinpoint dots, hollow circles and sparkles scattered in a box, avoiding nothing: keep the box empty. */
  function scatter(rs, { x0, y0, x1, y1, L, sparkles = 5, rings = 4, dots = 6, size = [8, 15] }) {
    let out = ''
    for (let i = 0; i < sparkles; i++) out += sparkle(rs.between(x0, x1), rs.between(y0, y1), rs.between(size[0], size[1]), L)
    for (let i = 0; i < rings; i++) out += shape(circle(rs.between(x0, x1), rs.between(y0, y1), rs.between(2.5, 4.5)), 'none', L)
    for (let i = 0; i < dots; i++) out += tint(circle(rs.between(x0, x1), rs.between(y0, y1), 1.6), 'var(--ink)')
    return out
  }

  /**
   * A cloud bank: puffs on a flat base, outlined as one shape (every part stroked at twice the line, then filled
   * without a line on top), with open arcs inside where one puff overlaps another.
   */
  function cloudBank(rs, { x0, x1, base, top, rmin, rmax, fill, L, id, contours = 0.65 }) {
    const puffs = []
    let x = x0 - rmax * 0.3
    while (x < x1 + rmax * 0.3) {
      const r = rs.between(rmin, rmax)
      puffs.push({ cx: x, cy: rs.between(top + r, top + r + (rmax - rmin) * 0.8), r })
      x += r * rs.between(1.05, 1.45)
    }
    const shelf = puffs.reduce((s, p) => s + p.cy, 0) / puffs.length
    const parts = puffs.map((p) => circle(p.cx, p.cy, p.r)).join(' ') + ` M ${n(x0 - rmax)} ${n(shelf)} H ${n(x1 + rmax)} V ${n(base + 40)} H ${n(x0 - rmax)} Z`
    const clip = SG.uid(`${id}-cloud`)
    let arcs = ''
    puffs.forEach((p, i) => {
      if (i === 0 || !rs.chance(contours)) return
      const a0 = (rs.between(192, 205) * Math.PI) / 180
      const a1 = (rs.between(238, 262) * Math.PI) / 180
      const pt = (a) => `${n(p.cx + Math.cos(a) * p.r)} ${n(p.cy + Math.sin(a) * p.r)}`
      arcs += `M ${pt(a0)} A ${n(p.r)} ${n(p.r)} 0 0 1 ${pt(a1)} `
    })
    return (
      SG.el('clipPath', { id: clip }, SG.el('path', { d: parts }, null)) +
      SG.el('path', { d: parts, style: 'fill:var(--ink);stroke:var(--ink)', 'stroke-width': L * 2, 'vector-effect': 'non-scaling-stroke' }, null) +
      tint(parts, fillOf(fill)) +
      (arcs ? line(arcs, L, { 'clip-path': `url(#${clip})` }) : '')
    )
  }

  /**
   * The arcade band between sections: a wall in `fill` whose arched openings show the section below, each opening
   * revealing the wall's thickness, stippled, along its right side.
   */
  function arcadeBand({ width = 1200, height = 104, bay = 124, pier = 34, rise = 62, depth = 10, fill = 'cloud', L, id }) {
    const r = (bay - pier) / 2
    const foot = height - 2
    const spring = foot - rise + r
    const arch = (a, c) => `M ${n(a)} ${n(foot)} V ${n(spring)} A ${n(r)} ${n(r)} 0 0 1 ${n(c)} ${n(spring)} V ${n(foot)}`
    let holes = ''
    let inner = ''
    let edges = ''
    for (let x = -bay; x < width + bay; x += bay) {
      const a = x + pier / 2
      const c = x + bay - pier / 2
      holes += `${arch(a, c)} Z `
      inner += `${arch(a - depth, c - depth)} Z `
      edges += `${arch(a, c)} M ${n(c)} ${n(foot)} H ${n(c + pier)} `
    }
    const big = `M ${-bay} 0 H ${width + bay} V ${n(foot)} H ${-bay} Z`
    const clip = SG.uid(`${id}-arches`)
    const reveal = { 'fill-rule': 'evenodd', 'clip-path': `url(#${clip})` }
    return (
      SG.el('clipPath', { id: clip }, SG.el('path', { d: holes }, null)) +
      tint(`${big} ${holes}`, fillOf(fill), { 'fill-rule': 'evenodd' }) +
      tint(`${big} ${inner}`, fillOf(fill), reveal) +
      tint(`${big} ${inner}`, `url(#${id}-stipple)`, reveal) +
      line(inner, L, { 'clip-path': `url(#${clip})` }) +
      line(edges, L, { 'stroke-linecap': 'square' })
    )
  }

  SG.motifs = { shape, line, tint, circle, ellipse, defs, crescent, ball, pinwheel, sparkle, scatter, cloudBank, arcadeBand }
})()
