// One font file from a glyph set: outlines as cubic curves (CFF), the cmap, class kerning as a GPOS table, optional
// superior capitals behind an `ordn` feature, line metrics from the design, and the OTF and WOFF2 bytes. Fonts built
// from the same set and the same advances shape a string identically, so layered fonts line up. From Fineliner.
import opentype from "opentype.js"
import wawoff2 from "wawoff2"
import { fitClosed } from "./fit.mjs"
import { kerning } from "./kerning.mjs"
import { addTable, getTable } from "./sfnt.mjs"

export const glyphName = (c) =>
  `uni${c.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}`

const area = (ring) => {
  let s = 0
  for (let i = 0; i < ring.length - 1; i++)
    s += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1]
  return s / 2
}

/**
 * A MultiPolygon in skeleton units (y down, cap line at 0, baseline at 100) as an opentype.Path in font units:
 * x × scale + dx, y flipped so the baseline sits at 0 and the cap line at 100 × scale. Outer contours wind
 * counter-clockwise and holes clockwise, as CFF expects; each is fitted with cubic curves.
 */
export function toPath(shape, scale, dx) {
  const path = new opentype.Path()
  for (const polygon of shape)
    polygon.forEach((ring, k) => {
      let pts = ring
        .slice(0, -1)
        .map(([x, y]) => [x * scale + dx, (100 - y) * scale])
      if (pts.length < 3) return
      const ccw = area([...pts, pts[0]]) > 0
      if ((k === 0) !== ccw) pts = pts.reverse()
      // The fitter measures its error only at the points, so a long straight side with no points along it can
      // bulge: put points every 8 units along every edge first (corners stay corners).
      pts = pts.flatMap((p, i) => {
        const q = pts[(i + 1) % pts.length]
        const steps = Math.max(
          1,
          Math.ceil(Math.hypot(q[0] - p[0], q[1] - p[1]) / 8),
        )
        return Array.from({ length: steps }, (_, s) => [
          p[0] + ((q[0] - p[0]) * s) / steps,
          p[1] + ((q[1] - p[1]) * s) / steps,
        ])
      })
      const [start, ...segments] = fitClosed(pts, 0.8, 32)
      path.moveTo(...start)
      for (const [c1, c2, p] of segments) path.curveTo(...c1, ...c2, ...p)
      path.close()
    })
  return path
}

/**
 * spec: { family, postScript, style: { name, weight }, description, glyphs: [{ char, codes, advance, path, base }],
 *   space, ascender, descender, capHeight, xHeight, superiors?: [{ char, path, advance }], kern?: boolean }
 */
export async function buildFont(spec) {
  const glyphs = [
    new opentype.Glyph({
      name: ".notdef",
      advanceWidth: 500,
      path: new opentype.Path(),
    }),
    new opentype.Glyph({
      name: "space",
      unicodes: [32, 160],
      advanceWidth: spec.space,
      path: new opentype.Path(),
    }),
  ]
  const ids = new Map()
  for (const g of spec.glyphs) {
    ids.set(g.char, glyphs.length)
    glyphs.push(
      new opentype.Glyph({
        name: glyphName(g.char),
        unicodes: [...g.codes],
        advanceWidth: g.advance,
        path: g.path,
      }),
    )
  }
  const superiors = new Map()
  for (const s of spec.superiors ?? []) {
    superiors.set(s.char, glyphs.length)
    glyphs.push(
      new opentype.Glyph({
        name: `${glyphName(s.char)}.sups`,
        advanceWidth: s.advance,
        path: s.path,
      }),
    )
  }

  const font = new opentype.Font({
    familyName: spec.family,
    styleName: spec.style.name,
    postScriptName: `${spec.postScript}-${spec.style.name.replace(/ /g, "")}`,
    // A fixed date, so the same sources always build the same bytes.
    createdTimestamp: Date.UTC(2026, 10, 5) / 1000,
    fullName: `${spec.family} ${spec.style.name}`,
    unitsPerEm: 1000,
    ascender: spec.ascender,
    descender: spec.descender,
    designer: "Serigraph",
    manufacturer: "Serigraph",
    manufacturerURL: "https://github.com/ossianravn/serigraph-ui",
    version: "0.1",
    description: spec.description,
    license: "MIT License",
    licenseURL: "https://github.com/ossianravn/serigraph-ui/blob/main/LICENSE",
    glyphs,
  })

  if (superiors.size) ordinals(font, ids, superiors, spec)

  let otf = new Uint8Array(font.toArrayBuffer())
  if (spec.kern !== false)
    otf = addTable(otf, "GPOS", kerning(spec.glyphs, ids))
  // Line metrics from the design, not from the tallest glyph, and USE_TYPO_METRICS so Windows places the baseline
  // by them; cap and x-height for CSS `cap` units and font-size-adjust.
  const os2 = getTable(otf, "OS/2")
  const view = new DataView(os2.buffer)
  view.setUint16(4, spec.style.weight)
  view.setUint16(
    62,
    (view.getUint16(62) & ~0x61) |
      0x80 |
      (spec.style.weight >= 700 ? 0x20 : 0x40),
  )
  view.setUint16(74, spec.ascender)
  view.setUint16(76, -spec.descender)
  if (os2.length >= 90) {
    view.setInt16(86, spec.xHeight)
    view.setInt16(88, spec.capHeight)
  }
  otf = addTable(otf, "OS/2", os2)
  if (spec.style.weight >= 700) {
    const head = getTable(otf, "head")
    new DataView(head.buffer).setUint16(44, 1)
    otf = addTable(otf, "head", head)
  }
  // wawoff2 returns a view into its WebAssembly heap, which the next compress overwrites: keep a copy.
  return { otf, woff2: Uint8Array.from(await wawoff2.compress(otf)) }
}

/** `ordn`: capitals (and their lowercase) after a figure or a superior become superiors, for 1ST, 2ND, 15TH. */
function ordinals(font, ids, superiors, spec) {
  const from = [...superiors.keys()]
    .map((c) => ids.get(c))
    .filter((g) => g !== undefined)
  const to = [...superiors.values()]
  const figures = [..."0123456789"]
    .map((c) => ids.get(c))
    .filter((g) => g !== undefined)
  const coverage = (glyphs) => ({ format: 1, glyphs })
  const order = from.map((g, i) => [g, to[i]]).sort((a, b) => a[0] - b[0])
  const langSys = { reserved: 0, reqFeatureIndex: 0xffff, featureIndexes: [0] }
  font.tables.gsub = {
    version: 1,
    scripts: ["DFLT", "latn"].map((tag) => ({
      tag,
      script: { defaultLangSys: langSys, langSysRecords: [] },
    })),
    features: [
      { tag: "ordn", feature: { featureParams: 0, lookupListIndexes: [1] } },
    ],
    lookups: [
      {
        lookupType: 1,
        lookupFlag: 0,
        subtables: [
          {
            substFormat: 2,
            coverage: coverage(order.map(([g]) => g)),
            substitute: order.map(([, s]) => s),
          },
        ],
      },
      {
        lookupType: 6,
        lookupFlag: 0,
        subtables: [
          {
            substFormat: 3,
            backtrackCoverage: [
              coverage([...figures, ...to].sort((a, b) => a - b)),
            ],
            inputCoverage: [coverage(order.map(([g]) => g))],
            lookaheadCoverage: [],
            lookupRecords: [{ sequenceIndex: 0, lookupListIndex: 0 }],
          },
        ],
      },
    ],
  }
  void spec
}

/** An @font-face rule for a font file served from the site's /fonts. */
export const fontFace = (family, file, weight = 400) => `@font-face {
  font-family: "${family}";
  font-style: normal;
  font-weight: ${weight};
  font-display: swap;
  src: url("/fonts/${file}.woff2") format("woff2");
}
`
