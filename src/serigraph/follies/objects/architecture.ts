// Architecture: the follies' standing pieces, each drawn whole in its own box. Shared look: flat fills in the ink line,
// faces away from the light stippled, openings in ink.
import { archPath, box, quad, shade, tintOf } from "../buildings"
import { circle, line, shape, sparkle, stipple, tint } from "../motifs"
import { n } from "../svg"
import { cone, cylinder, dome, slab } from "./forms"
import { fillOf, type Thing } from "./library"

/** Treads winding round a column: back treads, the column, then front treads, so the stair passes behind it. */
const spiralStair: Thing = {
  name: "spiral-stair",
  title: "a spiral stair",
  collection: "architecture",
  w: 220,
  h: 420,
  draw: (p, r, fills) => {
    const [cx, base, Ri, Ro, k] = [110, 400, 24, 96, 0.34]
    const col = fillOf(fills, "column", "structure")
    const tread = fillOf(fills, "tread", "stair")
    const stringer = fillOf(fills, "stringer", "structure")
    const turns = r("turns").between(1.5, 1.85)
    const count = Math.round(turns * 14)
    const height = 300
    const rise = height / count
    const start = r("start").between(0, Math.PI * 2)
    const da = (turns * Math.PI * 2) / count
    const at = (rad: number, a: number, y: number) =>
      [cx + Math.cos(a) * rad, y + Math.sin(a) * rad * k] as const
    const T = 14
    type Piece = { depth: number; svg: string }
    const pieces: Piece[] = []
    for (let i = 0; i < count; i++) {
      const [a0, a1] = [start + i * da, start + (i + 1) * da]
      const y = base - 20 - i * rise
      const [i0, o0, o1, i1] = [at(Ri, a0, y), at(Ro, a0, y), at(Ro, a1, y), at(Ri, a1, y)]
      const top = quad([i0, o0, o1, i1])
      const mid = (a0 + a1) / 2
      // The riser climbs from this tread to the next; the stringer hangs under the outer edge.
      const riser = quad([i1, o1, at(Ro, a1, y - rise), at(Ri, a1, y - rise)])
      const band = quad([o0, o1, [o1[0], o1[1] + T], [o0[0], o0[1] + T]])
      const front = Math.sin(mid) > 0
      pieces.push({
        depth: Math.sin(mid) * 10 + i * 0.01,
        svg:
          (front ? shape(p, band, stringer) + tint(band, stipple(p)) + shape(p, band, "none") : "") +
          shape(p, top, tread) +
          shape(p, riser, "ink"),
      })
    }
    const back = pieces.filter((x) => x.depth < 0).sort((a, b) => a.depth - b.depth)
    const front = pieces.filter((x) => x.depth >= 0).sort((a, b) => a.depth - b.depth)
    const topY = base - 20 - count * rise
    return (
      back.map((x) => x.svg).join("") +
      cylinder(p, { cx, base, rx: Ri, h: base - topY + 8, fill: col }) +
      front.map((x) => x.svg).join("") +
      slab(p, { cx, y: topY - 10, rx: Ro * 0.75, thick: 10, fill: fillOf(fills, "landing", "platform") })
    )
  },
}

/** A fluted column on a plinth, its capital a slab. */
const column: Thing = {
  name: "column",
  title: "a column",
  collection: "architecture",
  w: 120,
  h: 340,
  draw: (p, r, fills) => {
    const f = fillOf(fills, "shaft", "tone-1")
    const cx = 56
    const flutes = [-14, -5, 4]
      .map((dx) => line(p, `M ${n(cx + dx)} 52 V 302`))
      .join("")
    return (
      box(p, { x: 14, y: 302, w: 84, h: 26, fill: fillOf(fills, "plinth", "structure"), depth: 0.6 }) +
      cylinder(p, { cx, base: 304, rx: 30, h: 252, fill: f, top: false }) +
      flutes +
      box(p, { x: 16, y: 30, w: 80, h: 22, fill: fillOf(fills, "capital", "structure"), depth: 0.6 }) +
      (r("ball").chance(0.5) ? shape(p, circle(cx + 6, 18, 12), "sun") : "")
    )
  },
}

/** An obelisk: a tapering shaft with a pointed cap, on a stepped base. */
const obelisk: Thing = {
  name: "obelisk",
  title: "an obelisk",
  collection: "architecture",
  w: 120,
  h: 380,
  draw: (p, _r, fills) => {
    const f = fillOf(fills, "shaft", "tone-3")
    const [x0, x1, t0, t1, top, foot] = [34, 82, 42, 74, 66, 330]
    const front = quad([[x0, foot], [t0, top], [t1, top], [x1, foot]])
    const side = quad([[x1, foot], [t1, top], [t1 + 12, top - 8], [x1 + 14, foot - 9]])
    const cap = quad([[t0, top], [58, 26], [t1, top]])
    const capSide = quad([[t1, top], [58, 26], [t1 + 12, top - 8]])
    return (
      box(p, { x: 14, y: 350, w: 92, h: 18, fill: fillOf(fills, "base", "structure"), depth: 0.6 }) +
      box(p, { x: 26, y: 330, w: 68, h: 20, fill: fillOf(fills, "base", "structure"), depth: 0.6 }) +
      shape(p, side, shade(f)) +
      tint(side, stipple(p)) +
      shape(p, side, "none") +
      shape(p, front, f) +
      shape(p, capSide, shade("sun")) +
      tint(capSide, stipple(p)) +
      shape(p, capSide, "none") +
      shape(p, cap, "sun")
    )
  },
}

/** A lighthouse: a striped tapering tower, a gallery, the lantern room and its dome, and two beams. */
const lighthouse: Thing = {
  name: "lighthouse",
  title: "a lighthouse",
  collection: "architecture",
  w: 260,
  h: 420,
  draw: (p, r, fills) => {
    const [cx, foot, top] = [130, 408, 150]
    const [wb, wt] = [46, 30]
    const body = fillOf(fills, "tower", "paper")
    const band = fillOf(fills, "band", "structure")
    const edge = (y: number) => wb + ((wt - wb) * (foot - y)) / (foot - top)
    const tower = quad([[cx - wb, foot], [cx - wt, top], [cx + wt, top], [cx + wb, foot]])
    const clip = p.uid("tower")
    const bands = [0, 1, 2]
      .map((i) => {
        const y0 = foot - 40 - i * 82
        const y1 = y0 - 40
        return tint(
          quad([[cx - edge(y0) - 2, y0], [cx - edge(y1) - 2, y1], [cx + edge(y1) + 2, y1], [cx + edge(y0) + 2, y0]]),
          band,
        )
      })
      .join("")
    const shadowSide = quad([[cx + wb * 0.35, foot], [cx + wt * 0.35, top], [cx + wt, top], [cx + wb, foot]])
    const beams = r("beams").chance(0.7)
      ? tint(`M ${cx} 104 L 0 70 L 0 132 Z`, tintOf("sun", 40)) +
        tint(`M ${cx} 104 L 260 64 L 260 128 Z`, tintOf("sun", 40))
      : ""
    return (
      beams +
      `<clipPath id="${clip}"><path d="${tower}"/></clipPath>` +
      shape(p, tower, body) +
      `<g clip-path="url(#${clip})">${bands}${tint(shadowSide, stipple(p))}</g>` +
      shape(p, tower, "none") +
      shape(p, archPath(cx - 9, foot, 18, 34), "ink") +
      shape(p, archPath(cx - 6, foot - 150, 12, 22), "ink") +
      slab(p, { cx, y: top - 8, rx: 46, thick: 8, fill: fillOf(fills, "gallery", "platform") }) +
      box(p, { x: cx - 24, y: 92, w: 48, h: 40, fill: fillOf(fills, "lantern", "sun"), depth: 0.5, windows: 2 }) +
      dome(p, { cx: cx + 6, base: 88, r: 26, fill: band }) +
      shape(p, circle(cx + 6, 58, 4), "ink")
    )
  },
}

/** A gateway: two piers carrying a lintel, one big arch through it, a ball on each pier. */
const gate: Thing = {
  name: "gate",
  title: "an arched gateway",
  collection: "architecture",
  w: 260,
  h: 300,
  draw: (p, r, fills) => {
    const f = fillOf(fills, "wall", "tone-4")
    const opening = r("opening").pick(["ink", "sun", "highlight"])
    return (
      box(p, { x: 20, y: 70, w: 200, h: 220, fill: f, depth: 1 }) +
      shape(p, archPath(64, 290, 112, 180), opening) +
      (opening === "ink" ? "" : sparkle(p, 120, 200, 14)) +
      line(p, `M 20 104 H 220`) +
      shape(p, circle(42, 54, 14), "sun") +
      shape(p, circle(198, 54, 14), "sun")
    )
  },
}

/** A bridge on arches: a long deck over three arched openings, a parapet line along its top. */
const bridge: Thing = {
  name: "bridge",
  title: "an arched bridge",
  collection: "architecture",
  w: 420,
  h: 180,
  draw: (p, _r, fills) => {
    const f = fillOf(fills, "deck", "structure")
    const arches = [0, 1, 2]
      .map((i) => shape(p, archPath(36 + i * 126, 170, 96, 96), "ink"))
      .join("")
    return (
      box(p, { x: 10, y: 50, w: 380, h: 120, fill: f, depth: 1 }) +
      arches +
      line(p, `M 10 72 H 390`) +
      cone(p, { cx: 30, base: 50, rx: 14, h: 40, fill: "sun" }) +
      cone(p, { cx: 370, base: 50, rx: 14, h: 40, fill: "sun" })
    )
  },
}

export const ARCHITECTURE = [spiralStair, column, obelisk, lighthouse, gate, bridge]
