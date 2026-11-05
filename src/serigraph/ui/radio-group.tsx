import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cn } from "@/serigraph/lib/utils"

// A circle in the line, tinted from the surface beneath, the checkbox's round twin. Chosen, it takes the highlight
// inside an ink line and a solid ink dot. The dot is drawn in SVG so it survives forced colours.
function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-tight", className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "peer choice-box aspect-square size-5 cursor-pointer rounded-full transition-colors duration-(--duration-control)",
        className,
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="pointer-events-none grid size-2 place-items-center transition-transform duration-(--duration-control) ease-(--ease) data-starting-style:scale-0 data-ending-style:scale-0"
      >
        <svg
          viewBox="0 0 8 8"
          aria-hidden="true"
          className="size-full fill-current"
        >
          <circle cx="4" cy="4" r="4" />
        </svg>
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
