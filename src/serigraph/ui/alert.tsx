import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Motif } from "@/serigraph/extras/motif"
import { cn } from "@/serigraph/lib/utils"

// A small plane in the colourway's plane colour or a tone (data-tone="1" … "4"), the ink line and the box radius,
// with a sparkle by the title. Pass an icon (a Lucide icon) as the first child and it takes the sparkle's place.
// Destructive is a rose plane; its title says what went wrong, so colour is never the only sign. The mark's column is
// as wide as the sparkle, so titles line up whichever mark an alert has; an action sits on the title's line.
const alertVariants = cva(
  "plane group/alert relative grid w-full grid-cols-[1.25rem_minmax(0,1fr)] items-start gap-x-tight gap-y-0.5 rounded-box px-snug py-[0.875rem] text-left has-data-[slot=alert-action]:pe-28 *:[svg]:row-span-2 *:[svg]:mt-0.5 *:[svg]:justify-self-center *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "",
        destructive: "[--tone:var(--rose)]!",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function Alert({
  className,
  variant,
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Motif
        kind="sparkle"
        seed="alert"
        className="pointer-events-none col-start-1 row-span-2 row-start-1 size-5 group-has-[>svg]/alert:hidden"
      />
      {children}
    </div>
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 font-read text-body leading-ui font-semibold",
        className,
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 max-w-measure font-read text-small leading-small text-pretty [&_p]:m-0 [&_p:not(:last-child)]:mb-hair",
        className,
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute end-snug top-[0.625rem]", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
