import { Fragment } from "react"
import { Folly } from "@/serigraph/extras/folly"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/serigraph/ui/resizable"
import { NIGHT, SESSIONS, count, seatsLeft } from "@/site/meridian/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Resizable",
  description:
    "Panels side by side or stacked, divided by one fine line you can drag to give one of them more room.",
  item: "resizable",
  group: "Data display",
}

// The group fills its parent (react-resizable-panels sets height: 100% inline), so the parent sets the size and is
// the plane; it clips the panels to its corners.
const BOX = "plane w-full max-w-[44rem] overflow-hidden"
const TALK = SESSIONS.find((s) => s.id === "saturn-talk")!

const TONIGHT = [
  ["Booked", count(SESSIONS.reduce((n, s) => n + s.taken, 0))],
  ["Seats left", count(SESSIONS.reduce((n, s) => n + seatsLeft(s), 0))],
  ["Waiting list", "23"],
] as const

function Notes() {
  return (
    <div className="flex h-full flex-col gap-hair overflow-auto p-snug">
      <p className="m-0 caps">
        {TALK.place} · {TALK.starts}–{TALK.ends}
      </p>
      <h3 className="m-0 font-read text-lead leading-lead font-semibold">
        {TALK.title}
      </h3>
      <p className="m-0 max-w-measure">
        {TALK.note} {TALK.host} brings the slides from the Cassini flybys, and
        questions run until the deck opens at 20:30.
      </p>
      <p className="m-0 font-mono text-small tabular-nums">
        {count(seatsLeft(TALK))} of {TALK.seats} seats left
      </p>
    </div>
  )
}

export default function ResizableDemo() {
  return (
    <DemoSection title="Orientation">
      <StateRow label="Horizontal">
        <div className={`${BOX} h-72`}>
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize="38%" minSize="25%">
              <ul
                tabIndex={0}
                aria-label={`Sessions on ${NIGHT.date}`}
                className="m-0 flex h-full list-none flex-col gap-1 overflow-auto p-hair"
              >
                {SESSIONS.map((s) => (
                  <li
                    key={s.id}
                    aria-current={s.id === TALK.id ? "true" : undefined}
                    className="flex flex-col rounded-box px-tight py-1.5 aria-current:bg-highlight"
                  >
                    <span className="truncate leading-ui in-aria-current:font-semibold">
                      {s.title}
                    </span>
                    <span className="truncate font-mono text-small tabular-nums">
                      {s.starts}
                    </span>
                  </li>
                ))}
              </ul>
            </ResizablePanel>
            <ResizableHandle withHandle aria-label="Resize the list" />
            <ResizablePanel defaultSize="62%" minSize="35%">
              <Notes />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </StateRow>
      <StateRow label="Vertical">
        <div className={`${BOX} h-[24rem]`}>
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize="45%" minSize="25%">
              <Folly template="band" seed="meridian" className="size-full" />
            </ResizablePanel>
            <ResizableHandle withHandle aria-label="Resize the picture" />
            <ResizablePanel defaultSize="55%" minSize="25%">
              <Notes />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </StateRow>
      <StateRow label="Line only">
        <div className={`${BOX} h-40`}>
          <ResizablePanelGroup orientation="horizontal">
            {TONIGHT.map(([label, value], i) => (
              <Fragment key={label}>
                {i > 0 ? (
                  <ResizableHandle aria-label={`Resize ${label}`} />
                ) : null}
                <ResizablePanel defaultSize="33%" minSize="20%">
                  <div className="flex h-full flex-col justify-between p-snug">
                    <span className="caps">{label}</span>
                    <span className="font-mono text-h2 leading-h2 tabular-nums">
                      {value}
                    </span>
                  </div>
                </ResizablePanel>
              </Fragment>
            ))}
          </ResizablePanelGroup>
        </div>
      </StateRow>
    </DemoSection>
  )
}
