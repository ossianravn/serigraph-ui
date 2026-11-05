"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { XIcon } from "lucide-react"
import { cn } from "@/serigraph/lib/utils"

// A multiple combobox's chosen values, collected as small badges inside a field: the surface's tint inside the ink
// line, a pill while it holds one row and a box with the same round corners once it wraps. The field takes the page's
// ring while its input has focus, the rose ring when invalid and the quiet tint when disabled
// (styles/composites.css). A chip is the default badge, the highlight in the ink line with its words in the mono face,
// and keeps a round remove button with a 24px hit area; arrow keys move focus onto the chips themselves.
function ComboboxChips({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> &
  ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        "control-field flex min-h-control flex-wrap items-center gap-1.5 rounded-[calc(var(--control-height)/2)] py-[calc((var(--control-height)-2*var(--line)-1.5rem)/2)] ps-snug pe-tight has-data-[slot=combobox-chip]:ps-[calc((var(--control-height)-2*var(--line)-1.5rem)/2)]",
        className,
      )}
      {...props}
    />
  )
}

function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxPrimitive.Chip.Props & {
  showRemove?: boolean
}) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        "flex h-6 w-fit items-center justify-center gap-0.5 rounded-full border-(length:--line) border-ink bg-highlight px-[0.55rem] font-mono text-[0.75rem] leading-none whitespace-nowrap text-ink data-disabled:cursor-not-allowed data-disabled:border-ink-quiet data-disabled:bg-[color-mix(in_oklab,var(--highlight)_40%,var(--paper))] data-disabled:text-ink-quiet has-data-[slot=combobox-chip-remove]:pe-0",
        className,
      )}
      {...props}
    >
      {children}
      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          className="-my-(--line) -me-(--line) grid size-6 shrink-0 cursor-pointer place-items-center rounded-full border-(length:--line) border-transparent text-ink transition-colors duration-(--duration-control) ease-(--ease) in-data-disabled:pointer-events-none hover:border-ink hover:bg-[color-mix(in_oklab,var(--highlight)_92%,var(--ink))]"
          data-slot="combobox-chip-remove"
          aria-label="Remove"
        >
          <XIcon className="pointer-events-none size-3 [stroke-width:calc(var(--line)*2)]" />
        </ComboboxPrimitive.ChipRemove>
      )}
    </ComboboxPrimitive.Chip>
  )
}

function ComboboxChipsInput({
  className,
  ...props
}: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      className={cn(
        "h-6 min-w-16 flex-1 border-0 bg-transparent px-1 font-read text-[max(1rem,16px)] leading-ui text-ink outline-none placeholder:text-(--field-quiet) disabled:cursor-not-allowed disabled:text-ink-quiet",
        className,
      )}
      {...props}
    />
  )
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null)
}

export { ComboboxChip, ComboboxChips, ComboboxChipsInput, useComboboxAnchor }
