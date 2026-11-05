import { useState } from "react"
import {
  AccessibilityIcon,
  ArrowRightLeftIcon,
  ChevronDownIcon,
  EllipsisIcon,
  MailIcon,
  TicketIcon,
  Trash2Icon,
} from "lucide-react"
import { Button } from "@/serigraph/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/serigraph/ui/dropdown-menu"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Dropdown menu",
  description:
    "A list of actions or view options that opens from a button and closes once one is chosen.",
  item: "dropdown-menu",
  group: "Overlays",
}

const SWAPS = ["Seat F11", "Seat F13", "Seat G12, behind"]

/** The actions on one seat: icons and shortcuts, a submenu, a toggle, a disabled item and a destructive one. */
function SeatItems() {
  const [wheelchair, setWheelchair] = useState(false)
  return (
    <>
      <DropdownMenuGroup>
        <DropdownMenuLabel>Row F · Seat 12</DropdownMenuLabel>
        <DropdownMenuItem>
          <TicketIcon /> Show ticket
          <DropdownMenuShortcut>T</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <ArrowRightLeftIcon /> Swap with
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {SWAPS.map((seat) => (
              <DropdownMenuItem key={seat}>{seat}</DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem disabled>
          <MailIcon /> Send ticket again (sent 18:02)
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuCheckboxItem
        checked={wheelchair}
        onCheckedChange={setWheelchair}
      >
        <AccessibilityIcon /> Wheelchair space
      </DropdownMenuCheckboxItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive">
        <Trash2Icon /> Release seat
        <DropdownMenuShortcut>Del</DropdownMenuShortcut>
      </DropdownMenuItem>
    </>
  )
}

/** A booking row: the seat, its show, the price, and its menu at the end. */
function SeatRow() {
  return (
    <div className="flex w-full max-w-[28rem] items-center gap-snug">
      <div className="min-w-0">
        <div className="leading-ui">Row F · Seat 12</div>
        <div className="text-small leading-small">
          Saturn at opposition · Thu 5 Nov
        </div>
      </div>
      <span className="ms-auto font-mono text-small">120 kr</span>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Actions for seat F12"
            />
          }
        >
          <EllipsisIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <SeatItems />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default function DropdownMenuDemo() {
  const [eyepiece, setEyepiece] = useState("12")
  const [crosshair, setCrosshair] = useState(true)
  const [redLight, setRedLight] = useState(true)
  return (
    <>
      <DemoSection title="On a booking">
        <StateRow label="Seat menu">
          <SeatRow />
        </StateRow>
      </DemoSection>
      <DemoSection title="Open with the trigger">
        <StateRow label="Telescope options">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              Telescope <ChevronDownIcon data-icon="inline-end" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Eyepiece</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={eyepiece}
                  onValueChange={setEyepiece}
                >
                  <DropdownMenuRadioItem value="32">
                    32 mm, wide field
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="12">
                    12 mm, planets
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="6" disabled>
                    6 mm, too soft tonight
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>Show</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={crosshair}
                  onCheckedChange={setCrosshair}
                >
                  Crosshair
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={redLight}
                  onCheckedChange={setRedLight}
                >
                  Red light
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem disabled>
                  Live camera (guide only)
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </StateRow>
      </DemoSection>
    </>
  )
}
