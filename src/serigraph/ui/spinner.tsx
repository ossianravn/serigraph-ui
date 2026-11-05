import { motif } from "@/serigraph/follies"
import { cn } from "@/serigraph/lib/utils"

// A pinwheel turning at a steady pace: the drawn motif (twelve curved wedges of paper and the sun colour in the ink
// ring), or --motif where set. One seed, so every spinner is the same wheel. Under reduced motion it stops.
const WHEEL = motif({ kind: "pinwheel", seed: "spinner" })
const VIEWBOX = /viewBox="([^"]+)"/.exec(WHEEL)?.[1] ?? "0 0 100 100"
const BODY = WHEEL.slice(
  WHEEL.indexOf('<g class="pinwheel"'),
  WHEEL.lastIndexOf("</svg>"),
)

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox={VIEWBOX}
      fill="none"
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn(
        "size-4 shrink-0 animate-spin overflow-visible [animation-duration:1.6s]",
        className,
      )}
      {...props}
    >
      <g dangerouslySetInnerHTML={{ __html: BODY }} />
    </svg>
  )
}

export { Spinner }
