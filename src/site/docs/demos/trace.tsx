import { ExternalLinkIcon } from "lucide-react"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/serigraph/ui/trace"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Trace",
  description:
    "The steps an assistant took to reach an answer, numbered in order, each one open for its detail.",
  item: "trace",
  group: "Conversation",
}

type Step = {
  title: string
  note: string
  detail: string
  status: "done" | "running" | "pending" | "error"
}

const STEPS: Step[] = [
  {
    title: "Read Ada’s question",
    note: "0.2 s",
    status: "done",
    detail:
      "Is the seeing good enough for Saturn tonight; two people, arriving around 21:00.",
  },
  {
    title: "Fetch the forecast",
    note: "18:30",
    status: "done",
    detail:
      "Cloud 12% until 23:00, then high cloud from the west. Wind 4 m/s from the north-west, dropping after dark.",
  },
  {
    title: "Read the seeing sensor",
    note: "4 of 5",
    status: "done",
    detail:
      "Steady air from 21:00. Saturn clears the trees to the south at 19:50 and is highest at 21:40.",
  },
  {
    title: "Check the Zeiss bookings",
    note: "5 Nov",
    status: "running",
    detail:
      "The 150 mm refractor is booked until 21:30 and free from 21:30 to 22:00; the deck holds eight.",
  },
  {
    title: "Draft the reply",
    note: "",
    status: "pending",
    detail:
      "Say yes, give the window and the seeing, offer two seats at 21:30.",
  },
]

function Steps({ steps, open }: { steps: Step[]; open?: number }) {
  return (
    <Trace className="max-w-[34rem]">
      {steps.map((step, index) => (
        <TraceCollapsible key={step.title} defaultOpen={index === open}>
          <TraceCollapsibleTrigger>
            <TraceLine status={step.status}>
              <TraceIcon>{index + 1}</TraceIcon>
              <TraceTitle>{step.title}</TraceTitle>
              {step.note ? (
                <TraceDescription>{step.note}</TraceDescription>
              ) : null}
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>{step.detail}</TraceCollapsibleContent>
        </TraceCollapsible>
      ))}
    </Trace>
  )
}

export default function TraceDemo() {
  return (
    <>
      <DemoSection title="Checking tonight’s seeing">
        <Steps steps={STEPS} open={2} />
      </DemoSection>
      <DemoSection title="States">
        <StateRow label="Done">
          <Trace>
            <TraceLine status="done">
              <TraceIcon>1</TraceIcon>
              <TraceTitle>Read Ada&rsquo;s question</TraceTitle>
              <TraceDescription>0.2 s</TraceDescription>
            </TraceLine>
          </Trace>
        </StateRow>
        <StateRow label="Running">
          <Trace>
            <TraceLine status="running">
              <TraceIcon>4</TraceIcon>
              <TraceTitle>Check the Zeiss bookings</TraceTitle>
            </TraceLine>
          </Trace>
        </StateRow>
        <StateRow label="Pending">
          <Trace>
            <TraceLine status="pending">
              <TraceIcon>5</TraceIcon>
              <TraceTitle>Draft the reply</TraceTitle>
            </TraceLine>
          </Trace>
        </StateRow>
        <StateRow label="Error">
          <Trace>
            <TraceLine status="error">
              <TraceIcon>2</TraceIcon>
              <TraceTitle>Read the sky chart</TraceTitle>
              <TraceDescription>too faint</TraceDescription>
            </TraceLine>
          </Trace>
        </StateRow>
        <StateRow label="No status">
          <Trace>
            <TraceLine>
              <TraceIcon>2</TraceIcon>
              <TraceTitle>Fetch the forecast</TraceTitle>
            </TraceLine>
          </Trace>
        </StateRow>
        <StateRow label="As a link">
          <Trace>
            <a href="#forecast">
              <TraceLine status="done">
                <TraceIcon>2</TraceIcon>
                <TraceTitle>Opened tonight&rsquo;s forecast</TraceTitle>
                <TraceIcon>
                  <ExternalLinkIcon />
                </TraceIcon>
              </TraceLine>
            </a>
          </Trace>
        </StateRow>
      </DemoSection>
      <DemoSection title="A step that failed">
        <Steps
          open={1}
          steps={[
            STEPS[0]!,
            {
              title: "Read the sky chart",
              note: "too faint",
              status: "error",
              detail:
                "The photo of Ada’s chart is too dark to make out the labels. Carrying on with Saturn, as her message says.",
            },
            STEPS[1]!,
            STEPS[2]!,
          ]}
        />
      </DemoSection>
    </>
  )
}
