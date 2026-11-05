# Serigraph

A shadcn/ui component library, website and three typefaces in the style of a late-1970s silkscreen gig poster drawn with a technical pen: flat, luminous spot colours laid on one another, one fine ink line, weightless surreal architecture rising out of cloud banks, and wide round lettering with a line inside each stem. Themes are colourways: the same print with its colours rotated.

<img alt="An exploration of the style: the same phone ticket screen printed in sky blue, pistachio and coral colourways, each with an observatory dome on a round platform above cloud banks." src="docs/style/explorations/round-2/colourways.webp">

**Status:** Phase S, agreeing the style. There is no kit code yet: the [style brief](docs/style.md), the [plan](docs/plan.md) and a static specimen are under review. The image above is a generated exploration, for direction only.

## The specimen

Serve the repository root and open the specimen:

```sh
python -m http.server 4801 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4801/specimen/`. It shows the colourways, the lettering prototype, the motifs, a seeded folly and the interface sampler; the Appearance button switches colourway, line, fields, pressed state, dialog backdrop, reading face and grain.

## Documents

| Document                     | What it owns                                                     |
| ---------------------------- | ---------------------------------------------------------------- |
| [Plan](docs/plan.md)         | Goals, decisions, phases, progress, risks, open questions        |
| [Style brief](docs/style.md) | The style's rules, colour, colourways, interface, letters, motifs |
| [AGENTS.md](AGENTS.md)       | Working instructions for coding agents                           |

Serigraph repeats [Fineliner](https://github.com/ossianravn/naive-indie-line)'s logic, which repeated [Patina UI](https://github.com/ossianravn/patina-ui)'s, in a new style.

## License

MIT (proposed; see the plan's L9).
