// The mottle as periodic gradient noise, drawn straight into pixels: an SVG feTurbulence tile only repeats without a
// seam where the renderer honours stitchTiles, and sharp's does not. The lattice wraps at the tile's size, so every
// octave (and their sum) tiles exactly. Returns raw RGBA for sharp: a flat tint whose alpha follows the noise.
import { prng } from "./layers.mjs"

const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10)

/** One octave: `cells` lattice cells across a `size`-pixel tile, gradients at the corners wrapping at the edge. */
function octave(size, cells, random) {
  const angles = Array.from(
    { length: cells * cells },
    () => random() * Math.PI * 2,
  )
  const grad = (i, j) => angles[(j % cells) * cells + (i % cells)]
  const out = new Float32Array(size * size)
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const fx = (x / size) * cells
      const fy = (y / size) * cells
      const i = Math.floor(fx)
      const j = Math.floor(fy)
      const u = fx - i
      const v = fy - j
      const dot = (ci, cj, dx, dy) => {
        const a = grad(ci, cj)
        return Math.cos(a) * dx + Math.sin(a) * dy
      }
      const n00 = dot(i, j, u, v)
      const n10 = dot(i + 1, j, u - 1, v)
      const n01 = dot(i, j + 1, u, v - 1)
      const n11 = dot(i + 1, j + 1, u - 1, v - 1)
      const sx = fade(u)
      const sy = fade(v)
      out[y * size + x] =
        (n00 * (1 - sx) + n10 * sx) * (1 - sy) +
        (n01 * (1 - sx) + n11 * sx) * sy
    }
  return out
}

/** Fractal noise of `octaves` octaves from `cells` across, tinted `rgb` (0–1) at alpha = mean + spread × noise. */
export function mottle(size, cells, octaves, seed, rgb, mean, spread) {
  const random = prng(seed)
  const sum = new Float32Array(size * size)
  let total = 0
  for (let o = 0; o < octaves; o++) {
    const amp = 0.5 ** o
    const layer = octave(size, cells * 2 ** o, random)
    for (let k = 0; k < sum.length; k++) sum[k] += layer[k] * amp
    total += amp
  }
  let sq = 0
  for (const n of sum) sq += (n / total) ** 2
  const sd = Math.sqrt(sq / sum.length)
  const raw = Buffer.alloc(size * size * 4)
  for (let k = 0; k < sum.length; k++) {
    const alpha = Math.min(
      1,
      Math.max(0, mean + (spread * sum[k]) / total / sd),
    )
    raw[k * 4] = Math.round(rgb[0] * 255)
    raw[k * 4 + 1] = Math.round(rgb[1] * 255)
    raw[k * 4 + 2] = Math.round(rgb[2] * 255)
    raw[k * 4 + 3] = Math.round(alpha * 255)
  }
  return raw
}
