import { OrdinalDate } from "@/serigraph/extras/ordinal-date"
import { PosterCard } from "@/serigraph/extras/poster-card"
import { Button } from "@/serigraph/ui/button"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Poster card",
  description:
    "Features one event under an arch window with a folly in it, the title lettered below; use it sparingly.",
  item: "poster-card",
  group: "Serigraph extras",
}

export default function PosterCardDemo() {
  return (
    <>
      <DemoSection title="Tones">
        <StateRow label="Plane">
          <PosterCard
            title="The rings of Saturn"
            kicker={
              <>
                Lecture theatre
                <span className="sep" aria-hidden="true">
                  •
                </span>
                <span className="sr-only">, </span>
                <OrdinalDate date="2026-11-05" />
              </>
            }
            action={<Button>Book a seat</Button>}
          >
            <p>
              Dr Ada Okafor on what the rings are made of and why they will not
              last.
            </p>
          </PosterCard>
        </StateRow>
        <StateRow label="Tone 4">
          <PosterCard
            tone="4"
            seed="terrace"
            title="Night walk"
            kicker={
              <>
                Terrace
                <span className="sep" aria-hidden="true">
                  •
                </span>
                <span className="sr-only">, </span>
                <OrdinalDate date="2026-11-08" format="short" />
              </>
            }
            action={<Button variant="secondary">Join the walk</Button>}
          >
            <p>Forty minutes under the dark sky, star chart in hand.</p>
          </PosterCard>
        </StateRow>
      </DemoSection>
      <DemoSection title="Long content">
        <StateRow label="Long title">
          <PosterCard
            tone="2"
            title="Comets, meteors and the long winter sky"
            kicker="Planetarium • Every Saturday in November"
          >
            <p>
              A season of four talks for anyone who wants to know what is up
              there and when to look for it, with a short show under the dome
              after each one.
            </p>
          </PosterCard>
        </StateRow>
      </DemoSection>
    </>
  )
}
