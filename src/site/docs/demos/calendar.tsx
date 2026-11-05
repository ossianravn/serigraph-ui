import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { Calendar } from "@/serigraph/ui/calendar"
import { Field, FieldDescription, FieldLabel } from "@/serigraph/ui/field"
import { Popover, PopoverContent, PopoverTrigger } from "@/serigraph/ui/popover"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Calendar",
  description:
    "A printed month for choosing a night or a run of nights, and the date pickers built from it.",
  item: "calendar",
  group: "Forms",
}

// The demo clock: Thursday 5 November 2026. Passing it as `today` keeps the server and the browser on one page.
// Meridian's weeks start on Monday, and it is closed on Mondays.
const TODAY = new Date(2026, 10, 5)
const day = (d: number, month = 10) => new Date(2026, month, d)
const CLOSED = [{ before: TODAY }, { dayOfWeek: [1] }]

// The picker's trigger is a field: the surface's tint in the ink line, a calendar icon, the date in the reading face.
const trigger =
  "control-field inline-flex h-control cursor-pointer items-center gap-tight px-snug text-start whitespace-nowrap data-[empty=true]:text-ink-quiet [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:[stroke-width:calc(var(--line)*1.5)]"

function NightPicker() {
  const [date, setDate] = useState<Date | undefined>(day(7))
  const [open, setOpen] = useState(false)
  return (
    <Field className="w-auto">
      <FieldLabel htmlFor="night">Night</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id="night"
          data-empty={!date}
          className={`${trigger} w-48`}
        >
          <CalendarIcon />
          {date ? format(date, "EEE d MMM yyyy") : "Pick a night"}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            weekStartsOn={1}
            today={TODAY}
            defaultMonth={date ?? TODAY}
            selected={date}
            disabled={CLOSED}
            onSelect={(next) => {
              setDate(next)
              setOpen(false)
            }}
            autoFocus
          />
        </PopoverContent>
      </Popover>
      <FieldDescription>Closed on Mondays.</FieldDescription>
    </Field>
  )
}

function StarCamp() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: day(18),
    to: day(21),
  })
  const label = range?.from
    ? range.to
      ? `${format(range.from, "d")}–${format(range.to, "d MMM yyyy")}`
      : format(range.from, "d MMM yyyy")
    : "Pick the nights"
  return (
    <Field className="w-auto">
      <FieldLabel htmlFor="star-camp">Star camp</FieldLabel>
      <Popover>
        <PopoverTrigger
          id="star-camp"
          data-empty={!range?.from}
          className={`${trigger} w-48`}
        >
          <CalendarIcon />
          {label}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            weekStartsOn={1}
            today={TODAY}
            defaultMonth={range?.from ?? TODAY}
            selected={range}
            onSelect={setRange}
            numberOfMonths={2}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}

export default function CalendarDemo() {
  const [single, setSingle] = useState<Date | undefined>(day(12))
  const [range, setRange] = useState<DateRange | undefined>({
    from: day(18),
    to: day(21),
  })
  return (
    <>
      <DemoSection title="Calendar">
        <StateRow label="Single night">
          <Calendar
            mode="single"
            weekStartsOn={1}
            today={TODAY}
            defaultMonth={TODAY}
            selected={single}
            onSelect={setSingle}
          />
        </StateRow>
        <StateRow label="Range">
          <Calendar
            mode="range"
            weekStartsOn={1}
            today={TODAY}
            defaultMonth={TODAY}
            selected={range}
            onSelect={setRange}
          />
        </StateRow>
        <StateRow label="Disabled days">
          <Calendar
            mode="single"
            weekStartsOn={1}
            today={TODAY}
            defaultMonth={TODAY}
            disabled={CLOSED}
          />
        </StateRow>
        <StateRow label="Month menus">
          <Calendar
            mode="single"
            weekStartsOn={1}
            today={TODAY}
            defaultMonth={TODAY}
            captionLayout="dropdown"
            startMonth={day(1, 0)}
            endMonth={new Date(2027, 11, 1)}
          />
        </StateRow>
      </DemoSection>
      <DemoSection title="Date pickers">
        <StateRow label="Single">
          <NightPicker />
        </StateRow>
        <StateRow label="Range">
          <StarCamp />
        </StateRow>
      </DemoSection>
    </>
  )
}
