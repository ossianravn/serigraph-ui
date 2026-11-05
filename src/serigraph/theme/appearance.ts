// Appearance lives as attributes on <html>, so CSS does the work and every island reads the same state. Saved choices
// persist in localStorage. Ported from Fineliner's appearance runtime (which came from Patina UI).

export const APPEARANCE = {
  /** The print run: which spot colour takes which role (styles/colourways.css). */
  colourway: ["sky", "pistachio", "coral", "marigold", "night"],
  /** On: the canvas in a rounded frame inside a paper mat. Off: the canvas to the window's edges. */
  poster: ["on", "off"],
  /** The one line, in CSS pixels. */
  line: ["1.5", "1"],
  /** The printed grain on every surface. */
  grain: ["on", "off"],
} as const

export type Colourway = (typeof APPEARANCE.colourway)[number]
export type Poster = (typeof APPEARANCE.poster)[number]
export type Line = (typeof APPEARANCE.line)[number]
export type Grain = (typeof APPEARANCE.grain)[number]

export interface Appearance {
  colourway: Colourway
  poster: Poster
  line: Line
  grain: Grain
}

export const defaultAppearance: Appearance = {
  colourway: "sky",
  poster: "off",
  line: "1.5",
  grain: "on",
}

export const STORAGE_KEY = "serigraph-appearance"

const KEYS = Object.keys(APPEARANCE) as (keyof Appearance)[]

const pick = <T extends string>(
  options: readonly T[],
  value: unknown,
  fallback: T,
): T => (options.includes(value as T) ? (value as T) : fallback)

/** Keeps only known values, so a stale or hand-edited entry never breaks the page. */
export function normalize(
  value: Partial<Record<keyof Appearance, unknown>>,
  defaults = defaultAppearance,
): Appearance {
  const next: Record<string, string> = {}
  for (const key of KEYS)
    next[key] = pick<string>(APPEARANCE[key], value[key], defaults[key])
  return next as unknown as Appearance
}

export function readSaved(defaults = defaultAppearance): Appearance {
  try {
    return normalize(
      JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") ?? {},
      defaults,
    )
  } catch {
    return defaults
  }
}

export function save(appearance: Appearance) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appearance))
  } catch {
    // Private windows and blocked storage keep the choice for this page only.
  }
}

/** Writes each setting to <html> under its own name: data-colourway, data-poster and so on. */
export function apply(
  appearance: Appearance,
  root: HTMLElement = document.documentElement,
) {
  for (const key of KEYS) root.dataset[key] = appearance[key]
}

/** The appearance currently applied to the document. */
export function current(
  root: HTMLElement = document.documentElement,
): Appearance {
  const value: Partial<Record<keyof Appearance, unknown>> = {}
  for (const key of KEYS) value[key] = root.dataset[key]
  return normalize(value)
}

/** The <html> attributes useAppearance watches. */
export const APPEARANCE_ATTRIBUTES = KEYS.map((key) => `data-${key}`)
