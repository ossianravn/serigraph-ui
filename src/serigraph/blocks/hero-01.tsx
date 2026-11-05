"use client"

import { Fragment, useState, useTransition, type ReactNode } from "react"
import { DicesIcon } from "lucide-react"
import { Folly } from "@/serigraph/extras/folly"
import { Lettering } from "@/serigraph/extras/lettering"
import { seedOf, stream } from "@/serigraph/follies"
import { cn } from "@/serigraph/lib/utils"
import { Button, buttonVariants } from "@/serigraph/ui/button"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/serigraph/ui/code-block"

// A landing hero set like a gig poster: the bill across the top (a line of facts in the capitals, spread to both
// edges), the product's name lettered from edge to edge of the column, then one row that holds the sentence and the
// actions on the left and the install command on the right, both on one baseline. Below, a city of follies runs the
// full width, its clouds at the foot, to be continued by the section that follows in the cloud colour. Nothing that is
// operated sits on the drawing. Reroll draws a new city from the next seed; the seeds walk a stream from the first, so
// every visitor meets the same sequence. Every prop has a default (Serigraph's own landing).

export const meta = {
  title: "Hero",
  description:
    "A poster's bill, the name lettered edge to edge, one sentence, two actions and the install command, over a city the visitor can reroll.",
}

const ADJECTIVES = ["clear", "high", "late", "pale", "still", "warm", "wide"]
const NOUNS = ["arcade", "dome", "meridian", "orbit", "stair", "terrace"]

/** The seed after this one: a word pair drawn from a stream forked from it, never the same twice. */
export function nextSeed(seed: string) {
  const words = stream(seedOf(seed), "hero:reroll")
  let next = seed
  while (next === seed) next = `${words.pick(ADJECTIVES)}-${words.pick(NOUNS)}`
  return next
}

interface Action {
  label: string
  href: string
}

export interface Hero01Props {
  /** The product's name, lettered across the column, and the page's heading. */
  product?: string
  /** The bill: short facts in the capitals, spread across the top. */
  bill?: ReactNode[]
  /** One sentence on what it is. */
  lede?: ReactNode
  primary?: Action
  secondary?: Action
  /** The command a visitor copies to install; omit to leave the code block out. */
  install?: string
  /** The city's first seed; rerolls continue from it. */
  seed?: string
  className?: string
}

export function Hero01({
  product = "Serigraph",
  bill = [
    "A shadcn/ui kit",
    "Five colourways",
    "Three fonts of its own",
    "Follies in the clouds",
  ],
  lede = "Flat, luminous spot colours laid one on another, one fine ink line, and seeded drawings of architecture in the clouds.",
  primary = { label: "Browse components", href: "/docs" },
  secondary = { label: "See it in use", href: "/meridian" },
  install = "npx shadcn add @serigraph/serigraph",
  seed: first = "serigraph",
  className,
}: Hero01Props) {
  const [seed, setSeed] = useState(first)
  // A new city is a large drawing to paint, so it arrives in a transition: the button answers at once.
  const [, startTransition] = useTransition()
  // The name fills the column: about 0.66 em a letter in Serigraph Display, capped for very short names.
  const fit = `min(14rem, calc(100cqi / ${(product.length * 0.66).toFixed(2)}))`
  return (
    <section
      data-slot="hero"
      aria-labelledby="hero-title"
      className={cn("grid", className)}
    >
      <div className="grid w-full gap-snug px-(--gutter,clamp(var(--space-snug),3vw,var(--space-section))) pt-line [container-type:inline-size]">
        <p className="m-0 flex flex-wrap justify-between gap-x-line gap-y-hair caps">
          {bill.map((fact, i) => (
            <Fragment key={i}>
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className={cn(i > 1 && "max-sm:hidden")}
                >
                  •
                </span>
              )}
              <span className={cn(i > 1 && "max-sm:hidden")}>{fact}</span>
            </Fragment>
          ))}
        </p>
        <Lettering
          as="h1"
          id="hero-title"
          className="m-0 leading-none"
          style={{ fontSize: fit }}
        >
          {product}
        </Lettering>
        <div className="mt-hair grid items-end gap-line md:grid-cols-[minmax(0,34rem)_minmax(0,1fr)]">
          <div className="grid gap-line">
            <p className="m-0 text-lead leading-lead text-pretty">{lede}</p>
            <div className="flex flex-wrap gap-tight">
              <a href={primary.href} className={buttonVariants()}>
                {primary.label}
              </a>
              <a
                href={secondary.href}
                className={buttonVariants({ variant: "outline" })}
              >
                {secondary.label}
              </a>
            </div>
          </div>
          <div className="grid w-full max-w-[26rem] gap-tight md:justify-self-end">
            {install && (
              <CodeBlock>
                <CodeBlockHeader>
                  <CodeBlockTitle>Terminal</CodeBlockTitle>
                  <CodeBlockActions>
                    <CodeBlockCopyButton value={install} />
                  </CodeBlockActions>
                </CodeBlockHeader>
                <CodeBlockContent>
                  <CodeBlockLine>{install}</CodeBlockLine>
                </CodeBlockContent>
              </CodeBlock>
            )}
            <Button
              variant="ghost"
              size="sm"
              data-hero-reroll=""
              onClick={() => startTransition(() => setSeed(nextSeed(seed)))}
              className="justify-self-end"
            >
              <DicesIcon data-icon="inline-start" /> Draw another city
            </Button>
          </div>
        </div>
      </div>
      <Folly
        template="city"
        seed={seed}
        label={`A city of follies in the clouds, drawn from the seed ${seed}`}
        data-hero-city=""
        className="-mt-line h-[clamp(20rem,44vw,40rem)]"
      />
    </section>
  )
}

export default Hero01
