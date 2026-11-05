import * as React from "react"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "@/serigraph/lib/utils"

// The track is one fine line in the surface's edge colour; the range is a thicker line in the action colour inside the
// ink line; each thumb is a pinwheel that rolls the distance it travels along a horizontal track (styles/forms.css).
// The thumb's focus lives on a hidden range input, so the page's concentric ring is drawn on the thumb with
// has-focus-visible. The root's width stays a plain class so a call-site width replaces it; a vertical slider takes
// its height from the call site (at least 10rem).
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderPrimitive.Root.Props) {
  const _values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max]

  return (
    <SliderPrimitive.Root
      className={cn("w-full data-[orientation=vertical]:w-auto", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:cursor-not-allowed data-[orientation=horizontal]:min-h-7 data-[orientation=horizontal]:@container data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:min-w-7 data-[orientation=vertical]:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow select-none"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="rounded-full border-(length:--line) border-ink bg-action select-none data-disabled:border-ink-quiet data-disabled:bg-[color-mix(in_oklab,var(--surface,var(--canvas))_35%,var(--paper))]"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            style={(state) =>
              ({
                "--turn":
                  ((state.values[index] ?? state.min) - state.min) /
                  (state.max - state.min || 1),
              }) as React.CSSProperties
            }
            className="pinwheel block size-[1.4375rem] shrink-0 cursor-grab select-none after:absolute after:-inset-1.5 after:rounded-full has-focus-visible:focus-ring data-dragging:cursor-grabbing data-disabled:cursor-not-allowed data-disabled:border-ink-quiet data-disabled:[--wheel:var(--ink-quiet)]"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
