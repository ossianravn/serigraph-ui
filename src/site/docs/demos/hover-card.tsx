import { Folly } from "@/serigraph/extras/folly"
import { Avatar, AvatarFallback } from "@/serigraph/ui/avatar"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/serigraph/ui/hover-card"
import { SKY } from "@/site/sample/observatory"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Hover card",
  description:
    "A glance at what a link points to, such as a host or a planet, shown while the link is hovered or focused.",
  item: "hover-card",
  group: "Overlays",
}

const saturn = SKY.find((o) => o.name === "Saturn")!

export default function HoverCardDemo() {
  return (
    <DemoSection title="In a sentence">
      <StateRow label="A host">
        <p className="m-0 max-w-measure">
          Saturn at opposition, with{" "}
          <HoverCard>
            <HoverCardTrigger href="#vera-rubin" delay={200}>
              Vera Rubin
            </HoverCardTrigger>
            <HoverCardContent className="flex gap-snug">
              <Avatar size="lg" aria-hidden="true">
                <AvatarFallback name="Vera Rubin">VR</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-body leading-ui font-semibold">
                  Vera Rubin
                </span>
                <span>
                  Hosts the Thursday talks in the lecture hall. Ask her about
                  the outer rings.
                </span>
                <span className="font-mono">Next: Thu 5 Nov, 19:30</span>
              </div>
            </HoverCardContent>
          </HoverCard>{" "}
          in the lecture hall.
        </p>
      </StateRow>
      <StateRow label="A planet">
        <p className="m-0 max-w-measure">
          Tonight’s best target is{" "}
          <HoverCard>
            <HoverCardTrigger href="#saturn" delay={200}>
              Saturn
            </HoverCardTrigger>
            <HoverCardContent side="top" className="flex flex-col gap-tight">
              <Folly
                template="medallion"
                seed="saturn"
                className="size-20 self-center"
              />
              <div className="flex flex-col gap-1">
                <span className="text-body leading-ui font-semibold">
                  {saturn.name}
                </span>
                <span>{saturn.where}</span>
                <span className="font-mono">Best {saturn.best}</span>
              </div>
            </HoverCardContent>
          </HoverCard>
          , low in the south-east after dark.
        </p>
      </StateRow>
    </DemoSection>
  )
}
