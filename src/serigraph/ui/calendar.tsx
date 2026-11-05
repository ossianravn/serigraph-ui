"use client"

import * as React from "react"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { cn } from "@/serigraph/lib/utils"

import { Button, buttonVariants } from "@/serigraph/ui/button"

// A printed month on whatever surface it sits on: the month in the reading face, weekdays in the capitals, day numbers
// in the reading face with tabular figures. Days are ghost pills: no line until the pointer comes. Today is ringed by
// a fine line just inside its cell; the chosen day is a highlight circle in the ink line; a range is a flat highlight
// band between its two ends, its middle days in ink. Outside days print quiet and disabled days are struck through,
// with no tint (styles/composites.css). Month arrows are fine chevrons. Pass `today` (and `defaultMonth`) so the server
// and the browser draw the same page; dates format in en-US unless a locale is given.

// Lucide's 24-unit icons at 16px: a stroke of 1.5 × the line renders as exactly one line.
const fineIcon = "[stroke-width:calc(var(--line)*1.5)]"

// The band behind a range: each day draws its piece, half a cell at either end, rounded where a week breaks it.
const band =
  "before:pointer-events-none before:absolute before:inset-y-0 before:-z-1 before:bg-highlight"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  labels,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar p-tight text-(--text) [--cell-size:2.5rem]",
        String.raw`rtl:**:[.rdp-button\_next>svg]:-scale-x-100`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:-scale-x-100`,
        className,
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code ?? "en-US", { month: "short" }),
        ...formatters,
      }}
      labels={{
        // The visible numeral stays a word of the name, so voice control can say what it sees (WCAG 2.5.3).
        labelDayButton: (date, modifiers, _options, dateLib) => {
          const name =
            dateLib?.format(date, "EEEE d MMMM yyyy") ?? date.toDateString()
          return `${modifiers.today ? "Today, " : ""}${name}${modifiers.selected ? ", selected" : ""}`
        },
        ...labels,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-snug md:flex-row md:gap-line",
          defaultClassNames.months,
        ),
        month: cn("flex w-full flex-col gap-tight", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "z-1 size-(--cell-size) p-0 select-none aria-disabled:pointer-events-none aria-disabled:text-(--text-quiet)",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "z-1 size-(--cell-size) p-0 select-none aria-disabled:pointer-events-none aria-disabled:text-(--text-quiet)",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-hair",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "control-field relative h-control-compact cursor-pointer has-focus-visible:focus-ring",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn(
          "absolute inset-0 cursor-pointer opacity-0",
          defaultClassNames.dropdown,
        ),
        caption_label: cn(
          "font-read font-semibold select-none",
          captionLayout === "label"
            ? "text-body leading-ui"
            : "flex h-full items-center gap-hair ps-tight pe-hair font-normal text-ink [&>svg]:size-4",
          defaultClassNames.caption_label,
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "caps flex-1 pb-hair text-(--text-quiet) select-none",
          defaultClassNames.weekday,
        ),
        week: cn("mt-0.5 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header,
        ),
        week_number: cn(
          "font-mono text-small text-(--text-quiet) select-none",
          defaultClassNames.week_number,
        ),
        day: cn(
          "group/day relative isolate aspect-square h-full w-full p-0 text-center select-none focus-within:z-1",
          defaultClassNames.day,
        ),
        range_start: cn(
          band,
          "before:start-1/2 before:end-0",
          defaultClassNames.range_start,
        ),
        range_middle: cn(
          band,
          "before:inset-x-0 first:before:rounded-s-full last:before:rounded-e-full",
          defaultClassNames.range_middle,
        ),
        range_end: cn(
          band,
          "before:start-0 before:end-1/2 [&:has([data-range-start=true][data-range-end=true])]:before:hidden",
          defaultClassNames.range_end,
        ),
        today: cn(defaultClassNames.today),
        outside: cn(defaultClassNames.outside),
        disabled: cn(defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon
                className={cn("size-4", fineIcon, className)}
                {...props}
              />
            )
          }
          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", fineIcon, className)}
                {...props}
              />
            )
          }
          return (
            <ChevronDownIcon
              className={cn("size-4", fineIcon, className)}
              {...props}
            />
          )
        },
        DayButton: ({ ...props }) => (
          <CalendarDayButton locale={locale} {...props} />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code ?? "en-US")}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      data-today={modifiers.today || undefined}
      className={cn(
        "flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 [--contour-x:0.5rem] [--contour-y:0.3rem]",
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
