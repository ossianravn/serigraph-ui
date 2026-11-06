// Everyday moments: stand-ins for what every site needs (empty, locked, found nothing, done, sent, waiting, a new
// idea), each drawn whole in its own box in the stage's manner. The small helpers here serve stage.ts too.
import { archPath, box, shade, tintOf } from "../buildings"
import { circle, crescent, line, shape, sparkle } from "../motifs"
import { stipple, tint } from "../motifs"
import { n, type Pen, type Rs } from "../svg"
import { cylinder, slab, sphere } from "./forms"
import type { Collection, Thing } from "./library"

type N = number
export type Draw = Thing["draw"]
/** Things from a table of name → [title, w, h, draw]. */
export const things = (
  collection: Collection,
  rows: Record<string, [string, N, N, Draw]>,
) =>
  Object.entries(rows).map(([name, [title, w, h, draw]]) => {
    const t: Thing = { name, title, collection, w, h, draw }
    return t
  })
/** The four tones in a seeded order, so neighbouring parts never share a colour. */
export const tones = (r: Rs) => {
  const t = ["tone-1", "tone-2", "tone-3", "tone-4"]
  for (let i = 3; i > 0; i--) {
    const j = r.int(0, i)
    ;[t[i], t[j]] = [t[j]!, t[i]!]
  }
  return t as [string, string, string, string]
}
/** `inner` clipped to the path `d`. */
export const clip = (p: Pen, d: string, inner: string) => {
  const id = p.uid("clip")
  return `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`
}
/** `inner` turned by `deg` round (x, y). */
export const turn = (deg: N, x: N, y: N, inner: string) =>
  `<g transform="rotate(${n(deg)} ${n(x)} ${n(y)})">${inner}</g>`
/** A region in the shade of `f`, stippled, with no outline. */
export const shaded = (p: Pen, d: string, f: string) =>
  tint(d, shade(f)) + tint(d, stipple(p))
export const rect = (x: N, y: N, w: N, h: N, k = 0) =>
  `M ${n(x + k)} ${n(y)} h ${n(w - 2 * k)} a ${k} ${k} 0 0 1 ${k} ${k} v ${n(h - 2 * k)} ` +
  `a ${k} ${k} 0 0 1 ${-k} ${k} h ${n(2 * k - w)} a ${k} ${k} 0 0 1 ${-k} ${-k} v ${n(2 * k - h)} ` +
  `a ${k} ${k} 0 0 1 ${k} ${-k} Z`
/** Ink bars standing for words, one per width, `gap` apart. */
export const bars = (x: N, y: N, ws: N[], t = 3, gap = 7) =>
  ws.map((w, i) => tint(rect(x, y + i * gap, w, t, t / 2), "ink")).join("")
const [cos, sin] = [
  (d: N) => Math.cos((d * Math.PI) / 180),
  (d: N) => Math.sin((d * Math.PI) / 180),
]
/** Marks loose on the canvas take its text colour: ink on bright canvases, paper on Night. */
const LOOSE = { style: "fill:none;stroke:var(--text, var(--ink))" }
/** Concentric arcs round (cx, cy) from a0 to a1 degrees, loose on the canvas: sound, motion. */
export const arcs = (p: Pen, cx: N, cy: N, radii: N[], a0: N, a1: N) =>
  radii
    .map((q) => {
      const pt = (a: N) => `${n(cx + q * cos(a))} ${n(cy + q * sin(a))}`
      return line(p, `M ${pt(a0)} A ${q} ${q} 0 0 1 ${pt(a1)}`, LOOSE)
    })
    .join("")
/** An ellipse turned by `deg`. */
export const tilted = (cx: N, cy: N, a: N, b: N, deg = 0) => {
  const [c, s] = [cos(deg) * a, sin(deg) * a]
  const arc = `A ${n(a)} ${n(b)} ${n(deg)} 1 1`
  return `M ${n(cx + c)} ${n(cy + s)} ${arc} ${n(cx - c)} ${n(cy - s)} ${arc} ${n(cx + c)} ${n(cy + s)} Z`
}
/** A dome `hh` tall on an elliptical foot of depth `ry`, stippled on its lower right. */
export function hump(p: Pen, cx: N, base: N, rx: N, hh: N, ry: N, f: string) {
  const [l, r] = [n(cx - rx), n(cx + rx)]
  const d = `M ${l} ${base} A ${rx} ${hh} 0 0 1 ${r} ${base} A ${rx} ${ry} 0 0 1 ${l} ${base} Z`
  const sh = `M ${r} ${base} A ${rx} ${hh} 0 0 0 ${n(cx - rx * 0.1)} ${n(base - hh)} A ${n(rx * 0.95)} ${n(hh * 1.15)} 0 0 1 ${n(cx - rx * 0.3)} ${n(base + ry)} Z`
  return shape(p, d, f) + clip(p, d, shaded(p, sh, f)) + shape(p, d, "none")
}
export const cyl = (p: Pen, x: N, b: N, rx: N, h: N, f: string, top = true) =>
  cylinder(p, { cx: x, base: b, rx, h, fill: f, top })

/** A door ajar in an arched frame, light pouring through the gap and onto the floor. */
const openDoor: Draw = (p, r, fx) => {
  const [a, b, c] = tones(r("tones"))
  const leaf = fx.door ?? b
  const phi = r("swing").between(30, 44)
  const [ka, kb] = [cos(phi) - 0.6 * sin(phi), 0.375 * sin(phi)]
  // The leaf turns on its hinge at x = 76 toward the viewer: an affine squash and drop.
  const swing = `matrix(${n(ka)} ${n(kb)} 0 1 ${n(76 * (1 - ka))} ${n(-76 * kb)})`
  const [x, drop] = [n(76 + 98 * ka), 98 * kb]
  const door =
    shape(p, archPath(76, 290, 98, 206), leaf) +
    line(p, archPath(92, 174, 66, 70) + rect(92, 192, 66, 76, 2)) +
    shape(p, circle(160, 184, 5), "sun")
  const pool = `M ${x + 2} 290 H 174 L 192 316 L ${x - 14} 324 Z`
  const edge = `M ${x} ${n(133 + drop)} l 6 -2 V ${n(288 + drop)} l -6 2 Z`
  return (
    box(p, { x: 40, y: 40, w: 170, h: 250, fill: fx.wall ?? a, depth: 0.8 }) +
    shape(p, archPath(76, 290, 98, 206), "sun") +
    sparkle(p, 150, 140, 11) +
    shape(p, "M 132 64 H 148 L 144 84 H 136 Z", fx.keystone ?? c) +
    tint(pool, tintOf("sun", 50)) +
    shape(p, edge, shade(leaf)) +
    `<g transform="${swing}">${door}</g>`
  )
}

/** A padlock: a rounded body with a thin side face, its shackle closed, a keyhole in a round plate. */
const padlock: Draw = (p, r, fx) => {
  const [a, b] = tones(r("tones"))
  const [f, metal] = [fx.body ?? a, fx.shackle ?? b]
  const [x, y, w, h, k] = [30, 116, 112, 108, 14]
  const front = rect(x, y, w, h, k)
  const back = rect(x + 10, y - 7, w, h, k)
  // The side face: tangents from the top left and bottom right corners, perpendicular to the depth (10, -7).
  const [tx, ty] = [k * 0.573, k * 0.819]
  const tl = `${n(x + k - tx)} ${n(y + k - ty)}`
  const br = `${n(x + w - k + tx)} ${n(y + h - k + ty)}`
  const hull = `M ${tl} l 10 -7 L ${n(x + w - k + tx + 10)} ${n(y + h - k + ty - 7)} L ${br} Z`
  const shackle =
    "M 52 122 V 72 A 35 35 0 0 1 122 72 V 122 H 108 V 72 A 21 21 0 0 0 66 72 V 122 Z"
  const plate = circle(x + w / 2, y + h * 0.48, 22)
  return (
    shape(p, shackle, metal) +
    clip(p, shackle, shaded(p, rect(102, 20, 40, 110), metal)) +
    shape(p, shackle, "none") +
    shape(p, back, shade(f)) +
    tint(hull, shade(f)) +
    tint(back + hull, stipple(p)) +
    line(p, `M ${tl} l 10 -7 M ${br} l 10 -7`) +
    shape(p, front, f) +
    shape(p, front, "none") +
    line(p, rect(x + 9, y + 9, w - 18, h - 18, k - 6)) +
    shape(p, plate, tintOf(f, 62)) +
    shape(p, "M 79 162 A 7 7 0 1 1 93 162 L 90 180 H 82 Z", "ink")
  )
}

/** A magnifying glass: a paper lens in a thick rim with a sparkle caught in it, the handle running down and away. */
const magnifier: Draw = (p, r, fx) => {
  const [a, b, c] = tones(r("tones"))
  const [rim, grip] = [fx.rim ?? a, fx.handle ?? b]
  const [outer, lens] = [circle(100, 100, 78), circle(100, 100, 65)]
  const handle = rect(192, 88, 76, 24, 12)
  const stem =
    shape(p, rect(172, 91, 22, 18, 2), fx.collar ?? c) +
    shape(p, handle, grip) +
    clip(p, handle, shaded(p, rect(192, 103, 76, 12), grip)) +
    shape(p, handle, "none")
  return (
    turn(45, 100, 100, stem) +
    shape(p, outer, rim) +
    clip(p, outer, shaded(p, crescent(100, 100, 78, -15.6, -12.5), rim)) +
    shape(p, outer, "none") +
    shape(p, lens, "paper") +
    tint(crescent(100, 100, 65, -23.4, -18.7), tintOf("highlight", 34)) +
    shape(p, lens, "none") +
    arcs(p, 100, 100, [52], 200, 248) +
    sparkle(p, 94, 96, r("glint").between(22, 28)) +
    sparkle(p, 130, 128, 9)
  )
}

/** A hand bell swinging on its handle, its clapper showing under the lip, with motion arcs either side. */
const bell: Draw = (p, r, fx) => {
  const [a, b] = tones(r("tones"))
  const [f, wood] = [fx.bell ?? "sun", fx.handle ?? a]
  const body =
    "M 48 206 C 64 196 82 180 84 150 C 86 120 90 104 120 102 C 150 104 154 120 156 150 " +
    "C 158 180 176 196 192 206 A 72 14 0 0 1 48 206 Z"
  const side = "M 128 96 C 144 120 142 170 150 230 H 210 V 96 Z"
  const swing = r("swing").between(9, 17) * (r("side").chance(0.5) ? 1 : -1)
  const rung =
    sphere(p, 120 - swing * 0.8, 222, 10, "ink") +
    shape(p, body, f) +
    clip(p, body, shaded(p, side, f)) +
    shape(p, body, "none") +
    line(p, "M 74 186 Q 120 200 166 186") +
    shape(p, tilted(102, 126, 5, 13, 20), "paper") +
    slab(p, { cx: 120, y: 98, rx: 16, thick: 6, fill: fx.collar ?? b }) +
    cyl(p, 120, 98, 11, 44, wood) +
    sphere(p, 120, 50, 15, wood)
  return (
    arcs(p, 120, 150, [92, 108], 330, 15) +
    arcs(p, 120, 150, [92, 108], 165, 210) +
    turn(swing, 120, 60, rung)
  )
}

/** A clipboard with a sheet of three rows, two of them ticked off. */
const checklist: Draw = (p, r, fx) => {
  const [a, b, c] = tones(r("tones"))
  const [metal, words] = [fx.clip ?? c, r("words")]
  const tick = (y: N) =>
    `M 58 ${y + 11} l 7 8 l 19 -27 l -5 -3 l -14 20 l -3 -4 Z`
  const rows = [118, 168, 218].map(
    (y, i) =>
      shape(p, rect(54, y, 22, 22, 3), "paper") +
      (i < 2 ? shape(p, tick(y), fx.tick ?? "sun") : "") +
      bars(88, y + 4, [words.between(56, 72), words.between(30, 52)], 4, 10),
  )
  const top = rect(66, 24, 78, 30, 6)
  const board =
    box(p, { x: 22, y: 34, w: 166, h: 256, fill: fx.board ?? a, depth: 0.25 }) +
    shape(p, rect(38, 64, 134, 210, 2), tintOf(fx.sheet ?? b, 50)) +
    bars(54, 84, [76], 6) +
    rows.join("") +
    shape(p, archPath(88, 30, 34, 26), metal) +
    shape(p, circle(105, 16, 5), "ink") +
    shape(p, top, metal) +
    clip(p, top, shaded(p, rect(120, 20, 30, 40), metal)) +
    shape(p, top, "none")
  return turn(r("tilt").between(-5, -2), 110, 160, board)
}

/** A light bulb glowing in the sun, with a coiled filament, short rays and a ribbed screw base. */
const lightbulb: Draw = (p, r, fx) => {
  const [glow, metal] = [fx.glass ?? "sun", fx.base ?? tones(r("tones"))[0]]
  const glass =
    "M 68 206 C 66 190 58 178 60 167.4 A 70 70 0 1 1 140 167.4 C 142 178 134 190 132 206 Z"
  const rays = Array.from({ length: 11 }, (_, i) => {
    const at = (q: N, a = -202.5 + i * 22.5) =>
      `${n(100 + q * cos(a))} ${n(110 + q * sin(a))}`
    return `M ${at(86)} L ${at(100)}`
  })
  const ribs = [0, 1, 2, 3].map((i) =>
    rect(66 + i * 1.5, 216 + i * 12, 68 - i * 3, 10, 5),
  )
  const coil = r("coil").int(4, 5)
  const turns = Array.from(
    { length: coil * 2 },
    (_, i) => `l ${n(14 / coil)} ${i % 2 ? 7 : -7}`,
  )
  const wires =
    "M 92 206 L 95 176 H 105 L 108 206 M 95 176 L 86 128 M 105 176 L 114 128 M 86 128"
  const lit = tint(circle(96, 112, 40), tintOf(glow, 58))
  const base = ribs.join(" ")
  return (
    line(p, rays.join(" "), LOOSE) +
    shape(p, glass, glow) +
    clip(
      p,
      glass,
      lit + shaded(p, crescent(100, 110, 70, -29.4, -23.8), glow),
    ) +
    shape(p, glass, "none") +
    line(p, `${wires} ${turns.join(" ")}`) +
    shape(p, tilted(72, 86, 6, 16, 35), "paper") +
    shape(p, rect(62, 204, 76, 12, 3), metal) +
    shape(p, base, metal) +
    clip(p, base, shaded(p, rect(112, 210, 30, 60), metal)) +
    shape(p, base, "none") +
    shape(p, "M 84 264 Q 100 282 116 264 Z", "ink")
  )
}

/** A two-tone pennant waving from a pole planted on a small mound. */
const flag: Draw = (p, r, fx) => {
  const [a, b, c] = tones(r("tones"))
  const phase = r("wave").between(0, 360)
  const ts = Array.from({ length: 41 }, (_, i) => i / 40)
  const yc = (t: N) => 82 + 12 * t + 9 * sin(396 * t + phase) * t ** 0.7
  const pts = (k: N, list: N[]) =>
    list
      .map((t) => `${n(74 + 154 * t)} ${n(yc(t) + k * (39 - 36 * t))}`)
      .join(" L ")
  const band = (k0: N, k1: N, list: N[]) =>
    `M ${pts(k0, list)} L ${pts(k1, [...list].reverse())} Z`
  // Runs of the pennant turned away from the light, where its wave falls.
  const away = (t: N) => cos(396 * t + phase) < 0
  const folds: N[][] = []
  ts.forEach((t, i) => {
    if (!away(t)) return
    if (i > 0 && away(ts[i - 1]!)) folds[folds.length - 1]!.push(t)
    else folds.push([t])
  })
  const whole = band(-1, 1, ts)
  const shadows = folds
    .filter((run) => run.length > 1)
    .map((run) => band(-1, 1, run))
  return (
    cyl(p, 70, 270, 4, 228, fx.pole ?? c, false) +
    sphere(p, 70, 36, 7, "sun") +
    shape(p, whole, fx.flag ?? a) +
    tint(band(0, 1, ts), fx.stripe ?? b) +
    tint(shadows.join(" "), stipple(p)) +
    line(p, `M ${pts(0, ts)}`) +
    shape(p, whole, "none") +
    hump(p, 86, 288, 72, 34, 12, fx.mound ?? "leaf")
  )
}

export const STAGE_MORE = things("everyday", {
  "open-door": ["an open door", 240, 330, openDoor],
  padlock: ["a padlock", 180, 232, padlock],
  magnifier: ["a magnifying glass", 250, 250, magnifier],
  bell: ["a hand bell", 240, 250, bell],
  checklist: ["a checklist", 220, 300, checklist],
  lightbulb: ["a light bulb", 200, 280, lightbulb],
  flag: ["a flag on a mound", 240, 300, flag],
})
