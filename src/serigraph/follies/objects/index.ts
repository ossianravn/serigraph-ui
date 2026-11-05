// The object library, by collection. A new object goes in its collection's file and its array; it then appears on
// the library page, in <Drawing> and in scenes by name.
import { ARCHITECTURE } from "./architecture"
import { GARDEN } from "./garden"
import { GARDEN_MORE } from "./garden-more"
import { INSTRUMENTS } from "./instruments"
import { INSTRUMENTS_MORE } from "./instruments-more"
import { SKY } from "./sky"
import { SKY_MORE } from "./sky-more"
import { STAGE } from "./stage"
import { STAGE_MORE } from "./stage-more"
import { TRAVEL } from "./travel"
import { TRAVEL_MORE } from "./travel-more"
import type { Collection, Thing } from "./library"

export { put, type Collection, type Fills, type Placement, type Thing } from "./library"

const ALL: Thing[] = [
  ...ARCHITECTURE,
  ...SKY,
  ...SKY_MORE,
  ...INSTRUMENTS,
  ...INSTRUMENTS_MORE,
  ...GARDEN,
  ...GARDEN_MORE,
  ...TRAVEL,
  ...TRAVEL_MORE,
  ...STAGE,
  ...STAGE_MORE,
]

export const OBJECTS: Readonly<Record<string, Thing>> = Object.fromEntries(
  ALL.map((t) => [t.name, t]),
)
export type ObjectName = string

/** The collections in the library's order, each with its objects. */
export const COLLECTIONS: { name: Collection; title: string; things: Thing[] }[] = (
  [
    ["architecture", "Architecture"],
    ["sky", "The sky"],
    ["instruments", "Instruments"],
    ["garden", "The garden"],
    ["travel", "Travel and post"],
    ["stage", "The stage"],
    ["everyday", "Everyday moments"],
  ] as const
)
  .map(([name, title]) => ({
    name,
    title,
    things: ALL.filter((t) => t.collection === name),
  }))
  .filter((c) => c.things.length > 0)

/** An object by name; throws on a name the library does not have, so a typo fails the build. */
export function thing(name: string): Thing {
  const t = OBJECTS[name]
  if (!t) throw new Error(`No object named "${name}" in the library`)
  return t
}
