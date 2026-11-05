import * as React from "react"
import { cn } from "@/serigraph/lib/utils"

// A few lines of text: the field's tint inside the ink line, in a 16px-radius box rather than a pill, growing with
// what is written. 16px text so phones never zoom. Width follows the writing it expects (the 34rem measure for a
// note); set it at the call site.
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "control-field flex field-sizing-content min-h-26 w-full rounded-box px-snug py-tight leading-body supports-[field-sizing:content]:resize-none",
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
