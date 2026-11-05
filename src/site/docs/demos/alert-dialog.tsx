import { useState } from "react"
import { CloudRainIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/serigraph/ui/alert-dialog"
import { Button } from "@/serigraph/ui/button"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Alert dialog",
  description:
    "Asks for a decision before something that cannot be taken back, and waits for an answer.",
  item: "alert-dialog",
  group: "Overlays",
}

function CancelBooking() {
  const [open, setOpen] = useState(false)
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="outline" />}>
        Cancel booking
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Cancel your booking for Saturn at opposition?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your 2 seats on Thursday 5 November go back on sale, and 240 kr is
            refunded to your card within five days.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep booking</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => setOpen(false)}
          >
            Cancel booking
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function CloudedOut() {
  const [open, setOpen] = useState(false)
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="secondary" />}>
        Tonight&rsquo;s forecast
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <CloudRainIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>The dome stays shut tonight</AlertDialogTitle>
          <AlertDialogDescription>
            Cloud covers 85% of the sky from 21:00. Move your 2 seats to Friday
            at the same time, or take the 240 kr back.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Refund 240 kr</AlertDialogCancel>
          <AlertDialogAction onClick={() => setOpen(false)}>
            Move to Friday
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function LeaveQueue() {
  const [open, setOpen] = useState(false)
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="ghost" />}>
        Leave the queue
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Leave the queue?</AlertDialogTitle>
          <AlertDialogDescription>
            You are 4th in line for a returned seat.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Stay</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => setOpen(false)}
          >
            Leave
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default function AlertDialogDemo() {
  return (
    <DemoSection title="Open with the trigger">
      <StateRow label="Destructive">
        <CancelBooking />
      </StateRow>
      <StateRow label="With media">
        <CloudedOut />
      </StateRow>
      <StateRow label="Small">
        <LeaveQueue />
      </StateRow>
    </DemoSection>
  )
}
