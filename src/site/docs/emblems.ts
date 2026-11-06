// Each group of parts has an emblem from the drawing library, drawn beside its name on the home page and the
// components index: a bell for actions, a checklist for forms, a door left open for overlays …
import { OBJECTS } from "@/serigraph/follies"

const EMBLEMS: Record<string, string> = {
  Actions: "bell",
  Forms: "checklist",
  Overlays: "open-door",
  Navigation: "signpost",
  "Data display": "telescope",
  Charts: "sundial",
  Conversation: "paper-plane",
  "Serigraph extras": "ticket",
}

/** The group's emblem, or undefined while the library has no such object. */
export const emblemOf = (group: string) => {
  const name = EMBLEMS[group]
  return name && OBJECTS[name] ? name : undefined
}
