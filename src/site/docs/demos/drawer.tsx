import { Button } from "@/serigraph/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/serigraph/ui/drawer"
import { Field, FieldLabel } from "@/serigraph/ui/field"
import { Input } from "@/serigraph/ui/input"
import { Separator } from "@/serigraph/ui/separator"
import { NIGHT, SKY } from "@/site/sample/observatory"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Drawer",
  description:
    "A plane pulled up from the edge of the screen for a quick task on a phone, dismissed by swiping it back.",
  item: "drawer",
  group: "Overlays",
}

/** The quick booking form: a name and a number of seats. */
function BookSeats({ id }: { id: string }) {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col">
      <DrawerHeader>
        <DrawerTitle>Saturn at opposition</DrawerTitle>
        <DrawerDescription>
          {NIGHT.date} · 19:30 · Lecture hall
        </DrawerDescription>
      </DrawerHeader>
      <div className="flex flex-wrap items-end gap-tight px-(--drawer-spacing) pt-snug">
        <Field className="w-auto">
          <FieldLabel htmlFor={`${id}-name`}>Name</FieldLabel>
          <Input
            id={`${id}-name`}
            autoComplete="name"
            placeholder="Ada Lovelace"
            className="w-56 max-w-full"
          />
        </Field>
        <Field className="w-auto">
          <FieldLabel htmlFor={`${id}-seats`}>Seats</FieldLabel>
          <Input
            id={`${id}-seats`}
            inputMode="numeric"
            defaultValue="2"
            className="w-16 text-center tabular-nums"
          />
        </Field>
      </div>
      <DrawerFooter>
        <DrawerClose render={<Button />}>Book 2 seats</DrawerClose>
        <DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose>
      </DrawerFooter>
    </div>
  )
}

/** What is up tonight: each object beside the hours to look. */
function SkyTonight() {
  return (
    <div className="flex min-h-0 w-full flex-col">
      <DrawerHeader>
        <DrawerTitle>The sky tonight</DrawerTitle>
        <DrawerDescription>
          Dark from {NIGHT.darkFrom}, clear until {NIGHT.clearUntil}
        </DrawerDescription>
      </DrawerHeader>
      <ul className="m-0 min-h-0 list-none overflow-y-auto overscroll-contain px-(--drawer-spacing) pt-snug pb-(--drawer-spacing)">
        {SKY.map((o, i) => (
          <li key={o.name}>
            {i > 0 && <Separator />}
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-snug py-tight">
              <span className="font-semibold">{o.name}</span>
              <span className="font-mono text-small tabular-nums">
                {o.best}
              </span>
              <span className="col-span-2 text-small leading-small">
                {o.where}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function DrawerDemo() {
  return (
    <>
      <DemoSection title="Open with the trigger">
        <StateRow label="Bottom, with handle">
          <Drawer showSwipeHandle>
            <DrawerTrigger render={<Button />}>Book seats</DrawerTrigger>
            <DrawerContent>
              <BookSeats id="drawer-handle" />
            </DrawerContent>
          </Drawer>
        </StateRow>
        <StateRow label="Without handle">
          <Drawer>
            <DrawerTrigger render={<Button variant="outline" />}>
              Quick booking
            </DrawerTrigger>
            <DrawerContent>
              <BookSeats id="drawer-plain" />
            </DrawerContent>
          </Drawer>
        </StateRow>
      </DemoSection>
      <DemoSection title="Directions">
        <StateRow label="Swipe">
          <Drawer showSwipeHandle swipeDirection="right">
            <DrawerTrigger render={<Button variant="outline" />}>
              From the right
            </DrawerTrigger>
            <DrawerContent>
              <SkyTonight />
            </DrawerContent>
          </Drawer>
          <Drawer showSwipeHandle swipeDirection="left">
            <DrawerTrigger render={<Button variant="outline" />}>
              From the left
            </DrawerTrigger>
            <DrawerContent>
              <SkyTonight />
            </DrawerContent>
          </Drawer>
          <Drawer showSwipeHandle swipeDirection="up">
            <DrawerTrigger render={<Button variant="outline" />}>
              From the top
            </DrawerTrigger>
            <DrawerContent>
              <SkyTonight />
            </DrawerContent>
          </Drawer>
        </StateRow>
      </DemoSection>
    </>
  )
}
