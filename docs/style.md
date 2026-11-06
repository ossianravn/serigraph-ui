# Style brief

Status: proposal for agreement, 2026-11-05. Nothing here is decided until the [plan](plan.md#decisions) says so. Once agreed, the specimen's values become the kit's tokens and this brief becomes the design language the kit is checked against.

The live specimen (`specimen/`, served by `python -m http.server 4803 --bind 127.0.0.1` from the repository root, then `http://127.0.0.1:4803/specimen/`) shows every proposal below and switches between the options still open.

## The style in one line

**A late-1970s silkscreen gig poster, drawn with a technical pen.** Flat, luminous spot colours laid one on another; one fine, even ink line separating them; weightless surreal architecture (arcades, round platforms, staircases) rising out of scalloped cloud banks; wide, round, flat lettering with one thin line inside each stem. Airy and optimistic, never heavy.

## What the references show

The primary reference is a gig poster triptych: one illustration printed in three colourways (sky blue, pistachio and coral canvases). It is someone else's artwork, so it stays unpublished in `.dev-docs/reference/`, with the maintainer's two earlier posters and the first written brief. Facts from the triptych, which the rules below generalise:

- **Line**: one technical-pen weight throughout, about 0.25 % of the poster's width; even, never tapered, sharp where it meets another line. It separates colours quietly; it never frames heavily.
- **Colour**: five or six opaque spot colours of similar brightness (sky, coral, marigold, bubblegum, seafoam, pistachio). Colour sits directly on colour: pink heads on a blue sky, a coral staircase against yellow clouds. Cream appears in three places only: the mat around the canvas, the fill of the title, and the brightest cloud layer.
- **Colourways**: the three prints are the same drawing with the colours rotated among the same roles (canvas, structure, clouds, accents). The composition never changes; the mood does.
- **Depth**: almost everything is a flat shape. Thickness appears only in architecture: the solid black underside of a round platform, a staircase whose underside is louvered black and colour, the side of a column.
- **Shading**: an ultra-fine stipple of ink dots on the shadow side of round forms (heads, flower bulbs, columns), so fine that from a distance it reads as a darker tone of the same colour. No coarse comic dots anywhere.
- **Clouds**: flat scalloped banks with flat bottoms, in two or three colours stacked back to front, drawn with a few open interior arcs where one puff overlaps another, plus pinpoint dots, small hollow circles and four-point sparkles. Never dots inside a cloud.
- **Pinwheel**: a radial swirl of cream and one colour, in an oval frame, the picture's single hypnotic accent.
- **Lettering**: the title is wide, round and flat: cream fill, a fine ink outline, generous spacing, and one thin line running inside the left side of each stem. Below it, the details are small extended capitals in solid ink, tracked wide, separated by a middle dot, with a raised ordinal (16TH).
- **Frame**: the canvas is a large rounded rectangle with a fine outline, set in a cream paper mat.

The first written brief (`.dev-docs/style-description.md`) holds for colourways, paper and ink, clouds, pinwheels, sparkles and the mat frame. Its extrusions, Ben-Day dots, heavy outlines and condensed display face are replaced by the triptych's evidence (the maintainer's seven corrections, 2026-11-05). The first round of explorations, which followed that brief into web neo-brutalism, is kept in `docs/style/explorations/round-1` as a record of what this style is not.

## Rules

1. **Colour on colour.** Surfaces are spot colours laid on spot colours. A panel is pink on a sky canvas, lilac on marigold. Cream is never a card or a box.
2. **One fine line.** Every edge is the same thin ink line (1.5 px at interface sizes, which is one device pixel on a 1× screen). It separates colours; it does not frame them heavily.
3. **Flat planes.** No drop shadows, offset blocks, bevels, extrusions, blur or transparency on interface parts. Hierarchy comes from colour, overlap and position.
4. **Depth belongs to architecture.** Thickness, solid black and louvers appear only in drawings and a few architectural motifs (a platform's underside, an arch's doorway, a stair's risers).
5. **Shade finely, or not at all.** A micro-stipple on the shadow side of round forms; never coarse dots, gradients or hatching across a surface.
6. **Clouds, arches and pills, not boxes.** Section edges are cloud banks; tabs are archways; buttons, badges and fields are pills; large panels have big radii and sometimes arched tops.
7. **Air.** Few, large groups with space between them, on the canvas itself. No packed grid of small boxes.
8. **Colourways, not modes.** A theme is a rotation of the same spot colours among the same roles. Paper and ink never change.

## Paper and ink

| Neutral | Value     | Role                                                                                 |
| ------- | --------- | ------------------------------------------------------------------------------------ |
| Paper   | `#eae3c8` | The mat around the canvas, the fill of display lettering, the brightest cloud layer  |
| Ink     | `#262420` | Every line, all text on colour, stipple, louvers, recessed cut-outs; 12.0:1 on paper |

Paper grain is a faint printed texture on the colours, generated like Patina's and Fineliner's (seamless tiles from fixed seeds) and laid under the content, never over text.

## Spot colours

Sampled from the triptych and kept close to it. Each passes AA with ink as text with the printed grain composited in (`npm run check:contrast`); sky and rose were lifted by 0.03 in OKLab lightness so the grain does not push them under.

| Spot       | Value     | Ink on it |
| ---------- | --------- | --------- |
| Sky        | `#3aa1d2` | 5.3:1     |
| Cornflower | `#61b0da` | 6.4:1     |
| Seafoam    | `#7fc9be` | 8.1:1     |
| Pistachio  | `#a0c252` | 7.6:1     |
| Marigold   | `#f3c140` | 9.2:1     |
| Coral      | `#fa733e` | 5.6:1     |
| Bubblegum  | `#f2a6cb` | 8.2:1     |
| Lilac      | `#b7a6e0` | 7.0:1     |
| Rose       | `#fb6a83` | 5.5:1     |

Rose is reserved for destructive actions and errors, always with a word or icon. Each spot has a **tint** (mixed toward paper, for fields and quiet fills) and a **shade** (92% spot, 8% ink, printed without grain, for a pressed state), computed flat in OKLab; neither is ever translucent.

## Colourways

A colourway assigns spots to six roles. The kit maps them to shadcn's tokens, so every shadcn part follows.

| Role      | Job                                            | shadcn token             |
| --------- | ---------------------------------------------- | ------------------------ |
| Canvas    | The page inside the mat                        | `--background`           |
| Plane     | Cards, panels, popovers                        | `--card`, `--popover`    |
| Plane 2   | Secondary panels, table bands, segmented track | `--secondary`, `--muted` |
| Action    | Primary buttons, on switches, progress         | `--primary`              |
| Highlight | Selection, the current item, the active tab    | `--accent`               |
| Clouds    | The front cloud bank; the back bank is paper   | `--cloud`                |

Ink is `--foreground`, `--border`, `--input` and `--ring` in every colourway. Proposed print runs:

| Colourway | Canvas             | Plane     | Plane 2    | Action   | Highlight  | Clouds    |
| --------- | ------------------ | --------- | ---------- | -------- | ---------- | --------- |
| Sky       | sky                | bubblegum | marigold   | coral    | seafoam    | marigold  |
| Pistachio | pistachio          | bubblegum | seafoam    | coral    | marigold   | bubblegum |
| Coral     | coral              | marigold  | bubblegum  | sky      | cornflower | marigold  |
| Marigold  | marigold           | lilac     | bubblegum  | coral    | seafoam    | bubblegum |
| Night     | prussian `#1d3b57` | lilac     | cornflower | marigold | bubblegum  | lilac     |

Drawings add six roles of their own (structure, stair, platform, sun, bloom, leaf), and panels that need several colours side by side (figures, badges, avatars) take four tones; `specimen/tokens.css` lists both per colourway.

**Night** is the poster printed on a dark card: the canvas is a deep pigment and text placed directly on it turns paper (9.0:1); planes, controls and drawings stay bright with ink text. It sets shadcn's `.dark`, so components that read it work, but it is a colourway, not an inverted page.

## The interface

How the rules land on controls (see the specimen's Interface section):

| Part              | Treatment                                                                                                                                                                                                 |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Panel, card       | A plane in its colourway colour, fine outline, 24 px radius; feature panels may take an arched top                                                                                                        |
| Primary button    | A pill in the action colour, ink label in extended capitals                                                                                                                                               |
| Secondary button  | A pill in plane 2; outline button: just the line, on whatever is beneath                                                                                                                                  |
| Destructive       | A rose pill with its word                                                                                                                                                                                 |
| Hover             | A short interior contour line appears inside the pill's upper left, the ligne-claire highlight                                                                                                            |
| Pressed           | The fill steps to its shade (mixed toward ink, flat)                                                                                                                                                      |
| Focus             | A second thin ring outside the first, with a gap of the colour beneath: concentric rings, visible on any canvas                                                                                           |
| Field             | A pill (or a 16 px-radius box for text areas) filled with a tint of the plane it sits on, fine outline                                                                                                    |
| Switch            | A pill track; the knob is a pinwheel that rolls as it slides                                                                                                                                              |
| Checkbox, radio   | A rounded square and a circle, fine outline; a fine ink tick and a solid ink dot                                                                                                                          |
| Segmented control | A plane 2 pill track with the chosen segment as a highlight pill                                                                                                                                          |
| Tabs              | A row of archways: a semicircular head on straight jambs, a second line inside the head for the arch's depth, the label below the spring line; the chosen arch takes the panel's colour and opens into it |
| Badge             | A small flat pill in the mono face                                                                                                                                                                        |
| Progress          | A pill slot filled with louvers: ink and the action colour in thin horizontal slats, like stair risers                                                                                                    |
| Slider            | A fine line track; the filled part a thicker line in the action colour; a pinwheel thumb                                                                                                                  |
| Avatar            | A circle in a spot colour, initials in extended capitals, stipple on the shadow side                                                                                                                      |
| Table             | Fine ink rules between rows; figures in mono; the selected row a highlight band                                                                                                                           |
| Dialog            | A plane with a big radius over the page, which a fine stipple screen covers                                                                                                                               |
| Section edges     | Cloud banks with flat baselines between sections; never a horizontal rule across a page                                                                                                                   |
| Empty state       | An archway with a solid ink doorway, a sparkle above, one line of text and one action                                                                                                                     |
| Disabled          | The tint fill and a muted ink; never transparency                                                                                                                                                         |
| Invalid           | A rose second ring and a message in ink below                                                                                                                                                             |

Calm controls, lively surfaces, as in Patina and Fineliner: what people operate is flat and quiet; the colour and the drawings carry the delight.

**Poster mode** is an appearance setting. On, the page is the triptych's print: the canvas in a rounded frame with a fine line, inside a paper mat (8–22 px, narrower on phones). Off (the default), there is no mat and no frame: the canvas runs to the window's edges, for apps and full-bleed sites. Everything inside the canvas is the same in both.

## Voices

| Voice   | Proposal                                                                             | Job                                                    |
| ------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| Display | **Serigraph Display** (our own): wide, round, flat, cream fill, fine outline, inline | Titles, heroes, wordmarks, large figures; 32 px and up |
| Sans    | **Serigraph Sans** (our own): extended, monoline, tracked capitals                   | Labels, navigation, buttons, kickers, metadata         |
| Read    | Archivo, until Serigraph Sans has a reading lowercase                                | Body text and interface sentences                      |
| Mono    | **Serigraph Mono** (our own): light, rounded-square, slotted zero                    | Badges, figures in tables, keys, code                  |

Until the fonts exist, the specimen draws display lettering with its own prototype (below) and sets Sans and Mono in stand-ins: Archivo at its widest for the extended capitals and Martian Mono for the mono.

## Type and space

From a Golden Ratio Typography audit of Archivo (`tokens.css` holds the numbers): a 16 px body at a line height of 1.618 in a 34rem measure (about 76 characters); sizes of 16 × φ^(n/2), so 12.6, 16, 20.4, 25.9, 32.9 and 41.9 px, each with a line height tuned to the measure; six spacing units of 25.9 × φ^n (6.1, 9.9, 16, 25.9, 41.9 and 67.8 px), on which controls (41.9 px), radii and gaps sit. Archivo's x-height is large (0.77), so no x-height correction is applied. Exceptions: display lettering runs past the scale, and compact controls are 32 px, shadcn's small size.

## Our own letters

Three faces, built in this repository from code (`npm run build:fonts`), MIT. One **skeleton alphabet** in the kit (`src/serigraph/letters/`) draws every capital, figure and mark as centre lines at a cap height of 100; a face is that skeleton swept by a square pen of a given width (`tools/fonts`, with Clipper's offsetter: mitred joins to a limit of 2, square caps, diagonals cut flat by the glyph's box). The capitals cover every Latin-script European language (112 accented capitals from 15 marks, and Æ Ø Œ Þ Ŋ); lowercase sets the same capitals in Display and Sans.

| Face                     | Pen and set                                                                                 | Job                                            |
| ------------------------ | ------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Serigraph Display        | Heavy (stem 21% of the cap height), cap 800, a tenth of the cap height between letters      | Titles, heroes, wordmarks, figures, from 32 px |
| Serigraph Display Inline | The thin line beside each left stem, round-ended                                            | Set over Display in ink                        |
| Serigraph Sans           | Light (12% Regular, 15% Bold), 18% wider, cap 700; superiors behind `ordn`                  | Labels, navigation, buttons, kickers, metadata |
| Serigraph Mono           | Light, one 600-unit cell; its own lowercase on rounded-square bowls and flat-bottomed domes | Figures in tables, keys, code                  |

- **Display lettering** is two layers, set by the kit's `lettering` utility and `<Lettering>`: Display in paper with an ink outline, and Display Inline over it in ink. The outline is a text stroke painted under the fill, so it shows outside each letter and inside its counters, at the line's weight or 1.1% of the em, whichever is more. This replaced the brief's Fill and Line fonts and the COLRv0 idea: one font per layer and the browser's own stroke keep the line the same width at every size. The text is read once; the inline layer is hidden from assistive technology.
- **Sans** sets the poster's caption voice. `font-variant-numeric: ordinal` raises the letters after a figure (15TH), as on the triptych, without the brief's underline.
- **Mono** has a zero with two louver slots, `ss01` (staircase diagonals for 2, 7, Z and both slashes), and four ornaments in the Private Use Area (U+E000 sparkle, U+E001 double ring, U+E002 louvers, U+E003 a cloud tile that runs on seamlessly), reached by code point, never by ligatures or real characters.
- Archivo stays the reading face until Sans has a reading lowercase.

## Motifs

| Motif                   | Drawn as                                                                       | Used for                                        |
| ----------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------- |
| Cloud bank              | Puffs on a flat baseline, outlined as one shape, open arcs where puffs overlap | Section edges, headers, behind dialogs, footers |
| Pinwheel                | Twelve curved wedges of paper and one colour in a fine ring                    | Switch knob, slider thumb, spinner, medallions  |
| Archway                 | A round-topped opening with a solid ink doorway                                | Tabs, image frames, empty states                |
| Louvers                 | Thin alternating slats of ink and colour                                       | Progress, stair undersides, chart series        |
| Platform                | A flat ellipse with a solid ink underside                                      | Drawings, featured figures                      |
| Sparkle                 | A four-point concave star, fine outline, paper fill                            | Empty space, "new", success                     |
| Stipple                 | Ink dots 2–3 px apart on the shadow side of a round form                       | Avatars, medallions, drawings                   |
| Hollow circle, pinpoint | Small rings and single ink dots                                                | Empty space                                     |

## Drawings: Follies (the signature)

Patina's signature is seeded prints of abstract motifs and Fineliner's is seeded pen drawings of things. Serigraph's is **Follies**: seeded surreal architecture in the triptych's manner (arcades, round platforms with black undersides, staircases with louvered undersides, domes, columns, pinwheel suns, tall flowers and stacked cloud banks), composed from hand-made templates whose proportions, counts and colours vary by seed. Every fill is a colourway role, so a drawing reprints in each colourway the way the triptych does. Formats: poster (heroes), window (an arch-topped card image), medallion (avatars, featured figures), band (a cloud and arcade section edge) and doorway (empty states).

Follies is woven through a page, not boxed into a hero: a whole city (layered cloud strata, a sun, an arcade with a louvered arch, a tower with an observatory, a block framing a pinwheel, a stair whose treads show, plants, front clouds) fills the hero and closes the page; at section edges a building rises behind the cloud band and a plant grows in front of it; cards look out through arched windows. The operated interface stays clear of drawings.

**The object library** is the vocabulary scenes and pages are composed from: 69 objects on 2026-11-06, each a seeded drawing in its own box, in seven collections. Architecture (a spiral stair and a taller spiral tower, a column, an obelisk, a lighthouse, an arched gateway, a bridge); the sky (a sunburst, a ringed planet, a crescent moon, a comet, a shooting star, an eclipse, a constellation, a rainbow, a cumulus, a cloud puff, a star cluster, the moon's phases); instruments (two telescopes, a globe, an armillary sphere, a compass, an hourglass, a sextant, a sundial, binoculars, a lantern, a weathervane, a key); the garden (a cypress, a topiary, a palm, a cactus, a poppy, daisies, an allium, a fern, an urn, a fountain, a hedge arch, an orange tree); travel and post (a balloon, a kite, a paper plane, an envelope, a ticket, a parcel, a zeppelin, a sailing boat, a suitcase, an umbrella, a signpost, a stamp); the stage (a microphone, a speaker stack, a spotlight, a record, a little stage, a poster column, a megaphone); and everyday moments, stand-ins for what every site needs (an open door, a padlock, a magnifier, a bell, a checklist, a lightbulb, a flag). Every object keeps the one view and light: flat roles in the ink line, the shaded side stippled, tops a step lighter, openings in ink. It is meant to keep growing.

**Composition** follows the triptych, where one scene runs through the lettering: the hero's spiral tower climbs out of the city's clouds to stand behind the name; a section's words sit beside a scene that rises from the section's foot (the observatory beside Meridian, the stage beside the letters); an arcade's niches carry a procession of objects across the page; every page's band draws two objects of its own; each group of parts has an emblem. A drawing beside a title stands on the title's baseline.

Follies never uses the reference's own subjects: no mannequin heads, no windmill, no tulips, no figures. The generated explorations in `docs/style/explorations/round-2` copied some of them; they are direction only, and everything the kit ships is drawn by code from a seed.

## Motion

The page is printed, so motion is the print and the mechanism, never the paper:

- **Passes**: a hero may print colour by colour, the ink line last, once, on first view.
- **Pinwheels** turn: a switch knob rolls the distance it travels; a spinner turns at a steady pace.
- **Louvers** flip like blinds when an accordion opens; progress fills slat by slat.
- **Clouds** drift a few pixels in heroes, slowly; nothing drifts in the operated interface.
- Controls answer in 120–180 ms on one curve; everything stops under reduced motion.

## Choices

Agreed on 2026-11-05: the direction, the colourways and Night, fields in a tint of the plane beneath, a pressed fill that steps to its shade, a fine stipple screen behind dialogs, and Archivo as the reading face. Standing as defaults the maintainer may still change: the line weight (1.5 px), the names, Follies, our three fonts, and the concentric focus ring. Poster mode is off by default (2026-11-06).
