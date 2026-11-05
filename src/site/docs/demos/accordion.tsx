import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/serigraph/ui/accordion"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Accordion",
  description:
    "Rows of questions or sections that open one at a time, so a long page of answers stays easy to scan.",
  item: "accordion",
  group: "Data display",
}

const QUESTIONS = [
  {
    value: "clouds",
    title: "What happens if it is cloudy?",
    body: "Dome shows and talks go ahead whatever the weather. Telescope sessions move to the next clear night, or we refund your seats the same evening.",
  },
  {
    value: "children",
    title: "Can children come to the telescope sessions?",
    body: "Yes, from age six. Under-eights keep a hand on a grown-up on the deck, and the guide brings a step for the eyepiece.",
  },
  {
    value: "dress",
    title: "What should I wear on the deck?",
    body: "More than you think. The deck is open to the sky and loses its heat quickly after dark; a hat and gloves help from October to March.",
  },
]

export default function AccordionDemo() {
  return (
    <DemoSection title="Modes">
      <StateRow label="One at a time">
        <Accordion defaultValue={["clouds"]} className="max-w-[36rem]">
          {QUESTIONS.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>{item.title}</AccordionTrigger>
              <AccordionContent>
                <p>{item.body}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </StateRow>
      <StateRow label="Several open">
        <Accordion
          multiple
          defaultValue={["programme", "deck"]}
          className="max-w-[36rem]"
        >
          <AccordionItem value="programme">
            <AccordionTrigger>Thursday 5 November</AccordionTrigger>
            <AccordionContent>
              <p>
                Vera Rubin on Saturn at opposition at 19:30, then the Zeiss
                refractor on the deck every half hour until the clouds come in.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="deck">
            <AccordionTrigger>On the deck</AccordionTrigger>
            <AccordionContent>
              <p>
                Twelve places at the refractor, ten at the Dobsonian. Red
                torches at the door.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="recording" disabled>
            <AccordionTrigger>Recording</AccordionTrigger>
            <AccordionContent>
              <p>This evening’s talk is not recorded.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </StateRow>
    </DemoSection>
  )
}
