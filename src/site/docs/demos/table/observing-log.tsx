import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/serigraph/ui/table"

// Meridian's observing log up to last night: the 200 latest entries on the clear nights, newest first, in a fixed-height
// container. The head sticks and takes the canvas's colour while rows scroll under it; rows are divided by plain
// borders, so nothing is drawn or filtered per row. Made up but steady: every value comes from a small integer hash
// of the entry's place, so the server and the browser print the same log.

const TARGETS = [
  "Saturn",
  "Jupiter",
  "The Moon",
  "M31 Andromeda galaxy",
  "M45 Pleiades",
  "M13 Hercules cluster",
  "M57 Ring nebula",
  "M27 Dumbbell nebula",
  "NGC 869 Double cluster",
  "Albireo",
  "M33 Triangulum galaxy",
  "Uranus",
  "Mizar and Alcor",
  "M15",
  "Neptune",
  "M42 Orion nebula",
]
const INSTRUMENTS = ["Zeiss refractor", "Dobsonian", "15×70 binoculars"]
const OBSERVERS = [
  "Henrietta Leavitt",
  "Vera Rubin",
  "Jocelyn Bell",
  "Cecilia Payne",
  "Annie Jump Cannon",
  "Maria Mitchell",
]
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

/** A small integer hash: the same inputs give the same number everywhere. */
function hash(a: number, b: number) {
  let h =
    Math.imul(a ^ 0x9e3779b9, 0x85ebca6b) ^
    Math.imul(b + 0x632be5ab, 0xc2b2ae35)
  h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d)
  return (h ^ (h >>> 13)) >>> 0
}

interface Entry {
  no: number
  night: string
  time: string
  target: string
  instrument: string
  observer: string
  seeing: number
  minutes: number
}

const clock = (minute: number) => {
  const m = minute % (24 * 60)
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`
}

/** The last `count` entries before tonight, counting back night by night from Wednesday 4 November 2026. */
function observingLog(count: number): Entry[] {
  const nights: Entry[][] = []
  let total = 0
  for (let back = 0; total < count; back++) {
    if (hash(back, 1) % 10 < 4) continue // clouded out
    const date = new Date(Date.UTC(2026, 10, 4 - back))
    const night = `${DAYS[date.getUTCDay()]} ${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`
    const sessions = 2 + (hash(back, 2) % 3)
    let minute = 20 * 60 + (hash(back, 3) % 6) * 10
    const entries: Entry[] = []
    for (let s = 0; s < sessions; s++) {
      const h = hash(back, 10 + s)
      const minutes = 10 + (h % 8) * 5
      entries.push({
        no: 0,
        night,
        time: clock(minute),
        target: TARGETS[(h >>> 4) % TARGETS.length]!,
        instrument: INSTRUMENTS[(h >>> 8) % INSTRUMENTS.length]!,
        observer: OBSERVERS[(h >>> 12) % OBSERVERS.length]!,
        seeing: 1 + ((hash(back, 4) + s) % 5),
        minutes,
      })
      minute += minutes + 15 + ((h >>> 16) % 4) * 10
    }
    nights.push(entries)
    total += entries.length
  }
  // Numbered oldest first, as the log was kept; shown newest first.
  return nights
    .reverse()
    .flat()
    .slice(-count)
    .map((entry, i) => ({ ...entry, no: 1601 + i }))
    .reverse()
}

const LOG = observingLog(200)

export function ObservingLog() {
  return (
    <div className="w-full max-w-[52rem] *:data-[slot=table-container]:h-[26rem]">
      <Table aria-label="Observing log, 200 entries">
        <TableHeader>
          <TableRow>
            <TableHead className="text-end max-md:hidden">No.</TableHead>
            <TableHead>Night</TableHead>
            <TableHead className="text-end max-sm:hidden">Start</TableHead>
            <TableHead>Target</TableHead>
            <TableHead className="max-lg:hidden">Instrument</TableHead>
            <TableHead className="max-lg:hidden">Observer</TableHead>
            <TableHead className="text-end">Seeing</TableHead>
            <TableHead className="text-end max-sm:hidden">Min</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {LOG.map((e) => (
            <TableRow key={e.no}>
              <TableCell className="text-end font-mono text-small max-md:hidden">
                {e.no}
              </TableCell>
              <TableCell>{e.night}</TableCell>
              <TableCell className="text-end font-mono text-small max-sm:hidden">
                {e.time}
              </TableCell>
              <TableCell className="font-medium whitespace-normal">
                {e.target}
              </TableCell>
              <TableCell className="max-lg:hidden">{e.instrument}</TableCell>
              <TableCell className="max-lg:hidden">{e.observer}</TableCell>
              <TableCell className="text-end font-mono text-small">
                {e.seeing}/5
              </TableCell>
              <TableCell className="text-end font-mono text-small max-sm:hidden">
                {e.minutes}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
