// Follies: seeded surreal architecture in the triptych's manner, drawn as SVG strings from a seed. Every fill is a
// colourway role, so a drawing reprints in every colourway; the same seed draws the same SVG on the server, in the
// browser and in every build. Framework-free: no React, no DOM, no Math.random().
import { MOTIFS, type Motif } from "./marks"
import type { Scene } from "./scene"
import { defs, pitchOf, seedNumber, TEMPLATES, type Template } from "./scenes"
import { el, pen } from "./svg"

export { TEMPLATES, type Template } from "./scenes"
export { MOTIFS, type Motif } from "./marks"
export { seedOf, prng, fork, stream } from "./seed"

interface Drawn {
  /** Any string or number; the same seed always draws the same folly. */
  seed?: string | number
  /** The line in CSS pixels (non-scaling, so it holds at any size). */
  line?: number
  /** An accessible name; without one the drawing is decorative and hidden from assistive technology. */
  label?: string
}

export interface FollyOptions extends Drawn {
  /** Which drawing: the city, a window, a medallion, a band, the arcade wall or the doorway. */
  template?: Template
}

export interface MotifOptions extends Drawn {
  /** Which motif: a pinwheel, a sparkle, a cloud or an archway. */
  kind?: Motif
}

/** One scene as an SVG string, sized by its container (width and height 100%). */
function draw(
  scene: Scene,
  name: string,
  data: Record<string, string>,
  pitch: number,
  { seed = "serigraph", line = 1.5, label }: Drawn,
) {
  const p = pen(String(seed), name, line)
  const body = defs(p, pitch) + scene.body(p, seedNumber(seed))
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
      ...data,
      ...a11y,
    },
    body,
  )
}

/** A folly as an SVG string, sized by its container (width and height 100%). */
export const folly = ({ template = "city", ...options }: FollyOptions = {}) =>
  draw(
    TEMPLATES[template],
    template,
    { "data-folly": template },
    pitchOf(template),
    options,
  )

/** A motif on its own as an SVG string, sized by its container; it keeps its proportions inside the box. */
export const motif = ({ kind = "sparkle", ...options }: MotifOptions = {}) =>
  draw(MOTIFS[kind], `motif-${kind}`, { "data-motif": kind }, 2.6, options)
