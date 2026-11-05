import { OrdinalDate } from "@/serigraph/extras/ordinal-date"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Ordinal date",
  description:
    "Prints a date as the poster does, THURSDAY 5TH NOVEMBER in the extended capitals with the ordinal raised.",
  item: "ordinal-date",
  group: "Serigraph extras",
}

export default function OrdinalDateDemo() {
  return (
    <>
      <DemoSection title="Formats">
        <StateRow label="Long">
          <OrdinalDate date="2026-11-05" />
        </StateRow>
        <StateRow label="Short">
          <OrdinalDate date="2026-11-05" format="short" />
        </StateRow>
        <StateRow label="Day">
          <OrdinalDate date="2026-11-05" format="day" />
        </StateRow>
        <StateRow label="With year">
          <OrdinalDate date="2026-11-05" showYear />
        </StateRow>
        <StateRow label="From parts">
          <OrdinalDate day={22} month={11} weekday="Sunday" />
          <OrdinalDate day={1} month={12} year={2026} />
          <OrdinalDate day={3} month={12} format="short" />
        </StateRow>
      </DemoSection>
      <DemoSection title="Sizes">
        <StateRow label="sm">
          <OrdinalDate date="2026-11-05" />
        </StateRow>
        <StateRow label="md">
          <OrdinalDate date="2026-11-05" size="md" />
        </StateRow>
        <StateRow label="lg">
          <OrdinalDate date="2026-11-05" size="lg" />
        </StateRow>
        <StateRow label="xl">
          <OrdinalDate date="2026-11-05" size="xl" />
        </StateRow>
      </DemoSection>
      <DemoSection title="Locales">
        <StateRow label="en-US">
          <OrdinalDate date="2026-11-05" locale="en-US" />
        </StateRow>
        <StateRow label="Danish">
          <OrdinalDate date="2026-11-05" locale="da" />
        </StateRow>
        <StateRow label="German">
          <OrdinalDate date="2026-11-05" locale="de" />
        </StateRow>
      </DemoSection>
    </>
  )
}
