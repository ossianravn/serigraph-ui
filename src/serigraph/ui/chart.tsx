"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/serigraph/lib/utils"
import {
  ChartContext,
  THEMES,
  fillDash,
  fillPaint,
  seriesColor,
  seriesFill,
  type ChartConfig,
} from "@/serigraph/ui/chart-context"
import { ChartFillDefs } from "@/serigraph/ui/chart-marks"

// Recharts printed like the poster: every bar, area and slice is a flat shape inside the ink line, and series are
// told apart by fill (flat, stipple, louvers, tint) as well as by colour (--chart-1 … --chart-5). Lines are the fine
// line itself, dashed by their fill, with beads in the series' colour. Axis figures in the mono face, the grid rows
// of fine dots, the tooltip a floating plane. The drawing classes cannot reach is in styles/data.css; the per-series
// rules are written by ChartStyle, so shadcn's own `fill="var(--color-<key>)"` takes the series' fill unchanged.

const INITIAL_DIMENSION = { width: 320, height: 200 } as const

function ChartContainer({
  id,
  className,
  children,
  config,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"]
  initialDimension?: {
    width: number
    height: number
  }
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${(id ?? uniqueId).replace(/[^\w-]/g, "")}`
  const context = React.useMemo(() => ({ config, chartId }), [config, chartId])

  return (
    <ChartContext.Provider value={context}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "relative flex aspect-video justify-center font-mono text-small leading-small text-(--text)",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <ChartFillDefs chartId={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer
          initialDimension={initialDimension}
        >
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

const quoted = (value: string) => `"${value.replace(/["\\]/g, "\\$&")}"`

/**
 * Writes --color-<key> (the series' colour, per theme) and --fill-<key> (its paint: the colour, its pattern or its
 * tint) for every series, and the rules that hand a series' fill to the shapes Recharts fills with its colour: bars,
 * areas and slices take the fill, lines their dash, line points the colour.
 */
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const keys = Object.keys(config)
  if (!keys.length) return null

  const chart = `[data-chart=${quoted(id)}]`
  const blocks = Object.entries(THEMES).map(([theme, prefix]) => {
    const night = theme !== "light"
    const lines = keys.flatMap((key) => {
      const item = config[key]
      if (night && !item?.theme) return []
      return [
        `  --color-${key}: ${seriesColor(config, key, theme as keyof typeof THEMES)};`,
        night
          ? null
          : `  --fill-${key}: ${fillPaint(id, key, seriesFill(config, key))};`,
      ].filter((line) => line !== null)
    })
    return lines.length
      ? `${prefix} ${chart} {\n${lines.join("\n")}\n}`.trim()
      : ""
  })

  const rules = keys.map((key) => {
    const color = quoted(`var(--color-${key})`)
    const dash = fillDash(seriesFill(config, key))
    return [
      `${chart} :is(.recharts-rectangle, .recharts-sector, .recharts-area-area)[fill=${color}] { fill: var(--fill-${key}); }`,
      `${chart} .recharts-dot[stroke=${color}] { fill: var(--color-${key}); }`,
      dash
        ? `${chart} .recharts-line-curve[stroke=${color}] { stroke-dasharray: ${dash}; }`
        : "",
    ].join("\n")
  })

  const css = [...blocks, ...rules].filter(Boolean).join("\n")
  return <style dangerouslySetInnerHTML={{ __html: css }} />
}

/** Recharts' tooltip, which follows the pointer at once: its default 400 ms glide makes hovering feel slow. */
function ChartTooltip(
  props: React.ComponentProps<typeof RechartsPrimitive.Tooltip>,
) {
  return <RechartsPrimitive.Tooltip isAnimationActive={false} {...props} />
}

const ChartLegend = RechartsPrimitive.Legend

export { ChartContainer, ChartTooltip, ChartLegend, ChartStyle }
export {
  ChartTooltipContent,
  ChartLegendContent,
} from "@/serigraph/ui/chart-tooltip"
export { ChartSwatch } from "@/serigraph/ui/chart-marks"
export {
  CHART_FILLS,
  chartColor,
  chartFill,
  type ChartConfig,
  type ChartFill,
} from "@/serigraph/ui/chart-context"
