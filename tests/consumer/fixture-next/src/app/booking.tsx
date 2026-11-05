"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/serigraph/ui/avatar"
import { Button } from "@/serigraph/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/serigraph/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/serigraph/ui/dropdown-menu"
import { Field, FieldGroup, FieldLabel } from "@/serigraph/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/serigraph/ui/select"
import { Slider } from "@/serigraph/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/serigraph/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/serigraph/ui/tooltip"

const SCOPES = [
  { value: "zeiss", label: "Zeiss refractor" },
  { value: "dob", label: "Dobsonian" },
]

// Client controls for the server page: the booking flow with the overlay and form parts the install test adds: a guide's avatar, the night as a
// segmented control, a dialog with a field, a select and a slider, a seat menu and a tooltip.
export function Booking() {
  const [scope, setScope] = useState("zeiss")
  const [night, setNight] = useState(["tonight"])
  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-4">
        <Avatar>
          <AvatarFallback name="Henrietta Leavitt">HL</AvatarFallback>
        </Avatar>
        <ToggleGroup value={night} onValueChange={setNight} aria-label="Night">
          <ToggleGroupItem value="tonight">Tonight</ToggleGroupItem>
          <ToggleGroupItem value="week">This week</ToggleGroupItem>
        </ToggleGroup>
        <Dialog>
          <DialogTrigger render={<Button />}>Book seats</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Saturn at opposition</DialogTitle>
              <DialogDescription>Thursday, from 21:30</DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="scope">Telescope</FieldLabel>
                <Select
                  items={SCOPES}
                  value={scope}
                  onValueChange={(value) => value && setScope(value)}
                >
                  <SelectTrigger id="scope" className="w-56">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SCOPES.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Minutes at the eyepiece</FieldLabel>
                <Slider defaultValue={[10]} max={30} className="w-64" />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <Button>Book</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            Seat 12
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Show ticket</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              Release seat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Tooltip>
          <TooltipTrigger render={<Button variant="ghost" />}>
            Seeing
          </TooltipTrigger>
          <TooltipContent>Steady air: 4 of 5</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
