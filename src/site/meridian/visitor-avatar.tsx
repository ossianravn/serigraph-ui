import { Avatar, AvatarFallback } from "@/serigraph/ui/avatar"
import { initialsOf } from "./data"

// The visitor in the header. Avatar and its fallback share a React context, so they render together from one React
// component; Astro renders each component it places on its own.
export function VisitorAvatar({ name }: { name: string }) {
  return (
    <Avatar size="sm" data-tone="2">
      <AvatarFallback>{initialsOf(name)}</AvatarFallback>
    </Avatar>
  )
}
