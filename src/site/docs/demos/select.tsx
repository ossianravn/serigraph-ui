import type { ComponentProps } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/serigraph/ui/select"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Select",
  description:
    "Picks one value from a list too long to show at once: a field with a chevron that opens a plane of options.",
  item: "select",
  group: "Forms",
}

const PLANETS = {
  mercury: "Mercury",
  venus: "Venus",
  mars: "Mars",
  jupiter: "Jupiter",
  saturn: "Saturn",
  uranus: "Uranus",
  neptune: "Neptune",
}

const TELESCOPES = {
  zeiss: "Zeiss refractor, 150 mm",
  apo: "Apochromat, 102 mm",
  dobson: "Dobsonian, 400 mm",
  newton: "Newtonian, 250 mm",
}

const NIGHTS = {
  thu: "Thursday 5 Nov",
  fri: "Friday 6 Nov",
  sat: "Saturday 7 Nov",
}

function PlanetSelect({
  size,
  invalid,
  ...props
}: Omit<ComponentProps<typeof Select>, "items"> & {
  size?: "sm" | "default"
  invalid?: boolean
}) {
  return (
    <Select items={PLANETS} {...props}>
      <SelectTrigger
        size={size}
        aria-label="Planet"
        aria-invalid={invalid || undefined}
        className="w-36"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(PLANETS).map(([value, name]) => (
          <SelectItem key={value} value={value}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default function SelectDemo() {
  return (
    <>
      <DemoSection title="States" columns={["Enabled", "Disabled"]}>
        <StateRow label="Chosen">
          <PlanetSelect defaultValue="saturn" />
          <PlanetSelect defaultValue="saturn" disabled />
        </StateRow>
        <StateRow label="Placeholder">
          <Select items={NIGHTS}>
            <SelectTrigger aria-label="Night" className="w-48">
              <SelectValue placeholder="Choose a night" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(NIGHTS).map(([value, night]) => (
                <SelectItem key={value} value={value}>
                  {night}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </StateRow>
        <StateRow label="Small">
          <PlanetSelect size="sm" defaultValue="jupiter" />
        </StateRow>
        <StateRow label="Invalid">
          <PlanetSelect defaultValue="mercury" invalid />
        </StateRow>
      </DemoSection>
      <DemoSection title="Groups">
        <StateRow label="Telescopes">
          <Select items={TELESCOPES} defaultValue="zeiss">
            <SelectTrigger aria-label="Telescope" className="w-60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Refractors</SelectLabel>
                <SelectItem value="zeiss">{TELESCOPES.zeiss}</SelectItem>
                <SelectItem value="apo">{TELESCOPES.apo}</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Reflectors</SelectLabel>
                <SelectItem value="dobson">{TELESCOPES.dobson}</SelectItem>
                <SelectItem value="newton" disabled>
                  {TELESCOPES.newton}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </StateRow>
      </DemoSection>
    </>
  )
}
