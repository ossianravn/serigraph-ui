"use client"

import * as React from "react"
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar"
import { cn } from "@/serigraph/lib/utils"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/serigraph/ui/dropdown-menu"

// A row of menu titles in the capitals inside one fine line, on whatever is beneath. A title is a ghost pill: the
// line comes under the pointer, and while its menu is open it takes the pill pressed (the line and the surface's
// shade), so moving across the bar with the arrow keys shows which menu is showing. Each opens the dropdown menu's own
// plane; every part is the dropdown menu's component under a menubar data-slot, so the two cannot drift apart. Submenus
// open towards the inline end, so they follow right-to-left text.

function Menubar({ className, ...props }: MenubarPrimitive.Props) {
  return (
    <MenubarPrimitive
      data-slot="menubar"
      className={cn(
        "flex h-control w-fit items-center gap-0.5 rounded-full border-(length:--line) border-(--edge) p-[3px] text-(--text)",
        className,
      )}
      {...props}
    />
  )
}

function MenubarMenu({ ...props }: React.ComponentProps<typeof DropdownMenu>) {
  return <DropdownMenu data-slot="menubar-menu" {...props} />
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuGroup>) {
  return <DropdownMenuGroup data-slot="menubar-group" {...props} />
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPortal>) {
  return <DropdownMenuPortal data-slot="menubar-portal" {...props} />
}

function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuTrigger>) {
  return (
    <DropdownMenuTrigger
      data-slot="menubar-trigger"
      className={cn(
        "pill contour flex h-full cursor-pointer items-center caps px-snug whitespace-nowrap select-none [--contour-x:0.5625rem] [--contour-y:0.25rem] [--fill-grain:none] [--fill:transparent] [--pill-line:transparent] [--pill-text:var(--text)] [--press-fill:var(--surface)] hover:[--pill-line:var(--edge)] data-popup-open:[--pill-line:var(--edge)]",
        className,
      )}
      {...props}
    />
  )
}

function MenubarContent({
  className,
  align = "start",
  // The trigger stands 4.5px inside the bar's line: the menu's edge lines up with the trigger's outer edge (the bar's,
  // for the first title) and stands 8px below the bar.
  alignOffset = -4.5,
  sideOffset = 12.5,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="menubar-content"
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={cn("min-w-48", className)}
      {...props}
    />
  )
}

function MenubarItem({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuItem>) {
  return (
    <DropdownMenuItem
      data-slot="menubar-item"
      className={cn("group/menubar-item", className)}
      {...props}
    />
  )
}

function MenubarCheckboxItem({
  ...props
}: React.ComponentProps<typeof DropdownMenuCheckboxItem>) {
  return (
    <DropdownMenuCheckboxItem data-slot="menubar-checkbox-item" {...props} />
  )
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuRadioGroup>) {
  return <DropdownMenuRadioGroup data-slot="menubar-radio-group" {...props} />
}

function MenubarRadioItem({
  ...props
}: React.ComponentProps<typeof DropdownMenuRadioItem>) {
  return <DropdownMenuRadioItem data-slot="menubar-radio-item" {...props} />
}

function MenubarLabel({
  ...props
}: React.ComponentProps<typeof DropdownMenuLabel>) {
  return <DropdownMenuLabel data-slot="menubar-label" {...props} />
}

function MenubarSeparator({
  ...props
}: React.ComponentProps<typeof DropdownMenuSeparator>) {
  return <DropdownMenuSeparator data-slot="menubar-separator" {...props} />
}

function MenubarShortcut({
  ...props
}: React.ComponentProps<typeof DropdownMenuShortcut>) {
  return <DropdownMenuShortcut data-slot="menubar-shortcut" {...props} />
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuSub>) {
  return <DropdownMenuSub data-slot="menubar-sub" {...props} />
}

function MenubarSubTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuSubTrigger>) {
  return <DropdownMenuSubTrigger data-slot="menubar-sub-trigger" {...props} />
}

function MenubarSubContent({
  side = "inline-end",
  ...props
}: React.ComponentProps<typeof DropdownMenuSubContent>) {
  return (
    <DropdownMenuSubContent
      data-slot="menubar-sub-content"
      side={side}
      {...props}
    />
  )
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
}
