"use client"

import { useEffect, useRef, useState } from "react"
import { DownloadIcon } from "lucide-react"
import {
  useAppearance,
  type Colourway as SiteColourway,
} from "@/serigraph/theme"
import { Alert, AlertDescription, AlertTitle } from "@/serigraph/ui/alert"
import { Button } from "@/serigraph/ui/button"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/serigraph/ui/code-block"
import { Input } from "@/serigraph/ui/input"
import { useHighlightedCode } from "@/serigraph/ui/use-highlighted-code"
import { siteAppearance } from "@/site/appearance"
import { PASS, type Colourway, type Pair, type Preset } from "./colourway"
import { colourwayCss, download, slugOf } from "./export"

/** The colourway as CSS to paste after colourways.css. Copy and download wait until every pair reaches 4.5:1. */
export function ExportPanel({
  name,
  onName,
  colourway,
  pairs,
  preset,
}: {
  name: string
  onName: (name: string) => void
  colourway: Colourway
  pairs: Pair[]
  preset?: Preset
}) {
  const [appearance, update] = useAppearance(siteAppearance)
  const css = colourwayCss(name, colourway)
  // The highlighter (Shiki) loads only when the export comes near the window; until then the lines are plain ink.
  const box = useRef<HTMLElement>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = box.current
    if (!el || near) return
    const observer = new IntersectionObserver(
      ([seen]) => seen?.isIntersecting && setNear(true),
      { rootMargin: "400px 0px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [near])
  const file = `${slugOf(name)}.css`
  const failing = pairs.filter((p) => p.ratio < PASS)
  const site = preset?.builtIn ? (preset.id as SiteColourway) : undefined

  return (
    <section
      ref={box}
      id="studio-export"
      aria-labelledby="studio-export-title"
      className="studio-export"
    >
      <div className="studio-export-head">
        <h2 id="studio-export-title" className="caps studio-kicker">
          Export
        </h2>
        <label className="studio-name">
          <span className="caps">Name</span>
          <Input
            value={name}
            onChange={(e) => onName(e.target.value)}
            spellCheck={false}
            className="w-[12rem]"
          />
        </label>
        {site && (
          <Button
            variant="secondary"
            disabled={appearance.colourway === site}
            onClick={() => update({ colourway: site })}
          >
            {appearance.colourway === site
              ? "On this site"
              : "Use on this site"}
          </Button>
        )}
      </div>
      {failing.length > 0 && (
        <Alert variant="destructive" className="studio-failing">
          <AlertTitle>
            {failing.length === 1
              ? "One pair is under 4.5:1"
              : `${failing.length} pairs are under 4.5:1`}
          </AlertTitle>
          <AlertDescription>
            <ul>
              {failing.map((p) => (
                <li key={p.label}>
                  {p.label},{" "}
                  <span className="studio-ratio">{p.ratio.toFixed(2)}:1</span>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>{file}</CodeBlockTitle>
          <CodeBlockActions>
            <Button
              variant="ghost"
              size="xs"
              disabled={failing.length > 0}
              onClick={() => download(file, css)}
            >
              <DownloadIcon data-icon="inline-start" />
              Download
            </Button>
            <CodeBlockCopyButton value={css} disabled={failing.length > 0} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent lineNumbers>
          {near ? (
            <HighlightedLines code={css} />
          ) : (
            css
              .replace(/\n$/, "")
              .split("\n")
              .map((line, index) => (
                <CodeBlockLine key={index}>{line}</CodeBlockLine>
              ))
          )}
        </CodeBlockContent>
        <CodeBlockFooter>
          <span>
            Contrast here is flat; <code>npm run check:contrast</code> adds the
            grain.
          </span>
        </CodeBlockFooter>
      </CodeBlock>
    </section>
  )
}

function HighlightedLines({ code }: { code: string }) {
  const lines = useHighlightedCode(code, "css")
  return lines.map((line, index) => (
    <CodeBlockLine key={index}>{line}</CodeBlockLine>
  ))
}
