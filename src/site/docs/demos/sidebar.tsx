import { useState, type ReactNode } from "react"
import {
  BookmarkIcon,
  CalendarDaysIcon,
  MoonStarIcon,
  PlusIcon,
  SettingsIcon,
  TelescopeIcon,
  UsersIcon,
} from "lucide-react"
import { Motif } from "@/serigraph/extras/motif"
import { Avatar, AvatarFallback } from "@/serigraph/ui/avatar"
import { Separator } from "@/serigraph/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/serigraph/ui/sidebar"
import { SESSIONS, VISITOR } from "@/site/meridian/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"
import { Choice } from "./sidebar/choice"
import {
  LISTS,
  ListActions,
  NavItem,
  Page,
  SessionsSub,
  TELESCOPES,
  titleOf,
} from "./sidebar/shell"

export const meta: DemoMeta = {
  title: "Sidebar",
  description:
    "An app's main navigation in a column beside the page, which folds to icons on a desktop and becomes a sheet on a phone.",
  item: "sidebar",
  group: "Navigation",
}

type Variant = "sidebar" | "floating" | "inset"
type Collapse = "icon" | "offcanvas"
type Side = "left" | "right"

/** Meridian's shell: tonight, the sessions, telescopes and members, saved lists, settings and the visitor. */
function Shell({
  variant,
  collapse,
  side,
}: {
  variant: Variant
  collapse: Collapse
  side: Side
}) {
  const [open, setOpen] = useState("Tonight")
  const nav = { open, onOpen: setOpen }
  // The sidebar holds its room in the row, so on the right it comes after the page.
  const sidebar = (
    <Sidebar
      variant={variant}
      collapsible={collapse}
      side={side}
      className="absolute h-full"
      role="navigation"
      aria-label="Observatory"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Meridian">
              <span className="grid size-8 shrink-0 place-items-center text-[1.5rem]">
                <Motif kind="pinwheel" seed="meridian" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate font-semibold">Meridian</span>
                <span className="truncate text-small leading-small">
                  Observatory
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarInput
          type="search"
          aria-label="Search sessions and the sky"
          placeholder="Search"
          className="group-data-[collapsible=icon]:hidden"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Observatory</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavItem name="Tonight" icon={MoonStarIcon} {...nav} />
              <NavItem
                name="Sessions"
                icon={CalendarDaysIcon}
                count={SESSIONS.length}
                {...nav}
              >
                <SessionsSub {...nav} />
              </NavItem>
              <NavItem
                name="Telescopes"
                icon={TelescopeIcon}
                count={TELESCOPES.length}
                {...nav}
              />
              <NavItem name="Members" icon={UsersIcon} {...nav} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Saved</SidebarGroupLabel>
          <SidebarGroupAction title="New list">
            <PlusIcon />
            <span className="sr-only">New list</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {LISTS.map(([name]) => (
                <NavItem key={name} name={name} icon={BookmarkIcon} {...nav}>
                  <ListActions name={name} />
                </NavItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <NavItem name="Settings" icon={SettingsIcon} {...nav} />
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip={VISITOR.name}>
              <Avatar className="size-8" aria-hidden="true">
                <AvatarFallback name={VISITOR.name}>AL</AvatarFallback>
              </Avatar>
              <span className="flex min-w-0 flex-col">
                <span className="truncate font-semibold">{VISITOR.name}</span>
                <span className="truncate font-mono text-small leading-small">
                  Member {VISITOR.member}
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
  return (
    <div className="overflow-hidden rounded-plane border-(length:--line) border-(--edge)">
      <SidebarProvider className="relative isolate h-[40rem] min-h-0 overflow-hidden">
        {side === "left" && sidebar}
        <SidebarInset className="min-w-0">
          <header className="flex h-14 shrink-0 items-center gap-tight px-tight">
            <SidebarTrigger />
            <Separator orientation="vertical" className="my-4" />
            <h3 className="m-0 truncate font-read text-lead leading-ui font-semibold">
              {titleOf(open)}
            </h3>
            <span className="ms-auto shrink-0 caps">Thu 5 Nov</span>
          </header>
          <Separator />
          <Page open={open} />
        </SidebarInset>
        {side === "right" && sidebar}
      </SidebarProvider>
    </div>
  )
}

/** A short, still sidebar for one state: collapsible none, sized to its rows. */
function Still({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider className="min-h-0 w-auto">
      <Sidebar collapsible="none" className="h-auto">
        <SidebarContent>
          <SidebarGroup>{children}</SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}

export default function SidebarDemo() {
  const [variant, setVariant] = useState<Variant>("sidebar")
  const [collapse, setCollapse] = useState<Collapse>("icon")
  const [side, setSide] = useState<Side>("left")
  return (
    <>
      <DemoSection title="Meridian">
        <div className="mb-snug flex flex-wrap gap-x-line gap-y-tight">
          <Choice
            label="Variant"
            value={variant}
            onChange={setVariant}
            options={[
              ["sidebar", "Sidebar"],
              ["floating", "Floating"],
              ["inset", "Inset"],
            ]}
          />
          <Choice
            label="Collapse"
            value={collapse}
            onChange={setCollapse}
            options={[
              ["icon", "To icons"],
              ["offcanvas", "Off canvas"],
            ]}
          />
          <Choice
            label="Side"
            value={side}
            onChange={setSide}
            options={[
              ["left", "Left"],
              ["right", "Right"],
            ]}
          />
        </div>
        <Shell variant={variant} collapse={collapse} side={side} />
      </DemoSection>
      <DemoSection title="States">
        <StateRow label="Loading">
          <Still>
            <SidebarGroupLabel>Saved</SidebarGroupLabel>
            <SidebarMenu>
              {[0, 1, 2].map((i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </Still>
        </StateRow>
        <StateRow label="Outline, small, disabled">
          <Still>
            <SidebarMenu className="gap-tight">
              <SidebarMenuItem>
                <SidebarMenuButton variant="outline" isActive>
                  <MoonStarIcon />
                  <span>Tonight</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton variant="outline">
                  <TelescopeIcon />
                  <span>Telescopes</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton size="sm">
                  <SettingsIcon />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton size="sm" disabled>
                  <BookmarkIcon />
                  <span>Archive (members only)</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </Still>
        </StateRow>
      </DemoSection>
    </>
  )
}
