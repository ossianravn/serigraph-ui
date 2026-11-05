import { Card, CardContent } from "@/serigraph/ui/card"
import { Checkbox } from "@/serigraph/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/serigraph/ui/field"
import { Input } from "@/serigraph/ui/input"
import { RadioGroup, RadioGroupItem } from "@/serigraph/ui/radio-group"
import { Switch } from "@/serigraph/ui/switch"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Field",
  description:
    "Keeps a label, its control, a description and an error together in one readable column, for building forms.",
  item: "field",
  group: "Forms",
}

const SHOWS = [
  ["18:30", "Early show"],
  ["20:00", "Evening show"],
  ["21:30", "Late show, then the dome opens"],
] as const

const TICKETS = [
  {
    value: "show",
    title: "Planetarium show",
    hint: "Forty minutes under the dome, narrated, with the sky as it is tonight.",
  },
  {
    value: "night",
    title: "Telescope night",
    hint: "The show, then an hour on the deck at the Zeiss refractor if the sky is clear.",
  },
]

export default function FieldDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="Default">
          <Field className="w-auto">
            <FieldLabel htmlFor="field-name">Name on the ticket</FieldLabel>
            <Input
              id="field-name"
              placeholder="Ada Lovelace"
              aria-describedby="field-name-hint"
              className="w-64"
            />
            <FieldDescription id="field-name-hint">
              We read it out at the door.
            </FieldDescription>
          </Field>
        </StateRow>
        <StateRow label="Invalid">
          <Field data-invalid="true" className="w-auto">
            <FieldLabel htmlFor="field-email">Email</FieldLabel>
            <Input
              id="field-email"
              type="email"
              defaultValue="ada@"
              aria-invalid="true"
              className="w-72"
            />
            <FieldError>
              The address is missing the part after the @.
            </FieldError>
          </Field>
        </StateRow>
        <StateRow label="Several errors">
          <Field data-invalid="true" className="w-auto">
            <FieldLabel htmlFor="field-guests">Guests</FieldLabel>
            <Input
              id="field-guests"
              inputMode="numeric"
              defaultValue="14"
              aria-invalid="true"
              className="w-20 text-center tabular-nums"
            />
            <FieldError
              errors={[
                { message: "The telescope deck holds eight at most." },
                { message: "For fourteen, book a group evening." },
              ]}
            />
          </Field>
        </StateRow>
        <StateRow label="Disabled">
          <Field data-disabled="true" className="w-auto">
            <FieldLabel htmlFor="field-member">Membership</FieldLabel>
            <Input
              id="field-member"
              disabled
              defaultValue="M-0412"
              className="w-36 font-mono"
            />
            <FieldDescription>Set when you joined.</FieldDescription>
          </Field>
        </StateRow>
      </DemoSection>
      <DemoSection title="Horizontal">
        <StateRow label="Switch">
          <Field orientation="horizontal" className="max-w-[28rem]">
            <FieldContent>
              <FieldLabel htmlFor="field-red">Red-light mode</FieldLabel>
              <FieldDescription>
                Keeps your eyes dark-adapted on the deck.
              </FieldDescription>
            </FieldContent>
            <Switch id="field-red" defaultChecked />
          </Field>
        </StateRow>
        <StateRow label="Checkbox">
          <Field orientation="horizontal" className="max-w-[28rem]">
            <Checkbox id="field-moonrise" defaultChecked />
            <FieldContent>
              <FieldLabel htmlFor="field-moonrise">
                Tell me at moonrise
              </FieldLabel>
              <FieldDescription>
                One message, an hour before the Moon clears the hills.
              </FieldDescription>
            </FieldContent>
          </Field>
        </StateRow>
      </DemoSection>
      <DemoSection title="Fieldset">
        <StateRow label="Radio set">
          <FieldSet className="w-auto">
            <FieldLegend variant="label">Show time</FieldLegend>
            <RadioGroup defaultValue="20:00">
              {SHOWS.map(([time, words]) => (
                <Field key={time} orientation="horizontal">
                  <RadioGroupItem value={time} id={`show-${time}`} />
                  <FieldLabel htmlFor={`show-${time}`}>
                    <span className="font-mono">{time}</span> {words}
                  </FieldLabel>
                </Field>
              ))}
            </RadioGroup>
          </FieldSet>
        </StateRow>
        <StateRow label="Choice cards">
          <FieldSet className="w-full max-w-[28rem]">
            <FieldLegend>Ticket</FieldLegend>
            <RadioGroup defaultValue="night">
              {TICKETS.map(({ value, title, hint }) => (
                <FieldLabel key={value} htmlFor={`ticket-${value}`}>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>{title}</FieldTitle>
                      <FieldDescription>{hint}</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value={value} id={`ticket-${value}`} />
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          </FieldSet>
        </StateRow>
      </DemoSection>
      <DemoSection title="In a form">
        <Card className="w-full max-w-[28rem]">
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="form-name">Name on the ticket</FieldLabel>
                <Input
                  id="form-name"
                  defaultValue="Ada Lovelace"
                  className="w-64"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="form-date">Night</FieldLabel>
                <Input
                  id="form-date"
                  type="date"
                  defaultValue="2026-11-07"
                  className="w-44"
                />
              </Field>
              <FieldSeparator>Or</FieldSeparator>
              <Field orientation="horizontal">
                <Checkbox id="form-any" />
                <FieldLabel htmlFor="form-any">The next clear night</FieldLabel>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </DemoSection>
    </>
  )
}
