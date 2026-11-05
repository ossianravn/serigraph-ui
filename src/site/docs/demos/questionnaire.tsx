import { useState } from "react"
import { Button } from "@/serigraph/ui/button"
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/serigraph/ui/questionnaire"
import { DemoSection, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Questionnaire",
  description:
    "A short run of questions answered one at a time, such as choosing a telescope for tonight.",
  item: "questionnaire",
  group: "Conversation",
}

const SIGHTS = [
  ["planets", "Planets", "Saturn’s rings, Jupiter’s moons"],
  ["deep-sky", "Galaxies and nebulae", "Andromeda, the Orion Nebula"],
  ["moon", "The Moon", "Craters along the terminator"],
  ["doubles", "Double stars", "Albireo, gold and blue"],
] as const
const HANDS = [
  ["find", "Find things myself"],
  ["photos", "Take photos through the eyepiece"],
  ["child", "Bring a child under eight"],
  ["guide", "Have a guide beside me"],
] as const
const NIGHTS = [
  ["thu-5", "Thursday 5 November, 21:30", "Seeing 4 of 5 · clear until 23:00"],
  ["fri-6", "Friday 6 November, 20:00", "Seeing 3 of 5 · Moon rises 23:02"],
  ["sat-7", "Saturday 7 November", "Every telescope is booked"],
] as const

const TELESCOPES: Record<string, string> = {
  planets: "the Zeiss refractor, 150 mm",
  "deep-sky": "the Dobsonian, 400 mm",
  moon: "the apochromat, 102 mm",
  doubles: "the Zeiss refractor, 150 mm",
}

function Chooser() {
  const [result, setResult] = useState<{
    name: string
    scope: string
  } | null>(null)
  if (result) {
    return (
      <div className="flex max-w-measure flex-wrap items-center gap-x-tight gap-y-hair">
        <p className="m-0 text-body leading-body">
          We&rsquo;ve held{" "}
          <strong className="font-semibold">{result.scope}</strong> for{" "}
          {result.name}.
        </p>
        <Button variant="outline" size="sm" onClick={() => setResult(null)}>
          Start again
        </Button>
      </div>
    )
  }
  return (
    <Questionnaire
      shortcuts="letters"
      className="max-w-[34rem]"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        setResult({
          name: String(data.get("name") || "a guest"),
          scope: TELESCOPES[String(data.get("sight"))] ?? TELESCOPES.planets!,
        })
      }}
    >
      <QuestionnaireProgress />
      <QuestionnaireItem name="sight" required>
        <QuestionnaireTitle>
          What would you most like to see?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          We match the telescope to the sky, not the other way round.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          {SIGHTS.map(([value, label, note]) => (
            <QuestionnaireChoice key={value} value={value}>
              {label}
              <QuestionnaireChoiceDescription>
                {note}
              </QuestionnaireChoiceDescription>
            </QuestionnaireChoice>
          ))}
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="hands" multiple>
        <QuestionnaireTitle>How would you like to observe?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Choose any that apply.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          {HANDS.map(([value, label]) => (
            <QuestionnaireChoice key={value} value={value}>
              {label}
            </QuestionnaireChoice>
          ))}
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireItem name="night">
        <QuestionnaireTitle>Which night?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Half an hour at the eyepiece, after the show in the dome.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          {NIGHTS.map(([value, label, note]) => (
            <QuestionnaireChoice
              key={value}
              value={value}
              disabled={value === "sat-7"}
            >
              {label}
              <QuestionnaireChoiceDescription>
                {note}
              </QuestionnaireChoiceDescription>
            </QuestionnaireChoice>
          ))}
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireItem name="name">
        <QuestionnaireTitle>Whose name goes on the booking?</QuestionnaireTitle>
        <QuestionnaireInput
          placeholder="Ada Lindqvist"
          autoComplete="name"
          className="max-w-[18rem]"
        />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext />
        <QuestionnaireSubmit>Hold the telescope</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  )
}

export default function QuestionnaireDemo() {
  return (
    <>
      <DemoSection title="Choosing a telescope">
        <Chooser />
      </DemoSection>
      <DemoSection title="Unanswered">
        <Questionnaire className="max-w-[34rem]">
          <QuestionnaireItem name="deck" required invalid>
            <QuestionnaireTitle>Where will you observe?</QuestionnaireTitle>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="deck">
                The telescope deck
              </QuestionnaireChoice>
              <QuestionnaireChoice value="dome">
                Under the dome
              </QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError />
          </QuestionnaireItem>
          <QuestionnaireActions>
            <QuestionnaireSubmit>Continue</QuestionnaireSubmit>
          </QuestionnaireActions>
        </Questionnaire>
      </DemoSection>
    </>
  )
}
