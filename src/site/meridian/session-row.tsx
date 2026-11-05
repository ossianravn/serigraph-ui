import { Badge } from "@/serigraph/ui/badge"
import { Button } from "@/serigraph/ui/button"
import { count, seatsLeft, type Session } from "./data"

// One session between fine rules: its hours in the mono face, what it is and who hosts it, then what you can do.
// Booked shows how many seats you hold; full says so; otherwise the seats left and Book.
export function SessionRow({
  session,
  held,
  onBook,
}: {
  session: Session
  held: number
  onBook: () => void
}) {
  const left = seatsLeft(session)
  return (
    <li className="mer-session">
      <span className="mer-time">
        {session.starts}–{session.ends}
      </span>
      <div className="min-w-0">
        <p className="mer-session-title">{session.title}</p>
        <p className="mer-session-meta">
          {session.place} · {session.host}
          {session.note && <> · {session.note}</>}
        </p>
      </div>
      <div className="mer-session-act">
        {held > 0 ? (
          <Badge>
            {count(held)} {held === 1 ? "seat" : "seats"} held
          </Badge>
        ) : left === 0 ? (
          <Badge variant="outline">Full</Badge>
        ) : (
          <>
            <Badge variant="outline">{count(left)} left</Badge>
            <Button
              variant="secondary"
              size="sm"
              onClick={onBook}
              aria-label={`Book ${session.title}, ${session.starts}`}
            >
              Book
            </Button>
          </>
        )}
      </div>
    </li>
  )
}
