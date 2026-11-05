"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { ChevronRightIcon } from "lucide-react"
import { cn } from "@/serigraph/lib/utils"

// A floating plane as wide as its longest item, whose list scrolls inside it. Items are in the reading face; the
// highlighted one sits on a flat highlight pill, which is also its focus mark (items take roving focus, so no ring). A
// destructive item's pill is rose. Checked items get a fine ink tick at the trailing edge, the chosen radio item a
// solid ink dot; shortcuts are in the mono face, group labels in the capitals, separators one fine ink line.
// Submenus open at the inline end. The plane stands 8px off its trigger, clear of the trigger's focus ring.

const item =
  "menu-item px-tight py-hair data-inset:ps-[calc(var(--space-tight)*2+1rem)]"

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 8,
  className,
  children,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        collisionPadding={8}
        className="isolate z-50"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "float-plane z-50 flex max-h-(--available-height) w-max max-w-(--available-width) min-w-(--anchor-width) origin-(--transform-origin) flex-col overflow-hidden outline-hidden duration-(--duration-control) ease-(--ease) data-open:animate-in data-open:fade-in-0 data-open:zoom-in-97 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-97",
            className,
          )}
          {...props}
        >
          <div className="min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain p-hair">
            {children}
          </div>
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "caps px-tight pt-tight pb-hair text-(--text) data-inset:ps-[calc(var(--space-tight)*2+1rem)]",
        className,
      )}
      {...props}
    />
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "group/dropdown-menu-item",
        item,
        "data-[variant=destructive]:data-highlighted:bg-rose",
        className,
      )}
      {...props}
    />
  )
}

function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(item, "data-popup-open:bg-highlight", className)}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ms-auto rtl:rotate-180" />
    </MenuPrimitive.SubmenuTrigger>
  )
}

function DropdownMenuSubContent({
  align = "start",
  // The plane's line and the list's padding are 7.6px: the submenu's first item lines up with its trigger, and the
  // submenu stands 4px clear of the menu.
  alignOffset = -7.6,
  side = "inline-end",
  sideOffset = 11.6,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={cn("min-w-36", className)}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

/** Where a checked or chosen item's mark sits: its trailing edge, put down with a little scale. */
const markSlot =
  "pointer-events-none absolute end-tight flex size-4 items-center justify-center"
const markIndicator =
  "grid size-full place-items-center transition-transform duration-(--duration-control) ease-(--ease) data-starting-style:scale-0 data-ending-style:scale-0"

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      className={cn(item, "pe-9", className)}
      checked={checked}
      {...props}
    >
      <span
        className={markSlot}
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <MenuPrimitive.CheckboxItemIndicator className={markIndicator}>
          <svg
            viewBox="0 0 14 14"
            aria-hidden="true"
            className="size-3.5 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round]"
          >
            <path d="M2.5 7.4 5.6 10.3 11.5 3.6" strokeWidth={1.6} />
          </svg>
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: MenuPrimitive.RadioItem.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      className={cn(item, "pe-9", className)}
      {...props}
    >
      <span className={markSlot} data-slot="dropdown-menu-radio-item-indicator">
        <MenuPrimitive.RadioItemIndicator className={markIndicator}>
          <svg viewBox="0 0 14 14" aria-hidden="true" className="size-3.5">
            <circle cx="7" cy="7" r="3.5" fill="currentColor" />
          </svg>
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn(
        "mx-tight my-hair border-t-(length:--line) border-(--edge)",
        className,
      )}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ms-auto ps-snug font-mono text-small leading-ui text-(--text)",
        className,
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
