// The letters the capitals lack, the accents (drawn with a lighter mark pen) and every accented capital a
// Latin-script European language needs, composed from a base letter and its marks.
import {
  ccw,
  cw,
  dot,
  rr,
  v,
  type Def,
  type Frame,
  type Inline,
} from "./skeleton"

// prettier-ignore
export const EXTRA_LETTERS: Record<string, Def> = {
  Æ: [77, ({ l, r, t, b }) => {
    const [k, m] = [20, l + 40]
    return { d: `M ${l} ${b} V ${t + k} ${cw(k)} ${l + k} ${t} H ${r} M ${m} ${t} V ${b} H ${r} M ${m} 52 H ${r - 6} M ${l} 63 H ${m}`, inl: [] }
  }],
  Ø: [63, ({ l, r, t, b, w }) => ({ d: `${rr(l, t, r, b, 28)} M ${w + 4} -10 L -4 110`, inl: [], clip: true })],
  Œ: [85, ({ l, r, t, b }) => {
    const m = l + 52
    return { d: `M ${m} ${t} H ${l + 26} ${ccw(26)} ${l} ${t + 26} V ${b - 26} ${ccw(26)} ${l + 26} ${b} H ${r} M ${m} ${t} V ${b} M ${m} ${t} H ${r} M ${m} 50 H ${r - 6}`, inl: [] }
  }],
  Þ: [55, ({ l, r, t, b }) => ({ d: `M ${l} ${t} V ${b} M ${l} 22 H ${r - 18} ${cw(18)} ${r} 40 V 52 ${cw(18)} ${r - 18} 70 H ${l}`, inl: [] })],
  Ŋ: [59, ({ l, r, t, b }) => ({
    d: `M ${l} ${b} V ${t + 26} ${cw(26)} ${l + 26} ${t} H ${r - 26} ${cw(26)} ${r} ${t + 26} V 104 ${cw(14)} ${r - 14} 118 H ${r - 26}`,
    inl: [],
  })],
}

export const EXTRA_INLINES: Record<string, (f: Frame) => Inline[]> = {
  Æ: (f) => [v(f, f.l, f.t + 20, 92)],
  Ø: (f) => [v(f, f.l, f.t + 28, f.b - 28)],
  Œ: (f) => [v(f, f.l, f.t + 26, f.b - 26)],
  Þ: (f) => [v(f, f.l, 8, 92)],
  Ŋ: (f) => [v(f, f.l, f.t + 26, 92)],
}

/** Accents, centred on x, above the cap line (y < 0) or below the baseline (y > 100). Drawn with the mark pen. */
// prettier-ignore
export const MARKS: Record<string, (x: number) => string> = {
  acute: (x) => `M ${x - 6} -12 L ${x + 8} -28`,
  grave: (x) => `M ${x - 8} -28 L ${x + 6} -12`,
  circumflex: (x) => `M ${x - 13} -12 L ${x} -27 L ${x + 13} -12`,
  caron: (x) => `M ${x - 13} -27 L ${x} -12 L ${x + 13} -27`,
  dieresis: (x) => `${dot(x - 12, -18)} ${dot(x + 12, -18)}`,
  dot: (x) => dot(x, -18),
  ring: (x) => `M ${x - 9} -21 A 9 9 0 1 1 ${x + 9} -21 A 9 9 0 1 1 ${x - 9} -21 Z`,
  tilde: (x) => `M ${x - 15} -14 L ${x - 7} -23 L ${x + 7} -14 L ${x + 15} -23`,
  macron: (x) => `M ${x - 13} -18 H ${x + 13}`,
  breve: (x) => `M ${x - 12} -29 V -22 ${ccw(7)} ${x - 5} -15 H ${x + 5} ${ccw(7)} ${x + 12} -22 V -29`,
  doubleacute: (x) => `M ${x - 13} -12 L ${x - 5} -28 M ${x + 3} -12 L ${x + 11} -28`,
  ogonek: (x) => `M ${x} 100 V 110 ${ccw(6)} ${x + 6} 116 H ${x + 10}`,
  cedilla: (x) => `M ${x} 100 V 109 H ${x + 7} V 118 H ${x - 6}`,
  commabelow: (x) => `M ${x + 3} 106 V 110 L ${x - 2} 121`,
  apostrophe: (x) => `M ${x + 4} 0 V 8 L ${x} 20`,
}

/** Bars and strokes added to a base letter with the main pen. */
// prettier-ignore
export const BARS: Record<string, (f: Frame) => string> = {
  dbar: (f) => `M ${f.l - f.h * 0.4} 52 H ${f.l + 22}`,
  hbar: (f) => `M ${f.l} 26 H ${f.r}`,
  tbar: (f) => `M ${f.c - 16} 54 H ${f.c + 16}`,
  slash: (f) => `M ${f.l - 8} 64 L ${f.l + 16} 42`,
  middot: (f) => dot(f.l + 22, 54),
}

/** Where a mark sits: the centre, a stem, or an offset from the left stem. */
export type Anchor = "c" | "l" | "r" | number
export const anchor = (f: Frame, a: Anchor) =>
  a === "c" ? f.c : a === "l" ? f.l : a === "r" ? f.r : f.l + a

/** Every accented capital: base letter, then marks as [name, anchor] or bars by name. */
// prettier-ignore
export const COMPOSED: Record<string, [string, ...(string | [string, Anchor])[]]> = {
  À: ["A", ["grave", "c"]], Á: ["A", ["acute", "c"]], Â: ["A", ["circumflex", "c"]], Ã: ["A", ["tilde", "c"]],
  Ä: ["A", ["dieresis", "c"]], Å: ["A", ["ring", "c"]], Ā: ["A", ["macron", "c"]], Ă: ["A", ["breve", "c"]], Ą: ["A", ["ogonek", "r"]],
  Ç: ["C", ["cedilla", "c"]], Ć: ["C", ["acute", "c"]], Ĉ: ["C", ["circumflex", "c"]], Ċ: ["C", ["dot", "c"]], Č: ["C", ["caron", "c"]],
  Ď: ["D", ["caron", "c"]], Đ: ["D", "dbar"],
  È: ["E", ["grave", "c"]], É: ["E", ["acute", "c"]], Ê: ["E", ["circumflex", "c"]], Ë: ["E", ["dieresis", "c"]],
  Ē: ["E", ["macron", "c"]], Ĕ: ["E", ["breve", "c"]], Ė: ["E", ["dot", "c"]], Ę: ["E", ["ogonek", "r"]], Ě: ["E", ["caron", "c"]],
  Ĝ: ["G", ["circumflex", "c"]], Ğ: ["G", ["breve", "c"]], Ġ: ["G", ["dot", "c"]], Ģ: ["G", ["commabelow", "c"]],
  Ĥ: ["H", ["circumflex", "c"]], Ħ: ["H", "hbar"],
  Ì: ["I", ["grave", "c"]], Í: ["I", ["acute", "c"]], Î: ["I", ["circumflex", "c"]], Ï: ["I", ["dieresis", "c"]],
  Ĩ: ["I", ["tilde", "c"]], Ī: ["I", ["macron", "c"]], Ĭ: ["I", ["breve", "c"]], Į: ["I", ["ogonek", "l"]], İ: ["I", ["dot", "c"]],
  Ĵ: ["J", ["circumflex", "r"]], Ķ: ["K", ["commabelow", 14]],
  Ĺ: ["L", ["acute", "l"]], Ļ: ["L", ["commabelow", 14]], Ľ: ["L", ["apostrophe", 16]], Ŀ: ["L", "middot"], Ł: ["L", "slash"],
  Ñ: ["N", ["tilde", "c"]], Ń: ["N", ["acute", "c"]], Ņ: ["N", ["commabelow", "c"]], Ň: ["N", ["caron", "c"]],
  Ò: ["O", ["grave", "c"]], Ó: ["O", ["acute", "c"]], Ô: ["O", ["circumflex", "c"]], Õ: ["O", ["tilde", "c"]],
  Ö: ["O", ["dieresis", "c"]], Ō: ["O", ["macron", "c"]], Ŏ: ["O", ["breve", "c"]], Ő: ["O", ["doubleacute", "c"]],
  Ŕ: ["R", ["acute", "c"]], Ŗ: ["R", ["commabelow", 14]], Ř: ["R", ["caron", "c"]],
  Ś: ["S", ["acute", "c"]], Ŝ: ["S", ["circumflex", "c"]], Ş: ["S", ["cedilla", "c"]], Š: ["S", ["caron", "c"]], Ș: ["S", ["commabelow", "c"]],
  Ţ: ["T", ["cedilla", "c"]], Ť: ["T", ["caron", "c"]], Ŧ: ["T", "tbar"], Ț: ["T", ["commabelow", "c"]],
  Ù: ["U", ["grave", "c"]], Ú: ["U", ["acute", "c"]], Û: ["U", ["circumflex", "c"]], Ü: ["U", ["dieresis", "c"]],
  Ũ: ["U", ["tilde", "c"]], Ū: ["U", ["macron", "c"]], Ŭ: ["U", ["breve", "c"]], Ů: ["U", ["ring", "c"]], Ű: ["U", ["doubleacute", "c"]], Ų: ["U", ["ogonek", "c"]],
  Ŵ: ["W", ["circumflex", "c"]], Ẁ: ["W", ["grave", "c"]], Ẃ: ["W", ["acute", "c"]], Ẅ: ["W", ["dieresis", "c"]],
  Ý: ["Y", ["acute", "c"]], Ŷ: ["Y", ["circumflex", "c"]], Ÿ: ["Y", ["dieresis", "c"]], Ỳ: ["Y", ["grave", "c"]],
  Ź: ["Z", ["acute", "c"]], Ż: ["Z", ["dot", "c"]], Ž: ["Z", ["caron", "c"]],
}

/** Characters set with another glyph: look-alikes and the eth. */
export const SAME: [string, string][] = [
  ["Ð", "Đ"],
  ["‐", "-"],
  ["‑", "-"],
  ["′", "'"],
  ["″", '"'],
]
