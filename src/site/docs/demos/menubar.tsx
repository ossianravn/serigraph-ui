import { useState } from "react"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/serigraph/ui/menubar"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Menubar",
  description:
    "A row of menus along the top of an app, for the commands of a desktop tool such as the dome's show console.",
  item: "menubar",
  group: "Navigation",
}

const LIGHTS = ["Dusk", "Night", "Red only"]

/** The dome's show console: the show, the sky's overlays and the projection. */
function ShowConsole() {
  const [lines, setLines] = useState(true)
  const [labels, setLabels] = useState(true)
  const [meridian, setMeridian] = useState(false)
  const [projection, setProjection] = useState("dome")
  return (
    <Menubar aria-label="Show console">
      <MenubarMenu>
        <MenubarTrigger>Show</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              Start the show <MenubarShortcut>⌘↵</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>
              Pause <MenubarShortcut>Space</MenubarShortcut>
            </MenubarItem>
            <MenubarSub>
              <MenubarSubTrigger>Dome lights</MenubarSubTrigger>
              <MenubarSubContent>
                {LIGHTS.map((light) => (
                  <MenubarItem key={light}>{light}</MenubarItem>
                ))}
              </MenubarSubContent>
            </MenubarSub>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarItem>
            Open the slit <MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>Close the slit</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Sky</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarLabel>Overlays</MenubarLabel>
            <MenubarCheckboxItem checked={lines} onCheckedChange={setLines}>
              Constellation lines
            </MenubarCheckboxItem>
            <MenubarCheckboxItem checked={labels} onCheckedChange={setLabels}>
              Planet labels
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              checked={meridian}
              onCheckedChange={setMeridian}
            >
              The meridian
            </MenubarCheckboxItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarItem>
            Jump to Saturn <MenubarShortcut>⌘J</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarLabel>Projection</MenubarLabel>
            <MenubarRadioGroup value={projection} onValueChange={setProjection}>
              <MenubarRadioItem value="dome">Dome, fisheye</MenubarRadioItem>
              <MenubarRadioItem value="flat">
                Flat, for the lobby
              </MenubarRadioItem>
              <MenubarRadioItem value="vr" disabled>
                Headsets (none connected)
              </MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Session</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New session <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>Duplicate</MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive">
            Cancel tonight’s 21:00
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

export default function MenubarDemo() {
  return (
    <>
      <DemoSection title="Show console">
        <StateRow label="Four menus">
          <ShowConsole />
        </StateRow>
      </DemoSection>
      <DemoSection title="States">
        <StateRow label="One menu disabled">
          <Menubar aria-label="Telescope">
            <MenubarMenu>
              <MenubarTrigger>Telescope</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Slew to target</MenubarItem>
                <MenubarItem>Park</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu disabled>
              <MenubarTrigger>Camera</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Take an exposure</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </StateRow>
      </DemoSection>
    </>
  )
}
