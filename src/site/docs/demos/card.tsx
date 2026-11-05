import { Button } from "@/serigraph/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/serigraph/ui/card"
import { Badge } from "@/serigraph/ui/badge"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Card",
  description:
    "Holds one subject and its actions: a plane in the colourway's colour or a tone, one line and the big radius.",
  item: "card",
  group: "Data display",
}

export default function CardDemo() {
  return (
    <DemoSection title="Sizes">
      <StateRow label="default">
        <Card className="w-full max-w-[22rem]">
          <CardHeader>
            <CardTitle>Saturn at opposition</CardTitle>
            <CardDescription>Thursday 5 November, from 21:30</CardDescription>
            <CardAction>
              <Badge>9 seats</Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            The rings open to their widest this year. The big refractor is yours
            for ten minutes.
          </CardContent>
          <CardFooter>
            <Button>Book a seat</Button>
          </CardFooter>
        </Card>
      </StateRow>
      <StateRow label="sm · tone 3">
        <Card size="sm" data-tone="3" className="w-full max-w-[18rem]">
          <CardHeader>
            <CardTitle>Moonrise</CardTitle>
            <CardDescription>22:14, waning crescent</CardDescription>
          </CardHeader>
        </Card>
      </StateRow>
    </DemoSection>
  )
}
