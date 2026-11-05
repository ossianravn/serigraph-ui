import { useState, type MouseEvent } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/serigraph/ui/pagination"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Pagination",
  description:
    "Moves through a long list a page at a time, such as the archive of past sessions.",
  item: "pagination",
  group: "Navigation",
}

/** The pages to show around the current one: the first, the last, and one either side, with gaps between. */
function pagesAround(page: number, last: number): (number | "gap")[] {
  const near = [1, page - 1, page, page + 1, last].filter(
    (n, i, all) => n >= 1 && n <= last && all.indexOf(n) === i,
  )
  return near
    .sort((a, b) => a - b)
    .flatMap((n, i) => (i > 0 && n - near[i - 1]! > 1 ? ["gap", n] : [n]))
}

/** A working pager over `last` pages, starting on `start`. */
function Pager({ start, last }: { start: number; last: number }) {
  const [page, setPage] = useState(start)
  const go = (n: number) => (event: MouseEvent) => {
    event.preventDefault()
    setPage(Math.min(last, Math.max(1, n)))
  }
  return (
    <Pagination className="mx-0 justify-start">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`#page-${page - 1}`}
            aria-disabled={page === 1 || undefined}
            onClick={go(page - 1)}
          />
        </PaginationItem>
        {pagesAround(page, last).map((n, i) => (
          <PaginationItem
            key={`${n}-${i}`}
            // On a phone the neighbours give way, so the row fits: first, current, last.
            className={
              n !== "gap" && n !== page && n !== 1 && n !== last
                ? "max-sm:hidden"
                : undefined
            }
          >
            {n === "gap" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={`#page-${n}`}
                isActive={n === page}
                aria-label={`Page ${n}`}
                onClick={go(n)}
              >
                {n}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href={`#page-${page + 1}`}
            aria-disabled={page === last || undefined}
            onClick={go(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default function PaginationDemo() {
  return (
    <>
      <DemoSection title="Past sessions">
        <StateRow label="Page 6 of 24">
          <Pager start={6} last={24} />
        </StateRow>
      </DemoSection>
      <DemoSection title="States">
        <StateRow label="First page">
          <Pager start={1} last={24} />
        </StateRow>
        <StateRow label="Last page">
          <Pager start={24} last={24} />
        </StateRow>
        <StateRow label="Three pages">
          <Pager start={2} last={3} />
        </StateRow>
      </DemoSection>
    </>
  )
}
