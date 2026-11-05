import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
  SearchIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/serigraph/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/serigraph/ui/button-group"
import { Field, FieldLabel } from "@/serigraph/ui/field"
import { Input } from "@/serigraph/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/serigraph/ui/select"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Button group",
  description:
    "Related actions joined in one pill with a fine line between them, so a toolbar reads as a single control.",
  item: "button-group",
  group: "Actions",
}

const CURRENCIES = { dkk: "DKK", eur: "EUR", sek: "SEK" }

function Guests() {
  const [guests, setGuests] = useState(2)
  return (
    <Field className="w-auto">
      <FieldLabel id="bg-guests">Guests</FieldLabel>
      <ButtonGroup aria-labelledby="bg-guests">
        <Button
          variant="outline"
          size="icon"
          aria-label="One guest fewer"
          disabled={guests <= 1}
          onClick={() => setGuests((n) => n - 1)}
        >
          <MinusIcon />
        </Button>
        <ButtonGroupText
          aria-live="polite"
          className="w-12 justify-center px-0 text-body"
        >
          {guests}
        </ButtonGroupText>
        <Button
          variant="outline"
          size="icon"
          aria-label="One guest more"
          disabled={guests >= 6}
          onClick={() => setGuests((n) => n + 1)}
        >
          <PlusIcon />
        </Button>
      </ButtonGroup>
    </Field>
  )
}

export default function ButtonGroupDemo() {
  return (
    <>
      <DemoSection title="Orientation">
        <StateRow label="Horizontal">
          <ButtonGroup aria-label="Your booking">
            <Button variant="outline">Print tickets</Button>
            <Button variant="outline">Email</Button>
            <Button variant="outline">Add to calendar</Button>
          </ButtonGroup>
        </StateRow>
        <StateRow label="Vertical">
          <ButtonGroup orientation="vertical" aria-label="Zoom the sky map">
            <Button variant="outline" size="icon" aria-label="Zoom in">
              <ZoomInIcon />
            </Button>
            <Button variant="outline" size="icon" aria-label="Zoom out">
              <ZoomOutIcon />
            </Button>
          </ButtonGroup>
        </StateRow>
        <StateRow label="Nested">
          <ButtonGroup aria-label="Choose a night">
            <ButtonGroup aria-label="Previous or next night">
              <Button variant="outline" size="icon" aria-label="Previous night">
                <ChevronLeftIcon />
              </Button>
              <Button variant="outline" size="icon" aria-label="Next night">
                <ChevronRightIcon />
              </Button>
            </ButtonGroup>
            <ButtonGroup aria-label="Tonight">
              <Button variant="outline">Tonight</Button>
            </ButtonGroup>
          </ButtonGroup>
        </StateRow>
      </DemoSection>
      <DemoSection title="With fields">
        <StateRow label="Input">
          <ButtonGroup className="w-80 max-w-full">
            <Input
              aria-label="Search the sky"
              placeholder="Object, star or catalogue number"
            />
            <Button variant="outline" size="icon" aria-label="Search">
              <SearchIcon />
            </Button>
          </ButtonGroup>
        </StateRow>
        <StateRow label="Select">
          <ButtonGroup aria-label="Ticket price">
            <Input
              aria-label="Price"
              inputMode="numeric"
              defaultValue="120"
              className="w-20 tabular-nums"
            />
            <Select items={CURRENCIES} defaultValue="dkk">
              <SelectTrigger aria-label="Currency" className="w-26">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CURRENCIES).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ButtonGroup>
        </StateRow>
        <StateRow label="Text">
          <Guests />
        </StateRow>
      </DemoSection>
      <DemoSection title="Variants and states">
        <StateRow label="Secondary">
          <ButtonGroup aria-label="Export tonight's log">
            <Button variant="secondary">Export CSV</Button>
            <Button variant="secondary">Export PDF</Button>
          </ButtonGroup>
        </StateRow>
        <StateRow label="Separator">
          <ButtonGroup aria-label="Sky map">
            <Button variant="ghost">Constellations</Button>
            <ButtonGroupSeparator />
            <Button variant="ghost">Grid</Button>
          </ButtonGroup>
        </StateRow>
        <StateRow label="Small">
          <ButtonGroup aria-label="Receipt">
            <Button variant="outline" size="sm">
              Print
            </Button>
            <Button variant="outline" size="sm">
              Email
            </Button>
            <Button variant="outline" size="sm">
              Copy
            </Button>
          </ButtonGroup>
        </StateRow>
        <StateRow label="Disabled member">
          <ButtonGroup aria-label="Booking">
            <Button variant="outline">Save booking</Button>
            <Button variant="outline" disabled>
              Send confirmation
            </Button>
          </ButtonGroup>
        </StateRow>
      </DemoSection>
    </>
  )
}
