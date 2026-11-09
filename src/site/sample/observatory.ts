// The docs' sample content: Meridian, an imaginary observatory and planetarium, with one night's sessions, the sky and
// a visitor. Plain data, the same on the server and in the browser.

export type Kind = "show" | "talk" | "telescope"

export interface Session {
  id: string
  /** Start and end, 24-hour. */
  starts: string
  ends: string
  title: string
  kind: Kind
  place: string
  host: string
  seats: number
  taken: number
  /** One line under the title. */
  note?: string
}

export interface SkyObject {
  name: string
  /** Where and when to look, in one short line. */
  where: string
  /** When to look, 24-hour: a window ("19:00–23:30") or a start ("from 21:40"). */
  best: string
  kind: "planet" | "moon" | "galaxy" | "cluster"
}

export interface Night {
  date: string
  darkFrom: string
  clearUntil: string
  /** 1–5: how steady the air is. */
  seeing: number
  moon: { rises: string; lit: number }
}

export interface Visitor {
  name: string
  email: string
  member: string
  /** Seats already held, by session id. */
  seats: Record<string, number>
}

export const KINDS: { value: Kind | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "show", label: "Shows" },
  { value: "talk", label: "Talks" },
  { value: "telescope", label: "Telescope" },
]

export const NIGHT: Night = {
  date: "Thursday 5 November",
  darkFrom: "18:10",
  clearUntil: "23:00",
  seeing: 4,
  moon: { rises: "22:14", lit: 4 },
}

export const SESSIONS: Session[] = [
  {
    id: "early-show",
    starts: "18:30",
    ends: "19:10",
    title: "The sky tonight",
    kind: "show",
    place: "Dome",
    host: "Henrietta Leavitt",
    seats: 120,
    taken: 84,
    note: "Forty minutes under the dome, narrated live.",
  },
  {
    id: "saturn-talk",
    starts: "19:30",
    ends: "20:15",
    title: "Saturn at opposition",
    kind: "talk",
    place: "Lecture hall",
    host: "Vera Rubin",
    seats: 60,
    taken: 51,
    note: "Why the rings look widest this year.",
  },
  {
    id: "refractor-2030",
    starts: "20:30",
    ends: "21:30",
    title: "Saturn at the Zeiss refractor",
    kind: "telescope",
    place: "Deck",
    host: "Jocelyn Bell",
    seats: 12,
    taken: 12,
  },
  {
    id: "late-show",
    starts: "21:00",
    ends: "21:40",
    title: "Andromeda and the local group",
    kind: "show",
    place: "Dome",
    host: "Henrietta Leavitt",
    seats: 120,
    taken: 31,
  },
  {
    id: "dobsonian-2200",
    starts: "22:00",
    ends: "22:45",
    title: "Deep sky with the Dobsonian",
    kind: "telescope",
    place: "Deck",
    host: "Cecilia Payne",
    seats: 10,
    taken: 7,
    note: "The deck closes at 22:45; clouds are expected after 23:00.",
  },
]

export const SKY: SkyObject[] = [
  {
    name: "Saturn",
    where: "South-east, 28° up",
    best: "19:00–23:30",
    kind: "planet",
  },
  {
    name: "Jupiter",
    where: "Rises in the east",
    best: "from 21:40",
    kind: "planet",
  },
  {
    name: "Andromeda",
    where: "Almost overhead",
    best: "from 20:00",
    kind: "galaxy",
  },
  {
    name: "Pleiades",
    where: "East, 35° up",
    best: "from 21:00",
    kind: "cluster",
  },
  {
    name: "Moon",
    where: "Rises in the east",
    best: "from 22:14",
    kind: "moon",
  },
]

export const VISITOR: Visitor = {
  name: "Ada Lovelace",
  email: "ada@meridian.dk",
  member: "0412",
  seats: { "saturn-talk": 2 },
}

export const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

export const seatsLeft = (s: Session) => Math.max(0, s.seats - s.taken)

/** A count as people write it: 1,199. */
export const count = (n: number) => n.toLocaleString("en-GB")

/** Minutes into the observing night: hours before 06:00 belong after midnight, so they sort last. */
const nightMinutes = (time: string) => {
  const [h = 0, m = 0] = time.split(":").map(Number)
  return (h < 6 ? h + 24 : h) * 60 + m
}

/** Sessions in the order they happen tonight. */
export const inTimeOrder = (sessions: Session[]) =>
  [...sessions].sort((a, b) => nightMinutes(a.starts) - nightMinutes(b.starts))
