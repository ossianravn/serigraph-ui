"use client"

import { useState } from "react"
import { Folly } from "@/serigraph/extras/folly"
import { Lettering } from "@/serigraph/extras/lettering"
import { cn } from "@/serigraph/lib/utils"
import {
  PLAN_ROWS,
  PlanCard,
  type Billing,
  type Plan,
} from "@/serigraph/blocks/pricing-01-plan"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/serigraph/ui/accordion"
import { ToggleGroup, ToggleGroupItem } from "@/serigraph/ui/toggle-group"

// Memberships of the observatory: the title lettered beside an arched window, a Monthly/Yearly segmented control
// above three plans on planes of their own colour whose prices follow it, what each includes ticked in ink, and a few
// questions in an accordion at the reading measure. The plans sit side by side when their container is wide enough
// and stack in one readable column when it is not.

export const meta = {
  title: "Pricing",
  description:
    "Three memberships on planes of their own colour, a monthly or yearly price in mono, what each includes ticked, and questions in an accordion.",
}

export const PLANS: Plan[] = [
  {
    name: "Stargazer",
    audience: "For a few clear nights a year.",
    monthly: 60,
    yearly: 600,
    action: "Become a stargazer",
    tone: 3,
    features: [
      "Two dome shows a month",
      "Members’ price on every talk",
      "The sky this month, by email",
    ],
  },
  {
    name: "Observer",
    audience: "For whenever the sky is clear.",
    monthly: 120,
    yearly: 1200,
    action: "Become an observer",
    recommended: true,
    features: [
      "Everything in Stargazer",
      "Every dome show, as often as you like",
      "Two telescope sessions a month",
      "Book four weeks ahead",
      "A guest free on Thursdays",
    ],
  },
  {
    name: "Patron",
    audience: "For friends who keep the dome turning.",
    monthly: 300,
    yearly: 3000,
    action: "Become a patron",
    tone: 4,
    features: [
      "Everything in Observer",
      "The telescopes whenever the deck is open",
      "A seat kept for you at every talk",
      "Your name by the Zeiss refractor",
      "A night on the deck for twelve, once a year",
    ],
  },
]

export const QUESTIONS = [
  {
    q: "What happens when it is cloudy?",
    a: "Telescope sessions move to the next clear night at no cost. Shows and talks go ahead under the dome whatever the weather.",
  },
  {
    q: "Can I bring someone?",
    a: "Observers bring a guest free on Thursdays. Any member can buy guest seats at the members’ price, up to four a night.",
  },
  {
    q: "What happens to sessions I don’t use?",
    a: "Telescope sessions carry over to the next month, then lapse. Dome shows are as often as your membership allows; they don’t carry over.",
  },
  {
    q: "Can I stop at any time?",
    a: "Yes. A monthly membership ends with the month you have paid for; a yearly one is refunded for the whole months left.",
  },
]

export interface Pricing01Props {
  /** Lettered as the page's heading. */
  title?: string
  /** One or two sentences under the title. */
  intro?: string
  plans?: Plan[]
  questions?: { q: string; a: string }[]
  defaultBilling?: Billing
  onChoose?: (plan: Plan, billing: Billing) => void
  className?: string
}

export function Pricing01({
  title = "Join Meridian",
  intro = "Every membership opens the dome, the lecture hall and, on clear nights, the deck. Pay by the month, or by the year and get two months free.",
  plans = PLANS,
  questions = QUESTIONS,
  defaultBilling = "monthly",
  onChoose,
  className,
}: Pricing01Props) {
  const [billing, setBilling] = useState<Billing>(defaultBilling)
  return (
    <div className={cn("@container text-(--text)", className)}>
      <div className="mx-auto max-w-[68rem] px-snug pt-section pb-page @min-[40rem]:px-line">
        <header className="flex items-end justify-between gap-section">
          <div className="min-w-0">
            <p className="m-0 caps">Membership</p>
            <Lettering
              as="h1"
              className="m-0 mt-tight text-[clamp(2.5rem,9cqi,5.5rem)] text-balance"
            >
              {title}
            </Lettering>
            <p className="m-0 mt-snug max-w-measure text-lead leading-lead">
              {intro}
            </p>
          </div>
          <Folly
            template="window"
            seed={`membership:${title}`}
            className="arch-frame hidden w-44 flex-none @min-[48rem]:block"
          />
        </header>

        <div className="mt-section flex flex-wrap items-center gap-x-snug gap-y-hair">
          <ToggleGroup
            aria-label="Billing period"
            spacing={0}
            value={[billing]}
            onValueChange={(next: unknown[]) =>
              next[0] && setBilling(next[0] as Billing)
            }
          >
            <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
            <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
          </ToggleGroup>
          <span className="caps">Two months free by the year</span>
        </div>

        <div
          className={cn(
            "mt-line grid max-w-[26rem] gap-x-line gap-y-line @min-[54rem]:max-w-none @min-[54rem]:grid-cols-3",
            PLAN_ROWS,
          )}
        >
          {plans.map((plan) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              billing={billing}
              onChoose={onChoose}
            />
          ))}
        </div>

        {questions.length > 0 && (
          <section
            aria-labelledby="pricing-questions"
            className="mt-page max-w-measure"
          >
            <h2
              id="pricing-questions"
              className="m-0 font-sans text-h2 leading-h2 font-bold [font-stretch:var(--sans-stretch)]"
            >
              Questions
            </h2>
            <Accordion className="mt-snug">
              {questions.map(({ q, a }) => (
                <AccordionItem key={q} value={q}>
                  <AccordionTrigger>{q}</AccordionTrigger>
                  <AccordionContent>
                    <p>{a}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}
      </div>
    </div>
  )
}

export default Pricing01
