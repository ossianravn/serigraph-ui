import { CalendarDaysIcon, ListIcon, MapIcon } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/serigraph/ui/toggle-group"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Toggle group",
  description:
    "A row of toggles: joined, the segmented control for two to four choices; spaced, a set of filters that switch on and off.",
  item: "toggle-group",
  group: "Forms",
}

const FILTERS = [
  ["planets", "Planets"],
  ["moon", "The Moon"],
  ["deep-sky", "Deep sky"],
  ["meteors", "Meteors"],
] as const

export default function ToggleGroupDemo() {
  return (
    <>
      <DemoSection title="Segmented">
        <StateRow label="One choice">
          <ToggleGroup aria-label="Nights" spacing={0} defaultValue={["week"]}>
            <ToggleGroupItem value="tonight">Tonight</ToggleGroupItem>
            <ToggleGroupItem value="week">This week</ToggleGroupItem>
            <ToggleGroupItem value="month">Month</ToggleGroupItem>
          </ToggleGroup>
        </StateRow>
        <StateRow label="Icons · sm">
          <ToggleGroup
            aria-label="Show the programme as"
            size="sm"
            spacing={0}
            defaultValue={["list"]}
          >
            <ToggleGroupItem value="list" aria-label="List">
              <ListIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="calendar" aria-label="Calendar">
              <CalendarDaysIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="sky" aria-label="Sky map">
              <MapIcon />
            </ToggleGroupItem>
          </ToggleGroup>
        </StateRow>
        <StateRow label="Disabled">
          <ToggleGroup
            aria-label="Party size"
            spacing={0}
            defaultValue={["1-2"]}
            disabled
          >
            <ToggleGroupItem value="1-2">1–2</ToggleGroupItem>
            <ToggleGroupItem value="3-4">3–4</ToggleGroupItem>
            <ToggleGroupItem value="5+">5+</ToggleGroupItem>
          </ToggleGroup>
        </StateRow>
        <StateRow label="Vertical">
          <ToggleGroup
            aria-label="Seats"
            spacing={0}
            orientation="vertical"
            defaultValue={["centre"]}
          >
            <ToggleGroupItem value="centre">Dome centre</ToggleGroupItem>
            <ToggleGroupItem value="rim">Rim</ToggleGroupItem>
            <ToggleGroupItem value="deck">Deck</ToggleGroupItem>
          </ToggleGroup>
        </StateRow>
      </DemoSection>
      <DemoSection title="Filters">
        <StateRow label="Several on">
          <ToggleGroup
            aria-label="Show in the sky map"
            multiple
            defaultValue={["planets", "moon"]}
          >
            {FILTERS.map(([value, words]) => (
              <ToggleGroupItem
                key={value}
                value={value}
                disabled={value === "meteors"}
              >
                {words}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </StateRow>
        <StateRow label="Outline">
          <ToggleGroup
            aria-label="Show in the sky map"
            variant="outline"
            spacing={3}
            multiple
            defaultValue={["deep-sky"]}
          >
            {FILTERS.slice(0, 3).map(([value, words]) => (
              <ToggleGroupItem key={value} value={value}>
                {words}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </StateRow>
      </DemoSection>
    </>
  )
}
