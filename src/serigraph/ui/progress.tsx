"use client"

import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { cn } from "@/serigraph/lib/utils"

// A pill slot in the ink line, tinted from the surface beneath, filling with louvers: thin slats of the action colour
// and ink, like stair risers, that grow as the task moves on, closed by an ink line at their leading end. Indeterminate,
// a short run of louvers crosses the slot; under reduced motion it stands still in the middle (styles/forms.css).
// Label in the extended capitals, value in the mono face.

function Progress({
  className,
  children,
  value,
  locale = "en-US",
  ...props
}: ProgressPrimitive.Root.Props) {
  // A fixed locale by default, so the value reads the same on the server and in the browser (no hydration mismatch).
  return (
    <ProgressPrimitive.Root
      value={value}
      locale={locale}
      data-slot="progress"
      className={cn(
        "flex flex-wrap items-baseline gap-x-tight gap-y-hair",
        className,
      )}
      {...props}
    >
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  )
}

function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  return (
    <ProgressPrimitive.Track
      className={cn(
        "relative flex h-4 w-full items-stretch overflow-hidden rounded-full border-(length:--line) border-ink bg-[color-mix(in_oklab,var(--surface,var(--canvas))_30%,var(--paper))]",
        className,
      )}
      data-slot="progress-track"
      {...props}
    />
  )
}

function ProgressIndicator({
  className,
  ...props
}: ProgressPrimitive.Indicator.Props) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn(
        "louvers relative h-auto! transition-[width] duration-200 ease-(--ease) after:absolute after:inset-y-0 after:end-0 after:w-(--line) after:bg-ink data-complete:after:hidden forced-colors:bg-[CanvasText] forced-colors:forced-color-adjust-none",
        className,
      )}
      {...props}
    />
  )
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      className={cn("caps text-(--text)", className)}
      data-slot="progress-label"
      {...props}
    />
  )
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      className={cn(
        "ms-auto font-mono text-small leading-small text-(--text) tabular-nums",
        className,
      )}
      data-slot="progress-value"
      {...props}
    />
  )
}

export {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
}
