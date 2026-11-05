"use client"

import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"
import { XIcon } from "lucide-react"
import { cn } from "@/serigraph/lib/utils"

import { Button } from "@/serigraph/ui/button"

// A plane laid against one edge of the window, over the page behind a fine screen of ink dots (never a dim or a
// blur). The plane colour, the ink line and the grain; the big radius only on its open side, and no line along the
// window's edge (styles/navigation.css). It does not slide: it fades in and grows a little from the edge it belongs to.
// Title in the reading face at lead size; the actions are pills at the foot, the main one last. The sheet never
// scrolls; a long body scrolls inside it (give the body min-h-0 and overflow-y-auto).

type Side = "top" | "right" | "bottom" | "left"

// Per side: where the sheet stands, how big it is, and the edge it grows from. A map rather than data-[side] variants,
// so a caller's width or height (the mobile sidebar's) merges over these instead of losing on specificity.
const SIDES: Record<Side, string> = {
  right: "inset-y-0 right-0 w-3/4 origin-right sm:max-w-sm",
  left: "inset-y-0 left-0 w-3/4 origin-left sm:max-w-sm",
  top: "inset-x-0 top-0 max-h-[85dvh] origin-top",
  bottom: "inset-x-0 bottom-0 max-h-[85dvh] origin-bottom",
}

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 stipple-screen duration-(--duration-overlay) ease-(--ease) data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className,
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: Side
  showCloseButton?: boolean
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Viewport
        data-slot="sheet-viewport"
        className="pointer-events-none fixed inset-0 z-50"
      >
        <SheetPrimitive.Popup
          data-slot="sheet-content"
          data-side={side}
          className={cn(
            "plane pointer-events-auto fixed z-50 flex flex-col gap-snug text-body leading-body outline-hidden duration-(--duration-overlay) ease-(--ease) [--sheet-spacing:var(--space-snug)] has-[>[data-slot=sheet-close]]:*:data-[slot=sheet-header]:pe-10 sm:[--sheet-spacing:var(--space-line)] data-open:animate-in data-open:fade-in-0 data-open:zoom-in-97 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-97",
            SIDES[side],
            className,
          )}
          {...props}
        >
          {children}
          {showCloseButton && (
            <SheetPrimitive.Close
              data-slot="sheet-close"
              render={
                <Button
                  variant="ghost"
                  className="absolute end-[calc(var(--sheet-spacing)-0.25rem)] top-[calc(var(--sheet-spacing)+(var(--type-lead)*var(--lh-ui)-var(--control-height-compact))/2)]"
                  size="icon-sm"
                />
              }
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </SheetPrimitive.Close>
          )}
        </SheetPrimitive.Popup>
      </SheetPrimitive.Viewport>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn(
        "flex flex-col gap-hair p-(--sheet-spacing) pb-0",
        className,
      )}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "mt-auto flex flex-wrap-reverse justify-end gap-tight p-(--sheet-spacing) pt-0 in-data-[side=bottom]:justify-start in-data-[side=top]:justify-start",
        className,
      )}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "m-0 font-read text-lead leading-ui font-semibold text-(--text)",
        className,
      )}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("m-0 text-body leading-body", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
