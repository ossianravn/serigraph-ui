import * as React from "react"
import { cn } from "@/serigraph/lib/utils"

// One turn in a conversation. The header is a byline: the author in the extended capitals, the time beside it in
// mono, both in the surface's text colour. The body reads in the reading face, and the footer is a row of quiet
// actions or a read receipt. The avatar sits level with the byline, so a message reads top-down like a signed note;
// its medallion may spill past the circle, so the slot never clips.

function MessageGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-group"
      className={cn("flex min-w-0 flex-col gap-hair", className)}
      {...props}
    />
  )
}

function Message({
  className,
  align = "start",
  ...props
}: React.ComponentProps<"div"> & { align?: "start" | "end" }) {
  return (
    <div
      data-slot="message"
      data-align={align}
      className={cn(
        "group/message relative flex w-full min-w-0 gap-tight font-read text-body leading-lead text-(--text,var(--ink)) data-[align=end]:flex-row-reverse",
        className,
      )}
      {...props}
    />
  )
}

function MessageAvatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-avatar"
      className={cn(
        "flex w-fit min-w-8 shrink-0 items-start justify-center self-start",
        className,
      )}
      {...props}
    />
  )
}

function MessageContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-content"
      className={cn(
        "flex w-full min-w-0 flex-col gap-hair wrap-break-word group-data-[align=end]/message:*:data-slot:self-end",
        className,
      )}
      {...props}
    />
  )
}

function MessageHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-header"
      className={cn(
        "flex max-w-full min-w-0 flex-wrap items-baseline gap-x-tight px-snug caps text-(--text,var(--ink)) group-has-data-[slot=message-avatar]/message:min-h-8 group-has-data-[slot=message-avatar]/message:items-center group-has-data-[variant=ghost]/message:px-0 [&_b,&_strong]:font-bold [&_time]:font-mono [&_time]:text-[0.75rem] [&_time]:font-normal [&_time]:tracking-normal [&_time]:tabular-nums",
        className,
      )}
      {...props}
    />
  )
}

function MessageFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-footer"
      className={cn(
        "flex max-w-full min-w-0 items-center gap-1 px-snug group-has-data-[variant=ghost]/message:px-0 font-read text-small leading-small text-(--text,var(--ink)) group-data-[align=end]/message:justify-end",
        className,
      )}
      {...props}
    />
  )
}

export {
  MessageGroup,
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
}
