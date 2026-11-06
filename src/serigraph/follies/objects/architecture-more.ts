// Architecture, continued: a lighthouse, a gateway and a bridge.
import { archPath, box, quad, tintOf } from "../buildings"
import { circle, line, shape, sparkle, stipple, tint } from "../motifs"
import { cone, dome, slab } from "./forms"
import { fillOf, type Thing } from "./library"

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
    const tower = quad([
      [cx - wb, foot],
      [cx - wt, top],
      [cx + wt, top],
      [cx + wb, foot],
    ])
    const clip = p.uid("tower")
    const bands = [0, 1, 2]
      .map((i) => {
        const y0 = foot - 40 - i * 82
        const y1 = y0 - 40
        return tint(
          quad([
            [cx - edge(y0) - 2, y0],
            [cx - edge(y1) - 2, y1],
            [cx + edge(y1) + 2, y1],
            [cx + edge(y0) + 2, y0],
          ]),
          band,
        )
      })
      .join("")
    const shadowSide = quad([
      [cx + wb * 0.35, foot],
      [cx + wt * 0.35, top],
      [cx + wt, top],
      [cx + wb, foot],
    ])
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
      slab(p, {
        cx,
        y: top - 8,
        rx: 46,
        thick: 8,
        fill: fillOf(fills, "gallery", "platform"),
      }) +
      box(p, {
        x: cx - 24,
        y: 92,
        w: 48,
        h: 40,
        fill: fillOf(fills, "lantern", "sun"),
        depth: 0.5,
        windows: 2,
      }) +
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

export const ARCHITECTURE_MORE = [lighthouse, gate, bridge]
