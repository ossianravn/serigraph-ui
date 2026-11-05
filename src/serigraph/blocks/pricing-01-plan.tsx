"use client"

import { CheckIcon } from "lucide-react"
import { Badge } from "@/serigraph/ui/badge"
import { Button } from "@/serigraph/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/serigraph/ui/card"

// One membership as a plane in its own colour: its name and who it is for, the price in mono for the chosen period,
// the action, and what it includes, each line ticked in ink. The recommended plan carries "Most chosen" by its name
// and its action is the page's one action pill; the others are outline pills. Inside a grid with subgrid rows
// (PLAN_ROWS on the cards' parent), the four parts line up across neighbouring cards whatever their length.

export type Billing = "monthly" | "yearly"

export interface Plan {
  name: string
  audience: string
  /** Kroner a month, paid monthly. */
  monthly: number
  /** Kroner for a year paid at once. */
  yearly: number
  action: string
  features: string[]
  recommended?: boolean
  /** The plane's colour: a tone (1–4), or the colourway's plane when unset. */
  tone?: 1 | 2 | 3 | 4
}

const number = new Intl.NumberFormat("en-GB")

/** A price in kroner: 1,200 kr. */
export const kroner = (n: number) => `${number.format(n)} kr`

/** Classes for the cards' parent at the width where they sit side by side. */
export const PLAN_ROWS = "@min-[54rem]:grid-rows-[auto_auto_auto_1fr]"

/** The price's words for a plan and period. */
function price(plan: Plan, billing: Billing) {
  if (billing === "monthly")
    return {
      price: kroner(plan.monthly),
      per: "a month",
      basis: "Billed monthly. Stop when you like.",
    }
  const saved = plan.monthly * 12 - plan.yearly
  return {
    price: kroner(plan.yearly),
    per: "a year",
    basis:
      saved > 0
        ? `Billed once a year. You save ${kroner(saved)}.`
        : "Billed once a year.",
  }
}

export function PlanCard({
  plan,
  billing,
  onChoose,
}: {
  plan: Plan
  billing: Billing
  onChoose?: (plan: Plan, billing: Billing) => void
}) {
  const { price: figure, per, basis } = price(plan, billing)
  return (
    <Card
      data-tone={plan.tone ? String(plan.tone) : undefined}
      className="@min-[54rem]:row-span-4 @min-[54rem]:grid @min-[54rem]:grid-rows-subgrid"
    >
      <CardHeader className="content-start">
        <CardTitle className="flex flex-wrap items-center gap-x-tight gap-y-hair">
          <h2 className="m-0 font-sans text-h2 leading-h2 font-bold [font-stretch:var(--sans-stretch)]">
            {plan.name}
          </h2>
          {plan.recommended && <Badge>Most chosen</Badge>}
        </CardTitle>
        <CardDescription className="text-body leading-body">
          {plan.audience}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="m-0 flex flex-wrap items-baseline gap-x-tight">
          <span className="font-mono text-title leading-title tabular-nums">
            {figure}
          </span>
          <span className="caps">{per}</span>
        </p>
        <p className="m-0 text-small leading-small">{basis}</p>
      </CardContent>
      <CardContent>
        <Button
          variant={plan.recommended ? "default" : "outline"}
          onClick={() => onChoose?.(plan, billing)}
        >
          {plan.action}
        </Button>
      </CardContent>
      <CardContent>
        <ul
          aria-label={`${plan.name} includes`}
          className="m-0 flex list-none flex-col gap-tight border-t-(length:--line) border-ink p-0 pt-snug"
        >
          {plan.features.map((feature) => (
            <li
              key={feature}
              className="grid grid-cols-[1rem_minmax(0,1fr)] items-start gap-tight text-body leading-ui"
            >
              <CheckIcon
                aria-hidden="true"
                className="mt-0.5 size-4 [stroke-width:calc(var(--line)*1.5)]"
              />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
