# Serigraph

A shadcn/ui component library, website and three typefaces in the style of a late-1970s silkscreen gig poster drawn with a technical pen: flat, luminous spot colours laid on one another, one fine ink line, weightless surreal architecture rising out of cloud banks, and wide round lettering with a line inside each stem. Themes are colourways: the same print with its colours rotated.

<img alt="An exploration of the style: the same phone ticket screen printed in sky blue, pistachio and coral colourways, each with an observatory dome on a round platform above cloud banks." src="docs/style/explorations/round-2/colourways.webp">

**Status:** Phases 0 to 2 done: the kit's tokens, five colourways, the printed grain, surfaces and marks, the appearance runtime, our own fonts (Serigraph Display, Sans and Mono, see `/letters`), Follies, the seeded drawings, and their motifs (see `/press`), and a shadcn registry built from the source (`npm run registry`, not yet hosted). Phase 3 is done: shadcn's 28 core parts with their docs at `/docs`, and Meridian, a demo observatory built from them, at `/meridian`. The rest of the components and the site follow ([plan](docs/plan.md)). The image above is a generated exploration, for direction only.

## Run the site

Requires Node.js 24 and npm 11.

```sh
npm ci
```

```sh
npm run dev
```

Open `http://127.0.0.1:4801`. Checks: `typecheck`, `lint`, `format:check`, `build`, `test:seeds` (every Follies template against its snapshot) and `check:contrast` (every text pair in every colourway, with the grain composited in). `npm run build:textures` regenerates the grain; `npm run build:fonts` rebuilds the fonts from the skeleton alphabet.

The static prototype the style was agreed on stays in `specimen/`, with the lettering prototype, Follies and the interface sampler:

```sh
python -m http.server 4803 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4803/specimen/`.

## Documents

| Document                     | What it owns                                                                      |
| ---------------------------- | --------------------------------------------------------------------------------- |
| [Plan](docs/plan.md)         | Goals, decisions, phases, progress, risks, open questions                         |
| [Style brief](docs/style.md) | The style's rules, colour, colourways, interface, type and space, letters, motifs |
| [Changelog](CHANGELOG.md)    | What each phase shipped                                                           |
| [AGENTS.md](AGENTS.md)       | Working instructions for coding agents                                            |

Serigraph repeats [Fineliner](https://github.com/ossianravn/naive-indie-line)'s logic, which repeated [Patina UI](https://github.com/ossianravn/patina-ui)'s, in a new style.

## License

Code, art and generated textures: [MIT](LICENSE). Serigraph Display, Sans and Mono are MIT too. Archivo, the reading face for now, is under the SIL Open Font License, shipped with its Fontsource package.
