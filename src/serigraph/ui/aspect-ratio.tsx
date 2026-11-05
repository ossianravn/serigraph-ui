import { cn } from "@/serigraph/lib/utils"

// A frame of fixed proportion: a well tinted from the surface beneath, the 16px radius, and the ink line drawn over
// its edge so a picture runs right to the line. Its children stack to fill it, in order, so a folly placed before an
// image holds the frame until the image paints over it, with no script. Images and video cover the frame; a folly
// fills it (scenes slice from the bottom).

function AspectRatio({
  ratio,
  className,
  ...props
}: React.ComponentProps<"div"> & { ratio: number }) {
  return (
    <div
      data-slot="aspect-ratio"
      style={
        {
          "--ratio": ratio,
        } as React.CSSProperties
      }
      className={cn(
        "field-fill relative isolate aspect-(--ratio) overflow-hidden rounded-box *:absolute *:inset-0 *:size-full [&>img]:object-cover [&>video]:object-cover",
        "after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-[inherit] after:border-(length:--line) after:border-ink",
        className,
      )}
      {...props}
    />
  )
}

export { AspectRatio }
