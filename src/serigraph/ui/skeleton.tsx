import { cn } from "@/serigraph/lib/utils"

// A tint of the surface beneath in the shape of the content it stands in for, breathing slowly toward a deeper tint
// (feedback.css). Give it that content's own geometry at the call site: a line of text, a circle for an avatar, a
// card's plane radius. Under reduced motion it holds still.
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("field-fill rounded-box", className)}
      {...props}
    />
  )
}

export { Skeleton }
