// Builds Serigraph's fonts from the kit's skeleton alphabet (src/serigraph/letters/), capitals only (lowercase sets
// the same capitals), every Latin-script European language:
//   Serigraph Display         the heavy square pen: wide, round, flat letters; set it in paper with an ink outline
//   Serigraph Display Inline  the thin line inside each left stem, to set over Display in ink
//   Serigraph Sans            the light square pen, wider: extended capitals, Regular and Bold, superiors for `ordn`
// Writes public/fonts/<file>.otf and .woff2 and the kit's styles/letters.generated.css. The same sources build the
// same bytes.
//
//   npm run build:fonts
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createJiti } from "jiti"
import { buildFont, fontFace, toPath } from "./family.mjs"
import { glyphShape, inlineShape } from "./stroke.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const jiti = createJiti(import.meta.url)
const letters = path.join(root, "src/serigraph/letters")
const { alphabet, CHARACTERS, DISPLAY_PEN } = await jiti.import(
  path.join(letters, "alphabet.ts"),
)
const { COMPOSED, SAME } = await jiti.import(path.join(letters, "extras.ts"))
const { monoAlphabet, MONO_PEN } = await jiti.import(
  path.join(letters, "mono.ts"),
)
const out = path.join(root, "public/fonts")
fs.mkdirSync(out, { recursive: true })
const kb = (bytes) => `${(bytes.length / 1024).toFixed(0)} KB`

/** The code points a glyph answers to: itself, its lowercase, and its look-alikes. */
function codesOf(char) {
  const codes = new Set([char.codePointAt(0)])
  const lower = char.toLowerCase()
  if (lower !== char && [...lower].length === 1) codes.add(lower.codePointAt(0))
  for (const [alias, glyph] of SAME)
    if (glyph === char) codes.add(alias.codePointAt(0))
  return codes
}
const drawn = CHARACTERS.filter((c) => c !== " ")

/**
 * One face: { family, file, pen, scale (font units per skeleton unit), sb (side bearing, skeleton units), weight,
 * name, layer: "body" | "inline", inline half-width, superiors, ascender, descender }.
 */
async function face(f) {
  const A = alphabet(f.pen, { inline: f.layer === "inline" })
  const hm = f.pen.h * 0.62
  const glyphs = drawn.map((char) => {
    const g = A[char]
    const shape =
      f.layer === "inline"
        ? inlineShape(g, f.inline)
        : glyphShape(g, f.pen.h, hm)
    return {
      char,
      codes: codesOf(char),
      advance: Math.round((g.w + 2 * f.sb) * f.scale),
      path: toPath(shape, f.scale, f.sb * f.scale),
      base: COMPOSED[char]?.[0] ?? char,
      scale: f.scale,
    }
  })
  // Superiors: the capitals at 55%, hanging from the cap line, for ordinals (15TH).
  const superiors = (f.superiors ? [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"] : []).map(
    (char) => {
      const g = A[char]
      const shape = glyphShape(g, f.pen.h, hm).map((poly) =>
        poly.map((ring) => ring.map(([x, y]) => [x * 0.55, y * 0.55])),
      )
      return {
        char,
        advance: Math.round((g.w * 0.55 + 2 * f.sb) * f.scale),
        path: toPath(shape, f.scale, f.sb * f.scale),
      }
    },
  )
  const { otf, woff2 } = await buildFont({
    family: f.family,
    postScript: f.family.replace(/ /g, ""),
    style: { name: f.name, weight: f.weight },
    description: f.description,
    glyphs,
    superiors,
    space: Math.round((A[" "].w + 2 * f.sb) * f.scale),
    ascender: f.ascender,
    descender: f.descender,
    capHeight: Math.round(100 * f.scale),
    xHeight: Math.round(100 * f.scale),
    kern: true,
  })
  fs.writeFileSync(path.join(out, `${f.file}.otf`), otf)
  fs.writeFileSync(path.join(out, `${f.file}.woff2`), woff2)
  console.log(
    `${f.family} ${f.name}: ${glyphs.length} glyphs, ${kb(otf)} OTF, ${kb(woff2)} WOFF2`,
  )
  return fontFace(f.family, f.file, f.weight)
}

const display = {
  pen: DISPLAY_PEN,
  scale: 8,
  sb: 5,
  ascender: 1080,
  descender: -220,
}
const SANS_EXT = 1.18
const sans = {
  scale: 7,
  sb: 6,
  ascender: 940,
  descender: -200,
  superiors: true,
}

const faces = [
  await face({
    ...display,
    family: "Serigraph Display",
    file: "serigraph-display",
    name: "Regular",
    weight: 400,
    layer: "body",
    description:
      "Serigraph Display: wide, round, flat capitals drawn by a heavy square pen.",
  }),
  await face({
    ...display,
    family: "Serigraph Display Inline",
    file: "serigraph-display-inline",
    name: "Regular",
    weight: 400,
    layer: "inline",
    inline: 1.2,
    description:
      "The inline inside Serigraph Display's left stems, to set over it.",
  }),
  await face({
    ...sans,
    pen: { h: 5.8, ext: SANS_EXT },
    family: "Serigraph Sans",
    file: "serigraph-sans",
    name: "Regular",
    weight: 400,
    layer: "body",
    description:
      "Serigraph Sans: extended capitals drawn by a light square pen.",
  }),
  await face({
    ...sans,
    pen: { h: 7.6, ext: SANS_EXT },
    family: "Serigraph Sans",
    file: "serigraph-sans-bold",
    name: "Bold",
    weight: 700,
    layer: "body",
    description:
      "Serigraph Sans Bold: extended capitals drawn by a broader square pen.",
  }),
]

// Serigraph Mono: one 600-unit cell for every glyph, its own lowercase, ss01 steps and the ornaments in the PUA.
async function mono() {
  const scale = 7
  const { glyphs: A, stepped, sb } = monoAlphabet(MONO_PEN)
  const hm = MONO_PEN.h * 0.62
  const advance = 600
  const codes = (char) => {
    const set = new Set([char.codePointAt(0)])
    for (const [alias, glyph] of SAME)
      if (glyph === char) set.add(alias.codePointAt(0))
    return set
  }
  const glyphs = Object.keys(A)
    .sort((a, b) => a.codePointAt(0) - b.codePointAt(0))
    .map((char) => ({
      char,
      codes: codes(char),
      advance,
      path: toPath(glyphShape(A[char], MONO_PEN.h, hm), scale, sb * scale),
      scale,
    }))
  const alternates = Object.entries(stepped).map(([char, g]) => ({
    char,
    advance,
    path: toPath(glyphShape(g, MONO_PEN.h, hm), scale, sb * scale),
  }))
  const { otf, woff2 } = await buildFont({
    family: "Serigraph Mono",
    postScript: "SerigraphMono",
    style: { name: "Regular", weight: 400 },
    description:
      "Serigraph Mono: rounded-square monospace with a slotted zero, stepped diagonals (ss01) and ornaments.",
    glyphs,
    alternates: { tag: "ss01", glyphs: alternates },
    space: advance,
    ascender: 900,
    descender: -220,
    capHeight: 700,
    xHeight: 500,
    kern: false,
  })
  fs.writeFileSync(path.join(out, "serigraph-mono.otf"), otf)
  fs.writeFileSync(path.join(out, "serigraph-mono.woff2"), woff2)
  console.log(
    `Serigraph Mono Regular: ${glyphs.length} glyphs, ${kb(otf)} OTF, ${kb(woff2)} WOFF2`,
  )
  return fontFace("Serigraph Mono", "serigraph-mono", 400)
}
faces.push(await mono())

const css = path.join(root, "src/serigraph/styles/letters.generated.css")
fs.writeFileSync(
  css,
  `/* Generated by tools/fonts/build.mjs from the skeleton alphabet in src/serigraph/letters. Rerun it after a change. */\n${faces.join("\n")}`,
)
console.log(`wrote ${path.relative(root, css)}`)
