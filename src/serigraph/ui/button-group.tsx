import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/serigraph/lib/utils"

import { Separator } from "@/serigraph/ui/separator"

// Buttons joined into one pill, like the segmented control: each member after the first gives up its leading line, so
// the line the one before draws is a fine divider between them, and only the group's two ends are round
// (styles/composites.css). A group that holds a field (an input or a select trigger) is one field pill: the tint
// beneath every member, ink lines and ink words, and the page's ring and the rose ring move to the group. Groups of
// groups sit apart. ButtonGroupText is a mono cell in the same line; ButtonGroupSeparator draws the divider between
// members that have no line of their own (ghost buttons) and takes no room.
const buttonGroupVariants = cva(
  "group/button-group flex w-fit items-stretch rounded-full has-[>[data-slot=button-group]]:gap-tight [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal: "",
        vertical: "flex-col rounded-[calc(var(--control-height)/2)]",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
)

function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  )
}

function ButtonGroupText({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "flex items-center gap-hair rounded-full border-(length:--line) border-[color:var(--edge,var(--ink))] px-snug font-mono text-small leading-ui text-[color:var(--text,var(--ink))] [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "button-group-text",
    },
  })
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "pointer-events-none relative z-1 self-stretch data-[orientation=horizontal]:-mt-(--line) data-[orientation=horizontal]:w-auto data-[orientation=vertical]:-ms-(--line) data-[orientation=vertical]:h-auto",
        className,
      )}
      {...props}
    />
  )
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
}
