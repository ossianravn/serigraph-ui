// Objects: travel and post, part one, and the helpers both travel files share.
// Each object draws in its own box; see library.ts for the contract.
import { box, quad, shade } from "../buildings"
import { circle, line, shape, sparkle, stipple, tint } from "../motifs"
import { n, type Pen } from "../svg"
import { rod, sphere } from "./forms"
import { fillOf, type Fills, type Thing } from "./library"

export type Pt = readonly [number, number]
export type Draw = Thing["draw"]
type R = Parameters<Draw>[1]

/** A travel object from its name, title, box [w, h] and drawing. */
export const travel = (name: string, title: string, box: Pt, draw: Draw) =>
  ({ name, title, collection: "travel", w: box[0], h: box[1], draw }) as Thing
/** A part's role: the scene's override, else one of `o` by seed. */
export const roleOf =
  (fills: Fills, r: R) =>
  (part: string, ...o: string[]) =>
    fillOf(fills, part, r(part).pick(o))
/** Roles in threes (two alternating panels and a band) that sit well
 * together in every colourway. */
export const TRIOS = [
  ["structure", "stair", "platform"],
  ["tone-1", "tone-3", "structure"],
  ["tone-4", "sun", "tone-2"],
] as const
/** One seeded trio of roles for up to three parts, each overridable. */
export function trioOf(fills: Fills, r: R, parts: string[]) {
  const trio = r("colours").pick(TRIOS)
  return parts.map((part, i) => fillOf(fills, part, trio[i] ?? "ink"))
}

/** Points from a flat list of x, y pairs, offset by (ox, oy). */
export function P(ox: number, oy: number, xy: number[]) {
  const out: Pt[] = []
  for (let i = 0; i + 1 < xy.length; i += 2)
    out.push([ox + (xy[i] ?? 0), oy + (xy[i + 1] ?? 0)])
  return out
}
/** One point, offset by (ox, oy). */
export const at = (ox: number, oy: number, x = 0, y = 0): Pt => [ox + x, oy + y]
const O = at(0, 0)
/** `count` numbers evenly from a to b. */
export const steps = (count: number, a: number, b: number) =>
  Array.from({ length: count }, (_, i) => a + ((b - a) * i) / (count - 1))
export const rect = (x0: number, y0: number, x1: number, y1: number) =>
  P(0, 0, [x0, y0, x1, y0, x1, y1, x0, y1])
/** An open polyline through points. */
export const path = (ps: Pt[]) =>
  `M ${ps.map(([x, y]) => `${n(x)} ${n(y)}`).join(" L ")}`
export const moved = (ps: Pt[], dx: number, dy: number) =>
  ps.map(([x, y]) => at(x, y, dx, dy))
/** Points spun by `deg` about (cx, cy). */
export function spin(ps: Pt[], deg: number, cx: number, cy: number) {
  const [c, s] = [Math.cos(deg / 57.2958), Math.sin(deg / 57.2958)]
  const turn = ([x, y]: Pt): Pt => [c * (x - cx) - s * (y - cy), s * (x - cx)]
  return ps.map((q) => at(cx, cy + c * (q[1] - cy), ...turn(q)))
}
/** Points along the quadratic curve from a through control c to b. */
export const qpts = (a: Pt, c: Pt, b: Pt, count = 16) =>
  steps(count, 1 / count, 1).map((t) => bezier(t, a, c, b))
function bezier(t: number, [ax, ay]: Pt, [cx, cy]: Pt, [bx, by]: Pt): Pt {
  const [u, v, w] = [(1 - t) ** 2, 2 * t * (1 - t), t * t]
  return [u * ax + v * cx + w * bx, u * ay + v * cy + w * by]
}
/** `inner`, seen only inside `d`; where `d` holds two outlines, only where
 * exactly one covers. */
export function clipTo(p: Pen, d: string, inner: string) {
  const id = p.uid("clip")
  const clip = `<clipPath id="${id}"><path d="${d}" clip-rule="evenodd"/>`
  return `${clip}</clipPath><g clip-path="url(#${id})">${inner}</g>`
}
/** The lower right of a round outline: `inner` shows where the outline,
 * moved up and left by (x, y), leaves it. */
export const lowerRight = (p: Pen, ps: Pt[], [x, y]: Pt, inner: string) =>
  clipTo(p, `${quad(ps)} ${quad(moved(ps, -x, -y))}`, inner)
/** A fill's shade, stippled, with no line: the side away from the light. */
export const dark = (p: Pen, d: string, f: string) =>
  tint(d, shade(f)) + tint(d, stipple(p))
/** A face in the ink line. */
export const face = (p: Pen, ps: Pt[], f: string) => shape(p, quad(ps), f)
/** A face turned from the light: its fill's shade, stippled, in ink. */
export const dim = (p: Pen, ps: Pt[], f: string) =>
  dark(p, quad(ps), f) + shape(p, quad(ps), "none")
/** buildings' box from [x, y, w, h, depth]. */
export const cube = (p: Pen, xy: number[], fill: string, top?: string) => {
  const [x = 0, y = 0, w = 0, h = 0, depth = 1] = xy
  return box(p, { x, y, w, h, depth, fill, top })
}
/** A line in the open sky: ink, or paper on Night's canvas like loose marks. */
export const loose = (p: Pen, d: string, dash = "none") =>
  line(p, d, { style: SKY, "stroke-dasharray": dash })
const SKY = "fill:none;stroke:var(--text, var(--ink))"
/** A dashed ink line. */
export const dashed = (p: Pen, d: string) =>
  line(p, d, { "stroke-dasharray": "6 5" })
/** A word as a bar: a rounded ink bar `len` long and `t` thick. */
export function bar(p: Pen, x: number, y: number, len: number, t = 4.4) {
  const [h, k] = [t / 2, n(len)]
  const end = (s: number) => `a ${h} ${h} 0 0 1 0 ${s * t}`
  const d = `M ${n(x)} ${n(y)} h ${k} ${end(1)} h ${-k} ${end(-1)}`
  return shape(p, d, "ink")
}

/** A rounded rectangle as clockwise points. */
export function rounded([x = 0, y = 0, w = 0, h = 0]: number[], r = 0) {
  const corners = P(0, 0, [x + w - r, y + r, x + w - r, y + h - r])
  corners.push([x + r, y + h - r], [x + r, y + r])
  const arc = ([cx, cy]: Pt, q: number) =>
    at(cx, cy, r * Math.cos(q * 1.5708), r * Math.sin(q * 1.5708))
  return corners.flatMap((c, k) => steps(7, k - 1, k).map((q) => arc(c, q)))
}

/** A ribbon bow at (x, y): two loops and two tails, the right ones in shade. */
export function bow(p: Pen, x: number, y: number, s: number, f: string) {
  const [a, b, c] = [s * 1.25, s * 1.45, s * 0.45].map((v) => n(v))
  const loop = (k: number) =>
    `M ${n(x)} ${n(y)} c ${k * a!} ${-s * 1.1} ${k * b!} ${c} 0 0 Z`
  const tail = (k: number) =>
    P(x, y, [0, 0, k * s * 0.8, s * 1.25, k * s * 0.3, s * 1.15])
  return [
    face(p, tail(-1), f) + face(p, tail(1), shade(f)),
    shape(p, loop(-1), f) + shape(p, loop(1), shade(f)),
    shape(p, circle(x, y, s * 0.24), f),
  ].join("")
}

/** A looping trail from `o` (a prolate trochoid): it runs along (ux, uy) and
 * swings out along (vx, vy); it loops where b > a. */
export function looping(o: Pt, dirs: number[], [a = 0, b = 0, turns = 1]) {
  const [ux = 0, uy = 0, vx = 0, vy = 0] = dirs
  return steps(121, Math.PI, Math.PI * (1 + 2 * turns)).map((t) => {
    const [u, v] = [a * (t - Math.PI) - b * Math.sin(t), b + b * Math.cos(t)]
    return at(...o, ux * u + vx * v, uy * u + vy * v)
  })
}

/** A hot-air balloon: gores in two roles, a band at its waist, a basket. */
const balloon: Draw = (p, r, fills) => {
  const [cx, cy, ny, neck, bx, sy] = [116, 114, 252, 21, 95, 264]
  const R = r("girth").between(90, 97)
  const [a = "", b = "", c = ""] = trioOf(fills, r, ["gore", "gore-2", "band"])
  const k = 1.5708 / (ny - cy)
  const top = (y: number) => Math.sqrt(Math.max(0, R * R - (y - cy) ** 2))
  const low = (y: number) => neck + (R - neck) * Math.cos((y - cy) * k)
  const hw = (y: number) => (y <= cy ? top(y) : low(y))
  const ys = steps(61, cy - R, ny)
  const side = (s: number) => ys.map((y) => at(cx, y, s * hw(y)))
  const outline = [...side(1), ...side(-1).reverse()]
  const env = quad(outline)
  const count = r("gores").int(4, 5) * 2
  const s = steps(count + 1, -1.5708, 1.5708).map(Math.sin)
  const gore = (k: number) => [...side(s[k]!), ...side(s[k + 1]!).reverse()]
  const alt = (k: number) => (k % 2 ? b : a)
  const gores = s.slice(1).map((_, k) => ({ d: quad(gore(k)), f: alt(k) }))
  // The band: two rings round the envelope, seen from above, so they sag.
  const y1 = cy + (ny - cy) * r("waist").between(0.3, 0.4)
  const sag = (y: number, t: number) =>
    at(cx, y, t * hw(y), 7 * Math.sqrt(1 - t * t))
  const ring = (y: number) => steps(25, -1, 1).map((t) => sag(y, t))
  const band = quad([...ring(y1), ...ring(y1 + 13).reverse()])
  const seams = s.slice(1, -1).map((t) => path(side(t)))
  const shadow = gores.map((g) => tint(g.d, shade(g.f))).join("")
  const skirt = P(cx, ny, [-21, -1, 21, -1, 15, 12, -15, 12])
  const flame = `M ${cx} ${sy + 2} q 8 12 0 18 q -8 -6 0 -18 Z`
  const back = `M 101 ${sy} L ${bx + 10.8} 293.25 m 38 0 L 131 ${sy}`
  const front = `M 101 ${sy} L ${bx} 300 M 131 ${sy} L ${bx + 38} 300`
  const hatch = (k: number) => `M ${k} 326 l 26 -26 m -26 0 l 26 26`
  const weave = steps(9, bx - 24, bx + 40).map(hatch)
  const wicker = fillOf(fills, "basket", "stair")
  const shift = at(R * 0.36, R * 0.3)
  return [
    loose(p, back) + gores.map((g) => tint(g.d, g.f)).join(""),
    clipTo(p, env, tint(band, c)),
    lowerRight(p, outline, shift, shadow + dark(p, band, c)),
    lowerRight(p, outline, shift, tint(env, stipple(p))),
    clipTo(p, `${env} ${band}`, line(p, seams.join(" "))),
    clipTo(p, env, line(p, path(ring(y1)) + path(ring(y1 + 13)))),
    shape(p, env, "none") + face(p, skirt, c),
    dark(p, quad(P(cx, ny, [4, -1, 21, -1, 15, 12, 4, 12])), c),
    shape(p, quad(skirt), "none") + shape(p, flame, "sun"),
    face(p, rect(cx - 7, sy + 20, cx + 7, sy + 26), "ink") + loose(p, front),
    cube(p, [bx, 300, 38, 26, 0.45], wicker, "ink"),
    clipTo(p, quad(rect(bx, 300, bx + 38, 326)), line(p, weave.join(" "))),
    line(p, `M ${bx} 305 H ${bx + 38}`),
  ].join("")
}

/** A diamond kite on cross spars, its far half in shade, a long swaying tail of bows. */
const kite: Draw = (p, r, fills) => {
  const [a = "", b = ""] = trioOf(fills, r, ["panel", "panel-2"])
  const h = r("width").between(64, 72)
  const diamond = P(100, 0, [0, 10, -h, 78, h, 78, 0, 204, 0, 78])
  const tilt = r("tilt").between(-15, -6)
  const [T = O, L = O, R = O, B = O, C = O] = spin(diamond, tilt, 100, 110)
  // The tail sways down in a widening S, four bows along it.
  const sway = r("sway").between(16, 22) * r("side").pick([-1, 1])
  const tail = steps(61, 0, 1).map((t) =>
    at(...B, sway * Math.sin(t * 8.4) * (0.35 + t) + 10 * t, t * 122),
  )
  const alt = (i: number) => (i % 2 ? b : a)
  const bows = [14, 30, 45, 60].map((k, i) => bow(p, ...tail[k]!, 13, alt(i)))
  const flying = `M ${n(C[0])} ${n(C[1])} Q ${n(C[0] - 50)} 240 6 334`
  return [
    loose(p, flying) + loose(p, path(tail)) + bows.join(""),
    face(p, [T, C, L], a) + dim(p, [T, R, C], b),
    dim(p, [C, R, B], a) + face(p, [C, B, L], b),
    rod(p, ...T, ...B, 3.6, "paper") + rod(p, ...L, ...R, 3.6, "paper"),
    shape(p, circle(...C, 3.4), "ink"),
  ].join("")
}

/** A folded paper plane: far wing in a tone, near wing paper, the keel and
 * folded edge beneath in shade, and a dashed trail looping behind. */
const paperPlane: Draw = (p, r, fills) => {
  const tone = roleOf(fills, r)("wing", "tone-1", "tone-3", "highlight")
  const sheet = fillOf(fills, "paper", "paper")
  const xy = [306, 56, 128, 98, 150, 34, 62, 168, 152, 150, 76, 184]
  const pts = spin(P(0, 0, xy), r("lift").between(-5, 3), 200, 100)
  const [N = O, Tc = O, Wf = O, Wn = O, K = O, F = O] = pts
  const dirs = [-0.8, 0.6, -0.6, -0.8]
  const trail = looping(at(...Tc, -6, 8), dirs, [13, 22, 1.15])
  const mid = at((Tc[0] + Wn[0]) / 2, (Tc[1] + Wn[1]) / 2)
  return [
    loose(p, path(trail), "6 5"),
    face(p, [N, Wf, Tc], tone) + dim(p, [N, Tc, K], sheet),
    face(p, [N, Tc, Wn], sheet) + line(p, path([N, mid])),
    dim(p, [N, Wn, F], tone),
  ].join("")
}

/** An envelope, its flap open on a striped liner, a letter half out and a
 * wax seal on the pocket. */
const envelope: Draw = (p, r, fills) => {
  const env = roleOf(fills, r)("envelope", "tone-1", "tone-3", "tone-2")
  const liner = fillOf(fills, "liner", "structure")
  const wax = fillOf(fills, "seal", "action")
  const tilt = r("tilt").between(-4, 3)
  const letter = spin(rect(66, 60, 168, 178), tilt, 115, 110)
  const row = (y: number) => P(0, y, [80, 0, r("rows").between(110, 154), 0])
  const rows = steps(5, 78, 118).map((y) => path(spin(row(y), tilt, 115, 110)))
  const stripes = steps(9, 0, 208).map((x) => `M ${x} 118 l 60 -100`)
  const rad = r("seal").between(14, 16)
  const rim = (t: number, k = rad * (1 + 0.06 * Math.sin(t * 9))) =>
    at(115, 160, k * Math.cos(t), k * Math.sin(t))
  const ps = steps(91, 0, 6.2832).map((t) => rim(t))
  const inner = P(0, 0, [53, 112.5, 124, 44, 195, 112.5])
  const side = P(0, 0, [210, 118, 219, 112.5, 219, 216.5, 210, 222])
  return [
    face(p, rect(29, 112.5, 219, 216.5), shade(env, 70)),
    face(p, P(0, 0, [29, 112.5, 124, 22, 219, 112.5]), env),
    face(p, inner, liner),
    clipTo(p, quad(inner), line(p, stripes.join(" "))),
    face(p, letter, "paper") + line(p, rows.join(" ")),
    dim(p, side, env) + face(p, rect(20, 118, 210, 222), env),
    line(p, "M 20 118 L 105 168"),
    face(p, P(0, 0, [210, 118, 210, 222, 125, 168]), shade(env, 92)),
    face(p, P(0, 0, [20, 222, 115, 160, 210, 222]), env),
    tint(quad(ps), wax) + lowerRight(p, ps, [6, 5], dark(p, quad(ps), wax)),
    shape(p, quad(ps), "none") + line(p, circle(115, 160, rad * 0.62)),
    sparkle(p, 115, 160, rad * 0.36),
  ].join("")
}

/** A paper ticket: notched corners, a perforation notched at both ends, a
 * stub in a second role, bars for words. */
const ticket: Draw = (p, r, fills) => {
  const [y0, y1, cy] = [42, 150, 96]
  const px = n(278 - r("stub").between(62, 74))
  const a = roleOf(fills, r)("ticket", "tone-1", "tone-3", "highlight")
  const b = fillOf(fills, "stub", "tone-2")
  const nick = (x: number, y: number) => `A 9 9 0 0 0 ${x} ${y}`
  const cut = (x: number, y: number) => `A 11 11 0 0 0 ${x} ${y}`
  const d =
    `M 33 ${y0} H ${px - 9} ${nick(px + 9, y0)} H 267 ${cut(278, 53)} ` +
    `V 139 ${cut(267, y1)} H ${px + 9} ${nick(px - 9, y1)} H 33 ` +
    `${cut(22, 139)} V 53 ${cut(33, y0)} Z`
  const [w1, w2, w3] = [70, 50, 30].map((w) => w + r("words").between(0, 30))
  const sw = 248 - px
  const tilt = `<g transform="rotate(${n(r("tilt").between(-8, -3))} 150 96)">`
  return [
    tilt + shape(p, d, a) + clipTo(p, d, face(p, rect(px, 40, 280, 152), b)),
    shape(p, d, "none") + line(p, quad(rect(32, 52, px - 12, 140))),
    sphere(p, 68, cy, 22, "sun") + sparkle(p, 62, cy - 7, 6),
    bar(p, 104, cy - 22, w1!, 8) + bar(p, 104, cy - 2, w2!),
    bar(p, 104, cy + 12, w3!) + dashed(p, `M ${px} 55 V 137`),
    shape(p, circle(px + (278 - px) / 2, y0 + 26, 6), "ink"),
    bar(p, px + 14, cy + 4, sw) + bar(p, px + 14, cy + 18, sw * 0.6),
    `</g>`,
  ].join("")
}

export const TRAVEL: Thing[] = [
  travel("hot-air-balloon", "a hot-air balloon", [240, 340], balloon),
  travel("kite", "a kite", [220, 340], kite),
  travel("paper-plane", "a paper plane", [320, 220], paperPlane),
  travel("envelope", "an envelope", [260, 230], envelope),
  travel("ticket", "a ticket", [300, 170], ticket),
]
