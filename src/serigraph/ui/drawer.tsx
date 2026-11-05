"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { cn } from "@/serigraph/lib/utils"

// A plane against one edge of the window (the bottom, by default): the plane colour, the ink line on its three open
// sides and the big radius on its open corners only, over a fine screen of ink dots, never a dim or a blur. Surfaces
// do not slide: it fades in and grows a little from its edge, and closes the same way. A drag is direct manipulation,
// so the plane follows the finger, and a sheet flung away carries on in the direction it was thrown. The grab handle
// is a small pill inside the ink line that takes the highlight under the pointer. On a phone the footer's actions
// stack full width, the main one first; from md a top or bottom sheet sets them in a row, sized to their words, the
// main one last. Swiping, snap points and nested stacking are base-nova's; a sheet with a drawer open over it empties
// its words and stays as a plane behind.

type DrawerContextProps = {
  hasSnapPoints: boolean
  modal: DrawerPrimitive.Root.Props["modal"]
  showSwipeHandle: boolean
  swipeDirection: NonNullable<DrawerPrimitive.Root.Props["swipeDirection"]>
}

const DrawerContext = React.createContext<DrawerContextProps | null>(null)

function useDrawer() {
  const context = React.useContext(DrawerContext)

  if (!context) {
    throw new Error("useDrawer must be used within a Drawer.")
  }

  return context
}

function Drawer({
  modal = true,
  showSwipeHandle = false,
  snapPoints,
  swipeDirection = "down",
  ...props
}: DrawerPrimitive.Root.Props & {
  showSwipeHandle?: boolean
}) {
  const hasSnapPoints = snapPoints != null && snapPoints.length > 0
  const contextValue = React.useMemo(
    () => ({ hasSnapPoints, modal, showSwipeHandle, swipeDirection }),
    [hasSnapPoints, modal, showSwipeHandle, swipeDirection],
  )

  return (
    <DrawerContext.Provider value={contextValue}>
      <DrawerPrimitive.Root
        data-slot="drawer"
        modal={modal}
        snapPoints={snapPoints}
        swipeDirection={swipeDirection}
        {...props}
      />
    </DrawerContext.Provider>
  )
}

function DrawerTrigger({ ...props }: DrawerPrimitive.Trigger.Props) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal({ ...props }: DrawerPrimitive.Portal.Props) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({ ...props }: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

// The screen fades with the swipe, so it follows the finger; at rest it is whole, snap points or not.
function DrawerOverlay({
  className,
  ...props
}: DrawerPrimitive.Backdrop.Props) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 min-h-dvh stipple-screen opacity-[max(var(--drawer-overlay-min-opacity,0),calc(1-var(--drawer-swipe-progress)))] transition-opacity duration-(--duration-overlay) ease-(--ease) select-none data-ending-style:pointer-events-none data-ending-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-snap-points:[--drawer-overlay-min-opacity:1] data-starting-style:opacity-0 data-swiping:duration-0 supports-[-webkit-touch-callout:none]:absolute",
        className,
      )}
      {...props}
    />
  )
}

function DrawerSwipeHandle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-swipe-handle"
      aria-hidden="true"
      className={cn(
        "group/drawer-handle relative z-10 flex shrink-0 cursor-grab items-center justify-center transition-opacity duration-(--duration-overlay) group-data-nested-drawer-open/drawer-popup:opacity-0 group-data-nested-drawer-swiping/drawer-popup:opacity-100 group-data-[swipe-axis=x]/drawer-popup:h-full group-data-[swipe-axis=x]/drawer-popup:w-7 group-data-[swipe-axis=y]/drawer-popup:h-7 group-data-[swipe-axis=y]/drawer-popup:w-full group-data-[swipe-direction=left]/drawer-popup:order-last group-data-[swipe-direction=up]/drawer-popup:order-last active:cursor-grabbing",
        className,
      )}
      {...props}
    >
      <span className="block h-2.5 w-12 shrink-0 rounded-full border-(length:--line) border-ink bg-[color-mix(in_oklab,var(--surface,var(--plane))_30%,var(--paper))] transition-[background-color] duration-(--duration-control) ease-(--ease) group-active/drawer-handle:bg-highlight group-hover/drawer-handle:bg-highlight group-data-[swipe-axis=x]/drawer-popup:h-12 group-data-[swipe-axis=x]/drawer-popup:w-2.5" />
    </div>
  )
}

function DrawerContent({
  className,
  children,
  ...props
}: DrawerPrimitive.Popup.Props) {
  const { hasSnapPoints, modal, showSwipeHandle, swipeDirection } = useDrawer()
  const swipeAxis =
    swipeDirection === "down" || swipeDirection === "up" ? "y" : "x"

  return (
    <DrawerPortal data-slot="drawer-portal">
      {modal === true && (
        <DrawerOverlay data-snap-points={hasSnapPoints ? "" : undefined} />
      )}
      <DrawerPrimitive.Viewport
        data-slot="drawer-viewport"
        data-modal={modal}
        className="pointer-events-none fixed inset-0 z-50 select-none data-[modal=true]:pointer-events-auto"
      >
        <DrawerPrimitive.Popup
          data-slot="drawer-popup"
          data-swipe-axis={swipeAxis}
          data-snap-points={hasSnapPoints ? "" : undefined}
          className={cn(
            // Base: a plane against the window's edge. --grow scales it from that edge as it opens.
            "group/drawer-popup plane pointer-events-auto fixed z-50 flex h-(--drawer-content-height) max-h-(--drawer-content-max-height,none) min-h-0 w-(--drawer-content-width,auto) transform-[translate3d(var(--translate-x,0px),var(--translate-y,0px),0)_scale(calc(var(--stack-scale)*var(--grow)))] flex-col text-body leading-body [--drawer-spacing:var(--space-snug)] [--grow:1] transition-[transform,height,opacity] duration-(--duration-overlay) ease-(--ease) will-change-transform outline-hidden select-none [interpolate-size:allow-keywords] sm:[--drawer-spacing:var(--space-line)]",
            // Sizing.
            "[--drawer-content-height:var(--drawer-height,auto)] data-[swipe-axis=x]:[--drawer-content-width:75%] data-[swipe-axis=y]:[--drawer-content-max-height:calc(100dvh-6rem)] data-[swipe-axis=y]:data-snap-points:[--drawer-content-height:100dvh] data-[swipe-axis=x]:sm:[--drawer-content-width:24rem]",
            // Stack.
            "[--peek:1rem] [--stack-height:var(--drawer-frontmost-height,var(--drawer-height,0px))] [--stack-peek-offset:max(0px,calc((var(--nested-drawers)-var(--stack-progress))*var(--peek)))] [--stack-progress:clamp(0,var(--drawer-swipe-progress),1)] [--stack-scale-base:max(0,calc(1-(var(--nested-drawers)*var(--stack-step))))] [--stack-scale:clamp(0,calc(var(--stack-scale-base)+(var(--stack-step)*var(--stack-progress))),1)] [--stack-shrink:calc(1-var(--stack-scale))] [--stack-step:0.05]",
            // Opening and closing: fade and grow from the edge. A sheet swiped away carries on in that direction.
            "data-starting-style:opacity-0 data-starting-style:[--grow:0.97] data-ending-style:opacity-0 data-ending-style:[--grow:0.97] data-swipe-dismiss:data-ending-style:transform-(--closed-transform) data-swipe-dismiss:data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-swiping:duration-0 data-nested-drawer-swiping:duration-0 motion-reduce:data-starting-style:[--grow:1] motion-reduce:data-ending-style:[--grow:1]",
            // Axis: y.
            "data-[swipe-axis=y]:inset-x-0 data-[swipe-axis=y]:data-nested-drawer-open:h-(--stack-height)",
            // Axis: x.
            "data-[swipe-axis=x]:inset-y-0 data-[swipe-axis=x]:flex-row",
            // Direction: down. The edge it stands on has no line and no radius; the home indicator keeps its room.
            "data-[swipe-direction=down]:bottom-0 data-[swipe-direction=down]:origin-bottom data-[swipe-direction=down]:rounded-b-none data-[swipe-direction=down]:border-b-0 data-[swipe-direction=down]:pb-[env(safe-area-inset-bottom)] data-[swipe-direction=down]:[--closed-transform:translate3d(0,calc(100%+2rem),0)] data-[swipe-direction=down]:[--translate-y:calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)-var(--stack-peek-offset)-(var(--stack-shrink)*var(--stack-height)))]",
            // Direction: up.
            "data-[swipe-direction=up]:top-0 data-[swipe-direction=up]:origin-top data-[swipe-direction=up]:rounded-t-none data-[swipe-direction=up]:border-t-0 data-[swipe-direction=up]:pt-[env(safe-area-inset-top)] data-[swipe-direction=up]:[--closed-transform:translate3d(0,calc(-100%-2rem),0)] data-[swipe-direction=up]:[--translate-y:calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)+var(--stack-peek-offset)+(var(--stack-shrink)*var(--stack-height)))]",
            // Direction: left.
            "data-[swipe-direction=left]:left-0 data-[swipe-direction=left]:origin-left data-[swipe-direction=left]:rounded-l-none data-[swipe-direction=left]:border-l-0 data-[swipe-direction=left]:[--closed-transform:translate3d(calc(-100%-2rem),0,0)] data-[swipe-direction=left]:[--translate-x:calc(var(--drawer-swipe-movement-x)+var(--stack-peek-offset)+(var(--stack-shrink)*100%))]",
            // Direction: right.
            "data-[swipe-direction=right]:right-0 data-[swipe-direction=right]:origin-right data-[swipe-direction=right]:rounded-r-none data-[swipe-direction=right]:border-r-0 data-[swipe-direction=right]:[--closed-transform:translate3d(calc(100%+2rem),0,0)] data-[swipe-direction=right]:[--translate-x:calc(var(--drawer-swipe-movement-x)-var(--stack-peek-offset)-(var(--stack-shrink)*100%))]",
            className,
          )}
          {...props}
        >
          {showSwipeHandle && <DrawerSwipeHandle />}
          <DrawerPrimitive.Content
            data-slot="drawer-content"
            className="flex min-h-0 flex-1 flex-col overflow-hidden overscroll-contain transition-opacity duration-(--duration-overlay) ease-(--ease) select-text group-data-nested-drawer-open/drawer-popup:opacity-0 group-data-nested-drawer-swiping/drawer-popup:opacity-100 group-data-swiping/drawer-popup:select-none"
          >
            {children}
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "flex shrink-0 flex-col gap-hair p-(--drawer-spacing) pb-0 group-data-[swipe-axis=y]/drawer-popup:text-center md:group-data-[swipe-axis=y]/drawer-popup:text-start",
        className,
      )}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        "mt-auto flex shrink-0 flex-col gap-tight p-(--drawer-spacing) pt-snug md:group-data-[swipe-axis=y]/drawer-popup:flex-row-reverse md:group-data-[swipe-axis=y]/drawer-popup:justify-end",
        className,
      )}
      {...props}
    />
  )
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn(
        "m-0 font-read text-h2 leading-ui font-semibold text-(--text)",
        className,
      )}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("m-0 text-body leading-body text-balance", className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerSwipeHandle,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
