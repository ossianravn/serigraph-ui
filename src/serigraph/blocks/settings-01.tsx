"use client"

import { useState } from "react"
import { CloseAccountSection } from "@/serigraph/blocks/settings-01-account"
import { SettingsAppearance } from "@/serigraph/blocks/settings-01-appearance"
import {
  SettingsRow,
  SettingsSection,
} from "@/serigraph/blocks/settings-01-rows"
import { Lettering } from "@/serigraph/extras/lettering"
import { cn } from "@/serigraph/lib/utils"
import type { Appearance } from "@/serigraph/theme"
import { Button } from "@/serigraph/ui/button"
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

// Settings in one 42rem column: the profile, saved with its button; preferences, the appearance and emails, applied
// as they change; closing the account behind an alert dialog. Names sit beside their controls in one label column,
// and every section's controls line up on one edge. `bare` drops the padding and title, for an app shell's own frame.

export const meta = {
  title: "Settings",
  description:
    "A narrow settings column: profile, preferences, appearance, emails as switches, and closing the account behind an alert dialog.",
}

export interface Setting {
  id: string
  label: string
  hint: string
  on: boolean
}

export const PREFERENCES: Setting[] = [
  {
    id: "red-light",
    label: "Red-light mode",
    hint: "After dusk the pages turn red, so your eyes stay used to the dark on the deck.",
    on: true,
  },
  {
    id: "reminders",
    label: "Reminders",
    hint: "A message before each session you hold seats for.",
    on: true,
  },
]

export const EMAILS: Setting[] = [
  {
    id: "alerts",
    label: "Sky alerts",
    hint: "Auroras, comets and a clear night after a cloudy week.",
    on: true,
  },
  {
    id: "shows",
    label: "New shows",
    hint: "When a season's planetarium shows go on sale.",
    on: true,
  },
  {
    id: "letter",
    label: "Members' letter",
    hint: "Once a month, from the director.",
    on: false,
  },
]

const BEFORE = [
  { value: "30", label: "30 minutes before" },
  { value: "60", label: "1 hour before" },
  { value: "120", label: "2 hours before" },
]

export interface Settings01Props {
  name?: string
  email?: string
  /** Shown beside the profile in the mono face; leave out for none. */
  member?: string
  /** Switches in "At the observatory"; one called "reminders" turns the reminder time on and off. */
  preferences?: Setting[]
  emails?: Setting[]
  /** What closing the account does, in the confirmation dialog. */
  closeNote?: string
  onSaveProfile?: (profile: { name: string; email: string }) => void
  onSettingChange?: (id: string, value: boolean | string) => void
  onCloseAccount?: () => void
  /** The defaults the page's appearance script uses, so the appearance rows render the right choices on the server. */
  appearanceDefaults?: Appearance
  /** Only the sections: no page padding and no title, for a shell that draws its own page frame. */
  bare?: boolean
  className?: string
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function Settings01({
  name: initialName = "Ada Lovelace",
  email: initialEmail = "ada@meridian.dk",
  member = "0412",
  preferences = PREFERENCES,
  emails = EMAILS,
  closeNote = "Your seats go back on sale and your membership ends today. Tickets already used stay in our records for the accounts. This cannot be undone.",
  onSaveProfile,
  onSettingChange,
  onCloseAccount,
  appearanceDefaults,
  bare = false,
  className,
}: Settings01Props) {
  const [name, setName] = useState(initialName)
  const [email, setEmail] = useState(initialEmail)
  const [saved, setSaved] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const [on, setOn] = useState(() =>
    Object.fromEntries([...preferences, ...emails].map((s) => [s.id, s.on])),
  )
  const [before, setBefore] = useState("60")
  const [clock, setClock] = useState("24")
  const remindersOff = "reminders" in on && !on.reminders

  function save() {
    if (!EMAIL.test(email.trim())) {
      setInvalid(true)
      document.getElementById("settings-email")?.focus()
      return
    }
    onSaveProfile?.({ name: name.trim(), email: email.trim() })
    setSaved(true)
  }

  const toggle = (s: Setting) => (
    <SettingsRow
      key={s.id}
      label={s.label}
      htmlFor={`settings-${s.id}`}
      hint={s.hint}
      hintId={`settings-${s.id}-hint`}
      beside
    >
      <Switch
        id={`settings-${s.id}`}
        checked={!!on[s.id]}
        aria-describedby={`settings-${s.id}-hint`}
        onCheckedChange={(next) => {
          setOn((all) => ({ ...all, [s.id]: next }))
          onSettingChange?.(s.id, next)
        }}
      />
    </SettingsRow>
  )

  return (
    <div className={cn("@container", className)}>
      <div
        className={cn(
          "@container/settings max-w-[42rem]",
          bare
            ? "*:first:mt-0"
            : "mx-auto px-snug pt-section pb-page @min-[40rem]:px-line",
        )}
      >
        {!bare && (
          <Lettering
            as="h1"
            className="m-0 text-[clamp(3rem,13cqi,5.5rem)] leading-none"
          >
            Settings
          </Lettering>
        )}

        <SettingsSection title="Profile">
          <SettingsRow label="Name" htmlFor="settings-name">
            <Input
              id="settings-name"
              autoComplete="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setSaved(false)
              }}
              className="w-64 max-w-full"
            />
          </SettingsRow>
          <SettingsRow
            label="Email"
            htmlFor="settings-email"
            hint="For signing in, your tickets and the emails below."
            hintId="settings-email-hint"
            error={invalid && "That email is missing part of its address."}
            errorId="settings-email-error"
          >
            <Input
              id="settings-email"
              type="email"
              autoComplete="email"
              spellCheck={false}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setSaved(false)
                if (invalid) setInvalid(!EMAIL.test(e.target.value.trim()))
              }}
              aria-invalid={invalid || undefined}
              aria-describedby={`${invalid ? "settings-email-error " : ""}settings-email-hint`}
              className="w-72 max-w-full"
            />
          </SettingsRow>
          {member && (
            <SettingsRow label="Member number">
              <span className="font-mono">{member}</span>
            </SettingsRow>
          )}
          <SettingsRow>
            {/* Saving turns the label to Saved in the same footprint, instead of adding a message. */}
            <Button onClick={save}>
              <span className="grid *:col-start-1 *:row-start-1">
                <span className={cn(saved && "invisible")}>Save profile</span>
                <span className={cn(!saved && "invisible")}>Saved</span>
              </span>
            </Button>
            <span aria-live="polite" className="sr-only">
              {saved ? "Profile saved." : ""}
            </span>
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title="At the observatory">
          {preferences.map(toggle)}
          {"reminders" in on && (
            <SettingsRow
              label="Remind me"
              htmlFor="settings-before"
              disabled={remindersOff}
            >
              <Select
                items={BEFORE}
                value={before}
                disabled={remindersOff}
                onValueChange={(value) => {
                  if (!value) return
                  setBefore(value)
                  onSettingChange?.("before", value)
                }}
              >
                <SelectTrigger id="settings-before" className="w-48">
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
            </SettingsRow>
          )}
          <SettingsRow label="Times">
            <ToggleGroup
              id="settings-clock"
              aria-label="Times"
              spacing={0}
              value={[clock]}
              onValueChange={(value) => {
                if (!value[0]) return
                setClock(value[0] as string)
                onSettingChange?.("clock", value[0] as string)
              }}
            >
              <ToggleGroupItem value="24">24-hour</ToggleGroupItem>
              <ToggleGroupItem value="12">12-hour</ToggleGroupItem>
            </ToggleGroup>
          </SettingsRow>
        </SettingsSection>

        <SettingsAppearance defaults={appearanceDefaults} />

        <SettingsSection title="Emails">{emails.map(toggle)}</SettingsSection>

        <CloseAccountSection
          hint="Your seats go back on sale and your membership ends today."
          note={closeNote}
          onClose={onCloseAccount}
        />
      </div>
    </div>
  )
}

export default Settings01
