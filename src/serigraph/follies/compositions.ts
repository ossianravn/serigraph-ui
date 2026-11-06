// Scenes composed from the object library: a procession of objects in an arcade's niches, a skyline of objects on a
// cloud bank (the observatory and the stage are in compositions-more.ts). Each picks its objects from a pool by seed and skips
// any name the library does not have, so a scene never breaks while the library grows.
import { box } from "./buildings"
import { cloudBank } from "./clouds"
import { line, scatter, shape, stipple, tint } from "./motifs"
import { OBJECTS, put, type Thing } from "./objects"
import type { Scene } from "./scene"
import { n, rs, type Rs } from "./svg"

/** `count` different objects from `pool`, in a seeded order, skipping names the library lacks. */
function pick(r: Rs, pool: readonly string[], count: number): Thing[] {
  const have = pool.map((name) => OBJECTS[name]).filter((t): t is Thing => !!t)
  const out: Thing[] = []
  const left = [...have]
  while (out.length < count && left.length > 0)
    out.push(left.splice(Math.floor(r.next() * left.length), 1)[0] as Thing)
  return out
}

/** The height that fits a thing inside a box of w × h. */
const fit = (t: Thing, w: number, h: number) => Math.min(h, (w * t.h) / t.w)

const NICHE = [
  "globe",
  "hourglass",
  "lantern",
  "armillary-sphere",
  "telescope",
  "urn",
  "topiary",
  "orange-tree",
  "cactus",
  "column",
  "obelisk",
  "sundial",
  "microphone",
  "bell",
  "allium",
] as const

/** A procession: a long arcade whose lit niches each hold a different object, standing on one floor, clouds below. */
export const procession: Scene = {
  w: 1600,
  h: 440,
  fit: "xMidYMax slice",
  body: (p, seed) => {
    const r = rs(seed, "procession")
    const [bay, pier, top, floor] = [228, 54, 64, 372]
    const count = Math.ceil(1600 / bay) + 1
    const things = pick(r, NICHE, count)
    const wall = r.pick(["tone-4", "structure", "tone-1"])
    const lit = ["sun", "highlight", "plane-2", "tone-2"].filter(
      (f) => f !== wall,
    )
    let niches = ""
    for (let i = 0; i < count; i++) {
      const x = -60 + i * bay + pier / 2
      const w = bay - pier
      const rad = w / 2
      const d = `M ${n(x)} ${n(floor)} V ${n(top + 70 + rad)} A ${n(rad)} ${n(rad)} 0 0 1 ${n(x + w)} ${n(top + 70 + rad)} V ${n(floor)} Z`
      const back = lit[i % lit.length] as string
      niches +=
        shape(p, d, back) +
        tint(
          `M ${n(x + w - 14)} ${n(floor)} V ${n(top + 70 + rad)} H ${n(x + w)} V ${n(floor)} Z`,
          stipple(p),
        )
      const t = things[i % Math.max(1, things.length)]
      if (t) {
        const h = fit(t, w - 26, floor - top - 96)
        const tw = (t.w * h) / t.h
        niches += put(p, seed, t, {
          x: x + (w - tw) / 2,
          y: floor - 4,
          h,
          key: `n${i}`,
        })
      }
    }
    return (
      box(p, {
        x: -80,
        y: top,
        w: 1760,
        h: floor - top,
        fill: wall,
        depth: 1,
      }) +
      niches +
      line(p, `M -80 ${n(top + 30)} H 1680`) +
      line(p, `M -80 ${n(floor)} H 1680`) +
      cloudBank(p, rs(seed, "procession-clouds"), {
        x0: -40,
        x1: 1640,
        base: 452,
        top: 392,
        rmin: 20,
        rmax: 34,
        fill: "cloud",
      })
    )
  },
}

const TALL = [
  "lighthouse",
  "spiral-stair",
  "obelisk",
  "cypress",
  "palm",
  "column",
  "great-telescope",
  "advertising-column",
] as const
const SHORT = [
  "globe",
  "hourglass",
  "urn",
  "fountain",
  "gate",
  "cactus",
  "topiary",
  "speaker-stack",
  "sundial",
  "orange-tree",
  "hedge-arch",
  "suitcase",
] as const

/** A skyline: tall and short objects alternating on a cloud bank, a sun or a planet behind, the sky's marks above. */
export const skyline: Scene = {
  w: 1600,
  h: 520,
  fit: "xMidYMax slice",
  body: (p, seed) => {
    const r = rs(seed, "skyline")
    const tall = pick(r, TALL, 5)
    const short = pick(r, SHORT, 5)
    const row: { t: Thing; h: number }[] = []
    for (let i = 0; i < 10; i++) {
      const t = (i % 2 ? short : tall)[Math.floor(i / 2)]
      if (t)
        row.push({ t, h: i % 2 ? r.between(170, 240) : r.between(330, 420) })
    }
    const widths = row.map(({ t, h }) => (t.w * h) / t.h)
    const gap = Math.max(
      10,
      (1640 - widths.reduce((a, b) => a + b, 0)) / Math.max(1, row.length - 1),
    )
    let x = -20
    let things = ""
    row.forEach(({ t, h }, i) => {
      things += put(p, seed, t, {
        x,
        y: 470,
        h,
        key: `s${i}`,
        flip: r.chance(0.3),
      })
      x += (widths[i] ?? 0) + gap
    })
    const sky = OBJECTS["ringed-planet"] ?? OBJECTS["sun-rays"]
    return (
      (sky
        ? put(p, seed, sky, {
            x: r.between(560, 900),
            y: 230,
            h: 170,
            key: "sky",
          })
        : "") +
      scatter(p, rs(seed, "skyline-sky"), {
        x0: 40,
        y0: 20,
        x1: 1560,
        y1: 160,
        sparkles: 6,
        rings: 4,
        dots: 8,
      }) +
      things +
      cloudBank(p, rs(seed, "skyline-clouds"), {
        x0: -40,
        x1: 1640,
        base: 540,
        top: 450,
        rmin: 22,
        rmax: 38,
        fill: "cloud",
      })
    )
  },
}
