// Building parts in one oblique view (depth runs up and to the right): boxes with arched windows, stairs whose treads
// and risers show, and an observatory. Fills are colourway roles; side faces are the fill darkened toward ink and
// stippled, like the triptych's shaded walls.
import { crescent, ellipse, circle, line, shape, stipple, tint } from "./motifs"
import { el, n, type Pen, type Rs } from "./svg"

export const DEPTH = [24, -15] as const
type Pt = readonly [number, number]

export const shade = (f: string, k = 84) =>
  `color-mix(in oklab, var(--${f}) ${k}%, var(--ink))`
export const tintOf = (f: string, k = 45) =>
  `color-mix(in oklab, var(--${f}) ${k}%, var(--paper))`
export const quad = (pts: readonly Pt[]) =>
  `M ${pts.map(([x, y]) => `${n(x)} ${n(y)}`).join(" L ")} Z`
export const archPath = (x: number, base: number, w: number, h: number) => {
  const r = w / 2
  const spring = Math.min(base, base - h + r)
  return `M ${n(x)} ${n(base)} V ${n(spring)} A ${n(r)} ${n(r)} 0 0 1 ${n(x + w)} ${n(spring)} V ${n(base)} Z`
}

/** A box: front face, top and right side, with a row of arched ink cavities on the front. */
export function box(
  p: Pen,
  {
    x,
    y,
    w,
    h,
    fill,
    depth = 1,
    windows = 0,
    top,
  }: {
    x: number
    y: number
    w: number
    h: number
    fill: string
    depth?: number
    windows?: number
    top?: string
  },
) {
  const [dx, dy] = [DEPTH[0] * depth, DEPTH[1] * depth]
  const side = quad([
    [x + w, y],
    [x + w + dx, y + dy],
    [x + w + dx, y + h + dy],
    [x + w, y + h],
  ])
  let out =
    shape(p, side, shade(fill)) +
    tint(side, stipple(p)) +
    shape(
      p,
      quad([
        [x, y],
        [x + dx, y + dy],
        [x + w + dx, y + dy],
        [x + w, y],
      ]),
      top ?? tintOf(fill),
    ) +
    shape(
      p,
      quad([
        [x, y],
        [x + w, y],
        [x + w, y + h],
        [x, y + h],
      ]),
      fill,
    )
  if (windows) {
    const ww = Math.min(26, w / (windows * 1.9))
    const gap = (w - windows * ww) / (windows + 1)
    const wh = Math.min(h * 0.5, ww * 2.1)
    for (let i = 0; i < windows; i++)
      out += shape(
        p,
        archPath(x + gap + i * (ww + gap), y + h * 0.22 + wh, ww, wh),
        "ink",
      )
  }
  return out
}

/** A stair rising to the left from (x0, y0) to (x1, y1): paper treads, shaded risers, a coloured stringer. */
export function steps(
  p: Pen,
  {
    x0,
    y0,
    x1,
    y1,
    count,
    fill,
    depth = 1.1,
    under = 26,
  }: {
    x0: number
    y0: number
    x1: number
    y1: number
    count: number
    fill: string
    depth?: number
    under?: number
  },
) {
  const run = (x0 - x1) / count
  const rise = (y0 - y1) / count
  const [dx, dy] = [DEPTH[0] * depth, DEPTH[1] * depth]
  let parts = ""
  let profile = `M ${n(x0)} ${n(y0 + under)} L ${n(x0)} ${n(y0)}`
  for (let k = 0, x = x0, y = y0; k < count; k++, x -= run, y -= rise) {
    parts += shape(
      p,
      quad([
        [x, y],
        [x, y - rise],
        [x + dx, y - rise + dy],
        [x + dx, y + dy],
      ]),
      shade(fill, 78),
    )
    parts += shape(
      p,
      quad([
        [x, y - rise],
        [x - run, y - rise],
        [x - run + dx, y - rise + dy],
        [x + dx, y - rise + dy],
      ]),
      "paper",
    )
    profile += ` V ${n(y - rise)} H ${n(x - run)}`
  }
  profile += ` V ${n(y1 + under)} Z`
  const shadow = `M ${n(x1)} ${n(y1 + under * 0.4)} L ${n(x0)} ${n(y0 + under * 0.4)} V ${n(y0 + under)} L ${n(x1)} ${n(y1 + under)} Z`
  return parts + shape(p, profile, fill) + tint(shadow, stipple(p))
}

/** An observatory: a drum with windows, a ribbed dome with its slit open, and a telescope looking out. */
export function observatory(
  p: Pen,
  r: Rs,
  {
    cx,
    base,
    rad,
    fill,
  }: { cx: number; base: number; rad: number; fill: string },
) {
  const drum = rad * 0.62
  let out = box(p, {
    x: cx - rad,
    y: base - drum,
    w: rad * 2,
    h: drum,
    fill,
    depth: 0.7,
    windows: 4,
  })
  const dcx = cx + DEPTH[0] * 0.35
  const dbase = base - drum + DEPTH[1] * 0.35
  const rd = rad * 0.92
  const dome = `M ${n(dcx - rd)} ${n(dbase)} A ${n(rd)} ${n(rd)} 0 0 1 ${n(dcx + rd)} ${n(dbase)} Z`
  const clip = p.uid("dome")
  const tilt = r.between(-0.9, -0.5)
  const [tx, ty] = [dcx - rd * 0.1, dbase - rd * 0.62]
  const [c, s] = [Math.cos(tilt), Math.sin(tilt)]
  const tube = (len: number, w0: number, w1: number) =>
    quad([
      [tx - s * w0, ty + c * w0],
      [tx + c * len - s * w1, ty + s * len + c * w1],
      [tx + c * len + s * w1, ty + s * len - c * w1],
      [tx + s * w0, ty - c * w0],
    ])
  out += el("clipPath", { id: clip }, el("path", { d: dome }, null))
  out += shape(p, dome, "paper")
  out += tint(crescent(dcx, dbase, rd, -rd * 0.55, -rd * 0.25), stipple(p), {
    "clip-path": `url(#${clip})`,
  })
  let ribs = ""
  for (const k of [-0.62, -0.3, 0.3, 0.62])
    ribs += `M ${n(dcx + k * rd)} ${n(dbase)} Q ${n(dcx + k * rd * 0.9)} ${n(dbase - rd * 0.85)} ${n(dcx)} ${n(dbase - rd)} `
  out += line(p, ribs, { "clip-path": `url(#${clip})` })
  out += shape(
    p,
    `M ${n(dcx - rd * 0.12)} ${n(dbase - rd * 0.99)} H ${n(dcx + rd * 0.12)} V ${n(dbase - rd * 0.2)} H ${n(dcx - rd * 0.12)} Z`,
    "ink",
  )
  out += shape(p, tube(rd * 0.95, 11, 15), "paper")
  const [mx, my] = [tx + c * rd * 0.95, ty + s * rd * 0.95]
  out += shape(p, ellipse(mx, my, 6, 14), "ink", {
    transform: `rotate(${n((tilt * 180) / Math.PI)} ${n(mx)} ${n(my)})`,
  })
  return (
    out +
    shape(
      p,
      `M ${n(dcx - 3)} ${n(dbase - rd - 26)} H ${n(dcx + 3)} V ${n(dbase - rd + 2)} H ${n(dcx - 3)} Z`,
      "paper",
    ) +
    shape(p, circle(dcx, dbase - rd - 30, 6), "paper")
  )
}
