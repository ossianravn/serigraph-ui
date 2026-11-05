import { useState } from "react"
import {
  FileTextIcon,
  ImageIcon,
  MapIcon,
  RotateCcwIcon,
  XIcon,
} from "lucide-react"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/serigraph/ui/attachment"
import { Button } from "@/serigraph/ui/button"
import { Spinner } from "@/serigraph/ui/spinner"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"
import { SKY_CHART } from "./conversation/sky-chart"

export const meta: DemoMeta = {
  title: "Attachment",
  description:
    "A file handed over with a message, as a small pill: what it is, how big, and whether it has arrived.",
  item: "attachment",
  group: "Conversation",
}

function Remove({ name, onClick }: { name: string; onClick?: () => void }) {
  return (
    <AttachmentActions>
      <AttachmentAction aria-label={`Remove ${name}`} onClick={onClick}>
        <XIcon />
      </AttachmentAction>
    </AttachmentActions>
  )
}

function Chart({ onRemove }: { onRemove?: () => void }) {
  return (
    <Attachment>
      <AttachmentMedia variant="image">
        <img src={SKY_CHART} alt="" />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>sky-chart-nov-5.png</AttachmentTitle>
        <AttachmentDescription>Photo · 1.8 MB</AttachmentDescription>
      </AttachmentContent>
      <Remove name="sky-chart-nov-5.png" onClick={onRemove} />
    </Attachment>
  )
}

function Plan({ onRemove }: { onRemove?: () => void }) {
  return (
    <Attachment>
      <AttachmentMedia>
        <MapIcon />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>deck-plan.pdf</AttachmentTitle>
        <AttachmentDescription>PDF · 240 KB</AttachmentDescription>
      </AttachmentContent>
      <Remove name="deck-plan.pdf" onClick={onRemove} />
    </Attachment>
  )
}

const ALL = ["chart", "plan", "list"]

function Composer() {
  const [files, setFiles] = useState(ALL)
  const drop = (file: string) => () =>
    setFiles((current) => current.filter((f) => f !== file))
  return (
    <div className="max-w-[34rem]">
      {files.length > 0 ? (
        <AttachmentGroup>
          {files.includes("chart") ? <Chart onRemove={drop("chart")} /> : null}
          {files.includes("plan") ? <Plan onRemove={drop("plan")} /> : null}
          {files.includes("list") ? (
            <Attachment size="sm">
              <AttachmentMedia>
                <FileTextIcon />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>observing-list.txt</AttachmentTitle>
                <AttachmentDescription>Text · 2 KB</AttachmentDescription>
              </AttachmentContent>
              <Remove name="observing-list.txt" onClick={drop("list")} />
            </Attachment>
          ) : null}
        </AttachmentGroup>
      ) : (
        <div className="flex min-h-control items-center gap-tight py-2">
          <p className="m-0 text-small leading-small">Nothing attached.</p>
          <Button variant="outline" size="sm" onClick={() => setFiles(ALL)}>
            Put them back
          </Button>
        </div>
      )}
    </div>
  )
}

export default function AttachmentDemo() {
  return (
    <>
      <DemoSection title="Files and pictures">
        <StateRow label="Pills">
          <Chart />
          <Plan />
        </StateRow>
        <StateRow label="Tiles">
          <Attachment orientation="vertical">
            <AttachmentMedia variant="image">
              <img src={SKY_CHART} alt="" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>sky-chart-nov-5.png</AttachmentTitle>
              <AttachmentDescription>1.8 MB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentTrigger aria-label="Open sky-chart-nov-5.png" />
            <Remove name="sky-chart-nov-5.png" />
          </Attachment>
          <Attachment orientation="vertical">
            <AttachmentMedia variant="image">
              <img src={SKY_CHART} alt="Tonight’s sky chart" />
            </AttachmentMedia>
          </Attachment>
        </StateRow>
      </DemoSection>
      <DemoSection title="States">
        <StateRow label="Idle">
          <Attachment state="idle">
            <AttachmentMedia>
              <ImageIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>saturn-through-the-zeiss.jpg</AttachmentTitle>
              <AttachmentDescription>Waiting · 2.4 MB</AttachmentDescription>
            </AttachmentContent>
            <Remove name="saturn-through-the-zeiss.jpg" />
          </Attachment>
        </StateRow>
        <StateRow label="Uploading">
          <Attachment state="uploading">
            <AttachmentMedia variant="image">
              <img src={SKY_CHART} alt="" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>sky-chart-nov-5.png</AttachmentTitle>
              <AttachmentDescription>
                Uploading · 1.2 of 1.8 MB
              </AttachmentDescription>
            </AttachmentContent>
            <Remove name="sky-chart-nov-5.png" />
          </Attachment>
        </StateRow>
        <StateRow label="Processing">
          <Attachment state="processing">
            <AttachmentMedia>
              <Spinner />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>sky-chart-nov-5.png</AttachmentTitle>
              <AttachmentDescription>Reading the stars</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        </StateRow>
        <StateRow label="Error">
          <Attachment state="error">
            <AttachmentMedia>
              <ImageIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>sky-chart-2.png</AttachmentTitle>
              <AttachmentDescription>Empty file · 0 KB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Try sky-chart-2.png again">
                <RotateCcwIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        </StateRow>
        <StateRow label="Name only">
          <Attachment>
            <AttachmentContent>
              <AttachmentTitle>november-programme.pdf</AttachmentTitle>
              <AttachmentDescription>PDF · 88 KB</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        </StateRow>
      </DemoSection>
      <DemoSection title="Sizes">
        {(["default", "sm", "xs"] as const).map((size) => (
          <StateRow key={size} label={size}>
            <Attachment size={size}>
              <AttachmentMedia>
                <MapIcon />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>deck-plan.pdf</AttachmentTitle>
                {size === "xs" ? null : (
                  <AttachmentDescription>PDF · 240 KB</AttachmentDescription>
                )}
              </AttachmentContent>
            </Attachment>
          </StateRow>
        ))}
      </DemoSection>
      <DemoSection title="In a message">
        <Composer />
      </DemoSection>
    </>
  )
}
