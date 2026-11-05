import { useMemo, type ComponentPropsWithoutRef } from "react"
import { folly, type FollyOptions } from "@/serigraph/follies"
import { cn } from "@/serigraph/lib/utils"

type FollyProps = FollyOptions &
  Omit<ComponentPropsWithoutRef<"div">, "children">

/**
 * A folly: seeded surreal architecture that fills its box (size it with CSS) and reprints in the colourway around it.
 * The same seed draws the same SVG on the server and in the browser, so it renders without hydrating.
 */
export function Folly({
  template = "city",
  seed,
  line,
  label,
  className,
  ...props
}: FollyProps) {
  const svg = useMemo(
    () => folly({ template, seed, line, label }),
    [template, seed, line, label],
  )
  return (
    <div
      data-slot="folly"
      data-template={template}
      className={cn("folly", className)}
      dangerouslySetInnerHTML={{ __html: svg }}
      {...props}
    />
  )
}
