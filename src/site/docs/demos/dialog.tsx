import type { ReactNode } from "react"
import { Button } from "@/serigraph/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/serigraph/ui/dialog"
import { Input } from "@/serigraph/ui/input"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Dialog",
  description:
    "A task that needs full attention before returning to the page: a plane centred over a fine screen of ink dots.",
  item: "dialog",
  group: "Overlays",
}

/** A field with its label above, in the capitals. */
function Field({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-hair">
      <label htmlFor={id} className="caps">
        {label}
      </label>
      {children}
    </div>
  )
}

export default function DialogDemo() {
  return (
    <DemoSection title="Open with the trigger">
      <StateRow label="Form">
        <Dialog>
          <DialogTrigger render={<Button />}>Book seats</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Saturn at opposition</DialogTitle>
              <DialogDescription>
                Thursday 5 November · the dome opens at 21:30
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-wrap gap-snug">
              <Field id="booking-name" label="Name">
                <Input
                  id="booking-name"
                  autoComplete="name"
                  placeholder="Ada Lovelace"
                  className="w-64 max-w-full"
                />
              </Field>
              <Field id="booking-seats" label="Seats">
                <Input
                  id="booking-seats"
                  defaultValue="2"
                  inputMode="numeric"
                  className="w-20 text-center tabular-nums"
                />
              </Field>
              <Field id="booking-email" label="Email for the tickets">
                <Input
                  id="booking-email"
                  type="email"
                  autoComplete="email"
                  placeholder="ada@meridian.dk"
                  className="w-72 max-w-full"
                />
              </Field>
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <DialogClose render={<Button />}>Book 2 seats</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </StateRow>
      <StateRow label="Footer close only">
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>
            Visiting rules
          </DialogTrigger>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>In the dome</DialogTitle>
              <DialogDescription>For every evening session</DialogDescription>
            </DialogHeader>
            <p className="m-0 max-w-measure">
              Red light only once the shutter opens: phones on night mode or in
              a pocket. The guide lines up each object; touch the eyepiece, not
              the telescope. Children under eight keep a hand on a grown-up.
            </p>
            <DialogFooter showCloseButton />
          </DialogContent>
        </Dialog>
      </StateRow>
      <StateRow label="Long title">
        <Dialog>
          <DialogTrigger render={<Button variant="ghost" />}>
            Move booking
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Move your seats from Saturn at opposition to the Leonids watch
                on Tuesday 17 November?
              </DialogTitle>
              <DialogDescription>
                The Leonids watch starts at 23:00 on the lawn, so bring a coat
                and a blanket. Your 240 kr carries over.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Keep Saturn
              </DialogClose>
              <DialogClose render={<Button />}>Move seats</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </StateRow>
    </DemoSection>
  )
}
