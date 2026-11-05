"use client"

import { Fragment, useState } from "react"
import { Badge } from "@/serigraph/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/serigraph/ui/popover"
import { ToggleGroup, ToggleGroupItem } from "@/serigraph/ui/toggle-group"
import {
  choicesFor,
  PASS,
  ROLES,
  type Colourway,
  type OnCanvas,
  type Pair,
  type Role,
} from "./colourway"
import type { Pigment } from "./ink"

const title = (v: string) => v.charAt(0).toUpperCase() + v.slice(1)
const GROUPS = [...new Set(ROLES.map((r) => r.group))]

/** The lowest ratio a row carries, in mono; under 4.5:1 it is a rose badge with its word. */
function Ratio({ pairs }: { pairs: Pair[] }) {
  if (!pairs.length) return null
  const low = pairs.reduce((a, b) => (b.ratio < a.ratio ? b : a))
  const text = `${low.ratio.toFixed(1)}:1`
  return low.ratio < PASS ? (
    <Badge variant="destructive" title={low.label}>
      {text} low
    </Badge>
  ) : (
    <span className="studio-ratio" title={low.label}>
      {text}
    </span>
  )
}

/** A round spot in the fine line. */
export const Spot = ({ pigment }: { pigment: Pigment }) => (
  <span
    className="studio-chip"
    aria-hidden="true"
    style={{ background: `var(--${pigment})` }}
  />
)

/** The role's spot as a pill; it opens the spots the role may take, two to a row. */
function SpotPicker({
  role,
  label,
  value,
  onChange,
}: {
  role: Role
  label: string
  value: Pigment
  onChange: (pigment: Pigment) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="studio-pick"
        aria-label={`${label}: ${title(value)}`}
      >
        <Spot pigment={value} />
        {title(value)}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="studio-spots"
        aria-label={`${label} colour`}
      >
        <div role="group" aria-label={`${label} colour`}>
          {choicesFor(role).map((pigment) => (
            <button
              key={pigment}
              type="button"
              className="studio-spot"
              aria-pressed={pigment === value}
              onClick={() => {
                onChange(pigment)
                setOpen(false)
              }}
            >
              <Spot pigment={pigment} />
              {title(pigment)}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

/** Every role as a row in a narrow column, grouped: its name, its lowest contrast and its spot. */
export function RoleList({
  colourway,
  pairs,
  onRole,
  onCanvasText,
}: {
  colourway: Colourway
  pairs: Pair[]
  onRole: (role: Role, pigment: Pigment) => void
  onCanvasText: (text: OnCanvas) => void
}) {
  const rowPairs = (row: Pair["row"]) => pairs.filter((p) => p.row === row)
  return (
    <div className="studio-roles">
      {GROUPS.map((group) => (
        <section
          key={group}
          className="studio-group"
          aria-labelledby={`studio-${group}`}
        >
          <h3 id={`studio-${group}`} className="caps studio-kicker">
            {group}
          </h3>
          {ROLES.filter((r) => r.group === group).map(({ key, label }) => (
            <Fragment key={key}>
              <div className="studio-role">
                <span className="studio-role-name">
                  {label}
                  <Ratio pairs={rowPairs(key)} />
                </span>
                <SpotPicker
                  role={key}
                  label={label}
                  value={colourway.roles[key]}
                  onChange={(pigment) => onRole(key, pigment)}
                />
              </div>
              {key === "canvas" && (
                <div className="studio-role">
                  <span className="studio-role-name">
                    <span id="studio-on-canvas">Text on canvas</span>
                    <Ratio pairs={rowPairs("on-canvas")} />
                  </span>
                  <ToggleGroup
                    spacing={0}
                    size="sm"
                    aria-labelledby="studio-on-canvas"
                    value={[colourway.onCanvas]}
                    onValueChange={(next: unknown[]) =>
                      next[0] && onCanvasText(next[0] as OnCanvas)
                    }
                    className="studio-segmented"
                  >
                    <ToggleGroupItem value="ink">Ink</ToggleGroupItem>
                    <ToggleGroupItem value="paper">Paper</ToggleGroupItem>
                  </ToggleGroup>
                </div>
              )}
            </Fragment>
          ))}
        </section>
      ))}
    </div>
  )
}
