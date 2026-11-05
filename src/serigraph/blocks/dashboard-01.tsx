"use client"

import { cn } from "@/serigraph/lib/utils"
import {
  Figure,
  Panel,
  SeatsByKindChart,
  VisitorsChart,
  type KindSeats,
  type VisitorNight,
} from "@/serigraph/blocks/dashboard-01-charts"
import {
  TonightTable,
  UpcomingBookings,
  type Booking,
  type TonightSession,
} from "@/serigraph/blocks/dashboard-01-lists"

// The observatory's week at a glance: four figures in mono on the canvas, visitors per night and seats sold by kind
// of session on planes, tonight's sessions as a ledger and the bookings coming up. Pass your own data, shaped like
// SAMPLE; the layout follows the width of its container, so it works beside a sidebar as well as on a whole page.

export const meta = {
  title: "Dashboard",
  description:
    "The observatory's week: four figures in mono, visitors per night and seats by kind of session in Serigraph's fills, tonight's sessions and the bookings ahead.",
}

export interface Dashboard01Data {
  /** The period the figures cover, under the title. */
  period: string
  figures: { label: string; value: string; note: string }[]
  visitors: { title: string; note: string; nights: VisitorNight[] }
  kinds: { title: string; note: string; rows: KindSeats[] }
  tonight: { title: string; note: string; rows: TonightSession[] }
  bookings: { title: string; note: string; rows: Booking[] }
}

/** Meridian on Thursday 5 November 2026: the week up to last night, tonight's board and the bookings ahead. */
export const SAMPLE: Dashboard01Data = {
  period: "Thursday 29 October to Wednesday 4 November",
  figures: [
    { label: "Visitors", value: "1,871", note: "Up 14% on last year" },
    { label: "Seats sold", value: "1,695", note: "73% of the week's seats" },
    { label: "Busiest night", value: "Sat 31", note: "468 on Halloween" },
    { label: "Clear hours", value: "31 h", note: "The deck shut on Tuesday" },
  ],
  visitors: {
    title: "Visitors per night",
    note: "Booked ahead and at the door",
    // prettier-ignore
    nights: [
      { night: "Thu 29", ahead: 231, door: 55 },
      { night: "Fri 30", ahead: 348, door: 64 },
      { night: "Sat 31", ahead: 402, door: 66 },
      { night: "Sun 1", ahead: 190, door: 51 },
      { night: "Mon 2", ahead: 61, door: 36 },
      { night: "Tue 3", ahead: 122, door: 42 },
      { night: "Wed 4", ahead: 158, door: 45 },
    ],
  },
  kinds: {
    title: "Seats sold by session",
    note: "Of 1,800 in the dome, 360 in the hall, 154 on the deck",
    rows: [
      { kind: "show", label: "Dome shows", sold: 1264 },
      { kind: "talk", label: "Talks", sold: 312 },
      { kind: "telescope", label: "Telescope", sold: 119 },
    ],
  },
  tonight: {
    title: "Tonight",
    note: "Thursday 5 November · dark from 18:10",
    // prettier-ignore
    rows: [
      { id: "early-show", starts: "18:30", ends: "19:10", title: "The sky tonight", place: "Dome", host: "Henrietta Leavitt", seats: 120, taken: 84 },
      { id: "saturn-talk", starts: "19:30", ends: "20:15", title: "Saturn at opposition", place: "Lecture hall", host: "Vera Rubin", seats: 60, taken: 51 },
      { id: "refractor-2030", starts: "20:30", ends: "21:30", title: "Saturn at the Zeiss refractor", place: "Deck", host: "Jocelyn Bell", seats: 12, taken: 12 },
      { id: "late-show", starts: "21:00", ends: "21:40", title: "Andromeda and the local group", place: "Dome", host: "Henrietta Leavitt", seats: 120, taken: 31 },
      { id: "dobsonian-2200", starts: "22:00", ends: "22:45", title: "Deep sky with the Dobsonian", place: "Deck", host: "Cecilia Payne", seats: 10, taken: 7 },
    ],
  },
  bookings: {
    title: "Booked ahead",
    note: "Groups and members, the next ten days",
    // prettier-ignore
    rows: [
      { id: "b-1", who: "Østervang School", session: "The sky tonight", when: "Fri 6 Nov, 10:00", seats: 28 },
      { id: "b-2", who: "Ada Lovelace", session: "Saturn at the Zeiss refractor", when: "Sat 7 Nov, 20:30", seats: 2 },
      { id: "b-3", who: "Amateur Astronomers of Aarhus", session: "Deep sky with the Dobsonian", when: "Tue 10 Nov, 22:00", seats: 8 },
      { id: "b-4", who: "Mary Somerville", session: "Andromeda and the local group", when: "Thu 12 Nov, 21:00", seats: 4 },
    ],
  },
}

export interface Dashboard01Props {
  data?: Dashboard01Data
  title?: string
  className?: string
}

/** A heading on the canvas with one line under it, for the sections that sit on the canvas rather than a plane. */
function CanvasHeading({ title, note }: { title: string; note: string }) {
  return (
    <header className="mb-tight">
      <h2 className="m-0 text-lead leading-lead font-semibold">{title}</h2>
      <p className="m-0 text-small leading-small">{note}</p>
    </header>
  )
}

export function Dashboard01({
  data = SAMPLE,
  title = "The week at Meridian",
  className,
}: Dashboard01Props) {
  return (
    <div className={cn("@container text-(--text)", className)}>
      <div className="mx-auto max-w-[72rem] px-snug pt-section pb-page @min-[40rem]:px-line">
        <h1 className="m-0 text-h1 leading-h1 font-semibold text-balance">
          {title}
        </h1>
        <p className="m-0 mt-hair text-lead leading-lead">{data.period}</p>

        <section
          aria-label="Figures"
          className="mt-line grid grid-cols-2 gap-x-line gap-y-line @min-[56rem]:grid-cols-4 @min-[56rem]:gap-x-section"
        >
          {data.figures.map((figure) => (
            <Figure key={figure.label} {...figure} />
          ))}
        </section>

        <div className="mt-section grid gap-section @min-[56rem]:grid-cols-[minmax(0,1fr)_21rem] @min-[56rem]:gap-x-section">
          <Panel title={data.visitors.title} note={data.visitors.note}>
            <VisitorsChart nights={data.visitors.nights} />
          </Panel>
          <Panel
            title={data.kinds.title}
            note={data.kinds.note}
            className="@min-[56rem]:self-start"
          >
            <SeatsByKindChart kinds={data.kinds.rows} />
          </Panel>
          <section aria-label={data.tonight.title}>
            <CanvasHeading
              title={data.tonight.title}
              note={data.tonight.note}
            />
            <TonightTable sessions={data.tonight.rows} />
          </section>
          <section aria-label={data.bookings.title}>
            <CanvasHeading
              title={data.bookings.title}
              note={data.bookings.note}
            />
            <UpcomingBookings bookings={data.bookings.rows} />
          </section>
        </div>
      </div>
    </div>
  )
}

export default Dashboard01
