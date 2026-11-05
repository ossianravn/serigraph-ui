import { PRESETS, type Colourway, type Preset } from "./colourway"

/** A colourway in three round chips: the canvas, its plane and its action, overlapping like spots of ink. */
export function PresetChips({ colourway }: { colourway: Colourway }) {
  const { canvas, plane, action } = colourway.roles
  return (
    <span className="studio-chips" aria-hidden="true">
      {[canvas, plane, action].map((spot, i) => (
        <span
          key={i}
          className="studio-chip"
          style={{ background: `var(--${spot})` }}
        />
      ))}
    </span>
  )
}

/** Every preset as a pill; the one the colourway matches is pressed. */
export function PresetPicker({
  current,
  onPick,
}: {
  current?: Preset
  onPick: (preset: Preset) => void
}) {
  return (
    <section aria-labelledby="studio-presets" className="studio-presets">
      <h2 id="studio-presets" className="caps studio-kicker">
        Presets
      </h2>
      <ul className="studio-preset-list">
        {PRESETS.map((preset) => (
          <li key={preset.id}>
            <button
              type="button"
              className="studio-preset caps"
              aria-pressed={preset === current}
              onClick={() => onPick(preset)}
            >
              <PresetChips colourway={preset.colourway} />
              {preset.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
