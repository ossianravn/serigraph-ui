// Larger parts of a folly: an arcade with a louvered arch, a round platform with a black underside and an optional
// dome, a stair seen from below with a louvered underside, and a flower on a stem.
import {
  ball,
  crescent,
  ellipse,
  louvers,
  line,
  shape,
  stipple,
  tint,
} from "./motifs"
import { el, n, type Pen, type Rs } from "./svg"

/** An arcade: a deck on piers with arched openings, its top and back face showing its depth. */
export function arcade(
  p: Pen,
  r: Rs,
  { x0, top, ground }: { x0: number; top: number; ground: number },
) {
  const count = r.int(3, 5)
  const bay = r.between(118, 146)
  const [pier, deck] = [30, 36]
  const x1 = x0 + count * bay + pier
  const [dx, dy] = [22, -14]
  const face = (ox: number, oy: number) => {
    let d = `M ${n(x0 + ox)} ${n(top + oy)} H ${n(x1 + ox)} V ${n(ground + oy)} H ${n(x0 + ox)} Z`
    for (let i = 0; i < count; i++) {
      const a = x0 + pier + i * bay + ox
      const c = a + bay - pier
      const rad = (c - a) / 2
      const spring = top + deck + rad + oy
      d += ` M ${n(a)} ${n(ground + oy)} V ${n(spring)} A ${n(rad)} ${n(rad)} 0 0 1 ${n(c)} ${n(spring)} V ${n(ground + oy)} Z`
    }
    return d
  }
  const back = face(dx, dy)
  const walk = `M ${n(x0)} ${n(top)} H ${n(x1)} L ${n(x1 + dx)} ${n(top + dy)} H ${n(x0 + dx)} Z`
  let louvered = ""
  if (r.chance(0.7)) {
    const a = x0 + pier + r.int(0, count - 1) * bay
    const c = a + bay - pier
    const rad = (c - a) / 2
    const spring = top + deck + rad
    louvered = shape(
      p,
      `M ${n(a)} ${n(ground)} V ${n(spring)} A ${n(rad)} ${n(rad)} 0 0 1 ${n(c)} ${n(spring)} V ${n(ground)} Z`,
      louvers(p),
    )
  }
  return {
    x1,
    top,
    svg:
      shape(p, back, "structure-shade", { "fill-rule": "evenodd" }) +
      tint(back, stipple(p), { "fill-rule": "evenodd" }) +
      shape(p, walk, "walk") +
      louvered +
      shape(p, face(0, 0), "structure", { "fill-rule": "evenodd" }),
  }
}

/** A round platform on a column, its underside solid ink, with a small observatory dome when asked. */
export function platform(
  p: Pen,
  r: Rs,
  {
    cx,
    cy,
    rx,
    ground,
    dome,
  }: { cx: number; cy: number; rx: number; ground: number; dome: boolean },
) {
  const [ry, cw] = [rx * 0.2, rx * 0.2]
  const column = `M ${n(cx - cw)} ${n(cy)} H ${n(cx + cw)} V ${n(ground)} H ${n(cx - cw)} Z`
  const shadow = `M ${n(cx + cw * 0.15)} ${n(cy)} H ${n(cx + cw)} V ${n(ground)} H ${n(cx + cw * 0.15)} Z`
  let out = shape(p, column, "platform") + tint(shadow, stipple(p))
  out +=
    shape(p, ellipse(cx, cy + ry * 0.75, rx, ry), "ink") +
    shape(p, ellipse(cx, cy, rx, ry), "platform")
  if (dome) {
    const rd = rx * r.between(0.38, 0.48)
    const base = cy - ry * 0.15
    const half = `M ${n(cx - rd)} ${n(base)} A ${n(rd)} ${n(rd)} 0 0 1 ${n(cx + rd)} ${n(base)} Z`
    const slot = `M ${n(cx - rd * 0.12)} ${n(base - rd * 0.98)} H ${n(cx + rd * 0.12)} V ${n(base - rd * 0.25)} H ${n(cx - rd * 0.12)} Z`
    const clip = p.uid("dome")
    out +=
      el("clipPath", { id: clip }, el("path", { d: half }, null)) +
      shape(p, half, "paper") +
      tint(crescent(cx, base, rd, -rd * 0.5, -rd * 0.3), stipple(p), {
        "clip-path": `url(#${clip})`,
      }) +
      shape(p, slot, "ink") +
      line(
        p,
        `M ${n(cx - rd * 0.55)} ${n(base - rd * 0.83)} Q ${n(cx - rd * 0.42)} ${n(base - rd * 0.4)} ${n(cx - rd * 0.55)} ${n(base)}`,
      )
  }
  return out
}

/** A staircase rising from (x0, y0) to (x1, y1), seen from below: a stringer over a louvered underside. */
export function stairUnder(
  p: Pen,
  r: Rs,
  { x0, y0, x1, y1 }: { x0: number; y0: number; x1: number; y1: number },
) {
  const count = r.int(10, 14)
  const run = (x1 - x0) / count
  const rise = (y0 - y1) / count
  const T = 24
  let d = `M ${n(x0)} ${n(y0 + 60)} V ${n(y0)}`
  for (let i = 0, y = y0, x = x0; i < count; i++) {
    y -= rise
    x += run
    d += ` V ${n(y)} H ${n(x)}`
  }
  const xb = x1 - ((y0 + 60 - (y1 + T)) * run) / rise
  d += ` V ${n(y1 + T)} L ${n(xb)} ${n(y0 + 60)} Z`
  const [ux, uy] = [10, 30]
  const under = `M ${n(x1)} ${n(y1 + T)} L ${n(xb)} ${n(y0 + 60)} L ${n(xb + ux)} ${n(y0 + 60 + uy)} L ${n(x1 + ux)} ${n(y1 + T + uy)} Z`
  return shape(p, under, louvers(p)) + shape(p, d, "stair")
}

/** A tall flower: a stem, two leaves with midribs, and a pompom head. */
export function flower(
  p: Pen,
  r: Rs,
  { x, head, ground }: { x: number; head: number; ground: number },
) {
  const rad = r.between(16, 24)
  let out = shape(
    p,
    `M ${n(x - 3.5)} ${n(ground)} V ${n(head)} H ${n(x + 3.5)} V ${n(ground)} Z`,
    "leaf",
  )
  for (const dir of [-1, 1]) {
    const ly = r.between(head + 70, head + 140)
    const len = r.between(42, 64)
    const leaf =
      `M ${n(x)} ${n(ly)} Q ${n(x + dir * len * 0.2)} ${n(ly - len * 0.75)} ${n(x + dir * len)} ${n(ly - len * 0.6)} ` +
      `Q ${n(x + dir * len * 0.75)} ${n(ly + len * 0.02)} ${n(x)} ${n(ly)} Z`
    out += shape(p, leaf, "leaf")
    out += line(
      p,
      `M ${n(x)} ${n(ly)} Q ${n(x + dir * len * 0.45)} ${n(ly - len * 0.45)} ${n(x + dir * len * 0.92)} ${n(ly - len * 0.58)}`,
    )
  }
  return out + ball(p, x, head - rad * 0.6, rad, "bloom")
}
