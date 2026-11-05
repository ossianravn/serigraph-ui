// The capitals A to Z: wide, with round shoulders, slot-like counters, an arch-topped A and U-shaped W and Y.
// Each is [span, draw]: the span between its left and right skeleton lines, and its centre lines in that frame.
import { ccw, cw, diag, rr, v, type Def } from "./skeleton"

// prettier-ignore
export const CAPITALS: Record<string, Def> = {
  A: [63, ({ l, r, t, b }) => {
    const k = (r - l) / 2
    return { d: `M ${l} ${b} V ${t + k} ${cw(k)} ${l + k} ${t} ${cw(k)} ${r} ${t + k} V ${b} M ${l} 63 H ${r}`, inl: [] }
  }],
  B: [57, ({ l, r, t, b }) => {
    const [m, k1, k2, r1] = [46, 16, 19, r - 5]
    return {
      d: `M ${l} ${m} H ${r - k2} ${cw(k2)} ${r} ${m + k2} V ${b - k2} ${cw(k2)} ${r - k2} ${b} H ${l} V ${t} ` +
        `H ${r1 - k1} ${cw(k1)} ${r1} ${t + k1} V ${m - k1} ${cw(k1)} ${r1 - k1} ${m} H ${l}`,
      inl: [],
    }
  }],
  C: [57, ({ l, r, t, b }) => ({ d: `M ${r} ${t} H ${l + 26} ${ccw(26)} ${l} ${t + 26} V ${b - 26} ${ccw(26)} ${l + 26} ${b} H ${r}`, inl: [] })],
  D: [59, ({ l, r, t, b }) => ({ d: `M ${l} ${t} H ${r - 26} ${cw(26)} ${r} ${t + 26} V ${b - 26} ${cw(26)} ${r - 26} ${b} H ${l} Z`, inl: [] })],
  E: [47, ({ l, r, t, b }) => ({ d: `M ${r} ${t} H ${l} V ${b} H ${r} M ${l} 50 H ${r - 6}`, inl: [] })],
  F: [45, ({ l, r, t, b }) => ({ d: `M ${r} ${t} H ${l} V ${b} M ${l} 52 H ${r - 8}`, inl: [] })],
  G: [59, ({ l, r, t, b }) => ({
    d: `M ${r} ${t} H ${l + 26} ${ccw(26)} ${l} ${t + 26} V ${b - 26} ${ccw(26)} ${l + 26} ${b} H ${r} V 56 H ${r - 22}`,
    inl: [],
  })],
  H: [59, ({ l, r, t, b }) => ({ d: `M ${l} ${t} V ${b} M ${r} ${t} V ${b} M ${l} 52 H ${r}`, inl: [] })],
  I: [0, ({ l, t, b }) => ({ d: `M ${l} ${t} V ${b}`, inl: [] })],
  J: [45, ({ l, r, t, b }) => ({ d: `M ${r} ${t} V ${b - 24} ${cw(24)} ${r - 24} ${b} H ${l}`, inl: [] })],
  K: [59, ({ l, t, b, w }) => ({ d: `M ${l} ${t} V ${b} M ${w + 8} -10 L ${l + 4} 60 M ${l + 22} 46 L ${w + 8} 112`, inl: [], clip: true })],
  L: [43, ({ l, r, t, b }) => ({ d: `M ${l} ${t} V ${b} H ${r}`, inl: [] })],
  M: [73, ({ l, r, t, b, c, h }) => ({ d: `M ${l} ${t} V ${b} M ${r} ${t} V ${b} M ${l - h * 0.6} -12 L ${c} 62 L ${r + h * 0.6} -12`, inl: [], clip: true })],
  N: [59, ({ l, r, t, b, h }) => ({ d: `M ${l} ${t} V ${b} M ${r} ${t} V ${b} M ${l - h * 0.2} -14 L ${r + h * 0.2} 114`, inl: [], clip: true })],
  O: [63, ({ l, r, t, b }) => ({ d: rr(l, t, r, b, 28), inl: [] })],
  P: [55, ({ l, r, t, b }) => ({ d: `M ${l} ${b} V ${t} H ${r - 20} ${cw(20)} ${r} ${t + 20} V 34 ${cw(20)} ${r - 20} 54 H ${l}`, inl: [] })],
  Q: [63, ({ l, r, t, b, w, c }) => ({ d: `${rr(l, t, r, b, 28)} M ${c + 4} 66 L ${w + 10} 116`, inl: [], clip: true })],
  R: [57, ({ l, r, t, b, w }) => ({
    d: `M ${l} ${b} V ${t} H ${r - 20} ${cw(20)} ${r} ${t + 20} V 32 ${cw(20)} ${r - 20} 52 H ${l} M ${r - 18} 52 L ${w + 10} 116`,
    inl: [],
    clip: true,
  })],
  S: [55, ({ l, r, t, b }) => {
    const m = 48
    const [k1, k2] = [(m - t) / 2, (b - m) / 2]
    return {
      d: `M ${r} ${t} H ${l + k1} ${ccw(k1)} ${l} ${t + k1} ${ccw(k1)} ${l + k1} ${m} H ${r - k2} ${cw(k2)} ${r} ${m + k2} ${cw(k2)} ${r - k2} ${b} H ${l}`,
      inl: [],
    }
  }],
  T: [53, ({ l, r, t, b, c }) => ({ d: `M ${l} ${t} H ${r} M ${c} ${t} V ${b}`, inl: [] })],
  U: [59, ({ l, r, t, b }) => ({ d: `M ${l} ${t} V ${b - 26} ${ccw(26)} ${l + 26} ${b} H ${r - 26} ${ccw(26)} ${r} ${b - 26} V ${t}`, inl: [] })],
  V: [63, ({ l, r, b, c, h }) => ({ d: `M ${l - h * 0.76} -14 L ${c - 9} ${b} H ${c + 9} L ${r + h * 0.76} -14`, inl: [], clip: true })],
  W: [77, ({ l, r, t, b, c }) => ({
    d: `M ${l} ${t} V ${b - 24} ${ccw(24)} ${l + 24} ${b} H ${r - 24} ${ccw(24)} ${r} ${b - 24} V ${t} M ${c} 30 V ${b}`,
    inl: [],
  })],
  X: [61, ({ w }) => ({ d: `M -8 -14 L ${w + 8} 114 M ${w + 8} -14 L -8 114`, inl: [], clip: true })],
  Y: [59, ({ l, r, t, b, c }) => ({
    d: `M ${l} ${t} V 36 ${ccw(20)} ${l + 20} 56 H ${r - 20} ${ccw(20)} ${r} 36 V ${t} M ${c} 56 V ${b}`,
    inl: [],
  })],
  Z: [53, ({ l, r, t, b }) => ({ d: `M ${l} ${t} H ${r} L ${l} ${b} H ${r}`, inl: [] })],
}

/** Inlines beside the left stems, for Serigraph Display. */
// prettier-ignore
export const INLINES: Record<string, (f: import("./skeleton").Frame) => import("./skeleton").Inline[]> = {
  A: (f) => [v(f, f.l, f.t + (f.r - f.l) / 2, 92)],
  B: (f) => [v(f, f.l, 8, 92)],
  C: (f) => [v(f, f.l, f.t + 26, f.b - 26)],
  D: (f) => [v(f, f.l, 8, 92)],
  E: (f) => [v(f, f.l, 8, 92)],
  F: (f) => [v(f, f.l, 8, 92)],
  G: (f) => [v(f, f.l, f.t + 26, f.b - 26)],
  H: (f) => [v(f, f.l, 8, 92)],
  I: (f) => [v(f, f.l, 8, 92)],
  K: (f) => [v(f, f.l, 8, 92)],
  L: (f) => [v(f, f.l, 8, 92)],
  M: (f) => [v(f, f.l, 8, 92)],
  N: (f) => [v(f, f.l, 8, 92)],
  O: (f) => [v(f, f.l, f.t + 28, f.b - 28)],
  P: (f) => [v(f, f.l, 8, 92)],
  Q: (f) => [v(f, f.l, f.t + 28, f.b - 28)],
  R: (f) => [v(f, f.l, 8, 92)],
  T: (f) => [v(f, f.c, 24, 92)],
  U: (f) => [v(f, f.l, 8, f.b - 26)],
  V: (f) => [diag(f, f.l - f.h * 0.76, -14, f.c - 9, f.b, 0.2, 0.86)],
  W: (f) => [v(f, f.l, 8, f.b - 24)],
  Y: (f) => [v(f, f.l, 8, 36)],
}
