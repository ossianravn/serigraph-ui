import {
  CalendarPlusIcon,
  ChevronDownIcon,
  MoonStarIcon,
  OrbitIcon,
  TelescopeIcon,
} from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/serigraph/ui/breadcrumb"
import { Button } from "@/serigraph/ui/button"
import { ButtonGroup } from "@/serigraph/ui/button-group"
import { DirectionProvider } from "@/serigraph/ui/direction"
import { navigationMenuTriggerStyle } from "@/serigraph/ui/navigation-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/serigraph/ui/pagination"
import { Slider } from "@/serigraph/ui/slider"
import {
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/serigraph/ui/sidebar-menu"
import { SidebarProvider } from "@/serigraph/ui/sidebar-provider"
import { cn } from "@/serigraph/lib/utils"
import { Float, MenuRow, MenuRule, PageLines } from "./parts"

// Actions and navigation whose demo opens with a row wider than a card's plate, a whole app shell or a menu that
// opens in a portal: the same parts, with less of Meridian in them, menus drawn open.

function ButtonGroupPreview() {
  return (
    <ButtonGroup aria-label="Your booking">
      <Button variant="outline">Print tickets</Button>
      <Button variant="outline">Email</Button>
      <Button variant="outline" size="icon">
        <CalendarPlusIcon />
      </Button>
    </ButtonGroup>
  )
}

function DirectionPreview() {
  return (
    <div className="grid w-[16rem] gap-line">
      {(["ltr", "rtl"] as const).map((dir) => (
        <DirectionProvider key={dir} direction={dir}>
          <div dir={dir} className="grid gap-tight">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>Meridian</BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>Sessions</BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Saturn</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Slider defaultValue={[30]} aria-label="Dome light" />
          </div>
        </DirectionProvider>
      ))}
    </div>
  )
}

/** The pill a menubar's or navigation menu's trigger becomes while its menu is open. */
const OPEN = "[--pill-line:var(--edge)]"

function MenubarPreview() {
  return (
    <div className="flex flex-col items-start gap-hair">
      <div className="flex h-control items-center gap-0.5 rounded-full border-(length:--line) border-(--edge) p-[3px]">
        {["Show", "Sky", "View"].map((name, i) => (
          <span
            key={name}
            className={cn(
              navigationMenuTriggerStyle(),
              "h-full",
              i === 0 && OPEN,
            )}
          >
            {name}
          </span>
        ))}
      </div>
      <Float className="w-max p-hair">
        <MenuRow end="⌘P">Play the show</MenuRow>
        <MenuRow active>Pause narration</MenuRow>
        <MenuRule />
        <MenuRow>Dim the dome</MenuRow>
      </Float>
    </div>
  )
}

function NavigationMenuPreview() {
  return (
    <div className="flex flex-col items-start gap-hair">
      <div className="flex gap-1">
        <span className={navigationMenuTriggerStyle()} aria-current="page">
          Tonight
        </span>
        <span
          className={`${navigationMenuTriggerStyle()} ${OPEN}`}
          data-popup-open=""
        >
          Telescopes <ChevronDownIcon className="size-3.5" />
        </span>
      </div>
      <Float className="ms-14 grid w-[15rem] gap-0.5 p-hair">
        {[
          ["Zeiss refractor", "150 mm, 1953, north dome"],
          ["Dobsonian", "400 mm on the deck"],
        ].map(([title, about]) => (
          <div
            key={title}
            className="menu-item flex-col items-start gap-0.5 px-tight py-hair"
          >
            <span className="leading-ui">{title}</span>
            <span className="text-small leading-small">{about}</span>
          </div>
        ))}
      </Float>
    </div>
  )
}

function PaginationPreview() {
  return (
    <Pagination className="mx-0 w-auto">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" text="" className="w-control px-0!" />
        </PaginationItem>
        {[5, 6, 7].map((n) => (
          <PaginationItem key={n}>
            <PaginationLink href="#" isActive={n === 6}>
              {n}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">24</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" text="" className="w-control px-0!" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

const PAGES = [
  { title: "Tonight", icon: MoonStarIcon, active: true },
  { title: "Sessions", icon: OrbitIcon, badge: "14" },
  { title: "Telescopes", icon: TelescopeIcon },
]

function SidebarPreview() {
  return (
    <SidebarProvider className="absolute inset-0 min-h-0">
      <div className="flex w-[11rem] shrink-0 flex-col gap-hair border-e-(length:--line) border-ink p-tight">
        <span className="caps px-tight pt-hair pb-1">Meridian</span>
        <SidebarMenu>
          {PAGES.map(({ title, icon: Icon, active, badge }) => (
            <SidebarMenuItem key={title}>
              <SidebarMenuButton isActive={active}>
                <Icon />
                <span>{title}</span>
              </SidebarMenuButton>
              {badge && <SidebarMenuBadge>{badge}</SidebarMenuBadge>}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </div>
      <div className="min-w-0 flex-1 p-snug pt-line">
        <PageLines widths={[60, 100, 85, 92, 70]} />
      </div>
    </SidebarProvider>
  )
}

export const NAV_PREVIEWS = {
  "button-group": ButtonGroupPreview,
  direction: DirectionPreview,
  menubar: MenubarPreview,
  "navigation-menu": NavigationMenuPreview,
  pagination: PaginationPreview,
  sidebar: SidebarPreview,
}
