"use client"

import { useRef, useState, type ReactNode } from "react"
import { CalendarPlusIcon, SearchIcon, TicketIcon } from "lucide-react"
import { Lettering } from "@/serigraph/extras/lettering"
import { cn } from "@/serigraph/lib/utils"
import { Button } from "@/serigraph/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/serigraph/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/serigraph/ui/input-group"

// A page with nothing to show, in three states: a new member's tickets, a search of the programme that matched
// nothing, and a week with no telescope time booked. Each is the doorway folly (its own seed), a title, one line on
// why and the one action that helps. The search state keeps its field, so clearing the search leaves focus where the
// next one starts.

export const meta = {
  title: "Empty states",
  description:
    "A first run, a search with no results and nothing booked, each the doorway folly, one line and one action.",
  variants: ["first-run", "no-results", "no-bookings"],
}

export type Empty01Variant = "first-run" | "no-results" | "no-bookings"

export interface Empty01Props {
  variant?: Empty01Variant
  /** The search that found nothing, for the no-results state. */
  query?: string
  onBrowse?: () => void
  onClearSearch?: () => void
  onBook?: () => void
  className?: string
}

export function Empty01({
  variant = "first-run",
  query = "Jupiter",
  onBrowse,
  onClearSearch,
  onBook,
  className,
}: Empty01Props) {
  const [search, setSearch] = useState(query)
  const field = useRef<HTMLInputElement>(null)

  let heading = "Your tickets"
  let state: ReactNode
  if (variant === "no-results") {
    heading = "Programme"
    state = search ? (
      <State
        seed="empty:search"
        title={`Nothing matches “${search}”`}
        description="Search by object, telescope or host, like Saturn or the Zeiss refractor."
        action={
          <Button
            variant="outline"
            onClick={() => {
              setSearch("")
              field.current?.focus()
              onClearSearch?.()
            }}
          >
            Clear the search
          </Button>
        }
      />
    ) : (
      <State
        seed="empty:search"
        title="Search the programme"
        description="Objects, telescopes and hosts all work."
      />
    )
  } else if (variant === "no-bookings") {
    heading = "Telescope time"
    state = (
      <State
        seed="empty:telescope"
        title="Nothing booked this week"
        description="The refractor is free every clear night. Book an hour and it is yours."
        action={
          <Button onClick={() => onBook?.()}>
            <CalendarPlusIcon data-icon="inline-start" />
            Book telescope time
          </Button>
        }
      />
    )
  } else {
    state = (
      <State
        seed="empty:tickets"
        title="No tickets yet"
        description="Book a seat at a show or a turn at the telescope, and your tickets wait here."
        action={
          <Button onClick={() => onBrowse?.()}>
            <TicketIcon data-icon="inline-start" />
            See tonight
          </Button>
        }
      />
    )
  }

  return (
    <div className={cn("@container/empty", className)}>
      <div className="mx-auto max-w-[56rem] px-snug pt-section pb-page @min-[40rem]/empty:px-line">
        <Lettering
          as="h1"
          className="m-0 text-[clamp(2.5rem,10cqi,4.5rem)] leading-none"
        >
          {heading}
        </Lettering>
        {variant === "no-results" && (
          <InputGroup className="mt-line w-[22rem] max-w-full">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              ref={field}
              type="search"
              aria-label="Search the programme"
              placeholder="Object, telescope or host"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        )}
        <Empty className="mt-section min-h-[24rem]">{state}</Empty>
      </div>
    </div>
  )
}

function State({
  seed,
  title,
  description,
  action,
}: {
  /** Seeds the doorway, so each empty place has its own. */
  seed: string
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <>
      <EmptyHeader>
        <EmptyMedia
          seed={seed}
          className="[&>[data-slot=folly]]:w-40"
          aria-hidden="true"
        />
        <EmptyTitle>
          <h2 className="m-0 font-[inherit] text-[length:inherit] leading-[inherit] [overflow-wrap:anywhere]">
            {title}
          </h2>
        </EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </>
  )
}

export default Empty01
