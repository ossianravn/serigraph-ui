import type { ReactNode } from "react"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/serigraph/ui/field"

// One setting: its name and what it does on the left, the control beside them on the right, in the settings column.
// When the two do not fit side by side (a phone, a long control), the control drops below its words.
export function SettingRow({
  id,
  label,
  description,
  disabled,
  children,
}: {
  id: string
  label: string
  description?: ReactNode
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <Field
      orientation="horizontal"
      data-disabled={disabled ? "true" : undefined}
      className="flex-wrap justify-between gap-x-section gap-y-tight"
    >
      <FieldContent className="min-w-[min(100%,14rem)]">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>
      {children}
    </Field>
  )
}
