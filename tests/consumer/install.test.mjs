// The registry install contract: Serigraph items install through the real shadcn CLI into two fresh apps, arrive
// byte-identical to the kit's source, and each app then type-checks and builds (ported from Fineliner's install test).
//   ./fixture       Vite + React + TypeScript, its package-lock committed
//   ./fixture-next  Next.js App Router with rsc: true. Its page is a server component that imports the kit's parts
//                   directly, so a kit file that uses hooks or browser APIs without "use client" fails next build,
//                   which Vite cannot catch.
//
// It runs offline. The registry is built into a temporary folder and served on a local port, npm installs from the
// cache the repository's own install filled, and every other request goes to that server as a proxy, which refuses
// it. The fixture's components.json leaves tailwind.baseColor empty for this reason: with a base color, shadcn add
// downloads ui.shadcn.com/r/colors/<color>.json, which Serigraph's files do not use.
//
// The fixtures' own packages (Vite, Next.js and its SWC binary, TypeScript, React's types) are not the repository's,
// so the cache needs them added once, online: copy each fixture's package.json into an empty folder outside the
// repository and run npm install there.
//
//   npm run test:consumer
import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { test } from "node:test"
import {
  assertKitMatchesSource,
  offline,
  repo,
  run,
  serve,
} from "./helpers.mjs"

const shadcn = path.join(repo, "node_modules/shadcn/dist/index.js")

// The items whose parts fixture/src/App.tsx imports. base and follies arrive as their item dependencies, which
// exercises the --base dependency URLs and fails the type-check if an item leaves out one it imports. Not the
// serigraph umbrella: it lists every item, so it would hide a missing dependency.
const items = [
  "folly",
  "lettering",
  "letters",
  "motif",
  "badge",
  "button",
  "card",
  "checkbox",
  "input",
  "label",
  "switch",
  "tabs",
  "avatar",
  "dialog",
  "dropdown-menu",
  "field",
  "select",
  "slider",
  "toggle-group",
  "tooltip",
  "calendar",
  "chart",
  "code-block",
  "command",
  "empty",
  "sidebar",
  "sonner",
  "table",
  "hero-01",
  "sign-in-01",
  "colourway-switcher",
  "ordinal-date",
  "ticket-stub",
]

// Builds and serves the registry, copies the fixture into a temporary app, installs it offline, adds the items and
// checks the installed kit against the source. Returns the app folder and the environment for its build commands.
async function install(t, fixture, extraEnv = {}) {
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "serigraph-consumer-"))
  const registry = path.join(scratch, "registry")
  const app = path.join(scratch, "app")
  const server = await serve(registry)
  t.after(() => {
    server.close()
    fs.rmSync(scratch, { recursive: true, force: true, maxRetries: 5 })
  })
  const origin = `http://127.0.0.1:${server.address().port}`
  const env = { ...offline(origin), ...extraEnv }

  await run(
    env,
    repo,
    path.join(repo, "tools/registry/build.mjs"),
    "--out",
    registry,
    "--base",
    `${origin}/r`,
  )
  fs.cpSync(path.join(repo, "tests/consumer", fixture), app, {
    recursive: true,
  })
  await run(env, app, "npm", "install")
  const urls = items.map((name) => `${origin}/r/${name}.json`)
  await run(env, app, shadcn, "add", ...urls, "-y")
  assertKitMatchesSource(app)

  // base and follies came as dependencies, with the reading face's package and cn.
  for (const dir of ["styles", "follies", "theme"])
    assert.ok(
      fs.existsSync(path.join(app, "src/serigraph", dir)),
      `src/serigraph/${dir} was not installed`,
    )
  const manifest = JSON.parse(
    fs.readFileSync(path.join(app, "package.json"), "utf8"),
  )
  assert.ok(manifest.dependencies?.cn, "cn was not added to dependencies")
  assert.ok(
    manifest.devDependencies?.["@fontsource-variable/archivo"],
    "the reading face was not added to devDependencies",
  )
  return { app, env, bin: (file) => path.join(app, "node_modules", file) }
}

test(
  "registry items install into a fresh Vite app that type-checks and builds",
  { timeout: 15 * 60_000 },
  async (t) => {
    const { app, env, bin } = await install(t, "fixture")
    await run(env, app, bin("typescript/bin/tsc"), "-b")
    await run(env, app, bin("vite/bin/vite.js"), "build")
    assert.ok(
      fs.existsSync(path.join(app, "dist/index.html")),
      "vite build wrote no dist/index.html",
    )
    // The fonts travel inside the stylesheet, so the built CSS carries them.
    const css = fs
      .readdirSync(path.join(app, "dist/assets"))
      .filter((f) => f.endsWith(".css"))
      .map((f) => fs.readFileSync(path.join(app, "dist/assets", f), "utf8"))
      .join("")
    assert.match(css, /font-family:\s*"?Serigraph Display/u)
    assert.match(css, /data:font\/woff2;base64,/u)
  },
)

test(
  "registry items install into a fresh Next.js app whose server page builds",
  { timeout: 15 * 60_000 },
  async (t) => {
    const { app, env, bin } = await install(t, "fixture-next", {
      NEXT_TELEMETRY_DISABLED: "1",
    })
    // next build type-checks the app (and writes next-env.d.ts) before it bundles the server and client graphs.
    await run(env, app, bin("next/dist/bin/next"), "build")
    assert.ok(
      fs.existsSync(path.join(app, ".next/BUILD_ID")),
      "next build wrote no .next/BUILD_ID",
    )
  },
)
