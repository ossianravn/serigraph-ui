import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/serigraph/lib/utils"

// Words passed across the counter, as small planes in the ink line with the big radius; the corner toward the speaker
// stays tight, so a bubble never reads as a button. The person's own bubbles (default) are in the highlight; the
// other side (secondary) is in a tone, tone 1 unless data-tone says "2" … "4". Muted is a tint of the surface beneath
// in a quieter line, tinted the plane 2 colour, outline just the line (suggestions), ghost plain words, destructive a
// rose plane with its word. A filled bubble sets the surface for what it holds (styles/conversation.css). As a button
// or a link, the ligne-claire contour appears under the pointer and the bubble gives a little when pressed.

const bubbleVariants = cva(
  "group/bubble relative flex w-fit max-w-[min(100%,max(80%,18rem),var(--measure))] min-w-0 flex-col gap-1 group-data-[align=end]/message:self-end data-[align=end]:self-end data-[variant=ghost]:max-w-full",
  {
    variants: {
      variant: {
        default: "[--bubble-fill:var(--highlight)]",
        secondary:
          "[--bubble-fill:var(--tone-1)] data-[tone=2]:[--bubble-fill:var(--tone-2)] data-[tone=3]:[--bubble-fill:var(--tone-3)] data-[tone=4]:[--bubble-fill:var(--tone-4)]",
        muted:
          "[--bubble-fill:color-mix(in_oklab,var(--surface,var(--canvas))_30%,var(--paper))] [--bubble-grain:none] [--bubble-line:var(--ink-quiet)]",
        tinted: "[--bubble-fill:var(--plane-2)]",
        outline:
          "[--bubble-fill:transparent] [--bubble-grain:none] [--bubble-line:var(--edge,var(--ink))] [--bubble-text:var(--text,var(--ink))]",
        ghost:
          "[--bubble-fill:transparent] [--bubble-grain:none] [--bubble-line:transparent] [--bubble-text:var(--text,var(--ink))]",
        destructive: "[--bubble-fill:var(--rose)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function BubbleGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bubble-group"
      className={cn("flex min-w-0 flex-col gap-hair", className)}
      {...props}
    />
  )
}

function Bubble({
  variant = "default",
  align = "start",
  className,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof bubbleVariants> & {
    align?: "start" | "end"
  }) {
  return (
    <div
      data-slot="bubble"
      data-variant={variant}
      data-align={align}
      className={cn(bubbleVariants({ variant }), className)}
      {...props}
    />
  )
}

function BubbleContent({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "relative w-fit max-w-full min-w-0 rounded-plane rounded-ss-[0.375rem] border-(length:--line) border-(--bubble-line,var(--ink)) bg-(--bubble-fill) [background-image:var(--bubble-grain,var(--grain))] [background-size:var(--grain-size)] px-snug py-tight text-start font-read text-body leading-lead wrap-break-word text-(--bubble-text,var(--ink)) group-data-[align=end]/bubble:self-end group-data-[align=end]/bubble:rounded-ss-plane group-data-[align=end]/bubble:rounded-se-[0.375rem] group-data-[align=end]/message:rounded-ss-plane group-data-[align=end]/message:rounded-se-[0.375rem] group-data-[variant=ghost]/bubble:rounded-none group-data-[variant=ghost]/bubble:border-0 group-data-[variant=ghost]/bubble:p-0",
          "[a,button]:cursor-pointer [a,button]:no-underline [a,button]:contour [a,button]:press [a,button]:transition-[background-color,scale] [a,button]:duration-(--duration-control) [a,button]:ease-(--ease)",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "bubble-content",
    },
  })
}

// Reactions: a small pill in the plane colour and the ink line, figures in mono, laid over the bubble's edge.
const bubbleReactionsVariants = cva(
  "absolute z-10 flex h-[1.375rem] w-fit shrink-0 items-center justify-center gap-1 rounded-full border-(length:--line) border-ink bg-plane px-[0.45rem] font-mono text-[0.75rem] leading-none text-ink tabular-nums has-[button]:p-0 [&_svg:not([class*='size-'])]:size-3",
  {
    variants: {
      side: {
        top: "top-0 -translate-y-3/5",
        bottom: "bottom-0 translate-y-3/5",
      },
      align: {
        start: "start-snug",
        end: "end-snug",
      },
    },
    defaultVariants: {
      side: "bottom",
      align: "end",
    },
  },
)

function BubbleReactions({
  side = "bottom",
  align = "end",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "end"
  side?: "top" | "bottom"
}) {
  return (
    <div
      data-slot="bubble-reactions"
      data-align={align}
      data-side={side}
      className={cn(bubbleReactionsVariants({ side, align }), className)}
      {...props}
    />
  )
}

export { BubbleGroup, Bubble, BubbleContent, BubbleReactions }
