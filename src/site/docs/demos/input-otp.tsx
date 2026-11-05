import { useState } from "react"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/serigraph/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/serigraph/ui/input-otp"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Input OTP",
  description:
    "One tinted box per digit for a short one-time code, such as the sign-in code Meridian sends its members.",
  item: "input-otp",
  group: "Forms",
}

type CodeProps = {
  id?: string
  invalid?: boolean
  defaultValue?: string
  disabled?: boolean
  autoComplete?: string
  "aria-label"?: string
  "aria-describedby"?: string
}

// Controlled: input-otp forwards defaultValue to its own controlled <input>, which React rejects.
function Code({ invalid, defaultValue = "", ...props }: CodeProps) {
  const [value, setValue] = useState(defaultValue)
  return (
    <InputOTP
      maxLength={6}
      pattern={REGEXP_ONLY_DIGITS}
      aria-invalid={invalid || undefined}
      value={value}
      onChange={setValue}
      {...props}
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}

function DomeCode() {
  const [value, setValue] = useState("")
  return (
    <InputOTP
      maxLength={4}
      pattern={REGEXP_ONLY_DIGITS}
      aria-label="Door code for the dome"
      value={value}
      onChange={setValue}
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
    </InputOTP>
  )
}

export default function InputOTPDemo() {
  return (
    <>
      <DemoSection title="Sign-in code">
        <StateRow label="Empty">
          <Field className="w-auto">
            <FieldLabel htmlFor="otp-sign-in">Sign-in code</FieldLabel>
            <Code
              id="otp-sign-in"
              autoComplete="one-time-code"
              aria-describedby="otp-sign-in-hint"
            />
            <FieldDescription id="otp-sign-in-hint">
              Sent to ada@meridian.dk. It works for ten minutes.
            </FieldDescription>
          </Field>
        </StateRow>
      </DemoSection>
      <DemoSection title="States">
        <StateRow label="Partly filled">
          <Code aria-label="Sign-in code" defaultValue="582" />
        </StateRow>
        <StateRow label="Filled">
          <Code aria-label="Sign-in code" defaultValue="582941" />
        </StateRow>
        <StateRow label="Invalid">
          <Field data-invalid="true" className="w-auto">
            <Code
              aria-label="Sign-in code"
              defaultValue="582914"
              invalid
              aria-describedby="otp-error"
            />
            <FieldError id="otp-error">
              That code does not match. Check the latest email.
            </FieldError>
          </Field>
        </StateRow>
        <StateRow label="Disabled">
          <Code aria-label="Sign-in code" defaultValue="582941" disabled />
        </StateRow>
      </DemoSection>
      <DemoSection title="Variants">
        <StateRow label="Four digits">
          <DomeCode />
        </StateRow>
      </DemoSection>
    </>
  )
}
