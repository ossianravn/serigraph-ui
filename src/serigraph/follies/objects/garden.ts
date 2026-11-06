// Objects: the garden. Each object draws in its own box; see library.ts for the contract and architecture.ts for the bar.
// Leaves are the house leaf (plants.ts): pointed, a midrib, stipple on the half away from the light. The helpers here
// (a path tag, curves, bands, leaves, pots) are shared with garden-more.ts.
import { shade, tintOf } from "../buildings"
import * as M from "../motifs"
import { el, n, type Pen } from "../svg"
import { fillOf, type Thing } from "./library"

const { ball, circle, crescent, ellipse, line, shape, stipple, tint } = M
export type P = readonly [number, number]
type V = P | number | string | undefined
export const xy = ([x, y]: P) => `${n(x)} ${n(y)}`
const n2 = (v?: number | string) => (typeof v === "number" ? n(v) : (v ?? ""))
const fmt = (v: V) => (typeof v === "object" ? xy(v) : n2(v))
/** A path from a template: points print as "x y", numbers are rounded. */
export const d = (s: TemplateStringsArray, ...v: V[]) =>
  s.reduce((o, t, i) => o + t + fmt(v[i]), "")
export const lerp = (a: P, b: P, t: number): P => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
]
/** The point at angle a (radians) and radius r from c, squashed by k. */
export const pol = (c: P, a: number, r: number, k = 1): P => [
  c[0] + Math.cos(a) * r,
  c[1] + Math.sin(a) * r * k,
]
/** The item at i (negative counts from the end), clamped to the list. */
export const at = <T>(a: readonly T[], i: number) =>
  a[Math.max(0, Math.min(a.length - 1, i < 0 ? a.length + i : i))] as T
export const cat = <T>(a: readonly T[], f: (x: T, i: number) => string) =>
  a.map(f).join("")
const qAt = (a: P, c: P, b: P, t: number) =>
  lerp(lerp(a, c, t), lerp(c, b, t), t)
const unitN = (a: P, b: P): P => {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
  return [(a[1] - b[1]) / len, (b[0] - a[0]) / len]
}
type Draw = Thing["draw"]
/** A Thing in the garden collection. */
export const garden = (name: string, title: string, w: P, draw: Draw) =>
  ({ name, title, collection: "garden", w: w[0], h: w[1], draw }) as Thing

/** `k + 1` points along a cubic from a to e. */
export const cubic = (a: P, b: P, c: P, e: P, k = 24): P[] =>
  Array.from({ length: k + 1 }, (_, i) =>
    qAt(lerp(a, b, i / k), lerp(b, c, i / k), lerp(c, e, i / k), i / k),
  )

/** A band along points, tapering from w0 to w1: its outline, and the strip on the side away from the light. */
export function band(pts: P[], w0: number, w1: number) {
  const nrm = pts.map((_, i) => unitN(at(pts, i && i - 1), at(pts, i + 1)))
  const s = nrm.reduce((t, [x, y]) => t + x + y, 0) > 0 ? 1 : -1
  const off = (k: number) =>
    pts.map(([x, y], i) => {
      const [nx, ny] = at(nrm, i)
      const w = ((w0 + ((w1 - w0) * i) / (pts.length - 1)) / 2) * k
      return [x + nx * w, y + ny * w] as P
    })
  const path = (a: string[], b: string[]) =>
    `M ${[...a, ...b.reverse()].join(" L ")} Z`
  const pt = (k: number) => off(k).map(xy)
  return { d: path(pt(1), pt(-1)), half: path(pt(s * 0.3), pt(s)) }
}

/** A filled shape whose part inside `reg` is shaded and stippled, outlined again on top. */
export function solid(p: Pen, s: string, f: string, reg: string, clip = true) {
  const id = p.uid("solid")
  const marks = tint(reg, shade(f)) + tint(reg, stipple(p))
  const inner = clip
    ? el("clipPath", { id }, el("path", { d: s }, null)) +
      el("g", { "clip-path": `url(#${id})` }, marks)
    : marks
  return shape(p, s, f) + inner + shape(p, s, "none")
}

/** A stem or trunk along points, its strip away from the light stippled. */
export const stem = (p: Pen, pts: P[], w0: number, w1: number, f: string) => {
  const b = band(pts, w0, w1)
  return shape(p, b.d, f) + tint(b.half, stipple(p)) + shape(p, b.d, "none")
}

/** The house leaf from b to t, its midline bowed through c: fill, stipple on the half away from the light, and a
 * midrib when it is long enough to carry one. `w` is how far the edges' controls stand off the midline. */
export function leaf(p: Pen, b: P, t: P, w: number, f: string, c?: P) {
  const m = c ?? lerp(b, t, 0.5)
  const nr = unitN(b, t)
  const s = nr[0] + nr[1] >= 0 ? 1 : -1
  const e = (k: number): P => [m[0] + nr[0] * w * k, m[1] + nr[1] * w * k]
  const all = d`M ${b} Q ${e(1)} ${t} Q ${e(-1)} ${b} Z`
  const half = d`M ${b} Q ${e(s)} ${t} Q ${m} ${b} Z`
  const rib = d`M ${b} Q ${m} ${t}`
  const mid = Math.hypot(t[0] - b[0], t[1] - b[1]) < 32 ? "" : line(p, rib)
  return shape(p, all, f) + tint(half, stipple(p)) + mid
}

/** A flower pot standing at `foot`, `w` by `h`: a tapered or round body, a rolled rim, soil in ink. */
export function pot(p: Pen, [cx, foot]: P, [w, h]: P, f: string, round = 0) {
  const [rw, ry] = [w / 2, w * 0.14]
  const [bw, bb, e] = [rw * 0.9, rw * (round ? 0.5 : 0.64), rw * 0.18]
  const top = foot - h + ry
  const y0 = top + h * 0.22
  const body = round
    ? d`M ${[cx - bw, y0]} C ${[cx - bw * 1.2, foot - h * 0.3]} ${[cx - bb, foot]} ${[cx, foot]} C ${[cx + bb, foot]} ${[cx + bw * 1.2, foot - h * 0.3]} ${[cx + bw, y0]} Z`
    : d`M ${[cx - bw, y0]} L ${[cx - bb, foot - e]} A ${bb} ${e} 0 0 0 ${[cx + bb, foot - e]} L ${[cx + bw, y0]} Z`
  const reg = round
    ? crescent(cx, foot - bw * 0.95, bw * 1.25, -bw * 0.55, -bw * 0.3)
    : d`M ${[cx + bw * 0.38, y0]} L ${[cx + bb * 0.38, foot + 2]} H ${cx + w} V ${y0} Z`
  const rim = d`M ${[cx - rw, top]} V ${y0} A ${rw} ${ry} 0 0 0 ${[cx + rw, y0]} V ${top} Z`
  const rimShade = d`M ${[cx + rw * 0.38, top]} V ${y0 + ry} H ${cx + rw} V ${top} Z`
  const soil = ellipse(cx, top + ry * 0.12, rw * 0.8, ry * 0.68)
  const lip = shape(p, ellipse(cx, top, rw, ry), tintOf(f, 62))
  const svg = solid(p, body, f, reg) + solid(p, rim, f, rimShade) + lip
  return { soil: top, svg: svg + shape(p, soil, "ink") }
}

/** A short arc of radius `rr` round c from a0 to a1 (degrees, clockwise): an inner contour on a round form. */
export const arc = (p: Pen, c: P, rr: number, a0: number, a1: number) => {
  const [s, t] = [pol(c, a0 / 57.3, rr), pol(c, a1 / 57.3, rr)]
  return line(p, d`M ${s} A ${rr} ${rr} 0 0 1 ${t}`)
}

/** A frond: a long arching leaf cut into leaflets along both edges, a midrib, stipple on its lower half. */
function frond(p: Pen, b: P, t: P, c: P, w: number, f: string) {
  const nr = unitN(b, t)
  const side = (k: number) => {
    const e: P = [c[0] + nr[0] * w * k, c[1] + nr[1] * w * k]
    const notch = (u: number) => lerp(qAt(b, c, t, u), qAt(b, e, t, u), 0.14)
    const us = [0.06, 0.16, 0.26, 0.36, 0.46, 0.56, 0.66]
    return us.flatMap((u) => [notch(u), qAt(b, e, t, u + 0.13)])
  }
  const L = (pts: P[]) => pts.map(xy).join(" L ")
  const s = nr[0] + nr[1] >= 0 ? 1 : -1
  const half = d`M ${b} L ${L([...side(s), t])} Q ${c} ${b} Z`
  const all = d`M ${b} L ${L([...side(1), t, ...side(-1).reverse()])} Z`
  const rib = line(p, d`M ${b} Q ${c} ${t}`)
  return shape(p, all, f) + tint(half, stipple(p)) + rib
}

/** A palm: a ringed trunk curving up to a crown of six to eight arching fronds. */
const palm = garden("palm", "a palm tree", [300, 420], (p, r, F) => {
  const lf = fillOf(F, "fronds", "leaf")
  const top: P = [r("x").between(148, 162), r("y").between(138, 156)]
  const pts = cubic([122, 417], [102, 310], [top[0] - 46, 222], top, 14)
  const trunk = band(pts, 30, 17)
  const rings = cat(pts.slice(1, -2), (q, i) => {
    const w = (30 - (13 * (i + 1)) / 14) / 2
    const ring = d`M ${[q[0] - w, q[1] - 2]} Q ${[q[0], q[1] + 5]} ${[q[0] + w, q[1] - 2]}`
    return line(p, ring)
  })
  const s = r("fronds")
  const count = s.int(6, 8)
  const fronds = Array.from({ length: count }, (_, i) => {
    const a = (160 + (220 * i) / (count - 1) + s.between(-8, 8)) / 57.3
    const [L, c] = [s.between(112, 136), Math.cos(a)]
    const tip = pol(top, a, L)
    const bow = pol(top, a, L * 0.55)
    const end: P = [tip[0], tip[1] + L * 0.62 * c * c]
    const lift: P = [bow[0], bow[1] - L * 0.25 * Math.abs(c)]
    return { y: tip[1], svg: frond(p, top, end, lift, L * 0.3, lf) }
  }).sort((x, y) => x.y - y.y)
  const nut = fillOf(F, "nuts", "tone-2")
  const nuts = cat([2.2, 1.2, 0.4], (a) =>
    ball(p, ...pol(top, a, 15), 8.5, nut),
  )
  const wood = fillOf(F, "trunk", "stair")
  const body = solid(p, trunk.d, wood, trunk.half, false) + rings
  return body + cat(fronds, (x) => x.svg) + (r("nuts").chance(0.65) ? nuts : "")
})

/** A columnar cactus with two arms and fine ribs, in a round pot, sometimes in flower. */
const cactus = garden("cactus", "a cactus", [170, 330], (p, r, F) => {
  const f = fillOf(F, "cactus", "leaf")
  const cx = 80
  const tone = fillOf(F, "pot", r("pot").pick(["tone-1", "tone-2", "tone-4"]))
  const vase = pot(p, [cx, 330], [112, 74], tone, 1)
  const [bw, top] = [r("girth").between(23, 27), r("height").between(26, 58)]
  const soil = vase.soil + 4
  const s = r("arms")
  const arm = (k: number) => {
    const [t, ya] = [bw * 1.1, top + (soil - top) * s.between(0.42, 0.62)]
    const [xe, ax] = [cx + k * bw, cx + k * (bw + s.between(24, 32))]
    const ta = ya - s.between(46, 78)
    const [h, sw, fl, i] = [t / 2, k < 0 ? 1 : 0, t * 0.3, ax - (k * t) / 2]
    const out = d`M ${[xe - k * 6, ya + h]} H ${ax} A ${h} ${h} 0 0 ${sw} ${[ax + k * h, ya]} V ${ta}`
    const back = d`A ${h} ${h} 0 0 ${sw} ${[i, ta]} V ${ya - h - fl} Q ${[i, ya - h]} ${[i - k * fl, ya - h]} H ${xe - k * 6} Z`
    const [x0, x1] = [Math.min(ax, xe) - t, Math.max(ax, xe) + t]
    const reg = d`M ${[ax + t * 0.12, ta - t]} H ${ax + t} V ${ya} H ${ax + t * 0.12} Z M ${[x0, ya + t * 0.15]} H ${x1} V ${ya + t} H ${x0} Z`
    const rib = d`M ${[xe, ya]} H ${ax - k * t * 0.3} Q ${[ax, ya]} ${[ax, ya - t * 0.3]} V ${ta - t * 0.1}`
    return solid(p, `${out} ${back}`, f, reg) + line(p, rib)
  }
  const body = d`M ${[cx - bw, soil]} V ${top + bw} A ${bw} ${bw} 0 0 1 ${[cx + bw, top + bw]} V ${soil} Z`
  const ribs = cat([-0.62, -0.24, 0.18, 0.58], (k) => {
    const x = cx + k * bw
    const rib = d`M ${x} ${soil - 2} V ${top + bw} Q ${[x, top + bw * 0.3]} ${[cx + k * bw * 0.15, top + 3]}`
    return line(p, rib)
  })
  const bloom = fillOf(F, "bloom", "bloom")
  const c: P = [cx - 6, top + 2]
  const disc = (i: number) => circle(...pol(c, i * 1.257 - 1.57, 7, 0.86), 6)
  const petals = cat([0, 1, 2, 3, 4], (i) => shape(p, disc(i), bloom))
  const flower = petals + shape(p, circle(c[0], c[1], 3.6), "sun")
  const reg = d`M ${cx + bw * 0.3} 0 H ${cx + bw * 2} V ${soil} H ${cx + bw * 0.3} Z`
  const plant = arm(-1) + arm(1) + solid(p, body, f, reg) + ribs
  return vase.svg + plant + (r("flower").chance(0.65) ? flower : "")
})

/** A tall poppy: a four-petalled bloom with an ink centre, a nodding bud, curving stems and two leaves. */
const poppy = garden("poppy", "a poppy", [200, 400], (p, r, F) => {
  const [lf, st] = [fillOf(F, "leaves", "leaf"), fillOf(F, "stem", "leaf")]
  const petal = fillOf(F, "bloom", r("colour").pick(["bloom", "sun"]))
  const C: P = [r("x").between(104, 118), r("y").between(92, 104)]
  const [R, k] = [r("size").between(42, 47), r("bud").chance(0.5) ? 1 : -1]
  const o = R * 0.68
  const main = cubic([96, 400], [92, 300], [C[0] - 18, 210], C)
  const E: P = [98 + k * 60, r("bud-y").between(170, 196)]
  const bud = cubic([98, 400], [98 + k * 4, 300], [98 + k * 56, E[1] + 62], E)
  const tip: P = [E[0] + k * 32, E[1] - 27]
  const [m9, m6] = [at(main, 9), at(main, 6)]
  const up: P = [m9[0] - 62, m9[1] - 50]
  const out: P = [m6[0] + 58, m6[1] - 34]
  const leaves =
    leaf(p, m9, up, 30, lf, [m9[0] - 22, m9[1] - 44]) +
    leaf(p, m6, out, 26, lf, [m6[0] + 30, m6[1] - 40])
  const shadow = crescent(C[0], C[1], o + R, -(o + R) * 0.42, -(o + R) * 0.34)
  const petals = cat([225, 315, 135, 45], (deg) => {
    const a = deg / 57.3
    const pc = pol(C, a, o, 0.8)
    const crinkle = cat([-0.3, 0.25], (u) => {
      const seam = d`M ${pol(C, a + u, R * 0.55, 0.9)} L ${pol(C, a + u, o + R * 0.6, 0.8)}`
      return line(p, seam)
    })
    return solid(p, circle(pc[0], pc[1], R), petal, shadow) + crinkle
  })
  const dot = (i: number) => circle(...pol(C, i * 0.571, R * 0.3, 0.9), 1.5)
  const dots = cat([...Array(11).keys()], (i) => tint(dot(i), "paper"))
  const eye = shape(p, ellipse(C[0], C[1], R * 0.44, R * 0.4), "ink")
  return (
    stem(p, bud, 6, 5, st) +
    leaf(p, E, tip, 36, fillOf(F, "bud", "leaf")) +
    leaf(p, lerp(E, tip, 0.4), tip, 10, petal) +
    leaves +
    stem(p, main, 7, 5.5, st) +
    petals +
    eye +
    dots +
    ball(p, C[0], C[1], R * 0.15, "leaf")
  )
})

export const GARDEN: Thing[] = [palm, cactus, poppy]
