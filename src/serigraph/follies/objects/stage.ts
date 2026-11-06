// The stage: a gig poster's world of concerts and shows, each drawn whole in its own box. Shared look: flat fills
// in the ink line, the side away from the light stippled, openings in ink. The helpers live in stage-more.ts.
import { archPath, box, shade, tintOf } from "../buildings"
import { circle, crescent, line, pinwheel, shape, sparkle } from "../motifs"
import { stipple, tint } from "../motifs"
import { el, n, type Pen } from "../svg"
import { slab, sphere } from "./forms"
import { arcs, bars, clip, cyl, hump, rect, shaded, tilted } from "./stage-more"
import { things, tones, turn, type Draw } from "./stage-more"

type N = number
const B = (p: Pen, x: N, y: N, w: N, h: N, fill: string, depth = 1) =>
  box(p, { x, y, w, h, fill, depth })
/** `inner` drawn in a frame moved to (x, y) and turned by `deg`. */
const frame = (x: N, y: N, deg: N, inner: string) =>
  `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(deg)})">${inner}</g>`

/** A ball microphone on a telescoping stand with a heavy round base, its cable looping down to the floor. */
const microphone: Draw = (p, r, fx) => {
  const [metal, hd] = [fx.stand ?? "tone-4", fx.head ?? "tone-2"]
  const [ball, loop] = [circle(84, 41, 34), r("loop").between(-8, 10)]
  const sh = crescent(84, 41, 34, -14.3, -11.6)
  const lat = [-21, -10, 10, 21].map((y) => `M 50 ${41 + y} q 34 12 68 0`)
  const lon = [-22, -13, -4, 4, 13, 22].map((x) => `M ${84 + x} 7 V 75`)
  const grille =
    line(p, lat.join(" ") + lon.join(" ")) +
    shape(p, "M 50 36 Q 84 48 118 36 V 46 Q 84 58 50 46 Z", metal)
  const wire =
    `M 80 128 C 32 170, 34 246, 80 252 C 124 258, 142 290, 146 336 C 148 ${362 + loop}, 194 368, ` +
    `184 ${350 + loop} C 176 ${336 + loop}, 148 352, 166 366 C 176 374, 188 372, 196 368`
  const cable = { style: "fill:none;stroke:var(--ink)", "stroke-width": 3.4 }
  const head =
    shape(p, "M 78 124 L 90 124 L 96 70 L 72 70 Z", metal) +
    shape(p, tilted(84, 72, 14, 4.5), "ink") +
    tint(ball, hd) +
    tint(sh, shade(hd)) +
    clip(p, ball, grille) +
    tint(sh, stipple(p)) +
    shape(p, ball, "none") +
    shape(p, tilted(70, 25, 7, 4, -40), "paper")
  return (
    slab(p, { cx: 84, y: 336, rx: 50, thick: 16, fill: metal }) +
    cyl(p, 84, 340, 6, 132, metal, false) +
    cyl(p, 84, 216, 4, 96, metal, false) +
    cyl(p, 84, 216, 9, 14, "sun") +
    el("path", { d: wire, "stroke-linecap": "round", ...cable }, null) +
    turn(r("lean").between(-24, -10), 84, 120, head) +
    shape(p, circle(84, 120, 6), "ink")
  )
}

/** Cabinet front: a cone in a rubber surround, shaded inside on its upper left, with a dust cap. */
const cone = (p: Pen, cx: N, cy: N, R: N) => {
  const [C, disc] = [R * 0.84, circle(cx, cy, R * 0.84)]
  const hollow = crescent(cx, cy, C, C * 0.38, C * 0.3)
  return (
    shape(p, circle(cx, cy, R), "ink") +
    shape(p, disc, "sun") +
    clip(p, disc, shaded(p, hollow, "sun")) +
    line(p, circle(cx, cy, C * 0.62)) +
    sphere(p, cx, cy, C * 0.3, "paper")
  )
}
const corners = (x: N, y: N, w: N, h: N, k = 9) =>
  [0, 1, 2, 3]
    .map((i) => rect(x + (i % 2) * (w - k), y + (i > 1 ? h - k : 0), k, k, 1))
    .map((d) => tint(d, "ink"))
    .join("")

/** Speaker cabinets stacked three high, the top one knocked askew. */
const speakerStack: Draw = (p, r, fx) => {
  const [a, b, c] = tones(r("tones"))
  const tilt = r("tilt").between(5, 9) * (r("side").chance(0.5) ? 1 : -1)
  const top = fx.top ?? c
  const amp =
    B(p, 46, 50, 118, 62, top, 0.9) +
    corners(46, 50, 118, 62, 8) +
    shape(p, rect(66, 64, 76, 30, 6), "ink") +
    shape(p, "M 80 72 H 128 L 118 86 H 90 Z", shade(top, 60))
  return (
    B(p, 16, 212, 170, 140, fx.bottom ?? a, 1.1) +
    corners(16, 212, 170, 140) +
    cone(p, 101, 276, 52) +
    shape(p, rect(40, 334, 122, 8, 4), "ink") +
    B(p, 30, 112, 140, 100, fx.middle ?? b) +
    corners(30, 112, 140, 100) +
    cone(p, 66, 162, 28) +
    cone(p, 134, 162, 28) +
    turn(-tilt, tilt > 0 ? 164 : 40, 112, amp)
  )
}

/** A stage spotlight on a tripod, its beam a pale wedge thrown up and out to the right. */
const spotlight: Draw = (p, r, fx) => {
  const [metal, body] = [fx.stand ?? "tone-4", fx.body ?? "tone-1"]
  const th = -r("aim").between(18, 28)
  const L = 180 / Math.cos((th * Math.PI) / 180) - 52
  const s = n(27 + L * 0.2)
  const hull = "M -52 -34 H 52 V 34 H -52 A 11 34 0 0 1 -52 -34 Z"
  const grip =
    "M -22 -34 L -16 -52 H 16 L 22 -34 H 15 L 11 -45 H -11 L -15 -34 Z"
  const housing =
    shape(p, grip, metal) +
    shape(p, hull, body) +
    clip(p, hull, shaded(p, rect(-70, 10, 140, 30), body)) +
    line(p, "M -35 -34 V 34 M -23 -34 V 34 M -11 -34 V 34") +
    shape(p, hull, "none") +
    shape(p, tilted(52, 0, 11, 34), tintOf(body, 60)) +
    shape(p, tilted(54, 0, 8.5, 27), "sun") +
    line(p, tilted(55, 0, 4.8, 15.6))
  const beam =
    tint(`M 52 -27 L ${n(52 + L)} -${s} V ${s} L 52 27 Z`, tintOf("sun", 40)) +
    sparkle(p, 40 + L * 0.8, -12, 9)
  return (
    frame(120, 160, th, beam) +
    shape(p, "M 117 282 H 123 L 145 330 H 139 Z", metal) +
    shape(p, circle(142, 330, 4), "ink") +
    cyl(p, 120, 286, 5, 100, metal, false) +
    cyl(p, 120, 290, 10, 12, "ink") +
    shape(p, "M 117 282 H 123 L 63 352 H 57 Z", metal) +
    shape(p, "M 117 282 H 123 L 183 352 H 177 Z", metal) +
    shape(p, circle(60, 352, 4) + circle(180, 352, 4), "ink") +
    frame(120, 160, th, housing) +
    shape(p, "M 114 188 H 126 L 125 160 H 115 Z", metal) +
    shape(p, circle(120, 160, 8), "ink") +
    shape(p, circle(120, 160, 3.5), metal)
  )
}

/** A record half out of its sleeve: fine rings for grooves, a sun label, and a pinwheel on the sleeve. */
const record: Draw = (p, r, fx) => {
  const [a, b] = tones(r("tones"))
  const sleeve = fx.sleeve ?? a
  const [cx, cy, R] = [n(100 + r("slide").between(64, 98)), 156, 79]
  const disc = circle(cx, cy, R)
  const sheen = `M ${cx} ${cy} l 79 -40 l -32 -39 Z M ${cx} ${cy} l -79 40 l 32 39 Z`
  const rings = [40, 46, 52, 62, 68, 74].map((q) => circle(cx, cy, q))
  const front = rect(14, 70, 172, 172)
  const back = "M 14 70 L 22 65 H 194 V 237 L 186 242 V 70 Z"
  return (
    shape(p, back, shade(sleeve)) +
    tint(back, stipple(p)) +
    shape(p, disc, tintOf("ink", 84)) +
    clip(p, disc, tint(sheen, tintOf("ink", 70))) +
    line(p, rings.join(" ")) +
    shape(p, circle(cx, cy, 27), fx.label ?? "sun") +
    bars(cx - 13, cy - 16, [25, 16], 2.4, 5) +
    shape(p, circle(cx, cy, 2.6), "ink") +
    shape(p, front, sleeve) +
    clip(p, front, pinwheel(p, 86, 177, 58, fx.art ?? b, { twist: 0.7 })) +
    bars(28, 84, [72, 45], 4.5, 10) +
    sparkle(p, 160, 100, 10) +
    shape(p, front, "none")
  )
}

/** A little proscenium stage: swagged curtains in the arch, a sign over it, a boarded apron with footlights. */
const curtainStage: Draw = (p, r, fx) => {
  const [a, b, c, d] = tones(r("tones"))
  const [drape, opening] = [fx.curtain ?? b, archPath(70, 262, 160, 164)]
  const tie = r("tie").between(186, 210)
  // A curtain's inner edge, `s` back from the parting: two cubics, sampled.
  const c1 = [150, 100, 140, 150, 96, tie - 34, 96, tie]
  const c2 = [96, tie, 100, tie + 22, 118, 246, 128, 262]
  const [k1, k2] = [
    [0.9, 0, 1, 0, 0.3, 0, 0.2, 0],
    [0.2, 0, 0.3, 0, 0.8, 0, 1, 0],
  ]
  const edge = (s: N) =>
    [
      c1.map((v, j) => v - s * k1[j]!),
      c2.map((v, j) => v - s * k2[j]!),
    ].flatMap((q) =>
      Array.from({ length: 13 }, (_, i) => {
        const [t, m] = [i / 12, 1 - i / 12]
        const k = [m ** 3, 3 * m * m * t, 3 * m * t * t, t ** 3]
        const at = (o: N) =>
          n(k.reduce((acc, w, j) => acc + w * q[j * 2 + o]!, 0))
        return `${at(0)} ${at(1)}`
      }),
    )
  const poly = (s: N) => `M ${edge(s).join(" L ")}`
  const fold = (s: N) =>
    `${poly(s)} L ${edge(s + 20)
      .reverse()
      .join(" L ")} Z`
  const half =
    shape(p, `${poly(0)} L 60 262 L 60 100 Z`, drape) +
    shaded(p, fold(18) + fold(58), drape) +
    line(p, [18, 38, 58, 78].map(poly).join(" ")) +
    shape(p, rect(62, tie - 4, 38, 8, 4), "sun")
  const swag = [0, 1, 2].map((i) => `Q ${203 - i * 53} 146 ${176 - i * 53} 124`)
  const inside =
    tint("M 90 262 A 60 12 0 0 1 210 262 Z", tintOf("sun", 45)) +
    half +
    `<g transform="matrix(-1 0 0 1 300 0)">${half}</g>` +
    shape(p, `M 60 80 H 240 V 124 H 229 ${swag.join(" ")} H 60 Z`, drape) +
    line(p, "M 70 112 Q 96 128 123 112 M 177 112 Q 203 128 230 112")
  const lamps = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) =>
    circle(22 + i * 30, 275.5, 3.4),
  )
  return (
    B(p, 26, 62, 248, 200, fx.wall ?? a, 0.8) +
    line(p, "M 48 62 V 262 M 252 62 V 262") +
    shape(p, opening, "ink") +
    clip(p, opening, inside) +
    shape(p, rect(112, 72, 76, 22, 3), fx.sign ?? d) +
    bars(124, 79, [52], 4) +
    hump(p, 160, 56, 30, 26, 8, "sun") +
    B(p, 2, 278, 266, 20, fx.floor ?? c) +
    line(p, "M 10 273 H 276 M 18 268 H 284") +
    shape(p, lamps.join(" "), "sun")
  )
}

/** A round poster column with a domed cap: posters wrap its curve, the ones round the right in its shade. */
const advertisingColumn: Draw = (p, r, fx) => {
  const [a, b, c, d] = tones(r("tones"))
  const [f, band] = [fx.column ?? d, fx.band ?? "sun"]
  const off = (x: N) => 16 * Math.sqrt(Math.max(0, 1 - ((x - 85) / 50) ** 2))
  const bent = (x0: N, x1: N, y0: N, y1: N) => {
    const xs = Array.from({ length: 9 }, (_, i) => x0 + ((x1 - x0) * i) / 8)
    const pts = (y: N, list: N[]) => list.map((x) => `${n(x)} ${n(y + off(x))}`)
    return `M ${[...pts(y0, xs), ...pts(y1, xs.reverse())].join(" L ")} Z`
  }
  const j = r("posters")
  const [ya, yb] = [j.between(160, 176), j.between(146, 160)]
  const yc = j.between(270, 280)
  const posters = (k: (f: string) => string) =>
    shape(p, bent(41, 89, ya, ya + 94), k(fx.poster ?? a)) +
    shape(p, circle(65, ya + 41, 13), k("sun")) +
    bars(47, ya + 67, [36, 24, 30]) +
    shape(p, bent(93, 137, yb, yb + 90), k(b)) +
    bars(99, yb + 27, [30, 22], 5, 10) +
    shape(p, archPath(101, yb + 91, 18, 34), "ink") +
    shape(p, bent(37, 115, yc, yc + 74), k(c)) +
    bars(47, yc + 28, [58, 40], 6, 11) +
    bars(47, yc + 58, [46, 30, 50], 2.5, 6)
  const body = "M 35 140 V 360 A 50 16 0 0 0 135 360 V 140 Z"
  const side = "M 104 140 V 374.9 A 50 16 0 0 0 135 360 V 140 Z"
  const inShade = clip(
    p,
    side,
    posters((x) => shade(x)),
  )
  return (
    cyl(p, 85, 382, 60, 24, band) +
    shape(p, body, f) +
    tint(side, shade(f)) +
    clip(p, body, posters(String) + inShade) +
    tint(side, stipple(p)) +
    shape(p, body, "none") +
    cyl(p, 85, 144, 55, 14, band) +
    hump(p, 85, 130, 51, 50, 16.3, fx.cap ?? a) +
    shape(p, rect(82.5, 64, 5, 18), band) +
    sphere(p, 85, 60, 7, "paper")
  )
}

/** A conical megaphone with a pistol grip, a band round its bell and sound arcs leaving the mouth. */
const megaphone: Draw = (p, r, fx) => {
  const [a, b] = tones(r("tones"))
  const [f, g] = [fx.body ?? a, fx.grip ?? b]
  const P = (k: N, s: N) => `${n(146 * k)} ${n(s * (13 + 45 * k))}`
  const reg = (k0: N, k1: N, s0: N, s1: N) =>
    `M ${P(k0, s0)} L ${P(k1, s0)} L ${P(k1, s1)} L ${P(k0, s1)} Z`
  const grip = "M 31 20 H 53 L 50 84 Q 42 96 32 86 Z"
  const seams = `M ${P(0.72, -1)} L ${P(0.72, 1)} M ${P(0.83, -1)} L ${P(0.83, 1)}`
  const horn =
    shape(p, "M -16 -9 H 2 V 9 H -16 Z", g) +
    shape(p, tilted(-16, 0, 3.5, 9), shade(g)) +
    shape(p, "M 56 24 L 63 26 L 61 44 L 55 41 Z", "ink") +
    shape(p, grip, g) +
    clip(p, grip, shaded(p, "M 44 20 H 60 V 100 H 40 Z", g)) +
    shape(p, grip, "none") +
    shape(p, reg(0, 1, -1, 1), f) +
    tint(reg(0, 1, 0.3, 1), shade(f)) +
    tint(reg(0.72, 0.83, -1, 1), "sun") +
    tint(reg(0.72, 0.83, 0.3, 1), shade("sun")) +
    line(p, seams) +
    tint(reg(0, 1, 0.3, 1), stipple(p)) +
    shape(p, reg(0, 1, -1, 1), "none") +
    shape(p, tilted(146, 0, 17.4, 58), tintOf(f, 62)) +
    shape(p, tilted(148, 0, 12.8, 47.6), "ink") +
    arcs(p, 146, 0, [76, 91, 106], -28, 28)
  return frame(46, 132, -r("aim").between(6, 15), horn)
}

export const STAGE = things("stage", {
  microphone: ["a microphone on a stand", 200, 380, microphone],
  "speaker-stack": ["a stack of speakers", 260, 360, speakerStack],
  spotlight: ["a stage spotlight", 300, 360, spotlight],
  record: ["a record and its sleeve", 300, 250, record],
  "curtain-stage": ["a curtained stage", 310, 300, curtainStage],
  "advertising-column": ["an advertising column", 170, 400, advertisingColumn],
  megaphone: ["a megaphone", 300, 230, megaphone],
})
