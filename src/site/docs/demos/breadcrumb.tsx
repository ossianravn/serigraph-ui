import { Fragment } from "react"
import { Button } from "@/serigraph/ui/button"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/serigraph/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/serigraph/ui/dropdown-menu"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Breadcrumb",
  description:
    "Where a page sits in the site, as a trail of links back up to its sections.",
  item: "breadcrumb",
  group: "Navigation",
}

/** A trail of links ending on the current page. */
function Trail({ steps, page }: { steps: string[]; page: string }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {steps.map((step) => (
          <Fragment key={step}>
            <BreadcrumbItem>
              <BreadcrumbLink href={`#${step.toLowerCase()}`}>
                {step}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </Fragment>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage>{page}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default function BreadcrumbDemo() {
  return (
    <>
      <DemoSection title="On a page">
        <StateRow label="Session">
          <Trail steps={["Meridian", "Sessions"]} page="Saturn at opposition" />
        </StateRow>
        <StateRow label="Long, wrapping">
          <Trail
            steps={["Meridian", "Telescopes", "Zeiss refractor", "Bookings"]}
            page="Thursday 5 November, 20:30, the observing deck"
          />
        </StateRow>
      </DemoSection>
      <DemoSection title="Variations">
        <StateRow label="Collapsed">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#meridian">Meridian</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label="Show the hidden steps"
                      />
                    }
                  >
                    <BreadcrumbEllipsis />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Telescopes</DropdownMenuItem>
                    <DropdownMenuItem>Zeiss refractor</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#bookings">Bookings</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Row F, seat 12</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </StateRow>
        <StateRow label="Slash between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#members">Members</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="#ada">Ada Lovelace</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Seats</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </StateRow>
      </DemoSection>
    </>
  )
}
