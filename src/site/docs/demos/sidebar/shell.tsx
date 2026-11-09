import type { ReactNode } from "react"
import { EllipsisIcon, type LucideIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/serigraph/ui/dropdown-menu"
import { Separator } from "@/serigraph/ui/separator"
import {
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/serigraph/ui/sidebar"
import {
  inTimeOrder,
  SESSIONS,
  SKY,
  seatsLeft,
  VISITOR,
} from "@/site/sample/observatory"

// The sidebar demo's Meridian: tonight's sessions, the telescopes, members, saved lists and the page beside the
// sidebar.

type Row = readonly [title: string, detail: string, aside: string]

const sessions = inTimeOrder(SESSIONS)

export const TELESCOPES: Row[] = [
  ["Zeiss refractor", "150 mm, 1953 · the north dome", "Booked"],
  ["Dobsonian", "400 mm · the deck", "3 free"],
  ["Solar telescope", "H-alpha, 90 mm · daytime only", "Off"],
]

export const LISTS: [string, Row[]][] = [
  [
    "Planets",
    SKY.filter((o) => o.kind === "planet").map((o) => [
      o.name,
      o.where,
      o.best,
    ]),
  ],
  [
    "Deep sky",
    SKY.filter((o) => o.kind !== "planet").map((o) => [
      o.name,
      o.where,
      o.best,
    ]),
  ],
  [
    "School visits",
    [
      ["Kirkebjerg school, 5B", "Tue 10 Nov · 26 pupils", "09:30"],
      ["Valby gymnasium", "Thu 12 Nov · 31 pupils", "10:00"],
    ],
  ],
]

/** The open place's name: a session's title, or the place itself. */
export const titleOf = (open: string) =>
  sessions.find((s) => s.id === open)?.title ?? open

/** What the page beside the sidebar lists for each place in it. */
function rowsFor(open: string): Row[] {
  const session = sessions.find((s) => s.id === open)
  if (session)
    return [
      [session.place, `With ${session.host}`, session.starts],
      ["Seats", `${session.taken} of ${session.seats} taken`, ""],
    ]
  const list = LISTS.find(([name]) => name === open)
  if (list) return list[1]
  if (open === "Telescopes") return TELESCOPES
  if (open === "Members")
    return [
      [VISITOR.name, VISITOR.email, VISITOR.member],
      ["Vera Rubin", "Host, the lecture hall", "0007"],
      ["Jocelyn Bell", "Host, the deck", "0019"],
    ]
  if (open === "Settings")
    return [
      ["Name", VISITOR.name, ""],
      ["Reminders", "An hour before each session", "On"],
      ["Red light", "After dark", "Auto"],
    ]
  return sessions.map((s) => [
    s.title,
    `${s.place} · ${seatsLeft(s) ? `${seatsLeft(s)} seats left` : "Full"}`,
    s.starts,
  ])
}

/** The page beside the sidebar: the open place as a list between fine lines. */
export function Page({ open }: { open: string }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-snug">
      <ul className="m-0 flex max-w-[34rem] list-none flex-col p-0">
        {rowsFor(open).map(([title, detail, aside], i) => (
          <li key={`${title}-${i}`}>
            {i > 0 && <Separator />}
            <div className="flex items-baseline justify-between gap-tight py-tight">
              <span className="min-w-0">
                <span className="block truncate leading-ui">{title}</span>
                <span className="block truncate text-small leading-small">
                  {detail}
                </span>
              </span>
              <span className="shrink-0 font-mono text-small">{aside}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** One place in the sidebar; choosing it on a phone also closes the sheet. */
export function NavItem({
  name,
  icon: Icon,
  count,
  open,
  onOpen,
  children,
}: {
  name: string
  icon: LucideIcon
  count?: number
  open: string
  onOpen: (name: string) => void
  children?: ReactNode
}) {
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={open === name}
        aria-current={open === name ? "page" : undefined}
        tooltip={name}
        onClick={() => {
          onOpen(name)
          setOpenMobile(false)
        }}
      >
        <Icon />
        <span>{name}</span>
      </SidebarMenuButton>
      {count !== undefined && <SidebarMenuBadge>{count}</SidebarMenuBadge>}
      {children}
    </SidebarMenuItem>
  )
}

/** Tonight's sessions, hung under Sessions. */
export function SessionsSub({
  open,
  onOpen,
}: {
  open: string
  onOpen: (name: string) => void
}) {
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenuSub>
      {sessions.slice(0, 3).map((s) => (
        <SidebarMenuSubItem key={s.id}>
          <SidebarMenuSubButton
            href={`#${s.id}`}
            isActive={open === s.id}
            aria-current={open === s.id ? "page" : undefined}
            onClick={(event) => {
              event.preventDefault()
              onOpen(s.id)
              setOpenMobile(false)
            }}
          >
            <span className="font-mono text-small">{s.starts}</span>
            <span>{s.title}</span>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      ))}
    </SidebarMenuSub>
  )
}

/** A saved list's menu: share, rename or delete, shown while its row is hovered or focused. */
export function ListActions({ name }: { name: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<SidebarMenuAction showOnHover />}>
        <EllipsisIcon />
        <span className="sr-only">More for {name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start">
        <DropdownMenuItem>Share list</DropdownMenuItem>
        <DropdownMenuItem>Rename</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete list</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
