import { Fragment } from "react"
import { FileJsonIcon } from "lucide-react"
import { Folly } from "@/serigraph/extras/folly"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/serigraph/ui/accordion"
import { AspectRatio } from "@/serigraph/ui/aspect-ratio"
import { Button } from "@/serigraph/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/serigraph/ui/carousel"
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/serigraph/ui/code-block"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/serigraph/ui/item"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/serigraph/ui/table"
import { Typography, TypographyKicker } from "@/serigraph/ui/typography"
import { SESSIONS } from "@/site/meridian/data"

// Data display parts whose demo opens with something taller or wider than a card's plate: the same part, holding a
// little of Meridian's content.

function AccordionPreview() {
  return (
    <Accordion defaultValue={["clouds"]} className="w-[18rem]">
      <AccordionItem value="clouds">
        <AccordionTrigger>What if it is cloudy?</AccordionTrigger>
        <AccordionContent>
          <p>Shows and talks go ahead; telescope sessions move.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="children">
        <AccordionTrigger>Can children come?</AccordionTrigger>
      </AccordionItem>
    </Accordion>
  )
}

function AspectRatioPreview() {
  return (
    <figure className="m-0 flex w-[15rem] flex-col gap-hair">
      <AspectRatio ratio={16 / 9}>
        <Folly
          template="city"
          seed="meridian-lawn"
          data-colourway="night"
          className="bg-canvas"
        />
      </AspectRatio>
      <figcaption className="text-small leading-small">
        Meridian from the lawn
      </figcaption>
    </figure>
  )
}

const SKY = [
  ["Saturn", "South-east from 19:00", "1"],
  ["The Moon", "Rises at 22:14", "3"],
  ["Andromeda", "High overhead by 21:00", "4"],
] as const

function CarouselPreview() {
  return (
    <Carousel opts={{ align: "start" }} className="mx-12 w-[13rem]">
      <CarouselContent>
        {SKY.map(([name, where, tone]) => (
          <CarouselItem key={name} className="basis-[85%]">
            <div
              className="plane flex h-28 flex-col justify-end gap-0.5 p-snug"
              data-tone={tone}
            >
              <span className="text-lead leading-ui font-semibold">{name}</span>
              <span className="text-small leading-small">{where}</span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

const CONFIG = [
  "{",
  '  "style": "base-nova",',
  '  "iconLibrary": "lucide"',
  "}",
]

function CodeBlockPreview() {
  return (
    <CodeBlock className="w-[18rem]">
      <CodeBlockHeader>
        <CodeBlockTitle>
          <FileJsonIcon />
          components.json
        </CodeBlockTitle>
      </CodeBlockHeader>
      <CodeBlockContent lineNumbers>
        {CONFIG.map((line, i) => (
          <CodeBlockLine key={i} variant={i === 1 ? "highlighted" : undefined}>
            {line}
          </CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  )
}

function ItemPreview() {
  return (
    <ItemGroup className="w-[19rem]">
      {SESSIONS.slice(0, 2).map((s, i) => (
        <Fragment key={s.id}>
          {i > 0 ? <ItemSeparator /> : null}
          <Item role="listitem" size="sm">
            <ItemMedia variant="image" className="rounded-full">
              <Folly
                template="medallion"
                seed={s.host}
                className="[--canvas:var(--plane)] [--cloud:var(--paper)]"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{s.title}</ItemTitle>
              <ItemDescription>
                {s.starts} · {s.place}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="outline" size="sm">
                Book
              </Button>
            </ItemActions>
          </Item>
        </Fragment>
      ))}
    </ItemGroup>
  )
}

function TablePreview() {
  return (
    <Table className="w-[19rem]">
      <TableHeader>
        <TableRow>
          <TableHead>Session</TableHead>
          <TableHead className="text-end">Starts</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {SESSIONS.slice(0, 3).map((s, i) => (
          <TableRow key={s.id} data-state={i === 1 ? "selected" : undefined}>
            <TableCell>{s.title}</TableCell>
            <TableCell className="text-end font-mono">{s.starts}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function TypographyPreview() {
  return (
    <Typography className="w-[19rem]">
      <TypographyKicker>From the dome · 2 November</TypographyKicker>
      <h3>Saturn’s rings open wide</h3>
      <p>
        Saturn reaches opposition on Thursday, and its rings tilt far enough
        toward us to see the Cassini Division.
      </p>
    </Typography>
  )
}

export const DISPLAY_PREVIEWS = {
  accordion: AccordionPreview,
  "aspect-ratio": AspectRatioPreview,
  carousel: CarouselPreview,
  "code-block": CodeBlockPreview,
  item: ItemPreview,
  table: TablePreview,
  typography: TypographyPreview,
}
