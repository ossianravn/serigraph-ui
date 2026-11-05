import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/serigraph/lib/utils"
import { Separator } from "@/serigraph/ui/separator"

// An open row for one thing in a list: media (a medallion, an icon or a motif), the title in the reading face, a
// description at the small size and actions at the end. Outline rows take the fine line in the surface's edge colour;
// muted rows sit on a tint of the surface, in ink. A row rendered as a link takes that tint under the pointer; focus
// is the page's concentric ring. The 16px radius is the row's own, so the tint and the ring share its corners.

function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn(
        "group/item-group flex w-full flex-col gap-tight has-data-[size=sm]:gap-hair has-data-[size=xs]:gap-1 has-data-[slot=item-separator]:gap-0",
        className,
      )}
      {...props}
    />
  )
}

function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      // An item group is a list, which may own only list items: the line is for the eye, hidden from assistive tech.
      aria-hidden="true"
      className={cn("my-0", className)}
      {...props}
    />
  )
}

const itemVariants = cva(
  "group/item flex w-full flex-wrap items-center rounded-box text-small leading-small text-(--text) transition-[background-color] duration-(--duration-control) ease-(--ease) [a]:no-underline",
  {
    variants: {
      variant: {
        default:
          "[a]:hover:field-fill [a]:hover:[--edge:var(--ink)] [a]:hover:[--text-quiet:var(--ink-quiet)] [a]:hover:[--text:var(--ink)]",
        outline:
          "border-(length:--line) border-[var(--edge,var(--ink))] [a]:hover:field-fill [a]:hover:border-ink [a]:hover:[--edge:var(--ink)] [a]:hover:[--text-quiet:var(--ink-quiet)] [a]:hover:[--text:var(--ink)]",
        muted:
          "field-fill [--edge:var(--ink)] [--text-quiet:var(--ink-quiet)] [--text:var(--ink)] *:[--ring:var(--ink)]",
      },
      size: {
        default: "gap-snug px-snug py-tight",
        sm: "gap-tight px-tight py-hair",
        xs: "gap-hair px-hair py-1 in-data-[slot=dropdown-menu-content]:p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Item({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof itemVariants>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(itemVariants({ variant, size, className })),
      },
      props,
    ),
    render,
    state: {
      slot: "item",
      variant,
      size,
    },
  })
}

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-hair group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "group-has-data-[slot=item-description]/item:translate-y-0.5 [&_svg]:[stroke-width:calc(var(--line)*1.5)] [&_svg:not([class*='size-'])]:size-4",
        image:
          "size-12 overflow-hidden rounded-box group-data-[size=sm]/item:size-9 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover [&>[data-slot=folly]]:size-full",
        number:
          "min-w-[2.6ch] justify-start font-mono text-small leading-none tabular-nums group-has-data-[slot=item-description]/item:translate-y-[0.3rem]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-0.5 group-data-[size=xs]/item:gap-0 [&+[data-slot=item-content]]:flex-none",
        className,
      )}
      {...props}
    />
  )
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        "line-clamp-1 flex w-fit items-center gap-hair font-read text-body leading-body font-semibold group-data-[size=xs]/item:text-small group-data-[size=xs]/item:leading-small",
        className,
      )}
      {...props}
    />
  )
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "m-0 line-clamp-2 text-start text-small leading-small font-normal [&>a]:underline [&>a]:underline-offset-[0.22em]",
        className,
      )}
      {...props}
    />
  )
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex items-center gap-tight", className)}
      {...props}
    />
  )
}

function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn(
        "flex basis-full items-center justify-between gap-tight",
        className,
      )}
      {...props}
    />
  )
}

function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        "flex basis-full items-center justify-between gap-tight",
        className,
      )}
      {...props}
    />
  )
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
}
