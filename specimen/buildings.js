// Building parts for Follies, in one oblique view (depth runs up and to the right): boxes with arched windows,
// stairs whose treads and risers show, an observatory, a pinwheel framed in an arch, and plants. Fills are colourway
// roles; side faces are the fill darkened toward ink and stippled, like the triptych's shaded walls.
;(function () {
  const SG = window.SG
  const M = SG.motifs
  const n = SG.n
  const DEPTH = [24, -15]
  const shade = (f, k = 84) => `color-mix(in oklab, var(--${f}) ${k}%, var(--ink))`
  const tintOf = (f, k = 45) => `color-mix(in oklab, var(--${f}) ${k}%, var(--paper))`
  const quad = (pts) => `M ${pts.map(([x, y]) => `${n(x)} ${n(y)}`).join(' L ')} Z`
  const archPath = (x, base, w, h) => {
    const r = w / 2
    const spring = Math.min(base, base - h + r)
    return `M ${n(x)} ${n(base)} V ${n(spring)} A ${n(r)} ${n(r)} 0 0 1 ${n(x + w)} ${n(spring)} V ${n(base)} Z`
  }

  /** A box: front face, top and right side, with a row of arched cavities in ink on the front. */
  function box({ x, y, w, h, fill, L, id, depth = 1, windows = 0, top }) {
    const [dx, dy] = [DEPTH[0] * depth, DEPTH[1] * depth]
    const side = quad([[x + w, y], [x + w + dx, y + dy], [x + w + dx, y + h + dy], [x + w, y + h]])
    let out =
      M.shape(side, shade(fill), L) +
      M.tint(side, `url(#${id}-stipple)`) +
      M.shape(quad([[x, y], [x + dx, y + dy], [x + w + dx, y + dy], [x + w, y]]), top || tintOf(fill), L) +
      M.shape(quad([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]), fill, L)
    if (windows) {
      const ww = Math.min(26, w / (windows * 1.9))
      const gap = (w - windows * ww) / (windows + 1)
      const wh = Math.min(h * 0.5, ww * 2.1)
      for (let i = 0; i < windows; i++) out += M.shape(archPath(x + gap + i * (ww + gap), y + h * 0.22 + wh, ww, wh), 'ink', L)
    }
    return out
  }

  /** A stair rising to the left from (x0, y0) to (x1, y1): paper treads, shaded risers, a coloured stringer. */
  function steps({ x0, y0, x1, y1, count, fill, L, id, depth = 1.1, under = 26 }) {
    const run = (x0 - x1) / count
    const rise = (y0 - y1) / count
    const [dx, dy] = [DEPTH[0] * depth, DEPTH[1] * depth]
    let parts = ''
    let profile = `M ${n(x0)} ${n(y0 + under)} L ${n(x0)} ${n(y0)}`
    for (let k = 0, x = x0, y = y0; k < count; k++, x -= run, y -= rise) {
      parts += M.shape(quad([[x, y], [x, y - rise], [x + dx, y - rise + dy], [x + dx, y + dy]]), shade(fill, 78), L)
      parts += M.shape(quad([[x, y - rise], [x - run, y - rise], [x - run + dx, y - rise + dy], [x + dx, y - rise + dy]]), 'paper', L)
      profile += ` V ${n(y - rise)} H ${n(x - run)}`
    }
    profile += ` V ${n(y1 + under)} Z`
    return parts + M.shape(profile, fill, L) + M.tint(`M ${n(x1)} ${n(y1 + under * 0.4)} L ${n(x0)} ${n(y0 + under * 0.4)} V ${n(y0 + under)} L ${n(x1)} ${n(y1 + under)} Z`, `url(#${id}-stipple)`)
  }

  /** An observatory: a drum with windows, a ribbed dome, its slit open and a telescope looking out. */
  function observatory({ cx, base, r, fill, L, id, rs }) {
    const drum = r * 0.62
    let out = box({ x: cx - r, y: base - drum, w: r * 2, h: drum, fill, L, id, depth: 0.7, windows: 4 })
    const dcx = cx + DEPTH[0] * 0.35
    const dbase = base - drum + DEPTH[1] * 0.35
    const rd = r * 0.92
    const dome = `M ${n(dcx - rd)} ${n(dbase)} A ${n(rd)} ${n(rd)} 0 0 1 ${n(dcx + rd)} ${n(dbase)} Z`
    const clip = SG.uid(`${id}-dome`)
    const tilt = rs.between(-0.9, -0.5)
    const tx = dcx - rd * 0.1
    const ty = dbase - rd * 0.62
    const tube = (len, w0, w1) => {
      const [c, s] = [Math.cos(tilt), Math.sin(tilt)]
      const [px, py] = [-s, c]
      return quad([[tx + px * w0, ty + py * w0], [tx + c * len + px * w1, ty + s * len + py * w1], [tx + c * len - px * w1, ty + s * len - py * w1], [tx - px * w0, ty - py * w0]])
    }
    out += SG.el('clipPath', { id: clip }, SG.el('path', { d: dome }, null))
    out += M.shape(dome, 'paper', L)
    out += M.tint(M.crescent(dcx, dbase, rd, -rd * 0.55, -rd * 0.25), `url(#${id}-stipple)`, { 'clip-path': `url(#${clip})` })
    let ribs = ''
    for (const k of [-0.62, -0.3, 0.3, 0.62]) ribs += `M ${n(dcx + k * rd)} ${n(dbase)} Q ${n(dcx + k * rd * 0.9)} ${n(dbase - rd * 0.85)} ${n(dcx)} ${n(dbase - rd)} `
    out += M.line(ribs, L, { 'clip-path': `url(#${clip})` })
    out += M.shape(`M ${n(dcx - rd * 0.12)} ${n(dbase - rd * 0.99)} H ${n(dcx + rd * 0.12)} V ${n(dbase - rd * 0.2)} H ${n(dcx - rd * 0.12)} Z`, 'ink', L)
    out += M.shape(tube(rd * 0.95, 11, 15), 'paper', L)
    const [c, s] = [Math.cos(tilt), Math.sin(tilt)]
    out += M.shape(M.ellipse(tx + c * rd * 0.95, ty + s * rd * 0.95, 6, 14), 'ink', L, { transform: `rotate(${n((tilt * 180) / Math.PI)} ${n(tx + c * rd * 0.95)} ${n(ty + s * rd * 0.95)})` })
    return out + M.shape(`M ${n(dcx - 3)} ${n(dbase - rd - 26)} H ${n(dcx + 3)} V ${n(dbase - rd + 2)} H ${n(dcx - 3)} Z`, 'paper', L) + M.shape(M.circle(dcx, dbase - rd - 30, 6), 'paper', L)
  }

  /** A pinwheel seen through an arch whose thick frame is drawn in `frame`. */
  function pinwheelArch({ x, base, w, h, frame, colour, L, id }) {
    const t = w * 0.14
    const inner = archPath(x + t, base, w - 2 * t, h - t)
    const clip = SG.uid(`${id}-pw`)
    const r = Math.hypot(w / 2, h) * 1.05
    return (
      SG.el('clipPath', { id: clip }, SG.el('path', { d: inner }, null)) +
      SG.el('g', { 'clip-path': `url(#${clip})` }, M.pinwheel(x + w / 2, base - h * 0.45, r, colour, 0, { count: 16, twist: 0.9 })) +
      M.shape(`${archPath(x, base, w, h)} ${inner}`, frame, L, { 'fill-rule': 'evenodd' })
    )
  }

  /** Broad leaves fanning from a root, with a pompom flower or two on stems above them. */
  function plant(rs, { x, ground, height, L, id, leaf = 'leaf', bloom = 'bloom', blooms = 1 }) {
    let out = ''
    for (let i = 0; i < blooms; i++) {
      const sx = x + rs.between(-18, 18)
      const top = ground - height * rs.between(0.75, 1)
      out += M.shape(`M ${n(sx - 3)} ${n(ground)} V ${n(top)} H ${n(sx + 3)} V ${n(ground)} Z`, leaf, L)
      out += M.ball(sx, top - 12, rs.between(13, 20), bloom, L, id)
    }
    const leaves = rs.int(4, 6)
    for (let i = 0; i < leaves; i++) {
      const a = -Math.PI / 2 + (i / (leaves - 1) - 0.5) * rs.between(2.2, 2.7)
      const len = height * rs.between(0.42, 0.6)
      const [ex, ey] = [x + Math.cos(a) * len, ground + Math.sin(a) * len]
      const [px, py] = [-Math.sin(a) * len * 0.28, Math.cos(a) * len * 0.28]
      const [mx, my] = [x + Math.cos(a) * len * 0.55, ground + Math.sin(a) * len * 0.55]
      const d = `M ${n(x)} ${n(ground)} Q ${n(mx + px)} ${n(my + py)} ${n(ex)} ${n(ey)} Q ${n(mx - px)} ${n(my - py)} ${n(x)} ${n(ground)} Z`
      const half = `M ${n(x)} ${n(ground)} Q ${n(mx + px)} ${n(my + py)} ${n(ex)} ${n(ey)} Z`
      out += M.shape(d, i % 2 ? leaf : shade(leaf, 90), L) + M.tint(half, `url(#${id}-stipple)`) + M.line(`M ${n(x)} ${n(ground)} L ${n(ex)} ${n(ey)}`, L)
    }
    return out
  }

  SG.buildings = { DEPTH, box, steps, observatory, pinwheelArch, plant, archPath, shade, tintOf }
})()
