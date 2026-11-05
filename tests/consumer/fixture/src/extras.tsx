import { Hero01 } from "@/serigraph/blocks/hero-01"
import { SignIn01 } from "@/serigraph/blocks/sign-in-01"
import { ColourwaySwitcher } from "@/serigraph/extras/colourway-switcher"
import { OrdinalDate } from "@/serigraph/extras/ordinal-date"
import { TicketStub } from "@/serigraph/extras/ticket-stub"

// The extras and blocks the install test adds: the hero and sign-in blocks as they come, a ticket, a date with its
// raised ordinal and the colourway switcher.
export function Extras() {
  return (
    <>
      <Hero01 />
      <div className="grid gap-6 p-6">
        <OrdinalDate date="2026-11-05" />
        <TicketStub title="Saturn at opposition" number="0412">
          Lecture hall, 19:30
        </TicketStub>
        <ColourwaySwitcher rows={["colourway"]} />
      </div>
      <SignIn01 />
    </>
  )
}
