import { useMemo, type ComponentPropsWithoutRef } from "react"
import { drawing, type DrawingOptions } from "@/serigraph/follies"
import { cn } from "@/serigraph/lib/utils"

type DrawingProps = DrawingOptions &
  Omit<ComponentPropsWithoutRef<"div">, "children">

/**
 * One object from the Follies library (a spiral stair, a telescope, a kite …), standing on the foot of its box and
 * keeping its proportions; size the box with CSS. It reprints in the colourway around it and renders without
 * hydrating: the same seed draws the same SVG on the server and in the browser.
 */
export function Drawing({
  object,
  seed,
  line,
  label,
  fills,
  align,
  className,
  ...props
}: DrawingProps) {
  const key = JSON.stringify(fills ?? {})
  const svg = useMemo(
    () => drawing({ object, seed, line, label, fills, align }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fills by value
    [object, seed, line, label, key, align],
  )
  return (
    <div
      data-slot="drawing"
      data-object={object}
      className={cn("folly", className)}
      dangerouslySetInnerHTML={{ __html: svg }}
      {...props}
    />
  )
}
