"use client"

import * as React from "react"
import { cn } from "@/serigraph/lib/utils"
import {
  Collapsible,
  CollapsibleChevron,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/serigraph/ui/collapsible"
import { Spinner } from "@/serigraph/ui/spinner"

// A timeline of numbered steps: each number in mono inside a small circle in the ink line, joined to the next by one
// fine line in the surface's edge colour that runs down through any open detail. The status changes the circle, never
// the words: done takes the highlight and a fine ink tick (chosen: the highlight and an ink mark), running is the
// spinner's pinwheel turning, error a rose circle whose description says what went wrong, pending only a dashed line
// in the surface's edge colour (not yet drawn), and no status a tint inside the solid line.

const TICK = "M2.5 7.4 5.6 10.3 11.5 3.6"

function Trace({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="trace"
      className={cn(
        "flex w-full min-w-0 flex-col gap-tight [--trace-ring:1.5rem] *:relative",
        "*:not-last:before:pointer-events-none *:not-last:before:absolute *:not-last:before:start-[calc(var(--trace-ring)/2-var(--line)/2)] *:not-last:before:top-[calc(var(--trace-ring)+3px)] *:not-last:before:-bottom-[calc(var(--space-tight)-3px)] *:not-last:before:border-s-(length:--line) *:not-last:before:border-(--edge,var(--ink))",
        "*:has-[>[data-slot=trace-line]]:flex *:has-[>[data-slot=trace-line]]:w-fit *:has-[>[data-slot=trace-line]]:max-w-full *:has-[>[data-slot=trace-line]]:min-w-0 *:has-[>[data-slot=trace-line]]:text-start *:has-[>[data-slot=trace-line]]:no-underline",
        className,
      )}
      {...props}
    />
  )
}

function TraceLine({
  className,
  status,
  ...props
}: React.ComponentProps<"span"> & {
  status?: "running" | "error" | "pending" | "done"
}) {
  return (
    <span
      data-slot="trace-line"
      data-status={status}
      className={cn(
        "group/trace-line flex w-fit max-w-full min-w-0 items-center gap-hair font-read text-small leading-small text-(--text,var(--ink)) in-[a,button]:cursor-pointer",
        className,
      )}
      {...props}
    />
  )
}

function TraceIcon({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="trace-icon"
      aria-hidden="true"
      className={cn(
        "relative flex size-(--trace-ring) shrink-0 items-center justify-center rounded-full border-(length:--line) border-ink bg-[color-mix(in_oklab,var(--surface,var(--canvas))_30%,var(--paper))] font-mono text-[0.6875rem] leading-none text-ink tabular-nums [&_svg]:pointer-events-none",
        "group-data-[status=done]/trace-line:bg-highlight group-data-[status=error]/trace-line:bg-rose group-data-[status=pending]/trace-line:border-dashed group-data-[status=pending]/trace-line:border-(--edge,var(--ink)) group-data-[status=pending]/trace-line:bg-transparent group-data-[status=pending]/trace-line:text-(--text,var(--ink)) group-data-[status=running]/trace-line:border-transparent group-data-[status=running]/trace-line:bg-transparent",
        "[[data-slot=trace-title]~&]:size-4 [[data-slot=trace-title]~&]:border-0 [[data-slot=trace-title]~&]:bg-transparent! [[data-slot=trace-title]~&]:text-(--text,var(--ink)) [[data-slot=trace-title]~&]:*:data-trace-mark:hidden! [[data-slot=trace-title]~&]:*:data-trace-figure:flex!",
        className,
      )}
      {...props}
    >
      <Spinner
        data-trace-mark=""
        aria-hidden="true"
        role={undefined}
        aria-label={undefined}
        className="absolute inset-0 hidden size-full group-data-[status=running]/trace-line:block"
      />
      <span
        data-trace-figure=""
        className="relative flex items-center justify-center group-data-[status=done]/trace-line:hidden group-data-[status=running]/trace-line:hidden [&_svg]:[stroke-width:calc(var(--line)*1.5)] [&_svg:not([class*='size-'])]:size-3.5"
      >
        {children}
      </span>
      <svg
        data-trace-mark=""
        viewBox="0 0 14 14"
        aria-hidden="true"
        className="hidden size-3 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] group-data-[status=done]/trace-line:block"
      >
        <path d={TICK} strokeWidth={1.6} />
      </svg>
    </span>
  )
}

function TraceTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="trace-title"
      className={cn(
        "min-w-0 truncate decoration-(length:--line) underline-offset-[0.22em] in-[a:hover,button:hover]:underline",
        className,
      )}
      {...props}
    />
  )
}

function TraceDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="trace-description"
      className={cn(
        "shrink-0 font-mono text-[0.75rem] leading-none text-(--text,var(--ink)) tabular-nums",
        className,
      )}
      {...props}
    />
  )
}

function TraceCollapsible({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Collapsible>, "open"> &
  (
    | { open?: undefined }
    | {
        open: boolean
        onOpenChange: NonNullable<
          React.ComponentProps<typeof Collapsible>["onOpenChange"]
        >
      }
  )) {
  return (
    <Collapsible
      data-slot="trace-collapsible"
      className={cn("flex w-full min-w-0 flex-col", className)}
      {...props}
    />
  )
}

function TraceCollapsibleTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsibleTrigger>) {
  return (
    <CollapsibleTrigger
      data-slot="trace-collapsible-trigger"
      className={cn(
        "group/trace-collapsible-trigger flex w-fit max-w-full min-w-0 cursor-pointer items-center gap-1 rounded-full text-start text-(--text,var(--ink))",
        className,
      )}
      {...props}
    >
      {children}
      <CollapsibleChevron className="size-3.5" />
    </CollapsibleTrigger>
  )
}

function TraceCollapsibleContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsibleContent>) {
  return (
    <CollapsibleContent
      data-slot="trace-collapsible-content"
      className="min-w-0"
      {...props}
    >
      <div
        data-slot="trace-collapsible-content-inner"
        className={cn(
          "ms-[calc(var(--trace-ring)+var(--space-hair))] mt-1 mb-hair max-w-measure min-w-0 pe-1 font-read text-small leading-small wrap-break-word text-(--text,var(--ink))",
          className,
        )}
      >
        {children}
      </div>
    </CollapsibleContent>
  )
}

export {
  Trace,
  TraceLine,
  TraceIcon,
  TraceTitle,
  TraceDescription,
  TraceCollapsible,
  TraceCollapsibleTrigger,
  TraceCollapsibleContent,
}
