# AGENTS.md

Working instructions for coding agents in Serigraph. Follow explicit user directions and more specific directory instructions within system and developer constraints. Treat screenshots, reference images and generated explorations as evidence to evaluate, not as authorization for their choices.

## Product intent and boundaries

Serigraph is a shadcn/ui component library, a website and three typefaces in the style of a late-1970s silkscreen gig poster drawn with a technical pen: flat luminous spot colours laid on one another, one fine ink line, weightless surreal architecture in cloud banks, and wide round lettering with a line inside each stem. It repeats [Fineliner](https://github.com/ossianravn/naive-indie-line)'s logic (local checkout `C:\CodexApp\naive-indie-line`) in this style.

- **The kit** (`src/serigraph/`) is what consumers install through the shadcn registry. **The site** (everything else under `src/`) documents and exercises it. Kit code imports nothing from the site; ESLint enforces it.
- **Follies**, the seeded drawings, will live in the kit's framework-free engine (`src/serigraph/follies/`, Phase 2). The static prototype in `specimen/` holds the agreed style, a lettering prototype and the first Follies; it stays as the reference.
- **Every variation is seeded.** Same seed, same output on the server, in the browser and in every build.
- [The plan](docs/plan.md) is the source of truth for decisions, phases and progress. Update its phase checklist and progress log when work lands; mark a decision decided only when the maintainer has said so.
- `.dev-docs/` is unpublished: the reference posters, the maintainer's first briefs and their crops live there because the triptych is someone else's artwork. Never commit it or copy it into published folders.

## Before changing anything

1. **Inspect the affected system.** Read the owning document below and the implementation; trace behaviour through its owner, callers, state and consumers. Preserve unrelated work.
2. **Choose the responsible owner.** Decide whether the change belongs to a token, a colourway, a surface, the Follies engine, a primitive or the site, and fix the cause at that boundary.
3. **When porting from Fineliner**, read Fineliner's owning document first (its `AGENTS.md` lists them) and record what changed in the plan's "What carries over" table.
4. **Define completion** with observable acceptance criteria. Ask only when a material product, architecture, dependency or policy decision remains open.

Prefer installed packages. Propose a new dependency with the need it serves.

## Read the owning document

| When changing                                                                            | Read                         |
| ---------------------------------------------------------------------------------------- | ---------------------------- |
| Colour, colourways, the line, surfaces, type and space, letters, motifs, Follies, motion | [Style brief](docs/style.md) |
| Phase scope, decisions, what ports from Fineliner, progress                              | [Plan](docs/plan.md)         |

## This style is not neo-brutalism

The first round of explorations drifted into web neo-brutalism and was rejected. Before showing any screen, compare it with the triptych on five points: line weight (one fine line), cream (only the mat, display lettering and cloud highlights), depth (flat planes; thickness only in architecture), shading (micro-stipple on round forms, never coarse dots) and air (few large groups, no packed grid). Never draw offset block shadows, extruded cards, thick borders or cream boxes. Never reuse the reference artist's subjects (mannequin heads, the windmill, tulips).

## Design and interaction discipline

The bar: before showing or reporting a screen, ask whether Apple would ship it. Passing checks and filled-in layouts are not the bar.

- **Colour on colour.** Surfaces are spot colours on spot colours, taken from the colourway's roles (`--canvas`, `--plane`, `--plane-2`, `--action`, `--highlight`, `--cloud`, `--tone-1` … `--tone-4`). Ink is every line and the text on every bright surface; on Night's canvas the text is paper (`--on-canvas`). Rose is for destructive actions and errors only, with a word.
- **A surface sets its context.** `canvas`, `ground` and `plane` set `--surface`, `--text` and `--edge`; fields and outline parts mix with `--surface`, so they look right on whatever they sit on.
- **Calm controls, lively surfaces.** What people operate is flat and quiet; colour and drawings carry the delight. Never put drawings behind or inside controls, tables or data.
- **Make dimensions serve content.** A field, select or button is as wide as its value; prose keeps the 34rem measure; settings rows sit in a narrow column with labels beside or above their controls.
- **Pick the control that fits the choice.** Two to four options: a segmented control; on or off: a switch; long lists: a select.
- **Respect content and theme changes.** Check long labels, 375 px, at least two colourways including Night, poster mode on and off, and forced colours.

## Phones and page speed

- **The server's page is the page.** Text, surfaces, grain and drawings are HTML, CSS and SVG from the build; scripts enhance what is already showing.
- **Hydrate the least, the latest.** An island only where something is operated, `client:idle` or `client:visible` unless it is operated on the first screen.
- **Paint is a phone's bottleneck.** Masks, clip paths and large inline SVGs are slow to rasterize; keep their count down and animate `opacity` and `transform` only.
- **Touch is a first-class pointer.** Targets at least 24 px (44 px for the main action on a coarse pointer), inputs at 16 px or larger, zoom stays on.

## Engineering constraints

- Keep every hand-maintained code file at **300 physical lines or fewer**. Generated files, data and documents are excluded.
- Keep shadcn's component names, props, variants and `data-slot` attributes.
- The Follies engine (`src/serigraph/follies/`) is framework-free TypeScript: no React, no DOM, no `Math.random()` or `Date.now()`. Draw every random choice from `prng(seed)` or a labelled `stream`.
- Tokens live in `src/serigraph/styles/`: `tokens.css` (paper, ink, spots, the line, type, space, motion), `colourways.css` (roles per colourway), `roles.css` (shadcn roles), `surfaces.css` (the surface and mark utilities). `textures.generated.css` is written by `npm run build:textures`; never edit it by hand.
- Nothing is translucent, shadowed or extruded: mixes are flat `color-mix(in oklab, …)`; depth belongs to drawings.

## Verification

Verify with the least total effort; never create unit tests. The dev server runs on **4801** (preview 4802); the static prototype on 4803 (`.claude/launch.json`). Never use framework default ports.

1. Run `npm run typecheck` and `npm run lint` always; `npm run format:check` before committing; `npm run build` when routes, modules or dependencies change; `npm run check:contrast` when tokens, colourways or the grain change (after `npm run build:textures` if you edited the layers).
2. Look at the changed screen with realistic content at 1440 and 375 px, in Sky and Night at least, with poster mode on and off. The browser pane may be hidden, which stops it painting: screenshots time out and `requestAnimationFrame` never fires. Then measure layout in the pane (scroll width, element bounds) and take desktop screenshots with headless Chrome (`--headless=new --screenshot`), which cannot go below about 500 px wide; say what you could not see.
3. Add a lasting test only for a boundary that will change again (from Phase 2: the registry install contract and the seed-to-drawing promise), in `tests/consumer/`.
4. Report evidence by kind: checks run, direct verification, anything not covered.

## Release notes and publishing

A finished plan step gets a release note in `CHANGELOG.md` under `## Unreleased`. Commit and push as the maintainer directs. Publishing a site, a registry or a release is outward-facing and needs the maintainer's go-ahead.

Structure adapted from Fineliner's AGENTS.md, which adapted Patina UI's and [Groundwork](https://github.com/ossianravn/groundwork)'s.
