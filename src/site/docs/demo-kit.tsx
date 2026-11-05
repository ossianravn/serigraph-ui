import {
  Children,
  createContext,
  useContext,
  type CSSProperties,
  type ReactNode,
} from "react"

/** What a component's docs page needs from its demo file, besides the default export. */
export interface DemoMeta {
  title: string
  /** One sentence on what the component is for. */
  description: string
  /** Registry item that installs it. */
  item: string
  /** Its group on the Components index. */
  group?:
    | "Actions"
    | "Forms"
    | "Overlays"
    | "Navigation"
    | "Data display"
    | "Charts"
    | "Conversation"
    | "Serigraph extras"
}

type Claim = (part: "section" | "row") => boolean

/**
 * Preview mode, for the Components index: a demo shows its first example row alone, without section titles or
 * state labels. Each preview gets its own `previewClaim()`, which answers true once per part; it relies on rendering
 * in order, as the server renderer does.
 */
export const DemoPreview = createContext<Claim | null>(null)

export function previewClaim(): Claim {
  const taken = new Set<string>()
  return (part) => !taken.has(part) && Boolean(taken.add(part))
}

/** The named columns the rows of the current section line up in (DemoSection's `columns`). */
const Columns = createContext<readonly string[]>([])

/** A row's columns when its section names them (from md): each as wide as its widest usual example. Narrower, the
 * examples wrap and the column names are hidden. */
const columnStyle = (n: number) =>
  n
    ? ({
        "--cols": `repeat(${n}, minmax(max-content, 11rem))`,
      } as CSSProperties)
    : undefined
const COLUMNS = "md:grid md:[grid-template-columns:var(--cols)]"

/** The two-column frame every row shares: the state's name, then its examples. */
const ROW =
  "grid grid-cols-[minmax(0,1fr)] items-start gap-x-section gap-y-hair md:grid-cols-[9rem_minmax(0,1fr)]"

/** A label beside a control-height row lines up with the control's words; beside a taller example, with its top. */
const ROW_LABEL = "caps md:pt-[calc((var(--control-height)-1lh)/2+0.25rem)]"

/**
 * A titled group of examples on a docs page. With `columns`, the rows line their examples up under those names
 * (a state and its disabled twin), and the names head the section.
 */
export function DemoSection({
  title,
  columns,
  children,
}: {
  title: string
  columns?: readonly string[]
  children: ReactNode
}) {
  const preview = useContext(DemoPreview)
  if (preview)
    return preview("section") ? (
      <Columns.Provider value={columns ?? []}>{children}</Columns.Provider>
    ) : null
  const n = columns?.length ?? 0
  return (
    <section className="py-snug">
      <h2 className="m-0 mb-tight font-read text-lead leading-lead font-semibold">
        {title}
      </h2>
      {columns && (
        <div className="hidden md:block" aria-hidden="true">
          <div className={`${ROW} pt-tight`}>
            <span />
            <div className={`gap-tight ${COLUMNS}`} style={columnStyle(n)}>
              {columns.map((c) => (
                <span key={c} className="caps">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      <Columns.Provider value={columns ?? []}>{children}</Columns.Provider>
    </section>
  )
}

/** One labelled row in a state matrix: the state's name on the left, the example beside it. */
export function StateRow({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  const preview = useContext(DemoPreview)
  const columns = useContext(Columns)
  const n = columns.length
  // A preview leaves out a disabled twin: the part at rest is the picture.
  if (preview)
    return preview("row") ? (
      <div className="flex min-w-0 flex-wrap items-center justify-center gap-tight">
        {n
          ? Children.toArray(children).filter(
              (_, i) => columns[i] !== "Disabled",
            )
          : children}
      </div>
    ) : null
  return (
    <div className={`${ROW} py-tight`}>
      <span className={ROW_LABEL}>{label}</span>
      <div
        className={`flex min-h-control min-w-0 flex-wrap items-center gap-tight py-1 ${n ? `md:justify-items-start ${COLUMNS}` : ""}`}
        style={columnStyle(n)}
      >
        {children}
      </div>
    </div>
  )
}
