import {
  Collapsible,
  CollapsibleChevron,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/serigraph/ui/collapsible"
import { Separator } from "@/serigraph/ui/separator"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Collapsible",
  description:
    "A section that opens and closes in place, for detail a reader asks for rather than reads by default.",
  item: "collapsible",
  group: "Data display",
}

const QUESTIONS = [
  {
    q: "Can I bring children?",
    a: "Yes. Shows in the dome suit everyone from five; on the telescope deck, children under eight keep a hand on a grown-up.",
  },
  {
    q: "What happens if it’s cloudy?",
    a: "The planetarium show runs whatever the weather. Telescope sessions move to the next clear night at no cost, and we write by 17:00 if the forecast closes the dome.",
  },
]

const SKY = [
  {
    q: "Seeing, 4 of 5",
    a: "Steady air after 21:00, so Saturn’s rings and the Cassini division hold still at high magnification. Stars twinkle low in the east until then.",
  },
  {
    q: "Moonrise at 22:14",
    a: "A thin crescent, 4% lit, low in the east-south-east. Faint galaxies wash out a little after it clears the trees; come early for Andromeda.",
  },
  {
    q: "Clear until 23:00",
    a: "High cloud moves in from the west after eleven. The last deck session starts at 22:15, so everyone gets their half hour.",
  },
]

function Question({
  q,
  a,
  defaultOpen,
  disabled,
}: {
  q: string
  a: string
  defaultOpen?: boolean
  disabled?: boolean
}) {
  return (
    <Collapsible defaultOpen={defaultOpen} disabled={disabled}>
      <CollapsibleTrigger className="flex min-h-control w-full cursor-pointer items-center gap-hair rounded-box text-start font-read text-body leading-ui font-semibold text-(--text) disabled:cursor-not-allowed disabled:text-(--text-quiet)">
        <CollapsibleChevron />
        {q}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className="m-0 max-w-measure ps-[1.375rem] pb-snug text-body leading-body text-(--text)">
          {a}
        </p>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default function CollapsibleDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="Closed">
          <div className="w-full max-w-measure">
            <Question {...QUESTIONS[0]!} />
          </div>
        </StateRow>
        <StateRow label="Open">
          <div className="w-full max-w-measure">
            <Question {...QUESTIONS[1]!} defaultOpen />
          </div>
        </StateRow>
        <StateRow label="Disabled">
          <div className="w-full max-w-measure">
            <Question
              q="Can I book the dome for a private night? (members)"
              a=""
              disabled
            />
          </div>
        </StateRow>
      </DemoSection>
      <DemoSection title="Tonight’s sky">
        <div className="max-w-measure">
          <p className="m-0 caps">Thursday 5 November · dark from 18:10</p>
          <p className="m-0 mt-hair font-read text-lead leading-lead font-semibold">
            Good for planets, fair for galaxies
          </p>
          <div className="mt-tight">
            {SKY.map((row, index) => (
              <div key={row.q}>
                <Separator />
                <Question {...row} defaultOpen={index === 0} />
              </div>
            ))}
            <Separator />
          </div>
        </div>
      </DemoSection>
    </>
  )
}
