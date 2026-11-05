import { useState, type ReactNode } from "react"
import { Slider } from "@/serigraph/ui/slider"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Slider",
  description:
    "Sets a value or a range by dragging along a line, such as the dome's light: the thumb is a pinwheel that rolls as it goes.",
  item: "slider",
  group: "Forms",
}

function Labelled({
  id,
  label,
  value,
  children,
}: {
  id: string
  label: string
  value: string
  children: ReactNode
}) {
  return (
    <div className="grid w-full max-w-80 grid-cols-[1fr_auto] items-baseline gap-x-tight gap-y-hair">
      <span id={id} className="caps">
        {label}
      </span>
      <span className="font-mono text-small tabular-nums">{value}</span>
      <div className="col-span-2">{children}</div>
    </div>
  )
}

export default function SliderDemo() {
  const [light, setLight] = useState(30)
  const [magnitude, setMagnitude] = useState([2, 6])
  const [tilt, setTilt] = useState(35)
  return (
    <>
      <DemoSection title="States">
        <StateRow label="One value">
          <Labelled id="slider-light" label="Dome light" value={`${light}%`}>
            <Slider
              aria-labelledby="slider-light"
              value={[light]}
              onValueChange={(v) => setLight(Array.isArray(v) ? v[0] : v)}
            />
          </Labelled>
        </StateRow>
        <StateRow label="Range">
          <Labelled
            id="slider-magnitude"
            label="Magnitude"
            value={`${magnitude[0]}–${magnitude[1]}`}
          >
            <Slider
              aria-labelledby="slider-magnitude"
              value={magnitude}
              min={-2}
              max={8}
              step={0.5}
              onValueChange={(v) =>
                setMagnitude(Array.isArray(v) ? [...v] : [v])
              }
            />
          </Labelled>
        </StateRow>
        <StateRow label="Disabled">
          <Labelled id="slider-volume" label="Narration" value="60%">
            <Slider
              aria-labelledby="slider-volume"
              defaultValue={[60]}
              disabled
            />
          </Labelled>
        </StateRow>
      </DemoSection>
      <DemoSection title="Vertical">
        <StateRow label="Tilt">
          <div className="flex items-start gap-snug">
            <Slider
              aria-labelledby="slider-tilt"
              orientation="vertical"
              value={[tilt]}
              max={90}
              onValueChange={(v) => setTilt(Array.isArray(v) ? v[0] : v)}
              className="h-40"
            />
            <div className="grid gap-hair">
              <span id="slider-tilt" className="caps">
                Telescope tilt
              </span>
              <span className="font-mono text-small tabular-nums">{tilt}°</span>
            </div>
          </div>
        </StateRow>
      </DemoSection>
    </>
  )
}
