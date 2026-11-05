import { Input } from "@/serigraph/ui/input"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Input",
  description:
    "One line of text: a pill tinted from the surface beneath, as wide as the value it holds.",
  item: "input",
  group: "Forms",
}

export default function InputDemo() {
  return (
    <DemoSection title="States">
      <StateRow label="Empty">
        <Input placeholder="Ada Lovelace" aria-label="Name" className="w-64" />
      </StateRow>
      <StateRow label="Filled">
        <Input
          defaultValue="ada@meridian.dk"
          aria-label="Email"
          className="w-72"
        />
      </StateRow>
      <StateRow label="Short value">
        <Input
          defaultValue="4"
          aria-label="Guests"
          inputMode="numeric"
          className="w-20"
        />
      </StateRow>
      <StateRow label="Invalid">
        <Input
          defaultValue="ada@"
          aria-label="Email"
          aria-invalid="true"
          className="w-72"
        />
      </StateRow>
      <StateRow label="Disabled">
        <Input
          defaultValue="Member 0412"
          aria-label="Membership"
          disabled
          className="w-64"
        />
      </StateRow>
    </DemoSection>
  )
}
