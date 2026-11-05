import { useState, type FormEvent } from "react"
import { Lettering } from "@/serigraph/extras/lettering"
import { Button } from "@/serigraph/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/serigraph/ui/field"
import { Input } from "@/serigraph/ui/input"

type Errors = { email?: string; password?: string }

/** What is wrong with the form, in words a visitor can act on. */
function check(email: string, password: string): Errors {
  const errors: Errors = {}
  if (!email.trim()) errors.email = "Enter the email you booked with."
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    errors.email = "That email is missing part of its address."
  if (!password) errors.password = "Enter your password."
  return errors
}

// Signing in to Meridian: email and password on a plane, the errors under the field they belong to, and a link by
// email for anyone without a password. A demo: any well-formed email and a password go through to tonight.
export function SignIn({ next = "/meridian" }: { next?: string }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [linkSent, setLinkSent] = useState(false)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const found = check(email, password)
    setErrors(found)
    if (!found.email && !found.password) window.location.assign(next)
  }
  const sendLink = () => {
    const found = check(email, "link")
    setErrors({ email: found.email })
    setLinkSent(!found.email)
  }

  return (
    <div className="plane grid gap-line p-line sm:p-section" data-tone="2">
      <div>
        <Lettering as="h1" className="m-0 text-[clamp(2.5rem,9vw,3.5rem)]">
          Sign in
        </Lettering>
        <p className="m-0 mt-tight">
          Book seats and telescope time, and keep your tickets in one place.
        </p>
      </div>
      <form onSubmit={submit} noValidate>
        <FieldGroup>
          <Field data-invalid={errors.email ? "true" : undefined}>
            <FieldLabel htmlFor="signin-email">Email</FieldLabel>
            <Input
              id="signin-email"
              type="email"
              autoComplete="email"
              placeholder="ada@meridian.dk"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={errors.email ? "true" : undefined}
              aria-describedby={errors.email ? "signin-email-error" : undefined}
              className="w-72 max-w-full"
            />
            {errors.email && (
              <FieldError id="signin-email-error">{errors.email}</FieldError>
            )}
          </Field>
          <Field data-invalid={errors.password ? "true" : undefined}>
            <FieldLabel htmlFor="signin-password">Password</FieldLabel>
            <Input
              id="signin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={errors.password ? "true" : undefined}
              aria-describedby={
                errors.password ? "signin-password-error" : undefined
              }
              className="w-72 max-w-full"
            />
            {errors.password && (
              <FieldError id="signin-password-error">
                {errors.password}
              </FieldError>
            )}
          </Field>
          <div>
            <Button type="submit">Sign in</Button>
          </div>
          <FieldSeparator>or</FieldSeparator>
          <Field>
            <div>
              <Button type="button" variant="outline" onClick={sendLink}>
                Email me a link
              </Button>
            </div>
            <FieldDescription role="status">
              {linkSent
                ? `A link is on its way to ${email.trim()}. It works for an hour.`
                : "No password? We send a link that signs you in once."}
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
