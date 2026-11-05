import { cn } from "@/serigraph/lib/utils"

// A key: its name in Serigraph Mono inside a small pill with the ink line, on a tint of the surface beneath. A single
// key is a circle, a word a pill. Inside a tooltip's ink pill the line and the name turn paper.
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "field-fill pointer-events-none inline-flex h-[1.375rem] w-fit min-w-[1.375rem] items-center justify-center gap-1 rounded-full border-(length:--line) border-ink px-[0.4375rem] font-mono text-[0.75rem] leading-none text-ink select-none in-data-[slot=tooltip-content]:border-paper in-data-[slot=tooltip-content]:bg-transparent in-data-[slot=tooltip-content]:text-paper [&_svg:not([class*='size-'])]:size-3",
        className,
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
