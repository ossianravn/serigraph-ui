import type { ChartConfig } from "@/serigraph/ui/chart"

// Meridian's numbers for the chart demo: the week up to last night (Wednesday 4 November 2026), the fortnight before
// it against the same nights a year ago, the sky over the last twelve months and the season's seats. Made up, but
// consistent: the dome seats 120 at two shows a night (three on Halloween), the lecture hall 60 and the telescopes
// 22 (12 at the refractor, 10 at the Dobsonian).

/** Visitors through the doors each night, and the seats they took by kind of session. */
export const week = [
  { night: "Thu 29", visitors: 286, show: 204, talk: 58, telescope: 22 },
  { night: "Fri 30", visitors: 412, show: 228, talk: 60, telescope: 22 },
  { night: "Sat 31", visitors: 468, show: 340, talk: 60, telescope: 21 },
  { night: "Sun 1", visitors: 241, show: 168, talk: 49, telescope: 22 },
  { night: "Mon 2", visitors: 97, show: 64, talk: 0, telescope: 10 },
  { night: "Tue 3", visitors: 164, show: 118, talk: 33, telescope: 0 },
  { night: "Wed 4", visitors: 203, show: 142, talk: 52, telescope: 22 },
]
export const weekVisitors = week.reduce((sum, d) => sum + d.visitors, 0)

export const visitorsConfig = {
  visitors: { label: "Visitors" },
} satisfies ChartConfig

export const sessionConfig = {
  show: { label: "Dome shows" },
  talk: { label: "Talks" },
  telescope: { label: "Telescope" },
} satisfies ChartConfig

/** Hours of darkness with a clear or partly clear sky, month by month. June barely gets dark this far north. */
export const sky = [
  { month: "Nov", clear: 41, partly: 38 },
  { month: "Dec", clear: 37, partly: 44 },
  { month: "Jan", clear: 46, partly: 39 },
  { month: "Feb", clear: 52, partly: 35 },
  { month: "Mar", clear: 63, partly: 31 },
  { month: "Apr", clear: 58, partly: 27 },
  { month: "May", clear: 29, partly: 18 },
  { month: "Jun", clear: 9, partly: 7 },
  { month: "Jul", clear: 16, partly: 12 },
  { month: "Aug", clear: 42, partly: 24 },
  { month: "Sep", clear: 61, partly: 29 },
  { month: "Oct", clear: 54, partly: 33 },
]

export const skyConfig = {
  clear: { label: "Clear" },
  partly: { label: "Partly clear" },
} satisfies ChartConfig

/** Visitors per night over the last fortnight, and the same nights a year ago. */
export const fortnight = [
  { night: "22 Oct", now: 188, before: 162 },
  { night: "23 Oct", now: 231, before: 204 },
  { night: "24 Oct", now: 402, before: 351 },
  { night: "25 Oct", now: 377, before: 329 },
  { night: "26 Oct", now: 156, before: 141 },
  { night: "27 Oct", now: 98, before: 88 },
  { night: "28 Oct", now: 149, before: 127 },
  { night: "29 Oct", now: 286, before: 240 },
  { night: "30 Oct", now: 412, before: 366 },
  { night: "31 Oct", now: 468, before: 395 },
  { night: "1 Nov", now: 241, before: 212 },
  { night: "2 Nov", now: 97, before: 84 },
  { night: "3 Nov", now: 164, before: 131 },
  { night: "4 Nov", now: 203, before: 176 },
]

export const fortnightConfig = {
  now: { label: "This year" },
  before: { label: "A year ago" },
} satisfies ChartConfig

/** Seats sold since the season opened on 1 September, by kind of session. */
export const season = [
  { kind: "show", seats: 8412, fill: "var(--color-show)" },
  { kind: "talk", seats: 2236, fill: "var(--color-talk)" },
  { kind: "telescope", seats: 1104, fill: "var(--color-telescope)" },
]
export const seasonSeats = season.reduce((sum, s) => sum + s.seats, 0)
