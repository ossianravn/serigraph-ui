"use client"

import * as React from "react"
import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire"
import { cn } from "@/serigraph/lib/utils"
import { Kbd } from "@/serigraph/ui/kbd"

// The answering parts of a questionnaire. A choice is a row with the box radius, just the edge line on whatever is
// beneath, which takes a tint under the pointer; chosen, it takes the highlight inside an ink line, and its box (a
// rounded square for several answers, a circle for one) takes a fine ink tick or a solid ink dot, so colour is never
// the only sign. Shortcut letters sit on keys. An unanswered required choice has a rose second ring, and the error
// reads in ink after a rose dot. A typed answer is a field.
export const TICK = "M2.5 7.4 5.6 10.3 11.5 3.6"

function QuestionnaireChoice({
  children,
  className,
  value,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choice>) {
  return (
    <QuestionnairePrimitive.Choice
      data-slot="questionnaire-choice"
      value={value}
      className={cn(
        "group/questionnaire-choice relative flex min-h-control cursor-pointer items-start gap-tight rounded-box border-(length:--line) border-(--edge,var(--ink)) px-snug py-[0.6875rem] text-start font-read text-body leading-ui text-(--text,var(--ink)) transition-colors duration-(--duration-control) ease-(--ease) select-none",
        "hover:not-data-disabled:not-data-checked:bg-[color-mix(in_oklab,var(--surface,var(--canvas))_70%,var(--paper))]",
        "data-checked:border-ink data-checked:bg-highlight data-checked:text-ink data-checked:[--surface:var(--highlight)] data-checked:[--text:var(--ink)] data-checked:[--edge:var(--ink)]",
        "data-invalid:outline-(length:--line) data-invalid:outline-offset-3 data-invalid:outline-rose",
        "has-[>input:focus-visible]:outline-(length:--line) has-[>input:focus-visible]:outline-offset-3 has-[>input:focus-visible]:outline-(--edge,var(--ink)) data-invalid:has-[>input:focus-visible]:outline-[calc(var(--line)*2)] data-invalid:has-[>input:focus-visible]:outline-rose",
        "data-disabled:cursor-not-allowed data-disabled:border-(--text-quiet,var(--ink-quiet)) data-disabled:text-(--text-quiet,var(--ink-quiet))",
        "forced-colors:data-checked:border-[calc(var(--line)*2)]",
        className,
      )}
      {...props}
    >
      <QuestionnairePrimitive.ChoiceInput
        data-slot="questionnaire-choice-input"
        className="absolute inset-0 z-10 size-full cursor-pointer appearance-none rounded-[inherit] bg-transparent outline-none disabled:cursor-not-allowed"
      />
      <span
        aria-hidden="true"
        data-slot="questionnaire-choice-indicator"
        className="pointer-events-none relative mt-px grid size-5 shrink-0 place-items-center rounded-[0.375rem] border-(length:--line) border-(--edge,var(--ink)) bg-[color-mix(in_oklab,var(--surface,var(--canvas))_30%,var(--paper))] text-ink group-data-checked/questionnaire-choice:border-ink group-data-checked/questionnaire-choice:bg-highlight group-data-disabled/questionnaire-choice:border-(--text-quiet,var(--ink-quiet)) group-data-[type=radio]/questionnaire-choice:rounded-full"
      >
        <svg
          data-slot="questionnaire-choice-indicator-check"
          viewBox="0 0 14 14"
          className="hidden size-3.5 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [[data-checked][data-type=checkbox]_&]:block"
        >
          <path d={TICK} strokeWidth={1.6} />
        </svg>
        <svg
          data-slot="questionnaire-choice-indicator-dot"
          viewBox="0 0 8 8"
          className="hidden size-2 fill-current [[data-checked][data-type=radio]_&]:block"
        >
          <circle cx="4" cy="4" r="4" />
        </svg>
      </span>
      <QuestionnairePrimitive.ChoiceLabel
        data-slot="questionnaire-choice-label"
        className="flex min-w-0 flex-1 flex-col gap-0.5 pt-px"
      >
        {children}
      </QuestionnairePrimitive.ChoiceLabel>
      <QuestionnairePrimitive.ChoiceShortcut
        data-slot="questionnaire-choice-shortcut"
        render={<Kbd />}
        className="ms-auto"
      />
    </QuestionnairePrimitive.Choice>
  )
}

function QuestionnaireChoiceDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="questionnaire-choice-description"
      className={cn("text-small leading-small", className)}
      {...props}
    />
  )
}

function QuestionnaireInput({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Input>) {
  return (
    <div
      data-slot="questionnaire-input-wrapper"
      className="group/questionnaire-input relative w-full min-w-0"
    >
      <QuestionnairePrimitive.Input
        data-slot="questionnaire-input"
        className={cn(
          "control-field h-control w-full min-w-0 px-snug py-0",
          className,
        )}
        {...props}
      />
    </div>
  )
}

function QuestionnaireError({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Error>) {
  return (
    <QuestionnairePrimitive.Error
      data-slot="questionnaire-error"
      className={cn(
        "m-0 flex items-start gap-hair text-small leading-small text-(--text,var(--ink)) before:mt-[calc((1lh-0.5rem)/2)] before:size-2 before:shrink-0 before:rounded-full before:border-(length:--line) before:border-ink before:bg-rose forced-colors:before:bg-[CanvasText]",
        className,
      )}
      {...props}
    />
  )
}

export {
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireError,
  QuestionnaireInput,
}
