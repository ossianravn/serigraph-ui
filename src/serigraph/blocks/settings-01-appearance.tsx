"use client"

import {
  SettingsRow,
  SettingsSection,
} from "@/serigraph/blocks/settings-01-rows"
import {
  APPEARANCE,
  useAppearance,
  type Appearance,
  type Colourway,
} from "@/serigraph/theme"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/serigraph/ui/select"
import { Switch } from "@/serigraph/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/serigraph/ui/toggle-group"

// How the pages look, applied at once and kept for the next visit: the colourway (five, so a select), the paper mat,
// the line and the grain. Every frame and tab of the site re-inks when the choice is saved.

const COLOURWAYS = APPEARANCE.colourway.map((value) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
}))

/** A small dot in a colourway's canvas colour, beside its name. */
const Dot = ({ colourway }: { colourway: Colourway }) => (
  <span
    data-colourway={colourway}
    aria-hidden="true"
    className="size-3.5 shrink-0 rounded-full border-(length:--line) border-ink bg-canvas"
  />
)

export function SettingsAppearance({ defaults }: { defaults?: Appearance }) {
  const [appearance, setAppearance] = useAppearance(defaults)
  return (
    <SettingsSection title="Appearance">
      <SettingsRow
        label="Colourway"
        htmlFor="settings-colourway"
        hint="Which spot colours the pages print in. Night is the dark one."
      >
        <Select
          items={COLOURWAYS}
          value={appearance.colourway}
          onValueChange={(value) =>
            value && setAppearance({ colourway: value as Colourway })
          }
        >
          <SelectTrigger id="settings-colourway" className="w-40">
            <Dot colourway={appearance.colourway} />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COLOURWAYS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                <Dot colourway={value} />
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingsRow>
      <SettingsRow
        label="Poster"
        htmlFor="settings-poster"
        hint="The page in a paper mat, like a print. Off, it runs to the window's edges."
        hintId="settings-poster-hint"
        beside
      >
        <Switch
          id="settings-poster"
          aria-describedby="settings-poster-hint"
          checked={appearance.poster === "on"}
          onCheckedChange={(on) => setAppearance({ poster: on ? "on" : "off" })}
        />
      </SettingsRow>
      <SettingsRow label="Line" hint="The one ink line.">
        <ToggleGroup
          id="settings-line"
          aria-label="Line"
          spacing={0}
          value={[appearance.line]}
          onValueChange={(value) =>
            value[0] && setAppearance({ line: value[0] as Appearance["line"] })
          }
        >
          <ToggleGroupItem value="1.5">1.5 px</ToggleGroupItem>
          <ToggleGroupItem value="1">1 px</ToggleGroupItem>
        </ToggleGroup>
      </SettingsRow>
      <SettingsRow
        label="Grain"
        htmlFor="settings-grain"
        hint="The printed texture on every surface."
        hintId="settings-grain-hint"
        beside
      >
        <Switch
          id="settings-grain"
          aria-describedby="settings-grain-hint"
          checked={appearance.grain === "on"}
          onCheckedChange={(on) => setAppearance({ grain: on ? "on" : "off" })}
        />
      </SettingsRow>
    </SettingsSection>
  )
}
