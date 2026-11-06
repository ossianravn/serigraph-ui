// Objects: instruments, the things of an observatory and a navigator's study. Tubes, rings and drums share the
// follies' one light: the side away from the upper left darkened and stippled, open ends in ink.
import { archPath, shade, tintOf } from "../buildings"
import { circle, crescent, ellipse, line, shape } from "../motifs"
import { stipple, tint } from "../motifs"
import { el, n, type Pen, type Rs } from "../svg"
import { cone, cylinder, slab, sphere } from "./forms"
import { fillOf, type Thing } from "./library"

export type Pt = readonly [number, number]
export type Draw = Thing["draw"]

/** An object of this collection. */
export const thing = (
  name: string,
  title: string,
  w: number,
  h: number,
  d: Draw,
) =>
  ({ name, title, collection: "instruments" as const, w, h, draw: d }) as Thing

export const pt = (q: Pt) => `${n(q[0])} ${n(q[1])}`
/** The point `d` along `u` from `a`. */
export const go = (a: Pt, u: Pt, d: number): Pt => [
  a[0] + u[0] * d,
  a[1] + u[1] * d,
]
const PI = Math.PI

/** An elliptical arc from `a` to `q` whose middle bulges toward `w`. */
export function arc(a: Pt, q: Pt, rx: number, ry: number, t: number, w: Pt) {
  const cw = (q[0] - a[0]) * w[1] - (q[1] - a[1]) * w[0] < 0
  return ` A ${n(rx)} ${n(ry)} ${n(t)} 0 ${cw ? 1 : 0} ${pt(q)}`
}

/** Draws `inner` clipped to the path `d`. */
export function clip(p: Pen, d: string, inner: string) {
  const id = p.uid("clip")
  const g = el("g", { "clip-path": `url(#${id})` }, inner)
  return el("clipPath", { id }, el("path", { d }, null)) + g
}

/** Shapes as one silhouette: a doubled line under every part, then the fills, so joints show no seams. */
export function union(p: Pen, ds: string[], fill: string) {
  const edge = {
    "stroke-width": p.L * 2,
    style: "fill:var(--ink);stroke:var(--ink)",
  }
  const under = shape(p, ds.join(" "), "ink", edge)
  return (
    under + ds.map((d) => tint(d, fill, { "fill-rule": "evenodd" })).join("")
  )
}

/** The shaded side of a form: darkened toward ink, then stippled. */
export const dark = (p: Pen, d: string, f: string) =>
  tint(d, shade(f)) + tint(d, stipple(p))

export type Band = readonly [number, number, string]
type Opt = { k?: number; cap?: string; bands?: Band[] }

/** A round tube from `a` to `b` (radii `ra`, `rb`), shaded on its lower side; the end at `b` shows. */
export function tube(p: Pen, a: Pt, b: Pt, r: Pt, fill: string, o: Opt = {}) {
  const { k = 0.34, cap = "open", bands = [] } = o
  const [ra, rb] = r
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
  const u: Pt = [(b[0] - a[0]) / len, (b[1] - a[1]) / len]
  const back: Pt = [-u[0], -u[1]]
  const v: Pt = u[0] - u[1] > 0 ? [-u[1], u[0]] : [u[1], -u[0]]
  const rot = (Math.atan2(v[1], v[0]) * 180) / PI
  const R = (t: number) => ra + (rb - ra) * t
  const to = (t: number, s: number) => go(go(a, u, len * t), v, s * R(t))
  const at = (t: number, s: number) => pt(to(t, s))
  const end = (t: number, s: number, w: Pt) =>
    arc(to(t, s), to(t, -s), R(t), R(t) * k, rot, w)
  const body = `M ${at(1, -1)} L ${at(0, -1)}${end(0, -1, back)} L ${at(1, 1)}${end(1, 1, u)} Z`
  const strip = `M ${at(-0.3, 0.36)} L ${at(1.3, 0.36)} L ${at(1.3, 1.8)} L ${at(-0.3, 1.8)} Z`
  const ring = ([t0, t1]: Band) =>
    `M ${at(t0, -1)}${end(t0, -1, back)} L ${at(t1, 1)}${end(t1, 1, back)} Z`
  const lit = bands.map((x) => tint(ring(x), x[2])).join("")
  const low = bands.map((x) => tint(ring(x), shade(x[2]))).join("")
  const edges = bands.map((x) => shape(p, ring(x), "none")).join("")
  const shadow = tint(strip, shade(fill)) + low + tint(strip, stipple(p))
  const turn = { transform: `rotate(${n(rot)} ${pt(b)})` }
  const face = (s: number, f: string) =>
    shape(p, ellipse(b[0], b[1], rb * s, rb * k * s), f, turn)
  const open = face(1, tintOf(fill, 62)) + face(0.72, "ink")
  const lid = cap === "none" ? "" : cap === "open" ? open : face(1, cap)
  const inside = lit + clip(p, strip, shadow) + edges
  return (
    shape(p, body, fill) + clip(p, body, inside) + shape(p, body, "none") + lid
  )
}

/** A round bar of radius `r` from `a` to `b`, shaded like a tube. */
export const pole = (p: Pen, a: Pt, b: Pt, r: number, f: string) =>
  tube(p, a, b, [r, r], f, { cap: "none" })

/** A refractor: eyepiece, banded tube, dew shield and finder, its middle at `m`, pointing along `u`. */
function refractor(p: Pen, r: Rs, m: Pt, u: Pt, s: number[], c: string[]) {
  const [back, front, ra, rb] = s as [number, number, number, number]
  const [fill, band] = c as [string, string]
  const [a, b] = [go(m, u, -back), go(m, u, front)]
  const [len, rf] = [back + front, ra * 0.36]
  const up: Pt = [u[1], -u[0]]
  const f0 = go(go(a, u, len * 0.3), up, ra + (rb - ra) * 0.45 + rf + 7)
  const f1 = go(f0, u, len * 0.36)
  const bands: Band[] = [
    [0, 0.06, band],
    [0.44, 0.49, band],
  ]
  if (r.chance(0.5)) bands.push([0.22, 0.26, band])
  const post = (t: number) => {
    const q = go(f0, u, len * 0.36 * t)
    return pole(p, q, go(q, up, -rf - 9), 2.5, band)
  }
  const [e0, e1] = [go(a, u, -ra * 1.6), go(a, u, 2)]
  const eye = tube(p, e0, e1, [ra * 0.42, ra * 0.5], "ink", { cap: "none" })
  const [s0, s1] = [go(a, u, len * 0.8), go(b, u, 4)]
  const shield = tube(p, s0, s1, [rb * 1.16, rb * 1.18], band)
  const finder = post(0.25) + post(0.75) + tube(p, f0, f1, [rf, rf * 1.1], fill)
  return eye + tube(p, a, b, [ra, rb], fill, { bands }) + shield + finder
}

const telescope: Draw = (p, r, fills) => {
  const legs = fillOf(fills, "legs", "stair")
  const body = fillOf(fills, "tube", r("tube").pick(["tone-4", "tone-3"]))
  const band = fillOf(fills, "band", "sun")
  const t = r("tilt").between(0.5, 0.64)
  const [hx, hy] = [146, 196]
  const m: Pt = [hx + 2, hy - 46]
  const leg = (x: number, y: number) =>
    tube(p, [hx + (x - hx) * 0.1, hy], [x, y], [8, 5], legs, { cap: "none" }) +
    shape(p, circle(x, y + 2, 5), "ink")
  const prong = (f: string) => pole(p, [hx, hy - 8], m, 6, f)
  const u: Pt = [Math.cos(t), -Math.sin(t)]
  return (
    leg(hx + 40, 300) +
    leg(60, 328) +
    leg(232, 330) +
    cylinder(p, { cx: hx, base: hy + 8, rx: 24, h: 18, fill: legs }) +
    prong(shade(legs)) +
    refractor(p, r("tube"), m, u, [100, 124, 14, 21], [body, band]) +
    prong(legs) +
    shape(p, circle(m[0], m[1], 6), band)
  )
}

const greatTelescope: Draw = (p, r, fills) => {
  const pier = fillOf(fills, "pier", "structure")
  const body = fillOf(fills, "tube", r("tube").pick(["tone-4", "tone-1"]))
  const metal = fillOf(fills, "mount", "stair")
  const t = r("tilt").between(0.62, 0.74)
  const u: Pt = [Math.cos(t), -Math.sin(t)]
  const m: Pt = [168, 212]
  const w = go(m, [-u[1], u[0]], 100)
  const floor = fillOf(fills, "floor", "tone-1")
  const capital = fillOf(fills, "capital", "platform")
  const band = fillOf(fills, "band", "sun")
  return (
    slab(p, { cx: 182, y: 404, rx: 86, thick: 12, fill: floor }) +
    cylinder(p, { cx: 182, base: 410, rx: 46, h: 128, fill: pier }) +
    shape(p, archPath(168, 418, 28, 58), "ink") +
    cylinder(p, { cx: 182, base: 286, rx: 56, h: 14, fill: capital }) +
    tube(p, [190, 278], m, [24, 20], metal, { cap: "none" }) +
    pole(p, m, w, 5, metal) +
    sphere(p, w[0], w[1], 24, metal) +
    refractor(p, r("tube"), m, u, [148, 186, 26, 36], [body, band]) +
    shape(p, circle(m[0], m[1], 9), metal)
  )
}

/** A seeded blob for a continent: points at varied radii, smoothed through their midpoints. */
function blob(r: Rs, cx: number, cy: number, sx: number, sy: number) {
  const pts: Pt[] = Array.from({ length: 8 }, (_, i) => {
    const [a, k] = [(i * PI) / 4 + r.between(-0.2, 0.2), r.between(0.62, 1.2)]
    return [cx + Math.cos(a) * sx * k, cy + Math.sin(a) * sy * k]
  })
  const mid = (i: number) => {
    const [a, b] = [pts[i % 8]!, pts[(i + 1) % 8]!]
    return pt([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2])
  }
  const q = pts.map((_, i) => ` Q ${pt(pts[(i + 1) % 8]!)} ${mid(i + 1)}`)
  return `M ${mid(0)}${q.join("")} Z`
}

const globe: Draw = (p, r, fills) => {
  const sea = fillOf(fills, "sea", r("sea").pick(["tone-4", "highlight"]))
  const land = fillOf(fills, "land", "stair")
  const ring = fillOf(fills, "ring", "structure")
  const [cx, cy, R] = [142, 124, 90]
  const c: Pt = [cx, cy]
  const ax: Pt = [Math.sin(0.41), -Math.cos(0.41)]
  const [left, south]: Pt[] = [
    [ax[1], -ax[0]],
    [-ax[0], -ax[1]],
  ]
  const at = (rr: number, s: number) => go(c, ax, rr * s)
  const half = (a: number, b: number) =>
    arc(at(a, b), at(a, -b), a, a, 0, left!)
  const meridian = `M ${pt(at(R + 18, 1))}${half(R + 18, 1)} L ${pt(at(R + 6, -1))}${half(R + 6, -1)} Z`
  const lr = r("land")
  const lands = [
    blob(lr, cx - 34, cy - 30, 34, 30),
    blob(lr, cx + 34, cy + 6, 22, 38),
    blob(lr, cx - 20, cy + 46, 26, 20),
    blob(lr, cx + 58, cy - 52, 12, 10),
  ]
  const paint = (f: string) => lands.map((d) => tint(d, f)).join("")
  const shadow = crescent(cx, cy, R, -R * 0.42, -R * 0.34)
  const rot = (Math.atan2(ax[1], ax[0]) * 180) / PI
  const side = (s: number) => go([0, 0], left!, s)
  const lon = (s: number) =>
    `M ${pt(at(R, 1))}${arc(at(R, 1), at(R, -1), R, R * 0.5, rot, side(s))}`
  const lat = (s: number) => {
    const [o, rr] = [at(R, s), R * Math.sqrt(1 - s * s)]
    const [e0, e1] = [go(o, left!, rr), go(o, left!, -rr)]
    return `M ${pt(e0)}${arc(e0, e1, rr, rr * 0.3, rot + 90, south!)}`
  }
  const axis = `M ${pt(at(R, 1))} L ${pt(at(R, -1))}`
  const grid = [lon(1), lon(-1), axis, lat(0), lat(0.5), lat(-0.5)]
  const foot = at(R + 12, -1)
  const ball = circle(cx, cy, R)
  const shaded = tint(shadow, shade(sea)) + paint(shade(land))
  const surface =
    paint(land) +
    clip(p, shadow, shaded + tint(shadow, stipple(p))) +
    lands.map((d) => shape(p, d, "none")).join("") +
    grid.map((d) => line(p, d)).join("")
  const pin = (s: number) =>
    shape(p, circle(...at(R + 12, s), 5), tintOf(ring, 62))
  const base = fillOf(fills, "foot", "tone-1")
  return (
    slab(p, { cx: foot[0] + 6, y: 314, rx: 66, thick: 12, fill: base }) +
    cone(p, { cx: foot[0], base: 316, rx: 34, h: 70, fill: ring }) +
    cylinder(p, { cx: foot[0], base: 280, rx: 10, h: 60, fill: ring }) +
    sphere(p, foot[0], foot[1] + 26, 15, ring) +
    shape(p, meridian, ring) +
    shape(p, ball, sea) +
    clip(p, ball, surface) +
    shape(p, ball, "none") +
    pin(1) +
    pin(-1)
  )
}

/** One half of a ring band round `c`: the front half (the lower) or the back. */
function ringHalf(c: Pt, size: number[], front: boolean) {
  const [rx, ry, t, w] = size as [number, number, number, number]
  const ma: Pt = [Math.cos((t * PI) / 180), Math.sin((t * PI) / 180)]
  const mi: Pt = ma[0] > 0 === front ? [-ma[1], ma[0]] : [ma[1], -ma[0]]
  const e = (q: number, s: number) => go(c, ma, (rx + q) * s)
  const side = (q: number, s: number) =>
    arc(e(q, s), e(q, -s), rx + q, ry + q, t, mi)
  return `M ${pt(e(w / 2, 1))}${side(w / 2, 1)} L ${pt(e(-w / 2, -1))}${side(-w / 2, -1)} Z`
}

const armillary: Draw = (p, r, fills) => {
  const metal = fillOf(fills, "rings", "sun")
  const column = fillOf(fills, "column", "tone-4")
  const [cx, cy, R] = [130, 140, 96]
  const tilt = r("tilt").between(20, 27)
  const ax: Pt = [Math.sin((tilt * PI) / 180), -Math.cos((tilt * PI) / 180)]
  const ecliptic = tilt - r("ecliptic").between(40, 50)
  const rings: [number[], string][] = [
    [[R + 14, (R + 14) * 0.26, 0, 14], metal],
    [[R * 0.84, R * 0.3, tilt, 11], metal],
    [[R * 0.84, R * 0.42, ecliptic, 22], fillOf(fills, "band", "tone-1")],
  ]
  const half = ([size, f]: [number[], string], front: boolean) => {
    const d = ringHalf([cx, cy], size, front)
    if (front) return shape(p, d, f)
    return shape(p, d, shade(f, 78)) + tint(d, stipple(p)) + shape(p, d, "none")
  }
  const layer = (front: boolean) => rings.map((x) => half(x, front)).join("")
  const [n0, s0] = [go([cx, cy], ax, R + 26), go([cx, cy], ax, -R - 26)]
  const meridian = `${circle(cx, cy, R + 6)} ${circle(cx, cy, R - 6)}`
  const base = fillOf(fills, "base", "structure")
  return (
    slab(p, { cx, y: 344, rx: 66, thick: 12, fill: base }) +
    cylinder(p, { cx, base: 348, rx: 16, h: 104, fill: column, top: false }) +
    sphere(p, cx, 284, 19, column) +
    shape(p, meridian, metal, { "fill-rule": "evenodd" }) +
    layer(false) +
    pole(p, s0, n0, 4, metal) +
    sphere(p, cx, cy, 28, fillOf(fills, "ball", "highlight")) +
    layer(true) +
    sphere(p, n0[0], n0[1], 8, metal) +
    sphere(p, s0[0], s0[1], 8, metal)
  )
}

export const INSTRUMENTS: Thing[] = [
  thing("telescope", "a telescope", 300, 340, telescope),
  thing("great-telescope", "a great telescope", 360, 440, greatTelescope),
  thing("globe", "a globe", 260, 340, globe),
  thing("armillary-sphere", "an armillary sphere", 260, 370, armillary),
]
