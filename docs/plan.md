# Plan

Status: Phase 4 (data, navigation and the rest of parity) done, 2026-11-05; Phase 5 (extras, blocks, the home page and the colourway studio) is next. The style was agreed in Phase S. This file is the progress record: update a phase's checklist and the [log](#progress-log) as work lands.

## What this is

Serigraph (working name) is a shadcn/ui component library, a website and three typefaces in the style of a late-1970s silkscreen gig poster drawn with a technical pen: flat luminous spot colours laid on one another, one fine ink line, weightless surreal architecture in cloud banks, and wide round lettering with a line inside each stem. Its signature is **Follies**: seeded drawings of surreal architecture that reprint in every colourway.

It repeats [Fineliner](https://github.com/ossianravn/naive-indie-line) (`C:\CodexApp\naive-indie-line`), which repeated [Patina UI](https://github.com/ossianravn/patina-ui). Their **logic** carries over: the kit/site split, shadcn parity on Base UI, seeded drawings, generated paper, the appearance runtime, our own fonts built in the repository, the registry and its install tests, the docs site, a playground, a theme studio and a demo product. Their **look** does not: no pen wobble, no riso, no paper wear. The style is agreed first ([Style brief](style.md)).

## Goals

1. **The style, agreed and specified**: rules, tokens and a specimen the maintainer signs off before any kit code is written (Phase S).
2. **Our own letters**: Serigraph Display, Sans and Mono as real fonts, built from code, MIT.
3. **shadcn parity**: every `registry:ui` item in the current shadcn release, restyled, with shadcn's names, props, variants and `data-slot` attributes, on Base UI.
4. **Follies as a system**: seeded architecture in poster, window, medallion, band and doorway formats, recoloured by the colourway, with a playground to reroll seeds.
5. **Colourways**: the triptych's logic as the theme system: spot colours rotated among roles, paper and ink fixed, a studio to make your own.
6. **A website**: home, component docs, the letters, the Follies playground, the colourway studio and a demo product used end to end.
7. **Installable** through the shadcn CLI into fresh Vite and Next.js apps.
8. **Quality**: WCAG 2.2 AA in every colourway, and the "would Apple ship this" bar.

## Non-goals for v1

- A copy of the reference posters or of their artist's subjects (mannequin heads, the windmill, tulips). The references teach the rules; the drawings are our own code.
- Raster illustration assets. Generated images are direction only.
- Web neo-brutalism: offset block shadows, extruded cards, thick borders, cream boxes, coarse halftone.
- A light/dark pair in the usual sense; Night is a colourway.
- Backend services in the demo, and ports to other frameworks (the Follies engine stays framework-free).

## How it differs from Patina UI and Fineliner

|               | Patina UI                                 | Fineliner                                        | Serigraph                                               |
| ------------- | ----------------------------------------- | ------------------------------------------------ | ------------------------------------------------------- |
| Metaphor      | Riso print shop and field notebook        | One fine-liner on unbleached paper               | A silkscreen gig poster drawn with a technical pen      |
| Colour        | Seven drums, three per print, overprinted | One pen; a red correction pen; the wash for art  | Nine flat spots on one another, rotated into colourways |
| Line          | Riso edges                                | A slow, wobbly hand                              | One even technical-pen line, never wobbling             |
| Type          | Serif, mono, hand                         | A book serif, a typewriter, our hand-drawn faces | Our wide inline display, extended sans and light mono   |
| Signature art | Abstract seeded riso prints               | Seeded drawings of objects, rooms and people     | Seeded surreal architecture in cloud banks              |
| Surfaces      | Cut, tilted, aged paper with shadows      | Flat paper, drawn frames                         | Flat colour planes, pills, arches and cloud edges       |

## Decisions

Style decisions (S) are the maintainer's; the [Style brief](style.md#choices) explains each one. "Default" marks a recommendation the maintainer let stand for Phase S (2026-11-05) without deciding it.

| #   | Decision                                                                                                                                                                      | Status                                             | Notes                                                                                                                         |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| S1  | **Direction**: the triptych: colour on colour, one fine line, flat planes, depth only in architecture, micro-stipple, clouds, wide flat lettering                             | decided 2026-11-05                                 | The maintainer: the specimen captures it; worried it may be too simple beside the references, so add more interwoven drawings |
| S2  | **Name**: Serigraph (`src/serigraph/`, `@serigraph`); fonts Serigraph Display, Sans and Mono                                                                                  | proposed (default)                                 | Matches the repository; the font brief's Keyline, Clairline and Soffit are the alternatives                                   |
| S3  | **Colourways**: paper and ink fixed; nine spots; six roles mapped to shadcn tokens; Sky, Pistachio, Coral, Marigold                                                           | decided 2026-11-05                                 | "Spot on". Every spot passes AA with ink as text; Sky is the default                                                          |
| S4  | **Night**: a colourway with a prussian canvas and paper text on it; sets `.dark`                                                                                              | decided 2026-11-05                                 | Planes and drawings stay bright with ink text                                                                                 |
| S5  | **Line**: one ink line, 1.5 px at interface sizes; drawings keep it at any scale (non-scaling strokes)                                                                        | proposed                                           | 1 px in the specimen to compare; 1.25 px would draw as 1 px, since borders snap to device pixels                              |
| S6  | **Signature**: Follies, seeded surreal architecture from hand-made templates                                                                                                  | proposed (default)                                 | No heads, windmills, tulips or figures from the reference                                                                     |
| S7  | **Our own fonts**: Display (wide, flat, inline), Sans (extended capitals first), Mono (light)                                                                                 | proposed (default)                                 | The display brief changes from condensed to wide; Sans lowercase only if it matches the stand-in at 14–16 px                  |
| S8  | **Reading face** until Serigraph Sans reads well: Archivo                                                                                                                     | decided 2026-11-05                                 |                                                                                                                               |
| S9  | **Poster mode**: an appearance setting, `data-poster` on or off. On: the canvas in a rounded frame inside a paper mat. Off: no mat or frame, the canvas to the window's edges | decided 2026-11-05: an option; default on proposed | The maintainer liked the mat and asked for an edge-to-edge version as an option. The mat narrows to 8 px on phones            |
| S10 | **Demo product**: Meridian, a public observatory and planetarium (tonight's shows, tickets, members, settings)                                                                | decided 2026-11-05                                 | The name followed the recommendation                                                                                          |
| S11 | **Fields**: a tint of the plane beneath                                                                                                                                       | decided 2026-11-05                                 | Paper was the alternative                                                                                                     |
| S12 | **Pressed**: the fill steps to its shade                                                                                                                                      | decided 2026-11-05                                 | Stipple and an inner line were the alternatives                                                                               |
| S13 | **Dialog backdrop**: a fine stipple screen                                                                                                                                    | decided 2026-11-05                                 | A rising cloud bank was the alternative                                                                                       |
| S14 | **Focus**: a second concentric ring with a gap                                                                                                                                | proposed                                           | Visible on every canvas, from kit-a's focused field                                                                           |

Logic decisions (L) follow Fineliner's, carried over by request; each still needs the maintainer's confirmation where Fineliner's did.

| #   | Decision                                                                                               | Status             | Fineliner source |
| --- | ------------------------------------------------------------------------------------------------------ | ------------------ | ---------------- |
| L1  | Kit and site in one repository: kit in `src/serigraph/`, site around it                                | proposed           | L1               |
| L2  | Base UI primitives (shadcn `base-nova`)                                                                | proposed           | L2               |
| L3  | Site on Astro with React islands and MDX                                                               | proposed           | L3               |
| L4  | Rendering: CSS draws planes, lines and pills; SVG draws drawings and motifs; nothing measures          | proposed           | L4               |
| L5  | Seed model: `seedOf`, `prng`, `fork`, `stream`, unchanged                                              | proposed           | L5               |
| L6  | Paper grain generated by our own script as seamless tiles, under content                               | proposed           | L6               |
| L7  | Hosted shadcn registry generated from the source tree                                                  | proposed           | L7               |
| L8  | Proportional verification; first lasting tests at the registry install contract and seed stability     | proposed           | L8               |
| L9  | MIT license for code, art, fonts and generated textures                                                | decided 2026-11-05 | L9               |
| L10 | Parity items keep shadcn's own dependencies                                                            | proposed           | L10              |
| L11 | Fonts built in the repository by `tools/fonts` (opentype.js, GPOS kerning, WOFF2 inside the kit's CSS) | proposed           | S14              |
| L12 | Ports 4801 (dev), 4802 (preview) and 4803 (the static specimen), never framework defaults              | proposed           | —                |

## What carries over from Fineliner

| Fineliner part                                                                | Here                                                         | Change                                                                                  |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `pen/seed.ts`                                                                 | Follies' seed module (`specimen/seed.js` now)                | Copied as is                                                                            |
| The pen engine and its wobble                                                 | Follies engine                                               | No wobble: exact geometry, flat fills by colourway role, stipple patterns, louvers      |
| Objects, scenes, `<Drawing>`                                                  | Templates, follies, `<Folly>`                                | Architecture from templates instead of objects in rooms                                 |
| `styles/` tokens, stocks, pens                                                | Tokens, spots, colourways                                    | Colourway roles instead of one pen per document                                         |
| `theme/` appearance runtime                                                   | Same                                                         | Attributes: colourway, poster, line, fields, grain, motion, density                     |
| `tools/fonts` (skeleton swept by a round pen)                                 | Same pipeline                                                | Skeletons swept by a square pen; Fill and Line layers or COLRv0; extended sans and mono |
| `tools/paper`, `tools/check-contrast.mjs`, `tools/registry`, `tests/consumer` | Same                                                         | Paper grain only; contrast per role pair; fixture lockfile; Vite only until Phase 6     |
| Site: specimen, desk, docs, studio, demo                                      | Specimen, the Press, docs, colourway studio, the observatory | The Press rerolls follies and reprints them in every colourway                          |

## Phases

Each phase ships kit parts with the site pages and demo screens that use them.

### Phase S: agree the style (done)

- [x] Initialise the repository on `main` with the GitHub remote (2026-11-05)
- [x] Study the references, the first brief and Fineliner's process
- [x] Round 1 of explorations (rejected: neo-brutalist) and the maintainer's seven corrections
- [x] Round 2 of explorations from the triptych: kits, home pages, dashboards, a colourway triptych and type (`docs/style/explorations/round-2`)
- [x] Write the [style brief](style.md)
- [x] Build the specimen (`specimen/`): colourways, a lettering prototype, motifs, a seeded folly, the interface sampler and switches for every open choice
- [x] Check the specimen in Sky, Coral and Night at 1440, 800 and 375 px (no horizontal scroll, no console errors)
- [x] Maintainer review (2026-11-05): S1, S3, S4, S8 and S10–S13 agreed; S2, S5–S7 and S14 stand as defaults. Asked for: more interwoven drawings, better tabs, cloud outlines that are not cut off
- [x] Fold the agreed choices into the brief; the specimen keeps its switches as a comparison until Phase 0 ports the tokens
- [x] Review round: archway tabs redrawn; bands drawn at their measured size (no cut outlines) with buildings and plants; a denser city in the hero and a finale

Exit: the maintainer signs off the specimen as the style. Signed off 2026-11-05 ("continue according to plan").

### Phase 0: foundations

Port Fineliner's scaffold: Astro, React 19, Tailwind CSS 4, shadcn `base-nova`, path aliases, ESLint boundaries (the kit imports nothing from the site; the Follies engine imports no React or DOM and never calls `Math.random()` or `Date.now()`), Prettier and the scripts. Tokens and colourways from the agreed specimen; a `golden-ratio-ux` audit of type and spacing; paper grain tiles; the appearance runtime with its pre-paint script; the contrast check per colourway; the mat layout with poster mode on and off; the specimen as the site's first page. AGENTS.md grows Fineliner's verification and design sections.

Exit: the specimen renders from the kit in every colourway at 1440 and 390 px; every text pair passes 4.5:1; typecheck, lint and build pass.

- [x] Scaffold: Astro 7, React 19, Tailwind CSS 4, strict TypeScript, shadcn `base-nova` (`components.json`), `@/` aliases, ESLint with the kit and Follies-engine boundaries, Prettier; dev on 4801, preview on 4802, the static specimen on 4803
- [x] Golden Ratio audit of Archivo (16 px body, 34rem measure, mu 2.23, x 0.77, x-mode none): six type steps, tuned line heights, six spacing units, control heights; exceptions recorded in `styles/tokens.css`
- [x] Tokens (`tokens.css`), colourways (`colourways.css`), shadcn roles (`roles.css`), base and surfaces (`base.css`, `surfaces.css`: mat, frame, canvas, ground, plane and tones, field tint, pressed shade, stipple, louvers, caps, ordinal, separator, focus ring)
- [x] Printed grain (`npm run build:textures`): ink specks, paper flecks, tooth and mottle as seamless tiles; off with `data-grain="off"`
- [x] Appearance runtime (`theme/`): colourway, poster, line and grain on `<html>`, saved per visitor, applied before first paint
- [x] `check:contrast`: 16 text pairs in each of the five colourways with the grain composited in. It caught sky (4.24:1), rose (4.33:1) and the pressed shade (3.3–3.7:1); sky and rose rose by 0.03 in OKLab lightness, the pressed shade became a 92% mix printed flat
- [x] The specimen at `/` from the kit: colourways, surfaces and marks, voices and the scale, with the appearance panel
- [x] Checked: typecheck, lint, format, build and contrast pass; the page in Sky and Night at 1440 px and at 375 px with no horizontal scroll; poster mode and grain switch

### Phase 1: the letters

`tools/fonts` from Fineliner with a square-pen sweep. Serigraph Display (capitals, figures, punctuation, every Latin-script European language; Fill and Line, or COLRv0 after a browser check), Serigraph Sans capitals and figures (Regular, Bold, `ordn`), Serigraph Mono (full ASCII, `ss01`, ornaments in the PUA). The kit's lettering component sets Display as real text. A letters page with every glyph and the OTFs to download.

Exit: the fonts render the same in Chromium, Firefox and WebKit; Display reads as the triptych's title at 48–160 px; files under 60 KB each as WOFF2.

- [x] The skeleton alphabet in the kit (`src/serigraph/letters/`): capitals, figures, punctuation, Æ Ø Œ Þ Ŋ and 112 accented capitals from 15 marks; parametric in the pen (half-width, extension), so one skeleton makes Display and Sans
- [x] `tools/fonts` (`npm run build:fonts`): skeleton paths flattened and swept by a square pen with Clipper's offsetter (mitres to a limit of 2, square caps), cut by the box where diagonals run past it, fitted to cubic curves after dense resampling; class kerning in GPOS; deterministic bytes
- [x] Serigraph Display (9 KB WOFF2) and Display Inline (3 KB), layered by the kit's `lettering` utility and `<Lettering>`: paper fill, an ink outline from a text stroke under the fill (thickening with size), the inline over it
- [x] Serigraph Sans Regular and Bold (11 KB each): the same skeleton with a light pen, 18% wider; superior capitals behind `ordn`; the kit's `caps` labels now set in Sans Bold
- [x] The letters page (`/letters`): every glyph, the faces at size, ordinals, the files
- [x] Serigraph Mono (9 KB): one 600-unit cell, capitals and figures fitted from the skeleton, its own lowercase, a slotted zero, `ss01` stepped diagonals, the four ornaments in the PUA; replaces Martian Mono
- [x] All five fonts pass OTS (the sanitizer Chromium and Firefox apply); they render in Chromium at 1440 and 375 px
- [ ] Look in Firefox and Safari: headless Firefox cannot draw in this environment and no WebKit is installed (maintainer, or a Playwright setup later)

### Phase 2: Follies and the motifs (done)

The framework-free engine with labelled forks per part; templates (arcade, platform, stair, dome, column, flowers, sun, cloud banks); formats (poster, window, medallion, band, doorway); `<Folly>` and `folly()`; motifs as components (cloud bank, pinwheel, archway, louvers, sparkle, stipple). The Press: seed, template, colourway, reroll, copy, download SVG. First registry build and install test.

Exit: server and browser render identical SVG for the same seed; a folly reprints in every colourway; `base` and `folly` install into a scratch Vite app that builds.

- [x] The Follies engine in the kit (`src/serigraph/follies/`): the specimen's drawings ported to typed, framework-free modules (svg, motifs, clouds, buildings, parts, scenes); a pen per drawing carries the line and a seed-derived id prefix, so ids are unique on a page and identical on every render
- [x] Templates: city (the hero), window, medallion, band (a cloud bank with a building and a plant), arcade (the wall at a section's head) and doorway (the empty state); `folly()` returns an SVG string that fills its box, sliced from the bottom, so nothing measures
- [x] `<Folly>` (kit extra) and the `folly`, `arch-frame` utilities; the home page's hero is a city, the Colourways section is a cloud-coloured ground the city's clouds run into, the next section opens with the arcade wall, and every page ends on a band
- [x] The Press (`/press`): template, seed, colourway, reroll, copy and download the SVG with its colours written in; the formats below it
- [x] Seed stability (`npm run test:seeds`, the plan's first lasting test): six templates × five seeds hashed against snapshots; the built pages contain exactly the engine's SVG
- [x] Motifs on their own (`follies/marks.ts`): `motif({ kind, seed })` and `<Motif>` draw a pinwheel, a sparkle, a cumulus cloud or an archway, an em tall beside text unless sized, recoloured by `--motif`; louvers, stipple and the arch frame stay CSS utilities. Loose rings and pinpoints in a sky take the surface's text colour, so they are stars on Night
- [x] Registry build (`npm run registry`, `registry:check`): `tools/registry` ported from Fineliner, 7 items (base, follies, folly, motif, lettering, letters and the umbrella); the fonts travel inside base's stylesheet as embedded WOFF2 (L11)
- [x] The install test (`npm run test:consumer`, the second lasting test): `folly`, `motif`, `lettering` and `letters` install offline through the shadcn CLI into a fresh Vite app, bringing `base` and `follies`, arrive byte-identical, type-check under strict settings and build with the fonts in the CSS

### Phase 3: core primitives and the observatory's first screens (done)

Button, badge, card, input, textarea, label, field, checkbox, radio group, switch, select, native select, tabs, toggle, toggle group, separator, skeleton, avatar, alert, progress, slider, kbd, tooltip, popover, dialog, alert dialog, dropdown menu, spinner; docs pages with state matrices; the observatory's tonight screen, sign-in and settings.

Exit: a `break-ui` pass on the demo screens and the first consumer install test.

- [x] [Primitives](primitives.md): the shared treatment (pills, tinted fields, floating planes, the highlight for chosen, `--text-quiet` for disabled words) and a row per part
- [x] Shared utilities in the kit (`styles/controls.css`: `pill`, `contour`, `press`, `control-field`, `float-plane`, `choice-box`, `pinwheel`) and part drawing keyed on `data-slot` (`styles/parts.css`); Base UI, class-variance-authority, Lucide and tw-animate-css added, as in Fineliner
- [x] Exemplars in `src/serigraph/ui/`: button, badge, card, input, label, checkbox, switch (a pinwheel thumb that rolls the distance it slides) and tabs (archways whose heads are the tab's own rounded box, so nothing measures)
- [x] Docs pages ported from Fineliner: `/docs` and `/docs/components/<name>`, one demo file per part with state matrices, a component rail and previous/next
- [x] The install test adds button, card, checkbox, input, label, switch and tabs
- [x] The remaining parts, ported by three agents in parallel from primitives.md and the exemplars: textarea, field (with choice cards), radio group, select, native select, toggle, toggle group (the segmented control), slider (a pinwheel thumb that rolls with the value), progress (louvers), separator, skeleton, avatar (a medallion drawn from the name), alert, kbd, spinner (a turning pinwheel), tooltip, popover, dialog and alert dialog (a plane over the stipple screen), dropdown menu. 35 registry items; the install test adds avatar, dialog, dropdown menu, field, select, slider, toggle group and tooltip
- [x] Meridian at `/meridian`, its own frame with a header, its sections and the visitor: tonight (the night in a line and an arched window, a clouds alert, your seats with a menu to add or release them behind a confirm, the sessions with a segmented filter and a booking dialog, the sky on a plane beside them), sign-in (validation under each field, a link by email) and settings (a narrow column of rows; colourway, poster, line and grain apply live)
- [x] A `break-ui` pass: worst-case, empty and one data sets behind a dev-only switch (`/meridian/data/<set>/<page>`, built only by the dev server). Fixed: the board's column grew to the filter's width and overflowed at 320 px; the filter did not fit 320 px; an empty night or an empty filter showed nothing; long held titles squeezed beside their hour; hours sat centred against long titles; settings controls ran off when they could not sit beside their words; sessions kept data order; seat counts were unformatted; the close-account confirmation named seats the visitor might not hold

### Phase 4: data, navigation and the rest of parity (done)

Table, pagination, breadcrumb, accordion, collapsible, command, combobox, sheet, drawer, menubar, navigation menu, context menu, hover card, calendar and date picker, chart (series told apart by fill: flat, stipple and louvers), sonner, sidebar, scroll area, resizable, carousel, input OTP, input group, button group, empty, item, aspect ratio, typography, direction and the conversation set.

Exit: parity complete; a 200-row table scrolls without dropped frames.

- [x] The Phase 4 rows of [Primitives](primitives.md) and a shared `menu-item` utility (dropdown, select, context menu, menubar, command and combobox use it; it understands cmdk's attributes)
- [x] Five agents ported 44 parts in parallel, each with a docs page: layout (drawer, scroll area, resizable, aspect ratio, typography, direction, empty, item, accordion), navigation (sheet, sidebar, breadcrumb, pagination, menubar, navigation menu, context menu, hover card, command), input composites (input group, button group, input OTP, combobox, calendar and date picker, carousel), data (table, chart, sonner) and the conversation set (collapsible, attachment, bubble, marker, message, message scroller, questionnaire, trace, code block)
- [x] Chart fills: `ChartConfig` takes `fill: flat | stipple | louvers | tint` per series (by position otherwise); shadcn code that fills with `var(--color-<key>)` picks them up; `chartFill(key)` for custom shapes
- [x] A 200-row table: 16.7 ms median frame interval at 1× and 4× CPU throttling in headless Chrome, one or two frames over 20 ms; without its own scroll layer it repainted the grain every frame (21.8 ms median)
- [x] Registry: 72 items; the install test adds calendar, chart, code block, command, empty, sidebar, sonner and table (27 items, all their packages, offline)

### Phase 5: extras, blocks, the home page and the colourway studio

Ticket stub, programme list, poster card, date with raised ordinal, cloud band, arch frame, medallion, stair stepper, colourway switcher. Blocks: sign-in, settings, dashboard, pricing, article, empty state, hero. The home page; the colourway studio with presets and export.

### Phase 6: release v0.1

Docs complete, changelog, share images drawn by Follies, consumer installs into Vite and Next.js, an accessibility review, a performance check, deployment once the maintainer approves.

## Risks

| Risk                                                              | Mitigation                                                                                                                  |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Drift back into neo-brutalism as parts multiply                   | The brief's rules as a review checklist; compare every new screen with the triptych for line, cream, depth, shading and air |
| Follies look like clip art or too close to the reference's artist | Hand-made templates with seeded variation; no heads, windmills, tulips or figures; the Press for curating seeds             |
| A wide display face at small sizes and in long words              | Display from 32 px; below that, Sans Bold capitals; the letters page tests long words at phone width                        |
| Extended capitals tire readers                                    | Sans for labels and short lines only; a proven reading face for sentences                                                   |
| Sky is the weakest contrast (4.75:1)                              | Text on sky stays at or above 14 px medium; the contrast check gates every colourway                                        |
| Stipple shimmers (moiré) at fractional zoom                       | Stipple drawn in CSS pixels on whole-pixel pitches; only on small round forms                                               |
| COLRv0 or layered fonts differ between engines                    | Check in Chromium, Firefox and WebKit before choosing; keep the two-layer fallback                                          |
| Many SVG clip paths cost paint time                               | Static rendering at build time; one clip per shape group; a measured budget                                                 |

## Progress log

- **2026-11-05**: Repository initialised with the GitHub remote. Read the maintainer's style and font briefs, the two posters and Fineliner's Phase S. Round 1 (four gpt-image explorations from the brief) came out as web neo-brutalism: cream boxes, 45° extrusions, heavy lines, coarse halftone; the maintainer rejected it and gave the triptych and seven corrections. Round 2 (eight explorations) follows the triptych: colour on colour, flat planes, fine lines, micro-stipple, wide flat lettering; the image model copied the reference's heads, tulips and caption text into the kits, which the kit will not do. Sampled the triptych's spots: all pass AA with a `#262420` ink. Wrote the style brief and built the specimen. The display lettering prototype draws each glyph as a centre-line skeleton swept by a square pen twice (ink at the stem plus two lines, then paper at the stem), which outlines the union with its counters; diagonals are cut flat by a per-glyph clip (a shared clip let one letter's diagonal show inside its neighbour's box). This is the construction Phase 1's font builder should use. Cloud banks are outlined the same way (each puff stroked at twice the line under one fill). Borders snap to device pixels, so the line choices are 1 and 1.5 px. Checked Sky, Coral and Night at 1440, 800 and 375 px. After review the maintainer asked for poster mode as an option: the specimen's Appearance panel now turns the mat and frame off, the canvas running to the window's edges (checked at 1440 and 375 px).
- **2026-11-05, review round**: The maintainer agreed the direction, colourways, Night, fields, pressed, backdrop, reading face and the observatory (named Meridian), and asked for more interwoven drawings, better tabs and cloud outlines that are not cut off. Tabs are now archways (semicircular heads on jambs, an inner line, labels below the spring line). Bands are drawn at their measured size, one unit to a pixel, so no puff is cropped; each cloud band carries a building and a plant. Follies gained building parts (`specimen/buildings.js`: oblique boxes with arched windows, stairs with treads and risers, an observatory, a pinwheel arch, plants) and a `city` template for the hero and a finale; floating cloud strata are cut flat and outlined at their base. The pane was hidden for part of the check, so desktop was verified with headless Chrome screenshots and phone width by measuring overflow in the pane.
- **2026-11-05, Phase 0**: The maintainer signed off the style. Ported Fineliner's scaffold and runtime into `src/serigraph/` (kit) and `src/site/` (site). A Golden Ratio audit of Archivo set the type and space tokens (16 px body at 1.618, a 34rem measure, steps of 12.6 to 41.9 px, units of 6.1 to 67.8 px). The grain is neutral, so one set of tiles serves every colourway. The grained contrast check failed sky, rose and the pressed shade, all three fixed at the token level (sky `#3aa1d2`, rose `#fb6a83`, pressed 92% and flat). The page at `/` is built from the kit; display lettering waits for Phase 1, so the title is Archivo at its widest with a paper fill and an ink outline. Checked in the browser pane at 1440 and 375 px.
- **2026-11-05, Phase 1**: The maintainer confirmed MIT and standing permission to commit, push and continue. The skeleton alphabet moved into the kit, parametric in the pen, so one skeleton makes Display (heavy) and Sans (light, 18% wider); Mono fits it to a cell and adds a lowercase. polygon-clipping failed on the slivers flattened arcs make; Clipper's offsetter strokes and unions reliably. The curve fitter bulged thin capsules (it measures error only at points), fixed by resampling every 8 units before fitting. Display is layered with a text stroke under the fill rather than Fill/Line fonts or COLRv0, so the outline keeps the line's weight at every size. Display, Sans and Mono are 3–11 KB each as WOFF2 and build the same bytes every time; the site's titles and labels now use them.
- **2026-11-05, Phase 2 (first half)**: The specimen's Follies became the kit's engine, typed and framework-free, and draw on the server: the city, window, medallion, band, arcade and doorway templates. Bands no longer measure: they are drawn wide (3200 units) at their real height and sliced from the bottom, so nothing crops. The home page now runs city → cloud ground → arcade wall like the specimen. A faint seam remains where an element's grain overlay meets the next section's grain (two tile origins). The Press rerolls and exports standalone SVG. Seed stability is the first lasting test.
- **2026-11-05, Phase 2 (done)**: Fineliner's registry builder and offline install test ported. A registry cannot carry binary files, so the font build now embeds each WOFF2 in `letters.generated.css` (44 KB of fonts, 60 KB of CSS; the downloadable files stay in `public/fonts`). The fixture's first offline install failed for want of cached tarballs; its `package-lock.json` is now committed, so the test needs the cache filled once, not tracked by hand. The kit installs into a fresh Vite app, type-checks under the fixture's strict settings and renders as it does on the site (checked in headless Chrome). The motifs became parts of their own; the first cloud motif read as a loaf, so it is a cumulus with a crown. On Night the sky's loose rings and dots were ink on a dark canvas and vanished; they now take the surface's text colour. The four templates that scatter them changed their snapshots on purpose.

- **2026-11-05, Phase 3 (first part)**: Wrote [Primitives](primitives.md) and ported Fineliner's docs pages. The exemplars follow the style brief's interface table: pills in spot colours, tinted fields, the highlight for chosen, the contour line on hover, pinwheel thumbs and archway tabs. Three things found on the way: Fineliner's `Tabs` never passed `orientation` to Base UI, so vertical tabs drew a horizontal mark (and would take left and right arrows); part rules in the components layer lost to the part's own utility classes, so `parts.css` sits in the utilities layer with more specific selectors; disabled words used a fixed quiet ink that vanishes on Night's canvas, so each surface now sets `--text-quiet`. Installing Base UI with the dev server running left Vite with two React copies (invalid hook calls) until a restart. Checked at 1440 (headless Chrome, Sky) and 375 px (the pane, Sky and Night).

- **2026-11-05, Phase 3 (the parts)**: Three agents ported the other twenty parts in parallel, each owning its files and a batch stylesheet (`forms.css`, `feedback.css`, `overlays.css`). Reviewed from their screenshots and in the pane. Fixed on integration: the letters' `skeleton.ts` and shadcn's `skeleton.tsx` shared a base name, which `shadcn add` mixes up (the registry builder refused), so the letters module is now `geometry.ts`; disabled fields and checks tinted 12% toward paper read as cream boxes on every canvas, so they match disabled pills at 35%; the medallion's dome on a platform read as a flying saucer at avatar size, so it is now a pinwheel seen through an arch on clouds (its snapshots changed on purpose). Open: Serigraph Mono lacks arrows (← → fall back) and its % reads poorly when small; candidate shared utilities from the batches (a menu-item, the segmented track, a fine-icon stroke, the tick) wait for the next parts that need them.

- **2026-11-05, Phase 3 (done)**: Meridian's first screens, built from the kit as a consumer would. Composed Base UI parts cannot cross Astro's boundary (each React component Astro places renders alone, so an avatar's fallback lost its context and the page threw); they render from one React component instead. The `break-ui` pass ran the worst case (a collaboration's lecture title, a double-barrelled name, a long work email, a comet's designation, a session over midnight, 1,200 seats), an empty night and a night of one, at 1440 and 320 px; nine breaks were fixed and the switch stays as the regression check. The pane stopped running `requestAnimationFrame` again, so dialogs could not finish closing there; the flows (book, add, release) were checked in headless Chrome over CDP instead. Fineliner's `Tabs` and `ToggleGroup` orientation fix went to its main the same day.

- **2026-11-05, Phase 4 (done)**: Parity is complete: 72 registry items. Measured the table: scrolling it repainted the printed grain behind the rows every frame, so the table container scrolls on its own layer (`will-change: scroll-position`). From the batches: a folly's grain overlay doubled the canvas grain around fitted drawings (medallion, doorway), now off for those; shadcn's `data-horizontal`/`data-vertical` variants were missing and are now defined; cmdk marks every item `data-disabled="false"`, which the menu-item utility now reads correctly. Open for consolidation: a `fine-icon` stroke utility, the fine tick, a ghost pill, a current-page pill, the group-takes-focus rules and a tinted-surface context are each repeated across batches; `cn` does not know `caps` and `pill` clash with `font-*`, `text-*` and `rounded-*`. Name-drawn avatars read busy as small pinwheels in threads. The screenshot script's fixed port collided between parallel agents.

## Open questions for the maintainer

None block Phase 0. Defaults the maintainer may still change: S2 (names), S5 (line), S6 (Follies), S7 (our fonts), S14 (focus), poster mode on by default (S9), and the logic decisions L1–L12.
