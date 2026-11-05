import type { ComponentPropsWithoutRef } from "react"
import { Folly } from "@/serigraph/extras/folly"
import { cn } from "@/serigraph/lib/utils"

const SIZES = {
  sm: "size-24",
  default: "size-36",
  lg: "size-52",
} as const

type MedallionProps = ComponentPropsWithoutRef<"div"> & {
  /** Draws the medallion folly from this seed when there are no children. */
  seed?: string | number
  /** The drawing's accessible name; without one it is decorative. Give an image its own alt text. */
  label?: string
  /** Its diameter: 6, 9 or 13rem. */
  size?: keyof typeof SIZES
  /** The spot colour behind the drawing: plane 2 by default, or one of the four tones. */
  tone?: "plane-2" | "1" | "2" | "3" | "4"
}

/**
 * A round frame in the one line for a featured figure: an image (the children) or, from a seed, the medallion folly,
 * with a fine stipple on the shadow side. Its sky is its own spot colour and its clouds are paper, so it reads as a
 * circle of colour on any canvas. A person's picture belongs in an Avatar; this is for a feature.
 */
export function Medallion({
  seed,
  label,
  size = "default",
  tone = "plane-2",
  className,
  children,
  ...props
}: MedallionProps) {
  return (
    <div
      data-slot="medallion"
      data-size={size}
      data-tone={tone}
      className={cn(
        "relative isolate flex shrink-0 items-center justify-center overflow-hidden rounded-full [&>img]:size-full [&>img]:object-cover",
        SIZES[size],
        className,
      )}
      {...props}
    >
      {children ?? (
        <Folly
          template="medallion"
          seed={seed}
          label={label}
          className="pointer-events-none size-[120%] shrink-0"
        />
      )}
    </div>
  )
}
