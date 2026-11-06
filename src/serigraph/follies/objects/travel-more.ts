// Objects: travel and post, part two; travel.ts has the shared helpers.
import { archPath, quad, shade, tintOf } from "../buildings"
import { circle, ellipse, line, shape, sparkle, stipple, tint } from "../motifs"
import { n, type Pen } from "../svg"
import { rod, sphere } from "./forms"
import { fillOf, type Thing } from "./library"
import { at, bar, bow, clipTo, cube, dark, dim, face, loose, P } from "./travel"
import { lowerRight, moved, path, qpts, rect, roleOf, type Pt } from "./travel"
import { rounded, spin, steps, travel, trioOf, type Draw } from "./travel"

/** A flat convex outline (clockwise) with thickness along d, the top edge
 * lighter, the right one in shade; `seam` rings the thickness at half depth. */
function slabOf(p: Pen, ps: Pt[], d: Pt, f: string, seam = false) {
  const [m, [dx, dy]] = [ps.length, d]
  const [up, right]: [number[], number[]] = [[], []]
  ps.forEach(([ax, ay], i) => {
    const [bx, by] = ps[(i + 1) % m]!
    const [nx, ny] = [by - ay, ax - bx]
    if (nx * dx + ny * dy > 1e-9) (ny < -nx ? up : right).push(i)
  })
  const front = (e: number[]) => {
    const s = e.find((i) => !e.includes((i - 1 + m) % m)) ?? 0
    return [ps[s]!, ...e.map((_, k) => ps[(s + k + 1) % m]!)]
  }
  const band = (e: number[], q = front(e)) =>
    q.concat(moved(q, dx, dy).reverse())
  return [
    up.length ? face(p, band(up), tintOf(f, 65)) : "",
    right.length ? dim(p, band(right), f) : "",
    seam ? line(p, path(moved(front([...up, ...right]), dx / 2, dy / 2))) : "",
    face(p, ps, f),
  ].join("")
}

/** A parcel tied with string in a cross, a bow on top, a hanging label. */
const parcel: Draw = (p, r, fills) => {
  const f = roleOf(fills, r)("box", "tone-2", "tone-4", "tone-1")
  const str = fillOf(fills, "string", "action")
  const [x, y, h, dx, dy] = [22, 102, 110, 33.6, -21]
  const w = r("width").between(128, 140)
  const cx = n(x + w * r("knot").between(0.34, 0.44))
  const [kx, ky, sx] = [cx + dx / 2, y + dy / 2, x + w + dx / 2]
  const hole = at(cx - 22, y + 34)
  const swing = r("tag").between(112, 128)
  const hang = (xy: number[]) => spin(P(...hole, xy), swing, ...hole)
  const string = `M ${kx} ${ky + 4} Q ${cx - 18} ${ky + 14} ${cx - 22} ${y + 34}`
  const address = `M ${cx + 22} ${y + h - 36} h 36 m -36 8 h 26 m -26 8 h 16`
  const label = rect(cx + 14, y + h - 44, x + w - 10, y + h - 12)
  const tag = hang([0, 0, 10, -10, 50, -10, 50, 10, 10, 10])
  const words = path(hang([18, -3, 42, -3])) + path(hang([18, 3, 34, 3]))
  return [
    cube(p, [x, y, w, h, 1.4], f),
    face(p, label, "paper") + line(p, address),
    rod(p, cx, y, cx, y + h, 5, str),
    rod(p, cx, y, cx + dx, y + dy, 4.4, tintOf(str, 70)),
    rod(p, x + dx / 2, ky, sx, ky, 4.4, tintOf(str, 70)),
    rod(p, sx, ky, sx, y + h + dy / 2, 4.4, shade(str)),
    line(p, string) + face(p, tag, "paper"),
    shape(p, circle(...hole, 2.6), "ink") + line(p, words),
    bow(p, kx, ky, 17, str),
  ].join("")
}

/** An airship: a long round envelope, a stripe, fins and a gondola. */
const zeppelin: Draw = (p, r, fills) => {
  const [xt, cy, R] = [36, 80, r("girth").between(48, 55)]
  const hull = roleOf(fills, r)("hull", "tone-1", "tone-4", "tone-3")
  const stripe = fillOf(fills, "stripe", "tone-2")
  const fin = fillOf(fills, "fin", "structure")
  const nose = (u = 0) => Math.sqrt(Math.max(0, 1 - (u / 0.38 - 1.6316) ** 2))
  const hh = (u = 0) => R * (u < 0.62 ? Math.sin(u * 2.533) ** 0.5 : nose(u))
  const X = (u = 0) => xt + 284 * u
  const edge = (k = 0) => steps(81, 0, 1).map((u) => at(X(u), cy + k * hh(u)))
  const body = [...edge(-1), ...edge(1).reverse()]
  const band = quad([...edge(0.12), ...edge(0.36).reverse()])
  const top = P(xt, cy, [74, -30, 34, -64, 4, -64, 6, -6])
  const under = top.map(([x, y]) => at(x, 2 * cy - y))
  const ring = (u = 0, h = n(hh(u))) =>
    `M ${n(X(u))} ${n(cy - h)} a ${n(h * 0.22)} ${h} 0 0 1 0 ${2 * h}`
  const rings = [0.24, 0.44, 0.63, 0.81].map((u) => ring(u)).join(" ")
  const shadow = tint(quad(body), shade(hull)) + dark(p, band, stripe)
  const [gx, gy] = [X(r("gondola").between(0.44, 0.52)), cy + R + 7]
  const struts = `M ${n(gx + 12)} ${n(gy - 14)} v 14 m 44 0 v -14`
  const pane = (i = 0) => archPath(gx + 10 + i * 14, gy + 14, 7, 9)
  const windows = [0, 1, 2, 3].map(pane).join(" ")
  const gondola = fillOf(fills, "gondola", "platform")
  return [
    face(p, top, fin) + dim(p, under, fin),
    loose(p, struts) + tint(quad(body), hull) + tint(band, stripe),
    lowerRight(p, body, [30, R * 0.42], shadow + tint(quad(body), stipple(p))),
    line(p, path(edge(0.12)) + path(edge(0.36)) + rings),
    shape(p, quad(body), "none") + shape(p, circle(317, cy, 4), "ink"),
    face(p, P(xt, cy, [62, 4, 6, 28, -30, 28, 4, 2]), fin),
    slabOf(p, rounded([gx, gy, 68, 18], 8), [8, -5], gondola),
    shape(p, windows, "ink") + rod(p, gx - 9, gy + 9, gx, gy + 9, 3, "ink"),
    shape(p, ellipse(gx - 10, gy + 9, 3, 12), "paper"),
  ].join("")
}

/** Curling waves: crests from x0 to x1 at `base`, a spiral in each. */
function waves(p: Pen, xs: number[], f: string) {
  const [x0 = 0, x1 = 0, base = 0, count = 1, foot = 0] = xs
  const q = (x1 - x0) / count / 2
  const crest = (i = 0) => `A ${q} ${q} 0 0 1 ${n(x0 + 2 * i * q)} ${base}`
  const swirl = (k = 0, t = 3.1416 * (1 + 1.7 * k), s = 0.74 - 0.5 * k) =>
    at(0, q * 0.12, q * s * Math.cos(t), q * s * Math.sin(t))
  const spiral = steps(40, 0, 1).map((k) => swirl(k))
  const curl = (cx = 0) => path(moved(spiral, cx, base))
  const ids = steps(count, 1, count)
  const sea = `M ${x0} ${foot} V ${base} ${ids.map(crest).join(" ")} V ${foot} Z`
  const curls = ids.map((i) => curl(x0 + (2 * i - 1) * q))
  return shape(p, sea, f) + line(p, curls.join(" "))
}

/** A small sailing boat: a striped mainsail, a jib, a pennant, on waves. */
const sailboat: Draw = (p, r, fills) => {
  const role = roleOf(fills, r)
  const [hullF, sea] = [role("hull", "structure"), role("sea", "platform")]
  const sa = role("sail", "tone-2", "tone-1")
  const sb = role("sail-2", "tone-3", "tone-4")
  const belly = 112 + r("belly").between(96, 108)
  const keel = qpts([212, 220], [202, 254], [160, 258])
  const hull = [at(22, 214), at(212, 220), ...keel, at(84, 258)]
  hull.push(...qpts([84, 258], [44, 254], [22, 214]))
  const sail = [at(116, 40), ...qpts([116, 40], [belly, 112], [204, 204])]
  sail.push(at(116, 204))
  const foot = qpts([103, 200], [70, 214], [40, 204])
  const jib = [at(106, 54), at(103, 200), ...foot]
  const lee = P(0, 0, [106, 54, 150, 210, 60, 210])
  const pane = (y = 0) => quad(rect(112, y, 222, y + 24))
  const alt = (i = 0) => (i % 2 ? sb : sa)
  const cloth = steps(7, 40, 184).map((y, i) => ({ d: pane(y), f: alt(i) }))
  const sewn = cloth.map((s) => shape(p, s.d, s.f)).join("")
  const shaded = cloth.map((s) => dark(p, s.d, s.f)).join("")
  const pennant = "M 112 22 q 20 0 42 8 q -22 4 -42 8 Z"
  const stripe = "M 20 222 L 214 228 L 214 234 L 20 228 Z"
  const deck = P(0, 0, [22, 214, 212, 220, 220, 215, 30, 209])
  const ports = [72, 104, 136].map((x) => circle(x, 243, 4.2)).join(" ")
  return [
    waves(p, [4, 236, 244, 6, 298], tintOf(sea, 70)),
    loose(p, "M 112 30 L 26 212") + face(p, jib, "paper"),
    clipTo(p, quad(jib), tint(quad(lee), stipple(p))),
    shape(p, quad(jib), "none") + rod(p, 112, 226, 112, 26, 5, "paper"),
    clipTo(p, quad(sail), sewn) + lowerRight(p, sail, [34, 30], shaded),
    shape(p, quad(sail), "none") + rod(p, 110, 207, 210, 207, 4.4, "paper"),
    shape(p, pennant, role("pennant", "action")),
    shape(p, circle(112, 22, 4), "ink") + face(p, deck, tintOf(hullF, 65)),
    face(p, hull, hullF) + clipTo(p, quad(hull), shape(p, stripe, "paper")),
    lowerRight(p, hull, [30, 16], dark(p, quad(hull), hullF)),
    shape(p, quad(hull), "none") + shape(p, ports, "ink"),
    waves(p, [4, 236, 266, 5, 298], sea),
  ].join("")
}

/** A round-cornered suitcase: straps and buckles, a handle, two stickers. */
const suitcase: Draw = (p, r, fills) => {
  const f = roleOf(fills, r)("case", "tone-4", "structure", "tone-1")
  const strap = fillOf(fills, "strap", "tone-2")
  const [x, y, h, dx, dy] = [22, 92, 120, 20, -12.5]
  const w = n(r("width").between(156, 168))
  const [hx, hy] = [n(x + w / 2 + dx / 2), y + dy / 2 + 1]
  const handle =
    `M ${hx - 26} ${hy} v -18 q 0 -12 12 -12 h 28 q 12 0 12 12 v 18 h -8 ` +
    `v -16 q 0 -6 -6 -6 h -24 q -6 0 -6 6 v 16 Z`
  const s1 = at(x + w / 2 + r("s1").between(-6, 6), y + 44)
  const s2 = at(x + w / 2 - r("s2").between(4, 14), y + 90)
  const strapOn = (sx = 0) =>
    face(p, P(sx, y, [0, 0, 14, 0, 14 + dx, dy, dx, dy]), tintOf(strap, 65)) +
    face(p, rect(sx, y, sx + 14, y + h), strap) +
    face(p, rect(sx - 3, y + 30, sx + 17, y + 44), "paper") +
    face(p, rect(sx + 3, y + 35, sx + 11, y + 39), "ink")
  const foot = (fx = 0) => rect(fx, y + h - 4, fx + 14, y + h + 6)
  const grip = dark(p, quad(rect(hx + 17, hy - 34, hx + 30, hy)), strap)
  return [
    face(p, foot(x + 16), "ink") + face(p, foot(x + w - 30), "ink"),
    slabOf(p, rounded([x, y, w, h], 18), [dx, dy], f, true),
    sphere(p, ...s1, 18, "sun") + line(p, circle(...s1, 12)),
    sparkle(p, ...s1, 7) + sphere(p, ...s2, 14, "highlight"),
    shape(p, archPath(s2[0] - 5, s2[1] + 7, 10, 14), "ink"),
    strapOn(x + 34) + strapOn(x + w - 48) + shape(p, handle, strap),
    clipTo(p, handle, grip) + shape(p, handle, "none"),
  ].join("")
}

/** An open umbrella: two-role panels on curved ribs, a crook handle. */
const umbrella: Draw = (p, r, fills) => {
  const [cx, base, yh, S, C] = [130, 150, 296, Math.sin, Math.cos]
  const parts = ["panel", "panel-2", "handle"]
  const [a = "", b = "", c = ""] = trioOf(fills, r, parts)
  const phis = steps(r("ribs").int(3, 4) * 2 + 1, -1.5708, 1.5708)
  const point = (t = 0, f = 0, s = S(t)) =>
    at(cx, base, 116 * s * S(f), 18 * s * C(f) - 110 * C(t))
  const rib = (f = 0) => steps(13, 0, 1.5708).map((t) => point(t, f))
  const tip = (k = 0) => point(1.5708, phis[k])
  const mid = ([x0, y0]: Pt, [x1, y1]: Pt) =>
    at((x0 + x1) / 2, (y0 + y1) / 2 + 16)
  const scallop = (k = 0, s = tip(k), e = tip(k + 1)) =>
    qpts(s, mid(s, e), e, 8)
  const panel = (k = 0) =>
    quad([...rib(phis[k]), ...scallop(k), ...rib(phis[k + 1]).reverse()])
  const alt = (k = 0) => (k % 2 ? b : a)
  const panels = phis.slice(1).map((_, k) => ({ d: panel(k), f: alt(k) }))
  const rim = phis.slice(1).flatMap((_, k) => scallop(k))
  const outline = [...rib(-1.5708), ...rim, ...rib(1.5708).reverse()]
  const shadow = panels.map((s) => tint(s.d, shade(s.f))).join("")
  const hook = `M ${cx - 3} 160 V ${yh} a 11 11 0 0 1 -22 0 h -6 a 17 17 0 0 0 34 0 V 160 Z`
  const ribs = phis.slice(1, -1).map((f) => path(rib(f)))
  const tips = phis.map((_, k) => circle(...tip(k), 2.6))
  const grip = dark(p, quad(rect(cx - 0.5, 150, cx + 4, yh + 20)), c)
  return [
    shape(p, hook, c) + clipTo(p, hook, grip),
    shape(p, hook, "none") + shape(p, circle(cx - 28, yh, 3), c),
    panels.map((s) => tint(s.d, s.f)).join(""),
    lowerRight(p, outline, [44, 40], shadow + tint(quad(outline), stipple(p))),
    line(p, ribs.join(" ")) + shape(p, quad(outline), "none"),
    shape(p, tips.join(" "), "ink"),
    rod(p, cx, 42, cx, 24, 3, "ink") + sphere(p, cx, 21, 4.5, c),
  ].join("")
}

/** A signpost on a grassy mound: arrow boards pointing three ways. */
const signpost: Draw = (p, r, fills) => {
  const role = roleOf(fills, r)
  const [b1, b2] = [role("board", "sun", "tone-1"), role("board-2", "tone-3")]
  const b3 = role("board-3", "tone-1", "sun")
  const arrow = (x = 0, y = 0, len = 0, dir = 1, f = "") => {
    const [k, e] = [dir * len, dir * (len - 14)]
    const ps = P(x, y, [0, 0, e, 0, k, 15, e, 30, 0, 30])
    const left = Math.min(x, x + k) + 18
    const word = (dy = 0, s = 0) => bar(p, left, y + dy, len * s)
    const board = slabOf(p, dir > 0 ? ps : ps.reverse(), [6, -3.75], f)
    return board + word(9, 0.46) + word(18, 0.3)
  }
  const away = (k = 0, dy = 0) => at(126 + 0.848 * k, 172 - 0.53 * k + dy)
  const len = r("away").between(84, 100)
  const ks = P(0, 0, [0, 0, len - 16, 0, len, 15, len - 16, 30, 0, 30])
  const far = ks.map(([k, dy]) => away(k, dy))
  const word = (k = 0, y = 0) =>
    quad([away(14, y), away(k, y), away(k, y + 4), away(14, y + 4)])
  const mound = [at(16, 316), ...qpts([16, 316], [130, 230], [244, 316])]
  const rise = (x = 0) => n(300 - 0.28 * Math.min(x, 260 - x))
  const tufts = [54, 92, 176, 206].map((x) => `M ${x} ${rise(x)} l 3 -7 l 3 7`)
  const leaf = fillOf(fills, "mound", "leaf")
  const post = fillOf(fills, "post", "tone-2")
  const shadow = dark(p, quad(mound), leaf)
  return [
    slabOf(p, far, [5, 0], b3) + shape(p, word(60, 10) + word(42, 18), "ink"),
    cube(p, [118, 52, 18, 250, 0.5], post) + sphere(p, 133, 38, 10, "sun"),
    arrow(124, 64, r("right").between(100, 116), 1, b1),
    arrow(140, 116, r("left").between(104, 118), -1, b2),
    face(p, mound, leaf) + lowerRight(p, mound, [40, 22], shadow),
    shape(p, quad(mound), "none") + line(p, tufts.join(" ")),
  ].join("")
}

/** A stamp's outline: a rectangle, its sides bitten every 12 units. */
function perforated(corners: Pt[], rb: number) {
  const side = ([ax, ay]: Pt, s: number) => {
    const [bx, by] = corners[(s + 1) % 4] ?? [ax, ay]
    const len = Math.hypot(bx - ax, by - ay)
    const [ux, uy, k] = [(bx - ax) / len, (by - ay) / len, Math.round(len / 12)]
    const on = (t = 0) => `${n(ax + ux * t)} ${n(ay + uy * t)}`
    const bite = (t = 0) => `L ${on(t - rb)} A ${rb} ${rb} 0 0 0 ${on(t + rb)}`
    const ts = steps(k, 0.5, k - 0.5).map((i) => (i * len) / k)
    return `${ts.map(bite).join(" ")} L ${bx} ${by}`
  }
  return `M ${corners[0]?.join(" ")} ${corners.map(side).join(" ")} Z`
}

/** A postage stamp: a perforated edge framing a sun and an arch. */
const postageStamp: Draw = (p, r, fills) => {
  const sky = roleOf(fills, r)("picture", "tone-3", "highlight", "tone-1")
  const pic = quad(rect(41, 39, 159, 184))
  const cloud = (x = 0, i = 0) => circle(x, 184 - (i % 2) * 6, 16)
  const clouds = steps(6, 36, 164).map(cloud).join(" ")
  const scene = [
    tint(pic, sky) + sphere(p, 120, 82, 20, fillOf(fills, "sun", "sun")),
    cube(p, [58, 112, 62, 80, 0.6], fillOf(fills, "arch", "structure")),
    shape(p, archPath(72, 192, 34, 50), "ink") + shape(p, clouds, "cloud"),
  ].join("")
  const wave = (y = 0) => `M 86 ${y} q 10 -6 20 0 t 20 0 t 20 0 t 20 0 t 20 0`
  const mark = [44, 54, 64].map(wave).join(" ") + circle(164, 58, 22)
  const tilt = `<g transform="rotate(${n(r("tilt").between(-5, 5))} 100 126)">`
  return [
    tilt + shape(p, perforated(rect(28, 26, 172, 226), 4), "paper"),
    clipTo(p, pic, scene) + shape(p, pic, "none"),
    bar(p, 46, 199, 54) + bar(p, 132, 196, 22, 10),
    (r("postmark").chance(0.6) ? line(p, mark) : "") + "</g>",
  ].join("")
}

export const TRAVEL_MORE: Thing[] = [
  travel("parcel", "a parcel", [240, 220], parcel),
  travel("zeppelin", "a zeppelin", [340, 190], zeppelin),
  travel("sailboat", "a sailing boat", [240, 300], sailboat),
  travel("suitcase", "a suitcase", [240, 230], suitcase),
  travel("umbrella", "an umbrella", [260, 320], umbrella),
  travel("signpost", "a signpost", [260, 320], signpost),
  travel("postage-stamp", "a postage stamp", [200, 240], postageStamp),
]
