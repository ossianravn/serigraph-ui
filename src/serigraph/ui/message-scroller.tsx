"use client"

import * as React from "react"
import {
  MessageScroller as MessageScrollerPrimitive,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from "@shadcn/react/message-scroller"
import { ArrowDownIcon } from "lucide-react"
import { cn } from "@/serigraph/lib/utils"
import { Button } from "@/serigraph/ui/button"

// The scroll container for a thread, keeping the newest message in view. Its scrollbar is a thin thumb in the
// surface's edge colour on no track; the viewport's focus ring is drawn inside it, since the scroller clips. When the
// reader scrolls away from the latest message, a plane 2 pill comes up near the edge with a fine arrow: it fades in and
// grows a little, as sheets do, and never slides.

function MessageScrollerProvider(
  props: React.ComponentProps<typeof MessageScrollerPrimitive.Provider>,
) {
  return <MessageScrollerPrimitive.Provider {...props} />
}

function MessageScroller({
  className,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Root>) {
  return (
    <MessageScrollerPrimitive.Root
      data-slot="message-scroller"
      className={cn(
        "group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden",
        className,
      )}
      {...props}
    />
  )
}

function MessageScrollerViewport({
  className,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Viewport>) {
  return (
    <MessageScrollerPrimitive.Viewport
      data-slot="message-scroller-viewport"
      className={cn(
        "size-full min-h-0 min-w-0 overflow-y-auto overscroll-contain rounded-[inherit] [scrollbar-color:var(--edge,var(--ink))_transparent] [scrollbar-gutter:stable] [scrollbar-width:thin] contain-content focus-visible:-outline-offset-[calc(var(--line)+3px)] data-autoscrolling:[scrollbar-color:transparent_transparent] data-pending-scroll:invisible",
        className,
      )}
      {...props}
    />
  )
}

function MessageScrollerContent({
  className,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Content>) {
  return (
    <MessageScrollerPrimitive.Content
      data-slot="message-scroller-content"
      className={cn("flex h-max min-h-full flex-col gap-snug", className)}
      {...props}
    />
  )
}

function MessageScrollerItem({
  className,
  scrollAnchor = false,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Item>) {
  return (
    <MessageScrollerPrimitive.Item
      data-slot="message-scroller-item"
      scrollAnchor={scrollAnchor}
      className={cn(
        "min-w-0 shrink-0 [contain-intrinsic-size:auto_10rem] [content-visibility:auto]",
        className,
      )}
      {...props}
    />
  )
}

function MessageScrollerButton({
  direction = "end",
  className,
  children,
  render,
  variant = "secondary",
  size = "sm",
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Button> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <MessageScrollerPrimitive.Button
      data-slot="message-scroller-button"
      data-direction={direction}
      data-variant={variant}
      data-size={size}
      direction={direction}
      className={cn(
        "absolute start-1/2 z-10 -translate-x-1/2 rtl:translate-x-1/2",
        "transition-[scale,opacity,visibility,background-color]! duration-(--duration-overlay)! ease-(--ease)!",
        "data-[active=false]:pointer-events-none data-[active=false]:invisible data-[active=false]:scale-97 data-[active=false]:opacity-0 data-[active=true]:scale-100 data-[active=true]:opacity-100 data-[direction=end]:bottom-snug data-[direction=start]:top-snug data-[direction=start]:[&_[data-slot=message-scroller-arrow]]:rotate-180",
        className,
      )}
      render={render ?? <Button variant={variant} size={size} />}
      {...props}
    >
      {children ?? (
        <>
          <ArrowDownIcon
            aria-hidden="true"
            data-icon="inline-start"
            data-slot="message-scroller-arrow"
            className="[stroke-width:calc(var(--line)*1.5)]"
          />
          <span className="sr-only">Jump to </span>
          {direction === "end" ? "Latest" : "Earliest"}
        </>
      )}
    </MessageScrollerPrimitive.Button>
  )
}

export {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
}
