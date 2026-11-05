import type { ReactNode } from "react"
import {
  ChevronDownIcon,
  CloudMoonIcon,
  CopyIcon,
  ExternalLinkIcon,
  MapIcon,
  StarIcon,
  TelescopeIcon,
} from "lucide-react"
import { Motif } from "@/serigraph/extras/motif"
import { Avatar, AvatarFallback } from "@/serigraph/ui/avatar"
import { Button } from "@/serigraph/ui/button"
import { Input } from "@/serigraph/ui/input"
import { Float, MenuLabel, MenuRow, MenuRule, PageLines, Screen } from "./parts"

// Overlays as they look open, for the Components index, with Meridian's content: each drawn from the kit's own
// utilities, since a real popup opens in a portal and only in the browser.

function Heading({ children }: { children: ReactNode }) {
  return (
    <p className="m-0 font-read text-lead leading-ui font-semibold">
      {children}
    </p>
  )
}

function DialogPreview() {
  return (
    <>
      <Screen />
      <div className="plane relative grid w-[19rem] gap-tight p-snug">
        <Heading>Saturn at opposition</Heading>
        <p className="m-0 text-small leading-small">
          Thursday 5 November · the dome opens at 21:30
        </p>
        <div className="flex gap-tight">
          <Input
            placeholder="Ada Lovelace"
            className="h-control-compact w-44"
          />
          <Input
            defaultValue="2"
            className="h-control-compact w-14 text-center tabular-nums"
          />
        </div>
        <div className="flex justify-end gap-tight">
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm">Book seats</Button>
        </div>
      </div>
    </>
  )
}

function AlertDialogPreview() {
  return (
    <>
      <Screen />
      <div className="plane relative grid w-[19rem] gap-tight p-snug">
        <Heading>Cancel your booking?</Heading>
        <p className="m-0 text-small leading-small">
          Your 2 seats for Saturn at opposition go back on sale.
        </p>
        <div className="flex justify-end gap-tight">
          <Button variant="outline" size="sm">
            Keep it
          </Button>
          <Button variant="destructive" size="sm">
            Cancel booking
          </Button>
        </div>
      </div>
    </>
  )
}

/** The page an overlay opens over: a few lines of text in the plate's top left. */
function Page({ className }: { className?: string }) {
  return (
    <div className={`absolute inset-x-snug top-snug ${className ?? ""}`}>
      <PageLines widths={[46, 88, 72, 80, 54]} />
    </div>
  )
}

function SheetPreview() {
  return (
    <>
      <Page className="end-[58%]" />
      <Screen />
      <div className="plane absolute inset-y-0 end-0 flex w-[56%] flex-col gap-hair rounded-e-none border-e-0 p-snug">
        <span className="caps">Telescope deck · 20:30</span>
        <Heading>Zeiss refractor</Heading>
        <p className="m-0 text-small leading-small">
          Ten minutes at the eyepiece; 3 of 8 places left.
        </p>
        <Button size="sm" className="mt-auto self-start">
          Book a place
        </Button>
      </div>
    </>
  )
}

function DrawerPreview() {
  return (
    <>
      <Page />
      <Screen />
      <div className="plane absolute inset-x-0 bottom-0 flex flex-col items-center gap-hair rounded-b-none border-b-0 px-snug pt-tight pb-snug text-center">
        <span className="mb-hair block h-2.5 w-12 rounded-full border-(length:--line) border-ink field-fill" />
        <Heading>Book seats</Heading>
        <p className="m-0 text-small leading-small">
          Saturn at opposition · Thursday, 21:30
        </p>
        <Button size="sm" className="mt-hair">
          Book 2 seats
        </Button>
      </div>
    </>
  )
}

function PopoverPreview() {
  return (
    <div className="flex flex-col items-start gap-hair">
      <Button variant="outline" size="sm">
        <CloudMoonIcon data-icon="inline-start" /> Sky tonight
      </Button>
      <Float className="flex w-64 flex-col gap-hair p-snug">
        <p className="m-0 text-body leading-ui font-semibold">
          Sky over Meridian
        </p>
        <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-snug gap-y-1">
          {[
            ["Cloud", "12%"],
            ["Seeing", "3/5"],
            ["Moon", "31%, sets 23:48"],
          ].map(([term, value]) => (
            <div key={term} className="contents">
              <dt>{term}</dt>
              <dd className="m-0 text-end font-mono">{value}</dd>
            </div>
          ))}
        </dl>
      </Float>
    </div>
  )
}

function HoverCardPreview() {
  return (
    <div className="flex w-[18rem] flex-col">
      <p className="m-0 text-body leading-body">
        Saturn at opposition, with{" "}
        <span className="underline decoration-(length:--line) underline-offset-[0.2em]">
          Vera Rubin
        </span>{" "}
        in the lecture hall.
      </p>
      <Float className="ms-[22%] mt-hair flex w-60 gap-tight p-snug">
        <Avatar size="lg" data-tone="3">
          <AvatarFallback>VR</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-body leading-ui font-semibold">Vera Rubin</span>
          <span>Hosts the Thursday talks.</span>
          <span className="font-mono">Thu 5 Nov, 19:30</span>
        </div>
      </Float>
    </div>
  )
}

function TooltipPreview() {
  return (
    <div className="flex flex-col items-center">
      <span className="rounded-[0.75rem] border-(length:--line) border-ink bg-ink px-tight py-1 font-read text-small leading-ui text-paper">
        Point the telescope
      </span>
      <span className="-mt-1 mb-hair size-2 rotate-45 rounded-[1px] bg-ink" />
      <div className="flex gap-tight">
        <Button variant="outline" size="icon">
          <StarIcon />
        </Button>
        <Button variant="outline" size="icon">
          <TelescopeIcon />
        </Button>
        <Button variant="outline" size="icon">
          <MapIcon />
        </Button>
      </div>
    </div>
  )
}

function SonnerPreview() {
  return (
    <Float className="flex w-[19rem] items-start gap-tight py-tight ps-snug pe-tight">
      <span className="grid size-5 shrink-0 place-items-center">
        <Motif kind="sparkle" seed="toast" className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="m-0 font-semibold">Two seats booked</p>
        <p className="m-0">Saturn at opposition · 19:30</p>
      </div>
      <Button variant="outline" size="xs" className="shrink-0 self-center">
        Undo
      </Button>
    </Float>
  )
}

function DropdownMenuPreview() {
  return (
    <div className="flex flex-col items-start gap-hair">
      <Button variant="outline" size="sm">
        Telescope <ChevronDownIcon data-icon="inline-end" />
      </Button>
      <Float className="w-max p-hair">
        <MenuLabel>Eyepiece</MenuLabel>
        <MenuRow>32 mm, wide field</MenuRow>
        <MenuRow active checked>
          12 mm, planets
        </MenuRow>
        <MenuRule />
        <MenuRow end="⌘R">Red light</MenuRow>
      </Float>
    </div>
  )
}

function ContextMenuPreview() {
  return (
    <div className="flex w-[18rem] flex-col">
      <div className="plane flex flex-col gap-1 p-tight ps-snug" data-tone="4">
        <span className="font-mono text-small">21:00–21:40 · Dome</span>
        <span className="text-body leading-ui font-semibold">
          Andromeda and the local group
        </span>
      </div>
      <Float className="-mt-tight ms-[38%] w-max p-hair">
        <MenuRow>
          <ExternalLinkIcon /> Open session
        </MenuRow>
        <MenuRow active end="⌘C">
          <CopyIcon /> Copy link
        </MenuRow>
        <MenuRow>Remind me</MenuRow>
      </Float>
    </div>
  )
}

function SelectPreview() {
  return (
    <div className="flex flex-col items-start gap-hair">
      <div className="control-field flex h-control-compact w-44 items-center justify-between gap-tight ps-snug pe-3.5">
        Saturn <ChevronDownIcon className="size-4" />
      </div>
      <Float className="w-44 p-hair">
        <MenuRow>Jupiter</MenuRow>
        <MenuRow active checked>
          Saturn
        </MenuRow>
        <MenuRow>Uranus</MenuRow>
      </Float>
    </div>
  )
}

export const OVERLAY_PREVIEWS = {
  dialog: DialogPreview,
  "alert-dialog": AlertDialogPreview,
  sheet: SheetPreview,
  drawer: DrawerPreview,
  popover: PopoverPreview,
  "hover-card": HoverCardPreview,
  tooltip: TooltipPreview,
  sonner: SonnerPreview,
  "dropdown-menu": DropdownMenuPreview,
  "context-menu": ContextMenuPreview,
  select: SelectPreview,
}
