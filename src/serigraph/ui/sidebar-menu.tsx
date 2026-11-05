"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { seedOf } from "@/serigraph/follies/seed"
import { cn } from "@/serigraph/lib/utils"

import { Skeleton } from "@/serigraph/ui/skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/serigraph/ui/tooltip"
import { useSidebar } from "@/serigraph/ui/sidebar-provider"

// The sidebar's menu. Rows are pills in the reading face on whatever the sidebar stands on. Under the pointer a row
// shows the line, like a ghost button; the current row (isActive) is a highlight pill inside the ink line, its words in
// ink. The outline variant keeps the line all the time. Counts are in the mono face; submenus hang off a fine line
// under the parent's icon. Rows clip what overflows them (the icon rail hides their words). Split from sidebar.tsx to
// keep each file small; import everything from "@/serigraph/ui/sidebar".

/** A pill row; its line under the pointer, the current row's highlight and the disabled ink are in navigation.css. */
const row =
  "flex min-w-0 cursor-pointer items-center rounded-full border-(length:--line) border-transparent font-read text-(--text) no-underline transition-[background-color,border-color] duration-(--duration-control) ease-(--ease) [&>span:last-child]:truncate [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn(
        "m-0 flex w-full min-w-0 list-none flex-col gap-0.5 p-0",
        className,
      )}
      {...props}
    />
  )
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  )
}

const sidebarMenuButtonVariants = cva(
  cn(
    row,
    "peer/menu-button group/menu-button w-full gap-tight overflow-hidden px-tight text-start group-has-data-[sidebar=menu-action]/menu-item:pe-8 group-data-[collapsible=icon]:size-control-compact! group-data-[collapsible=icon]:p-[calc((var(--control-height-compact)-1rem)/2-var(--line))]!",
  ),
  {
    variants: {
      variant: {
        default: "",
        outline: "border-(--edge)",
      },
      size: {
        default: "h-control-compact text-body leading-ui",
        sm: "h-7 text-small leading-small",
        lg: "h-12 ps-1 text-body leading-ui group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:[&>:first-child]:size-[calc(var(--control-height-compact)-var(--line)*2)]!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function SidebarMenuButton({
  render,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}: useRender.ComponentProps<"button"> &
  React.ComponentProps<"button"> & {
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>) {
  const { isMobile, state } = useSidebar()
  const comp = useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: cn(sidebarMenuButtonVariants({ variant, size }), className),
      },
      props,
    ),
    render: !tooltip ? render : <TooltipTrigger render={render} />,
    state: {
      slot: "sidebar-menu-button",
      sidebar: "menu-button",
      size,
      active: isActive,
    },
  })

  if (!tooltip) {
    return comp
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    }
  }

  return (
    <Tooltip>
      {comp}
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltip}
      />
    </Tooltip>
  )
}

// A small round button at the row's end: its icon, and the line under the pointer. On the current row it reads ink.
function SidebarMenuAction({
  className,
  render,
  showOnHover = false,
  ...props
}: useRender.ComponentProps<"button"> &
  React.ComponentProps<"button"> & {
    showOnHover?: boolean
  }) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: cn(
          "absolute end-1 top-1 flex size-6 cursor-pointer items-center justify-center rounded-full border-(length:--line) border-transparent p-0 text-(--text) group-data-[collapsible=icon]:hidden peer-data-active/menu-button:text-ink peer-data-[size=default]/menu-button:top-1 peer-data-[size=lg]/menu-button:top-3 peer-data-[size=sm]/menu-button:top-0.5 peer-data-[size=sm]/menu-button:size-6 after:absolute after:-inset-2 hover:border-current md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0",
          className,
        ),
        // Shown only while its row is hovered or focused, on a wide screen with a pointer (styles/navigation.css).
        ...({
          "data-show-on-hover": showOnHover || undefined,
        } as React.ComponentProps<"button">),
      },
      props,
    ),
    render,
    state: {
      slot: "sidebar-menu-action",
      sidebar: "menu-action",
    },
  })
}

function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none absolute end-tight top-0 flex h-control-compact min-w-5 items-center justify-end font-mono text-small leading-none text-(--text) tabular-nums select-none group-data-[collapsible=icon]:hidden peer-data-active/menu-button:text-ink peer-data-[size=lg]/menu-button:h-12 peer-data-[size=sm]/menu-button:h-7",
        className,
      )}
      {...props}
    />
  )
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<"div"> & {
  showIcon?: boolean
}) {
  // A width between 50 and 90 %, seeded by the row's place in the tree, so server and browser agree.
  const id = React.useId()
  const width = `${50 + (seedOf(id) % 41)}%`

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn(
        "flex h-control-compact items-center gap-tight px-[calc(var(--space-tight)+var(--line))]",
        className,
      )}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-full"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-3.5 max-w-(--skeleton-width) flex-1 rounded-full"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "my-0 ms-[calc(var(--space-tight)+var(--line)+0.5rem)] me-0 flex min-w-0 list-none flex-col gap-0.5 border-s-(length:--line) border-(--edge) py-0.5 ps-tight group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  )
}

function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  )
}

function SidebarMenuSubButton({
  render,
  size = "md",
  isActive = false,
  className,
  ...props
}: useRender.ComponentProps<"a"> &
  React.ComponentProps<"a"> & {
    size?: "sm" | "md"
    isActive?: boolean
  }) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(
          row,
          "h-7 gap-tight px-tight group-data-[collapsible=icon]:hidden data-[size=md]:text-body data-[size=md]:leading-ui data-[size=sm]:text-small data-[size=sm]:leading-small",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "sidebar-menu-sub-button",
      sidebar: "menu-sub-button",
      size,
      active: isActive,
    },
  })
}

export {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
}
