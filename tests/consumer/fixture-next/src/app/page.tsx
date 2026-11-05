import { Hero01 } from "@/serigraph/blocks/hero-01"
import { SignIn01 } from "@/serigraph/blocks/sign-in-01"
import { Folly } from "@/serigraph/extras/folly"
import { Lettering } from "@/serigraph/extras/lettering"
import { Motif } from "@/serigraph/extras/motif"
import { OrdinalDate } from "@/serigraph/extras/ordinal-date"
import { TicketStub } from "@/serigraph/extras/ticket-stub"
import { cn } from "@/serigraph/lib/utils"
import { Avatar, AvatarFallback } from "@/serigraph/ui/avatar"
import { Badge } from "@/serigraph/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/serigraph/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/serigraph/ui/table"
import { Booking } from "./booking"

// The observatory's night as a server component: every part without handlers renders here, so a kit file that needs
// the browser but leaves out "use client" fails the build. The handlers live in ./booking.
export default function Page() {
  return (
    <>
      <Hero01 />
      <main className="canvas grid gap-6 p-6">
        <Lettering as="h2" className="text-6xl">
          Tonight
        </Lettering>
        <OrdinalDate date="2026-11-05" />
        <Folly template="window" seed="consumer" className="arch-frame w-48" />
        <p className={cn("text-body")}>
          <Motif kind="sparkle" seed="new" /> The dome opens at 21:30.
        </p>
        <Avatar size="lg">
          <AvatarFallback name="Henrietta Leavitt">HL</AvatarFallback>
        </Avatar>
        <Card className="max-w-[24rem]">
          <CardHeader>
            <CardTitle>Saturn at opposition</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge>9 seats</Badge>
          </CardContent>
        </Card>
        <TicketStub title="Saturn at opposition" number="0412">
          Lecture hall, 19:30
        </TicketStub>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Session</TableHead>
              <TableHead className="text-end">Seats</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>The sky tonight</TableCell>
              <TableCell className="text-end">36</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Booking />
      </main>
      <SignIn01 />
    </>
  )
}
