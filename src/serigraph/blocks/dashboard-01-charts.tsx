"use client"

import type { ReactNode } from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/serigraph/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/serigraph/ui/chart"

// The dashboard's figures and charts, usable on their own: a headline figure in the mono face on the canvas, a
// panel (a plane with a title and one line on what it shows), visitors per night as stacked bars (booked ahead flat,
// at the door stippled) and seats sold by kind of session as level bars, one fill each. Series colours are roles
// that differ from the plane beneath in every colourway, and the fills tell them apart in grey as well.

// A fixed locale, so the server and every browser print the same digits.
const number = new Intl.NumberFormat("en-GB")
export const count = (n: number) => number.format(n)

/** A headline figure on the canvas: what it counts in the capitals, the figure in mono, one line of context. */
export function Figure({
  label,
  value,
  note,
}: {
  label: string
  value: string
  note: string
}) {
  return (
    <div className="@container/figure min-w-0">
      <p className="m-0 caps text-(--text)">{label}</p>
      <p className="m-0 mt-hair font-mono text-h2 leading-h2 text-(--text) tabular-nums @min-[11rem]/figure:text-h1 @min-[11rem]/figure:leading-h1">
        {value}
      </p>
      <p className="m-0 text-small leading-small">{note}</p>
    </div>
  )
}

/** A section of the dashboard on a plane: its title, one line on what it shows, then the chart. */
export function Panel({
  title,
  note,
  children,
  className,
}: {
  title: string
  note: string
  children: ReactNode
  className?: string
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          <h2 className="m-0 font-[inherit] text-[length:inherit] leading-[inherit]">
            {title}
          </h2>
        </CardTitle>
        <CardDescription>{note}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export interface VisitorNight {
  /** The axis label: "Thu 29". */
  night: string
  ahead: number
  door: number
}

const visitorsConfig = {
  ahead: { label: "Booked ahead", color: "var(--action)", fill: "flat" },
  door: { label: "At the door", color: "var(--tone-2)", fill: "stipple" },
} satisfies ChartConfig

/** Visitors per night: those who booked ahead in the action colour, those who came to the door stippled above. */
export function VisitorsChart({ nights }: { nights: VisitorNight[] }) {
  return (
    <ChartContainer config={visitorsConfig} className="aspect-auto h-64 w-full">
      <BarChart
        accessibilityLayer
        data={nights}
        margin={{ top: 8, right: 4, bottom: 0, left: 0 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="night"
          tickLine={false}
          tickMargin={8}
          // The mono face is wider than the one Recharts measures with, so leave the labels room.
          minTickGap={12}
          interval="preserveStartEnd"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={36}
          allowDecimals={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="ahead" stackId="night" fill="var(--color-ahead)" />
        <Bar dataKey="door" stackId="night" fill="var(--color-door)" />
      </BarChart>
    </ChartContainer>
  )
}

export type SessionKind = "show" | "talk" | "telescope"

export interface KindSeats {
  kind: SessionKind
  /** The axis label: "Dome shows". */
  label: string
  sold: number
}

const kindsConfig = {
  show: { label: "Dome shows", color: "var(--action)", fill: "flat" },
  talk: { label: "Talks", color: "var(--tone-2)", fill: "stipple" },
  telescope: { label: "Telescope", color: "var(--tone-3)", fill: "louvers" },
} satisfies ChartConfig

/** The kind's name above the left end of its bar, in the reading face. */
function KindName(props: {
  x?: number | string
  y?: number | string
  value?: unknown
}) {
  return (
    <text
      x={Number(props.x)}
      y={Number(props.y) - 8}
      className="font-read text-body"
      fill="var(--text, var(--ink))"
    >
      {String(props.value)}
    </text>
  )
}

/** Seats sold by kind of session: one level bar each under its name, in its own fill, the figure at its end. */
export function SeatsByKindChart({ kinds }: { kinds: KindSeats[] }) {
  return (
    <ChartContainer
      config={kindsConfig}
      className="aspect-auto w-full"
      style={{ height: `${kinds.length * 4.25}rem` }}
    >
      <BarChart
        accessibilityLayer
        // Each bar takes its kind's colour from its row, and with it the kind's fill (ChartStyle).
        data={kinds.map((k) => ({ ...k, fill: `var(--color-${k.kind})` }))}
        layout="vertical"
        barSize={22}
        margin={{ top: 24, right: 56, bottom: 0, left: 0 }}
      >
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="label" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel nameKey="kind" />}
        />
        <Bar dataKey="sold" name="Seats sold" isAnimationActive={false}>
          <LabelList dataKey="label" content={KindName} />
          <LabelList
            dataKey="sold"
            position="right"
            offset={8}
            formatter={(value: unknown) =>
              typeof value === "number" ? count(value) : String(value)
            }
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
