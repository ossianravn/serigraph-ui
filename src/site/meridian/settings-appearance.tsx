import { FieldGroup, FieldLegend, FieldSet } from "@/serigraph/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/serigraph/ui/select"
import { Switch } from "@/serigraph/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/serigraph/ui/toggle-group"
import { APPEARANCE, useAppearance, type Colourway } from "@/serigraph/theme"
import { SettingRow } from "./setting-row"

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

// How Meridian looks, applied at once and kept for the next visit: the colourway (five, so a select), the paper mat,
// the line and the grain.
export function SettingsAppearance() {
  const [appearance, setAppearance] = useAppearance()
  return (
    <FieldSet>
      <FieldLegend>Appearance</FieldLegend>
      <FieldGroup>
        <SettingRow
          id="set-colourway"
          label="Colourway"
          description="Which spot colours the pages print in. Night is the dark one."
        >
          <Select
            items={COLOURWAYS}
            value={appearance.colourway}
            onValueChange={(value) =>
              value && setAppearance({ colourway: value as Colourway })
            }
          >
            <SelectTrigger id="set-colourway" className="w-40">
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
        </SettingRow>
        <SettingRow
          id="set-poster"
          label="Poster"
          description="The page in a paper mat, like a print. Off, it runs to the window's edges."
        >
          <Switch
            id="set-poster"
            checked={appearance.poster === "on"}
            onCheckedChange={(on) =>
              setAppearance({ poster: on ? "on" : "off" })
            }
          />
        </SettingRow>
        <SettingRow id="set-line" label="Line" description="The one ink line.">
          <ToggleGroup
            id="set-line"
            aria-label="Line"
            spacing={0}
            value={[appearance.line]}
            onValueChange={(value) =>
              value[0] && setAppearance({ line: value[0] as "1.5" | "1" })
            }
          >
            <ToggleGroupItem value="1.5">1.5 px</ToggleGroupItem>
            <ToggleGroupItem value="1">1 px</ToggleGroupItem>
          </ToggleGroup>
        </SettingRow>
        <SettingRow
          id="set-grain"
          label="Grain"
          description="The printed texture on every surface."
        >
          <Switch
            id="set-grain"
            checked={appearance.grain === "on"}
            onCheckedChange={(on) =>
              setAppearance({ grain: on ? "on" : "off" })
            }
          />
        </SettingRow>
      </FieldGroup>
    </FieldSet>
  )
}
