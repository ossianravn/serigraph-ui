// Objects: the sky, continued: a constellation, a rainbow, clouds, a star cluster and the moon's phases. Clouds are
// drawn in painter's order: one ink outline round the whole, then each puff from back to front, shaded on its lower
// right, with open arcs only where a puff in front overlaps one behind.
import { shade, tintOf } from "../buildings"
import { circle, crescent, line, pinpoint, ring, shape } from "../motifs"
import { sparkle, stipple, tint } from "../motifs"
import { n, type Pen, type Rs } from "../svg"
import { fillOf, type Thing } from "./library"
import { dots, looseLine, puff, sky, star } from "./sky"
import type { Block, Draw, Lump } from "./sky"

const DEG = Math.PI / 180

const inside = (q: Lump | Block, x: number, y: number) =>
  "r" in q
    ? (x - q.cx) ** 2 + (y - q.cy) ** 2 < (q.r - 0.4) ** 2
    : x > q.x0 && x < q.x1 && y > q.y0 && y < q.y1
const pathOf = (q: Lump | Block) =>
  "r" in q
    ? circle(q.cx, q.cy, q.r)
    : `M ${n(q.x0)} ${n(q.y0)} H ${n(q.x1)} V ${n(q.y1)} H ${n(q.x0)} Z`

/** Lumps, listed from back to front, drawn as one cloud. */
export function lumps(p: Pen, list: (Lump | Block)[]) {
  const d = list.map(pathOf).join(" ")
  let [body, arcs] = ["", ""]
  list.forEach((q, i) => {
    body += tint(pathOf(q), q.fill)
    if (!("r" in q)) return
    body += tint(crescent(q.cx, q.cy, q.r, -q.r * 0.42, -q.r * 0.34), q.dots)
    // Its arc shows only where it lies over a lump behind and under none in front: at most 66 degrees, open, centred
    // as near the upper left as the run allows.
    const pt = (a: number) =>
      `${n(q.cx + Math.cos(a) * q.r)} ${n(q.cy + Math.sin(a) * q.r)}`
    let run: number[] = []
    const flush = () => {
      if (run.length > 4) {
        const [lo, hi] = [run[1]!, run[run.length - 2]!]
        const mid = Math.min(Math.max(225 * DEG, lo + 33 * DEG), hi - 33 * DEG)
        const [a0, a1] = [
          Math.max(lo, mid - 33 * DEG),
          Math.min(hi, mid + 33 * DEG),
        ]
        arcs += `M ${pt(a0)} A ${n(q.r)} ${n(q.r)} 0 0 1 ${pt(a1)} `
      }
      run = []
    }
    for (let a = 150 * DEG; a <= 330 * DEG; a += 3 * DEG) {
      const [x, y] = [q.cx + Math.cos(a) * q.r, q.cy + Math.sin(a) * q.r]
      const behind = list.slice(0, i).some((b) => inside(b, x, y))
      if (behind && !list.slice(i + 1).some((f) => inside(f, x, y))) run.push(a)
      else flush()
    }
    flush()
  })
  const outline = `<path d="${d}" style="fill:var(--ink);stroke:var(--ink)" stroke-width="${p.L * 2}" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`
  return outline + body + (arcs ? line(p, arcs) : "")
}

/**
 * A flat-bottomed cloud from x0 to x1 on `base`, rising to a crown: a front row in paper shaded with dots of the cloud
 * colour, and a back row in the cloud colour; or, given a coloured `face`, one row in that colour.
 */
export function puffCloud(
  p: Pen,
  r: Rs,
  [x0, x1, base, rmax]: number[],
  back = "cloud",
  face = "paper",
) {
  const solo = face !== "paper"
  const [ink, tone] = [stipple(p), dots(p, back)]
  const count =
    Math.max(3, Math.round((x1! - x0!) / (rmax! * 1.4))) + r.int(0, 1)
  const front = Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1)
    const rad = rmax! * (0.62 + 0.38 * Math.sin(Math.PI * (0.15 + 0.7 * t)))
    const k = r.between(0.9, 1.05)
    return {
      ...puff(0, base! - rad * k, rad * k, face, solo ? ink : tone.url),
      t,
    }
  })
  const [first, last] = [front[0]!, front[count - 1]!]
  const span = x1! - x0! - first.r - last.r
  for (const q of front) q.cx = x0! + first.r + span * q.t
  const backs = Array.from({ length: solo ? 0 : count - 1 }, (_, i) => {
    const [a, b] = [front[i]!, front[i + 1]!]
    const rad = Math.max(a.r, b.r) * r.between(0.78, 0.92)
    const cy = Math.min(a.cy, b.cy) - rad * r.between(0.42, 0.6)
    return puff((a.cx + b.cx) / 2 + r.between(2, 10), cy, rad, back, ink)
  })
  const y0 = base! - Math.min(first.r, last.r)
  const floor = { x0: first.cx, x1: last.cx, y0, y1: base!, fill: face }
  return tone.def + lumps(p, [...backs, floor, ...front])
}

/** A constellation: five to seven stars in spot colours and a double star, joined by fine lines that stop short of each, in a dust of pinpoints. */
const constellation: Draw = (p, r) => {
  // A walk of turning steps, scaled to fill the box, stretching one way by at most 1.8 times the other.
  const lay = r("layout")
  const count = lay.int(5, 7)
  let [x, y, head, bend] = [0, 0, lay.between(-0.5, 0.5), lay.pick([-1, 1])]
  const walk = Array.from({ length: count }, () => {
    const pt = { x, y }
    if (lay.chance(0.3)) bend = -bend
    head += bend * lay.between(0.3, 1.1)
    const len = lay.between(0.8, 1.3)
    ;[x, y] = [x + Math.cos(head) * len, y + Math.sin(head) * len]
    return pt
  })
  const [xs, ys] = [walk.map((q) => q.x), walk.map((q) => q.y)]
  const [x0, y0] = [Math.min(...xs), Math.min(...ys)]
  const span = Math.max(Math.max(...xs) - x0, 0.01)
  const tall = Math.max(Math.max(...ys) - y0, 0.01)
  const [kx, ky] = [240 / span, 164 / tall]
  const [sx, sy] = [Math.min(kx, ky * 1.8), Math.min(ky, kx * 1.8)]
  const [ox, oy] = [(300 - span * sx) / 2, (220 - tall * sy) / 2]
  const big = lay.int(0, count - 1)
  const kinds = r("kinds")
  // Stars in the poster's spots, one large paper star with a smaller one turned behind it, and a double star or two.
  const stars = walk.map((q, i) => {
    const s = i === big ? kinds.between(28, 34) : kinds.between(12, 17)
    const kind = i !== big && kinds.chance(0.22) ? "ring" : "star"
    const fill = i === big ? "paper" : kinds.pick(["paper", "sun", "highlight"])
    return { x: ox + (q.x - x0) * sx, y: oy + (q.y - y0) * sy, kind, s, fill }
  })
  const edges = stars.slice(1).map((_, i) => [i, i + 1] as [number, number])
  if (count >= 6 && lay.chance(0.6)) edges.push([count - 1, count - 4])
  else if (lay.chance(0.5))
    edges[lay.int(1, edges.length - 1)]![0] = lay.int(0, 1)
  const gapOf = (st: (typeof stars)[number]) =>
    st.kind === "ring" ? 11 : st.s * 0.4 + 5
  let lines = ""
  for (const [a, b] of edges) {
    const [s0, s1] = [stars[a]!, stars[b]!]
    const d = Math.hypot(s1.x - s0.x, s1.y - s0.y) || 1
    const [ux, uy, g0, g1] = [
      (s1.x - s0.x) / d,
      (s1.y - s0.y) / d,
      gapOf(s0),
      gapOf(s1),
    ]
    if (d > g0 + g1 + 6)
      lines += `M ${n(s0.x + ux * g0)} ${n(s0.y + uy * g0)} L ${n(s1.x - ux * g1)} ${n(s1.y - uy * g1)} `
  }
  let out = lines ? looseLine(p, lines) : ""
  const dust = r("dust")
  for (let i = 0; i < 10; i++)
    out += pinpoint(
      dust.between(12, 288),
      dust.between(12, 208),
      dust.between(1, 1.7),
    )
  for (const st of stars) {
    const turned = `<g transform="rotate(45 ${n(st.x)} ${n(st.y)})">${star(p, st.x, st.y, st.s * 0.74, "sun")}</g>`
    out +=
      st.kind === "ring"
        ? ring(p, st.x, st.y, 7) + pinpoint(st.x, st.y, 2.4)
        : (st.s > 24 ? turned : "") + star(p, st.x, st.y, st.s, st.fill)
  }
  return out
}

/** A rainbow: concentric bands in the ink line, each foot sunk into a cloud. */
const rainbow: Draw = (p, r, fills) => {
  const [cx, cy, R] = [160, 168, 144]
  const count = r("bands").int(4, 5)
  const bw = r("width").between(14, 17)
  const colours = ["sun", "plane-2", "highlight", "tone-4", "plane"]
  let bands = ""
  for (let i = 0; i < count; i++) {
    const [ro, ri, y] = [R - i * bw, R - (i + 1) * bw, cy + 8]
    const d =
      `M ${cx - ro} ${y} V ${cy} A ${ro} ${ro} 0 0 1 ${cx + ro} ${cy} V ${y} ` +
      `H ${cx + ri} V ${cy} A ${ri} ${ri} 0 0 0 ${cx - ri} ${cy} V ${y} Z`
    bands += shape(p, d, fillOf(fills, `band-${i}`, colours[i]!))
  }
  const [foot, half] = [R - (count * bw) / 2, (count * bw) / 2 + 20]
  const [s, cloud] = [r("sparkle"), fillOf(fills, "cloud", "cloud")]
  const left = [Math.max(4, cx - foot - half), cx - foot + half, 204, 32]
  const right = [cx + foot - half, Math.min(316, cx + foot + half), 204, 32]
  return (
    bands +
    sparkle(
      p,
      cx + s.between(-30, 30),
      cy - s.between(16, 34),
      s.between(9, 13),
    ) +
    puffCloud(p, r("left"), left, cloud) +
    puffCloud(p, r("right"), right, cloud)
  )
}

/** A towering cumulus: tiers of paper puffs narrowing to a crown, rising out of a bank in the cloud colour. */
const cumulus: Draw = (p, r, fills) => {
  const back = fillOf(fills, "cloud", "cloud")
  const tone = dots(p, back)
  const j = r("tiers")
  const lean = j.between(-8, 10)
  const tower: Lump[] = []
  // Tiers from the crown down, so the lower ones stand in front: count, centre height, spread, radius.
  for (const [count, cy, spread, rad] of [
    [1, 54, 0, 42],
    [2, 106, 26, 42],
    [3, 162, 46, 45],
    [3, 214, 60, 48],
  ] as const)
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0 : (i / (count - 1)) * 2 - 1
      const x = 120 + lean * (1 - cy / 210) + t * spread + j.between(-5, 5)
      const rr = rad * j.between(0.88, 1.08)
      tower.push(puff(x, cy + j.between(-5, 5), rr, "paper", tone.url))
    }
  const dy = Math.max(0, 8 - Math.min(...tower.map((q) => q.cy - q.r)))
  for (const q of tower) q.cy += dy
  const bank = puffCloud(p, r("bank"), [6, 234, 294, 36], back, back)
  return tone.def + lumps(p, tower) + bank
}

/** A small floating cloud, flat-bottomed, in two tones: the cloud colour behind, paper in front. */
const cloudPuff: Draw = (p, r, fills) => {
  const size = [6, 194, 104, r("size").between(36, 40)]
  return puffCloud(p, r("puffs"), size, fillOf(fills, "cloud", "cloud"))
}

/** A star cluster: one bright star with a glint behind it, smaller sparkles round it, pinpoints and rings between. */
const starCluster: Draw = (p, r, fills) => {
  const lay = r("layout")
  const placed: { x: number; y: number; s: number }[] = []
  const place = (s: number, spread: number) => {
    for (let t = 0; t < 40; t++) {
      const x = 130 + (lay.next() + lay.next() - 1) * spread
      const y = 110 + (lay.next() + lay.next() - 1) * spread * 0.8
      if (x - s < 6 || x + s > 254 || y - s < 6 || y + s > 214) continue
      if (placed.some((q) => Math.hypot(q.x - x, q.y - y) < q.s + s + 6))
        continue
      placed.push({ x, y, s })
      return { x, y }
    }
    return null
  }
  const big = r("big").between(30, 36)
  const c = place(big, 40)!
  const tone = tintOf(fillOf(fills, "glint", "sun"), 80)
  const glint = star(p, c.x, c.y, big * 0.8, tone)
  let out = `<g transform="rotate(45 ${n(c.x)} ${n(c.y)})">${glint}</g>`
  out += star(p, c.x, c.y, big, "paper")
  const sizes = r("sizes")
  const colour = fillOf(fills, "star", "sun")
  const medium = sizes.int(3, 4)
  for (let i = 0; i < medium + sizes.int(3, 5); i++) {
    const s = i < medium ? sizes.between(12, 17) : sizes.between(6, 9)
    const q = place(s, i < medium ? 95 : 125)
    if (q)
      out += i === 1 ? star(p, q.x, q.y, s, colour) : sparkle(p, q.x, q.y, s)
  }
  for (let i = 0; i < 12; i++) {
    const q = place(3, i < 6 ? 80 : 130)
    if (q)
      out +=
        i % 4 ? pinpoint(q.x, q.y, 1.2 + (i % 3) * 0.5) : ring(p, q.x, q.y, 3.2)
  }
  return out
}

/** The moon's phases: five small moons waxing from a crescent to full, strung on a fine line. */
const moonPhases: Draw = (p, r, fills) => {
  const moon = fillOf(fills, "moon", r("moon").pick(["plane-2", "sun"]))
  const dark = shade(fillOf(fills, "dark", "tone-4"), 76)
  const [cy, R] = [60, r("size").between(25, 28)]
  let out = looseLine(p, `M 6 ${cy} H 354`)
  for (const [i, f] of [0.16, 0.38, 0.62, 0.84, 1].entries()) {
    const cx = 44 + i * 68
    const k = 1 - 2 * f
    const [top, foot] = [`${cx} ${n(cy - R)}`, `${cx} ${n(cy + R)}`]
    // The lit side: the right half-disc, closed by the terminator, an ellipse.
    const lit =
      f >= 1
        ? circle(cx, cy, R)
        : `M ${top} A ${n(R)} ${n(R)} 0 0 1 ${foot} A ${n(Math.abs(k) * R + 0.01)} ${n(R)} 0 0 ${k > 0 ? 0 : 1} ${top} Z`
    out +=
      tint(circle(cx, cy, R), dark) +
      tint(circle(cx, cy, R), stipple(p)) +
      shape(p, lit, moon) +
      shape(p, circle(cx, cy, R), "none")
  }
  return out
}

export const SKY_MORE: Thing[] = [
  sky("constellation", "a constellation", 300, 220, constellation),
  sky("rainbow", "a rainbow", 320, 210, rainbow),
  sky("cumulus", "a towering cumulus", 240, 300, cumulus),
  sky("cloud-puff", "a small cloud", 200, 110, cloudPuff),
  sky("star-cluster", "a star cluster", 260, 220, starCluster),
  sky("moon-phases", "the phases of the moon", 360, 120, moonPhases),
]
