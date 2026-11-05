import { useMemo, type ComponentPropsWithoutRef } from "react"
import { motif, type MotifOptions } from "@/serigraph/follies"
import { cn } from "@/serigraph/lib/utils"

type MotifProps = MotifOptions &
  Omit<ComponentPropsWithoutRef<"span">, "children">

/**
 * A motif on its own: a pinwheel, a sparkle, a cloud or an archway, an em tall beside text unless sized with CSS.
 * Its colour is the colourway's role for it, or --motif where set. Decorative unless it has a label.
 */
export function Motif({
  kind = "sparkle",
  seed,
  line,
  label,
  className,
  ...props
}: MotifProps) {
  const svg = useMemo(
    () => motif({ kind, seed, line, label }),
    [kind, seed, line, label],
  )
  return (
    <span
      data-slot="motif"
      data-motif={kind}
      className={cn("motif", className)}
      dangerouslySetInnerHTML={{ __html: svg }}
      {...props}
    />
  )
}
