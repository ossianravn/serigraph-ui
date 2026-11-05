import { Button } from "@/serigraph/ui/button"
import { Spinner } from "@/serigraph/ui/spinner"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Spinner",
  description:
    "Says something is on its way: a pinwheel turning at a steady pace, announced as loading.",
  item: "spinner",
  group: "Data display",
}

export default function SpinnerDemo() {
  return (
    <DemoSection title="Sizes and places">
      <StateRow label="size-4 · 6 · 8">
        <Spinner />
        <Spinner className="size-6" />
        <Spinner className="size-8" />
      </StateRow>
      <StateRow label="Beside text">
        <span className="inline-flex items-center gap-tight">
          <Spinner />
          Loading the sky map…
        </span>
      </StateRow>
      <StateRow label="In a button">
        <Button disabled>
          <Spinner data-icon="inline-start" />
          Booking
        </Button>
        <Button variant="outline" disabled>
          <Spinner data-icon="inline-start" />
          Checking the weather
        </Button>
      </StateRow>
    </DemoSection>
  )
}
