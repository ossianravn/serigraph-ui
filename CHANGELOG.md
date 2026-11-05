# Changelog

## Unreleased

### Phase 1: the letters (in progress)

- Serigraph Display and Display Inline: wide, round, flat capitals from a heavy square pen, layered by `<Lettering>` into paper letters with an ink outline and a thin inline, as on the poster. Every Latin-script European language's capitals.
- Serigraph Sans Regular and Bold: the same skeleton with a light pen, wider; raised ordinals through `font-variant-numeric: ordinal`. The kit's labels use it.
- `npm run build:fonts` builds them from the kit's skeleton alphabet; `/letters` shows every glyph and offers the files.

### Phase 0: foundations

- The kit (`src/serigraph/`): tokens from a Golden Ratio audit of Archivo (16 px body, 34rem measure, six type steps, six spacing units), paper and ink, nine spot colours, five colourways (Sky, Pistachio, Coral, Marigold, Night) mapped to shadcn's roles, and the surfaces and marks: mat and frame (poster mode), canvas, ground, planes and tones, field tint, pressed shade, stipple, louvers, extended capitals, ordinals and the focus ring.
- A printed grain on every surface, generated as seamless tiles (`npm run build:textures`).
- The appearance runtime: colourway, poster mode, line and grain on `<html>`, saved per visitor and applied before the first paint.
- `npm run check:contrast`: every text pair in every colourway, with the grain composited in, at 4.5:1. Sky and rose lightened a little and the pressed shade printed flat to pass it.
- The site's first page: the foundations specimen, with an appearance panel.

### Phase S: the style

- The style brief, the plan, the static specimen (`specimen/`) and two rounds of explorations; poster mode as an option; the review round's archway tabs, uncut cloud bands and denser Follies.
