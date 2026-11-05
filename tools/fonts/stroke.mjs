// Skeletons to shapes: SVG path data (M, L, H, V, A, Z; circular arcs) flattened to polylines, then swept by a square
// pen with Clipper's offsetter: mitred joins (squared past a mitre limit of 2, as the specimen's SVG bevelled them),
// square caps at open ends, closed paths stroked on both sides, everything unioned into one shape. Glyphs whose
// diagonals run past their box are intersected with it. Clipper works in integers, so coordinates are scaled by
// 1000; polygon-clipping, tried first, failed on the slivers that flattened arcs make. Skeleton units: cap height
// 100, y down.
import ClipperLib from "clipper-lib"

const sub = (a, b) => [a[0] - b[0], a[1] - b[1]]
const add = (a, b) => [a[0] + b[0], a[1] + b[1]]
const mul = (a, f) => [a[0] * f, a[1] * f]
const len = (a) => Math.hypot(a[0], a[1])
const unit = (a) => mul(a, 1 / (len(a) || 1))
const normal = (u) => [-u[1], u[0]]

/** Points along a circular arc from p0 to p1 (SVG endpoint form), every `step` degrees. */
function arc(p0, r, large, sweep, p1, step = 3) {
  const d = sub(p1, p0)
  const half = len(d) / 2
  if (half < 1e-9) return []
  const rr = Math.max(r, half)
  const mid = mul(add(p0, p1), 0.5)
  const h = Math.sqrt(Math.max(0, rr * rr - half * half))
  const n = normal(unit(d))
  const sign = large === sweep ? -1 : 1
  const c = add(mid, mul(n, sign * h))
  const a0 = Math.atan2(p0[1] - c[1], p0[0] - c[0])
  let a1 = Math.atan2(p1[1] - c[1], p1[0] - c[0])
  // sweep 1 runs clockwise on screen (y down), which is increasing angle here.
  if (sweep && a1 < a0) a1 += Math.PI * 2
  if (!sweep && a1 > a0) a1 -= Math.PI * 2
  const count = Math.max(
    2,
    Math.ceil(Math.abs(a1 - a0) / ((step * Math.PI) / 180)),
  )
  return Array.from({ length: count }, (_, i) => {
    const a = a0 + ((a1 - a0) * (i + 1)) / count
    return [c[0] + rr * Math.cos(a), c[1] + rr * Math.sin(a)]
  })
}

/** SVG path data to subpaths: { pts, closed }. */
export function subpaths(d) {
  const tokens = String(d).match(/[MLHVAZ]|-?\d*\.?\d+(?:e-?\d+)?/gi) ?? []
  const out = []
  let cur = null
  let p = [0, 0]
  let i = 0
  const num = () => Number(tokens[i++])
  while (i < tokens.length) {
    const cmd = tokens[i++].toUpperCase()
    if (cmd === "M") {
      p = [num(), num()]
      cur = { pts: [p], closed: false }
      out.push(cur)
    } else if (cmd === "L") {
      p = [num(), num()]
      cur.pts.push(p)
    } else if (cmd === "H") {
      p = [num(), p[1]]
      cur.pts.push(p)
    } else if (cmd === "V") {
      p = [p[0], num()]
      cur.pts.push(p)
    } else if (cmd === "A") {
      const r = num()
      num() // ry: circular arcs only
      num() // rotation
      const large = num()
      const sweep = num()
      const end = [num(), num()]
      cur.pts.push(...arc(p, r, large, sweep, end))
      p = end
    } else if (cmd === "Z") {
      cur.closed = true
    }
  }
  return out.filter((s) => s.pts.length > 1)
}

const K = 1000
const {
  ClipperOffset,
  Clipper,
  JoinType,
  EndType,
  ClipType,
  PolyType,
  PolyFillType,
  PolyTree,
  Paths,
} = ClipperLib
const toInt = (pts) =>
  pts.map(([x, y]) => ({ X: Math.round(x * K), Y: Math.round(y * K) }))

/** A Clipper PolyTree as a MultiPolygon: each outer ring with its holes, islands inside holes as new polygons. */
function multipolygon(tree) {
  const out = []
  const ring = (path) => {
    const pts = path.map(({ X, Y }) => [X / K, Y / K])
    return [...pts, pts[0]]
  }
  const walk = (node) => {
    for (const outer of node.Childs()) {
      out.push([
        ring(outer.Contour()),
        ...outer.Childs().map((hole) => ring(hole.Contour())),
      ])
      for (const hole of outer.Childs()) walk(hole)
    }
  }
  walk(tree)
  return out
}

/** Paths (in Clipper integers) swept by a pen of half-width h: square ends and mitres, or round ends and joins. */
function offset(paths, h, round = false) {
  const co = new ClipperOffset(2, 0.05 * K)
  for (const { pts, closed } of paths)
    co.AddPath(
      toInt(pts),
      round ? JoinType.jtRound : JoinType.jtMiter,
      closed
        ? EndType.etClosedLine
        : round
          ? EndType.etOpenRound
          : EndType.etOpenSquare,
    )
  const solution = new Paths()
  co.Execute(solution, h * K)
  return solution
}

function combine(type, subject, clip) {
  const c = new Clipper()
  c.AddPaths(subject, PolyType.ptSubject, true)
  c.AddPaths(clip, PolyType.ptClip, true)
  const tree = new PolyTree()
  c.Execute(type, tree, PolyFillType.pftNonZero, PolyFillType.pftNonZero)
  return tree
}
const flat = (tree) => Clipper.PolyTreeToPaths(tree)

/**
 * The shape of a glyph: its strokes swept by a pen of half-width h, cut by its box [0, w] × [0, 100] when clip is
 * set, with its marks swept by a pen of half-width hm added. Returns a MultiPolygon in skeleton units.
 */
export function glyphShape(g, h, hm = h * 0.62) {
  let body = offset(subpaths(g.d), h)
  if (g.clip)
    body = flat(
      combine(ClipType.ctIntersection, body, [
        toInt([
          [0, 0],
          [g.w, 0],
          [g.w, 100],
          [0, 100],
        ]),
      ]),
    )
  const marks = g.marks ? offset(subpaths(g.marks), hm) : []
  return multipolygon(combine(ClipType.ctUnion, body, marks))
}

/** The inlines of a glyph as round-ended strokes of half-width hi. */
export function inlineShape(g, hi) {
  const lines = g.inl.map(([x1, y1, x2, y2]) => ({
    pts: [
      [x1, y1],
      [x2, y2],
    ],
    closed: false,
  }))
  return multipolygon(combine(ClipType.ctUnion, offset(lines, hi, true), []))
}
