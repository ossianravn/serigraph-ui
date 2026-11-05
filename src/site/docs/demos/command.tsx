import { useEffect, useState } from "react"
import {
  CalendarDaysIcon,
  FlashlightIcon,
  OrbitIcon,
  PrinterIcon,
  SparklesIcon,
  TelescopeIcon,
  TicketIcon,
} from "lucide-react"
import { Button } from "@/serigraph/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/serigraph/ui/command"
import { Kbd } from "@/serigraph/ui/kbd"
import { inTimeOrder, SESSIONS, SKY } from "@/site/meridian/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Command",
  description:
    "A searchable index of the observatory, for jumping to a session, a planet or an action by typing.",
  item: "command",
  group: "Overlays",
}

const TELESCOPES = ["Zeiss refractor", "Dobsonian", "Solar telescope"]

/** Meridian's index: tonight's sessions, the sky, the telescopes and a few actions. */
function MeridianIndex() {
  return (
    <>
      <CommandEmpty>Nothing matches. Try a planet or a time.</CommandEmpty>
      <CommandGroup heading="Sessions tonight">
        {inTimeOrder(SESSIONS).map((s) => (
          <CommandItem key={s.id} value={`${s.title} ${s.starts} ${s.place}`}>
            <CalendarDaysIcon />
            <span className="min-w-0 truncate">{s.title}</span>
            <CommandShortcut>{s.starts}</CommandShortcut>
          </CommandItem>
        ))}
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="In the sky">
        {SKY.map((o) => (
          <CommandItem key={o.name} value={`${o.name} ${o.kind}`}>
            {o.kind === "planet" ? <OrbitIcon /> : <SparklesIcon />}
            {o.name}
          </CommandItem>
        ))}
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Telescopes">
        {TELESCOPES.map((name) => (
          <CommandItem
            key={name}
            value={name}
            data-checked={name === "Zeiss refractor"}
          >
            <TelescopeIcon />
            {name}
          </CommandItem>
        ))}
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Actions">
        <CommandItem value="Book seats">
          <TicketIcon />
          Book seats
          <CommandShortcut>⌘B</CommandShortcut>
        </CommandItem>
        <CommandItem value="Red light">
          <FlashlightIcon />
          Red light on
          <CommandShortcut>⌘R</CommandShortcut>
        </CommandItem>
        <CommandItem value="Print tonight's sheet" disabled>
          <PrinterIcon />
          Print tonight’s sheet (printer offline)
        </CommandItem>
      </CommandGroup>
    </>
  )
}

function Palette() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Search Meridian
        <Kbd>⌘K</Kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search Meridian"
        description="Sessions, the sky, telescopes and actions"
      >
        <Command>
          <CommandInput placeholder="Session, planet or telescope" />
          <CommandList>
            <MeridianIndex />
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}

export default function CommandDemo() {
  const [query, setQuery] = useState("Pluto")
  return (
    <>
      <DemoSection title="Inline">
        <StateRow label="Index">
          <Command className="h-auto max-w-md" label="Search Meridian">
            <CommandInput placeholder="Session, planet or telescope" />
            <CommandList>
              <MeridianIndex />
            </CommandList>
          </Command>
        </StateRow>
      </DemoSection>
      <DemoSection title="States">
        <StateRow label="Dialog">
          <Palette />
        </StateRow>
        <StateRow label="Nothing found">
          <Command className="h-auto max-w-md" label="Search the sky">
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder="Planet or star"
            />
            <CommandList>
              <MeridianIndex />
            </CommandList>
          </Command>
        </StateRow>
      </DemoSection>
    </>
  )
}
