import * as React from "react"
import { cn } from "@/serigraph/lib/utils"

// Long-form prose, styled through its children so plain HTML or Markdown output reads as typeset text: the reading
// face held to the 34rem measure, headings in the extended sans (Serigraph Sans's stand-in until it has a
// lowercase), list markers in the quiet text with numbers in mono, a quotation set off by one fine line in its
// margin, code in mono on a tint of the surface, one fine line for <hr>, and small tables with their heads in the
// capitals over an ink line. Selectors sit inside :where(), so a class on a child still wins. Colours come from the
// surface (--text, --edge), so prose reads on any canvas, Night's too. `dropCap` sets the first paragraph's opening
// letter three lines deep in the display face, solid in the text colour (browsers do not stroke a
// ::first-letter, so the poster's paper-and-outline lettering is left to <Lettering>). shadcn ships
// typography as a docs page, not a component; Serigraph ships it as one, as Fineliner does.

const flow = [
  // Vertical rhythm between direct children: a paragraph gap, more room above headings, little below them.
  "[&>*]:my-0 [&>*+*]:mt-snug [&>:first-child]:mt-0",
  "[&>h1]:mt-section [&>h2]:mt-section [&>h3]:mt-line [&>h4]:mt-snug [&>hr]:my-line",
  "[&>:is(h1,h2)+*]:mt-tight [&>:is(h3,h4)+*]:mt-hair",
  "[&>*+[data-slot=typography-kicker]]:mt-section [&>[data-slot=typography-kicker]+*]:mt-hair",
]

const type = [
  "font-read text-body leading-body text-(--text)",
  "[&_:where(h1,h2,h3,h4)]:max-w-measure [&_:where(h1,h2,h3,h4)]:text-balance [&_:where(h1,h2,h3,h4)]:text-(--text)",
  "[&_:where(h1,h2,h3)]:font-sans [&_:where(h1,h2,h3)]:font-bold [&_:where(h1,h2,h3)]:[font-stretch:var(--sans-stretch)]",
  "[&_:where(h1)]:text-h1 [&_:where(h1)]:leading-h1 [&_:where(h2)]:text-h2 [&_:where(h2)]:leading-h2 [&_:where(h3)]:text-lead [&_:where(h3)]:leading-lead",
  "[&_:where(h4)]:font-read [&_:where(h4)]:text-body [&_:where(h4)]:leading-body [&_:where(h4)]:font-semibold",
  "[&_:where(p,ul,ol,blockquote)]:max-w-measure [&_:where(strong,b)]:font-semibold",
  // Lists: markers in the quiet text; numbered lists count in mono.
  "[&_:where(ul)]:list-disc [&_:where(ol)]:list-decimal [&_:where(ul,ol)]:ps-snug",
  "[&_:where(li)]:ps-1 [&_:where(li+li)]:mt-hair [&_:where(li>ul,li>ol)]:mt-hair",
  "[&_:where(li)]:marker:text-(--text) [&_:where(ol>li)]:marker:font-mono [&_:where(ol>li)]:marker:text-small",
  // A quotation set off by one fine line standing in its margin.
  "[&_:where(blockquote)]:border-s-(length:--line) [&_:where(blockquote)]:border-[var(--edge,var(--ink))] [&_:where(blockquote)]:ps-snug [&_:where(blockquote)]:text-lead [&_:where(blockquote)]:leading-lead",
  // Code: inline in mono on a tint of the surface; blocks scroll sideways rather than wrap.
  "[&_:where(:not(pre)>code)]:field-fill [&_:where(:not(pre)>code)]:rounded-[0.375rem] [&_:where(:not(pre)>code)]:px-[0.35em] [&_:where(:not(pre)>code)]:py-[0.1em] [&_:where(:not(pre)>code)]:font-mono [&_:where(:not(pre)>code)]:text-[0.86em]",
  "[&_:where(pre)]:field-fill [&_:where(pre)]:max-w-measure [&_:where(pre)]:overflow-x-auto [&_:where(pre)]:rounded-box [&_:where(pre)]:px-snug [&_:where(pre)]:py-tight [&_:where(pre)]:font-mono [&_:where(pre)]:text-small [&_:where(pre)]:leading-small",
  "[&_:where(hr)]:h-0 [&_:where(hr)]:max-w-measure [&_:where(hr)]:border-0 [&_:where(hr)]:border-t-(length:--line) [&_:where(hr)]:border-[var(--edge,var(--ink))]",
  // Small tables: heads in the capitals over an ink line, rows divided by fine lines, figures in tabular mono.
  "[&_:where(table)]:w-full [&_:where(table)]:max-w-measure [&_:where(table)]:border-collapse [&_:where(table)]:text-small [&_:where(table)]:leading-small [&_:where(table)]:tabular-nums",
  "[&_:where(th)]:caps [&_:where(th)]:pb-hair [&_:where(th:not([data-figure]))]:text-start [&_:where(td)]:py-hair [&_:where(th,td)]:pe-snug [&_:where(th,td):last-child]:pe-0",
  "[&_:where(thead_tr)]:border-b-(length:--line) [&_:where(tbody_tr:not(:last-child))]:border-b-(length:--line) [&_:where(tr)]:border-[var(--edge,var(--ink))]",
  "[&_:where(td[data-figure])]:font-mono [&_:where(td[data-figure],th[data-figure])]:text-end",
  "[&_:where(figcaption)]:mt-hair [&_:where(figcaption)]:text-small [&_:where(figcaption)]:leading-small",
]

// Sized so the letter's cap height runs from the first line's cap height to the third line's baseline.
const dropCapClasses =
  "[&>p:first-of-type]:first-letter:float-start [&>p:first-of-type]:first-letter:mt-[0.1em] [&>p:first-of-type]:first-letter:me-[0.08em] [&>p:first-of-type]:first-letter:font-display [&>p:first-of-type]:first-letter:text-[4.4em] [&>p:first-of-type]:first-letter:leading-[0.8] [&>p:first-of-type]:first-letter:font-normal [&>p:first-of-type]:first-letter:text-(--text)"

function Typography({
  className,
  dropCap = false,
  ...props
}: React.ComponentProps<"div"> & {
  /** Sets the first paragraph's opening letter three lines deep. */
  dropCap?: boolean
}) {
  return (
    <div
      data-slot="typography"
      data-drop-cap={dropCap || undefined}
      className={cn(...type, ...flow, dropCap && dropCapClasses, className)}
      {...props}
    />
  )
}

/** A label above a heading: the section, series or kind the heading belongs to. */
function TypographyKicker({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="typography-kicker"
      className={cn("caps", className)}
      {...props}
    />
  )
}

export { Typography, TypographyKicker }
