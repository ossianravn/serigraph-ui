"use client"

import type * as React from "react"
import {
  CircleAlertIcon,
  InfoIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { Motif } from "@/serigraph/extras/motif"
import { cn } from "@/serigraph/lib/utils"
import { buttonVariants } from "@/serigraph/ui/button"
import { Spinner } from "@/serigraph/ui/spinner"

// A toast is a small floating plane in the ink line, with no shadow: the plane colour, or a tone for its kind (success
// the highlight with a sparkle, an error rose with a warning mark and its title saying what went wrong, a warning
// plane 2). The title in the reading face, the description under it; the action is a pill, the cancel an outline
// pill; the close button a small pill on the corner. A toast fades in and grows a little where it lands, and shrinks
// away as it goes; it never slides in. Only a swipe moves it, under the finger. Sonner's own stylesheet is unlayered,
// so the few rules that must beat it are marked important.

const mark = (icon: React.ReactNode) => (
  <span aria-hidden="true" className="grid size-5 place-items-center">
    {icon}
  </span>
)

const Toaster = ({ style, ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      icons={{
        success: mark(<Motif kind="sparkle" seed="toast" className="size-5" />),
        info: mark(<InfoIcon className="size-4" />),
        warning: mark(<TriangleAlertIcon className="size-4" />),
        error: mark(<CircleAlertIcon className="size-4" />),
        loading: mark(<Spinner className="size-[1.125rem]" />),
        close: <XIcon className="size-3" />,
      }}
      style={{ "--width": "22rem", ...style } as React.CSSProperties}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: cn(
            "float-plane flex w-(--width) items-start gap-tight py-tight ps-snug pe-tight font-read text-small leading-small data-[expanded=false]:data-[front=false]:*:opacity-0",
            // Focus: the page's concentric ring, in the canvas's line; never sonner's shadow.
            "focus-visible:[box-shadow:none]! focus-visible:outline-(length:--line)! focus-visible:outline-offset-3! focus-visible:outline-(--on-canvas)! focus-visible:outline-solid!",
            // Fade and grow in, shrink and fade out, on the one curve.
            "[transition-duration:var(--duration-overlay)]! [transition-timing-function:var(--ease)]! data-[mounted=false]:[--y:scale(0.97)]! data-[removed=true]:data-[front=true]:data-[swipe-out=false]:[--y:scale(0.97)]! data-[removed=true]:data-[front=false]:data-[swipe-out=false]:data-[expanded=true]:[--y:translateY(calc(var(--lift)*var(--offset)))_scale(0.97)]!",
          ),
          success: "[--plane:var(--highlight)]",
          error: "[--plane:var(--rose)]",
          warning: "[--plane:var(--plane-2)]",
          icon: "relative mt-px flex size-5 shrink-0 items-center justify-center",
          content: "flex min-w-0 flex-1 flex-col gap-0.5 py-px",
          title: "font-read text-body leading-ui font-semibold",
          description: "text-small leading-small",
          actionButton: buttonVariants({
            size: "xs",
            className: "shrink-0 self-center",
          }),
          cancelButton: buttonVariants({
            variant: "outline",
            size: "xs",
            className: "shrink-0 self-center",
          }),
          closeButton: buttonVariants({
            variant: "secondary",
            size: "icon-xs",
            className:
              "absolute! -top-2.5 -left-2.5 size-6! [--fill:var(--surface)]",
          }),
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
