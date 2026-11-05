import { Badge } from "@/serigraph/ui/badge"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Badge",
  description:
    "A short status or count beside what it describes: a small flat pill in the mono face.",
  item: "badge",
  group: "Data display",
}

export default function BadgeDemo() {
  return (
    <DemoSection title="Variants">
      <StateRow label="default">
        <Badge>Clear sky</Badge>
        <Badge>12 seats</Badge>
      </StateRow>
      <StateRow label="secondary">
        <Badge variant="secondary">Moon 4%</Badge>
        <Badge variant="secondary" data-tone="2">
          Saturn
        </Badge>
        <Badge variant="secondary" data-tone="3">
          Comet
        </Badge>
        <Badge variant="secondary" data-tone="4">
          Members
        </Badge>
      </StateRow>
      <StateRow label="outline">
        <Badge variant="outline">22:40</Badge>
      </StateRow>
      <StateRow label="destructive">
        <Badge variant="destructive">Clouded out</Badge>
      </StateRow>
    </DemoSection>
  )
}
