"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { SearchIcon } from "lucide-react"
import { cn } from "@/serigraph/lib/utils"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/serigraph/ui/dialog"

// A plane for finding things by typing: the plane colour, the ink line, the big radius, the grain. The query sits on
// one fine line, with no box; while it has focus the line doubles, and that is its focus mark (cmdk keeps focus in the
// query and moves the selection with the arrows). Results below are menu items: the selected one sits on a flat
// highlight pill (styles/navigation.css maps cmdk's data-selected onto it), group headings speak in the capitals,
// shortcuts in the mono face, and a checked result has a fine ink tick at its end. Inside a dialog the dialog's plane
// is the frame, so the command drops its own.

// Lucide's 24-unit icons at 16px: a stroke of 1.5 × the line renders as exactly one line.
const fineIcon = "[stroke-width:calc(var(--line)*1.5)]"

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "plane flex size-full flex-col overflow-hidden text-(--text)",
        className,
      )}
      {...props}
    />
  )
}

function CommandDialog({
  title = "Command palette",
  description = "Search for a command to run…",
  children,
  className,
  showCloseButton = false,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
  children: React.ReactNode
}) {
  return (
    <Dialog {...props}>
      <DialogContent
        className={cn(
          "mt-[12vh] mb-auto gap-0 overflow-hidden p-0 [--dialog-spacing:0rem] sm:mt-[18vh] sm:max-w-lg sm:[--dialog-spacing:0rem]",
          className,
        )}
        showCloseButton={showCloseButton}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="relative mx-snug flex h-control shrink-0 items-center gap-tight text-(--text) after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:border-b-(length:--line) after:border-(--edge) has-[input:disabled]:text-(--text-quiet) has-[input:focus-visible]:after:border-b-[calc(var(--line)*2)]"
    >
      <SearchIcon className={cn("size-4 shrink-0", fineIcon)} />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "h-full w-full min-w-0 flex-1 bg-transparent font-read text-[length:max(1rem,16px)] leading-ui text-(--text) outline-hidden placeholder:text-(--text-quiet) disabled:cursor-not-allowed disabled:text-(--text-quiet)",
          className,
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-[18rem] scroll-py-hair overflow-x-hidden overflow-y-auto overscroll-contain p-hair",
        className,
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn(
        "px-snug py-line text-center text-small leading-small text-(--text)",
        className,
      )}
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "text-(--text) **:[[cmdk-group-heading]]:caps **:[[cmdk-group-heading]]:px-tight **:[[cmdk-group-heading]]:pt-tight **:[[cmdk-group-heading]]:pb-hair",
        className,
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      // A listbox may own only groups and options, and cmdk fixes role="separator", so the line is drawn for the eye
      // and hidden from assistive tech; the group headings already divide the list.
      aria-hidden="true"
      className={cn(
        "pointer-events-none mx-tight my-hair h-0 border-t-(length:--line) border-(--edge)",
        className,
      )}
      {...props}
    />
  )
}

function CommandItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "group/command-item menu-item px-tight py-hair pointer-coarse:py-tight",
        className,
      )}
      {...props}
    >
      {children}
      <svg
        viewBox="0 0 14 14"
        aria-hidden="true"
        className="ms-auto hidden size-3.5 shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] group-has-data-[slot=command-shortcut]/command-item:hidden! group-data-[checked=true]/command-item:block"
      >
        <path d="M2.5 7.4 5.6 10.3 11.5 3.6" strokeWidth={1.6} />
      </svg>
    </CommandPrimitive.Item>
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ms-auto ps-snug font-mono text-small leading-ui text-(--text)",
        className,
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
