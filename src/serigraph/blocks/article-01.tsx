"use client"

import type { ReactNode } from "react"
import { SaturnStory } from "@/serigraph/blocks/article-01-story"
import { Lettering } from "@/serigraph/extras/lettering"
import { cn } from "@/serigraph/lib/utils"
import { Avatar, AvatarFallback } from "@/serigraph/ui/avatar"
import { Badge } from "@/serigraph/ui/badge"
import { Typography } from "@/serigraph/ui/typography"

// A journal post: a kicker in the capitals, the title lettered in the display face, a standfirst, then the byline:
// the author's medallion, the date in the extended capitals with its ordinal raised (THURSDAY 5TH NOVEMBER) and the
// reading time. The prose is set by Typography at the 34rem measure with a drop cap, holding a figure in an arched
// frame and a pull quote; at the end the tags it was filed under and the journal's issue. Pass your own prose as
// children; the structure is the block.

export const meta = {
  title: "Article",
  description:
    "A journal post: a lettered title, the date with a raised ordinal, prose at the reading measure, a folly in an arched frame and a pull quote.",
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]
const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

/** The English ordinal suffix for a day of the month: 1st, 2nd, 3rd, 4th, 11th, 22nd. */
const suffix = (day: number) => {
  if (day % 100 >= 11 && day % 100 <= 13) return "th"
  return ["th", "st", "nd", "rd"][day % 10] ?? "th"
}

/**
 * The date as on the poster: THURSDAY 5TH NOVEMBER 2026 in the extended capitals with the ordinal raised. Takes an
 * ISO date (2026-11-05) and reads it in UTC, so the server and every browser print the same day.
 */
function PosterDate({ iso }: { iso: string }) {
  const date = new Date(`${iso}T00:00:00Z`)
  const day = date.getUTCDate()
  return (
    <time dateTime={iso} className="caps">
      {WEEKDAYS[date.getUTCDay()]} {day}
      <span className="ord">{suffix(day)}</span> {MONTHS[date.getUTCMonth()]}{" "}
      {date.getUTCFullYear()}
    </time>
  )
}

export interface Article01Props {
  /** A label above the title: the journal's series or the subject. */
  kicker?: string
  /** Lettered in the display face and read as the page's heading. */
  title?: string
  /** One or two sentences under the title. */
  standfirst?: ReactNode
  author?: string
  /** The date it was published, ISO: 2026-11-05. */
  date?: string
  /** Minutes to read. */
  minutes?: number
  tags?: string[]
  /** The journal's name and issue, at the end. */
  issue?: string
  /** Sets the first paragraph's opening letter three lines deep. */
  dropCap?: boolean
  /** The prose, set by Typography. Defaults to Meridian's piece on Saturn's rings. */
  children?: ReactNode
  className?: string
}

const initials = (name: string) =>
  name
    .split(/\s+/u)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")

export function Article01({
  kicker = "Saturn after opposition",
  title = "The rings are back",
  standfirst = "Last year Saturn’s rings were edge on, a scratch of light through the planet. This autumn they are opening again, and the refractor on the deck shows the gap between ring and planet.",
  author = "Vera Rubin",
  date = "2026-11-05",
  minutes = 4,
  tags = ["Saturn", "The deck", "Seeing"],
  issue = "The Meridian journal · Nº 14",
  dropCap = true,
  children = <SaturnStory />,
  className,
}: Article01Props) {
  return (
    <div className={cn("@container text-(--text)", className)}>
      <article className="mx-auto max-w-[51rem] px-snug pt-section pb-page @min-[40rem]:px-line">
        <header>
          <p className="m-0 caps">{kicker}</p>
          <Lettering
            as="h1"
            className="m-0 mt-tight text-[clamp(2.25rem,9cqi,5.5rem)] text-balance"
          >
            {title}
          </Lettering>
          {standfirst && (
            <p className="m-0 mt-snug max-w-measure text-lead leading-lead">
              {standfirst}
            </p>
          )}
          <div className="mt-line flex items-center gap-tight">
            <Avatar size="lg">
              <AvatarFallback name={author}>{initials(author)}</AvatarFallback>
            </Avatar>
            <p className="m-0 flex flex-col">
              <span className="font-semibold">{author}</span>
              <span className="text-small leading-small">
                <PosterDate iso={date} />{" "}
                <span className="caps whitespace-nowrap">
                  <span className="sep" aria-hidden="true">
                    ·
                  </span>
                  {minutes} min read
                </span>
              </span>
            </p>
          </div>
        </header>

        <Typography dropCap={dropCap} className="mt-section">
          {children}
        </Typography>

        <footer className="mt-section max-w-measure">
          {tags.length > 0 && (
            <>
              <p className="m-0 caps">Filed under</p>
              <ul className="m-0 mt-tight flex list-none flex-wrap gap-hair p-0">
                {tags.map((tag) => (
                  <li key={tag}>
                    <Badge variant="outline">{tag}</Badge>
                  </li>
                ))}
              </ul>
            </>
          )}
          {issue && <p className="m-0 mt-line caps">{issue}</p>}
        </footer>
      </article>
    </div>
  )
}

export default Article01
