import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { cn } from "@/serigraph/lib/utils"

// A date as the poster prints it: THURSDAY 5TH NOVEMBER in the extended capitals, the ordinal raised. Words and order
// come from Intl for the locale; English days take their ordinal (st, nd, rd, th), other languages keep their own
// punctuation (5. november). Read in UTC unless a timeZone is given, so the server and the browser print the same day:
// pass "2026-11-05" or a Date at UTC midnight. It never reads the clock. A <time> with a machine-readable dateTime.

const FORMATS = {
  long: { weekday: "long", day: "numeric", month: "long" },
  short: { weekday: "short", day: "numeric", month: "short" },
  day: { weekday: "short", day: "numeric" },
} as const satisfies Record<string, Intl.DateTimeFormatOptions>

const SUFFIX: Record<string, string> = {
  one: "st",
  two: "nd",
  few: "rd",
  other: "th",
}

export interface OrdinalDateProps extends Omit<
  ComponentPropsWithoutRef<"time">,
  "children" | "dateTime"
> {
  /** The day, as a Date or an ISO date ("2026-11-05"). Or give day and month (and year) instead. */
  date?: Date | string
  /** The day of the month, when there is no `date`. */
  day?: number
  /** The month, 1 to 12, when there is no `date`. */
  month?: number
  /** The year: with day and month it finds the weekday; with `showYear` it is printed. */
  year?: number
  /** The weekday's name, when day and month come without a year. */
  weekday?: string
  /** What it prints: THURSDAY 5TH NOVEMBER, THU 5TH NOV, or THU 5TH for a programme. */
  format?: keyof typeof FORMATS
  /** Print the year at the end. */
  showYear?: boolean
  /** Words and order; English locales raise an ordinal. Defaults to British English, the poster's order. */
  locale?: string
  /** The time zone a Date is read in. Defaults to UTC, so every machine prints the same day. */
  timeZone?: string
  /** Its size: the caption caps (sm), body, lead or a heading's size. */
  size?: "sm" | "md" | "lg" | "xl"
}

const pad = (n: number, width = 2) => String(n).padStart(width, "0")

/** The instant to format and its time zone, from a Date, an ISO date or parts. */
function resolve({
  date,
  day,
  month,
  year,
  timeZone,
}: OrdinalDateProps): { when: Date; zone: string; iso: string } | null {
  if (typeof date === "string") {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(date)
    if (!m) return null
    const [, y = "", mo = "", d = ""] = m
    const when = new Date(Date.UTC(+y, +mo - 1, +d))
    return { when, zone: "UTC", iso: `${y}-${mo}-${d}` }
  }
  if (date instanceof Date) {
    const zone = timeZone ?? "UTC"
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).formatToParts(date)
    const n = (t: string) => Number(parts.find((p) => p.type === t)?.value)
    return {
      when: date,
      zone,
      iso: `${pad(n("year"), 4)}-${pad(n("month"))}-${pad(n("day"))}`,
    }
  }
  if (day && month) {
    // A leap year stands in when the year is unknown, so 29 February exists; its weekday is never printed.
    const when = new Date(Date.UTC(year ?? 2000, month - 1, day))
    const iso = year
      ? `${pad(year, 4)}-${pad(month)}-${pad(day)}`
      : `${pad(month)}-${pad(day)}`
    return { when, zone: "UTC", iso }
  }
  return null
}

/** A date in the extended capitals with its ordinal raised. */
export function OrdinalDate({
  date,
  day,
  month,
  year,
  weekday,
  format = "long",
  showYear = false,
  locale = "en-GB",
  timeZone,
  size = "sm",
  className,
  ...props
}: OrdinalDateProps) {
  const resolved = resolve({ date, day, month, year, timeZone })
  if (!resolved) return null
  const { when, zone, iso } = resolved
  const knowsWeekday = date !== undefined || year !== undefined
  const options: Intl.DateTimeFormatOptions = {
    ...FORMATS[format],
    timeZone: zone,
    ...(showYear ? { year: "numeric" } : {}),
  }
  const english = locale.toLowerCase().startsWith("en")
  const ordinal = new Intl.PluralRules(locale, { type: "ordinal" })

  const parts = new Intl.DateTimeFormat(locale, options).formatToParts(when)
  const out: ReactNode[] = []
  parts.forEach((part, i) => {
    if (part.type === "weekday") {
      const name = knowsWeekday ? part.value : weekday
      const next = parts[i + 1]
      if (name) out.push(name)
      else if (next?.type === "literal") next.value = ""
      return
    }
    if (part.type === "day" && english) {
      out.push(
        <span key={i} className="whitespace-nowrap">
          {part.value}
          <span className="ord">
            {SUFFIX[ordinal.select(Number(part.value))]}
          </span>
        </span>,
      )
      return
    }
    out.push(part.value)
  })

  return (
    <time
      data-slot="ordinal-date"
      data-size={size}
      dateTime={iso}
      className={cn("caps uppercase", className)}
      {...props}
    >
      {out}
    </time>
  )
}
