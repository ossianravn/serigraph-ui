import { useState, type RefObject } from "react"
import { TicketStub } from "@/serigraph/extras/ticket-stub"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/serigraph/ui/alert-dialog"
import { Button } from "@/serigraph/ui/button"
import { NIGHT, type Session } from "./data"

interface Held {
  session: Session
  seats: number
}

const seatWord = (n: number) => (n === 1 ? "seat" : "seats")

// The seats you hold tonight, each printed as a ticket: where, what, when and how many, with the two things you can do
// with it under the details. Releasing asks first, since the seats go back on sale at once; afterwards focus moves to
// the section's heading, since the ticket and its buttons are gone.
export function YourSeats({
  held,
  member,
  bookable,
  heading,
  onAdd,
  onRelease,
}: {
  held: Held[]
  /** The visitor's member number, printed on each ticket's stub. */
  member: string
  /** Whether any session tonight still has seats, so the empty line can point to them. */
  bookable: boolean
  /** The section's heading, where focus lands after a release. */
  heading: RefObject<HTMLElement | null>
  onAdd: (id: string) => void
  onRelease: (id: string) => void
}) {
  const [releasing, setReleasing] = useState<Held>()
  const [open, setOpen] = useState(false)
  const [released, setReleased] = useState(false)
  if (held.length === 0)
    return (
      <p className="m-0">
        No seats held tonight.{bookable && " Book one below."}
      </p>
    )
  return (
    <>
      <ul className="m-0 grid list-none gap-snug p-0">
        {held.map(({ session, seats }) => (
          <li key={session.id}>
            <TicketStub
              tone="3"
              kicker={<>Meridian · {session.place}</>}
              title={session.title}
              date={<>{NIGHT.date}</>}
              details={[
                { term: "Doors", value: session.starts },
                { term: "Ends", value: session.ends },
                { term: "Seats", value: seats },
              ]}
              number={member}
            >
              <div className="mt-tight flex flex-wrap gap-tight">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAdd(session.id)}
                  aria-label={`Add a seat for ${session.title}`}
                >
                  Add a seat
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setReleasing({ session, seats })
                    setReleased(false)
                    setOpen(true)
                  }}
                  aria-label={`Release your seats for ${session.title}`}
                >
                  Release
                </Button>
              </div>
            </TicketStub>
          </li>
        ))}
      </ul>
      <AlertDialog open={open} onOpenChange={setOpen}>
        {releasing && (
          <AlertDialogContent finalFocus={released ? heading : undefined}>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Release your seats for {releasing.session.title}?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Your {releasing.seats} {seatWord(releasing.seats)} on{" "}
                {NIGHT.date} at {releasing.session.starts} go back on sale at
                once.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep them</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() => {
                  setReleased(true)
                  onRelease(releasing.session.id)
                  setOpen(false)
                }}
              >
                Release seats
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>
    </>
  )
}
