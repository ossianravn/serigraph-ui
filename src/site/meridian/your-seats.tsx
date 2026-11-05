import { useState } from "react"
import { EllipsisIcon } from "lucide-react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/serigraph/ui/dropdown-menu"
import { NIGHT, type Session } from "./data"

interface Held {
  session: Session
  seats: number
}

const seatWord = (n: number) => (n === 1 ? "seat" : "seats")

// The seats you hold tonight, each on a plane: what, when and how many, and a menu to add a seat or release them.
// Releasing asks first, since the seats go back on sale at once.
export function YourSeats({
  held,
  bookable,
  onAdd,
  onRelease,
}: {
  held: Held[]
  /** Whether any session tonight still has seats, so the empty line can point to them. */
  bookable: boolean
  onAdd: (id: string) => void
  onRelease: (id: string) => void
}) {
  const [releasing, setReleasing] = useState<Held>()
  const [open, setOpen] = useState(false)
  if (held.length === 0)
    return (
      <p className="m-0">
        No seats held tonight.{bookable && " Book one below."}
      </p>
    )
  return (
    <>
      <ul className="m-0 grid list-none gap-tight p-0">
        {held.map(({ session, seats }) => (
          <li key={session.id} className="plane mer-held" data-tone="3">
            <span className="mer-time">{session.starts}</span>
            <div className="min-w-0">
              <p className="mer-session-title">{session.title}</p>
              <p className="mer-session-meta">
                {session.place} · {seats} {seatWord(seats)}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Seats for ${session.title}`}
                  />
                }
              >
                <EllipsisIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onAdd(session.id)}>
                  Add a seat
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    setReleasing({ session, seats })
                    setOpen(true)
                  }}
                >
                  Release seats
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        ))}
      </ul>
      <AlertDialog open={open} onOpenChange={setOpen}>
        {releasing && (
          <AlertDialogContent>
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
