// Composed scenes, continued: the observatory platform and the stage in the clouds.
import { cloudBank } from "./clouds"
import { scatter } from "./motifs"
import { OBJECTS, put } from "./objects"
import { slab } from "./objects/forms"
import type { Scene } from "./scene"
import { rs } from "./svg"

/** An observatory: a telescope on a round platform on the clouds, a ringed planet and the moon above, a constellation. */
export const observatoryScene: Scene = {
  w: 800,
  h: 720,
  fit: "xMidYMax meet",
  body: (p, seed) => {
    const r = rs(seed, "observatory")
    const scope = OBJECTS["great-telescope"] ?? OBJECTS["telescope"]
    const planet = OBJECTS["ringed-planet"]
    const moon = OBJECTS["crescent-moon"]
    const stars = OBJECTS["constellation"]
    const plant = OBJECTS["cypress"] ?? OBJECTS["palm"]
    return (
      (stars
        ? put(p, seed, stars, { x: 40, y: 260, h: 220, key: "stars" })
        : "") +
      (planet
        ? put(p, seed, planet, {
            x: r.between(480, 540),
            y: 250,
            h: 210,
            key: "planet",
          })
        : "") +
      (moon
        ? put(p, seed, moon, { x: 300, y: 150, h: 110, key: "moon" })
        : "") +
      scatter(p, rs(seed, "observatory-sky"), {
        x0: 20,
        y0: 20,
        x1: 780,
        y1: 300,
        sparkles: 4,
        rings: 3,
        dots: 6,
      }) +
      (plant
        ? put(p, seed, plant, { x: 90, y: 660, h: 340, key: "plant" })
        : "") +
      slab(p, { cx: 450, y: 566, rx: 200, thick: 26, fill: "platform" }) +
      (scope
        ? put(p, seed, scope, { x: 250, y: 580, h: 460, key: "scope" })
        : "") +
      cloudBank(p, rs(seed, "observatory-clouds"), {
        x0: 20,
        x1: 780,
        base: 712,
        top: 600,
        rmin: 26,
        rmax: 44,
        fill: "paper",
        floating: true,
      })
    )
  },
}

/** A stage on the clouds: a poster column, a spotlight raking across it, speakers and a microphone, sparkles above. */
export const stageScene: Scene = {
  w: 800,
  h: 600,
  fit: "xMidYMax meet",
  body: (p, seed) => {
    const r = rs(seed, "stage")
    const column = OBJECTS["advertising-column"]
    const light = OBJECTS["spotlight"]
    const speakers = OBJECTS["speaker-stack"]
    const mic = OBJECTS["microphone"]
    const sun = OBJECTS["sun-rays"]
    return (
      (sun
        ? put(p, seed, sun, {
            x: r.between(420, 520),
            y: 260,
            h: 220,
            key: "sun",
          })
        : "") +
      scatter(p, rs(seed, "stage-sky"), {
        x0: 20,
        y0: 20,
        x1: 780,
        y1: 220,
        sparkles: 4,
        rings: 3,
        dots: 6,
      }) +
      (column
        ? put(p, seed, column, { x: 230, y: 540, h: 440, key: "column" })
        : "") +
      (speakers
        ? put(p, seed, speakers, { x: 590, y: 548, h: 230, key: "speakers" })
        : "") +
      (mic ? put(p, seed, mic, { x: 470, y: 552, h: 230, key: "mic" }) : "") +
      (light
        ? put(p, seed, light, { x: 0, y: 556, h: 210, key: "light" })
        : "") +
      cloudBank(p, rs(seed, "stage-clouds"), {
        x0: 10,
        x1: 790,
        base: 596,
        top: 520,
        rmin: 22,
        rmax: 36,
        fill: "cloud",
        floating: true,
      })
    )
  },
}
