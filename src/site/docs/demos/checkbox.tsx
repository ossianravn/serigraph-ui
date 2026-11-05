import { Checkbox } from "@/serigraph/ui/checkbox"
import { Label } from "@/serigraph/ui/label"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Checkbox",
  description:
    "Turns one option on or off in a list of options: a rounded square that takes the highlight and a fine tick.",
  item: "checkbox",
  group: "Forms",
}

export default function CheckboxDemo() {
  return (
    <DemoSection title="States" columns={["Enabled", "Disabled"]}>
      <StateRow label="Unchecked">
        <Label>
          <Checkbox /> Planetarium show
        </Label>
        <Label>
          <Checkbox disabled /> Planetarium show
        </Label>
      </StateRow>
      <StateRow label="Checked">
        <Label>
          <Checkbox defaultChecked /> Telescope time
        </Label>
        <Label>
          <Checkbox defaultChecked disabled /> Telescope time
        </Label>
      </StateRow>
      <StateRow label="Partly">
        <Label>
          <Checkbox indeterminate /> All guests
        </Label>
        <Label>
          <Checkbox indeterminate disabled /> All guests
        </Label>
      </StateRow>
      <StateRow label="Invalid">
        <Label>
          <Checkbox aria-invalid="true" /> I accept the dark-sky rules
        </Label>
      </StateRow>
    </DemoSection>
  )
}
