"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/serigraph/lib/utils"

import { Button } from "@/serigraph/ui/button"
import { Input } from "@/serigraph/ui/input"
import { Textarea } from "@/serigraph/ui/textarea"

// One field pill shared by an input and its addons: the surface's tint inside the ink line, 16px text. The group takes
// the page's concentric ring while its control has focus, the rose ring when invalid and the disabled tint; the inner
// control gives its own line, fill and ring up (styles/composites.css). Holding a textarea or a block addon, the pill
// becomes a 16px-radius box. Addons speak in the mono face, quietly: units, prefixes, counts. Inside the group the
// context is the field's, so ghost buttons draw ink on the tint whatever the surface beneath.
function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group control-field relative flex h-control w-full min-w-0 items-center",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:rounded-box has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:rounded-box has-[>textarea]:h-auto has-[>textarea]:rounded-box",
        "has-[>[data-align=block-end]]:[&>input]:pt-tight has-[>[data-align=block-start]]:[&>input]:pb-tight has-[>[data-align=inline-end]]:[&>input]:pe-hair has-[>[data-align=inline-start]]:[&>input]:ps-hair",
        className,
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-hair py-hair font-mono text-small leading-ui text-(--field-quiet) select-none group-has-[[data-slot=input-group-control]:disabled]/input-group:cursor-not-allowed [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start":
          "order-first ps-snug has-[>button]:ps-1.5 has-[>kbd]:ps-2",
        "inline-end": "order-last pe-snug has-[>button]:pe-1.5 has-[>kbd]:pe-2",
        "block-start":
          "order-first w-full justify-start px-snug pt-tight [.border-b]:border-b-(length:--line) [.border-b]:border-ink [.border-b]:pb-tight",
        "block-end":
          "order-last w-full justify-start px-snug pb-tight [.border-t]:border-t-(length:--line) [.border-t]:border-ink [.border-t]:pt-tight",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  },
)

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        e.currentTarget.parentElement
          ?.querySelector<HTMLElement>("[data-slot=input-group-control]")
          ?.focus()
      }}
      {...props}
    />
  )
}

const inputGroupButtonVariants = cva("flex items-center gap-hair", {
  variants: {
    size: {
      xs: "h-7 gap-1 px-tight [&>svg:not([class*='size-'])]:size-3.5",
      sm: "px-snug",
      "icon-xs": "size-7 p-0 has-[>svg]:p-0",
      "icon-sm": "size-control-compact p-0 has-[>svg]:p-0",
    },
  },
  defaultVariants: {
    size: "xs",
  },
})

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset"
  }) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      size={size}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center gap-hair font-mono text-small leading-ui text-(--field-quiet) [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn("h-full flex-1", className)}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn("flex-1 resize-none py-tight", className)}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}
