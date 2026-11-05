import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/serigraph/lib/utils"

// A field: a pill tinted from the surface beneath inside the ink line, 16px text so phones never zoom. Its width
// follows the value it holds; set it at the call site.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "control-field h-control w-full min-w-0 px-snug py-hair file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-mono file:text-small file:text-ink",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
