import * as React from "react"
import { cn } from "@/serigraph/lib/utils"

// A label in the reading voice beside the control it names (a check, a switch). Labels above a field use FieldLabel,
// which sets them in the extended capitals.
function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-tight text-body leading-ui select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:text-(--text-quiet) peer-disabled:cursor-not-allowed peer-disabled:text-(--text-quiet) has-data-disabled:cursor-not-allowed has-data-disabled:text-(--text-quiet)",
        className,
      )}
      {...props}
    />
  )
}

export { Label }
