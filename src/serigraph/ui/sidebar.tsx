"use client"

import * as React from "react"
import { PanelLeftIcon } from "lucide-react"
import { cn } from "@/serigraph/lib/utils"

import { Button } from "@/serigraph/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/serigraph/ui/sheet"
import { SidebarProvider, useSidebar } from "@/serigraph/ui/sidebar-provider"

// A column on the canvas, no fill of its own, with one fine line down its inner edge in the surface's edge colour.
// Section labels are in the capitals; the current item is a highlight pill in the ink line. It folds to icons or off
// the canvas on wide screens; on phones it becomes a sheet, a plane against the edge. The floating variant is a plane
// standing in the column; the inset variant puts the page beside it on a plane instead. The parts live in
// sidebar-provider.tsx, sidebar-sections.tsx and sidebar-menu.tsx and are all exported from here.

const SIDEBAR_WIDTH_MOBILE = "18rem"

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  dir,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "flex h-full w-(--sidebar-width) flex-col border-e-(length:--line) border-(--edge) text-(--text)",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          dir={dir}
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="w-(--sidebar-width) gap-0 p-0"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
          showCloseButton={false}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  const framed = variant === "floating" || variant === "inset"
  return (
    <div
      className="group peer hidden text-(--text) md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* Holds the sidebar's room in the layout on wide screens. */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-(--duration-overlay) ease-(--ease)",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          framed
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+var(--line)+var(--space-hair)*2)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
        )}
      />
      <div
        data-slot="sidebar-container"
        data-side={side}
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-(--duration-overlay) ease-(--ease) data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] md:flex",
          framed
            ? "p-hair group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+var(--line)+var(--space-hair)*2)]"
            : "border-(--edge) group-data-[collapsible=icon]:w-(--sidebar-width-icon) data-[side=left]:border-r-(length:--line) data-[side=right]:border-l-(length:--line)",
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="flex size-full flex-col group-data-[variant=floating]:plane"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar, isMobile, open, openMobile } = useSidebar()

  return (
    <Button
      data-sidebar="trigger"
      aria-expanded={isMobile ? openMobile : open}
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon-sm"
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeftIcon className="rtl:-scale-x-100" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

// A strip astride the inner edge that folds the sidebar when clicked; under the pointer the edge's line doubles.
function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-(--ease) group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[calc(var(--line)*2)] group-data-[side=left]:after:-translate-x-full hover:after:bg-(--edge) sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className,
      )}
      {...props}
    />
  )
}

// The page beside the sidebar. Beside the inset variant it is a plane with the big radius, standing off the edges.
function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "relative flex w-full flex-1 flex-col md:peer-data-[variant=inset]:m-hair md:peer-data-[variant=inset]:ms-0 md:peer-data-[variant=inset]:plane md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ms-hair",
        className,
      )}
      {...props}
    />
  )
}

export {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
}
export {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarSeparator,
} from "@/serigraph/ui/sidebar-sections"
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
} from "@/serigraph/ui/sidebar-menu"
