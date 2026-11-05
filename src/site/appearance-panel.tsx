"use client"

// The specimen's appearance settings: a narrow column of rows, each label above its control. Colourways as
// swatches, on/off settings as switches, two choices as a segmented control. Site code; Phase 3's switch and toggle
// group replace these hand-rolled controls.
import { APPEARANCE, useAppearance, type Appearance } from "@/serigraph/theme"
import { siteAppearance } from "@/site/appearance"

const title = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

function Switch({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className="panel-switch"
      onClick={() => onChange(!checked)}
    >
      <span className="panel-knob" aria-hidden="true" />
    </button>
  )
}

export function AppearancePanel() {
  const [appearance, update] = useAppearance(siteAppearance)
  const set = (change: Partial<Appearance>) => update(change)
  return (
    <div className="plane panel" data-tone="4">
      <div className="panel-row">
        <span className="caps" id="appearance-colourway">
          Colourway
        </span>
        <div className="panel-inline">
          <div
            className="swatches"
            role="radiogroup"
            aria-labelledby="appearance-colourway"
          >
            {APPEARANCE.colourway.map((colourway) => (
              <label
                key={colourway}
                className="swatch"
                data-colourway={colourway}
                title={title(colourway)}
              >
                <input
                  className="sr-only"
                  type="radio"
                  name="colourway"
                  value={colourway}
                  checked={appearance.colourway === colourway}
                  onChange={() => set({ colourway })}
                  aria-label={title(colourway)}
                />
              </label>
            ))}
          </div>
          <span className="caps">{title(appearance.colourway)}</span>
        </div>
      </div>
      <div className="panel-row">
        <span className="caps" id="appearance-line">
          Line
        </span>
        <div
          className="segmented"
          role="radiogroup"
          aria-labelledby="appearance-line"
        >
          {APPEARANCE.line.map((line) => (
            <label key={line}>
              <input
                className="sr-only"
                type="radio"
                name="line"
                value={line}
                checked={appearance.line === line}
                onChange={() => set({ line })}
              />
              <span>{line} px</span>
            </label>
          ))}
        </div>
      </div>
      <div className="panel-row panel-row-inline">
        <span className="caps">Poster mat</span>
        <Switch
          label="Poster mat"
          checked={appearance.poster === "on"}
          onChange={(on) => set({ poster: on ? "on" : "off" })}
        />
      </div>
      <div className="panel-row panel-row-inline">
        <span className="caps">Paper grain</span>
        <Switch
          label="Paper grain"
          checked={appearance.grain === "on"}
          onChange={(on) => set({ grain: on ? "on" : "off" })}
        />
      </div>
    </div>
  )
}
