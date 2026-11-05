import { NIGHT, SESSIONS, SKY, VISITOR } from "./data"
import type { Night, Session, SkyObject, Visitor } from "./data"

// Worst-case and edge data for the dev-only data switch (/meridian/data/<set>/<page>). Every value is one a real
// observatory's programme or a real visitor could produce: a collaboration's lecture title, a double-barrelled name,
// a long work email, a comet's designation, a session over midnight, a four-figure seat count. Never imported by the
// production pages.

const base = SESSIONS[0] as Session

const WORST_SESSIONS: Session[] = [
  {
    ...base,
    id: "w-lecture",
    starts: "19:00",
    ends: "20:30",
    title:
      "Gravitational waves, black-hole mergers and the next detectors: an evening with the LIGO–Virgo–KAGRA collaboration",
    kind: "talk",
    place: "Lecture hall B (step-free entrance from Nørre Allé)",
    host: "Aleksandra Wiśniewska-Kowalczyk",
    seats: 1200,
    taken: 1,
    note: "Live-captioned in Danish and English; the recording goes online a week later for members.",
  },
  {
    ...base,
    id: "w-comet",
    starts: "18:10",
    ends: "18:55",
    title: "Comet C/2023 A3 (Tsuchinshan–ATLAS)",
    kind: "telescope",
    place: "Deck",
    host: "Jo",
    seats: 6,
    taken: 5,
    note: undefined,
  },
  {
    ...base,
    id: "w-midnight",
    starts: "23:45",
    ends: "00:30",
    title: "Nordlys over Øresund",
    kind: "show",
    place: "Dome",
    host: "Nguyễn Thị Minh Khai",
    seats: 120,
    taken: 120,
  },
  {
    ...base,
    id: "w-short",
    starts: "09:00",
    ends: "09:20",
    title: "Sun",
    kind: "telescope",
    place: "Roof",
    host: "Ø",
    seats: 1,
    taken: 0,
    note: "Through the hydrogen-alpha filter only.",
  },
]

WORST_SESSIONS.push({
  ...base,
  id: "w-society",
  starts: "20:45",
  ends: "22:15",
  title:
    "Variable stars with the Danish Amateur Astronomical Society's observers (members and their guests)",
  kind: "telescope",
  place: "Deck",
  host: "Subrahmanyan Chandrasekhar",
  seats: 8,
  taken: 6,
})

const WORST_SKY: SkyObject[] = [
  {
    name: "Comet C/2023 A3 (Tsuchinshan–ATLAS)",
    where: "Low in the west-south-west after sunset, 8° up",
    best: "18:10–18:55",
    kind: "cluster",
  },
  ...SKY.slice(0, 2),
  {
    name: "NGC 2264, the Christmas Tree Cluster and the Cone Nebula",
    where: "East, after midnight",
    best: "00:30–05:00",
    kind: "cluster",
  },
]

const WORST_NIGHT: Night = {
  ...NIGHT,
  date: "Wednesday 31 December",
  seeing: 1,
  moon: { rises: "15:02", lit: 100 },
}

const WORST_VISITOR: Visitor = {
  name: "Aleksandra Wiśniewska-Kowalczyk",
  email: "bartholomew.fitzgerald@northwind-industries-holdings.example.com",
  member: "M-2024-000412",
  seats: { "w-society": 2, "w-comet": 1, "w-short": 1 },
}

export interface Dataset {
  night: Night
  sky: SkyObject[]
  sessions: Session[]
  visitor: Visitor
}

/** The data sets the switch offers, in its order. */
export const DATASETS: Record<"demo" | "worst" | "empty" | "one", Dataset> = {
  demo: { night: NIGHT, sky: SKY, sessions: SESSIONS, visitor: VISITOR },
  worst: {
    night: WORST_NIGHT,
    sky: WORST_SKY,
    sessions: WORST_SESSIONS,
    visitor: WORST_VISITOR,
  },
  empty: {
    night: { ...NIGHT, clearUntil: "18:00" },
    sky: [],
    sessions: [],
    visitor: { ...VISITOR, seats: {} },
  },
  one: {
    night: { ...NIGHT, seeing: 1, moon: { rises: "22:14", lit: 1 } },
    sky: SKY.slice(0, 1),
    sessions: [{ ...(SESSIONS[1] as Session), seats: 60, taken: 59 }],
    visitor: { ...VISITOR, seats: { "saturn-talk": 1 } },
  },
}
