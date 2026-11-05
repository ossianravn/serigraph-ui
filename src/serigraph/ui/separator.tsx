"use client"

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"
import { cn } from "@/serigraph/lib/utils"

// One fine line in the surface's edge colour (ink on bright surfaces, paper on Night's canvas), or the same line
// turned to run down. Drawn as a border, so it snaps to device pixels like every other line.
function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 border-[color:var(--edge,var(--ink))] data-[orientation=horizontal]:h-0 data-[orientation=horizontal]:w-full data-[orientation=horizontal]:border-t-(length:--line) data-[orientation=vertical]:w-0 data-[orientation=vertical]:self-stretch data-[orientation=vertical]:border-s-(length:--line)",
        className,
      )}
      {...props}
    />
  )
}

export { Separator }
