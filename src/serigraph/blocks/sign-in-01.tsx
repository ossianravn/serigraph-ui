"use client"

import { useEffect, useRef, useState, type SyntheticEvent } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Folly } from "@/serigraph/extras/folly"
import { Lettering } from "@/serigraph/extras/lettering"
import { cn } from "@/serigraph/lib/utils"
import { Button } from "@/serigraph/ui/button"
import { Checkbox } from "@/serigraph/ui/checkbox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/serigraph/ui/field"
import { Input } from "@/serigraph/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/serigraph/ui/input-group"

// Signing in: the form on a plane in a tone, and on wide screens an arched window folly beside it. Email and password
// are checked when the form is sent and then as they are corrected, each error under its field, and focus moves to
// the first field that needs attention. "Email me a link instead" checks only the email and turns the plane into a
// check-your-email note. Wire onSignIn and onRequestLink to your auth.

export const meta = {
  title: "Sign in",
  description:
    "Email and password on a plane with errors under their fields, keep me signed in, and a link by email instead, beside an arched window.",
}

export interface SignIn01Props {
  /** The lettered heading. */
  title?: string
  /** One line under the heading. */
  tagline?: string
  /** An example address in the email field. */
  placeholder?: string
  /** Seeds the window folly beside the form. */
  seed?: string
  /** Where a successful sign-in goes. Without it, the form says who signed in. */
  redirectTo?: string
  onSignIn?: (details: { email: string; remember: boolean }) => void
  onRequestLink?: (email: string) => void
  className?: string
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** What is wrong with the email, in words a visitor can act on. */
function emailError(email: string) {
  if (!email.trim()) return "Enter the email you booked with."
  if (!EMAIL.test(email.trim()))
    return "That email is missing part of its address."
  return ""
}

export function SignIn01({
  title = "Sign in",
  tagline = "Book seats and telescope time, and keep your tickets in one place.",
  placeholder = "ada@meridian.dk",
  seed = "meridian sign-in",
  redirectTo,
  onSignIn,
  onRequestLink,
  className,
}: SignIn01Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [visible, setVisible] = useState(false)
  // Which action was tried: a password sign-in checks both fields, a link only the email.
  const [tried, setTried] = useState<"password" | "link" | null>(null)
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [status, setStatus] = useState("")
  const emailField = useRef<HTMLInputElement>(null)
  const passwordField = useRef<HTMLInputElement>(null)
  const sentHeading = useRef<HTMLHeadingElement>(null)
  const returning = useRef(false)

  const errors = {
    email: tried ? emailError(email) : "",
    password: tried === "password" && !password ? "Enter your password." : "",
  }

  // Moving between the form and the sent note keeps focus with the person: on the note's heading, then back on the
  // email they may want to change.
  useEffect(() => {
    if (sentTo) sentHeading.current?.focus()
    else if (returning.current) emailField.current?.focus()
    returning.current = false
  }, [sentTo])

  function signIn(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    setTried("password")
    if (emailError(email)) return emailField.current?.focus()
    if (!password) return passwordField.current?.focus()
    onSignIn?.({ email: email.trim(), remember })
    if (redirectTo) window.location.assign(redirectTo)
    else setStatus(`Signed in as ${email.trim()}.`)
  }

  function requestLink() {
    if (tried !== "password") setTried("link")
    if (emailError(email)) return emailField.current?.focus()
    onRequestLink?.(email.trim())
    setStatus("")
    setSentTo(email.trim())
  }

  return (
    <div
      className={cn("@container/sign-in flex min-h-dvh flex-col", className)}
    >
      <div className="mx-auto grid w-full max-w-[58rem] flex-1 grid-cols-[minmax(0,1fr)] content-start items-center gap-page px-snug py-section @min-[40rem]/sign-in:content-center @min-[40rem]/sign-in:px-line @min-[52rem]/sign-in:grid-cols-[minmax(0,26rem)_16rem] @min-[52rem]/sign-in:justify-center">
        <div
          className="plane mx-auto w-[26rem] max-w-full p-line @min-[30rem]/sign-in:p-section"
          data-tone="2"
        >
          <Lettering as="h1" className="m-0 text-[clamp(2.5rem,9vw,3.5rem)]">
            {title}
          </Lettering>
          {sentTo ? (
            <div className="mt-tight">
              <h2
                ref={sentHeading}
                tabIndex={-1}
                className="m-0 font-read text-lead leading-lead font-semibold focus-visible:focus-ring"
              >
                Check your email
              </h2>
              <p className="m-0 mt-hair">
                A link is on its way to{" "}
                <strong className="font-semibold [overflow-wrap:anywhere]">
                  {sentTo}
                </strong>
                . It signs you in once and works for an hour.
              </p>
              <div className="mt-line flex flex-wrap items-center gap-x-line gap-y-snug">
                <Button
                  variant="outline"
                  onClick={() => {
                    onRequestLink?.(sentTo)
                    setStatus(`Sent another link to ${sentTo}.`)
                  }}
                >
                  Send again
                </Button>
                <Button
                  variant="link"
                  onClick={() => {
                    returning.current = true
                    setStatus("")
                    setSentTo(null)
                  }}
                >
                  Use a password
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="m-0 mt-tight">{tagline}</p>
              <form onSubmit={signIn} noValidate className="mt-line">
                <FieldGroup>
                  <Field data-invalid={errors.email ? "true" : undefined}>
                    <FieldLabel htmlFor="sign-in-email">Email</FieldLabel>
                    <Input
                      ref={emailField}
                      id="sign-in-email"
                      type="email"
                      autoComplete="username"
                      spellCheck={false}
                      placeholder={placeholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={errors.email ? "true" : undefined}
                      aria-describedby={
                        errors.email ? "sign-in-email-error" : undefined
                      }
                      className="w-72 max-w-full"
                    />
                    {errors.email && (
                      <FieldError id="sign-in-email-error">
                        {errors.email}
                      </FieldError>
                    )}
                  </Field>
                  <Field data-invalid={errors.password ? "true" : undefined}>
                    <FieldLabel htmlFor="sign-in-password">Password</FieldLabel>
                    <InputGroup className="w-72 max-w-full">
                      <InputGroupInput
                        ref={passwordField}
                        id="sign-in-password"
                        type={visible ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        aria-invalid={errors.password ? "true" : undefined}
                        aria-describedby={
                          errors.password ? "sign-in-password-error" : undefined
                        }
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          size="icon-xs"
                          aria-label="Show password"
                          aria-pressed={visible}
                          onClick={() => setVisible((v) => !v)}
                        >
                          {visible ? <EyeOffIcon /> : <EyeIcon />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {errors.password && (
                      <FieldError id="sign-in-password-error">
                        {errors.password}
                      </FieldError>
                    )}
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox
                      id="sign-in-remember"
                      checked={remember}
                      onCheckedChange={(on) => setRemember(on)}
                    />
                    <FieldLabel htmlFor="sign-in-remember">
                      Keep me signed in on this device
                    </FieldLabel>
                  </Field>
                </FieldGroup>
                <div className="mt-line flex flex-wrap items-center gap-x-line gap-y-snug">
                  <Button type="submit">Sign in</Button>
                  <Button variant="link" type="button" onClick={requestLink}>
                    Email me a link instead
                  </Button>
                </div>
              </form>
            </>
          )}
          <p
            aria-live="polite"
            className="m-0 text-small leading-small not-empty:mt-snug"
          >
            {status}
          </p>
        </div>
        <Folly
          template="window"
          seed={seed}
          className="arch-frame hidden w-[16rem] @min-[52rem]/sign-in:block"
        />
      </div>
    </div>
  )
}

export default SignIn01
