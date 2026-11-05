import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/serigraph/lib/utils"

// A pill that stays down. Pressed, it takes the highlight inside an ink line; disabled and pressed, a pale highlight
// with the quiet line, so the state still shows. The default has no line until the pointer comes (like a ghost
// button); outline keeps the surface's edge. Words in the extended capitals, the contour under the pointer, and in
// forced colours the pressed line doubles, since fills vanish there.
const toggleVariants = cva(
  "group/toggle pill contour press inline-flex shrink-0 cursor-pointer items-center justify-center gap-hair caps whitespace-nowrap select-none [--fill-grain:none] [--fill:transparent] [--pill-text:var(--text)] [--press-fill:var(--surface)] aria-invalid:outline-(length:--line) aria-invalid:outline-offset-3 aria-invalid:outline-rose data-pressed:[--fill:var(--highlight)] data-pressed:[--pill-line:var(--ink)] data-pressed:[--pill-text:var(--ink)] data-pressed:[--press-fill:var(--highlight)] disabled:data-pressed:bg-[color-mix(in_oklab,var(--highlight)_40%,var(--paper))] forced-colors:data-pressed:[border-width:calc(var(--line)*2)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "[--pill-line:transparent] hover:not-data-pressed:[--pill-line:var(--edge)]",
        outline: "[--pill-line:var(--edge)]",
      },
      size: {
        default:
          "h-control min-w-control px-snug has-[>svg:only-child]:px-0 has-[>svg:only-child]:[--contour-x:0.5625rem]",
        sm: "h-control-compact min-w-control-compact px-tight [--contour-x:0.5625rem] [--contour-y:0.25rem] has-[>svg:only-child]:px-0 has-[>svg:only-child]:[--contour-x:0.4375rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 min-w-12 px-line has-[>svg:only-child]:px-0 has-[>svg:only-child]:[--contour-x:0.625rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
