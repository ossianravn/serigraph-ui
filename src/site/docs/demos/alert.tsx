import { CircleAlertIcon, CloudMoonIcon } from "lucide-react"
import { Button } from "@/serigraph/ui/button"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/serigraph/ui/alert"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Alert",
  description:
    "Tells people something they should know now: a small plane with a sparkle or an icon by its title.",
  item: "alert",
  group: "Data display",
}

const WIDTH = "max-w-[30rem]"

export default function AlertDemo() {
  return (
    <>
      <DemoSection title="Variants">
        <StateRow label="default">
          <Alert className={WIDTH}>
            <AlertTitle>The Saturn talk is back</AlertTitle>
            <AlertDescription>
              Thursdays at 21:00 in the planetarium, with ten minutes at the big
              refractor after.
            </AlertDescription>
          </Alert>
        </StateRow>
        <StateRow label="destructive">
          <Alert variant="destructive" className={WIDTH}>
            <CircleAlertIcon />
            <AlertTitle>Your booking didn’t go through</AlertTitle>
            <AlertDescription>
              The card was declined. Your two seats are held until 21:15.
            </AlertDescription>
          </Alert>
        </StateRow>
      </DemoSection>
      <DemoSection title="Tones and parts">
        <StateRow label="Icon · tone 3">
          <Alert data-tone="3" className={WIDTH}>
            <CloudMoonIcon />
            <AlertTitle>Clouds expected after 23:00</AlertTitle>
            <AlertDescription>
              The dome closes early tonight. Later bookings move to Friday at no
              cost.
            </AlertDescription>
          </Alert>
        </StateRow>
        <StateRow label="Action · tone 4">
          <Alert data-tone="4" className={WIDTH}>
            <AlertTitle>Moonrise at 22:14</AlertTitle>
            <AlertDescription>
              Faint galaxies wash out after that. Come early for Andromeda.
            </AlertDescription>
            <AlertAction>
              <Button size="xs" variant="outline">
                Move
              </Button>
            </AlertAction>
          </Alert>
        </StateRow>
        <StateRow label="Title only">
          <Alert data-tone="2" className={WIDTH}>
            <AlertTitle>Doors open at 20:30</AlertTitle>
          </Alert>
        </StateRow>
      </DemoSection>
    </>
  )
}
