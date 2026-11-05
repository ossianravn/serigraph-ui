"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { cn } from "@/serigraph/lib/utils"

// One tinted round box per digit, square at control height: the surface's tint inside the ink line, digits in the mono
// face. The box that takes the next keystroke carries the page's concentric ring (a little closer, so it clears its
// neighbours); invalid boxes take a rose second ring, disabled ones the quiet tint (styles/composites.css). Groups are
// divided by a short fine dash.
function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "group/input-otp flex items-center gap-tight has-disabled:cursor-not-allowed",
        containerClassName,
      )}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-hair", className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "field-fill relative flex h-control w-[2.375rem] items-center justify-center rounded-box border-(length:--line) border-ink font-mono text-lead leading-none text-ink tabular-nums",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[1.1em] w-(--line) animate-caret-blink bg-ink duration-1000" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className="flex items-center text-[color:var(--edge,var(--ink))] group-has-disabled/input-otp:text-[color:var(--text-quiet,var(--ink-quiet))]"
      role="separator"
      {...props}
    >
      <span
        aria-hidden="true"
        className="block h-0 w-3 border-t-(length:--line) border-current"
      />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
