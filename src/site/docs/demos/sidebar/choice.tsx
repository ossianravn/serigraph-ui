import { ToggleGroup, ToggleGroupItem } from "@/serigraph/ui/toggle-group"

/** A segmented control that always keeps one choice, its label beside it. */
export function Choice<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: [T, string][]
  onChange: (value: T) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-tight">
      <span className="caps">{label}</span>
      <ToggleGroup
        aria-label={label}
        size="sm"
        spacing={0}
        value={[value]}
        onValueChange={(next) => next[0] && onChange(next[0] as T)}
      >
        {options.map(([key, name]) => (
          <ToggleGroupItem key={key} value={key}>
            {name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
