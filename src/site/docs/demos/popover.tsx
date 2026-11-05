import { BellIcon, CloudMoonIcon } from "lucide-react"
import { Button } from "@/serigraph/ui/button"
import { Input } from "@/serigraph/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/serigraph/ui/popover"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Popover",
  description:
    "Holds a few details or one small task beside the control that opened it, on a plane that grows from it.",
  item: "popover",
  group: "Overlays",
}

const SKY = [
  ["Cloud", "12%"],
  ["Seeing", "3/5"],
  ["Faintest star", "mag 6.2"],
  ["Moon", "31%, sets 23:48"],
  ["Wind", "4 m/s NW"],
] as const

export default function PopoverDemo() {
  return (
    <DemoSection title="Open with the trigger">
      <StateRow label="Details">
        <Popover>
          <PopoverTrigger render={<Button variant="outline" />}>
            <CloudMoonIcon data-icon="inline-start" /> Sky tonight
          </PopoverTrigger>
          <PopoverContent align="start">
            <PopoverHeader>
              <PopoverTitle>Sky over Meridian</PopoverTitle>
              <PopoverDescription>
                Thursday 5 November, forecast at 18:00
              </PopoverDescription>
            </PopoverHeader>
            <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-snug gap-y-1">
              {SKY.map(([term, value]) => (
                <div key={term} className="contents">
                  <dt>{term}</dt>
                  <dd className="m-0 text-end font-mono">{value}</dd>
                </div>
              ))}
            </dl>
          </PopoverContent>
        </Popover>
      </StateRow>
      <StateRow label="A small task">
        <Popover>
          <PopoverTrigger render={<Button variant="secondary" />}>
            <BellIcon data-icon="inline-start" /> Remind me
          </PopoverTrigger>
          <PopoverContent align="start" className="w-80">
            <PopoverHeader>
              <PopoverTitle>Remind me when the dome opens</PopoverTitle>
              <PopoverDescription>
                One message at 21:15 if the sky is clear enough to observe.
              </PopoverDescription>
            </PopoverHeader>
            <div className="flex flex-col gap-hair">
              <label htmlFor="remind-email" className="caps">
                Email
              </label>
              <Input
                id="remind-email"
                type="email"
                autoComplete="email"
                defaultValue="ada@meridian.dk"
                className="w-64 max-w-full"
              />
            </div>
            <Button size="sm" className="self-end">
              Set reminder
            </Button>
          </PopoverContent>
        </Popover>
      </StateRow>
    </DemoSection>
  )
}
