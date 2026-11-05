"use client"

import { useState, type ReactNode } from "react"
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

// A landing hero printed like the poster: the product's name lettered large, a line in the capitals above it, one
// sentence, two actions and the install command, over a city of follies that runs the width of the section, its clouds
// at the foot; nothing operated sits on the drawing. Reroll draws a new city from the next seed; the seeds walk a stream from the first, so every visitor
// meets the same sequence. Every prop has a default (Serigraph's own landing), so the block is a finished page as it is.

export const meta = {
  title: "Hero",
  description:
    "A lettered name over a city the visitor can reroll, one sentence, two actions and the install command.",
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
  /** The product's name, lettered, and the page's heading. */
  product?: string
  /** A line in the extended capitals above the name. */
  kicker?: ReactNode
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
  kicker = "A shadcn/ui kit · printed in five colourways",
  lede = "Flat, luminous spot colours laid one on another, one fine ink line, and seeded drawings of follies in the clouds.",
  primary = { label: "Browse components", href: "/docs" },
  secondary = { label: "See it in use", href: "/meridian" },
  install = "npx shadcn add @serigraph/serigraph",
  seed: first = "serigraph",
  className,
}: Hero01Props) {
  const [seed, setSeed] = useState(first)
  return (
    <section
      data-slot="hero"
      aria-labelledby="hero-title"
      className={cn("relative grid", className)}
    >
      <div className="relative z-1 grid max-w-[72rem] gap-line px-(--hero-gutter,var(--space-line)) pt-section [--hero-gutter:clamp(var(--space-snug),3vw,var(--space-section))]">
        <div className="grid gap-tight">
          <div className="flex flex-wrap items-center justify-between gap-tight">
            <p className="m-0 caps">{kicker}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSeed(nextSeed(seed))}
              aria-label="Draw another city"
            >
              <DicesIcon data-icon="inline-start" /> Another city
            </Button>
          </div>
          <Lettering
            as="h1"
            id="hero-title"
            className="m-0 text-[clamp(3.25rem,13vw,10rem)] leading-none"
          >
            {product}
          </Lettering>
        </div>
        <div className="grid items-end gap-line md:grid-cols-[minmax(0,34rem)_minmax(0,1fr)]">
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
          {install && (
            <CodeBlock className="w-full max-w-[28rem] md:justify-self-end">
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
        </div>
      </div>
      <div className="-mt-line">
        <Folly
          template="city"
          seed={seed}
          label={`A city of follies in the clouds, drawn from the seed ${seed}`}
          className="h-[clamp(18rem,40vw,36rem)]"
        />
      </div>
    </section>
  )
}

export default Hero01
