import type { ReactNode } from "react"
import { ArchFrame } from "@/serigraph/extras/arch-frame"
import { Folly } from "@/serigraph/extras/folly"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"
import { starPlate } from "./poster-extras/plate"

export const meta: DemoMeta = {
  title: "Arch frame",
  description:
    "Frames a picture or a drawing under a round arch, the way the poster looks out through its windows.",
  item: "arch-frame",
  group: "Serigraph extras",
}

function Figure({
  caption,
  children,
}: {
  caption: string
  children: ReactNode
}) {
  return (
    <figure className="m-0 flex flex-col gap-hair">
      {children}
      <figcaption className="max-w-[18rem] text-small leading-small">
        {caption}
      </figcaption>
    </figure>
  )
}

export default function ArchFrameDemo() {
  return (
    <>
      <DemoSection title="A folly">
        <StateRow label="sm · default · lg">
          <div className="flex flex-wrap items-end gap-line">
            <ArchFrame size="sm">
              <Folly template="window" seed="meridian-east" />
            </ArchFrame>
            <ArchFrame>
              <Folly template="window" seed="meridian-dome" />
            </ArchFrame>
            <ArchFrame size="lg">
              <Folly
                template="window"
                seed="meridian-planetarium"
                label="The planetarium's dome above the clouds"
              />
            </ArchFrame>
          </div>
        </StateRow>
      </DemoSection>
      <DemoSection title="An image">
        <StateRow label="Captioned">
          <Figure caption="Plate 114: the sky over the dome, 2 November, a ninety-second exposure.">
            <ArchFrame>
              <img
                src={starPlate("plate-114")}
                alt="Stars over the observatory dome, a crescent moon to the right"
                width={300}
                height={400}
              />
            </ArchFrame>
          </Figure>
        </StateRow>
        <StateRow label="Fill">
          <div className="w-full max-w-[22rem]">
            <ArchFrame size="fill">
              <Folly template="window" seed="meridian-zeiss" />
            </ArchFrame>
          </div>
        </StateRow>
      </DemoSection>
      <DemoSection title="On a plane">
        <StateRow label="Feature">
          <div className="plane flex w-full max-w-[34rem] flex-wrap items-center gap-line p-line">
            <ArchFrame size="sm">
              <Folly template="window" seed="meridian-night-walk" />
            </ArchFrame>
            <div className="flex max-w-[18rem] min-w-0 flex-1 basis-48 flex-col gap-hair">
              <p className="m-0 caps">Night walk</p>
              <p className="m-0">
                Up the east stair to the roof terrace, where the guides point
                out the autumn constellations by lantern.
              </p>
            </div>
          </div>
        </StateRow>
      </DemoSection>
    </>
  )
}
