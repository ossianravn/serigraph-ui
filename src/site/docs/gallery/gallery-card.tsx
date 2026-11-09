import type { ComponentType } from "react"
import { DemoPreview, previewClaim, type DemoMeta } from "../demo-kit"
import { Scaled } from "./parts"
import { PREVIEWS, SCALE } from "./previews"

// One part on the Components index: a card in plane 2 inside the fine line, the part at rest above a rule, its title
// and the sentence on what it is for below, so each name sits inside the card it belongs to. The plate renders on the server from the part's own demo (its first example
// row), or from a preview made for the index where that row would not show the part (overlays open in a portal, only
// in the browser; some first rows are a whole page). The plate is a picture, not a control: inert and hidden from
// assistive technology, so the title's link, which covers the card, is the card's one target.

type DemoModule = { default: ComponentType; meta: DemoMeta }
const modules = import.meta.glob<DemoModule>("../demos/*.tsx", { eager: true })
const demos = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [
    path.replace(/^.*\/(.+)\.tsx$/, "$1"),
    mod,
  ]),
)

export function GalleryCard({ name }: { name: string }) {
  const demo = demos[name]
  if (!demo) return null
  const Preview = PREVIEWS[name] ?? demo.default
  const scale = PREVIEWS[name] ? undefined : SCALE[name]
  return (
    <article className="plane gallery-card" data-tone="plane-2">
      <div className="gallery-plate">
        <div aria-hidden="true" inert className="gallery-preview">
          <DemoPreview.Provider value={previewClaim()}>
            {scale ? (
              <Scaled by={scale}>
                <Preview />
              </Scaled>
            ) : (
              <Preview />
            )}
          </DemoPreview.Provider>
        </div>
      </div>
      <h3 className="gallery-title">
        <a href={`/docs/components/${name}`}>{demo.meta.title}</a>
      </h3>
      <p className="gallery-sentence">{demo.meta.description}</p>
    </article>
  )
}
