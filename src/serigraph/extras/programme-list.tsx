import { Children, type ComponentPropsWithoutRef, type ReactNode } from "react"
import { Lettering } from "@/serigraph/extras/lettering"
import { cn } from "@/serigraph/lib/utils"

// The poster's bill: one row per show, straight on the surface beneath, no boxes. A row is its date in the caps with
// the ordinal raised (an OrdinalDate), the title in the caps at the lead size or, for the headliner, lettered in
// Serigraph Display, and its facts (time, room, a note) in the caps separated by round middle dots. From a narrow
// column the date stands above the title. Text takes the surface's own colour, so it reads on Night's canvas too.

/** The programme: an ordered list of shows, in the order they happen. */
export function ProgrammeList({
  className,
  ...props
}: ComponentPropsWithoutRef<"ol">) {
  return (
    <ol
      data-slot="programme-list"
      className={cn(
        "@container m-0 grid w-full max-w-[40rem] min-w-0 list-none gap-line p-0 text-(--text)",
        className,
      )}
      {...props}
    />
  )
}

export interface ProgrammeListItemProps extends Omit<
  ComponentPropsWithoutRef<"li">,
  "title"
> {
  /** When: an OrdinalDate with format="day", or any short line. */
  date: ReactNode
  /** The show's title; a string when `lettered`. A link here makes the row a link. */
  title: ReactNode
  /** Letter the title in Serigraph Display, for the headliner. Use it once in a list. */
  lettered?: boolean
  /** Short facts in the caps: the time, the room, "Sold out". Each is separated by a middle dot. */
  facts?: ReactNode[]
}

/** One show on the bill. Extra content (a line of reading text) goes under the facts. */
export function ProgrammeListItem({
  date,
  title,
  lettered = false,
  facts,
  className,
  children,
  ...props
}: ProgrammeListItemProps) {
  const items = Children.toArray(facts)
  return (
    <li
      data-slot="programme-list-item"
      data-lettered={lettered || undefined}
      className={cn(
        "grid min-w-0 gap-x-line gap-y-hair @lg:grid-cols-[8.5rem_minmax(0,1fr)] @lg:items-baseline",
        className,
      )}
      {...props}
    >
      <div data-slot="programme-list-date" className="caps">
        {date}
      </div>
      <div className="grid min-w-0 justify-items-start gap-hair">
        {lettered && typeof title === "string" ? (
          <Lettering as="h3" className="m-0 text-h1 [overflow-wrap:anywhere]">
            {title}
          </Lettering>
        ) : (
          <h3 className="caps m-0 text-lead leading-lead [overflow-wrap:anywhere]">
            {title}
          </h3>
        )}
        {items.length ? (
          <p data-slot="programme-list-facts" className="caps m-0">
            {items.map((fact, i) => (
              <span key={i} className="whitespace-nowrap">
                {i > 0 ? (
                  <>
                    <span className="sep" aria-hidden="true">
                      •
                    </span>
                    <span className="sr-only">, </span>
                  </>
                ) : null}
                {fact}
              </span>
            ))}
          </p>
        ) : null}
        {children ? (
          <div className="max-w-measure text-body leading-body [&_p]:m-0">
            {children}
          </div>
        ) : null}
      </div>
    </li>
  )
}
