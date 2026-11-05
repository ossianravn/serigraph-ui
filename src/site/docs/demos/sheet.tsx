import { Fragment } from "react"
import { Badge } from "@/serigraph/ui/badge"
import { Button } from "@/serigraph/ui/button"
import { Input } from "@/serigraph/ui/input"
import { Separator } from "@/serigraph/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/serigraph/ui/sheet"
import { inTimeOrder, NIGHT, SESSIONS, seatsLeft } from "@/site/meridian/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Sheet",
  description:
    "A plane laid against one edge of the window, for a session's details or a short task beside the page it came from.",
  item: "sheet",
  group: "Overlays",
}

const refractor = SESSIONS.find((s) => s.id === "refractor-2030")!

/** One session as a sheet of facts, full tonight, with its waiting list. */
function SessionSheet() {
  const facts = [
    ["Time", <span className="font-mono">20:30–21:30</span>],
    ["Place", "The observing deck"],
    ["Host", refractor.host],
    [
      "Seats",
      <span className="font-mono">
        {refractor.taken} of {refractor.seats}
      </span>,
    ],
  ] as const
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>{refractor.title}</SheetTitle>
        <SheetDescription>{NIGHT.date}</SheetDescription>
      </SheetHeader>
      <div className="flex min-h-0 flex-1 flex-col gap-snug overflow-y-auto px-(--sheet-spacing)">
        <dl className="m-0 grid grid-cols-[5rem_minmax(0,1fr)] gap-x-tight gap-y-hair leading-ui">
          {facts.map(([term, value]) => (
            <Fragment key={term}>
              <dt className="caps pt-0.5">{term}</dt>
              <dd className="m-0">{value}</dd>
            </Fragment>
          ))}
          <dt className="caps pt-0.5">Status</dt>
          <dd className="m-0">
            <Badge variant="outline">Full</Badge>
          </dd>
        </dl>
        <p className="m-0 max-w-measure">
          Twelve at a time on the deck, ten minutes each at the eyepiece. Join
          the waiting list and we will text you if a seat comes free before
          20:15.
        </p>
      </div>
      <SheetFooter>
        <SheetClose render={<Button variant="outline" />}>Close</SheetClose>
        <SheetClose render={<Button />}>Join waiting list</SheetClose>
      </SheetFooter>
    </SheetContent>
  )
}

/** Tonight's programme down the start edge. */
function ProgrammeSheet() {
  return (
    <SheetContent side="left">
      <SheetHeader>
        <SheetTitle>Tonight</SheetTitle>
        <SheetDescription>
          {NIGHT.date} · dark from {NIGHT.darkFrom}
        </SheetDescription>
      </SheetHeader>
      <ul className="m-0 flex min-h-0 list-none flex-col overflow-y-auto p-0 px-(--sheet-spacing) pb-(--sheet-spacing)">
        {inTimeOrder(SESSIONS).map((s, i) => (
          <li key={s.id}>
            {i > 0 && <Separator />}
            <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-tight py-tight">
              <span className="font-mono text-small leading-ui">
                {s.starts}
              </span>
              <span className="leading-ui">{s.title}</span>
              <span className="col-start-2 text-small leading-small">
                {s.place} ·{" "}
                {seatsLeft(s) ? `${seatsLeft(s)} seats left` : "Full"}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </SheetContent>
  )
}

export default function SheetDemo() {
  return (
    <>
      <DemoSection title="Open with the trigger">
        <StateRow label="Right (default)">
          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>
              Zeiss refractor, 20:30
            </SheetTrigger>
            <SessionSheet />
          </Sheet>
        </StateRow>
        <StateRow label="Left">
          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>
              Tonight’s programme
            </SheetTrigger>
            <ProgrammeSheet />
          </Sheet>
        </StateRow>
        <StateRow label="Bottom">
          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>
              Sky conditions
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>Clear until {NIGHT.clearUntil}</SheetTitle>
                <SheetDescription className="max-w-measure">
                  Dark from {NIGHT.darkFrom}. Seeing {NIGHT.seeing} of 5, steady
                  enough for Saturn’s rings. The Moon rises at{" "}
                  {NIGHT.moon.rises}, {NIGHT.moon.lit}% lit.
                </SheetDescription>
              </SheetHeader>
              <SheetFooter>
                <SheetClose render={<Button />}>Done</SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </StateRow>
        <StateRow label="Top">
          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>
              Deck notice
            </SheetTrigger>
            <SheetContent side="top">
              <SheetHeader>
                <SheetTitle>The deck closes at 22:45</SheetTitle>
                <SheetDescription className="max-w-measure">
                  Clouds are expected after 23:00. Sessions under the dome go on
                  as planned.
                </SheetDescription>
              </SheetHeader>
              <SheetFooter>
                <SheetClose render={<Button variant="outline" />}>
                  Understood
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </StateRow>
      </DemoSection>
      <DemoSection title="A short task">
        <StateRow label="Form">
          <Sheet>
            <SheetTrigger render={<Button />}>Change booking</SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Saturn at opposition</SheetTitle>
                <SheetDescription>19:30 · the lecture hall</SheetDescription>
              </SheetHeader>
              <form
                className="flex flex-col gap-snug px-(--sheet-spacing)"
                onSubmit={(event) => event.preventDefault()}
              >
                <label className="flex flex-col gap-hair">
                  <span className="caps">Name on the tickets</span>
                  <Input
                    defaultValue="Ada Lovelace"
                    autoComplete="name"
                    className="w-64 max-w-full"
                  />
                </label>
                <label className="flex flex-col gap-hair">
                  <span className="caps">Seats</span>
                  <Input
                    defaultValue="2"
                    inputMode="numeric"
                    className="w-20 text-center tabular-nums"
                  />
                </label>
              </form>
              <SheetFooter>
                <SheetClose render={<Button variant="outline" />}>
                  Cancel
                </SheetClose>
                <SheetClose render={<Button />}>Save</SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </StateRow>
      </DemoSection>
    </>
  )
}
