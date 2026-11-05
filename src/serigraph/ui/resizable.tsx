"use client"

import * as ResizablePrimitive from "react-resizable-panels"
import { cn } from "@/serigraph/lib/utils"

// Panels divided by one fine line in the surface's edge colour. The line's box is only the line; a wider strip
// around it (a pseudo-element) is the handle's hit area. Hovered, focused or dragged, the line doubles. withHandle
// threads a small pill grip on the line, tinted inside the ink line, that takes the highlight while the handle is
// operated; in a vertical group it lies on its side. Focus is the page's concentric ring. The group fills its parent
// (react-resizable-panels sets height: 100% inline), so size the parent rather than the group.

function ResizablePanelGroup({
  className,
  ...props
}: ResizablePrimitive.GroupProps) {
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full aria-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    />
  )
}

function ResizablePanel({ ...props }: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean
}) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      className={cn(
        "group/handle relative z-10 flex w-0 shrink-0 items-center justify-center border-l-(length:--line) border-[var(--edge,var(--ink))] text-[var(--edge,var(--ink))]",
        // The hit area: a 12px strip centred on the line (drawn as a border, so it snaps to device pixels).
        "after:absolute after:inset-y-0 after:left-[calc(var(--line)/-2)] after:w-3 after:-translate-x-1/2",
        // The line doubles while operated.
        "before:absolute before:inset-y-0 before:left-[calc(var(--line)/-2)] before:w-[calc(var(--line)*3)] before:-translate-x-1/2 before:scale-x-0 before:bg-current before:transition-[scale] before:duration-(--duration-control) before:ease-(--ease) data-[separator=active]:before:scale-100 data-[separator=focus]:before:scale-100 data-[separator=hover]:before:scale-100",
        // Turned, in a vertical group.
        "aria-[orientation=horizontal]:h-0 aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:border-l-0 aria-[orientation=horizontal]:border-t-(length:--line)",
        "aria-[orientation=horizontal]:after:inset-x-0 aria-[orientation=horizontal]:after:inset-y-auto aria-[orientation=horizontal]:after:top-[calc(var(--line)/-2)] aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-3 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2",
        "aria-[orientation=horizontal]:before:inset-x-0 aria-[orientation=horizontal]:before:inset-y-auto aria-[orientation=horizontal]:before:top-[calc(var(--line)/-2)] aria-[orientation=horizontal]:before:left-0 aria-[orientation=horizontal]:before:h-[calc(var(--line)*3)] aria-[orientation=horizontal]:before:w-full aria-[orientation=horizontal]:before:translate-x-0 aria-[orientation=horizontal]:before:-translate-y-1/2 aria-[orientation=horizontal]:before:scale-x-100 aria-[orientation=horizontal]:before:scale-y-0 aria-[orientation=horizontal]:data-[separator=active]:before:scale-100 aria-[orientation=horizontal]:data-[separator=focus]:before:scale-100 aria-[orientation=horizontal]:data-[separator=hover]:before:scale-100",
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div
          aria-hidden="true"
          className="z-10 h-6 w-3 shrink-0 -translate-x-[calc(var(--line)/2)] group-aria-[orientation=horizontal]/handle:translate-x-0 group-aria-[orientation=horizontal]/handle:-translate-y-[calc(var(--line)/2)] rounded-full border-(length:--line) border-ink bg-[color-mix(in_oklab,var(--surface,var(--canvas))_30%,var(--paper))] transition-[background-color] duration-(--duration-control) ease-(--ease) group-aria-[orientation=horizontal]/handle:h-3 group-aria-[orientation=horizontal]/handle:w-6 group-data-[separator=active]/handle:bg-highlight group-data-[separator=focus]/handle:bg-highlight group-data-[separator=hover]/handle:bg-highlight forced-colors:border-[CanvasText]"
        />
      )}
    </ResizablePrimitive.Separator>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
