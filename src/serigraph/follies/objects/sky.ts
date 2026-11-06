// Objects: the sky. Each object draws in its own box; see library.ts for the contract and architecture.ts for the bar.
// Sky objects float: they fill their box rather than stand on its foot. Loose marks (rings, dots, the lines between
// stars) take the surface's text colour, so they show on Night's dark canvas; filled shapes keep the ink line.
import { shade, tintOf } from "../buildings"
import { ball, circle, crescent, ellipse, line, pinpoint } from "../motifs"
import { ring, shape, sparkle, stipple, tint } from "../motifs"
import { n, type Pen } from "../svg"
import { fillOf, type Thing } from "./library"

export const TAU = Math.PI * 2
const DEG = Math.PI / 180

export type Draw = Thing["draw"]

/** A sky object: it floats, filling its box. */
export const sky = (
  name: string,
  title: string,
  w: number,
  h: number,
  draw: Draw,
) => ({ name, title, collection: "sky", w, h, draw }) satisfies Thing

/** A puff (a circle) or a block (the flat base under a row of puffs), with its fill and its shading's paint. */
export type Lump = {
  cx: number
  cy: number
  r: number
  fill: string
  dots: string
}
export type Block = {
  x0: number
  x1: number
  y0: number
  y1: number
  fill: string
}
type N = number
export const puff = (cx: N, cy: N, r: N, fill: string, dots: string): Lump => {
  return { cx, cy, r, fill, dots }
}

/** Stipple in a spot colour: cloud-coloured dots shade a paper cloud, as on the poster. */
export function dots(p: Pen, role: string, k = 2.6) {
  const id = p.uid("dots")
  const dot = (c: number) =>
    `<circle cx="${n(c)}" cy="${n(c)}" r="${n((0.55 * k) / 3)}" style="fill:var(--${role})"/>`
  return {
    def: `<pattern id="${id}" width="${k}" height="${k}" patternUnits="userSpaceOnUse">${dot(k / 4) + dot((3 * k) / 4)}</pattern>`,
    url: `url(#${id})`,
  }
}

/** The point at angle `a` and radius `r` round (cx, cy), as "x y". */
export const at = (cx: number, cy: number, r: number, a: number) =>
  `${n(cx + Math.cos(a) * r)} ${n(cy + Math.sin(a) * r)}`

/** A four-point concave star like `sparkle`, in any fill. */
export function star(p: Pen, x: number, y: number, s: number, fill: string) {
  const k = s * 0.13
  const d =
    `M ${n(x)} ${n(y - s)} Q ${n(x + k)} ${n(y - k)} ${n(x + s)} ${n(y)} Q ${n(x + k)} ${n(y + k)} ${n(x)} ${n(y + s)} ` +
    `Q ${n(x - k)} ${n(y + k)} ${n(x - s)} ${n(y)} Q ${n(x - k)} ${n(y - k)} ${n(x)} ${n(y - s)} Z`
  return shape(p, d, fill)
}

/** An open line loose in the sky, in the surface's text colour (ink, or paper on Night). */
export const looseLine = (p: Pen, d: string) =>
  line(p, d, { style: "fill:none;stroke:var(--text, var(--ink))" })

/** A clip path from `d`, and a wrapper that applies it. */
export function clipTo(p: Pen, d: string) {
  const id = p.uid("sky")
  return {
    def: `<clipPath id="${id}"><path d="${d}"/></clipPath>`,
    wrap: (s: string) => `<g clip-path="url(#${id})">${s}</g>`,
  }
}

/** A gig-poster sunburst: a disc in a ring of long folded rays and short pale ones, all in the ink line. */
const sunRays: Draw = (p, r, fills) => {
  const [c, R] = [140, r("disc").between(60, 68)]
  const count = r("count").pick([10, 12, 14])
  const [step, turn] = [TAU / count, r("turn").between(0, TAU / count)]
  const rays = fillOf(fills, "rays", "sun")
  const pale = fillOf(fills, "short", tintOf(rays, 55))
  const reach = R * r("reach").between(1.78, 1.95)
  const pt = (rad: number, a: number) => at(c, c, rad, a)
  let [short, long] = ["", ""]
  for (let i = 0; i < count; i++) {
    const a = turn + i * step
    const w = step * (i % 2 ? 0.5 : 0.55)
    const [b0, mid, b1] = [
      pt(R * 0.9, a - w),
      pt(R * 0.9, a),
      pt(R * 0.9, a + w),
    ]
    if (i % 2) {
      const tip = `${pt(R * 1.52, a - 0.02)} L ${pt(R * 1.52, a + 0.02)}`
      short += shape(p, `M ${b0} L ${tip} L ${b1} Z`, pale)
      continue
    }
    // A long ray folds along its spine: the half turned from the light is in shade, stippled.
    const tip = pt(reach, a)
    const half = [`M ${b0} L ${tip} L ${mid} Z`, `M ${mid} L ${tip} L ${b1} Z`]
    const dk = Math.cos(a) < Math.sin(a) ? 0 : 1
    for (const [k, d] of half.entries())
      long += shape(p, d, k === dk ? shade(rays) : rays)
    long += tint(half[dk]!, stipple(p))
  }
  let inner = ""
  for (let i = r("rings").int(1, 2); i > 0; i--)
    inner += shape(p, circle(c, c, R * (0.96 - i * 0.16)), "none")
  return short + long + ball(p, c, c, R, fillOf(fills, "disc", "sun")) + inner
}

/** A planet with a tilted ring: the ring's back half passes behind it, its front half over it, casting a shadow. */
const ringedPlanet: Draw = (p, r, fills) => {
  const [cx, cy, R] = [150, 112, r("size").between(56, 62)]
  const pick = r("planet").pick(["tone-3", "plane", "tone-4"])
  const body = fillOf(fills, "planet", pick)
  const band = fillOf(fills, "ring", "sun")
  const [k, tilt] = [r("open").between(0.24, 0.3), r("tilt").between(-20, -11)]
  const [ro, rm, ri] = [1.92, 1.6, 1.3].map((f) =>
    ellipse(cx, cy, R * f, R * f * k),
  )
  const odd = { "fill-rule": "evenodd" }
  const ringSvg =
    shape(p, `${ro} ${rm}`, band, odd) +
    shape(p, `${rm} ${ri}`, tintOf(band, 55), odd)
  const rot = (s: string) =>
    `<g transform="rotate(${n(tilt)} ${cx} ${cy})">${s}</g>`
  const disc = circle(cx, cy, R)
  const planet = clipTo(p, disc)
  const front = clipTo(p, `M 0 ${cy} H 300 V 220 H 0 Z`)
  // Two latitude bands curve like the ring, seen a little from above.
  const [x0, x1, bow] = [n(cx - R - 4), n(cx + R + 4), R * 0.3]
  const lat = (y0: number, y1: number) =>
    `M ${x0} ${n(y0)} Q ${cx} ${n(y0 + bow)} ${x1} ${n(y0)} V ${n(y1)} Q ${cx} ${n(y1 + bow)} ${x0} ${n(y1)} Z`
  const y0 = cy - R * r("bands").between(0.62, 0.72)
  const bands =
    tint(lat(y0, y0 + R * 0.2), tintOf(body, 55)) +
    tint(lat(y0 + R * 0.32, y0 + R * 0.42), shade(body, 90))
  // The front half's shadow falls on the planet just below it.
  const drop = { ...odd, transform: `translate(0 ${n(R * 0.16)})` }
  const cast = front.wrap(tint(`${ro} ${ri}`, stipple(p), drop))
  const dark = crescent(cx, cy, R, -R * 0.42, -R * 0.34)
  return (
    planet.def +
    front.def +
    rot(ringSvg) +
    tint(disc, body) +
    planet.wrap(rot(bands + cast)) +
    tint(dark, shade(body)) +
    tint(dark, stipple(p)) +
    shape(p, disc, "none") +
    rot(front.wrap(ringSvg))
  )
}

/** A fat crescent moon, stippled along its inner edge, with a sparkle in its bite. */
const crescentMoon: Draw = (p, r, fills) => {
  const [cx, cy, R] = [104, 122, r("size").between(84, 90)]
  const pick = r("moon").pick(["plane-2", "sun", "highlight"])
  const a = r("tilt").between(-0.5, -0.2)
  const bite = r("bite").between(0.56, 0.66) * R
  const [ox, oy] = [Math.cos(a) * bite, Math.sin(a) * bite]
  const d = crescent(cx, cy, R, ox, oy)
  const c = clipTo(p, d)
  const band = R * r("band").between(0.16, 0.22)
  const [sx, sy] = [cx + ox + R * 0.18, cy + oy - R * 0.02]
  return (
    c.def +
    shape(p, d, fillOf(fills, "moon", pick)) +
    c.wrap(tint(circle(cx + ox, cy + oy, R + band), stipple(p))) +
    shape(p, d, "none") +
    sparkle(p, sx, sy, r("sparkle").between(16, 21)) +
    ring(p, sx + R * 0.32, sy + R * 0.44, 3.6) +
    pinpoint(sx - R * 0.08, sy - R * 0.5, 1.8)
  )
}

/** A comet: a round head trailing tapering bands of spot colour that part as they go. */
const comet: Draw = (p, r, fills) => {
  const Rh = r("head").between(26, 30)
  const [hx, hy, tx, ty] = [326 - Rh, Rh + 14, 12, r("tail").between(150, 186)]
  const bend = r("bend").between(26, 40) / Math.hypot(hx - tx, hy - ty)
  const qx = (hx + tx) / 2 + (hy - ty) * bend
  const qy = (hy + ty) / 2 - (hx - tx) * bend
  const bez = (t: number, u = 1 - t) =>
    [
      u * u * hx + 2 * u * t * qx + t * t * tx,
      u * u * hy + 2 * u * t * qy + t * t * ty,
    ] as const
  const count = r("bands").int(3, 4)
  const colours = ["sun", "highlight", "plane", "tone-4"]
  const hw0 = (Rh * 1.05) / count
  let bands = ""
  for (let i = 0; i < count; i++) {
    const off = i - (count - 1) / 2
    const reach = 1 - Math.abs(off) * r(`len-${i}`).between(0.12, 0.22)
    const [left, right] = [[], []] as [string[], string[]]
    for (let s = 0; s <= 24; s++) {
      const t = (s / 24) * reach
      const [x, y] = bez(t)
      const [x2, y2] = bez(Math.min(t + 0.01, 1))
      const dl = Math.hypot(x2 - x, y2 - y) || 1
      const [nx, ny] = [-(y2 - y) / dl, (x2 - x) / dl]
      const o = off * 2 * hw0 * (1 + 1.6 * t)
      const hw = hw0 * (1 + 0.5 * t) * (1 - s / 24) ** 0.6
      left.push(`${n(x + nx * (o - hw))} ${n(y + ny * (o - hw))}`)
      right.unshift(`${n(x + nx * (o + hw))} ${n(y + ny * (o + hw))}`)
    }
    const fill = fillOf(fills, `band-${i}`, colours[i]!)
    bands += shape(p, `M ${left.join(" L ")} L ${right.join(" L ")} Z`, fill)
  }
  const g = Rh + 8
  const glow = `M ${at(hx, hy, g, -2.6)} A ${n(g)} ${n(g)} 0 0 1 ${at(hx, hy, g, 0.7)}`
  const [s, dot] = [r("spark"), r("dot")]
  return (
    bands +
    ball(p, hx, hy, Rh, fillOf(fills, "head", "paper")) +
    looseLine(p, glow) +
    sparkle(p, s.between(60, 140), s.between(26, 50), 10) +
    pinpoint(dot.between(200, 260), dot.between(150, 185), 1.8)
  )
}

/** A shooting star: a big sparkle leading a curved trail of rounded stripes, staggered at both ends. */
const shootingStar: Draw = (p, r, fills) => {
  // The trail falls along an arc round a centre low on the left, from the upper left down to the star.
  const [cx, cy, Rm, w] = [14, 404, 356, 12]
  const count = r("stripes").int(3, 4)
  const colours = ["sun", "plane-2", "highlight", "plane"]
  const pt = (rad: number, a: number) => at(cx, cy, rad, a)
  let stripes = ""
  for (let i = 0; i < count; i++) {
    const off = i - (count - 1) / 2
    const [ro, ri, c] = [Rm + off * 17 + w / 2, Rm + off * 17 - w / 2, w / 2]
    const a0 = (-52 - r(`head-${i}`).between(0, 3)) * DEG
    const a1 = (-87 + Math.abs(off) * r(`tail-${i}`).between(6, 11)) * DEG
    // An annular strip from the tail a1 to the head a0, round at both ends.
    const d =
      `M ${pt(ro, a1)} A ${n(ro)} ${n(ro)} 0 0 1 ${pt(ro, a0)} A ${c} ${c} 0 0 1 ${pt(ri, a0)} ` +
      `A ${n(ri)} ${n(ri)} 0 0 0 ${pt(ri, a1)} A ${c} ${c} 0 0 1 ${pt(ro, a1)} Z`
    stripes += shape(p, d, fillOf(fills, `stripe-${i}`, colours[i]!))
  }
  const [sx, sy] = [
    cx + Rm * Math.cos(-47 * DEG),
    cy + Rm * Math.sin(-47 * DEG),
  ]
  const s = r("size").between(34, 40)
  return (
    stripes +
    star(p, sx, sy, s, fillOf(fills, "star", "paper")) +
    sparkle(p, sx - 22, sy + 50, 9) +
    ring(p, sx - 150, sy + 8, 3.4) +
    pinpoint(sx - 120, sy + 46, 1.8)
  )
}

/** An eclipse: the moon's disc crossing the sun, a pale corona of fine rays, and a sparkle where the rims cross. */
const eclipse: Draw = (p, r, fills) => {
  const [c, R] = [130, 66]
  const sun = fillOf(fills, "sun", "sun")
  const count = r("rays").pick([28, 32, 36])
  const step = TAU / count
  const pt = (rad: number, a: number) => at(c, c, rad, a)
  let rays = ""
  for (let i = 0; i < count; i++) {
    const [a, odd] = [i * step, i % 2 === 1]
    const tip = pt(R * (odd ? 1.62 : 1.86), a)
    const d = `M ${pt(R * 1.2, a - step * 0.3)} L ${tip} L ${pt(R * 1.2, a + step * 0.3)} Z`
    rays += shape(p, d, odd ? tintOf(sun, 55) : sun)
  }
  const da = r("moon").between(-2.6, -1.9)
  const d = R * r("offset").between(0.24, 0.34)
  const [mx, my, mr] = [c + Math.cos(da) * d, c + Math.sin(da) * d, R * 1.02]
  // Where the rims cross: the diamond ring.
  const a = Math.acos((d * d + R * R - mr * mr) / (2 * d * R))
  const ra = da + r("ring").pick([-1, 1]) * a
  const [sx, sy] = [c + Math.cos(ra) * R, c + Math.sin(ra) * R]
  return (
    rays +
    shape(p, circle(c, c, R * 1.26), tintOf(sun, 45)) +
    ball(p, c, c, R, sun) +
    shape(p, circle(mx, my, mr), fillOf(fills, "moon", "ink")) +
    sparkle(p, sx, sy, r("size").between(16, 20))
  )
}

export const SKY: Thing[] = [
  sky("sun-rays", "a sun with rays", 280, 280, sunRays),
  sky("ringed-planet", "a ringed planet", 300, 220, ringedPlanet),
  sky("crescent-moon", "a crescent moon", 230, 240, crescentMoon),
  sky("comet", "a comet", 340, 200, comet),
  sky("shooting-star", "a shooting star", 320, 210, shootingStar),
  sky("eclipse", "an eclipse", 260, 260, eclipse),
]
