// The whole alphabet for a pen: capitals, figures, punctuation, extra letters and every composed accented capital,
// with Display's inlines when asked. Lowercase sets the same capitals (the faces are unicase), mapped by the fonts.
import { CAPITALS, INLINES } from "./capitals"
import {
  anchor,
  BARS,
  COMPOSED,
  EXTRA_INLINES,
  EXTRA_LETTERS,
  MARKS,
} from "./extras"
import { FIGURE_INLINES, FIGURES } from "./figures"
import { frame, type Def, type Pen, type Skeleton } from "./skeleton"

export const DISPLAY_PEN: Pen = { h: 10.5, ext: 1 }

const DEFS: Record<string, Def> = { ...CAPITALS, ...FIGURES, ...EXTRA_LETTERS }
const INLINE = { ...INLINES, ...FIGURE_INLINES, ...EXTRA_INLINES }

export function alphabet(
  pen: Pen,
  { inline = false } = {},
): Record<string, Skeleton> {
  const out: Record<string, Skeleton> = {}
  const frames: Record<string, ReturnType<typeof frame>> = {}
  for (const [char, [span, draw]] of Object.entries(DEFS)) {
    const f = frame(span, pen)
    frames[char] = f
    const g = draw(f)
    out[char] = { w: f.w, ...g, inl: inline ? (INLINE[char]?.(f) ?? []) : [] }
  }
  for (const [char, [base, ...parts]] of Object.entries(COMPOSED)) {
    const b = out[base]
    const f = frames[base]
    if (!b || !f) throw new Error(`no base ${base} for ${char}`)
    let d = b.d
    let marks = b.marks ?? ""
    for (const part of parts) {
      if (typeof part === "string") {
        const bar = BARS[part]
        if (!bar) throw new Error(`no bar ${part}`)
        d += ` ${bar(f)}`
      } else {
        const mark = MARKS[part[0]]
        if (!mark) throw new Error(`no mark ${part[0]}`)
        marks += ` ${mark(anchor(f, part[1]))}`
      }
    }
    out[char] = { ...b, d, marks: marks.trim() || undefined }
  }
  return out
}

/** Every character the alphabet draws, in code-point order. */
export const CHARACTERS = Object.keys({
  ...DEFS,
  ...COMPOSED,
}).sort((a, b) => a.codePointAt(0)! - b.codePointAt(0)!)
