import { ArrowRightIcon, PlusIcon } from "lucide-react"
import { Button } from "@/serigraph/ui/button"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Button",
  description:
    "Starts an action: a pill in the action colour for the one thing to press, plane 2, a line or less for the rest.",
  item: "button",
  group: "Actions",
}

const VARIANTS = [
  ["default", "Book a seat"],
  ["secondary", "Add to tonight"],
  ["outline", "See the sky map"],
  ["ghost", "Later"],
  ["destructive", "Cancel booking"],
  ["link", "Visiting rules"],
] as const

export default function ButtonDemo() {
  return (
    <>
      <DemoSection title="Variants" columns={["At rest", "Disabled"]}>
        {VARIANTS.map(([variant, words]) => (
          <StateRow key={variant} label={variant}>
            <Button variant={variant}>{words}</Button>
            <Button variant={variant} disabled>
              {words}
            </Button>
          </StateRow>
        ))}
      </DemoSection>
      <DemoSection title="Sizes">
        <StateRow label="xs · sm · default · lg">
          <Button size="xs">Tag</Button>
          <Button size="sm">Save</Button>
          <Button>Save booking</Button>
          <Button size="lg">Open the dome</Button>
        </StateRow>
        <StateRow label="With icon">
          <Button>
            <PlusIcon data-icon="inline-start" /> Add a guest
          </Button>
          <Button variant="outline">
            Next night <ArrowRightIcon data-icon="inline-end" />
          </Button>
          <Button size="icon" variant="outline" aria-label="Add a guest">
            <PlusIcon />
          </Button>
        </StateRow>
      </DemoSection>
    </>
  )
}
