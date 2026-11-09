import type { ReactNode } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/serigraph/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/serigraph/ui/chart"
import { count } from "@/site/sample/observatory"
import { DemoSection, type DemoMeta } from "../demo-kit"
import * as data from "./chart/data"

export const meta: DemoMeta = {
  title: "Chart",
  description:
    "Recharts printed like the poster: flat shapes in the ink line, series told apart by flat, stippled and louvered fills as well as colour.",
  item: "chart",
  group: "Charts",
}

const CHART = "aspect-auto h-60 w-full"
const margin = { top: 8, right: 8, bottom: 0, left: 0 }

function ChartCard({
  title,
  description,
  footer,
  children,
}: {
  title: string
  description: string
  footer: ReactNode
  children: ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="text-small leading-small">{footer}</CardFooter>
    </Card>
  )
}

const xAxis = (key: string) => (
  <XAxis
    dataKey={key}
    tickLine={false}
    tickMargin={8}
    interval="equidistantPreserveStart"
  />
)
const yAxis = (
  <YAxis tickLine={false} axisLine={false} width={36} allowDecimals={false} />
)

export default function ChartDemo() {
  return (
    <>
      <DemoSection title="Bars">
        <div className="grid items-start gap-line lg:grid-cols-2">
          <ChartCard
            title="Visitors per night"
            description="Thu 29 Oct – Wed 4 Nov 2026"
            footer={`${count(data.weekVisitors)} visitors; the most on Saturday, Halloween.`}
          >
            <ChartContainer config={data.visitorsConfig} className={CHART}>
              <BarChart accessibilityLayer data={data.week} margin={margin}>
                <CartesianGrid vertical={false} />
                {xAxis("night")}
                {yAxis}
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="visitors" fill="var(--color-visitors)" />
              </BarChart>
            </ChartContainer>
          </ChartCard>
          <ChartCard
            title="Seats sold by session"
            description="Stacked · same week"
            footer="Clouds closed the deck on Tuesday; Monday has no talk."
          >
            <ChartContainer config={data.sessionConfig} className={CHART}>
              <BarChart accessibilityLayer data={data.week} margin={margin}>
                <CartesianGrid vertical={false} />
                {xAxis("night")}
                {yAxis}
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                {Object.keys(data.sessionConfig).map((key) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId="seats"
                    fill={`var(--color-${key})`}
                  />
                ))}
              </BarChart>
            </ChartContainer>
          </ChartCard>
        </div>
      </DemoSection>

      <DemoSection title="Areas and lines">
        <div className="grid items-start gap-line lg:grid-cols-2">
          <ChartCard
            title="Dark hours with a clear sky"
            description="Month by month · Nov 2025 – Oct 2026"
            footer="March was the clearest month; June hardly gets dark."
          >
            <ChartContainer config={data.skyConfig} className={CHART}>
              <AreaChart accessibilityLayer data={data.sky} margin={margin}>
                <CartesianGrid vertical={false} />
                {xAxis("month")}
                {yAxis}
                <ChartTooltip
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  dataKey="clear"
                  type="monotone"
                  stackId="sky"
                  fill="var(--color-clear)"
                  stroke="var(--color-clear)"
                />
                <Area
                  dataKey="partly"
                  type="monotone"
                  stackId="sky"
                  fill="var(--color-partly)"
                  stroke="var(--color-partly)"
                />
              </AreaChart>
            </ChartContainer>
          </ChartCard>
          <ChartCard
            title="Against a year ago"
            description="Visitors per night · 22 Oct – 4 Nov"
            footer="Every night of the fortnight beat the same night last year."
          >
            <ChartContainer config={data.fortnightConfig} className={CHART}>
              <LineChart
                accessibilityLayer
                data={data.fortnight}
                margin={margin}
              >
                <CartesianGrid vertical={false} />
                {xAxis("night")}
                {yAxis}
                <ChartTooltip
                  content={<ChartTooltipContent indicator="line" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  dataKey="before"
                  type="monotone"
                  stroke="var(--color-before)"
                />
                <Line dataKey="now" type="monotone" stroke="var(--color-now)" />
              </LineChart>
            </ChartContainer>
          </ChartCard>
        </div>
      </DemoSection>

      <DemoSection title="Donut, tooltip and legend">
        <div className="grid items-start gap-line lg:grid-cols-2">
          <ChartCard
            title="The season’s seats"
            description="Since 1 September, by kind of session"
            footer="Seven in ten seats are under the dome."
          >
            <ChartContainer config={data.sessionConfig} className={CHART}>
              <PieChart accessibilityLayer>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="kind" hideLabel />}
                />
                <Pie
                  data={data.season}
                  dataKey="seats"
                  nameKey="kind"
                  innerRadius="58%"
                  outerRadius="92%"
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={3}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (!viewBox || !("cx" in viewBox)) return null
                      const { cx = 0, cy = 0 } = viewBox
                      return (
                        <text x={cx} y={cy} textAnchor="middle">
                          <tspan
                            x={cx}
                            y={cy + 4}
                            className="fill-(--text) font-mono text-h2"
                          >
                            {count(data.seasonSeats)}
                          </tspan>
                          <tspan
                            x={cx}
                            y={cy + 24}
                            className="fill-(--text) font-read text-small"
                          >
                            seats
                          </tspan>
                        </text>
                      )
                    }}
                  />
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="kind" />} />
              </PieChart>
            </ChartContainer>
          </ChartCard>
          <ChartCard
            title="Side by side"
            description="Seats by session · tooltip held open on Saturday"
            footer="Halloween ran a third show under the dome."
          >
            <ChartContainer config={data.sessionConfig} className={CHART}>
              <BarChart accessibilityLayer data={data.week} margin={margin}>
                <CartesianGrid vertical={false} />
                {xAxis("night")}
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={36}
                  domain={[0, 400]}
                  ticks={[0, 100, 200, 300, 400]}
                />
                <ChartTooltip
                  defaultIndex={2}
                  content={<ChartTooltipContent />}
                />
                <ChartLegend
                  verticalAlign="top"
                  content={<ChartLegendContent verticalAlign="top" />}
                />
                {Object.keys(data.sessionConfig).map((key) => (
                  <Bar key={key} dataKey={key} fill={`var(--color-${key})`} />
                ))}
              </BarChart>
            </ChartContainer>
          </ChartCard>
        </div>
      </DemoSection>
    </>
  )
}
