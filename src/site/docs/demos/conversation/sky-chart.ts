// A stand-in photo of tonight's sky chart for the conversation demos, so they need no network: the horizon ring on
// Night's blue, Cassiopeia's W in marigold and Saturn low in the south, as a self-contained image.

const STARS = [
  [28, 40],
  [38, 52],
  [48, 42],
  [58, 54],
  [68, 38],
  [24, 74],
  [44, 88],
  [72, 24],
  [90, 46],
  [96, 64],
  [52, 70],
  [34, 22],
] as const

const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">',
  '<rect width="120" height="120" fill="#1d3b57"/>',
  '<circle cx="60" cy="60" r="50" fill="none" stroke="#eae3c8" stroke-width="1.5"/>',
  '<path d="M60 10v100M10 60h100" stroke="#eae3c8" stroke-width="0.75" stroke-dasharray="2 3"/>',
  '<polyline points="28,40 38,52 48,42 58,54 68,38" fill="none" stroke="#f3c140" stroke-width="1.5" stroke-linejoin="round"/>',
  ...STARS.map(
    ([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#eae3c8"/>`,
  ),
  '<ellipse cx="80" cy="82" rx="7" ry="2.4" fill="none" stroke="#f3c140" stroke-width="1.2" transform="rotate(-18 80 82)"/>',
  '<circle cx="80" cy="82" r="3.4" fill="#f3c140"/>',
  "</svg>",
].join("")

export const SKY_CHART = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
