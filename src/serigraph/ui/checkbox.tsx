"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { cn } from "@/serigraph/lib/utils"

// A rounded square in the line, tinted from the surface beneath. Checked, it takes the highlight inside an ink line
// and a fine ink tick; partly checked (a header row over some selected rows) a short ink stroke instead.
function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer choice-box size-5 cursor-pointer rounded-[0.375rem] transition-colors duration-(--duration-control)",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="pointer-events-none grid size-3.5 place-items-center transition-transform duration-(--duration-control) ease-(--ease) data-starting-style:scale-0 data-ending-style:scale-0"
      >
        <svg
          viewBox="0 0 14 14"
          aria-hidden="true"
          className="size-full fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] in-data-indeterminate:hidden"
        >
          <path d="M2.5 7.4 5.6 10.3 11.5 3.6" strokeWidth={1.6} />
        </svg>
        <svg
          viewBox="0 0 14 14"
          aria-hidden="true"
          className="hidden size-full fill-none stroke-current [stroke-linecap:round] in-data-indeterminate:block"
        >
          <path d="M3 7h8" strokeWidth={1.6} />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
