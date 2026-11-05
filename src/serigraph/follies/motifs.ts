// The style's motifs as SVG fragments: inked shapes, stipple, louvers, pinwheels, sparkles and cloud banks. Fills are
// colourway roles (--structure, --cloud …) or paints; lines are non-scaling, so one line weight serves every size.
import { el, n, type Pen, type Rs } from "./svg"

const TAU = Math.PI * 2

/** A role name ('coral', 'cloud'), any CSS paint ('url(#…)', 'color-mix(…)'), or 'none'. */
export const paint = (f: string) =>
  f === "none" ? "none" : f.includes("(") ? f : `var(--${f})`

type Extra = Record<string, string | number | undefined>

/** A filled shape outlined in ink. */
export const shape = (p: Pen, d: string, fill: string, more: Extra = {}) =>
  el(
    "path",
    {
      d,
      style: `fill:${paint(fill)};stroke:var(--ink)`,
      "stroke-width": p.L,
      "stroke-linejoin": "round",
      "vector-effect": "non-scaling-stroke",
      ...more,
    },
    null,
  )
/** An open ink line. */
export const line = (p: Pen, d: string, more: Extra = {}) =>
  el(
    "path",
    {
      d,
      style: "fill:none;stroke:var(--ink)",
      "stroke-width": p.L,
      "stroke-linecap": "round",
      "vector-effect": "non-scaling-stroke",
      ...more,
    },
    null,
  )
/** A filled shape with no outline (stipple and louver overlays). */
export const tint = (d: string, fill: string, more: Extra = {}) =>
  el("path", { d, style: `fill:${paint(fill)}`, ...more }, null)

export const circle = (cx: number, cy: number, r: number) =>
  `M ${n(cx - r)} ${n(cy)} A ${n(r)} ${n(r)} 0 1 1 ${n(cx + r)} ${n(cy)} A ${n(r)} ${n(r)} 0 1 1 ${n(cx - r)} ${n(cy)} Z`
export const ellipse = (cx: number, cy: number, rx: number, ry: number) =>
  `M ${n(cx - rx)} ${n(cy)} A ${n(rx)} ${n(ry)} 0 1 1 ${n(cx + rx)} ${n(cy)} A ${n(rx)} ${n(ry)} 0 1 1 ${n(cx - rx)} ${n(cy)} Z`

/** The drawing's patterns: a staggered stipple `pitch` units apart, and horizontal louvers in the stair colour. */
export function defs(p: Pen, pitch = 3, period = 10) {
  const dotR = (0.55 * pitch) / 3
  const stipple = el(
    "pattern",
    {
      id: `${p.id}-stipple`,
      width: pitch,
      height: pitch,
      patternUnits: "userSpaceOnUse",
    },
    el(
      "circle",
      { cx: pitch / 4, cy: pitch / 4, r: dotR, style: "fill:var(--ink)" },
      null,
    ) +
      el(
        "circle",
        {
          cx: (3 * pitch) / 4,
          cy: (3 * pitch) / 4,
          r: dotR,
          style: "fill:var(--ink)",
        },
        null,
      ),
  )
  const louvers = el(
    "pattern",
    {
      id: `${p.id}-louvers`,
      width: 8,
      height: period,
      patternUnits: "userSpaceOnUse",
    },
    el("rect", { width: 8, height: period, style: "fill:var(--stair)" }, null) +
      el(
        "rect",
        {
          y: period * 0.32,
          width: 8,
          height: period * 0.68,
          style: "fill:var(--ink)",
        },
        null,
      ),
  )
  return el("defs", {}, stipple + louvers)
}
export const stipple = (p: Pen) => `url(#${p.id}-stipple)`
export const louvers = (p: Pen) => `url(#${p.id}-louvers)`

/** The part of circle (cx, cy, r) left uncovered by the same circle moved by (ox, oy): the shadow side. */
export function crescent(
  cx: number,
  cy: number,
  r: number,
  ox: number,
  oy: number,
) {
  const d = Math.hypot(ox, oy)
  const hh = Math.sqrt(r * r - (d * d) / 4)
  const [mx, my] = [cx + ox / 2, cy + oy / 2]
  const [ux, uy] = [-oy / d, ox / d]
  const p1 = [mx + ux * hh, my + uy * hh] as const
  const p2 = [mx - ux * hh, my - uy * hh] as const
  return `M ${n(p1[0])} ${n(p1[1])} A ${n(r)} ${n(r)} 0 1 1 ${n(p2[0])} ${n(p2[1])} A ${n(r)} ${n(r)} 0 0 0 ${n(p1[0])} ${n(p1[1])} Z`
}

/** A round form in a fill, stippled on its lower right. */
export const ball = (p: Pen, cx: number, cy: number, r: number, fill: string) =>
  tint(circle(cx, cy, r), fill) +
  tint(crescent(cx, cy, r, -r * 0.42, -r * 0.34), stipple(p)) +
  shape(p, circle(cx, cy, r), "none")

/** A pinwheel: curved wedges of paper and `colour` in an ink ring. */
export function pinwheel(
  p: Pen,
  cx: number,
  cy: number,
  r: number,
  colour: string,
  { count = 12, twist = 0.6, turn = 0, ring = true } = {},
) {
  let wedges = ""
  const pt = (a: number, rr: number) =>
    `${n(cx + Math.cos(a) * rr)} ${n(cy + Math.sin(a) * rr)}`
  for (let i = 0; i < count; i++) {
    const a0 = turn + (i * TAU) / count
    const a1 = a0 + TAU / count
    const d = `M ${n(cx)} ${n(cy)} Q ${pt(a0 - twist, r * 0.55)} ${pt(a0, r)} A ${n(r)} ${n(r)} 0 0 1 ${pt(a1, r)} Q ${pt(a1 - twist, r * 0.55)} ${n(cx)} ${n(cy)} Z`
    wedges += tint(d, i % 2 ? "paper" : colour)
  }
  return el(
    "g",
    { class: "pinwheel" },
    wedges + (ring ? shape(p, circle(cx, cy, r), "none") : ""),
  )
}

/** A four-point concave sparkle, paper inside a fine ink line. */
export function sparkle(p: Pen, x: number, y: number, s: number) {
  const k = s * 0.13
  const d =
    `M ${n(x)} ${n(y - s)} Q ${n(x + k)} ${n(y - k)} ${n(x + s)} ${n(y)} Q ${n(x + k)} ${n(y + k)} ${n(x)} ${n(y + s)} ` +
    `Q ${n(x - k)} ${n(y + k)} ${n(x - s)} ${n(y)} Q ${n(x - k)} ${n(y - k)} ${n(x)} ${n(y - s)} Z`
  return shape(p, d, "paper")
}

/** Sparkles, hollow rings and pinpoint dots scattered in a box. */
export function scatter(
  p: Pen,
  r: Rs,
  {
    x0,
    y0,
    x1,
    y1,
    sparkles = 5,
    rings = 4,
    dots = 6,
    size = [8, 15],
  }: {
    x0: number
    y0: number
    x1: number
    y1: number
    sparkles?: number
    rings?: number
    dots?: number
    size?: [number, number]
  },
) {
  let out = ""
  for (let i = 0; i < sparkles; i++)
    out += sparkle(
      p,
      r.between(x0, x1),
      r.between(y0, y1),
      r.between(size[0], size[1]),
    )
  for (let i = 0; i < rings; i++)
    out += shape(
      p,
      circle(r.between(x0, x1), r.between(y0, y1), r.between(2.5, 4.5)),
      "none",
    )
  for (let i = 0; i < dots; i++)
    out += tint(circle(r.between(x0, x1), r.between(y0, y1), 1.6), "ink")
  return out
}
