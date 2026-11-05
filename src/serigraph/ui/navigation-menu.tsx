import * as React from "react"
import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/serigraph/lib/utils"

// Triggers and top-level links in the capitals, as ghost pills: the line comes under the pointer, and an open trigger
// takes the pill pressed (the line and the surface's shade) while its fine chevron turns over. The current page (a link
// with `active` gets aria-current="page") is a highlight pill inside the ink line. Panels open on a floating plane
// that grows from its trigger; moving to another trigger swaps the panel in place, since surfaces do not slide. Panel
// links are rows in the reading face on a flat highlight under the pointer; the current one also takes the ink line
// (styles/navigation.css, so a top-level link given the trigger's style keeps the capitals and the pill).

// Lucide's 24-unit icons at 14px: a stroke of 1.5 × the line × 24/14 renders as exactly one line.
const fineChevron = "size-3.5 [stroke-width:calc(var(--line)*1.5*16/14)]"

const navigationMenuTriggerStyle = cva(
  "group/navigation-menu-trigger pill contour inline-flex h-control-compact w-max cursor-pointer flex-row items-center justify-center gap-hair caps px-snug py-0 whitespace-nowrap no-underline select-none [--contour-x:0.5625rem] [--contour-y:0.25rem] [--fill-grain:none] [--fill:transparent] [--pill-line:transparent] [--pill-text:var(--text)] [--press-fill:var(--surface)] hover:[--pill-line:var(--edge)] aria-disabled:pointer-events-none aria-disabled:[--pill-text:var(--text-quiet)] data-popup-open:[--pill-line:var(--edge)] aria-[current=page]:[--fill-grain:var(--grain)] aria-[current=page]:[--fill:var(--highlight)] aria-[current=page]:[--pill-line:var(--ink)] aria-[current=page]:[--pill-text:var(--ink)] aria-[current=page]:hover:[--pill-line:var(--ink)]",
)

function NavigationMenu({
  align = "start",
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Root.Props &
  Pick<NavigationMenuPrimitive.Positioner.Props, "align">) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
      <NavigationMenuPositioner align={align} />
    </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group m-0 flex flex-1 list-none items-center justify-center gap-1 p-0",
        className,
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Trigger.Props) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group pe-3.5", className)}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        aria-hidden="true"
        className={cn(
          fineChevron,
          "pointer-events-none shrink-0 transition-transform duration-(--duration-overlay) ease-(--ease) group-data-popup-open/navigation-menu-trigger:rotate-180",
        )}
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: NavigationMenuPrimitive.Content.Props) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "h-full w-auto p-hair transition-opacity duration-(--duration-control) ease-(--ease) data-ending-style:opacity-0 data-starting-style:opacity-0",
        className,
      )}
      {...props}
    />
  )
}

function NavigationMenuPositioner({
  className,
  side = "bottom",
  sideOffset = 8,
  align = "start",
  alignOffset = 0,
  ...props
}: NavigationMenuPrimitive.Positioner.Props) {
  return (
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Positioner
        collisionPadding={8}
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className={cn(
          "isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width)",
          className,
        )}
        {...props}
      >
        <NavigationMenuPrimitive.Popup className="float-plane relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) outline-hidden transition-[opacity,scale] duration-(--duration-overlay) ease-(--ease) data-ending-style:scale-97 data-ending-style:opacity-0 data-starting-style:scale-97 data-starting-style:opacity-0">
          <NavigationMenuPrimitive.Viewport className="relative size-full overflow-hidden rounded-[inherit]" />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  )
}

function NavigationMenuLink({
  className,
  ...props
}: NavigationMenuPrimitive.Link.Props) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex items-center gap-tight px-tight py-hair no-underline [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Icon>) {
  return (
    <NavigationMenuPrimitive.Icon
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-1 flex h-1.5 items-end justify-center overflow-hidden text-(--text) data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in",
        className,
      )}
      {...props}
    >
      <ChevronDownIcon className={cn(fineChevron, "rotate-180")} />
    </NavigationMenuPrimitive.Icon>
  )
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuPositioner,
}
