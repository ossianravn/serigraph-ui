"use client"

// The Press: one folly at a time, its template, seed and colourway chosen beside it. Reroll draws a new seed; copy and
// download give the SVG with its colourway's colours written in, so it stands alone outside the page.
import { useMemo, useRef, useState } from "react"
import { folly, TEMPLATES, type Template } from "@/serigraph/follies"
import { APPEARANCE, type Colourway } from "@/serigraph/theme"

const NAMES: Record<Template, string> = {
  city: "City",
  window: "Window",
  medallion: "Medallion",
  band: "Band",
  arcade: "Arcade",
  doorway: "Doorway",
}
const title = (v: string) => v.charAt(0).toUpperCase() + v.slice(1)
const word = () => Math.random().toString(36).slice(2, 8)

/** The SVG with every colour role and mix resolved to the colour it shows in `host`, so it renders anywhere. */
function standalone(svg: string, host: HTMLElement) {
  const probe = document.createElement("span")
  host.appendChild(probe)
  const resolve = (value: string) => {
    probe.style.color = value
    return getComputedStyle(probe).color
  }
  const out = svg
    .replace(
      /color-mix\(in oklab, var\(--[\w-]+\) \d+%, var\(--[\w-]+\)\)/g,
      resolve,
    )
    .replace(/var\(--[\w-]+(?:, var\(--[\w-]+\))?\)/g, resolve)
  probe.remove()
  return out
}

export function Press() {
  const [template, setTemplate] = useState<Template>("city")
  const [seed, setSeed] = useState("serigraph")
  const [colourway, setColourway] = useState<Colourway>("sky")
  const [note, setNote] = useState("")
  const stage = useRef<HTMLDivElement>(null)
  const svg = useMemo(
    () => folly({ template, seed, label: `${NAMES[template]}, seed ${seed}` }),
    [template, seed],
  )

  const take = () => (stage.current ? standalone(svg, stage.current) : svg)
  const copy = async () => {
    await navigator.clipboard.writeText(take())
    setNote("Copied")
  }
  const download = () => {
    const url = URL.createObjectURL(
      new Blob([take()], { type: "image/svg+xml" }),
    )
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: `folly-${template}-${seed}.svg`,
    })
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="press">
      <div className="plane press-controls" data-tone="4">
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
                  onChange={() => setTemplate(t)}
                />
                <span>{NAMES[t]}</span>
              </label>
            ))}
          </div>
        </div>
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
              onChange={(e) => setSeed(e.target.value)}
            />
            <button
              type="button"
              className="press-button"
              onClick={() => (setSeed(word()), setNote(""))}
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
          <button type="button" className="press-button" onClick={copy}>
            Copy SVG
          </button>
          <button type="button" className="press-button" onClick={download}>
            Download
          </button>
          <span className="caps" role="status">
            {note}
          </span>
        </div>
      </div>
      <div
        ref={stage}
        className="canvas press-stage"
        data-colourway={colourway}
        data-template={template}
      >
        <div
          className="folly press-art"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </div>
  )
}
