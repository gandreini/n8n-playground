# Workflow Canvas — design spec

**Status**: Approved (2026-05-04)
**Author**: giulio
**Stack**: Next.js 16, React 19, TypeScript, React Flow (`@xyflow/react`), styled-jsx

## Goal

Add a flexible, embeddable workflow visualization component that any prototype in `n8n-playground` can drop in to display and edit an n8n-style workflow. Built on top of React Flow. Fully editable in-memory — no persistence.

## Non-goals

- Persisting workflow state to disk or remote
- Replacing the existing handmade `components/n8n/screens/workflow-editor.tsx` (it stays as-is for now)
- AI sub-node branches (Memory / Output Parser / Chat Model sub-handles)
- Mid-line `+` insert buttons on connections
- Right-click context menus
- Undo/redo, copy/paste
- Validation/warning indicators on nodes
- Importing real n8n workflow JSON exports
- Custom plug-in node types — only the three built-ins ship in v1

## Public API

```tsx
import {
  WorkflowCanvas,
  type WorkflowCanvasNode,
  type WorkflowCanvasEdge,
} from '@/components/n8n/workflow-canvas'

const nodes: WorkflowCanvasNode[] = [
  {
    id: '1',
    type: 'trigger',
    service: 'webhook',
    label: 'Webhook',
    sublabel: 'GET',
    position: { x: 0, y: 100 },
  },
  {
    id: '2',
    type: 'action',
    service: 'openai',
    label: 'AI Agent',
    position: { x: 240, y: 100 },
  },
  {
    id: '3',
    type: 'sticky',
    color: 'yellow',
    text: 'Annotation here',
    position: { x: 0, y: -120 },
    width: 220,
    height: 100,
  },
]

const edges: WorkflowCanvasEdge[] = [
  { id: 'e1', source: '1', target: '2' },
]

<WorkflowCanvas initialNodes={nodes} initialEdges={edges} />
```

The component is **uncontrolled**: `initialNodes` / `initialEdges` seed internal state, then user edits live in component state. There is no `onChange` prop and no persistence in v1.

## Type definitions

```ts
// types.ts (sketch)

export type ServiceId = string // matches keys in service-catalog.ts

export type WorkflowCanvasNode =
  | ActionNodeData
  | TriggerNodeData
  | StickyNodeData

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

export interface StickyNodeData extends BaseNodeData {
  type: 'sticky'
  text: string
  color: 'yellow' | 'blue' | 'green' | 'pink'
  width: number
  height: number
}

export interface WorkflowCanvasEdge {
  id: string
  source: string
  target: string
}
```

## File structure

```
components/n8n/workflow-canvas/
├── index.ts                # public re-exports
├── workflow-canvas.tsx     # ReactFlowProvider + ReactFlow wrapper, internal state
├── add-node-toolbar.tsx    # top-right "+ Add node" button
├── node-picker.tsx         # popover with service grid + search
├── service-catalog.ts      # service id → { label, icon, color }
├── types.ts                # all exported types
└── nodes/
    ├── action-node.tsx
    ├── trigger-node.tsx
    └── sticky-node.tsx
```

The `service-catalog.ts` file reuses (or extends) the existing `components/n8n/shared/service-icon.tsx` mapping so we have one source of truth for service icons + colors.

## Behavior

| Interaction | Behavior |
|---|---|
| Pan | Click + drag empty canvas |
| Zoom | Mouse wheel, or `<Controls />` buttons |
| Move node | Click + drag a node |
| Connect | Drag from a node's output handle to another node's input handle |
| Select | Click a node or edge |
| Delete | `Backspace` or `Delete` key removes selected nodes/edges |
| Add node | Click `+ Add node` toolbar button → picker opens → click a service → node lands at viewport center |
| Resize sticky | Drag corner handle (React Flow `NodeResizer`) |

Bottom-left zoom controls come from React Flow's `<Controls />` component (free).

## Visual design

Reference: Figma node `120:2677` ("Daily weather report").

- **Background**: light gray dotted grid via `<Background variant="dots" />`
- **Connections**: smooth bezier curves, light neutral gray (`var(--color--neutral-300)` or similar)
- **Action node**: ~80×80 rounded square, white background (`var(--color--neutral-0)`), 1px neutral-200 border, service icon centered, label below the box, optional sublabel under label
- **Trigger node**: same shape and dimensions, plus a small lightning-bolt accent in the top-left corner. Visually distinct from action nodes
- **Sticky note**: colored rectangle, soft shadow, text inside, resizable. Four colors: yellow / blue / green / pink

All node components use `styled-jsx` and n8n design tokens from `globals.css`. No Tailwind utility classes. No hardcoded hex values when a token exists.

## Add-node picker UX

- The toolbar button sits in the top-right of the canvas area
- Clicking it opens a popover (anchored to the button) containing:
  - A search input at the top
  - A grid of services from the catalog (icon + name)
  - A separate "Add sticky note" entry at the bottom
- Selecting a service:
  - Action / trigger types: spawned at the current viewport center, type inferred from the service catalog (some services are triggers, some are actions; v1 keeps it simple — the picker has two tabs or sections: "Triggers" and "Actions")
  - Sticky: spawned at viewport center with default size 220×120

## Demo

To prove the API is usable, the implementation step will create one tiny demo prototype (or extend an existing one) showing 4–5 nodes wired up. This serves as the working example designers reference.

## Dependencies to add

- `@xyflow/react` (the modern React Flow package; replaces the legacy `reactflow` package name)

No other deps needed.

## Open implementation questions

These get answered during implementation, not now:

- Exact service catalog contents — start with whatever `service-icon.tsx` already supports
- Picker popover library — likely the existing shadcn `Popover` component
- Whether to use React Flow's `useNodesState` / `useEdgesState` hooks vs a Zustand store internal to the component (default: the React Flow hooks; smaller footprint)
