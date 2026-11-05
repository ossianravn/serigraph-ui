"use client"

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/serigraph/lib/utils"

// Rows between fine lines in the surface's edge colour. The trigger is the row's heading in the reading face,
// semibold, with a fine chevron at its end that turns as the row opens; the panel's height and opacity ease open and
// shut quickly, and its text keeps the reading measure. Focus is the page's concentric ring round the row's heading;
// a disabled row takes the quiet text.

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "border-[var(--edge,var(--ink))] not-last:border-b-(length:--line)",
        className,
      )}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="m-0 flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 cursor-pointer items-start justify-between gap-snug rounded-[0.625rem] py-snug text-left font-read text-body leading-ui font-semibold text-(--text) decoration-(length:--line) underline-offset-[0.25em] hover:underline aria-disabled:cursor-not-allowed aria-disabled:text-(--text-quiet) aria-disabled:no-underline data-disabled:cursor-not-allowed data-disabled:text-(--text-quiet) data-disabled:no-underline",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon
          data-slot="accordion-trigger-icon"
          aria-hidden="true"
          className="pointer-events-none ms-auto size-4 shrink-0 translate-y-[calc((1lh-1rem)/2)] transition-transform duration-(--duration-overlay) ease-(--ease) [stroke-width:calc(var(--line)*1.5)] group-aria-expanded/accordion-trigger:rotate-180"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="h-(--accordion-panel-height) overflow-hidden text-body leading-body text-(--text) transition-[height,opacity] duration-(--duration-overlay) ease-(--ease) data-ending-style:h-0 data-ending-style:opacity-0 data-starting-style:h-0 data-starting-style:opacity-0"
      {...props}
    >
      <div
        className={cn(
          "max-w-measure pb-snug [&_a]:underline [&_a]:underline-offset-[0.22em] [&_p]:m-0 [&_p:not(:last-child)]:mb-tight",
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
