// What the Press hands over: the SVG with its colourway's colours written in, so it stands alone outside the page, as
// a copy or a file.

/** The SVG with every colour role and mix resolved to the colour it shows in `host`, so it renders anywhere. */
export function standalone(svg: string, host: HTMLElement) {
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

/** Saves `svg` as a file named `name`. */
export function download(svg: string, name: string) {
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }))
  const a = Object.assign(document.createElement("a"), {
    href: url,
    download: name,
  })
  a.click()
  URL.revokeObjectURL(url)
}

/** A short random word for a reroll. The page may use Math.random; the engine never does. */
export const word = () => Math.random().toString(36).slice(2, 8)

/** The Press's state as it reads from and writes to the address, so a drawing can be linked to. */
export interface PressState {
  mode: "scene" | "object"
  template: string
  object: string
  seed: string
}

export function readAddress(
  templates: string[],
  objects: string[],
): Partial<PressState> {
  const q = new URLSearchParams(window.location.search)
  const object = q.get("object") ?? ""
  const template = q.get("template") ?? ""
  const seed = q.get("seed") ?? undefined
  if (objects.includes(object)) return { mode: "object", object, seed }
  if (templates.includes(template)) return { mode: "scene", template, seed }
  return seed ? { seed } : {}
}

export function writeAddress({ mode, template, object, seed }: PressState) {
  const q = new URLSearchParams(
    mode === "object" ? { object, seed } : { template, seed },
  )
  window.history.replaceState(null, "", `?${q}`)
}
