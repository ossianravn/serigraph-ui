// The seed-to-drawing promise: the same seed draws the same folly, in every run and every build. A drawing whose
// SVG changes on purpose updates its snapshot: UPDATE=1 npm run test:seeds. One of the plan's lasting tests (L8).
import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import fs from "node:fs"
import { test } from "node:test"
import { createJiti } from "jiti"

const jiti = createJiti(import.meta.url)
const { drawing, folly, motif, MOTIFS, OBJECTS, TEMPLATES } = await jiti.import(
  "../src/serigraph/follies/index.ts",
)
const SEEDS = ["serigraph", "meridian", "terrace", "1975", "ada"]
const file = new URL("./follies.snapshots.json", import.meta.url)
const hash = (s) => createHash("sha256").update(s).digest("hex").slice(0, 16)

const now = Object.fromEntries([
  ...Object.keys(TEMPLATES).flatMap((template) =>
    SEEDS.map((seed) => [
      `${template}:${seed}`,
      hash(folly({ template, seed })),
    ]),
  ),
  ...Object.keys(MOTIFS).flatMap((kind) =>
    SEEDS.map((seed) => [`motif-${kind}:${seed}`, hash(motif({ kind, seed }))]),
  ),
  // Every object in the library, from two seeds.
  ...Object.keys(OBJECTS).flatMap((object) =>
    SEEDS.slice(0, 2).map((seed) => [
      `object-${object}:${seed}`,
      hash(drawing({ object, seed })),
    ]),
  ),
])

if (process.env.UPDATE || !fs.existsSync(file))
  fs.writeFileSync(file, `${JSON.stringify(now, null, 2)}\n`)

test("the same seed draws the same folly twice", () => {
  for (const template of Object.keys(TEMPLATES))
    assert.equal(
      folly({ template, seed: "twice" }),
      folly({ template, seed: "twice" }),
      template,
    )
  for (const kind of Object.keys(MOTIFS))
    assert.equal(motif({ kind, seed: "twice" }), motif({ kind, seed: "twice" }))
  for (const object of Object.keys(OBJECTS))
    assert.equal(
      drawing({ object, seed: "twice" }),
      drawing({ object, seed: "twice" }),
      object,
    )
})

test("every folly matches its snapshot", () => {
  const saved = JSON.parse(fs.readFileSync(file, "utf8"))
  assert.deepEqual(now, saved)
})

test("different seeds draw different follies", () => {
  for (const template of ["city", "window", "band"])
    assert.notEqual(
      now[`${template}:serigraph`],
      now[`${template}:meridian`],
      template,
    )
})
