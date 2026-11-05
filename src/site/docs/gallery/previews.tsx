import type { ComponentType } from "react"
import { CONVERSATION_PREVIEWS } from "./previews-conversation"
import { DISPLAY_PREVIEWS } from "./previews-display"
import { EXTRA_PREVIEWS } from "./previews-extras"
import { NAV_PREVIEWS } from "./previews-nav"
import { OVERLAY_PREVIEWS } from "./previews-overlays"
import { PANEL_PREVIEWS } from "./previews-panels"

export { SCALE } from "./previews-extras"

// Previews made for the Components index, by demo name, where a demo's first example row would not show the part:
// an overlay that opens in a portal, or a part whose first example is larger than a card's plate.
export const PREVIEWS: Record<string, ComponentType> = {
  ...OVERLAY_PREVIEWS,
  ...NAV_PREVIEWS,
  ...DISPLAY_PREVIEWS,
  ...PANEL_PREVIEWS,
  ...CONVERSATION_PREVIEWS,
  ...EXTRA_PREVIEWS,
}
