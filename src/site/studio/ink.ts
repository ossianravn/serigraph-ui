// The studio's colours and contrast, read from the kit's own stylesheets so they never drift: paper, ink and the spots
// from tokens.css, the five built-in colourways from colourways.css. Contrast is WCAG's, on flat colours, with mixes
// computed in OKLab as the browser does. The build's `npm run check:contrast` is stricter: it composites the printed
// grain under the text first. Colour maths ported from tools/check-contrast.mjs.
import tokensCss from "@/serigraph/styles/tokens.css?raw"
import colourwaysCss from "@/serigraph/styles/colourways.css?raw"

/** The spots a colourway may give a role. Rose is kept for destructive actions and errors. */
export const SPOTS = [
  "sky",
  "cornflower",
  "seafoam",
  "pistachio",
  "marigold",
  "coral",
  "bubblegum",
  "lilac",
  "prussian",
] as const
export type Spot = (typeof SPOTS)[number]
/** A role takes a spot; the cloud may also take paper, the brightest cloud layer. */
export type Pigment = Spot | "paper"

const HEX = Object.fromEntries(
  [...tokensCss.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})\s*;/gi)].map((m) => [
    m[1],
    m[2],
  ]),
) as Record<string, string>

/** The colour a token prints, as sRGB 0–255. */
export function rgbOf(name: Pigment | "ink"): RGB {
  const hex = HEX[name] ?? "#000000"
  return [1, 3, 5].map((k) => parseInt(hex.slice(k, k + 2), 16)) as RGB
}

type RGB = [number, number, number]

const lin = (c: number) =>
  (c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
const gam = (c: number) =>
  Math.round(
    255 *
      Math.min(
        1,
        Math.max(
          0,
          c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055,
        ),
      ),
  )

function toOklab(rgb: RGB): RGB {
  const [r, g, b] = rgb.map(lin) as RGB
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

function fromOklab([L, a, b]: RGB): RGB {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map(gam) as RGB
}

/** color-mix(in oklab, a p, b), flat. */
export function mix(a: RGB, b: RGB, p: number): RGB {
  const [x, y] = [toOklab(a), toOklab(b)]
  return fromOklab(x.map((v, i) => v * p + y[i]! * (1 - p)) as RGB)
}

const channel = (c: number) =>
  (c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
const luminance = ([r, g, b]: RGB) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)

/** WCAG contrast between two flat colours. */
export function contrast(a: RGB, b: RGB) {
  const [x, y] = [luminance(a), luminance(b)]
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

/** Each named colourway in colourways.css, as role → token name (`--canvas: var(--sky)` gives canvas: "sky"). */
export function builtInColourways() {
  const out: Record<string, Record<string, string>> = {}
  const text = colourwaysCss.replace(/\/\*[\s\S]*?\*\//g, "")
  for (const [, selector = "", body = ""] of text.matchAll(
    /([^{}]+)\{([^}]*)\}/g,
  )) {
    for (const [, name = ""] of selector.matchAll(
      /\[data-colourway="([\w-]+)"\]/g,
    )) {
      const roles = (out[name] ??= {})
      for (const [, role = "", token = ""] of body.matchAll(
        /--([\w-]+)\s*:\s*var\(--([\w-]+)\)\s*;/g,
      ))
        roles[role] = token
    }
  }
  return out
}
