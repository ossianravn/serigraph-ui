"use client"

import { useId, type ReactNode } from "react"
import { cn } from "@/serigraph/lib/utils"
import { FieldError } from "@/serigraph/ui/field"

// The settings page's rows: every name set to the end of one label column, right beside its control, the controls of
// every section lined up on one edge, and a hint under the control. In a column under 30rem each name stands above
// its control, except a switch, which stays at the end of its name's line as phones do. Ported from Fineliner's.

/** A titled group of rows, the title in the reading face. */
export function SettingsSection({
  title,
  children,
  className,
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  const id = useId()
  return (
    <section className={cn("mt-section", className)} aria-labelledby={id}>
      <h2
        id={id}
        className="m-0 font-read text-lead leading-lead font-semibold"
      >
        {title}
      </h2>
      <div className="mt-snug grid grid-cols-[minmax(0,1fr)] gap-y-line @min-[30rem]/settings:grid-cols-[11rem_minmax(0,1fr)] @min-[30rem]/settings:gap-x-line @min-[30rem]/settings:gap-y-snug">
        {children}
      </div>
    </section>
  )
}

/**
 * One setting: its name in the label column, the control beside it at control height, and an optional error and hint
 * under the control. A `beside` row (a switch) keeps its control at the end of the name's line on narrow screens. A
 * row without a label (a save button) keeps the label cell empty, so its control stays on the controls' edge.
 */
export function SettingsRow({
  label,
  hint,
  error,
  htmlFor,
  hintId,
  errorId,
  beside,
  disabled,
  children,
}: {
  label?: string
  hint?: ReactNode
  error?: ReactNode
  htmlFor?: string
  /** Ids for the hint and the error, for the control's aria-describedby. */
  hintId?: string
  errorId?: string
  /** Keep the control beside its name on narrow screens too: for switches. */
  beside?: boolean
  /** Quiets the name while its control is off. */
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "col-span-full grid items-center gap-x-snug gap-y-hair @min-[30rem]/settings:grid-cols-subgrid @min-[30rem]/settings:items-start @min-[30rem]/settings:gap-x-line",
        beside ? "grid-cols-[minmax(0,1fr)_auto]" : "grid-cols-[minmax(0,1fr)]",
      )}
    >
      {label ? (
        <label
          htmlFor={htmlFor}
          className={cn(
            "font-read text-body leading-ui",
            disabled ? "text-(--text-quiet)" : "text-(--text)",
            "@min-[30rem]/settings:flex @min-[30rem]/settings:min-h-control @min-[30rem]/settings:items-center @min-[30rem]/settings:justify-end @min-[30rem]/settings:text-end",
          )}
        >
          {label}
        </label>
      ) : (
        <span aria-hidden="true" className="@max-[30rem]/settings:hidden" />
      )}
      <div className="flex min-h-control max-w-full min-w-0 items-center gap-snug">
        {children}
      </div>
      {(error || hint) && (
        <div
          className={cn(
            "flex min-w-0 flex-col items-start gap-hair @min-[30rem]/settings:col-start-2",
            beside && "col-span-2 @min-[30rem]/settings:col-span-1",
          )}
        >
          {error && (
            <FieldError id={errorId} className="max-w-[24rem]">
              {error}
            </FieldError>
          )}
          {hint && (
            <p
              id={hintId}
              className="m-0 max-w-[24rem] text-small leading-small text-(--text)"
            >
              {hint}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
