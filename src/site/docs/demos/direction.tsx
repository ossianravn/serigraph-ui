import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/serigraph/ui/button"
import { DirectionProvider } from "@/serigraph/ui/direction"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/serigraph/ui/dropdown-menu"
import { Slider } from "@/serigraph/ui/slider"
import { Switch } from "@/serigraph/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/serigraph/ui/toggle-group"
import { DemoSection, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Direction",
  description:
    "Tells every primitive which way the page reads, so menus, sliders, segmented controls and keyboard arrows follow right-to-left text.",
  item: "direction",
  group: "Navigation",
}

type Dir = "ltr" | "rtl"

const NIGHTS = ["Thursday 5", "Friday 6", "Saturday 7"]

/** The same small screen in either direction: a segmented control, a menu with a submenu, a slider and a switch. */
function Composition({ dir }: { dir: Dir }) {
  const [when, setWhen] = useState("tonight")
  const [sort, setSort] = useState("time")
  const [light, setLight] = useState(30)
  const id = `direction-${dir}`
  return (
    <DirectionProvider direction={dir}>
      <div dir={dir} className="flex min-w-0 flex-col items-start gap-snug">
        <p className="m-0 caps">
          {dir === "ltr" ? "Left to right" : "Right to left"}
        </p>
        <ToggleGroup
          aria-label={`Nights, ${dir}`}
          spacing={0}
          value={[when]}
          onValueChange={(v) => v[0] && setWhen(v[0])}
        >
          <ToggleGroupItem value="tonight">Tonight</ToggleGroupItem>
          <ToggleGroupItem value="week">This week</ToggleGroupItem>
          <ToggleGroupItem value="month">Month</ToggleGroupItem>
        </ToggleGroup>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            Saturn at opposition <ChevronDownIcon data-icon="inline-end" />
          </DropdownMenuTrigger>
          <DropdownMenuContent dir={dir}>
            <DropdownMenuItem>Book seats</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                Move to another night
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent dir={dir} side="inline-end">
                {NIGHTS.map((night) => (
                  <DropdownMenuItem key={night}>{night}</DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Sort the programme</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                <DropdownMenuRadioItem value="time">
                  By time
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="seats">
                  By seats left
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex flex-col gap-hair">
          <span id={`${id}-light`} className="caps">
            Dome light
          </span>
          <div className="flex items-center gap-tight">
            <Slider
              aria-labelledby={`${id}-light`}
              value={[light]}
              onValueChange={(v) =>
                setLight(Array.isArray(v) ? (v[0] ?? 0) : v)
              }
              className="w-48"
            />
            <output
              dir="ltr"
              className="w-12 font-mono text-small tabular-nums"
            >
              {light}%
            </output>
          </div>
        </div>
        <label className="flex items-center gap-tight">
          <Switch defaultChecked />
          Red light on the deck
        </label>
      </div>
    </DirectionProvider>
  )
}

export default function DirectionDemo() {
  return (
    <DemoSection title="Side by side">
      <div className="grid gap-x-section gap-y-line md:grid-cols-2">
        <Composition dir="ltr" />
        <Composition dir="rtl" />
      </div>
    </DemoSection>
  )
}
