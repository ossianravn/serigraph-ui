import { useRef, useState } from "react"
import { Folly } from "@/serigraph/extras/folly"
import { Button } from "@/serigraph/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/serigraph/ui/toggle-group"
import { BookDialog } from "./book-dialog"
import {
  inTimeOrder,
  KINDS,
  seatsLeft,
  SESSIONS,
  VISITOR,
  type Kind,
  type Session,
  type Visitor,
} from "./data"
import { SessionRow } from "./session-row"
import { YourSeats } from "./your-seats"

// Tonight's board, the one island on the page: the seats you hold, then the sessions with a filter by kind. Booking,
// adding a seat and releasing all change the same seats, so they live here together.
export function Tonight({
  sessions = SESSIONS,
  visitor = VISITOR,
}: {
  sessions?: Session[]
  visitor?: Visitor
}) {
  const [seats, setSeats] = useState(visitor.seats)
  const [kind, setKind] = useState<Kind | "all">("all")
  const [bookId, setBookId] = useState<string>()
  const [booking, setBooking] = useState(false)
  // After a booking the Book button is gone (the row shows the seats held), so focus moves to the new ticket's heading.
  const [booked, setBooked] = useState(false)
  const seatsHeading = useRef<HTMLHeadingElement>(null)

  const ordered = inTimeOrder(sessions)
  const shown = ordered.filter((s) => kind === "all" || s.kind === kind)
  const kindLabel = KINDS.find((k) => k.value === kind)?.label.toLowerCase()
  const held = ordered
    .filter((s) => (seats[s.id] ?? 0) > 0)
    .map((session) => ({ session, seats: seats[session.id] ?? 0 }))
  const book = (id: string) => {
    setBookId(id)
    setBooked(false)
    setBooking(true)
  }
  const release = (id: string) =>
    setSeats((now) =>
      Object.fromEntries(Object.entries(now).filter(([key]) => key !== id)),
    )

  return (
    <div className="mer-main">
      <section aria-labelledby="your-seats">
        <div className="mer-section-head">
          <h2 id="your-seats" ref={seatsHeading} tabIndex={-1}>
            Your seats
          </h2>
        </div>
        <YourSeats
          held={held}
          member={visitor.member}
          heading={seatsHeading}
          bookable={sessions.some((s) => seatsLeft(s) > 0)}
          onAdd={book}
          onRelease={release}
        />
      </section>
      <section aria-labelledby="sessions">
        <div className="mer-section-head">
          <h2 id="sessions">Sessions</h2>
          {sessions.length > 0 && (
            <ToggleGroup
              aria-label="Show"
              spacing={0}
              value={[kind]}
              onValueChange={(value) =>
                value[0] && setKind(value[0] as Kind | "all")
              }
            >
              {KINDS.map(({ value, label }) => (
                <ToggleGroupItem key={value} value={value}>
                  {label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          )}
        </div>
        {shown.length > 0 ? (
          <ul className="mer-sessions">
            {shown.map((session) => (
              <SessionRow
                key={session.id}
                session={session}
                held={seats[session.id] ?? 0}
                onBook={() => book(session.id)}
              />
            ))}
          </ul>
        ) : (
          <div className="mer-empty">
            <Folly template="doorway" seed={`empty ${kind}`} />
            <p>
              {sessions.length === 0
                ? "No sessions tonight. The programme for tomorrow is up at noon."
                : `No ${kindLabel} tonight.`}
            </p>
            {sessions.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setKind("all")}
              >
                Show all
              </Button>
            )}
          </div>
        )}
      </section>
      <BookDialog
        session={sessions.find((s) => s.id === bookId)}
        open={booking}
        onClose={() => setBooking(false)}
        finalFocus={booked ? seatsHeading : undefined}
        onBook={(id, count) => {
          setSeats((now) => ({ ...now, [id]: (now[id] ?? 0) + count }))
          setBooked(true)
          setBooking(false)
        }}
      />
    </div>
  )
}
