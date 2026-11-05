import { CalendarIcon, RotateCwIcon } from "lucide-react"
import { Button } from "@/serigraph/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/serigraph/ui/empty"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Empty",
  description:
    "What a place shows when it has nothing in it yet: a doorway drawn from a seed, a title, one line on why, and the one action that helps.",
  item: "empty",
  group: "Data display",
}

const COLUMN = "max-w-[34rem]"

export default function EmptyDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="Nothing yet">
          <Empty className={COLUMN}>
            <EmptyHeader>
              <EmptyMedia seed="empty:seats" />
              <EmptyTitle>You have no seats booked</EmptyTitle>
              <EmptyDescription>
                Seats you book for shows, talks and the telescopes wait here.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button>See tonight’s sessions</Button>
            </EmptyContent>
          </Empty>
        </StateRow>
        <StateRow label="No results">
          <Empty className={COLUMN}>
            <EmptyHeader>
              <EmptyMedia seed="empty:search" />
              <EmptyTitle>Nothing matches “andromeda talk”</EmptyTitle>
              <EmptyDescription>
                Andromeda is a dome show this month. Search by session, guide or
                night.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline">Clear the search</Button>
            </EmptyContent>
          </Empty>
        </StateRow>
        <StateRow label="Error">
          <Empty className={COLUMN}>
            <EmptyHeader>
              <EmptyMedia seed="empty:error" />
              <EmptyTitle>The programme didn’t load</EmptyTitle>
              <EmptyDescription>
                The connection dropped. Seats you have booked are safe.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline">
                <RotateCwIcon data-icon="inline-start" />
                Try again
              </Button>
            </EmptyContent>
          </Empty>
        </StateRow>
      </DemoSection>
      <DemoSection title="Media and surfaces">
        <StateRow label="icon">
          <Empty className={COLUMN}>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CalendarIcon />
              </EmptyMedia>
              <EmptyTitle>No sessions on Monday 9 November</EmptyTitle>
              <EmptyDescription>
                The dome is closed on Mondays. The deck opens again on Tuesday
                at dusk.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline">Show Tuesday</Button>
            </EmptyContent>
          </Empty>
        </StateRow>
        <StateRow label="On a plane">
          <Empty className={`plane ${COLUMN}`}>
            <EmptyHeader>
              <EmptyMedia seed="empty:waiting-list" />
              <EmptyTitle>Nobody is waiting</EmptyTitle>
              <EmptyDescription>
                When a full session has a waiting list, the names appear here in
                the order they asked.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </StateRow>
      </DemoSection>
    </>
  )
}
