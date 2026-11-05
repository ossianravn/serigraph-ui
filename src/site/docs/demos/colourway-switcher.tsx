import { ColourwaySwitcher } from "@/serigraph/extras/colourway-switcher"
import { siteAppearance } from "@/site/appearance"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Colourway switcher",
  description:
    "Changes how the whole page prints, its colourway, poster mat, line and grain, at once, and remembers the choice for the next visit.",
  item: "colourway-switcher",
  group: "Serigraph extras",
}

export default function ColourwaySwitcherDemo() {
  return (
    <>
      <DemoSection title="Settings">
        <StateRow label="Every setting">
          <ColourwaySwitcher defaults={siteAppearance} />
        </StateRow>
        <StateRow label="On a plane">
          <div className="plane p-line" data-tone="4">
            <ColourwaySwitcher defaults={siteAppearance} />
          </div>
        </StateRow>
      </DemoSection>
      <DemoSection title="In a header">
        <StateRow label="Colourways only">
          <ColourwaySwitcher
            rows={["colourway"]}
            orientation="horizontal"
            defaults={siteAppearance}
          />
        </StateRow>
        <StateRow label="Horizontal">
          <div className="flex w-full max-w-[44rem] flex-wrap items-center justify-between gap-snug border-y-(length:--line) border-(--edge) py-tight">
            <span className="caps">Meridian Observatory</span>
            <ColourwaySwitcher
              rows={["colourway", "poster"]}
              orientation="horizontal"
              defaults={siteAppearance}
            />
          </div>
        </StateRow>
      </DemoSection>
    </>
  )
}
