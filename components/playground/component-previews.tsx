"use client"

import { ReactNode } from "react"

// shadcn/ui
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Kbd } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Spinner } from "@/components/ui/spinner"

// n8n
import { N8nButton } from "@/components/n8n/shared/button"
import { IconButton } from "@/components/n8n/shared/icon-button"
import { N8nLogo } from "@/components/n8n/shared/n8n-logo"
import { StatCard } from "@/components/n8n/shared/stat-card"
import { Tag } from "@/components/n8n/shared/tag"
import { TabBar } from "@/components/n8n/shared/tab-bar"
import { Pagination as N8nPagination } from "@/components/n8n/shared/pagination"
import { WorkflowRow } from "@/components/n8n/shared/workflow-row"

import { Bold, Italic, Underline, Info, ChevronDown, Terminal, MoreVertical, Filter, Settings } from "lucide-react"

const previews: Record<string, ReactNode> = {
  // --- shadcn/ui ---
  "components/ui/accordion.tsx": (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-xs">Is it accessible?</AccordionTrigger>
        <AccordionContent className="text-xs">Yes. It follows WAI-ARIA patterns.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  "components/ui/alert.tsx": (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle className="text-xs">Heads up!</AlertTitle>
      <AlertDescription className="text-xs">This is an alert.</AlertDescription>
    </Alert>
  ),
  "components/ui/alert-dialog.tsx": (
    <Button variant="outline" size="sm" className="text-xs">Open Alert Dialog</Button>
  ),
  "components/ui/aspect-ratio.tsx": (
    <AspectRatio ratio={16 / 9} className="bg-muted rounded-md" />
  ),
  "components/ui/avatar.tsx": (
    <Avatar>
      <AvatarFallback>GA</AvatarFallback>
    </Avatar>
  ),
  "components/ui/badge.tsx": (
    <div className="flex gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  ),
  "components/ui/breadcrumb.tsx": (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem><BreadcrumbLink href="#" className="text-xs">Home</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbLink href="#" className="text-xs">Page</BreadcrumbLink></BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  "components/ui/button.tsx": (
    <div className="flex gap-2">
      <Button size="sm">Primary</Button>
      <Button size="sm" variant="secondary">Secondary</Button>
      <Button size="sm" variant="outline">Outline</Button>
      <Button size="sm" variant="ghost">Ghost</Button>
    </div>
  ),
  "components/ui/button-group.tsx": (
    <div className="flex gap-0">
      <Button size="sm" variant="outline" className="rounded-r-none">Left</Button>
      <Button size="sm" variant="outline" className="rounded-none border-x-0">Mid</Button>
      <Button size="sm" variant="outline" className="rounded-l-none">Right</Button>
    </div>
  ),
  "components/ui/calendar.tsx": (
    <Calendar className="rounded-md border scale-[0.85] origin-top-left" />
  ),
  "components/ui/card.tsx": (
    <Card className="w-full">
      <CardHeader className="p-3"><CardTitle className="text-xs">Card Title</CardTitle></CardHeader>
      <CardContent className="p-3 pt-0"><p className="text-xs text-muted-foreground">Card content goes here.</p></CardContent>
    </Card>
  ),
  "components/ui/carousel.tsx": (
    <div className="text-xs text-muted-foreground italic">Embla carousel — see docs</div>
  ),
  "components/ui/chart.tsx": (
    <div className="text-xs text-muted-foreground italic">Recharts wrapper — see docs</div>
  ),
  "components/ui/checkbox.tsx": (
    <div className="flex items-center gap-2">
      <Checkbox id="preview-cb" />
      <Label htmlFor="preview-cb" className="text-xs">Accept terms</Label>
    </div>
  ),
  "components/ui/collapsible.tsx": (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs gap-1">
          Toggle <ChevronDown className="w-3 h-3" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="text-xs text-muted-foreground">Hidden content</CollapsibleContent>
    </Collapsible>
  ),
  "components/ui/command.tsx": (
    <div className="text-xs text-muted-foreground italic">Command palette (cmdk) — see docs</div>
  ),
  "components/ui/context-menu.tsx": (
    <div className="text-xs text-muted-foreground italic">Right-click context menu</div>
  ),
  "components/ui/dialog.tsx": (
    <Dialog>
      <DialogTrigger asChild><Button size="sm" variant="outline" className="text-xs">Open Dialog</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Dialog Title</DialogTitle></DialogHeader>
        <p className="text-sm text-muted-foreground">Dialog content goes here.</p>
      </DialogContent>
    </Dialog>
  ),
  "components/ui/drawer.tsx": (
    <Button size="sm" variant="outline" className="text-xs">Open Drawer</Button>
  ),
  "components/ui/dropdown-menu.tsx": (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button size="sm" variant="outline" className="text-xs">Open Menu</Button></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="text-xs">Option 1</DropdownMenuItem>
        <DropdownMenuItem className="text-xs">Option 2</DropdownMenuItem>
        <DropdownMenuItem className="text-xs">Option 3</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  "components/ui/empty.tsx": (
    <div className="text-xs text-muted-foreground italic">Empty state component</div>
  ),
  "components/ui/field.tsx": (
    <div className="text-xs text-muted-foreground italic">Form field wrapper</div>
  ),
  "components/ui/form.tsx": (
    <div className="text-xs text-muted-foreground italic">React Hook Form wrapper — see docs</div>
  ),
  "components/ui/hover-card.tsx": (
    <div className="text-xs text-muted-foreground italic">Hover to reveal card</div>
  ),
  "components/ui/input.tsx": (
    <Input placeholder="Type something..." className="text-xs h-8" />
  ),
  "components/ui/input-group.tsx": (
    <div className="text-xs text-muted-foreground italic">Input with prefix/suffix</div>
  ),
  "components/ui/input-otp.tsx": (
    <div className="text-xs text-muted-foreground italic">OTP input — see docs</div>
  ),
  "components/ui/item.tsx": (
    <div className="text-xs text-muted-foreground italic">List item primitive</div>
  ),
  "components/ui/kbd.tsx": (
    <div className="flex gap-1">
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </div>
  ),
  "components/ui/label.tsx": (
    <Label className="text-xs">Form label</Label>
  ),
  "components/ui/menubar.tsx": (
    <div className="text-xs text-muted-foreground italic">Menu bar — see docs</div>
  ),
  "components/ui/navigation-menu.tsx": (
    <div className="text-xs text-muted-foreground italic">Navigation menu — see docs</div>
  ),
  "components/ui/pagination.tsx": (
    <Pagination>
      <PaginationContent>
        <PaginationItem><PaginationPrevious href="#" className="text-xs h-8" /></PaginationItem>
        <PaginationItem><PaginationLink href="#" className="text-xs h-8">1</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#" className="text-xs h-8">2</PaginationLink></PaginationItem>
        <PaginationItem><PaginationNext href="#" className="text-xs h-8" /></PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
  "components/ui/popover.tsx": (
    <Popover>
      <PopoverTrigger asChild><Button size="sm" variant="outline" className="text-xs">Open Popover</Button></PopoverTrigger>
      <PopoverContent className="text-xs w-48">Popover content here.</PopoverContent>
    </Popover>
  ),
  "components/ui/progress.tsx": (
    <Progress value={66} className="h-2" />
  ),
  "components/ui/radio-group.tsx": (
    <RadioGroup defaultValue="a" className="flex gap-3">
      <div className="flex items-center gap-1.5">
        <RadioGroupItem value="a" id="ra" />
        <Label htmlFor="ra" className="text-xs">A</Label>
      </div>
      <div className="flex items-center gap-1.5">
        <RadioGroupItem value="b" id="rb" />
        <Label htmlFor="rb" className="text-xs">B</Label>
      </div>
    </RadioGroup>
  ),
  "components/ui/resizable.tsx": (
    <div className="text-xs text-muted-foreground italic">Resizable panels — see docs</div>
  ),
  "components/ui/scroll-area.tsx": (
    <ScrollArea className="h-16 w-full rounded-md border p-2">
      <div className="text-xs space-y-1">
        {Array.from({ length: 8 }, (_, i) => <div key={i}>Item {i + 1}</div>)}
      </div>
    </ScrollArea>
  ),
  "components/ui/select.tsx": (
    <Select>
      <SelectTrigger className="w-full h-8 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger>
      <SelectContent>
        <SelectItem value="a" className="text-xs">Option A</SelectItem>
        <SelectItem value="b" className="text-xs">Option B</SelectItem>
        <SelectItem value="c" className="text-xs">Option C</SelectItem>
      </SelectContent>
    </Select>
  ),
  "components/ui/separator.tsx": (
    <div className="space-y-2">
      <p className="text-xs">Above</p>
      <Separator />
      <p className="text-xs">Below</p>
    </div>
  ),
  "components/ui/sheet.tsx": (
    <Button size="sm" variant="outline" className="text-xs">Open Sheet</Button>
  ),
  "components/ui/sidebar.tsx": (
    <div className="text-xs text-muted-foreground italic">Sidebar layout — see docs</div>
  ),
  "components/ui/skeleton.tsx": (
    <div className="space-y-2">
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  ),
  "components/ui/slider.tsx": (
    <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
  ),
  "components/ui/sonner.tsx": (
    <div className="text-xs text-muted-foreground italic">Toast notifications (Sonner)</div>
  ),
  "components/ui/spinner.tsx": (
    <Spinner className="w-5 h-5" />
  ),
  "components/ui/switch.tsx": (
    <div className="flex items-center gap-2">
      <Switch id="preview-sw" />
      <Label htmlFor="preview-sw" className="text-xs">Toggle</Label>
    </div>
  ),
  "components/ui/table.tsx": (
    <Table>
      <TableHeader>
        <TableRow><TableHead className="text-xs h-8">Name</TableHead><TableHead className="text-xs h-8">Status</TableHead></TableRow>
      </TableHeader>
      <TableBody>
        <TableRow><TableCell className="text-xs py-1.5">Workflow 1</TableCell><TableCell className="text-xs py-1.5">Active</TableCell></TableRow>
        <TableRow><TableCell className="text-xs py-1.5">Workflow 2</TableCell><TableCell className="text-xs py-1.5">Draft</TableCell></TableRow>
      </TableBody>
    </Table>
  ),
  "components/ui/tabs.tsx": (
    <Tabs defaultValue="a" className="w-full">
      <TabsList><TabsTrigger value="a" className="text-xs">Tab A</TabsTrigger><TabsTrigger value="b" className="text-xs">Tab B</TabsTrigger></TabsList>
      <TabsContent value="a" className="text-xs pt-2">Content A</TabsContent>
      <TabsContent value="b" className="text-xs pt-2">Content B</TabsContent>
    </Tabs>
  ),
  "components/ui/textarea.tsx": (
    <Textarea placeholder="Write something..." className="text-xs min-h-[60px]" />
  ),
  "components/ui/toast.tsx": (
    <div className="text-xs text-muted-foreground italic">Toast primitive — use Sonner</div>
  ),
  "components/ui/toaster.tsx": (
    <div className="text-xs text-muted-foreground italic">Toast container — use Sonner</div>
  ),
  "components/ui/toggle.tsx": (
    <Toggle size="sm" aria-label="Toggle bold"><Bold className="h-3 w-3" /></Toggle>
  ),
  "components/ui/toggle-group.tsx": (
    <ToggleGroup type="multiple" size="sm">
      <ToggleGroupItem value="bold" aria-label="Bold"><Bold className="h-3 w-3" /></ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic"><Italic className="h-3 w-3" /></ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline"><Underline className="h-3 w-3" /></ToggleGroupItem>
    </ToggleGroup>
  ),
  "components/ui/tooltip.tsx": (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild><Button size="sm" variant="outline" className="text-xs">Hover me</Button></TooltipTrigger>
        <TooltipContent className="text-xs">Tooltip content</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  "components/ui/use-mobile.tsx": (
    <div className="text-xs text-muted-foreground italic">useMobile() hook — returns boolean</div>
  ),
  "components/ui/use-toast.ts": (
    <div className="text-xs text-muted-foreground italic">useToast() hook — triggers toasts</div>
  ),

  // --- n8n ---
  "components/n8n/shared/credential-row.tsx": (
    <div className="text-xs text-muted-foreground italic">Credential list row — used in Overview and Personal screens</div>
  ),
  "components/n8n/shared/execution-row.tsx": (
    <div className="text-xs text-muted-foreground italic">Execution list row — used in Overview and Personal screens</div>
  ),
  "components/n8n/shared/execution-list-header.tsx": (
    <div className="text-xs text-muted-foreground italic">Execution list column headers</div>
  ),
  "components/n8n/shared/icon-button.tsx": (
    <div className="flex gap-2 items-center">
      <IconButton icon={<MoreVertical className="w-4 h-4 text-[var(--color--neutral-400)]" />} label="More" />
      <IconButton icon={<Filter className="w-4 h-4 text-[var(--color--neutral-500)]" />} label="Filter" />
      <IconButton icon={<Settings className="w-4 h-4 text-[var(--color--neutral-500)]" />} label="Settings" />
    </div>
  ),
  "components/n8n/shared/stat-card.tsx": (
    <StatCard label="Prod. executions" value="2,259" trend="8.65%" trendDown />
  ),
  "components/n8n/shared/pagination.tsx": (
    <N8nPagination total={308} className="px-0" />
  ),
  "components/n8n/shared/button.tsx": (
    <div className="flex gap-2 items-center flex-wrap">
      <N8nButton>Solid</N8nButton>
      <N8nButton variant="subtle">Subtle</N8nButton>
      <N8nButton variant="outline">Outline</N8nButton>
      <N8nButton variant="ghost">Ghost</N8nButton>
      <N8nButton variant="destructive">Destructive</N8nButton>
      <N8nButton variant="success">Success</N8nButton>
    </div>
  ),
  "components/n8n/shared/tab-bar.tsx": (
    <TabBar
      tabs={[
        { id: "workflows", label: "Workflows" },
        { id: "credentials", label: "Credentials" },
        { id: "executions", label: "Executions" },
      ]}
      activeTab="workflows"
      onTabChange={() => {}}
      className="px-0"
    />
  ),
  "components/n8n/shared/tag.tsx": (
    <div className="flex gap-2">
      <Tag text="marketing" />
      <Tag text="Production Workflows" />
      <Tag text="v2" />
    </div>
  ),
  "components/n8n/shared/n8n-logo.tsx": (
    <div className="flex items-center gap-2">
      <N8nLogo size={24} />
      <N8nLogo size={32} />
      <N8nLogo size={48} />
    </div>
  ),
  "components/n8n/shared/workflow-row.tsx": (
    <WorkflowRow
      workflow={{
        id: "preview",
        name: "Get Calendar & Gmail",
        nodes: [],
        connections: [],
        status: "published",
        lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000),
        createdAt: new Date("2025-02-20"),
        project: "Personal",
        linkedCount: 3,
      }}
    />
  ),
  "components/n8n/shared/service-icon.tsx": (
    <div className="text-xs text-muted-foreground italic">Service icon renderer</div>
  ),
  "components/n8n/sidebar.tsx": (
    <div className="text-xs text-muted-foreground italic">n8n sidebar with navigation — see prototype</div>
  ),
  "components/n8n/app-layout.tsx": (
    <div className="text-xs text-muted-foreground italic">Full app shell (sidebar + screen switching) — see workflow-editor prototype</div>
  ),
  "components/n8n/prototype-shell.tsx": (
    <div className="text-xs text-muted-foreground italic">App shell wrapper accepting children — use for new prototypes</div>
  ),
  "components/n8n/panels/nodes-panel.tsx": (
    <div className="text-xs text-muted-foreground italic">Node browser panel — see workflow-editor</div>
  ),
  "components/n8n/panels/node-config-panel.tsx": (
    <div className="text-xs text-muted-foreground italic">Node configuration panel — see workflow-editor</div>
  ),
  "components/n8n/screens/overview.tsx": (
    <div className="text-xs text-muted-foreground italic">Overview screen — see workflow-editor</div>
  ),
  "components/n8n/screens/personal.tsx": (
    <div className="text-xs text-muted-foreground italic">Personal screen — see workflow-editor</div>
  ),
  "components/n8n/screens/settings.tsx": (
    <div className="text-xs text-muted-foreground italic">Settings screen — see workflow-editor</div>
  ),
  "components/n8n/screens/workflow-editor.tsx": (
    <div className="text-xs text-muted-foreground italic">Visual workflow editor — see workflow-editor prototype</div>
  ),
  "components/n8n/modals/credential-modal.tsx": (
    <div className="text-xs text-muted-foreground italic">Credential creation modal — see workflow-editor</div>
  ),
}

export function getComponentPreview(path: string): ReactNode | null {
  return previews[path] ?? null
}
