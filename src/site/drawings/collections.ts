// What the drawings pages say about each collection: a line about it and the six drawings the overview shows. The
// collections themselves (names, titles, order, objects) are the kit's COLLECTIONS.
import { COLLECTIONS, type Thing } from "@/serigraph/follies"

const ABOUT: Record<string, { lead: string; picks: string[] }> = {
  architecture: {
    lead: "Weightless follies to stand in the clouds: spiral stairs and towers, a lighthouse, a gate, a bridge, a column and an obelisk.",
    picks: [
      "spiral-stair",
      "spiral-tower",
      "lighthouse",
      "gate",
      "bridge",
      "obelisk",
    ],
  },
  sky: {
    lead: "What hangs over the clouds: a gig-poster sun, a ringed planet, the moon and its phases, a comet, a rainbow and the stars.",
    picks: [
      "sun-rays",
      "ringed-planet",
      "crescent-moon",
      "comet",
      "rainbow",
      "constellation",
    ],
  },
  instruments: {
    lead: "An observatory's instruments and a navigator's: telescopes, a globe, an armillary sphere, a compass, a sextant and an hourglass.",
    picks: [
      "telescope",
      "great-telescope",
      "globe",
      "armillary-sphere",
      "compass",
      "hourglass",
    ],
  },
  garden: {
    lead: "A formal garden in the clouds: a cypress, clipped topiary, a palm, flowers in bloom, an urn, a fountain and an orange tree.",
    picks: ["cypress", "topiary", "palm", "poppy", "fountain", "orange-tree"],
  },
  travel: {
    lead: "Getting there and writing home: a balloon, a zeppelin, a kite, a sailboat, a suitcase, and letters, tickets and stamps.",
    picks: [
      "hot-air-balloon",
      "zeppelin",
      "kite",
      "sailboat",
      "envelope",
      "ticket",
    ],
  },
  stage: {
    lead: "The night of the gig: a microphone, a speaker stack, a spotlight, a record, the curtain and the column with the bill.",
    picks: [
      "microphone",
      "speaker-stack",
      "spotlight",
      "record",
      "curtain-stage",
      "advertising-column",
    ],
  },
  everyday: {
    lead: "For the moments every site has: a welcome, a locked page, a search, a notice, a task done and an idea.",
    picks: [
      "open-door",
      "padlock",
      "magnifier",
      "bell",
      "checklist",
      "lightbulb",
    ],
  },
}

export interface CollectionPage {
  key: string
  title: string
  href: string
  lead: string
  objects: Thing[]
  picks: Thing[]
}

export const COLLECTION_PAGES: CollectionPage[] = COLLECTIONS.map((c) => {
  const about = ABOUT[c.name]
  const picks = (about?.picks ?? [])
    .map((name) => c.things.find((t) => t.name === name))
    .filter((t): t is Thing => !!t)
  return {
    key: c.name,
    title: c.title,
    href: `/drawings/${c.name}`,
    lead: about?.lead ?? "",
    objects: c.things,
    picks: picks.length ? picks : c.things.slice(0, 6),
  }
})

/** Where a drawing opens: the Press, drawing that object from the same seed. */
export const pressHref = (object: string, seed: string) =>
  `/press?${new URLSearchParams({ object, seed })}`

/** A thing's title as a label: "a spiral stair" → "Spiral stair". */
export const labelOf = (t: Thing) => {
  const s = t.title.replace(/^(a|an|the) /i, "")
  return s.charAt(0).toUpperCase() + s.slice(1)
}
