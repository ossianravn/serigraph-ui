import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { cn } from "@/serigraph/lib/utils"

// A ticket: a plane in a tone, its stub at the end behind a tear line, a fine dashed line running between two
// half-round notches cut from the top and bottom edges (styles/extras-tickets.css). The body carries a kicker in the
// caps, the event's title, its date and a row of details; the stub carries ADMIT ONE in the caps and the number in
// mono. Flat colour and the one line: nothing is shadowed, and the notches are cut, not drawn over.

export interface TicketStubDetail {
  /** What it is: "Seat", "Row", "Doors". */
  term: string
  /** Its value, set in mono: "14", "F", "19:30". */
  value: ReactNode
}

export interface TicketStubProps extends Omit<
  ComponentPropsWithoutRef<"article">,
  "title"
> {
  /** The event, in the caps at the lead size. */
  title: ReactNode
  /** A line above the title: the house and the room. */
  kicker?: ReactNode
  /** When: an OrdinalDate, or any line in the caps. */
  date?: ReactNode
  /** A row of short facts under the date. */
  details?: TicketStubDetail[]
  /** The ticket's number, printed on the stub in mono. */
  number: string
  /** The stub's words, a word to a line. */
  admit?: string
  /** The plane's colour: the colourway's plane, plane 2 or one of the four tones. */
  tone?: "plane" | "plane-2" | "1" | "2" | "3" | "4"
}

/** A ticket with its stub behind a tear line. */
export function TicketStub({
  title,
  kicker,
  date,
  details,
  number,
  admit = "Admit one",
  tone = "1",
  className,
  children,
  ...props
}: TicketStubProps) {
  return (
    <article
      data-slot="ticket-stub"
      data-tone={tone === "plane" ? undefined : tone}
      className={cn(
        "plane relative grid w-full max-w-[30rem] min-w-0 grid-cols-[minmax(0,1fr)_var(--ticket-stub)]",
        className,
      )}
      {...props}
    >
      <div
        data-slot="ticket-stub-body"
        className="grid min-w-0 content-start gap-hair py-snug ps-line pe-snug"
      >
        {kicker ? (
          <p className="caps m-0 [overflow-wrap:anywhere]">{kicker}</p>
        ) : null}
        <h3 className="caps m-0 text-lead leading-lead [overflow-wrap:anywhere] text-ink">
          {title}
        </h3>
        {date ? <p className="caps m-0 text-ink">{date}</p> : null}
        {details?.length ? (
          <dl
            data-slot="ticket-stub-details"
            className="m-0 mt-hair flex flex-wrap gap-x-line gap-y-hair"
          >
            {details.map((d) => (
              <div key={d.term} className="grid gap-px">
                <dt className="caps">{d.term}</dt>
                <dd className="m-0 font-mono text-body leading-ui text-ink tabular-nums">
                  {d.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
        {children}
      </div>
      <div
        data-slot="ticket-stub-stub"
        className="relative grid place-content-center justify-items-center gap-tight px-tight py-snug text-center text-ink"
      >
        <p className="caps m-0 w-min">{admit}</p>
        <p className="m-0 grid justify-items-center">
          <span className="caps">
            No<span className="sr-only">.</span>
          </span>
          <span className="font-mono text-body leading-ui tabular-nums">
            {number}
          </span>
        </p>
      </div>
    </article>
  )
}
