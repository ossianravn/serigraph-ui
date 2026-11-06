// Objects: instruments, continued: the compass, the hourglass, the navigator's sextant, a sundial, binoculars, a
// lantern, a weathervane and a key. Tubes, arcs and silhouettes come from instruments.ts.
import { box, DEPTH, quad, shade, tintOf } from "../buildings"
import { circle, crescent, ellipse, line, pinwheel, shape } from "../motifs"
import { sparkle, stipple, tint } from "../motifs"
import { n, type Pen } from "../svg"
import { cone, cylinder, dome, slab, sphere } from "./forms"
import { arc, clip, dark, go, pole, pt, tube, union } from "./instruments"
import { thing, type Draw, type Pt } from "./instruments"
import { fillOf, type Thing } from "./library"

const PI = Math.PI
const ring = (c: Pt, a: number, b: number) =>
  `${circle(c[0], c[1], a)} ${circle(c[0], c[1], b)}`
const odd = { "fill-rule": "evenodd" }
/** A rectangle as a path. */
const rect = (x: number, y: number, w: number, h: number) =>
  `M ${n(x)} ${n(y)} h ${n(w)} v ${n(h)} h ${n(-w)} Z`

const compass: Draw = (p, r, f) => {
  const brass = fillOf(f, "case", "sun")
  const face = fillOf(f, "face", r("face").pick(["tone-4", "highlight"]))
  const [cx, cy, rx, ry] = [128, 100, 112, 47]
  const P = (a: number, d: number) =>
    pt([cx + Math.cos(a) * d, cy + (Math.sin(a) * d * ry) / rx])
  const S = (d: string, fill: string) => shape(p, d, fill)
  const spin = r("rose").between(-0.25, 0.25)
  let rose = ""
  for (let i = 0; i < 8; i++) {
    const a = spin + (i * PI) / 4 - PI / 2
    const [tip, s] = [P(a, i % 2 ? 50 : 82), i % 2 ? 9 : 14]
    const pair =
      S(`M ${cx} ${cy} L ${P(a - PI / 4, s)} L ${tip} Z`, "paper") +
      S(`M ${cx} ${cy} L ${tip} L ${P(a + PI / 4, s)} Z`, "ink")
    rose = i % 2 ? pair + rose : rose + pair
  }
  const tick = (_: unknown, i: number) =>
    `M ${P((i * PI) / 16, 94)} L ${P((i * PI) / 16, i % 4 ? 88 : 82)}`
  const nd = r("needle").between(-1.2, 1.2) - PI / 2
  const [nN, nS] = [P(nd, 74), P(nd + PI, 74)]
  const [nL, nR] = [P(nd - PI / 2, 9), P(nd + PI / 2, 9)]
  const dial = ellipse(cx, cy, rx * 0.86, ry * 0.86)
  const rim = crescent(cx, cy + 10, rx * 0.86, rx * 0.2, ry * 0.5)
  const bow: Pt = [cx, cy - ry - 22]
  const loop = cylinder(p, { cx, base: bow[1] + 18, rx: 8, h: 12, fill: brass })
  const drum = cylinder(p, { cx, base: cy + 30, rx, ry, h: 30, fill: brass })
  const top = S(ellipse(cx, cy, rx, ry), tintOf(brass, 62)) + S(dial, face)
  const ticks = line(p, Array.from({ length: 32 }, tick).join(" "))
  const needle = S(`M ${nN} L ${nL} L ${nS} L ${nR} Z`, "paper")
  const north = S(`M ${nN} L ${nL} L ${nR} Z`, fillOf(f, "needle", "structure"))
  const hub = S(ellipse(cx, cy, 6, 4.5), brass)
  const bezel = clip(p, dial, tint(rim, shade(face, 90)))
  const back = loop + shape(p, ring(bow, 16, 9), brass, odd) + drum
  return back + top + bezel + ticks + rose + needle + north + hub
}

const hourglass: Draw = (p, r, f) => {
  const wood = fillOf(f, "frame", "structure")
  const sand = fillOf(f, "sand", "stair")
  const [c, t, b, m] = [100, 60, 262, 161]
  const side = (s: number, y: number[]) =>
    `C ${c + 66 * s} ${y[0]} ${c + 62 * s} ${y[1]} ${c + 5 * s} ${m} ` +
    `C ${c + 62 * s} ${y[2]} ${c + 66 * s} ${y[3]} ${c + 22 * s} ${y[4]}`
  const down = side(-1, [t + 20, m - 40, m + 40, b - 20, b])
  const up = side(1, [b - 20, m + 40, m - 40, t + 20, t])
  const glass = `M ${c - 22} ${t} ${down} L ${c + 22} ${b} ${up} Z`
  const top = r("sand").between(104, 124)
  const peak = r("sand").between(196, 212)
  const upper = `M 30 ${n(top)} Q ${c} ${n(top + 22)} 170 ${n(top)} V ${m} H 30 Z`
  const lower = `M 30 ${b} V ${n(peak + 34)} Q ${c} ${n(peak - 34)} 170 ${n(peak + 34)} V ${b} Z`
  const post = (a: number) => {
    const [x, dy] = [c + Math.cos(a) * 54, Math.sin(a) * 16]
    const bead = (y: number) => shape(p, ellipse(x, y + dy, 8, 4), wood)
    const bar = pole(p, [x, 276 + dy], [x, 42 + dy], 5, wood)
    return bar + sphere(p, x, m + dy, 8, wood) + bead(78) + bead(244)
  }
  const glint = (y: number) =>
    line(p, `M ${c - 40} ${y + 10} Q ${c - 40} ${y - 14} ${c - 22} ${y - 26}`)
  const lit = (y: number) => tint(crescent(c, y, 54, -26, -16), stipple(p))
  const fill =
    shape(p, upper, sand) + shape(p, lower, sand) + lit(108) + lit(214)
  const stream = shape(p, rect(c - 1.5, m, 3, peak - m), sand)
  const plate = (y: number) =>
    slab(p, { cx: c, y, rx: 76, thick: 18, fill: wood })
  const bulbs = shape(p, glass, "paper") + clip(p, glass, fill) + stream
  const front = shape(p, glass, "none") + glint(110) + glint(216)
  const posts = post((PI * 5) / 6) + post(PI / 6)
  return plate(266) + post(-PI / 2) + bulbs + front + posts + plate(26)
}

/** A bar of width `w` from `a` to `b`, as a path. */
function bar(a: Pt, b: Pt, w: number) {
  const k = w / 2 / Math.hypot(b[0] - a[0], b[1] - a[1])
  const v: Pt = [(b[1] - a[1]) * k, (a[0] - b[0]) * k]
  return quad([go(a, v, 1), go(b, v, 1), go(b, v, -1), go(a, v, -1)])
}

const sextant: Draw = (p, r, f) => {
  const frame = fillOf(f, "frame", "structure")
  const arm = fillOf(f, "arm", "stair")
  const glass = fillOf(f, "mirror", "highlight")
  const A: Pt = [136, 52]
  const P = (d: number, k: number) =>
    go(A, [Math.sin(d / 57.3), Math.cos(d / 57.3)], k)
  const sector = (r0: number, r1: number, d: number) =>
    `M ${pt(P(-d, r1))}${arc(P(-d, r1), P(d, r1), r1, r1, 0, [0, 1])}` +
    ` L ${pt(P(d, r0))}${arc(P(d, r0), P(-d, r0), r0, r0, 0, [0, 1])} Z`
  const tick = (_: unknown, i: number) =>
    `M ${pt(P(i * 2 - 30, 200))} L ${pt(P(i * 2 - 30, i % 5 ? 194 : 190))}`
  const at = r("index").between(-20, 16)
  const limb = sector(174, 204, 32)
  const sides = [bar(A, P(-30, 184), 18), bar(A, P(30, 184), 18)]
  const parts = [limb, ...sides, rect(88, 140, 96, 14), circle(136, 52, 20)]
  const S = (d: string, fill: string) => shape(p, d, fill)
  const handle =
    "M 252 96 Q 276 96 276 124 V 186 Q 276 212 256 212 Q 240 212 240 186 V 124 Q 240 96 252 96 Z"
  const studs = S(`${rect(196, 112, 56, 8)} ${rect(230, 186, 22, 8)}`, frame)
  const grip = S(handle, fillOf(f, "handle", "tone-1")) + studs
  const ticks = line(p, Array.from({ length: 31 }, tick).join(" "))
  const scale = S(sector(189, 201, 30), "paper") + ticks
  const shadow = clip(p, limb, tint(sector(188, 208, 40), stipple(p)))
  const lens = fillOf(f, "scope", "tone-4")
  const scope = tube(p, [232, 126], [146, 126], [10, 12], lens)
  const index = `${bar(A, P(at, 174), 12)} ${bar(P(at, 170), P(at, 208), 16)}`
  const knob =
    S(circle(...P(at + 7, 160), 7), arm) +
    S(circle(136, 52, 6), tintOf(arm, 62))
  const mirrors =
    S(rect(116, 20, 40, 30), glass) + S(rect(116, 106, 14, 40), glass)
  const clear = S(rect(102, 106, 14, 40), "paper")
  const frameD = union(p, parts, frame) + shadow + scale
  return grip + frameD + scope + S(index, arm) + mirrors + clear + knob
}

const sundial: Draw = (p, r, f) => {
  const dial = fillOf(f, "dial", "platform")
  const gnomon = fillOf(f, "gnomon", "sun")
  const stone = fillOf(f, "plinth", "structure")
  const column = fillOf(f, "column", r("column").pick(["tone-1", "tone-4"]))
  const P = (a: number, k: number) =>
    pt([130 + Math.cos(a) * 108 * k, 104 + Math.sin(a) * 36 * k])
  const tick = (_: unknown, i: number) =>
    `M ${P((i * PI) / 12, 0.86)} L ${P((i * PI) / 12, i % 3 ? 0.78 : 0.68)}`
  const top = 98 - r("gnomon").between(62, 76)
  const blade = `M 72 108 L 174 98 L 174 ${n(top)} Z`
  const back = `M 174 98 V ${n(top)} l 5 -3 V 95 Z`
  const edge = `M 72 108 L 174 ${n(top)} l 5 -3 L 77 105 Z`
  const shadow = "M 72 108 L 174 98 L 250 128 Z"
  const ticks = line(p, Array.from({ length: 24 }, tick).join(" "))
  const ring = shape(p, ellipse(130, 104, 93, 31), "none") + ticks
  const cast = clip(p, ellipse(130, 104, 108, 36), dark(p, shadow, dial))
  const S = (d: string, fill: string) => shape(p, d, fill)
  const plate =
    S(back, shade(gnomon)) + S(edge, tintOf(gnomon, 62)) + S(blade, gnomon)
  return (
    cylinder(p, { cx: 130, base: 280, rx: 30, h: 160, fill: column }) +
    slab(p, { cx: 128, y: 270, rx: 64, thick: 16, fill: stone }) +
    slab(p, { cx: 130, y: 126, rx: 44, thick: 12, fill: stone }) +
    slab(p, { cx: 130, y: 104, rx: 108, ry: 36, thick: 16, fill: dial }) +
    ring +
    cast +
    plate
  )
}

/** A barrel seen down its length: a round face at `c`, its body running back along the depth. */
function barrel(p: Pen, c: Pt, r: number, len: number, fill: string) {
  const u: Pt = [DEPTH[0] / 28.3, DEPTH[1] / 28.3]
  const b = go(c, u, len)
  const s = (q: Pt, m: number) => go(q, [-u[1] * r, u[0] * r], m)
  const ends =
    arc(s(b, 1), s(b, -1), r, r, 0, u) +
    ` L ${pt(s(c, -1))}${arc(s(c, -1), s(c, 1), r, r, 0, [-u[0], -u[1]])}`
  const body = `M ${pt(s(c, 1))} L ${pt(s(b, 1))}${ends} Z`
  const strip = quad([s(c, 0.2), s(b, 0.2), s(b, 2), s(c, 2)])
  const shadow = clip(p, body, dark(p, strip, fill))
  return shape(p, body, fill) + shadow + shape(p, body, "none")
}

const binoculars: Draw = (p, r, f) => {
  const body = fillOf(f, "body", r("body").pick(["tone-1", "tone-4", "tone-3"]))
  const rim = fillOf(f, "rim", "structure")
  const metal = fillOf(f, "bridge", "stair")
  const side = (x: number) => {
    const glint = { transform: `rotate(-35 ${x - 14} 144)` }
    const lens =
      shape(p, circle(x, 158, 48), rim) + shape(p, circle(x, 158, 37), "ink")
    const shine = tint(crescent(x, 158, 37, 8, 7), tintOf("ink", 70))
    const tubes =
      barrel(p, [x + 52, 126], 26, 40, "ink") +
      barrel(p, [x, 158], 48, 66, body)
    const gleam = shape(p, ellipse(x - 14, 144, 9, 6), "paper", glint)
    return tubes + lens + shine + gleam
  }
  const hinge =
    barrel(p, [116, 132], 30, 60, metal) +
    shape(p, rect(96, 113, 60, 14), metal) +
    barrel(p, [124, 106], 18, 22, rim) +
    shape(p, circle(124, 106, 18), tintOf(rim, 62))
  const pin =
    shape(p, circle(116, 132, 30), metal) + shape(p, circle(116, 132, 8), "ink")
  return side(62) + hinge + pin + side(176)
}

const lantern: Draw = (p, r, f) => {
  const pick = r("frame").pick(["tone-4", "platform", "plane"])
  const [fr, glow] = [fillOf(f, "frame", pick), fillOf(f, "glass", "sun")]
  const S = (d: string, fill: string) => shape(p, d, fill)
  const block = (x: number, y: number, w: number, h: number) =>
    box(p, { x, y, w, h, fill: fr })
  const roof = "M 130 118 L 154 103 L 92 48 Z"
  const flame = "M 80 194 Q 93 216 80 226 Q 67 216 80 194 Z"
  const side = "M 123 136 l 14 -9 v 142 l -14 9 Z"
  const panes = S(side, shade(glow, 90)) + S(rect(51, 140, 58, 134), glow)
  const candle = S(rect(69, 230, 22, 44), "paper") + S(flame, "paper")
  const feet = S(`${rect(38, 298, 6, 14)} ${rect(116, 298, 6, 14)}`, fr)
  const cap =
    dark(p, roof, fr) + S(roof, "none") + S("M 30 118 H 130 L 92 48 Z", fr)
  const bail =
    sphere(p, 92, 44, 8, fr) + shape(p, ring([92, 18], 18, 11), fr, odd)
  const body =
    block(42, 132, 76, 150) + panes + candle + line(p, "M 51 186 H 109")
  return (
    body + block(32, 282, 96, 16) + feet + block(30, 118, 100, 14) + cap + bail
  )
}

const weathervane: Draw = (p, r, f) => {
  const iron = fillOf(f, "pole", "structure")
  const vane = fillOf(f, "vane", "stair")
  const tail = r("tail").chance(0.5)
    ? "M 8 52 H 74 L 92 86 L 74 120 H 8 L 28 86 Z"
    : "M 10 44 Q 62 50 92 86 Q 62 122 10 128 Q 34 86 10 44 Z"
  const head = "M 246 86 L 194 56 L 202 86 L 194 116 Z"
  const plaque = (x: number, y: number) => rect(x - 8, y - 18, 16, 36)
  const arm = (a: Pt, b: Pt) => pole(p, a, b, 6, iron)
  const mount = fillOf(f, "mount", "tone-4")
  const arms = arm([124, 228], [182, 192]) + arm([44, 228], [204, 228])
  const back = shape(p, plaque(182, 192), vane) + arms
  const plaques = `${plaque(44, 228)} ${plaque(204, 228)} ${plaque(66, 264)}`
  const hub = sphere(p, 124, 228, 9, iron) + arm([124, 228], [66, 264])
  const front = hub + shape(p, plaques, vane)
  const feathers = "M 36 64 L 52 86 L 36 108 M 56 64 L 72 86 L 56 108"
  const under = tint("M 92 86 H 246 L 194 116 L 196 92 H 92 Z", stipple(p))
  const arrow =
    union(p, [tail, rect(40, 80, 164, 12), head], vane) +
    line(p, feathers) +
    under
  const finial =
    cone(p, { cx: 124, base: 60, rx: 9, h: 34, fill: iron }) +
    sphere(p, 124, 86, 11, iron)
  const ball = sphere(p, 124, 162, 24, fillOf(f, "ball", "highlight"))
  const stand =
    dome(p, { cx: 124, base: 356, r: 40, fill: mount }) +
    pole(p, [124, 330], [124, 60], 8, iron)
  return stand + back + front + ball + arrow + finial
}

/** A four-point concave star, as a path. */
function star(x: number, y: number, s: number) {
  const q = (a: number, b: number, c: number, d: number) =>
    ` Q ${n(x + a * s * 0.16)} ${n(y + b * s * 0.16)} ${n(x + c * s)} ${n(y + d * s)}`
  return `M ${x} ${y - s}${q(1, -1, 1, 0)}${q(1, 1, 0, 1)}${q(-1, 1, -1, 0)}${q(-1, -1, 0, -1)} Z`
}

const key: Draw = (p, r, f) => {
  const brass = fillOf(f, "key", "sun")
  const [bx, by, R] = [78, 75, 54]
  const lobe = (t: number) =>
    circle(bx + Math.cos(PI * t) * R, by + Math.sin(PI * t) * R, 14)
  const lobes = r("lobes").chance(0.6) ? [0.75, 1, 1.25].map(lobe) : []
  const bit = `M 238 ${by} H 290 V 134 H 278 V 118 H 266 V 134 H 252 V 120 H 238 Z`
  const parts = [circle(bx, by, R), rect(120, 64, 180, 22), circle(298, by, 13)]
  parts.push(bit, ...lobes)
  const low = crescent(bx, by, R + 14, -R * 0.42, -R * 0.34)
  const under = `${rect(110, by + 4, 210, 7)} ${rect(282, by + 11, 8, 54)}`
  const band = (x: number) =>
    line(p, `M ${x} ${by - 11} v 22 M ${x + 7} ${by - 11} v 22`)
  const [hue, turn] = [fillOf(f, "pinwheel", "highlight"), r("turn").next()]
  const wheel = pinwheel(p, bx, by, 36, hue, { turn })
  const cut = r("cut").chance(0.5)
    ? shape(p, circle(bx, by, 36), "ink") + wheel
    : shape(p, star(bx, by, 34), "ink") + sparkle(p, bx + 48, by - 52, 9)
  const dk = dark(p, low, brass) + dark(p, under, brass)
  const shadow = clip(p, parts.join(" "), dk)
  const ward = shape(p, rect(258, by + 16, 8, 18), "ink")
  return union(p, parts, brass) + shadow + band(130) + band(210) + ward + cut
}

export const INSTRUMENTS_MORE: Thing[] = [
  thing("compass", "a compass", 260, 186, compass),
  thing("hourglass", "an hourglass", 200, 322, hourglass),
  thing("sextant", "a sextant", 300, 280, sextant),
  thing("sundial", "a sundial", 270, 300, sundial),
  thing("binoculars", "a pair of binoculars", 300, 220, binoculars),
  thing("lantern", "a lantern", 180, 340, lantern),
  thing("weathervane", "a weathervane", 250, 360, weathervane),
  thing("key", "a key", 320, 150, key),
]
