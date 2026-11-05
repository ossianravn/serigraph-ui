import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/serigraph/lib/utils"

// Pills in the colourway's colours inside one ink line, their words in Serigraph Sans. The main action is the action
// colour; secondary is plane 2; outline is just the line on whatever is beneath; ghost has no line until the pointer
// comes; destructive is rose with its word. Under the pointer a short contour appears inside the upper left; pressed,
// the fill steps to its shade. Focus is the page's concentric ring.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center caps whitespace-nowrap no-underline select-none press [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 aria-invalid:outline-(length:--line) aria-invalid:outline-rose aria-invalid:outline-offset-3",
  {
    variants: {
      variant: {
        default: "pill contour [--fill:var(--action)]",
        secondary: "pill contour [--fill:var(--plane-2)]",
        outline:
          "pill contour [--fill:transparent] [--fill-grain:none] [--pill-line:var(--edge)] [--pill-text:var(--text)] [--press-fill:var(--surface)]",
        ghost:
          "pill contour [--fill:transparent] [--fill-grain:none] [--pill-line:transparent] [--pill-text:var(--text)] [--press-fill:var(--surface)] hover:[--pill-line:var(--edge)] aria-expanded:[--pill-line:var(--edge)]",
        destructive: "pill contour [--fill:var(--rose)]",
        link: "h-auto! px-0! text-(--text) underline decoration-(length:--line) underline-offset-[0.25em] disabled:cursor-not-allowed disabled:text-(--text-quiet)",
      },
      size: {
        default:
          "h-control gap-tight px-line has-data-[icon=inline-end]:pe-snug has-data-[icon=inline-start]:ps-snug",
        xs: "h-7 gap-hair px-tight text-[0.6875rem] [--contour-x:0.5rem] [--contour-y:0.25rem] [&_svg:not([class*='size-'])]:size-3",
        sm: "h-control-compact gap-hair px-snug [--contour-x:0.5625rem] [--contour-y:0.25rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-tight px-section",
        icon: "size-control [--contour-x:0.5625rem]",
        "icon-xs":
          "size-7 [--contour-x:0.375rem] [--contour-y:0.25rem] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-control-compact [--contour-x:0.4375rem] [--contour-y:0.25rem]",
        "icon-lg": "size-12 [--contour-x:0.625rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
