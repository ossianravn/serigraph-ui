import type { ReactNode } from "react"
import { CloudBand, type CloudBandRole } from "@/serigraph/extras/cloud-band"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Cloud band",
  description:
    "Ends one section and opens the next: a seeded cloud bank on a flat baseline whose clouds run on into the section below.",
  item: "cloud-band",
  group: "Serigraph extras",
}

const FRAME =
  "w-full max-w-[44rem] overflow-hidden rounded-plane border-(length:--line) border-(--edge)"

/** A section in each role's colour, with the printed grain every surface has. */
const SPOT =
  "text-ink [background-image:var(--grain)] [background-size:var(--grain-size)]"
const SURFACE: Record<CloudBandRole, string> = {
  ground: "ground",
  canvas: "canvas",
  plane: `bg-plane ${SPOT}`,
  "plane-2": `bg-plane-2 ${SPOT}`,
  highlight: `bg-highlight ${SPOT}`,
  "tone-1": `bg-tone-1 ${SPOT}`,
  "tone-2": `bg-tone-2 ${SPOT}`,
  "tone-3": `bg-tone-3 ${SPOT}`,
  "tone-4": `bg-tone-4 ${SPOT}`,
}

/** Two sections of a page with the band between them. */
function Page({
  seed,
  above,
  below,
  top,
  bottom,
  className,
}: {
  seed: string
  above?: CloudBandRole
  below?: CloudBandRole
  top: ReactNode
  bottom: ReactNode
  className?: string
}) {
  return (
    <div className={FRAME}>
      <div className={`${SURFACE[above ?? "canvas"]} px-line pt-line`}>
        {top}
      </div>
      <CloudBand
        seed={seed}
        above={above ?? "canvas"}
        below={below}
        className={className}
      />
      <div className={`${SURFACE[below ?? "ground"]} px-line pt-hair pb-line`}>
        {bottom}
      </div>
    </div>
  )
}

const Kicker = ({ children }: { children: ReactNode }) => (
  <p className="m-0 caps">{children}</p>
)
const Text = ({ children }: { children: ReactNode }) => (
  <p className="m-0 mt-hair max-w-[34rem]">{children}</p>
)

export default function CloudBandDemo() {
  return (
    <>
      <DemoSection title="Between sections">
        <StateRow label="Onto ground">
          <Page
            seed="meridian-dome"
            top={
              <>
                <Kicker>The dome</Kicker>
                <Text>
                  The great refractor opens at dusk. Members queue at the east
                  stair; the slit turns towards Saturn at nine.
                </Text>
              </>
            }
            bottom={
              <>
                <Kicker>Visiting</Kicker>
                <Text>
                  Open Thursday to Sunday, 18:00 until the last clear hour.
                </Text>
              </>
            }
          />
        </StateRow>
        <StateRow label="Onto a tone">
          <Page
            seed="meridian-planetarium"
            below="tone-3"
            top={
              <>
                <Kicker>Planetarium</Kicker>
                <Text>
                  Under the projector: the winter sky as it stood over Meridian
                  in 1910, the year of the comet.
                </Text>
              </>
            }
            bottom={
              <>
                <Kicker>Showings</Kicker>
                <Text>Every hour on the half hour, forty minutes each.</Text>
              </>
            }
          />
        </StateRow>
        <StateRow label="From a plane">
          <Page
            seed="meridian-archive"
            above="plane-2"
            below="tone-4"
            top={
              <>
                <Kicker>The plate archive</Kicker>
                <Text>
                  Forty thousand glass negatives, catalogued by night.
                </Text>
              </>
            }
            bottom={
              <>
                <Kicker>Reading room</Kicker>
                <Text>By appointment, weekdays.</Text>
              </>
            }
          />
        </StateRow>
      </DemoSection>
      <DemoSection title="Height">
        <StateRow label="Low · tall">
          <div className="flex w-full max-w-[44rem] flex-col gap-snug">
            {(["h-20", "h-56"] as const).map((h) => (
              <div key={h} className={FRAME}>
                <CloudBand seed="meridian-lawn" above="canvas" className={h} />
                <div className="ground h-8" />
              </div>
            ))}
          </div>
        </StateRow>
      </DemoSection>
    </>
  )
}
