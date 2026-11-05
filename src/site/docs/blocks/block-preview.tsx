import { useEffect, useRef, useState } from "react"
import { ExternalLinkIcon } from "lucide-react"
import { cn } from "@/serigraph/lib/utils"
import { ToggleGroup, ToggleGroupItem } from "@/serigraph/ui/toggle-group"

// A block running in a frame of its own page, so it lays out for the frame's width (full width, or a 390 px phone)
// and its fixed and full-height parts behave as they would in an app. A segmented control picks the width, another
// the state for blocks with variants; the link opens the frame's page on its own. At desktop width the frame takes
// its page's whole height, measured in the frame (same origin) and followed as the block changes, so the page reads
// top to bottom with the rest of the docs; at phone width it keeps a phone's height and scrolls inside.

const PHONE = 390

/** The height of the frame's page, followed while `on`; undefined when off or not yet measured. */
function useFittedHeight(src: string, on: boolean) {
  const frame = useRef<HTMLIFrameElement>(null)
  // Kept with the frame and width it was measured for, so a new frame or width starts from the default height.
  const key = `${src} ${on}`
  const [fit, setFit] = useState<{ key: string; height: number }>()
  useEffect(() => {
    const el = frame.current
    if (!el || !on) return
    let observer: ResizeObserver | undefined
    const attach = () => {
      const doc = el.contentDocument
      const main = doc?.querySelector("main")
      if (!doc || !main || !el.contentWindow) return
      observer?.disconnect()
      // The page never scrolls in a fitted frame, so it keeps no gutter for a scrollbar.
      doc.documentElement.style.scrollbarGutter = "auto"
      const measure = () =>
        setFit({ key, height: Math.ceil(main.getBoundingClientRect().bottom) })
      const win = el.contentWindow as typeof window
      observer = new win.ResizeObserver(measure)
      observer.observe(main)
      measure()
    }
    el.addEventListener("load", attach)
    if (el.contentDocument?.readyState === "complete") attach()
    return () => {
      el.removeEventListener("load", attach)
      observer?.disconnect()
      if (el.contentDocument)
        el.contentDocument.documentElement.style.scrollbarGutter = ""
    }
  }, [key, on])
  return [frame, fit?.key === key ? fit.height : undefined] as const
}

/** "no-results" → "No results". */
const variantLabel = (variant: string) =>
  variant.charAt(0).toUpperCase() + variant.slice(1).replaceAll("-", " ")

export function BlockPreview({
  name,
  title,
  variants,
}: {
  name: string
  title: string
  variants?: readonly string[]
}) {
  const [width, setWidth] = useState<"desktop" | "phone">("desktop")
  const [variant, setVariant] = useState(variants?.[0])
  const src = `/docs/blocks/view/${name}${variant && variant !== variants?.[0] ? `/${variant}` : ""}`
  const phone = width === "phone"
  // The frame loads its page only when it comes near the window: seven frames each load and hydrate a whole page.
  const box = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = box.current
    if (!el || near) return
    const observer = new IntersectionObserver(
      ([entry]) => entry?.isIntersecting && setNear(true),
      { rootMargin: "300px 0px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [near])
  const [frame, height] = useFittedHeight(src, !phone)

  return (
    <div ref={box} className="@container/preview">
      <div className="flex flex-wrap items-center gap-x-snug gap-y-tight">
        {variants && (
          <ToggleGroup
            aria-label={`${title} state`}
            size="sm"
            spacing={0}
            value={variant ? [variant] : []}
            onValueChange={(next: unknown[]) =>
              next[0] && setVariant(next[0] as string)
            }
          >
            {variants.map((v) => (
              <ToggleGroupItem key={v} value={v}>
                {variantLabel(v)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
        {/* Below phone width plus the frame's gutter both widths are the same, so the choice goes. */}
        <ToggleGroup
          aria-label="Preview width"
          size="sm"
          spacing={0}
          value={[width]}
          onValueChange={(next: unknown[]) =>
            next[0] && setWidth(next[0] as "desktop" | "phone")
          }
          className="@max-[30rem]/preview:hidden"
        >
          <ToggleGroupItem value="desktop">Desktop</ToggleGroupItem>
          <ToggleGroupItem value="phone">Phone</ToggleGroupItem>
        </ToggleGroup>
        <a
          href={src}
          target="_blank"
          rel="noopener"
          className="caps ms-auto inline-flex items-center gap-hair no-underline hover:underline"
        >
          Open
          <ExternalLinkIcon aria-hidden="true" className="size-3.5" />
          <span className="sr-only">{title} in a new tab</span>
        </a>
      </div>
      {/* The frame is the window's edge, one fine line with the plane's radius; at phone width a narrower page stands
          in it between two fine lines. */}
      <div className="mt-tight overflow-hidden rounded-plane border-(length:--line) border-(--edge)">
        <div
          className="relative mx-auto max-w-full"
          style={{ width: phone ? PHONE : "100%" }}
        >
          {phone && (
            <>
              <span
                aria-hidden="true"
                className="absolute inset-y-0 -left-px border-s-(length:--line) border-(--edge)"
              />
              <span
                aria-hidden="true"
                className="absolute inset-y-0 -right-px border-e-(length:--line) border-(--edge)"
              />
            </>
          )}
          <iframe
            key={src}
            ref={frame}
            src={near ? src : undefined}
            title={`${title} preview`}
            loading="lazy"
            style={height ? { height } : undefined}
            className={cn(
              "block w-full bg-canvas",
              !height && "h-[44rem] max-h-[80dvh]",
            )}
          />
        </div>
      </div>
    </div>
  )
}
