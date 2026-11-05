// Kerning for the capitals, as a GPOS table (opentype.js writes none): class-based pairs (PairPos format 2), so an
// accented letter kerns as its base. Values are in font units at a cap height of 800 and scale with the face (scale
// / 8); negative closes. The arch-topped A and U-shaped W and Y have upright sides, so they need little. From Fineliner.

// The letter shapes a pair is about: what the first glyph's right side and the second glyph's left side look like.
const LEFT = {
  T: "T7",
  V: "V",
  L: "L",
  F: "FP",
  K: "KX",
  O: "OQDØ0",
  R: "R",
  dot: ".,…",
  quote: "'\"’”",
}
const RIGHT = {
  T: "T",
  V: "V",
  A: "AÆJ",
  O: "OCGQØŒ",
  dot: ".,…",
  quote: "'\"‘“",
}
// prettier-ignore
const PAIRS = {
  T: { A: -56, O: -14, dot: -90, V: 0 },
  V: { A: -40, O: -12, dot: -96, T: 0 },
  L: { T: -70, V: -56, O: -14, quote: -96 },
  F: { A: -44, dot: -100 },
  K: { O: -22 },
  O: { T: -14, V: -12, dot: -22 },
  R: { T: -18, V: -16 },
  dot: { T: -90, V: -96, quote: -70 },
  quote: { A: -60, dot: -70 },
}

const u16 = (n) => [(n >> 8) & 255, n & 255]
const i16 = (n) => u16(n < 0 ? n + 65536 : n)
const tag = (t) => [...t].map((c) => c.charCodeAt(0))

function classes(table, glyphs, ids) {
  const names = Object.keys(table)
  const byGlyph = new Map()
  for (const g of glyphs) {
    const k = names.findIndex((n) => table[n].includes(g.base ?? g.char))
    if (k >= 0) byGlyph.set(ids.get(g.char), k + 1)
  }
  return { names, byGlyph }
}

/** ClassDef format 1 over the range of classed glyphs. */
function classDef(byGlyph) {
  const gids = [...byGlyph.keys()].sort((a, b) => a - b)
  const [first, last] = [gids[0], gids[gids.length - 1]]
  const values = Array.from(
    { length: last - first + 1 },
    (_, i) => byGlyph.get(first + i) ?? 0,
  )
  return [
    ...u16(1),
    ...u16(first),
    ...u16(values.length),
    ...values.flatMap(u16),
  ]
}

/** The GPOS table's bytes: one kern feature for DFLT and latn, one class-pair lookup. glyphs carry a `scale`. */
export function kerning(glyphs, ids) {
  const left = classes(LEFT, glyphs, ids)
  const right = classes(RIGHT, glyphs, ids)
  const k = (glyphs[0]?.scale ?? 8) / 8
  const covered = [...left.byGlyph.keys()].sort((a, b) => a - b)
  const coverage = [...u16(1), ...u16(covered.length), ...covered.flatMap(u16)]
  const c1 = left.names.length + 1
  const c2 = right.names.length + 1
  const records = []
  for (let a = 0; a < c1; a++)
    for (let b = 0; b < c2; b++)
      records.push(
        ...i16(
          a && b
            ? Math.round(
                (PAIRS[left.names[a - 1]]?.[right.names[b - 1]] ?? 0) * k,
              )
            : 0,
        ),
      )
  const cd1 = classDef(left.byGlyph)
  const cd2 = classDef(right.byGlyph)
  const head = 16 + records.length
  const pairPos = [
    ...u16(2),
    ...u16(head),
    ...u16(0x0004),
    ...u16(0),
    ...u16(head + coverage.length),
    ...u16(head + coverage.length + cd1.length),
    ...u16(c1),
    ...u16(c2),
    ...records,
    ...coverage,
    ...cd1,
    ...cd2,
  ]
  const lookup = [...u16(2), ...u16(0), ...u16(1), ...u16(8), ...pairPos]
  const lookupList = [...u16(1), ...u16(4), ...lookup]
  const feature = [...u16(0), ...u16(1), ...u16(0)]
  const featureList = [...u16(1), ...tag("kern"), ...u16(8), ...feature]
  const langSys = [...u16(0), ...u16(0xffff), ...u16(1), ...u16(0)]
  const script = [...u16(4), ...u16(0), ...langSys]
  const scriptList = [
    ...u16(2),
    ...tag("DFLT"),
    ...u16(14),
    ...tag("latn"),
    ...u16(14 + script.length),
    ...script,
    ...script,
  ]
  const header = 10
  return new Uint8Array([
    ...u16(1),
    ...u16(0),
    ...u16(header),
    ...u16(header + scriptList.length),
    ...u16(header + scriptList.length + featureList.length),
    ...scriptList,
    ...featureList,
    ...lookupList,
  ])
}
