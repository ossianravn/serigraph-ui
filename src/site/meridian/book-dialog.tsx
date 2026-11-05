import { useState, type RefObject } from "react"
import { Button } from "@/serigraph/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/serigraph/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/serigraph/ui/field"
import { Input } from "@/serigraph/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/serigraph/ui/select"
import { NIGHT, seatsLeft, VISITOR, type Session } from "./data"

// Booking a session: the name on the tickets and how many seats, at most four or what is left. The main action names
// what it does ("Book 2 seats").
export function BookDialog({
  session,
  open,
  onClose,
  onBook,
  finalFocus,
}: {
  /** The last session chosen; it stays while the dialog closes, so the content leaves with it. */
  session: Session | undefined
  open: boolean
  onClose: () => void
  onBook: (id: string, seats: number) => void
  /** Where focus lands when the dialog closes; by default the control that opened it. */
  finalFocus?: RefObject<HTMLElement | null>
}) {
  const [name, setName] = useState(VISITOR.name)
  const [seats, setSeats] = useState("2")
  const most = session ? Math.min(4, seatsLeft(session)) : 1
  const options = Array.from({ length: most }, (_, i) => ({
    value: String(i + 1),
    label: i === 0 ? "1 seat" : `${i + 1} seats`,
  }))
  const count = Math.min(Number(seats), most)

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      {session && (
        <DialogContent finalFocus={finalFocus}>
          <DialogHeader>
            <DialogTitle>{session.title}</DialogTitle>
            <DialogDescription>
              {NIGHT.date} · {session.starts}–{session.ends} · {session.place}
            </DialogDescription>
          </DialogHeader>
          <form
            id="book-form"
            onSubmit={(event) => {
              event.preventDefault()
              onBook(session.id, count)
            }}
          >
            <FieldGroup className="flex-row flex-wrap gap-snug">
              <Field className="w-auto">
                <FieldLabel htmlFor="book-name">Name on the tickets</FieldLabel>
                <Input
                  id="book-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  required
                  className="w-64 max-w-full"
                />
              </Field>
              <Field className="w-auto">
                <FieldLabel htmlFor="book-seats">Seats</FieldLabel>
                <Select
                  items={options}
                  value={String(count)}
                  onValueChange={(value) => value && setSeats(value)}
                >
                  <SelectTrigger id="book-seats" className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </form>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit" form="book-form">
              Book {count === 1 ? "1 seat" : `${count} seats`}
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}
