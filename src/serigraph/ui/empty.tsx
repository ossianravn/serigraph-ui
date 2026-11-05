import { cva, type VariantProps } from "class-variance-authority"
import { Folly } from "@/serigraph/extras/folly"
import { cn } from "@/serigraph/lib/utils"

// What a place shows when there is nothing in it: the doorway folly (an archway with a dark door, a sparkle above,
// on a small cloud), a title and one line in the reading face, and one action, centred in a reading column, open on
// whatever surface it sits on. EmptyMedia draws the doorway seeded by `seed`, so each empty place has its own;
// children (any other drawing or picture) take its place. The icon variant sets a Lucide icon in a small spot-colour
// circle inside the ink line instead.

function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-snug rounded-plane p-line text-center text-balance text-(--text)",
        className,
      )}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        "flex max-w-[28rem] flex-col items-center gap-hair",
        className,
      )}
      {...props}
    />
  )
}

const emptyMediaVariants = cva(
  "mb-hair flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-transparent [&>[data-slot=folly]]:aspect-[160/150] [&>[data-slot=folly]]:w-32 [&>[data-slot=folly]]:after:hidden",
        icon: "size-12 rounded-full border-(length:--line) border-ink bg-plane-2 text-ink [&_svg:not([class*='size-'])]:size-5 [&_svg]:[stroke-width:calc(var(--line)*1.5)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function EmptyMedia({
  className,
  variant = "default",
  seed,
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof emptyMediaVariants> & {
    /** Seeds the doorway folly drawn when the default variant has no children. */
    seed?: string | number
  }) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    >
      {children ??
        (variant === "default" ? (
          <Folly template="doorway" seed={seed ?? "empty"} />
        ) : null)}
    </div>
  )
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn(
        "font-read text-lead leading-lead font-semibold",
        className,
      )}
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        "text-body leading-body [&>a]:underline [&>a]:underline-offset-[0.22em]",
        className,
      )}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "flex w-full max-w-[28rem] min-w-0 flex-col items-center gap-tight text-small leading-small text-balance",
        className,
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
}
