import { Folly } from "@/serigraph/extras/folly"
import { ScrollArea, ScrollBar } from "@/serigraph/ui/scroll-area"
import { Separator } from "@/serigraph/ui/separator"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Scroll area",
  description:
    "A region that scrolls inside a fixed frame, with a thin ink thumb that stays out of the way of its content.",
  item: "scroll-area",
  group: "Data display",
}

const PROGRAMME = [
  ["Thu 5", "Saturn at opposition"],
  ["Fri 6", "The sky tonight"],
  ["Sat 7", "The Moon’s faces, for children"],
  ["Sun 8", "Sunspots on the deck"],
  ["Tue 10", "Henrietta Leavitt’s yardstick"],
  ["Wed 11", "Deep sky with the Dobsonian"],
  ["Thu 12", "Jupiter and its four moons"],
  ["Fri 13", "Andromeda and the local group"],
  ["Sat 14", "Members’ night at the Zeiss refractor"],
  ["Tue 17", "The Leonids from the lawn"],
  ["Wed 18", "Pulsars, with Jocelyn Bell"],
  ["Thu 19", "The Pleiades through binoculars"],
  ["Fri 20", "Voyager’s long goodbye"],
  ["Sat 21", "First-quarter Moon at the refractor"],
] as const

const PLANETS = [
  ["Mercury", "Before dawn, low east"],
  ["Venus", "Evening, south-west"],
  ["Mars", "After midnight, east"],
  ["Jupiter", "Rises at 21:40"],
  ["Saturn", "South-east, 28° up"],
  ["Uranus", "Near the Pleiades"],
  ["Neptune", "South, binoculars"],
] as const

export default function ScrollAreaDemo() {
  return (
    <DemoSection title="Orientation">
      <StateRow label="Vertical">
        <ScrollArea className="plane h-72 w-[21rem] max-w-full rounded-box">
          <div className="px-snug py-tight">
            <h3 className="m-0 mb-hair caps">
              November · {PROGRAMME.length} evenings
            </h3>
            {PROGRAMME.map(([day, title], i) => (
              <div key={day}>
                {i > 0 && <Separator />}
                <p className="m-0 flex items-baseline justify-between gap-snug py-hair leading-ui">
                  <span className="min-w-0 truncate">{title}</span>
                  <span className="shrink-0 font-mono text-small tabular-nums">
                    {day}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </StateRow>
      <StateRow label="Horizontal">
        <ScrollArea className="plane w-full max-w-[38rem] rounded-box [contain:inline-size]">
          <ul className="m-0 flex w-max list-none gap-line p-snug pb-line">
            {PLANETS.map(([name, where]) => (
              <li key={name} className="flex w-28 flex-col gap-hair">
                <Folly
                  template="medallion"
                  seed={name}
                  className="size-20 overflow-hidden rounded-full [--canvas:var(--plane-2)] [--cloud:var(--paper)]"
                />
                <span className="truncate font-semibold leading-ui">
                  {name}
                </span>
                <span className="text-small leading-small">{where}</span>
              </li>
            ))}
          </ul>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </StateRow>
    </DemoSection>
  )
}
