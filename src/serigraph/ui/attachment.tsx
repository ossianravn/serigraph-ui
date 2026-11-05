import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/serigraph/lib/utils"
import { Button } from "@/serigraph/ui/button"

// Files as small pills in the ink line, the file name in mono. With media, the media is a circle in the pill's round
// end, concentric with it: an icon on a tint of the pill, or a picture with the line drawn over its edge. Upright (a
// tile) the pill becomes a small plane with the box radius and the media a rounded square inside it, again
// concentric. Colour arrives with the file: done prints in the plane colour; idle (waiting to go) is a tint inside a
// dashed line, as a technical drawing marks what is not yet built; uploading and processing are the tint inside the
// solid line; error is a rose pill whose description says what went wrong. A ticket you can open darkens a step under
// the pointer and gives a little when pressed (styles/conversation.css).

const attachmentVariants = cva(
  "group/attachment relative isolate flex min-h-[calc(var(--ticket-media)+2*var(--ticket-pad)+2*var(--line))] w-fit max-w-full min-w-0 shrink-0 gap-(--ticket-gap) border-(length:--line) border-ink bg-(--ticket-fill) [background-image:var(--ticket-grain,var(--grain))] [background-size:var(--grain-size)] text-ink [--ticket-fill:var(--plane)]",
  {
    variants: {
      size: {
        default:
          "[--ticket-gap:var(--space-tight)] [--ticket-media:2.25rem] [--ticket-pad:0.3125rem]",
        sm: "[--ticket-gap:0.5rem] [--ticket-media:1.75rem] [--ticket-pad:0.25rem]",
        xs: "[--ticket-gap:0.375rem] [--ticket-media:1.25rem] [--ticket-pad:0.1875rem]",
      },
      orientation: {
        horizontal:
          "max-w-[min(100%,22rem)] min-w-40 items-center rounded-full px-snug has-data-[slot=attachment-media]:p-(--ticket-pad) has-data-[slot=attachment-media]:has-data-[slot=attachment-content]:pe-snug",
        vertical:
          "w-(--ticket-w) flex-col rounded-box p-(--ticket-pad) [--ticket-w:6rem] has-data-[slot=attachment-content]:pb-tight has-data-[slot=attachment-content]:[--ticket-w:7.5rem]",
      },
    },
  },
)

function Attachment({
  className,
  state = "done",
  size = "default",
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof attachmentVariants> & {
    state?: "idle" | "uploading" | "processing" | "error" | "done"
  }) {
  return (
    <div
      data-slot="attachment"
      data-state={state}
      data-size={size}
      data-orientation={orientation}
      className={cn(attachmentVariants({ size, orientation }), className)}
      {...props}
    />
  )
}

const attachmentMediaVariants = cva(
  "relative flex aspect-square w-(--ticket-media) shrink-0 items-center justify-center overflow-hidden rounded-full text-ink group-data-[orientation=vertical]/attachment:w-full group-data-[orientation=vertical]/attachment:rounded-[calc(var(--r-box)-var(--ticket-pad)-var(--line))] group-data-[orientation=vertical]/attachment:*:data-[slot=spinner]:size-6! [&_svg]:pointer-events-none [&_svg:not([data-slot=spinner])]:[stroke-width:calc(var(--line)*1.5)] [&_svg:not([class*='size-'])]:size-4 group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-6 group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3",
  {
    variants: {
      variant: {
        icon: "border-(length:--line) border-ink bg-[color-mix(in_oklab,var(--ticket-fill)_30%,var(--paper))]",
        image:
          "bg-[color-mix(in_oklab,var(--ticket-fill)_30%,var(--paper))] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-(length:--line) after:border-ink *:data-[slot=drawing]:w-full *:[img]:aspect-square *:[img]:w-full *:[img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "icon",
    },
  },
)

function AttachmentMedia({
  className,
  variant = "icon",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof attachmentMediaVariants>) {
  return (
    <div
      data-slot="attachment-media"
      data-variant={variant}
      className={cn(attachmentMediaVariants({ variant }), className)}
      {...props}
    />
  )
}

function AttachmentContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-content"
      className={cn(
        "flex max-w-full min-w-0 flex-1 flex-col justify-center group-data-[orientation=vertical]/attachment:px-1",
        className,
      )}
      {...props}
    />
  )
}

function AttachmentTitle({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-title"
      className={cn(
        "block max-w-full min-w-0 truncate font-mono text-[0.8125rem] leading-[1.4] text-ink group-data-[size=xs]/attachment:text-[0.75rem] group-data-[orientation=vertical]/attachment:text-[0.75rem]",
        className,
      )}
      {...props}
    />
  )
}

function AttachmentDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-description"
      className={cn(
        "block max-w-full min-w-0 truncate font-read text-small leading-[1.4] text-ink",
        className,
      )}
      {...props}
    />
  )
}

function AttachmentActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-actions"
      className={cn(
        "relative z-20 -me-1.5 flex shrink-0 items-center group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:end-[calc(var(--ticket-pad)+0.25rem)] group-data-[orientation=vertical]/attachment:top-[calc(var(--ticket-pad)+0.25rem)] group-data-[orientation=vertical]/attachment:me-0 group-data-[orientation=vertical]/attachment:gap-1",
        className,
      )}
      {...props}
    />
  )
}

function AttachmentAction({
  className,
  variant,
  size = "icon-xs",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="attachment-action"
      variant={variant ?? "ghost"}
      size={size}
      className={cn("[&_svg]:[stroke-width:calc(var(--line)*1.5)]", className)}
      {...props}
    />
  )
}

function AttachmentTrigger({
  className,
  render,
  type,
  ...props
}: useRender.ComponentProps<"button">) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        type: render ? type : (type ?? "button"),
        className: cn(
          "absolute -inset-(--line) z-10 cursor-pointer rounded-[inherit]",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "attachment-trigger",
    },
  })
}

function AttachmentGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-group"
      className={cn(
        "-mx-2 flex min-w-0 snap-x snap-mandatory scroll-px-2 gap-tight overflow-x-auto overscroll-x-contain p-2 [scrollbar-width:none] *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start",
        className,
      )}
      {...props}
    />
  )
}

export {
  Attachment,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  AttachmentTrigger,
}
