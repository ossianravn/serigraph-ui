# Plan

Status: Phase S (style agreement) in progress, 2026-11-05. The style proposal and its specimen are ready for review; nothing below is decided until a row in [Decisions](#decisions) says so. This file is the progress record: update a phase's checklist and the [log](#progress-log) as work lands.

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

|               | Patina UI                                      | Fineliner                                        | Serigraph                                                 |
| ------------- | ---------------------------------------------- | ------------------------------------------------ | --------------------------------------------------------- |
| Metaphor      | Riso print shop and field notebook             | One fine-liner on unbleached paper               | A silkscreen gig poster drawn with a technical pen        |
| Colour        | Seven drums, three per print, overprinted      | One pen; a red correction pen; the wash for art  | Nine flat spots on one another, rotated into colourways   |
| Line          | Riso edges                                     | A slow, wobbly hand                              | One even technical-pen line, never wobbling               |
| Type          | Serif, mono, hand                              | A book serif, a typewriter, our hand-drawn faces | Our wide inline display, extended sans and light mono     |
| Signature art | Abstract seeded riso prints                    | Seeded drawings of objects, rooms and people     | Seeded surreal architecture in cloud banks                |
| Surfaces      | Cut, tilted, aged paper with shadows           | Flat paper, drawn frames                         | Flat colour planes, pills, arches and cloud edges         |

## Decisions

Style decisions (S) are the maintainer's; the [Style brief](style.md#choices) explains each one. "Default" marks a recommendation the maintainer let stand for Phase S (2026-11-05) without deciding it.

| #   | Decision                                                                                                       | Status                       | Notes                                                                                                                         |
| --- | -------------------------------------------------------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| S1  | **Direction**: the triptych: colour on colour, one fine line, flat planes, depth only in architecture, micro-stipple, clouds, wide flat lettering | decided 2026-11-05 | The maintainer: the specimen captures it; worried it may be too simple beside the references, so add more interwoven drawings |
| S2  | **Name**: Serigraph (`src/serigraph/`, `@serigraph`); fonts Serigraph Display, Sans and Mono                    | proposed (default)           | Matches the repository; the font brief's Keyline, Clairline and Soffit are the alternatives                                    |
| S3  | **Colourways**: paper and ink fixed; nine spots; six roles mapped to shadcn tokens; Sky, Pistachio, Coral, Marigold | decided 2026-11-05 | "Spot on". Every spot passes AA with ink as text; Sky is the default |
| S4  | **Night**: a colourway with a prussian canvas and paper text on it; sets `.dark` | decided 2026-11-05 | Planes and drawings stay bright with ink text |
| S5  | **Line**: one ink line, 1.5 px at interface sizes; drawings keep it at any scale (non-scaling strokes)           | proposed                     | 1 px in the specimen to compare; 1.25 px would draw as 1 px, since borders snap to device pixels                              |
| S6  | **Signature**: Follies, seeded surreal architecture from hand-made templates                                     | proposed (default)           | No heads, windmills, tulips or figures from the reference                                                                      |
| S7  | **Our own fonts**: Display (wide, flat, inline), Sans (extended capitals first), Mono (light)                     | proposed (default)           | The display brief changes from condensed to wide; Sans lowercase only if it matches the stand-in at 14–16 px                    |
| S8  | **Reading face** until Serigraph Sans reads well: Archivo | decided 2026-11-05 | |
| S9  | **Poster mode**: an appearance setting, `data-poster` on or off. On: the canvas in a rounded frame inside a paper mat. Off: no mat or frame, the canvas to the window's edges | decided 2026-11-05: an option; default on proposed | The maintainer liked the mat and asked for an edge-to-edge version as an option. The mat narrows to 8 px on phones |
| S10 | **Demo product**: Meridian, a public observatory and planetarium (tonight's shows, tickets, members, settings) | decided 2026-11-05 | The name followed the recommendation |
| S11 | **Fields**: a tint of the plane beneath | decided 2026-11-05 | Paper was the alternative |
| S12 | **Pressed**: the fill steps to its shade | decided 2026-11-05 | Stipple and an inner line were the alternatives |
| S13 | **Dialog backdrop**: a fine stipple screen | decided 2026-11-05 | A rising cloud bank was the alternative |
| S14 | **Focus**: a second concentric ring with a gap                                                                    | proposed                     | Visible on every canvas, from kit-a's focused field                                                                           |

Logic decisions (L) follow Fineliner's, carried over by request; each still needs the maintainer's confirmation where Fineliner's did.

| #   | Decision                                                                                            | Status   | Fineliner source |
| --- | --------------------------------------------------------------------------------------------------- | -------- | ---------------- |
| L1  | Kit and site in one repository: kit in `src/serigraph/`, site around it                             | proposed | L1               |
| L2  | Base UI primitives (shadcn `base-nova`)                                                             | proposed | L2               |
| L3  | Site on Astro with React islands and MDX                                                            | proposed | L3               |
| L4  | Rendering: CSS draws planes, lines and pills; SVG draws drawings and motifs; nothing measures        | proposed | L4               |
| L5  | Seed model: `seedOf`, `prng`, `fork`, `stream`, unchanged                                            | proposed | L5               |
| L6  | Paper grain generated by our own script as seamless tiles, under content                             | proposed | L6               |
| L7  | Hosted shadcn registry generated from the source tree                                                | proposed | L7               |
| L8  | Proportional verification; first lasting tests at the registry install contract and seed stability   | proposed | L8               |
| L9  | MIT license for code, art, fonts and generated textures                                              | proposed | L9               |
| L10 | Parity items keep shadcn's own dependencies                                                          | proposed | L10              |
| L11 | Fonts built in the repository by `tools/fonts` (opentype.js, GPOS kerning, WOFF2 inside the kit's CSS) | proposed | S14             |
| L12 | Ports 4801 (dev and specimen) and 4802 (preview), never framework defaults                           | proposed | —                |

## What carries over from Fineliner

| Fineliner part                                | Here                                        | Change                                                                                         |
| --------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `pen/seed.ts`                                 | Follies' seed module (`specimen/seed.js` now) | Copied as is                                                                                  |
| The pen engine and its wobble                 | Follies engine                              | No wobble: exact geometry, flat fills by colourway role, stipple patterns, louvers              |
| Objects, scenes, `<Drawing>`                  | Templates, follies, `<Folly>`                | Architecture from templates instead of objects in rooms                                        |
| `styles/` tokens, stocks, pens                | Tokens, spots, colourways                    | Colourway roles instead of one pen per document                                                 |
| `theme/` appearance runtime                   | Same                                        | Attributes: colourway, poster, line, fields, grain, motion, density                             |
| `tools/fonts` (skeleton swept by a round pen) | Same pipeline                               | Skeletons swept by a square pen; Fill and Line layers or COLRv0; extended sans and mono         |
| `tools/paper`, `tools/check-contrast.mjs`, `tools/registry`, `tests/consumer` | Same | Paper grain only; contrast checked per colourway role pair                                 |
| Site: specimen, desk, docs, studio, demo      | Specimen, the Press, docs, colourway studio, the observatory | The Press rerolls follies and reprints them in every colourway                 |

## Phases

Each phase ships kit parts with the site pages and demo screens that use them.

### Phase S: agree the style (current)

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

Exit: the maintainer signs off the specimen as the style.

### Phase 0: foundations

Port Fineliner's scaffold: Astro, React 19, Tailwind CSS 4, shadcn `base-nova`, path aliases, ESLint boundaries (the kit imports nothing from the site; the Follies engine imports no React or DOM and never calls `Math.random()` or `Date.now()`), Prettier and the scripts. Tokens and colourways from the agreed specimen; a `golden-ratio-ux` audit of type and spacing; paper grain tiles; the appearance runtime with its pre-paint script; the contrast check per colourway; the mat layout with poster mode on and off; the specimen as the site's first page. AGENTS.md grows Fineliner's verification and design sections.

Exit: the specimen renders from the kit in every colourway at 1440 and 390 px; every text pair passes 4.5:1; typecheck, lint and build pass.

### Phase 1: the letters

`tools/fonts` from Fineliner with a square-pen sweep. Serigraph Display (capitals, figures, punctuation, every Latin-script European language; Fill and Line, or COLRv0 after a browser check), Serigraph Sans capitals and figures (Regular, Bold, `ordn`), Serigraph Mono (full ASCII, `ss01`, ornaments in the PUA). The kit's lettering component sets Display as real text. A letters page with every glyph and the OTFs to download.

Exit: the fonts render the same in Chromium, Firefox and WebKit; Display reads as the triptych's title at 48–160 px; files under 60 KB each as WOFF2.

### Phase 2: Follies and the motifs

The framework-free engine with labelled forks per part; templates (arcade, platform, stair, dome, column, flowers, sun, cloud banks); formats (poster, window, medallion, band, doorway); `<Folly>` and `folly()`; motifs as components (cloud bank, pinwheel, archway, louvers, sparkle, stipple). The Press: seed, template, colourway, reroll, copy, download SVG. First registry build and install test.

Exit: server and browser render identical SVG for the same seed; a folly reprints in every colourway; `base` and `folly` install into a scratch Vite app that builds.

### Phase 3: core primitives and the observatory's first screens

Button, badge, card, input, textarea, label, field, checkbox, radio group, switch, select, native select, tabs, toggle, toggle group, separator, skeleton, avatar, alert, progress, slider, kbd, tooltip, popover, dialog, alert dialog, dropdown menu, spinner; docs pages with state matrices; the observatory's tonight screen, sign-in and settings.

Exit: a `break-ui` pass on the demo screens and the first consumer install test.

### Phase 4: data, navigation and the rest of parity

Table, pagination, breadcrumb, accordion, collapsible, command, combobox, sheet, drawer, menubar, navigation menu, context menu, hover card, calendar and date picker, chart (series told apart by fill: flat, stipple and louvers), sonner, sidebar, scroll area, resizable, carousel, input OTP, input group, button group, empty, item, aspect ratio, typography, direction and the conversation set.

Exit: parity complete; a 200-row table scrolls without dropped frames.

### Phase 5: extras, blocks, the home page and the colourway studio

Ticket stub, programme list, poster card, date with raised ordinal, cloud band, arch frame, medallion, stair stepper, colourway switcher. Blocks: sign-in, settings, dashboard, pricing, article, empty state, hero. The home page; the colourway studio with presets and export.

### Phase 6: release v0.1

Docs complete, changelog, share images drawn by Follies, consumer installs into Vite and Next.js, an accessibility review, a performance check, deployment once the maintainer approves.

## Risks

| Risk                                                                 | Mitigation                                                                                                                    |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Drift back into neo-brutalism as parts multiply                      | The brief's rules as a review checklist; compare every new screen with the triptych for line, cream, depth, shading and air |
| Follies look like clip art or too close to the reference's artist     | Hand-made templates with seeded variation; no heads, windmills, tulips or figures; the Press for curating seeds               |
| A wide display face at small sizes and in long words                 | Display from 32 px; below that, Sans Bold capitals; the letters page tests long words at phone width                          |
| Extended capitals tire readers                                       | Sans for labels and short lines only; a proven reading face for sentences                                                     |
| Sky is the weakest contrast (4.75:1)                                 | Text on sky stays at or above 14 px medium; the contrast check gates every colourway                                          |
| Stipple shimmers (moiré) at fractional zoom                          | Stipple drawn in CSS pixels on whole-pixel pitches; only on small round forms                                                 |
| COLRv0 or layered fonts differ between engines                       | Check in Chromium, Firefox and WebKit before choosing; keep the two-layer fallback                                            |
| Many SVG clip paths cost paint time                                  | Static rendering at build time; one clip per shape group; a measured budget                                                   |

## Progress log

- **2026-11-05**: Repository initialised with the GitHub remote. Read the maintainer's style and font briefs, the two posters and Fineliner's Phase S. Round 1 (four gpt-image explorations from the brief) came out as web neo-brutalism: cream boxes, 45° extrusions, heavy lines, coarse halftone; the maintainer rejected it and gave the triptych and seven corrections. Round 2 (eight explorations) follows the triptych: colour on colour, flat planes, fine lines, micro-stipple, wide flat lettering; the image model copied the reference's heads, tulips and caption text into the kits, which the kit will not do. Sampled the triptych's spots: all pass AA with a `#262420` ink. Wrote the style brief and built the specimen. The display lettering prototype draws each glyph as a centre-line skeleton swept by a square pen twice (ink at the stem plus two lines, then paper at the stem), which outlines the union with its counters; diagonals are cut flat by a per-glyph clip (a shared clip let one letter's diagonal show inside its neighbour's box). This is the construction Phase 1's font builder should use. Cloud banks are outlined the same way (each puff stroked at twice the line under one fill). Borders snap to device pixels, so the line choices are 1 and 1.5 px. Checked Sky, Coral and Night at 1440, 800 and 375 px. After review the maintainer asked for poster mode as an option: the specimen's Appearance panel now turns the mat and frame off, the canvas running to the window's edges (checked at 1440 and 375 px).
- **2026-11-05, review round**: The maintainer agreed the direction, colourways, Night, fields, pressed, backdrop, reading face and the observatory (named Meridian), and asked for more interwoven drawings, better tabs and cloud outlines that are not cut off. Tabs are now archways (semicircular heads on jambs, an inner line, labels below the spring line). Bands are drawn at their measured size, one unit to a pixel, so no puff is cropped; each cloud band carries a building and a plant. Follies gained building parts (`specimen/buildings.js`: oblique boxes with arched windows, stairs with treads and risers, an observatory, a pinwheel arch, plants) and a `city` template for the hero and a finale; floating cloud strata are cut flat and outlined at their base. The pane was hidden for part of the check, so desktop was verified with headless Chrome screenshots and phone width by measuring overflow in the pane.

## Open questions for the maintainer

None block Phase 0. Defaults the maintainer may still change: S2 (names), S5 (line), S6 (Follies), S7 (our fonts), S14 (focus), poster mode on by default (S9), and the logic decisions L1–L12.
