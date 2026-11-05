import { Label } from "@/serigraph/ui/label"
import { Switch } from "@/serigraph/ui/switch"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Switch",
  description:
    "Turns a setting on or off at once: a pill track whose pinwheel thumb rolls as it slides.",
  item: "switch",
  group: "Forms",
}

export default function SwitchDemo() {
  return (
    <DemoSection title="States" columns={["Enabled", "Disabled"]}>
      <StateRow label="Off">
        <Label>
          <Switch /> Red light mode
        </Label>
        <Label>
          <Switch disabled /> Red light mode
        </Label>
      </StateRow>
      <StateRow label="On">
        <Label>
          <Switch defaultChecked /> Remind me at dusk
        </Label>
        <Label>
          <Switch defaultChecked disabled /> Remind me at dusk
        </Label>
      </StateRow>
      <StateRow label="Small">
        <Label>
          <Switch size="sm" defaultChecked /> Cloud alerts
        </Label>
        <Label>
          <Switch size="sm" disabled /> Cloud alerts
        </Label>
      </StateRow>
    </DemoSection>
  )
}
