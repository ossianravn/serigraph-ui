// Follies: seeded surreal architecture in the triptych's manner, drawn as SVG from a seed. Every fill is a colourway
// role (--structure, --stair, --platform, --sun, --bloom, --leaf, --cloud), so one drawing reprints in every colourway.
// Two templates for the specimen: a poster (heroes) and a window (an arch-topped card image).
;(function () {
  const SG = window.SG
  const M = SG.motifs
  const n = SG.n

  function arcade(rs, { x0, top, ground, L, id }) {
    const count = rs.int(3, 5)
    const bay = rs.between(118, 146)
    const pier = 30
    const deck = 36
    const x1 = x0 + count * bay + pier
    const [dx, dy] = [22, -14]
    const face = (ox, oy) => {
      let d = `M ${n(x0 + ox)} ${n(top + oy)} H ${n(x1 + ox)} V ${n(ground + oy)} H ${n(x0 + ox)} Z`
      for (let i = 0; i < count; i++) {
        const a = x0 + pier + i * bay + ox
        const c = a + bay - pier
        const r = (c - a) / 2
        const spring = top + deck + r + oy
        d += ` M ${n(a)} ${n(ground + oy)} V ${n(spring)} A ${n(r)} ${n(r)} 0 0 1 ${n(c)} ${n(spring)} V ${n(ground + oy)} Z`
      }
      return d
    }
    const back = face(dx, dy)
    const walk = `M ${n(x0)} ${n(top)} H ${n(x1)} L ${n(x1 + dx)} ${n(top + dy)} H ${n(x0 + dx)} Z`
    let louvered = ''
    if (rs.chance(0.7)) {
      const i = rs.int(0, count - 1)
      const a = x0 + pier + i * bay
      const c = a + bay - pier
      const r = (c - a) / 2
      const spring = top + deck + r
      louvered = M.shape(`M ${n(a)} ${n(ground)} V ${n(spring)} A ${n(r)} ${n(r)} 0 0 1 ${n(c)} ${n(spring)} V ${n(ground)} Z`, `url(#${id}-louvers)`, L)
    }
    return {
      x1,
      top,
      svg:
        M.shape(back, 'structure-shade', L, { 'fill-rule': 'evenodd' }) +
        M.tint(back, `url(#${id}-stipple)`, { 'fill-rule': 'evenodd' }) +
        M.shape(walk, 'walk', L) +
        louvered +
        M.shape(face(0, 0), 'structure', L, { 'fill-rule': 'evenodd' }),
    }
  }

  function platform(rs, { cx, cy, rx, ground, L, id, dome }) {
    const ry = rx * 0.2
    const cw = rx * 0.2
    const column = `M ${n(cx - cw)} ${n(cy)} H ${n(cx + cw)} V ${n(ground)} H ${n(cx - cw)} Z`
    const shadow = `M ${n(cx + cw * 0.15)} ${n(cy)} H ${n(cx + cw)} V ${n(ground)} H ${n(cx + cw * 0.15)} Z`
    let out = M.shape(column, 'platform', L) + M.tint(shadow, `url(#${id}-stipple)`)
    out += M.shape(M.ellipse(cx, cy + ry * 0.75, rx, ry), 'ink', L) + M.shape(M.ellipse(cx, cy, rx, ry), 'platform', L)
    if (dome) {
      const rd = rx * rs.between(0.38, 0.48)
      const base = cy - ry * 0.15
      const half = `M ${n(cx - rd)} ${n(base)} A ${n(rd)} ${n(rd)} 0 0 1 ${n(cx + rd)} ${n(base)} Z`
      const slot = `M ${n(cx - rd * 0.12)} ${n(base - rd * 0.98)} H ${n(cx + rd * 0.12)} V ${n(base - rd * 0.25)} H ${n(cx - rd * 0.12)} Z`
      const clip = SG.uid(`${id}-dome`)
      out +=
        SG.el('clipPath', { id: clip }, SG.el('path', { d: half }, null)) +
        M.shape(half, 'paper', L) +
        M.tint(M.crescent(cx, base, rd, -rd * 0.5, -rd * 0.3), `url(#${id}-stipple)`, { 'clip-path': `url(#${clip})` }) +
        M.shape(slot, 'ink', L) +
        M.line(`M ${n(cx - rd * 0.55)} ${n(base - rd * 0.83)} Q ${n(cx - rd * 0.42)} ${n(base - rd * 0.4)} ${n(cx - rd * 0.55)} ${n(base)}`, L)
    }
    return out
  }

  /** A staircase rising from (x0, y0) to (x1, y1), seen from below: a stringer over a louvered underside. */
  function stair(rs, { x0, y0, x1, y1, L, id }) {
    const steps = rs.int(10, 14)
    const run = (x1 - x0) / steps
    const rise = (y0 - y1) / steps
    const T = 24
    let d = `M ${n(x0)} ${n(y0 + 60)} V ${n(y0)}`
    for (let i = 0, y = y0, x = x0; i < steps; i++) {
      y -= rise
      x += run
      d += ` V ${n(y)} H ${n(x)}`
    }
    const xb = x1 - ((y0 + 60 - (y1 + T)) * run) / rise
    d += ` V ${n(y1 + T)} L ${n(xb)} ${n(y0 + 60)} Z`
    const [ux, uy] = [10, 30]
    const under = `M ${n(x1)} ${n(y1 + T)} L ${n(xb)} ${n(y0 + 60)} L ${n(xb + ux)} ${n(y0 + 60 + uy)} L ${n(x1 + ux)} ${n(y1 + T + uy)} Z`
    return M.shape(under, `url(#${id}-louvers)`, L) + M.shape(d, 'stair', L)
  }

  function flower(rs, { x, head, ground, L, id }) {
    const r = rs.between(16, 24)
    const w = 7
    let out = M.shape(`M ${n(x - w / 2)} ${n(ground)} V ${n(head)} H ${n(x + w / 2)} V ${n(ground)} Z`, 'leaf', L)
    const leaf = (ly, dir, len) =>
      `M ${n(x)} ${n(ly)} Q ${n(x + dir * len * 0.2)} ${n(ly - len * 0.75)} ${n(x + dir * len)} ${n(ly - len * 0.6)} ` +
      `Q ${n(x + dir * len * 0.75)} ${n(ly + len * 0.02)} ${n(x)} ${n(ly)} Z`
    for (const dir of [-1, 1]) {
      const ly = rs.between(head + 70, head + 140)
      const len = rs.between(42, 64)
      out += M.shape(leaf(ly, dir, len), 'leaf', L)
      out += M.line(`M ${n(x)} ${n(ly)} Q ${n(x + dir * len * 0.45)} ${n(ly - len * 0.45)} ${n(x + dir * len * 0.92)} ${n(ly - len * 0.58)}`, L)
    }
    return out + M.ball(x, head - r * 0.6, r, 'bloom', L, id)
  }

  function poster(seed, { L, pitch }) {
    const [W, H, ground] = [1200, 560, 640]
    const id = SG.uid('folly')
    const rs = (label) => SG.stream(seed, label)
    const flip = rs('layout').chance(0.5)
    const sun = rs('sun')
    const arc = arcade(rs('arcade'), { x0: rs('arcade-x').between(70, 170), top: rs('arcade-y').between(205, 250), ground, L, id })
    const pf = rs('platform')
    const px = pf.between(Math.max(arc.x1 + 160, 850), 1030)
    const py = pf.between(255, 300)
    const rx = pf.between(110, 140)
    const scene =
      M.pinwheel(sun.between(560, 760), sun.between(110, 160), sun.between(62, 84), 'sun', L, { turn: sun.next() * 6 }) +
      M.scatter(rs('sky'), { x0: 30, y0: 24, x1: 1170, y1: 220, L, sparkles: 6, rings: 5, dots: 8 }) +
      M.cloudBank(rs('back'), { x0: 0, x1: W, base: ground, top: rs('back-top').between(275, 320), rmin: 46, rmax: 92, fill: 'paper', L, id }) +
      arc.svg +
      stair(rs('stair'), { x0: px - rx - rs('stair-x').between(260, 330), y0: 520, x1: px - rx * 0.55, y1: py + rx * 0.08, L, id }) +
      platform(pf, { cx: px, cy: py, rx, ground, L, id, dome: pf.chance(0.75) }) +
      flowers(rs('flowers'), { ground, L, id }) +
      M.cloudBank(rs('front'), { x0: 0, x1: W, base: ground, top: rs('front-top').between(415, 455), rmin: 36, rmax: 74, fill: 'cloud', L, id }) +
      M.scatter(rs('low'), { x0: 40, y0: 470, x1: 1160, y1: 540, L, sparkles: 2, rings: 2, dots: 4, size: [7, 11] })
    const body = flip ? SG.el('g', { transform: `translate(${W} 0) scale(-1 1)` }, scene) : scene
    return { W, H, svg: M.defs(id, { pitch }) + body }
  }

  function flowers(fs, { ground, L, id }) {
    let out = ''
    const count = fs.int(2, 4)
    for (let i = 0; i < count; i++) {
      out += flower(fs, { x: i % 2 === 0 ? fs.between(30, 230) : fs.between(1000, 1170), head: fs.between(330, 410), ground, L, id })
    }
    return out
  }

  /**
   * The city: the triptych's density. Layered cloud strata, a sun, an arcade with a louvered arch, a tower with an
   * observatory, a block framing a pinwheel, a stair whose treads show, plants, and two cloud banks in front.
   */
  function city(seed, { L, pitch }) {
    const [W, H, ground] = [1200, 560, 640]
    const B = SG.buildings
    const id = SG.uid('folly')
    const rs = (label) => SG.stream(seed, label)
    const flip = rs('layout').chance(0.5)
    const sun = rs('sun')
    const sky = rs('sky')
    const arc = arcade(rs('arcade'), { x0: rs('arcade-x').between(50, 110), top: rs('arcade-y').between(250, 285), ground, L, id })
    const tw = rs('tower')
    const tx = tw.between(820, 870)
    const tWidth = tw.between(150, 175)
    const ty = tw.between(285, 325)
    const bk = rs('block')
    const bx = Math.min(tx - 190, Math.max(arc.x1 - 40, bk.between(560, 620)))
    const by = bk.between(350, 380)
    const sideBox = tw.chance(0.6)
    const scene =
      M.shape(M.circle(sun.between(170, 300), sun.between(140, 175), sun.between(68, 88)), 'sun', L) +
      M.scatter(sky, { x0: 30, y0: 60, x1: 1170, y1: 230, L, sparkles: 7, rings: 5, dots: 9 }) +
      M.cloudBank(rs('strata-a'), { x0: -20, x1: sky.between(380, 480), base: 322, top: 262, rmin: 18, rmax: 32, fill: 'paper', L, id, floating: true }) +
      M.cloudBank(rs('strata-b'), { x0: sky.between(680, 760), x1: W + 20, base: 292, top: 236, rmin: 16, rmax: 30, fill: 'paper', L, id, floating: true }) +
      (sideBox ? B.box({ x: tx + tWidth + 26, y: ty + 90, w: 84, h: ground - ty - 90, fill: 'tone-2', L, id, windows: 2 }) : '') +
      B.box({ x: tx, y: ty, w: tWidth, h: ground - ty, fill: 'tone-1', L, id, windows: 3 }) +
      B.observatory({ cx: tx + tWidth / 2, base: ty + B.DEPTH[1] * 0.5, r: tWidth * 0.42, fill: 'plane-2', L, id, rs: tw }) +
      arc.svg +
      M.cloudBank(rs('mid'), { x0: 0, x1: W, base: ground, top: rs('mid-top').between(405, 430), rmin: 32, rmax: 60, fill: 'paper', L, id }) +
      B.box({ x: bx, y: by, w: 190, h: ground - by, fill: 'tone-3', L, id }) +
      B.pinwheelArch({ x: bx + 34, base: by + 178, w: 122, h: 150, frame: 'leaf', colour: 'bloom', L, id }) +
      B.steps({ x0: bx - 8, y0: 580, x1: bx - 8 - rs('steps').between(230, 270), y1: arc.top, count: rs('steps').int(11, 14), fill: 'stair', L, id, depth: 2 }) +
      M.cloudBank(rs('front'), { x0: 0, x1: W, base: ground, top: rs('front-top').between(492, 512), rmin: 28, rmax: 56, fill: 'cloud', L, id }) +
      B.plant(rs('plant-a'), { x: rs('plant-a').between(70, 150), ground: 600, height: 250, L, id, blooms: 2 }) +
      B.plant(rs('plant-b'), { x: rs('plant-b').between(1050, 1140), ground: 600, height: 220, L, id, blooms: 1 }) +
      M.scatter(rs('low'), { x0: 260, y0: 518, x1: 940, y1: 548, L, sparkles: 3, rings: 2, dots: 4, size: [7, 11] })
    const body = flip ? SG.el('g', { transform: `translate(${W} 0) scale(-1 1)` }, scene) : scene
    return { W, H, svg: M.defs(id, { pitch }) + body }
  }

  function windowScene(seed, { L, pitch }) {
    const [W, H, ground] = [300, 320, 360]
    const id = SG.uid('folly')
    const rs = (label) => SG.stream(seed, label)
    const sun = rs('sun')
    const scene =
      M.pinwheel(sun.between(200, 240), sun.between(70, 96), sun.between(30, 38), 'sun', L, { turn: sun.next() * 6 }) +
      M.scatter(rs('sky'), { x0: 20, y0: 20, x1: 180, y1: 120, L, sparkles: 2, rings: 2, dots: 3, size: [6, 10] }) +
      M.cloudBank(rs('back'), { x0: 0, x1: W, base: ground, top: 170, rmin: 26, rmax: 44, fill: 'paper', L, id }) +
      platform(rs('platform'), { cx: rs('px').between(120, 170), cy: 180, rx: 78, ground, L, id, dome: true }) +
      M.cloudBank(rs('front'), { x0: 0, x1: W, base: ground, top: 236, rmin: 22, rmax: 38, fill: 'cloud', L, id })
    return { W, H, svg: M.defs(id, { pitch }) + scene }
  }

  Object.assign(poster, { W: 1200, H: 560 })
  Object.assign(city, { W: 1200, H: 560 })
  Object.assign(windowScene, { W: 300, H: 320 })
  const templates = { poster, city, window: windowScene }

  /** Draw the folly named by data-folly with data-seed into el, sliced to fill it. */
  function mount(el) {
    const w = el.clientWidth
    const h = el.clientHeight
    if (!w || !h) return
    const make = templates[el.dataset.folly] || poster
    const scale = Math.max(w / make.W, h / make.H)
    const { W, H, svg } = make(el.dataset.seed || 'serigraph', { L: SG.linePx(el), pitch: Math.max(2.6, 3.2 / scale) })
    el.innerHTML = SG.el('svg', { class: 'folly', viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'xMidYMax slice', 'aria-hidden': 'true', focusable: 'false' }, svg)
  }

  const sizes = new WeakMap()
  const observer = new ResizeObserver((entries) => {
    for (const e of entries) {
      const key = `${Math.round(e.contentRect.width)}x${Math.round(e.contentRect.height)}`
      if (sizes.get(e.target) !== key) {
        sizes.set(e.target, key)
        mount(e.target)
      }
    }
  })

  SG.follies = {
    templates,
    mount,
    mountAll(root = document) {
      root.querySelectorAll('[data-folly]').forEach((el) => observer.observe(el))
    },
    redrawAll(root = document) {
      root.querySelectorAll('[data-folly]').forEach(mount)
    },
  }
})()
