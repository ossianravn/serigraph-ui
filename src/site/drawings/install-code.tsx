import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/serigraph/ui/code-block"

// How a project draws the library: the install command, then the line that draws one object, each with its own copy
// button. One React component, so each code block keeps its parts' context when Astro places it.
export function InstallCode({ lines }: { lines: [string, string] }) {
  const [command, jsx] = lines
  return (
    <div className="drawings-code">
      {(
        [
          ["Terminal", command],
          ["TSX", jsx],
        ] as const
      ).map(([title, line]) => (
        <CodeBlock key={title}>
          <CodeBlockHeader>
            <CodeBlockTitle>{title}</CodeBlockTitle>
            <CodeBlockActions>
              <CodeBlockCopyButton value={line} />
            </CodeBlockActions>
          </CodeBlockHeader>
          <CodeBlockContent>
            <CodeBlockLine>{line}</CodeBlockLine>
          </CodeBlockContent>
        </CodeBlock>
      ))}
    </div>
  )
}
