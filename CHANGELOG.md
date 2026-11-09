# Changelog

## Unreleased

### After the maintainer's review

- Drawings: an overview of the seven collections, a page for each with how to draw them in a project, and every drawing opens in the Press.
- The Press draws any object from the library as well as any scene, shows its neighbouring seeds, copies the code that draws it, and keeps what it draws in the address.
- The footer band no longer cuts off what rises above its clouds.
- The specimen opens on its own city; the appearance panel sits beside the colourways.
- The letters page opens on its title.
- The components index: each card holds its preview, name and sentence together.
- Meridian, the demo observatory, is gone; home's In use section is now Blocks, and the hero's second action goes to them.

### The drawing library

- 69 seeded objects in seven collections (architecture, the sky, instruments, the garden, travel and post, the stage, everyday moments), drawn with `drawing()` or `<Drawing>`, all shown at `/drawings`.
- Composed scenes: a procession through an arcade, a skyline, an observatory, a stage.
- The home page as one poster: a spiral tower from the city to the name, scenes beside each section's words, the procession, emblems for the component groups.
- Every page's band draws its own objects; Meridian opens on its observatory; a 404 page.
- Redrawn: the cypress (a flame of foliage tongues), the topiary (one to three clipped balls in a planter with finials), the constellation (stars in spot colours in a dust of pinpoints), the padlock (a rounded body with a thin side), the kite's tail; the fountain's water stays water-coloured on Night.

- The drawings page, home's later sections and every page's footer band are laid out and painted only when they near the window.

### Repair pass

- Faster: the printed grain is bitmap tiles, the site's fonts and grain load as cached files, islands hydrate when the browser is idle, and the blocks page loads its previews one at a time and never while scrolling.
- Poster mode is off by default.
- A new hero: the name lettered across the column, the install command, and a city to reroll.
- The studio keeps its preview in view while you change roles, on phones too.
- The specimen's surfaces and voices are a sheet of aligned rows; the voices are shown at sizes where they can be seen.
- Meridian: held seats are tickets with Add a seat and Release; sign-in fits one screen; focus stays put after booking or releasing.
- The components index shows every part at rest.
- Accessibility: quiet words on fields, calendar outside days and the command placeholder reach 4.5:1; focus rings take the colour of the surface around them; highlighted menu items take the ink line; the sidebar trigger, avatar badge and studio popover are named and stated.

### Phase 5: extras, blocks, the home page and the studio

- Extras: ticket stub, programme list, poster card, ordinal date, stair stepper, cloud band, arch frame, medallion and the colourway switcher.
- Blocks at `/docs/blocks`: hero, sign-in, dashboard, settings, pricing, article and empty states, each previewed at desktop and phone width.
- A new home page; the foundations specimen moved to `/specimen`.
- The colourway studio at `/studio`: presets, a spot per role, live contrast and a CSS export.
- Quiet text is for disabled words only; everything people read keeps 4.5:1.
- The registry has 88 items.

### Phase 4: the rest of parity

- 44 more parts on Base UI with shadcn's names and slots, each with a docs page: drawer, sheet, sidebar, scroll area, resizable, aspect ratio, typography, direction, empty, item, accordion, collapsible, breadcrumb, pagination, menubar, navigation menu, context menu, hover card, command, input group, button group, input OTP, combobox, calendar and date picker, carousel, table, chart, sonner, and the conversation set (attachment, bubble, marker, message, message scroller, questionnaire, trace, code block).
- Charts tell series apart by fill as well as colour: flat, stipple, louvers and tint.
- A 200-row table scrolls at 60 frames a second.
- The registry has 72 items.

### Phase 3: core primitives and Meridian

- Button, Badge, Card, Input, Label, Checkbox, Switch and Tabs on Base UI, with shadcn's names, props and slots: pills in the colourway's spot colours inside one ink line, tinted fields, a pinwheel switch thumb that rolls, and tabs drawn as archways that open into their panel.
- Component docs at `/docs`: every part's states in a matrix, by group, with previous and next.
- Textarea, Field, Radio group, Select, Native select, Toggle, Toggle group, Slider, Progress, Separator, Skeleton, Avatar, Alert, Kbd, Spinner, Tooltip, Popover, Dialog, Alert dialog and Dropdown menu: the segmented control as a plane-2 track, louvered progress, pinwheel slider thumbs and spinners, avatars drawn from a name, dialogs over a fine stipple screen.
- The medallion folly's second drawing is a pinwheel seen through an arch.
- Meridian, the demo observatory, at `/meridian`: tonight's sessions with booking and your seats, sign-in and settings, built from the kit. A dev-only data switch shows each screen with worst-case, empty and one-item data.
- The registry has 35 items; the install test adds avatar, dialog, dropdown menu, field, select, slider, toggle group and tooltip.

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
