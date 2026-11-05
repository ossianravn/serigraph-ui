import { Progress, ProgressLabel, ProgressValue } from "@/serigraph/ui/progress"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Progress",
  description:
    "Shows how far a task has gone: a pill slot that fills with louvers of the action colour and ink.",
  item: "progress",
  group: "Forms",
}

const STATES = [
  ["Starting", 8, "Cooling the camera"],
  ["Halfway", 54, "Stacking 120 frames"],
  ["Complete", 100, "Saturn, 5 November"],
] as const

export default function ProgressDemo() {
  return (
    <DemoSection title="States">
      {STATES.map(([state, value, label]) => (
        <StateRow key={state} label={state}>
          <Progress value={value} className="w-full max-w-80">
            <ProgressLabel>{label}</ProgressLabel>
            <ProgressValue />
          </Progress>
        </StateRow>
      ))}
      <StateRow label="Unknown">
        <Progress value={null} className="w-full max-w-80">
          <ProgressLabel>Waiting for the dome to open</ProgressLabel>
        </Progress>
      </StateRow>
      <StateRow label="Bar only">
        <Progress
          value={72}
          aria-label="Seats sold for Saturday"
          className="w-full max-w-80"
        />
      </StateRow>
    </DemoSection>
  )
}
