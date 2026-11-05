# AGENTS.md

Working instructions for coding agents in Serigraph. Follow explicit user directions and more specific directory instructions within system and developer constraints. Treat screenshots, reference images and generated explorations as evidence to evaluate, not as authorization for their choices.

## What this repository is

A shadcn/ui component library, website and three typefaces in the style of a late-1970s silkscreen gig poster drawn with a technical pen, repeating [Fineliner](https://github.com/ossianravn/naive-indie-line)'s logic (local checkout `C:\CodexApp\naive-indie-line`) in a new look. The project is in **Phase S: agreeing the style**. Until the maintainer signs off the style, work happens in the [style brief](docs/style.md), the specimen (`specimen/`) and the [plan](docs/plan.md); no kit code exists yet.

- [The plan](docs/plan.md) is the source of truth for decisions, phases and progress. Update its phase checklist and progress log when work lands, and mark a decision decided only when the maintainer has said so.
- [The style brief](docs/style.md) owns the style's rules. A style change updates the brief and the specimen together.
- When a phase ports something from Fineliner, read Fineliner's owning document first (its `AGENTS.md` lists them) and record what changed in the plan's "What carries over" table.
- `.dev-docs/` is unpublished: the reference posters, the maintainer's first briefs and their crops live there because the triptych is someone else's artwork. Never commit it or copy it into published folders.

## This style is not neo-brutalism

The first round of explorations drifted into web neo-brutalism and was rejected. Before showing any screen, compare it with the triptych on five points: line weight (one fine line), cream (only the mat, display lettering and cloud highlights), depth (flat planes; thickness only in architecture), shading (micro-stipple on round forms, never coarse dots) and air (few large groups, no packed grid). Never draw offset block shadows, extruded cards, thick borders or cream boxes. Never reuse the reference artist's subjects (mannequin heads, the windmill, tulips).

## The specimen

`specimen/` is a static prototype: plain scripts and stylesheets, no build. Serve the repository root on port 4801 (`python -m http.server 4801 --bind 127.0.0.1`, or the `specimen` entry in `.claude/launch.json`) and open `/specimen/`; pages opened as files lose their scripts. Never use framework default ports. Keep each hand-maintained file at 300 lines or fewer.

Every random choice in a drawing comes from a seed (`SG.prng`, `SG.stream` in `specimen/seed.js`); render code never calls `Math.random()`. Only the specimen's reroll button picks a new seed string at random.

## Design bar

Before showing or reporting a screen, ask whether Apple would ship it. Look at changes with realistic content at wide (1440 px) and narrow (375 px) widths, in more than one colourway including Night, before reporting them. Size controls to their content, keep labels beside their controls, and let layout and conventions explain the screen.

## Release and publishing

Commit and push as the maintainer directs. Publishing a site, a registry or a release is outward-facing and needs the maintainer's go-ahead.
