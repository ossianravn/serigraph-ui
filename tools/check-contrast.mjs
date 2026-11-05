// Checks the text on every surface in every colourway, with the printed grain composited in: for each surface it
// stacks the grain layers at their own tile sizes over the surface colour, blurs to about a glyph so single specks
// average out, and measures the text colour against the darkest and lightest 1% of the result. Text needs 4.5:1.
// Ink is the text on every bright surface (planes, tones, action, highlight, clouds, fields, the pressed shade);
// on Night's canvas the text is paper. Disabled text is exempt (WCAG 1.4.3). Exits 1 if any pair falls short.
// Ported from Fineliner's checker (which came from Patina UI).
//
//   npm run check:contrast
import { readFileSync } from "node:fs"
import sharp from "sharp"

const STYLES = new URL("../src/serigraph/styles/", import.meta.url)
const sources = ["tokens.css", "colourways.css", "textures.generated.css"].map(
  (f) => readFileSync(new URL(f, STYLES), "utf8"),
)
const COLOURWAYS = ["sky", "pistachio", "coral", "marigold", "night"]
const GRAIN = { specks: 541, flecks: 613, tooth: 353, mottle: 1201 }
const CANVAS = 1201

// Top-level rules, in source order.
function rules(source) {
  const out = []
  const text = source.replace(/\/\*[\s\S]*?\*\//g, "")
  let i = 0
  while (i < text.length) {
    const open = text.indexOf("{", i)
    if (open < 0) break
    const selector = text.slice(i, open).trim()
    let depth = 1
    let j = open + 1
    while (depth && j < text.length)
      ((depth += text[j] === "{" ? 1 : text[j] === "}" ? -1 : 0), j++)
    if (!selector.startsWith("@")) {
      const decls = Object.fromEntries(
        [
          ...text
            .slice(open + 1, j - 1)
            .matchAll(/(--[\w-]+)\s*:\s*((?:url\("[^"]*"\)|[^;])+);/g),
        ].map((m) => [m[1], m[2].trim()]),
      )
      out.push({ selectors: selector.split(",").map((s) => s.trim()), decls })
    }
    i = j
  }
  return out
}
const all = sources.flatMap(rules)

/** Does a selector apply to <html data-colourway=c> with every other setting at its default? */
const applies = (selector, c) =>
  selector === ":root" ||
  selector === "[data-colourway]" ||
  selector === `[data-colourway="${c}"]`

function tokens(c) {
  const vars = {}
  for (const rule of all)
    if (rule.selectors.some((s) => applies(s, c)))
      Object.assign(vars, rule.decls)
  const resolve = (value, seen = 0) => {
    if (seen > 20) throw new Error(`var() loop in ${value}`)
    return value.replace(/var\((--[\w-]+)\)/g, (_, name) =>
      resolve(vars[name] ?? "", seen + 1),
    )
  }
  return (name) => colour(resolve(vars[`--${name}`] ?? ""))
}

// Colours: hex, or color-mix(in oklab, A p%, B), evaluated as the browser does, to sRGB 0-255.
const hex = (h) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16))
const lin = (c) =>
  (c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
const gam = (c) =>
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
function toOklab(rgb) {
  const [r, g, b] = rgb.map(lin)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}
function fromOklab([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map(gam)
}
function colour(value) {
  const v = value.trim()
  if (v.startsWith("#")) return hex(v)
  const mix = v.match(/^color-mix\(in oklab,\s*(.+?)\s+([\d.]+)%,\s*(.+)\)$/)
  if (!mix) throw new Error(`cannot read colour ${v}`)
  const [a, b] = [toOklab(colour(mix[1])), toOklab(colour(mix[3]))]
  const p = Number(mix[2]) / 100
  return fromOklab(a.map((x, i) => x * p + b[i] * (1 - p)))
}
const channel = (c) =>
  (c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
const luminance = ([r, g, b]) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)

// The grain tiles, rendered once.
const grainVars = Object.assign(
  {},
  ...all.filter((r) => r.selectors.includes(":root")).map((r) => r.decls),
)
const svgOf = (url) =>
  Buffer.from(
    decodeURIComponent(
      url.replace(/^url\("data:image\/svg\+xml;utf8,/, "").replace(/"\)$/, ""),
    ),
  )
const overlays = []
for (const [name, size] of Object.entries(GRAIN).reverse()) {
  const side = Math.min(size, CANVAS)
  const png = await sharp(svgOf(grainVars[`--tex-${name}`]))
    .resize(size, size)
    .extract({ left: 0, top: 0, width: side, height: side })
    .png()
    .toBuffer()
  overlays.push({ input: png, tile: true, gravity: "northwest" })
}

const cache = new Map()
async function extremes([r, g, b]) {
  const key = `${r},${g},${b}`
  if (cache.has(key)) return cache.get(key)
  const { data, info } = await sharp({
    create: {
      width: CANVAS,
      height: CANVAS,
      channels: 3,
      background: { r, g, b },
    },
  })
    .composite(overlays)
    .blur(3)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const lum = []
  for (let p = 0; p < data.length; p += info.channels * 3)
    lum.push(luminance([data[p], data[p + 1], data[p + 2]]))
  lum.sort((x, y) => x - y)
  const out = [
    lum[Math.floor(lum.length * 0.01)],
    lum[Math.floor(lum.length * 0.99)],
  ]
  cache.set(key, out)
  return out
}

const BRIGHT = [
  "plane",
  "plane-2",
  "action",
  "highlight",
  "cloud",
  "tone-1",
  "tone-2",
  "tone-3",
  "tone-4",
  "rose",
]
const FIELDS = ["canvas", "plane", "plane-2", "cloud"]
const mixOklab = (a, b, p) =>
  fromOklab(toOklab(a).map((x, i) => x * p + toOklab(b)[i] * (1 - p)))

let failures = 0
for (const c of COLOURWAYS) {
  const t = tokens(c)
  const ink = t("ink")
  const pairs = BRIGHT.map((s) => [s, t(s), ink])
  pairs.push(["canvas", t("canvas"), t("on-canvas")])
  for (const s of FIELDS)
    pairs.push([`field on ${s}`, mixOklab(t(s), t("paper"), 0.3), ink])
  // The pressed shade prints flat (no grain), so it is measured as a flat colour.
  pairs.push(["pressed action", mixOklab(t("action"), ink, 0.92), ink, "flat"])
  const notes = []
  let min = Infinity
  for (const [name, surface, text, flat] of pairs) {
    const [dark, light] = flat
      ? [luminance(surface), luminance(surface)]
      : await extremes(surface)
    const l = luminance(text)
    const r = Math.min(ratio(l, dark), ratio(l, light))
    min = Math.min(min, r)
    if (r < 4.5) (failures++, notes.push(`${name} ${r.toFixed(2)}<4.5`))
  }
  console.log(
    `${c.padEnd(10)} ${notes.length ? `FAIL ${notes.join(", ")}` : `ok (${pairs.length} pairs, lowest ${min.toFixed(2)}:1)`}`,
  )
}
console.log(
  failures ? `\n${failures} pairs below 4.5:1` : "\nall pairs meet 4.5:1",
)
process.exit(failures ? 1 : 0)
