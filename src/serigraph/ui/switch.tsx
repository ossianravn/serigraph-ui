"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "@/serigraph/lib/utils"

// A pill track, tinted from the surface beneath; on, it takes the highlight. The thumb is a pinwheel that rolls the
// distance it slides (a turn of travel ÷ radius), as a wheel would.
function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 cursor-pointer items-center rounded-full border-(length:--line) border-ink bg-[color-mix(in_oklab,var(--surface,var(--canvas))_30%,var(--paper))] p-px transition-colors duration-(--duration-control) ease-(--ease) data-checked:bg-highlight data-[size=default]:h-7 data-[size=default]:w-[3.125rem] data-[size=sm]:h-[1.4375rem] data-[size=sm]:w-[2.5625rem] aria-invalid:outline-(length:--line) aria-invalid:outline-rose aria-invalid:outline-offset-3 data-disabled:cursor-not-allowed data-disabled:border-ink-quiet data-disabled:bg-[color-mix(in_oklab,var(--surface,var(--canvas))_12%,var(--paper))]",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pinwheel pointer-events-none block transition-transform duration-[220ms] ease-(--ease) group-data-disabled/switch:border-ink-quiet group-data-disabled/switch:[--wheel:var(--ink-quiet)] group-data-[size=default]/switch:size-[1.4375rem] group-data-[size=sm]/switch:size-[1.125rem] data-checked:group-data-[size=default]/switch:translate-x-[1.375rem] data-checked:group-data-[size=default]/switch:rotate-[110deg] data-checked:group-data-[size=sm]/switch:translate-x-[1.125rem] data-checked:group-data-[size=sm]/switch:rotate-[115deg] rtl:data-checked:group-data-[size=default]/switch:-translate-x-[1.375rem] rtl:data-checked:group-data-[size=sm]/switch:-translate-x-[1.125rem]"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
