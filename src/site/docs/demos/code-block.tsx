import { FileCodeIcon, FileJsonIcon, TerminalIcon } from "lucide-react"
import { useHighlightedCode } from "@/serigraph/ui/use-highlighted-code"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/serigraph/ui/code-block"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Code block",
  description:
    "Code or data in mono on a tinted plane, with line numbers, calm highlighting and a copy button.",
  item: "code-block",
  group: "Data display",
}

const CONFIG = `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "tailwind": {
    "css": "src/serigraph/styles/serigraph.css"
  },
  "registries": {
    "@serigraph": "http://127.0.0.1:4801/r/{name}.json"
  }
}
`

const ROW = `import { Badge } from "@/serigraph/ui/badge"
import { Button } from "@/serigraph/ui/button"

// Tonight's telescope session, in the kit's own parts.
export function TelescopeRow({ seats }: { seats: number }) {
  return (
    <div className="flex items-center gap-tight">
      <Badge data-tone="3">{seats} seats</Badge>
      <Button variant="secondary">Book</Button>
      <Button disabled={seats === 0}>Book</Button>
    </div>
  )
}
`

const INSTALL = "npx shadcn@latest add @serigraph/code-block"

const ERROR = `Something went wrong. Please check the error below for more details.
The item at http://127.0.0.1:4801/r/questionaire.json was not found.
It may not exist at the registry.`

type Mark = "added" | "removed" | "highlighted"

function Code({
  code,
  language,
  marks = {},
  lineNumbers = true,
}: {
  code: string
  language: string
  marks?: Record<number, Mark>
  lineNumbers?: boolean
}) {
  const lines = useHighlightedCode(code, language)
  return (
    <CodeBlockContent lineNumbers={lineNumbers}>
      {lines.map((line, index) => (
        <CodeBlockLine key={index} variant={marks[index + 1]}>
          {line}
        </CodeBlockLine>
      ))}
    </CodeBlockContent>
  )
}

export default function CodeBlockDemo() {
  return (
    <>
      <DemoSection title="Point shadcn at Serigraph">
        <CodeBlock className="max-w-[40rem]">
          <CodeBlockHeader>
            <CodeBlockTitle>
              <FileJsonIcon />
              components.json
            </CodeBlockTitle>
            <span>JSON</span>
            <CodeBlockActions>
              <CodeBlockCopyButton value={CONFIG} />
            </CodeBlockActions>
          </CodeBlockHeader>
          <Code code={CONFIG} language="json" marks={{ 8: "highlighted" }} />
        </CodeBlock>
      </DemoSection>
      <DemoSection title="Use the parts">
        <CodeBlock className="max-w-[40rem]">
          <CodeBlockHeader>
            <CodeBlockTitle>
              <FileCodeIcon />
              telescope-row.tsx
            </CodeBlockTitle>
            <span>TSX</span>
            <CodeBlockActions>
              <CodeBlockCopyButton value={ROW} />
            </CodeBlockActions>
          </CodeBlockHeader>
          <Code
            code={ROW}
            language="tsx"
            marks={{ 9: "removed", 10: "added" }}
          />
          <CodeBlockFooter>
            Same names and props as shadcn; only the look changes.
          </CodeBlockFooter>
        </CodeBlock>
      </DemoSection>
      <DemoSection title="Variants">
        <StateRow label="Shell, small">
          <CodeBlock size="sm" className="max-w-[30rem]">
            <CodeBlockActions>
              <CodeBlockCopyButton value={INSTALL} />
            </CodeBlockActions>
            <Code code={INSTALL} language="bash" lineNumbers={false} />
          </CodeBlock>
        </StateRow>
        <StateRow label="Destructive">
          <CodeBlock
            variant="destructive"
            className="max-w-[40rem] contain-inline-size"
          >
            <CodeBlockHeader>
              <CodeBlockTitle>
                <TerminalIcon />
                npx shadcn add @serigraph/questionaire
              </CodeBlockTitle>
            </CodeBlockHeader>
            <CodeBlockContent>{ERROR}</CodeBlockContent>
          </CodeBlock>
        </StateRow>
        <StateRow label="Wrapped">
          <CodeBlock size="sm" className="max-w-[22rem]">
            <CodeBlockContent wrap lineNumbers>
              {`npx shadcn@latest add @serigraph/bubble @serigraph/message @serigraph/message-scroller @serigraph/attachment`}
            </CodeBlockContent>
          </CodeBlock>
        </StateRow>
      </DemoSection>
    </>
  )
}
