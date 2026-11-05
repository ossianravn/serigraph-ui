import { Separator } from "@/serigraph/ui/separator"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Separator",
  description:
    "Divides content inside a group: one fine line across it, or the same line turned between items in a row.",
  item: "separator",
  group: "Data display",
}

export default function SeparatorDemo() {
  return (
    <DemoSection title="Orientation">
      <StateRow label="horizontal">
        <div className="w-full max-w-[20rem]">
          <p className="m-0 font-read text-body leading-ui font-semibold">
            Meridian Observatory
          </p>
          <p className="m-0 mt-1 text-small leading-small">
            Public nights, Thursday to Saturday
          </p>
          <Separator className="my-snug" />
          <p className="m-0 text-small leading-small">
            Doors 20:30 · Dome closes 00:30
          </p>
        </div>
      </StateRow>
      <StateRow label="vertical">
        <div className="flex h-5 items-center gap-snug text-small leading-ui">
          <span>Tonight</span>
          <Separator orientation="vertical" />
          <span>Calendar</span>
          <Separator orientation="vertical" />
          <span>Members</span>
        </div>
      </StateRow>
    </DemoSection>
  )
}
