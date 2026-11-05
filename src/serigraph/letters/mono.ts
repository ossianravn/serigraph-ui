// Serigraph Mono: every glyph in one cell. Capitals and figures are the skeleton fitted to the cell; the lowercase is
// its own, on rounded-square bowls with flat-bottomed domes; the zero has two louver slots; ss01 steps the diagonals
// of 2, 7, Z and the slashes; four ornaments sit in the Private Use Area. Cap height 100, x-height 71.4% of it.
import { CHARACTERS } from "./alphabet"
import { CAPITALS } from "./capitals"
import { COMPOSED, EXTRA_LETTERS } from "./extras"
import { FIGURES } from "./figures"
import {
  ccw,
  cw,
  dot,
  frame,
  rr,
  type Def,
  type Frame,
  type Pen,
  type Skeleton,
} from "./skeleton"

/** The cell: 600 units at a cap height of 700, so 85.7 skeleton units; glyphs sit in a box inset by SB. */
export const MONO_CELL = 600 / 7
const SB = 9
const BOX = MONO_CELL - 2 * SB
export const MONO_PEN: Pen = { h: 5.4, ext: 1 }

// Lines for the lowercase: x-height, ascender and descender, as skeleton lines for the pen.
const X = 28.6
const ASC = -8.6
const DESC = 128.6

type Mono = (f: Frame & { x: number; a: number; d: number }) => string

// prettier-ignore
const LOWER: Record<string, Mono> = {
  a: ({ l, r, b, x }) => `${rr(l, x, r, b, 18)} M ${r} ${x} V ${b}`,
  b: ({ l, r, b, x, a }) => `${rr(l, x, r, b, 18)} M ${l} ${a} V ${b}`,
  c: ({ l, r, b, x }) => `M ${r} ${x} H ${l + 18} ${ccw(18)} ${l} ${x + 18} V ${b - 18} ${ccw(18)} ${l + 18} ${b} H ${r}`,
  d: ({ l, r, b, x, a }) => `${rr(l, x, r, b, 18)} M ${r} ${a} V ${b}`,
  e: ({ l, r, b, x }) => `M ${l} 64 H ${r} V ${x + 18} ${ccw(18)} ${r - 18} ${x} H ${l + 18} ${ccw(18)} ${l} ${x + 18} V ${b - 18} ${ccw(18)} ${l + 18} ${b} H ${r}`,
  f: ({ l, r, b, x, a, c }) => `M ${c - 6} ${b} V ${a + 18} ${cw(18)} ${c + 12} ${a} H ${r} M ${l} ${x} H ${r - 8}`,
  g: ({ l, r, b, x, d }) => `${rr(l, x, r, b - 6, 18)} M ${r} ${x} V ${d - 16} ${cw(16)} ${r - 16} ${d} H ${l}`,
  h: ({ l, r, b, x, a }) => { const k = (r - l) / 2; return `M ${l} ${a} V ${b} M ${l} ${b} V ${x + k} ${cw(k)} ${l + k} ${x} ${cw(k)} ${r} ${x + k} V ${b}` },
  i: ({ b, x, c }) => `M ${c - 16} ${x} H ${c} V ${b} M ${c - 18} ${b} H ${c + 18} ${dot(c, x - 18)}`,
  j: ({ l, x, c, d }) => `M ${c - 12} ${x} H ${c + 8} V ${d - 16} ${cw(16)} ${c - 8} ${d} H ${l} ${dot(c + 8, x - 18)}`,
  k: ({ l, r, b, x, a }) => `M ${l} ${a} V ${b} M ${r} ${x} L ${l + 2} 72 M ${l + 18} 62 L ${r} ${b}`,
  l: ({ b, a, c }) => `M ${c - 16} ${a} H ${c} V ${b} M ${c - 18} ${b} H ${c + 18}`,
  m: ({ l, r, b, x, c }) => {
    const k = (c - l) / 2
    return `M ${l} ${x} V ${b} M ${l} ${b} V ${x + k} ${cw(k)} ${l + k} ${x} ${cw(k)} ${c} ${x + k} V ${b} M ${c} ${x + k} ${cw(k)} ${c + k} ${x} ${cw(k)} ${r} ${x + k} V ${b}`
  },
  n: ({ l, r, b, x }) => { const k = (r - l) / 2; return `M ${l} ${x} V ${b} M ${l} ${b} V ${x + k} ${cw(k)} ${l + k} ${x} ${cw(k)} ${r} ${x + k} V ${b}` },
  o: ({ l, r, b, x }) => rr(l, x, r, b, 20),
  p: ({ l, r, b, x, d }) => `${rr(l, x, r, b, 18)} M ${l} ${x} V ${d}`,
  q: ({ l, r, b, x, d }) => `${rr(l, x, r, b, 18)} M ${r} ${x} V ${d}`,
  r: ({ l, r, b, x }) => `M ${l} ${x} V ${b} M ${l} ${b} V ${x + 20} ${cw(20)} ${l + 20} ${x} H ${r - 4}`,
  s: ({ l, r, b, x }) => {
    const m = (x + b) / 2
    const [k1, k2] = [(m - x) / 2, (b - m) / 2]
    return `M ${r} ${x} H ${l + k1} ${ccw(k1)} ${l} ${x + k1} ${ccw(k1)} ${l + k1} ${m} H ${r - k2} ${cw(k2)} ${r} ${m + k2} ${cw(k2)} ${r - k2} ${b} H ${l}`
  },
  t: ({ r, b, x, c, l }) => `M ${c - 8} ${x - 24} V ${b - 16} ${ccw(16)} ${c + 8} ${b} H ${r} M ${l} ${x} H ${r - 8}`,
  u: ({ l, r, b, x }) => { const k = (r - l) / 2; return `M ${l} ${x} V ${b - k} ${ccw(k)} ${l + k} ${b} ${ccw(k)} ${r} ${b - k} V ${x} M ${r} ${x} V ${b}` },
  v: ({ l, r, b, x, c }) => `M ${l} ${x} L ${c - 5} ${b} H ${c + 5} L ${r} ${x}`,
  w: ({ l, r, b, x, c }) => `M ${l} ${x} V ${b - 16} ${ccw(16)} ${l + 16} ${b} H ${r - 16} ${ccw(16)} ${r} ${b - 16} V ${x} M ${c} ${x + 12} V ${b}`,
  x: ({ l, r, b, x }) => `M ${l} ${x} L ${r} ${b} M ${r} ${x} L ${l} ${b}`,
  y: ({ l, r, b, x, d }) => `M ${l} ${x} V ${b - 16} ${ccw(16)} ${l + 16} ${b} H ${r} M ${r} ${x} V ${d - 16} ${cw(16)} ${r - 16} ${d} H ${l}`,
  z: ({ l, r, b, x }) => `M ${l} ${x} H ${r} L ${l} ${b} H ${r}`,
}

// prettier-ignore
const CODE: Record<string, Mono> = {
  I: ({ l, r, t, b, c }) => `M ${l + 8} ${t} H ${r - 8} M ${c} ${t} V ${b} M ${l + 8} ${b} H ${r - 8}`,
  1: ({ t, b, c }) => `M ${c - 18} 24 L ${c} ${t} V ${b} M ${c - 20} ${b} H ${c + 20}`,
  0: ({ l, r, t, b }) => `${rr(l, t, r, b, 22)} M ${l} 50 H ${l + 14} M ${r} 50 H ${r - 14}`,
  "<": ({ l, r }) => `M ${r} 42 L ${l} 64 L ${r} 86`,
  ">": ({ l, r }) => `M ${l} 42 L ${r} 64 L ${l} 86`,
  "[": ({ c }) => `M ${c + 14} -4 H ${c - 10} V 108 H ${c + 14}`,
  "]": ({ c }) => `M ${c - 14} -4 H ${c + 10} V 108 H ${c - 14}`,
  "{": ({ c }) => `M ${c + 14} -4 H ${c} V 44 L ${c - 14} 52 L ${c} 60 V 108 H ${c + 14}`,
  "}": ({ c }) => `M ${c - 14} -4 H ${c} V 44 L ${c + 14} 52 L ${c} 60 V 108 H ${c - 14}`,
  "\\": ({ l, r }) => `M ${l} -6 L ${r} 106`,
  "/": ({ l, r }) => `M ${r} -6 L ${l} 106`,
  "^": ({ l, r, c }) => `M ${l + 6} 40 L ${c} 12 L ${r - 6} 40`,
  _: ({ l, r }) => `M ${l} 112 H ${r}`,
  "`": ({ c }) => `M ${c - 7} 2 L ${c + 6} 18`,
  "|": ({ c }) => `M ${c} -10 V 112`,
  "~": ({ l, r }) => `M ${l} 62 L ${l + 16} 50 L ${r - 16} 70 L ${r} 58`,
}

/** ss01: the diagonals of 2, 7, Z and the slashes as three-step staircases. */
// prettier-ignore
export const STEPPED: Record<string, Mono> = {
  "2": ({ l, r, t, b }) => `M ${l} ${t} H ${r} V 36 H ${(l + r) / 2} V 66 H ${l} V ${b} H ${r}`,
  "7": ({ l, r, t, b }) => { const s = (r - l) / 3; return `M ${l} ${t} H ${r} V 36 H ${r - s} V 66 H ${r - 2 * s} V ${b}` },
  Z: ({ l, r, t, b }) => `M ${l} ${t} H ${r} V 36 H ${(l + r) / 2} V 66 H ${l} V ${b} H ${r}`,
  "/": ({ l, r, t, b }) => { const s = (r - l) / 3; return `M ${l} ${b} V 66 H ${l + s} V 36 H ${l + 2 * s} V ${t} H ${r}` },
  "\\": ({ l, r, t, b }) => { const s = (r - l) / 3; return `M ${l} ${t} H ${l + s} V 36 H ${l + 2 * s} V 66 H ${r} V ${b}` },
}

/** The four ornaments, in the Private Use Area: sparkle, double ring, louvers and a cloud tile. */
export const ORNAMENTS: Record<string, string> = {
  "": "sparkle",
  "": "rings",
  "": "louvers",
  "": "cloud",
}
// prettier-ignore
const ORNAMENT: Record<string, Mono> = {
  sparkle: ({ c }) => `M ${c} 6 A 40 40 0 0 0 ${c + 34} 46 A 40 40 0 0 0 ${c} 86 A 40 40 0 0 0 ${c - 34} 46 A 40 40 0 0 0 ${c} 6 Z`,
  rings: ({ c }) => `M ${c - 30} 50 A 30 30 0 1 1 ${c + 30} 50 A 30 30 0 1 1 ${c - 30} 50 Z M ${c - 14} 50 A 14 14 0 1 1 ${c + 14} 50 A 14 14 0 1 1 ${c - 14} 50 Z`,
  louvers: ({ l, r }) => `M ${l} 36 H ${r} M ${l} 60 H ${r} M ${l} 84 H ${r}`,
  cloud: () => {
    // Open at both cell edges, so a run of tiles makes one bank: three puffs over a flat baseline.
    const [w, k] = [MONO_CELL, MONO_CELL / 6]
    return `M ${-SB} 96 H ${w - SB} M ${-SB} 60 A ${k} ${k} 0 0 1 ${-SB + 2 * k} 60 A ${k * 1.3} ${k * 1.3} 0 0 1 ${-SB + 4 * k} 60 A ${k} ${k} 0 0 1 ${w - SB} 60`
  },
}

const cellFrame = (p: Pen) => {
  const f = frame(BOX - 2 * p.h, p)
  return { ...f, x: X + p.h, a: ASC + p.h, d: DESC - p.h }
}
/** A skeleton definition fitted to the cell: its span stretched or squeezed, centred when it is narrow. */
function fit([span, draw]: Def, p: Pen): Skeleton {
  const inner = BOX - 2 * p.h
  if (span >= 30) {
    const f = frame(span, { ...p, ext: inner / span })
    return { ...draw(f), w: BOX, inl: [] }
  }
  const f = frame(span, p)
  const g = draw(f)
  const dx = (BOX - f.w) / 2
  const shift = (d?: string) => d && shiftX(d, dx)
  return { ...g, d: shiftX(g.d, dx), marks: shift(g.marks), w: BOX, inl: [] }
}
/** Move every x in M, L, H and A commands of a path by dx. */
function shiftX(d: string, dx: number) {
  return d.replace(/([MLHA])([^MLHVAZ]*)/g, (_, cmd: string, args: string) => {
    const n = args
      .trim()
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(Number)
    if (cmd === "H") return `H ${n[0]! + dx} `
    if (cmd === "A")
      return `A ${n.slice(0, 5).join(" ")} ${n[5]! + dx} ${n[6]} `
    const out: number[] = []
    for (let i = 0; i < n.length; i += 2) out.push(n[i]! + dx, n[i + 1]!)
    return `${cmd} ${out.join(" ")} `
  })
}

/** Every mono glyph: [char, skeleton, ink right to the cell's edges]. */
export function monoAlphabet(p: Pen = MONO_PEN) {
  const f = cellFrame(p)
  const out: Record<string, Skeleton & { bleed?: boolean }> = {}
  const own = (fn: Mono): Skeleton => ({ w: BOX, d: fn(f), inl: [] })
  const defs: Record<string, Def> = {
    ...CAPITALS,
    ...FIGURES,
    ...EXTRA_LETTERS,
  }
  for (const c of CHARACTERS) {
    if (c in COMPOSED || c === " ") continue
    out[c] = CODE[c] ? own(CODE[c]) : fit(defs[c]!, p)
  }
  for (const [c, draw] of Object.entries(LOWER)) out[c] = own(draw)
  for (const [c, draw] of Object.entries(CODE)) out[c] = own(draw)
  for (const [c, name] of Object.entries(ORNAMENTS))
    out[c] = { ...own(ORNAMENT[name]!), bleed: name === "cloud" }
  const stepped = Object.fromEntries(
    Object.entries(STEPPED).map(([c, draw]) => [c, own(draw)]),
  )
  return { glyphs: out, stepped, box: BOX, sb: SB, x: X }
}
