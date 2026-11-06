// The solid forms objects are built from, in the follies' one oblique view and one light (from the upper left): flat
// fills in the ink line, the side away from the light stippled, tops a step lighter toward paper. Boxes and arches are
// in ../buildings.ts; these add the round forms.
import { shade, tintOf } from "../buildings"
import {
  circle,
  crescent,
  ellipse,
  line,
  shape,
  stipple,
  tint,
} from "../motifs"
import { n, type Pen } from "../svg"

/** An upright cylinder standing on `base`: its body, the shaded right side, and a lighter elliptical top. */
export function cylinder(
  p: Pen,
  {
    cx,
    base,
    rx,
    h,
    fill,
    ry = rx * 0.32,
    top = true,
  }: {
    cx: number
    base: number
    rx: number
    h: number
    fill: string
    ry?: number
    top?: boolean
  },
) {
  const t = base - h
  const body = `M ${n(cx - rx)} ${n(t)} V ${n(base)} A ${n(rx)} ${n(ry)} 0 0 0 ${n(cx + rx)} ${n(base)} V ${n(t)} Z`
  const x1 = cx + rx * 0.38
  const foot = base + ry * Math.sqrt(1 - 0.38 ** 2)
  const side = `M ${n(x1)} ${n(t)} V ${n(foot)} A ${n(rx)} ${n(ry)} 0 0 0 ${n(cx + rx)} ${n(base)} V ${n(t)} Z`
  return (
    shape(p, body, fill) +
    tint(side, shade(fill)) +
    tint(side, stipple(p)) +
    shape(p, body, "none") +
    (top ? shape(p, ellipse(cx, t, rx, ry), tintOf(fill, 62)) : "")
  )
}

/** A cone (a spire, a roof, a tree) on an elliptical foot, its right half in shade. */
export function cone(
  p: Pen,
  {
    cx,
    base,
    rx,
    h,
    fill,
    ry = rx * 0.3,
  }: {
    cx: number
    base: number
    rx: number
    h: number
    fill: string
    ry?: number
  },
) {
  const apex = `${n(cx)} ${n(base - h)}`
  const body = `M ${apex} L ${n(cx - rx)} ${n(base)} A ${n(rx)} ${n(ry)} 0 0 0 ${n(cx + rx)} ${n(base)} Z`
  const side = `M ${apex} L ${n(cx + rx * 0.2)} ${n(base + ry * 0.98)} A ${n(rx)} ${n(ry)} 0 0 0 ${n(cx + rx)} ${n(base)} Z`
  return (
    shape(p, body, fill) +
    tint(side, shade(fill)) +
    tint(side, stipple(p)) +
    shape(p, body, "none")
  )
}

/** A dome on `base`: a half disc, stippled on its lower right, with a band at its foot. */
export function dome(
  p: Pen,
  { cx, base, r, fill }: { cx: number; base: number; r: number; fill: string },
) {
  const d = `M ${n(cx - r)} ${n(base)} A ${n(r)} ${n(r)} 0 0 1 ${n(cx + r)} ${n(base)} Z`
  const shadow = crescent(cx, base, r, -r * 0.4, -r * 0.3)
  const clip = p.uid("dome")
  return (
    `<clipPath id="${clip}"><path d="${d}"/></clipPath>` +
    shape(p, d, fill) +
    `<g clip-path="url(#${clip})">${tint(shadow, shade(fill))}${tint(shadow, stipple(p))}</g>` +
    shape(p, d, "none")
  )
}

/** A sphere: a disc in a fill, stippled on its lower right. */
export const sphere = (
  p: Pen,
  cx: number,
  cy: number,
  r: number,
  fill: string,
) =>
  tint(circle(cx, cy, r), fill) +
  tint(crescent(cx, cy, r, -r * 0.42, -r * 0.34), shade(fill)) +
  tint(crescent(cx, cy, r, -r * 0.42, -r * 0.34), stipple(p)) +
  shape(p, circle(cx, cy, r), "none")

/** A flat slab seen from above at the oblique: a thin disc of `fill` with its rim showing. */
export function slab(
  p: Pen,
  {
    cx,
    y,
    rx,
    thick,
    fill,
    ry = rx * 0.3,
  }: {
    cx: number
    y: number
    rx: number
    thick: number
    fill: string
    ry?: number
  },
) {
  const rim = `M ${n(cx - rx)} ${n(y)} V ${n(y + thick)} A ${n(rx)} ${n(ry)} 0 0 0 ${n(cx + rx)} ${n(y + thick)} V ${n(y)} Z`
  return (
    shape(p, rim, shade(fill, 70)) +
    tint(rim, stipple(p)) +
    shape(p, rim, "none") +
    shape(p, ellipse(cx, y, rx, ry), tintOf(fill, 70))
  )
}

/** A straight pole or rod from (x0, y0) to (x1, y1), drawn as a thin filled bar of `w`. */
export function rod(
  p: Pen,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  w: number,
  fill: string,
) {
  const len = Math.hypot(x1 - x0, y1 - y0) || 1
  const [ux, uy] = [((y0 - y1) / len) * (w / 2), ((x1 - x0) / len) * (w / 2)]
  const d = `M ${n(x0 + ux)} ${n(y0 + uy)} L ${n(x1 + ux)} ${n(y1 + uy)} L ${n(x1 - ux)} ${n(y1 - uy)} L ${n(x0 - ux)} ${n(y0 - uy)} Z`
  return shape(p, d, fill)
}

/** A thin ink line, for strings, rigging and hairline details. */
export const wire = (p: Pen, d: string) => line(p, d)
