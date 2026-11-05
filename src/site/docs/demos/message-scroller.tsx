import { useState } from "react"
import { UserPlusIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/serigraph/ui/avatar"
import { Bubble, BubbleContent } from "@/serigraph/ui/bubble"
import { Button } from "@/serigraph/ui/button"
import { Marker, MarkerContent, MarkerIcon } from "@/serigraph/ui/marker"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "@/serigraph/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/serigraph/ui/message-scroller"
import { DemoSection, type DemoMeta } from "../demo-kit"
import { LATER, PEOPLE, THREAD, type Note } from "./message-scroller/thread"

export const meta: DemoMeta = {
  title: "Message scroller",
  description:
    "The scrolling column of a conversation: it keeps the newest message in view and offers a way back when you read up.",
  item: "message-scroller",
  group: "Conversation",
}

function Row({ note }: { note: Note }) {
  if (note.kind === "marker" && note.event) {
    return (
      <Marker className="justify-center">
        <MarkerIcon>
          <UserPlusIcon />
        </MarkerIcon>
        <MarkerContent>{note.text}</MarkerContent>
      </Marker>
    )
  }
  if (note.kind === "marker") {
    return (
      <Marker variant="separator">
        <MarkerContent className={note.unread ? "bg-highlight" : undefined}>
          {note.text}
        </MarkerContent>
      </Marker>
    )
  }
  const who = PEOPLE[note.from]
  const mine = note.from === "ada"
  const isText = typeof note.body === "string"
  return (
    <Message align={mine ? "end" : "start"}>
      <MessageAvatar>
        <Avatar size="sm" data-tone={who.tone}>
          <AvatarFallback name={who.portrait ? who.name : undefined}>
            {who.initials}
          </AvatarFallback>
        </Avatar>
      </MessageAvatar>
      <MessageContent>
        <MessageHeader>
          <b>{who.name}</b>
          <time dateTime={`2026-11-05T${note.time}`}>{note.time}</time>
        </MessageHeader>
        {isText || !mine ? (
          <Bubble variant={mine ? "default" : "secondary"}>
            <BubbleContent className="flex flex-col gap-tight">
              {note.body}
            </BubbleContent>
          </Bubble>
        ) : (
          note.body
        )}
      </MessageContent>
    </Message>
  )
}

function Thread({
  notes,
  from = "end",
}: {
  notes: Note[]
  from?: "start" | "end"
}) {
  return (
    <div className="h-[26rem] max-w-[40rem] overflow-hidden rounded-plane border-(length:--line) border-(--edge)">
      <MessageScrollerProvider autoScroll defaultScrollPosition={from}>
        <MessageScroller>
          <MessageScrollerViewport aria-label="Conversation with Meridian">
            <MessageScrollerContent className="p-snug">
              {notes.map((note) => (
                <MessageScrollerItem key={note.id} messageId={note.id}>
                  <Row note={note} />
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          {from === "start" ? (
            <MessageScrollerButton direction="start" />
          ) : null}
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  )
}

export default function MessageScrollerDemo() {
  const [shown, setShown] = useState(0)
  return (
    <>
      <DemoSection title="Following the newest message">
        <Thread notes={[...THREAD, ...LATER.slice(0, shown)]} />
        <div className="mt-snug flex flex-wrap items-center gap-tight">
          <Button
            variant="outline"
            size="sm"
            disabled={shown >= LATER.length}
            onClick={() => setShown((n) => n + 1)}
          >
            Next message
          </Button>
          <span className="text-small leading-small">
            {shown >= LATER.length
              ? "Conversation complete"
              : `${LATER.length - shown} more to come`}
          </span>
        </div>
      </DemoSection>
      <DemoSection title="Reading from the top">
        <Thread notes={[...THREAD, ...LATER]} from="start" />
      </DemoSection>
    </>
  )
}
