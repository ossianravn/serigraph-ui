import { useState } from "react"
import { CopyIcon, ExternalLinkIcon, MoveRightIcon, XIcon } from "lucide-react"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/serigraph/ui/context-menu"
import { SESSIONS, seatsLeft } from "@/site/meridian/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Context menu",
  description:
    "The actions on one thing, opened where the pointer is with a right-click or a long press.",
  item: "context-menu",
  group: "Overlays",
}

const show = SESSIONS.find((s) => s.id === "late-show")!
const ROOMS = ["Dome", "Lecture hall", "Deck"]

export default function ContextMenuDemo() {
  const [onBoard, setOnBoard] = useState(true)
  const [reminder, setReminder] = useState("hour")
  return (
    <DemoSection title="On a session">
      <StateRow label="Right-click or hold">
        <ContextMenu>
          <ContextMenuTrigger
            className="plane flex w-[22rem] max-w-full flex-col gap-hair p-snug"
            data-tone="4"
          >
            <span className="font-mono text-small">
              {show.starts}–{show.ends} · {show.place}
            </span>
            <span className="text-lead leading-ui font-semibold">
              {show.title}
            </span>
            <span className="text-small leading-small">
              {show.host} · {seatsLeft(show)} of {show.seats} seats left
            </span>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuGroup>
              <ContextMenuItem>
                <ExternalLinkIcon /> Open session
              </ContextMenuItem>
              <ContextMenuItem>
                <CopyIcon /> Copy link
                <ContextMenuShortcut>⌘C</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuSub>
                <ContextMenuSubTrigger>
                  <MoveRightIcon /> Move to
                </ContextMenuSubTrigger>
                <ContextMenuSubContent>
                  {ROOMS.map((room) => (
                    <ContextMenuItem key={room} disabled={room === show.place}>
                      {room}
                    </ContextMenuItem>
                  ))}
                </ContextMenuSubContent>
              </ContextMenuSub>
            </ContextMenuGroup>
            <ContextMenuSeparator />
            <ContextMenuCheckboxItem
              checked={onBoard}
              onCheckedChange={setOnBoard}
            >
              Show on the lobby board
            </ContextMenuCheckboxItem>
            <ContextMenuSeparator />
            <ContextMenuGroup>
              <ContextMenuLabel>Remind me</ContextMenuLabel>
              <ContextMenuRadioGroup
                value={reminder}
                onValueChange={setReminder}
              >
                <ContextMenuRadioItem value="none">Never</ContextMenuRadioItem>
                <ContextMenuRadioItem value="quarter">
                  15 minutes before
                </ContextMenuRadioItem>
                <ContextMenuRadioItem value="hour">
                  An hour before
                </ContextMenuRadioItem>
              </ContextMenuRadioGroup>
            </ContextMenuGroup>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive">
              <XIcon /> Cancel session
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </StateRow>
    </DemoSection>
  )
}
