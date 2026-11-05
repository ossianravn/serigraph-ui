import { Skeleton } from "@/serigraph/ui/skeleton"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Skeleton",
  description:
    "Holds the place of content still loading: a tint in that content's own shape, breathing slowly.",
  item: "skeleton",
  group: "Data display",
}

export default function SkeletonDemo() {
  return (
    <DemoSection title="Shapes">
      <StateRow label="Guest">
        <div className="flex items-center gap-snug" aria-busy="true">
          <Skeleton className="size-10 rounded-full" />
          <div className="grid gap-hair">
            <Skeleton className="h-4 w-[11rem]" />
            <Skeleton className="h-3 w-[7.5rem]" />
          </div>
        </div>
      </StateRow>
      <StateRow label="Sky map">
        <div className="grid w-full max-w-[20rem] gap-tight" aria-busy="true">
          <Skeleton className="aspect-[16/10] w-full rounded-plane" />
          <Skeleton className="h-4 w-[70%]" />
          <Skeleton className="h-3 w-[45%]" />
        </div>
      </StateRow>
      <StateRow label="Button">
        <Skeleton className="h-control w-[8.5rem] rounded-full" />
      </StateRow>
    </DemoSection>
  )
}
