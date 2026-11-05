// Seeds and small SVG helpers for the specimen. Every random choice in a drawing comes from a seed, so the same seed
// draws the same thing on every load. The seed functions are Fineliner's (from Patina, from Mental Models), unchanged.
;(function () {
  const SG = (window.SG = window.SG || {})

  /** FNV-1a over UTF-16 code units, reduced to 31 bits. */
  SG.seedOf = (text) =>
    ([...String(text)].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261) >>> 0) % 2 ** 31

  /** A small seeded PRNG (mulberry32 family) returning values in [0, 1). */
  SG.prng = (seed) => {
    let s = seed >>> 0
    return () => {
      s = (s + 0x6d2b79f5) >>> 0
      let t = s
      t = Math.imul(t ^ (t >>> 15), t | 1)
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }

  /** A labelled sub-seed: each kind of decision draws from its own fork. */
  SG.fork = (seed, label) => SG.seedOf(`${seed}:${label}`)

  /** A PRNG with helpers, drawn from a labelled fork. */
  SG.stream = (seed, label) => {
    const next = SG.prng(SG.fork(seed, label))
    return {
      next,
      between: (a, b) => a + next() * (b - a),
      int: (a, b) => Math.floor(a + next() * (b - a + 1)),
      pick: (items) => items[Math.floor(next() * items.length)],
      chance: (p) => next() < p,
    }
  }

  /** Round for SVG output. */
  SG.n = (v) => Math.round(v * 100) / 100

  /** An SVG element as a string. Attribute values are numbers or trusted strings built in the specimen. */
  SG.el = (tag, attrs = {}, inner = '') => {
    const a = Object.entries(attrs)
      .filter(([, v]) => v !== undefined && v !== null && v !== false)
      .map(([k, v]) => ` ${k}="${typeof v === 'number' ? SG.n(v) : v}"`)
      .join('')
    return inner === null ? `<${tag}${a}/>` : `<${tag}${a}>${inner}</${tag}>`
  }

  let uid = 0
  /** A document-unique id for defs (clip paths, patterns). */
  SG.uid = (prefix) => `${prefix}-${++uid}`

  /** The CSS pixel width of the current line, from the --line token. */
  SG.linePx = (node = document.documentElement) =>
    parseFloat(getComputedStyle(node).getPropertyValue('--line')) || 1.5
})()
