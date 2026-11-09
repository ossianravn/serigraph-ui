"use client"

import { useState, useTransition, type ReactNode } from "react"
import { DicesIcon } from "lucide-react"
import { Drawing } from "@/serigraph/extras/drawing"
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

// A landing hero set like a gig poster: the product's name lettered from edge to edge of the column, then one row that
// holds the sentence and the actions on the left and the install command on the right, both on one baseline. Below, a city of follies runs the
// full width, its clouds at the foot, to be continued by the section that follows in the cloud colour. Nothing that is
// operated sits on the drawing; from 80rem a spiral tower rises out of the clouds through the gap in that row, its
// landing behind the name. Reroll draws a new city from the next seed; the seeds walk a stream from the first, so
// every visitor meets the same sequence. Every prop has a default (Serigraph's own landing).

export const meta = {
  title: "Hero",
  description:
    "The name lettered edge to edge, one sentence, two actions and the install command, over a city the visitor can reroll.",
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
  lede = "Flat, luminous spot colours laid one on another, one fine ink line, and seeded drawings of architecture in the clouds.",
  primary = { label: "Browse components", href: "/docs" },
  secondary = { label: "See the blocks", href: "/docs/blocks" },
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
      <div
        className="grid w-full gap-snug px-(--gutter,clamp(var(--space-snug),3vw,var(--space-section))) pt-line [container-type:inline-size]"
        style={{ ["--hero-title" as string]: fit }}
      >
        <Lettering
          as="h1"
          id="hero-title"
          className="relative z-[2] m-0 leading-none"
          style={{ fontSize: "var(--hero-title)" }}
        >
          {product}
        </Lettering>
        <div className="mt-hair grid items-end gap-line md:grid-cols-[minmax(0,34rem)_minmax(0,1fr)] min-[80rem]:grid-cols-[minmax(0,34rem)_minmax(12rem,1fr)_minmax(0,26rem)]">
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
          {/* From 80rem a spiral tower climbs out of the city's clouds through the gap between the sentence and the
              install command, its landing behind the name: the drawing runs through the poster's words. */}
          <div
            aria-hidden="true"
            className="relative hidden self-stretch min-[80rem]:block"
          >
            <Drawing
              object="spiral-tower"
              seed={seed}
              className="absolute inset-x-0 -top-[calc(var(--space-snug)+var(--space-hair)+0.4*var(--hero-title))] -bottom-[clamp(15rem,30vw,27rem)] z-0"
            />
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
        className="relative z-[1] -mt-line h-[clamp(20rem,44vw,40rem)]"
      />
    </section>
  )
}

export default Hero01
