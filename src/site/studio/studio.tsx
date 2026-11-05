"use client"

// The colourway studio: presets across the top; the roles in a narrow column beside a live preview (below it on
// phones); the CSS to take away. The preview carries the colourway on its own region, so the page keeps the site's.
import { useMemo, useState } from "react"
import {
  pairs as pairsOf,
  PRESETS,
  same,
  textFor,
  type Colourway,
} from "./colourway"
import { ExportPanel } from "./export-panel"
import { PresetPicker } from "./preset-picker"
import { Preview } from "./preview"
import { RoleList } from "./role-list"

const FIRST = PRESETS[0]!

export function Studio() {
  const [colourway, setColourway] = useState<Colourway>(FIRST.colourway)
  const [name, setName] = useState<string | null>(null)
  const preset = PRESETS.find((p) => same(p.colourway, colourway))
  const pairs = useMemo(() => pairsOf(colourway), [colourway])

  return (
    <div className="studio">
      <PresetPicker
        current={preset}
        onPick={(next) => {
          setColourway(next.colourway)
          setName(null)
        }}
      />
      <div className="studio-desk">
        <aside
          aria-labelledby="studio-roles"
          className="plane studio-panel"
          data-tone="4"
        >
          <h2 id="studio-roles" className="sr-only">
            Roles
          </h2>
          <RoleList
            colourway={colourway}
            pairs={pairs}
            onRole={(role, pigment) =>
              setColourway((c) => ({
                roles: { ...c.roles, [role]: pigment },
                onCanvas: role === "canvas" ? textFor(pigment) : c.onCanvas,
              }))
            }
            onCanvasText={(onCanvas) =>
              setColourway((c) => ({ ...c, onCanvas }))
            }
          />
        </aside>
        <Preview colourway={colourway} />
      </div>
      <ExportPanel
        name={name ?? preset?.name ?? "Custom"}
        onName={setName}
        colourway={colourway}
        pairs={pairs}
        preset={preset}
      />
    </div>
  )
}
