// The motifs on their own, for places a whole folly is too much: a pinwheel (medallions, a spinner), a sparkle ("new",
// success, empty space), a cloud (under a heading, behind a dialog's art) and an archway (image frames, empty
// states). Each is a Scene like the templates, so motif() frames it the same way. A motif's colour is its role, or
// --motif where the page sets one.
import { archPath } from "./buildings"
import {
  circle,
  line,
  pinpoint,
  pinwheel,
  ring,
  shape,
  sparkle,
  tint,
} from "./motifs"
import { el, n, rs } from "./svg"
import type { Scene } from "./scene"

const colour = (role: string) => `var(--motif, var(--${role}))`

/** Twelve curved wedges of paper and one colour in a fine ring; the seed sets the twist and the turn. */
const pinwheelMark: Scene = {
  w: 100,
  h: 100,
  fit: "xMidYMid meet",
  body: (p, seed) => {
    const r = rs(seed, "pinwheel")
    return pinwheel(p, 50, 50, 47, colour("sun"), {
      twist: r.between(0.45, 0.8),
      turn: r.next() * 6,
    })
  },
}

/** A four-point sparkle with a small one, a ring and a pinpoint placed by the seed. */
const sparkleMark: Scene = {
  w: 100,
  h: 100,
  fit: "xMidYMid meet",
  body: (p, seed) => {
    const r = rs(seed, "sparkle")
    const [x, y] = [r.between(70, 82), r.between(16, 26)]
    return (
      sparkle(p, 42, 58, 36) +
      sparkle(p, x, y, r.between(9, 13)) +
      ring(p, r.between(80, 88), r.between(64, 78), 3.4) +
      pinpoint(r.between(12, 22), r.between(14, 26), 1.8)
    )
  },
}

/**
 * A cumulus: puffs rising to a crown and curving down to a flat base, outlined as one shape (stroked at twice the
 * line, then filled on top), with open arcs where one puff overlaps the next.
 */
const cloudMark: Scene = {
  w: 240,
  h: 96,
  fit: "xMidYMax meet",
  body: (p, seed) => {
    const r = rs(seed, "cloud")
    const base = 92
    const count = r.int(4, 6)
    const puffs = Array.from({ length: count }, (_, i) => {
      const t = i / (count - 1)
      const rad = (22 + 26 * Math.sin(Math.PI * t)) * r.between(0.88, 1.08)
      return { cx: 0, cy: base - rad, r: rad, t }
    })
    const first = puffs[0]!
    const last = puffs[count - 1]!
    // Spread the puffs so the outer ones touch the box's sides; the inner ones shift a little.
    const span = 232 - first.r - last.r
    for (const q of puffs) {
      const shift = q === first || q === last ? 0 : r.between(-0.04, 0.04)
      q.cx = 4 + first.r + span * (q.t + shift)
    }
    const shelf = base - Math.min(first.r, last.r)
    const d =
      puffs.map((q) => circle(q.cx, q.cy, q.r)).join(" ") +
      ` M ${n(first.cx)} ${n(shelf)} H ${n(last.cx)} V ${n(base)} H ${n(first.cx)} Z`
    let arcs = ""
    for (const q of puffs.slice(1, -1)) {
      if (!r.chance(0.7)) continue
      const a0 = (r.between(195, 205) * Math.PI) / 180
      const a1 = (r.between(238, 255) * Math.PI) / 180
      const pt = (a: number) =>
        `${n(q.cx + Math.cos(a) * q.r)} ${n(q.cy + Math.sin(a) * q.r)}`
      arcs += `M ${pt(a0)} A ${n(q.r)} ${n(q.r)} 0 0 1 ${pt(a1)} `
    }
    const clip = p.uid("cloud")
    return (
      el("clipPath", { id: clip }, el("path", { d }, null)) +
      el(
        "path",
        {
          d,
          style: "fill:var(--ink);stroke:var(--ink)",
          "stroke-width": p.L * 2,
          "vector-effect": "non-scaling-stroke",
        },
        null,
      ) +
      tint(d, colour("cloud")) +
      (arcs ? line(p, arcs, { "clip-path": `url(#${clip})` }) : "")
    )
  },
}

/** A round-topped opening in a thick frame with a solid ink doorway and a sill. */
const archwayMark: Scene = {
  w: 100,
  h: 124,
  fit: "xMidYMax meet",
  body: (p, seed) => {
    const r = rs(seed, "archway")
    const [w, t] = [r.between(72, 84), r.between(12, 17)]
    const x = (100 - w) / 2
    const base = 116
    const outer = archPath(x, base, w, 108)
    const inner = archPath(x + t, base, w - 2 * t, 108 - t)
    return (
      shape(p, `${outer} ${inner}`, colour("structure"), {
        "fill-rule": "evenodd",
      }) +
      shape(p, inner, "ink") +
      line(p, `M 4 ${base} H 96`)
    )
  },
}

export const MOTIFS = {
  pinwheel: pinwheelMark,
  sparkle: sparkleMark,
  cloud: cloudMark,
  archway: archwayMark,
} as const
export type Motif = keyof typeof MOTIFS
