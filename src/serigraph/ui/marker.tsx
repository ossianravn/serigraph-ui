import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/serigraph/lib/utils"

// A line in the thread that is not a message: a date, where unread messages begin, someone joining. An event is an
// open row in the reading face at the small size, an icon beside it. The separator variant puts its words in the
// extended capitals in a small pill, tinted from the surface (styles/conversation.css, at no specificity), between two
// fine lines; give the content bg-highlight to call it out (where unread messages begin). The border variant sits on
// one fine line. Lines and words take the surface's edge and text colours, so a marker reads on any canvas.
const markerVariants = cva(
  "group/marker relative flex min-h-4 w-full items-center gap-hair text-start font-read text-small leading-small text-(--text,var(--ink)) [&_svg:not([class*='size-'])]:size-4 [&_a]:underline [&_a]:decoration-(length:--line) [&_a]:underline-offset-[0.22em]",
  {
    variants: {
      variant: {
        default: "",
        separator:
          "gap-tight before:min-w-0 before:flex-1 before:border-t-(length:--line) before:border-(--edge,var(--ink)) after:min-w-0 after:flex-1 after:border-t-(length:--line) after:border-(--edge,var(--ink))",
        border:
          "pb-hair caps after:absolute after:inset-x-0 after:bottom-0 after:border-t-(length:--line) after:border-(--edge,var(--ink))",
      },
    },
  },
)

function Marker({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof markerVariants>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(markerVariants({ variant, className })),
      },
      props,
    ),
    render,
    state: {
      slot: "marker",
      variant,
    },
  })
}

function MarkerIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-icon"
      aria-hidden="true"
      className={cn(
        "flex size-4 shrink-0 items-center justify-center [&_svg]:[stroke-width:calc(var(--line)*1.5)] [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

function MarkerContent({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-content"
      className={cn(
        "min-w-0 wrap-break-word",
        "group-data-[variant=separator]/marker:inline-flex group-data-[variant=separator]/marker:h-[1.375rem] group-data-[variant=separator]/marker:flex-none group-data-[variant=separator]/marker:items-center group-data-[variant=separator]/marker:rounded-full group-data-[variant=separator]/marker:border-(length:--line) group-data-[variant=separator]/marker:border-ink group-data-[variant=separator]/marker:px-tight group-data-[variant=separator]/marker:ps-[calc(var(--space-tight)+0.1em)] group-data-[variant=separator]/marker:caps group-data-[variant=separator]/marker:text-[0.6875rem] group-data-[variant=separator]/marker:whitespace-nowrap group-data-[variant=separator]/marker:text-ink",
        className,
      )}
      {...props}
    />
  )
}

export { Marker, MarkerIcon, MarkerContent, markerVariants }
