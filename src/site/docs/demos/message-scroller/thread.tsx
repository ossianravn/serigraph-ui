import type { ReactNode } from "react"
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/serigraph/ui/attachment"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/serigraph/ui/trace"
import { SKY_CHART } from "../conversation/sky-chart"

// The message scroller demo's conversation: Ada Lindqvist asks Meridian's assistant about tonight's seeing and sends
// her sky chart, the assistant checks the weather and answers, and Jonas Berg at the dome takes over. Thursday
// 5 November 2026.

export type Note =
  | {
      id: string
      kind: "marker"
      text: string
      unread?: boolean
      event?: boolean
    }
  | {
      id: string
      kind: "note"
      from: "ada" | "meridian" | "jonas"
      time: string
      body: ReactNode
    }

export const PEOPLE = {
  ada: { name: "Ada Lindqvist", initials: "AL", portrait: true, tone: "2" },
  meridian: { name: "Meridian", initials: "M", portrait: false, tone: "3" },
  jonas: { name: "Jonas Berg", initials: "JB", portrait: true, tone: "4" },
} as const

const chart = (
  <Attachment size="sm">
    <AttachmentMedia variant="image">
      <img src={SKY_CHART} alt="" />
    </AttachmentMedia>
    <AttachmentContent>
      <AttachmentTitle>sky-chart-nov-5.png</AttachmentTitle>
      <AttachmentDescription>Photo · 1.8 MB</AttachmentDescription>
    </AttachmentContent>
  </Attachment>
)

const checked = (
  <Trace>
    <TraceCollapsible>
      <TraceCollapsibleTrigger>
        <TraceLine status="done">
          <TraceIcon>3</TraceIcon>
          <TraceTitle>Checked the weather in three steps</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        Read the forecast for 21:00 to 23:00, the seeing from the dome&rsquo;s
        sensor, and the Zeiss refractor&rsquo;s bookings for tonight.
      </TraceCollapsibleContent>
    </TraceCollapsible>
  </Trace>
)

export const THREAD: Note[] = [
  { id: "day", kind: "marker", text: "Thursday 5 November" },
  {
    id: "n1",
    kind: "note",
    from: "ada",
    time: "18:40",
    body: "Is the seeing good enough for Saturn tonight? We’re coming up from town and could be there by nine.",
  },
  { id: "n2", kind: "note", from: "ada", time: "18:40", body: chart },
  {
    id: "n3",
    kind: "note",
    from: "meridian",
    time: "18:42",
    body: (
      <>
        {checked}
        It is: 4 of 5 after 21:00, clear until 23:00. Saturn is where your chart
        has it, low in the south. The Zeiss refractor is free from 21:30. Shall
        I hold two seats?
      </>
    ),
  },
  {
    id: "n4",
    kind: "note",
    from: "ada",
    time: "18:44",
    body: "Yes please. My daughter is seven; can she come on the deck?",
  },
  { id: "joined", kind: "marker", text: "Jonas Berg joined", event: true },
  {
    id: "n5",
    kind: "note",
    from: "jonas",
    time: "18:47",
    body: "Hi Ada, Jonas at the dome. She can: under-eights keep a hand on a grown-up, and she gets the step stool.",
  },
  { id: "new", kind: "marker", text: "New", unread: true },
  {
    id: "n6",
    kind: "note",
    from: "ada",
    time: "18:48",
    body: "Wonderful, thank you.",
  },
]

export const LATER: Note[] = [
  {
    id: "n7",
    kind: "note",
    from: "jonas",
    time: "18:49",
    body: "Held: the Zeiss refractor, 21:30 to 22:00, two seats. Ring the bell at the dome door; we keep the lights red.",
  },
  {
    id: "n8",
    kind: "note",
    from: "ada",
    time: "18:50",
    body: "See you at half past nine.",
  },
]
