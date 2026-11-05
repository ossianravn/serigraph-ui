import { OrdinalDate } from "@/serigraph/extras/ordinal-date"
import {
  ProgrammeList,
  ProgrammeListItem,
} from "@/serigraph/extras/programme-list"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Programme list",
  description:
    "Lists what is on, like the bill on a poster: the date with its raised ordinal, the title in the caps or lettered, and the facts between middle dots.",
  item: "programme-list",
  group: "Serigraph extras",
}

export default function ProgrammeListDemo() {
  return (
    <>
      <DemoSection title="This week">
        <ProgrammeList aria-label="This week at Meridian">
          <ProgrammeListItem
            lettered
            date={<OrdinalDate date="2026-11-05" format="day" />}
            title="Saturn at opposition"
            facts={["21:00", "The dome", "Sold out"]}
          >
            <p>
              The rings open to their widest this year; the big refractor is
              yours for ten minutes.
            </p>
          </ProgrammeListItem>
          <ProgrammeListItem
            date={<OrdinalDate date="2026-11-06" format="day" />}
            title="The rings of Saturn"
            facts={["19:30", "Lecture theatre"]}
          />
          <ProgrammeListItem
            date={<OrdinalDate date="2026-11-07" format="day" />}
            title="The children's sky"
            facts={["11:00", "Planetarium"]}
          />
          <ProgrammeListItem
            date={<OrdinalDate date="2026-11-08" format="day" />}
            title="Telescope evening"
            facts={["19:30", "Terrace", "Free"]}
          />
          <ProgrammeListItem
            date={<OrdinalDate date="2026-11-11" format="day" />}
            title="Meteor watch: the northern Taurids, with hot drinks on the terrace"
            facts={["22:00", "Terrace", "Bring a coat"]}
          />
        </ProgrammeList>
      </DemoSection>
      <DemoSection title="Plain">
        <StateRow label="Captions only">
          <ProgrammeList aria-label="Next week">
            <ProgrammeListItem
              date={<OrdinalDate date="2026-11-12" format="day" />}
              title="Moon and Pleiades"
              facts={["20:00", "The dome"]}
            />
            <ProgrammeListItem
              date={<OrdinalDate date="2026-11-13" format="day" />}
              title="A night at the refractor"
            />
          </ProgrammeList>
        </StateRow>
      </DemoSection>
    </>
  )
}
