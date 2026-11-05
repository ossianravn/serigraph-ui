import { Kbd, KbdGroup } from "@/serigraph/ui/kbd"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Kbd",
  description:
    "Names a key or a shortcut: the key in the mono face inside a small pill with the line.",
  item: "kbd",
  group: "Data display",
}

export default function KbdDemo() {
  return (
    <DemoSection title="Keys">
      <StateRow label="Single">
        <Kbd>/</Kbd>
        <Kbd>Esc</Kbd>
        <Kbd>←</Kbd>
        <Kbd>→</Kbd>
        <Kbd>Enter</Kbd>
      </StateRow>
      <StateRow label="Group">
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <span>+</span>
          <Kbd>K</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd>Shift</Kbd>
          <span>+</span>
          <Kbd>N</Kbd>
        </KbdGroup>
      </StateRow>
      <StateRow label="In a sentence">
        <p className="m-0 max-w-measure">
          Press <Kbd>/</Kbd> to search the sky map, and <Kbd>←</Kbd>{" "}
          <Kbd>→</Kbd> to step through tonight’s hours.
        </p>
      </StateRow>
    </DemoSection>
  )
}
