// A share image as a 1200 × 630 SVG, printed like the site: a paper mat round a canvas in the Sky colourway, the
// title lettered in Serigraph Display (paper inside an ink outline, the inline laid over it), a kicker in the
// extended capitals, and a city of follies from the page's seed across the foot. Text is drawn as outlines from the
// font files and every colour is resolved to a flat value, so a rasteriser needs no fonts and no CSS.
import fs from "node:fs"
import path from "node:path"
import opentype from "opentype.js"
import { folly } from "@/serigraph/follies"
import { builtInColourways, mix, rgbOf, type Pigment } from "@/site/studio/ink"

const W = 1200
const H = 630
const MAT = 24

const font = (file: string) => {
  const bytes = fs.readFileSync(path.join(process.cwd(), "public/fonts", file))
  return opentype.parse(
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
  )
}
const DISPLAY = font("serigraph-display.otf")
const INLINE = font("serigraph-display-inline.otf")
const SANS = font("serigraph-sans-bold.otf")

const hex = (rgb: number[]) =>
  `#${rgb.map((c) => c.toString(16).padStart(2, "0")).join("")}`

/** Every `var(--role)` and `color-mix(in oklab, …)` in an SVG string, resolved to the colourway's flat colours. */
function resolve(svg: string, colourway = "sky") {
  const roles = builtInColourways()[colourway] ?? {}
  const token = (name: string): string => {
    if (name === "text" || name === "on-canvas" || name === "edge")
      return token(roles["on-canvas"] ?? "ink")
    if (name === "walk")
      return hex(mix(rgbOf(roles.structure as Pigment), rgbOf("paper"), 0.42))
    if (name === "structure-shade")
      return hex(mix(rgbOf(roles.structure as Pigment), rgbOf("ink"), 0.88))
    const spot = roles[name] ?? name
    return hex(rgbOf(spot as Pigment))
  }
  let out = svg.replace(
    /var\(--([\w-]+)(?:, ?var\(--[\w-]+\))?\)/g,
    (_, name) => token(name),
  )
  out = out.replace(
    /color-mix\(in oklab, (#[0-9a-f]{6}) (\d+)%, (#[0-9a-f]{6})\)/g,
    (_, a, p, b) => {
      const rgb = (h: string) =>
        [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16)) as [
          number,
          number,
          number,
        ]
      return hex(mix(rgb(a), rgb(b), Number(p) / 100))
    },
  )
  return out
}

/** The title as lettering: paper inside an ink outline, the inline over it, sized to fit `width`. */
function lettering(text: string, x: number, baseline: number, width: number) {
  let size = 150
  while (size > 64 && DISPLAY.getAdvanceWidth(text, size) > width) size -= 4
  const d = DISPLAY.getPath(text, x, baseline, size).toPathData(2)
  const inline = INLINE.getPath(text, x, baseline, size).toPathData(2)
  const stroke = Math.max(3, size * 0.022)
  return (
    `<path d="${d}" fill="#eae3c8" stroke="#262420" stroke-width="${stroke}" stroke-linejoin="round" paint-order="stroke fill"/>` +
    `<path d="${inline}" fill="#262420"/>`
  )
}

export function shareImage({
  title,
  kicker,
  seed,
}: {
  title: string
  kicker: string
  seed: string
}) {
  const [cx, cy, cw, ch] = [MAT, MAT, W - 2 * MAT, H - 2 * MAT]
  const canvas = hex(
    rgbOf((builtInColourways().sky?.canvas ?? "sky") as Pigment),
  )
  const city = resolve(folly({ template: "city", seed }))
    .replace(/^<svg /, `<svg x="${cx}" y="${cy + 60}" `)
    .replace(
      / width="100%" height="100%"/,
      ` width="${cw}" height="${ch - 60}"`,
    )
  // The capitals are tracked by hand: each glyph set at its advance plus a tenth of the size.
  let kx = cx + 56
  let kick = ""
  for (const char of kicker.toUpperCase()) {
    kick += SANS.getPath(char, kx, cy + 76, 24).toPathData(2)
    kx += SANS.getAdvanceWidth(char, 24) + 2.4
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="#eae3c8"/>
<clipPath id="og-canvas"><rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="26"/></clipPath>
<g clip-path="url(#og-canvas)"><rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" fill="${canvas}"/>${city}</g>
<rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="26" fill="none" stroke="#262420" stroke-width="2"/>
<path d="${kick}" fill="#262420"/>
${lettering(title, cx + 52, cy + 200, cw - 112)}
</svg>`
}
