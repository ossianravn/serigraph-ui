"use client"

import * as React from "react"

// The chart's shared state: its config, its id (which scopes the fill patterns) and the defaults that give every
// series a colour and a fill. Series differ by fill (flat, stipple, louvers, tint) as well as by colour, so a chart
// still reads in grey, in print and where two chart colours are the same spot.

// Format: { THEME_NAME: CSS_SELECTOR }. Night is a colourway (data-colourway="night" on <html> or any ancestor).
export const THEMES = { light: "", dark: '[data-colourway="night"]' } as const

/**
 * How a series fills its bars, areas and slices: the flat spot colour, the colour under a fine ink stipple, the colour
 * in louvers (slats of colour and ink, like a stair seen from below), or a tint of the colour toward paper.
 */
export type ChartFill = "flat" | "stipple" | "louvers" | "tint"

/** Series without a fill take the next one in this order. */
export const CHART_FILLS: readonly ChartFill[] = [
  "flat",
  "stipple",
  "louvers",
  "tint",
]

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    icon?: React.ComponentType
    /** Serigraph: how the series fills its marks; defaults by position in the config. */
    fill?: ChartFill
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
>

type ChartContextProps = {
  config: ChartConfig
  /** Scopes the chart's fill patterns, so several charts on a page never share an id. */
  chartId: string
}

export const ChartContext = React.createContext<ChartContextProps | null>(null)

export function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const position = (config: ChartConfig, key: string | undefined) =>
  key ? Math.max(0, Object.keys(config).indexOf(key)) : 0

/** A series' fill, explicit or by its position in the config. */
export function seriesFill(
  config: ChartConfig,
  key: string | undefined,
): ChartFill {
  const own = key ? config[key]?.fill : undefined
  return own ?? CHART_FILLS[position(config, key) % CHART_FILLS.length]!
}

/** A series' colour in a theme: its own, else the chart colour for its position (--chart-1 … --chart-5). */
export function seriesColor(
  config: ChartConfig,
  key: string,
  theme: keyof typeof THEMES = "light",
) {
  const item = config[key]
  return (
    item?.theme?.[theme] ??
    item?.color ??
    `var(--chart-${(position(config, key) % 5) + 1})`
  )
}

/** The id of a series' fill pattern (stipple, louvers) inside one chart. */
export function fillId(chartId: string, key: string) {
  return `${chartId}-fill-${key.replace(/[^\w-]/g, "_")}`
}

/** What a fill paints a shape with: the series' colour, its pattern, or its tint. */
export function fillPaint(chartId: string, key: string, fill: ChartFill) {
  if (fill === "flat") return `var(--color-${key})`
  if (fill === "tint")
    return `color-mix(in oklab, var(--color-${key}) 38%, var(--paper))`
  return `url(#${fillId(chartId, key)})`
}

/** A line's dash for a fill: stipple series draw dotted lines, louvers dashed, tint long and short; flat a full line. */
export function fillDash(fill: ChartFill) {
  if (fill === "stipple") return "0.01 5"
  if (fill === "louvers") return "7 4"
  if (fill === "tint") return "12 4 2 4"
  return undefined
}

/**
 * The paint for a series' bars, areas and slices, for `<Bar fill={chartFill("shows")} />`. Marks filled with
 * `var(--color-<key>)` take the same paint anyway; this is for code that wants to say so.
 */
export const chartFill = (key: string) => `var(--fill-${key})`

/** A series' flat colour, for strokes, dots and labels. */
export const chartColor = (key: string) => `var(--color-${key})`

/**
 * The config key an item belongs to: the value of `key` on the item or its data row (a pie slice's name, say),
 * else `key` itself. Undefined when neither is in the config.
 */
export function getPayloadConfigKey(
  config: ChartConfig,
  payload: unknown,
  key: string,
): string | undefined {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  if (configLabelKey in config) return configLabelKey
  return key in config ? key : undefined
}
