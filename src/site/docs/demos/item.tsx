import { Fragment, type ComponentProps } from "react"
import {
  ChevronRightIcon,
  MoreHorizontalIcon,
  TelescopeIcon,
} from "lucide-react"
import { Folly } from "@/serigraph/extras/folly"
import { Badge } from "@/serigraph/ui/badge"
import { Button } from "@/serigraph/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/serigraph/ui/item"
import { SESSIONS, count, seatsLeft } from "@/site/sample/observatory"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Item",
  description:
    "An open row for one thing in a list: a medallion, an icon or a figure, a title, one line about it and its actions.",
  item: "item",
  group: "Data display",
}

const COLUMN = "w-full max-w-[34rem]"
const TALK = SESSIONS.find((s) => s.id === "saturn-talk")!

/** A guide's medallion, seeded by their name so they are drawn the same everywhere. */
function Guide({ name }: { name: string }) {
  return (
    <ItemMedia variant="image" className="rounded-full">
      <Folly
        template="medallion"
        seed={name}
        className="[--canvas:var(--plane-2)] [--cloud:var(--paper)]"
      />
    </ItemMedia>
  )
}

function Talk({
  variant,
  size,
}: Pick<ComponentProps<typeof Item>, "variant" | "size">) {
  return (
    <Item variant={variant} size={size} className={COLUMN}>
      <Guide name={TALK.host} />
      <ItemContent>
        <ItemTitle>{TALK.title}</ItemTitle>
        <ItemDescription>
          {TALK.starts}–{TALK.ends} · {TALK.place} · {TALK.host}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`More for ${TALK.title}`}
        >
          <MoreHorizontalIcon />
        </Button>
      </ItemActions>
    </Item>
  )
}

export default function ItemDemo() {
  return (
    <>
      <DemoSection title="Tonight’s sessions">
        <ItemGroup className={COLUMN}>
          {SESSIONS.slice(0, 4).map((s, i) => (
            <Fragment key={s.id}>
              {i > 0 ? <ItemSeparator /> : null}
              <Item role="listitem">
                <Guide name={s.host} />
                <ItemContent>
                  <ItemTitle>{s.title}</ItemTitle>
                  <ItemDescription>
                    {s.starts}–{s.ends} · {s.place} · {s.host}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  {seatsLeft(s) === 0 ? (
                    <Badge variant="outline">Full</Badge>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      aria-label={`Book ${s.title}`}
                    >
                      Book
                    </Button>
                  )}
                </ItemActions>
              </Item>
            </Fragment>
          ))}
        </ItemGroup>
      </DemoSection>
      <DemoSection title="Variants">
        <StateRow label="default">
          <Talk />
        </StateRow>
        <StateRow label="outline">
          <Talk variant="outline" />
        </StateRow>
        <StateRow label="muted">
          <Talk variant="muted" />
        </StateRow>
      </DemoSection>
      <DemoSection title="Sizes">
        <StateRow label="default">
          <Talk variant="outline" />
        </StateRow>
        <StateRow label="sm">
          <Talk variant="outline" size="sm" />
        </StateRow>
        <StateRow label="xs">
          <Item variant="outline" size="xs" className={COLUMN}>
            <ItemMedia variant="icon">
              <TelescopeIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Ten minutes at the Zeiss refractor</ItemTitle>
            </ItemContent>
            <ItemActions>
              <span className="font-mono text-small tabular-nums">60 kr</span>
            </ItemActions>
          </Item>
        </StateRow>
      </DemoSection>
      <DemoSection title="Media and links">
        <StateRow label="Icon">
          <Item variant="outline" className={COLUMN}>
            <ItemMedia variant="icon">
              <TelescopeIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>The deck</ItemTitle>
              <ItemDescription>
                The Zeiss refractor and the 300 mm Dobsonian under open sky. A
                guide lines up each object; you only touch the eyepiece.
              </ItemDescription>
            </ItemContent>
          </Item>
        </StateRow>
        <StateRow label="As a link">
          <Item
            variant="outline"
            className={COLUMN}
            render={<a href="#leonids" />}
          >
            <Guide name="Cecilia Payne" />
            <ItemContent>
              <ItemTitle>The Leonids from the lawn</ItemTitle>
              <ItemDescription>
                Tuesday 17 November from 23:00, with Cecilia Payne.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon className="size-4 [stroke-width:calc(var(--line)*1.5)] rtl:-scale-x-100" />
            </ItemActions>
          </Item>
        </StateRow>
        <StateRow label="Link, muted">
          <Item
            variant="muted"
            className={COLUMN}
            render={<a href="#pulsars" />}
          >
            <ItemMedia variant="number">18</ItemMedia>
            <ItemContent>
              <ItemTitle>Pulsars, with Jocelyn Bell</ItemTitle>
              <ItemDescription>
                Wednesday 18 November. How a scruff on a chart became a star.
              </ItemDescription>
            </ItemContent>
          </Item>
        </StateRow>
        <StateRow label="With footer">
          <Item variant="outline" className={COLUMN}>
            <ItemMedia variant="number">05</ItemMedia>
            <ItemContent>
              <ItemTitle>Saturn at opposition</ItemTitle>
              <ItemDescription>
                The rings open to their widest in three years.
              </ItemDescription>
            </ItemContent>
            <ItemFooter className="caps">
              <span>Thursday 5 November, from 19:30</span>
              <span>{count(seatsLeft(TALK))} seats left</span>
            </ItemFooter>
          </Item>
        </StateRow>
      </DemoSection>
    </>
  )
}
