// The object library: every drawable thing as one draw function filed in a collection, so the library page, scenes
// and <Drawing> find objects the same way. An object draws in its own box, (0, 0) to (w, h), standing on the box's
// foot (y = h) unless it floats; oblique depth runs up and to the right inside the box. Every fill is a colourway
// role, so an object reprints in every colourway; `fills` lets a scene recolour one without redrawing it.
import { el, n, rs, type Pen, type Rs } from "../svg"

export type Collection =
  | "architecture"
  | "sky"
  | "instruments"
  | "garden"
  | "travel"
  | "stage"
  | "everyday"

export interface Thing {
  /** kebab-case, unique across the library. */
  name: string
  /** Its name in a sentence ("a spiral stair"), for labels and the library page. */
  title: string
  collection: Collection
  w: number
  h: number
  /** Draws the object in its box. `r` forks a seeded stream per decision; `fills` overrides its default roles. */
  draw: (p: Pen, r: (label: string) => Rs, fills: Fills) => string
}

/** Role overrides by the object's own part names: { body: "tone-2", roof: "structure" }. */
export type Fills = Record<string, string | undefined>

/** The role for a part: the scene's override, else the object's default. */
export const fillOf = (fills: Fills, part: string, fallback: string) =>
  fills[part] ?? fallback

/** A stream factory for one object drawn from `seed`: each label forks its own stream. */
export const streams = (seed: number, name: string) => (label: string) =>
  rs(seed, `${name}:${label}`)

export interface Placement {
  /** Left edge of the object's box, in the scene's units. */
  x: number
  /** Where its foot stands (the box's bottom edge), in the scene's units. */
  y: number
  /** Its height in the scene's units; the width follows. Defaults to the object's own height. */
  h?: number
  /** Mirror it left to right. */
  flip?: boolean
  /** Its own seed label, so two of the same object in one scene differ. */
  key?: string
  fills?: Fills
}

/** An object placed in a scene: translated and scaled so its foot stands at (x, y) and it is `h` tall. */
export function put(
  p: Pen,
  seed: number,
  thing: Thing,
  { x, y, h = thing.h, flip = false, key = "", fills = {} }: Placement,
) {
  const k = h / thing.h
  const w = thing.w * k
  const move = flip
    ? `translate(${n(x + w)} ${n(y - h)}) scale(${n(-k)} ${n(k)})`
    : `translate(${n(x)} ${n(y - h)}) scale(${n(k)})`
  return el(
    "g",
    { transform: move, "data-object": thing.name },
    thing.draw(p, streams(seed, `${thing.name}:${key}`), fills),
  )
}
