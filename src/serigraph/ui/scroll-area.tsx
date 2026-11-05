"use client"

import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"
import { cn } from "@/serigraph/lib/utils"

// A thin ink thumb on no track: a pill in the surface's edge colour (ink on bright surfaces, paper on Night's
// canvas), two lines wide, that doubles under the pointer or while dragged. The thumb scales rather than resizes, so
// nothing moves layout; the bar keeps a 10px hit area and stands in from the edges, clear of a rounded frame's
// corners. The viewport takes the page's concentric focus ring.

function ScrollArea({
  className,
  children,
  ...props
}: ScrollAreaPrimitive.Root.Props) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="size-full rounded-[inherit]"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "group/scrollbar flex touch-none p-px select-none data-[orientation=horizontal]:mx-tight data-[orientation=horizontal]:mb-1 data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:my-tight data-[orientation=vertical]:me-1 data-[orientation=vertical]:w-2.5",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 text-[var(--edge,var(--ink))] before:absolute before:rounded-full before:bg-current before:transition-[scale] before:duration-(--duration-control) before:ease-(--ease) data-[orientation=horizontal]:before:inset-x-0 data-[orientation=horizontal]:before:top-1/2 data-[orientation=horizontal]:before:h-[calc(var(--line)*4)] data-[orientation=horizontal]:before:-translate-y-1/2 data-[orientation=horizontal]:before:scale-y-50 data-[orientation=vertical]:before:inset-y-0 data-[orientation=vertical]:before:left-1/2 data-[orientation=vertical]:before:w-[calc(var(--line)*4)] data-[orientation=vertical]:before:-translate-x-1/2 data-[orientation=vertical]:before:scale-x-50 hover:before:scale-100 active:before:scale-100 forced-colors:before:bg-[CanvasText]"
      />
    </ScrollAreaPrimitive.Scrollbar>
  )
}

export { ScrollArea, ScrollBar }
