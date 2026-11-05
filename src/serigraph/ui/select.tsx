"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { cn } from "@/serigraph/lib/utils"

// The trigger is a field: a pill tinted from the surface beneath, the ink line and a fine chevron. The list is a
// floating plane that grows from the trigger (or opens over it, the chosen item over the trigger's words, which line
// up); its list scrolls, never the plane. The highlighted item sits on a flat highlight pill, which is also its focus
// mark, and the chosen item has a fine ink tick at the trailing edge.

// Lucide's 24-unit icons at 16px: a stroke of 1.5 × the line renders as exactly one line.
const fineIcon = "[stroke-width:calc(var(--line)*1.5)]"

const Select = SelectPrimitive.Root

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1", className)}
      {...props}
    />
  )
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-start", className)}
      {...props}
    />
  )
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "control-field flex w-fit cursor-pointer items-center justify-between gap-tight py-0 ps-snug pe-3.5 whitespace-nowrap select-none data-placeholder:text-ink-quiet data-[size=default]:h-control data-[size=sm]:h-control-compact *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-hair [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={<ChevronDownIcon className={cn("size-4", fineIcon)} />}
      />
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 8,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        collisionPadding={8}
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          className={cn(
            "float-plane relative isolate z-50 flex max-h-(--available-height) w-max max-w-(--available-width) min-w-(--anchor-width) origin-(--transform-origin) flex-col overflow-hidden duration-(--duration-control) ease-(--ease) data-[align-trigger=true]:animate-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-97 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-97",
            className,
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain p-hair">
            {children}
          </SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("caps px-tight pt-tight pb-hair text-(--text)", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "menu-item w-full gap-hair py-hair ps-tight pe-[calc(var(--space-tight)*2+0.875rem)] pointer-coarse:py-tight",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex shrink-0 gap-hair whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute end-tight top-1/2 grid size-3.5 -translate-y-1/2 place-items-center" />
        }
      >
        <svg
          viewBox="0 0 14 14"
          aria-hidden="true"
          className="size-full fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round]"
        >
          <path d="M2.5 7.4 5.6 10.3 11.5 3.6" strokeWidth={1.6} />
        </svg>
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        "pointer-events-none mx-tight my-hair h-0 border-t-(length:--line) border-[color:var(--edge,var(--ink))]",
        className,
      )}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "top-0 z-10 flex w-full cursor-default items-center justify-center bg-plane py-1 text-(--text) [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <ChevronUpIcon className={fineIcon} />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-plane py-1 text-(--text) [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <ChevronDownIcon className={fineIcon} />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
