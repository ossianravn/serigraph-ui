// The city: the hero's whole scene, at the triptych's density.
import { box, DEPTH, observatory, steps } from "./buildings"
import { pinwheelArch, plant } from "./plants"
import { cloudBank } from "./clouds"
import { circle, scatter, shape } from "./motifs"
import { arcade } from "./parts"
import { el, rs } from "./svg"
import type { Scene } from "./scene"

const mirror = (w: number, flip: boolean, svg: string) =>
  flip ? el("g", { transform: `translate(${w} 0) scale(-1 1)` }, svg) : svg

export /** The city: cloud strata, a sun, an arcade, a tower with an observatory, a pinwheel block, a stair, plants, clouds. */
const city: Scene = {
  w: 1200,
  h: 560,
  fit: "xMidYMax slice",
  body: (p, seed) => {
    const [W, ground] = [1200, 640]
    const r = (k: string) => rs(seed, k)
    const [sun, sky, tw, bk] = [r("sun"), r("sky"), r("tower"), r("block")]
    const arc = arcade(p, r("arcade"), {
      x0: r("arcade-x").between(50, 110),
      top: r("arcade-y").between(250, 285),
      ground,
    })
    const [tx, tWidth, ty] = [
      tw.between(820, 870),
      tw.between(150, 175),
      tw.between(285, 325),
    ]
    const bx = Math.min(tx - 190, Math.max(arc.x1 - 40, bk.between(560, 620)))
    const by = bk.between(350, 380)
    const scene =
      shape(
        p,
        circle(
          sun.between(170, 300),
          sun.between(140, 175),
          sun.between(68, 88),
        ),
        "sun",
      ) +
      scatter(p, sky, {
        x0: 30,
        y0: 60,
        x1: 1170,
        y1: 230,
        sparkles: 7,
        rings: 5,
        dots: 9,
      }) +
      cloudBank(p, r("strata-a"), {
        x0: -20,
        x1: sky.between(380, 480),
        base: 322,
        top: 262,
        rmin: 18,
        rmax: 32,
        fill: "paper",
        floating: true,
      }) +
      cloudBank(p, r("strata-b"), {
        x0: sky.between(680, 760),
        x1: W + 20,
        base: 292,
        top: 236,
        rmin: 16,
        rmax: 30,
        fill: "paper",
        floating: true,
      }) +
      (tw.chance(0.6)
        ? box(p, {
            x: tx + tWidth + 26,
            y: ty + 90,
            w: 84,
            h: ground - ty - 90,
            fill: "tone-2",
            windows: 2,
          })
        : "") +
      box(p, {
        x: tx,
        y: ty,
        w: tWidth,
        h: ground - ty,
        fill: "tone-1",
        windows: 3,
      }) +
      observatory(p, tw, {
        cx: tx + tWidth / 2,
        base: ty + DEPTH[1] * 0.5,
        rad: tWidth * 0.42,
        fill: "plane-2",
      }) +
      arc.svg +
      cloudBank(p, r("mid"), {
        x0: 0,
        x1: W,
        base: ground,
        top: r("mid-top").between(405, 430),
        rmin: 32,
        rmax: 60,
        fill: "paper",
      }) +
      box(p, { x: bx, y: by, w: 190, h: ground - by, fill: "tone-3" }) +
      pinwheelArch(p, {
        x: bx + 34,
        base: by + 178,
        w: 122,
        h: 150,
        frame: "leaf",
        colour: "bloom",
      }) +
      steps(p, {
        x0: bx - 8,
        y0: 580,
        x1: bx - 8 - r("steps").between(230, 270),
        y1: arc.top,
        count: r("steps").int(11, 14),
        fill: "stair",
        depth: 2,
      }) +
      cloudBank(p, r("front"), {
        x0: 0,
        x1: W,
        base: ground,
        top: r("front-top").between(492, 512),
        rmin: 28,
        rmax: 56,
        fill: "cloud",
      }) +
      plant(p, r("plant-a"), {
        x: r("plant-a").between(70, 150),
        ground: 600,
        height: 250,
        blooms: 2,
      }) +
      plant(p, r("plant-b"), {
        x: r("plant-b").between(1050, 1140),
        ground: 600,
        height: 220,
        blooms: 1,
      }) +
      scatter(p, r("low"), {
        x0: 260,
        y0: 518,
        x1: 940,
        y1: 548,
        sparkles: 3,
        rings: 2,
        dots: 4,
        size: [7, 11],
      })
    return mirror(W, r("layout").chance(0.5), scene)
  },
}
