// The colourway on real parts: a canvas region carrying the roles as inline custom properties, so the kit's shadcn
// roles and the drawings recompute inside it and nowhere else. A dark canvas also answers Night's selectors, as an
// exported Night-like colourway would need to.
import { Folly } from "@/serigraph/extras/folly"
import { Alert, AlertDescription, AlertTitle } from "@/serigraph/ui/alert"
import { Badge } from "@/serigraph/ui/badge"
import { Button } from "@/serigraph/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/serigraph/ui/card"
import { Field, FieldLabel } from "@/serigraph/ui/field"
import { Input } from "@/serigraph/ui/input"
import { Label } from "@/serigraph/ui/label"
import { Switch } from "@/serigraph/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/serigraph/ui/tabs"
import type { Colourway } from "./colourway"
import { colourwayStyle } from "./export"

const SESSIONS = [
  ["Saturn", "21:30", "1"],
  ["The Pleiades", "22:15", "2"],
  ["Andromeda", "23:40", "3"],
  ["The Moon", "00:10", "4"],
] as const

export function Preview({ colourway }: { colourway: Colourway }) {
  return (
    <section
      aria-label="Preview"
      className="canvas studio-preview"
      data-colourway={colourway.onCanvas === "paper" ? "night" : "studio"}
      style={colourwayStyle(colourway)}
    >
      <div className="studio-preview-head">
        <p className="caps">
          Meridian <span className="sep">•</span> Tonight
        </p>
        <h3 className="studio-preview-title">Saturn at the east dome</h3>
        <p className="studio-preview-lede">
          Clear from nine. The rings sit open this month, and the big refractor
          is yours by the half hour.
        </p>
      </div>
      <Folly
        template="city"
        seed="studio"
        label="A folly in this colourway"
        className="studio-folly"
      />
      <div className="studio-preview-parts">
        <Card>
          <CardHeader>
            <CardTitle>Book a seat</CardTitle>
            <CardDescription>Saturn, 21:30, the east dome</CardDescription>
          </CardHeader>
          <CardContent className="studio-card-body">
            <Field>
              <FieldLabel htmlFor="studio-name">Name</FieldLabel>
              <Input
                id="studio-name"
                defaultValue="Ada Lovelace"
                className="w-[14rem] max-w-full"
              />
            </Field>
            <Label>
              <Switch defaultChecked />
              Remind me an hour before
            </Label>
          </CardContent>
          <CardFooter className="studio-card-actions">
            <Button>Book</Button>
            <Button variant="secondary">Later</Button>
          </CardFooter>
        </Card>
        <div className="studio-preview-side">
          <Tabs defaultValue="tonight">
            <TabsList>
              <TabsTrigger value="tonight">Tonight</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
            </TabsList>
            <TabsContent value="tonight">
              <ul className="studio-sessions">
                {SESSIONS.map(([name, time, tone]) => (
                  <li key={name}>
                    <span>{name}</span>
                    <Badge variant="secondary" data-tone={tone}>
                      {time}
                    </Badge>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="week">
              Four clear nights; the Leonids peak on Monday.
            </TabsContent>
          </Tabs>
          <Alert>
            <AlertTitle>Doors at nine</AlertTitle>
            <AlertDescription>Bring a coat; the dome is open.</AlertDescription>
          </Alert>
          <div className="studio-preview-row">
            <Badge>New</Badge>
            <Button variant="outline" size="sm">
              Programme
            </Button>
            <Button variant="ghost" size="sm">
              Members
            </Button>
          </div>
        </div>
      </div>
      <Folly template="band" seed="studio-band" className="studio-band" />
      <p className="ground caps studio-ground">
        Meridian <span className="sep">•</span> Open nightly
      </p>
    </section>
  )
}
