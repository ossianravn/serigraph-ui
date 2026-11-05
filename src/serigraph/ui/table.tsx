"use client"

import * as React from "react"
import { cn } from "@/serigraph/lib/utils"

// A ledger with no boxes: heads in the extended capitals over the fine line, rows divided by the same line, figures
// in the mono face with tabular figures (set font-mono on their cells and right-align them with their head). The lines
// are plain borders in the edge colour of the surface beneath, so a 200-row table costs nothing per row. The head
// sticks to the top of a container that scrolls (size the container from outside:
// `*:data-[slot=table-container]:h-96`) and takes the surface's colour only once rows pass under it. A selected row
// (data-state="selected") is a highlight band with ink text. The drawing classes cannot reach is in styles/data.css.
// The container scrolls on its own layer (will-change: scroll-position): otherwise every scrolled frame repaints the
// printed grain behind the rows, and a 200-row table drops a frame in three.

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto will-change-scroll [container-type:scroll-state]"
    >
      <table
        data-slot="table"
        className={cn(
          "w-full caption-bottom border-separate border-spacing-0 font-read text-body leading-ui tabular-nums",
          className,
        )}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={cn(className)} {...props} />
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={cn(className)} {...props} />
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("font-semibold", className)}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return <tr data-slot="table-row" className={cn(className)} {...props} />
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "caps h-control-compact px-tight text-start align-middle whitespace-nowrap [&:has([role=checkbox])]:pe-0",
        className,
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-tight py-tight align-middle whitespace-nowrap [&:has([role=checkbox])]:pe-0",
        className,
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(
        "pt-snug text-start text-small leading-small text-pretty",
        className,
      )}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
