import { BellIcon, MapIcon, StarIcon, TelescopeIcon } from "lucide-react"
import { Button } from "@/serigraph/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/serigraph/ui/tooltip"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Tooltip",
  description:
    "Names a control, or defines a term, in a small ink pill while it is hovered or focused, or held on a touch screen.",
  item: "tooltip",
  group: "Overlays",
}

const SIDES = [
  { side: "top", label: "Point the telescope", icon: TelescopeIcon },
  { side: "right", label: "Save this star", icon: StarIcon },
  { side: "bottom", label: "Open the sky map", icon: MapIcon },
  { side: "left", label: "Remind me at dusk", icon: BellIcon },
] as const

export default function TooltipDemo() {
  return (
    <TooltipProvider>
      <DemoSection title="Sides">
        <StateRow label="Hover or hold">
          {SIDES.map(({ side, label, icon: Icon }) => (
            <Tooltip key={side}>
              <TooltipTrigger
                render={
                  <Button variant="outline" size="icon" aria-label={label} />
                }
              >
                <Icon />
              </TooltipTrigger>
              <TooltipContent side={side}>{label}</TooltipContent>
            </Tooltip>
          ))}
        </StateRow>
      </DemoSection>
      <DemoSection title="Content">
        <StateRow label="On a term">
          <p className="m-0 max-w-measure">
            Saturn is at{" "}
            <Tooltip>
              <TooltipTrigger
                render={<span tabIndex={0} />}
                className="cursor-help underline decoration-dotted decoration-(length:--line) underline-offset-[0.25em]"
              >
                opposition
              </TooltipTrigger>
              <TooltipContent>
                Earth sits between the Sun and Saturn, so it is up all night
              </TooltipContent>
            </Tooltip>{" "}
            this week, and the dome stays open until two.
          </p>
        </StateRow>
        <StateRow label="Long label">
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>
              Seeing 3 of 5
            </TooltipTrigger>
            <TooltipContent>
              Steady enough for Saturn&rsquo;s rings and the Cassini gap, too
              soft for close double stars
            </TooltipContent>
          </Tooltip>
        </StateRow>
        <StateRow label="On the main action">
          <Tooltip>
            <TooltipTrigger render={<Button />}>Book a seat</TooltipTrigger>
            <TooltipContent side="bottom">
              Thu 5 Nov · 21:30 · 9 seats left
            </TooltipContent>
          </Tooltip>
        </StateRow>
      </DemoSection>
    </TooltipProvider>
  )
}
