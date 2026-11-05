"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import type { TooltipValueType } from "recharts"
import { cn } from "@/serigraph/lib/utils"
import { getPayloadConfigKey, useChart } from "@/serigraph/ui/chart-context"
import { ChartSwatch } from "@/serigraph/ui/chart-marks"

// The tooltip is a small floating plane in the ink line, like a popover: the label in the extended capitals, one row
// per series with its swatch, its name in the reading face and its value in the mono face. The legend is a row of
// names on the chart's surface, each with its swatch (a stroke and a bead for a line).

type TooltipNameType = number | string

const figure = (value: unknown) =>
  typeof value === "number" ? value.toLocaleString("en-GB") : String(value)

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  nameKey,
  labelKey,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<"div"> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
  } & Omit<
    RechartsPrimitive.DefaultTooltipContentProps<
      TooltipValueType,
      TooltipNameType
    >,
    "accessibilityLayer"
  >) {
  const { config } = useChart()

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null
    }

    const [item] = payload
    const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`
    const configKey = getPayloadConfigKey(config, item, key)
    const value =
      !labelKey && typeof label === "string"
        ? (config[label]?.label ?? label)
        : configKey && config[configKey]?.label

    const classes = cn("caps", labelClassName)
    if (labelFormatter) {
      return <div className={classes}>{labelFormatter(value, payload)}</div>
    }

    if (!value) {
      return null
    }

    return <div className={classes}>{value}</div>
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ])

  if (!active || !payload?.length) {
    return null
  }

  return (
    <div
      data-slot="chart-tooltip"
      className={cn(
        "float-plane grid min-w-40 items-start gap-hair px-snug py-tight font-read text-small leading-small",
        className,
      )}
    >
      {tooltipLabel}
      <div className="grid gap-1">
        {payload
          .filter((item) => item.type !== "none")
          .map((item, index) => {
            const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`
            const configKey = getPayloadConfigKey(config, item, key)
            const itemConfig = configKey ? config[configKey] : undefined

            return (
              <div
                key={index}
                className="flex w-full items-center gap-tight [&>svg:not([data-slot=chart-swatch])]:size-3"
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <ChartSwatch
                          seriesKey={configKey}
                          variant={indicator === "dot" ? "fill" : "line"}
                        />
                      )
                    )}
                    <div className="flex flex-1 items-baseline justify-between gap-snug">
                      <span>{itemConfig?.label ?? item.name}</span>
                      {item.value != null && (
                        <span className="font-mono tabular-nums">
                          {figure(item.value)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

// Areas report a "line" legend type too; a line is a "line" item whose series fills nothing (Recharts gives lines #fff).
const isLine = (item: { type?: string; payload?: unknown }) => {
  const fill = (item.payload as { fill?: unknown } | undefined)?.fill
  return (
    item.type === "line" &&
    (typeof fill !== "string" || fill === "#fff" || fill === "none")
  )
}

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> & {
  hideIcon?: boolean
  nameKey?: string
} & RechartsPrimitive.DefaultLegendContentProps) {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  const keys = Object.keys(config)
  const order = (key?: string) => {
    const at = key ? keys.indexOf(key) : -1
    return at < 0 ? keys.length : at
  }

  return (
    <div
      data-slot="chart-legend"
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-snug gap-y-hair font-read text-small leading-small",
        verticalAlign === "top" ? "pb-tight" : "pt-tight",
        className,
      )}
    >
      {payload
        .filter((item) => item.type !== "none")
        .map((item) => {
          const key = `${nameKey ?? item.dataKey ?? "value"}`
          return { item, configKey: getPayloadConfigKey(config, item, key) }
        })
        // In config order, the order fills are dealt in, not Recharts' alphabetical one.
        .sort((a, b) => order(a.configKey) - order(b.configKey))
        .map(({ item, configKey }, index) => {
          const itemConfig = configKey ? config[configKey] : undefined
          return (
            <div
              key={index}
              className="flex items-center gap-1.5 [&>svg:not([data-slot=chart-swatch])]:size-3"
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <ChartSwatch
                  seriesKey={configKey}
                  variant={isLine(item) ? "line" : "fill"}
                />
              )}
              {itemConfig?.label ?? item.value}
            </div>
          )
        })}
    </div>
  )
}

export { ChartTooltipContent, ChartLegendContent }
