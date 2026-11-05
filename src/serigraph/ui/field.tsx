import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/serigraph/lib/utils"
import { Label } from "@/serigraph/ui/label"
import { Separator } from "@/serigraph/ui/separator"

// Label, control, description and error in one column of readable width. Children keep the widths they are given
// (a short field stays short). Above its control the label is in the extended capitals; beside a check or a switch
// it is in the reading voice. The description is the reading voice at the small size, and an error is written in the
// surface's text after a small rose dot. A label that wraps a whole Field is a choice card (styles/forms.css).

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "m-0 flex min-w-0 flex-col gap-snug border-0 p-0 has-[>[data-slot=checkbox-group]]:gap-tight has-[>[data-slot=radio-group]]:gap-tight",
        className,
      )}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-hair p-0 text-(--text) data-[variant=label]:caps data-[variant=legend]:font-read data-[variant=legend]:text-lead data-[variant=legend]:leading-lead data-[variant=legend]:font-semibold",
        className,
      )}
      {...props}
    />
  )
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-line data-[slot=checkbox-group]:gap-tight",
        className,
      )}
      {...props}
    />
  )
}

const fieldVariants = cva("group/field flex w-full gap-hair", {
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal:
        "flex-row items-center gap-tight has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-0.5",
      responsive:
        "flex-col @md/field-group:flex-row @md/field-group:items-center @md/field-group:gap-tight @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-0.5",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
})

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "group/field-content flex flex-1 flex-col gap-0.5 leading-small",
        className,
      )}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "group/field-label peer/field-label flex w-fit gap-tight [[data-slot=field][data-orientation=vertical]>&]:caps group-data-[disabled=true]/field:cursor-not-allowed group-data-[disabled=true]/field:text-(--text-quiet)",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:items-stretch",
        className,
      )}
      {...props}
    />
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "flex w-fit items-center gap-tight text-body leading-ui font-semibold group-data-[disabled=true]/field:text-(--text-quiet)",
        className,
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "m-0 text-left text-small leading-small font-normal text-pretty group-has-data-[orientation=horizontal]/field:text-balance group-data-[disabled=true]/field:text-(--text-quiet) [[data-variant=legend]+&]:-mt-1.5",
        "last:mt-0 nth-last-2:-mt-1",
        className,
      )}
      {...props}
    />
  )
}

// One fine line across the form; with words, the words sit in the capitals between two lengths of it.
function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn("-my-1 flex items-center gap-tight", className)}
      {...props}
    >
      <Separator className="w-auto flex-1" />
      {children && (
        <>
          <span className="caps shrink-0" data-slot="field-separator-content">
            {children}
          </span>
          <Separator className="w-auto flex-1" />
        </>
      )}
    </div>
  )
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const content = React.useMemo(() => {
    if (children) {
      return children
    }

    if (!errors?.length) {
      return null
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ]

    if (uniqueErrors?.length == 1) {
      return uniqueErrors[0]?.message
    }

    return (
      <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
        {uniqueErrors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>,
        )}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn(
        "flex items-start gap-hair text-small leading-small font-normal text-(--text) before:mt-[calc((1lh-0.5rem)/2)] before:size-2 before:shrink-0 before:rounded-full before:border-(length:--line) before:border-ink before:bg-rose forced-colors:before:bg-[CanvasText]",
        className,
      )}
      {...props}
    >
      {content}
    </div>
  )
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
}
