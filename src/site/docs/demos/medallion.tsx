import { Medallion } from "@/serigraph/extras/medallion"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"
import { starPlate } from "./poster-extras/plate"

export const meta: DemoMeta = {
  title: "Medallion",
  description:
    "Sets a featured figure in a round frame: a picture or a seeded medallion drawing, shaded with fine stipple on its shadow side.",
  item: "medallion",
  group: "Serigraph extras",
}

const TONES = ["plane-2", "1", "2", "3", "4"] as const

export default function MedallionDemo() {
  return (
    <>
      <DemoSection title="A drawing">
        <StateRow label="sm · default · lg">
          <div className="flex flex-wrap items-center gap-line">
            <Medallion size="sm" seed="meridian-orrery" />
            <Medallion seed="meridian-dome" />
            <Medallion
              size="lg"
              seed="meridian-planetarium"
              label="A pinwheel sun seen through an arch"
            />
          </div>
        </StateRow>
        <StateRow label="Tones">
          <div className="flex flex-wrap items-center gap-snug">
            {TONES.map((tone) => (
              <Medallion
                key={tone}
                size="sm"
                tone={tone}
                seed={`meridian-season-${tone}`}
              />
            ))}
          </div>
        </StateRow>
      </DemoSection>
      <DemoSection title="An image">
        <StateRow label="Feature">
          <figure className="m-0 flex flex-wrap items-center gap-line">
            <Medallion size="lg">
              <img
                src={starPlate("plate-207", 300, 300)}
                alt="Stars over the observatory dome, a crescent moon to the right"
                width={300}
                height={300}
              />
            </Medallion>
            <figcaption className="flex max-w-[18rem] flex-col gap-hair">
              <span className="caps">Plate of the month</span>
              <span>
                The sky over the dome on 2 November, taken through the Zeiss
                refractor in ninety seconds.
              </span>
            </figcaption>
          </figure>
        </StateRow>
        <StateRow label="On a plane">
          <div className="plane flex w-full max-w-[34rem] flex-wrap items-center gap-line p-line">
            <Medallion tone="3" seed="meridian-lecture" />
            <div className="flex max-w-[18rem] min-w-0 flex-1 basis-48 flex-col gap-hair">
              <p className="m-0 caps">Thursday lecture</p>
              <p className="m-0">
                How a planetarium projector draws nine thousand stars from one
                lamp, with the machine itself on the stage.
              </p>
            </div>
          </div>
        </StateRow>
      </DemoSection>
    </>
  )
}
