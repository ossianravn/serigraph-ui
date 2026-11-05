import { Textarea } from "@/serigraph/ui/textarea"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Textarea",
  description:
    "A few lines of text, such as a note with a booking: the field's tint in a rounded box that grows as you write.",
  item: "textarea",
  group: "Forms",
}

const NOTE =
  "We're bringing my father, who uses a wheelchair. Could we sit near the dome's south door, and is the telescope deck reachable by lift?"

export default function TextareaDemo() {
  return (
    <DemoSection title="States">
      <StateRow label="Empty">
        <Textarea
          aria-label="Note for the observatory"
          placeholder="Anything we should know before your visit"
          className="max-w-measure"
        />
      </StateRow>
      <StateRow label="Filled">
        <Textarea
          aria-label="Note for the observatory"
          defaultValue={NOTE}
          className="max-w-measure"
        />
      </StateRow>
      <StateRow label="Invalid">
        <Textarea
          aria-label="Why you'd like telescope time"
          aria-invalid="true"
          defaultValue="Saturn"
          className="max-w-measure"
        />
      </StateRow>
      <StateRow label="Disabled">
        <Textarea
          aria-label="Note for the observatory"
          disabled
          defaultValue="Bookings for 5 November have closed."
          className="max-w-measure"
        />
      </StateRow>
    </DemoSection>
  )
}
