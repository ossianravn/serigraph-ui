// Cloud banks and the arcade band. A bank is puffs on a flat base, outlined as one shape (every part stroked at twice
// the line, then filled on top without one) with open arcs inside where one puff overlaps another; a floating bank
// (a stratum in the sky) is cut flat and outlined at its base.
import { circle, line, paint, stipple, tint } from "./motifs"
import { el, n, type Pen, type Rs } from "./svg"

export interface Bank {
  x0: number
  x1: number
  base: number
  top: number
  rmin: number
  rmax: number
  fill: string
  contours?: number
  floating?: boolean
}

export function cloudBank(p: Pen, r: Rs, b: Bank) {
  const {
    x0,
    x1,
    base,
    top,
    rmin,
    rmax,
    fill,
    contours = 0.65,
    floating = false,
  } = b
  const puffs: { cx: number; cy: number; r: number }[] = []
  let x = x0 - rmax * 0.3
  while (x < x1 + rmax * 0.3) {
    const rad = r.between(rmin, rmax)
    puffs.push({
      cx: x,
      cy: r.between(top + rad, top + rad + (rmax - rmin) * 0.8),
      r: rad,
    })
    x += rad * r.between(1.05, 1.45)
  }
  if (floating)
    for (const q of puffs) {
      q.cx = Math.min(Math.max(q.cx, x0 + q.r * 0.6), x1 - q.r * 0.6)
      q.cy = Math.min(q.cy, base - q.r * 0.3)
    }
  const shelf = Math.min(
    puffs.reduce((s, q) => s + q.cy, 0) / puffs.length,
    base - 4,
  )
  const [left, right] = floating ? [x0, x1] : [x0 - rmax, x1 + rmax]
  const parts =
    puffs.map((q) => circle(q.cx, q.cy, q.r)).join(" ") +
    ` M ${n(left)} ${n(shelf)} H ${n(right)} V ${n(floating ? base : base + 40)} H ${n(left)} Z`
  let arcs = ""
  puffs.forEach((q, i) => {
    if (i === 0 || !r.chance(contours)) return
    const a0 = (r.between(192, 205) * Math.PI) / 180
    const a1 = (r.between(238, 262) * Math.PI) / 180
    const pt = (a: number) =>
      `${n(q.cx + Math.cos(a) * q.r)} ${n(q.cy + Math.sin(a) * q.r)}`
    arcs += `M ${pt(a0)} A ${n(q.r)} ${n(q.r)} 0 0 1 ${pt(a1)} `
  })
  const clip = p.uid("cloud")
  let defs = el("clipPath", { id: clip }, el("path", { d: parts }, null))
  let cutInk = {}
  let cutFill = {}
  if (floating) {
    const [ci, cf] = [p.uid("ci"), p.uid("cf")]
    const box = (y: number) =>
      el(
        "rect",
        {
          x: left - rmax * 2,
          y: top - rmax,
          width: right - left + rmax * 4,
          height: y - top + rmax,
        },
        null,
      )
    defs +=
      el("clipPath", { id: ci }, box(base + p.L * 1.2)) +
      el("clipPath", { id: cf }, box(base))
    cutInk = { "clip-path": `url(#${ci})` }
    cutFill = { "clip-path": `url(#${cf})` }
  }
  return (
    defs +
    el(
      "path",
      {
        d: parts,
        style: "fill:var(--ink);stroke:var(--ink)",
        "stroke-width": p.L * 2,
        "vector-effect": "non-scaling-stroke",
        ...cutInk,
      },
      null,
    ) +
    tint(parts, paint(fill), cutFill) +
    (arcs
      ? el("g", cutFill, line(p, arcs, { "clip-path": `url(#${clip})` }))
      : "")
  )
}

/**
 * The arcade band between sections: a wall in `fill` whose arched openings show the section below, each opening
 * revealing the wall's thickness, stippled, along its right side.
 */
export function arcadeBand(
  p: Pen,
  {
    width = 1200,
    height = 104,
    bay = 124,
    pier = 34,
    rise = 62,
    depth = 10,
    fill = "cloud",
  } = {},
) {
  const r = (bay - pier) / 2
  const foot = height - 2
  const spring = foot - rise + r
  const arch = (a: number, c: number) =>
    `M ${n(a)} ${n(foot)} V ${n(spring)} A ${n(r)} ${n(r)} 0 0 1 ${n(c)} ${n(spring)} V ${n(foot)}`
  let holes = ""
  let inner = ""
  let edges = ""
  for (let x = -bay; x < width + bay; x += bay) {
    const [a, c] = [x + pier / 2, x + bay - pier / 2]
    holes += `${arch(a, c)} Z `
    inner += `${arch(a - depth, c - depth)} Z `
    edges += `${arch(a, c)} M ${n(c)} ${n(foot)} H ${n(c + pier)} `
  }
  const big = `M ${-bay} 0 H ${width + bay} V ${n(foot)} H ${-bay} Z`
  const clip = p.uid("arches")
  const reveal = { "fill-rule": "evenodd", "clip-path": `url(#${clip})` }
  return (
    el("clipPath", { id: clip }, el("path", { d: holes }, null)) +
    tint(`${big} ${holes}`, fill, { "fill-rule": "evenodd" }) +
    tint(`${big} ${inner}`, fill, reveal) +
    tint(`${big} ${inner}`, stipple(p), reveal) +
    line(p, inner, { "clip-path": `url(#${clip})` }) +
    line(p, edges, { "stroke-linecap": "square" })
  )
}
