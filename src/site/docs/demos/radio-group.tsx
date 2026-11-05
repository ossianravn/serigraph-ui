import { Label } from "@/serigraph/ui/label"
import { RadioGroup, RadioGroupItem } from "@/serigraph/ui/radio-group"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Radio group",
  description:
    "Picks one of a few options shown together: circles that take the highlight and a solid ink dot.",
  item: "radio-group",
  group: "Forms",
}

const SEATS = [
  ["centre", "Dome centre"],
  ["rim", "Along the rim"],
  ["deck", "Telescope deck"],
] as const

const SHOWS = ["18:30", "20:00", "21:30"] as const

export default function RadioGroupDemo() {
  return (
    <DemoSection title="States">
      <StateRow label="One chosen">
        <RadioGroup defaultValue="centre" aria-label="Seat">
          {SEATS.map(([value, words]) => (
            <Label key={value}>
              <RadioGroupItem value={value} /> {words}
            </Label>
          ))}
        </RadioGroup>
      </StateRow>
      <StateRow label="Disabled">
        <RadioGroup defaultValue="centre" aria-label="Seat" disabled>
          {SEATS.map(([value, words]) => (
            <Label key={value}>
              <RadioGroupItem value={value} /> {words}
            </Label>
          ))}
        </RadioGroup>
      </StateRow>
      <StateRow label="One disabled">
        <RadioGroup defaultValue="rim" aria-label="Seat">
          {SEATS.map(([value, words]) => (
            <Label key={value}>
              <RadioGroupItem value={value} disabled={value === "deck"} />{" "}
              {words}
            </Label>
          ))}
        </RadioGroup>
      </StateRow>
      <StateRow label="In a row">
        <RadioGroup
          defaultValue="20:00"
          aria-label="Show time"
          className="flex w-auto flex-wrap gap-x-line"
        >
          {SHOWS.map((time) => (
            <Label key={time} className="font-mono">
              <RadioGroupItem value={time} /> {time}
            </Label>
          ))}
        </RadioGroup>
      </StateRow>
      <StateRow label="Invalid">
        <RadioGroup aria-label="Seat" aria-invalid="true">
          {SEATS.slice(0, 2).map(([value, words]) => (
            <Label key={value}>
              <RadioGroupItem value={value} aria-invalid="true" /> {words}
            </Label>
          ))}
        </RadioGroup>
      </StateRow>
    </DemoSection>
  )
}
