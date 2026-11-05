import { toast } from "sonner"
import { Button } from "@/serigraph/ui/button"
import { Toaster } from "@/serigraph/ui/sonner"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Sonner",
  description:
    "Brief notes that confirm what just happened, or offer to undo it, without taking anyone away from what they were doing.",
  item: "sonner",
  group: "Overlays",
}

const checkSky = () =>
  new Promise<{ until: string }>((resolve) =>
    setTimeout(() => resolve({ until: "23:00" }), 1800),
  )

export default function SonnerDemo() {
  return (
    <>
      <DemoSection title="By kind">
        <StateRow label="Success">
          <Button
            variant="outline"
            onClick={() =>
              toast.success("Two seats booked", {
                description: "Saturn at opposition · 19:30, Lecture hall",
              })
            }
          >
            Book the talk
          </Button>
        </StateRow>
        <StateRow label="Error">
          <Button
            variant="outline"
            onClick={() =>
              toast.error("Booking not made", {
                description:
                  "The refractor at 20:30 is full. The Dobsonian has seats at 22:00.",
              })
            }
          >
            Book the refractor
          </Button>
        </StateRow>
        <StateRow label="Warning">
          <Button
            variant="outline"
            onClick={() =>
              toast.warning("Clouds after 23:00", {
                description: "The deck may close before the last slot.",
              })
            }
          >
            Check the forecast
          </Button>
        </StateRow>
        <StateRow label="Info">
          <Button
            variant="outline"
            onClick={() =>
              toast.info("Doors open at 18:00", {
                description: "The first dome show starts at 18:30.",
              })
            }
          >
            Opening hours
          </Button>
        </StateRow>
        <StateRow label="Plain">
          <Button
            variant="outline"
            onClick={() => toast("Reminder set for 21:00")}
          >
            Remind me
          </Button>
        </StateRow>
      </DemoSection>
      <DemoSection title="Flows">
        <StateRow label="Loading, then done">
          <Button
            variant="outline"
            onClick={() =>
              toast.promise(checkSky(), {
                loading: "Checking the sky…",
                success: (sky) => `Clear until ${sky.until}`,
                error: "The forecast didn’t load. Try again.",
              })
            }
          >
            Check the sky
          </Button>
        </StateRow>
        <StateRow label="With an action">
          <Button
            variant="outline"
            onClick={() =>
              toast("Booking cancelled", {
                description: "Deep sky with the Dobsonian · 22:00",
                action: {
                  label: "Undo",
                  onClick: () => toast.success("Your seat is back"),
                },
              })
            }
          >
            Cancel the 22:00
          </Button>
        </StateRow>
        <StateRow label="With a close button">
          <Button
            variant="outline"
            onClick={() =>
              toast("Ada Lovelace is on her way", {
                description: "She asked to keep two seats on the deck.",
                closeButton: true,
                duration: 8000,
              })
            }
          >
            Note a visitor
          </Button>
        </StateRow>
      </DemoSection>
      <Toaster />
    </>
  )
}
