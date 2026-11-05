import { CopyIcon, SearchIcon, XIcon } from "lucide-react"
import { Field, FieldError, FieldLabel } from "@/serigraph/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/serigraph/ui/input-group"
import { Kbd } from "@/serigraph/ui/kbd"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Input group",
  description:
    "One field pill shared by an input and its units, icons or buttons, for values that need a word or an action beside them.",
  item: "input-group",
  group: "Forms",
}

export default function InputGroupDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="Search">
          <InputGroup className="w-80 max-w-full">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              aria-label="Search Meridian"
              placeholder="Objects, telescopes, talks"
            />
            <InputGroupAddon align="inline-end">
              <Kbd>⌘K</Kbd>
            </InputGroupAddon>
          </InputGroup>
        </StateRow>
        <StateRow label="Filled">
          <Field className="w-auto">
            <FieldLabel htmlFor="ig-aperture">Aperture</FieldLabel>
            <InputGroup className="w-32">
              <InputGroupInput
                id="ig-aperture"
                inputMode="numeric"
                defaultValue="150"
                className="tabular-nums"
              />
              <InputGroupAddon align="inline-end">mm</InputGroupAddon>
            </InputGroup>
          </Field>
          <InputGroup className="w-72 max-w-full self-end">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              aria-label="Search Meridian"
              defaultValue="Saturn at opposition"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" aria-label="Clear search">
                <XIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </StateRow>
        <StateRow label="Invalid">
          <Field data-invalid="true" className="w-auto">
            <FieldLabel htmlFor="ig-guests">Guests on the deck</FieldLabel>
            <InputGroup className="w-36">
              <InputGroupInput
                id="ig-guests"
                inputMode="numeric"
                defaultValue="14"
                aria-invalid="true"
                aria-describedby="ig-guests-error"
                className="tabular-nums"
              />
              <InputGroupAddon align="inline-end">people</InputGroupAddon>
            </InputGroup>
            <FieldError id="ig-guests-error">
              The refractor deck takes twelve at a time.
            </FieldError>
          </Field>
        </StateRow>
        <StateRow label="Disabled">
          <InputGroup className="w-36">
            <InputGroupAddon>
              <InputGroupText className="text-body">MER-</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              aria-label="Member number"
              defaultValue="0412"
              disabled
              className="ps-0.5! font-mono"
            />
          </InputGroup>
        </StateRow>
      </DemoSection>
      <DemoSection title="Alignments">
        <StateRow label="inline-start">
          <InputGroup className="w-36">
            <InputGroupAddon>
              <InputGroupText className="text-body">MER-</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              aria-label="Member number"
              defaultValue="0412"
              className="ps-0.5! font-mono"
            />
          </InputGroup>
        </StateRow>
        <StateRow label="inline-end">
          <InputGroup className="w-80 max-w-full">
            <InputGroupInput
              aria-label="Link to tonight's programme"
              readOnly
              defaultValue="meridian.dk/night/2026-11-05"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" aria-label="Copy link">
                <CopyIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </StateRow>
        <StateRow label="block-start">
          <InputGroup className="w-full max-w-measure">
            <InputGroupAddon align="block-start" className="border-b">
              <InputGroupText>Deck · Thu 5 Nov, 22:00</InputGroupText>
            </InputGroupAddon>
            <InputGroupTextarea
              aria-label="Note for the host"
              defaultValue="We would love to see Andromeda first, then the Double Cluster if the sky holds. Two of us, one a first-timer."
            />
          </InputGroup>
        </StateRow>
        <StateRow label="block-end">
          <InputGroup className="w-full max-w-measure">
            <InputGroupTextarea
              aria-label="Note for the host"
              placeholder="Anything you hope to see?"
            />
            <InputGroupAddon align="block-end" className="border-t">
              <InputGroupText className="tabular-nums">0 / 280</InputGroupText>
              <InputGroupButton size="sm" variant="default" className="ms-auto">
                Send note
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </StateRow>
      </DemoSection>
    </>
  )
}
