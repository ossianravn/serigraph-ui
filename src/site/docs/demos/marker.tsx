import { CalendarCheckIcon, PaperclipIcon, UserPlusIcon } from "lucide-react"
import { Marker, MarkerContent, MarkerIcon } from "@/serigraph/ui/marker"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Marker",
  description:
    "A line in a thread that is not a message: the day, where unread messages begin, or something that happened.",
  item: "marker",
  group: "Conversation",
}

function Line({ children }: { children: string }) {
  return (
    <p className="m-0 max-w-measure font-read text-body leading-body">
      {children}
    </p>
  )
}

export default function MarkerDemo() {
  return (
    <>
      <DemoSection title="Variants">
        <StateRow label="Separator">
          <Marker variant="separator" className="max-w-[34rem]">
            <MarkerContent>Thursday 5 November</MarkerContent>
          </Marker>
        </StateRow>
        <StateRow label="Unread">
          <Marker variant="separator" className="max-w-[34rem]">
            <MarkerContent className="bg-highlight">New</MarkerContent>
          </Marker>
        </StateRow>
        <StateRow label="Event">
          <Marker>
            <MarkerIcon>
              <PaperclipIcon />
            </MarkerIcon>
            <MarkerContent>
              Ada Lindqvist attached sky-chart-nov-5.png
            </MarkerContent>
          </Marker>
        </StateRow>
        <StateRow label="Border">
          <Marker variant="border" className="max-w-[34rem]">
            <MarkerContent>Earlier this week</MarkerContent>
          </Marker>
        </StateRow>
        <StateRow label="With a link">
          <Marker>
            <MarkerIcon>
              <UserPlusIcon />
            </MarkerIcon>
            <MarkerContent>
              Jonas Berg joined from <a href="#the-dome">the dome</a>
            </MarkerContent>
          </Marker>
        </StateRow>
      </DemoSection>
      <DemoSection title="In a thread">
        <div className="flex max-w-[38rem] flex-col gap-tight">
          <Marker variant="separator">
            <MarkerContent>Thursday 5 November</MarkerContent>
          </Marker>
          <Line>
            Is the seeing good enough for Saturn tonight? We could be there by
            nine.
          </Line>
          <Marker>
            <MarkerIcon>
              <CalendarCheckIcon />
            </MarkerIcon>
            <MarkerContent>
              Ada Lindqvist booked the Zeiss refractor · 21:30, two seats
            </MarkerContent>
          </Marker>
          <Marker variant="separator">
            <MarkerContent className="bg-highlight">New</MarkerContent>
          </Marker>
          <Line>
            You&rsquo;re booked. Come to the dome door at 21:20 and ring the
            bell; we keep the lights red.
          </Line>
        </div>
      </DemoSection>
    </>
  )
}
