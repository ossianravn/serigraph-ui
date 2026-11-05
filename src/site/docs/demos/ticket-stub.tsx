import { OrdinalDate } from "@/serigraph/extras/ordinal-date"
import { TicketStub } from "@/serigraph/extras/ticket-stub"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Ticket stub",
  description:
    "Shows a booked seat as a printed ticket: a plane in a tone with a stub behind a tear line, the number in mono and ADMIT ONE.",
  item: "ticket-stub",
  group: "Serigraph extras",
}

const DETAILS = [
  { term: "Doors", value: "21:00" },
  { term: "Row", value: "F" },
  { term: "Seat", value: "14" },
]

export default function TicketStubDemo() {
  return (
    <>
      <DemoSection title="Tones">
        <StateRow label="Tone 1">
          <TicketStub
            kicker="Meridian Observatory • The dome"
            title="Saturn at opposition"
            date={<OrdinalDate date="2026-11-05" />}
            details={DETAILS}
            number="0417"
          />
        </StateRow>
        <StateRow label="Plane 2">
          <TicketStub
            tone="plane-2"
            kicker="Meridian Observatory • Terrace"
            title="Telescope evening"
            date={<OrdinalDate date="2026-11-08" />}
            details={[
              { term: "From", value: "19:30" },
              { term: "Party", value: "2" },
            ]}
            number="0532"
            admit="Admit two"
          />
        </StateRow>
        <StateRow label="Tone 3">
          <TicketStub
            tone="3"
            kicker="Planetarium"
            title="The children's sky"
            date={<OrdinalDate date="2026-11-07" />}
            details={[{ term: "Seat", value: "Any" }]}
            number="0588"
          />
        </StateRow>
      </DemoSection>
      <DemoSection title="Long content">
        <StateRow label="Long title">
          <TicketStub
            tone="4"
            kicker="Meridian Observatory • Lecture theatre and the dome"
            title="The rings of Saturn, the moons of Jupiter and a comet if the sky clears"
            date={<OrdinalDate date="2026-11-12" />}
            details={[
              { term: "Doors", value: "18:45" },
              { term: "Row", value: "AA" },
              { term: "Seat", value: "112" },
              { term: "Price", value: "£14.50" },
            ]}
            number="00012345"
          />
        </StateRow>
      </DemoSection>
    </>
  )
}
