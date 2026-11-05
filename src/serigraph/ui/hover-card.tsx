"use client"

import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card"
import { cn } from "@/serigraph/lib/utils"

// A small plane floating over the page, like the popover: the plane colour, the ink line, the box radius, the grain
// and no shadow. A glance at what a link points to, opened by hovering or focusing it; it grows from its trigger and
// can carry a drawing (a medallion folly for a person or a planet). It stands 8px off its trigger, clear of the
// trigger's focus ring.

function HoverCard({ ...props }: PreviewCardPrimitive.Root.Props) {
  return <PreviewCardPrimitive.Root data-slot="hover-card" {...props} />
}

function HoverCardTrigger({ ...props }: PreviewCardPrimitive.Trigger.Props) {
  return (
    <PreviewCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  )
}

function HoverCardContent({
  className,
  side = "bottom",
  sideOffset = 8,
  align = "center",
  alignOffset = 0,
  ...props
}: PreviewCardPrimitive.Popup.Props &
  Pick<
    PreviewCardPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <PreviewCardPrimitive.Portal data-slot="hover-card-portal">
      <PreviewCardPrimitive.Positioner
        collisionPadding={8}
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PreviewCardPrimitive.Popup
          data-slot="hover-card-content"
          className={cn(
            "float-plane z-50 w-64 max-w-(--available-width) origin-(--transform-origin) p-snug text-small leading-small outline-hidden duration-(--duration-overlay) ease-(--ease) data-open:animate-in data-open:fade-in-0 data-open:zoom-in-97 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-97",
            className,
          )}
          {...props}
        />
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
