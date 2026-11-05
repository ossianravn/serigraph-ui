import { Checkbox } from "@/serigraph/ui/checkbox"
import { Label } from "@/serigraph/ui/label"
import { Switch } from "@/serigraph/ui/switch"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Label",
  description:
    "Names the control beside it in the reading voice; clicking it operates the control.",
  item: "label",
  group: "Forms",
}

export default function LabelDemo() {
  return (
    <DemoSection title="Beside a control">
      <StateRow label="Checkbox">
        <Label>
          <Checkbox defaultChecked /> Bring a red torch
        </Label>
      </StateRow>
      <StateRow label="Switch">
        <Label>
          <Switch /> Remind me at dusk
        </Label>
      </StateRow>
      <StateRow label="Disabled">
        <Label>
          <Checkbox disabled /> Telescope time (members only)
        </Label>
      </StateRow>
    </DemoSection>
  )
}
