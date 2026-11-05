import { CalendarIcon, ChevronDownIcon, SearchIcon, XIcon } from "lucide-react"
import { ArchFrame } from "@/serigraph/extras/arch-frame"
import { CloudBand } from "@/serigraph/extras/cloud-band"
import { Folly } from "@/serigraph/extras/folly"
import { Medallion } from "@/serigraph/extras/medallion"
import { OrdinalDate } from "@/serigraph/extras/ordinal-date"
import { PosterCard } from "@/serigraph/extras/poster-card"
import {
  ProgrammeList,
  ProgrammeListItem,
} from "@/serigraph/extras/programme-list"
import { StairStepper } from "@/serigraph/extras/stair-stepper"
import { Float, MenuLabel, MenuRow, Scaled } from "./parts"

// Finders and extras whose demo opens with a list only the browser fills, a row of sizes wider than the plate or a
// whole bill: the same parts, with less of Meridian in them, and the lists drawn open.

function CommandPreview() {
  return (
    <div className="plane flex w-[19rem] flex-col">
      <div className="relative mx-snug flex h-control items-center gap-tight border-b-(length:--line) border-ink">
        <SearchIcon className="size-4 shrink-0" />
        <span className="leading-ui">sat</span>
      </div>
      <div className="p-hair">
        <MenuLabel>Sessions tonight</MenuLabel>
        <MenuRow active end="19:30">
          <CalendarIcon /> Saturn at opposition
        </MenuRow>
        <MenuRow end="20:30">
          <CalendarIcon /> Saturn at the Zeiss
        </MenuRow>
      </div>
    </div>
  )
}

function ComboboxPreview() {
  return (
    <div className="flex flex-col items-start gap-hair">
      <div className="control-field flex h-control-compact w-[15rem] items-center gap-tight ps-snug pe-3.5">
        <span className="flex-1">Zei</span>
        <XIcon className="size-3.5" />
        <ChevronDownIcon className="size-4" />
      </div>
      <Float className="w-[15rem] p-hair">
        <MenuRow active checked>
          Zeiss refractor, 150 mm
        </MenuRow>
        <MenuRow>Zeiss binoculars</MenuRow>
      </Float>
    </div>
  )
}

function MedallionPreview() {
  return (
    <div className="flex items-center gap-line">
      <Medallion size="sm" seed="meridian-orrery" />
      <Medallion seed="meridian-dome" />
    </div>
  )
}

function ProgrammeListPreview() {
  return (
    <Scaled by={0.8}>
      <ProgrammeList aria-label="This week at Meridian" className="w-[21rem]">
        <ProgrammeListItem
          lettered
          date={<OrdinalDate date="2026-11-05" format="day" />}
          title="Saturn at opposition"
          facts={["21:00", "The dome", "Sold out"]}
        />
        <ProgrammeListItem
          date={<OrdinalDate date="2026-11-06" format="day" />}
          title="The rings of Saturn"
          facts={["19:30", "Lecture theatre"]}
        />
      </ProgrammeList>
    </Scaled>
  )
}

function StairStepperPreview() {
  return (
    <StairStepper
      aria-label="Booking"
      steps={["Seats", "Details", "Pay", "Done"]}
      current={2}
      className="w-[19rem]"
    />
  )
}

function PosterCardPreview() {
  return (
    <Scaled by={0.5}>
      <PosterCard
        title="The rings of Saturn"
        kicker="Lecture theatre"
        className="w-[16rem]"
      />
    </Scaled>
  )
}

function ArchFramePreview() {
  return (
    <Scaled by={0.7} className="flex items-end gap-line">
      <ArchFrame size="sm">
        <Folly template="window" seed="meridian-east" />
      </ArchFrame>
      <ArchFrame>
        <Folly template="window" seed="meridian-dome" />
      </ArchFrame>
    </Scaled>
  )
}

/** A section edge at its own size: the canvas above, the band, and the ground its clouds run on into. */
function CloudBandPreview() {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="canvas flex-1 px-snug pt-snug">
        <p className="m-0 caps">The dome</p>
      </div>
      <CloudBand seed="meridian-dome" above="canvas" className="h-24" />
      <div className="ground px-snug pt-hair pb-snug">
        <p className="m-0 caps">Visiting</p>
      </div>
    </div>
  )
}

export const EXTRA_PREVIEWS = {
  command: CommandPreview,
  combobox: ComboboxPreview,
  medallion: MedallionPreview,
  "programme-list": ProgrammeListPreview,
  "stair-stepper": StairStepperPreview,
  "poster-card": PosterCardPreview,
  "arch-frame": ArchFramePreview,
  "cloud-band": CloudBandPreview,
}

/** Demos whose first example is the part itself, only larger than the plate: drawn smaller instead. */
export const SCALE: Record<string, number> = {
  empty: 0.7,
  "colourway-switcher": 0.85,
  "ticket-stub": 0.85,
}
