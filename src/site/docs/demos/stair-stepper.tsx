import { StairStepper } from "@/serigraph/extras/stair-stepper"
import { Card, CardContent, CardHeader, CardTitle } from "@/serigraph/ui/card"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Stair stepper",
  description:
    "Shows where someone is in a few steps, drawn as a stair seen from the side: done steps louvered, the current step in the highlight.",
  item: "stair-stepper",
  group: "Serigraph extras",
}

const BOOKING = ["Seats", "Details", "Pay", "Done"]

export default function StairStepperDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="First step">
          <StairStepper aria-label="Booking" steps={BOOKING} current={0} />
        </StateRow>
        <StateRow label="Halfway">
          <StairStepper aria-label="Booking" steps={BOOKING} current={2} />
        </StateRow>
        <StateRow label="Last step">
          <StairStepper aria-label="Booking" steps={BOOKING} current={3} />
        </StateRow>
        <StateRow label="Filled">
          <StairStepper
            aria-label="Booking"
            steps={BOOKING}
            current={2}
            done="filled"
          />
        </StateRow>
        <StateRow label="Compact">
          <StairStepper
            aria-label="Booking"
            steps={BOOKING}
            current={1}
            compact
          />
        </StateRow>
      </DemoSection>
      <DemoSection title="In context">
        <StateRow label="On a plane">
          <Card className="w-full max-w-[26rem]">
            <CardHeader>
              <CardTitle>Saturn at opposition</CardTitle>
            </CardHeader>
            <CardContent>
              <StairStepper aria-label="Booking" steps={BOOKING} current={1} />
            </CardContent>
          </Card>
        </StateRow>
        <StateRow label="Six steps">
          <StairStepper
            aria-label="Membership"
            steps={["Plan", "Name", "Address", "Payment", "Review", "Welcome"]}
            current={3}
          />
        </StateRow>
      </DemoSection>
    </>
  )
}
