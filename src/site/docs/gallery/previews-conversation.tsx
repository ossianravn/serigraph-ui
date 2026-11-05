import { ArrowDownIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/serigraph/ui/avatar"
import { Bubble, BubbleContent } from "@/serigraph/ui/bubble"
import { Button } from "@/serigraph/ui/button"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "@/serigraph/ui/message"
import {
  Trace,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/serigraph/ui/trace"
import { week } from "../demos/chart/data"

// Conversation parts and the chart, whose demos open with a long thread, a run of steps that only the browser draws,
// or a chart that Recharts measures in the browser: the same parts with less in them, and the chart drawn as a
// static picture in its own marks (flat, stipple and louvers in the ink line).

function MessagePreview() {
  return (
    <Message className="w-[19rem]">
      <MessageAvatar>
        <Avatar data-tone="3">
          <AvatarFallback>M</AvatarFallback>
        </Avatar>
      </MessageAvatar>
      <MessageContent>
        <MessageHeader>
          <b>Meridian</b>
          <time dateTime="2026-11-05T18:42">18:42</time>
        </MessageHeader>
        <Bubble variant="secondary">
          <BubbleContent>
            Seeing is 4 of 5 after 21:00, clear until 23:00.
          </BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  )
}

function MessageScrollerPreview() {
  return (
    <div className="flex w-[17rem] flex-col gap-hair">
      <Bubble align="end">
        <BubbleContent>Is the Zeiss free at half nine?</BubbleContent>
      </Bubble>
      <Bubble variant="secondary">
        <BubbleContent>From 21:30, for ten minutes.</BubbleContent>
      </Bubble>
      <Button variant="outline" size="xs" className="mt-hair self-center">
        Latest message <ArrowDownIcon data-icon="inline-end" />
      </Button>
    </div>
  )
}

const CHOICE =
  "flex items-center gap-tight rounded-box border-(length:--line) border-ink px-snug py-tight leading-ui"
const DOT =
  "grid size-5 shrink-0 place-items-center rounded-full border-(length:--line) border-ink"

/** The questionnaire's first question as it opens: its progress, the question and two choices, one chosen. */
function QuestionnairePreview() {
  return (
    <div className="plane grid w-[18rem] gap-tight p-snug">
      <div className="flex items-center gap-1 font-mono text-small">
        {[1, 2, 3].map((n) => (
          <span key={n} className="contents">
            {n > 1 && (
              <span className="w-3 border-t-(length:--line) border-ink" />
            )}
            <span
              className={`grid size-5 place-items-center rounded-full border-(length:--line) border-ink ${n === 1 ? "outline-(length:--line) outline-offset-2 outline-ink outline-solid" : ""}`}
            >
              {n}
            </span>
          </span>
        ))}
      </div>
      <p className="m-0 text-lead leading-ui font-semibold">
        Where will you observe?
      </p>
      <div className={CHOICE}>
        <span className={`${DOT} field-fill`} />
        The telescope deck
      </div>
      <div className={CHOICE}>
        <span className={`${DOT} bg-highlight`}>
          <span className="size-2 rounded-full bg-ink" />
        </span>
        Under the dome
      </div>
    </div>
  )
}

function TracePreview() {
  return (
    <Trace className="w-[17rem]">
      <TraceLine status="done">
        <TraceIcon>1</TraceIcon>
        <TraceTitle>Read Ada’s question</TraceTitle>
        <TraceDescription>0.2 s</TraceDescription>
      </TraceLine>
      <TraceLine status="done">
        <TraceIcon>2</TraceIcon>
        <TraceTitle>Fetch the forecast</TraceTitle>
      </TraceLine>
      <TraceLine status="running">
        <TraceIcon>3</TraceIcon>
        <TraceTitle>Check the Zeiss bookings</TraceTitle>
      </TraceLine>
    </Trace>
  )
}

const W = 252
const BASE = 108
const SERIES = [
  { key: "show", fill: "var(--chart-1)" },
  { key: "talk", fill: "url(#gallery-chart-stipple)" },
  { key: "telescope", fill: "url(#gallery-chart-louvers)" },
] as const

/** Seats sold by session, stacked, as the chart demo's second chart prints them. */
function ChartPreview() {
  const total = (d: (typeof week)[number]) => d.show + d.talk + d.telescope
  const max = Math.max(...week.map(total))
  const step = W / week.length
  const scale = (BASE - 6) / max
  return (
    <figure className="m-0 flex w-[16rem] flex-col gap-hair">
      <figcaption className="caps">Seats sold this week</figcaption>
      <svg viewBox={`0 0 ${W} ${BASE + 1}`} className="block w-full">
        <defs>
          <pattern
            id="gallery-chart-stipple"
            width={4}
            height={4}
            patternUnits="userSpaceOnUse"
          >
            <rect width={4} height={4} fill="var(--chart-2)" />
            <circle cx={1} cy={1} r={0.7} fill="var(--ink)" />
            <circle cx={3} cy={3} r={0.7} fill="var(--ink)" />
          </pattern>
          <pattern
            id="gallery-chart-louvers"
            width={6}
            height={5}
            patternUnits="userSpaceOnUse"
          >
            <rect width={6} height={5} fill="var(--chart-4)" />
            <rect y={3} width={6} height={2} fill="var(--ink)" />
          </pattern>
        </defs>
        {[0.5, 1].map((f) => (
          <line
            key={f}
            x1={0}
            x2={W}
            y1={BASE - (BASE - 6) * f}
            y2={BASE - (BASE - 6) * f}
            stroke="var(--ink)"
            strokeWidth={0.75}
            strokeDasharray="2 3"
          />
        ))}
        {week.map((d, i) => {
          let y = BASE
          return SERIES.map(({ key, fill }) => {
            const h = d[key] * scale
            y -= h
            return h > 0 ? (
              <rect
                key={`${d.night}-${key}`}
                x={i * step + step * 0.2}
                y={y}
                width={step * 0.6}
                height={h}
                fill={fill}
                stroke="var(--ink)"
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
              />
            ) : null
          })
        })}
        <line
          x1={0}
          x2={W}
          y1={BASE}
          y2={BASE}
          stroke="var(--ink)"
          strokeWidth={1.5}
        />
      </svg>
      <p className="m-0 flex justify-around font-mono text-small">
        {week.map((d) => (
          <span key={d.night}>{d.night.slice(0, 2)}</span>
        ))}
      </p>
    </figure>
  )
}

export const CONVERSATION_PREVIEWS = {
  message: MessagePreview,
  "message-scroller": MessageScrollerPreview,
  questionnaire: QuestionnairePreview,
  trace: TracePreview,
  chart: ChartPreview,
}
