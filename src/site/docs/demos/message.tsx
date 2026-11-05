import { CalendarPlusIcon, CopyIcon, ReplyIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/serigraph/ui/avatar"
import { Bubble, BubbleContent, BubbleGroup } from "@/serigraph/ui/bubble"
import { Button } from "@/serigraph/ui/button"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/serigraph/ui/message"
import { DemoSection, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Message",
  description:
    "One turn in a conversation: who wrote it and when, what they said, and what can be done with it.",
  item: "message",
  group: "Conversation",
}

function Byline({ name, time }: { name: string; time: string }) {
  return (
    <MessageHeader>
      <b>{name}</b>
      <time dateTime={`2026-11-05T${time}`}>{time}</time>
    </MessageHeader>
  )
}

function Visitor() {
  return (
    <MessageAvatar>
      <Avatar>
        <AvatarFallback name="Ada Lindqvist">AL</AvatarFallback>
      </Avatar>
    </MessageAvatar>
  )
}

function Assistant() {
  return (
    <MessageAvatar>
      <Avatar data-tone="3">
        <AvatarFallback>M</AvatarFallback>
      </Avatar>
    </MessageAvatar>
  )
}

const ACTIONS = [
  { label: "Add to calendar", icon: CalendarPlusIcon },
  { label: "Copy", icon: CopyIcon },
  { label: "Reply", icon: ReplyIcon },
]

export default function MessageDemo() {
  return (
    <>
      <DemoSection title="A message each way">
        <MessageGroup className="max-w-[40rem] gap-snug">
          <Message align="end">
            <Visitor />
            <MessageContent>
              <Byline name="Ada Lindqvist" time="18:40" />
              <Bubble>
                <BubbleContent>
                  Is the seeing good enough for Saturn tonight? We&rsquo;re
                  coming up from town and could be there by nine.
                </BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
          <Message>
            <Assistant />
            <MessageContent>
              <Byline name="Meridian" time="18:42" />
              <Bubble variant="secondary">
                <BubbleContent>
                  It is: 4 of 5 after 21:00, clear until 23:00. The Zeiss
                  refractor is free from 21:30, and the rings are wide open this
                  year.
                </BubbleContent>
              </Bubble>
              <MessageFooter className="-ms-1">
                {ACTIONS.map(({ label, icon: Icon }) => (
                  <Button
                    key={label}
                    variant="ghost"
                    size="icon-sm"
                    aria-label={label}
                  >
                    <Icon className="[stroke-width:calc(var(--line)*1.5)]" />
                  </Button>
                ))}
              </MessageFooter>
            </MessageContent>
          </Message>
        </MessageGroup>
      </DemoSection>
      <DemoSection title="Several bubbles, one message">
        <Message align="end" className="max-w-[40rem]">
          <Visitor />
          <MessageContent>
            <Byline name="Ada Lindqvist" time="18:44" />
            <BubbleGroup>
              <Bubble>
                <BubbleContent>Perfect, two seats please.</BubbleContent>
              </Bubble>
              <Bubble>
                <BubbleContent>
                  My daughter is seven. Is she old enough for the deck?
                </BubbleContent>
              </Bubble>
            </BubbleGroup>
            <MessageFooter>Read 18:45</MessageFooter>
          </MessageContent>
        </Message>
      </DemoSection>
      <DemoSection title="Without avatars">
        <MessageGroup className="max-w-[40rem] gap-snug">
          <Message>
            <MessageContent>
              <Byline name="Jonas Berg" time="20:58" />
              <Bubble variant="secondary">
                <BubbleContent>
                  The dome is open. I&rsquo;ve set the Zeiss on Saturn for your
                  half hour.
                </BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
          <Message align="end">
            <MessageContent>
              <Byline name="Ada Lindqvist" time="21:02" />
              <Bubble>
                <BubbleContent>
                  Parking now. We&rsquo;ll be at the door in five.
                </BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
        </MessageGroup>
      </DemoSection>
    </>
  )
}
