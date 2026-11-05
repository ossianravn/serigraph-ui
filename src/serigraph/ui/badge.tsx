import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/serigraph/lib/utils"

// A small flat pill in the mono face. The default takes the highlight; secondary a tone (data-tone="1" … "4");
// outline is just the line; destructive is rose. Flat: no grain, no contour, nothing pressed.
const badgeVariants = cva(
  "group/badge inline-flex h-[1.375rem] w-fit shrink-0 items-center justify-center gap-1 rounded-full border-(length:--line) px-[0.55rem] font-mono text-[0.75rem] leading-none whitespace-nowrap no-underline has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "border-ink bg-highlight text-ink",
        secondary:
          "border-ink bg-tone-1 text-ink data-[tone=2]:bg-tone-2 data-[tone=3]:bg-tone-3 data-[tone=4]:bg-tone-4",
        destructive: "border-ink bg-rose text-ink",
        outline: "border-(--edge) text-(--text)",
        ghost: "border-transparent text-(--text) [a]:hover:border-(--edge)",
        link: "border-transparent px-0 text-(--text) underline underline-offset-[0.25em]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      { className: cn(badgeVariants({ variant }), className) },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
