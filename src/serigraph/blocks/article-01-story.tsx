"use client"

import type { ReactNode } from "react"
import { Folly } from "@/serigraph/extras/folly"
import { Motif } from "@/serigraph/extras/motif"

// The article's parts and its default prose, usable on their own: a figure in an arched frame with a folly and its
// caption beside it (under it in a narrow column), a pull quote under a sparkle, and Meridian's journal piece on
// Saturn at opposition. The story is children of Typography, so it reads as typeset text at the 34rem measure.

/** A folly in an arched frame with its caption, side by side from 30rem and stacked below that. */
export function ArchFigure({
  seed,
  label,
  caption,
}: {
  seed: string
  /** What the drawing shows, for assistive technology. */
  label: string
  caption: ReactNode
}) {
  return (
    <figure className="@container/figure max-w-measure">
      <div className="flex flex-col gap-snug @min-[30rem]/figure:flex-row @min-[30rem]/figure:items-end">
        <Folly
          template="window"
          seed={seed}
          label={label}
          className="arch-frame w-44 flex-none @min-[30rem]/figure:w-52"
        />
        <figcaption className="m-0! max-w-[20rem] caps leading-small">
          {caption}
        </figcaption>
      </div>
    </figure>
  )
}

/** A sentence lifted from the text, large in the extended sans under a sparkle, with who said it in the capitals. */
export function PullQuote({
  children,
  cite,
}: {
  children: ReactNode
  cite?: string
}) {
  return (
    <figure className="max-w-measure py-tight">
      <Motif kind="sparkle" seed="pull-quote" className="text-h1" />
      <blockquote className="m-0 mt-tight border-s-0! ps-0! font-sans text-h2 leading-h2 font-bold text-balance [font-stretch:var(--sans-stretch)]">
        {children}
      </blockquote>
      {cite && <figcaption className="mt-tight! caps">{cite}</figcaption>}
    </figure>
  )
}

export function SaturnStory() {
  return (
    <>
      <p>
        Saturn passed opposition last month, when it sat exactly opposite the
        Sun: rising at sunset, highest in the south around midnight, setting at
        dawn. It is still up from dusk until the small hours, and it will not be
        this close or this bright again until next autumn.
      </p>
      <p>
        Opposition comes round every year and thirteen days, as the Earth
        overtakes Saturn on the inside track. What makes this season worth a
        cold night on the deck is the rings. Last year they were edge on to us,
        a thin line through the planet that most visitors took for a scratch on
        the eyepiece. Now they are tilting open again, a little more every
        month.
      </p>
      <ArchFigure
        seed="journal:saturn"
        label="An observatory dome on a round platform in the clouds, under a pinwheel sun"
        caption="The deck at dusk, the refractor's dome open to the south."
      />
      <h2>Why the rings grew brighter</h2>
      <p>
        Around opposition the Sun was directly behind us, so we saw the ring
        particles fully lit with no shadows between them. For a few nights the
        rings brightened more than the planet did, an effect astronomers call
        opposition surge. It is the same reason a field of frost glitters
        hardest when the Sun is at your back.
      </p>
      <PullQuote cite="Vera Rubin, in the lecture hall">
        For a few nights the rings outshone the planet they circle.
      </PullQuote>
      <h2>Seeing it from the deck</h2>
      <p>
        The Zeiss refractor shows the rings, the Cassini division in them when
        the air is steady, and Titan as a small orange star off to one side. On
        a good night you can make out the cloud belts across the ball, and the
        shadow the planet throws on the rings behind it.
      </p>
      <ul>
        <li>Look south-east from 19:00; Saturn is the steady yellow light.</li>
        <li>Give your eyes ten minutes in the dark before the eyepiece.</li>
        <li>Steady air matters more than a clear sky; we post the seeing.</li>
      </ul>
      <p>
        The deck is open every clear night this month from dusk. Members book
        four weeks ahead; everyone else can come to the door and wait for a
        turn, which on a Saturday rarely takes more than twenty minutes.
      </p>
    </>
  )
}
