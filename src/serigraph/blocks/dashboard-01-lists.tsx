"use client"

import { Avatar, AvatarFallback } from "@/serigraph/ui/avatar"
import { Badge } from "@/serigraph/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/serigraph/ui/table"
import { count } from "@/serigraph/blocks/dashboard-01-charts"

// The dashboard's lists, usable on their own: tonight's sessions as a ledger on the canvas, and the bookings coming
// up as an open list between fine lines.

export interface TonightSession {
  id: string
  /** Start and end, 24-hour. */
  starts: string
  ends: string
  title: string
  place: string
  host: string
  seats: number
  taken: number
}

/** Seats left as a badge: "Full" in outline, otherwise how many in the highlight. */
function SeatsLeft({ session }: { session: TonightSession }) {
  const left = Math.max(0, session.seats - session.taken)
  return left === 0 ? (
    <Badge variant="outline">Full</Badge>
  ) : (
    <Badge>{count(left)} left</Badge>
  )
}

/**
 * Tonight's sessions: when in mono, what and where, seats taken of seats. In a table narrower than 30rem (a phone)
 * the place moves under the title and the badge under the seats, so no column is squeezed to a word a line.
 */
export function TonightTable({ sessions }: { sessions: TonightSession[] }) {
  if (!sessions.length)
    return <p className="m-0 text-body leading-body">No sessions tonight.</p>
  return (
    <div className="@container/tonight">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="ps-0">Time</TableHead>
            <TableHead>Session</TableHead>
            <TableHead className="@max-[30rem]/tonight:hidden">Place</TableHead>
            <TableHead className="text-end">Seats</TableHead>
            <TableHead className="pe-0 @max-[30rem]/tonight:hidden">
              <span className="sr-only">Left</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="ps-0 align-top font-mono text-small">
                {s.starts}
                <span className="block">{s.ends}</span>
              </TableCell>
              <TableCell className="align-top whitespace-normal">
                {s.title}
                <span className="block text-small leading-small">
                  {s.host}
                  <span className="@min-[30rem]/tonight:hidden">
                    {" "}
                    · {s.place}
                  </span>
                </span>
              </TableCell>
              <TableCell className="align-top @max-[30rem]/tonight:hidden">
                {s.place}
              </TableCell>
              <TableCell className="text-end align-top font-mono text-small">
                {count(s.taken)}
                <span> / {count(s.seats)}</span>
                <span className="mt-hair block @min-[30rem]/tonight:hidden">
                  <SeatsLeft session={s} />
                </span>
              </TableCell>
              <TableCell className="pe-0 text-end align-top @max-[30rem]/tonight:hidden">
                <SeatsLeft session={s} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export interface Booking {
  id: string
  /** Who booked: a person, a school, a society. */
  who: string
  /** What they booked: "The sky tonight". */
  session: string
  /** When, short: "Fri 6 Nov, 10:00". */
  when: string
  seats: number
}

const initials = (name: string) =>
  name
    .split(/\s+/u)
    .filter((word) => /^\p{Lu}/u.test(word))
    .slice(0, 2)
    .map((word) => word[0])
    .join("")

/** Bookings coming up, between fine lines: who in a tone circle, what and when, and how many seats in mono. */
export function UpcomingBookings({ bookings }: { bookings: Booking[] }) {
  if (!bookings.length)
    return <p className="m-0 text-body leading-body">Nothing booked ahead.</p>
  return (
    <ul className="m-0 list-none p-0">
      {bookings.map((b, i) => (
        <li
          key={b.id}
          className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-tight border-[var(--edge)] py-tight not-last:border-b-(length:--line)"
        >
          <Avatar data-tone={String((i % 4) + 1)} className="mt-0.5">
            <AvatarFallback>{initials(b.who)}</AvatarFallback>
          </Avatar>
          <span className="min-w-0">
            <span className="block leading-ui font-semibold">{b.who}</span>
            <span className="mt-1 block text-small leading-small">
              {b.session}
              <span className="block">{b.when}</span>
            </span>
          </span>
          <span className="pt-0.5 font-mono text-small whitespace-nowrap">
            {count(b.seats)} {b.seats === 1 ? "seat" : "seats"}
          </span>
        </li>
      ))}
    </ul>
  )
}
