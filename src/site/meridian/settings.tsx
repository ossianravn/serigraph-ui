import { useState } from "react"
import { Lettering } from "@/serigraph/extras/lettering"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/serigraph/ui/alert-dialog"
import { Button } from "@/serigraph/ui/button"
import { Checkbox } from "@/serigraph/ui/checkbox"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/serigraph/ui/field"
import { Input } from "@/serigraph/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/serigraph/ui/select"
import { Switch } from "@/serigraph/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/serigraph/ui/toggle-group"
import { SESSIONS, VISITOR, type Session, type Visitor } from "./data"
import { SettingRow } from "./setting-row"
import { SettingsAppearance } from "./settings-appearance"

const BEFORE = [
  { value: "30", label: "30 minutes before" },
  { value: "60", label: "1 hour before" },
  { value: "120", label: "2 hours before" },
]
const EMAILS = [
  [
    "alerts",
    "Sky alerts",
    "Auroras, comets and a clear night after a cloudy week.",
  ],
  ["shows", "New shows", "When a season's planetarium shows go on sale."],
  ["letter", "The members' letter", "Once a month, from the director."],
] as const

// Meridian's settings in one narrow column: who you are, how the observatory should treat you, how the pages look,
// which emails you get, and closing the account. Settings apply as they change; the profile is saved with its button.
/** What closing the account does to the seats held, in one clause. */
function seatsClause(visitor: Visitor, sessions: Session[]) {
  const held = sessions.filter((s) => (visitor.seats[s.id] ?? 0) > 0)
  const total = held.reduce((n, s) => n + (visitor.seats[s.id] ?? 0), 0)
  const seats = total === 1 ? "seat" : "seats"
  if (held.length === 0) return "You hold no seats"
  if (held.length === 1)
    return `Your ${total} ${seats} for ${held[0]?.title} go back on sale`
  return `Your ${total} ${seats} for ${held.length} sessions go back on sale`
}

export function Settings({
  visitor = VISITOR,
  sessions = SESSIONS,
}: {
  visitor?: Visitor
  sessions?: Session[]
}) {
  const [redLight, setRedLight] = useState(true)
  const [remind, setRemind] = useState(true)
  const [before, setBefore] = useState("60")
  const [saved, setSaved] = useState(false)

  return (
    <div className="mer-settings mer-narrow">
      <Lettering as="h1" className="mer-title">
        Settings
      </Lettering>
      <FieldSet>
        <FieldLegend>Profile</FieldLegend>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            setSaved(true)
          }}
          onChange={() => setSaved(false)}
        >
          <FieldGroup>
            <Field className="w-auto">
              <FieldLabel htmlFor="set-name">Name</FieldLabel>
              <Input
                id="set-name"
                defaultValue={visitor.name}
                autoComplete="name"
                className="w-64 max-w-full"
              />
            </Field>
            <Field className="w-auto">
              <FieldLabel htmlFor="set-email">Email</FieldLabel>
              <Input
                id="set-email"
                type="email"
                defaultValue={visitor.email}
                autoComplete="email"
                className="w-72 max-w-full"
              />
            </Field>
            <p className="m-0">
              Member number <span className="font-mono">{visitor.member}</span>
            </p>
            <div className="flex flex-wrap items-center gap-snug">
              <Button type="submit">Save profile</Button>
              <span role="status" className="text-small">
                {saved ? "Saved." : ""}
              </span>
            </div>
          </FieldGroup>
        </form>
      </FieldSet>
      <FieldSet>
        <FieldLegend>At the observatory</FieldLegend>
        <FieldGroup>
          <SettingRow
            id="set-red"
            label="Red-light mode"
            description="After dusk the pages turn red, so your eyes stay used to the dark on the deck."
          >
            <Switch
              id="set-red"
              checked={redLight}
              onCheckedChange={setRedLight}
            />
          </SettingRow>
          <SettingRow
            id="set-remind"
            label="Reminders"
            description="A message before each session you hold seats for."
          >
            <Switch
              id="set-remind"
              checked={remind}
              onCheckedChange={setRemind}
            />
          </SettingRow>
          <SettingRow id="set-before" label="Remind me" disabled={!remind}>
            <Select
              items={BEFORE}
              value={before}
              onValueChange={(value) => value && setBefore(value)}
              disabled={!remind}
            >
              <SelectTrigger id="set-before" className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BEFORE.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingRow>
          <SettingRow id="set-clock" label="Times">
            <ToggleGroup
              id="set-clock"
              aria-label="Times"
              spacing={0}
              defaultValue={["24"]}
            >
              <ToggleGroupItem value="24">24-hour</ToggleGroupItem>
              <ToggleGroupItem value="12">12-hour</ToggleGroupItem>
            </ToggleGroup>
          </SettingRow>
        </FieldGroup>
      </FieldSet>
      <SettingsAppearance />
      <FieldSet>
        <FieldLegend>Emails</FieldLegend>
        <FieldGroup>
          {EMAILS.map(([key, label, description], i) => (
            <Field key={key} orientation="horizontal">
              <Checkbox id={`set-${key}`} defaultChecked={i < 2} />
              <div className="grid gap-hair">
                <FieldLabel htmlFor={`set-${key}`}>{label}</FieldLabel>
                <p className="m-0 text-small leading-small">{description}</p>
              </div>
            </Field>
          ))}
        </FieldGroup>
      </FieldSet>
      <FieldSet>
        <FieldLegend>Close your account</FieldLegend>
        <p className="m-0">
          Your seats are released and your membership ends today. Tickets
          already used stay in our records for the accounts.
        </p>
        <AlertDialog>
          <AlertDialogTrigger
            render={<Button variant="destructive" className="w-fit" />}
          >
            Close account
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Close your Meridian account?</AlertDialogTitle>
              <AlertDialogDescription>
                {seatsClause(visitor, sessions)}, and membership{" "}
                {visitor.member} ends today. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep my account</AlertDialogCancel>
              <AlertDialogAction variant="destructive">
                Close account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </FieldSet>
    </div>
  )
}
