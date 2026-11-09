import type { ComponentPropsWithoutRef } from "react"
import { Folly } from "@/serigraph/extras/folly"
import { cn } from "@/serigraph/lib/utils"

/** The colour role of a section: `ground` is the cloud colour, the rest are the colourway's roles of those names. */
export type CloudBandRole =
  | "ground"
  | "canvas"
  | "plane"
  | "plane-2"
  | "highlight"
  | "tone-1"
  | "tone-2"
  | "tone-3"
  | "tone-4"

type CloudBandProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  /** Any string or number; the same seed draws the same band. */
  seed?: string | number
  /** The section below, which the front clouds continue. `ground` (the cloud colour) by default. */
  below?: CloudBandRole
  /** The section above, painted behind the band. Without it the band shows whatever it sits on. */
  above?: CloudBandRole
  /** An accessible name; without one the band is decorative and hidden from assistive technology. */
  label?: string
}

/**
 * A section edge: the band folly's cloud bank, with a building rising behind it and a plant in front, its flat
 * baseline on the section below and its front clouds in that section's colour, so the clouds run on into it. Set the
 * height with CSS; the drawing slices from the bottom, so a narrow band shows its middle.
 */
export function CloudBand({
  seed = "serigraph",
  below = "ground",
  above,
  label,
  className,
  ...props
}: CloudBandProps) {
  return (
    <div
      data-slot="cloud-band"
      data-below={below}
      data-above={above}
      className={cn("h-[clamp(9.5rem,17.75vw,16.5rem)] w-full", className)}
      {...props}
    >
      <Folly template="band" seed={seed} label={label} className="size-full" />
    </div>
  )
}
