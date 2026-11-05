import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/serigraph/ui/avatar"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Avatar",
  description:
    "Stands for a person: their picture or initials in a circle of spot colour, or a medallion drawn from their name.",
  item: "avatar",
  group: "Data display",
}

const CREW = [
  ["Henrietta Leavitt", "HL", "1"],
  ["Cecilia Payne", "CP", "2"],
  ["Vera Rubin", "VR", "3"],
  ["Jocelyn Bell", "JB", "4"],
] as const

export default function AvatarDemo() {
  return (
    <>
      <DemoSection title="Initials">
        <StateRow label="sm · default · lg">
          <Avatar size="sm">
            <AvatarFallback>AH</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>AH</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>AH</AvatarFallback>
          </Avatar>
        </StateRow>
        <StateRow label="Tones">
          {CREW.map(([name, initials, tone]) => (
            <Avatar key={name} size="lg" data-tone={tone}>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          ))}
        </StateRow>
        <StateRow label="On duty">
          <Avatar size="lg" data-tone="3">
            <AvatarFallback>MM</AvatarFallback>
            <AvatarBadge aria-label="On duty" />
          </Avatar>
          <Avatar>
            <AvatarFallback>MM</AvatarFallback>
            <AvatarBadge aria-label="On duty" />
          </Avatar>
        </StateRow>
      </DemoSection>
      <DemoSection title="Drawn from the name">
        <StateRow label="sm · default · lg">
          <Avatar size="sm">
            <AvatarFallback name="Annie Jump Cannon">AC</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback name="Caroline Herschel">CH</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback name="Maria Mitchell">MM</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback name="Nancy Roman">NR</AvatarFallback>
          </Avatar>
        </StateRow>
      </DemoSection>
      <DemoSection title="Group">
        <StateRow label="Tonight's guides">
          <AvatarGroup>
            {CREW.map(([name, initials, tone]) => (
              <Avatar key={name} data-tone={tone}>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            ))}
            <AvatarGroupCount>+3</AvatarGroupCount>
          </AvatarGroup>
          <AvatarGroup>
            {CREW.slice(0, 3).map(([name, initials]) => (
              <Avatar key={name} size="lg">
                <AvatarFallback name={name}>{initials}</AvatarFallback>
              </Avatar>
            ))}
            <AvatarGroupCount>+12</AvatarGroupCount>
          </AvatarGroup>
        </StateRow>
      </DemoSection>
    </>
  )
}
