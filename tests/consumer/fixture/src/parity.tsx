import { Bar, BarChart, XAxis } from "recharts"
import { Calendar } from "@/serigraph/ui/calendar"
import {
  ChartContainer,
  chartFill,
  type ChartConfig,
} from "@/serigraph/ui/chart"
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockLine,
} from "@/serigraph/ui/code-block"
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/serigraph/ui/command"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/serigraph/ui/empty"
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
} from "@/serigraph/ui/sidebar"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/serigraph/ui/sidebar-menu"
import { Toaster } from "@/serigraph/ui/sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/serigraph/ui/table"

const VISITORS = [
  { night: "Thu", visitors: 212 },
  { night: "Fri", visitors: 348 },
]
const CONFIG = { visitors: { label: "Visitors" } } satisfies ChartConfig

// The rest of parity the install test adds: a sidebar, a table, a chart with Serigraph's fills, a calendar, a
// command list, an empty state, a code block and the toaster.
export function Parity() {
  return (
    <SidebarProvider>
      <Sidebar collapsible="none">
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>Tonight</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <div className="grid gap-6 p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Night</TableHead>
              <TableHead className="text-end">Visitors</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {VISITORS.map((row) => (
              <TableRow key={row.night}>
                <TableCell>{row.night}</TableCell>
                <TableCell className="text-end">{row.visitors}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ChartContainer config={CONFIG} className="h-48 w-full">
          <BarChart data={VISITORS}>
            <XAxis dataKey="night" />
            <Bar dataKey="visitors" fill={chartFill("visitors")} />
          </BarChart>
        </ChartContainer>
        <Calendar
          mode="single"
          today={new Date(2026, 10, 5)}
          defaultMonth={new Date(2026, 10, 1)}
        />
        <Command>
          <CommandInput placeholder="Find a session" />
          <CommandList>
            <CommandItem>Saturn at opposition</CommandItem>
          </CommandList>
        </Command>
        <Empty>
          <EmptyHeader>
            <EmptyMedia seed="consumer" />
            <EmptyTitle>No sessions tonight</EmptyTitle>
            <EmptyDescription>The programme is up at noon.</EmptyDescription>
          </EmptyHeader>
        </Empty>
        <CodeBlock>
          <CodeBlockContent>
            <CodeBlockLine>npx shadcn add @serigraph/table</CodeBlockLine>
          </CodeBlockContent>
        </CodeBlock>
        <Toaster />
      </div>
    </SidebarProvider>
  )
}
