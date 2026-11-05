import { prng, seedOf } from "@/serigraph/follies"

// A stand-in photograph for the frame demos: a plate of the night sky over Meridian's dome, as an image file would be
// (fixed colours, no colourway), drawn from a seed so the server and the browser show the same stars.
export function starPlate(seed: string, w = 300, h = 400) {
  const r = prng(seedOf(seed))
  const stars = Array.from({ length: 70 }, () => {
    const x = (r() * w).toFixed(1)
    const y = (r() * h * 0.78).toFixed(1)
    const s = (0.6 + r() ** 3 * 2.2).toFixed(2)
    return `<circle cx="${x}" cy="${y}" r="${s}" fill="#eae3c8"/>`
  }).join("")
  const dome = `<path d="M0 ${h} V${h * 0.86} H${w * 0.3} A${w * 0.2} ${w * 0.2} 0 0 1 ${w * 0.7} ${h * 0.86} H${w} V${h} Z" fill="#262420"/>`
  const moon = `<circle cx="${w * 0.72}" cy="${h * 0.2}" r="${w * 0.07}" fill="#f3c140"/><circle cx="${w * 0.75}" cy="${h * 0.19}" r="${w * 0.065}" fill="#1d3b57"/>`
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="#1d3b57"/>${stars}${moon}${dome}</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
