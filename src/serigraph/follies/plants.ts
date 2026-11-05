// A pinwheel framed in an arch, and plants: broad leaves with pompom flowers.
import { archPath, shade } from "./buildings"
import { ball, line, pinwheel, shape, stipple, tint } from "./motifs"
import { el, n, type Pen, type Rs } from "./svg"

/** A pinwheel seen through an arch whose thick frame is drawn in `frame`. */
export function pinwheelArch(
  p: Pen,
  {
    x,
    base,
    w,
    h,
    frame,
    colour,
  }: {
    x: number
    base: number
    w: number
    h: number
    frame: string
    colour: string
  },
) {
  const t = w * 0.14
  const inner = archPath(x + t, base, w - 2 * t, h - t)
  const clip = p.uid("pw")
  const rad = Math.hypot(w / 2, h) * 1.05
  return (
    el("clipPath", { id: clip }, el("path", { d: inner }, null)) +
    el(
      "g",
      { "clip-path": `url(#${clip})` },
      pinwheel(p, x + w / 2, base - h * 0.45, rad, colour, {
        count: 16,
        twist: 0.9,
        ring: false,
      }),
    ) +
    shape(p, `${archPath(x, base, w, h)} ${inner}`, frame, {
      "fill-rule": "evenodd",
    })
  )
}

/** Broad leaves fanning from a root, with pompom flowers on stems above them. */
export function plant(
  p: Pen,
  r: Rs,
  {
    x,
    ground,
    height,
    leaf = "leaf",
    bloom = "bloom",
    blooms = 1,
  }: {
    x: number
    ground: number
    height: number
    leaf?: string
    bloom?: string
    blooms?: number
  },
) {
  let out = ""
  for (let i = 0; i < blooms; i++) {
    const sx = x + r.between(-18, 18)
    const top = ground - height * r.between(0.75, 1)
    out += shape(
      p,
      `M ${n(sx - 3)} ${n(ground)} V ${n(top)} H ${n(sx + 3)} V ${n(ground)} Z`,
      leaf,
    )
    out += ball(p, sx, top - 12, r.between(13, 20), bloom)
  }
  const leaves = r.int(4, 6)
  for (let i = 0; i < leaves; i++) {
    const a = -Math.PI / 2 + (i / (leaves - 1) - 0.5) * r.between(2.2, 2.7)
    const len = height * r.between(0.42, 0.6)
    const [ex, ey] = [x + Math.cos(a) * len, ground + Math.sin(a) * len]
    const [px, py] = [-Math.sin(a) * len * 0.28, Math.cos(a) * len * 0.28]
    const [mx, my] = [
      x + Math.cos(a) * len * 0.55,
      ground + Math.sin(a) * len * 0.55,
    ]
    const d = `M ${n(x)} ${n(ground)} Q ${n(mx + px)} ${n(my + py)} ${n(ex)} ${n(ey)} Q ${n(mx - px)} ${n(my - py)} ${n(x)} ${n(ground)} Z`
    const half = `M ${n(x)} ${n(ground)} Q ${n(mx + px)} ${n(my + py)} ${n(ex)} ${n(ey)} Z`
    out +=
      shape(p, d, i % 2 ? leaf : shade(leaf, 90)) +
      tint(half, stipple(p)) +
      line(p, `M ${n(x)} ${n(ground)} L ${n(ex)} ${n(ey)}`)
  }
  return out
}
