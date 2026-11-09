import { useState } from "react"
import { Card } from "@/serigraph/ui/card"
import { Checkbox } from "@/serigraph/ui/checkbox"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/serigraph/ui/table"
import {
  NIGHT,
  SESSIONS,
  count,
  inTimeOrder,
  seatsLeft,
} from "@/site/sample/observatory"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"
import { ObservingLog } from "./table/observing-log"

export const meta: DemoMeta = {
  title: "Table",
  description:
    "Records that compare across columns: heads in capitals over a fine line, rows divided by the same line, figures that line up.",
  item: "table",
  group: "Data display",
}

const TONIGHT = inTimeOrder(SESSIONS)
const seats = TONIGHT.reduce((sum, s) => sum + s.seats, 0)
const taken = TONIGHT.reduce((sum, s) => sum + s.taken, 0)

/** Tonight's telescope slots on the deck, ten minutes each at the eyepiece. */
const SLOTS = [
  { time: "20:30", target: "Saturn", scope: "Zeiss refractor", left: 0 },
  { time: "20:45", target: "Saturn", scope: "Zeiss refractor", left: 2 },
  { time: "21:50", target: "Jupiter", scope: "Zeiss refractor", left: 4 },
  { time: "22:00", target: "M31 Andromeda", scope: "Dobsonian", left: 3 },
  { time: "22:20", target: "M45 Pleiades", scope: "Dobsonian", left: 6 },
]

function SlotPicker() {
  const [chosen, setChosen] = useState<string[]>(["20:45", "22:00"])
  const open = SLOTS.filter((s) => s.left > 0).map((s) => s.time)
  const all = open.every((t) => chosen.includes(t))
  const choose = (time: string, on: boolean) =>
    setChosen((list) => (on ? [...list, time] : list.filter((t) => t !== time)))
  return (
    <Table>
      <TableCaption>
        {chosen.length} of {open.length} open slots chosen for the deck tonight.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">
            <Checkbox
              aria-label="Choose every open slot"
              checked={all}
              indeterminate={!all && chosen.length > 0}
              onCheckedChange={(on) => setChosen(on ? open : [])}
            />
          </TableHead>
          <TableHead className="text-end">Time</TableHead>
          <TableHead>Target</TableHead>
          <TableHead className="text-end">Left</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {SLOTS.map((s) => (
          <TableRow
            key={s.time}
            data-state={chosen.includes(s.time) ? "selected" : undefined}
          >
            <TableCell>
              <Checkbox
                aria-label={`Choose ${s.target} at ${s.time}`}
                checked={chosen.includes(s.time)}
                disabled={s.left === 0}
                onCheckedChange={(on) => choose(s.time, on)}
              />
            </TableCell>
            <TableCell className="text-end font-mono text-small">
              {s.time}
            </TableCell>
            <TableCell className="whitespace-normal">
              {s.target}
              <span className="block text-small leading-small">{s.scope}</span>
            </TableCell>
            <TableCell className="text-end font-mono text-small">
              {s.left || "Full"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function TableDemo() {
  return (
    <>
      <DemoSection title="Ledger">
        <StateRow label="On the canvas">
          <div className="w-full max-w-[40rem] [contain:inline-size]">
            <Table>
              <TableCaption>Tonight’s sessions, {NIGHT.date}.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-end">Starts</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead className="max-sm:hidden">Place</TableHead>
                  <TableHead className="text-end max-sm:hidden">
                    Seats
                  </TableHead>
                  <TableHead className="text-end">Left</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TONIGHT.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="text-end font-mono text-small">
                      {s.starts}
                    </TableCell>
                    <TableCell className="font-medium whitespace-normal">
                      {s.title}
                    </TableCell>
                    <TableCell className="max-sm:hidden">{s.place}</TableCell>
                    <TableCell className="text-end font-mono text-small max-sm:hidden">
                      {s.seats}
                    </TableCell>
                    <TableCell className="text-end font-mono text-small">
                      {seatsLeft(s) || "Full"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2}>{TONIGHT.length} sessions</TableCell>
                  <TableCell className="max-sm:hidden" />
                  <TableCell className="text-end font-mono text-small max-sm:hidden">
                    {count(seats)}
                  </TableCell>
                  <TableCell className="text-end font-mono text-small">
                    {count(seats - taken)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </StateRow>
        <StateRow label="Selected rows · on a plane">
          <Card className="w-full max-w-[30rem] px-snug py-tight [contain:inline-size]">
            <SlotPicker />
          </Card>
        </StateRow>
      </DemoSection>
      <DemoSection title="200 rows, sticky head">
        <ObservingLog />
      </DemoSection>
    </>
  )
}
