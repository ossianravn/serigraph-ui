import { useCallback, useSyncExternalStore } from "react"
import { Folly } from "@/serigraph/extras/folly"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "@/serigraph/ui/carousel"
import {
  SESSIONS,
  SKY,
  inTimeOrder,
  type SkyObject,
} from "@/site/meridian/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Carousel",
  description:
    "A row of slides to leaf through one at a time, such as the objects worth finding in tonight's sky.",
  item: "carousel",
  group: "Data display",
}

const TONES = ["1", "2", "3", "4"] as const

function SkySlide({ object, tone }: { object: SkyObject; tone: string }) {
  return (
    <figure
      className="plane m-0 flex h-full flex-col gap-snug p-snug"
      data-tone={tone}
    >
      <Folly
        template="window"
        seed={`tonight-${object.name}`}
        className="arch-frame w-full"
      />
      <figcaption className="flex flex-col gap-1">
        <span className="caps">{object.kind}</span>
        <span className="font-read text-lead leading-lead font-semibold">
          {object.name}
        </span>
        <span className="text-small leading-small">{object.where}</span>
        <span className="font-mono text-small">{object.best}</span>
      </figcaption>
    </figure>
  )
}

/** Which slide shows and how many there are: "2 / 5". */
function SlideCount() {
  const { api } = useCarousel()
  const subscribe = useCallback(
    (notify: () => void) => {
      if (!api) return () => {}
      api.on("select", notify)
      api.on("reInit", notify)
      return () => {
        api.off("select", notify)
        api.off("reInit", notify)
      }
    },
    [api],
  )
  const at = useSyncExternalStore(
    subscribe,
    () => (api ? api.selectedScrollSnap() + 1 : 1),
    () => 1,
  )
  const of = useSyncExternalStore(
    subscribe,
    () => api?.scrollSnapList().length ?? 0,
    () => 0,
  )
  return (
    <p
      className="m-0 mt-snug text-center font-mono text-small"
      aria-live="polite"
    >
      {of ? `${at} / ${of}` : " "}
    </p>
  )
}

export default function CarouselDemo() {
  const sessions = inTimeOrder(SESSIONS)
  return (
    <>
      <DemoSection title="Horizontal">
        <div className="w-full px-12">
          <Carousel
            opts={{ align: "start" }}
            aria-label="Tonight's sky"
            className="max-w-[44rem]"
          >
            <CarouselContent>
              {SKY.map((object, index) => (
                <CarouselItem
                  key={object.name}
                  aria-label={`${index + 1} of ${SKY.length}`}
                  className="sm:basis-1/2 lg:basis-1/3"
                >
                  <SkySlide
                    object={object}
                    tone={TONES[index % TONES.length]!}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            <SlideCount />
          </Carousel>
        </div>
      </DemoSection>
      <DemoSection title="Vertical">
        <StateRow label="One at a time">
          <div className="py-14">
            <Carousel
              orientation="vertical"
              aria-label="Tonight's sessions"
              className="w-60"
            >
              <CarouselContent className="h-36">
                {sessions.map((session, index) => (
                  <CarouselItem
                    key={session.id}
                    aria-label={`${index + 1} of ${sessions.length}`}
                  >
                    <article
                      className="plane flex h-full flex-col justify-between gap-tight p-snug"
                      data-tone={TONES[(index + 2) % TONES.length]}
                    >
                      <span className="font-mono text-small">
                        {session.starts}–{session.ends}
                      </span>
                      <span className="font-read text-body leading-ui font-semibold">
                        {session.title}
                      </span>
                      <span className="text-small leading-small">
                        {session.place}, with {session.host}
                      </span>
                    </article>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </StateRow>
      </DemoSection>
    </>
  )
}
