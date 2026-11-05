// A colourway in the studio: a pigment for each role, and the text on the canvas. The roles, their groups and the
// pairs the contrast check measures follow colourways.css and tools/check-contrast.mjs.
import { APPEARANCE } from "@/serigraph/theme"
import {
  builtInColourways,
  contrast,
  mix,
  rgbOf,
  SPOTS,
  type Pigment,
} from "./ink"

export const ROLES = [
  { key: "canvas", label: "Canvas", group: "Surfaces" },
  { key: "plane", label: "Plane", group: "Surfaces" },
  { key: "plane-2", label: "Plane 2", group: "Surfaces" },
  { key: "cloud", label: "Cloud", group: "Surfaces" },
  { key: "action", label: "Action", group: "Interface" },
  { key: "highlight", label: "Highlight", group: "Interface" },
  { key: "tone-1", label: "Tone 1", group: "Tones" },
  { key: "tone-2", label: "Tone 2", group: "Tones" },
  { key: "tone-3", label: "Tone 3", group: "Tones" },
  { key: "tone-4", label: "Tone 4", group: "Tones" },
  { key: "structure", label: "Structure", group: "Drawings" },
  { key: "stair", label: "Stair", group: "Drawings" },
  { key: "platform", label: "Platform", group: "Drawings" },
  { key: "sun", label: "Sun", group: "Drawings" },
  { key: "bloom", label: "Bloom", group: "Drawings" },
  { key: "leaf", label: "Leaf", group: "Drawings" },
] as const

export type Role = (typeof ROLES)[number]["key"]
export type OnCanvas = "ink" | "paper"
export interface Colourway {
  roles: Record<Role, Pigment>
  onCanvas: OnCanvas
}
export interface Preset {
  id: string
  name: string
  colourway: Colourway
  /** One of the five the site's runtime knows, so it can be used on the whole site. */
  builtIn: boolean
}

/** What each role may take: every spot but rose; the cloud also paper. */
export const choicesFor = (role: Role): readonly Pigment[] =>
  role === "cloud" ? [...SPOTS, "paper"] : SPOTS

const isPigment = (v: string | undefined): v is Pigment =>
  v === "paper" || (SPOTS as readonly string[]).includes(v ?? "")

const read = (roles: Record<string, string>): Colourway => ({
  roles: Object.fromEntries(
    ROLES.map(({ key }) => [
      key,
      isPigment(roles[key]) ? roles[key] : "marigold",
    ]),
  ) as Record<Role, Pigment>,
  onCanvas: roles["on-canvas"] === "paper" ? "paper" : "ink",
})

const of = (
  canvas: Pigment,
  [plane, plane2, action, highlight, cloud]: Pigment[],
  tones: Pigment[],
  drawing: Pigment[],
  onCanvas: OnCanvas = "ink",
): Colourway => {
  const [structure, stair, platform, sun, bloom, leaf] = drawing
  const [t1, t2, t3, t4] = tones
  return read({
    canvas,
    plane: plane!,
    "plane-2": plane2!,
    action: action!,
    highlight: highlight!,
    cloud: cloud!,
    "tone-1": t1!,
    "tone-2": t2!,
    "tone-3": t3!,
    "tone-4": t4!,
    structure: structure!,
    stair: stair!,
    platform: platform!,
    sun: sun!,
    bloom: bloom!,
    leaf: leaf!,
    "on-canvas": onCanvas,
  })
}

const BUILT_IN = builtInColourways()
const title = (v: string) => v.charAt(0).toUpperCase() + v.slice(1)

export const PRESETS: Preset[] = [
  ...APPEARANCE.colourway.map((id) => ({
    id,
    name: title(id),
    colourway: read(BUILT_IN[id] ?? {}),
    builtIn: true,
  })),
  {
    id: "dusk",
    name: "Dusk",
    builtIn: false,
    colourway: of(
      "lilac",
      ["marigold", "seafoam", "coral", "bubblegum", "bubblegum"],
      ["marigold", "seafoam", "bubblegum", "cornflower"],
      ["coral", "marigold", "seafoam", "coral", "bubblegum", "pistachio"],
    ),
  },
  {
    id: "noon",
    name: "Noon",
    builtIn: false,
    colourway: of(
      "seafoam",
      ["bubblegum", "marigold", "coral", "lilac", "paper"],
      ["bubblegum", "marigold", "lilac", "pistachio"],
      ["coral", "marigold", "lilac", "coral", "bubblegum", "pistachio"],
    ),
  },
  {
    id: "matinee",
    name: "Matinee",
    builtIn: false,
    colourway: of(
      "bubblegum",
      ["seafoam", "marigold", "sky", "lilac", "marigold"],
      ["seafoam", "marigold", "lilac", "pistachio"],
      ["sky", "marigold", "seafoam", "coral", "lilac", "pistachio"],
    ),
  },
  {
    id: "late-show",
    name: "Late show",
    builtIn: false,
    colourway: of(
      "prussian",
      ["seafoam", "marigold", "coral", "lilac", "seafoam"],
      ["seafoam", "marigold", "lilac", "bubblegum"],
      ["marigold", "coral", "bubblegum", "coral", "lilac", "seafoam"],
      "paper",
    ),
  },
]

export const same = (a: Colourway, b: Colourway) =>
  a.onCanvas === b.onCanvas &&
  ROLES.every(({ key }) => a.roles[key] === b.roles[key])

/** The text that reads better on a canvas: ink on the bright spots, paper on prussian. */
export const textFor = (canvas: Pigment): OnCanvas =>
  contrast(rgbOf(canvas), rgbOf("ink")) >=
  contrast(rgbOf(canvas), rgbOf("paper"))
    ? "ink"
    : "paper"

export interface Pair {
  /** The row it shows on: a role, or the text on the canvas. */
  row: Role | "on-canvas"
  label: string
  ratio: number
}

const TEXT_ROLES: Role[] = [
  "plane",
  "plane-2",
  "action",
  "highlight",
  "cloud",
  "tone-1",
  "tone-2",
  "tone-3",
  "tone-4",
]
const FIELDS: Role[] = ["canvas", "plane", "plane-2", "cloud"]
const labelOf = (role: Role) => ROLES.find((r) => r.key === role)!.label

/** Every pair the build checks: ink on each bright role, the canvas's text, fields on four surfaces, the pressed action. */
export function pairs({ roles, onCanvas }: Colourway): Pair[] {
  const ink = rgbOf("ink")
  const paper = rgbOf("paper")
  const at = (role: Role) => rgbOf(roles[role])
  return [
    {
      row: "on-canvas",
      label: `${title(onCanvas)} on canvas`,
      ratio: contrast(at("canvas"), rgbOf(onCanvas)),
    },
    ...TEXT_ROLES.map((role) => ({
      row: role,
      label: `Ink on ${labelOf(role).toLowerCase()}`,
      ratio: contrast(at(role), ink),
    })),
    ...FIELDS.map((role) => ({
      row: role,
      label: `Field on ${labelOf(role).toLowerCase()}`,
      ratio: contrast(mix(at(role), paper, 0.3), ink),
    })),
    {
      row: "action",
      label: "Pressed action",
      ratio: contrast(mix(at("action"), ink, 0.92), ink),
    },
  ]
}

export const PASS = 4.5
