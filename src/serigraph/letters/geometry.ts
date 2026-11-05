// Serigraph's skeleton alphabet: every capital and figure as centre lines at cap height 100 (y down from the cap line,
// a glyph from x = 0 to its width), swept by a square pen. Serigraph Display sweeps it with a heavy pen and draws an
// inline beside each left stem; Serigraph Sans sweeps it with a light pen and a wider span. tools/fonts builds the
// fonts from it; the static specimen's lettering.js is its prototype. Framework-free: no React, no DOM.

/** A pen: half its width (h) and how much wider than Display's the letters are set (ext, 1 for Display). */
export interface Pen {
  h: number
  ext: number
}

/** One inline: a straight line [x1, y1, x2, y2] beside a stem. */
export type Inline = [number, number, number, number]

export interface Skeleton {
  /** The glyph's width; the pen's ink stays inside 0..w (diagonals are cut by the box when clip is set). */
  w: number
  /** Centre lines as SVG path data: M, L, H, V, A and Z. */
  d: string
  /** Strokes drawn with the lighter mark pen (accents, bars). */
  marks?: string
  /** Inlines beside the left stems (Display only). */
  inl: Inline[]
  /** Diagonals run past the box and are cut flat by it. */
  clip?: boolean
}

/** Geometry a glyph is drawn in: left and right skeleton lines, width, top and bottom lines, centre, half-pen. */
export interface Frame {
  l: number
  r: number
  w: number
  t: number
  b: number
  c: number
  h: number
}

type Draw = (f: Frame) => Omit<Skeleton, "w">
/** [inner span between the skeleton lines at ext 1, drawing]. */
export type Def = [number, Draw]

export const cw = (k: number) => `A ${k} ${k} 0 0 1`
export const ccw = (k: number) => `A ${k} ${k} 0 0 0`
/** An inline beside a vertical stem at x, from y1 to y2, a little toward the outer edge. */
export const v = (f: Frame, x: number, y1: number, y2: number): Inline => [
  x - f.h * 0.38,
  y1,
  x - f.h * 0.38,
  y2,
]
/** An inline beside a diagonal from (x1, y1) to (x2, y2), over fractions f0..f1 of it, on its outer (left) side. */
export function diag(
  f: Frame,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  f0: number,
  f1: number,
): Inline {
  const [dx, dy] = [x2 - x1, y2 - y1]
  const len = Math.hypot(dx, dy)
  const [ox, oy] = [(-dy / len) * f.h * 0.38, (dx / len) * f.h * 0.38]
  return [
    x1 + dx * f0 + ox,
    y1 + dy * f0 + oy,
    x1 + dx * f1 + ox,
    y1 + dy * f1 + oy,
  ]
}
/** A closed rounded rectangle. */
export const rr = (x0: number, y0: number, x1: number, y1: number, k: number) =>
  `M ${x0 + k} ${y0} H ${x1 - k} ${cw(k)} ${x1} ${y0 + k} V ${y1 - k} ${cw(k)} ${x1 - k} ${y1} ` +
  `H ${x0 + k} ${cw(k)} ${x0} ${y1 - k} V ${y0 + k} ${cw(k)} ${x0 + k} ${y0} Z`
/** A dot at (x, y): a zero-length stroke the square pen turns into a square. */
export const dot = (x: number, y: number) => `M ${x} ${y - 0.01} V ${y}`
/** A round dot: a tight ring the pen fills. */
export const disc = (x: number, y: number, k = 4) =>
  `M ${x - k} ${y} A ${k} ${k} 0 1 1 ${x + k} ${y} A ${k} ${k} 0 1 1 ${x - k} ${y} Z`

/** The frame for a glyph of inner span `span` drawn with pen p. */
export function frame(span: number, p: Pen): Frame {
  const w = span * p.ext + 2 * p.h
  return { l: p.h, r: w - p.h, w, t: p.h, b: 100 - p.h, c: w / 2, h: p.h }
}

/** Draw a definition with a pen. */
export function draw([span, fn]: Def, p: Pen): Skeleton {
  const f = frame(span, p)
  return { w: f.w, ...fn(f) }
}
