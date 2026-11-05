"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CheckIcon, CopyIcon } from "lucide-react"
import { cn } from "@/serigraph/lib/utils"
import { Button } from "@/serigraph/ui/button"

// Code in mono on a tinted plane: a tint of the plane colour, printed flat (no grain) like a field, inside the ink
// line with the box radius. The header is a strip over one fine line, the file name in mono beside details in the
// extended capitals; line numbers sit in a gutter ruled by one standing line. Highlighting (useHighlightedCode) is
// ink, a quieter mix for comments and one accent, a deep sky, for strings; every one keeps 4.5:1 on the plane and on
// the highlight bands (styles/conversation.css sets the colours). Added and removed lines are told by their + and −,
// a removed one also by a strike, a highlighted one by a highlight band. Destructive is a rose tint whose header says
// what went wrong. Copy is a ghost pill whose icon becomes a tick. The focus ring goes round the plane.

const FOCUS =
  "has-[>[data-slot=code-block-content]:focus-visible]:outline-(length:--line) has-[>[data-slot=code-block-content]:focus-visible]:outline-offset-3 has-[>[data-slot=code-block-content]:focus-visible]:outline-(--edge,var(--ink))"

const codeBlockVariants = cva(
  `group/code-block relative flex w-full min-w-0 flex-col overflow-hidden rounded-box border-(length:--line) border-ink bg-(--code-fill) text-[0.875rem] text-ink data-[size=sm]:text-[0.8125rem] ${FOCUS}`,
  {
    variants: {
      variant: {
        default: "",
        destructive: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function CodeBlock({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof codeBlockVariants> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="code-block"
      data-variant={variant}
      data-size={size}
      className={cn(codeBlockVariants({ variant }), className)}
      {...props}
    />
  )
}

function CodeBlockHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-header"
      className={cn(
        "relative flex min-h-10 min-w-0 shrink-0 items-center gap-tight border-b-(length:--line) border-ink ps-snug pe-1.5 caps text-ink group-data-[size=sm]/code-block:min-h-9 group-data-[size=sm]/code-block:ps-tight *:has-[>[data-slot=code-block-title]]:min-w-0",
        className,
      )}
      {...props}
    />
  )
}

function CodeBlockTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-title"
      className={cn(
        "min-w-0 truncate font-mono text-[0.8125rem] font-normal tracking-normal normal-case group-data-[size=sm]/code-block:text-[0.75rem] [&_svg]:pointer-events-none [&_svg]:inline-block [&_svg]:align-[-0.2em] [&_svg]:[stroke-width:calc(var(--line)*1.5)] [&_svg:not([class*='size-'])]:size-3.5 *:[svg]:me-1.5",
        className,
      )}
      {...props}
    />
  )
}

function CodeBlockActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-actions"
      className={cn(
        "ms-auto flex shrink-0 items-center gap-1 [[data-slot=code-block]>&]:absolute [[data-slot=code-block]>&]:end-1.5 [[data-slot=code-block]>&]:top-1.5 [[data-slot=code-block]>&]:z-10",
        className,
      )}
      {...props}
    />
  )
}

function CodeBlockCopyButton({
  value,
  variant = "ghost",
  size = "xs",
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button> & { value: string }) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) {
      return
    }

    const timeout = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <>
      <Button
        data-slot="code-block-copy-button"
        data-copied={copied || undefined}
        variant={variant}
        size={size}
        aria-label={copied ? "Copied" : "Copy"}
        className={cn(
          "min-w-[5.75rem] justify-start [&_svg]:[stroke-width:calc(var(--line)*1.5)]",
          className,
        )}
        onClick={(event) => {
          onClick?.(event)
          navigator.clipboard
            .writeText(value)
            .then(() => setCopied(true))
            .catch(() => {})
        }}
        {...props}
      >
        {copied ? (
          <CheckIcon data-icon="inline-start" />
        ) : (
          <CopyIcon data-icon="inline-start" />
        )}
        <span aria-hidden="true">{copied ? "Copied" : "Copy"}</span>
      </Button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </>
  )
}

/** The number of lines a code block's children make, for the gutter's width. */
function lineCount(children: React.ReactNode) {
  if (typeof children === "string")
    return children.replace(/\n$/, "").split("\n").length
  return Math.max(1, React.Children.count(children))
}

function CodeBlockContent({
  className,
  children,
  style,
  wrap = false,
  lineNumbers = false,
  startLine = 1,
  ...props
}: React.ComponentProps<"pre"> & {
  wrap?: boolean
  lineNumbers?: boolean
  startLine?: number
}) {
  const digits = Math.max(2, String(startLine + lineCount(children) - 1).length)
  // The plane draws the focus ring, so the scrolling pre draws none of its own.
  return (
    <pre
      data-slot="code-block-content"
      data-wrap={wrap || undefined}
      data-numbered={lineNumbers || undefined}
      dir="ltr"
      tabIndex={0}
      style={
        {
          counterReset: `line ${startLine - 1}`,
          "--gutter": `${digits}ch`,
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "m-0 min-h-0 min-w-0 overflow-auto px-snug py-tight text-start font-mono leading-[1.7] font-normal [scrollbar-color:var(--ink)_transparent] [scrollbar-width:thin] focus-visible:outline-none group-has-data-[slot=code-block-footer]/code-block:pb-hair group-data-[size=sm]/code-block:px-tight group-data-[size=sm]/code-block:py-[0.4375rem] data-wrap:wrap-break-word data-wrap:whitespace-pre-wrap",
        className,
      )}
      {...props}
    >
      <code
        data-slot="code-block-code"
        className="relative grid min-h-lh min-w-max content-start font-[inherit] in-data-numbered:grid-cols-[auto_1fr] in-data-numbered:before:absolute in-data-numbered:before:inset-y-0 in-data-numbered:before:start-[calc(var(--gutter)+var(--space-tight)/2)] in-data-numbered:before:z-10 in-data-numbered:before:border-s-(length:--line) in-data-numbered:before:border-ink in-data-wrap:min-w-0"
      >
        {lineNumbers && typeof children === "string"
          ? children
              .replace(/\n$/, "")
              .split("\n")
              .map((line, index) => (
                <CodeBlockLine key={index}>{line}</CodeBlockLine>
              ))
          : children}
      </code>
    </pre>
  )
}

const codeBlockLineVariants = cva(
  "relative -mx-snug block min-h-lh px-snug group-data-[size=sm]/code-block:-mx-tight group-data-[size=sm]/code-block:px-tight before:w-(--gutter) before:text-end before:text-(--code-quiet) before:tabular-nums after:absolute after:start-1.5 after:top-0 after:text-ink after:select-none in-data-numbered:col-span-2 in-data-numbered:grid in-data-numbered:grid-cols-subgrid in-data-numbered:gap-x-tight in-data-numbered:[counter-increment:line] in-data-numbered:before:content-[counter(line)] in-data-numbered:before:select-none in-data-numbered:supports-[content:counter(line)_/_'']:before:content-[counter(line)_/_'']",
  {
    variants: {
      variant: {
        default: "",
        added: "bg-(--code-added) after:content-['+']",
        removed:
          "after:content-['−'] *:data-[slot=code-block-line-content]:line-through *:data-[slot=code-block-line-content]:decoration-ink",
        highlighted: "bg-(--code-highlighted)",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function CodeBlockLine({
  className,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof codeBlockLineVariants>) {
  // An empty line holds a newline so copying a selection keeps blank lines. A plain line's indent sits in its own
  // inline box, which a removed line's strike passes over, so the strike starts at the first word.
  const empty =
    children === undefined ||
    children === null ||
    children === "" ||
    (Array.isArray(children) && children.length === 0)
  const indent = typeof children === "string" ? /^\s+/.exec(children)?.[0] : ""

  return (
    <span
      data-slot="code-block-line"
      data-variant={variant}
      className={cn(codeBlockLineVariants({ variant }), className)}
      {...props}
    >
      <span data-slot="code-block-line-content" className="min-w-0">
        {empty ? (
          "\n"
        ) : indent ? (
          <>
            <span className="inline-block">{indent}</span>
            {(children as string).slice(indent.length)}
          </>
        ) : (
          children
        )}
      </span>
    </span>
  )
}

function CodeBlockFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-footer"
      className={cn(
        "relative flex min-h-9 min-w-0 shrink-0 items-center gap-hair border-t-(length:--line) border-ink px-snug font-read text-small leading-small text-ink group-data-[size=sm]/code-block:px-tight",
        className,
      )}
      {...props}
    />
  )
}

export {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockContent,
  CodeBlockLine,
  CodeBlockFooter,
}
