import type { ReactNode } from "react"
import { Folly } from "@/serigraph/extras/folly"
import { AspectRatio } from "@/serigraph/ui/aspect-ratio"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Aspect ratio",
  description:
    "A frame that keeps its proportions as it resizes, holding a tinted well in place until the picture it frames has loaded.",
  item: "aspect-ratio",
  group: "Data display",
}

function Plate({
  ratio,
  caption,
  width,
  children,
}: {
  ratio: number
  caption: string
  width: string
  children?: ReactNode
}) {
  return (
    <figure className={`m-0 flex flex-col gap-hair ${width}`}>
      <AspectRatio ratio={ratio}>{children}</AspectRatio>
      <figcaption className="text-small leading-small">{caption}</figcaption>
    </figure>
  )
}

export default function AspectRatioDemo() {
  return (
    <DemoSection title="Ratios">
      <StateRow label="16 : 9">
        <Plate
          ratio={16 / 9}
          caption="Meridian from the lawn, an hour after dark"
          width="w-full max-w-[28rem]"
        >
          <Folly
            template="city"
            seed="meridian-lawn"
            data-colourway="night"
            className="bg-canvas"
          />
        </Plate>
      </StateRow>
      <StateRow label="3 : 4">
        <Plate
          ratio={3 / 4}
          caption="The Zeiss refractor’s dome at sunset"
          width="w-full max-w-[14rem]"
        >
          <Folly
            template="window"
            seed="zeiss-dome"
            data-colourway="coral"
            className="bg-canvas"
          />
        </Plate>
      </StateRow>
      <StateRow label="3 : 2, loading">
        <Plate
          ratio={3 / 2}
          caption="Jupiter at the refractor, Thursday 12 November"
          width="w-full max-w-[22rem]"
        />
      </StateRow>
    </DemoSection>
  )
}
