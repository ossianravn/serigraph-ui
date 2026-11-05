"use client"

import * as React from "react"
import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire"
import { cn } from "@/serigraph/lib/utils"
import { buttonVariants, type Button } from "@/serigraph/ui/button"
import {
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireError,
  QuestionnaireInput,
  TICK,
} from "@/serigraph/ui/questionnaire-choice"

// Questions one at a time on a plane with the big radius. No sheets peek out beneath it: depth belongs to drawings,
// so what is still to come shows in the progress instead, a row of numbers in small circles joined by short fine
// lines: a passed question takes the highlight and a fine ink tick, the current one a second ring round its line, and
// those still to come only a dashed line. The answering parts live in questionnaire-choice.tsx; the
// actions are the kit's pills, the main one last.

function Questionnaire({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Root>) {
  return (
    <QuestionnairePrimitive.Root
      data-slot="questionnaire"
      className={cn(
        "plane group/questionnaire relative flex w-full min-w-0 flex-col gap-snug p-snug sm:p-line",
        className,
      )}
      {...props}
    />
  )
}

function ProgressRings({ current, total }: { current: number; total: number }) {
  return (
    <span aria-hidden="true" className="flex flex-wrap items-center gap-y-1">
      {Array.from({ length: total }, (_, i) => {
        const state =
          i + 1 < current ? "done" : i + 1 === current ? "current" : "next"
        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <span className="w-2.5 border-t-(length:--line) border-(--edge,var(--ink))" />
            )}
            <span
              data-state={state}
              className="relative flex size-6 items-center justify-center rounded-full border-(length:--line) border-ink bg-[color-mix(in_oklab,var(--surface,var(--canvas))_30%,var(--paper))] font-mono text-[0.6875rem] leading-none text-ink tabular-nums data-[state=current]:outline-(length:--line) data-[state=current]:outline-offset-2 data-[state=current]:outline-ink data-[state=done]:bg-highlight data-[state=next]:border-dashed data-[state=next]:border-(--edge,var(--ink)) data-[state=next]:bg-transparent data-[state=next]:text-(--text,var(--ink))"
            >
              {state === "done" ? (
                <svg
                  viewBox="0 0 14 14"
                  className="size-3 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round]"
                >
                  <path d={TICK} strokeWidth={1.6} />
                </svg>
              ) : (
                i + 1
              )}
            </span>
          </React.Fragment>
        )
      })}
    </span>
  )
}

function QuestionnaireProgress({
  className,
  children,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Progress>) {
  return (
    <QuestionnairePrimitive.Progress
      data-slot="questionnaire-progress"
      className={cn(
        "flex min-h-[1lh] w-fit items-center gap-tight px-[3px] text-(--text,var(--ink))",
        className,
      )}
      render={(rendered, state) => {
        const { current, total } = state as { current: number; total: number }
        return (
          <div {...rendered}>
            <ProgressRings current={current} total={total} />
            {children ? (
              <span className="font-mono text-[0.75rem] tabular-nums">
                {children}
              </span>
            ) : null}
          </div>
        )
      }}
      {...props}
    />
  )
}

function QuestionnaireItem({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Item>) {
  // The item takes focus only by script, when a question opens; its answers carry the visible focus.
  return (
    <QuestionnairePrimitive.Item
      data-slot="questionnaire-item"
      className={cn(
        "m-0 flex min-w-0 animate-in flex-col gap-tight border-0 p-0 duration-(--duration-overlay) ease-(--ease) fade-in-0 outline-none",
        className,
      )}
      {...props}
    />
  )
}

function QuestionnaireTitle({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Title>) {
  return (
    <QuestionnairePrimitive.Title
      data-slot="questionnaire-title"
      className={cn(
        "float-left mb-0 w-full p-0 font-read text-lead leading-lead font-semibold text-pretty [&:not(:has(~[data-slot=questionnaire-description]))]:mb-hair",
        className,
      )}
      {...props}
    />
  )
}

function QuestionnaireDescription({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Description>) {
  return (
    <QuestionnairePrimitive.Description
      data-slot="questionnaire-description"
      className={cn(
        "m-0 -mt-1 mb-hair max-w-measure text-small leading-small text-pretty",
        className,
      )}
      {...props}
    />
  )
}

function QuestionnaireChoices({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choices>) {
  return (
    <QuestionnairePrimitive.Choices
      data-slot="questionnaire-choices"
      className={cn(
        "group/questionnaire-choices grid min-w-0 gap-tight",
        className,
      )}
      {...props}
    />
  )
}

function QuestionnaireActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="questionnaire-actions"
      className={cn(
        "grid min-h-control w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-tight pt-hair",
        className,
      )}
      {...props}
    />
  )
}

type Nav = Pick<React.ComponentProps<typeof Button>, "size" | "variant">
type NavPrimitive = typeof QuestionnairePrimitive.Next

// Previous, Skip, Next and Submit share one shape: a pill in a fixed column of the actions grid.
function navButton(
  Primitive: NavPrimitive,
  slot: string,
  place: string,
  fallback: string,
  defaultVariant: Nav["variant"],
) {
  return function QuestionnaireNavButton({
    children,
    className,
    size = "default",
    variant = defaultVariant,
    ...props
  }: React.ComponentProps<NavPrimitive> & Nav) {
    return (
      <Primitive
        data-slot={slot}
        data-size={size}
        data-variant={variant}
        className={cn(buttonVariants({ size, variant }), place, className)}
        {...props}
      >
        {children ?? fallback}
      </Primitive>
    )
  }
}

const QuestionnairePrevious = navButton(
  QuestionnairePrimitive.Previous,
  "questionnaire-previous",
  "col-start-1 row-start-1 justify-self-start",
  "Previous",
  "ghost",
)
const QuestionnaireSkip = navButton(
  QuestionnairePrimitive.Skip,
  "questionnaire-skip",
  "col-start-2 row-start-1 justify-self-end",
  "Skip",
  "outline",
)
const QuestionnaireNext = navButton(
  QuestionnairePrimitive.Next,
  "questionnaire-next",
  "col-start-3 row-start-1 justify-self-end",
  "Next",
  "default",
)
const QuestionnaireSubmit = navButton(
  QuestionnairePrimitive.Submit,
  "questionnaire-submit",
  "col-start-3 row-start-1 justify-self-end",
  "Submit",
  "default",
)

export {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
}
