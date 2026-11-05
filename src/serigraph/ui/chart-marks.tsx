"use client"

import { cn } from "@/serigraph/lib/utils"
import {
  fillDash,
  fillId,
  seriesFill,
  useChart,
  type ChartConfig,
  type ChartFill,
} from "@/serigraph/ui/chart-context"

// The fills that tell series apart besides colour: a fine ink stipple and louvers (slats of colour and ink), as SVG
// patterns defined once per chart over the series' own colour. The same tiles as the style's motifs (styles/
// surfaces.css): the stipple's staggered dots and the progress bar's 3 + 2 px slats, in user space, so neighbouring
// bars share one grid.

function FillPattern({
  id,
  fill,
  color,
}: {
  id: string
  fill: ChartFill
  color: string
}) {
  if (fill === "louvers") {
    return (
      <pattern id={id} width={6} height={5} patternUnits="userSpaceOnUse">
        <rect width={6} height={5} fill={color} />
        <rect y={3} width={6} height={2} fill="var(--ink)" />
      </pattern>
    )
  }
  return (
    <pattern id={id} width={4} height={4} patternUnits="userSpaceOnUse">
      <rect width={4} height={4} fill={color} />
      <circle cx={1} cy={1} r={0.7} fill="var(--ink)" />
      <circle cx={3} cy={3} r={0.7} fill="var(--ink)" />
    </pattern>
  )
}

/** The stipple and louver series' patterns for one chart, in a hidden SVG that the chart's shapes refer to by id. */
export function ChartFillDefs({
  chartId,
  config,
}: {
  chartId: string
  config: ChartConfig
}) {
  const patterned = Object.keys(config).filter((key) => {
    const fill = seriesFill(config, key)
    return fill === "stipple" || fill === "louvers"
  })
  if (!patterned.length) return null
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      className="pointer-events-none absolute"
    >
      <defs>
        {patterned.map((key) => (
          <FillPattern
            key={key}
            id={fillId(chartId, key)}
            fill={seriesFill(config, key)}
            color={`var(--color-${key})`}
          />
        ))}
      </defs>
    </svg>
  )
}

/**
 * A series' key in a tooltip or legend: a small square in its fill inside the ink line, or for a line a short stroke
 * in its dash through a bead in its colour.
 */
export function ChartSwatch({
  seriesKey,
  variant = "fill",
  className,
}: {
  seriesKey?: string
  variant?: "fill" | "line"
  className?: string
}) {
  const { config } = useChart()
  const color = seriesKey ? `var(--color-${seriesKey})` : "var(--paper)"

  if (variant === "line") {
    return (
      <svg
        data-slot="chart-swatch"
        aria-hidden="true"
        viewBox="0 0 20 10"
        className={cn("h-2.5 w-5 shrink-0 overflow-visible", className)}
      >
        <line
          x1={1}
          y1={5}
          x2={19}
          y2={5}
          stroke="currentColor"
          strokeLinecap="round"
          strokeDasharray={fillDash(seriesFill(config, seriesKey))}
          style={{ strokeWidth: "calc(var(--line) * 1.5)" }}
        />
        <circle
          cx={10}
          cy={5}
          r={3.25}
          fill={color}
          stroke="var(--ink)"
          style={{ strokeWidth: "var(--line)" }}
        />
      </svg>
    )
  }

  return (
    <svg
      data-slot="chart-swatch"
      aria-hidden="true"
      viewBox="0 0 12 12"
      className={cn("size-3 shrink-0 overflow-visible", className)}
    >
      <rect
        x={0.75}
        y={0.75}
        width={10.5}
        height={10.5}
        rx={2}
        fill={seriesKey ? `var(--fill-${seriesKey})` : color}
        stroke="var(--ink)"
        style={{ strokeWidth: "var(--line)" }}
      />
    </svg>
  )
}
