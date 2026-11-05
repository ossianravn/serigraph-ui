import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react"
import { Folly } from "@/serigraph/extras/folly"
import { Lettering } from "@/serigraph/extras/lettering"
import { cn } from "@/serigraph/lib/utils"

// A feature panel, used sparingly: its top is an arch window (a round head on straight jambs) holding a seeded window
// folly, and under the window's sill the plane carries a kicker in the caps, the title lettered, a line of reading
// text and an action. The arch and the plane are one outline; the sill is the line between them. The folly is
// decorative; the title is the card's name. Seeded, so it draws the same on the server and in the browser.

export interface PosterCardProps extends Omit<
  ComponentPropsWithoutRef<"article">,
  "title"
> {
  /** The title, lettered in Serigraph Display. Keep it to a few words. */
  title: string
  /** The heading level the title takes in the page's outline. */
  titleAs?: ElementType
  /** A line in the caps above the title: the room and the date. */
  kicker?: ReactNode
  /** The folly's seed; the title's by default, so each poster has its own window. */
  seed?: string | number
  /** An action under the text: a button or a link. */
  action?: ReactNode
  /** The plane's colour: the colourway's plane, plane 2 or one of the four tones. */
  tone?: "plane" | "plane-2" | "1" | "2" | "3" | "4"
}

/** A feature card under an arch window with a folly in it. */
export function PosterCard({
  title,
  titleAs = "h3",
  kicker,
  seed,
  action,
  tone = "plane",
  className,
  children,
  ...props
}: PosterCardProps) {
  return (
    <article
      data-slot="poster-card"
      className={cn("grid w-full max-w-[22rem] min-w-0", className)}
      {...props}
    >
      <div data-slot="poster-card-window" className="relative">
        <Folly template="window" seed={seed ?? title} className="size-full" />
      </div>
      <div
        data-slot="poster-card-body"
        data-tone={tone === "plane" ? undefined : tone}
        className="plane grid justify-items-start gap-tight px-line pt-snug pb-line"
      >
        {kicker ? <p className="caps m-0 text-ink">{kicker}</p> : null}
        <Lettering
          as={titleAs}
          className="m-0 text-h1 leading-[1.1] [overflow-wrap:anywhere]"
        >
          {title}
        </Lettering>
        {children ? (
          <div className="max-w-measure text-body leading-body text-ink [&_p]:m-0">
            {children}
          </div>
        ) : null}
        {action ? <div className="mt-hair">{action}</div> : null}
      </div>
    </article>
  )
}
