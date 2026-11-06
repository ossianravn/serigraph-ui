// Architecture: the follies' standing pieces, each drawn whole in its own box. Shared look: flat fills in the ink line,
// faces away from the light stippled, openings in ink.
import { box, quad, shade } from "../buildings"
import { circle, line, pinwheel, shape, stipple, tint } from "../motifs"
import { n, type Pen, type Rs } from "../svg"
import { cylinder, slab } from "./forms"
import { fillOf, type Fills, type Thing } from "./library"

/** Treads winding round a column from `base` up `height`: back treads, the column, then front treads, so the stair
 * passes behind its column; the stringer hangs under the outer edge on the near side. Returns the drawing and the
 * height of its top tread. */
function helix(
  p: Pen,
  r: (label: string) => Rs,
  fills: Fills,
  {
    cx,
    base,
    height,
    Ri,
    Ro,
    turns: [t0, t1],
    perTurn = 14,
  }: {
    cx: number
    base: number
    height: number
    Ri: number
    Ro: number
    turns: [number, number]
    perTurn?: number
  },
) {
  const k = 0.34
  const col = fillOf(fills, "column", "structure")
  const tread = fillOf(fills, "tread", "stair")
  const stringer = fillOf(fills, "stringer", "structure")
  const turns = r("turns").between(t0, t1)
  const count = Math.round(turns * perTurn)
  const rise = height / count
  const start = r("start").between(0, Math.PI * 2)
  const da = (turns * Math.PI * 2) / count
  const at = (rad: number, a: number, y: number) =>
    [cx + Math.cos(a) * rad, y + Math.sin(a) * rad * k] as const
  const T = Math.max(10, rise * 1.1)
  const pieces: { depth: number; svg: string }[] = []
  for (let i = 0; i < count; i++) {
    const [a0, a1] = [start + i * da, start + (i + 1) * da]
    const y = base - i * rise
    const [i0, o0, o1, i1] = [
      at(Ri, a0, y),
      at(Ro, a0, y),
      at(Ro, a1, y),
      at(Ri, a1, y),
    ]
    const mid = (a0 + a1) / 2
    const riser = quad([i1, o1, at(Ro, a1, y - rise), at(Ri, a1, y - rise)])
    const band = quad([o0, o1, [o1[0], o1[1] + T], [o0[0], o0[1] + T]])
    const front = Math.sin(mid) > 0
    pieces.push({
      depth: Math.sin(mid) * 10 + i * 0.01,
      svg:
        (front
          ? shape(p, band, stringer) +
            tint(band, stipple(p)) +
            shape(p, band, "none")
          : "") +
        shape(p, quad([i0, o0, o1, i1]), tread) +
        shape(p, riser, "ink"),
    })
  }
  const byDepth = (a: { depth: number }, b: { depth: number }) =>
    a.depth - b.depth
  const top = base - count * rise
  return {
    top,
    svg:
      pieces
        .filter((x) => x.depth < 0)
        .sort(byDepth)
        .map((x) => x.svg)
        .join("") +
      cylinder(p, {
        cx,
        base: base + 20,
        rx: Ri,
        h: base + 20 - top + 8,
        fill: col,
      }) +
      pieces
        .filter((x) => x.depth >= 0)
        .sort(byDepth)
        .map((x) => x.svg)
        .join(""),
  }
}

/** A spiral stair: a turn and a half to two round a column, a round landing on top. */
const spiralStair: Thing = {
  name: "spiral-stair",
  title: "a spiral stair",
  collection: "architecture",
  w: 220,
  h: 420,
  draw: (p, r, fills) => {
    const h = helix(p, r, fills, {
      cx: 110,
      base: 380,
      height: 300,
      Ri: 24,
      Ro: 96,
      turns: [1.5, 1.85],
    })
    return (
      h.svg +
      slab(p, {
        cx: 110,
        y: h.top - 10,
        rx: 72,
        thick: 10,
        fill: fillOf(fills, "landing", "platform"),
      })
    )
  },
}

/** A spiral tower: a tall, narrow stair of three turns and more, for rising through a page; a landing and a
 * pinwheel sun on top. */
const spiralTower: Thing = {
  name: "spiral-tower",
  title: "a spiral tower",
  collection: "architecture",
  w: 300,
  h: 760,
  draw: (p, r, fills) => {
    const h = helix(p, r, fills, {
      cx: 150,
      base: 725,
      height: 560,
      Ri: 24,
      Ro: 124,
      turns: [2.6, 3],
      perTurn: 14,
    })
    const sunY = h.top - 84
    return (
      h.svg +
      slab(p, {
        cx: 150,
        y: h.top - 10,
        rx: 92,
        thick: 10,
        fill: fillOf(fills, "landing", "platform"),
      }) +
      pinwheel(p, 150, sunY, 58, fillOf(fills, "sun", "sun"), {
        count: 14,
        turn: r("sun").between(0, 1),
      })
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
      box(p, {
        x: 14,
        y: 302,
        w: 84,
        h: 26,
        fill: fillOf(fills, "plinth", "structure"),
        depth: 0.6,
      }) +
      cylinder(p, { cx, base: 304, rx: 30, h: 252, fill: f, top: false }) +
      flutes +
      box(p, {
        x: 16,
        y: 30,
        w: 80,
        h: 22,
        fill: fillOf(fills, "capital", "structure"),
        depth: 0.6,
      }) +
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
    const front = quad([
      [x0, foot],
      [t0, top],
      [t1, top],
      [x1, foot],
    ])
    const side = quad([
      [x1, foot],
      [t1, top],
      [t1 + 12, top - 8],
      [x1 + 14, foot - 9],
    ])
    const cap = quad([
      [t0, top],
      [58, 26],
      [t1, top],
    ])
    const capSide = quad([
      [t1, top],
      [58, 26],
      [t1 + 12, top - 8],
    ])
    return (
      box(p, {
        x: 14,
        y: 350,
        w: 92,
        h: 18,
        fill: fillOf(fills, "base", "structure"),
        depth: 0.6,
      }) +
      box(p, {
        x: 26,
        y: 330,
        w: 68,
        h: 20,
        fill: fillOf(fills, "base", "structure"),
        depth: 0.6,
      }) +
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

export const ARCHITECTURE = [spiralStair, spiralTower, column, obelisk]
