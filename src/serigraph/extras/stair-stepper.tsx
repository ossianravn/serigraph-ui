import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { cn } from "@/serigraph/lib/utils"

// Progress through steps, drawn as a stair seen from the side: each step a block one riser taller than the last, its
// tread and riser in the line, its label in the caps standing on its tread. Steps done are louvered (slats of the
// action colour and ink, as under the poster's stairs) or filled with the action colour; the current step takes the
// highlight; steps to come are open, drawn in the surface's edge. An ordered list: the current step has
// aria-current="step" and done steps say so, so the stair reads the same without its drawing
// (styles/extras-tickets.css). Each column is 6.5rem, narrower down to its label when space is short; when even that
// does not fit, the stair numbers its steps and names the current one beneath it. Props go to the list (give it an
// aria-label); className to the frame around it.

export interface StairStepperProps extends Omit<
  ComponentPropsWithoutRef<"ol">,
  "children"
> {
  /** The steps' labels, in order. Keep them to a word. */
  steps: ReactNode[]
  /** The step being done now, counted from 0; steps.length when every step is done. */
  current: number
  /** How a done step is printed: louvers of the action colour and ink, or the action colour flat. */
  done?: "louvers" | "filled"
  /** The words a screen reader adds to a done step. */
  doneLabel?: string
  /** Number the steps and name only the current one under the stair. It happens by itself when the steps do not
   * fit their labels (from five steps on a phone); set it to keep it compact everywhere. */
  compact?: boolean
}

/** A stepper whose steps climb like a stair. */
export function StairStepper({
  steps,
  current,
  done = "louvers",
  doneLabel = "done",
  compact = false,
  className,
  ...props
}: StairStepperProps) {
  const shown = Math.min(current, steps.length - 1)
  return (
    <div
      data-slot="stair-stepper"
      data-done={done}
      data-steps={steps.length}
      data-compact={compact || undefined}
      className={cn("@container/stair w-full min-w-0", className)}
    >
      <ol
        data-slot="stair-stepper-list"
        className="m-0 grid w-fit max-w-full list-none auto-cols-[minmax(min-content,6.5rem)] grid-flow-col items-end p-0"
        {...props}
      >
        {steps.map((label, i) => {
          const state =
            i < current ? "done" : i === current ? "current" : "upcoming"
          return (
            <li
              key={i}
              data-slot="stair-stepper-step"
              data-state={state}
              aria-current={state === "current" ? "step" : undefined}
              className="grid min-w-0 content-end"
            >
              <span
                data-slot="stair-stepper-label"
                className="caps block px-tight pb-hair text-balance text-(--text)"
              >
                <span data-slot="stair-stepper-text">
                  {label}
                  {state === "done" ? (
                    <span className="sr-only">, {doneLabel}</span>
                  ) : null}
                </span>
                <span
                  data-slot="stair-stepper-number"
                  aria-hidden="true"
                  className="hidden font-mono tabular-nums"
                >
                  {i + 1}
                </span>
              </span>
              <span
                data-slot="stair-stepper-riser"
                aria-hidden="true"
                className="block"
                style={{ ["--stair-step" as string]: i + 1 }}
              />
            </li>
          )
        })}
      </ol>
      <p
        data-slot="stair-stepper-caption"
        aria-hidden="true"
        className="caps m-0 hidden pt-tight text-(--text)"
      >
        <span className="font-mono tabular-nums">
          {shown + 1}/{steps.length}
        </span>
        <span className="sep">•</span>
        {steps[shown]}
      </p>
    </div>
  )
}
