import type { ComponentPropsWithoutRef } from "react"
import { cn } from "@/serigraph/lib/utils"

const SIZES = {
  sm: "w-32",
  default: "w-48",
  lg: "w-72",
  fill: "w-full",
} as const

type ArchFrameProps = ComponentPropsWithoutRef<"div"> & {
  /** Its width: 8, 12 or 18rem, or the width of its container. */
  size?: keyof typeof SIZES
}

/**
 * An arch-topped frame for an image or a folly: a round head on straight sides, small bottom radii and one fine
 * line. It keeps a 3:4 shape at every width, so the head stays a half circle; the picture fills it and is cut to it.
 */
export function ArchFrame({
  size = "default",
  className,
  ...props
}: ArchFrameProps) {
  return (
    <div
      data-slot="arch-frame"
      data-size={size}
      className={cn(
        "arch-frame relative isolate shrink-0 [&>*]:size-full [&>img]:object-cover",
        SIZES[size],
        className,
      )}
      {...props}
    />
  )
}
