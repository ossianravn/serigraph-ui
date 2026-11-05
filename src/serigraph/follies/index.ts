// Follies: seeded surreal architecture in the triptych's manner, drawn as SVG strings from a seed. Every fill is a
// colourway role, so a drawing reprints in every colourway; the same seed draws the same SVG on the server, in the
// browser and in every build. Framework-free: no React, no DOM, no Math.random().
import { defs, pitchOf, seedNumber, TEMPLATES, type Template } from "./scenes"
import { el, pen } from "./svg"

export { TEMPLATES, type Template } from "./scenes"
export { seedOf, prng, fork, stream } from "./seed"

export interface FollyOptions {
  /** Which drawing: the city, a window, a medallion, a band, the arcade wall or the doorway. */
  template?: Template
  /** Any string or number; the same seed always draws the same folly. */
  seed?: string | number
  /** The line in CSS pixels (non-scaling, so it holds at any size). */
  line?: number
  /** An accessible name; without one the drawing is decorative and hidden from assistive technology. */
  label?: string
}

/** A folly as an SVG string, sized by its container (width and height 100%). */
export function folly({
  template = "city",
  seed = "serigraph",
  line = 1.5,
  label,
}: FollyOptions = {}) {
  const scene = TEMPLATES[template]
  const p = pen(String(seed), template, line)
  const body = defs(p, pitchOf(template)) + scene.body(p, seedNumber(seed))
  const a11y = label
    ? { role: "img", "aria-label": label.replace(/[<>&"]/g, "") }
    : { "aria-hidden": "true" }
  return el(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: `0 0 ${scene.w} ${scene.h}`,
      preserveAspectRatio: scene.fit,
      width: "100%",
      height: "100%",
      focusable: "false",
      "data-folly": template,
      ...a11y,
    },
    body,
  )
}
