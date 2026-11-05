// The shape every template shares, so scenes.ts, city.ts and formats.ts agree.
import type { Pen } from "./svg"

export interface Scene {
  w: number
  h: number
  /** How the viewBox fits its box: slice from the bottom for scenes, meet for marks. */
  fit: string
  body: (p: Pen, seed: number) => string
}
