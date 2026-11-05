import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/serigraph/ui/tabs"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Tabs",
  description:
    "Switches between views of one subject: a row of archways, the chosen one opening into its panel.",
  item: "tabs",
  group: "Navigation",
}

const NIGHTS = [
  ["tonight", "Tonight", "Saturn rises at 18:52; the dome opens at 21:30."],
  ["week", "This week", "Four clear nights, the Leonids peaking on Monday."],
  ["members", "Members", "Telescope time is booked by the half hour."],
] as const

export default function TabsDemo() {
  return (
    <>
      <DemoSection title="Archways">
        <StateRow label="default">
          <Tabs defaultValue="tonight" className="w-full max-w-[34rem]">
            <TabsList>
              {NIGHTS.map(([value, label]) => (
                <TabsTrigger key={value} value={value}>
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            {NIGHTS.map(([value, , text]) => (
              <TabsContent key={value} value={value}>
                {text}
              </TabsContent>
            ))}
          </Tabs>
        </StateRow>
      </DemoSection>
      <DemoSection title="Line">
        <StateRow label="line">
          <Tabs defaultValue="tonight">
            <TabsList variant="line">
              {NIGHTS.map(([value, label]) => (
                <TabsTrigger key={value} value={value}>
                  {label}
                </TabsTrigger>
              ))}
              <TabsTrigger value="archive" disabled>
                Archive
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </StateRow>
        <StateRow label="vertical">
          <Tabs defaultValue="week" orientation="vertical">
            <TabsList variant="line">
              {NIGHTS.map(([value, label]) => (
                <TabsTrigger key={value} value={value}>
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </StateRow>
      </DemoSection>
    </>
  )
}
