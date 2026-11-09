import { Avatar, AvatarFallback } from "@/serigraph/ui/avatar"
import { Badge } from "@/serigraph/ui/badge"
import { Button } from "@/serigraph/ui/button"
import { Calendar } from "@/serigraph/ui/calendar"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/serigraph/ui/card"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/serigraph/ui/resizable"
import { ScrollArea } from "@/serigraph/ui/scroll-area"
import { Separator } from "@/serigraph/ui/separator"
import { SESSIONS } from "@/site/sample/observatory"
import { Scaled } from "./parts"

// Panels and people whose demo opens with a part taller than a card's plate, or so small it reads as a speck: the
// same parts at a size the plate holds, with Meridian's content.

/** The calendar's month with its first and last weeks left out, so the plate holds it at a readable size. */
function CalendarPreview() {
  return (
    <Scaled
      by={0.85}
      className="[&_tbody_tr:first-child]:hidden [&_tbody_tr:nth-child(n+5)]:hidden"
    >
      <Calendar
        mode="range"
        weekStartsOn={1}
        today={new Date(2026, 10, 5)}
        defaultMonth={new Date(2026, 10, 5)}
        selected={{ from: new Date(2026, 10, 12), to: new Date(2026, 10, 14) }}
      />
    </Scaled>
  )
}

function AvatarPreview() {
  return (
    <div className="flex items-center gap-snug">
      <Avatar size="lg" data-tone="3">
        <AvatarFallback>VR</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback name="Henrietta Leavitt">HL</AvatarFallback>
      </Avatar>
      <Avatar size="lg" data-tone="1">
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
    </div>
  )
}

function CardPreview() {
  return (
    <Card size="sm" className="w-[19rem]">
      <CardHeader>
        <CardTitle>Saturn at opposition</CardTitle>
        <CardDescription>Thursday 5 November, from 21:30</CardDescription>
        <CardAction>
          <Badge>9 seats</Badge>
        </CardAction>
      </CardHeader>
      <CardFooter>
        <Button size="sm">Book a seat</Button>
      </CardFooter>
    </Card>
  )
}

const TALK = SESSIONS[1]!

function ResizablePreview() {
  return (
    <div className="plane h-40 w-[19rem] overflow-hidden">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize="42%">
          <ul className="m-0 flex list-none flex-col gap-1 p-hair">
            {SESSIONS.slice(0, 3).map((s) => (
              <li
                key={s.id}
                className={`flex flex-col rounded-box px-tight py-1 ${s.id === TALK.id ? "bg-highlight" : ""}`}
              >
                <span className="truncate text-small leading-ui">
                  {s.title}
                </span>
                <span className="font-mono text-small">{s.starts}</span>
              </li>
            ))}
          </ul>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="58%">
          <div className="flex flex-col gap-1 p-tight">
            <span className="caps">{TALK.place}</span>
            <span className="leading-ui font-semibold">{TALK.title}</span>
            <span className="text-small leading-small">{TALK.note}</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

function ScrollAreaPreview() {
  return (
    <ScrollArea className="plane h-44 w-[17rem] rounded-box">
      <div className="px-snug py-tight">
        <p className="m-0 mb-hair caps">November · 14 evenings</p>
        {SESSIONS.slice(0, 6).map((s, i) => (
          <div key={s.id}>
            {i > 0 && <Separator />}
            <p className="m-0 flex items-baseline justify-between gap-snug py-hair leading-ui">
              <span className="min-w-0 truncate">{s.title}</span>
              <span className="shrink-0 font-mono text-small">{s.starts}</span>
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

export const PANEL_PREVIEWS = {
  calendar: CalendarPreview,
  avatar: AvatarPreview,
  card: CardPreview,
  resizable: ResizablePreview,
  "scroll-area": ScrollAreaPreview,
}
