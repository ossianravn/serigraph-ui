// The pages that have a share image, by slug, with the title lettered on it and a kicker in the capitals above.
// The layout asks `slugFor(pathname)` which image to name; pages not listed share the home page's.
import { COMPONENTS } from "@/site/docs/catalogue"
import { BLOCKS } from "@/site/docs/blocks/blocks"

export interface SharePage {
  slug: string
  title: string
  kicker: string
}

const PAGES: SharePage[] = [
  {
    slug: "home",
    title: "Serigraph",
    kicker: "A shadcn/ui kit in five colourways",
  },
  {
    slug: "specimen",
    title: "Specimen",
    kicker: "Colourways · surfaces · voices",
  },
  { slug: "letters", title: "Letters", kicker: "Display · Sans · Mono" },
  { slug: "press", title: "The Press", kicker: "Follies, seeded architecture" },
  { slug: "docs", title: "Components", kicker: "Serigraph" },
  { slug: "docs-blocks", title: "Blocks", kicker: "Whole pages from the kit" },
  { slug: "studio", title: "Studio", kicker: "Make a colourway" },
  {
    slug: "meridian",
    title: "Meridian",
    kicker: "An observatory, built with Serigraph",
  },
  { slug: "meridian-settings", title: "Settings", kicker: "Meridian" },
  { slug: "meridian-sign-in", title: "Sign in", kicker: "Meridian" },
  ...COMPONENTS.map(({ name, title, group }) => ({
    slug: `docs-components-${name}`,
    title,
    kicker: group ?? "Component",
  })),
  ...BLOCKS.map(({ name, title }) => ({
    slug: `docs-blocks-view-${name}`,
    title,
    kicker: "Block",
  })),
]

export const SHARE_PAGES = PAGES
const SLUGS = new Set(PAGES.map((p) => p.slug))

/** The share image's slug for a page's path: "/docs/components/button/" gives "docs-components-button". */
export function slugFor(pathname: string) {
  const slug = pathname.replace(/^\/+|\/+$/g, "").replace(/\//g, "-") || "home"
  return SLUGS.has(slug) ? slug : "home"
}
