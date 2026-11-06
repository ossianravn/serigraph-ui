// Objects: the garden, continued. Each object draws in its own box; see library.ts for the contract and architecture.ts
// for the bar. The path tag, curves, bands, leaves and pots come from garden.ts.
import { archPath, box, DEPTH, shade, tintOf } from "../buildings"
import * as M from "../motifs"
import { el, n } from "../svg"
import { cylinder } from "./forms"
import * as G from "./garden"
import { fillOf, type Thing } from "./library"

const { ball, circle, crescent, ellipse, line, shape, sparkle } = M
const { stipple, tint } = M
const { arc, at, cat, cubic, d, garden, leaf, lerp, pol, pot } = G
const { solid, stem, xy } = G
type P = G.P
type P3 = [number, number, number]
const keys = (k: number) => [...Array(k).keys()]

/** Three daisies, paper petals round a sun centre, on stems of different heights with leaves at their foot. */
const art: Thing["draw"] = (p, r, F) => {
  const [lf, pf] = [fillOf(F, "leaves", "leaf"), fillOf(F, "petals", "paper")]
  const s = r("heads")
  const heads: P3[] = [
    [s.between(54, 62), s.between(140, 166), 34],
    [s.between(112, 122), s.between(46, 66), 39],
    [s.between(166, 174), s.between(104, 124), 32],
  ]
  const stems = heads.map(([x, y], i) => {
    const c: P = [x + (110 - x) * 0.25, y + (340 - y) * 0.45]
    return cubic([110, 340], [110 + (i - 1) * 6, 280], c, [x, y], 18)
  })
  const head = ([x, y, R]: P3, i: number) => {
    const [rc, g] = [R * 0.34, s.between(-14, 14)]
    const mid = (rc * 0.8 + R) / 2
    const e = ellipse(mid, 0, (R - rc * 0.8) / 2, mid * 0.215)
    const turn = (a: number) => ({ transform: `rotate(${n(a)})` })
    const as = keys(13).map((j) => (j * 360) / 13 + i * 9)
    const dark = as.filter((a) => (a + g + 355) % 360 <= 90)
    const fill = cat(as, (a) => shape(p, e, pf, turn(a)))
    const marks = cat(dark, (a) => tint(e, stipple(p), turn(a)))
    const k = n(s.between(0.78, 0.95))
    const t = `translate(${n(x)} ${n(y)}) rotate(${n(g)}) scale(1 ${k})`
    const eye = ball(p, 0, 0, rc, fillOf(F, "centre", "sun"))
    return el("g", { transform: t }, fill + marks + eye)
  }
  const ls = r("leaves")
  const leaves = cat([-1, 1, -1, 1], (k, i) => {
    const [L, a] = [ls.between(56, 74), (i < 2 ? 52 : 70) / 57.3]
    const tip: P = [110 + k * Math.cos(a) * L, 338 - Math.sin(a) * L]
    const c: P = [110 + k * Math.cos(a) * L * 0.3, 338 - L * 0.62]
    return leaf(p, [110 + k * 2, 338], tip, 22, lf, c)
  })
  const knees = [at(at(stems, 0), 9), at(at(stems, 2), 10)]
  const mids = cat(knees, (q, i) => {
    return leaf(p, q, [q[0] + (i ? 30 : -30), q[1] - 26], 14, lf)
  })
  const st = fillOf(F, "stem", "leaf")
  const flowers = cat([1, 0, 2], (i) => head(at(heads, i), i))
  return cat(stems, (q) => stem(p, q, 5, 4, st)) + mids + leaves + flowers
}
const daisies = garden("daisy-bunch", "a bunch of daisies", [220, 340], art)

/** A tall allium: a straight stem carrying a ball of tiny star florets, two strap leaves at its foot. */
const allium = garden("allium", "an allium", [170, 420], (p, r, F) => {
  const lf = fillOf(F, "leaves", "leaf")
  const foot: P = [84, 420]
  const R = r("size").between(56, 64)
  const H: P = [r("x").between(84, 92), r("y").between(R + 6, R + 24)]
  const strap = (k: number) => {
    const s = r(`leaf${k}`)
    const tip: P = [84 + k * s.between(60, 74), 420 - s.between(110, 160)]
    return leaf(p, foot, tip, 17, lf, [84 + k * 6, tip[1] - s.between(10, 30)])
  }
  const pt = (i: number) => pol(H, (i / 26) * Math.PI * 2, R)
  const bumps = cat(keys(26), (i) => d` A 7.8 7.8 0 0 1 ${pt(i + 1)}`)
  const florets = cat(keys(40), (i) => {
    const q = pol(H, i * 2.39996, R * 0.86 * Math.sqrt((i + 0.5) / 40))
    return i % 3 === 1 ? sparkle(p, ...q, 4.6) : tint(circle(...q, 1.9), "ink")
  })
  const bloom = fillOf(F, "head", r("colour").pick(["tone-4", "bloom"]))
  const shadow = crescent(...H, R * 1.1, -R * 0.46, -R * 0.36)
  const head = solid(p, d`M ${pt(0)}${bumps} Z`, bloom, shadow)
  const st = cubic(foot, [80, 330], [H[0] + 4, 220], H)
  const stalk = stem(p, st, 7, 5.5, fillOf(F, "stem", "leaf"))
  return stalk + strap(-1) + strap(1) + head + florets
})

/** A fern: arching fronds of paired leaflets from one clump, and sometimes a curled fiddlehead. */
const fern = garden("fern", "a fern", [280, 240], (p, r, F) => {
  const lf = fillOf(F, "fronds", "leaf")
  const B: P = [140, 236]
  const s = r("fronds")
  const plan = [-1, -0.5, 0.1, 0.6, 1].map((l): P => [l, s.between(150, 196)])
  plan.sort((a, b) => Math.abs(a[0]) - Math.abs(b[0]))
  const fronds = cat(plan, ([l, h]) => {
    const [g, sp] = [Math.sign(l) || 1, Math.abs(l)]
    const Hf = h * (1 - sp * 0.25)
    const c1: P = [B[0] + g * sp * 25, B[1] - Hf * 0.85]
    const c2: P = [B[0] + g * (30 + sp * 76), B[1] - Hf * 1.05]
    const end: P = [B[0] + g * (44 + sp * 62), B[1] - Hf * (0.84 - sp * 0.46)]
    const pts = cubic(B, c1, c2, end, 40)
    let out = ""
    for (let i = 4; i < 39; i += 3) {
      const [q, a, b] = [at(pts, i), at(pts, i - 1), at(pts, i + 1)]
      const tg = Math.atan2(b[1] - a[1], b[0] - a[0])
      const len = 26 * (1 - i / 40) ** 0.75 + 5
      for (const k of [-1, 1]) {
        const mid = lerp(q, pol(q, tg + k * 0.85, len), 0.55)
        out += leaf(p, q, pol(q, tg + k * 1.05, len), len * 0.3, lf, mid)
      }
    }
    return out + stem(p, pts, 4.5, 1.6, fillOf(F, "stalk", "leaf"))
  })
  const top: P = [B[0] - 22, B[1] - 66]
  const turn = (i: number) => pol(top, (i / 33) * 10.7 + 3.14, 9 - (9 * i) / 38)
  const coil =
    "M " +
    keys(34)
      .map((i) => xy(turn(i)))
      .join(" L ")
  const c: P = [top[0] - 16, top[1] + 16]
  const stalk = cubic(B, [B[0] - 4, B[1] - 30], c, [top[0] - 9, top[1]], 12)
  const head = shape(p, circle(...top, 10), lf) + line(p, coil)
  const curl = stem(p, stalk, 5, 4, lf) + head
  return fronds + (r("fiddlehead").chance(0.7) ? curl : "")
})

/** The urn's half profile, radius then height, from the lip down to the foot. */
const PROF = [
  38, 96, 40, 104, 26, 112, 23, 124, 34, 136, 53, 160, 48, 190, 30, 210, 13,
  220, 11, 230, 16, 240, 24, 246, 24, 254,
]
/** Points through a profile, smoothed: quadratics through the midpoints, the points as controls. */
const smooth = (pts: P[]) =>
  cat(pts.slice(1, -1), (a, i) => {
    const b = at(pts, i + 2)
    return d` Q ${a} ${i === pts.length - 3 ? b : lerp(a, b, 0.5)}`
  })

/** A classical urn on a short plinth, a plant spilling over its rim. */
const urn = garden("urn", "an urn", [200, 300], (p, r, F) => {
  const f = fillOf(F, "urn", r("urn").pick(["tone-1", "tone-4", "plane-2"]))
  const [lf, bl] = [fillOf(F, "plant", "leaf"), fillOf(F, "bloom", "bloom")]
  const cx = 109
  const side = (k: number) =>
    PROF.flatMap((v, i): P[] => (i % 2 ? [] : [[cx + k * v, at(PROF, i + 1)]]))
  const [right, left, inner] = [side(1), side(-1).reverse(), side(0.38)]
  const body = d`M ${at(right, 0)}${smooth(right)} A 24 5 0 0 1 ${at(left, 0)}${smooth(left)} Z`
  const reg = d`M ${at(inner, 0)}${smooth(inner)} H ${cx + 70} V 90 Z`
  const ring = (rr: number, y: number) =>
    line(p, d`M ${cx - rr} ${y} A ${rr} ${rr * 0.28} 0 0 0 ${cx + rr} ${y}`)
  const flute = (k: number) =>
    line(p, d`M ${cx + k * 10} 210 Q ${cx + k * 19} 192 ${cx + k * 17} 172`)
  const handle = (k: number) => {
    const c = (x: number, y: number): P => [cx + k * x, y]
    const pts = cubic(c(22, 116), c(62, 98), c(66, 140), c(44, 150), 16)
    return stem(p, pts, 7, 5, f)
  }
  const mound = cat([-0.9, -0.45, 0, 0.45, 0.9], (k) => {
    const tip: P = [cx + k * 40, 64 + Math.abs(k) * 16]
    return leaf(p, [cx + k * 10, 98], tip, 16, lf)
  })
  const s = r("trail")
  const vine = (k: number) => {
    const c = (x: number, y: number): P => [cx + k * x, y]
    const drop = k < 0 ? s.between(100, 150) : s.between(40, 70)
    const end = c(s.between(56, 64), 100 + drop)
    const pts = cubic(c(22, 98), c(54, 84), c(64, 118), end)
    const fl = s.chance(0.6)
    const leaves = cat([5, 9, 13, 17, 21], (i) => {
      const [q, o] = [at(pts, i), (i - 5) % 8 ? -1 : 1]
      const bud = i === 13 && fl ? ball(p, q[0] - o * 6, q[1] + 4, 5, bl) : ""
      return leaf(p, q, [q[0] + o * 15, q[1] + 10], 10, lf) + bud
    })
    const last = leaf(p, end, [end[0] + k * 4, end[1] + 16], 9, lf)
    return stem(p, pts, 3, 2.4, lf) + leaves + last
  }
  const pl = fillOf(F, "plinth", "structure")
  const lip = shape(p, ellipse(cx, 96, 38, 10), tintOf(f, 62))
  const mouth = shape(p, ellipse(cx, 97, 30, 7), "ink")
  const bands = ring(23, 124) + ring(30, 210) + ring(16, 240)
  const vase = solid(p, body, f, reg) + bands + cat([-2, -1, 0, 1, 2], flute)
  const plant = lip + mouth + mound + vine(-1) + vine(1)
  const stand = box(p, { x: 52, y: 258, w: 100, h: 42, fill: pl, depth: 0.6 })
  return stand + handle(-1) + handle(1) + vase + plant
})

/** A fountain: a round basin, a column carrying a bowl, a jet, and water falling in paper arcs. */
const fountain = garden("fountain", "a fountain", [300, 300], (p, r, F) => {
  const tone = r("stone").pick(["tone-1", "plane-2", "structure"])
  const stone = fillOf(F, "stone", tone)
  const water = fillOf(F, "water", "platform")
  const [cx, yb, rb] = [150, r("bowl").between(118, 132), 72]
  const bowl = d`M ${cx - rb} ${yb} A ${rb} 30 0 0 0 ${cx + rb} ${yb} Z`
  const fall = (pts: P[], w: number) => stem(p, pts, w, 1.3, "paper")
  const drop = (x: number, y: number) => shape(p, circle(x, y, 2.3), "paper")
  const cyl = (base: number, rx: number, h: number, ry?: number) =>
    cylinder(p, { cx, base, rx, h, fill: stone, ry, top: false })
  const s = r("water")
  const arcs = (k: number, j: number) => {
    const [x0, y0] = [cx + k * rb * (0.98 - j * 0.24), yb + 1 + j * 9]
    const xe = cx + k * (rb + 28 - j * 20 + s.between(-3, 3))
    const ye = 236 + j * 4
    const c1: P = [x0 + k * (20 - j * 5), y0 - 12 + j * 4]
    const pts = cubic([x0, y0], c1, [xe + k * 4, y0 + 34], [xe, ye])
    const splash = line(p, ellipse(xe, ye + 2, 9 - j, 2.4))
    const spray = j ? "" : drop(xe + k * 9, ye - 10) + drop(xe - k * 7, ye - 14)
    return fall(pts, 6 - j * 0.8) + splash + spray
  }
  const jet = (k: number) => {
    const c = (x: number, y: number): P => [cx + k * x, yb - y]
    return fall(cubic(c(0, 36), c(3, 66), c(30, 66), c(42, 2), 20), 5.5)
  }
  const rim = shape(p, ellipse(cx, 232, 128, 28), tintOf(stone, 62))
  const pool = shape(p, ellipse(cx, 234, 114, 22), water)
  const ripple = line(p, d`M ${cx - 64} 238 A 64 13 0 0 0 ${cx + 64} 238`)
  const shadow = crescent(cx, yb - 12, rb * 1.04, -rb * 0.5, -rb * 0.3)
  const lid = shape(p, ellipse(cx, yb, rb, 16), tintOf(stone, 62))
  const well = shape(p, ellipse(cx, yb + 1, rb - 9, 11.5), water)
  const knob = ball(p, cx, yb - 30, 9, fillOf(F, "finial", "sun"))
  const lower = cyl(268, 128, 36, 28) + rim + pool + ripple
  const upper = cyl(238, 12, 238 - yb) + solid(p, bowl, stone, shadow)
  const top = lid + well + cyl(yb + 2, 6, 26) + knob + jet(-1) + jet(1)
  return lower + upper + top + cat([-1, 1], (k) => arcs(k, 0) + arcs(k, 1))
})

/** A clipped hedge arch: a thick round arch of hedge on two piers, the sky through it, sometimes a ball on top. */
const hedge = garden("hedge-arch", "a hedge arch", [290, 320], (p, r, F) => {
  const f = fillOf(F, "hedge", "leaf")
  const [dx, dy] = [DEPTH[0] * 0.9, DEPTH[1] * 0.9]
  const [cx, foot, R, ri] = [128, 318, 108, r("opening").between(54, 62)]
  const [spring, x1] = [foot - 258 + R, cx + R]
  const T: P = [cx - R * 0.53, spring - R * 0.85]
  const top = d`M ${T} L ${[T[0] + dx, T[1] + dy]} A ${R} ${R} 0 0 1 ${[x1 + dx, spring + dy]} L ${[x1, spring]} A ${R} ${R} 0 0 0 ${T} Z`
  const face = d`M ${[x1, spring]} L ${[x1 + dx, spring + dy]} V ${foot + dy} L ${[x1, foot]} Z`
  const tall = foot - spring
  const opening = archPath(cx - ri, foot, ri * 2, tall + ri)
  const back = archPath(cx - ri + dx, foot + dy, ri * 2, tall + ri)
  const front = `${archPath(cx - R, foot, R * 2, tall + R)} ${opening}`
  const [id, reveal] = [p.uid("arch"), `${opening} ${back}`]
  const eo = { "fill-rule": "evenodd" }
  const inner = shape(p, reveal, shade(f), eo) + tint(reveal, stipple(p), eo)
  const cut = el("clipPath", { id }, el("path", { d: opening }, null))
  const g = el("g", { "clip-path": `url(#${id})` }, inner + line(p, back))
  const s = r("sprigs")
  const sprigs = cat([0, 1, 2, 3], (i) => {
    const a = (205 + i * 42 + s.between(-12, 12)) / 57.3
    const [c, sn, L] = [Math.cos(a), Math.sin(a), s.between(12, 18)]
    const b = pol([cx, spring], a, R - 3)
    const t: P = [b[0] + c * L - sn * 4, b[1] + sn * L + c * 4]
    return leaf(p, b, t, 8, f)
  })
  const knob: P = [cx + dx / 2, spring - R + dy / 2]
  const pole = stem(p, [pol(knob, 1.57, 4), pol(knob, -1.57, 18)], 6, 6, f)
  const orb = ball(p, knob[0], knob[1] - 30, 15, fillOf(F, "ball", "leaf"))
  const sides = shape(p, face, shade(f)) + tint(face, stipple(p))
  const wall = shape(p, front, f, eo) + cut + g + shape(p, opening, "none")
  const ball1 = r("finial").chance(0.7) ? pole + orb : ""
  return sides + shape(p, top, tintOf(f, 70)) + wall + sprigs + ball1
})

/** A small orange tree in a pot: a round crown of leafy puffs with fruit in it. */
const tree = garden("orange-tree", "an orange tree", [180, 300], (p, r, F) => {
  const f = fillOf(F, "crown", "leaf")
  const cx = 90
  const tone = fillOf(F, "pot", r("pot").pick(["tone-1", "tone-4", "plane-2"]))
  const vase = pot(p, [cx, 300], [80, 66], tone)
  const C: P = [cx, r("height").between(88, 102)]
  const s = r("puffs")
  const turn = s.between(0, 0.8)
  const lobes = keys(8).map((i) => {
    const a = turn + (i * Math.PI) / 4
    return { a, c: pol(C, a, 40, 0.95), r: s.between(25, 29) }
  })
  const parts = circle(...C, 46) + cat(lobes, (q) => " " + circle(...q.c, q.r))
  const low = lobes.filter((q) => Math.sin(q.a) > 0.5)
  const contours = cat(low, (q) => arc(p, q.c, q.r, 204, 250))
  const fs = r("fruit")
  const [fruit, want]: [P[], number] = [[], fs.int(7, 11)]
  for (let k = 0; k < 80 && fruit.length < want; k++) {
    const q = pol(C, fs.between(0, 6.28), 56 * Math.sqrt(fs.next()))
    const far = fruit.every((o) => Math.hypot(o[0] - q[0], o[1] - q[1]) > 19)
    if (far) fruit.push(q)
  }
  const id = p.uid("crown")
  const shadow = crescent(...C, 72, -30, -24)
  const marks = tint(shadow, shade(f)) + tint(shadow, stipple(p))
  const edge = line(p, parts, { "stroke-width": p.L * 2 })
  const cut = el("clipPath", { id }, el("path", { d: parts }, null))
  const crown = edge + tint(parts, f) + cut
  const shaded = el("g", { "clip-path": `url(#${id})` }, marks)
  const base: P = [cx, vase.soil + 4]
  const wood = fillOf(F, "trunk", "stair")
  const trunk = stem(p, [base, [cx, C[1] + 30]], 9, 7, wood)
  const sun = fillOf(F, "fruit", "sun")
  const oranges = cat(fruit, (q) => ball(p, ...q, 7.5, sun))
  return vase.svg + trunk + crown + shaded + contours + oranges
})

export const GARDEN_MORE = [daisies, allium, fern, urn, fountain, hedge, tree]
