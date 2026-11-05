import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"
import { cn } from "@/serigraph/lib/utils"

import { Button } from "@/serigraph/ui/button"

// Page numbers in the mono face as ghost pills (the line comes under the pointer); the current page is a highlight
// pill inside the ink line. Previous and next are ghost pills with their word in the capitals and a fine chevron,
// turned in right-to-left text; on phones they keep only the chevron. A link with aria-disabled (no previous page on
// page one) takes the quiet ink and no pointer.

// Lucide's 24-unit icons at 16px: a stroke of 1.5 × the line renders as exactly one line.
const fineIcon = "[stroke-width:calc(var(--line)*1.5)]"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("m-0 flex list-none items-center gap-1 p-0", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      variant="ghost"
      size={size}
      className={cn(
        // Page numbers (the icon size) speak in the mono face; previous and next keep the button's capitals.
        size?.startsWith("icon") &&
          "font-mono text-[0.875rem] font-normal tracking-normal tabular-nums",
        "no-underline aria-disabled:pointer-events-none aria-disabled:[--pill-text:var(--text-quiet)] aria-[current=page]:[--fill-grain:var(--grain)] aria-[current=page]:[--fill:var(--highlight)] aria-[current=page]:[--pill-line:var(--ink)] aria-[current=page]:hover:[--pill-line:var(--ink)] aria-[current=page]:[--pill-text:var(--ink)] aria-[current=page]:[--press-fill:var(--highlight)]",
        className,
      )}
      nativeButton={false}
      render={
        <a
          aria-current={isActive ? "page" : undefined}
          data-slot="pagination-link"
          data-active={isActive}
          {...props}
        />
      }
    />
  )
}

function PaginationPrevious({
  className,
  text = "Previous",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn(
        "max-sm:w-control max-sm:px-0! max-sm:[--contour-x:0.5625rem]",
        className,
      )}
      {...props}
    >
      <ChevronLeftIcon
        data-icon="inline-start"
        className={cn(fineIcon, "rtl:rotate-180")}
      />
      <span className="hidden sm:block">{text}</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  text = "Next",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn(
        "max-sm:w-control max-sm:px-0! max-sm:[--contour-x:0.5625rem]",
        className,
      )}
      {...props}
    >
      <span className="hidden sm:block">{text}</span>
      <ChevronRightIcon
        data-icon="inline-end"
        className={cn(fineIcon, "rtl:rotate-180")}
      />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-control items-center justify-center text-(--text) [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
