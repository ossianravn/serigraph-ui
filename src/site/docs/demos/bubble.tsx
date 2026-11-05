import { StarIcon } from "lucide-react"
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@/serigraph/ui/bubble"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Bubble",
  description:
    "One turn of a conversation: your words in the highlight, the other side’s in a tone, each a small plane in the ink line.",
  item: "bubble",
  group: "Conversation",
}

const VARIANTS = [
  ["default", "Is the seeing good enough for Saturn tonight?"],
  ["secondary", "Yes: 4 of 5 after 21:00, with the rings wide open."],
  ["muted", "The Zeiss refractor is free from 21:30 to 22:00."],
  ["tinted", "Book the Zeiss at 21:30"],
  ["outline", "Show me tonight’s planets"],
  ["ghost", "Checked at 18:42 · forecast for Thursday 5 November"],
  ["destructive", "The sky chart didn’t arrive. Try sending it again."],
] as const

const SUGGESTIONS = ["Book the Zeiss at 21:30", "When does the Moon rise?"]

export default function BubbleDemo() {
  return (
    <>
      <DemoSection title="Variants">
        {VARIANTS.map(([variant, text]) => (
          <StateRow key={variant} label={variant}>
            <Bubble variant={variant}>
              <BubbleContent>{text}</BubbleContent>
            </Bubble>
          </StateRow>
        ))}
        <StateRow label="secondary · tones">
          {(["2", "3", "4"] as const).map((tone) => (
            <Bubble key={tone} variant="secondary" data-tone={tone}>
              <BubbleContent>Tone {tone}</BubbleContent>
            </Bubble>
          ))}
        </StateRow>
      </DemoSection>
      <DemoSection title="Both sides">
        <BubbleGroup className="max-w-[38rem] gap-tight">
          <Bubble align="end">
            <BubbleContent>
              Is the seeing good enough for Saturn tonight? We&rsquo;re coming
              up from town and could be there by nine.
            </BubbleContent>
          </Bubble>
          <Bubble variant="secondary">
            <BubbleContent>
              It is: 4 of 5 after 21:00, clear until 23:00. The rings are wide
              open this year, and the Zeiss refractor is free from 21:30.
            </BubbleContent>
          </Bubble>
          <Bubble align="end">
            <BubbleContent>Perfect. Can my daughter come too?</BubbleContent>
          </Bubble>
          <Bubble variant="secondary" className="mb-tight">
            <BubbleContent>
              Of course. She&rsquo;ll get the step stool and the first look.
            </BubbleContent>
            <BubbleReactions aria-label="2 stars">
              <StarIcon aria-hidden="true" />2
            </BubbleReactions>
          </Bubble>
        </BubbleGroup>
      </DemoSection>
      <DemoSection title="As buttons">
        <StateRow label="Suggestions">
          {SUGGESTIONS.map((text) => (
            <Bubble key={text} variant="outline">
              <BubbleContent render={<button type="button" />}>
                {text}
              </BubbleContent>
            </Bubble>
          ))}
        </StateRow>
        <StateRow label="Tinted link">
          <Bubble variant="tinted">
            <BubbleContent render={<a href="#sky-chart" />}>
              Tonight&rsquo;s sky chart
            </BubbleContent>
          </Bubble>
        </StateRow>
      </DemoSection>
    </>
  )
}
