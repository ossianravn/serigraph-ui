// The templates. Each draws a whole scene from a seed in its own viewBox; a page sizes the format with CSS and the
// SVG is sliced to fill its box, anchored at the bottom, so nothing is measured.
import { city } from "./city"
import { arcadeWall, band, doorway, medallion, windowScene } from "./formats"
import { defs } from "./motifs"
import { seedOf } from "./seed"

export type { Scene } from "./scene"

export const TEMPLATES = {
  city,
  window: windowScene,
  medallion,
  band,
  arcade: arcadeWall,
  doorway,
} as const
export type Template = keyof typeof TEMPLATES

/** Stipple pitch per template, in its own units, for the size it is usually shown at. */
const PITCH: Record<Template, number> = {
  city: 3.2,
  window: 3.4,
  medallion: 2.6,
  band: 3,
  arcade: 3,
  doorway: 2.6,
}

export const seedNumber = (seed: string | number) => seedOf(String(seed))
export const pitchOf = (t: Template) => PITCH[t]
export { defs }
