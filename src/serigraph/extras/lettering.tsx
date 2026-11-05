import type { ComponentPropsWithoutRef, ElementType } from "react"
import { cn } from "@/serigraph/lib/utils"

type LetteringProps<T extends ElementType> = {
  /** The words, as real text: search engines and screen readers read them. */
  children: string
  /** The element to render, a heading where the lettering is one. */
  as?: T
} & Omit<ComponentPropsWithoutRef<T>, "children" | "as">

/**
 * Display lettering: Serigraph Display in paper with an ink outline, and the thin inline inside each left stem laid
 * over it. The inline layer is hidden from assistive technology; the text is read once. Size it with font-size.
 */
export function Lettering<T extends ElementType = "span">({
  children,
  as,
  className,
  ...props
}: LetteringProps<T>) {
  const Tag: ElementType = as ?? "span"
  return (
    <Tag
      data-slot="lettering"
      className={cn("lettering", className)}
      {...props}
    >
      {children}
      <span className="lettering-inline" aria-hidden="true">
        {children}
      </span>
    </Tag>
  )
}
