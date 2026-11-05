import type { ReactNode } from "react"
import { cn } from "@/serigraph/lib/utils"

// Pieces for drawing parts on the Components index. A real popup opens in a portal, and only in the browser, so the
// index draws an open overlay with the kit's own utilities instead (plane, float-plane, menu-item, the stipple screen,
// the tooltip's ink pill). Scaled shows a real part smaller when it is larger than the plate.

/** A floating plane as the kit draws a menu, list or popover: the plane colour, the line, the 16px radius. */
export function Float({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn("float-plane text-small leading-small", className)}>
      {children}
    </div>
  )
}

/** The select's and menus' fine tick. */
export function Tick() {
  return (
    <svg
      viewBox="0 0 14 14"
      aria-hidden="true"
      className="size-3.5 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round]"
    >
      <path d="M2.5 7.4 5.6 10.3 11.5 3.6" strokeWidth={1.6} />
    </svg>
  )
}

/** A menu or list item; `active` takes the highlight pill, `end` a shortcut in mono, `checked` the tick. */
export function MenuRow({
  children,
  active,
  end,
  checked,
}: {
  children: ReactNode
  active?: boolean
  end?: string
  checked?: boolean
}) {
  return (
    <div
      className="menu-item px-tight py-hair whitespace-nowrap"
      data-highlighted={active ? "" : undefined}
    >
      {children}
      {end && (
        <span className="ms-auto ps-snug font-mono text-small">{end}</span>
      )}
      {checked && (
        <span className="ms-auto ps-snug">
          <Tick />
        </span>
      )}
    </div>
  )
}

/** A group's heading in a menu or list, in the caps. */
export function MenuLabel({ children }: { children: ReactNode }) {
  return <div className="caps px-tight pt-hair pb-1">{children}</div>
}

/** The fine line between groups in a menu. */
export function MenuRule() {
  return <div className="mx-tight my-1 border-t-(length:--line) border-ink" />
}

/** The fine screen of ink dots a dialog, sheet or drawer lays over the page, across the whole plate. */
export function Screen() {
  return <div className="stipple-screen absolute inset-0" />
}

/** Rounded tint bars standing for a page's text behind an overlay. */
export function PageLines({
  widths,
  className,
}: {
  widths: number[]
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {widths.map((w, i) => (
        <span
          key={i}
          className="block h-1.5 rounded-full border-(length:--line) border-ink field-fill"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  )
}

/** A real part drawn smaller, for one larger than the plate. */
export function Scaled({
  by,
  className,
  children,
}: {
  by: number
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn("w-fit", className)} style={{ zoom: by }}>
      {children}
    </div>
  )
}
