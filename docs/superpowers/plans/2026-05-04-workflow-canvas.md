# Workflow Canvas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a flexible, embeddable React Flow-based workflow visualization component (`<WorkflowCanvas />`) that any prototype in `n8n-playground` can drop in, with three built-in node types (action, trigger, sticky note) and a toolbar add-node picker.

**Architecture:** A self-contained component folder under `components/n8n/workflow-canvas/`. Internal state via React Flow's `useNodesState` / `useEdgesState`. Uncontrolled API (`initialNodes` / `initialEdges` only — no persistence). Custom node types render with styled-jsx + n8n design tokens.

**Tech Stack:** Next.js 16, React 19, TypeScript, `@xyflow/react` (modern React Flow), styled-jsx, shadcn `Popover` for the picker UI.

**Spec:** See `docs/superpowers/specs/2026-05-04-workflow-canvas-design.md`.

**Testing convention:** This project has no unit-test framework. Per `CLAUDE.md`, every UI change is verified by taking a screenshot via Chrome DevTools MCP and visually inspecting it. Each task ends with a screenshot verification step before commit.

---

## File map

**Create:**
- `components/n8n/workflow-canvas/index.ts` — public re-exports
- `components/n8n/workflow-canvas/types.ts` — exported TypeScript types
- `components/n8n/workflow-canvas/service-catalog.ts` — service id → metadata (label, kind: trigger|action)
- `components/n8n/workflow-canvas/workflow-canvas.tsx` — main `<WorkflowCanvas />` component
- `components/n8n/workflow-canvas/add-node-toolbar.tsx` — toolbar `+ Add node` button + picker wiring
- `components/n8n/workflow-canvas/node-picker.tsx` — picker popover (search + service grid + sticky-note option)
- `components/n8n/workflow-canvas/nodes/action-node.tsx`
- `components/n8n/workflow-canvas/nodes/trigger-node.tsx`
- `components/n8n/workflow-canvas/nodes/sticky-node.tsx`
- `app/prototypes/giulio/workflow-canvas-demo/page.tsx` — demo prototype
- `app/prototypes/giulio/workflow-canvas-demo/metadata.json` — demo metadata

**Modify:**
- `package.json` — add `@xyflow/react` to dependencies

---

## Task 1: Install React Flow

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the package**

```bash
pnpm add @xyflow/react
```

- [ ] **Step 2: Verify the install**

```bash
grep '"@xyflow/react"' package.json
```

Expected: a line like `"@xyflow/react": "^12.x.x"` appears.

- [ ] **Step 3: Confirm dev server still starts**

If `pnpm dev` is not already running, start it in the background:

```bash
pnpm dev
```

Wait until you see `Ready in ...` in the output. Open `http://localhost:3000` in Chrome DevTools MCP and confirm the homepage renders without errors.

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "🔧 Add @xyflow/react dependency for workflow-canvas"
```

---

## Task 2: Types, service catalog, folder skeleton

**Files:**
- Create: `components/n8n/workflow-canvas/types.ts`
- Create: `components/n8n/workflow-canvas/service-catalog.ts`
- Create: `components/n8n/workflow-canvas/index.ts`

- [ ] **Step 1: Create `types.ts`**

```ts
// components/n8n/workflow-canvas/types.ts

export type ServiceId =
  | 'webhook'
  | 'http'
  | 'gmail'
  | 'slack'
  | 'google-calendar'
  | 'spotify'
  | 'clock'
  | 'switch'
  | 'code'
  | 'ai'

export interface BaseNodeData {
  id: string
  position: { x: number; y: number }
}

export interface ActionNodeData extends BaseNodeData {
  type: 'action'
  service: ServiceId
  label: string
  sublabel?: string
}

export interface TriggerNodeData extends BaseNodeData {
  type: 'trigger'
  service: ServiceId
  label: string
  sublabel?: string
}

export type StickyColor = 'yellow' | 'blue' | 'green' | 'pink'

export interface StickyNodeData extends BaseNodeData {
  type: 'sticky'
  text: string
  color: StickyColor
  width: number
  height: number
}

export type WorkflowCanvasNode =
  | ActionNodeData
  | TriggerNodeData
  | StickyNodeData

export interface WorkflowCanvasEdge {
  id: string
  source: string
  target: string
}
```

- [ ] **Step 2: Create `service-catalog.ts`**

```ts
// components/n8n/workflow-canvas/service-catalog.ts
import type { ServiceId } from './types'

export type ServiceKind = 'trigger' | 'action'

export interface ServiceCatalogEntry {
  id: ServiceId
  label: string
  kind: ServiceKind
}

export const SERVICE_CATALOG: ServiceCatalogEntry[] = [
  { id: 'webhook',         label: 'Webhook',          kind: 'trigger' },
  { id: 'clock',           label: 'Schedule',         kind: 'trigger' },
  { id: 'http',            label: 'HTTP Request',     kind: 'action'  },
  { id: 'gmail',           label: 'Gmail',            kind: 'action'  },
  { id: 'slack',           label: 'Slack',            kind: 'action'  },
  { id: 'google-calendar', label: 'Google Calendar',  kind: 'action'  },
  { id: 'spotify',         label: 'Spotify',          kind: 'action'  },
  { id: 'switch',          label: 'Switch',           kind: 'action'  },
  { id: 'code',            label: 'Code',             kind: 'action'  },
  { id: 'ai',              label: 'AI Agent',         kind: 'action'  },
]

export function findService(id: ServiceId): ServiceCatalogEntry | undefined {
  return SERVICE_CATALOG.find((s) => s.id === id)
}
```

- [ ] **Step 3: Create `index.ts` (placeholder, will fill in after main component exists)**

```ts
// components/n8n/workflow-canvas/index.ts
export type {
  WorkflowCanvasNode,
  WorkflowCanvasEdge,
  ActionNodeData,
  TriggerNodeData,
  StickyNodeData,
  StickyColor,
  ServiceId,
} from './types'
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: no errors. (If `pnpm tsc` is not available, run `npx tsc --noEmit`.)

- [ ] **Step 5: Commit**

```bash
git add components/n8n/workflow-canvas/
git commit -m "✨ Add workflow-canvas types, service catalog, and folder skeleton"
```

---

## Task 3: Action node component

**Files:**
- Create: `components/n8n/workflow-canvas/nodes/action-node.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/n8n/workflow-canvas/nodes/action-node.tsx
'use client'

import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import { ServiceIcon } from '@/components/n8n/shared/service-icon'
import type { ActionNodeData } from '../types'

type RFActionNode = Node<ActionNodeData, 'action'>

export function ActionNode({ data, selected }: NodeProps<RFActionNode>) {
  return (
    <div className="action-node" data-selected={selected ? 'true' : 'false'}>
      <Handle type="target" position={Position.Left} className="handle" />
      <div className="icon-box">
        <ServiceIcon service={data.service} size={32} />
      </div>
      <Handle type="source" position={Position.Right} className="handle" />
      <div className="labels">
        <div className="label">{data.label}</div>
        {data.sublabel && <div className="sublabel">{data.sublabel}</div>}
      </div>

      <style jsx>{`
        .action-node {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing--3xs);
        }
        .icon-box {
          width: 80px;
          height: 80px;
          border-radius: var(--radius--md, 6px);
          background: var(--color--neutral-white);
          border: 1px solid var(--color--neutral-200);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .action-node[data-selected='true'] .icon-box {
          border-color: var(--color--primary);
          box-shadow: 0 0 0 2px var(--color--primary-tint-3, rgba(255, 100, 0, 0.2));
        }
        .labels {
          margin-top: var(--spacing--3xs);
          text-align: center;
          max-width: 110px;
        }
        .label {
          font-size: var(--font-size--xs, 12px);
          font-weight: var(--font-weight--medium, 500);
          color: var(--color--neutral-800);
          line-height: 1.3;
        }
        .sublabel {
          font-size: var(--font-size--2xs, 10px);
          color: var(--color--neutral-500);
          line-height: 1.3;
          margin-top: 2px;
        }
        .handle {
          width: 8px;
          height: 8px;
          background: var(--color--neutral-white);
          border: 1px solid var(--color--neutral-400);
        }
      `}</style>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/n8n/workflow-canvas/nodes/action-node.tsx
git commit -m "✨ Add ActionNode component for workflow-canvas"
```

(Visual verification deferred to Task 6 once the canvas renders nodes.)

---

## Task 4: Trigger node component

**Files:**
- Create: `components/n8n/workflow-canvas/nodes/trigger-node.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/n8n/workflow-canvas/nodes/trigger-node.tsx
'use client'

import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import { Zap } from 'lucide-react'
import { ServiceIcon } from '@/components/n8n/shared/service-icon'
import type { TriggerNodeData } from '../types'

type RFTriggerNode = Node<TriggerNodeData, 'trigger'>

export function TriggerNode({ data, selected }: NodeProps<RFTriggerNode>) {
  return (
    <div className="trigger-node" data-selected={selected ? 'true' : 'false'}>
      <div className="icon-box">
        <span className="bolt" aria-hidden>
          <Zap size={10} fill="currentColor" strokeWidth={0} />
        </span>
        <ServiceIcon service={data.service} size={32} />
      </div>
      <Handle type="source" position={Position.Right} className="handle" />
      <div className="labels">
        <div className="label">{data.label}</div>
        {data.sublabel && <div className="sublabel">{data.sublabel}</div>}
      </div>

      <style jsx>{`
        .trigger-node {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing--3xs);
        }
        .icon-box {
          position: relative;
          width: 80px;
          height: 80px;
          border-radius: 24px 6px 6px 24px;
          background: var(--color--neutral-white);
          border: 1px solid var(--color--neutral-200);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .trigger-node[data-selected='true'] .icon-box {
          border-color: var(--color--primary);
          box-shadow: 0 0 0 2px var(--color--primary-tint-3, rgba(255, 100, 0, 0.2));
        }
        .bolt {
          position: absolute;
          top: 4px;
          left: 6px;
          color: var(--color--orange-500, #ff6b00);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .labels {
          margin-top: var(--spacing--3xs);
          text-align: center;
          max-width: 110px;
        }
        .label {
          font-size: var(--font-size--xs, 12px);
          font-weight: var(--font-weight--medium, 500);
          color: var(--color--neutral-800);
          line-height: 1.3;
        }
        .sublabel {
          font-size: var(--font-size--2xs, 10px);
          color: var(--color--neutral-500);
          line-height: 1.3;
          margin-top: 2px;
        }
        .handle {
          width: 8px;
          height: 8px;
          background: var(--color--neutral-white);
          border: 1px solid var(--color--neutral-400);
        }
      `}</style>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/n8n/workflow-canvas/nodes/trigger-node.tsx
git commit -m "✨ Add TriggerNode component for workflow-canvas"
```

---

## Task 5: Sticky note node component

**Files:**
- Create: `components/n8n/workflow-canvas/nodes/sticky-node.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/n8n/workflow-canvas/nodes/sticky-node.tsx
'use client'

import { NodeResizer, type Node, type NodeProps } from '@xyflow/react'
import type { StickyNodeData, StickyColor } from '../types'

type RFStickyNode = Node<StickyNodeData, 'sticky'>

const COLOR_BG: Record<StickyColor, string> = {
  yellow: '#FFF4B8',
  blue:   '#CFE6FF',
  green:  '#D1F0D6',
  pink:   '#FFD6E1',
}

const COLOR_BORDER: Record<StickyColor, string> = {
  yellow: '#E6D266',
  blue:   '#86B6E0',
  green:  '#88C997',
  pink:   '#E89AB1',
}

export function StickyNode({ data, selected }: NodeProps<RFStickyNode>) {
  return (
    <div
      className="sticky-node"
      data-selected={selected ? 'true' : 'false'}
      style={{
        background: COLOR_BG[data.color],
        borderColor: COLOR_BORDER[data.color],
        width: data.width,
        height: data.height,
      }}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={120}
        minHeight={60}
        lineStyle={{ borderColor: COLOR_BORDER[data.color] }}
        handleStyle={{
          width: 8,
          height: 8,
          background: '#ffffff',
          borderColor: COLOR_BORDER[data.color],
        }}
      />
      <div className="text">{data.text}</div>

      <style jsx>{`
        .sticky-node {
          border-radius: var(--radius--md, 6px);
          border: 1px solid;
          padding: var(--spacing--2xs);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
          font-size: var(--font-size--sm, 13px);
          color: var(--color--neutral-800);
          line-height: 1.4;
          white-space: pre-wrap;
          overflow: hidden;
        }
        .sticky-node[data-selected='true'] {
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
        }
      `}</style>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/n8n/workflow-canvas/nodes/sticky-node.tsx
git commit -m "✨ Add StickyNode component for workflow-canvas"
```

---

## Task 6: Main `<WorkflowCanvas />` component

**Files:**
- Create: `components/n8n/workflow-canvas/workflow-canvas.tsx`
- Modify: `components/n8n/workflow-canvas/index.ts`

- [ ] **Step 1: Create the main component**

```tsx
// components/n8n/workflow-canvas/workflow-canvas.tsx
'use client'

import { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import type {
  WorkflowCanvasNode,
  WorkflowCanvasEdge,
} from './types'
import { ActionNode } from './nodes/action-node'
import { TriggerNode } from './nodes/trigger-node'
import { StickyNode } from './nodes/sticky-node'
import { AddNodeToolbar } from './add-node-toolbar'

interface WorkflowCanvasProps {
  initialNodes: WorkflowCanvasNode[]
  initialEdges: WorkflowCanvasEdge[]
}

const NODE_TYPES = {
  action: ActionNode,
  trigger: TriggerNode,
  sticky: StickyNode,
}

function toReactFlowNode(n: WorkflowCanvasNode): Node {
  const base = {
    id: n.id,
    position: n.position,
    data: n,
  }
  if (n.type === 'sticky') {
    return {
      ...base,
      type: 'sticky',
      style: { width: n.width, height: n.height },
    }
  }
  return { ...base, type: n.type }
}

function toReactFlowEdge(e: WorkflowCanvasEdge): Edge {
  return { id: e.id, source: e.source, target: e.target, type: 'default' }
}

function WorkflowCanvasInner({ initialNodes, initialEdges }: WorkflowCanvasProps) {
  const rfInitialNodes = useMemo(() => initialNodes.map(toReactFlowNode), [initialNodes])
  const rfInitialEdges = useMemo(() => initialEdges.map(toReactFlowEdge), [initialEdges])

  const [nodes, setNodes, onNodesChange] = useNodesState(rfInitialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(rfInitialEdges)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  return (
    <div className="workflow-canvas-root">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        deleteKeyCode={['Backspace', 'Delete']}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls position="bottom-left" />
      </ReactFlow>
      <AddNodeToolbar onAdd={(newNode) => setNodes((nds) => [...nds, toReactFlowNode(newNode)])} />

      <style jsx>{`
        .workflow-canvas-root {
          position: relative;
          width: 100%;
          height: 100%;
          background: var(--color--neutral-50, #fafafa);
        }
      `}</style>
    </div>
  )
}

export function WorkflowCanvas(props: WorkflowCanvasProps) {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner {...props} />
    </ReactFlowProvider>
  )
}
```

Note: this file references `AddNodeToolbar` from `./add-node-toolbar`, which is created in Task 8. To make this task self-verifying, **temporarily** stub it inline by removing the `<AddNodeToolbar ... />` line and the import; uncomment them in Task 8. Or — alternative — implement Task 8 first; the order is mechanical, not a dependency tree blocker.

For simplicity, this plan **defers wiring `AddNodeToolbar` into `WorkflowCanvas` until Task 8**. In Task 6, comment out the import and the `<AddNodeToolbar … />` JSX. Re-enable in Task 8.

Replace those two lines with comments:
```tsx
// import { AddNodeToolbar } from './add-node-toolbar' // Task 8
```
```tsx
{/* <AddNodeToolbar onAdd={...} /> Task 8 */}
```

- [ ] **Step 2: Update `index.ts` to export the component**

```ts
// components/n8n/workflow-canvas/index.ts
export { WorkflowCanvas } from './workflow-canvas'
export type {
  WorkflowCanvasNode,
  WorkflowCanvasEdge,
  ActionNodeData,
  TriggerNodeData,
  StickyNodeData,
  StickyColor,
  ServiceId,
} from './types'
```

- [ ] **Step 3: Create a temporary verification page**

Create `app/__canvas-test/page.tsx` (a temporary throwaway route — deleted in the final task).

```tsx
// app/__canvas-test/page.tsx
'use client'

import { WorkflowCanvas, type WorkflowCanvasNode, type WorkflowCanvasEdge } from '@/components/n8n/workflow-canvas'

const nodes: WorkflowCanvasNode[] = [
  { id: '1', type: 'trigger', service: 'webhook', label: 'Webhook',  sublabel: 'GET',  position: { x:   0, y: 100 } },
  { id: '2', type: 'action',  service: 'ai',      label: 'AI Agent',                   position: { x: 240, y: 100 } },
  { id: '3', type: 'action',  service: 'gmail',   label: 'Send Email',                 position: { x: 480, y: 100 } },
  { id: '4', type: 'sticky',  color: 'yellow', text: 'Daily 9am summary',
    position: { x: 0, y: -120 }, width: 220, height: 80 },
]

const edges: WorkflowCanvasEdge[] = [
  { id: 'e1', source: '1', target: '2' },
  { id: 'e2', source: '2', target: '3' },
]

export default function CanvasTest() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <WorkflowCanvas initialNodes={nodes} initialEdges={edges} />
    </div>
  )
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Visual verification — screenshot the canvas**

Ensure `pnpm dev` is running. Then via Chrome DevTools MCP:

```
mcp__chrome-devtools__navigate_page → url: http://localhost:3000/__canvas-test
mcp__chrome-devtools__take_screenshot
```

Expected screenshot:
- Dotted gray background grid
- Three nodes wired left-to-right with smooth bezier curves: trigger (Webhook with leaf shape + lightning bolt) → action (AI Agent square) → action (Send Email square)
- One yellow sticky note above with "Daily 9am summary"
- Bottom-left zoom controls visible
- No JS errors in console

Verify by inspecting:
```
mcp__chrome-devtools__list_console_messages
```
Expected: no red errors.

If anything looks wrong (overlapping, broken styling, missing icons), fix and re-screenshot before committing.

- [ ] **Step 6: Test interactions manually via the browser tool**

- Drag a node — confirm it moves
- Click a node — confirm a selection style appears
- Press Backspace on a selected node — confirm it disappears
- Use scroll wheel — confirm zoom works
- Click the zoom buttons in the bottom-left — confirm zoom works

- [ ] **Step 7: Commit**

```bash
git add components/n8n/workflow-canvas/workflow-canvas.tsx components/n8n/workflow-canvas/index.ts app/__canvas-test/
git commit -m "✨ Add WorkflowCanvas core with React Flow, three node types"
```

---

## Task 7: Node picker popover

**Files:**
- Create: `components/n8n/workflow-canvas/node-picker.tsx`

- [ ] **Step 1: Create the picker component**

The picker is a controlled component that takes `open` / `onOpenChange` and emits a callback when a service or sticky is chosen. It uses shadcn `Popover` for positioning, but for simplicity in v1 we use a plain absolutely-positioned panel anchored to the toolbar; we can revisit if positioning becomes finicky.

```tsx
// components/n8n/workflow-canvas/node-picker.tsx
'use client'

import { useState, useMemo } from 'react'
import { Search, StickyNote } from 'lucide-react'
import { ServiceIcon } from '@/components/n8n/shared/service-icon'
import { SERVICE_CATALOG, type ServiceCatalogEntry } from './service-catalog'
import type { StickyColor } from './types'

interface NodePickerProps {
  open: boolean
  onClose: () => void
  onPickService: (service: ServiceCatalogEntry) => void
  onPickSticky: (color: StickyColor) => void
}

export function NodePicker({ open, onClose, onPickService, onPickSticky }: NodePickerProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return SERVICE_CATALOG
    return SERVICE_CATALOG.filter((s) => s.label.toLowerCase().includes(q))
  }, [query])

  const triggers = filtered.filter((s) => s.kind === 'trigger')
  const actions  = filtered.filter((s) => s.kind === 'action')

  if (!open) return null

  return (
    <>
      <div className="picker-backdrop" onClick={onClose} />
      <div className="picker-panel" role="dialog" aria-label="Add node">
        <div className="search-row">
          <Search size={14} style={{ color: 'var(--color--neutral-500)' }} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services…"
          />
        </div>

        {triggers.length > 0 && (
          <div className="section">
            <div className="section-title">Triggers</div>
            <div className="grid">
              {triggers.map((s) => (
                <button key={s.id} className="item" onClick={() => onPickService(s)} type="button">
                  <ServiceIcon service={s.id} size={20} />
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {actions.length > 0 && (
          <div className="section">
            <div className="section-title">Actions</div>
            <div className="grid">
              {actions.map((s) => (
                <button key={s.id} className="item" onClick={() => onPickService(s)} type="button">
                  <ServiceIcon service={s.id} size={20} />
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="section">
          <div className="section-title">Sticky note</div>
          <div className="grid">
            {(['yellow', 'blue', 'green', 'pink'] as StickyColor[]).map((c) => (
              <button key={c} className="item" onClick={() => onPickSticky(c)} type="button">
                <span className="swatch" data-color={c}>
                  <StickyNote size={14} />
                </span>
                <span>{c.charAt(0).toUpperCase() + c.slice(1)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .picker-backdrop {
          position: fixed;
          inset: 0;
          z-index: 50;
        }
        .picker-panel {
          position: absolute;
          top: 44px;
          right: 0;
          width: 300px;
          max-height: 480px;
          overflow: auto;
          background: var(--color--neutral-white);
          border: 1px solid var(--color--neutral-200);
          border-radius: var(--radius--md, 6px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          z-index: 51;
          padding: var(--spacing--2xs);
        }
        .search-row {
          display: flex;
          align-items: center;
          gap: var(--spacing--3xs);
          padding: var(--spacing--3xs) var(--spacing--2xs);
          border: 1px solid var(--color--neutral-150);
          border-radius: var(--radius--sm, 4px);
          margin-bottom: var(--spacing--2xs);
        }
        .search-row input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: var(--font-size--sm, 13px);
          color: var(--color--neutral-800);
        }
        .section + .section {
          margin-top: var(--spacing--2xs);
        }
        .section-title {
          font-size: var(--font-size--2xs, 10px);
          font-weight: var(--font-weight--medium, 500);
          color: var(--color--neutral-500);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: var(--spacing--3xs) var(--spacing--2xs);
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 4px;
        }
        .item {
          display: flex;
          align-items: center;
          gap: var(--spacing--3xs);
          padding: var(--spacing--3xs) var(--spacing--2xs);
          background: transparent;
          border: none;
          border-radius: var(--radius--sm, 4px);
          font-size: var(--font-size--sm, 13px);
          color: var(--color--neutral-800);
          cursor: pointer;
          text-align: left;
        }
        .item:hover {
          background: var(--color--neutral-100);
        }
        .swatch {
          width: 20px;
          height: 20px;
          border-radius: var(--radius--sm, 4px);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color--neutral-700);
        }
        .swatch[data-color='yellow'] { background: #FFF4B8; }
        .swatch[data-color='blue']   { background: #CFE6FF; }
        .swatch[data-color='green']  { background: #D1F0D6; }
        .swatch[data-color='pink']   { background: #FFD6E1; }
      `}</style>
    </>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/n8n/workflow-canvas/node-picker.tsx
git commit -m "✨ Add NodePicker popover for workflow-canvas"
```

(Visual verification deferred to Task 8 once the picker is wired up.)

---

## Task 8: Add-node toolbar (wires picker into canvas)

**Files:**
- Create: `components/n8n/workflow-canvas/add-node-toolbar.tsx`
- Modify: `components/n8n/workflow-canvas/workflow-canvas.tsx` (uncomment AddNodeToolbar import + JSX)

- [ ] **Step 1: Create the toolbar component**

```tsx
// components/n8n/workflow-canvas/add-node-toolbar.tsx
'use client'

import { useCallback, useState } from 'react'
import { Plus } from 'lucide-react'
import { useReactFlow } from '@xyflow/react'
import { NodePicker } from './node-picker'
import type {
  WorkflowCanvasNode,
  ActionNodeData,
  TriggerNodeData,
  StickyNodeData,
  StickyColor,
} from './types'
import type { ServiceCatalogEntry } from './service-catalog'

interface AddNodeToolbarProps {
  onAdd: (node: WorkflowCanvasNode) => void
}

let nodeIdCounter = 1
function nextNodeId(): string {
  const id = `n_${Date.now()}_${nodeIdCounter}`
  nodeIdCounter += 1
  return id
}

export function AddNodeToolbar({ onAdd }: AddNodeToolbarProps) {
  const [open, setOpen] = useState(false)
  const reactFlow = useReactFlow()

  const viewportCenter = useCallback(() => {
    if (typeof window === 'undefined') return { x: 0, y: 0 }
    return reactFlow.screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    })
  }, [reactFlow])

  const handlePickService = (service: ServiceCatalogEntry) => {
    const pos = viewportCenter()
    if (service.kind === 'trigger') {
      const node: TriggerNodeData = {
        id: nextNodeId(),
        type: 'trigger',
        service: service.id,
        label: service.label,
        position: pos,
      }
      onAdd(node)
    } else {
      const node: ActionNodeData = {
        id: nextNodeId(),
        type: 'action',
        service: service.id,
        label: service.label,
        position: pos,
      }
      onAdd(node)
    }
    setOpen(false)
  }

  const handlePickSticky = (color: StickyColor) => {
    const pos = viewportCenter()
    const node: StickyNodeData = {
      id: nextNodeId(),
      type: 'sticky',
      color,
      text: 'New note',
      position: pos,
      width: 220,
      height: 100,
    }
    onAdd(node)
    setOpen(false)
  }

  return (
    <div className="toolbar">
      <button
        type="button"
        className="add-btn"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Plus size={14} />
        <span>Add node</span>
      </button>
      <NodePicker
        open={open}
        onClose={() => setOpen(false)}
        onPickService={handlePickService}
        onPickSticky={handlePickSticky}
      />

      <style jsx>{`
        .toolbar {
          position: absolute;
          top: var(--spacing--xs);
          right: var(--spacing--xs);
          z-index: 10;
        }
        .add-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing--3xs);
          padding: var(--spacing--3xs) var(--spacing--xs);
          background: var(--color--neutral-white);
          border: 1px solid var(--color--neutral-200);
          border-radius: var(--radius--md, 6px);
          font-size: var(--font-size--sm, 13px);
          font-weight: var(--font-weight--medium, 500);
          color: var(--color--neutral-800);
          cursor: pointer;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
          transition: background 0.15s ease, border-color 0.15s ease;
        }
        .add-btn:hover {
          background: var(--color--neutral-50);
          border-color: var(--color--neutral-300);
        }
      `}</style>
    </div>
  )
}
```

- [ ] **Step 2: Re-enable `AddNodeToolbar` in `workflow-canvas.tsx`**

In `components/n8n/workflow-canvas/workflow-canvas.tsx`, uncomment the import and the JSX line. The active code should now contain:

```tsx
import { AddNodeToolbar } from './add-node-toolbar'
```

And inside the `.workflow-canvas-root` div, after the `<ReactFlow>` element:

```tsx
<AddNodeToolbar onAdd={(newNode) => setNodes((nds) => [...nds, toReactFlowNode(newNode)])} />
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Visual verification — screenshot with the toolbar**

Ensure `pnpm dev` is still running. Via Chrome DevTools MCP:

```
mcp__chrome-devtools__navigate_page → url: http://localhost:3000/__canvas-test
mcp__chrome-devtools__take_screenshot
```

Expected:
- Same canvas as Task 6
- New `+ Add node` button in the top-right of the canvas

- [ ] **Step 5: Test add-node interaction**

Click the `+ Add node` button (via Chrome DevTools MCP `click` tool), confirm picker opens, click a service (e.g., Slack), confirm a new Slack action node appears in the canvas at the viewport center. Take another screenshot to confirm.

```
mcp__chrome-devtools__click → on the "Add node" button
mcp__chrome-devtools__take_screenshot   (picker visible)
mcp__chrome-devtools__click → on "Slack" in the picker
mcp__chrome-devtools__take_screenshot   (new Slack node visible)
```

Also test:
- Picker search filters the list
- "Sticky note" section adds a sticky in the chosen color

- [ ] **Step 6: Commit**

```bash
git add components/n8n/workflow-canvas/add-node-toolbar.tsx components/n8n/workflow-canvas/workflow-canvas.tsx
git commit -m "✨ Wire AddNodeToolbar into WorkflowCanvas"
```

---

## Task 9: Create demo prototype

**Files:**
- Create: `app/prototypes/giulio/workflow-canvas-demo/page.tsx`
- Create: `app/prototypes/giulio/workflow-canvas-demo/metadata.json`

- [ ] **Step 1: Create `metadata.json`**

```json
{
  "title": "Workflow Canvas Demo",
  "description": "Showcase of the embeddable WorkflowCanvas component (React Flow + n8n styling).",
  "author": "giulio",
  "date": "2026-05-04",
  "externalUrl": null,
  "featured": false,
  "template": false
}
```

- [ ] **Step 2: Create `page.tsx`**

```tsx
'use client'

import {
  WorkflowCanvas,
  type WorkflowCanvasNode,
  type WorkflowCanvasEdge,
} from '@/components/n8n/workflow-canvas'

const initialNodes: WorkflowCanvasNode[] = [
  { id: 't1', type: 'trigger', service: 'webhook', label: 'Webhook',          sublabel: 'GET',
    position: { x:   0, y: 200 } },
  { id: 't2', type: 'trigger', service: 'clock',   label: 'When chat received',
    position: { x:   0, y: 360 } },
  { id: 'a1', type: 'action',  service: 'ai',      label: 'AI Agent',
    position: { x: 280, y: 280 } },
  { id: 'a2', type: 'action',  service: 'http',    label: 'HTTP Request',     sublabel: 'GET',
    position: { x: 540, y: 280 } },
  { id: 'a3', type: 'action',  service: 'gmail',   label: 'Send Email',
    position: { x: 800, y: 280 } },
  { id: 's1', type: 'sticky',  color: 'yellow',
    text: 'This demo shows the embeddable WorkflowCanvas component. Drag nodes, connect them, delete, or add new ones with the toolbar.',
    position: { x: 0, y: 0 }, width: 360, height: 110 },
]

const initialEdges: WorkflowCanvasEdge[] = [
  { id: 'e1', source: 't1', target: 'a1' },
  { id: 'e2', source: 't2', target: 'a1' },
  { id: 'e3', source: 'a1', target: 'a2' },
  { id: 'e4', source: 'a2', target: 'a3' },
]

export default function WorkflowCanvasDemo() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <WorkflowCanvas initialNodes={initialNodes} initialEdges={initialEdges} />
    </div>
  )
}
```

- [ ] **Step 3: Visual verification**

```
mcp__chrome-devtools__navigate_page → url: http://localhost:3000/prototypes/giulio/workflow-canvas-demo
mcp__chrome-devtools__take_screenshot
```

Expected: 6 nodes laid out, 4 edges, sticky note visible, `+ Add node` button top-right, zoom controls bottom-left.

Verify on the playground homepage that the prototype card now appears:

```
mcp__chrome-devtools__navigate_page → url: http://localhost:3000
mcp__chrome-devtools__take_screenshot
```

Expected: a "Workflow Canvas Demo" card under giulio's prototypes.

- [ ] **Step 4: Run lint**

```bash
pnpm lint
```

Expected: no errors. Fix any reported issues.

- [ ] **Step 5: Commit**

```bash
git add app/prototypes/giulio/workflow-canvas-demo/
git commit -m "✨ Add workflow-canvas-demo prototype showcasing WorkflowCanvas"
```

---

## Task 10: Cleanup, lint, build verification, and visual polish

**Files:**
- Delete: `app/canvas-test/page.tsx` (the throwaway test page from Task 6)

- [ ] **Step 1: Delete the throwaway test page**

```bash
rm -rf app/canvas-test
```

- [ ] **Step 2: Run lint and type-check**

```bash
pnpm lint
pnpm tsc --noEmit
```

Expected: both pass with no errors.

- [ ] **Step 3: Run a production build**

```bash
pnpm build
```

Expected: build succeeds. If it fails, investigate (common: missing `'use client'`, server-only imports in client code, mismatched types).

- [ ] **Step 4: Final visual check against Figma**

Open the demo prototype and the Figma reference side-by-side:

```
mcp__chrome-devtools__navigate_page → url: http://localhost:3000/prototypes/giulio/workflow-canvas-demo
mcp__chrome-devtools__take_screenshot
```

Compare to Figma node `120:2677`. Verify:
- Trigger nodes have the leaf shape + lightning-bolt accent
- Action nodes are rounded squares with centered service icon and label below
- Connections are smooth bezier curves in light gray
- Sticky note has the right yellow color and soft shadow
- Background grid is dotted, light gray
- Top-right `+ Add node` button is visible
- Bottom-left zoom controls are visible

If anything feels off, tweak the relevant node component's styled-jsx and re-screenshot.

- [ ] **Step 5: Commit cleanup**

```bash
git add -A
git commit -m "🗑️ Remove throwaway canvas test page"
```

- [ ] **Step 6: Verify final state**

```bash
git log --oneline -10
```

Expected: a clean sequence of commits, one per task, all on `main`.

---

## Self-review notes

**Spec coverage:**
- Public API → Task 6 + Task 9 demo
- File structure → Tasks 2–8
- Three node types (action, trigger, sticky) → Tasks 3, 4, 5
- Pan/zoom/drag/connect/delete → Task 6 (built into React Flow + `deleteKeyCode`)
- Add-node toolbar + picker → Tasks 7, 8
- Service catalog reusing `service-icon.tsx` → Task 2 (catalog), Tasks 3 + 4 (icon usage)
- Dotted background, smooth bezier edges, bottom-left zoom controls → Task 6
- Demo prototype → Task 9

**Out of scope (per spec, intentionally not in plan):**
- Persistence / `onChange`
- AI sub-handles
- Mid-line `+` insert buttons
- Right-click context menus
- Undo/redo
- n8n JSON import
- Custom plug-in node types

**Known fragility:**
- The `<AddNodeToolbar />` cross-task reference in Task 6 is awkward. Mitigation: comment it out in Task 6, uncomment in Task 8.
- Color tokens (`--color--orange-500`, `--color--neutral-50`, etc.) are referenced with fallback values inline (e.g., `var(--color--neutral-50, #fafafa)`) so the components don't break if a token name doesn't exist exactly. The fallbacks should be revisited against `app/tokens.scss` during Task 10's polish step.
