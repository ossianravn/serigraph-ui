"use client"

import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react"
import { cn } from "@/serigraph/lib/utils"
import {
  APPEARANCE,
  useAppearance,
  type Appearance,
  type Line,
} from "@/serigraph/theme"
import { Switch } from "@/serigraph/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/serigraph/ui/toggle-group"

// The appearance as controls: the colourways as round spot chips in the line (a radio group, the chosen one ringed
// and named beside them), poster and grain as switches and the line as a segmented control. Every change applies to
// <html> at once and is saved through useAppearance, so every island on the page re-inks with it.

export type ColourwaySwitcherRow = keyof typeof APPEARANCE

/** Every row, in reading order. */
export const COLOURWAY_SWITCHER_ROWS = Object.keys(
  APPEARANCE,
) as ColourwaySwitcherRow[]

/** Each setting's name and its options' names, for any screen that shows them. */
export const colourwaySwitcherLabels = {
  colourway: {
    label: "Colourway",
    options: {
      sky: "Sky",
      pistachio: "Pistachio",
      coral: "Coral",
      marigold: "Marigold",
      night: "Night",
    },
  },
  poster: { label: "Poster", options: { on: "On", off: "Off" } },
  line: { label: "Line", options: { "1.5": "1.5 px", "1": "1 px" } },
  grain: { label: "Grain", options: { on: "On", off: "Off" } },
} satisfies {
  [K in ColourwaySwitcherRow]: {
    label: string
    options: Record<Appearance[K], string>
  }
}

type ColourwaySwitcherProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  /** Which settings show, in this order. Pass `["colourway"]` for the swatches alone. */
  rows?: readonly ColourwaySwitcherRow[]
  /** Vertical: a narrow column, each name beside its control. Horizontal: one wrapping row, for a header. */
  orientation?: "vertical" | "horizontal"
  /** The defaults the page's appearanceScript uses, for the server render. */
  defaults?: Appearance
}

type Update = (change: Partial<Appearance>) => void

/** The colourway, poster mode, the line and the grain as compact controls that apply at once and are remembered. */
export function ColourwaySwitcher({
  rows = COLOURWAY_SWITCHER_ROWS,
  orientation = "vertical",
  defaults,
  className,
  ...props
}: ColourwaySwitcherProps) {
  const [appearance, update] = useAppearance(defaults)
  const id = useId()
  const compact = orientation === "horizontal"
  return (
    <div
      data-slot="colourway-switcher"
      data-orientation={orientation}
      className={cn(
        compact
          ? "flex flex-wrap items-center gap-x-line gap-y-tight"
          : "grid w-fit max-w-full grid-cols-[max-content_minmax(0,auto)] items-center gap-x-snug gap-y-snug",
        className,
      )}
      {...props}
    >
      {rows.map((row) => (
        <Row
          key={row}
          row={row}
          id={`${id}-${row}`}
          compact={compact}
          appearance={appearance}
          update={update}
        />
      ))}
    </div>
  )
}

function Row({
  row,
  id,
  compact,
  appearance,
  update,
}: {
  row: ColourwaySwitcherRow
  id: string
  compact: boolean
  appearance: Appearance
  update: Update
}) {
  const labelId = `${id}-label`
  const { label } = colourwaySwitcherLabels[row]
  const name =
    row === "poster" || row === "grain" ? (
      <label htmlFor={id} id={labelId} className="caps">
        {label}
      </label>
    ) : (
      // The swatches' name wraps under them in a narrow column, so this label stays level with the chips.
      <span
        id={labelId}
        className={cn(
          "caps",
          row === "colourway" && "flex h-7 items-center self-start",
        )}
      >
        {label}
      </span>
    )
  let control: ReactNode
  if (row === "colourway")
    control = (
      <Swatches
        name={id}
        labelId={labelId}
        value={appearance.colourway}
        update={update}
      />
    )
  else if (row === "line")
    control = (
      <ToggleGroup
        aria-labelledby={labelId}
        spacing={0}
        size={compact ? "sm" : "default"}
        value={[appearance.line]}
        onValueChange={(value) =>
          value[0] && update({ line: value[0] as Line })
        }
      >
        {APPEARANCE.line.map((line) => (
          <ToggleGroupItem key={line} value={line}>
            {colourwaySwitcherLabels.line.options[line]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    )
  else {
    const key = row
    control = (
      <Switch
        id={id}
        size={compact ? "sm" : "default"}
        checked={appearance[key] === "on"}
        onCheckedChange={(on) => update({ [key]: on ? "on" : "off" })}
      />
    )
  }
  return (
    <div
      data-slot="colourway-switcher-row"
      data-row={row}
      className={
        compact
          ? "flex items-center gap-tight"
          : "col-span-full grid grid-cols-subgrid items-center"
      }
    >
      {name}
      <div
        className={cn(
          "flex min-w-0 flex-wrap items-center gap-tight",
          row === "colourway" && "self-start",
        )}
      >
        {control}
      </div>
    </div>
  )
}

function Swatches({
  name,
  labelId,
  value,
  update,
}: {
  name: string
  labelId: string
  value: Appearance["colourway"]
  update: Update
}) {
  const names = colourwaySwitcherLabels.colourway.options
  return (
    <>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className="flex items-center gap-hair"
      >
        {APPEARANCE.colourway.map((colourway) => (
          <label
            key={colourway}
            data-slot="colourway-swatch"
            data-colourway={colourway}
            title={names[colourway]}
          >
            <input
              className="sr-only"
              type="radio"
              name={name}
              value={colourway}
              checked={value === colourway}
              onChange={() => update({ colourway })}
              aria-label={names[colourway]}
            />
          </label>
        ))}
      </div>
      {/* The chosen name, in a cell as wide as the longest, so the row never shifts as the choice changes. */}
      <span className="grid caps" aria-hidden="true">
        {APPEARANCE.colourway.map((colourway) => (
          <span
            key={colourway}
            className={cn(
              "col-start-1 row-start-1",
              colourway !== value && "invisible",
            )}
          >
            {names[colourway]}
          </span>
        ))}
      </span>
    </>
  )
}
