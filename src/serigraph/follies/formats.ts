// The smaller formats: a window for arch-topped card images, a medallion, the band between sections, the arcade wall
// at a section's head and the doorway of an empty state.
import { box, DEPTH, observatory } from "./buildings"
import { pinwheelArch, plant } from "./plants"
import { arcadeBand, cloudBank } from "./clouds"
import { circle, pinwheel, scatter, shape } from "./motifs"
import { platform } from "./parts"
import { el, rs } from "./svg"
import type { Scene } from "./scene"

/** A window: a platform and dome above clouds under a pinwheel sun, for an arch-topped card image. */
export const windowScene: Scene = {
  w: 300,
  h: 320,
  fit: "xMidYMax slice",
  body: (p, seed) => {
    const [W, ground] = [300, 360]
    const r = (k: string) => rs(seed, k)
    const sun = r("sun")
    return (
      pinwheel(
        p,
        sun.between(200, 240),
        sun.between(70, 96),
        sun.between(30, 38),
        "sun",
        { turn: sun.next() * 6 },
      ) +
      scatter(p, r("sky"), {
        x0: 20,
        y0: 20,
        x1: 180,
        y1: 120,
        sparkles: 2,
        rings: 2,
        dots: 3,
        size: [6, 10],
      }) +
      cloudBank(p, r("back"), {
        x0: 0,
        x1: W,
        base: ground,
        top: 170,
        rmin: 26,
        rmax: 44,
        fill: "paper",
      }) +
      platform(p, r("platform"), {
        cx: r("px").between(120, 170),
        cy: 180,
        rx: 78,
        ground,
        dome: true,
      }) +
      cloudBank(p, r("front"), {
        x0: 0,
        x1: W,
        base: ground,
        top: 236,
        rmin: 22,
        rmax: 38,
        fill: "cloud",
      })
    )
  },
}

/** A medallion: a pinwheel, or a pinwheel seen through an arch on clouds, in a round frame (avatars, featured figures). */
export const medallion: Scene = {
  w: 120,
  h: 120,
  fit: "xMidYMid meet",
  body: (p, seed) => {
    const r = rs(seed, "medallion")
    const clip = p.uid("medal")
    const ring = circle(60, 60, 54)
    const inner = r.chance(0.5)
      ? pinwheel(p, 60, 60, 70, r.pick(["sun", "bloom", "structure"]), {
          turn: r.next() * 6,
          ring: false,
        })
      : shape(p, "M 0 0 H 120 V 120 H 0 Z", "canvas") +
        pinwheelArch(p, {
          x: r.between(30, 36),
          base: 104,
          w: 52,
          h: 74,
          frame: r.pick(["structure", "bloom", "platform"]),
          colour: "sun",
        }) +
        cloudBank(p, rs(seed, "medal-cloud"), {
          x0: 0,
          x1: 120,
          base: 140,
          top: 92,
          rmin: 10,
          rmax: 16,
          fill: "cloud",
        })
    return (
      el("clipPath", { id: clip }, el("path", { d: ring }, null)) +
      el("g", { "clip-path": `url(#${clip})` }, inner) +
      shape(p, ring, "none")
    )
  },
}

/** The band between sections: a cloud bank with a building rising behind it and a plant in front. */
export const band: Scene = {
  w: 3200,
  h: 210,
  fit: "xMidYMax slice",
  body: (p, seed) => {
    const [w, h] = [3200, 210]
    const r = (k: string) => rs(seed, k)
    const s = h / 200
    const ax = w / 2 + r("x").between(80, 360)
    const kind = r("kind").pick(["observatory", "arch", "tower"])
    let art = cloudBank(p, r("back"), {
      x0: w / 2 - 200,
      x1: w,
      base: h,
      top: h * 0.36,
      rmin: h * 0.1,
      rmax: h * 0.18,
      fill: "paper",
    })
    if (kind === "observatory") {
      art += box(p, {
        x: ax,
        y: h * 0.5,
        w: 150 * s,
        h,
        fill: "tone-1",
        windows: 3,
      })
      art += observatory(p, r("obs"), {
        cx: ax + 75 * s,
        base: h * 0.5 + DEPTH[1] * 0.5,
        rad: 62 * s,
        fill: "plane-2",
      })
    } else if (kind === "arch") {
      art += box(p, {
        x: ax + 150 * s,
        y: h * 0.34,
        w: 80 * s,
        h,
        fill: "tone-2",
        windows: 1,
      })
      art += box(p, { x: ax, y: h * 0.1, w: 140 * s, h, fill: "tone-3" })
      art += pinwheelArch(p, {
        x: ax + 24 * s,
        base: h * 0.7,
        w: 92 * s,
        h: h * 0.52,
        frame: "leaf",
        colour: "bloom",
      })
    } else {
      art += box(p, {
        x: ax + 92 * s,
        y: h * 0.3,
        w: 80 * s,
        h,
        fill: "tone-2",
        windows: 1,
      })
      art += box(p, {
        x: ax,
        y: h * 0.08,
        w: 96 * s,
        h,
        fill: "tone-4",
        windows: 2,
      })
    }
    art += cloudBank(p, r("clouds"), {
      x0: 0,
      x1: w,
      base: h,
      top: h * 0.56,
      rmin: h * 0.11,
      rmax: h * 0.2,
      fill: "cloud",
    })
    art += plant(p, r("plant"), {
      x: w / 2 - r("plant-x").between(260, 520),
      ground: h + 10,
      height: h * 0.95,
      blooms: 2,
    })
    return (
      art +
      scatter(p, r("sky"), {
        x0: w / 2 - 240,
        y0: h * 0.08,
        x1: w / 2 + 60,
        y1: h * 0.45,
        sparkles: 3,
        rings: 2,
        dots: 4,
        size: [6, 11],
      })
    )
  },
}

/** The arcade wall at the head of a section: arches open onto the section below. */
export const arcadeWall: Scene = {
  w: 3200,
  h: 104,
  fit: "xMidYMin slice",
  body: (p) => arcadeBand(p, { width: 3200 }),
}

/** The empty state: an archway with a solid ink doorway, a sparkle above it, on a small cloud. */
export const doorway: Scene = {
  w: 160,
  h: 150,
  fit: "xMidYMax meet",
  body: (p, seed) => {
    const r = rs(seed, "doorway")
    return (
      shape(p, "M 40 132 V 62 A 40 40 0 0 1 120 62 V 132 Z", "structure") +
      shape(p, "M 64 132 V 88 A 16 16 0 0 1 96 88 V 132 Z", "ink") +
      scatter(p, r, {
        x0: 20,
        y0: 6,
        x1: 140,
        y1: 30,
        sparkles: 2,
        rings: 1,
        dots: 2,
        size: [6, 10],
      }) +
      cloudBank(p, rs(seed, "doorway-cloud"), {
        x0: 6,
        x1: 154,
        base: 146,
        top: 112,
        rmin: 9,
        rmax: 15,
        fill: "cloud",
        floating: true,
      })
    )
  },
}
