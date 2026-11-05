import { folly } from "@/serigraph/follies"
import { Folly } from "@/serigraph/extras/folly"
import { Lettering } from "@/serigraph/extras/lettering"
import { Motif } from "@/serigraph/extras/motif"
import { alphabet, DISPLAY_PEN } from "@/serigraph/letters/alphabet"
import { cn } from "@/serigraph/lib/utils"
import { APPEARANCE, useAppearance } from "@/serigraph/theme"
import { Button } from "@/serigraph/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/serigraph/ui/card"
import { Checkbox } from "@/serigraph/ui/checkbox"
import { Input } from "@/serigraph/ui/input"
import { Label } from "@/serigraph/ui/label"
import { Switch } from "@/serigraph/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/serigraph/ui/tabs"

// The observatory's opening night: lettering, the city and a window drawn from seeds, a colourway switch and the
// alphabet's size, a motif beside the text, a booking card and archway tabs, using the parts the install test adds.
export function App() {
  const [appearance, setAppearance] = useAppearance()
  const night = appearance.colourway === "night"
  const letters = Object.keys(alphabet(DISPLAY_PEN, { inline: false })).length

  return (
    <main className="canvas grid gap-6 p-6">
      <Lettering as="h1" className="text-7xl">
        Meridian
      </Lettering>
      <Folly
        template="city"
        seed="consumer"
        label="An observatory in the clouds"
        className="h-80"
      />
      <div className="plane grid max-w-[34rem] gap-4 p-6" data-tone="2">
        <p className={cn("text-body", night && "font-read")}>
          <Motif kind="sparkle" seed="new" /> The dome opens on Thursday at
          nine. {letters} letters in the face.
        </p>
        <div role="radiogroup" aria-label="Colourway" className="flex gap-2">
          {APPEARANCE.colourway.map((colourway) => (
            <button
              key={colourway}
              type="button"
              role="radio"
              aria-checked={colourway === appearance.colourway}
              onClick={() => setAppearance({ colourway })}
            >
              {colourway}
            </button>
          ))}
        </div>
      </div>
      <Card className="max-w-[24rem]">
        <CardHeader>
          <CardTitle>Book a seat</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Input
            aria-label="Name"
            placeholder="Ada Lovelace"
            className="w-64"
          />
          <Label>
            <Checkbox defaultChecked /> Bring a red torch
          </Label>
          <Label>
            <Switch /> Remind me at dusk
          </Label>
          <Button className="w-fit">Book</Button>
        </CardContent>
      </Card>
      <Tabs defaultValue="tonight" className="max-w-[34rem]">
        <TabsList>
          <TabsTrigger value="tonight">Tonight</TabsTrigger>
          <TabsTrigger value="week">This week</TabsTrigger>
        </TabsList>
        <TabsContent value="tonight">Saturn rises at 18:52.</TabsContent>
        <TabsContent value="week">Four clear nights.</TabsContent>
      </Tabs>
      <div
        className="folly h-40 w-32"
        dangerouslySetInnerHTML={{
          __html: folly({ template: "window", seed: "consumer" }),
        }}
      />
    </main>
  )
}
