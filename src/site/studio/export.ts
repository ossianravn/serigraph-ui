// A colourway as CSS in colourways.css's own shape, and the inline custom properties the preview prints with.
import type { CSSProperties } from "react"
import { ROLES, type Colourway } from "./colourway"

export const slugOf = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "custom"

const DRAWING_START = "structure"

/** `[data-colourway="<slug>"] { --canvas: var(--sky); … }`, ready to paste after colourways.css. */
export function colourwayCss(name: string, { roles, onCanvas }: Colourway) {
  const slug = slugOf(name)
  const lines = ROLES.flatMap(({ key }) => [
    ...(key === DRAWING_START ? ["  /* Drawing roles (Follies). */"] : []),
    `  --${key}: var(--${roles[key]});`,
    ...(key === "canvas" ? [`  --on-canvas: var(--${onCanvas});`] : []),
  ])
  return [
    `/* ${name.trim() || "Custom"}: paste after colourways.css. */`,
    `[data-colourway="${slug}"] {`,
    ...lines,
    "}",
    "",
  ].join("\n")
}

/** The roles as inline custom properties, so a region prints in the colourway without touching the page. */
export function colourwayStyle({ roles, onCanvas }: Colourway) {
  const style: Record<string, string> = { "--on-canvas": `var(--${onCanvas})` }
  for (const { key } of ROLES) style[`--${key}`] = `var(--${roles[key]})`
  return style as CSSProperties
}

export function download(file: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/css" }))
  const a = Object.assign(document.createElement("a"), {
    href: url,
    download: file,
  })
  a.click()
  URL.revokeObjectURL(url)
}
