// Objects: clipped and columnar garden trees. The cypress's edge is a run of upward flame tongues, so it reads as
// foliage at any size; the topiary is one, two or three clipped balls on a trunk in a Versailles planter.
import { box } from "../buildings"
import { line, shape } from "../motifs"
import { sphere } from "./forms"
import { arc, cat, d, garden, lerp, solid, stem, type P } from "./garden"
import { fillOf, type Thing } from "./library"

/** A cypress: a tall flame of foliage, its edges scalloped into tongues, tufts inside, stipple down its right. */
const cypress = garden("cypress", "a cypress", [120, 400], (p, r, F) => {
  const f = fillOf(F, "foliage", "leaf")
  const [cx, yb] = [58, 384]
  const W = r("width").between(34, 40)
  const yt = r("height").between(10, 44)
  const lean = r("lean").between(-4, 8)
  const H = yb - yt
  // Half its width at u (0 the foot, 1 the tip): fullest a third of the way up, rounding in at the foot.
  const hw = (u: number) =>
    u < 0.3 ? W * (0.72 + u * 0.93) : W * ((1 - u) / 0.7) ** 0.75
  const at = (u: number, k: number, g = 1): P => [
    cx + lean * u * u + k * hw(u) * g,
    yb - H * u,
  ]
  const s = r("tongues")
  const N = s.int(8, 10)
  const us = Array.from({ length: N + 1 }, (_, i) => (i / N) ** 1.15)
  // Each tongue between heights a and b bulges out and curls up: its control stands 70% of the way up.
  const tongue = (a: number, b: number, k: number): P => [
    at(a + (b - a) * 0.62, k, 1.18 + s.between(0, 0.1))[0],
    at(a + (b - a) * 0.7, 0)[1],
  ]
  const notch = (u: number, k: number) => at(u, k, u > 0 && u < 1 ? 0.84 : 1)
  const steps = us.slice(1).map((u, i) => [us[i]!, u] as const)
  const left = cat(steps, ([a, b]) => d` Q ${tongue(a, b, -1)} ${notch(b, -1)}`)
  const right = cat(
    steps.slice().reverse(),
    ([a, b]) => d` Q ${tongue(a, b, 1)} ${notch(a, 1)}`,
  )
  const foot = d` A ${hw(0)} ${W * 0.3} 0 0 1 ${at(0, -1)} Z`
  const outline = d`M ${at(0, -1)}` + left + right + foot
  const tip = at(1, 0)
  const side = d`M ${tip} C ${at(0.7, 0.3)} ${at(0.3, 0.5)} ${[cx + W * 0.3, yb + 12]} H ${cx + W * 3} V ${yt - 6} Z`
  // Tufts: short upturned strokes in staggered rows, fewer toward the tip.
  const t = r("tufts")
  const tufts = cat([0.16, 0.3, 0.44, 0.58, 0.72], (u, j) =>
    cat(
      j % 2 ? [-0.42, 0.18] : [-0.12, 0.46].slice(0, u > 0.6 ? 1 : 2),
      (k) => {
        const [x, y] = at(u + t.between(-0.03, 0.03), k)
        const h = H * 0.07 * (1 - u * 0.5)
        return line(
          p,
          d`M ${[x - 2, y + h * 0.4]} Q ${[x + 3, y - h * 0.1]} ${[x + 1, y - h]}`,
        )
      },
    ),
  )
  const wood = fillOf(F, "trunk", "structure")
  const trunk = stem(
    p,
    [
      [cx, 400],
      [cx, yb - 8],
    ],
    11,
    10,
    wood,
  )
  return trunk + solid(p, outline, f, side) + tufts
})

/** A topiary tree: one, two or three clipped balls on a straight trunk, in a planter with corner finials and feet. */
const topiary = garden("topiary", "a topiary tree", [190, 300], (p, r, F) => {
  const f = fillOf(F, "foliage", "leaf")
  const tub = fillOf(
    F,
    "planter",
    r("tub").pick(["tone-1", "plane-2", "stair"]),
  )
  const wood = fillOf(F, "trunk", "structure")
  const [x, y, w, h] = [34, 236, 104, 54]
  const c: P = [x + w / 2 + 12, y - 7.5]
  const k = (q: P) => lerp(c, q, 0.8)
  const soil = d`M ${k([x, y])} L ${k([x + 24, y - 15])} L ${k([x + w + 24, y - 15])} L ${k([x + w, y])} Z`
  const feet = cat([x + 6, x + w - 18], (fx) =>
    box(p, { x: fx, y: y + h, w: 12, h: 300 - y - h, fill: tub, depth: 0.3 }),
  )
  const panel = shape(
    p,
    d`M ${x + 9} ${y + 9} H ${x + w - 9} V ${y + h - 9} H ${x + 9} Z`,
    "none",
  )
  const finials = cat(
    [
      [x, y],
      [x + w, y],
      [x + w + 24, y - 15],
    ] as P[],
    ([fx, fy]) => sphere(p, fx, fy - 6, 6.5, tub),
  )
  // Balls from the top down: each a little smaller, the trunk showing between them.
  const form = r("form").pick([1, 2, 2, 3])
  const s = r("size")
  const R0 =
    form === 1
      ? s.between(56, 66)
      : form === 2
        ? s.between(40, 46)
        : s.between(30, 34)
  const radii = Array.from({ length: form }, (_, i) => R0 * (1 - i * 0.2))
  const gap = form === 1 ? r("trunk").between(58, 76) : 14
  let top = c[1] - gap
  const balls = radii.map((R) => {
    const o: P = [c[0], top - R]
    top -= R * 2 + (form === 3 ? 10 : 16)
    return { o, R }
  })
  const crown = cat(
    balls.slice().reverse(),
    ({ o, R }) =>
      sphere(p, o[0], o[1], R, f) +
      arc(p, o, R * 0.76, 198, 244) +
      arc(p, o, R * 0.52, 214, 240),
  )
  const highest = balls[balls.length - 1]!
  return (
    feet +
    box(p, { x, y, w, h, fill: tub }) +
    panel +
    shape(p, soil, "ink") +
    stem(p, [c, [c[0], highest.o[1]]], 10, 8, wood) +
    crown +
    finials
  )
})

export const GARDEN_TREES: Thing[] = [cypress, topiary]
