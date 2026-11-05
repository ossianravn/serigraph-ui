import type { ComponentProps } from "react"
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/serigraph/ui/native-select"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Native select",
  description:
    "Picks one value with the platform's own list, best on phones: a field with a chevron over the browser's select.",
  item: "native-select",
  group: "Forms",
}

const GUESTS = ["1", "2", "3", "4", "5", "6"] as const

function Guests(props: ComponentProps<typeof NativeSelect>) {
  return (
    <NativeSelect aria-label="Guests" className="w-24" {...props}>
      {GUESTS.map((n) => (
        <NativeSelectOption key={n} value={n}>
          {n}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  )
}

export default function NativeSelectDemo() {
  return (
    <>
      <DemoSection title="States" columns={["Enabled", "Disabled"]}>
        <StateRow label="Chosen">
          <Guests defaultValue="2" />
          <Guests defaultValue="2" disabled />
        </StateRow>
        <StateRow label="Placeholder">
          <NativeSelect aria-label="Night" defaultValue="" className="w-52">
            <NativeSelectOption value="" disabled>
              Choose a night
            </NativeSelectOption>
            <NativeSelectOption value="thu">Thursday 5 Nov</NativeSelectOption>
            <NativeSelectOption value="fri">Friday 6 Nov</NativeSelectOption>
            <NativeSelectOption value="sat">Saturday 7 Nov</NativeSelectOption>
          </NativeSelect>
        </StateRow>
        <StateRow label="Small">
          <Guests size="sm" defaultValue="4" />
        </StateRow>
        <StateRow label="Invalid">
          <Guests defaultValue="6" aria-invalid="true" />
        </StateRow>
      </DemoSection>
      <DemoSection title="Groups">
        <StateRow label="Show">
          <NativeSelect
            aria-label="Show"
            defaultValue="saturn"
            className="w-64"
          >
            <NativeSelectOptGroup label="Planetarium">
              <NativeSelectOption value="saturn">
                The rings of Saturn
              </NativeSelectOption>
              <NativeSelectOption value="moon">
                A year of moonrises
              </NativeSelectOption>
            </NativeSelectOptGroup>
            <NativeSelectOptGroup label="Under the sky">
              <NativeSelectOption value="leonids">
                Leonids from the roof
              </NativeSelectOption>
              <NativeSelectOption value="deck">
                Telescope deck
              </NativeSelectOption>
            </NativeSelectOptGroup>
          </NativeSelect>
        </StateRow>
      </DemoSection>
    </>
  )
}
