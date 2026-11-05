import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"
import { cn } from "@/serigraph/lib/utils"

// A trail in the reading face at small size, in the surface's text colour (ink, or paper on Night's canvas). The steps
// back are plain until hovered, when the fine underline comes, as a trail's convention already says they are links;
// the current page stands in semibold. Between steps sits a fine chevron pointing onward, turned in right-to-left text.

// Lucide's 24-unit icons at 14px: a stroke of 1.5 × the line × 24/14 renders as exactly one line.
const fineChevron = "size-3.5 [stroke-width:calc(var(--line)*1.5*16/14)]"

function Breadcrumb({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      className={cn(className)}
      {...props}
    />
  )
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "m-0 flex list-none flex-wrap items-center gap-x-hair gap-y-1 p-0 font-read text-small leading-small wrap-break-word text-(--text)",
        className,
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
}

function BreadcrumbLink({
  className,
  render,
  ...props
}: useRender.ComponentProps<"a">) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(
          "text-(--text) no-underline decoration-(length:--line) underline-offset-[0.22em] hover:underline",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "breadcrumb-link",
    },
  })
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-semibold text-(--text)", className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "inline-flex items-center text-(--text) [&>svg]:size-3.5",
        className,
      )}
      {...props}
    >
      {children ?? (
        <ChevronRightIcon className={cn(fineChevron, "rtl:rotate-180")} />
      )}
    </li>
  )
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "flex size-5 items-center justify-center [&>svg]:size-4",
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
