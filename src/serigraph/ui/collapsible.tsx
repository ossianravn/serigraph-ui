"use client"

import * as React from "react"
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/serigraph/lib/utils"

// A disclosure. The panel opens and closes with a quick height and opacity change on the kit's curve, so it clips
// while it moves; give its content a little padding when it holds focusable things. CollapsibleChevron is a fine
// chevron: put it in the trigger and it turns from pointing along the line to pointing down as the trigger opens.
// Rows between fine lines, the trigger in the reading face, semibold: see the docs page.

function Collapsible({ ...props }: CollapsiblePrimitive.Root.Props) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({ ...props }: CollapsiblePrimitive.Trigger.Props) {
  return (
    <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />
  )
}

function CollapsibleContent({
  className,
  ...props
}: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel
      data-slot="collapsible-content"
      className={cn(
        "h-(--collapsible-panel-height) overflow-hidden transition-[height,opacity] duration-(--duration-overlay) ease-(--ease) data-ending-style:h-0 data-ending-style:opacity-0 data-starting-style:h-0 data-starting-style:opacity-0",
        className,
      )}
      {...props}
    />
  )
}

// Lucide's 24-unit chevron at 16px: a stroke of 1.5 × the line renders as exactly one line.
function CollapsibleChevron({
  className,
  ...props
}: React.ComponentProps<typeof ChevronDownIcon>) {
  return (
    <ChevronDownIcon
      data-slot="collapsible-chevron"
      aria-hidden="true"
      className={cn(
        "size-4 shrink-0 -rotate-90 [stroke-width:calc(var(--line)*1.5)] transition-transform duration-(--duration-overlay) ease-(--ease) in-aria-expanded:rotate-0 rtl:rotate-90 rtl:in-aria-expanded:rotate-0",
        className,
      )}
      {...props}
    />
  )
}

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  CollapsibleChevron,
}
