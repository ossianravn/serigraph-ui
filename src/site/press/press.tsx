"use client"

// The Press: one drawing at a time, a scene from a template or one object from the library, with its seed and
// colourway beside it. Reroll draws a new seed; an object also shows its neighbouring seeds. The address keeps what is
// drawn (?object=kite&seed=…), so the library's drawings open here. Copy and download give the SVG with its colourway's
// colours written in; Copy code gives the line that draws it in a project.
import { useEffect, useMemo, useRef, useState } from "react"
import {
  COLLECTIONS,
  drawing,
  folly,
  OBJECTS,
  TEMPLATES,
  type Template,
} from "@/serigraph/follies"
import { APPEARANCE, type Colourway } from "@/serigraph/theme"
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/serigraph/ui/native-select"
import { ToggleGroup, ToggleGroupItem } from "@/serigraph/ui/toggle-group"
import { Neighbours } from "./press-neighbours"
import {
  download,
  readAddress,
  standalone,
  word,
  writeAddress,
  type PressState,
} from "./press-take"

const NAMES: Record<Template, string> = {
  city: "City",
  window: "Window",
  medallion: "Medallion",
  band: "Band",
  arcade: "Arcade",
  doorway: "Doorway",
  procession: "Procession",
  skyline: "Skyline",
  observatory: "Observatory",
  stage: "Stage",
}
const title = (v: string) => v.charAt(0).toUpperCase() + v.slice(1)
const label = (name: string) => title(OBJECTS[name]?.title ?? name)

export function Press() {
  const [state, setState] = useState<PressState>({
    mode: "scene",
    template: "city",
    object: "spiral-stair",
    seed: "serigraph",
  })
  const [colourway, setColourway] = useState<Colourway>("sky")
  const [note, setNote] = useState("")
  const stage = useRef<HTMLDivElement>(null)
  const { mode, template, object, seed } = state
  const set = (next: Partial<PressState>) => {
    setState((s) => ({ ...s, ...next }))
    setNote("")
  }

  // The address picks what is drawn on arrival (the page hides the drawing until then), and keeps up after.
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const arrived = readAddress(Object.keys(TEMPLATES), Object.keys(OBJECTS))
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read once after hydration, so the server's page and the first render match
    setState((s) => ({ ...s, ...arrived }))
    setReady(true)
    document.documentElement.classList.remove("press-pending")
  }, [])
  useEffect(() => {
    if (ready) writeAddress(state)
  }, [ready, state])

  const name = mode === "object" ? label(object) : NAMES[template as Template]
  const svg = useMemo(
    () =>
      mode === "object"
        ? drawing({ object, seed, label: `${name}, seed ${seed}` })
        : folly({
            template: template as Template,
            seed,
            label: `${name}, seed ${seed}`,
          }),
    [mode, template, object, seed, name],
  )
  const code =
    mode === "object"
      ? `<Drawing object="${object}" seed="${seed}" />`
      : `<Folly template="${template}" seed="${seed}" />`

  const take = () => (stage.current ? standalone(svg, stage.current) : svg)
  const copy = async (text: string, done: string) => {
    await navigator.clipboard.writeText(text)
    setNote(done)
  }
  const file = `${mode === "object" ? object : `folly-${template}`}-${seed}.svg`

  return (
    <div className="press-layout">
      <div className="plane press-controls" data-tone="4">
        <div className="panel-row">
          <span className="caps" id="press-mode">
            Draw
          </span>
          <ToggleGroup
            aria-labelledby="press-mode"
            spacing={0}
            size="sm"
            value={[mode]}
            onValueChange={(v) =>
              v[0] && set({ mode: v[0] as PressState["mode"] })
            }
          >
            <ToggleGroupItem value="scene">Scene</ToggleGroupItem>
            <ToggleGroupItem value="object">Object</ToggleGroupItem>
          </ToggleGroup>
        </div>
        {mode === "scene" ? (
          <div className="panel-row">
            <span className="caps" id="press-template">
              Template
            </span>
            <div
              className="press-templates"
              role="radiogroup"
              aria-labelledby="press-template"
            >
              {(Object.keys(TEMPLATES) as Template[]).map((t) => (
                <label key={t} className="press-chip">
                  <input
                    className="sr-only"
                    type="radio"
                    name="template"
                    checked={t === template}
                    onChange={() => set({ template: t })}
                  />
                  <span>{NAMES[t]}</span>
                </label>
              ))}
            </div>
          </div>
        ) : (
          <div className="panel-row">
            <label className="caps" htmlFor="press-object">
              Object
            </label>
            <NativeSelect
              id="press-object"
              className="press-select"
              value={object}
              onChange={(e) => set({ object: e.target.value })}
            >
              {COLLECTIONS.map((c) => (
                <NativeSelectOptGroup key={c.name} label={c.title}>
                  {c.things.map((t) => (
                    <NativeSelectOption key={t.name} value={t.name}>
                      {label(t.name)}
                    </NativeSelectOption>
                  ))}
                </NativeSelectOptGroup>
              ))}
            </NativeSelect>
          </div>
        )}
        <div className="panel-row">
          <label className="caps" htmlFor="press-seed">
            Seed
          </label>
          <div className="press-seed">
            <input
              id="press-seed"
              className="field-fill press-input"
              value={seed}
              spellCheck={false}
              onChange={(e) => set({ seed: e.target.value })}
            />
            <button
              type="button"
              className="press-button"
              onClick={() => set({ seed: word() })}
            >
              Reroll
            </button>
          </div>
        </div>
        <div className="panel-row">
          <span className="caps" id="press-colourway">
            Colourway
          </span>
          <div className="panel-inline">
            <div
              className="swatches"
              role="radiogroup"
              aria-labelledby="press-colourway"
            >
              {APPEARANCE.colourway.map((c) => (
                <label
                  key={c}
                  className="swatch"
                  data-colourway={c}
                  title={title(c)}
                >
                  <input
                    className="sr-only"
                    type="radio"
                    name="press-colourway"
                    checked={c === colourway}
                    onChange={() => setColourway(c)}
                    aria-label={title(c)}
                  />
                </label>
              ))}
            </div>
            <span className="caps">{title(colourway)}</span>
          </div>
        </div>
        <div className="panel-row press-actions">
          <button
            type="button"
            className="press-button"
            onClick={() => copy(take(), "SVG copied")}
          >
            Copy SVG
          </button>
          <button
            type="button"
            className="press-button"
            onClick={() => copy(code, "Code copied")}
          >
            Copy code
          </button>
          <button
            type="button"
            className="press-button"
            onClick={() => download(take(), file)}
          >
            Download
          </button>
          <span className="caps press-note" role="status">
            {note}
          </span>
        </div>
      </div>
      <div className="press-main">
        <div
          ref={stage}
          className="canvas press-stage"
          data-colourway={colourway}
          data-template={mode === "object" ? "object" : template}
        >
          <div
            className="folly press-art"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
        {mode === "object" && (
          <Neighbours
            object={object}
            seed={seed}
            pick={(s) => set({ seed: s })}
          />
        )}
      </div>
    </div>
  )
}
