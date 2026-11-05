// SVG as strings, for a framework-free engine that draws the same thing on the server and in the browser. A Pen
// carries what one drawing shares: the line's width in CSS pixels (non-scaling strokes keep it at any size), the
// stipple pitch, and an id prefix with its own counter, so ids are unique in a page and identical on every render.
import { fork, prng, seedOf, type Stream } from "./seed"

/** Round for SVG output. */
export const n = (v: number) => Math.round(v * 100) / 100

type Attr = string | number | false | null | undefined

/** An SVG element as a string. Values are numbers or strings the engine builds; text is never interpolated here. */
export function el(
  tag: string,
  attrs: Record<string, Attr> = {},
  inner: string | null = "",
) {
  const a = Object.entries(attrs)
    .filter(([, v]) => v !== undefined && v !== null && v !== false)
    .map(([k, v]) => ` ${k}="${typeof v === "number" ? n(v) : v}"`)
    .join("")
  return inner === null ? `<${tag}${a}/>` : `<${tag}${a}>${inner}</${tag}>`
}

export interface Pen {
  /** The line, in CSS pixels. */
  L: number
  /** The defs prefix for this drawing's patterns and clips. */
  id: string
  /** A fresh id under the prefix. */
  uid: (name: string) => string
}

/** A pen for one drawing. The prefix comes from the seed and template, so a page of drawings never collides. */
export function pen(seed: string, template: string, L = 1.5): Pen {
  const id = `sg${seedOf(`${template}:${seed}`).toString(36)}`
  let count = 0
  return { L, id, uid: (name) => `${id}-${name}-${++count}` }
}

/** A seeded stream with an integer helper: int(a, b) is a whole number from a to b inclusive. */
export function rs(seed: number, label: string) {
  const next = prng(fork(seed, label))
  const between = (a: number, b: number) => a + next() * (b - a)
  return {
    next,
    between,
    int: (a: number, b: number) => Math.floor(between(a, b + 1)),
    pick: <T>(items: readonly T[]) =>
      items[Math.floor(next() * items.length)] as T,
    chance: (p: number) => next() < p,
  }
}
export type Rs = ReturnType<typeof rs>
export type { Stream }
