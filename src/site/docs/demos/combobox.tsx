import { Fragment } from "react"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxValue,
  useComboboxAnchor,
} from "@/serigraph/ui/combobox"
import { Field, FieldError, FieldLabel } from "@/serigraph/ui/field"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Combobox",
  description:
    "A field that filters a list as you type, for finding one telescope, or several objects, in a list too long to scroll.",
  item: "combobox",
  group: "Forms",
}

const PLACE: Record<string, string> = {
  "Zeiss refractor, 150 mm": "Deck",
  "Apochromat, 102 mm": "Deck",
  "Dobsonian, 400 mm": "Lawn",
  "Newtonian, 250 mm": "Dome",
  "Schmidt–Cassegrain, 280 mm": "Dome",
  "Solar telescope, 90 mm": "Terrace",
  "Binoculars, 15×70": "Lawn",
}
const TELESCOPES = Object.keys(PLACE)

const SKY = [
  { value: "Planets", items: ["Saturn", "Jupiter", "Mars", "Uranus"] },
  {
    value: "Galaxies",
    items: ["Andromeda Galaxy", "Triangulum Galaxy", "Whirlpool Galaxy"],
  },
  {
    value: "Clusters",
    items: ["Pleiades", "Double Cluster", "Hercules Cluster"],
  },
  { value: "Nebulae", items: ["Orion Nebula", "Ring Nebula", "Crab Nebula"] },
]
const OBJECTS = SKY.flatMap((group) => group.items)

function TelescopeItem({ name }: { name: string }) {
  return (
    <ComboboxItem value={name}>
      <span className="shrink-0 whitespace-nowrap">{name}</span>
      <span className="ms-auto font-mono text-small text-(--text-quiet)">
        {PLACE[name]}
      </span>
    </ComboboxItem>
  )
}

function Telescopes(
  props: React.ComponentProps<typeof ComboboxInput> & {
    defaultValue?: string
  },
) {
  const { defaultValue, ...input } = props
  return (
    <Combobox items={TELESCOPES} defaultValue={defaultValue}>
      <ComboboxInput placeholder="Choose a telescope" {...input} />
      <ComboboxContent>
        <ComboboxEmpty>No telescope by that name.</ComboboxEmpty>
        <ComboboxList>
          {(name: string) => <TelescopeItem key={name} name={name} />}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function Tonight() {
  const anchor = useComboboxAnchor()
  return (
    <Combobox
      multiple
      autoHighlight
      items={OBJECTS}
      defaultValue={["Saturn", "Andromeda Galaxy", "Pleiades"]}
    >
      <ComboboxChips ref={anchor} className="w-[28rem] max-w-full">
        <ComboboxValue>
          {(values: string[]) => (
            <Fragment>
              {values.map((value) => (
                <ComboboxChip key={value}>{value}</ComboboxChip>
              ))}
              <ComboboxChipsInput
                aria-label="Objects to see tonight"
                placeholder={values.length ? "" : "Add an object"}
              />
            </Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>Nothing by that name in tonight's sky.</ComboboxEmpty>
        <ComboboxList>
          {(name: string) => (
            <ComboboxItem key={name} value={name}>
              {name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function SkyByKind() {
  return (
    <Combobox items={SKY}>
      <ComboboxInput
        aria-label="Object, by kind"
        placeholder="Choose an object"
        className="w-64"
      />
      <ComboboxContent>
        <ComboboxEmpty>Nothing by that name in tonight's sky.</ComboboxEmpty>
        <ComboboxList>
          {(group: (typeof SKY)[number], index: number) => (
            <ComboboxGroup key={group.value} items={group.items}>
              {index > 0 && <ComboboxSeparator />}
              <ComboboxLabel>{group.value}</ComboboxLabel>
              <ComboboxCollection>
                {(name: string) => (
                  <ComboboxItem key={name} value={name}>
                    {name}
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export default function ComboboxDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="Chosen">
          <Telescopes
            aria-label="Telescope"
            defaultValue="Zeiss refractor, 150 mm"
            className="w-80 max-w-full"
            showClear
          />
        </StateRow>
        <StateRow label="Placeholder">
          <Field className="w-auto">
            <FieldLabel htmlFor="cb-telescope">Telescope</FieldLabel>
            <Telescopes id="cb-telescope" className="w-80 max-w-full" />
          </Field>
        </StateRow>
        <StateRow label="Invalid">
          <Field data-invalid="true" className="w-auto">
            <Telescopes
              aria-label="Telescope"
              aria-invalid="true"
              aria-describedby="cb-error"
              className="w-80 max-w-full"
            />
            <FieldError id="cb-error">Choose the telescope to book.</FieldError>
          </Field>
        </StateRow>
        <StateRow label="Disabled">
          <Telescopes
            aria-label="Telescope"
            defaultValue="Dobsonian, 400 mm"
            disabled
            className="w-80 max-w-full"
          />
        </StateRow>
      </DemoSection>
      <DemoSection title="Variants">
        <StateRow label="Several">
          <Tonight />
        </StateRow>
        <StateRow label="Groups">
          <SkyByKind />
        </StateRow>
      </DemoSection>
    </>
  )
}
