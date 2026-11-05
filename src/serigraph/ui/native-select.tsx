import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/serigraph/lib/utils"

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  size?: "sm" | "default"
}

// The platform's own select inside the same field as Select's trigger: a pill tinted from the surface beneath, the ink
// line, a fine chevron over it. The open list stays native and follows the system's colours. Width goes on the
// wrapper, set at the call site to fit the longest option.
function NativeSelect({
  className,
  size = "default",
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn("group/native-select relative w-fit", className)}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className="control-field h-control w-full min-w-0 cursor-pointer appearance-none py-0 ps-snug pe-10 has-[option[value='']:checked]:text-(--field-quiet) data-[size=sm]:h-control-compact"
        {...props}
      />
      <ChevronDownIcon
        aria-hidden="true"
        data-slot="native-select-icon"
        className="pointer-events-none absolute end-3.5 top-1/2 size-4 -translate-y-1/2 text-ink select-none group-has-[select:disabled]/native-select:text-ink-quiet [stroke-width:calc(var(--line)*1.5)]"
      />
    </div>
  )
}

function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
