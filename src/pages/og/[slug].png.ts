// Share images, drawn at build time: one PNG per page in SHARE_PAGES, rasterised with sharp from the SVG in
// src/site/og/render.ts.
import type { APIRoute } from "astro"
import sharp from "sharp"
import { SHARE_PAGES, type SharePage } from "@/site/og/pages"
import { shareImage } from "@/site/og/render"

export function getStaticPaths() {
  return SHARE_PAGES.map((page) => ({
    params: { slug: page.slug },
    props: page,
  }))
}

export const GET: APIRoute = async ({ props }) => {
  const { slug, title, kicker } = props as SharePage
  const png = await sharp(
    Buffer.from(shareImage({ title, kicker, seed: slug })),
  )
    .png({ compressionLevel: 9 })
    .toBuffer()
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  })
}
