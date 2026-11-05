import { GridIcon, MoonIcon, StarIcon } from "lucide-react"
import { Toggle } from "@/serigraph/ui/toggle"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Toggle",
  description:
    "A button that stays down while a mode is on, such as red-light mode: a pill that takes the highlight when pressed.",
  item: "toggle",
  group: "Forms",
}

const VARIANTS = ["default", "outline"] as const

export default function ToggleDemo() {
  return (
    <>
      <DemoSection title="Variants" columns={["Off", "On", "Disabled"]}>
        {VARIANTS.map((variant) => (
          <StateRow key={variant} label={variant}>
            <Toggle variant={variant}>
              <MoonIcon data-icon="inline-start" /> Red light
            </Toggle>
            <Toggle variant={variant} defaultPressed>
              <MoonIcon data-icon="inline-start" /> Red light
            </Toggle>
            <Toggle variant={variant} defaultPressed disabled>
              <MoonIcon data-icon="inline-start" /> Red light
            </Toggle>
          </StateRow>
        ))}
      </DemoSection>
      <DemoSection title="Sizes">
        <StateRow label="sm · default · lg">
          <Toggle size="sm" variant="outline" defaultPressed>
            Grid
          </Toggle>
          <Toggle variant="outline" defaultPressed>
            Star names
          </Toggle>
          <Toggle size="lg" variant="outline">
            Constellations
          </Toggle>
        </StateRow>
        <StateRow label="Icon only">
          <Toggle size="sm" aria-label="Show the grid" defaultPressed>
            <GridIcon />
          </Toggle>
          <Toggle variant="outline" aria-label="Keep for later">
            <StarIcon />
          </Toggle>
          <Toggle variant="outline" aria-label="Red light" defaultPressed>
            <MoonIcon />
          </Toggle>
        </StateRow>
      </DemoSection>
    </>
  )
}
