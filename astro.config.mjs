// @ts-check
import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  // Project ports rather than Astro's defaults (4321 and 4322), so Serigraph never collides with another project.
  server: ({ command }) => ({
    host: "127.0.0.1",
    port: command === "preview" ? 4802 : 4801,
  }),
  trailingSlash: "never",
  build: { format: "directory" },
  integrations: [react()],
  devToolbar: { enabled: false },
  vite: { plugins: [tailwindcss()] },
})
