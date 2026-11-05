# Changelog

## Unreleased

### Phase 3: core primitives (in progress)

- Button, Badge, Card, Input, Label, Checkbox, Switch and Tabs on Base UI, with shadcn's names, props and slots: pills in the colourway's spot colours inside one ink line, tinted fields, a pinwheel switch thumb that rolls, and tabs drawn as archways that open into their panel.
- Component docs at `/docs`: every part's states in a matrix, by group, with previous and next.
- The registry has 15 items; the install test adds the new parts.

### Phase 2: Follies

- The Follies engine in the kit: seeded surreal architecture drawn as SVG from a seed, the same on the server and in the browser, recoloured by the colourway. Templates: city, window, medallion, band, arcade and doorway; `<Folly>` renders one.
- The Press (`/press`): reroll any template in any colourway and take the SVG away.
- The home page opens on a city whose clouds run into the next section; every page ends on a cloud band.
- Motifs on their own: `<Motif>` draws a pinwheel, a sparkle, a cloud or an archway beside text, in its colourway role or `--motif`.
- On Night, the rings and dots in a folly's sky are paper, like stars.
- `npm run test:seeds` holds every template and motif to its snapshot.
- The shadcn registry (`npm run registry`): base, follies, folly, motif, lettering and letters, with Serigraph's fonts embedded in base's stylesheet. `npm run test:consumer` installs them offline into a fresh Vite app that must type-check and build.

### Phase 1: the letters

- Serigraph Display and Display Inline: wide, round, flat capitals from a heavy square pen, layered by `<Lettering>` into paper letters with an ink outline and a thin inline, as on the poster. Every Latin-script European language's capitals.
- Serigraph Sans Regular and Bold: the same skeleton with a light pen, wider; raised ordinals through `font-variant-numeric: ordinal`. The kit's labels use it.
- Serigraph Mono: rounded squares in one cell, its own lowercase, a slotted zero, `ss01` staircase diagonals and four ornaments in the Private Use Area. It replaces the Martian Mono stand-in.
- `npm run build:fonts` builds them from the kit's skeleton alphabet; `/letters` shows every glyph and offers the files.

### Phase 0: foundations

- The kit (`src/serigraph/`): tokens from a Golden Ratio audit of Archivo (16 px body, 34rem measure, six type steps, six spacing units), paper and ink, nine spot colours, five colourways (Sky, Pistachio, Coral, Marigold, Night) mapped to shadcn's roles, and the surfaces and marks: mat and frame (poster mode), canvas, ground, planes and tones, field tint, pressed shade, stipple, louvers, extended capitals, ordinals and the focus ring.
- A printed grain on every surface, generated as seamless tiles (`npm run build:textures`).
- The appearance runtime: colourway, poster mode, line and grain on `<html>`, saved per visitor and applied before the first paint.
- `npm run check:contrast`: every text pair in every colourway, with the grain composited in, at 4.5:1. Sky and rose lightened a little and the pressed shade printed flat to pass it.
- The site's first page: the foundations specimen, with an appearance panel.

### Phase S: the style

- The style brief, the plan, the static specimen (`specimen/`) and two rounds of explorations; poster mode as an option; the review round's archway tabs, uncut cloud bands and denser Follies.
