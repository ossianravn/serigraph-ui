import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/serigraph/ui/navigation-menu"
import { inTimeOrder, SESSIONS, seatsLeft } from "@/site/sample/observatory"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Navigation menu",
  description:
    "A site's main links, with panels that open to show the pages in each section; the page you are on takes the highlight.",
  item: "navigation-menu",
  group: "Navigation",
}

type Page = { title: string; href: string; about: string }

const SESSION_PAGES: Page[] = inTimeOrder(SESSIONS).map((s) => ({
  title: s.title,
  href: `#${s.id}`,
  about: `${s.starts} · ${s.place} · ${seatsLeft(s) ? `${seatsLeft(s)} seats left` : "full"}`,
}))

const TELESCOPE_PAGES: Page[] = [
  {
    title: "Zeiss refractor",
    href: "#zeiss",
    about: "150 mm, 1953, in the north dome",
  },
  {
    title: "Dobsonian",
    href: "#dobsonian",
    about: "400 mm on the deck, for galaxies",
  },
  {
    title: "Solar telescope",
    href: "#solar",
    about: "The Sun in H-alpha, Saturdays 11–14",
  },
]

/** A panel's short list of pages, each with a one-line description. */
function Pages({ pages, current }: { pages: Page[]; current?: string }) {
  return (
    <ul className="m-0 grid w-[19rem] max-w-[calc(100vw-3rem)] list-none gap-0.5 p-0">
      {pages.map((page) => (
        <li key={page.href}>
          <NavigationMenuLink
            href={page.href}
            active={page.href === current}
            className="flex-col items-start gap-0.5"
          >
            <span className="text-body leading-ui">{page.title}</span>
            <span>{page.about}</span>
          </NavigationMenuLink>
        </li>
      ))}
    </ul>
  )
}

/** Meridian's main navigation, on the given page; gift cards are not on sale yet. */
function SiteNav({ current }: { current: string }) {
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex-wrap justify-start">
        <NavigationMenuItem>
          <NavigationMenuLink
            href="#tonight"
            active={current === "#tonight"}
            className={navigationMenuTriggerStyle()}
          >
            Tonight
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Sessions</NavigationMenuTrigger>
          <NavigationMenuContent>
            <Pages pages={SESSION_PAGES} current={current} />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Telescopes</NavigationMenuTrigger>
          <NavigationMenuContent>
            <Pages pages={TELESCOPE_PAGES} current={current} />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="#members"
            active={current === "#members"}
            className={navigationMenuTriggerStyle()}
          >
            Members
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="#gift-cards"
            className={navigationMenuTriggerStyle()}
            aria-disabled="true"
            tabIndex={-1}
          >
            Gift cards
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default function NavigationMenuDemo() {
  return (
    <DemoSection title="Meridian">
      <StateRow label="On Tonight">
        <SiteNav current="#tonight" />
      </StateRow>
      <StateRow label="On a session">
        <SiteNav current="#saturn-talk" />
      </StateRow>
    </DemoSection>
  )
}
